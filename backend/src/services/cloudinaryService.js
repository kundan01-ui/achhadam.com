/**
 * Cloudinary Service - Optional Image Storage
 *
 * Features:
 * - Upload images to Cloudinary
 * - Automatic fallback to MongoDB Base64 storage
 * - Delete images from Cloudinary
 * - Image transformations (resize, optimize)
 */

const cloudinary = require('cloudinary').v2;
const apiConfig = require('../config/apiConfig');

// ========================================
// CONFIGURATION (FROM CENTRALIZED CONFIG)
// ========================================
let isCloudinaryEnabled = false;

try {
  const config = apiConfig.cloudinary;

  if (config.enabled && config.cloudName && config.apiKey && config.apiSecret) {
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
      secure: true
    });

    isCloudinaryEnabled = true;
    console.log('✅ Cloudinary enabled - Images will be uploaded to cloud storage');
    console.log(`   Cloud Name: ${config.cloudName}`);
  } else {
    console.log('⚠️  Cloudinary disabled - Images will be stored in MongoDB as Base64');
    console.log('   To enable: Update API keys in .env file');
  }
} catch (error) {
  console.error('❌ Cloudinary configuration error:', error.message);
  console.log('📦 Falling back to MongoDB Base64 storage');
}

// ========================================
// UPLOAD IMAGE TO CLOUDINARY
// ========================================
/**
 * Upload image to Cloudinary with fallback
 * @param {string} base64Image - Base64 encoded image
 * @param {object} options - Upload options
 * @returns {Promise<object>} - Upload result or fallback data
 */
const uploadImage = async (base64Image, options = {}) => {
  // If Cloudinary is disabled, return base64 immediately
  if (!isCloudinaryEnabled) {
    return {
      success: true,
      url: base64Image,
      storage: 'mongodb',
      message: 'Cloudinary disabled - stored in MongoDB'
    };
  }

  try {
    // Validate base64 image
    if (!base64Image || !base64Image.startsWith('data:image/')) {
      throw new Error('Invalid base64 image format');
    }

    // Default upload options
    const uploadOptions = {
      folder: options.folder || 'achhadam/crops',
      resource_type: 'image',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ],
      ...options
    };

    // Upload to Cloudinary
    console.log('☁️  Uploading image to Cloudinary...');
    const result = await cloudinary.uploader.upload(base64Image, uploadOptions);

    console.log('✅ Cloudinary upload success:', result.public_id);

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      storage: 'cloudinary',
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      message: 'Image uploaded to Cloudinary'
    };

  } catch (error) {
    console.error('❌ Cloudinary upload failed:', error.message);
    console.log('📦 Falling back to MongoDB Base64 storage');

    // Fallback to MongoDB storage
    return {
      success: true,
      url: base64Image,
      storage: 'mongodb',
      error: error.message,
      message: 'Cloudinary upload failed - stored in MongoDB'
    };
  }
};

// ========================================
// DELETE IMAGE FROM CLOUDINARY
// ========================================
/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>} - Delete result
 */
const deleteImage = async (publicId) => {
  if (!isCloudinaryEnabled) {
    return {
      success: true,
      message: 'Cloudinary disabled - no deletion needed'
    };
  }

  try {
    if (!publicId) {
      return {
        success: true,
        message: 'No public ID provided - skipping deletion'
      };
    }

    console.log('🗑️  Deleting image from Cloudinary:', publicId);
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      console.log('✅ Image deleted from Cloudinary');
      return {
        success: true,
        message: 'Image deleted from Cloudinary'
      };
    } else {
      console.warn('⚠️  Image deletion warning:', result.result);
      return {
        success: false,
        message: `Image deletion failed: ${result.result}`
      };
    }

  } catch (error) {
    console.error('❌ Cloudinary deletion error:', error.message);
    return {
      success: false,
      error: error.message,
      message: 'Failed to delete image from Cloudinary'
    };
  }
};

// ========================================
// UPLOAD MULTIPLE IMAGES
// ========================================
/**
 * Upload multiple images to Cloudinary with fallback
 * @param {Array<string>} base64Images - Array of base64 images
 * @param {object} options - Upload options
 * @returns {Promise<Array>} - Array of upload results
 */
const uploadMultipleImages = async (base64Images, options = {}) => {
  if (!Array.isArray(base64Images) || base64Images.length === 0) {
    return [];
  }

  console.log(`📤 Uploading ${base64Images.length} images...`);

  const uploadPromises = base64Images.map((base64Image, index) =>
    uploadImage(base64Image, {
      ...options,
      public_id: options.public_id ? `${options.public_id}_${index}` : undefined
    })
  );

  try {
    const results = await Promise.all(uploadPromises);

    const cloudinaryCount = results.filter(r => r.storage === 'cloudinary').length;
    const mongodbCount = results.filter(r => r.storage === 'mongodb').length;

    console.log(`✅ Upload complete: ${cloudinaryCount} to Cloudinary, ${mongodbCount} to MongoDB`);

    return results;
  } catch (error) {
    console.error('❌ Multiple upload error:', error.message);
    return base64Images.map(img => ({
      success: true,
      url: img,
      storage: 'mongodb',
      error: error.message
    }));
  }
};

// ========================================
// GET OPTIMIZED IMAGE URL
// ========================================
/**
 * Get optimized image URL with transformations
 * @param {string} imageUrl - Original image URL
 * @param {object} transformations - Cloudinary transformations
 * @returns {string} - Optimized image URL
 */
const getOptimizedUrl = (imageUrl, transformations = {}) => {
  // If not a Cloudinary URL, return original
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }

  if (!isCloudinaryEnabled) {
    return imageUrl;
  }

  try {
    // Default transformations
    const defaultTransforms = {
      width: transformations.width || 400,
      height: transformations.height || 400,
      crop: transformations.crop || 'fill',
      quality: transformations.quality || 'auto:good',
      fetch_format: 'auto'
    };

    // Extract public ID from Cloudinary URL
    const publicIdMatch = imageUrl.match(/\/v\d+\/(.+)\.\w+$/);
    if (!publicIdMatch) return imageUrl;

    const publicId = publicIdMatch[1];

    // Generate optimized URL
    return cloudinary.url(publicId, defaultTransforms);
  } catch (error) {
    console.error('❌ URL optimization error:', error.message);
    return imageUrl;
  }
};

// ========================================
// CHECK CLOUDINARY STATUS
// ========================================
/**
 * Check if Cloudinary is enabled and configured
 * @returns {object} - Cloudinary status
 */
const getStatus = () => {
  return {
    enabled: isCloudinaryEnabled,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'not-configured',
    storage: isCloudinaryEnabled ? 'cloudinary' : 'mongodb'
  };
};

// ========================================
// EXPORTS
// ========================================
module.exports = {
  uploadImage,
  deleteImage,
  uploadMultipleImages,
  getOptimizedUrl,
  getStatus,
  isEnabled: () => isCloudinaryEnabled
};
