// api/theaters/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withDb } from "../../../lib/routeHandler";
import { TheaterModel } from "../../../models/theater";

// // GET ALL
// export const GET = withDb(async () => {
//   const theaters = await TheaterModel.find().lean();
//   // Convert _id to string for the client
//   const theatersWithStringId = theaters.map((t) => ({
//     ...t,
//     _id: t._id.toString(),
//   }));
//   return NextResponse.json(theatersWithStringId);
// });

// // CREATE (For Admin)
// export const POST = withDb(async (req: NextRequest) => {
//   const body = await req.json();
//   const newTheater = await TheaterModel.create(body);
//   return NextResponse.json(newTheater, { status: 201 });
// });

export const GET = withDb(async (_req: NextRequest, _context) => {
  const theaters = await TheaterModel.find().lean();
  return NextResponse.json(
    theaters.map((t) => ({ ...t, _id: t._id.toString() })),
  );
});

export const POST = withDb(async (req: NextRequest, _context) => {
  const body = await req.json();
  const newTheater = await TheaterModel.create(body);
  return NextResponse.json(newTheater, { status: 201 });
});
