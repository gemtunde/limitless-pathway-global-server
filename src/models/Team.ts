import mongoose, { Document, Schema } from "mongoose";

export interface ITeamMember extends Document {
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  location?: string;
  bio?: string;
  image?: string;
  linkedIn?: string;
  twitter?: string;
  status: "active" | "inactive" | "on-leave";
  joinDate: Date;
  skills?: string;
  languages?: string;
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: {
        values: [
          "management",
          "project-management",
          "counseling",
          "admissions",
          "visa-processing",
          "marketing",
          "finance",
          "customer-support",
        ],
        message: "Invalid department",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    image: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true; // Optional field
          const urlRegex = /^https?:\/\/.+/;
          return urlRegex.test(v);
        },
        message: "Image must be a valid URL",
      },
    },
    linkedIn: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true; // Optional field
          const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/;
          return linkedInRegex.test(v);
        },
        message: "LinkedIn must be a valid LinkedIn profile URL",
      },
    },
    twitter: {
      type: String,
      trim: true,
      maxlength: [50, "Twitter handle cannot exceed 50 characters"],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["active", "inactive", "on-leave"],
        message: "Invalid status",
      },
      default: "active",
    },
    joinDate: {
      type: Date,
      required: [true, "Join date is required"],
    },
    skills: {
      type: String,
      trim: true,
      maxlength: [300, "Skills cannot exceed 300 characters"],
    },
    languages: {
      type: String,
      trim: true,
      maxlength: [200, "Languages cannot exceed 200 characters"],
    },
  },
  {
    timestamps: true,
    //   toJSON: {
    //     transform: (doc, ret) => {
    //       ret.id = ret._id;
    //       delete ret._id;
    //       delete ret.__v;
    //       return ret;
    //     }
    //   }
  }
);

// Indexes for better query performance
teamMemberSchema.index({ email: 1 });
teamMemberSchema.index({ department: 1 });
teamMemberSchema.index({ status: 1 });
teamMemberSchema.index({ joinDate: -1 });
teamMemberSchema.index({ name: 1 });

// Compound indexes
teamMemberSchema.index({ department: 1, status: 1 });
teamMemberSchema.index({ status: 1, joinDate: -1 });

export const TeamMember = mongoose.model<ITeamMember>(
  "TeamMember",
  teamMemberSchema
);
