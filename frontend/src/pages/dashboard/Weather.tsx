import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Cloud, Sun, Droplets, Wind, Thermometer, Calendar, AlertTriangle } from 'lucide-react';

const Weather: React.FC = () => {
  const currentWeather = {
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    windDirection: 'NE',
    pressure: 1013,
    visibility: 10,
    uvIndex: 6
  };

  const hourlyForecast = [
    { time: 'Now', temp: 28, condition: 'Partly Cloudy', icon: '⛅' },
    { time: '1 PM', temp: 30, condition: 'Sunny', icon: '☀️' },
    { time: '2 PM', temp: 31, condition: 'Sunny', icon: '☀️' },
    { time: '3 PM', temp: 32, condition: 'Sunny', icon: '☀️' },
    { time: '4 PM', temp: 31, condition: 'Partly Cloudy', icon: '⛅' },
    { time: '5 PM', temp: 29, condition: 'Cloudy', icon: '☁️' },
    { time: '6 PM', temp: 27, condition: 'Light Rain', icon: '🌧️' }
  ];

  const dailyForecast = [
    { day: 'Today', high: 32, low: 24, condition: 'Partly Cloudy', icon: '⛅' },
    { day: 'Tomorrow', high: 30, low: 23, condition: 'Light Rain', icon: '🌧️' },
    { day: 'Wed', high: 29, low: 22, condition: 'Rain', icon: '🌧️' },
    { day: 'Thu', high: 31, low: 24, condition: 'Partly Cloudy', icon: '⛅' },
    { day: 'Fri', high: 33, low: 25, condition: 'Sunny', icon: '☀️' }
  ];

  const weatherAlerts = [
    {
      type: 'Rain Alert',
      message: 'Light to moderate rain expected in next 24 hours. Protect harvested crops.',
      severity: 'medium',
      icon: '🌧️'
    },
    {
      type: 'Temperature Warning',
      message: 'High temperature expected tomorrow. Ensure proper irrigation.',
      severity: 'high',
      icon: '🌡️'
    },
    {
      type: 'Wind Advisory',
      message: 'Strong winds expected. Secure loose items and protect young plants.',
      severity: 'low',
      icon: '💨'
    }
  ];

  const farmingRecommendations = [
    {
      crop: 'Wheat',
      recommendation: 'Ideal conditions for growth. Continue regular irrigation.',
      icon: '🌾'
    },
    {
      crop: 'Rice',
      recommendation: 'Monitor water levels. Rain expected will help.',
      icon: '🌾'
    },
    {
      crop: 'Vegetables',
      recommendation: 'Protect from strong winds. Consider temporary covers.',
      icon: '🥬'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Weather & Farming</h1>
          <p className="text-gray-600">Real-time weather updates and farming recommendations</p>
        </div>

        {/* Current Weather Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{currentWeather.condition}</h2>
                    <p className="text-gray-500">Current Weather</p>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-bold text-blue-600">{currentWeather.temperature}°C</div>
                    <p className="text-gray-500">Feels like {currentWeather.temperature + 2}°C</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Droplets className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-500">Humidity</p>
                    <p className="font-semibold">{currentWeather.humidity}%</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Wind className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-500">Wind</p>
                    <p className="font-semibold">{currentWeather.windSpeed} km/h</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Thermometer className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-500">Pressure</p>
                    <p className="font-semibold">{currentWeather.pressure} hPa</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Sun className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-sm text-gray-500">UV Index</p>
                    <p className="font-semibold">{currentWeather.uvIndex}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hourly Forecast */}
          <div>
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Hourly Forecast</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hourlyForecast.map((hour, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{hour.icon}</span>
                        <div>
                          <p className="font-medium text-gray-800">{hour.time}</p>
                          <p className="text-sm text-gray-500">{hour.condition}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-800">{hour.temp}°C</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Daily Forecast & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Daily Forecast */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span>5-Day Forecast</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {dailyForecast.map((day, index) => (
                    <div key={index} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <p className="font-semibold text-gray-800 mb-2">{day.day}</p>
                      <span className="text-3xl mb-2 block">{day.icon}</span>
                      <p className="text-sm text-gray-500 mb-1">{day.condition}</p>
                      <div className="flex justify-center space-x-2">
                        <span className="font-semibold text-red-600">{day.high}°</span>
                        <span className="font-semibold text-blue-600">{day.low}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weather Alerts */}
          <div>
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>Weather Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weatherAlerts.map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg border-l-4 ${
                      alert.severity === 'high' ? 'border-l-red-500 bg-red-50' : 
                      alert.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50' : 
                      'border-l-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <span className="text-xl">{alert.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm">{alert.type}</h4>
                          <p className="text-gray-600 text-xs mt-1">{alert.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Farming Recommendations */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cloud className="w-5 h-5 text-green-600" />
              <span>Farming Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {farmingRecommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{rec.icon}</span>
                    <h3 className="font-semibold text-gray-800">{rec.crop}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{rec.recommendation}</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="w-4 h-4 mr-2" />
            Get Detailed Forecast
          </Button>
          <Button variant="outline">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Set Weather Alerts
          </Button>
          <Button variant="outline">
            <Cloud className="w-4 h-4 mr-2" />
            View Historical Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Weather;























