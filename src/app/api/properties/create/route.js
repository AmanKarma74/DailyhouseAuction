// src/app/api/properties/create/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import dbConnect from "@/lib/dbConnect";
import Property from "@/models/Property";
import cloudinary from "@/lib/cloudinaryConfig";
import User from "@/models/User";

export const runtime = "nodejs";

// Helper to convert File → Buffer
async function fileToBuffer(file) {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    await dbConnect();

    const formData = await request.formData();

    // ------------------------------------------------------
    // 1. Extract existingImages for edit mode
    // ------------------------------------------------------
    const existingImages = JSON.parse(
      formData.get("existingImages") || "[]"
    );

    // ------------------------------------------------------
    // 2. FIELD GROUPS
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
      "bathroom"
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
      "constructionType"
    ];

    const data = {};

    // ------------------------------------------------------
    // 3. SIMPLE FIELDS
    // ------------------------------------------------------
    simpleFields.forEach(field => {
      const val = formData.get(field);
      if (val) data[field] = String(val);
    });

    // ------------------------------------------------------
    // 4. NUMBERS
    // ------------------------------------------------------
    numberFields.forEach(field => {
      const val = formData.get(field);
      if (val) {
        const num = Number(val);
        if (!isNaN(num)) data[field] = num;
      }
    });

    // ------------------------------------------------------
    // 5. DATES
    // ------------------------------------------------------
    dateFields.forEach(field => {
      const val = formData.get(field);
      if (val) {
        const d = new Date(val);
        if (!isNaN(d.getTime())) data[field] = d;
      }
    });

    // ------------------------------------------------------
    // 6. JSON ARRAYS (amenities / nearByPlaces)
    // ------------------------------------------------------
    jsonArrayFields.forEach(field => {
      const raw = formData.get(field);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) data[field] = parsed; // keep objects
        } catch (err) {
          console.warn("Invalid JSON for", field);
        }
      }
    });

    // Force only selling for now
    data.postingPurpose = "Sell";

    // Add user ID
    data.listedBy = session.user.id;

    // ------------------------------------------------------
    // 7. IMAGE UPLOAD
    // ------------------------------------------------------
    const uploadedUrls = [...existingImages]; // keep old ones

    const imageFiles = formData.getAll("propertyImage");

    for (const file of imageFiles) {
      if (!file || typeof file === "string") continue;

      const buffer = await fileToBuffer(file);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "dailyhouse/properties",
            resource_type: "image"
          },
          (error, res) => {
            if (error) return reject(error);
            resolve(res);
          }
        ).end(buffer);
      });

      uploadedUrls.push(result.secure_url);
    }

    data.propertyImage = uploadedUrls;

    // ------------------------------------------------------
    // 8. Validate
    // ------------------------------------------------------
    if (!data.propertyCategory || !data.propertyType || !data.location || !data.price) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // ------------------------------------------------------
    // 9. SAVE IN DB
    // ------------------------------------------------------
    const created = await Property.create(data);

    await User.findByIdAndUpdate(
      session.user?.id,
      { $push: { propertiesListed: created._id } },
      { new: true }
    );

    return NextResponse.json(
      { success: true, message: "Property created successfully.", property: created },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error while creating property." },
      { status: 500 }
    );
  }
}
