import { MovieModel } from "../models/movie";
import { MovieInput } from "../types/movie";

// CREATE
export async function createMovie(data: MovieInput) {
  return await MovieModel.create(data);
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
