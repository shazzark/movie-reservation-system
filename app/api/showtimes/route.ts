// api/showtimes/route.ts

import { NextRequest, NextResponse } from "next/server";
import { handleDbConnection } from "@/lib/dbHandler";
import { getUpcomingShowtimesForMovie } from "@/services/discovery.service";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await handleDbConnection();
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json({ error: "Movie ID required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
    }
    return NextResponse.json(await getUpcomingShowtimesForMovie(movieId));
  } catch (error) {
    console.error("List Showtimes Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch showtimes" },
      { status: 500 },
    );
  }
}
