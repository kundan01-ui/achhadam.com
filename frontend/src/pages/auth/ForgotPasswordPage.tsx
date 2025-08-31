import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  CheckCircle,
  Clock
} from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [resetMethod, setResetMethod] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateEmailStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (resetMethod === 'email') {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    } else {
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtpStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.otp) {
      newErrors.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = 'Please enter a valid 6-digit OTP';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateEmailStep()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOtpSent(true);
      setStep('otp');
      setCountdown(60);
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      setErrors({ general: 'Failed to send OTP. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateOtpStep()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStep('reset');
    } catch (error) {
      setErrors({ otp: 'Invalid OTP. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validateResetStep()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - redirect to login
      console.log('Password reset successful');
      // You can add navigation logic here
      
    } catch (error) {
      setErrors({ general: 'Failed to reset password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    setCountdown(60);
    setOtpSent(true);
    // Add resend OTP logic here
  };

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strengthMap = [
      { label: 'Very Weak', color: 'text-error' },
      { label: 'Weak', color: 'text-error' },
      { label: 'Fair', color: 'text-warning' },
      { label: 'Good', color: 'text-success' },
      { label: 'Strong', color: 'text-success' }
    ];

    return { score, ...strengthMap[score - 1] };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-green via-secondary-green to-light-green flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setStep('email')}
            className="text-white hover:bg-white hover:bg-opacity-20"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Login
          </Button>
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-agricultural rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-text-dark">
              {step === 'email' && 'Forgot Password'}
              {step === 'otp' && 'Verify OTP'}
              {step === 'reset' && 'Reset Password'}
            </CardTitle>
            <p className="text-text-light">
              {step === 'email' && 'Enter your email or phone to receive a reset code'}
              {step === 'otp' && 'Enter the 6-digit code sent to your device'}
              {step === 'reset' && 'Create a new password for your account'}
            </p>
          </CardHeader>

          <CardContent>
            {/* Step 1: Email/Phone Input */}
            {step === 'email' && (
              <div className="space-y-6">
                {/* Reset Method Toggle */}
                <div className="flex bg-neutral-gray rounded-agricultural p-1">
                  <button
                    type="button"
                    onClick={() => setResetMethod('email')}
                    className={`flex-1 py-2 px-4 rounded-agricultural text-sm font-medium transition-all duration-200 ${
                      resetMethod === 'email'
                        ? 'bg-white text-primary-green shadow-agricultural'
                        : 'text-text-light hover:text-text-dark'
                    }`}
                  >
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetMethod('phone')}
                    className={`flex-1 py-2 px-4 rounded-agricultural text-sm font-medium transition-all duration-200 ${
                      resetMethod === 'phone'
                        ? 'bg-white text-primary-green shadow-agricultural'
                        : 'text-text-light hover:text-text-dark'
                    }`}
                  >
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone
                  </button>
                </div>

                {resetMethod === 'email' ? (
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    leftIcon={<Mail className="w-5 h-5" />}
                    error={errors.email}
                    required
                  />
                ) : (
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    leftIcon={<Phone className="w-5 h-5" />}
                    error={errors.phone}
                    required
                  />
                )}

                {errors.general && (
                  <p className="text-error text-sm text-center">{errors.general}</p>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleSendOtp}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Send Reset Code
                </Button>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 'otp' && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-text-light mb-2">
                    We've sent a 6-digit code to{' '}
                    <span className="font-medium text-text-dark">
                      {resetMethod === 'email' ? formData.email : formData.phone}
                    </span>
                  </p>
                  <p className="text-sm text-text-light">
                    Enter the code below to continue
                  </p>
                </div>

                <Input
                  label="OTP Code"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={(e) => handleInputChange('otp', e.target.value)}
                  maxLength={6}
                  error={errors.otp}
                  required
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-text-light" />
                    <span className="text-sm text-text-light">
                      {countdown > 0 ? `${countdown}s` : 'Code expired'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0}
                    className="text-sm text-primary-green hover:text-secondary-green font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend Code
                  </button>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleVerifyOtp}
                  loading={isLoading}
                  disabled={isLoading || countdown === 0}
                >
                  Verify OTP
                </Button>
              </div>
            )}

            {/* Step 3: Password Reset */}
            {step === 'reset' && (
              <div className="space-y-6">
                <Input
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  leftIcon={<Lock className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                  error={errors.newPassword}
                  required
                />

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-light">Password Strength:</span>
                      <span className={`font-medium ${passwordStrength.color}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.score <= 2 ? 'bg-error' :
                          passwordStrength.score === 3 ? 'bg-warning' : 'bg-success'
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <Input
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  leftIcon={<Lock className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                  error={errors.confirmPassword}
                  required
                />

                {errors.general && (
                  <p className="text-error text-sm text-center">{errors.general}</p>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleResetPassword}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Reset Password
                </Button>
              </div>
            )}
          </CardContent>

          {/* Success Message */}
          {step === 'reset' && !isLoading && (
            <CardFooter className="justify-center pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-success">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Password reset successful!</span>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;



