import express from "express";
import eventController from "../controllers/eventController";

const router = express.Router();

// GET /api/events - Get all events with pagination and filtering
//router.get("/", eventController.getAllEvents);

// GET /api/events/upcoming - Get upcoming events
//router.get("/upcoming", eventController.getUpcomingEvents);

// GET /api/events/stats - Get event statistics
//router.get("/stats", eventController.getEventStats);

// GET /api/events/:id - Get event by ID
//router.get("/:id", eventController.getEventById);

// POST /api/events - Create new event
router.post("/", eventController.createEvent);

// PUT /api/events/:id - Update event
//router.put("/:id", eventController.updateEvent);

// PATCH /api/events/:id/registration - Update registration count
//router.patch("/:id/registration", eventController.updateRegistrationCount);

// DELETE /api/events/:id - Delete event
//router.delete("/:id", eventController.deleteEvent);

export default router;
