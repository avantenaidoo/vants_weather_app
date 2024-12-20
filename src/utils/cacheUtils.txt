export const getCachedWeatherData = (location: string): WeatherData | null => {
    const cachedData = localStorage.getItem(`weatherData_${location}`);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
};
  
export const cacheWeatherData = (location: string, data: WeatherData): void => {
    localStorage.setItem(`weatherData_${location}`, JSON.stringify(data));
    storeInIndexedDB(location, data);
};
  
const storeInIndexedDB = (location: string, data: WeatherData): void => {
    const request = indexedDB.open('weatherDB', 1);
  
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('weatherData')) {
        db.createObjectStore('weatherData', { keyPath: 'location' });
      }
    };
  
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction('weatherData', 'readwrite');
      const store = transaction.objectStore('weatherData');
      store.put({ location, data });
    };
  
    request.onerror = (event) => {
        console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
    };
};
  
export const getWeatherDataFromIndexedDB = (location: string): Promise<WeatherData | null> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('weatherDB', 1);
  
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction('weatherData', 'readonly');
        const store = transaction.objectStore('weatherData');
        const getRequest = store.get(location);
  
        getRequest.onsuccess = () => {
          resolve(getRequest.result ? getRequest.result.data : null);
        };
  
        getRequest.onerror = () => {
          reject(getRequest.error);
        };
      };
  
      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
};
  