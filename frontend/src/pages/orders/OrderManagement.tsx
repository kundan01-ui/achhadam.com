import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui';
import type { SelectOption } from '../../components/ui';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  supplier: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: {
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryCost: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  trackingNumber?: string;
  specialInstructions?: string;
}

const OrderManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mock orders data
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      customerName: 'Amit Sharma',
      customerEmail: 'amit.sharma@email.com',
      customerPhone: '+91 98765 43210',
      deliveryAddress: {
        addressLine1: '123 Main Street',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
      },
      items: [
        {
          productId: '1',
          productName: 'Organic Durum Wheat',
          quantity: 2,
          unit: 'kg',
          price: 45.00,
          supplier: 'Rajesh Kumar Farms'
        },
        {
          productId: '2',
          productName: 'Fresh Tomatoes',
          quantity: 1,
          unit: 'kg',
          price: 35.00,
          supplier: 'Green Valley Farms'
        }
      ],
      subtotal: 125.00,
      deliveryCost: 0,
      total: 125.00,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      orderDate: '2024-01-15T10:30:00Z',
      estimatedDelivery: '2024-01-18T18:00:00Z',
      actualDelivery: '2024-01-18T16:30:00Z',
      trackingNumber: 'TRK123456789'
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      customerName: 'Priya Patel',
      customerEmail: 'priya.patel@email.com',
      customerPhone: '+91 87654 32109',
      deliveryAddress: {
        addressLine1: '456 Park Avenue',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      items: [
        {
          productId: '3',
          productName: 'Basmati Rice',
          quantity: 3,
          unit: 'kg',
          price: 120.00,
          supplier: 'Fresh Harvest Co.'
        }
      ],
      subtotal: 360.00,
      deliveryCost: 100,
      total: 460.00,
      status: 'shipped',
      paymentStatus: 'paid',
      paymentMethod: 'UPI',
      orderDate: '2024-01-20T14:15:00Z',
      estimatedDelivery: '2024-01-22T18:00:00Z',
      trackingNumber: 'TRK987654321'
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      customerName: 'Rajesh Kumar',
      customerEmail: 'rajesh.kumar@email.com',
      customerPhone: '+91 76543 21098',
      deliveryAddress: {
        addressLine1: '789 Lake Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
      },
      items: [
        {
          productId: '4',
          productName: 'Sweet Corn',
          quantity: 2,
          unit: 'kg',
          price: 25.00,
          supplier: 'Organic Paradise'
        },
        {
          productId: '5',
          productName: 'Green Peas',
          quantity: 1,
          unit: 'kg',
          price: 40.00,
          supplier: 'Fresh Foods Co.'
        }
      ],
      subtotal: 90.00,
      deliveryCost: 0,
      total: 90.00,
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: 'Net Banking',
      orderDate: '2024-01-22T09:45:00Z',
      estimatedDelivery: '2024-01-25T18:00:00Z'
    }
  ];

  const statusOptions: SelectOption[] = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateOptions: SelectOption[] = [
    { value: '', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesDate = !dateFilter || true; // Implement date filtering logic

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;

    return { total, pending, processing, shipped, delivered };
  };

  const stats = getOrderStats();

  return (
    <DashboardLayout
      role="buyer"
      userName="Amit Sharma"
      userAvatar=""
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">Order Management 📦</h1>
        <p className="text-text-light">Track and manage your orders</p>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary-green">{stats.total}</div>
            <div className="text-sm text-text-light">Total Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-text-light">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.processing}</div>
            <div className="text-sm text-text-light">Processing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.shipped}</div>
            <div className="text-sm text-text-light">Shipped</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <div className="text-sm text-text-light">Delivered</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search orders by number, customer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            <div className="flex items-center space-x-3">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filter by status"
                size="sm"
              />
              <Select
                options={dateOptions}
                value={dateFilter}
                onChange={setDateFilter}
                placeholder="Filter by date"
                size="sm"
              />
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-card-hover transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                {/* Order Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-text-dark">
                      {order.orderNumber}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-text-light">Customer:</span>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-text-light">{order.customerEmail}</div>
                    </div>
                    <div>
                      <span className="text-text-light">Order Date:</span>
                      <div className="font-medium">{formatDate(order.orderDate)}</div>
                    </div>
                    <div>
                      <span className="text-text-light">Delivery:</span>
                      <div className="font-medium">{formatDate(order.estimatedDelivery)}</div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="text-text-light">Items:</span>
                    <div className="font-medium">
                      {order.items.length} product{order.items.length !== 1 ? 's' : ''} • Total: {formatPrice(order.total)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewOrder(order)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Invoice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-dark mb-2">No orders found</h3>
              <p className="text-text-light mb-4">
                Try adjusting your search criteria or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-agricultural max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-dark">
                  Order Details - {selectedOrder.orderNumber}
                </h2>
                <Button variant="outline" onClick={handleCloseOrderDetails}>
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Information */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-text-light">Order Number:</span>
                        <span className="font-medium">{selectedOrder.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-light">Order Date:</span>
                        <span className="font-medium">{formatDate(selectedOrder.orderDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-light">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-light">Payment Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-light">Payment Method:</span>
                        <span className="font-medium">{selectedOrder.paymentMethod}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="text-text-light">Name:</span>
                        <div className="font-medium">{selectedOrder.customerName}</div>
                      </div>
                      <div>
                        <span className="text-text-light">Email:</span>
                        <div className="font-medium">{selectedOrder.customerEmail}</div>
                      </div>
                      <div>
                        <span className="text-text-light">Phone:</span>
                        <div className="font-medium">{selectedOrder.customerPhone}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Delivery and Items */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Delivery Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="text-text-light">Address:</span>
                        <div className="font-medium">
                          {selectedOrder.deliveryAddress.addressLine1}<br />
                          {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} {selectedOrder.deliveryAddress.pincode}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-light">Estimated Delivery:</span>
                        <span className="font-medium">{formatDate(selectedOrder.estimatedDelivery)}</span>
                      </div>
                      {selectedOrder.actualDelivery && (
                        <div className="flex justify-between">
                          <span className="text-text-light">Actual Delivery:</span>
                          <span className="font-medium">{formatDate(selectedOrder.actualDelivery)}</span>
                        </div>
                      )}
                      {selectedOrder.trackingNumber && (
                        <div className="flex justify-between">
                          <span className="text-text-light">Tracking Number:</span>
                          <span className="font-medium">{selectedOrder.trackingNumber}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                            <div>
                              <div className="font-medium">{item.productName}</div>
                              <div className="text-sm text-text-light">
                                {item.quantity} {item.unit} • {item.supplier}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
                              <div className="text-sm text-text-light">{formatPrice(item.price)} per {item.unit}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t pt-4 mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{formatPrice(selectedOrder.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery:</span>
                          <span>{selectedOrder.deliveryCost === 0 ? 'Free' : formatPrice(selectedOrder.deliveryCost)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span className="text-primary-green">{formatPrice(selectedOrder.total)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default OrderManagement;






