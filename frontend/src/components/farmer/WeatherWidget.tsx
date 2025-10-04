// Weather Widget for Farmer Dashboard
import React, { useState, useEffect } from 'react';
import { FarmerFeatures } from '../../services/googleMapsIntegrated';
import { Cloud, Droplets, Wind, Thermometer, Sun } from 'lucide-react';

interface WeatherWidgetProps {
  location: {
    latitude: number;
    longitude: number;
  };
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ location }) => {
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetchWeather();
    // Refresh every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location]);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const result = await FarmerFeatures.getWeather(location);

      if (result.success) {
        setWeather(result);
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Weather data unavailable</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Cloud className="w-5 h-5" />
          Weather Forecast
        </h3>
        <button
          onClick={fetchWeather}
          className="text-sm text-blue-100 hover:text-white"
        >
          Refresh
        </button>
      </div>

      {/* Main Temperature */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-5xl font-bold">{Math.round(weather.temperature)}°C</div>
          <div className="text-sm opacity-90 mt-1 capitalize">
            {weather.description}
          </div>
        </div>
        <div>
          <Sun className="w-16 h-16 opacity-80" />
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white bg-opacity-20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-4 h-4" />
            <span className="text-xs opacity-80">Humidity</span>
          </div>
          <div className="text-xl font-semibold">{weather.humidity}%</div>
        </div>

        <div className="bg-white bg-opacity-20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-4 h-4" />
            <span className="text-xs opacity-80">Wind Speed</span>
          </div>
          <div className="text-xl font-semibold">{weather.windSpeed} m/s</div>
        </div>
      </div>

      {/* Crop Suitability */}
      <div className="bg-white bg-opacity-20 rounded-lg p-4">
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Thermometer className="w-4 h-4" />
          Crop Suitability
        </h4>
        <p className="text-sm opacity-90">{weather.cropSuitability}</p>
      </div>

      {/* Farming Tips */}
      <div className="mt-4 pt-4 border-t border-white border-opacity-20">
        <div className="text-xs opacity-80">
          {weather.temperature > 30 ? (
            <span>🌡️ High temperature - Ensure adequate irrigation</span>
          ) : weather.temperature < 15 ? (
            <span>❄️ Low temperature - Protect sensitive crops</span>
          ) : (
            <span>✅ Ideal temperature for most crops</span>
          )}
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-3 text-xs opacity-60 text-center">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default WeatherWidget;
