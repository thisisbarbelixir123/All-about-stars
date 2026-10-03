import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StarData, PresetComparison } from '../types';
import { STARS_CATALOG, PRESET_COMPARISONS } from '../data/stars';
import { formatPhysicalDiameter } from '../utils/formatters';
import { HeroStar3D, ActiveStarInfo } from './HeroStar3D';
import {
  ArrowRight,
  Play,
  RotateCcw,
} from 'lucide-react';

interface HomeScreenProps {
  onNavigateTab: (tab: '3d-stage' | 'catalog' | 'hr-diagram' | 'guide' | 'about') => void;
  onSelectPreset?: (presetId: string) => void;
  onInspectStar: (star: StarData) => void;
  onAddStarToCompare: (star: StarData) => void;
  selectedStars?: StarData[];
  presets?: PresetComparison[];
  onOpenCreatePreset?: () => void;
  onDeletePreset?: (presetId: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  onInspectStar,
  onAddStarToCompare,
  isMobile = false,
  onClose,
}) => {
  const heroBoundsRef = useRef<HTMLDivElement>(null);

  // Randomize initial positions across X and Y axes
  const getRandomInitialPositions = () => [
    { xPercent: Math.round(12 + Math.random() * 18), yPercent: Math.round(18 + Math.random() * 24) }, // Upper Left
    { xPercent: Math.round(72 + Math.random() * 16), yPercent: Math.round(16 + Math.random() * 26) }, // Upper Right
    { xPercent: Math.round(14 + Math.random() * 20), yPercent: Math.round(68 + Math.random() * 22) }, // Lower Left
    { xPercent: Math.round(70 + Math.random() * 18), yPercent: Math.round(66 + Math.random() * 24) }, // Lower Right
  ];

  // Tablet detection: checks viewport width and tablet user agents (supports both portrait and landscape tablet orientations)
  const checkIsTablet = (): boolean => {
    if (typeof window === 'undefined') return false;
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isIPad = /iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroidTablet = /Android/i.test(ua) && !/Mobile/i.test(ua);
    const minDim = Math.min(window.innerWidth, window.innerHeight);
    const maxDim = Math.max(window.innerWidth, window.innerHeight);
    const isTabletDimensions = minDim >= 600 && minDim <= 1000 && maxDim <= 1366;
    const hasCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

    return isIPad || isAndroidTablet || (hasCoarsePointer && isTabletDimensions) || isTabletDimensions;
  };

  const [isTablet, setIsTablet] = useState<boolean>(checkIsTablet);

  // Landscape orientation detection for responsive mobile viewport sizing
  const [isLandscape, setIsLandscape] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth > window.innerHeight;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsTablet(checkIsTablet());
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Calculates randomized initial visual diameter in pixels for hero space:
  // Desktop: min 40px, max 400px
  // Tablet: capped from 30px to 300px (75% of desktop size)
  const calculateStarSizePx = (star: StarData, forTablet: boolean = checkIsTablet()): number => {
    const minLog = Math.log10(15); // ~15-20km neutron star (Crab Pulsar)
    const maxLog = Math.log10(3000000000); // ~3B km red hypergiant (Stephenson 2-18)
    const curLog = Math.log10(Math.max(15, star.diameterKm || 1000000));
    const t = Math.max(0, Math.min(1, (curLog - minLog) / (maxLog - minLog)));

    if (forTablet) {
      // Tablet scale: capped from 30px to 300px (75% of desktop size: 40px - 400px)
      const baseSize = 30 + Math.pow(t, 1.1) * 270;
      const randomJitter = (Math.random() - 0.5) * 22.5;
      return Math.round(Math.max(30, Math.min(300, baseSize + randomJitter)));
    }

    // Base physical scale mapping with randomized variation (+/- 20px) bounded between 40px and 400px
    const baseSize = 40 + Math.pow(t, 1.1) * 360;
    const randomJitter = (Math.random() - 0.5) * 30;
    return Math.round(Math.max(40, Math.min(400, baseSize + randomJitter)));
  };

  const currentMinSize = isTablet ? 30 : 40;
  const currentMaxSize = isTablet ? 300 : 400;

  // Generate 4 randomized stars from different size tiers across the catalog
  const generateRandomHeroStars = useCallback((): StarData[] => {
    const tier1 = STARS_CATALOG.filter((s) => s.diameterSolar < 0.5); // Compact / Dwarfs / Pulsars (<0.5 R_sun)
    const tier2 = STARS_CATALOG.filter((s) => s.diameterSolar >= 0.5 && s.diameterSolar < 5); // Solar / Intermediate (0.5 - 5 R_sun)
    const tier3 = STARS_CATALOG.filter((s) => s.diameterSolar >= 5 && s.diameterSolar < 100); // Giants / Massive / Contact Binaries (5 - 100 R_sun)
    const tier4 = STARS_CATALOG.filter((s) => s.diameterSolar >= 100); // Supergiants / Hypergiants (>=100 R_sun)

    const pick = (arr: StarData[], fallbackIdx: number) =>
      arr.length > 0
        ? arr[Math.floor(Math.random() * arr.length)]
        : STARS_CATALOG[fallbackIdx % STARS_CATALOG.length];

    const s1 = pick(tier1, 0);
    const s2 = pick(tier2, 1);
    const s3 = pick(tier3, 2);
    const s4 = pick(tier4, 3);

    // Shuffle position assignment so the size positions vary randomly
    return [s1, s2, s3, s4].sort(() => 0.5 - Math.random());
  }, []);

  const [heroStars, setHeroStars] = useState<StarData[]>(() => generateRandomHeroStars());
  const [starPositions, setStarPositions] = useState(() => getRandomInitialPositions());
  const [starSizes, setStarSizes] = useState<number[]>(() =>
    heroStars.map((star) => calculateStarSizePx(star, checkIsTablet()))
  );

  // Sync star sizes when switching between tablet and desktop modes
  useEffect(() => {
    const minBound = isTablet ? 30 : 40;
    const maxBound = isTablet ? 300 : 400;
    setStarSizes((prev) =>
      prev.map((s) => Math.max(minBound, Math.min(maxBound, s)))
    );
  }, [isTablet]);

  const [activeHeroStar, setActiveHeroStar] = useState<ActiveStarInfo | null>(null);

  const handleShuffleHeroStars = () => {
    const newStars = generateRandomHeroStars();
    setHeroStars(newStars);
    setStarPositions(getRandomInitialPositions());
    setStarSizes(newStars.map((star) => calculateStarSizePx(star, isTablet)));
    setActiveHeroStar(null);
  };

  const handleStarResize = (index: number, newSizePx: number) => {
    const minBound = isTablet ? 30 : 40;
    const maxBound = isTablet ? 300 : 400;
    setStarSizes((prev) => {
      const next = [...prev];
      next[index] = Math.max(minBound, Math.min(maxBound, newSizePx));
      return next;
    });
    if (activeHeroStar && heroStars[index]?.id === activeHeroStar.star.id) {
      setActiveHeroStar({
        ...activeHeroStar,
        sizePx: newSizePx,
      });
    }
  };

  // Compute position for on-hover overview card ensuring it ALWAYS stays within hero boundaries
  const getActiveOverviewPosition = (active: ActiveStarInfo) => {
    const container = heroBoundsRef.current;
    const cardWidth = 220;
    const cardHeight = 110;
    const padding = 16;

    if (!container) {
      return {
        left: `${active.position.xPercent}%`,
        top: `${Math.max(10, active.position.yPercent - 20)}%`,
        transform: 'translate(-50%, -100%)',
      };
    }

    const rect = container.getBoundingClientRect();
    const containerW = rect.width || 800;
    const containerH = rect.height || 500;

    const starX = (active.position.xPercent / 100) * containerW;
    const starY = (active.position.yPercent / 100) * containerH;
    const radius = active.sizePx / 2;

    const spaceAbove = starY - radius;
    const spaceBelow = containerH - (starY + radius);

    let topPx: number;
    if (spaceAbove >= cardHeight + padding) {
      topPx = starY - radius - cardHeight - 12;
    } else if (spaceBelow >= cardHeight + padding) {
      topPx = starY + radius + 12;
    } else {
      topPx = Math.max(padding, Math.min(containerH - cardHeight - padding, starY - cardHeight / 2));
    }

    topPx = Math.max(padding, Math.min(containerH - cardHeight - padding, topPx));

    let leftPx = starX - cardWidth / 2;
    leftPx = Math.max(padding, Math.min(containerW - cardWidth - padding, leftPx));

    return {
      left: `${leftPx}px`,
      top: `${topPx}px`,
    };
  };

  return (
    <div className="flex flex-col flex-1 w-full justify-center animate-in fade-in duration-300 rounded-none">
      {/* SEMI-TRANSPARENT HERO WINDOW (ON MOBILE) / DECORATIVE 3D STARS (ON DESKTOP & TABLETS) */}
      <section
        ref={heroBoundsRef}
        className={`relative rounded-none md:rounded-3xl overflow-hidden border-y md:border border-cyan-500/20 md:border-cyan-500/30 bg-black/35 backdrop-blur-[1px] md:bg-[#000000] md:backdrop-blur-none ${
          isMobile && !isTablet ? 'p-3 py-2.5 min-h-0 h-auto' : 'p-4 sm:p-10 lg:p-12 min-h-[320px] sm:min-h-[460px] lg:min-h-[500px]'
        } shadow-[0_15px_60px_rgba(0,0,0,0.95)] flex flex-col items-center justify-center text-center w-full flex-1 my-auto`}
      >
        {/* Deep Black Cosmic Grid Background */}
        <div 
          className="absolute inset-0 opacity-10 md:opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.25) 1px, transparent 1px), radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
            backgroundSize: '40px 40px, 80px 80px',
            backgroundPosition: '0 0, 20px 20px',
          }}
        />

        {/* Ambient Dark Glows (Desktop & Tablets only) */}
        <div className={`${isTablet ? 'block' : 'hidden md:block'} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-950/30 rounded-full blur-[120px] pointer-events-none`} />
        <div className={`${isTablet ? 'block' : 'hidden md:block'} absolute top-10 left-10 w-72 h-72 bg-blue-950/20 rounded-full blur-[100px] pointer-events-none`} />
        <div className={`${isTablet ? 'block' : 'hidden md:block'} absolute bottom-10 right-10 w-72 h-72 bg-amber-950/20 rounded-full blur-[100px] pointer-events-none`} />

        {/* 3D FLOATING STARS & SHUFFLE: ENABLED ON DESKTOP & TABLETS (NONE ON MOBILE) */}
        {!isMobile && (
          <div className={isTablet ? 'contents' : 'hidden md:contents'}>
            {/* Enter 3D Mode Button */}
            <button
              id="btn-homescreen-enter-3d"
              onClick={() => {
                if (onClose) onClose();
                else onNavigateTab('3d-stage');
              }}
              title="Enter 3D Stage Comparator"
              className="absolute top-4 left-4 z-30 px-3 py-2 rounded-xl bg-[#040816]/80 hover:bg-[#081232] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-lg group active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-cyan-400 group-hover:fill-white transition-colors" />
              <span className="text-[11px] font-bold">3D Mode</span>
            </button>

            {/* Re-roll Floating Stars Button */}
            <button
              id="btn-reroll-hero-stars"
              onClick={handleShuffleHeroStars}
              title="Randomize Hero 3D Stars & Positions"
              className="absolute top-4 right-4 z-30 p-2 sm:px-3 sm:py-2 rounded-xl bg-[#040816]/80 hover:bg-[#081232] border border-cyan-500/30 hover:border-cyan-400 text-slate-400 hover:text-cyan-300 text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-lg group"
            >
              <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform" />
              <span className="text-[11px]">Shuffle 3D Stars</span>
            </button>

            {/* 4 MOVEABLE, GLOWING & RESIZABLE 3D STAR MODELS FROM CATALOG (30PX-300PX TABLET, 40PX-400PX DESKTOP) - BACK LAYER (Z-10) */}
            {heroStars.map((star, idx) => (
              <HeroStar3D
                key={`${star.id}-${idx}`}
                star={star}
                sizePx={starSizes[idx] || calculateStarSizePx(star, isTablet)}
                minSize={currentMinSize}
                maxSize={currentMaxSize}
                initialPos={starPositions[idx] || { xPercent: 20 + idx * 20, yPercent: 30 }}
                containerBoundsRef={heroBoundsRef}
                onInspect={onInspectStar}
                onCompare={onAddStarToCompare}
                onResize={(newSize) => handleStarResize(idx, newSize)}
                onActiveChange={setActiveHeroStar}
              />
            ))}

            {/* STAR ON-HOVER OVERVIEW - FRONT LAYER (Z-40) ALONGSIDE & IN FRONT OF HERO CONTENT */}
            {activeHeroStar && (() => {
              const overviewPos = getActiveOverviewPosition(activeHeroStar);
              const dimensions = formatPhysicalDiameter(
                activeHeroStar.star.diameterKm,
                activeHeroStar.star.diameterSolar
              );

              return (
                <div
                  className="absolute z-40 pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95"
                  style={{
                    left: overviewPos.left,
                    top: overviewPos.top,
                    transform: overviewPos.transform || 'none',
                  }}
                >
                  <div className="bg-[#040816]/95 backdrop-blur-xl px-3.5 py-2.5 rounded-2xl border border-cyan-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.95)] flex flex-col gap-1 w-[220px] text-center">
                    <div className="flex items-center justify-center gap-1.5 border-b border-cyan-500/20 pb-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full aspect-square inline-block shrink-0 shadow-sm border-0"
                        style={{ backgroundColor: activeHeroStar.star.colorHex }}
                      />
                      <span className="text-xs font-bold text-white tracking-wide truncate max-w-[170px]">
                        {activeHeroStar.star.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300">
                      <span>{activeHeroStar.star.spectralType}</span>
                      <span className="text-slate-300">{activeHeroStar.star.stellarStage}</span>
                    </div>

                    <div className="text-[10px] font-mono text-slate-300">
                      {dimensions.metricSi} • {dimensions.solarFormatted}
                    </div>

                    <div className="text-[9px] font-mono text-cyan-400/90 pt-1 border-t border-cyan-500/15 flex items-center justify-between">
                      <span className="text-slate-400">Size: {activeHeroStar.sizePx}px</span>
                      <span>Drag / Resize</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* CENTERED HERO CONTENT & APP TITLE - FRONT LAYER (Z-20) */}
        <div className={`relative z-20 flex flex-col items-center justify-center ${
          isMobile && !isTablet ? 'gap-2.5' : 'gap-3.5 sm:gap-4'
        } max-w-4xl mx-auto my-auto pointer-events-none px-3 text-center`}>
          {/* Brand Container: Starpedia 3D placed in the same container next to the square logo */}
          <div className="inline-flex items-center gap-2.5 sm:gap-3.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-[#04081c]/90 border-2 border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.45)] backdrop-blur-xl pointer-events-auto">
            {/* Square Contained App Logo */}
            <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 aspect-square rounded-xl border border-cyan-400/90 p-0.5 bg-black shadow-[0_0_12px_rgba(6,182,212,0.5)] flex items-center justify-center overflow-hidden shrink-0">
              <img 
                src="/starpedia_logo.svg" 
                alt="Starpedia 3D Logo" 
                className="w-full h-full object-contain aspect-square rounded-lg" 
              />
            </div>

            <div className="flex flex-col items-start text-left leading-tight">
              <span className="font-['Orbitron',sans-serif] font-black tracking-widest text-base sm:text-lg md:text-xl text-white">
                STARPEDIA <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">3D</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-cyan-300/85">
                Stellar Edition
              </span>
            </div>
          </div>

          {/* The Bigger Headline Text: Stars of the Universe */}
          <h1 className={`${
            isMobile && !isTablet ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-6xl md:text-7xl lg:text-8xl'
          } font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-cyan-200 tracking-tight leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] font-['Orbitron',sans-serif]`}>
            Stars of the Universe
          </h1>

          <p className={`${
            isMobile && !isTablet ? 'text-[11px] leading-snug max-w-md' : 'text-xs sm:text-sm md:text-base max-w-xl leading-relaxed'
          } text-slate-200 font-mono drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]`}>
            Compare cosmic titans 1:1, discover stellar physics, and explore astronomical wonders in interactive 3D.
          </p>

          {/* Quick Action Buttons Centered */}
          <div className={`flex flex-wrap items-center justify-center gap-2.5 ${
            isMobile && !isTablet ? 'pt-1' : 'pt-2 sm:pt-3'
          } pointer-events-auto`}>
            <button
              id="btn-hero-play-stage"
              onClick={() => {
                if (onClose) onClose();
                else onNavigateTab('3d-stage');
              }}
              className={`${
                isMobile && !isTablet ? 'px-4 py-2 text-xs' : 'px-5 py-2.5 sm:px-7 sm:py-3.5 text-xs sm:text-sm'
              } rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] transition-all flex items-center gap-2 cursor-pointer active:scale-95`}
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>QUICK PLAY (3D STAGE)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
