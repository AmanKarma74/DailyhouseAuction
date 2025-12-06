// src/app/api/properties/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Property from "@/models/Property";



// GET ALL PROPERTIES (Public)
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Category Filter
    if (searchParams.get("category")) {
      filter.propertyCategory = searchParams.get("category");
    }

    // Purpose Filter
    if (searchParams.get("purpose")) {
      filter.postingPurpose = searchParams.get("purpose");
    }

    // Max Price Filter
    if (searchParams.get("maxPrice")) {
      filter.price = {
        ...filter.price,
        $lte: parseInt(searchParams.get("maxPrice")),
      };
    }

    // (Optional: Min Price bhi add kar sakte ho later)

    const totalProperties = await Property.countDocuments(filter);

    const properties = await Property.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 }) // FIX: using timestamps
      .populate("listedBy", "name email listingUser");

    return NextResponse.json(
      {
        success: true,
        properties,
        totalPages: Math.ceil(totalProperties / limit),
        currentPage: page,
        totalResults: totalProperties,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Property Read Error:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error during fetching properties.",
      },
      { status: 500 }
    );
  }
}
