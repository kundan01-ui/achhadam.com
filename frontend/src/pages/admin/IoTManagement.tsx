import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Wifi,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Building
} from 'lucide-react';

interface IoTService {
  _id: string;
  serviceId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  serviceType: string;
  farmSize: number;
  location: {
    village: string;
    district: string;
    state: string;
  };
  sensorRequirements: {
    soilMoisture: boolean;
    soilPH: boolean;
    soilNPK: boolean;
    temperature: boolean;
    humidity: boolean;
    rainfall: boolean;
    lightIntensity: boolean;
  };
  servicePlan: {
    planType: string;
    duration: string;
    monthlyFee: number;
    maintenanceIncluded: boolean;
  };
  partnerCompany: {
    companyName: string;
    contactPerson: string;
    contactPhone: string;
    assignedTechnician: string;
  };
  status: string;
  requestedAt: string;
  urgency: string;
}

const IoTManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState<IoTService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('filter') || 'all');
  const [selectedService, setSelectedService] = useState<IoTService | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    loadServices();
  }, [statusFilter]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      const url = new URL('https://acchadam1-backend.onrender.com/api/admin/iot');
      if (statusFilter !== 'all') {
        url.searchParams.set('status', statusFilter);
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setServices(data.data);
      }
    } catch (error) {
      console.error('Error loading IoT services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPartner = async (serviceId: string, partnerData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://acchadam1-backend.onrender.com/api/admin/iot/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          partnerCompany: partnerData,
          status: 'in_progress'
        })
      });

      if (response.ok) {
        loadServices();
        setShowAssignModal(false);
        setSelectedService(null);
      }
    } catch (error) {
      console.error('Error assigning partner:', error);
    }
  };

  const handleUpdateStatus = async (serviceId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://acchadam1-backend.onrender.com/api/admin/iot/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        loadServices();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4" />;
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const filteredServices = services.filter(service =>
    service.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.farmerPhone.includes(searchTerm) ||
    service.serviceId.includes(searchTerm)
  );

  const AssignPartnerModal: React.FC<{ service: IoTService }> = ({ service }) => {
    const [partnerData, setPartnerData] = useState({
      companyName: '',
      contactPerson: '',
      contactPhone: '',
      assignedTechnician: ''
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Assign Partner Company</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={partnerData.companyName}
                onChange={(e) => setPartnerData({ ...partnerData, companyName: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="IoT Solutions Pvt Ltd"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
              <input
                type="text"
                value={partnerData.contactPerson}
                onChange={(e) => setPartnerData({ ...partnerData, contactPerson: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={partnerData.contactPhone}
                onChange={(e) => setPartnerData({ ...partnerData, contactPhone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Technician</label>
              <input
                type="text"
                value={partnerData.assignedTechnician}
                onChange={(e) => setPartnerData({ ...partnerData, assignedTechnician: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Technician Name"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedService(null);
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAssignPartner(service._id, partnerData)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Assign Partner
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ServiceDetailsModal: React.FC<{ service: IoTService }> = ({ service }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
        <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 my-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">IoT Service Details</h3>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Farmer Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="h-5 w-5" />
                Farmer Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{service.farmerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{service.farmerPhone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">
                    {service.location.village}, {service.location.district}, {service.location.state}
                  </p>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Service Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Service ID</p>
                  <p className="font-medium text-xs">{service.serviceId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service Type</p>
                  <p className="font-medium capitalize">{service.serviceType.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Farm Size</p>
                  <p className="font-medium">{service.farmSize} acres</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                    {getStatusIcon(service.status)}
                    {service.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Sensor Requirements */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Sensor Requirements</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(service.sensorRequirements).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Service Plan */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Service Plan</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Plan Type</p>
                  <p className="font-medium capitalize">{service.servicePlan.planType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{service.servicePlan.duration.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Fee</p>
                  <p className="font-medium text-green-600">₹{service.servicePlan.monthlyFee?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Maintenance</p>
                  <p className="font-medium">{service.servicePlan.maintenanceIncluded ? 'Included' : 'Not Included'}</p>
                </div>
              </div>
            </div>

            {/* Partner Company */}
            {service.partnerCompany?.companyName && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Assigned Partner
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium">{service.partnerCompany.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Person</p>
                    <p className="font-medium">{service.partnerCompany.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{service.partnerCompany.contactPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Technician</p>
                    <p className="font-medium">{service.partnerCompany.assignedTechnician}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              {service.status === 'pending' && (
                <button
                  onClick={() => {
                    setSelectedService(service);
                    setShowDetailsModal(false);
                    setShowAssignModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Assign Partner
                </button>
              )}
              {service.status === 'in_progress' && (
                <button
                  onClick={() => handleUpdateStatus(service._id, 'active')}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Mark as Active
                </button>
              )}
              {service.status === 'active' && (
                <button
                  onClick={() => handleUpdateStatus(service._id, 'completed')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Mark as Completed
                </button>
              )}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Wifi className="h-8 w-8 text-green-600" />
              IoT Service Management
            </h1>
            <p className="text-gray-500 mt-1">{services.length} total requests</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or service ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-12 text-center">
            <Wifi className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No IoT services found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{service.farmerName}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {service.farmerPhone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{service.location?.village}</p>
                      <p className="text-sm text-gray-500">{service.location?.district}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900 capitalize">{service.serviceType?.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-500">{service.farmSize} acres</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900 capitalize">{service.servicePlan?.planType}</p>
                      <p className="text-sm text-green-600">₹{service.servicePlan?.monthlyFee?.toLocaleString()}/mo</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                        {getStatusIcon(service.status)}
                        {service.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.partnerCompany?.companyName ? (
                        <div>
                          <p className="text-sm font-medium text-gray-900">{service.partnerCompany.companyName}</p>
                          <p className="text-sm text-gray-500">{service.partnerCompany.assignedTechnician}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedService(service);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {service.status === 'pending' && (
                          <button
                            onClick={() => {
                              setSelectedService(service);
                              setShowAssignModal(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Assign Partner"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDetailsModal && selectedService && <ServiceDetailsModal service={selectedService} />}
      {showAssignModal && selectedService && <AssignPartnerModal service={selectedService} />}
    </div>
  );
};

export default IoTManagement;
