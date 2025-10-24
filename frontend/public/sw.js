// ACHHADAM Service Worker - Production v1.1.0 - CACHE BUST
const CACHE_VERSION = '1.1.0-cache-bust';
const CACHE_NAME = `achhadam-v${CACHE_VERSION}`;

// Only cache files that actually exist in production build
const urlsToCache = [
  '/',
  '/manifest.json'
];

// Install event - SKIP WAITING to force immediate activation
self.addEventListener('install', (event) => {
  console.log('🔧 SW v1.1.0: Installing and taking control immediately...');

  // Skip waiting and take control immediately
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ SW: Cache opened:', CACHE_NAME);
        // Try to cache, but don't fail if some files don't exist
        return cache.addAll(urlsToCache).catch((err) => {
          console.warn('⚠️ SW: Some files could not be cached, continuing anyway');
        });
      })
  );
});

// Activate event - AGGRESSIVELY DELETE ALL OLD CACHES
self.addEventListener('activate', (event) => {
  console.log('🔧 SW v1.1.0: Activating and claiming clients...');

  event.waitUntil(
    Promise.all([
      // Delete ALL old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ SW: DELETING OLD CACHE:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients immediately
      self.clients.claim()
    ])
  );

  console.log('✅ SW v1.1.0: Activated and claimed all clients');
});

// Fetch event - NETWORK FIRST strategy for HTML, cache for assets only
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip service worker entirely for these
  if (event.request.url.includes('/api/') ||
      event.request.url.includes('localhost:5000') ||
      event.request.url.includes('chrome-extension://') ||
      event.request.url.includes('devtools://') ||
      event.request.url.includes('acchadam1-backend.onrender.com') ||
      event.request.url.includes('agromonitoring.com') ||
      event.request.url.includes('openweathermap.org') ||
      event.request.url.includes('@vite/client') ||
      event.request.url.includes('@react-refresh') ||
      event.request.url.includes('googleapis.com') ||
      event.request.url.includes('razorpay.com') ||
      event.request.method !== 'GET') {
    return; // Let browser handle
  }

  // NEVER CACHE HTML FILES - Always fetch fresh from network
  if (event.request.url.endsWith('.html') ||
      event.request.url.endsWith('/') ||
      event.request.mode === 'navigate') {
    console.log('🌐 SW: Network-only for HTML:', event.request.url);
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  // For assets (JS, CSS, images) - try cache first, then network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('📦 SW: From cache:', event.request.url);
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Only cache successful responses
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      });
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
