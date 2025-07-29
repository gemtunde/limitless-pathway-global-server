"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = __importDefault(require("../models/Events"));
class EventService {
    // Get all events with optional filtering and pagination
    getAllEvents() {
        return __awaiter(this, arguments, void 0, function* (query = {}) {
            const { page = "1", limit = "10", search, status, eventType, sortBy = "date", sortOrder = "asc", } = query;
            const filter = {};
            // Add search functionality
            if (search) {
                filter.$text = { $search: search };
            }
            // Add filters
            if (status)
                filter.status = status;
            if (eventType)
                filter.eventType = eventType;
            // Calculate pagination
            const skip = (parseInt(page) - 1) * parseInt(limit);
            // Create sort object
            const sort = {};
            sort[sortBy] = sortOrder === "desc" ? -1 : 1;
            try {
                const events = yield Events_1.default.find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(parseInt(limit));
                const total = yield Events_1.default.countDocuments(filter);
                const totalPages = Math.ceil(total / parseInt(limit));
                const pagination = {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: total,
                    itemsPerPage: parseInt(limit),
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1,
                };
                return {
                    events,
                    pagination,
                };
            }
            catch (error) {
                throw new Error(`Error fetching events: ${error.message}`);
            }
        });
    }
    // Get event by ID
    getEventById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield Events_1.default.findById(id);
                if (!event) {
                    throw new Error("Event not found");
                }
                return event;
            }
            catch (error) {
                throw new Error(`Error fetching event: ${error.message}`);
            }
        });
    }
    // Create new event
    createEvent(eventData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Convert date string to Date object
                if (eventData.date && typeof eventData.date === "string") {
                    eventData.date = eventData.date;
                }
                if (eventData.registrationDeadline &&
                    typeof eventData.registrationDeadline === "string") {
                    eventData.registrationDeadline = eventData.registrationDeadline;
                }
                const event = new Events_1.default(eventData);
                return yield event.save();
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new Error("Event with this title already exists");
                }
                throw new Error(`Error creating event: ${error.message}`);
            }
        });
    }
    // Update event
    updateEvent(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Keep date as a string, do not convert to Date object
                if (updateData.date && typeof updateData.date === "string") {
                    updateData.date = updateData.date;
                }
                if (updateData.registrationDeadline &&
                    typeof updateData.registrationDeadline === "string") {
                    // Keep registrationDeadline as a string, do not convert to Date
                    updateData.registrationDeadline = updateData.registrationDeadline;
                }
                const event = yield Events_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { new: true, runValidators: true });
                if (!event) {
                    throw new Error("Event not found");
                }
                return event;
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new Error("Event with this title already exists");
                }
                throw new Error(`Error updating event: ${error.message}`);
            }
        });
    }
    // Delete event
    deleteEvent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield Events_1.default.findByIdAndDelete(id);
                if (!event) {
                    throw new Error("Event not found");
                }
                return event;
            }
            catch (error) {
                throw new Error(`Error deleting event: ${error.message}`);
            }
        });
    }
    // Get upcoming events
    getUpcomingEvents() {
        return __awaiter(this, arguments, void 0, function* (limit = 5) {
            try {
                const events = yield Events_1.default.find({
                    date: { $gte: new Date() },
                    status: "published",
                })
                    .sort({ date: 1 })
                    .limit(limit);
                return events;
            }
            catch (error) {
                throw new Error(`Error fetching upcoming events: ${error.message}`);
            }
        });
    }
}
const eventService = new EventService();
exports.default = eventService;
