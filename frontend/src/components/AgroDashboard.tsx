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
  Info,
  ChevronDown,
  ChevronUp
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
  const [showNDVIInfo, setShowNDVIInfo] = useState(false);

  // Initialize field polygon
  useEffect(() => {
    initializeField();
  }, [farmLocation]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing satellite data (5-minute interval)...');
      refreshData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [polygonId]);

  const initializeField = async () => {
    setLoading(true);
    try {
      // STRATEGY: First try to get existing polygons, then create if needed
      console.log('📍 Step 1: Checking for existing polygons...');
      const existingPolygons = await agroService.getPolygons();

      if (existingPolygons.success && existingPolygons.polygons && existingPolygons.polygons.length > 0) {
        // Use the first existing polygon
        const firstPolygon = existingPolygons.polygons[0];
        console.log('✅ Using existing polygon:', firstPolygon.id);
        setPolygonId(firstPolygon.id);
        await loadFieldData(firstPolygon.id);
        return;
      }

      // If no polygons exist, create a new one
      console.log('📍 Step 2: Creating new polygon...');
      const coordinates = agroService.createRectangularPolygon(
        farmLocation.lat,
        farmLocation.lon,
        2 // 2km x 2km field
      );

      const result = await agroService.createPolygon(fieldName, coordinates);

      if (result.success && result.polygonId) {
        console.log('✅ Polygon created successfully:', result.polygonId);
        setPolygonId(result.polygonId);
        await loadFieldData(result.polygonId);
      } else {
        console.error('❌ Failed to create polygon:', result.error);
        // Show mock data as fallback
        console.log('⚠️ Using mock data as fallback');
      }
    } catch (error) {
      console.error('❌ Error initializing field:', error);
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
      {/* Header - Mobile Responsive */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">🛰️ Agro Satellite Dashboard</h1>
            <p className="text-xs sm:text-sm text-green-100">Real-time satellite imagery and agricultural insights</p>
            <p className="text-xs text-green-200 mt-1">Auto-refreshes every 5 minutes</p>
          </div>
          <button
            onClick={refreshData}
            disabled={loading}
            className="bg-white text-green-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-green-50 transition-colors flex items-center space-x-2 disabled:opacity-50 text-sm sm:text-base self-end sm:self-auto"
          >
            <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Quick Stats - Mobile Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Images</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{satelliteImages.length}</p>
            </div>
            <Satellite className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">NDVI</p>
              <p className={`text-lg sm:text-2xl font-bold ${selectedImage?.stats?.ndvi ? getNDVIColor(selectedImage.stats.ndvi) : 'text-gray-900'}`}>
                {selectedImage?.stats?.ndvi ? (typeof selectedImage.stats.ndvi === 'number' ? selectedImage.stats.ndvi.toFixed(2) : selectedImage.stats.ndvi) : 'N/A'}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Temp</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {currentWeather?.temp ? `${Math.round(currentWeather.temp - 273.15)}°C` : 'N/A'}
              </p>
            </div>
            <Sun className="h-8 w-8 sm:h-10 sm:w-10 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Moisture</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {soilData?.moisture ? `${Math.round(soilData.moisture * 100)}%` : 'N/A'}
              </p>
            </div>
            <Droplets className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto scrollbar-hide space-x-1 p-2">
            <button
              onClick={() => setActiveTab('satellite')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center whitespace-nowrap text-xs sm:text-sm ${
                activeTab === 'satellite'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Satellite className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Satellite</span>
            </button>
            <button
              onClick={() => setActiveTab('ndvi')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center whitespace-nowrap text-xs sm:text-sm ${
                activeTab === 'ndvi'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">NDVI</span>
            </button>
            <button
              onClick={() => setActiveTab('weather')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center whitespace-nowrap text-xs sm:text-sm ${
                activeTab === 'weather'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Cloud className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Weather</span>
            </button>
            <button
              onClick={() => setActiveTab('soil')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center whitespace-nowrap text-xs sm:text-sm ${
                activeTab === 'soil'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Layers className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Soil</span>
            </button>
          </nav>
        </div>

        <div className="p-3 sm:p-6">
          {/* Satellite Imagery Tab - Mobile Responsive */}
          {activeTab === 'satellite' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="text-base sm:text-lg font-semibold">Satellite Imagery</h3>
                <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto">
                  <button
                    onClick={() => setImageType('truecolor')}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap ${
                      imageType === 'truecolor'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    🌍 True Color
                  </button>
                  <button
                    onClick={() => setImageType('ndvi')}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap ${
                      imageType === 'ndvi'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    🌿 NDVI
                  </button>
                  <button
                    onClick={() => setImageType('evi')}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap ${
                      imageType === 'evi'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    🌱 EVI
                  </button>
                </div>
              </div>

              {/* Selected Image Display - Mobile Responsive */}
              {selectedImage ? (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 sm:p-4 shadow-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                    <div className="bg-white rounded-lg p-2 sm:p-3">
                      <p className="text-xs text-gray-600 mb-1">Captured</p>
                      <p className="text-sm sm:text-base font-semibold">{formatDate(selectedImage.dt)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 sm:p-3">
                      <p className="text-xs text-gray-600 mb-1">Cloud</p>
                      <p className="text-sm sm:text-base font-semibold">{Math.round(selectedImage.cl * 100)}%</p>
                    </div>
                    {selectedImage.stats && selectedImage.stats.ndvi && (
                      <div className="bg-white rounded-lg p-2 sm:p-3 col-span-2 sm:col-span-1">
                        <p className="text-xs text-gray-600 mb-1">NDVI Index</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm sm:text-base font-semibold ${getNDVIColor(selectedImage.stats.ndvi)}`}>
                            {typeof selectedImage.stats.ndvi === 'number' ? selectedImage.stats.ndvi.toFixed(2) : selectedImage.stats.ndvi}
                          </p>
                          <button
                            className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                              selectedImage.stats.ndvi >= 0.6 ? 'bg-green-100 text-green-700' :
                              selectedImage.stats.ndvi >= 0.4 ? 'bg-blue-100 text-blue-700' :
                              selectedImage.stats.ndvi >= 0.2 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}
                            title={`Vegetation Health: ${getNDVIStatus(selectedImage.stats.ndvi)}`}
                          >
                            {getNDVIStatus(selectedImage.stats.ndvi)}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Satellite Image Display with Enhanced Fallback */}
                  {selectedImage.image && selectedImage.image[imageType] && !selectedImage.image[imageType].includes('/stats/') ? (
                    <div className="relative rounded-lg overflow-hidden shadow-lg bg-gray-100">
                      <img
                        src={selectedImage.image[imageType]}
                        alt={`Satellite ${imageType} - ${formatDate(selectedImage.dt)}`}
                        className="w-full h-48 sm:h-64 md:h-96 object-contain bg-gray-900"
                        loading="lazy"
                        onLoad={(e) => {
                          console.log('✅ Image loaded successfully:', selectedImage.image[imageType]);
                          e.currentTarget.style.opacity = '1';
                        }}
                        onError={(e) => {
                          console.error('❌ Failed to load image:', selectedImage.image[imageType]);
                          console.error('Image details:', {
                            date: formatDate(selectedImage.dt),
                            type: imageType,
                            url: selectedImage.image[imageType],
                            allImageTypes: Object.keys(selectedImage.image || {}),
                            allTileTypes: Object.keys(selectedImage.tile || {})
                          });
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling;
                          if (fallback) fallback.classList.remove('hidden');
                        }}
                        style={{ opacity: 0, transition: 'opacity 0.3s' }}
                      />
                      {/* Fallback div (hidden by default, shown on error) */}
                      <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-200">
                        <div className="text-center text-gray-500 p-4">
                          <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-yellow-500" />
                          <p className="text-sm font-semibold">Image Unavailable</p>
                          <p className="text-xs mt-1">Date: {formatDate(selectedImage.dt)}</p>
                          <p className="text-xs">Type: {imageType.toUpperCase()}</p>
                          {selectedImage.image && Object.keys(selectedImage.image).length > 0 && (
                            <p className="text-xs mt-2 text-green-600">
                              Available: {Object.keys(selectedImage.image).join(', ').toUpperCase()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                        {imageType.toUpperCase()}
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                        {formatDate(selectedImage.dt)}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-200 rounded-lg h-48 sm:h-64 md:h-96 flex items-center justify-center">
                      <div className="text-center text-gray-500 p-4">
                        <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-semibold">No {imageType} image available</p>
                        <p className="text-xs mt-1">Try selecting a different image type</p>
                        {selectedImage && selectedImage.image && (
                          <p className="text-xs mt-2 text-green-600">
                            Available types: {Object.keys(selectedImage.image).join(', ').toUpperCase()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Satellite className="h-16 w-16 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No satellite images available</p>
                  </div>
                </div>
              )}

              {/* Image History Grid - Enhanced */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {satelliteImages.map((image, index) => {
                  // Filter out stats URLs from image URLs
                  const getValidImageUrl = (img: any) => {
                    if (!img) return null;
                    const urls = [img.truecolor, img.ndvi, img.evi].filter(url => url && !url.includes('/stats/'));
                    return urls[0];
                  };

                  const validImageUrl = getValidImageUrl(image.image);
                  const hasImage = !!validImageUrl;
                  const availableTypes = image.image ? Object.keys(image.image).filter(k => image.image[k] && !image.image[k].includes('/stats/')).length : 0;

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                        selectedImage === image
                          ? 'border-green-500 ring-2 ring-green-200 shadow-lg'
                          : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                      }`}
                    >
                      {/* Thumbnail Image with Fallback */}
                      <div className="relative h-24 sm:h-32 bg-gray-100">
                        {hasImage ? (
                          <img
                            src={validImageUrl}
                            alt={`${formatDate(image.dt)}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="flex items-center justify-center h-full bg-gray-200"><span class="text-xs text-gray-500">No preview</span></div>`;
                              }
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-200">
                            <AlertTriangle className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        {/* Image type indicator */}
                        {availableTypes > 0 && (
                          <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                            {availableTypes} type{availableTypes > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>

                      {/* Info Section */}
                      <div className="p-2 bg-white">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {formatDate(image.dt)}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-600">
                            ☁️ {Math.round(image.cl * 100)}%
                          </p>
                          {!hasImage && (
                            <span className="text-xs text-red-500">⚠️</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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

                {/* NDVI Info - Collapsible */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowNDVIInfo(!showNDVIInfo)}
                    className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 hover:bg-blue-100 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">What is NDVI?</span>
                    </div>
                    {showNDVIInfo ? (
                      <ChevronUp className="h-5 w-5 text-blue-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-blue-600" />
                    )}
                  </button>

                  {showNDVIInfo && (
                    <div className="bg-blue-50 border border-blue-200 border-t-0 rounded-b-lg p-4 animate-slideDown">
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
                  )}
                </div>

                {/* NDVI Chart */}
                {ndviHistory.length > 0 ? (
                  <div className="space-y-4">
                    {ndviHistory.map((point, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">{formatDate(point.dt)}</span>
                          <span className={`text-lg font-bold ${getNDVIColor(point.mean)}`}>
                            {typeof point.mean === 'number' ? point.mean.toFixed(2) : point.mean}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 relative">
                          <div
                            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-4 rounded-full"
                            style={{ width: `${(typeof point.mean === 'number' ? point.mean : 0) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Min: {typeof point.min === 'number' ? point.min.toFixed(2) : point.min}</span>
                          <span>Max: {typeof point.max === 'number' ? point.max.toFixed(2) : point.max}</span>
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
                      <p className="text-2xl font-bold">{typeof currentWeather.wind_speed === 'number' ? currentWeather.wind_speed.toFixed(1) : currentWeather.wind_speed} m/s</p>
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
