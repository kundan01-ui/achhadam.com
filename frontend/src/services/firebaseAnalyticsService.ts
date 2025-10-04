// Firebase Analytics Service - User Behavior & Event Tracking
// This service tracks user interactions, crop views, orders, etc.
import { getAnalytics, logEvent, setUserId, setUserProperties, Analytics } from 'firebase/analytics';
import app from '../config/firebase';

// Initialize Analytics
let analytics: Analytics | null = null;

try {
  analytics = getAnalytics(app);
  console.log('✅ Firebase Analytics initialized');
} catch (error) {
  console.error('❌ Error initializing Firebase Analytics:', error);
}

// Event types
export enum AnalyticsEvent {
  // User events
  USER_LOGIN = 'user_login',
  USER_SIGNUP = 'user_signup',
  USER_LOGOUT = 'user_logout',

  // Crop events
  CROP_UPLOADED = 'crop_uploaded',
  CROP_VIEWED = 'crop_viewed',
  CROP_EDITED = 'crop_edited',
  CROP_DELETED = 'crop_deleted',
  CROP_SHARED = 'crop_shared',

  // Order events
  ORDER_CREATED = 'order_created',
  ORDER_CONFIRMED = 'order_confirmed',
  ORDER_DELIVERED = 'order_delivered',
  ORDER_CANCELLED = 'order_cancelled',

  // Search events
  SEARCH_PERFORMED = 'search_performed',
  FILTER_APPLIED = 'filter_applied',

  // Image events
  IMAGE_UPLOADED = 'image_uploaded',
  IMAGE_DELETED = 'image_deleted',

  // Navigation events
  PAGE_VIEW = 'page_view',
  SCREEN_VIEW = 'screen_view',

  // Payment events
  PAYMENT_INITIATED = 'payment_initiated',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',

  // Custom events
  FEATURE_USED = 'feature_used',
  ERROR_OCCURRED = 'error_occurred'
}

// User properties interface
export interface UserProperties {
  userType?: 'farmer' | 'buyer' | 'admin';
  location?: string;
  verified?: 'true' | 'false';
  cropsCount?: string;
  totalOrders?: string;
  memberSince?: string;
  [key: string]: string | undefined;
}

/**
 * Set user ID for analytics
 */
export const setAnalyticsUserId = (userId: string): void => {
  if (!analytics) {
    console.warn('⚠️ Analytics not initialized');
    return;
  }

  try {
    setUserId(analytics, userId);
    console.log('📊 Analytics user ID set:', userId);
  } catch (error) {
    console.error('❌ Error setting analytics user ID:', error);
  }
};

/**
 * Set user properties for analytics
 */
export const setAnalyticsUserProperties = (properties: UserProperties): void => {
  if (!analytics) {
    console.warn('⚠️ Analytics not initialized');
    return;
  }

  try {
    setUserProperties(analytics, properties);
    console.log('📊 Analytics user properties set:', properties);
  } catch (error) {
    console.error('❌ Error setting analytics user properties:', error);
  }
};

/**
 * Log custom event
 */
export const logAnalyticsEvent = (
  eventName: AnalyticsEvent | string,
  eventParams?: { [key: string]: any }
): void => {
  if (!analytics) {
    console.warn('⚠️ Analytics not initialized');
    return;
  }

  try {
    logEvent(analytics, eventName, eventParams);
    console.log('📊 Analytics event logged:', eventName, eventParams);
  } catch (error) {
    console.error('❌ Error logging analytics event:', error);
  }
};

/**
 * Track user login
 */
