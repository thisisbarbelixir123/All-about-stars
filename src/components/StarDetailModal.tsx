import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { StarData } from '../types';
import { formatPhysicalDiameter } from '../utils/formatters';
import { StarDossier3DStage } from './StarDossier3DStage';
import { soundEffects } from '../utils/soundEffects';
import { STARS_CATALOG } from '../data/stars';
import { getMultipleStarSystemForStar } from '../utils/multipleStarSystems';
import { getEffectiveStarCount, MULTIPLE_STAR_SYSTEMS } from '../data/multipleStarSystemsData';
import { 
  X, 
  Sparkles, 
  Thermometer, 
  Compass, 
  Globe, 
  Clock, 
  Award,
  Atom,
  Zap,
  Orbit,
  Share2,
  ExternalLink,
  Tag,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { RunningText } from './RunningText';

interface StarDetailModalProps {
  star: StarData | null;
  onClose: () => void;
  onCompareStar?: (star: StarData) => void;
  onOpenClassificationGuide?: () => void;
  onTriggerEasterEgg?: () => void;
  onSelectStar?: (star: StarData) => void;
  onOpenStellarSystemDossier?: (system: any) => void;
  initialMode?: 'compare-sun' | 'compare-earth' | 'solar-system';
}

// Computes angular diameter from Earth's sky in arcmin / mas / μas
function calculateApparentSize(diameterKm: number, distanceLy: number, isSun: boolean = false): string {
  if (isSun || distanceLy < 0.001) {
    return "31'59\" (32 arcmin / 0.53°)";
  }
  const distanceKm = distanceLy * 9.460730472e12;
  const angularDiameterRad = diameterKm / distanceKm;
  // Convert radians to milliarcseconds (mas)
  const mas = angularDiameterRad * 206264806.2;
  if (mas >= 1000) {
    return `${(mas / 1000).toFixed(3)}″ (arcsec)`;
  } else if (mas >= 0.1) {
    return `${mas.toFixed(2)} mas`;
  } else {
    return `${(mas * 1000).toFixed(1)} μas`;
  }
}

export const StarDetailModal: React.FC<StarDetailModalProps> = ({
  star,
  onClose,
  onCompareStar,
  onOpenClassificationGuide,
  onTriggerEasterEgg,
  onSelectStar,
  onOpenStellarSystemDossier,
  initialMode,
}) => {
  const [hoveredMetric, setHoveredMetric] = useState<'diameter' | 'mass' | 'temperature' | 'luminosity' | 'distance' | null>(null);

  const [showDesignationsPopover, setShowDesignationsPopover] = useState<boolean>(false);
  const [copiedDesignations, setCopiedDesignations] = useState<boolean>(false);
  const [designationsPage, setDesignationsPage] = useState<number>(1);
  const designationsRef = useRef<HTMLDivElement>(null);
  const popoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const primaryDesignation = useMemo(() => {
    if (!star) return '';
    return star.primaryDesignation || star.bayerDesignation || star.flamsteedDesignation || star.alternateNames?.[0] || star.name;
  }, [star]);

  const allDesignations = useMemo(() => {
    if (!star) return [];
    const primary = (star.primaryDesignation || star.bayerDesignation || star.flamsteedDesignation || '').trim();
    const sourceList = (star.designations && star.designations.length > 0)
      ? star.designations
      : [
          star.primaryDesignation,
          star.bayerDesignation,
          star.flamsteedDesignation,
          star.gouldDesignation,
          ...(star.alternateNames || [])
        ].filter(Boolean) as string[];

    const seen = new Set<string>();
    const result: string[] = [];

    // 1. Primary designation named first
    if (primary) {
      seen.add(primary.toLowerCase());
      result.push(primary);
    }

    // 2. Add remaining entries preserving order (proper names, then other catalog designations)
    for (const item of sourceList) {
      const trimmed = item.trim();
      const key = trimmed.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(trimmed);
      }
    }

    return result;
  }, [star]);

  const DESIGNATIONS_PER_PAGE = 10;
  const totalDesignationsPages = Math.max(1, Math.ceil(allDesignations.length / DESIGNATIONS_PER_PAGE));
  const currentPageDesignations = useMemo(() => {
    const start = (designationsPage - 1) * DESIGNATIONS_PER_PAGE;
    return allDesignations.slice(start, start + DESIGNATIONS_PER_PAGE);
  }, [allDesignations, designationsPage]);

  const cleanStarName = useMemo(() => {
    if (!star) return '';
    return star.name.replace(/\s*\([^)]*\)/g, '').trim();
  }, [star]);

  // Click outside listener for the designations popover
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (designationsRef.current && !designationsRef.current.contains(e.target as Node)) {
        setShowDesignationsPopover(false);
      }
    };
    if (showDesignationsPopover) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showDesignationsPopover]);

  // Reset designations popover state when star changes
  useEffect(() => {
    setShowDesignationsPopover(false);
    setCopiedDesignations(false);
    setDesignationsPage(1);
  }, [star?.id]);

  const knownMultipleSystem = useMemo(() => (star ? getMultipleStarSystemForStar(star.id) : undefined), [star]);

  const [starClicks, setStarClicks] = useState<number>(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Play open sound effect when dossier opens
  useEffect(() => {
    soundEffects.play('openModal');
  }, []);

  // Reset clicks whenever modal star changes
  useEffect(() => {
    setStarClicks(0);
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
  }, [star?.id]);

  // Only these 8 designated stars trigger the merge game when triple tapped on their dossier:
  // 1. Proxima Centauri
  // 2. Sirius A (The Dog Star)
  // 3. Spica
  // 4. Arcturus
  // 5. Gacrux
  // 6. Eta Carinae
  // 7. Rho Cassiopeiae
  // 8. Stephenson 2-18
  const isMergeGameEligibleStar = (starId?: string, starName?: string): boolean => {
    const cleanId = (starId || '').toLowerCase().trim();
    const cleanName = (starName || '').toLowerCase().trim();

    // The Sun (Sol) and other stars are strictly excluded
    if (cleanId === 'sun' || cleanName === 'sun' || cleanName.includes('sun (sol)') || cleanName.includes('the sun')) {
      return false;
    }

    // 1. Proxima Centauri
    if (cleanId === 'proxima-centauri' || cleanId === 'proxima' || cleanName.includes('proxima')) {
      return true;
    }
    // 2. Sirius A (The Dog Star)
    if (cleanId === 'sirius-a' || cleanId === 'sirius' || cleanName.includes('sirius') || cleanName.includes('dog star')) {
      return true;
    }
    // 3. Spica
    if (cleanId === 'spica' || cleanName.includes('spica')) {
      return true;
    }
    // 4. Arcturus
    if (cleanId === 'arcturus' || cleanName.includes('arcturus')) {
      return true;
    }
    // 5. Gacrux
    if (cleanId === 'gacrux' || cleanName.includes('gacrux')) {
      return true;
    }
    // 6. Eta Carinae
    if (cleanId === 'eta-carinae-a' || cleanId === 'eta-carinae' || cleanName.includes('eta carinae')) {
      return true;
    }
    // 7. Rho Cassiopeiae
    if (cleanId === 'rho-cassiopeiae' || cleanId === 'rho-cas' || cleanName.includes('rho cassiopeiae')) {
      return true;
    }
    // 8. Stephenson 2-18
    if (cleanId === 'stephenson-2-18' || cleanId === 'stephenson' || cleanName.includes('stephenson')) {
      return true;
    }

    return false;
  };

  const isEligibleForMergeGame = isMergeGameEligibleStar(star?.id, star?.name);

  const handleDossierStarClick = (param?: any) => {
    if (typeof param === 'string') {
      let targetId = param;
      for (const sys of MULTIPLE_STAR_SYSTEMS) {
        const comp = sys.components.find((c) => c.id === param);
        if (comp?.catalogStarId) {
          targetId = comp.catalogStarId;
          break;
        }
      }
      const companion = STARS_CATALOG.find((s) => s.id === targetId);
      if (companion && onSelectStar) {
        soundEffects.play('click');
        onSelectStar(companion);
        return;
      }
    }
    const e = param && typeof param === 'object' && 'stopPropagation' in param ? param : undefined;
    if (!star) return;
    if (e) e.stopPropagation();

    // You can ONLY access the merge game when you triple tap these 8 stars on the dossier
    if (!isEligibleForMergeGame) return;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    const nextCount = starClicks + 1;
    setStarClicks(nextCount);

    if (nextCount >= 3) {
      setStarClicks(0);
      if (onTriggerEasterEgg) {
        onClose();
        onTriggerEasterEgg();
      }
      return;
    } else {
      clickTimerRef.current = setTimeout(() => {
        setStarClicks(0);
      }, 2500);
    }
  };

  const gridRef = useRef<HTMLDivElement>(null);
  const cardDiameterRef = useRef<HTMLDivElement>(null);
  const cardMassRef = useRef<HTMLDivElement>(null);
  const cardTemperatureRef = useRef<HTMLDivElement>(null);
  const cardLuminosityRef = useRef<HTMLDivElement>(null);
  const cardDistanceRef = useRef<HTMLDivElement>(null);

  const [popoverPos, setPopoverPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const updatePopoverPosition = useCallback(
    (metricKey: 'diameter' | 'mass' | 'temperature' | 'luminosity' | 'distance' | null) => {
      if (!metricKey || !gridRef.current) {
        setPopoverPos(null);
        return;
      }
      const cardMap: Record<string, React.RefObject<HTMLDivElement>> = {
        diameter: cardDiameterRef,
        mass: cardMassRef,
        temperature: cardTemperatureRef,
        luminosity: cardLuminosityRef,
        distance: cardDistanceRef,
      };
      const cardEl = cardMap[metricKey]?.current;
      if (!cardEl) {
        setPopoverPos(null);
        return;
      }
      const gridRect = gridRef.current.getBoundingClientRect();
      const cardRect = cardEl.getBoundingClientRect();

      // Available width inside the grid container
      const paddingMargin = 6;
      const availableWidth = Math.max(180, gridRect.width - paddingMargin * 2);

      // On narrow views (< 460px), span full available width so nothing is cramped or cut off
      const targetWidth = availableWidth < 460 ? availableWidth : Math.min(360, availableWidth);

      // Center of card relative to grid
      const cardCenterX = cardRect.left - gridRect.left + cardRect.width / 2;

      // Ideal left position to center popover directly under the card
      const idealLeft = availableWidth < 460 ? paddingMargin : cardCenterX - targetWidth / 2;

      // Clamp left so it never overflows left or right boundaries of grid/window
      const minLeft = paddingMargin;
      const maxLeft = Math.max(minLeft, gridRect.width - targetWidth - paddingMargin);
      const clampedLeft = Math.max(minLeft, Math.min(idealLeft, maxLeft));

      // Top position: right below the card bottom
      const top = cardRect.bottom - gridRect.top + 6;

      setPopoverPos({
        top,
        left: clampedLeft,
        width: targetWidth,
      });
    },
    []
  );

  useEffect(() => {
    if (hoveredMetric) {
      updatePopoverPosition(hoveredMetric);
    } else {
      setPopoverPos(null);
    }
  }, [hoveredMetric, updatePopoverPosition]);

  useEffect(() => {
    if (!hoveredMetric) return;
    const handleResize = () => updatePopoverPosition(hoveredMetric);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hoveredMetric, updatePopoverPosition]);

  if (!star) return null;

  const isSun = star.id === 'sun' || star.distanceLy < 0.0001;

  const renderDescription = () => (
    <div className="p-4 rounded-xl bg-[#02040c]/75 backdrop-blur-md border border-cyan-500/15 text-xs text-slate-400 leading-relaxed font-mono">
      {star.description}
    </div>
  );

  return (
    <div 
      className="fixed inset-0 z-[70] w-full h-full bg-[#030714] flex flex-col overflow-hidden pointer-events-auto animate-in fade-in duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header / Title Section */}
      <div 
        className="relative z-40 px-3 sm:px-6 py-2 sm:py-3 shrink-0 border-b border-cyan-500/20 bg-[#060b20]/95 backdrop-blur-xl transition-all"
      >
        {/* Subtle radial glow background */}
        <div 
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            background: `radial-gradient(circle at top right, ${star.colorHex}25 0%, transparent 65%), rgba(3, 6, 22, 0.75)`,
          }}
        />

        {/* Top Row: Star Info & Close Button */}
        <div className="relative z-10 flex items-center justify-between gap-2 md:gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
              <h1
                onClick={handleDossierStarClick}
                className="text-sm sm:text-base md:text-xl font-black text-white tracking-tight shrink-0 select-none cursor-pointer"
              >
                {star.name}
              </h1>

              {/* Primary Designation Interactive Pill with Hover & Click Popover */}
              <div 
                ref={designationsRef}
                className="relative inline-flex items-center"
                onMouseEnter={() => {
                  if (popoverTimerRef.current) clearTimeout(popoverTimerRef.current);
                  setShowDesignationsPopover(true);
                }}
                onMouseLeave={() => {
                  popoverTimerRef.current = setTimeout(() => {
                    setShowDesignationsPopover(false);
                  }, 250);
                }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDesignationsPopover((prev) => !prev);
                  }}
                  aria-expanded={showDesignationsPopover}
                  aria-label={`View catalog designations for ${star.name}`}
                  className={`group inline-flex items-center gap-1.5 text-[9px] md:text-xs px-2 md:px-2.5 py-0.5 rounded-full font-mono border transition-all cursor-pointer select-none ${
                    showDesignationsPopover
                      ? 'bg-cyan-900/90 text-cyan-200 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-[#091129]/95 hover:bg-[#0e1d3e] text-cyan-300 border-cyan-500/35 hover:border-cyan-400/80 shadow-sm'
                  }`}
                  title="Hover or click to display all designations & catalog identifiers"
                >
                  <span className="font-semibold">{primaryDesignation}</span>
                  <Tag className="w-2.5 h-2.5 md:w-3 md:h-3 text-cyan-400/80 group-hover:text-cyan-300 shrink-0" />
                </button>

                {/* Popover Listing Designations (Paginated: 10 per page with < and > controls) */}
                {showDesignationsPopover && (
                  <div
                    className="absolute left-0 top-full mt-2 z-50 w-72 sm:w-80 md:w-96 max-w-[calc(100vw-2rem)] rounded-xl bg-[#060b1c]/98 border border-cyan-500/40 p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl text-left animate-in fade-in zoom-in-95 duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-cyan-500/20">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Tag className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="text-[11px] md:text-xs font-bold text-cyan-200 uppercase tracking-wider font-mono truncate">
                          Catalog Designations
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-mono border border-cyan-500/30">
                          {allDesignations.length} total
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(`${cleanStarName}: ${allDesignations.join(', ')}`);
                            setCopiedDesignations(true);
                            setTimeout(() => setCopiedDesignations(false), 2000);
                          }}
                          className="p-1 rounded-md bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 hover:text-white border border-cyan-500/30 transition-colors"
                          title="Copy all designations to clipboard"
                        >
                          {copiedDesignations ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Example Format Summary */}
                    <div className="p-2 mb-2 rounded-lg bg-black/50 border border-cyan-500/20 text-[10px] md:text-[11px] font-mono text-slate-300 leading-relaxed break-words select-text">
                      <strong className="text-cyan-300">{cleanStarName}:</strong>{' '}
                      {allDesignations.slice(0, 7).join(', ')}
                      {allDesignations.length > 7 && (
                        <span className="text-cyan-400/80 italic"> (and {allDesignations.length - 7} more...)</span>
                      )}
                    </div>

                    {/* 10 Designations per page */}
                    <div className="space-y-1 my-2">
                      {currentPageDesignations.map((desig, idx) => {
                        const itemNumber = (designationsPage - 1) * DESIGNATIONS_PER_PAGE + idx + 1;
                        return (
                          <div
                            key={itemNumber}
                            className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-[#0b1736]/90 hover:bg-[#10224d] border border-cyan-500/25 hover:border-cyan-400/60 text-slate-200 text-[11px] font-mono transition-colors select-text"
                          >
                            <div className="min-w-0 flex-1 overflow-hidden">
                              <RunningText
                                text={desig}
                                className="text-cyan-100 font-medium"
                              />
                            </div>
                            <span className="text-[9px] text-cyan-400/60 font-mono ml-2 shrink-0">
                              #{itemNumber}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination Controls with < and > buttons */}
                    <div className="mt-2.5 pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400 text-[10px]">
                        Page <strong className="text-cyan-300 font-bold">{designationsPage}</strong> of{' '}
                        <strong className="text-cyan-300 font-bold">{totalDesignationsPages}</strong>
                        <span className="text-slate-500 ml-1">
                          ({allDesignations.length} total)
                        </span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDesignationsPage((p) => Math.max(1, p - 1));
                          }}
                          disabled={designationsPage === 1}
                          className="px-2 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 disabled:opacity-30 disabled:hover:bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center font-bold text-xs"
                          title="Previous 10 designations"
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDesignationsPage((p) => Math.min(totalDesignationsPages, p + 1));
                          }}
                          disabled={designationsPage === totalDesignationsPages}
                          className="px-2 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 disabled:opacity-30 disabled:hover:bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center font-bold text-xs"
                          title="Next 10 designations"
                          aria-label="Next page"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Footer attribution */}
                    <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                      <span>Cross-referenced via CDS / SIMBAD</span>
                      {copiedDesignations && <span className="text-emerald-400 font-medium">Copied to clipboard!</span>}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (onOpenClassificationGuide) {
                    onClose();
                    onOpenClassificationGuide();
                  }
                }}
                title="Learn about this spectral classification"
                className="text-[9px] md:text-xs px-1.5 md:px-2.5 py-0.5 rounded-full bg-cyan-950/90 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 font-semibold font-mono shadow-[0_0_10px_rgba(6,182,212,0.25)] whitespace-nowrap cursor-pointer transition-all hover:border-cyan-400"
              >
                Spectral {star.spectralType} ℹ️
              </button>
            </div>

            <p className="text-[9px] md:text-xs text-slate-400 flex flex-wrap items-center gap-x-1.5 md:gap-x-2 gap-y-0.5 font-mono">
              <span>Constellation: <strong className="text-slate-200">{star.constellation}</strong></span>
              <span className="hidden md:inline">•</span>
              <span>Stage: <strong className="text-slate-200">{star.stellarStage}</strong></span>
            </p>
          </div>

          {/* Top Right Action Group */}
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            {/* Close Button */}
            <button
              id="btn-close-modal"
              onClick={onClose}
              className="shrink-0 p-1.5 md:p-2 rounded-lg md:rounded-xl bg-[#030612]/90 hover:bg-[#0c1630] text-slate-400 hover:text-cyan-300 transition-colors border border-cyan-500/25 cursor-pointer shadow-sm"
              title="Close star information"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Body: Single continuous scroll on mobile portrait; side-by-side split screen with fixed 3D stage on mobile landscape / desktop */}
      <div className="flex-1 min-h-0 flex flex-col landscape:flex-row lg:flex-row overflow-y-auto landscape:overflow-hidden lg:overflow-hidden bg-transparent">
        {/* Left Column: 3D stage in continuous flow on portrait, fixed 1/2 column without scrolling on landscape */}
        <div className="w-full shrink-0 landscape:w-1/2 lg:w-1/2 landscape:h-full lg:h-full landscape:overflow-hidden lg:overflow-y-auto scrollbar-thin p-2.5 sm:p-4 md:p-5 flex flex-col justify-center">
          {/* Interactive 3D Dossier Stage */}
          <div className="w-full h-auto landscape:h-full lg:h-auto">
            <StarDossier3DStage star={star} onStarClick={handleDossierStarClick} initialMode={initialMode} />
          </div>
        </div>

        {/* Right Column: Data/Telemetry panel (scrolls with whole page on portrait, independently on landscape/desktop) */}
        <div className="w-full shrink-0 landscape:w-1/2 lg:w-1/2 landscape:h-full lg:h-full landscape:overflow-y-auto lg:overflow-y-auto pb-safe p-2.5 sm:p-4 md:p-6 scrollbar-thin space-y-3 sm:space-y-4 md:space-y-5">
          {/* 3D Stage Controls Toolbar Slot (Moved to top of right panel) */}
          <div id="star-dossier-toolbar-slot" className="w-full min-h-0" />

          {/* Key Metrics Grid: 5 Core Astrophysical Properties */}
              <div 
                ref={gridRef}
                className="relative"
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-2.5 md:gap-3">
              {/* 1. Physical Diameter Card */}
              <div
                ref={cardDiameterRef}
                id="card-dossier-diameter"
                onMouseEnter={() => {
                  setHoveredMetric('diameter');
                  updatePopoverPosition('diameter');
                }}
                onClick={() => {
                  const next = hoveredMetric === 'diameter' ? null : 'diameter';
                  setHoveredMetric(next);
                  updatePopoverPosition(next);
                }}
                className={`p-2 sm:p-2.5 md:p-3.5 rounded-lg md:rounded-xl bg-[#020510]/80 border shadow-inner flex flex-col justify-between group cursor-pointer transition-all ${
                  hoveredMetric === 'diameter' ? 'border-cyan-400 bg-[#050e28]/90 ring-1 ring-cyan-400/50' : 'border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#04081c]/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[8px] sm:text-[9.5px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Diameter
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-cyan-400/60 group-hover:text-cyan-300 font-mono">ℹ️</span>
                </div>
                <div className="mt-0.5 sm:mt-1 md:mt-1.5">
                  <div className="text-xs sm:text-base md:text-lg font-black text-cyan-400 font-mono drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] break-words leading-tight">
                    {formatPhysicalDiameter(star.diameterKm, star.diameterSolar).metricSi}
                  </div>
                </div>
              </div>

              {/* 2. Stellar Mass Card */}
              <div
                ref={cardMassRef}
                id="card-dossier-mass"
                onMouseEnter={() => {
                  setHoveredMetric('mass');
                  updatePopoverPosition('mass');
                }}
                onClick={() => {
                  const next = hoveredMetric === 'mass' ? null : 'mass';
                  setHoveredMetric(next);
                  updatePopoverPosition(next);
                }}
                className={`p-2 sm:p-2.5 md:p-3.5 rounded-lg md:rounded-xl bg-[#020510]/80 border shadow-inner flex flex-col justify-between group cursor-pointer transition-all ${
                  hoveredMetric === 'mass' ? 'border-blue-400 bg-[#050e28]/90 ring-1 ring-blue-400/50' : 'border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#04081c]/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[8px] sm:text-[9.5px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Stellar Mass
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-blue-400/60 group-hover:text-blue-300 font-mono">ℹ️</span>
                </div>
                <div className="mt-0.5 sm:mt-1 md:mt-1.5">
                  <div className="text-xs sm:text-base md:text-lg font-black text-blue-400 font-mono drop-shadow-[0_0_8px_rgba(96,165,250,0.4)] break-words leading-tight">
                    {star.massSolar.toFixed(star.massSolar < 1 ? 3 : 1)} <span className="text-[10px] sm:text-xs font-normal text-slate-400">M☉</span>
                  </div>
                </div>
              </div>

              {/* 3. Surface Temperature Card */}
              <div
                ref={cardTemperatureRef}
                id="card-dossier-temperature"
                onMouseEnter={() => {
                  setHoveredMetric('temperature');
                  updatePopoverPosition('temperature');
                }}
                onClick={() => {
                  const next = hoveredMetric === 'temperature' ? null : 'temperature';
                  setHoveredMetric(next);
                  updatePopoverPosition(next);
                }}
                className={`p-2 sm:p-2.5 md:p-3.5 rounded-lg md:rounded-xl bg-[#020510]/80 border shadow-inner flex flex-col justify-between group cursor-pointer transition-all ${
                  hoveredMetric === 'temperature' ? 'border-amber-400 bg-[#050e28]/90 ring-1 ring-amber-400/50' : 'border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#04081c]/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[8px] sm:text-[9.5px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Temperature
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-amber-400/60 group-hover:text-amber-300 font-mono">ℹ️</span>
                </div>
                <div className="mt-0.5 sm:mt-1 md:mt-1.5">
                  <div className="text-xs sm:text-base md:text-lg font-black text-amber-400 font-mono drop-shadow-[0_0_8px_rgba(245,158,11,0.4)] break-words leading-tight">
                    {star.temperature.toLocaleString()} <span className="text-[10px] sm:text-xs font-normal text-slate-400">K</span>
                  </div>
                </div>
              </div>

              {/* 4. Luminosity Card */}
              <div
                ref={cardLuminosityRef}
                id="card-dossier-luminosity"
                onMouseEnter={() => {
                  setHoveredMetric('luminosity');
                  updatePopoverPosition('luminosity');
                }}
                onClick={() => {
                  const next = hoveredMetric === 'luminosity' ? null : 'luminosity';
                  setHoveredMetric(next);
                  updatePopoverPosition(next);
                }}
                className={`p-2 sm:p-2.5 md:p-3.5 rounded-lg md:rounded-xl bg-[#020510]/80 border shadow-inner flex flex-col justify-between group cursor-pointer transition-all ${
                  hoveredMetric === 'luminosity' ? 'border-purple-400 bg-[#050e28]/90 ring-1 ring-purple-400/50' : 'border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#04081c]/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[8px] sm:text-[9.5px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Luminosity
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-purple-400/60 group-hover:text-purple-300 font-mono">ℹ️</span>
                </div>
                <div className="mt-0.5 sm:mt-1 md:mt-1.5">
                  <div className="text-xs sm:text-base md:text-lg font-black text-purple-400 font-mono drop-shadow-[0_0_8px_rgba(192,132,252,0.4)] break-words leading-tight">
                    {star.luminositySolar >= 1e6
                      ? `${(star.luminositySolar / 1e6).toFixed(2)}M`
                      : star.luminositySolar >= 1e3
                      ? `${(star.luminositySolar / 1e3).toFixed(1)}k`
                      : star.luminositySolar.toFixed(star.luminositySolar < 0.1 ? 4 : 1)}{' '}
                    <span className="text-[10px] sm:text-xs font-normal text-slate-400">L☉</span>
                  </div>
                </div>
              </div>

              {/* 5. Distance Card */}
              <div
                ref={cardDistanceRef}
                id="card-dossier-distance"
                onMouseEnter={() => {
                  setHoveredMetric('distance');
                  updatePopoverPosition('distance');
                }}
                onClick={() => {
                  const next = hoveredMetric === 'distance' ? null : 'distance';
                  setHoveredMetric(next);
                  updatePopoverPosition(next);
                }}
                className={`col-span-2 sm:col-span-1 lg:col-span-2 xl:col-span-1 p-2 sm:p-2.5 md:p-3.5 rounded-lg md:rounded-xl bg-[#020510]/80 border shadow-inner flex flex-col justify-between group cursor-pointer transition-all ${
                  hoveredMetric === 'distance' ? 'border-emerald-400 bg-[#050e28]/90 ring-1 ring-emerald-400/50' : 'border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#04081c]/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[8px] sm:text-[9.5px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Distance From Earth
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-emerald-400/60 group-hover:text-emerald-300 font-mono">ℹ️</span>
                </div>
                <div className="mt-0.5 sm:mt-1 md:mt-1.5">
                  <div className="text-xs sm:text-base md:text-lg font-black text-emerald-400 font-mono drop-shadow-[0_0_8px_rgba(52,211,153,0.4)] break-words leading-tight">
                    {star.distanceLy >= 1000 ? `${(star.distanceLy / 1000).toFixed(2)}k` : star.distanceLy.toFixed(1)}{' '}
                    <span className="text-[10px] sm:text-xs font-normal text-slate-400">ly</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover / On-Click Stellar Info Overlay Panel: Positioned directly beneath the active card and clamped to container width to guarantee zero window overflow */}
            {hoveredMetric && popoverPos && (
              <div
                style={{
                  top: `${popoverPos.top}px`,
                  left: `${popoverPos.left}px`,
                  width: `${popoverPos.width}px`,
                }}
                className={`absolute z-50 p-2.5 sm:p-3.5 md:p-4 rounded-xl bg-[#020512]/95 backdrop-blur-2xl border text-left font-mono pointer-events-auto max-h-[75vh] overflow-y-auto scrollbar-thin animate-in fade-in zoom-in-95 duration-150 ${
                  hoveredMetric === 'diameter'
                    ? 'border-cyan-400/60 shadow-[0_16px_48px_rgba(0,0,0,0.95),0_0_25px_rgba(6,182,212,0.25)]'
                    : hoveredMetric === 'mass'
                    ? 'border-blue-400/60 shadow-[0_16px_48px_rgba(0,0,0,0.95),0_0_25px_rgba(59,130,246,0.25)]'
                    : hoveredMetric === 'temperature'
                    ? 'border-amber-400/60 shadow-[0_16px_48px_rgba(0,0,0,0.95),0_0_25px_rgba(245,158,11,0.25)]'
                    : hoveredMetric === 'luminosity'
                    ? 'border-purple-400/60 shadow-[0_16px_48px_rgba(0,0,0,0.95),0_0_25px_rgba(192,132,252,0.25)]'
                    : 'border-emerald-400/60 shadow-[0_16px_48px_rgba(0,0,0,0.95),0_0_25px_rgba(52,211,153,0.25)]'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header with Title and Close Button */}
                <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-white/10 mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-[11px] sm:text-xs uppercase tracking-wider min-w-0">
                    {hoveredMetric === 'diameter' && (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="text-cyan-300">Physical Diameter Breakdown</span>
                      </>
                    )}
                    {hoveredMetric === 'mass' && (
                      <>
                        <Atom className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="text-blue-300">Stellar Mass Breakdown</span>
                      </>
                    )}
                    {hoveredMetric === 'temperature' && (
                      <>
                        <Thermometer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-amber-300">Surface Temperature Breakdown</span>
                      </>
                    )}
                    {hoveredMetric === 'luminosity' && (
                      <>
                        <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="text-purple-300">Luminosity & Photometry</span>
                      </>
                    )}
                    {hoveredMetric === 'distance' && (
                      <>
                        <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-emerald-300">Distance From Earth Breakdown</span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHoveredMetric(null);
                    }}
                    className="text-slate-500 hover:text-white p-0.5 rounded cursor-pointer shrink-0 transition-colors"
                    title="Close breakdown"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content for each Metric */}
                {hoveredMetric === 'diameter' && (
                  <div className="space-y-1.5 text-[10.5px] sm:text-[11px]">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• In Solar Diameters:</span>
                      <span className="text-cyan-300 font-bold font-mono text-right break-words min-w-0">
                        {formatPhysicalDiameter(star.diameterKm, star.diameterSolar).solarFormatted}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Kilometers:</span>
                      <span className="text-cyan-200 font-semibold font-mono text-right break-words min-w-0">
                        {star.diameterKm.toLocaleString()} km
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Statute Miles:</span>
                      <span className="text-cyan-200 font-semibold font-mono text-right break-words min-w-0">
                        {Math.round(star.diameterKm * 0.621371192).toLocaleString()} mi
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• SI Scientific:</span>
                      <span className="text-purple-300 font-semibold font-mono text-right break-words min-w-0">
                        {formatPhysicalDiameter(star.diameterKm, star.diameterSolar).scientificNotation}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Astronomical Units:</span>
                      <span className="text-emerald-300 font-bold font-mono text-right break-words min-w-0">
                        {star.diameterAU < 0.001 ? star.diameterAU.toExponential(3) : star.diameterAU.toFixed(4)} AU
                      </span>
                    </div>
                  </div>
                )}

                {hoveredMetric === 'mass' && (
                  <div className="space-y-1.5 text-[10.5px] sm:text-[11px]">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Mass in M☉:</span>
                      <span className="text-blue-300 font-bold font-mono text-right break-words min-w-0">
                        {star.massSolar < 0.1 ? star.massSolar.toFixed(4) : star.massSolar < 1 ? star.massSolar.toFixed(3) : star.massSolar.toLocaleString(undefined, { maximumFractionDigits: 2 })} M☉
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Mass in kg:</span>
                      <span className="text-blue-200 font-semibold font-mono text-right break-words min-w-0">
                        {(star.massSolar * 1.98847).toFixed(3)} × 10³⁰ kg
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Scientific (kg):</span>
                      <span className="text-blue-300 font-mono text-[10px] text-right break-words min-w-0">
                        {(star.massSolar * 1.98847e30).toExponential(3)} kg
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Mass in lbs:</span>
                      <span className="text-blue-200 font-semibold font-mono text-right break-words min-w-0">
                        {(star.massSolar * 4.38383).toFixed(3)} × 10³⁰ lbs
                      </span>
                    </div>
                  </div>
                )}

                {hoveredMetric === 'temperature' && (
                  <div className="space-y-1.5 text-[10.5px] sm:text-[11px]">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Kelvin (K):</span>
                      <span className="text-amber-300 font-bold font-mono text-right break-words min-w-0">
                        {star.temperature.toLocaleString()} K
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Celsius (°C):</span>
                      <span className="text-amber-200 font-semibold font-mono text-right break-words min-w-0">
                        {Math.round(star.temperature - 273.15).toLocaleString()} °C
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Fahrenheit (°F):</span>
                      <span className="text-amber-200 font-semibold font-mono text-right break-words min-w-0">
                        {Math.round((star.temperature - 273.15) * 1.8 + 32).toLocaleString()} °F
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Peak Radiation:</span>
                      <span className="text-amber-300 font-semibold font-mono text-right break-words min-w-0">
                        {Math.round(2897772 / star.temperature)} nm
                      </span>
                    </div>
                  </div>
                )}

                {hoveredMetric === 'luminosity' && (
                  <div className="space-y-1.5 text-[10.5px] sm:text-[11px]">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Solar Luminosity:</span>
                      <span className="text-purple-300 font-bold font-mono text-right break-words min-w-0">
                        {star.luminositySolar >= 1000
                          ? `${star.luminositySolar.toLocaleString(undefined, { maximumFractionDigits: 1 })} L☉`
                          : star.luminositySolar < 0.01
                          ? `${star.luminositySolar.toExponential(3)} L☉`
                          : `${star.luminositySolar.toFixed(2)} L☉`}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Absolute Mag (M):</span>
                      <span className="text-purple-200 font-semibold font-mono text-right break-words min-w-0">
                        {star.absoluteMagnitude > 0 ? `+${star.absoluteMagnitude}` : star.absoluteMagnitude} M
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Apparent Mag (m):</span>
                      <span className="text-purple-200 font-semibold font-mono text-right break-words min-w-0">
                        {star.apparentMagnitude > 0 ? `+${star.apparentMagnitude}` : star.apparentMagnitude} m
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Apparent Angular Size:</span>
                      <span className="text-cyan-300 font-bold font-mono text-right break-words min-w-0">
                        {calculateApparentSize(star.diameterKm, star.distanceLy, isSun)}
                      </span>
                    </div>
                  </div>
                )}

                {hoveredMetric === 'distance' && (
                  <div className="space-y-1.5 text-[10.5px] sm:text-[11px]">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Light Years:</span>
                      <span className="text-emerald-300 font-bold font-mono text-right break-words min-w-0">
                        {isSun
                          ? '0.0000158 ly (1.00 AU)'
                          : `${star.distanceLy.toLocaleString(undefined, { maximumFractionDigits: 2 })} ly`}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Parsecs:</span>
                      <span className="text-emerald-200 font-semibold font-mono text-right break-words min-w-0">
                        {isSun
                          ? '0.00000485 pc'
                          : `${star.distanceParsecs.toLocaleString(undefined, { maximumFractionDigits: 2 })} pc`}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Kilometers:</span>
                      <span className="text-emerald-200 font-semibold font-mono text-right break-words min-w-0">
                        {isSun
                          ? '149.6M km'
                          : `${(star.distanceLy * 9.46073).toLocaleString(undefined, { maximumFractionDigits: 2 })} × 10¹² km`}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400 shrink-0">• Miles:</span>
                      <span className="text-emerald-200 font-semibold font-mono text-right break-words min-w-0">
                        {isSun
                          ? '92.96M mi'
                          : `${(star.distanceLy * 5.878625).toLocaleString(undefined, { maximumFractionDigits: 2 })} × 10¹² mi`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

              {/* Exoplanetary System Section */}
          <div className="p-5 rounded-2xl bg-[#020514]/75 backdrop-blur-md border border-cyan-500/25 shadow-[0_0_30px_rgba(6,182,212,0.12)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-cyan-500/15 pb-3">
              <div className="flex items-center gap-2.5 text-cyan-300">
                <Globe className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider font-sans">
                  Exoplanetary System
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {star.exoplanetSystem.hasExoplanets ? (
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 font-mono font-bold flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    {star.exoplanetSystem.confirmedCount} Confirmed Planet{star.exoplanetSystem.confirmedCount !== 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-400 border border-slate-700/50 font-mono">
                    No Confirmed Planets
                  </span>
                )}
                {star.exoplanetSystem.candidateCount && star.exoplanetSystem.candidateCount > 0 ? (
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-950/90 text-amber-300 border border-amber-500/40 font-mono font-medium">
                    +{star.exoplanetSystem.candidateCount} Candidate{star.exoplanetSystem.candidateCount > 1 ? 's' : ''}
                  </span>
                ) : null}
                {star.exoplanetSystem.debrisDisk && (
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-950/90 text-purple-300 border border-purple-500/40 font-mono">
                    Debris Disk
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {star.exoplanetSystem.systemOverview}
            </p>

            {star.exoplanetSystem.debrisDiskDescription && (
              <div className="mb-4 p-3 rounded-xl bg-[#02040c]/80 border border-purple-500/25 text-xs text-purple-200/90 font-mono flex items-start gap-2 shadow-inner">
                <Orbit className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-purple-300">Circumstellar Dust & Debris Architecture:</strong>{' '}
                  {star.exoplanetSystem.debrisDiskDescription}
                </span>
              </div>
            )}

            {/* Exoplanet Cards List */}
            {star.exoplanetSystem.planets.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Cataloged System Bodies ({star.exoplanetSystem.planets.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {star.exoplanetSystem.planets.map((planet, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#020512]/90 border border-cyan-500/20 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-3 shadow-inner"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <h5 className="text-sm font-bold text-cyan-200 font-sans">
                              {planet.name}
                            </h5>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {planet.type}
                            </span>
                          </div>

                          {planet.habitableZoneStatus && (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium border whitespace-nowrap ${
                                planet.habitableZoneStatus.includes('Habitable')
                                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                                  : planet.habitableZoneStatus === 'Inner Rim'
                                  ? 'bg-amber-950/90 text-amber-300 border-amber-500/40'
                                  : 'bg-slate-900/90 text-slate-400 border-slate-700/40'
                              }`}
                            >
                              {planet.habitableZoneStatus}
                            </span>
                          )}
                        </div>

                        {planet.description && (
                          <p className="text-xs text-slate-300 leading-relaxed mt-1">
                            {planet.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2.5 border-t border-cyan-500/15 grid grid-cols-2 gap-2 text-[11px] font-mono">
                        {planet.mass && (
                          <div>
                            <span className="text-slate-500">Mass:</span>{' '}
                            <span className="text-slate-200 font-medium">{planet.mass}</span>
                          </div>
                        )}
                        {planet.radius && (
                          <div>
                            <span className="text-slate-500">Radius:</span>{' '}
                            <span className="text-slate-200 font-medium">{planet.radius}</span>
                          </div>
                        )}
                        {planet.orbitalPeriodDays !== undefined && (
                          <div>
                            <span className="text-slate-500">Orbit Period:</span>{' '}
                            <span className="text-cyan-300 font-medium">
                              {planet.orbitalPeriodDays >= 365
                                ? `${(planet.orbitalPeriodDays / 365.25).toFixed(2)} yr (${planet.orbitalPeriodDays.toLocaleString()} d)`
                                : `${planet.orbitalPeriodDays.toFixed(2)} days`}
                            </span>
                          </div>
                        )}
                        {planet.semiMajorAxisAU !== undefined && (
                          <div>
                            <span className="text-slate-500">Distance:</span>{' '}
                            <span className="text-emerald-300 font-medium">{planet.semiMajorAxisAU} AU</span>
                          </div>
                        )}
                        {planet.discoveryMethod && (
                          <div className="col-span-2 text-[10px] text-slate-400 flex items-center gap-1.5 pt-1">
                            <span>Method: <strong className="text-slate-300">{planet.discoveryMethod}</strong></span>
                            {planet.discoveryYear && <span>({planet.discoveryYear})</span>}
                            {!planet.confirmed && <span className="text-amber-400 italic">• Candidate</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dedicated Link to Stellar System Dossier */}
          {knownMultipleSystem && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0e072b]/90 via-[#07041a]/90 to-[#030112]/90 border border-purple-500/35 shadow-[0_0_30px_rgba(168,85,247,0.18)]">
              <div className="flex flex-wrap items-center justify-between gap-2 text-purple-300 mb-2 border-b border-purple-500/25 pb-2">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-200">
                    Gravitationally Bound Stellar System
                  </span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 font-mono border border-purple-400/50 font-bold">
                  {knownMultipleSystem.systemType}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                {knownMultipleSystem.name}
              </h3>

              <p className="text-xs text-purple-200/80 leading-relaxed font-sans mb-3">
                This star is one of <strong className="text-white">{knownMultipleSystem.components.length} gravitationally bound stars</strong> orbiting a common mutual center of mass.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {onOpenStellarSystemDossier && (
                  <button
                    onClick={() => onOpenStellarSystemDossier(knownMultipleSystem)}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center gap-2 cursor-pointer"
                  >
                    <span>Open {knownMultipleSystem.name.split(' (')[0]} System Dossier</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Conjoined Kissing Contact Binary Anatomy Section */}
          {(star.id === 'vfts-352' || star.id === 'w-ursae-majoris' || star.stellarStage === 'Contact Binary') && (
            <div className="p-5 rounded-2xl bg-[#02081c]/75 backdrop-blur-md border border-blue-400/40 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <div className="flex items-center justify-between gap-2.5 text-blue-300 mb-3 border-b border-blue-500/20 pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <h3 className="text-sm font-bold uppercase tracking-wider font-sans text-white">
                    Conjoined "Kissing" Binary Architecture
                  </h3>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 font-mono border border-blue-400/40">
                  Treated as 1 Conjoined Object
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {star.id === 'w-ursae-majoris' ? (
                  <>
                    <strong>W Ursae Majoris</strong> is the founding prototype of all <strong>overcontact binary systems</strong>. Two solar-type stars orbit so intimately (8.0-hour period) that both have filled their critical Roche lobes, forming a shared convective envelope that transfers heat and equalizes their photospheric temperatures.
                  </>
                ) : (
                  <>
                    <strong>VFTS 352</strong> is the most massive and extreme <strong>overcontact binary system</strong> known. Two supermassive O-type stars orbit so closely (1.12-day period) that their surfaces overlap and physically touch, forming a continuous bridge of plasma that transfers mass and synchronizes their thermal envelopes.
                  </>
                )}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#020614]/80 border border-blue-500/30">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                    {star.id === 'w-ursae-majoris' ? 'Primary Star (Lobe A)' : 'Primary Star (Lobe A)'}
                  </div>
                  <div className="text-cyan-300 font-bold text-sm">
                    {star.id === 'w-ursae-majoris' ? '1.19 M☉' : '~29.6 M☉'}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Spectral: {star.id === 'w-ursae-majoris' ? 'F8Vp' : 'O4.5V(n)((f*))'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Radius: {star.id === 'w-ursae-majoris' ? '1.08 R☉' : '~7.25 R☉'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#020614]/80 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                  <div className="text-[10px] text-cyan-400 uppercase tracking-wider mb-1">Kissing Mass Bridge</div>
                  <div className="text-white font-bold text-sm">
                    {star.id === 'w-ursae-majoris' ? 'Shared Envelope' : '~30% Mass Shared'}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Period: {star.id === 'w-ursae-majoris' ? '8.0 Hours (0.33 days)' : '27.0 Hours (1.12 days)'}
                  </div>
                  <div className="text-[11px] text-emerald-300 font-bold">Overcontact Neck</div>
                </div>

                <div className="p-3 rounded-xl bg-[#020614]/80 border border-blue-500/30">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                    {star.id === 'w-ursae-majoris' ? 'Secondary Star (Lobe B)' : 'Secondary Star (Lobe B)'}
                  </div>
                  <div className="text-cyan-300 font-bold text-sm">
                    {star.id === 'w-ursae-majoris' ? '0.57 M☉' : '~28.6 M☉'}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Spectral: {star.id === 'w-ursae-majoris' ? 'F8Vp' : 'O5.5V(n)((f*))'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Radius: {star.id === 'w-ursae-majoris' ? '0.78 R☉' : '~6.95 R☉'}
                  </div>
                </div>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 text-[11px] text-blue-200/90 leading-relaxed font-mono flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>
                  <strong>Astrophysical Destiny:</strong>{' '}
                  {star.id === 'w-ursae-majoris'
                    ? 'Gravitational wave dissipation and magnetic braking will eventually drain orbital angular momentum, causing both stars to coalesce into a single rapidly-spinning, rejuvenated blue straggler star (FK Comae type).'
                    : 'Because both stars are nearly equal in mass, they undergo deep rotational tidal locking and mass mixing. Theorists predict VFTS 352 will either merge catastrophically into a single rapidly spinning monster star or avoid full envelope merger and produce a binary black hole merger emitting high-frequency gravitational waves.'}
                </span>
              </div>
            </div>
          )}

          {/* Astrophysics Details & Fusion Mechanism */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-5 rounded-2xl bg-[#020512]/75 backdrop-blur-md border border-cyan-500/20 space-y-3 shadow-inner">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Atom className="w-4 h-4" />
                <h4>Nuclear Fusion & Core Physics</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {star.fusionProcess}
              </p>
              <div className="pt-2 border-t border-cyan-500/15 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500">Surface Gravity:</span>{' '}
                  <span className="text-slate-200">log(g) = {star.surfaceGravityLogG}</span>
                </div>
                <div>
                  <span className="text-slate-500">Abs Magnitude:</span>{' '}
                  <span className="text-slate-200">{star.absoluteMagnitude} M</span>
                </div>
                {star.metallicityFeH !== undefined && (
                  <div>
                    <span className="text-slate-500">Metallicity [Fe/H]:</span>{' '}
                    <span className="text-slate-200">{star.metallicityFeH > 0 ? `+${star.metallicityFeH}` : star.metallicityFeH}</span>
                  </div>
                )}
                {star.rotationalVelocityKmS !== undefined && (
                  <div>
                    <span className="text-slate-500">Rotation Velocity:</span>{' '}
                    <span className="text-slate-200">{star.rotationalVelocityKmS} km/s</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#020512]/75 backdrop-blur-md border border-cyan-500/20 space-y-3 shadow-inner">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Clock className="w-4 h-4" />
                <h4>Stellar Evolution</h4>
              </div>
              <div className="text-xs text-slate-300 space-y-1.5">
                <div>
                  <strong className="text-slate-400">Current Age:</strong>{' '}
                  <span className="text-pink-400 font-mono font-bold">{star.estimatedAge}</span>
                </div>
                <div>
                  <strong className="text-slate-400">Lifespan:</strong> {star.lifespanEstimate}
                </div>
                <div>
                  <strong className="text-slate-400">Eventual Fate:</strong>{' '}
                  <span className="text-amber-300 font-medium">{star.futureFate}</span>
                </div>
                <div>
                  <strong className="text-slate-400">Habitable Zone:</strong>{' '}
                  <span className="text-emerald-300 font-mono">
                    {star.habitableZoneAU.inner.toFixed(2)} - {star.habitableZoneAU.outer.toFixed(2)} AU
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notable Facts */}
          <div className="p-5 rounded-2xl bg-[#020512]/75 backdrop-blur-md border border-cyan-500/20 space-y-3 shadow-inner">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Award className="w-4 h-4" />
              <h4>Notable Astrophysical Facts</h4>
            </div>
            <ul className="space-y-2">
              {star.notableFacts.map((fact, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

              {/* Footnote / Scientific Description at the very bottom of the right panel */}
              <div>
                {renderDescription()}
              </div>

              {/* Mobile Portrait Bottom Close Action */}
              <div className="pt-2 pb-1 sm:hidden landscape:hidden flex justify-center">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#081026] hover:bg-[#0e1b3d] text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Close Star Dossier</span>
                </button>
              </div>
            </div>
        </div>
      </div>
  );
};
