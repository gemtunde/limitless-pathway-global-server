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
const scholarshipService_1 = __importDefault(require("../services/scholarshipService"));
const scholarshipValidation_1 = require("../lib/validations/scholarshipValidation");
//import scholarshipService from '../services/scholarshipService.js';
//import { scholarshipSchema, updateScholarshipSchema } from '../validations/scholarshipValidation.js';
//import { ScholarshipQuery, ApiResponse, IScholarship } from '../types/index.js';
class ScholarshipController {
    // Get all scholarships
    getAllScholarships(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield scholarshipService_1.default.getAllScholarships(req.query);
                const response = {
                    success: true,
                    message: "Scholarships retrieved successfully",
                    data: result.scholarships,
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
    // Get scholarship by ID
    // async getScholarshipById(req: Request<{ id: string }>, res: Response) {
    //   try {
    //     const scholarship = await scholarshipService.getScholarshipById(req.params.id);
    //     const response: ApiResponse<IScholarship> = {
    //       success: true,
    //       message: 'Scholarship retrieved successfully',
    //       data: scholarship
    //     };
    //     res.status(200).json(response);
    //   } catch (error) {
    //     const statusCode = (error as Error).message.includes('not found') ? 404 : 500;
    //     const response: ApiResponse<never> = {
    //       success: false,
    //       message: (error as Error).message
    //     };
    //     res.status(statusCode).json(response);
    //   }
    // }
    // Create new scholarship
    createScholarship(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate request body
                const validationResult = scholarshipValidation_1.scholarshipSchema.safeParse(req.body);
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
                const scholarship = yield scholarshipService_1.default.createScholarship(validationResult.data);
                const response = {
                    success: true,
                    message: "Scholarship created successfully",
                    data: scholarship,
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
    // Update scholarship
    updateScholarship(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate request body
                const validationResult = scholarshipValidation_1.updateScholarshipSchema.safeParse(req.body);
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
                const scholarship = yield scholarshipService_1.default.updateScholarship(req.params.id, validationResult.data);
                const response = {
                    success: true,
                    message: "Scholarship updated successfully",
                    data: scholarship,
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
    // Delete scholarship
    deleteScholarship(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield scholarshipService_1.default.deleteScholarship(req.params.id);
                const response = {
                    success: true,
                    message: "Scholarship deleted successfully",
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
const scholarshipController = new ScholarshipController();
exports.default = scholarshipController;
