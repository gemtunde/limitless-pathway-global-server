"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blogController_1 = require("../controllers/blogController");
const router = (0, express_1.Router)();
const blogController = new blogController_1.BlogController();
// Admin routes (for blog management)
router.post("/", blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.get("/stats", blogController.getBlogStats);
router.get("/:id", blogController.getBlogById);
router.put("/:id", blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);
router.patch("/:id/views", blogController.incrementViews);
// Public routes (for frontend consumption)
router.get("/public/published", blogController.getPublishedBlogs);
router.get("/public/slug/:slug", blogController.getBlogBySlug);
exports.default = router;
