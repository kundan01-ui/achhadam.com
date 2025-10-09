// Database Models Index
// CRITICAL FIX: Ensure User model is fully registered BEFORE CropListing
// CropListing uses .populate('farmerId') which requires User model to exist

// Step 1: Load and register User model first
const User = require('./User');
console.log('✅ User model registered:', !!User);

// Step 2: Load models that don't reference User
const Farmer = require('./Farmer');
const Buyer = require('./Buyer');
const Transporter = require('./Transporter');
const Crop = require('./Crop');

// Step 3: NOW load CropListing (which references User via populate)
const CropListing = require('./CropListing');
console.log('✅ CropListing model registered:', !!CropListing);
const Order = require('./Order');
const Activity = require('./Activity');
const Payment = require('./Payment');
const Document = require('./Document');
const Notification = require('./Notification');

module.exports = {
  User,
  Farmer,
  Buyer,
  Transporter,
  Crop,
  CropListing,
  Order,
  Activity,
  Payment,
  Document,
  Notification
};

















