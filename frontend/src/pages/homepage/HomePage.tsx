import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../../components/ui/LanguageSelector';
import LoginPage from '../auth/LoginPage';
import FarmerSignupPage from '../auth/FarmerSignupPage';
import BuyerSignupPage from '../auth/BuyerSignupPage';
import TransporterSignupPage from '../auth/TransporterSignupPage';
import FarmerDashboard from '../dashboard/FarmerDashboard';
import { 
  Leaf, 
  Users, 
  Truck, 
  TrendingUp, 
  Shield, 
  Globe, 
  Phone, 
  Mail,
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react';

// Data arrays
const stats = [
  { value: '10,000+', label: 'Farmers' },
  { value: '5,000+', label: 'Buyers' },
  { value: '2,000+', label: 'Transporters' },
  { value: '₹50Cr+', label: 'Trade Volume' }
];

const features = [
  {
    icon: Leaf,
    title: 'Smart Farming',
    description: 'AI-powered insights and weather updates for better crop management'
  },
  {
    icon: Users,
    title: 'Direct Trading',
    description: 'Connect directly with buyers and eliminate middlemen'
  },
  {
    icon: Truck,
    title: 'Logistics',
    description: 'Efficient transportation and delivery solutions'
  },
  {
    icon: TrendingUp,
    title: 'Market Intelligence',
    description: 'Real-time prices and market trends'
  }
];

const testimonials = [
  {
    rating: 5,
    content: 'ACHHADAM helped me increase my crop sales by 40% in just 3 months!',
    name: 'Rajesh Kumar',
    role: 'Farmer, Maharashtra'
  },
  {
    rating: 5,
    content: 'Best platform for sourcing quality crops directly from farmers.',
    name: 'Priya Sharma',
    role: 'Buyer, Delhi'
  },
  {
    rating: 5,
    content: 'Great earning opportunities and flexible working hours.',
    name: 'Amit Patel',
    role: 'Transporter, Gujarat'
  }
];

type AuthPage = 'home' | 'login' | 'farmer-signup' | 'buyer-signup' | 'transporter-signup' | 'farmer-dashboard' | 'buyer-dashboard' | 'transporter-dashboard';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState<AuthPage>('home');
  const [selectedUserType, setSelectedUserType] = useState<'farmer' | 'buyer' | 'transporter'>('farmer');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleBackToHome = () => {
    setCurrentPage('home');
    setIsAuthenticated(false);
    setUserData(null);
  };

  const handleSignupClick = () => {
    setCurrentPage(`${selectedUserType}-signup` as AuthPage);
  };

  const handleSwitchUserType = (userType: 'farmer' | 'buyer' | 'transporter') => {
    setSelectedUserType(userType);
    if (currentPage !== 'home') {
      setCurrentPage(`${userType}-signup` as AuthPage);
    }
  };

  const handleLoginSuccess = (userType: string, user: any) => {
    setIsAuthenticated(true);
    setUserData(user);
    setCurrentPage(`${userType}-dashboard` as AuthPage);
  };

  const renderAuthContent = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            onSignupClick={handleSignupClick}
            onUserTypeSelect={handleLoginSuccess}
            onBackToHome={handleBackToHome}
          />
        );
      case 'farmer-signup':
        return (
          <FarmerSignupPage
            onBackToLogin={() => setCurrentPage('login')}
            onSwitchUserType={handleSwitchUserType}
            onBackToHome={handleBackToHome}
          />
        );
      case 'buyer-signup':
        return (
          <BuyerSignupPage
            onBackToLogin={() => setCurrentPage('login')}
            onSwitchUserType={handleSwitchUserType}
            onBackToHome={handleBackToHome}
          />
        );
      case 'transporter-signup':
        return (
          <TransporterSignupPage
            onBackToLogin={() => setCurrentPage('login')}
            onSwitchUserType={handleSwitchUserType}
            onBackToHome={handleBackToHome}
          />
        );
      case 'farmer-dashboard':
        return (
          <FarmerDashboard
            user={userData}
            onLogout={handleBackToHome}
          />
        );
      case 'buyer-dashboard':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            <header className="bg-white shadow-sm border-b">
              <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-bold">A</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">ACHHADAM</h1>
                  </div>
                  <div className="flex items-center space-x-4">
                    <LanguageSelector />
                    <span className="text-gray-600">Welcome, {userData?.firstName}!</span>
                    <Button onClick={handleBackToHome} variant="outline">
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </header>
            <div className="container mx-auto px-4 py-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Buyer Dashboard</h2>
                <p className="text-gray-600">Welcome to your buyer dashboard! Here you can browse available crops, place orders, and manage your purchases.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-green-50">
                    <h3 className="font-semibold text-green-800">Available Crops</h3>
                    <p className="text-sm text-green-600">Browse farmer listings</p>
                  </Card>
                  <Card className="p-4 bg-blue-50">
                    <h3 className="font-semibold text-blue-800">My Orders</h3>
                    <p className="text-sm text-blue-600">Track your orders</p>
                  </Card>
                  <Card className="p-4 bg-yellow-50">
                    <h3 className="font-semibold text-yellow-800">Favorites</h3>
                    <p className="text-sm text-yellow-600">Save favorite farmers</p>
                  </Card>
                </div>
              </Card>
            </div>
          </div>
        );
      case 'transporter-dashboard':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            <header className="bg-white shadow-sm border-b">
              <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-bold">A</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">ACHHADAM</h1>
                  </div>
                  <div className="flex items-center space-x-4">
                    <LanguageSelector />
                    <span className="text-gray-600">Welcome, {userData?.firstName}!</span>
                    <Button onClick={handleBackToHome} variant="outline">
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </header>
            <div className="container mx-auto px-4 py-8">
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Transporter Dashboard</h2>
                <p className="text-gray-600">Welcome to your transporter dashboard! Here you can view delivery requests, manage your routes, and track shipments.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-green-50">
                    <h3 className="font-semibold text-green-800">Delivery Requests</h3>
                    <p className="text-sm text-green-600">View new requests</p>
                  </Card>
                  <Card className="p-4 bg-blue-50">
                    <h3 className="font-semibold text-blue-800">Active Deliveries</h3>
                    <p className="text-sm text-blue-600">Track current shipments</p>
                  </Card>
                  <Card className="p-4 bg-yellow-50">
                    <h3 className="font-semibold text-yellow-800">Earnings</h3>
                    <p className="text-sm text-yellow-600">View your earnings</p>
                  </Card>
                </div>
              </Card>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (currentPage !== 'home') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {renderAuthContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                <span className="text-lg sm:text-2xl font-bold text-green-800">ACHHADAM</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage('login')}
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Login</span>
                <span className="sm:hidden">Login</span>
              </Button>
              <Button 
                size="sm"
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Digital Farming Platform
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-green-100 max-w-3xl mx-auto px-4">
            Empowering farmers, connecting buyers, and optimizing logistics for a sustainable agricultural future.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <Button 
              size="xl" 
              className="bg-white text-green-600 hover:bg-gray-100 px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
              onClick={() => {
                setSelectedUserType('farmer');
                setCurrentPage('farmer-signup');
              }}
            >
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Join as Farmer
            </Button>
            <Button 
              size="xl" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-green-600 px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
              onClick={() => {
                setSelectedUserType('buyer');
                setCurrentPage('buyer-signup');
              }}
            >
              <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Join as Buyer
            </Button>
            <Button 
              size="xl" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-green-600 px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
              onClick={() => {
                setSelectedUserType('transporter');
                setCurrentPage('transporter-signup');
              }}
            >
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Join as Transporter
            </Button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto px-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-300 mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-sm sm:text-base text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose ACHHADAM?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Our platform offers comprehensive solutions for all stakeholders in the agricultural ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Simple steps to get started with ACHHADAM
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white text-lg sm:text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Register</h3>
              <p className="text-sm sm:text-base text-gray-600">Create your account and complete your profile</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white text-lg sm:text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Connect</h3>
              <p className="text-sm sm:text-base text-gray-600">Connect with other users and start trading</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white text-lg sm:text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Grow</h3>
              <p className="text-sm sm:text-base text-gray-600">Scale your business with our platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              What Our Users Say
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Real stories from our community members
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center mb-3 sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Ready to Transform Your Agricultural Business?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-green-100 mb-6 sm:mb-8">
            Join thousands of farmers, buyers, and transporters who are already benefiting from ACHHADAM.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              size="xl" 
              className="bg-white text-green-600 hover:bg-gray-100 px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
              onClick={() => {
                setSelectedUserType('farmer');
                setCurrentPage('farmer-signup');
              }}
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Get Started Today
            </Button>
            <Button 
              size="xl" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-green-600 px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
              onClick={() => setCurrentPage('login')}
            >
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                <span className="text-xl sm:text-2xl font-bold">ACHHADAM</span>
              </div>
              <p className="text-sm sm:text-base text-gray-400">
                Empowering agriculture through digital innovation and community building.
              </p>
            </div>
            
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Platform</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-400">
                <li><a href="#" className="hover:text-white">For Farmers</a></li>
                <li><a href="#" className="hover:text-white">For Buyers</a></li>
                <li><a href="#" className="hover:text-white">For Transporters</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Company</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Support</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm sm:text-base text-gray-400">
            <p>&copy; 2024 ACHHADAM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
