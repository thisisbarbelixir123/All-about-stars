import React, { useEffect, useRef, useState } from 'react';
import { StarData } from '../types';
import { Orbit, Sparkles, Compass } from 'lucide-react';
import { RunningText } from './RunningText';

export interface StarSystemGraphicProps {
  systemId: string;
  archetypeStar?: StarData | null;
  colorHex?: string;
  className?: string;
  hideHUD?: boolean;
  clusterMode?: 'open' | 'globular';
  onClusterModeChange?: (mode: 'open' | 'globular') => void;
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

function lerpRgb(a: RGB, b: RGB, t: number): RGB {
  const clampT = Math.max(0, Math.min(1, t));
  return {
    r: Math.round(a.r + (b.r - a.r) * clampT),
    g: Math.round(a.g + (b.g - a.g) * clampT),
    b: Math.round(a.b + (b.b - a.b) * clampT),
  };
}

function rgbStr(c: RGB, alpha: number = 1.0): string {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
}

/**
 * Clean Smooth Stellar Photosphere & Corona Glow:
 * Reverts to the clean, luminous gradient style without noisy granulation or spikes.
 */
function drawCleanStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  coreColor: RGB,
  rimColor?: RGB,
  coronaMultiplier: number = 2.8
) {
  const rim = rimColor || coreColor;

  // 1. Soft atmospheric corona glow
  const coronaGrad = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * coronaMultiplier);
  coronaGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
  coronaGrad.addColorStop(0.25, rgbStr(coreColor, 0.45));
  coronaGrad.addColorStop(0.7, rgbStr(rim, 0.12));
  coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = coronaGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r * coronaMultiplier, 0, Math.PI * 2);
  ctx.fill();

  // 2. Smooth crisp photosphere disk
  const photoGrad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, 0, cx, cy, r);
  photoGrad.addColorStop(0, '#ffffff');
  photoGrad.addColorStop(0.55, rgbStr(coreColor, 1.0));
  photoGrad.addColorStop(1, rgbStr(rim, 1.0));
  ctx.fillStyle = photoGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * StarSystemGraphic:
 * Renders physically authentic, texture-rich canvas animations for all stellar systems.
 */
