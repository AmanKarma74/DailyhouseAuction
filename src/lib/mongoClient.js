// src/lib/mongoClient.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) throw new Error("MONGODB_URI not set in .env.local");

const client = new MongoClient(uri);
const clientPromise = client.connect();

export default clientPromise;
