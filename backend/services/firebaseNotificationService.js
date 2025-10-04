/**
 * Firebase Notification Service - All-in-One
 * Uses Firebase for Email, SMS, and Push Notifications
 */

const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Initialize Firebase Admin
let firebaseInitialized = false;

const initializeFirebase = () => {
  if (!firebaseInitialized && admin.apps.length === 0) {
    try {
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID || "digital-farming-platform",
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs"
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });

      firebaseInitialized = true;
      console.log('✅ Firebase Admin initialized successfully');
    } catch (error) {
      console.warn('⚠️ Firebase Admin initialization failed:', error.message);
    }
  }
};

initializeFirebase();

// ============================================
// 1. PUSH NOTIFICATIONS (Firebase Cloud Messaging)
// ============================================

/**
 * Send Push Notification to single device
 */
const sendPushNotification = async (fcmToken, title, body, data = {}) => {
  try {
    if (!firebaseInitialized) {
      console.warn('⚠️ Firebase not initialized');
      return { success: false, error: 'Firebase not initialized' };
    }

    const message = {
      notification: { title, body },
      data: { ...data, timestamp: new Date().toISOString() },
      token: fcmToken,
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          color: '#10b981',
          icon: 'ic_notification'
        }
      },
      webpush: {
        notification: {
          icon: '/achhadam-logo.jpg',
          badge: '/achhadam-badge.png'
        }
      }
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Push notification sent:', response);

    return { success: true, messageId: response };
  } catch (error) {
    console.error('❌ Push notification failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send notification to multiple devices
 */
const sendMulticastNotification = async (fcmTokens, title, body, data = {}) => {
  try {
    if (!firebaseInitialized) {
      return { success: false, error: 'Firebase not initialized' };
    }

    const message = {
      notification: { title, body },
      data: { ...data, timestamp: new Date().toISOString() },
      tokens: fcmTokens
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`✅ Sent ${response.successCount}/${fcmTokens.length} notifications`);

    return { success: true, successCount: response.successCount };
  } catch (error) {
    console.error('❌ Multicast notification failed:', error.message);
    return { success: false, error: error.message };
  }
};

// ============================================
// 2. SMS (Firebase Phone Auth - for OTP only)
// ============================================
// Note: Firebase Phone Auth automatically sends SMS OTP
// For custom SMS, we'll use Firebase Functions or fallback to console log

/**
 * Send SMS (Logged for now - implement Firebase Functions for production)
 */
const sendSMS = async (phoneNumber, message) => {
  try {
    console.log('📱 SMS Notification:');
    console.log(`   To: ${phoneNumber}`);
    console.log(`   Message: ${message}`);
    console.log('⚠️ Note: Implement Firebase Functions for production SMS');

    // In production, you would use:
    // - Firebase Cloud Functions with Twilio/MSG91
    // - Or Firebase Extensions for SMS

    return { success: true, note: 'SMS logged - implement Firebase Functions for production' };
  } catch (error) {
    console.error('❌ SMS failed:', error.message);
    return { success: false, error: error.message };
  }
};

// ============================================
// 3. EMAIL (Firebase Auth Emails + Custom SMTP)
// ============================================

/**
 * Send Email using Firebase Auth built-in emails
 */
const sendFirebaseAuthEmail = async (userEmail, emailType, params = {}) => {
  try {
    if (!firebaseInitialized) {
      return { success: false, error: 'Firebase not initialized' };
    }

    // Firebase Auth handles verification and password reset emails automatically
    console.log(`📧 Firebase Auth Email: ${emailType} to ${userEmail}`);

    return { success: true, note: 'Firebase Auth handles this automatically' };
  } catch (error) {
    console.error('❌ Firebase Auth email failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send custom email (for order confirmations, etc.)
 */
const sendEmail = async (to, subject, html) => {
  try {
    console.log('📧 Custom Email:');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log('⚠️ Note: Configure SMTP or use Firebase Functions for production emails');

    // For production, use Firebase Cloud Functions with:
    // - Nodemailer with Gmail SMTP
    // - Or Firebase Extensions for email delivery

    return { success: true, note: 'Email logged - configure SMTP for production' };
  } catch (error) {
    console.error('❌ Email failed:', error.message);
    return { success: false, error: error.message };
  }
};

// ============================================
// EVENT-BASED NOTIFICATIONS
// ============================================

/**
 * Send registration confirmation (Email + SMS + Push)
 */
const sendRegistrationConfirmation = async (user) => {
  try {
    console.log(`🎉 Sending registration confirmation to: ${user.name}`);

    const results = {};

    // 1. Email
    if (user.email) {
      const emailHtml = `
        <div style="font-family: Arial; padding: 20px; background: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
            <h1 style="color: #10b981;">🌾 Welcome to Achhadam!</h1>
            <p>Hi ${user.name},</p>
            <p>Your registration as a <strong>${user.userType}</strong> is complete!</p>
            <p>You can now:</p>
            <ul>
              ${user.userType === 'farmer' ? `
                <li>Upload and sell crops</li>
                <li>Get weather updates</li>
                <li>Track orders and payments</li>
              ` : user.userType === 'buyer' ? `
                <li>Browse fresh crops</li>
                <li>Track deliveries</li>
                <li>Secure payments</li>
              ` : `
                <li>Manage transportation</li>
                <li>Track earnings</li>
                <li>View delivery routes</li>
              `}
            </ul>
            <a href="https://www.achhadam.com/dashboard" style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              Go to Dashboard
            </a>
            <p>Happy farming! 🌱</p>
            <p><strong>Team Achhadam</strong></p>
          </div>
        </div>
      `;

      results.email = await sendEmail(
        user.email,
        'Welcome to Achhadam - Registration Complete!',
        emailHtml
      );
    }

    // 2. SMS
    if (user.phone) {
      const smsMessage = `Welcome to Achhadam, ${user.name}! Your ${user.userType} registration is complete. Start your journey at www.achhadam.com - Team Achhadam`;
      results.sms = await sendSMS(user.phone, smsMessage);
    }

    // 3. Push Notification
    if (user.fcmToken) {
      results.push = await sendPushNotification(
        user.fcmToken,
        '🎉 Welcome to Achhadam!',
        `Hi ${user.name}! Your ${user.userType} registration is complete.`,
        { type: 'welcome', userId: user.id }
      );
    }

    console.log('✅ Registration confirmation sent:', results);
    return { success: true, results };
  } catch (error) {
    console.error('❌ Registration confirmation failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send crop upload confirmation
 */
const sendCropUploadConfirmation = async (farmer, crop) => {
  try {
    console.log(`📸 Sending crop upload confirmation to: ${farmer.name}`);

    const results = {};

    // SMS
    if (farmer.phone) {
      const smsMessage = `Crop uploaded successfully! ${crop.name} (${crop.quantity} ${crop.unit}) is now live on Achhadam marketplace. Price: ₹${crop.price}/${crop.unit} - Achhadam`;
      results.sms = await sendSMS(farmer.phone, smsMessage);
    }

    // Push Notification
    if (farmer.fcmToken) {
      results.push = await sendPushNotification(
        farmer.fcmToken,
        '✅ Crop Uploaded Successfully!',
        `${crop.name} (${crop.quantity} ${crop.unit}) is now live at ₹${crop.price}/${crop.unit}`,
        { type: 'crop_uploaded', cropId: crop.id }
      );
    }

    console.log('✅ Crop upload confirmation sent:', results);
    return { success: true, results };
  } catch (error) {
    console.error('❌ Crop upload confirmation failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send new order notification (to farmer)
 */
const sendNewOrderNotificationToFarmer = async (farmer, order) => {
  try {
    console.log(`🛒 Sending new order notification to farmer: ${farmer.name}`);

    const results = {};

    // SMS
    if (farmer.phone) {
      const smsMessage = `New Order! ${order.buyerName} ordered ${order.cropName} (${order.quantity} ${order.unit}). Amount: ₹${order.totalAmount}. Check app to confirm - Achhadam`;
      results.sms = await sendSMS(farmer.phone, smsMessage);
    }

    // Push Notification
    if (farmer.fcmToken) {
      results.push = await sendPushNotification(
        farmer.fcmToken,
        '🎉 New Order Received!',
        `${order.buyerName} ordered ${order.cropName}. Amount: ₹${order.totalAmount}`,
        { type: 'new_order', orderId: order.id }
      );
    }

    // Email
    if (farmer.email) {
      const emailHtml = `
        <div style="font-family: Arial; padding: 20px;">
          <h1 style="color: #10b981;">🎉 New Order Received!</h1>
          <p>Hi ${farmer.name},</p>
          <p>You have a new order:</p>
          <ul>
            <li><strong>Buyer:</strong> ${order.buyerName}</li>
            <li><strong>Crop:</strong> ${order.cropName}</li>
            <li><strong>Quantity:</strong> ${order.quantity} ${order.unit}</li>
            <li><strong>Amount:</strong> ₹${order.totalAmount}</li>
          </ul>
          <p>Please confirm the order in the app.</p>
        </div>
      `;
      results.email = await sendEmail(farmer.email, `New Order - ${order.cropName}`, emailHtml);
    }

    console.log('✅ New order notification sent:', results);
    return { success: true, results };
  } catch (error) {
    console.error('❌ New order notification failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send order confirmation (to buyer)
 */
const sendOrderConfirmationToBuyer = async (buyer, order) => {
  try {
    console.log(`📦 Sending order confirmation to buyer: ${buyer.name}`);

    const results = {};

    // SMS
    if (buyer.phone) {
      const smsMessage = `Order confirmed! Order #${order.id}. Farmer: ${order.farmerName}. Total: ₹${order.totalAmount}. Track your order on Achhadam app - Achhadam`;
      results.sms = await sendSMS(buyer.phone, smsMessage);
    }

    // Push Notification
    if (buyer.fcmToken) {
      results.push = await sendPushNotification(
        buyer.fcmToken,
        '✅ Order Confirmed!',
        `Order #${order.id} confirmed. Total: ₹${order.totalAmount}`,
        { type: 'order_confirmed', orderId: order.id }
      );
    }

    // Email
    if (buyer.email) {
      const emailHtml = `
        <div style="font-family: Arial; padding: 20px;">
          <h1 style="color: #10b981;">✅ Order Confirmed!</h1>
          <p>Hi ${buyer.name},</p>
          <p>Your order has been confirmed:</p>
          <ul>
            <li><strong>Order ID:</strong> ${order.id}</li>
            <li><strong>Farmer:</strong> ${order.farmerName}</li>
            <li><strong>Crop:</strong> ${order.cropName}</li>
            <li><strong>Total Amount:</strong> ₹${order.totalAmount}</li>
          </ul>
          <a href="https://www.achhadam.com/orders/${order.id}" style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">
            Track Order
          </a>
        </div>
      `;
      results.email = await sendEmail(buyer.email, `Order Confirmed - #${order.id}`, emailHtml);
    }

    console.log('✅ Order confirmation sent:', results);
    return { success: true, results };
  } catch (error) {
    console.error('❌ Order confirmation failed:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send delivery update (to buyer and transporter)
 */
const sendDeliveryUpdate = async (recipient, order, status) => {
  try {
    console.log(`🚚 Sending delivery update: ${status}`);

    const statusMessages = {
      'packed': '📦 Your order has been packed and ready for dispatch',
      'shipped': '🚚 Your order is on the way!',
      'out_for_delivery': '🛵 Order is out for delivery',
      'delivered': '✅ Order delivered successfully!'
    };

    const results = {};

    // Push Notification
    if (recipient.fcmToken) {
      results.push = await sendPushNotification(
        recipient.fcmToken,
        statusMessages[status] || 'Delivery Update',
        `Order #${order.id}`,
        { type: 'delivery_update', orderId: order.id, status }
      );
    }

    // SMS
    if (recipient.phone) {
      const smsMessage = `Order #${order.id}: ${statusMessages[status]}. Track live on Achhadam app - Achhadam`;
      results.sms = await sendSMS(recipient.phone, smsMessage);
    }

    console.log('✅ Delivery update sent:', results);
    return { success: true, results };
  } catch (error) {
    console.error('❌ Delivery update failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  // Core functions
  sendPushNotification,
  sendMulticastNotification,
  sendSMS,
  sendEmail,

  // Event-based notifications
  sendRegistrationConfirmation,
  sendCropUploadConfirmation,
  sendNewOrderNotificationToFarmer,
  sendOrderConfirmationToBuyer,
  sendDeliveryUpdate
};
