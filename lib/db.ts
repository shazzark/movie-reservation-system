import mongoose from "mongoose";

type MongooseCache = {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
};

declare global {
  var mongoose: MongooseCache | undefined;
}

const databaseUrl = process.env.DATABASE_URL ?? "";
if (!databaseUrl) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env.local"
  );
}

// Use cached connection for serverless environments
const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect(): Promise<mongoose.Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(databaseUrl).catch((error) => {
      cached.promise = null;
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
