const mongoose = require('mongoose');
const CropListing = require('./src/models/CropListing');

async function debugMarketplaceFilter() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://kamleshthink:Kamlesh%40%232005@cluster0.u1vgt.mongodb.net/krishi?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Check the exact marketplace query filter being used in the API
    console.log('🔍 Testing marketplace query filter...');

    let marketplaceQuery = {
      'status.isActive': true,
      isPermanent: true,
      crossDeviceAccess: true,
      sessionIndependent: true
    };

    console.log('\n📊 Marketplace API filter:', JSON.stringify(marketplaceQuery, null, 2));

    const marketplaceCrops = await CropListing.countDocuments(marketplaceQuery);
    console.log('📊 Crops matching marketplace API filter:', marketplaceCrops);

    // Check individual additional conditions
    const crossDevice = await CropListing.countDocuments({ crossDeviceAccess: true });
    console.log('📊 Crops with crossDeviceAccess = true:', crossDevice);

    const sessionIndependent = await CropListing.countDocuments({ sessionIndependent: true });
    console.log('📊 Crops with sessionIndependent = true:', sessionIndependent);

    // Show what fields the crops actually have
    console.log('\n📋 Sample crop fields:');
    const sampleCrop = await CropListing.findOne().select('name type crossDeviceAccess sessionIndependent status isPermanent');
    console.log('Sample crop structure:');
    console.log({
      name: sampleCrop.name,
      type: sampleCrop.type,
      crossDeviceAccess: sampleCrop.crossDeviceAccess,
      sessionIndependent: sampleCrop.sessionIndependent,
      'status.isActive': sampleCrop.status?.isActive,
      isPermanent: sampleCrop.isPermanent
    });

    // Try a simplified marketplace query
    console.log('\n🔧 Trying simplified marketplace query...');
    const simplifiedQuery = {
      'status.isActive': true,
      isPermanent: true
    };

    const simplifiedResults = await CropListing.find(simplifiedQuery)
      .limit(3)
      .select('name type quantity pricing location farmerId status isPermanent');

    console.log(`📊 Simplified query results: ${simplifiedResults.length} crops found`);

    if (simplifiedResults.length > 0) {
      console.log('\n📋 Sample crops with simplified query:');
      simplifiedResults.forEach((crop, index) => {
        console.log(`Crop ${index + 1}:`, {
          id: crop._id.toString(),
          name: crop.name || 'NO_NAME',
          type: crop.type || 'NO_TYPE',
          quantity: crop.quantity,
          pricing: crop.pricing,
          farmerId: crop.farmerId?.toString()
        });
      });
    }

    await mongoose.disconnect();
    console.log('\n✅ Debug complete');
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugMarketplaceFilter();