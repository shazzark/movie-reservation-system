// api/movies/routes.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllMovies, createMovie } from "../../../services/movie.service";
import { MovieInput } from "../../../types/movie";
import { withDb } from "../../../lib/routeHandler";
import { requireAdmin } from "../../../lib/authGuard";

// GET /api/movies
export const GET = withDb(async (req: NextRequest) => {
  const movies = await getAllMovies(); // DB is already connected
  return NextResponse.json(movies);
});

// POST /api/movies
export const POST = withDb(async (req: NextRequest) => {
  await requireAdmin(); // 🔒 admin only
  const body: MovieInput = await req.json();
  const movie = await createMovie(body);
  return NextResponse.json(movie, { status: 201 });
});
