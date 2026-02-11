import { Schema, model, models, Types } from "mongoose";

const ShowtimeSchema = new Schema(
  {
    movieId: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    theaterId: { type: String, required: true },
    startTime: { type: Date, required: true },
    price: { type: Number, required: true },
    format: { type: String, default: "2D" }, // e.g., "IMAX", "3D"
    totalSeats: { type: Number, required: true },
    bookedSeats: { type: [String], default: [] }, // Array of seat labels like "A1", "A2"
  },
  { timestamps: true },
);

export const ShowtimeModel =
  models.Showtime || model("Showtime", ShowtimeSchema);
