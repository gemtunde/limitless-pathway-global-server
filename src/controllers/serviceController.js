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
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicesController = void 0;
//import { servicesService } from '../services/servicesService.js';
//import { createServiceSchema, updateServiceSchema } from '../validators/serviceValidators.js';
const zod_1 = require("zod");
const serviceService_1 = require("../services/serviceService");
const serviceValidations_1 = require("../lib/validations/serviceValidations");
exports.servicesController = {
    // Get all services
    getAllServices: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const services = yield serviceService_1.servicesService.getAllServices();
            res.status(200).json({
                success: true,
                message: "Services retrieved successfully",
                data: services,
                count: services.length,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    // Get service by ID
    getServiceById: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const service = yield serviceService_1.servicesService.getServiceById(id);
            if (!service) {
                res.status(404).json({
                    success: false,
                    message: "Service not found",
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: "Service retrieved successfully",
                data: service,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    // Create new service
    createService: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Validate request body
            const validatedData = serviceValidations_1.createServiceSchema.parse(req.body);
            const newService = yield serviceService_1.servicesService.createService(validatedData);
            res.status(201).json({
                success: true,
                message: "Service created successfully",
                data: newService,
            });
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.errors.map((err) => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
                return;
            }
            next(error);
        }
    }),
    // Update service
    updateService: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            // Validate request body
            const validatedData = serviceValidations_1.updateServiceSchema.parse(req.body);
            const updatedService = yield serviceService_1.servicesService.updateService(id, validatedData);
            if (!updatedService) {
                res.status(404).json({
                    success: false,
                    message: "Service not found",
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: "Service updated successfully",
                data: updatedService,
            });
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.errors.map((err) => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
                return;
            }
            next(error);
        }
    }),
    // Delete service
    deleteService: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const deletedService = yield serviceService_1.servicesService.deleteService(id);
            if (!deletedService) {
                res.status(404).json({
                    success: false,
                    message: "Service not found",
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: "Service deleted successfully",
                data: deletedService,
            });
        }
        catch (error) {
            next(error);
        }
    }),
};
