import { Request, Response } from "express";
import { ApiResponse, CountryQuery, ICountry } from "../types";
import countryService from "../services/countryService";
import {
  countrySchema,
  updateCountrySchema,
} from "../lib/validations/countryValidation";
//import countryService from "../services/countryService.js";
//import { countrySchema, updateCountrySchema } from '../validations/countryValidation.js';
//import { CountryQuery, ApiResponse, ICountry } from "../types/index.js";
// import {
//   countrySchema,
//   updateCountrySchema,
// } from "../lib/validations/countryValidation.js";

class CountryController {
  // Get all countries
  async getAllCountries(
    req: Request<{}, any, any, CountryQuery>,
    res: Response
  ) {
    try {
      const result = await countryService.getAllCountries(req.query);
      const response: ApiResponse<ICountry[]> = {
        success: true,
        message: "Countries retrieved successfully",
        data: result.countries,
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

  // Get country by ID
  async getCountryById(req: Request<{ id: string }>, res: Response) {
    try {
      const country = await countryService.getCountryById(req.params.id);
      const response: ApiResponse<ICountry> = {
        success: true,
        message: "Country retrieved successfully",
        data: country,
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

  // Get country by slug
  async getCountryBySlug(req: Request<{ slug: string }>, res: Response) {
    try {
      const country = await countryService.getCountryBySlug(req.params.slug);
      const response: ApiResponse<ICountry> = {
        success: true,
        message: "Country retrieved successfully",
        data: country,
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

  // Create new country
  async createCountry(req: Request, res: Response) {
    try {
      // Validate request body
      const validationResult = countrySchema.safeParse(req.body);
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

      const country = await countryService.createCountry(validationResult.data);
      const response: ApiResponse<ICountry> = {
        success: true,
        message: "Country created successfully",
        data: country,
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

  // Update country
  async updateCountry(req: Request<{ id: string }>, res: Response) {
    try {
      // Validate request body
      const validationResult = updateCountrySchema.safeParse(req.body);
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

      const country = await countryService.updateCountry(
        req.params.id,
        validationResult.data
      );
      const response: ApiResponse<ICountry> = {
        success: true,
        message: "Country updated successfully",
        data: country,
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

  // Delete country
  async deleteCountry(req: Request<{ id: string }>, res: Response) {
    try {
      await countryService.deleteCountry(req.params.id);
      const response: ApiResponse<never> = {
        success: true,
        message: "Country deleted successfully",
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

  // Get active countries only
  async getActiveCountries(req: Request, res: Response) {
    try {
      const countries = await countryService.getActiveCountries();
      const response: ApiResponse<ICountry[]> = {
        success: true,
        message: "Active countries retrieved successfully",
        data: countries,
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

  // Get country statistics
  async getCountryStats(req: Request, res: Response) {
    try {
      const stats = await countryService.getCountryStats();
      const response: ApiResponse<any> = {
        success: true,
        message: "Statistics retrieved successfully",
        data: stats,
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
}

const countryController = new CountryController();
export default countryController;
