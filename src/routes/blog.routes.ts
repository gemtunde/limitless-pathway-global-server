import { Router } from "express";
import { BlogController } from "../controllers/blogController";

const router = Router();
const blogController = new BlogController();

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

export default router;
