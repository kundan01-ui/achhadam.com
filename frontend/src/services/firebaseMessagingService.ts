// Firebase Cloud Messaging (FCM) Service - Push Notifications
// This service handles push notifications for crop updates, orders, etc.
import { getMessaging, getToken, onMessage, Messaging, MessagePayload } from 'firebase/messaging';
import app from '../config/firebase';

// Initialize FCM
let messaging: Messaging | null = null;

try {
  messaging = getMessaging(app);
  console.log('✅ Firebase Cloud Messaging initialized');
} catch (error) {
  console.error('❌ Error initializing Firebase Cloud Messaging:', error);
}

// Notification types
export enum NotificationType {
  NEW_ORDER = 'NEW_ORDER',
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  PRICE_UPDATE = 'PRICE_UPDATE',
  NEW_MESSAGE = 'NEW_MESSAGE',
  CROP_APPROVED = 'CROP_APPROVED',
  CROP_REJECTED = 'CROP_REJECTED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  WEATHER_ALERT = 'WEATHER_ALERT',
  GENERAL = 'GENERAL'
}

// Notification payload interface
export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  badge?: string;
  data?: {
    type: NotificationType;
    cropId?: string;
    orderId?: string;
    userId?: string;
    link?: string;
    [key: string]: any;
  };
}

// FCM token interface
export interface FCMToken {
  token: string;
  deviceId: string;
  platform: 'web' | 'android' | 'ios';
  createdAt: string;
}

/**
 * Request notification permission
 */
export const requestNotificationPermission = async (): Promise<{
  success: boolean;
  permission?: NotificationPermission;
  error?: string;
}> => {
  try {
    console.log('🔔 Requesting notification permission...');

    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    const permission = await Notification.requestPermission();
    console.log('🔔 Notification permission:', permission);

    return {
      success: permission === 'granted',
      permission
    };
  } catch (error) {
    console.error('❌ Error requesting notification permission:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get FCM token
 */
export const getFCMToken = async (vapidKey?: string): Promise<{
  success: boolean;
  token?: string;
  error?: string;
}> => {
  try {
    if (!messaging) {
      throw new Error('Firebase Cloud Messaging not initialized');
    }

    console.log('🔔 Getting FCM token...');

    // Request notification permission first
    const permissionResult = await requestNotificationPermission();
    if (!permissionResult.success) {
      throw new Error('Notification permission denied');
    }

    // Get FCM token
    const VAPID_KEY = vapidKey || import.meta.env.VITE_FIREBASE_VAPID_KEY;

    if (!VAPID_KEY) {
      console.warn('⚠️ VAPID key not found, using default token request');
    }

    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY
    });

    if (currentToken) {
      console.log('✅ FCM token obtained:', currentToken.substring(0, 20) + '...');

      // Save token to localStorage
      localStorage.setItem('fcm_token', currentToken);

      // Save token to backend
      await saveFCMTokenToBackend(currentToken);

      return {
        success: true,
        token: currentToken
      };
    } else {
      throw new Error('No registration token available');
    }
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Save FCM token to backend
 */
const saveFCMTokenToBackend = async (token: string): Promise<void> => {
  try {
    const farmerId = localStorage.getItem('farmer_user_id') || 'unknown';
    const deviceId = localStorage.getItem('device_id') || `device_${Date.now()}`;

    const response = await fetch('/api/notifications/register-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        token,
        farmerId,
        deviceId,
        platform: 'web',
        createdAt: new Date().toISOString()
      })
    });

    if (response.ok) {
      console.log('✅ FCM token saved to backend');
    } else {
      console.warn('⚠️ Failed to save FCM token to backend');
    }
  } catch (error) {
    console.error('❌ Error saving FCM token to backend:', error);
  }
};

/**
 * Listen for foreground messages
 */
export const onForegroundMessage = (
  callback: (payload: MessagePayload) => void
): (() => void) => {
  if (!messaging) {
    console.error('❌ Firebase Cloud Messaging not initialized');
    return () => {};
  }

  console.log('🔔 Listening for foreground messages...');

  const unsubscribe = onMessage(messaging, (payload) => {
    console.log('🔔 Foreground message received:', payload);

    // Show notification if permission is granted
    if (Notification.permission === 'granted' && payload.notification) {
      const { title, body, icon, image } = payload.notification;

      new Notification(title || 'New Notification', {
        body: body || '',
        icon: icon || '/logo.png',
        image: image,
        badge: '/logo.png',
        data: payload.data
      });
    }

    // Call the callback
    callback(payload);
  });

  return unsubscribe;
};

/**
 * Send notification (via backend)
 */
export const sendNotification = async (
  recipientId: string,
  notification: NotificationPayload
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔔 Sending notification to:', recipientId);

    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        recipientId,
        notification
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send notification');
    }

    console.log('✅ Notification sent successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Subscribe to topic (for broadcast notifications)
 */
export const subscribeToTopic = async (
  topic: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = localStorage.getItem('fcm_token');
    if (!token) {
      throw new Error('No FCM token found');
    }

    console.log('🔔 Subscribing to topic:', topic);

    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        token,
        topic
      })
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe to topic');
    }

    console.log('✅ Subscribed to topic successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error subscribing to topic:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Unsubscribe from topic
 */
export const unsubscribeFromTopic = async (
  topic: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = localStorage.getItem('fcm_token');
    if (!token) {
      throw new Error('No FCM token found');
    }

    console.log('🔔 Unsubscribing from topic:', topic);

    const response = await fetch('/api/notifications/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        token,
        topic
      })
    });

    if (!response.ok) {
      throw new Error('Failed to unsubscribe from topic');
    }

    console.log('✅ Unsubscribed from topic successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error unsubscribing from topic:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Initialize FCM for the app
 */
export const initializeFCM = async (): Promise<{
  success: boolean;
  token?: string;
  error?: string;
}> => {
  try {
    console.log('🔔 Initializing FCM...');

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported');
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('✅ Service Worker registered:', registration);

    // Get FCM token
    const tokenResult = await getFCMToken();

    if (tokenResult.success) {
      // Subscribe to default topics
      await subscribeToTopic('all_farmers');
      await subscribeToTopic('crop_updates');

      return tokenResult;
    } else {
      throw new Error(tokenResult.error || 'Failed to get FCM token');
    }
  } catch (error) {
    console.error('❌ Error initializing FCM:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Export all functions
export default {
  requestNotificationPermission,
  getFCMToken,
  onForegroundMessage,
  sendNotification,
  subscribeToTopic,
  unsubscribeFromTopic,
  initializeFCM
};
