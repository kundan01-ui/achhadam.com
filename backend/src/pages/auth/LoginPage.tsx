import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import LanguageSelector from '../../components/ui/LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';

interface LoginPageProps {
  onSignupClick: () => void;
  onUserTypeSelect: (userType: 'farmer' | 'buyer' | 'transporter') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSignupClick, onUserTypeSelect }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    userType: 'farmer'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement login logic
    console.log('Login attempt:', formData);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🌾</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {t('welcome')}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {t('login')}
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t('iAm')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'farmer', label: t('farmer'), icon: '👨‍🌾' },
                  { value: 'buyer', label: t('buyer'), icon: '🏪' },
                  { value: 'transporter', label: t('transporter'), icon: '🚛' }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('userType', type.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.userType === type.value
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{type.icon}</div>
                    <div className="text-xs font-medium">{type.label}</div>
                  </button>
                ))}
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

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t('password')} *
              </label>
              <Input
                type="password"
                placeholder={t('enterPassword')}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="text-center text-lg"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-green-600 hover:text-green-700 underline"
              >
                {t('forgotPassword')}
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-lg font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {t('loading')}
                </div>
              ) : (
                t('login')
              )}
            </Button>

                        {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t('or')}</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600">
                {t('dontHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={onSignupClick}
                  className="text-green-600 hover:text-green-700 font-medium underline"
                >
                  {t('signup')}
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
