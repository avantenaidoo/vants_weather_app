const cachesName = 'weather-app-cache-v1';
const urlsToCache = [
  '/',                       // index.html
  '/index.html',              // Explicitly add index.html
  '/assets/index.css',        // Corrected path for the bundled CSS file
  '/images/favicon.jpeg',     // Correct image paths
  '/images/clouds.png',       // Correct image paths
  // Add other assets as needed
];

// Install the service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cachesName).then((cache) => {
      return cache.addAll(urlsToCache); // Pre-cache assets for offline use
    })
  );
});

// Fetch assets from the cache or network
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('api.weatherstack.com')) {
    // Handle API requests with caching
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          return caches.open(cachesName).then((cache) => {
            cache.put(event.request, response.clone()); // Cache the new response
            return response;
          });
        }).catch(() => {
          // If the network request fails, return the cached version of the resource
          return caches.match(event.request); 
        });
      })
    );
  } else {
    // Handle non-API requests (images, CSS, HTML, etc.)
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          return caches.open(cachesName).then((cache) => {
            cache.put(event.request, response.clone()); // Cache the new response
            return response;
          });
        }).catch(() => {
          // If the network request fails, return the cached version of the resource
          return caches.match(event.request); 
        });
      })
    );
  }
});

// Activate the service worker and remove old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [cachesName];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Clean up old caches
          }
        })
      );
    })
  );
});
