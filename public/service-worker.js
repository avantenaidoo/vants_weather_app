const cachesName = 'weather-app-cache-v1';
const CACHE_MAX_AGE = 60 * 60 * 1000;

const urlsToCache = [
  '/vants_weather_app/',
  '/vants_weather_app/index.html',
  '/vants_weather_app/images/favicon.jpeg',
  '/vants_weather_app/images/clouds.png',
];

// Install the service worker and cache assets
self.addEventListener('install', async (event) => {
  const cache = await caches.open(cachesName);
  await cache.addAll(urlsToCache); // Cache assets during install
});

// Activate the service worker and remove old caches
self.addEventListener('activate', async (event) => {
  const cacheWhitelist = [cachesName];
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(async (cacheName) => {
      if (!cacheWhitelist.includes(cacheName)) {
        await caches.delete(cacheName); // Delete old caches
      }
    })
  );
});

// Fetch event: check if URLs are in cache and fetch if missing
self.addEventListener('fetch', async (event) => {
  const url = new URL(event.request.url);

  event.respondWith(
    caches.match(event.request).then(async (cacheResponse) => {
      // If a cached response exists, serve it immediately
      if (cacheResponse) {
        // If offline, serve cached data (regardless of age)
        if (!navigator.onLine) {
          return cacheResponse; // Serve stale cache if offline
        }

        // If online, check cache freshness
        const cachedTimestamp = cacheResponse.headers.get('date');
        if (cachedTimestamp) {
          const cacheAge = Date.now() - new Date(cachedTimestamp).getTime();
          if (cacheAge < CACHE_MAX_AGE) {
            return cacheResponse; // Serve fresh cache
          } else {
            // If cache is stale, delete and fetch fresh data
            await caches.open(cachesName).then((cache) => {
              cache.delete(event.request); // Delete stale cache
              fetchAndCache(event.request); // Fetch and cache fresh data in background
            });
          }
        }
      }

      // If no cache found, fetch from the network
      return fetchAndCache(event.request);
    })
  );
});

// Function to fetch and cache a request
async function fetchAndCache(request) {
  try {
    const fetchResponse = await fetch(request);
    const cache = await caches.open(cachesName);
    const fetchResponseClone = fetchResponse.clone();
    await cache.put(request, fetchResponseClone); // Cache the fresh response
    // After this, check for missing assets and cache them in background
    checkAndCacheAssets();
    return fetchResponse; // Return fresh network data
  } catch {
    return new Response('Network request failed', { status: 502 });
  }
}

// Check and cache missing assets from urlsToCache (background caching)
async function checkAndCacheAssets() {
  const cache = await caches.open(cachesName);
  for (const url of urlsToCache) {
    const cachedAsset = await cache.match(url);
    if (!cachedAsset) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response.clone()); // Cache the missing asset
        }
      } catch (err) {
        console.error(`Failed to fetch and cache ${url}:`, err);
      }
    }
  }
}
