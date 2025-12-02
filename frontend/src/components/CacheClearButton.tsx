import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * CacheClearButton - Emergency cache clearing utility
 * Shows a button to manually clear all caches and reload
 * Useful when users see old versions of the website
 */
const CacheClearButton: React.FC = () => {
  const [isClearing, setIsClearing] = useState(false);

  const clearAllCaches = async () => {
    setIsClearing(true);

    try {
      console.log('🧹 Starting manual cache clear...');

      // 1. Clear Service Worker caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        console.log('📋 Found caches:', cacheNames);

        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
          console.log('🗑️ Deleted cache:', cacheName);
        }
      }

      // 2. Unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
          console.log('🗑️ Unregistered service worker');
        }
      }

      // 3. Clear localStorage (except auth token)
      const authToken = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      localStorage.clear();
      if (authToken) localStorage.setItem('authToken', authToken);
      if (userData) localStorage.setItem('userData', userData);
      console.log('🗑️ Cleared localStorage (preserved auth)');

      // 4. Clear sessionStorage
      sessionStorage.clear();
      console.log('🗑️ Cleared sessionStorage');

      // 5. Show success message
      alert('✅ Cache cleared successfully!\n\nअब पेज रीलोड हो रहा है...\nPage is reloading now...');

      // 6. Force reload with cache bypass
      window.location.reload();

    } catch (error) {
      console.error('❌ Cache clear failed:', error);
      alert('❌ Cache clear failed. Please try:\n1. Close all tabs\n2. Clear browser cache manually\n3. Reopen website');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <button
      onClick={clearAllCaches}
      disabled={isClearing}
      className="fixed bottom-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      title="पुराना वर्शन दिख रहा है? यहाँ क्लिक करें | Seeing old version? Click here"
    >
      <RefreshCw className={`w-4 h-4 ${isClearing ? 'animate-spin' : ''}`} />
      <span className="text-sm font-medium">
        {isClearing ? 'Clearing...' : 'Clear Cache'}
      </span>
    </button>
  );
};

export default CacheClearButton;
