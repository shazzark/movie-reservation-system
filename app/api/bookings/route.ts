import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import mongoose from "mongoose";
import { authOptions } from "@/lib/auth";
import { handleDbConnection } from "@/lib/dbHandler";
import { bookingService } from "@/services/booking.service";
import { bookingErrorResponse } from "@/lib/booking-response";

const createBookingSchema = z.object({
  showtimeId: z.string(),
  seats: z.array(z.string()),
}).strict();

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const parsed = createBookingSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Expected showtimeId and seats only" }, { status: 400 });
    }
    await handleDbConnection();
    const booking = await bookingService.create(parsed.data, {
      id: session.user.id,
      role: session.user.role,
    });
    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    return bookingErrorResponse(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const requestedUserId = req.nextUrl.searchParams.get("userId");
    if (requestedUserId && !mongoose.Types.ObjectId.isValid(requestedUserId)) {
      return NextResponse.json({ success: false, error: "Invalid user ID" }, { status: 400 });
    }
    if (requestedUserId && requestedUserId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    await handleDbConnection();
    const userId = requestedUserId || (session.user.role === "admin" ? undefined : session.user.id);
    const bookings = await bookingService.getByUser(userId);
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return bookingErrorResponse(error);
  }
}
