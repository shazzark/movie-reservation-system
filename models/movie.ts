// models/movie.ts
import { Schema, model, models } from "mongoose";

const MovieSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: [String], required: true },
    duration: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    posterUrl: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    director: { type: String, required: true },
    seatsAvailable: { type: Number, required: true },
    cast: { type: [String], required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const MovieModel = models.Movie || model("Movie", MovieSchema);