export const StarSystemGraphic: React.FC<StarSystemGraphicProps> = ({
  systemId,
  archetypeStar,
  colorHex = '#38bdf8',
  className = '',
  hideHUD = true,
  clusterMode: externalClusterMode,
  onClusterModeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const primaryHex = archetypeStar?.colorHex || colorHex;
  const coronaHex = archetypeStar?.coronaColorHex || archetypeStar?.colorHex || colorHex;

  // Local state for cluster mode (switchable between open cluster and globular cluster)
  const [internalClusterMode, setInternalClusterMode] = useState<'open' | 'globular'>('open');
  const activeClusterMode = externalClusterMode !== undefined ? externalClusterMode : internalClusterMode;

  const handleClusterToggle = (mode: 'open' | 'globular') => {
    setInternalClusterMode(mode);
    onClusterModeChange?.(mode);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const startTime = performance.now();

    // High-resolution setup
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = 380 * dpr;
    canvas.height = 380 * dpr;

    // Background deep field stars
    const bgStars: { x: number; y: number; r: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 65; i++) {
      bgStars.push({
        x: Math.random() * 380,
        y: Math.random() * 380,
        r: Math.random() * 1.1 + 0.3,
        alpha: Math.random() * 0.6 + 0.3,
        speed: Math.random() * 1.4 + 0.4,
      });
    }

    // Cluster stars (140 persistent stars for both open and globular modes)
    const clusterStars: {
      distOpen: number;
      angleOpen: number;
      speedOpen: number;
      distGlob: number;
      angleGlob: number;
      speedGlob: number;
      r: number;
      colorOpen: RGB;
      colorGlob: RGB;
      twinkle: number;
    }[] = [];

    // Open Cluster Colors: Hot young O/B azure blue and diamond white
    const openPalette: RGB[] = [
      { r: 147, g: 197, b: 253 }, // Blue O/B
      { r: 191, g: 219, b: 254 }, // Blue-White B
      { r: 248, g: 250, b: 252 }, // Diamond White A
      { r: 96, g: 165, b: 250 },  // Electric Cerulean
    ];

    // Globular Cluster Colors: Ancient Pop II golden giants, amber subgiants & blue stragglers
    const globPalette: RGB[] = [
      { r: 251, g: 191, b: 36 },  // Golden K/G Giant
      { r: 245, g: 158, b: 11 },  // Amber Giant
      { r: 252, g: 211, b: 77 },  // Pale Yellow F
      { r: 248, g: 113, b: 113 }, // Red Giant Branch
      { r: 56, g: 189, b: 248 },  // Rare Blue Straggler
    ];

    for (let i = 0; i < 140; i++) {
      // Open cluster distribution (loose, wide, irregular)
      const u1 = Math.random();
      const distOpen = 18 + u1 * 135;
      const angleOpen = Math.random() * Math.PI * 2;
      const speedOpen = (0.12 + Math.random() * 0.15) * (Math.random() > 0.5 ? 1 : -1);

      // Globular cluster distribution (steep King profile, highly concentrated core)
      const u2 = Math.random();
      const u3 = Math.random();
      const radiusGlob = Math.sqrt(-2.0 * Math.log(Math.max(u2, 0.00001))) * 34;
      const angleGlob = u3 * Math.PI * 2;
      const speedGlob = (0.25 + 1.2 / (radiusGlob * 0.05 + 1.0)) * (Math.random() > 0.5 ? 1 : -1);

      clusterStars.push({
        distOpen,
        angleOpen,
        speedOpen,
        distGlob: radiusGlob,
        angleGlob,
        speedGlob,
        r: Math.random() * 1.5 + 0.6,
        colorOpen: openPalette[Math.floor(Math.random() * openPalette.length)],
        colorGlob: globPalette[Math.floor(Math.random() * globPalette.length)],
        twinkle: Math.random() * 3 + 1,
      });
    }

    // X-Ray Binary: Accretion stream particles (flowing through L1)
    const xrbStreamParticles: { t: number; speed: number; offset: number }[] = [];
    for (let i = 0; i < 40; i++) {
      xrbStreamParticles.push({
        t: Math.random(),
        speed: 0.45 + Math.random() * 0.35,
        offset: (Math.random() - 0.5) * 5,
      });
    }

    // X-Ray Binary: Keplerian Accretion Disk particles (swirling around Black Hole)
    const xrbDiskParticles: { r: number; angle: number; speed: number; col: string; size: number }[] = [];
    for (let i = 0; i < 65; i++) {
      const r = 9 + Math.random() * 38;
      const angle = Math.random() * Math.PI * 2;
      const speed = (1.8 / Math.sqrt(Math.max(r, 6) / 10)) * 1.5;
      const tNorm = (r - 9) / 38;
      const col = tNorm < 0.25 ? '#e0f2fe' : tNorm < 0.65 ? '#38bdf8' : tNorm < 0.85 ? '#f59e0b' : '#ef4444';
      xrbDiskParticles.push({
        r,
        angle,
        speed,
        col,
        size: Math.random() * 1.4 + 0.6,
      });
    }

    // X-Ray Binary: Hotspot Shock sparks
    const xrbSparks: { angle: number; dist: number; speed: number; life: number }[] = [];
    for (let i = 0; i < 18; i++) {
      xrbSparks.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * 6,
        speed: 12 + Math.random() * 20,
        life: Math.random(),
      });
    }

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      const width = 380;
      const height = 380;
      const cx = width / 2;
      const cy = height / 2;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Deep space radial background
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, width * 0.75);
      bgGrad.addColorStop(0, '#04081c');
      bgGrad.addColorStop(0.65, '#020410');
      bgGrad.addColorStop(1, '#010207');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Background Starfield
      ctx.fillStyle = '#ffffff';
      bgStars.forEach((st) => {
        const twinkle = Math.sin(elapsed * st.speed + st.x) * 0.35 + 0.65;
        ctx.globalAlpha = st.alpha * twinkle;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // =========================================================================
      // 1. VISUAL BINARY SYSTEMS (`visual-binaries` or fallback `binary-stars`)
      // Wide telescope-resolved pair (Albireo / Sirius AB / Alpha Centauri AB model).
      // Shows position angle protractor, angular separation micrometer arc,
      // decades timestamp orbital markers, and striking color contrast!
      // =========================================================================
      // =========================================================================
      // 1. VISUAL BINARY SYSTEMS (`visual-binaries` or fallback `binary-stars`)
      // Confocal Keplerian co-orbit around common center-of-mass barycenter.
      // True eccentric orbital mechanics (Kepler's Equation M = E - e sin E),
      // mathematically synchronized periastron/apastron passage,
      // precise confocal orbital ellipses passing exactly through the stars,
      // PA protractor reticle, decade epoch timestamps, and micrometer readouts.
      // =========================================================================
      if (systemId === 'visual-binaries' || systemId === 'binary-stars') {
        const period = 9.0; // seconds for full orbit cycle
        const ecc = 0.38;   // realistic visual binary eccentricity (like Sirius / Alpha Cen)
        const a1 = 44;      // Primary orbit semi-major (K-giant, more massive)
        const a2 = 74;      // Secondary orbit semi-major (B-dwarf, less massive, ratio ~ 1.68)

        // Orbital plane orientation & inclination projection
        const omega = -0.42; // Argument of periastron (rad)
        const cosW = Math.cos(omega);
        const sinW = Math.sin(omega);
        const ky = 0.76;     // Inclination projection factor (cos i ~ 0.76, i ~ 40°)

        // Helper to project orbital plane (focus at 0,0) to screen coordinates (barycenter at cx, cy)
        const toScreen = (xOrb: number, yOrb: number) => {
          const rx = xOrb * cosW - yOrb * sinW;
          const ry = (xOrb * sinW + yOrb * cosW) * ky;
          return { x: cx + rx, y: cy + ry };
        };

        // Solve Kepler's equation M = E - e*sin(E) for Eccentric Anomaly E
        const meanAnomaly = ((elapsed / period) * Math.PI * 2) % (Math.PI * 2);
        let eccAnomaly = meanAnomaly;
        for (let iter = 0; iter < 4; iter++) {
          eccAnomaly -=
            (eccAnomaly - ecc * Math.sin(eccAnomaly) - meanAnomaly) /
            (1 - ecc * Math.cos(eccAnomaly));
        }

        // Keplerian confocal positions in orbital plane (focus = barycenter at 0,0)
        // Primary and Secondary are on opposite sides (-a1 vs +a2) and share focal eccentricity
        const x1Orb = -a1 * (Math.cos(eccAnomaly) - ecc);
        const y1Orb = -a1 * Math.sqrt(1 - ecc * ecc) * Math.sin(eccAnomaly);

        const x2Orb = a2 * (Math.cos(eccAnomaly) - ecc);
        const y2Orb = a2 * Math.sqrt(1 - ecc * ecc) * Math.sin(eccAnomaly);

        const p1 = toScreen(x1Orb, y1Orb);
        const p2 = toScreen(x2Orb, y2Orb);

        // Telescopic Position Angle (PA) Protractor Circle & Reticle
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 120, 0, Math.PI * 2);
        ctx.stroke();

        // Protractor degree marks & cardinal directions
        ctx.font = '7.5px monospace';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.55)';
        for (let deg = 0; deg < 360; deg += 30) {
          const rad = (deg * Math.PI) / 180;
          const t1 = 120;
          const t2 = deg % 90 === 0 ? 110 : 114;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(rad) * t1, cy + Math.sin(rad) * t1);
          ctx.lineTo(cx + Math.cos(rad) * t2, cy + Math.sin(rad) * t2);
          ctx.stroke();

          // Cardinal markings (N, E, S, W)
          if (deg === 270) ctx.fillText('N (0°)', cx - 12, cy - 124);
          if (deg === 0) ctx.fillText('E (90°)', cx + 125, cy + 3);
          if (deg === 90) ctx.fillText('S (180°)', cx - 14, cy + 132);
          if (deg === 180) ctx.fillText('W (270°)', cx - 156, cy + 3);
        }

        // Confocal Keplerian Orbit Tracks (exact mathematical curves matching star motion)
        // Primary Orbit Track (Golden)
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.32)';
        ctx.lineWidth = 1.0;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for (let s = 0; s <= 64; s++) {
          const eAng = (s / 64) * Math.PI * 2;
          const sx = -a1 * (Math.cos(eAng) - ecc);
          const sy = -a1 * Math.sqrt(1 - ecc * ecc) * Math.sin(eAng);
          const pt = toScreen(sx, sy);
          if (s === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Secondary Orbit Track (Azure)
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.32)';
        ctx.beginPath();
        for (let s = 0; s <= 64; s++) {
          const eAng = (s / 64) * Math.PI * 2;
          const sx = a2 * (Math.cos(eAng) - ecc);
          const sy = a2 * Math.sqrt(1 - ecc * ecc) * Math.sin(eAng);
          const pt = toScreen(sx, sy);
          if (s === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Decade Epoch Markers on Secondary Orbit (1980, 2000, 2020, 2040)
        // Positioned using exact mean anomalies along the Keplerian track
        const epochs = [
          { label: '1980', m: 0 },
          { label: '2000', m: Math.PI * 0.5 },
          { label: '2020', m: Math.PI },
          { label: '2040', m: Math.PI * 1.5 },
        ];
        ctx.font = '8px monospace';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
        epochs.forEach((ep) => {
          let eTest = ep.m;
          for (let it = 0; it < 3; it++) {
            eTest -= (eTest - ecc * Math.sin(eTest) - ep.m) / (1 - ecc * Math.cos(eTest));
          }
          const ex = a2 * (Math.cos(eTest) - ecc);
          const ey = a2 * Math.sqrt(1 - ecc * ecc) * Math.sin(eTest);
          const ePt = toScreen(ex, ey);
          ctx.beginPath();
          ctx.arc(ePt.x, ePt.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillText(ep.label, ePt.x + 5, ePt.y + 3);
        });

        // Center of Mass (Barycenter Crosshair +)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        const cr = 6;
        ctx.beginPath();
        ctx.moveTo(cx - cr, cy);
        ctx.lineTo(cx + cr, cy);
        ctx.moveTo(cx, cy - cr);
        ctx.lineTo(cx, cy + cr);
        ctx.stroke();

        ctx.font = '7.5px monospace';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.fillText('Barycenter', cx + 8, cy - 6);

        // Astrometric Angular Separation Vector Line (Connects both stars straight through barycenter)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Albireo-style Color Contrast Pair:
        // Primary (Albireo A: Golden K-Giant, warm amber-yellow photosphere)
        drawCleanStar(ctx, p1.x, p1.y, 19, { r: 254, g: 240, b: 138 }, { r: 245, g: 158, b: 11 });

        // Secondary (Albireo B: Azure Blue B-Dwarf, diamond cyan-blue photosphere)
        drawCleanStar(ctx, p2.x, p2.y, 11, { r: 224, g: 242, b: 254 }, { r: 56, g: 189, b: 248 });

        // Real-time Astrometric Micrometer Readouts
        // Position Angle measured counter-clockwise from North (top)
        const paDeg = ((Math.atan2(p2.x - cx, -(p2.y - cy)) * (180 / Math.PI) + 360) % 360).toFixed(1);
        const sepDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const sepArcsec = ((sepDist / (a1 + a2)) * 34.4).toFixed(1);

        // Header labels fixed at top to avoid visual collision
        ctx.font = 'bold 8.5px monospace';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('Primary A: Albireo A (K3II)', 14, 24);
        ctx.fillStyle = '#67e8f9';
        ctx.fillText('Secondary B: Albireo B (B8V)', 14, 37);

        drawTelemetryBadge(
          ctx,
          width,
          height,
          'KEPLERIAN VISUAL ORBIT',
          `PA: ${paDeg}° • Sep (ρ): ${sepArcsec}" • e = ${ecc} • Albireo Pair`
        );
      }

      // =========================================================================
      // 2. SPECTROSCOPIC BINARY SYSTEMS (`spectroscopic-binaries`)
      // Close unresolved pair orbiting rapidly (Mizar A / Spica / Capella model).
      // Features:
      // - Upper half: Fast-orbiting binary with Doppler shift hue vectors.
      // - Lower half: LIVE ANIMATED SPECTROGRAPH with absorption lines (H-alpha, H-beta,
      //   Na D) physically splitting (SB2 Doppler shift: Δλ = λ * vr / c)!
      // =========================================================================
      else if (systemId === 'spectroscopic-binaries') {
        const period = 3.8;
        const angle = (elapsed / period) * Math.PI * 2;
        const orbitR = 48;

        // Top viewport center for the compact binary
        const topCy = cy - 42;

        // Star 1 (Approaching / Receding)
        const s1x = cx + Math.cos(angle) * orbitR;
        const s1y = topCy + Math.sin(angle) * (orbitR * 0.45);
        // Star 2 (Antiphase)
        const s2x = cx + Math.cos(angle + Math.PI) * orbitR;
        const s2y = topCy + Math.sin(angle + Math.PI) * (orbitR * 0.45);

        // Orbit ellipse
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, topCy, orbitR, orbitR * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Doppler Velocity factor (-1 to +1 along line of sight)
        const vrFactor1 = -Math.sin(angle);
        const vrFactor2 = Math.sin(angle); // Opposite direction

        // Render both stars with clean luminous photospheres
        drawCleanStar(ctx, s1x, s1y, 14, { r: 248, g: 250, b: 252 }, { r: 96, g: 165, b: 250 });
        drawCleanStar(ctx, s2x, s2y, 12, { r: 254, g: 240, b: 138 }, { r: 251, g: 146, b: 60 });

        // Telescopic Unresolved Blur Circle indication
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.arc(cx, topCy, orbitR + 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = '8px monospace';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.fillText('Unresolved Telescopic Point Source (Diffraction Limit)', cx - 110, topCy - orbitR - 10);

        // --- LOWER SECTION: LIVE HIGH-RESOLUTION SPECTROGRAPH ---
        const specX = 22;
        const specY = height - 100;
        const specW = width - 44;
        const specH = 26;

        // Spectrum container box
        ctx.fillStyle = '#020410';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(specX - 4, specY - 18, specW + 8, specH + 34, 8);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = '#60a5fa';
        ctx.fillText('HIGH-RESOLUTION SPECTROGRAPH (SB2 DOPPLER SPLIT)', specX, specY - 6);

        // Continuous Solar Spectrum Rainbow gradient
        const specGrad = ctx.createLinearGradient(specX, 0, specX + specW, 0);
        specGrad.addColorStop(0, '#7c3aed');   // 390nm Violet
        specGrad.addColorStop(0.18, '#3b82f6'); // 450nm Blue
        specGrad.addColorStop(0.42, '#10b981'); // 520nm Green
        specGrad.addColorStop(0.68, '#eab308'); // 590nm Yellow
        specGrad.addColorStop(0.85, '#f97316'); // 630nm Orange
        specGrad.addColorStop(1, '#ef4444');    // 700nm Red

        ctx.fillStyle = specGrad;
        ctx.fillRect(specX, specY, specW, specH);

        // Key absorption lines at rest wavelengths (normalized 0 to 1)
        const lines = [
          { name: 'Hγ', rest: 0.15 },
          { name: 'Hβ', rest: 0.38 },
          { name: 'Na D', rest: 0.68 },
          { name: 'Hα', rest: 0.88 },
        ];

        // Max Doppler shift in pixels
        const maxShiftPx = 11;
        const shift1 = vrFactor1 * maxShiftPx;
        const shift2 = vrFactor2 * maxShiftPx;

        lines.forEach((ln) => {
          const restX = specX + ln.rest * specW;

          // Star 1 absorption line (shifted by shift1)
          ctx.strokeStyle = '#020617';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(restX + shift1, specY);
          ctx.lineTo(restX + shift1, specY + specH);
          ctx.stroke();

          // Star 2 absorption line (shifted by shift2)
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(restX + shift2, specY);
          ctx.lineTo(restX + shift2, specY + specH);
          ctx.stroke();

          // Line label
          ctx.font = '8px monospace';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(ln.name, restX - 6, specY + specH + 11);
        });

        // Live Doppler Shift metric
        const vrKmS = (Math.abs(vrFactor1) * 185).toFixed(0);
        const splitStatus =
          Math.abs(vrFactor1) > 0.4
            ? `SB2 Absorption Lines Split (vr = ±${vrKmS} km/s)`
            : 'Single Composite Line (Crossing Line-of-Sight)';

        drawTelemetryBadge(ctx, width, height, 'DOPPLER SPECTROMETRY', splitStatus);
      }

      // =========================================================================
      // 3. ECLIPSING BINARIES (Line-of-Sight Photometric Dips / Algol Archetype)
      // Realistic 3D shaded spheres with quadratic limb darkening and transit shadow.
      // =========================================================================
      else if (systemId === 'eclipsing-binaries') {
        const period = 5.2;
        const phase = (elapsed / period) % 1.0;
        const angle = phase * Math.PI * 2;

        const semiMajor = 92;
        const inclinationY = 14;

        const p1x = cx + Math.cos(angle) * semiMajor;
        const p1y = cy + Math.sin(angle) * inclinationY;
        const p1z = Math.sin(angle);

        const p2x = cx + Math.cos(angle + Math.PI) * semiMajor;
        const p2y = cy + Math.sin(angle + Math.PI) * inclinationY;
        const p2z = Math.sin(angle + Math.PI);

        // Orbit path
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.28)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, semiMajor, inclinationY, 0, 0, Math.PI * 2);
        ctx.stroke();

        const dx = p1x - p2x;
        const dist2D = Math.abs(dx);
        const rPri = 22;
        const rSec = 26;
        let eclipseStatus = 'Out-of-Eclipse (Total Flux 100%)';
        let fluxLevel = 1.0;

        if (dist2D < rPri + rSec) {
          if (p2z > p1z) {
            const overlapFrac = 1.0 - Math.min(1.0, dist2D / (rPri + rSec));
            fluxLevel = 1.0 - overlapFrac * 0.65;
            eclipseStatus = `PRIMARY MINIMUM (Hot Star Eclipsed, Flux ${(fluxLevel * 100).toFixed(0)}%)`;
          } else {
            const overlapFrac = 1.0 - Math.min(1.0, dist2D / (rPri + rSec));
            fluxLevel = 1.0 - overlapFrac * 0.22;
            eclipseStatus = `SECONDARY MINIMUM (Cool Star Eclipsed, Flux ${(fluxLevel * 100).toFixed(0)}%)`;
          }
        }

        // Z-sorted draw
        const stars = [
          { x: p1x, y: p1y, z: p1z, r: rPri, type: 'primary' },
          { x: p2x, y: p2y, z: p2z, r: rSec, type: 'secondary' },
        ].sort((a, b) => a.z - b.z);

        stars.forEach((st) => {
          if (st.type === 'primary') {
            // Algol A: Hot B8V Blue-White giant
            drawCleanStar(ctx, st.x, st.y, st.r, { r: 248, g: 250, b: 252 }, { r: 99, g: 102, b: 241 });
          } else {
            // Algol B: K2IV Cooler Orange Subgiant
            drawCleanStar(ctx, st.x, st.y, st.r, { r: 254, g: 215, b: 170 }, { r: 234, g: 88, b: 12 });
          }
        });

        // Sightline indicator
        ctx.font = '10px monospace';
        ctx.fillStyle = '#818cf8';
        ctx.textAlign = 'center';
        ctx.fillText('▼ LINE OF SIGHT TO EARTH (OBSERVER) ▼', cx, height - 14);
        ctx.textAlign = 'left';

        drawTelemetryBadge(ctx, width, height, 'LINE-OF-SIGHT ECLIPSE', eclipseStatus);
      }

      // =========================================================================
      // 4. CONTACT BINARIES (Conjoined Stars / Shared Outer Convective Envelope)
      // Realistic von Zeipel gravity darkening & Roche equipotential envelope.
      // =========================================================================
      else if (systemId === 'contact-binaries') {
        const period = 3.6;
        const rotAngle = (elapsed / period) * Math.PI * 2;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotAngle);

        const d = 34;
        const r1 = 30;
        const r2 = 26;
        const neckWidth = 19;

        // Outer common envelope atmospheric halo
        const haloGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 115);
        haloGrad.addColorStop(0, 'rgba(6, 182, 212, 0.55)');
        haloGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.18)');
        haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, 98, 64, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dumbbell / Peanut Photosphere
        ctx.beginPath();
        ctx.moveTo(-d - r1, 0);
        ctx.bezierCurveTo(-d - r1, -r1 * 1.05, -d + r1 * 0.4, -r1 * 0.95, -d * 0.2, -neckWidth);
        ctx.bezierCurveTo(d * 0.2, -neckWidth, d - r2 * 0.4, -r2 * 0.95, d + r2, 0);
        ctx.bezierCurveTo(d + r2, r2 * 0.95, d * 0.2, neckWidth, 0, neckWidth);
        ctx.bezierCurveTo(-d * 0.2, neckWidth, -d - r1 * 0.4, r1 * 1.05, -d - r1, 0);
        ctx.closePath();

        // Von Zeipel Gravity Darkening: Hotter cyan-white poles, cooler golden amber neck
        const surfGrad = ctx.createLinearGradient(-d - r1, 0, d + r2, 0);
        surfGrad.addColorStop(0, '#e0f2fe');
        surfGrad.addColorStop(0.2, '#38bdf8');
        surfGrad.addColorStop(0.48, '#f59e0b');
        surfGrad.addColorStop(0.52, '#f59e0b');
        surfGrad.addColorStop(0.8, '#38bdf8');
        surfGrad.addColorStop(1, '#e0f2fe');
        ctx.fillStyle = surfGrad;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Circulating plasma transfer streamlines across the neck (L1 flow)
        const flowShift = (elapsed * 2.5) % 1.0;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.lineDashOffset = -flowShift * 10;
        ctx.beginPath();
        ctx.moveTo(-d * 0.8, -4);
        ctx.bezierCurveTo(-d * 0.3, -8, d * 0.3, -8, d * 0.8, -4);
        ctx.moveTo(d * 0.8, 4);
        ctx.bezierCurveTo(d * 0.3, 8, -d * 0.3, 8, -d * 0.8, 4);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();

        drawTelemetryBadge(ctx, width, height, 'OVERCONTACT ROCHE LOBULE', 'W UMa / VFTS 352 (Shared Envelope)');
      }

      // =========================================================================
      // 5. X-RAY BINARIES (High-Mass X-Ray Binary & Relativistic Accretion)
      // Cygnus X-1 model: O9.7Iab blue supergiant filling its critical Roche lobe,
      // supersonic ballistic stream passing through L1, disk impact shock hotspot,
      // multi-temperature Keplerian accretion disk with relativistic Doppler beaming,
      // ISCO inner rim, Schwarzschild photon sphere & event horizon,
      // high-energy X-ray wave pulses, and twin relativistic polar jets (v ≈ 0.92c)
      // wrapped in helical magnetic field lines and propagating shock knots.
      // =========================================================================
      else if (systemId === 'xray-binaries') {
        const donorX = cx - 94;
        const donorY = cy + 12;
        const bhX = cx + 76;
        const bhY = cy + 12;

        const l1x = cx - 18;
        const l1y = cy + 12;
        const hsX = bhX - 35;
        const hsY = bhY + 11;

        // -----------------------------------------------------------------------
        // A. ROCHE EQUIPOTENTIAL SURFACE (Critical Lobes / Figure-8 Boundary)
        // -----------------------------------------------------------------------
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.32)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.lineDashOffset = -elapsed * 6;

        // Donor Roche lobe
        ctx.beginPath();
        ctx.moveTo(l1x, l1y);
        ctx.bezierCurveTo(cx - 38, cy - 36, donorX + 16, donorY - 48, donorX - 10, donorY - 48);
        ctx.bezierCurveTo(donorX - 52, donorY - 48, donorX - 52, donorY + 48, donorX - 10, donorY + 48);
        ctx.bezierCurveTo(donorX + 16, donorY + 48, cx - 38, cy + 54, l1x, l1y);
        ctx.stroke();

        // Accretor Roche lobe
        ctx.beginPath();
        ctx.moveTo(l1x, l1y);
        ctx.bezierCurveTo(cx + 6, cy - 32, bhX - 16, bhY - 44, bhX + 10, bhY - 44);
        ctx.bezierCurveTo(bhX + 54, bhY - 44, bhX + 54, bhY + 44, bhX + 10, bhY + 44);
        ctx.bezierCurveTo(bhX - 16, bhY + 44, cx + 6, cy + 48, l1x, l1y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // L1 Lagrange Point Marker
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(l1x, l1y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '8px monospace';
        ctx.fillStyle = 'rgba(253, 224, 71, 0.8)';
        ctx.fillText('L₁', l1x - 4, l1y - 8);

        // -----------------------------------------------------------------------
        // B. X-RAY CORONAL EMISSION WAVE PULSES (Expanding from Black Hole)
        // -----------------------------------------------------------------------
        const diskTilt = -0.15;
        for (let w = 0; w < 3; w++) {
          const wavePhase = (elapsed * 0.75 + w / 3) % 1.0;
          const wr = 12 + wavePhase * 52;
          const waveAlpha = (1 - wavePhase) * 0.38;
          ctx.strokeStyle = `rgba(192, 132, 252, ${waveAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(bhX, bhY, wr, wr * 0.55, diskTilt, 0, Math.PI * 2);
          ctx.stroke();
        }

        // -----------------------------------------------------------------------
        // C. TWIN RELATIVISTIC POLAR JETS (Collimated Core + Helical Coil + Knots)
        // -----------------------------------------------------------------------
        const jetLen = 142;
        const jetAngle = -Math.PI / 2 + 0.12; // tilted slightly off-vertical
        const oppJetAngle = jetAngle + Math.PI;

        const drawJet = (angle: number, length: number, isApproaching: boolean) => {
          const endX = bhX + Math.cos(angle) * length;
          const endY = bhY + Math.sin(angle) * length;

          // 1. Outer relativistic sheath glow
          const sheathGrad = ctx.createLinearGradient(bhX, bhY, endX, endY);
          sheathGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
          sheathGrad.addColorStop(0.12, isApproaching ? 'rgba(192, 132, 252, 0.75)' : 'rgba(168, 85, 247, 0.55)');
          sheathGrad.addColorStop(0.55, 'rgba(56, 189, 248, 0.25)');
          sheathGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.strokeStyle = sheathGrad;
          ctx.lineWidth = isApproaching ? 6 : 4.5;
          ctx.beginPath();
          ctx.moveTo(bhX, bhY);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          // 2. Collimated ultra-relativistic core beam
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = isApproaching ? 2.2 : 1.6;
          ctx.beginPath();
          ctx.moveTo(bhX, bhY);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          // 3. Helical magnetic field coil wrapping the jet column
          ctx.beginPath();
          const perpAngle = angle + Math.PI / 2;
          const coilSteps = 28;
          for (let s = 0; s <= coilSteps; s++) {
            const dist = 6 + (s / coilSteps) * (length - 12);
            const coilAmp = (3.5 + 4.5 * (dist / length)) * (isApproaching ? 1 : 0.85);
            const coilPhase = dist * 0.14 - elapsed * (isApproaching ? 8 : 6.5);
            const perpOffset = Math.sin(coilPhase) * coilAmp;
            const px = bhX + Math.cos(angle) * dist + Math.cos(perpAngle) * perpOffset;
            const py = bhY + Math.sin(angle) * dist + Math.sin(perpAngle) * perpOffset;
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = isApproaching ? 'rgba(192, 132, 252, 0.55)' : 'rgba(168, 85, 247, 0.4)';
          ctx.lineWidth = 1.0;
          ctx.stroke();

          // 4. Propagating relativistic shock knots (3 per jet)
          for (let k = 0; k < 3; k++) {
            const knotT = (elapsed * 1.6 + k / 3) % 1.0;
            const kDist = 12 + knotT * (length - 18);
            const kx = bhX + Math.cos(angle) * kDist;
            const ky = bhY + Math.sin(angle) * kDist;
            const kAlpha = (1 - knotT * 0.6) * (isApproaching ? 1 : 0.8);

            // Knot halo
            const knotGrad = ctx.createRadialGradient(kx, ky, 0, kx, ky, 6);
            knotGrad.addColorStop(0, `rgba(255, 255, 255, ${kAlpha})`);
            knotGrad.addColorStop(0.4, `rgba(192, 132, 252, ${kAlpha * 0.8})`);
            knotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = knotGrad;
            ctx.beginPath();
            ctx.arc(kx, ky, 6, 0, Math.PI * 2);
            ctx.fill();

            // Core knot bead
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(kx, ky, isApproaching ? 2.4 : 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        };

        // Draw counter jet first (behind plane), then primary jet
        drawJet(oppJetAngle, jetLen * 0.85, false);
        drawJet(jetAngle, jetLen, true);

        // -----------------------------------------------------------------------
        // D. KEPLERIAN ACCRETION DISK (Multi-Temp & Relativistic Doppler Beaming)
        // -----------------------------------------------------------------------
        const diskRx = 50;
        const diskRy = 20;

        // Outer disk corona / thermal glow
        const diskHaloGrad = ctx.createRadialGradient(bhX, bhY, 15, bhX, bhY, diskRx * 1.35);
        diskHaloGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
        diskHaloGrad.addColorStop(0.65, 'rgba(245, 158, 11, 0.15)');
        diskHaloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = diskHaloGrad;
        ctx.beginPath();
        ctx.ellipse(bhX, bhY, diskRx * 1.3, diskRy * 1.3, diskTilt, 0, Math.PI * 2);
        ctx.fill();

        // Doppler Beamed Disk Body:
        // Left side rotates towards observer -> Doppler boosted cyan-white (hotter, brighter)
        // Right side rotates away -> red-shifted amber-red (cooler, dimmer)
        const diskGrad = ctx.createLinearGradient(
          bhX - diskRx * Math.cos(diskTilt),
          bhY - diskRx * Math.sin(diskTilt),
          bhX + diskRx * Math.cos(diskTilt),
          bhY + diskRx * Math.sin(diskTilt)
        );
        diskGrad.addColorStop(0, '#67e8f9'); // Strongly beamed approaching side
        diskGrad.addColorStop(0.28, '#ffffff'); // Peak inner hotspot
        diskGrad.addColorStop(0.55, '#f59e0b'); // Mid disk
        diskGrad.addColorStop(0.85, '#ea580c'); // Receding outer
        diskGrad.addColorStop(1, '#991b1b');    // Redshifted receding side
        ctx.fillStyle = diskGrad;
        ctx.beginPath();
        ctx.ellipse(bhX, bhY, diskRx, diskRy, diskTilt, 0, Math.PI * 2);
        ctx.fill();

        // Concentric Keplerian orbital shear tracks
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.8;
        for (const ringR of [18, 28, 38, 47]) {
          ctx.beginPath();
          ctx.ellipse(bhX, bhY, ringR, ringR * (diskRy / diskRx), diskTilt, 0, Math.PI * 2);
          ctx.stroke();
        }

        // 65 Keplerian Orbiting Disk Particles
        const cosTilt = Math.cos(diskTilt);
        const sinTilt = Math.sin(diskTilt);
        xrbDiskParticles.forEach((p) => {
          const theta = p.angle + elapsed * p.speed;
          const x0 = p.r * Math.cos(theta);
          const y0 = p.r * (diskRy / diskRx) * Math.sin(theta);
          const px = bhX + x0 * cosTilt - y0 * sinTilt;
          const py = bhY + x0 * sinTilt + y0 * cosTilt;

          // Relativistic Doppler beaming factor: approaching (x0 < 0) is brighter
          const beaming = Math.max(0.35, Math.min(1.2, 1.0 - 0.5 * (x0 / diskRx)));
          ctx.fillStyle = p.col;
          ctx.globalAlpha = Math.min(1.0, beaming);
          ctx.beginPath();
          ctx.arc(px, py, p.size * (beaming > 0.9 ? 1.2 : 0.9), 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        // Innermost Stable Circular Orbit (ISCO) ring
        ctx.strokeStyle = 'rgba(103, 232, 249, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(bhX, bhY, 13, 13 * (diskRy / diskRx), diskTilt, 0, Math.PI * 2);
        ctx.stroke();

        // -----------------------------------------------------------------------
        // E. BLACK HOLE EVENT HORIZON & PHOTON SPHERE
        // -----------------------------------------------------------------------
        // Einstein Photon Sphere ring
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(bhX, bhY, 8.2, 0, Math.PI * 2);
        ctx.stroke();

        // Singularity / Event Horizon (Absolute Pitch Black)
        ctx.fillStyle = '#010206';
        ctx.beginPath();
        ctx.arc(bhX, bhY, 6.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // -----------------------------------------------------------------------
        // F. DONOR STAR (HDE 226868 - O9.7Iab Blue Supergiant Filling Roche Lobe)
        // -----------------------------------------------------------------------
        const rDonor = 38;

        // Blue supergiant atmospheric corona glow
        const donorCorona = ctx.createRadialGradient(donorX, donorY, rDonor * 0.4, donorX, donorY, rDonor * 2.3);
        donorCorona.addColorStop(0, 'rgba(147, 197, 253, 0.85)');
        donorCorona.addColorStop(0.35, 'rgba(59, 130, 246, 0.4)');
        donorCorona.addColorStop(0.75, 'rgba(29, 78, 216, 0.12)');
        donorCorona.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = donorCorona;
        ctx.beginPath();
        ctx.arc(donorX, donorY, rDonor * 2.3, 0, Math.PI * 2);
        ctx.fill();

        // Teardrop Photosphere Envelope (filling Roche lobe towards L1)
        const donorGrad = ctx.createRadialGradient(donorX - 10, donorY - 8, 4, donorX, donorY, rDonor * 1.5);
        donorGrad.addColorStop(0, '#ffffff');
        donorGrad.addColorStop(0.25, '#dbeafe');
        donorGrad.addColorStop(0.55, '#60a5fa');
        donorGrad.addColorStop(0.85, '#2563eb');
        donorGrad.addColorStop(1, '#1e3a8a');

        ctx.fillStyle = donorGrad;
        ctx.beginPath();
        ctx.moveTo(donorX - rDonor, donorY);
        ctx.bezierCurveTo(donorX - rDonor, donorY - rDonor, donorX - 8, donorY - rDonor, l1x, l1y);
        ctx.bezierCurveTo(donorX - 8, donorY + rDonor, donorX - rDonor, donorY + rDonor, donorX - rDonor, donorY);
        ctx.closePath();
        ctx.fill();

        // Limb border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // -----------------------------------------------------------------------
        // G. L1 MASS TRANSFER ACCRETION STREAM & FLOW PARTICLES
        // -----------------------------------------------------------------------
        // Stream trajectory control points
        const cp1x = l1x + 24;
        const cp1y = l1y + 14;
        const cp2x = hsX - 14;
        const cp2y = hsY + 8;

        // Luminous supersonic stream tube
        const streamGrad = ctx.createLinearGradient(l1x, l1y, hsX, hsY);
        streamGrad.addColorStop(0, 'rgba(253, 224, 71, 0.85)');
        streamGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.75)');
        streamGrad.addColorStop(1, 'rgba(103, 232, 249, 0.95)');
        ctx.strokeStyle = streamGrad;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(l1x, l1y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, hsX, hsY);
        ctx.stroke();

        // 40 Accelerating Stream Particles
        xrbStreamParticles.forEach((p) => {
          const rawT = (p.t + elapsed * p.speed) % 1.0;
          // Gravitational acceleration towards black hole: s = rawT^1.4
          const s = Math.pow(rawT, 1.4);
          const oneMinusS = 1 - s;
          const bx =
            oneMinusS * oneMinusS * oneMinusS * l1x +
            3 * oneMinusS * oneMinusS * s * cp1x +
            3 * oneMinusS * s * s * cp2x +
            s * s * s * hsX;
          const by =
            oneMinusS * oneMinusS * oneMinusS * l1y +
            3 * oneMinusS * oneMinusS * s * cp1y +
            3 * oneMinusS * s * s * cp2y +
            s * s * s * hsY;

          // Perpendicular offset narrowing near impact
          const offsetScale = (1 - s * 0.6) * p.offset;
          const px = bx;
          const py = by + offsetScale;

          const pCol = s < 0.35 ? '#fde047' : s < 0.75 ? '#fb923c' : '#ffffff';
          ctx.fillStyle = pCol;
          ctx.beginPath();
          ctx.arc(px, py, 1.5 * (1 - s * 0.25), 0, Math.PI * 2);
          ctx.fill();
        });

        // -----------------------------------------------------------------------
        // H. HOTSPOT SHOCK COLLISION & EXPLOSION SPARKS
        // -----------------------------------------------------------------------
        const shockPulse = Math.sin(elapsed * 14) * 2 + 7;

        // Shock flare glow
        const shockGrad = ctx.createRadialGradient(hsX, hsY, 0, hsX, hsY, shockPulse * 2.2);
        shockGrad.addColorStop(0, '#ffffff');
        shockGrad.addColorStop(0.3, '#fde047');
        shockGrad.addColorStop(0.65, '#f97316');
        shockGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = shockGrad;
        ctx.beginPath();
        ctx.arc(hsX, hsY, shockPulse * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Hotspot core bead
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(hsX, hsY, 3.2, 0, Math.PI * 2);
        ctx.fill();

        // 18 Hotspot shock explosion sparks
        xrbSparks.forEach((sp) => {
          const life = (sp.life + elapsed * 1.8) % 1.0;
          const dist = life * sp.speed;
          const sx = hsX + Math.cos(sp.angle) * dist;
          const sy = hsY + Math.sin(sp.angle) * dist;
          const alpha = (1 - life) * 0.9;
          ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(0.5, 1.8 * (1 - life)), 0, Math.PI * 2);
          ctx.fill();
        });

        // -----------------------------------------------------------------------
        // I. ASTROPHYSICAL HUD LABELS & LEADER LINES
        // -----------------------------------------------------------------------
        ctx.font = 'bold 8.5px monospace';

        // 1. Relativistic Jets
        ctx.fillStyle = '#c084fc';
        ctx.fillText('RELATIVISTIC JETS (v ≈ 0.92c)', bhX - 25, cy - 130);
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(bhX + 35, cy - 128);
        ctx.lineTo(bhX + Math.cos(jetAngle) * 110, bhY + Math.sin(jetAngle) * 110);
        ctx.stroke();

        // 2. Donor Star (HDE 226868)
        ctx.fillStyle = '#93c5fd';
        ctx.fillText('DONOR: HDE 226868 (O9.7Iab)', donorX - 48, donorY + 54);
        ctx.font = '7.5px monospace';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.fillText('Mass ~20-40 M☉ (Roche Overflow)', donorX - 48, donorY + 65);

        // 3. Hotspot Impact
        ctx.font = 'bold 8px monospace';
        ctx.fillStyle = '#fde047';
        ctx.fillText('L1 IMPACT HOTSPOT', hsX - 45, hsY - 14);
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(hsX - 5, hsY - 12);
        ctx.lineTo(hsX, hsY - 2);
        ctx.stroke();

        // 4. Black Hole Accretor & ISCO
        ctx.fillStyle = '#67e8f9';
        ctx.fillText('CYGNUS X-1 (BH ~21.2 M☉)', bhX - 35, bhY + 44);
        ctx.font = '7.5px monospace';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.fillText('ISCO & Event Horizon', bhX - 25, bhY + 54);

        drawTelemetryBadge(ctx, width, height, 'RELATIVISTIC ACCRETION', 'Cygnus X-1 (Stellar Black Hole + O9.7Iab)');
      }

      // =========================================================================
      // 6. MULTIPLE STAR SYSTEMS (Hierarchical Gravitational Architectures)
      // Castor 6-star architecture (Alpha Geminorum):
      // True nested hierarchy with 3 gravitationally bound binary subsystems (A, B, C):
      // - Castor A: Aa (A1V white) + Ab (dM red companion), rapid spectroscopic sub-orbit
      // - Castor B: Ba (A2Vm blue-white) + Bb (dM red companion), rapid spectroscopic sub-orbit
      // - Mutual A-B orbit around inner system barycenter
      // - Castor C: YY Geminorum (Ca + Cb twin flare red dwarfs) in wide outer orbit
      // Includes all 6 physical stars, nested Keplerian sub-orbit tracks, barycenter crosshairs,
      // and Jacobi gravitational stability boundary.
      // =========================================================================
      else if (systemId === 'multiple-star-systems') {
        const sysBx = cx - 8;
        const sysBy = cy + 4;

        // 1. Mutual AB Core Binary Orbit (Castor A & B revolving around inner barycenter)
        const periodAB = 13.0; // Mutual orbit period (s)
        const angleAB = (elapsed / periodAB) * Math.PI * 2;
        const rAB = 56;
        const abAspect = 0.66;
        const tiltAB = -0.18;

        const cosTAB = Math.cos(tiltAB);
        const sinTAB = Math.sin(tiltAB);

        const toABCanvas = (x0: number, y0: number) => {
          const rx = x0 * cosTAB - y0 * sinTAB;
          const ry = x0 * sinTAB + y0 * cosTAB;
          return { x: sysBx + rx, y: sysBy + ry };
        };

        // Inner mutual AB barycenter crosshair
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.2;
        const cr = 5;
        ctx.beginPath();
        ctx.moveTo(sysBx - cr, sysBy);
        ctx.lineTo(sysBx + cr, sysBy);
        ctx.moveTo(sysBx, sysBy - cr);
        ctx.lineTo(sysBx, sysBy + cr);
        ctx.stroke();

        ctx.font = '7px monospace';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.fillText('Barycenter AB', sysBx + 7, sysBy - 5);

        // AB Mutual Orbit Track (dashed ellipse)
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for (let s = 0; s <= 60; s++) {
          const aSample = (s / 60) * Math.PI * 2;
          const pt = toABCanvas(Math.cos(aSample) * rAB, Math.sin(aSample) * (rAB * abAspect));
          if (s === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // 2. Wide Outer Castor C (YY Geminorum) Orbit Track
        const periodC = 36.0; // Wide hierarchical period (s)
        const angleC = (elapsed / periodC) * Math.PI * 2;
        const rC = 124;
        const cAspect = 0.68;

        ctx.strokeStyle = 'rgba(248, 113, 113, 0.28)';
        ctx.beginPath();
        for (let s = 0; s <= 72; s++) {
          const cSample = (s / 72) * Math.PI * 2;
          const pt = toABCanvas(Math.cos(cSample) * rC, Math.sin(cSample) * (rC * cAspect));
          if (s === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Jacobi Gravitational Stability Boundary (Hill sphere of inner system)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 5]);
        ctx.beginPath();
        for (let s = 0; s <= 50; s++) {
          const jSample = (s / 50) * Math.PI * 2;
          const pt = toABCanvas(Math.cos(jSample) * (rAB * 1.45), Math.sin(jSample) * (rAB * 1.45 * abAspect));
          if (s === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // ---------------------------------------------------------------------
        // SUB-SYSTEM 1: CASTOR A (Aa + Ab)
        // ---------------------------------------------------------------------
        const barAPt = toABCanvas(Math.cos(angleAB) * rAB, Math.sin(angleAB) * (rAB * abAspect));
        const periodA = 2.2;
        const angleA = (elapsed / periodA) * Math.PI * 2;
        const rSubA = 16;
        const subAspect = 0.72;

        // Sub-orbit track A
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.ellipse(barAPt.x, barAPt.y, rSubA, rSubA * subAspect, tiltAB, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Local barycenter crosshair A
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(barAPt.x - 3, barAPt.y);
        ctx.lineTo(barAPt.x + 3, barAPt.y);
        ctx.moveTo(barAPt.x, barAPt.y - 3);
        ctx.lineTo(barAPt.x, barAPt.y + 3);
        ctx.stroke();

        // Aa (primary, mass ~ 2.76 M☉) and Ab (dwarf, mass ~ 0.5 M☉)
        const rAa = 3.8;
        const rAb = 12.2;
        const a1x = barAPt.x + Math.cos(angleA) * rAa;
        const a1y = barAPt.y + Math.sin(angleA) * (rAa * subAspect);
        const a2x = barAPt.x - Math.cos(angleA) * rAb;
        const a2y = barAPt.y - Math.sin(angleA) * (rAb * subAspect);

        // Gravitational vector tie line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(a1x, a1y);
        ctx.lineTo(a2x, a2y);
        ctx.stroke();

        // Star 1: Aa (A1V Diamond White)
        drawCleanStar(ctx, a1x, a1y, 7.2, { r: 255, g: 255, b: 255 }, { r: 56, g: 189, b: 248 });
        // Star 2: Ab (M-dwarf Crimson)
        drawCleanStar(ctx, a2x, a2y, 3.4, { r: 252, g: 165, b: 165 }, { r: 239, g: 68, b: 68 });

        // ---------------------------------------------------------------------
        // SUB-SYSTEM 2: CASTOR B (Ba + Bb)
        // ---------------------------------------------------------------------
        const barBPt = toABCanvas(Math.cos(angleAB + Math.PI) * rAB, Math.sin(angleAB + Math.PI) * (rAB * abAspect));
        const periodB = 1.7;
        const angleB = (elapsed / periodB) * Math.PI * 2;
        const rSubB = 14.5;

        // Sub-orbit track B
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.35)';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.ellipse(barBPt.x, barBPt.y, rSubB, rSubB * subAspect, tiltAB, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Local barycenter crosshair B
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(barBPt.x - 3, barBPt.y);
        ctx.lineTo(barBPt.x + 3, barBPt.y);
        ctx.moveTo(barBPt.x, barBPt.y - 3);
        ctx.lineTo(barBPt.x, barBPt.y + 3);
        ctx.stroke();

        // Ba (primary, mass ~ 2.98 M☉) and Bb (dwarf, mass ~ 0.5 M☉)
        const rBa = 3.4;
        const rBb = 11.1;
        const b1x = barBPt.x + Math.cos(angleB) * rBa;
        const b1y = barBPt.y + Math.sin(angleB) * (rBa * subAspect);
        const b2x = barBPt.x - Math.cos(angleB) * rBb;
        const b2y = barBPt.y - Math.sin(angleB) * (rBb * subAspect);

        // Gravitational vector tie line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(b1x, b1y);
        ctx.lineTo(b2x, b2y);
        ctx.stroke();

        // Star 3: Ba (A2Vm Blue-White)
        drawCleanStar(ctx, b1x, b1y, 6.4, { r: 240, g: 249, b: 255 }, { r: 168, g: 85, b: 247 });
        // Star 4: Bb (M-dwarf Crimson)
        drawCleanStar(ctx, b2x, b2y, 3.2, { r: 252, g: 165, b: 165 }, { r: 239, g: 68, b: 68 });

        // ---------------------------------------------------------------------
        // SUB-SYSTEM 3: CASTOR C (YY Geminorum: Ca + Cb)
        // ---------------------------------------------------------------------
        const barCPt = toABCanvas(Math.cos(angleC) * rC, Math.sin(angleC) * (rC * cAspect));
        const periodSubC = 0.88;
        const angleSubC = (elapsed / periodSubC) * Math.PI * 2;
        const rSubC = 8.5;

        // Sub-orbit track C
        ctx.strokeStyle = 'rgba(248, 113, 113, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.ellipse(barCPt.x, barCPt.y, rSubC, rSubC * subAspect, tiltAB, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Local barycenter crosshair C
        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(barCPt.x - 3, barCPt.y);
        ctx.lineTo(barCPt.x + 3, barCPt.y);
        ctx.moveTo(barCPt.x, barCPt.y - 3);
        ctx.lineTo(barCPt.x, barCPt.y + 3);
        ctx.stroke();

        // Twin flare red dwarfs (Ca & Cb, symmetric masses ~ 0.6 M☉)
        const c1x = barCPt.x + Math.cos(angleSubC) * 4.3;
        const c1y = barCPt.y + Math.sin(angleSubC) * (4.3 * subAspect);
        const c2x = barCPt.x - Math.cos(angleSubC) * 4.3;
        const c2y = barCPt.y - Math.sin(angleSubC) * (4.3 * subAspect);

        // Gravitational vector tie line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(c1x, c1y);
        ctx.lineTo(c2x, c2y);
        ctx.stroke();

        // Star 5: Ca (Flare Red Dwarf)
        drawCleanStar(ctx, c1x, c1y, 3.8, { r: 254, g: 202, b: 202 }, { r: 239, g: 68, b: 68 });
        // Star 6: Cb (Flare Red Dwarf)
        drawCleanStar(ctx, c2x, c2y, 3.8, { r: 254, g: 202, b: 202 }, { r: 239, g: 68, b: 68 });

        // ---------------------------------------------------------------------
        // ASTROPHYSICAL HUD LABELS & ANNOTATIONS
        // ---------------------------------------------------------------------
        ctx.font = 'bold 8px monospace';
        ctx.fillStyle = '#67e8f9';
        ctx.fillText('Castor A (Aa+Ab, ~9.2d)', 14, 22);

        ctx.fillStyle = '#c084fc';
        ctx.fillText('Castor B (Ba+Bb, ~2.9d)', 14, 34);

        ctx.fillStyle = '#f87171';
        ctx.fillText('Castor C / YY Gem (Ca+Cb, ~0.81d)', 14, 46);

        drawTelemetryBadge(
          ctx,
          width,
          height,
          'HIERARCHICAL SEXTUPLE',
          'Castor System (Alpha Geminorum: 3 Bound Binaries / 6 Stars)'
        );
      }

      // =========================================================================
      // 7. PLANET-HOSTING STARS (Exoplanetary Systems / Habitable Zone Resonances)
      // Realistic host star, green habitable zone ring, and 4 detailed exoplanets.
      // =========================================================================
      else if (systemId === 'planet-hosting-stars') {
        const hzInner = 72;
        const hzOuter = 105;
        const hzGrad = ctx.createRadialGradient(cx, cy, hzInner, cx, cy, hzOuter);
        hzGrad.addColorStop(0, 'rgba(74, 222, 128, 0)');
        hzGrad.addColorStop(0.5, 'rgba(74, 222, 128, 0.18)');
        hzGrad.addColorStop(1, 'rgba(74, 222, 128, 0)');
        ctx.fillStyle = hzGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, hzOuter, 0, Math.PI * 2);
        ctx.arc(cx, cy, hzInner, 0, Math.PI * 2, true);
        ctx.fill();

        // Host Star (G-type Solar Gold)
        drawCleanStar(ctx, cx, cy, 21, { r: 254, g: 240, b: 138 }, { r: 245, g: 158, b: 11 });

        // 4 Exoplanets
        const planets = [
          { rOrb: 42, period: 2.1, rBody: 3.2, col: '#f87171' },
          { rOrb: 62, period: 3.5, rBody: 4.2, col: '#fbbf24' },
          { rOrb: 88, period: 5.8, rBody: 4.8, col: '#4ade80' },
          { rOrb: 132, period: 9.6, rBody: 7.2, col: '#38bdf8' },
        ];

        planets.forEach((pl) => {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(cx, cy, pl.rOrb, 0, Math.PI * 2);
          ctx.stroke();

          const plAngle = (elapsed / pl.period) * Math.PI * 2;
          const px = cx + Math.cos(plAngle) * pl.rOrb;
          const py = cy + Math.sin(plAngle) * pl.rOrb;

          ctx.fillStyle = pl.col;
          ctx.beginPath();
          ctx.arc(px, py, pl.rBody, 0, Math.PI * 2);
          ctx.fill();
        });

        drawTelemetryBadge(ctx, width, height, 'EXOPLANETARY SYSTEM', 'TRAPPIST-1 (7 Resonant Worlds / Habitable Zone)');
      }

      // =========================================================================
      // 8. STAR CLUSTERS (SWITCHABLE: OPEN CLUSTER vs GLOBULAR CLUSTER)
      // Open Cluster: Pleiades M45 model with ethereal blue reflection nebula dust.
      // Globular Cluster: Omega Centauri model with ancient golden stars & core collapse.
      // =========================================================================
      else if (systemId === 'star-clusters') {
        if (activeClusterMode === 'open') {
          // --- OPEN CLUSTER MODE (Pleiades M45) ---
          // Ethereal blue reflection nebula dust clouds (Merope dust filaments)
          const nebGrad = ctx.createRadialGradient(cx, cy, 15, cx, cy, 155);
          nebGrad.addColorStop(0, 'rgba(56, 189, 248, 0.32)');
          nebGrad.addColorStop(0.4, 'rgba(14, 165, 233, 0.16)');
          nebGrad.addColorStop(0.75, 'rgba(99, 102, 241, 0.08)');
          nebGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = nebGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, 155, 0, Math.PI * 2);
          ctx.fill();

          // Render young hot blue stars
          clusterStars.slice(0, 75).forEach((st) => {
            const curAngle = st.angleOpen + elapsed * st.speedOpen * 0.15;
            const sx = cx + Math.cos(curAngle) * st.distOpen;
            const sy = cy + Math.sin(curAngle) * (st.distOpen * 0.85);
            const twinkle = Math.sin(elapsed * st.twinkle + st.distOpen) * 0.3 + 0.7;

            ctx.fillStyle = rgbStr(st.colorOpen, twinkle);
            ctx.beginPath();
            ctx.arc(sx, sy, st.r, 0, Math.PI * 2);
            ctx.fill();
          });

          // Benchmark Pleiades Monster Stars (Alcyone, Maia, Electra)
          const beacons = [
            { dx: -22, dy: -16, r: 6.5, name: 'Alcyone (B7IIIe)' },
            { dx: 26, dy: -12, r: 5.2, name: 'Maia (B8III)' },
            { dx: -8, dy: 32, r: 4.8, name: 'Electra (B5III)' },
          ];

          beacons.forEach((b) => {
            const bx = cx + b.dx;
            const by = cy + b.dy;
            drawCleanStar(ctx, bx, by, b.r, { r: 224, g: 242, b: 254 }, { r: 56, g: 189, b: 248 });
            ctx.font = '8px monospace';
            ctx.fillStyle = '#bae6fd';
            ctx.fillText(b.name, bx + 9, by - 4);
          });

          drawTelemetryBadge(ctx, width, height, 'OPEN CLUSTER (PLEIADES M45)', 'Young Pop I • Reflection Nebula • Loose Drift');
        } else {
          // --- GLOBULAR CLUSTER MODE (Omega Centauri / M13) ---
          // Dense spherical core collapse of 140+ ancient golden stars
          const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 65);
          coreGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
          coreGrad.addColorStop(0.4, 'rgba(251, 191, 36, 0.22)');
          coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, 65, 0, Math.PI * 2);
          ctx.fill();

          // Collective gravitational equipotential lines
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.18)';
          ctx.lineWidth = 0.8;
          ctx.setLineDash([2, 5]);
          [35, 68, 105, 142].forEach((rad) => {
            ctx.beginPath();
            ctx.arc(cx, cy, rad, 0, Math.PI * 2);
            ctx.stroke();
          });
          ctx.setLineDash([]);

          // Swarming stars concentrated at core
          clusterStars.forEach((st) => {
            const curAngle = st.angleGlob + elapsed * st.speedGlob * 0.2;
            const sx = cx + Math.cos(curAngle) * st.distGlob;
            const sy = cy + Math.sin(curAngle) * st.distGlob;
            const twinkle = Math.sin(elapsed * st.twinkle + st.distGlob) * 0.3 + 0.7;

            ctx.fillStyle = rgbStr(st.colorGlob, twinkle);
            ctx.beginPath();
            ctx.arc(sx, sy, st.r, 0, Math.PI * 2);
            ctx.fill();
          });

          // Luminous Core Giants
          drawCleanStar(ctx, cx, cy, 8, { r: 254, g: 240, b: 138 }, { r: 245, g: 158, b: 11 });

          drawTelemetryBadge(ctx, width, height, 'GLOBULAR CLUSTER (OMEGA CEN)', 'Ancient Pop II • Dense Core Collapse • Spherical Swarm');
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [systemId, activeClusterMode, primaryHex, coronaHex, hideHUD]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {/* Switcher Controls for Star Clusters (Open Cluster vs Globular Cluster) */}
      {systemId === 'star-clusters' && (
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 p-1 rounded-xl bg-[#030718]/90 border border-cyan-500/40 shadow-lg backdrop-blur-md">
          <button
            type="button"
            onClick={() => handleClusterToggle('open')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
              activeClusterMode === 'open'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Switch to Open Cluster (Pleiades reflection nebula)"
          >
            Open Cluster
          </button>
          <button
            type="button"
            onClick={() => handleClusterToggle('globular')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
              activeClusterMode === 'globular'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Switch to Globular Cluster (Omega Centauri dense core)"
          >
            Globular Cluster
          </button>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain block select-none pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

/**
 * Draws a sci-fi telemetry badge in the bottom area of the canvas.
 */
function drawTelemetryBadge(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tag: string,
  detail: string
) {
  const pad = 12;
  const boxH = 34;
  const boxY = height - boxH - pad;
  const boxW = width - pad * 2;

  ctx.fillStyle = 'rgba(2, 6, 23, 0.82)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.roundRect(pad, boxY, boxW, boxH, 8);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`● ${tag}`, pad + 8, boxY + 14);

  ctx.font = '8.5px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(detail, pad + 8, boxY + 26);
}

export interface StarSystemActivityMonitorProps {
  systemId: string;
  colorHex?: string;
  className?: string;
  clusterMode?: 'open' | 'globular';
}

/**
 * StarSystemActivityMonitor:
 * Detached real-time telemetry component with a live waveform / orbital dynamics canvas
 * placed at the top of the right panel, matching the VariableStarActivityMonitor.
 */
export const StarSystemActivityMonitor: React.FC<StarSystemActivityMonitorProps> = ({
  systemId,
  colorHex = '#38bdf8',
  className = '',
  clusterMode = 'open',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getSystemTelemetry = () => {
    switch (systemId) {
      case 'visual-binaries':
      case 'binary-stars':
        return {
          title: 'Astrometric Orbital Trajectory & Micrometer',
          status: 'Direct Optical Resolution (Sirius / Albireo)',
          metric1Name: 'Semi-Major Axis',
          metric1Val: '17.6 AU (Sirius AB)',
          metric2Name: 'Orbital Period',
          metric2Val: '50.1 Years',
          metric3Name: 'Mass Ratio (q)',
          metric3Val: '0.48 (M₂ / M₁)',
        };
      case 'spectroscopic-binaries':
        return {
          title: 'Doppler Spectral Line Velocity Curve',
          status: 'Radial Velocity Shifts (SB2 Double-Lined)',
          metric1Name: 'Orbital Velocity',
          metric1Val: '±185 km/s (Spica)',
          metric2Name: 'Orbital Period',
          metric2Val: '4.014 Days',
          metric3Name: 'Doppler Shift (Δλ)',
          metric3Val: '±0.42 nm at Hα',
        };
      case 'eclipsing-binaries':
        return {
          title: 'Photometric Light Curve (V-Band Flux)',
          status: 'Clockwork Mutual Eclipses',
          metric1Name: 'Primary Min Dip',
          metric1Val: 'Δm = 1.30 mag (Algol)',
          metric2Name: 'Orbital Period',
          metric2Val: '2.867 Days',
          metric3Name: 'Inclination (i)',
          metric3Val: '87.4° (Edge-on)',
        };
      case 'contact-binaries':
        return {
          title: 'W UMa Continuous Photometric Flux',
          status: 'Roche Lobe Shared Envelope',
          metric1Name: 'Fillout Factor',
          metric1Val: '28% (Overcontact)',
          metric2Name: 'Orbital Period',
          metric2Val: '0.334 Days (~8 hrs)',
          metric3Name: 'Neck Temperature',
          metric3Val: '5,850 K (Darkened)',
        };
      case 'xray-binaries':
        return {
          title: 'High-Energy X-Ray Burst Flux & QPO',
          status: 'Relativistic Disk Accretion',
          metric1Name: 'Accretion Rate',
          metric1Val: '3.2 × 10⁻⁸ M☉/yr',
          metric2Name: 'X-Ray Luminosity',
          metric2Val: '3.8 × 10³⁷ erg/s',
          metric3Name: 'Lorentz Factor (Γ)',
          metric3Val: '3.4 (Relativistic Jet)',
        };
      case 'multiple-star-systems':
        return {
          title: 'Hierarchical Jacobi Stability Harmonics',
          status: 'Nested Multi-Body Gravitation',
          metric1Name: 'Architecture',
          metric1Val: '1 + 1 + 1 (Sextuple)',
          metric2Name: 'Outer Period',
          metric2Val: '445 Years (Castor)',
          metric3Name: 'Stability Margin',
          metric3Val: 'Jacobi Index > 3.8',
        };
      case 'planet-hosting-stars':
        return {
          title: 'Multi-Planet Transit Transmission Dips',
          status: 'Resonant Laplace Chain Active',
          metric1Name: 'Confirmed Planets',
          metric1Val: '7 Earth-Sized Worlds',
          metric2Name: 'Habitable Zone',
          metric2Val: '0.028 - 0.045 AU',
          metric3Name: 'Mean Density',
          metric3Val: '0.88 - 1.02 ρ⊕',
        };
      case 'star-clusters':
        if (clusterMode === 'globular') {
          return {
            title: 'King Model Radial Stellar Density Profile',
            status: 'Dense Core Collapse (Omega Centauri)',
            metric1Name: 'Core Radius (rc)',
            metric1Val: '1.2 pc (Concentrated)',
            metric2Name: 'Cluster Mass',
            metric2Val: '4.0 × 10⁶ M☉',
            metric3Name: 'Velocity Dispersion',
            metric3Val: '21.9 km/s (High)',
          };
        }
        return {
          title: 'Open Cluster Velocity Dispersion Profile',
          status: 'Galactic Disk Swarm (Pleiades M45)',
          metric1Name: 'Core Radius (rc)',
          metric1Val: '0.85 pc (Pleiades)',
          metric2Name: 'Total Stellar Mass',
          metric2Val: '~800 M☉ (~1,000 stars)',
          metric3Name: 'Velocity Dispersion',
          metric3Val: '0.52 km/s (Relaxed)',
        };
      default:
        return {
          title: 'Orbital Dynamics Telemetry',
          status: 'Active Gravitational System',
          metric1Name: 'Multiplicity',
          metric1Val: 'Gravitationally Bound',
          metric2Name: 'Kepler Dynamics',
          metric2Val: 'Stable Co-orbit',
          metric3Name: 'Classification',
          metric3Val: 'System Architecture',
        };
    }
  };

  const telemetry = getSystemTelemetry();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const startTime = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const renderWave = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || 340;
      const h = rect.height || 84;

      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Background grid
      ctx.fillStyle = '#020410';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 1;
      const cols = 8;
      for (let i = 0; i <= cols; i++) {
        const gx = (w / cols) * i;
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      const rows = 4;
      for (let i = 0; i <= rows; i++) {
        const gy = (h / rows) * i;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      const midY = h / 2;

      if (systemId === 'visual-binaries' || systemId === 'binary-stars') {
        // Astrometric position angle and separation curve
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let x = 0; x <= w; x++) {
          const t = (x / w) * 1.5 + elapsed * 0.25;
          const y = midY - Math.sin(t * Math.PI * 2) * (h * 0.35);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.strokeStyle = '#fbbf24';
        ctx.beginPath();
        for (let x = 0; x <= w; x++) {
          const t = (x / w) * 1.5 + elapsed * 0.25;
          const y = midY + Math.cos(t * Math.PI * 2) * (h * 0.28);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (systemId === 'spectroscopic-binaries') {
        // Dual Radial Velocity curves (Doppler S-curves in antiphase)
        const v1Amp = h * 0.35;
        const v2Amp = h * 0.42;

        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let x = 0; x <= w; x++) {
          const t = (x / w) * 2.5 + elapsed * 0.5;
          const y = midY - Math.sin(t * Math.PI * 2) * v1Amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let x = 0; x <= w; x++) {
          const t = (x / w) * 2.5 + elapsed * 0.5;
          const y = midY + Math.sin(t * Math.PI * 2) * v2Amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (systemId === 'eclipsing-binaries') {
        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x <= w; x++) {
          const p = ((x / w) * 2.0 + elapsed * 0.3) % 1.0;
          let flux = 1.0;
          if (p < 0.15) {
            const d = Math.abs(p - 0.075) / 0.075;
            flux = 0.35 + 0.65 * Math.pow(d, 1.8);
          } else if (p > 0.5 && p < 0.65) {
            const d = Math.abs(p - 0.575) / 0.075;
            flux = 0.78 + 0.22 * Math.pow(d, 1.8);
          }
          const y = h * 0.88 - flux * (h * 0.7);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (systemId === 'contact-binaries') {
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x <= w; x++) {
          const t = (x / w) * 3.0 + elapsed * 0.45;
          const flux = 0.75 + 0.25 * Math.sin(t * Math.PI * 2) * Math.sin(t * Math.PI * 2);
          const y = h * 0.9 - flux * (h * 0.7);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (systemId === 'xray-binaries') {
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let x = 0; x <= w; x++) {
          const t = (x / w) * 6.0 + elapsed * 1.5;
          const noise = Math.sin(t * 11) * 0.08 + Math.cos(t * 23) * 0.05;
          const burst = Math.sin(t) > 0.6 ? Math.pow(Math.sin(t), 5) * 0.4 : 0;
          const flux = 0.45 + noise + burst;
          const y = h * 0.85 - flux * (h * 0.7);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (systemId === 'multiple-star-systems') {
        ctx.strokeStyle = '#e879f9';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let x = 0; x <= w; x++) {
          const t = (x / w) * 3.0 + elapsed * 0.4;
          const wave =
            Math.sin(t * Math.PI * 2) * 0.25 +
            Math.sin(t * Math.PI * 6) * 0.12 +
            Math.sin(t * Math.PI * 14) * 0.06;
          const y = midY - wave * h;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (systemId === 'planet-hosting-stars') {
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x <= w; x++) {
          const t1 = ((x / w) * 3.0 + elapsed * 0.3) % 1.0;
          const t2 = ((x / w) * 1.5 + elapsed * 0.15) % 1.0;
          let dip = 0;
          if (t1 < 0.06) dip += 0.25 * (1 - Math.abs(t1 - 0.03) / 0.03);
          if (t2 < 0.08) dip += 0.45 * (1 - Math.abs(t2 - 0.04) / 0.04);
          const flux = 1.0 - dip;
          const y = h * 0.88 - flux * (h * 0.65);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else {
        // Star clusters
        const strokeCol = clusterMode === 'globular' ? '#f59e0b' : '#38bdf8';
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x <= w; x++) {
          const rNorm = (x / w) * 3.5;
          const power = clusterMode === 'globular' ? 2.2 : 1.25;
          const density = 1.0 / Math.pow(1.0 + rNorm * rNorm, power);
          const y = h * 0.88 - density * (h * 0.75);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Sweeping time tracer
      const sweepX = ((elapsed * 0.25) % 1.0) * w;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(sweepX, 0);
      ctx.lineTo(sweepX, h);
      ctx.stroke();
      ctx.setLineDash([]);

      animationFrameId = requestAnimationFrame(renderWave);
    };

    animationFrameId = requestAnimationFrame(renderWave);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [systemId, clusterMode]);

  return (
    <div
      className={`w-full p-2.5 sm:p-3 rounded-2xl bg-[#020512] border border-cyan-500/25 shadow-lg flex flex-col gap-2 min-w-0 ${className}`}
    >
      {/* Telemetry Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
            <Orbit className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <RunningText
              text={telemetry.title}
              className="text-[10px] sm:text-xs font-mono font-bold text-white uppercase tracking-wider"
            />
            <RunningText
              text={telemetry.status}
              className="text-[9px] sm:text-[10px] font-sans text-cyan-300/80"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-[9px] font-mono text-cyan-300 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>REAL-TIME DYNAMICS</span>
        </div>
      </div>

      {/* Live Waveform Canvas */}
      <div className="w-full h-18 sm:h-20 rounded-xl overflow-hidden border border-cyan-500/20 bg-[#01030b] relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Triad Metric Readouts */}
      <div className="grid grid-cols-3 gap-1.5 text-[9px] sm:text-[10px] font-mono">
        <div className="p-1.5 rounded-lg bg-[#04081c] border border-cyan-500/15 min-w-0 overflow-hidden">
          <span className="text-slate-400 block text-[8px] uppercase truncate">{telemetry.metric1Name}</span>
          <RunningText text={telemetry.metric1Val} className="text-white font-bold block" />
        </div>
        <div className="p-1.5 rounded-lg bg-[#04081c] border border-cyan-500/15 min-w-0 overflow-hidden">
          <span className="text-slate-400 block text-[8px] uppercase truncate">{telemetry.metric2Name}</span>
          <RunningText text={telemetry.metric2Val} className="text-cyan-300 font-bold block" />
        </div>
        <div className="p-1.5 rounded-lg bg-[#04081c] border border-cyan-500/15 min-w-0 overflow-hidden">
          <span className="text-slate-400 block text-[8px] uppercase truncate">{telemetry.metric3Name}</span>
          <RunningText text={telemetry.metric3Val} className="text-amber-300 font-bold block" />
        </div>
      </div>
    </div>
  );
};
