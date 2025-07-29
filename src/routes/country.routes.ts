import express from "express";
import countryController from "../controllers/countryController";

const router = express.Router();

// GET /api/countries - Get all countries with pagination and filtering
router.get("/", countryController.getAllCountries);

// GET /api/countries/active - Get active countries only
//router.get("/active", countryController.getActiveCountries);

// GET /api/countries/stats - Get country statistics
//router.get("/stats", countryController.getCountryStats);

// GET /api/countries/slug/:slug - Get country by slug
//router.get("/slug/:slug", countryController.getCountryBySlug);

// GET /api/countries/:id - Get country by ID
//router.get("/:id", countryController.getCountryById);

// POST /api/countries - Create new country
router.post("/", countryController.createCountry);

// PUT /api/countries/:id - Update country
router.put("/:id", countryController.updateCountry);

// DELETE /api/countries/:id - Delete country
router.delete("/:id", countryController.deleteCountry);

export default router;
