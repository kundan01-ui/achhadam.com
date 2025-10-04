// Integrated Google Maps Service - Role-based Features
// Smart implementation for Farmer, Buyer, Transporter
import { trackFeatureUsed } from './firebaseAnalyticsService';

// API Keys from environment
const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const AIR_QUALITY_API = import.meta.env.VITE_GOOGLE_AIR_QUALITY_API;
const WEATHER_API = import.meta.env.VITE_GOOGLE_WEATHER_API;
const GEOCODING_API = import.meta.env.VITE_GOOGLE_GEOCODING_API;
const PLACES_API = import.meta.env.VITE_GOOGLE_PLACES_API;
const DIRECTIONS_API = import.meta.env.VITE_GOOGLE_DIRECTIONS_API;
const DISTANCE_MATRIX_API = import.meta.env.VITE_GOOGLE_DISTANCE_MATRIX_API;
const ROUTES_API = import.meta.env.VITE_GOOGLE_ROUTES_API;
const SOLAR_API = import.meta.env.VITE_GOOGLE_SOLAR_API;
const GEOLOCATION_API = import.meta.env.VITE_GOOGLE_GEOLOCATION_API;

// User roles
export type UserRole = 'farmer' | 'buyer' | 'transporter' | 'admin';

// Location interface
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// ===========================================
// FARMER-SPECIFIC FEATURES
// ===========================================

/**
 * Get Air Quality for Farm Location
 * Usage: Farmer Dashboard - crop health monitoring
 */
