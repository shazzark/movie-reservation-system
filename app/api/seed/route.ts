import { seedMovies } from "../../../lib/seed";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await seedMovies();
    return NextResponse.json({ message: "Database Seeded Successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Seed failed", details: error },
      { status: 500 },
    );
  }
}
