import { Request, Response, NextFunction } from "express";
//import { servicesService } from '../services/servicesService.js';
//import { createServiceSchema, updateServiceSchema } from '../validators/serviceValidators.js';
import { ZodError } from "zod";
import { servicesService } from "../services/serviceService";
import {
  createServiceSchema,
  updateServiceSchema,
} from "../lib/validations/serviceValidations";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
  errors?: Array<{ field: string; message: string }>;
}

export const servicesController = {
  // Get all services
  getAllServices: async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const services = await servicesService.getAllServices();
      res.status(200).json({
        success: true,
        message: "Services retrieved successfully",
        data: services,
        count: services.length,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get service by ID
  getServiceById: async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const service = await servicesService.getServiceById(id);

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
    } catch (error) {
      next(error);
    }
  },

  // Create new service
  createService: async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validate request body
      const validatedData = createServiceSchema.parse(req.body);

      const newService = await servicesService.createService(validatedData);

      res.status(201).json({
        success: true,
        message: "Service created successfully",
        data: newService,
      });
    } catch (error) {
      if (error instanceof ZodError) {
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
  },

  // Update service
  updateService: async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      // Validate request body
      const validatedData = updateServiceSchema.parse(req.body);

      const updatedService = await servicesService.updateService(
        id,
        validatedData
      );

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
    } catch (error) {
      if (error instanceof ZodError) {
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
  },

  // Delete service
  deleteService: async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const deletedService = await servicesService.deleteService(id);

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
    } catch (error) {
      next(error);
    }
  },
};
