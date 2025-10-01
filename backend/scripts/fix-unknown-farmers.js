/**
 * Fix Unknown Farmer names in existing crops
 * Updates crops with missing farmerAssociation.farmerName
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const CropListing = require('../src/models/CropListing');
const User = require('../src/models/User');

async function fixUnknownFarmers() {
  try {
    console.log('🔧 Starting Unknown Farmer fix...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all crops with Unknown Farmer or missing farmerAssociation
    const cropsToFix = await CropListing.find({
      $or: [
        { 'farmerAssociation.farmerName': 'Unknown Farmer' },
        { 'farmerAssociation.farmerName': { $exists: false } },
        { 'farmerAssociation': { $exists: false } }
      ]
    });

    console.log(`📊 Found ${cropsToFix.length} crops to fix`);

    let fixed = 0;
    let failed = 0;

    for (const crop of cropsToFix) {
      try {
        // Try to find farmer details from User collection
        const farmer = await User.findById(crop.farmerId);

        if (farmer) {
          const farmerName = farmer.firstName
            ? `${farmer.firstName} ${farmer.lastName || ''}`.trim()
            : (farmer.name || 'Unknown Farmer');

          // Update crop with farmer details
          crop.farmerAssociation = {
            farmerId: crop.farmerId,
            farmerName: farmerName,
            farmerPhone: farmer.phone || 'unknown',
            permanentLink: true
          };

          await crop.save();
          console.log(`✅ Fixed crop ${crop._id}: ${farmerName}`);
          fixed++;
        } else {
          console.log(`⚠️  Farmer not found for crop ${crop._id}`);
          failed++;
        }
      } catch (error) {
        console.error(`❌ Error fixing crop ${crop._id}:`, error.message);
        failed++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Fixed: ${fixed}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Total: ${cropsToFix.length}`);

    await mongoose.disconnect();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
fixUnknownFarmers();
