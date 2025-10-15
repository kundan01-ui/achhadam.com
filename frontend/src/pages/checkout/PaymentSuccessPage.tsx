import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiConfig } from '../../config/apiConfig';
import jsPDF from 'jspdf';

interface Order {
  _id: string;
  orderId: string;
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
  payment: {
    method: string;
    status: string;
    amount: number;
    currency: string;
    transactionId?: string;
    paymentDate?: string;
  };
  delivery: {
    type: string;
    deliveryAddress?: {
      address: string;
      city: string;
      state: string;
      pincode: string;
      contactPerson: string;
      contactPhone: string;
    };
    pickupAddress?: {
      address: string;
      city: string;
      state: string;
    };
    deliveryCharges: number;
    estimatedDeliveryDate?: string;
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
  farmerId?: {
    firstName: string;
    lastName: string;
    phone?: string;
  };
  buyerId?: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);

      // First try to load from localStorage
      const localOrderKey = `order_${orderId}`;
      const localOrder = localStorage.getItem(localOrderKey);

      if (localOrder) {
        console.log('✅ Loading order from localStorage');
        const orderData = JSON.parse(localOrder);
        setOrder(orderData);
        setLoading(false);
        return;
      }

      // If not in localStorage, try API
      console.log('📡 Loading order from API');
      const response = await fetch(
        apiConfig.buildURL(`/api/orders/${orderId}`),
        { headers: apiConfig.getAuthHeaders() }
      );

      const result = await response.json();

      if (result.success && result.data) {
        setOrder(result.data);
      } else {
        console.error('Order not found in API');
        alert('Order not found');
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to load order:', error);
      alert('Failed to load order details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async () => {
    if (!order) return;

    try {
      setDownloadingReceipt(true);

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Header - Company Logo and Name
      doc.setFillColor(22, 163, 74); // Green color
      doc.rect(0, 0, pageWidth, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('ACHHADAM', pageWidth / 2, 20, { align: 'center' });

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Farm to Market Platform', pageWidth / 2, 30, { align: 'center' });

      // Reset text color for body
      doc.setTextColor(0, 0, 0);

      // Payment Receipt Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('PAYMENT RECEIPT', pageWidth / 2, 55, { align: 'center' });

      // Success Checkmark
      doc.setFillColor(22, 163, 74);
      doc.circle(pageWidth / 2, 75, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text('✓', pageWidth / 2, 78, { align: 'center' });
      doc.setTextColor(0, 0, 0);

      // Payment Status
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      const statusColor = order.payment.status === 'paid' ? '#16A34A' : '#F59E0B';
      doc.setTextColor(22, 163, 74);
      doc.text(
        order.payment.status === 'paid' ? 'Payment Successful' : 'Payment Pending',
        pageWidth / 2,
        92,
        { align: 'center' }
      );
      doc.setTextColor(0, 0, 0);

      // Divider Line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 100, pageWidth - 20, 100);

      let yPos = 115;

      // Order Details Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Order Details', 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      const orderDetails = [
        ['Order ID:', order.orderId],
        ['Order Date:', new Date(order.createdAt).toLocaleString('en-IN')],
        ['Transaction ID:', order.payment.transactionId || 'N/A'],
        ['Payment Method:', order.payment.method.toUpperCase()],
        ['Payment Status:', order.payment.status.toUpperCase()]
      ];

      orderDetails.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 25, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 80, yPos);
        yPos += 7;
      });

      yPos += 5;

      // Product Details Section
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 10;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Product Details', 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      const productDetails = [
        ['Crop Name:', order.orderDetails.cropName],
        ['Variety:', order.orderDetails.variety || 'N/A'],
        ['Quality:', order.orderDetails.quality || 'N/A'],
        ['Quantity:', `${order.orderDetails.quantity} ${order.orderDetails.unit}`],
        ['Price per Unit:', `₹${order.orderDetails.pricePerUnit}`]
      ];

