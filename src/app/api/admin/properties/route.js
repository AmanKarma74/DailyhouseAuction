// src/app/api/admin/properties/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import dbConnect from "@/lib/dbConnect";
import Property from "@/models/Property";

export async function GET(request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "Admin") {
      return NextResponse.json(
        { message: "Forbidden." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const properties = await Property.find({})
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate("listedBy", "name email listingUser");

    return NextResponse.json(
      {
        success: true,
        properties,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin Properties Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
