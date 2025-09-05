import React, { useState } from 'react';
import LoginPage from './LoginPage';
import FarmerSignupPage from './FarmerSignupPage';
import BuyerSignupPage from './BuyerSignupPage';
import TransporterSignupPage from './TransporterSignupPage';
import UserTypeSelectionPage from './UserTypeSelectionPage';
import ForgetPasswordPage from './ForgetPasswordPage';
import type { GoogleUserData } from '../../types/auth';

interface AuthRouterProps {
  onLoginSuccess: (userType: 'farmer' | 'buyer' | 'transporter') => void;
}

type AuthPage = 'login' | 'farmer-signup' | 'buyer-signup' | 'transporter-signup' | 'user-type-selection' | 'forget-password';

const AuthRouter: React.FC<AuthRouterProps> = ({ onLoginSuccess }) => {
  const [currentPage, setCurrentPage] = useState<AuthPage>('login');
  const [selectedUserType, setSelectedUserType] = useState<'farmer' | 'buyer' | 'transporter'>('farmer');
  const [googleUser, setGoogleUser] = useState<GoogleUserData | null>(null);

  const handleLoginSuccess = (userType: 'farmer' | 'buyer' | 'transporter' | 'google-signin', user?: GoogleUserData) => {
    if (userType === 'google-signin' && user) {
      setGoogleUser(user);
      setCurrentPage('user-type-selection');
    } else {
      onLoginSuccess(userType as 'farmer' | 'buyer' | 'transporter');
    }
  };

  const handleUserTypeSelection = (userType: 'farmer' | 'buyer' | 'transporter', user: GoogleUserData) => {
    console.log('🎯 User selected type:', userType, 'for Google user:', user);
    onLoginSuccess(userType);
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
    setGoogleUser(null);
  };

  const handleSignupClick = () => {
    setCurrentPage(`${selectedUserType}-signup` as AuthPage);
  };

  const handleSwitchUserType = (userType: 'farmer' | 'buyer' | 'transporter') => {
    setSelectedUserType(userType);
    if (currentPage !== 'login') {
      setCurrentPage(`${userType}-signup` as AuthPage);
    }
  };

  const handleForgotPassword = () => {
    setCurrentPage('forget-password');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            onSignupClick={handleSignupClick}
            onUserTypeSelect={handleLoginSuccess}
            onBackToHome={() => {}}
            onForgotPassword={handleForgotPassword}
          />
        );
      case 'user-type-selection':
        return googleUser ? (
          <UserTypeSelectionPage
            user={googleUser}
            onUserTypeSelect={handleUserTypeSelection}
            onBack={handleBackToLogin}
          />
        ) : (
          <LoginPage
            onSignupClick={handleSignupClick}
            onUserTypeSelect={handleLoginSuccess}
            onBackToHome={() => {}}
          />
        );
      case 'farmer-signup':
        return (
          <FarmerSignupPage
            onBackToLogin={handleBackToLogin}
            onSwitchUserType={handleSwitchUserType}
            onBackToHome={() => {}}
            onBackToUserTypeSelection={() => {}}
          />
        );
      case 'buyer-signup':
        return (
          <BuyerSignupPage
            onBackToLogin={handleBackToLogin}
            onSwitchUserType={handleSwitchUserType}
            onBackToHome={() => {}}
            onBackToUserTypeSelection={() => {}}
          />
        );
      case 'transporter-signup':
        return (
          <TransporterSignupPage
            onBackToLogin={handleBackToLogin}
            onSwitchUserType={handleSwitchUserType}
            onBackToHome={() => {}}
            onBackToUserTypeSelection={() => {}}
          />
        );
      case 'forget-password':
        return (
          <ForgetPasswordPage
            onBack={handleBackToLogin}
            onSuccess={handleBackToLogin}
          />
        );
      default:
        return (
          <LoginPage
            onSignupClick={handleSignupClick}
            onUserTypeSelect={handleLoginSuccess}
            onBackToHome={() => {}}
          />
        );
    }
  };

  return <>{renderPage()}</>;
};

export default AuthRouter;
