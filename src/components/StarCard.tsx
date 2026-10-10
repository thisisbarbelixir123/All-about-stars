import React, { useState, useEffect } from 'react';
import { StarData } from '../types';
import { formatPhysicalDiameter } from '../utils/formatters';
import { BookOpen, Bookmark } from 'lucide-react';
import { StarDot2D } from './StarDot2D';
import { isStarBookmarked, toggleStarBookmark, subscribeAstronomyData } from '../utils/bookmarks';
import { soundEffects } from '../utils/soundEffects';

interface StarCardProps {
  star: StarData;
  onViewDetails: (star: StarData) => void;
  isSelectedForCompare?: boolean;
  onToggleCompare?: (star: StarData) => void;
  onFocus3D?: (star: StarData) => void;
  isCompact?: boolean;
}

export const StarCard: React.FC<StarCardProps> = ({
  star,
  onViewDetails,
  isCompact = false,
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

  if (isCompact) {
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
        className="group relative bg-[#060a1a]/95 hover:bg-[#091129] border border-cyan-500/25 hover:border-cyan-400/80 rounded-xl p-2 transition-all duration-200 shadow-sm hover:shadow-[0_2px_20px_rgba(6,182,212,0.3)] flex flex-col justify-between gap-1.5 backdrop-blur-xl cursor-pointer select-none"
        title={`Click anywhere on card to open ${star.name} Dossier`}
      >
        {/* Top: Name & Spectral Type */}
        <div className="flex items-start justify-between gap-1">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <StarDot2D star={star} sizeClassName="w-2.5 h-2.5" />
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate font-sans" title={star.name}>
                {star.name}
              </h3>
              <p className="text-[9px] text-slate-400 font-mono truncate leading-none mt-0.5">
                {star.constellation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleToggleBookmark}
              className={`p-0.5 rounded transition-colors cursor-pointer ${
                bookmarked ? 'text-amber-400' : 'text-slate-500 hover:text-amber-300'
              }`}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark star'}
            >
              <Bookmark className={`w-3 h-3 ${bookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            <span 
              className="text-[8px] px-1 py-0.2 rounded font-mono font-bold border shrink-0"
              style={{
                borderColor: `${star.colorHex}66`,
                backgroundColor: `${star.colorHex}22`,
                color: '#f8fafc',
              }}
              title={`Spectral Class: ${star.spectralType}`}
            >
              {star.spectralType}
            </span>
          </div>
        </div>

        {/* Ultra-compact 3-metric strip */}
        <div className="grid grid-cols-3 gap-1 pt-1 border-t border-cyan-500/15 text-center font-mono">
          <div className="p-0.5 rounded bg-[#020510]/80 border border-cyan-500/15">
            <span className="text-[6.5px] text-slate-500 block uppercase font-sans">Diam</span>
            <span className="text-cyan-300 font-bold text-[8.5px] block truncate" title={scaleObj.metricSi}>
              {scaleObj.metricSi}
            </span>
          </div>

          <div className="p-0.5 rounded bg-[#020510]/80 border border-cyan-500/15">
            <span className="text-[6.5px] text-slate-500 block uppercase font-sans">Mass</span>
            <span className="text-blue-300 font-bold text-[8.5px] block truncate" title={`${star.massSolar} M☉`}>
              {star.massSolar < 1 ? star.massSolar.toFixed(2) : star.massSolar.toFixed(1)} <span className="text-[6px] text-slate-400 font-normal">M☉</span>
            </span>
          </div>

          <div className="p-0.5 rounded bg-[#020510]/80 border border-cyan-500/15">
            <span className="text-[6.5px] text-slate-500 block uppercase font-sans">Temp</span>
            <span className="text-amber-300 font-bold text-[8.5px] block truncate" title={`${star.temperature.toLocaleString()} K`}>
              {star.temperature >= 1000 ? `${(star.temperature / 1000).toFixed(star.temperature >= 10000 ? 0 : 1)}k` : star.temperature}
            </span>
          </div>
        </div>

        {/* Small Dossier Button */}
        <button
          id={`btn-card-details-${star.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(star);
          }}
          className="w-full flex items-center justify-center gap-1 py-0.5 px-1.5 rounded-lg bg-cyan-950/50 group-hover:bg-cyan-900/80 text-cyan-300 group-hover:text-white border border-cyan-500/35 group-hover:border-cyan-400 text-[9px] font-semibold font-mono transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <BookOpen className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
          <span>Dossier</span>
        </button>
      </div>
    );
  }

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
      className="group relative bg-[#060a1a]/90 hover:bg-[#091129] border border-cyan-500/25 hover:border-cyan-400/80 rounded-xl p-2 sm:p-3 transition-all duration-200 shadow-md hover:shadow-[0_4px_25px_rgba(6,182,212,0.25)] hover:-translate-y-0.5 active:translate-y-0 flex flex-col justify-between gap-2 sm:gap-2.5 backdrop-blur-xl cursor-pointer select-none"
      title={`Click anywhere on card to open ${star.name} Dossier`}
    >
      {/* Top: Star Name, Spectral Class, Constellation */}
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex items-start justify-between gap-1 sm:gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            {/* Spectral Color Dot */}
            <StarDot2D star={star} sizeClassName="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate font-sans" title={star.name}>
                {star.name}
              </h3>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono truncate leading-tight">
                {star.constellation}
              </p>
            </div>
          </div>

          {/* Spectral Class Pill & Bookmark Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleToggleBookmark}
              className={`p-1 rounded-lg transition-colors cursor-pointer border ${
                bookmarked
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-amber-300 border-transparent hover:border-slate-700'
              }`}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark star'}
            >
              <Bookmark className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${bookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            <span 
              className="text-[8.5px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-md font-mono font-bold border shrink-0 shadow-sm whitespace-nowrap"
              style={{
                borderColor: `${star.colorHex}66`,
                backgroundColor: `${star.colorHex}22`,
                color: '#f8fafc',
              }}
              title={`Spectral Class: ${star.spectralType}`}
            >
              {star.spectralType}
            </span>
          </div>
        </div>

        {/* Compact 3-Column Astronomical Metrics: Diameter, Mass, Temperature */}
        <div className="grid grid-cols-3 gap-1 sm:gap-1.5 pt-1 sm:pt-1.5 border-t border-cyan-500/15 text-center font-mono">
          <div className="p-1 sm:p-1.5 rounded-lg bg-[#020510]/80 border border-cyan-500/20">
            <span className="text-[7px] sm:text-[8.5px] text-slate-400 block uppercase font-sans font-semibold tracking-wider truncate">Diam</span>
            <span className="text-cyan-300 font-bold text-[9.5px] sm:text-[11px] block truncate" title={scaleObj.metricSi}>
              {scaleObj.metricSi}
            </span>
          </div>

          <div className="p-1 sm:p-1.5 rounded-lg bg-[#020510]/80 border border-cyan-500/20">
            <span className="text-[7px] sm:text-[8.5px] text-slate-400 block uppercase font-sans font-semibold tracking-wider truncate">Mass</span>
            <span className="text-blue-300 font-bold text-[9.5px] sm:text-[11px] block truncate" title={`${star.massSolar} M☉`}>
              {star.massSolar.toFixed(star.massSolar < 1 ? 2 : 1)} <span className="text-[7.5px] sm:text-[9px] text-slate-400 font-normal">M☉</span>
            </span>
          </div>

          <div className="p-1 sm:p-1.5 rounded-lg bg-[#020510]/80 border border-cyan-500/20">
            <span className="text-[7px] sm:text-[8.5px] text-slate-400 block uppercase font-sans font-semibold tracking-wider truncate">Temp</span>
            <span className="text-amber-300 font-bold text-[9.5px] sm:text-[11px] block truncate" title={`${star.temperature.toLocaleString()} K`}>
              {star.temperature >= 1000 ? `${(star.temperature / 1000).toFixed(star.temperature >= 10000 ? 0 : 1)}k` : star.temperature} <span className="text-[7.5px] sm:text-[9px] text-slate-400 font-normal">K</span>
            </span>
          </div>
        </div>
      </div>

      {/* Explore Dossier Button */}
      <button
        id={`btn-card-details-${star.id}`}
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails(star);
        }}
        className="w-full flex items-center justify-center gap-1 sm:gap-1.5 py-1 sm:py-1.5 px-2 sm:px-2.5 rounded-lg bg-cyan-950/50 group-hover:bg-cyan-900/80 text-cyan-300 group-hover:text-white border border-cyan-500/35 group-hover:border-cyan-400 text-[10px] sm:text-xs font-semibold font-mono transition-all cursor-pointer shadow-sm active:scale-95"
      >
        <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
        <span>Open Dossier</span>
      </button>
    </div>
  );
};
