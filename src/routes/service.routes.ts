import express from "express";
import { servicesController } from "../controllers/serviceController";

const router = express.Router();

// GET /api/services - Get all services
router.get("/", servicesController.getAllServices);

// GET /api/services/:id - Get service by ID
router.get("/:id", servicesController.getServiceById);

// POST /api/services - Create new service
router.post("/", servicesController.createService);

// PUT /api/services/:id - Update service by ID
router.put("/:id", servicesController.updateService);

// DELETE /api/services/:id - Delete service by ID
router.delete("/:id", servicesController.deleteService);

export default router;
