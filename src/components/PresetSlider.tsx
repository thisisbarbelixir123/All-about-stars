import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PresetComparison } from '../types';
import { 
  ChevronDown, 
  Check, 
  Pencil, 
  X,
  Trash2
} from 'lucide-react';
import { RunningText } from './RunningText';

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
        id="btn-preset-dropdown"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Select stellar comparison preset or browse astronomical catalog"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center justify-between gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl border font-mono text-xs shadow-lg backdrop-blur-xl transition-all cursor-pointer select-none active:scale-95 ${
          isOpen
            ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.35)]'
            : 'bg-[#040816]/95 hover:bg-[#081232] border-cyan-500/35 hover:border-cyan-400 text-slate-200 hover:text-white'
        }`}
      >
        <div className="max-w-[160px] sm:max-w-[220px] md:max-w-[280px] min-w-0 overflow-hidden">
          <RunningText
            text={activeTitle}
            className="text-[11px] sm:text-xs font-semibold text-cyan-300"
          />
        </div>

        <span className="text-[10px] text-cyan-400/80 shrink-0">
          ({activeCount})
        </span>

        <ChevronDown 
          className={`w-3.5 h-3.5 text-cyan-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-cyan-300' : ''
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
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-84 sm:w-96 max-h-[75vh] overflow-y-auto bg-[#040817]/98 border border-cyan-500/40 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.95),0_0_20px_rgba(6,182,212,0.25)] p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl font-mono text-xs scrollbar-thin"
          >
            {/* The Complete Catalog - Placed on the very top, not a preset, not editable, separated from presets */}
            {completeCatalogItem && (
              <div className="mb-2">
                <div className="flex items-center justify-between px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <span>Astronomical Catalog</span>
                  <span className="text-cyan-400 font-normal">All {completeCatalogItem.starIds.length} stars</span>
                </div>
                <button
                  id="btn-preset-option-all-stars-catalog"
                  onClick={() => {
                    onSelectPreset('all-stars-catalog');
                    setIsOpen(false);
                  }}
                  className={`group w-full flex items-center justify-between p-2 rounded-lg transition-all text-left cursor-pointer border ${
                    isCatalogActive
                      ? 'bg-cyan-500/20 border-cyan-400/80 text-cyan-200 shadow-sm'
                      : 'bg-cyan-950/20 hover:bg-cyan-500/10 border-cyan-500/30 text-slate-200'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 font-bold flex-wrap">
                      <span className={`text-xs ${isCatalogActive ? 'text-cyan-300' : 'text-slate-100 group-hover:text-white'}`}>
                        The Complete Catalog
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shrink-0 font-mono">
                        Full Sky
                      </span>
                      {isCatalogActive && <Check className="w-3.5 h-3.5 text-cyan-400 ml-auto shrink-0" />}
                    </div>
                    <p className="text-[10px] text-slate-400 break-words mt-0.5">
                      {completeCatalogItem.desc || `${completeCatalogItem.starIds.length} stars`}
                    </p>
                  </div>
                </button>
              </div>
            )}

            <div className="border-t border-cyan-500/20 my-2" />

            <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-cyan-500/20 pb-1 mb-1">
              <span>Comparison Presets</span>
              <span className="text-cyan-400 font-normal">{regularPresets.length} presets</span>
            </div>

            <div className="flex flex-col gap-1">
              {regularPresets.map((preset) => {
                const isActive = activePresetId === preset.id;

                return (
                  <div
                    key={preset.id}
                    className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 border border-cyan-400/80 text-cyan-200 shadow-sm'
                        : 'hover:bg-cyan-500/10 border border-transparent text-slate-300'
                    }`}
                  >
                    <button
                      id={`btn-preset-option-${preset.id}`}
                      onClick={() => {
                        onSelectPreset(preset.id);
                        setIsOpen(false);
                      }}
                      className="flex-1 text-left flex flex-col gap-0.5 cursor-pointer pr-2 min-w-0"
                    >
                      <div className="flex items-center gap-1.5 font-bold flex-wrap">
                        <span className={`text-xs ${isActive ? 'text-cyan-300' : 'text-slate-200'}`}>
                          {preset.title}
                        </span>
                        {preset.isCustom && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/25 text-purple-300 border border-purple-500/40 shrink-0 font-mono">
                            Custom
                          </span>
                        )}
                        {isActive && <Check className="w-3.5 h-3.5 text-cyan-400 ml-auto shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-400 break-words mt-0.5">
                        {preset.desc || `${preset.starIds.length} stars`}
                      </p>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      {onEditPreset && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                            onEditPreset(preset);
                          }}
                          title={`Edit preset: ${preset.title}`}
                          className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/20 rounded cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
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
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/20 rounded cursor-pointer transition-colors"
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
              <div className="pt-2 mt-2 border-t border-cyan-500/20 flex flex-col gap-1">
                <button
                  id="btn-dropdown-create-preset"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenCreatePreset();
                  }}
                  className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg border border-dashed border-cyan-400/50 bg-cyan-950/30 hover:bg-cyan-900/50 text-cyan-300 text-[11px] font-semibold transition-all cursor-pointer"
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
