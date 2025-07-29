"use strict";
//import { Blog, IBlog } from '../models/blog.model';
//import { CreateBlogData, UpdateBlogData, BlogQueryData } from '../validators';
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
exports.BlogService = void 0;
const Blog_1 = require("../models/Blog");
class BlogService {
    createBlog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if slug already exists
                const existingBlog = yield Blog_1.Blog.findOne({ slug: data.slug });
                if (existingBlog) {
                    throw new Error("A blog post with this slug already exists");
                }
                const blog = new Blog_1.Blog(data);
                return yield blog.save();
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new Error("A blog post with this slug already exists");
                }
                throw error;
            }
        });
    }
    getAllBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, category, status, author, sortBy, sortOrder } = query;
            // Build filter object
            const filter = {};
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: "i" } },
                    { excerpt: { $regex: search, $options: "i" } },
                    { content: { $regex: search, $options: "i" } },
                    { tags: { $regex: search, $options: "i" } },
                ];
            }
            if (category)
                filter.category = category;
            if (status)
                filter.status = status;
            if (author)
                filter.author = { $regex: author, $options: "i" };
            // Build sort object
            const sort = {};
            sort[sortBy] = sortOrder === "asc" ? 1 : -1;
            // Calculate pagination
            const skip = (page - 1) * limit;
            // Get total count and blogs
            const [blogs, totalBlogs] = yield Promise.all([
                Blog_1.Blog.find(filter).sort(sort).skip(skip).limit(limit).lean(),
                Blog_1.Blog.countDocuments(filter),
            ]);
            const totalPages = Math.ceil(totalBlogs / limit);
            return {
                blogs: blogs,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalBlogs,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                },
            };
        });
    }
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Blog_1.Blog.findById(id);
        });
    }
    getBlogBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Blog_1.Blog.findOne({ slug });
        });
    }
    updateBlog(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // If slug is being updated, check if it already exists
                if (data.slug) {
                    const existingBlog = yield Blog_1.Blog.findOne({
                        slug: data.slug,
                        _id: { $ne: id },
                    });
                    if (existingBlog) {
                        throw new Error("A blog post with this slug already exists");
                    }
                }
                return yield Blog_1.Blog.findByIdAndUpdate(id, Object.assign(Object.assign({}, data), { updatedAt: new Date() }), { new: true, runValidators: true });
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new Error("A blog post with this slug already exists");
                }
                throw error;
            }
        });
    }
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Blog_1.Blog.findByIdAndDelete(id);
        });
    }
    incrementViews(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Blog_1.Blog.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
        });
    }
    getPublishedBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getAllBlogs(Object.assign(Object.assign({}, query), { status: "published" }));
        });
    }
    getBlogStats() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const [stats, totalViews] = yield Promise.all([
                Blog_1.Blog.aggregate([
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 },
                        },
                    },
                ]),
                Blog_1.Blog.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalViews: { $sum: "$views" },
                        },
                    },
                ]),
            ]);
            const result = {
                total: 0,
                published: 0,
                draft: 0,
                archived: 0,
                totalViews: ((_a = totalViews[0]) === null || _a === void 0 ? void 0 : _a.totalViews) || 0,
            };
            stats.forEach((stat) => {
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
}
exports.BlogService = BlogService;
