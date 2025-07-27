import { z } from "zod";
import {
  ApplicationPriority,
  ApplicationStatus,
} from "../../models/Application";

export const applicationSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters")
    .trim(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters")
    .trim(),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  phone: z.string().min(1, "Phone number is required").trim(),
  city: z.string().min(1, "City is required").trim(),
  nationality: z.string().min(1, "Nationality is required").trim(),
  country: z.string().min(1, "Preferred country is required").trim(),
  course: z.string().min(1, "Course of interest is required").trim(),
  budget: z.string().min(1, "Budget is required").trim(),
  qualification: z
    .string()
    .min(1, "Educational qualification is required")
    .trim(),
  message: z
    .string()
    .max(1000, "Message cannot exceed 1000 characters")
    .trim()
    .optional(),
  status: z.nativeEnum(ApplicationStatus).optional(),
  priority: z.nativeEnum(ApplicationPriority).optional(),
  assignedTo: z.string().trim().optional(),
  notes: z
    .string()
    .max(2000, "Notes cannot exceed 2000 characters")
    .trim()
    .optional(),
});

// Application update schema (all fields optional except id)
export const applicationUpdateSchema = applicationSchema.partial();

export const applicationQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a number")
    .transform(Number)
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .transform(Number)
    .optional(),
  status: z.nativeEnum(ApplicationStatus).optional(),
  priority: z.nativeEnum(ApplicationPriority).optional(),
  country: z.string().optional(),
  search: z.string().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "firstName", "lastName", "email"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
export type ApplicationUpdateInput = z.infer<typeof applicationUpdateSchema>;
export type ApplicationQueryParams = z.infer<typeof applicationQuerySchema>;
