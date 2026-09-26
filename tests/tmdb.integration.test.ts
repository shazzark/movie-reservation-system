import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import { getTmdbMovie, searchTmdbMovies } from "@/services/tmdb.service";
import { createMovie, DuplicateTmdbMovieError, updateMovie } from "@/services/movie.service";
import { getDiscoveryMovies, getUpcomingShowtimesForMovie } from "@/services/discovery.service";
import { bookingService } from "@/services/booking.service";
import { MovieModel } from "@/models/movie";
import { BookingModel } from "@/models/booking";
import { TheaterModel } from "@/models/theater";
import { ShowtimeModel } from "@/models/showtime";

test("mocked TMDB import persists to MongoDB and supports CineBook discovery and reservations", { timeout: 120_000 }, async (t) => {
  const uri = process.env.DATABASE_URL;
  if (!uri) throw new Error("DATABASE_URL is required for integration tests");
  const dbName = `cinebook_p7_${randomUUID().replaceAll("-", "").slice(0, 20)}`;
  const originalToken = process.env.TMDB_API_TOKEN;
  process.env.TMDB_API_TOKEN = "integration-test-placeholder";
  const fixture = {
    id: 424242, title: "TMDB integration fixture", overview: "Offline metadata with a real database.",
    genres: [{ name: "Drama" }], runtime: 100, vote_average: 7,
    poster_path: "/fixture.jpg", backdrop_path: "/backdrop.jpg", release_date: "2020-01-02",
    credits: { crew: [{ job: "Director", name: "Fixture Director" }], cast: [{ name: "Fixture Actor" }] },
  };
  t.mock.method(globalThis, "fetch", async (url: string | URL | Request) => {
    const parsed = new URL(String(url));
    assert.equal(parsed.origin, "https://api.themoviedb.org");
    if (parsed.pathname === "/3/search/movie") return Response.json({ results: [fixture] });
    assert.equal(parsed.pathname, `/3/movie/${fixture.id}`);
    return Response.json(fixture);
  });

  try {
    await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 10_000 });
    assert.equal(mongoose.connection.db?.databaseName, dbName);
    await MovieModel.init(); // Exercise the real unique sparse index, including races.
    await BookingModel.createCollection();
    const [result] = await searchTmdbMovies("fixture");
    const draft = await getTmdbMovie(result.tmdbId);
    const input = { ...draft, duration: draft.duration!, title: "Reviewed movie title", seatsAvailable: 0, isActive: true };
    const attempts = await Promise.allSettled([createMovie(input), createMovie(input)]);
    assert.equal(attempts.filter((attempt) => attempt.status === "fulfilled").length, 1);
    const rejected = attempts.find((attempt) => attempt.status === "rejected");
    assert.ok(rejected?.status === "rejected" && rejected.reason instanceof DuplicateTmdbMovieError);
    const movie = await MovieModel.findOne({ tmdbId: fixture.id });
    assert.ok(movie);
    assert.equal(await MovieModel.countDocuments({ tmdbId: fixture.id }), 1);
    assert.equal(movie.title, "Reviewed movie title");
    assert.equal(movie.backdropUrl, "https://image.tmdb.org/t/p/w1280/backdrop.jpg");
    assert.notEqual(String(movie._id), String(fixture.id));
    await assert.rejects(() => createMovie(input), DuplicateTmdbMovieError);

    const { tmdbId: _externalId, ...manual } = input;
    void _externalId;
    await createMovie({ ...manual, title: "Manual one", backdropUrl: "" });
    await createMovie({ ...manual, title: "Manual two", backdropUrl: "" });
    assert.equal(await MovieModel.countDocuments({ tmdbId: { $exists: false } }), 2);
    await updateMovie(String(movie._id), { backdropUrl: "" });
    assert.equal((await MovieModel.findById(movie._id)).backdropUrl, "");
    await updateMovie(String(movie._id), { backdropUrl: draft.backdropUrl });

    const theater = await TheaterModel.create({
      _id: new mongoose.Types.ObjectId().toString(), name: "Phase 7 test theater", location: "Test only",
      rows: 2, seatsPerRow: 3, totalSeats: 6,
    });
    const showtime = await ShowtimeModel.create({
      movieId: movie._id, theaterId: theater._id, startTime: new Date(Date.now() + 86_400_000),
      price: 15, totalSeats: 6, bookedSeats: [],
    });
    const discovered = (await getDiscoveryMovies()).find((item) => item._id === String(movie._id));
    assert.ok(discovered);
    assert.equal(discovered.title, input.title);
    assert.equal(discovered.tmdbId, fixture.id);
    assert.equal(discovered.availableShowtimeCount, 1);
    const [screening] = await getUpcomingShowtimesForMovie(String(movie._id));
    assert.equal(screening._id, String(showtime._id));
    assert.equal(screening.availableSeats, 6);
    const customer = { id: new mongoose.Types.ObjectId().toString(), role: "user" as const };
    const reservation = await bookingService.create({ showtimeId: screening._id, seats: ["A1"] }, customer);
    assert.equal(reservation.movieId, String(movie._id));
    assert.equal(reservation.totalPrice, 15);
    assert.equal((await getUpcomingShowtimesForMovie(String(movie._id)))[0].availableSeats, 5);
    await bookingService.cancel(reservation._id, customer);
    assert.equal((await getUpcomingShowtimesForMovie(String(movie._id)))[0].availableSeats, 6);
  } finally {
    if (originalToken === undefined) delete process.env.TMDB_API_TOKEN;
    else process.env.TMDB_API_TOKEN = originalToken;
    try {
      if (mongoose.connection.db?.databaseName === dbName) await mongoose.connection.dropDatabase();
    } finally {
      await mongoose.disconnect();
    }
  }
});
