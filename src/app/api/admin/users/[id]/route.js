// src/app/api/admin/users/[id]/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import mongoose from "mongoose";

export async function PUT(req, { params }) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json(
      { success: false, message: "Access Denied: Admin Only." },
      { status: 403 }
    );
  }

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid User ID." },
      { status: 400 }
    );
  }

  // Prevent admin from editing himself
  if (session.user.id === id) {
    return NextResponse.json(
      { success: false, message: "Admin cannot update own status." },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { isApproved, rejectReason } = body;

    let updateData = {};
    if (isApproved === true) {
      updateData = {
        isApproved: true,
        rejectReason: "",
      };
    } else if (isApproved === false) {
      if (!rejectReason?.trim()) {
        return NextResponse.json(
          { success: false, message: "Reject reason required." },
          { status: 400 }
        );
      }

      updateData = {
        isApproved: false,
        rejectReason,
      };
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid approval status." },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: isApproved ? "User Approved." : "User Rejected.",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin update user error:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
