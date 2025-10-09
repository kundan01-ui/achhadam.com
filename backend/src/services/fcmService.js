/**
 * Firebase Cloud Messaging (FCM) Service
 * Handles sending push notifications using Firebase Admin SDK
 */

const FCMToken = require('../models/FCMToken');

// NOTE: Firebase Admin SDK requires service account credentials
// For now, we'll create a mock service that logs notifications
// To fully enable FCM, you need to:
// 1. Download service account JSON from Firebase Console
// 2. Install firebase-admin: npm install firebase-admin
// 3. Initialize with credentials

let admin = null;

// Try to initialize Firebase Admin SDK if available
try {
  // Uncomment when firebase-admin is installed and service account is configured
  // const admin = require('firebase-admin');
  // const serviceAccount = require('../../firebase-service-account.json');
  //
  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount)
  // });
  //
  // console.log('✅ Firebase Admin SDK initialized');
} catch (error) {
  console.warn('⚠️ Firebase Admin SDK not configured. Notifications will be logged only.');
  console.warn('⚠️ To enable FCM: npm install firebase-admin and add service account JSON');
}

/**
 * Send notification to a single device
 */
const sendToDevice = async (token, notification, data = {}) => {
  try {
    console.log('🔔 Sending notification to device:', {
      token: token.substring(0, 20) + '...',
      notification,
      data
    });

    if (!admin) {
      console.log('📝 [MOCK] Notification would be sent:', { notification, data });
      return {
        success: true,
        messageId: `mock_${Date.now()}`,
        mock: true
      };
    }

    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.image
      },
      data: {
        ...data,
        clickAction: data.link || '/dashboard',
        timestamp: new Date().toISOString()
      },
      token: token,
      webpush: {
        notification: {
          icon: notification.icon || '/logo.png',
          badge: '/logo.png',
          vibrate: [200, 100, 200],
          requireInteraction: true
        },
        fcmOptions: {
          link: data.link || '/dashboard'
        }
      }
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Notification sent successfully:', response);

    return {
      success: true,
      messageId: response
    };
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    throw error;
  }
};

/**
 * Send notification to multiple devices
 */
const sendToMultipleDevices = async (tokens, notification, data = {}) => {
  try {
    console.log(`🔔 Sending notification to ${tokens.length} devices`);

    if (!admin) {
      console.log('📝 [MOCK] Notification would be sent to multiple devices:', {
        tokenCount: tokens.length,
        notification,
        data
      });
      return {
        success: true,
        successCount: tokens.length,
        failureCount: 0,
        mock: true
      };
    }

    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.image
      },
      data: {
        ...data,
        clickAction: data.link || '/dashboard',
        timestamp: new Date().toISOString()
      },
      tokens: tokens,
      webpush: {
        notification: {
          icon: notification.icon || '/logo.png',
          badge: '/logo.png',
          vibrate: [200, 100, 200]
        }
      }
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log('✅ Multicast notification sent:', {
      successCount: response.successCount,
      failureCount: response.failureCount
    });

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses
    };
  } catch (error) {
    console.error('❌ Error sending multicast notification:', error);
    throw error;
  }
};

/**
 * Send notification to topic
 */
const sendToTopic = async (topic, notification, data = {}) => {
  try {
    console.log('🔔 Sending notification to topic:', topic);

    if (!admin) {
      console.log('📝 [MOCK] Notification would be sent to topic:', {
        topic,
        notification,
        data
      });
      return {
        success: true,
        messageId: `mock_topic_${Date.now()}`,
        mock: true
      };
    }

    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.image
      },
      data: {
        ...data,
        clickAction: data.link || '/dashboard',
        timestamp: new Date().toISOString()
      },
      topic: topic,
      webpush: {
        notification: {
          icon: notification.icon || '/logo.png',
          badge: '/logo.png'
        }
      }
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Topic notification sent:', response);

    return {
      success: true,
      messageId: response
    };
  } catch (error) {
    console.error('❌ Error sending topic notification:', error);
    throw error;
  }
};

/**
 * Subscribe token to topic
 */
const subscribeToTopic = async (token, topic) => {
  try {
    console.log('🔔 Subscribing to topic:', { token: token.substring(0, 20) + '...', topic });

    if (!admin) {
      console.log('📝 [MOCK] Token would be subscribed to topic:', topic);
      return { success: true, mock: true };
    }

    const response = await admin.messaging().subscribeToTopic([token], topic);
    console.log('✅ Subscribed to topic:', response);

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount
    };
  } catch (error) {
    console.error('❌ Error subscribing to topic:', error);
    throw error;
  }
};

/**
 * Unsubscribe token from topic
 */
const unsubscribeFromTopic = async (token, topic) => {
  try {
    console.log('🔔 Unsubscribing from topic:', { token: token.substring(0, 20) + '...', topic });

    if (!admin) {
      console.log('📝 [MOCK] Token would be unsubscribed from topic:', topic);
      return { success: true, mock: true };
    }

    const response = await admin.messaging().unsubscribeFromTopic([token], topic);
    console.log('✅ Unsubscribed from topic:', response);

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount
    };
  } catch (error) {
    console.error('❌ Error unsubscribing from topic:', error);
    throw error;
  }
};

/**
 * Send notification to user (all their devices)
 */
const sendToUser = async (userId, notification, data = {}) => {
  try {
    console.log('🔔 Sending notification to user:', userId);

    // Get all active tokens for user
    const tokenDocs = await FCMToken.findActiveByUser(userId);

    if (tokenDocs.length === 0) {
      console.warn('⚠️ No active tokens found for user:', userId);
      return {
        success: false,
        error: 'No active tokens found'
      };
    }

    const tokens = tokenDocs.map(doc => doc.token);

    // Update last used timestamp for all tokens
    await Promise.all(tokenDocs.map(doc => doc.updateLastUsed()));

    // Send to all devices
    const result = await sendToMultipleDevices(tokens, notification, data);

    console.log('✅ Notification sent to user:', userId, result);

    return result;
  } catch (error) {
    console.error('❌ Error sending notification to user:', error);
    throw error;
  }
};

module.exports = {
  sendToDevice,
  sendToMultipleDevices,
  sendToTopic,
  subscribeToTopic,
  unsubscribeFromTopic,
  sendToUser
};
