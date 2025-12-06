// src/lib/auth.config.js

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    /**
     * GOOGLE LOGIN
     */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      async profile(profile) {
        // Google profile received here
        await dbConnect();

        let user = await User.findOne({ email: profile.email });

        if (!user) {
          // First time google login → create user record
          user = await User.create({
            name: profile.name,
            email: profile.email,
            number: "",
            residentialAddress: "",
            role: "User",
            profilePicUrl: profile.picture ?? "",
          });
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          onboarded: user.onboarded,
          isApproved: user.isApproved,
          listingUser: user.listingUser,
        };
      },
    }),

    /**
     * EMAIL + PASSWORD LOGIN
     */
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({
          email: credentials.email,
        }).select("+password");

        if (!user) return null; // Email doesn't exist

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        // Remove password
        const { password, ...rest } = user.toObject();
        return rest;
      },
    }),
  ],

  pages: {
    signIn: "/auth",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    /**
     * JWT: add custom properties
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id?.toString() || user.id;
        token.role = user.role;
        token.onboarded = user.onboarded;
        token.isApproved = user.isApproved;
        token.listingUser = user.listingUser;
      }
      return token;
    },

    /**
     * SESSION: expose custom data to frontend
     */
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.onboarded = token.onboarded;
      session.user.isApproved = token.isApproved;
      session.user.listingUser = token.listingUser;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
