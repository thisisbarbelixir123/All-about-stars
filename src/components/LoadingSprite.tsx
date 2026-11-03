import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpriteProps {
  label?: string;
}

export const LoadingSprite: React.FC<LoadingSpriteProps> = ({
  label = 'INITIALIZING 3D STAGE...',
}) => {
  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen flex flex-col items-center justify-center bg-[#02040c] select-none pointer-events-none transition-opacity duration-500">
      <div className="relative flex items-center justify-center mb-5">
        <div className="absolute w-20 h-20 rounded-full border border-cyan-500/20 animate-ping" />
        <div className="w-14 h-14 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)]">
          <Loader2 className="w-6 h-6 text-cyan-300 animate-pulse" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-1.5 font-mono text-center px-4">
        <span className="text-xs font-bold text-cyan-300 tracking-[0.25em] uppercase">
          {label}
        </span>
        <span className="text-[11px] text-slate-400">
          Framing coordinate grid and planetary benchmarks
        </span>
      </div>
    </div>
  );
};
