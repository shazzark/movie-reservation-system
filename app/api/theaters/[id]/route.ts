import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withDb } from "@/lib/routeHandler";
import { withAdmin } from "@/lib/adminHandler";
import { TheaterModel } from "@/models/theater";
import { ShowtimeModel } from "@/models/showtime";
import { BookingModel } from "@/models/booking";
import { theaterSeatCapacity, validateTheaterEdit, validateTheaterRemoval } from "@/lib/admin-cms-rules";

const theaterPatchSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  location: z.string().trim().min(1).max(240).optional(),
  rows: z.number().int().positive().max(40).optional(),
  seatsPerRow: z.number().int().positive().max(40).optional(),
}).strict().refine((data) => Object.keys(data).length > 0);

export const GET = withDb(async (_req: NextRequest, context: { params: Promise<Record<string, string>> }) => {
  const { id } = await context.params;
  const theater = await TheaterModel.findById(id).lean();
  if (!theater) return NextResponse.json({ error: "Theater not found." }, { status: 404 });
  return NextResponse.json({ ...theater, _id: String(theater._id) });
});

export const PUT = withDb(withAdmin(async (req: NextRequest, context: { params: Promise<Record<string, string>> }) => {
  const { id } = await context.params;
  const parsed = theaterPatchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues.map((issue) => issue.message).join(" ") }, { status: 400 });
  const current = await TheaterModel.findById(id);
  if (!current) return NextResponse.json({ error: "Theater not found." }, { status: 404 });
  const layoutChanged = (parsed.data.rows !== undefined && parsed.data.rows !== current.rows) ||
    (parsed.data.seatsPerRow !== undefined && parsed.data.seatsPerRow !== current.seatsPerRow);
  try {
    validateTheaterEdit(layoutChanged, Boolean(await ShowtimeModel.exists({ theaterId: id })));
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 409 });
  }
  const rows = parsed.data.rows ?? current.rows;
  const seatsPerRow = parsed.data.seatsPerRow ?? current.seatsPerRow;
  const theater = await TheaterModel.findByIdAndUpdate(id, {
    ...parsed.data,
    totalSeats: theaterSeatCapacity(rows, seatsPerRow),
  }, { new: true, runValidators: true }).lean();
  return NextResponse.json(theater);
}));

export const DELETE = withDb(withAdmin(async (_req: NextRequest, context: { params: Promise<Record<string, string>> }) => {
  const { id } = await context.params;
  try {
    const [hasShowtimeReferences, hasBookingReferences] = await Promise.all([
      ShowtimeModel.exists({ theaterId: id }),
      BookingModel.exists({ theaterId: id }),
    ]);
    validateTheaterRemoval(Boolean(hasShowtimeReferences), Boolean(hasBookingReferences));
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 409 });
  }
  const theater = await TheaterModel.findByIdAndDelete(id);
  if (!theater) return NextResponse.json({ error: "Theater not found." }, { status: 404 });
  return NextResponse.json({ message: "Theater deleted." });
}));
