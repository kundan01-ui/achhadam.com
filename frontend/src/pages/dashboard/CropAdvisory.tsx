import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Leaf, Sun, Droplets, Thermometer, Calendar, TrendingUp } from 'lucide-react';

const CropAdvisory: React.FC = () => {
  const cropRecommendations = [
    {
      crop: 'Wheat',
      status: 'Optimal',
      recommendation: 'Perfect time for sowing. Soil moisture is ideal.',
      icon: '🌾',
      color: 'text-green-600'
    },
    {
      crop: 'Rice',
      status: 'Monitor',
      recommendation: 'Water level needs attention. Consider irrigation.',
      icon: '🌾',
      color: 'text-yellow-600'
    },
    {
      crop: 'Cotton',
      status: 'Excellent',
      recommendation: 'Ideal conditions for growth. Continue current practices.',
      icon: '🧶',
      color: 'text-blue-600'
    }
  ];

  const weatherAlerts = [
    {
      type: 'Rain Alert',
      message: 'Light rain expected in next 24 hours. Protect harvested crops.',
      icon: '🌧️',
      severity: 'medium'
    },
    {
      type: 'Temperature Warning',
      message: 'High temperature expected. Ensure proper irrigation.',
      icon: '🌡️',
      severity: 'high'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Crop Advisory</h1>
          <p className="text-gray-600">AI-powered recommendations for optimal farming</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Crops</p>
                  <p className="text-xl font-bold text-gray-800">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Sun className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Weather</p>
                  <p className="text-xl font-bold text-gray-800">28°C</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Soil Moisture</p>
                  <p className="text-xl font-bold text-gray-800">65%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Yield Forecast</p>
                  <p className="text-xl font-bold text-gray-800">+15%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Crop Recommendations */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <span>Current Crop Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cropRecommendations.map((crop, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{crop.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-800">{crop.crop}</h3>
                            <span className={`text-sm font-medium ${crop.color}`}>
                              {crop.status}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                      <p className="text-gray-600 text-sm">{crop.recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weather & Alerts */}
          <div className="space-y-6">
            {/* Weather Widget */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Thermometer className="w-5 h-5 text-blue-600" />
                  <span>Weather</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">28°C</div>
                  <p className="text-gray-600 mb-4">Partly Cloudy</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Humidity</p>
                      <p className="font-semibold">65%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Wind</p>
                      <p className="font-semibold">12 km/h</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-red-600" />
                  <span>Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weatherAlerts.map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg border-l-4 ${
                      alert.severity === 'high' ? 'border-l-red-500 bg-red-50' : 'border-l-yellow-500 bg-yellow-50'
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

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button className="bg-green-600 hover:bg-green-700">
            <Leaf className="w-4 h-4 mr-2" />
            Get Detailed Analysis
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Consultation
          </Button>
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Historical Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CropAdvisory;
