import React from 'react';
import { StarData } from '../types';
import { formatPhysicalDiameter } from '../utils/formatters';
import { Menu, Plus, Check, X } from 'lucide-react';
import { StageKbd } from './StarCanvas3D';

export interface StarInfoPanelProps {
  star: StarData | null;
  onInspect: (star: StarData) => void;
  onUnfocus?: () => void;
  onToggleCompare?: (star: StarData) => void;
  isInComparisonDock?: boolean;
  mode?: '3d-stage' | 'hr-diagram';
  allStars?: StarData[];
  onSelectQuickFocus?: (star: StarData) => void;
}

export const StarInfoPanel: React.FC<StarInfoPanelProps> = ({
  star,
  onInspect,
  onUnfocus,
  onToggleCompare,
  isInComparisonDock = false,
  mode = '3d-stage',
  allStars = [],
  onSelectQuickFocus,
}) => {
  if (!star) {
    const defaultSmallest = allStars.length > 0 ? [...allStars].sort((a, b) => a.diameterKm - b.diameterKm)[0] : null;
    const defaultSun = allStars.find((s) => s.id === 'sun') || (allStars.length > 0 ? allStars[0] : null);
    const defaultLargest = allStars.length > 0 ? [...allStars].sort((a, b) => b.diameterKm - a.diameterKm)[0] : null;

    return (
      <div className="p-2.5 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-[#080d20]/85 backdrop-blur-xl border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-full overflow-hidden">
        <div className="min-w-0 max-w-full">
          <h3 className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 sm:gap-2 break-words">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <span className="break-words">
              {mode === 'hr-diagram'
                ? 'H-R Exploration Mode (Unpinned)'
                : 'Panoramic Mode (Unfocused)'}
            </span>
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 max-w-2xl leading-relaxed break-words">
            {mode === 'hr-diagram'
              ? 'Hover or click any star in the diagram to inspect its exact temperature, luminosity, stellar stage, and physical scale.'
              : 'All stars in the current stage are laid out in order of size. Pan freely with mouse right-drag or click any star to focus.'}
          </p>
        </div>

        {onSelectQuickFocus && (defaultSmallest || defaultSun || defaultLargest) && (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 self-stretch sm:self-center shrink-0">
            {defaultSmallest && (
              <button
                id="btn-quick-focus-smallest"
                onClick={() => onSelectQuickFocus(defaultSmallest)}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] sm:text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Smallest
              </button>
            )}
            {defaultSun && (
              <button
                id="btn-quick-focus-sun"
                onClick={() => onSelectQuickFocus(defaultSun)}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-200 text-[11px] sm:text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                The Sun
              </button>
            )}
            {defaultLargest && (
              <button
                id="btn-quick-focus-largest"
                onClick={() => onSelectQuickFocus(defaultLargest)}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-[11px] sm:text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Largest
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  const scale = formatPhysicalDiameter(star.diameterKm, star.diameterSolar);

  const formattedLum =
    star.luminositySolar >= 1e6
      ? `${(star.luminositySolar / 1e6).toFixed(2)}M`
      : star.luminositySolar >= 1e3
      ? `${(star.luminositySolar / 1e3).toFixed(1)}k`
      : star.luminositySolar < 0.01
      ? star.luminositySolar.toExponential(2)
      : star.luminositySolar.toFixed(2);

  return (
    <div className="p-2.5 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-[#080d20]/90 backdrop-blur-xl border border-cyan-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-full overflow-hidden animate-in fade-in duration-150">
      {/* Star Profile & Core Astrophysics */}
      <div className="flex items-start sm:items-center gap-2.5 sm:gap-4 min-w-0 max-w-full">
        {/* Glowing Star Avatar */}
        <div
          className="w-7 h-7 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full aspect-square shrink-0 flex-shrink-0 shadow-lg relative mt-0.5 sm:mt-0"
          style={{
            backgroundColor: star.colorHex,
            boxShadow: `0 0 20px ${star.colorHex}88`,
          }}
        />

        <div className="min-w-0 flex-1 max-w-full">
          {/* Title Row */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 max-w-full">
            <h3 className="text-xs sm:text-base lg:text-lg font-bold text-white flex items-center gap-1.5 sm:gap-2 font-sans break-words leading-tight">
              {star.name}
            </h3>
            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-0.2 sm:py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 font-mono border border-cyan-500/35 font-semibold shrink-0">
              {star.spectralType}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-mono hidden sm:inline shrink-0">
              • {star.stellarStage === 'Main Sequence Dwarf' ? 'Main Sequence' : star.stellarStage}
            </span>
          </div>

          {/* Physical Parameters Row */}
          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-0.5 sm:gap-y-1 text-[10px] sm:text-xs font-mono text-slate-300 mt-0.5 sm:mt-1 max-w-full break-words leading-tight sm:leading-relaxed">
            <span className="break-words">
              Diameter:{' '}
              <strong className="text-cyan-300 font-bold">
                {scale.metricSi} ({scale.solarFormatted})
              </strong>
            </span>
            <span className="text-slate-600">•</span>
            <span>
              Temp: <strong className="text-amber-300 font-bold">{star.temperature.toLocaleString()} K</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span>
              Lum: <strong className="text-purple-300 font-bold">{formattedLum} L☉</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span>
              Mass: <strong className="text-blue-300 font-bold">{star.massSolar.toFixed(1)} M☉</strong>
            </span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="text-slate-400 hidden md:inline">
              {star.distanceLy === 0 ? 'Solar System' : `${star.distanceLy.toLocaleString()} ly from Earth`}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-center shrink-0">
        <button
          id={`btn-info-panel-dossier-${star.id}`}
          onClick={() => onInspect(star)}
          className="p-2 sm:py-2 sm:px-3.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-[11px] sm:text-xs shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          title="Open comprehensive astrophysical dossier"
        >
          <Menu className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span className="hidden md:inline">Dossier</span>
        </button>

        {onToggleCompare && (
          <button
            id={`btn-info-panel-toggle-compare-${star.id}`}
            onClick={() => onToggleCompare(star)}
            className={`p-2 sm:py-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border active:scale-95 ${
              isInComparisonDock
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                : 'bg-[#091129] hover:bg-[#101e44] text-slate-200 border-cyan-500/30'
            }`}
            title={isInComparisonDock ? 'Remove star from 3D stage' : 'Add star to 3D stage comparison'}
          >
            {isInComparisonDock ? (
              <>
                <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="hidden md:inline">In Stage</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="hidden md:inline">Compare</span>
              </>
            )}
          </button>
        )}

        {onUnfocus && (
          <button
            id="btn-info-panel-unfocus"
            onClick={onUnfocus}
            className="p-2 sm:py-2 sm:px-3 rounded-lg sm:rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] sm:text-xs font-mono transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
            title="Unfocus Star (U)"
          >
            <X className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0 md:hidden" />
            <span className="hidden md:inline">Unfocus</span>
            <StageKbd variant="amber" className="hidden lg:inline-flex">U</StageKbd>
          </button>
        )}
      </div>
    </div>
  );
};
