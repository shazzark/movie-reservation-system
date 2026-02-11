// api/bookings/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { handleDbConnection } from "@/lib/dbHandler";
import { bookingService } from "@/services/booking.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await handleDbConnection();
    const { id } = await params;
    const booking = await bookingService.getById(id);

    if (!booking)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(booking);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await handleDbConnection();
    const { id } = await params;
    const result = await bookingService.cancel(id);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
