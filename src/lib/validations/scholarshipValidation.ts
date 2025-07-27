import { z } from "zod";

export const scholarshipSchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
  provider: z.string().min(1, "Provider is required").trim(),
  amount: z.string().min(1, "Amount is required").trim(),
  deadline: z
    .string()
    .min(1, "Deadline is required")
    .refine((date) => {
      return !isNaN(Date.parse(date));
    }, "Invalid date format"),
  location: z.string().min(1, "Location is required").trim(),
  level: z.enum(
    ["Undergraduate", "Graduate", "Master's", "PhD", "Postgraduate", "Various"],
    {
      errorMap: () => ({ message: "Invalid academic level" }),
    }
  ),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().min(1, "Requirements are required"),
  benefits: z.string().min(1, "Benefits are required"),
  category: z.enum(
    [
      "Research",
      "Leadership",
      "Development",
      "Exchange",
      "Academic",
      "Merit-based",
      "Need-based",
    ],
    {
      errorMap: () => ({ message: "Invalid category" }),
    }
  ),
  applicationUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  status: z.enum(["active", "inactive", "expired"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
});

export const updateScholarshipSchema = scholarshipSchema.partial();

export type ScholarshipValidationSchema = z.infer<typeof scholarshipSchema>;
export type UpdateScholarshipValidationSchema = z.infer<
  typeof updateScholarshipSchema
>;
