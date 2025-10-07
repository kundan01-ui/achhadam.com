import React, { useState, useEffect } from 'react';
import {
  Satellite,
  TrendingUp,
  Cloud,
  Droplets,
  Wind,
  Sun,
  MapPin,
  Calendar,
  Activity,
  BarChart3,
  RefreshCw,
  Layers,
  Eye,
  Download,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import * as agroService from '../services/agroMonitoringService';

interface AgroDashboardProps {
  farmLocation?: { lat: number; lon: number };
  fieldName?: string;
}

const AgroDashboard: React.FC<AgroDashboardProps> = ({
  farmLocation = { lat: 28.6139, lon: 77.2090 }, // Default: Delhi
  fieldName = 'My Farm'
}) => {
  console.log('🛰️ AgroDashboard component loaded!');
  console.log('📍 Farm location:', farmLocation);
  console.log('🌾 Field name:', fieldName);

  const [loading, setLoading] = useState(false);
  const [polygonId, setPolygonId] = useState<string | null>(null);
  const [satelliteImages, setSatelliteImages] = useState<any[]>([]);
  const [ndviHistory, setNdviHistory] = useState<any[]>([]);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [weatherForecast, setWeatherForecast] = useState<any[]>([]);
  const [soilData, setSoilData] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [imageType, setImageType] = useState<'truecolor' | 'ndvi' | 'evi'>('truecolor');
  const [activeTab, setActiveTab] = useState<'satellite' | 'ndvi' | 'weather' | 'soil'>('satellite');

  // Initialize field polygon
  useEffect(() => {
    initializeField();
  }, [farmLocation]);

  const initializeField = async () => {
    setLoading(true);
    try {
      // Create a polygon for the field
      const coordinates = agroService.createRectangularPolygon(
        farmLocation.lat,
        farmLocation.lon,
        2 // 2km x 2km field
      );

      const result = await agroService.createPolygon(fieldName, coordinates);

      if (result.success && result.polygonId) {
        setPolygonId(result.polygonId);
        await loadFieldData(result.polygonId);
      }
    } catch (error) {
      console.error('Error initializing field:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFieldData = async (polyId: string) => {
    try {
      // Load satellite imagery (last 30 days)
      const endDate = Math.floor(Date.now() / 1000);
      const startDate = endDate - 30 * 24 * 60 * 60;

      const [imagesResult, ndviResult, weatherResult, forecastResult, soilResult] = await Promise.all([
        agroService.getSatelliteImagery(polyId, startDate, endDate),
        agroService.getNDVIHistory(polyId, startDate, endDate),
        agroService.getCurrentWeather(polyId),
        agroService.getWeatherForecast(polyId),
        agroService.getSoilData(polyId)
      ]);

      if (imagesResult.success && imagesResult.images) {
        setSatelliteImages(imagesResult.images);
        if (imagesResult.images.length > 0) {
          setSelectedImage(imagesResult.images[0]);
        }
      }

      if (ndviResult.success && ndviResult.ndviData) {
        setNdviHistory(ndviResult.ndviData);
      }

      if (weatherResult.success && weatherResult.weather) {
        setCurrentWeather(weatherResult.weather);
      }

      if (forecastResult.success && forecastResult.forecast) {
        setWeatherForecast(forecastResult.forecast);
      }

      if (soilResult.success && soilResult.soilData) {
        setSoilData(soilResult.soilData);
      }
    } catch (error) {
      console.error('Error loading field data:', error);
    }
  };

  const refreshData = async () => {
    if (polygonId) {
      setLoading(true);
      await loadFieldData(polygonId);
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getNDVIColor = (ndvi: number) => {
    if (ndvi >= 0.6) return 'text-green-600';
    if (ndvi >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getNDVIStatus = (ndvi: number) => {
    if (ndvi >= 0.6) return 'Excellent';
    if (ndvi >= 0.4) return 'Good';
    if (ndvi >= 0.2) return 'Moderate';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🛰️ Agro Satellite Dashboard</h1>
            <p className="text-green-100">Real-time satellite imagery and agricultural insights</p>
          </div>
          <button
            onClick={refreshData}
            disabled={loading}
            className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Satellite Images</p>
              <p className="text-2xl font-bold text-gray-900">{satelliteImages.length}</p>
            </div>
            <Satellite className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Latest NDVI</p>
              <p className={`text-2xl font-bold ${selectedImage?.stats?.ndvi ? getNDVIColor(selectedImage.stats.ndvi) : 'text-gray-900'}`}>
                {selectedImage?.stats?.ndvi?.toFixed(2) || 'N/A'}
              </p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Temperature</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentWeather?.temp ? `${Math.round(currentWeather.temp - 273.15)}°C` : 'N/A'}
              </p>
            </div>
            <Sun className="h-10 w-10 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Soil Moisture</p>
              <p className="text-2xl font-bold text-gray-900">
                {soilData?.moisture ? `${Math.round(soilData.moisture * 100)}%` : 'N/A'}
              </p>
            </div>
            <Droplets className="h-10 w-10 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-1 p-2">
            <button
              onClick={() => setActiveTab('satellite')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'satellite'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Satellite className="inline h-4 w-4 mr-2" />
              Satellite Imagery
            </button>
            <button
              onClick={() => setActiveTab('ndvi')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'ndvi'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Activity className="inline h-4 w-4 mr-2" />
              NDVI Analysis
            </button>
            <button
              onClick={() => setActiveTab('weather')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'weather'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Cloud className="inline h-4 w-4 mr-2" />
              Weather Data
            </button>
            <button
              onClick={() => setActiveTab('soil')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'soil'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Layers className="inline h-4 w-4 mr-2" />
              Soil Data
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Satellite Imagery Tab */}
          {activeTab === 'satellite' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Satellite Imagery History</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setImageType('truecolor')}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      imageType === 'truecolor'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    True Color
                  </button>
                  <button
                    onClick={() => setImageType('ndvi')}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      imageType === 'ndvi'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    NDVI
                  </button>
                  <button
                    onClick={() => setImageType('evi')}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      imageType === 'evi'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    EVI
                  </button>
                </div>
              </div>

              {/* Selected Image Display */}
              {selectedImage && (
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Captured Date</p>
                      <p className="text-lg font-semibold">{formatDate(selectedImage.dt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Cloud Coverage</p>
                      <p className="text-lg font-semibold">{Math.round(selectedImage.cl * 100)}%</p>
                    </div>
                    {selectedImage.stats && (
                      <div>
                        <p className="text-sm text-gray-600">NDVI Value</p>
                        <p className={`text-lg font-semibold ${getNDVIColor(selectedImage.stats.ndvi)}`}>
                          {selectedImage.stats.ndvi.toFixed(2)} - {getNDVIStatus(selectedImage.stats.ndvi)}
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedImage.tile && selectedImage.tile[imageType] && (
                    <img
                      src={selectedImage.tile[imageType]}
                      alt={`Satellite ${imageType}`}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  )}
                </div>
              )}

              {/* Image History Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {satelliteImages.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === image ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {image.tile && image.tile.truecolor && (
                      <img
                        src={image.tile.truecolor}
                        alt={`Satellite ${formatDate(image.dt)}`}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <div className="p-2 bg-white">
                      <p className="text-xs text-gray-600">{formatDate(image.dt)}</p>
                      <p className="text-xs font-semibold text-gray-900">
                        Cloud: {Math.round(image.cl * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {satelliteImages.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Satellite className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No satellite imagery available</p>
                </div>
              )}
            </div>
          )}

          {/* NDVI Analysis Tab */}
          {activeTab === 'ndvi' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">NDVI Trend (Last 30 Days)</h3>

                {/* NDVI Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">What is NDVI?</h4>
                      <p className="text-sm text-blue-800">
                        Normalized Difference Vegetation Index (NDVI) measures crop health:
                      </p>
                      <ul className="text-sm text-blue-800 mt-2 space-y-1 ml-4 list-disc">
                        <li><span className="text-green-600 font-semibold">0.6-1.0:</span> Excellent (Dense healthy vegetation)</li>
                        <li><span className="text-yellow-600 font-semibold">0.4-0.6:</span> Good (Moderate vegetation)</li>
                        <li><span className="text-orange-600 font-semibold">0.2-0.4:</span> Moderate (Sparse vegetation)</li>
                        <li><span className="text-red-600 font-semibold">0.0-0.2:</span> Poor (Little to no vegetation)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* NDVI Chart */}
                {ndviHistory.length > 0 ? (
                  <div className="space-y-4">
                    {ndviHistory.map((point, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">{formatDate(point.dt)}</span>
                          <span className={`text-lg font-bold ${getNDVIColor(point.mean)}`}>
                            {point.mean.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 relative">
                          <div
                            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-4 rounded-full"
                            style={{ width: `${point.mean * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Min: {point.min.toFixed(2)}</span>
                          <span>Max: {point.max.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No NDVI data available</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Weather Data Tab */}
          {activeTab === 'weather' && (
            <div className="space-y-6">
              {/* Current Weather */}
              {currentWeather && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Current Weather</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <Sun className="h-8 w-8 text-orange-500 mb-2" />
                      <p className="text-sm text-gray-600">Temperature</p>
                      <p className="text-2xl font-bold">{Math.round(currentWeather.temp - 273.15)}°C</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <Droplets className="h-8 w-8 text-blue-500 mb-2" />
                      <p className="text-sm text-gray-600">Humidity</p>
                      <p className="text-2xl font-bold">{currentWeather.humidity}%</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <Wind className="h-8 w-8 text-gray-500 mb-2" />
                      <p className="text-sm text-gray-600">Wind Speed</p>
                      <p className="text-2xl font-bold">{currentWeather.wind_speed.toFixed(1)} m/s</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <Cloud className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Cloud Cover</p>
                      <p className="text-2xl font-bold">{currentWeather.clouds}%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Weather Forecast */}
              <div>
                <h3 className="text-lg font-semibold mb-4">5-Day Forecast</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {weatherForecast.slice(0, 5).map((forecast, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-2">{formatDate(forecast.dt)}</p>
                      <div className="text-4xl mb-2">
                        {forecast.weather && forecast.weather[0]?.main === 'Rain' ? '🌧️' : '☀️'}
                      </div>
                      <p className="text-lg font-bold">{Math.round(forecast.temp - 273.15)}°C</p>
                      <p className="text-xs text-gray-500">
                        {forecast.weather && forecast.weather[0]?.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Soil Data Tab */}
          {activeTab === 'soil' && soilData && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Soil Conditions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6">
                  <h4 className="text-sm text-gray-600 mb-2">Surface Temperature</h4>
                  <p className="text-3xl font-bold text-orange-600">{Math.round(soilData.t0 - 273.15)}°C</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
                  <h4 className="text-sm text-gray-600 mb-2">Soil Moisture</h4>
                  <p className="text-3xl font-bold text-blue-600">{Math.round(soilData.moisture * 100)}%</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                  <h4 className="text-sm text-gray-600 mb-2">10cm Depth Temp</h4>
                  <p className="text-3xl font-bold text-green-600">{Math.round(soilData.t10 - 273.15)}°C</p>
                </div>
              </div>

              {/* Soil Recommendations */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2">Recommendations</h4>
                    <ul className="text-sm text-green-800 space-y-1 ml-4 list-disc">
                      {soilData.moisture < 0.3 && (
                        <li>Soil moisture is low. Consider irrigation.</li>
                      )}
                      {soilData.moisture >= 0.3 && soilData.moisture < 0.6 && (
                        <li>Soil moisture is optimal for most crops.</li>
                      )}
                      {soilData.moisture >= 0.6 && (
                        <li>Soil moisture is high. Monitor for waterlogging.</li>
                      )}
                      {(soilData.t0 - 273.15) > 35 && (
                        <li>Surface temperature is high. Consider mulching.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <RefreshCw className="h-6 w-6 text-green-600 animate-spin" />
            <span className="text-lg font-medium">Loading satellite data...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgroDashboard;
