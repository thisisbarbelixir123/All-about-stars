import React, { useState, useMemo } from 'react';
import { MultipleStarSystemData, getEffectiveStarCount } from '../data/multipleStarSystemsData';
import { StarData } from '../types';
import { STARS_CATALOG } from '../data/stars';
import {
  Orbit,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  Layers,
  Compass,
  Clock,
  Radio,
  Eye,
  ShieldAlert,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

export interface ClassificationMappedSystemsSectionProps {
  title: string;
  categoryColor: string;
  systems: MultipleStarSystemData[];
  onSelectSystem?: (system: MultipleStarSystemData) => void;
  onSelectStar?: (star: StarData) => void;
}

export const ClassificationMappedSystemsSection: React.FC<ClassificationMappedSystemsSectionProps> = ({
  title,
  categoryColor,
  systems,
  onSelectSystem,
  onSelectStar,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter systems by search query
  const filteredSystems = useMemo(() => {
    if (!searchQuery.trim()) return systems;
    const q = searchQuery.toLowerCase().trim();
    return systems.filter(
      (sys) =>
        sys.name.toLowerCase().includes(q) ||
        sys.constellation.toLowerCase().includes(q) ||
        sys.systemType.toLowerCase().includes(q) ||
        sys.components.some(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.spectralType.toLowerCase().includes(q) ||
            (c.bayerDesignation && c.bayerDesignation.toLowerCase().includes(q))
        )
    );
  }, [systems, searchQuery]);

  // Initial display limit: show top 4 systems when collapsed, all when expanded
  const displayedSystems = isExpanded ? filteredSystems : filteredSystems.slice(0, 4);

  // Helper to resolve StarData from catalog for a component
  const resolveStar = (componentId: string, catalogStarId?: string): StarData | null => {
    const target = catalogStarId || componentId;
    return (
      STARS_CATALOG.find((s) => s.id === target || s.id === componentId) ||
      STARS_CATALOG.find((s) => s.id.startsWith(componentId) || componentId.startsWith(s.id)) ||
      null
    );
  };

  if (!systems || systems.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 p-3 sm:p-4 rounded-2xl bg-[#020512] border-2 border-cyan-500/30 shadow-lg shadow-cyan-950/30 min-w-0">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span
            className="w-3 h-3 rounded-full shrink-0 shadow-md animate-pulse"
            style={{ backgroundColor: categoryColor, boxShadow: `0 0 10px ${categoryColor}` }}
          />
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <h3 className="text-xs sm:text-sm font-mono uppercase font-bold text-cyan-300 tracking-wide break-words">
              {title}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-400/40 text-[10px] font-mono text-cyan-300 font-bold">
              {systems.length} {systems.length === 1 ? 'System' : 'Systems'}
            </span>
          </div>
        </div>

        {/* View Toggle */}
        {filteredSystems.length > 4 && (
          <button
            type="button"
            onClick={() => {
              soundEffects.play('click');
              setIsExpanded((prev) => !prev);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-200 hover:text-white text-[11px] font-mono font-semibold transition-all cursor-pointer self-start sm:self-auto shrink-0 shadow-sm"
          >
            <span>{isExpanded ? 'Collapse to Top 4' : `View All ${filteredSystems.length} Systems`}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />}
          </button>
        )}
      </div>

      {/* Guide explanation subtitle */}
      <div className="mt-2 text-[11px] sm:text-xs text-slate-300 leading-relaxed flex items-center gap-1.5 flex-wrap">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>
          Click any stellar system card to inspect its complete <strong className="text-cyan-300 font-semibold">3D Keplerian Dossier</strong>, real-time co-orbital simulation, and astrophysical parameters.
        </span>
      </div>

      {/* Search Input when multiple systems exist */}
      {systems.length > 4 && (
        <div className="mt-2.5 relative">
          <Search className="w-3.5 h-3.5 text-cyan-500/60 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${systems.length} systems by name, star, constellation...`}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#01040d] border border-cyan-500/25 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
      )}

      {/* Systems Grid */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2.5 min-w-0">
        {displayedSystems.map((sys) => {
          const effectiveCount = getEffectiveStarCount(sys);
          const primaryOrbit = sys.orbits && sys.orbits.length > 0 ? sys.orbits[0] : null;

          return (
            <div
              key={sys.id}
              onClick={() => {
                soundEffects.play('openModal');
                onSelectSystem?.(sys);
              }}
              className="group relative p-3 sm:p-3.5 rounded-xl bg-[#010816]/90 hover:bg-[#021026] border border-cyan-500/20 hover:border-cyan-400/70 transition-all duration-200 flex flex-col justify-between gap-2.5 cursor-pointer shadow-md hover:shadow-cyan-950/50 hover:shadow-lg min-w-0"
            >
              {/* Top Row: System Name & Badges */}
              <div className="min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors font-mono leading-snug break-words">
                    {sys.name}
                  </h4>
                  <span className="shrink-0 px-2 py-0.5 rounded-md bg-cyan-950/90 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-semibold flex items-center gap-1">
                    <Orbit className="w-2.5 h-2.5 text-cyan-400" />
                    {sys.hasContactBinary ? 'Overcontact' : `${effectiveCount} Stars`}
                  </span>
                </div>

                {/* Sub-row: System Type & Astrometric Info */}
                <div className="flex items-center gap-1.5 flex-wrap text-[10px] sm:text-[11px] font-mono text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700/80 text-cyan-200 font-medium">
                    {sys.systemType}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Compass className="w-3 h-3 text-slate-400" />
                    {sys.constellation}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">{sys.distanceLy.toLocaleString()} Ly</span>
                  {primaryOrbit && (
                    <>
                      <span className="text-slate-500">•</span>
                      <span className="flex items-center gap-1 text-amber-300 font-medium">
                        <Clock className="w-2.5 h-2.5 text-amber-400" />
                        {primaryOrbit.orbitalPeriodDays
                          ? `${primaryOrbit.orbitalPeriodDays < 1 ? (primaryOrbit.orbitalPeriodDays * 24).toFixed(1) + 'h' : primaryOrbit.orbitalPeriodDays.toFixed(1) + 'd'}`
                          : `${primaryOrbit.orbitalPeriodYears.toFixed(primaryOrbit.orbitalPeriodYears >= 10 ? 1 : 2)}y`}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Stellar Components Pills */}
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-mono text-slate-400 block mb-1 font-semibold">
                  Components ({sys.components.length}):
                </span>
                <div className="flex flex-wrap gap-1 min-w-0">
                  {sys.components.map((comp) => {
                    const resolved = resolveStar(comp.id, comp.catalogStarId);
                    return (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={(e) => {
                          if (resolved && onSelectStar) {
                            e.stopPropagation();
                            soundEffects.play('click');
                            onSelectStar(resolved);
                          }
                        }}
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#020512] border text-[9.5px] sm:text-[10px] font-mono transition-all ${
                          resolved
                            ? 'border-cyan-500/25 hover:border-cyan-400 hover:bg-cyan-950/40 text-slate-200 cursor-pointer'
                            : 'border-slate-800 text-slate-300 cursor-default'
                        }`}
                        title={resolved ? `Click to view ${comp.name} stellar profile` : comp.name}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: comp.colorHex || '#ffffff' }}
                        />
                        <span className="font-semibold truncate max-w-[110px] sm:max-w-[130px]">
                          {comp.name.replace(/\s*\([^)]*\)/g, '')}
                        </span>
                        <span className="text-cyan-400/90 text-[8.5px] sm:text-[9px]">
                          {comp.spectralType}
                        </span>
                        {comp.massSolar && (
                          <span className="text-slate-400 text-[8.5px] sm:text-[9px]">
                            {comp.massSolar}M☉
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Barycenter / Dynamics Synopsis */}
              {sys.barycenterDescription && (
                <p className="text-[10px] sm:text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-sans">
                  {sys.barycenterDescription}
                </p>
              )}

              {/* Bottom Action CTA Button */}
              <div className="pt-2 border-t border-cyan-500/15 flex items-center justify-between gap-2 mt-auto">
                <span className="text-[10px] font-mono text-cyan-400/80 group-hover:text-cyan-300 flex items-center gap-1 transition-colors">
                  <Orbit className="w-3 h-3 text-cyan-400 animate-spin-slow" />
                  3D Orbit Simulation Available
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundEffects.play('openModal');
                    onSelectSystem?.(sys);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-400/40 hover:border-cyan-400 text-cyan-300 hover:text-white text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm group-hover:shadow-cyan-500/20 active:scale-95"
                >
                  <span>Open Dossier</span>
                  <ExternalLink className="w-3 h-3 text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty Filter State */}
      {displayedSystems.length === 0 && (
        <div className="mt-3 p-4 rounded-xl bg-[#010816] border border-cyan-500/20 text-center space-y-2">
          <p className="text-xs font-mono text-slate-400">
            No star systems matching "{searchQuery}"
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 hover:text-white transition-all cursor-pointer"
          >
            Clear Search Filter
          </button>
        </div>
      )}

      {/* Footnote on prioritization */}
      <div className="mt-3 pt-2.5 border-t border-cyan-500/15 flex items-center justify-between gap-2 flex-wrap text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <Layers className="w-3 h-3 text-cyan-400 shrink-0" />
          Showing {displayedSystems.length} of {filteredSystems.length} mapped stellar architectures.
        </span>
        <span className="text-cyan-400/90 font-medium">
          Dossiers contain full Keplerian orbital solving &amp; component breakdown.
        </span>
      </div>
    </div>
  );
};
