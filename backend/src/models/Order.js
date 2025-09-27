const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Basic Information
  orderId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CropListing',
    required: true,
    index: true
  },
  
  // Order Details
  orderDetails: {
    cropName: { type: String, required: true },
    variety: { type: String },
    quality: { type: String },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    pricePerUnit: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'INR' }
  },
  
  // Delivery Information
  delivery: {
    type: { 
      type: String, 
      enum: ['pickup', 'delivery', 'both'],
      required: true
    },
    pickupAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number }
      },
      contactPerson: { type: String },
      contactPhone: { type: String }
    },
    deliveryAddress: {
      address: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number }
      },
      contactPerson: { type: String },
      contactPhone: { type: String },
      deliveryInstructions: { type: String }
    },
    deliveryDate: { type: Date },
    deliveryTime: { type: String },
    deliveryCharges: { type: Number, default: 0 },
    estimatedDeliveryDate: { type: Date }
  },
  
  // Payment Information
  payment: {
    method: { 
      type: String, 
      enum: ['cash', 'bank_transfer', 'upi', 'credit_card', 'debit_card', 'wallet'],
      required: true
    },
    status: { 
      type: String, 
      enum: ['pending', 'paid', 'failed', 'refunded', 'disputed'],
      default: 'pending'
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    transactionId: { type: String },
    paymentDate: { type: Date },
    refundAmount: { type: Number, default: 0 },
    refundDate: { type: Date }
  },
  
  // Order Status
  status: {
    current: { 
      type: String, 
      enum: ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'in_transit', 'delivered', 'cancelled', 'returned'],
      default: 'pending'
    },
    history: [{
      status: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      note: { type: String },
      updatedBy: { type: String } // 'buyer', 'farmer', 'admin', 'system'
    }]
  },
  
  // Communication
  messages: [{
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderType: { type: String, enum: ['buyer', 'farmer', 'admin'] },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
  }],
  
  // Reviews & Ratings
  reviews: {
    buyerReview: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      createdAt: { type: Date }
    },
    farmerReview: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      createdAt: { type: Date }
    }
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date },
  cancelledAt: { type: Date }
}, {
  timestamps: true,
  collection: 'orders'
});

// Indexes
orderSchema.index({ buyerId: 1 });
orderSchema.index({ farmerId: 1 });
orderSchema.index({ listingId: 1 });
orderSchema.index({ 'status.current': 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'delivery.deliveryDate': 1 });

// Check if model already exists to prevent overwrite error
module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);

