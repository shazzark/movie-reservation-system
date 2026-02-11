// services/booking.service.ts
// services/booking.service.ts
import { BookingModel } from "@/models/booking";
import { ShowtimeModel } from "@/models/showtime";
import { CreateBookingDto } from "@/types/booking";

export const bookingService = {
  /**
   * Create a booking and reserve seats (NO TRANSACTIONS)
   */
  create: async (data: CreateBookingDto) => {
    // 1. Find showtime
    const showtime = await ShowtimeModel.findById(data.showtimeId);
    if (!showtime) {
      throw new Error("Showtime not found");
    }

    // 2. Check for already booked seats
    const seatTaken = data.seats.some((seat) =>
      showtime.bookedSeats.includes(seat),
    );

    if (seatTaken) {
      throw new Error("One or more selected seats are already reserved");
    }
    console.log("BOOKING CREATE CALLED", data);

    // 3. Reserve seats atomically
    await ShowtimeModel.findByIdAndUpdate(
      data.showtimeId,
      {
        $addToSet: {
          bookedSeats: { $each: data.seats },
        },
      },
      { new: true },
    );

    // 4. Create booking (movieId derived from showtime)
    const booking = await BookingModel.create({
      userId: data.userId,
      movieId: showtime.movieId,
      showtimeId: data.showtimeId,
      theaterId: data.theaterId,
      seats: data.seats,
      totalPrice: data.totalPrice,
      bookingDate: new Date(),
      status: "confirmed",
    });

    return booking;
  },

  /**
   * Get bookings for a user
   */
  getByUser: async (userId: string) => {
    return await BookingModel.find({ userId })
      .populate("movieId", "title posterUrl")
      .sort({ createdAt: -1 })
      .lean();
  },

  /**
   * Get single booking
   */
  getById: async (id: string) => {
    return await BookingModel.findById(id)
      .populate("movieId")
      .populate("showtimeId")
      .lean();
  },

  /**
   * Cancel booking and release seats
   */
  cancel: async (bookingId: string) => {
    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status === "cancelled") {
      throw new Error("Booking already cancelled");
    }

    // 1. Release seats
    await ShowtimeModel.findByIdAndUpdate(booking.showtimeId, {
      $pull: { bookedSeats: { $in: booking.seats } },
    });

    // 2. Update booking status
    booking.status = "cancelled";
    await booking.save();

    return { success: true, message: "Booking cancelled successfully" };
  },
};
