// models/user.ts
import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

// Add a virtual to make it easier to work with IDs in the frontend
UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", { virtuals: true });

export const User = models.User || mongoose.model("User", UserSchema);
