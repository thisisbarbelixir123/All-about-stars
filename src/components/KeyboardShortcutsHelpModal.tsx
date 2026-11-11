import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsHelpModal: React.FC<KeyboardShortcutsHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: 'Navigation & Subsystems',
      shortcuts: [
        { key: '1', desc: 'Jump to Overview / Home' },
        { key: '2', desc: 'Open 3D Catalog Explorer' },
        { key: '3', desc: 'View Hertzsprung–Russell Diagram' },
        { key: '4', desc: 'Open Stellar Life Cycles Simulation' },
        { key: '5', desc: 'Inspect Stellar Remnants & Relics' },
      ],
    },
    {
      title: 'Controls & Tools',
      shortcuts: [
        { key: '⌘K or /', desc: 'Open Command Palette & Star Search' },
        { key: 'M', desc: 'Toggle Ambient Cosmic Space Audio' },
        { key: 'C', desc: 'Toggle Star Comparison Dock' },
        { key: '?', desc: 'Show this Keyboard Shortcuts cheat-sheet' },
        { key: 'Alt+B / ⌘K', desc: 'Close star search features' },
        { key: 'ESC', desc: 'Close star dossier or modal sheets' },
      ],
    },
    {
      title: '3D Celestial Stage',
      shortcuts: [
        { key: 'Left Drag', desc: 'Rotate / Orbit 3D Star Camera' },
        { key: 'Scroll Wheel', desc: 'Zoom In / Out on Photosphere' },
        { key: 'Right Drag', desc: 'Pan Camera Position' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg rounded-2xl observatory-panel border border-white/10 overflow-hidden text-slate-100 p-5 sm:p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-sky-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">Keyboard Navigation</h3>
              <p className="text-xs text-slate-400">Tactile desktop shortcuts for Starpedia 3D</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close keyboard shortcuts"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 my-5 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
          {shortcutGroups.map((group) => (
            <div key={group.title}>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-400 mb-2">
                {group.title}
              </div>
              <div className="space-y-1.5">
                {group.shortcuts.map((sc) => (
                  <div
                    key={sc.key}
                    className="flex items-center justify-between py-2 px-3 rounded-xl observatory-control border border-white/10 text-xs min-h-[44px]"
                  >
                    <span className="text-slate-300 font-sans">{sc.desc}</span>
                    <kbd className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-sky-300 font-mono text-[11px] font-semibold shadow-inner">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2 rounded-xl observatory-control border border-white/10 hover:border-white/20 hover:bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer font-mono flex items-center justify-center"
          >
            Close [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
