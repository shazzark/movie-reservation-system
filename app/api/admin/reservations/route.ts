import { NextResponse } from "next/server";
import { withDb } from "@/lib/routeHandler";
import { withAdmin } from "@/lib/adminHandler";
import { BookingModel } from "@/models/booking";
import { MovieModel } from "@/models/movie";
import { ShowtimeModel } from "@/models/showtime";
import { TheaterModel } from "@/models/theater";
import { User } from "@/models/user";

export const GET = withDb(withAdmin(async () => {
  const bookings = await BookingModel.find().sort({ bookingDate: -1 }).lean();
  const [movies, showtimes, theaters, users] = await Promise.all([
    MovieModel.find({ _id: { $in: bookings.map((booking) => booking.movieId) } }).select("title posterUrl").lean(),
    ShowtimeModel.find({ _id: { $in: bookings.map((booking) => booking.showtimeId) } }).select("startTime format").lean(),
    TheaterModel.find({ _id: { $in: bookings.map((booking) => booking.theaterId) } }).select("name location").lean(),
    User.find({ _id: { $in: bookings.map((booking) => booking.userId) } }).select("name email").lean(),
  ]);
  const movieMap = new Map(movies.map((movie) => [String(movie._id), movie]));
  const showtimeMap = new Map(showtimes.map((showtime) => [String(showtime._id), showtime]));
  const theaterMap = new Map(theaters.map((theater) => [String(theater._id), theater]));
  const userMap = new Map(users.map((user) => [String(user._id), user]));
  return NextResponse.json(bookings.map((booking) => ({
    _id: String(booking._id),
    seats: booking.seats,
    totalPrice: booking.totalPrice,
    status: booking.status,
    bookingDate: booking.bookingDate,
    movie: movieMap.get(String(booking.movieId)) ?? null,
    showtime: showtimeMap.get(String(booking.showtimeId)) ?? null,
    theater: theaterMap.get(String(booking.theaterId)) ?? null,
    customer: userMap.get(String(booking.userId)) ?? { name: "Account unavailable", email: "" },
  })));
}));
