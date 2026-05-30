import { useEffect } from 'react';
import { useUiStore } from '../store/uiStore.js';

export function useOfflineStatus() {
  const setOffline = useUiStore((state) => state.setOffline);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
    };
  }, [setOffline]);
}
