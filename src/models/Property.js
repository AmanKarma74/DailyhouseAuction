// src/models/Property.js
import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    // Reference to User who posted
    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Basic Info
    postingPurpose: {
      type: String,
      enum: ["Sell", "Rent", "Lease"],
      required: true,
    },
    propertyCategory: {
      type: String,
      enum: ["Residential", "Commercial", "New Project", "Land"],
      required: true,
    },
    propertyType: {
      type: String, // House, Flat, Villa etc.
    },
    
    // Location Details
    location: { type: String, required: true },
    city: { type: String, default: "Indore" }, // Default set kar sakte hain
    buildingOrColonyName: String,
    shopLocationType: String,
    
    // Dimensions & Specs
    propertyFloor: Number,
    totalFloors: Number,
    carpetArea: Number,       // Numbers me calculations aasan hoti hain
    superBuiltUpArea: Number,
    plotSize: Number,
    widthOfPlot: Number,
    lengthOfPlot: Number,
    facing: String,

    // 🆕 Warehouse-specific dimension fields
    clearHeight: Number,     // in meters
    columnSpacing: Number,   // in meters
    
    // Pricing
    price: {
      type: Number,
      required: true,
    },
    
    // Media
    propertyImage: [String], // Array of Cloudinary URLs
    description: String,
    
    // Status Details
    transactionType: { type: String, enum: ["New Property", "Resale"] },
    status: String, // Ready to move, Under Construction
    constructionYear: String,
    completionTime: Date,
    developerName: String,
    
    // Legal/Specifics
    permission: String, // tinshed, building etc.
    constructionArea: String,
    ReraId: String,
    
    // Land Specifics
    SQFT: Number,
    Acre: Number,
    Bigha: Number,
    landAreaUnitDisplay: String, //['SQFT', 'Acre', 'Bigha']
    
    // Features (Flat/House)
    furniture: String,
    totalBedrooms: { type: Number, default: 0 },
    bathroom: { type: Number, default: 0 },
    balcony: String,
    carParking: String,
    
    // Amenities & Surroundings
    waterSource: String,
    propertySurrounding: String,
    constructionType: String,

    amenities: [mongoose.Schema.Types.Mixed],   // { name, icon }
    nearByPlaces: [mongoose.Schema.Types.Mixed], // { name, icon }
    
    isVerified: {
        type: Boolean,
        default: false
    }
  },
  { timestamps: true }
);

const Property = mongoose.models.Property || mongoose.model("Property", PropertySchema);

export default Property;
