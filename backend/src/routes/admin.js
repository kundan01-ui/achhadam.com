const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const IoTService = require('../models/IoTService');
const DroneService = require('../models/DroneService');
const SeedService = require('../models/SeedService');
const AdvisoryService = require('../models/AdvisoryService');
const User = require('../models/User');

// Middleware to check admin access
const adminAuth = async (req, res, next) => {
  if (req.user.userType !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// ============ DASHBOARD STATISTICS ============

// Get comprehensive dashboard stats
router.get('/dashboard/stats', auth, adminAuth, async (req, res) => {
  try {
    // Fetch all services in parallel
    const [iotServices, droneServices, seedOrders, advisoryConsultations] = await Promise.all([
      IoTService.find({}),
      DroneService.find({}),
      SeedService.find({}),
      AdvisoryService.find({})
    ]);

    // Calculate statistics for each service type
    const calculateStats = (services) => {
      return {
        total: services.length,
        pending: services.filter(s => s.status === 'pending').length,
        active: services.filter(s => s.status === 'in_progress' || s.status === 'active').length,
        completed: services.filter(s => s.status === 'completed').length
      };
    };

    const stats = {
      iot: calculateStats(iotServices),
      drone: calculateStats(droneServices),
      seeds: calculateStats(seedOrders),
      advisory: calculateStats(advisoryConsultations)
    };

    // Get recent requests (last 20 across all services)
    const recentIoT = iotServices.slice(-10).map(s => ({
      id: s._id,
      type: 'iot',
      farmerName: s.farmerName,
      farmerPhone: s.farmerPhone,
      status: s.status,
      requestedAt: s.requestedAt,
      urgency: s.urgency,
      amount: s.servicePlan?.monthlyFee
    }));

    const recentDrone = droneServices.slice(-10).map(s => ({
      id: s._id,
      type: 'drone',
      farmerName: s.farmerName,
      farmerPhone: s.farmerPhone,
      status: s.status,
      requestedAt: s.requestedAt,
      urgency: s.schedule?.urgency,
      amount: s.pricing?.totalCost
    }));

    const recentSeeds = seedOrders.slice(-10).map(s => ({
      id: s._id,
      type: 'seeds',
      farmerName: s.farmerName,
      farmerPhone: s.farmerPhone,
      status: s.status,
      requestedAt: s.orderedAt,
      amount: s.totalAmount
    }));

    const recentAdvisory = advisoryConsultations.slice(-10).map(s => ({
      id: s._id,
      type: 'advisory',
      farmerName: s.farmerName,
      farmerPhone: s.farmerPhone,
      status: s.status,
      requestedAt: s.requestedAt,
      urgency: s.problemDetails?.urgency,
      amount: s.pricing?.consultationFee
    }));

    // Combine and sort by date
    const recentRequests = [...recentIoT, ...recentDrone, ...recentSeeds, ...recentAdvisory]
      .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt))
      .slice(0, 20);

    res.json({
      success: true,
      stats,
      recentRequests
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

// ============ IOT SERVICE MANAGEMENT ============

// Get all IoT services with filters
router.get('/iot', auth, adminAuth, async (req, res) => {
  try {
    const { status, urgency, sortBy = 'requestedAt', order = 'desc' } = req.query;

    let query = {};
    if (status) query.status = status;
    if (urgency) query.urgency = urgency;

    const services = await IoTService.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 });

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

// Get single IoT service with full details
router.get('/iot/:serviceId', auth, adminAuth, async (req, res) => {
  try {
    const service = await IoTService.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'IoT service not found'
      });
    }

    // Get farmer details
    const farmer = await User.findById(service.farmerId);

    res.json({
      success: true,
      data: {
        service,
        farmer: farmer ? {
          name: farmer.firstName ? `${farmer.firstName} ${farmer.lastName || ''}`.trim() : farmer.name,
          phone: farmer.phone,
          email: farmer.email,
          address: farmer.address
        } : null
      }
    });
  } catch (error) {
    console.error('Error fetching IoT service details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service details',
      error: error.message
    });
  }
});

// Update IoT service (assign partner, update status, etc.)
router.put('/iot/:serviceId', auth, adminAuth, async (req, res) => {
  try {
    const service = await IoTService.findByIdAndUpdate(
      req.params.serviceId,
      { ...req.body, updatedAt: new Date() },
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

// ============ DRONE SERVICE MANAGEMENT ============

// Get all drone services with filters
router.get('/drone', auth, adminAuth, async (req, res) => {
  try {
    const { status, urgency, sortBy = 'requestedAt', order = 'desc' } = req.query;

    let query = {};
    if (status) query.status = status;
    if (urgency) query['schedule.urgency'] = urgency;

    const services = await DroneService.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 });

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

// Get single drone service with full details
router.get('/drone/:serviceId', auth, adminAuth, async (req, res) => {
  try {
    const service = await DroneService.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Drone service not found'
      });
    }

    const farmer = await User.findById(service.farmerId);

    res.json({
      success: true,
      data: {
        service,
        farmer: farmer ? {
          name: farmer.firstName ? `${farmer.firstName} ${farmer.lastName || ''}`.trim() : farmer.name,
          phone: farmer.phone,
          email: farmer.email,
          address: farmer.address
        } : null
      }
    });
  } catch (error) {
    console.error('Error fetching drone service details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service details',
      error: error.message
    });
  }
});

// Update drone service
router.put('/drone/:serviceId', auth, adminAuth, async (req, res) => {
  try {
    const service = await DroneService.findByIdAndUpdate(
      req.params.serviceId,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

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

// ============ SEED/FERTILIZER ORDER MANAGEMENT ============

// Get all seed orders with filters
router.get('/seeds', auth, adminAuth, async (req, res) => {
  try {
    const { status, sortBy = 'orderedAt', order = 'desc' } = req.query;

    let query = {};
    if (status) query.status = status;

    const orders = await SeedService.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 });

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

// Get single seed order with full details
router.get('/seeds/:orderId', auth, adminAuth, async (req, res) => {
  try {
    const order = await SeedService.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Seed order not found'
      });
    }

    const farmer = await User.findById(order.farmerId);

    res.json({
      success: true,
      data: {
        order,
        farmer: farmer ? {
          name: farmer.firstName ? `${farmer.firstName} ${farmer.lastName || ''}`.trim() : farmer.name,
          phone: farmer.phone,
          email: farmer.email,
          address: farmer.address
        } : null
      }
    });
  } catch (error) {
    console.error('Error fetching seed order details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message
    });
  }
});

// Update seed order
router.put('/seeds/:orderId', auth, adminAuth, async (req, res) => {
  try {
    const order = await SeedService.findByIdAndUpdate(
      req.params.orderId,
      { ...req.body, updatedAt: new Date() },
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

// ============ ADVISORY SERVICE MANAGEMENT ============

// Get all advisory consultations with filters
router.get('/advisory', auth, adminAuth, async (req, res) => {
  try {
    const { status, urgency, consultationType, sortBy = 'requestedAt', order = 'desc' } = req.query;

    let query = {};
    if (status) query.status = status;
    if (urgency) query['problemDetails.urgency'] = urgency;
    if (consultationType) query.consultationType = consultationType;

    const consultations = await AdvisoryService.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 });

    res.json({
      success: true,
      data: consultations,
      count: consultations.length
    });
  } catch (error) {
    console.error('Error fetching advisory consultations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultations',
      error: error.message
    });
  }
});

// Get single advisory consultation with full details
router.get('/advisory/:consultationId', auth, adminAuth, async (req, res) => {
  try {
    const consultation = await AdvisoryService.findById(req.params.consultationId);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Advisory consultation not found'
      });
    }

    const farmer = await User.findById(consultation.farmerId);

    res.json({
      success: true,
      data: {
        consultation,
        farmer: farmer ? {
          name: farmer.firstName ? `${farmer.firstName} ${farmer.lastName || ''}`.trim() : farmer.name,
          phone: farmer.phone,
          email: farmer.email,
          address: farmer.address
        } : null
      }
    });
  } catch (error) {
    console.error('Error fetching consultation details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultation details',
      error: error.message
    });
  }
});

// Update advisory consultation (assign expert, add response, etc.)
router.put('/advisory/:consultationId', auth, adminAuth, async (req, res) => {
  try {
    const consultation = await AdvisoryService.findByIdAndUpdate(
      req.params.consultationId,
      { ...req.body, updatedAt: new Date() },
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
      message: 'Consultation updated successfully'
    });
  } catch (error) {
    console.error('Error updating consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update consultation',
      error: error.message
    });
  }
});

