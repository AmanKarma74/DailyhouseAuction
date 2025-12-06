// src/app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClient";

const handler = NextAuth({
  ...authOptions,
  adapter: MongoDBAdapter(clientPromise),
});

export { handler as GET, handler as POST };
