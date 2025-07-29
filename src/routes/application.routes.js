"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/applicationRoutes.js
const express_1 = __importDefault(require("express"));
const applicationController_1 = __importDefault(require("../controllers/applicationController"));
const router = express_1.default.Router();
// @route   POST /api/applications
// @desc    Create a new application
// @access  Public
router.post("/", applicationController_1.default.createApplication);
// @route   GET /api/applications
// @desc    Get all applications with filtering and pagination
// @access  Public
// Query params: page, limit, status, priority, country, search, sortBy, sortOrder
//router.get("/", applicationController.getAllApplications);
// @route   GET /api/applications/stats
// @desc    Get application statistics
// @access  Public
router.get("/stats", applicationController_1.default.getApplicationStats);
// @route   GET /api/applications/:id
// @desc    Get application by ID
// @access  Public
router.get("/:id", applicationController_1.default.getApplicationById);
// @route   PUT /api/applications/:id
// @desc    Update application by ID
// @access  Public
router.put("/:id", applicationController_1.default.updateApplication);
// @route   DELETE /api/applications/:id
// @desc    Delete application by ID
// @access  Public
router.delete("/:id", applicationController_1.default.deleteApplication);
exports.default = router;
