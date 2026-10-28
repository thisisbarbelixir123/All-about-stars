import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { StageDisplayableItem } from './types';

interface StageTourHUDProps {
  activeItem: StageDisplayableItem | null;
  currentIndex: number;
  totalItems: number;
  isPlaying: boolean;
  isCleanMode: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleCleanMode: () => void;
}

export const StageTourHUD: React.FC<StageTourHUDProps> = ({
  activeItem,
  currentIndex,
  totalItems,
  isPlaying,
  isCleanMode,
  onTogglePlay,
  onPrev,
  onNext,
  onToggleCleanMode,
}) => {
  if (!activeItem) return null;

  const currentNum = currentIndex >= 0 ? currentIndex + 1 : 1;
  const isTourComplete = !isPlaying && currentIndex >= totalItems - 1;

  const kmFormatted =
    activeItem.diameterKm < 10
      ? `${activeItem.diameterKm.toFixed(1)} km`
      : `${Math.round(activeItem.diameterKm).toLocaleString()} km`;
  const milesFormatted = `${Math.round(activeItem.diameterKm * 0.621371).toLocaleString()} mi`;

  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none z-30 flex flex-col justify-end">
      {/* Dark gradient vignette backdrop matching YouTube scale comparison style */}
      <div
        className="w-full bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-20 pb-6 px-4 sm:px-8 md:px-12 flex flex-col gap-2.5 sm:gap-3"
        style={{ textShadow: '0 2px 20px rgba(0,0,0,0.9)' }}
      >
        {/* Top metadata row: Index rank badge & tour status */}
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 font-bold uppercase tracking-wider text-[11px] sm:text-xs shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              #{currentNum} of {totalItems} • {activeItem.metricLabel}
            </span>

            {isTourComplete ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 font-bold text-[11px] sm:text-xs animate-pulse">
                Tour Complete
              </span>
            ) : isPlaying ? (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-[10px] sm:text-[11px]">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Auto Tour Playing
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 text-[10px] sm:text-[11px]">
                Tour Paused
              </span>
            )}
          </div>

          {/* Quick playback controls (pointer-events-auto) */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={onToggleCleanMode}
              title={isCleanMode ? 'Show Full UI (C)' : 'Hide UI for Recording (C)'}
              className="p-1.5 rounded-md bg-black/60 border border-white/20 text-slate-300 hover:text-white hover:bg-black/80 transition-all text-xs flex items-center gap-1"
            >
              {isCleanMode ? <EyeOff className="w-3.5 h-3.5 text-cyan-400" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isCleanMode ? 'Clean (C)' : 'UI On (C)'}</span>
            </button>
            <button
              onClick={onPrev}
              title="Previous Object"
              className="p-1.5 rounded-md bg-black/60 border border-white/20 text-slate-300 hover:text-white hover:bg-black/80 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onTogglePlay}
              title={isPlaying ? 'Pause Tour (Space)' : 'Play Tour (Space)'}
              className="p-1.5 rounded-md bg-cyan-600/80 border border-cyan-400/50 text-white hover:bg-cyan-500 transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={onNext}
              title="Next Object"
              className="p-1.5 rounded-md bg-black/60 border border-white/20 text-slate-300 hover:text-white hover:bg-black/80 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Giant Name & Active Metric Comparison Display */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-8">
          {/* Left Column: Object Name & Classification identity */}
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-start sm:items-center gap-2.5 sm:gap-3.5">
              {activeItem.colorHex && (
                <span
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full aspect-square shrink-0 ring-2 ring-white/50 shadow-[0_0_20px_currentColor] mt-1 sm:mt-0"
                  style={{ backgroundColor: activeItem.colorHex, color: activeItem.colorHex }}
                />
              )}
              <h1 className="text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black font-display text-white tracking-tight leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] break-words">
                {activeItem.name}
              </h1>
            </div>

            {/* Subtitle identity pills */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-300 font-sans mt-2">
              {activeItem.subtitlePills.map((pill, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-slate-500">•</span>}
                  <span className={idx === 0 ? 'font-semibold text-cyan-200' : 'text-slate-300'}>{pill}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Column: Giant Comparison Sorting Metric */}
          <div className="flex flex-col lg:items-end shrink-0">
            <div className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              {activeItem.metricLabel}
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-mono text-cyan-200 tracking-tight drop-shadow-[0_4px_20px_rgba(6,182,212,0.5)]">
                {activeItem.primaryMultiplierText}
              </span>
            </div>

            {/* Secondary metric text (km, miles, or alternative multiplier) */}
            <div className="text-xs sm:text-sm text-slate-300 font-mono mt-1 flex flex-wrap gap-x-2">
              <span>{kmFormatted}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{milesFormatted}</span>
              {activeItem.secondaryMetricText && (
                <>
                  <span className="text-slate-500">•</span>
                  <span className="text-amber-300 font-semibold">{activeItem.secondaryMetricText}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
