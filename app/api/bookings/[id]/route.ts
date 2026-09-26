import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { handleDbConnection } from "@/lib/dbHandler";
import { bookingService } from "@/services/booking.service";
import { bookingErrorResponse } from "@/lib/booking-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    await handleDbConnection();
    const { id } = await params;
    const booking = await bookingService.getById(id, { id: session.user.id, role: session.user.role });
    if (!booking) return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    return bookingErrorResponse(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    await handleDbConnection();
    const { id } = await params;
    const booking = await bookingService.cancel(id, { id: session.user.id, role: session.user.role });
    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    return bookingErrorResponse(error);
  }
}
