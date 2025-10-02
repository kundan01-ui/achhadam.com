import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Droplets, Sprout, Camera, ArrowLeft, Calendar, MapPin } from 'lucide-react';

const DroneServicePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Farm Details
    farmName: '',
    farmSize: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    cropType: '',
    cropStage: '',
    terrainType: '',

    // Service Selection
    serviceType: '',

    // Spraying Details
    sprayMaterial: '',
    quantity: '',
    concentration: '',
    targetPest: '',

    // Scheduling
    preferredDate: '',
    preferredTimeSlot: '',
    alternativeDate: '',
    urgency: '',

    // Notes
    farmerNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceTypes = [
    {
      value: 'pesticide_spray',
      label: 'कीटनाशक छिड़काव',
      icon: <Droplets className="w-6 h-6" />,
      description: 'सटीक और समान छिड़काव'
    },
    {
      value: 'fertilizer_spray',
      label: 'उर्वरक छिड़काव',
      icon: <Sprout className="w-6 h-6" />,
      description: 'तरल उर्वरक का छिड़काव'
    },
    {
      value: 'seed_sowing',
      label: 'बीज बुवाई',
      icon: <Sprout className="w-6 h-6" />,
      description: 'ड्रोन से बीज बुवाई'
    },
    {
      value: 'crop_monitoring',
      label: 'फसल निगरानी',
      icon: <Camera className="w-6 h-6" />,
      description: 'हवाई फोटोग्राफी और मैपिंग'
    }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'कम', color: 'bg-blue-100 text-blue-800' },
    { value: 'medium', label: 'मध्यम', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'उच्च', color: 'bg-orange-100 text-orange-800' },
    { value: 'emergency', label: 'आपातकालीन', color: 'bg-red-100 text-red-800' }
  ];

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
          cropType: formData.cropType,
          cropStage: formData.cropStage,
          terrainType: formData.terrainType
        },
        serviceType: formData.serviceType,
        sprayingDetails: {
          sprayMaterial: formData.sprayMaterial,
          quantity: parseFloat(formData.quantity),
          concentration: formData.concentration,
          targetPest: formData.targetPest
        },
        schedule: {
          preferredDate: new Date(formData.preferredDate),
          preferredTimeSlot: formData.preferredTimeSlot,
          alternativeDate: formData.alternativeDate ? new Date(formData.alternativeDate) : undefined,
          urgency: formData.urgency,
          weatherDependency: true
        },
        farmerName: userData.user?.firstName ? `${userData.user.firstName} ${userData.user.lastName || ''}` : 'Unknown',
        farmerNotes: formData.farmerNotes
      };

      const response = await fetch('https://acchadam1-backend.onrender.com/api/services/drone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        alert('ड्रोन सेवा का अनुरोध सफलतापूर्वक सबमिट किया गया!');
        navigate('/farmer-dashboard');
      } else {
        throw new Error('Failed to submit drone service request');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('सेवा अनुरोध सबमिट करने में त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <button
            onClick={() => navigate('/farmer-dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            वापस जाएं
          </button>
          <div className="flex items-center">
            <Plane className="w-10 h-10 text-blue-600 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">ड्रोन स्प्रेइंग सेवा</h1>
              <p className="text-gray-600 mt-1">आधुनिक तकनीक से तेज़ और सटीक छिड़काव</p>
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
              <input
                type="text"
                placeholder="फसल का प्रकार"
                value={formData.cropType}
                onChange={(e) => setFormData({...formData, cropType: e.target.value})}
                className="border rounded-lg p-3"
                required
              />
              <select
                value={formData.cropStage}
                onChange={(e) => setFormData({...formData, cropStage: e.target.value})}
                className="border rounded-lg p-3"
                required
              >
                <option value="">फसल की अवस्था</option>
                <option value="sowing">बुवाई</option>
                <option value="germination">अंकुरण</option>
                <option value="vegetative">वृद्धि</option>
                <option value="flowering">फूल</option>
                <option value="fruiting">फल</option>
                <option value="maturity">परिपक्वता</option>
              </select>
              <select
                value={formData.terrainType}
                onChange={(e) => setFormData({...formData, terrainType: e.target.value})}
                className="border rounded-lg p-3"
                required
              >
                <option value="">भूमि का प्रकार</option>
                <option value="flat">समतल</option>
                <option value="hilly">पहाड़ी</option>
                <option value="undulating">लहरदार</option>
                <option value="terraced">सीढ़ीदार</option>
              </select>
            </div>
          </div>

          {/* Service Type */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">सेवा का प्रकार चुनें</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceTypes.map(service => (
                <button
                  key={service.value}
                  type="button"
                  onClick={() => setFormData({...formData, serviceType: service.value})}
                  className={`p-6 border-2 rounded-lg transition ${
                    formData.serviceType === service.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    {service.icon}
                    <span className="font-bold text-lg">{service.label}</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">{service.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Spraying Details (if pesticide or fertilizer) */}
          {(formData.serviceType === 'pesticide_spray' || formData.serviceType === 'fertilizer_spray') && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">छिड़काव विवरण</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="दवा/उर्वरक का नाम"
                  value={formData.sprayMaterial}
                  onChange={(e) => setFormData({...formData, sprayMaterial: e.target.value})}
                  className="border rounded-lg p-3"
                  required
                />
                <input
                  type="number"
                  placeholder="मात्रा (लीटर/किलो)"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="border rounded-lg p-3"
                  required
                />
                <input
                  type="text"
                  placeholder="तनुकरण अनुपात (जैसे 1:100)"
                  value={formData.concentration}
                  onChange={(e) => setFormData({...formData, concentration: e.target.value})}
                  className="border rounded-lg p-3"
                />
                {formData.serviceType === 'pesticide_spray' && (
                  <input
                    type="text"
                    placeholder="लक्षित कीट"
                    value={formData.targetPest}
                    onChange={(e) => setFormData({...formData, targetPest: e.target.value})}
                    className="border rounded-lg p-3"
                  />
                )}
              </div>
            </div>
          )}

          {/* Scheduling */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2" />
              शेड्यूलिंग
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">पसंदीदा तारीख</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">समय स्लॉट</label>
                <select
                  value={formData.preferredTimeSlot}
                  onChange={(e) => setFormData({...formData, preferredTimeSlot: e.target.value})}
                  className="border rounded-lg p-3 w-full"
                  required
                >
                  <option value="">समय चुनें</option>
                  <option value="early_morning_5_8">सुबह जल्दी (5-8 AM)</option>
                  <option value="morning_8_11">सुबह (8-11 AM)</option>
                  <option value="evening_4_7">शाम (4-7 PM)</option>
                  <option value="anytime">कभी भी</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">वैकल्पिक तारीख</label>
                <input
                  type="date"
                  value={formData.alternativeDate}
                  onChange={(e) => setFormData({...formData, alternativeDate: e.target.value})}
                  className="border rounded-lg p-3 w-full"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">आवश्यकता की प्राथमिकता</label>
                <div className="grid grid-cols-2 gap-2">
                  {urgencyLevels.map(level => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setFormData({...formData, urgency: level.value})}
                      className={`p-2 rounded-lg font-medium text-sm transition ${
                        formData.urgency === level.value
                          ? level.color
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>नोट:</strong> ड्रोन छिड़काव मौसम पर निर्भर है। खराब मौसम में सेवा पुनर्निर्धारित हो सकती है।
              </p>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">अनुमानित लागत</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">प्रति एकड़ दर</p>
                <p className="text-2xl font-bold text-green-600">₹300-500</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">न्यूनतम शुल्क</p>
                <p className="text-2xl font-bold text-green-600">₹2,000</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">आपकी अनुमानित लागत</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{formData.farmSize ? Math.max(2000, parseFloat(formData.farmSize) * 400).toLocaleString() : '--'}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">अतिरिक्त जानकारी</h2>
            <textarea
              placeholder="कोई विशेष आवश्यकता, बाधाएं, या टिप्पणी..."
              value={formData.farmerNotes}
              onChange={(e) => setFormData({...formData, farmerNotes: e.target.value})}
              className="border rounded-lg p-3 w-full h-32"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center"
          >
            {isSubmitting ? (
              'सबमिट हो रहा है...'
            ) : (
              <>
                <Plane className="w-5 h-5 mr-2" />
                ड्रोन सेवा बुक करें
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DroneServicePage;
