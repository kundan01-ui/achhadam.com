import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import LanguageSelector from '../../components/ui/LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';

const BuyerSignupPage: React.FC = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info (Required)
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Business Info (Optional for now)
    businessName: '',
    businessType: 'individual',
    gstNumber: '',
    preferredCrops: [],
    
    // Step 3: Location & Preferences (Optional for now)
    city: '',
    state: '',
    district: '',
    paymentTerms: '7'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement signup logic
    console.log('Buyer signup:', formData);
    
    setTimeout(() => {
      setIsLoading(false);
      if (step < 3) {
        setStep(step + 1);
      }
    }, 2000);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🏪</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          खरीदार के रूप में खाता बनाएं
        </h2>
        <p className="text-gray-600 text-sm">
          सिर्फ कुछ बुनियादी जानकारी दें
        </p>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            पहला नाम *
          </label>
          <Input
            placeholder="पहला नाम"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            अंतिम नाम *
          </label>
          <Input
            placeholder="अंतिम नाम"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          मोबाइल नंबर *
        </label>
        <Input
          type="tel"
          placeholder="10 अंकों का मोबाइल नंबर"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          maxLength={10}
          required
          className="text-center text-lg"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          ईमेल (वैकल्पिक)
        </label>
        <Input
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
        <p className="text-xs text-gray-500">
          बिल और रसीदें ईमेल पर भेजी जाएंगी
        </p>
      </div>

      {/* Password Fields */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          पासवर्ड *
        </label>
        <Input
          type="password"
          placeholder="कम से कम 6 अक्षर"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          minLength={6}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          पासवर्ड दोबारा लिखें *
        </label>
        <Input
          type="password"
          placeholder="पासवर्ड दोबारा लिखें"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          required
        />
      </div>

      {/* Terms */}
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="terms"
          required
          className="mt-1 h-4 w-4 text-blue-600"
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          मैं <span className="text-blue-600 underline">नियम और शर्तों</span> से सहमत हूं
        </label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          व्यवसाय की जानकारी (वैकल्पिक)
        </h2>
        <p className="text-gray-600 text-sm">
          अभी छोड़ सकते हैं, बाद में भर सकते हैं
        </p>
      </div>

      {/* Business Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          व्यवसाय का नाम
        </label>
        <Input
          placeholder="कंपनी या दुकान का नाम"
          value={formData.businessName}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
        />
      </div>

      {/* Business Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          व्यवसाय का प्रकार
        </label>
        <select
          value={formData.businessType}
          onChange={(e) => handleInputChange('businessType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="individual">व्यक्तिगत</option>
          <option value="partnership">साझेदारी</option>
          <option value="private_limited">प्राइवेट लिमिटेड</option>
          <option value="public_limited">पब्लिक लिमिटेड</option>
          <option value="cooperative">सहकारी समिति</option>
          <option value="government">सरकारी</option>
        </select>
      </div>

      {/* GST Number */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          GST नंबर (वैकल्पिक)
        </label>
        <Input
          placeholder="GST नंबर"
          value={formData.gstNumber}
          onChange={(e) => handleInputChange('gstNumber', e.target.value)}
        />
        <p className="text-xs text-gray-500">
          GST नंबर से बेहतर डील्स मिलेंगी
        </p>
      </div>

      {/* Preferred Crops */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          पसंदीदा फसलें
        </label>
        <Input
          placeholder="जैसे: गेहूं, धान, मक्का (कॉमा से अलग करें)"
          value={formData.preferredCrops.join(', ')}
          onChange={(e) => handleInputChange('preferredCrops', e.target.value.split(',').map(crop => crop.trim()))}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          स्थान और प्राथमिकताएं (वैकल्पिक)
        </h2>
        <p className="text-gray-600 text-sm">
          बेहतर सेवा के लिए जानकारी दें
        </p>
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            शहर
          </label>
          <Input
            placeholder="शहर"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            राज्य
          </label>
          <Input
            placeholder="राज्य"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          जिला
        </label>
        <Input
          placeholder="जिला"
          value={formData.district}
          onChange={(e) => handleInputChange('district', e.target.value)}
        />
      </div>

      {/* Payment Terms */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          भुगतान की शर्तें
        </label>
        <select
          value={formData.paymentTerms}
          onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="0">तुरंत भुगतान</option>
          <option value="7">7 दिन</option>
          <option value="15">15 दिन</option>
          <option value="30">30 दिन</option>
          <option value="45">45 दिन</option>
        </select>
        <p className="text-xs text-gray-500">
          किसानों से कितने दिन में भुगतान करेंगे
        </p>
      </div>

      {/* Skip for now */}
      <div className="text-center text-sm text-gray-500">
        <p>बाकी जानकारी बाद में भर सकते हैं</p>
        <p className="mt-1">अभी सिर्फ बुनियादी खाता बनाएं</p>
      </div>
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3].map((stepNumber) => (
        <div key={stepNumber} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            stepNumber <= step
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-500'
          }`}>
            {stepNumber}
          </div>
          {stepNumber < 3 && (
            <div className={`w-12 h-1 mx-2 ${
              stepNumber < step ? 'bg-blue-500' : 'bg-gray-200'
            }`}></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {t('buyer')} {t('signup')}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {renderStepIndicator()}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex space-x-3">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  पीछे जाएं
                </Button>
              )}
              
              <Button
                type={step === 3 ? 'submit' : 'button'}
                onClick={step < 3 ? () => setStep(step + 1) : undefined}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {step === 3 ? 'खाता बन रहा है...' : 'आगे जाएं...'}
                  </div>
                ) : step === 3 ? (
                  'खाता बनाएं'
                ) : (
                  'आगे जाएं'
                )}
              </Button>
            </div>

            {/* Skip Step 2 & 3 */}
            {step === 1 && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  बाद में जानकारी भरें, अभी सिर्फ खाता बनाएं
                </button>
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              पहले से खाता है?{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                लॉगिन करें
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerSignupPage;
