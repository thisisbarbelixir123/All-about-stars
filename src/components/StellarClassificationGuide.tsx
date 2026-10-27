import React, { useState, useMemo, useEffect, useRef } from 'react';
import { StarData } from '../types';
import { STARS_CATALOG } from '../data/stars';
import { formatPhysicalDiameter } from '../utils/formatters';
import {
  SPECTRAL_CLASSES_GUIDE,
  EXOTIC_CLASSES_GUIDE,
  LUMINOSITY_CLASSES_GUIDE,
  VARIABLE_STARS_GUIDE,
  STAR_SYSTEMS_GUIDE,
  STELLAR_POPULATIONS_GUIDE,
  STELLAR_REMNANTS_GUIDE,
  HYPOTHETICAL_STARS_GUIDE,
} from '../data/classificationGuideData';
import {
  BookOpen,
  Sparkles,
  Sun,
  Flame,
  Layers,
  HelpCircle,
  Info,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Award,
  Zap,
  Lightbulb,
  ArrowRight,
  Activity,
  Atom,
  Scale,
  Thermometer,
  Eye,
  Radio,
  Grid,
  ShieldAlert,
  Sliders,
} from 'lucide-react';
import { MultipleStarSystemData } from '../data/multipleStarSystemsData';
import { ClassificationMappedStarsSection } from './ClassificationMappedStarsSection';
import { ClassificationMappedSystemsSection } from './ClassificationMappedSystemsSection';
import { ClassificationDirectoryModal } from './ClassificationDirectoryModal';
import { VariableStarGraphic, VariableStarActivityMonitor } from './VariableStarGraphic';
import { StarSystemGraphic, StarSystemActivityMonitor } from './StarSystemGraphic';
import { StellarRemnantGraphic } from './StellarRemnantGraphic';
import { HypotheticalStarGraphic } from './HypotheticalStarGraphic';
import { StarDot2D } from './StarDot2D';
import { RunningText } from './RunningText';
import {
  getMappedStarsForHarvard,
  getMappedStarsForExotic,
  getMappedStarsForYerkes,
  getMappedStarsForVariable,
  getMappedStarsForStarSystem,
  getMappedSystemsForStarSystemGuide,
  getMappedStarsForPopulation,
  getMappedStarsForRemnant,
  getMappedStarsForHypothetical,
} from '../utils/stellarClassificationMapping';

export interface StellarClassificationGuideProps {
  onSelectStar: (star: StarData) => void;
  onCompareStar: (star: StarData) => void;
  onJumpToCatalog?: () => void;
  onJumpToHRDiagram?: () => void;
  onJumpToConstellations?: () => void;
  onJumpToCatalogFilter?: (spectralClass?: string, stellarStage?: string) => void;
  initialSystemIndex?: number;
  onSelectSystem?: (system: MultipleStarSystemData) => void;
}

