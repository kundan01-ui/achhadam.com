// Agro Monitoring API Service
// Provides satellite imagery, NDVI/EVI indices, and agricultural data

const AGRO_API_KEY = '02ad4e7b9a67f7a2ed81f09241007f99';
const AGRO_API_BASE = 'https://api.agromonitoring.com/agro/1.0';

// Field polygon interface
export interface FieldPolygon {
  id?: string;
  name: string;
  geo_json: {
    type: 'Feature';
    properties: {};
    geometry: {
      type: 'Polygon';
      coordinates: number[][][];
    };
  };
}

// Satellite image interface
export interface SatelliteImage {
  dt: number;
  type: string;
  dc: number;
  cl: number;
  sun: {
    azimuth: number;
    elevation: number;
  };
  image: {
    truecolor?: string;
    falsecolor?: string;
    ndvi?: string;
    evi?: string;
  };
  tile: {
    truecolor?: string;
    falsecolor?: string;
    ndvi?: string;
    evi?: string;
  };
  stats: {
    ndvi?: number;
    evi?: number;
  };
}

// Weather data interface
export interface WeatherData {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
}

// Soil data interface
export interface SoilData {
  dt: number;
  t10: number; // Temperature at 10cm depth
  moisture: number; // Moisture level
  t0: number; // Surface temperature
}

/**
 * Create a new polygon (field) for monitoring
 */
