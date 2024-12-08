const CACHE_NAME = 'weather-app-cache-v1';
const DATA_CACHE_NAME = 'weather-data-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/src/App.tsx',
  '/src/components/SearchBar.tsx',
  '/src/components/WeatherDisplay.tsx',
  '/src/services/weatherService.ts',
];

// Install the service worker
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Cache and return requests
self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.url.includes('weatherstack.com')) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }
            return response;
          })
          .catch((error) => {
            return cache.match(error.request);
          });
      })
    );  
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

// Update the service worker
self.addEventListener('activate', (event: ExtendableEvent) => {
  const cacheWhitelist = [CACHE_NAME, DATA_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});