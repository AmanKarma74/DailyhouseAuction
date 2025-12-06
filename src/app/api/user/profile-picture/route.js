import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import cloudinary from "@/lib/cloudinaryConfig";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Auth required" }, { status: 401 });
    }

    await dbConnect();

    const formData = await req.formData();
    const file = formData.get("profilePicture");

    if (!file) {
      return NextResponse.json(
        { message: "No file received" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadRes = await cloudinary.uploader.upload(base64Data, {
      folder: "dailyhouse/profile",
    });

    const updated = await User.findByIdAndUpdate(
      session.user.id,
      { profilePicUrl: uploadRes.secure_url },
      { new: true }
    ).select("-password");

    return NextResponse.json(
      { success: true, url: updated.profilePicUrl, user: updated },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Upload failed", error: err.message },
      { status: 500 }
    );
  }
}
