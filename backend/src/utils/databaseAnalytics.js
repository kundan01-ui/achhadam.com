const { User, Farmer, Buyer, Transporter, CropListing, Order, Activity, Payment } = require('../models');

// User Analytics
const getUserAnalytics = async (timeRange = '30d') => {
  try {
    const dateFilter = getDateFilter(timeRange);
    
    const [
      totalUsers,
      newUsers,
      activeUsers,
      userTypes,
      kycStats,
      locationStats
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: dateFilter }),
      User.countDocuments({ 
        'activity.lastActivityAt': dateFilter,
        'accountStatus.isActive': true 
      }),
      User.aggregate([
        { $group: { _id: '$userType', count: { $sum: 1 } } }
      ]),
      User.aggregate([
        { $group: { _id: '$verification.isKYCCompleted', count: { $sum: 1 } } }
      ]),
      User.aggregate([
        { $group: { _id: '$address.current.state', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    return {
      totalUsers,
      newUsers,
      activeUsers,
      userTypes,
      kycStats,
      locationStats
    };
  } catch (error) {
    console.error('Error getting user analytics:', error);
    throw error;
  }
};

// Farmer Analytics
const getFarmerAnalytics = async (timeRange = '30d') => {
  try {
    const dateFilter = getDateFilter(timeRange);
    
    const [
      totalFarmers,
      activeFarmers,
      listingsStats,
      salesStats,
      topFarmers
    ] = await Promise.all([
      Farmer.countDocuments(),
      Farmer.countDocuments({ 'activity.totalListings': { $gt: 0 } }),
      Farmer.aggregate([
        { $group: { 
          _id: null, 
          totalListings: { $sum: '$activity.totalListings' },
          activeListings: { $sum: '$activity.activeListings' },
          avgListings: { $avg: '$activity.totalListings' }
        }}
      ]),
      Farmer.aggregate([
        { $group: { 
          _id: null, 
          totalSales: { $sum: '$activity.totalSales' },
          avgSales: { $avg: '$activity.totalSales' }
        }}
      ]),
      Farmer.find()
        .sort({ 'activity.totalSales': -1 })
        .limit(10)
        .populate('userId', 'profile.fullName email phone')
        .select('userId activity.totalSales activity.totalListings ratings.averageRating')
    ]);

    return {
      totalFarmers,
      activeFarmers,
      listingsStats: listingsStats[0] || {},
      salesStats: salesStats[0] || {},
      topFarmers
    };
  } catch (error) {
    console.error('Error getting farmer analytics:', error);
    throw error;
  }
};

// Buyer Analytics
const getBuyerAnalytics = async (timeRange = '30d') => {
  try {
    const dateFilter = getDateFilter(timeRange);
    
    const [
      totalBuyers,
      activeBuyers,
      ordersStats,
      spendingStats,
      topBuyers
    ] = await Promise.all([
      Buyer.countDocuments(),
      Buyer.countDocuments({ 'activity.totalOrders': { $gt: 0 } }),
      Buyer.aggregate([
        { $group: { 
          _id: null, 
          totalOrders: { $sum: '$activity.totalOrders' },
          avgOrders: { $avg: '$activity.totalOrders' }
        }}
      ]),
      Buyer.aggregate([
        { $group: { 
          _id: null, 
          totalSpent: { $sum: '$activity.totalSpent' },
          avgSpent: { $avg: '$activity.totalSpent' }
        }}
      ]),
      Buyer.find()
        .sort({ 'activity.totalSpent': -1 })
        .limit(10)
        .populate('userId', 'profile.fullName email phone')
        .select('userId activity.totalSpent activity.totalOrders ratings.averageRating')
    ]);

    return {
      totalBuyers,
      activeBuyers,
      ordersStats: ordersStats[0] || {},
      spendingStats: spendingStats[0] || {},
      topBuyers
    };
  } catch (error) {
    console.error('Error getting buyer analytics:', error);
    throw error;
  }
};

// Crop & Listing Analytics
const getCropAnalytics = async (timeRange = '30d') => {
  try {
    const dateFilter = getDateFilter(timeRange);
    
    const [
      totalListings,
      activeListings,
      categoryStats,
      priceStats,
      topCrops
    ] = await Promise.all([
      CropListing.countDocuments(),
      CropListing.countDocuments({ 'status.isActive': true }),
      CropListing.aggregate([
        { $group: { _id: '$cropDetails.category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      CropListing.aggregate([
        { $group: { 
          _id: null, 
          avgPrice: { $avg: '$pricing.pricePerUnit' },
          minPrice: { $min: '$pricing.pricePerUnit' },
          maxPrice: { $max: '$pricing.pricePerUnit' }
        }}
      ]),
      CropListing.find({ 'status.isActive': true })
        .sort({ 'engagement.views': -1 })
        .limit(10)
        .populate('farmerId', 'profile.fullName')
        .select('title cropDetails.name pricing.pricePerUnit engagement.views engagement.orders')
    ]);

    return {
      totalListings,
      activeListings,
      categoryStats,
      priceStats: priceStats[0] || {},
      topCrops
    };
  } catch (error) {
    console.error('Error getting crop analytics:', error);
    throw error;
  }
};

// Order Analytics
const getOrderAnalytics = async (timeRange = '30d') => {
  try {
    const dateFilter = getDateFilter(timeRange);
    
    const [
      totalOrders,
      orderStats,
      statusStats,
      revenueStats,
      recentOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $group: { 
          _id: null, 
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$orderDetails.totalAmount' },
          avgOrderValue: { $avg: '$orderDetails.totalAmount' }
        }}
      ]),
      Order.aggregate([
        { $group: { _id: '$status.current', count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $group: { 
          _id: { 
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          revenue: { $sum: '$orderDetails.totalAmount' },
          orders: { $sum: 1 }
        }},
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('buyerId', 'profile.fullName')
        .populate('farmerId', 'profile.fullName')
        .select('orderDetails status.current createdAt')
    ]);

    return {
      totalOrders,
      orderStats: orderStats[0] || {},
      statusStats,
      revenueStats,
      recentOrders
    };
  } catch (error) {
    console.error('Error getting order analytics:', error);
    throw error;
  }
};

// Activity Analytics
const getActivityAnalytics = async (timeRange = '30d') => {
  try {
    const dateFilter = getDateFilter(timeRange);
    
    const [
      totalActivities,
      activityTypes,
      userActivity,
      deviceStats
    ] = await Promise.all([
      Activity.countDocuments({ timestamp: dateFilter }),
      Activity.aggregate([
        { $match: { timestamp: dateFilter } },
        { $group: { _id: '$activityType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Activity.aggregate([
        { $match: { timestamp: dateFilter } },
        { $group: { _id: '$userId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Activity.aggregate([
        { $match: { timestamp: dateFilter } },
        { $group: { _id: '$activityData.metadata.deviceInfo.deviceType', count: { $sum: 1 } } }
      ])
    ]);

    return {
      totalActivities,
      activityTypes,
      userActivity,
      deviceStats
    };
  } catch (error) {
    console.error('Error getting activity analytics:', error);
    throw error;
  }
};

// Payment Analytics
const getPaymentAnalytics = async (timeRange = '30d') => {
  try {
    const dateFilter = getDateFilter(timeRange);
    
    const [
      totalPayments,
      paymentStats,
      methodStats,
      statusStats,
      revenueStats
    ] = await Promise.all([
      Payment.countDocuments({ createdAt: dateFilter }),
      Payment.aggregate([
        { $match: { createdAt: dateFilter } },
        { $group: { 
          _id: null, 
          totalAmount: { $sum: '$paymentDetails.amount' },
          avgAmount: { $avg: '$paymentDetails.amount' },
          successfulPayments: { 
            $sum: { $cond: [{ $eq: ['$paymentDetails.status', 'completed'] }, 1, 0] }
          }
        }}
      ]),
      Payment.aggregate([
        { $match: { createdAt: dateFilter } },
        { $group: { _id: '$paymentDetails.method', count: { $sum: 1 } } }
      ]),
      Payment.aggregate([
        { $match: { createdAt: dateFilter } },
        { $group: { _id: '$paymentDetails.status', count: { $sum: 1 } } }
      ]),
      Payment.aggregate([
        { $match: { createdAt: dateFilter, 'paymentDetails.status': 'completed' } },
        { $group: { 
          _id: { 
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          revenue: { $sum: '$paymentDetails.amount' },
          transactions: { $sum: 1 }
        }},
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ])
    ]);

    return {
      totalPayments,
      paymentStats: paymentStats[0] || {},
      methodStats,
      statusStats,
      revenueStats
    };
  } catch (error) {
    console.error('Error getting payment analytics:', error);
    throw error;
  }
};

// Helper function to get date filter
const getDateFilter = (timeRange) => {
  const now = new Date();
  const days = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '1y': 365
  };
  
  const daysBack = days[timeRange] || 30;
  return { $gte: new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000)) };
};

// Comprehensive Analytics Dashboard
const getDashboardAnalytics = async (timeRange = '30d') => {
  try {
    const [
      userAnalytics,
      farmerAnalytics,
      buyerAnalytics,
      cropAnalytics,
      orderAnalytics,
      activityAnalytics,
      paymentAnalytics
    ] = await Promise.all([
      getUserAnalytics(timeRange),
      getFarmerAnalytics(timeRange),
      getBuyerAnalytics(timeRange),
      getCropAnalytics(timeRange),
      getOrderAnalytics(timeRange),
      getActivityAnalytics(timeRange),
      getPaymentAnalytics(timeRange)
    ]);

    return {
      users: userAnalytics,
      farmers: farmerAnalytics,
      buyers: buyerAnalytics,
      crops: cropAnalytics,
      orders: orderAnalytics,
      activities: activityAnalytics,
      payments: paymentAnalytics,
      timeRange,
      generatedAt: new Date()
    };
  } catch (error) {
    console.error('Error getting dashboard analytics:', error);
    throw error;
  }
};

module.exports = {
  getUserAnalytics,
  getFarmerAnalytics,
  getBuyerAnalytics,
  getCropAnalytics,
  getOrderAnalytics,
  getActivityAnalytics,
  getPaymentAnalytics,
  getDashboardAnalytics
};









