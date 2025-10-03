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

// Auto-detect environment or use manual override
const API_BASE_URL = import.meta.env.VITE_API_URL ||
                     (isDevelopment ? DEVELOPMENT_URL : PRODUCTION_URL);

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

  // Timeouts (in milliseconds)
  timeout: {
    default: 15000,      // 15 seconds
    login: 60000,        // 60 seconds (for cold start)
    upload: 120000,      // 2 minutes (for image uploads)
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
};

export default apiConfig;
