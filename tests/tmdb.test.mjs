import test, { beforeEach, afterEach, after } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

// tsx loads the real TypeScript handlers. Only session/configuration and database
// connectivity are replaced; the admin guard, validators and services run normally.
const load = createRequire(import.meta.url);
let session;
let dbCalls;
let dbFailure;
const replacements = new Map();
function replaceModule(name, exports) {
  const id = load.resolve(name);
  replacements.set(id, load.cache[id]);
  load.cache[id] = { id, filename: id, loaded: true, exports };
}
replaceModule("next-auth", { getServerSession: async () => session });
replaceModule("../lib/auth.ts", { authOptions: {} });
replaceModule("../lib/db.ts", { __esModule: true, default: async () => {
  dbCalls++;
  if (dbFailure) throw new Error("Test database unavailable");
} });

const { NextRequest } = load("next/server");
const metadata = load("../lib/tmdb-metadata.ts");
const service = load("../services/tmdb.service.ts");
const { MovieModel } = load("../models/movie.ts");
const movies = load("../services/movie.service.ts");
const searchRoute = load("../app/api/admin/tmdb/search/route.ts");
const detailsRoute = load("../app/api/admin/tmdb/[id]/route.ts");
const movieRoute = load("../app/api/movies/route.ts");
const movieDetailsRoute = load("../app/api/movies/[id]/route.ts");
const { tmdbApi, ApiRequestError } = load("../lib/api.ts");
const originalToken = process.env.TMDB_API_TOKEN;
const fixture = {
  id: 42, title: " Test Film ", overview: "A test overview.",
  release_date: "2020-05-06", poster_path: "/poster.jpg", backdrop_path: "/backdrop.jpg",
  genres: [{ name: " Drama " }, null], runtime: 110, vote_average: 8.374,
  credits: { crew: [{ job: "Producer", name: "Producer" }, { job: "Director", name: " Director " }],
    cast: Array.from({ length: 10 }, (_, i) => ({ name: `Actor ${i}` })) },
};
const input = {
  ...metadata.mapTmdbMovieDetails(fixture, 42), duration: 110,
  seatsAvailable: 0, isActive: true,
};
const context = (id = "42") => ({ params: Promise.resolve({ id }) });
const request = (path, method = "GET", body) => new NextRequest(`http://localhost/api${path}`, {
  method, ...(body === undefined ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
});

beforeEach((t) => {
  session = { user: { id: "admin-id", role: "admin" } };
  dbCalls = 0;
  dbFailure = false;
  process.env.TMDB_API_TOKEN = "unit-test-placeholder";
  t.mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected upstream request in offline test"); });
});
afterEach(() => {
  if (originalToken === undefined) delete process.env.TMDB_API_TOKEN;
  else process.env.TMDB_API_TOKEN = originalToken;
});
after(() => {
  for (const [id, previous] of replacements) {
    if (previous) load.cache[id] = previous;
    else delete load.cache[id];
  }
});

test("search mapping filters invalid records and handles absent optional metadata", () => {
  const results = metadata.mapTmdbSearchResponse({ results: [fixture, null, { id: -1, title: "Bad" },
    { id: 2 ** 32, title: "Bad" }, { id: 43, original_title: "Fallback" }, { id: 44, title: " " }] });
  assert.deepEqual(results, [
    { tmdbId: 42, title: "Test Film", overview: fixture.overview, releaseDate: fixture.release_date,
      posterUrl: "https://image.tmdb.org/t/p/w500/poster.jpg" },
    { tmdbId: 43, title: "Fallback", overview: "", releaseDate: "", posterUrl: null },
  ]);
  assert.deepEqual(metadata.mapTmdbSearchResponse({ results: [] }), []);
});

test("detail mapping includes credits, bounded cast, runtime and image metadata", () => {
  assert.deepEqual(metadata.mapTmdbMovieDetails(fixture, 42), {
    tmdbId: 42, title: "Test Film", description: fixture.overview, genre: ["Drama"],
    duration: 110, rating: 8.374, posterUrl: "https://image.tmdb.org/t/p/w500/poster.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/backdrop.jpg", releaseDate: "2020-05-06",
    director: "Director", cast: Array.from({ length: 8 }, (_, i) => `Actor ${i}`),
  });
  const missing = metadata.mapTmdbMovieDetails({ id: 42, title: "Minimal", runtime: 0, vote_average: 99 }, 42);
  assert.equal(missing.duration, null);
  assert.equal(missing.rating, 0);
  assert.equal(missing.posterUrl, "");
  assert.equal(missing.backdropUrl, undefined);
  assert.deepEqual(missing.cast, []);
});

test("image URL construction permits TMDB paths and rejects unsafe paths", () => {
  assert.equal(metadata.tmdbPosterUrl("/safe-image.jpg"), "https://image.tmdb.org/t/p/w500/safe-image.jpg");
  assert.equal(metadata.tmdbBackdropUrl("/safe.jpg"), "https://image.tmdb.org/t/p/w1280/safe.jpg");
  for (const path of [null, undefined, 123, "", "https://elsewhere.test/image.jpg", "/../secret", "/x?key=y", "/x#fragment"]) {
    assert.equal(metadata.tmdbPosterUrl(path), null);
    assert.equal(metadata.tmdbBackdropUrl(path), null);
  }
});

test("invalid TMDB IDs and malformed metadata are rejected", () => {
  for (const id of ["0", "-1", "1.2", "abc", "2147483648", "1/credits"]) assert.equal(metadata.isValidTmdbMovieId(id), false);
  assert.equal(metadata.isValidTmdbMovieId("42"), true);
  for (const payload of [null, [], {}, { results: {} }]) assert.throws(() => metadata.mapTmdbSearchResponse(payload), metadata.InvalidTmdbResponseError);
  for (const payload of [null, {}, { id: 43, title: "Wrong movie" }, { id: 42, title: "" }]) {
    assert.throws(() => metadata.mapTmdbMovieDetails(payload, 42), metadata.InvalidTmdbResponseError);
  }
});

test("missing or blank token fails before contacting TMDB", async () => {
  for (const token of [undefined, "", "   "]) {
    if (token === undefined) delete process.env.TMDB_API_TOKEN;
    else process.env.TMDB_API_TOKEN = token;
    await assert.rejects(() => service.searchTmdbMovies("Test"), { status: 503, message: /TMDB_API_TOKEN.*restart Next.js/ });
    await assert.rejects(() => service.getTmdbMovie(42), { status: 503 });
  }
  assert.equal(fetch.mock.callCount(), 0);
});

test("service sends server bearer auth and encodes search; details request includes credits", async (t) => {
  t.mock.method(globalThis, "fetch", async (url, options) => {
    const parsed = new URL(url);
    assert.equal(parsed.origin, "https://api.themoviedb.org");
    assert.equal(options.headers.Authorization, "Bearer unit-test-placeholder");
    assert.equal(options.cache, "no-store");
    assert.ok(options.signal instanceof AbortSignal);
    if (parsed.pathname.endsWith("/search/movie")) {
      assert.equal(parsed.searchParams.get("query"), "Film & another?");
      assert.equal(parsed.searchParams.get("page"), "1");
      assert.equal(parsed.searchParams.get("include_adult"), "false");
      return Response.json({ results: [fixture] });
    }
    assert.equal(parsed.pathname, "/3/movie/42");
    assert.equal(parsed.searchParams.get("append_to_response"), "credits");
    return Response.json(fixture);
  });
  assert.equal((await service.searchTmdbMovies("Film & another?"))[0].tmdbId, 42);
  assert.equal((await service.getTmdbMovie(42)).director, "Director");
});

test("upstream HTTP, network, timeout and malformed responses return safe errors", async (t) => {
  for (const [upstream, status] of [[401, 503], [403, 503], [404, 404], [429, 503], [500, 502]]) {
    t.mock.method(globalThis, "fetch", async () => new Response("private upstream body", { status: upstream }));
    await assert.rejects(() => service.searchTmdbMovies("Test"), (error) => {
      assert.equal(error.status, status);
      assert.ok(!error.message.includes("private upstream body"));
      assert.ok(!error.message.includes("unit-test-placeholder"));
      return true;
    });
  }
  for (const [error, status] of [[new Error("network failure"), 502], [new DOMException("timeout", "TimeoutError"), 504]]) {
    t.mock.method(globalThis, "fetch", async () => { throw error; });
    await assert.rejects(() => service.getTmdbMovie(42), { status });
  }
  for (const response of [() => new Response("not JSON"), () => Response.json({ results: null })]) {
    t.mock.method(globalThis, "fetch", response);
    await assert.rejects(() => service.searchTmdbMovies("Test"), { status: 502 });
  }
  t.mock.method(globalThis, "fetch", async () => Response.json({ id: 99, title: "Wrong" }));
  await assert.rejects(() => service.getTmdbMovie(42), { status: 502 });
});

test("both TMDB routes reject visitors and non-admin users before upstream or database access", async () => {
  for (const [userSession, status] of [[null, 401], [{ user: { id: "user-id", role: "user" } }, 403], [{ user: { role: "admin" } }, 401]]) {
    session = userSession;
    assert.equal((await searchRoute.GET(request("/admin/tmdb/search?query=Test"), context())).status, status);
    assert.equal((await detailsRoute.GET(request("/admin/tmdb/42"), context())).status, status);
  }
  assert.equal(fetch.mock.callCount(), 0);
  assert.equal(dbCalls, 0);
});

test("admin routes validate query and ID, and report missing configuration", async () => {
  for (const query of ["", "x", "a".repeat(121)]) {
    assert.equal((await searchRoute.GET(request(`/admin/tmdb/search?query=${query}`), context())).status, 400);
  }
  assert.equal((await detailsRoute.GET(request("/admin/tmdb/nope"), context("nope"))).status, 400);
  delete process.env.TMDB_API_TOKEN;
  for (const response of [await searchRoute.GET(request("/admin/tmdb/search?query=Test"), context()), await detailsRoute.GET(request("/admin/tmdb/42"), context())]) {
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /TMDB_API_TOKEN/);
  }
  assert.equal(fetch.mock.callCount(), 0);
  assert.equal(dbCalls, 0);
});

