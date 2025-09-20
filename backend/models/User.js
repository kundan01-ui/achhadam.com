const mongoose = require('mongoose');

// User Schema (MongoDB)
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { 
    type: String, 
    required: true, 
    enum: ['farmer', 'buyer', 'transporter'] 
  },
  email: String,
  farmName: String,
  farmSize: Number,
  farmSizeUnit: String,
  village: String,
  district: String,
  state: String,
  mainCrops: [String],
  experience: String,
  companyName: String,
  businessName: String,
  businessType: String,
  gstNumber: String,
  preferredCrops: [String],
  paymentTerms: String,
  vehicleTypes: [String],
  serviceAreas: [String],
  city: String,
  isVerified: { type: Boolean, default: false },
  resetOTP: { type: String },
  resetOTPExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;



