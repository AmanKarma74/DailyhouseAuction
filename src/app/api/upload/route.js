// src/app/api/upload/route.js
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinaryConfig";

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("image");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file found" },
        { status: 400 }
      );
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert buffer → base64
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(base64, {
      folder: form.get("folder") || "dailyhouse",
    });

    return NextResponse.json(
      {
        success: true,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Upload failed", error: err.message },
      { status: 500 }
    );
  }
}
