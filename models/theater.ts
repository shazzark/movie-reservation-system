// models/theater
import { Schema, model, models } from "mongoose";

const TheaterSchema = new Schema({
  _id: { type: String, required: true }, // ✅ Explicitly make it a String
  name: { type: String, required: true },
  location: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  rows: { type: Number, required: true },
  seatsPerRow: { type: Number, required: true },
});

export const TheaterModel = models.Theater || model("Theater", TheaterSchema);
