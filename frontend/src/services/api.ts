// API service for authentication and user management
// Local Backend (Development) - Commented out for production
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

// Render Backend (Production) - Active for production
const API_BASE_URL = 'https://acchadam1-backend.onrender.com';

// API Response interface
export interface ApiResponse {
  success: boolean;
  message: string;
  [key: string]: any;
}

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
      // Add timeout to fetch requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      config.signal = controller.signal;
      
      console.time(`API Request: ${endpoint}`);
      const response = await fetch(url, config);
      console.timeEnd(`API Request: ${endpoint}`);
      
      // Clear timeout since request completed
      clearTimeout(timeoutId);
      
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
    } catch (error: any) {
      console.error(`API request failed for ${endpoint}:`, error);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  }

  // OTP Methods
  async sendOTP(phone: string, confirmationResult?: any): Promise<any> {
    return this.request<any>('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ 
        phone: phone.replace('+91', ''), // Remove +91 prefix for backend
        confirmationResult: confirmationResult || null
      })
    });
  }

  async verifyOTP(phone: string, otp: string): Promise<any> {
    return this.request<any>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ 
        phone: phone.replace('+91', ''), // Remove +91 prefix for backend
        otp 
      })
    });
  }

  async resendOTP(phone: string): Promise<any> {
    return this.request<any>('/api/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ 
        phone: phone.replace('+91', '') // Remove +91 prefix for backend
      })
    });
  }

  // User Authentication
  async signup(data: SignupRequest): Promise<SignupResponse> {
    return this.request<SignupResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(token: string): Promise<User> {
    return this.request<User>('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // User Profile Management
  async updateProfile(userId: string, data: Partial<User>, token: string): Promise<User> {
    return this.request<User>(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async getProfile(userId: string, token: string): Promise<User> {
    return this.request<User>(`/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/api/health');
  }

  // Generic GET method
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      method: 'GET',
      ...options,
    });
  }

  // Generic POST method
  async post<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
  }

  // Password Reset APIs
  async sendResetOTP(phone: string): Promise<ApiResponse> {
    return this.request<ApiResponse>('/api/auth/send-reset-otp', {
      method: 'POST',
      body: JSON.stringify({ phone: phone.replace('+91', '') }),
    });
  }

  async verifyResetOTP(phone: string, otp: string): Promise<{ success: boolean; message: string; resetToken?: string }> {
    return this.request<{ success: boolean; message: string; resetToken?: string }>('/api/auth/verify-reset-otp', {
      method: 'POST',
      body: JSON.stringify({ 
        phone: phone.replace('+91', ''), 
        otp 
      }),
    });
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<ApiResponse> {
    return this.request<ApiResponse>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ resetToken, newPassword }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;

