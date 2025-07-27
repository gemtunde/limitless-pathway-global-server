import mongoose, { Schema, Document } from "mongoose";

// Define the icon and color types
export type IconType = "globe" | "graduation-cap" | "users" | "book";
export type ColorType = "green" | "red" | "blue" | "yellow";

// Interface for the Service document
export interface IService extends Document {
  title: string;
  description: string;
  icon: IconType;
  color: ColorType;
  features: string;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      unique: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    icon: {
      type: String,
      required: [true, "Icon is required"],
      enum: {
        values: ["globe", "graduation-cap", "users", "book"],
        message: "Icon must be one of: globe, graduation-cap, users, book",
      },
    },
    color: {
      type: String,
      required: [true, "Color is required"],
      enum: {
        values: ["green", "red", "blue", "yellow"],
        message: "Color must be one of: green, red, blue, yellow",
      },
    },
    features: {
      type: String,
      required: [true, "Features are required"],
      trim: true,
      maxlength: [2000, "Features cannot exceed 2000 characters"],
    },
  },
  {
    timestamps: true,
    //   toJSON: {
    //     transform: function(doc, ret) {
    //       ret.id = ret._id;
    //       delete ret._id;
    //       delete ret.__v;
    //       return ret;
    //     }
    //   }
  }
);

// Index for better query performance
serviceSchema.index({ title: 1 });
serviceSchema.index({ createdAt: -1 });

export const ServiceModel = mongoose.model<IService>("Service", serviceSchema);