export const createPolygon = async (
  name: string,
  coordinates: number[][][]
): Promise<{ success: boolean; polygonId?: string; error?: string }> => {
  try {
    console.log('🌾 Creating polygon for field:', name);
    console.log('📍 Coordinates:', JSON.stringify(coordinates));

    const polygon: FieldPolygon = {
      name,
      geo_json: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates
        }
      }
    };

    // Try to create polygon with duplicate flag
    const response = await fetch(`${AGRO_API_BASE}/polygons?appid=${AGRO_API_KEY}&duplicated=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(polygon)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ API Response:', data);
      throw new Error(`Failed to create polygon: ${response.statusText} - ${JSON.stringify(data)}`);
    }

    console.log('✅ Polygon created:', data.id);

    return {
      success: true,
      polygonId: data.id
    };
  } catch (error) {
    console.error('❌ Error creating polygon:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get all polygons for the user
 */
export const getPolygons = async (): Promise<{
  success: boolean;
  polygons?: any[];
  error?: string;
}> => {
  try {
    const response = await fetch(`${AGRO_API_BASE}/polygons?appid=${AGRO_API_KEY}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch polygons: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Fetched polygons:', data.length);

    return {
      success: true,
      polygons: data
    };
  } catch (error) {
    console.error('❌ Error fetching polygons:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get satellite imagery for a polygon
 */
export const getSatelliteImagery = async (
  polygonId: string,
  startDate?: number,
  endDate?: number
): Promise<{
  success: boolean;
  images?: SatelliteImage[];
  error?: string;
}> => {
  try {
    console.log('🛰️ Fetching satellite imagery for polygon:', polygonId);

    let url = `${AGRO_API_BASE}/image/search?polyid=${polygonId}&appid=${AGRO_API_KEY}`;

    if (startDate) {
      url += `&start=${startDate}`;
    }
    if (endDate) {
      url += `&end=${endDate}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch imagery: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Fetched satellite images:', data.length);

    return {
      success: true,
      images: data
    };
  } catch (error) {
    console.error('❌ Error fetching satellite imagery:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get NDVI (Normalized Difference Vegetation Index) history
 */
export const getNDVIHistory = async (
  polygonId: string,
  startDate: number,
  endDate: number
): Promise<{
  success: boolean;
  ndviData?: Array<{ dt: number; mean: number; max: number; min: number; median: number }>;
  error?: string;
}> => {
  try {
    console.log('📊 Fetching NDVI history for polygon:', polygonId);

    const url = `${AGRO_API_BASE}/ndvi/history?polyid=${polygonId}&start=${startDate}&end=${endDate}&appid=${AGRO_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch NDVI history: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Fetched NDVI history points:', data.length);

    return {
      success: true,
      ndviData: data
    };
  } catch (error) {
    console.error('❌ Error fetching NDVI history:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get current weather for a polygon
 */
export const getCurrentWeather = async (
  polygonId: string
): Promise<{
  success: boolean;
  weather?: WeatherData;
  error?: string;
}> => {
  try {
    console.log('🌤️ Fetching current weather for polygon:', polygonId);

    const url = `${AGRO_API_BASE}/weather?polyid=${polygonId}&appid=${AGRO_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch weather: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Fetched current weather');

    return {
      success: true,
      weather: data
    };
  } catch (error) {
    console.error('❌ Error fetching weather:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get weather forecast for a polygon
 */
export const getWeatherForecast = async (
  polygonId: string
): Promise<{
  success: boolean;
  forecast?: WeatherData[];
  error?: string;
}> => {
  try {
    console.log('🌤️ Fetching weather forecast for polygon:', polygonId);

    const url = `${AGRO_API_BASE}/weather/forecast?polyid=${polygonId}&appid=${AGRO_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch forecast: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Fetched weather forecast');

    return {
      success: true,
      forecast: data
    };
  } catch (error) {
    console.error('❌ Error fetching forecast:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get historical weather data
 */
export const getHistoricalWeather = async (
  polygonId: string,
  startDate: number,
  endDate: number
): Promise<{
  success: boolean;
  history?: WeatherData[];
  error?: string;
}> => {
  try {
    console.log('📅 Fetching historical weather for polygon:', polygonId);

    const url = `${AGRO_API_BASE}/weather/history?polyid=${polygonId}&start=${startDate}&end=${endDate}&appid=${AGRO_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch historical weather: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Fetched historical weather points:', data.length);

    return {
      success: true,
      history: data
    };
  } catch (error) {
    console.error('❌ Error fetching historical weather:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get soil data for a polygon
 */
export const getSoilData = async (
  polygonId: string
): Promise<{
  success: boolean;
  soilData?: SoilData;
  error?: string;
}> => {
  try {
    console.log('🌱 Fetching soil data for polygon:', polygonId);

    const url = `${AGRO_API_BASE}/soil?polyid=${polygonId}&appid=${AGRO_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch soil data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Fetched soil data');

    return {
      success: true,
      soilData: data
    };
  } catch (error) {
    console.error('❌ Error fetching soil data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get UVI (UV Index) data
 */
export const getUVIData = async (
  polygonId: string
): Promise<{
  success: boolean;
  uvi?: number;
  error?: string;
}> => {
  try {
    console.log('☀️ Fetching UVI data for polygon:', polygonId);

    const url = `${AGRO_API_BASE}/uvi?polyid=${polygonId}&appid=${AGRO_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch UVI: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Fetched UVI data');

    return {
      success: true,
      uvi: data.uvi
    };
  } catch (error) {
    console.error('❌ Error fetching UVI:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Helper: Create a simple rectangular polygon from coordinates
 */
export const createRectangularPolygon = (
  centerLat: number,
  centerLon: number,
  sizeKm: number = 1
): number[][][] => {
  // Approximate degrees for 1km (varies by latitude)
  const kmToDegLat = 1 / 111.32;
  const kmToDegLon = 1 / (111.32 * Math.cos((centerLat * Math.PI) / 180));

  const halfSize = sizeKm / 2;

  const latOffset = halfSize * kmToDegLat;
  const lonOffset = halfSize * kmToDegLon;

  // Create rectangle [[[lon, lat], [lon, lat], ...]]
  return [
    [
      [centerLon - lonOffset, centerLat + latOffset], // Top-left
      [centerLon + lonOffset, centerLat + latOffset], // Top-right
      [centerLon + lonOffset, centerLat - latOffset], // Bottom-right
      [centerLon - lonOffset, centerLat - latOffset], // Bottom-left
      [centerLon - lonOffset, centerLat + latOffset]  // Close polygon
    ]
  ];
};

/**
 * Delete a polygon
 */
export const deletePolygon = async (
  polygonId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🗑️ Deleting polygon:', polygonId);

    const response = await fetch(
      `${AGRO_API_BASE}/polygons/${polygonId}?appid=${AGRO_API_KEY}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete polygon: ${response.statusText}`);
    }

    console.log('✅ Polygon deleted');

    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting polygon:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export default {
  createPolygon,
  getPolygons,
  getSatelliteImagery,
  getNDVIHistory,
  getCurrentWeather,
  getWeatherForecast,
  getHistoricalWeather,
  getSoilData,
  getUVIData,
  createRectangularPolygon,
  deletePolygon
};
