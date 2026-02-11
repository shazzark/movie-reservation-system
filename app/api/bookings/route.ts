// api/bookings/routes.ts
import { NextRequest, NextResponse } from "next/server";
import { handleDbConnection } from "@/lib/dbHandler";
import { bookingService } from "@/services/booking.service";
import { getServerSession } from "next-auth"; // 1. Import this
import { authOptions } from "@/lib/auth"; // 2. Import this

export async function POST(req: NextRequest) {
  console.log("🔥 /api/bookings POST HIT");
  try {
    await handleDbConnection();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const booking = await bookingService.create({
      ...body,
      userId: session.user.id, // enforced
    });

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Booking failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await handleDbConnection();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const bookings = await bookingService.getByUser(userId);
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch bookings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
