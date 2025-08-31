import React, { useState, useRef } from 'react';
import { 
  Brain, 
  Camera, 
  Cloud, 
  Leaf, 
  MessageCircle, 
  Phone, 
  Calendar, 
  AlertTriangle,
  TrendingUp,
  Droplets,
  Sun,
  Wind,
  Thermometer,
  BarChart3,
  Upload,
  Search,
  Clock,
  Star,
  MapPin,
  Users,
  Video,
  FileText,
  Zap,
  Target,
  Shield,
  Lightbulb
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  uvIndex: number;
  condition: string;
}

interface CropAdvisory {
  id: string;
  crop: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  category: 'weather' | 'disease' | 'soil' | 'planning';
  timestamp: Date;
}

interface Expert {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  experience: number;
  languages: string[];
  availability: string;
  consultationFee: number;
  image: string;
}

const AICropAdvisory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'ai', message: string, timestamp: Date}>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [weatherData] = useState<WeatherData>({
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    rainfall: 0,
    uvIndex: 7,
    condition: 'Sunny'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockAdvisories: CropAdvisory[] = [
    {
      id: '1',
      crop: 'Wheat',
      recommendation: 'Apply nitrogen fertilizer within 3 days for optimal growth',
      priority: 'high',
      category: 'soil',
      timestamp: new Date()
    },
    {
      id: '2',
      crop: 'Rice',
      recommendation: 'Increase irrigation frequency due to high temperature',
      priority: 'medium',
      category: 'weather',
      timestamp: new Date(Date.now() - 86400000)
    },
    {
      id: '3',
      crop: 'Cotton',
      recommendation: 'Monitor for pink bollworm - apply preventive treatment',
      priority: 'high',
      category: 'disease',
      timestamp: new Date(Date.now() - 172800000)
    }
  ];

  const mockExperts: Expert[] = [
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      specialization: 'Soil Science & Fertilizer',
      rating: 4.8,
      experience: 15,
      languages: ['Hindi', 'English', 'Punjabi'],
      availability: 'Mon-Fri, 9 AM-6 PM',
      consultationFee: 500,
      image: '/api/placeholder/60/60'
    },
    {
      id: '2',
      name: 'Dr. Priya Sharma',
      specialization: 'Plant Pathology',
      rating: 4.9,
      experience: 12,
      languages: ['Hindi', 'English', 'Gujarati'],
      availability: 'Mon-Sat, 10 AM-7 PM',
      consultationFee: 600,
      image: '/api/placeholder/60/60'
    },
    {
      id: '3',
      name: 'Dr. Amit Patel',
      specialization: 'Agricultural Extension',
      rating: 4.7,
      experience: 18,
      languages: ['Hindi', 'English', 'Marathi'],
      availability: 'Mon-Fri, 8 AM-5 PM',
      consultationFee: 450,
      image: '/api/placeholder/60/60'
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsAnalyzing(true);
      // Simulate AI analysis
      setTimeout(() => {
        setAnalysisResult({
          disease: 'Leaf Blight',
          confidence: 87,
          severity: 'Medium',
          treatment: 'Apply fungicide (Mancozeb 75% WP) at 2.5g/liter',
          prevention: 'Ensure proper spacing and avoid overhead irrigation',
          cost: '₹800-1200 per acre'
        });
        setIsAnalyzing(false);
      }, 3000);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      const userMessage = { type: 'user' as const, message: chatMessage, timestamp: new Date() };
      setChatHistory(prev => [...prev, userMessage]);
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = { 
          type: 'ai' as const, 
          message: `Based on your ${selectedCrop} crop and current weather conditions, I recommend monitoring soil moisture levels and considering early irrigation if temperatures remain high.`, 
          timestamp: new Date() 
        };
        setChatHistory(prev => [...prev, aiResponse]);
      }, 1000);
      
      setChatMessage('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weather': return <Cloud className="w-4 h-4" />;
      case 'disease': return <AlertTriangle className="w-4 h-4" />;
      case 'soil': return <Leaf className="w-4 h-4" />;
      case 'planning': return <Calendar className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-gray p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary-green rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-dark">AI Crop Advisory System</h1>
              <p className="text-text-light">Get intelligent farming recommendations powered by AI</p>
            </div>
          </div>
          
          {/* Weather Summary Card */}
          <Card className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Sun className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{weatherData.condition}</h3>
                  <p className="text-text-light">{weatherData.temperature}°C, {weatherData.humidity}% humidity</p>
                </div>
              </div>
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-gray-500" />
                  <span>{weatherData.windSpeed} km/h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-gray-500" />
                  <span>{weatherData.rainfall} mm</span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-gray-500" />
                  <span>UV {weatherData.uvIndex}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'chat', label: 'AI Assistant', icon: <MessageCircle className="w-4 h-4" /> },
            { id: 'disease', label: 'Disease Detection', icon: <Camera className="w-4 h-4" /> },
            { id: 'weather', label: 'Weather', icon: <Cloud className="w-4 h-4" /> },
            { id: 'experts', label: 'Expert Consultation', icon: <Users className="w-4 h-4" /> }
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Crop Selection */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Select Your Crop</h3>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-agricultural focus:border-primary-green focus:outline-none"
              >
                <option value="wheat">Wheat</option>
                <option value="rice">Rice</option>
                <option value="cotton">Cotton</option>
                <option value="sugarcane">Sugarcane</option>
                <option value="maize">Maize</option>
                <option value="pulses">Pulses</option>
              </select>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('disease')}>
                  <Camera className="w-4 h-4 mr-2" />
                  Detect Disease
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('weather')}>
                  <Cloud className="w-4 h-4 mr-2" />
                  Weather Forecast
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('experts')}>
                  <Phone className="w-4 h-4 mr-2" />
                  Book Expert
                </Button>
              </div>
            </Card>

            {/* AI Insights */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Target className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Optimal planting time</p>
                    <p className="text-xs text-text-light">Next 2 weeks</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Disease risk</p>
                    <p className="text-xs text-text-light">Low this week</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'chat' && (
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-green rounded-full">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">AI Agricultural Assistant</h3>
            </div>
            
            {/* Chat Interface */}
            <div className="h-96 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Ask me anything about farming, crops, or agricultural practices!</p>
                  <p className="text-sm mt-2">I can help with disease identification, weather advice, and farming tips.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs p-3 rounded-lg ${
                        msg.type === 'user' 
                          ? 'bg-primary-green text-white' 
                          : 'bg-white border border-gray-200'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.type === 'user' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="flex gap-3">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask about farming, crops, weather, or get advice..."
                className="flex-1"
              />
              <Button type="submit" disabled={!chatMessage.trim()}>
                <Zap className="w-4 h-4" />
              </Button>
            </form>
          </Card>
        )}

        {activeTab === 'disease' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Upload */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Disease Detection</h3>
              <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Upload Crop Photo</p>
                <p className="text-sm text-text-light mb-4">
                  Take a clear photo of the affected plant part for AI analysis
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Photo
                </Button>
              </div>
            </Card>

            {/* Analysis Results */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
              {isAnalyzing ? (
                <div className="text-center p-8">
                  <div className="animate-spin w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-lg font-medium">Analyzing your crop photo...</p>
                  <p className="text-sm text-text-light">This may take a few moments</p>
                </div>
              ) : analysisResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">Disease Identified</h4>
                    <p className="text-red-700 font-medium">{analysisResult.disease}</p>
                    <p className="text-sm text-red-600">Confidence: {analysisResult.confidence}%</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium mb-1">Severity</h5>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        analysisResult.severity === 'High' ? 'bg-red-100 text-red-800' :
                        analysisResult.severity === 'Medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {analysisResult.severity}
                      </span>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-1">Treatment</h5>
                      <p className="text-sm text-text-dark">{analysisResult.treatment}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-1">Prevention</h5>
                      <p className="text-sm text-text-dark">{analysisResult.prevention}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-1">Estimated Cost</h5>
                      <p className="text-sm text-text-dark">{analysisResult.cost}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Upload a photo to get started with disease detection</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'weather' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Weather */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Current Weather</h3>
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-primary-green mb-2">{weatherData.temperature}°C</div>
                <p className="text-lg text-text-light mb-4">{weatherData.condition}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span>Humidity: {weatherData.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-gray-500" />
                    <span>Wind: {weatherData.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 7-Day Forecast */}
            <Card className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">7-Day Forecast</h3>
              <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium">Day {i + 1}</p>
                    <div className="text-2xl font-bold text-primary-green my-2">
                      {weatherData.temperature + Math.floor(Math.random() * 6 - 3)}°C
                    </div>
                    <p className="text-xs text-text-light">Partly Cloudy</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'experts' && (
          <div className="space-y-6">
            {/* Expert List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockExperts.map(expert => (
                <Card key={expert.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{expert.name}</h3>
                      <p className="text-sm text-text-light mb-2">{expert.specialization}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{expert.rating}</span>
                        <span className="text-xs text-text-light">({expert.experience} years)</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-text-light">{expert.languages.join(', ')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">₹{expert.consultationFee}/hr</span>
                        <Button size="sm" variant="outline">
                          <Video className="w-4 h-4 mr-2" />
                          Book
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Consultation History */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Recent Consultations</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-green rounded-full flex items-center justify-center">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Dr. Rajesh Kumar</p>
                      <p className="text-sm text-text-light">Soil testing consultation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₹500</p>
                    <p className="text-xs text-text-light">2 days ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Recent Advisories */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Recent AI Advisories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAdvisories.map(advisory => (
              <Card key={advisory.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-green rounded-full">
                    {getCategoryIcon(advisory.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{advisory.crop}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(advisory.priority)}`}>
                        {advisory.priority}
                      </span>
                    </div>
                    <p className="text-sm text-text-dark mb-3">{advisory.recommendation}</p>
                    <div className="flex items-center gap-2 text-xs text-text-light">
                      <Clock className="w-3 h-3" />
                      <span>{advisory.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICropAdvisory;







