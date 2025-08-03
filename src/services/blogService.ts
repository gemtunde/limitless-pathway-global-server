import { Blog, IBlog } from "../models/Blog";
import cloudinary from "../config/cloudinary";
import slugify from "slugify";
import fs from "fs/promises";
import path from "path";

// export interface ImageData {
//   path: string;
//   relativePath: string;
// }

export interface CreateBlogData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  category: string;
  tags?: string;
  status: "draft" | "published" | "archived";
  publishDate?: string;
  metaDescription?: string;
  author: string;
  readTime?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  status?: string;
  category?: string;
  search?: string;
}

export class BlogService {
  // Upload image to Cloudinary from file path
  static async uploadImageFromPath(imagePath: string): Promise<string> {
    try {
      // Check if file exists
      await fs.access(imagePath);

      // Get filename from path
      const filename = path.basename(imagePath, path.extname(imagePath));

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          imagePath,
          {
            folder: "blog-images",
            public_id: `blog-${Date.now()}-${filename}`,
            resource_type: "image",
            transformation: [
              { width: 1200, height: 630, crop: "limit" },
              { quality: "auto:good" },
              { fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(new Error(`Failed to upload image: ${error.message}`));
            } else {
              resolve(result!.secure_url);
            }
          }
        );
      });
    } catch (error) {
      console.error("File access error:", error);
      throw new Error(`Cannot access image file: ${imagePath}`);
    }
  }

  // Upload image to Cloudinary from buffer (fallback method)
  static async uploadImageFromBuffer(
    buffer: Buffer,
    filename: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "blog-images",
          public_id: `blog-${Date.now()}-${filename}`,
          resource_type: "image",
          transformation: [
            { width: 1200, height: 630, crop: "limit" },
            { quality: "auto:good" },
            { fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result!.secure_url);
          }
        }
      );

      uploadStream.end(buffer);
    });
  }

  // Extract Cloudinary public ID from URL
  static extractPublicId(imageUrl: string): string | null {
    try {
      const urlParts = imageUrl.split("/");
      const filename = urlParts[urlParts.length - 1];
      const publicId = filename.split(".")[0];
      return `blog-images/${publicId}`;
    } catch (error) {
      console.error("Error extracting public ID:", error);
      return null;
    }
  }

  // Create a new blog post
  // static async createBlog(data: CreateBlogData): Promise<IBlog> {
  //   try {
  //     // Generate slug if not provided or ensure uniqueness
  //     if (!data.slug || data.slug.trim() === "") {
  //       data.slug = slugify(data.title, { lower: true, strict: true });
  //     }

  //     // Check if slug already exists
  //     const existingBlog = await Blog.findOne({ slug: data.slug });
  //     if (existingBlog) {
  //       data.slug = `${data.slug}-${Date.now()}`;
  //     }

  //     // Upload image if provided
  //     let featuredImage = "";
  //     if (data.image && data.image.path) {
  //       try {
  //         // Resolve the absolute path
  //         const absolutePath = path.resolve(data.image.path);
  //         console.log("Attempting to upload image from path:", absolutePath);

  //         featuredImage = await this.uploadImageFromPath(absolutePath);
  //         console.log("Image uploaded successfully:", featuredImage);
  //       } catch (imageError) {
  //         console.error("Image upload failed:", imageError);
  //         // Continue without image rather than failing the entire operation
  //         console.log("Continuing blog creation without image...");
  //       }
  //     }

  //     // Create blog post
  //     const blogData = {
  //       title: data.title,
  //       slug: data.slug,
  //       excerpt: data.excerpt,
  //       content: data.content,
  //       featuredImage,
  //       category: data.category,
  //       tags: data.tags || "",
  //       status: data.status,
  //       publishDate: data.publishDate ? new Date(data.publishDate) : undefined,
  //       metaDescription: data.metaDescription || "",
  //       author: data.author,
  //       readTime: data.readTime || "",
  //       views: 0,
  //     };

  //     const blog = new Blog(blogData);
  //     return await blog.save();
  //   } catch (error) {
  //     console.error("Create blog error:", error);
  //     throw new Error(
  //       `Failed to create blog: ${error instanceof Error ? error.message : "Unknown error"}`
  //     );
  //   }
  // }

  // Create a new blog post service
  static async createBlog(data: CreateBlogData): Promise<IBlog> {
    try {
      // Generate slug if not provided or ensure uniqueness
      if (!data.slug || data.slug.trim() === "") {
        data.slug = slugify(data.title, { lower: true, strict: true });
      }

      // Check if slug already exists
      const existingBlog = await Blog.findOne({ slug: data.slug });
      if (existingBlog) {
        data.slug = `${data.slug}-${Date.now()}`;
      }

      // // Upload image if provided
      // let featuredImage = "";
      // if (data.image && data.image.path) {
      //   try {
      //     let imagePath: string;

      //     // Handle different path scenarios
      //     if (path.isAbsolute(data.image.path)) {
      //       // Already absolute path
      //       imagePath = data.image.path;
      //     } else if (data.image.path.startsWith("./")) {
      //       // Relative path - resolve to common image directories
      //       const possiblePaths = [
      //         path.join(
      //           __dirname,
      //           "../../public/images/",
      //           data.image.path.replace("./", "")
      //         ),
      //         path.join(
      //           __dirname,
      //           "../../uploads/",
      //           data.image.path.replace("./", "")
      //         ),
      //         path.join(
      //           __dirname,
      //           "../../assets/images/",
      //           data.image.path.replace("./", "")
      //         ),
      //         path.join(
      //           process.cwd(),
      //           "public/images/",
      //           data.image.path.replace("./", "")
      //         ),
      //         path.join(
      //           process.cwd(),
      //           "uploads/",
      //           data.image.path.replace("./", "")
      //         ),
      //         // Try the original path as fallback
      //         path.resolve(data.image.path),
      //       ];

      //       // Find the first path that exists
      //       imagePath = "";
      //       for (const possiblePath of possiblePaths) {
      //         try {
      //           await fs.access(possiblePath);
      //           imagePath = possiblePath;
      //           console.log(`Found image at: ${imagePath}`);
      //           break;
      //         } catch {
      //           // Path doesn't exist, try next
      //           continue;
      //         }
      //       }

      //       if (!imagePath) {
      //         throw new Error(
      //           `Image file not found in any expected location. Searched paths: ${possiblePaths.join(", ")}`
      //         );
      //       }
      //     } else {
      //       // Regular relative path
      //       imagePath = path.join(
      //         process.cwd(),
      //         "public/images/",
      //         data.image.path
      //       );
      //     }

      //     console.log("Attempting to upload image from path:", imagePath);
      //     featuredImage = await this.uploadImageFromPath(imagePath);
      //     console.log("Image uploaded successfully:", featuredImage);
      //   } catch (imageError) {
      //     console.error("Image upload failed:", imageError);
      //     // Log more details about what paths were tried
      //     console.error("Original image path:", data.image.path);
      //     console.error("Current working directory:", process.cwd());
      //     console.error("__dirname:", __dirname);

      //     // Continue without image rather than failing the entire operation
      //     console.log("Continuing blog creation without image...");
      //   }
      // }

      // Create blog post
      const blogData = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image,
        category: data.category,
        tags: data.tags || "",
        status: data.status,
        //publishDate: data.publishDate ? new Date(data.publishDate) : undefined,
        metaDescription: data.metaDescription || "",
        author: data.author,
        readTime: data.readTime || "",
        views: 0,
      };

      const blog = new Blog(blogData);
      return await blog.save();
    } catch (error) {
      console.error("Create blog error:", error);
      throw new Error(
        `Failed to create blog: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  // Get all blogs with pagination and filters
  static async getAllBlogs(options: PaginationOptions) {
    try {
      const { page = 1, limit = 10, status, category, search } = options;
      const skip = (page - 1) * limit;

      // Build filter query
      const filter: any = {};

      if (status) {
        filter.status = status;
      }

      if (category) {
        filter.category = category;
      }

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { excerpt: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ];
      }

      // Execute queries
      const [blogs, total] = await Promise.all([
        Blog.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Blog.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: blogs,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch blogs: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  // Get blog by ID
  static async getBlogById(id: string): Promise<IBlog | null> {
    try {
      return await Blog.findById(id);
    } catch (error) {
      throw new Error(
        `Failed to fetch blog: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  // Get blog by slug
  static async getBlogBySlug(slug: string): Promise<IBlog | null> {
    try {
      return await Blog.findOne({ slug });
    } catch (error) {
      throw new Error(
        `Failed to fetch blog: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  // Update blog
  static async updateBlog(
    id: string,
    data: Partial<CreateBlogData>
  ): Promise<IBlog | null> {
    try {
      const existingBlog = await Blog.findById(id);
      if (!existingBlog) {
        throw new Error("Blog not found");
      }

      // Handle image upload
      // let featuredImage = existingBlog.image;
      // if (data.image && data.image.path) {
      //   try {
      //     // Delete old image from Cloudinary if exists
      //     if (existingBlog.image) {
      //       const publicId = this.extractPublicId(existingBlog.image);
      //       if (publicId) {
      //         await cloudinary.uploader.destroy(publicId);
      //       }
      //     }

      //     // Upload new image
      //     const absolutePath = path.resolve(data.image.path);
      //     featuredImage = await this.uploadImageFromPath(absolutePath);
      //   } catch (imageError) {
      //     console.error("Image update failed:", imageError);
      //     // Keep the existing image if new upload fails
      //   }
      // }

      // Update slug if title changed
      if (data.title && data.title !== existingBlog.title) {
        const newSlug = slugify(data.title, { lower: true, strict: true });
        const slugExists = await Blog.findOne({
          slug: newSlug,
          _id: { $ne: id },
        });
        if (!slugExists) {
          data.slug = newSlug;
        }
      }

      // Prepare update data
      const updateData: any = {
        ...data,
      };

      // Handle publishDate
      if (data.publishDate) {
        updateData.publishDate = new Date(data.publishDate);
      }

      // Remove image from update data since we handled it separately
      //delete updateData.image;

      return await Blog.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new Error(
        `Failed to update blog: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  // Delete blog
  static async deleteBlog(id: string): Promise<boolean> {
    try {
      const blog = await Blog.findById(id);
      if (!blog) {
        throw new Error("Blog not found");
      }

      // Delete image from Cloudinary if exists
      // if (blog.image) {
      //   const publicId = this.extractPublicId(blog.image);
      //   if (publicId) {
      //     await cloudinary.uploader.destroy(publicId);
      //   }
      // }

      await Blog.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw new Error(
        `Failed to delete blog: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  // Increment view count
  static async incrementViews(id: string): Promise<void> {
    try {
      await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } });
    } catch (error) {
      throw new Error(
        `Failed to increment views: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}
