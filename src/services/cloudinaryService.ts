import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

// Configure Cloudinary (add these to your environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  transformation?: any[];
  resource_type?: "image" | "video" | "raw" | "auto";
  quality?: string | number;
  format?: string;
  width?: number;
  height?: number;
  crop?: string;
}

class CloudinaryService {
  /**
   * Upload a single file to Cloudinary
   */
  async uploadFile(
    file: Express.Multer.File,
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const defaultOptions = {
        resource_type: "auto" as const,
        quality: "auto",
        fetch_format: "auto",
      };

      const uploadOptions = { ...defaultOptions, ...options };

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (error) {
              reject(new Error(`Cloudinary upload failed: ${error.message}`));
            } else if (result) {
              resolve({
                public_id: result.public_id,
                secure_url: result.secure_url,
                width: result.width,
                height: result.height,
                format: result.format,
                resource_type: result.resource_type,
                created_at: result.created_at,
                bytes: result.bytes,
              });
            } else {
              reject(new Error("Upload failed: No result returned"));
            }
          }
        );

        uploadStream.end(file.buffer);
      });
    } catch (error: any) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Upload multiple files to Cloudinary
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResult[]> {
    try {
      const uploadPromises = files.map((file) =>
        this.uploadFile(file, options)
      );
      return await Promise.all(uploadPromises);
    } catch (error: any) {
      throw new Error(`Failed to upload multiple files: ${error.message}`);
    }
  }

  /**
   * Delete a file from Cloudinary
   */
  async deleteFile(publicId: string): Promise<{ result: string }> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error: any) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Delete multiple files from Cloudinary
   */
  async deleteMultipleFiles(publicIds: string[]): Promise<any> {
    try {
      const result = await cloudinary.api.delete_resources(publicIds);
      return result;
    } catch (error: any) {
      throw new Error(`Failed to delete multiple files: ${error.message}`);
    }
  }

  /**
   * Get optimized image URL with transformations
   */
  getOptimizedUrl(publicId: string, transformations: any[] = []): string {
    return cloudinary.url(publicId, {
      transformation: transformations,
      quality: "auto",
      fetch_format: "auto",
    });
  }

  /**
   * Upload file for blogs with specific optimization
   */
  async uploadBlogImage(
    file: Express.Multer.File
  ): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      folder: "blog-images",
      transformation: [
        { width: 1200, height: 800, crop: "fill", quality: "auto" },
        { fetch_format: "auto" },
      ],
      resource_type: "image",
    });
  }

  /**
   * Upload profile images with specific optimization
   */
  async uploadProfileImage(
    file: Express.Multer.File
  ): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      folder: "profile-images",
      transformation: [
        {
          width: 400,
          height: 400,
          crop: "fill",
          quality: "auto",
          gravity: "face",
        },
        { fetch_format: "auto" },
      ],
      resource_type: "image",
    });
  }

  /**
   * Upload event images with specific optimization
   */
  async uploadEventImage(
    file: Express.Multer.File
  ): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      folder: "event-images",
      transformation: [
        { width: 1000, height: 600, crop: "fill", quality: "auto" },
        { fetch_format: "auto" },
      ],
      resource_type: "image",
    });
  }
}

export const cloudinaryService = new CloudinaryService();