      productDetails.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 25, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 80, yPos);
        yPos += 7;
      });

      yPos += 5;

      // Delivery Details Section
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 10;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Delivery Details', 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      doc.setFont('helvetica', 'bold');
      doc.text('Delivery Type:', 25, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(order.delivery.type === 'delivery' ? 'Home Delivery' : 'Pickup from Farm', 80, yPos);
      yPos += 7;

      if (order.delivery.type === 'delivery' && order.delivery.deliveryAddress) {
        const addr = order.delivery.deliveryAddress;
        doc.setFont('helvetica', 'bold');
        doc.text('Delivery Address:', 25, yPos);
        yPos += 7;
        doc.setFont('helvetica', 'normal');
        doc.text(`${addr.address}`, 25, yPos);
        yPos += 7;
        doc.text(`${addr.city}, ${addr.state} - ${addr.pincode}`, 25, yPos);
        yPos += 7;
        doc.text(`Contact: ${addr.contactPerson} (${addr.contactPhone})`, 25, yPos);
        yPos += 7;
      }

      if (order.delivery.estimatedDeliveryDate) {
        doc.setFont('helvetica', 'bold');
        doc.text('Est. Delivery:', 25, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(new Date(order.delivery.estimatedDeliveryDate).toLocaleDateString('en-IN'), 80, yPos);
        yPos += 7;
      }

      yPos += 5;

      // Price Breakdown Section
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 10;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Price Breakdown', 20, yPos);
      yPos += 10;

      doc.setFontSize(10);

      // Create table-like structure for price breakdown
      const priceBreakdown = [
        ['Subtotal:', `₹${order.orderDetails.totalAmount}`],
        ['Delivery Charges:', `₹${order.delivery.deliveryCharges}`],
      ];

      priceBreakdown.forEach(([label, value]) => {
        doc.setFont('helvetica', 'normal');
        doc.text(label, 25, yPos);
        doc.text(value, pageWidth - 50, yPos, { align: 'right' });
        yPos += 7;
      });

      // Total Amount (highlighted)
      yPos += 3;
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPos - 5, pageWidth - 40, 10, 'F');

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Total Amount:', 25, yPos);
      doc.setTextColor(22, 163, 74);
      doc.text(`₹${order.payment.amount}`, pageWidth - 50, yPos, { align: 'right' });
      doc.setTextColor(0, 0, 0);

      yPos += 15;

      // Farmer Details (if available)
      if (order.farmerId) {
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPos, pageWidth - 20, yPos);
        yPos += 10;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Farmer Details', 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Name: ${order.farmerId.firstName} ${order.farmerId.lastName}`, 25, yPos);
        yPos += 7;
        if (order.farmerId.phone) {
          doc.text(`Phone: ${order.farmerId.phone}`, 25, yPos);
          yPos += 7;
        }
      }

      // Footer
      const footerY = pageHeight - 30;
      doc.setDrawColor(200, 200, 200);
      doc.line(20, footerY, pageWidth - 20, footerY);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Thank you for your purchase!', pageWidth / 2, footerY + 8, { align: 'center' });
      doc.text('For support: support@achhadam.com | +91-XXXXXXXXXX', pageWidth / 2, footerY + 14, { align: 'center' });
      doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, pageWidth / 2, footerY + 20, { align: 'center' });

      // Save PDF
      doc.save(`Achhadam_Receipt_${order.orderId}.pdf`);

      alert('Receipt downloaded successfully!');

    } catch (error) {
      console.error('Failed to generate receipt:', error);
      alert('Failed to download receipt. Please try again.');
    } finally {
      setDownloadingReceipt(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600">Order not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {order.payment.status === 'paid' ? 'Payment Successful!' : 'Order Placed!'}
          </h1>
          <p className="text-gray-600">
            {order.payment.status === 'paid'
              ? 'Your payment has been processed successfully'
              : 'Your order has been placed. Payment pending.'}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-green-600 text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Info */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Order Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold">{order.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-semibold">{order.payment.transactionId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      order.payment.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.payment.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Product Details</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg">{order.orderDetails.cropName}</h4>
                    {order.orderDetails.variety && (
                      <p className="text-sm text-gray-600">Variety: {order.orderDetails.variety}</p>
                    )}
                    {order.orderDetails.quality && (
                      <p className="text-sm text-gray-600">Quality: {order.orderDetails.quality}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                      Quantity: {order.orderDetails.quantity} {order.orderDetails.unit}
                    </p>
                    <p className="text-sm text-gray-600">
                      Price per unit: ₹{order.orderDetails.pricePerUnit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ₹{order.orderDetails.totalAmount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Delivery Details</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Type:</span>{' '}
                  {order.delivery.type === 'delivery' ? 'Home Delivery' : 'Pickup from Farm'}
                </p>
                {order.delivery.type === 'delivery' && order.delivery.deliveryAddress && (
                  <div>
                    <p className="font-medium mb-1">Delivery Address:</p>
                    <p className="text-gray-600">
                      {order.delivery.deliveryAddress.address}
                      <br />
                      {order.delivery.deliveryAddress.city}, {order.delivery.deliveryAddress.state} -{' '}
                      {order.delivery.deliveryAddress.pincode}
                      <br />
                      Contact: {order.delivery.deliveryAddress.contactPerson} (
                      {order.delivery.deliveryAddress.contactPhone})
                    </p>
                  </div>
                )}
                {order.delivery.estimatedDeliveryDate && (
                  <p>
                    <span className="font-medium">Estimated Delivery:</span>{' '}
                    {new Date(order.delivery.estimatedDeliveryDate).toLocaleDateString('en-IN')}
                  </p>
                )}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Price Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{order.orderDetails.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span>
                    {order.delivery.deliveryCharges === 0
                      ? 'Free'
                      : `₹${order.delivery.deliveryCharges}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>Total Amount</span>
                  <span className="text-green-600">₹{order.payment.amount}</span>
                </div>
              </div>
            </div>

            {/* Farmer Details */}
            {order.farmerId && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-3">Farmer Details</h3>
                <p>
                  <span className="font-medium">Name:</span> {order.farmerId.firstName}{' '}
                  {order.farmerId.lastName}
                </p>
                {order.farmerId.phone && (
                  <p>
                    <span className="font-medium">Phone:</span> {order.farmerId.phone}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={downloadReceipt}
            disabled={downloadingReceipt}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>{downloadingReceipt ? 'Downloading...' : 'Download Receipt'}</span>
          </button>
          <button
            onClick={() => navigate('/buyer-dashboard?tab=orders')}
            className="flex-1 bg-white text-green-600 border-2 border-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            View All Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-white text-gray-600 border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
