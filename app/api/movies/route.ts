import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createMovie, DuplicateTmdbMovieError, getAllMovies } from "../../../services/movie.service";
import { withDb } from "../../../lib/routeHandler";
import { withAdmin } from "../../../lib/adminHandler";
import { getDiscoveryMovies } from "@/services/discovery.service";

const movieSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(5000),
  genre: z.array(z.string().trim().min(1)).min(1),
  duration: z.number().int().positive().max(600),
  rating: z.number().min(0).max(10),
  posterUrl: z.string().url(),
  backdropUrl: z.union([z.string().url(), z.literal("")]).optional(),
  tmdbId: z.number().int().positive().max(2_147_483_647).optional(),
  releaseDate: z.coerce.date(),
  director: z.string().trim().min(1).max(160),
  seatsAvailable: z.number().int().nonnegative(),
  cast: z.array(z.string().trim().min(1)),
  isActive: z.boolean(),
}).strict();

export const GET = withDb(async (req: NextRequest) => {
  if (req.nextUrl.searchParams.get("discovery") === "1") {
    return NextResponse.json(await getDiscoveryMovies());
  }
  return NextResponse.json(await getAllMovies());
});

export const POST = withDb(withAdmin(async (req: NextRequest) => {
  const parsed = movieSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues.map((issue) => issue.message).join(" ") }, { status: 400 });
  try {
    return NextResponse.json(await createMovie(parsed.data), { status: 201 });
  } catch (error) {
    if (error instanceof DuplicateTmdbMovieError) return NextResponse.json({ error: error.message }, { status: 409 });
    throw error;
  }
}));
