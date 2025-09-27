const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Basic Information
  notificationId: {
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
  
  // Notification Details
  notificationDetails: {
    title: { type: String, required: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 1000 },
    type: { 
      type: String, 
      enum: [
        'info', 'success', 'warning', 'error', 'promotion',
        'order_update', 'payment_update', 'kyc_update',
        'new_listing', 'price_drop', 'new_message',
        'system_announcement', 'reminder'
      ],
      required: true,
      index: true
    },
    category: { 
      type: String, 
      enum: ['order', 'payment', 'kyc', 'listing', 'message', 'system', 'promotion'],
      required: true
    },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    }
  },
  
  // Content & Media
  content: {
    text: { type: String },
    html: { type: String },
    imageUrl: { type: String },
    actionUrl: { type: String },
    actionText: { type: String },
    deepLink: { type: String }
  },
  
  // Delivery Channels
  delivery: {
    channels: [{
      type: { 
        type: String, 
        enum: ['push', 'email', 'sms', 'in_app'],
        required: true
      },
      status: { 
        type: String, 
        enum: ['pending', 'sent', 'delivered', 'failed', 'bounced'],
        default: 'pending'
      },
      sentAt: { type: Date },
      deliveredAt: { type: Date },
      failureReason: { type: String }
    }],
    scheduledAt: { type: Date },
    expiresAt: { type: Date }
  },
  
  // Related Data
  relatedData: {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'CropListing' },
    paymentId: { type: String },
    messageId: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  // User Interaction
  interaction: {
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    isClicked: { type: Boolean, default: false },
    clickedAt: { type: Date },
    isDismissed: { type: Boolean, default: false },
    dismissedAt: { type: Date }
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'notifications'
});

// Indexes
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ 'notificationDetails.type': 1 });
notificationSchema.index({ 'notificationDetails.category': 1 });
notificationSchema.index({ 'interaction.isRead': 1 });
notificationSchema.index({ 'delivery.scheduledAt': 1 });
notificationSchema.index({ 'delivery.expiresAt': 1 });

// Check if model already exists to prevent overwrite error
module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

