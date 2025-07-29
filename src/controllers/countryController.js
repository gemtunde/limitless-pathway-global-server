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
const countryService_1 = __importDefault(require("../services/countryService"));
const countryValidation_1 = require("../lib/validations/countryValidation");
//import countryService from "../services/countryService.js";
//import { countrySchema, updateCountrySchema } from '../validations/countryValidation.js';
//import { CountryQuery, ApiResponse, ICountry } from "../types/index.js";
// import {
//   countrySchema,
//   updateCountrySchema,
// } from "../lib/validations/countryValidation.js";
class CountryController {
    // Get all countries
    getAllCountries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield countryService_1.default.getAllCountries(req.query);
                const response = {
                    success: true,
                    message: "Countries retrieved successfully",
                    data: result.countries,
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
    // Get country by ID
    getCountryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const country = yield countryService_1.default.getCountryById(req.params.id);
                const response = {
                    success: true,
                    message: "Country retrieved successfully",
                    data: country,
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
    // Get country by slug
    getCountryBySlug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const country = yield countryService_1.default.getCountryBySlug(req.params.slug);
                const response = {
                    success: true,
                    message: "Country retrieved successfully",
                    data: country,
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
    // Create new country
    createCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate request body
                const validationResult = countryValidation_1.countrySchema.safeParse(req.body);
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
                const country = yield countryService_1.default.createCountry(validationResult.data);
                const response = {
                    success: true,
                    message: "Country created successfully",
                    data: country,
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
    // Update country
    updateCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate request body
                const validationResult = countryValidation_1.updateCountrySchema.safeParse(req.body);
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
                const country = yield countryService_1.default.updateCountry(req.params.id, validationResult.data);
                const response = {
                    success: true,
                    message: "Country updated successfully",
                    data: country,
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
    // Delete country
    deleteCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield countryService_1.default.deleteCountry(req.params.id);
                const response = {
                    success: true,
                    message: "Country deleted successfully",
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
    // Get active countries only
    getActiveCountries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countries = yield countryService_1.default.getActiveCountries();
                const response = {
                    success: true,
                    message: "Active countries retrieved successfully",
                    data: countries,
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
    // Get country statistics
    getCountryStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield countryService_1.default.getCountryStats();
                const response = {
                    success: true,
                    message: "Statistics retrieved successfully",
                    data: stats,
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
}
const countryController = new CountryController();
exports.default = countryController;
