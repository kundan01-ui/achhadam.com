import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../../components/ui/LanguageSelector';
import LoginPage from '../auth/LoginPage';
import FarmerSignupPage from '../auth/FarmerSignupPage';
import BuyerSignupPage from '../auth/BuyerSignupPage';
import TransporterSignupPage from '../auth/TransporterSignupPage';
import FarmerDashboard from '../dashboard/FarmerDashboard';
import BuyerDashboard from '../dashboard/BuyerDashboard';
import TransporterDashboard from '../dashboard/TransporterDashboard';
import ForgotPasswordPage from '../auth/ForgotPasswordPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import UserTypeSelector from '../../components/ui/UserTypeSelector';

// Import images
import agri1Image from '../../assets/agri1.jpg - Copy.jpg';
import jamesImage from '../../assets/james-baltz-jAt6cN6zl8M-unsplash.jpg';
import nicolasImage from '../../assets/pexels-nicolasveithen-1719669.jpg';
import quangImage from '../../assets/pexels-quang-nguyen-vinh-222549-2132171.jpg';

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
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  Award,
  Zap,
  Heart
} from 'lucide-react';

// Hero slides data - will be populated dynamically based on language
const getHeroSlides = (t: (key: string) => string) => [
  {
    image: agri1Image,
    title: t('heroSlide1Title'),
    subtitle: t('heroSlide1Subtitle'),
    description: t('heroSlide1Description'),
    cta: t('heroSlide1Cta'),
    color: "from-green-600 to-green-800"
  },
  {
    image: jamesImage,
    title: t('heroSlide2Title'),
    subtitle: t('heroSlide2Subtitle'),
    description: t('heroSlide2Description'),
    cta: t('heroSlide2Cta'),
    color: "from-blue-600 to-blue-800"
  },
  {
    image: nicolasImage,
    title: t('heroSlide3Title'),
    subtitle: t('heroSlide3Subtitle'),
    description: t('heroSlide3Description'),
    cta: t('heroSlide3Cta'),
    color: "from-orange-600 to-orange-800"
  },
  {
    image: quangImage,
    title: t('heroSlide4Title'),
    subtitle: t('heroSlide4Subtitle'),
    description: t('heroSlide4Description'),
    cta: t('heroSlide4Cta'),
    color: "from-purple-600 to-purple-800"
  }
];

// Data arrays
const stats = [
  { value: '10,000+', label: 'Farmers', icon: Leaf, color: 'text-green-600' },
  { value: '5,000+', label: 'Buyers', icon: Users, color: 'text-blue-600' },
  { value: '2,000+', label: 'Transporters', icon: Truck, color: 'text-orange-600' },
  { value: '₹50Cr+', label: 'Trade Volume', icon: TrendingUp, color: 'text-purple-600' }
];

const features = [
  {
    icon: Leaf,
    titleKey: 'smartFarming',
    descriptionKey: 'smartFarmingDesc',
    color: 'bg-green-50 text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    icon: Users,
    titleKey: 'directTrading',
    descriptionKey: 'directTradingDesc',
    color: 'bg-blue-50 text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    icon: Truck,
    titleKey: 'logistics',
    descriptionKey: 'logisticsDesc',
    color: 'bg-orange-50 text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    icon: TrendingUp,
    titleKey: 'marketIntelligence',
    descriptionKey: 'marketIntelligenceDesc',
    color: 'bg-purple-50 text-purple-600',
    bgColor: 'bg-purple-100'
  }
];

const testimonials = [
  {
    rating: 5,
    content: 'ACHHADAM helped me increase my crop sales by 40% in just 3 months! The direct buyer connection is amazing.',
    name: 'Rajesh Kumar',
    role: 'Farmer, Maharashtra',
    avatar: '🌾'
  },
  {
    rating: 5,
    content: 'Best platform for sourcing quality crops directly from farmers. Fresh produce and fair prices guaranteed.',
    name: 'Priya Sharma',
    role: 'Buyer, Delhi',
    avatar: '🏪'
  },
  {
    rating: 5,
    content: 'Great earning opportunities and flexible working hours. The app makes everything so easy!',
    name: 'Amit Patel',
    role: 'Transporter, Gujarat',
    avatar: '🚛'
  }
];

