import React, { useState, useEffect } from 'react';

interface OTPDebuggerProps {
  showOTP: boolean;
  otpSent: boolean;
  otpVerified: boolean;
  otpLoading: boolean;
  otpError: string;
  phone: string;
}

const OTPDebugger: React.FC<OTPDebuggerProps> = ({
  showOTP,
  otpSent,
  otpVerified,
  otpLoading,
  otpError,
  phone
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show debugger if there are any OTP-related issues
    if (otpError || (otpLoading && !showOTP)) {
      setIsVisible(true);
    }
  }, [otpError, otpLoading, showOTP]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-4 max-w-sm z-50">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-yellow-800">OTP Debug Info</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-yellow-600 hover:text-yellow-800 text-sm"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1 text-xs">
        <div><strong>Phone:</strong> {phone}</div>
        <div><strong>showOTP:</strong> {showOTP ? '✅' : '❌'}</div>
        <div><strong>otpSent:</strong> {otpSent ? '✅' : '❌'}</div>
        <div><strong>otpVerified:</strong> {otpVerified ? '✅' : '❌'}</div>
        <div><strong>otpLoading:</strong> {otpLoading ? '⏳' : '✅'}</div>
        {otpError && <div><strong>Error:</strong> <span className="text-red-600">{otpError}</span></div>}
      </div>
      
      <div className="mt-2 text-xs text-yellow-700">
        <strong>Mock OTP:</strong> 123456
      </div>
    </div>
  );
};

export default OTPDebugger;









