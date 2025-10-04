// Firebase Firestore Crop Service - Real-time Crop Data Sync
// This service handles all Firestore operations for crops with real-time sync
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  writeBatch,
  setDoc,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Crop Data Interface
export interface FirestoreCropData {
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
  uploadedAt: string;
  farmerName: string;
  farmerId: string;
  farmerPhone?: string;
  images: string[]; // Firebase Storage URLs
  analytics?: {
    totalImages: number;
    bestImageId: string | null;
    averageImageQuality: string | null;
    cropHealthScore: number | null;
    marketValue: number | null;
    demandScore: number | null;
  };
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

// Collection reference
const CROPS_COLLECTION = 'crops';

// Real-time listener type
export type CropListener = (crops: FirestoreCropData[]) => void;
export type UnsubscribeFunction = () => void;

/**
 * Add a new crop to Firestore
 */
export const addCropToFirestore = async (cropData: Omit<FirestoreCropData, 'id'>): Promise<{ success: boolean; data?: FirestoreCropData; error?: string }> => {
  try {
    console.log('🔥 Adding crop to Firestore:', cropData);

    // Add server timestamp
    const dataWithTimestamp = {
      ...cropData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      uploadedAt: new Date().toISOString()
    };

    // Add document to Firestore
    const docRef = await addDoc(collection(db, CROPS_COLLECTION), dataWithTimestamp);

    console.log('✅ Crop added to Firestore with ID:', docRef.id);

    // Return with the generated ID
    const newCrop: FirestoreCropData = {
      ...cropData,
      id: docRef.id,
      uploadedAt: dataWithTimestamp.uploadedAt
    };

    return { success: true, data: newCrop };
  } catch (error) {
    console.error('❌ Error adding crop to Firestore:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Update an existing crop in Firestore
 */
export const updateCropInFirestore = async (cropId: string, cropData: Partial<FirestoreCropData>): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔥 Updating crop in Firestore:', cropId, cropData);

    const cropRef = doc(db, CROPS_COLLECTION, cropId);

    // Add update timestamp
    const dataWithTimestamp = {
      ...cropData,
      updatedAt: serverTimestamp()
    };

    await updateDoc(cropRef, dataWithTimestamp);

    console.log('✅ Crop updated in Firestore successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating crop in Firestore:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Delete a crop from Firestore
 */
export const deleteCropFromFirestore = async (cropId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔥 Deleting crop from Firestore:', cropId);

    const cropRef = doc(db, CROPS_COLLECTION, cropId);
    await deleteDoc(cropRef);

    console.log('✅ Crop deleted from Firestore successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting crop from Firestore:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get a single crop from Firestore
 */
export const getCropFromFirestore = async (cropId: string): Promise<{ success: boolean; data?: FirestoreCropData; error?: string }> => {
  try {
    console.log('🔥 Getting crop from Firestore:', cropId);

    const cropRef = doc(db, CROPS_COLLECTION, cropId);
    const cropSnap = await getDoc(cropRef);

    if (cropSnap.exists()) {
      const data = cropSnap.data() as FirestoreCropData;
      const crop: FirestoreCropData = {
        ...data,
        id: cropSnap.id
      };

      console.log('✅ Crop retrieved from Firestore:', crop);
      return { success: true, data: crop };
    } else {
      console.log('❌ Crop not found in Firestore');
      return { success: false, error: 'Crop not found' };
    }
  } catch (error) {
    console.error('❌ Error getting crop from Firestore:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get all crops for a specific farmer (one-time fetch)
 */
export const getFarmerCropsFromFirestore = async (farmerId: string): Promise<{ success: boolean; data?: FirestoreCropData[]; error?: string }> => {
  try {
    console.log('🔥 Getting farmer crops from Firestore:', farmerId);

    const cropsRef = collection(db, CROPS_COLLECTION);
    const q = query(
      cropsRef,
      where('farmerId', '==', farmerId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const crops: FirestoreCropData[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreCropData;
      crops.push({
        ...data,
        id: doc.id
      });
    });

    console.log('✅ Farmer crops retrieved from Firestore:', crops.length);
    return { success: true, data: crops };
  } catch (error) {
    console.error('❌ Error getting farmer crops from Firestore:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get all available crops (one-time fetch)
 */
export const getAvailableCropsFromFirestore = async (limitCount: number = 50): Promise<{ success: boolean; data?: FirestoreCropData[]; error?: string }> => {
  try {
    console.log('🔥 Getting available crops from Firestore');

    const cropsRef = collection(db, CROPS_COLLECTION);
    const q = query(
      cropsRef,
      where('status', '==', 'available'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const crops: FirestoreCropData[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreCropData;
      crops.push({
        ...data,
        id: doc.id
      });
    });

    console.log('✅ Available crops retrieved from Firestore:', crops.length);
    return { success: true, data: crops };
  } catch (error) {
    console.error('❌ Error getting available crops from Firestore:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Search crops by type
 */
export const searchCropsByType = async (cropType: string): Promise<{ success: boolean; data?: FirestoreCropData[]; error?: string }> => {
  try {
    console.log('🔥 Searching crops by type in Firestore:', cropType);

    const cropsRef = collection(db, CROPS_COLLECTION);
    const q = query(
      cropsRef,
      where('type', '==', cropType),
      where('status', '==', 'available'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const crops: FirestoreCropData[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreCropData;
      crops.push({
        ...data,
        id: doc.id
      });
    });

    console.log('✅ Crops by type retrieved from Firestore:', crops.length);
    return { success: true, data: crops };
  } catch (error) {
    console.error('❌ Error searching crops by type in Firestore:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Real-time listener for farmer's crops
 * Returns an unsubscribe function to stop listening
 */
export const subscribeFarmerCrops = (farmerId: string, callback: CropListener): UnsubscribeFunction => {
  console.log('🔥 Setting up real-time listener for farmer crops:', farmerId);

  const cropsRef = collection(db, CROPS_COLLECTION);
  const q = query(
    cropsRef,
    where('farmerId', '==', farmerId),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot: QuerySnapshot) => {
      const crops: FirestoreCropData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreCropData;
        crops.push({
          ...data,
          id: doc.id
        });
      });

      console.log('🔥 Real-time update: Farmer crops changed:', crops.length);
      callback(crops);
    },
    (error) => {
      console.error('❌ Error in real-time listener:', error);
    }
  );

  return unsubscribe;
};

/**
 * Real-time listener for all available crops
 * Returns an unsubscribe function to stop listening
 */
export const subscribeAvailableCrops = (callback: CropListener, limitCount: number = 50): UnsubscribeFunction => {
  console.log('🔥 Setting up real-time listener for available crops');

  const cropsRef = collection(db, CROPS_COLLECTION);
  const q = query(
    cropsRef,
    where('status', '==', 'available'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot: QuerySnapshot) => {
      const crops: FirestoreCropData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreCropData;
        crops.push({
          ...data,
          id: doc.id
        });
      });

      console.log('🔥 Real-time update: Available crops changed:', crops.length);
      callback(crops);
    },
    (error) => {
      console.error('❌ Error in real-time listener:', error);
    }
  );

  return unsubscribe;
};

/**
 * Real-time listener for crops by type
 * Returns an unsubscribe function to stop listening
 */
export const subscribeCropsByType = (cropType: string, callback: CropListener): UnsubscribeFunction => {
  console.log('🔥 Setting up real-time listener for crops by type:', cropType);

  const cropsRef = collection(db, CROPS_COLLECTION);
  const q = query(
    cropsRef,
    where('type', '==', cropType),
    where('status', '==', 'available'),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot: QuerySnapshot) => {
      const crops: FirestoreCropData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreCropData;
        crops.push({
          ...data,
          id: doc.id
        });
      });

      console.log('🔥 Real-time update: Crops by type changed:', crops.length);
      callback(crops);
    },
    (error) => {
      console.error('❌ Error in real-time listener:', error);
    }
  );

  return unsubscribe;
};

/**
 * Batch update multiple crops
 */
export const batchUpdateCrops = async (updates: { id: string; data: Partial<FirestoreCropData> }[]): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔥 Batch updating crops in Firestore:', updates.length);

    const batch = writeBatch(db);

    updates.forEach(({ id, data }) => {
      const cropRef = doc(db, CROPS_COLLECTION, id);
      batch.update(cropRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    });

    await batch.commit();

    console.log('✅ Batch update completed successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error in batch update:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Batch delete multiple crops
 */
export const batchDeleteCrops = async (cropIds: string[]): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔥 Batch deleting crops from Firestore:', cropIds.length);

    const batch = writeBatch(db);

    cropIds.forEach((id) => {
      const cropRef = doc(db, CROPS_COLLECTION, id);
      batch.delete(cropRef);
    });

    await batch.commit();

    console.log('✅ Batch delete completed successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error in batch delete:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Update crop status (available, sold, pending, reserved)
 */
export const updateCropStatus = async (cropId: string, status: 'available' | 'sold' | 'pending' | 'reserved'): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔥 Updating crop status in Firestore:', cropId, status);

    const cropRef = doc(db, CROPS_COLLECTION, cropId);
    await updateDoc(cropRef, {
      status,
      updatedAt: serverTimestamp()
    });

    console.log('✅ Crop status updated successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating crop status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Export all functions
export default {
  addCropToFirestore,
  updateCropInFirestore,
  deleteCropFromFirestore,
  getCropFromFirestore,
  getFarmerCropsFromFirestore,
  getAvailableCropsFromFirestore,
  searchCropsByType,
  subscribeFarmerCrops,
  subscribeAvailableCrops,
  subscribeCropsByType,
  batchUpdateCrops,
  batchDeleteCrops,
  updateCropStatus
};
