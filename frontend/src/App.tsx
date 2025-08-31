import React from 'react';
import HomePage from './pages/homepage/HomePage';
import { LanguageProvider } from './contexts/LanguageContext';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <div className="App">
        <HomePage />
      </div>
    </LanguageProvider>
  );
};

export default App;
