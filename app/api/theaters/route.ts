import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { withDb } from "@/lib/routeHandler";
import { withAdmin } from "@/lib/adminHandler";
import { TheaterModel } from "@/models/theater";
import { theaterSeatCapacity } from "@/lib/admin-cms-rules";

const theaterSchema = z.object({
  name: z.string().trim().min(1).max(120),
  location: z.string().trim().min(1).max(240),
  rows: z.number().int().positive().max(40),
  seatsPerRow: z.number().int().positive().max(40),
}).strict();

export const GET = withDb(async () => {
  const theaters = await TheaterModel.find().sort({ name: 1 }).lean();
  return NextResponse.json(theaters.map((theater) => ({ ...theater, _id: String(theater._id) })));
});

export const POST = withDb(withAdmin(async (req: NextRequest) => {
  const parsed = theaterSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues.map((issue) => issue.message).join(" ") }, { status: 400 });
  const totalSeats = theaterSeatCapacity(parsed.data.rows, parsed.data.seatsPerRow);
  const theater = await TheaterModel.create({ _id: new mongoose.Types.ObjectId().toString(), ...parsed.data, totalSeats });
  return NextResponse.json({ ...theater.toObject(), _id: String(theater._id) }, { status: 201 });
}));
