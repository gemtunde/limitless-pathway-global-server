"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const blogSchema = new mongoose_1.Schema({
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
    featuredImage: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                if (!v)
                    return true; // Optional field
                const urlRegex = /^https?:\/\/.+/;
                return urlRegex.test(v);
            },
            message: "Featured image must be a valid URL",
        },
    },
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
}, {
    timestamps: true,
    //   toJSON: {
    //     transform: (doc, ret) => {
    //       ret.id = ret._id;
    //       delete ret._id;
    //       delete ret.__v;
    //       return ret;
    //     }
    //   }
});
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
exports.Blog = mongoose_1.default.model("Blog", blogSchema);
