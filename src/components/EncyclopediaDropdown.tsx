import React, { useRef, useEffect, useState } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  Sun, 
  Grid, 
  BarChart2, 
  Compass,
  Telescope
} from 'lucide-react';

interface EncyclopediaDropdownProps {
  onOpenFrontpage: () => void;
  onOpenCatalog: () => void;
  onOpenHRDiagram: () => void;
  onOpenConstellations: () => void;
  onOpenDiscovery?: () => void;
  onOpenNomenclature?: () => void;
  onOpenTours?: () => void;
  onOpenQuiz?: () => void;
  onOpenObservationDeck?: () => void;
  activeOverlay?: string | null;
  buttonId?: string;
  menuId?: string;
  isMobile?: boolean;
}

export const EncyclopediaDropdown: React.FC<EncyclopediaDropdownProps> = ({
  onOpenFrontpage,
  onOpenCatalog,
  onOpenHRDiagram,
  onOpenConstellations,
  onOpenDiscovery,
  onOpenNomenclature,
  onOpenTours,
  onOpenQuiz,
  onOpenObservationDeck,
  activeOverlay,
  buttonId = 'btn-stage-canvas-encyclopedia',
  menuId = 'menu-stage-canvas-encyclopedia',
  isMobile = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleOpenDiscovery = onOpenDiscovery || onOpenNomenclature;

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const isAnyActive = !!activeOverlay;

  return (
    <div className="relative pointer-events-auto select-none" ref={dropdownRef}>
      <button
        id={buttonId}
        onClick={() => setIsOpen((prev) => !prev)}
        title="Star Encyclopedia: Browse all 4 cosmic modules (E)"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 shadow-md ${
          isOpen || isAnyActive
            ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border-cyan-400 text-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.35)]'
            : 'bg-[#040816]/90 text-slate-300 hover:text-white hover:bg-cyan-950/60 border-cyan-500/30 backdrop-blur-md'
        }`}
      >
        <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className={isMobile ? 'hidden' : 'hidden sm:inline font-mono'}>Encyclopedia</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-cyan-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-cyan-300' : ''
          }`}
        />
      </button>

      {/* Encyclopedia Sections Popover Dropdown */}
      {isOpen && (
        <div
          id={menuId}
          className="absolute left-0 top-full mt-2 w-72 max-w-[calc(100vw-1.5rem)] max-h-[75vh] overflow-y-auto scrollbar-thin bg-[#040817]/98 border border-cyan-500/40 rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.92),0_0_24px_rgba(6,182,212,0.25)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl font-mono text-xs"
        >
          <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-cyan-500/20 pb-1.5 mb-1.5">
            <span>Star Encyclopedia</span>
            <span className="text-cyan-400 font-normal">5 modules</span>
          </div>

          <div className="flex flex-col gap-1">
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
                <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300 break-words">What is a Star?</div>
                <div className="text-[10px] text-slate-400 font-sans break-words">Anatomy, fusion & life cycles</div>
              </div>
            </button>

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
                <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300 break-words">Stellar Catalog</div>
                <div className="text-[10px] text-slate-400 font-sans break-words">Filter & explore cataloged stars</div>
              </div>
            </button>

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

            {handleOpenDiscovery && (
              <button
                id="btn-encyclopedia-menu-discovery"
                onClick={() => {
                  setIsOpen(false);
                  handleOpenDiscovery();
                }}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 text-slate-200 hover:text-white cursor-pointer group"
              >
                <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                  <Telescope className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300 break-words">Stellar Discovery</div>
                  <div className="text-[10px] text-slate-400 font-sans break-words">Methods, telescopes, timeline & naming</div>
                </div>
              </button>
            )}

            {onOpenTours && (
              <button
                id="btn-encyclopedia-menu-tours"
                onClick={() => {
                  setIsOpen(false);
                  onOpenTours();
                }}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 text-slate-200 hover:text-white cursor-pointer group"
              >
                <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300 break-words">Cosmic Expeditions</div>
                  <div className="text-[10px] text-slate-400 font-sans break-words">Guided multi-stop narrated tours</div>
                </div>
              </button>
            )}

            {onOpenQuiz && (
              <button
                id="btn-encyclopedia-menu-quiz"
                onClick={() => {
                  setIsOpen(false);
                  onOpenQuiz();
                }}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-amber-500/15 border border-transparent hover:border-amber-500/30 text-slate-200 hover:text-white cursor-pointer group"
              >
                <div className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-slate-200 group-hover:text-amber-300 break-words">Stellar Quiz</div>
                  <div className="text-[10px] text-slate-400 font-sans break-words">Astrophysics knowledge challenges</div>
                </div>
              </button>
            )}

            {onOpenObservationDeck && (
              <button
                id="btn-encyclopedia-menu-deck"
                onClick={() => {
                  setIsOpen(false);
                  onOpenObservationDeck();
                }}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 text-slate-200 hover:text-white cursor-pointer group"
              >
                <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                  <Grid className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300 break-words">Observation Deck</div>
                  <div className="text-[10px] text-slate-400 font-sans break-words">Saved stars, notes & target lists</div>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
