const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  buyerId: {
    type: String,
    required: true,
    index: true
  },
  cropId: {
    type: String,
    required: true
  },
  cropName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  farmerId: {
    type: String,
    required: true
  },
  farmerName: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  // PERMANENT PERSISTENCE MARKERS
  isPermanent: {
    type: Boolean,
    default: true
  },
  crossDeviceAccess: {
    type: Boolean,
    default: true
  },
  sessionIndependent: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  // Buyer association for permanent linking
  buyerAssociation: {
    buyerId: {
      type: String,
      required: true
    },
    buyerName: {
      type: String,
      required: true
    },
    permanentLink: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
cartSchema.index({ buyerId: 1, isPermanent: 1, crossDeviceAccess: 1 });
cartSchema.index({ buyerId: 1, addedAt: -1 });

module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

