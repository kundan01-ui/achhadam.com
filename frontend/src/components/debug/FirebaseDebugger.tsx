import React, { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { firebaseOTPService } from '../../services/firebaseOTP';

interface FirebaseDebuggerProps {
  isVisible: boolean;
  onClose: () => void;
}

const FirebaseDebugger: React.FC<FirebaseDebuggerProps> = ({ isVisible, onClose }) => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testPhone, setTestPhone] = useState('+919876543210');
  const [testOTP, setTestOTP] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      checkFirebaseConfiguration();
    }
  }, [isVisible]);

  const checkFirebaseConfiguration = () => {
    const config = (window as any).firebaseConfig;
    const info = {
      firebaseConfig: config,
      isConfigured: firebaseOTPService.isFirebaseConfigured(),
      auth: auth ? 'Initialized' : 'Not initialized',
      currentDomain: window.location.hostname,
      currentProtocol: window.location.protocol,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    setDebugInfo(info);
    console.log('🔍 Firebase Debug Info:', info);
  };

  const testSendOTP = async () => {
    setIsLoading(true);
    try {
      console.log('🧪 Testing OTP send...');
      const result = await firebaseOTPService.sendOTPToPhone(testPhone);
      console.log('🧪 Test result:', result);
      alert(`Test result: ${result.success ? 'Success' : 'Failed'} - ${result.message}`);
    } catch (error: any) {
      console.error('🧪 Test error:', error);
      alert(`Test error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testVerifyOTP = async () => {
    setIsLoading(true);
    try {
      console.log('🧪 Testing OTP verify...');
      const result = await firebaseOTPService.verifyOTPCode(testOTP);
      console.log('🧪 Verify result:', result);
      alert(`Verify result: ${result.success ? 'Success' : 'Failed'} - ${result.message}`);
    } catch (error: any) {
      console.error('🧪 Verify error:', error);
      alert(`Verify error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Firebase OTP Debugger</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Configuration Status */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Configuration Status</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Firebase Configured:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${
                      debugInfo.isConfigured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {debugInfo.isConfigured ? 'Yes' : 'No'}
                    </span>
                  </p>
                  <p><strong>Auth Status:</strong> {debugInfo.auth}</p>
                  <p><strong>Current Domain:</strong> {debugInfo.currentDomain}</p>
                  <p><strong>Protocol:</strong> {debugInfo.currentProtocol}</p>
                </div>
                <div>
                  <p><strong>API Key:</strong> {debugInfo.firebaseConfig?.apiKey ? 'Set' : 'Not set'}</p>
                  <p><strong>Project ID:</strong> {debugInfo.firebaseConfig?.projectId || 'Not set'}</p>
                  <p><strong>Auth Domain:</strong> {debugInfo.firebaseConfig?.authDomain || 'Not set'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Test OTP Flow</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Phone Number
                </label>
                <input
                  type="tel"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="+919876543210"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={testSendOTP}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Testing...' : 'Test Send OTP'}
                </button>
                <button
                  onClick={checkFirebaseConfiguration}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Refresh Config
                </button>
              </div>
            </div>
          </div>

          {/* OTP Verification Test */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Test OTP Verification</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test OTP Code
                </label>
                <input
                  type="text"
                  value={testOTP}
                  onChange={(e) => setTestOTP(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="123456"
                />
              </div>
              <button
                onClick={testVerifyOTP}
                disabled={isLoading || !testOTP}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test Verify OTP'}
              </button>
            </div>
          </div>

          {/* Console Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Debug Instructions</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Open browser Developer Tools (F12)</li>
                <li>Go to Console tab</li>
                <li>Try sending OTP and check for error messages</li>
                <li>Look for Firebase-specific error codes</li>
                <li>Check Network tab for failed requests</li>
                <li>Verify Firebase project settings in console</li>
              </ol>
            </div>
          </div>

          {/* Common Issues */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Common Issues & Solutions</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p><strong>Issue:</strong> "auth/domain-not-authorized"</p>
                <p><strong>Solution:</strong> Add your domain to Firebase Console → Authentication → Settings → Authorized domains</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p><strong>Issue:</strong> "auth/captcha-check-failed"</p>
                <p><strong>Solution:</strong> Check if Recaptcha container exists and is properly initialized</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p><strong>Issue:</strong> "auth/invalid-phone-number"</p>
                <p><strong>Solution:</strong> Ensure phone number includes country code (+91 for India)</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p><strong>Issue:</strong> "auth/too-many-requests"</p>
                <p><strong>Solution:</strong> Wait before retrying or check Firebase quotas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseDebugger;









