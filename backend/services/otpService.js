const crypto = require('crypto');

// In-memory storage for development (use Redis in production)
const otpStore = new Map();

class OTPService {
  constructor() {
    this.otpExpiry = 5 * 60 * 1000; // 5 minutes in milliseconds
    this.maxAttempts = 3;
  }

  // Generate 6-digit OTP
  generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Store OTP with phone number and expiry
  storeOTP(phone, otp) {
    const otpData = {
      otp: otp,
      createdAt: Date.now(),
      attempts: 0,
      verified: false
    };
    
    otpStore.set(phone, otpData);
    
    // Auto-cleanup after expiry
    setTimeout(() => {
      otpStore.delete(phone);
    }, this.otpExpiry);
    
    return otpData;
  }

  // Verify OTP
  verifyOTP(phone, inputOTP) {
    const otpData = otpStore.get(phone);
    
    if (!otpData) {
      return { success: false, message: 'OTP expired or not found' };
    }
    
    // Check if OTP is expired
    if (Date.now() - otpData.createdAt > this.otpExpiry) {
      otpStore.delete(phone);
      return { success: false, message: 'OTP has expired' };
    }
    
    // Check attempts limit
    if (otpData.attempts >= this.maxAttempts) {
      otpStore.delete(phone);
      return { success: false, message: 'Maximum attempts exceeded' };
    }
    
    // Increment attempts
    otpData.attempts++;
    
    // Verify OTP
    if (otpData.otp === inputOTP) {
      otpData.verified = true;
      otpStore.delete(phone); // Clean up after successful verification
      return { success: true, message: 'OTP verified successfully' };
    } else {
      return { success: false, message: 'Invalid OTP' };
    }
  }

  // Check if OTP exists and is valid
  checkOTP(phone) {
    const otpData = otpStore.get(phone);
    
    if (!otpData) {
      return { exists: false, message: 'OTP not found' };
    }
    
    if (Date.now() - otpData.createdAt > this.otpExpiry) {
      otpStore.delete(phone);
      return { exists: false, message: 'OTP expired' };
    }
    
    return { 
      exists: true, 
      attempts: otpData.attempts,
      remainingTime: Math.ceil((this.otpExpiry - (Date.now() - otpData.createdAt)) / 1000)
    };
  }

  // Send OTP via SMS (Mock implementation for development)
  async sendOTP(phone, otp) {
    try {
      // In production, integrate with SMS service like Twilio, Fast2SMS, or MSG91
      
      // Mock SMS sending for development
      console.log(`📱 Mock SMS sent to ${phone}: Your ACHHADAM OTP is ${otp}. Valid for 5 minutes.`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'OTP sent successfully',
        provider: 'Mock SMS Service'
      };
      
      /* Production SMS Integration Example:
      
      // Using Twilio
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = require('twilio')(accountSid, authToken);
      
      const message = await client.messages.create({
        body: `Your ACHHADAM OTP is ${otp}. Valid for 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phone}`
      });
      
      return {
        success: true,
        message: 'OTP sent successfully',
        provider: 'Twilio',
        messageId: message.sid
      };
      
      */
      
    } catch (error) {
      console.error('SMS sending failed:', error);
      return {
        success: false,
        message: 'Failed to send SMS',
        error: error.message
      };
    }
  }

  // Resend OTP
  async resendOTP(phone) {
    try {
      // Check if phone already has an OTP
      const existingOTP = this.checkOTP(phone);
      
      if (existingOTP.exists) {
        // Check if enough time has passed for resend (1 minute)
        const timeSinceLastOTP = Date.now() - otpStore.get(phone).createdAt;
        if (timeSinceLastOTP < 60000) { // 1 minute
          const remainingTime = Math.ceil((60000 - timeSinceLastOTP) / 1000);
          return {
            success: false,
            message: `Please wait ${remainingTime} seconds before requesting a new OTP`
          };
        }
      }
      
      // Generate new OTP
      const newOTP = this.generateOTP();
      
      // Store new OTP
      this.storeOTP(phone, newOTP);
      
      // Send new OTP
      const smsResult = await this.sendOTP(phone, newOTP);
      
      if (smsResult.success) {
        return {
          success: true,
          message: 'New OTP sent successfully',
          otp: newOTP // Remove this in production
        };
      } else {
        return smsResult;
      }
      
    } catch (error) {
      console.error('Resend OTP failed:', error);
      return {
        success: false,
        message: 'Failed to resend OTP',
        error: error.message
      };
    }
  }

  // Clean up expired OTPs
  cleanupExpiredOTPs() {
    const now = Date.now();
    for (const [phone, otpData] of otpStore.entries()) {
      if (now - otpData.createdAt > this.otpExpiry) {
        otpStore.delete(phone);
      }
    }
  }
}

// Cleanup expired OTPs every minute
setInterval(() => {
  const otpService = new OTPService();
  otpService.cleanupExpiredOTPs();
}, 60000);

module.exports = OTPService;
