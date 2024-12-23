import { useEffect, useState } from 'react';
import '../styles/components/offlineNotifier.css';

const OfflineNotifier = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    !isOnline && (
      <div className="offline-notifier">
        <p>You are offline, live updates may not be available.</p>
      </div>
    )
  );
};

export default OfflineNotifier;