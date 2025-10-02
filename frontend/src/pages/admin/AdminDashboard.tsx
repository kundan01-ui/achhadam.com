import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wifi,
  Plane,
  Sprout,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  Filter,
  Download,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface ServiceStats {
  iot: { total: number; pending: number; active: number; completed: number };
  drone: { total: number; pending: number; active: number; completed: number };
  seeds: { total: number; pending: number; active: number; completed: number };
  advisory: { total: number; pending: number; active: number; completed: number };
}

interface RecentRequest {
  id: string;
  type: 'iot' | 'drone' | 'seeds' | 'advisory';
  farmerName: string;
  farmerPhone: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  requestedAt: string;
  urgency?: string;
  amount?: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState<ServiceStats>({
    iot: { total: 0, pending: 0, active: 0, completed: 0 },
    drone: { total: 0, pending: 0, active: 0, completed: 0 },
    seeds: { total: 0, pending: 0, active: 0, completed: 0 },
    advisory: { total: 0, pending: 0, active: 0, completed: 0 }
  });
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch all service statistics
      const response = await fetch('https://acchadam1-backend.onrender.com/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentRequests(data.recentRequests);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'iot': return <Wifi className="h-5 w-5" />;
      case 'drone': return <Plane className="h-5 w-5" />;
      case 'seeds': return <Sprout className="h-5 w-5" />;
      case 'advisory': return <MessageSquare className="h-5 w-5" />;
      default: return null;
    }
  };

  const totalRequests = stats.iot.total + stats.drone.total + stats.seeds.total + stats.advisory.total;
  const pendingRequests = stats.iot.pending + stats.drone.pending + stats.seeds.pending + stats.advisory.pending;
  const activeRequests = stats.iot.active + stats.drone.active + stats.seeds.active + stats.advisory.active;
  const completedRequests = stats.iot.completed + stats.drone.completed + stats.seeds.completed + stats.advisory.completed;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed h-full">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-green-600">Achhadam Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Service Management</p>
        </div>

        <nav className="p-4">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeSection === 'dashboard'
                ? 'bg-green-50 text-green-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/admin/iot')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Wifi className="h-5 w-5" />
            <span className="font-medium">IoT Services</span>
            {stats.iot.pending > 0 && (
              <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                {stats.iot.pending}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate('/admin/drone')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Plane className="h-5 w-5" />
            <span className="font-medium">Drone Services</span>
            {stats.drone.pending > 0 && (
              <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                {stats.drone.pending}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate('/admin/seeds')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Sprout className="h-5 w-5" />
            <span className="font-medium">Seeds Orders</span>
            {stats.seeds.pending > 0 && (
              <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                {stats.seeds.pending}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate('/admin/advisory')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="font-medium">Advisory</span>
            {stats.advisory.pending > 0 && (
              <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                {stats.advisory.pending}
              </span>
            )}
          </button>

          <div className="border-t my-4"></div>

          <button
            onClick={() => navigate('/admin/farmers')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Users className="h-5 w-5" />
            <span className="font-medium">Farmers</span>
          </button>

          <button
            onClick={() => navigate('/admin/settings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
            <p className="text-gray-500 mt-1">Service requests and analytics</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="relative p-2 bg-white border rounded-lg hover:bg-gray-50">
              <Bell className="h-5 w-5" />
              {pendingRequests > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {pendingRequests}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <LayoutDashboard className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{totalRequests}</h3>
            <p className="text-sm text-gray-500 mt-1">All Requests</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-500">Pending</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{pendingRequests}</h3>
            <p className="text-sm text-gray-500 mt-1">Awaiting Action</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Active</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{activeRequests}</h3>
            <p className="text-sm text-gray-500 mt-1">In Progress</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Completed</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{completedRequests}</h3>
            <p className="text-sm text-gray-500 mt-1">Finished</p>
          </div>
        </div>

        {/* Service Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Wifi className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">IoT Monitoring</p>
                    <p className="text-sm text-gray-500">{stats.iot.total} total requests</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-yellow-600">{stats.iot.pending} pending</p>
                  <p className="text-sm text-gray-500">{stats.iot.active} active</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Plane className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Drone Services</p>
                    <p className="text-sm text-gray-500">{stats.drone.total} total requests</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-yellow-600">{stats.drone.pending} pending</p>
                  <p className="text-sm text-gray-500">{stats.drone.active} active</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Sprout className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">Seeds & Fertilizers</p>
                    <p className="text-sm text-gray-500">{stats.seeds.total} total orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-yellow-600">{stats.seeds.pending} pending</p>
                  <p className="text-sm text-gray-500">{stats.seeds.active} active</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Advisory Services</p>
                    <p className="text-sm text-gray-500">{stats.advisory.total} consultations</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-yellow-600">{stats.advisory.pending} pending</p>
                  <p className="text-sm text-gray-500">{stats.advisory.active} active</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/iot?filter=pending')}
                className="w-full p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Review Pending IoT Requests</p>
                    <p className="text-sm text-gray-500">{stats.iot.pending} requests waiting</p>
                  </div>
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/drone?filter=urgent')}
                className="w-full p-4 bg-red-50 hover:bg-red-100 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Urgent Drone Requests</p>
                    <p className="text-sm text-gray-500">High priority bookings</p>
                  </div>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/seeds?filter=pending')}
                className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Process Seed Orders</p>
                    <p className="text-sm text-gray-500">{stats.seeds.pending} orders to process</p>
                  </div>
                  <Sprout className="h-5 w-5 text-green-600" />
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/advisory?filter=pending')}
                className="w-full p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Answer Consultations</p>
                    <p className="text-sm text-gray-500">{stats.advisory.pending} farmers waiting</p>
                  </div>
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Requests</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading requests...</p>
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="p-12 text-center">
              <LayoutDashboard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent requests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentRequests.slice(0, 10).map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getServiceIcon(request.type)}
                          <span className="text-sm font-medium text-gray-900 capitalize">{request.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{request.farmerName}</p>
                          <p className="text-sm text-gray-500">{request.farmerPhone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {request.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.requestedAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.amount ? `₹${request.amount.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => navigate(`/admin/${request.type}/${request.id}`)}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
