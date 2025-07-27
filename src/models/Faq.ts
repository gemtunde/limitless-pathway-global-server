import mongoose, { Document, Schema } from "mongoose";

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: string;
  tags?: string;
  order?: number;
  status: "published" | "draft" | "archived";
  helpful: number;
  notHelpful: number;
  createdAt: Date;
  updatedAt: Date;
}

const faqSchema = new Schema<IFAQ>(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
      maxlength: [500, "Question cannot exceed 500 characters"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "general",
          "applications",
          "scholarships",
          "visa",
          "costs",
          "countries",
          "support",
          "documents",
        ],
        message: "Invalid category",
      },
    },
    tags: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      min: [1, "Order must be at least 1"],
      max: [1000, "Order cannot exceed 1000"],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["published", "draft", "archived"],
        message: "Invalid status",
      },
      default: "published",
    },
    helpful: {
      type: Number,
      default: 0,
      min: [0, "Helpful count cannot be negative"],
    },
    notHelpful: {
      type: Number,
      default: 0,
      min: [0, "Not helpful count cannot be negative"],
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
faqSchema.index({ category: 1 });
faqSchema.index({ status: 1 });
faqSchema.index({ order: 1 });
faqSchema.index({ createdAt: -1 });

// Compound index for category and order
faqSchema.index({ category: 1, order: 1 });

export const FAQ = mongoose.model<IFAQ>("FAQ", faqSchema);
