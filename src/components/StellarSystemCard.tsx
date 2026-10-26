import React from 'react';
import { MultipleStarSystemData, getEffectiveStarCount } from '../data/multipleStarSystemsData';
import { Orbit } from 'lucide-react';
import { RunningText } from './RunningText';

interface StellarSystemCardProps {
  system: MultipleStarSystemData;
  onViewDetails: (system: MultipleStarSystemData) => void;
  isCompact?: boolean;
}

export const StellarSystemCard: React.FC<StellarSystemCardProps> = ({
  system,
  onViewDetails,
  isCompact = false,
}) => {
  const effCount = getEffectiveStarCount(system);
  const isContact = system.hasContactBinary || system.systemType === 'Overcontact Binary';
  const primaryOrbit = system.orbits[0];

  // Clean primary display name
  const displayName = system.name.includes(' (') ? system.name.split(' (')[0] : system.name;
  const secondaryName = system.name.includes(' (')
    ? system.name.substring(system.name.indexOf('(') + 1, system.name.lastIndexOf(')'))
    : system.constellation;

  // Format primary separation
  const separationText = primaryOrbit
    ? primaryOrbit.semiMajorAxisAU >= 1000
      ? `${(primaryOrbit.semiMajorAxisAU / 1000).toFixed(primaryOrbit.semiMajorAxisAU >= 10000 ? 0 : 1)}k AU`
      : primaryOrbit.semiMajorAxisAU < 0.1
      ? `${primaryOrbit.semiMajorAxisAU} AU`
      : `${primaryOrbit.semiMajorAxisAU.toFixed(primaryOrbit.semiMajorAxisAU < 10 ? 2 : 1)} AU`
    : '—';

  // Short system type badge label
  const shortType = system.systemType
    .replace(' Hierarchy', '')
    .replace(' Binary', '')
    .replace(' System', '');

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onViewDetails(system)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails(system);
        }
      }}
      className="group relative bg-[#060a1a]/95 hover:bg-[#091129] border border-cyan-500/30 hover:border-cyan-400 rounded-xl p-2.5 sm:p-3 md:p-3.5 transition-all duration-200 shadow-sm hover:shadow-[0_6px_20px_rgba(6,182,212,0.28)] hover:-translate-y-0.5 active:translate-y-0 flex flex-col justify-between gap-2 sm:gap-2.5 backdrop-blur-xl cursor-pointer select-none overflow-hidden min-h-[125px] sm:min-h-[135px] md:min-h-[148px] w-full min-w-0"
      title={`Open ${system.name} 3D Dossier`}
    >
      {/* Top Section: System Name & Spectral Dots */}
      <div className="flex items-center justify-between gap-1.5 min-w-0 w-full">
        <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
          {/* Spectral Dots cluster for member stars */}
          <div className="flex items-center -space-x-1 shrink-0 py-0.5">
            {system.components.slice(0, 3).map((c, idx) => (
              <span
                key={c.id || idx}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full shrink-0 transition-transform group-hover:scale-110 ${
                  c.colorHex === '#000000' || c.isBlackHole ? 'border border-slate-400 ring-1 ring-slate-600' : 'border border-black/80'
                }`}
                style={{
                  backgroundColor: c.colorHex,
                  boxShadow: c.colorHex === '#000000' ? '0 0 3px rgba(148, 163, 184, 0.4)' : `0 0 4px ${c.colorHex}`,
                  zIndex: 10 - idx,
                }}
                title={`${c.name} (${c.spectralType})`}
              />
            ))}
            {system.components.length > 3 && (
              <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full bg-cyan-950 border border-cyan-500/50 text-[8px] md:text-[9px] text-cyan-300 flex items-center justify-center font-mono font-bold shrink-0">
                +{system.components.length - 3}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1 overflow-hidden">
            <RunningText
              text={displayName}
              className="text-xs sm:text-sm md:text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-sans truncate block leading-tight"
              title={system.name}
            />
          </div>
        </div>

        <div className="max-w-[80px] shrink-0 overflow-hidden">
          <RunningText
            text={shortType}
            className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[8px] sm:text-[9px] md:text-[10px] font-mono font-bold block"
          />
        </div>
      </div>

      {/* Sub-header: Member star names preview */}
      <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] md:text-xs font-mono text-slate-400 leading-none min-w-0 w-full overflow-hidden">
        <span className="text-slate-500 shrink-0 font-sans">Stars:</span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <RunningText
            text={system.components.map((c) => c.name.split(' (')[0]).join(' + ')}
            className="text-slate-300 font-sans block"
            title={system.components.map((c) => c.name).join(' + ')}
          />
        </div>
      </div>

      {/* 3-Column Astronomical Metrics Strip */}
      <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-cyan-500/20 text-center font-mono w-full min-w-0">
        <div className="p-1 rounded-lg bg-[#020510]/85 border border-cyan-500/15 min-w-0 overflow-hidden">
          <span className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] text-slate-400 block uppercase font-sans truncate font-medium">Stars</span>
          <RunningText
            text={isContact ? '2 Lobes' : String(effCount)}
            className="text-cyan-300 font-bold text-[9px] sm:text-[10px] md:text-xs block"
          />
        </div>

        <div className="p-1 rounded-lg bg-[#020510]/85 border border-cyan-500/15 min-w-0 overflow-hidden">
          <span className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] text-slate-400 block uppercase font-sans truncate font-medium">Sep</span>
          <RunningText
            text={separationText}
            className="text-blue-300 font-bold text-[9px] sm:text-[10px] md:text-xs block"
            title={`Primary semi-major axis: ${separationText}`}
          />
        </div>

        <div className="p-1 rounded-lg bg-[#020510]/85 border border-cyan-500/15 min-w-0 overflow-hidden">
          <span className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] text-slate-400 block uppercase font-sans truncate font-medium">Dist</span>
          <RunningText
            text={`${system.distanceLy} ly`}
            className="text-amber-300 font-bold text-[9px] sm:text-[10px] md:text-xs block"
          />
        </div>
      </div>

      {/* Dossier Action Button */}
      <button
        id={`btn-system-details-${system.id}`}
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails(system);
        }}
        className="w-full flex items-center justify-center gap-1.5 py-1 sm:py-1.5 px-2 rounded-lg bg-cyan-950/70 group-hover:bg-cyan-900 text-cyan-300 group-hover:text-white border border-cyan-500/40 group-hover:border-cyan-400 text-[10px] sm:text-xs font-semibold font-mono transition-all cursor-pointer shadow-xs active:scale-95 truncate overflow-hidden"
      >
        <Orbit className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
        <span className="truncate">View System Dossier</span>
      </button>
    </div>
  );
};
