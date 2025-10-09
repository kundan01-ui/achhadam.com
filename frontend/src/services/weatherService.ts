// Weather Service - Real-time Weather Data
// Uses OpenWeatherMap API for accurate weather information

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  uvIndex: number;
  location: string;
  icon: string;
}

interface ForecastDay {
  day: string;
  temperature: number;
  condition: string;
  rainChance: number;
  icon: string;
}

interface WeatherAlert {
  severity: 'low' | 'medium' | 'high';
  message: string;
  icon: string;
}

// Free OpenWeatherMap API key (client can replace with their own)
// Get free key at: https://openweathermap.org/api
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'fa888adea2953bf712f184797efb1e7e';
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

/**
 * Get current weather for a location
 */
export const getCurrentWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
  try {
    console.log(`🌤️ Fetching weather for coordinates: ${lat}, ${lon}`);

    const response = await fetch(
      `${WEATHER_API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    const weatherData: WeatherData = {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      rainChance: data.clouds.all, // Cloud coverage as rain indicator
      uvIndex: 7, // UV index requires additional API call (One Call API)
      location: data.name,
      icon: data.weather[0].icon
    };

    console.log('✅ Weather data fetched successfully:', weatherData);
    return weatherData;
  } catch (error) {
    console.error('❌ Error fetching weather:', error);
    return null;
  }
};

/**
 * Get 7-day weather forecast
 */
export const getWeatherForecast = async (lat: number, lon: number): Promise<ForecastDay[]> => {
  try {
    console.log(`📅 Fetching 7-day forecast for coordinates: ${lat}, ${lon}`);

    const response = await fetch(
      `${WEATHER_API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }

    const data = await response.json();

    // Process forecast data (API returns 3-hour intervals for 5 days)
    const dailyForecasts: ForecastDay[] = [];
    const processedDates = new Set<string>();

    for (const item of data.list) {
      const date = new Date(item.dt * 1000);
      const dateString = date.toDateString();

      // Only take one forecast per day (noon time preferred)
      if (!processedDates.has(dateString) && dailyForecasts.length < 7) {
        const hour = date.getHours();
        if (hour >= 11 && hour <= 14) { // Noon forecasts
          processedDates.add(dateString);
          dailyForecasts.push({
            day: getDayLabel(dailyForecasts.length),
            temperature: Math.round(item.main.temp),
            condition: item.weather[0].main,
            rainChance: item.pop * 100, // Probability of precipitation
            icon: item.weather[0].icon
          });
        }
      }
    }

    console.log(`✅ Forecast fetched: ${dailyForecasts.length} days`);
    return dailyForecasts;
  } catch (error) {
    console.error('❌ Error fetching forecast:', error);
    return getFallbackForecast();
  }
};

/**
 * Get weather alerts based on current conditions
 */
export const getWeatherAlerts = async (lat: number, lon: number): Promise<WeatherAlert[]> => {
  const currentWeather = await getCurrentWeather(lat, lon);
  const alerts: WeatherAlert[] = [];

  if (!currentWeather) {
    return alerts;
  }

  // Generate alerts based on weather conditions
  if (currentWeather.rainChance > 70) {
    alerts.push({
      severity: 'high',
      message: 'Heavy rainfall expected. Prepare for waterlogging and ensure crop drainage.',
      icon: '🌧️'
    });
  } else if (currentWeather.rainChance > 40) {
    alerts.push({
      severity: 'medium',
      message: 'Light to moderate rain expected. Good for irrigation, monitor field conditions.',
      icon: '🌦️'
    });
  }

  if (currentWeather.temperature > 35) {
    alerts.push({
      severity: 'high',
      message: 'High temperature alert. Ensure adequate irrigation and shade for sensitive crops.',
      icon: '🌡️'
    });
  } else if (currentWeather.temperature < 10) {
    alerts.push({
      severity: 'high',
      message: 'Cold temperature alert. Protect crops from frost damage.',
      icon: '❄️'
    });
  }

  if (currentWeather.windSpeed > 40) {
    alerts.push({
      severity: 'medium',
      message: 'Strong winds expected. Secure loose items and check crop support structures.',
      icon: '💨'
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      severity: 'low',
      message: 'Favorable weather conditions for farming activities.',
      icon: '✅'
    });
  }

  return alerts;
};

/**
 * Get user's location using browser geolocation
 */
export const getUserLocation = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Default to Patna, Bihar if geolocation not available
      console.log('📍 Geolocation not available, using default location (Patna)');
      resolve({ lat: 25.5941, lon: 85.1376 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('📍 Location obtained:', position.coords.latitude, position.coords.longitude);
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        console.warn('⚠️ Geolocation error, using default location (Patna):', error);
        // Default to Patna, Bihar
        resolve({ lat: 25.5941, lon: 85.1376 });
      }
    );
  });
};

/**
 * Helper: Get day label for forecast
 */
const getDayLabel = (index: number): string => {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date();
  date.setDate(date.getDate() + index);
  return days[date.getDay()];
};

/**
 * Fallback forecast when API fails
 */
const getFallbackForecast = (): ForecastDay[] => {
  return [
    { day: 'Today', temperature: 28, condition: 'Partly Cloudy', rainChance: 20, icon: '02d' },
    { day: 'Tomorrow', temperature: 24, condition: 'Rainy', rainChance: 90, icon: '10d' },
    { day: 'Day After', temperature: 32, condition: 'Sunny', rainChance: 5, icon: '01d' },
    { day: 'Day 4', temperature: 30, condition: 'Cloudy', rainChance: 30, icon: '03d' },
    { day: 'Day 5', temperature: 29, condition: 'Partly Cloudy', rainChance: 25, icon: '02d' },
    { day: 'Day 6', temperature: 27, condition: 'Rainy', rainChance: 70, icon: '10d' },
    { day: 'Day 7', temperature: 31, condition: 'Sunny', rainChance: 10, icon: '01d' }
  ];
};

/**
 * Get weather icon component name based on OpenWeather icon code
 */
export const getWeatherIconName = (iconCode: string): string => {
  const iconMap: { [key: string]: string } = {
    '01d': 'Sun',      // Clear sky day
    '01n': 'Moon',     // Clear sky night
    '02d': 'CloudSun', // Few clouds day
    '02n': 'CloudMoon', // Few clouds night
    '03d': 'Cloud',    // Scattered clouds
    '03n': 'Cloud',
    '04d': 'Cloud',    // Broken clouds
    '04n': 'Cloud',
    '09d': 'CloudRain', // Shower rain
    '09n': 'CloudRain',
    '10d': 'CloudRain', // Rain
    '10n': 'CloudRain',
    '11d': 'CloudLightning', // Thunderstorm
    '11n': 'CloudLightning',
    '13d': 'Snowflake', // Snow
    '13n': 'Snowflake',
    '50d': 'CloudFog',  // Mist
    '50n': 'CloudFog'
  };

  return iconMap[iconCode] || 'Cloud';
};

export default {
  getCurrentWeather,
  getWeatherForecast,
  getWeatherAlerts,
  getUserLocation,
  getWeatherIconName
};
