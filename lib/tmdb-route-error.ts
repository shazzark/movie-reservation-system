import { NextResponse } from "next/server";
import { TmdbServiceError } from "@/services/tmdb.service";

export function tmdbErrorResponse(error: unknown) {
  if (error instanceof TmdbServiceError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  return NextResponse.json({ error: "TMDB import is temporarily unavailable." }, { status: 502 });
}
