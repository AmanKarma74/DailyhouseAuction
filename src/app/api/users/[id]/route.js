// src/app/api/users/[id]/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  await dbConnect();

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid User ID." },
      { status: 400 }
    );
  }

  try {
    const user = await User.findById(id)
      .select("-password -idProof -rejectReason -propertiesListed -dateOfBirth")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    user._id = user._id.toString();

    return NextResponse.json(
      { success: true, data: user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch User By ID Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
