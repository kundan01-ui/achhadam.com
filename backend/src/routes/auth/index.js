const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber, recaptchaToken } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Validate phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    // For now, we'll simulate OTP sending
    // In production, you would integrate with Firebase Auth or SMS service
    console.log(`📱 OTP would be sent to: ${phoneNumber}`);
    
    // Simulate OTP generation
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in session or database (for demo purposes)
    req.session = req.session || {};
    req.session.otp = otp;
    req.session.phoneNumber = phoneNumber;
    req.session.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    res.json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        phoneNumber: phoneNumber,
        otp: otp, // Remove this in production
        expiresIn: 300 // 5 minutes
      }
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message
    });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    // Check if OTP exists and is valid
    if (!req.session || !req.session.otp || !req.session.phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new OTP.'
      });
    }

    // Check if phone numbers match
    if (req.session.phoneNumber !== phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number mismatch'
      });
    }

    // Check if OTP is expired
    if (Date.now() > req.session.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    // Check if OTP matches
    if (req.session.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // OTP is valid, clear session
    delete req.session.otp;
    delete req.session.phoneNumber;
    delete req.session.otpExpiry;

    // Generate JWT token (you can implement proper user creation here)
    const token = 'demo-jwt-token-' + Date.now();

    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        token: token,
        user: {
          phoneNumber: phoneNumber,
          verified: true
        }
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
});

// Health check
router.get('/', (req, res) => {
  res.json({ 
    message: 'Auth routes working!',
    endpoints: [
      'POST /auth/send-otp',
      'POST /auth/verify-otp'
    ]
  });
});

module.exports = router;

