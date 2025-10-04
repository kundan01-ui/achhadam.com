// Delivery Calculator for Buyer Dashboard
import React, { useState, useEffect } from 'react';
import { BuyerFeatures } from '../../services/googleMapsIntegrated';
import { MapPin, Clock, DollarSign, Truck, RefreshCw } from 'lucide-react';

interface DeliveryCalculatorProps {
  farmLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  buyerLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  onCalculated?: (details: any) => void;
}

export const DeliveryCalculator: React.FC<DeliveryCalculatorProps> = ({
  farmLocation,
  buyerLocation,
  onCalculated
}) => {
  const [loading, setLoading] = useState(false);
  const [delivery, setDelivery] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (buyerLocation) {
      calculateDelivery();
    }
  }, [farmLocation, buyerLocation]);

  const calculateDelivery = async () => {
    if (!buyerLocation) {
      setError('Please set your delivery location');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await BuyerFeatures.calculateDelivery(farmLocation, buyerLocation);

      if (result.success) {
        setDelivery(result);
        onCalculated?.(result);
      } else {
        setError(result.error || 'Unable to calculate delivery');
      }
    } catch (err) {
      setError('Failed to calculate delivery details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
          <span className="ml-2 text-gray-600">Calculating delivery...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="text-center text-sm text-red-600">{error}</div>
        {buyerLocation && (
          <button
            onClick={calculateDelivery}
            className="mt-3 w-full text-sm text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (!delivery && !buyerLocation) {
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="text-center text-sm text-gray-500">
          Set your delivery location to see delivery details
        </div>
      </div>
    );
  }

  if (!delivery) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Delivery Details
        </h3>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Distance & Time Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-600">Distance</span>
            </div>
            <div className="text-lg font-bold text-gray-800">
              {delivery.distance}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600">Duration</span>
            </div>
            <div className="text-lg font-bold text-gray-800">
              {delivery.duration}
            </div>
          </div>
        </div>

        {/* Estimated Cost */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Estimated Delivery Cost
              </span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              ₹{delivery.estimatedCost}
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Based on ₹10/km standard rate
          </div>
        </div>

        {/* Route Info */}
        <div className="border-t pt-3">
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-700 mb-1">Route:</div>
              <div>{farmLocation.address || 'Farm location'}</div>
              <div className="text-gray-400 my-1">↓</div>
              <div>{buyerLocation?.address || 'Your location'}</div>
            </div>
          </div>
        </div>

        {/* Recalculate Button */}
        <button
          onClick={calculateDelivery}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Recalculate
        </button>
      </div>
    </div>
  );
};

export default DeliveryCalculator;
