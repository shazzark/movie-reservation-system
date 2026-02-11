// app/api/movies/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getMovieById,
  updateMovie,
  deleteMovie,
} from "../../../../services/movie.service";
import { withDb } from "../../../../lib/routeHandler";
import { requireAdmin } from "../../../../lib/authGuard";

// GET /api/movies/[id]
export const GET = withDb(
  // 1. UPDATE THE TYPE HERE TO MATCH routeHandler.ts
  async (
    req: NextRequest,
    { params }: { params: Promise<Record<string, string>> },
  ) => {
    // 2. Unwrap params
    const resolvedParams = await params;
    const movie = await getMovieById(resolvedParams.id);

    if (!movie)
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    return NextResponse.json(movie);
  },
);

// PUT /api/movies/[id]
export const PUT = withDb(
  // 1. UPDATE THE TYPE HERE TO MATCH routeHandler.ts
  async (
    req: NextRequest,
    { params }: { params: Promise<Record<string, string>> },
  ) => {
    await requireAdmin();
    // 2. Unwrap params
    const resolvedParams = await params;
    const body = await req.json();
    const updated = await updateMovie(resolvedParams.id, body);
    return NextResponse.json(updated);
  },
);

// DELETE /api/movies/[id]
export const DELETE = withDb(
  // 1. UPDATE THE TYPE HERE TO MATCH routeHandler.ts
  async (
    req: NextRequest,
    { params }: { params: Promise<Record<string, string>> },
  ) => {
    await requireAdmin();
    // 2. Unwrap params
    const resolvedParams = await params;
    await deleteMovie(resolvedParams.id);
    return NextResponse.json({ message: "Deleted" });
  },
);
