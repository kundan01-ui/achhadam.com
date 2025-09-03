import React, { useState, useEffect } from 'react';
import ProfileModal from '../../components/ui/ProfileModal';
import { 
  LayoutDashboard, 
  Truck, 
  Package, 
  TrendingUp, 
  Users, 
  Settings, 
  Bell, 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  BarChart3,
  PieChart,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  Heart,
  Share2,
  MoreVertical,
  Menu,
  Clock,
  CheckCircle,
  Navigation,
  Fuel,
  Wrench,
  AlertTriangle,
  CheckSquare,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  User,
  ChevronDown,
  X,
  Home
} from 'lucide-react';

interface TransporterStats {
  totalDeliveries: number;
  activeDeliveries: number;
  completedDeliveries: number;
  totalEarnings: number;
  activeVehicles: number;
  pendingRequests: number;
}

interface Delivery {
  id: string;
  orderId: string;
  customer: string;
  pickupLocation: string;
  deliveryLocation: string;
  product: string;
  quantity: number;
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  assignedVehicle: string;
  driver: string;
  pickupDate: string;
  deliveryDate: string;
  distance: number;
  fare: number;
  priority: 'low' | 'medium' | 'high';
}

interface Vehicle {
  id: string;
  vehicleNumber: string;
  type: 'truck' | 'van' | 'pickup' | 'tractor';
  capacity: number;
  status: 'available' | 'busy' | 'maintenance' | 'offline';
  driver: string;
  location: string;
  fuelLevel: number;
  lastService: string;
  nextService: string;
  totalDeliveries: number;
  rating: number;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  experience: number;
  rating: number;
  status: 'available' | 'busy' | 'offline';
  currentLocation: string;
  totalDeliveries: number;
  vehicle: string;
}

