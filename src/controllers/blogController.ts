import { Request, Response } from "express";
// import { BlogService } from '../services/blog.service';
// import {
//   createBlogSchema,
//   updateBlogSchema,
//   blogQuerySchema,
//   mongoIdSchema
// } from '../validators';
import { ZodError } from "zod";
import {
  blogQuerySchema,
  createBlogSchema,
  updateBlogSchema,
} from "../lib/validations/blogValidations";
import { mongoIdSchema } from "../lib/validations/faqValidation";
import { BlogService } from "../services/blogService";

export class BlogController {
  private blogService: BlogService;

  constructor() {
    this.blogService = new BlogService();
  }

  // Create a new blog post
  createBlog = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createBlogSchema.parse(req.body);
      const blog = await this.blogService.createBlog(validatedData);

      res.status(201).json({
        success: true,
        message: "Blog post created successfully",
        data: blog,
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
          message: error.message || "Failed to create blog post",
        });
      }
    }
  };

  // Get all blog posts with filtering and pagination
  getAllBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
      const queryData = blogQuerySchema.parse(req.query);
      const result = await this.blogService.getAllBlogs(queryData);

      res.status(200).json({
        success: true,
        message: "Blog posts retrieved successfully",
        data: result.blogs,
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
          message: error.message || "Failed to retrieve blog posts",
        });
      }
    }
  };

  // Get a single blog post by ID
  getBlogById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = mongoIdSchema.parse(req.params);
      const blog = await this.blogService.getBlogById(id);

      if (!blog) {
        res.status(404).json({
          success: false,
          message: "Blog post not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Blog post retrieved successfully",
        data: blog,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid blog ID",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to retrieve blog post",
        });
      }
    }
  };

  // Get a blog post by slug
  getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;
      const blog = await this.blogService.getBlogBySlug(slug);

      if (!blog) {
        res.status(404).json({
          success: false,
          message: "Blog post not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Blog post retrieved successfully",
        data: blog,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve blog post",
      });
    }
  };

  // Update a blog post
  updateBlog = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = mongoIdSchema.parse(req.params);
      const validatedData = updateBlogSchema.parse(req.body);

      const blog = await this.blogService.updateBlog(id, validatedData);

      if (!blog) {
        res.status(404).json({
          success: false,
          message: "Blog post not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Blog post updated successfully",
        data: blog,
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
          message: error.message || "Failed to update blog post",
        });
      }
    }
  };

  // Delete a blog post
  deleteBlog = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = mongoIdSchema.parse(req.params);
      const blog = await this.blogService.deleteBlog(id);

      if (!blog) {
        res.status(404).json({
          success: false,
          message: "Blog post not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Blog post deleted successfully",
        data: blog,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid blog ID",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to delete blog post",
        });
      }
    }
  };

  // Increment blog views
  incrementViews = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = mongoIdSchema.parse(req.params);
      const blog = await this.blogService.incrementViews(id);

      if (!blog) {
        res.status(404).json({
          success: false,
          message: "Blog post not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Blog views incremented successfully",
        data: { views: blog.views },
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid blog ID",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to increment views",
        });
      }
    }
  };

  // Get published blog posts (public endpoint)
  getPublishedBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
      const queryData = blogQuerySchema.parse(req.query);
      const result = await this.blogService.getPublishedBlogs(queryData);

      res.status(200).json({
        success: true,
        message: "Published blog posts retrieved successfully",
        data: result.blogs,
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
          message: error.message || "Failed to retrieve published blog posts",
        });
      }
    }
  };

  // Get blog statistics
  getBlogStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.blogService.getBlogStats();

      res.status(200).json({
        success: true,
        message: "Blog statistics retrieved successfully",
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve blog statistics",
      });
    }
  };
}