export const trackUserLogin = (userId: string, method: 'phone' | 'google' | 'email'): void => {
  setAnalyticsUserId(userId);
  logAnalyticsEvent(AnalyticsEvent.USER_LOGIN, {
    method,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track user signup
 */
export const trackUserSignup = (userId: string, method: 'phone' | 'google' | 'email'): void => {
  setAnalyticsUserId(userId);
  logAnalyticsEvent(AnalyticsEvent.USER_SIGNUP, {
    method,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track crop upload
 */
export const trackCropUpload = (cropData: {
  cropId: string;
  cropType: string;
  cropName: string;
  price: number;
  quantity: number;
  imagesCount: number;
}): void => {
  logAnalyticsEvent(AnalyticsEvent.CROP_UPLOADED, {
    crop_id: cropData.cropId,
    crop_type: cropData.cropType,
    crop_name: cropData.cropName,
    price: cropData.price,
    quantity: cropData.quantity,
    images_count: cropData.imagesCount,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track crop view
 */
export const trackCropView = (cropId: string, cropType: string, farmerId: string): void => {
  logAnalyticsEvent(AnalyticsEvent.CROP_VIEWED, {
    crop_id: cropId,
    crop_type: cropType,
    farmer_id: farmerId,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track order creation
 */
export const trackOrderCreated = (orderData: {
  orderId: string;
  cropId: string;
  quantity: number;
  totalPrice: number;
  buyerId: string;
  farmerId: string;
}): void => {
  logAnalyticsEvent(AnalyticsEvent.ORDER_CREATED, {
    order_id: orderData.orderId,
    crop_id: orderData.cropId,
    quantity: orderData.quantity,
    total_price: orderData.totalPrice,
    buyer_id: orderData.buyerId,
    farmer_id: orderData.farmerId,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track search
 */
export const trackSearch = (query: string, filters?: any, resultsCount?: number): void => {
  logAnalyticsEvent(AnalyticsEvent.SEARCH_PERFORMED, {
    search_query: query,
    filters: JSON.stringify(filters || {}),
    results_count: resultsCount,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track page view
 */
export const trackPageView = (pagePath: string, pageTitle?: string): void => {
  logAnalyticsEvent(AnalyticsEvent.PAGE_VIEW, {
    page_path: pagePath,
    page_title: pageTitle || document.title,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track image upload
 */
export const trackImageUpload = (imageData: {
  cropId: string;
  imageSize: number;
  imageType: string;
  uploadMethod: 'firebase' | 'cloudinary' | 'local';
}): void => {
  logAnalyticsEvent(AnalyticsEvent.IMAGE_UPLOADED, {
    crop_id: imageData.cropId,
    image_size: imageData.imageSize,
    image_type: imageData.imageType,
    upload_method: imageData.uploadMethod,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track payment events
 */
export const trackPaymentInitiated = (paymentData: {
  orderId: string;
  amount: number;
  paymentMethod: string;
}): void => {
  logAnalyticsEvent(AnalyticsEvent.PAYMENT_INITIATED, {
    order_id: paymentData.orderId,
    amount: paymentData.amount,
    payment_method: paymentData.paymentMethod,
    timestamp: new Date().toISOString()
  });
};

export const trackPaymentSuccess = (paymentData: {
  orderId: string;
  transactionId: string;
  amount: number;
}): void => {
  logAnalyticsEvent(AnalyticsEvent.PAYMENT_SUCCESS, {
    order_id: paymentData.orderId,
    transaction_id: paymentData.transactionId,
    amount: paymentData.amount,
    timestamp: new Date().toISOString()
  });
};

export const trackPaymentFailed = (paymentData: {
  orderId: string;
  amount: number;
  errorReason: string;
}): void => {
  logAnalyticsEvent(AnalyticsEvent.PAYMENT_FAILED, {
    order_id: paymentData.orderId,
    amount: paymentData.amount,
    error_reason: paymentData.errorReason,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track errors
 */
export const trackError = (errorData: {
  errorType: string;
  errorMessage: string;
  errorStack?: string;
  pagePath: string;
}): void => {
  logAnalyticsEvent(AnalyticsEvent.ERROR_OCCURRED, {
    error_type: errorData.errorType,
    error_message: errorData.errorMessage,
    error_stack: errorData.errorStack?.substring(0, 500), // Limit stack trace
    page_path: errorData.pagePath,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track feature usage
 */
export const trackFeatureUsed = (featureName: string, featureData?: any): void => {
  logAnalyticsEvent(AnalyticsEvent.FEATURE_USED, {
    feature_name: featureName,
    feature_data: JSON.stringify(featureData || {}),
    timestamp: new Date().toISOString()
  });
};

/**
 * Initialize analytics for user
 */
export const initializeAnalytics = (userId: string, userProperties?: UserProperties): void => {
  if (!analytics) {
    console.warn('⚠️ Analytics not initialized');
    return;
  }

  setAnalyticsUserId(userId);

  if (userProperties) {
    setAnalyticsUserProperties(userProperties);
  }

  console.log('📊 Analytics initialized for user:', userId);
};

/**
 * Track session start
 */
export const trackSessionStart = (): void => {
  logAnalyticsEvent('session_start', {
    timestamp: new Date().toISOString()
  });
};

/**
 * Track session end
 */
export const trackSessionEnd = (sessionDuration: number): void => {
  logAnalyticsEvent('session_end', {
    duration_seconds: sessionDuration,
    timestamp: new Date().toISOString()
  });
};

// Export all functions
export default {
  setAnalyticsUserId,
  setAnalyticsUserProperties,
  logAnalyticsEvent,
  trackUserLogin,
  trackUserSignup,
  trackCropUpload,
  trackCropView,
  trackOrderCreated,
  trackSearch,
  trackPageView,
  trackImageUpload,
  trackPaymentInitiated,
  trackPaymentSuccess,
  trackPaymentFailed,
  trackError,
  trackFeatureUsed,
  initializeAnalytics,
  trackSessionStart,
  trackSessionEnd
};
