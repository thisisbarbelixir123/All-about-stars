import React, { useEffect, useRef } from 'react';
import { StarData } from '../types';

interface VariableStarGraphicProps {
  variableId: string;
  archetypeStar?: StarData | null;
  colorHex?: string;
  className?: string;
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
  if (isNaN(num)) return { r: 255, g: 255, b: 255 };
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

export const VariableStarGraphic: React.FC<VariableStarGraphicProps> = ({
  variableId,
  archetypeStar,
  colorHex = '#facc15',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const primaryHex = archetypeStar?.colorHex || colorHex;
  const coronaHex = archetypeStar?.coronaColorHex || archetypeStar?.colorHex || colorHex;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const startTime = performance.now();

    const baseRgb = hexToRgb(primaryHex);
    const coronaRgb = hexToRgb(coronaHex);

    // Deep field starry background
    const bgStars: { x: number; y: number; r: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 55; i++) {
      bgStars.push({
        x: Math.random() * 380,
        y: Math.random() * 380,
        r: Math.random() * 1.1 + 0.3,
        alpha: Math.random() * 0.6 + 0.3,
        speed: Math.random() * 1.4 + 0.4,
      });
    }

    // High-resolution setup
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = 380 * dpr;
    canvas.height = 380 * dpr;

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      const width = 380;
      const height = 380;
      const cx = width / 2;
      const cy = 158; // Center star slightly above light curve HUD

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
      // 1. CEPHEID VARIABLES (Classical & Type II Cepheids / Standard Candles)
      // Rapid steep brightness rise followed by gentler asymmetric decline
      // Color shifts: hotter pale-yellow at maximum, cooler golden-amber at minimum
      // =========================================================================
      if (variableId === 'cepheid-variables') {
        const period = 2.4; // seconds for visualization
        const phase = (elapsed / period) % 1.0;
        // Asymmetric pulsation: 0 to 0.22 is steep rise; 0.22 to 1.0 is gentle descent
        const pulse = phase < 0.22 
          ? Math.sin((phase / 0.22) * Math.PI * 0.5) 
          : Math.cos(((phase - 0.22) / 0.78) * Math.PI * 0.5);

        const radius = cx * 0.32 + pulse * 15;
        // Hotter white-yellow at peak pulse, cooler golden-amber at trough
        const hotRgb = { r: 255, g: 250, b: 215 };
        const coolRgb = { r: 245, g: 158, b: 11 };
        const curRgb = lerpRgb(coolRgb, hotRgb, pulse);

        // Coronal expansion shockwave
        const shockRadius = radius * (1.2 + pulse * 0.6);
        const coronaGrad = ctx.createRadialGradient(cx, cy, radius * 0.75, cx, cy, shockRadius);
        coronaGrad.addColorStop(0, rgbStr(curRgb, 0.45 + pulse * 0.4));
        coronaGrad.addColorStop(0.5, rgbStr(curRgb, 0.15 + pulse * 0.15));
        coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coronaGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, shockRadius, 0, Math.PI * 2);
        ctx.fill();

        // Photosphere with limb darkening
        const photoGrad = ctx.createRadialGradient(cx - radius * 0.15, cy - radius * 0.15, 0, cx, cy, radius);
        photoGrad.addColorStop(0, '#ffffff');
        photoGrad.addColorStop(0.55, rgbStr(curRgb, 1.0));
        photoGrad.addColorStop(1, rgbStr(lerpRgb(curRgb, { r: 180, g: 83, b: 9 }, 0.65), 1.0));
        ctx.fillStyle = photoGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        const statusText = phase < 0.22 ? '⚡ Steep Asymmetric Rise' : '📉 Gradual Cooling Expansion';
        renderVariableHUD(
          ctx, width, height, phase, pulse,
          'Cepheid Asymmetric Pulsation (Leavitt Law)',
          statusText,
          (p) => (p < 0.22 ? Math.sin((p / 0.22) * Math.PI * 0.5) : Math.cos(((p - 0.22) / 0.78) * Math.PI * 0.5))
        );
      }

      // =========================================================================
      // 2. RR LYRAE VARIABLES (Horizontal Branch / Blazhko Effect)
      // Rapid clockwork pulsation modulated by the slower Blazhko envelope
      // Hot blue-white/violet-tinted stars
      // =========================================================================
      else if (variableId === 'rr-lyrae-variables') {
        const period = 1.1; // Fast pulsation
        const phase = (elapsed / period) % 1.0;
        // Slower Blazhko envelope modulation (beats over ~6.5 seconds)
        const blazhko = 0.7 + 0.3 * Math.sin(elapsed * 0.95);
        // Fast pulsation spike
        const rawPulse = phase < 0.3 
          ? Math.sin((phase / 0.3) * Math.PI * 0.5) 
          : Math.cos(((phase - 0.3) / 0.7) * Math.PI * 0.5);
        const pulse = rawPulse * blazhko;

        const radius = cx * 0.30 + pulse * 12;
        const rrColor = { r: 196, g: 181, b: 253 }; // Blue-violet horizontal branch hue

        // Corona
        const coronaGrad = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.6);
        coronaGrad.addColorStop(0, rgbStr(rrColor, 0.4 + pulse * 0.35));
        coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coronaGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 1.6, 0, Math.PI * 2);
        ctx.fill();

