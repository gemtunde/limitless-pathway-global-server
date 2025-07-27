// routes/applicationRoutes.js
import express from "express";
import applicationController from "../controllers/applicationController";

const router = express.Router();

// @route   POST /api/applications
// @desc    Create a new application
// @access  Public
router.post("/", applicationController.createApplication);

// @route   GET /api/applications
// @desc    Get all applications with filtering and pagination
// @access  Public
// Query params: page, limit, status, priority, country, search, sortBy, sortOrder
router.get("/", applicationController.getAllApplications);

// @route   GET /api/applications/stats
// @desc    Get application statistics
// @access  Public
router.get("/stats", applicationController.getApplicationStats);

// @route   GET /api/applications/:id
// @desc    Get application by ID
// @access  Public
router.get("/:id", applicationController.getApplicationById);

// @route   PUT /api/applications/:id
// @desc    Update application by ID
// @access  Public
router.put("/:id", applicationController.updateApplication);

// @route   DELETE /api/applications/:id
// @desc    Delete application by ID
// @access  Public
router.delete("/:id", applicationController.deleteApplication);

export default router;
