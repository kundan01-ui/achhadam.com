import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  Search,
  Grid,
  List,
  Settings,
  Package,
  MapPin,
  Leaf,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui';
import type { SelectOption } from '../../components/ui';
import ProductCard, { type Product } from '../../components/ui/ProductCard';
import DashboardLayout from '../../components/layout/DashboardLayout';
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

const ProductListing: React.FC = () => {
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

  // Load crops from database with enhanced sync
  const loadCrops = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        console.log('🔄 PRODUCTS PAGE: Refreshing crops from database...');
      } else {
        setLoading(true);
        console.log('🌾 PRODUCTS PAGE: Loading crops from database...');
      }

      // Load crops from database with real-time sync
      const allCrops = await loadAllFarmerCrops();
      console.log('🌾 PRODUCTS PAGE: Loaded crops from database:', allCrops.length);
      console.log('🌾 PRODUCTS PAGE: Database sync status - crops loaded successfully');

      // Check for new crops
      if (isRefresh && lastCropCountRef.current > 0) {
        const newCount = allCrops.length - lastCropCountRef.current;
        if (newCount > 0) {
          setNewCropsCount(newCount);
          showNewCropsNotification(newCount);
          console.log(`🆕 Found ${newCount} new crops from database!`);
        }
      }

      setCrops(allCrops);
      lastCropCountRef.current = allCrops.length;
      setLastRefreshTime(new Date());

      console.log('✅ PRODUCTS PAGE: Database sync completed successfully');

      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ PRODUCTS PAGE: Database sync error:', error);
      console.log('🔄 PRODUCTS PAGE: Falling back to cached data...');
      
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  // Load crops on component mount
  useEffect(() => {
    loadCrops();
  }, [loadCrops]);

  // Set up real-time auto-refresh
  useEffect(() => {
    console.log('⏰ Setting up auto-refresh for real-time crop updates');

    // Refresh every 30 seconds for real-time updates
    refreshIntervalRef.current = setInterval(() => {
      console.log('🔄 Auto-refreshing crops for real-time updates...');
      loadCrops(true);
    }, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        console.log('🛑 Auto-refresh stopped');
      }
    };
  }, [loadCrops]);

  // Subscribe to cart changes
  useEffect(() => {
    const unsubscribe = subscribeToCartChanges((cart) => {
      setCartItemCount(cart.totalItems);
    });

    // Initial cart count
    setCartItemCount(getCartItemCount());

    return unsubscribe;
  }, []);

  const categoryOptions: SelectOption[] = [
    { value: '', label: 'All Categories' },
    { value: 'grains', label: 'Grains & Cereals' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'pulses', label: 'Pulses & Legumes' },
    { value: 'spices', label: 'Spices & Herbs' },
    { value: 'dairy', label: 'Dairy Products' },
    { value: 'meat', label: 'Meat & Poultry' },
    { value: 'fishery', label: 'Fishery Products' }
  ];

  const locationOptions: SelectOption[] = [
    { value: '', label: 'All Locations' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Haryana', label: 'Haryana' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Rajasthan', label: 'Rajasthan' }
  ];

  const sortOptions: SelectOption[] = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popularity', label: 'Most Popular' }
  ];

  // Convert MarketplaceCrop to Product format
  console.log('🌾 PRODUCTS PAGE: Converting crops to products...');
  console.log('🌾 PRODUCTS PAGE: Raw crops data:', crops);
  console.log('🌾 PRODUCTS PAGE: Crops count:', crops.length);
  
  const products: Product[] = crops.map((crop: MarketplaceCrop, index: number) => {
    console.log('🌾 PRODUCTS PAGE: Processing crop:', crop);
    console.log('🌾 PRODUCTS PAGE: Crop quantity type:', typeof crop.quantity, crop.quantity);
    const uniqueId = crop.id || `crop-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('🌾 PRODUCTS PAGE: Generated unique ID:', uniqueId);
    return {
      id: uniqueId,
      name: crop.name || crop.cropDetails?.name || 'Unknown Crop',
      category: crop.type || crop.cropDetails?.category || 'crops',
      subcategory: crop.variety || crop.cropDetails?.variety || 'Unknown',
      description: crop.description || crop.cropDetails?.description || 'Fresh crop from local farmer',
      price: typeof crop.price === 'object' ? crop.price.pricePerUnit || 0 : crop.price || 0,
      unit: typeof crop.quantity === 'object' ? crop.quantity.unit || 'kg' : crop.unit || 'kg',
      quantity: typeof crop.quantity === 'object' ? crop.quantity.available || 0 : crop.quantity || 0,
      location: crop.location || 'Unknown',
      harvestDate: typeof crop.harvest === 'object' ? crop.harvest.date || new Date().toISOString() : crop.harvestDate || new Date().toISOString(),
      organic: crop.organic || false,
      grade: 'A', // Default grade
      rating: 4.5, // Default rating
      reviewCount: 0, // Default review count
      images: crop.images && crop.images.length > 0 ? crop.images : ['/images/default-crop.jpg'],
      tags: crop.organic ? ['Organic'] : ['Fresh'],
      certifications: crop.organic ? ['Organic Certified'] : [],
      supplier: {
        id: crop.farmerId || 'unknown',
        name: crop.farmerName || 'Local Farmer',
        rating: 4.9,
        verified: true
      }
    };
  });
  
  console.log('🌾 PRODUCTS PAGE: Converted products:', products);
  console.log('🌾 PRODUCTS PAGE: Products count:', products.length);
  
  // Check for duplicate IDs
  const productIds = products.map(p => p.id);
  const uniqueIds = new Set(productIds);
  console.log('🌾 PRODUCTS PAGE: Total IDs:', productIds.length);
  console.log('🌾 PRODUCTS PAGE: Unique IDs:', uniqueIds.size);
  if (productIds.length !== uniqueIds.size) {
    console.warn('⚠️ PRODUCTS PAGE: Duplicate IDs found!', productIds);
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search query
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // Location filter
      if (selectedLocation && product.location !== selectedLocation) {
        return false;
      }

      // Price range filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Organic filter
      if (organicOnly && !product.organic) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      return true;
    });

    // Sort products
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
      case 'popularity':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // Relevance - keep original order
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, selectedLocation, priceRange, organicOnly, minRating, sortBy]);

  // Enhanced handler functions with real implementations
  const handleAddToCart = (productId: string) => {
    const product = filteredProducts.find(p => p.id === productId);
    if (product) {
      try {
        addToCartWithNotification(product, 1);
        console.log('✅ Added to cart:', product.name);
      } catch (error) {
        console.error('❌ Failed to add to cart:', error);
      }
    }
  };

  const handleBuyNow = (productId: string) => {
    const product = filteredProducts.find(p => p.id === productId);
    if (product) {
      try {
        buyNow(product, 1);
        console.log('⚡ Buy Now:', product.name);
      } catch (error) {
        console.error('❌ Failed to buy now:', error);
      }
    }
  };

  const handleChat = (productId: string, farmerId: string) => {
    const product = filteredProducts.find(p => p.id === productId);
    if (product) {
      console.log('💬 Opening chat with farmer:', product.supplier.name);
      setSelectedChatProduct(product);
      setChatModalOpen(true);
    }
  };

  const handleWishlist = (productId: string) => {
    console.log('❤️ Adding to wishlist:', productId);
    // Implement wishlist functionality
    showNotification('Added to wishlist! ❤️', 'success');
  };

  const handleShare = (productId: string) => {
    const product = filteredProducts.find(p => p.id === productId);
    if (product) {
      const shareUrl = `${window.location.origin}/product/${productId}`;
      const shareText = `Check out this fresh ${product.name} from ${product.supplier.name}! 🌾`;

      if (navigator.share) {
        navigator.share({
          title: product.name,
          text: shareText,
          url: shareUrl
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        showNotification('Product link copied to clipboard! 📋', 'success');
      }
    }
  };

  const handleView = (productId: string) => {
    console.log('👀 Viewing product details:', productId);
    // Navigate to product detail page
    window.location.href = `/product/${productId}`;
  };

  // Manual refresh function
  const handleManualRefresh = () => {
    setNewCropsCount(0);
    loadCrops(true);
  };

  // Notification functions
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

    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);

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
    showNotification(`🌾 ${count} new crop${count > 1 ? 's' : ''} just added to marketplace!`, 'success');
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

  // Show loading state with database sync info
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading crops from database...</p>
          <p className="text-sm text-gray-500 mt-2">Syncing with farmer database...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no crops found
  if (crops.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🌾</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Crops Available</h3>
          <p className="text-gray-500 mb-4">No crops found in the database</p>
          <p className="text-sm text-gray-400">Crops count: {crops.length}</p>
          <button 
            onClick={() => loadCrops(true)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Refresh Database
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      role="buyer"
      userName="Amit Sharma"
      userAvatar=""
    >
      {/* Page Header with Real-time Info */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              Browse Products 🛒
              {cartItemCount > 0 && (
                <span className="ml-3 px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                  {cartItemCount} in cart
                </span>
              )}
            </h1>
            <p className="text-gray-600">Discover fresh, quality products from verified farmers</p>
            <p className="text-sm text-gray-500 mt-1">
              Database: {crops.length} crops • Products: {products.length} • Filtered: {filteredProducts.length}
            </p>
          </div>

          {/* Real-time Status */}
          <div className="text-right">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${refreshing ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></div>
                <span className="text-sm text-gray-600">
                  {refreshing ? 'Updating...' : 'Live'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="text-gray-600"
              >
                🔄 Refresh
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Last updated: {lastRefreshTime.toLocaleTimeString()}
            </p>
            {newCropsCount > 0 && (
              <p className="text-xs text-green-600 font-semibold">
                🆕 {newCropsCount} new crops available!
              </p>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm md:text-base text-gray-600 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-1">
            <Package className="w-4 h-4" />
            <span className="font-medium">{filteredProducts.length} products available</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{new Set(filteredProducts.map(p => p.location)).size} locations</span>
          </div>
          <div className="flex items-center space-x-1">
            <Leaf className="w-4 h-4" />
            <span className="font-medium">{filteredProducts.filter(p => p.organic).length} organic products</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span className="font-medium">Auto-updates every 30s</span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Search products, categories, or suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="flex space-x-2">
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
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full sm:w-auto"
              >
                <Settings className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="flex-1 sm:flex-none"
              >
                <Grid className="w-4 h-4" />
                <span className="ml-1 sm:hidden">Grid</span>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex-1 sm:flex-none"
              >
                <List className="w-4 h-4" />
                <span className="ml-1 sm:hidden">List</span>
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Price Range (₹)
                  </label>
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
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Sort By
                  </label>
                  <Select
                    options={sortOptions}
                    value={sortBy}
                    onChange={setSortBy}
                    size="sm"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="organic"
                    checked={organicOnly}
                    onChange={(e) => setOrganicOnly(e.target.checked)}
                    className="w-4 h-4 text-primary-green border-gray-300 rounded focus:ring-primary-green"
                  />
                  <label htmlFor="organic" className="text-sm font-medium text-text-dark">
                    Organic Only
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Minimum Rating
                  </label>
                  <Select
                    options={[
                      { value: '0', label: 'Any Rating' },
                      { value: '4', label: '4+ Stars' },
                      { value: '4.5', label: '4.5+ Stars' }
                    ]}
                    value={minRating.toString()}
                    onChange={(value) => setMinRating(Number(value))}
                    size="sm"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-text-light">
                  {filteredProducts.length} products found
                </p>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      <div className="space-y-6">
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-dark mb-2">No products found</h3>
              <p className="text-text-light mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6'
              : 'space-y-2 md:space-y-3'
          }>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant={viewMode === 'list' ? 'compact' : 'default'}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onChat={handleChat}
                onWishlist={handleWishlist}
                onShare={handleShare}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>

      {/* Load More */}
      {filteredProducts.length > 0 && (
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      )}

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
    </DashboardLayout>
  );
};

export default ProductListing;
