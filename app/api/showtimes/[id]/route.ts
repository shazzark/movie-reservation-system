// api/showtimes/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { handleDbConnection } from "../../../../lib/dbHandler";
import { ShowtimeModel } from "../../../../models/showtime";
import { TheaterModel } from "../../../../models/theater";
import mongoose from "mongoose"; // ✅ Added import

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await handleDbConnection();
    const { id } = await params;

    // --- FIX START ---
    // Check if id is a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid Showtime ID format" },
        { status: 400 },
      );
    }
    // --- FIX END ---

    const showtime = await ShowtimeModel.findById(id).lean();

    if (!showtime) {
      return NextResponse.json(
        { error: "Showtime not found" },
        { status: 404 },
      );
    }

    // Fetch the actual Theater using the theaterId
    const theater = await TheaterModel.findById(showtime.theaterId).lean();

    return NextResponse.json({
      showtime: {
        ...showtime,
        pricePerSeat: showtime.price,
      },
      theaterName: theater ? theater.name : "Cinema Palace",
    });
  } catch (error) {
    console.error("Showtime Detail Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
