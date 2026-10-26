import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Sparkles, Eye, HelpCircle, X } from 'lucide-react';
import { STARS_CATALOG } from '../data/stars';
import { StarData } from '../types';
import { RunningText } from './RunningText';

export interface StarTier {
  tier: number;
  catalogId: string;
  name: string;
  type: string;
  radius: number;
  points: number;
  color: string;
  glowColor: string;
  coreColor: string;
}

// 9 Star tiers: Tuned smaller base radii (Stephenson at 96 units) with achievable Supernova explosion
export const STAR_TIERS: StarTier[] = [
  {
    tier: 0,
    catalogId: 'proxima-centauri',
    name: 'Proxima Centauri',
    type: 'Red Dwarf',
    radius: 15,
    points: 1,
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.45)',
    coreColor: '#fca5a5',
  },
  {
    tier: 1,
    catalogId: 'sun',
    name: 'The Sun',
    type: 'Yellow Main-Sequence',
    radius: 21,
    points: 2,
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.5)',
    coreColor: '#fef08a',
  },
  {
    tier: 2,
    catalogId: 'sirius-a',
    name: 'Sirius A',
    type: 'White Main-Sequence',
    radius: 29,
    points: 4,
    color: '#f8fafc',
    glowColor: 'rgba(224, 242, 254, 0.6)',
    coreColor: '#ffffff',
  },
  {
    tier: 3,
    catalogId: 'spica',
    name: 'Spica',
    type: 'Blue Main-Sequence',
    radius: 37,
    points: 8,
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.55)',
    coreColor: '#bae6fd',
  },
  {
    tier: 4,
    catalogId: 'arcturus',
    name: 'Arcturus',
    type: 'Orange Giant',
    radius: 47,
    points: 16,
    color: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    coreColor: '#fed7aa',
  },
  {
    tier: 5,
    catalogId: 'gacrux',
    name: 'Gacrux',
    type: 'Red Giant',
    radius: 58,
    points: 32,
    color: '#dc2626',
    glowColor: 'rgba(220, 38, 38, 0.65)',
    coreColor: '#fecaca',
  },
  {
    tier: 6,
    catalogId: 'eta-carinae-a',
    name: 'Eta Carinae',
    type: 'Blue Hypergiant',
    radius: 69,
    points: 64,
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.7)',
    coreColor: '#a5f3fc',
  },
  {
    tier: 7,
    catalogId: 'rho-cassiopeiae',
    name: 'Rho Cassiopeiae',
    type: 'Yellow Hypergiant',
    radius: 82,
    points: 128,
    color: '#facc15',
    glowColor: 'rgba(250, 204, 21, 0.75)',
    coreColor: '#fef9c3',
  },
  {
    tier: 8,
    catalogId: 'stephenson-2-18',
    name: 'Stephenson 2-18',
    type: 'Red Hypergiant',
    radius: 96,
    points: 256,
    color: '#e11d48',
    glowColor: 'rgba(225, 29, 72, 0.85)',
    coreColor: '#ffe4e6',
  },
];

// Supernova Scaling Progression:
// Default mode (0 SN): size +0%, score 1.0x, drop rate 1x, droppable: Red Dwarf (90%), Sun (8%), Sirius A (2%)
// 1st SN: size +0%, score 1.0x, drop rate 1x, can spawn Spica (~0.5%)
// 2nd SN: Score x1.5, size +5%, drop rate x2, can spawn Arcturus (~0.25%) + Spica (~0.5%)
// 3rd SN: Score x2, size +10%, drop rate x3, can spawn Gacrux (~0.125% - capped) + Arcturus (~0.25%) + Spica (~0.5%)
// 4th SN: Score x2.5, size +15%, drop rate x4 (capped), can spawn Gacrux (~0.125% - capped)
// 5th+ SN: Score x3, size +20% (capped), drop rate x4 (capped), can spawn Gacrux (~0.125% - capped)
export interface SupernovaScalingInfo {
  scoreMultiplier: number;
  sizeScale: number;
  sizePercent: number;
  dropRate: number;
  maxDroppableTier: number;
}

export const getSupernovaScaling = (snCount: number): SupernovaScalingInfo => {
  if (snCount <= 0) {
    return {
      scoreMultiplier: 1.0,
      sizeScale: 1.0,
      sizePercent: 0,
      dropRate: 1,
      maxDroppableTier: 2, // up to Sirius A (Red Dwarf 90%, Sun 8%, Sirius A 2%)
    };
  }
  if (snCount === 1) {
    return {
      scoreMultiplier: 1.0,
      sizeScale: 1.0,
      sizePercent: 0,
      dropRate: 1,
      maxDroppableTier: 3, // 1. can spawn Spica (~0.5%)
    };
  }
  if (snCount === 2) {
    return {
      scoreMultiplier: 1.5,
      sizeScale: 1.05,
      sizePercent: 5,
      dropRate: 2,
      maxDroppableTier: 4, // 2. can spawn Arcturus (~0.25%) + Spica (~0.5%)
    };
  }
  if (snCount === 3) {
    return {
      scoreMultiplier: 2.0,
      sizeScale: 1.10,
      sizePercent: 10,
      dropRate: 3,
      maxDroppableTier: 5, // 3. can spawn Gacrux (~0.125%) - capped
    };
  }
  if (snCount === 4) {
    return {
      scoreMultiplier: 2.5,
      sizeScale: 1.15,
      sizePercent: 15,
      dropRate: 4,
      maxDroppableTier: 5, // can spawn Gacrux (~0.125%) (capped)
    };
  }
  // 5th supernova and above (capped)
  return {
    scoreMultiplier: 3.0,
    sizeScale: 1.20,
    sizePercent: 20,
    dropRate: 4,
    maxDroppableTier: 5, // can spawn Gacrux (~0.125%) (capped)
  };
};

export const getSupernovaSizeScale = (snCount: number): number => {
  return getSupernovaScaling(snCount).sizeScale;
};

export const getSupernovaScoreMultiplier = (snCount: number): number => {
  return getSupernovaScaling(snCount).scoreMultiplier;
};

interface PhysicsStar {
  id: number;
  tier: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  scale: number;
  settledTimer: number;
  merged: boolean;
  chainCombo: number;
  chainExpiresAt: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  width: number;
  speed: number;
}

interface FloatingScore {
  id: number;
  text: string;
  x: number;
  y: number;
  alpha: number;
  color: string;
}

interface PraiseMessage {
  id: number;
  text: string;
  subText?: string;
  combo?: number;
  isSupernova?: boolean;
}

