import { z } from "zod";

const iconEnum = [
  "CheckCircle",
  "FileText",
  "GraduationCap",
  "Plane",
  "Users",
  "CreditCard",
] as const;
const colorEnum = [
  "green",
  "red",
  "blue",
  "yellow",
  "orange",
  "purple",
] as const;

export const createServiceSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters")
    .trim(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description cannot exceed 1000 characters")
    .trim(),
  icon: z.enum(iconEnum, {
    required_error: "Icon is required",
    invalid_type_error: "Invalid icon selected",
  }),
  color: z.enum(colorEnum, {
    required_error: "Color is required",
    invalid_type_error: "Invalid color selected",
  }),
  features: z
    .string()
    .min(1, "Features are required")
    .max(2000, "Features cannot exceed 2000 characters")
    .trim(),
});

export const updateServiceSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title cannot exceed 100 characters")
      .trim()
      .optional(),
    description: z
      .string()
      .min(1, "Description is required")
      .max(1000, "Description cannot exceed 1000 characters")
      .trim()
      .optional(),
    icon: z
      .enum(iconEnum, {
        invalid_type_error: "Invalid icon selected",
      })
      .optional(),
    color: z
      .enum(colorEnum, {
        invalid_type_error: "Invalid color selected",
      })
      .optional(),
    features: z
      .string()
      .min(1, "Features are required")
      .max(2000, "Features cannot exceed 2000 characters")
      .trim()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// Type exports for TypeScript
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
