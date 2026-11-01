import React, { useState, useMemo, useCallback } from 'react';
import { ConstellationInfo, ALL_88_CONSTELLATIONS } from '../data/constellationsData';
import { CelestialData } from '../hooks/useCelestialData';
import {
  computeMollweideGraticule,
  projectMollweideMultiPolygon,
  projectMollweidePolygon,
  projectMollweidePolyline,
  projectMollweidePoint,
  getConstellationSphericalCenter
} from '../utils/celestialMechanics';
import {
  Globe,
  Waves,
  Layers,
  Sparkles,
  Compass,
  Sun,
  Maximize2,
  Minimize2,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ConstellationSkyMapGlobeProps {
  celestialData: CelestialData;
  onSelectConstellation?: (constellation: ConstellationInfo) => void;
  selectedConstellationId?: string | null;
  className?: string;
}

const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 500;
const PADDING = 24;

export const ConstellationSkyMapGlobe: React.FC<ConstellationSkyMapGlobeProps> = ({
  celestialData,
  onSelectConstellation,
  selectedConstellationId,
  className = ''
}) => {
  // Layer Toggles
  const [showMilkyWay, setShowMilkyWay] = useState<boolean>(true);
  const [showBoundaries, setShowBoundaries] = useState<boolean>(true);
  const [showAsterisms, setShowAsterisms] = useState<boolean>(true);
  const [showStars, setShowStars] = useState<boolean>(true);
  const [showGraticule, setShowGraticule] = useState<boolean>(true);
  const [showEcliptic, setShowEcliptic] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Interaction State
  const [hoveredConstellation, setHoveredConstellation] = useState<ConstellationInfo | null>(null);
  const [cursorCoord, setCursorCoord] = useState<{ raStr: string; decStr: string } | null>(null);

  // Abbreviation lookup map for O(1) matching of Delporte boundary IDs
  const constMap = useMemo(() => {
    const map = new Map<string, ConstellationInfo>();
    for (const c of ALL_88_CONSTELLATIONS) {
      map.set(c.abbreviation.toUpperCase(), c);
    }
    return map;
  }, []);

  // 1. Compute Base Graticule (Outer Ellipse, Equator, Ecliptic, Parallels, Meridians)
  const graticule = useMemo(() => {
    return computeMollweideGraticule(VIEW_WIDTH, VIEW_HEIGHT, {
      centerMeridianDeg: 0,
      padding: PADDING,
      astronomical: true,
      parallelStepDeg: 15,
      meridianStepDeg: 30
    });
  }, []);

  // 2. Pre-project Milky Way multi-tier contours
  const milkyWayPaths = useMemo(() => {
    if (!celestialData.milkyWay || celestialData.milkyWay.length === 0) return [];
    const projOpts = { width: VIEW_WIDTH, height: VIEW_HEIGHT, padding: PADDING, astronomical: true };
    return celestialData.milkyWay.map((feature, idx) => {
      const pathD = projectMollweideMultiPolygon(feature.geometry.coordinates, projOpts);
      return { tier: idx + 1, pathD };
    });
  }, [celestialData.milkyWay]);

  // 3. Pre-project Constellation Delporte Boundaries
  const boundaryPaths = useMemo(() => {
    if (!celestialData.bounds || celestialData.bounds.length === 0) return [];
    const projOpts = { width: VIEW_WIDTH, height: VIEW_HEIGHT, padding: PADDING, astronomical: true };
    return celestialData.bounds.map((feat) => {
      const abbr = String(feat.id || '').toUpperCase();
      const constInfo = constMap.get(abbr) || (abbr.startsWith('SER') ? constMap.get('SER') : undefined);
      const pathD = projectMollweidePolygon(feat.geometry.coordinates, projOpts);
      return {
        id: feat.id,
        constInfo,
        pathD
      };
    });
  }, [celestialData.bounds, constMap]);

  // 4. Pre-project Constellation Stick-Figure Lines
  const asterismPaths = useMemo(() => {
    if (!celestialData.lines || celestialData.lines.length === 0) return [];
    const projOpts = { width: VIEW_WIDTH, height: VIEW_HEIGHT, padding: PADDING, astronomical: true };
    return celestialData.lines.map((feat, idx) => {
      const paths: string[] = [];
      for (const line of feat.geometry.coordinates) {
        const d = projectMollweidePolyline(line, projOpts);
        if (d) paths.push(d);
      }
      return {
        id: feat.id || `line-${idx}`,
        pathD: paths.join(' ')
      };
    });
  }, [celestialData.lines]);

  // 5. Project Prominent Stars
  const prominentStars = useMemo(() => {
    const stars: Array<{ id: string; name: string; x: number; y: number; r: number; colorHex: string; isPrincipal: boolean }> = [];
    const projOpts = { width: VIEW_WIDTH, height: VIEW_HEIGHT, padding: PADDING, astronomical: true, isRaHours: false };

    for (const c of ALL_88_CONSTELLATIONS) {
      const { cLon, cLat } = getConstellationSphericalCenter(c, celestialData.bounds);
      const pt = projectMollweidePoint(cLon, cLat, projOpts);
      if (pt.isInside) {
        const isZodiac = c.isZodiac;
        stars.push({
          id: `star-${c.id}`,
          name: c.principalStarName,
          x: pt.x,
          y: pt.y,
          r: isZodiac ? 2.5 : 1.8,
          colorHex: isZodiac ? '#fef08a' : '#bae6fd',
          isPrincipal: true
        });
      }
    }
    return stars;
  }, [celestialData.bounds]);

  // 6. Current Astronomical Solar Position on the Ecliptic
  const sunPosition = useMemo(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    // Solar ecliptic longitude from March Equinox (~day 79)
    const solarLonDeg = (((dayOfYear - 79) / 365.2422) * 360 + 360) % 360;
    const epsRad = 23.43928 * (Math.PI / 180);
    const lRad = solarLonDeg * (Math.PI / 180);

    const sinDec = Math.sin(epsRad) * Math.sin(lRad);
    const decDeg = Math.asin(sinDec) * (180 / Math.PI);
    const raRad = Math.atan2(Math.sin(lRad) * Math.cos(epsRad), Math.cos(lRad));
    const raDeg = ((raRad * (180 / Math.PI)) % 360 + 360) % 360;

    const pt = projectMollweidePoint(raDeg, decDeg, {
      width: VIEW_WIDTH,
      height: VIEW_HEIGHT,
      padding: PADDING,
      astronomical: true,
      isRaHours: false
    });

    return {
      x: pt.x,
      y: pt.y,
      raHours: (raDeg / 15).toFixed(1),
      decDeg: decDeg.toFixed(1)
    };
  }, []);

  // Handler for mouse interaction with boundary paths
  const handleBoundaryHover = useCallback((constInfo?: ConstellationInfo) => {
    setHoveredConstellation(constInfo || null);
  }, []);

  const handleBoundaryClick = useCallback((constInfo?: ConstellationInfo) => {
    if (constInfo && onSelectConstellation) {
      onSelectConstellation(constInfo);
    }
  }, [onSelectConstellation]);

  const activeConstellation = hoveredConstellation || (
    selectedConstellationId
      ? ALL_88_CONSTELLATIONS.find((c) => c.id === selectedConstellationId) || null
      : null
  );

  return (
    <div className={`relative flex flex-col rounded-2xl bg-[#030718] border border-cyan-500/30 shadow-2xl overflow-hidden backdrop-blur-md transition-all ${className}`}>
      {/* Decorative ambient glowing backdrops */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Interactive Information Bar */}
      <div className="relative z-10 px-3.5 sm:px-5 py-3 border-b border-cyan-500/20 bg-[#020512]/80 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Viewport Badge and Active Hovered Constellation Readout */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shrink-0">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-white tracking-wide truncate">
                {activeConstellation ? activeConstellation.name : 'Whole-Sky Celestial Globe'}
              </span>
              {activeConstellation ? (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 shrink-0">
                  {activeConstellation.abbreviation}
                </span>
              ) : (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                  Mollweide Projection
                </span>
              )}
              {activeConstellation?.isZodiac && (
                <span className="text-[8.5px] font-mono px-1.5 py-0.2 rounded bg-amber-950/90 text-amber-300 border border-amber-500/40 font-bold shrink-0">
                  Zodiac {activeConstellation.zodiacSymbol}
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 truncate">
              {activeConstellation
                ? `"${activeConstellation.resemblance}" • ${activeConstellation.hemisphere} Sky • Rank #${activeConstellation.areaRank} (${activeConstellation.areaSqDeg} sq°)`
                : 'Equal-area projection of all 88 IAU constellations, the Milky Way galactic disc, and celestial coordinates'}
            </p>
          </div>
        </div>

        {/* Right: Layer Toggles & Collapse Button */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 flex-wrap">
          {/* Milky Way Toggle */}
          <button
            onClick={() => setShowMilkyWay(!showMilkyWay)}
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              showMilkyWay
                ? 'bg-blue-950/90 text-blue-300 border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
            }`}
            title="Toggle Milky Way Galactic Plane & Core Contours"
          >
            <Waves className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Milky Way</span>
          </button>

          {/* Boundaries Toggle */}
          <button
            onClick={() => setShowBoundaries(!showBoundaries)}
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              showBoundaries
                ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
            }`}
            title="Toggle Delporte 1930 IAU Constellation Boundaries"
          >
            <Layers className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Borders</span>
          </button>

          {/* Asterisms Toggle */}
          <button
            onClick={() => setShowAsterisms(!showAsterisms)}
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              showAsterisms
                ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
            }`}
            title="Toggle Constellation Stick-Figure Asterisms"
          >
            <Sparkles className="w-3 h-3 text-cyan-300" />
            <span className="hidden sm:inline">Lines</span>
          </button>

          {/* Coordinate Graticule Toggle */}
          <button
            onClick={() => setShowGraticule(!showGraticule)}
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              showGraticule
                ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
            }`}
            title="Toggle RA/Dec Coordinate Graticule"
          >
            <Compass className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Grid</span>
          </button>

          {/* Ecliptic Toggle */}
          <button
            onClick={() => setShowEcliptic(!showEcliptic)}
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              showEcliptic
                ? 'bg-amber-950/90 text-amber-300 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
            }`}
            title="Toggle Ecliptic Solar Path and Today's Sun Position"
          >
            <Sun className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Ecliptic</span>
          </button>

          {/* Collapse/Expand Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 sm:px-2 sm:py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[10px] sm:text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sky Map' : 'Collapse Sky Map'}
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Expand Map</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Sky Map Interactive Viewport */}
      {!isCollapsed && (
        <div className="relative w-full aspect-[2/1] min-h-[220px] max-h-[520px] bg-[#010410] flex items-center justify-center p-2 sm:p-4 select-none">
          <svg
            className="w-full h-full max-h-full"
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Outer Boundary Clipping Ellipse */}
              <clipPath id="mollweide-globe-clip">
                <path d={graticule.outlinePath} />
              </clipPath>

              {/* Glowing filters for hovered active boundary */}
              <filter id="mollweide-glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="mollweide-glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Deep Space Background Radial Gradient */}
              <radialGradient id="space-disc-grad" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#040d29" />
                <stop offset="65%" stopColor="#020718" />
                <stop offset="100%" stopColor="#01030d" />
              </radialGradient>
            </defs>

            {/* Deep Space Filled Disc */}
            <path
              d={graticule.outlinePath}
              fill="url(#space-disc-grad)"
              className="transition-colors"
            />

            {/* Everything inside the Mollweide ellipse is clipped to prevent seam overflows */}
            <g clipPath="url(#mollweide-globe-clip)">
              {/* 1. Milky Way Galactic Plane & Core Contours */}
              {showMilkyWay && (
                <g className="milky-way-layer pointer-events-none transition-opacity duration-300">
                  {milkyWayPaths.map((mw) => {
                    // Multi-tiered opacity and luminous hues:
                    let fill = 'rgba(56, 189, 248, 0.04)';
                    if (mw.tier === 2) fill = 'rgba(56, 189, 248, 0.08)';
                    if (mw.tier === 3) fill = 'rgba(96, 165, 250, 0.12)';
                    if (mw.tier === 4) fill = 'rgba(147, 197, 253, 0.17)';
                    if (mw.tier === 5) fill = 'rgba(240, 246, 255, 0.28)'; // Core nucleus

                    return (
                      <path
                        key={`mw-tier-${mw.tier}`}
                        d={mw.pathD}
                        fill={fill}
                        stroke="none"
                        fillRule="evenodd"
                      />
                    );
                  })}
                </g>
              )}

              {/* 2. Coordinate Graticule (Parallels, Meridians, Equator) */}
              {showGraticule && (
                <g className="graticule-layer pointer-events-none">
                  {/* Parallels of Declination */}
                  {graticule.parallels.map((p) => (
                    <path
                      key={p.id}
                      d={p.path}
                      fill="none"
                      stroke="rgba(6, 182, 212, 0.12)"
                      strokeWidth="0.8"
                      strokeDasharray="2 4"
                    />
                  ))}

                  {/* Meridians of Right Ascension */}
                  {graticule.meridians.map((m) => (
                    <path
                      key={m.id}
                      d={m.path}
                      fill="none"
                      stroke="rgba(6, 182, 212, 0.12)"
                      strokeWidth="0.8"
                      strokeDasharray="2 4"
                    />
                  ))}

                  {/* Celestial Equator (Dec = 0°) */}
                  <path
                    d={graticule.equatorPath}
                    fill="none"
                    stroke="rgba(56, 189, 248, 0.35)"
                    strokeWidth="1.2"
                  />
                </g>
              )}

              {/* 3. Solar Ecliptic Path */}
              {showEcliptic && (
                <g className="ecliptic-layer pointer-events-none">
                  <path
                    d={graticule.eclipticPath}
                    fill="none"
                    stroke="rgba(245, 158, 11, 0.65)"
                    strokeWidth="1.4"
                    strokeDasharray="4 3"
                  />
                </g>
              )}

              {/* 4. Delporte 1930 Constellation Boundaries (89 Sectors) */}
              {showBoundaries && (
                <g className="constellation-boundaries-layer">
                  {boundaryPaths.map((bp) => {
                    const isHovered = activeConstellation?.id === bp.constInfo?.id;
                    const isZodiac = bp.constInfo?.isZodiac;

                    return (
                      <path
                        key={`boundary-${bp.id}`}
                        d={bp.pathD}
                        fill={
                          isHovered
                            ? isZodiac
                              ? 'rgba(245, 158, 11, 0.20)'
                              : 'rgba(6, 182, 212, 0.20)'
                            : 'transparent'
                        }
                        stroke={
                          isHovered
                            ? isZodiac
                              ? '#f59e0b'
                              : '#22d3ee'
                            : 'rgba(6, 182, 212, 0.22)'
                        }
                        strokeWidth={isHovered ? 1.8 : 0.8}
                        filter={isHovered ? (isZodiac ? 'url(#mollweide-glow-amber)' : 'url(#mollweide-glow-cyan)') : undefined}
                        className="transition-colors cursor-pointer"
                        onMouseEnter={() => handleBoundaryHover(bp.constInfo)}
                        onMouseLeave={() => handleBoundaryHover(undefined)}
                        onClick={() => handleBoundaryClick(bp.constInfo)}
                      >
                        <title>{bp.constInfo ? `${bp.constInfo.name} (${bp.constInfo.englishName}) - Click to inspect dossier` : bp.id}</title>
                      </path>
                    );
                  })}
                </g>
              )}

              {/* 5. Constellation Stick-Figure Lines */}
              {showAsterisms && (
                <g className="asterisms-layer pointer-events-none">
                  {asterismPaths.map((ap) => (
                    <path
                      key={ap.id}
                      d={ap.pathD}
                      fill="none"
                      stroke="rgba(186, 230, 253, 0.65)"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}
                </g>
              )}

              {/* 6. Prominent Star Field */}
              {showStars && (
                <g className="stars-layer pointer-events-none">
                  {prominentStars.map((s) => (
                    <g key={s.id}>
                      {/* Star glow */}
                      <circle
                        cx={s.x}
                        cy={s.y}
                        r={s.r * 2}
                        fill={s.colorHex}
                        opacity="0.25"
                      />
                      {/* Star core */}
                      <circle
                        cx={s.x}
                        cy={s.y}
                        r={s.r}
                        fill={s.colorHex}
                        stroke="#ffffff"
                        strokeWidth="0.4"
                      />
                    </g>
                  ))}
                </g>
              )}

              {/* 7. Today's Sun Position on the Ecliptic */}
              {showEcliptic && (
                <g className="sun-marker-layer pointer-events-none">
                  {/* Sun halo ripple */}
                  <circle
                    cx={sunPosition.x}
                    cy={sunPosition.y}
                    r="8"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="0.8"
                    opacity="0.6"
                    className="animate-ping"
                  />
                  <circle
                    cx={sunPosition.x}
                    cy={sunPosition.y}
                    r="5"
                    fill="rgba(245, 158, 11, 0.35)"
                  />
                  {/* Sun core */}
                  <circle
                    cx={sunPosition.x}
                    cy={sunPosition.y}
                    r="3.2"
                    fill="#fbbf24"
                    stroke="#fffbeb"
                    strokeWidth="0.8"
                  />
                </g>
              )}
            </g>

            {/* Outer Ellipse Perimeter Border */}
            <path
              d={graticule.outlinePath}
              fill="none"
              stroke="rgba(6, 182, 212, 0.55)"
              strokeWidth="1.6"
              className="pointer-events-none"
            />

            {/* Meridian & Parallel Labels at Boundaries */}
            <g className="graticule-labels pointer-events-none text-[8px] font-mono fill-cyan-400/80">
              <text x={VIEW_WIDTH / 2} y={PADDING - 6} textAnchor="middle">
                +90° NCP
              </text>
              <text x={VIEW_WIDTH / 2} y={VIEW_HEIGHT - PADDING + 14} textAnchor="middle">
                -90° SCP
              </text>
              <text x={PADDING - 2} y={VIEW_HEIGHT / 2 + 3} textAnchor="end">
                12h E
              </text>
              <text x={VIEW_WIDTH - PADDING + 2} y={VIEW_HEIGHT / 2 + 3} textAnchor="start">
                12h W
              </text>
              <text x={VIEW_WIDTH / 2} y={VIEW_HEIGHT / 2 - 4} textAnchor="middle" fill="rgba(56, 189, 248, 0.7)">
                0h Vernal Equinox
              </text>
            </g>
          </svg>

          {/* Quick Click-to-Inspect Floating Callout when Constellation is Hovered */}
          {activeConstellation && (
            <div className="absolute bottom-3 left-4 right-4 sm:left-auto sm:right-4 z-20 pointer-events-auto">
              <div
                onClick={() => handleBoundaryClick(activeConstellation)}
                className="p-2 sm:p-2.5 rounded-xl bg-[#040c24]/95 border border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.35)] flex items-center justify-between gap-3 cursor-pointer hover:bg-[#071338] transition-all"
                title={`Click to open Constellation Dossier for ${activeConstellation.name}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-white truncate block">
                      {activeConstellation.name} ({activeConstellation.englishName})
                    </span>
                    <span className="text-[10px] text-cyan-300 font-mono truncate block">
                      Principal Alpha Star: {activeConstellation.principalStarName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] sm:text-xs font-mono shadow-sm">
                  <span>Open Dossier</span>
                  <Info className="w-3 h-3" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Status Bar */}
      <div className="px-3.5 sm:px-5 py-2 bg-[#020512] border-t border-cyan-500/15 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-2 sm:gap-4 truncate">
          <span>
            <strong className="text-cyan-400 font-bold">88</strong> IAU Sectors
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">
            Sun Transit Today: <strong className="text-amber-300 font-bold">RA {sunPosition.raHours}h, Dec {sunPosition.decDeg}°</strong>
          </span>
        </div>
        <div className="text-slate-500">
          Click any constellation boundary on the globe to open its dossier
        </div>
      </div>
    </div>
  );
};
