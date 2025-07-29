"use strict";
//import { FAQ, IFAQ } from '../models/faq.model';
//import { CreateFaqData, UpdateFaqData, FaqQueryData } from '../validators';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqService = void 0;
const Faq_1 = require("../models/Faq");
class FaqService {
    createFaq(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const faq = new Faq_1.FAQ(data);
            return yield faq.save();
        });
    }
    getAllFaqs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, category, status, sortBy, sortOrder } = query;
            // Build filter object
            const filter = {};
            if (search) {
                filter.$or = [
                    { question: { $regex: search, $options: "i" } },
                    { answer: { $regex: search, $options: "i" } },
                    { tags: { $regex: search, $options: "i" } },
                ];
            }
            if (category)
                filter.category = category;
            if (status)
                filter.status = status;
            // Build sort object - handle order field specially
            const sort = {};
            if (sortBy === "order") {
                // For order sorting, put null/undefined values last
                sort.order = sortOrder === "asc" ? 1 : -1;
            }
            else {
                sort[sortBy] = sortOrder === "asc" ? 1 : -1;
            }
            // Calculate pagination
            const skip = (page - 1) * limit;
            // Get total count and faqs
            const [faqs, totalFaqs] = yield Promise.all([
                Faq_1.FAQ.find(filter).sort(sort).skip(skip).limit(limit).lean(),
                Faq_1.FAQ.countDocuments(filter),
            ]);
            const totalPages = Math.ceil(totalFaqs / limit);
            return {
                faqs: faqs,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalFaqs,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                },
            };
        });
    }
    getFaqById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Faq_1.FAQ.findById(id);
        });
    }
    updateFaq(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Faq_1.FAQ.findByIdAndUpdate(id, Object.assign(Object.assign({}, data), { updatedAt: new Date() }), { new: true, runValidators: true });
        });
    }
    deleteFaq(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Faq_1.FAQ.findByIdAndDelete(id);
        });
    }
    incrementHelpful(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Faq_1.FAQ.findByIdAndUpdate(id, { $inc: { helpful: 1 } }, { new: true });
        });
    }
    incrementNotHelpful(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Faq_1.FAQ.findByIdAndUpdate(id, { $inc: { notHelpful: 1 } }, { new: true });
        });
    }
    getPublishedFaqs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getAllFaqs(Object.assign(Object.assign({}, query), { status: "published" }));
        });
    }
    getFaqsByCategory(category, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = Faq_1.FAQ.find({ category, status: "published" }).sort({
                order: 1,
                createdAt: 1,
            });
            if (limit) {
                query.limit(limit);
            }
            return (yield query.lean());
        });
    }
    getFaqStats() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const [statusStats, helpfulStats, categoryStats] = yield Promise.all([
                Faq_1.FAQ.aggregate([
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 },
                        },
                    },
                ]),
                Faq_1.FAQ.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalHelpful: { $sum: "$helpful" },
                            totalNotHelpful: { $sum: "$notHelpful" },
                        },
                    },
                ]),
                Faq_1.FAQ.aggregate([
                    {
                        $group: {
                            _id: "$category",
                            count: { $sum: 1 },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]),
            ]);
            const result = {
                total: 0,
                published: 0,
                draft: 0,
                archived: 0,
                totalHelpful: ((_a = helpfulStats[0]) === null || _a === void 0 ? void 0 : _a.totalHelpful) || 0,
                totalNotHelpful: ((_b = helpfulStats[0]) === null || _b === void 0 ? void 0 : _b.totalNotHelpful) || 0,
                categoryCounts: categoryStats.map((stat) => ({
                    category: stat._id,
                    count: stat.count,
                })),
            };
            statusStats.forEach((stat) => {
                result.total += stat.count;
                if (stat._id === "published")
                    result.published = stat.count;
                else if (stat._id === "draft")
                    result.draft = stat.count;
                else if (stat._id === "archived")
                    result.archived = stat.count;
            });
            return result;
        });
    }
    reorderFaqs(reorderData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatePromises = reorderData.map(({ id, order }) => Faq_1.FAQ.findByIdAndUpdate(id, { order }, { runValidators: true }));
            yield Promise.all(updatePromises);
        });
    }
}
exports.FaqService = FaqService;
