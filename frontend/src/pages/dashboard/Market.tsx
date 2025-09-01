import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, MapPin, Clock } from 'lucide-react';

const Market: React.FC = () => {
  const marketData = [
    {
      crop: 'Wheat',
      currentPrice: '₹2,450',
      change: '+₹150',
      changePercent: '+6.5%',
      trend: 'up',
      market: 'Mumbai APMC',
      volume: '1,250 tons'
    },
    {
      crop: 'Rice',
      currentPrice: '₹3,200',
      change: '-₹80',
      changePercent: '-2.4%',
      trend: 'down',
      market: 'Delhi APMC',
      volume: '890 tons'
    },
    {
      crop: 'Cotton',
      currentPrice: '₹6,800',
      change: '+₹320',
      changePercent: '+4.9%',
      trend: 'up',
      market: 'Ahmedabad APMC',
      volume: '450 tons'
    },
    {
      crop: 'Sugarcane',
      currentPrice: '₹3,150',
      change: '+₹120',
      changePercent: '+4.0%',
      trend: 'up',
      market: 'Pune APMC',
      volume: '2,100 tons'
    }
  ];

  const marketTrends = [
    {
      crop: 'Wheat',
      trend: 'Bullish',
      reason: 'Strong demand from flour mills',
      recommendation: 'Hold for better prices'
    },
    {
      crop: 'Rice',
      trend: 'Bearish',
      reason: 'Increased supply from new harvest',
      recommendation: 'Consider selling soon'
    },
    {
      crop: 'Cotton',
      trend: 'Bullish',
      reason: 'Export demand increasing',
      recommendation: 'Good time to sell'
    }
  ];

  const upcomingAuctions = [
    {
      date: '15 Dec 2024',
      time: '10:00 AM',
      market: 'Mumbai APMC',
      crops: ['Wheat', 'Rice', 'Pulses'],
      status: 'Upcoming'
    },
    {
      date: '18 Dec 2024',
      time: '2:00 PM',
      market: 'Delhi APMC',
      crops: ['Cotton', 'Sugarcane'],
      status: 'Registration Open'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Market Intelligence</h1>
          <p className="text-gray-600">Real-time prices, trends, and trading opportunities</p>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Market Index</p>
                  <p className="text-xl font-bold text-gray-800">+2.4%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Price</p>
                  <p className="text-xl font-bold text-gray-800">₹3,650</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Volume</p>
                  <p className="text-xl font-bold text-gray-800">4,690 tons</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Markets</p>
                  <p className="text-xl font-bold text-gray-800">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Prices */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span>Current Market Prices</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketData.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xl font-bold text-green-600">{item.crop[0]}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{item.crop}</h3>
                            <p className="text-sm text-gray-500">{item.market}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-800">{item.currentPrice}</div>
                          <div className={`text-sm font-medium ${
                            item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.change} ({item.changePercent})
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Volume: {item.volume}</span>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Trends & Auctions */}
          <div className="space-y-6">
            {/* Market Trends */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Market Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketTrends.map((trend, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{trend.crop}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trend.trend === 'Bullish' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {trend.trend}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs mb-1">{trend.reason}</p>
                      <p className="text-green-600 text-xs font-medium">{trend.recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Auctions */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span>Upcoming Auctions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAuctions.map((auction, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">{auction.date}</h4>
                          <p className="text-sm text-gray-500">{auction.time}</p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {auction.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{auction.market}</p>
                      <div className="flex flex-wrap gap-1">
                        {auction.crops.map((crop, cropIndex) => (
                          <span key={cropIndex} className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {crop}
                          </span>
                        ))}
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
            <BarChart3 className="w-4 h-4 mr-2" />
            Get Market Report
          </Button>
          <Button variant="outline">
            <MapPin className="w-4 h-4 mr-2" />
            Find Nearest Market
          </Button>
          <Button variant="outline">
            <Clock className="w-4 h-4 mr-2" />
            Set Price Alerts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Market;

