import React, { useEffect, useRef, useState } from 'react';
import { StarData } from '../types';
import { Eye, Layers, Sparkles, Orbit } from 'lucide-react';

export interface HypotheticalStarGraphicProps {
  hypoId: string;
  archetypeStar?: StarData | null;
  colorHex?: string;
  className?: string;
  onExoticModeChange?: (mode: 'strange' | 'electroweak' | 'boson') => void;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 56, g: 189, b: 248 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbStr(c: RGB, alpha: number = 1.0): string {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
}

/**
 * Renders high-contrast telemetry badge at the bottom of the canvas.
 */
function drawTelemetryBadge(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  category: string,
  metric: string
) {
  ctx.save();
  const badgeY = height - 34;
  ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(10, badgeY, width - 20, 26, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(22, badgeY + 13, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 8.5px monospace';
  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'left';
  ctx.fillText(category, 32, badgeY + 11);

  ctx.font = '8px monospace';
  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.fillText(metric, 32, badgeY + 21);
  ctx.restore();
}

/**
 * Smooth, clean stellar photosphere renderer
 */
function drawCleanSphere(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  coreColor: RGB,
  rimColor: RGB,
  coronaMult: number = 2.4
) {
  // Corona
  const corona = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * coronaMult);
  corona.addColorStop(0, rgbStr(coreColor, 0.65));
  corona.addColorStop(0.35, rgbStr(rimColor, 0.25));
  corona.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = corona;
  ctx.beginPath();
  ctx.arc(cx, cy, r * coronaMult, 0, Math.PI * 2);
  ctx.fill();

  // Photosphere
  const photo = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, 0, cx, cy, r);
  photo.addColorStop(0, '#ffffff');
  photo.addColorStop(0.45, rgbStr(coreColor, 1.0));
  photo.addColorStop(0.85, rgbStr(rimColor, 1.0));
  photo.addColorStop(1, rgbStr({ r: Math.max(0, rimColor.r - 40), g: Math.max(0, rimColor.g - 40), b: Math.max(0, rimColor.b - 40) }, 1.0));
  ctx.fillStyle = photo;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

export const HypotheticalStarGraphic: React.FC<HypotheticalStarGraphicProps> = ({
  hypoId,
  archetypeStar,
  colorHex = '#38bdf8',
  className = '',
  onExoticModeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Internal structure cutaway mode (for Dark Stars and Quasi-Stars)
  const [showCutaway, setShowCutaway] = useState<boolean>(true);

  // Exotic star mode (for strange-stars, electroweak-stars, boson-stars)
  const isExotic = hypoId.includes('exotic') || hypoId.includes('strange') || hypoId.includes('electroweak') || hypoId.includes('boson');
  const initialExoticMode = hypoId.includes('electroweak')
    ? 'electroweak'
    : hypoId.includes('boson')
    ? 'boson'
    : 'strange';
  const [exoticMode, setExoticMode] = useState<'strange' | 'electroweak' | 'boson'>(initialExoticMode);

  useEffect(() => {
    if (hypoId.includes('electroweak')) setExoticMode('electroweak');
    else if (hypoId.includes('boson')) setExoticMode('boson');
    else if (hypoId.includes('strange')) setExoticMode('strange');
  }, [hypoId]);

  const handleExoticSelect = (mode: 'strange' | 'electroweak' | 'boson') => {
    setExoticMode(mode);
    onExoticModeChange?.(mode);
  };

  const isStructureStar = hypoId.includes('quasi') || hypoId.includes('dark');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const startTime = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = 380 * dpr;
    canvas.height = 380 * dpr;

    // Deep space background stars
    const bgStars: { x: number; y: number; r: number; alpha: number; speed: number; baseAngle: number; dist: number }[] = [];
    for (let i = 0; i < 75; i++) {
      const bx = Math.random() * 380;
      const by = Math.random() * 380;
      const dx = bx - 190;
      const dy = by - 190;
      bgStars.push({
        x: bx,
        y: by,
        r: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.6 + 0.3,
        speed: Math.random() * 1.5 + 0.4,
        baseAngle: Math.atan2(dy, dx),
        dist: Math.hypot(dx, dy),
      });
    }

    // Particles for Quasi-Star / Dark Star accretion & annihilation
    const structureParticles: { angle: number; dist: number; speed: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      structureParticles.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * 90 + 10,
        speed: Math.random() * 0.8 + 0.4,
        size: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    // Neutrino particles for Electroweak star
    const neutrinoParticles: { angle: number; dist: number; speed: number; len: number }[] = [];
    for (let i = 0; i < 50; i++) {
      neutrinoParticles.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * 130 + 10,
        speed: Math.random() * 80 + 90,
        len: Math.random() * 14 + 6,
      });
    }

    // Quantum sparks for Iron Star / Gravastar
    const quantumSparks: { x: number; y: number; life: number; maxLife: number; size: number }[] = [];
    for (let i = 0; i < 24; i++) {
      const spAng = Math.random() * Math.PI * 2;
      const spR = Math.random() * 50;
      quantumSparks.push({
        x: 190 + Math.cos(spAng) * spR,
        y: 190 + Math.sin(spAng) * spR,
        life: Math.random(),
        maxLife: Math.random() * 1.5 + 0.8,
        size: Math.random() * 2 + 1,
      });
    }

    // Diamond facets for Black Dwarf
    const diamondFacets: { u: number; v: number; size: number; phase: number; hue: string }[] = [];
    for (let i = 0; i < 14; i++) {
      const phi = (i * (Math.PI * 2)) / 14 + Math.random() * 0.3;
      const distRatio = 0.2 + (i % 5) * 0.16;
      diamondFacets.push({
        u: Math.cos(phi) * distRatio,
        v: Math.sin(phi) * distRatio,
        size: Math.random() * 1.4 + 0.9,
        phase: Math.random() * Math.PI * 2,
        hue: i % 3 === 0 ? '#e0f2fe' : i % 3 === 1 ? '#c7d2fe' : '#fbcfe8',
      });
    }

    // Polycrystalline grains & tunneling events for Iron Star
    const ironGrainSeeds: { x: number; y: number; shade: number; angle: number }[] = [];
    for (let i = 0; i < 18; i++) {
      const gAng = Math.random() * Math.PI * 2;
      const gR = Math.random() * 46;
      ironGrainSeeds.push({
        x: 190 + Math.cos(gAng) * gR,
        y: 190 + Math.sin(gAng) * gR,
        shade: Math.random() * 0.14 - 0.07,
        angle: Math.random() * Math.PI,
      });
    }

    const tunnelingEvents: { x: number; y: number; timeOffset: number; period: number }[] = [
      { x: 172, y: 174, timeOffset: 0, period: 3.2 },
      { x: 206, y: 182, timeOffset: 1.1, period: 4.1 },
      { x: 192, y: 212, timeOffset: 2.3, period: 3.7 },
      { x: 168, y: 198, timeOffset: 0.7, period: 4.8 },
      { x: 212, y: 204, timeOffset: 1.8, period: 3.4 },
    ];

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      const width = 380;
      const height = 380;
      const cx = width / 2;
      const cy = height / 2;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Deep space background gradient
      const bg = ctx.createRadialGradient(cx, cy, 10, cx, cy, width * 0.75);
      bg.addColorStop(0, '#04081c');
      bg.addColorStop(0.65, '#020410');
      bg.addColorStop(1, '#010207');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // =======================================================================
      // BACKGROUND STARS (With gravitational lensing deflection for compact bodies)
      // =======================================================================
      const isLensingBody = hypoId.includes('black-dwarf') || hypoId.includes('gravastar') || (isExotic && exoticMode === 'boson');
      bgStars.forEach((st) => {
        let sx = st.x;
        let sy = st.y;

        // Gravitational deflection around compact dark/boson bodies
        if (isLensingBody) {
          const dx = sx - cx;
          const dy = sy - cy;
          const d = Math.hypot(dx, dy);
          if (d > 10 && d < 120) {
            const defl = (1400 / (d * d)) * (isExotic && exoticMode === 'boson' ? 1.6 : 1.1);
            sx += (dx / d) * defl;
            sy += (dy / d) * defl;
          }
        }

        const twinkle = Math.sin(elapsed * st.speed + st.x) * 0.35 + 0.65;
        ctx.fillStyle = `rgba(255, 255, 255, ${st.alpha * twinkle})`;
        ctx.beginPath();
        ctx.arc(sx, sy, st.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // =======================================================================
      // 1. BLUE DWARFS (Theoretical Post-M Dwarf Helium Enriched Titan)
      // =======================================================================
      if (hypoId.includes('blue-dwarf')) {
        const starR = 58;

        // Intense pale-blue atmospheric corona
        const corona = ctx.createRadialGradient(cx, cy, starR * 0.4, cx, cy, starR * 2.5);
        corona.addColorStop(0, 'rgba(147, 197, 253, 0.85)');
        corona.addColorStop(0.35, 'rgba(56, 189, 248, 0.4)');
        corona.addColorStop(0.75, 'rgba(30, 58, 138, 0.15)');
        corona.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = corona;
        ctx.beginPath();
        ctx.arc(cx, cy, starR * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Photosphere
        const photo = ctx.createRadialGradient(cx - starR * 0.25, cy - starR * 0.25, 0, cx, cy, starR);
        photo.addColorStop(0, '#ffffff');
        photo.addColorStop(0.3, '#dbeafe');
        photo.addColorStop(0.65, '#60a5fa');
        photo.addColorStop(0.92, '#2563eb');
        photo.addColorStop(1, '#1e3a8a');
        ctx.fillStyle = photo;
        ctx.beginPath();
        ctx.arc(cx, cy, starR, 0, Math.PI * 2);
        ctx.fill();

        // Turbulent convective cells circulating Helium
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, starR - 1, 0, Math.PI * 2);
        ctx.clip();

        for (let i = 0; i < 8; i++) {
          const flowAngle = elapsed * 0.8 + (i * Math.PI) / 4;
          const flowDist = 18 + Math.sin(elapsed * 1.5 + i) * 16;
          const fx = cx + Math.cos(flowAngle) * flowDist;
          const fy = cy + Math.sin(flowAngle) * (flowDist * 0.85);

          const cellGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, 14);
          cellGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
          cellGrad.addColorStop(0.6, 'rgba(147, 197, 253, 0.15)');
          cellGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = cellGrad;
          ctx.beginPath();
          ctx.arc(fx, fy, 14, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Limb border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();

        drawTelemetryBadge(ctx, width, height, 'THEORETICAL POST-M DWARF', 'Blue Dwarf (100% Convective Helium Core • T ≈ 10,000 K)');
      }

      // =======================================================================
      // 2. BLACK DWARFS (Cold Degenerate Carbon-Oxygen Diamond Lattice)
      // Cryogenic degenerate sphere in thermal equilibrium with CMB (T ≈ 2.73 K).
      // Smooth gravitational Einstein lensing ring, 3D orthographic diamond lattice,
      // subtle chromatic dispersion sparkles, and ultra-cold sub-millimeter radiance.
      // =======================================================================
      else if (hypoId.includes('black-dwarf')) {
        const starR = 56;

        // 1. Ultra-faint 2.73 K Cosmic Microwave Background Radiance (cryogenic thermal glow)
        const cmbRadiance = ctx.createRadialGradient(cx, cy, starR * 0.8, cx, cy, starR * 2.4);
        cmbRadiance.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
        cmbRadiance.addColorStop(0.4, 'rgba(30, 58, 138, 0.04)');
        cmbRadiance.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = cmbRadiance;
        ctx.beginPath();
        ctx.arc(cx, cy, starR * 2.4, 0, Math.PI * 2);
        ctx.fill();

        // 2. Gravitational Einstein Lensing Ring (smooth double-layer starlight deflection)
        const lensR = starR * 1.34;

        // Diffuse lensing glow
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(cx, cy, lensR, 0, Math.PI * 2);
        ctx.stroke();

        // Sharp optical caustic ring
        ctx.strokeStyle = 'rgba(224, 242, 254, 0.42)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(cx, cy, lensR, 0, Math.PI * 2);
        ctx.stroke();

        // Tangential lensed starlight arcs drifting along the Einstein ring
        for (let a = 0; a < 4; a++) {
          const arcPhase = (elapsed * 0.45 + a * (Math.PI / 2)) % (Math.PI * 2);
          const arcLen = 0.38 + Math.sin(arcPhase) * 0.12;
          ctx.strokeStyle = `rgba(186, 230, 253, ${0.4 + Math.sin(arcPhase * 2) * 0.25})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(cx, cy, lensR, arcPhase, arcPhase + arcLen);
          ctx.stroke();
        }

        // 3. Degenerate Carbon-Oxygen Crystalline Body (Smooth spherical shading)
        const darkBody = ctx.createRadialGradient(
          cx - starR * 0.32,
          cy - starR * 0.32,
          2,
          cx,
          cy,
          starR
        );
        darkBody.addColorStop(0, '#111827');
        darkBody.addColorStop(0.25, '#0a0f1d');
        darkBody.addColorStop(0.65, '#040711');
        darkBody.addColorStop(0.92, '#020308');
        darkBody.addColorStop(1, '#000000');
        ctx.fillStyle = darkBody;
        ctx.beginPath();
        ctx.arc(cx, cy, starR, 0, Math.PI * 2);
        ctx.fill();

        // 4. 3D Orthographic Crystalline Diamond Lattice
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, starR - 0.8, 0, Math.PI * 2);
        ctx.clip();

        // Perspective-curved crystalline latitude parallels
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.13)';
        ctx.lineWidth = 0.8;
        for (let lat = -50; lat <= 50; lat += 20) {
          const latRad = (lat * Math.PI) / 180;
          const yOff = Math.sin(latRad) * (starR * 0.95);
          const rCross = Math.cos(latRad) * (starR * 0.95);
          ctx.beginPath();
          ctx.ellipse(cx, cy + yOff, rCross, rCross * 0.32, 0.12, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Perspective-curved crystalline meridian planes
        for (let lon = -60; lon <= 60; lon += 30) {
          const lonRad = (lon * Math.PI) / 180;
          const xFactor = Math.sin(lonRad);
          ctx.beginPath();
          ctx.ellipse(cx + xFactor * 8, cy, Math.abs(xFactor) * (starR * 0.92) + 2, starR * 0.96, 0.12, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Hexagonal diamond crystallographic cross-slip planes
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 0.6;
        for (let k = -2; k <= 2; k++) {
          ctx.beginPath();
          ctx.moveTo(cx - starR, cy + k * 22 - starR * 0.5);
          ctx.lineTo(cx + starR, cy + k * 22 + starR * 0.5);
          ctx.stroke();
        }

        // 5. Chromatic Dispersion Diamond Facet Sparkles
        diamondFacets.forEach((df) => {
          const fx = cx + df.u * (starR * 0.82);
          const fy = cy + df.v * (starR * 0.82);
          const pulse = Math.sin(elapsed * 1.6 + df.phase);
          if (pulse > 0.1) {
            const alpha = (pulse - 0.1) / 0.9;
            ctx.fillStyle = df.hue;
            ctx.globalAlpha = alpha * 0.75;
            ctx.beginPath();
            ctx.arc(fx, fy, df.size * alpha, 0, Math.PI * 2);
            ctx.fill();

            // Delicate 4-point prismatic glint
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(fx - 4 * alpha, fy);
            ctx.lineTo(fx + 4 * alpha, fy);
            ctx.moveTo(fx, fy - 4 * alpha);
            ctx.lineTo(fx, fy + 4 * alpha);
            ctx.stroke();
          }
        });
        ctx.globalAlpha = 1.0;
        ctx.restore();

        // 6. Crisp cryogenic limb border
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(cx, cy, starR, 0, Math.PI * 2);
        ctx.stroke();

        // 7. Sub-millimeter thermal wave ripples (3 expanding cryogenic wavefronts)
        for (let w = 0; w < 3; w++) {
          const wPhase = (elapsed * 0.4 + w / 3) % 1.0;
          const wr = starR + wPhase * 44;
          ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - wPhase) * 0.22})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(cx, cy, wr, 0, Math.PI * 2);
          ctx.stroke();
        }

        drawTelemetryBadge(
          ctx,
          width,
          height,
          'COLD DEGENERATE EMBER',
          'Black Dwarf (T ≈ 2.73 K • Crystalline Diamond • Einstein Ring)'
        );
      }

      // =======================================================================
      // 3. EXOTIC STARS: STRANGE QUARK STARS
      // =======================================================================
      else if (isExotic && exoticMode === 'strange') {
        const starR = 52;

        // Relativistic frame-dragging halo
        const halo = ctx.createRadialGradient(cx, cy, starR * 0.6, cx, cy, starR * 2.2);
        halo.addColorStop(0, 'rgba(217, 70, 239, 0.65)');
        halo.addColorStop(0.4, 'rgba(168, 85, 247, 0.25)');
        halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(cx, cy, starR * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Cross-section cutaway showing internal strange quark fluid core
        if (showCutaway) {
          // Left half: Outer Degenerate Crust
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, starR, Math.PI * 0.5, Math.PI * 1.5);
          ctx.closePath();
          ctx.clip();

          const crustGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, starR);
          crustGrad.addColorStop(0, '#94a3b8');
          crustGrad.addColorStop(0.7, '#64748b');
          crustGrad.addColorStop(1, '#334155');
          ctx.fillStyle = crustGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, starR, 0, Math.PI * 2);
          ctx.fill();

          // Rapid spin lines on crust (> 2000 Hz)
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = 0.8;
          for (let y = -starR * 0.7; y <= starR * 0.7; y += 14) {
            ctx.beginPath();
            ctx.ellipse(cx, cy + y, starR * 0.85, 6, 0, Math.PI * 0.5, Math.PI * 1.5);
            ctx.stroke();
          }
          ctx.restore();

          // Right half: Cutaway exposing Strange Quark Matter (u-d-s) Core
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, starR, -Math.PI * 0.5, Math.PI * 0.5);
          ctx.closePath();
          ctx.clip();

          // 1. Strange Quark Liquid Plasma
          const coreR = starR * 0.82;
          const quarkGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
          quarkGrad.addColorStop(0, '#ffffff');
          quarkGrad.addColorStop(0.2, '#f472b6');
          quarkGrad.addColorStop(0.55, '#c026d3');
          quarkGrad.addColorStop(0.9, '#701a75');
          quarkGrad.addColorStop(1, '#4a044e');
          ctx.fillStyle = quarkGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
          ctx.fill();

          // 2. High-Voltage Electrostatic Dipole Gap (E ~ 10^18 V/cm)
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.2;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(cx, cy, coreR, -Math.PI * 0.5, Math.PI * 0.5);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // 3. Gluonic color field oscillations
          for (let p = 0; p < 14; p++) {
            const pAng = (elapsed * 2.2 + p * 0.45) % Math.PI - Math.PI * 0.5;
            const pDist = 12 + ((p * 7) % Math.floor(coreR * 0.7));
            const px = cx + Math.cos(pAng) * pDist;
            const py = cy + Math.sin(pAng) * pDist;

            ctx.fillStyle = p % 2 === 0 ? '#f472b6' : '#67e8f9';
            ctx.beginPath();
            ctx.arc(px, py, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();

          // Cutaway separator axis line
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(cx, cy - starR);
          ctx.lineTo(cx, cy + starR);
          ctx.stroke();

          // Labels
          ctx.font = '7.5px monospace';
          ctx.fillStyle = '#f472b6';
          ctx.fillText('u-d-s Quark Fluid', cx + 12, cy - 22);
          ctx.fillStyle = '#38bdf8';
          ctx.fillText('E-Gap (10¹⁸ V/cm)', cx + 12, cy + 28);
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText('Nuclear Crust', cx - 52, cy + 28);
        } else {
          // Full Photosphere with relativistic ultra-fast spin
          drawCleanSphere(ctx, cx, cy, starR, { r: 217, g: 70, b: 239 }, { r: 112, g: 26, b: 117 }, 2.2);
        }

        drawTelemetryBadge(ctx, width, height, 'DE-CONFINED QUARK MATTER', 'Strange Star (u-d-s Plasma • E-Gap ~ 10¹⁸ V/cm • Spin > 2,000 Hz)');
      }

      // =======================================================================
      // 4. EXOTIC STARS: ELECTROWEAK STARS (Quark-to-Lepton Sphaleron Burning)
      // =======================================================================
      else if (isExotic && exoticMode === 'electroweak') {
        const mantleR = 56;
        const appleCoreR = 11; // Microscopic apple-sized electroweak core

        // Torrential Neutrino Wind (radiating outwards)
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 1.2;
        neutrinoParticles.forEach((np) => {
          const progress = (elapsed * 35 + np.dist) % 140;
          const nx = cx + Math.cos(np.angle) * progress;
          const ny = cy + Math.sin(np.angle) * progress;
          const nx2 = cx + Math.cos(np.angle) * (progress + np.len);
          const ny2 = cy + Math.sin(np.angle) * (progress + np.len);

          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(nx2, ny2);
          ctx.stroke();
        });

        // Relativistic Plasma Mantle
        const mantleGrad = ctx.createRadialGradient(cx, cy, appleCoreR, cx, cy, mantleR);
        mantleGrad.addColorStop(0, 'rgba(56, 189, 248, 0.9)');
        mantleGrad.addColorStop(0.35, 'rgba(14, 165, 233, 0.7)');
        mantleGrad.addColorStop(0.75, 'rgba(2, 132, 199, 0.35)');
        mantleGrad.addColorStop(1, 'rgba(3, 105, 161, 0.1)');
        ctx.fillStyle = mantleGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, mantleR, 0, Math.PI * 2);
        ctx.fill();

        // Sphaleron anomaly field ripples around core
        for (let w = 0; w < 3; w++) {
          const wavePhase = (elapsed * 1.8 + w / 3) % 1.0;
          const wr = appleCoreR + wavePhase * (mantleR - appleCoreR);
          ctx.strokeStyle = `rgba(224, 242, 254, ${(1 - wavePhase) * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx, cy, wr, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Apple-Sized Electroweak Burning Core (ρ ~ 10²⁹ g/cm³, T ~ 10¹⁵ K)
        const coreHalo = ctx.createRadialGradient(cx, cy, 0, cx, cy, appleCoreR * 2.2);
        coreHalo.addColorStop(0, '#ffffff');
        coreHalo.addColorStop(0.4, '#38bdf8');
        coreHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreHalo;
        ctx.beginPath();
        ctx.arc(cx, cy, appleCoreR * 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx, cy, appleCoreR, 0, Math.PI * 2);
        ctx.fill();

        // Core pulsating indicator
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Reticle callouts
        ctx.font = '7.5px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Apple Core (ρ ~ 10²⁹ g/cm³)', cx + 18, cy - 8);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('Torrential Neutrino Wind', cx + 18, cy + 6);

        drawTelemetryBadge(ctx, width, height, 'ELECTROWEAK FUSION', 'Electroweak Star (Apple Core: 10 cm • Sphaleron Quarks -> Neutrinos)');
      }

      // =======================================================================
      // 5. EXOTIC STARS: BOSON STARS (Transparent Non-Baryonic Scalar Soliton)
      // =======================================================================
      else if (isExotic && exoticMode === 'boson') {
        const starR = 64;

        // Quantum scalar probability waves: concentric oscillating interference rings
        for (let ring = 0; ring < 7; ring++) {
          const ringPhase = (elapsed * 0.8 + ring * 0.16) % 1.0;
          const ringR = 12 + ring * 8 + Math.sin(elapsed * 2 + ring) * 3;
          const ringAlpha = (1 - ring / 7) * 0.65;

          ctx.strokeStyle = ring % 2 === 0 ? `rgba(16, 185, 129, ${ringAlpha})` : `rgba(52, 211, 153, ${ringAlpha * 0.8})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Transparent glass-like soliton boundary with gravitational optical distortion
        const solitonGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, starR);
        solitonGrad.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
        solitonGrad.addColorStop(0.65, 'rgba(5, 150, 105, 0.18)');
        solitonGrad.addColorStop(0.92, 'rgba(52, 211, 153, 0.45)');
        solitonGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = solitonGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, starR, 0, Math.PI * 2);
        ctx.fill();

        // Soliton outer rim
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, starR, 0, Math.PI * 2);
        ctx.stroke();

        // Quantum phase wave oscillation axis
        const phaseOsc = Math.sin(elapsed * 3);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, starR * 0.8, starR * 0.35 * Math.abs(phaseOsc), 0.3, 0, Math.PI * 2);
        ctx.stroke();

        drawTelemetryBadge(ctx, width, height, 'TRANSPARENT SCALAR CONDENSATE', 'Boson Star (Gravitationally Lensed • Bose-Einstein Soliton |ψ|²)');
      }

      // =======================================================================
      // 6. DARK STARS (Primordial DM Annihilation Titan - Structure Cutaway)
      // Colossal scale model (1-10 AU across):
      // - Massive diffuse convective gas envelope (R ~ 116 px)
      // - Thermalization shock boundary (R ~ 64 px)
      // - Central Dark Matter Annihilation Core (R ~ 32 px, WIMPs χχ -> γ, e⁺e⁻)
      // - Inflowing dark matter accretion filaments from cosmological halo
      // - Astrometric scale ruler indicator
      // =======================================================================
      else if (hypoId.includes('dark-star')) {
        const starR = 116;

        // 1. Ethereal Dark Matter Accretion Stream filaments feeding the star from space
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.28)';
        ctx.lineWidth = 1.0;
        structureParticles.forEach((sp, idx) => {
          const pProg = (elapsed * sp.speed * 0.7 + idx * 0.08) % 1.0;
          const pDist = starR * 1.55 * (1 - pProg) + 12;
          const px = cx + Math.cos(sp.angle) * pDist;
          const py = cy + Math.sin(sp.angle) * (pDist * 0.88);

          ctx.fillStyle = idx % 2 === 0 ? 'rgba(99, 102, 241, 0.65)' : 'rgba(165, 180, 252, 0.65)';
          ctx.beginPath();
          ctx.arc(px, py, sp.size * 0.9, 0, Math.PI * 2);
          ctx.fill();
        });

        // 2. Colossal diffuse outer dark matter halo & atmospheric glow
        const envelopeGrad = ctx.createRadialGradient(cx, cy, starR * 0.5, cx, cy, starR * 1.35);
        envelopeGrad.addColorStop(0, 'rgba(99, 102, 241, 0.55)');
        envelopeGrad.addColorStop(0.5, 'rgba(79, 70, 229, 0.22)');
        envelopeGrad.addColorStop(0.85, 'rgba(49, 46, 129, 0.08)');
        envelopeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = envelopeGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, starR * 1.35, 0, Math.PI * 2);
        ctx.fill();

        // 3. Astrometric Scale Ruler Bar in Upper-Left
        ctx.save();
        ctx.font = '7.5px monospace';
        ctx.fillStyle = '#a5b4fc';
        ctx.fillText('SCALE: ~2 AU (300,000,000 km)', 14, 28);
        ctx.strokeStyle = 'rgba(165, 180, 252, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(14, 33);
        ctx.lineTo(84, 33);
        ctx.moveTo(14, 30);
        ctx.lineTo(14, 36);
        ctx.moveTo(84, 30);
        ctx.lineTo(84, 36);
        ctx.stroke();
        ctx.restore();

        if (showCutaway) {
          // -------------------------------------------------------------------
          // LEFT HEMISPHERE: Billowing Cool Convective Hyper-Envelope (1-10 AU)
          // -------------------------------------------------------------------
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, starR, Math.PI * 0.5, Math.PI * 1.5);
          ctx.closePath();
          ctx.clip();

          // Smooth multi-stop convective gradient
          const surfGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, starR);
          surfGrad.addColorStop(0, '#a5b4fc');
          surfGrad.addColorStop(0.3, '#818cf8');
          surfGrad.addColorStop(0.65, '#4f46e5');
          surfGrad.addColorStop(0.88, '#312e81');
          surfGrad.addColorStop(1, '#1e1b4b');
          ctx.fillStyle = surfGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, starR, 0, Math.PI * 2);
          ctx.fill();

          // Giant Convection Plumes & Circulation Cells
          for (let c = 0; c < 8; c++) {
            const cAng = Math.PI * 0.58 + c * 0.12 * Math.PI + Math.sin(elapsed * 0.9 + c) * 0.08;
            const cDist = starR * (0.35 + (c % 3) * 0.22);
            const cxp = cx + Math.cos(cAng) * cDist;
            const cyp = cy + Math.sin(cAng) * (cDist * 0.92);

            const plumeGrad = ctx.createRadialGradient(cxp, cyp, 0, cxp, cyp, 26);
            plumeGrad.addColorStop(0, 'rgba(224, 231, 255, 0.35)');
            plumeGrad.addColorStop(0.5, 'rgba(129, 140, 248, 0.15)');
            plumeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = plumeGrad;
            ctx.beginPath();
            ctx.arc(cxp, cyp, 26, 0, Math.PI * 2);
            ctx.fill();
          }

          // Atmospheric limb shading
          const limbShade = ctx.createRadialGradient(cx, cy, starR * 0.82, cx, cy, starR);
          limbShade.addColorStop(0, 'rgba(0, 0, 0, 0)');
          limbShade.addColorStop(1, 'rgba(15, 23, 42, 0.7)');
          ctx.fillStyle = limbShade;
          ctx.beginPath();
          ctx.arc(cx, cy, starR, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();

          // -------------------------------------------------------------------
          // RIGHT HEMISPHERE: Internal Structural Cutaway
          // (Core WIMP Annihilation Engine + Thermalization Shockfront + Gas Mantle)
          // -------------------------------------------------------------------
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, starR, -Math.PI * 0.5, Math.PI * 0.5);
          ctx.closePath();
          ctx.clip();

          // 1. Infalling primordial gas mantle
          const mantleGrad = ctx.createRadialGradient(cx, cy, starR * 0.35, cx, cy, starR);
          mantleGrad.addColorStop(0, 'rgba(129, 140, 248, 0.65)');
          mantleGrad.addColorStop(0.55, 'rgba(67, 56, 202, 0.85)');
          mantleGrad.addColorStop(1, 'rgba(30, 27, 75, 0.95)');
          ctx.fillStyle = mantleGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, starR, 0, Math.PI * 2);
          ctx.fill();

          // 2. Radiative-Convective Thermalization Shock Boundary (R ~ 64 px)
          const thermalR = 64;
          // Acoustic shockwave ripples
          for (let w = 0; w < 3; w++) {
            const wProg = (elapsed * 0.8 + w * 0.33) % 1.0;
            const wr = thermalR - 6 + wProg * 14;
            ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - wProg) * 0.45})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, wr, -Math.PI * 0.5, Math.PI * 0.5);
            ctx.stroke();
          }

          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.0;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(cx, cy, thermalR, -Math.PI * 0.5, Math.PI * 0.5);
          ctx.stroke();
          ctx.setLineDash([]);

          // 3. Central Dark Matter Annihilation Core (R ~ 32 px, WIMPs χχ -> γ, e⁺e⁻)
          const coreR = 32;
          const dmCoreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
          dmCoreGrad.addColorStop(0, '#ffffff');
          dmCoreGrad.addColorStop(0.25, '#f0abfc');
          dmCoreGrad.addColorStop(0.55, '#c084fc');
          dmCoreGrad.addColorStop(0.85, '#6366f1');
          dmCoreGrad.addColorStop(1, '#312e81');
          ctx.fillStyle = dmCoreGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
          ctx.fill();

          // High-energy annihilation bursts & gamma spark flashes
          for (let b = 0; b < 10; b++) {
            const bAng = (elapsed * 2.5 + b * 0.65) % Math.PI - Math.PI * 0.5;
            const bDist = (b * 3.2) % (coreR * 0.85);
            const bx = cx + Math.cos(bAng) * bDist;
            const by = cy + Math.sin(bAng) * bDist;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(bx, by, 1.8, 0, Math.PI * 2);
            ctx.fill();

            // Micro gamma ray ionization trails
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + Math.cos(bAng) * 6, by + Math.sin(bAng) * 6);
            ctx.stroke();
          }

          ctx.restore();

          // Central cutaway divider axis
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(cx, cy - starR);
          ctx.lineTo(cx, cy + starR);
          ctx.stroke();

          // 4. Reticle Structural Annotations & Leader Lines
          ctx.font = 'bold 7.5px monospace';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('WIMP Core (χχ -> γ, e⁺e⁻)', cx + 18, cy - 14);

          ctx.fillStyle = '#38bdf8';
          ctx.fillText('Thermalization Shock', cx + 22, cy + 28);
          ctx.font = '7px monospace';
          ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
          ctx.fillText('R ~ 0.5 R☉_eq', cx + 22, cy + 38);

          ctx.fillStyle = '#a5b4fc';
          ctx.font = 'bold 7.5px monospace';
          ctx.fillText('Diffuse Envelope', cx - 110, cy + 28);
          ctx.font = '7px monospace';
          ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
          ctx.fillText('1-10 AU Scale (Saturn Orbit)', cx - 110, cy + 38);
        } else {
          // Full Photosphere (Enlarged R = 116 px)
          drawCleanSphere(ctx, cx, cy, starR, { r: 129, g: 140, b: 248 }, { r: 49, g: 46, b: 129 }, 1.35);

          // Full convective circulation cell patterns
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, starR - 1, 0, Math.PI * 2);
          ctx.clip();
          for (let i = 0; i < 14; i++) {
            const fAng = elapsed * 0.6 + (i * Math.PI) / 7;
            const fDist = 25 + Math.sin(elapsed + i) * (starR * 0.55);
            const fx = cx + Math.cos(fAng) * fDist;
            const fy = cy + Math.sin(fAng) * (fDist * 0.9);

            const cGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, 28);
            cGrad.addColorStop(0, 'rgba(224, 231, 255, 0.25)');
            cGrad.addColorStop(0.6, 'rgba(99, 102, 241, 0.12)');
            cGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = cGrad;
            ctx.beginPath();
            ctx.arc(fx, fy, 28, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        // Crisp outer envelope boundary
        ctx.strokeStyle = 'rgba(165, 180, 252, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, starR, 0, Math.PI * 2);
        ctx.stroke();

        drawTelemetryBadge(
          ctx,
          width,
          height,
          'PRIMORDIAL TITAN (1-10 AU)',
          'Dark Star (WIMP Annihilation Core • Thermalization Shock • JWST Candidate)'
        );
      }

      // =======================================================================
      // 7. QUASI-STARS (Direct Collapse Black Hole in Core - Structure Cutaway)
      // Massive scale model (~70 AU across, M > 1,000 M☉):
      // - Gargantuan convective hyper-envelope (R ~ 118 px)
      // - Super-Eddington radiation pressure shock front (R ~ 72 px)
      // - High-velocity Keplerian accretion disk funnel (R ~ 44 px)
      // - Central stellar black hole event horizon (R ~ 15 px) & photon sphere
      // - Astrometric scale ruler indicator
      // =======================================================================
      else if (hypoId.includes('quasi-star')) {
        const starR = 118;

        // 1. Radiation-driven stellar wind outflow halo
        const windGrad = ctx.createRadialGradient(cx, cy, starR * 0.6, cx, cy, starR * 1.35);
        windGrad.addColorStop(0, 'rgba(244, 63, 94, 0.55)');
        windGrad.addColorStop(0.45, 'rgba(225, 29, 72, 0.2)');
        windGrad.addColorStop(0.85, 'rgba(159, 18, 57, 0.06)');
        windGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = windGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, starR * 1.35, 0, Math.PI * 2);
        ctx.fill();

        // 2. Astrometric Scale Ruler Bar in Upper-Left
        ctx.save();
        ctx.font = '7.5px monospace';
        ctx.fillStyle = '#fda4af';
        ctx.fillText('SCALE: ~70 AU (10.5 Billion km) • M > 1,000 M☉', 14, 28);
        ctx.strokeStyle = 'rgba(253, 164, 175, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(14, 33);
        ctx.lineTo(84, 33);
        ctx.moveTo(14, 30);
        ctx.lineTo(14, 36);
        ctx.moveTo(84, 30);
        ctx.lineTo(84, 36);
        ctx.stroke();
        ctx.restore();

        if (showCutaway) {
          // -------------------------------------------------------------------
          // LEFT HEMISPHERE: Massive Convective Hyper-Envelope (M > 1000 M☉)
          // -------------------------------------------------------------------
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, starR, Math.PI * 0.5, Math.PI * 1.5);
          ctx.closePath();
          ctx.clip();

          // Rich convective hypergiant gradient
          const envGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, starR);
          envGrad.addColorStop(0, '#fda4af');
          envGrad.addColorStop(0.25, '#fb7185');
          envGrad.addColorStop(0.6, '#e11d48');
          envGrad.addColorStop(0.85, '#9f1239');
          envGrad.addColorStop(1, '#4c0519');
          ctx.fillStyle = envGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, starR, 0, Math.PI * 2);
          ctx.fill();

          // Churning turbulent convection overturn cells
          for (let c = 0; c < 9; c++) {
            const cAng = Math.PI * 0.56 + c * 0.11 * Math.PI + Math.sin(elapsed * 1.1 + c) * 0.08;
            const cDist = starR * (0.32 + (c % 3) * 0.22);
            const cxp = cx + Math.cos(cAng) * cDist;
            const cyp = cy + Math.sin(cAng) * (cDist * 0.92);

            const plumeGrad = ctx.createRadialGradient(cxp, cyp, 0, cxp, cyp, 28);
            plumeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
            plumeGrad.addColorStop(0.5, 'rgba(251, 113, 133, 0.18)');
            plumeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = plumeGrad;
            ctx.beginPath();
            ctx.arc(cxp, cyp, 28, 0, Math.PI * 2);
            ctx.fill();
          }

          // Atmospheric limb shading
          const limbShade = ctx.createRadialGradient(cx, cy, starR * 0.82, cx, cy, starR);
          limbShade.addColorStop(0, 'rgba(0, 0, 0, 0)');
          limbShade.addColorStop(1, 'rgba(30, 10, 18, 0.7)');
          ctx.fillStyle = limbShade;
          ctx.beginPath();
          ctx.arc(cx, cy, starR, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();

          // -------------------------------------------------------------------
          // RIGHT HEMISPHERE: Internal Cutaway showing Black Hole in the Core!
          // -------------------------------------------------------------------
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, starR, -Math.PI * 0.5, Math.PI * 0.5);
          ctx.closePath();
          ctx.clip();

          // 1. Infalling gas mantle
          const mantleGrad = ctx.createRadialGradient(cx, cy, starR * 0.32, cx, cy, starR);
          mantleGrad.addColorStop(0, 'rgba(251, 146, 60, 0.75)');
          mantleGrad.addColorStop(0.55, 'rgba(225, 29, 72, 0.88)');
          mantleGrad.addColorStop(1, '#4c0519');
          ctx.fillStyle = mantleGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, starR, 0, Math.PI * 2);
          ctx.fill();

          // Infalling plasma streamlines feeding the accretion zone
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.25)';
          ctx.lineWidth = 0.8;
          for (let l = 0; l < 6; l++) {
            const lAng = -Math.PI * 0.45 + l * 0.18;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(lAng) * starR, cy + Math.sin(lAng) * starR);
            ctx.quadraticCurveTo(
              cx + Math.cos(lAng + 0.2) * (starR * 0.65),
              cy + Math.sin(lAng + 0.2) * (starR * 0.65),
              cx + Math.cos(lAng + 0.4) * 44,
              cy + Math.sin(lAng + 0.4) * 44
            );
            ctx.stroke();
          }

          // 2. Super-Eddington Radiation Shock Boundary (R ~ 72 px)
          const shockR = 72;
          for (let sw = 0; sw < 3; sw++) {
            const swProg = (elapsed * 0.9 + sw * 0.33) % 1.0;
            const swR = shockR - 6 + swProg * 14;
            ctx.strokeStyle = `rgba(253, 224, 71, ${(1 - swProg) * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, swR, -Math.PI * 0.5, Math.PI * 0.5);
            ctx.stroke();
          }

          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.arc(cx, cy, shockR, -Math.PI * 0.5, Math.PI * 0.5);
          ctx.stroke();

          // Shock collision sparks
          for (let s = 0; s < 7; s++) {
            const sAng = -Math.PI * 0.45 + s * 0.15;
            const sx = cx + Math.cos(sAng) * shockR;
            const sy = cy + Math.sin(sAng) * shockR;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }

          // 3. Super-Eddington Keplerian Accretion Funnel / Disk (R ~ 44 px)
          const diskR = 44;
          const diskGrad = ctx.createRadialGradient(cx, cy, 15, cx, cy, diskR);
          diskGrad.addColorStop(0, '#ffffff');
          diskGrad.addColorStop(0.3, '#fde047');
          diskGrad.addColorStop(0.65, '#ea580c');
          diskGrad.addColorStop(1, 'rgba(185, 28, 28, 0.7)');
          ctx.fillStyle = diskGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, diskR, -Math.PI * 0.5, Math.PI * 0.5);
          ctx.fill();

          // Accretion disk swirling shear tracks
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 0.8;
          for (const dTrack of [22, 30, 38]) {
            ctx.beginPath();
            ctx.arc(cx, cy, dTrack, -Math.PI * 0.5, Math.PI * 0.5);
            ctx.stroke();
          }

          // 4. CENTRAL BLACK HOLE EVENT HORIZON & PHOTON SPHERE
          const bhR = 15;
          // Einstein Photon Sphere (luminous trapped photon ring at r ~ 21 px)
          const photonR = 21;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.0;
          ctx.shadowColor = '#c084fc';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(cx, cy, photonR, -Math.PI * 0.5, Math.PI * 0.5);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Pitch-black Schwarzschild Event Horizon (R = 15 px)
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(cx, cy, bhR, -Math.PI * 0.5, Math.PI * 0.5);
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 1.0;
          ctx.stroke();

          // Relativistic polar micro-jet plume emanating from pole inside cavity
          ctx.strokeStyle = 'rgba(192, 132, 252, 0.75)';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx, cy - 38);
          ctx.stroke();

          ctx.restore();

          // Central cutaway divider axis
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(cx, cy - starR);
          ctx.lineTo(cx, cy + starR);
          ctx.stroke();

          // 5. Reticle Structural Annotations & Leader Lines
          ctx.font = 'bold 7.5px monospace';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('Black Hole Core (BH ~20-50 M☉)', cx + 18, cy - 14);

          ctx.fillStyle = '#fde047';
          ctx.fillText('Super-Eddington Shock', cx + 22, cy + 28);
          ctx.font = '7px monospace';
          ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
          ctx.fillText('Radiation Balances Envelope', cx + 22, cy + 38);

          ctx.fillStyle = '#fda4af';
          ctx.font = 'bold 7.5px monospace';
          ctx.fillText('Hyper-Envelope', cx - 110, cy + 28);
          ctx.font = '7px monospace';
          ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
          ctx.fillText('70 AU Scale (Beyond Neptune)', cx - 110, cy + 38);
        } else {
          // Full Photosphere (Enlarged R = 118 px)
          drawCleanSphere(ctx, cx, cy, starR, { r: 244, g: 63, b: 94 }, { r: 159, g: 18, b: 57 }, 1.35);

          // Full convective circulation cell patterns
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, starR - 1, 0, Math.PI * 2);
          ctx.clip();
          for (let i = 0; i < 16; i++) {
            const fAng = elapsed * 0.7 + (i * Math.PI) / 8;
            const fDist = 28 + Math.sin(elapsed + i) * (starR * 0.55);
            const fx = cx + Math.cos(fAng) * fDist;
            const fy = cy + Math.sin(fAng) * (fDist * 0.9);

            const cGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, 30);
            cGrad.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            cGrad.addColorStop(0.6, 'rgba(244, 63, 94, 0.14)');
            cGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = cGrad;
            ctx.beginPath();
            ctx.arc(fx, fy, 30, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        // Crisp outer envelope boundary
        ctx.strokeStyle = 'rgba(251, 113, 133, 0.55)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, starR, 0, Math.PI * 2);
        ctx.stroke();

        drawTelemetryBadge(
          ctx,
          width,
          height,
          'BLACK HOLE IN CORE',
          'Quasi-Star (Direct-Collapse Singularity • Super-Eddington Disk • 70 AU)'
        );
      }

      // =======================================================================
      // 8. FROZEN STARS (Adams-Laughlin Sub-Zero Ice Atmosphere Dwarf)
      // =======================================================================
      else if (hypoId.includes('frozen-star')) {
        const starR = 54;

        // Frigid mid-infrared emission wave ripples radiating outward
        for (let ir = 0; ir < 3; ir++) {
          const irPhase = (elapsed * 0.7 + ir / 3) % 1.0;
          const irR = starR * 1.1 + irPhase * 50;
          ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - irPhase) * 0.35})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(cx, cy, irR, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Glacial blue photosphere (T ≈ 273 K / 0°C)
        const iceGrad = ctx.createRadialGradient(cx - starR * 0.25, cy - starR * 0.25, 0, cx, cy, starR);
        iceGrad.addColorStop(0, '#f0f9ff');
        iceGrad.addColorStop(0.3, '#bae6fd');
        iceGrad.addColorStop(0.65, '#38bdf8');
        iceGrad.addColorStop(0.9, '#0284c7');
        iceGrad.addColorStop(1, '#075985');
        ctx.fillStyle = iceGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, starR, 0, Math.PI * 2);
        ctx.fill();

        // Atmospheric Water-Ice Cloud Bands & Frost Crystallization
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, starR - 1, 0, Math.PI * 2);
        ctx.clip();

        // Drifting water-ice clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        for (let b = -3; b <= 3; b++) {
          const bandY = cy + b * 13;
          const drift = Math.sin(elapsed * 0.6 + b) * 8;
          ctx.beginPath();
          ctx.ellipse(cx + drift, bandY, starR * 0.85, 4.5, 0.05, 0, Math.PI * 2);
          ctx.fill();
        }

        // Sluggish deep nuclear core spark (p-p fusion at T ~ 10⁵ K)
        const corePulse = Math.sin(elapsed * 2) * 2 + 8;
        const deepCore = ctx.createRadialGradient(cx, cy, 0, cx, cy, corePulse * 1.5);
        deepCore.addColorStop(0, '#ffffff');
        deepCore.addColorStop(0.4, '#fde047');
        deepCore.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = deepCore;
        ctx.beginPath();
        ctx.arc(cx, cy, corePulse * 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Icy frost border
        ctx.strokeStyle = 'rgba(224, 242, 254, 0.8)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        drawTelemetryBadge(ctx, width, height, 'SUB-ZERO ICE DWARF', 'Frozen Star (T ≈ 273 K / 0°C • Water-Ice Clouds • Sluggish Metallicity Core)');
      }

      // =======================================================================
      // 9. GRAVASTARS (Mazur-Mottola Dark Energy Vacuum Condensate)
      // Quantum-gravitational alternative to black holes (Pawel Mazur & Emil Mottola 2001):
      // - Interior de Sitter space with negative pressure dark energy vacuum (p = -ρ, w = -1)
      // - Ultra-thin relativistic stiff-matter shell (p = +ρ, sound speed = c) at r ≈ 1.1 Rs
      // - Outward quadrupolar (l = 2) gravitational wave quantum echo rings
      // - Photon sphere at r ≈ 1.5 Rs with spacetime frame dragging
      // =======================================================================
      else if (hypoId.includes('gravastar')) {
        const starR = 56;

        // 1. Quadrupolar (l = 2) Gravitational Wave Quantum Echoes
        // Reflected off the stiff shell rather than absorbed by a classical horizon
        for (let e = 0; e < 4; e++) {
          const eProg = (elapsed * 0.65 + e * 0.25) % 1.0;
          const baseR = starR * 1.15 + eProg * 65;
          const echoAlpha = Math.sin((1 - eProg) * Math.PI) * 0.45;

          ctx.strokeStyle = `rgba(14, 165, 233, ${echoAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let step = 0; step <= 64; step++) {
            const th = (step / 64) * Math.PI * 2;
            // Quadrupolar l = 2 deformation: cos(2*th - phase)
            const rQuad = baseR + Math.cos(2 * th - elapsed * 2.8) * (5.5 * eProg);
            const qx = cx + Math.cos(th) * rQuad;
            const qy = cy + Math.sin(th) * (rQuad * 0.92);
            if (step === 0) ctx.moveTo(qx, qy);
            else ctx.lineTo(qx, qy);
          }
          ctx.stroke();
        }

        // 2. Photon Sphere Ring (at r ≈ 1.5 Rs ~ 76 px)
        const photonR = starR * 1.36;
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.35)';
        ctx.lineWidth = 1.0;
        ctx.setLineDash([3, 4]);
        ctx.lineDashOffset = -elapsed * 6;
        ctx.beginPath();
        ctx.arc(cx, cy, photonR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // 3. Interior de Sitter Spacetime Core (Dark Energy Vacuum p = -ρ)
        // Smooth quantum vacuum zero-point fluctuation field
        const vacuumGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, starR);
        vacuumGrad.addColorStop(0, '#581c87');
        vacuumGrad.addColorStop(0.35, '#3b0764');
        vacuumGrad.addColorStop(0.7, '#1e1b4b');
        vacuumGrad.addColorStop(0.92, '#0f172a');
        vacuumGrad.addColorStop(1, '#020617');
        ctx.fillStyle = vacuumGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, starR, 0, Math.PI * 2);
        ctx.fill();

        // Smooth harmonic quantum vacuum interference ripples
        for (let m = 1; m <= 5; m++) {
          const vPhase = (elapsed * 1.2 + m * 0.32) % 1.0;
          const vr = (m / 5) * (starR * 0.88);
          const vAlpha = 0.35 * Math.sin(vPhase * Math.PI);
          ctx.strokeStyle = m % 2 === 0 ? `rgba(168, 85, 247, ${vAlpha})` : `rgba(14, 165, 233, ${vAlpha})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(cx, cy, vr, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Zero-Point Vacuum Fluctuation Sparks (Micro-condensate nodes)
        for (let q = 0; q < 8; q++) {
          const qAng = elapsed * 0.8 + q * ((Math.PI * 2) / 8);
          const qDist = 14 + Math.sin(elapsed * 2.2 + q) * (starR * 0.45);
          const qx = cx + Math.cos(qAng) * qDist;
          const qy = cy + Math.sin(qAng) * (qDist * 0.85);

          const qGrad = ctx.createRadialGradient(qx, qy, 0, qx, qy, 6);
          qGrad.addColorStop(0, 'rgba(224, 242, 254, 0.8)');
          qGrad.addColorStop(0.4, 'rgba(168, 85, 247, 0.35)');
          qGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = qGrad;
          ctx.beginPath();
          ctx.arc(qx, qy, 6, 0, Math.PI * 2);
          ctx.fill();
        }

        // 4. Ultra-Thin Relativistic Stiff-Matter Shell (p = +ρ at r ≈ 1.1 Rs)
        // Multi-layered incandescent relativistic membrane
        // Outer glow
        const shellGlow = ctx.createRadialGradient(cx, cy, starR - 6, cx, cy, starR + 10);
        shellGlow.addColorStop(0, 'rgba(14, 165, 233, 0)');
        shellGlow.addColorStop(0.5, 'rgba(14, 165, 233, 0.45)');
        shellGlow.addColorStop(1, 'rgba(14, 165, 233, 0)');
        ctx.fillStyle = shellGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, starR + 10, 0, Math.PI * 2);
        ctx.fill();

        // Incandescent shell core
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.0;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 9;
        ctx.beginPath();
        ctx.arc(cx, cy, starR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Inner relativistic boundary
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.85)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(cx, cy, starR - 2.2, 0, Math.PI * 2);
        ctx.stroke();

        // 5. Astrophysical Labels
        ctx.font = 'bold 7.5px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Stiff Shell (p = ρ at 1.1 Rs)', cx - 62, cy - starR - 10);
        ctx.fillStyle = '#c084fc';
        ctx.fillText('de Sitter Core (w = -1)', cx - 48, cy - 6);
        ctx.font = '7px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('No Singularity • No Horizon', cx - 58, cy + 8);

        drawTelemetryBadge(
          ctx,
          width,
          height,
          'QUANTUM VACUUM CONDENSATE',
          'Gravastar (Mazur-Mottola: de Sitter Core • Stiff Shell • l=2 Echoes)'
        );
      }

      // =======================================================================
      // 10. IRON STARS (Freeman Dyson Quantum Tunneling Era Relic)
      // Deep cosmic time relic (t ~ 10¹⁵⁰⁰ yrs):
      // - Solid cold crystalline sphere of pure Iron-56 (ultimate nuclear ground state)
      // - Realistic polycrystalline iron grain structure & anisotropic metallic specular sheen
      // - Spontaneous pycnonuclear quantum tunneling fusion/fission events
      // - Smooth quantum coherence ripples propagating across the lattice
      // =======================================================================
      else if (hypoId.includes('iron-star')) {
        const starR = 56;

        // 1. Spontaneous Quantum Tunneling Wave Ripples (expanding across cold degenerate metal)
        tunnelingEvents.forEach((te) => {
          const tProg = ((elapsed + te.timeOffset) / te.period) % 1.0;
          const tRadius = tProg * 48;
          const tAlpha = Math.sin((1 - tProg) * Math.PI) * 0.55;

          ctx.strokeStyle = `rgba(253, 224, 71, ${tAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(te.x, te.y, tRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Active tunneling nucleation core spark
          if (tProg < 0.25) {
            const sparkAlpha = (1 - tProg / 0.25);
            ctx.fillStyle = `rgba(255, 255, 255, ${sparkAlpha})`;
            ctx.beginPath();
            ctx.arc(te.x, te.y, 2.2, 0, Math.PI * 2);
            ctx.fill();

            // Micro ionization needle
            ctx.strokeStyle = `rgba(251, 146, 60, ${sparkAlpha * 0.8})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(te.x - 5, te.y);
            ctx.lineTo(te.x + 5, te.y);
            ctx.moveTo(te.x, te.y - 5);
            ctx.lineTo(te.x, te.y + 5);
            ctx.stroke();
          }
        });

        // 2. Solid Polycrystalline Iron-56 Body (Rich anisotropic metallic specular lighting)
        const ironBody = ctx.createRadialGradient(
          cx - starR * 0.38,
          cy - starR * 0.38,
          4,
          cx,
          cy,
          starR
        );
        ironBody.addColorStop(0, '#f8fafc'); // Brilliant metallic specular highlight
        ironBody.addColorStop(0.18, '#e2e8f0');
        ironBody.addColorStop(0.42, '#94a3b8'); // Burnished steel mid-tone
        ironBody.addColorStop(0.72, '#475569'); // Shaded iron alloy
        ironBody.addColorStop(0.92, '#1e293b'); // Dark metallic limb
        ironBody.addColorStop(1, '#0f172a');
        ctx.fillStyle = ironBody;
        ctx.beginPath();
        ctx.arc(cx, cy, starR, 0, Math.PI * 2);
        ctx.fill();

        // 3. Polycrystalline Grain Structure & Anisotropic Brushed Metal Sheen
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, starR - 0.8, 0, Math.PI * 2);
        ctx.clip();

        // Anisotropic specular arcs across sphere (brushed cold steel luster)
        for (let a = -3; a <= 3; a++) {
          const arcY = cy + a * 14;
          const arcR = Math.sqrt(Math.max(0, starR * starR - (a * 14) * (a * 14)));
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(cx - starR * 0.1, arcY, arcR * 0.95, 3.5, 0.1, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Realistic Polycrystalline Grain Boundaries (Widmanstätten / Body-Centered Cubic Iron facets)
        ironGrainSeeds.forEach((seed, idx) => {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          // Draw small polygon facet around seed
          const facetR = 10 + (idx % 4) * 3;
          for (let p = 0; p < 6; p++) {
            const pAng = seed.angle + (p * Math.PI) / 3;
            const px = seed.x + Math.cos(pAng) * facetR;
            const py = seed.y + Math.sin(pAng) * facetR;
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();

          // Subtle crystallographic facet orientation shading
          ctx.fillStyle = seed.shade > 0 ? `rgba(255, 255, 255, ${seed.shade})` : `rgba(0, 0, 0, ${Math.abs(seed.shade)})`;
          ctx.fill();
        });

        // Microscopic pycnonuclear quantum tunneling flashes
        quantumSparks.forEach((sp) => {
          sp.life = (sp.life + 0.016) % sp.maxLife;
          const alpha = Math.sin((sp.life / sp.maxLife) * Math.PI);
          if (alpha > 0.3) {
            ctx.fillStyle = `rgba(254, 240, 138, ${alpha * 0.9})`;
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.size * 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        ctx.restore();

        // 4. Solid Metallic Limb Border (Cold specular rim)
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, starR, 0, Math.PI * 2);
        ctx.stroke();

        // Delicate cold steel highlight crescent along illuminated limb
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(cx, cy, starR - 0.5, -Math.PI * 0.75, -Math.PI * 0.15);
        ctx.stroke();

        drawTelemetryBadge(
          ctx,
          width,
          height,
          'ULTIMATE GROUND STATE',
          'Iron Star (Pure Fe-56 • Pycnonuclear Tunneling • Era 10¹⁵⁰⁰ yrs)'
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hypoId, exoticMode, showCutaway]);

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
        className="w-full h-full object-contain"
      />

      {/* Interactive Controls Overlay for Structure Stars (Dark Stars & Quasi-Stars) */}
      {isStructureStar && (
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10 bg-slate-950/85 backdrop-blur-md px-2 py-1 rounded-lg border border-cyan-500/30 shadow-md">
          <button
            type="button"
            onClick={() => setShowCutaway((prev) => !prev)}
            className="flex items-center gap-1 text-[9px] font-mono text-cyan-300 hover:text-white transition-all cursor-pointer"
            title="Toggle between structural cutaway and outer photosphere"
          >
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>{showCutaway ? 'Cutaway View' : 'Full Surface'}</span>
          </button>
        </div>
      )}

      {/* Interactive Controls Overlay for Exotic Stars (Strange / Electroweak / Boson) */}
      {isExotic && (
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-purple-500/30 shadow-md">
          {(['strange', 'electroweak', 'boson'] as const).map((mode) => {
            const isSelected = exoticMode === mode;
            const label = mode === 'strange' ? 'Strange Quark' : mode === 'electroweak' ? 'Electroweak' : 'Boson Soliton';
            return (
              <button
                key={mode}
                type="button"
                onClick={() => handleExoticSelect(mode)}
                className={`flex-1 text-[8.5px] font-mono font-bold py-1 px-1 rounded-lg text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-300/80 hover:text-white hover:bg-purple-950/50'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
