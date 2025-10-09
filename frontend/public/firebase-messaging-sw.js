// Firebase Cloud Messaging Service Worker
// This handles background push notifications

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyDIr9HygDcTillF47oYfi1xIEozr9l8mBA",
  authDomain: "digital-farming-platform.firebaseapp.com",
  projectId: "digital-farming-platform",
  storageBucket: "digital-farming-platform.firebasestorage.app",
  messagingSenderId: "1024746152320",
  appId: "1:1024746152320:web:67799730096fd80fc32165",
  measurementId: "G-BJK3TJ7M9F"
});

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('🔔 [SW] Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: payload.notification?.icon || '/logo.png',
    badge: '/logo.png',
    image: payload.notification?.image,
    data: payload.data,
    tag: payload.data?.type || 'general',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/view.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close.png'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 [SW] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'view') {
    // Open the app or navigate to specific page
    const urlToOpen = event.notification.data?.link || '/dashboard';

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if app is already open
          for (const client of clientList) {
            if (client.url.includes(urlToOpen) && 'focus' in client) {
              return client.focus();
            }
          }
          // Open new window if not open
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Service Worker Installation
self.addEventListener('install', (event) => {
  console.log('🔔 [SW] Service Worker installing...');
  self.skipWaiting();
});

// Service Worker Activation
self.addEventListener('activate', (event) => {
  console.log('🔔 [SW] Service Worker activated');
  event.waitUntil(clients.claim());
});

console.log('🔔 [SW] Firebase Messaging Service Worker loaded');
