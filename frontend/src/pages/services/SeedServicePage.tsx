import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Package, Truck, CreditCard, ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface OrderItem {
  id: string;
  itemType: string;
  productName: string;
  brand: string;
  quantity: string;
  unit: string;
  pricePerUnit: string;
}

const SeedServicePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Delivery Address
    farmName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',

    // Farm Details
    farmSize: '',
    soilType: '',
    cropType: '',
    sowingDate: '',

    // Delivery
    deliveryType: 'home_delivery',
    preferredDate: '',
    preferredTimeSlot: '',

    // Payment
    paymentMode: 'cash_on_delivery',
    subsidyApplicable: false,

    // Notes
    farmerNotes: ''
  });

  const [items, setItems] = useState<OrderItem[]>([{
    id: Date.now().toString(),
    itemType: '',
    productName: '',
    brand: '',
    quantity: '',
    unit: '',
    pricePerUnit: ''
  }]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemTypes = [
    { value: 'seed', label: 'बीज' },
    { value: 'fertilizer', label: 'उर्वरक' },
    { value: 'pesticide', label: 'कीटनाशक' },
    { value: 'growth_regulator', label: 'वृद्धि नियामक' },
    { value: 'micronutrient', label: 'सूक्ष्म पोषक' },
    { value: 'bio_fertilizer', label: 'जैव उर्वरक' }
  ];

  const units = [
    { value: 'kg', label: 'किलोग्राम' },
    { value: 'quintal', label: 'क्विंटल' },
    { value: 'ton', label: 'टन' },
    { value: 'litre', label: 'लीटर' },
    { value: 'packet', label: 'पैकेट' },
    { value: 'bag', label: 'बोरी' }
  ];

  const addItem = () => {
    setItems([...items, {
      id: Date.now().toString(),
      itemType: '',
      productName: '',
      brand: '',
      quantity: '',
      unit: '',
      pricePerUnit: ''
    }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof OrderItem, value: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.pricePerUnit) || 0;
      return total + (quantity * price);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const authToken = localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');

      const subtotal = calculateTotal();
      const gst = subtotal * 0.18;
      const deliveryCharges = formData.deliveryType === 'home_delivery' ? 200 : 0;
      const finalAmount = subtotal + gst + deliveryCharges;

      const requestData = {
        deliveryAddress: {
          farmName: formData.farmName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark
        },
        items: items.map(item => ({
          itemType: item.itemType,
          productName: item.productName,
          brand: item.brand,
          quantity: parseFloat(item.quantity),
          unit: item.unit,
          pricePerUnit: parseFloat(item.pricePerUnit),
          totalPrice: parseFloat(item.quantity) * parseFloat(item.pricePerUnit),
          inStock: true,
          estimatedDelivery: new Date(formData.preferredDate)
        })),
        farmDetails: {
          farmSize: parseFloat(formData.farmSize),
          soilType: formData.soilType,
          sowingDate: formData.sowingDate ? new Date(formData.sowingDate) : undefined
        },
        orderSummary: {
          subtotal,
          totalGST: gst,
          totalDiscount: 0,
          deliveryCharges,
          finalAmount
        },
        delivery: {
          deliveryType: formData.deliveryType,
          preferredDate: new Date(formData.preferredDate),
          preferredTimeSlot: formData.preferredTimeSlot
        },
        payment: {
          paymentMode: formData.paymentMode,
          subsidyApplicable: formData.subsidyApplicable,
          advanceAmount: 0,
          advancePaid: false,
          balanceAmount: finalAmount,
          balancePaid: false
        },
        farmerName: userData.user?.firstName ? `${userData.user.firstName} ${userData.user.lastName || ''}` : 'Unknown',
        farmerNotes: formData.farmerNotes
      };

      const response = await fetch('https://acchadam1-backend.onrender.com/api/services/seeds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        alert('ऑर्डर सफलतापूर्वक सबमिट किया गया!');
        navigate('/farmer-dashboard');
      } else {
        throw new Error('Failed to submit seed order');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('ऑर्डर सबमिट करने में त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <button
            onClick={() => navigate('/farmer-dashboard')}
            className="flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            वापस जाएं
          </button>
          <div className="flex items-center">
            <Package className="w-10 h-10 text-green-600 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">बीज और उर्वरक सेवा</h1>
              <p className="text-gray-600 mt-1">उच्च गुणवत्ता वाले कृषि इनपुट सीधे आपके दरवाजे पर</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Truck className="w-6 h-6 mr-2" />
              डिलीवरी पता
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="खेत/घर का नाम"
                value={formData.farmName}
                onChange={(e) => setFormData({...formData, farmName: e.target.value})}
                className="border rounded-lg p-3"
                required
              />
              <input
                type="text"
                placeholder="पूरा पता"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="border rounded-lg p-3"
                required
              />
              <input
                type="text"
                placeholder="शहर"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="border rounded-lg p-3"
                required
              />
              <input
                type="text"
                placeholder="राज्य"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                className="border rounded-lg p-3"
                required
              />
              <input
                type="text"
                placeholder="पिनकोड"
                value={formData.pincode}
                onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                className="border rounded-lg p-3"
                required
              />
              <input
                type="text"
                placeholder="निशान (वैकल्पिक)"
                value={formData.landmark}
                onChange={(e) => setFormData({...formData, landmark: e.target.value})}
                className="border rounded-lg p-3"
              />
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">उत्पाद चुनें</h2>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                उत्पाद जोड़ें
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-700">उत्पाद #{index + 1}</h3>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                      value={item.itemType}
                      onChange={(e) => updateItem(item.id, 'itemType', e.target.value)}
                      className="border rounded-lg p-3"
                      required
                    >
                      <option value="">प्रकार चुनें</option>
                      {itemTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="उत्पाद का नाम"
                      value={item.productName}
                      onChange={(e) => updateItem(item.id, 'productName', e.target.value)}
                      className="border rounded-lg p-3"
                      required
                    />

                    <input
                      type="text"
                      placeholder="ब्रांड"
                      value={item.brand}
                      onChange={(e) => updateItem(item.id, 'brand', e.target.value)}
                      className="border rounded-lg p-3"
                    />

                    <input
                      type="number"
                      placeholder="मात्रा"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                      className="border rounded-lg p-3"
                      required
                      min="0"
                      step="0.01"
                    />

                    <select
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                      className="border rounded-lg p-3"
                      required
                    >
                      <option value="">इकाई चुनें</option>
                      {units.map(unit => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="प्रति इकाई कीमत (₹)"
                      value={item.pricePerUnit}
                      onChange={(e) => updateItem(item.id, 'pricePerUnit', e.target.value)}
                      className="border rounded-lg p-3"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {item.quantity && item.pricePerUnit && (
                    <div className="mt-3 text-right">
                      <span className="text-sm text-gray-600">कुल: </span>
                      <span className="text-lg font-bold text-green-600">
                        ₹{(parseFloat(item.quantity) * parseFloat(item.pricePerUnit)).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">ऑर्डर सारांश</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">उप-योग:</span>
                <span className="font-semibold">₹{calculateTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST (18%):</span>
                <span className="font-semibold">₹{(calculateTotal() * 0.18).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">डिलीवरी शुल्क:</span>
                <span className="font-semibold">
                  ₹{formData.deliveryType === 'home_delivery' ? 200 : 0}
                </span>
              </div>
              <div className="border-t-2 border-gray-300 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">कुल राशि:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{(calculateTotal() + (calculateTotal() * 0.18) + (formData.deliveryType === 'home_delivery' ? 200 : 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">डिलीवरी विवरण</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">डिलीवरी प्रकार</label>
                <select
                  value={formData.deliveryType}
                  onChange={(e) => setFormData({...formData, deliveryType: e.target.value})}
                  className="border rounded-lg p-3 w-full"
                >
                  <option value="home_delivery">होम डिलीवरी (+₹200)</option>
                  <option value="dealer_pickup">डीलर से लेना (मुफ्त)</option>
                  <option value="warehouse_pickup">गोदाम से लेना (मुफ्त)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">पसंदीदा तारीख</label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                  className="border rounded-lg p-3 w-full"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">समय स्लॉट</label>
                <select
                  value={formData.preferredTimeSlot}
                  onChange={(e) => setFormData({...formData, preferredTimeSlot: e.target.value})}
                  className="border rounded-lg p-3 w-full"
                  required
                >
                  <option value="">समय चुनें</option>
                  <option value="morning_9_12">सुबह (9-12)</option>
                  <option value="afternoon_12_4">दोपहर (12-4)</option>
                  <option value="evening_4_7">शाम (4-7)</option>
                  <option value="anytime">कभी भी</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">भुगतान विधि</label>
                <select
                  value={formData.paymentMode}
                  onChange={(e) => setFormData({...formData, paymentMode: e.target.value})}
                  className="border rounded-lg p-3 w-full"
                >
                  <option value="cash_on_delivery">डिलीवरी पर नकद</option>
                  <option value="online">ऑनलाइन भुगतान</option>
                  <option value="credit">उधार</option>
                  <option value="subsidy">सब्सिडी</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.subsidyApplicable}
                    onChange={(e) => setFormData({...formData, subsidyApplicable: e.target.checked})}
                    className="w-5 h-5"
                  />
                  <span>सरकारी सब्सिडी लागू है</span>
                </label>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">अतिरिक्त जानकारी</h2>
            <textarea
              placeholder="कोई विशेष निर्देश या टिप्पणी..."
              value={formData.farmerNotes}
              onChange={(e) => setFormData({...formData, farmerNotes: e.target.value})}
              className="border rounded-lg p-3 w-full h-32"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition disabled:bg-gray-400 flex items-center justify-center"
          >
            {isSubmitting ? (
              'सबमिट हो रहा है...'
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                ऑर्डर करें - ₹{(calculateTotal() + (calculateTotal() * 0.18) + (formData.deliveryType === 'home_delivery' ? 200 : 0)).toLocaleString()}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SeedServicePage;
