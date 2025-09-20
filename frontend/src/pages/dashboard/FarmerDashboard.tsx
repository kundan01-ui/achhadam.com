import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Leaf, 
  Package, 
  TrendingUp, 
  Settings, 
  Bell, 
  Search,
  Plus,
  Eye,
  Edit,
  Menu,
  Clock,
  Droplets,
  Sun,
  Cloud,
  Wind,
  Zap,
  Sprout,
  Wheat,
  Carrot,
  Apple,
  MapPin,
  User,
  ChevronDown,
  X,
  Home,
  Upload,
  Camera,
  Video,
  Star,
  MessageCircle,
  Phone,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  BarChart3,
  PieChart,
  TrendingDown,
  ShoppingCart,
  Truck,
  Shield,
  CreditCard,
  FileText,
  Download,
  Send,
  Mic,
  Image,
  ChevronLeft,
  ChevronRight,
  Share,
  Calendar,
  Target,
  Award,
  Users,
  Building,
  Wrench,
  Droplet,
  Thermometer,
  Gauge,
  Map,
  Navigation,
  Heart,
  ThumbsUp,
  Share2,
  Bookmark,
  Filter,
  SortAsc,
  RefreshCw,
  ExternalLink,
  Lock,
  Unlock,
  EyeOff,
  MoreHorizontal,
  Check,
  X as XIcon,
  ArrowRight,
  ArrowLeft,
  ChevronUp,
  ChevronDown as ChevronDownIcon,
  Info,
  HelpCircle,
  AlertCircle,
  Success,
  Warning,
  Activity,
  Layers,
  Database,
  Server,
  Wifi,
  Bluetooth,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  Headphones,
  Speaker,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Stop,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Crop,
  Scissors,
  Palette,
  Brush,
  Eraser,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Grid,
  Columns,
  Rows,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon,
  Star as StarIcon,
  Heart as HeartIcon,
  Smile,
  Frown,
  Meh,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown,
  Flag,
  Bookmark as BookmarkIcon,
  Tag,
  Hash,
  AtSign,
  Percent,
  Plus as PlusIcon,
  Minus,
  Divide,
  Equal,
  Infinity,
  Pi,
  Sigma,
  Alpha,
  Beta,
  Gamma,
  Delta,
  Epsilon,
  Zeta,
  Eta,
  Theta,
  Iota,
  Kappa,
  Lambda,
  Mu,
  Nu,
  Xi,
  Omicron,
  Rho,
  Tau,
  Upsilon,
  Phi,
  Chi,
  Psi,
  Omega
} from 'lucide-react';
import ProfileModal from '../../components/ui/ProfileModal';

