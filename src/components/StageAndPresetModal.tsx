import React, { useState, useMemo, useEffect } from 'react';
import { StarData, PresetComparison } from '../types';
import { STARS_CATALOG, SPECTRAL_CLASSES_META } from '../data/stars';
import { formatPhysicalDiameter } from '../utils/formatters';
import {
  X,
  Sparkles,
  Sliders,
  CheckSquare,
  Square,
  Search,
  Pencil,
  Plus,
  Check,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { RunningText } from './RunningText';

interface StageAndPresetModalProps {
  isOpen: boolean;
  mode: 'stage' | 'preset';
  onClose: () => void;
  // Current active stars on the 3D stage
  currentStageStars: StarData[];
  // If editing an existing preset
  presetToEdit?: PresetComparison | null;
  // Callback when saving 3D stage selection
  onSaveStage?: (starIds: string[]) => void;
  // Callback when saving/updating a preset
  onSavePreset?: (presetData: {
    id?: string;
    title: string;
    desc: string;
    starIds: string[];
  }) => void;
  // Callback when deleting a preset
  onDeletePreset?: (presetId: string) => void;
}

export const StageAndPresetModal: React.FC<StageAndPresetModalProps> = ({
  isOpen,
  mode,
  onClose,
  currentStageStars,
  presetToEdit,
  onSaveStage,
  onSavePreset,
  onDeletePreset,
}) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedStarIds, setSelectedStarIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');

  // Synchronize state on open or when presetToEdit / mode changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'stage') {
        setSelectedStarIds(currentStageStars.map((s) => s.id));
        setTitle('');
        setDesc('');
      } else {
        // Preset mode
        if (presetToEdit) {
          setTitle(presetToEdit.title);
          setDesc(presetToEdit.desc);
          setSelectedStarIds(presetToEdit.starIds);
        } else {
          setTitle('');
          setDesc('');
          setSelectedStarIds(currentStageStars.map((s) => s.id));
        }
      }
      setSearchQuery('');
      setSelectedClass('ALL');
    }
  }, [isOpen, mode, presetToEdit, currentStageStars]);

  // Filter stars by search query and spectral class
  const filteredCatalog = useMemo(() => {
    return STARS_CATALOG.filter((star) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        star.name.toLowerCase().includes(q) ||
        star.alternateNames.some((alt) => alt.toLowerCase().includes(q));

      const matchesClass =
        selectedClass === 'ALL' || star.spectralClass === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [searchQuery, selectedClass]);

  // Separate into Checked Stars (listed first!) and Available (unchecked) Stars
  const { checkedStars, uncheckedStars } = useMemo(() => {
    const checkedSet = new Set(selectedStarIds);
    const checked: StarData[] = [];
    const unchecked: StarData[] = [];

    filteredCatalog.forEach((star) => {
      if (checkedSet.has(star.id)) {
        checked.push(star);
      } else {
        unchecked.push(star);
      }
    });

    return { checkedStars: checked, uncheckedStars: unchecked };
  }, [filteredCatalog, selectedStarIds]);

  if (!isOpen) return null;

  const handleToggleStar = (starId: string) => {
    setSelectedStarIds((prev) =>
      prev.includes(starId)
        ? prev.filter((id) => id !== starId)
        : [...prev, starId]
    );
  };

  const handleSelectAllShown = () => {
    const shownIds = filteredCatalog.map((s) => s.id);
    setSelectedStarIds((prev) => Array.from(new Set([...prev, ...shownIds])));
  };

  const handleClearSelection = () => {
    setSelectedStarIds([]);
  };

  const handleUseCurrentStage = () => {
    setSelectedStarIds(currentStageStars.map((s) => s.id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStarIds.length === 0) return;

    if (mode === 'stage') {
      if (onSaveStage) {
        onSaveStage(selectedStarIds);
      }
      onClose();
    } else {
      if (!title.trim() || !onSavePreset) return;
      onSavePreset({
        id: presetToEdit?.id,
        title: title.trim(),
        desc:
          desc.trim().slice(0, 100) ||
          `Preset lineup with ${selectedStarIds.length} celestial objects.`.slice(0, 100),
        starIds: selectedStarIds,
      });
      onClose();
    }
  };

  return (
    <div
      id="modal-stage-preset-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="modal-stage-preset"
        className="relative w-full max-w-2xl observatory-panel border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-sky-400">
              {mode === 'stage' ? (
                <Sliders className="w-5 h-5" />
              ) : presetToEdit ? (
                <Pencil className="w-5 h-5" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                {mode === 'stage'
                  ? 'Edit 3D Stage Stars'
                  : presetToEdit
                  ? `Edit Preset: ${presetToEdit.title}`
                  : 'Create Custom Preset'}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 font-mono border border-sky-500/20">
                  {selectedStarIds.length} Checked
                </span>
              </h3>
            </div>
          </div>

          <button
            id="btn-close-stage-preset-modal"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body & Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 scrollbar-thin">
            {/* Preset Title & Description (Only in Preset Mode) */}
            {mode === 'preset' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-white/5 p-3.5 rounded-xl border border-white/10">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
                    Preset Title <span className="text-sky-400">*</span>
                  </label>
                  <input
                    id="input-preset-modal-title"
                    type="text"
                    required
                    placeholder="e.g. Extreme Red Supergiants"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5 font-sans">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Description <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <span className={`text-[10px] font-mono ${desc.length >= 100 ? 'text-amber-400 font-semibold' : 'text-slate-500'}`}>
                      {desc.length}/100
                    </span>
                  </div>
                  <input
                    id="input-preset-modal-desc"
                    type="text"
                    maxLength={100}
                    placeholder="e.g. Comparative lineup of massive stars (max 100 chars)"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value.slice(0, 100))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>
            )}

            {/* Quick Actions & Stage Loader */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-300 font-mono">
                  {selectedStarIds.length} Stars Selected
                </span>
                {mode === 'preset' && currentStageStars.length > 0 && (
                  <button
                    type="button"
                    id="btn-modal-load-current-stage"
                    onClick={handleUseCurrentStage}
                    className="px-3 py-1.5 text-xs rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 transition-all cursor-pointer flex items-center gap-1.5 font-medium min-h-[36px]"
                    title="Load the stars currently active in the 3D stage"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    Load 3D Stage Stars ({currentStageStars.length})
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-modal-select-all-filtered"
                  onClick={handleSelectAllShown}
                  className="px-3 py-1.5 text-xs rounded-xl observatory-control border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all cursor-pointer font-medium min-h-[36px]"
                >
                  Select All Shown ({filteredCatalog.length})
                </button>
                <button
                  type="button"
                  id="btn-modal-clear-selection"
                  onClick={handleClearSelection}
                  className="px-3 py-1.5 text-xs rounded-xl observatory-control border border-white/10 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-all cursor-pointer font-medium min-h-[36px]"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Star Search & Spectral Class Quick Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="input-modal-search-stars"
                  type="text"
                  placeholder="Search by name, constellation, type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Spectral Class Quick Filter Bar */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full scrollbar-thin">
                <button
                  type="button"
                  onClick={() => setSelectedClass('ALL')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer min-h-[32px] ${
                    selectedClass === 'ALL'
                      ? 'bg-sky-400 text-slate-950 font-bold'
                      : 'observatory-control border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                {SPECTRAL_CLASSES_META.slice(0, 7).map((sc) => (
                  <button
                    key={sc.key}
                    type="button"
                    onClick={() => setSelectedClass(sc.key)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer min-h-[32px] ${
                      selectedClass === sc.key
                        ? 'bg-sky-400 text-slate-950 font-bold'
                        : 'observatory-control border border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sc.key}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox Star List: Checked Stars Listed First! */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {/* SECTION 1: Checked Stars Listed First */}
              <div>
                <div className="flex items-center justify-between mb-2 text-xs font-mono font-semibold text-sky-300">
                  <span className="flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-sky-400" />
                    Checked Stars ({checkedStars.length})
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    (Active on 3D Stage / Preset)
                  </span>
                </div>

                {checkedStars.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-white/10 bg-white/5 text-center text-xs text-slate-400 font-mono">
                    No stars checked yet. Check stars below to add them.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {checkedStars.map((star) => {
                      const sc = formatPhysicalDiameter(star.diameterKm, star.diameterSolar);
                      return (
                        <div
                          key={star.id}
                          id={`modal-star-checked-${star.id}`}
                          onClick={() => handleToggleStar(star.id)}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-sky-400/50 bg-sky-500/10 text-white transition-all cursor-pointer select-none hover:bg-sky-500/20 min-h-[44px]"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                            <div className="flex-shrink-0 text-sky-400">
                              <CheckSquare className="w-4 h-4 text-sky-400" />
                            </div>
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20"
                              style={{
                                backgroundColor: star.colorHex,
                              }}
                            />
                            <div className="min-w-0 flex-1 overflow-hidden">
                              <RunningText
                                text={star.name}
                                className="text-xs font-semibold text-white"
                              />
                              <div className="text-[10px] text-slate-400 truncate">
                                {star.spectralType} • {star.constellation}
                              </div>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="text-[10px] font-mono text-sky-300 font-medium">
                              {sc.metricSi}
                            </div>
                            <div className="text-[9px] font-mono text-slate-400">
                              {sc.solarFormatted}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION 2: Available (Unchecked) Stars */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between mb-2 text-xs font-mono font-semibold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Square className="w-3.5 h-3.5 text-slate-400" />
                    Available Stars in Catalog ({uncheckedStars.length})
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    Click any to check & add
                  </span>
                </div>

                {uncheckedStars.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-white/10 bg-white/5 text-center text-xs text-slate-400 font-mono">
                    {filteredCatalog.length === 0
                      ? 'No stars match your filter or search query.'
                      : 'All matching stars are already checked above.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {uncheckedStars.map((star) => {
                      const sc = formatPhysicalDiameter(star.diameterKm, star.diameterSolar);
                      return (
                        <div
                          key={star.id}
                          id={`modal-star-unchecked-${star.id}`}
                          onClick={() => handleToggleStar(star.id)}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer select-none min-h-[44px]"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                            <div className="flex-shrink-0 text-slate-500 group-hover:text-slate-300">
                              <Square className="w-4 h-4" />
                            </div>
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20"
                              style={{
                                backgroundColor: star.colorHex,
                              }}
                            />
                            <div className="min-w-0 flex-1 overflow-hidden">
                              <RunningText
                                text={star.name}
                                className="text-xs font-semibold text-slate-200"
                              />
                              <div className="text-[10px] text-slate-500 truncate">
                                {star.spectralType} • {star.constellation}
                              </div>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="text-[10px] font-mono text-slate-400">
                              {sc.metricSi}
                            </div>
                            <div className="text-[9px] font-mono text-slate-500">
                              {sc.solarFormatted}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-cancel-stage-preset"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl observatory-control border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer min-h-[44px]"
              >
                Cancel
              </button>

              {mode === 'preset' && presetToEdit && onDeletePreset && presetToEdit.id !== 'all-stars-catalog' && (
                <button
                  type="button"
                  id="btn-delete-stage-preset"
                  onClick={() => {
                    onClose();
                    onDeletePreset(presetToEdit.id);
                  }}
                  className="px-3.5 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                  title={`Delete preset: ${presetToEdit.title}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Preset</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {selectedStarIds.length === 0 && (
                <span className="text-[11px] font-mono text-rose-400">
                  Select at least 1 star
                </span>
              )}
              <button
                type="submit"
                id="btn-save-stage-preset-submit"
                disabled={
                  selectedStarIds.length === 0 ||
                  (mode === 'preset' && !title.trim())
                }
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer min-h-[44px] ${
                  selectedStarIds.length === 0 ||
                  (mode === 'preset' && !title.trim())
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-sky-400 text-slate-950 hover:bg-sky-300'
                }`}
              >
                {mode === 'stage' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Apply to 3D Stage ({selectedStarIds.length} Stars)</span>
                  </>
                ) : presetToEdit ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Update Preset ({selectedStarIds.length} Stars)</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Save Preset ({selectedStarIds.length} Stars)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
