import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { withDb } from "@/lib/routeHandler";
import { withAdmin } from "@/lib/adminHandler";
import { ShowtimeModel } from "@/models/showtime";
import { BookingModel } from "@/models/booking";
import { validateShowtimeEdit, validateShowtimeRemoval } from "@/lib/admin-cms-rules";

const patchSchema = z.object({
  startTime: z.coerce.date().optional(),
  price: z.number().positive().max(1000000).optional(),
  format: z.string().trim().min(1).max(40).optional(),
}).strict().refine((data) => Object.keys(data).length > 0);

export const PUT = withDb(withAdmin(async (req: NextRequest, context: { params: Promise<Record<string, string>> }) => {
  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid showtime ID." }, { status: 400 });
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues.map((issue) => issue.message).join(" ") }, { status: 400 });
  const showtime = await ShowtimeModel.findById(id);
  if (!showtime) return NextResponse.json({ error: "Showtime not found." }, { status: 404 });
  const reservationCount = await BookingModel.countDocuments({ showtimeId: id });
  try { validateShowtimeEdit(showtime.startTime, parsed.data.startTime, reservationCount); }
  catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 409 }); }
  Object.assign(showtime, parsed.data);
  await showtime.save();
  return NextResponse.json(showtime);
}));

export const DELETE = withDb(withAdmin(async (_req: NextRequest, context: { params: Promise<Record<string, string>> }) => {
  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid showtime ID." }, { status: 400 });
  const showtime = await ShowtimeModel.findById(id);
  if (!showtime) return NextResponse.json({ error: "Showtime not found." }, { status: 404 });
  try { validateShowtimeRemoval(showtime.startTime, await BookingModel.countDocuments({ showtimeId: id })); }
  catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 409 }); }
  await showtime.deleteOne();
  return NextResponse.json({ message: "Showtime removed." });
}));
