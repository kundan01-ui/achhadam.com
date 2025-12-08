const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

/**
 * GET /api/farmer-analytics/revenue
 * Get complete revenue analytics for a farmer from real orders
 */
router.get('/revenue', auth, async (req, res) => {
  try {
    const farmerId = req.user.userId;

    console.log('💰 FARMER ANALYTICS: Fetching revenue data for farmer:', farmerId);

    // Fetch all orders for this farmer
    const orders = await Order.find({ farmerId })
      .populate('buyerId', 'firstName lastName businessName')
      .populate('listingId', 'cropName category')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Found ${orders.length} orders for farmer`);

    // If no orders, return empty analytics
    if (orders.length === 0) {
      return res.json({
        success: true,
        data: {
          totalRevenue: 0,
          totalOrders: 0,
          paidOrders: 0,
          pendingOrders: 0,
          cancelledOrders: 0,
          averageOrderValue: 0,
          uniqueBuyers: 0,
          orderFulfillmentRate: 0,
          monthlyRevenue: [],
          cropRevenue: [],
          topBuyers: [],
          paymentMethodBreakdown: [],
          revenueByStatus: {
            paid: 0,
            pending: 0,
            failed: 0,
            refunded: 0
          }
        }
      });
    }

    // Calculate analytics
    const analytics = calculateFarmerAnalytics(orders);

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('❌ FARMER ANALYTICS ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch farmer analytics',
      message: error.message
    });
  }
});

/**
 * Calculate comprehensive farmer analytics from orders
 */
function calculateFarmerAnalytics(orders) {
  // Total revenue (only from paid orders)
  const totalRevenue = orders.reduce((sum, order) =>
    order.payment.status === 'paid' ? sum + order.payment.amount : sum, 0
  );

  const totalOrders = orders.length;

  const paidOrders = orders.filter(o => o.payment.status === 'paid').length;

  const pendingOrders = orders.filter(o =>
    ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'in_transit'].includes(o.status.current)
  ).length;

  const cancelledOrders = orders.filter(o =>
    o.status.current === 'cancelled' || o.status.current === 'returned'
  ).length;

  const deliveredOrders = orders.filter(o => o.status.current === 'delivered').length;

  const averageOrderValue = paidOrders > 0 ? totalRevenue / paidOrders : 0;

  // Count unique buyers
  const uniqueBuyers = new Set(
    orders.map(o => o.buyerId?._id?.toString() || o.buyerId?.toString()).filter(Boolean)
  ).size;

  const orderFulfillmentRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

  // Monthly revenue (last 12 months)
  const monthlyRevenue = calculateMonthlyRevenue(orders);

  // Revenue by crop
  const cropRevenue = calculateCropRevenue(orders);

  // Top buyers by spending
  const topBuyers = calculateTopBuyers(orders);

  // Payment method breakdown
  const paymentMethodBreakdown = calculatePaymentMethodBreakdown(orders);

  // Revenue by payment status
  const revenueByStatus = {
    paid: orders.reduce((sum, o) => o.payment.status === 'paid' ? sum + o.payment.amount : sum, 0),
    pending: orders.reduce((sum, o) => o.payment.status === 'pending' ? sum + o.payment.amount : sum, 0),
    failed: orders.reduce((sum, o) => o.payment.status === 'failed' ? sum + o.payment.amount : sum, 0),
    refunded: orders.reduce((sum, o) => o.payment.status === 'refunded' ? sum + o.payment.refundAmount : sum, 0)
  };

  return {
    totalRevenue,
    totalOrders,
    paidOrders,
    pendingOrders,
    cancelledOrders,
    deliveredOrders,
    averageOrderValue,
    uniqueBuyers,
    orderFulfillmentRate,
    monthlyRevenue,
    cropRevenue,
    topBuyers,
    paymentMethodBreakdown,
    revenueByStatus
  };
}

/**
 * Calculate monthly revenue for last 12 months
 */
function calculateMonthlyRevenue(orders) {
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
      revenue: 0,
      orders: 0,
      buyers: new Set()
    });
  }

  // Populate with actual data (only paid orders)
  orders.forEach(order => {
    if (order.payment.status === 'paid') {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;

      if (monthMap.has(key)) {
        const monthData = monthMap.get(key);
        monthData.revenue += order.payment.amount;
        monthData.orders += 1;

        const buyerId = order.buyerId?._id?.toString() || order.buyerId?.toString();
        if (buyerId) {
          monthData.buyers.add(buyerId);
        }
      }
    }
  });

  // Convert to array and format
  return Array.from(monthMap.values()).map(data => ({
    month: data.month,
    year: data.year,
    revenue: data.revenue,
    orders: data.orders,
    buyers: data.buyers.size
  }));
}

/**
 * Calculate revenue by crop type
 */
function calculateCropRevenue(orders) {
  const cropMap = new Map();

  orders.forEach(order => {
    if (order.payment.status === 'paid') {
      const cropName = order.orderDetails?.cropName || order.listingId?.cropName || 'Unknown';
      const revenue = order.payment.amount;

      if (!cropMap.has(cropName)) {
        cropMap.set(cropName, {
          cropName,
          revenue: 0,
          orders: 0,
          quantity: 0,
          unit: order.orderDetails?.unit || 'kg'
        });
      }

      const cropData = cropMap.get(cropName);
      cropData.revenue += revenue;
      cropData.orders += 1;
      cropData.quantity += order.orderDetails?.quantity || 0;
    }
  });

  // Sort by revenue and return
  return Array.from(cropMap.values())
    .sort((a, b) => b.revenue - a.revenue);
}

/**
 * Calculate top buyers by revenue
 */
function calculateTopBuyers(orders) {
  const buyerMap = new Map();

  orders.forEach(order => {
    if (order.payment.status === 'paid') {
      const buyerId = order.buyerId?._id?.toString() || order.buyerId?.toString();
      if (!buyerId) return;

      const buyerName = order.buyerId?.firstName && order.buyerId?.lastName
        ? `${order.buyerId.firstName} ${order.buyerId.lastName}`
        : order.buyerId?.businessName || 'Unknown Buyer';

      const revenue = order.payment.amount;

      if (!buyerMap.has(buyerId)) {
        buyerMap.set(buyerId, {
          buyerId,
          buyerName,
          revenue: 0,
          orders: 0
        });
      }

      const buyer = buyerMap.get(buyerId);
      buyer.revenue += revenue;
      buyer.orders += 1;
    }
  });

  // Sort by revenue and return top 10
  return Array.from(buyerMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
}

/**
 * Calculate payment method breakdown
 */
function calculatePaymentMethodBreakdown(orders) {
  const methodMap = new Map();

  orders.forEach(order => {
    if (order.payment.status === 'paid') {
      const method = order.payment.method || 'unknown';
      const amount = order.payment.amount;

      if (!methodMap.has(method)) {
        methodMap.set(method, {
          method,
          count: 0,
          totalAmount: 0
        });
      }

      const methodData = methodMap.get(method);
      methodData.count += 1;
      methodData.totalAmount += amount;
    }
  });

  return Array.from(methodMap.values())
    .sort((a, b) => b.totalAmount - a.totalAmount);
}

/**
 * GET /api/farmer-analytics/recent-sales
 * Get recent sales activity for farmer
 */
router.get('/recent-sales', auth, async (req, res) => {
  try {
    const farmerId = req.user.userId;
    const limit = parseInt(req.query.limit) || 10;

    const recentOrders = await Order.find({ farmerId })
      .populate('buyerId', 'firstName lastName businessName')
      .populate('listingId', 'cropName')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('orderId orderDetails payment status createdAt updatedAt')
      .lean();

    const activities = recentOrders.map(order => {
      const statusMap = {
        'delivered': { action: 'Order delivered', type: 'success' },
        'confirmed': { action: 'New order confirmed', type: 'info' },
        'paid': { action: 'Payment received', type: 'success' },
        'pending': { action: 'Order pending', type: 'warning' },
        'cancelled': { action: 'Order cancelled', type: 'error' }
      };

      const status = order.payment.status === 'paid'
        ? statusMap['paid']
        : statusMap[order.status?.current] || { action: 'Order updated', type: 'info' };

      const buyerName = order.buyerId?.firstName
        ? `${order.buyerId.firstName} ${order.buyerId.lastName}`
        : order.buyerId?.businessName || 'Unknown';

      return {
        action: status.action,
        details: `${order.orderId} - ${order.orderDetails?.cropName || 'Crop'} to ${buyerName}`,
        time: order.updatedAt,
        type: status.type,
        amount: order.payment?.amount || 0,
        paymentStatus: order.payment?.status
      };
    });

    res.json({
      success: true,
      data: activities
    });

  } catch (error) {
    console.error('❌ RECENT SALES ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent sales'
    });
  }
});

module.exports = router;
