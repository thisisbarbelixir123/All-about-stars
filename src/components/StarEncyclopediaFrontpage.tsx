import React, { useState, useMemo, useEffect, useRef } from 'react';
import { StarData } from '../types';
import { STARS_CATALOG } from '../data/stars';
import { formatPhysicalDiameter } from '../utils/formatters';
import {
  WHAT_IS_A_STAR_CORE_INFO,
  STELLAR_ANATOMY_LAYERS,
  FUSION_MECHANISMS,
  FUNDAMENTAL_STELLAR_PROPERTIES,
  StellarAnatomyLayer,
} from '../data/whatIsAStarData';
import { StellarCrossSectionVisualizer } from './StellarCrossSectionVisualizer';
import { StellarLifeCycleVisualizer2D } from './StellarLifeCycleVisualizer2D';
import { ThermonuclearEngineVisualizer } from './ThermonuclearEngineVisualizer';
import {
  SPECTRAL_CLASSES_GUIDE,
  EXOTIC_CLASSES_GUIDE,
  LUMINOSITY_CLASSES_GUIDE,
  VARIABLE_STARS_GUIDE,
  STAR_SYSTEMS_GUIDE,
  STELLAR_POPULATIONS_GUIDE,
  HYPOTHETICAL_STARS_GUIDE,
  STELLAR_MYTHS_GUIDE,
  CLASSIFICATION_QUIZ,
} from '../data/classificationGuideData';
import {
  BookOpen,
  Sparkles,
  Sun,
  Flame,
  Layers,
  Compass,
  HelpCircle,
  CheckCircle2,
  XCircle,
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
  BarChart2,
  Activity,
  Atom,
  Scale,
  Thermometer,
  Eye,
  Radio,
  Grid,
  ShieldAlert,
  Sliders,
  Database,
} from 'lucide-react';
import { ClassificationMappedStarsSection } from './ClassificationMappedStarsSection';
import { ClassificationDirectoryModal } from './ClassificationDirectoryModal';
import {
  getMappedStarsForHarvard,
  getMappedStarsForExotic,
  getMappedStarsForYerkes,
  getMappedStarsForVariable,
  getMappedStarsForStarSystem,
  getMappedStarsForPopulation,
} from '../utils/stellarClassificationMapping';

interface StarEncyclopediaFrontpageProps {
  onSelectStar: (star: StarData) => void;
  onCompareStar: (star: StarData) => void;
  onJumpToCatalog?: () => void;
  onJumpToHRDiagram?: () => void;
  onJumpToConstellations?: () => void;
  onJumpToCatalogFilter?: (spectralClass?: string, stellarStage?: string) => void;
  initialSection?: 'what-is-a-star' | 'spectral-classes' | 'luminosity-stages' | 'life-cycles' | 'myths' | 'quiz';
}

