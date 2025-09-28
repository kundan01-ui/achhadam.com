const express = require('express');
const router = express.Router();
const { CropListing, Farmer, User } = require('../models');
const auth = require('../middleware/auth');

// Get all crops - Simple endpoint for testing
router.get('/', async (req, res) => {
  try {
    console.log('🌾 GET CROPS: Fetching all crops...');
    
    const crops = await CropListing.find({})
      .sort({ uploadedAt: -1 })
      .limit(50);

    console.log(`✅ GET CROPS: Found ${crops.length} crops`);

    res.json({
      success: true,
      data: crops,
      count: crops.length,
      message: 'Crops loaded successfully'
    });
  } catch (error) {
    console.error('Error fetching crops:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crops',
      error: error.message
    });
  }
});

// Create new crop listing - TEMPORARY AUTH BYPASS FOR TESTING
router.post('/', async (req, res) => {
  try {
    console.log('🌾 CROP UPLOAD: Starting crop upload process...');
    console.log('🌾 CROP UPLOAD: Request headers:', req.headers);
    console.log('🌾 CROP UPLOAD: Request body:', req.body);
    console.log('🌾 CROP UPLOAD: Request method:', req.method);
    console.log('🌾 CROP UPLOAD: Request URL:', req.url);
    
    const {
      cropName,
      cropType,
      variety,
      quantity,
      unit,
      quality,
      harvestDate,
      price,
      organic,
      location,
      description,
      images,
      farmerId,
      farmerName
    } = req.body;

    // TEMPORARY: Use farmerId from request body instead of auth
    const actualFarmerId = farmerId || 'temp_farmer_' + Date.now();
    console.log('🌾 CROP UPLOAD: Using farmer ID:', actualFarmerId);
    
    // Check database connection
    const mongoose = require('mongoose');
    console.log('🌾 CROP UPLOAD: Database connection state:', mongoose.connection.readyState);
    console.log('🌾 CROP UPLOAD: Database name:', mongoose.connection.name);
    console.log('🌾 CROP UPLOAD: Database host:', mongoose.connection.host);
    console.log('🌾 CROP UPLOAD: Database port:', mongoose.connection.port);

    // Validate required fields
    console.log('🌾 CROP UPLOAD: Validating required fields...');
    if (!cropName || !cropType || !price) {
      console.log('❌ CROP UPLOAD: Missing required fields:', { cropName, cropType, price });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: cropName, cropType, price'
      });
    }
    
    console.log('✅ CROP UPLOAD: Required fields validated');
    
    // Create or use existing ObjectId for farmerId FIRST
    let farmerObjectId;
    let cropObjectId;
    
    try {
      farmerObjectId = new mongoose.Types.ObjectId(actualFarmerId);
    } catch {
      farmerObjectId = new mongoose.Types.ObjectId();
    }
    
    // Create a temporary cropId (in a real app, this would reference actual crop taxonomy)  
    cropObjectId = new mongoose.Types.ObjectId();
    
    // Check for duplicate entries before creating new crop
    console.log('🌾 CROP UPLOAD: Checking for duplicate entries...');
    const existingCrop = await CropListing.findOne({
      farmerId: farmerObjectId,
      cropName: cropName,
      'pricing.pricePerUnit': parseFloat(price),
      uploadedAt: {
        $gte: new Date(Date.now() - 5 * 60 * 1000) // Within last 5 minutes
      }
    });
    
    if (existingCrop) {
      console.log('❌ CROP UPLOAD: Duplicate entry detected, preventing creation');
      return res.status(409).json({
        success: false,
        message: 'Duplicate crop entry detected. Please wait before uploading again.',
        duplicateId: existingCrop._id
      });
    }
    
    console.log('✅ CROP UPLOAD: No duplicates found, proceeding with creation');
    
    // Create new crop listing with PERMANENT PERSISTENCE
    console.log('🌾 CROP UPLOAD: Creating crop listing object...');
    
    // Generate unique listingId
    const listingId = 'CRP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const cropListing = new CropListing({
      listingId: listingId,
      farmerId: farmerObjectId,
      cropId: cropObjectId,
      title: `${cropName} - ${variety || cropType}`,
      description: description || `Fresh ${cropName} available for sale`,
      
      // Crop Information
      cropName,
      cropType,
      variety,
      quality: quality || 'good',
      organic: organic === 'true' || organic === true,
      
      // Quantity & Pricing (nested structure)
      quantity: {
        available: parseInt(quantity) || 1,
        unit: unit || 'kg',
        minimumOrder: 1
      },
      pricing: {
        pricePerUnit: parseFloat(price),
        currency: 'INR',
        negotiable: true
      },
      
      // Location (nested structure with defaults)
      location: {
        farmAddress: typeof location === 'string' ? location : (location?.farmAddress || 'Farm Address'),
        city: typeof location === 'string' ? location : (location?.city || 'Unknown City'),
        state: typeof location === 'string' ? 'Unknown State' : (location?.state || 'Unknown State'),
        pincode: typeof location === 'string' ? '000000' : (location?.pincode || '000000'),
        coordinates: {
          latitude: location?.coordinates?.latitude || 28.6139, // Default to Delhi coordinates
          longitude: location?.coordinates?.longitude || 77.2090
        }
      },
      
      // Harvest Information (nested structure)
      harvest: {
        harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
        storageMethod: 'farm_storage'
      },
      
      // Images - Handle properly for validation
      images: Array.isArray(images) ? images.map(img => ({
        url: img.url || img.imageUrl || '',
        caption: img.caption || '',
        isPrimary: img.isPrimary || false,
        uploadedAt: new Date()
      })) : [],
      
      // Status
      status: {
        isActive: true,
        isVerified: false,
        visibility: 'public'
      },
      
      // PERMANENT PERSISTENCE MARKERS
      isPermanent: true,
      crossDeviceAccess: true,
      sessionIndependent: true,
      uploadedAt: new Date(),
      lastUpdated: new Date(),
      
      // Farmer Association for Permanent Linking
      farmerAssociation: {
        farmerId: farmerObjectId,
        farmerName: farmerName || 'Unknown Farmer',
        permanentLink: true
      }
    });
    
    console.log('🌾 CROP UPLOAD: Crop listing object created:', cropListing);

    await cropListing.save();
    console.log('✅ CROP UPLOAD: Crop saved to MongoDB successfully');

    // Update farmer's crop count (skip if no valid farmer record)
    try {
      await Farmer.findOneAndUpdate(
        { userId: farmerObjectId },
        { $inc: { 'activity.totalListings': 1, 'activity.activeListings': 1 } }
      );
      console.log('✅ CROP UPLOAD: Farmer stats updated successfully');
    } catch (error) {
      console.log('⚠️ CROP UPLOAD: Farmer stats update skipped:', error.message);
    }

    console.log('🎉 CROP UPLOAD: Complete success - crop saved to database');
    res.status(201).json({
      success: true,
      message: 'Crop listing created successfully',
      data: cropListing
    });
  } catch (error) {
    console.error('Error creating crop listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create crop listing',
      error: error.message
    });
  }
});