const benefits = [
  {
    icon: Zap,
    titleKey: 'quickSetup',
    descriptionKey: 'quickSetupDesc'
  },
  {
    icon: Shield,
    titleKey: 'securePlatform',
    descriptionKey: 'securePlatformDesc'
  },
  {
    icon: Globe,
    titleKey: 'wideNetwork',
    descriptionKey: 'wideNetworkDesc'
  },
  {
    icon: Award,
    titleKey: 'qualityAssured',
    descriptionKey: 'qualityAssuredDesc'
  }
];

type AuthPage = 'home' | 'login' | 'user-type-selection' | 'farmer-signup' | 'buyer-signup' | 'transporter-signup' | 'farmer-dashboard' | 'buyer-dashboard' | 'transporter-dashboard';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState<AuthPage>('home');
  const [selectedUserType, setSelectedUserType] = useState<'farmer' | 'buyer' | 'transporter'>('farmer');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get hero slides based on current language
  const heroSlides = getHeroSlides(t);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setIsAuthenticated(false);
    setUserData(null);
  };

  const handleSignupClick = () => {
    setCurrentPage('user-type-selection');
    // Also scroll to top to ensure smooth transition
    window.scrollTo(0, 0);
  };

  const handleSwitchUserType = (userType: 'farmer' | 'buyer' | 'transporter') => {
    setSelectedUserType(userType);
    if (currentPage !== 'home') {
      setCurrentPage(`${userType}-signup` as AuthPage);
    }
  };

  const handleUserTypeContinue = (userType: 'farmer' | 'buyer' | 'transporter') => {
    setSelectedUserType(userType);
    setCurrentPage(`${userType}-signup` as AuthPage);
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
            onBackToHome={handleBackToHome}
            onSwitchUserType={handleSwitchUserType}
            onUserTypeSelect={handleLoginSuccess}
            onSignupClick={() => setCurrentPage('user-type-selection')}
            onForgotPassword={() => setCurrentPage('forgot-password')}
          />
        );
      case 'user-type-selection':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <UserTypeSelector
                  selectedType={selectedUserType}
                  onTypeChange={setSelectedUserType}
                  onContinue={handleUserTypeContinue}
                />
                <div className="text-center mt-6">
                  <button
                    onClick={handleBackToHome}
                    className="text-gray-500 hover:text-gray-700 underline"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'farmer-signup':
        return (
          <FarmerSignupPage
            onBackToLogin={() => setCurrentPage('login')}
            onSwitchUserType={handleSwitchUserType}
            onBackToHome={handleBackToHome}
            onBackToUserTypeSelection={() => setCurrentPage('user-type-selection')}
          />
        );
      case 'buyer-signup':
        return (
          <BuyerSignupPage
            onBackToLogin={() => setCurrentPage('login')}
            onSwitchUserType={handleSwitchUserType}
            onBackToHome={handleBackToHome}
            onBackToUserTypeSelection={() => setCurrentPage('user-type-selection')}
          />
        );
      case 'transporter-signup':
        return (
          <TransporterSignupPage
            onBackToLogin={() => setCurrentPage('login')}
            onSwitchUserType={handleSwitchUserType}
            onBackToHome={handleBackToHome}
            onBackToUserTypeSelection={() => setCurrentPage('user-type-selection')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordPage
            onBackToLogin={() => setCurrentPage('login')}
          />
        );
      case 'about':
        return (
          <AboutPage
            onBackToHome={handleBackToHome}
          />
        );
      case 'contact':
        return (
          <ContactPage
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
          <BuyerDashboard
            user={userData}
            onLogout={handleBackToHome}
          />
        );
      case 'transporter-dashboard':
        return (
          <TransporterDashboard
            user={userData}
            onLogout={handleBackToHome}
          />
        );
      default:
        return null;
    }
  };

  if (currentPage !== 'home') {
    return renderAuthContent();
  }

  return (
    <div className="min-h-screen bg-white">
                   {/* Professional Navbar Section */}
             <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
               <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="flex items-center justify-between h-16 sm:h-18">
                   {/* Logo */}
                   <div className="flex items-center space-x-3 animate-fade-in-left">
                     <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-800 rounded-lg flex items-center justify-center hover-scale animate-glow shadow-md">
                       <Leaf className="w-6 h-6 text-white" />
                     </div>
                     <h1 className="text-xl sm:text-2xl font-bold gradient-text">
                       ACHHADAM
                     </h1>
                   </div>

                   {/* Navigation */}
                   <nav className="hidden md:flex items-center space-x-8">
                     <a href="#features" className="nav-link text-gray-700 hover:text-green-600 font-medium text-base transition-all duration-300 hover:scale-105">
                       Features
                     </a>
                     <button
                       onClick={() => setCurrentPage('about')}
                       className="nav-link text-gray-700 hover:text-green-600 font-medium text-base transition-all duration-300 hover:scale-105 cursor-pointer"
                     >
                       About
                     </button>
                     <button
                       onClick={() => setCurrentPage('contact')}
                       className="nav-link text-gray-700 hover:text-green-600 font-medium text-base transition-all duration-300 hover:scale-105 cursor-pointer"
                     >
                       Contact
                     </button>
                   </nav>

                   {/* Right Side */}
                   <div className="flex items-center space-x-4 animate-fade-in-right">
                     <LanguageSelector />
                     <Button
                       onClick={() => setCurrentPage('login')}
                       className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium hover-lift animate-fade-in-right hover-glow btn-pulse shadow-md"
                     >
                       Login
                     </Button>
                   </div>
                 </div>
               </div>
             </header>

                   {/* Enhanced Hero Section */}
             <section className="relative h-[85vh] sm:h-[80vh] flex items-center justify-center overflow-hidden hero-gradient">
               {/* Background Images */}
               {heroSlides.map((slide, index) => (
                 <div
                   key={index}
                   className={`absolute inset-0 transition-opacity duration-1000 ${
                     index === currentSlide ? 'opacity-100' : 'opacity-0'
                   }`}
                 >
                   <div className="absolute inset-0 bg-black/50 z-10"></div>
                   <img
                     src={slide.image}
                     alt={slide.title}
                     className="w-full h-full object-cover image-hover"
                   />
                 </div>
               ))}

               {/* Hero Content */}
               <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                 <div className="animate-fade-in-up">
                   <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight hero-text-shadow animate-float">
                     {heroSlides[currentSlide].title}
                   </h1>
                   <p className="text-xl sm:text-2xl font-semibold mb-4 text-green-200 animate-slide-up stagger-1">
                     {heroSlides[currentSlide].subtitle}
                   </p>
                   <p className="text-lg sm:text-xl mb-8 text-gray-200 max-w-2xl mx-auto animate-slide-up stagger-2">
                     {heroSlides[currentSlide].description}
                   </p>
                   <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up stagger-3">
                     <Button
                       onClick={handleSignupClick}
                       className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold hover-lift btn-pulse shadow-lg"
                     >
                       {heroSlides[currentSlide].cta}
                     </Button>
                     <Button
                       variant="outline"
                       className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg font-semibold hover-lift shadow-lg"
                     >
                       <Play className="w-5 h-5 mr-2" />
                       {t('watchDemo')}
                     </Button>
                   </div>
                 </div>
               </div>

               {/* Slide Navigation */}
               <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-4 animate-fade-in-up">
                 <button
                   onClick={prevSlide}
                   className="w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-all duration-300 hover-scale hover-glow"
                 >
                   <ChevronLeft className="w-6 h-6 text-white" />
                 </button>

                 <div className="flex space-x-3">
                   {heroSlides.map((_, index) => (
                     <button
                       key={index}
                       onClick={() => setCurrentSlide(index)}
                       className={`w-4 h-4 rounded-full transition-all duration-300 hover-scale ${
                         index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
                       }`}
                     />
                   ))}
                 </div>

                 <button
                   onClick={nextSlide}
                   className="w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-all duration-300 hover-scale hover-glow"
                 >
                   <ChevronRight className="w-6 h-6 text-white" />
                 </button>
               </div>
      </section>

                   {/* Mobile Responsive Stats Section */}
             <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
               {/* Background Pattern */}
               <div className="absolute inset-0 opacity-5">
                 <div className="absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full"></div>
                 <div className="absolute top-32 right-20 w-16 h-16 bg-blue-500 rounded-full"></div>
                 <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-500 rounded-full"></div>
               </div>
               
               <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                 <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
                   <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 gradient-text">
                     Our Impact in Numbers
                   </h2>
                   <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                     Real results from real farmers, buyers, and transporters across India
                   </p>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                   {stats.map((stat, index) => (
                     <div key={index} className={`text-center stat-card animate-fade-in-up stagger-${index + 1} bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-white/20`}>
                       <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 ${stat.color} bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 hover-scale animate-float`}>
                         <stat.icon className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${stat.color}`} />
                       </div>
                       <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-2 sm:mb-3 gradient-text">{stat.value}</div>
                       <div className="text-gray-600 font-semibold text-sm sm:text-base lg:text-lg">{stat.label}</div>
                     </div>
                   ))}
                 </div>
               </div>
             </section>

                   {/* Features Section */}
             <section id="features" className="py-20 sm:py-24 bg-white relative">
               {/* Background Elements */}
               <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-blue-50/30"></div>
               
               <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                 <div className="text-center mb-20 animate-fade-in-up">
                   <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 gradient-text">
                     {t('whyChooseAchhadam')}
                   </h2>
                   <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                     {t('whyChooseDesc')}
                   </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                   {features.map((feature, index) => (
                     <Card key={index} className={`text-center card-hover animate-fade-in-up stagger-${index + 1} bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500`}>
                       <CardContent className="p-8 sm:p-10">
                         <div className={`w-24 h-24 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-8 hover-scale animate-glow shadow-lg`}>
                           <feature.icon className={`w-12 h-12 ${feature.color.split(' ')[1]}`} />
                         </div>
                         <h3 className="text-2xl font-bold text-gray-800 mb-6 gradient-text">{t(feature.titleKey)}</h3>
                         <p className="text-gray-600 leading-relaxed text-lg">{t(feature.descriptionKey)}</p>
                       </CardContent>
                     </Card>
                   ))}
                 </div>
               </div>
             </section>

                   {/* Benefits Section */}
             <section className="py-20 sm:py-24 bg-gradient-to-br from-gray-50 to-green-50 relative overflow-hidden">
               {/* Background Pattern */}
               <div className="absolute inset-0 opacity-10">
                 <div className="absolute top-20 right-10 w-32 h-32 bg-green-200 rounded-full blur-3xl"></div>
                 <div className="absolute bottom-20 left-10 w-24 h-24 bg-blue-200 rounded-full blur-3xl"></div>
               </div>
               
               <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                 <div className="text-center mb-20 animate-fade-in-up">
                   <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 gradient-text">
                     {t('platformBenefits')}
                   </h2>
                   <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                     {t('platformBenefitsDesc')}
                   </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                   {benefits.map((benefit, index) => (
                     <div key={index} className={`text-center stat-card animate-fade-in-up stagger-${index + 1} bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500`}>
                       <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-8 hover-scale animate-float shadow-lg">
                         <benefit.icon className="w-12 h-12 text-green-600" />
                       </div>
                       <h3 className="text-2xl font-bold text-gray-800 mb-6 gradient-text">{t(benefit.titleKey)}</h3>
                       <p className="text-gray-600 leading-relaxed text-lg">{t(benefit.descriptionKey)}</p>
                     </div>
                   ))}
                 </div>
               </div>
             </section>

                   {/* Testimonials Section */}
             <section className="py-20 sm:py-24 bg-white relative">
               {/* Background Elements */}
               <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/20 via-transparent to-orange-50/20"></div>
               
               <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                 <div className="text-center mb-20 animate-fade-in-up">
                   <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 gradient-text">
                     {t('whatUsersSay')}
                   </h2>
                   <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                     {t('whatUsersSayDesc')}
                   </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {testimonials.map((testimonial, index) => (
                     <Card key={index} className={`p-8 sm:p-10 testimonial-card animate-fade-in-up stagger-${index + 1} bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500`}>
                       <CardContent className="p-0">
                         <div className="flex items-center mb-6">
                           <div className="text-5xl mr-6 animate-float">{testimonial.avatar}</div>
                           <div>
                             <div className="flex items-center mb-2">
                               {[...Array(testimonial.rating)].map((_, i) => (
                                 <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                               ))}
                             </div>
                             <h4 className="font-bold text-gray-800 text-lg">{testimonial.name}</h4>
                             <p className="text-gray-600 font-medium">{testimonial.role}</p>
                           </div>
                         </div>
                         <p className="text-gray-700 italic text-lg leading-relaxed">"{testimonial.content}"</p>
                       </CardContent>
                     </Card>
                   ))}
                 </div>
               </div>
             </section>

                   {/* CTA Section */}
             <section className="py-20 sm:py-24 bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white relative overflow-hidden">
               {/* Background Pattern */}
               <div className="absolute inset-0 opacity-20">
                 <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                 <div className="absolute bottom-10 right-10 w-24 h-24 bg-green-300 rounded-full blur-3xl"></div>
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-green-400 rounded-full blur-3xl"></div>
               </div>
               
               <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                 <div className="animate-fade-in-up">
                   <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-white drop-shadow-2xl">
                     {t('readyToTransform')}
                   </h2>
                   <p className="text-xl sm:text-2xl mb-10 text-green-100 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
                     {t('readyToTransformDesc')}
                   </p>
                   <div className="flex flex-col sm:flex-row gap-6 justify-center">
                     <Button
                       onClick={handleSignupClick}
                       className="bg-white text-green-600 hover:bg-gray-100 px-10 py-4 text-xl font-bold hover-lift btn-pulse shadow-2xl"
                     >
                       {t('getStartedToday')}
                     </Button>
                     <Button
                       variant="outline"
                       className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-10 py-4 text-xl font-bold hover-lift shadow-2xl"
                     >
                       {t('learnMore')}
                     </Button>
                   </div>
                 </div>
               </div>
             </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2 animate-fade-in-left">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-800 rounded-lg flex items-center justify-center hover-scale animate-glow">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold gradient-text">ACHHADAM</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                {t('revolutionizingAgriculture')}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover-scale">
                  <Phone className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover-scale">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* For Farmers */}
            <div className="animate-fade-in-up stagger-1">
              <h4 className="text-lg font-semibold mb-4">{t('forFarmers')}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="footer-link text-gray-400">{t('smartFarmingFooter')}</a></li>
                <li><a href="#" className="footer-link text-gray-400">{t('marketAccess')}</a></li>
                <li><a href="#" className="footer-link text-gray-400">{t('cropAdvisory')}</a></li>
                <li><a href="#" className="footer-link text-gray-400">{t('weatherUpdates')}</a></li>
              </ul>
            </div>

            {/* For Buyers */}
            <div className="animate-fade-in-up stagger-2">
              <h4 className="text-lg font-semibold mb-4">{t('forBuyers')}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="footer-link text-gray-400">{t('qualityProduce')}</a></li>
                <li><a href="#" className="footer-link text-gray-400">{t('directSourcing')}</a></li>
                <li><a href="#" className="footer-link text-gray-400">{t('marketIntelligenceFooter')}</a></li>
                <li><a href="#" className="footer-link text-gray-400">{t('logisticsSupport')}</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center animate-fade-in-up">
            <p className="text-gray-400">{t('madeWithLove')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
