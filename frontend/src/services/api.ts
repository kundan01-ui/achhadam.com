// API service for authentication and user management
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: 'farmer' | 'buyer' | 'transporter';
  farmName?: string;
  farmSize?: string;
  farmSizeUnit?: string;
  village?: string;
  district?: string;
  state?: string;
  mainCrops?: string[];
  experience?: string;
  businessName?: string;
  businessType?: string;
  gstNumber?: string;
  preferredCrops?: string[];
  paymentTerms?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  vehicleCapacity?: string;
  licenseNumber?: string;
  preferredRoutes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  userType: 'farmer' | 'buyer' | 'transporter';
  farmName?: string;
  farmSize?: string;
  farmSizeUnit?: string;
  village?: string;
  district?: string;
  state?: string;
  mainCrops?: string[];
  experience?: string;
  businessName?: string;
  businessType?: string;
  gstNumber?: string;
  preferredCrops?: string[];
  paymentTerms?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  vehicleCapacity?: string;
  licenseNumber?: string;
  preferredRoutes?: string[];
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  message: string;
}

export interface SignupResponse {
  user: User;
  message: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle rate limiting specifically
        if (response.status === 429) {
          const retryAfter = errorData.retryAfter || 60;
          throw new Error(`Too many requests. Please wait ${retryAfter} seconds before trying again.`);
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // OTP Methods
  async sendOTP(phone: string, confirmationResult?: any): Promise<any> {
    return this.request<any>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ 
        phone,
        confirmationResult: confirmationResult || null
      })
    });
  }

  async verifyOTP(phone: string, otp: string): Promise<any> {
    return this.request<any>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp })
    });
  }

  async resendOTP(phone: string): Promise<any> {
    return this.request<any>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ phone })
    });
  }

  // User Authentication
  async signup(data: SignupRequest): Promise<SignupResponse> {
    return this.request<SignupResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(token: string): Promise<User> {
    return this.request<User>('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // User Profile Management
  async updateProfile(userId: string, data: Partial<User>, token: string): Promise<User> {
    return this.request<User>(`/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async getProfile(userId: string, token: string): Promise<User> {
    return this.request<User>(`/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService();
export default apiService;