const FarmerDashboard: React.FC<{ user?: any; onLogout?: () => void }> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCropUpload, setShowCropUpload] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCropUploadModal, setShowCropUploadModal] = useState(false);
  const [cropFormData, setCropFormData] = useState({
    cropName: '',
    cropType: '',
    variety: '',
    quantity: '',
    unit: 'quintal',
    quality: 'A',
    harvestDate: '',
    price: '',
    organic: false,
    location: '',
    description: '',
    images: []
  });

  // State for uploaded crops (user's actual crops)
  const [uploadedCrops, setUploadedCrops] = useState([]);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [selectedCropImages, setSelectedCropImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // User profile data - using actual user data
  const [userProfile, setUserProfile] = useState({
    id: user?.id || '1',
    name: user?.name || user?.firstName + ' ' + user?.lastName || 'Farmer User',
    email: user?.email || 'farmer@achhadam.com',
    phone: user?.phone || '+91 0000000000',
    userType: 'farmer' as const,
    address: user?.address || 'Farm Address',
    city: user?.city || 'City',
    state: user?.state || 'State',
    pincode: user?.pincode || '000000',
    dateOfBirth: user?.dateOfBirth || '1990-01-01',
    profileImage: user?.profileImage || '',
    businessName: user?.businessName || 'My Farm',
    businessType: user?.businessType || 'individual',
    kycStatus: user?.kycStatus || 'pending' as const,
    aadharNumber: user?.aadharNumber || '',
    panNumber: user?.panNumber || '',
    bankAccountNumber: user?.bankAccountNumber || '',
    ifscCode: user?.ifscCode || '',
    bankName: user?.bankName || '',
    createdAt: user?.createdAt || new Date().toISOString(),
    lastLogin: new Date().toISOString()
  });

  // Predefined crop categories for easy selection (farmer-friendly)
  const cropCategories = {
    'Grains': {
      'Rice': ['Basmati', 'Non-Basmati', 'Sona Masuri', 'Ponni', 'Jasmine'],
      'Wheat': ['Durum', 'Soft Wheat', 'Hard Wheat', 'Spring Wheat'],
      'Maize': ['Sweet Corn', 'Field Corn', 'Popcorn', 'Flint Corn'],
      'Barley': ['Two-row', 'Six-row', 'Hulless'],
      'Millet': ['Pearl Millet', 'Finger Millet', 'Foxtail Millet', 'Proso Millet']
    },
    'Pulses': {
      'Lentils': ['Red Lentils', 'Green Lentils', 'Black Lentils', 'Yellow Lentils'],
      'Chickpeas': ['Desi', 'Kabuli', 'Green Gram'],
      'Black Gram': ['Urad Dal', 'Black Gram Whole'],
      'Green Gram': ['Moong Dal', 'Green Gram Whole'],
      'Pigeon Pea': ['Toor Dal', 'Arhar Dal', 'Red Gram']
    },
    'Vegetables': {
      'Tomato': ['Cherry', 'Roma', 'Beefsteak', 'Heirloom'],
      'Onion': ['Red Onion', 'White Onion', 'Yellow Onion'],
      'Potato': ['Russet', 'Red Potato', 'Sweet Potato', 'Fingerling'],
      'Cabbage': ['Green Cabbage', 'Red Cabbage', 'Savoy Cabbage'],
      'Cauliflower': ['White', 'Purple', 'Green', 'Romanesco']
    },
    'Fruits': {
      'Mango': ['Alphonso', 'Dasheri', 'Langra', 'Chausa', 'Kesar'],
      'Banana': ['Cavendish', 'Red Banana', 'Plantain', 'Lady Finger'],
      'Apple': ['Red Delicious', 'Granny Smith', 'Golden Delicious', 'Fuji'],
      'Orange': ['Navel', 'Valencia', 'Blood Orange', 'Mandarin'],
      'Grapes': ['Thompson Seedless', 'Red Globe', 'Black Grapes', 'Green Grapes']
    },
    'Spices': {
      'Turmeric': ['Lakadong', 'Alleppey', 'Madras', 'Rajapuri'],
      'Chili': ['Red Chili', 'Green Chili', 'Kashmiri Chili', 'Bird Eye Chili'],
      'Cumin': ['Jeera', 'Black Cumin', 'White Cumin'],
      'Coriander': ['Dhaniya', 'Coriander Seeds', 'Coriander Leaves'],
      'Cardamom': ['Green Cardamom', 'Black Cardamom', 'White Cardamom']
    }
  };

  // Quality grades with descriptions
  const qualityGrades = [
    { value: 'A', label: 'Grade A (Premium)', description: 'Best quality, no defects, premium price' },
    { value: 'B', label: 'Grade B (Good)', description: 'Good quality, minor defects, fair price' },
    { value: 'C', label: 'Grade C (Average)', description: 'Average quality, some defects, lower price' }
  ];

  // Units for quantity
  const quantityUnits = [
    { value: 'quintal', label: 'Quintal (100 kg)', local: 'क्विंटल' },
    { value: 'kg', label: 'Kilogram', local: 'किलो' },
    { value: 'ton', label: 'Ton (1000 kg)', local: 'टन' },
    { value: 'bag', label: 'Bag (50 kg)', local: 'बोरी' },
    { value: 'piece', label: 'Piece', local: 'टुकड़ा' }
  ];

  // Function to select best image from multiple images
  const selectBestImage = (images) => {
    if (!images || images.length === 0) return null;
    if (images.length === 1) return images[0];
    
    // Simple algorithm: choose the first image as "best" for now
    // In real implementation, you could use image analysis, file size, etc.
    return images[0];
  };

  // Function to save crops to localStorage (simulating database)
  const saveCropsToStorage = (crops) => {
    try {
      localStorage.setItem(`farmer_crops_${userProfile.id}`, JSON.stringify(crops));
    } catch (error) {
      console.error('Error saving crops to storage:', error);
    }
  };

  // Function to load crops from localStorage
  const loadCropsFromStorage = () => {
    try {
      const savedCrops = localStorage.getItem(`farmer_crops_${userProfile.id}`);
      return savedCrops ? JSON.parse(savedCrops) : [];
    } catch (error) {
      console.error('Error loading crops from storage:', error);
      return [];
    }
  };

  // Update user profile when user data changes
  useEffect(() => {
    if (user) {
      setUserProfile(prev => ({
        ...prev,
        id: user.id || prev.id,
        name: user.name || user.firstName + ' ' + user.lastName || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        city: user.city || prev.city,
        state: user.state || prev.state,
        pincode: user.pincode || prev.pincode,
        dateOfBirth: user.dateOfBirth || prev.dateOfBirth,
        profileImage: user.profileImage || prev.profileImage,
        businessName: user.businessName || prev.businessName,
        businessType: user.businessType || prev.businessType,
        kycStatus: user.kycStatus || prev.kycStatus,
        aadharNumber: user.aadharNumber || prev.aadharNumber,
        panNumber: user.panNumber || prev.panNumber,
        bankAccountNumber: user.bankAccountNumber || prev.bankAccountNumber,
        ifscCode: user.ifscCode || prev.ifscCode,
        bankName: user.bankName || prev.bankName,
        createdAt: user.createdAt || prev.createdAt
      }));
    }
  }, [user]);

  // Load crops from storage when component mounts
  useEffect(() => {
    const savedCrops = loadCropsFromStorage();
    setUploadedCrops(savedCrops);
  }, [userProfile.id]);

  // Save crops to storage whenever uploadedCrops changes
  useEffect(() => {
    if (uploadedCrops.length > 0) {
      saveCropsToStorage(uploadedCrops);
    }
  }, [uploadedCrops, userProfile.id]);

  // Mock data for comprehensive farmer dashboard
  const [cropListings] = useState([
    {
      id: '1',
      name: 'Premium Basmati Rice',
      type: 'Rice',
      quantity: 50,
      unit: 'quintal',
      quality: 'Premium',
      price: 2500,
      harvestDate: '2024-01-15',
      location: 'Patna, Bihar',
      images: ['/api/placeholder/300/200'],
      organic: true,
      soilType: 'Alluvial',
      farmingMethod: 'Organic',
      shelfLife: '12 months',
      status: 'active'
    },
    {
      id: '2',
      name: 'Fresh Tomatoes',
      type: 'Vegetables',
      quantity: 25,
      unit: 'quintal',
      quality: 'Grade A',
      price: 1200,
      harvestDate: '2024-01-20',
      location: 'Patna, Bihar',
      images: ['/api/placeholder/300/200'],
      organic: false,
      soilType: 'Red Soil',
      farmingMethod: 'Traditional',
      shelfLife: '2 weeks',
      status: 'active'
    }
  ]);

  const [buyerRequests] = useState([
    {
      id: '1',
      buyerName: 'FreshMart Stores',
      cropType: 'Rice',
      quantity: 30,
      unit: 'quintal',
      maxPrice: 2800,
      location: 'Delhi',
      distance: '1200 km',
      rating: 4.8,
      previousTransactions: 45,
      preferredPayment: 'Advance + Balance',
      urgency: 'high',
      message: 'Need premium quality rice for export'
    },
    {
      id: '2',
      buyerName: 'Local Mandi',
      cropType: 'Tomatoes',
      quantity: 20,
      unit: 'quintal',
      maxPrice: 1000,
      location: 'Patna',
      distance: '50 km',
      rating: 4.2,
      previousTransactions: 12,
      preferredPayment: 'Cash on Delivery',
      urgency: 'medium',
      message: 'Daily supply needed'
    }
  ]);

  const [incomingOrders] = useState([
    {
      id: '1',
      buyerName: 'FreshMart Stores',
      cropName: 'Premium Basmati Rice',
      quantity: 30,
      unit: 'quintal',
      offeredPrice: 2800,
      totalAmount: 84000,
      deliveryTerms: 'FOB Patna',
      paymentTerms: '50% Advance, 50% on Delivery',
      deliveryDate: '2024-01-25',
      status: 'pending',
      chatMessages: 3,
      contractGenerated: false
    },
    {
      id: '2',
      buyerName: 'Local Mandi',
      cropName: 'Fresh Tomatoes',
      quantity: 20,
      unit: 'quintal',
      offeredPrice: 1000,
      totalAmount: 20000,
      deliveryTerms: 'Pickup from Farm',
      paymentTerms: 'Cash on Delivery',
      deliveryDate: '2024-01-22',
      status: 'negotiating',
      chatMessages: 7,
      contractGenerated: true
    }
  ]);

  const [salesAnalytics] = useState({
    monthlyRevenue: 125000,
    totalOrders: 45,
    averageOrderValue: 2777,
    topCrop: 'Rice',
    seasonalTrend: '+15%',
    marketShare: '8.5%'
  });

  const [marketIntelligence] = useState({
    mandiRates: {
      rice: 2400,
      wheat: 2200,
      tomatoes: 800,
      potatoes: 1200
    },
    priceTrends: {
      rice: '+5%',
      wheat: '+2%',
      tomatoes: '-10%',
      potatoes: '+8%'
    },
    demandForecast: {
      rice: 'High',
      wheat: 'Medium',
      tomatoes: 'Low',
      potatoes: 'High'
    }
  });

  const [financialData] = useState({
    totalEarnings: 450000,
    pendingPayments: 25000,
    platformCommission: 22500,
    netEarnings: 402500,
    bankAccount: 'SBI ****7890',
    lastSettlement: '2024-01-15'
  });

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'crop-upload', label: 'Crop Upload', icon: Upload },
    { id: 'marketplace', label: 'Buyer Marketplace', icon: ShoppingCart },
    { id: 'orders', label: 'Order Management', icon: Package },
    { id: 'analytics', label: 'Business Analytics', icon: BarChart3 },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'financial', label: 'Financial Center', icon: DollarSign },
    { id: 'weather', label: 'Weather', icon: Sun },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'negotiating': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Image Gallery Modal Component
  const renderImageGalleryModal = () => (
    showImageGallery && (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">📸 Crop Image Gallery</h2>
                <p className="text-gray-600 text-sm">
                  Image {currentImageIndex + 1} of {selectedCropImages.length}
                </p>
              </div>
              <button 
                onClick={() => setShowImageGallery(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Main Image Display */}
          <div className="relative bg-gray-100 flex items-center justify-center" style={{ height: '60vh' }}>
            {selectedCropImages.length > 0 && (
              <>
                {/* Previous Button */}
                {selectedCropImages.length > 1 && (
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === 0 ? selectedCropImages.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                )}

                {/* Main Image */}
                <img 
                  src={selectedCropImages[currentImageIndex]} 
                  alt={`Crop Image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />

                {/* Next Button */}
                {selectedCropImages.length > 1 && (
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === selectedCropImages.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {selectedCropImages.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {selectedCropImages.length > 1 && (
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex space-x-2 overflow-x-auto">
                {selectedCropImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-green-500 ring-2 ring-green-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
              <button 
                onClick={() => setShowImageGallery(false)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Crop Upload Section
  // Crop upload modal component
  const renderCropUploadModal = () => (
    showCropUploadModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">🌾 Crop Upload</h2>
                <p className="text-gray-600 mt-1">सरल तरीके से अपनी फसल अपलोड करें</p>
              </div>
              <button 
                onClick={() => setShowCropUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Step 1: Crop Selection */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <Leaf className="h-5 w-5 mr-2" />
                Step 1: अपनी फसल चुनें (Select Your Crop)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Crop Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    फसल का प्रकार (Crop Category)
                  </label>
                  <select 
                    value={cropFormData.cropType}
                    onChange={(e) => {
                      setCropFormData(prev => ({ ...prev, cropType: e.target.value, variety: '' }));
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">-- चुनें (Select) --</option>
                    {Object.keys(cropCategories).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Crop Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    फसल का नाम (Crop Name)
                  </label>
                  <select 
                    value={cropFormData.cropName}
                    onChange={(e) => setCropFormData(prev => ({ ...prev, cropName: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    disabled={!cropFormData.cropType}
                  >
                    <option value="">-- पहले प्रकार चुनें (Select Category First) --</option>
                    {cropFormData.cropType && cropCategories[cropFormData.cropType] && 
                      Object.keys(cropCategories[cropFormData.cropType]).map(crop => (
                        <option key={crop} value={crop}>{crop}</option>
                      ))
                    }
                  </select>
                </div>

                {/* Variety */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    किस्म (Variety)
                  </label>
                  <select 
                    value={cropFormData.variety}
                    onChange={(e) => setCropFormData(prev => ({ ...prev, variety: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    disabled={!cropFormData.cropName}
                  >
                    <option value="">-- किस्म चुनें (Select Variety) --</option>
                    {cropFormData.cropType && cropFormData.cropName && 
                      cropCategories[cropFormData.cropType][cropFormData.cropName]?.map(variety => (
                        <option key={variety} value={variety}>{variety}</option>
                      ))
                    }
                  </select>
                </div>

                {/* Quality Grade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    गुणवत्ता (Quality Grade)
                  </label>
                  <select 
                    value={cropFormData.quality}
                    onChange={(e) => setCropFormData(prev => ({ ...prev, quality: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {qualityGrades.map(grade => (
                      <option key={grade.value} value={grade.value}>
                        {grade.label} - {grade.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Quantity & Pricing */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Step 2: मात्रा और मूल्य (Quantity & Pricing)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    मात्रा (Quantity)
                  </label>
                  <input 
                    type="number" 
                    value={cropFormData.quantity}
                    onChange={(e) => setCropFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="उदाहरण: 10"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    इकाई (Unit)
                  </label>
                  <select 
                    value={cropFormData.unit}
                    onChange={(e) => setCropFormData(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {quantityUnits.map(unit => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label} ({unit.local})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    मूल्य प्रति इकाई (Price per Unit)
                  </label>
                  <input 
                    type="number" 
                    value={cropFormData.price}
                    onChange={(e) => setCropFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="₹ रुपये में"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Market Price Suggestion */}
              {cropFormData.cropName && cropFormData.quality && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium text-yellow-800">
                      Market Price Suggestion: ₹{Math.floor(Math.random() * 1000) + 2000} - ₹{Math.floor(Math.random() * 1000) + 4000} per {cropFormData.unit}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Harvest & Location */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Step 3: कटाई और स्थान (Harvest & Location)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Harvest Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    कटाई की तारीख (Harvest Date)
                  </label>
                  <input 
                    type="date" 
                    value={cropFormData.harvestDate}
                    onChange={(e) => setCropFormData(prev => ({ ...prev, harvestDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    स्थान (Location)
                  </label>
                  <input 
                    type="text" 
                    value={cropFormData.location}
                    onChange={(e) => setCropFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="गाँव, जिला, राज्य"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Organic Checkbox */}
              <div className="mt-4">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={cropFormData.organic}
                    onChange={(e) => setCropFormData(prev => ({ ...prev, organic: e.target.checked }))}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    जैविक फसल (Organic Crop) 🌱
                  </span>
                </label>
              </div>
            </div>

            {/* Step 4: Photos & Description */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Step 4: फोटो और विवरण (Photos & Description)
              </h3>
              
              {/* Photo Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  फसल की तस्वीरें (Crop Photos)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">फोटो अपलोड करने के लिए यहाँ क्लिक करें</p>
                  <p className="text-sm text-gray-500">JPG, PNG (Max 5MB each)</p>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    className="hidden"
                    id="crop-photos"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const imageUrls = files.map(file => URL.createObjectURL(file));
                      setCropFormData(prev => ({ ...prev, images: [...prev.images, ...imageUrls] }));
                    }}
                  />
                  <label 
                    htmlFor="crop-photos"
                    className="mt-2 inline-block bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 cursor-pointer"
                  >
                    Choose Photos
                  </label>
                  
                  {/* Show selected images */}
                  {cropFormData.images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Selected Images:</p>
                      <div className="flex flex-wrap gap-2">
                        {cropFormData.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={image} 
                              alt={`Crop ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg border"
                            />
                            <button
                              onClick={() => {
                                setCropFormData(prev => ({
                                  ...prev,
                                  images: prev.images.filter((_, i) => i !== index)
                                }));
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  अतिरिक्त जानकारी (Additional Information)
                </label>
                <textarea 
                  value={cropFormData.description}
                  onChange={(e) => setCropFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="फसल के बारे में कोई विशेष जानकारी..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-xl">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setShowCropUploadModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <div className="flex space-x-3">
                <button 
                  onClick={() => {
                    // Reset form
                    setCropFormData({
                      cropName: '',
                      cropType: '',
                      variety: '',
                      quantity: '',
                      unit: 'quintal',
                      quality: 'A',
                      harvestDate: '',
                      price: '',
                      organic: false,
                      location: '',
                      description: '',
                      images: []
                    });
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
                <button 
                  onClick={() => {
                    // Handle crop upload
                    if (!cropFormData.cropName || !cropFormData.quantity || !cropFormData.price) {
                      alert('कृपया सभी आवश्यक फील्ड भरें (Please fill all required fields)');
                      return;
                    }

                    // Create new crop object
                    const newCrop = {
                      id: Date.now().toString(),
                      name: cropFormData.cropName,
                      type: cropFormData.cropType,
                      variety: cropFormData.variety,
                      quantity: cropFormData.quantity,
                      unit: cropFormData.unit,
                      quality: cropFormData.quality,
                      price: parseFloat(cropFormData.price),
                      harvestDate: cropFormData.harvestDate,
                      organic: cropFormData.organic,
                      location: cropFormData.location,
                      description: cropFormData.description,
                      images: cropFormData.images,
                      status: 'active',
                      uploadedAt: new Date().toISOString(),
                      farmerName: userProfile.name,
                      farmerId: userProfile.id
                    };

                    // Add to uploaded crops list
                    const updatedCrops = [newCrop, ...uploadedCrops];
                    setUploadedCrops(updatedCrops);
                    
                    // Save to storage immediately
                    saveCropsToStorage(updatedCrops);

                    // Reset form
                    setCropFormData({
                      cropName: '',
                      cropType: '',
                      variety: '',
                      quantity: '',
                      unit: 'quintal',
                      quality: 'A',
                      harvestDate: '',
                      price: '',
                      organic: false,
                      location: '',
                      description: '',
                      images: []
                    });

                    alert('फसल सफलतापूर्वक अपलोड हो गई! 🎉 (Crop uploaded successfully!)');
                    setShowCropUploadModal(false);
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Upload className="h-5 w-5" />
                  <span>Upload Crop</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderCropUpload = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Smart Crop Listing</h2>
            <p className="text-gray-600 mt-1">Upload your crops with AI-powered features</p>
          </div>
          <button 
            onClick={() => setShowCropUploadModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Listing</span>
          </button>
        </div>
      </div>

      {/* Current Listings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Your Active Listings</h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Your Crops: <span className="font-semibold text-green-600">{uploadedCrops.length}</span>
              </span>
              <span className="text-sm text-gray-600">
                Total Listings: <span className="font-semibold text-blue-600">{uploadedCrops.length + cropListings.length}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          {/* Show message if no crops uploaded */}
          {uploadedCrops.length === 0 && (
            <div className="text-center py-8 mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Crops Uploaded Yet</h4>
              <p className="text-gray-600 mb-4">Start by uploading your first crop to see it here!</p>
              <button 
                onClick={() => setShowCropUploadModal(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>Upload Your First Crop</span>
              </button>
            </div>
          )}

          {/* Show uploaded crops first, then mock data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User's uploaded crops */}
            {uploadedCrops.map((crop) => (
              <div key={crop.id} className="border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-green-50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{crop.name}</h4>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        YOUR CROP
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {crop.type} • {crop.variety && `${crop.variety} • `}{crop.quantity} {crop.unit}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(crop.status)}`}>
                    {crop.status.toUpperCase()}
                  </span>
                </div>
                
                {/* Crop Image */}
                {crop.images && crop.images.length > 0 ? (
                  <div className="mb-4 relative">
                    <img 
                      src={selectBestImage(crop.images)} 
                      alt={crop.name}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => {
                        setSelectedCropImages(crop.images);
                        setCurrentImageIndex(0);
                        setShowImageGallery(true);
                      }}
                    />
                    {/* Image count badge */}
                    {crop.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                        +{crop.images.length - 1} more
                      </div>
                    )}
                    {/* Click hint */}
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                      Click to view all images
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                    <span className="text-gray-500 ml-2">No Image</span>
                  </div>
                )}
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Quality:</span>
                    <span className="font-medium">{crop.quality}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Price:</span>
                    <span className="font-medium">₹{crop.price}/{crop.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Harvest Date:</span>
                    <span className="font-medium">{new Date(crop.harvestDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Organic:</span>
                    <span className={`font-medium ${crop.organic ? 'text-green-600' : 'text-gray-600'}`}>
                      {crop.organic ? 'Yes 🌱' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Location:</span>
                    <span className="font-medium">{crop.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Uploaded:</span>
                    <span className="font-medium">{new Date(crop.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        // Edit crop functionality
                        setCropFormData({
                          cropName: crop.name,
                          cropType: crop.type,
                          variety: crop.variety,
                          quantity: crop.quantity,
                          unit: crop.unit,
                          quality: crop.quality,
                          harvestDate: crop.harvestDate,
                          price: crop.price.toString(),
                          organic: crop.organic,
                          location: crop.location,
                          description: crop.description,
                          images: crop.images
                        });
                        setShowCropUploadModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Crop"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => {
                        // View crop details
                        alert(`Crop Details:\n\nName: ${crop.name}\nType: ${crop.type}\nVariety: ${crop.variety}\nQuantity: ${crop.quantity} ${crop.unit}\nPrice: ₹${crop.price}/${crop.unit}\nQuality: ${crop.quality}\nOrganic: ${crop.organic ? 'Yes' : 'No'}\nLocation: ${crop.location}\nDescription: ${crop.description}`);
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('क्या आप इस फसल को हटाना चाहते हैं? (Do you want to delete this crop?)')) {
                          const updatedCrops = uploadedCrops.filter(c => c.id !== crop.id);
                          setUploadedCrops(updatedCrops);
                          saveCropsToStorage(updatedCrops);
                          alert('फसल हटा दी गई (Crop deleted)');
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Crop"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    View Details →
                  </button>
                </div>
              </div>
            ))}

            {/* Mock data crops (for demonstration) */}
            {cropListings.map((crop) => (
              <div key={crop.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{crop.name}</h4>
                    <p className="text-sm text-gray-500">{crop.type} • {crop.quantity} {crop.unit}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(crop.status)}`}>
                    {crop.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Quality:</span>
                    <span className="font-medium">{crop.quality}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Price:</span>
                    <span className="font-medium">{formatCurrency(crop.price)}/{crop.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Harvest Date:</span>
                    <span className="font-medium">{new Date(crop.harvestDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Organic:</span>
                    <span className={`font-medium ${crop.organic ? 'text-green-600' : 'text-gray-600'}`}>
                      {crop.organic ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Features */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">AI-Powered Features</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Auto Crop Detection</h4>
              <p className="text-sm text-gray-600">Upload photos and AI will automatically detect crop type and quality</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Smart Pricing</h4>
              <p className="text-sm text-gray-600">Get AI-suggested prices based on market rates and quality</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Buyer Matching</h4>
              <p className="text-sm text-gray-600">AI matches your crops with the best buyers automatically</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Buyer Marketplace Section
  const renderMarketplace = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Live Buyer Marketplace</h2>
            <p className="text-gray-600 mt-1">Real-time buyer requests and smart matching</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Buyer Requests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Real-time Buyer Requests</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {buyerRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{request.buyerName}</h4>
                      <p className="text-sm text-gray-500">{request.cropType} • {request.quantity} {request.unit}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency.toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{request.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{request.location} ({request.distance})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Max: {formatCurrency(request.maxPrice)}/{request.unit}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{request.previousTransactions} transactions</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700">{request.message}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Payment: {request.preferredPayment}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Accept
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Negotiate
                    </button>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Matching */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Smart Matching Algorithm</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Auto-Suggest Best Buyers</h4>
              <p className="text-sm text-gray-600">AI matches you with buyers based on location, price, and rating</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Distance Calculator</h4>
              <p className="text-sm text-gray-600">Automatic transportation cost calculation for better pricing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Order Management Section
  const renderOrders = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Management Center</h2>
            <p className="text-gray-600 mt-1">Manage incoming orders and communicate with buyers</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </button>
          </div>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">3</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed Orders</p>
              <p className="text-2xl font-bold text-green-600">12</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">5</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-600">28</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Award className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Incoming Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Incoming Orders</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {incomingOrders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{order.buyerName}</h4>
                      <p className="text-sm text-gray-500">{order.cropName} • {order.quantity} {order.unit}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                    {order.chatMessages > 0 && (
                      <div className="flex items-center space-x-1 text-blue-600">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">{order.chatMessages}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Price: {formatCurrency(order.offeredPrice)}/{order.unit}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Delivery: {new Date(order.deliveryDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Total: {formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Delivery Terms:</span>
                      <p className="text-gray-600">{order.deliveryTerms}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Payment Terms:</span>
                      <p className="text-gray-600">{order.paymentTerms}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => setShowChat(true)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">Chat</span>
                    </button>
                    {order.contractGenerated && (
                      <button className="flex items-center space-x-2 text-green-600 hover:text-green-700">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Contract</span>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Accept
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Negotiate
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat System */}
      {showChat && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Chat with Buyer</h3>
              <button 
                onClick={() => setShowChat(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto mb-4">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                    <p className="text-sm">Hello, I'm interested in your rice. Can you provide more details about the quality?</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-xs">
                    <p className="text-sm">Sure! It's premium basmati rice, organic certified. I can send you photos if needed.</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                    <p className="text-sm">Yes, please send photos. Also, what's your best price for 30 quintals?</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Mic className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Image className="h-5 w-5" />
              </button>
              <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Business Analytics Section
  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Business Analytics</h2>
            <p className="text-gray-600 mt-1">Track your sales performance and market intelligence</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sales Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">{formatCurrency(salesAnalytics.monthlyRevenue)}</h4>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">{salesAnalytics.totalOrders}</h4>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">{salesAnalytics.seasonalTrend}</h4>
              <p className="text-sm text-gray-600">Seasonal Trend</p>
            </div>
          </div>
        </div>
      </div>

      {/* Market Intelligence */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Market Intelligence</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Current Mandi Rates</h4>
              <div className="space-y-3">
                {Object.entries(marketIntelligence.mandiRates).map(([crop, rate]) => (
                  <div key={crop} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{crop}</span>
                    <span className="font-medium">{formatCurrency(rate)}/quintal</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Price Trends</h4>
              <div className="space-y-3">
                {Object.entries(marketIntelligence.priceTrends).map(([crop, trend]) => (
                  <div key={crop} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{crop}</span>
                    <span className={`font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {trend}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Services Section
  const renderServices = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Integrated Services Marketplace</h2>
            <p className="text-gray-600 mt-1">Access farm inputs, equipment, and technology services</p>
          </div>
        </div>
      </div>

      {/* Farm Inputs Store */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Farm Inputs Store</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sprout className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Seeds & Fertilizers</h4>
              <p className="text-sm text-gray-600">Quality certified products with bulk discounts</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Equipment Rental</h4>
              <p className="text-sm text-gray-600">Tractors, harvesters on hourly/daily basis</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Insurance & Credit</h4>
              <p className="text-sm text-gray-600">Crop insurance and quick loan options</p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Services */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Technology Services</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">IoT Solutions</h4>
              <p className="text-sm text-gray-600">Soil sensors, weather monitoring, crop health tracking</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Drone Services</h4>
              <p className="text-sm text-gray-600">Pesticide spraying, crop assessment, aerial photography</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Financial Center Section
  const renderFinancial = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Financial Center</h2>
            <p className="text-gray-600 mt-1">Track earnings, payments, and platform commissions</p>
          </div>
        </div>
      </div>

      {/* Earnings Dashboard */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Earnings Dashboard</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.totalEarnings)}</h4>
              <p className="text-sm text-gray-600">Total Earnings</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.pendingPayments)}</h4>
              <p className="text-sm text-gray-600">Pending Payments</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.platformCommission)}</h4>
              <p className="text-sm text-gray-600">Platform Commission</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.netEarnings)}</h4>
              <p className="text-sm text-gray-600">Net Earnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Tracking */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Payment Tracking</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Order #ORD-001</h4>
                <p className="text-sm text-gray-600">FreshMart Stores • Rice 30 quintals</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(84000)}</p>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  Paid
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Order #ORD-002</h4>
                <p className="text-sm text-gray-600">Local Mandi • Tomatoes 20 quintals</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(20000)}</p>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-4">
      {/* Stats Grid - Perfect Mobile Design */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {/* Total Crops */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Total Crops</p>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </div>
        </div>
        
        {/* Active Crops */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Sprout className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Active Crops</p>
            <p className="text-2xl font-bold text-blue-600">8</p>
          </div>
        </div>
        
        {/* Harvested */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Harvested</p>
            <p className="text-2xl font-bold text-purple-600">4</p>
          </div>
        </div>
        
        {/* Total Earnings */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Total Earnings</p>
            <p className="text-lg font-bold text-gray-900">₹12.5L</p>
          </div>
        </div>
        
        {/* Total Land */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
              <MapPin className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Total Land</p>
            <p className="text-lg font-bold text-indigo-600">25 acres</p>
          </div>
        </div>
        
        {/* Pending Orders */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Pending Orders</p>
            <p className="text-2xl font-bold text-orange-600">6</p>
          </div>
        </div>
      </div>

      {/* Weather Alert - Real Practical Feature */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Weather Alert</h3>
              <p className="text-xs opacity-90">Heavy rain expected in 2 hours</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-90">Temperature</p>
            <p className="text-lg font-bold">28°C</p>
          </div>
        </div>
      </div>

      {/* Crop Health Status - Real Practical Feature */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Crop Health Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">Wheat (Field A)</span>
            </div>
            <span className="text-sm text-green-600 font-medium">Healthy</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">Rice (Field B)</span>
            </div>
            <span className="text-sm text-yellow-600 font-medium">Needs Water</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">Tomato (Field C)</span>
            </div>
            <span className="text-sm text-red-600 font-medium">Pest Alert</span>
          </div>
        </div>
      </div>

      {/* Market Prices - Real Practical Feature */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Market Prices</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Wheat className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-gray-900">Wheat</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-gray-900">₹2,450/quintal</span>
              <span className="text-xs text-green-600 ml-2">+5%</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Carrot className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-900">Rice</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-gray-900">₹3,200/quintal</span>
              <span className="text-xs text-red-600 ml-2">-2%</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Apple className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-gray-900">Tomato</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-gray-900">₹45/kg</span>
              <span className="text-xs text-green-600 ml-2">+12%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Perfect Mobile Design */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors min-h-[100px]">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Plus className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-700 text-center">Add Crop</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors min-h-[100px]">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-700 text-center">View Orders</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors min-h-[100px]">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <Sun className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-700 text-center">Weather</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors min-h-[100px]">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-3">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-orange-700 text-center">Analytics</span>
          </button>
        </div>
      </div>

      {/* Recent Activity - Mobile Optimized */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Recent Activity</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
              <Leaf className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Wheat crop planted</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">New order received</p>
              <p className="text-xs text-gray-500">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
              <Sun className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Weather alert: Rain expected</p>
              <p className="text-xs text-gray-500">6 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleUpdateProfile = (updatedProfile: any) => {
    setUserProfile(updatedProfile);
    // Here you would typically make an API call to update the profile
    console.log('Profile updated:', updatedProfile);
  };

  const handleDeleteAccount = () => {
    // Here you would typically make an API call to delete the account
    console.log('Account deletion requested');
    alert('Account deletion feature will be implemented with backend integration');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'crop-upload':
        return renderCropUpload();
      case 'marketplace':
        return renderMarketplace();
      case 'orders':
        return renderOrders();
      case 'analytics':
        return renderAnalytics();
      case 'services':
        return renderServices();
      case 'financial':
        return renderFinancial();
      case 'weather':
        return (
          <div className="space-y-4">
            {/* Orders Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Orders Management</h2>
              <div className="mt-2 sm:mt-0 flex space-x-2">
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  New Order
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Filter
                </button>
              </div>
            </div>

            {/* Orders Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-orange-600">6</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Confirmed</p>
                    <p className="text-2xl font-bold text-blue-600">12</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Shipped</p>
                    <p className="text-2xl font-bold text-purple-600">8</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Delivered</p>
                    <p className="text-2xl font-bold text-green-600">24</p>
                  </div>
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {/* Order 1 */}
                <div className="p-4 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Wheat className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Wheat - 50 Quintals</h4>
                          <p className="text-xs text-gray-500">Order #ORD-001 • Buyer: Agro Traders</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">₹1,22,500</p>
                        <p className="text-xs text-gray-500">₹2,450/quintal</p>
                      </div>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order 2 */}
                <div className="p-4 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Carrot className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Rice - 30 Quintals</h4>
                          <p className="text-xs text-gray-500">Order #ORD-002 • Buyer: Food Corp</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">₹96,000</p>
                        <p className="text-xs text-gray-500">₹3,200/quintal</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Confirmed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order 3 */}
                <div className="p-4 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Apple className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Tomato - 200 kg</h4>
                          <p className="text-xs text-gray-500">Order #ORD-003 • Buyer: Local Market</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">₹9,000</p>
                        <p className="text-xs text-gray-500">₹45/kg</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Delivered
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'weather':
        return (
          <div className="space-y-4">
            {/* Weather Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Weather & Climate</h2>
              <div className="mt-2 sm:mt-0 flex space-x-2">
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Refresh
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Forecast
                </button>
              </div>
            </div>

            {/* Current Weather */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Sun className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">28°C</h3>
                    <p className="text-sm opacity-90">Partly Cloudy</p>
                    <p className="text-xs opacity-75">Patna, Bihar</p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xs opacity-75">Humidity</p>
                    <p className="text-lg font-semibold">65%</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Wind</p>
                    <p className="text-lg font-semibold">12 km/h</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Rain</p>
                    <p className="text-lg font-semibold">20%</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">UV Index</p>
                    <p className="text-lg font-semibold">7</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Alerts */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Sun className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800">Weather Alert</h4>
                  <p className="text-xs text-yellow-700">Heavy rainfall expected in next 2-3 hours. Prepare for waterlogging.</p>
                </div>
              </div>
            </div>

            {/* 7-Day Forecast */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">7-Day Forecast</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {/* Day 1 */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Sun className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Today</p>
                      <p className="text-xs text-gray-500">Partly Cloudy</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">28°C</p>
                    <p className="text-xs text-gray-500">Rain: 20%</p>
                  </div>
                </div>

                {/* Day 2 */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Cloud className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Tomorrow</p>
                      <p className="text-xs text-gray-500">Heavy Rain</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">24°C</p>
                    <p className="text-xs text-gray-500">Rain: 90%</p>
                  </div>
                </div>

                {/* Day 3 */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Sun className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Day After</p>
                      <p className="text-xs text-gray-500">Sunny</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">32°C</p>
                    <p className="text-xs text-gray-500">Rain: 5%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Farming Recommendations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Farming Recommendations</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Leaf className="h-3 w-3 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Ideal for planting</p>
                    <p className="text-xs text-gray-600">Current weather conditions are perfect for planting new crops.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Droplets className="h-3 w-3 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Water management</p>
                    <p className="text-xs text-gray-600">Reduce irrigation due to expected rainfall in next 2 days.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Wind className="h-3 w-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Wind protection</p>
                    <p className="text-xs text-gray-600">Secure loose items and protect young plants from strong winds.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-4">
            {/* Analytics Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Farm Analytics</h2>
              <div className="mt-2 sm:mt-0 flex space-x-2">
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Export Data
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Filter
                </button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-green-600">₹2.5L</p>
                    <p className="text-xs text-green-600">+15% vs last month</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Yield</p>
                    <p className="text-2xl font-bold text-blue-600">85%</p>
                    <p className="text-xs text-blue-600">+8% vs last season</p>
                  </div>
                  <Leaf className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Efficiency</p>
                    <p className="text-2xl font-bold text-purple-600">92%</p>
                    <p className="text-xs text-purple-600">+5% vs last year</p>
                  </div>
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Costs</p>
                    <p className="text-2xl font-bold text-orange-600">₹1.2L</p>
                    <p className="text-xs text-orange-600">-3% vs last month</p>
                  </div>
                  <Package className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Crop Performance Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Crop Performance</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {/* Wheat */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Wheat className="h-5 w-5 text-amber-600" />
                      <span className="text-sm font-medium text-gray-900">Wheat</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">85%</span>
                    </div>
                  </div>
                  
                  {/* Rice */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Carrot className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Rice</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '78%'}}></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">78%</span>
                    </div>
                  </div>
                  
                  {/* Tomato */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Apple className="h-5 w-5 text-red-600" />
                      <span className="text-sm font-medium text-gray-900">Tomato</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: '92%'}}></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">92%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Revenue Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
              </div>
              <div className="p-4">
                <div className="flex items-end justify-between h-32 space-x-2">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 bg-blue-500 rounded-t" style={{height: '60%'}}></div>
                    <span className="text-xs text-gray-600">Jan</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 bg-blue-500 rounded-t" style={{height: '80%'}}></div>
                    <span className="text-xs text-gray-600">Feb</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 bg-blue-500 rounded-t" style={{height: '70%'}}></div>
                    <span className="text-xs text-gray-600">Mar</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 bg-blue-500 rounded-t" style={{height: '90%'}}></div>
                    <span className="text-xs text-gray-600">Apr</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 bg-blue-500 rounded-t" style={{height: '85%'}}></div>
                    <span className="text-xs text-gray-600">May</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 bg-green-500 rounded-t" style={{height: '100%'}}></div>
                    <span className="text-xs text-gray-600">Jun</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing Crops */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Top Performing Crops</h3>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <Apple className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Tomato</p>
                      <p className="text-xs text-gray-500">200 kg harvested</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">₹9,000</p>
                    <p className="text-xs text-green-600">+12% profit</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <Wheat className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Wheat</p>
                      <p className="text-xs text-gray-500">50 quintals harvested</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">₹1,22,500</p>
                    <p className="text-xs text-green-600">+8% profit</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Carrot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Rice</p>
                      <p className="text-xs text-gray-500">30 quintals harvested</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">₹96,000</p>
                    <p className="text-xs text-green-600">+5% profit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return <div className="text-center py-12"><h3 className="text-lg font-semibold text-gray-900">Settings Page - Coming Soon</h3></div>;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery Modal */}
      {renderImageGalleryModal()}
      
      {/* Crop Upload Modal */}
      {renderCropUploadModal()}
      
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              
              {/* Desktop Sidebar Toggle */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Farmer Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search - Hidden on mobile */}
              <div className="hidden sm:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User Profile - Mobile Optimized */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* User Info - Hidden on mobile */}
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-32">{userProfile.name}</p>
                  <p className="text-xs text-gray-500 truncate max-w-32">{userProfile.email}</p>
                  <p className="text-xs text-green-600 font-medium">FARMER</p>
                </div>
                
                {/* User Avatar & Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">F</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-600 hidden sm:block" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                        <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                        <p className="text-xs text-gray-500">{userProfile.email}</p>
                        <p className="text-xs text-green-600 font-medium">FARMER</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowProfileModal(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>View Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileModal(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </button>
                      <hr className="my-2" />
                      {onLogout && (
                        <button
                          onClick={() => {
                            onLogout();
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <span>Logout</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:block ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-sm border-r border-gray-200 transition-all duration-300`}>
          <nav className="p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
                      {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                            activeTab === item.id
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-6">
          {renderContent()}
        </main>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={userProfile}
        onUpdate={handleUpdateProfile}
        onDeleteAccount={handleDeleteAccount}
        onLogout={() => {
          setShowProfileModal(false);
          if (onLogout) onLogout();
        }}
      />
    </div>
  );
};

export default FarmerDashboard;
