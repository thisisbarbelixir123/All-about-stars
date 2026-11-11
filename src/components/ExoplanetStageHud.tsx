import React from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Keyboard,
  X,
  ArrowUpDown,
  Check,
  Grid,
  Telescope,
  RotateCcw,
  RotateCw,
  Layers,
  Eye,
  EyeOff,
  Play,
  Pause,
  Clock,
  Search,
  Square,
  Sliders,
  Maximize2,
  Minimize2,
  Orbit,
  MoveHorizontal,
} from 'lucide-react';
import { CelestialBody, TourLength } from '../types';
import {
  CelestialSortKey,
  SortDirection,
  inferBodyColor,
  formatCompactBodyMass,
  getTourMetricDisplay,
} from '../utils/exoplanetFormatters';
import { deriveSudarskyClass, SUDARSKY_CLASS_INFO } from '../utils/exoplanetArchetypes';
import { ObsStatus } from '../utils/obsBridge';

export interface ExoplanetStageHudProps {
  // State
  sortedBodies: CelestialBody[];
  filteredBodies: CelestialBody[];
  activeIndex: number;
  activeBodyId: string | null;
  activeFocusedBody: CelestialBody | null;
  displayBody: CelestialBody | null;
  loadProgress: { loaded: number; total: number } | null;
  webglError: string | null;
  sortKey: CelestialSortKey;
  sortDirection: SortDirection;
  layoutMode: 'spiral' | 'linear';
  isAutoRotating: boolean;
  wireframe: boolean;
  showGrid: boolean;
  isTourMode: boolean;
  isTourPlaying: boolean;
  tourLength: TourLength;
  isSearchActive: boolean;
  searchQuery: string;
  isFullscreen: boolean;
  areControlsHidden: boolean;
  isTopPanelMinimized: boolean;
  isSortMenuOpen: boolean;
  isLayoutMenuOpen: boolean;
  isTogglesMenuOpen: boolean;
  isTourPaceMenuOpen: boolean;

  // OBS Studio integration
  isObs?: boolean;
  obsStatus?: ObsStatus;

  // Refs
  sortMenuRef: React.RefObject<HTMLDivElement | null>;
  layoutMenuRef: React.RefObject<HTMLDivElement | null>;
  togglesMenuRef: React.RefObject<HTMLDivElement | null>;
  tourPaceMenuRef: React.RefObject<HTMLDivElement | null>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  labelElementsRef: React.MutableRefObject<Map<string, HTMLButtonElement>>;

  // Callbacks
  onSelect: (body: CelestialBody) => void;
  onHover: (body: CelestialBody | null) => void;
  onZoom: (dir: 'in' | 'out') => void;
  onResetCamera: () => void;
  onFitAll: () => void;
  onUnfocus: () => void;
  onToggleTour: () => void;
  onEndTour: () => void;
  onToggleTourPlay: () => void;
  onRestartTour: () => void;
  onPrev: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
  onToggleFullscreen: () => void;
  onSortChange: (key: CelestialSortKey) => void;
  onSortDirectionToggle: () => void;
  onLayoutChange: (mode: 'spiral' | 'linear') => void;
  onToggleAutoRotate: () => void;
  onToggleWireframe: () => void;
  onToggleGrid: () => void;
  onSetTourLength: (len: TourLength) => void;
  onSearchChange: (query: string) => void;
  onToggleSearch: (active: boolean) => void;
  onToggleControlsHidden: (hidden: boolean) => void;
  onToggleTopPanelMinimized: (minimized: boolean) => void;
  onToggleSortMenu: (open: boolean) => void;
  onToggleLayoutMenu: (open: boolean) => void;
  onToggleTogglesMenu: (open: boolean) => void;
  onToggleTourPaceMenu: (open: boolean) => void;
  onOpenShortcutsHelp: () => void;
}

