const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  // Basic Information
  documentId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Document Details
  documentDetails: {
    name: { type: String, required: true, trim: true },
    type: { 
      type: String, 
      enum: [
        'kyc', 'pan_card', 'aadhar_card', 'driving_license', 'passport', 'voter_id',
        'bank_statement', 'income_certificate', 'address_proof', 'identity_proof',
        'crop_certificate', 'organic_certificate', 'quality_certificate',
        'business_license', 'gst_certificate', 'trade_license',
        'vehicle_registration', 'insurance_certificate', 'fitness_certificate',
        'profile_image', 'farm_image', 'crop_image', 'other'
      ],
      required: true,
      index: true
    },
    category: { 
      type: String, 
      enum: ['identity', 'address', 'income', 'business', 'vehicle', 'certificate', 'image', 'other'],
      required: true
    },
    description: { type: String, maxlength: 500 },
    fileSize: { type: Number }, // in bytes
    mimeType: { type: String },
    originalName: { type: String }
  },
  
  // File Information
  fileInfo: {
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    storageProvider: { 
      type: String, 
      enum: ['local', 'aws_s3', 'google_cloud', 'azure'],
      default: 'local'
    },
    bucket: { type: String },
    key: { type: String }
  },
  
  // Document Content (for text extraction)
  content: {
    extractedText: { type: String },
    ocrData: { type: Object },
    metadata: {
      pageCount: { type: Number },
      dimensions: {
        width: { type: Number },
        height: { type: Number }
      },
      colorSpace: { type: String },
      resolution: { type: Number }
    }
  },
  
  // Verification Status
  verification: {
    status: { 
      type: String, 
      enum: ['pending', 'under_review', 'verified', 'rejected', 'expired'],
      default: 'pending'
    },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },
    expiryDate: { type: Date },
    rejectionReason: { type: String },
    notes: { type: String }
  },
  
  // Document Data (extracted information)
  extractedData: {
    // For KYC documents
    panNumber: { type: String },
    aadharNumber: { type: String },
    name: { type: String },
    dateOfBirth: { type: Date },
    address: { type: String },
    
    // For vehicle documents
    registrationNumber: { type: String },
    vehicleType: { type: String },
    make: { type: String },
    model: { type: String },
    year: { type: Number },
    
    // For business documents
    businessName: { type: String },
    registrationNumber: { type: String },
    gstNumber: { type: String },
    
    // For certificates
    certificateNumber: { type: String },
    issuedBy: { type: String },
    validFrom: { type: Date },
    validUntil: { type: Date }
  },
  
  // Access Control
  access: {
    isPublic: { type: Boolean, default: false },
    allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    permissions: {
      view: { type: Boolean, default: true },
      download: { type: Boolean, default: false },
      edit: { type: Boolean, default: false }
    }
  },
  
  // Activity Tracking
  activity: {
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    lastViewed: { type: Date },
    lastDownloaded: { type: Date }
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
}, {
  timestamps: true,
  collection: 'documents'
});

// Indexes
documentSchema.index({ userId: 1 });
documentSchema.index({ 'documentDetails.type': 1 });
documentSchema.index({ 'documentDetails.category': 1 });
documentSchema.index({ 'verification.status': 1 });
documentSchema.index({ 'extractedData.panNumber': 1 });
documentSchema.index({ 'extractedData.aadharNumber': 1 });
documentSchema.index({ createdAt: -1 });
documentSchema.index({ expiresAt: 1 });

// Check if model already exists to prevent overwrite error
module.exports = mongoose.models.Document || mongoose.model('Document', documentSchema);

