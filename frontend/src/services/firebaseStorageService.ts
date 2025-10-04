// Firebase Storage Service - Image Upload and Management
// This service handles all Firebase Storage operations for crop images
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTask,
  UploadTaskSnapshot,
  StorageReference,
  getMetadata,
  updateMetadata
} from 'firebase/storage';
import { storage } from '../config/firebase';

// Image metadata interface
export interface ImageMetadata {
  contentType?: string;
  customMetadata?: {
    cropId?: string;
    farmerId?: string;
    cropType?: string;
    uploadDate?: string;
    quality?: string;
    width?: string;
    height?: string;
    [key: string]: string | undefined;
  };
}

// Upload progress callback type
export type UploadProgressCallback = (progress: number) => void;

// Upload result interface
export interface UploadResult {
  success: boolean;
  downloadURL?: string;
  fileName?: string;
  filePath?: string;
  error?: string;
}

// Delete result interface
export interface DeleteResult {
  success: boolean;
  error?: string;
}

/**
 * Upload a single image to Firebase Storage
 */
export const uploadImageToFirebase = async (
  file: File,
  cropId: string,
  farmerId: string,
  metadata?: ImageMetadata,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> => {
  try {
    console.log('🔥 Uploading image to Firebase Storage:', file.name);

    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `crops/${farmerId}/${cropId}/${fileName}`;

    // Create storage reference
    const storageRef = ref(storage, filePath);

    // Prepare metadata
    const uploadMetadata: ImageMetadata = {
      contentType: file.type,
      customMetadata: {
        cropId,
        farmerId,
        uploadDate: new Date().toISOString(),
        originalFileName: file.name,
        fileSize: file.size.toString(),
        ...metadata?.customMetadata
      }
    };

    // Upload with progress tracking
    if (onProgress) {
      const uploadTask: UploadTask = uploadBytesResumable(storageRef, file, uploadMetadata);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(Math.round(progress));
            console.log(`🔥 Upload progress: ${progress.toFixed(2)}%`);
          },
          (error) => {
            console.error('❌ Upload error:', error);
            reject({
              success: false,
              error: error.message
            });
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('✅ Image uploaded successfully:', downloadURL);
              resolve({
                success: true,
                downloadURL,
                fileName,
                filePath
              });
            } catch (error) {
              console.error('❌ Error getting download URL:', error);
              reject({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get download URL'
              });
            }
          }
        );
      });
    } else {
      // Simple upload without progress tracking
      const snapshot = await uploadBytes(storageRef, file, uploadMetadata);
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log('✅ Image uploaded successfully:', downloadURL);
      return {
        success: true,
        downloadURL,
        fileName,
        filePath
      };
    }
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Upload multiple images to Firebase Storage
 */
