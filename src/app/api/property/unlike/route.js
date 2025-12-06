// src/app/api/property/unlike/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    await dbConnect();

    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { message: "Property ID is required." },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $pull: { likedProperties: propertyId } },
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Property removed from wishlist.",
        likedProperties: updatedUser.likedProperties,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unlike Property Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
