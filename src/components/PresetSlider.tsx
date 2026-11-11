import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PresetComparison } from '../types';
import { 
  ChevronDown, 
  Check, 
  Pencil, 
  X,
  Trash2
} from 'lucide-react';

interface PresetSliderProps {
  presets: PresetComparison[];
  activePresetId: string | null;
  onSelectPreset: (presetId: string) => void;
  onOpenCreatePreset?: () => void;
  onEditPreset?: (preset: PresetComparison) => void;
  onDeletePreset?: (presetId: string) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const PresetSlider: React.FC<PresetSliderProps> = ({
  presets,
  activePresetId,
  onSelectPreset,
  onOpenCreatePreset,
  onEditPreset,
  onDeletePreset,
  isOpen: controlledIsOpen,
  onOpenChange,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setIsOpen = useCallback((valueOrFn: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof valueOrFn === 'function' ? valueOrFn(isOpen) : valueOrFn;
    if (isControlled) {
      onOpenChange?.(nextVal);
    } else {
      setInternalIsOpen(nextVal);
    }
  }, [isControlled, isOpen, onOpenChange]);

  // Close dropdown on click or touch outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // Active preset details
  const activePreset = presets.find((p) => p.id === activePresetId);
  const isCatalog = activePresetId === 'all-stars-catalog';
  const activeTitle = isCatalog ? 'The Complete Catalog' : (activePreset ? activePreset.title : 'Custom Comparison');
  const completeCatalogObj = presets.find((p) => p.id === 'all-stars-catalog');
  const activeCount = isCatalog ? (completeCatalogObj ? completeCatalogObj.starIds.length : 0) : (activePreset ? activePreset.starIds.length : 0);

  return (
    <div 
      id="preset-slider-container"
      ref={dropdownRef}
      className="relative pointer-events-auto select-none"
    >
      {/* Center Preset Dropdown Button (matching mobile layout) */}
      <button
        type="button"
        id="btn-preset-dropdown"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Select stellar comparison preset or browse astronomical catalog"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`min-h-[44px] flex items-center justify-between gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl border font-mono text-xs transition-all cursor-pointer select-none active:scale-95 ${
          isOpen
            ? 'observatory-control border-sky-400/60 bg-sky-500/15 text-sky-200'
            : 'observatory-control border-white/10 hover:border-white/25 text-slate-200 hover:text-white'
        }`}
      >
        <span className="text-[11px] sm:text-xs font-semibold text-sky-300 max-w-[160px] sm:max-w-[220px] md:max-w-[280px] truncate">
          {activeTitle}
        </span>

        <span className="text-[10px] text-sky-400/80 shrink-0">
          ({activeCount})
        </span>

        <ChevronDown 
          className={`w-3.5 h-3.5 text-sky-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-sky-300' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (() => {
        const completeCatalogItem = presets.find((p) => p.id === 'all-stars-catalog');
        const regularPresets = presets.filter((p) => p.id !== 'all-stars-catalog');
        const isCatalogActive = activePresetId === 'all-stars-catalog';

        return (
          <div
            id="menu-preset-dropdown-popover"
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-84 sm:w-96 max-h-[75vh] overflow-y-auto observatory-panel border border-white/10 rounded-xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 font-mono text-xs scrollbar-thin"
          >
            {/* The Complete Catalog - Placed on the very top, not a preset, not editable, separated from presets */}
            {completeCatalogItem && (
              <div className="mb-2">
                <div className="flex items-center justify-between px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <span>Astronomical Catalog</span>
                  <span className="text-sky-400 font-normal">All {completeCatalogItem.starIds.length} stars</span>
                </div>
                <button
                  type="button"
                  id="btn-preset-option-all-stars-catalog"
                  onClick={() => {
                    onSelectPreset('all-stars-catalog');
                    setIsOpen(false);
                  }}
                  className={`min-h-[44px] group w-full flex items-center justify-between p-2 rounded-lg transition-all text-left cursor-pointer border ${
                    isCatalogActive
                      ? 'bg-sky-500/15 border-sky-400/60 text-white'
                      : 'observatory-control border-white/10 hover:border-white/20 text-slate-200'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 font-bold flex-wrap">
                      <span className={`text-xs ${isCatalogActive ? 'text-sky-300' : 'text-slate-100 group-hover:text-white'}`}>
                        The Complete Catalog
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-sky-300 border border-white/15 shrink-0 font-mono">
                        Full Sky
                      </span>
                      {isCatalogActive && <Check className="w-3.5 h-3.5 text-sky-400 ml-auto shrink-0" />}
                    </div>
                    <p className="text-[10px] text-slate-400 break-words mt-0.5">
                      {completeCatalogItem.desc || `${completeCatalogItem.starIds.length} stars`}
                    </p>
                  </div>
                </button>
              </div>
            )}

            <div className="border-t border-white/10 my-2" />

            <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10 pb-1 mb-1">
              <span>Comparison Presets</span>
              <span className="text-sky-400 font-normal">{regularPresets.length} presets</span>
            </div>

            <div className="flex flex-col gap-1">
              {regularPresets.map((preset) => {
                const isActive = activePresetId === preset.id;

                return (
                  <div
                    key={preset.id}
                    className={`flex items-center justify-between p-1.5 rounded-lg transition-all border ${
                      isActive
                        ? 'bg-sky-500/15 border-sky-400/60 text-white'
                        : 'hover:bg-white/5 border-transparent text-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      id={`btn-preset-option-${preset.id}`}
                      onClick={() => {
                        onSelectPreset(preset.id);
                        setIsOpen(false);
                      }}
                      className="min-h-[44px] flex-1 text-left flex flex-col justify-center gap-0.5 cursor-pointer px-1.5 py-1 min-w-0"
                    >
                      <div className="flex items-center gap-1.5 font-bold flex-wrap">
                        <span className={`text-xs ${isActive ? 'text-sky-300' : 'text-slate-200'}`}>
                          {preset.title}
                        </span>
                        {preset.isCustom && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/35 shrink-0 font-mono">
                            Custom
                          </span>
                        )}
                        {isActive && <Check className="w-3.5 h-3.5 text-sky-400 ml-auto shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-400 break-words mt-0.5">
                        {preset.desc || `${preset.starIds.length} stars`}
                      </p>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      {onEditPreset && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                            onEditPreset(preset);
                          }}
                          title={`Edit preset: ${preset.title}`}
                          aria-label={`Edit preset: ${preset.title}`}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-sky-300 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {preset.id !== 'all-stars-catalog' && onDeletePreset && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePreset(preset.id);
                          }}
                          title={`Delete preset: ${preset.title}`}
                          aria-label={`Delete preset: ${preset.title}`}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions: ONLY Create New Preset (no redundant buttons) */}
            {onOpenCreatePreset && (
              <div className="pt-2 mt-2 border-t border-white/10 flex flex-col gap-1">
                <button
                  type="button"
                  id="btn-dropdown-create-preset"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenCreatePreset();
                  }}
                  className="min-h-[44px] flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-dashed border-white/20 observatory-control hover:border-sky-400/50 text-sky-300 text-[11px] font-semibold transition-all cursor-pointer"
                >
                  <span>+ Create New Preset...</span>
                </button>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};
