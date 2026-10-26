import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  STELLAR_TRACKS,
  StellarTrack,
  LifeCycleCheckpoint,
  interpolateCheckpoint,
  timelineToSlider,
  sliderToTimeline,
} from '../data/stellarLifeCycleData';
import { STARS_CATALOG, resolveStarId } from '../data/stars';
import { StarData } from '../types';
import { StarDot2D } from './StarDot2D';
import { RunningText } from './RunningText';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sparkles,
  Flame,
  Layers,
  Thermometer,
  Zap,
  Info,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Compass,
  Gauge,
  Sliders,
  Clock,
  Timer,
  Activity,
} from 'lucide-react';

interface StellarLifeCycleVisualizer2DProps {
  onSelectStar?: (star: StarData) => void;
}

// Pre-computed relativistic jet knots for Black Hole rendering
const BH_JET_KNOTS: { dist: number; speed: number; size: number; dir: number }[] = [];
for (let i = 0; i < 24; i++) {
  BH_JET_KNOTS.push({
    dist: (i * 7.5 + 15) % 150,
    speed: 35 + (i * 9) % 30,
    size: 1.5 + (i % 3) * 0.7,
    dir: i % 2 === 0 ? 1 : -1,
  });
}

// Pre-computed Keplerian differential disk particles for Black Hole accretion disk
const BH_DISK_PARTICLES: { dist: number; angle: number; speed: number; size: number; alpha: number }[] = [];
for (let i = 0; i < 54; i++) {
  BH_DISK_PARTICLES.push({
    dist: 30 + (i * 2.2) % 95,
    angle: (i / 54) * Math.PI * 2,
    speed: 0.75 + (i % 5) * 0.22,
    size: 1.2 + (i % 3) * 0.7,
    alpha: 0.38 + (i % 4) * 0.16,
  });
}

