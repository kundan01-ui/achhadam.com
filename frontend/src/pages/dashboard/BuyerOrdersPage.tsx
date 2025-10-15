import React, { useState, useEffect } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  Download,
  Eye,
  RefreshCw,
  Filter,
  Search,
  DollarSign,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { apiConfig } from '../../config/apiConfig';

interface Order {
  _id: string;
  orderId: string;
  farmerId: {
    _id: string;
    firstName: string;
    lastName: string;
    farmName?: string;
  };
  listingId: {
    _id: string;
    cropName: string;
    category: string;
    imageUrl?: string;
  };
  orderDetails: {
    cropName: string;
    variety?: string;
    quality?: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    totalAmount: number;
    currency: string;
  };
  delivery: {
    type: string;
    deliveryAddress?: any;
    deliveryCharges: number;
    estimatedDeliveryDate?: string;
  };
  payment: {
    method: string;
    status: string;
    amount: number;
    currency: string;
    transactionId?: string;
    paymentDate?: string;
  };
  status: {
    current: string;
    history: Array<{
      status: string;
      timestamp: string;
      note?: string;
      updatedBy: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

const BuyerOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, selectedStatus, searchQuery]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      // Get buyer ID from userData
      const userDataStr = localStorage.getItem('userData');
      if (!userDataStr) {
        console.error('No user data found in localStorage');
        return;
      }

      const userData = JSON.parse(userDataStr);
      const buyerId = userData._id || userData.id;

      if (!buyerId) {
        console.error('No buyer ID found in user data');
        return;
      }

      console.log('📦 Fetching orders for buyer:', buyerId);

      const response = await fetch(apiConfig.buildURL(`/api/orders/buyer/${buyerId}`), {
        method: 'GET',
        headers: apiConfig.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Orders fetched successfully:', result);

      if (result.success && result.data) {
        setOrders(result.data);
      }

    } catch (error: any) {
      console.error('❌ Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => {
        if (selectedStatus === 'pending') {
          return ['pending', 'confirmed', 'preparing'].includes(order.status.current);
        }
        if (selectedStatus === 'in_progress') {
          return ['ready_for_pickup', 'picked_up', 'in_transit'].includes(order.status.current);
        }
        if (selectedStatus === 'completed') {
          return order.status.current === 'delivered';
        }
        if (selectedStatus === 'cancelled') {
          return ['cancelled', 'returned'].includes(order.status.current);
        }
        return true;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(query) ||
        order.orderDetails.cropName.toLowerCase().includes(query) ||
        order.farmerId?.farmName?.toLowerCase().includes(query) ||
        `${order.farmerId?.firstName} ${order.farmerId?.lastName}`.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready_for_pickup: 'bg-indigo-100 text-indigo-800',
      picked_up: 'bg-cyan-100 text-cyan-800',
      in_transit: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      pending: <Clock className="h-4 w-4" />,
      confirmed: <CheckCircle2 className="h-4 w-4" />,
      preparing: <Package className="h-4 w-4" />,
      ready_for_pickup: <Package className="h-4 w-4" />,
      picked_up: <Truck className="h-4 w-4" />,
      in_transit: <Truck className="h-4 w-4" />,
      delivered: <CheckCircle className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />,
      returned: <AlertCircle className="h-4 w-4" />
    };
    return icons[status] || <Package className="h-4 w-4" />;
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  // Calculate summary stats
  const summary = {
    total: orders.length,
    pending: orders.filter(o => ['pending', 'confirmed', 'preparing'].includes(o.status.current)).length,
    inProgress: orders.filter(o => ['ready_for_pickup', 'picked_up', 'in_transit'].includes(o.status.current)).length,
    completed: orders.filter(o => o.status.current === 'delivered').length,
    cancelled: orders.filter(o => ['cancelled', 'returned'].includes(o.status.current)).length,
    totalSpent: orders.reduce((sum, o) => o.payment.status === 'paid' ? sum + o.payment.amount : sum, 0)
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
          <p className="text-gray-600">Track and manage your orders with complete transaction history</p>
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{summary.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-orange-600">{summary.inProgress}</p>
            </div>
            <Truck className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{summary.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{summary.cancelled}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-lg font-bold text-blue-600">{formatCurrency(summary.totalSpent)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID, Crop, or Farmer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
          <p className="text-gray-600">
            {searchQuery || selectedStatus !== 'all'
              ? 'Try adjusting your filters or search query'
              : 'Start shopping to see your orders here'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Order Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">{order.orderDetails.cropName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status.current)}`}>
                            {getStatusIcon(order.status.current)}
                            <span className="capitalize">{order.status.current.replace('_', ' ')}</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Order ID: {order.orderId}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Ordered: {formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Package className="h-4 w-4" />
                        <span>Quantity: {order.orderDetails.quantity} {order.orderDetails.unit}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>From: {order.farmerId?.farmName || `${order.farmerId?.firstName} ${order.farmerId?.lastName}`}</span>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">
                          {order.payment.method.toUpperCase()}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment.status)}`}>
                        {order.payment.status === 'paid' ? '✓ Paid' : order.payment.status.toUpperCase()}
                      </span>
                      {order.payment.transactionId && (
                        <span className="text-xs text-gray-500">
                          Txn: {order.payment.transactionId.substring(0, 12)}...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex flex-col items-end space-y-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(order.payment.amount)}</p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(order.orderDetails.pricePerUnit)}/{order.orderDetails.unit}
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Order Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Order ID</p>
                    <p className="font-medium">{selectedOrder.orderId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Order Date</p>
                    <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Crop</p>
                    <p className="font-medium">{selectedOrder.orderDetails.cropName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Quantity</p>
                    <p className="font-medium">{selectedOrder.orderDetails.quantity} {selectedOrder.orderDetails.unit}</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Payment Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-medium">{selectedOrder.payment.method.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.payment.status)}`}>
                      {selectedOrder.payment.status.toUpperCase()}
                    </span>
                  </div>
                  {selectedOrder.payment.transactionId && (
                    <div className="col-span-2">
                      <p className="text-gray-600">Transaction ID</p>
                      <p className="font-medium font-mono text-xs">{selectedOrder.payment.transactionId}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600">Item Total</p>
                    <p className="font-medium">{formatCurrency(selectedOrder.orderDetails.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Delivery Charges</p>
                    <p className="font-medium">{formatCurrency(selectedOrder.delivery.deliveryCharges)}</p>
                  </div>
                  <div className="col-span-2 border-t pt-2">
                    <p className="text-gray-600">Total Amount</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedOrder.payment.amount)}</p>
                  </div>
                </div>
              </div>

              {/* Status History */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Order Timeline</h4>
                <div className="space-y-3">
                  {selectedOrder.status.history.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`mt-1 p-2 rounded-full ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 capitalize">{item.status.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-600">{item.note}</p>
                        <p className="text-xs text-gray-500">{formatDate(item.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="h-4 w-4" />
                <span>Download Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerOrdersPage;
