/**
 * Procedural Space Sound Engine (Web Audio API)
 * Generates an ethereal, non-looping cosmic soundscape using real-time synthesis:
 * - Sub-bass deep-space resonant drone (55Hz / 110Hz harmonics)
 * - Cosmic microwave background (pink-noise buffer with sweeping resonant filter)
 * - Ethereal celestial chimes and acoustic interaction feedback
 * Zero external audio assets, zero bundle weight, works completely offline.
 */

class SpaceAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.45;
  private isPlaying: boolean = false;

  // Audio Graph Nodes
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private lfoOsc: OscillatorNode | null = null;

  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;

  // Listeners for UI state sync
  private listeners: Set<(state: { isMuted: boolean; volume: number; isPlaying: boolean }) => void> = new Set();

  constructor() {
    // Read user preference from localStorage
    try {
      const savedMute = localStorage.getItem('starpedia_audio_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
      const savedVol = localStorage.getItem('starpedia_audio_volume');
      if (savedVol !== null) {
        const v = parseFloat(savedVol);
        if (!isNaN(v) && v >= 0 && v <= 1) {
          this.volume = v;
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Subscribe to audio state changes (for UI buttons/visualizers)
   */
  public subscribe(callback: (state: { isMuted: boolean; volume: number; isPlaying: boolean }) => void) {
    this.listeners.add(callback);
    callback(this.getState());
    return () => {
      this.listeners.delete(callback);
    };
  }

  public getState() {
    return {
      isMuted: this.isMuted,
      volume: this.volume,
      isPlaying: this.isPlaying && !this.isMuted,
    };
  }

  private notify() {
    const st = this.getState();
    this.listeners.forEach((cb) => cb(st));
  }

  /**
   * Initialize AudioContext on first user interaction
   */
  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Start or resume ambient soundscape
   */
  public async start() {
    const ctx = this.initContext();
    if (!ctx) return;

    if (this.isPlaying) return;
    this.isPlaying = true;

    // Master Gain
    this.masterGain = ctx.createGain();
    const effectiveGain = this.isMuted ? 0 : this.volume;
    this.masterGain.gain.setValueAtTime(0, ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(effectiveGain, ctx.currentTime + 2.5);
    this.masterGain.connect(ctx.destination);

    // 1. Deep Space Drone Oscillators (Sub-bass A1 / A2)
    this.droneGain = ctx.createGain();
    this.droneGain.gain.value = 0.35;

    this.droneFilter = ctx.createBiquadFilter();
    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.setValueAtTime(120, ctx.currentTime);
    this.droneFilter.Q.value = 3.5;

    this.droneOsc1 = ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 55Hz

    this.droneOsc2 = ctx.createOscillator();
    this.droneOsc2.type = 'sine';
    this.droneOsc2.frequency.setValueAtTime(110.2, ctx.currentTime); // A2 110Hz + subtle chorus detune

    // Modulation LFO for drone filter sweep
    this.lfoOsc = ctx.createOscillator();
    this.lfoOsc.type = 'sine';
    this.lfoOsc.frequency.setValueAtTime(0.08, ctx.currentTime); // Ultra slow breathing (12.5s cycle)
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 45;
    this.lfoOsc.connect(lfoGain);
    lfoGain.connect(this.droneFilter.frequency);

    this.droneOsc1.connect(this.droneFilter);
    this.droneOsc2.connect(this.droneFilter);
    this.droneFilter.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    this.droneOsc1.start();
    this.droneOsc2.start();
    this.lfoOsc.start();

    // 2. Cosmic Microwave Background Pink Noise Buffer
    this.setupCosmicNoise(ctx);

    this.notify();
  }

  private setupCosmicNoise(ctx: AudioContext) {
    if (!this.masterGain) return;

    // 5-second pink noise buffer
    const bufferSize = ctx.sampleRate * 5;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }

    this.noiseSource = ctx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    this.noiseFilter = ctx.createBiquadFilter();
    this.noiseFilter.type = 'bandpass';
    this.noiseFilter.frequency.setValueAtTime(320, ctx.currentTime);
    this.noiseFilter.Q.value = 1.2;

    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.value = 0.14;

    this.noiseSource.connect(this.noiseFilter);
    this.noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.masterGain);

    this.noiseSource.start();
  }

  /**
   * Toggle mute/unmute
   */
  public toggleMute(): boolean {
    if (!this.isPlaying) {
      this.isMuted = false;
      this.start();
      return false;
    }

    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('starpedia_audio_muted', String(this.isMuted));
    } catch {
      // Ignore
    }

    if (this.ctx && this.masterGain) {
      const target = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.3);
    }

    this.notify();
    return this.isMuted;
  }

  /**
   * Set volume [0.0, 1.0]
   */
  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('starpedia_audio_volume', String(this.volume));
    } catch {
      // Ignore
    }

    if (this.ctx && this.masterGain && !this.isMuted) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.1);
    }

    this.notify();
  }

  /**
   * Play crystal celestial harmonic chime on star selection or warp
   */
  public playCelestialChime(spectralClass: string = 'G') {
    if (this.isMuted || !this.ctx) return;
    const ctx = this.ctx;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Map spectral classes to celestial harmonic pitches (Pentatonic / Lydian)
    const pitchMap: Record<string, number[]> = {
      O: [523.25, 1046.5, 1567.98], // High searing C5, C6, G6
      B: [493.88, 987.77, 1479.98], // B4, B5, F#6
      A: [440.0, 880.0, 1318.51],   // A4, A5, E6
      F: [392.0, 783.99, 1174.66],  // G4, G5, D6
      G: [329.63, 659.25, 987.77],  // E4, E5, B5 (Solar warmth)
      K: [293.66, 587.33, 880.0],   // D4, D5, A5
      M: [220.0, 440.0, 659.25],    // Low deep red A3, A4, E5
    };

    const notes = pitchMap[spectralClass.toUpperCase()] || pitchMap['G'];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const peak = 0.08 / (idx + 1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.03 + idx * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + idx * 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.02);
      osc.stop(now + 1.8 + idx * 0.3);
    });
  }

  /**
   * Pulsar acoustic radio beacon pulse
   */
  public playPulsarBeep(freq: number = 880) {
    if (this.isMuted || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, now);
    filter.Q.value = 5.0;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }
}

export const spaceAudio = new SpaceAudioEngine();