test("admin search and details mark previously imported movies", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => Response.json(url.includes("/search/") ? { results: [fixture, { id: 43, title: "Other" }] } : fixture));
  t.mock.method(MovieModel, "find", (filter) => {
    assert.deepEqual(filter, { tmdbId: { $in: [42, 43] } });
    return { select: () => ({ lean: async () => [{ tmdbId: 42 }] }) };
  });
  t.mock.method(MovieModel, "exists", async () => ({ _id: "cinebook-id" }));
  const search = await searchRoute.GET(request("/admin/tmdb/search?query=Test"), context());
  assert.equal(search.status, 200);
  const results = await search.json();
  assert.equal(results[0].alreadyImported, true);
  assert.equal(results[1].alreadyImported, false);
  const details = await detailsRoute.GET(request("/admin/tmdb/42"), context());
  assert.equal(details.status, 200);
  assert.equal((await details.json()).alreadyImported, true);
});

test("routes distinguish upstream failure from CineBook database failure", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response(null, { status: 500 }));
  assert.equal((await searchRoute.GET(request("/admin/tmdb/search?query=Test"), context())).status, 502);
  assert.equal(dbCalls, 0);
  t.mock.method(globalThis, "fetch", async (url) => Response.json(url.includes("/search/") ? { results: [fixture] } : fixture));
  dbFailure = true;
  t.mock.method(console, "error", () => {});
  for (const response of [await searchRoute.GET(request("/admin/tmdb/search?query=Test"), context()), await detailsRoute.GET(request("/admin/tmdb/42"), context())]) {
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /CineBook could not check/);
  }
});

