import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

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

    const body = await request.json();

    // Allowed fields only:
    const allowedFields = [
      "name",
      "number",
      "residentialAddress",
      "profilePicUrl",
      "dateOfBirth",
      "workingArea",
      "occupation",
      "businessName",
      "operatingSince",
      "officeAddress"
    ];

    const updateData = {};

    // Filter valid fields only
    for (const key of allowedFields) {
      if (body[key] !== undefined && body[key] !== null && body[key] !== "") {
        updateData[key] = body[key];
      }
    }

    // Date conversion
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    // Role-specific logic:
    const loggedUser = await User.findById(session.user.id);

    if (loggedUser.listingUser === "Owner") {
      delete updateData.businessName;
      delete updateData.operatingSince;
    }

    if (loggedUser.listingUser === "Broker" || loggedUser.listingUser === "Builder") {
      delete updateData.occupation;
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -idProof -rejectReason");

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully.",
        user: updatedUser
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("User Update Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error during user update.", error: error.message },
      { status: 500 }
    );
  }
}
