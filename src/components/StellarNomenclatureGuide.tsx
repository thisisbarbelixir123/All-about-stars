import React, { useState, useMemo } from 'react';
import { StarData } from '../types';
import { STARS_CATALOG } from '../data/stars';
import {
  NOMENCLATURE_TOPICS,
  FAMOUS_PROPER_NAMES,
  MODERN_CATALOGS,
  CLUSTERS_AND_EXTRAGALACTIC_LORE,
  MISCELLANEOUS_NAMES,
  NON_STAR_STELLAR_DESIGNATIONS,
  GREEK_ALPHABET_REFERENCE,
  NOMENCLATURE_QUIZ_QUESTIONS,
  ProperNameRecord,
  BAYER_SHARED_DESIGNATIONS_LORE,
  ELNATH_CASE_LORE,
  NUMBERED_STARS_SHOWCASE,
  VARIABLE_STARS_SHOWCASE,
  getMappedProperNameStars,
  getMappedGreekStars,
  getMappedNumberedStars,
  getMappedVariableStars,
  getMappedCatalogPrimaryStars,
  getMappedClusterExtragalacticStars,
} from '../data/stellarNomenclatureData';
import { ClassificationMappedStarsSection } from './ClassificationMappedStarsSection';
import { StarDot2D } from './StarDot2D';
import { RunningText } from './RunningText';
import {
  Sparkles,
  Bookmark,
  List,
  Activity,
  Database,
  Binary,
  Award,
  Search,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronRight,
  Info,
  Tag,
  AlertCircle,
  Globe,
  Grid,
  ArrowRight,
  ExternalLink,
  Layers,
  ArrowUpDown,
  Clock,
  SlidersHorizontal,
} from 'lucide-react';

interface StellarNomenclatureGuideProps {
  onSelectStar?: (star: StarData) => void;
  onCompareStar?: (star: StarData) => void;
  onJumpToCatalog?: (searchQuery?: string) => void;
  initialTab?: string;
}

