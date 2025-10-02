const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const IoTService = require('../models/IoTService');
const DroneService = require('../models/DroneService');
const SeedService = require('../models/SeedService');
const AdvisoryService = require('../models/AdvisoryService');

// ============ IoT SERVICE ROUTES ============

// Request IoT Service
router.post('/iot', auth, async (req, res) => {
  try {
    const iotService = new IoTService({
      ...req.body,
      farmerId: req.user.userId,
      farmerName: req.body.farmerName || 'Unknown Farmer',
      farmerPhone: req.user.phone
    });

    await iotService.save();

    res.json({
      success: true,
      data: iotService,
      message: 'IoT service request submitted successfully'
    });
  } catch (error) {
    console.error('Error creating IoT service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create IoT service request',
      error: error.message
    });
  }
});

// Get farmer's IoT services
router.get('/iot/farmer/:farmerId', auth, async (req, res) => {
  try {
    const { farmerId } = req.params;

    if (req.user.userId !== farmerId && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const services = await IoTService.find({ farmerId }).sort({ requestedAt: -1 });

    res.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    console.error('Error fetching IoT services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch IoT services',
      error: error.message
    });
  }
});

// Update IoT service status
router.put('/iot/:serviceId', auth, async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updateData = req.body;

    const service = await IoTService.findByIdAndUpdate(
      serviceId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'IoT service not found'
      });
    }

    res.json({
      success: true,
      data: service,
      message: 'IoT service updated successfully'
    });
  } catch (error) {
    console.error('Error updating IoT service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update IoT service',
      error: error.message
    });
  }
});

// ============ DRONE SERVICE ROUTES ============

// Request Drone Service
router.post('/drone', auth, async (req, res) => {
  try {
    const droneService = new DroneService({
      ...req.body,
      farmerId: req.user.userId,
      farmerName: req.body.farmerName || 'Unknown Farmer',
      farmerPhone: req.user.phone
    });

    await droneService.save();

    res.json({
      success: true,
      data: droneService,
      message: 'Drone service request submitted successfully'
    });
  } catch (error) {
    console.error('Error creating drone service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create drone service request',
      error: error.message
    });
  }
});

// Get farmer's drone services
router.get('/drone/farmer/:farmerId', auth, async (req, res) => {
  try {
    const { farmerId } = req.params;

    if (req.user.userId !== farmerId && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const services = await DroneService.find({ farmerId }).sort({ requestedAt: -1 });

    res.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    console.error('Error fetching drone services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch drone services',
      error: error.message
    });
  }
});

// Update drone service
router.put('/drone/:serviceId', auth, async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updateData = req.body;

    const service = await DroneService.findByIdAndUpdate(
      serviceId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Drone service not found'
      });
    }

    res.json({
      success: true,
      data: service,
      message: 'Drone service updated successfully'
    });
  } catch (error) {
    console.error('Error updating drone service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update drone service',
      error: error.message
    });
  }
});

// ============ SEED/FERTILIZER SERVICE ROUTES ============

// Create seed/fertilizer order
router.post('/seeds', auth, async (req, res) => {
  try {
    const seedService = new SeedService({
      ...req.body,
      farmerId: req.user.userId,
      farmerName: req.body.farmerName || 'Unknown Farmer',
      farmerPhone: req.user.phone
    });

    await seedService.save();

    res.json({
      success: true,
      data: seedService,
      message: 'Seed/fertilizer order placed successfully'
    });
  } catch (error) {
    console.error('Error creating seed order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create seed order',
      error: error.message
    });
  }
});

// Get farmer's seed orders
router.get('/seeds/farmer/:farmerId', auth, async (req, res) => {
  try {
    const { farmerId } = req.params;

    if (req.user.userId !== farmerId && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const orders = await SeedService.find({ farmerId }).sort({ orderedAt: -1 });

    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Error fetching seed orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch seed orders',
      error: error.message
    });
  }
});

// Update seed order
router.put('/seeds/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const updateData = req.body;

    const order = await SeedService.findByIdAndUpdate(
      orderId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Seed order not found'
      });
    }

    res.json({
      success: true,
      data: order,
      message: 'Seed order updated successfully'
    });
  } catch (error) {
    console.error('Error updating seed order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update seed order',
      error: error.message
    });
  }
});

// ============ ADVISORY SERVICE ROUTES ============

// Request advisory consultation
router.post('/advisory', auth, async (req, res) => {
  try {
    const advisoryService = new AdvisoryService({
      ...req.body,
      farmerId: req.user.userId,
      farmerName: req.body.farmerName || 'Unknown Farmer',
      farmerPhone: req.user.phone
    });

    await advisoryService.save();

    res.json({
      success: true,
      data: advisoryService,
      message: 'Advisory consultation request submitted successfully'
    });
  } catch (error) {
    console.error('Error creating advisory request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create advisory request',
      error: error.message
    });
  }
});

// Get farmer's advisory consultations
router.get('/advisory/farmer/:farmerId', auth, async (req, res) => {
  try {
    const { farmerId } = req.params;

    if (req.user.userId !== farmerId && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const consultations = await AdvisoryService.find({ farmerId }).sort({ requestedAt: -1 });

    res.json({
      success: true,
      data: consultations,
      count: consultations.length
    });
  } catch (error) {
    console.error('Error fetching advisory consultations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch advisory consultations',
      error: error.message
    });
  }
});

// Update advisory consultation
router.put('/advisory/:consultationId', auth, async (req, res) => {
  try {
    const { consultationId } = req.params;
    const updateData = req.body;

    const consultation = await AdvisoryService.findByIdAndUpdate(
      consultationId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Advisory consultation not found'
      });
    }

    res.json({
      success: true,
      data: consultation,
      message: 'Advisory consultation updated successfully'
    });
  } catch (error) {
    console.error('Error updating advisory consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update advisory consultation',
      error: error.message
    });
  }
});

// ============ COMBINED ROUTES ============

// Get all services for a farmer
router.get('/farmer/:farmerId/all', auth, async (req, res) => {
  try {
    const { farmerId } = req.params;

    if (req.user.userId !== farmerId && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const [iotServices, droneServices, seedOrders, advisoryConsultations] = await Promise.all([
      IoTService.find({ farmerId }).sort({ requestedAt: -1 }).limit(10),
      DroneService.find({ farmerId }).sort({ requestedAt: -1 }).limit(10),
      SeedService.find({ farmerId }).sort({ orderedAt: -1 }).limit(10),
      AdvisoryService.find({ farmerId }).sort({ requestedAt: -1 }).limit(10)
    ]);

    res.json({
      success: true,
      data: {
        iot: iotServices,
        drone: droneServices,
        seeds: seedOrders,
        advisory: advisoryConsultations
      },
      counts: {
        iot: iotServices.length,
        drone: droneServices.length,
        seeds: seedOrders.length,
        advisory: advisoryConsultations.length
      }
    });
  } catch (error) {
    console.error('Error fetching all services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
});

module.exports = router;
