import React, { useState, useEffect } from 'react';
import ProductsPage from './ProductsPage';
import SuppliersPage from './SuppliersPage';
import AnalyticsPage from './AnalyticsPage';
import FavoritesPage from './FavoritesPage';
import SettingsPage from './SettingsPage';
import ContractsPage from './ContractsPage';
import ProfileModal from '../../components/ui/ProfileModal';
import ChatModal from '../../components/ui/ChatModal';
import { 
  loadAllFarmerCrops, 
  filterCropsByCategory, 
  searchCrops, 
  sortCrops, 
  getCropCategories,
  getMarketplaceStats,
  type MarketplaceCrop 
} from '../../services/marketplaceService';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Users, 
  Settings, 
  Bell, 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  BarChart3,
  PieChart,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  Heart,
  Share2,
  MoreVertical,
  Menu,
  Clock,
  CheckCircle,
  User,
  ChevronDown,
  X,
  Home,
  MessageCircle
} from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
  favoriteSuppliers: number;
  activeContracts: number;
}

interface RecentOrder {
  id: string;
  supplier: string;
  product: string;
  quantity: number;
  price: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  date: string;
  location: string;
}

interface Supplier {
  id: string;
  name: string;
  rating: number;
  location: string;
  products: string[];
  isVerified: boolean;
  lastOrder: string;
}