test("client calls CineBook routes and preserves HTTP errors without sending the TMDB token", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push(url);
    assert.equal(options.headers.Authorization, undefined);
    return Response.json(url.includes("search") ? [] : { ...input, alreadyImported: false });
  });
  await tmdbApi.search("Film & another?");
  await tmdbApi.details(42);
  assert.deepEqual(calls, ["/api/admin/tmdb/search?query=Film%20%26%20another%3F", "/api/admin/tmdb/42"]);
  t.mock.method(globalThis, "fetch", async () => Response.json({ error: "Administrator access required." }, { status: 403 }));
  await assert.rejects(() => tmdbApi.search("Test"), (error) => error instanceof ApiRequestError && error.status === 403);
});

test("duplicate precheck refuses import and unique index handles concurrent duplicate writes", async (t) => {
  t.mock.method(MovieModel, "exists", async () => ({ _id: "existing" }));
  const create = t.mock.method(MovieModel, "create", async () => { throw new Error("Must not create"); });
  await assert.rejects(() => movies.createMovie(input), movies.DuplicateTmdbMovieError);
  assert.equal(create.mock.callCount(), 0);
  t.mock.method(MovieModel, "exists", async () => null);
  for (const key of [{ keyPattern: { tmdbId: 1 } }, { keyValue: { tmdbId: 42 } }]) {
    t.mock.method(MovieModel, "create", async () => { throw { code: 11000, ...key }; });
    await assert.rejects(() => movies.createMovie(input), movies.DuplicateTmdbMovieError);
  }
  const unrelated = new Error("Unrelated database failure");
  t.mock.method(MovieModel, "create", async () => { throw unrelated; });
  await assert.rejects(() => movies.createMovie(input), (error) => error === unrelated);
  assert.ok(MovieModel.schema.indexes().some(([keys, options]) => keys.tmdbId === 1 && options.unique && options.sparse));
});

