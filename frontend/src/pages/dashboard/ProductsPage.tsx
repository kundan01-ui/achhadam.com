import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Heart, 
  ShoppingCart, 
  Star, 
  MapPin, 
  Calendar,
  Package,
  Users,
  Grid,
  List,
  SortAsc,
  SortDesc,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  supplier: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  isAvailable: boolean;
  minOrder: number;
  maxOrder: number;
  deliveryTime: string;
  isFavorite: boolean;
}

const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const categories = [
    'all', 'wheat', 'rice', 'corn', 'vegetables', 'fruits', 'spices', 'pulses'
  ];

  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Premium Basmati Rice',
      category: 'rice',
      price: 120,
      unit: 'kg',
      supplier: 'Golden Grains Ltd.',
      location: 'Uttar Pradesh, India',
      rating: 4.8,
      reviews: 124,
      image: '/api/placeholder/300/200',
      description: 'High quality basmati rice with excellent aroma and taste',
      isAvailable: true,
      minOrder: 50,
      maxOrder: 1000,
      deliveryTime: '3-5 days',
      isFavorite: false
    },
    {
      id: '2',
      name: 'Organic Wheat',
      category: 'wheat',
      price: 45,
      unit: 'kg',
      supplier: 'Green Valley Farms',
      location: 'Punjab, India',
      rating: 4.9,
      reviews: 89,
      image: '/api/placeholder/300/200',
      description: 'Certified organic wheat grown without pesticides',
      isAvailable: true,
      minOrder: 100,
      maxOrder: 2000,
      deliveryTime: '2-4 days',
      isFavorite: true
    },
    {
      id: '3',
      name: 'Fresh Tomatoes',
      category: 'vegetables',
      price: 25,
      unit: 'kg',
      supplier: 'Fresh Harvest Co.',
      location: 'Haryana, India',
      rating: 4.6,
      reviews: 67,
      image: '/api/placeholder/300/200',
      description: 'Fresh, red tomatoes perfect for cooking',
      isAvailable: true,
      minOrder: 20,
      maxOrder: 500,
      deliveryTime: '1-2 days',
      isFavorite: false
    },
    {
      id: '4',
      name: 'Sweet Corn',
      category: 'corn',
      price: 35,
      unit: 'kg',
      supplier: 'Corn Fields Ltd.',
      location: 'Karnataka, India',
      rating: 4.7,
      reviews: 156,
      image: '/api/placeholder/300/200',
      description: 'Fresh sweet corn with natural sweetness',
      isAvailable: true,
      minOrder: 30,
      maxOrder: 800,
      deliveryTime: '2-3 days',
      isFavorite: false
    },
    {
      id: '5',
      name: 'Red Chilies',
      category: 'spices',
      price: 180,
      unit: 'kg',
      supplier: 'Spice Masters',
      location: 'Andhra Pradesh, India',
      rating: 4.5,
      reviews: 98,
      image: '/api/placeholder/300/200',
      description: 'Premium quality red chilies with perfect heat',
      isAvailable: true,
      minOrder: 10,
      maxOrder: 200,
      deliveryTime: '4-6 days',
      isFavorite: true
    },
    {
      id: '6',
      name: 'Mangoes',
      category: 'fruits',
      price: 80,
      unit: 'kg',
      supplier: 'Fruit Paradise',
      location: 'Maharashtra, India',
      rating: 4.9,
      reviews: 203,
      image: '/api/placeholder/300/200',
      description: 'Sweet and juicy mangoes, perfect for summer',
      isAvailable: true,
      minOrder: 25,
      maxOrder: 300,
      deliveryTime: '1-2 days',
      isFavorite: false
    }
  ]);

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'reviews':
          comparison = a.reviews - b.reviews;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const toggleFavorite = (productId: string) => {
    // Handle favorite toggle
    console.log('Toggle favorite:', productId);
  };

  const addToCart = (productId: string) => {
    // Handle add to cart
    console.log('Add to cart:', productId);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Discover and order agricultural products</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center px-2 py-1.5 sm:px-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline ml-1">Request Product</span>
          </button>
        </div>
      </div>

      {/* Search and Filters - Mobile Responsive */}
      <div className="bg-white rounded-xl p-2 sm:p-3 lg:p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-3">
          {/* Search Bar */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
              />
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 sm:p-2 ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                  <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 sm:p-2 ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center space-x-1 px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm"
              >
                <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Sort</span>
              </button>
              
              {showSortMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 mb-2">Sort by</div>
                    {[
                      { value: 'name', label: 'Name' },
                      { value: 'price', label: 'Price' },
                      { value: 'rating', label: 'Rating' },
                      { value: 'reviews', label: 'Reviews' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm ${
                          sortBy === option.value ? 'bg-green-100 text-green-600' : 'hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={() => {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        setShowSortMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-50 flex items-center space-x-2"
                    >
                      {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                      <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Filters Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center space-x-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                showFilters 
                  ? 'bg-green-100 text-green-600 border border-green-200' 
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-3 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatCurrency(0)}</span>
                    <span>{formatCurrency(100000)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-end gap-2">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange([0, 100000]);
                    setSearchQuery('');
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid/List - Mobile Responsive */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4" 
        : "space-y-2 sm:space-y-3"
      }>
        {filteredProducts.map((product) => (
          <div key={product.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden ${
            viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
          }`}>
            {/* Product Image */}
            <div className={`relative bg-gradient-to-br from-green-100 to-blue-100 ${
              viewMode === 'grid' 
                ? 'h-32 sm:h-40 lg:h-48' 
                : 'h-24 sm:h-20 sm:w-24 flex-shrink-0'
            }`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400" />
              </div>
              <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`p-1 sm:p-1.5 rounded-full transition-colors ${
                    product.isFavorite 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-white text-gray-400 hover:text-red-600'
                  }`}
                >
                  <Heart className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${product.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
              {!product.isAvailable && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Product Info - Mobile Responsive */}
            <div className={`p-2 sm:p-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              <div className="flex items-start justify-between mb-1 sm:mb-2">
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base line-clamp-1">{product.name}</h3>
                <div className="flex items-center space-x-1 ml-2">
                  <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviews})</span>
                </div>
              </div>

              <p className="text-gray-600 text-xs mb-2 sm:mb-3 line-clamp-2">{product.description}</p>

              <div className={`space-y-1 sm:space-y-2 mb-4 ${viewMode === 'list' ? 'grid grid-cols-1 sm:grid-cols-3 gap-2' : ''}`}>
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">{product.supplier}</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">{product.location}</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">Delivery: {product.deliveryTime}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-gray-500 text-sm">/{product.unit}</span>
                </div>
                <div className="text-right text-xs sm:text-sm text-gray-500">
                  <div>Min: {product.minOrder} {product.unit}</div>
                  <div>Max: {product.maxOrder} {product.unit}</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm">
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">View</span>
                </button>
                <button 
                  onClick={() => addToCart(product.id)}
                  disabled={!product.isAvailable}
                  className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm font-medium"
                >
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Add to Cart</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 text-sm sm:text-base mb-6">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setPriceRange([0, 100000]);
              setShowFilters(false);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;









