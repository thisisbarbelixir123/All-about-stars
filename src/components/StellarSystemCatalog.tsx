import React, { useState, useMemo } from 'react';
import { MultipleStarSystemData } from '../data/multipleStarSystemsData';
import { MULTIPLE_STAR_SYSTEMS, getEffectiveStarCount } from '../data/multipleStarSystemsData';
import { StarData } from '../types';
import { STARS_CATALOG } from '../data/stars';
import { 
  Share2, 
  Sparkles, 
  Search, 
  Compass, 
  Orbit, 
  Layers, 
  ChevronRight,
  ExternalLink,
  Flame,
  Info,
  SlidersHorizontal,
  Clock
} from 'lucide-react';

interface StellarSystemCatalogProps {
  onInspectSystemInDossier: (system: MultipleStarSystemData, primaryStar?: StarData) => void;
  onInspectStar: (star: StarData) => void;
  onCompareStar?: (star: StarData) => void;
  embedded?: boolean;
}

export const StellarSystemCatalog: React.FC<StellarSystemCatalogProps> = ({
  onInspectSystemInDossier,
  onInspectStar,
  onCompareStar,
  embedded = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'binary' | 'triple' | 'multiple' | 'contact'>('all');
  const [selectedSystemId, setSelectedSystemId] = useState<string>(MULTIPLE_STAR_SYSTEMS[0].id);

  const filteredSystems = useMemo(() => {
    return MULTIPLE_STAR_SYSTEMS.filter((sys) => {
      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = sys.name.toLowerCase().includes(q);
        const matchesConstellation = sys.constellation.toLowerCase().includes(q);
        const matchesType = sys.systemType.toLowerCase().includes(q);
        const matchesComponents = sys.components.some(
          (c) => c.name.toLowerCase().includes(q) || c.spectralType.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesConstellation && !matchesType && !matchesComponents) {
          return false;
        }
      }

      // Filter by system architecture type
      if (typeFilter === 'contact') {
        return sys.systemType === 'Overcontact Binary' || sys.hasContactBinary;
      } else if (typeFilter === 'binary') {
        return sys.components.length === 2 && !sys.hasContactBinary && sys.systemType !== 'Overcontact Binary';
      } else if (typeFilter === 'triple') {
        return sys.components.length === 3;
      } else if (typeFilter === 'multiple') {
        return sys.components.length >= 4;
      }

      return true;
    });
  }, [searchQuery, typeFilter]);

  const activeSystem = useMemo(() => {
    return (
      filteredSystems.find((s) => s.id === selectedSystemId) ||
      filteredSystems[0] ||
      MULTIPLE_STAR_SYSTEMS[0]
    );
  }, [filteredSystems, selectedSystemId]);

  // Find corresponding catalog star for the primary component
  const getCatalogStarForComp = (comp: { id: string; catalogStarId?: string }) => {
    const targetId = comp.catalogStarId || comp.id;
    return STARS_CATALOG.find((s) => s.id === targetId || s.id.startsWith(comp.id));
  };

  const handleLaunchDossier = (sys: MultipleStarSystemData) => {
    const primaryComp = sys.components[0];
    const catStar = getCatalogStarForComp(primaryComp);
    if (catStar) {
      onInspectSystemInDossier(sys, catStar);
    } else {
      // Fallback: look through all components for any catalog star
      for (const comp of sys.components) {
        const cs = getCatalogStarForComp(comp);
        if (cs) {
          onInspectSystemInDossier(sys, cs);
          return;
        }
      }
      onInspectSystemInDossier(sys);
    }
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6 max-w-7xl mx-auto">
      {/* Hero Banner: Stellar System Catalog (only shown when in standalone view) */}
      {!embedded && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d0726] via-[#150a38] to-[#08031d] border border-purple-500/35 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-400/50 text-purple-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Dedicated Multi-Star Registry
                </span>
                <span className="text-purple-400/60 text-xs font-mono">• Separate from Individual Stars</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
                <Share2 className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400 shrink-0 animate-pulse" />
                <span>Stellar System Catalog</span>
              </h1>
              <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed font-sans">
                Explore {MULTIPLE_STAR_SYSTEMS.length} gravitationally bound multiple star systems—from ultra-compact contact binaries and colliding-wind monsters (Eta Carinae) to visual binaries and sextuple hierarchical orbits (Castor, Mizar-Alcor). Each system features fully solved 3D Keplerian orbits, mutual barycenters, and peer-reviewed rotational periods.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3.5 py-2 rounded-xl bg-purple-950/90 border border-purple-500/50 text-purple-300 font-mono text-xs font-bold shadow-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />
                <span>{MULTIPLE_STAR_SYSTEMS.length} Solved Systems</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#04081b]/95 border border-purple-500/25 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search systems by star name, constellation, or component spectral type..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#020512] border border-purple-500/30 focus:border-purple-400 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'all', label: 'All Systems', count: MULTIPLE_STAR_SYSTEMS.length },
            { id: 'contact', label: 'Contact Binaries', count: MULTIPLE_STAR_SYSTEMS.filter((s) => s.hasContactBinary || s.systemType === 'Overcontact Binary').length },
            { id: 'binary', label: 'Binaries', count: MULTIPLE_STAR_SYSTEMS.filter((s) => s.components.length === 2 && !s.hasContactBinary).length },
            { id: 'triple', label: 'Triples', count: MULTIPLE_STAR_SYSTEMS.filter((s) => s.components.length === 3).length },
            { id: 'multiple', label: 'Multiples (4+)', count: MULTIPLE_STAR_SYSTEMS.filter((s) => s.components.length >= 4).length },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTypeFilter(item.id as any)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                typeFilter === item.id
                  ? 'bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(147,51,234,0.4)]'
                  : 'bg-[#020512] text-slate-400 hover:text-white hover:bg-white/5 border border-purple-500/20'
              }`}
            >
              <span>{item.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded ${typeFilter === item.id ? 'bg-purple-950/60 text-purple-200' : 'bg-slate-900 text-slate-500'}`}>
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Catalog Layout: Master-Detail Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Systems List Column (Left, 5 cols) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredSystems.map((sys) => {
            const isSelected = sys.id === activeSystem.id;
            const effCount = getEffectiveStarCount(sys);
            const isContact = sys.hasContactBinary || sys.systemType === 'Overcontact Binary';

            return (
              <div
                key={sys.id}
                onClick={() => setSelectedSystemId(sys.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#170e3b] to-[#0a0522] border-purple-400/80 shadow-[0_0_20px_rgba(168,85,247,0.25)] ring-1 ring-purple-400/30'
                    : 'bg-[#04081c]/80 hover:bg-[#090d2e] border-purple-500/20 hover:border-purple-400/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm tracking-tight group-hover:text-purple-300 transition-colors truncate">
                      {sys.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-purple-300/80 mt-0.5">
                      <span>{sys.constellation}</span>
                      <span>•</span>
                      <span>{sys.distanceLy} ly</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/90 border border-purple-500/40 text-purple-300 font-mono font-bold shrink-0">
                    {sys.systemType}
                  </span>
                </div>

                {/* Component Dots & Count Pill */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-purple-500/15">
                  <div className="flex items-center gap-1.5">
                    {sys.components.map((c) => (
                      <span
                        key={c.id}
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: c.colorHex, boxShadow: `0 0 6px ${c.colorHex}` }}
                        title={`${c.name} (${c.spectralType})`}
                      />
                    ))}
                    <span className="text-[10px] text-slate-400 font-mono ml-1">
                      {sys.components.map((c) => c.name.split(' (')[0]).join(' + ')}
                    </span>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 border border-purple-500/30 text-purple-200 font-mono shrink-0">
                    {isContact ? '1 Star (2 Lobes)' : `${effCount} Stars`}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredSystems.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-[#04081c] border border-purple-500/20 text-slate-400 font-mono text-xs">
              No multiple star systems matched "{searchQuery}".
            </div>
          )}
        </div>

        {/* Detailed System Architecture View (Right, 7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#050924]/95 border border-purple-500/35 p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-5 lg:sticky lg:top-4">
          {/* Header & Quick Action Launch to 3D Dossier */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 font-bold">
                  {activeSystem.systemType}
                </span>
                <span className="text-[10px] font-mono text-cyan-300">
                  {activeSystem.distanceLy} light-years
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {activeSystem.name}
              </h2>
            </div>

            <button
              id="btn-launch-system-3d-dossier"
              onClick={() => handleLaunchDossier(activeSystem)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs font-mono shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer active:scale-95 shrink-0"
              title="Launch interactive 3D Stellar System Dossier Stage"
            >
              <Orbit className="w-4 h-4 text-white animate-spin-slow" />
              <span>LAUNCH 3D SYSTEM DOSSIER</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Astrophysical Significance Card */}
          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-100/90 leading-relaxed font-sans">
            <span className="font-bold text-purple-300 block mb-1 uppercase font-mono text-[10px]">
              Astrophysical Significance & Orbital Architecture
            </span>
            {activeSystem.astrophysicalSignificance}
          </div>

          {/* Contact Binary Badge */}
          {(activeSystem.hasContactBinary || activeSystem.systemType === 'Overcontact Binary') && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs font-mono flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">Overcontact Binary Object Count:</span> Counts as{' '}
                <strong>1 unified stellar object</strong> in galaxy tallies, sharing a common neck and convective photosphere. Both lobes are fully rendered in 3D.
              </div>
            </div>
          )}

          {/* Components Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center justify-between">
              <span>Member Stellar Components ({activeSystem.components.length})</span>
              <span className="text-[10px] text-purple-400 font-normal">Peer-Reviewed Rotation & Metrics</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeSystem.components.map((comp) => {
                const catStar = getCatalogStarForComp(comp);

                return (
                  <div
                    key={comp.id}
                    className="p-3 rounded-xl bg-[#030616] border border-purple-500/25 flex flex-col justify-between gap-2.5"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: comp.colorHex, boxShadow: `0 0 6px ${comp.colorHex}` }}
                          />
                          <span className="font-bold text-white text-xs truncate">{comp.name}</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-black text-cyan-300 font-mono border border-slate-800 shrink-0">
                          {comp.spectralType}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {comp.description}
                      </p>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-purple-500/15 text-[10px] font-mono text-slate-400">
                      <div className="flex items-center justify-between">
                        <span>Mass / Radius:</span>
                        <span className="text-purple-200 font-bold">
                          {comp.massSolar.toFixed(1)} M☉ • {comp.radiusSolar.toFixed(1)} R☉
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Temperature:</span>
                        <span className="text-amber-300 font-bold">
                          {comp.temperature.toLocaleString()} K
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>Axial Spin:</span>
                        </span>
                        <span className="text-cyan-300 font-bold">
                          {comp.rotationalPeriodFormatted || `${comp.rotationalPeriodDays} Days`}
                        </span>
                      </div>
                    </div>

                    {catStar && (
                      <div className="pt-2 flex items-center gap-1.5">
                        <button
                          onClick={() => onInspectStar(catStar)}
                          className="flex-1 px-2 py-1 rounded bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 hover:text-white text-[10px] font-mono font-semibold transition-all cursor-pointer text-center"
                        >
                          View Star Dossier
                        </button>
                        {onCompareStar && (
                          <button
                            onClick={() => onCompareStar(catStar)}
                            className="px-2 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 hover:text-white text-[10px] font-mono font-semibold transition-all cursor-pointer"
                            title="Add to 3D Stage Comparison"
                          >
                            + Compare
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Solved Orbits Section */}
          <div className="space-y-2 pt-2 border-t border-purple-500/20">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Solved Keplerian Orbits ({activeSystem.orbits.length})
            </h3>
            <div className="space-y-2">
              {activeSystem.orbits.map((orb, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#020512] border border-purple-500/20 text-[11px] font-mono text-slate-300 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between font-bold text-purple-300">
                    <span>{orb.label}</span>
                    <span className="text-emerald-400">
                      P = {orb.orbitalPeriodYears >= 1 ? `${orb.orbitalPeriodYears.toFixed(2)} yr` : `${orb.orbitalPeriodDays?.toFixed(1) || (orb.orbitalPeriodYears * 365.25).toFixed(1)} d`}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{orb.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] pt-1 border-t border-slate-800 text-slate-400">
                    <div>
                      <span className="block text-slate-500">Semi-Major (a):</span>
                      <span className="text-cyan-300 font-bold">{orb.semiMajorAxisAU} AU</span>
                    </div>
                    <div>
                      <span className="block text-slate-500">Eccentricity (e):</span>
                      <span className="text-amber-300 font-bold">{orb.eccentricity.toFixed(3)}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500">Inclination (i):</span>
                      <span className="text-blue-300 font-bold">{orb.inclinationDeg}°</span>
                    </div>
                    <div>
                      <span className="block text-slate-500">Periastron (q):</span>
                      <span className="text-rose-300 font-bold">{orb.periastronAU} AU</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
