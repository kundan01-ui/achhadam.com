const mongoose = require('mongoose');

const seedServiceSchema = new mongoose.Schema({
  // Order Details
  orderId: {
    type: String,
    required: true,
    unique: true,
    default: () => 'SEED_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
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

  // Delivery Address
  deliveryAddress: {
    farmName: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },

  // Order Items
  items: [{
    itemType: {
      type: String,
      enum: ['seed', 'fertilizer', 'pesticide', 'growth_regulator', 'micronutrient', 'bio_fertilizer'],
      required: true
    },

    // Product Details
    productName: { type: String, required: true },
    brand: String,
    variety: String, // For seeds
    cropType: String, // Wheat, Rice, etc.

    // Technical Details
    specifications: {
      purity: Number, // percentage
      germination: Number, // percentage
      moisture: Number, // percentage
      physicalPurity: Number,
      certification: String // Certified/Foundation/Breeder
    },

    // NPK for fertilizers
    npk: {
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number
    },

    // Quantity
    quantity: { type: Number, required: true },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton', 'litre', 'packet', 'bag'],
      required: true
    },

    // Pricing
    pricePerUnit: { type: Number, required: true },
    gst: Number,
    discount: Number,
    totalPrice: { type: Number, required: true },

    // Stock & Availability
    inStock: { type: Boolean, default: true },
    estimatedDelivery: Date
  }],

  // Farm Details (for recommendation)
  farmDetails: {
    farmSize: Number, // in acres
    soilType: String,
    irrigationType: {
      type: String,
      enum: ['rainfed', 'well', 'borewell', 'canal', 'drip', 'sprinkler']
    },
    previousCrop: String,
    sowingDate: Date,
    targetYield: Number
  },

  // Order Summary
  orderSummary: {
    subtotal: Number,
    totalGST: Number,
    totalDiscount: Number,
    deliveryCharges: Number,
    finalAmount: { type: Number, required: true }
  },

  // Partner Agri-Input Company
  supplierCompany: {
    companyName: String,
    dealerName: String,
    dealerPhone: String,
    dealerAddress: String,
    gstNumber: String,
    license: String
  },

  // Delivery Details
  delivery: {
    deliveryType: {
      type: String,
      enum: ['home_delivery', 'dealer_pickup', 'warehouse_pickup']
    },
    preferredDate: Date,
    preferredTimeSlot: {
      type: String,
      enum: ['morning_9_12', 'afternoon_12_4', 'evening_4_7', 'anytime']
    },
    actualDeliveryDate: Date,
    deliveryPerson: String,
    deliveryPersonPhone: String,
    vehicleNumber: String,
    packagingCondition: {
      type: String,
      enum: ['excellent', 'good', 'damaged']
    },
    proofOfDelivery: String // Photo URL
  },

  // Payment Details
  payment: {
    paymentMode: {
      type: String,
      enum: ['cash_on_delivery', 'online', 'credit', 'subsidy', 'partial']
    },
    advanceAmount: Number,
    advancePaid: Boolean,
    advancePaymentDate: Date,
    balanceAmount: Number,
    balancePaid: Boolean,
    balancePaymentDate: Date,
    subsidyApplicable: Boolean,
    subsidyAmount: Number,
    subsidyStatus: {
      type: String,
      enum: ['pending', 'approved', 'disbursed']
    }
  },

  // Government Subsidy Details
  subsidy: {
    schemeN: String,
    subsidyPercentage: Number,
    subsidyAmount: Number,
    applicationNumber: String,
    applicationDate: Date,
    approvalDate: Date,
    disbursementDate: Date,
    bankAccount: {
      accountNumber: String,
      ifsc: String,
      bankName: String
    }
  },

  // Quality Check
  qualityCheck: {
    checkedByFarmer: Boolean,
    checkDate: Date,
    packagingIntact: Boolean,
    expiryDate: Date,
    batchNumber: String,
    manufacturingDate: Date,
    issues: String,
    photosUploaded: [String]
  },

  // Status Tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'packed', 'dispatched', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },

  // Invoice
  invoice: {
    invoiceNumber: String,
    invoiceDate: Date,
    invoiceUrl: String // PDF URL
  },

  // Recommendations & Upsell
  recommendations: [{
    productName: String,
    reason: String,
    benefit: String
  }],

  // Service History
  orderHistory: [{
    date: Date,
    status: String,
    updatedBy: String,
    notes: String
  }],

  // Timestamps
  orderedAt: {
    type: Date,
    default: Date.now
  },
  deliveredAt: Date,

  // Notes
  farmerNotes: String,
  companyNotes: String,
  dealerNotes: String
}, {
  timestamps: true
});

// Indexes
seedServiceSchema.index({ farmerId: 1, status: 1 });
seedServiceSchema.index({ orderId: 1 });
seedServiceSchema.index({ 'delivery.preferredDate': 1 });
seedServiceSchema.index({ 'deliveryAddress.pincode': 1 });

module.exports = mongoose.model('SeedService', seedServiceSchema);
