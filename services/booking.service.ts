import mongoose from "mongoose";
import { BookingModel } from "@/models/booking";
import { MovieModel } from "@/models/movie";
import { ShowtimeModel } from "@/models/showtime";
import { TheaterModel } from "@/models/theater";
import { BookingError, bookingOwnerFilter, calculateTotalPrice, validateSeatLayout, validateSeats } from "@/lib/booking-rules";
import type { Booking, BookingDetails, CreateBookingDto } from "@/types/booking";

export interface BookingActor {
  id: string;
  role: "user" | "admin";
}

function toBooking(record: Record<string, unknown>, theaterId?: string, showtimeStartTime?: string | null): Booking {
  return {
    _id: String(record._id),
    userId: String(record.userId),
    movieId: String(record.movieId),
    showtimeId: String(record.showtimeId),
    theaterId: record.theaterId ? String(record.theaterId) : (theaterId ?? ""),
    seats: record.seats as string[],
    totalPrice: record.totalPrice as number,
    bookingDate: (record.bookingDate as Date).toISOString(),
    showtimeStartTime: showtimeStartTime ?? null,
    status: record.status as Booking["status"],
  };
}

export const bookingService = {
  async create(data: CreateBookingDto, actor: BookingActor): Promise<Booking> {
    if (!mongoose.Types.ObjectId.isValid(actor.id)) {
      throw new BookingError("Unauthorized", 401);
    }
    if (!mongoose.Types.ObjectId.isValid(data.showtimeId)) {
      throw new BookingError("Invalid showtime", 400);
    }

    return mongoose.connection.transaction(async (session) => {
      const showtime = await ShowtimeModel.findById(data.showtimeId).session(session);
      if (!showtime) throw new BookingError("Showtime not found", 404);
      if (new Date(showtime.startTime).getTime() <= Date.now()) {
        throw new BookingError("This showtime has already started", 409);
      }

      const theater = await TheaterModel.findById(showtime.theaterId).session(session);
      if (!theater) throw new BookingError("Theater not found", 409);
      const movie = await MovieModel.findById(showtime.movieId).session(session);
      if (!movie || !movie.isActive) {
        throw new BookingError("This movie is not available for booking", 409);
      }

      validateSeatLayout(theater, showtime.totalSeats);
      const seats = validateSeats(data.seats, theater);
      const totalPrice = calculateTotalPrice(showtime.price, seats.length);

      // The predicate and update run atomically on the showtime document.
      const reserved = await ShowtimeModel.findOneAndUpdate(
        { _id: showtime._id, startTime: { $gt: new Date() }, bookedSeats: { $nin: seats } },
        { $addToSet: { bookedSeats: { $each: seats } } },
        { session, new: true },
      );
      if (!reserved) {
        throw new BookingError("One or more selected seats are already reserved", 409);
      }

      const [booking] = await BookingModel.create([{
        userId: actor.id,
        movieId: showtime.movieId,
        showtimeId: showtime._id,
        theaterId: theater._id,
        seats,
        totalPrice,
        status: "confirmed",
      }], { session });
      return toBooking(booking.toObject());
    });
  },

  async getByUser(userId?: string): Promise<Booking[]> {
    const records = await BookingModel.find(userId ? { userId } : {})
      .sort({ bookingDate: -1 })
      .lean();
    const showtimes = records.length
      ? await ShowtimeModel.find({ _id: { $in: records.map((record: Record<string, unknown>) => record.showtimeId) } })
          .select("theaterId startTime").lean()
      : [];
    const showtimeById = new Map(showtimes.map((showtime) => [String(showtime._id), showtime]));
    return records.map((record: Record<string, unknown>) => {
      const showtime = showtimeById.get(String(record.showtimeId));
      return toBooking(record, showtime?.theaterId, showtime?.startTime?.toISOString());
    });
  },

  async getById(id: string, actor: BookingActor): Promise<BookingDetails | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BookingError("Invalid booking ID", 400);
    const record = await BookingModel.findOne(bookingOwnerFilter(id, actor.id, actor.role)).lean();
    if (!record) return null;

    const movie = await MovieModel.findById(record.movieId).select("title genre duration").lean();
    const showtime = await ShowtimeModel.findById(record.showtimeId).select("startTime price format theaterId").lean();
    const theaterId = record.theaterId ? String(record.theaterId) : showtime?.theaterId;
    const theater = theaterId ? await TheaterModel.findById(theaterId).select("name location").lean() : null;
    return {
      ...toBooking(record, theaterId, showtime?.startTime?.toISOString()),
      movie: movie ? { title: movie.title, genre: movie.genre, duration: movie.duration } : null,
      showtime: showtime ? { startTime: showtime.startTime.toISOString(), price: showtime.price, format: showtime.format } : null,
      theater: theater ? { name: theater.name, location: theater.location } : null,
    };
  },

  async cancel(id: string, actor: BookingActor): Promise<Booking> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BookingError("Invalid booking ID", 400);
    return mongoose.connection.transaction(async (session) => {
      const filter = bookingOwnerFilter(id, actor.id, actor.role);
      const booking = await BookingModel.findOne(filter).session(session);
      if (!booking) throw new BookingError("Booking not found", 404);
      if (booking.status !== "confirmed") {
        throw new BookingError("Only confirmed bookings can be cancelled", 409);
      }
      const showtime = await ShowtimeModel.findById(booking.showtimeId).session(session);
      if (!showtime) throw new BookingError("Showtime not found", 409);
      if (new Date(showtime.startTime).getTime() <= Date.now()) {
        throw new BookingError("Started showtimes cannot be cancelled", 409);
      }

      const updated = await BookingModel.findOneAndUpdate(
        { ...filter, status: "confirmed" },
        { $set: { status: "cancelled" } },
        { session, new: true },
      );
      if (!updated) throw new BookingError("Booking is no longer active", 409);

      const released = await ShowtimeModel.updateOne(
        { _id: booking.showtimeId },
        { $pullAll: { bookedSeats: booking.seats } },
        { session },
      );
      if (released.matchedCount !== 1) {
        throw new BookingError("Could not release seats", 409);
      }
      return toBooking(updated.toObject());
    });
  },
};
