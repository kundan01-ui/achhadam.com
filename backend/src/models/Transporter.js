const mongoose = require('mongoose');

const transporterSchema = new mongoose.Schema({
  // Reference to User
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Transporter Specific Information
  transporterProfile: {
    companyName: { type: String, required: true, trim: true },
    businessType: { 
      type: String, 
      enum: ['individual', 'company', 'cooperative', 'fleet_owner'],
      default: 'individual'
    },
    experience: { type: Number }, // in years
    serviceAreas: [{ 
      state: { type: String },
      cities: [{ type: String }],
      pincodes: [{ type: String }]
    }],
    specializations: [{ 
      type: String, 
      enum: ['perishable', 'non_perishable', 'refrigerated', 'bulk', 'fragile']
    }]
  },
  
  // Vehicle Information
  vehicles: [{
    vehicleId: { type: String, unique: true },
    vehicleType: { 
      type: String, 
      enum: ['truck', 'van', 'pickup', 'tractor', 'bike', 'cycle'],
      required: true
    },
    make: { type: String },
    model: { type: String },
    year: { type: Number },
    capacity: { type: Number }, // in kg
    registrationNumber: { type: String, required: true },
    insuranceNumber: { type: String },
    insuranceExpiry: { type: Date },
    fitnessCertificate: { type: String },
    fitnessExpiry: { type: Date },
    isActive: { type: Boolean, default: true },
    currentLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String },
      lastUpdated: { type: Date }
    }
  }],
  
  // Driver Information
  drivers: [{
    driverId: { type: String },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    licenseExpiry: { type: Date },
    experience: { type: Number }, // in years
    isActive: { type: Boolean, default: true }
  }],
  
  // Service Details
  services: {
    deliveryTypes: [{ 
      type: String, 
      enum: ['same_day', 'next_day', 'scheduled', 'express', 'standard']
    }],
    pricing: {
      baseRate: { type: Number }, // per km
      minimumCharge: { type: Number },
      weightCharges: [{
        minWeight: { type: Number },
        maxWeight: { type: Number },
        ratePerKg: { type: Number }
      }],
      distanceCharges: [{
        minDistance: { type: Number },
        maxDistance: { type: Number },
        ratePerKm: { type: Number }
      }]
    },
    workingHours: {
      startTime: { type: String },
      endTime: { type: String },
      workingDays: [{ type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }]
    }
  },
  
  // Orders & Deliveries
  deliveries: [{
    deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pickupAddress: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    distance: { type: Number }, // in km
    estimatedTime: { type: Number }, // in hours
    actualTime: { type: Number }, // in hours
    status: { 
      type: String, 
      enum: ['assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
      default: 'assigned'
    },
    assignedAt: { type: Date, default: Date.now },
    pickedUpAt: { type: Date },
    deliveredAt: { type: Date },
    charges: { type: Number },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'paid', 'disputed'],
      default: 'pending'
    }
  }],
  
  // Financial Records
  financials: {
    totalDeliveries: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    averageDeliveryValue: { type: Number, default: 0 },
    monthlyEarnings: [{
      month: { type: String },
      year: { type: Number },
      earnings: { type: Number, default: 0 },
      deliveries: { type: Number, default: 0 }
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
      deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  
  // Availability & Status
  availability: {
    isOnline: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    currentLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String },
      lastUpdated: { type: Date }
    },
    workingStatus: { 
      type: String, 
      enum: ['available', 'busy', 'offline', 'maintenance'],
      default: 'available'
    }
  },
  
  // Activity Tracking
  activity: {
    totalDeliveries: { type: Number, default: 0 },
    activeDeliveries: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    lastDeliveryDate: { type: Date },
    profileViews: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 } // in minutes
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'transporters'
});

// Indexes
transporterSchema.index({ userId: 1 });
transporterSchema.index({ 'serviceAreas.state': 1 });
transporterSchema.index({ 'serviceAreas.cities': 1 });
transporterSchema.index({ 'availability.isAvailable': 1 });
transporterSchema.index({ 'ratings.averageRating': -1 });
transporterSchema.index({ 'activity.totalEarnings': -1 });

// Check if model already exists to prevent overwrite error
module.exports = mongoose.models.Transporter || mongoose.model('Transporter', transporterSchema);

