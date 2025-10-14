/**
 * Centralized API Configuration
 *
 * This file manages the API base URL for all services.
 * Switch between development (localhost) and production (Render) easily.
 */

// ========================================
// ENVIRONMENT DETECTION
// ========================================
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';
const isProduction = import.meta.env.PROD && window.location.hostname !== 'localhost';

// ========================================
// API BASE URLS
// ========================================
const DEVELOPMENT_URL = 'http://localhost:5000';
const PRODUCTION_URL = 'https://acchadam1-backend.onrender.com';

// Smart network detection for different devices
const getBackendURL = () => {
  // 1. Check if VITE_API_URL environment variable is set (highest priority)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // 2. Check if we're accessing via localhost/127.0.0.1 from SAME machine
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  // 3. Check if backend is accessible (for local development)
  if (isLocalhost && isDevelopment) {
    // Try to detect if backend is running locally
    return DEVELOPMENT_URL;
  }

  // 4. For all other cases (mobile, different laptop, production), use production URL
  console.log('🌐 Using production backend for better accessibility');
  return PRODUCTION_URL;
};

const API_BASE_URL = getBackendURL();

// ========================================
// LOGGING
// ========================================
console.log('🌐 API Configuration:');
console.log('  Environment:', isDevelopment ? 'Development' : 'Production');
console.log('  API Base URL:', API_BASE_URL);
console.log('  Hostname:', window.location.hostname);

// ========================================
// EXPORTS
// ========================================
export const apiConfig = {
  // Base URL for all API requests
  baseURL: API_BASE_URL,

  // Environment flags
  isDevelopment,
  isProduction,

  // Timeouts (in milliseconds) - increased for mobile compatibility
  timeout: {
    default: 30000,      // 30 seconds (increased for slow mobile networks)
    login: 90000,        // 90 seconds (for cold start + slow mobile)
    upload: 180000,      // 3 minutes (for image uploads on slow networks)
    otp: 45000,          // 45 seconds (for OTP requests)
  },

  // Helper function to build full URL
  buildURL: (endpoint: string) => {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${API_BASE_URL}/${cleanEndpoint}`;
  },

  // Helper function to get auth headers
  getAuthHeaders: (includeContentType = true) => {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Origin': window.location.origin,
    };

    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }

    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  },

  // Mobile-friendly fetch with retry logic
  fetchWithRetry: async (url: string, options: RequestInit = {}, maxRetries = 3) => {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(`📱 Attempt ${i + 1}/${maxRetries} - Fetching:`, url);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout.default);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            ...options.headers,
            // Add cache control for mobile
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        });

        clearTimeout(timeoutId);

        console.log(`✅ Request successful on attempt ${i + 1}`);
        return response;
      } catch (error: any) {
        lastError = error;
        console.warn(`⚠️ Attempt ${i + 1} failed:`, error.message);

        // Don't retry if it's an abort (timeout)
        if (error.name === 'AbortError') {
          console.error('❌ Request timeout - network too slow');
          if (i === maxRetries - 1) {
            throw new Error('Request timeout. Please check your internet connection.');
          }
        }

        // Wait before retrying (exponential backoff)
        if (i < maxRetries - 1) {
          const delay = Math.min(1000 * Math.pow(2, i), 5000); // Max 5 seconds
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    console.error('❌ All retry attempts failed');
    throw lastError || new Error('Network request failed');
  },
};

export default apiConfig;
