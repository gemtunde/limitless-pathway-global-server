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
const Scholarship_1 = __importDefault(require("../models/Scholarship"));
class ScholarshipService {
    // Get all scholarships with optional filtering and pagination
    getAllScholarships() {
        return __awaiter(this, arguments, void 0, function* (query = {}) {
            const { page = "1", limit = "10", search, status, category, level, sortBy = "createdAt", sortOrder = "desc", } = query;
            const filter = {};
            // Add search functionality
            if (search) {
                filter.$text = { $search: search };
            }
            // Add filters
            if (status)
                filter.status = status;
            if (category)
                filter.category = category;
            if (level)
                filter.level = level;
            // Calculate pagination
            const skip = (parseInt(page) - 1) * parseInt(limit);
            // Create sort object
            const sort = {};
            sort[sortBy] = sortOrder === "desc" ? -1 : 1;
            try {
                const scholarships = yield Scholarship_1.default.find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(parseInt(limit));
                const total = yield Scholarship_1.default.countDocuments(filter);
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
                    scholarships,
                    pagination,
                };
            }
            catch (error) {
                throw new Error(`Error fetching scholarships: ${error.message}`);
            }
        });
    }
    // Get scholarship by ID
    //   async getScholarshipById(id: string): Promise<IScholarship> {
    //     try {
    //       const scholarship = await Scholarship.findById(id);
    //       if (!scholarship) {
    //         throw new Error('Scholarship not found');
    //       }
    //       return scholarship;
    //     } catch (error) {
    //       throw new Error(`Error fetching scholarship: ${(error as Error).message}`);
    //     }
    //   }
    // Create new scholarship
    createScholarship(scholarshipData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const scholarship = new Scholarship_1.default(scholarshipData);
                return yield scholarship.save();
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new Error("Scholarship with this title already exists");
                }
                throw new Error(`Error creating scholarship: ${error.message}`);
            }
        });
    }
    // Update scholarship
    updateScholarship(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const scholarship = yield Scholarship_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { new: true, runValidators: true });
                if (!scholarship) {
                    throw new Error("Scholarship not found");
                }
                return scholarship;
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new Error("Scholarship with this title already exists");
                }
                throw new Error(`Error updating scholarship: ${error.message}`);
            }
        });
    }
    // Delete scholarship
    deleteScholarship(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const scholarship = yield Scholarship_1.default.findByIdAndDelete(id);
                if (!scholarship) {
                    throw new Error("Scholarship not found");
                }
                return scholarship;
            }
            catch (error) {
                throw new Error(`Error deleting scholarship: ${error.message}`);
            }
        });
    }
}
const scholarshipService = new ScholarshipService();
exports.default = scholarshipService;
