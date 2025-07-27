import mongoose, { Document, Schema } from "mongoose";

// Enums for better type safety
export enum ApplicationStatus {
  NEW = "new",
  REVIEWING = "reviewing",
  CONTACTED = "contacted",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  COMPLETED = "completed",
}

export enum ApplicationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

// Interface for the Application document
export interface IApplication extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  nationality: string;
  country: string;
  course: string;
  budget: string;
  qualification: string;
  message?: string;
  status: ApplicationStatus;
  priority: ApplicationPriority;
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  fullName: string; // Virtual field
}

// Interface for creating new application (without Mongoose Document properties)
export interface IApplicationCreate {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  nationality: string;
  country: string;
  course: string;
  budget: string;
  qualification: string;
  message?: string;
  status?: ApplicationStatus;
  priority?: ApplicationPriority;
  assignedTo?: string;
  notes?: string;
}

// Interface for updating application (all fields optional)
export interface IApplicationUpdate extends Partial<IApplicationCreate> {}

const applicationSchema = new Schema<IApplication>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    nationality: {
      type: String,
      required: [true, "Nationality is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Preferred country is required"],
      trim: true,
    },
    course: {
      type: String,
      required: [true, "Course of interest is required"],
      trim: true,
    },
    budget: {
      type: String,
      required: [true, "Budget is required"],
      trim: true,
    },
    qualification: {
      type: String,
      required: [true, "Educational qualification is required"],
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.NEW,
    },
    priority: {
      type: String,
      enum: Object.values(ApplicationPriority),
      default: ApplicationPriority.MEDIUM,
    },
    assignedTo: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
applicationSchema.virtual("fullName").get(function (this: IApplication) {
  return `${this.firstName} ${this.lastName}`;
});

// Index for better query performance
applicationSchema.index({ email: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ priority: 1 });
applicationSchema.index({ createdAt: -1 });

const Application = mongoose.model<IApplication>(
  "Application",
  applicationSchema
);

export default Application;