interface CanvasBgStar {
  xPct: number;
  yPct: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

// Mini Canvas component to render stars on Game Over menu using identical game models
export const StarModelCanvas: React.FC<{
  tier: StarTier;
  diameter: number;
}> = ({ tier, diameter }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const safeDiameter = Number.isFinite(diameter) && diameter > 0 ? diameter : 24;
    const r = safeDiameter / 2;

    const createSafeRadial = (x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) => {
      const sX0 = Number.isFinite(x0) ? x0 : 0;
      const sY0 = Number.isFinite(y0) ? y0 : 0;
      const sR0 = Number.isFinite(r0) ? Math.max(0, r0) : 0;
      const sX1 = Number.isFinite(x1) ? x1 : sX0;
      const sY1 = Number.isFinite(y1) ? y1 : sY0;
      const sR1 = Number.isFinite(r1) ? Math.max(0.001, r1) : Math.max(1, sR0 + 1);
      return ctx.createRadialGradient(sX0, sY0, sR0, sX1, sY1, sR1);
    };

    // 1. Outer corona glow
    const coronaGrad = createSafeRadial(cx, cy, r * 0.6, cx, cy, r * 1.35);
    coronaGrad.addColorStop(0, tier.glowColor);
    coronaGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = coronaGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.35, 0, Math.PI * 2);
    ctx.fill();

    // 2. Star body gradient
    const bodyGrad = createSafeRadial(
      cx - r * 0.25,
      cy - r * 0.25,
      0,
      cx,
      cy,
      r
    );
    bodyGrad.addColorStop(0, tier.coreColor);
    bodyGrad.addColorStop(0.55, tier.color);
    bodyGrad.addColorStop(1, tier.color);

    ctx.shadowColor = tier.color;
    ctx.shadowBlur = r * 0.45;
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // 3. Specular highlight / limb ring
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = Math.max(1, r * 0.08);
    ctx.beginPath();
    ctx.arc(cx, cy, r - 0.5, 0, Math.PI * 2);
    ctx.stroke();
  }, [tier, diameter]);

  const boxSize = Math.max(34, Math.ceil(diameter * 1.45));
  return (
    <canvas
      ref={canvasRef}
      width={boxSize}
      height={boxSize}
      className="shrink-0 pointer-events-none drop-shadow-md"
      style={{ width: `${boxSize}px`, height: `${boxSize}px` }}
    />
  );
};

// Fixed virtual coordinate space (500x500) ensures 100% identical star scaling and physics across mobile, tablet, and desktop
const VIRTUAL_WIDTH = 500;
const VIRTUAL_HEIGHT = 500;

interface StellarSuikaGameProps {
  onHome?: () => void;
  onBack?: () => void;
  onInspectStar?: (star: StarData) => void;
}

