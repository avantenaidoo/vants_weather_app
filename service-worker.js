const CACHE_NAME = 'weather-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/css/main.chunk.css',
];

// IndexedDB setup
const DB_NAME = 'weather-app-db';
const DB_VERSION = 1;
const STORE_NAME = 'weather-data';

// Helper function to open IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      console.log("IndexedDB upgrade or creation complete.");
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
      console.log("IndexedDB opened successfully.");
    };

    request.onerror = (event) => {
      reject('IndexedDB error: ' + event.target.error);
      console.log('IndexedDB error:', event.target.error);
    };
  });
}

// Install event - Cache static assets
self.addEventListener('install', (event) => {
  console.log("Service worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching static assets...");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - Check IndexedDB for API responses or fetch from network
self.addEventListener('fetch', (event) => {
  // Only handle API requests for weather data (modify URL as needed)
  if (event.request.url.includes('api.weatherstack.com')) {
    console.log("Fetch request for weather data: ", event.request.url);
    event.respondWith(
      openDatabase().then((db) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const city = new URL(event.request.url).searchParams.get('city');

        return new Promise((resolve, reject) => {
          console.log(`Checking IndexedDB for city: ${city}`);
          // Try to get data from IndexedDB
          const request = store.get(city);

          request.onsuccess = () => {
            const cachedData = request.result;

            if (cachedData && cachedData.timestamp > Date.now() - 3600000) { // 1 hour expiration
              console.log(`Serving data from IndexedDB for city: ${city}`);
              resolve(new Response(JSON.stringify(cachedData.data), {
                headers: { 'Content-Type': 'application/json' }
              }));
            } else {
              console.log(`Data expired or not found in IndexedDB. Fetching new data for city: ${city}`);
              // Fetch fresh data from the network
              fetch(event.request).then((networkResponse) => {
                const clonedResponse = networkResponse.clone();

                clonedResponse.json().then((data) => {
                  // Store new data in IndexedDB
                  const dataToStore = {
                    id: city,
                    data: data,
                    timestamp: Date.now()
                  };

                  const transaction = db.transaction(STORE_NAME, 'readwrite');
                  const store = transaction.objectStore(STORE_NAME);
                  store.put(dataToStore); // Update IndexedDB

                  console.log(`Stored new data in IndexedDB for city: ${city}`);
                  resolve(networkResponse);
                }).catch(reject);
              }).catch(reject);
            }
          };

          request.onerror = reject;
        });
      }).catch(() => {
        console.log('IndexedDB not available or failed. Fallback to network.');
        return fetch(event.request); // Fallback to network if IndexedDB is not available
      })
    );
  } else {
    // Handle other requests with Cache API
    console.log(`Request for non-API asset: ${event.request.url}`);
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log("Service worker activated. Cleaning up old caches...");
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
