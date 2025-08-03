import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  //imagePublicId?: string;
  category: string;
  tags?: string;
  status: "draft" | "published" | "archived";
  publishDate?: Date;
  metaDescription?: string;
  author: string;
  readTime?: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [100, "Slug cannot exceed 100 characters"],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    // imagePublicId: {
    //   type: String,
    //   default: "",
    // },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "study-abroad",
          "scholarships",
          "visa-guide",
          "student-life",
          "career-advice",
          "university-guide",
          "finance",
          "application-tips",
        ],
        message: "Invalid category",
      },
    },
    tags: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["draft", "published", "archived"],
        message: "Invalid status",
      },
      default: "draft",
    },
    publishDate: {
      type: Date,
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      maxlength: [100, "Author name cannot exceed 100 characters"],
    },
    readTime: {
      type: String,
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
      min: [0, "Views cannot be negative"],
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
blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ publishDate: -1 });
blogSchema.index({ createdAt: -1 });

// Pre-save middleware to set publishDate when status changes to published
blogSchema.pre("save", function (next) {
  if (this.status === "published" && !this.publishDate) {
    this.publishDate = new Date();
  }
  next();
});

export const Blog = mongoose.model<IBlog>("Blog", blogSchema);
