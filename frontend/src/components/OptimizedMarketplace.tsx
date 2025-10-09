// Optimized Marketplace Component with Advanced Performance Features
// This component uses all optimization techniques for lightning-fast data display

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import VirtualScrollList from './VirtualScrollList';
import { cacheService, getMarketplaceData } from '../services/cacheService';
import { preloadService, preloadMarketplaceData } from '../services/preloadService';
import { realtimeService, startMarketplaceSync } from '../services/realtimeService';

interface MarketplaceCrop {
  id: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
  location: string;
  farmer: {
    name: string;
    rating: number;
  };
  images: string[];
}

interface OptimizedMarketplaceProps {
  onCropSelect?: (crop: MarketplaceCrop) => void;
}

const OptimizedMarketplace: React.FC<OptimizedMarketplaceProps> = ({ onCropSelect }) => {
  const [crops, setCrops] = useState<MarketplaceCrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'rating'>('price');
  const [filterBy, setFilterBy] = useState<string>('all');

  // Memoized filtered and sorted crops
  const optimizedCrops = useMemo(() => {
    let filtered = crops;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(crop => 
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(crop => crop.type === filterBy);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.farmer.rating - a.farmer.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [crops, searchTerm, sortBy, filterBy]);

  // Load marketplace data with optimizations
  const loadMarketplaceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🚀 LOADING MARKETPLACE: Using advanced optimizations');
      
      // Try cache first (lightning fast)
      const cachedData = cacheService.get('marketplace_data');
      if (cachedData) {
        console.log('⚡ LIGHTNING FAST: Data from cache');
        setCrops(cachedData.data || []);
        setLoading(false);
        return;
      }

      // Try preloaded data
      const preloadedData = localStorage.getItem('preloaded_marketplace');
      if (preloadedData) {
        console.log('🎯 INSTANT: Data from preload');
        const data = JSON.parse(preloadedData);
        setCrops(data.data || []);
        setLoading(false);
        return;
      }

      // Fetch from API
      console.log('🌐 NETWORK: Fetching from API');
      const data = await getMarketplaceData();
      setCrops(data.data || []);
      
    } catch (error) {
      console.error('❌ MARKETPLACE LOAD ERROR:', error);
      setError('Failed to load marketplace data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize optimizations
  useEffect(() => {
    // Start preloading
    preloadMarketplaceData();
    
    // Start real-time sync
    startMarketplaceSync((data) => {
      console.log('🔄 REALTIME UPDATE: Marketplace data refreshed');
      setCrops(data.data || []);
    });

    // Load initial data
    loadMarketplaceData();

    // Cleanup
    return () => {
      realtimeService.removeSyncTask('marketplace_realtime');
    };
  }, [loadMarketplaceData]);

  // Render crop item
  const renderCropItem = useCallback((crop: MarketplaceCrop, index: number) => (
    <div 
      key={crop.id}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onCropSelect?.(crop)}
    >
      <div className="flex items-center space-x-4">
        <img 
          src={crop.images[0] || '/placeholder-crop.jpg'} 
          alt={crop.name}
          className="w-16 h-16 object-cover rounded-lg"
          loading="lazy"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{crop.name}</h3>
          <p className="text-gray-600">{crop.type} • {crop.location}</p>
          <p className="text-sm text-gray-500">by {crop.farmer.name} ⭐ {crop.farmer.rating}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-green-600">₹{crop.price}</p>
          <p className="text-sm text-gray-500">{crop.quantity} units</p>
        </div>
      </div>
    </div>
  ), [onCropSelect]);

  // Get unique crop types for filter
  const cropTypes = useMemo(() => {
    const types = [...new Set(crops.map(crop => crop.type))];
    return ['all', ...types];
  }, [crops]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span className="ml-3 text-lg">Loading marketplace...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 text-lg">{error}</p>
        <button 
          onClick={loadMarketplaceData}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            {cropTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="price">Sort by Price</option>
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {optimizedCrops.length} of {crops.length} crops
      </div>

      {/* Virtual Scrolling List */}
      <VirtualScrollList
        items={optimizedCrops}
        itemHeight={100}
        containerHeight={600}
        renderItem={renderCropItem}
        overscan={10}
      />

      {/* Performance Stats */}
      <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
        <div>Cache Stats: {JSON.stringify(cacheService.getStats())}</div>
        <div>Preload Stats: {JSON.stringify(preloadService.getStats())}</div>
        <div>Realtime Stats: {JSON.stringify(realtimeService.getStats())}</div>
      </div>
    </div>
  );
};

export default OptimizedMarketplace;













