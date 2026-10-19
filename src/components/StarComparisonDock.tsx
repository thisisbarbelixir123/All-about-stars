import React from 'react';
import { StarData, PresetComparison, StageSortKey, SortDirection } from '../types';
import { PRESET_COMPARISONS } from '../data/stars';
import { formatPhysicalDiameter } from '../utils/formatters';
import {
  Sliders,
  Pencil,
} from 'lucide-react';

interface StarComparisonDockProps {
  selectedStars: StarData[];
  onAddStar?: (star: StarData) => void;
  onRemoveStar?: (starId: string) => void;
  onSelectPreset: (presetId: string) => void;
  activePresetId: string | null;
  presets?: PresetComparison[];
  onOpenCreatePreset?: () => void;
  onEditPreset?: (preset: PresetComparison) => void;
  onOpenEditStage?: () => void;
  onDeletePreset?: (presetId: string) => void;
  onSelectActiveStar: (star: StarData | null) => void;
  activeFocusedStarId: string | null;
  scaleMode?: 'true-linear' | 'proportional';
  onToggleScaleMode?: (mode: 'true-linear' | 'proportional') => void;
  sortKey?: StageSortKey;
  sortDirection?: SortDirection;
  onSortChange?: (key: StageSortKey) => void;
  onToggleSortDirection?: () => void;
}

export const StarComparisonDock: React.FC<StarComparisonDockProps> = ({
  selectedStars,
  onSelectPreset,
  activePresetId,
  presets = PRESET_COMPARISONS,
  onOpenCreatePreset,
  onEditPreset,
  onOpenEditStage,
  onDeletePreset,
  onSelectActiveStar,
  activeFocusedStarId,
}) => {
  return (
    <div className="w-full bg-[#060a1a]/90 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl p-4 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col gap-3.5 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-cyan-500/15 pb-3.5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2 font-sans">
              3D Comparison Stage
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 font-mono shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                {selectedStars.length} Active {selectedStars.length === 1 ? 'Star' : 'Stars'}
              </span>
            </h2>
            {onOpenEditStage && (
              <button
                id="btn-edit-3d-stage"
                onClick={onOpenEditStage}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold transition-all bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-400/60 text-cyan-300 hover:border-cyan-300 hover:text-white cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                title="Open 3D stage editor to select or remove stars"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Edit 3D stage...</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preset Quick-Buttons & Preset Editing */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {(() => {
          const completeCatalog = presets.find((p) => p.id === 'all-stars-catalog');
          const regularPresets = presets.filter((p) => p.id !== 'all-stars-catalog');
          const isCatalogActive = activePresetId === 'all-stars-catalog';

          return (
            <>
              {/* The Complete Catalog - Not a preset, not editable, separated */}
              {completeCatalog && (
                <>
                  <div
                    className={`flex items-center rounded-xl border transition-all ${
                      isCatalogActive
                        ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-semibold'
                        : 'bg-[#040816]/70 border-cyan-500/20 text-slate-300 hover:border-cyan-500/40 hover:bg-[#0c142b]'
                    }`}
                  >
                    <button
                      id="btn-preset-all-stars-catalog"
                      onClick={() => onSelectPreset('all-stars-catalog')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs whitespace-nowrap cursor-pointer"
                      title={completeCatalog.desc}
                    >
                      <span>The Complete Catalog</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30 ml-0.5">
                        Full Sky
                      </span>
                    </button>
                  </div>

                  <div className="w-[1px] h-5 bg-cyan-500/30 shrink-0 mx-0.5" />
                </>
              )}

              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap font-mono">
                Presets:
              </span>

              {regularPresets.map((preset) => {
                const isActive = activePresetId === preset.id;
                return (
                  <div
                    key={preset.id}
                    className={`flex items-center rounded-xl border transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-semibold'
                        : 'bg-[#040816]/70 border-cyan-500/20 text-slate-300 hover:border-cyan-500/40 hover:bg-[#0c142b]'
                    }`}
                  >
                    <button
                      id={`btn-preset-${preset.id}`}
                      onClick={() => onSelectPreset(preset.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs whitespace-nowrap cursor-pointer"
                      title={preset.desc}
                    >
                      <span>{preset.title}</span>
                      {preset.isCustom && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30 ml-1">
                          Custom
                        </span>
                      )}
                    </button>

                    {/* Edit Preset Button */}
                    {onEditPreset && (
                      <button
                        id={`btn-edit-preset-${preset.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditPreset(preset);
                        }}
                        title={`Edit Preset: ${preset.title}`}
                        className="px-1.5 py-1.5 text-slate-400 hover:text-cyan-300 text-xs transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    )}

                    {preset.id !== 'all-stars-catalog' && onDeletePreset && (
                      <button
                        id={`btn-delete-preset-${preset.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePreset(preset.id);
                        }}
                        title={`Delete preset: ${preset.title}`}
                        className="pr-2.5 pl-1 py-1.5 text-slate-500 hover:text-rose-400 text-xs font-mono transition-colors cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })}
            </>
          );
        })()}

        {onOpenCreatePreset && (
          <button
            id="btn-open-create-preset-dock"
            onClick={onOpenCreatePreset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border border-dashed border-cyan-400/60 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)] cursor-pointer"
          >
            <span>+ New Preset</span>
          </button>
        )}
      </div>
    </div>
  );
};

