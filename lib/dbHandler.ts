// lib/dbHandler.ts
import dbConnect from "./db";

/**
 * Connect to DB and handle errors
 * Returns true if connection is ready, throws otherwise
 */
export const handleDbConnection = async () => {
  try {
    await dbConnect();
    return true; // DB connected
  } catch (error) {
    console.error("Database connection failed:", error);
    throw new Error("Database connection failed");
  }
};
