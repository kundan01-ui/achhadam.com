import React from 'react';
import { validatePasswordStrength, getPasswordStrengthColor, getPasswordStrengthBgColor } from '../../utils/passwordUtils';
import { Check, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password, 
  showRequirements = true 
}) => {
  const { t } = useLanguage();
  const strength = validatePasswordStrength(password);
  const strengthColor = getPasswordStrengthColor(strength.score);
  const bgColor = getPasswordStrengthBgColor(strength.score);

  const getStrengthText = (score: number) => {
    if (score <= 1) return t('veryWeakPassword');
    if (score <= 2) return t('weakPassword');
    if (score <= 3) return t('fairPassword');
    if (score <= 4) return t('goodPassword');
    if (score <= 5) return t('strongPassword');
    return t('veryStrongPassword');
  };

  const requirements = [
    { key: 'length', label: t('atLeast8Characters'), met: strength.requirements.length },
    { key: 'uppercase', label: t('oneUppercaseLetter'), met: strength.requirements.uppercase },
    { key: 'lowercase', label: t('oneLowercaseLetter'), met: strength.requirements.lowercase },
    { key: 'number', label: t('oneNumber'), met: strength.requirements.number },
    { key: 'special', label: t('oneSpecialCharacter'), met: strength.requirements.special },
  ];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">{t('passwordStrength')}:</span>
          <span className={strengthColor}>{getStrengthText(strength.score)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${bgColor}`}
            style={{ width: `${(strength.score / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="space-y-1">
          {requirements.map((req) => (
            <div key={req.key} className="flex items-center space-x-2 text-xs">
              {req.met ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <X className="w-3 h-3 text-gray-400" />
              )}
              <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
