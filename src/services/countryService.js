"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Country_1 = __importDefault(require("../models/Country"));
class CountryService {
    // Get all countries with optional filtering and pagination
    getAllCountries() {
        return __awaiter(this, arguments, void 0, function* (query = {}) {
            const { page = "1", limit = "10", search, status, sortBy = "name", sortOrder = "asc", } = query;
            const filter = {};
            // Add search functionality
            if (search) {
                filter.$text = { $search: search };
            }
            // Add filters
            if (status)
                filter.status = status;
            // Calculate pagination
            const skip = (parseInt(page) - 1) * parseInt(limit);
            // Create sort object
            const sort = {};
            sort[sortBy] = sortOrder === "desc" ? -1 : 1;
            try {
                const countries = yield Country_1.default.find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(parseInt(limit));
                const total = yield Country_1.default.countDocuments(filter);
                const totalPages = Math.ceil(total / parseInt(limit));
                const pagination = {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: total,
                    itemsPerPage: parseInt(limit),
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1,
                };
                return {
                    countries,
                    pagination,
                };
            }
            catch (error) {
                throw new Error(`Error fetching countries: ${error.message}`);
            }
        });
    }
    // Get country by ID
    getCountryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const country = yield Country_1.default.findById(id);
                if (!country) {
                    throw new Error("Country not found");
                }
                return country;
            }
            catch (error) {
                throw new Error(`Error fetching country: ${error.message}`);
            }
        });
    }
    // Get country by slug
    getCountryBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const country = yield Country_1.default.findOne({ slug: slug.toLowerCase() });
                if (!country) {
                    throw new Error("Country not found");
                }
                return country;
            }
            catch (error) {
                throw new Error(`Error fetching country: ${error.message}`);
            }
        });
    }
    // Create new country
    createCountry(countryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ensure slug is lowercase and flagCode is uppercase
                if (countryData.slug) {
                    countryData.slug = countryData.slug.toLowerCase();
                }
                if (countryData.flagCode) {
                    countryData.flagCode = countryData.flagCode.toUpperCase();
                }
                const country = new Country_1.default(countryData);
                return yield country.save();
            }
            catch (error) {
                if (error.code === 11000) {
                    if (error.message.includes("name")) {
                        throw new Error("Country with this name already exists");
                    }
                    if (error.message.includes("slug")) {
                        throw new Error("Country with this slug already exists");
                    }
                    throw new Error("Country already exists");
                }
                throw new Error(`Error creating country: ${error.message}`);
            }
        });
    }
    // Update country
    updateCountry(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ensure slug is lowercase and flagCode is uppercase
                if (updateData.slug) {
                    updateData.slug = updateData.slug.toLowerCase();
                }
                if (updateData.flagCode) {
                    updateData.flagCode = updateData.flagCode.toUpperCase();
                }
                const country = yield Country_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { new: true, runValidators: true });
                if (!country) {
                    throw new Error("Country not found");
                }
                return country;
            }
            catch (error) {
                if (error.code === 11000) {
                    if (error.message.includes("name")) {
                        throw new Error("Country with this name already exists");
                    }
                    if (error.message.includes("slug")) {
                        throw new Error("Country with this slug already exists");
                    }
                    throw new Error("Country already exists");
                }
                throw new Error(`Error updating country: ${error.message}`);
            }
        });
    }
    // Delete country
    deleteCountry(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const country = yield Country_1.default.findByIdAndDelete(id);
                if (!country) {
                    throw new Error("Country not found");
                }
                return country;
            }
            catch (error) {
                throw new Error(`Error deleting country: ${error.message}`);
            }
        });
    }
    // Get active countries only
    getActiveCountries() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countries = yield Country_1.default.find({ status: "active" }).sort({
                    name: 1,
                });
                return countries;
            }
            catch (error) {
                throw new Error(`Error fetching active countries: ${error.message}`);
            }
        });
    }
    // Get countries statistics
    getCountryStats() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield Country_1.default.aggregate([
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 },
                            active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
                            inactive: {
                                $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] },
                            },
                        },
                    },
                ]);
                return {
                    overview: stats[0] || { total: 0, active: 0, inactive: 0 },
                };
            }
            catch (error) {
                throw new Error(`Error fetching country statistics: ${error.message}`);
            }
        });
    }
}
const countryService = new CountryService();
exports.default = countryService;