export const StellarNomenclatureGuide: React.FC<StellarNomenclatureGuideProps> = ({
  onSelectStar,
  onCompareStar,
  onJumpToCatalog,
  initialTab = 'proper-names',
}) => {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Proper Names Filter & Search
  const [properNameSearch, setProperNameSearch] = useState<string>('');
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);

  // Helper: map catalogId to real StarData in STARS_CATALOG
  const getCatalogStar = (catalogId?: string): StarData | null => {
    if (!catalogId) return null;
    return STARS_CATALOG.find((s) => s.id === catalogId) || null;
  };

  // Mapped star categories for complete nomenclature directories (strictly filtered to avoid Greek Bayer overlap)
  const mappedProperNameStars = useMemo(() => getMappedProperNameStars(STARS_CATALOG), []);
  const mappedGreekStars = useMemo(() => getMappedGreekStars(STARS_CATALOG), []);
  const mappedNumberedStars = useMemo(() => getMappedNumberedStars(STARS_CATALOG), []);
  const mappedVariableStars = useMemo(() => getMappedVariableStars(STARS_CATALOG), []);
  const mappedCatalogPrimaryStars = useMemo(() => getMappedCatalogPrimaryStars(STARS_CATALOG), []);
  const mappedClusterExtragalacticStars = useMemo(() => getMappedClusterExtragalacticStars(STARS_CATALOG), []);

  // Filtered Proper Names
  const filteredProperNames = useMemo(() => {
    return FAMOUS_PROPER_NAMES.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(properNameSearch.toLowerCase()) ||
        item.meaning.toLowerCase().includes(properNameSearch.toLowerCase()) ||
        item.constellation.toLowerCase().includes(properNameSearch.toLowerCase()) ||
        item.bayerOrId.toLowerCase().includes(properNameSearch.toLowerCase());

      const matchesLang =
        languageFilter === 'all' || item.language.toLowerCase() === languageFilter.toLowerCase();

      return matchesSearch && matchesLang;
    });
  }, [properNameSearch, languageFilter]);

  // Quiz calculation
  const quizScore = useMemo(() => {
    let score = 0;
    NOMENCLATURE_QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  }, [selectedAnswers]);

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-6 lg:space-y-8 text-slate-200">
      {/* HEADER SECTION - Uniform Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-5 md:p-6 lg:p-8 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1 sm:space-y-1.5 md:space-y-2 max-w-4xl">
            <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-2.5 md:gap-3">
              <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-cyan-400 shrink-0" />
              <span>Stellar Nomenclature &amp; Designations</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
              From ancient Arabic and Greek proper names to multi-tier Bayer systems, numbered coordinate catalogs (Flamsteed &amp; Gould), variable star lettering, modern deep surveys (Gaia, SDSS, 2MASS, HD), star cluster designations, and multi-tier binary hierarchies.
            </p>
          </div>
        </div>
      </div>

      {/* TOP NAVIGATION TABS - Clean typographic tabs without badges */}
      <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar pb-1 p-1 bg-[#020512]/90 rounded-2xl border border-cyan-500/25">
        {NOMENCLATURE_TOPICS.map((topic) => {
          const isActive = activeTab === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => setActiveTab(topic.id)}
              className={`px-2.5 sm:px-3.5 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{topic.title}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREAS */}

      {/* 2. TRADITIONAL PROPER NAMES TAB */}
      {activeTab === 'proper-names' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Sub-tab Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-5 md:p-6 lg:p-7 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-1 sm:space-y-1.5 md:space-y-2">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-amber-400 shrink-0" />
                <span>How Stars Received Their Proper Names</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
                Most traditional proper star names in the night sky originated in classical antiquity and the Islamic Golden Age. Over 200 of the brightest naked-eye stars possess names derived from Arabic astronomy—such as Betelgeuse, Vega, and Aldebaran—formally standardized by the IAU Working Group on Star Names (WGSN).
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#030718]/90 border border-cyan-500/30 p-5 sm:p-6 shadow-xl backdrop-blur-md">
            <div className="text-xs sm:text-sm text-slate-300 font-sans space-y-3 leading-relaxed">
              <p>
                Most traditional proper star names in the night sky originated in classical antiquity and the Islamic Golden Age. Over 200 of the brightest naked-eye stars possess names derived from Arabic astronomy—such as <strong className="text-cyan-300">Betelgeuse</strong> (<em>Ibṭ al-Jawzāʼ</em>, "armpit of the giant"), <strong className="text-cyan-300">Vega</strong> (<em>an-Nasr al-Wāqi‘</em>, "the swooping eagle"), and <strong className="text-cyan-300">Aldebaran</strong> (<em>al-Dabarān</em>, "the follower").
              </p>
              <p>
                In the 10th century AD, Persian astronomer <strong className="text-white">Abd al-Rahman al-Sufi</strong> published the landmark <em>Book of Fixed Stars</em> (Kitāb Ṣuwar al-Kawākib), translating Ptolemy's 2nd-century <em>Almagest</em> into Arabic and integrating rich indigenous Bedouin sky lore.
              </p>

              {/* Shortened & Merged Cultural Roots Breakdown */}
              <div className="pt-1">
                <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold mb-2">
                  Cultural Roots Breakdown:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-900/70 border border-amber-500/30 space-y-1">
                    <div className="font-bold text-amber-300 font-mono text-xs flex items-center justify-between">
                      <span>Arabic (~60%)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Al-Sufi &amp; Bedouin</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Constellation anatomy and positions (e.g. Rigel, Deneb, Fomalhaut, Achernar).
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/30 space-y-1">
                    <div className="font-bold text-cyan-300 font-mono text-xs flex items-center justify-between">
                      <span>Greek (~20%)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Antiquity &amp; Myth</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Physical properties and mythological roles (e.g. Sirius, Arcturus, Antares).
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/70 border border-emerald-500/30 space-y-1">
                    <div className="font-bold text-emerald-300 font-mono text-xs flex items-center justify-between">
                      <span>Latin (~15%)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Roman &amp; Navigational</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Agricultural, seasonal, and navigation markers (e.g. Polaris, Spica, Bellatrix).
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-400/30 space-y-1.5">
                <div className="text-xs font-bold text-cyan-300 font-mono uppercase tracking-wider">
                  The 2016 IAU Working Group on Star Names (WGSN)
                </div>
                <p className="text-xs text-slate-200">
                  Prior to 2016, there was no single international authority certifying proper names! In May 2016, the International Astronomical Union established the <strong>WGSN</strong> to standardize spellings and enforce the rule that <em>proper names apply strictly to individual single stars</em> (e.g., <strong>Rigil Kentaurus</strong> is specifically Alpha Centauri A, while <strong>Proxima Centauri</strong> is Alpha Centauri C).
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Famous Proper Names Table */}
          <div className="rounded-2xl bg-[#030718]/90 border border-cyan-500/30 p-4 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Catalog of Famous Proper Names
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  All examples link directly to stars in Starpedia’s 3D Catalog with real 2D stellar dots. Click to view their dossiers.
                </p>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, meaning, constellation..."
                    value={properNameSearch}
                    onChange={(e) => setProperNameSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-[#020512] border border-cyan-500/30 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 sm:w-60"
                  />
                </div>

                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#020512] border border-cyan-500/30 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">All Languages</option>
                  <option value="arabic">Arabic</option>
                  <option value="greek">Greek</option>
                  <option value="latin">Latin</option>
                </select>
              </div>
            </div>

            {/* Names Cards Grid with 2D Dot Model and Direct Dossier Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredProperNames.map((record) => {
                const catalogStar = getCatalogStar(record.catalogId);
                return (
                  <div
                    key={record.name}
                    onClick={() => {
                      if (catalogStar && onSelectStar) onSelectStar(catalogStar);
                    }}
                    className="p-3.5 rounded-xl bg-[#04081c]/80 hover:bg-[#071233] border border-cyan-500/25 hover:border-cyan-400/70 transition-all space-y-2.5 flex flex-col justify-between group cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] select-none"
                    title={`Click to open ${catalogStar ? catalogStar.name : record.name} Dossier`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <StarDot2D star={catalogStar} colorHex={catalogStar?.colorHex || '#ffffff'} />
                          <div>
                            <div className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {record.name}
                            </div>
                            {record.pronunciation && (
                              <div className="text-[10px] font-mono text-slate-400">
                                /{record.pronunciation}/
                              </div>
                            )}
                          </div>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 border border-cyan-500/30 shrink-0">
                          {record.language}
                        </span>
                      </div>

                      <div className="mt-2 text-xs font-semibold text-cyan-200 font-sans">
                        "{record.meaning}"
                      </div>

                      <p className="text-[11px] text-slate-300 font-sans mt-1 leading-relaxed">
                        {record.etymologyStory}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <div>
                        <span>{record.bayerOrId}</span> · <span className="text-slate-300">{record.constellation}</span>
                      </div>
                      <div className="flex items-center gap-1 text-cyan-400 group-hover:text-white font-semibold transition-colors">
                        <span>Dossier</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mapped Proper Name Stars Directory */}
          <ClassificationMappedStarsSection
            title="Mapped Stars with IAU-Designated & Approved Proper Names in Catalog"
            categoryColor="#f59e0b"
            allMappedStars={mappedProperNameStars}
            onSelectStar={(star) => onSelectStar && onSelectStar(star)}
          />
        </div>
      )}

      {/* 3. BAYER DESIGNATIONS TAB - Multi-Tier System */}
      {activeTab === 'bayer' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Sub-tab Hero Banner: Bayer Designations */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-5 md:p-6 lg:p-7 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-1 sm:space-y-1.5 md:space-y-2">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-amber-400 shrink-0" />
                <span>The Multi-Tier Bayer System</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
                Introduced in Johann Bayer’s landmark 1603 celestial atlas Uranometria, this hierarchical system combines Greek letters, lowercase Latin, and uppercase Latin with constellation genitives, systematically mapping stars where Greek letters were exhausted.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#030718]/90 border border-cyan-500/30 p-5 sm:p-6 shadow-xl backdrop-blur-md">
            <div className="text-xs sm:text-sm text-slate-300 font-sans space-y-3 leading-relaxed">
              <p>
                A widespread misconception is that Bayer designations only use Greek letters. In reality, Johann Bayer designed a systematic, multi-tier sequence to label hundreds of stars in rich constellations where the 24 letters of the Greek alphabet were quickly exhausted:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-amber-500/40 space-y-1.5">
                  <div className="text-xs font-bold font-mono text-amber-300">
                    Tier 1: Greek Letters (α to ω)
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">
                    The 24 classical Greek letters (α, β, γ … ω). Generally assigned to the brightest stars within each magnitude group in the constellation.
                  </p>
                  <div className="text-[11px] font-mono text-amber-200/90 pt-1">
                    Examples: α Centauri, β Orionis (Rigel), γ Crucis
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-cyan-500/40 space-y-1.5">
                  <div className="text-xs font-bold font-mono text-cyan-300">
                    Tier 2: Lowercase Latin (a to z)
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">
                    When Greek letters ran out, Bayer continued with lowercase Latin letters a through z (deliberately omitting "j" to prevent confusion with "i").
                  </p>
                  <div className="text-[11px] font-mono text-cyan-200/90 pt-1">
                    Examples: b Centauri, c Centauri, l Carinae, q Carinae
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-purple-500/40 space-y-1.5">
                  <div className="text-xs font-bold font-mono text-purple-300">
                    Tier 3: Uppercase Latin (A to Q)
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">
                    When lowercase letters ran out, Bayer used uppercase Latin A through Q (omitting "J"). Letters R through Z were later reserved by Argelander for variable stars!
                  </p>
                  <div className="text-[11px] font-mono text-purple-200/90 pt-1">
                    Examples: P Cygni, A Centauri, B Centauri
                  </div>
                </div>
              </div>

              {/* Showcase Real Catalog Star: P Cygni */}
              {(() => {
                const pCygni = getCatalogStar('p-cygni');
                if (!pCygni) return null;
                return (
                  <div
                    onClick={() => onSelectStar && onSelectStar(pCygni)}
                    className="p-4 rounded-xl bg-purple-950/30 hover:bg-purple-950/50 border border-purple-500/40 transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-sm"
                    title="Open P Cygni Dossier"
                  >
                    <div className="flex items-center gap-3">
                      <StarDot2D star={pCygni} colorHex={pCygni.colorHex} sizeClassName="w-4 h-4" />
                      <div>
                        <div className="text-sm font-bold text-white font-mono group-hover:text-purple-300 transition-colors">
                          P Cygni (The Permanent Nova)
                        </div>
                        <div className="text-xs text-slate-300 font-sans">
                          A real surviving uppercase Latin Bayer designation in the catalog! Luminous Blue Variable hypergiant.
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-mono text-purple-300 font-semibold shrink-0">
                      <span>View Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Greek Alphabet Reference Table with Real Catalog Links */}
          <div className="rounded-2xl bg-[#030718]/90 border border-cyan-500/30 p-4 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <List className="w-4 h-4 text-cyan-400" />
              <span>Greek Alphabet Astronomical Sequence</span>
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              All 24 letters used in Bayer designations. Stars with 2D dots exist in Starpedia’s catalog—click to open their dossiers directly.
            </p>

            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1 sm:gap-2.5">
              {GREEK_ALPHABET_REFERENCE.map((item) => {
                const catalogStar = getCatalogStar(item.catalogId);
                return (
                  <div
                    key={item.name}
                    onClick={() => {
                      if (catalogStar && onSelectStar) onSelectStar(catalogStar);
                    }}
                    className={`p-1 sm:p-2.5 rounded-md sm:rounded-xl bg-[#04081c] border border-cyan-500/20 transition-all text-center space-y-0.5 sm:space-y-1 ${
                      catalogStar ? 'hover:border-cyan-400 hover:bg-[#071333] cursor-pointer group shadow-sm' : ''
                    }`}
                  >
                    <div className="text-xs sm:text-2xl font-serif font-bold text-cyan-300 leading-tight">{item.letter}</div>
                    <div className="min-w-0 overflow-hidden">
                      <RunningText
                        text={item.name}
                        className="text-[8px] sm:text-xs font-bold text-white font-mono leading-tight"
                      />
                    </div>
                    <div className="text-[7px] sm:text-[10px] text-slate-300 font-sans pt-0.5 sm:pt-1 border-t border-cyan-500/15 flex items-center justify-center gap-0.5 sm:gap-1 leading-tight min-w-0 overflow-hidden">
                      {catalogStar && <StarDot2D star={catalogStar} colorHex={catalogStar.colorHex} sizeClassName="w-1 h-1 sm:w-2 sm:h-2 shrink-0" />}
                      <RunningText
                        text={item.example}
                        className={catalogStar ? 'group-hover:text-cyan-300 font-semibold' : ''}
                        title={item.example}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Multiple Stars Sharing a Bayer Designation */}
          <div className="rounded-2xl bg-[#030718]/90 border border-cyan-500/30 p-4 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
              <Binary className="w-4 h-4 text-cyan-400" />
              <span>Bayer Nomenclature Nuances · Multi-Star Systems &amp; Visual Pairs</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Multiple Stars Sharing a Bayer Designation
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              When Johann Bayer assigned designations in his 1603 <em>Uranometria</em>, stars that appeared visually close together, formed asterisms, or shared naked-eye proximity were frequently assigned the <strong className="text-cyan-300">exact same Greek letter</strong>. Later astronomers systematically distinguished them using <strong className="text-amber-300">numerical superscripts</strong> (e.g. π¹ / π², ζ¹ / ζ², μ¹ / μ², θ¹ / θ²) or uppercase component letters (e.g. α Centauri A, B, C):
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
              {BAYER_SHARED_DESIGNATIONS_LORE.map((group) => (
                <div
                  key={group.baseDesignation}
                  className="p-4 rounded-xl bg-[#04081c] border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold font-mono text-cyan-300">
                        {group.baseDesignation}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                        {group.constellation}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-amber-300 font-mono">
                      {group.phenomenon}
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-snug">
                      {group.explanation}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-cyan-500/20">
                    <div className="text-[10px] uppercase tracking-wider font-mono text-slate-400">
                      Mapped Catalog Stars:
                    </div>
                    <div className="space-y-1">
                      {group.stars.map((st) => {
                        const catalogStar = getCatalogStar(st.catalogId);
                        return (
                          <button
                            key={st.catalogId}
                            type="button"
                            onClick={() => {
                              if (catalogStar && onSelectStar) onSelectStar(catalogStar);
                            }}
                            className={`w-full text-left p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-cyan-400/60 hover:bg-[#071333] transition-all flex items-center justify-between gap-2 group cursor-pointer ${
                              catalogStar ? '' : 'opacity-60 pointer-events-none'
                            }`}
                            title={`Open ${st.name} Dossier`}
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                              {catalogStar && <StarDot2D star={catalogStar} colorHex={catalogStar.colorHex} sizeClassName="w-2.5 h-2.5 shrink-0" />}
                              <div className="min-w-0 flex-1 overflow-hidden">
                                <RunningText
                                  text={st.designation}
                                  className="text-xs font-mono font-bold text-white group-hover:text-cyan-300"
                                />
                                <RunningText
                                  text={st.role}
                                  className="text-[10px] text-slate-400 font-sans"
                                />
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The Famous "Elnath" Case: Stars on Constellation Borders */}
          <div className="rounded-2xl bg-[#030718]/90 border border-amber-500/30 p-4 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Historical Nomenclature Case Study · Constellation Border Stars</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              The Famous "Elnath" Case: Dual Constellation Designations
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              <div className="lg:col-span-8 space-y-3 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-300">
                    <span>Historic Dual Identity:</span>
                    <span className="text-white">β Tauri (Taurus) &amp; γ Aurigae (Auriga)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {ELNATH_CASE_LORE.coreLore}
                  </p>
                </div>
                <p className="text-xs text-slate-400 italic">
                  {ELNATH_CASE_LORE.significance}
                </p>
              </div>

              <div className="lg:col-span-4">
                {(() => {
                  const elnathStar = getCatalogStar(ELNATH_CASE_LORE.starId);
                  return (
                    <div
                      onClick={() => {
                        if (elnathStar && onSelectStar) onSelectStar(elnathStar);
                      }}
                      className="p-4 rounded-xl bg-gradient-to-br from-[#071333] to-[#04081c] border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer group shadow-lg space-y-3"
                      title="Open Elnath (Beta Tauri) Dossier"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 border border-amber-500/40 text-amber-300">
                          Border Star Archetype
                        </span>
                        {elnathStar && <StarDot2D star={elnathStar} colorHex={elnathStar.colorHex} sizeClassName="w-3.5 h-3.5" />}
                      </div>

                      <div>
                        <div className="text-base font-bold font-mono text-white group-hover:text-amber-300 transition-colors">
                          {ELNATH_CASE_LORE.starName}
                        </div>
                        <div className="text-xs font-mono text-cyan-300">
                          {ELNATH_CASE_LORE.modernDesignation}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 pt-2 border-t border-amber-500/20">
                        <div>
                          <span className="text-slate-500 block text-[9px] uppercase">Constellation</span>
                          <span className="text-amber-200">{ELNATH_CASE_LORE.constellation}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9px] uppercase">Ex-Constellation</span>
                          <span className="text-slate-300">{ELNATH_CASE_LORE.neighborConstellation}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9px] uppercase">Spectral Type</span>
                          <span className="text-cyan-200">{ELNATH_CASE_LORE.spectralType}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9px] uppercase">Distance</span>
                          <span className="text-slate-200">{ELNATH_CASE_LORE.distanceLy} ly</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-xs font-mono text-amber-300 font-semibold group-hover:text-white">
                        <span>Open Stellar Dossier</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Mapped Greek Bayer Stars Directory */}
          <ClassificationMappedStarsSection
            title="Mapped Bayer Greek Letter Stars in Catalog"
            categoryColor="#38bdf8"
            allMappedStars={mappedGreekStars}
            onSelectStar={(star) => onSelectStar && onSelectStar(star)}
          />
        </div>
      )}

      {/* 4. NUMBERED DESIGNATIONS TAB - Flamsteed & Gould Systems */}
      {activeTab === 'numbered' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Sub-tab Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-5 md:p-6 lg:p-7 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-1 sm:space-y-1.5 md:space-y-2">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <List className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-sky-400 shrink-0" />
                <span>Numbered Designations: Flamsteed &amp; Gould Systems</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
                Unlike Greek letters, numbered stellar designations are ordered sequentially from West to East across constellations by Right Ascension rather than visual brightness.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#030718]/90 border border-cyan-500/30 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
            <div className="text-xs sm:text-sm text-slate-300 font-sans space-y-3 leading-relaxed">
              <p>
                Unlike Greek letters, numbered stellar designations are <strong className="text-cyan-300">not ordered by brightness</strong>. Instead, stars within each constellation are numbered sequentially from <strong className="text-white">West to East by Right Ascension (RA)</strong>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Flamsteed Numbers */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-sky-500/40 space-y-2">
                  <div className="text-xs font-bold font-mono text-sky-300 uppercase">
                    1. Flamsteed Numbers (1725)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Compiled by England’s first Astronomer Royal, <strong className="text-white">John Flamsteed</strong>, in <em>Historia Coelestis Britannica</em>. Covers northern and equatorial constellations visible from Greenwich (+51° N).
                  </p>
                  <div className="font-mono text-[11px] text-sky-200 p-2 rounded bg-black/40 border border-sky-500/20">
                    Format: [Number] [Constellation Genitive]<br />
                    Examples: 51 Pegasi, 61 Cygni, 18 Scorpii
                  </div>
                </div>

                {/* Gould Designations */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/40 space-y-2">
                  <div className="text-xs font-bold font-mono text-emerald-300 uppercase">
                    2. Gould Designations (1879)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Compiled by American astronomer <strong className="text-white">Benjamin Apthorp Gould</strong> in <em>Uranometria Argentina</em>. Because Flamsteed could not see deep southern skies from England, Gould created the southern hemisphere equivalent from Córdoba, Argentina!
                  </p>
                  <div className="font-mono text-[11px] text-emerald-200 p-2 rounded bg-black/40 border border-emerald-500/20">
                    Format: [Number] G. [Constellation Genitive]<br />
                    The "G." explicitly stands for <strong>Gould</strong>!<br />
                    Examples: 82 G. Eridani, 33 G. Librae
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real Showcase Stars from Catalog */}
          <div className="rounded-2xl bg-[#030718]/90 border border-cyan-500/30 p-4 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-white">
              Numbered Stars in Starpedia’s Catalog
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Click any card to open its full dossier directly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {NUMBERED_STARS_SHOWCASE.map((item) => {
                const star = getCatalogStar(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (star && onSelectStar) onSelectStar(star);
                    }}
                    className="p-3.5 rounded-xl bg-[#04081c] hover:bg-[#071333] border border-cyan-500/20 hover:border-cyan-400/60 transition-all space-y-2 cursor-pointer group shadow-sm flex flex-col justify-between"
                    title={`Open ${item.title} Dossier`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                          {star && <StarDot2D star={star} colorHex={star.colorHex} sizeClassName="w-2.5 h-2.5 shrink-0" />}
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <RunningText
                              text={item.title}
                              className="text-sm font-bold font-mono text-white group-hover:text-cyan-300 transition-colors"
                            />
                          </div>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 shrink-0">
                          {item.numberStr}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400 mt-1">{item.system}</div>
                      <p className="text-[11px] text-slate-300 font-sans mt-1 leading-snug">{item.significance}</p>
                    </div>

                    <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>{item.constellation}</span>
                      <div className="flex items-center gap-1 text-cyan-400 font-semibold group-hover:text-white">
                        <span>Open Dossier</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mapped Numbered Stars Directory (Without Greek Bayer) */}
          <ClassificationMappedStarsSection
            title="Mapped Numbered Stars without Bayer Designation (Flamsteed & Gould)"
            categoryColor="#38bdf8"
            allMappedStars={mappedNumberedStars}
            onSelectStar={(star) => onSelectStar && onSelectStar(star)}
          />
        </div>
      )}

      {/* 5. VARIABLE STAR NOMENCLATURE (ARGELANDER) TAB */}
      {activeTab === 'variable' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Sub-tab Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-5 md:p-6 lg:p-7 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-1 sm:space-y-1.5 md:space-y-2">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-rose-400 shrink-0" />
                <span>The 4-Phase Argelander Variable System</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
                As astronomers discovered pulsating and eruptive stars, Friedrich Wilhelm Argelander devised a standardized 4-phase sequence starting at letter R to guarantee zero collisions with Bayer designations.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#030718]/90 border border-cyan-500/30 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
            <div className="text-xs sm:text-sm text-slate-300 font-sans space-y-3 leading-relaxed">
              <p>
                As astronomers discovered pulsating and eruptive stars, German astronomer <strong className="text-white">Friedrich Wilhelm Argelander</strong> devised a standardized naming sequence. Because Johann Bayer had already used Latin letters <em>A through Q</em> (like P Cygni), Argelander began strictly with the letter <strong className="text-rose-400">R</strong> to guarantee zero collisions!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-1">
                  <div className="text-xs font-bold font-mono text-amber-300 flex items-center justify-between">
                    <span>Phase 1: Single Letters (R to Z)</span>
                    <span className="text-[10px] text-slate-400">9 Stars</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    R, S, T, U, V, W, X, Y, Z. (e.g. <em>R Coronae Borealis</em>, <em>S Doradus</em>).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-1">
                  <div className="text-xs font-bold font-mono text-cyan-300 flex items-center justify-between">
                    <span>Phase 2: Double Letters (RR to ZZ)</span>
                    <span className="text-[10px] text-slate-400">54 Stars</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    RR through RZ (9), SS through SZ (8), down to ZZ (1). (e.g. <em>RR Lyrae</em>).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-1">
                  <div className="text-xs font-bold font-mono text-emerald-300 flex items-center justify-between">
                    <span>Phase 3: Double Letters (AA to QZ)</span>
                    <span className="text-[10px] text-slate-400">280 Stars (Total: 334)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Loops back to AA..AZ, BB..BZ down to QZ. <strong>Letter 'J' was deliberately skipped</strong> to prevent confusion with 'I' in 19th-century German Fraktur script!
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-1">
                  <div className="text-xs font-bold font-mono text-rose-300 flex items-center justify-between">
                    <span>Phase 4: Numerical V-Numbers</span>
                    <span className="text-[10px] text-slate-400">Star #335 to Infinity</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Once all 334 lettered slots are exhausted, stars are simply designated V335, V336... (e.g. <em>V838 Monocerotis</em> in our catalog!).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Showcased Variable Stars Across All 4 Argelander Phases */}
          <div className="rounded-2xl bg-[#030718]/90 border border-cyan-500/30 p-4 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-wider">
              <Activity className="w-4 h-4 text-rose-400" />
              <span>Variable Stars Showcased Across All 4 Argelander Phases</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Real Variable Stars in Starpedia’s Catalog
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              From Phase 1 single letters (R–Z) up to Phase 4 V-numbers (V335+), click any star to open its full dossier.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
              {VARIABLE_STARS_SHOWCASE.map((item) => {
                const star = getCatalogStar(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (star && onSelectStar) onSelectStar(star);
                    }}
                    className="p-3.5 rounded-xl bg-[#04081c] hover:bg-[#071333] border border-cyan-500/20 hover:border-rose-400/60 transition-all space-y-2 cursor-pointer group shadow-sm flex flex-col justify-between"
                    title={`Open ${item.name} Dossier`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                          {star && <StarDot2D star={star} colorHex={star.colorHex} sizeClassName="w-2.5 h-2.5 shrink-0" />}
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <RunningText
                              text={item.name}
                              className="text-sm font-bold font-mono text-white group-hover:text-rose-300 transition-colors"
                            />
                          </div>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/80 border border-rose-500/30 text-rose-300 shrink-0">
                          {item.designation}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-[10px] font-mono mt-1">
                        <span className="text-amber-300 font-semibold">{item.phase}</span>
                        <span className="text-slate-400">{item.constellation}</span>
                      </div>
                      <div className="text-[11px] font-mono text-cyan-300 mt-0.5">{item.variableType}</div>
                      <p className="text-[11px] text-slate-300 font-sans mt-1 leading-snug">{item.significance}</p>
                    </div>

                    <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>{star?.spectralType || item.constellation}</span>
                      <div className="flex items-center gap-1 text-rose-400 font-semibold group-hover:text-white">
                        <span>Open Dossier</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mapped Variable Stars Directory (Without Greek Bayer) */}
          <ClassificationMappedStarsSection
            title="Mapped Variable Stars without Bayer Designation (Argelander & GCVS)"
            categoryColor="#f43f5e"
            allMappedStars={mappedVariableStars}
            onSelectStar={(star) => onSelectStar && onSelectStar(star)}
          />
        </div>
      )}

      {/* 6. MODERN CATALOGS TAB - Expanded with Luyten, Durchmusterung, Wolf, Ross, Tycho, SAO, WDS */}
      {activeTab === 'catalogs' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Sub-tab Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-5 md:p-6 lg:p-7 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-1 sm:space-y-1.5 md:space-y-2">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <Database className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-cyan-400 shrink-0" />
                <span>Major Astronomical Catalogs</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
                From foundational 19th-century visual surveys to modern spaceborne astrometry (Gaia, Hipparcos), exoplanet hunters (TESS, Kepler), and infrared sky surveys (WISE, 2MASS), explore the standardized numbering schemes that index the cosmos.
              </p>
            </div>
          </div>

          {/* Catalogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MODERN_CATALOGS.map((cat) => {
              const catalogStar = getCatalogStar(cat.catalogId);
              return (
                <div
                  key={cat.prefix}
                  className="p-5 rounded-2xl bg-[#030718]/90 border border-cyan-500/30 space-y-3.5 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-cyan-500/20 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black font-mono" style={{ color: cat.accentColor }}>
                            {cat.prefix}
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-500/30 font-bold">
                            {cat.yearIntroduced}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-white font-sans mt-1">
                          {cat.fullName}
                        </div>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-cyan-500/20 text-cyan-400 uppercase shrink-0">
                        {cat.category}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 font-sans">
                      <div>
                        <strong className="text-slate-400 font-mono text-[11px]">Compiled By & Era:</strong>{' '}
                        <span>{cat.compiledBy} ({cat.era})</span>
                      </div>
                      <div>
                        <strong className="text-slate-400 font-mono text-[11px]">Primary Purpose:</strong>{' '}
                        <span>{cat.primaryPurpose}</span>
                      </div>
                      <div>
                        <strong className="text-slate-400 font-mono text-[11px]">Numbering Scheme:</strong>{' '}
                        <span className="font-mono text-[11px] text-cyan-300/90">{cat.numberingLogic}</span>
                      </div>
                    </div>

                    {cat.imageUrl && (
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-black/50 border border-slate-700/60">
                        <img
                          src={cat.imageUrl}
                          alt={cat.imageCaption || cat.fullName}
                          className="w-16 h-16 rounded-lg object-contain bg-black/70 border border-cyan-500/40 p-1 shadow shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-[10px] font-mono text-cyan-300 uppercase font-semibold">Survey Instrument / Pioneer</div>
                          <div className="text-xs text-slate-200 font-sans">{cat.imageCaption}</div>
                        </div>
                      </div>
                    )}

                    {/* Expanded in-depth explanation */}
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs text-slate-300 font-sans leading-relaxed">
                      <strong className="text-white font-mono text-[11px]">In-Depth Architecture: </strong>
                      {cat.inDepthExplanation}
                    </div>

                    {/* Example Star Card with 2D Dot and Direct Dossier Access */}
                    {catalogStar && (() => {
                      const cleanStarName = catalogStar.name.replace(/\s*\([^)]+\)/g, '').trim().toLowerCase();
                      const cleanCatEx = cat.example.toLowerCase();
                      const isDup = cleanCatEx.includes(cleanStarName) || cleanStarName.includes(cleanCatEx);
                      const displayTitle = isDup ? cat.example : `${cat.example} (${catalogStar.name})`;

                      return (
                        <div
                          onClick={() => onSelectStar && onSelectStar(catalogStar)}
                          className="p-3 rounded-xl bg-slate-900/80 hover:bg-[#071333] border border-cyan-500/30 hover:border-cyan-400/60 transition-all flex items-center justify-between gap-2 cursor-pointer group shadow-sm"
                          title={`Open ${catalogStar.name} Dossier`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <StarDot2D star={catalogStar} colorHex={catalogStar.colorHex} />
                            <div className="min-w-0 flex-1 overflow-hidden">
                              <RunningText
                                text={displayTitle}
                                className="font-mono text-xs font-bold text-white group-hover:text-cyan-300 transition-colors"
                              />
                              <RunningText
                                text={cat.exampleTarget}
                                className="text-[11px] text-slate-400"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 font-semibold shrink-0">
                            <span>Dossier</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="text-[11px] text-slate-400 font-sans pt-2 border-t border-cyan-500/15">
                    <strong className="text-slate-300">Significance:</strong> {cat.significance}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mapped Modern Survey Catalogs Directory */}
          <ClassificationMappedStarsSection
            title="Mapped Stars with Modern Survey Catalog Numbers (Without Bayer Designation)"
            categoryColor="#c084fc"
            allMappedStars={mappedCatalogPrimaryStars}
            onSelectStar={(star) => onSelectStar && onSelectStar(star)}
          />
        </div>
      )}

      {/* 7. CLUSTERS & EXTRAGALACTIC NOMENCLATURE TAB - Brand New Section */}
      {activeTab === 'clusters-extragalactic' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Sub-tab Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-5 md:p-6 lg:p-7 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-1 sm:space-y-1.5 md:space-y-2">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-emerald-400 shrink-0" />
                <span>Star Clusters &amp; Extragalactic Nomenclature</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
                When stars reside in dense super star clusters or neighboring galaxies (the Magellanic Clouds, Andromeda, and distant lensed arcs), astronomers use specialized cluster and extragalactic designation systems. Click on any showcased star to open its interactive 3D dossier.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CLUSTERS_AND_EXTRAGALACTIC_LORE.map((item) => (
              <div
                key={item.systemName}
                className="p-5 rounded-2xl bg-[#030718]/90 border border-cyan-500/30 space-y-3.5 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-cyan-500/20 pb-2.5">
                    <div>
                      <div className="text-lg font-bold font-mono text-white">
                        {item.systemName}
                      </div>
                      <div className="text-xs font-mono text-cyan-400 mt-0.5">
                        {item.parentStructureOrGalaxy}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/30 shrink-0">
                      {item.category}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 font-sans leading-relaxed">
                    <strong className="text-slate-200 font-mono text-[11px]">Naming Protocol: </strong>
                    {item.originAndNamingConvention}
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                    {item.detailedLore}
                  </p>

                  {/* Famous Stars in this Cluster / Survey with 2D Dots and Direct Dossier Links */}
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      Featured Catalog Stars:
                    </div>
                    <div className="space-y-1.5">
                      {item.famousStars.map((starRef) => {
                        const catalogStar = getCatalogStar(starRef.catalogId);
                        return (
                          <div
                            key={starRef.name}
                            onClick={() => {
                              if (catalogStar && onSelectStar) onSelectStar(catalogStar);
                            }}
                            className={`p-2.5 rounded-xl bg-black/40 border border-cyan-500/20 flex items-center justify-between gap-2 transition-all ${
                              catalogStar ? 'hover:border-cyan-400 hover:bg-[#071333] cursor-pointer group shadow-sm' : ''
                            }`}
                            title={catalogStar ? `Open ${catalogStar.name} Dossier` : undefined}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <StarDot2D star={catalogStar} colorHex={catalogStar?.colorHex || '#ffffff'} />
                              <div className="min-w-0 flex-1 overflow-hidden">
                                <RunningText
                                  text={starRef.name}
                                  className="text-xs font-bold font-mono text-white group-hover:text-cyan-300 transition-colors"
                                />
                                <RunningText
                                  text={starRef.role}
                                  className="text-[11px] text-slate-400 font-sans"
                                />
                              </div>
                            </div>
                            {catalogStar && (
                              <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 font-semibold shrink-0">
                                <span>Dossier</span>
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mapped Cluster & Extragalactic Stars Directory */}
          <ClassificationMappedStarsSection
            title="Mapped Cluster & Extragalactic Stars (Without Bayer Designation)"
            categoryColor="#10b981"
            allMappedStars={mappedClusterExtragalacticStars}
            onSelectStar={(star) => onSelectStar && onSelectStar(star)}
          />
        </div>
      )}

      {/* 8. MISCELLANEOUS NAMES TAB - Expanded to NML Cygni and Unconventional Lore */}
      {activeTab === 'misc-names' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Sub-tab Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-5 md:p-6 lg:p-7 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-1 sm:space-y-1.5 md:space-y-2">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <Tag className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-amber-400 shrink-0" />
                <span>Miscellaneous Astronomical Names</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
                Throughout history, astronomers have bestowed evocative astronomer-initial acronyms (like NML Cygni), discoverer eponyms, color descriptions, and celestial epithets that have become universally famous.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MISCELLANEOUS_NAMES.map((item) => {
              const star = getCatalogStar(item.catalogId);
              return (
                <div
                  key={item.popularName}
                  onClick={() => {
                    if (star && onSelectStar) onSelectStar(star);
                  }}
                  className="p-4 rounded-xl bg-[#04081c] hover:bg-[#071333] border border-cyan-500/25 hover:border-cyan-400/60 transition-all space-y-2.5 flex flex-col justify-between cursor-pointer group shadow-sm"
                  title={`Open ${item.popularName} Dossier`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {star && <StarDot2D star={star} colorHex={star.colorHex} />}
                        <div>
                          <div className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {item.popularName}
                          </div>
                          <div className="text-xs font-mono text-cyan-400">{item.formalDesignation}</div>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/30 shrink-0">
                        {item.originType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {item.story}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{star?.constellation}</span>
                    <div className="flex items-center gap-1 text-cyan-400 group-hover:text-white font-semibold">
                      <span>Open Dossier</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 9. NON-STARS WITH STELLAR DESIGNATIONS TAB */}
      {activeTab === 'non-stars' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Sub-tab Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-5 md:p-6 lg:p-7 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-1 sm:space-y-1.5 md:space-y-2">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-rose-400 shrink-0" />
                <span>Non-Stars with Stellar Designations</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
                Before modern high-resolution telescopes and spectroscopy, astronomers frequently mistook star clusters, nebulae, and supernovae for single stars—leaving celestial wonders bearing Bayer Greek letters or Flamsteed numbers today.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NON_STAR_STELLAR_DESIGNATIONS.map((item) => {
              const catalogStar = getCatalogStar(item.catalogId);
              return (
                <div
                  key={item.designation}
                  className="p-5 rounded-2xl bg-[#030718]/90 border border-cyan-500/30 space-y-3 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2 border-b border-cyan-500/20 pb-2">
                      <div>
                        <div className="text-lg font-bold font-mono text-white">
                          {item.designation}
                        </div>
                        <div className="text-xs text-rose-300 font-mono mt-0.5">
                          {item.type}
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs">
                      <strong className="text-cyan-300 font-mono">Actual Identity:</strong>{' '}
                      <span className="text-white font-medium">{item.actualIdentity}</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 font-sans leading-relaxed">
                      <div>
                        <strong className="text-slate-200">Historical Classification:</strong>{' '}
                        {item.historicalContext}
                      </div>
                      <div className="pt-1">
                        <strong className="text-slate-200">How It Was Unmasked:</strong>{' '}
                        {item.discoveryStory}
                      </div>
                    </div>
                  </div>

                  {catalogStar && onSelectStar && (
                    <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-end">
                      <button
                        onClick={() => onSelectStar(catalogStar)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-semibold transition-all cursor-pointer"
                      >
                        <StarDot2D star={catalogStar} colorHex={catalogStar.colorHex} />
                        <span>Open Stellar Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 10. COMPONENTS & EXOPLANETS TAB - Expanded with Two Tiers of Stellar Components */}
      {activeTab === 'components-planets' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Sub-tab Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-5 md:p-6 lg:p-7 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-1 sm:space-y-1.5 md:space-y-2">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <Binary className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-purple-400 shrink-0" />
                <span>Stellar Components vs. Exoplanet Lettering</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
                Learn how uppercase letters denote major physical stellar components, lowercase suffixes split spectroscopic binaries, and lowercase planet designations track exoplanetary discoveries.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#030718]/90 border border-cyan-500/30 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
            <div className="text-xs sm:text-sm text-slate-300 font-sans space-y-3 leading-relaxed">
              {/* Two Tiers of Stellar Components */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Tier 1: Major Physical Components */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/40 space-y-2">
                  <div className="text-sm font-bold font-mono text-cyan-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Tier 1: Uppercase Letters (A, B, C...)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Assigned to wide visual or major physical components in order of decreasing brightness or mass. <strong>Component A</strong> is the primary star; <strong>Component B</strong> is the secondary companion; <strong>Component C</strong> is tertiary.
                  </p>
                  <div className="p-2.5 rounded-lg bg-black/50 border border-slate-700 font-mono text-[11px] text-cyan-200 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <StarDot2D star={getCatalogStar('alpha-centauri-a')} sizeClassName="w-2 h-2" />
                      <span>Alpha Centauri A (Rigil Kentaurus)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarDot2D star={getCatalogStar('alpha-centauri-b')} sizeClassName="w-2 h-2" />
                      <span>Alpha Centauri B (Toliman)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarDot2D star={getCatalogStar('proxima-centauri')} sizeClassName="w-2 h-2" />
                      <span>Alpha Centauri C (Proxima Centauri)</span>
                    </div>
                  </div>
                </div>

                {/* Tier 2: Close Sub-Components */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/40 space-y-2">
                  <div className="text-sm font-bold font-mono text-amber-300 flex items-center gap-2">
                    <Binary className="w-4 h-4 text-amber-400" />
                    <span>Tier 2: Lowercase Sub-Suffixes (Aa, Ab, Ba...)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    When high-resolution spectroscopy, speckle interferometry, or space astrometry splits a primary component into a close spectroscopic sub-binary, lowercase letters are appended!
                  </p>
                  <div className="p-2.5 rounded-lg bg-black/50 border border-slate-700 font-mono text-[11px] text-amber-200 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <StarDot2D star={getCatalogStar('polaris')} sizeClassName="w-2 h-2" />
                      <span>Polaris Aa (F7Ib supergiant primary)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarDot2D colorHex="#fef08a" sizeClassName="w-2 h-2" />
                      <span>Polaris Ab (close F-dwarf discovered by Hubble in 2006)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarDot2D colorHex="#fef08a" sizeClassName="w-2 h-2" />
                      <span>Polaris B (distant visual companion at 2,400 AU)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exoplanet Naming Hierarchy */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/40 space-y-3 mt-2">
                <div className="text-sm font-bold font-mono text-purple-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span>Exoplanet Naming System (IAU Commission 53 / F2 Rules)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 font-sans leading-relaxed">
                  <div>
                    <strong className="text-white">Starts at Lowercase 'b': </strong>
                    The first confirmed planet orbiting a star always receives the suffix <strong>'b'</strong> (e.g. 51 Pegasi b). The letter <strong>'a' is strictly reserved for the parent host star itself</strong>!
                  </div>
                  <div>
                    <strong className="text-white">Discovery Order, NOT Distance: </strong>
                    Planets are lettered in the order they were confirmed, <em>not</em> by orbital distance! In 55 Cancri, planet <strong>e</strong> is closest to the star, but was discovered 4th after b, c, and d.
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-black/50 border border-purple-500/30 font-mono text-[11px] text-purple-200 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <StarDot2D colorHex="#fbbf24" sizeClassName="w-2 h-2" />
                    <span><strong>Circumbinary Planet (orbiting both stars):</strong> Kepler-16(AB)b</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarDot2D star={getCatalogStar('alpha-centauri-b')} sizeClassName="w-2 h-2" />
                    <span><strong>Circumstellar in Binary System:</strong> Alpha Centauri Bb (orbits star B)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarDot2D colorHex="#f59e0b" sizeClassName="w-2 h-2" />
                    <span><strong>Candidate Exomoons:</strong> Kepler-1625b I (Roman numerals)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarDot2D star={getCatalogStar('51-pegasi')} sizeClassName="w-2 h-2" />
                    <span><strong>NameExoWorlds Public Names:</strong> Star Helvetios + Planet Dimidium (51 Pegasi)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. MASTERY QUIZ TAB */}
      {activeTab === 'quiz' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Sub-tab Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-5 md:p-6 lg:p-7 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
              <div className="space-y-1 sm:space-y-1.5 md:space-y-2 max-w-2xl">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-2.5 md:gap-3">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-amber-400 shrink-0" />
                  <span>Stellar Nomenclature Mastery Quiz</span>
                </h2>
                <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
                  Test your mastery across proper names, Bayer tiers, Flamsteed numbering, Argelander variable phases, catalog acronyms, and exoplanet lettering.
                </p>
              </div>

              {isQuizSubmitted && (
                <div className="flex items-center gap-3 shrink-0">
                  <div className="px-2.5 sm:px-3 md:px-3.5 py-1 sm:py-1.5 md:py-2 rounded-xl bg-cyan-950/80 border border-cyan-400 text-cyan-300 font-mono text-[11px] sm:text-xs font-bold">
                    Score: {quizScore} / {NOMENCLATURE_QUIZ_QUESTIONS.length}
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-[#030718]/90 border border-cyan-500/30 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
            {/* Questions List */}
            <div className="space-y-5">
              {NOMENCLATURE_QUIZ_QUESTIONS.map((q, qIndex) => {
                const userPick = selectedAnswers[q.id];
                const isAnswered = userPick !== undefined;
                const isCorrect = userPick === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-[#020512] border border-cyan-500/20 space-y-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                        {qIndex + 1}
                      </span>
                      <div className="font-semibold text-xs sm:text-sm text-white font-sans leading-relaxed">
                        {q.question}
                      </div>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-8">
                      {q.options.map((option, optIdx) => {
                        const isThisChosen = userPick === optIdx;
                        let optionStyle = 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-800';

                        if (isQuizSubmitted) {
                          if (optIdx === q.correctIndex) {
                            optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                          } else if (isThisChosen && !isCorrect) {
                            optionStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 line-through';
                          }
                        } else if (isThisChosen) {
                          optionStyle = 'bg-cyan-950/80 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isQuizSubmitted}
                            onClick={() =>
                              setSelectedAnswers((prev) => ({
                                ...prev,
                                [q.id]: optIdx,
                              }))
                            }
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center gap-2 ${optionStyle}`}
                          >
                            <span className="w-5 h-5 rounded-md bg-black/40 flex items-center justify-center font-mono text-[10px] text-slate-400 shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="leading-snug">{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation if submitted */}
                    {isQuizSubmitted && (
                      <div className="ml-8 mt-2 p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/25 text-xs text-slate-300 flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-bold text-white">Explanation: </span>
                          {q.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Button */}
            {!isQuizSubmitted && (
              <div className="flex justify-end pt-2">
                <button
                  disabled={Object.keys(selectedAnswers).length < NOMENCLATURE_QUIZ_QUESTIONS.length}
                  onClick={() => setIsQuizSubmitted(true)}
                  className={`px-5 py-2.5 rounded-xl font-bold font-mono text-xs transition-all flex items-center gap-2 ${
                    Object.keys(selectedAnswers).length === NOMENCLATURE_QUIZ_QUESTIONS.length
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Submit Answers ({Object.keys(selectedAnswers).length}/{NOMENCLATURE_QUIZ_QUESTIONS.length})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
