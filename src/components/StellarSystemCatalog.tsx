import React, { useState, useMemo } from 'react';
import { MultipleStarSystemData } from '../data/multipleStarSystemsData';
import { MULTIPLE_STAR_SYSTEMS } from '../data/multipleStarSystemsData';
import { StarData } from '../types';
import { STARS_CATALOG } from '../data/stars';
import { StellarSystemCard } from './StellarSystemCard';
import { 
  Share2, 
  Sparkles, 
  Search, 
  Orbit, 
  Layers
} from 'lucide-react';

interface StellarSystemCatalogProps {
  onInspectSystemInDossier: (system: MultipleStarSystemData, primaryStar?: StarData) => void;
  onInspectStar: (star: StarData) => void;
  onCompareStar?: (star: StarData) => void;
  embedded?: boolean;
}

export const StellarSystemCatalog: React.FC<StellarSystemCatalogProps> = ({
  onInspectSystemInDossier,
  onInspectStar: _onInspectStar,
  onCompareStar: _onCompareStar,
  embedded = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'binary' | 'triple' | 'multiple'>('all');

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
      if (typeFilter === 'binary') {
        return sys.components.length === 2;
      } else if (typeFilter === 'triple') {
        return sys.components.length === 3;
      } else if (typeFilter === 'multiple') {
        return sys.components.length >= 4;
      }

      return true;
    });
  }, [searchQuery, typeFilter]);

  // Find corresponding catalog star for primary component
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
    <div className="flex flex-col gap-4 sm:gap-5 max-w-7xl mx-auto">
      {/* Optional Standalone Hero Banner (Blue Theme) */}
      {!embedded && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#040920] via-[#081233] to-[#04081c] border border-cyan-500/30 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
                <Share2 className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400 shrink-0" />
                <span>Stellar System Catalog</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3.5 py-2 rounded-xl bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold shadow-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{MULTIPLE_STAR_SYSTEMS.length} Solved Systems</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar (Cohesive Blue Palette) */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-[#04081b]/95 border border-cyan-500/25 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search systems by star name, constellation, or component spectral type..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#020512] border border-cyan-500/30 focus:border-cyan-400 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'all', label: 'All Systems', count: MULTIPLE_STAR_SYSTEMS.length },
            { id: 'binary', label: 'Binaries', count: MULTIPLE_STAR_SYSTEMS.filter((s) => s.components.length === 2).length },
            { id: 'triple', label: 'Triples', count: MULTIPLE_STAR_SYSTEMS.filter((s) => s.components.length === 3).length },
            { id: 'multiple', label: 'Multiples (4+)', count: MULTIPLE_STAR_SYSTEMS.filter((s) => s.components.length >= 4).length },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTypeFilter(item.id as any)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                typeFilter === item.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                  : 'bg-[#020512] text-slate-400 hover:text-white hover:bg-white/5 border border-cyan-500/20'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  typeFilter === item.id ? 'bg-slate-950/30 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Summary Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-cyan-400 font-bold">{filteredSystems.length}</strong> of{' '}
            {MULTIPLE_STAR_SYSTEMS.length} Systems in Registry
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1">
            <Orbit className="w-3 h-3 text-cyan-400" />
            <span>Click card to launch 3D Dossier</span>
          </span>
        </div>
      </div>

      {/* Main Responsive Grid Layout (4 per row on desktop, 4-3 on tablet, 2 on mobile) */}
      {filteredSystems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
          {filteredSystems.map((sys) => (
            <StellarSystemCard
              key={sys.id}
              system={sys}
              isCompact={false}
              onViewDetails={handleLaunchDossier}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#070b18]/80 rounded-2xl border border-cyan-500/20 text-slate-400 backdrop-blur-xl">
          <p className="text-base font-semibold text-slate-300">
            No multiple star systems found matching "{searchQuery}".
          </p>
          <p className="text-xs mt-1">Try resetting the search query or category filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
