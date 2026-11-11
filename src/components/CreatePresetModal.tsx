import React, { useState, useMemo } from 'react';
import { StarData, PresetComparison } from '../types';
import { STARS_CATALOG, SPECTRAL_CLASSES_META } from '../data/stars';
import { formatPhysicalDiameter } from '../utils/formatters';
import { X, Sparkles, Check, Search, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { RunningText } from './RunningText';

interface CreatePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePreset: (preset: Omit<PresetComparison, 'id' | 'isCustom'>) => void;
  currentSelectedStars: StarData[];
}

export const CreatePresetModal: React.FC<CreatePresetModalProps> = ({
  isOpen,
  onClose,
  onSavePreset,
  currentSelectedStars,
}) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedStarIds, setSelectedStarIds] = useState<string[]>(() =>
    currentSelectedStars.map((s) => s.id)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');

  // Reset or initialize when opened
  React.useEffect(() => {
    if (isOpen) {
      if (selectedStarIds.length === 0 && currentSelectedStars.length > 0) {
        setSelectedStarIds(currentSelectedStars.map((s) => s.id));
      }
    }
  }, [isOpen, currentSelectedStars]);

  const filteredStars = useMemo(() => {
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

  if (!isOpen) return null;

  const handleToggleStar = (starId: string) => {
    setSelectedStarIds((prev) =>
      prev.includes(starId) ? prev.filter((id) => id !== starId) : [...prev, starId]
    );
  };

  const handleUseCurrentStage = () => {
    setSelectedStarIds(currentSelectedStars.map((s) => s.id));
  };

  const handleSelectAllFiltered = () => {
    const filteredIds = filteredStars.map((s) => s.id);
    setSelectedStarIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
  };

  const handleClearSelection = () => {
    setSelectedStarIds([]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedStarIds.length === 0) return;

    onSavePreset({
      title: title.trim(),
      desc:
        desc.trim().slice(0, 100) ||
        `Custom comparison with ${selectedStarIds.length} celestial objects.`.slice(0, 100),
      starIds: selectedStarIds,
    });

    setTitle('');
    setDesc('');
    onClose();
  };

  return (
    <div
      id="modal-create-preset-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="modal-create-preset"
        className="relative w-full max-w-2xl observatory-panel border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                Create Custom Preset
              </h3>
            </div>
          </div>

          <button
            id="btn-close-create-preset-modal"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 scrollbar-thin">
            {/* Title & Description Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-3.5 rounded-xl border border-white/10">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
                  Preset Title <span className="text-sky-400">*</span>
                </label>
                <input
                  id="input-preset-title"
                  type="text"
                  required
                  placeholder="e.g. My Favorite Supergiants"
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
                  id="input-preset-desc"
                  type="text"
                  maxLength={100}
                  placeholder="e.g. Comparative lineup of massive O-stars (max 100 chars)"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value.slice(0, 100))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-300 font-mono">
                  {selectedStarIds.length} Stars Selected
                </span>
                {currentSelectedStars.length > 0 && (
                  <button
                    type="button"
                    id="btn-use-current-stage-stars"
                    onClick={handleUseCurrentStage}
                    className="px-3 py-1.5 text-xs rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 transition-all cursor-pointer flex items-center gap-1.5 font-medium min-h-[36px]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    Load Active 3D Stage ({currentSelectedStars.length})
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-select-all-filtered"
                  onClick={handleSelectAllFiltered}
                  className="px-3 py-1.5 text-xs rounded-xl observatory-control border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all cursor-pointer font-medium min-h-[36px]"
                >
                  Select All Shown
                </button>
                <button
                  type="button"
                  id="btn-clear-preset-selection"
                  onClick={handleClearSelection}
                  className="px-3 py-1.5 text-xs rounded-xl observatory-control border border-white/10 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-all cursor-pointer font-medium min-h-[36px]"
                >
                  Clear Selection
                </button>
              </div>
            </div>

            {/* Star Search and Spectral Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="input-preset-search-stars"
                  type="text"
                  placeholder="Search by star name, constellation, spectral type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Spectral Class Quick Filter */}
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

            {/* Stars Checkbox Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
              {filteredStars.map((star) => {
                const isSelected = selectedStarIds.includes(star.id);
                const sc = formatPhysicalDiameter(star.diameterKm, star.diameterSolar);

                return (
                  <div
                    key={star.id}
                    id={`preset-star-item-${star.id}`}
                    onClick={() => handleToggleStar(star.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none min-h-[44px] ${
                      isSelected
                        ? 'bg-sky-500/10 border-sky-400/50 text-white'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                      <div className="flex-shrink-0 text-sky-400">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-sky-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500" />
                        )}
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
                          className="text-xs font-semibold"
                        />
                        <div className="text-[10px] text-slate-400 truncate">
                          {star.spectralType} • {star.constellation}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-[10px] font-mono text-sky-300">
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
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
            <button
              type="button"
              id="btn-cancel-create-preset"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl observatory-control border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer min-h-[44px]"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="btn-save-custom-preset"
              disabled={!title.trim() || selectedStarIds.length === 0}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer min-h-[44px] ${
                !title.trim() || selectedStarIds.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-sky-400 text-slate-950 hover:bg-sky-300'
              }`}
            >
              <Plus className="w-4 h-4" />
              Save Preset ({selectedStarIds.length} Stars)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
