import mongoose, { Schema } from "mongoose";
import { IEvent } from "../types/index.js";

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: ["virtual", "in-person", "hybrid"],
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    maxAttendees: {
      type: String,
      default: "",
    },
    registrationFee: {
      type: String,
      default: "",
    },
    targetAudience: {
      type: String,
      required: true,
    },
    agenda: {
      type: String,
      default: "",
    },
    speakers: {
      type: String,
      default: "",
    },
    requirements: {
      type: String,
      default: "",
    },
    registrationDeadline: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "draft",
    },
    featuredImage: {
      type: String,
      default: "",
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
eventSchema.index({ title: "text", description: "text" });
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ registrationDeadline: 1 });

export default mongoose.model<IEvent>("Event", eventSchema);
