import { useQuery } from "@tanstack/react-query";
import type { Movie } from "../../types/movie";
import type { DiscoveryMovie } from "@/types/discovery";

export const useDiscoveryMovies = () => useQuery<DiscoveryMovie[], Error>({
  queryKey: ["discovery-movies"],
  queryFn: async () => {
    const response = await fetch("/api/movies?discovery=1");
    if (!response.ok) throw new Error("Could not load the movie lineup");
    return response.json();
  },
  staleTime: 30_000,
});

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
    queryKey: ["movies", movieId],
    queryFn: async () => {
      if (!movieId) throw new Error("Movie ID is required");

      const response = await fetch(`/api/movies/${movieId}`);

      if (!response.ok) {
        throw new Error(response.status === 404 ? "Movie not found" : "Could not load this movie");
      }

      return response.json();
    },
    enabled: !!movieId,
  });
};