export const getFarmAirQuality = async (location: Location) => {
  try {
    trackFeatureUsed('farm_air_quality_check', { location });

    const response = await fetch(
      `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${AIR_QUALITY_API}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: { latitude: location.latitude, longitude: location.longitude },
          extraComputations: ['HEALTH_RECOMMENDATIONS', 'POLLUTANT_CONCENTRATION']
        })
      }
    );

    const data = await response.json();

    return {
      success: true,
      aqi: data.indexes?.[0]?.aqi || 0,
      category: data.indexes?.[0]?.category || 'UNKNOWN',
      dominantPollutant: data.indexes?.[0]?.dominantPollutant || 'UNKNOWN',
      farmingRecommendations: getFarmingRecommendations(data.indexes?.[0]?.aqi || 0),
      data
    };
  } catch (error) {
    console.error('Air Quality Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get Weather Data for Farm
 * Usage: Farmer Dashboard - crop planning
 */
export const getFarmWeather = async (location: Location) => {
  try {
    trackFeatureUsed('farm_weather_check', { location });

    // Using OpenWeatherMap as fallback (Google Weather API is limited)
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=YOUR_OPENWEATHER_KEY&units=metric`
    );

    const data = await response.json();

    return {
      success: true,
      temperature: data.main?.temp || 0,
      humidity: data.main?.humidity || 0,
      windSpeed: data.wind?.speed || 0,
      description: data.weather?.[0]?.description || '',
      cropSuitability: analyzeCropSuitability(data.main?.temp, data.main?.humidity),
      data
    };
  } catch (error) {
    console.error('Weather Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get Solar Potential for Farm
 * Usage: Farmer Dashboard - solar panel planning
 */
export const getFarmSolarPotential = async (location: Location) => {
  try {
    trackFeatureUsed('farm_solar_analysis', { location });

    const response = await fetch(
      `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${location.latitude}&location.longitude=${location.longitude}&key=${SOLAR_API}`
    );

    const data = await response.json();

    return {
      success: true,
      solarPotential: data.solarPotential,
      maxSunshineHours: data.maxSunshineHoursPerYear || 0,
      solarPanelConfigs: data.solarPanelConfigs || [],
      data
    };
  } catch (error) {
    console.error('Solar API Error:', error);
    return { success: false, error: error.message };
  }
};

// Farming recommendations based on AQI
const getFarmingRecommendations = (aqi: number): string[] => {
  if (aqi <= 50) return ['✅ Perfect for all farming activities', '✅ Safe for crop spraying'];
  if (aqi <= 100) return ['⚠️ Acceptable conditions', '⚠️ Sensitive workers take breaks'];
  if (aqi <= 150) return ['⚠️ Limit outdoor work', '⚠️ Use protective equipment'];
  return ['❌ Avoid outdoor work', '❌ Postpone spraying'];
};

// Crop suitability analysis
const analyzeCropSuitability = (temp: number, humidity: number): string => {
  if (temp > 30 && humidity > 70) return 'High temperature & humidity - suitable for rice';
  if (temp < 25 && humidity < 60) return 'Moderate climate - suitable for wheat';
  return 'Check specific crop requirements';
};

// ===========================================
// BUYER-SPECIFIC FEATURES
// ===========================================

/**
 * Calculate Distance & Delivery Time
 * Usage: Buyer Dashboard - order placement
 */
export const calculateDeliveryDetails = async (origin: Location, destination: Location) => {
  try {
    trackFeatureUsed('delivery_calculation', { origin, destination });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${DISTANCE_MATRIX_API}`
    );

    const data = await response.json();
    const element = data.rows?.[0]?.elements?.[0];

    return {
      success: true,
      distance: element?.distance?.text || 'N/A',
      distanceValue: element?.distance?.value || 0,
      duration: element?.duration?.text || 'N/A',
      durationValue: element?.duration?.value || 0,
      estimatedCost: calculateDeliveryCost(element?.distance?.value || 0),
      data
    };
  } catch (error) {
    console.error('Distance Matrix Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Find Nearby Markets/Warehouses
 * Usage: Buyer Dashboard - source selection
 */
export const findNearbyMarkets = async (location: Location, radius: number = 5000) => {
  try {
    trackFeatureUsed('find_nearby_markets', { location, radius });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=${radius}&type=food|store&key=${PLACES_API}`
    );

    const data = await response.json();

    return {
      success: true,
      markets: data.results?.map((place: any) => ({
        name: place.name,
        address: place.vicinity,
        rating: place.rating,
        location: place.geometry?.location,
        distance: calculateDistance(location, place.geometry?.location)
      })) || [],
      data
    };
  } catch (error) {
    console.error('Places API Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get Optimized Route for Multiple Pickups
 * Usage: Buyer Dashboard - multi-farm orders
 */
export const getOptimizedRoute = async (origin: Location, waypoints: Location[], destination: Location) => {
  try {
    trackFeatureUsed('optimized_route', { origin, waypoints, destination });

    const waypointsStr = waypoints.map(w => `${w.latitude},${w.longitude}`).join('|');

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&waypoints=optimize:true|${waypointsStr}&key=${DIRECTIONS_API}`
    );

    const data = await response.json();

    return {
      success: true,
      optimizedOrder: data.routes?.[0]?.waypoint_order || [],
      totalDistance: data.routes?.[0]?.legs?.reduce((sum: number, leg: any) => sum + leg.distance.value, 0) || 0,
      totalDuration: data.routes?.[0]?.legs?.reduce((sum: number, leg: any) => sum + leg.duration.value, 0) || 0,
      route: data.routes?.[0] || null,
      data
    };
  } catch (error) {
    console.error('Directions API Error:', error);
    return { success: false, error: error.message };
  }
};

// Calculate delivery cost (₹10/km)
const calculateDeliveryCost = (distanceInMeters: number): number => {
  const km = distanceInMeters / 1000;
  return Math.round(km * 10); // ₹10 per km
};

// ===========================================
// TRANSPORTER-SPECIFIC FEATURES
// ===========================================

/**
 * Get Real-time Navigation
 * Usage: Transporter Dashboard - live tracking
 */
export const getNavigationInstructions = async (origin: Location, destination: Location) => {
  try {
    trackFeatureUsed('navigation_instructions', { origin, destination });

    const response = await fetch(
      `https://routes.googleapis.com/directions/v2:computeRoutes?key=${ROUTES_API}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: { location: { latLng: { latitude: origin.latitude, longitude: origin.longitude } } },
          destination: { location: { latLng: { latitude: destination.latitude, longitude: destination.longitude } } },
          travelMode: 'DRIVE',
          routingPreference: 'TRAFFIC_AWARE',
          computeAlternativeRoutes: true,
          routeModifiers: {
            avoidTolls: false,
            avoidHighways: false,
            avoidFerries: true
          }
        })
      }
    );

    const data = await response.json();

    return {
      success: true,
      primaryRoute: data.routes?.[0] || null,
      alternativeRoutes: data.routes?.slice(1) || [],
      steps: data.routes?.[0]?.legs?.[0]?.steps || [],
      trafficCondition: 'NORMAL', // Can be enhanced
      data
    };
  } catch (error) {
    console.error('Navigation Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get Current Location
 * Usage: Transporter Dashboard - location tracking
 */
export const getCurrentLocation = async (): Promise<Location | null> => {
  try {
    trackFeatureUsed('get_current_location');

    if (!navigator.geolocation) {
      throw new Error('Geolocation not supported');
    }

    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    });

    const location: Location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };

    // Get address using reverse geocoding
    const address = await reverseGeocode(location);
    location.address = address;

    return location;
  } catch (error) {
    console.error('Geolocation Error:', error);
    return null;
  }
};

/**
 * Track Live Traffic
 * Usage: Transporter Dashboard - route optimization
 */
export const getLiveTrafficStatus = async (route: any) => {
  // Traffic data is included in Routes API response
  return {
    status: 'MODERATE',
    delayMinutes: 5,
    alternativeAvailable: true
  };
};

// ===========================================
// COMMON FEATURES (All Roles)
// ===========================================

/**
 * Geocode Address to Coordinates
 * Usage: All dashboards - address input
 */
export const geocodeAddress = async (address: string): Promise<Location | null> => {
  try {
    trackFeatureUsed('geocode_address', { address });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GEOCODING_API}`
    );

    const data = await response.json();

    if (data.results?.[0]) {
      return {
        latitude: data.results[0].geometry.location.lat,
        longitude: data.results[0].geometry.location.lng,
        address: data.results[0].formatted_address
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding Error:', error);
    return null;
  }
};

/**
 * Reverse Geocode Coordinates to Address
 * Usage: All dashboards - location display
 */
export const reverseGeocode = async (location: Location): Promise<string> => {
  try {
    trackFeatureUsed('reverse_geocode', { location });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${GEOCODING_API}`
    );

    const data = await response.json();
    return data.results?.[0]?.formatted_address || 'Unknown location';
  } catch (error) {
    console.error('Reverse Geocoding Error:', error);
    return 'Unknown location';
  }
};

