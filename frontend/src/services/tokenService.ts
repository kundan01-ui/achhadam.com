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
  private retryQueue: Array<{url: string, options: RequestInit, timestamp: number}> = [];
  private isOnline: boolean = navigator.onLine;

  // Validate current token
  validateToken(): TokenInfo {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.log('❌ No token found in localStorage');
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
        console.log('❌ Invalid token format - not 3 parts');
        return {
          isValid: false,
          token: null,
          error: 'Invalid token format'
        };
      }

      // Decode payload with proper error handling
      let payload;
      try {
        payload = JSON.parse(atob(parts[1]));
      } catch (decodeError) {
        console.log('❌ Token payload decode failed:', decodeError);
        return {
          isValid: false,
          token: null,
          error: 'Token payload decode failed'
        };
      }

      const now = Math.floor(Date.now() / 1000);
      
      // DEBUG: Log token details
      console.log('🔑 Token validation:', {
        userId: payload.userId,
        exp: payload.exp,
        now: now,
        expiresIn: payload.exp ? (payload.exp - now) : 'No expiry',
        isExpired: payload.exp ? (payload.exp < now) : false
      });
      
      // Check if token is expired
      if (payload.exp && payload.exp < now) {
        console.log('❌ Token expired:', {
          exp: payload.exp,
          now: now,
          diff: now - payload.exp
        });
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
      
      console.log('✅ Token is valid');
      return {
        isValid: true,
        token,
        userId: payload.userId,
        expiresAt: new Date(payload.exp * 1000),
        error: expiresSoon ? 'Token expires soon' : undefined
      };

    } catch (error) {
      console.log('❌ Token parsing failed:', error);
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
      
      const currentToken = localStorage.getItem('authToken');
      if (!currentToken) {
        console.error('❌ No current token to refresh');
        return null;
      }

      const response = await fetch('https://acchadam1-backend.onrender.com/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({ token: currentToken })
      });

      console.log(`📡 Token refresh response: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        const newToken = data.token;
        
        if (newToken) {
          // Store new token
          localStorage.setItem('authToken', newToken);
          console.log('✅ Token refreshed successfully');
          return newToken;
        } else {
          console.error('❌ No token in refresh response');
          return null;
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Token refresh failed:', response.status, errorText);
        
        // If refresh fails, clear auth and redirect to login
        if (response.status === 401 || response.status === 400) {
          console.log('🔄 Refresh failed with auth error, clearing auth data...');
          this.clearAuth();
          window.location.href = '/login';
        }
        
        return null;
      }
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      
      // Network error - queue for retry
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.log('🔄 Network error during refresh, will retry later...');
        await this.queueRefreshForRetry();
      }
      
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

  // Queue data for retry when network is back
  async queueDataForRetry(url: string, options: RequestInit): Promise<void> {
    const queueItem = {
      url,
      options,
      timestamp: Date.now()
    };
    
    this.retryQueue.push(queueItem);
    console.log(`📦 Queued request for retry: ${url}`);
    
    // Store in localStorage for persistence
    localStorage.setItem('retryQueue', JSON.stringify(this.retryQueue));
  }

  // Queue refresh for retry
  async queueRefreshForRetry(): Promise<void> {
    console.log('📦 Queuing token refresh for retry...');
    // Store refresh request in localStorage
    localStorage.setItem('pendingRefresh', 'true');
  }

  // Process retry queue when online
  async processRetryQueue(): Promise<void> {
    if (!this.isOnline) {
      console.log('📡 Offline, skipping retry queue processing');
      return;
    }

    if (this.retryQueue.length === 0) {
      return;
    }

    console.log(`🔄 Processing ${this.retryQueue.length} queued requests...`);

    const successfulRetries: number[] = [];
    
    for (let i = 0; i < this.retryQueue.length; i++) {
      const item = this.retryQueue[i];
      
      try {
        const response = await this.authenticatedFetch(item.url, item.options);
        if (response.ok) {
          successfulRetries.push(i);
          console.log(`✅ Retry successful: ${item.url}`);
        }
      } catch (error) {
        console.error(`❌ Retry failed: ${item.url}`, error);
      }
    }

    // Remove successful retries
    this.retryQueue = this.retryQueue.filter((_, index) => !successfulRetries.includes(index));
    
    // Update localStorage
    localStorage.setItem('retryQueue', JSON.stringify(this.retryQueue));
    
    console.log(`✅ Processed retry queue. ${successfulRetries.length} successful, ${this.retryQueue.length} remaining`);
  }

  // Check for pending refresh
  async checkPendingRefresh(): Promise<void> {
    const pendingRefresh = localStorage.getItem('pendingRefresh');
    if (pendingRefresh === 'true') {
      console.log('🔄 Found pending refresh, attempting...');
      localStorage.removeItem('pendingRefresh');
      await this.refreshTokenIfNeeded();
    }
  }

  // Initialize network recovery
  initializeNetworkRecovery(): void {
    // Listen for online/offline events
    window.addEventListener('online', async () => {
      console.log('📡 Network back online, processing retry queue...');
      this.isOnline = true;
      await this.checkPendingRefresh();
      await this.processRetryQueue();
    });

    window.addEventListener('offline', () => {
      console.log('📡 Network offline, queuing requests...');
      this.isOnline = false;
    });

    // Load existing retry queue
    const storedQueue = localStorage.getItem('retryQueue');
    if (storedQueue) {
      try {
        this.retryQueue = JSON.parse(storedQueue);
        console.log(`📦 Loaded ${this.retryQueue.length} queued requests`);
      } catch (error) {
        console.error('❌ Failed to load retry queue:', error);
        this.retryQueue = [];
      }
    }
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

// Initialize network recovery on app start
tokenService.initializeNetworkRecovery();

// Enhanced fetch with automatic token management
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  try {
    // Get valid token
    const token = await tokenService.getValidToken();
    
    if (!token) {
      console.error('❌ No valid authentication token available');
      // Auto-logout when no token available
      tokenService.clearAuth();
      window.location.href = '/login';
      throw new Error('No valid authentication token available');
    }

    // DEBUG: Log token details
    console.log('🔑 Token being sent:', token.substring(0, 20) + '...');
    console.log('🔑 Token length:', token.length);
    
    // Validate token format before sending
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.error('❌ Invalid token format detected');
      tokenService.clearAuth();
      window.location.href = '/login';
      throw new Error('Invalid token format');
    }

    // Add authorization header
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    // DEBUG: Log authorization header
    console.log('🔑 Authorization header:', `Bearer ${token.substring(0, 20)}...`);
    console.log(`🌐 Making authenticated request to: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers
    });

    // If 401, try to refresh token and retry once
    if (response.status === 401) {
      console.log('🔄 401 received, attempting token refresh...');
      
      // DEBUG: Log response details
      try {
        const errorText = await response.text();
        console.log('🔍 401 Response body:', errorText);
      } catch (e) {
        console.log('🔍 401 Response: Could not read response body');
      }
      
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
      } else {
        console.error('❌ Token refresh failed, auto-logout...');
        tokenService.clearAuth();
        window.location.href = '/login';
        return response;
      }
    }

    return response;
  } catch (error) {
    console.error('❌ Network error in authenticatedFetch:', error);
    
    // Network error - queue for retry
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.log('🔄 Network error, queuing request for retry...');
      await tokenService.queueDataForRetry(url, options);
    }
    
    throw error;
  }
};

export default tokenService;
