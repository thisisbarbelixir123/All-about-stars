import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Compass,
  Layers,
  Flame,
  Radio,
  Gamepad2,
  Volume2,
  X,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { STARS_CATALOG } from '../data/stars';
import { StarData } from '../types';
import { spaceAudio } from '../utils/spaceAudioEngine';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStar: (star: StarData) => void;
  onNavigateTab: (tabId: string) => void;
  onToggleSound: () => void;
}

interface PaletteAction {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectStar,
  onNavigateTab,
  onToggleSound,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // System quick actions
  const quickActions: PaletteAction[] = useMemo(
    () => [
      {
        id: 'action-home',
        title: 'Go to Home / Overview',
        category: 'Navigation',
        shortcut: '1',
        icon: <Compass className="w-4 h-4 text-cyan-400" />,
        action: () => {
          onNavigateTab('overview');
          onClose();
        },
      },
      {
        id: 'action-catalog',
        title: 'Open 3D Catalog Explorer',
        category: 'Navigation',
        shortcut: '2',
        icon: <Layers className="w-4 h-4 text-blue-400" />,
        action: () => {
          onNavigateTab('explorer');
          onClose();
        },
      },
      {
        id: 'action-hr-diagram',
        title: 'Open Hertzsprung–Russell Diagram',
        category: 'Astrophysics',
        shortcut: '3',
        icon: <Sparkles className="w-4 h-4 text-amber-400" />,
        action: () => {
          onNavigateTab('hr-diagram');
          onClose();
        },
      },
      {
        id: 'action-life-cycles',
        title: 'Explore Stellar Life Cycles & Evolution',
        category: 'Astrophysics',
        shortcut: '4',
        icon: <Flame className="w-4 h-4 text-orange-400" />,
        action: () => {
          onNavigateTab('lifecycle');
          onClose();
        },
      },
      {
        id: 'action-remnants',
        title: 'Inspect Stellar Remnants & Black Holes',
        category: 'Astrophysics',
        shortcut: '5',
        icon: <Radio className="w-4 h-4 text-purple-400" />,
        action: () => {
          onNavigateTab('remnants');
          onClose();
        },
      },
      {
        id: 'action-game',
        title: 'Play Stellar Suika Fusion Game',
        category: 'Mini-Game',
        icon: <Gamepad2 className="w-4 h-4 text-emerald-400" />,
        action: () => {
          onNavigateTab('game');
          onClose();
        },
      },
      {
        id: 'action-sound',
        title: 'Toggle Ambient Cosmic Audio',
        category: 'Audio',
        shortcut: 'M',
        icon: <Volume2 className="w-4 h-4 text-cyan-300" />,
        action: () => {
          onToggleSound();
          onClose();
        },
      },
    ],
    [onNavigateTab, onClose, onToggleSound]
  );

  // Filter stars matching query
  const matchingStars = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return STARS_CATALOG.filter((star) => {
      return (
        star.name.toLowerCase().includes(q) ||
        (star.bayerDesignation && star.bayerDesignation.toLowerCase().includes(q)) ||
        (star.flamsteedDesignation && star.flamsteedDesignation.toLowerCase().includes(q)) ||
        (star.gouldDesignation && star.gouldDesignation.toLowerCase().includes(q)) ||
        star.constellation.toLowerCase().includes(q) ||
        star.spectralClass.toLowerCase().includes(q) ||
        star.spectralType.toLowerCase().includes(q) ||
        star.stellarStage.toLowerCase().includes(q) ||
        star.alternateNames?.some((alt) => alt.toLowerCase().includes(q))
      );
    }).slice(0, 15);
  }, [query]);

  // Filter actions matching query
  const matchingActions = useMemo(() => {
    if (!query.trim()) return quickActions;
    const q = query.toLowerCase().trim();
    return quickActions.filter(
      (a) => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
    );
  }, [query, quickActions]);

  // Combined item list for keyboard navigation
  const allItems = useMemo(() => {
    return [
      ...matchingActions.map((a) => ({ type: 'action' as const, data: a })),
      ...matchingStars.map((s) => ({ type: 'star' as const, data: s })),
    ];
  }, [matchingActions, matchingStars]);

  // Handle arrow key and enter selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (allItems.length > 0 ? (prev + 1) % allItems.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (allItems.length > 0 ? (prev - 1 + allItems.length) % allItems.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (allItems[selectedIndex]) {
          const item = allItems[selectedIndex];
          if (item.type === 'action') {
            item.data.action();
          } else {
            spaceAudio.playCelestialChime(item.data.spectralClass[0]);
            onSelectStar(item.data);
            onClose();
          }
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, allItems, onSelectStar, onClose]);

  // Scroll active item into view
  useEffect(() => {
    const activeEl = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl rounded-2xl bg-[#030712] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col max-h-[80vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-cyan-500/20 bg-slate-900/60">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search all 557+ stars, constellations, or commands..."
            className="w-full bg-transparent border-0 text-sm sm:text-base font-sans text-white placeholder:text-slate-500 focus:outline-none focus:ring-0"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono text-[10px]">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 divide-y divide-slate-800/40 divide-dashed space-y-1">
          {/* Actions Section */}
          {matchingActions.length > 0 && (
            <div className="pb-1.5">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400/80 font-bold">
                Quick Actions
              </div>
              {matchingActions.map((action) => {
                const globalIdx = allItems.findIndex((it) => it.type === 'action' && it.data.id === action.id);
                const isSelected = selectedIndex === globalIdx;
                return (
                  <button
                    key={action.id}
                    type="button"
                    data-index={globalIdx}
                    onClick={() => action.action()}
                    onMouseEnter={() => setSelectedIndex(globalIdx)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/40 border border-cyan-500/40 text-white'
                        : 'text-slate-300 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-slate-850 border border-slate-700/60 shrink-0">
                        {action.icon}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold">{action.title}</div>
                        <div className="text-[10px] font-mono text-slate-500">{action.category}</div>
                      </div>
                    </div>
                    {action.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-400 font-mono text-[10px]">
                        {action.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Stars Section */}
          {matchingStars.length > 0 && (
            <div className="pt-1.5">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400/80 font-bold">
                Stars ({matchingStars.length})
              </div>
              {matchingStars.map((star) => {
                const globalIdx = allItems.findIndex((it) => it.type === 'star' && it.data.id === star.id);
                const isSelected = selectedIndex === globalIdx;
                return (
                  <button
                    key={star.id}
                    type="button"
                    data-index={globalIdx}
                    onClick={() => {
                      spaceAudio.playCelestialChime(star.spectralClass[0]);
                      onSelectStar(star);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(globalIdx)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/40 border border-cyan-500/40 text-white'
                        : 'text-slate-300 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: star.color }} />
                      <div className="min-w-0 truncate">
                        <div className="text-xs sm:text-sm font-bold truncate flex items-center gap-2">
                          <span>{star.name}</span>
                          <span className="text-[10px] font-mono font-normal text-slate-400">
                            {star.constellation}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 truncate">
                          Class {star.spectralClass} • {star.radiusSolar} R☉ • {star.temperature} K
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {allItems.length === 0 && (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              No celestial bodies or actions found matching "{query}".
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.2 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.2 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.2 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">ESC</kbd>
              Close
            </span>
          </div>
          <div className="text-[10px] text-cyan-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            Quick Command
          </div>
        </div>
      </div>
    </div>
  );
};
