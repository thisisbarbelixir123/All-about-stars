import React, { useState, useMemo } from 'react';
import { StarData } from '../types';
import { ChevronRight, ChevronDown, ChevronUp, Search, Sparkles } from 'lucide-react';

interface ClassificationMappedStarsSectionProps {
  title: string;
  categoryColor: string;
  benchmarkStarIds: string[];
  allMappedStars: StarData[];
  onSelectStar: (star: StarData) => void;
}

export const ClassificationMappedStarsSection: React.FC<ClassificationMappedStarsSectionProps> = ({
  title,
  categoryColor,
  benchmarkStarIds,
  allMappedStars,
  onSelectStar,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Find benchmark star instances
  const benchmarkStars = useMemo(() => {
    return benchmarkStarIds
      .map((id) => allMappedStars.find((s) => s.id === id))
      .filter(Boolean) as StarData[];
  }, [benchmarkStarIds, allMappedStars]);

  // Filter all mapped stars by search query
  const filteredMappedStars = useMemo(() => {
    if (!searchQuery.trim()) return allMappedStars;
    const q = searchQuery.toLowerCase().trim();
    return allMappedStars.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.constellation.toLowerCase().includes(q) ||
        s.spectralType.toLowerCase().includes(q) ||
        (s.alternateNames || []).some((alt) => alt.toLowerCase().includes(q))
    );
  }, [allMappedStars, searchQuery]);

  return (
    <div className="mt-1 p-2.5 sm:p-3.5 rounded-xl bg-[#020512] border border-cyan-500/20 min-w-0">
      {/* Header with Title & Count */}
      <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className="w-2 h-2 rounded-full shrink-0 shadow-sm"
            style={{ backgroundColor: categoryColor }}
          />
          <span className="text-[11px] sm:text-xs font-mono uppercase text-cyan-400 font-bold break-words">
            {title}
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-semibold">
            {allMappedStars.length} Mapped {allMappedStars.length === 1 ? 'Star' : 'Stars'}
          </span>
        </div>

        {allMappedStars.length > 0 && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900/90 hover:bg-cyan-950/80 border border-slate-700/80 hover:border-cyan-500/40 text-cyan-300 hover:text-white text-[10px] sm:text-[11px] font-mono font-medium transition-all cursor-pointer shrink-0"
          >
            <span>{isExpanded ? 'Collapse List' : `View All ${allMappedStars.length} Stars`}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Featured / Benchmark Star Quick Pills */}
      {benchmarkStars.length > 0 && (
        <div className="mb-2">
          <div className="text-[9px] uppercase tracking-wider font-mono text-slate-400 mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Showcased Benchmarks ({benchmarkStars.length}):</span>
          </div>
          <div className="flex flex-wrap gap-1 min-w-0">
            {benchmarkStars.map((star) => (
              <button
                key={star.id}
                id={`btn-benchmark-star-${star.id}`}
                onClick={() => onSelectStar(star)}
                className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-[10px] sm:text-xs font-mono text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1 group max-w-full"
                title={`Inspect ${star.name} (${star.spectralType})`}
              >
                <span
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0"
                  style={{ backgroundColor: star.colorHex || categoryColor }}
                />
                <span className="font-semibold break-words">{star.name}</span>
                <span className="text-[9px] text-slate-400 font-normal">({star.spectralType})</span>
                <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-300 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Expandable Complete Mapped Stars Directory */}
      {isExpanded && (
        <div className="mt-2.5 pt-2.5 border-t border-cyan-500/15 animate-in fade-in duration-200">
          {/* Quick Search inside Mapped Stars */}
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search among all ${allMappedStars.length} mapped stars by name, constellation, spectral type...`}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Scrollable list of mapped stars */}
          <div className="max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20 pr-1 space-y-1">
            {filteredMappedStars.length === 0 ? (
              <div className="text-center py-4 text-xs font-mono text-slate-400">
                No stars matched "{searchQuery}"
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                {filteredMappedStars.map((star) => (
                  <button
                    key={star.id}
                    id={`btn-mapped-star-${star.id}`}
                    onClick={() => onSelectStar(star)}
                    className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-cyan-950/90 border border-slate-800 hover:border-cyan-400/80 text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 group"
                    title={`Inspect ${star.name} (${star.spectralType}, ${star.constellation})`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span
                        className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: star.colorHex || categoryColor }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold font-mono text-slate-200 group-hover:text-white truncate">
                          {star.name}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono truncate">
                          {star.spectralType} • {star.constellation}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-300 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
