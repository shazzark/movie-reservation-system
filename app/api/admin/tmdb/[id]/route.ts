import { NextRequest, NextResponse } from "next/server";
import { withAdmin } from "@/lib/adminHandler";
import { handleDbConnection } from "@/lib/dbHandler";
import { isValidTmdbMovieId } from "@/lib/tmdb-metadata";
import { tmdbErrorResponse } from "@/lib/tmdb-route-error";
import { MovieModel } from "@/models/movie";
import { getTmdbMovie } from "@/services/tmdb.service";

export const GET = withAdmin(async (_request: NextRequest, context: { params: Promise<Record<string, string>> }) => {
  const { id } = await context.params;
  if (!isValidTmdbMovieId(id)) {
    return NextResponse.json({ error: "Invalid TMDB movie ID." }, { status: 400 });
  }

  let details;
  try {
    details = await getTmdbMovie(Number(id));
  } catch (error) {
    return tmdbErrorResponse(error);
  }

  try {
    await handleDbConnection();
    const alreadyImported = Boolean(await MovieModel.exists({ tmdbId: details.tmdbId }));
    return NextResponse.json({ ...details, alreadyImported });
  } catch {
    return NextResponse.json({ error: "CineBook could not check whether this movie was imported. Please try again." }, { status: 503 });
  }
});
