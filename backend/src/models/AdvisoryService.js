const mongoose = require('mongoose');

const advisoryServiceSchema = new mongoose.Schema({
  // Service Request Details
  consultationId: {
    type: String,
    required: true,
    unique: true,
    default: () => 'ADV_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
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

  // Consultation Type
  consultationType: {
    type: String,
    enum: [
      'crop_selection',
      'soil_management',
      'pest_disease_diagnosis',
      'irrigation_planning',
      'fertilizer_recommendation',
      'organic_farming',
      'crop_insurance',
      'market_linkage',
      'government_schemes',
      'farm_mechanization',
      'general_query'
    ],
    required: true
  },

  // Farm Details
  farmDetails: {
    farmSize: Number, // in acres
    location: {
      address: String,
      city: String,
      state: String,
      pincode: String
    },
    soilType: String,
    waterSource: String,
    currentCrop: String,
    cropStage: String,
    previousCrops: [String]
  },

  // Problem Description
  problemDetails: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    symptoms: [String],
    duration: String, // How long has the issue persisted
    affectedArea: String, // percentage or acres
    previousAttempts: String, // What farmer already tried
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency']
    }
  },

  // Supporting Media
  media: {
    photos: [String], // URLs of uploaded photos
    videos: [String], // URLs of uploaded videos
    documents: [String] // Soil test reports, etc.
  },

  // Expert Assignment
  expertAssigned: {
    expertId: mongoose.Schema.Types.ObjectId,
    expertName: String,
    expertPhone: String,
    expertise: [String],
    experience: Number, // years
    assignedAt: Date
  },

  // Consultation Mode
  consultationMode: {
    type: String,
    enum: ['phone_call', 'video_call', 'field_visit', 'chat', 'email'],
    required: true
  },

  // Scheduling
  schedule: {
    requestedDate: Date,
    requestedTimeSlot: {
      type: String,
      enum: ['morning_9_12', 'afternoon_12_4', 'evening_4_7', 'anytime']
    },
    scheduledDate: Date,
    scheduledTime: String,
    duration: Number, // in minutes
    actualDate: Date,
    actualDuration: Number
  },

  // Consultation Details
  consultation: {
    diagnosis: String,
    recommendations: [{
      category: String,
      recommendation: String,
      priority: {
        type: String,
        enum: ['immediate', 'within_week', 'within_month', 'optional']
      },
      estimatedCost: Number
    }],

    // Detailed Advice
    cropAdvice: String,
    soilAdvice: String,
    waterAdvice: String,
    pestAdvice: String,
    fertilizerAdvice: String,

    // Product Recommendations
    recommendedProducts: [{
      productType: String,
      productName: String,
      brand: String,
      quantity: String,
      applicationMethod: String,
      timing: String
    }],

    // Follow-up Plan
    followUp: {
      required: Boolean,
      nextVisitDate: Date,
      monitoringFrequency: String,
      successMetrics: [String]
    }
  },

  // Expert Report
  expertReport: {
    reportUrl: String, // PDF URL
    reportDate: Date,
    keyFindings: [String],
    actionPlan: [String],
    expectedOutcome: String,
    estimatedTimeframe: String
  },

  // Status Tracking
  status: {
    type: String,
    enum: ['requested', 'assigned', 'scheduled', 'in_progress', 'completed', 'follow_up_required', 'closed', 'cancelled'],
    default: 'requested'
  },

  // Farmer Feedback
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    expertRating: {
      type: Number,
      min: 1,
      max: 5
    },
    serviceRating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    wouldRecommend: Boolean,
    submittedAt: Date
  },

  // Implementation Tracking
  implementation: {
    started: Boolean,
    startDate: Date,
    updates: [{
      date: Date,
      action: String,
      result: String,
      photos: [String]
    }],
    completed: Boolean,
    completionDate: Date,
    outcome: {
      type: String,
      enum: ['successful', 'partially_successful', 'unsuccessful', 'ongoing']
    },
    yieldImprovement: Number, // percentage
    costSaved: Number
  },

  // Pricing
  pricing: {
    consultationFee: Number,
    fieldVisitCharges: Number,
    reportCharges: Number,
    travelCharges: Number,
    totalAmount: Number,
    subsidyApplicable: Boolean,
    subsidyAmount: Number,
    finalAmount: Number
  },

  // Payment Details
  payment: {
    paid: Boolean,
    paymentDate: Date,
    paymentMode: {
      type: String,
      enum: ['free', 'cash', 'online', 'credit']
    },
    transactionId: String
  },

  // Service History
  serviceHistory: [{
    date: Date,
    action: String,
    performedBy: String,
    notes: String
  }],

  // Related Services
  relatedServices: {
    iotServiceRecommended: Boolean,
    droneServiceRecommended: Boolean,
    seedServiceRecommended: Boolean,
    linkedServices: [String] // Service IDs
  },

  // Timestamps
  requestedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,

  // Notes
  farmerNotes: String,
  expertNotes: String,
  companyNotes: String
}, {
  timestamps: true
});

// Indexes
advisoryServiceSchema.index({ farmerId: 1, status: 1 });
advisoryServiceSchema.index({ consultationId: 1 });
advisoryServiceSchema.index({ 'schedule.scheduledDate': 1 });
advisoryServiceSchema.index({ 'expertAssigned.expertId': 1 });
advisoryServiceSchema.index({ consultationType: 1 });

module.exports = mongoose.model('AdvisoryService', advisoryServiceSchema);
