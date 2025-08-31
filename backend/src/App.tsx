import React, { useState } from 'react';
import AuthRouter from './pages/auth/AuthRouter';
import { LanguageProvider } from './contexts/LanguageContext';
import Dashboard from './components/Dashboard';

type AppState = 'auth' | 'dashboard';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('auth');
  const [userType, setUserType] = useState<'farmer' | 'buyer' | 'transporter'>('farmer');

  const handleLoginSuccess = (type: 'farmer' | 'buyer' | 'transporter') => {
    setUserType(type);
    setAppState('dashboard');
  };

  const handleLogout = () => {
    setAppState('auth');
  };

  const renderContent = () => {
    switch (appState) {
      case 'auth':
        return (
          <AuthRouter />
        );
      case 'dashboard':
        return <Dashboard userType={userType} onLogout={handleLogout} />;
      default:
        return <AuthRouter />;
    }
  };

  return (
    <LanguageProvider>
      <div className="App">
        {renderContent()}
      </div>
    </LanguageProvider>
  );
};

export default App;
