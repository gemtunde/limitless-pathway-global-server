import multer from "multer";

// Memory storage for Cloudinary upload
const storage = multer.memoryStorage();

// File filter for images only
const imageFileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// File filter for all file types
const allFileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  cb(null, true);
};

// Single image upload
export const uploadSingleImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("image");

// Multiple images upload
export const uploadMultipleImages = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
}).array("images", 10); // Max 10 files

// Mixed files upload
export const uploadMixedFiles = multer({
  storage,
  fileFilter: allFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "attachments", maxCount: 5 },
]);