interface BuyerDashboardProps {
  user?: any;
  onLogout?: () => void;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Marketplace states
  const [marketplaceCrops, setMarketplaceCrops] = useState<MarketplaceCrop[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<MarketplaceCrop[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [marketplaceSearchQuery, setMarketplaceSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('demand');
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<MarketplaceCrop | null>(null);
  const [marketplaceStats, setMarketplaceStats] = useState(getMarketplaceStats());
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('all');
  const [selectedOrganic, setSelectedOrganic] = useState('all');
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [selectedCropImages, setSelectedCropImages] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock user profile data
  const [userProfile, setUserProfile] = useState({
    id: user?.id || '1',
    name: user?.name || user?.firstName + ' ' + user?.lastName || 'Buyer User',
    email: user?.email || 'buyer@achhadam.com',
    phone: user?.phone || '+91 0000000000',
    userType: 'buyer' as const,
    address: user?.address || 'Business Address',
    city: user?.city || 'City',
    state: user?.state || 'State',
    pincode: user?.pincode || '000000',
    dateOfBirth: user?.dateOfBirth || '1990-01-01',
    profileImage: user?.profileImage || '',
    businessName: user?.businessName || 'My Business',
    businessType: user?.businessType || 'company',
    kycStatus: user?.kycStatus || 'pending' as const,
    aadharNumber: user?.aadharNumber || '',
    panNumber: user?.panNumber || '',
    bankAccountNumber: user?.bankAccountNumber || '',
    ifscCode: user?.ifscCode || '',
    bankName: user?.bankName || '',
    createdAt: user?.createdAt || new Date().toISOString(),
    lastLogin: new Date().toISOString()
  });

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

  // Load marketplace data - REAL FARMER DATA
  useEffect(() => {
    const loadMarketplaceData = () => {
      console.log('🛒 Loading marketplace data for buyer:', userProfile.name);
      const crops = loadAllFarmerCrops();
      setMarketplaceCrops(crops);
      setFilteredCrops(crops);
      setMarketplaceStats(getMarketplaceStats());
      console.log(`🛒 Marketplace loaded: ${crops.length} crops from ${new Set(crops.map(c => c.farmerId)).size} farmers`);
    };

    loadMarketplaceData();
    
    // Refresh data every 10 seconds for real-time updates
    const interval = setInterval(loadMarketplaceData, 10000);
    return () => clearInterval(interval);
  }, [userProfile.name]);

  // Filter and search crops
  useEffect(() => {
    let filtered = marketplaceCrops;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filterCropsByCategory(filtered, selectedCategory);
    }
    
    // Search crops
    if (marketplaceSearchQuery.trim()) {
      filtered = searchCrops(filtered, marketplaceSearchQuery);
    }
    
    // Price range filter
    filtered = filtered.filter(crop => 
      crop.price >= priceRange.min && crop.price <= priceRange.max
    );

    // Quality filter
    if (selectedQuality !== 'all') {
      filtered = filtered.filter(crop => crop.quality === selectedQuality);
    }

    // Organic filter
    if (selectedOrganic !== 'all') {
      if (selectedOrganic === 'organic') {
        filtered = filtered.filter(crop => crop.organic);
      } else if (selectedOrganic === 'non-organic') {
        filtered = filtered.filter(crop => !crop.organic);
      }
    }
    
    // Sort crops
    filtered = sortCrops(filtered, sortBy);
    
    setFilteredCrops(filtered);
  }, [marketplaceCrops, selectedCategory, marketplaceSearchQuery, sortBy, priceRange, selectedQuality, selectedOrganic]);

  // Real stats - calculated from actual data
  const stats: DashboardStats = {
    totalOrders: 0, // Will be loaded from orders
    pendingOrders: 0, // Will be loaded from pending orders
    completedOrders: 0, // Will be loaded from completed orders
    totalSpent: 0, // Will be calculated from order history
    favoriteSuppliers: 0, // Will be calculated from supplier data
    activeContracts: 0 // Will be loaded from contracts
  };

  // Real recent orders - loaded from actual data
  const recentOrders: RecentOrder[] = [];

  // Real suppliers - loaded from actual farmer data
  const suppliers: Supplier[] = [];

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'text-blue-600' },
    { id: 'orders', label: 'My Orders', icon: ShoppingCart, color: 'text-green-600' },
    { id: 'products', label: 'Products', icon: Package, color: 'text-purple-600' },
    { id: 'suppliers', label: 'Suppliers', icon: Users, color: 'text-orange-600' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'text-indigo-600' },
    { id: 'contracts', label: 'Contracts', icon: BarChart3, color: 'text-red-600' },
    { id: 'favorites', label: 'Favorites', icon: Heart, color: 'text-pink-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderOverview = () => (
    <div className="space-y-4">
      {/* Stats Cards - Perfect Mobile Design */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {/* Total Orders */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Total Spent</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
          </div>
        </div>

        {/* Favorites */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Favorites</p>
            <p className="text-2xl font-bold text-pink-600">{stats.favoriteSuppliers}</p>
          </div>
        </div>

        {/* Contracts */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Contracts</p>
            <p className="text-2xl font-bold text-indigo-600">{stats.activeContracts}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions - Perfect Mobile Design */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors min-h-[100px]">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-700 text-center">New Order</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors min-h-[100px]">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-700 text-center">Browse Products</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors min-h-[100px]">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-700 text-center">Find Suppliers</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors min-h-[100px]">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-3">
              <BarChart3 className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-orange-700 text-center">Analytics</span>
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All
            </button>
          </div>
        </div>
        {/* Mobile-Friendly Order Cards */}
        <div className="space-y-3 p-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex flex-col space-y-3">
                {/* Order Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{order.id}</h4>
                    <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                
                {/* Product Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{order.product}</p>
                    <p className="text-xs text-gray-500">{order.quantity} kg</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(order.price)}</p>
                  </div>
                </div>
                
                {/* Supplier Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{order.supplier}</p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {order.location}
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Cancel">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="text-xs text-gray-500 hover:text-gray-700">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Suppliers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Top Suppliers</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {supplier.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
                      {supplier.isVerified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{supplier.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{supplier.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    View Profile
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketplace = () => (
    <div className="space-y-6">
      {/* Marketplace Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">🌾 Farmer Marketplace</h2>
            <p className="text-gray-600 mt-1">Discover fresh crops from local farmers</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-green-600">{marketplaceStats.totalCrops}</span> crops available
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">{marketplaceStats.totalFarmers}</span> farmers
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              {showAdvancedFilters ? 'Hide Filters' : 'Advanced Filters'}
            </button>
            <button
              onClick={() => {
                const crops = loadAllFarmerCrops();
                setMarketplaceCrops(crops);
                setFilteredCrops(crops);
                setMarketplaceStats(getMarketplaceStats());
                console.log('🔄 Marketplace data refreshed manually');
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search crops, farmers, or locations..."
                value={marketplaceSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {marketplaceStats.categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label} ({category.count})
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="demand">Sort by Demand</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="distance">Distance</option>
              <option value="rating">Farmer Rating</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredCrops.length} of {marketplaceCrops.length} crops
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (₹)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => handlePriceRangeChange(Number(e.target.value), priceRange.max)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => handlePriceRangeChange(priceRange.min, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
              <select
                value={selectedQuality}
                onChange={(e) => handleQualityChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Quality</option>
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>
            </div>

            {/* Organic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organic</label>
              <select
                value={selectedOrganic}
                onChange={(e) => handleOrganicChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="organic">Organic Only</option>
                <option value="non-organic">Non-Organic Only</option>
              </select>
            </div>

            {/* Distance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Distance (km)</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">Any Distance</option>
                <option value="10">Within 10 km</option>
                <option value="25">Within 25 km</option>
                <option value="50">Within 50 km</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Crop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop, index) => (
          <div key={`${crop.id}_${index}_${crop.farmer.id}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Crop Image */}
            <div className="relative h-48 bg-gray-100 cursor-pointer" onClick={() => handleImageClick(crop)}>
              {crop.images && crop.images.length > 0 ? (
                <img
                  src={crop.images[0]?.imageUrl || '/placeholder-crop.jpg'}
                  alt={crop.name}
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-crop.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌾</div>
                    <div className="text-sm">No Image</div>
                  </div>
                </div>
              )}
              
              {/* Image Gallery Indicator */}
              {crop.images && crop.images.length > 1 && (
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {crop.images.length} images
                </div>
              )}
              
              {/* Click to View Gallery */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 transition-opacity">
                  <Eye className="h-8 w-8 text-white" />
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="absolute top-2 left-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {crop.status}
                </span>
              </div>
              
              {/* Demand Score */}
              <div className="absolute top-2 right-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {Math.round(crop.demandScore)}% Demand
                </span>
              </div>
            </div>

            {/* Crop Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{crop.name}</h3>
                  <p className="text-sm text-gray-600">{crop.type} • {crop.variety}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    ₹{crop.price}/{crop.unit === 'kg' ? 'kg' : 'quintal'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {crop.quantity} {crop.unit}
                  </div>
                </div>
              </div>

              {/* Farmer Info */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{crop.farmer.name}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {crop.farmer.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm ml-1">{crop.farmer.rating.toFixed(1)}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {crop.distance?.toFixed(1)} km away
                  </div>
                </div>
              </div>

              {/* Crop Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Quality:</span>
                  <span className="font-medium">{crop.quality} Grade</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Harvest Date:</span>
                  <span className="font-medium">{new Date(crop.harvestDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Organic:</span>
                  <span className={`font-medium ${crop.organic ? 'text-green-600' : 'text-gray-600'}`}>
                    {crop.organic ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {/* Price Comparison */}
              {crop.priceComparison && (
                <div className="mb-4 p-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Market Comparison</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Market Average:</span>
                    <span className="text-sm font-medium">₹{crop.priceComparison.marketAverage.toFixed(0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Price:</span>
                    <span className={`text-sm font-medium ${crop.priceComparison.isAboveAverage ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{crop.price} ({crop.priceComparison.isAboveAverage ? '+' : ''}{crop.priceComparison.percentageDifference.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleChatWithFarmer(crop)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat</span>
                </button>
                <button
                  onClick={() => handleOrderCrop(crop)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Order</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredCrops.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌾</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No crops found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setMarketplaceSearchQuery('');
              setSortBy('demand');
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>New Order</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Mobile-Friendly Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Orders</h3>
        </div>
        <div className="space-y-3 p-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex flex-col space-y-3">
                {/* Order Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{order.id}</h4>
                    <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                
                {/* Product Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{order.product}</p>
                    <p className="text-xs text-gray-500">{order.quantity} kg</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(order.price)}</p>
                  </div>
                </div>
                
                {/* Supplier Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{order.supplier}</p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {order.location}
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Cancel">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="text-xs text-gray-500 hover:text-gray-700">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const handleUpdateProfile = (updatedProfile: any) => {
    setUserProfile(updatedProfile);
    // Here you would typically make an API call to update the profile
    console.log('Profile updated:', updatedProfile);
  };

  // Marketplace functions
  const handleChatWithFarmer = (crop: MarketplaceCrop) => {
    setSelectedCrop(crop);
    setShowChatModal(true);
  };

  const handleCloseChat = () => {
    setShowChatModal(false);
    setSelectedCrop(null);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (query: string) => {
    setMarketplaceSearchQuery(query);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const handleOrderCrop = (crop: MarketplaceCrop) => {
    // Open order modal or redirect to order page
    console.log('Ordering crop:', crop);
    // TODO: Implement order functionality
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
  };

  const handleOrganicChange = (organic: string) => {
    setSelectedOrganic(organic);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setMarketplaceSearchQuery('');
    setSortBy('demand');
    setPriceRange({ min: 0, max: 1000 });
    setSelectedQuality('all');
    setSelectedOrganic('all');
  };

  const handleImageClick = (crop: MarketplaceCrop) => {
    if (crop.images && crop.images.length > 0) {
      setSelectedCropImages(crop.images);
      setCurrentImageIndex(0);
      setShowImageGallery(true);
    }
  };

  const handleCloseImageGallery = () => {
    setShowImageGallery(false);
    setSelectedCropImages([]);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    if (selectedCropImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedCropImages.length);
    }
  };

  const handlePrevImage = () => {
    if (selectedCropImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedCropImages.length) % selectedCropImages.length);
    }
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
      case 'orders':
        return renderOrders();
      case 'products':
        return renderMarketplace();
      case 'suppliers':
        return <SuppliersPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'contracts':
        return <ContractsPage />;
      case 'favorites':
        return <FavoritesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Buyer Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search - Responsive */}
              <div className="hidden sm:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              {/* Mobile Search Button */}
              <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Search className="h-5 w-5 text-gray-600" />
              </button>
              
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
                  <p className="text-xs text-blue-600 font-medium">BUYER</p>
                </div>
                
                {/* User Avatar & Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm sm:text-base">B</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-600 hidden sm:block" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {/* Mobile User Info */}
                      <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
                        <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                        <p className="text-xs text-gray-500">{userProfile.email}</p>
                        <p className="text-xs text-blue-600 font-medium">BUYER</p>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowProfileModal(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                        >
                          <User className="h-4 w-4" />
                          <span>View Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileModal(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit Profile</span>
                        </button>
                        <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3">
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </button>
                        <hr className="my-2" />
                        {onLogout && (
                          <button
                            onClick={() => {
                              onLogout();
                              setShowUserMenu(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
                          >
                            <span>Logout</span>
                          </button>
                        )}
                      </div>
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

      {/* Chat Modal */}
      {selectedCrop && (
        <ChatModal
          isOpen={showChatModal}
          onClose={handleCloseChat}
          farmer={selectedCrop.farmer}
          crop={selectedCrop}
          buyer={userProfile}
        />
      )}

      {/* Image Gallery Modal */}
      {showImageGallery && selectedCropImages.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
            {/* Gallery Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Crop Images</h3>
              <button
                onClick={handleCloseImageGallery}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Main Image */}
            <div className="relative">
              <img
                src={selectedCropImages[currentImageIndex]?.imageUrl || '/placeholder-crop.jpg'}
                alt={`Crop image ${currentImageIndex + 1}`}
                className="w-full h-96 object-contain bg-gray-100"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-crop.jpg';
                }}
              />
              
              {/* Navigation Arrows */}
              {selectedCropImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <ChevronDown className="h-6 w-6 rotate-90" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <ChevronDown className="h-6 w-6 -rotate-90" />
                  </button>
                </>
              )}
            </div>

            {/* Image Counter */}
            <div className="p-4 text-center text-sm text-gray-600">
              {currentImageIndex + 1} of {selectedCropImages.length}
            </div>

            {/* Thumbnail Strip */}
            {selectedCropImages.length > 1 && (
              <div className="p-4 border-t">
                <div className="flex space-x-2 overflow-x-auto">
                  {selectedCropImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-gray-300'
                      }`}
                    >
                      <img
                        src={image?.imageUrl || '/placeholder-crop.jpg'}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-crop.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;