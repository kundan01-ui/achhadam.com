import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Droplet, Thermometer, Wind, Sun, Bug, ArrowLeft, Check } from 'lucide-react';

const IoTServicePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Farm Details
    farmName: '',
    farmSize: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    soilType: '',
    cropTypes: '',

    // Service Selection
    serviceType: '',

    // Sensor Requirements
    sensors: {
      soilMoisture: false,
      soilPH: false,
      soilNPK: false,
      temperature: false,
      humidity: false,
      rainfall: false,
      windSpeed: false,
      lightIntensity: false,
      pestCamera: false
    },

    // Installation
    numberOfSensors: '',
    preferredTimeSlot: '',
    internetAvailable: false,

    // Service Plan
    planType: '',
    duration: '',

    // Notes
    farmerNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceTypes = [
    { value: 'soil_monitoring', label: 'मिट्टी निगरानी', icon: <Droplet className="w-5 h-5" /> },
    { value: 'weather_monitoring', label: 'मौसम निगरानी', icon: <Wind className="w-5 h-5" /> },
    { value: 'irrigation_automation', label: 'सिंचाई स्वचालन', icon: <Droplet className="w-5 h-5" /> },
    { value: 'pest_detection', label: 'कीट पहचान', icon: <Bug className="w-5 h-5" /> },
    { value: 'complete_farm_monitoring', label: 'पूर्ण फार्म निगरानी', icon: <Wifi className="w-5 h-5" /> }
  ];

  const sensorOptions = [
    { key: 'soilMoisture', label: 'मिट्टी की नमी', icon: <Droplet /> },
    { key: 'soilPH', label: 'मिट्टी का pH', icon: <Thermometer /> },
    { key: 'soilNPK', label: 'NPK स्तर', icon: <Sun /> },
    { key: 'temperature', label: 'तापमान', icon: <Thermometer /> },
    { key: 'humidity', label: 'आर्द्रता', icon: <Droplet /> },
    { key: 'rainfall', label: 'वर्षा', icon: <Droplet /> },
    { key: 'windSpeed', label: 'हवा की गति', icon: <Wind /> },
    { key: 'lightIntensity', label: 'प्रकाश तीव्रता', icon: <Sun /> },
    { key: 'pestCamera', label: 'कीट कैमरा', icon: <Bug /> }
  ];

  const plans = [
    { value: 'basic', label: 'बेसिक', price: '₹5,000/महीना', features: ['3 सेंसर', 'बेसिक रिपोर्ट', 'SMS अलर्ट'] },
    { value: 'standard', label: 'स्टैंडर्ड', price: '₹10,000/महीना', features: ['6 सेंसर', 'विस्तृत रिपोर्ट', 'App अलर्ट', 'फोन सपोर्ट'] },
    { value: 'premium', label: 'प्रीमियम', price: '₹20,000/महीना', features: ['10+ सेंसर', 'AI विश्लेषण', '24/7 मॉनिटरिंग', 'विशेषज्ञ सलाह'] }
  ];

  const handleSensorChange = (sensorKey: string) => {
    setFormData(prev => ({
      ...prev,
      sensors: {
        ...prev.sensors,
        [sensorKey]: !prev.sensors[sensorKey as keyof typeof prev.sensors]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const authToken = localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');

      const requestData = {
        farmDetails: {
          farmName: formData.farmName,
          farmSize: parseFloat(formData.farmSize),
          location: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode
          },
          soilType: formData.soilType,
          cropTypes: formData.cropTypes.split(',').map(c => c.trim())
        },
        serviceType: formData.serviceType,
        sensorRequirements: formData.sensors,
        installationDetails: {
          numberOfSensors: parseInt(formData.numberOfSensors),
          preferredTimeSlot: formData.preferredTimeSlot,
          internetAvailable: formData.internetAvailable
        },
        servicePlan: {
          planType: formData.planType,
          duration: formData.duration,
          maintenanceIncluded: true
        },
        farmerName: userData.user?.firstName ? `${userData.user.firstName} ${userData.user.lastName || ''}` : 'Unknown',
        farmerNotes: formData.farmerNotes
      };

      const response = await fetch('https://acchadam1-backend.onrender.com/api/services/iot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        alert('IoT सेवा का अनुरोध सफलतापूर्वक सबमिट किया गया!');
        navigate('/farmer-dashboard');
      } else {
        throw new Error('Failed to submit IoT service request');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('सेवा अनुरोध सबमिट करने में त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
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
            <Wifi className="w-10 h-10 text-green-600 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">IoT फार्म मॉनिटरिंग सेवा</h1>
              <p className="text-gray-600 mt-1">अपने खेत को स्मार्ट बनाएं - रियल-टाइम डेटा से बेहतर निर्णय लें</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Farm Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">खेत का विवरण</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="खेत का नाम"
                value={formData.farmName}
                onChange={(e) => setFormData({...formData, farmName: e.target.value})}
                className="border rounded-lg p-3"
                required
              />
              <input
                type="number"
                placeholder="खेत का आकार (एकड़)"
                value={formData.farmSize}
                onChange={(e) => setFormData({...formData, farmSize: e.target.value})}
                className="border rounded-lg p-3"
                required
              />
              <input
                type="text"
                placeholder="पता"
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
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({...formData, soilType: e.target.value})}
                className="border rounded-lg p-3"
                required
              >
                <option value="">मिट्टी का प्रकार चुनें</option>
                <option value="clay">चिकनी मिट्टी</option>
                <option value="sandy">रेतीली मिट्टी</option>
                <option value="loamy">दोमट मिट्टी</option>
                <option value="black">काली मिट्टी</option>
                <option value="red">लाल मिट्टी</option>
                <option value="alluvial">जलोढ़ मिट्टी</option>
              </select>
              <input
                type="text"
                placeholder="फसलें (कॉमा से अलग करें)"
                value={formData.cropTypes}
                onChange={(e) => setFormData({...formData, cropTypes: e.target.value})}
                className="border rounded-lg p-3"
                required
              />
            </div>
          </div>

          {/* Service Type */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">सेवा का प्रकार</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceTypes.map(service => (
                <button
                  key={service.value}
                  type="button"
                  onClick={() => setFormData({...formData, serviceType: service.value})}
                  className={`p-4 border-2 rounded-lg flex items-center space-x-3 transition ${
                    formData.serviceType === service.value
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  {service.icon}
                  <span className="font-medium">{service.label}</span>
                  {formData.serviceType === service.value && <Check className="w-5 h-5 text-green-600 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sensor Selection */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">सेंसर चुनें</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {sensorOptions.map(sensor => (
                <label key={sensor.key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sensors[sensor.key as keyof typeof formData.sensors]}
                    onChange={() => handleSensorChange(sensor.key)}
                    className="w-5 h-5 text-green-600"
                  />
                  <span className="text-sm">{sensor.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Service Plan */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">सेवा योजना</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {plans.map(plan => (
                <div
                  key={plan.value}
                  onClick={() => setFormData({...formData, planType: plan.value})}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    formData.planType === plan.value
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <h3 className="font-bold text-lg mb-2">{plan.label}</h3>
                  <p className="text-green-600 font-semibold mb-3">{plan.price}</p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              className="border rounded-lg p-3 w-full"
              required
            >
              <option value="">अवधि चुनें</option>
              <option value="3_months">3 महीने</option>
              <option value="6_months">6 महीने</option>
              <option value="1_year">1 साल</option>
              <option value="2_years">2 साल</option>
            </select>
          </div>

          {/* Installation Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">स्थापना विवरण</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="सेंसर की संख्या"
                value={formData.numberOfSensors}
                onChange={(e) => setFormData({...formData, numberOfSensors: e.target.value})}
                className="border rounded-lg p-3"
                required
              />
              <select
                value={formData.preferredTimeSlot}
                onChange={(e) => setFormData({...formData, preferredTimeSlot: e.target.value})}
                className="border rounded-lg p-3"
                required
              >
                <option value="">समय स्लॉट चुनें</option>
                <option value="morning_8_12">सुबह 8-12</option>
                <option value="afternoon_12_4">दोपहर 12-4</option>
                <option value="evening_4_7">शाम 4-7</option>
                <option value="anytime">कभी भी</option>
              </select>
              <label className="flex items-center space-x-2 col-span-2">
                <input
                  type="checkbox"
                  checked={formData.internetAvailable}
                  onChange={(e) => setFormData({...formData, internetAvailable: e.target.checked})}
                  className="w-5 h-5"
                />
                <span>इंटरनेट उपलब्ध है</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">अतिरिक्त जानकारी</h2>
            <textarea
              placeholder="कोई विशेष आवश्यकता या टिप्पणी..."
              value={formData.farmerNotes}
              onChange={(e) => setFormData({...formData, farmerNotes: e.target.value})}
              className="border rounded-lg p-3 w-full h-32"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {isSubmitting ? 'सबमिट हो रहा है...' : 'सेवा के लिए अनुरोध करें'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default IoTServicePage;
