import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import { bookingService } from "@/services/booking.service";
import { BookingModel } from "@/models/booking";
import { MovieModel } from "@/models/movie";
import { ShowtimeModel } from "@/models/showtime";
import { TheaterModel } from "@/models/theater";
import type { CreateBookingDto } from "@/types/booking";

test("booking transaction, conflict, authorization, and cancellation", { timeout: 120_000 }, async () => {
  const uri = process.env.DATABASE_URL;
  if (!uri) throw new Error("DATABASE_URL is required for integration tests");
  const dbName = `cinebook_p2_${randomUUID().replaceAll("-", "").slice(0, 20)}`;
  await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 10_000 });

  try {
    assert.equal(mongoose.connection.db?.databaseName, dbName);
    await BookingModel.createCollection();
    const theater = await TheaterModel.create({
      _id: new mongoose.Types.ObjectId().toString(),
      name: "Test Theater",
      location: "Test location",
      rows: 2,
      seatsPerRow: 3,
      totalSeats: 6,
    });
    const movie = await MovieModel.create({
      title: "Test Movie",
      description: "Integration test fixture",
      genre: ["Drama"],
      duration: 90,
      posterUrl: "/test.jpg",
      releaseDate: new Date(),
      director: "Test Director",
      seatsAvailable: 6,
      cast: [],
      isActive: true,
    });
    const showtime = await ShowtimeModel.create({
      movieId: movie._id,
      theaterId: theater._id,
      startTime: new Date(Date.now() + 86_400_000),
      price: 12.5,
      totalSeats: 6,
      bookedSeats: [],
    });
    const user = { id: new mongoose.Types.ObjectId().toString(), role: "user" as const };
    const other = { id: new mongoose.Types.ObjectId().toString(), role: "user" as const };
    const showtimeId = String(showtime._id);

    const created = await bookingService.create(
      { showtimeId, seats: ["A1", "A2"], totalPrice: 0 } as CreateBookingDto,
      user,
    );
    assert.equal(created.totalPrice, 25);
    assert.equal(created.theaterId, String(theater._id));
    assert.equal(created.userId, user.id);
    assert.equal(created.status, "confirmed");
    assert.equal("paymentStatus" in created, false);
    assert.ok((await ShowtimeModel.findById(showtimeId)).bookedSeats.includes("A1"));
    assert.equal((await bookingService.getById(created._id, other)), null);
    await assert.rejects(() => bookingService.cancel(created._id, other), { status: 404 });

    await assert.rejects(() => bookingService.create({ showtimeId, seats: ["B4"] }, other), { status: 400 });
    await assert.rejects(() => bookingService.create({ showtimeId, seats: ["A1"] }, other), { status: 409 });

    const simultaneous = await Promise.allSettled([
      bookingService.create({ showtimeId, seats: ["B1"] }, user),
      bookingService.create({ showtimeId, seats: ["B1"] }, other),
    ]);
    assert.equal(simultaneous.filter((result) => result.status === "fulfilled").length, 1);
    assert.equal(simultaneous.filter((result) => result.status === "rejected").length, 1);
    assert.equal(await BookingModel.countDocuments({ showtimeId, seats: "B1", status: "confirmed" }), 1);

    const admin = { id: new mongoose.Types.ObjectId().toString(), role: "admin" as const };
    const cancelled = await bookingService.cancel(created._id, admin);
    assert.equal(cancelled.status, "cancelled");
    assert.equal((await bookingService.getById(created._id, user))?.status, "cancelled");
    const afterCancel = await ShowtimeModel.findById(showtimeId);
    assert.ok(!afterCancel.bookedSeats.includes("A1"));
    assert.ok(!afterCancel.bookedSeats.includes("A2"));
    assert.ok(afterCancel.bookedSeats.includes("B1"));
    await assert.rejects(() => bookingService.cancel(created._id, user), { status: 409 });

    const originalCreate = BookingModel.create;
    try {
      BookingModel.create = async () => { throw new Error("forced insert failure"); };
      await assert.rejects(() => bookingService.create({ showtimeId, seats: ["B2"] }, user), /forced insert failure/);
    } finally {
      BookingModel.create = originalCreate;
    }
    assert.ok(!(await ShowtimeModel.findById(showtimeId)).bookedSeats.includes("B2"));
  } finally {
    try {
      if (mongoose.connection.db?.databaseName === dbName) {
        await mongoose.connection.dropDatabase();
      }
    } finally {
      await mongoose.disconnect();
    }
  }
});
