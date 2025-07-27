import { z } from "zod";

export const countrySchema = z.object({
  name: z.string().min(1, "Country name is required").trim(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  flagCode: z
    .string()
    .min(2, "Flag code is required")
    .max(2, "Flag code must be 2 characters")
    .trim()
    .toUpperCase(),
  description: z.string().min(1, "Description is required"),
  benefits: z.string().min(1, "Benefits are required"),
  scholarships: z.string().min(1, "Scholarships are required"),
  visaRequirements: z.string().min(1, "Visa requirements are required"),
  popularUniversities: z.string().optional(),
  costOfLiving: z.string().optional(),
  languageRequirements: z.string().optional(),
});

export const updateCountrySchema = countrySchema.partial();

export type CountryValidationSchema = z.infer<typeof countrySchema>;
export type UpdateCountryValidationSchema = z.infer<typeof updateCountrySchema>;
