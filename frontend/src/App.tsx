import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/homepage/HomePage';
import LoginPage from './pages/auth/LoginPage';
import UserTypeSelectionPage from './pages/auth/UserTypeSelectionPage';
import FarmerSignupPage from './pages/auth/FarmerSignupPage';
import BuyerSignupPage from './pages/auth/BuyerSignupPage';
import TransporterSignupPage from './pages/auth/TransporterSignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsAndConditions from './pages/legal/TermsAndConditions';
import CancellationRefundPolicy from './pages/legal/CancellationRefundPolicy';
import ShippingDeliveryPolicy from './pages/legal/ShippingDeliveryPolicy';
import ContactUs from './pages/legal/ContactUs';
import LegalCompliance from './pages/legal/LegalCompliance';
import IoTServicePage from './pages/services/IoTServicePage';
import DroneServicePage from './pages/services/DroneServicePage';
import SeedServicePage from './pages/services/SeedServicePage';
import AdvisoryServicePage from './pages/services/AdvisoryServicePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import BuyerDashboard from './pages/dashboard/BuyerDashboard';
import CheckoutPage from './pages/checkout/CheckoutPage';
import PaymentSuccessPage from './pages/checkout/PaymentSuccessPage';
import { LanguageProvider } from './contexts/LanguageContext';
import CookieConsent from './components/CookieConsent';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import GeminiChatbot from './components/GeminiChatbot';
import { initCookieConsent } from './services/cookieService';
import { handleRouteFallback, checkRouteAccessibility } from './utils/routeFallback';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize cookie consent system when app loads
    initCookieConsent();
    
    // Handle route fallback for legal pages
    handleRouteFallback();
    
    // Check route accessibility
    if (checkRouteAccessibility()) {
      console.log('Legal page route detected, ensuring proper navigation');
    }
  }, []);

  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<UserTypeSelectionPage />} />
            <Route path="/farmer-signup" element={<FarmerSignupPage />} />
            <Route path="/buyer-signup" element={<BuyerSignupPage />} />
            <Route path="/transporter-signup" element={<TransporterSignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsAndConditions />} />
            <Route path="/cancellation-refund" element={<CancellationRefundPolicy />} />
            <Route path="/shipping-delivery" element={<ShippingDeliveryPolicy />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/legal-compliance" element={<LegalCompliance />} />

            {/* Service Routes */}
            <Route path="/services/iot" element={<IoTServicePage />} />
            <Route path="/services/drone" element={<DroneServicePage />} />
            <Route path="/services/seeds" element={<SeedServicePage />} />
            <Route path="/services/advisory" element={<AdvisoryServicePage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Buyer Dashboard Routes */}
            <Route path="/buyer-dashboard" element={<BuyerDashboard />} />

            {/* Cart Route - Redirect to Buyer Dashboard */}
            <Route path="/cart" element={<Navigate to="/buyer-dashboard" replace />} />

            {/* Checkout & Payment Routes */}
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
          </Routes>
          <CookieConsent companyName="Achhadam" position="bottom" />
          <PWAInstallPrompt />
          <GeminiChatbot />
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;
