import { NextResponse } from "next/server";
import { BookingError } from "@/lib/booking-rules";

export function bookingErrorResponse(error: unknown): NextResponse {
  if (error instanceof BookingError) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.status });
  }
  console.error("Booking API error:", error);
  return NextResponse.json({ success: false, error: "Booking request failed" }, { status: 500 });
}
