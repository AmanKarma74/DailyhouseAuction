// src/app/api/properties/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import dbConnect from "@/lib/dbConnect";
import Property from "@/models/Property";
import cloudinary from "@/lib/cloudinaryConfig";
import mongoose from "mongoose";
import User from "@/models/User";

export const runtime = "nodejs";

// Helper: convert File → Buffer
async function fileToBuffer(file) {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}


// GET /api/properties/[id]  →  Get single property
export async function GET(request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid property ID." },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const property = await Property.findById(id).lean();

    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        property,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET Property Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error fetching property." },
      { status: 500 }
    );
  }
}


export async function PUT(request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid property ID." },
      { status: 400 }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    await dbConnect();

    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found." },
        { status: 404 }
      );
    }

    // Only owner/admin can edit
    if (
      property.listedBy.toString() !== session.user.id &&
      session.user.role !== "Admin"
    ) {
      return NextResponse.json(
        { success: false, message: "Not authorized." },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    // ------------------------------------------------------
    // 1) Existing images (kept by user)
    // ------------------------------------------------------
    let existingImages = [];
    const existingRaw = formData.get("existingImages");

    if (existingRaw) {
      try {
        const parsed = JSON.parse(existingRaw);
        if (Array.isArray(parsed)) {
          existingImages = parsed.map((url) => String(url));
        }
      } catch (err) {
        console.warn("Invalid JSON existingImages");
      }
    }

    // ------------------------------------------------------
    // 2) Upload NEW images
    // ------------------------------------------------------
    const newUploaded = [];
    const incomingFiles = formData.getAll("propertyImage");

    for (const file of incomingFiles) {
      if (!file || typeof file === "string") continue;

      const buffer = await fileToBuffer(file);

      const res = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "dailyhouse/properties",
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        ).end(buffer);
      });

      newUploaded.push(res.secure_url);
    }

    const finalImages = [...existingImages, ...newUploaded];

    // ------------------------------------------------------
    // 3) FIELD GROUPS (same as POST)
    // ------------------------------------------------------
    const numberFields = [
      "price",
      "propertyFloor",
      "totalFloors",
      "carpetArea",
      "superBuiltUpArea",
      "plotSize",
      "widthOfPlot",
      "lengthOfPlot",
      "clearHeight",
      "columnSpacing",
      "SQFT",
      "Acre",
      "Bigha",
      "totalBedrooms",
      "bathroom",
    ];

    const dateFields = ["completionTime"];
    const jsonArrayFields = ["amenities", "nearByPlaces"];

    const simpleFields = [
      "postingPurpose",
      "propertyCategory",
      "propertyType",
      "location",
      "city",
      "buildingOrColonyName",
      "shopLocationType",
      "facing",
      "description",
      "transactionType",
      "status",
      "constructionYear",
      "developerName",
      "permission",
      "constructionArea",
      "ReraId",
      "landAreaUnitDisplay",
      "furniture",
      "balcony",
      "carParking",
      "waterSource",
      "propertySurrounding",
      "constructionType",
    ];

    const updates = {};

    // ------------------------------------------------------
    // SIMPLE FIELDS
    // ------------------------------------------------------
    simpleFields.forEach((field) => {
      const val = formData.get(field);
      if (val) updates[field] = String(val);
    });

    // ------------------------------------------------------
    // NUMBERS
    // ------------------------------------------------------
    numberFields.forEach((field) => {
      const val = formData.get(field);
      if (val) {
        const num = Number(val);
        if (!isNaN(num)) updates[field] = num;
      }
    });

    // ------------------------------------------------------
    // DATES
    // ------------------------------------------------------
    dateFields.forEach((field) => {
      const val = formData.get(field);
      if (val) {
        const d = new Date(val);
        if (!isNaN(d.getTime())) updates[field] = d;
      }
    });

    // ------------------------------------------------------
    // JSON ARRAYS (Object-based)
    // ------------------------------------------------------
    jsonArrayFields.forEach((field) => {
      const raw = formData.get(field);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) updates[field] = parsed; // KEEP objects
        } catch (err) {
          console.warn("Invalid JSON:", field);
        }
      }
    });

    // Force SELL for now
    updates.postingPurpose = "Sell";

    // Final images
    updates.propertyImage = finalImages;

    // ------------------------------------------------------
    // 4) UPDATE DB
    // ------------------------------------------------------
    const updated = await Property.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Property updated successfully.",
        property: updated,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Update Property Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error while updating property." },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[id] → DELETE PROPERTY
export async function DELETE(request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid property ID." },
      { status: 400 }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    await dbConnect();

    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found." },
        { status: 404 }
      );
    }

    // Only owner or admin can delete
    if (
      property.listedBy.toString() !== session.user.id &&
      session.user.role !== "Admin"
    ) {
      return NextResponse.json(
        { success: false, message: "Not authorized to delete this property." },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // 1️⃣ DELETE CLOUDINARY IMAGES (if any)
    // ----------------------------------------------------------
    const images = property.propertyImage || [];

    for (const imageUrl of images) {
      try {
        // Extract Cloudinary public_id
        const publicId = imageUrl
          .split("/dailyhouse/properties/")[1]
          ?.split(".")[0];

        if (publicId) {
          await cloudinary.uploader.destroy(
            `dailyhouse/properties/${publicId}`,
            { resource_type: "image" }
          );
        }
      } catch (err) {
        console.warn("Cloudinary delete error:", err);
      }
    }

    // ----------------------------------------------------------
    // 2️⃣ REMOVE property from user.propertiesListed
    // ----------------------------------------------------------
    await User.findByIdAndUpdate(property.listedBy, {
      $pull: { propertiesListed: property._id },
    });

    // ----------------------------------------------------------
    // 3️⃣ DELETE PROPERTY
    // ----------------------------------------------------------
    await Property.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Property deleted successfully.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete Property Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error while deleting property." },
      { status: 500 }
    );
  }
}



