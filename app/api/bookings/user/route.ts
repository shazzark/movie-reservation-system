import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { handleDbConnection } from "@/lib/dbHandler";
import { bookingService } from "@/services/booking.service";
import { bookingErrorResponse } from "@/lib/booking-response";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    await handleDbConnection();
    const bookings = await bookingService.getByUser(session.user.id);
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return bookingErrorResponse(error);
  }
}
