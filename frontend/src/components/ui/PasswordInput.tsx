import React, { useState } from 'react';
import { Input } from './Input';
import { Eye, EyeOff } from 'lucide-react';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { useLanguage } from '../../contexts/LanguageContext';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showStrength?: boolean;
  showRequirements?: boolean;
  minLength?: number;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder,
  showStrength = false,
  showRequirements = true,
  minLength = 6,
  required = false,
  className = '',
  id,
  name,
}) => {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || t('enterPassword')}
          minLength={minLength}
          required={required}
          className={`pr-10 ${className}`}
          id={id}
          name={name}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          title={showPassword ? t('hidePassword') : t('showPassword')}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      
      {showStrength && (
        <PasswordStrengthIndicator 
          password={value} 
          showRequirements={showRequirements}
        />
      )}
    </div>
  );
};

export default PasswordInput;
