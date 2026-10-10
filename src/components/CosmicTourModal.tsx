import React, { useState, useMemo, useEffect } from 'react';
import { StarData } from '../types';
import { STARS_CATALOG } from '../data/stars';
import { formatPhysicalDiameter } from '../utils/formatters';
import { StarDot2D } from './StarDot2D';
import { soundEffects } from '../utils/soundEffects';
import { 
  X, 
  Compass, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Orbit, 
  BookOpen, 
  RotateCcw,
  Eye,
  CheckCircle2,
  Telescope,
  Layers,
  ArrowRight
} from 'lucide-react';

export interface TourWaypoint {
  starId: string;
  fallbackName: string;
  headline: string;
  narration: string;
  keyHighlight: string;
}

export interface CosmicTour {
  id: string;
  title: string;
  tagline: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationEst: string;
  themeColor: string;
  waypoints: TourWaypoint[];
}

export const CURATED_TOURS: CosmicTour[] = [
  {
    id: 'life-death-titans',
    title: 'The Life & Death of Titans',
    tagline: 'From stable nuclear fusion to core-collapse supernovae and black hole singularities',
    difficulty: 'Intermediate',
    durationEst: '6 min',
    themeColor: '#06b6d4',
    waypoints: [
      {
        starId: 'sun',
        fallbackName: 'Sun (Sol)',
        headline: 'The Baseline: Equilibrium on the Main Sequence',
        narration: 'Our Sun has burned hydrogen via the proton-proton chain for 4.6 billion years in hydrostatic equilibrium, where inward gravitational pressure perfectly counters outward thermal radiation.',
        keyHighlight: 'Hydrostatic Equilibrium • G2V Main Sequence Dwarf',
      },
      {
        starId: 'spica',
        fallbackName: 'Spica',
        headline: 'Young, Fast & Massive: The Blue Giant Phase',
        narration: 'With 11 times the mass of the Sun, Spica consumes its core hydrogen thousands of times faster through the CNO cycle, glowing with intense ultraviolet radiation and high surface temperature.',
        keyHighlight: 'CNO Nuclear Burning • B1III-IV Massive Giant',
      },
      {
        starId: 'betelgeuse',
        fallbackName: 'Betelgeuse',
        headline: 'Swollen Supergiant: The Eve of Destruction',
        narration: 'Having exhausted core hydrogen, Betelgeuse has expanded to engulf the orbit of Jupiter. In its concentric shell-burning layers, it fuses heavier elements toward an iron core that cannot yield fusion energy.',
        keyHighlight: 'Pre-Supernova Candidate • M1-2Ia Red Supergiant',
      },
      {
        starId: 'crab-pulsar',
        fallbackName: 'Crab Pulsar',
        headline: 'Core Collapse: The Ultra-Dense Neutron Remnant',
        narration: 'When the iron core collapsed in the supernova of 1054 AD, protons and electrons were crushed into neutrons. A solar mass is now packed into a 20-kilometer ball rotating 30 times per second.',
        keyHighlight: 'Neutron Degeneracy Pressure • 30 Pulses/sec',
      },
      {
        starId: 'cygnus-x-1',
        fallbackName: 'Cygnus X-1',
        headline: 'Beyond the Limit: Gravitational Singularity',
        narration: 'Exceeding the Tolman-Oppenheimer-Volkoff limit (3 M☉), gravity overcame all known fundamental forces, crushing matter beyond an event horizon into a stellar-mass black hole.',
        keyHighlight: 'Kerr Singularity • 21 M☉ Event Horizon',
      },
    ],
  },
  {
    id: 'solar-neighborhood',
    title: 'The Solar Neighborhood',
    tagline: 'Journey through the Local Interstellar Chimney to our nearest stellar siblings',
    difficulty: 'Beginner',
    durationEst: '4 min',
    themeColor: '#38bdf8',
    waypoints: [
      {
        starId: 'sun',
        fallbackName: 'Sun (Sol)',
        headline: 'Our Home Star: 0 Light Years',
        narration: 'The anchor of our solar system, containing 99.86% of all mass in the system. Its light reaches Earth in 8 minutes and 20 seconds.',
        keyHighlight: 'Zero Light-Years • 1.0 M☉ Baseline',
      },
      {
        starId: 'proxima-centauri',
        fallbackName: 'Proxima Centauri',
        headline: 'Our Nearest Neighbor: 4.24 Light Years',
        narration: 'A dim red dwarf in the Alpha Centauri triple system. Despite its proximity, it is far too faint to be seen without a telescope, but hosts at least two exoplanets in orbit.',
        keyHighlight: '4.24 light-years • M5.5Ve Flare Star',
      },
      {
        starId: 'alpha-centauri-a',
        fallbackName: 'Alpha Centauri A',
        headline: 'The Primary Sister: 4.37 Light Years',
        narration: 'A near-exact twin of our Sun with 1.1 times solar mass and almost identical yellowish-white spectral emission, bound in an 80-year dance with Alpha Centauri B.',
        keyHighlight: '4.37 light-years • G2V Solar Twin',
      },
      {
        starId: 'barnards-star',
        fallbackName: "Barnard's Star",
        headline: 'The Cosmic Sprinter: 5.96 Light Years',
        narration: "Barnard's Star has the fastest proper motion of any known star, racing across our sky at 10.3 arcseconds per year and destined to make its closest approach in 11,800 CE.",
        keyHighlight: '5.96 light-years • Fastest Proper Motion in Sky',
      },
      {
        starId: 'sirius-a',
        fallbackName: 'Sirius A',
        headline: 'The Night Sky Beacon: 8.60 Light Years',
        narration: 'The brightest star in Earth’s night sky (apparent magnitude -1.46). A blazing white star with a companion white dwarf, twice the mass of the Sun and 25 times more luminous.',
        keyHighlight: '8.60 light-years • Apparent Magnitude -1.46',
      },
    ],
  },
  {
    id: 'scale-of-monsters',
    title: 'Scale of the Monsters',
    tagline: 'From Earth-sized white dwarfs to hypergiants that swallow planetary systems',
    difficulty: 'Beginner',
    durationEst: '5 min',
    themeColor: '#f59e0b',
    waypoints: [
      {
        starId: 'sirius-b',
        fallbackName: 'Sirius B',
        headline: 'Earth-Sized Mass: 12,000 km Diameter',
        narration: 'Contains the mass of the entire Sun compressed into a sphere smaller than planet Earth. A teaspoon of its material would weigh more than 5 metric tons on Earth.',
        keyHighlight: '0.0084 Solar Diameters • Relativistic White Dwarf',
      },
      {
        starId: 'sun',
        fallbackName: 'Sun (Sol)',
        headline: 'Standard Solar Caliber: 1,392,700 km',
        narration: 'The standard cosmic yardstick (1.0 R☉). Big enough that 1.3 million Earths could fit inside, yet a mere speck compared to giants.',
        keyHighlight: '1.0 Solar Diameter • 1.3 Million Earths Capacity',
      },
      {
        starId: 'arcturus',
        fallbackName: 'Arcturus',
        headline: 'The Swelling Giant: 25 Solar Diameters',
        narration: 'An orange giant star in Boötes that has begun helium core fusion, swelling to 25 times the radius of the Sun and brightening to 170 solar luminosities.',
        keyHighlight: '25.4 Solar Diameters • 35 Million km Diameter',
      },
      {
        starId: 'betelgeuse',
        fallbackName: 'Betelgeuse',
        headline: 'The Monster of Orion: ~764 Solar Diameters',
        narration: 'If placed at the center of our solar system, Betelgeuse would completely engulf Mercury, Venus, Earth, Mars, and reach into the asteroid belt toward Jupiter.',
        keyHighlight: '~764 Solar Diameters • 1.06 Billion km Diameter',
      },
      {
        starId: 'stephenson-2-18',
        fallbackName: 'Stephenson 2-18',
        headline: 'King of Hypergiants: ~2,150 Solar Diameters',
        narration: 'Among the largest known stars in the universe. If placed at the center of the Solar System, its photosphere would swallow Saturn’s entire orbit.',
        keyHighlight: '~2,150 Solar Diameters • 3 Billion km Diameter',
      },
    ],
  },
  {
    id: 'spectral-rainbow',
    title: 'The Harvard Spectral Rainbow (O to M)',
    tagline: 'Deciphering the temperature spectrum from searing blue to smoldering red',
    difficulty: 'Advanced',
    durationEst: '7 min',
    themeColor: '#8b5cf6',
    waypoints: [
      {
        starId: 'theta1-orionis-c',
        fallbackName: 'Theta1 Orionis C',
        headline: 'O-Type: Ionizing Blue Radiation (> 40,000 K)',
        narration: 'The brightest star in the Trapezium cluster illuminating the Orion Nebula. So luminous and hot that its intense UV radiation excites interstellar hydrogen into glowing pink emission.',
        keyHighlight: 'O7Vp • 45,000 Kelvin Surface Temperature',
      },
      {
        starId: 'rigel',
        fallbackName: 'Rigel',
        headline: 'B-Type: Sapphire Blue Luminosity (12,100 K)',
        narration: 'A brilliant blue supergiant in Orion radiating 120,000 times more energy than the Sun. Helium absorption lines dominate its optical spectrum.',
        keyHighlight: 'B8Ia • 12,100 Kelvin • 120,000 Solar Luminosity',
      },
      {
        starId: 'vega',
        fallbackName: 'Vega',
        headline: 'A-Type: Pure White Standard (9,600 K)',
        narration: 'The zero-point anchor of the UBV astronomical magnitude photometric system. Deep hydrogen Balmer absorption lines characterize this class.',
        keyHighlight: 'A0V • 9,600 Kelvin • Magnitude 0.00 Anchor',
      },
      {
        starId: 'procyon-a',
        fallbackName: 'Procyon A',
        headline: 'F-Type: Yellow-White Ionization (6,530 K)',
        narration: 'Slightly hotter and more massive than the Sun, with calcium and neutral metal absorption lines beginning to emerge clearly alongside hydrogen.',
        keyHighlight: 'F5IV-V • 6,530 Kelvin • Subgiant Evolution',
      },
      {
        starId: 'sun',
        fallbackName: 'Sun (Sol)',
        headline: 'G-Type: The Golden Balance (5,778 K)',
        narration: 'The prototypical yellow dwarf star. Neutral and singly ionized metal lines (such as Fraunhofer H and K calcium lines) are prominent throughout the spectrum.',
        keyHighlight: 'G2V • 5,778 Kelvin • Peak Emission in Green-Yellow',
      },
      {
        starId: 'aldebaran',
        fallbackName: 'Aldebaran',
        headline: 'K-Type: Amber Radiance (3,910 K)',
        narration: 'Cooler orange stars where metallic lines strengthen and molecular bands begin to form as cooler atmospheric temperatures allow complex bonds.',
        keyHighlight: 'K5III • 3,910 Kelvin • The Eye of Taurus',
      },
      {
        starId: 'proxima-centauri',
        fallbackName: 'Proxima Centauri',
        headline: 'M-Type: Deep Crimson Dwarf (3,040 K)',
        narration: 'The most abundant stars in the galaxy (over 70% of all stars). Titanium oxide (TiO) absorption bands dominate their cool, dense outer atmospheres.',
        keyHighlight: 'M5.5Ve • 3,040 Kelvin • Extreme Longevity (> 1 Trillion Yrs)',
      },
    ],
  },
];

