// src/app/api/property/like/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Property from "@/models/Property";

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

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { message: "Property not found." },
        { status: 404 }
      );
    }

    // Update user's liked list (avoid duplicates)
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $addToSet: { likedProperties: propertyId } }, // prevents duplicates
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Property added to wishlist.",
        likedProperties: updatedUser.likedProperties,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Like Property Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
