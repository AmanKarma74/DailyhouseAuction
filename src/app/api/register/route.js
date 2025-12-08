// src/app/api/register/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { hashPassword } from "@/lib/authUtils";
import User from "@/models/User";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, number, residentialAddress, password } = body;

    // Required fields check
    if (!name || !email || !number || !password) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const hashed = await hashPassword(password);

    // Create user
    const newUser = await User.create({
      name,
      email,
      number,
      residentialAddress: residentialAddress || "",
      password: hashed,
      role: "User", // NEW UPDATED ROLE
    });

    return NextResponse.json(
      {
        message: "Registration successful!",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration API Crash:", error);
    return NextResponse.json(
      { message: "Internal Server Error during registration." },
      { status: 500 }
    );
  }
}
