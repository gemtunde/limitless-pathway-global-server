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
// services/applicationService.ts
const Application_1 = __importDefault(require("../models/Application"));
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
    createApplication(applicationData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const application = new Application_1.default(applicationData);
                yield application.save();
                return {
                    success: true,
                    data: application,
                    message: "Application created successfully",
                };
            }
            catch (error) {
                if (error.name === "ValidationError") {
                    return {
                        success: false,
                        message: "Validation error",
                        errors: Object.values(error.errors).map((err) => err.message),
                    };
                }
                throw error;
            }
        });
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
    getApplicationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const application = yield Application_1.default.findById(id);
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
            }
            catch (error) {
                if (error.name === "CastError") {
                    return {
                        success: false,
                        message: "Invalid application ID",
                    };
                }
                throw error;
            }
        });
    }
    // Update application
    updateApplication(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const application = yield Application_1.default.findByIdAndUpdate(id, updateData, {
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
            }
            catch (error) {
                if (error.name === "ValidationError") {
                    return {
                        success: false,
                        message: "Validation error",
                        errors: Object.values(error.errors).map((err) => err.message),
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
        });
    }
    // Delete application
    deleteApplication(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const application = yield Application_1.default.findByIdAndDelete(id);
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
            }
            catch (error) {
                if (error.name === "CastError") {
                    return {
                        success: false,
                        message: "Invalid application ID",
                    };
                }
                throw error;
            }
        });
    }
    // Get application statistics
    getApplicationStats() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [statusStats, priorityStats, totalApplications] = yield Promise.all([
                    Application_1.default.aggregate([
                        {
                            $group: {
                                _id: "$status",
                                count: { $sum: 1 },
                            },
                        },
                    ]),
                    Application_1.default.aggregate([
                        {
                            $group: {
                                _id: "$priority",
                                count: { $sum: 1 },
                            },
                        },
                    ]),
                    Application_1.default.countDocuments(),
                ]);
                return {
                    success: true,
                    data: {
                        total: totalApplications,
                        byStatus: statusStats.reduce((acc, stat) => {
                            acc[stat._id] = stat.count;
                            return acc;
                        }, {}),
                        byPriority: priorityStats.reduce((acc, stat) => {
                            acc[stat._id] = stat.count;
                            return acc;
                        }, {}),
                    },
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new ApplicationService();
