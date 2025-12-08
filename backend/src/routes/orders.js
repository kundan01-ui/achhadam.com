const express = require('express');
const router = express.Router();
const { Order, Buyer, User } = require('../models');
const auth = require('../middleware/auth');

// Create new order - PERMANENT PERSISTENCE
router.post('/', auth, async (req, res) => {
  try {
    const {
      cropId,
      cropName,
      quantity,
      price,
      totalAmount,
      farmerId,
      farmerName,
      deliveryAddress,
      paymentMethod,
      notes
    } = req.body;

    // Get buyer ID from authenticated user
    const buyerId = req.user.userId;

    // Create new order with PERMANENT PERSISTENCE
    const order = new Order({
      buyerId,
      cropId,
      cropName,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      totalAmount: parseFloat(totalAmount),
      farmerId,
      farmerName,
      deliveryAddress,
      paymentMethod,
      notes,
      status: 'pending',
      orderDate: new Date(),
      // PERMANENT PERSISTENCE MARKERS
      isPermanent: true,
      crossDeviceAccess: true,
      sessionIndependent: true,
      lastUpdated: new Date(),
      // Add buyer association for permanent linking
      buyerAssociation: {
        buyerId: buyerId,
        buyerName: req.body.buyerName || 'Unknown Buyer',
        permanentLink: true
      }
    });

    await order.save();

    // Update buyer's order count
    await Buyer.findOneAndUpdate(
      { userId: buyerId },
      { $inc: { 'activity.totalOrders': 1 } }
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully with permanent persistence',
      data: order,
      persistence: {
        isPermanent: true,
        crossDeviceAccess: true,
        sessionIndependent: true
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Get orders by farmer - PERMANENT DATA LOADING
router.get('/farmer/:farmerId', auth, async (req, res) => {
  try {
    const { farmerId } = req.params;

    // Verify farmer owns the orders
    if (req.user.userId !== farmerId && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    console.log(`🌾 PERMANENT LOAD: Loading orders for farmer ${farmerId}`);
    console.log(`📱 This will load orders from any device, any session - PERMANENT DATA`);

    // Check MongoDB connection before query
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB disconnected, returning empty orders array');
      return res.json({
        success: true,
        data: [],
        count: 0,
        message: 'Database temporarily unavailable. Please try again.',
        warning: 'MongoDB connection lost'
      });
    }

    // Load orders with permanent persistence markers
    const orders = await Order.find({
      farmerId,
      isPermanent: true,
      crossDeviceAccess: true,
      sessionIndependent: true
    })
    .sort({ orderDate: -1 });

    console.log(`✅ PERMANENT LOAD: Found ${orders.length} permanent orders for farmer ${farmerId}`);
    console.log(`🌐 These orders are available across all devices and sessions`);

    res.json({
      success: true,
      data: orders,
      count: orders.length,
      message: 'Permanent orders loaded successfully',
      persistence: {
        isPermanent: true,
        crossDeviceAccess: true,
        sessionIndependent: true
      }
    });
  } catch (error) {
    console.error('Error fetching permanent farmer orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch permanent farmer orders',
      error: error.message,
      data: []
    });
  }
});

// Get orders by buyer - PERMANENT DATA LOADING
router.get('/buyer/:buyerId', auth, async (req, res) => {
  try {
    const { buyerId } = req.params;

    // Verify buyer owns the orders
    if (req.user.userId !== buyerId && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    console.log(`🛒 PERMANENT LOAD: Loading orders for buyer ${buyerId}`);
    console.log(`📱 This will load orders from any device, any session - PERMANENT DATA`);

    // Check MongoDB connection before query
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB disconnected, returning empty orders array');
      return res.json({
        success: true,
        data: [],
        count: 0,
        message: 'Database temporarily unavailable. Please try again.',
        warning: 'MongoDB connection lost'
      });
    }

    // Load orders with permanent persistence markers
    const orders = await Order.find({
      buyerId,
      isPermanent: true,
      crossDeviceAccess: true,
      sessionIndependent: true
    })
    .sort({ orderDate: -1 });

    console.log(`✅ PERMANENT LOAD: Found ${orders.length} permanent orders for buyer ${buyerId}`);
    console.log(`🌐 These orders are available across all devices and sessions`);

    res.json({
      success: true,
      data: orders,
      count: orders.length,
      message: 'Permanent orders loaded successfully',
      persistence: {
        isPermanent: true,
        crossDeviceAccess: true,
        sessionIndependent: true
      }
    });
  } catch (error) {
    console.error('Error fetching permanent buyer orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch permanent buyer orders',
      error: error.message,
      data: []
    });
  }
});

// Get single order by ID
router.get('/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify buyer owns the order
    if (order.buyerId.toString() !== req.user.userId && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// Update order status
router.put('/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const updateData = req.body;

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify buyer owns the order
    if (order.buyerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { 
        ...updateData, 
        lastUpdated: new Date(),
        // Maintain permanent persistence
        isPermanent: true,
        crossDeviceAccess: true,
        sessionIndependent: true
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
});

// Cancel order
router.delete('/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify buyer owns the order
    if (order.buyerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update order status to cancelled instead of deleting
    await Order.findByIdAndUpdate(
      orderId,
      { 
        status: 'cancelled',
        lastUpdated: new Date()
      }
    );

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
});

module.exports = router;




















