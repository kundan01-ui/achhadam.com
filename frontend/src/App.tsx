import React, { useEffect } from 'react';
import HomePage from './pages/homepage/HomePage';
import { LanguageProvider } from './contexts/LanguageContext';
import CookieConsent from './components/CookieConsent';
import { initCookieConsent } from './services/cookieService';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize cookie consent system when app loads
    initCookieConsent();
  }, []);

  return (
    <LanguageProvider>
      <div className="App">
        <HomePage />
        <CookieConsent companyName="Achhadam" position="bottom" />
      </div>
    </LanguageProvider>
  );
};

export default App;
