// services/applicationService.ts
import Application, {
  IApplication,
  IApplicationCreate,
  IApplicationUpdate,
  ApplicationStatus,
  ApplicationPriority,
} from "../models/Application";
import {
  ApplicationFilters,
  ApplicationStats,
  MongoFilter,
  ServiceResult,
  SortOptions,
  PaginatedResponse,
} from "../types";
// import {
//   ServiceResult,
//   PaginatedResponse,
//   ApplicationFilters,
//   ApplicationStats,
//   MongoFilter,
//   SortOptions
// } from '../types';

class ApplicationService {
  // Create new application
  async createApplication(
    applicationData: IApplicationCreate
  ): Promise<ServiceResult<IApplication>> {
    try {
      const application = new Application(applicationData);
      await application.save();
      return {
        success: true,
        data: application,
        message: "Application created successfully",
      };
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return {
          success: false,
          message: "Validation error",
          errors: Object.values(error.errors).map((err: any) => err.message),
        };
      }
      throw error;
    }
  }

  // Get all applications with filtering and pagination
  //   async getAllApplications(queryParams: ApplicationFilters = {}): Promise<PaginatedResponse<IApplication>> {
  //     try {
  //       const {
  //         page = 1,
  //         limit = 10,
  //         status,
  //         priority,
  //         country,
  //         search,
  //         sortBy = 'createdAt',
  //         sortOrder = 'desc'
  //       } = queryParams;

  //       // Build filter object
  //       const filter: MongoFilter = {};

  //       if (status) filter.status = status;
  //       if (priority) filter.priority = priority;
  //       if (country) filter.country = new RegExp(country, 'i');

  //       if (search) {
  //         filter.$or = [
  //           { firstName: new RegExp(search, 'i') },
  //           { lastName: new RegExp(search, 'i') },
  //           { email: new RegExp(search, 'i') },
  //           { course: new RegExp(search, 'i') },
  //           { city: new RegExp(search, 'i') }
  //         ];
  //       }

  //       // Calculate pagination
  //       const skip = (page - 1) * limit;
  //       const sortOptions: SortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  //       // Execute queries
  //       const [applications, total] = await Promise.all([
  //         Application.find(filter)
  //           .sort(sortOptions)
  //           .skip(skip)
  //           .limit(limit)
  //           .lean<IApplication[]>(),
  //         Application.countDocuments(filter)
  //       ]);

  //       const totalPages = Math.ceil(total / limit);

  //       return {
  //         success: true,
  //         data: applications,
  //         pagination: {
  //           currentPage: page,
  //           totalPages,
  //           totalItems: total,
  //           itemsPerPage: limit,
  //           hasNextPage: page < totalPages,
  //           hasPrevPage: page > 1
  //         }
  //       };
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  // Get application by ID
  async getApplicationById(id: string): Promise<ServiceResult<IApplication>> {
    try {
      const application = await Application.findById(id);

      if (!application) {
        return {
          success: false,
          message: "Application not found",
        };
      }

      return {
        success: true,
        data: application,
      };
    } catch (error: any) {
      if (error.name === "CastError") {
        return {
          success: false,
          message: "Invalid application ID",
        };
      }
      throw error;
    }
  }

  // Update application
  async updateApplication(
    id: string,
    updateData: IApplicationUpdate
  ): Promise<ServiceResult<IApplication>> {
    try {
      const application = await Application.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!application) {
        return {
          success: false,
          message: "Application not found",
        };
      }

      return {
        success: true,
        data: application,
        message: "Application updated successfully",
      };
    } catch (error: any) {
      if (error.name === "ValidationError") {
        return {
          success: false,
          message: "Validation error",
          errors: Object.values(error.errors).map((err: any) => err.message),
        };
      }
      if (error.name === "CastError") {
        return {
          success: false,
          message: "Invalid application ID",
        };
      }
      throw error;
    }
  }

  // Delete application
  async deleteApplication(id: string): Promise<ServiceResult<void>> {
    try {
      const application = await Application.findByIdAndDelete(id);

      if (!application) {
        return {
          success: false,
          message: "Application not found",
        };
      }

      return {
        success: true,
        message: "Application deleted successfully",
      };
    } catch (error: any) {
      if (error.name === "CastError") {
        return {
          success: false,
          message: "Invalid application ID",
        };
      }
      throw error;
    }
  }

  // Get application statistics
  async getApplicationStats(): Promise<ServiceResult<ApplicationStats>> {
    try {
      const [statusStats, priorityStats, totalApplications] = await Promise.all(
        [
          Application.aggregate([
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ]),
          Application.aggregate([
            {
              $group: {
                _id: "$priority",
                count: { $sum: 1 },
              },
            },
          ]),
          Application.countDocuments(),
        ]
      );

      return {
        success: true,
        data: {
          total: totalApplications,
          byStatus: statusStats.reduce(
            (acc: Record<string, number>, stat: any) => {
              acc[stat._id] = stat.count;
              return acc;
            },
            {}
          ),
          byPriority: priorityStats.reduce(
            (acc: Record<string, number>, stat: any) => {
              acc[stat._id] = stat.count;
              return acc;
            },
            {}
          ),
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new ApplicationService();
