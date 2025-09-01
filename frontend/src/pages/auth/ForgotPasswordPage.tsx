import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import LanguageSelector from '../../components/ui/LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowLeft, Phone, Shield } from 'lucide-react';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBackToLogin }) => {
  const { t } = useLanguage();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [otp, setOtp] = useState('');

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep('otp');
      alert(`OTP sent to ${phone}`);
    } catch (error) {
      alert('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      alert('Please enter a valid OTP');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep('success');
    } catch (error) {
      alert('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    alert('Password reset successful! Please login with your new password.');
    onBackToLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 flex items-center justify-center p-4">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      {/* Back to Login Button */}
      <div className="absolute top-4 left-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBackToLogin}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToLogin')}
        </Button>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {t('forgotPassword')}
          </CardTitle>
          <p className="text-gray-600">
            {step === 'phone' && 'Enter your phone number to reset password'}
            {step === 'otp' && 'Enter the OTP sent to your phone'}
            {step === 'success' && 'Password reset successful!'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {step === 'phone' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('phone')} *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder={t('enterPhone')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                    required
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {t('phoneHelp')}
                </p>
              </div>
              
              <Button
                onClick={handleSendOTP}
                disabled={isLoading || !phone || phone.length < 10}
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {t('sending')}...
                  </div>
                ) : (
                  `Send OTP to ${phone}`
                )}
              </Button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  OTP *
                </label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                  className="text-center text-lg tracking-widest"
                />
                <p className="text-xs text-gray-500">
                  OTP sent to {phone}
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('phone')}
                  className="flex-1"
                >
                  {t('back')}
                </Button>
                <Button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || !otp || otp.length < 4}
                  className="flex-1"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">
                Password reset successful!
              </p>
              <p className="text-gray-600 text-sm">
                You can now login with your new password.
              </p>
              
              <Button
                onClick={handleResetPassword}
                className="w-full"
              >
                Continue to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;



