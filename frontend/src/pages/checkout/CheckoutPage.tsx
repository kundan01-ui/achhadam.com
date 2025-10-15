import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiConfig } from '../../config/apiConfig';

interface CartItem {
  _id: string;
  cropId: {
    _id: string;
    cropName: string;
    pricePerUnit: number;
    unit: string;
    imageUrl?: string;
    farmLocation?: {
      address: string;
      city: string;
      state: string;
      pincode: string;
    };
  };
  quantity: number;
}

interface Listing {
  _id: string;
  cropName: string;
  pricePerUnit: number;
  unit: string;
  quantityAvailable: number;
  imageUrl?: string;
  farmLocation?: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode'); // 'cart' or 'buynow'
  const listingId = searchParams.get('listingId');
  const quantity = parseInt(searchParams.get('quantity') || '1');

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [buyNowItem, setBuyNowItem] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Delivery details
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    contactPerson: '',
    contactPhone: ''
  });

  // Payment details
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod' | 'upi'>('razorpay');

  useEffect(() => {
    if (mode === 'buynow' && listingId) {
      loadBuyNowItem();
    } else if (mode === 'cart') {
      loadCartItems();
    } else {
      navigate('/');
    }
  }, [mode, listingId]);

  const loadBuyNowItem = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        apiConfig.buildURL(`/api/listings/${listingId}`),
        { headers: apiConfig.getAuthHeaders() }
      );
      const result = await response.json();

      if (result.success && result.data) {
        setBuyNowItem(result.data);
      }
    } catch (error) {
      console.error('Failed to load listing:', error);
      alert('Failed to load product details');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const buyerId = localStorage.getItem('userId');
      const response = await fetch(
        apiConfig.buildURL(`/api/cart/${buyerId}`),
        { headers: apiConfig.getAuthHeaders() }
      );
      const result = await response.json();

      if (result.success && result.data) {
        setCartItems(result.data);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (): number => {
    if (mode === 'buynow' && buyNowItem) {
      return buyNowItem.pricePerUnit * quantity;
    } else if (mode === 'cart') {
      return cartItems.reduce((sum, item) =>
        sum + (item.cropId.pricePerUnit * item.quantity), 0
      );
    }
    return 0;
  };

  const deliveryCharges = deliveryType === 'delivery' ? 100 : 0;
  const totalAmount = calculateTotal() + deliveryCharges;

  const handlePlaceOrder = async () => {
    // Validate delivery address
    if (deliveryType === 'delivery') {
      if (!deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.pincode) {
        alert('Please fill in complete delivery address');
        return;
      }
    }

    try {
      setProcessing(true);

      if (mode === 'buynow' && buyNowItem) {
        // Place single order
        await placeSingleOrder(buyNowItem._id, quantity, buyNowItem);
      } else if (mode === 'cart') {
        // Place multiple orders (one for each cart item)
        for (const item of cartItems) {
          await placeSingleOrder(item.cropId._id, item.quantity, item.cropId);
        }
      }

    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place order. Please try again.');
      setProcessing(false);
    }
  };

  const placeSingleOrder = async (listingId: string, quantity: number, listing: any) => {
    const orderData = {
      listingId,
      quantity,
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : null,
      pickupAddress: deliveryType === 'pickup' ? listing.farmLocation : null,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      notes: `Order via ${mode} mode`
    };

    if (paymentMethod === 'razorpay') {
      // Razorpay payment flow
      await initiateRazorpayPayment(orderData);
    } else if (paymentMethod === 'cod') {
      // COD order - create directly
      const response = await fetch(
        apiConfig.buildURL('/api/orders/create'),
        {
          method: 'POST',
          headers: apiConfig.getAuthHeaders(),
          body: JSON.stringify(orderData)
        }
      );

      const result = await response.json();

      if (result.success) {
        // Redirect to success page
        navigate(`/payment-success?orderId=${result.orderId}`);
      } else {
        throw new Error(result.message);
      }
    }
  };

  const initiateRazorpayPayment = async (orderData: any) => {
    try {
      // Create order on backend
      const response = await fetch(
        apiConfig.buildURL('/api/payment/create-order'),
        {
          method: 'POST',
          headers: apiConfig.getAuthHeaders(),
          body: JSON.stringify({
            ...orderData,
            amount: totalAmount * 100, // Convert to paise
            currency: 'INR'
          })
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      const orderDetails = result.data;

      // Open Razorpay modal
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_xxxxx',
        amount: orderDetails.amount,
        currency: orderDetails.currency,
        name: 'Achhadam',
        description: `Payment for ${orderDetails.orderDetails.cropName}`,
        order_id: orderDetails.razorpayOrderId,

        handler: async (response: any) => {
          // Verify payment
          await verifyPayment(
            orderDetails.orderId,
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );
        },

        prefill: {
          name: deliveryAddress.contactPerson || '',
          contact: deliveryAddress.contactPhone || ''
        },

        theme: {
          color: '#16A34A'
        },

        modal: {
          ondismiss: () => {
            setProcessing(false);
            alert('Payment cancelled');
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Razorpay error:', error);
      throw error;
    }
  };

  const verifyPayment = async (
    orderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) => {
    try {
      const response = await fetch(
        apiConfig.buildURL('/api/payment/verify'),
        {
          method: 'POST',
          headers: apiConfig.getAuthHeaders(),
          body: JSON.stringify({
            orderId,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
          })
        }
      );

      const result = await response.json();

      if (result.success) {
        // Payment successful - redirect to success page
        navigate(`/payment-success?orderId=${orderId}`);
      } else {
        throw new Error(result.message);
      }

    } catch (error) {
      console.error('Payment verification failed:', error);
      alert('Payment verification failed. Please contact support.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Delivery & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Type */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Method</h2>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="delivery"
                    checked={deliveryType === 'delivery'}
                    onChange={(e) => setDeliveryType(e.target.value as any)}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="font-medium">Home Delivery (₹100)</span>
                </label>
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="pickup"
                    checked={deliveryType === 'pickup'}
                    onChange={(e) => setDeliveryType(e.target.value as any)}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="font-medium">Pickup from Farm (Free)</span>
                </label>
              </div>
            </div>

            {/* Delivery Address */}
            {deliveryType === 'delivery' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.address}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, address: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.state}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, state: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.pincode}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, pincode: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.contactPerson}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, contactPerson: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      value={deliveryAddress.contactPhone}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, contactPhone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4 text-green-600"
                  />
                  <div>
                    <span className="font-medium">Online Payment</span>
                    <p className="text-sm text-gray-500">UPI, Cards, Net Banking</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4 text-green-600"
                  />
                  <div>
                    <span className="font-medium">Cash on Delivery</span>
                    <p className="text-sm text-gray-500">Pay when you receive</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {mode === 'buynow' && buyNowItem && (
                  <div className="flex items-center space-x-3">
                    <img
                      src={buyNowItem.imageUrl || '/placeholder-crop.jpg'}
                      alt={buyNowItem.cropName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{buyNowItem.cropName}</p>
                      <p className="text-sm text-gray-500">{quantity} {buyNowItem.unit}</p>
                    </div>
                    <p className="font-semibold">₹{buyNowItem.pricePerUnit * quantity}</p>
                  </div>
                )}

                {mode === 'cart' && cartItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-3">
                    <img
                      src={item.cropId.imageUrl || '/placeholder-crop.jpg'}
                      alt={item.cropId.cropName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.cropId.cropName}</p>
                      <p className="text-sm text-gray-500">{item.quantity} {item.cropId.unit}</p>
                    </div>
                    <p className="font-semibold">₹{item.cropId.pricePerUnit * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span>{deliveryCharges === 0 ? 'Free' : `₹${deliveryCharges}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-green-600">₹{totalAmount}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? 'Processing...' : 'Place Order'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By placing order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
