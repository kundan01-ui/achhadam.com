const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTP, verifyOTP } = require('../../../services/otpService');
const User = require('../../../models/User');

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

// Send OTP for password reset
router.post('/send-reset-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    // Validate phone number
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    // Check if user exists
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this phone number'
      });
    }

    // Generate and send OTP
    const otpResult = await sendOTP(phone);
    
    if (otpResult.success) {
      // Store OTP in user record for verification
      user.resetOTP = otpResult.otp;
      user.resetOTPExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      res.json({
        success: true,
        message: 'OTP sent successfully to your mobile number',
        otp: process.env.NODE_ENV === 'development' ? otpResult.otp : undefined // Only show OTP in development
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.'
      });
    }
  } catch (error) {
    console.error('Send reset OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify OTP for password reset
router.post('/verify-reset-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Validate inputs
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    // Find user
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if OTP exists and is not expired
    if (!user.resetOTP || !user.resetOTPExpiry || user.resetOTPExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired or not found. Please request a new OTP.'
      });
    }

    // Verify OTP
    const otpResult = await verifyOTP(phone, otp);
    
    if (otpResult.success) {
      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user._id, phone: user.phone },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: '15m' }
      );

      // Clear OTP from user record
      user.resetOTP = undefined;
      user.resetOTPExpiry = undefined;
      await user.save();

      res.json({
        success: true,
        message: 'OTP verified successfully',
        resetToken: resetToken
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }
  } catch (error) {
    console.error('Verify reset OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Reset password with token
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // Validate inputs
    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required'
      });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedPassword;
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Health check
router.get('/', (req, res) => {
  res.json({ 
    message: 'Auth routes working!',
    endpoints: [
      'POST /auth/send-otp',
      'POST /auth/verify-otp',
      'POST /auth/send-reset-otp',
      'POST /auth/verify-reset-otp',
      'POST /auth/reset-password'
    ]
  });
});

module.exports = router;

