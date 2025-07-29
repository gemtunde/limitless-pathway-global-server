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
const eventService_1 = __importDefault(require("../services/eventService"));
const eventValidation_1 = require("../lib/validations/eventValidation");
//import eventService from '../services/eventService.js';
//import { eventSchema, updateEventSchema } from '../validations/eventValidation';
//import { EventQuery, ApiResponse, IEvent } from '../types/index.js';
class EventController {
    // Get all events
    getAllEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield eventService_1.default.getAllEvents(req.query);
                const response = {
                    success: true,
                    message: "Events retrieved successfully",
                    data: result.events,
                    pagination: result.pagination,
                };
                res.status(200).json(response);
            }
            catch (error) {
                const response = {
                    success: false,
                    message: error.message,
                };
                res.status(500).json(response);
            }
        });
    }
    // Get event by ID
    getEventById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield eventService_1.default.getEventById(req.params.id);
                const response = {
                    success: true,
                    message: "Event retrieved successfully",
                    data: event,
                };
                res.status(200).json(response);
            }
            catch (error) {
                const statusCode = error.message.includes("not found")
                    ? 404
                    : 500;
                const response = {
                    success: false,
                    message: error.message,
                };
                res.status(statusCode).json(response);
            }
        });
    }
    // Create new event
    createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate request body
                const validationResult = eventValidation_1.eventSchema.safeParse(req.body);
                if (!validationResult.success) {
                    const response = {
                        success: false,
                        message: "Validation failed",
                        errors: validationResult.error.errors.map((err) => ({
                            field: err.path.join("."),
                            message: err.message,
                        })),
                    };
                    return res.status(400).json(response);
                }
                const event = yield eventService_1.default.createEvent(validationResult.data);
                const response = {
                    success: true,
                    message: "Event created successfully",
                    data: event,
                };
                res.status(201).json(response);
            }
            catch (error) {
                const statusCode = error.message.includes("already exists")
                    ? 409
                    : 500;
                const response = {
                    success: false,
                    message: error.message,
                };
                res.status(statusCode).json(response);
            }
        });
    }
    // Update event
    updateEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate request body
                const validationResult = eventValidation_1.updateEventSchema.safeParse(req.body);
                if (!validationResult.success) {
                    const response = {
                        success: false,
                        message: "Validation failed",
                        errors: validationResult.error.errors.map((err) => ({
                            field: err.path.join("."),
                            message: err.message,
                        })),
                    };
                    return res.status(400).json(response);
                }
                const event = yield eventService_1.default.updateEvent(req.params.id, validationResult.data);
                const response = {
                    success: true,
                    message: "Event updated successfully",
                    data: event,
                };
                res.status(200).json(response);
            }
            catch (error) {
                let statusCode = 500;
                if (error.message.includes("not found"))
                    statusCode = 404;
                if (error.message.includes("already exists"))
                    statusCode = 409;
                const response = {
                    success: false,
                    message: error.message,
                };
                res.status(statusCode).json(response);
            }
        });
    }
    // Delete event
    deleteEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield eventService_1.default.deleteEvent(req.params.id);
                const response = {
                    success: true,
                    message: "Event deleted successfully",
                };
                res.status(200).json(response);
            }
            catch (error) {
                const statusCode = error.message.includes("not found")
                    ? 404
                    : 500;
                const response = {
                    success: false,
                    message: error.message,
                };
                res.status(statusCode).json(response);
            }
        });
    }
}
const eventController = new EventController();
exports.default = eventController;
