import { 
  initializeRecaptcha, 
  sendOTP, 
  verifyOTP, 
  clearRecaptcha 
} from '../config/firebase';

export class FirebaseOTPService {
  private isRecaptchaInitialized = false;

  async initializeRecaptcha(elementId: string = 'recaptcha-container'): Promise<boolean> {
    try {
      // Always reinitialize to avoid "already rendered" errors
      await initializeRecaptcha(elementId);
      this.isRecaptchaInitialized = true;
      console.log('✅ Firebase Recaptcha initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Recaptcha:', error);
      this.isRecaptchaInitialized = false;
      return false;
    }
  }

  async sendOTPToPhone(phoneNumber: string): Promise<{ success: boolean; message: string; confirmationResult?: any }> {
    try {
      // Ensure phone number has country code
      const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
      
      console.log('📱 Sending OTP to:', formattedPhone);
      
      // Check if Firebase is configured and billing is enabled
      if (firebaseOTPService.isFirebaseConfigured()) {
        try {
          // Try Firebase OTP first (now that billing is enabled)
          console.log('🔥 Using Real Firebase OTP (Billing Enabled)');
          
          // Clear any existing recaptcha before sending
          clearRecaptcha();
          
          const result = await sendOTP(formattedPhone);
          return {
            success: true,
            message: result,
            confirmationResult: (window as any).confirmationResult
          };
        } catch (firebaseError: any) {
          console.error('❌ Firebase OTP failed:', firebaseError.message);
          console.error('❌ Firebase error code:', firebaseError.code);
          
          // Fallback to mock OTP for any Firebase error (development mode)
          console.warn('⚠️ Falling back to mock OTP due to Firebase error:', firebaseError.message);
          return await this.sendMockOTP(formattedPhone);
        }
      } else {
        // Use mock OTP if Firebase is not configured
        console.log('🎭 Firebase not configured, using mock OTP');
        return await this.sendMockOTP(formattedPhone);
      }
    } catch (error: any) {
      console.error('❌ Failed to send OTP:', error);
      return {
        success: false,
        message: error.message || 'Failed to send OTP'
      };
    }
  }

  // Mock OTP service for development
  private async sendMockOTP(phoneNumber: string): Promise<{ success: boolean; message: string; confirmationResult?: any }> {
    console.log('🎭 Using Mock OTP service for development');
    
    // Generate a mock OTP
    const mockOTP = '123456';
    
    // Store mock OTP in session storage
    sessionStorage.setItem('mockOTP', mockOTP);
    sessionStorage.setItem('mockPhone', phoneNumber);
    sessionStorage.setItem('mockOTPTime', Date.now().toString());
    
    // Create mock confirmation result
    const mockConfirmationResult = {
      confirm: async (otp: string) => {
        if (otp === mockOTP) {
          return {
            user: {
              uid: 'mock-user-' + Date.now(),
              phoneNumber: phoneNumber,
              displayName: 'Mock User'
            }
          };
        } else {
          throw new Error('Invalid OTP');
        }
      }
    };
    
    // Store mock confirmation result
    (window as any).confirmationResult = mockConfirmationResult;
    
    console.log('✅ Mock OTP sent successfully:', mockOTP);
    console.log('💡 For development: Use OTP =', mockOTP);
    console.log('📱 Mock OTP sent to:', phoneNumber);
    
    return {
      success: true,
      message: `Mock OTP sent successfully! Use OTP: ${mockOTP} (Development Mode)`,
      confirmationResult: mockConfirmationResult
    };
  }

  async verifyOTPCode(otp: string): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      console.log('🔐 Verifying OTP:', otp);
      
      // Check if we're using mock OTP
      const mockOTP = sessionStorage.getItem('mockOTP');
      if (mockOTP) {
        console.log('🎭 Verifying Mock OTP');
        if (otp === mockOTP) {
          const mockUser = {
            uid: 'mock-user-' + Date.now(),
            phoneNumber: sessionStorage.getItem('mockPhone'),
            displayName: 'Mock User'
          };
          return {
            success: true,
            message: 'Mock OTP verified successfully',
            user: mockUser
          };
        } else {
          return {
            success: false,
            message: 'Invalid OTP'
          };
        }
      }
      
      // Use Firebase OTP verification
      const result = await verifyOTP(otp);
      
      if (result) {
        return {
          success: true,
          message: 'OTP verified successfully',
          user: (window as any).confirmationResult?.user
        };
      } else {
        return {
          success: false,
          message: 'Invalid OTP'
        };
      }
    } catch (error: any) {
      console.error('❌ Failed to verify OTP:', error);
      return {
        success: false,
        message: error.message || 'Invalid OTP'
      };
    }
  }

  async cleanup(): Promise<void> {
    try {
      clearRecaptcha();
      this.isRecaptchaInitialized = false;
      console.log('🧹 Firebase OTP service cleaned up');
    } catch (error) {
      console.error('❌ Failed to cleanup Firebase OTP service:', error);
    }
  }

  // Method to check if Firebase is properly configured
  isFirebaseConfigured(): boolean {
    // RE-ENABLED: Firebase is economically better (free) than SMS services like Fast2SMS
    // Using Firebase Test Phone Numbers for development (no reCAPTCHA needed)
    // For production: Firebase automatically handles reCAPTCHA
    try {
      const config = (window as any).firebaseConfig;
      return config && config.apiKey && config.apiKey !== 'YOUR_API_KEY';
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const firebaseOTPService = new FirebaseOTPService();
