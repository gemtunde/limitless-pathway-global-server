import { Request, Response } from "express";
import { BlogService, CreateBlogData } from "../services/blogService";
//import { createBlogSchema, updateBlogSchema, CreateBlogInput, UpdateBlogInput } from '../validations/';
//import { ZodError } from 'zod';
import {
  createBlogSchema,
  updateBlogSchema,
} from "../lib/validations/blogValidations";

export class BlogController {
  // Create new blog post
  static async createBlog(req: Request, res: Response): Promise<Response> {
    try {
      console.log(
        "Received blog creation request:",
        JSON.stringify(req.body, null, 2)
      );

      // Validate request body using Zod
      const validationResult = createBlogSchema.safeParse(req.body);

      if (!validationResult.success) {
        console.error("Validation error:", validationResult.error.errors);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationResult.error.errors.map((error) => ({
            field: error.path.join("."),
            message: error.message,
          })),
        });
      }

      const validatedData = validationResult.data;
      console.log("Validated data:", JSON.stringify(validatedData, null, 2));

      // Create blog post
      const blog = await BlogService.createBlog(
        validatedData as CreateBlogData
      );

      return res.status(201).json({
        success: true,
        message: "Blog post created successfully",
        data: blog,
      });
    } catch (error) {
      console.error("Create blog error:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get all blogs with pagination and filters
  static async getAllBlogs(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const category = req.query.category as string;
      const search = req.query.search as string;

      const result = await BlogService.getAllBlogs({
        page,
        limit,
        status,
        category,
        search,
      });

      return res.status(200).json({
        success: true,
        message: "Blogs fetched successfully",
        ...result,
      });
    } catch (error) {
      console.error("Get blogs error:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get blog by ID
  static async getBlogById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const blog = await BlogService.getBlogById(id);

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Blog fetched successfully",
        data: blog,
      });
    } catch (error) {
      console.error("Get blog error:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get blog by slug
  static async getBlogBySlug(req: Request, res: Response): Promise<Response> {
    try {
      const { slug } = req.params;
      const blog = await BlogService.getBlogBySlug(slug);

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      // Increment view count
      //await BlogService.incrementViews(blog._id);

      return res.status(200).json({
        success: true,
        message: "Blog fetched successfully",
        data: blog,
      });
    } catch (error) {
      console.error("Get blog by slug error:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Update blog
  static async updateBlog(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      console.log("Received blog update request for ID:", id);
      console.log("Update data:", JSON.stringify(req.body, null, 2));

      // Validate request body using Zod
      const validationResult = updateBlogSchema.safeParse(req.body);

      if (!validationResult.success) {
        console.error("Validation error:", validationResult.error.errors);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationResult.error.errors.map((error) => ({
            field: error.path.join("."),
            message: error.message,
          })),
        });
      }

      const validatedData = validationResult.data;

      // Update blog post
      const blog = await BlogService.updateBlog(id, validatedData);

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Blog updated successfully",
        data: blog,
      });
    } catch (error) {
      console.error("Update blog error:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Delete blog
  static async deleteBlog(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const deleted = await BlogService.deleteBlog(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Blog deleted successfully",
      });
    } catch (error) {
      console.error("Delete blog error:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}
