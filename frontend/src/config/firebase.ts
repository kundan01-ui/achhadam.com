import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDIr9HygDcTillF47oYfi1xIEozr9l8mBA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "digital-farming-platform.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "digital-farming-platform",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "digital-farming-platform.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1024746152320",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1024746152320:web:67799730096fd80fc32165",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BJK3TJ7M9F"
};

// Validate Firebase configuration
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY') {
  console.error('❌ Firebase API Key is missing or invalid');
}
if (!firebaseConfig.projectId || firebaseConfig.projectId === 'YOUR_PROJECT_ID') {
  console.error('❌ Firebase Project ID is missing or invalid');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Set Firebase config in window object for service detection
(window as any).firebaseConfig = firebaseConfig;

// Recaptcha verifier for phone authentication
let recaptchaVerifier: RecaptchaVerifier | null = null;

export const initializeRecaptcha = (elementId: string = 'recaptcha-container') => {
  try {
    console.log('🔄 Initializing Recaptcha...');
    
    // Check if element exists
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('❌ Recaptcha container element not found:', elementId);
      // Create the element if it doesn't exist
      const newElement = document.createElement('div');
      newElement.id = elementId;
      newElement.className = 'hidden';
      document.body.appendChild(newElement);
      console.log('✅ Created recaptcha container element:', elementId);
    }
    
    console.log('✅ Recaptcha container found:', elementId);
    
    // Force clear everything
    if (recaptchaVerifier) {
      console.log('🧹 Force clearing existing Recaptcha...');
      try {
        recaptchaVerifier.clear();
      } catch (clearError) {
        console.warn('⚠️ Error clearing existing recaptcha:', clearError);
      }
      recaptchaVerifier = null;
    }
    
    // Get the element again (in case we created it)
    const targetElement = document.getElementById(elementId);
    if (!targetElement) {
      throw new Error(`Failed to create or find recaptcha container: ${elementId}`);
    }
    
    // Completely clear and recreate the container element
    targetElement.innerHTML = '';
    targetElement.removeAttribute('data-sitekey');
    targetElement.removeAttribute('data-callback');
    targetElement.removeAttribute('data-expired-callback');
    targetElement.removeAttribute('data-error-callback');
    
    // Remove any existing reCAPTCHA scripts
    const existingScripts = document.querySelectorAll('script[src*="recaptcha"]');
    existingScripts.forEach(script => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
    
    // Create new recaptcha verifier with unique ID
    const uniqueId = `recaptcha-${Date.now()}`;
    targetElement.id = uniqueId;
    
    recaptchaVerifier = new RecaptchaVerifier(auth, uniqueId, {
      size: 'invisible',
      callback: (response: any) => {
        console.log('✅ Recaptcha verified successfully:', response);
      },
      'expired-callback': () => {
        console.log('⚠️ Recaptcha expired');
      },
      'error-callback': (error: any) => {
        console.error('❌ Recaptcha error:', error);
      }
    });
    
    console.log('✅ Recaptcha verifier created successfully with ID:', uniqueId);
    return recaptchaVerifier;
  } catch (error: any) {
    console.error('❌ Failed to initialize Recaptcha:', error);
    throw error;
  }
};

export const sendOTP = async (phoneNumber: string): Promise<string> => {
  try {
    console.log('📱 Starting OTP send process...');
    console.log('📱 Phone number:', phoneNumber);
    
    // Always create a fresh recaptcha verifier
    console.log('🔄 Creating fresh Recaptcha verifier...');
    const freshRecaptchaVerifier = await initializeRecaptcha();
    
    console.log('🔄 Calling signInWithPhoneNumber...');
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, freshRecaptchaVerifier);
    console.log('✅ OTP sent successfully!');
    console.log('📋 Confirmation result:', confirmationResult);
    
    // Store confirmation result for verification
    (window as any).confirmationResult = confirmationResult;
    
    return 'OTP sent successfully';
  } catch (error: any) {
    console.error('❌ Error sending OTP:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send OTP';
    if (error.code === 'auth/invalid-phone-number') {
      errorMessage = 'Invalid phone number format';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many requests. Please try again later';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection';
    } else if (error.code === 'auth/captcha-check-failed') {
      errorMessage = 'Recaptcha verification failed';
    } else if (error.code === 'auth/invalid-app-credential') {
      errorMessage = 'Firebase configuration error. Please check your Firebase settings.';
    } else if (error.message && error.message.includes('already been rendered')) {
      errorMessage = 'Recaptcha already initialized. Please try again.';
    } else if (error.message && error.message.includes('unauthorized')) {
      errorMessage = 'reCAPTCHA authorization failed. Please check your reCAPTCHA key.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const verifyOTP = async (otp: string): Promise<boolean> => {
  try {
    const confirmationResult = (window as any).confirmationResult;
    
    if (!confirmationResult) {
      throw new Error('No confirmation result found');
    }
    
    const result = await confirmationResult.confirm(otp);
    console.log('OTP verified successfully:', result.user);
    
    return true;
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    throw new Error(error.message || 'Invalid OTP');
  }
};

export const clearRecaptcha = () => {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
      console.log('🧹 Recaptcha cleared successfully');
    } catch (error) {
      console.warn('⚠️ Error clearing recaptcha:', error);
    }
    recaptchaVerifier = null;
  }
  
  // Clear all recaptcha containers
  const containers = document.querySelectorAll('[id^="recaptcha-"]');
  containers.forEach(container => {
    container.innerHTML = '';
    container.removeAttribute('data-sitekey');
    container.removeAttribute('data-callback');
    container.removeAttribute('data-expired-callback');
    container.removeAttribute('data-error-callback');
  });
  
  // Remove any existing reCAPTCHA scripts
  const existingScripts = document.querySelectorAll('script[src*="recaptcha"]');
  existingScripts.forEach(script => {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  });
};

export default app;
