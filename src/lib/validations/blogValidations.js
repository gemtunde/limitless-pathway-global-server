"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogQuerySchema = exports.updateBlogSchema = exports.createBlogSchema = void 0;
const zod_1 = require("zod");
// Blog validation schemas
exports.createBlogSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Title is required")
        .max(200, "Title cannot exceed 200 characters"),
    slug: zod_1.z
        .string()
        .min(1, "Slug is required")
        .max(100, "Slug cannot exceed 100 characters"),
    excerpt: zod_1.z
        .string()
        .min(1, "Excerpt is required")
        .max(500, "Excerpt cannot exceed 500 characters"),
    content: zod_1.z.string().min(1, "Content is required"),
    featuredImage: zod_1.z
        .string()
        .url("Must be a valid image URL")
        .optional()
        .or(zod_1.z.literal("")),
    category: zod_1.z.enum([
        "study-abroad",
        "scholarships",
        "visa-guide",
        "student-life",
        "career-advice",
        "university-guide",
        "finance",
        "application-tips",
    ], {
        errorMap: () => ({ message: "Invalid category" }),
    }),
    tags: zod_1.z.string().optional(),
    status: zod_1.z.enum(["draft", "published", "archived"], {
        errorMap: () => ({ message: "Invalid status" }),
    }),
    publishDate: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined)),
    metaDescription: zod_1.z
        .string()
        .max(160, "Meta description cannot exceed 160 characters")
        .optional(),
    author: zod_1.z
        .string()
        .min(1, "Author is required")
        .max(100, "Author name cannot exceed 100 characters"),
    readTime: zod_1.z.string().optional(),
});
exports.updateBlogSchema = exports.createBlogSchema.partial().extend({
    slug: zod_1.z
        .string()
        .min(1, "Slug is required")
        .max(100, "Slug cannot exceed 100 characters")
        .optional(),
});
exports.blogQuerySchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10)),
    search: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    status: zod_1.z.enum(["draft", "published", "archived"]).optional(),
    author: zod_1.z.string().optional(),
    sortBy: zod_1.z
        .enum(["createdAt", "updatedAt", "publishDate", "title", "views"])
        .optional()
        .default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional().default("desc"),
});
