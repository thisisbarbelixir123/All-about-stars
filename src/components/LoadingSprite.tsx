import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSprite: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen flex flex-col items-center justify-center bg-[#030616]/95 backdrop-blur-md animate-in fade-out duration-500">
      <div className="animate-spin mb-4">
        <Loader2 className="w-12 h-12 text-cyan-400" />
      </div>
      <span className="text-cyan-300 font-mono text-xs font-bold tracking-widest uppercase animate-pulse">
        Loading...
      </span>
    </div>
  );
};