const { z } = require('zod');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Environment variable validation schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  
  // Database URLs
  POSTGRESQL_URL: z.string().url('Invalid PostgreSQL connection string'),
  MONGODB_URL: z.string().url('Invalid MongoDB connection string'),
  
  // JWT Configuration
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  // Redis Configuration
  REDIS_URL: z.string().url('Invalid Redis connection string').optional(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  
  // AWS Configuration
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('ap-south-1'),
  AWS_S3_BUCKET: z.string().optional(),
  
  // External APIs
  WEATHER_API_KEY: z.string().optional(),
  SMS_API_KEY: z.string().optional(),
  EMAIL_API_KEY: z.string().optional(),
  
  // Security
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  
  // Feature Flags
  ENABLE_AI_FEATURES: z.string().transform(val => val === 'true').default('true'),
  ENABLE_REAL_TIME: z.string().transform(val => val === 'true').default('true'),
  ENABLE_PAYMENT_GATEWAY: z.string().transform(val => val === 'true').default('true'),
});

// Validate environment variables
const env = envSchema.parse(process.env);

// Export validated environment configuration
const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  
  // Database
  postgresql: {
    url: env.POSTGRESQL_URL,
  },
  mongodb: {
    url: env.MONGODB_URL,
  },
  
  // JWT
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  
  // Redis
  redis: {
    url: env.REDIS_URL,
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
  },
  
  // AWS
  aws: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.AWS_REGION,
    s3Bucket: env.AWS_S3_BUCKET,
  },
  
  // External APIs
  external: {
    weatherApiKey: env.WEATHER_API_KEY,
    smsApiKey: env.SMS_API_KEY,
    emailApiKey: env.EMAIL_API_KEY,
  },
  
  // Security
  security: {
    corsOrigin: env.CORS_ORIGIN,
    rateLimit: {
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    },
  },
  
  // Logging
  logging: {
    level: env.LOG_LEVEL,
  },
  
  // Features
  features: {
    ai: env.ENABLE_AI_FEATURES,
    realTime: env.ENABLE_REAL_TIME,
    paymentGateway: env.ENABLE_PAYMENT_GATEWAY,
  },
} as const;

module.exports = config;

