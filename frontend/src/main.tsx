import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// Register Service Worker for PWA - v1.1.0 with Force Update
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // STEP 1: Unregister ALL old service workers first
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        console.log('🗑️ Unregistering old SW:', registration.scope);
        await registration.unregister();
      }

      // STEP 2: Clear all caches
      const cacheKeys = await caches.keys();
      for (const key of cacheKeys) {
        console.log('🗑️ Deleting cache:', key);
        await caches.delete(key);
      }

      // STEP 3: Register new service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        updateViaCache: 'none' // Don't cache the SW file itself
      });

      console.log('✅ SW v1.1.0: Registered successfully');

      // STEP 4: Force update check
      registration.update();

      // STEP 5: Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('🔄 SW: Update found, installing...');

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              console.log('✅ SW: New version activated!');
              // Force reload to use new SW
              if (!navigator.serviceWorker.controller) {
                window.location.reload();
              }
            }
          });
        }
      });

    } catch (error) {
      console.log('❌ SW: Registration/cleanup failed:', error);
      // Don't fail the app if SW fails
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
