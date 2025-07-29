"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const countryController_1 = __importDefault(require("../controllers/countryController"));
const router = express_1.default.Router();
// GET /api/countries - Get all countries with pagination and filtering
router.get("/", countryController_1.default.getAllCountries);
// GET /api/countries/active - Get active countries only
//router.get("/active", countryController.getActiveCountries);
// GET /api/countries/stats - Get country statistics
//router.get("/stats", countryController.getCountryStats);
// GET /api/countries/slug/:slug - Get country by slug
//router.get("/slug/:slug", countryController.getCountryBySlug);
// GET /api/countries/:id - Get country by ID
//router.get("/:id", countryController.getCountryById);
// POST /api/countries - Create new country
router.post("/", countryController_1.default.createCountry);
// PUT /api/countries/:id - Update country
router.put("/:id", countryController_1.default.updateCountry);
// DELETE /api/countries/:id - Delete country
router.delete("/:id", countryController_1.default.deleteCountry);
exports.default = router;
