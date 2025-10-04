// Firebase Storage + MongoDB Hybrid Service
// Firebase Storage → Upload images/videos/documents
// MongoDB → Save crop data + Firebase Storage URLs
import {
  uploadImageToFirebase,
  uploadMultipleImagesToFirebase,
  deleteCropImages,
  UploadProgressCallback
} from './firebaseStorageService';
import { saveToMongoDB } from './databaseService';
import { apiConfig } from '../config/apiConfig';

const API_BASE_URL = apiConfig.baseURL;

// Extended crop data with Firebase URLs
export interface HybridCropData {
  id?: string;
  name: string;
  type: string;
  variety: string;
  quantity: number;
  unit: string;
  quality: string;
  price: number;
  harvestDate: string;
  organic: boolean;
  location: string;
  description: string;
  status: 'available' | 'sold' | 'pending' | 'reserved';
  uploadedAt?: string;
  farmerName: string;
  farmerId: string;
  farmerPhone?: string;
  farmerEmail?: string;
  // Firebase Storage URLs
  imageURLs: string[];
  videoURLs?: string[];
  documentURLs?: string[];
  // File metadata from Firebase
  firebaseMetadata?: {
    imagePaths: string[]; // For deletion
    videoPaths?: string[];
    documentPaths?: string[];
  };
  analytics?: {
    totalImages: number;
    totalVideos?: number;
    totalDocuments?: number;
    bestImageId?: string | null;
    averageImageQuality?: string | null;
    cropHealthScore?: number | null;
    marketValue?: number | null;
    demandScore?: number | null;
  };
}

// Upload result interface
export interface UploadCropResult {
  success: boolean;
  cropId?: string;
  imageURLs?: string[];
  videoURLs?: string[];
  documentURLs?: string[];
  mongoData?: any;
  error?: string;
}

/**
 * Upload crop with images to Firebase Storage + MongoDB
 * Step 1: Upload images to Firebase Storage
 * Step 2: Get download URLs
 * Step 3: Save crop data + URLs to MongoDB
 */
