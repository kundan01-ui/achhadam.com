import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import LanguageSelector from '../../components/ui/LanguageSelector';
import { TrendingUp, Package, Users, Star, Truck, Calendar } from 'lucide-react';

interface BuyerDashboardProps {
  user: any;
  onLogout: () => void;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ user, onLogout }) => {
  const stats = [
    {
      title: 'Total Spent',
      value: '₹2,45,000',
      change: '+12.5%',
      icon: TrendingUp,
      color: 'text-success'
    },
    {
      title: 'Active Orders',
      value: '8',
      change: '+2',
      icon: Package,
      color: 'text-primary-green'
    },
    {
      title: 'Suppliers',
      value: '24',
      change: '+3',
      icon: Users,
      color: 'text-accent-orange'
    },
    {
      title: 'Avg Rating',
      value: '4.8',
      change: '+0.2',
      icon: Star,
      color: 'text-warning'
    }
  ];

  const recentPurchases = [
    {
      id: '1',
      product: 'Organic Tomatoes',
      supplier: 'Green Valley Farms',
      quantity: '50 kg',
      price: '₹8,500',
      status: 'Delivered',
      date: '2024-01-15'
    },
    {
      id: '2',
      product: 'Fresh Carrots',
      supplier: 'Sunrise Agriculture',
      quantity: '30 kg',
      price: '₹4,200',
      status: 'In Transit',
      date: '2024-01-14'
    },
    {
      id: '3',
      product: 'Premium Potatoes',
      supplier: 'Mountain Farms',
      quantity: '100 kg',
      price: '₹12,000',
      status: 'Processing',
      date: '2024-01-13'
    }
  ];

  const topSuppliers = [
    {
      name: 'Green Valley Farms',
      rating: 4.9,
      orders: 45,
      totalSpent: '₹85,000',
      lastOrder: '2024-01-15'
    },
    {
      name: 'Sunrise Agriculture',
      rating: 4.7,
      orders: 32,
      totalSpent: '₹62,000',
      lastOrder: '2024-01-14'
    },
    {
      name: 'Mountain Farms',
      rating: 4.6,
      orders: 28,
      totalSpent: '₹48,000',
      lastOrder: '2024-01-13'
    }
  ];

  const upcomingDeliveries = [
    {
      id: '1',
      product: 'Fresh Vegetables Bundle',
      supplier: 'Green Valley Farms',
      deliveryDate: '2024-01-18',
      status: 'Confirmed'
    },
    {
      id: '2',
      product: 'Organic Fruits Pack',
      supplier: 'Sunrise Agriculture',
      deliveryDate: '2024-01-20',
      status: 'Scheduled'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Buyer Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <UserProfileDropdown
                user={user}
                onLogout={onLogout}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-dark">Welcome back, {user?.firstName || 'Buyer'}! 🏪</h2>
          <div className="flex items-center space-x-4">
            <span className="text-text-light">Manage your purchases and suppliers</span>
          </div>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-card-hover transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-light">{stat.title}</p>
                  <p className="text-2xl font-bold text-text-dark">{stat.value}</p>
                  <p className="text-sm text-success">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full bg-neutral-gray ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Purchases */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-primary-green" />
                <span>Recent Purchases</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPurchases.map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-neutral-gray transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-text-dark">{purchase.product}</h4>
                      <p className="text-sm text-text-light">{purchase.supplier}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-text-light">
                        <span>{purchase.quantity}</span>
                        <span>{purchase.price}</span>
                        <span className="text-primary-green">{purchase.status}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-text-light">
                      {purchase.date}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Suppliers */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-warning" />
                <span>Top Suppliers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSuppliers.map((supplier, index) => (
                  <div key={index} className="p-4 border border-gray-100 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-text-dark">{supplier.name}</h4>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-warning fill-current" />
                        <span className="text-sm font-medium">{supplier.rating}</span>
                      </div>
                    </div>
                    <div className="text-sm text-text-light space-y-1">
                      <p>Orders: {supplier.orders}</p>
                      <p>Total: {supplier.totalSpent}</p>
                      <p>Last: {supplier.lastOrder}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-primary-green" />
            <span>Upcoming Deliveries</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingDeliveries.map((delivery) => (
              <div key={delivery.id} className="p-4 border border-gray-100 rounded-lg hover:bg-neutral-gray transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text-dark">{delivery.product}</h4>
                  <span className="text-sm text-primary-green">{delivery.status}</span>
                </div>
                <p className="text-sm text-text-light mb-2">{delivery.supplier}</p>
                <div className="flex items-center space-x-2 text-sm text-text-light">
                  <Calendar className="w-4 h-4" />
                  <span>Delivery: {delivery.deliveryDate}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default BuyerDashboard;


