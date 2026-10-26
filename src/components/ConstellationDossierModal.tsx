import React, { useState, useEffect, useRef } from 'react';
import { StarData } from '../types';
import { STARS_CATALOG } from '../data/stars';
import { ConstellationInfo } from '../data/constellationsData';
import { CelestialData } from '../hooks/useCelestialData';
import { ConstellationMap, SkyMapOptions } from './ConstellationMap';
import { MapToolbarToggle } from './common/MapToolbarToggle';
import { StarDot2D } from './StarDot2D';
import { RunningText } from './RunningText';
import {
  extractBounds,
  isPolarConstellation,
  isStarBelongingToConstellation,
  getDynamicStarLocationDescription
} from '../utils/celestialMechanics';
import {
  X,
  Compass,
  Grid,
  Layers,
  Tag,
  Orbit,
  Sparkles,
  Navigation,
  Crosshair,
  Star,
  Info
} from 'lucide-react';

interface ConstellationDossierModalProps {
  constellation: ConstellationInfo | null;
  onClose: () => void;
  celestialData: CelestialData;
  onSelectStar: (star: StarData) => void;
  onSelectNeighbor: (neighbor: ConstellationInfo) => void;
  starMap: Map<string, StarData>;
}

export const ConstellationDossierModal: React.FC<ConstellationDossierModalProps> = ({
  constellation,
  onClose,
  celestialData,
  onSelectStar,
  onSelectNeighbor,
  starMap
}) => {
  const dossierScrollRef = useRef<HTMLDivElement>(null);

  const [skyMapOptions, setSkyMapOptions] = useState<SkyMapOptions>({
    showGraticule: true,
    showBoundaries: true,
    showStarLabels: false,
    showEquatorEcliptic: true,
    showDeepSky: true,
    showNeighborGuides: true
  });

  const [activeStarLabelId, setActiveStarLabelId] = useState<string | null>(null);
  const [hoveredStarId, setHoveredStarId] = useState<string | null>(null);

  useEffect(() => {
    if (constellation && dossierScrollRef.current) {
      dossierScrollRef.current.scrollTop = 0;
    }
    setActiveStarLabelId(null);
    setHoveredStarId(null);
  }, [constellation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && constellation) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [constellation, onClose]);

  if (!constellation) return null;

  const decBounds = extractBounds(constellation.borders?.decRange || '', false);
  const isPolar = isPolarConstellation(constellation.id, decBounds);

  return (
    <div
      ref={dossierScrollRef}
      className="fixed inset-0 z-50 w-full h-full bg-[#030714] flex flex-col overflow-hidden pointer-events-auto animate-in fade-in duration-200"
      onClick={(e) => {
        e.stopPropagation();
        setActiveStarLabelId(null);
      }}
    >
      {/* Header Bar matching Encyclopedia mode */}
      <div className="flex flex-row items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-cyan-500/20 bg-[#060b20] shrink-0 gap-2 sm:gap-3">
        {/* Left: Constellation Identifier & Information */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar max-w-full">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base md:text-xl font-black text-white tracking-tight shrink-0">
              {constellation.name}
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 shrink-0">
              {constellation.abbreviation}
            </span>
            <RunningText
              as="span"
              text={`"${constellation.englishName}" • ${constellation.genitive}`}
              className="text-xs text-slate-400 italic hidden md:inline"
            />
            {constellation.isZodiac && (
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded font-mono font-bold bg-amber-950/90 text-amber-300 border border-amber-500/40 shrink-0">
                {constellation.zodiacSymbol} Zodiac Sign
              </span>
            )}
          </div>
        </div>

        {/* Right: Close Button with Esc shortcut */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 p-2 md:px-3 md:py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold transition-all cursor-pointer active:scale-95 shrink-0"
            title="Close Constellation Dossier (Esc)"
            aria-label="Close Constellation Dossier"
          >
            <X className="w-4 h-4" />
            <span className="hidden md:inline">Close</span>
            <span className="text-[10px] font-mono text-slate-400 hidden md:inline">[Esc]</span>
          </button>
        </div>
      </div>

      {/* Content Body: Continuous vertical page scroll on mobile portrait, fixed split-screen on landscape & lg */}
      <div className="flex-1 min-h-0 flex flex-col landscape:flex-row lg:flex-row overflow-y-auto landscape:overflow-hidden lg:overflow-hidden bg-transparent">
        {/* Left Column: Astrometric Map Container without scrolling in landscape */}
        <div className="w-full shrink-0 landscape:w-1/2 lg:w-7/12 landscape:h-full lg:h-full landscape:overflow-hidden lg:overflow-y-auto scrollbar-thin p-2.5 sm:p-4 md:p-5 flex flex-col justify-center">
          {/* Constellation Visualizer Banner - 2D Astrometric Map (Expanded Viewport) */}
          <div
            className="w-full aspect-square max-h-[460px] xs:max-h-[500px] sm:max-h-[580px] md:max-h-[640px] lg:max-h-[720px] landscape:max-h-[calc(100vh-80px)] bg-[#020512] rounded-2xl border border-cyan-500/30 flex items-center justify-center relative overflow-hidden shrink-0 shadow-inner"
            onClick={() => setActiveStarLabelId(null)}
          >
                {/* Astrometric Metadata Header Badge */}
                <div className="absolute top-2 left-2 sm:top-2.5 sm:left-3 z-10 text-[9px] sm:text-[10px] font-mono text-slate-400 bg-slate-950/90 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border border-slate-800 pointer-events-none flex items-center gap-1.5 sm:gap-2 shadow">
                  <span className="text-cyan-300 font-semibold uppercase">{constellation.name}</span>
                  {isPolar && (
                    <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[8px] sm:text-[9px] font-bold">
                      Polar Centered
                    </span>
                  )}
                  <span className="text-slate-500">•</span>
                  <span>RA {constellation.borders.raRange.split('|')[0].trim()}</span>
                  <span className="text-slate-500 hidden sm:inline">•</span>
                  <span className="hidden sm:inline">Dec {constellation.borders.decRange.split('|')[0].trim()}</span>
                </div>

                <div className="flex items-center justify-center w-full h-full p-1 sm:p-2">
                  <ConstellationMap
                    constellation={constellation}
                    celestialData={celestialData}
                    mode="dossier"
                    size={600}
                    className="w-full h-full"
                    options={skyMapOptions}
                    onSelectNeighbor={onSelectNeighbor}
                    onSelectFigureStar={onSelectStar}
                    activeStarLabelId={activeStarLabelId}
                    setActiveStarLabelId={setActiveStarLabelId}
                    hoveredStarId={hoveredStarId}
                    setHoveredStarId={setHoveredStarId}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Data/Telemetry panel */}
            <div className="w-full shrink-0 landscape:w-1/2 lg:w-5/12 landscape:h-full lg:h-full landscape:overflow-y-auto lg:overflow-y-auto pb-safe p-2.5 sm:p-4 md:p-6 scrollbar-thin flex flex-col gap-2.5 sm:gap-4 md:gap-5">
              {/* Astrometric Map Viewport Controls Toolbar (Top of Right Panel) */}
              <div className="flex items-center justify-between gap-1.5 sm:gap-2 p-1.5 sm:p-2.5 rounded-xl bg-[#04091c] border border-cyan-500/25 text-[11px] font-mono shadow-sm">
                <div className="flex items-center gap-1.5 px-1.5 sm:px-2 text-cyan-400 font-bold shrink-0">
                  <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Astrometric Map</span>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full py-0.5">
                  <MapToolbarToggle
                    label="Grid"
                    icon={<Grid className="w-3 h-3" />}
                    active={skyMapOptions.showGraticule}
                    onClick={() => setSkyMapOptions((prev) => ({ ...prev, showGraticule: !prev.showGraticule }))}
                    title="Toggle Coordinate Graticule (RA/Dec Grid)"
                  />

                  <MapToolbarToggle
                    label="Borders"
                    icon={<Layers className="w-3 h-3" />}
                    active={skyMapOptions.showBoundaries}
                    onClick={() => setSkyMapOptions((prev) => ({ ...prev, showBoundaries: !prev.showBoundaries }))}
                    title="Toggle IAU Delporte Stepped Orthogonal Boundaries"
                  />

                  <MapToolbarToggle
                    label="Labels"
                    icon={<Tag className="w-3 h-3" />}
                    active={skyMapOptions.showStarLabels}
                    onClick={() => {
                      setActiveStarLabelId(null);
                      setSkyMapOptions((prev) => ({ ...prev, showStarLabels: !prev.showStarLabels }));
                    }}
                    title="Toggle Star Bayer Designations and Proper Names"
                  />

                  <MapToolbarToggle
                    label="Ecliptic"
                    icon={<Orbit className="w-3 h-3" />}
                    active={skyMapOptions.showEquatorEcliptic}
                    onClick={() => setSkyMapOptions((prev) => ({ ...prev, showEquatorEcliptic: !prev.showEquatorEcliptic }))}
                    title="Toggle 0° Celestial Equator and Solar Ecliptic Lines"
                    activeColorClass="bg-cyan-950/90 text-amber-300 border-amber-500/50"
                  />

                  <MapToolbarToggle
                    label="DSO"
                    icon={<Sparkles className="w-3 h-3" />}
                    active={skyMapOptions.showDeepSky}
                    onClick={() => setSkyMapOptions((prev) => ({ ...prev, showDeepSky: !prev.showDeepSky }))}
                    title="Toggle Iconic Messier / NGC Deep Sky Objects (Max 6)"
                    activeColorClass="bg-rose-950/80 text-rose-300 border-rose-500/50"
                  />

                  <MapToolbarToggle
                    label="Neighbors"
                    icon={<Navigation className="w-3 h-3" />}
                    active={skyMapOptions.showNeighborGuides}
                    onClick={() => setSkyMapOptions((prev) => ({ ...prev, showNeighborGuides: !prev.showNeighborGuides }))}
                    title="Toggle Adjacent Constellation Perimeter Guides"
                  />
                </div>
              </div>

              {/* DSO Category Color Legends Indicator when DSO Toggle is ON */}
              {skyMapOptions.showDeepSky && (
                <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-xl bg-[#04091c] border border-cyan-500/25 text-[10px] sm:text-[11px] font-mono shadow-sm">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Sparkles className="w-3 h-3 text-rose-400" />
                    <span className="font-bold text-slate-300 uppercase tracking-wider text-[9px] sm:text-[10px]">DSO Legend:</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="flex items-center gap-1 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                      <span className="text-rose-300 font-medium">Nebulae</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                      <span className="text-purple-300 font-medium">Galaxies</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                      <span className="text-emerald-300 font-medium">Star Clusters</span>
                    </span>
                  </div>
                  <span className="text-slate-500 text-[9px] hidden md:inline">Max 6 notable</span>
                </div>
              )}

              {/* Celestial Resemblance & Shape Callout (Compact font and padding on mobile) */}
              <div className="p-2.5 sm:p-4 rounded-xl bg-gradient-to-r from-cyan-950/50 via-[#061430] to-blue-950/40 border border-cyan-500/35 flex items-start gap-2.5 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-cyan-900/60 border border-cyan-400/30 text-cyan-300 shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[9.5px] sm:text-[11px] font-mono uppercase text-cyan-400 font-bold tracking-wider mb-0.5 sm:mb-1">
                    <span>Celestial Resemblance & Shape</span>
                  </div>
                  <p className="text-[11px] sm:text-xs md:text-sm text-slate-200 leading-snug sm:leading-relaxed font-normal">
                    {constellation.resemblance}
                  </p>
                </div>
              </div>

              {/* Sky Borders Section */}
              <div className="p-4 rounded-xl bg-[#04091c] border border-cyan-500/25 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-cyan-900/40">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs sm:text-sm font-bold text-white">
                      Astronomical Boundaries
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-500/30">
                    Delporte Boundary
                  </span>
                </div>

                {/* RA and Dec Ranges */}
                {constellation.borders.sectors ? (
                  <div className="flex flex-col gap-2 text-xs font-mono">
                    {constellation.borders.sectors.map((sec) => (
                      <div
                        key={sec.shortCode}
                        className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-cyan-300 font-bold text-[11px]">
                            {sec.name} ({sec.shortCode})
                          </span>
                          <span className="text-slate-400 text-[10px]">{sec.englishName}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] mt-0.5 text-slate-300">
                          <div>
                            <span className="text-slate-500 block">RA:</span>
                            <span className="font-bold text-slate-200">{sec.raRange}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Dec:</span>
                            <span className="font-bold text-slate-200">{sec.decRange}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase">Right Ascension (RA) Range</span>
                      <span className="text-cyan-300 font-bold">{constellation.borders.raRange}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase">Declination (Dec) Range</span>
                      <span className="text-cyan-300 font-bold">{constellation.borders.decRange}</span>
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-300 leading-relaxed">
                  {constellation.borders.boundarySummary}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Hemisphere</span>
                  <span className="text-white font-bold">{constellation.hemisphere}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Area & Rank</span>
                  <span className="text-white font-bold">
                    {constellation.areaSqDeg} sq° (#{constellation.areaRank})
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Constellation Family</span>
                  <span className="text-white font-bold">{constellation.family}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Best Viewing Month</span>
                  <span className="text-cyan-300 font-bold">{constellation.bestViewingMonth}</span>
                </div>
              </div>

              {/* Principal Star Action */}
              {starMap.get(constellation.principalStarId) && (() => {
                const pStar = starMap.get(constellation.principalStarId)!;
                return (
                  <div className="p-3.5 rounded-xl bg-[#04091c] border border-cyan-500/20 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-xs">
                      <StarDot2D star={pStar} sizeClassName="w-3.5 h-3.5" />
                      <div>
                        <span className="text-slate-400 block text-[10px]">Principal Star:</span>
                        <span className="text-white font-bold text-sm">
                          {pStar.name}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectStar(pStar);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-transform active:scale-95 shrink-0"
                    >
                      <StarDot2D star={pStar} sizeClassName="w-2.5 h-2.5" />
                      <span>Inspect Star in 3D</span>
                    </button>
                  </div>
                );
              })()}

              {/* Cataloged Constellation Stars List with Dynamic Coordinates & Locations */}
              {(() => {
                const seenIds = new Set<string>();
                const cCatalogStars = STARS_CATALOG.filter((s) => {
                  if (seenIds.has(s.id)) return false;
                  const belongs = isStarBelongingToConstellation(s, constellation, celestialData.bounds);
                  if (belongs) {
                    seenIds.add(s.id);
                    return true;
                  }
                  return false;
                }).sort((a, b) => {
                  // Principal anchor star pinned at the top
                  if (a.id === constellation.principalStarId) return -1;
                  if (b.id === constellation.principalStarId) return 1;
                  // Brightest / most prominent stars first
                  return (a.apparentMagnitude ?? 99) - (b.apparentMagnitude ?? 99);
                });

                if (cCatalogStars.length === 0) return null;

                return (
                  <div className="p-4 rounded-xl bg-[#04091c] border border-cyan-500/30 flex flex-col gap-3 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-cyan-400 shrink-0" />
                        <h4 className="text-xs sm:text-sm font-mono uppercase text-slate-200 font-bold tracking-wider">
                          Catalog Stars in {constellation.name} ({cCatalogStars.length})
                        </h4>
                      </div>
                      <span className="text-[11px] text-cyan-400 font-mono">
                        Coordinates & Astrometric Locations Mapped • Click to Inspect in 3D
                      </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto pr-1.5 space-y-2 divide-y divide-slate-800/60">
                      {cCatalogStars.map((st) => {
                        const isPrincipal = st.id === constellation.principalStarId;
                        const cleanName = st.name.replace(/\s*\([^)]+\)/g, '').trim();
                        const locationDesc = getDynamicStarLocationDescription(st, constellation);

                        return (
                          <div
                            key={st.id}
                            className={`pt-2 first:pt-0 p-2.5 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              isPrincipal
                                ? 'bg-cyan-950/40 border-cyan-500/40 hover:border-cyan-400'
                                : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-cyan-500/30'
                            }`}
                          >
                            <div className="flex flex-col gap-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <StarDot2D star={st} sizeClassName="w-2.5 h-2.5" />
                                <RunningText
                                  as="span"
                                  text={cleanName}
                                  className="font-bold text-xs sm:text-sm text-white"
                                />
                                {st.bayerDesignation && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                    {st.bayerDesignation}
                                  </span>
                                )}
                                {isPrincipal && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 font-bold border border-amber-600/60">
                                    Principal Star
                                  </span>
                                )}
                              </div>

                              {/* Known Celestial Location */}
                              <div className="flex items-start sm:items-center gap-1.5 text-[11px] font-mono text-cyan-300/90 leading-tight">
                                <Compass className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
                                <span className="break-words">{locationDesc}</span>
                              </div>

                              {/* Astro Specs Badges */}
                              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-400">
                                <span className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300">
                                  {st.spectralType}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300">
                                  mag {st.apparentMagnitude}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300">
                                  {st.distanceLy.toLocaleString()} ly
                                </span>
                                {st.stellarStage && (
                                  <span className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300 hidden md:inline">
                                    {st.stellarStage}
                                  </span>
                                )}
                                {st.exoplanetSystem?.hasExoplanets && (
                                  <span className="px-1.5 py-0.5 rounded bg-indigo-950/70 border border-indigo-700/50 text-indigo-300 font-semibold">
                                    🪐 {st.exoplanetSystem.confirmedCount ? `${st.exoplanetSystem.confirmedCount} Planets` : 'Exoplanet Host'}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                onClose();
                                onSelectStar(st);
                              }}
                              className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/50 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0 shadow"
                              title={`Open 3D Star Dossier for ${cleanName}`}
                            >
                              <StarDot2D star={st} sizeClassName="w-2.5 h-2.5" />
                              <span>Inspect in 3D</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Bottom Section: Description & Mythology */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-[#04091c] border border-cyan-500/20">
                  <strong className="text-cyan-300 block mb-1.5 font-bold flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span>Astronomical Overview:</span>
                  </strong>
                  <p className="text-slate-300 leading-relaxed">{constellation.description}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#04091c] border border-cyan-500/20">
                  <strong className="text-amber-300 block mb-1.5 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Mythology & Classical Lore:</span>
                  </strong>
                  <p className="text-slate-300 leading-relaxed">{constellation.mythology}</p>
                </div>
              </div>
            </div>
        </div>
      </div>
  );
};
