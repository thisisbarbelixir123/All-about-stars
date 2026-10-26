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
import { AnimatedStarrySkyPanel } from './AnimatedStarrySkyPanel';
import { StarDot2D } from './StarDot2D';
import { RunningText } from './RunningText';
import {
  STELLAR_MYTHS_GUIDE,
  CLASSIFICATION_QUIZ,
} from '../data/classificationGuideData';
import {
  BookOpen,
  Sparkles,
  Sun,
  Flame,
  Layers,
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

interface StarEncyclopediaFrontpageProps {
  onSelectStar: (star: StarData) => void;
  onCompareStar: (star: StarData) => void;
  onJumpToCatalog?: () => void;
  onJumpToHRDiagram?: () => void;
  onJumpToConstellations?: () => void;
  onJumpToCatalogFilter?: (spectralClass?: string, stellarStage?: string) => void;
  onOpenClassification?: () => void;
  initialSection?: 'what-is-a-star' | 'spectral-classes' | 'luminosity-stages' | 'life-cycles' | 'myths' | 'quiz';
}

export const StarEncyclopediaFrontpage: React.FC<StarEncyclopediaFrontpageProps> = ({
  onSelectStar,
  onCompareStar,
  onJumpToCatalog,
  onJumpToHRDiagram,
  onJumpToConstellations,
  onJumpToCatalogFilter,
  onOpenClassification,
  initialSection = 'what-is-a-star',
}) => {
  // Main frontpage section tab (Stellar Classification detached to dedicated page)
  const [activeSection, setActiveSection] = useState<
    'what-is-a-star' | 'life-cycles' | 'myths' | 'quiz'
  >(() => {
    if (initialSection === 'life-cycles' || initialSection === 'myths' || initialSection === 'quiz') {
      return initialSection;
    }
    return 'what-is-a-star';
  });

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
    <div className="w-full bg-[#060a1a]/95 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl p-4 sm:p-6 lg:p-8 mobile-landscape:p-2 mobile-landscape:border-none shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col gap-6 relative overflow-hidden text-slate-200">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
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
          <span>What is a Star?</span>
        </button>

        {onOpenClassification && (
          <button
            id="tab-frontpage-goto-classification"
            onClick={onOpenClassification}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-orange-300 hover:bg-white/5 transition-all cursor-pointer"
            title="Open dedicated Stellar Classification Systems page"
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Classification Systems →</span>
          </button>
        )}

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
          <span>Stellar Life Cycles</span>
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
      {/* SECTION 1: WHAT IS A STAR?                                                */}
      {/* ========================================================================= */}
      {activeSection === 'what-is-a-star' && (
        <div className="flex flex-col gap-3 sm:gap-6 animate-in fade-in duration-200">
          {/* Hero Banner: What is a Star? (Wrapped in Animated Night Sky Graphics, compact for 800x360, spacious for tablet/desktop) */}
          <AnimatedStarrySkyPanel className="border border-cyan-500/30 mobile-landscape:p-3 mobile-landscape:py-2.5 p-5 sm:p-7 md:p-8 lg:p-10">
            <div className="space-y-3 mobile-landscape:space-y-1.5 md:space-y-3 max-w-3xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight flex items-center gap-3 mobile-landscape:text-lg mobile-landscape:gap-2">
                <Sun className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-amber-400 animate-pulse shrink-0 mobile-landscape:w-5 mobile-landscape:h-5" />
                <span>What is a Star?</span>
              </h1>

              <div className="space-y-2 mobile-landscape:space-y-1 md:space-y-2 text-slate-300 font-sans">
                <p className="text-sm sm:text-base md:text-lg text-slate-100 leading-relaxed mobile-landscape:text-xs mobile-landscape:leading-snug font-normal">
                  At its heart, a <strong className="text-cyan-300 font-semibold">star</strong> is a colossal, glowing ball of superheated gas held together by gravity. Deep inside its core, nuclear fusion turns hydrogen into helium, unleashing the brilliant light and warmth that shines across the cosmos for millions or billions of years—just like our own Sun!
                </p>
                <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed mobile-landscape:hidden sm:mobile-landscape:block md:block">
                  Every pinpoint of light in the night sky is a distant sun. From compact red dwarfs to giant luminous beacons, stars power the universe, illuminate orbiting worlds, and forge the fundamental chemical elements that build planets, oceans, and life itself.
                </p>
              </div>
            </div>
          </AnimatedStarrySkyPanel>

          {/* Cosmic Statistics / Key Numbers Ribbon: Four Info Panels */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 mobile-landscape:gap-1.5">
            <div className="p-2.5 sm:p-4 md:p-4 lg:p-5 rounded-xl bg-[#040816] border border-cyan-500/20 flex items-start sm:items-center gap-2 sm:gap-3 md:gap-3.5 min-w-0 overflow-hidden shadow-sm mobile-landscape:p-1.5 mobile-landscape:gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 shrink-0 aspect-square flex items-center justify-center mobile-landscape:w-6 mobile-landscape:h-6">
                <Atom className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mobile-landscape:w-3.5 mobile-landscape:h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[9px] sm:text-[10px] md:text-xs font-mono uppercase text-slate-400 leading-tight break-words" title="Estimated number of stars in the Milky Way Galaxy">
                  Milky Way Stars
                </div>
                <div className="text-[11px] sm:text-sm md:text-base lg:text-lg font-bold text-white font-mono leading-tight break-words mt-0.5 mobile-landscape:text-xs">
                  100–400 Billion
                </div>
              </div>
            </div>

            <div className="p-2.5 sm:p-4 md:p-4 lg:p-5 rounded-xl bg-[#040816] border border-cyan-500/20 flex items-start sm:items-center gap-2 sm:gap-3 md:gap-3.5 min-w-0 overflow-hidden shadow-sm mobile-landscape:p-1.5 mobile-landscape:gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-500/30 shrink-0 aspect-square flex items-center justify-center mobile-landscape:w-6 mobile-landscape:h-6">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mobile-landscape:w-3.5 mobile-landscape:h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[9px] sm:text-[10px] md:text-xs font-mono uppercase text-slate-400 leading-tight break-words" title="Estimated total stars across the observable universe">
                  Universe Stars
                </div>
                <div className="text-[11px] sm:text-sm md:text-base lg:text-lg font-bold text-white font-mono leading-tight break-words mt-0.5 mobile-landscape:text-xs">
                  <span>~2 × 10²⁴ Stars</span>
                  <span className="block text-[9px] sm:text-xs text-indigo-300/80 font-normal">
                    (2 Septillion)
                  </span>
                </div>
              </div>
            </div>

            <div className="p-2.5 sm:p-4 md:p-4 lg:p-5 rounded-xl bg-[#040816] border border-cyan-500/20 flex items-start sm:items-center gap-2 sm:gap-3 md:gap-3.5 min-w-0 overflow-hidden shadow-sm mobile-landscape:p-1.5 mobile-landscape:gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-500/30 shrink-0 aspect-square flex items-center justify-center mobile-landscape:w-6 mobile-landscape:h-6">
                <Scale className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mobile-landscape:w-3.5 mobile-landscape:h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[9px] sm:text-[10px] md:text-xs font-mono uppercase text-slate-400 leading-tight break-words" title="The mechanical equilibrium balancing inward gravity with outward pressure">
                  Core Equilibrium
                </div>
                <div className="text-[11px] sm:text-sm md:text-base lg:text-lg font-bold text-amber-300 font-mono leading-tight break-words mt-0.5 mobile-landscape:text-xs">
                  Hydrostatic Equilibrium
                </div>
              </div>
            </div>

            <div className="p-2.5 sm:p-4 md:p-4 lg:p-5 rounded-xl bg-[#040816] border border-cyan-500/20 flex items-start sm:items-center gap-2 sm:gap-3 md:gap-3.5 min-w-0 overflow-hidden shadow-sm mobile-landscape:p-1.5 mobile-landscape:gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-rose-950/80 text-rose-400 border border-rose-500/30 shrink-0 aspect-square flex items-center justify-center mobile-landscape:w-6 mobile-landscape:h-6">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mobile-landscape:w-3.5 mobile-landscape:h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[9px] sm:text-[10px] md:text-xs font-mono uppercase text-slate-400 leading-tight break-words" title="The nuclear process generating radiant power in stellar interiors">
                  Power Source
                </div>
                <div className="text-[11px] sm:text-sm md:text-base lg:text-lg font-bold text-rose-300 font-mono leading-tight break-words mt-0.5 mobile-landscape:text-xs">
                  Thermonuclear Fusion
                </div>
              </div>
            </div>
          </div>
          {/* Mobile Accessibility: Expand / Contract Toolbar with Separate Buttons */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-xl bg-[#040816] border border-cyan-500/20 mobile-landscape:p-1.5">
            <button
              type="button"
              id="btn-expand-all-star-panels"
              onClick={() => setAllPanels(true)}
              className="px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs sm:text-sm font-mono font-semibold transition-all cursor-pointer mobile-landscape:text-[11px] mobile-landscape:px-2 mobile-landscape:py-0.5"
            >
              Expand All
            </button>
            <button
              type="button"
              id="btn-collapse-all-star-panels"
              onClick={() => setAllPanels(false)}
              className="px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-mono font-semibold transition-all cursor-pointer mobile-landscape:text-[11px] mobile-landscape:px-2 mobile-landscape:py-0.5"
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
              className="w-full p-2.5 sm:p-4 md:p-5 flex items-center justify-between gap-2.5 text-left cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shrink-0 aspect-square flex items-center justify-center">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-300" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-cyan-300 uppercase tracking-wider font-mono break-words leading-snug">
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
              className="w-full p-2.5 sm:p-4 md:p-5 flex items-center justify-between gap-2.5 text-left cursor-pointer hover:bg-white/5 transition-colors border-b border-cyan-500/15"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 shrink-0 aspect-square flex items-center justify-center">
                  <Scale className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-white uppercase tracking-wider font-mono break-words leading-snug">
                    Hydrostatic Equilibrium: The Cosmic Balancing Act
                  </h3>
                </div>
              </div>
              <div className="shrink-0 p-1.5 rounded-lg bg-slate-900/80 text-cyan-300 border border-cyan-500/30">
                {expandedPanels['hydrostatic'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {expandedPanels['hydrostatic'] && (
              <div className="p-3 sm:p-6 md:p-6 flex flex-col mobile-landscape:flex-row md:flex-col gap-3 sm:gap-5 md:gap-5 animate-in fade-in duration-200 min-w-0 mobile-landscape:p-2 mobile-landscape:h-[calc(100vh-80px)] mobile-landscape:min-h-[220px] mobile-landscape:max-h-[265px] mobile-landscape:overflow-hidden md:h-auto md:min-h-0 md:max-h-none md:overflow-visible">
                {/* State Switcher - Restored top-right on Tablet & Desktop (Hidden on mobile landscape/portrait) */}
                <div className="hidden md:flex flex-row items-center justify-end gap-3">
                  <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#020512] rounded-xl border border-cyan-500/20 text-xs font-mono">
                    <button
                      onClick={() => setHydrostaticState('balanced')}
                      className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                        hydrostaticState === 'balanced'
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Balanced (Stable Star)
                    </button>
                    <button
                      onClick={() => setHydrostaticState('gravity-wins')}
                      className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                        hydrostaticState === 'gravity-wins'
                          ? 'bg-indigo-500 text-white font-bold shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Gravity Wins (Collapse)
                    </button>
                    <button
                      onClick={() => setHydrostaticState('radiation-wins')}
                      className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                        hydrostaticState === 'radiation-wins'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Radiation Wins (Expansion)
                    </button>
                  </div>
                </div>

                {/* Main Demonstrator Body: 2-panel on mobile landscape, 12-col grid on Tablet/Desktop, stack on mobile portrait */}
                <div className="flex flex-col mobile-landscape:flex-row md:grid md:grid-cols-12 md:items-center gap-3 sm:gap-6 md:gap-6 min-w-0">
                  {/* Left / Top Panel: Graphics ONLY (Animations alone on mobile landscape, with zero scrolling) */}
                  <div className="w-full mobile-landscape:w-5/12 md:w-auto md:col-span-5 min-w-0 mobile-landscape:h-full md:h-auto mobile-landscape:overflow-hidden md:overflow-visible flex flex-col items-center justify-center p-2 sm:p-6 rounded-xl bg-[#020512] border border-cyan-500/20 relative md:min-h-[260px]">
                    {/* Visual Star Core Simulation Stage */}
                    <div className="h-36 mobile-landscape:h-full md:h-44 flex items-center justify-center w-full relative">
                      <div
                        className={`rounded-full transition-all duration-500 flex items-center justify-center relative ${
                          hydrostaticState === 'balanced'
                            ? 'w-24 h-24 mobile-landscape:w-20 mobile-landscape:h-20 md:w-32 md:h-32 bg-gradient-to-r from-amber-400 to-yellow-200 shadow-[0_0_40px_rgba(251,191,36,0.5)]'
                            : hydrostaticState === 'gravity-wins'
                            ? 'w-16 h-16 mobile-landscape:w-14 mobile-landscape:h-14 md:w-20 md:h-20 bg-gradient-to-r from-indigo-500 to-blue-400 shadow-[0_0_30px_rgba(99,102,241,0.6)]'
                            : 'w-36 h-36 mobile-landscape:w-28 mobile-landscape:h-28 md:w-44 md:h-44 bg-gradient-to-r from-red-500 to-amber-400 shadow-[0_0_60px_rgba(239,68,68,0.7)]'
                        }`}
                      >
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-950 uppercase tracking-wider text-center px-1 select-none leading-tight">
                          {hydrostaticState === 'balanced'
                            ? 'Stable Radius'
                            : hydrostaticState === 'gravity-wins'
                            ? 'Core Contraction'
                            : 'Envelope Expansion'}
                        </span>
                      </div>
                    </div>

                    {/* Hydrostatic Equation Badge (Hidden on mobile landscape, visible on tablet/desktop) */}
                    {hydrostaticState === 'balanced' && (
                      <div className="mt-2 mobile-landscape:hidden md:block text-[10px] font-mono font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30 shadow-sm animate-in fade-in duration-200">
                        dP/dr = -ρ·g
                      </div>
                    )}

                    {/* Force Vector Legend (Hidden on mobile landscape, visible on tablet/desktop) */}
                    <div className="mt-4 mobile-landscape:hidden md:flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] font-mono px-2 py-1.5 rounded-lg bg-[#040816] border border-cyan-500/15">
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

                  {/* Right / Bottom Panel: Everything Else (Scrollable with bounded container on mobile landscape, natural on tablet/desktop) */}
                  <div className="w-full mobile-landscape:w-7/12 md:w-auto md:col-span-7 min-w-0 mobile-landscape:h-full md:h-auto mobile-landscape:overflow-y-auto md:overflow-visible scrollbar-thin flex flex-col justify-start md:justify-center gap-3 sm:gap-4 pr-1 md:pr-0">
                    {/* Telemetry / Legend for mobile landscape only */}
                    <div className="hidden mobile-landscape:flex md:hidden flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono px-2 py-1 rounded-lg bg-[#040816] border border-cyan-500/15">
                      <div className="flex items-center gap-1 text-cyan-400">
                        <ArrowRight className="w-3 h-3 rotate-180" />
                        <span>Gravity (F_g)</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        <ArrowRight className="w-3 h-3" />
                        <span>Pressure (P_rad+gas)</span>
                      </div>
                      {hydrostaticState === 'balanced' && (
                        <span className="text-amber-300 font-bold">dP/dr = -ρ·g</span>
                      )}
                    </div>

                    {/* State Switcher for Mobile (Portrait & Landscape) */}
                    <div className="flex md:hidden flex-wrap items-center gap-1.5 p-1 bg-[#020512] rounded-xl border border-cyan-500/20 text-xs font-mono w-full">
                      <button
                        onClick={() => setHydrostaticState('balanced')}
                        className={`flex-1 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold text-center ${
                          hydrostaticState === 'balanced'
                            ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Balanced (Stable Star)
                      </button>
                      <button
                        onClick={() => setHydrostaticState('gravity-wins')}
                        className={`flex-1 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold text-center ${
                          hydrostaticState === 'gravity-wins'
                            ? 'bg-indigo-500 text-white font-bold shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Gravity Wins (Collapse)
                      </button>
                      <button
                        onClick={() => setHydrostaticState('radiation-wins')}
                        className={`flex-1 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold text-center ${
                          hydrostaticState === 'radiation-wins'
                            ? 'bg-amber-500 text-slate-950 font-bold shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Radiation Wins (Expansion)
                      </button>
                    </div>

                    <div className="flex flex-col gap-3 text-xs leading-relaxed my-auto md:my-0">
                      {hydrostaticState === 'balanced' && (
                        <div className="space-y-2.5">
                          <div className="text-sm font-bold text-cyan-300 font-mono flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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
                        <div className="space-y-2.5">
                          <div className="text-sm font-bold text-indigo-300 font-mono flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0" />
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
                        <div className="space-y-2.5">
                          <div className="text-sm font-bold text-amber-300 font-mono flex items-center gap-2">
                            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
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
              </div>
            )}
          </div>

          {/* Panel 3: Stellar Anatomy Visualized Using Cross-Section (Expandable/Contractable) */}
          <div className="rounded-2xl bg-[#040816] border border-cyan-500/25 overflow-hidden transition-all">
            <button
              type="button"
              id="btn-toggle-panel-anatomy"
              onClick={() => togglePanel('anatomy')}
              className="w-full p-2.5 sm:p-4 md:p-5 flex items-center justify-between gap-2.5 text-left cursor-pointer hover:bg-white/5 transition-colors border-b border-cyan-500/15"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 shrink-0 aspect-square flex items-center justify-center">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-white uppercase tracking-wider font-mono break-words leading-snug">
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
              className="w-full p-2.5 sm:p-4 md:p-5 flex items-center justify-between gap-2.5 text-left cursor-pointer hover:bg-white/5 transition-colors border-b border-cyan-500/15"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/30 shrink-0 aspect-square flex items-center justify-center">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-white uppercase tracking-wider font-mono break-words leading-snug">
                    The Thermonuclear Engine: How Stars Generate Energy
                  </h3>
                </div>
              </div>
              <div className="shrink-0 p-1.5 rounded-lg bg-slate-900/80 text-cyan-300 border border-cyan-500/30">
                {expandedPanels['thermonuclear'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {expandedPanels['thermonuclear'] && (
              <div className="p-3 sm:p-6 animate-in fade-in duration-200 overflow-x-hidden">
                <ThermonuclearEngineVisualizer
                  selectedFusionId={selectedFusionId}
                  onSelectFusionId={setSelectedFusionId}
                />
              </div>
            )}
          </div>

          {/* Panel 5: Fundamental Physical Properties of Stars (Expandable/Contractable) */}
          <div className="rounded-2xl bg-[#040816] border border-cyan-500/25 overflow-hidden transition-all">
            <button
              type="button"
              id="btn-toggle-panel-properties"
              onClick={() => togglePanel('properties')}
              className="w-full p-2.5 sm:p-4 md:p-5 flex items-center justify-between gap-2.5 text-left cursor-pointer hover:bg-white/5 transition-colors border-b border-cyan-500/15"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 shrink-0 aspect-square flex items-center justify-center">
                  <Sliders className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-white uppercase tracking-wider font-mono break-words leading-snug">
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
      {/* SECTION 4: STELLAR LIFE CYCLES                                           */}
      {/* ========================================================================= */}
      {activeSection === 'life-cycles' && (
        <StellarLifeCycleVisualizer2D onSelectStar={onSelectStar} />
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: COMMON MYTHS VS FACTS                                         */}
      {/* ========================================================================= */}
      {activeSection === 'myths' && (
        <div className="flex flex-col gap-3 sm:gap-6 animate-in fade-in duration-200">
          {/* Hero Banner: Myths & Realities (Compact on mobile landscape) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-5 md:p-6 lg:p-7 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-4">
              <div className="space-y-1 sm:space-y-2 max-w-3xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mobile-landscape:text-base font-black text-white tracking-tight flex items-center gap-2 sm:gap-3">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 mobile-landscape:w-4 mobile-landscape:h-4 text-amber-400 shrink-0" />
                  <span>Myths &amp; Realities</span>
                </h2>
                <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 leading-relaxed font-sans">
                  Uncover widespread science-fiction tropes, visual misconceptions, and historical lore—contrasted directly against empirical astrophysical measurements and nuclear realities.
                </p>
              </div>
            </div>
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
        <div className="flex flex-col gap-3 sm:gap-6 animate-in fade-in duration-200 max-w-4xl mx-auto w-full">
          {/* Hero Banner: Knowledge Check (Compact on mobile landscape) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-5 md:p-6 lg:p-7 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-4">
              <div className="space-y-1 sm:space-y-2 max-w-2xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mobile-landscape:text-base font-black text-white tracking-tight flex items-center gap-2 sm:gap-3">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 mobile-landscape:w-4 mobile-landscape:h-4 text-purple-400 shrink-0" />
                  <span>Knowledge Check</span>
                </h2>
                <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 leading-relaxed font-sans">
                  Put your astrophysical comprehension to the test with these fundamental questions spanning stellar structure, spectral types, nuclear synthesis, and cosmic evolution.
                </p>
              </div>

              {quizSubmitted ? (
                <div className="flex items-center gap-3 shrink-0">
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
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(quizAnswers).length === 0}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs font-mono transition-all cursor-pointer shrink-0 shadow-md ${
                    Object.keys(quizAnswers).length > 0
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  Grade Quiz ({Object.keys(quizAnswers).length}/{CLASSIFICATION_QUIZ.length})
                </button>
              )}
            </div>
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


    </div>
  );
};
