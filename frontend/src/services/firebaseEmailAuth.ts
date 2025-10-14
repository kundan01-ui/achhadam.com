/**
 * Firebase Email Authentication Service
 * Handles email/password authentication and password reset
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  UserCredential,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';

export interface EmailAuthResult {
  success: boolean;
  user?: User;
  message?: string;
  error?: string;
}

export interface PasswordResetResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Sign up with Email and Password
 */
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<EmailAuthResult> => {
  try {
    console.log('📧 Signing up with email:', email);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password strength
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Create user with email and password
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log('✅ Email signup successful!');
    console.log('👤 User:', userCredential.user);
    console.log('🆔 User ID:', userCredential.user.uid);

    // Send email verification
    try {
      await sendEmailVerification(userCredential.user);
      console.log('📧 Verification email sent to:', email);
    } catch (verifyError) {
      console.warn('⚠️ Failed to send verification email:', verifyError);
    }

    return {
      success: true,
      user: userCredential.user,
      message: 'Account created successfully! Please verify your email.'
    };

  } catch (error: any) {
    console.error('❌ Email signup failed:', error);

    let errorMessage = 'Failed to create account';

    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Email already in use. Please login or use a different email.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. Use at least 8 characters.';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Email/password accounts are not enabled';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Sign in with Email and Password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<EmailAuthResult> => {
  try {
    console.log('📧 Signing in with email:', email);

    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Sign in
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log('✅ Email login successful!');
    console.log('👤 User:', userCredential.user);
    console.log('🆔 User ID:', userCredential.user.uid);

    // Check if email is verified
    if (!userCredential.user.emailVerified) {
      console.warn('⚠️ Email not verified');
      return {
        success: true,
        user: userCredential.user,
        message: 'Email not verified. Please check your inbox for verification link.'
      };
    }

    return {
      success: true,
      user: userCredential.user,
      message: 'Login successful!'
    };

  } catch (error: any) {
    console.error('❌ Email login failed:', error);

    let errorMessage = 'Failed to login';

    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many login attempts. Please try again later.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Send Password Reset Email
 */
export const sendPasswordReset = async (
  email: string
): Promise<PasswordResetResult> => {
  try {
    console.log('🔐 Sending password reset email to:', email);

    // Validate email
    if (!email) {
      throw new Error('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Send password reset email
    await sendPasswordResetEmail(auth, email, {
      url: window.location.origin + '/login',
      handleCodeInApp: false
    });

    console.log('✅ Password reset email sent successfully!');

    return {
      success: true,
      message: 'Password reset email sent! Please check your inbox.'
    };

  } catch (error: any) {
    console.error('❌ Failed to send password reset email:', error);

    let errorMessage = 'Failed to send password reset email';

    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many requests. Please try again later.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Resend Email Verification
 */
export const resendVerificationEmail = async (
  user: User
): Promise<PasswordResetResult> => {
  try {
    console.log('📧 Resending verification email to:', user.email);

    if (!user) {
      throw new Error('User is required');
    }

    if (user.emailVerified) {
      return {
        success: false,
        error: 'Email is already verified'
      };
    }

    await sendEmailVerification(user);

    console.log('✅ Verification email sent successfully!');

    return {
      success: true,
      message: 'Verification email sent! Please check your inbox.'
    };

  } catch (error: any) {
    console.error('❌ Failed to send verification email:', error);

    let errorMessage = 'Failed to send verification email';

    if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many requests. Please try again later.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Change Password (requires current password)
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<PasswordResetResult> => {
  try {
    console.log('🔐 Changing password...');

    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error('No user logged in');
    }

    // Validate new password
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }

    // Re-authenticate user with current password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update to new password
    await updatePassword(user, newPassword);

    console.log('✅ Password changed successfully!');

    return {
      success: true,
      message: 'Password changed successfully!'
    };

  } catch (error: any) {
    console.error('❌ Failed to change password:', error);

    let errorMessage = 'Failed to change password';

    if (error.code === 'auth/wrong-password') {
      errorMessage = 'Current password is incorrect';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'New password is too weak';
    } else if (error.code === 'auth/requires-recent-login') {
      errorMessage = 'Please logout and login again before changing password';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Sign out
 */
export const signOut = async (): Promise<PasswordResetResult> => {
  try {
    console.log('🚪 Signing out...');

    await auth.signOut();

    console.log('✅ Signed out successfully!');

    return {
      success: true,
      message: 'Signed out successfully!'
    };

  } catch (error: any) {
    console.error('❌ Failed to sign out:', error);

    return {
      success: false,
      error: error.message || 'Failed to sign out'
    };
  }
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Check if user is logged in
 */
export const isUserLoggedIn = (): boolean => {
  return auth.currentUser !== null;
};

/**
 * Check if email is verified
 */
export const isEmailVerified = (): boolean => {
  return auth.currentUser?.emailVerified || false;
};

// Export all functions
export default {
  signUpWithEmail,
  signInWithEmail,
  sendPasswordReset,
  resendVerificationEmail,
  changePassword,
  signOut,
  getCurrentUser,
  isUserLoggedIn,
  isEmailVerified
};
