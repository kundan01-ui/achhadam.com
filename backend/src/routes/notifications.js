const express = require('express');
const router = express.Router();
const FCMToken = require('../models/FCMToken');
const fcmService = require('../services/fcmService');
const auth = require('../middleware/auth');

/**
 * @route   POST /api/notifications/register-token
 * @desc    Register FCM token for a user
 * @access  Private
 */
router.post('/register-token', auth, async (req, res) => {
  try {
    const { token, deviceId, platform } = req.body;
    const userId = req.user.userId;
    const userType = req.user.userType || 'farmer';

    console.log('🔔 Registering FCM token:', {
      userId,
      userType,
      deviceId,
      platform,
      token: token.substring(0, 20) + '...'
    });

    // Validate input
    if (!token || !deviceId) {
      return res.status(400).json({
        success: false,
        message: 'Token and deviceId are required'
      });
    }

    // Check if token already exists for this device
    let fcmToken = await FCMToken.findByDevice(userId, deviceId);

    if (fcmToken) {
      // Update existing token
      fcmToken.token = token;
      fcmToken.platform = platform || 'web';
      fcmToken.isActive = true;
      fcmToken.lastUsed = new Date();
      await fcmToken.save();

      console.log('✅ FCM token updated for device:', deviceId);
    } else {
      // Create new token
      fcmToken = new FCMToken({
        userId,
        userType,
        token,
        deviceId,
        platform: platform || 'web',
        topics: [],
        isActive: true
      });
      await fcmToken.save();

      console.log('✅ FCM token registered for new device:', deviceId);
    }

    res.json({
      success: true,
      message: 'FCM token registered successfully',
      data: {
        tokenId: fcmToken._id,
        deviceId: fcmToken.deviceId,
        platform: fcmToken.platform
      }
    });
  } catch (error) {
    console.error('❌ Error registering FCM token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register FCM token',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/notifications/send
 * @desc    Send notification to a user
 * @access  Private
 */
router.post('/send', auth, async (req, res) => {
  try {
    const { recipientId, notification } = req.body;
    const senderId = req.user.userId;

    console.log('🔔 Sending notification:', {
      from: senderId,
      to: recipientId,
      notification
    });

    // Validate input
    if (!recipientId || !notification || !notification.title || !notification.body) {
      return res.status(400).json({
        success: false,
        message: 'recipientId and notification (title, body) are required'
      });
    }

    // Send notification to user (all their devices)
    const result = await fcmService.sendToUser(recipientId, notification, notification.data || {});

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: 'No active devices found for recipient'
      });
    }

    res.json({
      success: true,
      message: 'Notification sent successfully',
      data: result
    });
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/notifications/subscribe
 * @desc    Subscribe to a topic
 * @access  Private
 */
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { token, topic } = req.body;
    const userId = req.user.userId;

    console.log('🔔 Subscribing to topic:', { userId, topic });

    // Validate input
    if (!token || !topic) {
      return res.status(400).json({
        success: false,
        message: 'Token and topic are required'
      });
    }

    // Subscribe to topic via FCM
    const result = await fcmService.subscribeToTopic(token, topic);

    // Update token document to track topics
    const fcmToken = await FCMToken.findOne({ token, userId });
    if (fcmToken) {
      await fcmToken.addTopic(topic);
    }

    res.json({
      success: true,
      message: `Subscribed to topic: ${topic}`,
      data: result
    });
  } catch (error) {
    console.error('❌ Error subscribing to topic:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to topic',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/notifications/unsubscribe
 * @desc    Unsubscribe from a topic
 * @access  Private
 */
router.post('/unsubscribe', auth, async (req, res) => {
  try {
    const { token, topic } = req.body;
    const userId = req.user.userId;

    console.log('🔔 Unsubscribing from topic:', { userId, topic });

    // Validate input
    if (!token || !topic) {
      return res.status(400).json({
        success: false,
        message: 'Token and topic are required'
      });
    }

    // Unsubscribe from topic via FCM
    const result = await fcmService.unsubscribeFromTopic(token, topic);

    // Update token document to remove topic
    const fcmToken = await FCMToken.findOne({ token, userId });
    if (fcmToken) {
      await fcmToken.removeTopic(topic);
    }

    res.json({
      success: true,
      message: `Unsubscribed from topic: ${topic}`,
      data: result
    });
  } catch (error) {
    console.error('❌ Error unsubscribing from topic:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from topic',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/notifications/broadcast
 * @desc    Send notification to a topic (admin only)
 * @access  Private (Admin)
 */
router.post('/broadcast', auth, async (req, res) => {
  try {
    const { topic, notification } = req.body;

    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can send broadcast notifications'
      });
    }

    console.log('🔔 Broadcasting notification to topic:', topic);

    // Validate input
    if (!topic || !notification || !notification.title || !notification.body) {
      return res.status(400).json({
        success: false,
        message: 'Topic and notification (title, body) are required'
      });
    }

    // Send to topic
    const result = await fcmService.sendToTopic(topic, notification, notification.data || {});

    res.json({
      success: true,
      message: `Notification broadcast to topic: ${topic}`,
      data: result
    });
  } catch (error) {
    console.error('❌ Error broadcasting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to broadcast notification',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/notifications/tokens
 * @desc    Get all FCM tokens for current user
 * @access  Private
 */
router.get('/tokens', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const tokens = await FCMToken.find({ userId, isActive: true })
      .select('-token') // Don't send actual token to client
      .sort({ lastUsed: -1 });

    res.json({
      success: true,
      data: tokens,
      count: tokens.length
    });
  } catch (error) {
    console.error('❌ Error fetching tokens:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tokens',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/notifications/token/:deviceId
 * @desc    Deactivate FCM token for a device
 * @access  Private
 */
router.delete('/token/:deviceId', auth, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const userId = req.user.userId;

    console.log('🔔 Deactivating FCM token for device:', deviceId);

    const fcmToken = await FCMToken.findOne({ userId, deviceId });

    if (!fcmToken) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }

    await fcmToken.deactivate();

    res.json({
      success: true,
      message: 'FCM token deactivated successfully'
    });
  } catch (error) {
    console.error('❌ Error deactivating token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate token',
      error: error.message
    });
  }
});

module.exports = router;
