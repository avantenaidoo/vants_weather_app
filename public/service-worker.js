const cachesName = 'weather-app-cache-v1';
const urlsToCache = [
  '/vants_weather_app/',             
  '/vants_weather_app/index.html',   
  '/vants_weather_app/images/favicon.jpeg',
  '/vants_weather_app/images/clouds.png',  
  // Add other assets if needed
];

// Install the service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cachesName).then((cache) => {
      return cache.addAll(urlsToCache); // Pre-cache assets for offline use
    })
  );
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

// Fetch assets from the cache or network
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('api.weatherstack.com')) {
    // Handle API requests with caching (Stale-While-Revalidate)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // First, serve the cached response (stale)
        const fetchPromise = fetch(event.request).then((response) => {
          // Revalidate and cache the response
          return caches.open(cachesName).then((cache) => {
            cache.put(event.request, response.clone()); // Cache the new response
            return response;
          });
        }).catch(() => {
          // If the network request fails, fallback to cached data
          return cachedResponse;
        });

        // Return the cached response immediately, but revalidate in the background
        return cachedResponse || fetchPromise;
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