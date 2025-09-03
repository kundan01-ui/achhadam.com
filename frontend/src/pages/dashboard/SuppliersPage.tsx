import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Heart, 
  MessageCircle, 
  Star, 
  MapPin, 
  Phone,
  Mail,
  Users,
  Package,
  TrendingUp,
  CheckCircle,
  Award,
  Calendar,
  Globe,
  Truck,
  Shield
} from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  products: string[];
  isVerified: boolean;
  isFavorite: boolean;
  totalOrders: number;
  responseTime: string;
  deliveryTime: string;
  minOrder: number;
  description: string;
  image: string;
  phone: string;
  email: string;
  website: string;
  establishedYear: number;
  certifications: string[];
}

const SuppliersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'all', 'grains', 'vegetables', 'fruits', 'spices', 'pulses', 'dairy', 'organic'
  ];

  const [suppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Golden Grains Ltd.',
      category: 'grains',
      location: 'Uttar Pradesh, India',
      rating: 4.9,
      reviews: 156,
      products: ['Basmati Rice', 'Wheat', 'Corn'],
      isVerified: true,
      isFavorite: true,
      totalOrders: 1240,
      responseTime: '< 2 hours',
      deliveryTime: '3-5 days',
      minOrder: 100,
      description: 'Leading supplier of premium quality grains with 20+ years of experience',
      image: '/api/placeholder/300/200',
      phone: '+91 9876543210',
      email: 'contact@goldengrains.com',
      website: 'www.goldengrains.com',
      establishedYear: 2003,
      certifications: ['ISO 9001', 'Organic Certified', 'FSSAI Approved']
    },
    {
      id: '2',
      name: 'Green Valley Farms',
      category: 'organic',
      location: 'Punjab, India',
      rating: 4.8,
      reviews: 89,
      products: ['Organic Wheat', 'Organic Rice', 'Organic Vegetables'],
      isVerified: true,
      isFavorite: false,
      totalOrders: 567,
      responseTime: '< 4 hours',
      deliveryTime: '2-4 days',
      minOrder: 50,
      description: 'Certified organic farm producing high-quality organic products',
      image: '/api/placeholder/300/200',
      phone: '+91 9876543211',
      email: 'info@greenvalleyfarms.com',
      website: 'www.greenvalleyfarms.com',
      establishedYear: 2010,
      certifications: ['Organic Certified', 'NPOP Certified', 'FSSAI Approved']
    },
    {
      id: '3',
      name: 'Fresh Harvest Co.',
      category: 'vegetables',
      location: 'Haryana, India',
      rating: 4.6,
      reviews: 67,
      products: ['Tomatoes', 'Onions', 'Potatoes', 'Carrots'],
      isVerified: true,
      isFavorite: false,
      totalOrders: 234,
      responseTime: '< 1 hour',
      deliveryTime: '1-2 days',
      minOrder: 25,
      description: 'Fresh vegetable supplier with direct farm-to-table approach',
      image: '/api/placeholder/300/200',
      phone: '+91 9876543212',
      email: 'sales@freshharvest.com',
      website: 'www.freshharvest.com',
      establishedYear: 2015,
      certifications: ['FSSAI Approved', 'GAP Certified']
    }
  ]);

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.products.some(product => product.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || supplier.category === selectedCategory;
    const matchesVerification = !showVerifiedOnly || supplier.isVerified;
    
    return matchesSearch && matchesCategory && matchesVerification;
  });

  const toggleFavorite = (supplierId: string) => {
    // Handle favorite toggle
    console.log('Toggle favorite:', supplierId);
  };

  const contactSupplier = (supplierId: string) => {
    // Handle contact supplier
    console.log('Contact supplier:', supplierId);
  };

  const viewProfile = (supplierId: string) => {
    // Handle view profile
    console.log('View profile:', supplierId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Suppliers</h2>
          <p className="text-gray-600">Connect with verified agricultural suppliers</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Users className="h-4 w-4" />
          <span>Become a Supplier</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
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
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verifiedOnly"
                  checked={showVerifiedOnly}
                  onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="verifiedOnly" className="text-sm font-medium text-gray-700">
                  Verified Only
                </label>
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

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            {/* Supplier Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {supplier.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{supplier.name}</h3>
                      {supplier.isVerified && (
                        <Shield className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{supplier.rating}</span>
                      <span className="text-sm text-gray-500">({supplier.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(supplier.id)}
                  className={`p-2 rounded-full transition-colors ${
                    supplier.isFavorite 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-400 hover:text-red-600'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${supplier.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-4">{supplier.description}</p>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{supplier.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Est. {supplier.establishedYear}</span>
                </div>
              </div>
            </div>

            {/* Supplier Stats */}
            <div className="p-6 border-b border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{supplier.totalOrders}</div>
                  <div className="text-sm text-gray-500">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{supplier.responseTime}</div>
                  <div className="text-sm text-gray-500">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{supplier.deliveryTime}</div>
                  <div className="text-sm text-gray-500">Delivery Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{supplier.minOrder}</div>
                  <div className="text-sm text-gray-500">Min Order (kg)</div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="p-6 border-b border-gray-100">
              <h4 className="font-medium text-gray-900 mb-3">Products</h4>
              <div className="flex flex-wrap gap-2">
                {supplier.products.map((product, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {product}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="p-6 border-b border-gray-100">
              <h4 className="font-medium text-gray-900 mb-3">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {supplier.certifications.map((cert, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>{cert}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="p-6">
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Globe className="h-4 w-4 mr-2" />
                  <span>{supplier.website}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => viewProfile(supplier.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Profile</span>
                </button>
                <button 
                  onClick={() => contactSupplier(supplier.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Contact</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No suppliers found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default SuppliersPage;


