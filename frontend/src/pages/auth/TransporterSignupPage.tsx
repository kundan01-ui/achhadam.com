import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import LanguageSelector from '../../components/ui/LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';

interface TransporterSignupPageProps {
  onBackToLogin: () => void;
  onSwitchUserType: (userType: 'farmer' | 'buyer' | 'transporter') => void;
}

const TransporterSignupPage: React.FC<TransporterSignupPageProps> = ({ onBackToLogin, onSwitchUserType }) => {
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
    
    // Step 2: Vehicle Info (Optional for now)
    vehicleType: 'truck',
    vehicleNumber: '',
    vehicleCapacity: '',
    vehicleCapacityUnit: 'tons',
    licenseNumber: '',
    
    // Step 3: Business Info (Optional for now)
    businessName: '',
    city: '',
    state: '',
    district: '',
    preferredRoutes: []
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
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
          {t('transporter')} {t('signup')}
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
          className="mt-1 h-4 w-4 text-orange-600"
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
          {t('vehicleInfoDesc')}
        </p>
      </div>

      {/* Vehicle Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('vehicleType')}
        </label>
        <select
          value={formData.vehicleType}
          onChange={(e) => handleInputChange('vehicleType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="truck">{t('truck')}</option>
          <option value="tractor">{t('tractor')}</option>
          <option value="miniTruck">{t('miniTruck')}</option>
          <option value="other">{t('other')}</option>
        </select>
      </div>

      {/* Vehicle Number */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('vehicleNumber')}
        </label>
        <Input
          placeholder={t('enterVehicleNumber')}
          value={formData.vehicleNumber}
          onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
        />
      </div>

      {/* Vehicle Capacity */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('vehicleCapacity')}
          </label>
          <Input
            type="number"
            placeholder="Capacity"
            value={formData.vehicleCapacity}
            onChange={(e) => handleInputChange('vehicleCapacity', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Unit
          </label>
          <select
            value={formData.vehicleCapacityUnit}
            onChange={(e) => handleInputChange('vehicleCapacityUnit', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="tons">{t('tons')}</option>
            <option value="quintals">{t('quintals')}</option>
            <option value="kg">{t('kg')}</option>
          </select>
        </div>
      </div>

      {/* License Number */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('licenseNumber')}
        </label>
        <Input
          placeholder={t('enterLicenseNumber')}
          value={formData.licenseNumber}
          onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
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

      {/* Preferred Routes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('preferredRoutes')}
        </label>
        <Input
          placeholder={t('enterPreferredRoutes')}
          value={formData.preferredRoutes.join(', ')}
          onChange={(e) => handleInputChange('preferredRoutes', e.target.value.split(',').map(route => route.trim()))}
        />
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
                className="text-orange-600 hover:text-orange-700 font-medium underline"
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

export default TransporterSignupPage;
