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
exports.BlogController = void 0;
// import { BlogService } from '../services/blog.service';
// import {
//   createBlogSchema,
//   updateBlogSchema,
//   blogQuerySchema,
//   mongoIdSchema
// } from '../validators';
const zod_1 = require("zod");
const blogValidations_1 = require("../lib/validations/blogValidations");
const faqValidation_1 = require("../lib/validations/faqValidation");
const blogService_1 = require("../services/blogService");
class BlogController {
    constructor() {
        // Create a new blog post
        this.createBlog = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = blogValidations_1.createBlogSchema.parse(req.body);
                const blog = yield this.blogService.createBlog(validatedData);
                res.status(201).json({
                    success: true,
                    message: "Blog post created successfully",
                    data: blog,
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
                        message: error.message || "Failed to create blog post",
                    });
                }
            }
        });
        // Get all blog posts with filtering and pagination
        this.getAllBlogs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const queryData = blogValidations_1.blogQuerySchema.parse(req.query);
                const result = yield this.blogService.getAllBlogs(queryData);
                res.status(200).json({
                    success: true,
                    message: "Blog posts retrieved successfully",
                    data: result.blogs,
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
                        message: error.message || "Failed to retrieve blog posts",
                    });
                }
            }
        });
        // Get a single blog post by ID
        this.getBlogById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = faqValidation_1.mongoIdSchema.parse(req.params);
                const blog = yield this.blogService.getBlogById(id);
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
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid blog ID",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to retrieve blog post",
                    });
                }
            }
        });
        // Get a blog post by slug
        this.getBlogBySlug = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { slug } = req.params;
                const blog = yield this.blogService.getBlogBySlug(slug);
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
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to retrieve blog post",
                });
            }
        });
        // Update a blog post
        this.updateBlog = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = faqValidation_1.mongoIdSchema.parse(req.params);
                const validatedData = blogValidations_1.updateBlogSchema.parse(req.body);
                const blog = yield this.blogService.updateBlog(id, validatedData);
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
                        message: error.message || "Failed to update blog post",
                    });
                }
            }
        });
        // Delete a blog post
        this.deleteBlog = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = faqValidation_1.mongoIdSchema.parse(req.params);
                const blog = yield this.blogService.deleteBlog(id);
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
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid blog ID",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to delete blog post",
                    });
                }
            }
        });
        // Increment blog views
        this.incrementViews = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = faqValidation_1.mongoIdSchema.parse(req.params);
                const blog = yield this.blogService.incrementViews(id);
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
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid blog ID",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to increment views",
                    });
                }
            }
        });
        // Get published blog posts (public endpoint)
        this.getPublishedBlogs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const queryData = blogValidations_1.blogQuerySchema.parse(req.query);
                const result = yield this.blogService.getPublishedBlogs(queryData);
                res.status(200).json({
                    success: true,
                    message: "Published blog posts retrieved successfully",
                    data: result.blogs,
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
                        message: error.message || "Failed to retrieve published blog posts",
                    });
                }
            }
        });
        // Get blog statistics
        this.getBlogStats = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield this.blogService.getBlogStats();
                res.status(200).json({
                    success: true,
                    message: "Blog statistics retrieved successfully",
                    data: stats,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to retrieve blog statistics",
                });
            }
        });
        this.blogService = new blogService_1.BlogService();
    }
}
exports.BlogController = BlogController;
