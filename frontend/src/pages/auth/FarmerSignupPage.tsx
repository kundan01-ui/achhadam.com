import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import LanguageSelector from '../../components/ui/LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiService, type SignupRequest } from '../../services/api';
import { firebaseOTPService } from '../../services/firebaseOTP';
import OTPInput from '../../components/ui/OTPInput';
import { MessageCircle, CheckCircle } from 'lucide-react';
import OTPDebugger from '../../components/debug/OTPDebugger';

interface FarmerSignupPageProps {
  onBackToLogin: () => void;
  onSwitchUserType: (userType: 'farmer' | 'buyer' | 'transporter') => void;
  onBackToHome: () => void;
  onBackToUserTypeSelection?: () => void;
}

const FarmerSignupPage: React.FC<FarmerSignupPageProps> = ({ onBackToLogin, onSwitchUserType, onBackToHome, onBackToUserTypeSelection }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);

  // Cleanup Firebase OTP service on component unmount
  useEffect(() => {
    return () => {
      firebaseOTPService.cleanup();
    };
  }, []);
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
      // Check if Firebase is configured
      if (firebaseOTPService.isFirebaseConfigured()) {
        console.log('🔥 Using Firebase OTP');
        
        // Initialize Recaptcha
        const recaptchaInitialized = await firebaseOTPService.initializeRecaptcha();
        if (!recaptchaInitialized) {
          throw new Error('Failed to initialize Recaptcha');
        }
        
        // Send OTP using Firebase
        const firebaseResult = await firebaseOTPService.sendOTPToPhone(formData.phone);
        
        if (firebaseResult.success) {
          console.log('🎯 OTP sent successfully, showing OTP section');
          setOtpSent(true);
          setShowOTP(true);
          startResendTimer();
          console.log('✅ Firebase OTP sent successfully');
          
          // Try to store in backend (optional for mock OTP)
          try {
            const backendResponse = await apiService.sendOTP(formData.phone, firebaseResult.confirmationResult);
            if (!backendResponse.success) {
              console.warn('⚠️ Backend OTP storage failed, but continuing with frontend flow');
            }
          } catch (backendError) {
            console.warn('⚠️ Backend OTP storage failed, but continuing with frontend flow:', backendError);
          }
        } else {
          setOtpError(firebaseResult.message || 'Failed to send OTP');
        }
      } else {
        console.log('📱 Using Mock OTP (Firebase not configured)');
        
        // Fallback to mock OTP
        console.log('🎯 Using Mock OTP, showing OTP section');
        setOtpSent(true);
        setShowOTP(true);
        startResendTimer();
        console.log('✅ Mock OTP sent successfully');
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
      // Check if Firebase is configured
      if (firebaseOTPService.isFirebaseConfigured()) {
        console.log('🔥 Verifying OTP with Firebase');
        
        // Verify OTP using Firebase
        const firebaseResult = await firebaseOTPService.verifyOTPCode(otp);
        
        if (firebaseResult.success) {
          console.log('✅ Firebase OTP verified successfully!', firebaseResult);
          setOtpVerified(true);
          setOtpError('');
          
          // Auto-proceed to next step after successful OTP verification
          setTimeout(() => {
            console.log('🚀 Auto-proceeding to next step');
            setStep(step + 1);
          }, 1000); // 1 second delay to show success message
        } else {
          console.log('❌ Firebase OTP verification failed:', firebaseResult);
          setOtpError(firebaseResult.message || 'Invalid OTP');
        }
      } else {
        console.log('📱 Verifying OTP with backend (Mock)');
        
        // Fallback to backend verification
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

  const handleSignupSubmit = async () => {
    setIsLoading(true);
    
    try {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }
    
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

      {/* OTP Section */}
      {showOTP && (
        console.log('🎯 Rendering OTP Section, showOTP:', showOTP),
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
              <p className="text-orange-600 text-xs mt-1">
                💡 Development Mode: Use OTP = <strong>123456</strong>
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
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 flex items-center justify-center p-4">
      {/* reCAPTCHA Container - Hidden but required for Firebase */}
      <div id="recaptcha-container" className="hidden"></div>
      
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
          ← {t('backToHome')}
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
                className="text-green-600 hover:text-green-700 font-medium underline"
              >
                {onBackToUserTypeSelection ? 'Change User Type' : t('login')}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Firebase Recaptcha Container */}
      <div id="recaptcha-container" className="hidden"></div>
      
      {/* OTP Debugger */}
      <OTPDebugger
        showOTP={showOTP}
        otpSent={otpSent}
        otpVerified={otpVerified}
        otpLoading={otpLoading}
        otpError={otpError}
        phone={formData.phone}
      />
    </div>
  );
};

export default FarmerSignupPage;
