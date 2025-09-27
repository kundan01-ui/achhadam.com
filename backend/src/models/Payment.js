const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Basic Information
  paymentId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Payment Details
  paymentDetails: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    method: { 
      type: String, 
      enum: ['cash', 'bank_transfer', 'upi', 'credit_card', 'debit_card', 'wallet', 'cheque'],
      required: true
    },
    status: { 
      type: String, 
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
      default: 'pending'
    },
    gateway: { 
      type: String, 
      enum: ['razorpay', 'payu', 'paytm', 'phonepe', 'google_pay', 'bank_transfer', 'cash']
    },
    gatewayTransactionId: { type: String },
    gatewayResponse: { type: Object }
  },
  
  // Payment Method Details
  paymentMethod: {
    type: { type: String, required: true },
    details: {
      // For UPI
      upiId: { type: String },
      
      // For Cards
      cardNumber: { type: String },
      cardType: { type: String },
      cardHolderName: { type: String },
      expiryDate: { type: String },
      
      // For Bank Transfer
      bankName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      transactionReference: { type: String },
      
      // For Wallet
      walletProvider: { type: String },
      walletId: { type: String }
    }
  },
  
  // Transaction Timeline
  timeline: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
    gatewayResponse: { type: Object }
  }],
  
  // Refund Information
  refund: {
    isRefundable: { type: Boolean, default: true },
    refundAmount: { type: Number, default: 0 },
    refundReason: { type: String },
    refundStatus: { 
      type: String, 
      enum: ['none', 'requested', 'processing', 'completed', 'rejected'],
      default: 'none'
    },
    refundDate: { type: Date },
    refundTransactionId: { type: String }
  },
  
  // Fees & Charges
  fees: {
    gatewayFee: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    totalFees: { type: Number, default: 0 },
    netAmount: { type: Number, required: true }
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  failedAt: { type: Date }
}, {
  timestamps: true,
  collection: 'payments'
});

// Indexes
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ 'paymentDetails.status': 1 });
paymentSchema.index({ 'paymentDetails.method': 1 });
paymentSchema.index({ createdAt: -1 });

// Check if model already exists to prevent overwrite error
module.exports = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