export const StarEncyclopediaFrontpage: React.FC<StarEncyclopediaFrontpageProps> = ({
  onSelectStar,
  onCompareStar,
  onJumpToCatalog,
  onJumpToHRDiagram,
  onJumpToConstellations,
  onJumpToCatalogFilter,
  initialSection = 'what-is-a-star',
}) => {
  // Main frontpage section tab
  const [activeSection, setActiveSection] = useState<
    'what-is-a-star' | 'spectral-classes' | 'luminosity-stages' | 'life-cycles' | 'myths' | 'quiz'
  >(initialSection);

  // Classification Systems Carousel Toggle State:
  // 0: Harvard Spectral Classes (OBAFGKM)
  // 1: Other Spectral Classes
  // 2: Variable Stars
  // 3: Yerkes Luminosity System (MKK)
  // 4: Star Systems
  // 5: Stellar Populations
  // 6: Hypothetical Stars
  const [classificationSystemIndex, setClassificationSystemIndex] = useState<number>(() => {
    if (initialSection === 'luminosity-stages') return 3;
    return 0;
  });

  const handlePrevClassificationSystem = () => {
    setClassificationSystemIndex((prev) => (prev - 1 + 7) % 7);
  };

  const handleNextClassificationSystem = () => {
    setClassificationSystemIndex((prev) => (prev + 1) % 7);
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
    const activeBtn = document.getElementById(`btn-hypothetical-select-${activeHypotheticalIndex}`);
    if (activeBtn && activeBtn.parentElement) {
      const container = activeBtn.parentElement;
      if (container.scrollWidth > container.clientWidth) {
        const targetScrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);
        container.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
      }
    }
  }, [activeHypotheticalIndex]);

  useEffect(() => {
    if (initialSection) {
      if (initialSection === 'luminosity-stages') {
        setActiveSection('spectral-classes');
        setClassificationSystemIndex(3);
      } else if (initialSection === 'spectral-classes') {
        setActiveSection('spectral-classes');
        setClassificationSystemIndex(0);
      } else {
        setActiveSection(initialSection);
      }
    }
  }, [initialSection]);

  // "What is a Star?" expandable/contractable panels state:
  // On tablets & desktop (width >= 768px), panels are expanded by default; on mobile (< 768px), collapsed by default.
  const [expandedPanels, setExpandedPanels] = useState<Record<string, boolean>>(() => {
    const isTabletOrLarger = typeof window !== 'undefined' ? window.innerWidth >= 768 : false;
    return {
      'cosmic-origin': isTabletOrLarger,
      'hydrostatic': isTabletOrLarger,
      'anatomy': isTabletOrLarger,
      'thermonuclear': isTabletOrLarger,
      'properties': isTabletOrLarger,
    };
  });

  // Ensure default state matches viewport on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTabletOrLarger = window.innerWidth >= 768;
      setExpandedPanels({
        'cosmic-origin': isTabletOrLarger,
        'hydrostatic': isTabletOrLarger,
        'anatomy': isTabletOrLarger,
        'thermonuclear': isTabletOrLarger,
        'properties': isTabletOrLarger,
      });
    }
  }, []);

  const togglePanel = (panelId: string) => {
    setExpandedPanels((prev) => ({ ...prev, [panelId]: !prev[panelId] }));
  };

  const setAllPanels = (expanded: boolean) => {
    setExpandedPanels({
      'cosmic-origin': expanded,
      'hydrostatic': expanded,
      'anatomy': expanded,
      'thermonuclear': expanded,
      'properties': expanded,
    });
  };

  // "What is a Star?" sub-interactive states
  const [selectedAnatomyLayerId, setSelectedAnatomyLayerId] = useState<string>('core');
  const [selectedFusionId, setSelectedFusionId] = useState<string>('pp-chain');
  const [hydrostaticState, setHydrostaticState] = useState<'balanced' | 'gravity-wins' | 'radiation-wins'>('balanced');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('mass');

  // Classification sub-states & Card Navigation
  const [selectedSpectralClassId, setSelectedSpectralClassId] = useState<string>('class-g');

  // Spectral Card Navigation indices
  const currentSpectralIndex = useMemo(() => {
    const idx = SPECTRAL_CLASSES_GUIDE.findIndex((s) => s.id === selectedSpectralClassId);
    return idx >= 0 ? idx : 0;
  }, [selectedSpectralClassId]);

  const handlePrevSpectralClass = () => {
    const prevIdx = (currentSpectralIndex - 1 + SPECTRAL_CLASSES_GUIDE.length) % SPECTRAL_CLASSES_GUIDE.length;
    setSelectedSpectralClassId(SPECTRAL_CLASSES_GUIDE[prevIdx].id);
  };

  const handleNextSpectralClass = () => {
    const nextIdx = (currentSpectralIndex + 1) % SPECTRAL_CLASSES_GUIDE.length;
    setSelectedSpectralClassId(SPECTRAL_CLASSES_GUIDE[nextIdx].id);
  };


  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Active items
  const activeAnatomyLayer = useMemo(() => {
    return STELLAR_ANATOMY_LAYERS.find((l) => l.id === selectedAnatomyLayerId) || STELLAR_ANATOMY_LAYERS[0];
  }, [selectedAnatomyLayerId]);

  const activeFusion = useMemo(() => {
    return FUSION_MECHANISMS.find((f) => f.id === selectedFusionId) || FUSION_MECHANISMS[0];
  }, [selectedFusionId]);

  const activeProperty = useMemo(() => {
    return FUNDAMENTAL_STELLAR_PROPERTIES.find((p) => p.id === selectedPropertyId) || FUNDAMENTAL_STELLAR_PROPERTIES[0];
  }, [selectedPropertyId]);

  const activeSpectralItem = useMemo(() => {
    return SPECTRAL_CLASSES_GUIDE.find((s) => s.id === selectedSpectralClassId) || SPECTRAL_CLASSES_GUIDE[4];
  }, [selectedSpectralClassId]);

  // Helper to find StarData instances for example star IDs
  const getExampleStars = (starIds: string[]): StarData[] => {
    return starIds
      .map((id) => STARS_CATALOG.find((s) => s.id === id))
      .filter(Boolean) as StarData[];
  };

  // Handle quiz score calculation
  const quizScore = useMemo(() => {
    let score = 0;
    CLASSIFICATION_QUIZ.forEach((q) => {
      const selectedOptionId = quizAnswers[q.id];
      const correctOption = q.options.find((o) => o.isCorrect);
      if (correctOption && selectedOptionId === correctOption.id) {
        score += 1;
      }
    });
    return score;
  }, [quizAnswers]);

  return (
    <div className="w-full bg-[#060a1a]/95 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col gap-6 relative overflow-hidden text-slate-200">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Banner: Star Encyclopedia Frontpage */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-cyan-500/20 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono uppercase tracking-wider font-bold">
              Encyclopedia Frontpage
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-[11px] font-mono text-slate-400">Astrophysics Primer & Classification Guide</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Sun className="w-8 h-8 sm:w-9 sm:h-9 text-amber-400 animate-pulse" />
            <span>What is a Star?</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {WHAT_IS_A_STAR_CORE_INFO.scientificDefinition}
          </p>
        </div>

        {/* Quick Jump Buttons to other Encyclopedia Modules */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onJumpToCatalog && (
            <button
              onClick={onJumpToCatalog}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#081226] hover:bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm hover:border-cyan-400/60"
              title="Open Stellar Catalog"
            >
              <Grid className="w-3.5 h-3.5 text-cyan-400" />
              <span>Stellar Catalog ({STARS_CATALOG.length})</span>
            </button>
          )}

          {onJumpToHRDiagram && (
            <button
              onClick={onJumpToHRDiagram}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#081226] hover:bg-cyan-950/80 border border-cyan-500/30 text-indigo-300 hover:text-white text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm hover:border-indigo-400/60"
              title="Explore H-R Diagram"
            >
              <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>H-R Diagram</span>
            </button>
          )}

          {onJumpToConstellations && (
            <button
              onClick={onJumpToConstellations}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#081226] hover:bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm hover:border-cyan-400/60"
              title="Explore Constellation Guide"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>88 Constellations</span>
            </button>
          )}
        </div>
      </div>

      {/* Cosmic Statistics / Key Numbers Ribbon: Compact on mobile, unambiguous wording, no overflow */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="p-2 sm:p-3.5 rounded-xl bg-[#040816] border border-cyan-500/20 flex items-start sm:items-center gap-2 sm:gap-3 min-w-0 overflow-hidden shadow-sm">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 shrink-0 aspect-square flex items-center justify-center">
            <Atom className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[9px] sm:text-[10px] font-mono uppercase text-slate-400 leading-tight break-words" title="Estimated number of stars in the Milky Way Galaxy">
              Milky Way Stars
            </div>
            <div className="text-[11px] sm:text-sm lg:text-base font-bold text-white font-mono leading-tight break-words mt-0.5">
              100–400 Billion
            </div>
          </div>
        </div>

        <div className="p-2 sm:p-3.5 rounded-xl bg-[#040816] border border-cyan-500/20 flex items-start sm:items-center gap-2 sm:gap-3 min-w-0 overflow-hidden shadow-sm">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-500/30 shrink-0 aspect-square flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[9px] sm:text-[10px] font-mono uppercase text-slate-400 leading-tight break-words" title="Estimated total stars across the observable universe">
              Universe Stars
            </div>
            <div className="text-[11px] sm:text-sm lg:text-base font-bold text-white font-mono leading-tight break-words mt-0.5">
              <span>~2 × 10²⁴ Stars</span>
              <span className="block text-[9px] sm:text-xs text-indigo-300/80 font-normal">
                (2 Septillion)
              </span>
            </div>
          </div>
        </div>

        <div className="p-2 sm:p-3.5 rounded-xl bg-[#040816] border border-cyan-500/20 flex items-start sm:items-center gap-2 sm:gap-3 min-w-0 overflow-hidden shadow-sm">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-500/30 shrink-0 aspect-square flex items-center justify-center">
            <Scale className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[9px] sm:text-[10px] font-mono uppercase text-slate-400 leading-tight break-words" title="The mechanical equilibrium balancing inward gravity with outward pressure">
              Core Equilibrium
            </div>
            <div className="text-[11px] sm:text-sm lg:text-base font-bold text-amber-300 font-mono leading-tight break-words mt-0.5">
              Hydrostatic Equilibrium
            </div>
          </div>
        </div>

        <div className="p-2 sm:p-3.5 rounded-xl bg-[#040816] border border-cyan-500/20 flex items-start sm:items-center gap-2 sm:gap-3 min-w-0 overflow-hidden shadow-sm">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-rose-950/80 text-rose-400 border border-rose-500/30 shrink-0 aspect-square flex items-center justify-center">
            <Flame className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[9px] sm:text-[10px] font-mono uppercase text-slate-400 leading-tight break-words" title="The nuclear process generating radiant power in stellar interiors">
              Power Source
            </div>
            <div className="text-[11px] sm:text-sm lg:text-base font-bold text-rose-300 font-mono leading-tight break-words mt-0.5">
              Thermonuclear Fusion
            </div>
          </div>
        </div>
      </div>

      {/* Main Frontpage Navigation Tabs - Merged into 5 clean tabs */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 bg-[#020512] rounded-2xl border border-cyan-500/25 shadow-inner shrink-0">
        <button
          id="tab-frontpage-what-is-a-star"
          onClick={() => setActiveSection('what-is-a-star')}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'what-is-a-star'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sun className="w-4 h-4 shrink-0 text-amber-400" />
          <span>What is a Star? (Foundations)</span>
        </button>

        <button
          id="tab-frontpage-classification"
          onClick={() => {
            setActiveSection('spectral-classes');
            if (classificationSystemIndex === undefined) setClassificationSystemIndex(0);
          }}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'spectral-classes' || activeSection === 'luminosity-stages'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Flame className="w-4 h-4 shrink-0 text-orange-400" />
          <span>Stellar Classification Systems</span>
        </button>

        <button
          id="tab-frontpage-lifecycles"
          onClick={() => setActiveSection('life-cycles')}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'life-cycles'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Stellar Life Cycles (2D Simulator)</span>
        </button>

        <button
          id="tab-frontpage-myths"
          onClick={() => setActiveSection('myths')}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'myths'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Zap className="w-4 h-4 shrink-0 text-amber-300" />
          <span>Myths &amp; Realities</span>
        </button>

        <button
          id="tab-frontpage-quiz"
          onClick={() => setActiveSection('quiz')}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'quiz'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Award className="w-4 h-4 shrink-0 text-purple-400" />
          <span>Knowledge Check ({quizScore}/5)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: WHAT IS A STAR? (DEEP ASTROPHYSICS FOUNDATIONS)              */}
      {/* ========================================================================= */}
      {activeSection === 'what-is-a-star' && (
        <div className="flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-200">
          {/* Mobile Accessibility: Expand / Contract Toolbar with Separate Buttons */}
          <div className="flex items-center justify-end gap-1.5 p-2 rounded-xl bg-[#040816] border border-cyan-500/20">
            <button
              type="button"
              id="btn-expand-all-star-panels"
              onClick={() => setAllPanels(true)}
              className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono font-semibold transition-all cursor-pointer"
            >
              Expand All
            </button>
            <button
              type="button"
              id="btn-collapse-all-star-panels"
              onClick={() => setAllPanels(false)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-semibold transition-all cursor-pointer"
            >
              Collapse All
            </button>
          </div>

          {/* Panel 1: Cosmic Origin Quote / Element Factory Callout (Expandable/Contractable) */}
          <div className="rounded-2xl bg-gradient-to-r from-[#0a142e] via-[#091024] to-[#040816] border border-cyan-500/30 overflow-hidden transition-all">
            <button
              type="button"
              id="btn-toggle-panel-cosmic-origin"
              onClick={() => togglePanel('cosmic-origin')}
              className="w-full p-2.5 sm:p-4 flex items-center justify-between gap-2.5 text-left cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shrink-0 aspect-square flex items-center justify-center">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-cyan-300 uppercase tracking-wider font-mono break-words leading-snug">
                    The Cosmic Engines of Elements: "We Are Stardust"
                  </h3>
                </div>
              </div>
              <div className="shrink-0 p-1.5 rounded-lg bg-slate-900/80 text-cyan-300 border border-cyan-500/30">
                {expandedPanels['cosmic-origin'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>
            {expandedPanels['cosmic-origin'] && (
              <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-5 pt-0 border-t border-cyan-500/15 text-xs sm:text-sm text-slate-300 leading-relaxed mt-2 animate-in fade-in duration-200 break-words">
                {WHAT_IS_A_STAR_CORE_INFO.cosmicSignificance}
              </div>
            )}
          </div>

          {/* Panel 2: Hydrostatic Equilibrium Interactive Demonstrator (Expandable/Contractable) */}
          <div className="rounded-2xl bg-[#040816] border border-cyan-500/25 overflow-hidden transition-all">
            <button
              type="button"
              id="btn-toggle-panel-hydrostatic"
              onClick={() => togglePanel('hydrostatic')}
              className="w-full p-2.5 sm:p-4 flex items-center justify-between gap-2.5 text-left cursor-pointer hover:bg-white/5 transition-colors border-b border-cyan-500/15"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 shrink-0 aspect-square flex items-center justify-center">
                  <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono break-words leading-snug">
                    Hydrostatic Equilibrium: The Cosmic Balancing Act
                  </h3>
                </div>
              </div>
              <div className="shrink-0 p-1.5 rounded-lg bg-slate-900/80 text-cyan-300 border border-cyan-500/30">
                {expandedPanels['hydrostatic'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {expandedPanels['hydrostatic'] && (
              <div className="p-4 sm:p-6 flex flex-col gap-5 animate-in fade-in duration-200">
                {/* State Switcher - Separate Buttons (No Sliding Panel) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3">

                  <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#020512] rounded-xl border border-cyan-500/20 text-xs font-mono">
                    <button
                      onClick={() => setHydrostaticState('balanced')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
                        hydrostaticState === 'balanced'
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Balanced (Stable Star)
                    </button>
                    <button
                      onClick={() => setHydrostaticState('gravity-wins')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
                        hydrostaticState === 'gravity-wins'
                          ? 'bg-indigo-500 text-white font-bold shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Gravity Wins (Collapse)
                    </button>
                    <button
                      onClick={() => setHydrostaticState('radiation-wins')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
                        hydrostaticState === 'radiation-wins'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Radiation Wins (Expansion)
                    </button>
                  </div>
                </div>

                {/* Visual Vector Balance Card */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-xl bg-[#020512] border border-cyan-500/20 relative overflow-hidden min-h-[240px]">
                    {/* Visual Star Core Simulation Stage */}
                    <div className="h-44 flex items-center justify-center w-full relative">
                      <div
                        className={`rounded-full transition-all duration-500 flex items-center justify-center relative ${
                          hydrostaticState === 'balanced'
                            ? 'w-32 h-32 bg-gradient-to-r from-amber-400 to-yellow-200 shadow-[0_0_40px_rgba(251,191,36,0.5)]'
                            : hydrostaticState === 'gravity-wins'
                            ? 'w-20 h-20 bg-gradient-to-r from-indigo-500 to-blue-400 shadow-[0_0_30px_rgba(99,102,241,0.6)]'
                            : 'w-44 h-44 bg-gradient-to-r from-red-500 to-amber-400 shadow-[0_0_60px_rgba(239,68,68,0.7)]'
                        }`}
                      >
                        <span className="text-[11px] font-mono font-bold text-slate-950 uppercase tracking-wider text-center px-2 select-none leading-tight">
                          {hydrostaticState === 'balanced'
                            ? 'Stable Stellar Radius'
                            : hydrostaticState === 'gravity-wins'
                            ? 'Core Contraction'
                            : 'Envelope Expansion'}
                        </span>
                      </div>
                    </div>

                    {/* Hydrostatic Equation Badge */}
                    {hydrostaticState === 'balanced' && (
                      <div className="mt-2 text-[10px] font-mono font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30 shadow-sm animate-in fade-in duration-200">
                        dP/dr = -ρ·g
                      </div>
                    )}

                    {/* Force Vector Legend */}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] font-mono px-2 py-1.5 rounded-lg bg-[#040816] border border-cyan-500/15">
                      <div className="flex items-center gap-1 text-cyan-400">
                        <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                        <span>Inward Gravity (F_g)</span>
                      </div>
                      <span className="text-slate-600 font-bold">•</span>
                      <div className="flex items-center gap-1 text-amber-400">
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>Outward Pressure (P_rad + P_gas)</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 flex flex-col gap-3 text-xs leading-relaxed">
                    {hydrostaticState === 'balanced' && (
                      <div className="space-y-2">
                        <div className="text-sm font-bold text-cyan-300 font-mono flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Equilibrium Maintained: The Self-Regulating Thermostat</span>
                        </div>
                        <p className="text-slate-300">
                          For normal main-sequence stars (like the Sun), gravity pulling inward is precisely matched by the outward thermal and radiation pressure generated by core fusion.
                        </p>
                        <div className="p-3 rounded-lg bg-[#020512] border border-cyan-500/20 text-slate-300">
                          <strong className="text-white block font-mono mb-1">Negative Feedback Loop:</strong>
                          If the core cools slightly, pressure drops, causing the core to compress under gravity. This compression heats the core, accelerating fusion and pushing the star back outward!
                        </div>
                      </div>
                    )}

                    {hydrostaticState === 'gravity-wins' && (
                      <div className="space-y-2">
                        <div className="text-sm font-bold text-indigo-300 font-mono flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-indigo-400" />
                          <span>When Inward Gravity Overcomes Outward Pressure</span>
                        </div>
                        <p className="text-slate-300">
                          When a star runs out of nuclear fuel in its core, outward radiation pressure drops to zero. Gravity instantly crushes the core inward.
                        </p>
                        <div className="p-3 rounded-lg bg-[#020512] border border-indigo-500/30 text-slate-300">
                          <strong className="text-white block font-mono mb-1">Outcome:</strong>
                          Depending on remaining mass, the collapse is either halted by electron degeneracy (forming a White Dwarf), neutron degeneracy (forming a Neutron Star), or collapses into an infinite gravitational singularity (Stellar Black Hole).
                        </div>
                      </div>
                    )}

                    {hydrostaticState === 'radiation-wins' && (
                      <div className="space-y-2">
                        <div className="text-sm font-bold text-amber-300 font-mono flex items-center gap-2">
                          <Flame className="w-4 h-4 text-amber-400" />
                          <span>When Radiation & Thermal Pressure Overpower Gravity</span>
                        </div>
                        <p className="text-slate-300">
                          When core hydrogen exhausts and hydrogen shell burning ignites around an inert helium core, energy production surges drastically.
                        </p>
                        <div className="p-3 rounded-lg bg-[#020512] border border-amber-500/30 text-slate-300">
                          <strong className="text-white block font-mono mb-1">Outcome:</strong>
                          The immense outward thermal pressure forces the outer stellar envelope to swell by hundreds or thousands of times, cooling into a Red Giant or Red Supergiant (like Betelgeuse).
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Panel 3: Stellar Anatomy Visualized Using Cross-Section (Expandable/Contractable) */}
          <div className="rounded-2xl bg-[#040816] border border-cyan-500/25 overflow-hidden transition-all">
            <button
              type="button"
              id="btn-toggle-panel-anatomy"
              onClick={() => togglePanel('anatomy')}
              className="w-full p-2.5 sm:p-4 flex items-center justify-between gap-2.5 text-left cursor-pointer hover:bg-white/5 transition-colors border-b border-cyan-500/15"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 shrink-0 aspect-square flex items-center justify-center">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono break-words leading-snug">
                    Stellar Anatomy: 2D Interactive Cross-Section Visualizer
                  </h3>
                </div>
              </div>
              <div className="shrink-0 p-1.5 rounded-lg bg-slate-900/80 text-cyan-300 border border-cyan-500/30">
                {expandedPanels['anatomy'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {expandedPanels['anatomy'] && (
              <div className="p-2 sm:p-5 animate-in fade-in duration-200 overflow-x-hidden">
                <StellarCrossSectionVisualizer
                  selectedLayerId={selectedAnatomyLayerId}
                  onSelectLayer={setSelectedAnatomyLayerId}
                />
              </div>
            )}
          </div>

          {/* Panel 4: Thermonuclear Engine: How Stars Generate Energy (Expandable/Contractable) */}
          <div className="rounded-2xl bg-[#040816] border border-cyan-500/25 overflow-hidden transition-all">
            <button
              type="button"
              id="btn-toggle-panel-thermonuclear"
              onClick={() => togglePanel('thermonuclear')}
              className="w-full p-2.5 sm:p-4 flex items-center justify-between gap-2.5 text-left cursor-pointer hover:bg-white/5 transition-colors border-b border-cyan-500/15"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/30 shrink-0 aspect-square flex items-center justify-center">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono break-words leading-snug">
                    The Thermonuclear Engine: How Stars Generate Energy
                  </h3>
                </div>
              </div>
              <div className="shrink-0 p-1.5 rounded-lg bg-slate-900/80 text-cyan-300 border border-cyan-500/30">
                {expandedPanels['thermonuclear'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {expandedPanels['thermonuclear'] && (
              <div className="p-3 sm:p-6 flex flex-col gap-4 sm:gap-5 animate-in fade-in duration-200 overflow-x-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 border-b border-cyan-500/15 pb-4">
                  {/* Fusion Mechanism Switcher - Horizontal scroll on mobile */}
                  <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-[#020512] rounded-xl border border-cyan-500/20 text-xs font-mono w-full sm:w-auto overflow-x-auto scrollbar-none shrink-0">
                    {FUSION_MECHANISMS.map((mechanism) => (
                      <button
                        key={mechanism.id}
                        onClick={() => setSelectedFusionId(mechanism.id)}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold whitespace-nowrap text-[11px] sm:text-xs ${
                          selectedFusionId === mechanism.id
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {mechanism.id === 'pp-chain' ? 'p-p Chain (≤ 1.3 M☉)' : mechanism.id === 'cno-cycle' ? 'CNO Cycle (> 1.3 M☉)' : 'Advanced Shells'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Thermonuclear Engine Simulation Animation */}
                <ThermonuclearEngineVisualizer
                  selectedFusionId={selectedFusionId}
                  onSelectFusionId={setSelectedFusionId}
                />

                {/* Active Fusion Mechanism Details */}
                <div className="p-3 sm:p-5 rounded-xl bg-[#020512] border border-cyan-500/20 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white font-mono">{activeFusion.title}</h4>
                      <p className="text-xs text-cyan-400 font-mono mt-0.5">{activeFusion.primaryMassRange}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-slate-400">Core Temp Needed:</span>
                      <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 font-bold">
                        {activeFusion.coreTemperatureRequired}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#040816] border border-amber-500/20 font-mono text-xs text-amber-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Net Nuclear Reaction Equation:</span>
                    <span className="text-amber-300 font-bold text-xs sm:text-sm break-words">{activeFusion.fuelAndProduct}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed break-words">
                    {activeFusion.description}
                  </p>

                  {/* Reaction Step Sequence */}
                  <div className="space-y-2 mt-1">
                    <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold">Sequential Reaction Stages</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeFusion.stepSequence.map((step, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-[#040816] border border-slate-800 text-xs text-slate-300 break-words">
                          <span className="text-cyan-400 font-bold font-mono mr-1.5">{idx + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs font-mono text-slate-400 border-t border-slate-800 pt-2 flex items-center gap-1.5 break-words">
                    <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{activeFusion.keyCharacteristic}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Panel 5: Fundamental Physical Properties of Stars (Expandable/Contractable) */}
          <div className="rounded-2xl bg-[#040816] border border-cyan-500/25 overflow-hidden transition-all">
            <button
              type="button"
              id="btn-toggle-panel-properties"
              onClick={() => togglePanel('properties')}
              className="w-full p-2.5 sm:p-4 flex items-center justify-between gap-2.5 text-left cursor-pointer hover:bg-white/5 transition-colors border-b border-cyan-500/15"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 shrink-0 aspect-square flex items-center justify-center">
                  <Sliders className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono break-words leading-snug">
                    Fundamental Astrophysics Parameters: How We Measure Stars
                  </h3>
                </div>
              </div>
              <div className="shrink-0 p-1.5 rounded-lg bg-slate-900/80 text-cyan-300 border border-cyan-500/30">
                {expandedPanels['properties'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {expandedPanels['properties'] && (
              <div className="p-4 sm:p-6 flex flex-col gap-5 animate-in fade-in duration-200">
                {/* Property Switcher - Separate Buttons (No Sliding Panel) */}
                <div className="flex flex-wrap gap-2">
                  {FUNDAMENTAL_STELLAR_PROPERTIES.map((prop) => (
                    <button
                      key={prop.id}
                      onClick={() => setSelectedPropertyId(prop.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedPropertyId === prop.id
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                          : 'bg-[#020512] text-slate-300 border-cyan-500/20 hover:border-cyan-500/40'
                      }`}
                    >
                      <span className="font-black text-cyan-300">{prop.symbol}</span>
                      <span>{prop.title}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Property Card */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#020512] border border-cyan-500/20 grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-5 flex flex-col justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Astrophysical Parameter</div>
                      <h4 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                        <span>{activeProperty.title}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                          Symbol: {activeProperty.symbol}
                        </span>
                      </h4>
                      {activeProperty.formula && (
                        <div className="text-xs font-mono text-amber-300 mt-1.5 p-2 rounded bg-[#040816] border border-amber-500/20">
                          {activeProperty.formula}
                        </div>
                      )}
                    </div>

                    <div className="p-3 rounded-lg bg-[#040816] border border-slate-800 text-xs">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Standard Unit:</span>
                      <span className="text-white font-mono font-bold">{activeProperty.unit}</span>
                    </div>
                  </div>

                  <div className="lg:col-span-7 flex flex-col justify-between gap-4">
                    <div>
                      <h5 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1">Why It Matters</h5>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold">
                        {activeProperty.whyItMatters}
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed mt-2">
                        {activeProperty.description}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-[#040816] border border-slate-800 space-y-1.5 text-xs font-mono">
                      <span className="text-[10px] uppercase text-slate-400 block font-bold">Dynamic Cosmic Range:</span>
                      <div className="text-indigo-300">
                        <strong>Min:</strong> {activeProperty.extremeExamples.minimum}
                      </div>
                      <div className="text-amber-300">
                        <strong>Solar:</strong> {activeProperty.extremeExamples.solar}
                      </div>
                      <div className="text-rose-300">
                        <strong>Max:</strong> {activeProperty.extremeExamples.maximum}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: STELLAR CLASSIFICATION WITH CAROUSEL CARD UI                   */}
      {/* ========================================================================= */}
      {(activeSection === 'spectral-classes' || activeSection === 'luminosity-stages') && (
        <div className="flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-200">
          {/* Subsystem Switcher within Stellar Classification Systems */}
          <div className="p-1.5 sm:p-2 rounded-2xl bg-[#040816] border border-cyan-500/25 flex flex-wrap items-center justify-between gap-2 shadow-lg">
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 p-1 bg-[#020512] rounded-xl border border-cyan-500/20 text-xs font-mono w-full sm:w-auto">
              {[
                { id: 0, label: 'Harvard Spectral Classes (OBAFGKM)' },
                { id: 1, label: 'Other Spectral Classes' },
                { id: 2, label: 'Variable Stars' },
                { id: 3, label: 'Yerkes Luminosity System (MKK)' },
                { id: 4, label: 'Star Systems' },
                { id: 5, label: 'Stellar Populations' },
                { id: 6, label: 'Hypothetical Stars' },
              ].map((sys) => (
                <button
                  key={sys.id}
                  id={`btn-classification-subsystem-${sys.id}`}
                  onClick={() => setClassificationSystemIndex(sys.id)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold text-[11px] sm:text-xs ${
                    classificationSystemIndex === sys.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sys.label}
                </button>
              ))}
            </div>

            {/* Direct button to open complete 557-star classification directory */}
            <button
              type="button"
              id="btn-open-classification-directory"
              onClick={() => setIsClassificationDirectoryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm shrink-0"
              title="Browse complete mapping of all 557 stars in catalog"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>All 557 Stars Mapped</span>
              <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">100%</span>
            </button>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* CAROUSEL PANEL 0: SPECTRAL CLASSES (OBAFGKM)                  */}
          {/* ------------------------------------------------------------- */}
          {classificationSystemIndex === 0 && (
            <div className="flex flex-col gap-3.5 sm:gap-5 animate-in fade-in duration-200">
              {/* Mnemonic Banner: Placed above the buttons */}
              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#030612]/90 border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4 overflow-hidden shadow-sm">
                <div className="min-w-0 w-full md:w-auto">
                  <span className="text-[9px] sm:text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-bold block">
                    The Universal Astronomy Mnemonic
                  </span>
                  <div className="text-[11px] sm:text-sm md:text-base font-black text-white mt-0.5 sm:mt-1 flex flex-wrap gap-1 sm:gap-2 items-center font-mono">
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
                  className="w-full md:w-72 lg:w-80 h-2 sm:h-3 shrink-0 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-white/20"
                  style={{
                    background: 'linear-gradient(90deg, #4d88ff 0%, #8cb5ff 16.6%, #d8e5ff 33.3%, #fff2db 50%, #ffefa6 66.6%, #ffb366 83.3%, #ff5533 100%)',
                  }}
                />
              </div>

              {/* Spectral Class Quick Selector Buttons with Mnemonics */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2.5 w-full py-2 sm:py-2.5">
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
                      className={`p-1 sm:p-3 rounded-xl sm:rounded-2xl border text-center sm:text-left transition-colors duration-150 cursor-pointer flex flex-col items-center sm:items-stretch justify-center sm:justify-between relative group min-w-0 sm:aspect-[3/2] min-h-[52px] sm:min-h-[96px] h-auto ${
                        isSelected
                          ? 'bg-[#09132e] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400'
                          : 'bg-[#040816]/90 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#070f24]'
                      }`}
                      title={`Spectral Class ${item.code} (${item.mnemonicWord})`}
                    >
                      {/* Mnemonic word placed above the spectral code: HIDDEN ON MOBILE (no titles/subtitles on mobile) */}
                      <div className="hidden sm:block text-xs font-bold text-cyan-300/90 group-hover:text-cyan-200 transition-colors truncate w-full text-left leading-tight mb-1">
                        {item.mnemonicWord}
                      </div>

                      <div className="flex items-center justify-center sm:justify-between w-full gap-1 my-auto sm:my-0">
                        <span
                          className="text-base sm:text-2xl font-black font-mono leading-none drop-shadow-[0_0_8px_currentColor]"
                          style={{ color: item.colorHex }}
                        >
                          {item.code}
                        </span>
                        <span
                          className="w-1.5 h-1.5 sm:w-3 sm:h-3 shrink-0 rounded-full border border-white/40 shadow-sm"
                          style={{ backgroundColor: item.colorHex }}
                        />
                      </div>

                      {/* Subtitle (temperature): HIDDEN ON MOBILE, shown on tablet/desktop */}
                      <div className="hidden sm:block mt-1 min-w-0">
                        <div className="text-[10px] text-slate-400 font-mono truncate" title={item.temperatureKelvin}>
                          {item.code === 'O'
                            ? '≥ 30,000 K'
                            : `${item.tempMin.toLocaleString()} – ${item.tempMax.toLocaleString()} K`}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Stellar Classification Card - Carousel UI (Left & Right Buttons, Fits Mobile Screen Vertically & Horizontally) */}
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
                        <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white break-words">
                          {activeSpectralItem.name}
                        </h3>
                        <span className="text-[10px] font-mono text-cyan-400/90 font-semibold shrink-0">
                          ({currentSpectralIndex + 1}/7)
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 italic break-words">
                        "{activeSpectralItem.simpleAnalogy}"
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

                {/* Explanation & Key Specs Grid - Safe from mobile horizontal & vertical overflow */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 min-w-0">
                  {/* Left Column: Plain English Explanation & Key Facts */}
                  <div className="lg:col-span-7 flex flex-col justify-between gap-3 sm:gap-4 min-w-0">
                    <div className="min-w-0">
                      <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1">
                        Physical Nature &amp; Appearance
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words">
                        {activeSpectralItem.plainEnglishExplanation}
                      </p>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2 min-w-0">
                      <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
                        Key Astronomical Facts
                      </h4>
                      <div className="grid grid-cols-1 gap-1 sm:gap-2 min-w-0">
                        {activeSpectralItem.keyFacts.map((fact, idx) => (
                          <div
                            key={idx}
                            className="p-1.5 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 text-[11px] sm:text-xs text-slate-300 flex items-start gap-1.5 sm:gap-2 min-w-0"
                          >
                            <span className="text-cyan-400 font-bold font-mono mt-0.5 shrink-0">•</span>
                            <span className="break-words min-w-0">{fact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Physical Properties Grid */}
                  <div className="lg:col-span-5 flex flex-col gap-2.5 sm:gap-3 min-w-0">
                    <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
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

                    {/* Mapped Stars from Catalog */}
                    <ClassificationMappedStarsSection
                      title={`Mapped Type ${activeSpectralItem.code} Stars`}
                      categoryColor={activeSpectralItem.colorHex}
                      benchmarkStarIds={activeSpectralItem.exampleStarIds}
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
              <div
                className="flex items-center sm:items-stretch gap-1 sm:gap-2.5 overflow-x-auto scrollbar-none w-full max-w-full py-2.5 sm:py-3 px-1"
                onWheel={(e) => {
                  if (e.deltaY !== 0 && e.currentTarget.scrollWidth > e.currentTarget.clientWidth) {
                    e.currentTarget.scrollLeft += e.deltaY;
                  }
                }}
              >
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
                      className={`p-1 sm:p-3 rounded-xl sm:rounded-2xl border text-center sm:text-left transition-colors duration-150 cursor-pointer flex flex-col items-center sm:items-stretch justify-center sm:justify-between relative group w-[calc((100%-24px)/7)] sm:w-36 sm:min-w-[130px] sm:max-w-[144px] sm:aspect-[3/2] shrink-0 min-w-[44px] min-h-[52px] sm:min-h-[96px] h-auto ${
                        isSelected
                          ? 'bg-[#09132e] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400'
                          : 'bg-[#040816]/90 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#070f24]'
                      }`}
                      title={`${item.buttonTitle} (${item.abbreviation})`}
                    >
                      {/* On mobile: NO title. On tablet and desktop: full title shown in full without cutting */}
                      <div className="hidden sm:block w-full text-left leading-snug mb-1 min-w-0">
                        <span className="text-xs font-bold text-cyan-300/90 group-hover:text-cyan-200 transition-colors whitespace-normal break-words leading-snug">
                          {item.buttonTitle}
                        </span>
                      </div>

                      <div className="flex items-center justify-center sm:justify-between w-full gap-1 my-auto sm:my-0">
                        <span
                          className="text-xs sm:text-2xl font-black font-mono leading-none drop-shadow-[0_0_8px_currentColor]"
                          style={{ color: item.colorHex }}
                        >
                          {item.abbreviation}
                        </span>
                        <span
                          className="w-1.5 h-1.5 sm:w-3 sm:h-3 shrink-0 rounded-full border border-white/40 shadow-sm"
                          style={{ backgroundColor: item.colorHex }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Stellar Classification Card - Carousel UI (Left & Right Buttons, Fits Mobile Screen Vertically & Horizontally) */}
              {(() => {
                const activeExoticItem = EXOTIC_CLASSES_GUIDE[activeExoticIndex] || EXOTIC_CLASSES_GUIDE[0];
                const catalogStars = getExampleStars(activeExoticItem.exampleStarIds || []);
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
                            <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white break-words">
                              {activeExoticItem.name}
                            </h3>
                            <span className="text-[10px] font-mono text-cyan-400/90 font-semibold shrink-0">
                              ({activeExoticIndex + 1}/{EXOTIC_CLASSES_GUIDE.length})
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 italic break-words">
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

                    {/* Explanation & Key Specs Grid - Safe from mobile horizontal & vertical overflow */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 min-w-0">
                      {/* Left Column: Plain English Explanation & Distinguishing Features */}
                      <div className="lg:col-span-7 flex flex-col justify-between gap-3 sm:gap-4 min-w-0">
                        <div className="min-w-0">
                          <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1">
                            Physical Nature &amp; Origin
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words">
                            {activeExoticItem.explanation}
                          </p>
                        </div>

                        {activeExoticItem.distinguishingFeatures && activeExoticItem.distinguishingFeatures.length > 0 && (
                          <div className="space-y-1.5 sm:space-y-2 min-w-0">
                            <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
                              Distinguishing Features
                            </h4>
                            <div className="grid grid-cols-1 gap-1 sm:gap-2 min-w-0">
                              {activeExoticItem.distinguishingFeatures.map((feat, idx) => (
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
                      </div>

                      {/* Right Column: Physical Properties Grid & Examples */}
                      <div className="lg:col-span-5 flex flex-col gap-2.5 sm:gap-3 min-w-0">
                        <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
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

                        {/* Mapped Stars from Catalog */}
                        <ClassificationMappedStarsSection
                          title={`Mapped ${activeExoticItem.name}`}
                          categoryColor={activeExoticItem.colorHex}
                          benchmarkStarIds={activeExoticItem.exampleStarIds || []}
                          allMappedStars={getMappedStarsForExotic(activeExoticItem.code, STARS_CATALOG)}
                          onSelectStar={onSelectStar}
                        />

                        {/* External Observational Benchmarks if applicable */}
                        {activeExoticItem.externalExamples && activeExoticItem.externalExamples.length > 0 && (
                          <div className="mt-0.5 sm:mt-1 p-2 sm:p-3 rounded-xl bg-[#020512] border border-cyan-500/20 min-w-0">
                            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-cyan-400 font-bold block mb-1 break-words">
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
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                  </div>
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
              </div>

              {/* Variable Stars Quick Selector Buttons: Full buttonTitle with glowing dot, no subtitles, max 3:2 aspect ratio on desktop */}
              <div
                className="flex items-center sm:items-stretch gap-1 sm:gap-2.5 overflow-x-auto scrollbar-none w-full max-w-full py-2.5 sm:py-3 px-1"
                onWheel={(e) => {
                  if (e.deltaY !== 0 && e.currentTarget.scrollWidth > e.currentTarget.clientWidth) {
                    e.currentTarget.scrollLeft += e.deltaY;
                  }
                }}
              >
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
                      className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-center sm:text-left transition-colors duration-150 cursor-pointer flex flex-col justify-between relative group shrink-0 min-w-[120px] sm:w-36 sm:min-w-[130px] sm:max-w-[144px] sm:aspect-[3/2] min-h-[56px] sm:min-h-[96px] h-auto ${
                        isSelected
                          ? 'bg-[#09132e] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400'
                          : 'bg-[#040816]/90 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#070f24]'
                      }`}
                      title={item.buttonTitle}
                    >
                      <div className="flex items-center justify-between w-full gap-1 mb-1">
                        <span
                          className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0 rounded-full border border-white/40 shadow-sm"
                          style={{ backgroundColor: item.colorHex, boxShadow: `0 0 8px ${item.colorHex}` }}
                        />
                      </div>
                      <div className="w-full text-left leading-tight min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-200 transition-colors whitespace-normal break-words">
                          {item.buttonTitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Variable Stars Card - Carousel UI */}
              {(() => {
                const activeVariableItem = VARIABLE_STARS_GUIDE[activeVariableIndex] || VARIABLE_STARS_GUIDE[0];
                const catalogStars = getExampleStars(activeVariableItem.exampleStarIds || []);

                return (
                  <div className="w-full max-w-full p-3 sm:p-5 lg:p-6 rounded-2xl bg-[#040816]/95 border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3 sm:gap-5 relative">
                    {/* Header with Carousel Navigation & Quick Actions */}
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

                        <div
                          className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl border border-white/30"
                          style={{
                            backgroundColor: activeVariableItem.colorHex,
                            color: '#02040a',
                            boxShadow: `0 0 20px ${activeVariableItem.colorHex}66`,
                          }}
                        >
                          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white break-words">
                              {activeVariableItem.name}
                            </h3>
                            <span className="text-[10px] font-mono text-cyan-400/90 font-semibold shrink-0">
                              ({activeVariableIndex + 1}/{VARIABLE_STARS_GUIDE.length})
                            </span>
                          </div>
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

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 min-w-0">
                      {/* Left Column: Explanation & Mechanism */}
                      <div className="lg:col-span-7 flex flex-col justify-between gap-3 sm:gap-4 min-w-0">
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
                      </div>

                      {/* Right Column: Physical Profile & Examples */}
                      <div className="lg:col-span-5 flex flex-col gap-2.5 sm:gap-3 min-w-0">
                        <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
                          Astrophysical Profile
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono min-w-0">
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Category</span>
                            <span className="text-white font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeVariableItem.category}</span>
                          </div>
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Cycle Period</span>
                            <span className="text-cyan-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeVariableItem.periodRange}</span>
                          </div>
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0 sm:col-span-2">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Classification Tag</span>
                            <span className="text-amber-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeVariableItem.tag}</span>
                          </div>
                        </div>

                        {/* Mapped Stars from Catalog */}
                        <ClassificationMappedStarsSection
                          title={`Mapped ${activeVariableItem.name}`}
                          categoryColor={activeVariableItem.colorHex}
                          benchmarkStarIds={activeVariableItem.exampleStarIds || []}
                          allMappedStars={getMappedStarsForVariable(activeVariableItem.id, STARS_CATALOG)}
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
              <div
                className="flex items-center sm:items-stretch gap-1 sm:gap-2.5 overflow-x-auto scrollbar-none w-full max-w-full py-2.5 sm:py-3 px-1"
                onWheel={(e) => {
                  if (e.deltaY !== 0 && e.currentTarget.scrollWidth > e.currentTarget.clientWidth) {
                    e.currentTarget.scrollLeft += e.deltaY;
                  }
                }}
              >
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
                      className={`p-1 sm:p-3 rounded-xl sm:rounded-2xl border text-center sm:text-left transition-colors duration-150 cursor-pointer flex flex-col items-center sm:items-stretch justify-center sm:justify-between relative group w-[calc((100%-24px)/7)] sm:w-36 sm:min-w-[130px] sm:max-w-[144px] sm:aspect-[3/2] shrink-0 min-w-[44px] min-h-[52px] sm:min-h-[96px] h-auto ${
                        isSelected
                          ? 'bg-[#09132e] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400'
                          : 'bg-[#040816]/90 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#070f24]'
                      }`}
                      title={`${item.buttonTitle} (Class ${item.abbreviation})`}
                    >
                      {/* On mobile: NO title. On tablet and desktop: full title shown in full without cutting */}
                      <div className="hidden sm:block w-full text-left leading-snug mb-1 min-w-0">
                        <span className="text-xs font-bold text-cyan-300/90 group-hover:text-cyan-200 transition-colors whitespace-normal break-words leading-snug">
                          {item.buttonTitle}
                        </span>
                      </div>

                      <div className="flex items-center justify-center sm:justify-between w-full gap-1 my-auto sm:my-0">
                        <span
                          className="text-xs sm:text-2xl font-black font-mono leading-none drop-shadow-[0_0_8px_currentColor]"
                          style={{ color: itemColor }}
                        >
                          {item.abbreviation}
                        </span>
                        <span
                          className="w-1.5 h-1.5 sm:w-3 sm:h-3 shrink-0 rounded-full border border-white/40 shadow-sm"
                          style={{ backgroundColor: itemColor }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Stellar Classification Card - Carousel UI (Left & Right Buttons, Fits Mobile Screen Vertically & Horizontally) */}
              {(() => {
                const activeYerkesItem = LUMINOSITY_CLASSES_GUIDE[activeYerkesIndex] || LUMINOSITY_CLASSES_GUIDE[0];
                const catalogStars = getExampleStars(activeYerkesItem.exampleStarIds || []);

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
                            <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white break-words">
                              {activeYerkesItem.title}
                            </h3>
                            <span className="text-[10px] font-mono text-cyan-400/90 font-semibold shrink-0">
                              ({activeYerkesIndex + 1}/{LUMINOSITY_CLASSES_GUIDE.length})
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 italic break-words">
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

                    {/* Explanation & Key Specs Grid - Safe from mobile horizontal & vertical overflow */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 min-w-0">
                      {/* Left Column: Plain English Explanation & Physical Mechanism */}
                      <div className="lg:col-span-7 flex flex-col justify-between gap-3 sm:gap-4 min-w-0">
                        <div className="min-w-0">
                          <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1">
                            Spectroscopic Line Profile &amp; Nature
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words">
                            {activeYerkesItem.plainEnglishExplanation}
                          </p>
                        </div>

                        <div className="space-y-1.5 sm:space-y-2 min-w-0">
                          <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
                            Physical Mechanism &amp; How It Works
                          </h4>
                          <div className="p-2.5 sm:p-3 rounded-xl bg-[#020512] border border-cyan-500/15 text-[11px] sm:text-xs text-slate-300 leading-relaxed break-words">
                            {activeYerkesItem.howItWorks}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Luminosity Profile & Example Stars */}
                      <div className="lg:col-span-5 flex flex-col gap-2.5 sm:gap-3 min-w-0">
                        <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
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

                        {/* Mapped Stars from Catalog */}
                        <ClassificationMappedStarsSection
                          title={`Mapped Class ${activeYerkesItem.romanNumeral} Stars`}
                          categoryColor={activeYerkesItem.colorHex || '#38bdf8'}
                          benchmarkStarIds={activeYerkesItem.exampleStarIds || []}
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
              {/* Star Systems Quick Selector Buttons */}
              <div
                className="flex items-center sm:items-stretch gap-1 sm:gap-2.5 overflow-x-auto scrollbar-none w-full max-w-full py-2.5 sm:py-3 px-1"
                onWheel={(e) => {
                  if (e.deltaY !== 0 && e.currentTarget.scrollWidth > e.currentTarget.clientWidth) {
                    e.currentTarget.scrollLeft += e.deltaY;
                  }
                }}
              >
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
                      className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-center sm:text-left transition-colors duration-150 cursor-pointer flex flex-col justify-between relative group shrink-0 min-w-[120px] sm:w-36 sm:min-w-[130px] sm:max-w-[144px] sm:aspect-[3/2] min-h-[56px] sm:min-h-[96px] h-auto ${
                        isSelected
                          ? 'bg-[#09132e] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400'
                          : 'bg-[#040816]/90 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#070f24]'
                      }`}
                      title={item.buttonTitle}
                    >
                      <div className="flex items-center justify-between w-full gap-1 mb-1">
                        <span
                          className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0 rounded-full border border-white/40 shadow-sm"
                          style={{ backgroundColor: item.colorHex, boxShadow: `0 0 8px ${item.colorHex}` }}
                        />
                        <span className="text-[9px] sm:text-[10px] font-mono text-cyan-400/80 truncate">
                          {item.multiplicity}
                        </span>
                      </div>
                      <div className="w-full text-left leading-tight min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-200 transition-colors whitespace-normal break-words">
                          {item.buttonTitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Star Systems Card - Carousel UI */}
              {(() => {
                const activeStarSystemItem = STAR_SYSTEMS_GUIDE[activeStarSystemIndex] || STAR_SYSTEMS_GUIDE[0];
                const catalogStars = getExampleStars(activeStarSystemItem.exampleStarIds || []);

                return (
                  <div className="w-full max-w-full p-3 sm:p-5 lg:p-6 rounded-2xl bg-[#040816]/95 border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3 sm:gap-5 relative">
                    {/* Header with Carousel Navigation & Quick Actions */}
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

                        <div
                          className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl border border-white/30"
                          style={{
                            backgroundColor: activeStarSystemItem.colorHex,
                            color: '#02040a',
                            boxShadow: `0 0 20px ${activeStarSystemItem.colorHex}66`,
                          }}
                        >
                          <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white break-words">
                              {activeStarSystemItem.name}
                            </h3>
                            <span className="text-[10px] font-mono text-cyan-400/90 font-semibold shrink-0">
                              ({activeStarSystemIndex + 1}/{STAR_SYSTEMS_GUIDE.length})
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 italic break-words">
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

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 min-w-0">
                      {/* Left Column: Explanation & Orbital Dynamics */}
                      <div className="lg:col-span-7 flex flex-col justify-between gap-3 sm:gap-4 min-w-0">
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
                            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-cyan-400 font-bold block mb-1">
                              Orbital Mechanics:
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed break-words">
                              {activeStarSystemItem.orbitalDynamics}
                            </p>
                          </div>
                        </div>

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
                      </div>

                      {/* Right Column: Physical Profile & Examples */}
                      <div className="lg:col-span-5 flex flex-col gap-2.5 sm:gap-3 min-w-0">
                        <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
                          System Profile
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono min-w-0">
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Multiplicity</span>
                            <span className="text-white font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeStarSystemItem.multiplicity}</span>
                          </div>
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Category</span>
                            <span className="text-cyan-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeStarSystemItem.category}</span>
                          </div>
                          <div className="p-2 sm:p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15 min-w-0 sm:col-span-2">
                            <span className="text-slate-500 block text-[8px] sm:text-[10px] uppercase font-semibold leading-tight mb-0.5 break-words">Classification Tag</span>
                            <span className="text-amber-300 font-bold text-[11px] sm:text-sm break-words whitespace-normal">{activeStarSystemItem.tag}</span>
                          </div>
                        </div>

                        {/* Mapped Stars from Catalog */}
                        <ClassificationMappedStarsSection
                          title={`Mapped ${activeStarSystemItem.name}`}
                          categoryColor={activeStarSystemItem.colorHex}
                          benchmarkStarIds={activeStarSystemItem.exampleStarIds || []}
                          allMappedStars={getMappedStarsForStarSystem(activeStarSystemItem.id, STARS_CATALOG)}
                          onSelectStar={onSelectStar}
                        />

                        {/* Observational Benchmarks */}
                        {activeStarSystemItem.externalExamples && activeStarSystemItem.externalExamples.length > 0 && (
                          <div className="mt-0.5 sm:mt-1 p-2 sm:p-3 rounded-xl bg-[#020512] border border-cyan-500/20 min-w-0">
                            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-cyan-400 font-bold block mb-1 break-words">
                              Famous Benchmark Systems:
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
              {/* Stellar Populations Quick Selector Buttons */}
              <div
                className="flex items-center sm:items-stretch gap-1 sm:gap-2.5 overflow-x-auto scrollbar-none w-full max-w-full py-2.5 sm:py-3 px-1"
                onWheel={(e) => {
                  if (e.deltaY !== 0 && e.currentTarget.scrollWidth > e.currentTarget.clientWidth) {
                    e.currentTarget.scrollLeft += e.deltaY;
                  }
                }}
              >
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
                      className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-center sm:text-left transition-colors duration-150 cursor-pointer flex flex-col justify-between relative group shrink-0 min-w-[120px] sm:w-36 sm:min-w-[130px] sm:max-w-[144px] sm:aspect-[3/2] min-h-[56px] sm:min-h-[96px] h-auto ${
                        isSelected
                          ? 'bg-[#09132e] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400'
                          : 'bg-[#040816]/90 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#070f24]'
                      }`}
                      title={item.buttonTitle}
                    >
                      <div className="flex items-center justify-between w-full gap-1 mb-1">
                        <span
                          className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0 rounded-full border border-white/40 shadow-sm"
                          style={{ backgroundColor: item.colorHex, boxShadow: `0 0 8px ${item.colorHex}` }}
                        />
                      </div>
                      <div className="w-full text-left leading-tight min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-200 transition-colors whitespace-normal break-words">
                          {item.buttonTitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Stellar Populations Card - Carousel UI */}
              {(() => {
                const activePopulationItem = STELLAR_POPULATIONS_GUIDE[activePopulationIndex] || STELLAR_POPULATIONS_GUIDE[0];
                const catalogStars = getExampleStars(activePopulationItem.exampleStarIds || []);

                return (
                  <div className="w-full max-w-full p-3 sm:p-5 lg:p-6 rounded-2xl bg-[#040816]/95 border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3 sm:gap-5 relative">
                    {/* Header with Carousel Navigation & Quick Actions */}
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

                        <div
                          className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl border border-white/30"
                          style={{
                            backgroundColor: activePopulationItem.colorHex,
                            color: '#02040a',
                            boxShadow: `0 0 20px ${activePopulationItem.colorHex}66`,
                          }}
                        >
                          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white break-words">
                              {activePopulationItem.name}
                            </h3>
                            <span className="text-[10px] font-mono text-cyan-400/90 font-semibold shrink-0">
                              ({activePopulationIndex + 1}/{STELLAR_POPULATIONS_GUIDE.length})
                            </span>
                          </div>
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

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 min-w-0">
                      {/* Left Column: Explanation & Nucleosynthetic Origin */}
                      <div className="lg:col-span-7 flex flex-col justify-between gap-3 sm:gap-4 min-w-0">
                        <div className="min-w-0 space-y-3">
                          <div>
                            <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1">
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
                          <div className="space-y-1.5 sm:space-y-2 min-w-0">
                            <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
                              Key Chemical &amp; Kinematic Signatures
                            </h4>
                            <div className="grid grid-cols-1 gap-1 sm:gap-2 min-w-0">
                              {activePopulationItem.distinguishingFeatures.map((feat, idx) => (
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
                      </div>

                      {/* Right Column: Physical Profile & Examples */}
                      <div className="lg:col-span-5 flex flex-col gap-2.5 sm:gap-3 min-w-0">
                        <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
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

                        {/* Mapped Stars from Catalog */}
                        <ClassificationMappedStarsSection
                          title={`Mapped ${activePopulationItem.name}`}
                          categoryColor={activePopulationItem.colorHex}
                          benchmarkStarIds={activePopulationItem.exampleStarIds || []}
                          allMappedStars={getMappedStarsForPopulation(activePopulationItem.id, STARS_CATALOG)}
                          onSelectStar={onSelectStar}
                        />

                        {/* Observational Benchmarks */}
                        {activePopulationItem.externalExamples && activePopulationItem.externalExamples.length > 0 && (
                          <div className="mt-0.5 sm:mt-1 p-2 sm:p-3 rounded-xl bg-[#020512] border border-cyan-500/20 min-w-0">
                            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-cyan-400 font-bold block mb-1 break-words">
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
          {/* CAROUSEL PANEL 6: HYPOTHETICAL STARS                          */}
          {/* ------------------------------------------------------------- */}
          {classificationSystemIndex === 6 && (
            <div className="flex flex-col gap-3.5 sm:gap-5 animate-in fade-in duration-200">
              {/* Hypothetical Stars Quick Selector Buttons */}
              <div
                className="flex items-center sm:items-stretch gap-1 sm:gap-2.5 overflow-x-auto scrollbar-none w-full max-w-full py-2.5 sm:py-3 px-1"
                onWheel={(e) => {
                  if (e.deltaY !== 0 && e.currentTarget.scrollWidth > e.currentTarget.clientWidth) {
                    e.currentTarget.scrollLeft += e.deltaY;
                  }
                }}
              >
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
                      className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-center sm:text-left transition-colors duration-150 cursor-pointer flex flex-col justify-between relative group shrink-0 min-w-[120px] sm:w-36 sm:min-w-[130px] sm:max-w-[144px] sm:aspect-[3/2] min-h-[56px] sm:min-h-[96px] h-auto ${
                        isSelected
                          ? 'bg-[#09132e] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400'
                          : 'bg-[#040816]/90 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#070f24]'
                      }`}
                      title={item.buttonTitle}
                    >
                      <div className="flex items-center justify-between w-full gap-1 mb-1">
                        <span
                          className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0 rounded-full border border-white/40 shadow-sm"
                          style={{ backgroundColor: item.colorHex, boxShadow: `0 0 8px ${item.colorHex}` }}
                        />
                      </div>
                      <div className="w-full text-left leading-tight min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-200 transition-colors whitespace-normal break-words">
                          {item.buttonTitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Hypothetical Stars Card - Carousel UI */}
              {(() => {
                const activeHypotheticalItem = HYPOTHETICAL_STARS_GUIDE[activeHypotheticalIndex] || HYPOTHETICAL_STARS_GUIDE[0];

                return (
                  <div className="w-full max-w-full p-3 sm:p-5 lg:p-6 rounded-2xl bg-[#040816]/95 border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3 sm:gap-5 relative">
                    {/* Header with Carousel Navigation & Quick Actions */}
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

                        <div
                          className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl border border-white/30"
                          style={{
                            backgroundColor: activeHypotheticalItem.colorHex,
                            color: '#02040a',
                            boxShadow: `0 0 20px ${activeHypotheticalItem.colorHex}66`,
                          }}
                        >
                          <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white break-words">
                              {activeHypotheticalItem.name}
                            </h3>
                            <span className="text-[10px] font-mono text-cyan-400/90 font-semibold shrink-0">
                              ({activeHypotheticalIndex + 1}/{HYPOTHETICAL_STARS_GUIDE.length})
                            </span>
                          </div>
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

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 min-w-0">
                      {/* Left Column: Explanation & Physics Mechanism */}
                      <div className="lg:col-span-7 flex flex-col justify-between gap-3 sm:gap-4 min-w-0">
                        <div className="min-w-0 space-y-3">
                          <div>
                            <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1">
                              Theoretical Concept &amp; Astrophysics
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words">
                              {activeHypotheticalItem.explanation}
                            </p>
                          </div>

                          <div className="p-2.5 sm:p-3 rounded-xl bg-[#020512] border border-cyan-500/20">
                            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-amber-300 font-bold block mb-1">
                              Governing Physics &amp; Mechanics:
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed break-words">
                              {activeHypotheticalItem.physicsMechanism}
                            </p>
                          </div>
                        </div>

                        {activeHypotheticalItem.distinguishingFeatures && activeHypotheticalItem.distinguishingFeatures.length > 0 && (
                          <div className="space-y-1.5 sm:space-y-2 min-w-0">
                            <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
                              Predicted Distinguishing Hallmarks
                            </h4>
                            <div className="grid grid-cols-1 gap-1 sm:gap-2 min-w-0">
                              {activeHypotheticalItem.distinguishingFeatures.map((feat, idx) => (
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
                      </div>

                      {/* Right Column: Physical Profile & Examples */}
                      <div className="lg:col-span-5 flex flex-col gap-2.5 sm:gap-3 min-w-0">
                        <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
                          Theoretical Profile
                        </h4>
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

                        {/* Direct Ancestral / Progenitor Stars in Catalog */}
                        {activeHypotheticalItem.exampleStarIds && activeHypotheticalItem.exampleStarIds.length > 0 && (
                          <ClassificationMappedStarsSection
                            title="Progenitor &amp; Relic Candidates in Catalog"
                            categoryColor={activeHypotheticalItem.colorHex}
                            benchmarkStarIds={activeHypotheticalItem.exampleStarIds}
                            allMappedStars={getExampleStars(activeHypotheticalItem.exampleStarIds)}
                            onSelectStar={onSelectStar}
                          />
                        )}

                        {/* Theoretical Candidates / Benchmark Models */}
                        {activeHypotheticalItem.externalExamples && activeHypotheticalItem.externalExamples.length > 0 && (
                          <div className="mt-0.5 sm:mt-1 p-2 sm:p-3 rounded-xl bg-[#020512] border border-cyan-500/20 min-w-0">
                            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-cyan-400 font-bold block mb-1 break-words">
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: STELLAR LIFE CYCLES                                           */}
      {/* ========================================================================= */}
      {activeSection === 'life-cycles' && (
        <StellarLifeCycleVisualizer2D onSelectStar={onSelectStar} />
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: COMMON MYTHS VS FACTS                                         */}
      {/* ========================================================================= */}
      {activeSection === 'myths' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-[#030612]/90 border border-cyan-500/20">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Astrophysics Myths Debunked
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STELLAR_MYTHS_GUIDE.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#040816]/90 border border-cyan-500/20 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-start gap-2 text-rose-300 text-xs font-bold font-mono">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>MYTH: "{item.myth}"</span>
                  </div>

                  <div className="flex items-start gap-2 text-emerald-300 text-xs font-bold font-mono mt-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>REALITY: {item.reality}</span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-[#020512] border border-slate-800 text-[11px] font-mono text-cyan-300/90">
                  <span className="text-slate-500">Takeaway: </span>
                  {item.keyTakeaway}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: KNOWLEDGE CHECK / QUIZ                                         */}
      {/* ========================================================================= */}
      {activeSection === 'quiz' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200 max-w-4xl mx-auto w-full">
          <div className="p-5 rounded-2xl bg-[#030612]/90 border border-cyan-500/25 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-400" />
                <span>Test Your Stellar Astrophysics Knowledge</span>
              </h3>
            </div>

            {quizSubmitted ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Your Score</span>
                  <span className="text-lg font-black font-mono text-cyan-300">
                    {quizScore} / {CLASSIFICATION_QUIZ.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setQuizSubmitted(true)}
                disabled={Object.keys(quizAnswers).length === 0}
                className={`px-4 py-2 rounded-xl font-bold text-xs font-mono transition-all cursor-pointer ${
                  Object.keys(quizAnswers).length > 0
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Submit Answers
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {CLASSIFICATION_QUIZ.map((q, idx) => {
              const selectedOptId = quizAnswers[q.id];
              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-[#040816]/90 border border-cyan-500/20 flex flex-col gap-3 shadow-sm"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-mono font-black text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                      Q{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-snug">{q.question}</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    {q.options.map((opt) => {
                      const isSelected = selectedOptId === opt.id;
                      const showResult = quizSubmitted;
                      const isCorrect = opt.isCorrect;

                      let btnStyle = 'bg-[#020512] border-slate-800 text-slate-300 hover:border-cyan-500/40';
                      if (isSelected && !showResult) {
                        btnStyle = 'bg-[#081530] border-cyan-400 text-white ring-1 ring-cyan-400';
                      } else if (showResult) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-200 ring-1 ring-rose-500 line-through';
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                          className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt.text}</span>
                          {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="mt-2 p-3 rounded-xl bg-[#020512] border border-cyan-500/20 text-xs text-slate-300">
                      <span className="text-cyan-400 font-mono font-bold block mb-0.5">Explanation:</span>
                      {q.options.find((o) => o.isCorrect)?.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
