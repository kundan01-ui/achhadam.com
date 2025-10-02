import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Phone, Video, Users, Upload, ArrowLeft, Camera } from 'lucide-react';

const AdvisoryServicePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Consultation Type
    consultationType: '',

    // Farm Details
    farmSize: '',
    city: '',
    state: '',
    soilType: '',
    currentCrop: '',
    cropStage: '',

    // Problem Details
    problemTitle: '',
    problemDescription: '',
    symptoms: '',
    duration: '',
    affectedArea: '',
    previousAttempts: '',
    urgency: '',

    // Consultation Mode
    consultationMode: '',

    // Scheduling
    requestedDate: '',
    requestedTimeSlot: '',

    // Notes
    farmerNotes: ''
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const consultationTypes = [
    { value: 'crop_selection', label: 'फसल चयन', icon: '🌾', description: 'सही फसल चुनने में मदद' },
    { value: 'soil_management', label: 'मिट्टी प्रबंधन', icon: '🌱', description: 'मिट्टी की गुणवत्ता सुधार' },
    { value: 'pest_disease_diagnosis', label: 'कीट/रोग पहचान', icon: '🐛', description: 'फसल की समस्या का निदान' },
    { value: 'irrigation_planning', label: 'सिंचाई योजना', icon: '💧', description: 'पानी का सही उपयोग' },
    { value: 'fertilizer_recommendation', label: 'उर्वरक सलाह', icon: '🌿', description: 'सही उर्वरक और मात्रा' },
    { value: 'organic_farming', label: 'जैविक खेती', icon: '🍃', description: 'रासायनिक मुक्त खेती' },
    { value: 'crop_insurance', label: 'फसल बीमा', icon: '🛡️', description: 'बीमा योजना जानकारी' },
    { value: 'market_linkage', label: 'बाज़ार जोड़', icon: '📊', description: 'फसल बेचने में मदद' },
    { value: 'government_schemes', label: 'सरकारी योजना', icon: '🏛️', description: 'सब्सिडी और योजनाएं' },
    { value: 'farm_mechanization', label: 'यंत्रीकरण', icon: '🚜', description: 'कृषि उपकरण सलाह' },
    { value: 'general_query', label: 'सामान्य प्रश्न', icon: '❓', description: 'कोई अन्य प्रश्न' }
  ];

  const consultationModes = [
    { value: 'phone_call', label: 'फोन कॉल', icon: <Phone />, description: 'सीधे विशेषज्ञ से बात करें', price: 'मुफ्त' },
    { value: 'video_call', label: 'वीडियो कॉल', icon: <Video />, description: 'समस्या दिखाकर समाधान पाएं', price: '₹200' },
    { value: 'field_visit', label: 'खेत का दौरा', icon: <Users />, description: 'विशेषज्ञ आपके खेत पर आएगा', price: '₹1,000+' },
    { value: 'chat', label: 'चैट सपोर्ट', icon: <MessageCircle />, description: 'टेक्स्ट में सवाल पूछें', price: 'मुफ्त' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'कम', color: 'bg-blue-100 text-blue-800', description: '7-10 दिन में जवाब' },
    { value: 'medium', label: 'मध्यम', color: 'bg-yellow-100 text-yellow-800', description: '3-5 दिन में जवाब' },
    { value: 'high', label: 'उच्च', color: 'bg-orange-100 text-orange-800', description: '1-2 दिन में जवाब' },
    { value: 'emergency', label: 'आपातकालीन', color: 'bg-red-100 text-red-800', description: '24 घंटे में जवाब' }
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const authToken = localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');

      const requestData = {
        consultationType: formData.consultationType,
        farmDetails: {
          farmSize: parseFloat(formData.farmSize),
          location: {
            city: formData.city,
            state: formData.state
          },
          soilType: formData.soilType,
          currentCrop: formData.currentCrop,
          cropStage: formData.cropStage
        },
        problemDetails: {
          title: formData.problemTitle,
          description: formData.problemDescription,
          symptoms: formData.symptoms.split(',').map(s => s.trim()),
          duration: formData.duration,
          affectedArea: formData.affectedArea,
          previousAttempts: formData.previousAttempts,
          urgency: formData.urgency
        },
        media: {
          photos: photos,
          videos: [],
          documents: []
        },
        consultationMode: formData.consultationMode,
        schedule: {
          requestedDate: formData.requestedDate ? new Date(formData.requestedDate) : undefined,
          requestedTimeSlot: formData.requestedTimeSlot
        },
        farmerName: userData.user?.firstName ? `${userData.user.firstName} ${userData.user.lastName || ''}` : 'Unknown',
        farmerNotes: formData.farmerNotes
      };

      const response = await fetch('https://acchadam1-backend.onrender.com/api/services/advisory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        alert('सलाह का अनुरोध सफलतापूर्वक सबमिट किया गया! जल्द ही विशेषज्ञ आपसे संपर्क करेंगे।');
        navigate('/farmer-dashboard');
      } else {
        throw new Error('Failed to submit advisory request');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('सेवा अनुरोध सबमिट करने में त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <button
            onClick={() => navigate('/farmer-dashboard')}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            वापस जाएं
          </button>
          <div className="flex items-center">
            <MessageCircle className="w-10 h-10 text-purple-600 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">कृषि सलाहकार सेवा</h1>
              <p className="text-gray-600 mt-1">विशेषज्ञों से सीधे सलाह लें - आपकी फसल हमारी जिम्मेदारी</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Consultation Type */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">किस विषय पर सलाह चाहिए?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {consultationTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({...formData, consultationType: type.value})}
                  className={`p-4 border-2 rounded-lg text-center transition ${
                    formData.consultationType === type.value
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="font-medium text-sm mb-1">{type.label}</div>
                  <div className="text-xs text-gray-600">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Farm Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">खेत का विवरण</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="मिट्टी का प्रकार"
                value={formData.soilType}
                onChange={(e) => setFormData({...formData, soilType: e.target.value})}
                className="border rounded-lg p-3"
              />
              <input
                type="text"
                placeholder="वर्तमान फसल"
                value={formData.currentCrop}
                onChange={(e) => setFormData({...formData, currentCrop: e.target.value})}
                className="border rounded-lg p-3"
              />
              <input
                type="text"
                placeholder="फसल की अवस्था"
                value={formData.cropStage}
                onChange={(e) => setFormData({...formData, cropStage: e.target.value})}
                className="border rounded-lg p-3"
              />
            </div>
          </div>

          {/* Problem Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">समस्या का विवरण</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="समस्या का शीर्षक (एक पंक्ति में)"
                value={formData.problemTitle}
                onChange={(e) => setFormData({...formData, problemTitle: e.target.value})}
                className="border rounded-lg p-3 w-full"
                required
              />
              <textarea
                placeholder="समस्या का विस्तृत विवरण..."
                value={formData.problemDescription}
                onChange={(e) => setFormData({...formData, problemDescription: e.target.value})}
                className="border rounded-lg p-3 w-full h-32"
                required
              />
              <input
                type="text"
                placeholder="लक्षण (कॉमा से अलग करें)"
                value={formData.symptoms}
                onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                className="border rounded-lg p-3 w-full"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="समस्या कितने दिन से है?"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="border rounded-lg p-3"
                />
                <input
                  type="text"
                  placeholder="प्रभावित क्षेत्र (% या एकड़)"
                  value={formData.affectedArea}
                  onChange={(e) => setFormData({...formData, affectedArea: e.target.value})}
                  className="border rounded-lg p-3"
                />
              </div>
              <textarea
                placeholder="आपने पहले क्या कोशिश की? (वैकल्पिक)"
                value={formData.previousAttempts}
                onChange={(e) => setFormData({...formData, previousAttempts: e.target.value})}
                className="border rounded-lg p-3 w-full h-24"
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Camera className="w-6 h-6 mr-2" />
              फोटो अपलोड करें (वैकल्पिक लेकिन बेहतर निदान के लिए उपयोगी)
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-purple-500 transition">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">फोटो चुनने के लिए क्लिक करें</p>
                  <p className="text-xs text-gray-500 mt-1">फसल की समस्या की तस्वीरें</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              {photos.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Urgency */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">प्राथमिकता</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {urgencyLevels.map(level => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setFormData({...formData, urgency: level.value})}
                  className={`p-4 rounded-lg font-medium transition ${
                    formData.urgency === level.value
                      ? level.color
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-lg mb-1">{level.label}</div>
                  <div className="text-xs">{level.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Consultation Mode */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">सलाह का माध्यम</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {consultationModes.map(mode => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => setFormData({...formData, consultationMode: mode.value})}
                  className={`p-6 border-2 rounded-lg transition ${
                    formData.consultationMode === mode.value
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {mode.icon}
                      <span className="font-bold text-lg">{mode.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">{mode.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">{mode.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Scheduling */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">शेड्यूलिंग (वैकल्पिक)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">पसंदीदा तारीख</label>
                <input
                  type="date"
                  value={formData.requestedDate}
                  onChange={(e) => setFormData({...formData, requestedDate: e.target.value})}
                  className="border rounded-lg p-3 w-full"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">समय स्लॉट</label>
                <select
                  value={formData.requestedTimeSlot}
                  onChange={(e) => setFormData({...formData, requestedTimeSlot: e.target.value})}
                  className="border rounded-lg p-3 w-full"
                >
                  <option value="">समय चुनें</option>
                  <option value="morning_9_12">सुबह (9-12)</option>
                  <option value="afternoon_12_4">दोपहर (12-4)</option>
                  <option value="evening_4_7">शाम (4-7)</option>
                  <option value="anytime">कभी भी</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">अतिरिक्त जानकारी</h2>
            <textarea
              placeholder="कोई अन्य जानकारी जो विशेषज्ञ को पता होनी चाहिए..."
              value={formData.farmerNotes}
              onChange={(e) => setFormData({...formData, farmerNotes: e.target.value})}
              className="border rounded-lg p-3 w-full h-32"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 transition disabled:bg-gray-400 flex items-center justify-center"
          >
            {isSubmitting ? (
              'सबमिट हो रहा है...'
            ) : (
              <>
                <MessageCircle className="w-5 h-5 mr-2" />
                विशेषज्ञ सलाह के लिए अनुरोध करें
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdvisoryServicePage;
