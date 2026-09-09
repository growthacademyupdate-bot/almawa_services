import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI in .env");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient;
}import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI in .env");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient;
}

export async function getDatabase() {
  await mongoClient.connect();
  return mongoClient.db();
}

export async function getDatabase() {
  await mongoClient.connect();
  return mongoClient.db();
}
