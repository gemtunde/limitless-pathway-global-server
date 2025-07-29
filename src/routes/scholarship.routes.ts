import express from "express";
import scholarshipController from "../controllers/scholarshipController";

const router = express.Router();

// GET /api/scholarships - Get all scholarships with pagination and filtering
router.get("/", scholarshipController.getAllScholarships);

// GET /api/scholarships/stats - Get scholarship statistics
//router.get('/stats', scholarshipController.getScholarshipStats);

// GET /api/scholarships/:id - Get scholarship by ID
//router.get('/:id', scholarshipController.getScholarshipById);

// POST /api/scholarships - Create new scholarship
router.post("/", scholarshipController.createScholarship);

// PUT /api/scholarships/:id - Update scholarship
router.put("/:id", scholarshipController.updateScholarship);

// DELETE /api/scholarships/:id - Delete scholarship
router.delete("/:id", scholarshipController.deleteScholarship);

export default router;
