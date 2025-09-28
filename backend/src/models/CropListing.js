const mongoose = require('mongoose');

const cropListingSchema = new mongoose.Schema({
  // Basic Information
  listingId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
    required: true,
    index: true
  },
  
  // Listing Details
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  
  // Crop Information - FIXED FOR FRONTEND COMPATIBILITY
  cropName: { type: String, required: true },
  cropType: { type: String, required: true },
  variety: { type: String },
  quality: { 
    type: String, 
    enum: ['premium', 'good', 'average', 'fair'],
    default: 'good'
  },
  organic: { type: Boolean, default: false },
  certification: [{
    type: { type: String, enum: ['organic', 'fair_trade', 'rainforest_alliance'] },
    certificateNumber: { type: String },
    validUntil: { type: Date }
  }],
  
  // Legacy cropDetails for backward compatibility
  cropDetails: {
    name: { type: String },
    variety: { type: String },
    category: { type: String },
    quality: { 
      type: String, 
      enum: ['premium', 'good', 'average', 'fair'],
      default: 'good'
    },
    grade: { 
      type: String, 
      enum: ['A', 'B', 'C'],
      default: 'B'
    },
    organic: { type: Boolean, default: false }
  },
  
  // Quantity & Pricing
  quantity: {
    available: { type: Number, required: true },
    unit: { 
      type: String, 
      enum: ['kg', 'quintal', 'tonne', 'pieces', 'bags'],
      default: 'kg'
    },
    minimumOrder: { type: Number, default: 1 },
    maximumOrder: { type: Number }
  },
  pricing: {
    pricePerUnit: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    negotiable: { type: Boolean, default: true },
    bulkDiscount: [{
      minQuantity: { type: Number },
      discountPercent: { type: Number }
    }]
  },
  
  // Location & Delivery
  location: {
    farmAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    deliveryRadius: { type: Number, default: 50 }, // in km
    deliveryOptions: [{
      type: { type: String, enum: ['pickup', 'delivery', 'both'] },
      charges: { type: Number, default: 0 },
      freeDeliveryAbove: { type: Number }
    }]
  },
  
  // Harvest Information
  harvest: {
    harvestDate: { type: Date, required: true },
    storageMethod: { 
      type: String, 
      enum: ['cold_storage', 'warehouse', 'farm_storage', 'open_storage'] 
    },
    shelfLife: { type: Number }, // in days
    packaging: {
      type: { type: String, enum: ['loose', 'packed', 'vacuum_sealed', 'modified_atmosphere'] },
      material: { type: String },
      weight: { type: Number }
    }
  },
  
  // Images & Media
  images: [{
    url: { type: String, required: true },
    caption: { type: String },
    isPrimary: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now }
  }],
  videos: [{
    url: { type: String },
    caption: { type: String },
    duration: { type: Number }, // in seconds
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Status & Visibility
  status: {
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    visibility: { 
      type: String, 
      enum: ['public', 'private', 'friends'],
      default: 'public'
    }
  },
  
  // Engagement Metrics
  engagement: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    orders: { type: Number, default: 0 }
  },
  
  // PERMANENT PERSISTENCE FIELDS - CROSS-DEVICE SYNC
  isPermanent: { type: Boolean, default: true },
  crossDeviceAccess: { type: Boolean, default: true },
  sessionIndependent: { type: Boolean, default: true },
  uploadedAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  
  // Farmer Association for Permanent Linking
  farmerAssociation: {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    farmerName: { type: String },
    permanentLink: { type: Boolean, default: true }
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
}, {
  timestamps: true,
  collection: 'crop_listings'
});

// Indexes
cropListingSchema.index({ farmerId: 1 });
cropListingSchema.index({ cropId: 1 });
cropListingSchema.index({ 'cropDetails.category': 1 });
cropListingSchema.index({ 'location.state': 1 });
cropListingSchema.index({ 'location.city': 1 });
cropListingSchema.index({ 'location.coordinates': '2dsphere' });
cropListingSchema.index({ 'status.isActive': 1 });
cropListingSchema.index({ 'pricing.pricePerUnit': 1 });
cropListingSchema.index({ createdAt: -1 });
cropListingSchema.index({ expiresAt: 1 });

// Check if model already exists to prevent overwrite error
module.exports = mongoose.models.CropListing || mongoose.model('CropListing', cropListingSchema);

