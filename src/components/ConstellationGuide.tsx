import React, { useState, useMemo } from 'react';
import { StarData } from '../types';
import { STARS_CATALOG } from '../data/stars';
import {
  ALL_88_CONSTELLATIONS,
  ConstellationInfo,
  WHAT_ARE_CONSTELLATIONS_INFO,
  ZODIAC_13_EXPLAINER,
  ZODIAC_13_SIGNS,
  MYTHBUSTER_INFO
} from '../data/constellationsData';
import { useCelestialData } from '../hooks/useCelestialData';
import { ConstellationTabs, ConstellationGuideTab } from './ConstellationTabs';
import { ConstellationMap } from './ConstellationMap';
import { ConstellationDossierModal } from './ConstellationDossierModal';
import { calculateAstronomicalZodiac } from '../utils/celestialMechanics';
import { StarDot2D } from './StarDot2D';
import {
  Sparkles,
  Compass,
  Search,
  BookOpen,
  HelpCircle,
  Info,
  ChevronRight,
  Calendar,
  Globe
} from 'lucide-react';

interface ConstellationGuideProps {
  onSelectStar: (star: StarData) => void;
  onCompareStar?: (star: StarData) => void;
}

export const ConstellationGuide: React.FC<ConstellationGuideProps> = ({
  onSelectStar,
  onCompareStar
}) => {
  const [activeTab, setActiveTab] = useState<ConstellationGuideTab>('what-are');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHemisphere, setSelectedHemisphere] = useState<string>('all');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'area-desc' | 'brightest'>('name');
  const [cardDensity] = useState<'compact' | 'standard'>('compact');

  const [inspectedConstellation, setInspectedConstellation] = useState<ConstellationInfo | null>(null);

  const [calcMonth, setCalcMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [calcDay, setCalcDay] = useState<number>(() => new Date().getDate());

  // Bulletproof celestial dataset hook (dsos, lines, bounds, borders, names)
  const { celestialData } = useCelestialData();

  const starMap = useMemo(() => {
    return new Map(STARS_CATALOG.map((s) => [s.id, s]));
  }, []);

  const filteredConstellations = useMemo(() => {
    return ALL_88_CONSTELLATIONS.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesEnglish = c.englishName.toLowerCase().includes(q);
        const matchesStar = c.principalStarName.toLowerCase().includes(q);
        const matchesAbbr = c.abbreviation.toLowerCase().includes(q);
        const matchesSectors = c.borders.sectors?.some(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.shortCode.toLowerCase().includes(q) ||
            s.englishName.toLowerCase().includes(q)
        );
        const matchesSerpensAlias =
          c.id === 'serpens' &&
          (q.includes('caput') ||
            q.includes('cauda') ||
            q.includes('ser-cap') ||
            q.includes('ser-cau'));
        if (!matchesName && !matchesEnglish && !matchesStar && !matchesAbbr && !matchesSectors && !matchesSerpensAlias) {
          return false;
        }
      }
      if (selectedHemisphere !== 'all' && c.hemisphere !== selectedHemisphere) return false;
      if (selectedFamily !== 'all') {
        if (selectedFamily === 'zodiac-only' && !c.isZodiac) return false;
        if (selectedFamily !== 'zodiac-only' && c.family !== selectedFamily) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'area-desc') return b.areaSqDeg - a.areaSqDeg;
      if (sortBy === 'brightest') return a.brightestMagnitude - b.brightestMagnitude;
      return 0;
    });
  }, [searchQuery, selectedHemisphere, selectedFamily, sortBy]);

  const birthdayResult = useMemo(() => {
    return calculateAstronomicalZodiac(calcMonth, calcDay);
  }, [calcMonth, calcDay]);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto text-slate-200">
      {/* Top Banner (Uniform Hero Section) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-6 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mobile-landscape:gap-2">
          <div className="space-y-1 sm:space-y-2 max-w-3xl">
            <h1 className="text-base sm:text-2xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-3">
              <Compass className="w-5 h-5 sm:w-7 sm:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-cyan-400 shrink-0" />
              <span>Constellation Guide</span>
            </h1>
            <p className="text-[11px] sm:text-sm mobile-landscape:text-[10px] mobile-landscape:leading-tight text-slate-300 leading-relaxed font-sans">
              Discover all 88 official IAU constellations dividing the celestial sphere, compare 2D Earth perspective against true 3D stellar depths, explore the real 13 astronomical zodiac constellations, and debunk astrological lore.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 mobile-landscape:px-2 mobile-landscape:py-0.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] sm:text-xs font-bold shadow-sm">
              88 IAU Sectors
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Switcher */}
      <ConstellationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ========================================================================= */}
      {/* SUB-TAB 1: WHAT ARE CONSTELLATIONS? */}
      {/* ========================================================================= */}
      {activeTab === 'what-are' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Sub-tab Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-6 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row gap-4 sm:gap-6 items-center">
              <div className="flex-1 space-y-1.5 sm:space-y-2">
                <h2 className="text-base sm:text-2xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-3">
                  <BookOpen className="w-5 h-5 sm:w-7 sm:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-cyan-400 shrink-0" />
                  <span>Physical Reality vs. Celestial Coordinates</span>
                </h2>
                <p className="text-[11px] sm:text-sm mobile-landscape:text-[10px] text-slate-300 leading-relaxed font-sans">
                  In three-dimensional space, <strong className="text-cyan-300 font-semibold">constellations do not physically exist</strong>. The stars that form familiar patterns like Orion or the Big Dipper are separated by dozens, hundreds, or even thousands of light-years in radial depth. They have no gravitational binding, no common birth nebula, and are moving in completely different galactic orbits.
                </p>
                <div className="mt-2.5 sm:mt-3 p-2.5 sm:p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-[11px] sm:text-xs text-blue-200 leading-relaxed font-sans">
                  <strong className="text-white block mb-0.5">
                    📍 Why are constellations still indispensable to modern astronomy?
                  </strong>
                  While physically meaningless in deep space, they are <strong className="text-cyan-300 font-bold">essential standardized sectors</strong> for mapping the night sky from Earth—functioning just like postal codes or country boundaries on a globe.
                </div>
              </div>

              {/* Graphical Visual Diagram: 2D vs 3D */}
              <div className="w-full md:w-80 p-5 rounded-xl bg-[#020512] border border-slate-700/60 flex flex-col items-center text-center shrink-0">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-bold">
                  The Depth Illusion
                </div>
                <div className="relative w-64 h-36 bg-[#040818] rounded-lg border border-cyan-500/20 overflow-hidden flex items-center justify-center p-2 mb-3">
                  {/* Left: Earth Observer */}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-500 border border-white flex items-center justify-center text-[9px] font-bold text-white shadow-[0_0_10px_#3b82f6]">
                      🌍
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 mt-1">Earth</span>
                  </div>

                  {/* Lines of sight */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 250 140">
                    <line x1="30" y1="70" x2="100" y2="35" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="30" y1="70" x2="170" y2="70" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="30" y1="70" x2="230" y2="105" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />

                    {/* 2D Projection Screen on Earth's Dome */}
                    <path d="M 75 15 Q 85 70 75 125" fill="none" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="1.5" />

                    {/* Star 1: Close (e.g. 25 ly) */}
                    <circle cx="100" cy="35" r="4" fill="#67e8f9" />
                    <text x="100" y="24" fill="#94a3b8" fontSize="8" textAnchor="middle">25 ly</text>

                    {/* Star 2: Medium (e.g. 250 ly) */}
                    <circle cx="170" cy="70" r="5" fill="#fef08a" />
                    <text x="170" y="58" fill="#94a3b8" fontSize="8" textAnchor="middle">250 ly</text>

                    {/* Star 3: Deep Supergiant (e.g. 2,000 ly) */}
                    <circle cx="230" cy="105" r="6" fill="#f87171" />
                    <text x="230" y="93" fill="#94a3b8" fontSize="8" textAnchor="middle">2,000 ly</text>
                  </svg>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  From Earth, Stars A, B, and C appear side-by-side in a triangle. In 3D space, Star C is 80 times
                  further away than Star A!
                </p>
              </div>
            </div>
          </div>

          {/* 4 Pillars of Constellation Knowledge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {WHAT_ARE_CONSTELLATIONS_INFO.keyPrinciples.map((principle, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-[#060c22] border border-cyan-500/20 hover:border-cyan-500/40 transition-colors flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                    {principle.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-500">Pillar 0{idx + 1}</span>
                </div>
                <h4 className="text-base font-bold text-white">{principle.title}</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{principle.content}</p>
              </div>
            ))}
          </div>

          {/* Interactive Asterism vs Constellation Callout */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#08122a] border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Asterisms: Everyday Patterns vs. Official Constellations</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Did you know? The <strong>Big Dipper</strong> is NOT a constellation! It is an asterism comprising the
                7 brightest stars inside the larger constellation <em>Ursa Major</em> (The Great Bear). Likewise, the{' '}
                <strong>Summer Triangle</strong> connects Vega (Lyra), Deneb (Cygnus), and Altair (Aquila) across three
                different constellations!
              </p>
            </div>
            <button
              onClick={() => setActiveTab('all-88')}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 cursor-pointer shadow-md"
            >
              <span>Explore All 88 Constellations</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: ALL 88 CONSTELLATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'all-88' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Sub-tab Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-6 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mobile-landscape:gap-2">
              <div className="space-y-1.5 sm:space-y-2 max-w-3xl">
                <h2 className="text-base sm:text-2xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-3">
                  <Globe className="w-5 h-5 sm:w-7 sm:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-cyan-400 shrink-0" />
                  <span>All 88 Constellations Directory</span>
                </h2>
                <p className="text-[11px] sm:text-sm mobile-landscape:text-[10px] text-slate-300 leading-relaxed font-sans">
                  The International Astronomical Union (IAU) formally divides the entire celestial sphere into 88 unambiguous sectors. Filter and sort by celestial hemisphere, constellation family, total celestial area, or brightest alpha star.
                </p>
              </div>
            </div>
          </div>

          {/* Search, Filters & Sorters */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#050c20] border border-cyan-500/25 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="constellation-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by constellation name, meaning (e.g. 'Bear'), or principal star..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#020512] border border-slate-700/80 focus:border-cyan-500 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Hemisphere filter */}
              <select
                id="select-constellation-hemisphere"
                value={selectedHemisphere}
                onChange={(e) => setSelectedHemisphere(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#020512] border border-slate-700/80 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value="all">All Hemispheres</option>
                <option value="Northern">Northern Sky</option>
                <option value="Southern">Southern Sky</option>
                <option value="Equatorial">Equatorial Sky</option>
              </select>

              {/* Family filter */}
              <select
                id="select-constellation-family"
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#020512] border border-slate-700/80 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value="all">All Families</option>
                <option value="zodiac-only">Zodiac Constellations (13)</option>
                <option value="Ursa Major">Ursa Major Family</option>
                <option value="Perseus">Perseus Family</option>
                <option value="Hercules">Hercules Family</option>
                <option value="Orion">Orion Family</option>
                <option value="Heavenly Waters">Heavenly Waters</option>
                <option value="Bayer">Bayer Group (Southern)</option>
                <option value="La Caille">Lacaille Group (Instruments)</option>
              </select>

              {/* Sort by */}
              <select
                id="select-constellation-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-[#020512] border border-slate-700/80 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value="name">Sort: Name (A-Z)</option>
                <option value="area-desc">Sort: Area (Largest First)</option>
                <option value="brightest">Sort: Brightest Principal Star</option>
              </select>
            </div>
          </div>

          {/* Active Filter Metrics Banner */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>
              Showing <strong className="text-cyan-400 font-bold">{filteredConstellations.length}</strong> of{' '}
              {ALL_88_CONSTELLATIONS.length} Official IAU Constellations
            </span>
            {(searchQuery || selectedHemisphere !== 'all' || selectedFamily !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedHemisphere('all');
                  setSelectedFamily('all');
                  setSortBy('name');
                }}
                className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* 88 Constellations Bento Grid */}
          <div
            className={`grid ${
              cardDensity === 'compact'
                ? 'grid-cols-2 min-[420px]:grid-cols-3 mobile-landscape:grid-cols-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-2.5'
                : 'grid-cols-2 min-[420px]:grid-cols-3 mobile-landscape:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4'
            }`}
          >
            {filteredConstellations.map((constellation) => {
              const principalStar = starMap.get(constellation.principalStarId);

              if (cardDensity === 'compact') {
                return (
                  <div
                    key={constellation.id}
                    onClick={() => setInspectedConstellation(constellation)}
                    className="group p-2 sm:p-2.5 rounded-xl bg-[#040a1c] border border-cyan-500/20 hover:border-cyan-400/60 hover:bg-[#060e28] transition-all flex flex-col justify-between shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
                    title={`Click to open Constellation Dossier for ${constellation.name}`}
                  >
                    <div>
                      {/* Compact Header */}
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                              {constellation.name}
                            </h4>
                            {constellation.isZodiac && (
                              <span
                                className="text-[8px] px-1 py-0.2 rounded font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/30 shrink-0"
                                title="Zodiac Constellation"
                              >
                                {constellation.zodiacSymbol || 'Z'}
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] text-slate-400 italic truncate">{constellation.englishName}</p>
                        </div>
                        <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60 shrink-0">
                          {constellation.id === 'serpens' ? 'Ser' : constellation.abbreviation}
                        </span>
                      </div>

                      {/* Smaller SVG Preview (Consistent 1:1 Square) */}
                      <div
                        className="relative w-full aspect-square bg-[#020512] rounded-lg border border-cyan-500/15 flex items-center justify-center overflow-hidden group-hover:border-cyan-500/40 transition-colors my-1 p-1.5"
                        title={`Click to open Constellation Dossier for ${constellation.name}`}
                      >
                        <ConstellationMap
                          constellation={constellation}
                          celestialData={celestialData}
                          mode="preview"
                          size={100}
                          className="w-full h-full"
                        />
                      </div>

                      {/* Resemblance Snippet */}
                      <p className="line-clamp-1 italic text-[9px] text-slate-300/80 my-0.5 truncate" title={constellation.resemblance}>
                        "{constellation.resemblance}"
                      </p>

                      {/* Quick Specs Compact Row */}
                      <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-slate-400 py-0.5 border-t border-slate-800/80">
                        <span className="truncate">{constellation.hemisphere}</span>
                        <span className="text-cyan-300 shrink-0">{constellation.areaSqDeg} sq°</span>
                      </div>
                    </div>

                    {/* Principal Star & Action */}
                    <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between gap-1 text-[9px]">
                      <span className="text-slate-400 truncate flex items-center gap-1">
                        <StarDot2D star={principalStar} colorHex={principalStar?.colorHex || '#fef08a'} sizeClassName="w-2 h-2" />
                        <span className="text-white font-medium truncate">{constellation.principalStarName.split('(')[0]}</span>
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectedConstellation(constellation);
                        }}
                        className="py-0.5 px-1.5 rounded bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 hover:text-white border border-cyan-500/30 text-[9px] font-semibold font-mono cursor-pointer shrink-0 transition-colors"
                        title="Dossier"
                      >
                        Dossier
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={constellation.id}
                  onClick={() => setInspectedConstellation(constellation)}
                  className="group p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#040a1c] border border-cyan-500/20 hover:border-cyan-400/60 hover:bg-[#060e28] transition-all flex flex-col justify-between shadow-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] cursor-pointer"
                  title={`Click to open Constellation Dossier for ${constellation.name}`}
                >
                  {/* Top Header */}
                  <div>
                    <div className="flex items-start justify-between gap-1 sm:gap-2 mb-1.5 sm:mb-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <h4 className="text-xs sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                            {constellation.name}
                          </h4>
                          {constellation.isZodiac && (
                            <span
                              className="text-[9px] sm:text-xs px-1 sm:px-1.5 py-0.2 rounded font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/30 shrink-0"
                              title="Zodiac Constellation"
                            >
                              {constellation.zodiacSymbol || 'Z'}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-400 italic truncate">{constellation.englishName}</p>
                      </div>

                      <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60 shrink-0">
                        {constellation.id === 'serpens' ? 'Ser' : constellation.abbreviation}
                      </span>
                    </div>

                    {/* SVG Constellation Asterism Preview */}
                    <div
                      className="relative w-full aspect-square bg-[#020512] rounded-lg sm:rounded-xl border border-cyan-500/15 flex items-center justify-center overflow-hidden group-hover:border-cyan-500/40 transition-colors my-1.5 sm:my-2.5 p-2"
                      title={`Click card to open Constellation Dossier for ${constellation.name}`}
                    >
                      <ConstellationMap
                        constellation={constellation}
                        celestialData={celestialData}
                        mode="preview"
                        size={140}
                        className="w-full h-full"
                      />
                      <div className="absolute bottom-1 right-1 text-[8px] sm:text-[9px] font-mono text-cyan-400/90 bg-slate-950/80 px-1 py-0.2 rounded border border-slate-800 pointer-events-none">
                        Figure
                      </div>
                    </div>

                    {/* Resemblance snippet */}
                    <div className="my-1 sm:my-2 p-1.5 sm:p-2 rounded-lg bg-[#020512] border border-cyan-500/15 text-[10px] sm:text-[11px] leading-tight sm:leading-snug">
                      <div className="flex items-center gap-1 text-[8.5px] sm:text-[9px] font-mono uppercase text-cyan-400 font-semibold mb-0.5">
                        <Sparkles className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-cyan-400 shrink-0" />
                        <span>Resemblance</span>
                      </div>
                      <p className="line-clamp-1 sm:line-clamp-2 italic text-slate-300/90">"{constellation.resemblance}"</p>
                    </div>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-1.5 text-[9.5px] sm:text-[11px] font-mono mb-2 sm:mb-3">
                      <div className="p-1 sm:p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 truncate">
                        <span className="text-slate-500 block text-[8px] sm:text-[9px] uppercase">Sky Region</span>
                        <span className="truncate">{constellation.hemisphere}</span>
                      </div>
                      <div className="p-1 sm:p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 truncate">
                        <span className="text-slate-500 block text-[8px] sm:text-[9px] uppercase">Area / Rank</span>
                        <span className="truncate">
                          {constellation.areaSqDeg} sq° (#{constellation.areaRank})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Principal Star Bar & Action */}
                  <div className="pt-1.5 sm:pt-2.5 border-t border-slate-800 flex flex-col gap-1.5 sm:gap-2">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                      <span className="text-slate-400 text-[9px] sm:text-[11px] flex items-center gap-1 shrink-0">
                        <StarDot2D star={principalStar} colorHex={principalStar?.colorHex || '#fef08a'} sizeClassName="w-2 h-2" />
                        <span>Principal:</span>
                      </span>
                      <span className="text-white font-semibold text-[9.5px] sm:text-[11px] truncate max-w-[85px] sm:max-w-[130px]" title={constellation.principalStarName}>
                        {constellation.principalStarName.split('(')[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                      {principalStar && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectStar(principalStar);
                          }}
                          className="flex-1 py-1 sm:py-1.5 px-1.5 sm:px-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 hover:text-white border border-cyan-500/40 text-[10px] sm:text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-95"
                          title={`Inspect ${principalStar.name} in 3D Comparator`}
                        >
                          <StarDot2D star={principalStar} sizeClassName="w-2 h-2" />
                          <span>Inspect</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectedConstellation(constellation);
                        }}
                        className="py-1 sm:py-1.5 px-2 sm:px-2.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-[10px] sm:text-[11px] font-semibold cursor-pointer transition-colors active:scale-95"
                        title="Open Constellation Dossier"
                      >
                        <Info className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: THE 13 ZODIAC SIGNS */}
      {/* ========================================================================= */}
      {activeTab === 'zodiac-13' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Sub-tab Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-6 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mobile-landscape:gap-2">
              <div className="space-y-1.5 sm:space-y-2 max-w-3xl">
                <h2 className="text-base sm:text-2xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-3">
                  <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-amber-400 shrink-0" />
                  <span>The 13 Signs of the Astronomical Zodiac</span>
                </h2>
                <p className="text-[11px] sm:text-sm mobile-landscape:text-[10px] text-slate-300 leading-relaxed font-sans">
                  The ecliptic path of the Sun physically crosses 13 distinct astronomical constellations—not 12—including Ophiuchus the Serpent Bearer. Over the last 2,500 years, axial precession has shifted the actual dates the Sun spends in each constellation by almost a full month.
                </p>
              </div>
            </div>
          </div>

          {/* Explainer Details & Ophiuchus Callout */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#040816] border border-cyan-500/20">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-3xl space-y-3">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {ZODIAC_13_EXPLAINER.introduction}
                </p>
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs sm:text-sm text-amber-200 leading-relaxed font-sans">
                  <strong className="text-white block mb-0.5">
                    ⏳ The Precession of the Equinoxes (The 1-Month Shift):
                  </strong>
                  {ZODIAC_13_EXPLAINER.axialPrecessionNote}
                </div>
              </div>

              {/* Ophiuchus Big Callout Card */}
              <div className="w-full lg:w-80 p-5 rounded-xl bg-[#020512] border-2 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.25)] flex flex-col gap-2 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">⛎</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-600">
                    The 13th Sign
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">
                  Ophiuchus (The Serpent Bearer)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The Sun spends <strong>18.6 days</strong> traveling through Ophiuchus (Nov 29 – Dec 17)—nearly three times longer than Scorpius!
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed italic mt-1">
                  Why was it excluded? Ancient Babylonians had a 12-month calendar, so they sliced the sky into 12 equal wedges and ignored the 13th!
                </p>
              </div>
            </div>
          </div>

          {/* The 13 Zodiac Signs Grid */}
          <div className="grid grid-cols-2 min-[420px]:grid-cols-3 mobile-landscape:grid-cols-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-2.5">
            {ZODIAC_13_SIGNS.map((sign) => {
              const star = starMap.get(sign.principalStarId);
              const constellation = ALL_88_CONSTELLATIONS.find((c) => c.name.toLowerCase() === sign.name.toLowerCase());

              return (
                <div
                  key={sign.name}
                  onClick={() => constellation && setInspectedConstellation(constellation)}
                  className={`group p-2 sm:p-2.5 rounded-xl flex flex-col justify-between border transition-all cursor-pointer shadow-sm ${
                    sign.isThirteenth
                      ? 'bg-[#150f04] border-amber-500/70 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-[#040a1c] border-cyan-500/20 hover:border-cyan-400/60 hover:bg-[#060e28] hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  }`}
                  title={constellation ? `Click to open Constellation Dossier for ${constellation.name}` : undefined}
                >
                  <div>
                    {/* Compact Header */}
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-base sm:text-lg leading-none shrink-0">{sign.symbol}</span>
                          <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                            {sign.name}
                          </h4>
                          {sign.isThirteenth && (
                            <span className="text-[7.5px] sm:text-[8px] font-mono px-1 py-0.2 rounded bg-amber-500 text-slate-950 font-bold shrink-0">
                              13th!
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] text-slate-400 italic truncate">{sign.englishMeaning}</p>
                      </div>
                      <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-slate-800/80 text-cyan-400 font-bold border border-slate-700/60 shrink-0">
                        #{sign.index}
                      </span>
                    </div>

                    {/* SVG Constellation Asterism Preview (Consistent 1:1 Square) */}
                    {constellation && (
                      <div
                        className="relative w-full aspect-square bg-[#020512] rounded-lg border border-cyan-500/15 flex items-center justify-center overflow-hidden group-hover:border-cyan-500/40 transition-colors my-1 p-1.5"
                      >
                        <ConstellationMap
                          constellation={constellation}
                          celestialData={celestialData}
                          mode="preview"
                          size={100}
                          className="w-full h-full"
                        />
                        <div className="absolute bottom-1 right-1 text-[7px] sm:text-[8px] font-mono text-cyan-400/90 bg-slate-950/80 px-1 py-0.2 rounded border border-slate-800 pointer-events-none">
                          Figure
                        </div>
                      </div>
                    )}

                    {/* Date Comparison Compact Rows */}
                    <div className="space-y-0.5 text-[8px] sm:text-[9px] font-mono my-1">
                      <div className="px-1.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-between gap-1">
                        <span className="text-cyan-300 font-semibold truncate text-[7.5px] sm:text-[8.5px]">Real:</span>
                        <span className="text-white font-bold truncate text-[7.5px] sm:text-[8.5px]">{sign.astronomicalDates}</span>
                      </div>
                      <div className="px-1.5 py-0.5 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-1">
                        <span className="text-slate-400 truncate text-[7.5px] sm:text-[8.5px]">Astro:</span>
                        <span className="text-slate-300 truncate text-[7.5px] sm:text-[8.5px]">{sign.traditionalDates}</span>
                      </div>
                      <div className="flex items-center justify-between text-[7.5px] sm:text-[8.5px] text-slate-400 px-0.5 pt-0.5">
                        <span>Duration:</span>
                        <span className="text-cyan-400 font-bold">{sign.sunDurationDays} days</span>
                      </div>
                    </div>

                    {/* Scientific Snippet */}
                    <p
                      className="text-[8.5px] sm:text-[9px] text-slate-300/80 my-1 leading-tight line-clamp-2"
                      title={sign.scientificNotes}
                    >
                      {sign.scientificNotes}
                    </p>
                  </div>

                  {/* Principal Star Link & Dossier Footer */}
                  <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between gap-1 text-[9px] mt-0.5">
                    {star ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStar(star);
                        }}
                        className="text-slate-300 hover:text-cyan-300 truncate flex items-center gap-1 cursor-pointer transition-colors max-w-[65%]"
                        title={`Inspect alpha star ${star.name}`}
                      >
                        <StarDot2D star={star} colorHex={star?.colorHex || '#fef08a'} sizeClassName="w-2 h-2" />
                        <span className="truncate">{star.name.split('(')[0]}</span>
                      </button>
                    ) : (
                      <span className="text-slate-500 text-[8px] truncate">No alpha star</span>
                    )}

                    {constellation && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectedConstellation(constellation);
                        }}
                        className="py-0.5 px-1.5 rounded bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 hover:text-white border border-cyan-500/30 text-[8px] sm:text-[9px] font-semibold font-mono cursor-pointer shrink-0 transition-colors"
                        title="Dossier"
                      >
                        Dossier
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: MYTHBUSTER: PERSONALITY & ASTROLOGY */}
      {/* ========================================================================= */}
      {activeTab === 'mythbuster' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Sub-tab Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-6 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mobile-landscape:gap-2">
              <div className="space-y-1.5 sm:space-y-2 max-w-3xl">
                <h2 className="text-base sm:text-2xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-3">
                  <HelpCircle className="w-5 h-5 sm:w-7 sm:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-rose-400 shrink-0" />
                  <span>Personality Mythbuster</span>
                </h2>
                <p className="text-[11px] sm:text-sm mobile-landscape:text-[10px] text-slate-300 leading-relaxed font-sans">
                  Astrology and zodiac personality tropes explored through empirical astrophysics: test where the Sun was physically located on your date of birth, examine axial precession shifts, and learn why gravity and distance rule out astrological determinism.
                </p>
              </div>
            </div>
          </div>

          {/* Big Mythbuster Verdict Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#140608] border border-rose-500/40 relative overflow-hidden shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {MYTHBUSTER_INFO.title}
                </h3>
                <div className="mt-1 text-base sm:text-lg font-bold text-rose-400">
                  {MYTHBUSTER_INFO.verdict}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                  {MYTHBUSTER_INFO.friendlyNote}
                </p>
              </div>

              {/* Astrophysics Perspective Callout */}
              <div className="w-full md:w-72 p-4 rounded-2xl bg-[#091530] border border-cyan-500/40 text-center flex flex-col items-center gap-2 shrink-0">
                <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  🔭
                </div>
                <div className="text-xs font-bold text-white">Astrophysical Reality</div>
                <p className="text-[11px] text-cyan-200/90 leading-snug">
                  "Astrology is charming cultural mythology and fun folklore. But as lovers of real
                  stars, we celebrate the wondrous truth: stars are nuclear titans, not mystical mood-rings!"
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Birthday Real Zodiac Finder Widget */}
          <div className="p-6 rounded-2xl bg-[#061026] border border-cyan-500/30">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase mb-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Interactive Precession Calculator</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              Find Out Where the Sun Was PHYSICALLY Located on Your Birthday
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mb-4">
              Because Earth's rotational axis precesses once every ~26,000 years, your traditional horoscope sign is
              almost certainly NOT where the Sun was in space when you were born!
            </p>

            {/* Select Date Controls */}
            <div className="flex flex-wrap items-end gap-3 mb-5">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">Birth Month</label>
                <select
                  value={calcMonth}
                  onChange={(e) => setCalcMonth(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-[#020512] border border-slate-700 text-xs sm:text-sm text-white focus:border-cyan-500 focus:outline-none cursor-pointer"
                >
                  <option value={1}>January</option>
                  <option value={2}>February</option>
                  <option value={3}>March</option>
                  <option value={4}>April</option>
                  <option value={5}>May</option>
                  <option value={6}>June</option>
                  <option value={7}>July</option>
                  <option value={8}>August</option>
                  <option value={9}>September</option>
                  <option value={10}>October</option>
                  <option value={11}>November</option>
                  <option value={12}>December</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">Birth Day</label>
                <select
                  value={calcDay}
                  onChange={(e) => setCalcDay(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-[#020512] border border-slate-700 text-xs sm:text-sm text-white focus:border-cyan-500 focus:outline-none cursor-pointer"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    setCalcMonth(now.getMonth() + 1);
                    setCalcDay(now.getDate());
                  }}
                  className="px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5"
                  title="Reset to today's astronomical date"
                >
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Today's Transit</span>
                </button>
              </div>
            </div>

            {/* Calculated Result Banner */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#020512] border border-cyan-500/40 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500 flex items-center justify-center text-2xl shrink-0">
                  {birthdayResult.symbol}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Physical Astronomical Constellation:
                  </span>
                  <span className="text-base sm:text-lg font-bold text-cyan-300">
                    {birthdayResult.astronomical}
                  </span>
                  <p className="text-xs text-slate-400">{birthdayResult.desc}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">What Horoscopes Call You:</span>
                  <span className="text-slate-200 font-semibold">{birthdayResult.traditional}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Sun Duration:</span>
                  <span className="text-cyan-400 font-bold">{birthdayResult.daysIn} days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scientific Mythbuster Deep-Dive Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MYTHBUSTER_INFO.sections.map((sec, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-[#050c20] border border-slate-800 hover:border-cyan-500/30 transition-colors flex flex-col gap-2.5"
              >
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs flex items-center justify-center font-mono font-bold">
                    {idx + 1}
                  </span>
                  <span>{sec.title}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{sec.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constellation Dossier Modal */}
      <ConstellationDossierModal
        constellation={inspectedConstellation}
        onClose={() => setInspectedConstellation(null)}
        celestialData={celestialData}
        onSelectStar={onSelectStar}
        onSelectNeighbor={setInspectedConstellation}
        starMap={starMap}
      />
    </div>
  );
};