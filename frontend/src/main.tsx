import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// Register Service Worker for PWA - Smart Update Strategy
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // First, unregister any existing service workers to force fresh start
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        console.log('🗑️ SW: Unregistering old service worker...');
        await registration.unregister();
      }

      // Clear all caches
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        console.log('🗑️ Cache: Deleting old cache:', cacheName);
        await caches.delete(cacheName);
      }

      // Register fresh service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        updateViaCache: 'none', // Don't cache the SW file itself - always check for updates
        scope: '/'
      });

      console.log('✅ SW: Registered successfully');

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('📢 SW: Cache updated to version', event.data.version);
          // Optionally show a subtle notification
        }
      });

      // Check for updates immediately
      await registration.update();

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        console.log('🔄 SW: Update found, installing new version...');

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New SW is installed but waiting to activate
            console.log('✅ SW: New version installed, will activate on next page load');

            // Show update notification to user
            if (window.confirm('नया अपडेट उपलब्ध है! अभी रीफ्रेश करें?\nNew update available! Refresh now?')) {
              // Clear everything before reload
              caches.keys().then(keys => {
                keys.forEach(key => caches.delete(key));
              });
              window.location.reload();
            }
          } else if (newWorker.state === 'activated') {
            console.log('✅ SW: New version activated!');
          }
        });
      });

      // Check for updates every 10 minutes (more frequent for mobile)
      setInterval(() => {
        console.log('🔄 SW: Checking for updates...');
        registration.update();
      }, 10 * 60 * 1000);

      // Handle controller change (new SW took over)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 SW: Controller changed, reloading...');
        window.location.reload();
      });

    } catch (error) {
      console.error('❌ SW: Registration failed:', error);
      // App works without SW, so don't break
    }
  });
}

// Force clear cache on mobile devices
if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  console.log('📱 Mobile device detected - clearing old caches...');
  caches.keys().then(keys => {
    keys.forEach(key => {
      if (!key.includes(Date.now().toString().slice(0, -5))) {
        console.log('🗑️ Mobile: Deleting old cache:', key);
        caches.delete(key);
      }
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
