import React, { useState, useMemo, useEffect, useRef } from 'react';
import { StarData } from '../types';
import { STARS_CATALOG } from '../data/stars';
import {
  STELLAR_DISCOVERY_METHODS,
  STELLAR_DISCOVERY_TIMELINE,
  HISTORIC_AND_MODERN_TELESCOPES,
  DISCOVERY_MILESTONES_BY_CLASS,
  DiscoveryTimelineRecord,
  TelescopeRecord,
  DiscoveryMethodRecord,
} from '../data/stellarDiscoveryData';
import { MethodScienceGraphic } from './MethodScienceGraphic';
import { StarDot2D } from './StarDot2D';
import { RunningText } from './RunningText';
import {
  Telescope,
  History,
  Radio,
  Sparkles,
  Bookmark,
  Hash,
  Search,
  ChevronRight,
  ChevronLeft,
  Eye,
  Activity,
  Compass,
  Globe,
  SlidersHorizontal,
  ExternalLink,
  Layers,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface StellarDiscoveryGuideProps {
  onSelectStar?: (star: StarData) => void;
  onCompareStar?: (star: StarData) => void;
  onJumpToCatalog?: (searchQuery?: string) => void;
  onOpenNomenclature?: () => void;
  initialTopic?: DiscoveryTopicId;
}

export type DiscoveryTopicId =
  | 'how-discovered'
  | 'timeline'
  | 'telescopes'
  | 'milestones';

interface DiscoveryTopicNav {
  id: DiscoveryTopicId;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const DISCOVERY_TOPICS: DiscoveryTopicNav[] = [
  { id: 'how-discovered', title: 'How Stars are Discovered', shortTitle: 'Methods', icon: Eye, tag: 'Observational Physics' },
  { id: 'timeline', title: 'Timeline of Stellar Discovery', shortTitle: 'Timeline', icon: History, tag: '1609 → Present' },
  { id: 'telescopes', title: 'Telescopes We Use to See Stars', shortTitle: 'Telescopes', icon: Telescope, tag: 'Ground & Space' },
  { id: 'milestones', title: 'Firsts & Milestones by Class', shortTitle: 'Milestones', icon: Sparkles, tag: 'Historic Firsts' },
];

export const PIONEER_SPOTLIGHTS = [
  {
    id: 'galileo',
    name: 'Galileo Galilei',
    eraBadge: '1609 CE',
    location: 'Padua, Venice',
    title: 'Father of Observational Astronomy',
    desc: 'Turned his handcrafted refractor to the heavens in 1617, discovering that Mizar in the Big Dipper is a telescopic binary star system—the first telescopic double star in human history.',
    starId: 'mizar-a',
    image: '/assets/galileo_galilei.jpg',
    caption: 'Portrait: Justus Sustermans (1636)',
    accentColor: '#38bdf8',
  },
  {
    id: 'halley',
    name: 'Edmond Halley',
    eraBadge: '1718 CE',
    location: 'Greenwich, England',
    title: 'Discovered Stellar Proper Motion',
    desc: 'Proved stars are not "fixed" by measuring shifts in Sirius, Arcturus, and Aldebaran over 1,800 years.',
    image: '/assets/edmond_halley.jpg',
    caption: 'Portrait: Thomas Murray (c. 1712)',
    accentColor: '#f59e0b',
  },
  {
    id: 'herschel',
    name: 'Sir William Herschel',
    eraBadge: '1802 CE',
    location: 'Slough, England',
    title: 'Pioneer of Binary Stars & Deep Sky Sweeps',
    desc: 'Demonstrated gravitational orbital motion in binary stars like Castor and constructed the monumental 40-foot reflector.',
    image: '/assets/william_herschel.jpg',
    caption: 'Portrait: Lemuel Francis Abbott (1785)',
    accentColor: '#fb923c',
  },
  {
    id: 'bell-burnell',
    name: 'Dame Jocelyn Bell Burnell',
    eraBadge: '1967 CE',
    location: 'Cambridge, UK',
    title: 'Discovered the First Radio Pulsar',
    desc: 'Identified periodic 1.337-second radio flashes from PSR B1919+21, empirically confirming neutron stars.',
    image: '/assets/jocelyn_bell_burnell.jpg',
    caption: 'Photograph: Cambridge Archive (1967)',
    accentColor: '#a78bfa',
  },
];

export const StellarDiscoveryGuide: React.FC<StellarDiscoveryGuideProps> = ({
  onSelectStar,
  onCompareStar,
  onJumpToCatalog,
  onOpenNomenclature,
  initialTopic = 'how-discovered',
}) => {
  const [activeTopic, setActiveTopic] = useState<DiscoveryTopicId>(initialTopic);
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);
  const currentSpotlight = PIONEER_SPOTLIGHTS[spotlightIndex];

  // 1. Methods Carousel State
  const [activeMethodIndex, setActiveMethodIndex] = useState<number>(0);
  const activeMethod = STELLAR_DISCOVERY_METHODS[activeMethodIndex] || STELLAR_DISCOVERY_METHODS[0];

  const handlePrevMethod = () => {
    setActiveMethodIndex((prev) => (prev > 0 ? prev - 1 : STELLAR_DISCOVERY_METHODS.length - 1));
  };
  const handleNextMethod = () => {
    setActiveMethodIndex((prev) => (prev < STELLAR_DISCOVERY_METHODS.length - 1 ? prev + 1 : 0));
  };

  // 2. Timeline Carousel State
  const [activeTimelineIndex, setActiveTimelineIndex] = useState<number>(0);
  const activeTimelineItem = STELLAR_DISCOVERY_TIMELINE[activeTimelineIndex] || STELLAR_DISCOVERY_TIMELINE[0];

  const handlePrevTimeline = () => {
    setActiveTimelineIndex((prev) => (prev > 0 ? prev - 1 : STELLAR_DISCOVERY_TIMELINE.length - 1));
  };
  const handleNextTimeline = () => {
    setActiveTimelineIndex((prev) => (prev < STELLAR_DISCOVERY_TIMELINE.length - 1 ? prev + 1 : 0));
  };

  // 3. Telescopes Carousel State
  const [activeTelescopeIndex, setActiveTelescopeIndex] = useState<number>(0);
  const activeTelescope = HISTORIC_AND_MODERN_TELESCOPES[activeTelescopeIndex] || HISTORIC_AND_MODERN_TELESCOPES[0];

  const handlePrevTelescope = () => {
    setActiveTelescopeIndex((prev) => (prev > 0 ? prev - 1 : HISTORIC_AND_MODERN_TELESCOPES.length - 1));
  };
  const handleNextTelescope = () => {
    setActiveTelescopeIndex((prev) => (prev < HISTORIC_AND_MODERN_TELESCOPES.length - 1 ? prev + 1 : 0));
  };

  // Helper: map starId to real StarData in STARS_CATALOG
  const getCatalogStar = (catalogId?: string): StarData | null => {
    if (!catalogId) return null;
    return STARS_CATALOG.find((s) => s.id === catalogId) || null;
  };

  // Auto-scroll chapter buttons into view when carousel index changes
  useEffect(() => {
    const activeBtn = document.getElementById(`btn-method-chapter-${activeMethodIndex}`);
    if (activeBtn && activeBtn.parentElement) {
      const container = activeBtn.parentElement;
      if (container.scrollWidth > container.clientWidth) {
        const targetScrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);
        container.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
      }
    }
  }, [activeMethodIndex]);

  useEffect(() => {
    const activeBtn = document.getElementById(`btn-timeline-chapter-${activeTimelineIndex}`);
    if (activeBtn && activeBtn.parentElement) {
      const container = activeBtn.parentElement;
      if (container.scrollWidth > container.clientWidth) {
        const targetScrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);
        container.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
      }
    }
  }, [activeTimelineIndex]);

  useEffect(() => {
    const activeBtn = document.getElementById(`btn-telescope-chapter-${activeTelescopeIndex}`);
    if (activeBtn && activeBtn.parentElement) {
      const container = activeBtn.parentElement;
      if (container.scrollWidth > container.clientWidth) {
        const targetScrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);
        container.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
      }
    }
  }, [activeTelescopeIndex]);

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full text-slate-200">
      {/* 1. Header Banner (Uniform Hero Section) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-6 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mobile-landscape:gap-2">
          <div className="space-y-1 sm:space-y-2 max-w-3xl">
            <h1 className="text-base sm:text-2xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-3">
              <Telescope className="w-5 h-5 sm:w-7 sm:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-cyan-400 shrink-0" />
              <span>How Humankind Discovers the Stars</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
              Explore the instruments, observational physics, revolutionary milestones, and naming conventions that transformed stars from mythical points of light into mapped, weighed, and classified astrophysical engines.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 mobile-landscape:px-2 mobile-landscape:py-0.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] sm:text-xs font-bold shadow-sm">
              4 Observational Pillars
            </span>
          </div>
        </div>
      </div>

      {/* 2. Chapters of Discovery Navigation Bar */}
      <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-[#020512]/90 rounded-2xl border border-cyan-500/25 overflow-x-auto no-scrollbar shrink-0">
        {DISCOVERY_TOPICS.map((topic) => {
          const isActive = activeTopic === topic.id;
          return (
            <button
              key={topic.id}
              id={`btn-discovery-chapter-${topic.id}`}
              onClick={() => setActiveTopic(topic.id)}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {topic.title}
            </button>
          );
        })}
      </div>

      {/* 3. SUB-SECTION: HOW STARS ARE DISCOVERED */}
      {activeTopic === 'how-discovered' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Sub-tab Hero Banner: How Stars Are Discovered */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-5 md:p-6 lg:p-7 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
              <div className="space-y-1 sm:space-y-1.5 md:space-y-2 max-w-3xl">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-2.5 md:gap-3">
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-cyan-400 shrink-0" />
                  <span>How Stars Are Discovered</span>
                </h2>
                <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
                  Explore the fundamental observational methodologies humankind uses to detect, resolve, and characterize stars across cosmic distances—from astrometric parallax and spectroscopy to gravitational microlensing and space interferometry.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] sm:text-xs font-bold shadow-sm">
                  {STELLAR_DISCOVERY_METHODS.length} Methodologies
                </span>
              </div>
            </div>
          </div>

          {/* Chapter Buttons for Discovery Methods (Styled like Stellar Classification, with star dots) */}
          <div className="flex items-stretch gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-cyan-500/30 w-full">
            {STELLAR_DISCOVERY_METHODS.map((method, idx) => {
              const isSelected = idx === activeMethodIndex;
              const methodStar = getCatalogStar(method.famousDiscoveredStarId);
              return (
                <button
                  key={method.id}
                  id={`btn-method-chapter-${idx}`}
                  onClick={() => setActiveMethodIndex(idx)}
                  className={`p-2 sm:p-2.5 md:p-3 mobile-landscape:p-1.5 rounded-xl sm:rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between shrink-0 min-w-[130px] sm:min-w-[160px] max-w-[200px] min-h-[48px] sm:min-h-[60px] md:min-h-[64px] mobile-landscape:min-h-[44px] ${
                    isSelected
                      ? 'bg-[#09132e] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400'
                      : 'bg-[#040816]/90 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#070f24]'
                  }`}
                  title={method.name}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className="text-[10px] font-mono text-cyan-400/90 font-semibold truncate block">
                      {method.eraIntroduced.split(' ')[0]}
                    </span>
                    {methodStar && <StarDot2D star={methodStar} sizeClassName="w-2.5 h-2.5" />}
                  </div>
                  <div className="w-full text-left leading-tight min-w-0 mt-0.5">
                    <RunningText
                      text={method.name.split('&')[0].trim()}
                      className={`text-xs sm:text-sm font-bold block ${isSelected ? 'text-white' : 'text-slate-300'}`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Methods Carousel Card */}
          {(() => {
            const star = getCatalogStar(activeMethod.famousDiscoveredStarId);
            return (
              <div className="w-full max-w-full p-3.5 sm:p-5 md:p-6 lg:p-8 mobile-landscape:p-2.5 mobile-landscape:py-2 rounded-2xl bg-[#040816]/95 border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3 sm:gap-5 md:gap-6 relative">
                {/* Header with Carousel Navigation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-cyan-500/15 pb-2.5 sm:pb-3.5 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={handlePrevMethod}
                      className="p-1.5 sm:p-2 md:p-2.5 mobile-landscape:p-1 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                      title="Previous method"
                      aria-label="Previous card"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 mobile-landscape:w-3.5 mobile-landscape:h-3.5" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold font-mono text-white break-words" style={{ color: activeMethod.accentColor }}>
                          {activeMethod.name}
                        </h3>
                        <span className="text-[11px] font-mono text-cyan-400/90 font-semibold shrink-0">
                          ({activeMethodIndex + 1}/{STELLAR_DISCOVERY_METHODS.length})
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-mono truncate">
                        Introduced: {activeMethod.eraIntroduced} · Pioneers: {activeMethod.pioneeringScientist}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextMethod}
                      className="p-1.5 sm:p-2 md:p-2.5 mobile-landscape:p-1 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                      title="Next method"
                      aria-label="Next card"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 mobile-landscape:w-3.5 mobile-landscape:h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Interactive Method Science Graphic Showing How It Is Done (Full Width of Panel, Zero Wasted Space) */}
                <div className="w-full">
                  <MethodScienceGraphic
                    methodId={activeMethod.id}
                    methodName={activeMethod.name}
                    accentColor={activeMethod.accentColor}
                  />
                </div>

                {/* Explanation & Key Specs Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 min-w-0">
                  {/* Left Column: Physical Principle, How It Works, Targets & Limits */}
                  <div className="lg:col-span-7 flex flex-col justify-between gap-3 sm:gap-4 min-w-0">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1 flex items-center gap-1.5">
                          <span>Physical Principle</span>
                        </h4>
                        <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] text-slate-200 leading-relaxed font-sans">
                          {activeMethod.primaryPrinciple}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-mono uppercase text-white font-bold mb-1 flex items-center gap-1.5">
                          <span>How It Works</span>
                        </h4>
                        <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] text-slate-300 leading-relaxed font-sans">
                          {activeMethod.howItWorks}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        <div className="p-2.5 sm:p-3 rounded-xl bg-black/40 border border-cyan-500/20">
                          <span className="text-[10px] font-mono text-cyan-300 uppercase block font-semibold">Key Stellar Targets</span>
                          <span className="text-xs md:text-sm mobile-landscape:text-[11px] text-slate-300 font-sans mt-0.5 block">{activeMethod.keyStellarTargets}</span>
                        </div>
                        <div className="p-2.5 sm:p-3 rounded-xl bg-black/40 border border-amber-500/20">
                          <span className="text-[10px] font-mono text-amber-300 uppercase block font-semibold">Limits &amp; Challenges</span>
                          <span className="text-xs md:text-sm mobile-landscape:text-[11px] text-slate-300 font-sans mt-0.5 block">{activeMethod.limitsAndChallenges}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Specimen Image & Associated Star Dossier */}
                  <div className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-4 min-w-0">
                    {activeMethod.imageUrl && (
                      <div className="rounded-xl overflow-hidden border border-cyan-500/40 shadow-lg bg-[#020512] flex flex-col mobile-landscape:flex-row mobile-landscape:items-stretch">
                        <div className="w-full mobile-landscape:w-auto bg-black/60 flex items-center justify-center mobile-landscape:justify-start mobile-landscape:items-start p-2 sm:p-3 md:p-4 mobile-landscape:p-2 min-h-[200px] sm:min-h-[240px] md:min-h-[260px] lg:min-h-[300px] mobile-landscape:min-h-0 mobile-landscape:shrink-0 mobile-landscape:border-r mobile-landscape:border-cyan-500/20">
                          <img
                            src={activeMethod.imageUrl}
                            alt={activeMethod.imageCaption || activeMethod.name}
                            className="max-h-60 sm:max-h-72 md:max-h-72 lg:max-h-80 mobile-landscape:h-24 mobile-landscape:max-h-24 mobile-landscape:w-auto w-auto max-w-full rounded-lg shadow-md object-contain transition-transform duration-300 hover:scale-[1.02]"
                          />
                        </div>
                        {activeMethod.imageCaption && (
                          <div className="p-2 sm:p-2.5 text-[10px] sm:text-[11px] font-mono text-slate-300 bg-black/80 mobile-landscape:bg-transparent border-t mobile-landscape:border-t-0 border-cyan-500/20 leading-snug mobile-landscape:flex-1 mobile-landscape:flex mobile-landscape:items-center mobile-landscape:p-3">
                            {activeMethod.imageCaption}
                          </div>
                        )}
                      </div>
                    )}

                    {star && (
                      <div
                        onClick={() => onSelectStar && onSelectStar(star)}
                        className="p-2.5 sm:p-3 md:p-3.5 rounded-xl bg-slate-900/80 hover:bg-[#071333] border border-cyan-500/40 hover:border-cyan-400 transition-all flex items-center justify-between gap-2.5 md:gap-3 cursor-pointer group shadow-sm"
                        title={`Open ${star.name} Dossier`}
                      >
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase tracking-wider font-mono text-cyan-400">
                            Iconic Discovered Star:
                          </div>
                          <div className="min-w-0 overflow-hidden">
                            <RunningText
                              text={activeMethod.famousDiscoveredStarName}
                              className="text-xs sm:text-sm font-mono font-bold text-white group-hover:text-cyan-300 transition-colors"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-mono text-cyan-400 font-semibold shrink-0">
                          <span>3D Dossier</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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

      {/* 4. SUB-SECTION: TIMELINE OF STELLAR DISCOVERY */}
      {activeTopic === 'timeline' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Sub-tab Hero Banner: Timeline of Stellar Discovery */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-5 md:p-6 lg:p-7 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
              <div className="space-y-1 sm:space-y-1.5 md:space-y-2 max-w-3xl">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-2.5 md:gap-3">
                  <History className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-cyan-400 shrink-0" />
                  <span>Timeline of Stellar Discovery</span>
                </h2>
                <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
                  Journey chronologically from the dawn of telescopic astronomy in 1609 through modern space interferometry and distant cosmic dawn observations.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] sm:text-xs font-bold shadow-sm">
                  {STELLAR_DISCOVERY_TIMELINE.length} Epochs
                </span>
              </div>
            </div>
          </div>

          {/* Chapter Buttons for Timeline Milestones (Styled like Stellar Classification, with star dots) */}
          <div className="flex items-stretch gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-cyan-500/30 w-full">
            {STELLAR_DISCOVERY_TIMELINE.map((item, idx) => {
              const isSelected = idx === activeTimelineIndex;
              const timelineStar = getCatalogStar(item.relatedStarId);
              return (
                <button
                  key={item.year}
                  id={`btn-timeline-chapter-${idx}`}
                  onClick={() => setActiveTimelineIndex(idx)}
                  className={`p-2 sm:p-2.5 md:p-3 mobile-landscape:p-1.5 rounded-xl sm:rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between shrink-0 min-w-[130px] sm:min-w-[160px] max-w-[200px] min-h-[48px] sm:min-h-[60px] md:min-h-[64px] mobile-landscape:min-h-[44px] ${
                    isSelected
                      ? 'bg-[#09132e] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400'
                      : 'bg-[#040816]/90 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#070f24]'
                  }`}
                  title={item.title}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold shrink-0 w-fit">
                      {item.yearDisplay}
                    </span>
                    {timelineStar && <StarDot2D star={timelineStar} sizeClassName="w-2.5 h-2.5" />}
                  </div>
                  <div className="w-full text-left leading-tight min-w-0 mt-0.5">
                    <RunningText
                      text={item.title}
                      className={`text-xs sm:text-sm font-bold block ${isSelected ? 'text-white' : 'text-slate-300'}`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Timeline Carousel Card */}
          {(() => {
            const star = getCatalogStar(activeTimelineItem.relatedStarId);
            return (
              <div className="w-full max-w-full p-3.5 sm:p-5 md:p-6 lg:p-8 mobile-landscape:p-2.5 mobile-landscape:py-2 rounded-2xl bg-[#040816]/95 border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3 sm:gap-5 md:gap-6 relative">
                {/* Header with Carousel Navigation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-cyan-500/15 pb-2.5 sm:pb-3.5 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={handlePrevTimeline}
                      className="p-1.5 sm:p-2 md:p-2.5 mobile-landscape:p-1 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                      title="Previous timeline milestone"
                      aria-label="Previous milestone"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 mobile-landscape:w-3.5 mobile-landscape:h-3.5" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] sm:text-xs font-bold shrink-0">
                          {activeTimelineItem.yearDisplay}
                        </span>
                        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white break-words">
                          {activeTimelineItem.title}
                        </h3>
                        <span className="text-[11px] font-mono text-cyan-400/90 font-semibold shrink-0">
                          ({activeTimelineIndex + 1}/{STELLAR_DISCOVERY_TIMELINE.length})
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-mono truncate">
                        {activeTimelineItem.discovererOrMission} · {activeTimelineItem.observatoryOrInstitution} ({activeTimelineItem.era})
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextTimeline}
                      className="p-1.5 sm:p-2 md:p-2.5 mobile-landscape:p-1 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                      title="Next timeline milestone"
                      aria-label="Next milestone"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 mobile-landscape:w-3.5 mobile-landscape:h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Body: Specimen & Detailed Narrative Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 min-w-0">
                  {/* Left Column: Specimen Image or Overview */}
                  <div className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-4 min-w-0">
                    {activeTimelineItem.imageUrl ? (
                      <div className="rounded-xl overflow-hidden border border-cyan-500/40 shadow-lg bg-[#020512] flex flex-col mobile-landscape:flex-row mobile-landscape:items-stretch">
                        <div className="w-full mobile-landscape:w-auto bg-black/60 flex items-center justify-center mobile-landscape:justify-start mobile-landscape:items-start p-2 sm:p-3 md:p-4 mobile-landscape:p-2 min-h-[200px] sm:min-h-[240px] md:min-h-[260px] lg:min-h-[300px] mobile-landscape:min-h-0 mobile-landscape:shrink-0 mobile-landscape:border-r mobile-landscape:border-cyan-500/20">
                          <img
                            src={activeTimelineItem.imageUrl}
                            alt={activeTimelineItem.imageCaption || activeTimelineItem.title}
                            className="max-h-60 sm:max-h-72 md:max-h-72 lg:max-h-80 mobile-landscape:h-24 mobile-landscape:max-h-24 mobile-landscape:w-auto w-auto max-w-full rounded-lg shadow-md object-contain transition-transform duration-300 hover:scale-[1.02]"
                          />
                        </div>
                        {activeTimelineItem.imageCaption && (
                          <div className="p-2 sm:p-2.5 text-[10px] sm:text-[11px] font-mono text-slate-300 bg-black/80 mobile-landscape:bg-transparent border-t mobile-landscape:border-t-0 border-cyan-500/20 leading-snug mobile-landscape:flex-1 mobile-landscape:flex mobile-landscape:items-center mobile-landscape:p-3">
                            {activeTimelineItem.imageCaption}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 sm:p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 space-y-1.5">
                        <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">Historical Epoch</span>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed">
                          Landmark discovery recorded during the {activeTimelineItem.era}.
                        </p>
                      </div>
                    )}

                    {star && (
                      <div
                        onClick={() => onSelectStar && onSelectStar(star)}
                        className="p-2.5 sm:p-3 md:p-3.5 rounded-xl bg-slate-900/80 hover:bg-[#071333] border border-cyan-500/40 hover:border-cyan-400 transition-all flex items-center justify-between gap-2.5 md:gap-3 cursor-pointer group shadow-sm"
                        title={`Open ${star.name} Dossier`}
                      >
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase tracking-wider font-mono text-cyan-400">
                            Related Stellar Discovery:
                          </div>
                          <div className="min-w-0 overflow-hidden">
                            <RunningText
                              text={activeTimelineItem.relatedStarName}
                              className="text-xs sm:text-sm font-mono font-bold text-white group-hover:text-cyan-300 transition-colors"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-mono text-cyan-400 font-semibold shrink-0">
                          <span>3D Dossier</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Narrative & Significance */}
                  <div className="lg:col-span-7 flex flex-col justify-between gap-3 sm:gap-4 min-w-0">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1">
                          Discovery Narrative
                        </h4>
                        <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] text-slate-200 leading-relaxed font-sans">
                          {activeTimelineItem.description}
                        </p>
                      </div>

                      <div className="p-2.5 sm:p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-1">
                        <strong className="text-cyan-300 font-mono text-[11px] uppercase block">
                          Astrophysical Significance:
                        </strong>
                        <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] text-slate-300 font-sans leading-relaxed">
                          {activeTimelineItem.astrophysicalSignificance}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 5. SUB-SECTION: TELESCOPES WE USE */}
      {activeTopic === 'telescopes' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Sub-tab Hero Banner: The Telescopes That Unmasked the Stars */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-5 md:p-6 lg:p-7 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
              <div className="space-y-1 sm:space-y-1.5 md:space-y-2 max-w-3xl">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-2.5 md:gap-3">
                  <Telescope className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-cyan-400 shrink-0" />
                  <span>The Telescopes That Unmasked the Stars</span>
                </h2>
                <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
                  Explore the legendary instruments—from Galileo’s 1609 refracting tube to modern giant segmented reflectors and space infrared observatories—that expanded humanity's cosmic vision.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] sm:text-xs font-bold shadow-sm">
                  {HISTORIC_AND_MODERN_TELESCOPES.length} Instruments
                </span>
              </div>
            </div>
          </div>

          {/* Chapter Buttons for Telescopes (Styled like Stellar Classification, with star dots) */}
          <div className="flex items-stretch gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-cyan-500/30 w-full">
            {HISTORIC_AND_MODERN_TELESCOPES.map((tel, idx) => {
              const isSelected = idx === activeTelescopeIndex;
              const telStar = getCatalogStar(tel.featuredStarId);
              return (
                <button
                  key={tel.id}
                  id={`btn-telescope-chapter-${idx}`}
                  onClick={() => setActiveTelescopeIndex(idx)}
                  className={`p-2 sm:p-2.5 md:p-3 mobile-landscape:p-1.5 rounded-xl sm:rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between shrink-0 min-w-[130px] sm:min-w-[160px] max-w-[200px] min-h-[48px] sm:min-h-[60px] md:min-h-[64px] mobile-landscape:min-h-[44px] ${
                    isSelected
                      ? 'bg-[#09132e] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400'
                      : 'bg-[#040816]/90 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#070f24]'
                  }`}
                  title={tel.name}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className="text-[10px] font-mono text-cyan-400/90 font-semibold truncate block">
                      {tel.launchOrFirstLight}
                    </span>
                    {telStar && <StarDot2D star={telStar} sizeClassName="w-2.5 h-2.5" />}
                  </div>
                  <div className="w-full text-left leading-tight min-w-0 mt-0.5">
                    <RunningText
                      text={tel.name}
                      className={`text-xs sm:text-sm font-bold block ${isSelected ? 'text-white' : 'text-slate-300'}`}
                      style={isSelected ? { color: tel.accentColor } : {}}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Telescopes Carousel Card */}
          {(() => {
            const star = getCatalogStar(activeTelescope.featuredStarId);
            return (
              <div className="w-full max-w-full p-3.5 sm:p-5 md:p-6 lg:p-8 mobile-landscape:p-2.5 mobile-landscape:py-2 rounded-2xl bg-[#040816]/95 border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3 sm:gap-5 md:gap-6 relative">
                {/* Header with Carousel Navigation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-cyan-500/15 pb-2.5 sm:pb-3.5 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={handlePrevTelescope}
                      className="p-1.5 sm:p-2 md:p-2.5 mobile-landscape:p-1 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                      title="Previous telescope"
                      aria-label="Previous card"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 mobile-landscape:w-3.5 mobile-landscape:h-3.5" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded bg-slate-800 border border-cyan-500/30 text-cyan-300 shrink-0 font-semibold">
                          {activeTelescope.type}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded bg-black/60 border border-white/20 text-slate-300 shrink-0">
                          {activeTelescope.operationalStatus}
                        </span>
                        <h3
                          className="text-sm sm:text-base md:text-lg lg:text-xl font-bold font-mono text-white break-words"
                          style={{ color: activeTelescope.accentColor }}
                        >
                          {activeTelescope.name}
                        </h3>
                        <span className="text-[11px] font-mono text-cyan-400/90 font-semibold shrink-0">
                          ({activeTelescopeIndex + 1}/{HISTORIC_AND_MODERN_TELESCOPES.length})
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-mono truncate">
                        {activeTelescope.locationOrOrbit} · Aperture: {activeTelescope.apertureDiameter} · Era: {activeTelescope.era}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextTelescope}
                      className="p-1.5 sm:p-2 md:p-2.5 mobile-landscape:p-1 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                      title="Next telescope"
                      aria-label="Next card"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 mobile-landscape:w-3.5 mobile-landscape:h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Body: Specimen & Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 min-w-0">
                  {/* Left Column: Specimen Image */}
                  <div className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-4 min-w-0">
                    {activeTelescope.imageUrl ? (
                      <div className="rounded-xl overflow-hidden border border-cyan-500/40 shadow-lg bg-[#020512] flex flex-col mobile-landscape:flex-row mobile-landscape:items-stretch">
                        <div className="w-full mobile-landscape:w-auto bg-black/60 flex items-center justify-center mobile-landscape:justify-start mobile-landscape:items-start p-2 sm:p-3 md:p-4 mobile-landscape:p-2 min-h-[200px] sm:min-h-[240px] md:min-h-[260px] lg:min-h-[300px] mobile-landscape:min-h-0 mobile-landscape:shrink-0 mobile-landscape:border-r mobile-landscape:border-cyan-500/20">
                          <img
                            src={activeTelescope.imageUrl}
                            alt={activeTelescope.imageCaption || activeTelescope.name}
                            className="max-h-60 sm:max-h-72 md:max-h-72 lg:max-h-80 mobile-landscape:h-24 mobile-landscape:max-h-24 mobile-landscape:w-auto w-auto max-w-full rounded-lg shadow-md object-contain transition-transform duration-300 hover:scale-[1.02]"
                          />
                        </div>
                        {activeTelescope.imageCaption && (
                          <div className="p-2 sm:p-2.5 text-[10px] sm:text-[11px] font-mono text-slate-300 bg-black/80 mobile-landscape:bg-transparent border-t mobile-landscape:border-t-0 border-cyan-500/20 leading-snug mobile-landscape:flex-1 mobile-landscape:flex mobile-landscape:items-center mobile-landscape:p-3">
                            {activeTelescope.imageCaption}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 sm:p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 space-y-1.5">
                        <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">Optics Specimen</span>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed">
                          {activeTelescope.name} — operational in {activeTelescope.wavelengthBands}.
                        </p>
                      </div>
                    )}

                    {star && (
                      <div
                        onClick={() => onSelectStar && onSelectStar(star)}
                        className="p-2.5 sm:p-3 md:p-3.5 rounded-xl bg-slate-900/80 hover:bg-[#071333] border border-cyan-500/40 hover:border-cyan-400 transition-all flex items-center justify-between gap-2.5 md:gap-3 cursor-pointer group shadow-sm"
                        title={`Open ${star.name} Dossier`}
                      >
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase tracking-wider font-mono text-cyan-400">
                            Featured Telescope Target:
                          </div>
                          <div className="min-w-0 overflow-hidden">
                            <RunningText
                              text={activeTelescope.featuredStarName}
                              className="text-xs sm:text-sm font-mono font-bold text-white group-hover:text-cyan-300 transition-colors"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-mono text-cyan-400 font-semibold shrink-0">
                          <span>3D Dossier</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Technical Specs & Discoveries */}
                  <div className="lg:col-span-7 flex flex-col justify-between gap-3 sm:gap-4 min-w-0">
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="p-2.5 sm:p-3 rounded-xl bg-black/40 border border-cyan-500/20">
                          <span className="text-[10px] font-mono text-cyan-300 uppercase block font-semibold">Wavelength Coverage</span>
                          <span className="text-xs md:text-sm mobile-landscape:text-[11px] text-slate-300 font-sans mt-0.5 block">{activeTelescope.wavelengthBands}</span>
                        </div>
                        <div className="p-2.5 sm:p-3 rounded-xl bg-black/40 border border-cyan-500/20">
                          <span className="text-[10px] font-mono text-cyan-300 uppercase block font-semibold">Operational Era &amp; Status</span>
                          <span className="text-xs md:text-sm mobile-landscape:text-[11px] text-slate-300 font-sans mt-0.5 block">{activeTelescope.era} ({activeTelescope.operationalStatus})</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1">
                          Major Stellar Contributions
                        </h4>
                        <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] text-slate-200 leading-relaxed font-sans">
                          {activeTelescope.majorStellarContributions}
                        </p>
                      </div>

                      <div className="p-2.5 sm:p-3 rounded-xl bg-black/50 border border-cyan-500/20 space-y-1.5">
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block tracking-wider">
                          Iconic Discoveries &amp; Observations
                        </span>
                        <div className="space-y-1">
                          {activeTelescope.iconicDiscoveries.map((d, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-xs md:text-sm mobile-landscape:text-[11px] text-slate-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                              <span>{d}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 6. SUB-SECTION: FIRSTS BY STELLAR CLASS (MILESTONES) */}
      {activeTopic === 'milestones' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Sub-tab Hero Banner: Discovery Milestones by Stellar Class */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-5 md:p-6 lg:p-7 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
              <div className="space-y-1 sm:space-y-1.5 md:space-y-2 max-w-3xl">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-2.5 md:gap-3">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-amber-400 shrink-0" />
                  <span>Discovery Milestones by Stellar Class</span>
                </h2>
                <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
                  Every class of star in astrophysics—from pulsars and white dwarfs to black holes, brown dwarfs, and extreme lensed hypergiants—has a historic first discovery that opened a brand-new frontier of observational science.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono text-[11px] sm:text-xs font-bold shadow-sm">
                  {DISCOVERY_MILESTONES_BY_CLASS.length} Milestones
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
            {DISCOVERY_MILESTONES_BY_CLASS.map((m) => {
              const star = getCatalogStar(m.starId);
              return (
                <div
                  key={m.stellarClass}
                  className="p-3.5 sm:p-4 md:p-5 lg:p-6 mobile-landscape:p-2.5 rounded-2xl bg-[#030718]/90 border border-cyan-500/30 space-y-2.5 sm:space-y-3.5 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-2 sm:space-y-2.5">
                    <div className="flex items-start justify-between gap-2 border-b border-cyan-500/20 pb-2">
                      <div className="min-w-0">
                        <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-cyan-400">
                          {m.stellarClass}
                        </div>
                        <div className="min-w-0 overflow-hidden">
                          <RunningText
                            text={m.starName}
                            className="text-sm sm:text-base font-bold font-mono text-white mt-0.5"
                            style={{ color: m.accentColor }}
                          />
                        </div>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-mono px-1.5 sm:px-2 py-0.5 rounded bg-slate-800 border border-cyan-500/30 text-cyan-300 font-bold shrink-0">
                        {m.firstDiscoveryYear} CE
                      </span>
                    </div>

                    <div className="text-xs md:text-sm mobile-landscape:text-[11px] text-slate-300 font-sans space-y-1 sm:space-y-1.5">
                      <div>
                        <strong className="text-slate-400 font-mono text-[10px] sm:text-[11px]">Discoverers:</strong>{' '}
                        <span>{m.discoverers}</span>
                      </div>
                      <div>
                        <strong className="text-slate-400 font-mono text-[10px] sm:text-[11px]">Observational Method:</strong>{' '}
                        <span>{m.observingMethod}</span>
                      </div>
                      <div>
                        <strong className="text-slate-400 font-mono text-[10px] sm:text-[11px]">Discovery Story:</strong>{' '}
                        <p className="mt-0.5 leading-relaxed text-slate-300">{m.historicalStory}</p>
                      </div>
                    </div>

                    {m.imageUrl && (
                      <div className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 md:p-3 rounded-xl bg-black/60 border border-cyan-500/30 shadow-md">
                        <div className="w-14 h-14 sm:w-18 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-20 mobile-landscape:w-12 mobile-landscape:h-12 rounded-lg overflow-hidden border border-cyan-400/40 shadow shrink-0 bg-black/70 p-1 flex items-center justify-center">
                          <img
                            src={m.imageUrl}
                            alt={m.imageCaption || m.discoverers}
                            className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="text-[9px] sm:text-[10px] font-mono text-cyan-300 uppercase font-semibold tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            <span>Historic Milestone Specimen</span>
                          </div>
                          <div className="text-[11px] sm:text-xs md:text-sm mobile-landscape:text-[10px] text-slate-200 font-sans leading-snug line-clamp-2">{m.imageCaption}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {star && (
                    <div
                      onClick={() => onSelectStar && onSelectStar(star)}
                      className="p-2 sm:p-2.5 md:p-3 rounded-xl bg-slate-900/80 hover:bg-[#071333] border border-cyan-500/30 hover:border-cyan-400/60 transition-all flex items-center justify-between gap-2 cursor-pointer group shadow-sm pt-2 border-t"
                      title={`Open ${star.name} Dossier`}
                    >
                      <div className="min-w-0">
                        <div className="text-[9px] sm:text-[10px] uppercase tracking-wider font-mono text-slate-400">
                          Interactive 3D Catalog Entry:
                        </div>
                        <div className="min-w-0 overflow-hidden">
                          <RunningText
                            text={star.name}
                            className="text-xs font-mono font-bold text-white group-hover:text-cyan-300 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono text-cyan-400 font-semibold shrink-0">
                        <span>3D Dossier</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detached Stellar Nomenclature Quick Link Banner */}
      {onOpenNomenclature && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#030d2a] via-[#051445] to-[#03091e] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shrink-0">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">How We Name Stars (Stellar Nomenclature)</div>
              <div className="text-xs text-slate-300">Explore Bayer Greek letters, Flamsteed numbers, variable systems, and IAU catalogs on its dedicated page.</div>
            </div>
          </div>
          <button
            onClick={onOpenNomenclature}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0"
          >
            Open Nomenclature Guide →
          </button>
        </div>
      )}
    </div>
  );
};
