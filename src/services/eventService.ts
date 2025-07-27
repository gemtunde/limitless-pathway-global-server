import Event from "../models/Events";
import {
  IEvent,
  EventQuery,
  PaginationMeta,
  EventStats,
} from "../types/index.js";

class EventService {
  // Get all events with optional filtering and pagination
  async getAllEvents(query: EventQuery = {}) {
    const {
      page = "1",
      limit = "10",
      search,
      status,
      eventType,
      sortBy = "date",
      sortOrder = "asc",
    } = query;

    const filter: any = {};

    // Add search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Add filters
    if (status) filter.status = status;
    if (eventType) filter.eventType = eventType;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Create sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    try {
      const events = await Event.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Event.countDocuments(filter);
      const totalPages = Math.ceil(total / parseInt(limit));

      const pagination: PaginationMeta = {
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
    } catch (error) {
      throw new Error(`Error fetching events: ${(error as Error).message}`);
    }
  }

  // Get event by ID
  async getEventById(id: string): Promise<IEvent> {
    try {
      const event = await Event.findById(id);
      if (!event) {
        throw new Error("Event not found");
      }
      return event;
    } catch (error) {
      throw new Error(`Error fetching event: ${(error as Error).message}`);
    }
  }

  // Create new event
  async createEvent(eventData: Partial<IEvent>): Promise<IEvent> {
    try {
      // Convert date string to Date object
      if (eventData.date && typeof eventData.date === "string") {
        eventData.date = eventData.date;
      }
      if (
        eventData.registrationDeadline &&
        typeof eventData.registrationDeadline === "string"
      ) {
        eventData.registrationDeadline = eventData.registrationDeadline;
      }

      const event = new Event(eventData);
      return await event.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Event with this title already exists");
      }
      throw new Error(`Error creating event: ${error.message}`);
    }
  }

  // Update event
  // async updateEvent(id: string, updateData: Partial<IEvent>): Promise<IEvent> {
  //   try {
  //     // Convert date strings to Date objects
  //     if (updateData.date && typeof updateData.date === "string") {
  //       updateData.date = new Date(updateData.date);
  //     }
  //     if (
  //       updateData.registrationDeadline &&
  //       typeof updateData.registrationDeadline === "string"
  //     ) {
  //       updateData.registrationDeadline = new Date(
  //         updateData.registrationDeadline
  //       );
  //     }

  //     const event = await Event.findByIdAndUpdate(
  //       id,
  //       { ...updateData, updatedAt: new Date() },
  //       { new: true, runValidators: true }
  //     );

  //     if (!event) {
  //       throw new Error("Event not found");
  //     }

  //     return event;
  //   } catch (error: any) {
  //     if (error.code === 11000) {
  //       throw new Error("Event with this title already exists");
  //     }
  //     throw new Error(`Error updating event: ${error.message}`);
  //   }
  // }

  // Delete event
  // async deleteEvent(id: string): Promise<IEvent> {
  //   try {
  //     const event = await Event.findByIdAndDelete(id);
  //     if (!event) {
  //       throw new Error("Event not found");
  //     }
  //     return event;
  //   } catch (error) {
  //     throw new Error(`Error deleting event: ${(error as Error).message}`);
  //   }
  // }

  // Get upcoming events
  async getUpcomingEvents(limit: number = 5): Promise<IEvent[]> {
    try {
      const events = await Event.find({
        date: { $gte: new Date() },
        status: "published",
      })
        .sort({ date: 1 })
        .limit(limit);

      return events;
    } catch (error) {
      throw new Error(
        `Error fetching upcoming events: ${(error as Error).message}`
      );
    }
  }

  // Update registration count
  // async updateRegistrationCount(
  //   id: string,
  //   increment: number = 1
  // ): Promise<IEvent> {
  //   try {
  //     const event = await Event.findByIdAndUpdate(
  //       id,
  //       { $inc: { registeredCount: increment } },
  //       { new: true }
  //     );

  //     if (!event) {
  //       throw new Error("Event not found");
  //     }

  //     return event;
  //   } catch (error) {
  //     throw new Error(
  //       `Error updating registration count: ${(error as Error).message}`
  //     );
  //   }
  // }

  // Get events statistics
  // async getEventStats(): Promise<EventStats> {
  //   try {
  //     const stats = await Event.aggregate([
  //       {
  //         $group: {
  //           _id: null,
  //           total: { $sum: 1 },
  //           published: {
  //             $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
  //           },
  //           draft: { $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] } },
  //           cancelled: {
  //             $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
  //           },
  //           completed: {
  //             $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
  //           },
  //           totalRegistrations: { $sum: "$registeredCount" },
  //         },
  //       },
  //     ]);

  //     const typeStats = await Event.aggregate([
  //       {
  //         $group: {
  //           _id: "$eventType",
  //           count: { $sum: 1 },
  //         },
  //       },
  //     ]);

  //     return {
  //       overview: stats[0] || {
  //         total: 0,
  //         published: 0,
  //         draft: 0,
  //         cancelled: 0,
  //         completed: 0,
  //         totalRegistrations: 0,
  //       },
  //       byType: typeStats,
  //     };
  //   } catch (error) {
  //     throw new Error(
  //       `Error fetching event statistics: ${(error as Error).message}`
  //     );
  //   }
  // }
}

const eventService = new EventService();
export default eventService;
