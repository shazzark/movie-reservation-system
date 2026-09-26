import { MovieModel } from "../models/movie";
import { MovieInput } from "../types/movie";

export class DuplicateTmdbMovieError extends Error {
  constructor() {
    super("This TMDB movie has already been imported into CineBook.");
    this.name = "DuplicateTmdbMovieError";
  }
}

function isTmdbDuplicateKey(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const duplicate = error as { code?: unknown; keyPattern?: Record<string, unknown>; keyValue?: Record<string, unknown> };
  return duplicate.code === 11000 && (duplicate.keyPattern?.tmdbId === 1 || duplicate.keyValue?.tmdbId !== undefined);
}

// CREATE
export async function createMovie(data: MovieInput) {
  if (data.tmdbId !== undefined && await MovieModel.exists({ tmdbId: data.tmdbId })) {
    throw new DuplicateTmdbMovieError();
  }
  try {
    return await MovieModel.create(data);
  } catch (error) {
    if (isTmdbDuplicateKey(error)) throw new DuplicateTmdbMovieError();
    throw error;
  }
}

// READ ALL
export async function getAllMovies() {
  // Usually admins want to see inactive movies too,
  // you might need a query param to toggle this.
  return await MovieModel.find({}).sort({ createdAt: -1 });
}

// READ ONE
export async function getMovieById(id: string) {
  return await MovieModel.findById(id);
}

// UPDATE
export async function updateMovie(id: string, data: Partial<MovieInput>) {
  return await MovieModel.findByIdAndUpdate(id, data, { new: true });
}

// DELETE
export async function deleteMovie(id: string) {
  return await MovieModel.findByIdAndDelete(id);
}
