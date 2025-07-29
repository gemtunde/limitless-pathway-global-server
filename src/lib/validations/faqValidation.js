"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoIdSchema = exports.faqQuerySchema = exports.updateFaqSchema = exports.createFaqSchema = void 0;
const zod_1 = require("zod");
// FAQ validation schemas
exports.createFaqSchema = zod_1.z.object({
    question: zod_1.z
        .string()
        .min(1, "Question is required")
        .max(500, "Question cannot exceed 500 characters"),
    answer: zod_1.z.string().min(1, "Answer is required"),
    category: zod_1.z.enum([
        "general",
        "applications",
        "scholarships",
        "visa",
        "costs",
        "countries",
        "support",
        "documents",
    ], {
        errorMap: () => ({ message: "Invalid category" }),
    }),
    tags: zod_1.z.string().optional(),
    order: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : undefined)),
    status: zod_1.z.enum(["published", "draft", "archived"], {
        errorMap: () => ({ message: "Invalid status" }),
    }),
    helpful: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 0)),
    notHelpful: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 0)),
});
exports.updateFaqSchema = exports.createFaqSchema.partial();
exports.faqQuerySchema = zod_1.z.object({
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
    status: zod_1.z.enum(["published", "draft", "archived"]).optional(),
    sortBy: zod_1.z
        .enum(["createdAt", "updatedAt", "order", "question", "helpful"])
        .optional()
        .default("order"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional().default("asc"),
});
// Generic validation schemas
exports.mongoIdSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
});
