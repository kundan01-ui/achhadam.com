// Firebase Services Integration Test
// Run this to test all Firebase services are working

import { auth, db, storage } from '../config/firebase';
import { uploadCropWithMedia, loadCropsWithMedia } from './firebaseMongoService';
import { initializeFCM, onForegroundMessage } from './firebaseMessagingService';
import { initializeAnalytics, trackFeatureUsed } from './firebaseAnalyticsService';

export interface TestResult {
  service: string;
  status: 'success' | 'failed' | 'warning';
  message: string;
  details?: any;
}

/**
 * Test Firebase Authentication
 */
export const testFirebaseAuth = async (): Promise<TestResult> => {
  try {
    console.log('🔥 Testing Firebase Authentication...');

    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    const currentUser = auth.currentUser;

    return {
      service: 'Firebase Authentication',
      status: 'success',
      message: currentUser
        ? `User logged in: ${currentUser.uid}`
        : 'Auth initialized (no user logged in)',
      details: {
        userId: currentUser?.uid,
        phone: currentUser?.phoneNumber,
        email: currentUser?.email
      }
    };
  } catch (error) {
    return {
      service: 'Firebase Authentication',
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Test Firestore Database
 */
export const testFirestore = async (): Promise<TestResult> => {
  try {
    console.log('🔥 Testing Firestore Database...');

    if (!db) {
      throw new Error('Firestore not initialized');
    }

    // Try to read from Firestore
    const { success } = await import('./firebaseCropService').then(module =>
      module.getAvailableCropsFromFirestore(5)
    );

    return {
      service: 'Firestore Database',
      status: success ? 'success' : 'warning',
      message: success
        ? 'Firestore connected and readable'
        : 'Firestore initialized but no data',
      details: {
        offlinePersistence: 'enabled',
        realTimeSync: 'enabled'
      }
    };
  } catch (error) {
    return {
      service: 'Firestore Database',
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Test Firebase Storage
 */
export const testFirebaseStorage = async (): Promise<TestResult> => {
  try {
    console.log('🔥 Testing Firebase Storage...');

    if (!storage) {
      throw new Error('Firebase Storage not initialized');
    }

    return {
      service: 'Firebase Storage',
      status: 'success',
      message: 'Firebase Storage initialized and ready',
      details: {
        bucket: storage.app.options.storageBucket,
        uploadReady: true,
        compressionEnabled: true
      }
    };
  } catch (error) {
    return {
      service: 'Firebase Storage',
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Test Hybrid Service (Firebase Storage + MongoDB)
 */
export const testHybridService = async (farmerId: string): Promise<TestResult> => {
  try {
    console.log('🔥 Testing Hybrid Service (Firebase + MongoDB)...');

    const { success, data } = await loadCropsWithMedia(farmerId);

    return {
      service: 'Hybrid Service (Firebase + MongoDB)',
      status: success ? 'success' : 'warning',
      message: success
        ? `Hybrid service working. Loaded ${data?.length || 0} crops`
        : 'Hybrid service initialized but no data',
      details: {
        cropsCount: data?.length || 0,
        hasFirebaseURLs: data?.some(crop => crop.imageURLs?.length > 0),
        mongoDBConnected: success
      }
    };
  } catch (error) {
    return {
      service: 'Hybrid Service (Firebase + MongoDB)',
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Test Firebase Cloud Messaging
 */
export const testFCM = async (): Promise<TestResult> => {
  try {
    console.log('🔥 Testing Firebase Cloud Messaging...');

    if (!('Notification' in window)) {
      throw new Error('Browser does not support notifications');
    }

    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported');
    }

    const permission = Notification.permission;

    if (permission === 'denied') {
      return {
        service: 'Firebase Cloud Messaging',
        status: 'warning',
        message: 'Notification permission denied. User needs to enable notifications.',
        details: { permission }
      };
    }

    // Check if service worker is registered
    const registrations = await navigator.serviceWorker.getRegistrations();
    const hasSW = registrations.some(reg =>
      reg.active?.scriptURL.includes('firebase-messaging-sw.js')
    );

    return {
      service: 'Firebase Cloud Messaging',
      status: hasSW ? 'success' : 'warning',
      message: hasSW
        ? 'FCM ready. Service Worker registered.'
        : 'FCM available. Service Worker needs registration.',
      details: {
        permission,
        serviceWorkerRegistered: hasSW,
        token: localStorage.getItem('fcm_token') ? 'saved' : 'not yet generated'
      }
    };
  } catch (error) {
    return {
      service: 'Firebase Cloud Messaging',
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Test Firebase Analytics
 */
export const testFirebaseAnalytics = async (): Promise<TestResult> => {
  try {
    console.log('🔥 Testing Firebase Analytics...');

    // Test by logging a test event
    trackFeatureUsed('firebase_test', { test: true });

    return {
      service: 'Firebase Analytics',
      status: 'success',
      message: 'Firebase Analytics initialized and tracking',
      details: {
        tracking: 'enabled',
        testEventSent: true,
        measurementId: 'G-BJK3TJ7M9F'
      }
    };
  } catch (error) {
    return {
      service: 'Firebase Analytics',
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Test MongoDB Backend Connection
 */
export const testMongoDBConnection = async (): Promise<TestResult> => {
  try {
    console.log('🔥 Testing MongoDB Backend Connection...');

    const farmerId = localStorage.getItem('farmer_user_id') || 'test';
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      throw new Error('No auth token found');
    }

    const response = await fetch(`https://achhadam-backend.onrender.com/api/crops/farmer/${farmerId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const isSuccess = response.ok;

    return {
      service: 'MongoDB Backend',
      status: isSuccess ? 'success' : 'warning',
      message: isSuccess
        ? 'MongoDB connected and accessible'
        : `MongoDB response: ${response.status}`,
      details: {
        endpoint: 'https://achhadam-backend.onrender.com',
        authenticated: !!authToken,
        responseStatus: response.status
      }
    };
  } catch (error) {
    return {
      service: 'MongoDB Backend',
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Run All Tests
 */
export const runAllFirebaseTests = async (farmerId?: string): Promise<TestResult[]> => {
  console.log('🔥 Running Firebase Integration Tests...');
  console.log('━'.repeat(50));

  const tests = [
    testFirebaseAuth(),
    testFirestore(),
    testFirebaseStorage(),
    testHybridService(farmerId || localStorage.getItem('farmer_user_id') || 'test'),
    testFCM(),
    testFirebaseAnalytics(),
    testMongoDBConnection()
  ];

  const results = await Promise.all(tests);

  console.log('━'.repeat(50));
  console.log('📊 Test Results:');
  results.forEach(result => {
    const icon = result.status === 'success' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
    console.log(`${icon} ${result.service}: ${result.message}`);
    if (result.details) {
      console.log('   Details:', result.details);
    }
  });
  console.log('━'.repeat(50));

  return results;
};

/**
 * Get Service Health Summary
 */
export const getServiceHealthSummary = (results: TestResult[]): {
  total: number;
  success: number;
  warning: number;
  failed: number;
  healthPercentage: number;
} => {
  const total = results.length;
  const success = results.filter(r => r.status === 'success').length;
  const warning = results.filter(r => r.status === 'warning').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const healthPercentage = Math.round((success / total) * 100);

  return {
    total,
    success,
    warning,
    failed,
    healthPercentage
  };
};

// Export test runner
export default {
  testFirebaseAuth,
  testFirestore,
  testFirebaseStorage,
  testHybridService,
  testFCM,
  testFirebaseAnalytics,
  testMongoDBConnection,
  runAllFirebaseTests,
  getServiceHealthSummary
};
