// Procedural Web Audio API Space Sound Synthesizer & Ambient Soundscape
// Generates ethereal space drones, cosmic pink noise, and celestial spectral chimes
// Zero network dependencies, zero latency, lightweight and offline capable.

export interface SpaceAudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
}

class SpaceAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.25;

  private masterGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain1: GainNode | null = null;
  private droneGain2: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private chimeTimer: ReturnType<typeof setInterval> | null = null;

  private listeners: Set<(state: SpaceAudioState) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedMuted = localStorage.getItem('cosmic_ambient_soundscape_muted');
        if (savedMuted !== null) {
          this.isMuted = savedMuted === 'true';
        } else {
          // BGM turned on by default
          this.isMuted = false;
        }
        const savedVol = localStorage.getItem('cosmic_ambient_soundscape_volume');
        if (savedVol !== null) {
          const v = parseFloat(savedVol);
          if (!isNaN(v) && v >= 0 && v <= 1) {
            this.volume = v;
          }
        }
      } catch {
        this.isMuted = false;
      }

      // If BGM is enabled, start automatically
      if (!this.isMuted) {
        this.setupAutoPlay();
      }
    }
  }

  private setupAutoPlay() {
    if (typeof window === 'undefined') return;

    const startAudio = () => {
      if (this.isMuted) return;
      this.initAudio();
      if (!this.ctx) return;

      const runStart = () => {
        if (!this.isPlaying && !this.isMuted) {
          this.startSynthesizer();
          this.isPlaying = true;
          if (this.masterGain) {
            this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
            this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
            this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 1.2);
          }
          this.notify();
        }
      };

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().then(runStart).catch(() => {});
      } else {
        runStart();
      }
    };

    try {
      startAudio();
    } catch {
      // Ignored if browser blocks immediate autoplay
    }

    const unlockEvents = ['click', 'pointerdown', 'touchstart', 'keydown'];
    const unlockHandler = () => {
      startAudio();
      unlockEvents.forEach((ev) => window.removeEventListener(ev, unlockHandler));
    };
    unlockEvents.forEach((ev) => window.addEventListener(ev, unlockHandler, { passive: true }));
  }

  private initAudio() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        const currentGain = this.isMuted ? 0 : this.volume;
        this.masterGain.gain.setValueAtTime(currentGain, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    } catch (e) {
      console.warn('Web Audio API not supported for space audio engine:', e);
    }
  }

  private createPinkNoiseBuffer(ctx: AudioContext, seconds = 4): AudioBuffer {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  private startSynthesizer() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    // 1. Resonant Bandpass Filter for deep cosmic atmosphere
    this.filterNode = ctx.createBiquadFilter();
    this.filterNode.type = 'bandpass';
    this.filterNode.frequency.setValueAtTime(260, t);
    this.filterNode.Q.setValueAtTime(1.8, t);
    this.filterNode.connect(this.masterGain);

    // 2. Slow LFO for organic breathing filter sweeps (0.07 Hz)
    this.lfoOsc = ctx.createOscillator();
    this.lfoGain = ctx.createGain();
    this.lfoOsc.type = 'sine';
    this.lfoOsc.frequency.setValueAtTime(0.07, t);
    this.lfoGain.gain.setValueAtTime(90, t);
    this.lfoOsc.connect(this.lfoGain);
    this.lfoGain.connect(this.filterNode.frequency);
    this.lfoOsc.start(t);

    // 3. Drone Oscillator 1 (Sub-bass fundamental: 55 Hz / A1)
    this.droneOsc1 = ctx.createOscillator();
    this.droneGain1 = ctx.createGain();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(55, t);
    this.droneGain1.gain.setValueAtTime(0.4, t);
    this.droneOsc1.connect(this.droneGain1);
    this.droneGain1.connect(this.filterNode);
    this.droneOsc1.start(t);

    // 4. Drone Oscillator 2 (Harmonic fifth: 82.4 Hz / E2 with detune)
    this.droneOsc2 = ctx.createOscillator();
    this.droneGain2 = ctx.createGain();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(82.4, t);
    this.droneGain2.gain.setValueAtTime(0.25, t);
    this.droneOsc2.connect(this.droneGain2);
    this.droneGain2.connect(this.filterNode);
    this.droneOsc2.start(t);

    // 5. Cosmic Solar Wind (Filtered looped pink noise)
    try {
      const noiseBuffer = this.createPinkNoiseBuffer(ctx, 4);
      this.noiseNode = ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(380, t);

      this.noiseGain = ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.18, t);

      this.noiseNode.connect(noiseFilter);
      noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);
      this.noiseNode.start(t);
    } catch {
      // Noise buffer optional fallback
    }

    // 6. Ambient periodic chime (every 14s)
    this.chimeTimer = setInterval(() => {
      if (!this.isPlaying || this.isMuted) return;
      this.playHarmonicChime();
    }, 14000);
  }

  private playHarmonicChime() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const chordPitches = [440, 554.37, 659.25, 880, 1108.73];
    const pitch = chordPitches[Math.floor(Math.random() * chordPitches.length)];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.04 * this.volume, t + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 4.8);

    if (pan) {
      pan.pan.setValueAtTime((Math.random() - 0.5) * 0.8, t);
      osc.connect(gain);
      gain.connect(pan);
      pan.connect(this.masterGain);
    } else {
      osc.connect(gain);
      gain.connect(this.masterGain);
    }

    osc.start(t);
    osc.stop(t + 5);
  }

  private stopSynthesizer() {
    if (this.chimeTimer) {
      clearInterval(this.chimeTimer);
      this.chimeTimer = null;
    }

    try {
      if (this.droneOsc1) {
        this.droneOsc1.stop();
        this.droneOsc1.disconnect();
        this.droneOsc1 = null;
      }
      if (this.droneOsc2) {
        this.droneOsc2.stop();
        this.droneOsc2.disconnect();
        this.droneOsc2 = null;
      }
      if (this.lfoOsc) {
        this.lfoOsc.stop();
        this.lfoOsc.disconnect();
        this.lfoOsc = null;
      }
      if (this.noiseNode) {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
    } catch {
      // Cleanup safety
    }
  }

  public getState(): SpaceAudioState {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
    };
  }

  public subscribe(cb: (state: SpaceAudioState) => void): () => void {
    this.listeners.add(cb);
    cb(this.getState());
    return () => this.listeners.delete(cb);
  }

  private notify() {
    const st = this.getState();
    this.listeners.forEach((cb) => cb(st));
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cosmic_ambient_soundscape_volume', String(this.volume));
      } catch {
        // ignore
      }
    }
    if (this.ctx && this.masterGain && !this.isMuted && this.isPlaying) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
    }
    this.notify();
  }

  public async toggleMute(): Promise<boolean> {
    this.initAudio();
    if (!this.ctx) return this.isMuted;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume().catch(() => {});
    }

    if (!this.isPlaying) {
      this.startSynthesizer();
      this.isPlaying = true;
      this.isMuted = false;
      if (this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 1.2);
      }
    } else if (this.isMuted) {
      this.isMuted = false;
      if (this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.6);
      }
    } else {
      this.isMuted = true;
      if (this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      }
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cosmic_ambient_soundscape_muted', String(this.isMuted));
      } catch {
        // ignore
      }
    }
    this.notify();
    return this.isMuted;
  }

  /**
   * Plays a celestial chime tuned to the star's spectral classification
   */
  public playCelestialChime(spectralClass?: string): void {
    if (this.isMuted && !this.isPlaying) return;
    this.initAudio();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const spectralPitchMap: Record<string, number> = {
      O: 1046.5, // C6 - Brilliant, ultra-hot high pitch
      B: 880.0,  // A5 - Crisp blue
      A: 783.99, // G5 - Pure white
      F: 659.25, // E5 - Warm white
      G: 523.25, // C5 - Golden solar
      K: 440.0,  // A4 - Deep orange
      M: 329.63, // E4 - Warm resonant crimson
      L: 261.63, // C4 - Brown dwarf
      T: 196.0,  // G3 - Cool methane dwarf
      Y: 130.81, // C3 - Deep sub-stellar
      D: 1174.66, // D6 - White dwarf crystal ping
    };

    const firstChar = (spectralClass || 'G').charAt(0).toUpperCase();
    const freq = spectralPitchMap[firstChar] || 523.25;

    const ctx = this.ctx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = firstChar === 'O' || firstChar === 'B' ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    const chimeVol = (this.isMuted ? 0.15 : this.volume * 0.8);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(chimeVol, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 2.5);
  }
}

export const spaceAudio = new SpaceAudioEngine();
