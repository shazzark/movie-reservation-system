import { NextRequest, NextResponse } from "next/server";
import { withDb } from "../../../../lib/routeHandler";
import { TheaterModel } from "../../../../models/theater";

// GET ONE
export const GET = withDb(async (req, context) => {
  const params = await context.params;
  if (!params?.id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  const { id } = params;

  const theater = await TheaterModel.findById(id).lean();
  if (!theater)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(theater);
});

// UPDATE
export const PUT = withDb(async (req, context) => {
  const params = await context.params;
  if (!params?.id)
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  const { id } = params;

  const body = await req.json();
  const updated = await TheaterModel.findByIdAndUpdate(id, body, { new: true });

  return NextResponse.json(updated);
});

// Delete
export const DELETE = withDb(async (req, context) => {
  const params = await context.params;
  if (!params?.id)
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  const { id } = params;

  await TheaterModel.findByIdAndDelete(id);
  return NextResponse.json({ message: "Theater deleted" });
});
