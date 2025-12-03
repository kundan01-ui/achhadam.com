import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// TEMPORARILY DISABLED: Service Worker causing production caching issues
// Will re-enable after fixing Render CDN cache
// Unregister all existing service workers to clear cache
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      console.log('🧹 Clearing all service workers and caches...');

      // Unregister ALL service workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        console.log('🗑️ Unregistering service worker...');
        await registration.unregister();
      }

      // Clear ALL caches
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        console.log('🗑️ Deleting cache:', cacheName);
        await caches.delete(cacheName);
      }

      console.log('✅ All caches cleared successfully');
    } catch (error) {
      console.error('❌ Cache clearing failed:', error);
    }
  });
}

// Force clear cache on mobile devices
if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  console.log('📱 Mobile device detected - clearing old caches...');
  caches.keys().then(keys => {
    keys.forEach(key => {
      console.log('🗑️ Mobile: Deleting cache:', key);
      caches.delete(key);
    });
  });
}

// Force reload without cache on version mismatch
const APP_VERSION = '__APP_VERSION__' || Date.now().toString();
const STORED_VERSION = localStorage.getItem('app_version');

if (STORED_VERSION && STORED_VERSION !== APP_VERSION) {
  console.log(`🔄 Version mismatch detected. Stored: ${STORED_VERSION}, Current: ${APP_VERSION}`);
  console.log('🔄 Force reloading without cache...');
  localStorage.setItem('app_version', APP_VERSION);
  window.location.reload();
} else {
  localStorage.setItem('app_version', APP_VERSION);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
