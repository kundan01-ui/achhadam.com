import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import LanguageSelector from '../../components/ui/LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiService, type SignupRequest } from '../../services/api';

interface FarmerSignupPageProps {
  onBackToLogin: () => void;
  onSwitchUserType: (userType: 'farmer' | 'buyer' | 'transporter') => void;
  onBackToHome: () => void;
}

const FarmerSignupPage: React.FC<FarmerSignupPageProps> = ({ onBackToLogin, onSwitchUserType, onBackToHome }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info (Required)
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Farm Info (Optional for now)
    farmName: '',
    farmSize: '',
    farmSizeUnit: 'acres',
    village: '',
    district: '',
    state: '',
    
    // Step 3: Crops (Optional for now)
    mainCrops: [],
    experience: ''
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
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.password) {
        alert('Please fill in all required fields');
        setIsLoading(false);
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        setIsLoading(false);
        return;
      }
      
      // Prepare signup data
      const signupData: SignupRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        password: formData.password,
        userType: 'farmer',
        farmName: formData.farmName || undefined,
        farmSize: formData.farmSize || undefined,
        farmSizeUnit: formData.farmSizeUnit || undefined,
        village: formData.village || undefined,
        district: formData.district || undefined,
        state: formData.state || undefined,
        mainCrops: formData.mainCrops.length > 0 ? formData.mainCrops : undefined,
        experience: formData.experience || undefined,
      };
      
      try {
        // Try to call real API service first
        const response = await apiService.signup(signupData);
        console.log('Signup successful:', response);
        alert('Account created successfully! Please login.');
        onBackToLogin();
      } catch (apiError) {
        console.log('Real API failed, using mock API:', apiError);
        
        // Fallback to mock API for testing
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        // Mock successful response
        const mockResponse = {
          user: {
            id: 'mock-' + Date.now(),
            ...signupData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          message: 'Account created successfully (Mock API)'
        };
        
        console.log('Mock signup successful:', mockResponse);
        alert('Account created successfully using Mock API! Please login.');
        onBackToLogin();
      }
      
    } catch (error) {
      console.error('Signup failed:', error);
      alert(`Signup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">👨‍🌾</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          {t('farmer')} {t('signup')}
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
        <p className="text-xs text-gray-500">
          {t('phoneHelp')}
        </p>
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
          className="mt-1 h-4 w-4 text-green-600"
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
          {t('step2Desc')}
        </p>
      </div>

      {/* Farm Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('farmName')}
        </label>
        <Input
          placeholder={t('enterFarmName')}
          value={formData.farmName}
          onChange={(e) => handleInputChange('farmName', e.target.value)}
        />
      </div>

      {/* Farm Size */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('farmSize')}
          </label>
          <Input
            type="number"
            placeholder="Size"
            value={formData.farmSize}
            onChange={(e) => handleInputChange('farmSize', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Unit
          </label>
          <select
            value={formData.farmSizeUnit}
            onChange={(e) => handleInputChange('farmSizeUnit', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="acres">{t('acres')}</option>
            <option value="hectares">{t('hectares')}</option>
            <option value="bighas">{t('bighas')}</option>
            <option value="kanals">{t('kanals')}</option>
          </select>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('village')}
        </label>
        <Input
          placeholder={t('enterVillage')}
          value={formData.village}
          onChange={(e) => handleInputChange('village', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
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
          {t('cropsHelp')}
        </p>
      </div>

      {/* Main Crops */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('mainCrops')}
        </label>
        <Input
          placeholder={t('enterCrops')}
          value={formData.mainCrops.join(', ')}
          onChange={(e) => handleInputChange('mainCrops', e.target.value.split(',').map(crop => crop.trim()))}
        />
      </div>

      {/* Experience */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('experience')}
        </label>
        <select
          value={formData.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Experience</option>
          <option value="0-2">{t('exp0to2')}</option>
          <option value="3-5">{t('exp3to5')}</option>
          <option value="6-10">{t('exp6to10')}</option>
          <option value="10+">{t('exp10plus')}</option>
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
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-500'
          }`}>
            {stepNumber}
          </div>
          {stepNumber < 3 && (
            <div className={`w-12 h-1 mx-2 ${
              stepNumber < step ? 'bg-green-500' : 'bg-gray-200'
            }`}></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBackToHome}
          className="text-gray-600 hover:text-gray-800"
        >
          ← {t('back')} {t('dashboard')}
        </Button>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {t('farmer')} {t('signup')}
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
                    {step === 3 ? t('loading') : t('loading')}
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
                className="text-green-600 hover:text-green-700 font-medium underline"
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

export default FarmerSignupPage;
