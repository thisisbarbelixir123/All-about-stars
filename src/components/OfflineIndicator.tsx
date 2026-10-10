import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

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

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900/90 border border-amber-500/40 px-3.5 py-2 text-xs font-mono text-amber-200 shadow-xl backdrop-blur-md animate-in slide-in-from-bottom duration-200">
      <div className="relative flex items-center justify-center">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute" />
        <span className="w-2 h-2 rounded-full bg-amber-400" />
      </div>
      <div className="flex items-center gap-1.5">
        <WifiOff className="w-3.5 h-3.5 text-amber-400" />
        <span>Offline Mode — Cached data active</span>
      </div>
    </div>
  );
};
