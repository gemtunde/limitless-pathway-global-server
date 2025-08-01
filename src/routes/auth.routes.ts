import express, { Router } from "express";
import authController from "../controllers/authController";

const router: Router = express.Router();

// Authentication routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// User profile route
router.get("/profile/:userId", authController.getProfile);

export default router;
