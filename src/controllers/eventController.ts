import { Request, Response } from "express";
import { ApiResponse, EventQuery, IEvent } from "../types";
import eventService from "../services/eventService";
import {
  eventSchema,
  updateEventSchema,
} from "../lib/validations/eventValidation";
//import eventService from '../services/eventService.js';
//import { eventSchema, updateEventSchema } from '../validations/eventValidation';
//import { EventQuery, ApiResponse, IEvent } from '../types/index.js';

class EventController {
  // Get all events
  //   async getAllEvents(req: Request<{}, any, any, EventQuery>, res: Response) {
  //     try {
  //       const result = await eventService.getAllEvents(req.query);
  //       const response: ApiResponse<IEvent[]> = {
  //         success: true,
  //         message: 'Events retrieved successfully',
  //         data: result.events,
  //         pagination: result.pagination
  //       };
  //       res.status(200).json(response);
  //     } catch (error) {
  //       const response: ApiResponse<never> = {
  //         success: false,
  //         message: (error as Error).message
  //       };
  //       res.status(500).json(response);
  //     }
  //   }

  // Get event by ID
  //   async getEventById(req: Request<{ id: string }>, res: Response) {
  //     try {
  //       const event = await eventService.getEventById(req.params.id);
  //       const response: ApiResponse<IEvent> = {
  //         success: true,
  //         message: 'Event retrieved successfully',
  //         data: event
  //       };
  //       res.status(200).json(response);
  //     } catch (error) {
  //       const statusCode = (error as Error).message.includes('not found') ? 404 : 500;
  //       const response: ApiResponse<never> = {
  //         success: false,
  //         message: (error as Error).message
  //       };
  //       res.status(statusCode).json(response);
  //     }
  //   }

  // Create new event
  async createEvent(req: Request, res: Response) {
    try {
      // Validate request body
      const validationResult = eventSchema.safeParse(req.body);
      if (!validationResult.success) {
        const response: ApiResponse<never> = {
          success: false,
          message: "Validation failed",
          errors: validationResult.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        };
        return res.status(400).json(response);
      }

      const event = await eventService.createEvent(validationResult.data);
      const response: ApiResponse<IEvent> = {
        success: true,
        message: "Event created successfully",
        data: event,
      };
      res.status(201).json(response);
    } catch (error) {
      const statusCode = (error as Error).message.includes("already exists")
        ? 409
        : 500;
      const response: ApiResponse<never> = {
        success: false,
        message: (error as Error).message,
      };
      res.status(statusCode).json(response);
    }
  }

  // Update event
  //   async updateEvent(req: Request<{ id: string }>, res: Response) {
  //     try {
  //       // Validate request body
  //       const validationResult = updateEventSchema.safeParse(req.body);
  //       if (!validationResult.success) {
  //         const response: ApiResponse<never> = {
  //           success: false,
  //           message: 'Validation failed',
  //           errors: validationResult.error.errors.map(err => ({
  //             field: err.path.join('.'),
  //             message: err.message
  //           }))
  //         };
  //         return res.status(400).json(response);
  //       }

  //       const event = await eventService.updateEvent(req.params.id, validationResult.data);
  //       const response: ApiResponse<IEvent> = {
  //         success: true,
  //         message: 'Event updated successfully',
  //         data: event
  //       };
  //       res.status(200).json(response);
  //     } catch (error) {
  //       let statusCode = 500;
  //       if ((error as Error).message.includes('not found')) statusCode = 404;
  //       if ((error as Error).message.includes('already exists')) statusCode = 409;

  //       const response: ApiResponse<never> = {
  //         success: false,
  //         message: (error as Error).message
  //       };
  //       res.status(statusCode).json(response);
  //     }
  //   }

  // Delete event
  //   async deleteEvent(req: Request<{ id: string }>, res: Response) {
  //     try {
  //       await eventService.deleteEvent(req.params.id);
  //       const response: ApiResponse<never> = {
  //         success: true,
  //         message: 'Event deleted successfully'
  //       };
  //       res.status(200).json(response);
  //     } catch (error) {
  //       const statusCode = (error as Error).message.includes('not found') ? 404 : 500;
  //       const response: ApiResponse<never> = {
  //         success: false,
  //         message: (error as Error).message
  //       };
  //       res.status(statusCode).json(response);
  //     }
  //   }

  // Get upcoming events
  //   async getUpcomingEvents(req: Request, res: Response) {
  //     try {
  //       const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
  //       const events = await eventService.getUpcomingEvents(limit);
  //       const response: ApiResponse<IEvent[]> = {
  //         success: true,
  //         message: 'Upcoming events retrieved successfully',
  //         data: events
  //       };
  //       res.status(200).json(response);
  //     } catch (error) {
  //       const response: ApiResponse<never> = {
  //         success: false,
  //         message: (error as Error).message
  //       };
  //       res.status(500).json(response);
  //     }
  //   }

  // Update registration count
  //   async updateRegistrationCount(req: Request<{ id: string }>, res: Response) {
  //     try {
  //       const { increment = 1 } = req.body;
  //       const event = await eventService.updateRegistrationCount(req.params.id, increment);
  //       const response: ApiResponse<IEvent> = {
  //         success: true,
  //         message: 'Registration count updated successfully',
  //         data: event
  //       };
  //       res.status(200).json(response);
  //     } catch (error) {
  //       const statusCode = (error as Error).message.includes('not found') ? 404 : 500;
  //       const response: ApiResponse<never> = {
  //         success: false,
  //         message: (error as Error).message
  //       };
  //       res.status(statusCode).json(response);
  //     }
  //   }

  // Get event statistics
  //   async getEventStats(req: Request, res: Response) {
  //     try {
  //       const stats = await eventService.getEventStats();
  //       const response: ApiResponse<any> = {
  //         success: true,
  //         message: 'Statistics retrieved successfully',
  //         data: stats
  //       };
  //       res.status(200).json(response);
  //     } catch (error) {
  //       const response: ApiResponse<never> = {
  //         success: false,
  //         message: (error as Error).message
  //       };
  //       res.status(500).json(response);
  //     }
  //   }
}

const eventController = new EventController();
export default eventController;
