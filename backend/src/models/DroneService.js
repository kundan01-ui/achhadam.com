const mongoose = require('mongoose');

const droneServiceSchema = new mongoose.Schema({
  // Service Request Details
  serviceId: {
    type: String,
    required: true,
    unique: true,
    default: () => 'DRONE_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  },

  // Farmer Information
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  farmerName: String,
  farmerPhone: String,

  // Farm Details
  farmDetails: {
    farmName: String,
    farmSize: Number, // in acres
    location: {
      address: String,
      city: String,
      state: String,
      pincode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    cropType: String,
    cropStage: {
      type: String,
      enum: ['sowing', 'germination', 'vegetative', 'flowering', 'fruiting', 'maturity']
    },
    terrainType: {
      type: String,
      enum: ['flat', 'hilly', 'undulating', 'terraced']
    }
  },

  // Service Type
  serviceType: {
    type: String,
    enum: ['pesticide_spray', 'fertilizer_spray', 'seed_sowing', 'crop_monitoring', 'soil_mapping'],
    required: true
  },

  // Spraying Details (for pesticide/fertilizer)
  sprayingDetails: {
    sprayMaterial: String, // Pesticide/Fertilizer name
    quantity: Number, // in liters/kg
    concentration: String, // dilution ratio
    tankMixes: [String], // Multiple chemicals
    targetPest: String, // For pesticide
    targetNutrient: String, // For fertilizer
    waterRequired: Number // liters
  },

  // Scheduling
  schedule: {
    preferredDate: Date,
    preferredTimeSlot: {
      type: String,
      enum: ['early_morning_5_8', 'morning_8_11', 'evening_4_7', 'anytime']
    },
    alternativeDate: Date,
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency']
    },
    weatherDependency: {
      type: Boolean,
      default: true
    }
  },

  // Service Execution Details
  execution: {
    scheduledDate: Date,
    actualDate: Date,
    startTime: Date,
    endTime: Date,
    areaCompleted: Number, // in acres
    flightTime: Number, // in minutes
    sprayRate: Number, // liters per acre
    windSpeed: Number,
    temperature: Number,
    humidity: Number,
    pilotName: String,
    droneId: String
  },

  // Partner Drone Company
  partnerCompany: {
    companyName: String,
    contactPerson: String,
    contactPhone: String,
    assignedPilot: String,
    droneModel: String,
    droneCapacity: Number // liters
  },

  // Pricing
  pricing: {
    ratePerAcre: Number,
    baseCharge: Number,
    materialCost: Number,
    travelCharges: Number,
    totalAmount: Number,
    gst: Number,
    finalAmount: Number
  },

  // Status Tracking
  status: {
    type: String,
    enum: ['requested', 'approved', 'scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled'],
    default: 'requested'
  },

  // Weather Conditions
  weatherCheck: {
    windSpeed: Number,
    rainfall: Number,
    temperature: Number,
    humidity: Number,
    weatherSuitable: Boolean,
    checkedAt: Date
  },

  // Safety & Compliance
  safety: {
    dgcaPermit: Boolean,
    insuranceCovered: Boolean,
    safetyBriefingDone: Boolean,
    boundaryMarkingDone: Boolean,
    nearbyObstacles: String
  },

  // Service Results
  results: {
    coverageQuality: {
      type: String,
      enum: ['excellent', 'good', 'average', 'poor']
    },
    uniformity: Number, // percentage
    driftObserved: Boolean,
    farmerSatisfaction: {
      type: Number,
      min: 1,
      max: 5
    },
    photos: [String], // URLs
    reportFile: String // PDF URL
  },

  // Follow-up
  followUp: {
    nextSprayDate: Date,
    nextSprayType: String,
    reminderSent: Boolean,
    repeatBooking: Boolean
  },

  // Payment Details
  payment: {
    advancePayment: Number,
    advancePaid: Boolean,
    advancePaymentDate: Date,
    balanceAmount: Number,
    balancePaid: Boolean,
    balancePaymentDate: Date,
    paymentMode: {
      type: String,
      enum: ['cash', 'upi', 'bank_transfer', 'card', 'credit']
    }
  },

  // Service History
  serviceHistory: [{
    date: Date,
    action: String,
    performedBy: String,
    notes: String
  }],

  // Timestamps
  requestedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,

  // Notes
  farmerNotes: String,
  companyNotes: String,
  pilotNotes: String
}, {
  timestamps: true
});

// Indexes
droneServiceSchema.index({ farmerId: 1, status: 1 });
droneServiceSchema.index({ serviceId: 1 });
droneServiceSchema.index({ 'schedule.preferredDate': 1 });
droneServiceSchema.index({ 'farmDetails.location.city': 1 });

module.exports = mongoose.model('DroneService', droneServiceSchema);
