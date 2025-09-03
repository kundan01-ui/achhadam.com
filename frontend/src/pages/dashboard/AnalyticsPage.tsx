import React, { useState } from 'react';
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
  LineChart,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  totalSpent: number;
  totalOrders: number;
  averageOrderValue: number;
  topSuppliers: number;
  monthlyGrowth: number;
  orderCompletionRate: number;
}

interface MonthlyData {
  month: string;
  orders: number;
  spent: number;
  suppliers: number;
}

interface CategoryData {
  category: string;
  orders: number;
  spent: number;
  percentage: number;
}

const AnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('orders');

  const [analyticsData] = useState<AnalyticsData>({
    totalSpent: 2450000,
    totalOrders: 156,
    averageOrderValue: 15705,
    topSuppliers: 8,
    monthlyGrowth: 12.5,
    orderCompletionRate: 92.3
  });

  const [monthlyData] = useState<MonthlyData[]>([
    { month: 'Jul', orders: 12, spent: 180000, suppliers: 3 },
    { month: 'Aug', orders: 18, spent: 220000, suppliers: 4 },
    { month: 'Sep', orders: 15, spent: 195000, suppliers: 3 },
    { month: 'Oct', orders: 22, spent: 280000, suppliers: 5 },
    { month: 'Nov', orders: 28, spent: 320000, suppliers: 6 },
    { month: 'Dec', orders: 35, spent: 420000, suppliers: 7 },
    { month: 'Jan', orders: 26, spent: 380000, suppliers: 8 }
  ]);

  const [categoryData] = useState<CategoryData[]>([
    { category: 'Grains', orders: 45, spent: 850000, percentage: 35 },
    { category: 'Vegetables', orders: 38, spent: 420000, percentage: 17 },
    { category: 'Fruits', orders: 28, spent: 380000, percentage: 16 },
    { category: 'Spices', orders: 25, spent: 320000, percentage: 13 },
    { category: 'Pulses', orders: 20, spent: 280000, percentage: 11 },
    { category: 'Others', orders: 15, spent: 200000, percentage: 8 }
  ]);

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

  const maxValue = Math.max(...monthlyData.map(d => d[selectedMetric as keyof MonthlyData] as number));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600">Track your purchasing patterns and performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.totalSpent)}</p>
              <div className="flex items-center mt-1">
                {React.createElement(getGrowthIcon(analyticsData.monthlyGrowth), { 
                  className: `h-4 w-4 ${getGrowthColor(analyticsData.monthlyGrowth)}` 
                })}
                <span className={`text-sm font-medium ${getGrowthColor(analyticsData.monthlyGrowth)}`}>
                  {Math.abs(analyticsData.monthlyGrowth)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalOrders}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">8.2%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.averageOrderValue)}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">5.1%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.topSuppliers}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">2</span>
                <span className="text-sm text-gray-500 ml-1">new this month</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.orderCompletionRate}%</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">2.1%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Package className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Contracts</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">1</span>
                <span className="text-sm text-gray-500 ml-1">new this month</span>
              </div>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
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
          <div className="space-y-4">
            {monthlyData.map((data, index) => {
              const value = data[selectedMetric as keyof MonthlyData] as number;
              const percentage = (value / maxValue) * 100;
              return (
                <div key={data.month} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{data.month}</div>
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
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={category.category} className="flex items-center space-x-4">
                <div className="w-20 text-sm font-medium text-gray-600">{category.category}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(category.spent)}</span>
                    <span className="text-sm text-gray-500">{category.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Suppliers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Suppliers</h3>
          <div className="space-y-3">
            {[
              { name: 'Golden Grains Ltd.', orders: 45, spent: 850000 },
              { name: 'Green Valley Farms', orders: 38, spent: 720000 },
              { name: 'Fresh Harvest Co.', orders: 28, spent: 420000 },
              { name: 'Premium Foods', orders: 25, spent: 380000 },
              { name: 'Organic Valley', orders: 20, spent: 320000 }
            ].map((supplier, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{supplier.name}</p>
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

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'Order completed', details: 'ORD-001 from Golden Grains', time: '2 hours ago', type: 'success' },
              { action: 'New order placed', details: 'ORD-002 for Organic Wheat', time: '5 hours ago', type: 'info' },
              { action: 'Payment processed', details: '₹25,000 to Green Valley', time: '1 day ago', type: 'success' },
              { action: 'Contract renewed', details: 'Annual contract with Fresh Harvest', time: '2 days ago', type: 'info' },
              { action: 'Supplier added', details: 'Premium Foods to favorites', time: '3 days ago', type: 'info' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Great Progress!</span>
              </div>
              <p className="text-sm text-green-700">Your order completion rate has improved by 5% this month.</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">New Opportunities</span>
              </div>
              <p className="text-sm text-blue-700">2 new verified suppliers have joined your region.</p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Upcoming</span>
              </div>
              <p className="text-sm text-yellow-700">Contract renewal due in 15 days with Golden Grains.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;


