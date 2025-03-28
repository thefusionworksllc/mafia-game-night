// This is a minimal service worker that doesn't implement offline caching
// It's only used to enable the "Add to Home Screen" functionality

const VERSION = 'v1';

self.addEventListener('install', (event) => {
  // Skip over the "waiting" lifecycle state
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claim any clients immediately
  event.waitUntil(clients.claim());
});

// No fetch event listener, so no caching or offline functionality 