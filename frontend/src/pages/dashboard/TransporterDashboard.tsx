import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import LanguageSelector from '../../components/ui/LanguageSelector';
import { 
  Truck, 
  MapPin, 
  Clock, 
  DollarSign, 
  Home, 
  Menu, 
  X,
  BarChart3,
  Calendar,
  Users,
  Package,
  Route,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

type DashboardPage = 'home' | 'deliveries' | 'earnings' | 'routes';

interface TransporterDashboardProps {
  user: any;
  onLogout: () => void;
}

const TransporterDashboard: React.FC<TransporterDashboardProps> = ({ user, onLogout }) => {
  const [currentPage, setCurrentPage] = useState<DashboardPage>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    {
      id: 'home',
      label: 'Dashboard',
      icon: Home,
      description: 'Overview and quick actions'
    },
    {
      id: 'deliveries',
      label: 'Deliveries',
      icon: Package,
      description: 'Manage delivery requests'
    },
    {
      id: 'earnings',
      label: 'Earnings',
      icon: DollarSign,
      description: 'Track your earnings'
    },
    {
      id: 'routes',
      label: 'Routes',
      icon: Route,
      description: 'Optimize your routes'
    }
  ];

  const quickStats = [
    {
      label: 'Active Deliveries',
      value: '5',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Today\'s Earnings',
      value: '₹2,500',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Total Distance',
      value: '150 km',
      icon: Route,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Rating',
      value: '4.8★',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const recentDeliveries = [
    {
      id: '1',
      pickup: 'Mumbai, Maharashtra',
      delivery: 'Pune, Maharashtra',
      status: 'In Transit',
      earnings: '₹800',
      time: '2 hours ago',
      icon: Package
    },
    {
      id: '2',
      pickup: 'Nashik, Maharashtra',
      delivery: 'Aurangabad, Maharashtra',
      status: 'Completed',
      earnings: '₹1,200',
      time: '5 hours ago',
      icon: Package
    },
    {
      id: '3',
      pickup: 'Nagpur, Maharashtra',
      delivery: 'Amravati, Maharashtra',
      status: 'Scheduled',
      earnings: '₹600',
      time: 'Tomorrow',
      icon: Clock
    }
  ];

  const renderPageContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="p-4 sm:p-6 space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-bold mb-2">
                Welcome back, {user?.firstName || 'Transporter'}! 🚛
              </h1>
              <p className="text-orange-100">
                Ready to hit the road? You have 5 active deliveries today.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Deliveries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-orange-600" />
                  <span>Recent Deliveries</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDeliveries.map((delivery) => (
                    <div key={delivery.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <delivery.icon className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {delivery.pickup} → {delivery.delivery}
                            </p>
                            <p className="text-xs text-gray-600">{delivery.time}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-green-600">{delivery.earnings}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              delivery.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {delivery.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button
                    onClick={() => setCurrentPage('deliveries')}
                    variant="outline"
                    className="bg-orange-600 text-white hover:bg-orange-700 border-orange-600"
                  >
                    View All Deliveries
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Earnings Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  <span>Earnings Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Today</h3>
                    <p className="text-2xl font-bold text-green-600">₹2,500</p>
                    <p className="text-sm text-green-600">+₹300 (+13.6%)</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">This Week</h3>
                    <p className="text-2xl font-bold text-blue-600">₹12,800</p>
                    <p className="text-sm text-blue-600">+₹1,200 (+10.3%)</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">This Month</h3>
                    <p className="text-2xl font-bold text-purple-600">₹45,200</p>
                    <p className="text-sm text-purple-600">+₹5,800 (+14.7%)</p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => setCurrentPage('earnings')}
                    variant="outline"
                    className="bg-orange-600 text-white hover:bg-orange-700 border-orange-600"
                  >
                    View Detailed Earnings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'deliveries':
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Deliveries</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Deliveries */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span>Active Deliveries</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentDeliveries.filter(d => d.status === 'In Transit').map((delivery) => (
                      <div key={delivery.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">Delivery #{delivery.id}</h3>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {delivery.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {delivery.pickup} → {delivery.delivery}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{delivery.time}</span>
                          <span className="font-semibold text-green-600">{delivery.earnings}</span>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <Button size="sm" variant="outline">Track</Button>
                          <Button size="sm" variant="outline">Contact</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* New Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span>New Requests</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">Request #001</h3>
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Mumbai → Bangalore
                      </p>
                      <p className="text-sm text-gray-500 mb-3">Agricultural products, 5 tons</p>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-green-600">₹3,500</span>
                        <div className="flex space-x-2">
                          <Button size="sm">Accept</Button>
                          <Button size="sm" variant="outline">Decline</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'earnings':
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Earnings</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Earnings Summary */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Earnings Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">₹2,500</p>
                        <p className="text-sm text-gray-600">Today</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">₹12,800</p>
                        <p className="text-sm text-gray-600">This Week</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">₹45,200</p>
                        <p className="text-sm text-gray-600">This Month</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">₹180,500</p>
                        <p className="text-sm text-gray-600">This Year</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <div>
                        <p className="font-medium text-sm">Delivery #123</p>
                        <p className="text-xs text-gray-500">Mumbai → Pune</p>
                      </div>
                      <span className="font-semibold text-green-600">+₹800</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <div>
                        <p className="font-medium text-sm">Delivery #122</p>
                        <p className="text-xs text-gray-500">Nashik → Aurangabad</p>
                      </div>
                      <span className="font-semibold text-green-600">+₹1,200</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <div>
                        <p className="font-medium text-sm">Delivery #121</p>
                        <p className="text-xs text-gray-500">Nagpur → Amravati</p>
                      </div>
                      <span className="font-semibold text-green-600">+₹600</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'routes':
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Routes</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Route */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Route className="w-5 h-5 text-blue-600" />
                    <span>Current Route</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Mumbai → Pune → Nashik</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Distance:</span>
                          <span className="font-medium">450 km</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Time:</span>
                          <span className="font-medium">8 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fuel Cost:</span>
                          <span className="font-medium">₹2,250</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expected Earnings:</span>
                          <span className="font-medium text-green-600">₹3,500</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Route Optimization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span>Route Optimization</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">Optimized Route Found!</h3>
                      <p className="text-sm text-green-700 mb-3">
                        We found a better route that can save you 45 minutes and ₹200 in fuel costs.
                      </p>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Apply Optimization
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Traffic Alerts</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Heavy traffic on Mumbai-Pune Expressway</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>Construction work near Nashik</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-1 sm:p-2"
            >
              {isSidebarOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm font-bold">A</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">ACHHADAM</h1>
            </div>
          </div>

          {/* Right Side - Language and Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <LanguageSelector />
            <UserProfileDropdown
              user={user}
              onLogout={onLogout}
              onProfileEdit={() => {
                // Handle profile edit
                console.log('Edit profile clicked');
              }}
            />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-30 w-64 sm:w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-3 sm:p-4">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">Navigation</h2>
            </div>
            <nav className="space-y-1 sm:space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id as DashboardPage);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 sm:py-3 text-left rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base">{item.label}</p>
                    <p className="text-xs text-gray-500 hidden sm:block">{item.description}</p>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          {renderPageContent()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default TransporterDashboard;
