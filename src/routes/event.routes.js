"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventController_1 = __importDefault(require("../controllers/eventController"));
const router = express_1.default.Router();
// GET /api/events - Get all events with pagination and filtering
router.get("/", eventController_1.default.getAllEvents);
// GET /api/events/upcoming - Get upcoming events
//router.get("/upcoming", eventController.getUpcomingEvents);
// GET /api/events/stats - Get event statistics
//router.get("/stats", eventController.getEventStats);
// GET /api/events/:id - Get event by ID
router.get("/:id", eventController_1.default.getEventById);
// POST /api/events - Create new event
router.post("/", eventController_1.default.createEvent);
// PUT /api/events/:id - Update event
router.put("/:id", eventController_1.default.updateEvent);
// PATCH /api/events/:id/registration - Update registration count
//router.patch("/:id/registration", eventController.updateRegistrationCount);
// DELETE /api/events/:id - Delete event
router.delete("/:id", eventController_1.default.deleteEvent);
exports.default = router;