const TransporterDashboard: React.FC<{ user?: any; onLogout?: () => void }> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock user profile data
  const [userProfile, setUserProfile] = useState({
    id: '1',
    name: user?.name || 'Vikram Singh',
    email: user?.email || 'vikram@transporter.com',
    phone: '+91 9876543210',
    userType: 'transporter' as const,
    address: 'Transport Hub, Industrial Area, Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    dateOfBirth: '1982-11-10',
    profileImage: '',
    businessName: 'Singh Transport Services',
    businessType: 'partnership',
    licenseNumber: 'DL-1234567890',
    experience: 15,
    kycStatus: 'verified' as const,
    aadharNumber: '4567-8901-2345',
    panNumber: 'PQRST5678D',
    bankAccountNumber: '4567890123456789',
    ifscCode: 'ICIC0001234',
    bankName: 'ICICI Bank',
    createdAt: '2024-01-01',
    lastLogin: new Date().toISOString()
  });

  // Mock data - replace with real API calls
  const [stats] = useState<TransporterStats>({
    totalDeliveries: 1247,
    activeDeliveries: 23,
    completedDeliveries: 1224,
    totalEarnings: 1850000,
    activeVehicles: 8,
    pendingRequests: 5
  });

  const [deliveries] = useState<Delivery[]>([
    {
      id: 'DEL-001',
      orderId: 'ORD-001',
      customer: 'Golden Grains Ltd.',
      pickupLocation: 'Punjab, India',
      deliveryLocation: 'Mumbai, Maharashtra',
      product: 'Wheat (500 kg)',
      quantity: 500,
      status: 'in_transit',
      assignedVehicle: 'MH-12-AB-1234',
      driver: 'Rajesh Kumar',
      pickupDate: '2024-01-15',
      deliveryDate: '2024-01-17',
      distance: 1200,
      fare: 15000,
      priority: 'high'
    },
    {
      id: 'DEL-002',
      orderId: 'ORD-002',
      customer: 'Fresh Harvest Co.',
      pickupLocation: 'Haryana, India',
      deliveryLocation: 'Delhi, India',
      product: 'Vegetables (200 kg)',
      quantity: 200,
      status: 'assigned',
      assignedVehicle: 'DL-01-CD-5678',
      driver: 'Amit Singh',
      pickupDate: '2024-01-16',
      deliveryDate: '2024-01-16',
      distance: 150,
      fare: 3500,
      priority: 'medium'
    },
    {
      id: 'DEL-003',
      orderId: 'ORD-003',
      customer: 'Green Valley Farms',
      pickupLocation: 'Uttar Pradesh, India',
      deliveryLocation: 'Bangalore, Karnataka',
      product: 'Organic Rice (300 kg)',
      quantity: 300,
      status: 'delivered',
      assignedVehicle: 'KA-05-EF-9012',
      driver: 'Suresh Patel',
      pickupDate: '2024-01-14',
      deliveryDate: '2024-01-16',
      distance: 1800,
      fare: 22000,
      priority: 'low'
    }
  ]);

  const [vehicles] = useState<Vehicle[]>([
    {
      id: '1',
      vehicleNumber: 'MH-12-AB-1234',
      type: 'truck',
      capacity: 1000,
      status: 'busy',
      driver: 'Rajesh Kumar',
      location: 'Mumbai, Maharashtra',
      fuelLevel: 75,
      lastService: '2024-01-01',
      nextService: '2024-02-01',
      totalDeliveries: 156,
      rating: 4.8
    },
    {
      id: '2',
      vehicleNumber: 'DL-01-CD-5678',
      type: 'van',
      capacity: 500,
      status: 'available',
      driver: 'Amit Singh',
      location: 'Delhi, India',
      fuelLevel: 90,
      lastService: '2024-01-10',
      nextService: '2024-02-10',
      totalDeliveries: 89,
      rating: 4.6
    },
    {
      id: '3',
      vehicleNumber: 'KA-05-EF-9012',
      type: 'truck',
      capacity: 800,
      status: 'maintenance',
      driver: 'Suresh Patel',
      location: 'Bangalore, Karnataka',
      fuelLevel: 45,
      lastService: '2024-01-15',
      nextService: '2024-02-15',
      totalDeliveries: 234,
      rating: 4.9
    }
  ]);

  const [drivers] = useState<Driver[]>([
    {
      id: '1',
      name: 'Rajesh Kumar',
      phone: '+91 9876543210',
      licenseNumber: 'DL-1234567890',
      experience: 8,
      rating: 4.8,
      status: 'busy',
      currentLocation: 'Mumbai, Maharashtra',
      totalDeliveries: 156,
      vehicle: 'MH-12-AB-1234'
    },
    {
      id: '2',
      name: 'Amit Singh',
      phone: '+91 9876543211',
      licenseNumber: 'DL-1234567891',
      experience: 5,
      rating: 4.6,
      status: 'available',
      currentLocation: 'Delhi, India',
      totalDeliveries: 89,
      vehicle: 'DL-01-CD-5678'
    },
    {
      id: '3',
      name: 'Suresh Patel',
      phone: '+91 9876543212',
      licenseNumber: 'DL-1234567892',
      experience: 12,
      rating: 4.9,
      status: 'offline',
      currentLocation: 'Bangalore, Karnataka',
      totalDeliveries: 234,
      vehicle: 'KA-05-EF-9012'
    }
  ]);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'text-blue-600' },
    { id: 'deliveries', label: 'Deliveries', icon: Package, color: 'text-green-600' },
    { id: 'vehicles', label: 'Vehicles', icon: Truck, color: 'text-purple-600' },
    { id: 'drivers', label: 'Drivers', icon: Users, color: 'text-orange-600' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'text-indigo-600' },
    { id: 'routes', label: 'Routes', icon: Navigation, color: 'text-red-600' },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, color: 'text-yellow-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'in_transit': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVehicleStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderOverview = () => (
    <div className="space-y-4">
      {/* Stats Cards - Perfect Mobile Design */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {/* Total Deliveries */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Total Deliveries</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</p>
          </div>
        </div>

        {/* Active Deliveries */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Active Deliveries</p>
            <p className="text-2xl font-bold text-orange-600">{stats.activeDeliveries}</p>
          </div>
        </div>

        {/* Completed Deliveries */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completedDeliveries}</p>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Total Earnings</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
          </div>
        </div>

        {/* Active Vehicles */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
              <Truck className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Active Vehicles</p>
            <p className="text-2xl font-bold text-indigo-600">{stats.activeVehicles}</p>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mb-1">Pending Requests</p>
            <p className="text-2xl font-bold text-red-600">{stats.pendingRequests}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions - Perfect Mobile Design */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors min-h-[100px]">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-700 text-center">New Delivery</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors min-h-[100px]">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-700 text-center">Track Route</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors min-h-[100px]">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <Truck className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-700 text-center">Manage Fleet</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors min-h-[100px]">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-3">
              <BarChart3 className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-orange-700 text-center">Analytics</span>
          </button>
        </div>
      </div>

      {/* Recent Deliveries */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Deliveries</h3>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fare
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {delivery.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {delivery.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="text-xs text-gray-500">From: {delivery.pickupLocation}</div>
                      <div className="text-xs text-gray-500">To: {delivery.deliveryLocation}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {delivery.assignedVehicle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(delivery.status)}`}>
                      {delivery.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(delivery.fare)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-700">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vehicle Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Vehicle Status</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{vehicle.vehicleNumber}</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVehicleStatusColor(vehicle.status)}`}>
                    {vehicle.status.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Type:</span>
                    <span className="font-medium">{vehicle.type.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Capacity:</span>
                    <span className="font-medium">{vehicle.capacity} kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Driver:</span>
                    <span className="font-medium">{vehicle.driver}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Fuel:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${vehicle.fuelLevel > 50 ? 'bg-green-500' : vehicle.fuelLevel > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${vehicle.fuelLevel}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{vehicle.fuelLevel}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeliveries = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Deliveries</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>New Delivery</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search deliveries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Deliveries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{delivery.id}</h3>
                  <p className="text-sm text-gray-600">{delivery.customer}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(delivery.status)}`}>
                    {delivery.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(delivery.priority)}`}>
                    {delivery.priority.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{delivery.pickupLocation} → {delivery.deliveryLocation}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>{delivery.product}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4" />
                  <span>{delivery.assignedVehicle}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{delivery.driver}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{delivery.distance} km</div>
                  <div className="text-sm text-gray-500">Distance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(delivery.fare)}</div>
                  <div className="text-sm text-gray-500">Fare</div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Eye className="h-4 w-4" />
                  <span>Track</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Edit className="h-4 w-4" />
                  <span>Update</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVehicles = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Vehicles</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{vehicle.vehicleNumber}</h3>
                  <p className="text-sm text-gray-600">{vehicle.type.toUpperCase()} • {vehicle.capacity} kg</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVehicleStatusColor(vehicle.status)}`}>
                  {vehicle.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Driver:</span>
                  <span className="font-medium">{vehicle.driver}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{vehicle.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Deliveries:</span>
                  <span className="font-medium">{vehicle.totalDeliveries}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{vehicle.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-100">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Fuel Level</span>
                    <span className="font-medium">{vehicle.fuelLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${vehicle.fuelLevel > 50 ? 'bg-green-500' : vehicle.fuelLevel > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${vehicle.fuelLevel}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Last Service:</span>
                    <div className="font-medium">{new Date(vehicle.lastService).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Next Service:</span>
                    <div className="font-medium">{new Date(vehicle.nextService).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Wrench className="h-4 w-4" />
                  <span>Service</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDrivers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Drivers</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Driver</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {drivers.map((driver) => (
          <div key={driver.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{driver.name}</h3>
                  <p className="text-sm text-gray-600">License: {driver.licenseNumber}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVehicleStatusColor(driver.status)}`}>
                  {driver.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium">{driver.experience} years</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{driver.phone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium">{driver.vehicle}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Deliveries:</span>
                  <span className="font-medium">{driver.totalDeliveries}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{driver.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{driver.currentLocation}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Phone className="h-4 w-4" />
                  <span>Call</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const handleUpdateProfile = (updatedProfile: any) => {
    setUserProfile(updatedProfile);
    // Here you would typically make an API call to update the profile
    console.log('Profile updated:', updatedProfile);
  };

  const handleDeleteAccount = () => {
    // Here you would typically make an API call to delete the account
    console.log('Account deletion requested');
    alert('Account deletion feature will be implemented with backend integration');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'deliveries':
        return renderDeliveries();
      case 'vehicles':
        return renderVehicles();
      case 'drivers':
        return renderDrivers();
      case 'analytics':
        return <div className="text-center py-12"><h3 className="text-lg font-semibold text-gray-900">Analytics Page - Coming Soon</h3></div>;
      case 'routes':
        return <div className="text-center py-12"><h3 className="text-lg font-semibold text-gray-900">Routes Page - Coming Soon</h3></div>;
      case 'maintenance':
        return <div className="text-center py-12"><h3 className="text-lg font-semibold text-gray-900">Maintenance Page - Coming Soon</h3></div>;
      case 'settings':
        return <div className="text-center py-12"><h3 className="text-lg font-semibold text-gray-900">Settings Page - Coming Soon</h3></div>;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              
              {/* Desktop Sidebar Toggle */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Transporter Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search - Hidden on mobile */}
              <div className="hidden sm:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User Profile - Mobile Optimized */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* User Info - Hidden on mobile */}
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-32">{userProfile.name}</p>
                  <p className="text-xs text-gray-500 truncate max-w-32">{userProfile.email}</p>
                  <p className="text-xs text-purple-600 font-medium">TRANSPORTER</p>
                </div>
                
                {/* User Avatar & Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">T</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-600 hidden sm:block" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                        <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                        <p className="text-xs text-gray-500">{userProfile.email}</p>
                        <p className="text-xs text-purple-600 font-medium">TRANSPORTER</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowProfileModal(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>View Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileModal(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </button>
                      <hr className="my-2" />
                      {onLogout && (
                        <button
                          onClick={() => {
                            onLogout();
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <span>Logout</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:block ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-sm border-r border-gray-200 transition-all duration-300`}>
          <nav className="p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
                      {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                            activeTab === item.id
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-6">
          {renderContent()}
        </main>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={userProfile}
        onUpdate={handleUpdateProfile}
        onDeleteAccount={handleDeleteAccount}
        onLogout={() => {
          setShowProfileModal(false);
          if (onLogout) onLogout();
        }}
      />
    </div>
  );
};

export default TransporterDashboard;