export const StellarClassificationGuide: React.FC<StellarClassificationGuideProps> = ({
  onSelectStar,
  onCompareStar,
  onJumpToCatalog,
  onJumpToHRDiagram,
  onJumpToConstellations,
  onJumpToCatalogFilter,
  initialSystemIndex = 0,
  onSelectSystem,
}) => {
  // Classification Systems Carousel Toggle State:
  // 0: Harvard Spectral Classes (OBAFGKM)
  // 1: Other Spectral Classes
  // 2: Variable Stars
  // 3: Yerkes Luminosity System (MKK)
  // 4: Star Systems
  // 5: Stellar Populations
  // 6: Stellar Remnants
  // 7: Hypothetical Stars
  const [classificationSystemIndex, setClassificationSystemIndex] = useState<number>(() => {
    if (initialSystemIndex !== undefined) return initialSystemIndex;
    return 0;
  });

  const handlePrevClassificationSystem = () => {
    setClassificationSystemIndex((prev) => (prev - 1 + 8) % 8);
  };

  const handleNextClassificationSystem = () => {
    setClassificationSystemIndex((prev) => (prev + 1) % 8);
  };

  // Other Spectral Classes Mobile Carousel state
  const [activeExoticIndex, setActiveExoticIndex] = useState<number>(0);

  // Prevent carousel from drifting/scrolling when the user directly clicks a selector button
  // Programmatic scroll into view ONLY occurs when explicitly triggered by Prev/Next navigation buttons
  const isNavigatedByArrowRef = useRef(false);
  const [isClassificationDirectoryOpen, setIsClassificationDirectoryOpen] = useState(false);

  const handlePrevExotic = () => {
    isNavigatedByArrowRef.current = true;
    setActiveExoticIndex((prev) => (prev - 1 + EXOTIC_CLASSES_GUIDE.length) % EXOTIC_CLASSES_GUIDE.length);
  };

  const handleNextExotic = () => {
    isNavigatedByArrowRef.current = true;
    setActiveExoticIndex((prev) => (prev + 1) % EXOTIC_CLASSES_GUIDE.length);
  };

  // Variable Stars Carousel state
  const [activeVariableIndex, setActiveVariableIndex] = useState<number>(0);

  const handlePrevVariable = () => {
    isNavigatedByArrowRef.current = true;
    setActiveVariableIndex((prev) => (prev - 1 + VARIABLE_STARS_GUIDE.length) % VARIABLE_STARS_GUIDE.length);
  };

  const handleNextVariable = () => {
    isNavigatedByArrowRef.current = true;
    setActiveVariableIndex((prev) => (prev + 1) % VARIABLE_STARS_GUIDE.length);
  };

  // Yerkes Luminosity System Mobile Carousel state
  const [activeYerkesIndex, setActiveYerkesIndex] = useState<number>(0);

  const handlePrevYerkes = () => {
    isNavigatedByArrowRef.current = true;
    setActiveYerkesIndex((prev) => (prev - 1 + LUMINOSITY_CLASSES_GUIDE.length) % LUMINOSITY_CLASSES_GUIDE.length);
  };

  const handleNextYerkes = () => {
    isNavigatedByArrowRef.current = true;
    setActiveYerkesIndex((prev) => (prev + 1) % LUMINOSITY_CLASSES_GUIDE.length);
  };

  // Star Systems Carousel state
  const [activeStarSystemIndex, setActiveStarSystemIndex] = useState<number>(0);
  const [clusterMode, setClusterMode] = useState<'open' | 'globular'>('open');

  const handlePrevStarSystem = () => {
    isNavigatedByArrowRef.current = true;
    setActiveStarSystemIndex((prev) => (prev - 1 + STAR_SYSTEMS_GUIDE.length) % STAR_SYSTEMS_GUIDE.length);
  };

  const handleNextStarSystem = () => {
    isNavigatedByArrowRef.current = true;
    setActiveStarSystemIndex((prev) => (prev + 1) % STAR_SYSTEMS_GUIDE.length);
  };

  // Stellar Populations Carousel state
  const [activePopulationIndex, setActivePopulationIndex] = useState<number>(0);

  const handlePrevPopulation = () => {
    isNavigatedByArrowRef.current = true;
    setActivePopulationIndex((prev) => (prev - 1 + STELLAR_POPULATIONS_GUIDE.length) % STELLAR_POPULATIONS_GUIDE.length);
  };

  const handleNextPopulation = () => {
    isNavigatedByArrowRef.current = true;
    setActivePopulationIndex((prev) => (prev + 1) % STELLAR_POPULATIONS_GUIDE.length);
  };

  // Stellar Remnants Carousel state
  const [activeRemnantIndex, setActiveRemnantIndex] = useState<number>(0);

  const handlePrevRemnant = () => {
    isNavigatedByArrowRef.current = true;
    setActiveRemnantIndex((prev) => (prev - 1 + STELLAR_REMNANTS_GUIDE.length) % STELLAR_REMNANTS_GUIDE.length);
  };

  const handleNextRemnant = () => {
    isNavigatedByArrowRef.current = true;
    setActiveRemnantIndex((prev) => (prev + 1) % STELLAR_REMNANTS_GUIDE.length);
  };

  // Hypothetical Stars Carousel state
  const [activeHypotheticalIndex, setActiveHypotheticalIndex] = useState<number>(0);

  const handlePrevHypothetical = () => {
    isNavigatedByArrowRef.current = true;
    setActiveHypotheticalIndex((prev) => (prev - 1 + HYPOTHETICAL_STARS_GUIDE.length) % HYPOTHETICAL_STARS_GUIDE.length);
  };

  const handleNextHypothetical = () => {
    isNavigatedByArrowRef.current = true;
    setActiveHypotheticalIndex((prev) => (prev + 1) % HYPOTHETICAL_STARS_GUIDE.length);
  };

  useEffect(() => {
    if (!isNavigatedByArrowRef.current) return;
    isNavigatedByArrowRef.current = false;
    const activeBtn = document.getElementById(`btn-exotic-select-${activeExoticIndex}`);
    if (activeBtn && activeBtn.parentElement) {
      const container = activeBtn.parentElement;
      if (container.scrollWidth > container.clientWidth) {
        const targetScrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);
        container.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
      }
    }
  }, [activeExoticIndex]);

  useEffect(() => {
    if (!isNavigatedByArrowRef.current) return;
    isNavigatedByArrowRef.current = false;
    const activeBtn = document.getElementById(`btn-variable-select-${activeVariableIndex}`);
    if (activeBtn && activeBtn.parentElement) {
      const container = activeBtn.parentElement;
      if (container.scrollWidth > container.clientWidth) {
        const targetScrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);
        container.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
      }
    }
  }, [activeVariableIndex]);

  useEffect(() => {
    if (!isNavigatedByArrowRef.current) return;
    isNavigatedByArrowRef.current = false;
    const activeBtn = document.getElementById(`btn-yerkes-select-${activeYerkesIndex}`);
    if (activeBtn && activeBtn.parentElement) {
      const container = activeBtn.parentElement;
      if (container.scrollWidth > container.clientWidth) {
        const targetScrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);
        container.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
      }
    }
  }, [activeYerkesIndex]);

  useEffect(() => {
    if (!isNavigatedByArrowRef.current) return;
    isNavigatedByArrowRef.current = false;
    const activeBtn = document.getElementById(`btn-starsystem-select-${activeStarSystemIndex}`);
    if (activeBtn && activeBtn.parentElement) {
      const container = activeBtn.parentElement;
      if (container.scrollWidth > container.clientWidth) {
        const targetScrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);
        container.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
      }
    }
  }, [activeStarSystemIndex]);

  useEffect(() => {
    if (!isNavigatedByArrowRef.current) return;
    isNavigatedByArrowRef.current = false;
    const activeBtn = document.getElementById(`btn-population-select-${activePopulationIndex}`);
    if (activeBtn && activeBtn.parentElement) {
      const container = activeBtn.parentElement;
      if (container.scrollWidth > container.clientWidth) {
        const targetScrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);
        container.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
      }
    }
  }, [activePopulationIndex]);

  useEffect(() => {
    if (!isNavigatedByArrowRef.current) return;
    isNavigatedByArrowRef.current = false;
    const activeBtn = document.getElementById(`btn-remnant-select-${activeRemnantIndex}`);
    if (activeBtn && activeBtn.parentElement) {
      const container = activeBtn.parentElement;
      if (container.scrollWidth > container.clientWidth) {
        const targetScrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);
        container.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
      }
    }
  }, [activeRemnantIndex]);

  useEffect(() => {
    if (!isNavigatedByArrowRef.current) return;
    isNavigatedByArrowRef.current = false;
    const activeBtn = document.getElementById(`btn-hypothetical-select-${activeHypotheticalIndex}`);
    if (activeBtn && activeBtn.parentElement) {
      const container = activeBtn.parentElement;
      if (container.scrollWidth > container.clientWidth) {
        const targetScrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);
        container.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
      }
    }
  }, [activeHypotheticalIndex]);


  const [selectedSpectralClassId, setSelectedSpectralClassId] = useState<string>('class-g');

  // Spectral Card Navigation indices
  const currentSpectralIndex = useMemo(() => {
    const idx = SPECTRAL_CLASSES_GUIDE.findIndex((s) => s.id === selectedSpectralClassId);
    return idx >= 0 ? idx : 0;
  }, [selectedSpectralClassId]);

  const handlePrevSpectralClass = () => {
    isNavigatedByArrowRef.current = true;
    const prevIdx = (currentSpectralIndex - 1 + SPECTRAL_CLASSES_GUIDE.length) % SPECTRAL_CLASSES_GUIDE.length;
    setSelectedSpectralClassId(SPECTRAL_CLASSES_GUIDE[prevIdx].id);
  };

  const handleNextSpectralClass = () => {
    isNavigatedByArrowRef.current = true;
    const nextIdx = (currentSpectralIndex + 1) % SPECTRAL_CLASSES_GUIDE.length;
    setSelectedSpectralClassId(SPECTRAL_CLASSES_GUIDE[nextIdx].id);
  };

  useEffect(() => {
    if (!isNavigatedByArrowRef.current) return;
    isNavigatedByArrowRef.current = false;
    const spectralObj = SPECTRAL_CLASSES_GUIDE.find((s) => s.id === selectedSpectralClassId);
    if (!spectralObj) return;
    const activeBtn = document.getElementById(`btn-spectral-select-${spectralObj.code}`);
    if (activeBtn && activeBtn.parentElement) {
      const container = activeBtn.parentElement;
      if (container.scrollWidth > container.clientWidth) {
        const targetScrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);
        container.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
      }
    }
  }, [selectedSpectralClassId]);


  const activeSpectralItem = useMemo(() => {
    return SPECTRAL_CLASSES_GUIDE.find((s) => s.id === selectedSpectralClassId) || SPECTRAL_CLASSES_GUIDE[4];
  }, [selectedSpectralClassId]);


  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full text-slate-200">
      {/* Hero Banner: Stellar Classification Systems */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-6 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mobile-landscape:gap-2">
          <div className="space-y-1 sm:space-y-2 max-w-3xl">
            <h1 className="text-base sm:text-2xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-3">
              <Flame className="w-5 h-5 sm:w-7 sm:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-orange-400 shrink-0" />
              <span>Stellar Classification Systems</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
              From Annie Jump Cannon’s Harvard spectral sequence to the Yerkes luminosity matrix, explore the physical frameworks used by astrophysicists to organize stars by surface temperature, luminosity, chemistry, and evolutionary state.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 mobile-landscape:px-2 mobile-landscape:py-0.5 rounded-xl bg-orange-950/80 border border-orange-500/40 text-orange-300 font-mono text-[10px] sm:text-xs font-bold shadow-sm">
              8 Frameworks
            </span>
          </div>
        </div>
      </div>

      {/* Subsystem Switcher within Stellar Classification Systems */}
      <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-[#020512]/90 rounded-2xl border border-cyan-500/25 overflow-x-auto no-scrollbar shrink-0">
        {[
          { id: 0, label: 'Harvard Spectral Classes (OBAFGKM)' },
          { id: 1, label: 'Other Spectral Classes' },
          { id: 2, label: 'Variable Stars' },
          { id: 3, label: 'Yerkes Luminosity System (MKK)' },
          { id: 4, label: 'Star Systems' },
          { id: 5, label: 'Stellar Populations' },
          { id: 6, label: 'Stellar Remnants' },
          { id: 7, label: 'Hypothetical Stars' },
        ].map((sys) => (
          <button
            key={sys.id}
            id={`btn-classification-subsystem-${sys.id}`}
            onClick={() => setClassificationSystemIndex(sys.id)}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              classificationSystemIndex === sys.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {sys.label}
          </button>
        ))}
      </div>

          {/* ------------------------------------------------------------- */}
          {/* CAROUSEL PANEL 0: SPECTRAL CLASSES (OBAFGKM)                  */}
          {/* ------------------------------------------------------------- */}
          {classificationSystemIndex === 0 && (
            <div className="flex flex-col gap-3.5 sm:gap-5 animate-in fade-in duration-200">
              {/* Mnemonic Banner: Placed above the buttons */}
              <div className="p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl bg-[#030612]/90 border border-cyan-500/20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5 sm:gap-3.5 overflow-hidden shadow-sm">
                <div className="min-w-0 w-full lg:w-auto">
                  <span className="text-[9px] sm:text-[10px] md:text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-bold block">
                    The Universal Astronomy Mnemonic
                  </span>
                  <div className="text-[11px] sm:text-xs md:text-sm lg:text-[15px] font-black text-white mt-0.5 sm:mt-1 flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 items-center font-mono leading-relaxed">
                    <span className="text-[#4d88ff]">O (Oh)</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[#8cb5ff]">B (Be)</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[#d8e5ff]">A (A)</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[#fff2db]">F (Fine)</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[#ffefa6]">G (Girl/Guy)</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[#ffb366]">K (Kiss)</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[#ff5533]">M (Me)</span>
                  </div>
                </div>

                {/* Rainbow Spectrum Visual Bar */}
                <div
                  className="w-full lg:w-64 xl:w-80 h-2 sm:h-2.5 shrink-0 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-white/20 mt-1 lg:mt-0"
                  style={{
                    background: 'linear-gradient(90deg, #4d88ff 0%, #8cb5ff 16.6%, #d8e5ff 33.3%, #fff2db 50%, #ffefa6 66.6%, #ffb366 83.3%, #ff5533 100%)',
                  }}
                />
              </div>

              {/* Spectral Class Quick Selector Buttons with Mnemonics */}
              <div className="w-full">
                <div className="flex items-stretch gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-cyan-500/30 w-full max-w-full py-1 sm:py-1.5">
                  {SPECTRAL_CLASSES_GUIDE.map((item) => {
                    const isSelected = item.id === selectedSpectralClassId;
                    return (
                      <button
                        key={item.id}
                        id={`btn-spectral-select-${item.code}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSelectedSpectralClassId(item.id);
                        }}
                        className={`p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between relative group shrink-0 min-w-[95px] sm:min-w-[120px] max-w-[160px] h-[52px] sm:h-[64px] min-h-[52px] max-h-[52px] sm:min-h-[64px] sm:max-h-[64px] ${
                          isSelected
                            ? 'bg-[#09132e] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-inset ring-cyan-400 z-10'
                            : 'bg-[#040816]/90 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#070f24] hover:z-[5]'
                        }`}
                        title={`Spectral Class ${item.code} (${item.mnemonicWord}) • ${item.temperatureKelvin}`}
                      >
                        <div className="w-full min-w-0 text-left leading-tight">
                          <RunningText
                            text={item.mnemonicWord}
                            className="text-[9px] sm:text-[11px] font-bold text-cyan-300/90 group-hover:text-cyan-200"
                          />
                        </div>

                        <div className="flex items-center justify-between w-full min-w-0 gap-1">
                          <span
                            className="text-sm sm:text-xl font-black font-mono leading-none drop-shadow-[0_0_8px_currentColor]"
                            style={{ color: item.colorHex }}
                          >
                            {item.code}
                          </span>
                          <span
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-white/40 shadow-sm shrink-0"
                            style={{ backgroundColor: item.colorHex }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stellar Classification Card - Carousel UI */}
              <div className="w-full max-w-full p-3 sm:p-5 lg:p-6 rounded-2xl bg-[#040816]/95 border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3 sm:gap-5 relative">
                {/* Header with Carousel Navigation & Quick Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-cyan-500/15 pb-2.5 sm:pb-4 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    {/* Left Carousel Arrow Button directly on Card */}
                    <button
                      type="button"
                      id="btn-card-carousel-prev"
                      onClick={handlePrevSpectralClass}
                      className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                      title="Previous spectral class card"
                      aria-label="Previous card"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    <div
                      className="w-8 h-8 sm:w-12 sm:h-12 shrink-0 aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center font-black font-mono text-base sm:text-2xl shadow-xl border border-white/30"
                      style={{
                        backgroundColor: activeSpectralItem.colorHex,
                        color: '#02040a',
                        boxShadow: `0 0 20px ${activeSpectralItem.colorHex}66`,
                      }}
                    >
                      {activeSpectralItem.code}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <RunningText
                          text={activeSpectralItem.name}
                          className="text-sm sm:text-lg lg:text-xl font-bold text-white"
                        />
                        <span className="text-[10px] font-mono text-cyan-400/90 font-semibold shrink-0">
                          ({currentSpectralIndex + 1}/7)
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-400 italic mt-0.5 truncate">
                        "{activeSpectralItem.simpleAnalogy}" • {activeSpectralItem.temperatureKelvin}
                      </p>
                    </div>

                    {/* Right Carousel Arrow Button directly on Card */}
                    <button
                      type="button"
                      id="btn-card-carousel-next"
                      onClick={handleNextSpectralClass}
                      className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                      title="Next spectral class card"
                      aria-label="Next card"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  {/* Action Button: Filter Catalog */}
                  {onJumpToCatalogFilter && (
                    <button
                      id="btn-filter-by-spectral-class"
                      onClick={() => onJumpToCatalogFilter(activeSpectralItem.code)}
                      className="flex items-center justify-center gap-1 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-[10px] sm:text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm shrink-0 self-end sm:self-auto"
                    >
                      <Grid className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Filter Type {activeSpectralItem.code}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  )}
                </div>

                {/* Unified One-Panel Format: Side-by-side columns on landscape/larger screens, natural stacked on portrait */}
                <div className="grid grid-cols-1 mobile-landscape:grid-cols-12 md:grid-cols-12 lg:grid-cols-12 gap-5 sm:gap-6 items-start min-w-0">
                  {/* Left Column: Physical Nature & Appearance + Key Astronomical Facts */}
                  <div className="mobile-landscape:col-span-6 md:col-span-6 lg:col-span-6 flex flex-col gap-4 min-w-0">
                    <div className="min-w-0">
                      <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1.5 tracking-wider">
                        Physical Nature &amp; Appearance
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words">
                        {activeSpectralItem.plainEnglishExplanation}
                      </p>
                    </div>

                    <div className="space-y-2 min-w-0">
                      <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
                        Key Astronomical Facts
                      </h4>
                      <div className="grid grid-cols-1 gap-1.5 sm:gap-2 min-w-0">
                        {activeSpectralItem.keyFacts.map((fact, idx) => (
                          <div
                            key={idx}
                            className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 text-[11px] sm:text-xs text-slate-300 flex items-start gap-2 min-w-0"
                          >
                            <span className="text-cyan-400 font-bold font-mono mt-0.5 shrink-0">•</span>
                            <span className="break-words min-w-0">{fact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Physical Properties Grid & Mapped Stars */}
                  <div className="mobile-landscape:col-span-6 md:col-span-6 lg:col-span-6 flex flex-col gap-3.5 sm:gap-4 min-w-0">
                    <div className="min-w-0">
                      <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1.5 tracking-wider">
                        Astrophysical Profile
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono min-w-0">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                          <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Temperature</span>
                          <span className="text-white font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeSpectralItem.temperatureKelvin}</span>
                        </div>
                        <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                          <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Abundance</span>
                          <span className="text-cyan-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeSpectralItem.abundanceMilkyWay}</span>
                        </div>
                        <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                          <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Lifespan</span>
                          <span className="text-amber-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeSpectralItem.typicalLifespan}</span>
                        </div>
                        <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                          <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Mass Range</span>
                          <span className="text-slate-200 text-[11px] sm:text-sm break-words whitespace-normal">{activeSpectralItem.massRangeSolar}</span>
                        </div>
                      </div>
                    </div>

                    {/* Mapped Stars from Catalog */}
                    <ClassificationMappedStarsSection
                      title={`Mapped Type ${activeSpectralItem.code} Stars`}
                      categoryColor={activeSpectralItem.colorHex}
                      allMappedStars={getMappedStarsForHarvard(activeSpectralItem.code, STARS_CATALOG)}
                      onSelectStar={onSelectStar}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* CAROUSEL PANEL 1: OTHER SPECTRAL CLASSES                      */}
          {/* ------------------------------------------------------------- */}
          {classificationSystemIndex === 1 && (
            <div className="flex flex-col gap-3.5 sm:gap-5 animate-in fade-in duration-200">
              {/* Other Spectral Classes Quick Selector Buttons */}
              <div className="flex items-stretch gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-cyan-500/30 w-full max-w-full py-1 sm:py-1.5">
                {EXOTIC_CLASSES_GUIDE.map((item, idx) => {
                  const isSelected = idx === activeExoticIndex;
                  return (
                    <button
                      key={item.code}
                      id={`btn-exotic-select-${idx}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setActiveExoticIndex(idx);
                      }}
                      className={`p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between relative group shrink-0 min-w-[125px] sm:min-w-[145px] max-w-[185px] h-[52px] sm:h-[64px] min-h-[52px] max-h-[52px] sm:min-h-[64px] sm:max-h-[64px] ${
                        isSelected
                          ? 'bg-[#09132e] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-inset ring-cyan-400 z-10'
                          : 'bg-[#040816]/90 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#070f24] hover:z-[5]'
                      }`}
                      title={`${item.buttonTitle} (${item.abbreviation})`}
                    >
                      <div className="w-full min-w-0 text-left leading-tight">
                        <RunningText
                          text={item.buttonTitle}
                          className="text-[9px] sm:text-[11px] font-bold text-cyan-300/90 group-hover:text-cyan-200"
                        />
                      </div>

                      <div className="flex items-center justify-between w-full min-w-0 gap-1">
                        <span
                          className="text-xs sm:text-base font-black font-mono leading-none drop-shadow-[0_0_8px_currentColor]"
                          style={{ color: item.colorHex }}
                        >
                          {item.abbreviation}
                        </span>
                        <span
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-white/40 shadow-sm shrink-0"
                          style={{ backgroundColor: item.colorHex }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Stellar Classification Card - Carousel UI */}
              {(() => {
                const activeExoticItem = EXOTIC_CLASSES_GUIDE[activeExoticIndex] || EXOTIC_CLASSES_GUIDE[0];
                const filterableCode = (() => {
                  const supported: string[] = ['WR', 'LBV', 'WD', 'NS', 'C', 'S', 'L', 'T', 'Y'];
                  return supported.find((sc) => activeExoticItem.code.includes(sc));
                })();

                return (
                  <div className="w-full max-w-full p-3 sm:p-5 lg:p-6 rounded-2xl bg-[#040816]/95 border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3 sm:gap-5 relative">
                    {/* Header with Carousel Navigation & Quick Filter */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-cyan-500/15 pb-2.5 sm:pb-4 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        {/* Left Carousel Arrow Button directly on Card */}
                        <button
                          type="button"
                          id="btn-card-carousel-exotic-prev"
                          onClick={handlePrevExotic}
                          className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                          title="Previous exotic class card"
                          aria-label="Previous card"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        <div
                          className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center font-black font-mono text-xs sm:text-base shadow-xl border border-white/30"
                          style={{
                            backgroundColor: activeExoticItem.colorHex,
                            color: '#02040a',
                            boxShadow: `0 0 20px ${activeExoticItem.colorHex}66`,
                          }}
                        >
                          {activeExoticItem.abbreviation}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <RunningText
                              text={activeExoticItem.name}
                              className="text-sm sm:text-lg lg:text-xl font-bold text-white"
                            />
                            <span className="text-[10px] font-mono text-cyan-400/90 font-semibold shrink-0">
                              ({activeExoticIndex + 1}/{EXOTIC_CLASSES_GUIDE.length})
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-400 italic mt-0.5 truncate">
                            {activeExoticItem.category} • {activeExoticItem.temperature}
                          </p>
                        </div>

                        {/* Right Carousel Arrow Button directly on Card */}
                        <button
                          type="button"
                          id="btn-card-carousel-exotic-next"
                          onClick={handleNextExotic}
                          className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                          title="Next exotic class card"
                          aria-label="Next card"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      {/* Action Button: Filter Catalog if applicable, else Open Catalog */}
                      {onJumpToCatalogFilter && filterableCode ? (
                        <button
                          id="btn-filter-by-exotic-class"
                          onClick={() => onJumpToCatalogFilter(filterableCode)}
                          className="flex items-center justify-center gap-1 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-[10px] sm:text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm shrink-0 self-end sm:self-auto"
                        >
                          <Grid className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>Filter Type {filterableCode}</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      ) : onJumpToCatalog ? (
                        <button
                          onClick={onJumpToCatalog}
                          className="flex items-center justify-center gap-1 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-[10px] sm:text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm shrink-0 self-end sm:self-auto"
                        >
                          <Grid className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>Open Catalog</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      ) : null}
                    </div>

                    {/* Unified One-Panel Format: Side-by-side columns on landscape/larger screens, natural stacked on portrait */}
                    <div className="grid grid-cols-1 mobile-landscape:grid-cols-12 md:grid-cols-12 lg:grid-cols-12 gap-5 sm:gap-6 items-start min-w-0">
                      {/* Left Column: Physical Nature & Origin + Distinguishing Features */}
                      <div className="mobile-landscape:col-span-6 md:col-span-6 lg:col-span-6 flex flex-col gap-4 min-w-0">
                        <div className="min-w-0">
                          <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1.5 tracking-wider">
                            Physical Nature &amp; Origin
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words">
                            {activeExoticItem.explanation}
                          </p>
                        </div>

                        {activeExoticItem.distinguishingFeatures && activeExoticItem.distinguishingFeatures.length > 0 && (
                          <div className="space-y-2 min-w-0">
                            <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
                              Distinguishing Features
                            </h4>
                            <div className="grid grid-cols-1 gap-1.5 sm:gap-2 min-w-0">
                              {activeExoticItem.distinguishingFeatures.map((feat, idx) => (
                                <div
                                  key={idx}
                                  className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 text-[11px] sm:text-xs text-slate-300 flex items-start gap-2 min-w-0"
                                >
                                  <span className="text-cyan-400 font-bold font-mono mt-0.5 shrink-0">•</span>
                                  <span className="break-words min-w-0">{feat}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column: Astrophysical Profile, Mapped Stars, Benchmarks */}
                      <div className="mobile-landscape:col-span-6 md:col-span-6 lg:col-span-6 flex flex-col gap-3.5 sm:gap-4 min-w-0">
                        <div className="min-w-0">
                          <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1.5 tracking-wider">
                            Astrophysical Profile
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono min-w-0">
                            <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                              <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Category</span>
                              <span className="text-white font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeExoticItem.category}</span>
                            </div>
                            <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                              <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Temperature</span>
                              <span className="text-cyan-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeExoticItem.temperature}</span>
                            </div>
                            <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0 sm:col-span-2">
                              <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Classification Tag</span>
                              <span className="text-amber-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeExoticItem.tag}</span>
                            </div>
                          </div>
                        </div>

                        {/* Mapped Stars from Catalog */}
                        <ClassificationMappedStarsSection
                          title={`Mapped ${activeExoticItem.name}`}
                          categoryColor={activeExoticItem.colorHex}
                          allMappedStars={getMappedStarsForExotic(activeExoticItem.code, STARS_CATALOG)}
                          onSelectStar={onSelectStar}
                        />

                        {/* External Observational Benchmarks if applicable */}
                        {activeExoticItem.externalExamples && activeExoticItem.externalExamples.length > 0 && (
                          <div className="p-2.5 sm:p-3 rounded-xl bg-[#020512] border border-cyan-500/20 min-w-0">
                            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-cyan-400 font-bold block mb-1.5 break-words">
                              Observational Benchmarks:
                            </span>
                            <div className="flex flex-wrap gap-1 min-w-0">
                              {activeExoticItem.externalExamples.map((ext, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 break-words whitespace-normal leading-normal"
                                >
                                  {ext}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* CAROUSEL PANEL 2: VARIABLE STARS                              */}
          {/* ------------------------------------------------------------- */}
          {classificationSystemIndex === 2 && (
            <div className="flex flex-col gap-3.5 sm:gap-5 animate-in fade-in duration-200">
              {/* Introduction Banner: "What are variable stars?" */}
              <div className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-r from-[#04091e] via-[#071330] to-[#04091e] border border-cyan-500/30 shadow-[0_4px_24px_rgba(6,182,212,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 relative overflow-hidden">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-300 border border-cyan-400/30">
                      Astrophysical Overview
                    </span>
                    <h3 className="text-sm sm:text-lg font-bold text-white font-sans">
                      What Are Variable Stars?
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    Variable stars are stars whose apparent brightness fluctuates over time as viewed from Earth. Luminosity swings range from subtle fractions of a percent to explosive thousands-fold outbursts, spanning periods of seconds to centuries. Astrophysics classifies them into <span className="text-cyan-300 font-semibold">Intrinsic Variables</span> (physical changes in the star itself, such as thermodynamic pulsation cycles in <span className="text-amber-300">Cepheids</span> and <span className="text-amber-300">Miras</span> driven by the helium ionization opacity valve, or cataclysmic nova outbursts) and <span className="text-cyan-300 font-semibold">Extrinsic Variables</span> (geometric factors, such as rotational starspots or eclipsing companion orbits).
                  </p>
                </div>
              </div>

              {/* Variable Stars Quick Selector Buttons (Consistent size) */}
              <div className="flex items-stretch gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-cyan-500/30 w-full max-w-full py-1 sm:py-1.5">
                {VARIABLE_STARS_GUIDE.map((item, idx) => {
                  const isSelected = idx === activeVariableIndex;
                  return (
                    <button
                      key={item.id}
                      id={`btn-variable-select-${idx}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setActiveVariableIndex(idx);
                      }}
                      className={`p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between relative group shrink-0 min-w-[130px] sm:min-w-[150px] max-w-[190px] h-[52px] sm:h-[64px] min-h-[52px] max-h-[52px] sm:min-h-[64px] sm:max-h-[64px] ${
                        isSelected
                          ? 'bg-[#09132e] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-inset ring-cyan-400 z-10'
                          : 'bg-[#040816]/90 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#070f24] hover:z-[5]'
                      }`}
                      title={item.buttonTitle}
                    >
                      <div className="w-full min-w-0 text-left leading-tight">
                        <span className="text-[8px] sm:text-[9.5px] font-mono text-cyan-400/80 uppercase truncate block">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between w-full min-w-0 gap-1">
                        <RunningText
                          text={item.buttonTitle}
                          className="text-[10px] sm:text-xs font-bold text-white group-hover:text-cyan-200"
                        />
                        <span
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-white/40 shadow-sm shrink-0 ml-1"
                          style={{ backgroundColor: item.colorHex }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Variable Stars Card - Carousel UI */}
              {(() => {
                const activeVariableItem = VARIABLE_STARS_GUIDE[activeVariableIndex] || VARIABLE_STARS_GUIDE[0];
                const mappedVariableStars = getMappedStarsForVariable(activeVariableItem.id, STARS_CATALOG);
                const archetypeStar = mappedVariableStars[0] || null;

                return (
                  <div className="w-full max-w-full p-3 sm:p-5 lg:p-6 rounded-2xl bg-[#040816]/95 border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3 sm:gap-5 relative">
                    {/* Header with Carousel Navigation & Quick Actions (No icon box) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-cyan-500/15 pb-2.5 sm:pb-4 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <button
                          type="button"
                          id="btn-card-carousel-variable-prev"
                          onClick={handlePrevVariable}
                          className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                          title="Previous variable star type"
                          aria-label="Previous card"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <RunningText
                              text={activeVariableItem.name}
                              className="text-sm sm:text-lg lg:text-xl font-bold text-white"
                            />
                            <span className="text-[10px] font-mono text-cyan-400/90 font-semibold shrink-0">
                              ({activeVariableIndex + 1}/{VARIABLE_STARS_GUIDE.length})
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-400 italic mt-0.5 truncate">
                            {activeVariableItem.category} • {activeVariableItem.periodRange}
                          </p>
                        </div>

                        <button
                          type="button"
                          id="btn-card-carousel-variable-next"
                          onClick={handleNextVariable}
                          className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                          title="Next variable star type"
                          aria-label="Next card"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      {onJumpToCatalog && (
                        <button
                          onClick={onJumpToCatalog}
                          className="flex items-center justify-center gap-1 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-[10px] sm:text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm shrink-0 self-end sm:self-auto"
                        >
                          <Grid className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>Explore Catalog</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      )}
                    </div>

                    {/* Dossier-Style Split: Left/Top = Variable Star Graphic ONLY (Non-hideable), Right/Bottom = All Info */}
                    <div className="flex flex-col mobile-landscape:flex-row lg:flex-row gap-3 sm:gap-6 min-w-0 items-stretch mobile-landscape:h-[calc(100vh-90px)] mobile-landscape:min-h-[225px] mobile-landscape:max-h-[265px] lg:h-[480px] xl:h-[520px] lg:min-h-[440px] lg:max-h-[600px] overflow-hidden">
                      {/* Left / Top Column: Variable Star Visual Graphic ONLY (Non-Hideable, top-aligned and not horizontally centered) */}
                      <div className="w-full mobile-landscape:w-5/12 lg:w-5/12 mobile-landscape:h-full lg:h-full flex flex-col items-start justify-start min-w-0 mobile-landscape:overflow-hidden lg:overflow-hidden p-0 sm:p-1">
                        <div className="w-full mobile-landscape:w-auto mobile-landscape:h-full mobile-landscape:max-h-full max-w-[380px] sm:max-w-[420px] mobile-landscape:max-w-full lg:w-auto lg:h-full lg:max-h-[460px] lg:max-w-[460px] aspect-square rounded-2xl overflow-hidden border border-cyan-500/35 bg-[#02040e] shadow-[0_0_35px_rgba(0,0,0,0.85)] relative self-start shrink-0">
                          <VariableStarGraphic
                            variableId={activeVariableItem.id}
                            archetypeStar={archetypeStar}
                            colorHex={activeVariableItem.colorHex}
                          />
                        </div>
                      </div>

                      {/* Right / Bottom Column: All Info (Scrollable with bounded container) */}
                      <div className="w-full mobile-landscape:w-7/12 lg:w-7/12 mobile-landscape:h-full lg:h-full overflow-y-auto scrollbar-thin flex flex-col justify-start gap-3 sm:gap-4 min-w-0 pr-1">
                        {/* Detached Real-Time Activity Monitor & Light Curve Telemetry at Top of Right Panel */}
                        <VariableStarActivityMonitor
                          variableId={activeVariableItem.id}
                          colorHex={activeVariableItem.colorHex}
                        />

                        {/* Astrophysical Profile Quick Stats */}
                        <div className="w-full grid grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono min-w-0">
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Category</span>
                            <span className="text-white font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeVariableItem.category}</span>
                          </div>
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Cycle Period</span>
                            <span className="text-cyan-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeVariableItem.periodRange}</span>
                          </div>
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0 col-span-2">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Archetype Star</span>
                            <span className="text-amber-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal flex items-center gap-1.5">
                              {archetypeStar ? (
                                <span>{archetypeStar.name} ({archetypeStar.spectralType})</span>
                              ) : (
                                activeVariableItem.tag
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="min-w-0 space-y-3">
                          <div>
                            <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1">
                              Variability Nature &amp; Behavior
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words">
                              {activeVariableItem.explanation}
                            </p>
                          </div>

                          <div className="p-2.5 sm:p-3 rounded-xl bg-[#020512] border border-cyan-500/20">
                            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-amber-300 font-bold block mb-1">
                              Physical Driving Mechanism:
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed break-words">
                              {activeVariableItem.mechanism}
                            </p>
                          </div>
                        </div>

                        {activeVariableItem.distinguishingFeatures && activeVariableItem.distinguishingFeatures.length > 0 && (
                          <div className="space-y-1.5 sm:space-y-2 min-w-0">
                            <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
                              Key Observational Characteristics
                            </h4>
                            <div className="grid grid-cols-1 gap-1 sm:gap-2 min-w-0">
                              {activeVariableItem.distinguishingFeatures.map((feat, idx) => (
                                <div
                                  key={idx}
                                  className="p-1.5 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 text-[11px] sm:text-xs text-slate-300 flex items-start gap-1.5 sm:gap-2 min-w-0"
                                >
                                  <span className="text-cyan-400 font-bold font-mono mt-0.5 shrink-0">•</span>
                                  <span className="break-words min-w-0">{feat}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Mapped Stars from Catalog */}
                        <ClassificationMappedStarsSection
                          title={`Mapped ${activeVariableItem.name}`}
                          categoryColor={activeVariableItem.colorHex}
                          allMappedStars={mappedVariableStars}
                          onSelectStar={onSelectStar}
                        />

                        {/* Observational Benchmarks */}
                        {activeVariableItem.externalExamples && activeVariableItem.externalExamples.length > 0 && (
                          <div className="mt-0.5 sm:mt-1 p-2 sm:p-3 rounded-xl bg-[#020512] border border-cyan-500/20 min-w-0">
                            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-cyan-400 font-bold block mb-1 break-words">
                              Notable Archetypes:
                            </span>
                            <div className="flex flex-wrap gap-1 min-w-0">
                              {activeVariableItem.externalExamples.map((ext, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 break-words whitespace-normal leading-normal"
                                >
                                  {ext}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* CAROUSEL PANEL 3: YERKES LUMINOSITY SYSTEM                    */}
          {/* ------------------------------------------------------------- */}
          {classificationSystemIndex === 3 && (
            <div className="flex flex-col gap-3.5 sm:gap-5 animate-in fade-in duration-200">
              {/* Yerkes Luminosity Class Quick Selector Buttons */}
              <div className="flex items-stretch gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-cyan-500/30 w-full max-w-full py-1 sm:py-1.5">
                {LUMINOSITY_CLASSES_GUIDE.map((item, idx) => {
                  const isSelected = idx === activeYerkesIndex;
                  const itemColor = item.colorHex || '#38bdf8';
                  return (
                    <button
                      key={item.id}
                      id={`btn-yerkes-select-${idx}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setActiveYerkesIndex(idx);
                      }}
                      className={`p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between relative group shrink-0 min-w-[125px] sm:min-w-[145px] max-w-[185px] h-[52px] sm:h-[64px] min-h-[52px] max-h-[52px] sm:min-h-[64px] sm:max-h-[64px] ${
                        isSelected
                          ? 'bg-[#09132e] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-inset ring-cyan-400 z-10'
                          : 'bg-[#040816]/90 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#070f24] hover:z-[5]'
                      }`}
                      title={`${item.buttonTitle} (Class ${item.abbreviation})`}
                    >
                      <div className="w-full min-w-0 text-left leading-tight">
                        <RunningText
                          text={item.buttonTitle}
                          className="text-[9px] sm:text-[11px] font-bold text-cyan-300/90 group-hover:text-cyan-200"
                        />
                      </div>

                      <div className="flex items-center justify-between w-full min-w-0 gap-1">
                        <span
                          className="text-xs sm:text-base font-black font-mono leading-none drop-shadow-[0_0_8px_currentColor]"
                          style={{ color: itemColor }}
                        >
                          {item.abbreviation}
                        </span>
                        <span
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-white/40 shadow-sm shrink-0"
                          style={{ backgroundColor: itemColor }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Stellar Classification Card - Carousel UI */}
              {(() => {
                const activeYerkesItem = LUMINOSITY_CLASSES_GUIDE[activeYerkesIndex] || LUMINOSITY_CLASSES_GUIDE[0];

                return (
                  <div className="w-full max-w-full p-3 sm:p-5 lg:p-6 rounded-2xl bg-[#040816]/95 border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3 sm:gap-5 relative">
                    {/* Header with Carousel Navigation & Quick Filter */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-cyan-500/15 pb-2.5 sm:pb-4 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        {/* Left Carousel Arrow Button directly on Card */}
                        <button
                          type="button"
                          id="btn-card-carousel-yerkes-prev"
                          onClick={handlePrevYerkes}
                          className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                          title="Previous luminosity class card"
                          aria-label="Previous card"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        <div
                          className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center font-black font-mono text-xs sm:text-base shadow-xl border border-white/30"
                          style={{
                            backgroundColor: activeYerkesItem.colorHex || '#38bdf8',
                            color: '#02040a',
                            boxShadow: `0 0 20px ${(activeYerkesItem.colorHex || '#38bdf8')}66`,
                          }}
                        >
                          {activeYerkesItem.abbreviation}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <RunningText
                              text={activeYerkesItem.title}
                              className="text-sm sm:text-lg lg:text-xl font-bold text-white"
                            />
                            <span className="text-[10px] font-mono text-cyan-400/90 font-semibold shrink-0">
                              ({activeYerkesIndex + 1}/{LUMINOSITY_CLASSES_GUIDE.length})
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-400 italic mt-0.5 truncate">
                            Category: {activeYerkesItem.category.replace('-', ' ')} • Yerkes Class {activeYerkesItem.romanNumeral}
                          </p>
                        </div>

                        {/* Right Carousel Arrow Button directly on Card */}
                        <button
                          type="button"
                          id="btn-card-carousel-yerkes-next"
                          onClick={handleNextYerkes}
                          className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                          title="Next luminosity class card"
                          aria-label="Next card"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      {onJumpToCatalog && (
                        <button
                          onClick={onJumpToCatalog}
                          className="flex items-center justify-center gap-1 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-[10px] sm:text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm shrink-0 self-end sm:self-auto"
                        >
                          <Grid className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>Open Catalog</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      )}
                    </div>

                    {/* Unified One-Panel Format: Side-by-side columns on landscape/larger screens, natural stacked on portrait */}
                    <div className="grid grid-cols-1 mobile-landscape:grid-cols-12 md:grid-cols-12 lg:grid-cols-12 gap-5 sm:gap-6 items-start min-w-0">
                      {/* Left Column: Spectroscopic Line Profile & Nature + Physical Mechanism */}
                      <div className="mobile-landscape:col-span-6 md:col-span-6 lg:col-span-6 flex flex-col gap-4 min-w-0">
                        <div className="min-w-0">
                          <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1.5 tracking-wider">
                            Spectroscopic Line Profile &amp; Nature
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words">
                            {activeYerkesItem.plainEnglishExplanation}
                          </p>
                        </div>

                        <div className="space-y-2 min-w-0">
                          <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
                            Physical Mechanism &amp; How It Works
                          </h4>
                          <div className="p-2.5 sm:p-3 rounded-xl bg-[#020512] border border-cyan-500/15 text-[11px] sm:text-xs text-slate-300 leading-relaxed break-words">
                            {activeYerkesItem.howItWorks}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Luminosity Profile & Example Stars */}
                      <div className="mobile-landscape:col-span-6 md:col-span-6 lg:col-span-6 flex flex-col gap-3.5 sm:gap-4 min-w-0">
                        <div className="min-w-0">
                          <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1.5 tracking-wider">
                            Astrophysical Profile
                          </h4>
                          <div className="grid grid-cols-1 gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono min-w-0">
                            <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                              <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Core Energy Source</span>
                              <span className="text-amber-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal leading-relaxed">{activeYerkesItem.coreEnergySource}</span>
                            </div>
                            <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                              <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Typical Stellar Size</span>
                              <span className="text-slate-200 font-bold text-[11px] sm:text-sm break-words whitespace-normal leading-relaxed">{activeYerkesItem.typicalSizeComparison}</span>
                            </div>
                            <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                              <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Stellar Fate</span>
                              <span className="text-cyan-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal leading-relaxed">{activeYerkesItem.fate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Mapped Stars from Catalog */}
                        <ClassificationMappedStarsSection
                          title={`Mapped Class ${activeYerkesItem.romanNumeral} Stars`}
                          categoryColor={activeYerkesItem.colorHex || '#38bdf8'}
                          allMappedStars={getMappedStarsForYerkes(activeYerkesItem.romanNumeral, STARS_CATALOG)}
                          onSelectStar={onSelectStar}
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* CAROUSEL PANEL 4: STAR SYSTEMS                                */}
          {/* ------------------------------------------------------------- */}
          {classificationSystemIndex === 4 && (
            <div className="flex flex-col gap-3.5 sm:gap-5 animate-in fade-in duration-200">
              {/* Introduction Banner: "What are star systems?" */}
              <div className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-r from-[#04091e] via-[#071330] to-[#04091e] border border-cyan-500/30 shadow-[0_4px_24px_rgba(6,182,212,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 relative overflow-hidden">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-300 border border-cyan-400/30">
                      Astrophysical Overview
                    </span>
                    <h3 className="text-sm sm:text-lg font-bold text-white font-sans">
                      What Are Star Systems?
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    Star systems are gravitationally bound celestial configurations ranging from close binary pairs co-orbiting their mutual center of mass (barycenter) to complex hierarchical multiple architectures (<span className="text-cyan-300 font-semibold">triples</span>, <span className="text-cyan-300 font-semibold">quadruples</span>, up to <span className="text-amber-300 font-semibold">sextuple systems</span> like Castor), <span className="text-cyan-300 font-semibold">exoplanet architectures</span>, and massive <span className="text-amber-300 font-semibold">star clusters</span> containing hundreds of thousands of co-eval stellar members bound in a shared gravitational potential.
                  </p>
                </div>
              </div>

              {/* Star Systems Quick Selector Buttons */}
              <div className="flex items-stretch gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-cyan-500/30 w-full max-w-full py-1 sm:py-1.5">
                {STAR_SYSTEMS_GUIDE.map((item, idx) => {
                  const isSelected = idx === activeStarSystemIndex;
                  return (
                    <button
                      key={item.id}
                      id={`btn-starsystem-select-${idx}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setActiveStarSystemIndex(idx);
                      }}
                      className={`p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between relative group shrink-0 min-w-[130px] sm:min-w-[150px] max-w-[190px] h-[52px] sm:h-[64px] min-h-[52px] max-h-[52px] sm:min-h-[64px] sm:max-h-[64px] ${
                        isSelected
                          ? 'bg-[#09132e] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-inset ring-cyan-400 z-10'
                          : 'bg-[#040816]/90 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#070f24] hover:z-[5]'
                      }`}
                      title={item.buttonTitle}
                    >
                      <div className="w-full min-w-0 text-left leading-tight">
                        <span className="text-[8px] sm:text-[9.5px] font-mono text-cyan-400/80 uppercase truncate block">
                          {item.multiplicity}
                        </span>
                      </div>

                      <div className="flex items-center justify-between w-full min-w-0 gap-1">
                        <RunningText
                          text={item.buttonTitle}
                          className="text-[10px] sm:text-xs font-bold text-white group-hover:text-cyan-200"
                        />
                        <span
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-white/40 shadow-sm shrink-0 ml-1"
                          style={{ backgroundColor: item.colorHex }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Star Systems Card - Carousel UI */}
              {(() => {
                const activeStarSystemItem = STAR_SYSTEMS_GUIDE[activeStarSystemIndex] || STAR_SYSTEMS_GUIDE[0];
                const mappedSystemStars = getMappedStarsForStarSystem(activeStarSystemItem.id, STARS_CATALOG);
                const archetypeStar = mappedSystemStars[0] || null;

                return (
                  <div className="w-full max-w-full p-3 sm:p-5 lg:p-6 rounded-2xl bg-[#040816]/95 border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3 sm:gap-5 relative">
                    {/* Header with Carousel Navigation & Quick Actions (Clean styling matching Variable Stars) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-cyan-500/15 pb-2.5 sm:pb-4 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <button
                          type="button"
                          id="btn-card-carousel-starsystem-prev"
                          onClick={handlePrevStarSystem}
                          className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                          title="Previous star system type"
                          aria-label="Previous card"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <RunningText
                              text={activeStarSystemItem.name}
                              className="text-sm sm:text-lg lg:text-xl font-bold text-white"
                            />
                            <span className="text-[10px] font-mono text-cyan-400/90 font-semibold shrink-0">
                              ({activeStarSystemIndex + 1}/{STAR_SYSTEMS_GUIDE.length})
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-400 italic mt-0.5 truncate">
                            {activeStarSystemItem.category} • Multiplicity: {activeStarSystemItem.multiplicity}
                          </p>
                        </div>

                        <button
                          type="button"
                          id="btn-card-carousel-starsystem-next"
                          onClick={handleNextStarSystem}
                          className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                          title="Next star system type"
                          aria-label="Next card"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      {onJumpToCatalog && (
                        <button
                          onClick={onJumpToCatalog}
                          className="flex items-center justify-center gap-1 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-[10px] sm:text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm shrink-0 self-end sm:self-auto"
                        >
                          <Grid className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>Explore Catalog</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      )}
                    </div>

                    {/* Dossier-Style Split matching Variable Stars: Left/Top = Star System Graphic ONLY, Right/Bottom = All Info */}
                    <div className="flex flex-col mobile-landscape:flex-row lg:flex-row gap-3 sm:gap-6 min-w-0 items-stretch mobile-landscape:h-[calc(100vh-90px)] mobile-landscape:min-h-[225px] mobile-landscape:max-h-[265px] lg:h-[480px] xl:h-[520px] lg:min-h-[440px] lg:max-h-[600px] overflow-hidden">
                      {/* Left / Top Column: Star System Visual Graphic ONLY (Non-Hideable, top-aligned and bounded) */}
                      <div className="w-full mobile-landscape:w-5/12 lg:w-5/12 mobile-landscape:h-full lg:h-full flex flex-col items-start justify-start min-w-0 mobile-landscape:overflow-hidden lg:overflow-hidden p-0 sm:p-1">
                        <div className="w-full mobile-landscape:w-auto mobile-landscape:h-full mobile-landscape:max-h-full max-w-[380px] sm:max-w-[420px] mobile-landscape:max-w-full lg:w-auto lg:h-full lg:max-h-[460px] lg:max-w-[460px] aspect-square rounded-2xl overflow-hidden border border-cyan-500/35 bg-[#02040e] shadow-[0_0_35px_rgba(0,0,0,0.85)] relative self-start shrink-0">
                          <StarSystemGraphic
                            systemId={activeStarSystemItem.id}
                            archetypeStar={archetypeStar}
                            colorHex={activeStarSystemItem.colorHex}
                            clusterMode={clusterMode}
                            onClusterModeChange={setClusterMode}
                          />
                        </div>
                      </div>

                      {/* Right / Bottom Column: All Info (Scrollable with bounded container) */}
                      <div className="w-full mobile-landscape:w-7/12 lg:w-7/12 mobile-landscape:h-full lg:h-full overflow-y-auto scrollbar-thin flex flex-col justify-start gap-3 sm:gap-4 min-w-0 pr-1">
                        {/* Detached Real-Time Dynamics Monitor & Telemetry at Top of Right Panel */}
                        <StarSystemActivityMonitor
                          systemId={activeStarSystemItem.id}
                          colorHex={activeStarSystemItem.colorHex}
                          clusterMode={clusterMode}
                        />

                        {/* Astrophysical Profile Quick Stats */}
                        <div className="w-full grid grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono min-w-0">
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Multiplicity</span>
                            <span className="text-white font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeStarSystemItem.multiplicity}</span>
                          </div>
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Category</span>
                            <span className="text-cyan-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeStarSystemItem.category}</span>
                          </div>
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0 col-span-2">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Archetype System / Star</span>
                            <span className="text-amber-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal flex items-center gap-1.5">
                              {archetypeStar ? (
                                <span>{archetypeStar.name} ({archetypeStar.spectralType})</span>
                              ) : (
                                activeStarSystemItem.tag
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Architecture & Dynamics */}
                        <div className="min-w-0 space-y-3">
                          <div>
                            <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1">
                              System Architecture &amp; Dynamics
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words">
                              {activeStarSystemItem.explanation}
                            </p>
                          </div>

                          <div className="p-2.5 sm:p-3 rounded-xl bg-[#020512] border border-cyan-500/20">
                            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-amber-300 font-bold block mb-1">
                              Orbital Mechanics:
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed break-words">
                              {activeStarSystemItem.orbitalDynamics}
                            </p>
                          </div>
                        </div>

                        {/* Key Observational Hallmarks */}
                        {activeStarSystemItem.distinguishingFeatures && activeStarSystemItem.distinguishingFeatures.length > 0 && (
                          <div className="space-y-1.5 sm:space-y-2 min-w-0">
                            <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
                              Key Observational Hallmarks
                            </h4>
                            <div className="grid grid-cols-1 gap-1 sm:gap-2 min-w-0">
                              {activeStarSystemItem.distinguishingFeatures.map((feat, idx) => (
                                <div
                                  key={idx}
                                  className="p-1.5 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 text-[11px] sm:text-xs text-slate-300 flex items-start gap-1.5 sm:gap-2 min-w-0"
                                >
                                  <span className="text-cyan-400 font-bold font-mono mt-0.5 shrink-0">•</span>
                                  <span className="break-words min-w-0">{feat}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* PRIORITIZED: Mapped Stellar Systems (Multi-Star Architectures with Interactive Dossiers) */}
                        <ClassificationMappedSystemsSection
                          title={`Mapped ${activeStarSystemItem.name}`}
                          categoryColor={activeStarSystemItem.colorHex}
                          systems={getMappedSystemsForStarSystemGuide(activeStarSystemItem.id)}
                          onSelectSystem={onSelectSystem}
                          onSelectStar={onSelectStar}
                        />

                        {/* SECONDARY: Individual Catalog Stars */}
                        <ClassificationMappedStarsSection
                          title={`Individual Catalog Stars in ${activeStarSystemItem.name}`}
                          categoryColor={activeStarSystemItem.colorHex}
                          allMappedStars={mappedSystemStars}
                          onSelectStar={onSelectStar}
                        />

                        {/* Observational Benchmarks / Notable Archetypes */}
                        {activeStarSystemItem.externalExamples && activeStarSystemItem.externalExamples.length > 0 && (
                          <div className="mt-0.5 sm:mt-1 p-2 sm:p-3 rounded-xl bg-[#020512] border border-cyan-500/20 min-w-0">
                            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-cyan-400 font-bold block mb-1 break-words">
                              Notable Archetypes:
                            </span>
                            <div className="flex flex-wrap gap-1 min-w-0">
                              {activeStarSystemItem.externalExamples.map((ext, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 break-words whitespace-normal leading-normal"
                                >
                                  {ext}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* CAROUSEL PANEL 5: STELLAR POPULATIONS                         */}
          {/* ------------------------------------------------------------- */}
          {classificationSystemIndex === 5 && (
            <div className="flex flex-col gap-3.5 sm:gap-5 animate-in fade-in duration-200">
              {/* Stellar Populations Quick Selector Buttons (Consistent size) */}
              <div className="flex items-stretch gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-cyan-500/30 w-full max-w-full py-1 sm:py-1.5">
                {STELLAR_POPULATIONS_GUIDE.map((item, idx) => {
                  const isSelected = idx === activePopulationIndex;
                  return (
                    <button
                      key={item.id}
                      id={`btn-population-select-${idx}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setActivePopulationIndex(idx);
                      }}
                      className={`p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between relative group shrink-0 min-w-[125px] sm:min-w-[145px] max-w-[185px] h-[52px] sm:h-[64px] min-h-[52px] max-h-[52px] sm:min-h-[64px] sm:max-h-[64px] ${
                        isSelected
                          ? 'bg-[#09132e] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-inset ring-cyan-400 z-10'
                          : 'bg-[#040816]/90 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#070f24] hover:z-[5]'
                      }`}
                      title={item.buttonTitle}
                    >
                      <div className="w-full min-w-0 text-left leading-tight">
                        <span className="text-[8px] sm:text-[9.5px] font-mono text-cyan-400/80 truncate block">
                          {item.typicalAge}
                        </span>
                      </div>

                      <div className="flex items-center justify-between w-full min-w-0 gap-1">
                        <RunningText
                          text={item.buttonTitle}
                          className="text-[10px] sm:text-xs font-bold text-white group-hover:text-cyan-200"
                        />
                        <span
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-white/40 shadow-sm shrink-0 ml-1"
                          style={{ backgroundColor: item.colorHex }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Stellar Populations Card - Carousel UI */}
              {(() => {
                const activePopulationItem = STELLAR_POPULATIONS_GUIDE[activePopulationIndex] || STELLAR_POPULATIONS_GUIDE[0];

                return (
                  <div className="w-full max-w-full p-3 sm:p-5 lg:p-6 rounded-2xl bg-[#040816]/95 border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3 sm:gap-5 relative">
                    {/* Header with Carousel Navigation & Quick Actions (No icon box) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-cyan-500/15 pb-2.5 sm:pb-4 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <button
                          type="button"
                          id="btn-card-carousel-population-prev"
                          onClick={handlePrevPopulation}
                          className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                          title="Previous stellar population"
                          aria-label="Previous card"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <RunningText
                              text={activePopulationItem.name}
                              className="text-sm sm:text-lg lg:text-xl font-bold text-white"
                            />
                            <span className="text-[10px] font-mono text-cyan-400/90 font-semibold shrink-0">
                              ({activePopulationIndex + 1}/{STELLAR_POPULATIONS_GUIDE.length})
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-400 italic mt-0.5 truncate">
                            Metallicity: {activePopulationItem.metallicityRange} • {activePopulationItem.typicalAge}
                          </p>
                        </div>

                        <button
                          type="button"
                          id="btn-card-carousel-population-next"
                          onClick={handleNextPopulation}
                          className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                          title="Next stellar population"
                          aria-label="Next card"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      {onJumpToCatalog && (
                        <button
                          onClick={onJumpToCatalog}
                          className="flex items-center justify-center gap-1 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-[10px] sm:text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm shrink-0 self-end sm:self-auto"
                        >
                          <Grid className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>Explore Catalog</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      )}
                    </div>

                    {/* Unified One-Panel Format: Side-by-side columns on landscape/larger screens, natural stacked on portrait */}
                    <div className="grid grid-cols-1 mobile-landscape:grid-cols-12 md:grid-cols-12 lg:grid-cols-12 gap-5 sm:gap-6 items-start min-w-0">
                      {/* Left Column: Chemical Evolution & Origin + Distinguishing Features */}
                      <div className="mobile-landscape:col-span-6 md:col-span-6 lg:col-span-6 flex flex-col gap-4 min-w-0">
                        <div className="min-w-0 space-y-3">
                          <div>
                            <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1.5 tracking-wider">
                              Chemical Evolution &amp; Galactic Epoch
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words">
                              {activePopulationItem.explanation}
                            </p>
                          </div>

                          <div className="p-2.5 sm:p-3 rounded-xl bg-[#020512] border border-cyan-500/20">
                            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-cyan-400 font-bold block mb-1">
                              Nucleosynthetic Origin:
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed break-words">
                              {activePopulationItem.nucleosyntheticOrigin}
                            </p>
                          </div>
                        </div>

                        {activePopulationItem.distinguishingFeatures && activePopulationItem.distinguishingFeatures.length > 0 && (
                          <div className="space-y-2 min-w-0">
                            <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
                              Key Chemical &amp; Kinematic Signatures
                            </h4>
                            <div className="grid grid-cols-1 gap-1.5 sm:gap-2 min-w-0">
                              {activePopulationItem.distinguishingFeatures.map((feat, idx) => (
                                <div
                                  key={idx}
                                  className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 text-[11px] sm:text-xs text-slate-300 flex items-start gap-2 min-w-0"
                                >
                                  <span className="text-cyan-400 font-bold font-mono mt-0.5 shrink-0">•</span>
                                  <span className="break-words min-w-0">{feat}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column: Population Profile & Examples */}
                      <div className="mobile-landscape:col-span-6 md:col-span-6 lg:col-span-6 flex flex-col gap-3.5 sm:gap-4 min-w-0">
                        <div className="min-w-0">
                          <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1.5 tracking-wider">
                            Population Profile
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono min-w-0">
                            <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                              <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Metallicity [Fe/H]</span>
                              <span className="text-white font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activePopulationItem.metallicityRange}</span>
                            </div>
                            <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                              <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Typical Age</span>
                              <span className="text-cyan-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activePopulationItem.typicalAge}</span>
                            </div>
                            <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0 sm:col-span-2">
                              <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Galactic Location</span>
                              <span className="text-amber-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activePopulationItem.galacticLocation}</span>
                            </div>
                          </div>
                        </div>

                        {/* Mapped Stars from Catalog */}
                        <ClassificationMappedStarsSection
                          title={`Mapped ${activePopulationItem.name}`}
                          categoryColor={activePopulationItem.colorHex}
                          allMappedStars={getMappedStarsForPopulation(activePopulationItem.id, STARS_CATALOG)}
                          onSelectStar={onSelectStar}
                        />

                        {/* Observational Benchmarks */}
                        {activePopulationItem.externalExamples && activePopulationItem.externalExamples.length > 0 && (
                          <div className="p-2.5 sm:p-3 rounded-xl bg-[#020512] border border-cyan-500/20 min-w-0">
                            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-cyan-400 font-bold block mb-1.5 break-words">
                              Observational Benchmarks:
                            </span>
                            <div className="flex flex-wrap gap-1 min-w-0">
                              {activePopulationItem.externalExamples.map((ext, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 break-words whitespace-normal leading-normal"
                                >
                                  {ext}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* CAROUSEL PANEL 6: STELLAR REMNANTS                            */}
          {/* ------------------------------------------------------------- */}
          {classificationSystemIndex === 6 && (
            <div className="flex flex-col gap-3.5 sm:gap-5 animate-in fade-in duration-200">
              {/* Stellar Remnants Quick Selector Buttons (Consistent size) */}
              <div className="flex items-stretch gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-cyan-500/30 w-full max-w-full py-1 sm:py-1.5">
                {STELLAR_REMNANTS_GUIDE.map((item, idx) => {
                  const isSelected = idx === activeRemnantIndex;
                  return (
                    <button
                      key={item.id}
                      id={`btn-remnant-select-${idx}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setActiveRemnantIndex(idx);
                      }}
                      className={`p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between relative group shrink-0 min-w-[125px] sm:min-w-[145px] max-w-[185px] h-[52px] sm:h-[64px] min-h-[52px] max-h-[52px] sm:min-h-[64px] sm:max-h-[64px] ${
                        isSelected
                          ? 'bg-[#09132e] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-inset ring-cyan-400 z-10'
                          : 'bg-[#040816]/90 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#070f24] hover:z-[5]'
                      }`}
                      title={`${item.buttonTitle} (${item.code})`}
                    >
                      <div className="w-full min-w-0 text-left leading-tight">
                        <span className="text-[8px] sm:text-[9.5px] font-mono text-cyan-400/80 truncate block">
                          {item.code}
                        </span>
                      </div>

                      <div className="flex items-center justify-between w-full min-w-0 gap-1">
                        <RunningText
                          text={item.buttonTitle}
                          className="text-[10px] sm:text-xs font-bold text-white group-hover:text-cyan-200"
                        />
                        <span
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-white/40 shadow-sm shrink-0 ml-1"
                          style={{ backgroundColor: item.colorHex }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Stellar Remnants Card - Carousel UI */}
              {(() => {
                const activeRemnantItem = STELLAR_REMNANTS_GUIDE[activeRemnantIndex] || STELLAR_REMNANTS_GUIDE[0];
                const mappedRemnantStars = getMappedStarsForRemnant(activeRemnantItem.id, STARS_CATALOG);
                const archetypeStar = mappedRemnantStars[0] || null;

                return (
                  <div className="w-full max-w-full p-3 sm:p-5 lg:p-6 rounded-2xl bg-[#040816]/95 border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3 sm:gap-5 relative">
                    {/* Header with Carousel Navigation & Quick Actions (No icon box) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-cyan-500/15 pb-2.5 sm:pb-4 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <button
                          type="button"
                          id="btn-prev-remnant"
                          onClick={handlePrevRemnant}
                          className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                          title="Previous stellar remnant"
                          aria-label="Previous card"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <RunningText
                              text={activeRemnantItem.name}
                              className="text-sm sm:text-lg lg:text-xl font-bold text-white"
                            />
                            <span className="text-[10px] font-mono text-cyan-400/90 font-semibold shrink-0">
                              ({activeRemnantIndex + 1}/{STELLAR_REMNANTS_GUIDE.length})
                            </span>
                            <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[11px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 shrink-0">
                              {activeRemnantItem.tag}
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-400 font-mono mt-0.5 truncate">
                            {activeRemnantItem.code} • {activeRemnantItem.category}
                          </p>
                        </div>

                        <button
                          type="button"
                          id="btn-next-remnant"
                          onClick={handleNextRemnant}
                          className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                          title="Next stellar remnant"
                          aria-label="Next card"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      {onJumpToCatalog && (
                        <button
                          onClick={onJumpToCatalog}
                          className="flex items-center justify-center gap-1 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-[10px] sm:text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm shrink-0 self-end sm:self-auto"
                        >
                          <Grid className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>Explore Catalog</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      )}
                    </div>

                    {/* Dossier-Style Split: Left/Top = Stellar Remnant Graphic ONLY (Non-hideable), Right/Bottom = All Info */}
                    <div className="flex flex-col mobile-landscape:flex-row lg:flex-row gap-3 sm:gap-6 min-w-0 items-stretch mobile-landscape:h-[calc(100vh-90px)] mobile-landscape:min-h-[225px] mobile-landscape:max-h-[265px] lg:h-[480px] xl:h-[520px] lg:min-h-[440px] lg:max-h-[600px] overflow-hidden">
                      {/* Left / Top Column: 1:1 Square Animated Remnant Model ONLY (Non-Hideable, top-aligned and not horizontally centered) */}
                      <div className="w-full mobile-landscape:w-5/12 lg:w-5/12 mobile-landscape:h-full lg:h-full flex flex-col items-start justify-start min-w-0 mobile-landscape:overflow-hidden lg:overflow-hidden p-0 sm:p-1">
                        <div className="w-full mobile-landscape:w-auto mobile-landscape:h-full mobile-landscape:max-h-full max-w-[380px] sm:max-w-[420px] mobile-landscape:max-w-full lg:w-auto lg:h-full lg:max-h-[460px] lg:max-w-[460px] aspect-square rounded-2xl overflow-hidden border border-cyan-500/35 bg-[#02040e] shadow-[0_0_35px_rgba(0,0,0,0.85)] relative self-start shrink-0">
                          <StellarRemnantGraphic
                            remnantId={activeRemnantItem.id}
                            archetypeStar={archetypeStar}
                            colorHex={activeRemnantItem.colorHex}
                          />
                        </div>
                      </div>

                      {/* Right / Bottom Column: All Info (Scrollable with bounded container) */}
                      <div className="w-full mobile-landscape:w-7/12 lg:w-7/12 mobile-landscape:h-full lg:h-full overflow-y-auto scrollbar-thin flex flex-col gap-2.5 sm:gap-3.5 min-w-0 pr-1">
                        {/* Astrophysical Profile Quick Stats */}
                        <div className="w-full grid grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono min-w-0">
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Density & Gravity</span>
                            <span className="text-white font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeRemnantItem.density}</span>
                          </div>
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Typical Mass</span>
                            <span className="text-cyan-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeRemnantItem.typicalMass}</span>
                          </div>
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Typical Diameter</span>
                            <span className="text-purple-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeRemnantItem.typicalDiameter}</span>
                          </div>
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Support / Horizon</span>
                            <span className="text-emerald-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeRemnantItem.quantumSupportOrHorizon}</span>
                          </div>
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0 col-span-2">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Benchmark / Archetype Star</span>
                            <span className="text-amber-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal flex items-center gap-1.5">
                              {archetypeStar ? (
                                <RunningText text={archetypeStar.name} className="truncate" />
                              ) : (
                                <span>{activeRemnantItem.externalExamples?.[0] || 'Relativistic Benchmark'}</span>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Plain-English Explanation */}
                        <div className="p-3 sm:p-4 rounded-xl bg-[#020512] border border-cyan-500/15">
                          <span className="text-xs font-bold text-cyan-400 font-mono block mb-1">
                            Physical Explanation:
                          </span>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                            {activeRemnantItem.explanation}
                          </p>
                        </div>

                        {/* Formation Mechanism */}
                        <div className="p-3 sm:p-4 rounded-xl bg-[#020512] border border-cyan-500/15">
                          <span className="text-xs font-bold text-indigo-400 font-mono block mb-1">
                            Formation & Collapse Pathway:
                          </span>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                            {activeRemnantItem.formationMechanism}
                          </p>
                        </div>

                        {/* Distinguishing Astrophysical Features */}
                        <div className="p-3 sm:p-4 rounded-xl bg-[#020512] border border-cyan-500/15 flex flex-col gap-2 min-w-0">
                          <span className="text-xs font-bold text-amber-400 font-mono block">
                            Key Distinguishing Astrophysical Features:
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-300 font-sans list-none">
                            {activeRemnantItem.distinguishingFeatures.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-cyan-400 font-bold mt-0.5 shrink-0">✓</span>
                                <span className="leading-snug">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Mapped Stars from Catalog or Benchmark Note */}
                        {(() => {
                          const mappedStars = getMappedStarsForRemnant(activeRemnantItem.id, STARS_CATALOG);
                          if (mappedStars.length > 0) {
                            return (
                              <ClassificationMappedStarsSection
                                title={`Mapped ${activeRemnantItem.name}`}
                                categoryColor={activeRemnantItem.colorHex}
                                allMappedStars={mappedStars}
                                onSelectStar={onSelectStar}
                              />
                            );
                          }
                          return (
                            <div className="p-3 sm:p-4 rounded-xl bg-[#020512] border border-cyan-500/20 text-xs font-mono space-y-1.5">
                              <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                                <span>Astrophysical Singularity Benchmark Note</span>
                              </div>
                              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                                Gravitational singularities and black hole candidates (Cygnus X-1, Gaia BH1, Sagittarius A*) are modeled as general-relativistic classification benchmarks. Individual stellar dossiers in the catalog are currently reserved for thermonuclear and degenerate stars.
                              </p>
                            </div>
                          );
                        })()}

                        {/* Observational Benchmarks */}
                        {activeRemnantItem.externalExamples && activeRemnantItem.externalExamples.length > 0 && (
                          <div className="mt-0.5 sm:mt-1 p-2 sm:p-3 rounded-xl bg-[#020512] border border-cyan-500/20 min-w-0">
                            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-cyan-400 font-bold block mb-1 break-words">
                              Historic &amp; Observational Benchmarks:
                            </span>
                            <div className="flex flex-wrap gap-1 min-w-0">
                              {activeRemnantItem.externalExamples.map((ext, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 break-words whitespace-normal leading-normal"
                                >
                                  {ext}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* CAROUSEL PANEL 7: HYPOTHETICAL STARS                          */}
          {/* ------------------------------------------------------------- */}
          {classificationSystemIndex === 7 && (
            <div className="flex flex-col gap-3.5 sm:gap-5 animate-in fade-in duration-200">
              {/* Hypothetical Stars Quick Selector Buttons (Consistent size) */}
              <div className="flex items-stretch gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-cyan-500/30 w-full max-w-full py-1 sm:py-1.5">
                {HYPOTHETICAL_STARS_GUIDE.map((item, idx) => {
                  const isSelected = idx === activeHypotheticalIndex;
                  return (
                    <button
                      key={item.id}
                      id={`btn-hypothetical-select-${idx}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setActiveHypotheticalIndex(idx);
                      }}
                      className={`p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between relative group shrink-0 min-w-[125px] sm:min-w-[145px] max-w-[185px] h-[52px] sm:h-[64px] min-h-[52px] max-h-[52px] sm:min-h-[64px] sm:max-h-[64px] ${
                        isSelected
                          ? 'bg-[#09132e] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-inset ring-cyan-400 z-10'
                          : 'bg-[#040816]/90 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#070f24] hover:z-[5]'
                      }`}
                      title={item.buttonTitle}
                    >
                      <div className="w-full min-w-0 text-left leading-tight">
                        <span className="text-[8px] sm:text-[9.5px] font-mono text-cyan-400/80 truncate block">
                          {item.theoreticalEra}
                        </span>
                      </div>

                      <div className="flex items-center justify-between w-full min-w-0 gap-1">
                        <RunningText
                          text={item.buttonTitle}
                          className="text-[10px] sm:text-xs font-bold text-white group-hover:text-cyan-200"
                        />
                        <span
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-white/40 shadow-sm shrink-0 ml-1"
                          style={{ backgroundColor: item.colorHex }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Hypothetical Stars Card - Carousel UI */}
              {(() => {
                const activeHypotheticalItem = HYPOTHETICAL_STARS_GUIDE[activeHypotheticalIndex] || HYPOTHETICAL_STARS_GUIDE[0];
                const mappedHypoStars = getMappedStarsForHypothetical(activeHypotheticalItem.id, STARS_CATALOG);
                const archetypeStar = mappedHypoStars[0] || null;

                return (
                  <div className="w-full max-w-full p-3 sm:p-5 lg:p-6 rounded-2xl bg-[#040816]/95 border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3 sm:gap-5 relative">
                    {/* Header with Carousel Navigation & Quick Actions (No icon box) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-cyan-500/15 pb-2.5 sm:pb-4 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <button
                          type="button"
                          id="btn-card-carousel-hypothetical-prev"
                          onClick={handlePrevHypothetical}
                          className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                          title="Previous hypothetical star type"
                          aria-label="Previous card"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <RunningText
                              text={activeHypotheticalItem.name}
                              className="text-sm sm:text-lg lg:text-xl font-bold text-white"
                            />
                            <span className="text-[10px] font-mono text-cyan-400/90 font-semibold shrink-0">
                              ({activeHypotheticalIndex + 1}/{HYPOTHETICAL_STARS_GUIDE.length})
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-400 italic mt-0.5 truncate">
                            {activeHypotheticalItem.category} • {activeHypotheticalItem.theoreticalEra}
                          </p>
                        </div>

                        <button
                          type="button"
                          id="btn-card-carousel-hypothetical-next"
                          onClick={handleNextHypothetical}
                          className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                          title="Next hypothetical star type"
                          aria-label="Next card"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      {onJumpToCatalog && (
                        <button
                          onClick={onJumpToCatalog}
                          className="flex items-center justify-center gap-1 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-[10px] sm:text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm shrink-0 self-end sm:self-auto"
                        >
                          <Grid className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>Explore Catalog</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      )}
                    </div>

                    {/* Dossier-Style Split: Left/Top = Hypothetical Star Graphic ONLY (Non-hideable), Right/Bottom = All Info */}
                    <div className="flex flex-col mobile-landscape:flex-row lg:flex-row gap-3 sm:gap-6 min-w-0 items-stretch mobile-landscape:h-[calc(100vh-90px)] mobile-landscape:min-h-[225px] mobile-landscape:max-h-[265px] lg:h-[480px] xl:h-[520px] lg:min-h-[440px] lg:max-h-[600px] overflow-hidden">
                      {/* Left / Top Column: 1:1 Square Animated Hypothetical Star Model ONLY */}
                      <div className="w-full mobile-landscape:w-5/12 lg:w-5/12 mobile-landscape:h-full lg:h-full flex flex-col items-start justify-start min-w-0 mobile-landscape:overflow-hidden lg:overflow-hidden p-0 sm:p-1">
                        <div className="w-full mobile-landscape:w-auto mobile-landscape:h-full mobile-landscape:max-h-full max-w-[380px] sm:max-w-[420px] mobile-landscape:max-w-full lg:w-auto lg:h-full lg:max-h-[460px] lg:max-w-[460px] aspect-square rounded-2xl overflow-hidden border border-cyan-500/35 bg-[#02040e] shadow-[0_0_35px_rgba(0,0,0,0.85)] relative self-start shrink-0">
                          <HypotheticalStarGraphic
                            hypoId={activeHypotheticalItem.id}
                            archetypeStar={archetypeStar}
                            colorHex={activeHypotheticalItem.colorHex}
                            onExoticModeChange={(mode) => {
                              const targetId = mode === 'strange' ? 'strange-stars' : mode === 'electroweak' ? 'electroweak-stars' : 'boson-stars';
                              const foundIdx = HYPOTHETICAL_STARS_GUIDE.findIndex((h) => h.id === targetId);
                              if (foundIdx !== -1 && foundIdx !== activeHypotheticalIndex) {
                                setActiveHypotheticalIndex(foundIdx);
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* Right / Bottom Column: All Info (Scrollable with bounded container) */}
                      <div className="w-full mobile-landscape:w-7/12 lg:w-7/12 mobile-landscape:h-full lg:h-full overflow-y-auto scrollbar-thin flex flex-col gap-2.5 sm:gap-3.5 min-w-0 pr-1">
                        {/* Theoretical Profile Quick Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono min-w-0">
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Category</span>
                            <span className="text-white font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeHypotheticalItem.category}</span>
                          </div>
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Predicted Era</span>
                            <span className="text-cyan-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeHypotheticalItem.theoreticalEra}</span>
                          </div>
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0 sm:col-span-2">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Energy Source</span>
                            <span className="text-amber-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeHypotheticalItem.energySource}</span>
                          </div>
                        </div>

                        {/* Theoretical Concept & Astrophysics */}
                        <div className="p-3 sm:p-3.5 rounded-xl bg-[#020512] border border-cyan-500/15 space-y-2">
                          <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
                            Theoretical Concept &amp; Astrophysics
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words">
                            {activeHypotheticalItem.explanation}
                          </p>
                          <div className="pt-2 border-t border-cyan-500/10">
                            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-amber-300 font-bold block mb-1">
                              Governing Physics &amp; Mechanics:
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed break-words">
                              {activeHypotheticalItem.physicsMechanism}
                            </p>
                          </div>
                        </div>

                        {/* Predicted Distinguishing Hallmarks */}
                        {activeHypotheticalItem.distinguishingFeatures && activeHypotheticalItem.distinguishingFeatures.length > 0 && (
                          <div className="space-y-1.5 min-w-0">
                            <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
                              Predicted Distinguishing Hallmarks
                            </h4>
                            <div className="grid grid-cols-1 gap-1.5 sm:gap-2 min-w-0">
                              {activeHypotheticalItem.distinguishingFeatures.map((feat, idx) => (
                                <div
                                  key={idx}
                                  className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 text-[11px] sm:text-xs text-slate-300 flex items-start gap-2 min-w-0"
                                >
                                  <span className="text-cyan-400 font-bold font-mono mt-0.5 shrink-0">•</span>
                                  <span className="break-words min-w-0">{feat}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Direct Ancestral / Progenitor Stars in Catalog */}
                        {(() => {
                          if (mappedHypoStars.length === 0) return null;
                          return (
                            <ClassificationMappedStarsSection
                              title={`Mapped Progenitors & Relics: ${activeHypotheticalItem.name}`}
                              categoryColor={activeHypotheticalItem.colorHex}
                              allMappedStars={mappedHypoStars}
                              onSelectStar={onSelectStar}
                            />
                          );
                        })()}

                        {/* Theoretical Candidates / Benchmark Models */}
                        {activeHypotheticalItem.externalExamples && activeHypotheticalItem.externalExamples.length > 0 && (
                          <div className="p-2.5 sm:p-3 rounded-xl bg-[#020512] border border-cyan-500/20 min-w-0">
                            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-cyan-400 font-bold block mb-1.5 break-words">
                              Theoretical Models &amp; Candidates:
                            </span>
                            <div className="flex flex-wrap gap-1 min-w-0">
                              {activeHypotheticalItem.externalExamples.map((ext, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 break-words whitespace-normal leading-normal"
                                >
                                  {ext}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

      {/* Complete Stellar Classification Directory Modal */}
      <ClassificationDirectoryModal
        isOpen={isClassificationDirectoryOpen}
        onClose={() => setIsClassificationDirectoryOpen(false)}
        stars={STARS_CATALOG}
        onSelectStar={onSelectStar}
      />
    </div>
  );
};
