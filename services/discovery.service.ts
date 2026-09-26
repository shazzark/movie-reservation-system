import { BookingError, calculateTotalPrice, validateSeatLayout, validateSeats } from "@/lib/booking-rules";
import { MovieModel } from "@/models/movie";
import { ShowtimeModel } from "@/models/showtime";
import { TheaterModel } from "@/models/theater";
import type { DiscoveryMovie, DiscoveryShowtime } from "@/types/discovery";

async function loadUpcomingShowtimes(movieIds: string[]): Promise<DiscoveryShowtime[]> {
  if (movieIds.length === 0) return [];
  const showtimes = await ShowtimeModel.find({
    movieId: { $in: movieIds },
    startTime: { $gt: new Date() },
  }).sort({ startTime: 1 }).lean();
  const theaters = await TheaterModel.find({
    _id: { $in: showtimes.map((showtime) => showtime.theaterId) },
  }).lean();
  const theaterById = new Map(theaters.map((theater) => [String(theater._id), theater]));

  return showtimes.flatMap((showtime): DiscoveryShowtime[] => {
    const theater = theaterById.get(String(showtime.theaterId));
    if (!theater) return [];
    try {
      validateSeatLayout(theater, showtime.totalSeats);
      calculateTotalPrice(showtime.price, 1);
      if (showtime.bookedSeats?.length) validateSeats(showtime.bookedSeats, theater);
    } catch (error) {
      if (error instanceof BookingError) return [];
      throw error;
    }

    return [{
      _id: String(showtime._id),
      movieId: String(showtime.movieId),
      theaterId: String(showtime.theaterId),
      startTime: showtime.startTime.toISOString(),
      price: showtime.price,
      format: showtime.format,
      totalSeats: showtime.totalSeats,
      bookedSeats: showtime.bookedSeats ?? [],
      theaterName: theater.name,
      theaterLocation: theater.location,
      availableSeats: showtime.totalSeats - (showtime.bookedSeats?.length ?? 0),
    }];
  });
}

export async function getDiscoveryMovies(): Promise<DiscoveryMovie[]> {
  const movies = await MovieModel.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  const showtimes = await loadUpcomingShowtimes(movies.map((movie) => String(movie._id)));
  const byMovie = new Map<string, DiscoveryShowtime[]>();
  for (const showtime of showtimes) {
    const current = byMovie.get(showtime.movieId) ?? [];
    current.push(showtime);
    byMovie.set(showtime.movieId, current);
  }

  return movies.map((movie) => {
    const upcoming = byMovie.get(String(movie._id)) ?? [];
    return {
      ...movie,
      _id: String(movie._id),
      upcomingShowtimeCount: upcoming.length,
      availableShowtimeCount: upcoming.filter((showtime) => showtime.availableSeats > 0).length,
      nextShowtimeAt: upcoming[0]?.startTime ? String(upcoming[0].startTime) : null,
    };
  });
}

export async function getUpcomingShowtimesForMovie(movieId: string): Promise<DiscoveryShowtime[]> {
  const active = await MovieModel.exists({ _id: movieId, isActive: true });
  return active ? loadUpcomingShowtimes([movieId]) : [];
}
