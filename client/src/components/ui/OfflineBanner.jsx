import { useOfflineStatus } from '../../hooks/useOfflineStatus.js';
import { useUiStore } from '../../store/uiStore.js';

export function OfflineBanner() {
  useOfflineStatus();
  const isOffline = useUiStore((state) => state.isOffline);

  if (!isOffline) {
    return null;
  }

  return (
    <div className="border-b border-critical/40 bg-critical/90 px-4 py-2 text-center text-sm font-medium text-white">
      You appear to be offline. WaterWatch will not submit reports until the network is restored.
    </div>
  );
}
