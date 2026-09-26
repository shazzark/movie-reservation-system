import { mapTmdbMovieDetails, mapTmdbSearchResponse } from "../lib/tmdb-metadata";
import type { TmdbMovieDraft, TmdbSearchResult } from "../types/tmdb";

export class TmdbServiceError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "TmdbServiceError";
  }
}

const TMDB_API_BASE = "https://api.themoviedb.org/3";
const REQUEST_TIMEOUT_MS = 8_000;

async function request(path: string): Promise<unknown> {
  const token = process.env.TMDB_API_TOKEN?.trim();
  if (!token) throw new TmdbServiceError("TMDB import is not configured. Set TMDB_API_TOKEN to your API Read Access Token in the server environment (.env.local for local development), then restart Next.js.", 503);

  let response: Response;
  try {
    response = await fetch(`${TMDB_API_BASE}${path}`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new TmdbServiceError("TMDB took too long to respond. Please try again.", 504);
    }
    throw new TmdbServiceError("TMDB is temporarily unavailable. Please try again.", 502);
  }

  if (!response.ok) {
    if (response.status === 404) throw new TmdbServiceError("That movie was not found on TMDB.", 404);
    if (response.status === 401 || response.status === 403) throw new TmdbServiceError("TMDB credentials could not be accepted. Check the server configuration.", 503);
    if (response.status === 429) throw new TmdbServiceError("TMDB is rate limiting requests. Please wait and try again.", 503);
    throw new TmdbServiceError("TMDB is temporarily unavailable. Please try again.", 502);
  }

  try {
    return await response.json();
  } catch {
    throw new TmdbServiceError("TMDB returned an unexpected response. Please try again later.", 502);
  }
}

export async function searchTmdbMovies(query: string): Promise<TmdbSearchResult[]> {
  const params = new URLSearchParams({ query, include_adult: "false", language: "en-US", page: "1" });
  try {
    return mapTmdbSearchResponse(await request(`/search/movie?${params.toString()}`));
  } catch (error) {
    if (error instanceof Error && error.name === "InvalidTmdbResponseError") throw new TmdbServiceError(error.message, 502);
    throw error;
  }
}

export async function getTmdbMovie(id: number): Promise<Omit<TmdbMovieDraft, "alreadyImported">> {
  const params = new URLSearchParams({ language: "en-US", append_to_response: "credits" });
  try {
    return mapTmdbMovieDetails(await request(`/movie/${id}?${params.toString()}`), id);
  } catch (error) {
    if (error instanceof Error && error.name === "InvalidTmdbResponseError") throw new TmdbServiceError(error.message, 502);
    throw error;
  }
}
