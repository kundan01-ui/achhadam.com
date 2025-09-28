// Advanced Token Management Service
// Handles token validation, refresh, and authentication

interface TokenInfo {
  isValid: boolean;
  token: string | null;
  userId?: string;
  expiresAt?: Date;
  error?: string;
}

interface RefreshResponse {
  success: boolean;
  token?: string;
  error?: string;
}

class TokenService {
  private refreshPromise: Promise<string> | null = null;

  // Validate current token
  validateToken(): TokenInfo {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        isValid: false,
        token: null,
        error: 'No token found'
      };
    }

    try {
      // Parse JWT token
      const parts = token.split('.');
      if (parts.length !== 3) {
        return {
          isValid: false,
          token: null,
          error: 'Invalid token format'
        };
      }

      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      
      // Check if token is expired
      if (payload.exp && payload.exp < now) {
        return {
          isValid: false,
          token: null,
          userId: payload.userId,
          expiresAt: new Date(payload.exp * 1000),
          error: 'Token expired'
        };
      }

      // Check if token expires soon (within 5 minutes)
      const expiresSoon = payload.exp && (payload.exp - now) < 300;
      
      return {
        isValid: true,
        token,
        userId: payload.userId,
        expiresAt: new Date(payload.exp * 1000),
        error: expiresSoon ? 'Token expires soon' : undefined
      };

    } catch (error) {
      return {
        isValid: false,
        token: null,
        error: 'Token parsing failed'
      };
    }
  }

  // Refresh token if needed
  async refreshTokenIfNeeded(): Promise<string | null> {
    const tokenInfo = this.validateToken();
    
    if (tokenInfo.isValid && !tokenInfo.error) {
      console.log('✅ Token is valid, no refresh needed');
      return tokenInfo.token;
    }

    // If already refreshing, wait for that promise
    if (this.refreshPromise) {
      console.log('🔄 Token refresh already in progress, waiting...');
      return await this.refreshPromise;
    }

    // Start new refresh process
    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  // Perform actual token refresh
  private async performTokenRefresh(): Promise<string | null> {
    try {
      console.log('🔄 Attempting token refresh...');
      
      const response = await fetch('https://acchadam1-backend.onrender.com/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const newToken = data.token;
        
        // Store new token
        localStorage.setItem('authToken', newToken);
        
        console.log('✅ Token refreshed successfully');
        return newToken;
      } else {
        console.error('❌ Token refresh failed:', response.status);
        return null;
      }
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      return null;
    }
  }

  // Get valid token (with auto-refresh)
  async getValidToken(): Promise<string | null> {
    const tokenInfo = this.validateToken();
    
    if (tokenInfo.isValid && !tokenInfo.error) {
      return tokenInfo.token;
    }

    // Try to refresh token
    const refreshedToken = await this.refreshTokenIfNeeded();
    if (refreshedToken) {
      return refreshedToken;
    }

    // If refresh fails, try to get fresh token from login
    console.log('🔄 Token refresh failed, attempting fresh login...');
    return await this.attemptFreshLogin();
  }

  // Attempt fresh login
  private async attemptFreshLogin(): Promise<string | null> {
    try {
      // Get stored user credentials
      const userPhone = localStorage.getItem('userPhone');
      const userType = localStorage.getItem('userType');
      
      if (!userPhone || !userType) {
        console.error('❌ No stored credentials for fresh login');
        return null;
      }

      console.log('🔄 Attempting fresh login for:', userPhone);
      
      const response = await fetch('https://acchadam1-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: userPhone,
          userType: userType
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newToken = data.token;
        
        // Store new token
        localStorage.setItem('authToken', newToken);
        
        console.log('✅ Fresh login successful');
        return newToken;
      } else {
        console.error('❌ Fresh login failed:', response.status);
        return null;
      }
    } catch (error) {
      console.error('❌ Fresh login error:', error);
      return null;
    }
  }

  // Clear all authentication data
  clearAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userType');
    localStorage.removeItem('farmer_user_id');
    localStorage.removeItem('buyer_user_id');
    localStorage.removeItem('transporter_user_id');
    
    console.log('🧹 Authentication data cleared');
  }

  // Check if user needs to re-login
  needsReLogin(): boolean {
    const tokenInfo = this.validateToken();
    return !tokenInfo.isValid && tokenInfo.error === 'Token expired';
  }

  // Get token statistics
  getTokenStats(): any {
    const tokenInfo = this.validateToken();
    
    return {
      isValid: tokenInfo.isValid,
      hasToken: !!tokenInfo.token,
      userId: tokenInfo.userId,
      expiresAt: tokenInfo.expiresAt,
      error: tokenInfo.error,
      needsRefresh: !!tokenInfo.error
    };
  }
}

// Create global token service
export const tokenService = new TokenService();

// Enhanced fetch with automatic token management
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // Get valid token
  const token = await tokenService.getValidToken();
  
  if (!token) {
    throw new Error('No valid authentication token available');
  }

  // Add authorization header
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  console.log(`🌐 Making authenticated request to: ${url}`);
  
  const response = await fetch(url, {
    ...options,
    headers
  });

  // If 401, try to refresh token and retry once
  if (response.status === 401) {
    console.log('🔄 401 received, attempting token refresh...');
    
    const refreshedToken = await tokenService.refreshTokenIfNeeded();
    if (refreshedToken) {
      console.log('🔄 Retrying request with refreshed token...');
      
      const retryHeaders = {
        ...headers,
        'Authorization': `Bearer ${refreshedToken}`
      };
      
      return fetch(url, {
        ...options,
        headers: retryHeaders
      });
    }
  }

  return response;
};

export default tokenService;
