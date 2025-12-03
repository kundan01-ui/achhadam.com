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

// One-time cache clear on first visit only (prevents infinite reload loop)
const CACHE_CLEARED_FLAG = 'achhadam_cache_cleared_v1';
const cacheAlreadyCleared = sessionStorage.getItem(CACHE_CLEARED_FLAG);

if (!cacheAlreadyCleared) {
  console.log('🧹 First visit detected - clearing old caches once...');

  // Set flag FIRST to prevent infinite loop
  sessionStorage.setItem(CACHE_CLEARED_FLAG, 'true');

  // Clear all browser caches (async, non-blocking)
  if ('caches' in window) {
    caches.keys().then(keys => {
      keys.forEach(key => {
        console.log('🗑️ Deleting cache:', key);
        caches.delete(key);
      });
    }).catch(err => console.warn('Cache clear error:', err));
  }

  console.log('✅ Cache clearing initiated (one-time only)');
} else {
  console.log('✅ Cache already cleared on this session');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
