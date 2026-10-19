import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { spaceAudio } from '../utils/spaceAudioEngine';

export const AmbientSoundToggle: React.FC = () => {
  const [audioState, setAudioState] = useState(spaceAudio.getState());
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = spaceAudio.subscribe((st) => {
      setAudioState(st);
    });
    return unsubscribe;
  }, []);

  // Close volume popover when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (sliderRef.current && !sliderRef.current.contains(e.target as Node)) {
        setShowVolumeSlider(false);
      }
    };
    if (showVolumeSlider) {
      window.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showVolumeSlider]);

  const handleToggle = () => {
    spaceAudio.toggleMute();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    spaceAudio.setVolume(newVol);
  };

  const isSoundOn = audioState.isPlaying && !audioState.isMuted;

  return (
    <div className="relative" ref={sliderRef}>
      <button
        type="button"
        id="btn-ambient-sound-toggle"
        onClick={handleToggle}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowVolumeSlider(!showVolumeSlider);
        }}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer select-none ${
          isSoundOn
            ? 'bg-cyan-950/70 hover:bg-cyan-900/80 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
            : 'bg-slate-900/70 hover:bg-slate-850 border-slate-700/60 text-slate-400 hover:text-slate-200'
        }`}
        title={`Ambient Space Sound (${isSoundOn ? 'Active' : 'Muted'}) • Press [M] or Right-click for volume`}
      >
        {isSoundOn ? (
          <>
            {/* Animated Equalizer Waveform */}
            <div className="flex items-end gap-0.5 h-3.5 w-3.5 px-0.5 justify-center py-0.5" aria-hidden="true">
              <span className="w-0.5 bg-cyan-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-full" />
              <span className="w-0.5 bg-cyan-300 rounded-full animate-[pulse_1.2s_ease-in-out_infinite_0.2s] h-2/3" />
              <span className="w-0.5 bg-cyan-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.4s] h-4/5" />
            </div>
            <span className="hidden sm:inline font-semibold">Sound</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Muted</span>
          </>
        )}
      </button>

      {/* Volume Slider Popover */}
      {showVolumeSlider && (
        <div className="absolute right-0 top-full mt-2 z-50 p-3 bg-slate-950/95 border border-cyan-500/30 rounded-xl shadow-2xl backdrop-blur-xl w-48 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300 mb-2">
            <span className="flex items-center gap-1 font-semibold">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Cosmic Drone
            </span>
            <span className="text-slate-400">{Math.round(audioState.volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={audioState.volume}
            onChange={handleVolumeChange}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
            <span>Shortcut</span>
            <span className="text-cyan-400">Press M to toggle</span>
          </div>
        </div>
      )}
    </div>
  );
};
