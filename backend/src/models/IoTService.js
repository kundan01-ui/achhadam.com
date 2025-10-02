const mongoose = require('mongoose');

const iotServiceSchema = new mongoose.Schema({
  // Service Request Details
  serviceId: {
    type: String,
    required: true,
    unique: true,
    default: () => 'IOT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
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
    soilType: {
      type: String,
      enum: ['clay', 'sandy', 'loamy', 'black', 'red', 'alluvial', 'other']
    },
    cropTypes: [String] // Multiple crops
  },

  // IoT Service Selection
  serviceType: {
    type: String,
    enum: ['soil_monitoring', 'weather_monitoring', 'irrigation_automation', 'pest_detection', 'complete_farm_monitoring'],
    required: true
  },

  // Sensor Requirements
  sensorRequirements: {
    soilMoisture: { type: Boolean, default: false },
    soilPH: { type: Boolean, default: false },
    soilNPK: { type: Boolean, default: false },
    temperature: { type: Boolean, default: false },
    humidity: { type: Boolean, default: false },
    rainfall: { type: Boolean, default: false },
    windSpeed: { type: Boolean, default: false },
    lightIntensity: { type: Boolean, default: false },
    pestCamera: { type: Boolean, default: false }
  },

  // Installation Details
  installationDetails: {
    numberOfSensors: Number,
    installationDate: Date,
    preferredTimeSlot: {
      type: String,
      enum: ['morning_8_12', 'afternoon_12_4', 'evening_4_7', 'anytime']
    },
    gatewayRequired: { type: Boolean, default: true },
    internetAvailable: { type: Boolean, default: false }
  },

  // Service Plan
  servicePlan: {
    planType: {
      type: String,
      enum: ['basic', 'standard', 'premium'],
      required: true
    },
    duration: {
      type: String,
      enum: ['3_months', '6_months', '1_year', '2_years'],
      required: true
    },
    monthlyFee: Number,
    totalAmount: Number,
    maintenanceIncluded: Boolean
  },

  // Partner Company
  partnerCompany: {
    companyName: String,
    contactPerson: String,
    contactPhone: String,
    assignedTechnician: String
  },

  // Status Tracking
  status: {
    type: String,
    enum: ['requested', 'approved', 'scheduled', 'installed', 'active', 'suspended', 'cancelled'],
    default: 'requested'
  },

  // IoT Data (After Installation)
  latestReadings: {
    soilMoisture: Number,
    soilPH: Number,
    soilNPK: {
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number
    },
    temperature: Number,
    humidity: Number,
    rainfall: Number,
    windSpeed: Number,
    lightIntensity: Number,
    lastUpdated: Date
  },

  // Alerts & Notifications
  alerts: [{
    alertType: String,
    message: String,
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    timestamp: Date,
    resolved: { type: Boolean, default: false }
  }],

  // Payment Details
  payment: {
    advancePayment: Number,
    advancePaid: { type: Boolean, default: false },
    advancePaymentDate: Date,
    installments: [{
      installmentNumber: Number,
      amount: Number,
      dueDate: Date,
      paidDate: Date,
      status: { type: String, enum: ['pending', 'paid', 'overdue'] }
    }]
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
  installedAt: Date,
  lastServiceDate: Date,

  // Notes
  farmerNotes: String,
  companyNotes: String
}, {
  timestamps: true
});

// Indexes
iotServiceSchema.index({ farmerId: 1, status: 1 });
iotServiceSchema.index({ serviceId: 1 });
iotServiceSchema.index({ 'farmDetails.location.city': 1 });

module.exports = mongoose.model('IoTService', iotServiceSchema);
