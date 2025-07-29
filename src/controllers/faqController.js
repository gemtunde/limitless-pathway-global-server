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
exports.FaqController = void 0;
// import { FaqService } from '../services/faq.service';
// import {
//   createFaqSchema,
//   updateFaqSchema,
//   faqQuerySchema,
//   mongoIdSchema
// } from '../validators';
const zod_1 = require("zod");
const zod_2 = require("zod");
const faqValidation_1 = require("../lib/validations/faqValidation");
const faqService_1 = require("../services/faqService");
class FaqController {
    constructor() {
        // Create a new FAQ
        this.createFaq = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = faqValidation_1.createFaqSchema.parse(req.body);
                const faq = yield this.faqService.createFaq(validatedData);
                res.status(201).json({
                    success: true,
                    message: "FAQ created successfully",
                    data: faq,
                });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Validation error",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(400).json({
                        success: false,
                        message: error.message || "Failed to create FAQ",
                    });
                }
            }
        });
        // Get all FAQs with filtering and pagination
        this.getAllFaqs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const queryData = faqValidation_1.faqQuerySchema.parse(req.query);
                const result = yield this.faqService.getAllFaqs(queryData);
                res.status(200).json({
                    success: true,
                    message: "FAQs retrieved successfully",
                    data: result.faqs,
                    pagination: result.pagination,
                });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid query parameters",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to retrieve FAQs",
                    });
                }
            }
        });
        // Get a single FAQ by ID
        this.getFaqById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = faqValidation_1.mongoIdSchema.parse(req.params);
                const faq = yield this.faqService.getFaqById(id);
                if (!faq) {
                    res.status(404).json({
                        success: false,
                        message: "FAQ not found",
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: "FAQ retrieved successfully",
                    data: faq,
                });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid FAQ ID",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to retrieve FAQ",
                    });
                }
            }
        });
        // Update an FAQ
        this.updateFaq = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = faqValidation_1.mongoIdSchema.parse(req.params);
                const validatedData = faqValidation_1.updateFaqSchema.parse(req.body);
                const faq = yield this.faqService.updateFaq(id, validatedData);
                if (!faq) {
                    res.status(404).json({
                        success: false,
                        message: "FAQ not found",
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: "FAQ updated successfully",
                    data: faq,
                });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Validation error",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(400).json({
                        success: false,
                        message: error.message || "Failed to update FAQ",
                    });
                }
            }
        });
        // Delete an FAQ
        this.deleteFaq = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = faqValidation_1.mongoIdSchema.parse(req.params);
                const faq = yield this.faqService.deleteFaq(id);
                if (!faq) {
                    res.status(404).json({
                        success: false,
                        message: "FAQ not found",
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: "FAQ deleted successfully",
                    data: faq,
                });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid FAQ ID",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to delete FAQ",
                    });
                }
            }
        });
        // Mark FAQ as helpful
        this.markHelpful = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = faqValidation_1.mongoIdSchema.parse(req.params);
                const faq = yield this.faqService.incrementHelpful(id);
                if (!faq) {
                    res.status(404).json({
                        success: false,
                        message: "FAQ not found",
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: "FAQ marked as helpful",
                    data: { helpful: faq.helpful, notHelpful: faq.notHelpful },
                });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid FAQ ID",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to mark FAQ as helpful",
                    });
                }
            }
        });
        // Mark FAQ as not helpful
        this.markNotHelpful = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = faqValidation_1.mongoIdSchema.parse(req.params);
                const faq = yield this.faqService.incrementNotHelpful(id);
                if (!faq) {
                    res.status(404).json({
                        success: false,
                        message: "FAQ not found",
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: "FAQ marked as not helpful",
                    data: { helpful: faq.helpful, notHelpful: faq.notHelpful },
                });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid FAQ ID",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to mark FAQ as not helpful",
                    });
                }
            }
        });
        // Get published FAQs (public endpoint)
        this.getPublishedFaqs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const queryData = faqValidation_1.faqQuerySchema.parse(req.query);
                const result = yield this.faqService.getPublishedFaqs(queryData);
                res.status(200).json({
                    success: true,
                    message: "Published FAQs retrieved successfully",
                    data: result.faqs,
                    pagination: result.pagination,
                });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid query parameters",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to retrieve published FAQs",
                    });
                }
            }
        });
        // Get FAQs by category
        this.getFaqsByCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const categorySchema = zod_2.z.object({
                    category: zod_2.z.string().min(1, "Category is required"),
                    limit: zod_2.z
                        .string()
                        .optional()
                        .transform((val) => (val ? parseInt(val, 10) : undefined)),
                });
                const { category, limit } = categorySchema.parse({
                    category: req.params.category,
                    limit: req.query.limit,
                });
                const faqs = yield this.faqService.getFaqsByCategory(category, limit);
                res.status(200).json({
                    success: true,
                    message: `FAQs for category '${category}' retrieved successfully`,
                    data: faqs,
                });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid parameters",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to retrieve FAQs by category",
                    });
                }
            }
        });
        // Get FAQ statistics
        this.getFaqStats = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield this.faqService.getFaqStats();
                res.status(200).json({
                    success: true,
                    message: "FAQ statistics retrieved successfully",
                    data: stats,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to retrieve FAQ statistics",
                });
            }
        });
        // Reorder FAQs
        this.reorderFaqs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const reorderSchema = zod_2.z.object({
                    faqs: zod_2.z.array(zod_2.z.object({
                        id: zod_2.z
                            .string()
                            .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
                        order: zod_2.z.number().min(1, "Order must be at least 1"),
                    })),
                });
                const { faqs } = reorderSchema.parse(req.body);
                yield this.faqService.reorderFaqs(faqs);
                res.status(200).json({
                    success: true,
                    message: "FAQs reordered successfully",
                });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Validation error",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to reorder FAQs",
                    });
                }
            }
        });
        this.faqService = new faqService_1.FaqService();
    }
}
exports.FaqController = FaqController;
