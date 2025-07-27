import { z } from "zod";

// Blog validation schemas
export const createBlogSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug cannot exceed 100 characters"),
  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(500, "Excerpt cannot exceed 500 characters"),
  content: z.string().min(1, "Content is required"),
  featuredImage: z
    .string()
    .url("Must be a valid image URL")
    .optional()
    .or(z.literal("")),
  category: z.enum(
    [
      "study-abroad",
      "scholarships",
      "visa-guide",
      "student-life",
      "career-advice",
      "university-guide",
      "finance",
      "application-tips",
    ],
    {
      errorMap: () => ({ message: "Invalid category" }),
    }
  ),
  tags: z.string().optional(),
  status: z.enum(["draft", "published", "archived"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  publishDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  metaDescription: z
    .string()
    .max(160, "Meta description cannot exceed 160 characters")
    .optional(),
  author: z
    .string()
    .min(1, "Author is required")
    .max(100, "Author name cannot exceed 100 characters"),
  readTime: z.string().optional(),
});

export const updateBlogSchema = createBlogSchema.partial().extend({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug cannot exceed 100 characters")
    .optional(),
});

export const blogQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  author: z.string().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "publishDate", "title", "views"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type CreateBlogData = z.infer<typeof createBlogSchema>;
export type UpdateBlogData = z.infer<typeof updateBlogSchema>;
export type BlogQueryData = z.infer<typeof blogQuerySchema>;
