// src/app/api/admin/users/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  // 1. Admin check
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json(
      { success: false, message: "Access Denied: Admin Only." },
      { status: 403 }
    );
  }

  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status"); // pending / approved / rejected

    let query = {
      onboarded: true,
      listingUser: { $in: ["Owner", "Broker", "Builder"] },
    };

    if (status === "pending") {
      query.isApproved = false;
    } else if (status === "approved") {
      query.isApproved = true;
    } else if (status === "rejected") {
      query.isApproved = false;
      query.rejectReason = { $ne: "" };
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid status parameter." },
        { status: 400 }
      );
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json(
      { success: true, users },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin fetch users error:", error);
    return NextResponse.json(
      { success: false, message: "Server error fetching users." },
      { status: 500 }
    );
  }
}