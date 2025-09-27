import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Heart, 
  ShoppingCart, 
  Star, 
  MapPin, 
  Calendar,
  Package,
  TrendingUp,
  Users,
  CheckCircle,
  X
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
    }
  ]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
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
    <div className="space-y-6">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm sm:text-base text-gray-600">Discover and order agricultural products</p>
        </div>
        <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
          <Plus className="h-4 w-4" />
          <span>Request Product</span>
        </button>
      </div>

      {/* Search and Filters - Mobile Responsive */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            {/* Product Image */}
            <div className="relative h-40 sm:h-48 bg-gradient-to-br from-green-100 to-blue-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`p-2 rounded-full transition-colors ${
                    product.isFavorite 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-white text-gray-400 hover:text-red-600'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${product.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
              {!product.isAvailable && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Product Info - Mobile Responsive */}
            <div className="p-3 sm:p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{product.name}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                  <span className="text-xs sm:text-sm text-gray-600">{product.rating}</span>
                  <span className="text-xs sm:text-sm text-gray-400">({product.reviews})</span>
                </div>
              </div>

              <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">{product.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{product.supplier}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{product.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Delivery: {product.deliveryTime}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-gray-500">/{product.unit}</span>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>Min: {product.minOrder} {product.unit}</div>
                  <div>Max: {product.maxOrder} {product.unit}</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button 
                  onClick={() => addToCart(product.id)}
                  disabled={!product.isAvailable}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;









