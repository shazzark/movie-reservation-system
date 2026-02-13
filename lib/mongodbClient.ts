// lib/mongodbClient.ts
import mongoose from "mongoose";

const MONGO_URI = process.env.DATABASE_URL!;
if (!MONGO_URI) {
  throw new Error("Please add DATABASE_URL to .env.local");
}

// Define cache type
type MongooseGlobalCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend global type
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseGlobalCache | undefined;
}

// Initialize global cache if it doesn't exist
if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}

// Now cached is always defined
const cached: MongooseGlobalCache = global.mongooseCache;

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose
      .connect(MONGO_URI, opts)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
