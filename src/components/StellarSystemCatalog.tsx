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
    <div className="flex flex-col gap-4 sm:gap-6 w-full min-w-0 text-slate-200">
      {/* Standalone Hero Banner */}
      {!embedded && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-6 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md w-full min-w-0">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mobile-landscape:gap-2 min-w-0 w-full">
            <div className="space-y-1 sm:space-y-2 max-w-3xl min-w-0">
              <h1 className="text-base sm:text-2xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-3">
                <Share2 className="w-5 h-5 sm:w-7 sm:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-cyan-400 shrink-0" />
                <span>Stellar System Catalog</span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
                Explore gravitational hierarchies, orbital configurations, and physical components of solved binary, triple, and multiple star systems across the Milky Way.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 mobile-landscape:px-2 mobile-landscape:py-0.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] sm:text-xs font-bold shadow-sm">
                {MULTIPLE_STAR_SYSTEMS.length} Solved Systems
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar (Cohesive Blue Palette) */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-[#04081b]/95 border border-cyan-500/25 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between backdrop-blur-xl w-full min-w-0">
        <div className="relative flex-1 min-w-0 w-full">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search systems by star name, constellation, or component spectral type..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#020512] border border-cyan-500/30 focus:border-cyan-400 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all min-w-0"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full w-full md:w-auto shrink-0 py-0.5 min-w-0">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-xs font-mono text-slate-400 px-1 w-full min-w-0">
        <span className="truncate">
          Showing <strong className="text-cyan-400 font-bold">{filteredSystems.length}</strong> of{' '}
          {MULTIPLE_STAR_SYSTEMS.length} Systems in Registry
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1 shrink-0 self-start sm:self-auto">
          <Orbit className="w-3 h-3 text-cyan-400" />
          <span>Click card to launch 3D Dossier</span>
        </span>
      </div>

      {/* Main Responsive Grid Layout (4 per row on desktop, 4-3 on tablet, 1-2 on mobile portrait, max 3 on mobile landscape) */}
      {filteredSystems.length > 0 ? (
        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 mobile-landscape:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 w-full min-w-0">
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