export const StellarLifeCycleVisualizer2D: React.FC<StellarLifeCycleVisualizer2DProps> = ({
  onSelectStar,
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>('solar');
  const [progress, setProgress] = useState<number>(0.15); // Default to Present-Day Main Sequence (15% on timeline)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0); // 0.5x, 1x, 2x, 5x
  const [isFullscreenStage, setIsFullscreenStage] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const stageContainerRef = useRef<HTMLDivElement>(null);

  // Active track
  const currentTrack: StellarTrack = useMemo(() => {
    return STELLAR_TRACKS.find((t) => t.id === selectedTrackId) || STELLAR_TRACKS[0];
  }, [selectedTrackId]);

  // Active stage index in the carousel (tracks active checkpoint via Voronoi/midpoint boundaries)
  // Ensures 100% synchronization between timeline position, visual model, carousel card, and header
  const currentStageIndex = useMemo(() => {
    const pts = currentTrack.checkpoints;
    if (pts.length === 0) return 0;
    for (let i = 0; i < pts.length; i++) {
      let prevBoundary: number;
      let nextBoundary: number;

      if (i === 0) {
        prevBoundary = -Infinity;
      } else if (pts[i].progress === 1.0) {
        // Star death phase starts strictly at 100% (progress = 1.0)
        prevBoundary = 1.0;
      } else {
        prevBoundary = (pts[i - 1].progress + pts[i].progress) / 2;
      }

      if (i === pts.length - 1) {
        nextBoundary = Infinity;
      } else if (pts[i + 1].progress === 1.0) {
        // Pre-death giant phase lasts all the way until star death at 100% (progress = 1.0)
        nextBoundary = 1.0;
      } else {
        nextBoundary = (pts[i].progress + pts[i + 1].progress) / 2;
      }

      if (progress >= prevBoundary && progress < nextBoundary) {
        return i;
      }
    }
    return pts.length - 1;
  }, [currentTrack, progress]);

  // Active evolutionary stage
  const activeStage = useMemo(() => {
    return currentTrack.checkpoints[currentStageIndex] || currentTrack.checkpoints[0];
  }, [currentTrack, currentStageIndex]);

  // Clean, non-overcomplicated evolutionary stage name for simulator header,
  // directly derived from activeStage to guarantee 100% synchronization
  const simpleStageName = useMemo(() => {
    return activeStage?.stageName || 'Main-sequence phase';
  }, [activeStage]);

  // Interpolated astrophysics telemetry
  const telemetry = useMemo(() => {
    return interpolateCheckpoint(currentTrack, progress);
  }, [currentTrack, progress]);

  // When track changes, reset progress to mature main sequence (~45%–50% of active life)
  const handleTrackChange = (trackId: string) => {
    setSelectedTrackId(trackId);
    const targetTrack = STELLAR_TRACKS.find((t) => t.id === trackId) || STELLAR_TRACKS[0];
    const msPoint =
      targetTrack.checkpoints.find((c) => c.category === 'main-sequence' && c.progress > 0) ||
      targetTrack.checkpoints.find((c) => c.category === 'main-sequence');
    setProgress(msPoint ? msPoint.progress : 0.45);
    setIsPlaying(false);
  };

  // Step controls (delta applied across physical slider 0.0 to 1.0)
  const handleStep = (sliderDelta: number) => {
    setProgress((prev) => {
      const currentSlider = timelineToSlider(prev);
      const nextSlider = Math.max(0, Math.min(1.0, currentSlider + sliderDelta));
      return sliderToTimeline(nextSlider);
    });
  };

  // Jump to specific checkpoint
  const handleJumpToCheckpoint = (cp: LifeCycleCheckpoint) => {
    setProgress(cp.progress);
  };

  // Jump to specific category
  const handleJumpToCategory = (cat: string) => {
    const cp = currentTrack.checkpoints.find((c) => c.category === cat);
    if (cp) setProgress(cp.progress);
  };

  // Keyboard shortcut: Space to play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only if not focused in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStep(0.015);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStep(-0.015);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Animation playback loop across slider (0.0 to 1.0)
  // Protostar occupies first 20%, Active Life occupies middle 60%, Remnant occupies final 20%
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Complete full slider cycle (0.0 to 1.0) in 30 seconds at 1x speed
      const rate = (1.0 / 30) * playbackSpeed;
      setProgress((prev) => {
        const currentSlider = timelineToSlider(prev);
        const nextSlider = currentSlider + dt * rate;
        if (nextSlider >= 1.0) {
          setIsPlaying(false);
          return 2.0;
        }
        return sliderToTimeline(nextSlider);
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  // Canvas rendering loop
  const renderCanvas = useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      if (!width || !height || width <= 0 || height <= 0 || !Number.isFinite(width) || !Number.isFinite(height)) {
        return;
      }
      const cx = width / 2;
      const cy = height / 2;

      // Safe radial gradient creator to guarantee finite, non-negative numbers
      const createSafeRadialGradient = (
        x0: number,
        y0: number,
        r0: number,
        x1: number,
        y1: number,
        r1: number
      ) => {
        const safeX0 = Number.isFinite(x0) ? x0 : 0;
        const safeY0 = Number.isFinite(y0) ? y0 : 0;
        const safeR0 = Number.isFinite(r0) ? Math.max(0, r0) : 0;
        const safeX1 = Number.isFinite(x1) ? x1 : safeX0;
        const safeY1 = Number.isFinite(y1) ? y1 : safeY0;
        const safeR1 = Number.isFinite(r1) ? Math.max(0.001, r1) : Math.max(1, safeR0 + 1);
        return ctx.createRadialGradient(safeX0, safeY0, safeR0, safeX1, safeY1, safeR1);
      };

      // Clear dark cosmic background
      ctx.fillStyle = '#020510';
      ctx.fillRect(0, 0, width, height);

      // Subtle ambient background space dust
      const bgGrad = createSafeRadialGradient(cx, cy, 10, cx, cy, width * 0.7);
      bgGrad.addColorStop(0, '#060c22');
      bgGrad.addColorStop(0.6, '#030614');
      bgGrad.addColorStop(1, '#010309');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw faint background stars
      const starSeedCount = 70;
      for (let i = 0; i < starSeedCount; i++) {
        const sx = ((i * 137.5) % width);
        const sy = ((i * 249.7) % height);
        const radius = (i % 3 === 0) ? 1.2 : 0.7;
        const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(time * 0.001 + i));
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.5})`;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Subtle ambient orbital reference rings (very soft, no harsh straight crosshairs)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(width, height) * 0.38, 0, Math.PI * 2);
      ctx.stroke();

      const visualType = telemetry.current.visualType;
      const nextVisualType = telemetry.next.visualType;
      const alpha = telemetry.alpha;
      const tSec = time * 0.001;

      // Color helper
      const parseRgb = (rgbStr: string) => {
        const match = rgbStr.match(/\d+/g);
        if (match && match.length >= 3) {
          return { r: parseInt(match[0], 10), g: parseInt(match[1], 10), b: parseInt(match[2], 10) };
        }
        return { r: 255, g: 255, b: 255 };
      };
      const mainRgb = parseRgb(telemetry.interpolatedColor);
      const glowRgb = parseRgb(telemetry.interpolatedGlow);

      // Standardized constant radius for compact remnants and newborn collapse cores
      // Guarantees zero resizing stutters across planetary nebula / supernova / hypernova to remnants
      const REMNANT_RADIUS = 13;

      // Continuous smooth star radius calculation (No discrete jumps between normal star and giant, or blue dwarf to white dwarf!)
      // Continuous smooth star radius calculation directly mapped from astrophysics telemetry.interpolatedRadius
      // Zero hardcoded jumps; the visual star size directly corresponds to the astrophysical radius across 7 orders of magnitude!
      const getContinuousStarRadius = () => {
        const REMNANT_CORE_R = REMNANT_RADIUS; // 13px
        const maxPx = Math.min(width, height) * 0.35; // ~175px

        const R = Math.max(0.00001, telemetry.interpolatedRadius);
        // Degenerate remnants (white dwarfs, neutron stars, black holes) are at <= 0.015 R☉ and standardized to REMNANT_RADIUS
        const logR = Math.log10(R);
        // Logarithmic span from degenerate remnant core (~0.015 R☉, log10 = -1.824) to monster supergiant (1000 R☉, log10 = 3.0)
        const minLog = -1.824;
        const maxLog = 3.0;
        const norm = Math.max(0, Math.min(1, (logR - minLog) / (maxLog - minLog)));

        const pulse = Math.sin(tSec * 1.5) * (norm * 2.5);
        return REMNANT_CORE_R + norm * (maxPx - REMNANT_CORE_R) + pulse;
      };

      // Helper to draw realistic, isotropic, silky-smooth Star Model (NO straight rays, NO orb light, NO blotchy cells)
      const drawStarModel = (
        radius: number,
        opacity: number = 1.0,
        tempK: number = telemetry.interpolatedTemp
      ) => {
        if (opacity <= 0.01) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

        const starR = Math.max(12, radius);

        const isDyingStar =
          (nextVisualType === 'planetary-nebula' ||
            nextVisualType === 'supernova' ||
            nextVisualType === 'hypernova' ||
            nextVisualType === 'cooling-white-dwarf') &&
          progress >= 0.98;

        // When contracting during core collapse or into white dwarf, gently contract the outer corona with the shrinking star
        const coronaMultiplier = isDyingStar
          ? Math.max(0.2, 1 - ((progress - 0.98) / 0.02) * 0.8)
          : 1.0;

        // 1. Dual-Layer Volumetric Coronal Bloom (smooth atmospheric inverse-square radiance falloff)
        // Outer diffuse halo
        const outerHaloR = starR * 2.3;
        const outerHalo = createSafeRadialGradient(cx, cy, starR * 0.85, cx, cy, outerHaloR);
        outerHalo.addColorStop(0, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${0.26 * coronaMultiplier})`);
        outerHalo.addColorStop(0.45, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${0.08 * coronaMultiplier})`);
        outerHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = outerHalo;
        ctx.beginPath();
        ctx.arc(cx, cy, outerHaloR, 0, Math.PI * 2);
        ctx.fill();

        // Inner luminous corona
        const innerCoronaR = starR * 1.48;
        const innerCorona = createSafeRadialGradient(cx, cy, starR * 0.7, cx, cy, innerCoronaR);
        innerCorona.addColorStop(0, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${0.62 * coronaMultiplier})`);
        innerCorona.addColorStop(0.55, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${0.22 * coronaMultiplier})`);
        innerCorona.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = innerCorona;
        ctx.beginPath();
        ctx.arc(cx, cy, innerCoronaR, 0, Math.PI * 2);
        ctx.fill();

        // 2. Silky-Smooth Photosphere Disk with Radiant Luminous Edge (no dark circumference)
        const photoGrad = createSafeRadialGradient(cx, cy, 0, cx, cy, starR);
        // Central incandescent core emission
        photoGrad.addColorStop(0, '#ffffff');
        photoGrad.addColorStop(
          0.2,
          `rgba(${Math.min(255, mainRgb.r + 55)}, ${Math.min(255, mainRgb.g + 55)}, ${Math.min(255, mainRgb.b + 55)}, 1)`
        );
        photoGrad.addColorStop(0.6, telemetry.interpolatedColor);
        photoGrad.addColorStop(0.85, telemetry.interpolatedGlow);
        photoGrad.addColorStop(1, telemetry.interpolatedColor);

        ctx.fillStyle = photoGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, starR, 0, Math.PI * 2);
        ctx.fill();

        // Luminous radiant limb highlight - no dark circumference
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.restore();

        // 3. Delicate Magnetic Prominence Arches (subtle, soft loops flowing from limb)
        const loopCount = 4;
        for (let m = 0; m < loopCount; m++) {
          const baseAngle = (m / loopCount) * Math.PI * 2 + tSec * 0.08;
          const span = 0.24 + 0.08 * Math.sin(tSec * 1.1 + m);
          const angle1 = baseAngle;
          const angle2 = baseAngle + span;

          const p1x = cx + Math.cos(angle1) * (starR - 1);
          const p1y = cy + Math.sin(angle1) * (starR - 1);
          const p2x = cx + Math.cos(angle2) * (starR - 1);
          const p2y = cy + Math.sin(angle2) * (starR - 1);

          const midAngle = (angle1 + angle2) / 2;
          const loopH = starR + 8 + 10 * (0.5 + 0.5 * Math.sin(tSec * 1.3 + m * 2.1));
          const apexx = cx + Math.cos(midAngle) * loopH;
          const apexy = cy + Math.sin(midAngle) * loopH;

          ctx.strokeStyle = `rgba(${mainRgb.r}, ${mainRgb.g}, ${mainRgb.b}, 0.38)`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(p1x, p1y);
          ctx.quadraticCurveTo(apexx, apexy, p2x, p2y);
          ctx.stroke();
        }

        ctx.restore();
      };

      // -------------------------------------------------------------
      // 1. NEBULA / MOLECULAR CLOUD (GENTLE COLLAPSE & INFALL)
      // -------------------------------------------------------------
      if (visualType === 'nebula' || (visualType === 'protostar' && alpha < 0.3)) {
        const nebulaWeight = visualType === 'nebula' ? (nextVisualType === 'protostar' ? 1 - alpha : 1.0) : 0.3 - alpha;
        if (nebulaWeight > 0.01) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, nebulaWeight));

          const cloudRadius = Math.min(width, height) * (0.42 - alpha * 0.1);
          const cloudCount = 10;
          for (let i = 0; i < cloudCount; i++) {
            const angle = (i / cloudCount) * Math.PI * 2 + tSec * 0.04;
            const dist = cloudRadius * (0.28 + 0.32 * Math.sin(i * 1.5 + tSec * 0.1));
            const nx = cx + Math.cos(angle) * dist;
            const ny = cy + Math.sin(angle) * dist;
            const nr = cloudRadius * (0.42 + 0.08 * Math.sin(i * 2.1));

            const nGrad = createSafeRadialGradient(nx, ny, 0, nx, ny, nr);
            nGrad.addColorStop(0, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0.38)`);
            nGrad.addColorStop(0.55, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0.16)`);
            nGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = nGrad;
            ctx.beginPath();
            ctx.arc(nx, ny, nr, 0, Math.PI * 2);
            ctx.fill();
          }

          // Dense gravitational infall core condensation
          const coreR = (16 + 5 * Math.sin(tSec * 2)) * (1 + alpha * 0.5);
          const cGrad = createSafeRadialGradient(cx, cy, 0, cx, cy, coreR * 2.5);
          cGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          cGrad.addColorStop(0.35, `rgba(${mainRgb.r}, ${mainRgb.g}, ${mainRgb.b}, 0.65)`);
          cGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = cGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, coreR * 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Infalling curvilinear gas streamlets
          for (let p = 0; p < 14; p++) {
            const pAngle = (p / 14) * Math.PI * 2 + tSec * 0.25;
            const progressLoop = ((tSec * 0.35 + p * 0.12) % 1);
            const pDist = (cloudRadius * 0.75) * (1 - progressLoop);
            const px = cx + Math.cos(pAngle + progressLoop * 0.8) * pDist;
            const py = cy + Math.sin(pAngle + progressLoop * 0.8) * pDist;
            ctx.fillStyle = `rgba(${mainRgb.r}, ${mainRgb.g}, ${mainRgb.b}, ${0.7 * (1 - progressLoop)})`;
            ctx.beginPath();
            ctx.arc(px, py, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      }

      // -------------------------------------------------------------
      // 2. PROTOSTAR (ACCRETION DISK & SOFT BIPOLAR OUTFLOWS)
      // -------------------------------------------------------------
      if (visualType === 'protostar' || (nextVisualType === 'protostar' && visualType === 'nebula')) {
        const protoWeight = visualType === 'protostar'
          ? (nextVisualType === 'star' ? 1 - alpha : 1.0)
          : alpha;

        if (protoWeight > 0.01) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, protoWeight));

          // Soft Bipolar Outflow Cones (smooth gradients, NO straight line needle cuts)
          const jetLen = Math.min(width, height) * 0.44;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(Math.PI / 6);

          const jetGrad = ctx.createLinearGradient(0, -jetLen, 0, jetLen);
          jetGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
          jetGrad.addColorStop(0.3, `rgba(${mainRgb.r}, ${mainRgb.g}, ${mainRgb.b}, 0.6)`);
          jetGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
          jetGrad.addColorStop(0.7, `rgba(${mainRgb.r}, ${mainRgb.g}, ${mainRgb.b}, 0.6)`);
          jetGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = jetGrad;

          // Upper plume
          ctx.beginPath();
          ctx.moveTo(-5, 0);
          ctx.quadraticCurveTo(-18, -jetLen * 0.5, -28, -jetLen);
          ctx.lineTo(28, -jetLen);
          ctx.quadraticCurveTo(18, -jetLen * 0.5, 5, 0);
          ctx.closePath();
          ctx.fill();

          // Lower plume
          ctx.beginPath();
          ctx.moveTo(-5, 0);
          ctx.quadraticCurveTo(-18, jetLen * 0.5, -28, jetLen);
          ctx.lineTo(28, jetLen);
          ctx.quadraticCurveTo(18, jetLen * 0.5, 5, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          // Swirling Accretion Disk (Inclined Ellipse)
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(-Math.PI / 12);
          ctx.scale(1, 0.36);
          const diskR = Math.min(width, height) * 0.38;
          const diskGrad = createSafeRadialGradient(0, 0, 20, 0, 0, diskR);
          diskGrad.addColorStop(0, `rgba(${mainRgb.r}, ${mainRgb.g}, ${mainRgb.b}, 0.9)`);
          diskGrad.addColorStop(0.4, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0.65)`);
          diskGrad.addColorStop(0.75, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0.25)`);
          diskGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = diskGrad;
          ctx.beginPath();
          ctx.arc(0, 0, diskR, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Central Embryonic Core
          const protoR = 24 + 2 * Math.sin(tSec * 3);
          drawStarModel(protoR, protoWeight);

          ctx.restore();
        }
      }

      // -------------------------------------------------------------
      // 3. MAIN SEQUENCE STAR & GIANT (CONTINUOUS RESIZING WITHOUT STUTTERS)
      // -------------------------------------------------------------
      if (
        visualType === 'star' ||
        visualType === 'giant' ||
        (nextVisualType === 'star' && visualType === 'protostar')
      ) {
        const starR = getContinuousStarRadius();

        let opacity = 1.0;
        if (visualType === 'protostar') {
          opacity = alpha; // Fading in smoothly from protostar
        } else if (
          (visualType === 'giant' || visualType === 'star') &&
          (nextVisualType === 'planetary-nebula' ||
            nextVisualType === 'supernova' ||
            nextVisualType === 'hypernova')
        ) {
          // Keep the star solidly visible until star death (100%)
          // Seamlessly hands off to the remnant core right at 100%
          if (progress >= 0.995) {
            opacity = Math.max(0, 1 - (progress - 0.995) / 0.005);
          } else {
            opacity = 1.0;
          }
        }

        drawStarModel(starR, opacity);
      }

      // -------------------------------------------------------------
      // 4. PLANETARY NEBULA (EXPANDING GAS SHELLS & WHITE DWARF FORMATION)
      // -------------------------------------------------------------
      // Stellar death graphics begin expanding & fading in at 90% as the star shrinks (official star death at 100%)
      const isPnActive =
        visualType === 'planetary-nebula' ||
        (visualType === 'giant' && nextVisualType === 'planetary-nebula' && progress >= 0.90);

      if (isPnActive) {
        let pnAlpha = 1.0;
        let expansion = 0.0;

        if (visualType === 'giant') {
          // Pre-death dynamic envelope detachment between 90% and 100%
          const preDeathFade = Math.max(0, Math.min(1, (progress - 0.90) / 0.10));
          pnAlpha = preDeathFade;
          expansion = preDeathFade * 0.45; // Dynamic billowing expansion during envelope shedding
        } else if (visualType === 'planetary-nebula') {
          if (nextVisualType === 'cooling-white-dwarf') {
            pnAlpha = Math.max(0, 1 - alpha * 0.92);
            expansion = 0.45 + alpha * 0.55; // Continues expanding seamlessly into deep space
          } else {
            pnAlpha = 1.0;
            expansion = 0.45;
          }
        }

        if (pnAlpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = pnAlpha;

          const maxShellR = Math.min(width, height) * (0.22 + expansion * 0.38);

          // Outer Red [H-alpha] Ionized Gas Envelope with billowing multi-harmonic undulations
          const rOuter = maxShellR * (0.85 + 0.05 * Math.sin(tSec * 1.8 + expansion * 6.0));
          const gradRed = createSafeRadialGradient(cx, cy, rOuter * 0.65, cx, cy, rOuter);
          gradRed.addColorStop(0, 'rgba(239, 68, 68, 0)');
          gradRed.addColorStop(0.55, 'rgba(239, 68, 68, 0.45)');
          gradRed.addColorStop(0.85, 'rgba(220, 38, 38, 0.65)');
          gradRed.addColorStop(1, 'rgba(185, 28, 28, 0)');
          ctx.fillStyle = gradRed;
          ctx.beginPath();
          ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
          ctx.fill();

          // Mid Green-Emerald [N II] Ionized Layer
          const rMid = maxShellR * 0.62;
          const gradGreen = createSafeRadialGradient(cx, cy, rMid * 0.5, cx, cy, rMid);
          gradGreen.addColorStop(0, 'rgba(16, 185, 129, 0)');
          gradGreen.addColorStop(0.7, 'rgba(16, 185, 129, 0.45)');
          gradGreen.addColorStop(1, 'rgba(5, 150, 105, 0)');
          ctx.fillStyle = gradGreen;
          ctx.beginPath();
          ctx.arc(cx, cy, rMid, 0, Math.PI * 2);
          ctx.fill();

          // Inner Turquoise Cyan [O III] Glowing Ring
          const rInner = maxShellR * 0.42;
          const gradCyan = createSafeRadialGradient(cx, cy, rInner * 0.25, cx, cy, rInner);
          gradCyan.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
          gradCyan.addColorStop(0.65, 'rgba(6, 182, 212, 0.7)');
          gradCyan.addColorStop(1, 'rgba(8, 145, 178, 0)');
          ctx.fillStyle = gradCyan;
          ctx.beginPath();
          ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
          ctx.fill();

          // Dynamic expanding ionized gas clumps / knots billowing outward
          const clumpCount = 10;
          for (let k = 0; k < clumpCount; k++) {
            const kAngle = (k / clumpCount) * Math.PI * 2 + tSec * 0.12 + k * 0.4;
            const kDist = maxShellR * (0.38 + 0.52 * ((expansion * 1.3 + k * 0.15) % 1.0));
            const kx = cx + Math.cos(kAngle) * kDist;
            const ky = cy + Math.sin(kAngle) * kDist;
            const kr = Math.max(8, maxShellR * 0.15);
            const kGrad = createSafeRadialGradient(kx, ky, 0, kx, ky, kr);
            kGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
            kGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.22)');
            kGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
            ctx.fillStyle = kGrad;
            ctx.beginPath();
            ctx.arc(kx, ky, kr, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }

        // Central Ultra-Hot Nascent White Dwarf Core (Emerges as star finishes shrinking at 100%)
        const coreAlpha =
          visualType === 'giant'
            ? Math.max(0, Math.min(1, (progress - 0.97) / 0.03))
            : 1.0;

        if (coreAlpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = coreAlpha;

          const coreGlow = createSafeRadialGradient(cx, cy, REMNANT_RADIUS * 0.5, cx, cy, REMNANT_RADIUS * 2.6);
          coreGlow.addColorStop(0, '#ffffff');
          coreGlow.addColorStop(0.4, '#38bdf8');
          coreGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
          ctx.fillStyle = coreGlow;
          ctx.beginPath();
          ctx.arc(cx, cy, REMNANT_RADIUS * 2.6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx, cy, REMNANT_RADIUS, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      // -------------------------------------------------------------
      // 5. SUPERNOVA EXPLOSION (CORE-COLLAPSE SHOCKWAVE & NEUTRON STAR FORMATION)
      // -------------------------------------------------------------
      // Stellar death graphics begin expanding & fading in as core collapse reaches surface (official star death at 100%)
      const isSnActive =
        visualType === 'supernova' ||
        (visualType === 'giant' && nextVisualType === 'supernova' && progress >= 0.98);

      if (isSnActive) {
        let snAlpha = 1.0;
        let expansion = 0.0;

        if (visualType === 'giant') {
          // Pre-death shock breakout between 98% and 100%
          const preDeathFade = Math.max(0, Math.min(1, (progress - 0.98) / 0.02));
          snAlpha = preDeathFade;
          expansion = preDeathFade * 0.50; // Dynamic blast wave expansion during shock breakout
        } else if (visualType === 'supernova') {
          if (nextVisualType === 'pulsar') {
            snAlpha = Math.max(0, 1 - alpha * 0.92);
            expansion = 0.50 + alpha * 0.50; // Continues expanding seamlessly into deep space
          } else {
            snAlpha = 1.0;
            expansion = 0.50;
          }
        }

        if (snAlpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = snAlpha;

          // Expand blast front outward, while ensuring the inner cavity stays clear of the shrinking supergiant core
          const blastR = Math.min(width, height) * (0.24 + expansion * 0.46);
          const innerCavityR = Math.max(REMNANT_RADIUS * 2.2, blastR * 0.62);

          // Multi-harmonic turbulent shock front with evacuated inner cavity
          const shockGrad = createSafeRadialGradient(cx, cy, innerCavityR, cx, cy, blastR);
          shockGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          shockGrad.addColorStop(0.3, 'rgba(147, 197, 253, 0.25)');
          shockGrad.addColorStop(0.65, 'rgba(59, 130, 246, 0.7)');
          shockGrad.addColorStop(0.88, 'rgba(239, 68, 68, 0.5)');
          shockGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');
          ctx.fillStyle = shockGrad;

          ctx.beginPath();
          const steps = 48;
          for (let s = 0; s <= steps; s++) {
            const sAngle = (s / steps) * Math.PI * 2;
            const undulation =
              1 +
              0.09 * Math.sin(sAngle * 7 + tSec * 3.2 + expansion * 8.0) +
              0.05 * Math.cos(sAngle * 11 - tSec * 2.0);
            const r = blastR * undulation;
            const sx = cx + Math.cos(sAngle) * r;
            const sy = cy + Math.sin(sAngle) * r;
            if (s === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          // Cut out inner cavity so it's a true hollow expanding shell that never obscures the shrinking star inside!
          for (let s = steps; s >= 0; s--) {
            const sAngle = (s / steps) * Math.PI * 2;
            const sx = cx + Math.cos(sAngle) * innerCavityR;
            const sy = cy + Math.sin(sAngle) * innerCavityR;
            ctx.lineTo(sx, sy);
          }
          ctx.closePath();
          ctx.fill();

          // Expanding curved plasma filaments riding outward on the shell
          for (let w = 0; w < 12; w++) {
            const wAngle = (w / 12) * Math.PI * 2 + tSec * 0.22 + w * 0.2;
            const wDist = innerCavityR + (blastR - innerCavityR) * (0.42 + 0.35 * Math.sin(w * 1.7 + tSec));
            const wx = cx + Math.cos(wAngle) * wDist;
            const wy = cy + Math.sin(wAngle) * wDist;
            const filamentR = Math.max(12, (blastR - innerCavityR) * 0.34);
            const wGrad = createSafeRadialGradient(wx, wy, 0, wx, wy, filamentR);
            wGrad.addColorStop(0, 'rgba(224, 242, 254, 0.65)');
            wGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.3)');
            wGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
            ctx.fillStyle = wGrad;
            ctx.beginPath();
            ctx.arc(wx, wy, filamentR, 0, Math.PI * 2);
            ctx.fill();
          }

          // Core-bounce neutrino rebound shock flash (peaks right at 99%–100%)
          const bouncePeak = 1.0 - Math.min(1, Math.abs(progress - 1.0) / 0.05);
          if (bouncePeak > 0.01) {
            const flashR = REMNANT_RADIUS * (2.2 + bouncePeak * 4.5);
            const flashGrad = createSafeRadialGradient(cx, cy, 0, cx, cy, flashR);
            flashGrad.addColorStop(0, '#ffffff');
            flashGrad.addColorStop(0.35, 'rgba(191, 219, 254, 0.8)');
            flashGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');
            ctx.fillStyle = flashGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, flashR, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }

        // Central Collapsed Neutron Core (Emerges as star finishes shrinking at 100%)
        const coreAlpha =
          visualType === 'giant'
            ? Math.max(0, Math.min(1, (progress - 0.97) / 0.03))
            : 1.0;

        if (coreAlpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = coreAlpha;

          const nsGlow = createSafeRadialGradient(cx, cy, REMNANT_RADIUS * 0.5, cx, cy, REMNANT_RADIUS * 2.6);
          nsGlow.addColorStop(0, '#ffffff');
          nsGlow.addColorStop(0.4, '#38bdf8');
          nsGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
          ctx.fillStyle = nsGlow;
          ctx.beginPath();
          ctx.arc(cx, cy, REMNANT_RADIUS * 2.6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx, cy, REMNANT_RADIUS, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      // -------------------------------------------------------------
      // 6. HYPERNOVA / COLLAPSAR & RELATIVISTIC GRB JETS
      // -------------------------------------------------------------
      // Stellar death graphics begin expanding & fading in as core collapse reaches surface (official star death at 100%)
      const isHnActive =
        visualType === 'hypernova' ||
        ((visualType === 'giant' || visualType === 'star') && nextVisualType === 'hypernova' && progress >= 0.98);

      if (isHnActive) {
        let hAlpha = 1.0;
        let expansion = 0.0;

        if (visualType === 'giant' || visualType === 'star') {
          // Pre-death violent collapsar breakout between 98% and 100%
          const preDeathFade = Math.max(0, Math.min(1, (progress - 0.98) / 0.02));
          hAlpha = preDeathFade;
          expansion = preDeathFade * 0.50; // Dynamic jet punching & torus eruption
        } else if (visualType === 'hypernova') {
          if (nextVisualType === 'black-hole') {
            hAlpha = Math.max(0, 1 - alpha * 0.92);
            expansion = 0.50 + alpha * 0.50; // Continues expanding seamlessly into deep space
          } else {
            hAlpha = 1.0;
            expansion = 0.50;
          }
        }

        if (hAlpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = hAlpha;

          // Polar Jet reach punches outward from nascent core to deep space
          const jetHeight = Math.min(width, height) * (0.16 + expansion * 0.54);

          ctx.save();
          ctx.translate(cx, cy);

          // Relativistic Polar Jet Breakout (Smooth Gaussian falloff beams)
          // Starts with clear nozzle space around the event horizon
          const jetNozzleGap = REMNANT_RADIUS * 1.6;
          const grbGrad = ctx.createLinearGradient(0, -jetHeight, 0, jetHeight);
          grbGrad.addColorStop(0, 'rgba(244, 63, 94, 0)');
          grbGrad.addColorStop(0.2, 'rgba(251, 113, 133, 0.9)');
          grbGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
          grbGrad.addColorStop(0.8, 'rgba(251, 113, 133, 0.9)');
          grbGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
          ctx.fillStyle = grbGrad;

          ctx.beginPath();
          ctx.moveTo(-4, -jetNozzleGap);
          ctx.quadraticCurveTo(-12, -jetHeight * 0.5, -24, -jetHeight);
          ctx.lineTo(24, -jetHeight);
          ctx.quadraticCurveTo(12, -jetHeight * 0.5, 4, -jetNozzleGap);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(-4, jetNozzleGap);
          ctx.quadraticCurveTo(-12, jetHeight * 0.5, -24, jetHeight);
          ctx.lineTo(24, jetHeight);
          ctx.quadraticCurveTo(12, jetHeight * 0.5, 4, jetNozzleGap);
          ctx.closePath();
          ctx.fill();

          // Relativistic collimated jet knots streaming at 0.99999c along both poles
          const knotCount = 6;
          for (let k = 0; k < knotCount; k++) {
            const knotPhase = (tSec * 3.5 + k / knotCount + expansion * 2.0) % 1.0;
            const knotY = jetNozzleGap + knotPhase * (jetHeight - jetNozzleGap);
            const knotW = 2.8 + 1.8 * Math.sin(knotPhase * Math.PI);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            // North jet knot
            ctx.beginPath();
            ctx.arc(0, -knotY, knotW, 0, Math.PI * 2);
            ctx.fill();
            // South jet knot
            ctx.beginPath();
            ctx.arc(0, knotY, knotW, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();

          // Equatorial Blast Torus with expanded space around the black hole
          const blastR = Math.min(width, height) * (0.22 + expansion * 0.44);
          const innerTorusHole = Math.max(REMNANT_RADIUS * 2.2, blastR * 0.62);
          const bGrad = createSafeRadialGradient(cx, cy, innerTorusHole, cx, cy, blastR);
          bGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          bGrad.addColorStop(0.35, 'rgba(244, 63, 94, 0.45)');
          bGrad.addColorStop(0.7, 'rgba(217, 70, 239, 0.7)');
          bGrad.addColorStop(1, 'rgba(126, 34, 206, 0)');
          ctx.fillStyle = bGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, blastR, 0, Math.PI * 2);
          ctx.arc(cx, cy, innerTorusHole, 0, Math.PI * 2, true); // True hollow torus cut-out so shrinking hypergiant is visible!
          ctx.fill();

          // Ultra-energetic GRB singularity puncture flash (peaks right at 99%–100%)
          const grbFlash = 1.0 - Math.min(1, Math.abs(progress - 1.0) / 0.05);
          if (grbFlash > 0.01) {
            const flashR = REMNANT_RADIUS * (2.2 + grbFlash * 5.0);
            const flashGrad = createSafeRadialGradient(cx, cy, 0, cx, cy, flashR);
            flashGrad.addColorStop(0, '#ffffff');
            flashGrad.addColorStop(0.35, 'rgba(254, 205, 211, 0.85)');
            flashGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
            ctx.fillStyle = flashGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, flashR, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }

        // Central Singularity Collapse Core (Emerges as hypergiant/Wolf-Rayet core finishes collapse at 100%)
        if (nextVisualType !== 'black-hole') {
          const coreAlpha =
            (visualType === 'giant' || visualType === 'star')
              ? Math.max(0, Math.min(1, (progress - 0.98) / 0.02))
              : 1.0;

          if (coreAlpha > 0.01) {
            ctx.save();
            ctx.globalAlpha = coreAlpha;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(cx, cy, REMNANT_RADIUS, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // -------------------------------------------------------------
      // 7. COOLING WHITE DWARF (SLIDING THROUGH OBAFGKM+ THERMAL SEQUENCE)
      // -------------------------------------------------------------
      if (visualType === 'cooling-white-dwarf') {
        const wdR = REMNANT_RADIUS; // Standardized constant radius (13px)
        const tempK = telemetry.interpolatedTemp;

        const haloFactor = Math.min(1.0, Math.max(0.04, (tempK - 500) / 25000));
        const wdGlowR = wdR * (1.8 + haloFactor * 2.2);

        ctx.save();

        if (haloFactor > 0.05) {
          const wdGlow = createSafeRadialGradient(cx, cy, wdR * 0.5, cx, cy, wdGlowR);
          wdGlow.addColorStop(0, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${0.55 * haloFactor})`);
          wdGlow.addColorStop(0.5, `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${0.2 * haloFactor})`);
          wdGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = wdGlow;
          ctx.beginPath();
          ctx.arc(cx, cy, wdGlowR, 0, Math.PI * 2);
          ctx.fill();
        }

        // Silky-smooth photosphere disk
        const wdSphere = createSafeRadialGradient(cx, cy, 0, cx, cy, wdR);
        if (tempK > 5000) {
          wdSphere.addColorStop(0, '#ffffff');
          wdSphere.addColorStop(0.35, telemetry.interpolatedColor);
        } else {
          wdSphere.addColorStop(0, `rgba(${Math.min(255, mainRgb.r + 40)}, ${Math.min(255, mainRgb.g + 40)}, ${Math.min(255, mainRgb.b + 40)}, 1)`);
          wdSphere.addColorStop(0.4, telemetry.interpolatedColor);
        }
        wdSphere.addColorStop(0.8, telemetry.interpolatedGlow);
        wdSphere.addColorStop(1, telemetry.interpolatedColor);

        ctx.fillStyle = wdSphere;
        ctx.beginPath();
        ctx.arc(cx, cy, wdR, 0, Math.PI * 2);
        ctx.fill();

        // Luminous radiant limb highlight - no dark circumference
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      }

      // -------------------------------------------------------------
      // 8. BLACK DWARF (FINAL COLD STASIS MONOLITH)
      // -------------------------------------------------------------
      if (visualType === 'black-dwarf') {
        const bdR = REMNANT_RADIUS; // Standardized constant radius (13px)

        ctx.save();

        // Faint ambient starlight refraction rim
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, bdR, 0, Math.PI * 2);
        ctx.stroke();

        // Pure pitch-black interior
        ctx.fillStyle = '#020409';
        ctx.beginPath();
        ctx.arc(cx, cy, bdR, 0, Math.PI * 2);
        ctx.fill();

        // Specular highlight on crystallized carbon surface
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath();
        ctx.arc(cx - bdR * 0.35, cy - bdR * 0.35, 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // -------------------------------------------------------------
      // 9. NEUTRON STAR / PULSAR & DECAYING BEACON
      // -------------------------------------------------------------
      if (visualType === 'pulsar') {
        const isFadingToCold = nextVisualType === 'cold-neutron-star';
        // When approaching cold neutron star, rotation slows down drastically, lighthouse beacon fades, magnetic loops decay
        const spinSpeed = isFadingToCold ? 6 * Math.max(0.1, 1 - alpha * 0.85) : 6;
        const beamAngle = tSec * spinSpeed;
        const beamFade = isFadingToCold ? Math.max(0, 1 - alpha) : 1.0;
        const beamLen = Math.min(width, height) * 0.44 * (isFadingToCold ? 1 - alpha * 0.6 : 1.0);

        ctx.save();

        if (beamFade > 0.01) {
          // Twin Relativistic Synchrotron Beams (Lighthouse)
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(beamAngle);

          const bGrad = ctx.createLinearGradient(0, -beamLen, 0, beamLen);
          bGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
          bGrad.addColorStop(0.3, `rgba(103, 232, 249, ${0.85 * beamFade})`);
          bGrad.addColorStop(0.5, `rgba(255, 255, 255, ${beamFade})`);
          bGrad.addColorStop(0.7, `rgba(103, 232, 249, ${0.85 * beamFade})`);
          bGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
          ctx.fillStyle = bGrad;

          ctx.beginPath();
          ctx.moveTo(-2, 0);
          ctx.lineTo(-20, -beamLen);
          ctx.lineTo(20, -beamLen);
          ctx.lineTo(2, 0);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(-2, 0);
          ctx.lineTo(-20, beamLen);
          ctx.lineTo(20, beamLen);
          ctx.lineTo(2, 0);
          ctx.fill();

          // Magnetic dipole loops (decaying with alpha toward 0)
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.35 * beamFade})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(0, 0, 32, 14, 0, 0, Math.PI * 2);
          ctx.stroke();

          ctx.restore();

          // Concentric pulsating radio waves (decaying toward 0)
          const waveR = (tSec * 60) % (beamLen * 0.7);
          ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, 1 - waveR / (beamLen * 0.7)) * 0.4 * beamFade})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx, cy, waveR, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Ultra-dense blue-white core (Standardized REMNANT_RADIUS = 13)
        const nsR = REMNANT_RADIUS;
        const glowFactor = isFadingToCold ? Math.max(0.1, 1 - alpha * 0.9) : 1.0;

        if (glowFactor > 0.05) {
          const nsGlow = createSafeRadialGradient(cx, cy, nsR * 0.5, cx, cy, nsR * 2.6);
          nsGlow.addColorStop(0, `rgba(255, 255, 255, ${glowFactor})`);
          nsGlow.addColorStop(0.4, `rgba(56, 189, 248, ${glowFactor * 0.8})`);
          nsGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
          ctx.fillStyle = nsGlow;
          ctx.beginPath();
          ctx.arc(cx, cy, nsR * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }

        if (isFadingToCold) {
          // Cross-fade core color from hot white to cold slate
          const rSlate = Math.round(255 * (1 - alpha) + 11 * alpha);
          const gSlate = Math.round(255 * (1 - alpha) + 17 * alpha);
          const bSlate = Math.round(255 * (1 - alpha) + 32 * alpha);
          ctx.fillStyle = `rgb(${rSlate}, ${gSlate}, ${bSlate})`;
        } else {
          ctx.fillStyle = '#ffffff';
        }
        ctx.beginPath();
        ctx.arc(cx, cy, nsR, 0, Math.PI * 2);
        ctx.fill();

        // Luminous radiant limb highlight - no dark circumference
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      }

      // -------------------------------------------------------------
      // 9b. COLD NEUTRON STAR (EXTINGUISHED BEACON, BLACK MONUMENT)
      //     Directly matches black dwarf phase for a star!
      // -------------------------------------------------------------
      if (visualType === 'cold-neutron-star') {
        const nsR = REMNANT_RADIUS; // Standardized constant radius (13px)

        ctx.save();

        // 1. Extreme Gravitational Light Lensing Rim (Bends ambient starlight without active emission)
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, nsR, 0, Math.PI * 2);
        ctx.stroke();

        // 2. Pitch-Cold Degenerate Nuclear Matter Interior (Zero emission, cold stasis with CMB)
        ctx.fillStyle = '#060a14';
        ctx.beginPath();
        ctx.arc(cx, cy, nsR, 0, Math.PI * 2);
        ctx.fill();

        // 3. Subtle Specular Highlight on Solid Crystalline Crust (Nuclear Pasta Lattice)
        ctx.fillStyle = 'rgba(186, 230, 253, 0.3)';
        ctx.beginPath();
        ctx.arc(cx - nsR * 0.35, cy - nsR * 0.35, 1.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // -----------------------------------------------------------------------
      // 10. STELLAR-MASS BLACK HOLE (REALISTIC GENERAL RELATIVISTIC MODEL)
      //     Accurate Kerr Shadow, Multi-Order Photon Rings, Dual Einstein Lensing
      //     Canopies, ISCO Gap, Relativistic Plunge Region, and Doppler Beaming
      // -----------------------------------------------------------------------
      const isBhActive =
        visualType === 'black-hole' ||
        (visualType === 'hypernova' && nextVisualType === 'black-hole');

      if (isBhActive) {
        const bhR = REMNANT_RADIUS; // Standardized Event Horizon core radius (13px)
        const rShadow = bhR * 1.38; // Apparent Shadow Boundary (~18px, photon capture sphere)
        const rISCO = bhR * 2.15; // Innermost Stable Circular Orbit (~28px)
        const rDiskOut = Math.min(width, height) * 0.36; // Outer Accretion Disk Boundary
        const diskAspect = 0.32; // Inclination projection factor
        const diskTilt = -Math.PI / 10 + Math.sin(tSec * 0.5) * 0.02;
        const bhAlpha = visualType === 'black-hole' ? 1.0 : Math.min(1, alpha * 1.15);

        ctx.save();
        ctx.globalAlpha = bhAlpha;

        // In the isolated final black hole phase (progress from 1.0 to 2.0), accretion disk is gradually exhausted
        const isIsolated = visualType === 'black-hole' && telemetry.current.progress >= 1.98;
        const isFadingDisk = visualType === 'black-hole' && nextVisualType === 'black-hole' && telemetry.current.progress < 1.98;
        const diskFade = isIsolated ? 0.0 : isFadingDisk ? Math.max(0, 1 - alpha) : 1.0;

        // -------------------------------------------------------------
        // 1. RELATIVISTIC BIPOLAR JETS (Blandford-Znajek Outflow)
        // -------------------------------------------------------------
        if (diskFade > 0.03) {
          ctx.save();
          ctx.globalAlpha = bhAlpha * diskFade * 0.85;

          const jetLen = Math.min(width, height) * 0.42;

          // Diffuse synchrotron glow lobes
          const jetUp = createSafeRadialGradient(cx, cy - jetLen * 0.5, 4, cx, cy - jetLen * 0.5, jetLen * 0.6);
          jetUp.addColorStop(0, 'rgba(99, 102, 241, 0.28)');
          jetUp.addColorStop(0.5, 'rgba(56, 189, 248, 0.09)');
          jetUp.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = jetUp;
          ctx.fillRect(cx - 45, cy - jetLen, 90, jetLen);

          const jetDn = createSafeRadialGradient(cx, cy + jetLen * 0.5, 4, cx, cy + jetLen * 0.5, jetLen * 0.6);
          jetDn.addColorStop(0, 'rgba(99, 102, 241, 0.28)');
          jetDn.addColorStop(0.5, 'rgba(56, 189, 248, 0.09)');
          jetDn.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = jetDn;
          ctx.fillRect(cx - 45, cy, 90, jetLen);

          // Helical magnetic field flux ropes wrapping the jet column
          ctx.lineWidth = 1.1;
          for (let dir = -1; dir <= 1; dir += 2) {
            ctx.strokeStyle = dir === 1 ? 'rgba(129, 140, 248, 0.38)' : 'rgba(56, 189, 248, 0.32)';
            ctx.beginPath();
            for (let t = 12; t < jetLen; t += 3) {
              const helixAngle = t * 0.14 - tSec * 4.2 * dir;
              const helixR = t * 0.055 + 1.8;
              const hx = cx + Math.cos(helixAngle) * helixR;
              const hy = cy - t * dir;
              if (t === 12) ctx.moveTo(hx, hy);
              else ctx.lineTo(hx, hy);
            }
            ctx.stroke();
          }

          // Traveling Mach diamond shock nodes
          for (const knot of BH_JET_KNOTS) {
            const currentDist = (knot.dist + tSec * knot.speed) % (jetLen * 0.95) + 14;
            const jetY = cy - currentDist * knot.dir;
            const jetSpread = currentDist * 0.045;
            const jx = cx + Math.sin(tSec * 2.5 + currentDist * 0.12) * jetSpread;

            ctx.fillStyle = knot.dir === 1 ? '#ffffff' : '#c7d2fe';
            ctx.beginPath();
            ctx.arc(jx, jetY, knot.size * 0.85, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        if (diskFade > 0.01) {
          ctx.save();
          ctx.globalAlpha = bhAlpha * diskFade;

          // -------------------------------------------------------------
          // 2. RELATIVISTIC GRAVITATIONAL LENSING: UPPER EINSTEIN CANOPY
          //    The back half of the accretion disk deflected over the horizon
          // -------------------------------------------------------------
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(diskTilt);

          const canopyBands = 4;
          for (let b = canopyBands - 1; b >= 0; b--) {
            const r0 = rISCO + (b / canopyBands) * (rDiskOut - rISCO);
            const r1 = rISCO + ((b + 1) / canopyBands) * (rDiskOut - rISCO);

            // Deflection apex heights over the horizon
            const h0 = rShadow * 1.04 + (r0 - rISCO) * 0.65;
            const h1 = rShadow * 1.04 + (r1 - rISCO) * 0.65;

            // Relativistic Doppler gradient across the lensed band
            const bandGrad = ctx.createLinearGradient(-r1, 0, r1, 0);
            if (b === 0) {
              // Searing inner ISCO layer (T ~ 10^7 K, blueshifted X-ray / UV peak)
              bandGrad.addColorStop(0, '#ffffff'); // Approaching left peak
              bandGrad.addColorStop(0.2, '#cffafe');
              bandGrad.addColorStop(0.42, '#38bdf8');
              bandGrad.addColorStop(0.7, '#6366f1');
              bandGrad.addColorStop(0.88, '#9f1239'); // Receding right redshift
              bandGrad.addColorStop(1, 'rgba(159, 18, 57, 0.1)');
            } else if (b === 1 || b === 2) {
              bandGrad.addColorStop(0, '#e0f2fe');
              bandGrad.addColorStop(0.22, '#38bdf8');
              bandGrad.addColorStop(0.46, '#6366f1');
              bandGrad.addColorStop(0.76, '#4338ca');
              bandGrad.addColorStop(0.92, '#881337');
              bandGrad.addColorStop(1, 'rgba(136, 19, 55, 0.08)');
            } else {
              bandGrad.addColorStop(0, '#38bdf8');
              bandGrad.addColorStop(0.25, '#818cf8');
              bandGrad.addColorStop(0.5, '#4f46e5');
              bandGrad.addColorStop(0.8, '#312e81');
              bandGrad.addColorStop(0.95, '#4c0519');
              bandGrad.addColorStop(1, 'rgba(76, 5, 25, 0.03)');
            }

            ctx.fillStyle = bandGrad;
            ctx.beginPath();
            ctx.moveTo(-r1, 0);
            ctx.bezierCurveTo(-r1 * 0.7, -h1 * 1.06, r1 * 0.7, -h1 * 1.06, r1, 0);
            ctx.lineTo(r0, 0);
            ctx.bezierCurveTo(r0 * 0.7, -h0 * 1.06, -r0 * 0.7, -h0 * 1.06, -r0, 0);
            ctx.closePath();
            ctx.fill();
          }

          // Sharp caustic rim on upper canopy
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(-rISCO, 0);
          ctx.bezierCurveTo(-rISCO * 0.7, -rShadow * 1.12, rISCO * 0.7, -rShadow * 1.12, rISCO, 0);
          ctx.stroke();

          // -------------------------------------------------------------
          // 3. RELATIVISTIC GRAVITATIONAL LENSING: LOWER EINSTEIN CRESCENT
          // -------------------------------------------------------------
          const lowerH0 = rShadow * 1.05;
          const lowerH1 = rShadow * 1.05 + (rDiskOut - rISCO) * 0.22;
          const lowerGrad = ctx.createLinearGradient(-rDiskOut * 0.8, 0, rDiskOut * 0.8, 0);
          lowerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
          lowerGrad.addColorStop(0.25, 'rgba(103, 232, 249, 0.75)');
          lowerGrad.addColorStop(0.55, 'rgba(99, 102, 241, 0.42)');
          lowerGrad.addColorStop(0.85, 'rgba(159, 18, 57, 0.22)');
          lowerGrad.addColorStop(1, 'rgba(159, 18, 57, 0.03)');

          ctx.fillStyle = lowerGrad;
          ctx.beginPath();
          ctx.moveTo(-rDiskOut * 0.82, 0);
          ctx.bezierCurveTo(-rDiskOut * 0.55, lowerH1 * 1.1, rDiskOut * 0.55, lowerH1 * 1.1, rDiskOut * 0.82, 0);
          ctx.lineTo(rISCO * 1.12, 0);
          ctx.bezierCurveTo(rISCO * 0.65, lowerH0 * 1.1, -rISCO * 0.65, lowerH0 * 1.1, -rISCO * 1.12, 0);
          ctx.closePath();
          ctx.fill();

          // -------------------------------------------------------------
          // 4. BACK HALF OF EQUATORIAL DISK (ANNULUS SEGMENT: y < 0)
          //    Leaves the central cavity inside ISCO completely clear!
          // -------------------------------------------------------------
          ctx.save();
          ctx.scale(1, diskAspect);

          const backDiskGrad = ctx.createLinearGradient(-rDiskOut, 0, rDiskOut, 0);
          backDiskGrad.addColorStop(0, '#ffffff');
          backDiskGrad.addColorStop(0.2, '#67e8f9');
          backDiskGrad.addColorStop(0.42, '#38bdf8');
          backDiskGrad.addColorStop(0.68, '#4338ca');
          backDiskGrad.addColorStop(0.88, '#9f1239');
          backDiskGrad.addColorStop(1, 'rgba(63, 7, 19, 0.05)');

          ctx.fillStyle = backDiskGrad;
          ctx.beginPath();
          ctx.arc(0, 0, rDiskOut, Math.PI, 0, false);
          ctx.arc(0, 0, rISCO, 0, Math.PI, true);
          ctx.closePath();
          ctx.fill();

          // Concentric Keplerian differential shear rings
          ctx.lineWidth = 0.9;
          for (let sRing = 1; sRing <= 3; sRing++) {
            const rad = rISCO + sRing * ((rDiskOut - rISCO) / 4);
            ctx.strokeStyle = `rgba(103, 232, 249, ${(0.16 / sRing).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(0, 0, rad, Math.PI, 0, false);
            ctx.stroke();
          }

          // Back half of spiral density waves
          for (let arm = 0; arm < 2; arm++) {
            const armOffset = arm * Math.PI + tSec * 1.5;
            ctx.strokeStyle = arm === 0 ? 'rgba(255, 255, 255, 0.35)' : 'rgba(56, 189, 248, 0.25)';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            for (let t = 0; t <= 24; t++) {
              const th = (t / 24) * Math.PI * 1.6 + armOffset;
              const rad = rISCO + (t / 24) * (rDiskOut - rISCO);
              const sx = Math.cos(th) * rad;
              const sy = Math.sin(th) * rad;
              if (sy < 1.5) {
                if (t === 0) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
              }
            }
            ctx.stroke();
          }
          ctx.restore();

          ctx.restore(); // Restore inclination frame
          ctx.restore(); // Restore diskFade save
        }

        // -------------------------------------------------------------
        // 5. RELATIVISTIC PLUNGE REGION (Inside ISCO down to Horizon)
        // -------------------------------------------------------------
        if (diskFade > 0.05) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(diskTilt);
          ctx.scale(1, diskAspect * 1.25);
          for (let sp = 0; sp < 7; sp++) {
            const streamAngle = (sp / 7) * Math.PI * 2 + tSec * 3.6;
            ctx.beginPath();
            for (let st = 0; st <= 14; st++) {
              const prog = st / 14;
              const rad = rISCO * (1 - prog) + rShadow * prog;
              const th = streamAngle + prog * 1.7;
              const px = Math.cos(th) * rad;
              const py = Math.sin(th) * rad;

              const pAlpha = (1 - prog) * 0.65 * diskFade;
              ctx.strokeStyle = `rgba(103, 232, 249, ${pAlpha.toFixed(3)})`;
              ctx.lineWidth = 1.3 * (1 - prog);

              if (st === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.stroke();
          }
          ctx.restore();
        }

        // -------------------------------------------------------------
        // 6. THE MULTI-ORDER PHOTON RINGS (n = 1, n = 2 Caustics)
        // -------------------------------------------------------------
        ctx.save();
        // Secondary n=2 inner photon sub-ring (photons orbiting 360°)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(cx, cy, rShadow * 0.98, 0, Math.PI * 2);
        ctx.stroke();

        // Primary n=1 razor-sharp caustic ring (photons orbiting 180°)
        const photonPulse = 0.88 + 0.12 * Math.sin(tSec * 4.0);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.95 * photonPulse).toFixed(3)})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(cx, cy, rShadow * 1.02, 0, Math.PI * 2);
        ctx.stroke();

        // Relativistic Doppler asymmetric booster on approaching side
        const ringGlow = createSafeRadialGradient(cx - rShadow * 0.35, cy, rShadow * 0.4, cx, cy, rShadow * 1.2);
        ringGlow.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        ringGlow.addColorStop(0.35, 'rgba(103, 232, 249, 0.55)');
        ringGlow.addColorStop(0.7, 'rgba(56, 189, 248, 0.2)');
        ringGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.strokeStyle = ringGlow;
        ctx.lineWidth = 2.4;
        ctx.stroke();
        ctx.restore();

        // -------------------------------------------------------------
        // 7. EVENT HORIZON PITCH-BLACK KERR SHADOW (The Singularity)
        // -------------------------------------------------------------
        ctx.save();
        // Gravitational redshift edge halo (g_00 -> 0 transition)
        const horizonRedshift = createSafeRadialGradient(cx, cy, rShadow * 0.8, cx, cy, rShadow * 1.06);
        horizonRedshift.addColorStop(0, '#000000');
        horizonRedshift.addColorStop(0.82, 'rgba(159, 18, 57, 0.42)');
        horizonRedshift.addColorStop(0.96, 'rgba(56, 189, 248, 0.18)');
        horizonRedshift.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = horizonRedshift;
        ctx.beginPath();
        ctx.arc(cx, cy, rShadow * 1.06, 0, Math.PI * 2);
        ctx.fill();

        // Absolute pitch-black Kerr event horizon silhouette
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(cx - 1.0, cy, rShadow, rShadow * 0.98, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // -------------------------------------------------------------
        // 8. FRONT HALF OF EQUATORIAL DISK (ANNULUS SEGMENT: y > 0)
        //    Slices cleanly across the lower horizon with clear ISCO hole!
        // -------------------------------------------------------------
        if (diskFade > 0.01) {
          ctx.save();
          ctx.globalAlpha = bhAlpha * diskFade;
          ctx.translate(cx, cy);
          ctx.rotate(diskTilt);
          ctx.scale(1, diskAspect);

          const frontDiskGrad = ctx.createLinearGradient(-rDiskOut, 0, rDiskOut, 0);
          frontDiskGrad.addColorStop(0, '#ffffff'); // Approaching blueshifted side
          frontDiskGrad.addColorStop(0.18, '#67e8f9');
          frontDiskGrad.addColorStop(0.38, '#38bdf8');
          frontDiskGrad.addColorStop(0.65, '#4338ca');
          frontDiskGrad.addColorStop(0.85, '#9f1239'); // Receding redshifted side
          frontDiskGrad.addColorStop(1, 'rgba(63, 7, 19, 0.06)');

          ctx.fillStyle = frontDiskGrad;
          ctx.beginPath();
          // Outer half-ellipse (y > 0) from +rDiskOut to -rDiskOut
          ctx.arc(0, 0, rDiskOut, 0, Math.PI, false);
          // Inner half-ellipse (y > 0) from -rISCO to +rISCO (opening the inner hole!)
          ctx.arc(0, 0, rISCO, Math.PI, 0, true);
          ctx.closePath();
          ctx.fill();

          // Searing ISCO inner edge luminous filament (T > 10^7 K)
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.8;
          ctx.beginPath();
          ctx.arc(0, 0, rISCO, 0.1, Math.PI - 0.1);
          ctx.stroke();

          // Front half spiral density shock waves
          for (let arm = 0; arm < 2; arm++) {
            const armOffset = arm * Math.PI + tSec * 1.5;
            ctx.strokeStyle = arm === 0 ? 'rgba(255, 255, 255, 0.45)' : 'rgba(56, 189, 248, 0.35)';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            for (let t = 0; t <= 24; t++) {
              const th = (t / 24) * Math.PI * 1.6 + armOffset;
              const rad = rISCO + (t / 24) * (rDiskOut - rISCO);
              const sx = Math.cos(th) * rad;
              const sy = Math.sin(th) * rad;
              if (sy > -1.5) {
                if (t === 0) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
              }
            }
            ctx.stroke();
          }

          // Differential Keplerian disk particles
          for (const p of BH_DISK_PARTICLES) {
            const keplerSpeed = (p.speed * 26) / Math.sqrt(p.dist);
            const pAngle = p.angle + tSec * keplerSpeed;
            const px = Math.cos(pAngle) * p.dist;
            const py = Math.sin(pAngle) * p.dist;

            if (py > 0 && p.dist >= rISCO * 0.95) {
              const isApproaching = Math.cos(pAngle) < 0; // Approaching left side
              const dopplerBoost = isApproaching ? Math.min(1.0, p.alpha * 1.6) : p.alpha * 0.35;
              ctx.fillStyle = isApproaching
                ? `rgba(255, 255, 255, ${dopplerBoost.toFixed(3)})`
                : `rgba(244, 63, 94, ${dopplerBoost.toFixed(3)})`;
              ctx.beginPath();
              ctx.arc(px, py, p.size * (isApproaching ? 1.2 : 0.8), 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.restore();
        }

        ctx.restore(); // Restore bhAlpha
      }
    },
    [telemetry, selectedTrackId]
  );

  // Render canvas on every change and animation frame
  useEffect(() => {
    let animId: number;
    const render = (time: number) => {
      renderCanvas(time);
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [renderCanvas]);

  // Resize canvas to match container DPI with ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const updateSize = () => {
      const rect = parent.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(parent);
    window.addEventListener('resize', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [isFullscreenStage]);

  // Catalog star examples for active stage with alias resolution & dynamic fallback
  const exampleStars = useMemo(() => {
    const rawIds = activeStage.analogousStarIds || [];
    const resolvedIds = rawIds.map((id) => resolveStarId(id));
    const matched = STARS_CATALOG.filter((s) => rawIds.includes(s.id) || resolvedIds.includes(s.id));
    if (matched.length > 0) return matched;

    // Dynamic fallback: find stars matching stage name or spectral type
    const stageQuery = (activeStage.stageName || '').toLowerCase();
    const specQuery = (activeStage.spectralClassEquivalent || '').toLowerCase();
    return STARS_CATALOG.filter((s) => {
      const sStage = (s.stellarStage || '').toLowerCase();
      const sSpec = (s.spectralType || '').toLowerCase();
      return (stageQuery && sStage.includes(stageQuery)) || (specQuery && sSpec.startsWith(specQuery));
    }).slice(0, 4);
  }, [activeStage]);

  const stageRibbonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = stageRibbonRef.current;
    if (!container) return;
    const activeButton = container.children[currentStageIndex] as HTMLElement | undefined;
    if (activeButton) {
      const targetLeft =
        activeButton.offsetLeft - container.offsetWidth / 2 + activeButton.offsetWidth / 2;
      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth',
      });
    }
  }, [currentStageIndex]);

  const handlePrevStage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const pts = currentTrack.checkpoints;
    const prevIdx = (currentStageIndex - 1 + pts.length) % pts.length;
    setProgress(pts[prevIdx].progress);
    setIsPlaying(false);
  };

  const handleNextStage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const pts = currentTrack.checkpoints;
    const nextIdx = (currentStageIndex + 1) % pts.length;
    setProgress(pts[nextIdx].progress);
    setIsPlaying(false);
  };

  // Reusable Scrubber for both standard left-panel layout and mobile-landscape top-of-right-panel layout
  const renderScrubber = (isMobileLandscapeTop: boolean = false) => (
    <div
      className={`p-3 sm:p-4 bg-[#020512] flex flex-col gap-2.5 sm:gap-3 shrink-0 ${
        isMobileLandscapeTop
          ? 'rounded-2xl border border-cyan-500/25 shadow-lg mb-1'
          : 'border-t border-cyan-500/20'
      }`}
    >
      {/* Clean Timeline Info */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-300">
        <span className="text-cyan-400 font-bold flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5" />
          <span>Stellar Evolution Timeline</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-cyan-300 font-bold">{telemetry.interpolatedAgeLabel}</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-300 font-bold">{(progress * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Range Input Slider (Mapped to internal timeline -100% to 200%) */}
      <div className="relative flex items-center py-1">
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={timelineToSlider(progress)}
          onChange={(e) => {
            setProgress(sliderToTimeline(parseFloat(e.target.value)));
            setIsPlaying(false);
          }}
          aria-label="Timeline progress slider"
          className="w-full h-2.5 sm:h-3 bg-slate-900 rounded-lg appearance-none cursor-ew-resize accent-cyan-400 focus:outline-none border border-cyan-500/30"
        />
      </div>

      {/* Milestone Dots positioned along slider span */}
      <div className="relative w-full h-3 select-none">
        {currentTrack.checkpoints.map((cp, idx) => {
          const sliderPos = timelineToSlider(cp.progress);
          const currentSlider = timelineToSlider(progress);
          const isPassed = currentSlider >= sliderPos;
          const isNear = Math.abs(currentSlider - sliderPos) < 0.02;
          const leftPercent = sliderPos * 100;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleJumpToCheckpoint(cp)}
              title={`${cp.stageName} (${(cp.progress * 100).toFixed(0)}%)`}
              style={{ left: `${leftPercent}%` }}
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center cursor-pointer"
            >
              <span
                className={`w-2 h-2 rounded-full border transition-transform ${
                  isNear
                    ? 'bg-cyan-400 border-white scale-125 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                    : isPassed
                    ? 'bg-cyan-600 border-cyan-400'
                    : 'bg-slate-800 border-slate-700'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Key Stellar Evolution Anchor Markers (-100%, 0%, 100%, 200%) */}
      <div className="grid grid-cols-4 gap-1 sm:gap-2 pt-0.5 text-[9px] sm:text-[10px] font-mono">
        {[
          { val: -1.0, pct: '-100%', label: 'Pre-Birth Cloud' },
          { val: 0.0, pct: '0%', label: 'Star Born (ZAMS)' },
          { val: 1.0, pct: '100%', label: 'Star Death' },
          { val: 2.0, pct: '200%', label: 'Remnant Dies Out' },
        ].map((anchor) => {
          const isActiveAnchor = Math.abs(progress - anchor.val) < 0.05;
          return (
            <button
              key={anchor.pct}
              type="button"
              onClick={() => {
                setProgress(anchor.val);
                setIsPlaying(false);
              }}
              className={`px-1.5 py-1 rounded-lg border text-center transition-all cursor-pointer truncate ${
                isActiveAnchor
                  ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 font-bold'
                  : 'bg-[#040816]/80 border-cyan-500/15 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/35'
              }`}
              title={`Jump to ${anchor.pct}: ${anchor.label}`}
            >
              <span className="text-cyan-400 font-bold">{anchor.pct}</span>{' '}
              <span className="hidden sm:inline">{anchor.label}</span>
            </button>
          );
        })}
      </div>

      {/* Compact Playback Controls & Speeds */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-cyan-500/10">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => {
              if (!isPlaying && progress >= 1.99) {
                setProgress(-1.0);
              }
              setIsPlaying((prev) => !prev);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs font-mono shadow hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>PLAY</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setProgress(-1.0);
              setIsPlaying(false);
            }}
            title="Reset to start (-100% Pre-Birth Cloud)"
            className="p-1.5 rounded-lg bg-[#040816] hover:bg-cyan-950/60 border border-cyan-500/25 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Speed Multiplier */}
        <div className="flex items-center gap-1 p-0.5 bg-[#040816] rounded-lg border border-cyan-500/20 text-xs font-mono">
          {[0.5, 1.0, 2.0].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setPlaybackSpeed(s)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                playbackSpeed === s
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-5 animate-in fade-in duration-200">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER (HERO BANNER)                                   */}
      {/* ------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-4 sm:p-5 shadow-xl backdrop-blur-md shrink-0">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0" />
              <span>Stellar Life Cycles</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Trace how stellar birth mass dictates cosmic destiny—from multi-trillion-year red dwarf stability and Sun-like planetary nebulae to runaway core collapse, supernova nucleosynthesis, and neutron star or black hole remnants.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. DOUBLE PANEL (DOSSIER STYLE): VIEW/SLIDER (LEFT) + INFO (RIGHT) */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full flex flex-col mobile-landscape:flex-row lg:flex-row gap-4 sm:gap-5 mobile-landscape:h-[calc(100vh-100px)] lg:h-[calc(100vh-140px)] mobile-landscape:min-h-0 lg:min-h-[640px] overflow-hidden min-h-0">
        {/* Left Panel: The View and Slider (scrollable on portrait, NOT on landscape) */}
        <div
          ref={stageContainerRef}
          className={`w-full mobile-landscape:w-auto lg:w-auto mobile-landscape:flex-1 lg:flex-1 min-w-0 mobile-landscape:h-full lg:h-full overflow-y-auto mobile-landscape:overflow-hidden lg:overflow-hidden rounded-2xl bg-[#030612] border border-cyan-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex flex-col justify-between ${
            isFullscreenStage ? 'fixed inset-4 z-50' : 'relative'
          }`}
        >
          {/* Top HUD Overlay within Stage - Shows current evolutionary stage */}
          <div className="p-3 sm:p-3.5 bg-gradient-to-b from-[#040816]/95 via-[#040816]/70 to-transparent flex items-center justify-between gap-3 z-10 shrink-0">
            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse shadow-sm"
                style={{ backgroundColor: telemetry.interpolatedColor }}
              />
              <RunningText
                as="h4"
                text={simpleStageName}
                className="text-sm sm:text-base font-bold text-white tracking-wide"
              />
            </div>

            <button
              onClick={() => setIsFullscreenStage((prev) => !prev)}
              title={isFullscreenStage ? 'Exit Fullscreen' : 'Expand Stage'}
              className="p-1.5 rounded-lg bg-[#020512]/90 hover:bg-cyan-950 border border-cyan-500/25 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              {isFullscreenStage ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Canvas 2D Viewport */}
          <div className="w-full flex-1 min-h-[240px] sm:min-h-[300px] mobile-landscape:min-h-0 relative">
            <canvas
              ref={canvasRef}
              className="w-full h-full block cursor-grab active:cursor-grabbing"
            />

            {/* Bottom Visual Subtitles / Physical Dynamics Tag */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none text-[10px] sm:text-[11px] font-mono gap-2">
              <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#040816]/85 backdrop-blur-md border border-cyan-500/20 text-slate-300 max-w-[65%] pointer-events-auto min-w-0 overflow-hidden">
                <span className="text-cyan-400 font-bold shrink-0">Core: </span>
                <RunningText as="span" text={telemetry.current.coreEngine} className="text-slate-300" />
              </div>

              <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#040816]/85 backdrop-blur-md border border-cyan-500/20 text-slate-300 pointer-events-auto shrink-0">
                <span className="text-amber-400 font-bold">Radius: </span>
                <span>
                  {telemetry.interpolatedRadius >= 1
                    ? `${telemetry.interpolatedRadius.toFixed(1)} R☉`
                    : `${telemetry.interpolatedRadius.toFixed(4)} R☉`}
                </span>
              </div>
            </div>
          </div>

          {/* Scrubber in Left Panel (hidden on mobile landscape via responsive utility) */}
          <div className="stellar-slider-left-panel">
            {renderScrubber(false)}
          </div>
        </div>

        {/* Right Panel: Everything else (scrollable on portrait and landscape) */}
        <div className="w-full mobile-landscape:w-auto lg:w-auto mobile-landscape:flex-1 lg:flex-1 min-w-0 mobile-landscape:h-full lg:h-full overflow-y-auto mobile-landscape:overflow-y-auto lg:overflow-y-auto scrollbar-thin flex flex-col gap-4 pb-safe pr-0.5">
          {/* On mobile landscape, slider relocated to top of right panel */}
          <div className="stellar-slider-mobile-landscape-only">
            {renderScrubber(true)}
          </div>
          {/* 1. Evolutionary Tracks Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 shrink-0">
            {[
              { id: 'low-mass', label: 'Red Dwarf', color: '#f43f5e' },
              { id: 'solar', label: 'Sun-like Stars', color: '#f59e0b' },
              { id: 'massive', label: 'Massive Stars', color: '#38bdf8' },
              { id: 'hyper-massive', label: 'Hyper-massive Stars', color: '#818cf8' },
            ].map((t) => {
              const isSelected = t.id === selectedTrackId;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTrackChange(t.id)}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center shadow-xs ${
                    isSelected
                      ? 'bg-[#091535] border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400 font-bold'
                      : 'bg-[#040816]/90 border-cyan-500/20 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:bg-[#070f24]'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: t.color }}
                  />
                  <span className="truncate">{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* 2. Track Summary Banner */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#060e2a] border border-cyan-500/30 shadow-md flex flex-col gap-2 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-cyan-500/15 pb-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: currentTrack.accentColor }}
                />
                <h4 className="text-sm sm:text-base font-bold text-white">{currentTrack.name}</h4>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Active Track
                </span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">{currentTrack.massLabel}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono text-slate-400">
              <span>Lifespan: {currentTrack.typicalLifespan}</span>
              <span className="text-cyan-300 font-semibold">Fate: {currentTrack.fateSummary}</span>
            </div>
          </div>

          {/* 3. Stage Selector Carousel */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#040816]/95 border border-cyan-500/30 shadow-md flex flex-col gap-3 shrink-0">
            {/* Quick Stage Horizontal Ribbon (Scrollable) */}
            <div
              ref={stageRibbonRef}
              className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 -mx-0.5 px-0.5"
            >
              {currentTrack.checkpoints.map((cp, idx) => {
                const isSelected = idx === currentStageIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setProgress(cp.progress);
                      setIsPlaying(false);
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_10px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400'
                        : 'bg-[#020512] border-cyan-500/20 text-slate-400 hover:text-white hover:border-cyan-500/40'
                    }`}
                    title={`${cp.stageName} (${(cp.progress * 100).toFixed(0)}%)`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: cp.colorHex }}
                    />
                    <span className="whitespace-nowrap">Stage {idx + 1}</span>
                  </button>
                );
              })}
            </div>

            {/* Carousel Navigation Header */}
            <div className="flex items-center justify-between gap-2 border-t border-b border-cyan-500/15 py-2.5">
              <button
                type="button"
                onClick={handlePrevStage}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                title="Previous evolutionary stage"
                aria-label="Previous stage"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div
                className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 aspect-square rounded-xl flex items-center justify-center font-black font-mono text-xs sm:text-sm shadow-md border border-white/20"
                style={{
                  backgroundColor: activeStage.colorHex,
                  color: '#02040a',
                  boxShadow: `0 0 16px ${activeStage.colorHex}66`,
                }}
              >
                {currentStageIndex + 1}
              </div>

              <div className="min-w-0 flex-1 px-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-white break-words">
                    {activeStage.stageName}
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold shrink-0">
                    ({currentStageIndex + 1}/{currentTrack.checkpoints.length})
                  </span>
                </div>
                <div className="min-w-0 overflow-hidden">
                  <RunningText
                    text={`${activeStage.timeElapsedLabel} • ${(activeStage.progress * 100).toFixed(0)}% Lifespan`}
                    className="text-[10.5px] sm:text-[11px] text-slate-400 mt-0.5 font-mono"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStage}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer shrink-0 active:scale-95"
                title="Next evolutionary stage"
                aria-label="Next stage"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Stage Body */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {activeStage.shortDescription}
            </p>

            <div className="p-3 rounded-xl bg-[#020512] border border-cyan-500/15 text-xs text-slate-300 leading-relaxed">
              <strong className="text-cyan-300 block font-mono mb-1 text-[11px]">
                Astrophysical Mechanics:
              </strong>
              {activeStage.detailedPhysics}
            </div>

            {/* Key Observable Phenomena */}
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5 font-bold">
                Key Physical Signatures & Phenomena:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {activeStage.keyPhenomena.map((ph, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 sm:p-2 rounded-lg bg-[#020512] border border-cyan-500/15 text-[11px] font-mono text-slate-300 flex items-center gap-1.5"
                  >
                    <span className="text-cyan-400 font-bold">•</span>
                    <span className="truncate">{ph}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Database Real Star Examples */}
            {exampleStars.length > 0 && (
              <div className="pt-2 border-t border-cyan-500/15 flex flex-col gap-1.5">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  Catalog Real-World Analogues in this Stage:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {exampleStars.map((star) => (
                    <button
                      key={star.id}
                      onClick={() => onSelectStar?.(star)}
                      className="px-2.5 py-1 rounded-lg bg-[#020512] hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-xs text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 font-mono group"
                      title={`Inspect ${star.name} (${star.spectralClass}) in 3D Dossier`}
                    >
                      <StarDot2D star={star} sizeClassName="w-2.5 h-2.5" />
                      <span className="font-semibold">{star.name}</span>
                      <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Detailed Physical Parameters Grid */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#040816]/95 border border-cyan-500/25 flex flex-col gap-3 shadow-md shrink-0">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              Continuous Astrophysical Parameters
            </span>

            {/* Object Age & Epoch Card */}
            <div className="p-3 rounded-xl bg-[#020512] border border-cyan-500/30 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-inner">
                  <Clock className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="min-w-0 overflow-hidden">
                  <RunningText
                    text="Object Age (Relative to ZAMS Birth)"
                    className="text-[9px] uppercase font-mono text-slate-400 font-semibold"
                  />
                  <RunningText
                    text={telemetry.interpolatedAgeLabel}
                    className="text-xs sm:text-sm font-bold text-white font-mono tracking-wide block"
                  />
                </div>
              </div>
              <div className="text-right font-mono text-[10px] shrink-0">
                <span className="text-cyan-300 font-bold block">
                  {(progress * 100).toFixed(1)}% Lifespan
                </span>
                <span className="text-slate-400">
                  {progress < 0
                    ? 'Pre-Birth Protostar'
                    : progress < 1.0
                    ? 'Active Stellar Life'
                    : 'Post-Death Remnant'}
                </span>
              </div>
            </div>

            {/* 4-Parameter Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15">
                <span className="text-slate-500 block text-[10px] uppercase">
                  Surface Temperature
                </span>
                <span className="text-white font-bold text-xs sm:text-sm">
                  {telemetry.interpolatedTemp.toLocaleString()} K
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15">
                <span className="text-slate-500 block text-[10px] uppercase">Core Temp</span>
                <span className="text-amber-300 font-bold text-xs sm:text-sm">
                  {telemetry.current.coreTempKelvin > 0
                    ? `${telemetry.current.coreTempKelvin.toLocaleString()} K`
                    : 'Cold Degenerate'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15">
                <span className="text-slate-500 block text-[10px] uppercase">
                  Physical Radius
                </span>
                <span className="text-cyan-300 font-bold text-xs sm:text-sm">
                  {telemetry.interpolatedRadius >= 1
                    ? `${telemetry.interpolatedRadius.toFixed(1)} R☉`
                    : `${telemetry.interpolatedRadius.toFixed(4)} R☉`}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#020512] border border-cyan-500/15">
                <span className="text-slate-500 block text-[10px] uppercase">Luminosity</span>
                <span className="text-slate-200 font-bold text-xs sm:text-sm">
                  {telemetry.interpolatedLuminosity >= 1
                    ? `${telemetry.interpolatedLuminosity.toLocaleString()} L☉`
                    : `${telemetry.interpolatedLuminosity.toFixed(5)} L☉`}
                </span>
              </div>
            </div>

            {/* Dominant Supporting Pressure */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-[#020512] border border-cyan-500/15 text-xs font-mono">
              <span className="text-slate-500 block text-[10px] uppercase">
                Dominant Supporting Pressure:
              </span>
              <span className="text-cyan-300 font-semibold leading-tight block mt-0.5">
                {telemetry.current.dominantPressure}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
