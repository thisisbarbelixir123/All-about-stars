import React from 'react';
import {
  Compass,
  BarChart2,
  Grid,
  BookOpen
} from 'lucide-react';

interface AboutPageProps {
  onNavigateTab: (tab: 'home' | '3d-stage' | 'catalog' | 'hr-diagram' | 'guide') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateTab }) => {
  return (
    <article 
      className="max-w-5xl mx-auto flex flex-col gap-10 animate-in fade-in duration-200"
      aria-label="About Project"
    >
      {/* Header Banner */}
      <section 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1128] via-[#070d1e] to-[#040814] border border-cyan-500/25 p-6 md:p-10 shadow-[0_0_50px_rgba(6,182,212,0.12)]"
        aria-labelledby="about-title"
      >
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Project Origin & Creator
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white/5 text-slate-300 border border-white/10">
                v2.4 (2026)
              </span>
            </div>

            <h1 
              id="about-title" 
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-['Orbitron',sans-serif]"
            >
              ABOUT <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">PROJECT</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              An interactive 3D cosmic star comparator, astrophysical catalog, Hertzsprung–Russell diagram, and cosmic scale explorer spanning from relativistic neutron stars to colossal red hypergiants.
            </p>
          </div>

          {/* Author & Copyright Card */}
          <div className="flex-shrink-0 w-full md:w-auto p-5 rounded-2xl bg-[#091024]/90 border border-cyan-500/30 shadow-xl flex flex-col gap-2.5">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Creator & Studio</div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              <span>B123 Entertainment</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Copyright © 2026 B123 Entertainment. All rights reserved.
            </div>
            <a
              id="about-kofi-link"
              href="https://ko-fi.com/b123entertainment"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 px-4 py-2.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 hover:border-amber-400 text-amber-300 font-medium text-xs flex items-center justify-center transition-all shadow-sm hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]"
            >
              <span>Buy me a coffee</span>
            </a>
          </div>
        </div>
      </section>

      {/* Inspirations Section */}
      <section 
        className="flex flex-col gap-5"
        aria-labelledby="inspirations-heading"
      >
        <div>
          <h2 id="inspirations-heading" className="text-xl sm:text-2xl font-bold text-white font-['Orbitron',sans-serif]">
            Inspirations Behind The Project
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Inspiration 1: Universe Sandbox */}
          <div className="p-6 rounded-2xl bg-[#070c1d]/90 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between gap-4 group hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]">
            <div className="flex flex-col gap-3">
              {/* Universe Sandbox Logo / Header Image */}
              <div className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-black/40 group-hover:border-indigo-500/60 transition-all shadow-md">
                <img
                  src="/universe_sandbox_header.jpg"
                  alt="Universe Sandbox Logo and Simulation Visual"
                  className="w-full h-28 sm:h-32 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to official Steam CDN if local asset is unavailable
                    (e.currentTarget as HTMLImageElement).src = "https://cdn.akamai.steamstatic.com/steam/apps/230290/header.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070c1d] via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>

              <div className="mt-1">
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Universe Sandbox (Game)
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The physics-based space simulator created by Giant Army. Its real-time thermodynamic modeling, stellar luminosity equations, and the awe of colliding and comparing astronomical titans directly inspired this app’s 3D interactive physics and coronal rendering.
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-indigo-300 font-mono">
              <a
                href="https://store.steampowered.com/app/230290/Universe_Sandbox/"
                target="_blank"
                rel="noreferrer noopener"
                className="hover:underline text-indigo-400 hover:text-indigo-300 focus-visible:ring-1 focus-visible:ring-indigo-300 rounded font-semibold"
                aria-label="Universe Sandbox on Steam"
              >
                Steam Store
              </a>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60">Astrophysics</span>
            </div>
          </div>

          {/* Inspiration 2: Scale of the Universe */}
          <div className="p-6 rounded-2xl bg-[#070c1d]/90 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between gap-4 group hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]">
            <div className="flex flex-col gap-3">
              {/* Scale of the Universe Screenshot */}
              <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-black/40 group-hover:border-cyan-500/60 transition-all shadow-md">
                <img
                  src="/scale_of_universe_screenshot.svg"
                  alt="Scale of the Universe 2 Screenshot at 10^12 meters showing Pistol Star, La Superba, Deneb, and R Doradus"
                  className="w-full h-28 sm:h-32 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070c1d] via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>

              <div className="mt-1">
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Scale of the Universe 2
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The groundbreaking interactive scale tool by Cary & Michael Huang (htwins.net). The effortless logarithmic zoom across orders of magnitude—from subatomic particles to cosmic superclusters—served as an enduring inspiration for our interactive astrophysics visualizers.
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-cyan-300 font-mono">
              <a 
                href="https://htwins.net/scale2" 
                target="_blank" 
                rel="noreferrer noopener"
                className="hover:underline text-cyan-400 hover:text-cyan-300 focus-visible:ring-1 focus-visible:ring-cyan-300 rounded font-semibold"
                aria-label="Scale of the Universe 2 on htwins.net/scale2"
              >
                htwins.net/scale2
              </a>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">Scale Explorer</span>
            </div>
          </div>

          {/* Inspiration 3: Comparison YouTube Videos */}
          <div className="p-6 rounded-2xl bg-[#070c1d]/90 border border-red-500/25 hover:border-red-500/50 transition-all duration-300 flex flex-col justify-between gap-4 group hover:shadow-[0_0_25px_rgba(239,68,68,0.15)]">
            <div className="flex flex-col gap-3">
              {/* Creator YouTube Channel Video Thumbnail */}
              <div className="relative overflow-hidden rounded-xl border border-red-500/30 bg-black/40 group-hover:border-red-500/60 transition-all shadow-md">
                <img
                  src="/creator_youtube_thumbnail.svg"
                  alt="The Size of the Universe 6 'The Ultimate' - YouTube Video Thumbnail by comparisonfarts"
                  className="w-full h-28 sm:h-32 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070c1d] via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>

              <div className="mt-1">
                <h3 className="text-lg font-bold text-white group-hover:text-red-300 transition-colors">
                  Creator's YouTube Channel
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The astronomical comparison videos created on the author's YouTube channel (<strong className="text-red-300 font-mono">youtube.com/comparisonfarts</strong>), such as <em>The Size of the Universe 6: “The Ultimate”</em>. Translating viral comparison videos into a tactile, interactive web application where users can spin, zoom, and inspect stars at will.
              </p>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <a 
                href="https://youtube.com/comparisonfarts" 
                target="_blank" 
                rel="noreferrer noopener"
                className="text-red-400 hover:text-red-300 font-bold hover:underline focus-visible:ring-1 focus-visible:ring-red-400 rounded"
                aria-label="Visit Comparison Videos YouTube Channel at youtube.com/comparisonfarts"
              >
                comparisonfarts
              </a>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/80 border border-red-800/60 text-red-300">Creator Channel</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features & Highlights ("More...") */}
      <section 
        className="flex flex-col gap-5"
        aria-labelledby="features-heading"
      >
        <div>
          <h2 id="features-heading" className="text-xl sm:text-2xl font-bold text-white font-['Orbitron',sans-serif]">
            What You Can Explore Here
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#080d22]/80 border border-cyan-500/15 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">3D Real-Scale Star Comparator</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Render multiple stars side-by-side on an interactive WebGL canvas. Switch between <strong>True Linear (1:1 actual physical size)</strong> and <strong>Proportional</strong> scaling modes, rotate in full 3D, and toggle atmospheric plasma corona layers.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#080d22]/80 border border-cyan-500/15 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Interactive Hertzsprung–Russell Diagram</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Visualize all stars plotted across stellar luminosity versus effective surface temperature, mapping the Main Sequence, Giants (II & III) track, Supergiants, and White Dwarfs.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#080d22]/80 border border-cyan-500/15 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Curated Multi-Wavelength Star Catalog</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Explore an extensive catalog of 200+ stellar bodies, complete with multi-dimensional filtering by spectral class, stellar evolutionary stage, physical diameter, surface temperature, and constellation.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#080d22]/80 border border-cyan-500/15 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Morgan–Keenan Stellar Guide & Exoplanets</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Dive into spectral classes O, B, A, F, G, K, M, L, T, Y, Wolf-Rayet, and compact remnants, complete with exoplanet architectures, habitable zone bounds, and future supernovae fates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Accuracy & Data Sources */}
      <section 
        className="p-6 md:p-8 rounded-3xl bg-[#060a19]/90 border border-cyan-500/20 flex flex-col gap-4"
        aria-labelledby="data-sources-heading"
      >
        <div>
          <h2 id="data-sources-heading" className="text-lg sm:text-xl font-bold text-white font-['Orbitron',sans-serif]">
            Astrophysics Rigor & Data Sources
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Physical values (diameters in kilometers, solar units $D_\odot$, effective surface temperatures in Kelvin, luminosities $L_\odot$, masses $M_\odot$, and distances in light-years) are compiled from:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-slate-300 flex flex-col gap-1">
            <span className="text-cyan-400 font-bold">NASA Exoplanet</span>
            <span className="text-[11px] text-slate-400">Archive & Habitable Zone Catalog</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-slate-300 flex flex-col gap-1">
            <span className="text-cyan-400 font-bold">ESA Gaia DR3</span>
            <span className="text-[11px] text-slate-400">High-precision astrometry & distances</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-slate-300 flex flex-col gap-1">
            <span className="text-cyan-400 font-bold">SIMBAD Database</span>
            <span className="text-[11px] text-slate-400">CDS Strasbourg Astronomical Data</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-slate-300 flex flex-col gap-1">
            <span className="text-cyan-400 font-bold">ESO & HST</span>
            <span className="text-[11px] text-slate-400">Hubble & VLT Spectroscopic Surveys</span>
          </div>
        </div>
      </section>

      {/* Quick Launchpad Buttons */}
      <section 
        className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#091129] via-[#070e20] to-[#0a122c] border border-cyan-500/30"
        aria-label="Navigation Shortcuts"
      >
        <div>
          <div className="text-sm font-bold text-white">Ready to explore the cosmos?</div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => onNavigateTab('3d-stage')}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:brightness-110 cursor-pointer flex items-center justify-center transition-all"
          >
            <span>Launch 3D Stage</span>
          </button>
          <button
            onClick={() => onNavigateTab('catalog')}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/15 cursor-pointer flex items-center justify-center transition-all"
          >
            <span>Browse Catalog</span>
          </button>
        </div>
      </section>

      {/* Accessibility & Credits Footer */}
      <section className="text-center text-xs text-slate-400 font-mono py-2 flex flex-col items-center gap-2">
        <p>Designed with accessible WCAG AA contrast, keyboard navigation, and semantic landmarks.</p>
        <p className="text-slate-400">
          Created by <strong className="text-cyan-300">B123 Entertainment</strong> • Copyright © 2026 • Inspired by Universe Sandbox, Scale of the Universe, and YouTube: comparisonfarts
        </p>
      </section>
    </article>
  );
};
