"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scholarshipController_1 = __importDefault(require("../controllers/scholarshipController"));
const router = express_1.default.Router();
// GET /api/scholarships - Get all scholarships with pagination and filtering
router.get("/", scholarshipController_1.default.getAllScholarships);
// GET /api/scholarships/stats - Get scholarship statistics
//router.get('/stats', scholarshipController.getScholarshipStats);
// GET /api/scholarships/:id - Get scholarship by ID
//router.get('/:id', scholarshipController.getScholarshipById);
// POST /api/scholarships - Create new scholarship
router.post("/", scholarshipController_1.default.createScholarship);
// PUT /api/scholarships/:id - Update scholarship
router.put("/:id", scholarshipController_1.default.updateScholarship);
// DELETE /api/scholarships/:id - Delete scholarship
router.delete("/:id", scholarshipController_1.default.deleteScholarship);
exports.default = router;
