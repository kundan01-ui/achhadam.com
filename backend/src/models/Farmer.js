const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  // Reference to User
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Farmer Specific Information
  farmerProfile: {
    farmName: { type: String, required: true, trim: true },
    farmSize: { type: Number }, // in acres
    farmingExperience: { type: Number }, // in years
    primaryCrops: [{ type: String }],
    farmingType: { 
      type: String, 
      enum: ['organic', 'conventional', 'mixed', 'traditional'],
      default: 'conventional'
    },
    certification: [{
      type: { type: String, enum: ['organic', 'fair_trade', 'rainforest_alliance', 'other'] },
      certificateNumber: { type: String },
      issuedBy: { type: String },
      validFrom: { type: Date },
      validUntil: { type: Date },
      certificateImage: { type: String }
    }]
  },
  
  // Farm Location
  farmLocation: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    landType: { 
      type: String, 
      enum: ['irrigated', 'rainfed', 'mixed'],
      default: 'mixed'
    }
  },
  
  // Bank Details
  bankDetails: {
    accountHolderName: { type: String },
    accountNumber: { type: String },
    bankName: { type: String },
    ifscCode: { type: String },
    branchName: { type: String },
    accountType: { type: String, enum: ['savings', 'current'] },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date }
  },
  
  // Crop Management
  crops: [{
    cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
    cropName: { type: String, required: true },
    variety: { type: String },
    plantingDate: { type: Date },
    expectedHarvestDate: { type: Date },
    actualHarvestDate: { type: Date },
    quantity: { type: Number }, // in kg/tonnes
    quality: { type: String, enum: ['premium', 'good', 'average', 'poor'] },
    pricePerUnit: { type: Number },
    status: { 
      type: String, 
      enum: ['planted', 'growing', 'ready_for_harvest', 'harvested', 'sold'],
      default: 'planted'
    }
  }],
  
  // Listing Management
  listings: [{
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'CropListing' },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, enum: ['kg', 'quintal', 'tonne'], default: 'kg' },
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'sold', 'expired'],
      default: 'active'
    },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
  }],
  
  // Orders & Sales
  orders: [{
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cropName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date }
  }],
  
  // Financial Records
  financials: {
    totalSales: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 },
    monthlyEarnings: [{
      month: { type: String },
      year: { type: Number },
      earnings: { type: Number, default: 0 },
      orders: { type: Number, default: 0 }
    }],
    paymentMethods: [{
      type: { type: String, enum: ['bank_transfer', 'upi', 'cash', 'cheque'] },
      details: { type: String },
      isDefault: { type: Boolean, default: false }
    }]
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
    totalListings: { type: Number, default: 0 },
    activeListings: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    lastListingDate: { type: Date },
    lastSaleDate: { type: Date },
    profileViews: { type: Number, default: 0 },
    listingViews: { type: Number, default: 0 }
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'farmers'
});

// Indexes
farmerSchema.index({ userId: 1 });
farmerSchema.index({ 'farmLocation.state': 1 });
farmerSchema.index({ 'farmLocation.city': 1 });
farmerSchema.index({ 'ratings.averageRating': -1 });
farmerSchema.index({ 'activity.totalSales': -1 });

// Check if model already exists to prevent overwrite error
module.exports = mongoose.models.Farmer || mongoose.model('Farmer', farmerSchema);

