import { z } from "zod";

// FAQ validation schemas
export const createFaqSchema = z.object({
  question: z
    .string()
    .min(1, "Question is required")
    .max(500, "Question cannot exceed 500 characters"),
  answer: z.string().min(1, "Answer is required"),
  category: z.enum(
    [
      "general",
      "applications",
      "scholarships",
      "visa",
      "costs",
      "countries",
      "support",
      "documents",
    ],
    {
      errorMap: () => ({ message: "Invalid category" }),
    }
  ),
  tags: z.string().optional(),
  order: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  status: z.enum(["published", "draft", "archived"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  helpful: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0)),
  notHelpful: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0)),
});

export const updateFaqSchema = createFaqSchema.partial();

export const faqQuerySchema = z.object({
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
  status: z.enum(["published", "draft", "archived"]).optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "order", "question", "helpful"])
    .optional()
    .default("order"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Generic validation schemas
export const mongoIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
});

export type CreateFaqData = z.infer<typeof createFaqSchema>;
export type UpdateFaqData = z.infer<typeof updateFaqSchema>;
export type FaqQueryData = z.infer<typeof faqQuerySchema>;
