const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  // Basic Information
  activityId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Activity Details
  activityType: {
    type: String,
    required: true,
    enum: [
      'login', 'logout', 'profile_update', 'kyc_submission', 'kyc_approval',
      'listing_created', 'listing_updated', 'listing_deleted', 'listing_viewed',
      'order_placed', 'order_confirmed', 'order_cancelled', 'order_delivered',
      'payment_made', 'payment_failed', 'payment_refunded',
      'review_given', 'review_received', 'rating_given', 'rating_received',
      'search_performed', 'filter_applied', 'wishlist_added', 'favorite_added',
      'message_sent', 'message_received', 'notification_sent', 'notification_received',
      'profile_viewed', 'contact_made', 'inquiry_sent', 'inquiry_received'
    ],
    index: true
  },
  
  // Activity Data
  activityData: {
    description: { type: String, required: true },
    metadata: {
      // For listing activities
      listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'CropListing' },
      cropName: { type: String },
      
      // For order activities
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
      orderAmount: { type: Number },
      
      // For payment activities
      paymentId: { type: String },
      paymentAmount: { type: Number },
      paymentMethod: { type: String },
      
      // For review activities
      reviewId: { type: String },
      rating: { type: Number },
      
      // For search activities
      searchQuery: { type: String },
      searchFilters: { type: Object },
      searchResults: { type: Number },
      
      // For communication activities
      messageId: { type: String },
      recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      
      // For profile activities
      profileViewed: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      
      // For location activities
      location: {
        latitude: { type: Number },
        longitude: { type: Number },
        address: { type: String }
      },
      
      // For device activities
      deviceInfo: {
        userAgent: { type: String },
        ipAddress: { type: String },
        deviceType: { type: String },
        browser: { type: String },
        os: { type: String }
      }
    }
  },
  
  // Activity Context
  context: {
    sessionId: { type: String },
    requestId: { type: String },
    source: { 
      type: String, 
      enum: ['web', 'mobile_app', 'api', 'admin_panel'],
      default: 'web'
    },
    referrer: { type: String },
    campaign: { type: String }
  },
  
  // Timestamps
  timestamp: { type: Date, default: Date.now, index: true },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'activities'
});

// Indexes
activitySchema.index({ userId: 1, timestamp: -1 });
activitySchema.index({ activityType: 1, timestamp: -1 });
activitySchema.index({ 'activityData.metadata.listingId': 1 });
activitySchema.index({ 'activityData.metadata.orderId': 1 });
activitySchema.index({ timestamp: -1 });

// Check if model already exists to prevent overwrite error
module.exports = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

