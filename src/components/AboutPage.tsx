import React from 'react';
import { STARS_CATALOG } from '../data/stars';
import { MULTIPLE_STAR_SYSTEMS } from '../data/multipleStarSystemsData';
import {
  Compass,
  BarChart2,
  Grid,
  BookOpen,
  Orbit,
  Flame,
  Layers,
  Sparkles,
  Telescope,
  Radio,
  Gamepad2,
  Cpu,
  GraduationCap,
  Award,
  ExternalLink,
  Heart,
  Database,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Sliders,
  Scale
} from 'lucide-react';

interface AboutPageProps {
  onNavigateTab: (
    tab:
      | 'home'
      | '3d-stage'
      | 'catalog'
      | 'systems'
      | 'hr-diagram'
      | 'constellations'
      | 'classification'
      | 'guide'
      | 'nomenclature'
      | 'discovery'
  ) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateTab }) => {
  return (
    <article 
      className="max-w-5xl mx-auto flex flex-col gap-10 animate-in fade-in duration-200 pb-12"
      aria-label="About and Credits Project Documentation"
    >
      {/* =========================================================================
          HERO BANNER: Project Origin, Branding & Creator
          ========================================================================= */}
      <section 
        className="relative overflow-hidden rounded-3xl observatory-panel border border-white/10 p-6 md:p-10 shadow-2xl"
        aria-labelledby="about-title"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-sky-500/10 text-sky-300 border border-sky-500/20">
                Official Credits &amp; Documentation
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white/5 text-slate-300 border border-white/10">
                v2.5 (2026 Edition)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {STARS_CATALOG.length} Stars • {MULTIPLE_STAR_SYSTEMS.length} Systems • 88 Constellations
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md w-fit">
                <div className="font-sans font-bold text-sm sm:text-base text-white tracking-wider">
                  STARPEDIA <span className="text-sky-300 font-bold">3D</span>
                </div>
              </div>

              <h1 
                id="about-title" 
                className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans"
              >
                Stars of the Universe
              </h1>
            </div>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              An interactive 3D WebGL astrophysical comparator, comprehensive stellar catalog, dynamic Hertzsprung–Russell phase-space simulator, and 88-constellation celestial atlas spanning nine orders of spatial magnitude, from compact relativistic neutron stars to colossal red hypergiants.
            </p>

            {/* Personal Childhood Passion Note */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-200 text-xs sm:text-sm leading-relaxed max-w-2xl flex items-start gap-3 backdrop-blur-sm">
              <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 fill-rose-400/30" />
              <span>
                This project is inspired by my childhood passion for stars, astronomy, and universe size comparison videos on YouTube, created to turn the celestial wonders I grew up admiring into an interactive, real-time 3D universe for everyone.
              </span>
            </div>
          </div>

          {/* Author & Studio Card */}
          <div className="flex-shrink-0 w-full md:w-auto p-5 rounded-2xl observatory-panel border border-white/10 shadow-xl flex flex-col gap-2.5">
            <div className="text-[11px] font-mono text-sky-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <Award className="w-3.5 h-3.5" /> Creator &amp; Studio
            </div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              <span>B123 Entertainment</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Copyright © 2026 B123 Entertainment.
            </div>
            <div className="text-[11px] text-slate-400">
              Designed &amp; engineered with scientific rigor.
            </div>
            <a
              id="about-kofi-link"
              href="https://ko-fi.com/b123entertainment"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 hover:border-amber-400/60 text-amber-300 font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Support via Ko-fi</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INSPIRATIONS BEHIND THE PROJECT
          ========================================================================= */}
      <section 
        className="flex flex-col gap-5"
        aria-labelledby="inspirations-heading"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-wider font-bold">
            <Sparkles className="w-4 h-4" /> Provenance &amp; Creative Roots
          </div>
          <h2 id="inspirations-heading" className="text-xl sm:text-2xl font-bold text-white font-sans">
            Inspirations Behind The Project
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Inspiration 1: Universe Sandbox */}
          <div className="p-6 rounded-2xl observatory-panel border border-white/10 hover:border-white/20 transition-all duration-200 flex flex-col justify-between gap-4 group">
            <div className="flex flex-col gap-3">
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40 group-hover:border-white/20 transition-all shadow-md">
                <img
                  src="/universe_sandbox_header.jpg"
                  alt="Universe Sandbox Simulation Visual"
                  className="w-full h-28 sm:h-32 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://cdn.akamai.steamstatic.com/steam/apps/230290/header.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                  Universe Sandbox
                </h3>
                <span className="text-xs text-indigo-400 font-mono">Giant Army</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The physics-based space simulator created by Giant Army. Its real-time thermodynamic modeling, stellar luminosity equations, and the sheer awe of inspecting and colliding astronomical titans directly inspired this app’s 3D interactive physics and coronal rendering.
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-indigo-300 font-mono">
              <a
                href="https://store.steampowered.com/app/230290/Universe_Sandbox/"
                target="_blank"
                rel="noreferrer noopener"
                className="hover:underline text-indigo-400 hover:text-indigo-300 focus-visible:ring-1 focus-visible:ring-indigo-300 rounded font-semibold inline-flex items-center gap-1 min-h-[44px]"
                aria-label="Universe Sandbox on Steam"
              >
                <span>Steam Store</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-indigo-300">Astrophysics</span>
            </div>
          </div>

          {/* Inspiration 2: Scale of the Universe */}
          <div className="p-6 rounded-2xl observatory-panel border border-white/10 hover:border-white/20 transition-all duration-200 flex flex-col justify-between gap-4 group">
            <div className="flex flex-col gap-3">
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40 group-hover:border-white/20 transition-all shadow-md">
                <img
                  src="/scale_of_universe_screenshot.png"
                  alt="Cary & Michael Huang's Scale of the Universe 2 - 10^12 meters showing Pistol Star, La Superba, Deneb, and R Doradus"
                  className="w-full h-28 sm:h-32 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                  Scale of the Universe 2
                </h3>
                <span className="text-xs text-sky-400 font-mono">Cary &amp; Michael Huang</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The groundbreaking interactive scale tool at htwins.net. Its effortless logarithmic zoom across orders of magnitude, from subatomic particles to cosmic superclusters, served as the enduring paradigm for our interactive comparative scales.
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-sky-300 font-mono">
              <a 
                href="https://htwins.net/scale2" 
                target="_blank" 
                rel="noreferrer noopener"
                className="hover:underline text-sky-400 hover:text-sky-300 focus-visible:ring-1 focus-visible:ring-sky-300 rounded font-semibold inline-flex items-center gap-1 min-h-[44px]"
                aria-label="Scale of the Universe 2 on htwins.net"
              >
                <span>htwins.net/scale2</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-sky-300">Scale Explorer</span>
            </div>
          </div>

          {/* Inspiration 3: Comparison YouTube Videos */}
          <div className="p-6 rounded-2xl observatory-panel border border-white/10 hover:border-white/20 transition-all duration-200 flex flex-col justify-between gap-4 group">
            <div className="flex flex-col gap-3">
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40 group-hover:border-white/20 transition-all shadow-md">
                <img
                  src="/creator_youtube_thumbnail.png"
                  alt="B123 Entertainment's The Size of the Universe 6 'The Ultimate' Comparison Video"
                  className="w-full h-28 sm:h-32 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
                  Creator's YouTube Channel
                </h3>
                <span className="text-xs text-rose-400 font-mono">comparisonfarts</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The astronomical comparison videos created on the author's YouTube channel (<strong className="text-rose-300 font-mono">youtube.com/comparisonfarts</strong>), such as <em>The Size of the Universe 6: “The Ultimate”</em>. Translating viral comparison animations into a tactile 3D web application where users can spin, zoom, and inspect stars at will.
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <a 
                href="https://youtube.com/comparisonfarts" 
                target="_blank" 
                rel="noreferrer noopener"
                className="text-rose-400 hover:text-rose-300 font-bold hover:underline focus-visible:ring-1 focus-visible:ring-rose-400 rounded inline-flex items-center gap-1 min-h-[44px]"
                aria-label="Visit Comparison Videos YouTube Channel at youtube.com/comparisonfarts"
              >
                <span>comparisonfarts</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-rose-300">Creator Channel</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          COMPREHENSIVE FUNCTIONAL SUITE (WHAT YOU CAN EXPLORE)
          ========================================================================= */}
      <section 
        className="flex flex-col gap-5"
        aria-labelledby="features-heading"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-wider font-bold">
            <Compass className="w-4 h-4" /> Complete Capability Matrix
          </div>
          <h2 id="features-heading" className="text-xl sm:text-2xl font-bold text-white font-sans">
            Comprehensive Application Subsystems
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Feature 1 */}
          <div className="p-5 rounded-2xl observatory-panel border border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 text-sky-400 border border-white/10 shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">3D Real-Scale Star Comparator</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Side-by-side WebGL comparative rendering with <strong>True 1:1 Physical Metric</strong> and <strong>Proportional</strong> scaling modes, procedural convective granulation shaders, and Solar System orbital engulfment overlays (Mercury to Neptune).
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-5 rounded-2xl observatory-panel border border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 text-blue-400 border border-white/10 shrink-0">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Interactive Hertzsprung–Russell Diagram</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Logarithmic phase-space mapping effective temperature (T_eff in K) against bolometric luminosity (L/L☉) and absolute magnitude (M_v), complete with Yerkes luminosity classes and dynamic isoradius contours (10⁻⁴ R☉ to 10⁴ R☉).
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-5 rounded-2xl observatory-panel border border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 text-indigo-400 border border-white/10 shrink-0">
                <Grid className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">{STARS_CATALOG.length}-Star Multi-Wavelength Catalog</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Curated database with multi-parametric real-time filtering (spectral types O–Y, stages, diameter, temperature, distance, m_v ≤ 6.5 naked-eye threshold), and cross-indexing with Bayer, Flamsteed, HD, SAO, GJ, HR, and Gaia DR3.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-5 rounded-2xl observatory-panel border border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 text-purple-400 border border-white/10 shrink-0">
                <Orbit className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">{MULTIPLE_STAR_SYSTEMS.length} Multiple Star Systems &amp; 3D Orbits</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Visual, spectroscopic, eclipsing, and contact binaries through hierarchical multiples with live Keplerian telemetry: true anomaly, eccentric anomaly, periastron/apastron distances, and barycentric center-of-mass simulations.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-5 rounded-2xl observatory-panel border border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 text-sky-400 border border-white/10 shrink-0">
                <Telescope className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">88 IAU Constellations Sky Atlas</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Spherical celestial projection featuring equatorial coordinate grids (RA/Dec), the celestial equator, ecliptic plane, Eugène Delporte (1930) official boundary polygons, asterism lines, and full deep sky object (DSO) inventories.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-5 rounded-2xl observatory-panel border border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 text-teal-400 border border-white/10 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Stellar Classification &amp; Taxonomy</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standalone guide to Morgan–Keenan spectral types (O–Y, WR, WD, NS), Yerkes luminosity classes (0 to VII), exotic Carbon and S-type stars, with dedicated 3D specimen directory modals.
            </p>
          </div>

          {/* Feature 7 */}
          <div className="p-5 rounded-2xl observatory-panel border border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 text-indigo-400 border border-white/10 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Stellar Nomenclature Guide</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Comprehensive reference on canonical IAU proper names, Bayer Greek notations, Flamsteed numbering, variable star designations (Argelander, double-letter, V-numbers), and cross-catalog identifiers.
            </p>
          </div>

          {/* Feature 8 */}
          <div className="p-5 rounded-2xl observatory-panel border border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 text-amber-400 border border-white/10 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Thermonuclear Engine Visualizer</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Interactive quantum-tunneling reaction visualizer modeling Proton–Proton chains (p-p I, II, III), the catalytic CNO cycle, the triple-alpha Hoyle resonance, and advanced shell burning up to the ⁵⁶Fe / ⁵⁶Ni iron peak.
            </p>
          </div>

          {/* Feature 9 */}
          <div className="p-5 rounded-2xl observatory-panel border border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 text-emerald-400 border border-white/10 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Stellar Interior Architecture</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cutaway cross-sections demonstrating mass-dependent energy transport regimes: fully convective low-mass red dwarfs (M &lt; 0.35 M☉), radiative core + convective envelope (0.35 – 1.3 M☉), and convective core + radiative envelope (M &gt; 1.3 M☉).
            </p>
          </div>

          {/* Feature 10 */}
          <div className="p-5 rounded-2xl observatory-panel border border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 text-rose-400 border border-white/10 shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Evolutionary Pathways &amp; Remnants</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Synchronized evolutionary lifecycle engines and degenerate matter models: electron degeneracy and Chandrasekhar limit (1.44 M☉), neutron degeneracy and TOV limit (2.1 – 2.3 M☉), pulsars, magnetars, and black hole event horizons.
            </p>
          </div>

          {/* Feature 11 */}
          <div className="p-5 rounded-2xl observatory-panel border border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 text-fuchsia-400 border border-white/10 shrink-0">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Procedural Web Audio Engine</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unified audio popover menu controlling native Web Audio API synthesis: low-frequency cosmic drone soundscapes, pulsar radio pulse sonification, and procedural UI SFX without heavy asset downloads.
            </p>
          </div>

          {/* Feature 12 */}
          <div className="p-5 rounded-2xl observatory-panel border border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 text-orange-400 border border-white/10 shrink-0">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Stellar Suika: Cosmic Merge Game</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Physics-based gravity drop game where colliding two identical stars merges them into the next bigger star in the sequence (from Proxima Centauri up to Stephenson 2-18, triggering an explosive supernova).
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ASTROPHYSICS RIGOR & DATA SOURCES
          ========================================================================= */}
      <section 
        className="p-6 md:p-8 rounded-3xl observatory-panel border border-white/10 flex flex-col gap-4 shadow-xl"
        aria-labelledby="data-sources-heading"
      >
        <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-wider font-bold">
          <Database className="w-4 h-4" /> Empirical Validation
        </div>
        <h2 id="data-sources-heading" className="text-lg sm:text-xl font-bold text-white font-sans">
          Astrophysics Rigor &amp; Primary Catalogs
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Physical values (diameters in kilometers, solar units D☉, effective surface temperatures T_eff in Kelvin, luminosities L☉, masses M☉, surface gravity log g, and trigonometric distances in light-years and parsecs) are compiled and cross-validated from:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex flex-col gap-1">
            <span className="text-sky-400 font-bold">ESA Gaia DR3</span>
            <span className="text-[11px] text-slate-400">High-precision 5-parameter astrometry, parallax (p), and broadband photometry (G, G_BP, G_RP).</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex flex-col gap-1">
            <span className="text-sky-400 font-bold">CDS SIMBAD</span>
            <span className="text-[11px] text-slate-400">Strasbourg astronomical database for MK spectral classifications, radial velocities, and rotational velocities.</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex flex-col gap-1">
            <span className="text-sky-400 font-bold">NASA Exoplanet Archive</span>
            <span className="text-[11px] text-slate-400">Confirmed exoplanet semi-major axes, discovery methods, orbital periods, and Kopparapu habitable zone boundaries.</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex flex-col gap-1">
            <span className="text-sky-400 font-bold">IAU WGSN</span>
            <span className="text-[11px] text-slate-400">Division C Working Group on Star Names: canonical nomenclature and official constellation borders (Delporte 1930).</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex flex-col gap-1">
            <a 
              href="https://github.com/ofrohn/d3-celestial" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sky-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              D3 Celestial Starmap <ExternalLink className="w-3 h-3 inline" />
            </a>
            <span className="text-[11px] text-slate-400">Olaf Frohn's D3-Celestial starmap library supplying vector geometry for constellation lines, asterisms, and Delporte boundary coordinates.</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FORMAL ACADEMIC REFERENCES & CITATIONS
          ========================================================================= */}
      <section 
        className="p-6 md:p-8 rounded-3xl observatory-panel border border-white/10 flex flex-col gap-4 shadow-xl"
        aria-labelledby="citations-heading"
      >
        <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-wider font-bold">
          <GraduationCap className="w-4 h-4" /> Academic Literature
        </div>
        <h2 id="citations-heading" className="text-lg sm:text-xl font-bold text-white font-sans">
          Scientific References &amp; Theoretical Models
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono text-slate-300">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
            <span className="text-sky-300 font-bold">Gaia Collaboration et al. (2023)</span>
            <span className="text-slate-400">Gaia Data Release 3: Summary of content and survey properties. <em>Astronomy &amp; Astrophysics</em>, 674, A1.</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
            <span className="text-sky-300 font-bold">Kopparapu, R. K., et al. (2013, 2014)</span>
            <span className="text-slate-400">Habitable Zones around Main-Sequence Stars: New Estimates. <em>The Astrophysical Journal</em>, 765(2), 131; 787(2), L29.</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
            <span className="text-sky-300 font-bold">Chandrasekhar, S. (1931)</span>
            <span className="text-slate-400">The Maximum Mass of Ideal White Dwarfs. <em>The Astrophysical Journal</em>, 74, 81.</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
            <span className="text-sky-300 font-bold">Oppenheimer, J. R., &amp; Volkoff, G. M. (1939)</span>
            <span className="text-slate-400">On Massive Neutron Cores. <em>Physical Review</em>, 55(4), 374.</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
            <span className="text-sky-300 font-bold">Delporte, E. (1930)</span>
            <span className="text-slate-400">Délimitation scientifique des constellations. <em>International Astronomical Union</em>, Cambridge University Press.</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
            <a 
              href="https://github.com/ofrohn/d3-celestial" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sky-300 font-bold hover:underline inline-flex items-center gap-1"
            >
              Frohn, O. (D3-Celestial) <ExternalLink className="w-3 h-3 inline" />
            </a>
            <span className="text-slate-400">D3.js-based celestial starmap and spherical coordinate datasets for constellation shapes, stick figures, and IAU boundaries (https://github.com/ofrohn/d3-celestial).</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1 md:col-span-2">
            <span className="text-sky-300 font-bold">Carroll, B. W., &amp; Ostlie, D. A. (2017)</span>
            <span className="text-slate-400"><em>An Introduction to Modern Astrophysics</em> (2nd ed.). Cambridge University Press.</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          OPEN SOURCE TECHNOLOGY STACK
          ========================================================================= */}
      <section 
        className="p-6 md:p-8 rounded-3xl observatory-panel border border-white/10 flex flex-col gap-4 shadow-xl"
        aria-labelledby="tech-stack-heading"
      >
        <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-wider font-bold">
          <Cpu className="w-4 h-4" /> Engineering Core
        </div>
        <h2 id="tech-stack-heading" className="text-lg sm:text-xl font-bold text-white font-sans">
          Open-Source Technologies &amp; Tooling
        </h2>

        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200">React 19.0</span>
          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200">Three.js r185</span>
          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200">TypeScript 5.8</span>
          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200">Tailwind CSS v4</span>
          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200">Vite 6.2</span>
          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200">Web Audio API</span>
          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200">Lucide Icons</span>
          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200">MIT Open Source</span>
          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200">PWA Service Workers</span>
        </div>
      </section>

      {/* =========================================================================
          QUICK LAUNCHPAD BUTTONS
          ========================================================================= */}
      <section 
        className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl observatory-panel border border-white/10"
        aria-label="Navigation Shortcuts"
      >
        <div className="flex flex-col gap-0.5">
          <div className="text-sm font-bold text-white font-sans">Ready to explore the cosmos?</div>
          <div className="text-xs text-slate-400">Launch directly into the interactive stages or browse catalogs.</div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => onNavigateTab('3d-stage')}
            className="flex-1 sm:flex-none min-h-[44px] px-5 py-2.5 rounded-xl bg-sky-400 text-slate-950 font-bold text-xs hover:bg-sky-300 cursor-pointer flex items-center justify-center transition-all"
          >
            <span>Launch 3D Stage</span>
          </button>
          <button
            onClick={() => onNavigateTab('catalog')}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl observatory-control border border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-200 font-semibold text-xs cursor-pointer flex items-center justify-center transition-all"
          >
            <span>Browse Catalog ({STARS_CATALOG.length})</span>
          </button>
          <button
            onClick={() => onNavigateTab('systems')}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl observatory-control border border-white/10 hover:border-white/20 hover:bg-white/10 text-purple-300 font-semibold text-xs cursor-pointer flex items-center justify-center transition-all"
          >
            <span>Star Systems ({MULTIPLE_STAR_SYSTEMS.length})</span>
          </button>
          <button
            onClick={() => onNavigateTab('hr-diagram')}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl observatory-control border border-white/10 hover:border-white/20 hover:bg-white/10 text-sky-300 font-semibold text-xs cursor-pointer flex items-center justify-center transition-all"
          >
            <span>H-R Diagram</span>
          </button>
          <button
            onClick={() => onNavigateTab('constellations')}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl observatory-control border border-white/10 hover:border-white/20 hover:bg-white/10 text-sky-300 font-semibold text-xs cursor-pointer flex items-center justify-center transition-all"
          >
            <span>88 Constellations</span>
          </button>
          <button
            onClick={() => onNavigateTab('classification')}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl observatory-control border border-white/10 hover:border-white/20 hover:bg-white/10 text-teal-300 font-semibold text-xs cursor-pointer flex items-center justify-center transition-all"
          >
            <span>Classification</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          ACCESSIBILITY & CREDITS FOOTER
          ========================================================================= */}
      <footer className="text-center text-xs text-slate-400 font-mono py-2 flex flex-col items-center gap-2 border-t border-white/5 pt-6">
        <div className="flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <span>Engineered with accessible WCAG AA contrast standards, keyboard focus rings, and semantic landmarks.</span>
        </div>
        <p className="text-slate-400">
          Created &amp; maintained by <strong className="text-sky-300">B123 Entertainment</strong> • Copyright © 2026 • Distributed under the <strong className="text-slate-300">MIT License</strong>.
        </p>
        <p className="text-[11px] text-slate-400">
          Dedicated to amateur and professional astronomers, students, physics enthusiasts, and stargazers worldwide.
        </p>
      </footer>
    </article>
  );
};
