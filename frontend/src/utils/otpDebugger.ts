// OTP Debugging Utility
export class OTPDebugger {
  static logOTPProcess(step: string, data: any) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🔍 OTP Debug - ${step}:`, data);
  }

  static checkPhoneNumber(phone: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check if phone starts with +91
    if (!phone.startsWith('+91')) {
      issues.push('Phone number should start with +91');
    }
    
    // Check if it's exactly 13 characters (+91 + 10 digits)
    if (phone.length !== 13) {
      issues.push(`Phone number should be 13 characters, got ${phone.length}`);
    }
    
    // Check if it's a valid Indian mobile number
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      issues.push('Invalid Indian mobile number format');
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  }

  static checkFirebaseConfig(): { configured: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check if Firebase config exists
    if (!(window as any).firebaseConfig) {
      issues.push('Firebase config not found in window object');
    }
    
    // Check API key
    const config = (window as any).firebaseConfig;
    if (config && (!config.apiKey || config.apiKey === 'YOUR_API_KEY')) {
      issues.push('Firebase API key is missing or invalid');
    }
    
    // Check project ID
    if (config && (!config.projectId || config.projectId === 'YOUR_PROJECT_ID')) {
      issues.push('Firebase Project ID is missing or invalid');
    }
    
    return {
      configured: issues.length === 0,
      issues
    };
  }

  static checkRecaptcha(): { initialized: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check if recaptcha container exists
    const container = document.getElementById('recaptcha-container');
    if (!container) {
      issues.push('Recaptcha container not found');
    }
    
    // Check if recaptcha is rendered
    if (container && container.children.length === 0) {
      issues.push('Recaptcha not rendered');
    }
    
    return {
      initialized: issues.length === 0,
      issues
    };
  }

  static async testSMSDelivery(phone: string): Promise<{ delivered: boolean; message: string }> {
    try {
      // This is a mock test - in real scenario, you'd check Firebase logs
      console.log('📱 Testing SMS delivery for:', phone);
      
      // Simulate checking Firebase logs or SMS delivery status
      const mockDeliveryStatus = {
        delivered: true,
        message: 'SMS delivery test completed (mock)'
      };
      
      return mockDeliveryStatus;
    } catch (error) {
      return {
        delivered: false,
        message: `SMS delivery test failed: ${error}`
      };
    }
  }

  static generateDebugReport(phone: string, otp: string) {
    console.log('🔍 === OTP DEBUG REPORT ===');
    
    // Phone number validation
    const phoneCheck = this.checkPhoneNumber(phone);
    console.log('📱 Phone Number Check:', phoneCheck);
    
    // Firebase config check
    const configCheck = this.checkFirebaseConfig();
    console.log('🔥 Firebase Config Check:', configCheck);
    
    // Recaptcha check
    const recaptchaCheck = this.checkRecaptcha();
    console.log('🤖 Recaptcha Check:', recaptchaCheck);
    
    // OTP format check
    const otpValid = otp && otp.length >= 4 && otp.length <= 8;
    console.log('🔐 OTP Format Check:', { valid: otpValid, length: otp?.length });
    
    // Confirmation result check
    const confirmationResult = (window as any).confirmationResult;
    console.log('📋 Confirmation Result:', { exists: !!confirmationResult, type: typeof confirmationResult });
    
    console.log('🔍 === END DEBUG REPORT ===');
    
    return {
      phone: phoneCheck,
      firebase: configCheck,
      recaptcha: recaptchaCheck,
      otp: { valid: otpValid, length: otp?.length },
      confirmation: { exists: !!confirmationResult }
    };
  }
}

export default OTPDebugger;