// ============ FARMER MANAGEMENT ============

// Get all farmers
router.get('/farmers', auth, adminAuth, async (req, res) => {
  try {
    const farmers = await User.find({ userType: 'farmer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: farmers,
      count: farmers.length
    });
  } catch (error) {
    console.error('Error fetching farmers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch farmers',
      error: error.message
    });
  }
});

// Get farmer details with all their service requests
router.get('/farmers/:farmerId', auth, adminAuth, async (req, res) => {
  try {
    const farmer = await User.findById(req.params.farmerId).select('-password');

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Fetch all services for this farmer
    const [iotServices, droneServices, seedOrders, advisoryConsultations] = await Promise.all([
      IoTService.find({ farmerId: req.params.farmerId }),
      DroneService.find({ farmerId: req.params.farmerId }),
      SeedService.find({ farmerId: req.params.farmerId }),
      AdvisoryService.find({ farmerId: req.params.farmerId })
    ]);

    res.json({
      success: true,
      data: {
        farmer,
        services: {
          iot: iotServices,
          drone: droneServices,
          seeds: seedOrders,
          advisory: advisoryConsultations
        }
      }
    });
  } catch (error) {
    console.error('Error fetching farmer details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch farmer details',
      error: error.message
    });
  }
});

module.exports = router;
