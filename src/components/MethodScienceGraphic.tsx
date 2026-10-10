import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Eye,
  Activity,
  Sliders,
  Layers,
  Info,
  Maximize2,
  ChevronDown
} from 'lucide-react';

interface MethodScienceGraphicProps {
  methodId: string;
  methodName: string;
  accentColor?: string;
}

export const MethodScienceGraphic: React.FC<MethodScienceGraphicProps> = ({
  methodId,
  methodName,
  accentColor = '#38bdf8',
}) => {
  // Mobile collapsed by default, expanded on tablets and desktops
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(false);

  // Shared animation state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [animProgress, setAnimProgress] = useState<number>(0); // 0 to 1

  // Specific state for Parallax
  const [parallaxSeason, setParallaxSeason] = useState<'january' | 'july' | 'animate'>('animate');

  // Specific state for Infrared & Adaptive Optics
  const [infraredMode, setInfraredMode] = useState<'optical' | 'infrared' | 'laser-ao'>('laser-ao');

  // Specific state for Spectroscopy Doppler
  const [dopplerPhase, setDopplerPhase] = useState<number>(0); // 0 to 360 deg

  // Animation frame loop
  useEffect(() => {
    let reqId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isPlaying) {
        setAnimProgress((prev) => (prev + delta * 0.25) % 1);
        setDopplerPhase((prev) => (prev + delta * 90) % 360);
      }
      reqId = requestAnimationFrame(loop);
    };

    reqId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(reqId);
  }, [isPlaying]);

  return (
    <div className="rounded-2xl bg-[#020514] border border-cyan-500/35 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.6)] flex flex-col">
      {/* Header Bar */}
      <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#030922] border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full animate-ping shrink-0" style={{ backgroundColor: accentColor }} />
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
            Interactive Scientific Demonstration
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-900 border border-cyan-500/30 text-[10px] font-mono text-cyan-400 font-semibold truncate max-w-[210px]">
            {methodName.split('&')[0].trim()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Collapse Toggle Button (visible on mobile only, hidden on md: tablets and desktops) */}
          <button
            type="button"
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold transition-all cursor-pointer active:scale-95"
            aria-expanded={isMobileExpanded}
          >
            <span>{isMobileExpanded ? 'Hide Graphic' : 'Show Graphic'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMobileExpanded ? 'rotate-180' : ''}`} />
          </button>

          {/* Play / Pause / Reset Controls (Visible when expanded on mobile, and always visible on tablet/desktop) */}
          <div className={`${isMobileExpanded ? 'flex' : 'hidden'} md:flex items-center gap-1.5`}>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-semibold transition-all cursor-pointer active:scale-95"
              title={isPlaying ? 'Pause simulation' : 'Play simulation'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Play</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setAnimProgress(0);
                setDopplerPhase(0);
              }}
              className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95"
              title="Reset simulation to initial position"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Teaser Prompt (Visible only on mobile when collapsed) */}
      {!isMobileExpanded && (
        <div className="md:hidden px-4 py-3 bg-[#020512] flex items-center justify-between text-xs font-mono text-slate-400 border-b border-cyan-500/10">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Interactive animated model</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileExpanded(true)}
            className="text-cyan-300 font-bold hover:text-white flex items-center gap-1"
          >
            <span>Tap to View</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Interactive Canvas Area (Collapsed by default on mobile, always expanded on md: and above) */}
      <div className={`${isMobileExpanded ? 'flex' : 'hidden'} md:flex p-3 sm:p-4 lg:p-4 flex-col gap-3.5`}>
        {/* 1. PARALLAX GRAPHIC */}
        {methodId === 'trigonometric-parallax' && (
          <ParallaxGraphic
            progress={animProgress}
            isPlaying={isPlaying}
            season={parallaxSeason}
            onSelectSeason={setParallaxSeason}
          />
        )}

        {/* 2. SPECTROSCOPY DOPPLER GRAPHIC */}
        {methodId === 'stellar-spectroscopy' && (
          <SpectroscopyGraphic
            phase={dopplerPhase}
            isPlaying={isPlaying}
            onSetPhase={setDopplerPhase}
          />
        )}

        {/* 3. TRANSIT PHOTOMETRY GRAPHIC */}
        {methodId === 'transit-photometry' && (
          <TransitPhotometryGraphic
            progress={animProgress}
            isPlaying={isPlaying}
            onSetProgress={setAnimProgress}
          />
        )}

        {/* 4. GRAVITATIONAL LENSING & MICROLENSING GRAPHIC */}
        {(methodId === 'gravitational-lensing' || methodId === 'gravitational-microlensing') && (
          <MicrolensingGraphic
            progress={animProgress}
            isPlaying={isPlaying}
            onSetProgress={setAnimProgress}
          />
        )}

        {/* 5. RADIO PULSAR TIMING & INTERFEROMETRY GRAPHIC */}
        {(methodId === 'radio-interferometry' || methodId === 'radio-pulsar-timing') && (
          <PulsarTimingGraphic
            progress={animProgress}
            isPlaying={isPlaying}
          />
        )}

        {/* 6. INFRARED PENETRATION & ADAPTIVE OPTICS GRAPHIC */}
        {(methodId === 'infrared-adaptive-optics' || methodId === 'direct-coronagraphic-imaging') && (
          <InfraredAOGraphic
            mode={infraredMode}
            onChangeMode={setInfraredMode}
          />
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 1. PARALLAX VISUALIZER SUB-COMPONENT                                       */
/* -------------------------------------------------------------------------- */
const ParallaxGraphic: React.FC<{
  progress: number;
  isPlaying: boolean;
  season: 'january' | 'july' | 'animate';
  onSelectSeason: (s: 'january' | 'july' | 'animate') => void;
}> = ({ progress, isPlaying, season, onSelectSeason }) => {
  // If static season selected, compute fixed angle
  const angle = season === 'january' ? 0 : season === 'july' ? Math.PI : progress * Math.PI * 2;
  const earthX = 150 + Math.cos(angle) * 85;
  const earthY = 145 + Math.sin(angle) * 20; // elliptical orbit projection

  // Target star coordinates (nearby star, e.g. 61 Cygni)
  const starX = 150;
  const starY = 80;

  // Project sightline from Earth through Target Star onto the distant background sky plane (Y = 20)
  const slope = (starY - earthY) / (starX - earthX || 0.0001);
  const backgroundY = 20;
  const backgroundX = earthX + (backgroundY - earthY) / slope;

  // Parallax angle in arcsec (conceptually illustrated)
  const parallaxArcsec = (Math.abs(Math.cos(angle)) * 0.772).toFixed(3);
  const distanceLy = (3.26 / 0.772).toFixed(2); // ~11.4 light years for 61 Cygni

  // Apparent shift offset for the right-hand telescopic sky sensor
  const apparentOffsetPx = Math.cos(angle) * 28;

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="text-slate-300">
          <strong className="text-white">Earth’s 300-Million-km Orbit (2 AU)</strong> provides the geometric triangulation baseline.
        </span>
        {/* Season Selector */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/60 border border-cyan-500/30 text-[10px] font-mono">
          <button
            onClick={() => onSelectSeason('animate')}
            className={`px-2 py-0.5 rounded ${season === 'animate' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Orbit Animation
          </button>
          <button
            onClick={() => onSelectSeason('january')}
            className={`px-2 py-0.5 rounded ${season === 'january' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            January (Baseline Left)
          </button>
          <button
            onClick={() => onSelectSeason('july')}
            className={`px-2 py-0.5 rounded ${season === 'july' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            July (Baseline Right)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3 items-center">
        {/* Left: Triangulation Geometry Diagram */}
        <div className="md:col-span-7 relative aspect-[16/10] md:h-[200px] lg:h-[215px] xl:h-[225px] lg:aspect-auto rounded-xl bg-[#010410] border border-cyan-500/20 overflow-hidden shadow-inner flex items-center justify-center">
          <svg viewBox="0 0 300 170" className="w-full h-full select-none">
            <defs>
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Distant Background Plane */}
            <line x1="20" y1="20" x2="280" y2="20" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
            <text x="25" y="14" fill="#64748b" fontSize="8" fontFamily="monospace">
              DISTANT FIXED STARS
            </text>

            {/* Earth Orbit Ellipse */}
            <ellipse cx="150" cy="145" rx="85" ry="18" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />

            {/* Sun at Center */}
            <circle cx="150" cy="145" r="10" fill="url(#sunGlow)" />
            <circle cx="150" cy="145" r="4.5" fill="#fef08a" />
            <text x="142" y="138" fill="#fde047" fontSize="7" fontFamily="monospace" fontWeight="bold">Sun</text>

            {/* Earth Orbiting */}
            <circle cx={earthX} cy={earthY} r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
            <text x={earthX + 6} y={earthY + 3} fill="#e2e8f0" fontSize="7" fontFamily="monospace">Earth</text>

            {/* Nearby Target Star */}
            <circle cx={starX} cy={starY} r="9" fill="url(#starGlow)" />
            <circle cx={starX} cy={starY} r="3" fill="#ffffff" />
            <text x={starX + 8} y={starY - 2} fill="#7dd3fc" fontSize="8" fontFamily="monospace" fontWeight="bold">61 Cygni</text>

            {/* Triangulation Sightlines */}
            <line x1={earthX} y1={earthY} x2={starX} y2={starY} stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3,2" />
            <line
              x1={starX}
              y1={starY}
              x2={Math.max(25, Math.min(275, backgroundX))}
              y2={backgroundY}
              stroke="#f43f5e"
              strokeWidth="1.2"
            />

            {/* Apparent position marker on background */}
            <circle cx={Math.max(25, Math.min(275, backgroundX))} cy={20} r="3.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
          </svg>
        </div>

        {/* Right: Telescopic Sensor Shift & Astrometric Solution */}
        <div className="md:col-span-5 p-3 md:h-[200px] lg:h-[215px] xl:h-[225px] flex flex-col justify-between rounded-xl bg-slate-950/80 border border-cyan-500/25 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-300 font-bold uppercase tracking-wide">Telescope Sky Plane View:</span>
            <span className="text-amber-300 font-bold">p = {parallaxArcsec}"</span>
          </div>

          {/* Mini Sky Sensor view */}
          <div className="relative h-18 sm:h-20 lg:h-22 w-full rounded-lg bg-[#010410] border border-slate-800 overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 200 60" className="w-full h-full select-none absolute inset-0">
              {/* Crosshair grid */}
              <line x1="0" y1="30" x2="200" y2="30" stroke="#1e293b" strokeWidth="0.8" />
              <line x1="100" y1="0" x2="100" y2="60" stroke="#1e293b" strokeWidth="0.8" />

              {/* Background reference stars */}
              <circle cx="40" cy="20" r="1.5" fill="#64748b" />
              <circle cx="70" cy="42" r="1.5" fill="#64748b" />
              <circle cx="140" cy="16" r="1.5" fill="#64748b" />
              <circle cx="165" cy="45" r="1.5" fill="#64748b" />

              {/* Shifting Target Star */}
              <circle
                cx={100 + Math.cos(angle) * 22}
                cy={30}
                r={4}
                fill="#38bdf8"
                stroke="#ffffff"
                strokeWidth="1.2"
              />
            </svg>

            {/* Shift label */}
            <div className="absolute bottom-1 right-2 text-[8px] font-mono text-cyan-400/80">
              Apparent Shift: ±{(Math.abs(Math.cos(angle)) * 0.77).toFixed(2)}"
            </div>
          </div>

          {/* Mathematical Solution Callout */}
          <div className="px-2 py-1 rounded bg-[#030718] border border-cyan-500/30 flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-300 font-bold">d = 1 / p</span>
            <span className="text-cyan-300 font-semibold">{distanceLy} light-years (3.50 pc)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. SPECTROSCOPY & DOPPLER SHIFT SUB-COMPONENT                             */
/* -------------------------------------------------------------------------- */
const SpectroscopyGraphic: React.FC<{
  phase: number;
  isPlaying: boolean;
  onSetPhase: (p: number) => void;
}> = ({ phase, isPlaying, onSetPhase }) => {
  // Star orbiting barycenter
  const rad = (phase * Math.PI) / 180;
  const starRadius = 25;
  const starX = 140 + Math.cos(rad) * starRadius;
  const starY = 90 + Math.sin(rad) * 8; // edge-on orbit

  // Planet orbiting on opposite side
  const planetX = 140 - Math.cos(rad) * (starRadius * 2.8);
  const planetY = 90 - Math.sin(rad) * 22;

  // Line-of-sight velocity toward observer (Observer is at bottom/right looking left)
  // Radial velocity: positive = moving away (redshift), negative = moving toward (blueshift)
  const vRadial = -Math.sin(rad); // normalized -1 to +1
  const lineShiftPx = vRadial * 28; // pixel shift on spectrum

  const isBlueshift = vRadial < -0.15;
  const isRedshift = vRadial > 0.15;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="text-slate-300">
          <strong className="text-white">Doppler Spectroscopy:</strong> Star wobbles around center-of-mass, shifting spectral absorption lines.
        </span>
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
            isBlueshift
              ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
              : isRedshift
              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
              : 'bg-slate-900 text-slate-300 border border-slate-700'
          }`}
        >
          {isBlueshift ? '◀ Blueshift (Toward Earth)' : isRedshift ? 'Redshift (Away from Earth) ▶' : 'Rest Frequency (Equilibrium)'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3 items-center">
        {/* Left: Star & Planet Orbiting */}
        <div className="md:col-span-6 relative aspect-[16/10] md:h-[200px] lg:h-[215px] xl:h-[225px] lg:aspect-auto rounded-xl bg-[#010410] border border-cyan-500/20 overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 280 180" className="w-full h-full select-none">
            {/* Center of Mass (Barycenter) */}
            <circle cx="140" cy="90" r="2.5" fill="#e2e8f0" />
            <ellipse cx="140" cy="90" rx={starRadius} ry="9" fill="none" stroke="#334155" strokeDasharray="2,2" />
            <ellipse cx="140" cy="90" rx={starRadius * 2.8} ry="25" fill="none" stroke="#1e293b" strokeDasharray="3,3" />

            {/* Telescope line of sight arrow */}
            <line x1="260" y1="90" x2="200" y2="90" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="215" y="80" fill="#38bdf8" fontSize="8" fontFamily="monospace">
              To Earth
            </text>

            {/* Orbiting Host Star */}
            <circle cx={starX} cy={starY} r="18" fill="#fbbf24" stroke="#fef08a" strokeWidth="1.5" />
            <text x={starX - 12} y={starY + 3} fill="#78350f" fontSize="8" fontFamily="monospace" fontWeight="bold">
              Star
            </text>

            {/* Velocity Vector Arrow on Star */}
            <line
              x1={starX}
              y1={starY}
              x2={starX + vRadial * 20}
              y2={starY}
              stroke={vRadial < 0 ? '#38bdf8' : '#f43f5e'}
              strokeWidth="2.5"
            />

            {/* Orbiting Exoplanet */}
            <circle cx={planetX} cy={planetY} r="6" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
            <text x={planetX - 16} y={planetY - 9} fill="#94a3b8" fontSize="7" fontFamily="monospace">
              Exoplanet
            </text>
          </svg>
        </div>

        {/* Right: Spectral Dispersion Rainbow with Absorption Lines */}
        <div className="md:col-span-6 p-3 md:h-[200px] lg:h-[215px] xl:h-[225px] flex flex-col justify-between rounded-xl bg-slate-950/80 border border-cyan-500/25 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-300 font-bold uppercase tracking-wide">Starlight Absorption Spectrum:</span>
            <span className="text-slate-400">400 nm → 700 nm</span>
          </div>

          {/* Reference Static Spectrum */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">Laboratory Reference (Rest):</span>
            <div
              className="h-7 w-full rounded relative overflow-hidden shadow-inner"
              style={{
                background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 25%, #10b981 50%, #eab308 75%, #ef4444 100%)',
              }}
            >
              {/* Reference absorption lines (Hydrogen Balmer lines) */}
              {[35, 75, 120, 185, 230].map((lx, idx) => (
                <div
                  key={idx}
                  className="absolute top-0 bottom-0 w-[2px] bg-black opacity-90"
                  style={{ left: `${(lx / 280) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Doppler Shifted Observed Spectrum */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-cyan-300 uppercase font-semibold">Observed Star Spectrum (Doppler Shifted):</span>
              <span className={vRadial < 0 ? 'text-blue-400 font-bold' : 'text-rose-400 font-bold'}>
                Δv = {(vRadial * 56.4).toFixed(1)} m/s
              </span>
            </div>
            <div
              className="h-8 sm:h-9 w-full rounded relative overflow-hidden shadow-md border border-white/20"
              style={{
                background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 25%, #10b981 50%, #eab308 75%, #ef4444 100%)',
              }}
            >
              {/* Doppler-shifted lines */}
              {[35, 75, 120, 185, 230].map((lx, idx) => (
                <div
                  key={idx}
                  className="absolute top-0 bottom-0 w-[3px] bg-black transition-all duration-75 shadow-[0_0_4px_rgba(0,0,0,0.8)]"
                  style={{
                    left: `calc(${(lx / 280) * 100}% + ${lineShiftPx}px)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Interactive Phase Slider */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Manual Orbital Phase:</span>
              <span className="text-white font-bold">{Math.round(phase)}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={phase}
              onChange={(e) => onSetPhase(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. TRANSIT PHOTOMETRY & LIGHT CURVE SUB-COMPONENT                          */
/* -------------------------------------------------------------------------- */
const TransitPhotometryGraphic: React.FC<{
  progress: number;
  isPlaying: boolean;
  onSetProgress: (p: number) => void;
}> = ({ progress, isPlaying, onSetProgress }) => {
  // Planet transit position: -50 to 250 across a 200px star system
  // progress 0 to 1 mapped to planet x from 20 to 380
  const planetX = 40 + progress * 320;
  const starCenterX = 200;
  const starRadius = 55;

  // Calculate transit depth
  const distFromCenter = Math.abs(planetX - starCenterX);
  const isInTransit = distFromCenter < starRadius;

  // Normalized flux: 1.0 outside transit, dips to 0.988 at center
  const flux = isInTransit
    ? 1.0 - (1 - distFromCenter / starRadius) * 0.015
    : 1.0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="text-slate-300">
          <strong className="text-white">Transit Photometry:</strong> Detecting tiny periodic dips in starlight as an exoplanet eclipses the star disk.
        </span>
        <span className="text-cyan-300 font-bold">
          Flux: {(flux * 100).toFixed(2)}% (Dip: {((1 - flux) * 100).toFixed(2)}%)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 items-center">
        {/* Top/Left: Star Disk and Transiting Planet */}
        <div className="relative aspect-[16/10] md:h-[200px] lg:h-[215px] xl:h-[225px] lg:aspect-auto rounded-xl bg-[#010410] border border-cyan-500/20 overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 400 200" className="w-full h-full select-none">
            <defs>
              <radialGradient id="transitStarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="60%" stopColor="#f59e0b" />
                <stop offset="90%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
              </radialGradient>
            </defs>

            {/* Star Disk with Limb Darkening */}
            <circle cx="200" cy="100" r={starRadius} fill="url(#transitStarGlow)" filter="drop-shadow(0 0 25px rgba(245,158,11,0.5))" />

            {/* Orbit Path Guide Line */}
            <line x1="30" y1="100" x2="370" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />

            {/* Planet Silhouette */}
            <circle cx={planetX} cy="100" r="10" fill="#020617" stroke="#475569" strokeWidth="1.5" />
            <text x={planetX - 18} y="80" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              Planet
            </text>
          </svg>
        </div>

        {/* Bottom/Right: Synchronized Light Curve Graph */}
        <div className="relative aspect-[16/10] md:h-[200px] lg:h-[215px] xl:h-[225px] lg:aspect-auto p-3 rounded-xl bg-slate-950/80 border border-cyan-500/25 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="font-bold">LIGHT CURVE (RELATIVE STELLAR BRIGHTNESS)</span>
            <span className="text-cyan-400 font-bold">ΔF = (R_p / R_*)²</span>
          </div>

          <svg viewBox="0 0 300 120" className="w-full h-24 sm:h-28 select-none">
            {/* Grid Lines */}
            <line x1="30" y1="20" x2="280" y2="20" stroke="#1e293b" strokeWidth="1" />
            <line x1="30" y1="70" x2="280" y2="70" stroke="#1e293b" strokeWidth="1" />
            <line x1="30" y1="100" x2="280" y2="100" stroke="#334155" strokeWidth="1" />

            {/* Axis Labels */}
            <text x="5" y="24" fill="#64748b" fontSize="8" fontFamily="monospace">1.00</text>
            <text x="5" y="74" fill="#64748b" fontSize="8" fontFamily="monospace">0.99</text>
            <text x="5" y="104" fill="#64748b" fontSize="8" fontFamily="monospace">0.98</text>

            {/* Theoretical U-shaped Transit Curve */}
            <path
              d="M 30 20 L 110 20 Q 125 20, 130 65 L 170 65 Q 175 20, 190 20 L 280 20"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
            />

            {/* Live Indicator Dot at current phase */}
            {(() => {
              const graphX = 30 + progress * 250;
              const graphY = isInTransit
                ? 20 + (1 - distFromCenter / starRadius) * 45
                : 20;
              return (
                <circle cx={graphX} cy={graphY} r="4" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
              );
            })()}
          </svg>

          {/* Interactive Scrub Slider */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-slate-400">Scrub:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.005"
              value={progress}
              onChange={(e) => onSetProgress(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. GRAVITATIONAL LENSING & MICROLENSING SUB-COMPONENT                      */
/* -------------------------------------------------------------------------- */
const MicrolensingGraphic: React.FC<{
  progress: number;
  isPlaying: boolean;
  onSetProgress: (p: number) => void;
}> = ({ progress, isPlaying, onSetProgress }) => {
  // Lens star moves horizontally across line of sight
  const lensX = 50 + progress * 300;
  const sourceStarX = 200;
  const sourceStarY = 80;

  // Impact parameter
  const separation = Math.abs(lensX - sourceStarX);
  const magnification = 1.0 + Math.max(0, 15 / (separation + 4));

  // Caustic spike if alignment hits critical caustic zone
  const planetOffset = 35;
  const planetSeparation = Math.abs(lensX + planetOffset - sourceStarX);
  const planetCaustic = Math.max(0, 12 / (planetSeparation + 2));
  const totalMag = magnification + planetCaustic;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="text-slate-300">
          <strong className="text-white">Gravitational Lensing &amp; Caustic Crossings:</strong> Spacetime curvature magnifies distant background stars (like Earendel) by thousands of times.
        </span>
        <span className="text-amber-400 font-bold">
          Magnification: {totalMag > 4 ? `${(totalMag * 220).toFixed(0)}× (Caustic Peak)` : `${(totalMag * 14).toFixed(1)}×`}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 items-center">
        {/* Alignment Geometry */}
        <div className="relative aspect-[16/10] md:h-[200px] lg:h-[215px] xl:h-[225px] lg:aspect-auto rounded-xl bg-[#010410] border border-cyan-500/20 overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 400 200" className="w-full h-full select-none">
            {/* Observer Earth */}
            <circle cx="200" cy="180" r="5" fill="#38bdf8" />
            <text x="210" y="184" fill="#38bdf8" fontSize="8" fontFamily="monospace">Earth Observer</text>

            {/* Distant Source Star */}
            <circle cx={sourceStarX} cy={sourceStarY} r={8} fill="#f8fafc" filter="drop-shadow(0 0 10px rgba(255,255,255,0.8))" />
            <text x={sourceStarX - 35} y={sourceStarY - 14} fill="#f8fafc" fontSize="8" fontFamily="monospace">
              Distant Source Star (Earendel, z=6.2)
            </text>

            {/* Moving Foreground Galaxy Cluster / Lens Mass */}
            <circle cx={lensX} cy="130" r="10" fill="#f59e0b" />
            <circle cx={lensX - planetOffset} cy="130" r="3.5" fill="#a78bfa" />
            <text x={lensX - 20} y="152" fill="#fbbf24" fontSize="8" fontFamily="monospace">
              Foreground Lens Mass &amp; Caustic
            </text>

            {/* Bent Light Rays */}
            <path
              d={`M ${sourceStarX} ${sourceStarY} Q ${lensX - 25} 130, 200 180`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeDasharray="3,2"
            />
            <path
              d={`M ${sourceStarX} ${sourceStarY} Q ${lensX + 25} 130, 200 180`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeDasharray="3,2"
            />
          </svg>
        </div>

        {/* Magnification Light Curve Spike */}
        <div className="relative aspect-[16/10] md:h-[200px] lg:h-[215px] xl:h-[225px] lg:aspect-auto p-3 rounded-xl bg-slate-950/80 border border-cyan-500/25 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="font-bold">GRAVITATIONAL LENSING LIGHT CURVE</span>
            <span className="text-amber-400 font-bold">Caustic Crossing Peak</span>
          </div>

          <svg viewBox="0 0 300 120" className="w-full h-24 sm:h-28 select-none">
            {/* Grid lines */}
            <line x1="30" y1="100" x2="280" y2="100" stroke="#334155" strokeWidth="1" />
            <line x1="30" y1="50" x2="280" y2="50" stroke="#1e293b" strokeWidth="1" />

            {/* Bell-shaped curve with sharp planet spike */}
            <path
              d="M 30 100 Q 110 100, 130 50 L 140 18 L 145 50 Q 160 30, 170 30 Q 185 30, 200 65 Q 220 100, 280 100"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
            />

            {/* Caustic annotation */}
            <text x="110" y="14" fill="#a78bfa" fontSize="8" fontFamily="monospace" fontWeight="bold">
              ★ Caustic Crossing Peak (&gt;1,000×)
            </text>

            {/* Current progress marker */}
            <circle cx={30 + progress * 250} cy={100 - (totalMag - 1) * 18} r="4" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
          </svg>

          {/* Interactive Scrub */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-slate-400">Scrub Alignment:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.005"
              value={progress}
              onChange={(e) => onSetProgress(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. PULSAR TIMING & LIGHTHOUSE SUB-COMPONENT                                */
/* -------------------------------------------------------------------------- */
const PulsarTimingGraphic: React.FC<{
  progress: number;
  isPlaying: boolean;
}> = ({ progress, isPlaying }) => {
  // Pulsar spin angle
  const spinAngle = (progress * 1440) % 360; // spins multiple times
  const rad = (spinAngle * Math.PI) / 180;

  // Beam sweeps toward observer when angle is ~90 or 270 deg
  const isBeamAligned = Math.abs(Math.sin(rad)) > 0.92;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="text-slate-300">
          <strong className="text-white">Radio Pulsar Timing &amp; Interferometry:</strong> Rapidly rotating neutron stars emit periodic pulses piercing dense galactic dust.
        </span>
        <span className="text-purple-400 font-bold">
          P = 1.337 s · Clock Stability: 10⁻¹⁵
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 items-center">
        {/* Rotating Neutron Star & Beams */}
        <div className="relative aspect-[16/10] md:h-[200px] lg:h-[215px] xl:h-[225px] lg:aspect-auto rounded-xl bg-[#010410] border border-cyan-500/20 overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 300 200" className="w-full h-full select-none">
            {/* Magnetic axis sweeping cones */}
            <g transform={`translate(150, 100) rotate(${spinAngle})`}>
              {/* Relativistic emission beam 1 */}
              <polygon points="0,0 -25,-90 25,-90" fill="rgba(167, 139, 250, 0.45)" stroke="#a78bfa" strokeWidth="1" />
              {/* Relativistic emission beam 2 */}
              <polygon points="0,0 -25,90 25,90" fill="rgba(167, 139, 250, 0.45)" stroke="#a78bfa" strokeWidth="1" />

              {/* Magnetic field line loops */}
              <ellipse cx="0" cy="0" rx="35" ry="18" fill="none" stroke="#818cf8" strokeWidth="0.8" strokeDasharray="3,2" />
            </g>

            {/* Central Neutron Star (Ultra-dense) */}
            <circle cx="150" cy="100" r="14" fill="#1e1b4b" stroke="#c084fc" strokeWidth="2" />
            <circle cx="150" cy="100" r="6" fill="#ffffff" filter="drop-shadow(0 0 8px #a78bfa)" />
            <text x="120" y="128" fill="#e2e8f0" fontSize="8" fontFamily="monospace">
              Pulsar Core (20 km)
            </text>

            {/* Earth Radio Antenna */}
            <circle cx="280" cy="100" r="4" fill="#38bdf8" />
            <text x="240" y="90" fill="#38bdf8" fontSize="8" fontFamily="monospace">
              Earth Dish
            </text>
          </svg>
        </div>

        {/* Oscilloscope Pulse Train */}
        <div className="relative aspect-[16/10] md:h-[200px] lg:h-[215px] xl:h-[225px] lg:aspect-auto p-3 rounded-xl bg-slate-950/80 border border-cyan-500/25 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="font-bold">RADIO OSCILLOSCOPE (PERIODIC PULSE TRAIN)</span>
            <span className={isBeamAligned ? 'text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40' : 'text-slate-500'}>
              {isBeamAligned ? '⚡ PULSE DETECTED' : 'Awaiting Beam'}
            </span>
          </div>

          <svg viewBox="0 0 300 100" className="w-full h-20 sm:h-24 select-none">
            {/* Baseline */}
            <line x1="10" y1="80" x2="290" y2="80" stroke="#334155" strokeWidth="1" />

            {/* Regular pulses */}
            {[40, 100, 160, 220, 280].map((px, i) => (
              <path
                key={i}
                d={`M ${px - 15} 80 L ${px - 2} 80 L ${px} 25 L ${px + 2} 80 L ${px + 15} 80`}
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2"
              />
            ))}
          </svg>

          <p className="text-[10px] font-mono text-slate-400 leading-snug">
            Tiny microsecond perturbations in pulse arrival times revealed the historic first exoplanets orbiting pulsar <strong className="text-purple-300">PSR B1257+12 (Lich)</strong> in 1992.
          </p>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 6. INFRARED PENETRATION & LASER GUIDE STAR AO SUB-COMPONENT                */
/* -------------------------------------------------------------------------- */
const InfraredAOGraphic: React.FC<{
  mode: 'optical' | 'infrared' | 'laser-ao';
  onChangeMode: (m: 'optical' | 'infrared' | 'laser-ao') => void;
}> = ({ mode, onChangeMode }) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="text-slate-300">
          <strong className="text-white">Infrared Penetration &amp; Adaptive Optics:</strong> Piercing dust extinction &amp; counteracting atmospheric turbulence.
        </span>
        {/* Mode Selector */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/60 border border-cyan-500/30 text-[10px] font-mono">
          <button
            onClick={() => onChangeMode('optical')}
            className={`px-2 py-0.5 rounded ${mode === 'optical' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            1. Optical (Dust Blocked)
          </button>
          <button
            onClick={() => onChangeMode('infrared')}
            className={`px-2 py-0.5 rounded ${mode === 'infrared' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            2. Infrared (Penetrating)
          </button>
          <button
            onClick={() => onChangeMode('laser-ao')}
            className={`px-2 py-0.5 rounded ${mode === 'laser-ao' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            3. Laser Guide Star AO
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 items-center">
        {/* Simulated Telescope Sensor Field */}
        <div className="relative aspect-[16/10] md:h-[200px] lg:h-[215px] xl:h-[225px] lg:aspect-auto rounded-xl bg-[#010410] border border-cyan-500/20 overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 300 200" className="w-full h-full select-none">
            <defs>
              <radialGradient id="starClusterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </radialGradient>
              <linearGradient id="dustGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1c1917" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#292524" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#0c0a09" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* Mode 1: Optical Light - Completely blocked by interstellar dust lanes */}
            {mode === 'optical' && (
              <g>
                <rect width="300" height="200" fill="#050814" />
                {/* A few faint foreground optical stars */}
                <circle cx="45" cy="40" r="1.5" fill="#94a3b8" />
                <circle cx="260" cy="50" r="1.5" fill="#94a3b8" />
                <circle cx="240" cy="160" r="2" fill="#cbd5e1" />

                {/* Massive opaque interstellar dust cloud absorbing starlight (Av > 30 mag) */}
                <path
                  d="M 20 20 Q 90 60, 150 50 Q 220 40, 280 80 Q 290 140, 220 170 Q 150 180, 80 160 Q 10 130, 20 20 Z"
                  fill="url(#dustGradient)"
                  stroke="#44403c"
                  strokeWidth="1"
                />
                <path
                  d="M 60 70 Q 120 110, 180 90 Q 240 100, 250 140 Q 170 150, 100 130 Z"
                  fill="#0c0a09"
                  opacity="0.9"
                />

                <text x="55" y="105" fill="#ea580c" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  Dense Dust Extinction (Av &gt; 30 mag)
                </text>
                <text x="35" y="125" fill="#f87171" fontSize="8" fontFamily="monospace">
                  ⚠ Galactic Center S-stars completely obscured in optical light
                </text>
              </g>
            )}

            {/* Mode 2: Infrared Penetration (Seeing Limited) */}
            {mode === 'infrared' && (
              <g>
                <rect width="300" height="200" fill="#070c1e" />
                {/* Dust lane becomes semi-transparent in Infrared (2.2 µm) */}
                <path
                  d="M 20 20 Q 90 60, 150 50 Q 220 40, 280 80 Q 290 140, 220 170 Q 150 180, 80 160 Q 10 130, 20 20 Z"
                  fill="rgba(41, 37, 36, 0.25)"
                  stroke="#78716c"
                  strokeWidth="0.8"
                  strokeDasharray="3,3"
                />

                {/* Starlight penetrates through dust, but blurred by Earth's atmosphere (~1" seeing disk) */}
                <circle cx="150" cy="100" r="30" fill="url(#starClusterGlow)" opacity="0.8" filter="blur(6px)" />
                <circle cx="150" cy="100" r="16" fill="#fef08a" opacity="0.6" filter="blur(3px)" />

                <circle cx="115" cy="85" r="14" fill="#fbbf24" opacity="0.5" filter="blur(4px)" />
                <circle cx="185" cy="115" r="14" fill="#fbbf24" opacity="0.5" filter="blur(4px)" />

                <text x="40" y="170" fill="#fde047" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  ★ IR Photons Penetrate Dust, But Atmospheric Blur (~1") Obscures Stars
                </text>
              </g>
            )}

            {/* Mode 3: Laser Guide Star AO (Diffraction Limited) */}
            {mode === 'laser-ao' && (
              <g>
                <rect width="300" height="200" fill="#02040d" />

                {/* Faint Sgr A* gravitational well center marker */}
                <circle cx="150" cy="100" r="4" fill="#000000" stroke="#f43f5e" strokeWidth="1" />
                <text x="135" y="90" fill="#f43f5e" fontSize="7" fontFamily="monospace" fontWeight="bold">
                  Sgr A* (4M M☉)
                </text>

                {/* Relativistic orbital ellipse of S2 star */}
                <ellipse cx="150" cy="100" rx="48" ry="24" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3,2" transform="rotate(-20 150 100)" />

                {/* Sharply resolved individual S-stars orbiting black hole */}
                <circle cx="185" cy="85" r="3.5" fill="#ffffff" filter="drop-shadow(0 0 5px #38bdf8)" />
                <text x="192" y="83" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">S2 (16 yr orbit)</text>

                <circle cx="115" cy="118" r="2.5" fill="#fde047" filter="drop-shadow(0 0 4px #eab308)" />
                <text x="95" y="132" fill="#fde047" fontSize="7" fontFamily="monospace">S38</text>

                <circle cx="130" cy="72" r="2" fill="#c084fc" filter="drop-shadow(0 0 4px #a855f7)" />
                <text x="115" y="68" fill="#c084fc" fontSize="7" fontFamily="monospace">S55</text>

                <circle cx="178" cy="122" r="2.5" fill="#34d399" filter="drop-shadow(0 0 4px #10b981)" />
                <text x="184" y="132" fill="#34d399" fontSize="7" fontFamily="monospace">S62</text>

                {/* Sodium Laser Guide Star Beam Fired From Ground Telescope */}
                <line x1="20" y1="190" x2="280" y2="20" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,2" opacity="0.6" />
                <text x="140" y="24" fill="#f59e0b" fontSize="7" fontFamily="monospace">
                  589 nm Sodium Laser (90 km Mesosphere)
                </text>

                <text x="35" y="185" fill="#34d399" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  ✔ 50 milliarcsecond diffraction-limited resolution achieved!
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Technical Callout */}
        <div className="p-3 md:h-[200px] lg:h-[215px] xl:h-[225px] flex flex-col justify-center rounded-xl bg-slate-950/80 border border-cyan-500/25 space-y-2 text-xs font-sans">
          <div className="text-xs font-mono text-cyan-300 font-bold uppercase">
            {mode === 'optical'
              ? 'Stage 1: Interstellar Dust Extinction (Visible Light)'
              : mode === 'infrared'
              ? 'Stage 2: Near-Infrared Dust Penetration (2.2 µm K-Band)'
              : 'Stage 3: Laser Guide Star Adaptive Optics (Keck & VLT)'}
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            {mode === 'optical' &&
              'Interstellar dust grains are the exact size of optical light waves, scattering and absorbing over 99.9999999999% of visual starlight in the Galactic Plane, hiding 100+ billion stars.'}
            {mode === 'infrared' &&
              'Near-infrared (1–5 µm) and mid-infrared light pass cleanly through interstellar dust clouds with minimal extinction, revealing the hidden stars, though ground atmosphere blurs their images.'}
            {mode === 'laser-ao' &&
              'Sodium lasers ignite artificial guide stars in Earth’s mesosphere; deformable mirrors vibrate 1,000 times/second to cancel wavefront turbulence, resolving stars orbiting the supermassive black hole Sgr A*.'}
          </p>
        </div>
      </div>
    </div>
  );
};
