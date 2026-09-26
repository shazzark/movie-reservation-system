import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { getMovieById, updateMovie, deleteMovie } from "../../../../services/movie.service";
import { withDb } from "../../../../lib/routeHandler";
import { withAdmin } from "../../../../lib/adminHandler";
import { BookingModel } from "@/models/booking";
import { ShowtimeModel } from "@/models/showtime";
import { validateMovieRemoval } from "@/lib/admin-cms-rules";

const patchSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  description: z.string().trim().min(1).max(5000).optional(),
  genre: z.array(z.string().trim().min(1)).min(1).optional(),
  duration: z.number().int().positive().max(600).optional(),
  rating: z.number().min(0).max(10).optional(),
  posterUrl: z.string().url().optional(),
  backdropUrl: z.union([z.string().url(), z.literal("")]).optional(),
  releaseDate: z.coerce.date().optional(),
  director: z.string().trim().min(1).max(160).optional(),
  seatsAvailable: z.number().int().nonnegative().optional(),
  cast: z.array(z.string().trim().min(1)).optional(),
  isActive: z.boolean().optional(),
}).strict().refine((data) => Object.keys(data).length > 0);

export const GET = withDb(async (_req: NextRequest, context: { params: Promise<Record<string, string>> }) => {
  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Movie not found" }, { status: 404 });
  const movie = await getMovieById(id);
  if (!movie) return NextResponse.json({ error: "Movie not found" }, { status: 404 });
  return NextResponse.json(movie);
});

export const PUT = withDb(withAdmin(async (req: NextRequest, context: { params: Promise<Record<string, string>> }) => {
  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid movie ID." }, { status: 400 });
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues.map((issue) => issue.message).join(" ") }, { status: 400 });
  const movie = await updateMovie(id, parsed.data);
  if (!movie) return NextResponse.json({ error: "Movie not found." }, { status: 404 });
  return NextResponse.json(movie);
}));

export const DELETE = withDb(withAdmin(async (_req: NextRequest, context: { params: Promise<Record<string, string>> }) => {
  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid movie ID." }, { status: 400 });
  try {
    const [hasShowtimeReferences, hasBookingReferences] = await Promise.all([
      ShowtimeModel.exists({ movieId: id }),
      BookingModel.exists({ movieId: id }),
    ]);
    validateMovieRemoval(Boolean(hasShowtimeReferences), Boolean(hasBookingReferences));
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 409 });
  }
  const movie = await deleteMovie(id);
  if (!movie) return NextResponse.json({ error: "Movie not found." }, { status: 404 });
  return NextResponse.json({ message: "Movie deleted." });
}));
