import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  AlertCircle,
  Inbox,
  Clock
} from 'lucide-react';
import { apiConfig } from '../../config/apiConfig';

interface RealAnalyticsData {
  totalSpent: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  uniqueSuppliers: number;
  orderCompletionRate: number;
}

interface MonthlyData {
  month: string;
  year: number;
  orders: number;
  spent: number;
  suppliers: number;
}

interface CategoryData {
  category: string;
  orders: number;
  spent: number;
}

interface SupplierData {
  farmerId: string;
  farmerName: string;
  orders: number;
  spent: number;
}

const BuyerAnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('orders');
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<RealAnalyticsData>({
    totalSpent: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    averageOrderValue: 0,
    uniqueSuppliers: 0,
    orderCompletionRate: 0
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [topSuppliers, setTopSuppliers] = useState<SupplierData[]>([]);

  useEffect(() => {
    loadRealAnalytics();
  }, [selectedPeriod]);

  const loadRealAnalytics = async () => {
    setIsLoading(true);

    try {
      console.log('📊 Fetching real analytics from database...');

      // Fetch analytics data from backend API
      const response = await fetch(apiConfig.buildURL('/api/analytics/buyer'), {
        method: 'GET',
        headers: apiConfig.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Analytics fetched successfully:', result);

      if (result.success && result.data) {
        const data = result.data;

        // Set main analytics data
        setAnalyticsData({
          totalSpent: data.totalSpent || 0,
          totalOrders: data.totalOrders || 0,
          completedOrders: data.completedOrders || 0,
          pendingOrders: data.pendingOrders || 0,
          cancelledOrders: data.cancelledOrders || 0,
          averageOrderValue: data.averageOrderValue || 0,
          uniqueSuppliers: data.uniqueSuppliers || 0,
          orderCompletionRate: data.orderCompletionRate || 0,
        });

        // Set monthly data (already formatted by backend)
        setMonthlyData(data.monthlyData || []);

        // Set category data
        setCategoryData(data.categoryData || []);

        // Set top suppliers
        setTopSuppliers(data.topSuppliers || []);
      }

    } catch (error: any) {
      console.error('❌ Failed to load analytics:', error);

      // Show error state to user
      if (error.message.includes('401') || error.message.includes('403')) {
        console.error('Authentication error - please login again');
      } else {
        console.error('Network error - please check your connection');
      }
    } finally {
      setIsLoading(false);
    }
  };


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? TrendingUp : TrendingDown;
  };

  // Calculate growth percentage (comparing last 2 months if available)
  const calculateGrowth = (metric: 'orders' | 'spent') => {
    if (monthlyData.length < 2) return 0;
    const currentMonth = monthlyData[monthlyData.length - 1];
    const previousMonth = monthlyData[monthlyData.length - 2];
    const current = metric === 'orders' ? currentMonth.orders : currentMonth.spent;
    const previous = metric === 'orders' ? previousMonth.orders : previousMonth.spent;
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const ordersGrowth = calculateGrowth('orders');
  const spendingGrowth = calculateGrowth('spent');

  // Empty state
  if (!isLoading && analyticsData.totalOrders === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Inbox className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data Yet</h3>
          <p className="text-gray-600 mb-6">
            Start placing orders to see your purchasing analytics and insights here.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...monthlyData.map(d => {
    if (selectedMetric === 'orders') return d.orders;
    if (selectedMetric === 'spent') return d.spent;
    return d.suppliers;
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Real-Time Analytics</h2>
          <p className="text-sm sm:text-base text-gray-600">Track your actual purchasing patterns and performance</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={loadRealAnalytics}
            className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics - Real Data */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Spent */}
        <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.totalSpent)}</p>
              <div className="flex items-center mt-1">
                {React.createElement(getGrowthIcon(spendingGrowth), {
                  className: `h-4 w-4 ${getGrowthColor(spendingGrowth)}`
                })}
                <span className={`text-sm font-medium ${getGrowthColor(spendingGrowth)}`}>
                  {Math.abs(spendingGrowth).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalOrders}</p>
              <div className="flex items-center mt-1">
                {React.createElement(getGrowthIcon(ordersGrowth), {
                  className: `h-4 w-4 ${getGrowthColor(ordersGrowth)}`
                })}
                <span className={`text-sm font-medium ${getGrowthColor(ordersGrowth)}`}>
                  {Math.abs(ordersGrowth).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.averageOrderValue)}</p>
              <p className="text-xs text-gray-500 mt-1">Per order</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Unique Suppliers */}
        <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.uniqueSuppliers}</p>
              <p className="text-xs text-gray-500 mt-1">Unique farmers</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.orderCompletionRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">{analyticsData.completedOrders} delivered</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Package className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.pendingOrders}</p>
              <p className="text-xs text-gray-500 mt-1">In progress</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {monthlyData.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Monthly Trends */}
          <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Monthly Trends</h3>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="orders">Orders</option>
                <option value="spent">Amount Spent</option>
                <option value="suppliers">Suppliers</option>
              </select>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {monthlyData.map((data) => {
                let value: number;
                if (selectedMetric === 'orders') value = data.orders;
                else if (selectedMetric === 'spent') value = data.spent;
                else value = data.suppliers;

                const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

                return (
                  <div key={data.month} className="flex items-center space-x-2 sm:space-x-4">
                    <div className="w-10 sm:w-12 text-xs sm:text-sm font-medium text-gray-600">{data.month}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {selectedMetric === 'spent' ? formatCurrency(value) : value}
                        </span>
                        <span className="text-sm text-gray-500">{percentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown */}
          {categoryData.length > 0 && (
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
                <PieChart className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3 sm:space-y-4">
                {categoryData.map((category) => {
                  const totalSpent = categoryData.reduce((sum, cat) => sum + cat.spent, 0);
                  const percentage = totalSpent > 0 ? (category.spent / totalSpent) * 100 : 0;

                  return (
                    <div key={category.category} className="flex items-center space-x-2 sm:space-x-4">
                      <div className="w-16 sm:w-20 text-xs sm:text-sm font-medium text-gray-600">{category.category}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(category.spent)}</span>
                          <span className="text-sm text-gray-500">{percentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Suppliers */}
      {topSuppliers.length > 0 && (
        <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Suppliers (by Spending)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {topSuppliers.map((supplier, index) => (
              <div key={supplier.farmerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{supplier.farmerName}</p>
                  <p className="text-sm text-gray-500">{supplier.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(supplier.spent)}</p>
                  <p className="text-sm text-gray-500">#{index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerAnalyticsPage;
