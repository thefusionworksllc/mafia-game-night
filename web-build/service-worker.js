// Cache name
const CACHE_NAME = 'mafia-game-night-v1';

// Files to cache
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon.png',
  './assets/icon-512x512.png',
  './assets/icon-180x180.png',
  './assets/icon-167x167.png',
  './assets/icon-152x152.png',
  './assets/splash-icon.png'
];

// Install the service worker and cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Immediately claim clients so the PWA is usable right away
  return self.clients.claim();
});

// Intercept fetch requests and serve from cache if available
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle API requests differently (don't cache them)
  if (event.request.url.includes('/api/')) {
    return;
  }

  // For navigation requests (HTML), always go to index.html for SPA routing
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('./index.html');
      })
    );
    return;
  }

  // For all other requests, try cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
}); 