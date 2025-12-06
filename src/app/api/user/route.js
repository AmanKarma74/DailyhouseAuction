import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Authentication Check
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Authentication required to view profile." },
        { status: 401 }
      );
    }

    await dbConnect();

    // Fetching logged-in user with clean fields
    const user = await User.findById(session.user.id)
      .select(
        "-password -idProof -__v" // remove sensitive/unneeded fields
      )
      .lean();

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // Convert Mongo _id to string
    user._id = user._id.toString();

    // ⭐ Add computed "profileStatus" for frontend simplicity
    let profileStatus = "NORMAL";

    if (!user.onboarded) {
      profileStatus = "NORMAL";
    } else if (user.onboarded && !user.isApproved && !user.rejectReason) {
      profileStatus = "PENDING";
    } else if (user.onboarded && !user.isApproved && user.rejectReason) {
      profileStatus = "REJECTED";
    } else if (user.onboarded && user.isApproved) {
      profileStatus = "APPROVED";
    }

    return NextResponse.json(
      {
        success: true,
        profileStatus,
        user
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error fetching profile." },
      { status: 500 }
    );
  }
}
