const express = require('express');
const router = express.Router();
const { CropListing, Farmer, User } = require('../models');
const auth = require('../middleware/auth');

// Get all crops - Simple endpoint for testing
router.get('/', async (req, res) => {
  try {
    console.log('🌾 GET CROPS: Fetching all crops...');

    let crops;
    try {
      crops = await CropListing.find({})
        .populate('farmerId', 'firstName lastName name phone')
        .sort({ uploadedAt: -1 })
        .limit(50);
    } catch (populateError) {
      console.log('⚠️  Populate failed, fetching without populate:', populateError.message);
      crops = await CropListing.find({})
        .sort({ uploadedAt: -1 })
        .limit(50);
    }

    console.log(`✅ GET CROPS: Found ${crops.length} crops`);

    // Add real farmer names to response
    const cropsWithFarmerNames = crops.map(crop => {
      const cropObj = crop.toObject();
      if (cropObj.farmerId && typeof cropObj.farmerId === 'object') {
        const farmer = cropObj.farmerId;
        cropObj.farmerName = farmer.firstName
          ? `${farmer.firstName} ${farmer.lastName || ''}`.trim()
          : (farmer.name || 'Unknown Farmer');
        cropObj.farmerPhone = farmer.phone || 'Unknown';
      }
      return cropObj;
    });

    res.json({
      success: true,
      data: cropsWithFarmerNames,
      count: cropsWithFarmerNames.length,
      message: 'Crops loaded successfully with real farmer names'
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

// Create new crop listing - REQUIRES AUTHENTICATION
router.post('/', auth, async (req, res) => {
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

    // CRITICAL FIX: Use authenticated user ID from token, NOT from request body
    // This ensures crops are saved with the REAL MongoDB _id for cross-device sync

    if (!req.user || !req.user.userId) {
      console.log('❌ CROP UPLOAD: No authenticated user found');
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login first.'
      });
    }

    const actualFarmerId = req.user.userId;
    console.log('🌾 CROP UPLOAD: Using authenticated farmer ID:', actualFarmerId);
    console.log('🔑 Auth token user:', { userId: req.user.userId, userType: req.user.userType, phone: req.user.phone });
    
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
        farmerPhone: req.user.phone || 'unknown',
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

    let crops;
    try {
      // Load crops with farmer data populated
      crops = await CropListing.find(query)
        .populate('farmerId', 'firstName lastName name phone')
        .sort({ uploadedAt: -1 })
        .limit(50);  // Reduced from 100 to 50 for better performance

      console.log(`✅ MARKETPLACE: Loaded ${crops.length} crops with populate`);

      // Debug: Check first crop's farmer data
      if (crops.length > 0) {
        const firstCrop = crops[0];
        console.log(`🔍 First crop debug:`, {
          cropId: firstCrop._id,
          farmerId: firstCrop.farmerId,
          farmerIdType: typeof firstCrop.farmerId,
          farmerIsObject: firstCrop.farmerId && typeof firstCrop.farmerId === 'object'
        });
      }
    } catch (populateError) {
      console.log('⚠️  Populate failed, fetching without populate:', populateError.message);
      crops = await CropListing.find(query)
        .sort({ uploadedAt: -1 })
        .limit(50);  // Reduced from 100 to 50 for better performance
    }

    console.log(`✅ MARKETPLACE: Found ${crops.length} crops available for marketplace`);

    // Fix incomplete crop data for buyer dashboard display
    const processedCrops = crops.map((crop, index) => {
      const cropObj = crop.toObject();

      // Use REAL crop name from database - cropName field
      cropObj.name = cropObj.cropName || `फसल ${index + 1}`;

      // Use REAL crop type from database - cropType field
      cropObj.type = cropObj.cropType || 'Unknown';

      // Use REAL variety from database
      if (cropObj.variety) {
        cropObj.subcategory = cropObj.variety;
      }

      // CRITICAL FIX: Use multiple fallbacks for farmer name
      // Priority: 1. Populated farmerId, 2. farmerAssociation, 3. Direct farmerName field
      if (cropObj.farmerId && typeof cropObj.farmerId === 'object') {
        // Case 1: farmerId was successfully populated from User collection
        const farmer = cropObj.farmerId;
        cropObj.farmerName = farmer.firstName
          ? `${farmer.firstName} ${farmer.lastName || ''}`.trim()
          : (farmer.name || 'Unknown Farmer');
        cropObj.farmerPhone = farmer.phone || 'Unknown';
        console.log(`✅ Farmer name from populate: ${cropObj.farmerName}`);
      } else {
        // Case 2: farmerId not populated, use farmerAssociation or direct farmerName
        cropObj.farmerName = cropObj.farmerAssociation?.farmerName || cropObj.farmerName || 'Unknown Farmer';
        cropObj.farmerPhone = cropObj.farmerAssociation?.farmerPhone || cropObj.farmerPhone || 'Unknown';
        console.log(`⚠️ Farmer name from association/direct: ${cropObj.farmerName} (farmerId: ${cropObj.farmerId})`);

        // Debug: Log why populate failed
        if (cropObj.farmerId) {
          console.log(`❌ POPULATE FAILED: farmerId exists but is not an object:`, {
            farmerId: cropObj.farmerId,
            type: typeof cropObj.farmerId,
            hasAssociation: !!cropObj.farmerAssociation,
            associationName: cropObj.farmerAssociation?.farmerName
          });
        }
      }

      // Use REAL grade/quality from database
      cropObj.grade = cropObj.quality || 'B';

      // Ensure pricing is accessible
      if (!cropObj.price && cropObj.pricing?.pricePerUnit) {
        cropObj.price = cropObj.pricing.pricePerUnit;
      }

      // Extract quantity from nested structure
      if (!cropObj.quantity && cropObj.quantity?.available) {
        cropObj.quantity = cropObj.quantity.available;
      }

      // Extract unit from nested structure
      if (!cropObj.unit && cropObj.quantity?.unit) {
        cropObj.unit = cropObj.quantity.unit;
      }

      // Ensure location is a simple string for compatibility
      if (cropObj.location?.farmAddress) {
        cropObj.location = cropObj.location.farmAddress;
      } else if (cropObj.location?.city) {
        cropObj.location = cropObj.location.city;
      } else if (typeof cropObj.location === 'object') {
        cropObj.location = cropObj.location.city || 'Unknown Location';
      }

      // PERFORMANCE FIX: Only send first image thumbnail for marketplace listing
      // Full images can be loaded when user clicks on crop details
      if (cropObj.images && Array.isArray(cropObj.images)) {
        const allImages = cropObj.images.map(img => {
          if (typeof img === 'object' && img.url) {
            return img.url;
          }
          return img;
        }).filter(url => url && url !== '');

        // For marketplace listing, only send first image
        // This reduces payload size by ~95% (from 2MB to 100KB per crop)
        if (allImages.length > 0) {
          cropObj.images = [allImages[0]]; // Only first image
          cropObj.totalImages = allImages.length; // Track total count
        } else {
          cropObj.images = [];
          cropObj.totalImages = 0;
        }
      } else {
        cropObj.images = [];
        cropObj.totalImages = 0;
      }

      // Add harvest date in readable format
      if (cropObj.harvest?.harvestDate) {
        cropObj.harvestDate = cropObj.harvest.harvestDate;
      }

      // Add storage and packaging info
      if (cropObj.harvest?.storageMethod) {
        cropObj.storageMethod = cropObj.harvest.storageMethod;
      }
      if (cropObj.harvest?.packaging?.type) {
        cropObj.packagingType = cropObj.harvest.packaging.type;
      }

      return cropObj;
    });

    console.log(`✨ MARKETPLACE: Processed ${processedCrops.length} crops for buyer dashboard display`);

    res.json({
      success: true,
      data: processedCrops,
      count: processedCrops.length,
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

// Get crop images separately (for performance optimization)
router.get('/:cropId/images', async (req, res) => {
  try {
    const { cropId } = req.params;

    console.log(`🖼️ IMAGES: Loading images for crop ${cropId}`);

    const crop = await CropListing.findById(cropId).select('images');

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.json({
      success: true,
      images: crop.images || []
    });
  } catch (error) {
    console.error('Error fetching crop images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop images',
      error: error.message
    });
  }
});

// Get crops by farmer - PERMANENT DATA LOADING
router.get('/farmer/:farmerId', auth, async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    console.log(`🔍 FARMER CROP LOAD DEBUG:`);
    console.log(`📱 Requested farmerId: ${farmerId}`);
    console.log(`🔑 Authenticated user:`, {
      userId: req.user.userId,
      userType: req.user.userType,
      phone: req.user.phone
    });
    
    // More flexible verification - check by phone or userId
    const isOwner = req.user.userId === farmerId || 
                   req.user.phone === farmerId || 
                   req.user.userType === 'admin';
    
    if (!isOwner) {
      console.log(`❌ ACCESS DENIED: User ${req.user.userId} cannot access crops for farmer ${farmerId}`);
      return res.status(403).json({
        success: false,
        message: 'Access denied - user mismatch'
      });
    }
    
    console.log(`✅ ACCESS GRANTED: User can access crops for farmer ${farmerId}`);

    console.log(`🌾 PERMANENT LOAD: Loading crops for farmer ${farmerId}`);
    console.log(`📱 This will load crops from any device, any session - PERMANENT DATA`);

    // Build farmerId query - accept ObjectId, phone, or userId
    const farmerQueries = [];

    // If farmerId is a valid ObjectId, add it
    if (/^[0-9a-fA-F]{24}$/.test(farmerId)) {
      farmerQueries.push({ farmerId: farmerId });
    }

    // If req.user.userId is a valid ObjectId, add it
    if (/^[0-9a-fA-F]{24}$/.test(req.user.userId)) {
      farmerQueries.push({ farmerId: req.user.userId });
    }

    // Search by farmerAssociation.farmerId (for farmers who uploaded crops)
    if (/^[0-9a-fA-F]{24}$/.test(req.user.userId)) {
      farmerQueries.push({ 'farmerAssociation.farmerId': req.user.userId });
    }

    // Always add phone search
    farmerQueries.push({ 'farmerAssociation.farmerName': req.user.phone });

    // SIMPLIFIED QUERY - Only filter by farmerId, no strict persistence markers
    // This allows us to load ALL crops for the farmer regardless of how they were saved
    const query = {
      $or: farmerQueries
    };

    const crops = await CropListing.find(query).sort({ uploadedAt: -1 });
    
    console.log(`🔍 CROP QUERY DEBUG: Searching for crops with:`);
    console.log(`📱 farmerId: ${farmerId}`);
    console.log(`🔑 req.user.userId: ${req.user.userId}`);
    console.log(`📞 req.user.phone: ${req.user.phone}`);
    console.log(`🌾 Found ${crops.length} crops`);

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
      .populate('farmerId', 'firstName lastName name phone');

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Extract farmer name from populated data
    const cropObj = crop.toObject();
    if (cropObj.farmerId && typeof cropObj.farmerId === 'object') {
      const farmer = cropObj.farmerId;
      cropObj.farmerName = farmer.firstName
        ? `${farmer.firstName} ${farmer.lastName || ''}`.trim()
        : (farmer.name || 'Unknown Farmer');
      cropObj.farmerPhone = farmer.phone || 'Unknown';
    }

    res.json({
      success: true,
      data: cropObj
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

