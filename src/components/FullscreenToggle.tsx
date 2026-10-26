import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface FullscreenToggleProps {
  className?: string;
  id?: string;
}

export const FullscreenToggle: React.FC<FullscreenToggleProps> = ({
  className,
  id = 'btn-fullscreen-toggle',
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return !!document.fullscreenElement;
    }
    return false;
  });

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => console.warn(err));
      } else {
        document.exitFullscreen().catch((err) => console.warn(err));
      }
    } catch (e) {
      console.warn('Fullscreen toggle failed:', e);
    }
  };

  return (
    <button
      type="button"
      id={id}
      onClick={toggleFullscreen}
      title={isFullscreen ? 'Exit Fullscreen' : 'Display Fullscreen'}
      aria-label="Toggle Fullscreen"
      className={
        className ||
        'p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-white/5 border border-transparent hover:border-cyan-500/30 transition-all cursor-pointer'
      }
    >
      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
    </button>
  );
};
