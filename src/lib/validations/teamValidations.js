"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamQuerySchema = exports.updateTeamMemberSchema = exports.createTeamMemberSchema = void 0;
const zod_1 = require("zod");
exports.createTeamMemberSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Name is required")
        .max(100, "Name cannot exceed 100 characters"),
    title: zod_1.z
        .string()
        .min(1, "Job title is required")
        .max(100, "Job title cannot exceed 100 characters"),
    department: zod_1.z.enum([
        "management",
        "project-management",
        "counseling",
        "admissions",
        "visa-processing",
        "marketing",
        "finance",
        "customer-support",
    ], {
        errorMap: () => ({ message: "Invalid department" }),
    }),
    email: zod_1.z.string().email("Invalid email address"),
    phone: zod_1.z
        .string()
        .min(1, "Phone number is required")
        .max(20, "Phone number cannot exceed 20 characters"),
    location: zod_1.z
        .string()
        .max(100, "Location cannot exceed 100 characters")
        .optional(),
    bio: zod_1.z.string().max(500, "Bio cannot exceed 500 characters").optional(),
    image: zod_1.z
        .string()
        .url("Must be a valid image URL")
        .optional()
        .or(zod_1.z.literal("")),
    linkedIn: zod_1.z
        .string()
        .url("Must be a valid LinkedIn URL")
        .optional()
        .or(zod_1.z.literal("")),
    twitter: zod_1.z
        .string()
        .max(50, "Twitter handle cannot exceed 50 characters")
        .optional(),
    status: zod_1.z.enum(["active", "inactive", "on-leave"], {
        errorMap: () => ({ message: "Invalid status" }),
    }),
    joinDate: zod_1.z
        .string()
        .min(1, "Join date is required")
        .transform((val) => new Date(val)),
    skills: zod_1.z.string().max(300, "Skills cannot exceed 300 characters").optional(),
    languages: zod_1.z
        .string()
        .max(200, "Languages cannot exceed 200 characters")
        .optional(),
});
exports.updateTeamMemberSchema = exports.createTeamMemberSchema.partial().extend({
    email: zod_1.z.string().email("Invalid email address").optional(),
});
exports.teamQuerySchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10)),
    search: zod_1.z.string().optional(),
    department: zod_1.z.string().optional(),
    status: zod_1.z.enum(["active", "inactive", "on-leave"]).optional(),
    sortBy: zod_1.z
        .enum(["name", "joinDate", "createdAt", "updatedAt", "title", "department"])
        .optional()
        .default("name"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional().default("asc"),
});
