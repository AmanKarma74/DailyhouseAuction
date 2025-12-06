// src/app/api/property/liked/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id)
      .select("likedProperties")
      .populate("likedProperties");

    return NextResponse.json(
      {
        success: true,
        likedProperties: user.likedProperties || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Liked Properties Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
