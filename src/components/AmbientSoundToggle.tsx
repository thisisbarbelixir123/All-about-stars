import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, Music, ChevronDown, X } from 'lucide-react';
import { spaceAudio } from '../utils/spaceAudioEngine';
import { soundEffects } from '../utils/soundEffects';

interface AmbientSoundToggleProps {
  className?: string;
  id?: string;
}

export const AmbientSoundToggle: React.FC<AmbientSoundToggleProps> = ({
  className,
  id = 'btn-ambient-sound-toggle',
}) => {
  const [audioState, setAudioState] = useState(() => spaceAudio.getState());
  const [isSfxOn, setIsSfxOn] = useState(() => soundEffects.isSoundEnabled());
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubAudio = spaceAudio.subscribe((st) => setAudioState(st));
    const unsubSfx = soundEffects.subscribe((enabled) => setIsSfxOn(enabled));
    return () => {
      unsubAudio();
      unsubSfx();
    };
  }, []);

  // Close audio menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showMenu) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      window.addEventListener('mousedown', handleOutsideClick);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMenu]);

  const handleToggleBgm = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    spaceAudio.toggleMute();
  };

  const handleToggleSfx = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    soundEffects.toggleSound();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    spaceAudio.setVolume(newVol);
  };

  const isBgmActive = !audioState.isMuted;
  const isAnyAudioActive = isBgmActive || isSfxOn;

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        id={id}
        onClick={() => setShowMenu((prev) => !prev)}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowMenu((prev) => !prev);
        }}
        className={`min-h-[44px] flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer select-none active:scale-95 ${
          isBgmActive
            ? 'observatory-control border-sky-400/50 bg-sky-500/15 text-sky-300'
            : isSfxOn
            ? 'observatory-control border-white/10 hover:border-white/20 text-slate-200 hover:text-white'
            : 'observatory-control border-white/10 text-slate-500 hover:text-slate-300'
        } ${className || ''}`}
        title="Audio Controls (BGM & SFX) • Press [M] to toggle BGM"
        aria-label="Audio Controls"
        aria-expanded={showMenu}
      >
        {isBgmActive ? (
          <>
            {/* Animated Equalizer Waveform */}
            <div className="flex items-end gap-0.5 h-3.5 w-3.5 px-0.5 justify-center py-0.5 shrink-0" aria-hidden="true">
              <span className="w-0.5 bg-sky-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-full" />
              <span className="w-0.5 bg-sky-300 rounded-full animate-[pulse_1.2s_ease-in-out_infinite_0.2s] h-2/3" />
              <span className="w-0.5 bg-sky-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.4s] h-4/5" />
            </div>
            <span className="hidden sm:inline font-semibold">Audio</span>
          </>
        ) : isSfxOn ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="hidden sm:inline font-semibold text-slate-200">SFX</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="hidden sm:inline font-semibold text-slate-500">Muted</span>
          </>
        )}
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0 ${
            showMenu ? 'rotate-180 text-sky-300' : ''
          }`}
        />
      </button>

      {/* Audio Controls Popover */}
      {showMenu && (
        <div
          id="menu-audio-controls-popover"
          className="absolute right-0 top-full mt-2 z-50 p-3 observatory-panel border border-white/10 rounded-2xl shadow-2xl w-64 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-2.5 font-mono text-xs pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[11px] font-bold text-white tracking-wider flex items-center gap-1.5 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              AUDIO CONTROLS
            </span>
            <button
              type="button"
              onClick={() => setShowMenu(false)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
              title="Close audio controls"
              aria-label="Close audio controls"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 1: Background Music (BGM) */}
          <div className="flex flex-col gap-1.5 bg-white/5 p-2.5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Music className={`w-4 h-4 shrink-0 ${isBgmActive ? 'text-sky-400' : 'text-slate-500'}`} />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-200 truncate">Background Music</span>
                  <span className="text-[10px] text-slate-400 truncate">Cosmic Drone & Chimes</span>
                </div>
              </div>
              <button
                type="button"
                id="btn-toggle-bgm"
                onClick={handleToggleBgm}
                className={`min-h-[44px] px-3 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer shrink-0 ${
                  isBgmActive
                    ? 'bg-sky-400 hover:bg-sky-300 text-slate-950'
                    : 'observatory-control border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {isBgmActive ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* BGM Volume Slider (visible when BGM is on) */}
            {isBgmActive && (
              <div className="pt-2 mt-1 border-t border-white/10 flex flex-col gap-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>BGM Volume</span>
                  <span className="text-sky-300 font-bold">{Math.round(audioState.volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioState.volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-sky-400 h-1.5 bg-white/15 rounded-lg cursor-pointer"
                  aria-label="BGM Volume"
                />
              </div>
            )}
          </div>

          {/* Section 2: Sound Effects (SFX) */}
          <div className="flex items-center justify-between gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 min-w-0">
              <Volume2 className={`w-4 h-4 shrink-0 ${isSfxOn ? 'text-sky-400' : 'text-slate-500'}`} />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-200 truncate">Sound Effects (SFX)</span>
                <span className="text-[10px] text-slate-400 truncate">UI clicks & celestial cues</span>
              </div>
            </div>
            <button
              type="button"
              id="btn-toggle-sfx"
              onClick={handleToggleSfx}
              className={`min-h-[44px] px-3 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer shrink-0 ${
                isSfxOn
                  ? 'bg-sky-400 hover:bg-sky-300 text-slate-950'
                  : 'observatory-control border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {isSfxOn ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Quick keyboard shortcut tip */}
          <div className="flex justify-between items-center pt-1.5 text-[10px] text-slate-400 border-t border-white/10">
            <span>Shortcut</span>
            <span className="text-sky-300 font-mono">Press [M] for BGM</span>
          </div>
        </div>
      )}
    </div>
  );
};
