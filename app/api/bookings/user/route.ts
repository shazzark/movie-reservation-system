// api/bookings/users/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { handleDbConnection } from "@/lib/dbHandler";
import { BookingModel } from "@/models/booking";

export async function GET() {
  try {
    // 1. Connect to DB
    await handleDbConnection();

    // 2. Get the session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 3. Find bookings
    const bookings = await BookingModel.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const bookingsWithStrings = bookings.map((b) => ({
      ...b,
      _id: b._id.toString(),
      theaterId: b.theaterId?.toString(),
      movieId: b.movieId?.toString(),
      showtimeId: b.showtimeId?.toString(),
    }));

    return NextResponse.json({
      success: true,
      data: bookingsWithStrings,
    });
  } catch (error) {
    // ✅ Fix: Use instance check instead of 'any'
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("User Bookings Error:", errorMessage);

    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}
