import React, { useState, useEffect } from 'react';
import { StarData } from '../types';
import { formatPhysicalDiameter } from '../utils/formatters';
import { BookOpen, Bookmark } from 'lucide-react';
import { StarDot2D } from './StarDot2D';
import { RunningText } from './RunningText';
import { isStarBookmarked, toggleStarBookmark, subscribeAstronomyData } from '../utils/bookmarks';
import { soundEffects } from '../utils/soundEffects';

interface StarCardProps {
  star: StarData;
  onViewDetails: (star: StarData) => void;
  isCompact?: boolean;
}

export const StarCard: React.FC<StarCardProps> = ({
  star,
  onViewDetails,
}) => {
  const [bookmarked, setBookmarked] = useState<boolean>(() => isStarBookmarked(star.id));

  useEffect(() => {
    setBookmarked(isStarBookmarked(star.id));
    return subscribeAstronomyData(() => {
      setBookmarked(isStarBookmarked(star.id));
    });
  }, [star.id]);

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = toggleStarBookmark(star.id);
    setBookmarked(next);
    soundEffects.play(next ? 'toggleOn' : 'toggleOff');
  };

  const scaleObj = formatPhysicalDiameter(star.diameterKm, star.diameterSolar);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onViewDetails(star)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails(star);
        }
      }}
      className="group relative bg-[#060a1a]/95 hover:bg-[#091129] border border-cyan-500/30 hover:border-cyan-400 rounded-xl p-2.5 sm:p-3 md:p-3.5 transition-all duration-200 shadow-sm hover:shadow-[0_6px_20px_rgba(6,182,212,0.28)] hover:-translate-y-0.5 active:translate-y-0 flex flex-col justify-between gap-2 sm:gap-2.5 backdrop-blur-xl cursor-pointer select-none overflow-hidden min-h-[125px] sm:min-h-[135px] md:min-h-[148px]"
      title={`Open ${star.name} Dossier`}
    >
      {/* Top: Name & Bookmark */}
      <div className="flex items-center justify-between gap-1.5 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
          <StarDot2D star={star} sizeClassName="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0" />
          <div className="min-w-0 flex-1 overflow-hidden">
            <RunningText
              text={star.name}
              className="text-xs sm:text-sm md:text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-sans truncate block leading-tight"
              title={star.name}
            />
          </div>
        </div>

        <button
          onClick={handleToggleBookmark}
          className={`p-1 rounded-lg transition-colors cursor-pointer shrink-0 hover:bg-white/5 ${
            bookmarked ? 'text-amber-400' : 'text-slate-500 hover:text-amber-300'
          }`}
          title={bookmarked ? 'Remove bookmark' : 'Bookmark star'}
        >
          <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Sub-header: Spectral type badge & Constellation */}
      <div className="flex items-center justify-between gap-1.5 text-[9px] sm:text-[10px] md:text-xs font-mono leading-none min-w-0">
        <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold truncate">
          {star.spectralType}
        </span>
        <span className="text-slate-400 truncate text-[9px] sm:text-[10px] md:text-[11px]">
          {star.constellation || star.stellarStage}
        </span>
      </div>

      {/* 3-metric strip */}
      <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-cyan-500/20 text-center font-mono">
        <div className="p-1 rounded-lg bg-[#020510]/85 border border-cyan-500/15 min-w-0 overflow-hidden">
          <span className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] text-slate-400 block uppercase font-sans truncate font-medium">Diam</span>
          <span className="text-cyan-300 font-bold text-[9px] sm:text-[10px] md:text-xs block truncate" title={scaleObj.metricSi}>
            {scaleObj.metricSi}
          </span>
        </div>

        <div className="p-1 rounded-lg bg-[#020510]/85 border border-cyan-500/15 min-w-0 overflow-hidden">
          <span className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] text-slate-400 block uppercase font-sans truncate font-medium">Mass</span>
          <span className="text-blue-300 font-bold text-[9px] sm:text-[10px] md:text-xs block truncate" title={`${star.massSolar} M☉`}>
            {star.massSolar < 1 ? star.massSolar.toFixed(2) : star.massSolar.toFixed(1)}
          </span>
        </div>

        <div className="p-1 rounded-lg bg-[#020510]/85 border border-cyan-500/15 min-w-0 overflow-hidden">
          <span className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] text-slate-400 block uppercase font-sans truncate font-medium">Temp</span>
          <span className="text-amber-300 font-bold text-[9px] sm:text-[10px] md:text-xs block truncate" title={`${star.temperature.toLocaleString()} K`}>
            {star.temperature >= 1000 ? `${(star.temperature / 1000).toFixed(star.temperature >= 10000 ? 0 : 1)}k` : star.temperature}
          </span>
        </div>
      </div>

      {/* Dossier Action Button */}
      <button
        id={`btn-card-details-${star.id}`}
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails(star);
        }}
        className="w-full flex items-center justify-center gap-1.5 py-1 sm:py-1.5 px-2 rounded-lg bg-cyan-950/70 group-hover:bg-cyan-900 text-cyan-300 group-hover:text-white border border-cyan-500/40 group-hover:border-cyan-400 text-[10px] sm:text-xs font-semibold font-mono transition-all cursor-pointer shadow-xs active:scale-95 truncate overflow-hidden"
      >
        <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
        <span className="truncate">View Dossier</span>
      </button>
    </div>
  );
};
