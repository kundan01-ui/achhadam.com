import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import LanguageSelector from '../../components/ui/LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';

const TransporterSignupPage: React.FC = () => {
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
    
    // Step 2: Transport Info (Optional for now)
    companyName: '',
    vehicleTypes: [],
    serviceAreas: [],
    licenses: [],
    
    // Step 3: Business Details (Optional for now)
    city: '',
    state: '',
    district: '',
    insuranceDetails: {
      hasInsurance: false,
      policyNumber: '',
      company: ''
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement signup logic
    console.log('Transporter signup:', formData);
    
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
        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🚛</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          ट्रांसपोर्टर के रूप में खाता बनाएं
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
          className="mt-1 h-4 w-4 text-orange-600"
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          मैं <span className="text-orange-600 underline">नियम और शर्तों</span> से सहमत हूं
        </label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          परिवहन की जानकारी (वैकल्पिक)
        </h2>
        <p className="text-gray-600 text-sm">
          अभी छोड़ सकते हैं, बाद में भर सकते हैं
        </p>
      </div>

      {/* Company Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          कंपनी का नाम (वैकल्पिक)
        </label>
        <Input
          placeholder="कंपनी का नाम"
          value={formData.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
        />
        <p className="text-xs text-gray-500">
          अगर कंपनी में काम करते हैं तो भरें
        </p>
      </div>

      {/* Vehicle Types */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          वाहन के प्रकार
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'truck', label: 'ट्रक', icon: '🚛' },
            { value: 'trailer', label: 'ट्रेलर', icon: '🚚' },
            { value: 'pickup', label: 'पिकअप', icon: '🛻' },
            { value: 'tempo', label: 'टेम्पो', icon: '🚐' },
            { value: 'mini_truck', label: 'मिनी ट्रक', icon: '🚛' },
            { value: 'refrigerated', label: 'रेफ्रिजरेटेड', icon: '❄️' }
          ].map((vehicle) => (
            <button
              key={vehicle.value}
              type="button"
              onClick={() => {
                const current = formData.vehicleTypes;
                const updated = current.includes(vehicle.value)
                  ? current.filter(v => v !== vehicle.value)
                  : [...current, vehicle.value];
                handleInputChange('vehicleTypes', updated);
              }}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.vehicleTypes.includes(vehicle.value)
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="text-xl mb-1">{vehicle.icon}</div>
              <div className="text-xs font-medium">{vehicle.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Service Areas */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          सेवा क्षेत्र
        </label>
        <Input
          placeholder="जैसे: दिल्ली, मुंबई, बैंगलोर (कॉमा से अलग करें)"
          value={formData.serviceAreas.join(', ')}
          onChange={(e) => handleInputChange('serviceAreas', e.target.value.split(',').map(area => area.trim()))}
        />
        <p className="text-xs text-gray-500">
          कहाँ-कहाँ जाते हैं?
        </p>
      </div>

      {/* Licenses */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          लाइसेंस नंबर
        </label>
        <Input
          placeholder="ड्राइविंग लाइसेंस नंबर"
          value={formData.licenses.join(', ')}
          onChange={(e) => handleInputChange('licenses', e.target.value.split(',').map(license => license.trim()))}
        />
        <p className="text-xs text-gray-500">
          एक या ज्यादा लाइसेंस नंबर (कॉमा से अलग करें)
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          व्यवसाय की जानकारी (वैकल्पिक)
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

      {/* Insurance */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          बीमा की जानकारी
        </label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hasInsurance"
              checked={formData.insuranceDetails.hasInsurance}
              onChange={(e) => handleInputChange('insuranceDetails', {
                ...formData.insuranceDetails,
                hasInsurance: e.target.checked
              })}
              className="h-4 w-4 text-orange-600"
            />
            <label htmlFor="hasInsurance" className="text-sm text-gray-600">
              वाहन का बीमा है
            </label>
          </div>
          
          {formData.insuranceDetails.hasInsurance && (
            <div className="space-y-2 pl-6">
              <Input
                placeholder="पॉलिसी नंबर"
                value={formData.insuranceDetails.policyNumber}
                onChange={(e) => handleInputChange('insuranceDetails', {
                  ...formData.insuranceDetails,
                  policyNumber: e.target.value
                })}
              />
              <Input
                placeholder="बीमा कंपनी का नाम"
                value={formData.insuranceDetails.company}
                onChange={(e) => handleInputChange('insuranceDetails', {
                  ...formData.insuranceDetails,
                  company: e.target.value
                })}
              />
            </div>
          )}
        </div>
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
              ? 'bg-orange-500 text-white'
              : 'bg-gray-200 text-gray-500'
          }`}>
            {stepNumber}
          </div>
          {stepNumber < 3 && (
            <div className={`w-12 h-1 mx-2 ${
              stepNumber < step ? 'bg-orange-500' : 'bg-gray-200'
            }`}></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center p-4">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {t('transporter')} {t('signup')}
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
                className="text-orange-600 hover:text-orange-700 font-medium underline"
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

export default TransporterSignupPage;
