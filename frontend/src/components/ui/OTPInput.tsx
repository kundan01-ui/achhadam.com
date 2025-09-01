import React, { useState, useRef, useEffect } from 'react';
import { Input } from './Input';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
  className?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({ 
  length = 6, 
  onComplete, 
  disabled = false,
  className = ''
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  useEffect(() => {
    // Check if OTP is complete
    if (otp.every(digit => digit !== '') && otp.join('').length === length) {
      onComplete(otp.join(''));
    }
  }, [otp, length, onComplete]);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;

    // Only allow single digit
    if (value.length > 1) return;

    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== '' && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Handle backspace
    if (e.key === 'Backspace') {
      if (otp[index] !== '') {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input and clear it
        setActiveIndex(index - 1);
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setActiveIndex(index);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    
    // Only allow numbers
    if (!/^\d+$/.test(pastedData)) return;

    // Take only the first 'length' digits
    const digits = pastedData.slice(0, length).split('');
    
    // Fill OTP array
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < length) {
        newOtp[index] = digit;
      }
    });
    
    setOtp(newOtp);
    
    // Focus last filled input or first empty input
    const lastFilledIndex = newOtp.findIndex(digit => digit === '');
    const focusIndex = lastFilledIndex === -1 ? length - 1 : lastFilledIndex;
    setActiveIndex(focusIndex);
    inputRefs.current[focusIndex]?.focus();
  };

  const clearOTP = () => {
    setOtp(new Array(length).fill(''));
    setActiveIndex(0);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="flex items-center justify-center space-x-2 sm:space-x-3">
        {otp.map((digit, index) => (
          <div key={index} className="relative">
            <Input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => handleFocus(index)}
              onPaste={handlePaste}
              disabled={disabled}
              className={`
                w-12 h-12 sm:w-14 sm:h-14 
                text-center text-lg sm:text-xl font-bold
                border-2 rounded-lg
                transition-all duration-200
                ${activeIndex === index 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-300 hover:border-gray-400'
                }
                ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
              maxLength={1}
            />
            {activeIndex === index && !disabled && (
              <div className="absolute inset-0 border-2 border-blue-500 rounded-lg animate-pulse"></div>
            )}
          </div>
        ))}
      </div>
      
      {!disabled && (
        <button
          type="button"
          onClick={clearOTP}
          className="text-sm text-gray-500 hover:text-gray-700 underline cursor-pointer"
        >
          Clear OTP
        </button>
      )}
    </div>
  );
};

export default OTPInput;
