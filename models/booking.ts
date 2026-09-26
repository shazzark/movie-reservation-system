//models/booking.ts
// models/booking.ts
import { Schema, model, models } from "mongoose";

const BookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    showtimeId: {
      type: Schema.Types.ObjectId,
      ref: "Showtime",
      required: true,
    },
    theaterId: { type: String, ref: "Theater", required: true },
    seats: { type: [String], required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
    bookingDate: { type: Date, required: true, default: Date.now }, // ADD THIS
  },
  { timestamps: true },
);

export const BookingModel = models.Booking || model("Booking", BookingSchema);
