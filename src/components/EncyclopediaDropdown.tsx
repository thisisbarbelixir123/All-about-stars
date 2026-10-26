import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  Sun, 
  Grid, 
  BarChart2, 
  Compass,
  Telescope,
  Share2,
  Flame,
  Bookmark
} from 'lucide-react';

interface EncyclopediaDropdownProps {
  onOpenFrontpage: () => void;
  onOpenClassification?: () => void;
  onOpenDiscovery?: () => void;
  onOpenConstellations: () => void;
  onOpenHRDiagram: () => void;
  onOpenCatalog: () => void;
  onOpenStellarSystems?: () => void;
  onOpenNomenclature?: () => void;
  activeOverlay?: string | null;
  buttonId?: string;
  menuId?: string;
  isMobile?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const EncyclopediaDropdown: React.FC<EncyclopediaDropdownProps> = ({
  onOpenFrontpage,
  onOpenClassification,
  onOpenDiscovery,
  onOpenConstellations,
  onOpenHRDiagram,
  onOpenCatalog,
  onOpenStellarSystems,
  onOpenNomenclature,
  activeOverlay,
  buttonId = 'btn-stage-canvas-encyclopedia',
  menuId = 'menu-stage-canvas-encyclopedia',
  isMobile = false,
  isOpen: controlledIsOpen,
  onOpenChange,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setIsOpen = useCallback((valueOrFn: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof valueOrFn === 'function' ? valueOrFn(isOpen) : valueOrFn;
    if (isControlled) {
      onOpenChange?.(nextVal);
    } else {
      setInternalIsOpen(nextVal);
    }
  }, [isControlled, isOpen, onOpenChange]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click or touch
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const isAnyActive = !!activeOverlay;

  return (
    <div className="relative pointer-events-auto select-none" ref={dropdownRef}>
      <button
        id={buttonId}
        onClick={() => setIsOpen((prev) => !prev)}
        title="Star Encyclopedia: Browse cosmic modules (E)"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center ${isMobile ? 'p-2 justify-center' : 'gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5'} rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 shadow-md ${
          isOpen || isAnyActive
            ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border-cyan-400 text-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.35)]'
            : 'bg-[#040816]/90 text-slate-300 hover:text-white hover:bg-cyan-950/60 border-cyan-500/30 backdrop-blur-md'
        }`}
      >
        <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
        {!isMobile && <span className="hidden sm:inline font-mono">Encyclopedia</span>}
        {!isMobile && (
          <ChevronDown
            className={`w-3.5 h-3.5 text-cyan-400 transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180 text-cyan-300' : ''
            }`}
          />
        )}
      </button>

      {/* Encyclopedia Sections Popover Dropdown */}
      {isOpen && (
        <div
          id={menuId}
          className="absolute left-0 top-full mt-2 w-72 max-w-[calc(100vw-1.5rem)] max-h-[75vh] overflow-y-auto scrollbar-thin bg-[#040817]/98 border border-cyan-500/40 rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.92),0_0_24px_rgba(6,182,212,0.25)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl font-mono text-xs"
        >
          <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-cyan-500/20 pb-1.5 mb-1.5">
            <span>Star Encyclopedia</span>
          </div>

          <div className="flex flex-col gap-1">
            {/* 1. What is a Star */}
            <button
              id="btn-encyclopedia-menu-frontpage"
              onClick={() => {
                setIsOpen(false);
                onOpenFrontpage();
              }}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 text-slate-200 hover:text-white cursor-pointer group"
            >
              <div className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                <Sun className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300 break-words">What is a Star</div>
                <div className="text-[10px] text-slate-400 font-sans break-words">Anatomy, fusion & life cycles</div>
              </div>
            </button>

            {/* 2. Classification */}
            {onOpenClassification && (
              <button
                id="btn-encyclopedia-menu-classification"
                onClick={() => {
                  setIsOpen(false);
                  onOpenClassification();
                }}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 text-slate-200 hover:text-white cursor-pointer group"
              >
                <div className="p-1.5 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-400 group-hover:scale-105 transition-transform shrink-0">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300 break-words">Classification</div>
                  <div className="text-[10px] text-slate-400 font-sans break-words">Spectral types, Yerkes & variables</div>
                </div>
              </button>
            )}

            {/* 3. Discovery */}
            {onOpenDiscovery && (
              <button
                id="btn-encyclopedia-menu-discovery"
                onClick={() => {
                  setIsOpen(false);
                  onOpenDiscovery();
                }}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 text-slate-200 hover:text-white cursor-pointer group"
              >
                <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                  <Telescope className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300 break-words">Discovery</div>
                  <div className="text-[10px] text-slate-400 font-sans break-words">Methods, telescopes & timeline</div>
                </div>
              </button>
            )}

            {/* 4. Constellation Guide */}
            <button
              id="btn-encyclopedia-menu-constellations"
              onClick={() => {
                setIsOpen(false);
                onOpenConstellations();
              }}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 text-slate-200 hover:text-white cursor-pointer group"
            >
              <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300 break-words">Constellation Guide</div>
                <div className="text-[10px] text-slate-400 font-sans break-words">All 88 IAU constellations & lore</div>
              </div>
            </button>

            {/* 5. H-R Diagram */}
            <button
              id="btn-encyclopedia-menu-hr"
              onClick={() => {
                setIsOpen(false);
                onOpenHRDiagram();
              }}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 text-slate-200 hover:text-white cursor-pointer group"
            >
              <div className="p-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
                <BarChart2 className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300 break-words">H-R Diagram</div>
                <div className="text-[10px] text-slate-400 font-sans break-words">Luminosity vs Temperature plot</div>
              </div>
            </button>

            {/* 6. Star Catalog */}
            <button
              id="btn-encyclopedia-menu-catalog"
              onClick={() => {
                setIsOpen(false);
                onOpenCatalog();
              }}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 text-slate-200 hover:text-white cursor-pointer group"
            >
              <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                <Grid className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300 break-words">Star Catalog</div>
                <div className="text-[10px] text-slate-400 font-sans break-words">Individual Stars & physical parameters</div>
              </div>
            </button>

            {/* 7. System Catalog */}
            {onOpenStellarSystems && (
              <button
                id="btn-encyclopedia-menu-stellar-systems"
                onClick={() => {
                  setIsOpen(false);
                  onOpenStellarSystems();
                }}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 text-slate-200 hover:text-white cursor-pointer group"
              >
                <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                  <Share2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300 break-words flex items-center gap-1.5">
                    <span>System Catalog</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans break-words">Multiple star systems & 3D orbits</div>
                </div>
              </button>
            )}

            {/* 8. Stellar Nomenclature */}
            {onOpenNomenclature && (
              <button
                id="btn-encyclopedia-menu-nomenclature"
                onClick={() => {
                  setIsOpen(false);
                  onOpenNomenclature();
                }}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 text-slate-200 hover:text-white cursor-pointer group"
              >
                <div className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                  <Bookmark className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300 break-words flex items-center gap-1.5">
                    <span>Stellar Nomenclature</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans break-words">Bayer letters, Flamsteed & catalogs</div>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
