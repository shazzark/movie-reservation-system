import type { Movie } from "./movie";
import type { Showtime } from "./showtime";

export type DiscoveryMovie = Movie & {
  upcomingShowtimeCount: number;
  availableShowtimeCount: number;
  nextShowtimeAt: string | null;
};

export type DiscoveryShowtime = Showtime & {
  theaterName: string;
  theaterLocation: string;
  availableSeats: number;
};
