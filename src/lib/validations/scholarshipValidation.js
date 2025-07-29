"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateScholarshipSchema = exports.scholarshipSchema = void 0;
const zod_1 = require("zod");
exports.scholarshipSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").trim(),
    provider: zod_1.z.string().min(1, "Provider is required").trim(),
    amount: zod_1.z.string().min(1, "Amount is required").trim(),
    deadline: zod_1.z
        .string()
        .min(1, "Deadline is required")
        .refine((date) => {
        return !isNaN(Date.parse(date));
    }, "Invalid date format"),
    location: zod_1.z.string().min(1, "Location is required").trim(),
    level: zod_1.z.enum(["Undergraduate", "Graduate", "Master's", "PhD", "Postgraduate", "Various"], {
        errorMap: () => ({ message: "Invalid academic level" }),
    }),
    description: zod_1.z.string().min(1, "Description is required"),
    requirements: zod_1.z.string().min(1, "Requirements are required"),
    benefits: zod_1.z.string().min(1, "Benefits are required"),
    category: zod_1.z.enum([
        "Research",
        "Leadership",
        "Development",
        "Exchange",
        "Academic",
        "Merit-based",
        "Need-based",
    ], {
        errorMap: () => ({ message: "Invalid category" }),
    }),
    applicationUrl: zod_1.z
        .string()
        .url("Must be a valid URL")
        .optional()
        .or(zod_1.z.literal("")),
    status: zod_1.z.enum(["active", "inactive", "expired"], {
        errorMap: () => ({ message: "Invalid status" }),
    }),
});
exports.updateScholarshipSchema = exports.scholarshipSchema.partial();
