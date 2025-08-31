import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import LanguageSelector from '../../components/ui/LanguageSelector';
import CropAdvisory from './CropAdvisory';
import Market from './Market';
import Weather from './Weather';
import { 
  Leaf, 
  TrendingUp, 
  Cloud, 
  Home, 
  Menu, 
  X,
  BarChart3,
  Calendar,
  MapPin,
  Users,
  Truck,
  DollarSign
} from 'lucide-react';

type DashboardPage = 'home' | 'crop-advisory' | 'market' | 'weather';

interface FarmerDashboardProps {
  user: any;
  onLogout: () => void;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ user, onLogout }) => {
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
      id: 'crop-advisory',
      label: 'Crop Advisory',
      icon: Leaf,
      description: 'AI-powered farming recommendations'
    },
    {
      id: 'market',
      label: 'Market',
      icon: TrendingUp,
      description: 'Prices, trends, and trading'
    },
    {
      id: 'weather',
      label: 'Weather',
      icon: Cloud,
      description: 'Forecasts and farming alerts'
    }
  ];

  const quickStats = [
    {
      label: 'Active Crops',
      value: '3',
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Market Value',
      value: '₹45,000',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Weather',
      value: '28°C',
      icon: Cloud,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Connections',
      value: '12',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const recentActivities = [
    {
      type: 'Crop Update',
      message: 'Wheat crop status updated to "Optimal"',
      time: '2 hours ago',
      icon: Leaf
    },
    {
      type: 'Market Alert',
      message: 'Rice prices increased by ₹80 per quintal',
      time: '4 hours ago',
      icon: TrendingUp
    },
    {
      type: 'Weather Warning',
      message: 'Rain expected in next 24 hours',
      time: '6 hours ago',
      icon: Cloud
    }
  ];

  const renderPageContent = () => {
    switch (currentPage) {
      case 'crop-advisory':
        return <CropAdvisory />;
      case 'market':
        return <Market />;
      case 'weather':
        return <Weather />;
      default:
        return (
          <div className="p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your farming business today
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {quickStats.map((stat, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => setCurrentPage('crop-advisory')}
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-green-50 hover:bg-green-100 text-green-700 border-2 border-green-200"
                    >
                      <Leaf className="w-6 h-6" />
                      <span className="text-sm">Crop Advisory</span>
                    </Button>
                    <Button
                      onClick={() => setCurrentPage('market')}
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-2 border-blue-200"
                    >
                      <TrendingUp className="w-6 h-6" />
                      <span className="text-sm">Market</span>
                    </Button>
                    <Button
                      onClick={() => setCurrentPage('weather')}
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-2 border-purple-200"
                    >
                      <Cloud className="w-6 h-6" />
                      <span className="text-sm">Weather</span>
                    </Button>
                    <Button
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border-2 border-orange-200"
                    >
                      <Users className="w-6 h-6" />
                      <span className="text-sm">Connect</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>Recent Activities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <activity.icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{activity.type}</p>
                          <p className="text-xs text-gray-600">{activity.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Market Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <span>Market Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Wheat</h3>
                    <p className="text-2xl font-bold text-green-600">₹2,450</p>
                    <p className="text-sm text-green-600">+₹150 (+6.5%)</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Rice</h3>
                    <p className="text-2xl font-bold text-red-600">₹3,200</p>
                    <p className="text-sm text-red-600">-₹80 (-2.4%)</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Cotton</h3>
                    <p className="text-2xl font-bold text-green-600">₹6,800</p>
                    <p className="text-sm text-green-600">+₹320 (+4.9%)</p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => setCurrentPage('market')}
                    variant="outline"
                    className="bg-green-600 text-white hover:bg-green-700 border-green-600"
                  >
                    View Full Market Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
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
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 rounded-full flex items-center justify-center">
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
                      ? 'bg-green-100 text-green-700 border-r-2 border-green-600'
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

export default FarmerDashboard;
