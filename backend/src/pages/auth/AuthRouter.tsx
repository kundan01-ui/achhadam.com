import React, { useState } from 'react';
import LoginPage from './LoginPage';
import FarmerSignupPage from './FarmerSignupPage';
import BuyerSignupPage from './BuyerSignupPage';
import TransporterSignupPage from './TransporterSignupPage';

type AuthPage = 'login' | 'farmer-signup' | 'buyer-signup' | 'transporter-signup';

const AuthRouter: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AuthPage>('login');
  const [selectedUserType, setSelectedUserType] = useState<'farmer' | 'buyer' | 'transporter'>('farmer');

  const handlePageChange = (page: AuthPage) => {
    setCurrentPage(page);
  };

  const handleUserTypeSelect = (userType: 'farmer' | 'buyer' | 'transporter') => {
    setSelectedUserType(userType);
    if (userType === 'farmer') {
      setCurrentPage('farmer-signup');
    } else if (userType === 'buyer') {
      setCurrentPage('buyer-signup');
    } else {
      setCurrentPage('transporter-signup');
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage 
            onSignupClick={() => setCurrentPage('farmer-signup')}
            onUserTypeSelect={handleUserTypeSelect}
          />
        );
      case 'farmer-signup':
        return (
          <FarmerSignupPage 
            onBackToLogin={() => setCurrentPage('login')}
            onSwitchUserType={handleUserTypeSelect}
          />
        );
      case 'buyer-signup':
        return (
          <BuyerSignupPage 
            onBackToLogin={() => setCurrentPage('login')}
            onSwitchUserType={handleUserTypeSelect}
          />
        );
      case 'transporter-signup':
        return (
          <TransporterSignupPage 
            onBackToLogin={() => setCurrentPage('login')}
            onSwitchUserType={handleUserTypeSelect}
          />
        );
      default:
        return <LoginPage onSignupClick={() => setCurrentPage('farmer-signup')} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentPage()}
    </div>
  );
};

export default AuthRouter;






















