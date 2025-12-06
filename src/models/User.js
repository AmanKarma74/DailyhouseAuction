// src/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },

    number: {
      type: String,
      required: [true, "Phone number is required"],
    },

    password: {
      type: String,
      required: false,
      select: false, 
    },

    residentialAddress: {
      type: String,
      default: "",
    },

    // Only two roles required for full system
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },

    likedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],

    // Seller Type (Only after onboarding)
    listingUser: {
      type: String,
      enum: ["Owner", "Broker", "Builder"],
      default: null,
    },

    // Owner specific
    occupation: {
      type: String,
      default: "",
    },

    // Broker / Builder specific
    businessName: {
      type: String,
      default: "",
    },

    operatingSince: {
      type: String,
      default: "",
    },

    workingArea: {
      type: String,
      default: "",
    },

    officeAddress: {
      type: String,
      default: "",
    },

    dateOfBirth: {
      type: Date,
    },

    profilePicUrl: {
      type: String,
      default: "/assets/men_img.jpg",
    },

    idProof: {
      type: String,
      default: "",
    },

    propertiesListed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],

    onboarded: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    rejectReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
