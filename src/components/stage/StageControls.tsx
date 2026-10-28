import React from 'react';
import { Maximize2, Minimize2, RotateCcw, Grid, Volume2, VolumeX, Clock } from 'lucide-react';
import { TourLength } from '../../types';

interface StageControlsProps {
  isCleanMode: boolean;
  isFullscreen: boolean;
  showGrid: boolean;
  isMuted: boolean;
  tourLength: TourLength;
  onToggleFullscreen: () => void;
  onResetCamera: () => void;
  onToggleGrid: () => void;
  onToggleMute: () => void;
  onChangeTourLength: (length: TourLength) => void;
}

export const StageControls: React.FC<StageControlsProps> = ({
  isCleanMode,
  isFullscreen,
  showGrid,
  isMuted,
  tourLength,
  onToggleFullscreen,
  onResetCamera,
  onToggleGrid,
  onToggleMute,
  onChangeTourLength,
}) => {
  // Completely hidden in clean recording mode
  if (isCleanMode) return null;

  const cycleTourLength = () => {
    if (tourLength === 'short') onChangeTourLength('medium');
    else if (tourLength === 'medium') onChangeTourLength('long');
    else onChangeTourLength('short');
  };

  return (
    <div className="absolute top-4 right-4 z-40 flex items-center gap-2 select-none pointer-events-auto">
      {/* Tour speed selector */}
      <button
        onClick={cycleTourLength}
        title={`Tour Speed: ${tourLength.toUpperCase()}`}
        className="px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 border border-white/10 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-1.5 shadow-lg backdrop-blur-md"
      >
        <Clock className="w-3.5 h-3.5 text-cyan-400" />
        <span className="capitalize">{tourLength}</span>
      </button>

      {/* Grid toggle */}
      <button
        onClick={onToggleGrid}
        title={showGrid ? 'Hide Coordinate Grid' : 'Show Coordinate Grid'}
        className={`p-2 rounded-lg border text-xs transition-all shadow-lg backdrop-blur-md ${
          showGrid
            ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
            : 'bg-black/60 hover:bg-black/80 border-white/10 text-slate-400 hover:text-white'
        }`}
      >
        <Grid className="w-4 h-4" />
      </button>

      {/* Sound toggle */}
      <button
        onClick={onToggleMute}
        title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        className={`p-2 rounded-lg border text-xs transition-all shadow-lg backdrop-blur-md ${
          !isMuted
            ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
            : 'bg-black/60 hover:bg-black/80 border-white/10 text-slate-400 hover:text-white'
        }`}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* Reset Camera */}
      <button
        onClick={onResetCamera}
        title="Reset Camera View"
        className="p-2 rounded-lg bg-black/60 hover:bg-black/80 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs transition-all shadow-lg backdrop-blur-md"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      {/* Fullscreen */}
      <button
        onClick={onToggleFullscreen}
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        className="p-2 rounded-lg bg-black/60 hover:bg-black/80 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs transition-all shadow-lg backdrop-blur-md"
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
    </div>
  );
};
