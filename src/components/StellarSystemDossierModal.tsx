import React, { useState, useMemo } from 'react';
import { 
  X, 
  Share2, 
  Sparkles, 
  Orbit, 
  ChevronRight, 
  ExternalLink, 
  Layers, 
  Compass, 
  Flame, 
  Clock, 
  Thermometer, 
  Atom, 
  Info
} from 'lucide-react';
import { MultipleStarSystemData, getEffectiveStarCount } from '../data/multipleStarSystemsData';
import { StarData } from '../types';
import { STARS_CATALOG } from '../data/stars';
import { StellarSystem3DStage } from './StellarSystem3DStage';
import { soundEffects } from '../utils/soundEffects';

interface StellarSystemDossierModalProps {
  system: MultipleStarSystemData | null;
  onClose: () => void;
  onSelectStar: (star: StarData) => void;
  onSelectSystem?: (system: MultipleStarSystemData) => void;
}

export const StellarSystemDossierModal: React.FC<StellarSystemDossierModalProps> = ({
  system,
  onClose,
  onSelectStar,
  onSelectSystem,
}) => {
  const [selectedStarId, setSelectedStarId] = useState<string | null>(null);

  if (!system) return null;

  // Resolve corresponding catalog StarData for a component star
  const resolveCatalogStar = (componentId: string, catalogStarId?: string): StarData => {
    const targetId = catalogStarId || componentId;
    const found = STARS_CATALOG.find((s) => s.id === targetId || s.id === componentId);
    if (found) return found;

    // Fallback: search for any prefix match or create synthesized StarData from component
    const partialMatch = STARS_CATALOG.find((s) => s.id.startsWith(componentId) || componentId.startsWith(s.id));
    if (partialMatch) return partialMatch;

    const comp = system.components.find((c) => c.id === componentId) || system.components[0];
    const radiusKm = (comp.radiusSolar || 1) * 696340;
    return {
      id: comp.id,
      name: comp.name,
      alternateNames: [comp.bayerDesignation || comp.name],
      bayerDesignation: comp.bayerDesignation || '',
      constellation: system.constellation,
      diameterKm: radiusKm * 2,
      diameterSolar: (comp.radiusSolar || 1) * 2,
      diameterAU: (radiusKm * 2) / 149597870.7,
      temperature: comp.temperature,
      spectralType: comp.spectralType,
      spectralClass: (comp.spectralType.charAt(0) as any) || 'G',
      luminositySolar: comp.luminositySolar,
      massSolar: comp.massSolar,
      estimatedAge: '~300 Million Years',
      estimatedAgeMyr: 300,
      metallicityFeH: 0.1,
      rotationalVelocityKmS: 15,
      distanceLy: system.distanceLy,
      distanceParsecs: system.distanceLy / 3.26156,
      apparentMagnitude: 4.0,
      absoluteMagnitude: 2.0,
      surfaceGravityLogG: 4.2,
      colorHex: comp.colorHex,
      coronaColorHex: comp.coronaColorHex,
      solarEngulfment: `Spans ${(radiusKm * 2 / 1e6).toFixed(2)} Million km`,
      engulfsPlanets: [],
      habitableZoneAU: { inner: 1.0, outer: 2.0 },
      exoplanetSystem: {
        hasExoplanets: false,
        confirmedCount: 0,
        candidateCount: 0,
        systemOverview: `Part of the ${system.name} gravitationally bound system.`,
        planets: []
      },
      stellarStage: comp.isBlackHole ? 'Stellar Black Hole' : comp.isCompactRemnant ? 'White Dwarf' : 'Main Sequence Dwarf',
      lifespanEstimate: comp.isBlackHole ? '10^68 Years (Hawking Evaporation)' : '~1 Billion Years',
      futureFate: comp.isBlackHole ? 'Hawking Evaporation' : comp.isCompactRemnant ? 'Degenerate Cooling Remnant' : 'Red Giant / White Dwarf',
      fusionProcess: comp.isBlackHole ? 'None (Relativistic Infall & Accretion)' : comp.isCompactRemnant ? 'None (Degenerate Electron Core)' : 'Core Hydrogen Fusion',
      notableFacts: [
        `Member of the ${system.name}.`,
        comp.description
      ],
      description: comp.description,
    };
  };

  const handleOpenStarDossier = (componentId: string, catalogStarId?: string) => {
    soundEffects.play('click');
    const star = resolveCatalogStar(componentId, catalogStarId);
    onSelectStar(star);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 pointer-events-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md pointer-events-auto transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Container: Stellar System Dossier Window */}
      <div 
        className="relative w-full max-w-[96vw] xl:max-w-7xl h-[95vh] sm:h-[94vh] rounded-2xl sm:rounded-3xl bg-[#040816]/95 backdrop-blur-2xl border border-purple-500/40 shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="relative px-3 sm:px-6 py-3 shrink-0 border-b border-purple-500/25 bg-[#08051c]/95 backdrop-blur-xl">
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/90 text-purple-300 font-mono text-[10px] sm:text-xs font-bold border border-purple-400/40 uppercase tracking-wider shadow-sm">
                  <Share2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Stellar System Dossier</span>
                </span>

                <span className="px-2 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 font-mono text-[10px] sm:text-xs border border-cyan-500/30">
                  {system.systemType}
                </span>

                <span className="px-2 py-0.5 rounded-full bg-black/60 text-slate-300 font-mono text-[10px] sm:text-xs border border-slate-700">
                  {system.components.length} Stars Bound
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h1 className="text-base sm:text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>{system.name}</span>
                </h1>
              </div>

              <p className="text-[10px] sm:text-xs text-purple-200/70 font-mono mt-0.5 flex flex-wrap items-center gap-x-2">
                <span>Constellation: <strong className="text-slate-200">{system.constellation}</strong></span>
                <span>•</span>
                <span>Distance: <strong className="text-slate-200">{system.distanceLy.toLocaleString()} ly</strong></span>
                {system.visualSeparationArcsec && (
                  <>
                    <span>•</span>
                    <span>Separation: <strong className="text-slate-200">{system.visualSeparationArcsec}″</strong></span>
                  </>
                )}
              </p>
            </div>

            {/* Close Control */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl bg-black/60 hover:bg-purple-900/40 text-slate-400 hover:text-white border border-purple-500/30 transition-all cursor-pointer shrink-0 active:scale-95"
                title="Close Stellar System Dossier"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Body: Split Screen on Desktop */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 scrollbar-thin bg-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
            
            {/* Left Column: 3D Interactive Simulation Stage & Solved Orbits */}
            <div className="space-y-4 lg:sticky lg:top-0">
              <div className="h-[380px] sm:h-[460px] lg:h-[520px] w-full">
                <StellarSystem3DStage
                  system={system}
                  onStarClick={(starId) => setSelectedStarId(starId)}
                  selectedStarId={selectedStarId}
                />
              </div>

              {/* Solved Orbits Hierarchy Reference */}
              <div className="p-4 rounded-2xl bg-[#030617]/90 border border-purple-500/25 shadow-md">
                <div className="flex items-center gap-2 text-purple-300 font-mono font-bold text-xs uppercase tracking-wider mb-2.5">
                  <Orbit className="w-4 h-4 text-purple-400" />
                  <span>Solved Keplerian Orbital Architecture</span>
                </div>

                <div className="space-y-2">
                  {system.orbits.map((orb, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl bg-black/60 border border-purple-500/20 text-xs font-mono space-y-1 hover:border-purple-400/40 transition-colors"
                    >
                      <div className="flex items-center justify-between text-white font-bold">
                        <span className="text-purple-300">{orb.label}</span>
                        <span className="text-cyan-300 text-[11px]">
                          P = {orb.orbitalPeriodDays ? `${orb.orbitalPeriodDays.toFixed(2)} d` : `${orb.orbitalPeriodYears} yr`}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-300">
                        <div>Semi-Major: <span className="text-white font-bold">{orb.semiMajorAxisAU} AU</span></div>
                        <div>Eccentricity: <span className="text-white font-bold">{orb.eccentricity.toFixed(3)}</span></div>
                        <div>Inclination: <span className="text-white font-bold">{orb.inclinationDeg.toFixed(1)}°</span></div>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-sans pt-0.5">
                        {orb.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: System Astrophysics & Individual Star Dossier Cards */}
            <div className="space-y-4">
              
              {/* System Overview & Barycenter Physics */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0c0628]/90 via-[#07041c]/90 to-[#02020f]/90 border border-purple-500/30 shadow-lg space-y-3">
                <div className="flex items-center gap-2 text-purple-300 font-mono font-bold text-xs uppercase tracking-wider">
                  <Atom className="w-4 h-4 text-purple-400" />
                  <span>Barycenter Mechanics & Astrophysics</span>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-purple-500/20 text-xs text-purple-200/90 leading-relaxed font-sans">
                  <strong className="text-white block mb-1">Center of Mass Dynamics:</strong>
                  {system.barycenterDescription}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {system.astrophysicalSignificance}
                </p>
              </div>

              {/* Bound Component Stars Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Gravitationally Bound Stars ({system.components.length})</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    Click any star to open independent dossier
                  </span>
                </div>

                {/* Individual Component Dossier Cards */}
                <div className="grid grid-cols-1 gap-3">
                  {system.components.map((comp) => {
                    const isSelected = selectedStarId === comp.id;
                    return (
                      <div
                        key={comp.id}
                        onClick={() => handleOpenStarDossier(comp.id, comp.catalogStarId)}
                        className={`group p-3.5 sm:p-4 rounded-2xl bg-[#04081c]/90 border transition-all cursor-pointer relative overflow-hidden ${
                          isSelected
                            ? 'border-purple-400 ring-2 ring-purple-400/40 bg-[#0a0f30]/95 shadow-[0_0_25px_rgba(168,85,247,0.25)]'
                            : 'border-purple-500/25 hover:border-purple-400/60 hover:bg-[#080d28]/95'
                        }`}
                      >
                        {/* Glow accent */}
                        <div 
                          className="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-15 pointer-events-none"
                          style={{ backgroundColor: comp.colorHex === '#000000' ? '#1e293b' : comp.colorHex }}
                        />

                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span 
                                className="w-3 h-3 rounded-full shrink-0 shadow-sm border border-slate-500/80 ring-1 ring-slate-700/60"
                                style={{ backgroundColor: comp.colorHex }}
                                title={`${comp.name} (${comp.spectralType})`}
                              />
                              <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-200 transition-colors">
                                {comp.name}
                              </h4>
                              {comp.bayerDesignation && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 border border-slate-700 text-slate-300">
                                  {comp.bayerDesignation}
                                </span>
                              )}
                              <span 
                                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
                                style={
                                  comp.colorHex === '#000000' || comp.isBlackHole
                                    ? {
                                        backgroundColor: '#000000',
                                        borderColor: '#475569',
                                        color: '#cbd5e1',
                                      }
                                    : {
                                        backgroundColor: `${comp.colorHex}20`,
                                        borderColor: `${comp.colorHex}60`,
                                        color: comp.colorHex,
                                      }
                                }
                              >
                                {comp.spectralType}
                              </span>
                              {comp.isPrimary && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300">
                                  Primary Star
                                </span>
                              )}
                              {comp.isContactBinaryPair && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-500/50 text-blue-300">
                                  Contact Lobe
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-2">
                              {comp.description}
                            </p>

                            {/* Key Astrophysical Specs Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[10px]">
                              <div className="p-1.5 rounded-lg bg-black/50 border border-slate-800">
                                <span className="text-slate-400 block text-[9px]">Mass:</span>
                                <span className="text-white font-bold">{comp.massSolar.toFixed(comp.massSolar < 1 ? 3 : 2)} M☉</span>
                              </div>
                              <div className="p-1.5 rounded-lg bg-black/50 border border-slate-800">
                                <span className="text-slate-400 block text-[9px]">Radius:</span>
                                <span className="text-white font-bold">{comp.radiusSolar.toFixed(comp.radiusSolar < 0.1 ? 4 : 2)} R☉</span>
                              </div>
                              <div className="p-1.5 rounded-lg bg-black/50 border border-slate-800">
                                <span className="text-slate-400 block text-[9px]">Temp:</span>
                                <span className="text-amber-300 font-bold">{comp.temperature.toLocaleString()} K</span>
                              </div>
                              <div className="p-1.5 rounded-lg bg-black/50 border border-slate-800">
                                <span className="text-slate-400 block text-[9px]">Rotation:</span>
                                <span className="text-cyan-300 font-bold truncate">
                                  {comp.rotationalPeriodFormatted || `${comp.rotationalPeriodDays || 1}d`}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Open Dossier Action Button */}
                          <div className="sm:self-center shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenStarDossier(comp.id, comp.catalogStarId);
                              }}
                              className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-purple-600/80 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)] flex items-center justify-center gap-1.5 cursor-pointer group-hover:scale-105"
                            >
                              <span>Open Star Dossier</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
