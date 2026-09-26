import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { handleDbConnection } from "@/lib/dbHandler";
import { BookingModel } from "@/models/booking";
import { MovieModel } from "@/models/movie";
import { ShowtimeModel } from "@/models/showtime";
import { TheaterModel } from "@/models/theater";
import { seedMovies } from "@/lib/seed";
import { validateSeedDatabaseState } from "@/lib/seed-rules";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    await handleDbConnection();
    const [hasBookings, movieCount, showtimeCount, theaterCount] = await Promise.all([
      BookingModel.exists({}),
      MovieModel.countDocuments(),
      ShowtimeModel.countDocuments(),
      TheaterModel.countDocuments(),
    ]);
    try {
      validateSeedDatabaseState({ hasBookings: Boolean(hasBookings), movies: movieCount, showtimes: showtimeCount, theaters: theaterCount });
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 409 });
    }
    await seedMovies();
    return NextResponse.json({ message: "Database seeded" });
  } catch (error) {
    console.error("Seed failed:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
