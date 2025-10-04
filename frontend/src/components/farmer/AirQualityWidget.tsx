// Air Quality Widget for Farmer Dashboard
import React, { useState, useEffect } from 'react';
import { FarmerFeatures } from '../../services/googleMapsIntegrated';
import { Wind, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface AirQualityWidgetProps {
  location: {
    latitude: number;
    longitude: number;
  };
}

export const AirQualityWidget: React.FC<AirQualityWidgetProps> = ({ location }) => {
  const [loading, setLoading] = useState(true);
  const [aqi, setAqi] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [dominantPollutant, setDominantPollutant] = useState<string>('');

  useEffect(() => {
    fetchAirQuality();
    // Refresh every 30 minutes
    const interval = setInterval(fetchAirQuality, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location]);

  const fetchAirQuality = async () => {
    setLoading(true);
    try {
      const result = await FarmerFeatures.getAirQuality(location);

      if (result.success) {
        setAqi(result.aqi);
        setCategory(result.category);
        setRecommendations(result.farmingRecommendations);
        setDominantPollutant(result.dominantPollutant);
      }
    } catch (error) {
      console.error('Air Quality fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return '#00E400';
    if (aqi <= 100) return '#FFFF00';
    if (aqi <= 150) return '#FF7E00';
    if (aqi <= 200) return '#FF0000';
    if (aqi <= 300) return '#8F3F97';
    return '#7E0023';
  };

  const getAQIIcon = (aqi: number) => {
    if (aqi <= 50) return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (aqi <= 100) return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
    return <XCircle className="w-6 h-6 text-red-500" />;
  };

  const getCategoryText = (category: string): string => {
    const categories: { [key: string]: string } = {
      'GOOD': 'Good',
      'MODERATE': 'Moderate',
      'UNHEALTHY_FOR_SENSITIVE_GROUPS': 'Unhealthy for Sensitive',
      'UNHEALTHY': 'Unhealthy',
      'VERY_UNHEALTHY': 'Very Unhealthy',
      'HAZARDOUS': 'Hazardous'
    };
    return categories[category] || category;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Wind className="w-5 h-5" />
          Air Quality Index
        </h3>
        <button
          onClick={fetchAirQuality}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>

      {/* AQI Circle Display */}
      <div className="flex items-center justify-center mb-6">
        <div
          className="relative w-32 h-32 rounded-full flex items-center justify-center"
          style={{ backgroundColor: getAQIColor(aqi) }}
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{aqi}</div>
            <div className="text-xs text-white opacity-90">AQI</div>
          </div>
        </div>
      </div>

      {/* Category & Pollutant */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <div className="flex items-center gap-2">
          {getAQIIcon(aqi)}
          <span className="font-medium text-gray-700">
            {getCategoryText(category)}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          Main: {dominantPollutant || 'N/A'}
        </div>
      </div>

      {/* Farming Recommendations */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Farming Recommendations:
        </h4>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li
              key={index}
              className="text-sm text-gray-600 flex items-start gap-2"
            >
              <span className="mt-1">{rec.startsWith('✅') ? '✅' : rec.startsWith('⚠️') ? '⚠️' : rec.startsWith('❌') ? '❌' : '🚨'}</span>
              <span className="flex-1">{rec.replace(/^[✅⚠️❌🚨]\s*/, '')}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Safe/Unsafe Badge */}
      <div className="mt-4 pt-4 border-t">
        {aqi <= 150 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              Safe for outdoor farming activities
            </span>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-700">
              Avoid prolonged outdoor work
            </span>
          </div>
        )}
      </div>

      {/* Last Updated */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default AirQualityWidget;