interface CosmicTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFocusStar: (star: StarData) => void;
  onInspectStar: (star: StarData) => void;
}

export const CosmicTourModal: React.FC<CosmicTourModalProps> = ({
  isOpen,
  onClose,
  onFocusStar,
  onInspectStar,
}) => {
  const [selectedTour, setSelectedTour] = useState<CosmicTour>(CURATED_TOURS[0]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);

  // Map starId to actual StarData from catalog
  const starMap = useMemo(() => {
    const map = new Map<string, StarData>();
    STARS_CATALOG.forEach((s) => map.set(s.id, s));
    return map;
  }, []);

  const currentWaypoint = selectedTour.waypoints[currentStep] || selectedTour.waypoints[0];
  const activeStar = starMap.get(currentWaypoint.starId) || null;

  // Key navigation handlers
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && isTourActive) {
        handleNextStep();
      } else if (e.key === 'ArrowLeft' && isTourActive) {
        handlePrevStep();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isTourActive, currentStep, selectedTour]);

  const handleStartTour = (tour: CosmicTour) => {
    setSelectedTour(tour);
    setCurrentStep(0);
    setIsTourActive(true);
    soundEffects.play('select');

    // Automatically focus the first star
    const firstStar = starMap.get(tour.waypoints[0].starId);
    if (firstStar) {
      onFocusStar(firstStar);
    }
  };

  const handleNextStep = () => {
    if (currentStep < selectedTour.waypoints.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      soundEffects.play('nav');
      const nextStar = starMap.get(selectedTour.waypoints[next].starId);
      if (nextStar) {
        onFocusStar(nextStar);
      }
    } else {
      soundEffects.play('select');
      setIsTourActive(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      soundEffects.play('nav');
      const prevStar = starMap.get(selectedTour.waypoints[prev].starId);
      if (prevStar) {
        onFocusStar(prevStar);
      }
    }
  };

  const handleJumpToStep = (index: number) => {
    setCurrentStep(index);
    soundEffects.play('click');
    const targetStar = starMap.get(selectedTour.waypoints[index].starId);
    if (targetStar) {
      onFocusStar(targetStar);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#060a1a]/95 border border-cyan-500/35 shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden font-sans text-slate-100 backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-cyan-500/20 bg-[#081026]/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <span>Guided Cosmic Expeditions</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {selectedTour.waypoints.length} Waypoints
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Narrated astrophysicist journeys through the stellar catalog
              </p>
            </div>
          </div>

          <button
            id="btn-close-tour-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#030612]/80 hover:bg-[#0c1630] text-slate-400 hover:text-cyan-300 transition-colors border border-cyan-500/25 cursor-pointer shadow-sm"
            title="Exit cosmic tours"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isTourActive ? (
          /* Tour Selection Screen */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
            <div className="text-xs text-slate-400 font-mono mb-2">
              SELECT AN ASTRONOMICAL EXPEDITION TO BEGIN:
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {CURATED_TOURS.map((tour) => {
                const isSelected = selectedTour.id === tour.id;
                return (
                  <div
                    key={tour.id}
                    onClick={() => setSelectedTour(tour)}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#081333] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
                        : 'bg-[#040816]/80 hover:bg-[#060c22] border-cyan-500/20 hover:border-cyan-500/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span 
                          className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                          style={{
                            borderColor: `${tour.themeColor}55`,
                            color: tour.themeColor,
                            backgroundColor: `${tour.themeColor}15`,
                          }}
                        >
                          {tour.difficulty} • {tour.durationEst}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {tour.waypoints.length} stops
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {tour.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {tour.tagline}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-cyan-500/15 flex items-center justify-between">
                      {/* Waypoint preview dots */}
                      <div className="flex items-center gap-1.5">
                        {tour.waypoints.map((wp, idx) => (
                          <span
                            key={idx}
                            className="w-2 h-2 rounded-full bg-cyan-500/30"
                            title={wp.fallbackName}
                          />
                        ))}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartTour(tour);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <span>Start Expedition</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Tour Progression Screen */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Step Progress Bar */}
            <div className="px-4 sm:px-6 pt-3 pb-2 bg-[#050b1e] border-b border-cyan-500/15 shrink-0">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="text-cyan-300 font-bold">
                  {selectedTour.title}
                </span>
                <span>
                  Waypoint <strong className="text-white">{currentStep + 1}</strong> of {selectedTour.waypoints.length}
                </span>
              </div>

              {/* Progress dots row */}
              <div className="grid grid-cols-5 sm:grid-cols-5 gap-1.5">
                {selectedTour.waypoints.map((wp, idx) => {
                  const isDone = idx < currentStep;
                  const isCurrent = idx === currentStep;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleJumpToStep(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]'
                          : isDone
                          ? 'bg-cyan-600/60'
                          : 'bg-slate-800'
                      }`}
                      title={`Jump to ${wp.fallbackName}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Waypoint Body View */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 scrollbar-thin">
              {/* Waypoint Card Header */}
              <div className="p-4 rounded-xl bg-[#030614]/90 border border-cyan-500/25 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {activeStar && <StarDot2D star={activeStar} sizeClassName="w-8 h-8" />}
                    <div>
                      <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                        CURRENT CELESTIAL TARGET
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white">
                        {activeStar ? activeStar.name : currentWaypoint.fallbackName}
                      </h3>
                      {activeStar && (
                        <div className="text-xs font-mono text-slate-400 mt-0.5">
                          {activeStar.spectralType} • {activeStar.constellation} • {activeStar.distanceLy < 0.001 ? '0.00 ly' : `${activeStar.distanceLy.toLocaleString()} ly`}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeStar && (
                      <>
                        <button
                          onClick={() => {
                            onFocusStar(activeStar);
                            soundEffects.play('select');
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer"
                          title="Center in 3D scene"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Focus in 3D</span>
                        </button>

                        <button
                          onClick={() => {
                            onInspectStar(activeStar);
                            soundEffects.play('openModal');
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer"
                          title="Open full astronomical dossier"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Dossier</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Waypoint Scientific Narration */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                    WAYPOINT {currentStep + 1} INSIGHT
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {currentWaypoint.keyHighlight}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-white text-balance leading-snug">
                  {currentWaypoint.headline}
                </h4>

                <p className="text-sm text-slate-300 leading-relaxed font-sans bg-[#040818]/60 p-4 rounded-xl border border-cyan-500/15">
                  {currentWaypoint.narration}
                </p>
              </div>

              {/* Key Astrophysical Properties Strip if active star found */}
              {activeStar && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center font-mono">
                  {(() => {
                    const diam = formatPhysicalDiameter(activeStar.diameterKm, activeStar.diameterSolar);
                    return (
                      <>
                        <div className="p-2 rounded-lg bg-[#020510]/80 border border-cyan-500/20">
                          <span className="text-[9px] text-slate-400 block uppercase font-sans">Diameter</span>
                          <span className="text-cyan-300 font-bold text-xs truncate block">{diam.metricSi}</span>
                          <span className="text-[9px] text-slate-500 block">{diam.solarFormatted}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-[#020510]/80 border border-cyan-500/20">
                          <span className="text-[9px] text-slate-400 block uppercase font-sans">Mass</span>
                          <span className="text-blue-300 font-bold text-xs truncate block">{activeStar.massSolar.toFixed(1)} M☉</span>
                          <span className="text-[9px] text-slate-500 block">Solar Multiples</span>
                        </div>
                        <div className="p-2 rounded-lg bg-[#020510]/80 border border-cyan-500/20">
                          <span className="text-[9px] text-slate-400 block uppercase font-sans">Temp</span>
                          <span className="text-amber-300 font-bold text-xs truncate block">{activeStar.temperature.toLocaleString()} K</span>
                          <span className="text-[9px] text-slate-500 block">Surface</span>
                        </div>
                        <div className="p-2 rounded-lg bg-[#020510]/80 border border-cyan-500/20">
                          <span className="text-[9px] text-slate-400 block uppercase font-sans">Luminosity</span>
                          <span className="text-pink-300 font-bold text-xs truncate block">
                            {activeStar.luminositySolar >= 1000 ? activeStar.luminositySolar.toLocaleString() : activeStar.luminositySolar} L☉
                          </span>
                          <span className="text-[9px] text-slate-500 block">Radiant Flux</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Bottom Navigation Dock */}
            <div className="px-4 sm:px-6 py-3 bg-[#050b1e] border-t border-cyan-500/20 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => setIsTourActive(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tour Overview</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentStep === 0}
                  onClick={handlePrevStep}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                    currentStep === 0
                      ? 'bg-slate-950/40 text-slate-600 border-slate-800 cursor-not-allowed'
                      : 'bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border-cyan-500/40 cursor-pointer'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs font-mono transition-all cursor-pointer shadow-md shadow-cyan-500/25 active:scale-95"
                >
                  <span>{currentStep === selectedTour.waypoints.length - 1 ? 'Finish Tour' : 'Next Stop'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
