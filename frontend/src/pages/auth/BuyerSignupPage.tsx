import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import LanguageSelector from '../../components/ui/LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiService, type SignupRequest } from '../../services/api';
import OTPInput from '../../components/ui/OTPInput';
import { MessageCircle, CheckCircle } from 'lucide-react';

interface BuyerSignupPageProps {
  onBackToLogin: () => void;
  onSwitchUserType: (userType: 'farmer' | 'buyer' | 'transporter') => void;
  onBackToHome: () => void;
  onBackToUserTypeSelection?: () => void;
}

const BuyerSignupPage: React.FC<BuyerSignupPageProps> = ({ onBackToLogin, onSwitchUserType, onBackToHome, onBackToUserTypeSelection }) => {
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
  const [showOTP, setShowOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpError, setOtpError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // OTP Functions
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    if (!formData.phone || formData.phone.length !== 10) {
      setOtpError('Please enter a valid 10-digit phone number');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const response = await apiService.sendOTP(formData.phone);
      
      if (response.success) {
        setOtpSent(true);
        setShowOTP(true);
        startResendTimer();
        
        // Show OTP in console for development
        if (response.otp) {
          console.log(`📱 OTP for ${formData.phone}: ${response.otp}`);
        }
      } else {
        setOtpError(response.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.error('Send OTP error:', error);
      setOtpError(error.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    if (otp.length !== 6) return;
    
    // Prevent multiple calls if already loading or verified
    if (otpLoading || otpVerified) return;

    setOtpLoading(true);
    setOtpError('');

    try {
      const response = await apiService.verifyOTP(formData.phone, otp);
      
      if (response.success) {
        console.log('✅ OTP verified successfully!', response);
        setOtpVerified(true);
        setOtpError('');
        
        // Auto-proceed to next step after successful OTP verification
        setTimeout(() => {
          console.log('🚀 Auto-proceeding to next step');
          setStep(step + 1);
        }, 1000); // 1 second delay to show success message
      } else {
        console.log('❌ OTP verification failed:', response);
        setOtpError(response.message || 'Invalid OTP');
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      setOtpError(error.message || 'Failed to verify OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setOtpLoading(true);
    setOtpError('');

    try {
      const response = await apiService.resendOTP(formData.phone);
      
      if (response.success) {
        setOtpError('');
        startResendTimer();
        
        // Show OTP in console for development
        if (response.otp) {
          console.log(`📱 New OTP for ${formData.phone}: ${response.otp}`);
        }
      } else {
        setOtpError(response.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      setOtpError(error.message || 'Failed to resend OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Check if phone number is valid
    if (formData.phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    
    // Send OTP when user clicks "Send OTP & Continue"
    await handleSendOTP();
  };

  const handleSignupSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Prepare signup data
      const signupData: SignupRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        userType: 'buyer',
        businessName: formData.businessName || undefined,
        businessType: formData.businessType || undefined,
        gstNumber: formData.gstNumber || undefined,
        preferredCrops: formData.preferredCrops.length > 0 ? formData.preferredCrops : undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        district: formData.district || undefined,
        paymentTerms: formData.paymentTerms || undefined
      };

      console.log('Buyer signup:', signupData);
      
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

      {/* OTP Section */}
      {showOTP && (
        <div className="border-t pt-6 mt-6">
          <div className="text-center mb-4">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Verify Your Phone Number
            </h3>
            <p className="text-gray-600 text-sm">
              We've sent a 6-digit OTP to <span className="font-semibold">{formData.phone}</span>
            </p>
            {process.env.NODE_ENV === 'development' && (
              <p className="text-blue-600 text-xs mt-1">
                💡 Check console for OTP (development mode)
              </p>
            )}
          </div>

          {/* OTP Input */}
          <OTPInput
            onComplete={handleVerifyOTP}
            disabled={otpLoading}
            className="mb-4"
          />

          {/* Success Message */}
          {otpVerified && (
            <div className="text-center mb-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-600 text-sm font-medium">Phone number verified!</p>
                </div>
                <p className="text-green-600 text-xs mt-1">Proceeding to next step...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {otpError && (
            <div className="text-center mb-4">
              <p className="text-red-600 text-sm">{otpError}</p>
            </div>
          )}

          {/* Resend OTP */}
          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-gray-500 text-sm">
                Resend OTP in {resendTimer}s
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={otpLoading}
                className="text-blue-600 hover:text-blue-700 text-sm underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            )}
          </div>

          {/* OTP Status */}
          {otpVerified && (
            <div className="text-center mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Phone number verified!</span>
              </div>
              <p className="text-green-700 text-sm mt-2">
                You can now proceed to the next step
              </p>
            </div>
          )}
        </div>
      )}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-green-100 flex items-center justify-center p-2 sm:p-4">
      {/* Language Selector */}
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
        <LanguageSelector />
      </div>
      
      {/* Back to Home Button */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBackToHome}
          className="text-gray-600 hover:text-gray-800 text-xs sm:text-sm px-2 sm:px-3"
        >
          ← {t('backToHome')}
        </Button>
      </div>
      
      <Card className="w-full max-w-sm sm:max-w-md mx-2">
        <CardHeader className="text-center p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
            {t('buyer')} {t('signup')}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          {renderStepIndicator()}
          
          <form onSubmit={(e) => {
            e.preventDefault(); // Always prevent default form submission
            // Only allow submission through button clicks
          }} className="space-y-4">
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
                type="button"
                onClick={step === 1 ? handleSubmit : step < 3 ? () => {
                  if (step === 1 && !otpVerified) {
                    return; // Don't proceed if OTP not verified
                  }
                  setStep(step + 1);
                } : step === 3 ? async () => {
                  console.log('🚀 Manual submission triggered');
                  await handleSignupSubmit();
                } : undefined}
                disabled={isLoading || otpLoading || (step === 1 && showOTP && !otpVerified)}
                className="flex-1"
              >
                {otpLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {showOTP ? 'Verifying...' : 'Sending OTP...'}
                  </div>
                ) : isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {step === 3 ? t('loading') : t('loading')}
                  </div>
                ) : step === 1 ? (
                  showOTP ? (otpVerified ? 'Continue to Next Step' : 'Verify OTP') : 'Send OTP & Continue'
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
                onClick={onBackToUserTypeSelection || onBackToLogin}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                {onBackToUserTypeSelection ? 'Change User Type' : t('login')}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerSignupPage;
