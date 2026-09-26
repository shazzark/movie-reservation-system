import { useQuery } from "@tanstack/react-query";
import api from "../api";
import type { DiscoveryShowtime } from "@/types/discovery";

export const useShowtimesByMovie = (movieId: string | undefined) =>
  useQuery<DiscoveryShowtime[], Error>({
    queryKey: ["showtimes", movieId],
    queryFn: async () => {
      if (!movieId) return [];
      const response = await fetch(`/api/showtimes?movieId=${encodeURIComponent(movieId)}`);
      if (!response.ok) throw new Error("Could not load showtimes");
      return response.json();
    },
    enabled: Boolean(movieId),
    staleTime: 30_000,
  });

export const useShowtimeDetails = (showtimeId: string | undefined) =>
  useQuery({
    queryKey: ["showtime", showtimeId],
    queryFn: () => {
      if (!showtimeId) throw new Error("No showtime ID");
      return api.showtimes.getById(showtimeId);
    },
    enabled: Boolean(showtimeId),
  });