test("movie POST returns 409 for duplicate TMDB ID including an insert race", async (t) => {
  t.mock.method(MovieModel, "exists", async () => ({ _id: "existing" }));
  let response = await movieRoute.POST(request("/movies", "POST", input), context());
  assert.equal(response.status, 409);
  assert.match((await response.json()).error, /already been imported/);
  t.mock.method(MovieModel, "exists", async () => null);
  t.mock.method(MovieModel, "create", async () => { throw { code: 11000, keyPattern: { tmdbId: 1 } }; });
  response = await movieRoute.POST(request("/movies", "POST", input), context());
  assert.equal(response.status, 409);
});

test("movie import saves reviewed metadata with a CineBook ID; manual creation remains supported", async (t) => {
  t.mock.method(MovieModel, "exists", async () => null);
  t.mock.method(MovieModel, "create", async (data) => ({ ...data, _id: "507f1f77bcf86cd799439011" }));
  for (const data of [input, { ...input, tmdbId: undefined, backdropUrl: "" }]) {
    const response = await movieRoute.POST(request("/movies", "POST", data), context());
    assert.equal(response.status, 201);
    const saved = await response.json();
    assert.equal(saved._id, "507f1f77bcf86cd799439011");
    assert.equal(saved.tmdbId, data.tmdbId);
    assert.equal(saved.title, input.title);
    assert.equal(saved.rating, 8.374);
    assert.equal(saved.backdropUrl, data.backdropUrl);
  }
  session = { user: { id: "normal-user", role: "user" } };
  assert.equal((await movieRoute.POST(request("/movies", "POST", input), context())).status, 403);
});

test("movie edit preserves, replaces and clears backdrop; external ID cannot be reassigned", async (t) => {
  const id = "507f1f77bcf86cd799439011";
  let saved = { ...input, _id: id };
  t.mock.method(MovieModel, "findByIdAndUpdate", async (_id, data) => (saved = { ...saved, ...data }));
  for (const change of [{ title: "Edited" }, { backdropUrl: "https://image.tmdb.org/t/p/w1280/new.jpg" }, { backdropUrl: "" }]) {
    const previous = saved.backdropUrl;
    const response = await movieDetailsRoute.PUT(request(`/movies/${id}`, "PUT", change), context(id));
    assert.equal(response.status, 200);
    const updated = await response.json();
    assert.equal(updated.backdropUrl, change.backdropUrl ?? previous);
    assert.equal(updated.tmdbId, 42);
  }
  for (const change of [{ tmdbId: 43 }, { backdropUrl: "bad-url" }]) {
    assert.equal((await movieDetailsRoute.PUT(request(`/movies/${id}`, "PUT", change), context(id))).status, 400);
  }
});
