import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Grid, 
  List, 
  Settings,
  Package
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui';
import type { SelectOption } from '../../components/ui';
import ProductCard, { type Product } from '../../components/ui/ProductCard';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  loadAllFarmerCrops,
  type MarketplaceCrop 
} from '../../services/marketplaceService';

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

  // Load crops from database on component mount
  useEffect(() => {
    const loadCrops = async () => {
      try {
        console.log('🌾 PRODUCTS PAGE: Loading crops from database...');
        const allCrops = await loadAllFarmerCrops();
        console.log('🌾 PRODUCTS PAGE: Loaded crops:', allCrops.length);
        setCrops(allCrops);
        setLoading(false);
      } catch (error) {
        console.error('❌ PRODUCTS PAGE: Error loading crops:', error);
        setLoading(false);
      }
    };

    loadCrops();
  }, []);

  // Convert MarketplaceCrop to Product format
  const products: Product[] = crops.map((crop: MarketplaceCrop) => ({
    id: crop.id,
    name: crop.name,
    category: crop.type || 'crops',
    subcategory: crop.variety || 'Unknown',
    description: crop.description || 'Fresh crop from local farmer',
    price: crop.price,
    unit: crop.unit || 'kg',
    quantity: crop.quantity,
    location: crop.location || 'Unknown',
    harvestDate: crop.harvestDate || new Date().toISOString(),
    organic: crop.organic || false,
    grade: 'A', // Default grade
    rating: 4.5, // Default rating
    reviewCount: 0, // Default review count
    images: crop.images || ['/images/default-crop.jpg'],
    tags: crop.organic ? ['Organic'] : ['Fresh'],
    certifications: crop.organic ? ['Organic Certified'] : [],
    supplier: {
      id: crop.farmerId || 'unknown',
      name: crop.farmerName || 'Local Farmer',
      rating: 4.9,
      verified: true
    }
  }));

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

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading crops from database...</p>
        </div>
      </div>
    );
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

  const handleAddToCart = (productId: string) => {
    console.log('Adding to cart:', productId);
    // Implement cart functionality
  };

  const handleWishlist = (productId: string) => {
    console.log('Adding to wishlist:', productId);
    // Implement wishlist functionality
  };

  const handleShare = (productId: string) => {
    console.log('Sharing product:', productId);
    // Implement share functionality
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

  return (
    <DashboardLayout
      role="buyer"
      userName="Amit Sharma"
      userAvatar=""
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">Browse Products 🛒</h1>
        <p className="text-text-light">Discover fresh, quality products from verified farmers</p>
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
            <div className="flex items-center space-x-3">
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
                <Settings className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
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
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant={viewMode === 'list' ? 'compact' : 'default'}
                onAddToCart={handleAddToCart}
                onWishlist={handleWishlist}
                onShare={handleShare}
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
    </DashboardLayout>
  );
};

export default ProductListing;
