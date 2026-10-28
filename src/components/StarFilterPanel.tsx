import React, { useState } from 'react';
import { FilterState, SpectralClass, StellarStage } from '../types';
import { CONSTELLATIONS_LIST, SPECTRAL_CLASSES_META } from '../data/stars';
import {
  DIAMETER_MIN,
  DIAMETER_MAX,
  DISTANCE_MIN,
  DISTANCE_MAX,
  sliderPosToDiameter,
  diameterToSliderPos,
  formatDiameterSliderValue,
  sliderPosToDistance,
  distanceToSliderPos,
  formatDistanceSliderValue,
} from '../utils/stellarCatalogFilters';
import { 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  Sparkles, 
  Eye, 
  Sun, 
  Flame, 
  Compass, 
  Layers,
  Globe,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';

interface StarFilterPanelProps {
  filterState: FilterState;
  onChangeFilter: (newState: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalMatches: number;
  onOpenClassificationGuide?: () => void;
}

const STELLAR_STAGES_LIST: StellarStage[] = [
  'Red Hypergiant',
  'Yellow Hypergiant',
  'Red Supergiant',
  'Yellow Supergiant',
  'Blue Supergiant',
  'Bright Giant',
  'Red Giant',
  'Blue Giant',
  'Subgiant',
  'Subdwarf',
  'Blue Main Sequence',
  'White Main Sequence',
  'Yellow Main Sequence',
  'Orange Dwarf',
  'Red Dwarf',
  'Blue Straggler',
  'Carbon Star',
  'S-Type Star',
  'Brown Dwarf',
  'White Dwarf',
  'Neutron Star / Pulsar',
  'Wolf-Rayet',
  'Luminous Blue Variable',
  'Contact Binary',
  'Thorne–Żytkow Object',
];

export const StarFilterPanel: React.FC<StarFilterPanelProps> = ({
  filterState,
  onChangeFilter,
  onResetFilters,
  totalMatches,
  onOpenClassificationGuide,
}) => {
  // Advanced search/filter panel is collapsed by default across all devices
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeDiameterThumb, setActiveDiameterThumb] = useState<'min' | 'max'>('max');
  const [activeDistanceThumb, setActiveDistanceThumb] = useState<'min' | 'max'>('max');

  const minDiameter = filterState.minDiameter ?? DIAMETER_MIN;
  const maxDiameter = filterState.maxDiameter ?? DIAMETER_MAX;
  const minDistance = filterState.minDistance ?? DISTANCE_MIN;
  const maxDistance = filterState.maxDistance ?? DISTANCE_MAX;
  const minDiameterPos = diameterToSliderPos(minDiameter);
  const maxDiameterPos = diameterToSliderPos(maxDiameter);
  const minDistancePos = distanceToSliderPos(minDistance);
  const maxDistancePos = distanceToSliderPos(maxDistance);

  const activeFiltersCount = 
    filterState.spectralClasses.length +
    filterState.stellarStages.length +
    (filterState.constellation ? 1 : 0) +
    (minDiameter > DIAMETER_MIN || maxDiameter < DIAMETER_MAX ? 1 : 0) +
    (minDistance > DISTANCE_MIN || maxDistance < DISTANCE_MAX ? 1 : 0) +
    (filterState.hasExoplanetsOnly ? 1 : 0) +
    (filterState.onlyNakedEye ? 1 : 0);

  const toggleSpectralClass = (sc: SpectralClass) => {
    const current = filterState.spectralClasses;
    const exists = current.includes(sc);
    const updated = exists ? current.filter((c) => c !== sc) : [...current, sc];
    onChangeFilter({ spectralClasses: updated });
  };

  const toggleStellarStage = (stage: StellarStage) => {
    const current = filterState.stellarStages;
    const exists = current.includes(stage);
    const updated = exists ? current.filter((s) => s !== stage) : [...current, stage];
    onChangeFilter({ stellarStages: updated });
  };

  return (
    <div className="w-full bg-[#060a1a]/90 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl p-3.5 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col gap-3.5 sm:gap-5 relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Primary Control Bar: Search Input, Quick Filters Toggle, Sort & Reset */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3">
        {/* Search Bar with Clear Button */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400 pointer-events-none" />
          <input
            id="input-star-search"
            type="text"
            placeholder="Search stars by name, Bayer designation, constellation, or stage..."
            value={filterState.searchQuery}
            onChange={(e) => onChangeFilter({ searchQuery: e.target.value })}
            className="w-full bg-[#020510] border border-cyan-500/30 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all shadow-inner font-mono"
          />
          {filterState.searchQuery && (
            <button
              onClick={() => onChangeFilter({ searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400 hover:text-white px-2 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700/60 hover:border-cyan-500/40 transition-all cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Controls: Expand/Contract Filters Button, Sort By Dropdown, and Reset */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Expandable/Contractable Filters Toggle Button */}
          <button
            id="btn-toggle-filter-panel"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-3 rounded-xl text-xs font-mono font-semibold transition-all border cursor-pointer shrink-0 ${
              isExpanded || activeFiltersCount > 0
                ? 'bg-cyan-950/80 border-cyan-400/80 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'bg-[#020510] border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400'
            }`}
            title={isExpanded ? 'Collapse Filter Controls' : 'Expand Filter Controls'}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-sans font-bold">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-cyan-400 text-slate-950 font-bold shrink-0">
                {activeFiltersCount}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
          </button>

          {/* Sort By Dropdown */}
          <select
            id="select-sort-by"
            value={filterState.sortBy}
            onChange={(e) => onChangeFilter({ sortBy: e.target.value as any })}
            className="bg-[#020510] border border-cyan-500/30 text-xs sm:text-sm text-slate-200 rounded-xl px-2.5 sm:px-3.5 py-2.5 sm:py-3 focus:outline-none focus:border-cyan-400 cursor-pointer shadow-inner transition-all flex-1 sm:flex-initial"
          >
            <option value="diameter-desc" className="bg-[#040816]">Size: Largest (D☉)</option>
            <option value="diameter-asc" className="bg-[#040816]">Size: Smallest (D☉)</option>
            <option value="mass-desc" className="bg-[#040816]">Mass: Heaviest (M☉)</option>
            <option value="mass-asc" className="bg-[#040816]">Mass: Lightest (M☉)</option>
            <option value="luminosity-desc" className="bg-[#040816]">Luminosity: Brightest</option>
            <option value="luminosity-asc" className="bg-[#040816]">Luminosity: Dimmest</option>
            <option value="temp-desc" className="bg-[#040816]">Temp: Hottest (K)</option>
            <option value="temp-asc" className="bg-[#040816]">Temp: Coolest (K)</option>
            <option value="distance-asc" className="bg-[#040816]">Distance: Nearest</option>
            <option value="distance-desc" className="bg-[#040816]">Distance: Furthest</option>
            <option value="exoplanets-desc" className="bg-[#040816]">Most Exoplanets</option>
            <option value="name-asc" className="bg-[#040816]">Alphabetical (A - Z)</option>
          </select>

          {/* Reset Filters Button */}
          <button
            id="btn-reset-filters"
            onClick={onResetFilters}
            title="Reset Filters"
            className="p-2.5 sm:p-3 rounded-xl bg-[#020510] hover:bg-[#091129] text-slate-400 hover:text-cyan-300 border border-cyan-500/25 hover:border-cyan-400 transition-all cursor-pointer shadow-inner shrink-0"
          >
            <RotateCcw className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Expandable/Contractable Advanced Filter Controls Body */}
      {isExpanded && (
        <div className="flex flex-col gap-4 sm:gap-5 pt-3 border-t border-cyan-500/15 animate-in fade-in duration-200">
          {/* Constellation Selector & Classification Guide link */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 flex-1 flex-wrap sm:flex-nowrap">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold shrink-0">Constellation:</span>
              <div className="relative flex items-center gap-1.5 flex-1 max-w-xs">
                <select
                  id="select-constellation"
                  value={filterState.constellation}
                  onChange={(e) => onChangeFilter({ constellation: e.target.value })}
                  className="bg-[#020510] border border-cyan-500/30 text-xs sm:text-sm text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 cursor-pointer shadow-inner transition-all w-full"
                >
                  <option value="" className="bg-[#040816] text-slate-300">All Constellations (88)</option>
                  {CONSTELLATIONS_LIST.map((c) => (
                    <option key={c} value={c} className="bg-[#040816] text-slate-200">
                      {c}
                    </option>
                  ))}
                </select>
                {filterState.constellation && (
                  <button
                    type="button"
                    onClick={() => onChangeFilter({ constellation: '' })}
                    className="text-[10px] text-slate-400 hover:text-cyan-300 font-mono px-1.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 cursor-pointer shrink-0"
                    title="Clear Constellation Filter"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {onOpenClassificationGuide && (
              <button
                type="button"
                onClick={onOpenClassificationGuide}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-200 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer shrink-0"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Classification Guide</span>
              </button>
            )}
          </div>

          {/* Spectral Class Filter */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Spectral Classification
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-cyan-400/80 font-mono">
                  {filterState.spectralClasses.length === 0
                    ? 'Showing all spectral types'
                    : `${filterState.spectralClasses.length} selected`}
                </span>
                {filterState.spectralClasses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onChangeFilter({ spectralClasses: [] })}
                    className="text-[9px] text-slate-400 hover:text-cyan-300 underline font-mono cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Separate buttons arranged in a clean wrapping grid */}
            <div className="flex flex-wrap items-center gap-1.5">
              {SPECTRAL_CLASSES_META.map((sc) => {
                const isActive = filterState.spectralClasses.includes(sc.key as SpectralClass);
                return (
                  <button
                    key={sc.key}
                    id={`btn-spectral-${sc.key}`}
                    onClick={() => toggleSpectralClass(sc.key as SpectralClass)}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-mono font-medium transition-all border cursor-pointer active:scale-95 ${
                      isActive
                        ? 'bg-[#0f1b3b] border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-500/50 font-bold'
                        : 'bg-[#020510]/80 border-cyan-500/20 text-slate-400 hover:border-cyan-500/40 hover:text-slate-100 hover:bg-[#070f24]'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-[0_0_6px_currentColor] shrink-0"
                      style={{ backgroundColor: sc.color }}
                    />
                    <span>{sc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stellar Stages / Evolutionary Type Filter */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Stellar Evolutionary Stage
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-cyan-400/80 font-mono">
                  {filterState.stellarStages.length === 0
                    ? 'Showing all stages'
                    : `${filterState.stellarStages.length} selected`}
                </span>
                {filterState.stellarStages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onChangeFilter({ stellarStages: [] })}
                    className="text-[9px] text-slate-400 hover:text-cyan-300 underline font-mono cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {STELLAR_STAGES_LIST.map((stage) => {
                const isActive = filterState.stellarStages.includes(stage);
                return (
                  <button
                    key={stage}
                    id={`btn-stage-${stage.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => toggleStellarStage(stage)}
                    className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono transition-all border cursor-pointer active:scale-95 ${
                      isActive
                        ? 'bg-cyan-900/60 border-cyan-400 text-white font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50'
                        : 'bg-[#020510]/80 border-cyan-500/20 text-slate-400 hover:border-cyan-500/40 hover:text-slate-200 hover:bg-[#070f24]'
                    }`}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Category & Range Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
            {/* Diameter Range Slider: 0.00001 to 2,150 D☉ */}
            <div className="p-3 bg-[#020510]/80 rounded-xl border border-cyan-500/20 shadow-inner flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400 font-sans text-[11px] font-semibold">Diameter Range</span>
                  {(minDiameter > DIAMETER_MIN || maxDiameter < DIAMETER_MAX) && (
                    <button
                      type="button"
                      onClick={() => onChangeFilter({ minDiameter: DIAMETER_MIN, maxDiameter: DIAMETER_MAX })}
                      className="text-[9px] text-slate-400 hover:text-cyan-300 underline font-mono cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <span className="text-cyan-400 font-bold font-mono text-[10px] drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]">
                    {formatDiameterSliderValue(minDiameter)}
                  </span>
                  <span className="text-cyan-300 font-bold font-mono text-[10px] text-right drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]">
                    {formatDiameterSliderValue(maxDiameter)}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative h-5 flex items-center">
                  <div className="absolute left-0 right-0 h-1.5 rounded-lg bg-[#0b1328]" />
                  <div
                    className="absolute h-1.5 rounded-lg bg-cyan-400/70"
                    style={{ left: `${minDiameterPos / 10}%`, width: `${(maxDiameterPos - minDiameterPos) / 10}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    step={1}
                    value={minDiameterPos}
                    onFocus={() => setActiveDiameterThumb('min')}
                    onPointerDown={() => setActiveDiameterThumb('min')}
                    onChange={(e) => {
                      const pos = Math.min(Number(e.target.value), maxDiameterPos - 1);
                      onChangeFilter({ minDiameter: sliderPosToDiameter(Math.max(0, pos)) });
                    }}
                    aria-label="Minimum star diameter"
                    className={`dual-range-thumb absolute inset-0 w-full h-5 ${activeDiameterThumb === 'min' ? 'z-20' : 'z-10'}`}
                  />
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    step={1}
                    value={maxDiameterPos}
                    onFocus={() => setActiveDiameterThumb('max')}
                    onPointerDown={() => setActiveDiameterThumb('max')}
                    onChange={(e) => {
                      const pos = Math.max(Number(e.target.value), minDiameterPos + 1);
                      onChangeFilter({ maxDiameter: sliderPosToDiameter(Math.min(1000, pos)) });
                    }}
                    aria-label="Maximum star diameter"
                    className={`dual-range-thumb absolute inset-0 w-full h-5 ${activeDiameterThumb === 'max' ? 'z-20' : 'z-10'}`}
                  />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-slate-500 pt-0.5">
                  <span>0.00001 D☉</span>
                  <span>2,150 D☉</span>
                </div>
              </div>
            </div>

            {/* Distance Range Slider: Solar System scale to 12,900,000,000 ly */}
            <div className="p-3 bg-[#020510]/80 rounded-xl border border-cyan-500/20 shadow-inner flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400 font-sans text-[11px] font-semibold">Distance Range</span>
                  {(minDistance > DISTANCE_MIN || maxDistance < DISTANCE_MAX) && (
                    <button
                      type="button"
                      onClick={() => onChangeFilter({ minDistance: DISTANCE_MIN, maxDistance: DISTANCE_MAX })}
                      className="text-[9px] text-slate-400 hover:text-emerald-300 underline font-mono cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <span className="text-emerald-400 font-bold font-mono text-[10px] drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]">
                    {formatDistanceSliderValue(minDistance)}
                  </span>
                  <span className="text-emerald-300 font-bold font-mono text-[10px] text-right drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]">
                    {formatDistanceSliderValue(maxDistance)}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative h-5 flex items-center">
                  <div className="absolute left-0 right-0 h-1.5 rounded-lg bg-[#0b1328]" />
                  <div
                    className="absolute h-1.5 rounded-lg bg-emerald-400/70"
                    style={{ left: `${minDistancePos / 10}%`, width: `${(maxDistancePos - minDistancePos) / 10}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    step={1}
                    value={minDistancePos}
                    onFocus={() => setActiveDistanceThumb('min')}
                    onPointerDown={() => setActiveDistanceThumb('min')}
                    onChange={(e) => {
                      const pos = Math.min(Number(e.target.value), maxDistancePos - 1);
                      onChangeFilter({ minDistance: sliderPosToDistance(Math.max(0, pos)) });
                    }}
                    aria-label="Minimum star distance"
                    className={`dual-range-thumb absolute inset-0 w-full h-5 ${activeDistanceThumb === 'min' ? 'z-20' : 'z-10'}`}
                  />
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    step={1}
                    value={maxDistancePos}
                    onFocus={() => setActiveDistanceThumb('max')}
                    onPointerDown={() => setActiveDistanceThumb('max')}
                    onChange={(e) => {
                      const pos = Math.max(Number(e.target.value), minDistancePos + 1);
                      onChangeFilter({ maxDistance: sliderPosToDistance(Math.min(1000, pos)) });
                    }}
                    aria-label="Maximum star distance"
                    className={`dual-range-thumb absolute inset-0 w-full h-5 ${activeDistanceThumb === 'max' ? 'z-20' : 'z-10'}`}
                  />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-slate-500 pt-0.5">
                  <span>0.00001 ly</span>
                  <span>12.9B ly</span>
                </div>
              </div>
            </div>

            {/* Exoplanet Hosts Only Filter: Separate Button */}
            <div className="p-3 bg-[#020510]/80 rounded-xl border border-cyan-500/20 shadow-inner flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-200 block font-sans">Exoplanet Hosts</span>
                  <span className="text-[9px] text-slate-400 font-mono">Confirmed planets</span>
                </div>
              </div>
              <button
                id="btn-toggle-exoplanets-only"
                onClick={() => onChangeFilter({ hasExoplanetsOnly: !filterState.hasExoplanetsOnly })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
                  filterState.hasExoplanetsOnly
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                    : 'bg-[#060c1e] text-slate-400 border-cyan-500/20 hover:text-white hover:border-cyan-500/40'
                }`}
              >
                {filterState.hasExoplanetsOnly ? 'Active' : 'Off'}
              </button>
            </div>

            {/* Naked Eye Filter: Separate Button */}
            <div className="p-3 bg-[#020510]/80 rounded-xl border border-cyan-500/20 shadow-inner flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200 block font-sans">Naked-Eye Visible</span>
                <span className="text-[9px] text-slate-400 font-mono">Apparent mag &lt; 6.0</span>
              </div>
              <button
                id="btn-toggle-naked-eye"
                onClick={() => onChangeFilter({ onlyNakedEye: !filterState.onlyNakedEye })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
                  filterState.onlyNakedEye
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'bg-[#060c1e] text-slate-400 border-cyan-500/20 hover:text-white hover:border-cyan-500/40'
                }`}
              >
                {filterState.onlyNakedEye ? 'Active' : 'Off'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
