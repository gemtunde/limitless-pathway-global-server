import mongoose, { Schema } from "mongoose";
import { IScholarship } from "../types/index.js";

const scholarshipSchema = new Schema<IScholarship>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: String,
      required: true,
      trim: true,
    },
    deadline: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      required: true,
      enum: [
        "Undergraduate",
        "Graduate",
        "Master's",
        "PhD",
        "Postgraduate",
        "Various",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    benefits: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Research",
        "Leadership",
        "Development",
        "Exchange",
        "Academic",
        "Merit-based",
        "Need-based",
      ],
    },
    applicationUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "expired"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
scholarshipSchema.index({
  title: "text",
  provider: "text",
  description: "text",
});
scholarshipSchema.index({ deadline: 1 });
scholarshipSchema.index({ status: 1 });
scholarshipSchema.index({ category: 1 });
scholarshipSchema.index({ level: 1 });

export default mongoose.model<IScholarship>("Scholarship", scholarshipSchema);
