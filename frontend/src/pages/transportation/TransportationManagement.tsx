import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Route, 
  Clock, 
  DollarSign, 
  Users, 
  Package, 
  Navigation,
  Calendar,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Settings,
  Phone,
  MessageCircle,
  Star,
  Zap,
  Fuel,
  Gauge,
  Wrench,
  Shield,
  FileText,
  Download,
  Upload
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui';
import type { SelectOption } from '../../components/ui';

interface Vehicle {
  id: string;
  type: 'truck' | 'tractor' | 'pickup' | 'trailer';
  model: string;
  capacity: number;
  licensePlate: string;
  driver: string;
  status: 'available' | 'in-transit' | 'maintenance' | 'offline';
  location: string;
  fuelLevel: number;
  lastMaintenance: Date;
  rating: number;
  image: string;
}

interface TransportJob {
  id: string;
  title: string;
  pickup: string;
  delivery: string;
  distance: number;
  estimatedTime: number;
  price: number;
  status: 'pending' | 'assigned' | 'in-transit' | 'delivered' | 'cancelled';
  customer: string;
  vehicle?: string;
  driver?: string;
  pickupDate: Date;
  deliveryDate?: Date;
  cargo: {
    type: string;
    weight: number;
    volume: number;
    specialRequirements: string[];
  };
  route: {
    waypoints: string[];
    totalDistance: number;
    estimatedFuel: number;
    tolls: number;
  };
}

interface Driver {
  id: string;
  name: string;
  license: string;
  experience: number;
  rating: number;
  status: 'available' | 'busy' | 'offline';
  currentLocation: string;
  phone: string;
  email: string;
  vehicle?: string;
  completedJobs: number;
  totalEarnings: number;
  image: string;
}

const TransportationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      type: 'truck',
      model: 'Tata 407',
      capacity: 2000,
      licensePlate: 'PB-07-AB-1234',
      driver: 'Rajesh Kumar',
      status: 'available',
      location: 'Punjab',
      fuelLevel: 85,
      lastMaintenance: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      rating: 4.8,
      image: '/api/placeholder/80/80'
    },
    {
      id: '2',
      type: 'tractor',
      model: 'Mahindra 475',
      capacity: 1500,
      licensePlate: 'HR-06-CD-5678',
      driver: 'Amit Singh',
      status: 'in-transit',
      location: 'Haryana',
      fuelLevel: 45,
      lastMaintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      rating: 4.6,
      image: '/api/placeholder/80/80'
    },
    {
      id: '3',
      type: 'pickup',
      model: 'Mahindra Bolero',
      capacity: 800,
      licensePlate: 'RJ-08-EF-9012',
      driver: 'Suresh Patel',
      status: 'maintenance',
      location: 'Rajasthan',
      fuelLevel: 20,
      lastMaintenance: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      rating: 4.7,
      image: '/api/placeholder/80/80'
    }
  ]);

  const [transportJobs, setTransportJobs] = useState<TransportJob[]>([
    {
      id: '1',
      title: 'Wheat Transport - Punjab to Delhi',
      pickup: 'Amritsar, Punjab',
      delivery: 'Delhi, NCR',
      distance: 450,
      estimatedTime: 8,
      price: 8500,
      status: 'assigned',
      customer: 'Delhi Grain Traders',
      vehicle: '1',
      driver: 'Rajesh Kumar',
      pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      cargo: {
        type: 'Wheat',
        weight: 1800,
        volume: 45,
        specialRequirements: ['Temperature controlled', 'Dry storage']
      },
      route: {
        waypoints: ['Amritsar', 'Ludhiana', 'Panipat', 'Delhi'],
        totalDistance: 450,
        estimatedFuel: 45,
        tolls: 350
      }
    },
    {
      id: '2',
      title: 'Cotton Transport - Haryana to Mumbai',
      pickup: 'Hisar, Haryana',
      delivery: 'Mumbai, Maharashtra',
      distance: 1200,
      estimatedTime: 24,
      price: 18000,
      status: 'pending',
      customer: 'Mumbai Textile Mills',
      pickupDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      cargo: {
        type: 'Cotton',
        weight: 2500,
        volume: 60,
        specialRequirements: ['Moisture controlled', 'Ventilation']
      },
      route: {
        waypoints: ['Hisar', 'Jaipur', 'Ahmedabad', 'Mumbai'],
        totalDistance: 1200,
        estimatedFuel: 120,
        tolls: 850
      }
    }
  ]);

  const [drivers] = useState<Driver[]>([
    {
      id: '1',
      name: 'Rajesh Kumar',
      license: 'DL-04-2018-1234567',
      experience: 8,
      rating: 4.8,
      status: 'available',
      currentLocation: 'Punjab',
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@example.com',
      vehicle: '1',
      completedJobs: 156,
      totalEarnings: 125000,
      image: '/api/placeholder/60/60'
    },
    {
      id: '2',
      name: 'Amit Singh',
      license: 'DL-06-2016-9876543',
      experience: 12,
      rating: 4.6,
      status: 'busy',
      currentLocation: 'Haryana',
      phone: '+91 98765 43211',
      email: 'amit.singh@example.com',
      vehicle: '2',
      completedJobs: 203,
      totalEarnings: 189000,
      image: '/api/placeholder/60/60'
    }
  ]);

  const [selectedJob, setSelectedJob] = useState<TransportJob | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'assigned': return 'text-blue-600 bg-blue-100';
      case 'in-transit': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getVehicleStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'in-transit': return 'text-blue-600 bg-blue-100';
      case 'maintenance': return 'text-orange-600 bg-orange-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'truck': return <Truck className="w-6 h-6 text-blue-600" />;
      case 'tractor': return <Truck className="w-6 h-6 text-green-600" />;
      case 'pickup': return <Truck className="w-6 h-6 text-orange-600" />;
      case 'trailer': return <Truck className="w-6 h-6 text-purple-600" />;
      default: return <Truck className="w-6 h-6 text-gray-600" />;
    }
  };

  const filteredJobs = transportJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.delivery.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = transportJobs
    .filter(job => job.status === 'delivered')
    .reduce((sum, job) => sum + job.price, 0);

  const activeJobs = transportJobs.filter(job => 
    ['assigned', 'in-transit'].includes(job.status)
  ).length;

  const availableVehicles = vehicles.filter(vehicle => 
    vehicle.status === 'available'
  ).length;

  return (
    <div className="min-h-screen bg-neutral-gray p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-full">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-dark">Transportation Management</h1>
              <p className="text-text-light">Optimize routes, manage vehicles, and track deliveries</p>
            </div>
          </div>
          
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Transport Job
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'jobs', label: 'Transport Jobs', icon: <Package className="w-4 h-4" /> },
            { id: 'vehicles', label: 'Vehicle Fleet', icon: <Truck className="w-4 h-4" /> },
            { id: 'drivers', label: 'Drivers', icon: <Users className="w-4 h-4" /> },
            { id: 'routes', label: 'Route Optimization', icon: <Route className="w-4 h-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> }
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
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Total Revenue</p>
                    <p className="text-2xl font-bold text-text-dark">₹{totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Route className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Active Jobs</p>
                    <p className="text-2xl font-bold text-text-dark">{activeJobs}</p>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Truck className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Available Vehicles</p>
                    <p className="text-2xl font-bold text-text-dark">{availableVehicles}</p>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Active Drivers</p>
                    <p className="text-2xl font-bold text-text-dark">{drivers.filter(d => d.status === 'busy').length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Jobs & Vehicle Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Jobs */}
              <Card>
                <h3 className="text-lg font-semibold mb-4">Recent Transport Jobs</h3>
                <div className="space-y-3">
                  {transportJobs.slice(0, 5).map(job => (
                    <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{job.title}</h4>
                        <p className="text-xs text-text-light">{job.pickup} → {job.delivery}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                        <span className="text-sm font-medium">₹{job.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Vehicle Status */}
              <Card>
                <h3 className="text-lg font-semibold mb-4">Vehicle Fleet Status</h3>
                <div className="space-y-3">
                  {vehicles.map(vehicle => (
                    <div key={vehicle.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-gray-100 rounded">
                        {getVehicleIcon(vehicle.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{vehicle.model}</h4>
                        <p className="text-xs text-text-light">{vehicle.licensePlate}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVehicleStatusColor(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                        <p className="text-xs text-text-light mt-1">{vehicle.fuelLevel}% fuel</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <Card>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search jobs by title, pickup, or delivery location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
                  placeholder="Filter by status"
                >
                  <SelectOption value="all">All Status</SelectOption>
                  <SelectOption value="pending">Pending</SelectOption>
                  <SelectOption value="assigned">Assigned</SelectOption>
                  <SelectOption value="in-transit">In Transit</SelectOption>
                  <SelectOption value="delivered">Delivered</SelectOption>
                  <SelectOption value="cancelled">Cancelled</SelectOption>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </Card>

            {/* Jobs List */}
            <div className="space-y-4">
              {filteredJobs.map(job => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
                  setSelectedJob(job);
                  setShowJobModal(true);
                }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Pickup</p>
                            <p className="text-sm text-text-light">{job.pickup}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Navigation className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Delivery</p>
                            <p className="text-sm text-text-light">{job.delivery}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Route className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Distance</p>
                            <p className="text-sm text-text-light">{job.distance} km</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-text-light">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Est. Time: {job.estimatedTime} hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          <span>{job.cargo.type} - {job.cargo.weight} kg</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Pickup: {job.pickupDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-primary-green mb-2">
                        ₹{job.price.toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            {/* Vehicle Fleet Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map(vehicle => (
                <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      {getVehicleIcon(vehicle.type)}
                    </div>
                    <h3 className="text-lg font-semibold">{vehicle.model}</h3>
                    <p className="text-sm text-text-light">{vehicle.licensePlate}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Driver</span>
                      <span className="font-medium">{vehicle.driver}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Capacity</span>
                      <span className="font-medium">{vehicle.capacity} kg</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Location</span>
                      <span className="font-medium">{vehicle.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Fuel Level</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${vehicle.fuelLevel}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{vehicle.fuelLevel}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{vehicle.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVehicleStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="space-y-6">
            {/* Drivers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drivers.map(driver => (
                <Card key={driver.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{driver.name}</h3>
                      <p className="text-sm text-text-light mb-2">License: {driver.license}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{driver.rating}</span>
                        <span className="text-xs text-text-light">({driver.experience} years exp.)</span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-light">Status</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            driver.status === 'available' ? 'bg-green-100 text-green-800' :
                            driver.status === 'busy' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {driver.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-light">Location</span>
                          <span className="font-medium">{driver.currentLocation}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-light">Completed Jobs</span>
                          <span className="font-medium">{driver.completedJobs}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-light">Total Earnings</span>
                          <span className="font-medium">₹{driver.totalEarnings.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'routes' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Route Optimization</h3>
            <div className="text-center p-12 text-gray-500">
              <Route className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Route Optimization Coming Soon</p>
              <p className="text-sm">AI-powered route optimization with real-time traffic data</p>
            </div>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Transportation Analytics</h3>
            <div className="text-center p-12 text-gray-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Analytics Dashboard Coming Soon</p>
              <p className="text-sm">Comprehensive analytics and reporting for transportation operations</p>
            </div>
          </Card>
        )}

        {/* Job Details Modal */}
        {showJobModal && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Job Details</h2>
                <Button variant="outline" size="sm" onClick={() => setShowJobModal(false)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Job Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-text-light">Title</label>
                      <p className="font-medium">{selectedJob.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-light">Customer</label>
                      <p className="font-medium">{selectedJob.customer}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-light">Status</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedJob.status)}`}>
                        {selectedJob.status}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-light">Price</label>
                      <p className="text-2xl font-bold text-primary-green">₹{selectedJob.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Route Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-text-light">Pickup</label>
                      <p className="font-medium">{selectedJob.pickup}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-light">Delivery</label>
                      <p className="font-medium">{selectedJob.delivery}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-light">Distance</label>
                      <p className="font-medium">{selectedJob.distance} km</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-light">Estimated Time</label>
                      <p className="font-medium">{selectedJob.estimatedTime} hours</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Cargo Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <label className="text-sm font-medium text-text-light">Type</label>
                    <p className="font-medium">{selectedJob.cargo.type}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <label className="text-sm font-medium text-text-light">Weight</label>
                    <p className="font-medium">{selectedJob.cargo.weight} kg</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <label className="text-sm font-medium text-text-light">Volume</label>
                    <p className="font-medium">{selectedJob.cargo.volume} m³</p>
                  </div>
                </div>
                
                {selectedJob.cargo.specialRequirements.length > 0 && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-text-light">Special Requirements</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedJob.cargo.specialRequirements.map((req, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex gap-3">
                <Button className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Assign Vehicle
                </Button>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Job
                </Button>
                <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Cancel Job
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportationManagement;