export const StellarSuikaGame: React.FC<StellarSuikaGameProps> = ({ onHome, onBack, onInspectStar }) => {
  const handleBack = onBack || onHome || (() => {});
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playAreaRef = useRef<HTMLElement | null>(null);

  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('stellar_suika_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showIntroGuide, setShowIntroGuide] = useState<boolean>(true);
  const [supernovaCount, setSupernovaCount] = useState<number>(0);
  const supernovaCountRef = useRef<number>(0);

  // Candy Crush praise message displayed on the header
  const [activePraise, setActivePraise] = useState<PraiseMessage | null>(null);
  const praiseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Star Dropper rarity progression:
  // Star Dropper rarity progression:
  // Default mode (0 SN): Red Dwarf (90%), Sun (8%), Sirius A (2%)
  // 1st SN: Can spawn Spica (~0.5%)
  // 2nd SN: Can spawn Arcturus (~0.25%) + Spica (~0.5%)
  // 3rd SN & beyond: Can spawn Gacrux (~0.125% - capped) + Arcturus (~0.25%) + Spica (~0.5%)
  const getRandomDroppableTier = (snCount = supernovaCountRef.current): number => {
    const scaling = getSupernovaScaling(snCount);
    const r = Math.random();

    // Default mode (0 Supernovas): 90% Red Dwarf, 8% Sun, 2% Sirius A
    if (scaling.maxDroppableTier <= 2) {
      if (r < 0.90) return 0; // 90% Red Dwarf (Proxima Centauri)
      if (r < 0.98) return 1; // 8% The Sun (rare)
      return 2;               // 2% Sirius A (much rarer)
    }

    // 1st Supernova: Can spawn Spica (~0.5%)
    if (scaling.maxDroppableTier === 3) {
      if (r < 0.895) return 0; // ~89.5% Red Dwarf
      if (r < 0.975) return 1; // 8.0% Sun
      if (r < 0.995) return 2; // 2.0% Sirius A
      return 3;                // ~0.5% Spica (Tier 3)
    }

    // 2nd Supernova: Can spawn Arcturus (~0.25%) + Spica (~0.5%)
    if (scaling.maxDroppableTier === 4) {
      if (r < 0.8925) return 0; // ~89.25% Red Dwarf
      if (r < 0.9725) return 1; // 8.0% Sun
      if (r < 0.9925) return 2; // 2.0% Sirius A
      if (r < 0.9975) return 3; // ~0.5% Spica
      return 4;                 // ~0.25% Arcturus (Tier 4)
    }

    // 3rd+ Supernova: Can spawn Gacrux (~0.125% - capped) + Arcturus (~0.25%) + Spica (~0.5%)
    if (r < 0.89125) return 0;  // ~89.125% Red Dwarf
    if (r < 0.97125) return 1;  // 8.0% Sun
    if (r < 0.99125) return 2;  // 2.0% Sirius A
    if (r < 0.99625) return 3;  // ~0.5% Spica
    if (r < 0.99875) return 4;  // ~0.25% Arcturus
    return 5;                   // ~0.125% Gacrux (Tier 5 capped)
  };

  // Dropper holds the secret next drop tier rolled by rarity (dropper itself always visually shows Red Dwarf)
  const currentTierIdxRef = useRef<number>(getRandomDroppableTier(0));

  // Dropper cursor X in virtual coordinates
  const dropperXRef = useRef<number>(VIRTUAL_WIDTH / 2);
  const canDropRef = useRef<boolean>(true);
  const droppingStarIdRef = useRef<number | null>(null);

  // Audio Context ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Combo tracker (like Candy Crush)
  const comboTrackerRef = useRef<{ count: number; lastMergeTime: number }>({ count: 0, lastMergeTime: 0 });

  // Game state refs
  const starsRef = useRef<PhysicsStar[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const floatingScoresRef = useRef<FloatingScore[]>([]);
  const starIdCounterRef = useRef<number>(1);
  const scoreRef = useRef<number>(0);
  const dangerTimerRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  // Pre-generated starry background for canvas tray (space background inside play area)
  const canvasBgStarsRef = useRef<CanvasBgStar[]>(
    Array.from({ length: 70 }, () => ({
      xPct: Math.random(),
      yPct: Math.random(),
      radius: 0.6 + Math.random() * 1.5,
      alpha: 0.25 + Math.random() * 0.6,
      twinkleSpeed: 0.8 + Math.random() * 2.2,
      twinklePhase: Math.random() * Math.PI * 2,
      color: ['#ffffff', '#bae6fd', '#fed7aa', '#fef08a', '#e0e7ff'][Math.floor(Math.random() * 5)],
    }))
  );

  // Pre-generated starry background for full-screen container
  const outerBgStars = useMemo(() => {
    return Array.from({ length: 125 }, (_, i) => ({
      id: i,
      left: `${(Math.random() * 100).toFixed(2)}%`,
      top: `${(Math.random() * 100).toFixed(2)}%`,
      size: `${(0.8 + Math.random() * 2.4).toFixed(1)}px`,
      opacity: (0.2 + Math.random() * 0.75).toFixed(2),
      animDuration: `${(2 + Math.random() * 4).toFixed(1)}s`,
      animDelay: `${(Math.random() * 3).toFixed(1)}s`,
      color: ['#ffffff', '#93c5fd', '#fef08a', '#fed7aa', '#f472b6'][Math.floor(Math.random() * 5)],
    }));
  }, []);

  // Web Audio Context
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  const playDropSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Audio not permitted yet
    }
  }, [getAudioContext, soundEnabled]);

  const playMergeSound = useCallback((tier: number, comboMultiplier: number) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const baseFreqs = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
      const pitchBoost = Math.pow(1.06, Math.min(6, comboMultiplier - 1));
      const freq = baseFreqs[Math.min(tier, baseFreqs.length - 1)] * pitchBoost;

      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      oscHarmonic.type = 'sine';

      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.25);

      oscHarmonic.frequency.setValueAtTime(freq * 2, ctx.currentTime);
      oscHarmonic.frequency.exponentialRampToValueAtTime(freq * 3, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      oscHarmonic.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscHarmonic.start();
      osc.stop(ctx.currentTime + 0.3);
      oscHarmonic.stop(ctx.currentTime + 0.3);
    } catch {
      // ignore
    }
  }, [getAudioContext, soundEnabled]);

  const playSupernovaSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      // Deep celestial rumble
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(110, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.85);
      gain1.gain.setValueAtTime(0.4, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.85);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.85);

      // Shimmering cosmic chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.6);
      gain2.gain.setValueAtTime(0.3, ctx.currentTime);
      gain2.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.6);
    } catch {
      // ignore
    }
  }, [getAudioContext, soundEnabled]);

  // Show praise message in the header (starts at 3x combo)
  const showPraise = useCallback((message: PraiseMessage) => {
    if (praiseTimeoutRef.current) {
      clearTimeout(praiseTimeoutRef.current);
    }
    setActivePraise(message);
    praiseTimeoutRef.current = setTimeout(() => {
      setActivePraise(null);
    }, message.isSupernova ? 3000 : 2000);
  }, []);

  const addScore = useCallback((pts: number, x: number, y: number, textPrefix = '+') => {
    scoreRef.current += pts;
    setScore(scoreRef.current);
    setHighScore((prev) => {
      const next = Math.max(prev, scoreRef.current);
      try {
        localStorage.setItem('stellar_suika_highscore', next.toString());
      } catch {
        // ignore
      }
      return next;
    });

    floatingScoresRef.current.push({
      id: Math.random(),
      text: `${textPrefix}${pts}`,
      x,
      y,
      alpha: 1,
      color: pts >= 256 ? '#fbbf24' : '#ffffff',
    });
  }, []);

  const spawnParticles = (x: number, y: number, color: string, count: number, isSupernova = false) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = isSupernova ? 3 + Math.random() * 10 : 1 + Math.random() * 4.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: isSupernova
          ? ['#ffffff', '#fde047', '#f97316', '#ef4444', '#38bdf8', '#c084fc'][Math.floor(Math.random() * 6)]
          : color,
        size: isSupernova ? 3.5 + Math.random() * 4.5 : 2 + Math.random() * 3,
        alpha: 1,
        life: 0,
        maxLife: isSupernova ? 45 + Math.random() * 30 : 20 + Math.random() * 15,
      });
    }
  };

  // Apply merge blast force to move surrounding stars
  // "Merging two stars create a force that could move other stars. The bigger the merge, the stronger the force."
  const applyMergeShockwave = useCallback((
    midX: number,
    midY: number,
    mergeLevel: number, // 1 to 8 (for standard nextTier created) or 9+ for Supernova
    color: string,
    excludeStarIds: number[] = []
  ) => {
    const isSupernova = mergeLevel >= 9;
    // Strength scales progressively with the size of the merge
    // Tier 1 (Sun): ~75 px/s, up to Tier 8 (Stephenson): ~460 px/s, Supernova: ~720 px/s
    const baseImpulse = isSupernova ? 720 : 55 + Math.pow(mergeLevel, 1.42) * 24;
    const blastRadius = isSupernova ? 520 : 85 + mergeLevel * 45;

    // Visual expanding shockwave ring
    shockwavesRef.current.push({
      x: midX,
      y: midY,
      radius: 6,
      maxRadius: blastRadius,
      color,
      alpha: 0.9,
      width: Math.max(1.5, Math.min(5.5, 1.5 + mergeLevel * 0.5)),
      speed: isSupernova ? 800 : 380 + mergeLevel * 45,
    });

    // Apply radial outward force to other stars
    for (const star of starsRef.current) {
      if (star.merged || excludeStarIds.includes(star.id)) continue;

      const dx = star.x - midX;
      const dy = star.y - midY;
      const distSq = dx * dx + dy * dy;

      if (distSq > blastRadius * blastRadius) continue;

      const dist = Math.sqrt(distSq) || 0.001;
      const nx = dx / dist;
      const ny = dy / dist;

      // Distance attenuation (smoother cubic-quadratic falloff)
      const distFactor = Math.max(0, 1 - dist / blastRadius);
      const falloff = distFactor * distFactor;

      // Mass / inertia factor: smaller stars are pushed noticeably, large stars resist
      const massFactor = Math.max(0.7, (star.radius / 15) * 0.85);
      const forceMagnitude = (baseImpulse * falloff) / massFactor;

      star.vx += nx * forceMagnitude;
      star.vy += ny * forceMagnitude * 0.85;

      // Safe upward damping so stars don't get tossed violently past ceiling
      if (star.vy < -260) {
        star.vy = -260;
      }

      // Awaken settled timer so physical movement registers
      star.settledTimer = Math.min(star.settledTimer, 0.05);
    }
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    starsRef.current = [];
    particlesRef.current = [];
    shockwavesRef.current = [];
    floatingScoresRef.current = [];
    scoreRef.current = 0;
    dangerTimerRef.current = 0;
    comboTrackerRef.current = { count: 0, lastMergeTime: 0 };
    supernovaCountRef.current = 0;
    setSupernovaCount(0);
    setScore(0);
    setIsGameOver(false);
    setActivePraise(null);
    droppingStarIdRef.current = null;
    canDropRef.current = true;
    currentTierIdxRef.current = getRandomDroppableTier(0);
    dropperXRef.current = VIRTUAL_WIDTH / 2;
  }, []);

  // Drop star handler - anti-spam: cannot drop another star until the current star finally drops
  const dropStar = useCallback(() => {
    if (isGameOver || !canDropRef.current || droppingStarIdRef.current !== null || showIntroGuide) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canDropRef.current = false;
    const tier = currentTierIdxRef.current;
    const starDef = STAR_TIERS[tier];
    const scaling = getSupernovaScaling(supernovaCountRef.current);
    const starRadius = starDef.radius * scaling.sizeScale;
    const spawnX = Math.max(starRadius + 6, Math.min(VIRTUAL_WIDTH - starRadius - 6, dropperXRef.current));
    const spawnY = 48;
    const newStarId = starIdCounterRef.current++;
    droppingStarIdRef.current = newStarId;

    // Drop speed scales with drop rate
    const dropRate = scaling.dropRate;
    const initialVy = 15 * dropRate;

    starsRef.current.push({
      id: newStarId,
      tier,
      x: spawnX,
      y: spawnY,
      vx: 0,
      vy: initialVy,
      radius: starRadius,
      scale: 1,
      settledTimer: 0,
      merged: false,
      chainCombo: 0,
      chainExpiresAt: 0,
    });

    playDropSound();

    // Roll next mystery drop with designated rarity & unlocked higher tier chances based on supernovas
    currentTierIdxRef.current = getRandomDroppableTier(supernovaCountRef.current);

    // Safety timeout in case a star somehow doesn't collide
    setTimeout(() => {
      if (droppingStarIdRef.current === newStarId) {
        droppingStarIdRef.current = null;
        canDropRef.current = true;
      }
    }, 1500);
  }, [isGameOver, playDropSound, showIntroGuide]);

  // Pointer position tracker
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (showIntroGuide) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = VIRTUAL_WIDTH / rect.width;
    const clientX = (e.clientX - rect.left) * scaleX;
    const currentScale = getSupernovaSizeScale(supernovaCountRef.current);
    const redDwarfRadius = STAR_TIERS[0].radius * currentScale;
    dropperXRef.current = Math.max(
      redDwarfRadius + 6,
      Math.min(VIRTUAL_WIDTH - redDwarfRadius - 6, clientX)
    );
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentScale = getSupernovaSizeScale(supernovaCountRef.current);
      const redDwarfRadius = STAR_TIERS[0].radius * currentScale;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        dropperXRef.current = Math.max(redDwarfRadius + 6, dropperXRef.current - 24);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        dropperXRef.current = Math.min(VIRTUAL_WIDTH - redDwarfRadius - 6, dropperXRef.current + 24);
      } else if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.key === 'Enter') {
        e.preventDefault();
        dropStar();
      } else if (e.key === 'r' || e.key === 'R') {
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dropStar, resetGame]);

  // Square tray scaling: Identical game resolution & scaling across mobile, tablet, and desktop
  useEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current;
      const playArea = playAreaRef.current;
      if (!canvas || !playArea) return;

      const availW = playArea.clientWidth - 16;
      const availH = playArea.clientHeight - 16;
      // Reshaped to be a square tray fitting the full available screen area
      const displaySize = Math.max(260, Math.floor(Math.min(availW, availH)));

      // Razor sharp DPR rendering mapped to the constant 500x500 virtual coordinate space
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.round(VIRTUAL_WIDTH * dpr);
      canvas.height = Math.round(VIRTUAL_HEIGHT * dpr);
      canvas.style.width = `${displaySize}px`;
      canvas.style.height = `${displaySize}px`;

      if (dropperXRef.current > VIRTUAL_WIDTH - 40) {
        dropperXRef.current = VIRTUAL_WIDTH / 2;
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Main Physics and Rendering Loop
  useEffect(() => {
    let lastTime = performance.now();
    const DANGER_LINE_Y = 82;

    const CANDY_CRUSH_PRAISES = [
      'SWEET!',       // 3x Combo
      'TASTY!',       // 4x Combo
      'DELICIOUS!',   // 5x Combo
      'DIVINE!',      // 6x Combo
      'PHENOMENAL!',  // 7x Combo
      'ASTRONOMICAL!',// 8x+ Combo
    ];

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.033);
      lastTime = time;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const dpr = canvas.width / VIRTUAL_WIDTH;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.save();
          ctx.scale(dpr, dpr);

          const width = VIRTUAL_WIDTH;
          const height = VIRTUAL_HEIGHT;

          const finalizeDrop = () => {
            if (droppingStarIdRef.current !== null) {
              droppingStarIdRef.current = null;
              const dropRate = getSupernovaScaling(supernovaCountRef.current).dropRate;
              const reloadDelay = Math.max(50, Math.round(200 / dropRate));
              setTimeout(() => {
                canDropRef.current = true;
              }, reloadDelay);
            }
          };

          // 1. Physics update (Sub-stepping for rock-solid stability)
          if (!isGameOver) {
            const SUB_STEPS = 6;
            const subDt = dt / SUB_STEPS;
            const gravity = 820; // px/s^2
            const restitution = 0.22;
            const friction = 0.995;

            for (let step = 0; step < SUB_STEPS; step++) {
              // Apply gravity and integrate positions
              for (const star of starsRef.current) {
                if (star.merged) continue;
                const dropRate = getSupernovaScaling(supernovaCountRef.current).dropRate;
                const isDropping = star.id === droppingStarIdRef.current;
                const gravityMult = isDropping ? 1 + (dropRate - 1) * 0.4 : 1;
                star.vy += gravity * gravityMult * subDt;
                star.vx *= friction;
                star.vy *= friction;
                star.x += star.vx * subDt;
                star.y += star.vy * subDt;
                star.settledTimer += subDt;

                // Wall bounds
                if (star.x - star.radius < 0) {
                  star.x = star.radius;
                  star.vx = -star.vx * restitution;
                } else if (star.x + star.radius > width) {
                  star.x = width - star.radius;
                  star.vx = -star.vx * restitution;
                }

                // Floor bound
                if (star.y + star.radius > height) {
                  star.y = height - star.radius;
                  star.vy = -star.vy * restitution;
                  star.vx *= 0.94; // floor rolling friction
                  if (star.id === droppingStarIdRef.current) {
                    finalizeDrop();
                  }
                }
              }

              // Circle-circle collisions and merging
              const stars = starsRef.current;
              const len = stars.length;

              for (let i = 0; i < len; i++) {
                const s1 = stars[i];
                if (s1.merged) continue;

                for (let j = i + 1; j < len; j++) {
                  const s2 = stars[j];
                  if (s2.merged) continue;

                  const dx = s2.x - s1.x;
                  const dy = s2.y - s1.y;
                  const distSq = dx * dx + dy * dy;
                  const minDist = s1.radius + s2.radius;

                  if (distSq < minDist * minDist) {
                    const dist = Math.sqrt(distSq) || 0.0001;

                    // If either star was currently falling, contact is made -> it has finally dropped
                    if (s1.id === droppingStarIdRef.current || s2.id === droppingStarIdRef.current) {
                      finalizeDrop();
                    }

                    // CHECK MERGE: Same tier!
                    if (s1.tier === s2.tier) {
                      s1.merged = true;
                      s2.merged = true;

                      const midX = (s1.x + s2.x) / 2;
                      const midY = (s1.y + s2.y) / 2;
                      const currentTier = s1.tier;

                      // Cascade combo calculation: Only utilized when two stars merge forming a bigger one,
                      // and then that resulting star merges forming an even bigger one, and so on.
                      const now = performance.now();
                      const s1InChain = s1.chainExpiresAt > now && s1.chainCombo >= 1;
                      const s2InChain = s2.chainExpiresAt > now && s2.chainCombo >= 1;

                      let currentCombo = 1;
                      if (s1InChain || s2InChain) {
                        const parentChain = Math.max(
                          s1InChain ? s1.chainCombo : 1,
                          s2InChain ? s2.chainCombo : 1
                        );
                        currentCombo = parentChain + 1;
                      } else {
                        currentCombo = 1;
                      }

                      if (currentTier < 8) {
                        // Standard merge: Upgrade to next star tier
                        const nextTier = currentTier + 1;
                        const nextDef = STAR_TIERS[nextTier];
                        const currentSNCount = supernovaCountRef.current;
                        const currentRadiusScale = getSupernovaSizeScale(currentSNCount);
                        const snMultiplier = getSupernovaScoreMultiplier(currentSNCount);
                        const earnedPts = Math.round(nextDef.points * currentCombo * snMultiplier);

                        const newStarId = starIdCounterRef.current++;
                        starsRef.current.push({
                          id: newStarId,
                          tier: nextTier,
                          x: midX,
                          y: midY,
                          vx: (s1.vx + s2.vx) * 0.3,
                          vy: Math.min(-1.5, (s1.vy + s2.vy) * 0.3),
                          radius: nextDef.radius * currentRadiusScale,
                          scale: 1.25,
                          settledTimer: 0.5,
                          merged: false,
                          chainCombo: currentCombo,
                          chainExpiresAt: now + 2500,
                        });

                        // Merging stars creates a physical blast force that moves surrounding stars.
                        // The bigger the merge, the stronger the force!
                        applyMergeShockwave(midX, midY, nextTier, nextDef.color, [s1.id, s2.id, newStarId]);

                        // Score shown after merging stars does not show the multiplier, only score amassed!
                        addScore(
                          earnedPts,
                          midX,
                          midY - 14
                        );
                        spawnParticles(midX, midY, nextDef.color, 16);
                        playMergeSound(nextTier, currentCombo);

                        // Messages start appearing when it reaches 3x combo (displayed on the header)
                        if (currentCombo >= 3) {
                          const praiseIdx = Math.min(currentCombo - 3, CANDY_CRUSH_PRAISES.length - 1);
                          showPraise({
                            id: Math.random(),
                            text: CANDY_CRUSH_PRAISES[praiseIdx],
                            subText: `${currentCombo}x Combo`,
                            combo: currentCombo,
                          });
                        }
                      } else {
                        // Combining two Tier 8 stars: Supernova pop!
                        // The scaling changes from 2nd supernova:
                        // 2. Score x1.5, size +5%, drop rate x2, can spawn Spica
                        // 3. Score x2, size +10%, drop rate x3, can spawn Arcturus
                        // 4. Score x2.5, size +15%, drop rate x4 (capped), can spawn Gacrux (capped)
                        // 5. Score x3, size +20% (capped), drop rate x4 (capped), can spawn Gacrux (capped)
                        const prevScale = getSupernovaSizeScale(supernovaCountRef.current);
                        supernovaCountRef.current += 1;
                        const newSNCount = supernovaCountRef.current;
                        setSupernovaCount(newSNCount);

                        const scaling = getSupernovaScaling(newSNCount);
                        const newScale = scaling.sizeScale;
                        const growthFactor = newScale / prevScale;

                        // 1. Existing stars grow to new scale
                        for (const s of starsRef.current) {
                          if (!s.merged) {
                            s.radius *= growthFactor;
                          }
                        }

                        // 2. Score multiplied
                        const snMultiplier = scaling.scoreMultiplier;
                        const earnedPts = Math.round(512 * snMultiplier);
                        const multText = snMultiplier.toFixed(1).replace(/\.0$/, '');

                        // Score shown after merging stars does not show multiplier, only score amassed!
                        addScore(
                          earnedPts,
                          midX,
                          midY - 16
                        );
                        spawnParticles(midX, midY, '#e11d48', 46, true);
                        playSupernovaSound();

                        // Massive cosmic blast force from Supernova explosion
                        applyMergeShockwave(midX, midY, 9, '#fbbf24', [s1.id, s2.id]);

                        // Celebratory message for supernova (displayed on the header)
                        let subMsg = `+${earnedPts} pt`;
                        if (newSNCount === 1) {
                          subMsg = `+${earnedPts} pt · Unlocked Spica drops (~0.5%)`;
                        } else if (newSNCount === 2) {
                          subMsg = `+${earnedPts} pt · ${multText}x Score · Stars +${scaling.sizePercent}% · Drop Rate ${scaling.dropRate}x · Unlocked Arcturus (~0.25%)`;
                        } else if (newSNCount === 3) {
                          subMsg = `+${earnedPts} pt · ${multText}x Score · Stars +${scaling.sizePercent}% · Drop Rate ${scaling.dropRate}x · Unlocked Gacrux (~0.125% capped)`;
                        } else if (newSNCount >= 4) {
                          subMsg = `+${earnedPts} pt · ${multText}x Score · Stars +${scaling.sizePercent}% · Drop Rate ${scaling.dropRate}x (capped)`;
                        }
                        showPraise({
                          id: Math.random(),
                          text: 'SUPERNOVA EXPLOSION!',
                          subText: subMsg,
                          combo: currentCombo,
                          isSupernova: true,
                        });
                      }
                      break;
                    }

                    // Otherwise resolve elastic collision
                    const overlap = minDist - dist;
                    const nx = dx / dist;
                    const ny = dy / dist;

                    // Positional correction
                    s1.x -= nx * overlap * 0.5;
                    s1.y -= ny * overlap * 0.5;
                    s2.x += nx * overlap * 0.5;
                    s2.y += ny * overlap * 0.5;

                    // Relative velocity
                    const kx = s1.vx - s2.vx;
                    const ky = s1.vy - s2.vy;
                    const p = 2 * (nx * kx + ny * ky) / 2;

                    s1.vx -= p * nx * (1 + restitution) * 0.5;
                    s1.vy -= p * ny * (1 + restitution) * 0.5;
                    s2.vx += p * nx * (1 + restitution) * 0.5;
                    s2.vy += p * ny * (1 + restitution) * 0.5;
                  }
                }
              }
            }

            // Clean up merged stars
            starsRef.current = starsRef.current.filter((s) => !s.merged);
            if (droppingStarIdRef.current !== null && !starsRef.current.some((s) => s.id === droppingStarIdRef.current)) {
              finalizeDrop();
            }

            // Pop scale animation relaxation
            for (const s of starsRef.current) {
              if (s.scale > 1) {
                s.scale = Math.max(1, s.scale - dt * 2.2);
              }
            }

            // Check for tray overflow boundary (triggers in early game or late game when objects reach boundary)
            let isDanger = false;
            for (const s of starsRef.current) {
              // Star has dropped and is active
              if (s.settledTimer > 0.35) {
                // If the star reaches or exceeds the top danger boundary
                if (s.y - s.radius <= DANGER_LINE_Y) {
                  // If it's resting, bouncing slowly, or being pushed up
                  if (s.vy > -75) {
                    isDanger = true;
                    break;
                  }
                }
              }
            }

            if (isDanger) {
              dangerTimerRef.current += dt;
              if (dangerTimerRef.current >= 0.85) {
                setIsGameOver(true);
              }
            } else {
              dangerTimerRef.current = Math.max(0, dangerTimerRef.current - dt * 0.5);
            }
          }

          // Update particles
          for (let i = particlesRef.current.length - 1; i >= 0; i--) {
            const p = particlesRef.current[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.08;
            p.life++;
            p.alpha = Math.max(0, 1 - p.life / p.maxLife);
            if (p.life >= p.maxLife) {
              particlesRef.current.splice(i, 1);
            }
          }

          // Update floating scores
          for (let i = floatingScoresRef.current.length - 1; i >= 0; i--) {
            const fs = floatingScoresRef.current[i];
            fs.y -= 0.85;
            fs.alpha -= 0.018;
            if (fs.alpha <= 0) {
              floatingScoresRef.current.splice(i, 1);
            }
          }

          // Update expanding merge shockwaves
          for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
            const sw = shockwavesRef.current[i];
            sw.radius += sw.speed * dt;
            sw.alpha = Math.max(0, 0.9 * (1 - sw.radius / sw.maxRadius));
            if (sw.radius >= sw.maxRadius || sw.alpha <= 0) {
              shockwavesRef.current.splice(i, 1);
            }
          }

          // 2. Render
          // Cosmic space background inside canvas tray
          const bgGrad = ctx.createLinearGradient(0, 0, width, height);
          bgGrad.addColorStop(0, '#030717');
          bgGrad.addColorStop(0.5, '#050a22');
          bgGrad.addColorStop(1, '#02040d');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, width, height);

          // Render subtle starry space inside the canvas tray
          const nowSec = time / 1000;
          for (const bgStar of canvasBgStarsRef.current) {
            const sx = bgStar.xPct * width;
            const sy = bgStar.yPct * height;
            const twinkle = Math.sin(nowSec * bgStar.twinkleSpeed + bgStar.twinklePhase);
            const currentAlpha = Math.max(0.12, Math.min(0.95, bgStar.alpha + twinkle * 0.25));

            ctx.save();
            ctx.globalAlpha = currentAlpha;
            ctx.fillStyle = bgStar.color;
            ctx.beginPath();
            ctx.arc(sx, sy, bgStar.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Subtle container grid / boundary wall
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
          ctx.lineWidth = 1;
          ctx.strokeRect(1, 1, width - 2, height - 2);

          // Render expanding merge shockwave rings
          for (const sw of shockwavesRef.current) {
            ctx.save();
            ctx.globalAlpha = sw.alpha;
            ctx.strokeStyle = sw.color;
            ctx.lineWidth = sw.width;
            ctx.shadowColor = sw.color;
            ctx.shadowBlur = sw.width * 3;
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          // Notice: Overflow warning is completely omitted (not shown) per instructions

          // Dropper aiming guide line & star preview - ALWAYS visually a red dwarf star (Proxima Centauri)
          if (!isGameOver) {
            const isDropperReady = canDropRef.current && droppingStarIdRef.current === null;
            const currentScale = getSupernovaSizeScale(supernovaCountRef.current);
            const redDwarfDef = STAR_TIERS[0]; // Always Proxima Centauri (Red Dwarf)
            const previewRadius = Number.isFinite(redDwarfDef.radius * currentScale) ? Math.max(4, redDwarfDef.radius * currentScale) : 10;
            const safeCurrentX = Number.isFinite(dropperXRef.current) ? dropperXRef.current : width / 2;
            const dropX = Math.max(previewRadius + 6, Math.min(width - previewRadius - 6, safeCurrentX));

            const createSafeDropperRadial = (x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) => {
              const sX0 = Number.isFinite(x0) ? x0 : 0;
              const sY0 = Number.isFinite(y0) ? y0 : 0;
              const sR0 = Number.isFinite(r0) ? Math.max(0, r0) : 0;
              const sX1 = Number.isFinite(x1) ? x1 : sX0;
              const sY1 = Number.isFinite(y1) ? y1 : sY0;
              const sR1 = Number.isFinite(r1) ? Math.max(0.001, r1) : Math.max(1, sR0 + 1);
              return ctx.createRadialGradient(sX0, sY0, sR0, sX1, sY1, sR1);
            };

            // Aiming vertical dashed line
            ctx.save();
            ctx.setLineDash([3, 5]);
            ctx.strokeStyle = isDropperReady ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.10)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(dropX, 48);
            ctx.lineTo(dropX, height);
            ctx.stroke();
            ctx.restore();

            // Preview star at dropper - precisely matching red dwarf (only shown when ready to drop, prevents spam confusion)
            if (isDropperReady) {
              ctx.save();
              const sPreviewR = Number.isFinite(previewRadius) ? Math.max(1, previewRadius) : 10;
              const grad = createSafeDropperRadial(dropX, 48, 0, dropX, 48, sPreviewR);
              grad.addColorStop(0, redDwarfDef.coreColor);
              grad.addColorStop(0.7, redDwarfDef.color);
              grad.addColorStop(1, redDwarfDef.glowColor);

              ctx.shadowColor = redDwarfDef.color;
              ctx.shadowBlur = 12;
              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(dropX, 48, previewRadius, 0, Math.PI * 2);
              ctx.fill();

              // Indicator arrow
              ctx.fillStyle = '#94a3b8';
              ctx.beginPath();
              ctx.moveTo(dropX - 4, 16);
              ctx.lineTo(dropX + 4, 16);
              ctx.lineTo(dropX, 22);
              ctx.closePath();
              ctx.fill();
              ctx.restore();
            }
          }

          // Render settled stars (Star labels are removed per instructions)
          for (const star of starsRef.current) {
            const def = STAR_TIERS[star.tier];
            const r = star.radius * star.scale;

            ctx.save();

            const createSafeRadial = (x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) => {
              const sX0 = Number.isFinite(x0) ? x0 : 0;
              const sY0 = Number.isFinite(y0) ? y0 : 0;
              const sR0 = Number.isFinite(r0) ? Math.max(0, r0) : 0;
              const sX1 = Number.isFinite(x1) ? x1 : sX0;
              const sY1 = Number.isFinite(y1) ? y1 : sY0;
              const sR1 = Number.isFinite(r1) ? Math.max(0.001, r1) : Math.max(1, sR0 + 1);
              return ctx.createRadialGradient(sX0, sY0, sR0, sX1, sY1, sR1);
            };

            // Outer glowing corona
            const coronaGrad = createSafeRadial(star.x, star.y, r * 0.7, star.x, star.y, r * 1.35);
            coronaGrad.addColorStop(0, def.glowColor);
            coronaGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = coronaGrad;
            ctx.beginPath();
            ctx.arc(star.x, star.y, r * 1.35, 0, Math.PI * 2);
            ctx.fill();

            // Star Body
            const bodyGrad = createSafeRadial(
              star.x - r * 0.25,
              star.y - r * 0.25,
              0,
              star.x,
              star.y,
              r
            );
            bodyGrad.addColorStop(0, def.coreColor);
            bodyGrad.addColorStop(0.55, def.color);
            bodyGrad.addColorStop(1, def.color);

            ctx.shadowColor = def.color;
            ctx.shadowBlur = r * 0.35;
            ctx.fillStyle = bodyGrad;
            ctx.beginPath();
            ctx.arc(star.x, star.y, r, 0, Math.PI * 2);
            ctx.fill();

            // Specular Highlight / Limb Ring
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = Math.max(1, r * 0.05);
            ctx.beginPath();
            ctx.arc(star.x, star.y, r - 0.5, 0, Math.PI * 2);
            ctx.stroke();

            ctx.restore();
          }

          // Render particles
          for (const p of particlesRef.current) {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Render floating score numbers
          for (const fs of floatingScoresRef.current) {
            ctx.save();
            ctx.globalAlpha = fs.alpha;
            ctx.font = 'bold 13px monospace';
            ctx.fillStyle = fs.color;
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
            ctx.shadowBlur = 4;
            ctx.fillText(fs.text, fs.x, fs.y);
            ctx.restore();
          }

          ctx.restore();
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [addScore, applyMergeShockwave, isGameOver, playMergeSound, playSupernovaSound, showPraise]);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (praiseTimeoutRef.current) clearTimeout(praiseTimeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen min-h-screen z-[100] bg-[#02040a] text-slate-100 flex flex-col select-none overflow-hidden relative"
      style={{
        background: 'radial-gradient(ellipse at 25% 20%, rgba(56, 189, 248, 0.09) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(225, 29, 72, 0.08) 0%, transparent 55%), radial-gradient(circle at 50% 50%, #060b24 0%, #02040b 100%)',
      }}
    >
      {/* Fullscreen Dynamic Starry Space Background with twinkling stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {outerBgStars.map((s) => (
          <span
            key={s.id}
            className="absolute rounded-full animate-pulse"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              backgroundColor: s.color,
              animationDuration: s.animDuration,
              animationDelay: s.animDelay,
              boxShadow: `0 0 4px ${s.color}`,
            }}
          />
        ))}
      </div>

      {/* Top Header: Interface has NO title, ONLY Back button, header combo praise display, and minigame score */}
      <header className="px-3 sm:px-5 py-2.5 shrink-0 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md flex items-center justify-between z-10 relative gap-2">
        {/* Left: Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 hover:text-white hover:border-cyan-500/50 hover:bg-slate-800 transition-all font-mono text-sm cursor-pointer shadow-sm active:scale-95 shrink-0"
          title="Go Back"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back</span>
        </button>

        {/* Center: Candy Crush Style Praise Messages in the Header (starts at 3x combo or Stephenson supernova) */}
        <div className="flex-1 flex items-center justify-center px-1 min-h-[36px] overflow-hidden">
          {activePraise && (
            <div
              key={activePraise.id}
              className={`px-3 sm:px-5 py-1.5 rounded-full border backdrop-blur-md shadow-lg flex items-center gap-2 animate-in zoom-in-75 duration-200 ${
                activePraise.isSupernova
                  ? 'bg-gradient-to-r from-rose-950 via-amber-950 to-rose-950 border-amber-400/90 shadow-[0_0_24px_rgba(251,191,36,0.6)]'
                  : 'bg-gradient-to-r from-purple-950 via-pink-950 to-purple-950 border-pink-400/90 shadow-[0_0_20px_rgba(244,114,182,0.5)]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-spin" />
              <span className="text-xs sm:text-sm font-black font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400 uppercase whitespace-nowrap">
                {activePraise.text}
              </span>
              {activePraise.subText && (
                <span className="text-[10px] sm:text-xs font-bold font-mono text-amber-200/95 hidden sm:inline whitespace-nowrap">
                  · {activePraise.subText}
                </span>
              )}
              {activePraise.combo && activePraise.combo >= 3 && !activePraise.isSupernova && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono text-[9px] sm:text-[10px] font-black uppercase whitespace-nowrap shrink-0">
                  {activePraise.combo}X
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Minigame Score (and Best Score) */}
        <div className="flex items-center gap-2 sm:gap-4 font-mono shrink-0">
          {supernovaCount >= 1 && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-rose-950/90 via-amber-950/80 to-rose-950/90 border border-amber-400/70 text-[10px] sm:text-xs font-bold text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)] animate-in fade-in zoom-in-95"
              title={
                supernovaCount === 1
                  ? '1st Supernova: Spica drops unlocked (~0.5%)'
                  : `Supernova Scaling: ${getSupernovaScaling(supernovaCount).scoreMultiplier}x Score · +${getSupernovaScaling(supernovaCount).sizePercent}% Star Size · ${getSupernovaScaling(supernovaCount).dropRate}x Drop Rate`
              }
            >
              <span className="text-xs sm:text-sm animate-pulse">💥</span>
              {supernovaCount === 1 ? (
                <>
                  <span className="font-mono font-black">Spica</span>
                  <span className="hidden xs:inline text-amber-200/80 font-normal">~0.5%</span>
                </>
              ) : (
                <>
                  <span className="font-mono font-black">{getSupernovaScaling(supernovaCount).scoreMultiplier}x</span>
                  <span className="hidden xs:inline text-amber-200/80 font-normal">Score</span>
                </>
              )}
            </div>
          )}

          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-slate-400 tracking-wider">Score</span>
            <span className="text-lg sm:text-2xl font-black text-amber-400 leading-none">{score}</span>
          </div>

          {highScore > 0 && (
            <div className="flex flex-col items-end border-l border-slate-800 pl-2.5 sm:pl-5 hidden xs:flex">
              <span className="text-[10px] uppercase text-slate-500 tracking-wider">Best</span>
              <span className="text-sm sm:text-base font-bold text-slate-300 leading-none">{highScore}</span>
            </div>
          )}

          <button
            onClick={() => setShowIntroGuide(true)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors ml-0.5 cursor-pointer"
            title="How to Play - Stellar Merge Game Guide"
            aria-label="How to Play - Stellar Merge Game Guide"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={resetGame}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors ml-0.5 cursor-pointer"
            title="Restart Game (R)"
            aria-label="Restart Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSoundEnabled((v) => !v)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors ml-0.5 cursor-pointer"
            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
            aria-label={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Full-Screen Play Area (Identical scaling on mobile, tablet, and desktop) */}
      <main ref={playAreaRef} className="flex-1 flex flex-col items-center justify-center p-1 sm:p-3 overflow-hidden relative z-10 w-full h-full">
        <div className="relative flex flex-col items-center">
          {/* Full Screen Dynamic Square Tray Canvas */}
          <canvas
            ref={canvasRef}
            onPointerMove={handlePointerMove}
            onPointerDown={(e) => {
              handlePointerMove(e);
              dropStar();
            }}
            className="rounded-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] cursor-crosshair touch-none select-none block"
          />
        </div>

        {/* Introductory Guide Modal: Shows upon entering Stellar Merge Game (Zero star names mentioned) */}
        {showIntroGuide && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 z-40 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">
            <div className="max-w-md sm:max-w-xl md:max-w-2xl w-full rounded-2xl bg-[#060b22]/95 border border-cyan-500/40 p-4 sm:p-6 flex flex-col gap-3.5 sm:gap-4 text-center shadow-[0_0_50px_rgba(6,182,212,0.25)] my-auto relative">
              <button
                onClick={() => setShowIntroGuide(false)}
                className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer z-10"
                title="Close Guide"
                aria-label="Close Guide"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title & Subtitle (Icon at top removed per instructions) */}
              <div className="w-full text-center pr-6 pl-2">
                <h2 className="text-xl sm:text-2xl font-black font-mono tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-300">
                  Stellar Merge Game
                </h2>
                <p className="text-xs sm:text-sm font-mono text-cyan-400/80 mt-0.5">
                  How to Play
                </p>
              </div>

              {/* Main Body: On tablets & desktop (sm:), evolution track is larger and moved to the left hand side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full items-stretch">
                {/* Evolution Track (Left side on tablet/desktop, bigger spheres, no TX labels, bigger Supernova) */}
                <div className="flex flex-col items-center justify-between p-3 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold mb-2">
                    Evolution Track
                  </span>

                  {/* Spheres progression (No TX labels, larger sizes) */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 my-auto py-2">
                    {STAR_TIERS.map((tier, idx) => (
                      <div key={tier.tier} className="flex items-center gap-1 sm:gap-1.5">
                        <span
                          className="rounded-full shadow-md aspect-square shrink-0 ring-1 ring-white/30 transition-transform hover:scale-110"
                          style={{
                            width: `${14 + idx * 2.6}px`,
                            height: `${14 + idx * 2.6}px`,
                            backgroundColor: tier.color,
                            boxShadow: `0 0 10px ${tier.color}`,
                          }}
                        />
                        {idx < STAR_TIERS.length - 1 && (
                          <span className="text-[10px] sm:text-xs text-slate-500 font-mono">→</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Big Prominent Supernova indicator */}
                  <div className="mt-2.5 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-950/80 via-amber-950/80 to-rose-950/80 border border-amber-400/70 shadow-[0_0_20px_rgba(251,191,36,0.35)]">
                    <span className="text-xl sm:text-2xl animate-pulse">💥</span>
                    <span className="text-xs sm:text-sm font-black font-mono tracking-wider text-amber-300 uppercase">
                      Supernova
                    </span>
                  </div>
                </div>

                {/* Simplified Rules Cards (Right side on tablet/desktop, no 512 points reference) */}
                <div className="flex flex-col gap-2 justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-start gap-2.5 text-left text-xs font-mono">
                    <span className="w-5 h-5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <div className="font-bold text-slate-200">Aim &amp; Drop</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Move to aim. Tap or click to drop. One star at a time to prevent spam.
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-start gap-2.5 text-left text-xs font-mono">
                    <span className="w-5 h-5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <div className="font-bold text-slate-200">Merge &amp; Shockwave Force</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Touch identical stars to fuse into a larger star. Merges create a blast force that moves nearby stars — the bigger the merge, the stronger the force!
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-2.5 text-left text-xs font-mono">
                    <span className="w-5 h-5 rounded-lg bg-amber-950 border border-amber-500/60 text-amber-300 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <div className="font-bold text-amber-200">Supernova Explosion</div>
                      <div className="text-[11px] text-amber-300/80 mt-0.5">
                        Merge two largest stars for a Supernova! 1st SN unlocks Spica drops (~0.5%). 2nd+ scales score (up to 3x), star size (+5% to +20%), drop rate (up to 4x), and unlocks Arcturus (~0.25%) and Gacrux (~0.125% capped)!
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-start gap-2.5 text-left text-xs font-mono">
                    <span className="w-5 h-5 rounded-lg bg-rose-950 border border-rose-500/40 text-rose-400 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                      !
                    </span>
                    <div>
                      <div className="font-bold text-slate-200">Watch the Boundary</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Don&apos;t let stars stack above the top line.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={() => setShowIntroGuide(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all active:scale-95 cursor-pointer"
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {/* Game Over Modal with Star Inspection Gallery */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 z-30 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">
            <div className="max-w-xl w-full rounded-2xl bg-slate-900/95 border border-cyan-500/40 p-5 sm:p-6 flex flex-col items-center gap-4 text-center shadow-2xl my-auto">
              <div className="w-12 h-12 rounded-full bg-cyan-950/90 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <Sparkles className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">Game Over!</h2>
                <p className="text-xs text-slate-300 font-mono mt-1">Stellar containment boundary breached.</p>
              </div>

              {/* Score breakdown */}
              <div className="w-full py-3 px-4 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-around font-mono shadow-inner">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block tracking-wider">Final Score</span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-400">{score}</span>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block tracking-wider">Best Score</span>
                  <span className="text-lg sm:text-xl font-bold text-slate-200">{highScore}</span>
                </div>
              </div>

              {/* Inspect Stars Section: Stephenson 2-18 is twice as big as Proxima Centauri */}
              <div className="w-full text-left pt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Stars in 3D Dossier</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                    Click any star to open its dossier
                  </span>
                </div>

                {/* 9 Stars Gallery: Compact mobile friendly tile cards with Stephenson 2x Proxima */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                  {STAR_TIERS.map((tier) => {
                    // Sizing formula: Proxima (tier 0) = 22px, Stephenson (tier 8) = 44px (strictly 2x!)
                    const iconDiameter = 22 + tier.tier * 2.75;
                    const starData = STARS_CATALOG.find((s) => s.id === tier.catalogId);

                    return (
                      <button
                        key={tier.tier}
                        onClick={() => {
                          if (starData && onInspectStar) {
                            onInspectStar(starData);
                          }
                        }}
                        className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-800/60 transition-all text-center sm:text-left group cursor-pointer active:scale-95 shadow-sm min-w-0 overflow-hidden"
                        title={`Open 3D Dossier for ${tier.name}`}
                      >
                        {/* Mini Canvas Star Model with exact game shader/gradients */}
                        <div className="h-9 sm:h-11 w-full sm:w-11 flex items-center justify-center shrink-0">
                          <StarModelCanvas tier={tier} diameter={iconDiameter} />
                        </div>

                        <div className="min-w-0 w-full flex-1 overflow-hidden">
                          <RunningText
                            text={tier.name}
                            className="font-bold text-[10px] sm:text-xs text-slate-200 group-hover:text-cyan-300 font-mono"
                          />
                          <div className="text-[8px] sm:text-[10px] text-slate-400 font-mono truncate">
                            {tier.type}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2.5 w-full pt-2">
                <button
                  onClick={resetGame}
                  className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-transform active:scale-95 shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
                <button
                  onClick={handleBack}
                  className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-slate-700"
                  title="Go Back"
                  aria-label="Go Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
