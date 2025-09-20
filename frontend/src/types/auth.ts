// Shared authentication types
export interface GoogleUserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  userType: 'farmer' | 'buyer' | 'transporter';
  profileImage?: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  userType: 'farmer' | 'buyer' | 'transporter';
  // Additional fields based on user type
  [key: string]: any;
}









