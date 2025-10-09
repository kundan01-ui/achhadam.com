const mongoose = require('mongoose');

const fcmTokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  userType: {
    type: String,
    enum: ['farmer', 'buyer', 'transporter', 'admin'],
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  deviceId: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ['web', 'android', 'ios'],
    default: 'web'
  },
  topics: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastUsed: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
fcmTokenSchema.index({ userId: 1, platform: 1 });
fcmTokenSchema.index({ token: 1 });
fcmTokenSchema.index({ isActive: 1 });

// Update lastUsed timestamp
fcmTokenSchema.methods.updateLastUsed = function() {
  this.lastUsed = new Date();
  return this.save();
};

// Deactivate token
fcmTokenSchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save();
};

// Add topic
fcmTokenSchema.methods.addTopic = function(topic) {
  if (!this.topics.includes(topic)) {
    this.topics.push(topic);
    return this.save();
  }
  return Promise.resolve(this);
};

// Remove topic
fcmTokenSchema.methods.removeTopic = function(topic) {
  this.topics = this.topics.filter(t => t !== topic);
  return this.save();
};

// Static method to find active tokens by user
fcmTokenSchema.statics.findActiveByUser = function(userId) {
  return this.find({ userId, isActive: true });
};

// Static method to find token by device
fcmTokenSchema.statics.findByDevice = function(userId, deviceId) {
  return this.findOne({ userId, deviceId, isActive: true });
};

const FCMToken = mongoose.model('FCMToken', fcmTokenSchema);

module.exports = FCMToken;
