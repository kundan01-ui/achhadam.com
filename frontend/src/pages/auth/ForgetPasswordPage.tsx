import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiService } from '../../services/api';
import { 
  ArrowLeft, 
  Phone, 
  Shield, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface ForgetPasswordPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

type Step = 'phone' | 'otp' | 'new-password' | 'success';

const ForgetPasswordPage: React.FC<ForgetPasswordPageProps> = ({ onBack, onSuccess }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      setError(t('pleaseEnterMobile'));
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError(t('pleaseEnterValidMobile'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formattedPhone = `+91${phone}`;
      const response = await apiService.sendResetOTP(formattedPhone);
      
      if (response.success) {
        setStep('otp');
        setSuccess(t('otpSent'));
        
        // In development, show the OTP
        if (process.env.NODE_ENV === 'development' && response.otp) {
          console.log('🔐 Development OTP:', response.otp);
          setSuccess(`${t('otpSent')} ${t('developmentOTP')} ${response.otp}`);
        }
      } else {
        setError(response.message || t('otpSendError'));
      }
    } catch (error: any) {
      setError(error.message || t('otpSendError'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setError(t('pleaseEnterOTP'));
      return;
    }

    if (otp.length < 4) {
      setError(t('pleaseEnterFullOTP'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formattedPhone = `+91${phone}`;
      const response = await apiService.verifyResetOTP(formattedPhone, otp);
      
      if (response.success) {
        setResetToken(response.resetToken || '');
        setStep('new-password');
        setSuccess(t('otpVerified'));
      } else {
        setError(response.message || t('otpVerifyError'));
      }
    } catch (error: any) {
      setError(error.message || t('otpVerifyError'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      setError(t('pleaseEnterNewPassword'));
      return;
    }

    if (newPassword.length < 6) {
      setError(t('passwordMinLength'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    if (!resetToken) {
      setError(t('resetTokenNotFound'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.resetPassword(resetToken, newPassword);
      
      if (response.success) {
        setStep('success');
        setSuccess(t('passwordResetSuccess'));
      } else {
        setError(response.message || t('passwordResetError'));
      }
    } catch (error: any) {
      setError(error.message || t('passwordResetError'));
    } finally {
      setLoading(false);
    }
  };

  const renderPhoneStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Phone className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('forgotPasswordTitle')}</h2>
        <p className="text-gray-600">{t('forgotPasswordDesc')}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('phone')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">+91</span>
            </div>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="9876543210"
              className="pl-12"
              maxLength={10}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <Button
          onClick={handleSendOTP}
          disabled={loading || !phone.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
        >
                      {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('sendingOTP')}</span>
              </div>
            ) : (
              t('sendOTP')
            )}
        </Button>
      </div>
    </div>
  );

  const renderOTPStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('otpVerification')}</h2>
        <p className="text-gray-600">
          {t('otpSent')}: <span className="font-semibold">+91{phone}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('enterOTP')}
          </label>
          <Input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            className="text-center text-lg tracking-widest"
            maxLength={6}
          />
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            onClick={handleVerifyOTP}
            disabled={loading || !otp.trim()}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('verifying')}</span>
              </div>
            ) : (
              t('verifyOTP')
            )}
          </Button>
          
          <Button
            onClick={() => {
              setStep('phone');
              setOtp('');
              setError('');
            }}
            variant="outline"
            className="px-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-center">
          <button
            onClick={handleSendOTP}
            className="text-blue-600 hover:text-blue-700 text-sm underline"
            disabled={loading}
          >
{t('resendOTP')}
          </button>
        </div>
      </div>
    </div>
  );

  const renderNewPasswordStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('setNewPassword')}</h2>
        <p className="text-gray-600">{t('setNewPasswordDesc')}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('newPassword')}
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('enterNewPassword')}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('confirmNewPassword')}
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('enterPasswordConfirmation')}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            onClick={handleResetPassword}
            disabled={loading || !newPassword.trim() || !confirmPassword.trim()}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('settingPassword')}</span>
              </div>
            ) : (
              t('setPassword')
            )}
          </Button>
          
          <Button
            onClick={() => {
              setStep('otp');
              setNewPassword('');
              setConfirmPassword('');
              setError('');
            }}
            variant="outline"
            className="px-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('success')}</h2>
        <p className="text-gray-600">{t('passwordResetSuccess')}</p>
      </div>

      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{t('passwordUpdated')}</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            {t('loginWithNewPassword')}
          </p>
        </div>

        <Button
          onClick={onSuccess}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
        >
{t('login')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
{t('back')}
              </Button>
              <CardTitle className="text-xl font-bold text-gray-900">
                {t('passwordReset')}
              </CardTitle>
              <div className="w-16"></div>
            </div>
          </CardHeader>
          
          <CardContent className="px-6 pb-6">
            {step === 'phone' && renderPhoneStep()}
            {step === 'otp' && renderOTPStep()}
            {step === 'new-password' && renderNewPasswordStep()}
            {step === 'success' && renderSuccessStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
