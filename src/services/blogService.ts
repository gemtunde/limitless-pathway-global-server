//import { Blog, IBlog } from '../models/blog.model';
//import { CreateBlogData, UpdateBlogData, BlogQueryData } from '../validators';

import {
  BlogQueryData,
  CreateBlogData,
  UpdateBlogData,
} from "../lib/validations/blogValidations";
import { Blog, IBlog } from "../models/Blog";

export class BlogService {
  async createBlog(data: CreateBlogData): Promise<IBlog> {
    try {
      // Check if slug already exists
      const existingBlog = await Blog.findOne({ slug: data.slug });
      if (existingBlog) {
        throw new Error("A blog post with this slug already exists");
      }

      const blog = new Blog(data);
      return await blog.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("A blog post with this slug already exists");
      }
      throw error;
    }
  }

  async getAllBlogs(query: BlogQueryData): Promise<{
    blogs: IBlog[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalBlogs: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const { page, limit, search, category, status, author, sortBy, sortOrder } =
      query;

    // Build filter object
    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (author) filter.author = { $regex: author, $options: "i" };

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count and blogs
    const [blogs, totalBlogs] = await Promise.all([
      Blog.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Blog.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalBlogs / limit);

    return {
      blogs: blogs as IBlog[],
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogs,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getBlogById(id: string): Promise<IBlog | null> {
    return await Blog.findById(id);
  }

  async getBlogBySlug(slug: string): Promise<IBlog | null> {
    return await Blog.findOne({ slug });
  }

  async updateBlog(id: string, data: UpdateBlogData): Promise<IBlog | null> {
    try {
      // If slug is being updated, check if it already exists
      if (data.slug) {
        const existingBlog = await Blog.findOne({
          slug: data.slug,
          _id: { $ne: id },
        });
        if (existingBlog) {
          throw new Error("A blog post with this slug already exists");
        }
      }

      return await Blog.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("A blog post with this slug already exists");
      }
      throw error;
    }
  }

  async deleteBlog(id: string): Promise<IBlog | null> {
    return await Blog.findByIdAndDelete(id);
  }

  async incrementViews(id: string): Promise<IBlog | null> {
    return await Blog.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );
  }

  async getPublishedBlogs(query: Partial<BlogQueryData>): Promise<{
    blogs: IBlog[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalBlogs: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    return this.getAllBlogs({ ...query, status: "published" } as BlogQueryData);
  }

  async getBlogStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    archived: number;
    totalViews: number;
  }> {
    const [stats, totalViews] = await Promise.all([
      Blog.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Blog.aggregate([
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
      totalViews: totalViews[0]?.totalViews || 0,
    };

    stats.forEach((stat) => {
      result.total += stat.count;
      if (stat._id === "published") result.published = stat.count;
      else if (stat._id === "draft") result.draft = stat.count;
      else if (stat._id === "archived") result.archived = stat.count;
    });

    return result;
  }
}