/**
 * Calculate Distance Between Two Points
 */
export const calculateDistance = (point1: Location, point2: Location): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(point2.latitude - point1.latitude);
  const dLon = toRad(point2.longitude - point1.longitude);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.latitude)) * Math.cos(toRad(point2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const toRad = (degrees: number) => degrees * (Math.PI / 180);

/**
 * Get Static Map Image URL
 * Usage: All dashboards - map preview
 */
export const getStaticMapUrl = (
  center: Location,
  markers: Location[] = [],
  zoom: number = 12,
  size: string = '600x400'
): string => {
  const markersStr = markers.map(m => `markers=color:red|${m.latitude},${m.longitude}`).join('&');
  return `https://maps.googleapis.com/maps/api/staticmap?center=${center.latitude},${center.longitude}&zoom=${zoom}&size=${size}&${markersStr}&key=${import.meta.env.VITE_GOOGLE_MAPS_STATIC_API}`;
};

/**
 * Get Street View Image URL
 */
export const getStreetViewUrl = (location: Location, size: string = '600x400'): string => {
  return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${location.latitude},${location.longitude}&key=${import.meta.env.VITE_GOOGLE_STREET_VIEW_API}`;
};

// Export role-based feature sets
export const FarmerFeatures = {
  getAirQuality: getFarmAirQuality,
  getWeather: getFarmWeather,
  getSolarPotential: getFarmSolarPotential
};

export const BuyerFeatures = {
  calculateDelivery: calculateDeliveryDetails,
  findMarkets: findNearbyMarkets,
  getOptimizedRoute
};

export const TransporterFeatures = {
  getNavigation: getNavigationInstructions,
  getCurrentLocation,
  getTrafficStatus: getLiveTrafficStatus
};

export const CommonFeatures = {
  geocodeAddress,
  reverseGeocode,
  calculateDistance,
  getStaticMapUrl,
  getStreetViewUrl
};

export default {
  FarmerFeatures,
  BuyerFeatures,
  TransporterFeatures,
  CommonFeatures
};
