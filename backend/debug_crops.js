const mongoose = require('mongoose');
const CropListing = require('./src/models/CropListing');

async function debugMarketplace() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://kamleshthink:Kamlesh%40%232005@cluster0.u1vgt.mongodb.net/krishi?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Check total crops
    const totalCrops = await CropListing.countDocuments();
    console.log('📊 Total crops in database:', totalCrops);

    // Check the marketplace query filter
    let query = {
      'status.isActive': true,
      isPermanent: true,
      isDeleted: { $ne: true }
    };

    console.log('\n🔍 Marketplace query filter conditions:');
    console.log('- status.isActive: true');
    console.log('- isPermanent: true');
    console.log('- isDeleted: { $ne: true }');

    const cropsWithFilter = await CropListing.countDocuments(query);
    console.log('\n📊 Crops matching ALL marketplace filters:', cropsWithFilter);

    // Check individual conditions
    const activeStatus = await CropListing.countDocuments({ 'status.isActive': true });
    console.log('📊 Crops with status.isActive = true:', activeStatus);

    const permanent = await CropListing.countDocuments({ isPermanent: true });
    console.log('📊 Crops with isPermanent = true:', permanent);

    const notDeleted = await CropListing.countDocuments({ isDeleted: { $ne: true } });
    console.log('📊 Crops with isDeleted != true:', notDeleted);

    // Get sample crops to check their structure
    console.log('\n📋 Sample crop structures:');
    const sampleCrops = await CropListing.find().limit(3).select('name status isPermanent isDeleted');
    sampleCrops.forEach((crop, index) => {
      console.log(`Crop ${index + 1}:`, {
        name: crop.name || 'No name',
        status: crop.status || 'No status',
        isPermanent: crop.isPermanent !== undefined ? crop.isPermanent : 'undefined',
        isDeleted: crop.isDeleted !== undefined ? crop.isDeleted : 'undefined'
      });
    });

    // Try to get crops without strict filters
    console.log('\n📋 Getting crops without strict filters:');
    const anyCrops = await CropListing.find().limit(2).select('name type quantity price location farmerId status isPermanent isDeleted');
    anyCrops.forEach((crop, index) => {
      console.log(`Available Crop ${index + 1}:`, {
        id: crop._id,
        name: crop.name,
        type: crop.type,
        quantity: crop.quantity,
        price: crop.price,
        farmerId: crop.farmerId,
        status: crop.status,
        isPermanent: crop.isPermanent,
        isDeleted: crop.isDeleted
      });
    });

    await mongoose.disconnect();
    console.log('\n✅ Database check complete');
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugMarketplace();