import { Request, Response } from "express";
// import { FaqService } from '../services/faq.service';
// import {
//   createFaqSchema,
//   updateFaqSchema,
//   faqQuerySchema,
//   mongoIdSchema
// } from '../validators';
import { ZodError } from "zod";
import { z } from "zod";
import {
  createFaqSchema,
  faqQuerySchema,
  mongoIdSchema,
  updateFaqSchema,
} from "../lib/validations/faqValidation";
import { FaqService } from "../services/faqService";

export class FaqController {
  private faqService: FaqService;

  constructor() {
    this.faqService = new FaqService();
  }

  // Create a new FAQ
  createFaq = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createFaqSchema.parse(req.body);
      const faq = await this.faqService.createFaq(validatedData);

      res.status(201).json({
        success: true,
        message: "FAQ created successfully",
        data: faq,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        res.status(400).json({
          success: false,
          message: error.message || "Failed to create FAQ",
        });
      }
    }
  };

  // Get all FAQs with filtering and pagination
  getAllFaqs = async (req: Request, res: Response): Promise<void> => {
    try {
      const queryData = faqQuerySchema.parse(req.query);
      const result = await this.faqService.getAllFaqs(queryData);

      res.status(200).json({
        success: true,
        message: "FAQs retrieved successfully",
        data: result.faqs,
        pagination: result.pagination,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to retrieve FAQs",
        });
      }
    }
  };

  // Get a single FAQ by ID
  getFaqById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = mongoIdSchema.parse(req.params);
      const faq = await this.faqService.getFaqById(id);

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
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid FAQ ID",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to retrieve FAQ",
        });
      }
    }
  };

  // Update an FAQ
  updateFaq = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = mongoIdSchema.parse(req.params);
      const validatedData = updateFaqSchema.parse(req.body);

      const faq = await this.faqService.updateFaq(id, validatedData);

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
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        res.status(400).json({
          success: false,
          message: error.message || "Failed to update FAQ",
        });
      }
    }
  };

  // Delete an FAQ
  deleteFaq = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = mongoIdSchema.parse(req.params);
      const faq = await this.faqService.deleteFaq(id);

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
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid FAQ ID",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to delete FAQ",
        });
      }
    }
  };

  // Mark FAQ as helpful
  markHelpful = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = mongoIdSchema.parse(req.params);
      const faq = await this.faqService.incrementHelpful(id);

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
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid FAQ ID",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to mark FAQ as helpful",
        });
      }
    }
  };

  // Mark FAQ as not helpful
  markNotHelpful = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = mongoIdSchema.parse(req.params);
      const faq = await this.faqService.incrementNotHelpful(id);

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
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid FAQ ID",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to mark FAQ as not helpful",
        });
      }
    }
  };

  // Get published FAQs (public endpoint)
  getPublishedFaqs = async (req: Request, res: Response): Promise<void> => {
    try {
      const queryData = faqQuerySchema.parse(req.query);
      const result = await this.faqService.getPublishedFaqs(queryData);

      res.status(200).json({
        success: true,
        message: "Published FAQs retrieved successfully",
        data: result.faqs,
        pagination: result.pagination,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to retrieve published FAQs",
        });
      }
    }
  };

  // Get FAQs by category
  getFaqsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const categorySchema = z.object({
        category: z.string().min(1, "Category is required"),
        limit: z
          .string()
          .optional()
          .transform((val) => (val ? parseInt(val, 10) : undefined)),
      });

      const { category, limit } = categorySchema.parse({
        category: req.params.category,
        limit: req.query.limit,
      });

      const faqs = await this.faqService.getFaqsByCategory(category, limit);

      res.status(200).json({
        success: true,
        message: `FAQs for category '${category}' retrieved successfully`,
        data: faqs,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid parameters",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to retrieve FAQs by category",
        });
      }
    }
  };

  // Get FAQ statistics
  getFaqStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.faqService.getFaqStats();

      res.status(200).json({
        success: true,
        message: "FAQ statistics retrieved successfully",
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve FAQ statistics",
      });
    }
  };

  // Reorder FAQs
  reorderFaqs = async (req: Request, res: Response): Promise<void> => {
    try {
      const reorderSchema = z.object({
        faqs: z.array(
          z.object({
            id: z
              .string()
              .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
            order: z.number().min(1, "Order must be at least 1"),
          })
        ),
      });

      const { faqs } = reorderSchema.parse(req.body);
      await this.faqService.reorderFaqs(faqs);

      res.status(200).json({
        success: true,
        message: "FAQs reordered successfully",
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to reorder FAQs",
        });
      }
    }
  };
}
