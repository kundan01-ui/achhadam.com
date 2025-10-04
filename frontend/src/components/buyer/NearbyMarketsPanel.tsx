// Nearby Markets Panel for Buyer Dashboard
import React, { useState, useEffect } from 'react';
import { BuyerFeatures } from '../../services/googleMapsIntegrated';
import { MapPin, Star, Navigation, RefreshCw, Store } from 'lucide-react';

interface NearbyMarketsPanelProps {
  buyerLocation: {
    latitude: number;
    longitude: number;
  };
  radius?: number; // in meters
}

export const NearbyMarketsPanel: React.FC<NearbyMarketsPanelProps> = ({
  buyerLocation,
  radius = 5000
}) => {
  const [loading, setLoading] = useState(true);
  const [markets, setMarkets] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [selectedRadius, setSelectedRadius] = useState(radius);

  useEffect(() => {
    fetchNearbyMarkets();
  }, [buyerLocation, selectedRadius]);

  const fetchNearbyMarkets = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await BuyerFeatures.findMarkets(buyerLocation, selectedRadius);

      if (result.success) {
        setMarkets(result.markets || []);
      } else {
        setError(result.error || 'Unable to find markets');
      }
    } catch (err) {
      setError('Failed to load nearby markets');
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (newRadius: number) => {
    setSelectedRadius(newRadius);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Store className="w-5 h-5" />
            Nearby Markets
          </h3>
          <button
            onClick={fetchNearbyMarkets}
            className="text-white hover:text-green-100"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Radius Selector */}
        <div className="flex gap-2">
          {[2000, 5000, 10000].map((r) => (
            <button
              key={r}
              onClick={() => handleRadiusChange(r)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedRadius === r
                  ? 'bg-white text-green-600'
                  : 'bg-green-400 bg-opacity-30 text-white hover:bg-opacity-50'
              }`}
            >
              {r / 1000}km
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {error ? (
          <div className="text-center text-sm text-red-600 py-4">{error}</div>
        ) : markets.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-8">
            <Store className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p>No markets found within {selectedRadius / 1000}km</p>
            <button
              onClick={() => handleRadiusChange(selectedRadius + 5000)}
              className="mt-3 text-blue-600 hover:text-blue-800 text-sm"
            >
              Expand search radius
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {markets.map((market, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                {/* Market Name & Rating */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {market.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {market.address}
                    </p>
                  </div>
                  {market.rating && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium text-gray-700">
                        {market.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Distance */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{market.distance.toFixed(1)} km away</span>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                    <Navigation className="w-3 h-3" />
                    Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show More Button */}
        {markets.length > 0 && (
          <button className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
            Show All Markets ({markets.length})
          </button>
        )}
      </div>
    </div>
  );
};

export default NearbyMarketsPanel;