// Get all crops for marketplace - CROSS-DEVICE SYNC
router.get('/marketplace', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, organic, quality } = req.query;
    
    console.log(`🌾 MARKETPLACE: Loading all crops for marketplace`);
    console.log(`🌐 Cross-device sync: All farmer crops available for buyers`);
    
    let query = { 
      'status.isActive': true,
      isPermanent: true,
      crossDeviceAccess: true,
      sessionIndependent: true
    };
    
    // Apply filters
    if (category && category !== 'all') {
      query.cropType = new RegExp(category, 'i');
    }
    
    if (search) {
      query.$or = [
        { cropName: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') }
      ];
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (organic && organic !== 'all') {
      query.organic = organic === 'true';
    }
    
    if (quality && quality !== 'all') {
      query.quality = quality;
    }

    const crops = await CropListing.find(query)
      .sort({ uploadedAt: -1 })
      .limit(100);

    console.log(`✅ MARKETPLACE: Found ${crops.length} crops available for marketplace`);
    console.log(`🌐 These crops are available across all devices and sessions`);

    res.json({
      success: true,
      data: crops,
      count: crops.length,
      message: 'Marketplace crops loaded successfully',
      persistence: {
        isPermanent: true,
        crossDeviceAccess: true,
        sessionIndependent: true
      }
    });
  } catch (error) {
    console.error('Error fetching marketplace crops:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch marketplace crops',
      error: error.message
    });
  }
});

// Get crops by farmer - PERMANENT DATA LOADING
router.get('/farmer/:farmerId', auth, async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    // Verify farmer owns the crops
    if (req.user.userId !== farmerId && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    console.log(`🌾 PERMANENT LOAD: Loading crops for farmer ${farmerId}`);
    console.log(`📱 This will load crops from any device, any session - PERMANENT DATA`);

    // Load crops with permanent persistence markers
    const crops = await CropListing.find({ 
      farmerId,
      isPermanent: true,
      crossDeviceAccess: true,
      sessionIndependent: true
    })
    .sort({ uploadedAt: -1 });

    console.log(`✅ PERMANENT LOAD: Found ${crops.length} permanent crops for farmer ${farmerId}`);
    console.log(`🌐 These crops are available across all devices and sessions`);

    res.json({
      success: true,
      data: crops,
      count: crops.length,
      message: 'Permanent crops loaded successfully',
      persistence: {
        isPermanent: true,
        crossDeviceAccess: true,
        sessionIndependent: true
      }
    });
  } catch (error) {
    console.error('Error fetching permanent farmer crops:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch permanent farmer crops',
      error: error.message
    });
  }
});

// REMOVED: Duplicate marketplace endpoint

// Get single crop by ID
router.get('/:cropId', async (req, res) => {
  try {
    const { cropId } = req.params;
    
    const crop = await CropListing.findById(cropId)
      .populate('farmerId', 'profile.fullName address.current.city address.current.state');

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.json({
      success: true,
      data: crop
    });
  } catch (error) {
    console.error('Error fetching crop:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop',
      error: error.message
    });
  }
});

// Update crop listing
router.put('/:cropId', auth, async (req, res) => {
  try {
    const { cropId } = req.params;
    const updateData = req.body;

    const crop = await CropListing.findById(cropId);
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Verify farmer owns the crop
    if (crop.farmerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedCrop = await CropListing.findByIdAndUpdate(
      cropId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Crop updated successfully',
      data: updatedCrop
    });
  } catch (error) {
    console.error('Error updating crop:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update crop',
      error: error.message
    });
  }
});

// Delete crop listing
router.delete('/:cropId', auth, async (req, res) => {
  try {
    const { cropId } = req.params;

    const crop = await CropListing.findById(cropId);
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Verify farmer owns the crop
    if (crop.farmerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await CropListing.findByIdAndDelete(cropId);

    // Update farmer's crop count
    await Farmer.findOneAndUpdate(
      { userId: crop.farmerId },
      { $inc: { 'activity.totalListings': -1, 'activity.activeListings': -1 } }
    );

    res.json({
      success: true,
      message: 'Crop deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting crop:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete crop',
      error: error.message
    });
  }
});

// REMOVED: Third duplicate marketplace endpoint

module.exports = router;

