import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// Register Service Worker for PWA - Smart Update Strategy
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        updateViaCache: 'none', // Don't cache the SW file itself - always check for updates
        scope: '/'
      });

      console.log('✅ SW: Registered successfully');

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

            // Show update notification to user (optional)
            if (window.confirm('नया अपडेट उपलब्ध है! अभी रीफ्रेश करें?\nNew update available! Refresh now?')) {
              window.location.reload();
            }
          } else if (newWorker.state === 'activated') {
            console.log('✅ SW: New version activated!');
          }
        });
      });

      // Check for updates every 30 minutes
      setInterval(() => {
        console.log('🔄 SW: Checking for updates...');
        registration.update();
      }, 30 * 60 * 1000);

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
