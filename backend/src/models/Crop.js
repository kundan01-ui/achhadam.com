const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  // Basic Information
  cropId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['cereals', 'pulses', 'vegetables', 'fruits', 'spices', 'oilseeds', 'fibers', 'medicinal', 'other'],
    index: true
  },
  variety: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  
  // Growing Information
  growingDetails: {
    season: [{ 
      type: String, 
      enum: ['kharif', 'rabi', 'zaid', 'year_round'] 
    }],
    plantingSeason: { type: String },
    harvestingSeason: { type: String },
    growingPeriod: { type: Number }, // in days
    waterRequirement: { 
      type: String, 
      enum: ['low', 'medium', 'high'] 
    },
    soilType: [{ 
      type: String, 
      enum: ['clay', 'sandy', 'loamy', 'silty', 'alluvial', 'black', 'red'] 
    }],
    climate: [{ 
      type: String, 
      enum: ['tropical', 'subtropical', 'temperate', 'arid', 'semi_arid'] 
    }]
  },
  
  // Nutritional Information
  nutrition: {
    calories: { type: Number },
    protein: { type: Number },
    carbohydrates: { type: Number },
    fiber: { type: Number },
    vitamins: [{ type: String }],
    minerals: [{ type: String }],
    healthBenefits: [{ type: String }]
  },
  
  // Market Information
  marketInfo: {
    averagePrice: { type: Number },
    priceRange: {
      min: { type: Number },
      max: { type: Number }
    },
    demandLevel: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'very_high'] 
    },
    seasonality: {
      peakSeason: { type: String },
      offSeason: { type: String }
    }
  },
  
  // Quality Standards
  qualityStandards: {
    gradeA: {
      description: { type: String },
      priceMultiplier: { type: Number, default: 1.2 }
    },
    gradeB: {
      description: { type: String },
      priceMultiplier: { type: Number, default: 1.0 }
    },
    gradeC: {
      description: { type: String },
      priceMultiplier: { type: Number, default: 0.8 }
    }
  },
  
  // Images
  images: [{
    url: { type: String, required: true },
    caption: { type: String },
    isPrimary: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'crops'
});

// Indexes
cropSchema.index({ name: 1 });
cropSchema.index({ category: 1 });
cropSchema.index({ 'growingDetails.season': 1 });
cropSchema.index({ 'marketInfo.demandLevel': 1 });

// Check if model already exists to prevent overwrite error
module.exports = mongoose.models.Crop || mongoose.model('Crop', cropSchema);

