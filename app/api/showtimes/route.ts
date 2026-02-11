// api/showtimes/route.ts

import { NextRequest, NextResponse } from "next/server";
import { handleDbConnection } from "@/lib/dbHandler";
import { ShowtimeModel } from "@/models/showtime";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await handleDbConnection();
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json({ error: "Movie ID required" }, { status: 400 });
    }

    // --- FIX START ---
    // Check if movieId is a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      console.warn(`Invalid Movie ID format received: ${movieId}`);
      // Return empty array if ID is invalid
      return NextResponse.json([]);
    }
    // --- FIX END ---

    const showtimes = await ShowtimeModel.find({
      movieId: new mongoose.Types.ObjectId(movieId),
    }).sort({
      startTime: 1,
    });

    return NextResponse.json(showtimes);
  } catch (error) {
    console.error("List Showtimes Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch showtimes" },
      { status: 500 },
    );
  }
}