export const uploadCropWithMedia = async (
  cropData: Omit<HybridCropData, 'imageURLs'>,
  images: File[],
  videos?: File[],
  documents?: File[],
  onProgress?: UploadProgressCallback
): Promise<UploadCropResult> => {
  try {
    console.log('🔥 Starting hybrid upload - Firebase Storage + MongoDB');
    console.log('🔥 Crop data:', cropData);
    console.log('🔥 Images:', images.length);
    console.log('🔥 Videos:', videos?.length || 0);
    console.log('🔥 Documents:', documents?.length || 0);

    const farmerId = cropData.farmerId || localStorage.getItem('farmer_user_id') || 'unknown';
    const cropId = `crop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    let totalProgress = 0;
    const updateProgress = (step: number, stepProgress: number) => {
      const stepWeights = { images: 0.5, videos: 0.3, documents: 0.1, mongo: 0.1 };
      totalProgress = step * 100 + stepProgress;
      if (onProgress) {
        onProgress(Math.min(Math.round(totalProgress), 100));
      }
    };

    // Step 1: Upload images to Firebase Storage
    console.log('🔥 Step 1: Uploading images to Firebase Storage...');
    const imageUploadResult = await uploadMultipleImagesToFirebase(
      images,
      cropId,
      farmerId,
      {
        customMetadata: {
          cropType: cropData.type,
          cropName: cropData.name,
          quality: cropData.quality
        }
      },
      (progress) => updateProgress(0, progress * 0.5)
    );

    if (!imageUploadResult.success || !imageUploadResult.downloadURLs) {
      throw new Error(imageUploadResult.error || 'Failed to upload images to Firebase');
    }

    const imageURLs = imageUploadResult.downloadURLs;
    const imagePaths = imageUploadResult.results?.map(r => r.filePath!).filter(Boolean) || [];

    console.log('✅ Images uploaded to Firebase:', imageURLs.length);

    // Step 2: Upload videos to Firebase Storage (optional)
    let videoURLs: string[] = [];
    let videoPaths: string[] = [];

    if (videos && videos.length > 0) {
      console.log('🔥 Step 2: Uploading videos to Firebase Storage...');
      const videoUploadResult = await uploadMultipleImagesToFirebase(
        videos,
        cropId,
        farmerId,
        {
          customMetadata: {
            cropType: cropData.type,
            cropName: cropData.name,
            mediaType: 'video'
          }
        },
        (progress) => updateProgress(0.5, progress * 0.3)
      );

      if (videoUploadResult.success && videoUploadResult.downloadURLs) {
        videoURLs = videoUploadResult.downloadURLs;
        videoPaths = videoUploadResult.results?.map(r => r.filePath!).filter(Boolean) || [];
        console.log('✅ Videos uploaded to Firebase:', videoURLs.length);
      }
    }

    // Step 3: Upload documents to Firebase Storage (optional)
    let documentURLs: string[] = [];
    let documentPaths: string[] = [];

    if (documents && documents.length > 0) {
      console.log('🔥 Step 3: Uploading documents to Firebase Storage...');
      const docUploadResult = await uploadMultipleImagesToFirebase(
        documents,
        cropId,
        farmerId,
        {
          customMetadata: {
            cropType: cropData.type,
            cropName: cropData.name,
            mediaType: 'document'
          }
        },
        (progress) => updateProgress(0.8, progress * 0.1)
      );

      if (docUploadResult.success && docUploadResult.downloadURLs) {
        documentURLs = docUploadResult.downloadURLs;
        documentPaths = docUploadResult.results?.map(r => r.filePath!).filter(Boolean) || [];
        console.log('✅ Documents uploaded to Firebase:', documentURLs.length);
      }
    }

    // Step 4: Prepare MongoDB data with Firebase URLs
    const mongoData = {
      ...cropData,
      id: cropId,
      farmerId: farmerId,  // Explicitly set farmerId
      farmerName: cropData.farmerName,  // Ensure farmerName is passed
      farmerPhone: cropData.farmerPhone,  // Ensure farmerPhone is passed
      farmerEmail: cropData.farmerEmail,  // Ensure farmerEmail is passed
      imageURLs,
      videoURLs,
      documentURLs,
      firebaseMetadata: {
        imagePaths,
        videoPaths,
        documentPaths
      },
      images: imageURLs.map((url, index) => ({
        id: `img_${index}_${Date.now()}`,
        cropId,
        farmerId,
        fileName: `image_${index}`,
        fileSize: 0,
        fileType: 'image/jpeg',
        uploadDate: new Date().toISOString(),
        imageUrl: url,
        metadata: {
          width: null,
          height: null,
          aspectRatio: null,
          quality: cropData.quality,
          dominantColors: [],
          cropType: cropData.type,
          healthScore: null
        },
        analysis: {
          isAnalyzed: false,
          analysisDate: null,
          confidence: null,
          suggestions: []
        }
      })),
      analytics: {
        totalImages: imageURLs.length,
        totalVideos: videoURLs.length,
        totalDocuments: documentURLs.length,
        bestImageId: imageURLs.length > 0 ? `img_0_${Date.now()}` : null,
        averageImageQuality: cropData.quality,
        cropHealthScore: null,
        marketValue: cropData.price,
        demandScore: null
      },
      database: {
        isSynced: true,
        lastSyncDate: new Date().toISOString(),
        version: 1,
        checksum: null
      },
      uploadedAt: new Date().toISOString(),
      status: 'available'
    };

    // Step 5: Save to MongoDB
    console.log('🔥 Step 4: Saving crop data + URLs to MongoDB...');
    const mongoResult = await saveToMongoDB(mongoData as any);

    if (!mongoResult.success) {
      // Rollback: Delete uploaded files from Firebase if MongoDB save fails
      console.error('❌ MongoDB save failed, rolling back Firebase uploads...');
      await deleteCropImages(cropId, farmerId);
      throw new Error(mongoResult.error || 'Failed to save to MongoDB');
    }

    console.log('✅ Crop saved to MongoDB successfully');

    if (onProgress) onProgress(100);

    return {
      success: true,
      cropId,
      imageURLs,
      videoURLs,
      documentURLs,
      mongoData: mongoResult.data
    };
  } catch (error) {
    console.error('❌ Hybrid upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Update crop with new media files
 */
export const updateCropWithMedia = async (
  cropId: string,
  farmerId: string,
  cropData: Partial<HybridCropData>,
  newImages?: File[],
  newVideos?: File[],
  newDocuments?: File[],
  onProgress?: UploadProgressCallback
): Promise<UploadCropResult> => {
  try {
    console.log('🔥 Updating crop with new media files');

    const imageURLs: string[] = [];
    const videoURLs: string[] = [];
    const documentURLs: string[] = [];

    // Upload new images if provided
    if (newImages && newImages.length > 0) {
      const result = await uploadMultipleImagesToFirebase(
        newImages,
        cropId,
        farmerId,
        undefined,
        onProgress
      );
      if (result.success && result.downloadURLs) {
        imageURLs.push(...result.downloadURLs);
      }
    }

    // Upload new videos if provided
    if (newVideos && newVideos.length > 0) {
      const result = await uploadMultipleImagesToFirebase(
        newVideos,
        cropId,
        farmerId,
        { customMetadata: { mediaType: 'video' } },
        onProgress
      );
      if (result.success && result.downloadURLs) {
        videoURLs.push(...result.downloadURLs);
      }
    }

    // Upload new documents if provided
    if (newDocuments && newDocuments.length > 0) {
      const result = await uploadMultipleImagesToFirebase(
        newDocuments,
        cropId,
        farmerId,
        { customMetadata: { mediaType: 'document' } },
        onProgress
      );
      if (result.success && result.downloadURLs) {
        documentURLs.push(...result.downloadURLs);
      }
    }

    // Update MongoDB with new URLs
    const updateData = {
      ...cropData,
      ...(imageURLs.length > 0 && { imageURLs }),
      ...(videoURLs.length > 0 && { videoURLs }),
      ...(documentURLs.length > 0 && { documentURLs })
    };

    const response = await fetch(`${API_BASE_URL}/api/crops/${cropId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      throw new Error('Failed to update crop in MongoDB');
    }

    const result = await response.json();

    return {
      success: true,
      cropId,
      imageURLs,
      videoURLs,
      documentURLs,
      mongoData: result
    };
  } catch (error) {
    console.error('❌ Update crop with media failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Delete crop and all associated media files
 */
export const deleteCropWithMedia = async (
  cropId: string,
  farmerId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔥 Deleting crop and all media files');

    // Step 1: Delete from MongoDB first
    const response = await fetch(`${API_BASE_URL}/api/crops/${cropId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete crop from MongoDB');
    }

    // Step 2: Delete all files from Firebase Storage
    await deleteCropImages(cropId, farmerId);

    console.log('✅ Crop and media deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Delete crop with media failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Load crops from MongoDB (already has Firebase URLs)
 */
export const loadCropsWithMedia = async (
  farmerId: string
): Promise<{ success: boolean; data?: HybridCropData[]; error?: string }> => {
  try {
    console.log('🔥 Loading crops with media URLs from MongoDB');

    const response = await fetch(`${API_BASE_URL}/api/crops/farmer/${farmerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load crops from MongoDB');
    }

    const result = await response.json();
    console.log('✅ Crops with media loaded:', result.data?.length || 0);

    return {
      success: true,
      data: result.data || []
    };
  } catch (error) {
    console.error('❌ Load crops with media failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Export all functions
export default {
  uploadCropWithMedia,
  updateCropWithMedia,
  deleteCropWithMedia,
  loadCropsWithMedia
};
