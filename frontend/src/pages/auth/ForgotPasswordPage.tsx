import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import LanguageSelector from '../../components/ui/LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowLeft, Mail, Shield, CheckCircle } from 'lucide-react';
import { sendPasswordReset } from '../../services/firebaseEmailAuth';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBackToLogin }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'success'>('email');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSendResetEmail = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      console.log('🔐 Sending password reset email to:', email);
      const result = await sendPasswordReset(email);

      if (!result.success) {
        setError(result.error || 'Failed to send password reset email');
        return;
      }

      console.log('✅ Password reset email sent successfully!');
      setSuccessMessage(result.message || 'Password reset email sent!');
      setStep('success');

    } catch (error: any) {
      console.error('❌ Error sending password reset email:', error);
      setError(error.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
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
            {step === 'email' ? (
              <Shield className="w-8 h-8 text-green-600" />
            ) : (
              <CheckCircle className="w-8 h-8 text-green-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {t('forgotPassword')}
          </CardTitle>
          <p className="text-gray-600 text-sm">
            {step === 'email' && 'Enter your email to receive password reset link'}
            {step === 'success' && 'Check your email for reset link'}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 'email' && (
            <div className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    required
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  We'll send a password reset link to this email
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                  {error}
                </div>
              )}

              {/* Send Reset Email Button */}
              <Button
                onClick={handleSendResetEmail}
                disabled={isLoading || !email}
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              {/* Back to Login Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-sm text-green-600 hover:text-green-800 underline"
                >
                  Remember your password? Login
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-600 font-medium text-lg">
                Reset Link Sent!
              </p>
              <p className="text-gray-600 text-sm">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-gray-500 text-xs">
                Please check your email inbox (and spam folder) for the reset link. The link will expire in 1 hour.
              </p>

              {successMessage && (
                <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm border border-green-200">
                  {successMessage}
                </div>
              )}

              <Button
                onClick={handleBackToLogin}
                className="w-full"
              >
                Back to Login
              </Button>

              {/* Resend Link */}
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Didn't receive email? Try again
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;



