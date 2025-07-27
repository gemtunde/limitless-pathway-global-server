import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Event title is required").trim(),
  description: z.string().min(1, "Description is required"),
  eventType: z.enum(["virtual", "in-person", "hybrid"], {
    errorMap: () => ({ message: "Invalid event type" }),
  }),
  date: z
    .string()
    .min(1, "Date is required")
    .refine((date) => {
      return !isNaN(Date.parse(date));
    }, "Invalid date format"),
  time: z
    .string()
    .min(1, "Time is required")
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  duration: z.string().min(1, "Duration is required").trim(),
  location: z.string().min(1, "Location is required").trim(),
  maxAttendees: z.string().optional(),
  registrationFee: z.string().optional(),
  targetAudience: z.string().min(1, "Target audience is required"),
  agenda: z.string().optional(),
  speakers: z.string().optional(),
  requirements: z.string().optional(),
  registrationDeadline: z
    .string()
    .optional()
    .refine((date) => {
      if (!date || date === "") return true;
      return !isNaN(Date.parse(date));
    }, "Invalid registration deadline format"),
  status: z.enum(["draft", "published", "cancelled", "completed"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  featuredImage: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export const updateEventSchema = eventSchema.partial();

export type EventValidationSchema = z.infer<typeof eventSchema>;
export type UpdateEventValidationSchema = z.infer<typeof updateEventSchema>;

//import { z } from 'zod';

// const eventSchema = z.object({
//   title: z.string().min(1, "Event title is required").trim(),
//   description: z.string().min(1, "Description is required"),
//   eventType: z.enum(['virtual', 'in-person', 'hybrid'], {
//     errorMap: () => ({ message: "Invalid event type" })
//   }),
//   date: z.string().min(1, "Date is required").refine((date) => {
//     return !isNaN(Date.parse(date));
//   }, "Invalid date format"),
//   time: z.string().min(1, "Time is required").regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
//   duration: z.string().min(1, "Duration is required").trim(),
//   location: z.string().min(1, "Location is required").trim(),
//   maxAttendees: z.string().optional(),
//   registrationFee: z.string().optional(),
//   targetAudience: z.string().min(1, "Target audience is required"),
//   agenda: z.string().optional(),
//   speakers: z.string().optional(),
//   requirements: z.string().optional(),
//   registrationDeadline: z.string().optional().refine((date) => {
//     if (!date || date === '') return true;
//     return !isNaN(Date.parse(date));
//   }, "Invalid registration deadline format"),
//   status: z.enum(['draft', 'published', 'cancelled', 'completed'], {
//     errorMap: () => ({ message: "Invalid status" })
//   }),
//   featuredImage: z.string().url("Must be a valid URL").optional().or(z.literal(""))
// });

//const updateEventSchema = eventSchema.partial();

// export {
//   eventSchema,
//   updateEventSchema
// };
