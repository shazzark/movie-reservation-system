import { useQuery } from "@tanstack/react-query";
import type { Movie } from "../../types/movie";

export const useMovies = () => {
  return useQuery<Movie[], Error>({
    queryKey: ["movies"],
    queryFn: async () => {
      const response = await fetch("/api/movies");
      if (!response.ok) throw new Error("Failed to fetch movies");
      return response.json();
    },
  });
};

export const useMovieById = (movieId: string | undefined) => {
  return useQuery<Movie, Error>({
    queryKey: ["movies", movieId], // Keeps the key structure consistent
    queryFn: async () => {
      if (!movieId) throw new Error("Movie ID is required");

      const response = await fetch(`/api/movies/${movieId}`);

      if (!response.ok) {
        throw new Error("Movie not found in database");
      }

      return response.json();
    },
    enabled: !!movieId,
  });
};
