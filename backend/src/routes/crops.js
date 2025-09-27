const express = require('express');
const router = express.Router();
const { CropListing, Farmer, User } = require('../models');
const auth = require('../middleware/auth');

// Create new crop listing
router.post('/', auth, async (req, res) => {
  try {
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
      images
    } = req.body;

    // Get farmer ID from authenticated user
    const farmerId = req.user.userId;

    // Create new crop listing with PERMANENT PERSISTENCE
    const cropListing = new CropListing({
      farmerId,
      cropName,
      cropType,
      variety,
      quantity: parseInt(quantity),
      unit,
      quality,
      harvestDate: new Date(harvestDate),
      price: parseFloat(price),
      organic: organic === 'true',
      location,
      description,
      images: images || [],
      status: 'available',
      uploadedAt: new Date(),
      // PERMANENT PERSISTENCE MARKERS
      isPermanent: true,
      crossDeviceAccess: true,
      sessionIndependent: true,
      lastUpdated: new Date(),
      // Add farmer association for permanent linking
      farmerAssociation: {
        farmerId: farmerId,
        farmerName: req.body.farmerName || 'Unknown Farmer',
        permanentLink: true
      }
    });

    await cropListing.save();

    // Update farmer's crop count
    await Farmer.findOneAndUpdate(
      { userId: farmerId },
      { $inc: { 'activity.totalListings': 1, 'activity.activeListings': 1 } }
    );

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

// Get all crops for marketplace
router.get('/marketplace', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, organic, quality } = req.query;
    
    let query = { status: 'available' };
    
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
      .populate('farmerId', 'profile.fullName address.current.city address.current.state')
      .sort({ uploadedAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: crops,
      count: crops.length
    });
  } catch (error) {
    console.error('Error fetching marketplace crops:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crops',
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

module.exports = router;

