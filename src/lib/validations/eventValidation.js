"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventSchema = exports.eventSchema = void 0;
const zod_1 = require("zod");
exports.eventSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Event title is required").trim(),
    description: zod_1.z.string().min(1, "Description is required"),
    eventType: zod_1.z.enum(["virtual", "in-person", "hybrid"], {
        errorMap: () => ({ message: "Invalid event type" }),
    }),
    date: zod_1.z
        .string()
        .min(1, "Date is required")
        .refine((date) => {
        return !isNaN(Date.parse(date));
    }, "Invalid date format"),
    time: zod_1.z
        .string()
        .min(1, "Time is required")
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    duration: zod_1.z.string().min(1, "Duration is required").trim(),
    location: zod_1.z.string().min(1, "Location is required").trim(),
    maxAttendees: zod_1.z.string().optional(),
    registrationFee: zod_1.z.string().optional(),
    targetAudience: zod_1.z.string().min(1, "Target audience is required"),
    agenda: zod_1.z.string().optional(),
    speakers: zod_1.z.string().optional(),
    requirements: zod_1.z.string().optional(),
    registrationDeadline: zod_1.z
        .string()
        .optional()
        .refine((date) => {
        if (!date || date === "")
            return true;
        return !isNaN(Date.parse(date));
    }, "Invalid registration deadline format"),
    status: zod_1.z.enum(["draft", "published", "cancelled", "completed"], {
        errorMap: () => ({ message: "Invalid status" }),
    }),
    featuredImage: zod_1.z
        .string()
        .url("Must be a valid URL")
        .optional()
        .or(zod_1.z.literal("")),
});
exports.updateEventSchema = exports.eventSchema.partial();
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
