const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
  // Reference to User
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Buyer Specific Information
  buyerProfile: {
    businessName: { type: String, trim: true },
    businessType: { 
      type: String, 
      enum: ['retailer', 'wholesaler', 'restaurant', 'hotel', 'processor', 'exporter', 'individual'],
      default: 'individual'
    },
    businessRegistration: {
      registrationNumber: { type: String },
      registrationType: { type: String, enum: ['gst', 'pan', 'trade_license', 'other'] },
      businessAddress: { type: String }
    },
    preferredCrops: [{ type: String }],
    buyingCapacity: {
      minQuantity: { type: Number, default: 0 },
      maxQuantity: { type: Number },
      preferredUnit: { type: String, enum: ['kg', 'quintal', 'tonne'], default: 'kg' }
    }
  },
  
  // Location & Delivery
  locations: [{
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    isDefault: { type: Boolean, default: false },
    deliveryInstructions: { type: String }
  }],
  
  // Payment Information
  paymentMethods: [{
    type: { type: String, enum: ['bank_transfer', 'upi', 'credit_card', 'debit_card', 'wallet', 'cash'] },
    details: { type: String },
    isDefault: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }
  }],
  
  // Orders & Purchases
  orders: [{
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cropName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending'
    },
    orderDate: { type: Date, default: Date.now },
    expectedDeliveryDate: { type: Date },
    actualDeliveryDate: { type: Date }
  }],
  
  // Wishlist & Favorites
  wishlist: [{
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'CropListing' },
    cropName: { type: String },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now }
  }],
  
  favoriteFarmers: [{
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now }
  }],
  
  // Search & Filter Preferences
  searchPreferences: {
    savedSearches: [{
      name: { type: String },
      filters: {
        crops: [{ type: String }],
        priceRange: {
          min: { type: Number },
          max: { type: Number }
        },
        location: {
          state: { type: String },
          city: { type: String },
          radius: { type: Number } // in km
        },
        quality: [{ type: String }]
      },
      createdAt: { type: Date, default: Date.now }
    }],
    notificationPreferences: {
      newListings: { type: Boolean, default: true },
      priceDrops: { type: Boolean, default: true },
      nearbyFarmers: { type: Boolean, default: false }
    }
  },
  
  // Financial Records
  financials: {
    totalPurchases: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 },
    monthlySpending: [{
      month: { type: String },
      year: { type: Number },
      amount: { type: Number, default: 0 },
      orders: { type: Number, default: 0 }
    }],
    creditLimit: { type: Number, default: 0 },
    creditUsed: { type: Number, default: 0 }
  },
  
  // Ratings & Reviews
  ratings: {
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    reviews: [{
      reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  
  // Activity Tracking
  activity: {
    totalOrders: { type: Number, default: 0 },
    activeOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastOrderDate: { type: Date },
    profileViews: { type: Number, default: 0 },
    searchCount: { type: Number, default: 0 }
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'buyers'
});

// Indexes
buyerSchema.index({ userId: 1 });
buyerSchema.index({ 'buyerProfile.businessType': 1 });
buyerSchema.index({ 'locations.city': 1 });
buyerSchema.index({ 'locations.state': 1 });
buyerSchema.index({ 'ratings.averageRating': -1 });
buyerSchema.index({ 'activity.totalSpent': -1 });

// Check if model already exists to prevent overwrite error
module.exports = mongoose.models.Buyer || mongoose.model('Buyer', buyerSchema);

