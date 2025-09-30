/**
 * Input Validation Middleware using Zod
 * Provides comprehensive request validation
 */

const { z } = require('zod');
const logger = require('../utils/logger');

// Phone number validation (Indian format)
const phoneSchema = z.string()
  .regex(/^[6-9]\d{9}$/, 'Invalid phone number format. Must be 10 digits starting with 6-9');

// Password validation
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Email validation
const emailSchema = z.string()
  .email('Invalid email format')
  .toLowerCase();

// User Type validation
const userTypeSchema = z.enum(['farmer', 'buyer', 'transporter', 'admin']);

// ObjectId validation (MongoDB)
const objectIdSchema = z.string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

/**
 * Validation Schemas for Different Endpoints
 */

// Signup validation
const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  phone: phoneSchema,
  password: passwordSchema,
  userType: userTypeSchema,
  email: emailSchema.optional(),
  // Farmer-specific fields
  farmName: z.string().min(2).max(100).optional(),
  farmSize: z.number().positive().optional(),
  farmSizeUnit: z.enum(['acre', 'hectare', 'bigha']).optional(),
  village: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  mainCrops: z.array(z.string()).optional(),
  experience: z.string().optional(),
  // Buyer-specific fields
  businessName: z.string().min(2).max(100).optional(),
  businessType: z.string().max(50).optional(),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).optional(),
  preferredCrops: z.array(z.string()).optional(),
  paymentTerms: z.string().optional(),
  // Transporter-specific fields
  vehicleType: z.string().max(50).optional(),
  vehicleNumber: z.string().regex(/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/).optional(),
  vehicleCapacity: z.string().optional(),
  licenseNumber: z.string().optional(),
  preferredRoutes: z.array(z.string()).optional(),
});

// Login validation
const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, 'Password is required'),
});

// OTP validation
const otpSchema = z.object({
  phone: phoneSchema,
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

// Send OTP validation
const sendOTPSchema = z.object({
  phone: phoneSchema,
});

// Crop listing validation
const cropListingSchema = z.object({
  cropName: z.string().min(2).max(100),
  cropType: z.string().min(2).max(50),
  variety: z.string().max(50).optional(),
  quality: z.enum(['premium', 'good', 'average', 'fair', 'A', 'B', 'C', 'D']),
  organic: z.boolean().default(false),
  quantity: z.object({
    available: z.number().positive(),
    unit: z.enum(['kg', 'quintal', 'tonne', 'pieces', 'bags']),
    minimumOrder: z.number().positive().optional(),
  }),
  pricing: z.object({
    pricePerUnit: z.number().positive(),
    negotiable: z.boolean().default(true),
  }),
  location: z.object({
    farmAddress: z.string().min(10).max(200),
    city: z.string().min(2).max(50),
    state: z.string().min(2).max(50),
    pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
    coordinates: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    }),
  }),
  harvest: z.object({
    harvestDate: z.string().datetime(),
    storageMethod: z.enum(['cold_storage', 'warehouse', 'farm_storage', 'open_storage']).optional(),
  }),
  images: z.array(z.object({
    url: z.string().url(),
    caption: z.string().optional(),
  })).optional(),
});

// Order creation validation
const orderSchema = z.object({
  cropId: objectIdSchema,
  farmerId: objectIdSchema,
  quantity: z.number().positive(),
  pricePerUnit: z.number().positive(),
  totalAmount: z.number().positive(),
  deliveryAddress: z.object({
    street: z.string().min(10),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().regex(/^\d{6}$/),
  }),
  paymentMethod: z.enum(['cod', 'online', 'razorpay']),
});

// Cart item validation
const cartItemSchema = z.object({
  cropId: objectIdSchema,
  quantity: z.number().positive().int(),
  pricePerUnit: z.number().positive(),
});

// Password reset validation
const resetPasswordSchema = z.object({
  resetToken: z.string().min(1),
  newPassword: passwordSchema,
});

/**
 * Validation Middleware Factory
 * Creates middleware that validates request body against a schema
 */
const validate = (schema) => {
  return async (req, res, next) => {
    try {
      // Validate request body
      const validated = await schema.parseAsync(req.body);

      // Replace request body with validated data
      req.body = validated;

      // Log validation success
      logger.api.debug('Validation successful', {
        endpoint: req.path,
        method: req.method,
      });

      next();
    } catch (error) {
      // Log validation failure
      logger.security.warn('Validation failed', {
        endpoint: req.path,
        method: req.method,
        errors: error.errors,
        ip: req.ip,
      });

      // Return validation errors
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
  };
};

/**
 * Sanitization Middleware
 * Removes potentially dangerous characters
 */
const sanitize = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    // Remove null bytes and dangerous characters
    return str.replace(/\0/g, '').trim();
  };

  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;

    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'string') {
          sanitized[key] = sanitizeString(obj[key]);
        } else if (typeof obj[key] === 'object') {
          sanitized[key] = sanitizeObject(obj[key]);
        } else {
          sanitized[key] = obj[key];
        }
      }
    }
    return sanitized;
  };

  // Sanitize body, query, and params
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);

  next();
};

/**
 * Export validation middleware and schemas
 */
module.exports = {
  validate,
  sanitize,
  schemas: {
    signup: signupSchema,
    login: loginSchema,
    otp: otpSchema,
    sendOTP: sendOTPSchema,
    cropListing: cropListingSchema,
    order: orderSchema,
    cartItem: cartItemSchema,
    resetPassword: resetPasswordSchema,
  },
  customSchemas: {
    phone: phoneSchema,
    password: passwordSchema,
    email: emailSchema,
    userType: userTypeSchema,
    objectId: objectIdSchema,
  },
};