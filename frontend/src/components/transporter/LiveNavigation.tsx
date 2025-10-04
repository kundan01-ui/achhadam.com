// Live Navigation Component for Transporter Dashboard
import React, { useState, useEffect } from 'react';
import { TransporterFeatures } from '../../services/googleMapsIntegrated';
import { Navigation, MapPin, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

interface LiveNavigationProps {
  pickupLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  deliveryLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export const LiveNavigation: React.FC<LiveNavigationProps> = ({
  pickupLocation,
  deliveryLocation
}) => {
  const [loading, setLoading] = useState(true);
  const [navigation, setNavigation] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    startNavigation();
    trackLocation();

    // Update location every 30 seconds
    const interval = setInterval(trackLocation, 30000);
    return () => clearInterval(interval);
  }, [pickupLocation, deliveryLocation]);

  const startNavigation = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await TransporterFeatures.getNavigation(pickupLocation, deliveryLocation);

      if (result.success) {
        setNavigation(result);
      } else {
        setError(result.error || 'Navigation unavailable');
      }
    } catch (err) {
      setError('Failed to load navigation');
    } finally {
      setLoading(false);
    }
  };

  const trackLocation = async () => {
    const location = await TransporterFeatures.getCurrentLocation();
    if (location) {
      setCurrentLocation(location);
      // TODO: Send location to backend for buyer tracking
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || !navigation) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-600">{error || 'Navigation not available'}</div>
      </div>
    );
  }

  const steps = navigation.steps || [];
  const currentStep = steps[0];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header - Current Direction */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <Navigation className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <div className="text-sm opacity-90">Next Step</div>
            <div className="text-xl font-bold mt-1">
              {currentStep?.instruction || 'Continue on route'}
            </div>
          </div>
        </div>

        {/* Distance & Time to Next Turn */}
        <div className="flex gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 flex-1">
            <div className="text-xs opacity-80">In</div>
            <div className="text-lg font-semibold">
              {currentStep?.distance || 'N/A'}
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 flex-1">
            <div className="text-xs opacity-80">ETA</div>
            <div className="text-lg font-semibold">
              {navigation.primaryRoute?.duration || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Route Overview */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              {pickupLocation.address || 'Pickup location'}
            </span>
          </div>
          <Clock className="w-4 h-4 text-gray-400" />
        </div>
        <div className="my-2 ml-2 border-l-2 border-dashed border-gray-300 h-4"></div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-gray-700">
            {deliveryLocation.address || 'Delivery location'}
          </span>
        </div>
      </div>

      {/* Upcoming Steps */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Upcoming Directions
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {steps.slice(1, 6).map((step: any, index: number) => (
            <div
              key={index}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                {index + 2}
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-700">{step.instruction}</div>
                <div className="text-xs text-gray-500 mt-1">{step.distance}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Alert */}
      {navigation.trafficCondition !== 'NORMAL' && (
        <div className="mx-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <span className="text-sm text-yellow-700">
            Traffic detected - Alternative route available
          </span>
        </div>
      )}

      {/* Current Location Status */}
      {currentLocation && (
        <div className="px-4 pb-4 text-xs text-gray-500 text-center">
          📍 Location tracking active • Last updated: {new Date().toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default LiveNavigation;
