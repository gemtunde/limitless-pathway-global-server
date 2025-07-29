"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serviceController_1 = require("../controllers/serviceController");
const router = express_1.default.Router();
// GET /api/services - Get all services
router.get("/", serviceController_1.servicesController.getAllServices);
// GET /api/services/:id - Get service by ID
router.get("/:id", serviceController_1.servicesController.getServiceById);
// POST /api/services - Create new service
router.post("/", serviceController_1.servicesController.createService);
// PUT /api/services/:id - Update service by ID
router.put("/:id", serviceController_1.servicesController.updateService);
// DELETE /api/services/:id - Delete service by ID
router.delete("/:id", serviceController_1.servicesController.deleteService);
exports.default = router;
