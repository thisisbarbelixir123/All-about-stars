import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StarData, PresetComparison } from '../types';
import { STARS_CATALOG, PRESET_COMPARISONS } from '../data/stars';
import { formatPhysicalDiameter } from '../utils/formatters';
import { HeroStar3D, ActiveStarInfo } from './HeroStar3D';
import { AmbientSoundToggle } from './AmbientSoundToggle';
import { FullscreenToggle } from './FullscreenToggle';
import { PWAInstallButton } from './PWAInstallButton';
import { RunningText } from './RunningText';
import {
  Play,
  RotateCcw,
} from 'lucide-react';

interface HomeScreenProps {
  onNavigateTab: (tab: '3d-stage' | 'catalog' | 'hr-diagram' | 'guide' | 'about' | 'constellations') => void;
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
      {/* OBSERVATORY HERO STAGE */}
      <section
        ref={heroBoundsRef}
        className={`relative rounded-none md:rounded-3xl overflow-hidden border-y md:border border-white/10 bg-[#02040a] ${
          isMobile && !isTablet ? 'p-3 py-2.5 min-h-0 h-auto' : 'p-4 sm:p-10 lg:p-12 min-h-[320px] sm:min-h-[460px] lg:min-h-[500px]'
        } shadow-[0_15px_60px_rgba(0,0,0,0.95)] flex flex-col items-center justify-center text-center w-full flex-1 my-auto`}
      >
        {/* TOP CONTROLS: 3D MODE BUTTON, PWA INSTALL & AMBIENT SOUND */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30">
          <button
            id="btn-homescreen-enter-3d"
            onClick={() => {
              if (onClose) onClose();
              else onNavigateTab('3d-stage');
            }}
            title="Enter 3D Stage Comparator"
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl observatory-control text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-md group active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-sky-400 group-hover:fill-white transition-colors" />
            <span className="text-[10px] sm:text-[11px] font-bold">3D Mode</span>
          </button>
        </div>

        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-1.5 sm:gap-2">
          <PWAInstallButton />
          <AmbientSoundToggle id="btn-homescreen-audio-toggle" />
          <FullscreenToggle id="btn-homescreen-fullscreen" />
          {!isMobile && (
            <button
              type="button"
              id="btn-reroll-hero-stars"
              onClick={handleShuffleHeroStars}
              title="Randomize Hero 3D Stars & Positions"
              className="p-2 sm:px-3 sm:py-2 rounded-xl observatory-control text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-md group"
            >
              <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform" />
              <span className="text-[11px] hidden sm:inline">Shuffle 3D Stars</span>
            </button>
          )}
        </div>

        {/* 3D FLOATING STARS: ENABLED ON DESKTOP & TABLETS */}
        {!isMobile && (
          <div className={isTablet ? 'contents' : 'hidden md:contents'}>

            {/* 4 MOVEABLE, GLOWING & RESIZABLE 3D STAR MODELS FROM CATALOG */}
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

            {/* STAR ON-HOVER OVERVIEW */}
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
                  <div className="observatory-panel px-3.5 py-2.5 rounded-xl border border-white/10 flex flex-col gap-1 w-[220px] text-center">
                    <div className="flex items-center justify-center gap-1.5 border-b border-white/10 pb-1.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full aspect-square inline-block shrink-0 shadow-sm border-0"
                        style={{ backgroundColor: activeHeroStar.star.colorHex }}
                      />
                      <div className="min-w-0 flex-1 max-w-[170px]">
                        <RunningText
                          text={activeHeroStar.star.name}
                          className="text-xs font-bold text-white tracking-wide"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-sky-300 min-w-0">
                      <span>{activeHeroStar.star.spectralType}</span>
                      <span className="text-slate-300 truncate ml-1 text-right max-w-[120px]">
                        {activeHeroStar.star.stellarStage}
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-slate-300 truncate">
                      {dimensions.metricSi} • {dimensions.solarFormatted}
                    </div>

                    <div className="text-[9px] font-mono text-sky-400/90 pt-1 border-t border-white/10 flex items-center justify-between">
                      <span className="text-slate-400">Size: {activeHeroStar.sizePx}px</span>
                      <span>Drag / Resize</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* CENTERED HERO CONTENT & APP TITLE */}
        <div className={`relative z-20 flex flex-col items-center justify-center ${
          isMobile && !isTablet ? 'gap-2.5' : 'gap-3.5 sm:gap-4'
        } max-w-4xl mx-auto my-auto pointer-events-none px-3 text-center`}>
          {/* Starpedia 3D Title Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-slate-300 font-mono text-xs tracking-wider pointer-events-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            <span className="font-semibold text-white">STARPEDIA 3D</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 text-[11px]">ASTROPHYSICAL ATLAS</span>
          </div>

          {/* Headline Text: Stars of the Universe */}
          <h1 className={`${
            isMobile && !isTablet ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-6xl md:text-7xl lg:text-8xl'
          } font-bold text-white tracking-tight leading-none`}>
            Stars of the Universe
          </h1>

          <p className={`${
            isMobile && !isTablet ? 'text-[11px] leading-snug max-w-md' : 'text-xs sm:text-sm md:text-base max-w-xl leading-relaxed'
          } text-slate-300 font-normal`}>
            A physical-scale comparative atlas and interactive 3D observatory of stars across nine orders of magnitude.
          </p>

          {/* Action Button */}
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
                isMobile && !isTablet ? 'px-4 py-2 text-xs' : 'px-6 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm'
              } rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold tracking-wide transition-all shadow-[0_4px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.5)] flex items-center gap-2 cursor-pointer active:scale-95`}
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start Exploring</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
