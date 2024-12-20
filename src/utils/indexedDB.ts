const DB_NAME = 'WeatherAppDB';
const DB_VERSION = 1;
const STORE_NAME = 'weatherData';

interface WeatherData {
  location: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  timestamp: number;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'location' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

export const saveWeatherData = async (weatherData: WeatherData): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  store.put(weatherData);
};

export const getWeatherData = async (location: string): Promise<WeatherData | undefined> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.get(location);
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result);
    };
    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
};

export const updateWeatherData = async (location: string, newData: unknown): Promise<void> => {
  const existingData = await getWeatherData(location);
  if (existingData) {
    const updatedData: WeatherData = {
      ...existingData,
      data: newData,
      timestamp: Date.now(),
    };
    await saveWeatherData(updatedData);
  } else {
    const newWeatherData: WeatherData = {
      location,
      data: newData,
      timestamp: Date.now(),
    };
    await saveWeatherData(newWeatherData);
  }
};

export const clearOldWeatherData = async (maxAge: number): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.openCursor();
  const now = Date.now();

  request.onsuccess = (event) => {
    const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
    if (cursor) {
      const weatherData: WeatherData = cursor.value;
      if (now - weatherData.timestamp > maxAge) {
        store.delete(cursor.primaryKey);
      }
      cursor.continue();
    }
  };
};
