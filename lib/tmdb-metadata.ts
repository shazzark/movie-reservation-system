import type { TmdbMovieDraft, TmdbSearchResult } from "../types/tmdb";

type RecordValue = Record<string, unknown>;

export class InvalidTmdbResponseError extends Error {
  constructor() {
    super("TMDB returned an unexpected response. Please try again later.");
    this.name = "InvalidTmdbResponseError";
  }
}

export function isValidTmdbMovieId(value: string): boolean {
  if (!/^\d{1,10}$/.test(value)) return false;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 && id <= 2_147_483_647;
}

function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function tmdbImageUrl(path: unknown, size: "w500" | "w1280"): string | null {
  if (typeof path !== "string" || !/^\/[A-Za-z0-9._/-]+$/.test(path) || path.includes("..")) {
    return null;
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function tmdbPosterUrl(path: unknown): string | null {
  return tmdbImageUrl(path, "w500");
}

export function tmdbBackdropUrl(path: unknown): string | null {
  return tmdbImageUrl(path, "w1280");
}

export function mapTmdbSearchResponse(payload: unknown): TmdbSearchResult[] {
  if (!isRecord(payload) || !Array.isArray(payload.results)) {
    throw new InvalidTmdbResponseError();
  }

  return payload.results.flatMap((raw): TmdbSearchResult[] => {
    if (!isRecord(raw) || !Number.isSafeInteger(raw.id) || (raw.id as number) <= 0 || (raw.id as number) > 2_147_483_647) return [];
    const title = typeof raw.title === "string" ? raw.title : raw.original_title;
    if (typeof title !== "string" || !title.trim()) return [];

    return [{
      tmdbId: raw.id as number,
      title: title.trim(),
      overview: typeof raw.overview === "string" ? raw.overview : "",
      releaseDate: typeof raw.release_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.release_date) ? raw.release_date : "",
      posterUrl: tmdbPosterUrl(raw.poster_path),
    }];
  });
}

export function mapTmdbMovieDetails(payload: unknown, expectedId: number): Omit<TmdbMovieDraft, "alreadyImported"> {
  if (!isRecord(payload) || payload.id !== expectedId) throw new InvalidTmdbResponseError();
  const title = typeof payload.title === "string" ? payload.title : payload.original_title;
  if (typeof title !== "string" || !title.trim()) throw new InvalidTmdbResponseError();

  const genres = Array.isArray(payload.genres)
    ? payload.genres.flatMap((genre) => isRecord(genre) && typeof genre.name === "string" && genre.name.trim() ? [genre.name.trim()] : [])
    : [];
  const credits = isRecord(payload.credits) ? payload.credits : {};
  const crew = Array.isArray(credits.crew) ? credits.crew : [];
  const castItems = Array.isArray(credits.cast) ? credits.cast : [];
  const director = crew.find((person) => isRecord(person) && person.job === "Director" && typeof person.name === "string");
  const cast = castItems.flatMap((person) => isRecord(person) && typeof person.name === "string" && person.name.trim() ? [person.name.trim()] : []).slice(0, 8);
  const runtime = payload.runtime;
  const voteAverage = payload.vote_average;

  return {
    tmdbId: expectedId,
    title: title.trim(),
    description: typeof payload.overview === "string" ? payload.overview : "",
    genre: genres,
    duration: typeof runtime === "number" && Number.isInteger(runtime) && runtime > 0 && runtime <= 600 ? runtime : null,
    rating: typeof voteAverage === "number" && Number.isFinite(voteAverage) && voteAverage >= 0 && voteAverage <= 10 ? voteAverage : 0,
    posterUrl: tmdbPosterUrl(payload.poster_path) ?? "",
    ...(tmdbBackdropUrl(payload.backdrop_path) ? { backdropUrl: tmdbBackdropUrl(payload.backdrop_path)! } : {}),
    releaseDate: typeof payload.release_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(payload.release_date) ? payload.release_date : "",
    director: isRecord(director) && typeof director.name === "string" ? director.name.trim() : "",
    cast,
  };
}
