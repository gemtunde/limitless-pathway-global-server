import { z } from "zod";

export const createTeamMemberSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  title: z
    .string()
    .min(1, "Job title is required")
    .max(100, "Job title cannot exceed 100 characters"),
  department: z.enum(
    [
      "management",
      "project-management",
      "counseling",
      "admissions",
      "visa-processing",
      "marketing",
      "finance",
      "customer-support",
    ],
    {
      errorMap: () => ({ message: "Invalid department" }),
    }
  ),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .max(20, "Phone number cannot exceed 20 characters"),
  location: z
    .string()
    .max(100, "Location cannot exceed 100 characters")
    .optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  image: z
    .string()
    .url("Must be a valid image URL")
    .optional()
    .or(z.literal("")),
  linkedIn: z
    .string()
    .url("Must be a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  twitter: z
    .string()
    .max(50, "Twitter handle cannot exceed 50 characters")
    .optional(),
  status: z.enum(["active", "inactive", "on-leave"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  joinDate: z
    .string()
    .min(1, "Join date is required")
    .transform((val) => new Date(val)),
  skills: z.string().max(300, "Skills cannot exceed 300 characters").optional(),
  languages: z
    .string()
    .max(200, "Languages cannot exceed 200 characters")
    .optional(),
});

export const updateTeamMemberSchema = createTeamMemberSchema.partial().extend({
  email: z.string().email("Invalid email address").optional(),
});

export const teamQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  department: z.string().optional(),
  status: z.enum(["active", "inactive", "on-leave"]).optional(),
  sortBy: z
    .enum(["name", "joinDate", "createdAt", "updatedAt", "title", "department"])
    .optional()
    .default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

export type CreateTeamMemberData = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMemberData = z.infer<typeof updateTeamMemberSchema>;
export type TeamQueryData = z.infer<typeof teamQuerySchema>;
