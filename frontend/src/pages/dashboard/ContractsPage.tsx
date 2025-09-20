import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Download, 
  Trash2, 
  Calendar,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MoreVertical,
  Send,
  MessageCircle,
  Star
} from 'lucide-react';

interface Contract {
  id: string;
  title: string;
  supplier: string;
  supplierId: string;
  type: 'annual' | 'quarterly' | 'monthly' | 'spot';
  status: 'draft' | 'pending' | 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  totalValue: number;
  remainingValue: number;
  products: string[];
  terms: string;
  signedDate?: string;
  expiryDate?: string;
  lastModified: string;
  createdBy: string;
}

const ContractsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [contracts] = useState<Contract[]>([
    {
      id: 'CNT-001',
      title: 'Annual Grain Supply Contract',
      supplier: 'Golden Grains Ltd.',
      supplierId: 'SUP-001',
      type: 'annual',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      totalValue: 1200000,
      remainingValue: 800000,
      products: ['Basmati Rice', 'Wheat', 'Corn'],
      terms: 'Monthly delivery, 30 days payment terms',
      signedDate: '2023-12-15',
      expiryDate: '2024-12-31',
      lastModified: '2024-01-15',
      createdBy: 'John Doe'
    },
    {
      id: 'CNT-002',
      title: 'Quarterly Vegetable Supply',
      supplier: 'Fresh Harvest Co.',
      supplierId: 'SUP-002',
      type: 'quarterly',
      status: 'pending',
      startDate: '2024-02-01',
      endDate: '2024-04-30',
      totalValue: 450000,
      remainingValue: 450000,
      products: ['Tomatoes', 'Onions', 'Potatoes'],
      terms: 'Weekly delivery, 15 days payment terms',
      lastModified: '2024-01-20',
      createdBy: 'John Doe'
    },
    {
      id: 'CNT-003',
      title: 'Monthly Organic Products',
      supplier: 'Green Valley Farms',
      supplierId: 'SUP-003',
      type: 'monthly',
      status: 'draft',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      totalValue: 180000,
      remainingValue: 180000,
      products: ['Organic Wheat', 'Organic Rice'],
      terms: 'Bi-weekly delivery, 20 days payment terms',
      lastModified: '2024-01-25',
      createdBy: 'John Doe'
    },
    {
      id: 'CNT-004',
      title: 'Spot Purchase Agreement',
      supplier: 'Premium Foods',
      supplierId: 'SUP-004',
      type: 'spot',
      status: 'expired',
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      totalValue: 75000,
      remainingValue: 0,
      products: ['Spices', 'Pulses'],
      terms: 'One-time delivery, immediate payment',
      signedDate: '2023-11-25',
      expiryDate: '2023-12-31',
      lastModified: '2023-12-31',
      createdBy: 'John Doe'
    }
  ]);

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.products.some(product => product.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || contract.status === selectedStatus;
    const matchesType = selectedType === 'all' || contract.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return FileText;
      case 'pending': return Clock;
      case 'active': return CheckCircle;
      case 'expired': return XCircle;
      case 'cancelled': return XCircle;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'bg-blue-100 text-blue-800';
      case 'quarterly': return 'bg-purple-100 text-purple-800';
      case 'monthly': return 'bg-green-100 text-green-800';
      case 'spot': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (total: number, remaining: number) => {
    return ((total - remaining) / total) * 100;
  };

  const createContract = () => {
    console.log('Create new contract');
  };

  const viewContract = (contractId: string) => {
    console.log('View contract:', contractId);
  };

  const editContract = (contractId: string) => {
    console.log('Edit contract:', contractId);
  };

  const deleteContract = (contractId: string) => {
    console.log('Delete contract:', contractId);
  };

  const sendForApproval = (contractId: string) => {
    console.log('Send for approval:', contractId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contracts</h2>
          <p className="text-gray-600">Manage your supplier contracts and agreements</p>
        </div>
        <button
          onClick={createContract}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Contract</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search contracts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="annual">Annual</option>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
            <option value="spot">Spot</option>
          </select>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredContracts.map((contract) => {
          const StatusIcon = getStatusIcon(contract.status);
          const progress = calculateProgress(contract.totalValue, contract.remainingValue);
          
          return (
            <div key={contract.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
              {/* Contract Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{contract.title}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(contract.type)}`}>
                        {contract.type.charAt(0).toUpperCase() + contract.type.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{contract.supplier}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusIcon className="h-4 w-4 text-gray-400" />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                        {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-gray-600 text-sm mb-4">{contract.terms}</p>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Start: {new Date(contract.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>End: {new Date(contract.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Contract Value */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Contract Value</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(contract.totalValue)}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Remaining</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(contract.remainingValue)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {progress.toFixed(0)}% completed
                </div>
              </div>

              {/* Products */}
              <div className="p-6 border-b border-gray-100">
                <h4 className="font-medium text-gray-900 mb-3">Products</h4>
                <div className="flex flex-wrap gap-2">
                  {contract.products.map((product, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="p-6">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => viewContract(contract.id)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  {contract.status === 'draft' && (
                    <button 
                      onClick={() => editContract(contract.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  )}
                  {contract.status === 'draft' && (
                    <button 
                      onClick={() => sendForApproval(contract.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Send className="h-4 w-4" />
                      <span>Send</span>
                    </button>
                  )}
                  {contract.status === 'active' && (
                    <button 
                      onClick={() => viewContract(contract.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Message</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredContracts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No contracts found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedStatus !== 'all' || selectedType !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Start by creating your first contract with a supplier'
            }
          </p>
          {!searchQuery && selectedStatus === 'all' && selectedType === 'all' && (
            <button
              onClick={createContract}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Contract
            </button>
          )}
        </div>
      )}

      {/* Quick Stats */}
      {filteredContracts.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {contracts.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-gray-500">Active Contracts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {contracts.filter(c => c.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-500">Pending Approval</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(contracts.reduce((sum, c) => sum + c.totalValue, 0))}
              </div>
              <div className="text-sm text-gray-500">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {contracts.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-gray-500">Active Suppliers</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractsPage;









