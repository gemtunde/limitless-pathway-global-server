"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationQuerySchema = exports.applicationUpdateSchema = exports.applicationSchema = void 0;
const zod_1 = require("zod");
const Application_1 = require("../../models/Application");
exports.applicationSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .min(1, "First name is required")
        .max(50, "First name cannot exceed 50 characters")
        .trim(),
    lastName: zod_1.z
        .string()
        .min(1, "Last name is required")
        .max(50, "Last name cannot exceed 50 characters")
        .trim(),
    email: zod_1.z.string().email("Invalid email address").toLowerCase().trim(),
    phone: zod_1.z.string().min(1, "Phone number is required").trim(),
    city: zod_1.z.string().min(1, "City is required").trim(),
    nationality: zod_1.z.string().min(1, "Nationality is required").trim(),
    country: zod_1.z.string().min(1, "Preferred country is required").trim(),
    course: zod_1.z.string().min(1, "Course of interest is required").trim(),
    budget: zod_1.z.string().min(1, "Budget is required").trim(),
    qualification: zod_1.z
        .string()
        .min(1, "Educational qualification is required")
        .trim(),
    message: zod_1.z
        .string()
        .max(1000, "Message cannot exceed 1000 characters")
        .trim()
        .optional(),
    status: zod_1.z.nativeEnum(Application_1.ApplicationStatus).optional(),
    priority: zod_1.z.nativeEnum(Application_1.ApplicationPriority).optional(),
    assignedTo: zod_1.z.string().trim().optional(),
    notes: zod_1.z
        .string()
        .max(2000, "Notes cannot exceed 2000 characters")
        .trim()
        .optional(),
});
// Application update schema (all fields optional except id)
exports.applicationUpdateSchema = exports.applicationSchema.partial();
exports.applicationQuerySchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .regex(/^\d+$/, "Page must be a number")
        .transform(Number)
        .optional(),
    limit: zod_1.z
        .string()
        .regex(/^\d+$/, "Limit must be a number")
        .transform(Number)
        .optional(),
    status: zod_1.z.nativeEnum(Application_1.ApplicationStatus).optional(),
    priority: zod_1.z.nativeEnum(Application_1.ApplicationPriority).optional(),
    country: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z
        .enum(["createdAt", "updatedAt", "firstName", "lastName", "email"])
        .optional(),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
});
