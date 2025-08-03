import { Router } from "express";
import { BlogController } from "../controllers/blogController";

const router = Router();

// Create new blog post (JSON payload, no file upload)
router.post("/", BlogController.createBlog);

// Get all blogs with pagination and filters
router.get("/", BlogController.getAllBlogs);

// Get blog by slug (for public viewing)
router.get("/slug/:slug", BlogController.getBlogBySlug);

// Get blog by ID
router.get("/:id", BlogController.getBlogById);

// Update blog (JSON payload, no file upload)
router.put("/:id", BlogController.updateBlog);

// Delete blog
router.delete("/:id", BlogController.deleteBlog);

export default router;
