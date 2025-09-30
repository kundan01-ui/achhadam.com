// ACHHADAM Service Worker - FIXED VERSION
const CACHE_NAME = 'achhadam-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Service Worker: Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('❌ Service Worker: Cache install failed:', error);
        // Don't fail the installation if cache fails
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('🔧 Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - FIXED VERSION
self.addEventListener('fetch', (event) => {
  // Skip service worker for API calls, external resources, and Vite dev server
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('localhost:5000') ||
      event.request.url.includes('chrome-extension://') ||
      event.request.url.includes('devtools://') ||
      event.request.url.includes('acchadam1-backend.onrender.com') ||
      event.request.url.includes('www.achhadam.com/api/') ||
      event.request.url.includes('@vite/client') ||
      event.request.url.includes('@react-refresh') ||
      event.request.url.includes('src/') ||
      event.request.url.includes('vite')) {
    console.log('⏭️ Service Worker: Skipping dev server request:', event.request.url);
    return; // Let the browser handle these requests normally
  }
  
  // Only handle GET requests for static assets
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          console.log('📦 Service Worker: Serving from cache:', event.request.url);
          return response;
        }
        
        // Fetch from network with proper error handling
        return fetch(event.request)
          .then((networkResponse) => {
            // Check if response is valid
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              console.log('⚠️ Service Worker: Invalid network response:', networkResponse);
              return networkResponse;
            }
            
            // Clone the response for caching
            const responseToCache = networkResponse.clone();
            
            // Cache the response
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
                console.log('💾 Service Worker: Cached new resource:', event.request.url);
              })
              .catch((error) => {
                console.log('❌ Service Worker: Cache put failed:', error);
              });
            
            return networkResponse;
          })
          .catch((error) => {
            console.log('❌ Service Worker: Network fetch failed:', error);
            // Don't log errors for external resources
            if (event.request.url.includes('googletagmanager.com') || 
                event.request.url.includes('razorpay.com') ||
                event.request.url.includes('localhost')) {
              return; // Skip error logging for external resources
            }
            // Return offline page or fallback
            return caches.match('/index.html');
          });
      })
      .catch((error) => {
        console.log('❌ Service Worker: Cache match failed:', error);
        // Return offline page as last resort
        return caches.match('/index.html');
      })
  );
});

// Handle service worker errors
self.addEventListener('error', (event) => {
  console.log('❌ Service Worker: Error occurred:', event.error);
});

// Handle unhandled promise rejections
self.addEventListener('unhandledrejection', (event) => {
  console.log('❌ Service Worker: Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

console.log('✅ Service Worker: Loaded successfully');
