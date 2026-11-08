import React, { useState, useMemo } from 'react';
import { StarData } from '../types';
import {
  X,
  Search,
  Filter,
  Layers,
  ChevronRight,
  Database,
  Star,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { StarDot2D } from './StarDot2D';
import {
  getComprehensiveStarMapping,
  MappedClassificationInfo
} from '../utils/stellarClassificationMapping';

interface ClassificationDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stars: StarData[];
  onSelectStar: (star: StarData) => void;
}

export const ClassificationDirectoryModal: React.FC<ClassificationDirectoryModalProps> = ({
  isOpen,
  onClose,
  stars,
  onSelectStar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubsystemFilter, setSelectedSubsystemFilter] = useState<string>('all');

  // Compute comprehensive mappings for all stars
  const mappedRecords = useMemo<MappedClassificationInfo[]>(() => {
    return stars.map((s) => getComprehensiveStarMapping(s));
  }, [stars]);

  // Compute subsystem breakdown stats
  const stats = useMemo(() => {
    let harvardCount = 0;
    let otherCount = 0;
    let remnantCount = 0;
    const yerkesCount: Record<string, number> = {};
    let variableCount = 0;
    let exoplanetCount = 0;

    for (const rec of mappedRecords) {
      if (rec.harvardClass) harvardCount++;
      if (rec.otherClass) otherCount++;
      if (rec.remnantClass) remnantCount++;
      yerkesCount[rec.yerkesClass] = (yerkesCount[rec.yerkesClass] || 0) + 1;
      if (rec.variableTypes.length > 0) variableCount++;
      if (rec.star.exoplanetSystem && rec.star.exoplanetSystem.hasExoplanets) exoplanetCount++;
    }

    return {
      total: stars.length,
      harvardCount,
      otherCount,
      remnantCount,
      yerkesCount,
      variableCount,
      exoplanetCount,
    };
  }, [mappedRecords, stars.length]);

  // Filter records based on search and subsystem
  const filteredRecords = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return mappedRecords.filter((rec) => {
      // Subsystem filter
      if (selectedSubsystemFilter === 'harvard' && !rec.harvardClass) return false;
      if (selectedSubsystemFilter === 'other' && !rec.otherClass) return false;
      if (selectedSubsystemFilter === 'remnant' && !rec.remnantClass) return false;
      if (selectedSubsystemFilter === 'variable' && rec.variableTypes.length === 0) return false;
      if (selectedSubsystemFilter === 'exoplanet' && (!rec.star.exoplanetSystem || !rec.star.exoplanetSystem.hasExoplanets)) return false;
      if (selectedSubsystemFilter === 'hypergiant' && rec.yerkesClass !== 'Ia+') return false;
      if (selectedSubsystemFilter === 'supergiant' && rec.yerkesClass !== 'I') return false;
      if (selectedSubsystemFilter === 'giant' && rec.yerkesClass !== 'II' && rec.yerkesClass !== 'III') return false;
      if (selectedSubsystemFilter === 'main-sequence' && rec.yerkesClass !== 'V') return false;
      if (selectedSubsystemFilter === 'pop-ii' && rec.population !== 'Population II') return false;

      // Text query
      if (!q) return true;
      const s = rec.star;
      return (
        s.name.toLowerCase().includes(q) ||
        s.constellation.toLowerCase().includes(q) ||
        s.spectralType.toLowerCase().includes(q) ||
        s.spectralClass.toLowerCase().includes(q) ||
        rec.yerkesTitle.toLowerCase().includes(q) ||
        rec.systemType.toLowerCase().includes(q) ||
        rec.variableTypes.some((v) => v.toLowerCase().includes(q)) ||
        (s.alternateNames || []).some((alt) => alt.toLowerCase().includes(q))
      );
    });
  }, [mappedRecords, searchQuery, selectedSubsystemFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl observatory-panel border border-white/10 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-white/10 bg-[#060a16]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5 text-sky-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-bold font-mono text-white">
                  Complete Stellar Classification Directory
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] sm:text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 shrink-0" />
                  <span>{stats.total} / {stats.total} Stars Mapped (100%)</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-mono">
                Comprehensive mapping across Harvard, Yerkes, Exotic, Variable, System &amp; Population classifications
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] p-2 rounded-xl observatory-control text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-2 flex items-center justify-center"
            title="Close directory"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 p-3 sm:p-4 bg-black/30 border-b border-white/10 text-xs font-mono">
          <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Harvard Classes</span>
            <span className="text-base font-bold text-sky-300 font-mono">{stats.harvardCount}</span>
            <span className="text-[9px] text-slate-500 block">O B A F G K M</span>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Other / Exotic</span>
            <span className="text-base font-bold text-purple-300 font-mono">{stats.otherCount}</span>
            <span className="text-[9px] text-slate-500 block">WR, LBV, WD, NS, BD, C, S</span>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Hyper &amp; Super</span>
            <span className="text-base font-bold text-amber-300 font-mono">{(stats.yerkesCount['Ia+'] || 0) + (stats.yerkesCount['I'] || 0)}</span>
            <span className="text-[9px] text-slate-500 block">Classes Ia+ &amp; I</span>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Main Sequence</span>
            <span className="text-base font-bold text-sky-400 font-mono">{stats.yerkesCount['V'] || 0}</span>
            <span className="text-[9px] text-slate-500 block">Class V Dwarfs</span>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Variable Stars</span>
            <span className="text-base font-bold text-rose-300 font-mono">{stats.variableCount}</span>
            <span className="text-[9px] text-slate-500 block">Pulsators &amp; Flares</span>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Exoplanet Hosts</span>
            <span className="text-base font-bold text-emerald-300 font-mono">{stats.exoplanetCount}</span>
            <span className="text-[9px] text-slate-500 block">Confirmed Systems</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-3 sm:p-4 bg-black/40 border-b border-white/10 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by star name, constellation, Yerkes class, spectral type..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors min-h-[44px]"
            />
          </div>

          {/* Subsystem Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-mono text-xs shrink-0">
            {[
              { id: 'all', label: `All (${stats.total})` },
              { id: 'harvard', label: `Harvard (${stats.harvardCount})` },
              { id: 'other', label: `Other Classes (${stats.otherCount})` },
              { id: 'remnant', label: `Stellar Remnants (${stats.remnantCount})` },
              { id: 'hypergiant', label: 'Hypergiants (Ia+)' },
              { id: 'supergiant', label: 'Supergiants (I)' },
              { id: 'main-sequence', label: 'Main Sequence (V)' },
              { id: 'variable', label: 'Variables' },
              { id: 'exoplanet', label: 'Exoplanet Hosts' },
              { id: 'pop-ii', label: 'Population II' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedSubsystemFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium text-[11px] whitespace-nowrap min-h-[36px] ${
                  selectedSubsystemFilter === f.id
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                    : 'observatory-control text-slate-300 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count & Table Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-white/10">
          <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center justify-between">
            <span>
              Showing {filteredRecords.length} of {stats.total} classified stars
            </span>
            <span className="text-[10px] text-sky-400">
              Click any star to open its interactive 3D dossier
            </span>
          </div>

          <div className="space-y-1.5 pt-2">
            {filteredRecords.map((rec) => {
              const s = rec.star;
              return (
                <button
                  key={s.id}
                  id={`btn-directory-star-${s.id}`}
                  onClick={() => {
                    onClose();
                    onSelectStar(s);
                  }}
                  className="w-full p-2.5 rounded-xl observatory-control border border-white/5 hover:border-sky-400/50 text-left transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 group min-h-[44px]"
                >
                  {/* Left Column: Color, Name, Constellation, Spectral Class */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <StarDot2D star={s} sizeClassName="w-3.5 h-3.5" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors font-mono">
                          {s.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 font-mono text-sky-300 font-semibold">
                          {s.spectralType}
                        </span>
                        {s.exoplanetSystem && s.exoplanetSystem.hasExoplanets && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono">
                            🪐 {s.exoplanetSystem.confirmedCount} Planets
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {s.constellation} • {s.distanceLy.toLocaleString()} ly • {s.stellarStage}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Mapped Classifications */}
                  <div className="flex items-center gap-1.5 flex-wrap sm:justify-end text-[10px] font-mono shrink-0">
                    {/* Harvard / Other Class */}
                    {rec.harvardClass ? (
                      <span className="px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-500/30 text-sky-300">
                        Class {rec.harvardClass}
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-purple-300">
                        {rec.otherClass || 'Exotic'}
                      </span>
                    )}

                    {/* Yerkes Class */}
                    <span className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-sky-300">
                      Yerkes {rec.yerkesClass}
                    </span>

                    {/* Population */}
                    <span className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/5 text-slate-300">
                      {rec.population}
                    </span>

                    {/* System Type */}
                    <span className="px-1.5 py-0.5 rounded bg-amber-950/70 border border-amber-500/30 text-amber-300">
                      {rec.systemType}
                    </span>

                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-sky-300 transition-colors shrink-0 ml-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Stellar Classification Engine</span>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 rounded-xl observatory-control text-white text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
