const mongoose = require('mongoose');

const farmerKYCSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  farmerKYCId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // PAN Card Details
  panNumber: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  },
  panCardImage: {
    type: String, // Base64 encoded image
    required: false
  },

  // Aadhaar Card Details
  aadharNumber: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{12}$/
  },
  aadharFrontImage: {
    type: String, // Base64 encoded image
    required: false
  },
  aadharBackImage: {
    type: String, // Base64 encoded image
    required: false
  },

  // Bank Account Details
  accountHolderName: {
    type: String,
    required: true,
    trim: true
  },
  bankAccountNumber: {
    type: String,
    required: true,
    trim: true
  },
  ifscCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    match: /^[A-Z]{4}0[A-Z0-9]{6}$/
  },
  bankName: {
    type: String,
    trim: true
  },
  branchName: {
    type: String,
    trim: true
  },

  // UPI Details
  upiId: {
    type: String,
    trim: true,
    lowercase: true
  },

  // Verification Status
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },

  // Rejection/Notes
  rejectionReason: {
    type: String,
    trim: true
  },
  adminNotes: {
    type: String,
    trim: true
  },

  // Verification Details
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },

  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
farmerKYCSchema.index({ farmerId: 1, verificationStatus: 1 });

// Method to check if KYC is verified
farmerKYCSchema.methods.isVerified = function() {
  return this.verificationStatus === 'verified';
};

const FarmerKYC = mongoose.model('FarmerKYC', farmerKYCSchema);

module.exports = FarmerKYC;
