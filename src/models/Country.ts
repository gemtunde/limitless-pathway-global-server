import mongoose, { Schema } from "mongoose";
import { ICountry } from "../types";
//import { ICountry } from "../types/index.js";

const countrySchema = new Schema<ICountry>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    flagCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 2,
    },
    description: {
      type: String,
      required: true,
    },
    benefits: {
      type: String,
      required: true,
    },
    scholarships: {
      type: String,
      required: true,
    },
    visaRequirements: {
      type: String,
      required: true,
    },
    popularUniversities: {
      type: String,
      default: "",
    },
    costOfLiving: {
      type: String,
      default: "",
    },
    languageRequirements: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
countrySchema.index({ name: "text", description: "text" });
countrySchema.index({ slug: 1 });
countrySchema.index({ status: 1 });
countrySchema.index({ flagCode: 1 });

export default mongoose.model<ICountry>("Country", countrySchema);
