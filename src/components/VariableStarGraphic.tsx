import React, { useEffect, useRef } from 'react';
import { StarData } from '../types';

interface VariableStarGraphicProps {
  variableId: string;
  archetypeStar?: StarData | null;
  colorHex?: string;
  className?: string;
}

// Utility to parse any hex color into RGB components
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 255, g: 255, b: 255 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export const VariableStarGraphic: React.FC<VariableStarGraphicProps> = ({
  variableId,
  archetypeStar,
  colorHex = '#38bdf8',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Logical color determination based on the first highlighted/archetype star in the catalog
  const primaryHex = archetypeStar?.colorHex || colorHex;
  const coronaHex = archetypeStar?.coronaColorHex || archetypeStar?.colorHex || colorHex;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let startTime = performance.now();

    const baseRgb = hexToRgb(primaryHex);
    const coronaRgb = hexToRgb(coronaHex);

    // Pre-generate background deep-field stars
    const bgStars: { x: number; y: number; r: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 55; i++) {
      bgStars.push({
        x: Math.random() * 500,
        y: Math.random() * 500,
        r: Math.random() * 1.3 + 0.35,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 1.6 + 0.4,
      });
    }

    // Pre-generate convective granules for Semiregular red supergiants (Betelgeuse)
    const granules: { angle: number; dist: number; r: number; phase: number; speed: number }[] = [];
    for (let i = 0; i < 16; i++) {
      granules.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * 0.68,
        r: Math.random() * 28 + 18,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.35,
      });
    }

    // Pre-generate organic magnetic starspot nests for Rotational variables (Cor Caroli / BY Draconis)
    const starspots = [
      { lat: 0.22, lon: 0.15, r: 21, sat: [{ dLat: 0.05, dLon: 0.07, r: 9 }, { dLat: -0.06, dLon: -0.06, r: 7 }] },
      { lat: -0.28, lon: 0.85, r: 25, sat: [{ dLat: 0.07, dLon: 0.09, r: 10 }, { dLat: -0.05, dLon: 0.12, r: 7 }] },
      { lat: -0.32, lon: 1.15, r: 16, sat: [] },
      { lat: 0.36, lon: 2.25, r: 22, sat: [{ dLat: -0.06, dLon: 0.08, r: 9 }] },
      { lat: 0.42, lon: 2.55, r: 14, sat: [] },
      { lat: -0.15, lon: 3.85, r: 27, sat: [{ dLat: 0.07, dLon: -0.09, r: 11 }, { dLat: -0.05, dLon: 0.08, r: 8 }] },
      { lat: 0.09, lon: 4.15, r: 17, sat: [] },
      { lat: -0.35, lon: 5.2, r: 19, sat: [{ dLat: 0.06, dLon: 0.06, r: 8 }] },
    ];

    // Pre-generate accretion disk particles for Cataclysmic Novae (T CrB / U Gem)
    const diskParticles: { angle: number; dist: number; speed: number; size: number }[] = [];
    for (let i = 0; i < 110; i++) {
      diskParticles.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * 92 + 28,
        speed: (Math.random() * 1.6 + 1.1) * (1 / (0.35 + Math.random() * 0.65)),
        size: Math.random() * 2.4 + 0.8,
      });
    }

    // Pre-generate stream particles for mass transfer
    const streamParticles: { t: number; speed: number }[] = [];
    for (let i = 0; i < 45; i++) {
      streamParticles.push({
        t: Math.random(),
        speed: Math.random() * 0.5 + 0.35,
      });
    }

    // Safe radial gradient creator to strictly guarantee non-negative, finite numbers across all browser engines
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

    // Background cosmic space drawer
    const drawSpaceBackground = (w: number, h: number, timeSec: number) => {
      const bgGrad = createSafeRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w * 0.72);
      bgGrad.addColorStop(0, '#060a1e');
      bgGrad.addColorStop(0.55, '#030614');
      bgGrad.addColorStop(1, '#010207');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle ambient nebular dust tuned to the star's color
      const nebGrad = createSafeRadialGradient(w * 0.58, h * 0.38, 15, w * 0.58, h * 0.38, 230);
      nebGrad.addColorStop(0, `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, 0.1)`);
      nebGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = nebGrad;
      ctx.fillRect(0, 0, w, h);

      // Twinkling stars
      for (const s of bgStars) {
        const twinkle = Math.sin(timeSec * s.speed + s.x) * 0.35 + 0.65;
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * twinkle})`;
        ctx.beginPath();
        ctx.arc((s.x / 500) * w, (s.y / 500) * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const render = (now: number) => {
      const timeSec = (now - startTime) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);
      drawSpaceBackground(w, h, timeSec);

      switch (variableId) {
        // =====================================================================
        // 1. CEPHEID VARIABLES (Delta Cephei Archetype)
        // =====================================================================
        case 'cepheid-variables': {
          // Asymmetric Leavitt curve: fast rapid rise (1.1s), slow cooling decline (3.3s)
          const period = 4.4;
          const phase = (timeSec % period) / period;
          let intensity: number;
          if (phase < 0.25) {
            const p = phase / 0.25;
            intensity = 0.5 - 0.5 * Math.cos(p * Math.PI); // 0 to 1
          } else {
            const p = (phase - 0.25) / 0.75;
            intensity = 0.5 + 0.5 * Math.cos(p * Math.PI); // 1 to 0
          }

          const starR = 76 + intensity * 28;
          const glowR = starR * (2.1 + intensity * 1.3);

          // Colors logically anchored in Delta Cephei's catalog color (#fff4cc)
          // Shifting between ~5,500K golden amber at minimum and ~6,800K blazing white-yellow at peak
          const rCol = Math.min(255, Math.round(baseRgb.r + (255 - baseRgb.r) * intensity));
          const gCol = Math.min(255, Math.round(baseRgb.g * (0.85 + intensity * 0.15)));
          const bCol = Math.min(255, Math.round(baseRgb.b * (0.65 + intensity * 0.35)));

          // Expanding He II ionization valve shockwave shell
          const shockPhase = (phase * 1.4) % 1;
          const shockR = starR + shockPhase * 115;
          const shockAlpha = Math.max(0, (1 - shockPhase) * 0.6 * (intensity * 0.75 + 0.25));
          ctx.strokeStyle = `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, ${shockAlpha})`;
          ctx.lineWidth = 2.8;
          ctx.beginPath();
          ctx.arc(cx, cy, shockR, 0, Math.PI * 2);
          ctx.stroke();

          // Second concentric shock front
          const shock2Phase = ((phase + 0.5) * 1.4) % 1;
          const shock2R = starR + shock2Phase * 105;
          const shock2Alpha = Math.max(0, (1 - shock2Phase) * 0.38);
          ctx.strokeStyle = `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${shock2Alpha})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(cx, cy, shock2R, 0, Math.PI * 2);
          ctx.stroke();

          // Atmospheric corona glow
          const corona = createSafeRadialGradient(cx, cy, starR * 0.35, cx, cy, glowR);
          corona.addColorStop(0, `rgba(${rCol}, ${gCol}, ${bCol}, 0.95)`);
          corona.addColorStop(0.35, `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, ${0.5 + intensity * 0.3})`);
          corona.addColorStop(0.75, `rgba(234, 88, 12, ${0.15 + intensity * 0.15})`);
          corona.addColorStop(1, 'transparent');
          ctx.fillStyle = corona;
          ctx.beginPath();
          ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
          ctx.fill();

          // Photosphere disk
          const photo = createSafeRadialGradient(cx - starR * 0.22, cy - starR * 0.22, 5, cx, cy, starR);
          photo.addColorStop(0, '#ffffff');
          photo.addColorStop(0.3, `rgb(${rCol}, ${gCol}, ${bCol})`);
          photo.addColorStop(0.7, `rgb(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b})`);
          photo.addColorStop(0.9, '#f59e0b');
          photo.addColorStop(1, '#fde68a');
          ctx.fillStyle = photo;
          ctx.beginPath();
          ctx.arc(cx, cy, starR, 0, Math.PI * 2);
          ctx.fill();

          // Soft luminous limb highlight - no dark circumference
          ctx.save();
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.55)';
          ctx.lineWidth = 2.0;
          ctx.stroke();
          ctx.restore();

          // Brilliant 4-point stellar diffraction spikes at maximum brightness
          const spikeLen = starR * (0.85 + intensity * 1.9);
          const spikeAlpha = Math.max(0, (intensity - 0.15) * 0.95);
          if (spikeAlpha > 0) {
            ctx.save();
            ctx.strokeStyle = `rgba(255, 255, 255, ${spikeAlpha})`;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(cx - spikeLen, cy);
            ctx.lineTo(cx + spikeLen, cy);
            ctx.moveTo(cx, cy - spikeLen);
            ctx.lineTo(cx, cy + spikeLen);
            ctx.stroke();

            // Diagonal cross flare
            ctx.strokeStyle = `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, ${spikeAlpha * 0.45})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(cx - spikeLen * 0.62, cy - spikeLen * 0.62);
            ctx.lineTo(cx + spikeLen * 0.62, cy + spikeLen * 0.62);
            ctx.moveTo(cx - spikeLen * 0.62, cy + spikeLen * 0.62);
            ctx.lineTo(cx + spikeLen * 0.62, cy - spikeLen * 0.62);
            ctx.stroke();
            ctx.restore();
          }
          break;
        }

        // =====================================================================
        // 2. RR LYRAE VARIABLES (RR Lyrae Archetype)
        // =====================================================================
        case 'rr-lyrae-variables': {
          // Fast clockwork cadence (~1.7s period)
          const fastPeriod = 1.7;
          const fastPhase = (timeSec % fastPeriod) / fastPeriod;
          // Blazhko effect: long secondary modulation cycle (~11s)
          const blazhko = Math.sin(timeSec * 0.57) * 0.28 + 0.72; // 0.44 to 1.0

          const rawIntensity = Math.pow(Math.sin(fastPhase * Math.PI), 2.1);
          const intensity = rawIntensity * blazhko;

          const baseR = 66;
          const starR = baseR + intensity * 22;
          const glowR = starR * 2.55;

          // Colors logically anchored in RR Lyrae's catalog color (#d8e5ff, pale blue-white)
          const rCol = Math.min(255, Math.round(baseRgb.r + (255 - baseRgb.r) * intensity * 0.7));
          const gCol = Math.min(255, Math.round(baseRgb.g + (255 - baseRgb.g) * intensity * 0.4));
          const bCol = 255;

          // Rapid acoustic shock front
          const shock = (fastPhase + 0.35) % 1;
          ctx.strokeStyle = `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, ${(1 - shock) * 0.55 * blazhko})`;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.arc(cx, cy, starR + shock * 85, 0, Math.PI * 2);
          ctx.stroke();

          // High-energy electric corona
          const corona = createSafeRadialGradient(cx, cy, starR * 0.3, cx, cy, glowR);
          corona.addColorStop(0, `rgba(${rCol}, ${gCol}, ${bCol}, 0.95)`);
          corona.addColorStop(0.4, `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, ${0.45 + intensity * 0.3})`);
          corona.addColorStop(0.8, 'rgba(129, 140, 248, 0.16)');
          corona.addColorStop(1, 'transparent');
          ctx.fillStyle = corona;
          ctx.beginPath();
          ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
          ctx.fill();

          // Photosphere
          const photo = createSafeRadialGradient(cx - starR * 0.24, cy - starR * 0.24, 4, cx, cy, starR);
          photo.addColorStop(0, '#ffffff');
          photo.addColorStop(0.35, `rgb(${rCol}, ${gCol}, ${bCol})`);
          photo.addColorStop(0.75, `rgb(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b})`);
          photo.addColorStop(0.92, '#93c5fd');
          photo.addColorStop(1, '#bfdbfe');
          ctx.fillStyle = photo;
          ctx.beginPath();
          ctx.arc(cx, cy, starR, 0, Math.PI * 2);
          ctx.fill();

          // Luminous radiant limb highlight - no dark circumference
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.lineWidth = 2.0;
          ctx.stroke();
          ctx.restore();

          // Flare at maximum
          if (intensity > 0.35) {
            const spike = starR * (0.65 + intensity * 1.45);
            ctx.save();
            ctx.strokeStyle = `rgba(255, 255, 255, ${(intensity - 0.35) * 1.3})`;
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.moveTo(cx - spike, cy);
            ctx.lineTo(cx + spike, cy);
            ctx.moveTo(cx, cy - spike);
            ctx.lineTo(cx, cy + spike);
            ctx.stroke();
            ctx.restore();
          }
          break;
        }

        // =====================================================================
        // 3. MIRA VARIABLES (Mira A / Omicron Ceti Archetype)
        // =====================================================================
        case 'mira-variables': {
          // Slow deep breathing cycle (~6.2s period)
          const period = 6.2;
          const phase = (timeSec % period) / period;
          const pulsation = 0.5 - 0.5 * Math.cos(phase * Math.PI * 2); // 0 to 1
          const starR = 76 + pulsation * 34;

          // Billowing circumstellar dust and gas shells (silicates and carbon soot)
          for (let i = 0; i < 3; i++) {
            const shellPhase = ((timeSec * 0.15 + i * 0.33) % 1);
            const shellR = starR + shellPhase * 140;
            const shellAlpha = Math.max(0, (1 - shellPhase) * 0.45);
            const dustGrad = createSafeRadialGradient(cx, cy, shellR - 20, cx, cy, shellR + 20);
            dustGrad.addColorStop(0, 'transparent');
            dustGrad.addColorStop(0.5, `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, ${shellAlpha})`);
            dustGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = dustGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, shellR + 20, 0, Math.PI * 2);
            ctx.fill();
          }

          // Colossal crimson/orange pulsating corona (anchored in Mira A's #ff4818)
          const coronaR = starR * (2.15 + pulsation * 0.65);
          const corona = createSafeRadialGradient(cx, cy, starR * 0.22, cx, cy, coronaR);
          corona.addColorStop(0, `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, ${0.85 + pulsation * 0.15})`);
          corona.addColorStop(0.42, `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${0.45 + pulsation * 0.3})`);
          corona.addColorStop(0.8, 'rgba(153, 27, 27, 0.22)');
          corona.addColorStop(1, 'transparent');
          ctx.fillStyle = corona;
          ctx.beginPath();
          ctx.arc(cx, cy, coronaR, 0, Math.PI * 2);
          ctx.fill();

          // Photosphere with deep TiO molecular absorption bands
          const photo = createSafeRadialGradient(cx - starR * 0.2, cy - starR * 0.2, 5, cx, cy, starR);
          photo.addColorStop(0, pulsation > 0.6 ? '#fed7aa' : `rgb(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b})`);
          photo.addColorStop(0.35, `rgb(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b})`);
          photo.addColorStop(0.75, '#ea580c');
          photo.addColorStop(1, '#f97316');
          ctx.fillStyle = photo;
          ctx.beginPath();
          ctx.arc(cx, cy, starR, 0, Math.PI * 2);
          ctx.fill();

          // Luminous warm limb highlight - no dark circumference
          ctx.save();
          ctx.strokeStyle = 'rgba(251, 146, 60, 0.55)';
          ctx.lineWidth = 2.0;
          ctx.stroke();
          ctx.restore();

          // Shifting cool molecular absorption clouds across face
          ctx.save();
          ctx.globalAlpha = 0.28;
          ctx.fillStyle = '#2d0606';
          for (let j = 0; j < 5; j++) {
            const angle = timeSec * 0.2 + (j * Math.PI) / 2.5;
            const fx = cx + Math.cos(angle) * (starR * 0.48);
            const fy = cy + Math.sin(angle) * (starR * 0.48);
            ctx.beginPath();
            ctx.arc(fx, fy, starR * 0.28, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
          break;
        }

        // =====================================================================
        // 4. SEMIREGULAR VARIABLES (Betelgeuse Archetype)
        // =====================================================================
        case 'semiregular-variables': {
          // Multi-periodic harmonic pulsation
          const wave1 = Math.sin(timeSec * 0.88) * 0.5 + 0.5;
          const wave2 = Math.sin(timeSec * 1.42 + 1.2) * 0.5 + 0.5;
          const wave3 = Math.sin(timeSec * 0.36 + 2.4) * 0.5 + 0.5;
          const combinedPulsation = wave1 * 0.45 + wave2 * 0.35 + wave3 * 0.2;

          const baseR = 82;
          const starR = baseR + combinedPulsation * 16;
          const coronaR = starR * 2.2;

          // Colors anchored in Betelgeuse's catalog color (#ff5533)
          const corona = createSafeRadialGradient(cx, cy, starR * 0.3, cx, cy, coronaR);
          corona.addColorStop(0, `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, 0.75)`);
          corona.addColorStop(0.45, `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 0.38)`);
          corona.addColorStop(0.85, 'rgba(153, 27, 27, 0.14)');
          corona.addColorStop(1, 'transparent');
          ctx.fillStyle = corona;
          ctx.beginPath();
          ctx.arc(cx, cy, coronaR, 0, Math.PI * 2);
          ctx.fill();

          // Photosphere
          const photo = createSafeRadialGradient(cx, cy, 10, cx, cy, starR);
          photo.addColorStop(0, '#ffffff');
          photo.addColorStop(0.28, `rgb(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b})`);
          photo.addColorStop(0.65, `rgb(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b})`);
          photo.addColorStop(0.88, '#f97316');
          photo.addColorStop(1, '#fb923c');
          ctx.fillStyle = photo;
          ctx.beginPath();
          ctx.arc(cx, cy, starR, 0, Math.PI * 2);
          ctx.fill();

          // Luminous warm limb highlight - no dark circumference
          ctx.save();
          ctx.strokeStyle = 'rgba(251, 146, 60, 0.55)';
          ctx.lineWidth = 2.0;
          ctx.stroke();
          ctx.restore();

          // Churning gigantic convective super-granulation cells
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, starR, 0, Math.PI * 2);
          ctx.clip();

          for (const g of granules) {
            const curAngle = g.angle + timeSec * 0.1 * g.speed;
            const curDist = (g.dist + Math.sin(timeSec * 0.2 + g.phase) * 0.15) * starR;
            const gx = cx + Math.cos(curAngle) * curDist;
            const gy = cy + Math.sin(curAngle) * curDist;
            const cellHeat = Math.sin(timeSec * g.speed + g.phase) * 0.5 + 0.5;

            const cellGrad = createSafeRadialGradient(gx, gy, 2, gx, gy, g.r);
            if (cellHeat > 0.5) {
              cellGrad.addColorStop(0, `rgba(254, 215, 170, ${0.48 * cellHeat})`);
              cellGrad.addColorStop(0.65, `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, ${0.35 * cellHeat})`);
            } else {
              cellGrad.addColorStop(0, `rgba(45, 6, 6, ${0.58 * (1 - cellHeat)})`);
              cellGrad.addColorStop(0.7, `rgba(88, 12, 12, ${0.35 * (1 - cellHeat)})`);
            }
            cellGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = cellGrad;
            ctx.beginPath();
            ctx.arc(gx, gy, g.r, 0, Math.PI * 2);
            ctx.fill();
          }

          // Asymmetric soot dust ejection (simulating the Betelgeuse Great Dimming)
          const dustCloudPhase = (timeSec * 0.11) % (Math.PI * 2);
          const dustX = cx + Math.cos(dustCloudPhase) * (starR * 0.52);
          const dustY = cy + Math.sin(dustCloudPhase) * (starR * 0.42);
          const dustGrad = createSafeRadialGradient(dustX, dustY, 5, dustX, dustY, starR * 0.58);
          dustGrad.addColorStop(0, 'rgba(20, 3, 3, 0.75)');
          dustGrad.addColorStop(0.65, 'rgba(38, 5, 5, 0.45)');
          dustGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = dustGrad;
          ctx.beginPath();
          ctx.arc(dustX, dustY, starR * 0.58, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
          break;
        }

        // =====================================================================
        // 5. CATACLYSMIC VARIABLES (T Coronae Borealis & U Geminorum Archetype)
        // =====================================================================
        case 'cataclysmic-variables': {
          const period = 7.5;
          const cycleTime = timeSec % period;
          const isNova = cycleTime > 5.5 && cycleTime < 6.8;
          const novaProgress = isNova ? (cycleTime - 5.5) / 1.3 : 0;

          // Prominently enlarged binary geometry with dramatic canvas presence
          const wdX = cx - 124;
          const wdY = cy - 6;
          const wdR = 36; // Substantially enlarged White Dwarf core
          const diskR = 126; // Vast, high-resolution multi-temperature accretion disk

          const secX = cx + 128;
          const secY = cy - 6;
          const secR = 96; // Substantially enlarged Donor Companion Star
          const l1X = cx + 2;
          const l1Y = cy - 6;

          // 1. Ambient Binary System Glow & Nebular Dust
          ctx.save();
          const sysGlow = createSafeRadialGradient(cx, cy - 6, 20, cx, cy - 6, 240);
          sysGlow.addColorStop(0, 'rgba(236, 72, 153, 0.14)');
          sysGlow.addColorStop(0.5, 'rgba(168, 85, 247, 0.07)');
          sysGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = sysGlow;
          ctx.fillRect(0, 0, w, h);
          ctx.restore();

          // 2. Substantially Enlarged Donor Star (Secondary Companion in Roche-Lobe Overflow)
          ctx.save();
          // Precise Roche-lobe equipotential envelope tapering smoothly to L1 nozzle
          ctx.beginPath();
          ctx.moveTo(l1X, l1Y);
          // Top teardrop lobe
          ctx.bezierCurveTo(
            l1X + (secX - l1X) * 0.42, secY - secR * 0.96,
            secX + secR * 0.95, secY - secR * 0.98,
            secX + secR, secY
          );
          // Bottom teardrop lobe
          ctx.bezierCurveTo(
            secX + secR * 0.95, secY + secR * 0.98,
            l1X + (secX - l1X) * 0.42, secY + secR * 0.96,
            l1X, l1Y
          );
          ctx.closePath();

          // Volumetric 3D photosphere gradient with radiant luminous edge (no dark circumference)
          const donorGrad = createSafeRadialGradient(secX + secR * 0.28, secY - secR * 0.22, 10, secX, secY, secR * 1.38);
          donorGrad.addColorStop(0, '#ffffff');
          donorGrad.addColorStop(0.2, '#fef08a'); // Warm central convective core
          donorGrad.addColorStop(0.5, `rgb(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b})`);
          donorGrad.addColorStop(0.82, '#ea580c');
          donorGrad.addColorStop(1, '#f97316'); // Bright radiant amber edge
          ctx.fillStyle = donorGrad;
          ctx.fill();

          // Convective granulation and turbulent stellar magnetic features
          ctx.save();
          ctx.clip();
          for (let g = 0; g < 16; g++) {
            const gAngle = g * 0.42 + timeSec * 0.22;
            const gDist = (g % 4 + 1) * 18;
            const gx = secX + Math.cos(gAngle) * gDist;
            const gy = secY + Math.sin(gAngle) * (gDist * 0.72);
            const gr = 16 + (g % 3) * 8;

            const gGrad = createSafeRadialGradient(gx, gy, 2, gx, gy, gr);
            gGrad.addColorStop(0, 'rgba(254, 215, 170, 0.42)');
            gGrad.addColorStop(0.6, 'rgba(234, 88, 12, 0.22)');
            gGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gGrad;
            ctx.beginPath();
            ctx.arc(gx, gy, gr, 0, Math.PI * 2);
            ctx.fill();
          }

          // Active starspot complexes on donor star
          const donorSpots = [
            { ox: 20, oy: -32, r: 12 },
            { ox: 42, oy: 18, r: 15 },
            { ox: -12, oy: 36, r: 10 },
            { ox: 55, oy: -12, r: 11 },
          ];
          for (const sp of donorSpots) {
            const spGrad = createSafeRadialGradient(secX + sp.ox, secY + sp.oy, 1, secX + sp.ox, secY + sp.oy, sp.r);
            spGrad.addColorStop(0, '#3a1304');
            spGrad.addColorStop(0.65, '#6a2208');
            spGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = spGrad;
            ctx.beginPath();
            ctx.arc(secX + sp.ox, secY + sp.oy, sp.r, 0, Math.PI * 2);
            ctx.fill();
          }

          // Heated / Irradiated Inner Hemisphere (facing hot accretion disk & white dwarf)
          const irradGrad = createSafeRadialGradient(l1X + 16, l1Y, 6, l1X + 45, l1Y, secR * 0.88);
          irradGrad.addColorStop(0, '#ffffff');
          irradGrad.addColorStop(0.35, 'rgba(244, 114, 182, 0.75)');
          irradGrad.addColorStop(0.7, 'rgba(192, 132, 252, 0.35)');
          irradGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = irradGrad;
          ctx.beginPath();
          ctx.arc(l1X + 30, l1Y, secR * 0.88, 0, Math.PI * 2);
          ctx.fill();

          // Dynamic Nova flash illumination on donor star face during outburst
          if (isNova) {
            const reflIntensity = Math.min(1.0, Math.sin(novaProgress * Math.PI) * 0.95);
            const reflGrad = createSafeRadialGradient(l1X + 10, l1Y, 4, l1X + 40, l1Y, secR * 0.95);
            reflGrad.addColorStop(0, `rgba(255, 255, 255, ${reflIntensity.toFixed(3)})`);
            reflGrad.addColorStop(0.4, `rgba(244, 114, 182, ${(reflIntensity * 0.8).toFixed(3)})`);
            reflGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = reflGrad;
            ctx.beginPath();
            ctx.arc(l1X + 35, l1Y, secR * 0.95, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // Donor star coronal atmosphere rim
          ctx.strokeStyle = 'rgba(251, 146, 60, 0.42)';
          ctx.lineWidth = 2.6;
          ctx.stroke();
          ctx.restore();

          // 3. Supersonic Coriolis Mass-Transfer Stream (from L1 to Disk Edge)
          ctx.save();
          const hotSpotX = wdX + diskR * 0.76;
          const hotSpotY = cy + 28;

          // Multi-thread gas stream sheath
          const streamGrad = ctx.createLinearGradient(l1X, l1Y, hotSpotX, hotSpotY);
          streamGrad.addColorStop(0, '#fef08a');
          streamGrad.addColorStop(0.35, '#f472b6');
          streamGrad.addColorStop(0.75, '#c084fc');
          streamGrad.addColorStop(1, '#ffffff');

          ctx.strokeStyle = streamGrad;
          ctx.lineWidth = 5.2;
          ctx.beginPath();
          ctx.moveTo(l1X, l1Y);
          ctx.quadraticCurveTo(cx - 25, cy + 38, hotSpotX, hotSpotY);
          ctx.stroke();

          // Core stream beam
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(l1X, l1Y);
          ctx.quadraticCurveTo(cx - 25, cy + 38, hotSpotX, hotSpotY);
          ctx.stroke();

          // In-falling ballistic stream particles speeding up toward white dwarf
          for (const sp of streamParticles) {
            const t = (sp.t + timeSec * sp.speed) % 1;
            const p0x = l1X;
            const p0y = l1Y;
            const p1x = cx - 25;
            const p1y = cy + 38;
            const p2x = hotSpotX;
            const p2y = hotSpotY;

            const px = (1 - t) * (1 - t) * p0x + 2 * (1 - t) * t * p1x + t * t * p2x;
            const py = (1 - t) * (1 - t) * p0y + 2 * (1 - t) * t * p1y + t * t * p2y;

            ctx.fillStyle = t > 0.6 ? '#ffffff' : '#fecdd3';
            ctx.beginPath();
            ctx.arc(px, py, 1.8 + t * 1.4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // 4. Supersonic Impact Hot Spot (Shock Node where stream collides with disk)
          const hotSpotPulse = Math.sin(timeSec * 7.5) * 0.25 + 0.75;
          ctx.save();
          const hotSpotGrad = createSafeRadialGradient(hotSpotX, hotSpotY, 1, hotSpotX, hotSpotY, 24);
          hotSpotGrad.addColorStop(0, '#ffffff');
          hotSpotGrad.addColorStop(0.3, `rgba(244, 114, 182, ${hotSpotPulse.toFixed(3)})`);
          hotSpotGrad.addColorStop(0.7, `rgba(192, 132, 252, ${(hotSpotPulse * 0.6).toFixed(3)})`);
          hotSpotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = hotSpotGrad;
          ctx.beginPath();
          ctx.arc(hotSpotX, hotSpotY, 24, 0, Math.PI * 2);
          ctx.fill();

          // Impact shock wave ringlets
          ctx.strokeStyle = `rgba(255, 255, 255, ${(hotSpotPulse * 0.75).toFixed(3)})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(hotSpotX, hotSpotY, 14 + Math.sin(timeSec * 10) * 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // 5. Broad, Magnified Multi-Temperature Accretion Disk (diskR = 126)
          ctx.save();
          ctx.translate(wdX, wdY);
          ctx.scale(1.0, 0.44); // 3D disk inclination

          // Multi-zone accretion disk gradient (cool outer rim -> warm mid disk -> searing inner boundary)
          const diskGrad = createSafeRadialGradient(0, 0, wdR * 0.75, 0, 0, diskR);
          diskGrad.addColorStop(0, '#ffffff'); // Inner boundary layer (> 100,000 K)
          diskGrad.addColorStop(0.16, 'rgba(103, 232, 249, 0.96)'); // Soft X-ray / EUV zone
          diskGrad.addColorStop(0.40, 'rgba(168, 85, 247, 0.88)'); // Ionized helium/hydrogen
          diskGrad.addColorStop(0.72, 'rgba(236, 72, 153, 0.78)'); // Optical disk
          diskGrad.addColorStop(0.92, 'rgba(219, 39, 119, 0.45)');
          diskGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = diskGrad;
          ctx.beginPath();
          ctx.arc(0, 0, diskR, 0, Math.PI * 2);
          ctx.fill();

          // Tidal two-armed spiral density waves (spiral shocks in cataclysmic variables)
          ctx.save();
          ctx.lineWidth = 2.8;
          for (let arm = 0; arm < 2; arm++) {
            const armOffset = arm * Math.PI + timeSec * 0.8;
            ctx.strokeStyle = arm === 0 ? 'rgba(255, 255, 255, 0.45)' : 'rgba(244, 114, 182, 0.38)';
            ctx.beginPath();
            for (let r = wdR * 1.1; r < diskR * 0.95; r += 4) {
              const theta = armOffset + Math.log(r / (wdR * 1.1)) * 1.8;
              const ax = Math.cos(theta) * r;
              const ay = Math.sin(theta) * r;
              if (r === wdR * 1.1) ctx.moveTo(ax, ay);
              else ctx.lineTo(ax, ay);
            }
            ctx.stroke();
          }
          ctx.restore();

          // Concentric Keplerian shear striations
          for (let ring = 1; ring <= 5; ring++) {
            const ringRadius = wdR + ring * 18;
            ctx.strokeStyle = `rgba(255, 255, 255, ${(0.10 + ring * 0.035).toFixed(3)})`;
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Swirling accretion disk particles with Keplerian velocity
          for (const dp of diskParticles) {
            const keplerSpeed = (dp.speed * 28) / Math.sqrt(dp.dist);
            const angle = dp.angle + timeSec * keplerSpeed;
            const px = Math.cos(angle) * dp.dist;
            const py = Math.sin(angle) * dp.dist;

            ctx.fillStyle = dp.dist < 50 ? '#ffffff' : 'rgba(244, 114, 182, 0.85)';
            ctx.beginPath();
            ctx.arc(px, py, dp.size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // 6. Substantially Enlarged White Dwarf Primary Core (wdR = 36)
          ctx.save();
          // Ultraviolet / relativistic boundary layer corona
          const wdCorona = createSafeRadialGradient(wdX, wdY, wdR * 0.5, wdX, wdY, wdR * 2.3);
          wdCorona.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          wdCorona.addColorStop(0.3, 'rgba(192, 132, 252, 0.65)');
          wdCorona.addColorStop(0.7, 'rgba(99, 102, 241, 0.3)');
          wdCorona.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = wdCorona;
          ctx.beginPath();
          ctx.arc(wdX, wdY, wdR * 2.3, 0, Math.PI * 2);
          ctx.fill();

          // Dense degenerate carbon/oxygen stellar core
          const wdCoreGrad = createSafeRadialGradient(wdX - wdR * 0.25, wdY - wdR * 0.25, 2, wdX, wdY, wdR);
          wdCoreGrad.addColorStop(0, '#ffffff');
          wdCoreGrad.addColorStop(0.38, '#e0e7ff');
          wdCoreGrad.addColorStop(0.75, '#c7d2fe');
          wdCoreGrad.addColorStop(1, '#e0e7ff');
          ctx.fillStyle = wdCoreGrad;
          ctx.beginPath();
          ctx.arc(wdX, wdY, wdR, 0, Math.PI * 2);
          ctx.fill();

          // Razor-sharp luminous radiant limb highlight - no dark circumference
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.8;
          ctx.stroke();
          ctx.restore();

          // 7. Thermonuclear Nova Detonation Flash (T CrB Recurrent Nova)
          if (isNova) {
            const blastR = wdR + novaProgress * 230;
            const blastAlpha = Math.min(1.0, Math.sin(novaProgress * Math.PI) * 0.98);

            ctx.save();
            // Expanding multi-stage thermonuclear fireball
            const flashGrad = createSafeRadialGradient(wdX, wdY, 15, wdX, wdY, blastR);
            flashGrad.addColorStop(0, `rgba(255, 255, 255, ${blastAlpha.toFixed(3)})`);
            flashGrad.addColorStop(0.25, `rgba(254, 205, 211, ${(blastAlpha * 0.9).toFixed(3)})`);
            flashGrad.addColorStop(0.55, `rgba(236, 72, 153, ${(blastAlpha * 0.65).toFixed(3)})`);
            flashGrad.addColorStop(0.82, `rgba(168, 85, 247, ${(blastAlpha * 0.35).toFixed(3)})`);
            flashGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = flashGrad;
            ctx.beginPath();
            ctx.arc(wdX, wdY, blastR, 0, Math.PI * 2);
            ctx.fill();

            // Searing outer shock front
            ctx.strokeStyle = `rgba(255, 255, 255, ${(blastAlpha * 0.95).toFixed(3)})`;
            ctx.lineWidth = 4.4;
            ctx.beginPath();
            ctx.arc(wdX, wdY, blastR * 0.96, 0, Math.PI * 2);
            ctx.stroke();

            // Ionization filament ring
            ctx.strokeStyle = `rgba(244, 114, 182, ${(blastAlpha * 0.8).toFixed(3)})`;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(wdX, wdY, blastR * 0.82, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
          break;
        }

        // =====================================================================
        // 6. ERUPTIVE & FLARE VARIABLES (Proxima Centauri Archetype)
        // =====================================================================
        case 'eruptive-variables': {
          const period = 5.4;
          const cycleTime = timeSec % period;
          const isFlaring = cycleTime > 3.6 && cycleTime < 5.0;
          const flareProgress = isFlaring ? (cycleTime - 3.6) / 1.4 : 0;
          const flarePower = isFlaring ? Math.sin(flareProgress * Math.PI) : 0;

          const starR = 82;

          // Photosphere anchored in Proxima Centauri's catalog color (#ff6b4a)
          const photo = createSafeRadialGradient(cx - starR * 0.25, cy - starR * 0.25, 6, cx, cy, starR);
          photo.addColorStop(0, '#ffffff');
          photo.addColorStop(0.25, isFlaring ? '#fecdd3' : `rgb(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b})`);
          photo.addColorStop(0.65, `rgb(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b})`);
          photo.addColorStop(0.88, '#f97316');
          photo.addColorStop(1, '#fb923c');
          ctx.fillStyle = photo;
          ctx.beginPath();
          ctx.arc(cx, cy, starR, 0, Math.PI * 2);
          ctx.fill();

          // Luminous warm limb highlight - no dark circumference
          ctx.save();
          ctx.strokeStyle = 'rgba(251, 146, 60, 0.6)';
          ctx.lineWidth = 2.0;
          ctx.stroke();
          ctx.restore();

          // Magnetic plasma arches
          ctx.save();
          ctx.lineWidth = 2.6;
          ctx.strokeStyle = `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, 0.78)`;

          ctx.beginPath();
          ctx.moveTo(cx + starR * 0.4, cy - starR * 0.7);
          ctx.bezierCurveTo(cx + starR * 0.7, cy - starR * 1.3, cx + starR * 1.1, cy - starR * 1.1, cx + starR * 0.85, cy - starR * 0.35);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(cx - starR * 0.8, cy - starR * 0.3);
          ctx.bezierCurveTo(cx - starR * 1.3, cy - starR * 0.4, cx - starR * 1.25, cy + starR * 0.2, cx - starR * 0.75, cy + starR * 0.35);
          ctx.stroke();

          // Reconnection flare explosion
          if (isFlaring) {
            const flareX = cx + starR * 0.55;
            const flareY = cy - starR * 0.7;

            const flareGrad = createSafeRadialGradient(flareX, flareY, 2, flareX, flareY, 115 * flarePower);
            flareGrad.addColorStop(0, '#ffffff');
            flareGrad.addColorStop(0.3, `rgba(254, 205, 211, ${flarePower * 0.95})`);
            flareGrad.addColorStop(0.65, `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${flarePower * 0.65})`);
            flareGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = flareGrad;
            ctx.beginPath();
            ctx.arc(flareX, flareY, 115 * flarePower, 0, Math.PI * 2);
            ctx.fill();

            const cmeDist = starR * (1.1 + flareProgress * 1.2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${flarePower})`;
            ctx.lineWidth = 4.2;
            ctx.beginPath();
            ctx.arc(flareX, flareY, cmeDist * 0.5, Math.PI * 1.2, Math.PI * 1.8);
            ctx.stroke();
          }
          ctx.restore();

          // Ambient corona
          const corona = createSafeRadialGradient(cx, cy, starR * 0.5, cx, cy, starR * (1.8 + flarePower * 0.8));
          corona.addColorStop(0, `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${0.5 + flarePower * 0.5})`);
          corona.addColorStop(0.6, 'rgba(159, 18, 57, 0.22)');
          corona.addColorStop(1, 'transparent');
          ctx.fillStyle = corona;
          ctx.beginPath();
          ctx.arc(cx, cy, starR * (1.8 + flarePower * 0.8), 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        // =====================================================================
        // 7. ROTATIONAL VARIABLES (Cor Caroli Archetype / Alpha-2 CVn)
        // =====================================================================
        // 7. ROTATIONAL VARIABLES (Cor Caroli & BY Draconis Archetype)
        // =====================================================================
        case 'rotational-variables': {
          const starR = 88;
          const rotAngle = timeSec * 0.85;

          // 1. Colors anchored in Cor Caroli's catalog color (#c7dcff, A0Vp diamond blue)
          const corona = createSafeRadialGradient(cx, cy, starR * 0.4, cx, cy, starR * 1.92);
          corona.addColorStop(0, `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 0.8)`);
          corona.addColorStop(0.45, `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, 0.32)`);
          corona.addColorStop(0.8, 'rgba(56, 189, 248, 0.1)');
          corona.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = corona;
          ctx.beginPath();
          ctx.arc(cx, cy, starR * 1.92, 0, Math.PI * 2);
          ctx.fill();

          // 2. Photosphere
          const photo = createSafeRadialGradient(cx - starR * 0.22, cy - starR * 0.22, 6, cx, cy, starR);
          photo.addColorStop(0, '#ffffff');
          photo.addColorStop(0.35, `rgb(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b})`);
          photo.addColorStop(0.75, `rgb(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b})`);
          photo.addColorStop(0.92, '#93c5fd');
          photo.addColorStop(1, '#bfdbfe');
          ctx.fillStyle = photo;
          ctx.beginPath();
          ctx.arc(cx, cy, starR, 0, Math.PI * 2);
          ctx.fill();

          // 3. Ultra-Smooth Starspot Rendering across the 3D Rotating Sphere
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, starR - 0.5, 0, Math.PI * 2);
          ctx.clip();

          // Helper to draw an individual starspot with seamless continuous falloff
          const drawSmoothSpot = (
            spotLat: number,
            spotLon: number,
            baseRadius: number,
            isSatellite = false
          ) => {
            const currentLon = spotLon + rotAngle;
            // 3D position on unit sphere:
            // x: left/right, y: up/down, z: depth towards observer
            const z = Math.cos(spotLat) * Math.cos(currentLon);
            if (z <= 0) return; // Behind star

            const xNorm = Math.cos(spotLat) * Math.sin(currentLon);
            const yNorm = Math.sin(spotLat);

            // Silky cubic smoothstep limb-falloff to eliminate any popping or hard edges
            const limbT = Math.max(0, Math.min(1.0, z / 0.32));
            const smoothLimb = limbT * limbT * (3 - 2 * limbT);
            if (smoothLimb <= 0.002) return;

            const sx = cx + xNorm * starR;
            const sy = cy - yNorm * starR;

            // Physical 3D spherical projection
            const distCenter = Math.hypot(sx - cx, sy - cy);
            const radialAngle = distCenter > 1.5 ? Math.atan2(sy - cy, sx - cx) : 0;
            const foreshortenRadial = Math.max(0.12, z);
            const spotRadius = baseRadius * (0.88 + z * 0.22);

            ctx.save();
            ctx.translate(sx, sy);
            ctx.rotate(radialAngle);
            ctx.scale(foreshortenRadial, 1.0);

            // A. Magnetic Facula (Bright plage halo surrounding the active starspot nest)
            if (!isSatellite) {
              const faculaAlpha = Math.max(0, Math.min(0.48, smoothLimb * 0.40 * (1.1 - z * 0.5)));
              if (faculaAlpha > 0.01) {
                const faculaR = spotRadius * 1.62;
                const faculaGrad = createSafeRadialGradient(0, 0, spotRadius * 0.5, 0, 0, faculaR);
                faculaGrad.addColorStop(0, `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 0)`);
                faculaGrad.addColorStop(0.45, `rgba(255, 255, 255, ${faculaAlpha.toFixed(3)})`);
                faculaGrad.addColorStop(0.75, `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, ${(faculaAlpha * 0.45).toFixed(3)})`);
                faculaGrad.addColorStop(1.0, `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 0)`);
                ctx.fillStyle = faculaGrad;
                ctx.beginPath();
                ctx.arc(0, 0, faculaR, 0, Math.PI * 2);
                ctx.fill();
              }
            }

            // B. Penumbra with ultra-smooth feathered border melting seamlessly into photosphere
            const penumbraR = spotRadius * 1.35;
            const spotGrad = createSafeRadialGradient(0, 0, 0, 0, 0, penumbraR);
            spotGrad.addColorStop(0, `rgba(12, 18, 35, ${(0.95 * smoothLimb).toFixed(3)})`);
            spotGrad.addColorStop(0.32, `rgba(20, 29, 52, ${(0.86 * smoothLimb).toFixed(3)})`);
            spotGrad.addColorStop(0.55, `rgba(35, 48, 80, ${(0.62 * smoothLimb).toFixed(3)})`);
            spotGrad.addColorStop(0.76, `rgba(60, 80, 120, ${(0.32 * smoothLimb).toFixed(3)})`);
            spotGrad.addColorStop(0.92, `rgba(${Math.round(baseRgb.r * 0.7)}, ${Math.round(baseRgb.g * 0.75)}, ${Math.round(baseRgb.b * 0.9)}, ${(0.10 * smoothLimb).toFixed(3)})`);
            spotGrad.addColorStop(1.0, `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 0)`);
            ctx.fillStyle = spotGrad;
            ctx.beginPath();
            ctx.arc(0, 0, penumbraR, 0, Math.PI * 2);
            ctx.fill();

            // C. Umbra Core (Inner darkest magnetic flux tube)
            const umbraR = spotRadius * 0.55;
            const umbraGrad = createSafeRadialGradient(0, 0, 0, 0, 0, umbraR);
            umbraGrad.addColorStop(0, `rgba(2, 6, 23, ${(0.98 * smoothLimb).toFixed(3)})`);
            umbraGrad.addColorStop(0.65, `rgba(12, 18, 35, ${(0.85 * smoothLimb).toFixed(3)})`);
            umbraGrad.addColorStop(1.0, `rgba(20, 29, 52, 0)`);
            ctx.fillStyle = umbraGrad;
            ctx.beginPath();
            ctx.arc(0, 0, umbraR, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          };

          for (const spot of starspots) {
            // Draw primary umbral nest
            drawSmoothSpot(spot.lat, spot.lon, spot.r, false);
            // Draw accompanying satellite pores
            if (spot.sat && spot.sat.length > 0) {
              for (const s of spot.sat) {
                drawSmoothSpot(spot.lat + s.dLat, spot.lon + s.dLon, s.r, true);
              }
            }
          }
          ctx.restore();

          // 4. Luminous spherical coronal limb rim - no dark circumference
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.arc(cx, cy, starR - 0.5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
          break;
        }

        // =====================================================================
        // 8. ECLIPSING BINARIES (Algol Archetype)
        // =====================================================================
        case 'eclipsing-binaries': {
          const orbitPeriod = 5.0;
          const orbitAngle = (timeSec / orbitPeriod) * Math.PI * 2;
          const orbitRadiusX = 110;
          const orbitRadiusY = 28;

          const s1x = cx - Math.cos(orbitAngle) * orbitRadiusX * 0.45;
          const s1y = cy - Math.sin(orbitAngle) * orbitRadiusY * 0.45;
          const s1z = -Math.sin(orbitAngle);
          const s1R = 48;

          const s2x = cx + Math.cos(orbitAngle) * orbitRadiusX * 0.55;
          const s2y = cy + Math.sin(orbitAngle) * orbitRadiusY * 0.55;
          const s2z = Math.sin(orbitAngle);
          const s2R = 64;

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(cx, cy, orbitRadiusX * 0.55, orbitRadiusY * 0.55, 0, 0, Math.PI * 2);
          ctx.stroke();

          const renderStar1 = () => {
            const corona = createSafeRadialGradient(s1x, s1y, s1R * 0.3, s1x, s1y, s1R * 2.5);
            corona.addColorStop(0, `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 0.85)`);
            corona.addColorStop(0.5, `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, 0.25)`);
            corona.addColorStop(1, 'transparent');
            ctx.fillStyle = corona;
            ctx.beginPath();
            ctx.arc(s1x, s1y, s1R * 2.5, 0, Math.PI * 2);
            ctx.fill();

            const photo = createSafeRadialGradient(s1x - s1R * 0.2, s1y - s1R * 0.2, 4, s1x, s1y, s1R);
            photo.addColorStop(0, '#ffffff');
            photo.addColorStop(0.4, `rgb(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b})`);
            photo.addColorStop(0.8, `rgb(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b})`);
            photo.addColorStop(1, '#bfdbfe');
            ctx.fillStyle = photo;
            ctx.beginPath();
            ctx.arc(s1x, s1y, s1R, 0, Math.PI * 2);
            ctx.fill();

            // Radiant luminous limb highlight
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 1.8;
            ctx.stroke();
          };

          const renderStar2 = () => {
            const corona = createSafeRadialGradient(s2x, s2y, s2R * 0.3, s2x, s2y, s2R * 2.2);
            corona.addColorStop(0, 'rgba(251, 146, 60, 0.7)');
            corona.addColorStop(0.5, 'rgba(234, 88, 12, 0.2)');
            corona.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = corona;
            ctx.beginPath();
            ctx.arc(s2x, s2y, s2R * 2.2, 0, Math.PI * 2);
            ctx.fill();

            // Tidally stretched egg-like donor subgiant
            ctx.save();
            ctx.translate(s2x, s2y);
            const angleToPrimary = Math.atan2(s1y - s2y, s1x - s2x);
            ctx.rotate(angleToPrimary);
            ctx.scale(1.15, 0.9);

            const photo = createSafeRadialGradient(-s2R * 0.2, -s2R * 0.2, 5, 0, 0, s2R);
            photo.addColorStop(0, '#ffffff');
            photo.addColorStop(0.3, '#fef08a');
            photo.addColorStop(0.65, '#fb923c');
            photo.addColorStop(0.88, '#f97316');
            photo.addColorStop(1, '#fed7aa');
            ctx.fillStyle = photo;
            ctx.beginPath();
            ctx.arc(0, 0, s2R, 0, Math.PI * 2);
            ctx.fill();

            // Luminous warm limb highlight
            ctx.strokeStyle = 'rgba(254, 215, 170, 0.6)';
            ctx.lineWidth = 1.8;
            ctx.stroke();
            ctx.restore();
          };

          if (s1z < s2z) {
            renderStar1();
            renderStar2();
          } else {
            renderStar2();
            renderStar1();
          }
          break;
        }

        // =====================================================================
        // 9. PULSATING VARIABLES (Polaris Aa Archetype)
        // =====================================================================
        case 'pulsating-variables':
        default: {
          const period = 3.2;
          const cycle = (timeSec % period) / period;
          const breathing = Math.sin(cycle * Math.PI * 2) * 0.5 + 0.5;

          const baseR = 76;
          const starR = baseR + breathing * 24;
          const glowR = starR * (2.1 + breathing * 0.5);

          // Acoustic compression waves
          for (let i = 0; i < 2; i++) {
            const wavePhase = (cycle + i * 0.5) % 1;
            const waveR = starR + wavePhase * 95;
            const waveAlpha = Math.max(0, (1 - wavePhase) * 0.55);
            ctx.strokeStyle = `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, ${waveAlpha})`;
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.arc(cx, cy, waveR, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Corona in Polaris's warm golden-white (#fff7ed / #fef08a)
          const corona = createSafeRadialGradient(cx, cy, starR * 0.4, cx, cy, glowR);
          corona.addColorStop(0, `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${0.85 + breathing * 0.15})`);
          corona.addColorStop(0.45, `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, ${0.4 + breathing * 0.2})`);
          corona.addColorStop(0.8, `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, 0.15)`);
          corona.addColorStop(1, 'transparent');
          ctx.fillStyle = corona;
          ctx.beginPath();
          ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
          ctx.fill();

          // Photosphere
          const photo = createSafeRadialGradient(cx - starR * 0.25, cy - starR * 0.25, 5, cx, cy, starR);
          photo.addColorStop(0, '#ffffff');
          photo.addColorStop(0.35, `rgb(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b})`);
          photo.addColorStop(0.75, `rgb(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b})`);
          photo.addColorStop(1, '#fef08a');
          ctx.fillStyle = photo;
          ctx.beginPath();
          ctx.arc(cx, cy, starR, 0, Math.PI * 2);
          ctx.fill();

          // Radiant luminous limb highlight - no dark circumference
          ctx.save();
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
          ctx.lineWidth = 2.0;
          ctx.stroke();
          ctx.restore();

          // Ray flares
          const flareLen = starR * (0.7 + breathing * 1.3);
          ctx.save();
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 + breathing * 0.45})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(cx - flareLen, cy);
          ctx.lineTo(cx + flareLen, cy);
          ctx.moveTo(cx, cy - flareLen);
          ctx.lineTo(cx, cy + flareLen);
          ctx.stroke();
          ctx.restore();
          break;
        }
      }

      // =======================================================================
      // Real-Time Photometric Light Curve HUD Overlay Strip
      // =======================================================================
      const drawLightCurveHUD = () => {
        const hudX = 14;
        const hudY = h - 68;
        const hudW = w - 28;
        const hudH = 54;

        // Glass background
        ctx.save();
        ctx.fillStyle = 'rgba(2, 6, 22, 0.82)';
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(hudX, hudY, hudW, hudH, 10);
        } else {
          ctx.rect(hudX, hudY, hudW, hudH);
        }
        ctx.fill();
        ctx.stroke();

        // Calculate phase (0 to 1) and status string
        let phase = 0;
        let statusText = '';
        let curveFunc: (p: number) => number = () => 0.5;

        switch (variableId) {
          case 'cepheid-variables': {
            const p = 4.4;
            phase = (timeSec % p) / p;
            curveFunc = (ph) => {
              if (ph < 0.25) return 0.15 + (1 - ph / 0.25) * 0.75;
              const d = (ph - 0.25) / 0.75;
              return 0.15 + d * 0.75;
            };
            statusText = phase < 0.25 ? 'Leavitt Rise (Peak Luminosity)' : 'Gradual Cooling Expansion';
            break;
          }
          case 'rr-lyrae-variables': {
            const p = 1.7;
            phase = (timeSec % p) / p;
            const blazhko = Math.sin(timeSec * 0.57) * 0.25 + 0.75;
            curveFunc = (ph) => {
              const pulse = Math.pow(Math.sin(ph * Math.PI), 2.1);
              return 0.85 - pulse * 0.65 * blazhko;
            };
            statusText = `Acoustic Pulse • Blazhko: ${(blazhko * 100).toFixed(0)}%`;
            break;
          }
          case 'mira-variables': {
            const p = 6.2;
            phase = (timeSec % p) / p;
            curveFunc = (ph) => 0.5 + Math.cos(ph * Math.PI * 2) * 0.38;
            statusText = phase < 0.5 ? 'Envelope Expansion (Maximum Light)' : 'Contraction & Dust Cooling';
            break;
          }
          case 'semiregular-variables': {
            const p = 7.1;
            phase = (timeSec % p) / p;
            curveFunc = (ph) => {
              const w1 = Math.sin(ph * Math.PI * 2) * 0.25;
              const w2 = Math.sin(ph * Math.PI * 4 + 1) * 0.15;
              return 0.5 - (w1 + w2);
            };
            statusText = 'Multi-Harmonic Convective Pulse';
            break;
          }
          case 'cataclysmic-variables': {
            const p = 7.5;
            const cyc = timeSec % p;
            phase = cyc / p;
            curveFunc = (ph) => {
              const ct = ph * p;
              if (ct < 5.5) return 0.82;
              if (ct < 5.8) return 0.82 - ((ct - 5.5) / 0.3) * 0.68;
              if (ct < 6.8) return 0.14 + ((ct - 5.8) / 1.0) * 0.68;
              return 0.82;
            };
            statusText = (cyc > 5.5 && cyc < 6.8) ? 'Thermonuclear Nova Detonation!' : 'Quiescent Accretion Flow';
            break;
          }
          case 'eruptive-variables': {
            const p = 5.4;
            const cyc = timeSec % p;
            phase = cyc / p;
            curveFunc = (ph) => {
              const ct = ph * p;
              if (ct < 3.6) return 0.8;
              if (ct < 3.8) return 0.8 - ((ct - 3.6) / 0.2) * 0.65;
              if (ct < 5.0) return 0.15 + ((ct - 3.8) / 1.2) * 0.65;
              return 0.8;
            };
            statusText = (cyc > 3.6 && cyc < 5.0) ? 'Magnetic Superflare Reconnection!' : 'Quiescent Magnetic Dynamo';
            break;
          }
          case 'rotational-variables': {
            const p = 7.4;
            phase = (timeSec % p) / p;
            curveFunc = (ph) => 0.5 + Math.sin(ph * Math.PI * 2) * 0.28;
            statusText = 'Starspot Cluster Rotation';
            break;
          }
          case 'eclipsing-binaries': {
            const p = 5.0;
            phase = (timeSec % p) / p;
            curveFunc = (ph) => {
              const d1 = Math.exp(-Math.pow((ph - 0.75) * 14, 2)) * 0.62;
              const d2 = Math.exp(-Math.pow((ph - 0.25) * 14, 2)) * 0.28;
              return 0.25 + d1 + d2;
            };
            if (Math.abs(phase - 0.75) < 0.08) {
              statusText = 'Primary Eclipse Min (Hot Star Occulted)';
            } else if (Math.abs(phase - 0.25) < 0.08) {
              statusText = 'Secondary Eclipse Min (Cool Star Occulted)';
            } else {
              statusText = 'Full Out-of-Eclipse Flux';
            }
            break;
          }
          case 'pulsating-variables':
          default: {
            const p = 3.2;
            phase = (timeSec % p) / p;
            curveFunc = (ph) => 0.5 - Math.sin(ph * Math.PI * 2) * 0.32;
            statusText = 'Eddington Kappa Opacity Valve';
            break;
          }
        }

        // Left info labels
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = '#22d3ee';
        ctx.fillText('PHOTOMETRIC LIGHT CURVE', hudX + 12, hudY + 18);

        ctx.font = '10px monospace';
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(statusText, hudX + 12, hudY + 33);

        ctx.font = '8px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`PHASE: ${(phase).toFixed(2)}`, hudX + 12, hudY + 45);

        // Right side mini-graph
        const graphX = hudX + hudW - 130;
        const graphY = hudY + 8;
        const graphW = 118;
        const graphH = 38;

        // Graph grid baseline
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(graphX, graphY + graphH);
        ctx.lineTo(graphX + graphW, graphY + graphH);
        ctx.stroke();

        // Draw light curve path
        ctx.strokeStyle = `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, 0.85)`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        const steps = 40;
        for (let i = 0; i <= steps; i++) {
          const pStep = i / steps;
          const xPos = graphX + pStep * graphW;
          const yPos = graphY + curveFunc(pStep) * graphH;
          if (i === 0) ctx.moveTo(xPos, yPos);
          else ctx.lineTo(xPos, yPos);
        }
        ctx.stroke();

        // Current phase marker dot
        const curMarkerX = graphX + phase * graphW;
        const curMarkerY = graphY + curveFunc(phase) * graphH;

        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = `rgb(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b})`;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(curMarkerX, curMarkerY, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      };

      drawLightCurveHUD();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [variableId, primaryHex, coronaHex]);

  return (
    <div className={`relative aspect-square w-full h-full overflow-hidden flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="w-full h-full aspect-square object-contain block select-none pointer-events-none"
      />
    </div>
  );
};