export const ExoplanetStageHud: React.FC<ExoplanetStageHudProps> = ({
  sortedBodies,
  filteredBodies,
  activeIndex,
  activeBodyId,
  activeFocusedBody,
  displayBody,
  loadProgress,
  webglError,
  sortKey,
  sortDirection,
  layoutMode,
  isAutoRotating,
  wireframe,
  showGrid,
  isTourMode,
  isTourPlaying,
  tourLength,
  isSearchActive,
  searchQuery,
  isFullscreen,
  areControlsHidden,
  isTopPanelMinimized,
  isSortMenuOpen,
  isLayoutMenuOpen,
  isTogglesMenuOpen,
  isTourPaceMenuOpen,
  isObs,
  obsStatus,
  sortMenuRef,
  layoutMenuRef,
  togglesMenuRef,
  tourPaceMenuRef,
  searchInputRef,
  labelElementsRef,
  onSelect,
  onHover,
  onZoom,
  onResetCamera,
  onFitAll,
  onUnfocus,
  onToggleTour,
  onEndTour,
  onToggleTourPlay,
  onRestartTour,
  onPrev,
  onNext,
  onFirst,
  onLast,
  onToggleFullscreen,
  onSortChange,
  onSortDirectionToggle,
  onLayoutChange,
  onToggleAutoRotate,
  onToggleWireframe,
  onToggleGrid,
  onSetTourLength,
  onSearchChange,
  onToggleSearch,
  onToggleControlsHidden,
  onToggleTopPanelMinimized,
  onToggleSortMenu,
  onToggleLayoutMenu,
  onToggleTogglesMenu,
  onToggleTourPaceMenu,
  onOpenShortcutsHelp,
}) => {
  return (
    <>
      {/* Loading Progress Bar */}
      {loadProgress && !webglError && (() => {
        const pct = Math.min(100, Math.round((loadProgress.loaded / Math.max(1, loadProgress.total)) * 100));
        return (
          <div
            role="progressbar"
            aria-label="Loading celestial objects"
            aria-valuemin={0}
            aria-valuemax={loadProgress.total}
            aria-valuenow={loadProgress.loaded}
            className="absolute inset-x-0 bottom-28 z-20 flex justify-center px-4 pointer-events-none"
          >
            <div className="w-full max-w-sm rounded-2xl observatory-panel border-white/10 px-4 py-3 text-slate-100 shadow-2xl">
              <div className="flex items-center justify-between gap-3 text-xs font-mono tabular-nums">
                <span className="text-slate-300 font-sans">
                  Loading {loadProgress.loaded.toLocaleString()} / {loadProgress.total.toLocaleString()} objects
                </span>
                <span className="font-semibold text-sky-400">{pct}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-sky-400 transition-[width] duration-75 ease-out motion-reduce:transition-none"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        );
      })()}

      {/* WebGL Error Dialog Fallback */}
      {webglError && (
        <div
          role="alert"
          className="absolute inset-0 z-20 flex items-center justify-center p-6 pointer-events-auto bg-slate-950/90 backdrop-blur-sm"
        >
          <div className="max-w-md rounded-2xl observatory-panel border-white/10 p-6 text-slate-100 shadow-2xl flex flex-col gap-3">
            <h2 className="text-base font-bold text-white font-sans">3D Viewport Unavailable</h2>
            <p className="text-sm text-slate-300 font-sans leading-relaxed">{webglError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="observatory-control min-h-11 px-5 rounded-xl text-xs font-semibold text-white cursor-pointer active:scale-95"
            >
              Reload Viewport
            </button>
          </div>
        </div>
      )}

      {/* Floating 3D Pill Label above focused/hovered body */}
      {!isTourMode && displayBody && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {(() => {
            const body = displayBody;
            const isSelected = body.id === activeBodyId;
            const color = inferBodyColor(body);
            const sudarsky = deriveSudarskyClass(body);
            return (
              <button
                type="button"
                key={body.id}
                id={`label-body-${body.id}`}
                ref={(el) => {
                  if (el) labelElementsRef.current.set(body.id, el);
                  else labelElementsRef.current.delete(body.id);
                }}
                style={{ opacity: 0, willChange: 'transform, opacity' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(body);
                }}
                onMouseEnter={() => onHover(body)}
                onMouseLeave={() => onHover(null)}
                className="absolute top-0 left-0 pointer-events-auto cursor-pointer flex flex-col items-center group transition-opacity duration-150 ease-out bg-transparent border-0 p-0 focus-visible:outline-2 focus-visible:outline-sky-400"
              >
                <div
                  id={`bubble-label-${body.id}`}
                  className={`relative flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl border text-xs shadow-xl transition-all select-none whitespace-nowrap active:scale-95 ${
                    isSelected
                      ? 'observatory-panel border-sky-400/80 text-white font-bold ring-2 ring-sky-400/60'
                      : 'observatory-panel border-white/15 hover:border-white/30 text-slate-100 font-medium'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full aspect-square shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-bold text-white max-w-[200px] truncate leading-normal font-sans">
                    {body.name}
                  </span>
                  <span className="text-[10px] bg-white/5 text-sky-300 font-mono px-1.5 py-0.5 rounded border border-white/10 shrink-0 font-semibold">
                    {body.classification}
                  </span>
                  {sudarsky && (
                    <span
                      title={`${SUDARSKY_CLASS_INFO[sudarsky].fullLabel}: ${SUDARSKY_CLASS_INFO[sudarsky].cloudDeck}`}
                      className="text-[10px] bg-white/5 text-amber-200 font-mono px-1.5 py-0.5 rounded border border-amber-400/30 shrink-0 font-semibold"
                    >
                      <span className="sm:hidden">{sudarsky}</span>
                      <span className="hidden sm:inline">Sudarsky {sudarsky}</span>
                    </span>
                  )}
                  <span className="text-[10px] text-slate-300 font-mono shrink-0 hidden xs:inline">
                    {body.diameterEarth >= 1.0
                      ? `${body.diameterEarth.toFixed(2)} D⊕`
                      : `${Math.round(body.diameterKm).toLocaleString()} km`}
                  </span>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-[6px] border-t-sky-400 group-data-[near-top=true]:hidden" />
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-b-[6px] border-b-sky-400 hidden group-data-[near-top=true]:block" />
                </div>
              </button>
            );
          })()}
        </div>
      )}

      {/* Top Floating Control Bar */}
      {!areControlsHidden && !isTourMode && (
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-30">
          {/* Top-Left: Sort, Auto Tour & OBS Status */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pointer-events-auto">
            {/* Sort Toggle & Dropdown */}
            <div className="relative pointer-events-auto" ref={sortMenuRef}>
              <div className="flex items-center observatory-panel rounded-xl border-white/10 text-xs font-sans overflow-hidden">
                <button
                  type="button"
                  id="btn-sort-cycle"
                  onClick={() => {
                    const keys: CelestialSortKey[] = ['size', 'mass', 'temperature', 'discoveryYear'];
                    const idx = keys.indexOf(sortKey);
                    onSortChange(keys[(idx + 1) % keys.length]);
                  }}
                  title="Click to cycle sort metric"
                  className="min-h-11 flex items-center gap-1.5 px-3 py-2 text-slate-200 hover:text-white observatory-control transition-all cursor-pointer select-none"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="text-slate-400 hidden sm:inline">Sort:</span>
                  <span className="text-sky-300 font-bold capitalize">
                    {sortKey === 'discoveryYear' ? 'Discovery' : sortKey}
                  </span>
                </button>

                <div className="w-[1px] h-4 bg-white/10" />

                <button
                  type="button"
                  id="btn-sort-direction"
                  onClick={onSortDirectionToggle}
                  title={`Currently ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
                  className="min-h-11 flex items-center gap-1 px-3 py-2 text-slate-200 hover:text-sky-300 observatory-control transition-all cursor-pointer select-none"
                >
                  <span className="text-xs font-semibold text-sky-400">
                    {sortDirection === 'asc' ? 'Asc ↑' : 'Desc ↓'}
                  </span>
                </button>

                <div className="w-[1px] h-4 bg-white/10" />

                <button
                  type="button"
                  id="btn-sort-menu-trigger"
                  onClick={() => onToggleSortMenu(!isSortMenuOpen)}
                  title="Open Sort Menu"
                  className={`min-w-11 min-h-11 inline-flex items-center justify-center text-slate-400 hover:text-sky-300 observatory-control transition-all cursor-pointer ${
                    isSortMenuOpen ? 'text-sky-300 bg-white/10' : ''
                  }`}
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSortMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {isSortMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 observatory-panel border-white/10 rounded-xl shadow-2xl p-2 z-50 text-xs font-sans flex flex-col gap-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">
                    Sort Metric
                  </div>
                  {[
                    { key: 'size', label: 'Size', desc: 'Diameter (km / D⊕)' },
                    { key: 'mass', label: 'Mass', desc: 'Planetary mass (M⊕ / M♃)' },
                    { key: 'temperature', label: 'Temperature', desc: 'Equilibrium temp (K)' },
                    { key: 'discoveryYear', label: 'Discovery Year', desc: 'Year of discovery' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => {
                        onSortChange(item.key as CelestialSortKey);
                        onToggleSortMenu(false);
                      }}
                      className={`min-h-11 flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                        sortKey === item.key
                          ? 'bg-sky-500/10 text-sky-300 font-bold border border-sky-400/30'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-xs">{item.label}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.desc}</div>
                      </div>
                      {sortKey === item.key && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auto Tour & Pace Controls */}
            <div className="flex items-center gap-1 sm:gap-1.5 pointer-events-auto">
              <button
                type="button"
                id="btn-auto-tour"
                onClick={onToggleTour}
                title={isTourPlaying ? 'Pause Auto Tour (T)' : 'Play Auto Tour (T)'}
                className={`min-h-11 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-sans font-semibold transition-all cursor-pointer shadow-lg active:scale-95 ${
                  isTourPlaying
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'observatory-panel border-white/10 text-slate-200 hover:text-white observatory-control'
                }`}
              >
                {isTourPlaying ? (
                  <Pause className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                )}
                <span>{isTourPlaying ? 'Playing' : 'Auto Tour'}</span>
              </button>

              <div className="relative pointer-events-auto" ref={tourPaceMenuRef}>
                <button
                  type="button"
                  id="btn-tour-pace"
                  onClick={() => onToggleTourPaceMenu(!isTourPaceMenuOpen)}
                  title="Tour Pace (P)"
                  className="min-h-11 flex items-center gap-1.5 px-3 py-2 rounded-xl observatory-panel border-white/10 text-slate-200 hover:text-white text-xs font-sans active:scale-95 cursor-pointer shadow-lg observatory-control"
                >
                  <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="text-slate-400 hidden sm:inline">Pace:</span>
                  <span className="text-sky-300 font-bold capitalize">{tourLength}</span>
                  <ChevronDown className="w-3 h-3 text-sky-400 shrink-0" />
                </button>

                {isTourPaceMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-36 observatory-panel border-white/10 rounded-xl shadow-2xl p-1.5 z-50 text-xs font-sans flex flex-col gap-1">
                    {(['short', 'medium', 'long'] as const).map((len) => (
                      <button
                        type="button"
                        key={len}
                        onClick={() => {
                          onSetTourLength(len);
                          onToggleTourPaceMenu(false);
                        }}
                        className={`min-h-11 w-full flex items-center justify-between px-3 py-2 rounded-lg text-left capitalize ${
                          tourLength === len
                            ? 'text-sky-300 font-bold bg-sky-500/10 border border-sky-400/20'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>{len}</span>
                        {tourLength === len && <Check className="w-3 h-3 text-sky-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* OBS Studio Live Status Badge */}
            {isObs && (
              <div
                id="obs-status-badge"
                className="min-h-11 flex items-center gap-2 px-3 py-2 rounded-xl observatory-panel border-white/10 text-xs font-mono text-slate-200 shadow-md"
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    obsStatus?.recording
                      ? 'bg-rose-500 animate-pulse'
                      : obsStatus?.streaming
                        ? 'bg-purple-500 animate-pulse'
                        : 'bg-sky-400'
                  }`}
                />
                <span className="font-semibold">
                  {obsStatus?.recording
                    ? 'OBS Rec'
                    : obsStatus?.streaming
                      ? 'OBS Live'
                      : 'OBS Active'}
                </span>
              </div>
            )}
          </div>

          {/* Top-Right: Zoom, Reset, Fit All, Layout, More, Shortcuts, Fullscreen */}
          <div className="flex items-center gap-1 sm:gap-1.5 observatory-panel p-1 sm:p-1.5 rounded-2xl border-white/10 shadow-2xl pointer-events-auto">
            {isTopPanelMinimized ? (
              <button
                type="button"
                id="btn-top-maximize"
                onClick={() => onToggleTopPanelMinimized(false)}
                title="Stage Controls"
                className="min-h-11 px-3 py-2 rounded-xl text-xs font-sans font-semibold text-sky-300 hover:text-white observatory-control transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Sliders className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Stage Controls</span>
              </button>
            ) : (
              <>
                {/* Zoom In & Out */}
                <button
                  type="button"
                  id="btn-zoom-in"
                  onClick={() => onZoom('in')}
                  title="Zoom In (+)"
                  className="min-w-11 min-h-11 flex items-center justify-center rounded-xl text-slate-200 hover:text-white observatory-control font-bold text-sm transition-colors cursor-pointer active:scale-95"
                >
                  +
                </button>
                <button
                  type="button"
                  id="btn-zoom-out"
                  onClick={() => onZoom('out')}
                  title="Zoom Out (−)"
                  className="min-w-11 min-h-11 flex items-center justify-center rounded-xl text-slate-200 hover:text-white observatory-control font-bold text-sm transition-colors cursor-pointer active:scale-95"
                >
                  −
                </button>

                {/* Focus / Unfocus / Reset */}
                {activeFocusedBody ? (
                  <button
                    type="button"
                    id="btn-unfocus"
                    onClick={onUnfocus}
                    title="Unfocus Object (U)"
                    className="min-h-11 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-sans font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <X className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">Unfocus</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    id="btn-reset-cam"
                    onClick={onResetCamera}
                    title="Reset Camera (R)"
                    className="min-h-11 flex items-center gap-1.5 px-3 py-2 rounded-xl observatory-control text-sky-300 text-xs font-sans font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                )}

                {/* Fit All */}
                <button
                  type="button"
                  id="btn-fit-all"
                  onClick={onFitAll}
                  title="Fit All Objects (A)"
                  className="min-h-11 flex items-center gap-1.5 px-3 py-2 rounded-xl observatory-control text-slate-200 hover:text-white text-xs font-sans font-medium transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <Telescope className="w-3.5 h-3.5 shrink-0 text-sky-400" />
                  <span className="hidden sm:inline">Fit All</span>
                </button>

                {/* Spiral / Linear Layout Mode Toggle */}
                <div className="relative pointer-events-auto" ref={layoutMenuRef}>
                  <div
                    className={`min-h-11 flex items-center rounded-xl border text-xs font-sans font-semibold transition-all shadow-sm ${
                      layoutMode === 'spiral'
                        ? 'bg-purple-950/80 border-purple-500/50 text-purple-300'
                        : 'bg-emerald-950/80 border-emerald-400/50 text-emerald-300'
                    }`}
                  >
                    <button
                      type="button"
                      id="btn-toggle-layout"
                      onClick={() => onLayoutChange(layoutMode === 'linear' ? 'spiral' : 'linear')}
                      title={`Stage Layout: ${layoutMode === 'spiral' ? 'Spiral Mode (L)' : 'Linear Mode (L)'}. Click to toggle.`}
                      className="min-h-11 flex items-center gap-1.5 px-3 py-2 hover:bg-white/10 active:scale-95 transition-all cursor-pointer rounded-l-xl select-none"
                    >
                      {layoutMode === 'spiral' ? (
                        <Orbit className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                      ) : (
                        <MoveHorizontal className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      )}
                      <span className="hidden sm:inline">
                        {layoutMode === 'spiral' ? 'Spiral' : 'Linear'}
                      </span>
                    </button>

                    <div className="w-[1px] h-4 bg-white/20" />

                    <button
                      type="button"
                      id="btn-layout-menu-trigger"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLayoutMenu(!isLayoutMenuOpen);
                      }}
                      title="Select Layout Mode (Spiral / Linear)"
                      className="min-w-11 min-h-11 inline-flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all cursor-pointer rounded-r-xl"
                    >
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          isLayoutMenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {isLayoutMenuOpen && (
                    <div
                      id="menu-layout-mode-dropdown"
                      className="absolute right-0 top-full mt-2 w-44 observatory-panel border-white/10 rounded-xl shadow-2xl p-2 z-50 text-xs font-sans flex flex-col gap-1"
                    >
                      <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10 pb-1 mb-1">
                        Catalog Layout
                      </div>
                      {(['spiral', 'linear'] as const).map((mode) => {
                        const isActive = layoutMode === mode;
                        return (
                          <button
                            type="button"
                            key={mode}
                            id={`btn-layout-option-${mode}`}
                            onClick={() => {
                              onLayoutChange(mode);
                              onToggleLayoutMenu(false);
                            }}
                            className={`min-h-11 flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                              isActive
                                ? mode === 'spiral'
                                  ? 'bg-purple-950/80 text-purple-300 font-bold border border-purple-500/30'
                                  : 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/30'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {mode === 'spiral' ? (
                                <Orbit
                                  className={`w-3.5 h-3.5 ${
                                    isActive ? 'text-purple-400' : 'text-slate-400'
                                  }`}
                                />
                              ) : (
                                <MoveHorizontal
                                  className={`w-3.5 h-3.5 ${
                                    isActive ? 'text-emerald-400' : 'text-slate-400'
                                  }`}
                                />
                              )}
                              <span>{mode === 'spiral' ? 'Spiral Mode' : 'Linear Mode'}</span>
                            </span>
                            {isActive && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="h-4 w-[1px] bg-white/10 mx-0.5" />

                {/* More... Menu for Spin, Wireframe, Floor Grid */}
                <div className="relative" ref={togglesMenuRef}>
                  <button
                    type="button"
                    id="btn-more-menu"
                    onClick={() => onToggleTogglesMenu(!isTogglesMenuOpen)}
                    title="More Scene Options"
                    className={`min-h-11 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-sans transition-all cursor-pointer select-none active:scale-95 observatory-control ${
                      isAutoRotating || wireframe || showGrid
                        ? 'border-sky-400/50 text-sky-300'
                        : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    <span>More</span>
                    <ChevronDown
                      className={`w-3 h-3 text-sky-400 transition-transform ${isTogglesMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isTogglesMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 observatory-panel border-white/10 rounded-xl shadow-2xl p-2 z-50 text-xs font-sans flex flex-col gap-1">
                      <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">
                        Scene Toggles
                      </div>

                      <button
                        type="button"
                        onClick={onToggleAutoRotate}
                        className={`min-h-11 flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                          isAutoRotating ? 'bg-sky-500/10 text-sky-300 font-bold border border-sky-400/30' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'text-sky-400' : 'text-slate-400'}`} />
                          <span>Spin Worlds</span>
                        </span>
                        {isAutoRotating && <Check className="w-3.5 h-3.5 text-sky-400" />}
                      </button>

                      <button
                        type="button"
                        onClick={onToggleWireframe}
                        className={`min-h-11 flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                          wireframe ? 'bg-amber-500/10 text-amber-300 font-bold border border-amber-400/30' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Layers className={`w-3.5 h-3.5 ${wireframe ? 'text-amber-400' : 'text-slate-400'}`} />
                          <span>Wireframe</span>
                        </span>
                        {wireframe && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>

                      <button
                        type="button"
                        onClick={onToggleGrid}
                        className={`min-h-11 flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                          showGrid ? 'bg-sky-500/10 text-sky-300 font-bold border border-sky-400/30' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Grid className={`w-3.5 h-3.5 ${showGrid ? 'text-sky-400' : 'text-slate-400'}`} />
                          <span>Floor Grid</span>
                        </span>
                        {showGrid && <Check className="w-3.5 h-3.5 text-sky-400" />}
                      </button>

                      <div className="border-t border-white/10 my-1" />

                      <button
                        type="button"
                        onClick={() => {
                          onLayoutChange(layoutMode === 'linear' ? 'spiral' : 'linear');
                          onToggleTogglesMenu(false);
                        }}
                        className="min-h-11 flex items-center justify-between px-3 py-2 rounded-lg transition-all text-slate-300 hover:bg-white/5 cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          {layoutMode === 'spiral' ? (
                            <Orbit className="w-3.5 h-3.5 text-purple-400" />
                          ) : (
                            <MoveHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          <span>Layout: {layoutMode === 'spiral' ? 'Spiral' : 'Linear'}</span>
                        </span>
                        <span className="text-[10px] text-sky-400 font-bold uppercase font-mono">Toggle (L)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Keyboard Shortcuts */}
                <button
                  type="button"
                  id="btn-shortcuts"
                  onClick={onOpenShortcutsHelp}
                  title="Keyboard Shortcuts (?)"
                  className="min-h-11 hidden lg:flex px-3 py-2 rounded-xl text-xs font-sans text-slate-200 hover:text-white observatory-control transition-colors cursor-pointer items-center gap-1.5"
                >
                  <Keyboard className="w-3.5 h-3.5 text-sky-400" />
                  <span>Shortcuts</span>
                </button>

                {/* Fullscreen Toggle Button */}
                <button
                  type="button"
                  id="btn-fullscreen-top"
                  onClick={onToggleFullscreen}
                  title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
                  className="min-h-11 px-3 py-2 rounded-xl text-xs font-sans text-slate-200 hover:text-white observatory-control transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  )}
                  <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Full'}</span>
                </button>

                {/* Minimize Button */}
                <button
                  type="button"
                  id="btn-minimize-panel"
                  onClick={() => onToggleTopPanelMinimized(true)}
                  title="Minimize Panel"
                  className="min-w-11 min-h-11 inline-flex items-center justify-center rounded-xl text-slate-300 hover:text-white observatory-control transition-all cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom Floating Navigator & Filmstrip */}
      {!isTourMode && (
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex flex-col gap-2 sm:gap-3 pointer-events-none z-20">
          {/* Focused Body Info Strip */}
          {activeFocusedBody && (() => {
            const focusedSudarsky = deriveSudarskyClass(activeFocusedBody);
            const focusedSudarskyMeta = focusedSudarsky ? SUDARSKY_CLASS_INFO[focusedSudarsky] : undefined;
            return (
              <div
                id="stage-focused-star-strip"
                className="flex items-center justify-between gap-2 sm:gap-3 observatory-panel px-4 py-2.5 rounded-2xl border-white/10 shadow-2xl transition-all pointer-events-auto w-full"
              >
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 overflow-hidden">
                  <span
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full aspect-square shrink-0 ring-1 ring-white/30"
                    style={{ backgroundColor: inferBodyColor(activeFocusedBody) }}
                  />

                  <div className="flex items-center gap-x-2 text-xs font-sans min-w-0 flex-1 overflow-hidden">
                    <span className="font-bold text-white flex items-center gap-1.5 min-w-0 shrink truncate">
                      <span className="text-white font-bold truncate">{activeFocusedBody.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-sky-300 font-mono border border-white/10 shrink-0">
                        {activeFocusedBody.classification}
                      </span>
                      {focusedSudarskyMeta && (
                        <span
                          title={`${focusedSudarskyMeta.fullLabel}: ${focusedSudarskyMeta.cloudDeck} (${focusedSudarskyMeta.tempRangeLabel})`}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-amber-200 font-mono border border-amber-400/30 shrink-0"
                        >
                          <span className="sm:hidden">{focusedSudarskyMeta.sudarskyClass}</span>
                          <span className="hidden sm:inline xl:hidden">{focusedSudarskyMeta.fullLabel}</span>
                          <span className="hidden xl:inline">
                            {focusedSudarskyMeta.fullLabel} ({focusedSudarskyMeta.cloudDeck})
                          </span>
                        </span>
                      )}
                    </span>

                    <span className="text-slate-300 font-mono shrink-0">
                      {activeFocusedBody.diameterEarth >= 1.0
                        ? `${activeFocusedBody.diameterEarth.toFixed(2)} D⊕`
                        : `${activeFocusedBody.diameterEarth.toFixed(3)} D⊕`}
                    </span>

                    <span className="hidden sm:inline text-slate-400 font-mono shrink-0">
                      ({Math.round(activeFocusedBody.diameterKm).toLocaleString()} km)
                    </span>

                    {activeFocusedBody.temperatureK && activeFocusedBody.temperatureK > 0 && (
                      <>
                        <span className="hidden md:inline text-slate-500 shrink-0">•</span>
                        <span className="hidden md:inline text-slate-300 font-mono shrink-0">
                          {activeFocusedBody.temperatureK} K
                        </span>
                      </>
                    )}

                    <span className="hidden lg:inline text-slate-500 shrink-0">•</span>
                    <span className="hidden lg:inline text-slate-400 shrink-0 truncate">
                      {activeFocusedBody.hostSystem}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-preview-unfocus"
                  onClick={onUnfocus}
                  className="min-w-11 min-h-11 rounded-xl observatory-control text-slate-300 hover:text-white text-xs font-sans transition-all cursor-pointer inline-flex items-center justify-center gap-1 active:scale-95 shrink-0"
                  title="Unfocus Object (U)"
                >
                  <X className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden md:inline">Unfocus</span>
                </button>
              </div>
            );
          })()}

          {/* Filmstrip & Navigator */}
          <div className="flex flex-col gap-2 pointer-events-auto">
            {/* Horizontal Search Strip */}
            {!areControlsHidden && isSearchActive && (
              <div className="flex items-center gap-2 max-w-full overflow-x-auto pb-1.5 scrollbar-thin animate-in fade-in duration-200">
                {filteredBodies.length > 0 ? (
                  filteredBodies.map((body) => {
                    const originalIdx = sortedBodies.findIndex((b) => b.id === body.id);
                    const isSelected = body.id === activeBodyId;
                    const color = inferBodyColor(body);
                    const itemSudarsky = deriveSudarskyClass(body);
                    return (
                      <button
                        type="button"
                        key={body.id}
                        onClick={() => onSelect(body)}
                        className={`group min-h-11 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-left transition-all shrink-0 cursor-pointer ${
                          isSelected
                            ? 'observatory-panel border-sky-400 text-white shadow-xl scale-105 font-bold'
                            : 'observatory-panel border-white/10 text-slate-300 hover:border-white/30 observatory-control'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full aspect-square shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <div>
                          <div className="text-xs font-semibold leading-tight group-hover:text-sky-300 whitespace-nowrap flex items-center gap-1.5 font-sans">
                            <span className="text-[10px] text-sky-400 font-mono">#{originalIdx + 1}</span>
                            <span>{body.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                            {body.diameterEarth >= 1.0
                              ? `${body.diameterEarth.toFixed(2)} D⊕`
                              : `${Math.round(body.diameterKm).toLocaleString()} km`}
                            {itemSudarsky ? ` · Sudarsky ${itemSudarsky}` : ''}
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="min-h-11 flex items-center gap-2 px-4 py-2 rounded-xl observatory-panel border-white/10 text-xs font-sans text-slate-300">
                    <Search className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>No worlds matching &quot;{searchQuery}&quot;</span>
                    <button
                      type="button"
                      onClick={() => onSearchChange('')}
                      className="text-sky-400 hover:text-white underline font-semibold ml-1 cursor-pointer"
                    >
                      Show all ({sortedBodies.length})
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Bar: Navigator + Search + Shortcuts + Hide */}
            <div className={`flex items-center ${areControlsHidden ? 'justify-end' : 'justify-between'} gap-2 w-full`}>
              {areControlsHidden ? (
                <button
                  type="button"
                  id="btn-show-controls"
                  onClick={() => onToggleControlsHidden(false)}
                  title="Show Controls (H)"
                  className="min-h-11 px-4 py-2 rounded-xl border text-xs font-sans font-semibold transition-all cursor-pointer shadow-lg active:scale-95 flex items-center gap-1.5 observatory-panel border-white/10 text-sky-300 observatory-control ml-auto"
                >
                  <Eye className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="hidden sm:inline">Show controls</span>
                </button>
              ) : (
                <>
                  {/* Integrated Navigator */}
                  <div className="flex items-center gap-0.5 sm:gap-1 observatory-panel p-1 rounded-2xl border-white/10 shadow-2xl shrink-0 font-sans">
                    <button
                      type="button"
                      id="btn-nav-first"
                      onClick={onFirst}
                      title={`First Object (#1: ${sortedBodies[0]?.name || 'First'})`}
                      className="min-h-11 px-3 py-2 rounded-xl text-slate-300 hover:text-white observatory-control active:scale-95 transition-colors cursor-pointer text-xs font-semibold shrink-0"
                    >
                      <span className="sm:hidden">#1</span>
                      <span className="hidden sm:inline">First (#1)</span>
                    </button>

                    <button
                      type="button"
                      id="btn-nav-prev"
                      onClick={onPrev}
                      title="Previous Object (←)"
                      className="min-h-11 px-3 py-2 rounded-xl text-slate-300 hover:text-white observatory-control active:scale-95 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden md:inline text-[11px]">Prev</span>
                    </button>

                    <span className="text-[10px] sm:text-xs font-mono px-2 text-sky-300 font-bold border-x border-white/10 shrink-0">
                      {activeIndex >= 0 ? `${activeIndex + 1} / ${sortedBodies.length}` : 'All'}
                    </span>

                    <button
                      type="button"
                      id="btn-nav-next"
                      onClick={onNext}
                      title="Next Object (→)"
                      className="min-h-11 px-3 py-2 rounded-xl text-slate-300 hover:text-white observatory-control active:scale-95 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span className="hidden md:inline text-[11px]">Next</span>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    </button>

                    <button
                      type="button"
                      id="btn-nav-last"
                      onClick={onLast}
                      title={`Last Object (#${sortedBodies.length}: ${sortedBodies[sortedBodies.length - 1]?.name || 'Last'})`}
                      className="min-h-11 px-3 py-2 rounded-xl text-slate-300 hover:text-amber-300 observatory-control active:scale-95 transition-colors cursor-pointer text-xs font-semibold shrink-0"
                    >
                      <span className="sm:hidden">#{sortedBodies.length}</span>
                      <span className="hidden sm:inline">Last (#{sortedBodies.length})</span>
                    </button>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {!isSearchActive ? (
                      <button
                        type="button"
                        id="btn-open-search"
                        onClick={() => onToggleSearch(true)}
                        className="min-h-11 flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-sans font-semibold transition-all cursor-pointer shadow-lg active:scale-95 observatory-panel border-white/10 text-slate-200 hover:text-white observatory-control shrink-0"
                        title="Search Objects (B)"
                      >
                        <Search className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="hidden sm:inline">Search ({sortedBodies.length})</span>
                      </button>
                    ) : (
                      <div className="min-h-11 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-400/50 observatory-panel text-xs font-sans shadow-xl w-48 sm:w-64 shrink-0 focus-within:ring-2 focus-within:ring-sky-400/60">
                        <Search className="w-3.5 h-3.5 text-sky-400 shrink-0" aria-hidden="true" />
                        <label htmlFor="stage-world-search-input" className="sr-only">
                          Search celestial worlds and Sudarsky classes
                        </label>
                        <input
                          id="stage-world-search-input"
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => onSearchChange(e.target.value)}
                          placeholder={`Search ${sortedBodies.length} worlds...`}
                          className="bg-transparent text-white text-xs font-sans placeholder:text-slate-400 focus:outline-none w-full min-w-0"
                          autoFocus
                        />
                        <button
                          type="button"
                          aria-label="Close search"
                          onClick={() => {
                            onToggleSearch(false);
                            onSearchChange('');
                          }}
                          className="min-w-8 min-h-8 inline-flex items-center justify-center text-slate-300 hover:text-white shrink-0 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-sky-400"
                        >
                          <X className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      id="btn-shortcuts-bottom"
                      onClick={onOpenShortcutsHelp}
                      className="min-h-11 hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl observatory-panel border-white/10 text-xs font-sans text-slate-200 hover:text-white observatory-control transition-all cursor-pointer shadow-md"
                    >
                      <Keyboard className="w-3.5 h-3.5 text-sky-400" />
                      <span>Shortcuts</span>
                    </button>

                    <button
                      type="button"
                      id="btn-hide-controls"
                      onClick={() => onToggleControlsHidden(true)}
                      title="Hide Controls (H)"
                      className="min-w-11 min-h-11 inline-flex items-center justify-center rounded-xl border text-xs font-sans font-semibold transition-all cursor-pointer shadow-lg active:scale-95 observatory-panel border-white/10 text-slate-300 hover:text-white observatory-control shrink-0"
                    >
                      <EyeOff className="w-3.5 h-3.5 text-slate-400 hover:text-sky-300 shrink-0" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cinematic 3D Tour Mode Overlay */}
      {isTourMode && (
        <>
          {/* Top-Left Tour Controls */}
          <div className="absolute top-0 left-0 pt-3 pl-3 sm:pt-4 sm:pl-4 pb-16 pr-20 z-40 group pointer-events-auto select-none">
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0">
              <button
                type="button"
                id="btn-tour-end"
                onClick={onEndTour}
                title="End Tour (Esc)"
                className="min-h-11 flex items-center gap-1.5 px-4 py-2 rounded-xl observatory-panel hover:bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:text-white shadow-2xl text-xs font-sans font-semibold transition-all cursor-pointer active:scale-95"
              >
                <Square className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                <span>End Tour</span>
              </button>

              <button
                type="button"
                id="btn-tour-restart"
                onClick={onRestartTour}
                title="Restart Tour from First World"
                className="min-h-11 flex items-center gap-1.5 px-4 py-2 rounded-xl observatory-panel border-white/10 text-sky-300 hover:text-white shadow-2xl text-xs font-sans font-semibold transition-all cursor-pointer active:scale-95 observatory-control"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                <span>Restart</span>
              </button>

              <button
                type="button"
                id="btn-tour-play-pause"
                onClick={onToggleTourPlay}
                className="min-h-11 flex items-center gap-1.5 px-4 py-2 rounded-xl observatory-panel border-white/10 text-slate-200 hover:text-white shadow-2xl text-xs font-sans transition-all cursor-pointer active:scale-95 observatory-control"
              >
                {isTourPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-300 font-semibold">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-sky-300 font-semibold">Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Lower Third Cinematic Vitals Display */}
          {activeFocusedBody && (() => {
            const metric = getTourMetricDisplay(activeFocusedBody, sortKey);
            const currentNum = activeIndex >= 0 ? activeIndex + 1 : 1;
            const total = sortedBodies.length;
            const progressPercent = total > 0 ? (currentNum / total) * 100 : 0;
            const color = inferBodyColor(activeFocusedBody);
            const tourSudarsky = deriveSudarskyClass(activeFocusedBody);
            const tourSudarskyMeta = tourSudarsky ? SUDARSKY_CLASS_INFO[tourSudarsky] : undefined;

            return (
              <div className="absolute inset-x-0 bottom-0 pointer-events-none z-30 flex flex-col justify-end">
                <div
                  className="w-full bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-20 pb-6 px-4 sm:px-8 md:px-12 flex flex-col gap-2.5 sm:gap-3"
                  style={{ textShadow: '0 2px 20px rgba(0,0,0,0.9)' }}
                >
                  {/* Top metadata row */}
                  <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
                    <span className="px-3 py-1 rounded-full observatory-panel border-white/10 text-sky-300 font-semibold uppercase tracking-wider text-[11px] sm:text-xs">
                      #{currentNum} of {total} • {metric.label}
                    </span>

                    {isTourPlaying ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[10px] sm:text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        Auto Tour Playing
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full observatory-panel border-white/10 text-slate-300 text-[10px] sm:text-[11px]">
                        Tour Paused
                      </span>
                    )}

                    <span className="text-slate-400 text-xs hidden sm:inline">
                      Host: {activeFocusedBody.hostSystem}
                    </span>
                  </div>

                  {/* Giant Name & Comparison Metrics */}
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-8">
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 sm:gap-3.5">
                        <span
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full aspect-square shrink-0 ring-2 ring-white/50"
                          style={{ backgroundColor: color }}
                        />
                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-display text-white tracking-tight leading-tight truncate">
                          {activeFocusedBody.name}
                        </h1>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-300 font-sans mt-2">
                        <span className="font-semibold text-sky-300">
                          {activeFocusedBody.classification}
                        </span>
                        {tourSudarskyMeta && (
                          <>
                            <span className="text-slate-500">•</span>
                            <span className="font-mono font-semibold text-amber-200">
                              {tourSudarskyMeta.fullLabel} ({tourSudarskyMeta.cloudDeck})
                            </span>
                          </>
                        )}
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-300">
                          Host System: {activeFocusedBody.hostSystem}
                        </span>
                        {activeFocusedBody.discoveryYear && activeFocusedBody.discoveryYear > 0 && (
                          <>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-400">
                              Discovered: {activeFocusedBody.discoveryYear}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right-hand Comparison Metric */}
                    <div className="flex flex-col lg:items-end shrink-0">
                      <div className="text-[10px] sm:text-xs font-sans font-semibold tracking-wider text-sky-400 uppercase">
                        {metric.label}
                      </div>
                      <div className="text-3xl sm:text-5xl md:text-6xl font-mono font-black text-sky-300 tracking-tight leading-none">
                        {metric.primary}
                      </div>
                      <div className="text-[11px] sm:text-xs font-sans text-slate-400 mt-1">
                        {metric.secondary}
                      </div>
                    </div>
                  </div>

                  {/* Secondary Vitals Ribbon */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-[11px] sm:text-xs font-mono">
                    {tourSudarskyMeta && (
                      <span className="px-2.5 py-1 rounded-xl observatory-panel border-white/10 text-amber-200">
                        <span className="text-slate-400 mr-1 font-sans">Sudarsky:</span>
                        <span className="font-semibold">
                          {tourSudarskyMeta.sudarskyClass} ({tourSudarskyMeta.cloudDeck})
                        </span>
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-xl observatory-panel border-white/10 text-slate-300">
                      <span className="text-slate-400 mr-1 font-sans">Diameter:</span>
                      <span className="text-white font-semibold">
                        {Math.round(activeFocusedBody.diameterKm).toLocaleString()} km
                      </span>
                    </span>
                    <span className="px-2.5 py-1 rounded-xl observatory-panel border-white/10 text-slate-300">
                      <span className="text-slate-400 mr-1 font-sans">Earth Scale:</span>
                      <span className="text-white font-semibold">
                        {activeFocusedBody.diameterEarth.toFixed(activeFocusedBody.diameterEarth < 0.1 ? 3 : 2)} D⊕
                      </span>
                    </span>
                    <span className="px-2.5 py-1 rounded-xl observatory-panel border-white/10 text-slate-300">
                      <span className="text-slate-400 mr-1 font-sans">Jupiter Scale:</span>
                      <span className="text-white font-semibold">
                        {activeFocusedBody.diameterJupiter.toFixed(activeFocusedBody.diameterJupiter < 0.05 ? 4 : 2)} D♃
                      </span>
                    </span>
                    {activeFocusedBody.massEarth !== undefined && activeFocusedBody.massEarth > 0 && (
                      <span className="px-2.5 py-1 rounded-xl observatory-panel border-white/10 text-slate-300">
                        <span className="text-slate-400 mr-1 font-sans">Mass:</span>
                        <span className="text-white font-semibold">
                          {formatCompactBodyMass(activeFocusedBody)}
                        </span>
                      </span>
                    )}
                    {activeFocusedBody.temperatureK !== undefined && activeFocusedBody.temperatureK > 0 && (
                      <span className="px-2.5 py-1 rounded-xl observatory-panel border-white/10 text-slate-300">
                        <span className="text-slate-400 mr-1 font-sans">Temp:</span>
                        <span className="text-white font-semibold">{activeFocusedBody.temperatureK} K</span>
                      </span>
                    )}
                    {activeFocusedBody.albedo !== undefined && (
                      <span className="px-2.5 py-1 rounded-xl observatory-panel border-white/10 text-slate-300">
                        <span className="text-slate-400 mr-1 font-sans">Albedo:</span>
                        <span className="text-sky-300 font-semibold">
                          {(activeFocusedBody.albedo * 100).toFixed(1)}% ({activeFocusedBody.albedo.toFixed(2)})
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Slim Tour Progress Bar */}
                <div className="w-full h-1 bg-black/80 relative overflow-hidden">
                  <div
                    className="h-full bg-sky-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            );
          })()}
        </>
      )}
    </>
  );
};
