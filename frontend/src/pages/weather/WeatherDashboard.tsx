import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Droplets, 
  Eye, 
  AlertTriangle,
  Calendar,
  Clock,
  MapPin
} from 'lucide-react';

const WeatherDashboard: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('Mumbai, Maharashtra');
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const currentWeather = {
    temperature: 28,
    feelsLike: 32,
    humidity: 75,
    windSpeed: 12,
    visibility: 8,
    pressure: 1013,
    uvIndex: 6,
    description: 'Partly Cloudy',
    icon: Cloud
  };

  const hourlyForecast = [
    { time: '06:00', temp: 24, icon: Sun, description: 'Clear' },
    { time: '09:00', temp: 26, icon: Sun, description: 'Clear' },
    { time: '12:00', temp: 30, icon: Cloud, description: 'Partly Cloudy' },
    { time: '15:00', temp: 32, icon: Cloud, description: 'Cloudy' },
    { time: '18:00', temp: 29, icon: CloudRain, description: 'Light Rain' },
    { time: '21:00', temp: 26, icon: Cloud, description: 'Cloudy' },
    { time: '00:00', temp: 24, icon: Cloud, description: 'Partly Cloudy' }
  ];

  const dailyForecast = [
    { day: 'Today', high: 32, low: 24, icon: Cloud, description: 'Partly Cloudy', rainChance: 20 },
    { day: 'Tomorrow', high: 34, low: 25, icon: Sun, description: 'Sunny', rainChance: 10 },
    { day: 'Wednesday', high: 31, low: 23, icon: CloudRain, description: 'Rain', rainChance: 80 },
    { day: 'Thursday', high: 29, low: 22, icon: Cloud, description: 'Cloudy', rainChance: 40 },
    { day: 'Friday', high: 33, low: 24, icon: Sun, description: 'Sunny', rainChance: 5 }
  ];

  const agriculturalWeather = {
    soilMoisture: 'Good',
    soilTemperature: 26,
    cropEvapotranspiration: 4.2,
    frostRisk: 'Low',
    pestRisk: 'Medium',
    irrigationRecommendation: 'Not needed today'
  };

  const weatherAlerts = [
    {
      type: 'Heavy Rain',
      severity: 'Moderate',
      description: 'Heavy rainfall expected in the next 24 hours',
      time: '2 hours ago',
      icon: AlertTriangle
    },
    {
      type: 'High Winds',
      severity: 'Low',
      description: 'Wind speeds may reach 25 km/h',
      time: '4 hours ago',
      icon: Wind
    }
  ];

  const getWeatherIcon = (icon: any) => {
    const IconComponent = icon;
    return <IconComponent className="w-8 h-8" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'text-error';
      case 'moderate': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-text-light';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-dark">Weather Dashboard</h1>
        <div className="flex items-center space-x-4">
          <MapPin className="w-5 h-5 text-primary-green" />
          <span className="font-medium">{selectedLocation}</span>
        </div>
      </div>

      {/* Current Weather */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Weather Info */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
                {getWeatherIcon(currentWeather.icon)}
                <div>
                  <h2 className="text-6xl font-bold text-text-dark">{currentWeather.temperature}°C</h2>
                  <p className="text-xl text-text-light">{currentWeather.description}</p>
                </div>
              </div>
              <p className="text-text-light">Feels like {currentWeather.feelsLike}°C</p>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Thermometer className="w-5 h-5 text-accent-orange" />
                <div>
                  <p className="text-sm text-text-light">Humidity</p>
                  <p className="font-medium">{currentWeather.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Wind className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-text-light">Wind</p>
                  <p className="font-medium">{currentWeather.windSpeed} km/h</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-text-light">Visibility</p>
                  <p className="font-medium">{currentWeather.visibility} km</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Droplets className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-text-light">Pressure</p>
                  <p className="font-medium">{currentWeather.pressure} hPa</p>
                </div>
              </div>
            </div>

            {/* UV Index */}
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600">{currentWeather.uvIndex}</span>
              </div>
              <p className="text-sm text-text-light">UV Index</p>
              <p className="text-sm font-medium text-warning">Moderate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hourly Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary-green" />
            <span>Hourly Forecast</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {hourlyForecast.map((hour, index) => (
              <div key={index} className="text-center p-4 border border-gray-100 rounded-lg hover:bg-neutral-gray transition-colors">
                <p className="text-sm font-medium text-text-dark">{hour.time}</p>
                <div className="my-2">{getWeatherIcon(hour.icon)}</div>
                <p className="text-lg font-bold text-text-dark">{hour.temp}°</p>
                <p className="text-xs text-text-light">{hour.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary-green" />
            <span>5-Day Forecast</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyForecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-neutral-gray transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-16 text-left">
                    <p className="font-medium text-text-dark">{day.day}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getWeatherIcon(day.icon)}
                    <span className="text-text-light">{day.description}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-text-light">Rain: {day.rainChance}%</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-text-dark">{day.high}°</p>
                    <p className="text-sm text-text-light">{day.low}°</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agricultural Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sun className="w-5 h-5 text-warning" />
              <span>Agricultural Weather</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-light">Soil Moisture</span>
                <span className="font-medium text-success">{agriculturalWeather.soilMoisture}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-light">Soil Temperature</span>
                <span className="font-medium">{agriculturalWeather.soilTemperature}°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-light">Crop Evapotranspiration</span>
                <span className="font-medium">{agriculturalWeather.cropEvapotranspiration} mm/day</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-light">Frost Risk</span>
                <span className="font-medium text-success">{agriculturalWeather.frostRisk}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-light">Pest Risk</span>
                <span className="font-medium text-warning">{agriculturalWeather.pestRisk}</span>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-text-light">Irrigation Recommendation:</p>
                <p className="font-medium text-primary-green">{agriculturalWeather.irrigationRecommendation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span>Weather Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weatherAlerts.map((alert, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <alert.icon className={`w-5 h-5 mt-0.5 ${getSeverityColor(alert.severity)}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-text-dark">{alert.type}</h4>
                        <span className={`text-sm font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-text-light mb-2">{alert.description}</p>
                      <p className="text-xs text-text-light">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeatherDashboard;


