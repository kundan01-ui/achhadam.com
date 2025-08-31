import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import LanguageSelector from '../../components/ui/LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiService } from '../../services/api';

interface BuyerSignupPageProps {
  onBackToLogin: () => void;
  onSwitchUserType: (userType: 'farmer' | 'buyer' | 'transporter') => void;
}

const BuyerSignupPage: React.FC<BuyerSignupPageProps> = ({ onBackToLogin, onSwitchUserType }) => {
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
    
    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.password) {
        alert('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        setIsLoading(false);
        return;
      }

      // Prepare signup data
      const signupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        userType: 'buyer',
        businessName: formData.businessName,
        businessType: formData.businessType,
        gstNumber: formData.gstNumber,
        preferredCrops: formData.preferredCrops,
        city: formData.city,
        state: formData.state,
        district: formData.district,
        paymentTerms: formData.paymentTerms
      };

      console.log('Buyer signup:', signupData);
      
      // Call API service
      const response = await apiService.signup(signupData);
      
      console.log('Signup successful:', response);
      
      // Show success message
      alert('Account created successfully! Please login.');
      
      // Redirect to login
      onBackToLogin();
      
    } catch (error) {
      console.error('Signup failed:', error);
      alert(`Signup failed: ${error instanceof Error ? error.message : 'Something went wrong'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🏪</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          {t('buyer')} {t('signup')}
        </h2>
        <p className="text-gray-600 text-sm">
          {t('step1Desc')}
        </p>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('firstName')} *
          </label>
          <Input
            placeholder={t('enterFirstName')}
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('lastName')} *
          </label>
          <Input
            placeholder={t('enterLastName')}
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('phone')} *
        </label>
        <Input
          type="tel"
          placeholder={t('enterPhone')}
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
          {t('email')} *
        </label>
        <Input
          type="email"
          placeholder={t('enterEmail')}
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
      </div>

      {/* Password Fields */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('password')} *
        </label>
        <Input
          type="password"
          placeholder={t('enterPassword')}
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          minLength={6}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('confirmPassword')} *
        </label>
        <Input
          type="password"
          placeholder={t('enterConfirmPassword')}
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
          {t('agreeTerms')}
        </label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {t('step2')}
        </h2>
        <p className="text-gray-600 text-sm">
          {t('businessInfoDesc')}
        </p>
      </div>

      {/* Business Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('businessName')}
        </label>
        <Input
          placeholder={t('enterBusinessName')}
          value={formData.businessName}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
        />
      </div>

      {/* Business Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('businessType')}
        </label>
        <select
          value={formData.businessType}
          onChange={(e) => handleInputChange('businessType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="individual">{t('individual')}</option>
          <option value="company">{t('company')}</option>
          <option value="partnership">{t('partnership')}</option>
        </select>
      </div>

      {/* GST Number */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('gstNumber')}
        </label>
        <Input
          placeholder={t('enterGSTNumber')}
          value={formData.gstNumber}
          onChange={(e) => handleInputChange('gstNumber', e.target.value)}
        />
      </div>

      {/* Preferred Crops */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('preferredCrops')}
        </label>
        <Input
          placeholder={t('enterPreferredCrops')}
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
          {t('step3')}
        </h2>
        <p className="text-gray-600 text-sm">
          {t('locationPreferencesDesc')}
        </p>
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('city')}
          </label>
          <Input
            placeholder={t('enterCity')}
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('district')}
          </label>
          <Input
            placeholder={t('enterDistrict')}
            value={formData.district}
            onChange={(e) => handleInputChange('district', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('state')}
        </label>
        <Input
          placeholder={t('enterState')}
          value={formData.state}
          onChange={(e) => handleInputChange('state', e.target.value)}
        />
      </div>

      {/* Payment Terms */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('paymentTerms')}
        </label>
        <select
          value={formData.paymentTerms}
          onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7">{t('payment7Days')}</option>
          <option value="15">{t('payment15Days')}</option>
          <option value="30">{t('payment30Days')}</option>
        </select>
      </div>

      {/* Skip for now */}
      <div className="text-center text-sm text-gray-500">
        <p>{t('canFillLater')}</p>
        <p className="mt-1">{t('basicAccountFirst')}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-2 sm:p-4">
      {/* Language Selector */}
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
        <LanguageSelector />
      </div>
      
      <Card className="w-full max-w-sm sm:max-w-md mx-2">
        <CardHeader className="text-center p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
            {t('buyer')} {t('signup')}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
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
                  {t('back')}
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
                    {t('loading')}
                  </div>
                ) : step === 3 ? (
                  t('submit')
                ) : (
                  t('next')
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
                  {t('skipForNow')}
                </button>
              </div>
            )}
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {t('alreadyHaveAccount')}{' '}
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                {t('login')}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerSignupPage;
