const mongoose = require('mongoose');

/**
 * Schema for storing user cookie preferences
 */
const cookiePreferenceSchema = new mongoose.Schema({
  // User identifier (could be userId if logged in, or a generated ID for anonymous users)
  userId: {
    type: String,
    required: true,
    index: true
  },
  
  // Cookie preferences
  necessary: {
    type: Boolean,
    default: true, // Always required
    required: true
  },
  
  analytics: {
    type: Boolean,
    default: false,
    required: true
  },
  
  marketing: {
    type: Boolean,
    default: false,
    required: true
  },
  
  personalization: {
    type: Boolean,
    default: false,
    required: true
  },
  
  // IP address (for audit purposes)
  ipAddress: {
    type: String
  },
  
  // User agent (for audit purposes)
  userAgent: {
    type: String
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
cookiePreferenceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create model
const CookiePreference = mongoose.model('CookiePreference', cookiePreferenceSchema);

module.exports = CookiePreference;
