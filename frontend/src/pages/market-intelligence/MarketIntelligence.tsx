import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  LineChart, 
  PieChart, 
  MapPin, 
  Calendar,
  Search,
  Filter,
  Download,
  Share2,
  Bell,
  AlertTriangle,
  Info,
  Star,
  Eye,
  Plus,
  Settings,
  RefreshCw,
  Zap,
  Leaf,
  Package,
  Truck,
  Users,
  Globe,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Equal
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui';
import type { SelectOption } from '../../components/ui';

interface MarketPrice {
  id: string;
  crop: string;
  market: string;
  state: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  unit: string;
  quality: 'A' | 'B' | 'C';
  lastUpdated: Date;
  trend: 'up' | 'down' | 'stable';
  volume: number;
  demand: 'high' | 'medium' | 'low';
  supply: 'high' | 'medium' | 'low';
}

interface PriceForecast {
  id: string;
  crop: string;
  market: string;
  currentPrice: number;
  forecastedPrice: number;
  confidence: number;
  factors: string[];
  timeframe: '1-week' | '1-month' | '3-months' | '6-months';
  lastUpdated: Date;
}

interface MarketTrend {
  id: string;
  crop: string;
  market: string;
  period: string;
  trend: 'bullish' | 'bearish' | 'sideways';
  strength: 'strong' | 'moderate' | 'weak';
  factors: string[];
  recommendation: string;
  risk: 'low' | 'medium' | 'high';
}

interface SupplyDemand {
  id: string;
  crop: string;
  region: string;
  supply: number;
  demand: number;
  surplus: number;
  seasonality: 'peak' | 'normal' | 'low';
  forecast: {
    nextMonth: number;
    nextQuarter: number;
    nextYear: number;
  };
  lastUpdated: Date;
}

const MarketIntelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('1-month');

  const mockMarketPrices: MarketPrice[] = [
    {
      id: '1',
      crop: 'Wheat',
      market: 'Delhi',
      state: 'Delhi',
      currentPrice: 2450,
      previousPrice: 2380,
      change: 70,
      changePercent: 2.94,
      unit: 'per quintal',
      quality: 'A',
      lastUpdated: new Date(),
      trend: 'up',
      volume: 15000,
      demand: 'high',
      supply: 'medium'
    },
    {
      id: '2',
      crop: 'Rice',
      market: 'Mumbai',
      state: 'Maharashtra',
      currentPrice: 3200,
      previousPrice: 3250,
      change: -50,
      changePercent: -1.54,
      unit: 'per quintal',
      quality: 'A',
      lastUpdated: new Date(),
      trend: 'down',
      volume: 12000,
      demand: 'medium',
      supply: 'high'
    },
    {
      id: '3',
      crop: 'Cotton',
      market: 'Ahmedabad',
      state: 'Gujarat',
      currentPrice: 6800,
      previousPrice: 6750,
      change: 50,
      changePercent: 0.74,
      unit: 'per quintal',
      quality: 'A',
      lastUpdated: new Date(),
      trend: 'up',
      volume: 8000,
      demand: 'high',
      supply: 'low'
    }
  ];

  const mockPriceForecasts: PriceForecast[] = [
    {
      id: '1',
      crop: 'Wheat',
      market: 'Delhi',
      currentPrice: 2450,
      forecastedPrice: 2520,
      confidence: 85,
      factors: ['Strong demand from flour mills', 'Limited supply from northern states', 'Export demand increasing'],
      timeframe: '1-month',
      lastUpdated: new Date()
    },
    {
      id: '2',
      crop: 'Rice',
      market: 'Mumbai',
      currentPrice: 3200,
      forecastedPrice: 3150,
      confidence: 78,
      factors: ['Good monsoon expected', 'Government procurement policies', 'Export restrictions'],
      timeframe: '3-months',
      lastUpdated: new Date()
    }
  ];

  const mockMarketTrends: MarketTrend[] = [
    {
      id: '1',
      crop: 'Wheat',
      market: 'Delhi',
      period: 'Q1 2024',
      trend: 'bullish',
      strength: 'strong',
      factors: ['Export demand', 'Limited supply', 'Strong domestic consumption'],
      recommendation: 'Hold inventory, consider forward contracts',
      risk: 'medium'
    },
    {
      id: '2',
      crop: 'Cotton',
      market: 'Ahmedabad',
      period: 'Q1 2024',
      trend: 'bullish',
      strength: 'moderate',
      factors: ['Textile industry recovery', 'Export opportunities', 'Moderate supply'],
      recommendation: 'Gradual selling, monitor export markets',
      risk: 'low'
    }
  ];

  const mockSupplyDemand: SupplyDemand[] = [
    {
      id: '1',
      crop: 'Wheat',
      region: 'North India',
      supply: 2500000,
      demand: 2200000,
      surplus: 300000,
      seasonality: 'normal',
      forecast: {
        nextMonth: 2400000,
        nextQuarter: 2300000,
        nextYear: 2600000
      },
      lastUpdated: new Date()
    },
    {
      id: '2',
      crop: 'Rice',
      region: 'East India',
      supply: 1800000,
      demand: 1900000,
      surplus: -100000,
      seasonality: 'low',
      forecast: {
        nextMonth: 1750000,
        nextQuarter: 1850000,
        nextYear: 2000000
      },
      lastUpdated: new Date()
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-600" />;
      default: return <Equal className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-100';
      case 'down': return 'text-red-600 bg-red-100';
      case 'stable': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDemandSupplyColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMarketTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish': return 'text-green-600 bg-green-100';
      case 'bearish': return 'text-red-600 bg-red-100';
      case 'sideways': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredPrices = mockMarketPrices.filter(price => {
    const matchesCrop = selectedCrop === 'all' || price.crop.toLowerCase() === selectedCrop.toLowerCase();
    const matchesMarket = selectedMarket === 'all' || price.market.toLowerCase() === selectedMarket.toLowerCase();
    const matchesSearch = price.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         price.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         price.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesMarket && matchesSearch;
  });

  const totalMarketValue = mockMarketPrices.reduce((sum, price) => sum + (price.currentPrice * price.volume), 0);
  const averagePriceChange = mockMarketPrices.reduce((sum, price) => sum + price.changePercent, 0) / mockMarketPrices.length;
  const bullishTrends = mockMarketTrends.filter(trend => trend.trend === 'bullish').length;

  return (
    <div className="min-h-screen bg-neutral-gray p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-full">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-dark">Market Intelligence & Price Analytics</h1>
              <p className="text-text-light">Real-time market data, price trends, and forecasting insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Bell className="w-4 h-4 mr-2" />
              Price Alerts
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Watchlist
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'prices', label: 'Market Prices', icon: <DollarSign className="w-4 h-4" /> },
            { id: 'forecasts', label: 'Price Forecasts', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'trends', label: 'Market Trends', icon: <LineChart className="w-4 h-4" /> },
            { id: 'supply-demand', label: 'Supply & Demand', icon: <PieChart className="w-4 h-4" /> }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Total Market Value</p>
                    <p className="text-2xl font-bold text-text-dark">₹{(totalMarketValue / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Avg Price Change</p>
                    <p className={`text-2xl font-bold ${averagePriceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {averagePriceChange >= 0 ? '+' : ''}{averagePriceChange.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <LineChart className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Bullish Trends</p>
                    <p className="text-2xl font-bold text-text-dark">{bullishTrends}</p>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Active Markets</p>
                    <p className="text-2xl font-bold text-text-dark">{mockMarketPrices.length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Market Overview & Price Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Overview */}
              <Card>
                <h3 className="text-lg font-semibold mb-4">Market Overview</h3>
                <div className="space-y-3">
                  {mockMarketPrices.slice(0, 5).map(price => (
                    <div key={price.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{price.crop} - {price.market}</h4>
                        <p className="text-xs text-text-light">{price.state}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">₹{price.currentPrice}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(price.trend)}`}>
                            {getTrendIcon(price.trend)}
                            {price.changePercent.toFixed(2)}%
                          </span>
                        </div>
                        <p className="text-xs text-text-light">{price.unit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Price Trends Chart */}
              <Card>
                <h3 className="text-lg font-semibold mb-4">Price Trends</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <LineChart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">Price Trends Chart</p>
                    <p className="text-sm">Interactive chart showing price movements over time</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'prices' && (
          <div className="space-y-6">
            {/* Filters & Search */}
            <Card>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by crop, market, or state..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                  />
                </div>
                <Select
                  value={selectedCrop}
                  onChange={(value) => setSelectedCrop(value)}
                  placeholder="Select Crop"
                >
                  <SelectOption value="all">All Crops</SelectOption>
                  <SelectOption value="wheat">Wheat</SelectOption>
                  <SelectOption value="rice">Rice</SelectOption>
                  <SelectOption value="cotton">Cotton</SelectOption>
                  <SelectOption value="sugarcane">Sugarcane</SelectOption>
                </Select>
                <Select
                  value={selectedMarket}
                  onChange={(value) => setSelectedMarket(value)}
                  placeholder="Select Market"
                >
                  <SelectOption value="all">All Markets</SelectOption>
                  <SelectOption value="delhi">Delhi</SelectOption>
                  <SelectOption value="mumbai">Mumbai</SelectOption>
                  <SelectOption value="ahmedabad">Ahmedabad</SelectOption>
                  <SelectOption value="bangalore">Bangalore</SelectOption>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </Card>

            {/* Market Prices List */}
            <div className="space-y-4">
              {filteredPrices.map(price => (
                <Card key={price.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{price.crop} - {price.market}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {price.state}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(price.trend)}`}>
                          {getTrendIcon(price.trend)}
                          {price.changePercent >= 0 ? '+' : ''}{price.changePercent.toFixed(2)}%
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Current Price</p>
                            <p className="text-sm text-text-light">₹{price.currentPrice.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Volume</p>
                            <p className="text-sm text-text-light">{price.volume.toLocaleString()} {price.unit}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Demand</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDemandSupplyColor(price.demand)}`}>
                              {price.demand}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Supply</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDemandSupplyColor(price.supply)}`}>
                              {price.supply}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-text-light">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Updated: {price.lastUpdated.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          <span>Quality: {price.quality}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-primary-green mb-2">
                        ₹{price.currentPrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-text-light mb-2">
                        {price.change >= 0 ? '+' : ''}₹{price.change} ({price.changePercent >= 0 ? '+' : ''}{price.changePercent.toFixed(2)}%)
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Bell className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'forecasts' && (
          <div className="space-y-6">
            {/* Price Forecasts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPriceForecasts.map(forecast => (
                <Card key={forecast.id} className="hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">{forecast.crop} - {forecast.market}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-light">Timeframe:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs capitalize">
                        {forecast.timeframe.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Current Price</span>
                      <span className="font-medium">₹{forecast.currentPrice.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Forecasted Price</span>
                      <span className="font-medium">₹{forecast.forecastedPrice.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Expected Change</span>
                      <span className={`font-medium ${forecast.forecastedPrice >= forecast.currentPrice ? 'text-green-600' : 'text-red-600'}`}>
                        {forecast.forecastedPrice >= forecast.currentPrice ? '+' : ''}₹{Math.abs(forecast.forecastedPrice - forecast.currentPrice).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Confidence</span>
                      <span className="font-medium">{forecast.confidence}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Key Factors</h4>
                    <div className="space-y-1">
                      {forecast.factors.map((factor, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-text-light">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bell className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            {/* Market Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockMarketTrends.map(trend => (
                <Card key={trend.id} className="hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{trend.crop} - {trend.market}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMarketTrendColor(trend.trend)}`}>
                        {trend.trend.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-text-light">{trend.period}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Trend Strength</span>
                      <span className="font-medium capitalize">{trend.strength}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Risk Level</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        trend.risk === 'low' ? 'bg-green-100 text-green-800' :
                        trend.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {trend.risk}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Key Factors</h4>
                    <div className="space-y-1">
                      {trend.factors.map((factor, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-text-light">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Recommendation</h4>
                    <p className="text-sm text-text-dark">{trend.recommendation}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'supply-demand' && (
          <div className="space-y-6">
            {/* Supply & Demand Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockSupplyDemand.map(item => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">{item.crop} - {item.region}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-light">Seasonality:</span>
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                        item.seasonality === 'peak' ? 'bg-green-100 text-green-800' :
                        item.seasonality === 'normal' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.seasonality}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Current Supply</span>
                      <span className="font-medium">{item.supply.toLocaleString()} MT</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Current Demand</span>
                      <span className="font-medium">{item.demand.toLocaleString()} MT</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Surplus/Deficit</span>
                      <span className={`font-medium ${item.surplus >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.surplus >= 0 ? '+' : ''}{item.surplus.toLocaleString()} MT
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Forecast</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-light">Next Month</span>
                        <span className="font-medium">{item.forecast.nextMonth.toLocaleString()} MT</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-light">Next Quarter</span>
                        <span className="font-medium">{item.forecast.nextQuarter.toLocaleString()} MT</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-light">Next Year</span>
                        <span className="font-medium">{item.forecast.nextYear.toLocaleString()} MT</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketIntelligence;





