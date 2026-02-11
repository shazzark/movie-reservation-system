import { MongoClient } from "mongodb";

// const uri = process.env.MONGODB_URI!;
const uri = process.env.DATABASE_URL!;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// if (!process.env.MONGODB_URI) {
//   throw new Error("Please add MONGODB_URI to .env.local");
// }
if (!process.env.DATABASE_URL) {
  throw new Error("Please add DATABASE_URL to .env.local");
}

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof global & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }

  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
