const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

/**
 * GET /api/analytics/buyer
 * Get real-time analytics for a buyer based on their actual orders from database
 */
router.get('/buyer', auth, async (req, res) => {
  try {
    const buyerId = req.user.userId;

    // Fetch all orders for this buyer from database
    const orders = await Order.find({ buyerId })
      .populate('farmerId', 'firstName lastName farmName')
      .populate('listingId', 'cropName category')
      .sort({ createdAt: -1 })
      .lean();

    // If no orders, return empty analytics
    if (orders.length === 0) {
      return res.json({
        success: true,
        data: {
          totalSpent: 0,
          totalOrders: 0,
          completedOrders: 0,
          pendingOrders: 0,
          cancelledOrders: 0,
          averageOrderValue: 0,
          uniqueSuppliers: 0,
          orderCompletionRate: 0,
          monthlyData: [],
          categoryData: [],
          topSuppliers: []
        }
      });
    }

    // Calculate analytics from real orders
    const analytics = calculateBuyerAnalytics(orders);

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
});

/**
 * Calculate comprehensive analytics from orders
 */
function calculateBuyerAnalytics(orders) {
  // Basic metrics
  const totalSpent = orders.reduce((sum, order) =>
    sum + (order.orderDetails?.totalAmount || order.payment?.amount || 0), 0
  );

  const totalOrders = orders.length;

  const completedOrders = orders.filter(o =>
    o.status?.current === 'delivered' || o.status?.current === 'completed'
  ).length;

  const pendingOrders = orders.filter(o =>
    ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'in_transit'].includes(o.status?.current)
  ).length;

  const cancelledOrders = orders.filter(o =>
    o.status?.current === 'cancelled' || o.status?.current === 'returned'
  ).length;

  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  // Count unique suppliers (farmers)
  const uniqueSuppliers = new Set(
    orders.map(o => o.farmerId?._id?.toString() || o.farmerId?.toString()).filter(Boolean)
  ).size;

  const orderCompletionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  // Monthly data (last 12 months)
  const monthlyData = calculateMonthlyData(orders);

  // Category breakdown
  const categoryData = calculateCategoryData(orders);

  // Top suppliers
  const topSuppliers = calculateTopSuppliers(orders);

  return {
    totalSpent,
    totalOrders,
    completedOrders,
    pendingOrders,
    cancelledOrders,
    averageOrderValue,
    uniqueSuppliers,
    orderCompletionRate,
    monthlyData,
    categoryData,
    topSuppliers
  };
}

/**
 * Calculate monthly trends for last 12 months
 */
function calculateMonthlyData(orders) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthMap = new Map();

  // Get last 12 months
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    monthMap.set(key, {
      month: monthNames[date.getMonth()],
      year: date.getFullYear(),
      orders: 0,
      spent: 0,
      suppliers: new Set()
    });
  }

  // Populate with actual data
  orders.forEach(order => {
    const date = new Date(order.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (monthMap.has(key)) {
      const monthData = monthMap.get(key);
      monthData.orders += 1;
      monthData.spent += order.orderDetails?.totalAmount || order.payment?.amount || 0;

      const farmerId = order.farmerId?._id?.toString() || order.farmerId?.toString();
      if (farmerId) {
        monthData.suppliers.add(farmerId);
      }
    }
  });

  // Convert to array and format
  return Array.from(monthMap.values()).map(data => ({
    month: data.month,
    year: data.year,
    orders: data.orders,
    spent: data.spent,
    suppliers: data.suppliers.size
  }));
}

/**
 * Calculate spending by category
 */
function calculateCategoryData(orders) {
  const categoryMap = new Map();

  orders.forEach(order => {
    const category = order.listingId?.category || order.orderDetails?.category || 'Others';
    const amount = order.orderDetails?.totalAmount || order.payment?.amount || 0;

    if (!categoryMap.has(category)) {
      categoryMap.set(category, {
        category,
        orders: 0,
        spent: 0
      });
    }

    const catData = categoryMap.get(category);
    catData.orders += 1;
    catData.spent += amount;
  });

  // Sort by spending and return all categories
  return Array.from(categoryMap.values())
    .sort((a, b) => b.spent - a.spent);
}

/**
 * Calculate top suppliers by spending
 */
function calculateTopSuppliers(orders) {
  const supplierMap = new Map();

  orders.forEach(order => {
    const farmerId = order.farmerId?._id?.toString() || order.farmerId?.toString();
    if (!farmerId) return;

    const farmerName = order.farmerId?.firstName && order.farmerId?.lastName
      ? `${order.farmerId.firstName} ${order.farmerId.lastName}`
      : order.farmerId?.farmName || 'Unknown Supplier';

    const amount = order.orderDetails?.totalAmount || order.payment?.amount || 0;

    if (!supplierMap.has(farmerId)) {
      supplierMap.set(farmerId, {
        farmerId,
        farmerName,
        orders: 0,
        spent: 0
      });
    }

    const supplier = supplierMap.get(farmerId);
    supplier.orders += 1;
    supplier.spent += amount;
  });

  // Sort by spending and return top 10
  return Array.from(supplierMap.values())
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 10);
}

/**
 * GET /api/analytics/buyer/recent-activity
 * Get recent order activity for buyer
 */
router.get('/buyer/recent-activity', auth, async (req, res) => {
  try {
    const buyerId = req.user.userId;
    const limit = parseInt(req.query.limit) || 10;

    const recentOrders = await Order.find({ buyerId })
      .populate('farmerId', 'firstName lastName farmName')
      .populate('listingId', 'cropName')
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select('orderId orderDetails status payment createdAt updatedAt')
      .lean();

    const activities = recentOrders.map(order => {
      const statusMap = {
        'delivered': { action: 'Order delivered', type: 'success' },
        'completed': { action: 'Order completed', type: 'success' },
        'confirmed': { action: 'Order confirmed', type: 'info' },
        'pending': { action: 'Order placed', type: 'info' },
        'cancelled': { action: 'Order cancelled', type: 'error' },
        'in_transit': { action: 'Order in transit', type: 'info' }
      };

      const status = statusMap[order.status?.current] || { action: 'Order updated', type: 'info' };
      const farmerName = order.farmerId?.firstName
        ? `${order.farmerId.firstName} ${order.farmerId.lastName}`
        : order.farmerId?.farmName || 'Unknown';

      return {
        action: status.action,
        details: `${order.orderId} - ${order.orderDetails?.cropName || 'Crop'} from ${farmerName}`,
        time: order.updatedAt,
        type: status.type,
        amount: order.orderDetails?.totalAmount || order.payment?.amount || 0
      };
    });

    res.json({
      success: true,
      data: activities
    });

  } catch (error) {
    console.error('Recent activity fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent activity'
    });
  }
});

module.exports = router;
