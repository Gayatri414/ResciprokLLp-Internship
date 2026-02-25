import multer from 'multer';
import { cloudinary } from '../config/cloudinary.js';
import { env } from '../config/env.js';

// In-memory storage for Multer (files will be sent to Cloudinary in controller)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImage = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedPdf = ['application/pdf'];
  const allowed = [...allowedImage, ...allowedPdf];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: images (jpeg, png, gif, webp) and PDF.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/**
 * Upload buffer to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Cloudinary folder
 * @param {string} resourceType - 'image' or 'raw' (for PDF)
 */
export const uploadToCloudinary = (buffer, folder, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    if (!env.CLOUDINARY_CLOUD_NAME) {
      return reject(new Error('Cloudinary is not configured. Set env variables.'));
    }
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};
