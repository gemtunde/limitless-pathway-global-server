"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceSchema = exports.createServiceSchema = void 0;
const zod_1 = require("zod");
const iconEnum = ["globe", "graduation-cap", "users", "book"];
const colorEnum = ["green", "red", "blue", "yellow"];
exports.createServiceSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Title is required")
        .max(100, "Title cannot exceed 100 characters")
        .trim(),
    description: zod_1.z
        .string()
        .min(1, "Description is required")
        .max(1000, "Description cannot exceed 1000 characters")
        .trim(),
    icon: zod_1.z.enum(iconEnum, {
        required_error: "Icon is required",
        invalid_type_error: "Invalid icon selected",
    }),
    color: zod_1.z.enum(colorEnum, {
        required_error: "Color is required",
        invalid_type_error: "Invalid color selected",
    }),
    features: zod_1.z
        .string()
        .min(1, "Features are required")
        .max(2000, "Features cannot exceed 2000 characters")
        .trim(),
});
exports.updateServiceSchema = zod_1.z
    .object({
    title: zod_1.z
        .string()
        .min(1, "Title is required")
        .max(100, "Title cannot exceed 100 characters")
        .trim()
        .optional(),
    description: zod_1.z
        .string()
        .min(1, "Description is required")
        .max(1000, "Description cannot exceed 1000 characters")
        .trim()
        .optional(),
    icon: zod_1.z
        .enum(iconEnum, {
        invalid_type_error: "Invalid icon selected",
    })
        .optional(),
    color: zod_1.z
        .enum(colorEnum, {
        invalid_type_error: "Invalid color selected",
    })
        .optional(),
    features: zod_1.z
        .string()
        .min(1, "Features are required")
        .max(2000, "Features cannot exceed 2000 characters")
        .trim()
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
});
