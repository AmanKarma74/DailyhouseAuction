// src/app/api/onboard/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(request) {
  try {
    await dbConnect();

    // 1. Fetch Session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Authentication required. Please log in." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      listingUser,
      occupation,
      businessName,
      operatingSince,
      workingArea,
      officeAddress,
      dateOfBirth,
      idProof,
    } = body;

    // 2. Validate listingUser
    const validTypes = ["Owner", "Broker", "Builder"];
    if (!validTypes.includes(listingUser)) {
      return NextResponse.json(
        { message: "Invalid listing user type." },
        { status: 400 }
      );
    }

    // 3. Check if already onboarded
    const existingUser = await User.findOne({ email: session.user.email });

    if (!existingUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    if (existingUser.onboarded) {
      return NextResponse.json(
        { message: "User already onboarded. Await admin review." },
        { status: 400 }
      );
    }

    // 4. Validate required fields based on listingUser type
    if (!idProof) {
      return NextResponse.json(
        { message: "ID Proof is required." },
        { status: 400 }
      );
    }

    if (listingUser === "Owner" && !occupation) {
      return NextResponse.json(
        { message: "Occupation is required for Owners." },
        { status: 400 }
      );
    }

    if (
      (listingUser === "Broker" || listingUser === "Builder") &&
      (!businessName || !operatingSince)
    ) {
      return NextResponse.json(
        {
          message:
            "Business name and operating since are required for Broker/Builder.",
        },
        { status: 400 }
      );
    }

    // 5. Prepare update data
    const updateFields = {
      listingUser,
      occupation: listingUser === "Owner" ? occupation : "",
      businessName:
        listingUser === "Broker" || listingUser === "Builder"
          ? businessName
          : "",
      operatingSince:
        listingUser === "Broker" || listingUser === "Builder"
          ? operatingSince
          : "",
      workingArea: workingArea || "",
      officeAddress: officeAddress || "",
      idProof,
      onboarded: true,
      isApproved: false,
    };

    if (dateOfBirth) {
      updateFields.dateOfBirth = new Date(dateOfBirth);
    }

    // 6. Update user
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    return NextResponse.json(
      {
        message: `Profile completed as ${listingUser}. Awaiting admin approval.`,
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Onboarding API Crash:", error);
    return NextResponse.json(
      { message: "Internal Server Error during onboarding." },
      { status: 500 }
    );
  }
}
