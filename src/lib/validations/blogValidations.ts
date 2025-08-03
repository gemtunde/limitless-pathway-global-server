import { z } from "zod";

// Schema for image object from frontend
const imageSchema = z
  .object({
    path: z.string().min(1, "Image path is required"),
    relativePath: z.string().min(1, "Image relative path is required"),
  })
  .optional();

// Available categories
const categoryEnum = z.enum(
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
    errorMap: () => ({ message: "Invalid category selected" }),
  }
);

// Available status options
const statusEnum = z.enum(["draft", "published", "archived"], {
  errorMap: () => ({ message: "Invalid status selected" }),
});

export const createBlogSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters")
    .trim(),

  slug: z.string().min(1, "Slug is required").trim(),

  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(500, "Excerpt cannot exceed 500 characters")
    .trim(),

  content: z.string().min(1, "Content is required"),

  image: z.string().optional(),

  category: categoryEnum,

  tags: z.string().optional().default(""),

  status: statusEnum.default("draft"),

  publishDate: z
    .string()
    .optional()
    .default("")
    .refine(
      (date) => {
        if (!date || date === "") return true;
        return !isNaN(Date.parse(date));
      },
      {
        message: "Invalid date format",
      }
    ),

  metaDescription: z
    .string()
    .max(160, "Meta description cannot exceed 160 characters")
    .optional()
    .default(""),

  author: z.string().min(1, "Author is required").trim(),

  readTime: z.string().optional().default(""),
});

export const updateBlogSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters")
    .trim()
    .optional(),

  slug: z.string().min(1, "Slug is required").trim().optional(),

  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(500, "Excerpt cannot exceed 500 characters")
    .trim()
    .optional(),

  content: z.string().min(1, "Content is required").optional(),

  image: z.string().optional(),

  category: categoryEnum.optional(),

  tags: z.string().optional(),

  status: statusEnum.optional(),

  publishDate: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date || date === "") return true;
        return !isNaN(Date.parse(date));
      },
      {
        message: "Invalid date format",
      }
    ),

  metaDescription: z
    .string()
    .max(160, "Meta description cannot exceed 160 characters")
    .optional(),

  author: z.string().min(1, "Author is required").trim().optional(),

  readTime: z.string().optional(),
});

// Type exports
export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type ImageInput = z.infer<typeof imageSchema>;
