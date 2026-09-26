import { NextResponse } from "next/server";
import { withDb } from "@/lib/routeHandler";
import { withAdmin } from "@/lib/adminHandler";
import { MovieModel } from "@/models/movie";
import { ShowtimeModel } from "@/models/showtime";
import { BookingModel } from "@/models/booking";
import { TheaterModel } from "@/models/theater";
import { User } from "@/models/user";

export const GET = withDb(withAdmin(async () => {
  const now = new Date();
  const [activeMovies, upcomingShowtimes, users, theaters, upcomingReservations, reservedSeats, nextShowtimes] = await Promise.all([
    MovieModel.countDocuments({ isActive: true }),
    ShowtimeModel.countDocuments({ startTime: { $gt: now } }),
    User.countDocuments(),
    TheaterModel.countDocuments(),
    BookingModel.aggregate([
      { $match: { status: "confirmed" } },
      { $lookup: { from: "showtimes", localField: "showtimeId", foreignField: "_id", as: "showtime" } },
      { $unwind: "$showtime" },
      { $match: { "showtime.startTime": { $gt: now } } },
      { $count: "count" },
    ]),
    BookingModel.aggregate([
      { $match: { status: "confirmed" } },
      { $lookup: { from: "showtimes", localField: "showtimeId", foreignField: "_id", as: "showtime" } },
      { $unwind: "$showtime" },
      { $match: { "showtime.startTime": { $gt: now } } },
      { $project: { seatCount: { $size: "$seats" } } },
      { $group: { _id: null, count: { $sum: "$seatCount" } } },
    ]),
    ShowtimeModel.aggregate([
      { $match: { startTime: { $gt: now } } },
      { $sort: { startTime: 1 } },
      { $limit: 6 },
      { $lookup: { from: "movies", localField: "movieId", foreignField: "_id", as: "movie" } },
      { $unwind: "$movie" },
      { $lookup: { from: "theaters", localField: "theaterId", foreignField: "_id", as: "theater" } },
      { $unwind: "$theater" },
      { $project: { _id: 1, startTime: 1, price: 1, movieTitle: "$movie.title", theaterName: "$theater.name", bookedCount: { $size: "$bookedSeats" }, totalSeats: 1 } },
    ]),
  ]);
  return NextResponse.json({
    activeMovies,
    upcomingShowtimes,
    users,
    theaters,
    upcomingReservations: upcomingReservations[0]?.count ?? 0,
    reservedSeats: reservedSeats[0]?.count ?? 0,
    nextShowtimes,
  });
}));
