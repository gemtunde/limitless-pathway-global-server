"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faqController_1 = require("../controllers/faqController");
const router = (0, express_1.Router)();
const faqController = new faqController_1.FaqController();
// Admin routes (for FAQ management)
router.post("/", faqController.createFaq);
router.get("/", faqController.getAllFaqs);
router.get("/stats", faqController.getFaqStats);
router.put("/reorder", faqController.reorderFaqs);
router.get("/:id", faqController.getFaqById);
router.put("/:id", faqController.updateFaq);
router.delete("/:id", faqController.deleteFaq);
// Public routes (for frontend consumption)
router.get("/public/published", faqController.getPublishedFaqs);
router.get("/public/category/:category", faqController.getFaqsByCategory);
router.patch("/public/:id/helpful", faqController.markHelpful);
router.patch("/public/:id/not-helpful", faqController.markNotHelpful);
exports.default = router;
