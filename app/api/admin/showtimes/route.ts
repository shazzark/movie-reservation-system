import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { withDb } from "@/lib/routeHandler";
import { withAdmin } from "@/lib/adminHandler";
import { MovieModel } from "@/models/movie";
import { TheaterModel } from "@/models/theater";
import { ShowtimeModel } from "@/models/showtime";
import { theaterSeatCapacity, validateNewShowtimeDate } from "@/lib/admin-cms-rules";

const createSchema = z.object({
  movieId: z.string().refine((value) => mongoose.Types.ObjectId.isValid(value)),
  theaterId: z.string().min(1),
  startTime: z.coerce.date(),
  price: z.number().positive().max(1000000),
  format: z.string().trim().min(1).max(40),
}).strict();

export const GET = withDb(withAdmin(async () => {
  const showtimes = await ShowtimeModel.find().sort({ startTime: -1 }).lean();
  const [movies, theaters] = await Promise.all([
    MovieModel.find({ _id: { $in: showtimes.map((item) => item.movieId) } }).select("title isActive posterUrl").lean(),
    TheaterModel.find({ _id: { $in: showtimes.map((item) => item.theaterId) } }).select("name location rows seatsPerRow totalSeats").lean(),
  ]);
  const movieMap = new Map(movies.map((movie) => [String(movie._id), movie]));
  const theaterMap = new Map(theaters.map((theater) => [String(theater._id), theater]));
  return NextResponse.json(showtimes.map((item) => ({
    ...item,
    _id: String(item._id),
    movie: movieMap.get(String(item.movieId)) ?? null,
    theater: theaterMap.get(String(item.theaterId)) ?? null,
    bookedCount: item.bookedSeats.length,
  })));
}));

export const POST = withDb(withAdmin(async (req: NextRequest) => {
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues.map((issue) => issue.message).join(" ") }, { status: 400 });
  try { validateNewShowtimeDate(parsed.data.startTime); } catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 400 }); }
  const [movie, theater] = await Promise.all([
    MovieModel.findById(parsed.data.movieId).select("isActive"),
    TheaterModel.findById(parsed.data.theaterId),
  ]);
  if (!movie || !movie.isActive) return NextResponse.json({ error: "Choose an existing active movie." }, { status: 400 });
  if (!theater) return NextResponse.json({ error: "Choose an existing theater." }, { status: 400 });
  const showtime = await ShowtimeModel.create({
    ...parsed.data,
    totalSeats: theaterSeatCapacity(theater.rows, theater.seatsPerRow),
    bookedSeats: [],
  });
  return NextResponse.json(showtime, { status: 201 });
}));
