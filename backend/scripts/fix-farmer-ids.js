/**
 * Fix crop farmerIds by matching phone numbers
 * Updates crops saved with generated IDs to use real MongoDB _id
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const CropListing = require('../src/models/CropListing');
const User = require('../src/models/User');

async function fixFarmerIds() {
  try {
    console.log('🔧 Starting farmerId fix...\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Strategy: Update crops by matching farmerAssociation.farmerPhone with User.phone

    // Find all crops with phone numbers in farmerAssociation
    const cropsWithPhone = await CropListing.find({
      'farmerAssociation.farmerPhone': { $exists: true, $ne: 'unknown' }
    });

    console.log(`📊 Found ${cropsWithPhone.length} crops with phone numbers\n`);

    let fixed = 0;
    let failed = 0;
    let skipped = 0;

    for (const crop of cropsWithPhone) {
      try {
        const phone = crop.farmerAssociation.farmerPhone;

        // Find user by phone
        const user = await User.findOne({ phone: phone });

        if (!user) {
          console.log(`⚠️  No user found for phone ${phone} (crop: ${crop.cropName})`);
          failed++;
          continue;
        }

        // Check if farmerId is already correct
        if (crop.farmerId.toString() === user._id.toString()) {
          console.log(`✓ Crop ${crop.cropName} already has correct farmerId`);
          skipped++;
          continue;
        }

        // Update farmerId
        const oldFarmerId = crop.farmerId;
        crop.farmerId = user._id;
        crop.farmerAssociation.farmerId = user._id;

        // Update farmerName if it's "Unknown Farmer"
        if (crop.farmerAssociation.farmerName === 'Unknown Farmer' || !crop.farmerAssociation.farmerName) {
          const farmerName = user.firstName
            ? `${user.firstName} ${user.lastName || ''}`.trim()
            : (user.name || 'Unknown Farmer');
          crop.farmerAssociation.farmerName = farmerName;
        }

        await crop.save();

        console.log(`✅ Fixed: ${crop.cropName}`);
        console.log(`   Old farmerId: ${oldFarmerId}`);
        console.log(`   New farmerId: ${user._id}`);
        console.log(`   Farmer: ${crop.farmerAssociation.farmerName} (${phone})\n`);

        fixed++;
      } catch (error) {
        console.error(`❌ Error fixing crop ${crop._id}:`, error.message);
        failed++;
      }
    }

    console.log(`\n📊 SUMMARY:`);
    console.log(`   ✅ Fixed: ${fixed}`);
    console.log(`   ⏭️  Skipped (already correct): ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📊 Total: ${cropsWithPhone.length}\n`);

    await mongoose.disconnect();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Fix failed:', error);
    process.exit(1);
  }
}

// Run fix
fixFarmerIds();
