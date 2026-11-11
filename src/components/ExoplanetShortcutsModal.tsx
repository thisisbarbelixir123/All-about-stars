import React, { useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

export interface ExoplanetShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  action: string;
  keys: string;
  highlight?: boolean;
}

interface ShortcutSection {
  title: string;
  shortcuts: ShortcutItem[];
}

const SHORTCUT_SECTIONS: ShortcutSection[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { action: 'Step Prev / Next', keys: '← / → or [ / ]' },
      { action: 'First / Last World', keys: '1 / 9' },
      { action: 'Unfocus Object', keys: 'U', highlight: true },
    ],
  },
  {
    title: 'Camera & Stage',
    shortcuts: [
      { action: 'Zoom In / Out', keys: '+ / −' },
      { action: 'Reset View', keys: 'R' },
      { action: 'Fit All', keys: 'A' },
      { action: 'Toggle Fullscreen', keys: 'F' },
      { action: 'Spiral / Linear Layout', keys: 'L' },
    ],
  },
  {
    title: 'Tour & Scene',
    shortcuts: [
      { action: 'Toggle Tour', keys: 'T' },
      { action: 'Tour Pace', keys: 'P' },
      { action: 'Axial Spin', keys: 'S' },
      { action: 'Wireframe', keys: 'W', highlight: true },
      { action: 'Floor Grid', keys: 'G' },
    ],
  },
  {
    title: 'Search & Controls',
    shortcuts: [
      { action: 'Search Worlds', keys: 'B' },
      { action: 'Hide Controls', keys: 'H' },
    ],
  },
];

export const ExoplanetShortcutsModal: React.FC<ExoplanetShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="stage-shortcuts-title"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="observatory-panel border-white/10 rounded-2xl max-w-lg w-full p-6 text-slate-100 flex flex-col gap-4 pointer-events-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
              <Keyboard className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="stage-shortcuts-title" className="text-base font-bold text-white font-sans tracking-tight">
                3D Stage Shortcuts
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Controls for navigating exoplanets and Solar System worlds
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close shortcuts dialog"
            onClick={onClose}
            className="observatory-control min-w-11 min-h-11 rounded-xl inline-flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Shortcut Groups Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
          {SHORTCUT_SECTIONS.map((section) => (
            <div
              key={section.title}
              className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/10"
            >
              <div className="text-[11px] uppercase tracking-wider text-sky-400 font-semibold font-sans mb-1">
                {section.title}
              </div>
              {section.shortcuts.map((item) => (
                <div key={item.action} className="flex items-center justify-between gap-2 font-sans">
                  <span className={item.highlight ? 'text-amber-300 font-medium' : 'text-slate-300'}>
                    {item.action}
                  </span>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-sky-300">
                    {item.keys}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="observatory-control min-h-11 px-5 rounded-xl text-xs font-semibold tracking-wide cursor-pointer active:scale-95"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
