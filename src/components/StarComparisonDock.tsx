import React from 'react';
import { StarData, PresetComparison, StageSortKey, SortDirection } from '../types';
import { PRESET_COMPARISONS } from '../data/stars';
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
  onSelectActiveStar: _onSelectActiveStar,
  activeFocusedStarId: _activeFocusedStarId,
}) => {
  return (
    <div className="w-full observatory-panel border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-white/10 pb-3.5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2 font-sans">
              3D Comparison Stage
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-sky-950/60 text-sky-300 border border-sky-400/40 font-mono">
                {selectedStars.length} Active {selectedStars.length === 1 ? 'Star' : 'Stars'}
              </span>
            </h2>
            {onOpenEditStage && (
              <button
                id="btn-edit-3d-stage"
                onClick={onOpenEditStage}
                className="px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-semibold transition-all observatory-control bg-white/5 border border-white/10 text-slate-300 hover:border-white/20 hover:text-white cursor-pointer flex items-center gap-2"
                title="Open 3D stage editor to select or remove stars"
              >
                <Sliders className="w-4 h-4 text-sky-400" />
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
                        ? 'observatory-panel bg-sky-950/60 border-sky-400 text-sky-200 shadow-sm font-semibold'
                        : 'observatory-control bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <button
                      id="btn-preset-all-stars-catalog"
                      onClick={() => onSelectPreset('all-stars-catalog')}
                      className="flex items-center gap-2 min-h-[44px] px-3.5 py-2 text-xs font-mono whitespace-nowrap cursor-pointer"
                      title={completeCatalog.desc}
                    >
                      <span>The Complete Catalog</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-sky-300 font-mono border border-white/15 ml-0.5">
                        Full Sky
                      </span>
                    </button>
                  </div>

                  <div className="w-[1px] h-6 bg-white/10 shrink-0 mx-1" />
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
                        ? 'observatory-panel bg-sky-950/60 border-sky-400 text-sky-200 shadow-sm font-semibold'
                        : 'observatory-control bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <button
                      id={`btn-preset-${preset.id}`}
                      onClick={() => onSelectPreset(preset.id)}
                      className="flex items-center gap-2 min-h-[44px] px-3.5 py-2 text-xs font-mono whitespace-nowrap cursor-pointer"
                      title={preset.desc}
                    >
                      <span>{preset.title}</span>
                      {preset.isCustom && (
                        <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-sky-300 font-mono border border-white/15 ml-1">
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
                        className="min-h-[44px] min-w-[36px] px-2 py-2 flex items-center justify-center text-slate-400 hover:text-sky-300 text-xs transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
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
                        className="min-h-[44px] min-w-[36px] pr-3 pl-1 py-2 flex items-center justify-center text-slate-400 hover:text-rose-400 text-xs font-mono transition-colors cursor-pointer"
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
            className="flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-xl text-xs font-semibold whitespace-nowrap transition-all border border-dashed border-white/20 bg-white/5 text-slate-300 hover:border-sky-400 hover:text-white cursor-pointer"
          >
            <span>+ New Preset</span>
          </button>
        )}
      </div>
    </div>
  );
};

