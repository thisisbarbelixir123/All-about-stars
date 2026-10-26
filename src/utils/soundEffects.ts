// Web Audio API procedural sound synthesizer for celestial UI sound effects.
// Zero external asset downloads, zero latency, offline capable, and non-fatiguing.

type SoundType = 
  | 'click' 
  | 'select' 
  | 'toggleOn' 
  | 'toggleOff' 
  | 'nav' 
  | 'zoomIn' 
  | 'zoomOut' 
  | 'openModal' 
  | 'closeModal' 
  | 'reset' 
  | 'unfocus';

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private masterGain: GainNode | null = null;
  private lastPlayTime: number = 0;
  private lastSoundType: string = '';
  private listeners: Set<(enabled: boolean) => void> = new Set();
  private isInitialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cosmic_sound_fx_enabled');
        if (saved !== null) {
          this.enabled = saved === 'true';
        }
      } catch {
        this.enabled = true;
      }
    }
  }

  private initAudio() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  private resumeContext() {
    if (!this.ctx) {
      this.initAudio();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public isSoundEnabled(): boolean {
    return this.enabled;
  }

  public setSoundEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cosmic_sound_fx_enabled', String(enabled));
      } catch {
        // ignore
      }
    }
    this.listeners.forEach((listener) => listener(enabled));
    if (enabled) {
      this.play('toggleOn');
    }
  }

  public toggleSound(): boolean {
    const next = !this.enabled;
    this.setSoundEnabled(next);
    return next;
  }

  public subscribe(callback: (enabled: boolean) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  public play(type: SoundType = 'click') {
    if (!this.enabled || typeof window === 'undefined') return;

    const now = performance.now();
    // Debounce exact duplicate sounds played within 25ms
    if (this.lastSoundType === type && now - this.lastPlayTime < 25) {
      return;
    }
    this.lastPlayTime = now;
    this.lastSoundType = type;

    try {
      this.resumeContext();
      if (!this.ctx || !this.masterGain) return;

      const ctx = this.ctx;
      const t = ctx.currentTime;

      switch (type) {
        case 'click': {
          // Crisp, subtle high-tech celestial blip (40ms)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(1150, t);
          osc.frequency.exponentialRampToValueAtTime(580, t + 0.035);

          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.18, t + 0.003);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.038);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(t);
          osc.stop(t + 0.04);
          break;
        }

        case 'select': {
          // Ethereal celestial chime shimmer (two harmonic tones with slight decay)
          const freqs = [587.33, 880.0]; // D5 and A5
          freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + idx * 0.02);

            const startTime = t + idx * 0.02;
            const duration = 0.16;

            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(0.14 / (idx + 1), startTime + 0.008);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(gain);
            gain.connect(this.masterGain!);

            osc.start(startTime);
            osc.stop(startTime + duration + 0.01);
          });
          break;
        }

        case 'toggleOn': {
          // Upward positive sci-fi blip (2 notes: 520Hz -> 780Hz)
          const notes = [520, 780];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            const startTime = t + idx * 0.035;
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(0.15, startTime + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.05);

            osc.connect(gain);
            gain.connect(this.masterGain!);

            osc.start(startTime);
            osc.stop(startTime + 0.055);
          });
          break;
        }

        case 'toggleOff': {
          // Downward gentle blip (2 notes: 680Hz -> 440Hz)
          const notes = [680, 440];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            const startTime = t + idx * 0.035;
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(0.12, startTime + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.05);

            osc.connect(gain);
            gain.connect(this.masterGain!);

            osc.start(startTime);
            osc.stop(startTime + 0.055);
          });
          break;
        }

        case 'nav': {
          // Snappy directional click (28ms)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, t);
          osc.frequency.exponentialRampToValueAtTime(1250, t + 0.025);

          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.16, t + 0.002);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.028);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(t);
          osc.stop(t + 0.03);
          break;
        }

        case 'zoomIn': {
          // Ascending pitch glide
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, t);
          osc.frequency.exponentialRampToValueAtTime(740, t + 0.055);

          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.13, t + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(t);
          osc.stop(t + 0.06);
          break;
        }

        case 'zoomOut': {
          // Descending pitch glide
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(680, t);
          osc.frequency.exponentialRampToValueAtTime(380, t + 0.055);

          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.13, t + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(t);
          osc.stop(t + 0.06);
          break;
        }

        case 'openModal': {
          // Space ambient chord bloom
          const chords = [523.25, 659.25, 783.99]; // C5, E5, G5
          chords.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            const startTime = t + idx * 0.02;
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(0.12, startTime + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.15);

            osc.connect(gain);
            gain.connect(this.masterGain!);

            osc.start(startTime);
            osc.stop(startTime + 0.16);
          });
          break;
        }

        case 'closeModal': {
          // Soft dismiss pulse
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(540, t);
          osc.frequency.exponentialRampToValueAtTime(280, t + 0.075);

          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.12, t + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(t);
          osc.stop(t + 0.085);
          break;
        }

        case 'reset':
        case 'unfocus': {
          // Gentle spatial refocus resonance
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(460, t);
          osc.frequency.exponentialRampToValueAtTime(320, t + 0.07);

          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.14, t + 0.006);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(t);
          osc.stop(t + 0.08);
          break;
        }

        default:
          break;
      }
    } catch (e) {
      console.warn('Error synthesizing sound effect:', e);
    }
  }

  public playClick() {
    this.play('click');
  }

  public playOpenModal() {
    this.play('openModal');
  }

  public playCloseModal() {
    this.play('closeModal');
  }

  // Setup global event listener for all button and interactive clicks
  public setupGlobalClickHandler() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Check if target or ancestor is a button or interactive element
      const interactiveEl = target.closest('button, [role="button"], a[href], input[type="submit"], input[type="button"], input[type="checkbox"], summary');
      if (interactiveEl) {
        // Check for specific data-sound attribute
        const soundAttr = interactiveEl.getAttribute('data-sound') as SoundType | 'none' | null;
        if (soundAttr === 'none') {
          return;
        }

        // Play appropriate sound
        const soundToPlay: SoundType = soundAttr || 'click';
        this.play(soundToPlay);
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
  }
}

export const soundEffects = new SoundEffectsManager();
