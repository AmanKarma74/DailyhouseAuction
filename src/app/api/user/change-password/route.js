// src/app/api/user/change-password/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyPassword, hashPassword } from "@/lib/authUtils";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    await dbConnect();

    const { oldPassword, newPassword } = await request.json();

    // Validation
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "Old and new passwords are required." },
        { status: 400 }
      );
    }

    // New password strength check
    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Fetch user with password
    const user = await User.findById(session.user.id).select("+password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // Verify old password
    const isValidOld = await verifyPassword(oldPassword, user.password);

    if (!isValidOld) {
      return NextResponse.json(
        { message: "Incorrect old password." },
        { status: 400 }
      );
    }

    // Hash new password
    const hashed = await hashPassword(newPassword);

    user.password = hashed;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Password updated successfully." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Password Change Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error during password change." },
      { status: 500 }
    );
  }
}
