// src/lib/dbConnect.js
import mongoose from 'mongoose';

// 1. .env.local se URI uthana
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // 3. Agar pehle se connected hai, toh return kar do
  if (cached.conn) {
    return cached.conn;
  }

  // 4. Agar connection promise nahi hai, toh naya banao
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Serverless environment ke liye recommended
      dbName: 'dailyhouse_db', // Aapka database name (optional but good practice)
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB Connected Successfully!');
      return mongoose;
    });
  }

  // 5. Connection ko wait karke cache mein store karna
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Agar error aaye toh promise reset kar do
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
