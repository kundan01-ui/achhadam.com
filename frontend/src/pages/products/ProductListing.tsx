import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  MapPin,
  Star,
  Package,
  Leaf,
  CheckCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui';
import type { SelectOption } from '../../components/ui';
import ProductCard, { Product } from '../../components/ui/ProductCard';
import DashboardLayout from '../../components/layout/DashboardLayout';

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

  // Mock data - in real app this would come from API
  const products: Product[] = [
    {
      id: '1',
      name: 'Organic Durum Wheat',
      category: 'grains',
      subcategory: 'Wheat',
      description: 'Premium quality organic durum wheat, perfect for making pasta and bread. Grown without pesticides.',
      price: 45.00,
      unit: 'kg',
      quantity: 500,
      location: 'Punjab',
      harvestDate: '2024-01-10',
      organic: true,
      grade: 'A',
      rating: 4.8,
      reviewCount: 124,
      images: ['/images/wheat1.jpg', '/images/wheat2.jpg'],
      tags: ['Organic', 'Premium', 'Durum'],
      certifications: ['Organic India', 'FSSAI'],
      supplier: {
        id: 'supplier1',
        name: 'Rajesh Kumar Farms',
        rating: 4.9,
        verified: true
      }
    },
    {
      id: '2',
      name: 'Fresh Tomatoes',
      category: 'vegetables',
      subcategory: 'Tomatoes',
      description: 'Fresh, juicy tomatoes harvested from our greenhouse. Perfect for salads and cooking.',
      price: 35.00,
      unit: 'kg',
      quantity: 200,
      location: 'Haryana',
      harvestDate: '2024-01-15',
      organic: false,
      grade: 'A',
      rating: 4.6,
      reviewCount: 89,
      images: ['/images/tomatoes1.jpg'],
      tags: ['Fresh', 'Juicy', 'Greenhouse'],
      certifications: ['FSSAI'],
      supplier: {
        id: 'supplier2',
        name: 'Green Valley Farms',
        rating: 4.7,
        verified: true
      }
    },
    {
      id: '3',
      name: 'Basmati Rice',
      category: 'grains',
      subcategory: 'Rice',
      description: 'Aromatic basmati rice with long grains. Perfect for biryani and pulao dishes.',
      price: 120.00,
      unit: 'kg',
      quantity: 300,
      location: 'UP',
      harvestDate: '2024-01-08',
      organic: true,
      grade: 'A',
      rating: 4.9,
      reviewCount: 156,
      images: ['/images/rice1.jpg', '/images/rice2.jpg'],
      tags: ['Aromatic', 'Long Grain', 'Premium'],
      certifications: ['Organic India', 'FSSAI', 'GI Tag'],
      supplier: {
        id: 'supplier3',
        name: 'Fresh Harvest Co.',
        rating: 4.8,
        verified: true
      }
    },
    {
      id: '4',
      name: 'Sweet Corn',
      category: 'vegetables',
      subcategory: 'Corn',
      description: 'Sweet and tender corn kernels. Great for salads, soups, and direct consumption.',
      price: 25.00,
      unit: 'kg',
      quantity: 150,
      location: 'Maharashtra',
      harvestDate: '2024-01-12',
      organic: false,
      grade: 'B',
      rating: 4.4,
      reviewCount: 67,
      images: ['/images/corn1.jpg'],
      tags: ['Sweet', 'Tender', 'Fresh'],
      certifications: ['FSSAI'],
      supplier: {
        id: 'supplier4',
        name: 'Organic Paradise',
        rating: 4.5,
        verified: false
      }
    },
    {
      id: '5',
      name: 'Green Peas',
      category: 'vegetables',
      subcategory: 'Peas',
      description: 'Fresh green peas, rich in protein and fiber. Perfect for curries and salads.',
      price: 40.00,
      unit: 'kg',
      quantity: 100,
      location: 'Karnataka',
      harvestDate: '2024-01-14',
      organic: true,
      grade: 'A',
      rating: 4.7,
      reviewCount: 93,
      images: ['/images/peas1.jpg'],
      tags: ['Fresh', 'Protein Rich', 'Fiber'],
      certifications: ['Organic India', 'FSSAI'],
      supplier: {
        id: 'supplier5',
        name: 'Fresh Foods Co.',
        rating: 4.6,
        verified: true
      }
    },
    {
      id: '6',
      name: 'Red Lentils',
      category: 'pulses',
      subcategory: 'Lentils',
      description: 'High-quality red lentils, rich in protein and essential nutrients.',
      price: 85.00,
      unit: 'kg',
      quantity: 250,
      location: 'Rajasthan',
      harvestDate: '2024-01-05',
      organic: false,
      grade: 'B',
      rating: 4.5,
      reviewCount: 78,
      images: ['/images/lentils1.jpg'],
      tags: ['Protein Rich', 'Nutritious', 'Traditional'],
      certifications: ['FSSAI'],
      supplier: {
        id: 'supplier6',
        name: 'Traditional Farms',
        rating: 4.4,
        verified: true
      }
    }
  ];

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
                <SlidersHorizontal className="w-4 h-4 mr-2" />
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
                <Grid3X3 className="w-4 h-4" />
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
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      size="sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
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
                      { value: 0, label: 'Any Rating' },
                      { value: 4, label: '4+ Stars' },
                      { value: 4.5, label: '4.5+ Stars' }
                    ]}
                    value={minRating}
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
