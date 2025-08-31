import React, { useState } from 'react';
import LoginPage from './LoginPage';
import FarmerSignupPage from './FarmerSignupPage';
import BuyerSignupPage from './BuyerSignupPage';
import TransporterSignupPage from './TransporterSignupPage';

interface AuthRouterProps {
  onLoginSuccess: (userType: 'farmer' | 'buyer' | 'transporter') => void;
}

type AuthPage = 'login' | 'farmer-signup' | 'buyer-signup' | 'transporter-signup';

const AuthRouter: React.FC<AuthRouterProps> = ({ onLoginSuccess }) => {
  const [currentPage, setCurrentPage] = useState<AuthPage>('login');
  const [selectedUserType, setSelectedUserType] = useState<'farmer' | 'buyer' | 'transporter'>('farmer');

  const handleLoginSuccess = (userType: 'farmer' | 'buyer' | 'transporter') => {
    onLoginSuccess(userType);
  };

  const handleSignupClick = () => {
    setCurrentPage(`${selectedUserType}-signup` as AuthPage);
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
  };

  const handleSwitchUserType = (userType: 'farmer' | 'buyer' | 'transporter') => {
    setSelectedUserType(userType);
    if (currentPage !== 'login') {
      setCurrentPage(`${userType}-signup` as AuthPage);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            onSignupClick={handleSignupClick}
            onUserTypeSelect={handleLoginSuccess}
          />
        );
      case 'farmer-signup':
        return (
          <FarmerSignupPage
            onBackToLogin={handleBackToLogin}
            onSwitchUserType={handleSwitchUserType}
          />
        );
      case 'buyer-signup':
        return (
          <BuyerSignupPage
            onBackToLogin={handleBackToLogin}
            onSwitchUserType={handleSwitchUserType}
          />
        );
      case 'transporter-signup':
        return (
          <TransporterSignupPage
            onBackToLogin={handleBackToLogin}
            onSwitchUserType={handleSwitchUserType}
          />
        );
      default:
        return (
          <LoginPage
            onSignupClick={handleSignupClick}
            onUserTypeSelect={handleSwitchUserType}
          />
        );
    }
  };

  return <>{renderPage()}</>;
};

export default AuthRouter;
