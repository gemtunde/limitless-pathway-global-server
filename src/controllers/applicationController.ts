import { Request, Response } from "express";
// import applicationService from '../services/applicationService.js';
// import {
//   applicationSchema,
//   applicationUpdateSchema,
//   applicationQuerySchema,
//   ApplicationInput,
//   ApplicationUpdateInput,
//   ApplicationQueryParams
// } from '../validators/schemas.js';
import { ZodError } from "zod";
import {
  ApplicationInput,
  ApplicationQueryParams,
  applicationQuerySchema,
  applicationSchema,
  ApplicationUpdateInput,
  applicationUpdateSchema,
} from "../lib/validations/applicationValidations";
import applicationService from "../services/applicationService";

class ApplicationController {
  // Create new application
  async createApplication(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData: ApplicationInput = applicationSchema.parse(req.body);

      const result = await applicationService.createApplication(validatedData);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors.map(
            (err) => `${err.path.join(".")}: ${err.message}`
          ),
        });
        return;
      }

      console.error("Create application error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
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
  async getApplicationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Application ID is required",
        });
        return;
      }

      const result = await applicationService.getApplicationById(id);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Get application by ID error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Update application
  async updateApplication(req: Request, res: Response): Promise<void> {
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
      const validatedData: ApplicationUpdateInput =
        applicationUpdateSchema.parse(req.body);

      const result = await applicationService.updateApplication(
        id,
        validatedData
      );

      if (!result.success) {
        const statusCode =
          result.message === "Application not found" ? 404 : 400;
        res.status(statusCode).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors.map(
            (err) => `${err.path.join(".")}: ${err.message}`
          ),
        });
        return;
      }

      console.error("Update application error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Delete application
  async deleteApplication(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Application ID is required",
        });
        return;
      }

      const result = await applicationService.deleteApplication(id);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Delete application error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Get application statistics
  async getApplicationStats(req: Request, res: Response): Promise<void> {
    try {
      const result = await applicationService.getApplicationStats();

      res.status(200).json(result);
    } catch (error) {
      console.error("Get application stats error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

export default new ApplicationController();
