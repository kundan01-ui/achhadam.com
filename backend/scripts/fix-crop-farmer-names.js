/**
 * Migration Script: Fix Farmer Names in Crops
 *
 * Problem: Crops showing "Unknown Farmer" because farmerId doesn't match User _id
 * Solution: Update crops with real farmer names from farmerAssociation or User table
 *
 * Run: node scripts/fix-crop-farmer-names.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://achhadam:Achhadam%401@cluster0.mongodb.net/achhadam?retryWrites=true&w=majority';

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Define schemas
const CropListingSchema = new mongoose.Schema({}, { strict: false });
const UserSchema = new mongoose.Schema({}, { strict: false });

const CropListing = mongoose.model('CropListing', CropListingSchema);
const User = mongoose.model('User', UserSchema);

async function fixCropFarmerNames() {
  try {
    console.log('\n🔧 Starting farmer name fix migration...\n');

    // Get all crops
    const crops = await CropListing.find({});
    console.log(`📊 Found ${crops.length} total crops in database`);

    let updatedCount = 0;
    let alreadyCorrectCount = 0;
    let errorCount = 0;

    for (const crop of crops) {
      try {
        // Check if crop already has correct farmer name (not "Unknown Farmer")
        if (crop.farmerName && crop.farmerName !== 'Unknown Farmer') {
          alreadyCorrectCount++;
          continue;
        }

        let farmerName = null;
        let farmerPhone = null;

        let farmerIdToSet = crop.farmerId;

        // Strategy 1: Use farmerAssociation if available
        if (crop.farmerAssociation?.farmerName) {
          farmerName = crop.farmerAssociation.farmerName;
          farmerPhone = crop.farmerAssociation.farmerPhone;
          farmerIdToSet = crop.farmerAssociation.farmerId || crop.farmerId;
          console.log(`✅ Using farmerAssociation for crop ${crop._id}: ${farmerName}`);
        }
        // Strategy 2: Try to find farmer by farmerId in User table
        else if (crop.farmerId) {
          const farmer = await User.findById(crop.farmerId);
          if (farmer) {
            farmerName = farmer.firstName
              ? `${farmer.firstName} ${farmer.lastName || ''}`.trim()
              : (farmer.name || null);
            farmerPhone = farmer.phone;
            farmerIdToSet = farmer._id;
            console.log(`✅ Found farmer in User table for crop ${crop._id}: ${farmerName}`);
          } else {
            console.log(`⚠️ No farmer found in User table for farmerId: ${crop.farmerId}`);
          }
        }
        // Strategy 3: Try to find farmer by phone from farmerAssociation
        else if (crop.farmerAssociation?.farmerPhone) {
          const farmer = await User.findOne({ phone: crop.farmerAssociation.farmerPhone });
          if (farmer) {
            farmerName = farmer.firstName
              ? `${farmer.firstName} ${farmer.lastName || ''}`.trim()
              : (farmer.name || crop.farmerAssociation.farmerName || 'Unknown Farmer');
            farmerPhone = farmer.phone;
            farmerIdToSet = farmer._id;
            console.log(`✅ Found farmer by phone lookup for crop ${crop._id}: ${farmerName}`);
          }
        }

        // Update crop if we found a farmer name
        if (farmerName && farmerIdToSet) {
          await CropListing.findByIdAndUpdate(crop._id, {
            farmerId: farmerIdToSet,  // CRITICAL: Update farmerId so populate() works
            farmerName: farmerName,
            farmerPhone: farmerPhone || crop.farmerPhone || 'Unknown',
            // Also update farmerAssociation to ensure consistency
            farmerAssociation: {
              farmerId: farmerIdToSet,
              farmerName: farmerName,
              farmerPhone: farmerPhone || crop.farmerPhone || 'Unknown',
              permanentLink: true
            }
          });

          updatedCount++;
          console.log(`✅ Updated crop ${crop._id} with farmer: ${farmerName}`);
        } else {
          console.log(`❌ Could not find farmer name for crop ${crop._id}`);
          errorCount++;
        }

      } catch (cropError) {
        console.error(`❌ Error processing crop ${crop._id}:`, cropError.message);
        errorCount++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`✅ Already correct: ${alreadyCorrectCount} crops`);
    console.log(`✅ Updated: ${updatedCount} crops`);
    console.log(`❌ Errors: ${errorCount} crops`);
    console.log(`📊 Total processed: ${crops.length} crops\n`);

  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  }
}

// Run migration
connectDB().then(() => {
  fixCropFarmerNames();
});
