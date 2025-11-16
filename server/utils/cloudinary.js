import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload Video (from memory buffer)
export const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: 'edutech/lessons',

        // Asynchronous transformations (required for large videos)
        eager: [
          {
            width: 1280,
            height: 720,
            crop: 'limit',
            quality: 'auto',
            fetch_format: 'auto'
          }
        ],
        eager_async: true
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};


// Upload Thumbnail (from memory buffer)
export const uploadThumbnail = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'edutech/thumbnails',
        transformation: [{ width: 600, crop: 'fill' }, { quality: 'auto' }]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary thumbnail error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(file.buffer);
  });
};


