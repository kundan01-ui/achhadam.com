import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  Search,
  Grid,
  List,
  Settings,
  Package,
  MapPin,
  Leaf,
  Clock,
  ShoppingCart as CartIcon,
  LogOut,
  User
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui';
import type { SelectOption } from '../../components/ui';
import OptimizedProductCard, { type Product } from '../../components/ui/OptimizedProductCard';
import ChatModal from '../../components/chat/ChatModal';
import {
  loadAllFarmerCrops,
  type MarketplaceCrop
} from '../../services/marketplaceService';
import {
  addToCartWithNotification,
  buyNow,
  subscribeToCartChanges,
  getCartItemCount
} from '../../services/cartService';
import razorpayService from '../../services/razorpayService';

const BuyerProductsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);

  // Real crop data from database
  const [crops, setCrops] = useState<MarketplaceCrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [newCropsCount, setNewCropsCount] = useState(0);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCropCountRef = useRef(0);

  // Chat modal state
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedChatProduct, setSelectedChatProduct] = useState<Product | null>(null);

  // Scroll state for hiding navbar
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold
        setShowNavbar(false);
      } else {
        // Scrolling up
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Load crops from database
  const loadCrops = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const allCrops = await loadAllFarmerCrops();

      if (isRefresh && lastCropCountRef.current > 0) {
        const newCount = allCrops.length - lastCropCountRef.current;
        if (newCount > 0) {
          setNewCropsCount(newCount);
          showNewCropsNotification(newCount);
        }
      }

      setCrops(allCrops);
      lastCropCountRef.current = allCrops.length;
      setLastRefreshTime(new Date());

      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to load crops:', error);
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadCrops();
  }, [loadCrops]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    refreshIntervalRef.current = setInterval(() => {
      loadCrops(true);
    }, 30000);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [loadCrops]);

  // Subscribe to cart changes
  useEffect(() => {
    const unsubscribe = subscribeToCartChanges((cart) => {
      setCartItemCount(cart.totalItems);
    });
    setCartItemCount(getCartItemCount());
    return unsubscribe;
  }, []);

  const categoryOptions: SelectOption[] = [
    { value: '', label: 'All Categories' },
    { value: 'grains', label: 'Grains & Cereals' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'pulses', label: 'Pulses & Legumes' },
    { value: 'spices', label: 'Spices & Herbs' }
  ];

  const locationOptions: SelectOption[] = [
    { value: '', label: 'All Locations' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Haryana', label: 'Haryana' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Karnataka', label: 'Karnataka' }
  ];

  const sortOptions: SelectOption[] = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

  // Convert MarketplaceCrop to Product format
  const products: Product[] = crops.map((crop: MarketplaceCrop, index: number) => {
    // Fix image mapping - handle both object format (from database) and string format (from localStorage)
    let imageUrls: string[] = [];

    if (crop.images && Array.isArray(crop.images)) {
      imageUrls = crop.images.map((img: any) => {
        // Handle object format: { url: '...', caption: '...', isPrimary: true }
        if (typeof img === 'object' && img.url) {
          return img.url;
        }
        // Handle string format directly
        if (typeof img === 'string') {
          return img;
        }
        return '';
      }).filter(url => url !== ''); // Remove empty URLs
    }

    // Fallback to default if no valid images
    if (imageUrls.length === 0) {
      imageUrls = ['/images/default-crop.jpg'];
    }

    console.log(`📸 Crop "${crop.name}" images:`, imageUrls);

    // Extract variety from database
    const variety = crop.variety || crop.subcategory || '';

    return {
      id: crop.id || `crop-${index}-${Date.now()}`,
      name: crop.name || crop.cropName || 'Unknown Crop',
      category: crop.type || crop.cropType || 'crops',
      subcategory: variety, // Rice variety like "Basmati", Cauliflower variety like "White"
      description: crop.description || 'Fresh crop from local farmer',
      price: typeof crop.price === 'object' ? crop.price.pricePerUnit || 0 : crop.price || crop.pricing?.pricePerUnit || 0,
      unit: typeof crop.quantity === 'object' ? crop.quantity.unit || 'kg' : crop.unit || 'kg',
      quantity: typeof crop.quantity === 'object' ? crop.quantity.available || 0 : crop.quantity || 0,
      quality: crop.quality || 'Good',
      location: typeof crop.location === 'object' ? crop.location.city || crop.location.state || 'Unknown' : crop.location || 'Unknown',
      harvestDate: typeof crop.harvest === 'object' ? crop.harvest.harvestDate || new Date().toISOString() : crop.harvestDate || new Date().toISOString(),
      organic: crop.organic || false,
      grade: crop.grade || crop.cropDetails?.grade || 'A',
      rating: 4.5,
      reviewCount: 0,
      images: imageUrls,
      tags: crop.organic ? ['Organic', 'Fresh'] : ['Fresh'],
      certifications: crop.organic ? ['Organic Certified'] : [],
      supplier: {
        id: crop.farmerId || crop.farmerAssociation?.farmerId || 'unknown',
        name: crop.farmerName || crop.farmerAssociation?.farmerName || 'Local Farmer',
        rating: 4.9,
        verified: true,
        farmName: crop.farmName,
        totalCrops: crop.farmer?.totalCrops,
        joinedDate: crop.farmer?.joinedDate
      }
    };
  });

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedCategory && product.category !== selectedCategory) return false;
      if (selectedLocation && product.location !== selectedLocation) return false;
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      if (organicOnly && !product.organic) return false;
      if (minRating > 0 && product.rating < minRating) return false;
      return true;
    });

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime());
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, selectedLocation, priceRange, organicOnly, minRating, sortBy]);

  const handleAddToCart = (productId: string) => {
    const product = filteredProducts.find(p => p.id === productId);
    if (product) {
      addToCartWithNotification(product, 1);
    }
  };

  const handleBuyNow = async (productId: string) => {
    const product = filteredProducts.find(p => p.id === productId);
    if (!product) return;

    try {
      // Create Razorpay order
      const order = await razorpayService.createOrder(
        product.price,
        'INR',
        `receipt_${Date.now()}`
      );

      // Initialize Razorpay payment
      razorpayService.initializePayment({
        key: 'rzp_test_RLB4SWduV7kkkH', // Test API key
        amount: order.amount,
        currency: order.currency,
        name: 'ACHHADAM',
        description: `Purchase ${product.name}`,
        order_id: order.id,
        prefill: {
          name: 'Buyer Name',
          email: 'buyer@example.com',
          contact: '9999999999'
        },
        notes: {
          address: 'Delivery Address',
          order_id: order.id
        },
        theme: {
          color: '#16a34a' // Green color
        },
        handler: (response: any) => {
          console.log('✅ Payment successful:', response);
          showNotification(`Payment successful! Order ID: ${response.razorpay_payment_id}`, 'success');

          // Add to orders after successful payment
          buyNow(product, 1);
        },
        modal: {
          ondismiss: () => {
            console.log('Payment dismissed');
            showNotification('Payment cancelled', 'error');
          }
        }
      });
    } catch (error) {
      console.error('❌ Payment error:', error);
      showNotification('Failed to initiate payment', 'error');
    }
  };

  const handleChat = (productId: string, farmerId: string) => {
    const product = filteredProducts.find(p => p.id === productId);
    if (product) {
      setSelectedChatProduct(product);
      setChatModalOpen(true);
    }
  };

  const handleWishlist = (productId: string) => {
    showNotification('Added to wishlist! ❤️', 'success');
  };

  const handleShare = (productId: string) => {
    const product = filteredProducts.find(p => p.id === productId);
    if (product) {
      const shareUrl = `${window.location.origin}/product/${productId}`;
      const shareText = `Check out ${product.name}! 🌾`;

      if (navigator.share) {
        navigator.share({ title: product.name, text: shareText, url: shareUrl });
      } else {
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        showNotification('Link copied to clipboard! 📋', 'success');
      }
    }
  };

  const handleView = (productId: string) => {
    window.location.href = `/product/${productId}`;
  };

  const handleManualRefresh = () => {
    setNewCropsCount(0);
    loadCrops(true);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full max-w-sm`;

    switch (type) {
      case 'success':
        notification.className += ' bg-green-500 text-white';
        break;
      case 'error':
        notification.className += ' bg-red-500 text-white';
        break;
      case 'info':
        notification.className += ' bg-blue-500 text-white';
        break;
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  const showNewCropsNotification = (count: number) => {
    showNotification(`🌾 ${count} new crop${count > 1 ? 's' : ''} added!`, 'success');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedLocation('');
    setPriceRange([0, 10000]);
    setOrganicOnly(false);
    setMinRating(0);
    setSortBy('relevance');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className={`bg-white shadow-sm sticky top-16 z-30 transition-transform duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ACHHADAM</h1>
                <p className="text-xs text-gray-500 hidden md:block">Fresh Farmer Marketplace</p>
              </div>
            </div>

            {/* Right Info - Relevant Buyer Data */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Live Refresh Status */}
              <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-green-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${refreshing ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></div>
                <span className="text-xs font-medium text-green-700">
                  {refreshing ? 'Syncing...' : 'Live'}
                </span>
              </div>

              {/* New Crops Alert */}
              {newCropsCount > 0 && (
                <div className="hidden md:flex items-center px-3 py-1.5 bg-blue-50 rounded-lg">
                  <span className="text-xs font-semibold text-blue-700">
                    🌾 +{newCropsCount} New
                  </span>
                </div>
              )}

              {/* Cart with Item Count */}
              <button
                onClick={() => window.location.href = '/cart'}
                className="relative px-3 py-2 bg-white hover:bg-gray-50 border-2 border-green-600 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <CartIcon className="w-5 h-5 text-green-600" />
                  <span className="hidden md:block text-sm font-semibold text-green-600">
                    Cart {cartItemCount > 0 ? `(${cartItemCount})` : ''}
                  </span>
                </div>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Fresh Products 🌾
              </h2>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                {filteredProducts.length} products available
              </p>
            </div>

            {/* Live Status */}
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${refreshing ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></div>
                <span className="text-xs md:text-sm text-gray-600">
                  {refreshing ? 'Updating...' : 'Live'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="text-xs"
              >
                🔄 Refresh
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm bg-white p-3 md:p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-1 md:space-x-2">
              <Package className="w-4 h-4 text-green-600" />
              <span>{filteredProducts.length} Products</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>{new Set(filteredProducts.map(p => p.location)).size} Locations</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <Leaf className="w-4 h-4 text-green-600" />
              <span>{filteredProducts.filter(p => p.organic).length} Organic</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>Auto-refresh 30s</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-4 md:mb-6">
          <CardContent className="p-3 md:p-6">
            <div className="space-y-3 md:space-y-4">
              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-5 h-5" />}
                  />
                </div>

                {/* Quick Filters */}
                <div className="flex gap-2">
                  <Select
                    options={categoryOptions}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    placeholder="Category"
                    size="sm"
                  />
                  <Select
                    options={locationOptions}
                    value={selectedLocation}
                    onChange={setSelectedLocation}
                    placeholder="Location"
                    size="sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>

                {/* View Toggle */}
                <div className="flex space-x-1">
                  <Button
                    variant={viewMode === 'grid' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price Range (₹)</label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={priceRange[0].toString()}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          size="sm"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={priceRange[1].toString()}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          size="sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Sort By</label>
                      <Select
                        options={sortOptions}
                        value={sortBy}
                        onChange={setSortBy}
                        size="sm"
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={organicOnly}
                          onChange={(e) => setOrganicOnly(e.target.checked)}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm font-medium">Organic Only</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      {filteredProducts.length} products found
                    </p>
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-8 md:p-12 text-center">
              <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters</p>
              <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            </CardContent>
          </Card>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6'
              : 'space-y-2 md:space-y-3'
          }>
            {filteredProducts.map((product) => (
              <OptimizedProductCard
                key={product.id}
                product={product}
                variant={viewMode === 'list' ? 'compact' : 'default'}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onChat={handleChat}
              />
            ))}
          </div>
        )}
      </main>

      {/* Chat Modal */}
      <ChatModal
        isOpen={chatModalOpen}
        onClose={() => {
          setChatModalOpen(false);
          setSelectedChatProduct(null);
        }}
        farmerId={selectedChatProduct?.supplier.id || ''}
        farmerName={selectedChatProduct?.supplier.name || ''}
        productId={selectedChatProduct?.id}
        productName={selectedChatProduct?.name}
        productImage={selectedChatProduct?.images[0]}
        productPrice={selectedChatProduct?.price}
        farmerRating={selectedChatProduct?.supplier.rating}
      />
    </div>
  );
};

export default BuyerProductsPage;