        // Photosphere
        const photoGrad = ctx.createRadialGradient(cx - radius * 0.12, cy - radius * 0.12, 0, cx, cy, radius);
        photoGrad.addColorStop(0, '#ffffff');
        photoGrad.addColorStop(0.6, rgbStr(rrColor, 1.0));
        photoGrad.addColorStop(1, 'rgba(99, 102, 241, 1.0)');
        ctx.fillStyle = photoGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        const statusText = `Blazhko Amplitude: ${(blazhko * 100).toFixed(0)}%`;
        renderVariableHUD(
          ctx, width, height, phase, pulse,
          'RR Lyrae Rapid Pulse + Blazhko Effect',
          statusText,
          (p) => (p < 0.3 ? Math.sin((p / 0.3) * Math.PI * 0.5) : Math.cos(((p - 0.3) / 0.7) * Math.PI * 0.5)) * blazhko
        );
      }

      // =========================================================================
      // 3. MIRA VARIABLES (Long-Period AGB Red Giants)
      // Extreme 5-8 magnitude visual swing, massive envelope breathing,
      // and condensing dust shroud at minimum temperature
      // =========================================================================
      else if (variableId === 'mira-variables') {
        const period = 3.6;
        const phase = (elapsed / period) % 1.0;
        // Smooth sine breathing
        const pulse = (Math.sin(phase * Math.PI * 2 - Math.PI / 2) + 1) / 2; // 0 to 1
        const radius = cx * 0.28 + (1 - pulse) * 22; // Swells larger when cooling/minimum
        
        // At max: hotter orange-red (~3,000 K). At min: deep crimson soot (~2,000 K)
        const hotRgb = { r: 251, g: 146, b: 60 };
        const coolRgb = { r: 153, g: 27, b: 27 };
        const curRgb = lerpRgb(coolRgb, hotRgb, pulse);

        // Billowing circumstellar dust cloud (denser at minimum when dust grains condense)
        const dustAlpha = 0.2 + (1.0 - pulse) * 0.45;
        const dustRadius = radius * 1.55;
        const dustGrad = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, dustRadius);
        dustGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        dustGrad.addColorStop(0.5, rgbStr({ r: 120, g: 53, b: 15 }, dustAlpha));
        dustGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = dustGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, dustRadius, 0, Math.PI * 2);
        ctx.fill();

        // Expanding dust ring particles
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(elapsed * 0.12);
        ctx.fillStyle = `rgba(217, 119, 6, ${0.3 + (1 - pulse) * 0.4})`;
        for (let i = 0; i < 18; i++) {
          const ang = (i / 18) * Math.PI * 2;
          const dist = radius * (1.15 + (i % 3) * 0.12);
          ctx.beginPath();
          ctx.arc(Math.cos(ang) * dist, Math.sin(ang) * dist, 1.5 + (i % 2), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Swollen pulsating photosphere with prominent convective limb darkening
        const photoGrad = ctx.createRadialGradient(cx - radius * 0.1, cy - radius * 0.1, 0, cx, cy, radius);
        photoGrad.addColorStop(0, pulse > 0.5 ? '#fed7aa' : '#f87171');
        photoGrad.addColorStop(0.6, rgbStr(curRgb, 1.0));
        photoGrad.addColorStop(1, rgbStr({ r: 69, g: 10, b: 10 }, 0.95));
        ctx.fillStyle = photoGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        const statusText = pulse > 0.7 
          ? '🔥 Max Brightness (TiO Dissociated)' 
          : pulse < 0.3 
          ? '❄️ Min Brightness (Dust Condensation)' 
          : '🔄 Dynamic Envelope Breathing';

        renderVariableHUD(
          ctx, width, height, phase, pulse,
          'Mira Long-Period Giant Breathing (Δm ≈ 6)',
          statusText,
          (p) => (Math.sin(p * Math.PI * 2 - Math.PI / 2) + 1) / 2
        );
      }

      // =========================================================================
      // 4. SEMIREGULAR & IRREGULAR VARIABLES (Betelgeuse / Antares)
      // Multiple competing harmonics, giant convective cells overturning,
      // and episodic great dimming dust puffs
      // =========================================================================
      // =========================================================================
      // 4. SEMIREGULAR & IRREGULAR VARIABLES (Betelgeuse / Antares / Red Supergiants)
      // Beating multi-mode radial/non-radial harmonics, undulating low-gravity limb,
      // giant convective supergranules overturning, and episodic Great Dimming dust ejections
      // =========================================================================
      else if (variableId === 'semiregular-variables') {
        // Multi-frequency beating: fundamental mode + first overtone + long secondary period
        const f1 = elapsed * 0.95;
        const f2 = elapsed * 1.58 + 1.3;
        const f3 = elapsed * 0.38 + 2.1;
        const combined = (Math.sin(f1) + 0.42 * Math.sin(f2) + 0.28 * Math.sin(f3)) / 1.7; // -1 to 1
        const pulse = (combined + 1) / 2; // 0 to 1

        const baseR = cx * 0.36 + pulse * 14;

        // Circumstellar silicate/carbon dust shroud & stellar wind filaments
        ctx.save();
        for (let w = 0; w < 3; w++) {
          const wAng = elapsed * (0.08 - w * 0.03) + w * 2.1;
          const wR = baseR * (1.35 + w * 0.22);
          const windGrad = ctx.createRadialGradient(cx, cy, baseR * 0.9, cx, cy, wR);
          windGrad.addColorStop(0, 'rgba(185, 28, 28, 0.25)');
          windGrad.addColorStop(0.5, 'rgba(120, 53, 15, 0.12)');
          windGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = windGrad;
          ctx.beginPath();
          ctx.ellipse(cx, cy, wR, wR * (0.88 + 0.08 * Math.sin(wAng)), wAng, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Undulating Photosphere Boundary (low surface gravity supergiant limb perturbation)
        ctx.save();
        ctx.beginPath();
        const numPts = 40;
        for (let i = 0; i <= numPts; i++) {
          const theta = (i / numPts) * Math.PI * 2;
          const rWobble = baseR * (
            1.0 +
            0.038 * Math.sin(3 * theta + elapsed * 0.7) +
            0.024 * Math.cos(5 * theta - elapsed * 0.5) +
            0.015 * Math.sin(7 * theta + elapsed * 1.1)
          );
          const px = cx + Math.cos(theta) * rWobble;
          const py = cy + Math.sin(theta) * rWobble;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.clip(); // Clip everything to the undulating supergiant disc

        // Base Photospheric Temperature & Limb-Darkening Gradient
        const photoGrad = ctx.createRadialGradient(cx - baseR * 0.18, cy - baseR * 0.18, 0, cx, cy, baseR * 1.05);
        photoGrad.addColorStop(0, '#fef2f2');
        photoGrad.addColorStop(0.2, '#fca5a5');
        photoGrad.addColorStop(0.55, '#dc2626');
        photoGrad.addColorStop(0.85, '#991b1b');
        photoGrad.addColorStop(1, '#450a0a');
        ctx.fillStyle = photoGrad;
        ctx.fill();

        // 8 Giant Convective Supergranulation Cells (planetary-orbit sized overturning plumes)
        const cellConfigs = [
          { dist: 0.28, angSpeed: 0.15, phase: 0.0, rBase: 26, heat: 1.0 },
          { dist: 0.52, angSpeed: -0.12, phase: 1.4, rBase: 30, heat: 0.85 },
          { dist: 0.44, angSpeed: 0.18, phase: 2.8, rBase: 24, heat: 0.9 },
          { dist: 0.62, angSpeed: -0.1, phase: 3.9, rBase: 28, heat: 0.75 },
          { dist: 0.35, angSpeed: 0.22, phase: 4.8, rBase: 22, heat: 0.95 },
          { dist: 0.68, angSpeed: 0.14, phase: 5.7, rBase: 25, heat: 0.7 },
          { dist: 0.18, angSpeed: -0.2, phase: 0.8, rBase: 20, heat: 1.05 },
          { dist: 0.58, angSpeed: 0.11, phase: 2.1, rBase: 27, heat: 0.8 },
        ];

        cellConfigs.forEach((c, idx) => {
          const ang = c.phase + elapsed * c.angSpeed;
          const cDist = baseR * c.dist;
          const cellX = cx + Math.cos(ang) * cDist;
          const cellY = cy + Math.sin(ang) * cDist * 0.88;
          // Convective turnover pulsation
          const boilPulse = Math.sin(elapsed * 1.4 + idx * 1.7) * 0.3 + 0.7;
          const cellR = c.rBase * boilPulse;

          const cellGrad = ctx.createRadialGradient(cellX, cellY, 0, cellX, cellY, cellR);
          cellGrad.addColorStop(0, `rgba(254, 240, 138, ${0.45 * boilPulse * c.heat})`); // Hot upwelling center
          cellGrad.addColorStop(0.4, `rgba(251, 146, 60, ${0.35 * boilPulse * c.heat})`);
          cellGrad.addColorStop(0.75, `rgba(185, 28, 28, ${0.2 * boilPulse})`);
          cellGrad.addColorStop(1, 'rgba(69, 10, 10, 0)'); // Cooler intergranular lane
          ctx.fillStyle = cellGrad;
          ctx.beginPath();
          ctx.arc(cellX, cellY, cellR, 0, Math.PI * 2);
          ctx.fill();
        });

        // Episodic "Great Dimming" Dust Condensation Cloud (Betelgeuse 2019-2020 archetype event)
        // Silicate/carbonaceous dust puff cooling and transiting the lower hemisphere
        const dimCycle = (elapsed * 0.14) % 1.0;
        const dustX = cx - baseR * 0.5 + Math.sin(dimCycle * Math.PI * 2) * baseR * 0.45;
        const dustY = cy + baseR * 0.35 + Math.cos(dimCycle * Math.PI * 2) * 8;
        const dustR = baseR * 0.58;
        const dimGrad = ctx.createRadialGradient(dustX, dustY, 4, dustX, dustY, dustR);
        dimGrad.addColorStop(0, 'rgba(10, 2, 4, 0.85)'); // Dense carbon soot core
        dimGrad.addColorStop(0.55, 'rgba(50, 10, 15, 0.5)');
        dimGrad.addColorStop(0.85, 'rgba(120, 25, 30, 0.2)');
        dimGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = dimGrad;
        ctx.beginPath();
        ctx.arc(dustX, dustY, dustR, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Status description & light curve HUD
        const beatState = combined > 0.3 ? 'Harmonic Peak (+1.4m)' : combined < -0.3 ? 'Harmonic Minimum (-1.2m)' : 'Convective Quiescence';
        const statusText = `Beating Harmonics (f₁=3.6s, f₂=2.2s) • ${beatState}`;
        renderVariableHUD(
          ctx, width, height, (elapsed * 0.22) % 1.0, pulse,
          'Semiregular Multi-Harmonic & Convective Overturning',
          statusText,
          (p) => {
            const th = p * Math.PI * 2;
            return ((Math.sin(th) + 0.42 * Math.sin(th * 1.66 + 1.3) + 0.28 * Math.sin(th * 0.4 + 2.1)) / 1.7 + 1) / 2;
          }
        );
      }

      // =========================================================================
      // 5. CATACLYSMIC VARIABLES (Novae / Dwarf Novae / Accreting Compact Binaries)
      // Roche-lobe overflow donor star, inner Lagrange L1 mass-transfer stream,
      // multi-temperature Keplerian accretion disk with hot impact spot,
      // and periodic explosive thermonuclear runaway nova detonation!
      // =========================================================================
      else if (variableId === 'cataclysmic-variables') {
        const cyclePeriod = 5.8; // seconds per cycle
        const phase = (elapsed / cyclePeriod) % 1.0;
        const isDetonation = phase > 0.72;
        const novaPhase = isDetonation ? (phase - 0.72) / 0.28 : 0;
        const novaFlash = isDetonation
          ? (novaPhase < 0.12 ? novaPhase / 0.12 : Math.exp(-(novaPhase - 0.12) * 5.2))
          : 0;

        // Binary System Geometry (Enlarged Scale, Donor star sticking directly to disk)
        const wdX = cx - 50;
        const donorX = cx + 70;
        const sepY = cy;
        const diskRx = 56;
        const diskRy = 22;
        const diskAngle = -0.14;

        // L1 apex touches and sticks directly to the outer boundary of the accretion disk
        const l1X = wdX + diskRx - 2; // seamlessly attached to the disk edge

        // --- 1. SECONDARY MASS DONOR STAR (Roche-Lobe filling K/M red subgiant) ---
        // Asymmetric Roche-lobe teardrop geometry tapering directly into the accretion disk
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(l1X, sepY);
        // Top lobe curve
        ctx.bezierCurveTo(donorX - 28, sepY - 34, donorX + 32, sepY - 32, donorX + 36, sepY);
        // Bottom lobe curve
        ctx.bezierCurveTo(donorX + 32, sepY + 32, donorX - 28, sepY + 34, l1X, sepY);
        ctx.closePath();

        // Gravity-darkened radial gradient (poles & L1 apex cooler, flanks illuminated)
        const donorGrad = ctx.createRadialGradient(donorX, sepY, 3, donorX, sepY, 38);
        donorGrad.addColorStop(0, '#fed7aa');
        donorGrad.addColorStop(0.35, '#f97316');
        donorGrad.addColorStop(0.7, '#ea580c');
        donorGrad.addColorStop(1, '#7c2d12');
        ctx.fillStyle = donorGrad;
        ctx.fill();

        // Smooth convective atmospheric limb glow (NO dark/black spots)
        const donorLimbGrad = ctx.createRadialGradient(donorX, sepY, 12, donorX, sepY, 38);
        donorLimbGrad.addColorStop(0, 'rgba(254, 215, 170, 0)');
        donorLimbGrad.addColorStop(0.75, 'rgba(249, 115, 22, 0.2)');
        donorLimbGrad.addColorStop(1, 'rgba(124, 45, 18, 0.4)');
        ctx.fillStyle = donorLimbGrad;
        ctx.fill();
        ctx.restore();

        // --- 2. L1 INNER LAGRANGE ACCRETION STREAM ---
        // High-velocity curved gas stream flowing directly from the donor apex along Coriolis trajectory
        const spotX = wdX + 32;
        const spotY = sepY - 14;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(l1X, sepY);
        ctx.quadraticCurveTo((l1X + spotX) / 2 + 4, sepY - 20, spotX, spotY);
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.85)';
        ctx.lineWidth = 4.5;
        ctx.stroke();

        // Luminous core of the gas stream
        ctx.beginPath();
        ctx.moveTo(l1X, sepY);
        ctx.quadraticCurveTo((l1X + spotX) / 2 + 4, sepY - 20, spotX, spotY);
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.9)';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Animated streaming plasma clumps along the stream trajectory
        for (let p = 0; p < 6; p++) {
          const tClump = ((elapsed * 1.7 + p * (1 / 6)) % 1.0);
          const clumpX = (1 - tClump) * (1 - tClump) * l1X + 2 * (1 - tClump) * tClump * ((l1X + spotX) / 2 + 4) + tClump * tClump * spotX;
          const clumpY = (1 - tClump) * (1 - tClump) * sepY + 2 * (1 - tClump) * tClump * (sepY - 20) + tClump * tClump * spotY;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(clumpX, clumpY, 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // --- 3. MULTI-ZONE SILKY KEPLERIAN ACCRETION DISK (Enlarged & Smoothed) ---
        ctx.save();
        ctx.translate(wdX, sepY);
        ctx.rotate(diskAngle);

        // A. Soft, diffuse outer gaseous haze for seamless edge blending
        const hazeGrad = ctx.createRadialGradient(0, 0, diskRx * 0.35, 0, 0, diskRx * 1.18);
        hazeGrad.addColorStop(0, 'rgba(192, 132, 252, 0.22)');
        hazeGrad.addColorStop(0.55, 'rgba(126, 34, 206, 0.1)');
        hazeGrad.addColorStop(1, 'rgba(88, 28, 135, 0)');
        ctx.fillStyle = hazeGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, diskRx * 1.18, diskRy * 1.18, 0, 0, Math.PI * 2);
        ctx.fill();

        // B. Main disk: continuous multi-stop radial gradient with silky smooth alpha falloff
        const diskGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, diskRx);
        diskGrad.addColorStop(0, '#ffffff'); // Boundary layer core (>50,000 K)
        diskGrad.addColorStop(0.12, 'rgba(255, 255, 255, 0.95)');
        diskGrad.addColorStop(0.24, '#38bdf8'); // Inner ionized UV disk
        diskGrad.addColorStop(0.48, '#6366f1'); // Helium transition layer
        diskGrad.addColorStop(0.72, '#a855f7'); // Intermediate optical plasma
        diskGrad.addColorStop(0.88, '#c026d3'); // Viscous outer disk
        diskGrad.addColorStop(0.96, 'rgba(190, 24, 93, 0.45)');
        diskGrad.addColorStop(1.0, 'rgba(124, 45, 18, 0)'); // Feathered edge, zero hard borders
        ctx.fillStyle = diskGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, diskRx, diskRy, 0, 0, Math.PI * 2);
        ctx.fill();

        // C. Smooth concentric Keplerian laminar rings
        [0.42, 0.68].forEach((rFrac, rIdx) => {
          ctx.strokeStyle = `rgba(224, 231, 255, ${0.12 + 0.04 * Math.sin(elapsed * 2.2 + rIdx)})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.ellipse(0, 0, diskRx * rFrac, diskRy * rFrac, 0, 0, Math.PI * 2);
          ctx.stroke();
        });

        // D. Smooth, anti-aliased Keplerian spiral arms (high-density curve sampling)
        for (let s = 0; s < 2; s++) {
          const sRot = elapsed * 3.4 + s * Math.PI;
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.22 + 0.08 * Math.sin(sRot)})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          const curveSteps = 36;
          for (let i = 0; i <= curveSteps; i++) {
            const tFrac = i / curveSteps;
            const st = 4 + tFrac * (diskRx - 8);
            const stAng = sRot + tFrac * 2.6;
            const sx = Math.cos(stAng) * st;
            const sy = Math.sin(stAng) * (st * (diskRy / diskRx));
            if (i === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.stroke();
        }
        ctx.restore();

        // --- 4. TURBULENT IMPACT HOT SPOT (Seamless soft bloom on disk rim) ---
        const spotFlicker = Math.sin(elapsed * 16) * 0.22 + 0.78;
        const hotR = 14 * spotFlicker;
        const hotGrad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, hotR);
        hotGrad.addColorStop(0, '#ffffff');
        hotGrad.addColorStop(0.28, '#fde047');
        hotGrad.addColorStop(0.65, '#ea580c');
        hotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = hotGrad;
        ctx.beginPath();
        ctx.arc(spotX, spotY, hotR, 0, Math.PI * 2);
        ctx.fill();

        // --- 5. CENTRAL DEGENERATE WHITE DWARF ---
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#60a5fa';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(wdX, sepY, 7.5, 0, Math.PI * 2);
        ctx.fill();

        // Diamond diffraction spikes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(wdX - 20, sepY);
        ctx.lineTo(wdX + 20, sepY);
        ctx.moveTo(wdX, sepY - 20);
        ctx.lineTo(wdX + 20, sepY);
        ctx.stroke();
        ctx.restore();

        // --- 6. EXPLOSIVE THERMONUCLEAR RUNAWAY (NOVA DETONATION SHELL) ---
        if (novaFlash > 0.03) {
          const blastR = 22 + novaFlash * 105;
          ctx.save();

          // Outer ionization blast wave
          const blastGrad = ctx.createRadialGradient(wdX, sepY, 0, wdX, sepY, blastR);
          blastGrad.addColorStop(0, `rgba(255, 255, 255, ${novaFlash})`);
          blastGrad.addColorStop(0.25, `rgba(56, 189, 248, ${novaFlash * 0.9})`);
          blastGrad.addColorStop(0.65, `rgba(217, 70, 239, ${novaFlash * 0.6})`);
          blastGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = blastGrad;
          ctx.beginPath();
          ctx.arc(wdX, sepY, blastR, 0, Math.PI * 2);
          ctx.fill();

          // Expanding filamentary shock front ring
          ctx.strokeStyle = `rgba(255, 255, 255, ${novaFlash * 0.85})`;
          ctx.lineWidth = 2.5 * novaFlash;
          ctx.beginPath();
          ctx.arc(wdX, sepY, blastR * 0.92, 0, Math.PI * 2);
          ctx.stroke();

          // Relativistic nova ejecta knots
          for (let k = 0; k < 12; k++) {
            const kAng = (k / 12) * Math.PI * 2 + elapsed * 0.5;
            const kDist = blastR * (0.8 + 0.2 * Math.sin(k * 3));
            ctx.fillStyle = `rgba(254, 240, 138, ${novaFlash * 0.9})`;
            ctx.beginPath();
            ctx.arc(wdX + Math.cos(kAng) * kDist, sepY + Math.sin(kAng) * kDist, 2.4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        const statusText = isDetonation
          ? '💥 THERMONUCLEAR NOVA DETONATION! (+6.5 Mag Outburst)'
          : '🔄 Quiescent Phase • L1 Mass Transfer & Hot Spot Shock';
        renderVariableHUD(
          ctx, width, height, phase, novaFlash > 0 ? Math.min(1, novaFlash * 1.1) : 0.12,
          'Cataclysmic Nova Detonation & Accretion Inflow',
          statusText,
          (p) => (p > 0.72 ? Math.exp(-((p - 0.72) / 0.28) * 4.6) : 0.08 + 0.03 * Math.sin(p * 45))
        );
      }

      // =========================================================================
      // 6. ERUPTIVE & FLARE VARIABLES (UV Ceti Flare Stars / Active Red Dwarfs)
      // Chromospheric convective dynamo, tangled 3D magnetic arcade loops,
      // explosive magnetic reconnection superflare, and coronal mass ejection (CME)
      // =========================================================================
      else if (variableId === 'eruptive-variables') {
        const flareCycle = 3.6; // seconds per flare cycle
        const phase = (elapsed / flareCycle) % 1.0;
        const isFlaring = phase > 0.58;
        const flareProgress = isFlaring ? (phase - 0.58) / 0.42 : 0;
        // Fast Rise Exponential Decay (FRED) profile
        const flarePower = isFlaring
          ? (flareProgress < 0.08 ? flareProgress / 0.08 : Math.exp(-(flareProgress - 0.08) * 4.2))
          : 0;

        const radius = cx * 0.34;
        const flareCenterDist = radius * 0.55;
        const flareAngle = -0.55; // Upper-left active quadrant
        const flareX = cx + Math.cos(flareAngle) * flareCenterDist;
        const flareY = cy + Math.sin(flareAngle) * flareCenterDist;

        // Base Photosphere with realistic M-dwarf limb darkening
        const photoGrad = ctx.createRadialGradient(cx - radius * 0.18, cy - radius * 0.18, 0, cx, cy, radius);
        photoGrad.addColorStop(0, '#fecaca');
        photoGrad.addColorStop(0.35, '#ef4444');
        photoGrad.addColorStop(0.7, '#b91c1c');
        photoGrad.addColorStop(1, '#450a0a');
        ctx.fillStyle = photoGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Chromospheric Active Region & Magnetic Footpoints (Luminous plages, NO harsh black dots)
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.clip();

        // Magnetic footpoint 1 (warm golden plage in quiescence, dazzling white-cyan flare kernel in eruption)
        const fp1Grad = ctx.createRadialGradient(flareX - 12, flareY + 8, 1, flareX - 12, flareY + 8, 12);
        fp1Grad.addColorStop(0, flarePower > 0.05 ? '#ffffff' : 'rgba(254, 240, 138, 0.95)');
        fp1Grad.addColorStop(0.35, flarePower > 0.05 ? 'rgba(56, 189, 248, 0.85)' : 'rgba(251, 146, 60, 0.7)');
        fp1Grad.addColorStop(0.75, 'rgba(239, 68, 68, 0.3)');
        fp1Grad.addColorStop(1, 'rgba(69, 10, 10, 0)');
        ctx.fillStyle = fp1Grad;
        ctx.beginPath();
        ctx.ellipse(flareX - 12, flareY + 8, 11, 8, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Magnetic footpoint 2
        const fp2Grad = ctx.createRadialGradient(flareX + 14, flareY - 4, 1, flareX + 14, flareY - 4, 13);
        fp2Grad.addColorStop(0, flarePower > 0.05 ? '#ffffff' : 'rgba(254, 240, 138, 0.95)');
        fp2Grad.addColorStop(0.35, flarePower > 0.05 ? 'rgba(56, 189, 248, 0.85)' : 'rgba(251, 146, 60, 0.7)');
        fp2Grad.addColorStop(0.75, 'rgba(239, 68, 68, 0.3)');
        fp2Grad.addColorStop(1, 'rgba(69, 10, 10, 0)');
        ctx.fillStyle = fp2Grad;
        ctx.beginPath();
        ctx.ellipse(flareX + 14, flareY - 4, 12, 9, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Concentric Moreton Shockwave rippling across photosphere during flare
        if (flarePower > 0.1) {
          const shockR = flarePower * radius * 1.5;
          ctx.strokeStyle = `rgba(255, 255, 255, ${flarePower * 0.7})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(flareX, flareY, shockR, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        // Chromospheric 3D Magnetic Arcade Loops (arching above surface)
        ctx.save();
        for (let l = 0; l < 4; l++) {
          const lSpan = 22 + l * 7;
          const lHeight = 18 + l * 8;
          const tension = Math.sin(elapsed * 2.5 + l * 1.2) * 2;
          ctx.strokeStyle = `rgba(254, 226, 226, ${0.45 + flarePower * 0.45})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(flareX - lSpan / 2, flareY + 6);
          ctx.quadraticCurveTo(flareX + tension, flareY - lHeight, flareX + lSpan / 2, flareY - 4);
          ctx.stroke();

          // Shimmering plasma beads trapped in magnetic flux tubes
          const beadPhase = ((elapsed * 1.5 + l * 0.25) % 1.0);
          const bx = flareX - lSpan / 2 + beadPhase * lSpan;
          const by = flareY + 6 - Math.sin(beadPhase * Math.PI) * (lHeight + 8);
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(bx, by, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Explosive Magnetic Reconnection Superflare
        if (flarePower > 0.04) {
          ctx.save();
          const flareR = 16 + flarePower * 62;
          const flareGrad = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, flareR);
          flareGrad.addColorStop(0, '#ffffff'); // Searing white-light reconnection spark
          flareGrad.addColorStop(0.25, `rgba(56, 189, 248, ${flarePower})`); // High-energy coronal UV glow
          flareGrad.addColorStop(0.65, `rgba(244, 63, 94, ${flarePower * 0.75})`);
          flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = flareGrad;
          ctx.beginPath();
          ctx.arc(flareX, flareY, flareR, 0, Math.PI * 2);
          ctx.fill();

          // 4-Point Optical Diffraction Starburst
          ctx.strokeStyle = `rgba(255, 255, 255, ${flarePower * 0.95})`;
          ctx.lineWidth = 1.8 * flarePower;
          const spikeLen = flareR * 1.6;
          ctx.beginPath();
          ctx.moveTo(flareX - spikeLen, flareY);
          ctx.lineTo(flareX + spikeLen, flareY);
          ctx.moveTo(flareX, flareY - spikeLen);
          ctx.lineTo(flareX, flareY + spikeLen);
          ctx.stroke();

          // Coronal Mass Ejection (CME) & Helical Plasma Jet Ejection
          const cmeDist = radius * (0.6 + flarePower * 1.3);
          const cmeX = flareX - cmeDist * 0.65;
          const cmeY = flareY - cmeDist * 0.75;
          ctx.strokeStyle = `rgba(255, 255, 255, ${flarePower * 0.9})`;
          ctx.lineWidth = 3.5 * flarePower;
          ctx.beginPath();
          ctx.moveTo(flareX, flareY);
          ctx.quadraticCurveTo(flareX - cmeDist * 0.35, flareY - cmeDist * 0.2, cmeX, cmeY);
          ctx.stroke();

          // CME Plasma Bubble / Ejected Mass
          const cmeBubbleGrad = ctx.createRadialGradient(cmeX, cmeY, 0, cmeX, cmeY, 16 * flarePower);
          cmeBubbleGrad.addColorStop(0, '#ffffff');
          cmeBubbleGrad.addColorStop(0.5, `rgba(56, 189, 248, ${flarePower * 0.85})`);
          cmeBubbleGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = cmeBubbleGrad;
          ctx.beginPath();
          ctx.arc(cmeX, cmeY, 16 * flarePower, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        const statusText = isFlaring
          ? '⚡ MAGNETIC RECONNECTION SUPERFLARE (FRED Spike + CME Ejection)'
          : '🧲 Active Coronal Magnetic Loops & Flux Tube Shearing';
        renderVariableHUD(
          ctx, width, height, phase, flarePower > 0 ? flarePower : 0.08,
          'Eruptive Chromospheric Flare Activity',
          statusText,
          (p) => (p > 0.58 ? Math.exp(-((p - 0.58) / 0.42) * 3.6) : 0.07 + 0.02 * Math.sin(p * 30))
        );
      }

      // =========================================================================
      // 7. ROTATIONAL VARIABLES (Alpha² Canum Venaticorum / Cor Caroli Archetype)
      // True 3D rotating white A-type star matching Cor Caroli example,
      // with Eddington limb darkening, chemically peculiar silicon/chromium patches,
      // magnetic facular plages, and tilted rotational axis
      // =========================================================================
      else if (variableId === 'rotational-variables') {
        const rotSpeed = 1.05;
        const rotAngle = elapsed * rotSpeed;
        const radius = cx * 0.37;
        const axisTilt = 0.26; // ~15 degree axial tilt

        // Luminous stellar halo / corona for white A0Vp star (Cor Caroli)
        const haloGrad = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.55);
        haloGrad.addColorStop(0, 'rgba(192, 209, 255, 0.42)');
        haloGrad.addColorStop(0.45, 'rgba(147, 197, 253, 0.16)');
        haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 1.55, 0, Math.PI * 2);
        ctx.fill();

        // Tilted Coordinate Grid & Spin Axis (before drawing star)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(axisTilt);

        // Spin axis pole indicators
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(0, -radius - 18);
        ctx.lineTo(0, radius + 18);
        ctx.stroke();
        ctx.setLineDash([]);

        // Rotation vector arrow indicator
        ctx.fillStyle = '#22d3ee';
        ctx.beginPath();
        ctx.moveTo(0, -radius - 18);
        ctx.lineTo(-4, -radius - 10);
        ctx.lineTo(4, -radius - 10);
        ctx.closePath();
        ctx.fill();

        // 3D Spherical Photosphere with Eddington Quadratic Limb Darkening (A0Vp Pure White / Blue-White Star)
        const photoGrad = ctx.createRadialGradient(-radius * 0.22, -radius * 0.22, 0, 0, 0, radius);
        photoGrad.addColorStop(0, '#ffffff'); // Searing sub-observer specular core
        photoGrad.addColorStop(0.3, '#f8faff'); // Brilliant crystalline white
        photoGrad.addColorStop(0.65, '#dbeafe'); // Pale celestial sapphire white
        photoGrad.addColorStop(0.86, '#93c5fd'); // Cool diamond blue horizon
        photoGrad.addColorStop(1, '#1e3a8a'); // Crisp interstellar limb darkening
        ctx.fillStyle = photoGrad;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        // Clip strictly to the spherical disk
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.clip();

        // Latitude coordinate lines projected on sphere
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        [-0.5, 0, 0.5].forEach((latFrac) => {
          const latY = latFrac * radius;
          const latR = Math.sqrt(Math.max(0, radius * radius - latY * latY));
          ctx.beginPath();
          ctx.ellipse(0, latY, latR, latR * 0.22, 0, 0, Math.PI * 2);
          ctx.stroke();
        });

        // 4 Multi-Latitude Magnetic & Chemical Abundance Anomaly Patches (Alpha-2 Canum Venaticorum Archetype)
        // Rotating with the star: Chemically peculiar Silicon, Chromium, and magnetic facular regions
        const spotGroups = [
          { lat: -0.22, lonOffset: 0.0, radX: 20, radY: 14, type: 'silicon' },
          { lat: 0.26, lonOffset: 1.15, radX: 24, radY: 17, type: 'magnetic' },
          { lat: -0.42, lonOffset: 2.8, radX: 18, radY: 12, type: 'chromium' },
          { lat: 0.12, lonOffset: 4.2, radX: 22, radY: 15, type: 'silicon' },
        ];

        let totalSpottedFluxLoss = 0;

        spotGroups.forEach((sg) => {
          const currentLon = rotAngle + sg.lonOffset;
          const cosLon = Math.cos(currentLon);
          const sinLon = Math.sin(currentLon);

          // Only visible when on the front hemisphere (cosLon > -0.05)
          if (cosLon > -0.05) {
            const latY = sg.lat * radius;
            const parallelRadius = Math.sqrt(Math.max(0, radius * radius - latY * latY));
            const spotX = sinLon * parallelRadius;
            const spotY = latY + cosLon * parallelRadius * 0.12; // 3D perspective slant

            // Foreshortening factor: features compress near the stellar limb
            const foreshortenX = Math.max(0.12, cosLon);
            const distFromCenter = Math.sqrt(spotX * spotX + spotY * spotY) / radius;

            if (sg.type === 'silicon') {
              // Ap/Bp Chemically Peculiar Silicon Abundance Patch (Opalescent lavender/cyan)
              const apGrad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, sg.radX);
              apGrad.addColorStop(0, 'rgba(192, 132, 252, 0.7)');
              apGrad.addColorStop(0.45, 'rgba(56, 189, 248, 0.45)');
              apGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
              ctx.fillStyle = apGrad;
              ctx.beginPath();
              ctx.ellipse(spotX, spotY, sg.radX * foreshortenX, sg.radY, 0, 0, Math.PI * 2);
              ctx.fill();
            } else if (sg.type === 'chromium') {
              // Chromium / Rare-Earth Element Patch (Emerald-cyan & iridescent indigo)
              const crGrad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, sg.radX);
              crGrad.addColorStop(0, 'rgba(45, 212, 191, 0.7)');
              crGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.45)');
              crGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
              ctx.fillStyle = crGrad;
              ctx.beginPath();
              ctx.ellipse(spotX, spotY, sg.radX * foreshortenX, sg.radY, 0, 0, Math.PI * 2);
              ctx.fill();
            } else {
              // Magnetic Plage & Cool Magnetic Depression (Harmonized with white A-type star)
              const faculaLimbBoost = 0.25 + 0.65 * distFromCenter;
              ctx.fillStyle = `rgba(255, 255, 255, ${0.48 * cosLon * faculaLimbBoost})`;
              ctx.beginPath();
              ctx.ellipse(spotX, spotY, (sg.radX + 8) * foreshortenX, sg.radY + 6, 0, 0, Math.PI * 2);
              ctx.fill();

              // Magnetic spot penumbra (cool slate/indigo tone, never muddy brown)
              const penumbraGrad = ctx.createRadialGradient(spotX, spotY, sg.radX * 0.35, spotX, spotY, sg.radX);
              penumbraGrad.addColorStop(0, 'rgba(30, 41, 59, 0.65)');
              penumbraGrad.addColorStop(0.7, 'rgba(51, 65, 85, 0.4)');
              penumbraGrad.addColorStop(1, 'rgba(30, 58, 138, 0)');
              ctx.fillStyle = penumbraGrad;
              ctx.beginPath();
              ctx.ellipse(spotX, spotY, sg.radX * foreshortenX, sg.radY, 0, 0, Math.PI * 2);
              ctx.fill();

              // Magnetic core umbra (deep midnight slate)
              const umbraGrad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, sg.radX * 0.55);
              umbraGrad.addColorStop(0, 'rgba(15, 23, 42, 0.85)');
              umbraGrad.addColorStop(1, 'rgba(30, 41, 59, 0.5)');
              ctx.fillStyle = umbraGrad;
              ctx.beginPath();
              ctx.ellipse(spotX, spotY, sg.radX * 0.55 * foreshortenX, sg.radY * 0.55, 0, 0, Math.PI * 2);
              ctx.fill();
            }

            totalSpottedFluxLoss += (sg.radX * sg.radY * foreshortenX) / (radius * radius);
          }
        });

        ctx.restore();

        // Exact phase-locked rotational modulation light curve
        const normPhase = (rotAngle / (Math.PI * 2)) % 1.0;
        const currentLightVal = Math.max(0.65, 1.0 - totalSpottedFluxLoss * 0.85);
        const statusText = `Rotational Phase Φ=${normPhase.toFixed(2)} • Active Feature Coverage ${(totalSpottedFluxLoss * 100).toFixed(1)}%`;

        renderVariableHUD(
          ctx, width, height, normPhase, currentLightVal,
          'Rotational Magnetic & Chemical Patch Modulation',
          statusText,
          (p) => {
            const th = p * Math.PI * 2;
            const d1 = Math.max(0, Math.cos(th)) * 0.18;
            const d2 = Math.max(0, Math.cos(th + 1.15)) * 0.14;
            const d3 = Math.max(0, Math.cos(th + 4.2)) * 0.22;
            return Math.max(0.65, 1.0 - (d1 + d2 + d3));
          }
        );
      }

      // =========================================================================
      // 8. ECLIPSING BINARIES (Algol Variables / Demon Star)
      // Two distinct stars orbiting line of sight: deep primary eclipse and
      // shallow secondary eclipse with realistic occultation
      // =========================================================================
      else if (variableId === 'eclipsing-binaries') {
        const orbitSpeed = 1.15;
        const orbAngle = elapsed * orbitSpeed;
        const orbitRadius = cx * 0.42;

        // 3D Orbital Geometry (Coplanar with slight inclination)
        const s1X = cx + Math.cos(orbAngle) * orbitRadius;
        const s1Y = cy + Math.sin(orbAngle) * 6; // Slight tilt
        const s1Z = Math.sin(orbAngle);

        const s2X = cx - Math.cos(orbAngle) * orbitRadius;
        const s2Y = cy - Math.sin(orbAngle) * 6;
        const s2Z = -s1Z;

        // Primary: Hotter, brighter, blue-white B8V star (Algol A)
        const r1 = cx * 0.24;
        const c1 = { r: 191, g: 219, b: 254 };

        // Secondary: Cooler, larger orange subgiant K0IV star (Algol B)
        const r2 = cx * 0.28;
        const c2 = { r: 249, g: 115, b: 22 };

        const drawEclipsingStar = (x: number, y: number, r: number, color: RGB, isHot: boolean) => {
          // Corona
          const corGrad = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 1.5);
          corGrad.addColorStop(0, rgbStr(color, 0.4));
          corGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = corGrad;
          ctx.beginPath();
          ctx.arc(x, y, r * 1.5, 0, Math.PI * 2);
          ctx.fill();

          // Photosphere
          const grad = ctx.createRadialGradient(x - r * 0.18, y - r * 0.18, 0, x, y, r);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.6, rgbStr(color, 1.0));
          grad.addColorStop(1, rgbStr(lerpRgb(color, { r: 10, g: 10, b: 30 }, 0.6), 1.0));
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        };

        // Z-Depth Sorting: Draw rear star first, then front star
        if (s1Z < s2Z) {
          drawEclipsingStar(s1X, s1Y, r1, c1, true);
          drawEclipsingStar(s2X, s2Y, r2, c2, false);
        } else {
          drawEclipsingStar(s2X, s2Y, r2, c2, false);
          drawEclipsingStar(s1X, s1Y, r1, c1, true);
        }

        // Calculate Eclipse Depths
        // Primary minimum: Cool star in front of Hot star (s2Z > 0 and |s1X - s2X| is small)
        const sepX = Math.abs(s1X - s2X);
        const normPhase = (orbAngle / (Math.PI * 2)) % 1.0;
        let eclipseDip = 1.0;
        let eclipseStatus = 'Full Out-of-Eclipse Light';

        if (sepX < r1 + r2) {
          const overlap = 1.0 - (sepX / (r1 + r2));
          if (s2Z > s1Z) {
            // Primary Minimum (Cool eclipses Hot -> Deep dip)
            eclipseDip = 1.0 - overlap * 0.65;
            eclipseStatus = '🌑 DEEP PRIMARY MINIMUM (Cool star in front)';
          } else {
            // Secondary Minimum (Hot eclipses Cool -> Shallow dip)
            eclipseDip = 1.0 - overlap * 0.22;
            eclipseStatus = '🌘 SHALLOW SECONDARY MINIMUM (Hot star in front)';
          }
        }

        renderVariableHUD(
          ctx, width, height, normPhase, eclipseDip,
          'Algol Eclipsing Binary Light Curve',
          eclipseStatus,
          (p) => {
            const d1 = Math.abs(p - 0.25);
            const d2 = Math.abs(p - 0.75);
            if (d1 < 0.12) return 1.0 - (1 - d1 / 0.12) * 0.65;
            if (d2 < 0.12) return 1.0 - (1 - d2 / 0.12) * 0.22;
            return 1.0;
          }
        );
      }

      // =========================================================================
      // 9. PULSATING VARIABLES (General / Classical Acoustic Pulsations)
      // Hydrodynamic equilibrium breathing via opacity valve mechanism
      // =========================================================================
      else {
        const period = 2.0;
        const phase = (elapsed / period) % 1.0;
        const pulse = Math.sin(phase * Math.PI * 2) * 0.5 + 0.5;
        const radius = cx * 0.33 + pulse * 14;

        // Pulsating Coronal Glow
        const coronaGrad = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.75);
        coronaGrad.addColorStop(0, rgbStr(coronaRgb, 0.45 + pulse * 0.35));
        coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coronaGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 1.75, 0, Math.PI * 2);
        ctx.fill();

        // Photosphere
        const photoGrad = ctx.createRadialGradient(cx - radius * 0.15, cy - radius * 0.15, 0, cx, cy, radius);
        photoGrad.addColorStop(0, '#ffffff');
        photoGrad.addColorStop(0.65, rgbStr(baseRgb, 1.0));
        photoGrad.addColorStop(1, rgbStr(lerpRgb(baseRgb, { r: 15, g: 15, b: 35 }, 0.6), 1.0));
        ctx.fillStyle = photoGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        const statusText = pulse > 0.5 ? 'Acoustic Expansion Wave' : 'Gravitational Inward Compression';
        renderVariableHUD(
          ctx, width, height, phase, pulse,
          'Acoustic Hydrodynamic Pulsation',
          statusText,
          (p) => Math.sin(p * Math.PI * 2) * 0.5 + 0.5
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [variableId, primaryHex, coronaHex]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        width={380}
        height={380}
        className="w-full h-full block rounded-2xl select-none"
      />
    </div>
  );
};

/**
 * Universal astrophysical light curve HUD overlay with real-time phase cursor
 */
function renderVariableHUD(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  currentPhase: number,
  currentVal: number,
  curveTitle: string,
  statusLabel: string,
  curveFunc: (p: number) => number
) {
  const hudH = 54;
  const hudY = height - hudH - 12;
  const hudX = 14;
  const hudW = width - 28;

  // Glassmorphic HUD panel
  ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(hudX, hudY, hudW, hudH, 10);
  ctx.fill();
  ctx.stroke();

  // Header Title
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 9.5px monospace';
  ctx.fillText(curveTitle, hudX + 10, hudY + 14);

  // Status Badge
  ctx.fillStyle = '#fbbf24';
  ctx.font = '8.5px monospace';
  ctx.fillText(statusLabel, hudX + 10, hudY + 26);

  // Wave Graph bounds
  const graphX = hudX + 10;
  const graphY = hudY + 32;
  const graphW = hudW - 20;
  const graphH = 16;

  // Grid midline
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(graphX, graphY + graphH / 2);
  ctx.lineTo(graphX + graphW, graphY + graphH / 2);
  ctx.stroke();

  // Draw Full Light Curve Cycle
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const p = i / steps;
    const normV = Math.max(0, Math.min(1, curveFunc(p)));
    const px = graphX + p * graphW;
    const py = graphY + graphH - normV * graphH;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Real-Time Phase Cursor Dot
  const cursorP = ((currentPhase % 1.0) + 1.0) % 1.0;
  const cursorX = graphX + cursorP * graphW;
  const cursorNormV = Math.max(0, Math.min(1, currentVal));
  const cursorY = graphY + graphH - cursorNormV * graphH;

  // Cursor Vertical Tracking Line
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cursorX, graphY);
  ctx.lineTo(cursorX, graphY + graphH);
  ctx.stroke();

  // Cursor Glowing Dot
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(cursorX, cursorY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}
