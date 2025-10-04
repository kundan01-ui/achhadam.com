import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  Filter, 
  Eye, 
  ShoppingCart, 
  Star, 
  MapPin, 
  Phone,
  Mail,
  Users,
  Package,
  Calendar,
  Trash2,
  Share2,
  MessageCircle,
  CheckCircle,
  Award
} from 'lucide-react';

interface FavoriteItem {
  id: string;
  type: 'supplier' | 'product';
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  price?: number;
  unit?: string;
  description: string;
  image: string;
  isVerified: boolean;
  lastOrder?: string;
  totalOrders?: number;
  isAvailable?: boolean;
  minOrder?: number;
  deliveryTime?: string;
}

const FavoritesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [favorites] = useState<FavoriteItem[]>([
    {
      id: '1',
      type: 'supplier',
      name: 'Golden Grains Ltd.',
      category: 'Grains',
      location: 'Uttar Pradesh, India',
      rating: 4.9,
      reviews: 156,
      description: 'Leading supplier of premium quality grains with 20+ years of experience',
      image: '/api/placeholder/300/200',
      isVerified: true,
      lastOrder: '2024-01-15',
      totalOrders: 45
    },
    {
      id: '2',
      type: 'product',
      name: 'Premium Basmati Rice',
      category: 'Rice',
      location: 'Uttar Pradesh, India',
      rating: 4.8,
      reviews: 124,
      price: 120,
      unit: 'kg',
      description: 'High quality basmati rice with excellent aroma and taste',
      image: '/api/placeholder/300/200',
      isVerified: true,
      isAvailable: true,
      minOrder: 50,
      deliveryTime: '3-5 days'
    },
    {
      id: '3',
      type: 'supplier',
      name: 'Green Valley Farms',
      category: 'Organic',
      location: 'Punjab, India',
      rating: 4.8,
      reviews: 89,
      description: 'Certified organic farm producing high-quality organic products',
      image: '/api/placeholder/300/200',
      isVerified: true,
      lastOrder: '2024-01-14',
      totalOrders: 38
    },
    {
      id: '4',
      type: 'product',
      name: 'Organic Wheat',
      category: 'Wheat',
      location: 'Punjab, India',
      rating: 4.9,
      reviews: 89,
      price: 45,
      unit: 'kg',
      description: 'Certified organic wheat grown without pesticides',
      image: '/api/placeholder/300/200',
      isVerified: true,
      isAvailable: true,
      minOrder: 100,
      deliveryTime: '2-4 days'
    },
    {
      id: '5',
      type: 'supplier',
      name: 'Fresh Harvest Co.',
      category: 'Vegetables',
      location: 'Haryana, India',
      rating: 4.6,
      reviews: 67,
      description: 'Fresh vegetable supplier with direct farm-to-table approach',
      image: '/api/placeholder/300/200',
      isVerified: true,
      lastOrder: '2024-01-13',
      totalOrders: 28
    }
  ]);

  const filteredFavorites = favorites.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const removeFavorite = (itemId: string) => {
    // Handle remove favorite
    console.log('Remove favorite:', itemId);
  };

  const addToCart = (itemId: string) => {
    // Handle add to cart
    console.log('Add to cart:', itemId);
  };

  const contactSupplier = (itemId: string) => {
    // Handle contact supplier
    console.log('Contact supplier:', itemId);
  };

  const viewProfile = (itemId: string) => {
    // Handle view profile
    console.log('View profile:', itemId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Favorites</h2>
          <p className="text-gray-600">Your saved suppliers and products</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            {filteredFavorites.length} {filteredFavorites.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Items</option>
            <option value="supplier">Suppliers</option>
            <option value="product">Products</option>
          </select>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFavorites.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            {/* Item Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white fill-current" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                      {item.isVerified && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{item.rating}</span>
                      <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFavorite(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-4">{item.description}</p>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{typeof item.location === 'string'
                    ? item.location
                    : item.location?.city
                      ? `${item.location.city}, ${item.location.state}`
                      : item.location?.farmAddress || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Package className="h-4 w-4" />
                  <span>{item.category}</span>
                </div>
              </div>
            </div>

            {/* Item Specific Info */}
            {item.type === 'supplier' ? (
              <div className="p-6 border-b border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{item.totalOrders}</div>
                    <div className="text-sm text-gray-500">Total Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {item.lastOrder ? new Date(item.lastOrder).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">Last Order</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      {item.price ? formatCurrency(item.price) : 'N/A'}
                    </span>
                    {item.unit && <span className="text-gray-500">/{item.unit}</span>}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isAvailable ? 'Available' : 'Out of Stock'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Min Order:</span>
                    <span className="font-medium ml-1">{item.minOrder} {item.unit}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Delivery:</span>
                    <span className="font-medium ml-1">{item.deliveryTime}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="p-6">
              <div className="flex space-x-2">
                <button 
                  onClick={() => item.type === 'supplier' ? viewProfile(item.id) : addToCart(item.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>{item.type === 'supplier' ? 'View Profile' : 'View Details'}</span>
                </button>
                {item.type === 'supplier' ? (
                  <button 
                    onClick={() => contactSupplier(item.id)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Contact</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => addToCart(item.id)}
                    disabled={!item.isAvailable}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredFavorites.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start adding suppliers and products to your favorites'
            }
          </p>
          {!searchQuery && selectedType === 'all' && (
            <div className="flex justify-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Browse Suppliers
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Browse Products
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Stats */}
      {filteredFavorites.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {filteredFavorites.filter(item => item.type === 'supplier').length}
              </div>
              <div className="text-sm text-gray-500">Favorite Suppliers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {filteredFavorites.filter(item => item.type === 'product').length}
              </div>
              <div className="text-sm text-gray-500">Favorite Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {filteredFavorites.filter(item => item.isVerified).length}
              </div>
              <div className="text-sm text-gray-500">Verified Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {filteredFavorites.filter(item => item.type === 'product' && item.isAvailable).length}
              </div>
              <div className="text-sm text-gray-500">Available Products</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;









