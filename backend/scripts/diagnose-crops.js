/**
 * Diagnose crop farmerId issues
 * Shows what farmerIds exist in database vs what we're querying for
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const CropListing = require('../src/models/CropListing');
const User = require('../src/models/User');

async function diagnoseCrops() {
  try {
    console.log('🔍 Starting crop diagnosis...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find user by phone number
    const phone = '8969445367';
    const user = await User.findOne({ phone: phone });

    if (!user) {
      console.log(`❌ User with phone ${phone} not found`);
      await mongoose.disconnect();
      return;
    }

    console.log('👤 USER DETAILS:');
    console.log(`   Name: ${user.firstName} ${user.lastName || ''}`);
    console.log(`   Phone: ${user.phone}`);
    console.log(`   MongoDB _id: ${user._id}`);
    console.log(`   User Type: ${user.userType}\n`);

    // Find ALL crops in database
    const allCrops = await CropListing.find({}).limit(20);
    console.log(`📊 TOTAL CROPS IN DATABASE: ${allCrops.length}\n`);

    if (allCrops.length > 0) {
      console.log('🌾 SAMPLE CROP DATA:');
      allCrops.slice(0, 5).forEach((crop, index) => {
        console.log(`\nCrop #${index + 1}:`);
        console.log(`   Crop Name: ${crop.cropName}`);
        console.log(`   farmerId: ${crop.farmerId}`);
        console.log(`   farmerAssociation.farmerId: ${crop.farmerAssociation?.farmerId}`);
        console.log(`   farmerAssociation.farmerName: ${crop.farmerAssociation?.farmerName}`);
        console.log(`   farmerAssociation.farmerPhone: ${crop.farmerAssociation?.farmerPhone}`);
        console.log(`   uploadedAt: ${crop.uploadedAt}`);
      });
    }

    // Search for crops with user's MongoDB _id
    console.log(`\n\n🔍 SEARCHING FOR CROPS WITH USER'S MONGODB _ID: ${user._id}`);
    const cropsById = await CropListing.find({ farmerId: user._id });
    console.log(`   Found: ${cropsById.length} crops\n`);

    // Search for crops with phone number in farmerAssociation
    console.log(`🔍 SEARCHING FOR CROPS WITH PHONE: ${phone}`);
    const cropsByPhone = await CropListing.find({
      'farmerAssociation.farmerPhone': phone
    });
    console.log(`   Found: ${cropsByPhone.length} crops\n`);

    // Search for crops with generated IDs (farmer_*)
    console.log(`🔍 SEARCHING FOR CROPS WITH GENERATED IDs (farmer_*)`);
    const cropsWithGeneratedIds = await CropListing.find({
      farmerId: { $regex: /^farmer_/ }
    });
    console.log(`   Found: ${cropsWithGeneratedIds.length} crops`);

    if (cropsWithGeneratedIds.length > 0) {
      console.log('\n   Sample generated farmerIds:');
      cropsWithGeneratedIds.slice(0, 5).forEach(crop => {
        console.log(`   - ${crop.farmerId} (${crop.cropName})`);
      });
    }

    // Find unique farmerIds
    console.log(`\n\n📊 UNIQUE FARMER IDs IN DATABASE:`);
    const uniqueFarmerIds = await CropListing.distinct('farmerId');
    console.log(`   Total unique farmerIds: ${uniqueFarmerIds.length}`);
    uniqueFarmerIds.forEach(id => {
      console.log(`   - ${id}`);
    });

    // Recommend fix
    console.log(`\n\n💡 RECOMMENDATION:`);
    if (cropsWithGeneratedIds.length > 0) {
      console.log(`   ✅ Found ${cropsWithGeneratedIds.length} crops with generated IDs`);
      console.log(`   🔧 These need to be updated to use MongoDB _id: ${user._id}`);
      console.log(`   📝 Run fix-farmer-ids.js to update these crops`);
    } else if (allCrops.length === 0) {
      console.log(`   📭 No crops in database - farmer needs to upload crops`);
    } else {
      console.log(`   ✅ Crops look correct, issue might be elsewhere`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Diagnosis complete!');
  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
    process.exit(1);
  }
}

// Run diagnosis
diagnoseCrops();
