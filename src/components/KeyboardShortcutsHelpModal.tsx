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
        { key: 'ESC', desc: 'Close any active modal or palette' },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg rounded-2xl bg-[#030712] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden text-slate-100 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
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
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 my-5 max-h-[60vh] overflow-y-auto pr-1">
          {shortcutGroups.map((group) => (
            <div key={group.title}>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400/80 mb-2">
                {group.title}
              </div>
              <div className="space-y-1.5">
                {group.shortcuts.map((sc) => (
                  <div
                    key={sc.key}
                    className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs"
                  >
                    <span className="text-slate-300 font-sans">{sc.desc}</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-[11px] font-semibold">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer font-mono"
          >
            Close [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
