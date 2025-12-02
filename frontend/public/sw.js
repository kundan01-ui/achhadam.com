// ACHHADAM Service Worker - Production with Dynamic Versioning
// Use build timestamp for automatic version updates
const BUILD_TIMESTAMP = '__BUILD_TIMESTAMP__'; // Will be replaced during build
const CACHE_VERSION = `v${BUILD_TIMESTAMP || Date.now()}`;
const CACHE_NAME = `achhadam-${CACHE_VERSION}`;

console.log(`🚀 SW: Starting with version ${CACHE_VERSION}`);

// Cache strategy: Only cache essential files
// DO NOT cache index.html or JS files - always fetch fresh
const urlsToCache = [
  '/manifest.json',
  '/achhadam-logo.jpg',
  '/favicon.ico'
];

// Install event - SKIP WAITING to force immediate activation
self.addEventListener('install', (event) => {
  console.log(`🔧 SW ${CACHE_VERSION}: Installing and taking control immediately...`);

  // Skip waiting and take control immediately
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('✅ SW: Cache opened:', CACHE_NAME);
        // Cache files individually to avoid failure if one file fails
        const cachePromises = urlsToCache.map(url =>
          cache.add(url).catch(err => {
            console.warn(`⚠️ SW: Could not cache ${url}:`, err.message);
          })
        );
        return Promise.all(cachePromises);
      })
      .catch(err => {
        console.error('❌ SW: Cache setup failed:', err);
      })
  );
});

// Activate event - DELETE OLD CACHES
self.addEventListener('activate', (event) => {
  console.log(`🔧 SW ${CACHE_VERSION}: Activating and claiming clients...`);

  event.waitUntil(
    Promise.all([
      // Delete ALL old caches except current one
      caches.keys().then((cacheNames) => {
        console.log('📋 SW: Found caches:', cacheNames);
        const deletedCaches = cacheNames
          .filter(cacheName => {
            // Delete ALL old achhadam caches and any other old caches
            return cacheName !== CACHE_NAME &&
                   (cacheName.startsWith('achhadam-') || cacheName.includes('workbox'));
          })
          .map((cacheName) => {
            console.log('🗑️ SW: DELETING OLD CACHE:', cacheName);
            return caches.delete(cacheName);
          });
        return Promise.all(deletedCaches);
      }),
      // Claim all clients immediately to activate new SW
      self.clients.claim().then(() => {
        console.log('✅ SW: Claimed all clients');
        // Send message to all clients to reload
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'CACHE_UPDATED',
              version: CACHE_VERSION
            });
          });
        });
      })
    ])
  );

  console.log(`✅ SW ${CACHE_VERSION}: Activated and claimed all clients`);
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

  // NETWORK FIRST for HTML and JavaScript files - ALWAYS fetch fresh
  if (event.request.url.endsWith('.html') ||
      event.request.url.endsWith('.js') ||
      event.request.url.endsWith('/') ||
      event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Update cache with fresh content for offline use
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
    return;
  }

  // For static assets (CSS, images, fonts) - cache first, then network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Cache successful responses for static assets
        if (response && response.status === 200) {
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
