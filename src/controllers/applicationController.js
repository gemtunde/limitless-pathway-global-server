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
// import applicationService from '../services/applicationService.js';
// import {
//   applicationSchema,
//   applicationUpdateSchema,
//   applicationQuerySchema,
//   ApplicationInput,
//   ApplicationUpdateInput,
//   ApplicationQueryParams
// } from '../validators/schemas.js';
const zod_1 = require("zod");
const applicationValidations_1 = require("../lib/validations/applicationValidations");
const applicationService_1 = __importDefault(require("../services/applicationService"));
class ApplicationController {
    // Create new application
    createApplication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate request body
                const validatedData = applicationValidations_1.applicationSchema.parse(req.body);
                const result = yield applicationService_1.default.createApplication(validatedData);
                if (!result.success) {
                    res.status(400).json(result);
                    return;
                }
                res.status(201).json(result);
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Validation error",
                        errors: error.errors.map((err) => `${err.path.join(".")}: ${err.message}`),
                    });
                    return;
                }
                console.error("Create application error:", error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    // Get all applications
    //   async getAllApplications(req: Request, res: Response): Promise<void> {
    //     try {
    //       // Validate query parameters
    //       const queryParams: ApplicationQueryParams = applicationQuerySchema.parse(
    //         req.query
    //       );
    //       const result = await applicationService.getAllApplications(queryParams);
    //       res.status(200).json(result);
    //     } catch (error) {
    //       if (error instanceof ZodError) {
    //         res.status(400).json({
    //           success: false,
    //           message: "Invalid query parameters",
    //           errors: error.errors.map(
    //             (err) => `${err.path.join(".")}: ${err.message}`
    //           ),
    //         });
    //         return;
    //       }
    //       console.error("Get all applications error:", error);
    //       res.status(500).json({
    //         success: false,
    //         message: "Internal server error",
    //       });
    //     }
    //   }
    // Get application by ID
    getApplicationById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    res.status(400).json({
                        success: false,
                        message: "Application ID is required",
                    });
                    return;
                }
                const result = yield applicationService_1.default.getApplicationById(id);
                if (!result.success) {
                    res.status(404).json(result);
                    return;
                }
                res.status(200).json(result);
            }
            catch (error) {
                console.error("Get application by ID error:", error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    // Update application
    updateApplication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    res.status(400).json({
                        success: false,
                        message: "Application ID is required",
                    });
                    return;
                }
                // Validate request body
                const validatedData = applicationValidations_1.applicationUpdateSchema.parse(req.body);
                const result = yield applicationService_1.default.updateApplication(id, validatedData);
                if (!result.success) {
                    const statusCode = result.message === "Application not found" ? 404 : 400;
                    res.status(statusCode).json(result);
                    return;
                }
                res.status(200).json(result);
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Validation error",
                        errors: error.errors.map((err) => `${err.path.join(".")}: ${err.message}`),
                    });
                    return;
                }
                console.error("Update application error:", error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    // Delete application
    deleteApplication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    res.status(400).json({
                        success: false,
                        message: "Application ID is required",
                    });
                    return;
                }
                const result = yield applicationService_1.default.deleteApplication(id);
                if (!result.success) {
                    res.status(404).json(result);
                    return;
                }
                res.status(200).json(result);
            }
            catch (error) {
                console.error("Delete application error:", error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
    // Get application statistics
    getApplicationStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield applicationService_1.default.getApplicationStats();
                res.status(200).json(result);
            }
            catch (error) {
                console.error("Get application stats error:", error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    }
}
exports.default = new ApplicationController();
