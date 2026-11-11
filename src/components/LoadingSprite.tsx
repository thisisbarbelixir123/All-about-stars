import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpriteProps {
  label?: string;
}

export const LoadingSprite: React.FC<LoadingSpriteProps> = ({
  label = 'INITIALIZING 3D STAGE...',
}) => {
  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen flex flex-col items-center justify-center bg-[#02040c]/90 backdrop-blur-sm select-none pointer-events-none transition-opacity duration-500">
      <div className="observatory-panel rounded-2xl p-6 flex flex-col items-center gap-4 max-w-sm mx-4 text-center">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-white/10 border-t-sky-400 animate-spin flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-sky-400" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs font-semibold tracking-wider text-slate-200 uppercase font-sans">
            {label}
          </span>
          <span className="text-[11px] text-slate-400 font-sans">
            Framing coordinate grid and planetary benchmarks
          </span>
        </div>
      </div>
    </div>
  );
};
