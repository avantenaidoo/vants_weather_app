import { useEffect, useState } from 'react';
import '../styles/components/offlineNotifier.css';
import { formatDate } from '../utils/formatDate';

const OfflineNotifier = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineTime, setOfflineTime] = useState<string | ''>('');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setOfflineTime(new Date().toISOString());
    }

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
        <p>You have been offline since {formatDate(offlineTime)}, live updates may not be available.</p>
      </div>
    )
  );
};

export default OfflineNotifier;