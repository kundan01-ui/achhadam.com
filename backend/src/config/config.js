/**
 * Central Configuration Manager for ACHHADAM Backend
 * Loads and validates all environment variables
 */

require('dotenv').config();

const config = {
  // Server Configuration
  server: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5000,
    isDevelopment: process.env.NODE_ENV !== 'production',
    isProduction: process.env.NODE_ENV === 'production',
  },

  // Database Configuration
  database: {
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/achhadam',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'default-jwt-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRY || '365d', // Changed from 24h to 365 days
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRY || '365d', // Changed from 7d to 365 days
  },

  // Session Configuration
  session: {
    secret: process.env.SESSION_SECRET || 'default-session-secret-change-in-production',
    maxAge: 10 * 60 * 1000, // 10 minutes
    secure: process.env.NODE_ENV === 'production',
  },

  // Security Configuration
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
    helmetCSPEnabled: process.env.HELMET_CSP_ENABLED === 'true',
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 1000,
    otpWindowMs: parseInt(process.env.OTP_RATE_LIMIT_WINDOW_MS, 10) || 1 * 60 * 1000,
    otpMaxRequests: parseInt(process.env.OTP_RATE_LIMIT_MAX_REQUESTS, 10) || 10,
  },

  // CORS Configuration
  cors: {
    origins: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  },

  // Firebase Configuration
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || 'digital-farming-platform',
  },

  // Redis Configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  // Email Configuration
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'noreply@achhadam.com',
  },

  // Payment Gateway Configuration
  payment: {
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID || '',
      keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    }
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    dir: process.env.LOG_DIR || 'logs',
  },

  // Development Configuration
  development: {
    debugMode: process.env.DEBUG_MODE === 'true',
    mockOTPEnabled: process.env.MOCK_OTP_ENABLED === 'true',
  }
};

// Validate critical configuration
function validateConfig() {
  const errors = [];

  if (config.server.isProduction) {
    // Production validation
    if (config.jwt.secret === 'default-jwt-secret-change-in-production') {
      errors.push('JWT_SECRET must be set in production');
    }
    if (config.session.secret === 'default-session-secret-change-in-production') {
      errors.push('SESSION_SECRET must be set in production');
    }
    if (!config.database.mongoUri.includes('mongodb+srv://')) {
      errors.push('MONGODB_URI should use MongoDB Atlas in production');
    }
  }

  if (errors.length > 0) {
    console.error('❌ Configuration Validation Errors:');
    errors.forEach(error => console.error(`   - ${error}`));
    if (config.server.isProduction) {
      throw new Error('Invalid production configuration');
    } else {
      console.warn('⚠️  Warning: Using default values for development');
    }
  }
}

// Run validation
validateConfig();

module.exports = config;