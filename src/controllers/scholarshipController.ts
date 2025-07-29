import { Request, Response } from "express";
import scholarshipService from "../services/scholarshipService";
import { ApiResponse, IScholarship, ScholarshipQuery } from "../types";
import {
  scholarshipSchema,
  updateScholarshipSchema,
} from "../lib/validations/scholarshipValidation";
//import scholarshipService from '../services/scholarshipService.js';
//import { scholarshipSchema, updateScholarshipSchema } from '../validations/scholarshipValidation.js';
//import { ScholarshipQuery, ApiResponse, IScholarship } from '../types/index.js';

class ScholarshipController {
  // Get all scholarships
  async getAllScholarships(
    req: Request<{}, any, any, ScholarshipQuery>,
    res: Response
  ) {
    try {
      const result = await scholarshipService.getAllScholarships(req.query);
      const response: ApiResponse<IScholarship[]> = {
        success: true,
        message: "Scholarships retrieved successfully",
        data: result.scholarships,
        pagination: result.pagination,
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<never> = {
        success: false,
        message: (error as Error).message,
      };
      res.status(500).json(response);
    }
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
  async createScholarship(req: Request, res: Response) {
    try {
      // Validate request body
      const validationResult = scholarshipSchema.safeParse(req.body);
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

      const scholarship = await scholarshipService.createScholarship(
        validationResult.data
      );
      const response: ApiResponse<IScholarship> = {
        success: true,
        message: "Scholarship created successfully",
        data: scholarship,
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

  // Update scholarship
  async updateScholarship(req: Request<{ id: string }>, res: Response) {
    try {
      // Validate request body
      const validationResult = updateScholarshipSchema.safeParse(req.body);
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

      const scholarship = await scholarshipService.updateScholarship(
        req.params.id,
        validationResult.data
      );
      const response: ApiResponse<IScholarship> = {
        success: true,
        message: "Scholarship updated successfully",
        data: scholarship,
      };
      res.status(200).json(response);
    } catch (error) {
      let statusCode = 500;
      if ((error as Error).message.includes("not found")) statusCode = 404;
      if ((error as Error).message.includes("already exists")) statusCode = 409;

      const response: ApiResponse<never> = {
        success: false,
        message: (error as Error).message,
      };
      res.status(statusCode).json(response);
    }
  }

  // Delete scholarship
  async deleteScholarship(req: Request<{ id: string }>, res: Response) {
    try {
      await scholarshipService.deleteScholarship(req.params.id);
      const response: ApiResponse<never> = {
        success: true,
        message: "Scholarship deleted successfully",
      };
      res.status(200).json(response);
    } catch (error) {
      const statusCode = (error as Error).message.includes("not found")
        ? 404
        : 500;
      const response: ApiResponse<never> = {
        success: false,
        message: (error as Error).message,
      };
      res.status(statusCode).json(response);
    }
  }

  // Get scholarship statistics
  // async getScholarshipStats(req: Request, res: Response) {
  //   try {
  //     const stats = await scholarshipService.getScholarshipStats();
  //     const response: ApiResponse<any> = {
  //       success: true,
  //       message: 'Statistics retrieved successfully',
  //       data: stats
  //     };
  //     res.status(200).json(response);
  //   } catch (error) {
  //     const response: ApiResponse<never> = {
  //       success: false,
  //       message: (error as Error).message
  //     };
  //     res.status(500).json(response);
  //   }
  // }
}

const scholarshipController = new ScholarshipController();
export default scholarshipController;
