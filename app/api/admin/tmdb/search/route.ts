import { NextRequest, NextResponse } from "next/server";
import { withAdmin } from "@/lib/adminHandler";
import { handleDbConnection } from "@/lib/dbHandler";
import { tmdbErrorResponse } from "@/lib/tmdb-route-error";
import { MovieModel } from "@/models/movie";
import { searchTmdbMovies } from "@/services/tmdb.service";

export const GET = withAdmin(async (request: NextRequest) => {
  const query = request.nextUrl.searchParams.get("query")?.trim() ?? "";
  if (query.length < 2 || query.length > 120) {
    return NextResponse.json({ error: "Search with 2 to 120 characters." }, { status: 400 });
  }

  let results;
  try {
    results = await searchTmdbMovies(query);
  } catch (error) {
    return tmdbErrorResponse(error);
  }

  try {
    await handleDbConnection();
    const imported = await MovieModel.find({ tmdbId: { $in: results.map((movie) => movie.tmdbId) } })
      .select("tmdbId")
      .lean();
    const importedIds = new Set(imported.map((movie) => movie.tmdbId));
    return NextResponse.json(results.map((movie) => ({ ...movie, alreadyImported: importedIds.has(movie.tmdbId) })));
  } catch {
    return NextResponse.json({ error: "CineBook could not check for existing imports. Please try again." }, { status: 503 });
  }
});
