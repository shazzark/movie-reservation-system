import { useQuery } from "@tanstack/react-query";
import api from "../api";
// ✅ Remove imports from mockData
import type { Showtime } from "../../types/showtime";

export const useShowtimesByMovie = (movieId: string | undefined) => {
  return useQuery<Showtime[], Error>({
    queryKey: ["showtimes", movieId],
    queryFn: async () => {
      if (!movieId) return [];

      // ✅ Fetch from your real API route
      const response = await fetch(`/api/showtimes?movieId=${movieId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch showtimes");
      }

      return response.json();
    },
    enabled: !!movieId,
  });
};

// export const useShowtimeDetails = (showtimeId: string | undefined) => {
//   return useQuery<
//     { showtime: Showtime; theaterName: string } | undefined,
//     Error
//   >({
//     queryKey: ["showtimes", showtimeId],
//     queryFn: async () => {
//       if (!showtimeId) return undefined;

//       // ✅ Fetch from your real API route (assuming you have a GET /api/showtimes/[id] route)
//       const response = await fetch(`/api/showtimes/${showtimeId}`);

//       if (!response.ok) {
//         throw new Error("Failed to fetch showtime details");
//       }

//       return response.json();
//     },
//     enabled: !!showtimeId,
//   });
// };

export const useShowtimeDetails = (showtimeId: string | undefined) => {
  return useQuery({
    queryKey: ["showtime", showtimeId],
    queryFn: () => {
      if (!showtimeId) throw new Error("No showtime ID");
      return api.showtimes.getById(showtimeId);
    },
    enabled: !!showtimeId,
  });
};
