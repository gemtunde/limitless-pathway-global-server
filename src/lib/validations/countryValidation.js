"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCountrySchema = exports.countrySchema = void 0;
const zod_1 = require("zod");
exports.countrySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Country name is required").trim(),
    slug: zod_1.z
        .string()
        .min(1, "Slug is required")
        .trim()
        .toLowerCase()
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
    flagCode: zod_1.z
        .string()
        .min(2, "Flag code is required")
        .max(2, "Flag code must be 2 characters")
        .trim()
        .toUpperCase(),
    description: zod_1.z.string().min(1, "Description is required"),
    benefits: zod_1.z.string().min(1, "Benefits are required"),
    scholarships: zod_1.z.string().min(1, "Scholarships are required"),
    visaRequirements: zod_1.z.string().min(1, "Visa requirements are required"),
    popularUniversities: zod_1.z.string().optional(),
    costOfLiving: zod_1.z.string().optional(),
    languageRequirements: zod_1.z.string().optional(),
});
exports.updateCountrySchema = exports.countrySchema.partial();