export const uploadMultipleImagesToFirebase = async (
  files: File[],
  cropId: string,
  farmerId: string,
  metadata?: ImageMetadata,
  onProgress?: UploadProgressCallback
): Promise<{
  success: boolean;
  results?: UploadResult[];
  downloadURLs?: string[];
  error?: string;
}> => {
  try {
    console.log('🔥 Uploading multiple images to Firebase Storage:', files.length);

    const uploadPromises = files.map((file, index) => {
      const progressCallback = onProgress
        ? (progress: number) => {
            const totalProgress = ((index + progress / 100) / files.length) * 100;
            onProgress(Math.round(totalProgress));
          }
        : undefined;

      return uploadImageToFirebase(file, cropId, farmerId, metadata, progressCallback);
    });

    const results = await Promise.all(uploadPromises);

    // Check if all uploads were successful
    const allSuccess = results.every((result) => result.success);
    const downloadURLs = results
      .filter((result) => result.success && result.downloadURL)
      .map((result) => result.downloadURL!);

    if (allSuccess) {
      console.log('✅ All images uploaded successfully:', downloadURLs.length);
      return {
        success: true,
        results,
        downloadURLs
      };
    } else {
      const failedCount = results.filter((result) => !result.success).length;
      console.warn(`⚠️ Some uploads failed: ${failedCount}/${files.length}`);
      return {
        success: false,
        results,
        downloadURLs,
        error: `${failedCount} uploads failed`
      };
    }
  } catch (error) {
    console.error('❌ Error uploading multiple images:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Delete an image from Firebase Storage
 */
export const deleteImageFromFirebase = async (filePath: string): Promise<DeleteResult> => {
  try {
    console.log('🔥 Deleting image from Firebase Storage:', filePath);

    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);

    console.log('✅ Image deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Delete multiple images from Firebase Storage
 */
export const deleteMultipleImagesFromFirebase = async (filePaths: string[]): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    console.log('🔥 Deleting multiple images from Firebase Storage:', filePaths.length);

    const deletePromises = filePaths.map((filePath) => deleteImageFromFirebase(filePath));
    const results = await Promise.all(deletePromises);

    const allSuccess = results.every((result) => result.success);

    if (allSuccess) {
      console.log('✅ All images deleted successfully');
      return { success: true };
    } else {
      const failedCount = results.filter((result) => !result.success).length;
      console.warn(`⚠️ Some deletions failed: ${failedCount}/${filePaths.length}`);
      return {
        success: false,
        error: `${failedCount} deletions failed`
      };
    }
  } catch (error) {
    console.error('❌ Error deleting multiple images:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Delete all images for a specific crop
 */
export const deleteCropImages = async (cropId: string, farmerId: string): Promise<DeleteResult> => {
  try {
    console.log('🔥 Deleting all images for crop:', cropId);

    const folderRef = ref(storage, `crops/${farmerId}/${cropId}`);
    const listResult = await listAll(folderRef);

    if (listResult.items.length === 0) {
      console.log('ℹ️ No images found for this crop');
      return { success: true };
    }

    const deletePromises = listResult.items.map((item) => deleteObject(item));
    await Promise.all(deletePromises);

    console.log('✅ All crop images deleted successfully:', listResult.items.length);
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting crop images:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get all image URLs for a specific crop
 */
export const getCropImages = async (cropId: string, farmerId: string): Promise<{
  success: boolean;
  imageURLs?: string[];
  error?: string;
}> => {
  try {
    console.log('🔥 Getting all images for crop:', cropId);

    const folderRef = ref(storage, `crops/${farmerId}/${cropId}`);
    const listResult = await listAll(folderRef);

    if (listResult.items.length === 0) {
      console.log('ℹ️ No images found for this crop');
      return { success: true, imageURLs: [] };
    }

    const urlPromises = listResult.items.map((item) => getDownloadURL(item));
    const imageURLs = await Promise.all(urlPromises);

    console.log('✅ Retrieved crop images:', imageURLs.length);
    return { success: true, imageURLs };
  } catch (error) {
    console.error('❌ Error getting crop images:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get image metadata
 */
export const getImageMetadata = async (filePath: string): Promise<{
  success: boolean;
  metadata?: any;
  error?: string;
}> => {
  try {
    console.log('🔥 Getting image metadata:', filePath);

    const storageRef = ref(storage, filePath);
    const metadata = await getMetadata(storageRef);

    console.log('✅ Retrieved image metadata:', metadata);
    return { success: true, metadata };
  } catch (error) {
    console.error('❌ Error getting image metadata:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Update image metadata
 */
export const updateImageMetadata = async (
  filePath: string,
  metadata: ImageMetadata
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    console.log('🔥 Updating image metadata:', filePath);

    const storageRef = ref(storage, filePath);
    await updateMetadata(storageRef, metadata);

    console.log('✅ Image metadata updated successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating image metadata:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get download URL from file path
 */
export const getImageDownloadURL = async (filePath: string): Promise<{
  success: boolean;
  downloadURL?: string;
  error?: string;
}> => {
  try {
    console.log('🔥 Getting download URL for:', filePath);

    const storageRef = ref(storage, filePath);
    const downloadURL = await getDownloadURL(storageRef);

    console.log('✅ Retrieved download URL:', downloadURL);
    return { success: true, downloadURL };
  } catch (error) {
    console.error('❌ Error getting download URL:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Compress image before upload (client-side)
 */
export const compressImage = async (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              console.log(`✅ Image compressed: ${file.size} → ${compressedFile.size} bytes`);
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// Export all functions
export default {
  uploadImageToFirebase,
  uploadMultipleImagesToFirebase,
  deleteImageFromFirebase,
  deleteMultipleImagesFromFirebase,
  deleteCropImages,
  getCropImages,
  getImageMetadata,
  updateImageMetadata,
  getImageDownloadURL,
  compressImage
};
