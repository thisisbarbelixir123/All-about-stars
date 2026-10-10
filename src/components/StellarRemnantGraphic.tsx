import React, { useEffect, useRef } from 'react';
import { StarData } from '../types';

interface StellarRemnantGraphicProps {
  remnantId: string;
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

export const StellarRemnantGraphic: React.FC<StellarRemnantGraphicProps> = ({
  remnantId,
  archetypeStar,
  colorHex = '#38bdf8',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const viewTiltRef = useRef({ tilt: 0, rot: 0 });

  // Logical color determination based on archetype star or remnant palette
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
    for (let i = 0; i < 70; i++) {
      bgStars.push({
        x: Math.random() * 500,
        y: Math.random() * 500,
        r: Math.random() * 1.3 + 0.35,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 1.6 + 0.4,
      });
    }

    // Pre-generate accretion disk particles
    const diskParticles: { angle: number; dist: number; speed: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 110; i++) {
      diskParticles.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * 95 + 26,
        speed: (Math.random() * 1.8 + 1.2) * (1 / (0.4 + Math.random() * 0.6)),
        size: Math.random() * 2.0 + 0.6,
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    // Pre-generate relativistic jet knots
    const jetKnots: { dist: number; speed: number; size: number; dir: number }[] = [];
    for (let i = 0; i < 28; i++) {
      jetKnots.push({
        dist: Math.random() * 190 + 20,
        speed: Math.random() * 60 + 40,
        size: Math.random() * 3.2 + 1,
        dir: i % 2 === 0 ? 1 : -1,
      });
    }

    // Pre-generate magnetar relativistic plasma charges streaming along magnetic field lines
    const magnetarParticles: { shellIdx: number; azimuthIdx: number; phase: number; speed: number; size: number }[] = [];
    for (let i = 0; i < 48; i++) {
      magnetarParticles.push({
        shellIdx: i % 4,
        azimuthIdx: Math.floor(i / 4) % 8,
        phase: Math.random(),
        speed: Math.random() * 0.45 + 0.35,
        size: Math.random() * 1.8 + 1.2,
      });
    }

    // Pre-generate magnetar crustal tectonic fissures (fracture networks on unit sphere)
    const magnetarFissures: { lat0: number; lon0: number; lat1: number; lon1: number; midLat: number; midLon: number }[] = [
      { lat0: 0.28, lon0: 0.2, lat1: 0.12, lon1: 1.1, midLat: 0.35, midLon: 0.65 },
      { lat0: 0.12, lon0: 1.1, lat1: -0.22, lon1: 1.7, midLat: -0.05, midLon: 1.4 },
      { lat0: -0.25, lon0: 0.4, lat1: -0.38, lon1: 1.45, midLat: -0.15, midLon: 0.95 },
      { lat0: 0.42, lon0: 2.1, lat1: 0.15, lon1: 2.85, midLat: 0.52, midLon: 2.45 },
      { lat0: -0.18, lon0: 2.3, lat1: -0.44, lon1: 3.1, midLat: -0.32, midLon: 2.7 },
      { lat0: 0.05, lon0: 3.3, lat1: -0.15, lon1: 4.2, midLat: 0.18, midLon: 3.75 },
    ];

    // Safe radial gradient creator ensuring non-negative, finite numbers
    const createSafeRadial = (
      x0: number,
      y0: number,
      r0: number,
      x1: number,
      y1: number,
      r1: number
    ) => {
      const sX0 = Number.isFinite(x0) ? x0 : 0;
      const sY0 = Number.isFinite(y0) ? y0 : 0;
      const sR0 = Number.isFinite(r0) ? Math.max(0, r0) : 0;
      const sX1 = Number.isFinite(x1) ? x1 : sX0;
      const sY1 = Number.isFinite(y1) ? y1 : sY0;
      const sR1 = Number.isFinite(r1) ? Math.max(0.001, r1) : Math.max(1, sR0 + 1);
      return ctx.createRadialGradient(sX0, sY0, sR0, sX1, sY1, sR1);
    };

    // Space background with General-Relativistic Gravitational Deflection
    const drawSpaceBackground = (w: number, h: number, timeSec: number, bhCenter?: { x: number; y: number; rH: number }) => {
      const bgGrad = createSafeRadial(w / 2, h / 2, 20, w / 2, h / 2, w * 0.75);
      bgGrad.addColorStop(0, '#060a1e');
      bgGrad.addColorStop(0.55, '#030514');
      bgGrad.addColorStop(1, '#010207');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle ambient nebular dust
      const nebGrad = createSafeRadial(w * 0.55, h * 0.35, 15, w * 0.55, h * 0.35, 240);
      nebGrad.addColorStop(0, `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, 0.12)`);
      nebGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = nebGrad;
      ctx.fillRect(0, 0, w, h);

      // Twinkling background stars with Einstein deflection warping
      for (const st of bgStars) {
        const twinkle = Math.sin(timeSec * st.speed + st.x * 0.05) * 0.3 + 0.7;
        let sx = st.x;
        let sy = st.y;
        let sAlpha = st.alpha * twinkle;

        if (bhCenter) {
          const dx = sx - bhCenter.x;
          const dy = sy - bhCenter.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Occulted inside Apparent Event Horizon shadow (photon capture boundary ~ 1.38 rH)
          if (dist < bhCenter.rH * 1.36) {
            continue;
          }

          // Einstein gravitational deflection: deflection ~ 4GM / (c^2 * dist)
          const deflection = (bhCenter.rH * bhCenter.rH * 0.75) / (dist + 4);
          const angle = Math.atan2(dy, dx);
          sx += Math.cos(angle) * deflection;
          sy += Math.sin(angle) * deflection;

          // Einstein ring intensity brightening near photon sphere
          if (dist < bhCenter.rH * 3.0) {
            sAlpha = Math.min(1.0, sAlpha * 1.85);
          }
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${sAlpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Telemetry HUD overlay at the bottom
    const drawTelemetryHUD = (
      w: number,
      h: number,
      badgeText: string,
      statL: string,
      valL: string,
      statR: string,
      valR: string,
      accentColor: string,
      gaugeValue: number = 0.5
    ) => {
      const hudY = 416;
      const hudH = 76;

      ctx.save();
      // Frosted backdrop
      ctx.fillStyle = 'rgba(2, 6, 23, 0.82)';
      ctx.fillRect(8, hudY, w - 16, hudH);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(8, hudY, w - 16, hudH);

      // Category / Regime Badge
      ctx.fillStyle = accentColor;
      ctx.fillRect(16, hudY + 8, 4, 14);

      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(badgeText.toUpperCase(), 26, hudY + 19);

      // Live animated indicator dot
      const pulseAlpha = Math.sin(performance.now() * 0.006) * 0.35 + 0.65;
      ctx.fillStyle = `rgba(56, 189, 248, ${pulseAlpha})`;
      ctx.beginPath();
      ctx.arc(w - 24, hudY + 15, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '9px monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText('LIVE RELATIVISTIC MODEL', w - 155, hudY + 18);

      // Stat L
      ctx.font = '8px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(statL.toUpperCase(), 16, hudY + 41);
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(valL, 16, hudY + 56);

      // Stat R
      ctx.font = '8px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(statR.toUpperCase(), w / 2 + 10, hudY + 41);
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(valR, w / 2 + 10, hudY + 56);

      // Bottom progress/flux gauge bar
      const safeGauge = Math.max(0, Math.min(1, gaugeValue));
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(16, hudY + 65, w - 32, 3);
      ctx.fillStyle = accentColor;
      ctx.fillRect(16, hudY + 65, (w - 32) * safeGauge, 3);

      ctx.restore();
    };

    const render = (now: number) => {
      const elapsedMs = now - startTime;
      const timeSec = elapsedMs / 1000;
      const w = 500;
      const h = 500;
      const cx = 250;
      const cy = 210;

      const isBlackHole = remnantId === 'stellar-black-holes' || remnantId === 'supermassive-black-holes';
      const rHVal = remnantId === 'supermassive-black-holes' ? 36 : 27;

      ctx.clearRect(0, 0, w, h);
      drawSpaceBackground(w, h, timeSec, isBlackHole ? { x: cx, y: cy, rH: rHVal } : undefined);

      // Smooth interactive camera orientation tracking
      const targetTilt = mouseRef.current.active
        ? (mouseRef.current.y - 0.5) * 0.4
        : Math.sin(timeSec * 0.4) * 0.06;
      const targetRot = mouseRef.current.active
        ? (mouseRef.current.x - 0.5) * 0.55
        : Math.cos(timeSec * 0.3) * 0.05;

      viewTiltRef.current.tilt += (targetTilt - viewTiltRef.current.tilt) * 0.08;
      viewTiltRef.current.rot += (targetRot - viewTiltRef.current.rot) * 0.08;

      switch (remnantId) {
        // ==========================================
        // 1. WHITE DWARFS (Degenerate Electron Core)
        // ==========================================
        case 'white-dwarfs': {
          const rBase = 52;
          const shimmer = Math.sin(timeSec * 2.2) * 2;

          // Planetary nebula remnant shell (fading outer ring)
          ctx.save();
          const nebGrad = createSafeRadial(cx, cy, 80, cx, cy, 180);
          nebGrad.addColorStop(0, 'rgba(6, 182, 212, 0.16)');
          nebGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
          nebGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = nebGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, 180, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Circumstellar pulverized asteroid debris disk (DZ signature)
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(-0.35);
          ctx.scale(1, 0.32);

          // Back half of debris ring
          ctx.strokeStyle = 'rgba(224, 242, 254, 0.22)';
          ctx.lineWidth = 14;
          ctx.beginPath();
          ctx.arc(0, 0, 105, Math.PI, 0);
          ctx.stroke();

          // Orbiting asteroid dust particles
          for (let i = 0; i < 28; i++) {
            const pAngle = timeSec * 0.7 + i * 0.23;
            const px = Math.cos(pAngle) * (100 + (i % 5) * 3);
            const py = Math.sin(pAngle) * (100 + (i % 5) * 3);
            ctx.fillStyle = i % 3 === 0 ? '#38bdf8' : '#e2e8f0';
            ctx.beginPath();
            ctx.arc(px, py, 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // Outer gravitational redshift corona glow
          const corona = createSafeRadial(cx, cy, rBase * 0.5, cx, cy, rBase * 2.4);
          corona.addColorStop(0, 'rgba(224, 242, 254, 0.85)');
          corona.addColorStop(0.35, 'rgba(125, 211, 252, 0.45)');
          corona.addColorStop(0.75, 'rgba(56, 189, 248, 0.15)');
          corona.addColorStop(1, 'transparent');
          ctx.fillStyle = corona;
          ctx.beginPath();
          ctx.arc(cx, cy, rBase * 2.4, 0, Math.PI * 2);
          ctx.fill();

          // Crystalline Degenerate Core Body
          const coreGrad = createSafeRadial(cx - 15, cy - 15, 2, cx, cy, rBase);
          coreGrad.addColorStop(0, '#ffffff');
          coreGrad.addColorStop(0.3, '#f0f9ff');
          coreGrad.addColorStop(0.7, '#bae6fd');
          coreGrad.addColorStop(0.92, '#7dd3fc');
          coreGrad.addColorStop(1, '#bae6fd');
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, rBase, 0, Math.PI * 2);
          ctx.fill();

          // Luminous radiant limb highlight - no dark circumference
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.lineWidth = 1.8;
          ctx.stroke();
          ctx.restore();

          // Quantum crystal lattice facets (simulating BPM 37093 crystallized diamond core)
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 1;
          for (let a = 0; a < 6; a++) {
            const rad = (a * Math.PI) / 3 + timeSec * 0.08;
            const x1 = cx + Math.cos(rad) * (rBase * 0.8);
            const y1 = cy + Math.sin(rad) * (rBase * 0.8);
            const x2 = cx + Math.cos(rad + Math.PI / 3) * (rBase * 0.8);
            const y2 = cy + Math.sin(rad + Math.PI / 3) * (rBase * 0.8);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
          ctx.restore();

          // Front half of debris ring
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(-0.35);
          ctx.scale(1, 0.32);
          ctx.strokeStyle = 'rgba(224, 242, 254, 0.35)';
          ctx.lineWidth = 14;
          ctx.beginPath();
          ctx.arc(0, 0, 105, 0, Math.PI);
          ctx.stroke();
          ctx.restore();

          // Telemetry
          const coolGauge = (Math.sin(timeSec * 0.5) + 1) * 0.5;
          drawTelemetryHUD(
            w,
            h,
            'White Dwarf (Electron Degenerate)',
            'Degeneracy State',
            'Pauli Exclusion Balanced',
            'Surface Gravity',
            '100,000× g (log g ≈ 8.0)',
            '#38bdf8',
            coolGauge
          );
          break;
        }

        // ==========================================
        // 2. RADIO-QUIET NEUTRON STARS (Thermal INS / CCO)
        // ==========================================
        case 'radio-quiet-neutron-stars': {
          const rBase = 22; // Manhattan-sized city sphere (~11 km)

          // Gravitational Light Bending / Einstein Ring around the neutron star
          ctx.save();
          const lensGrad = createSafeRadial(cx, cy, rBase * 0.9, cx, cy, rBase * 3.8);
          lensGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
          lensGrad.addColorStop(0.35, 'rgba(147, 197, 253, 0.22)');
          lensGrad.addColorStop(0.7, 'rgba(30, 58, 138, 0.1)');
          lensGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = lensGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, rBase * 3.8, 0, Math.PI * 2);
          ctx.fill();

          // Warped Einstein Arc light rings (curving background stars around the limb)
          ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(cx, cy, rBase * 1.55, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(cx, cy, rBase * 2.1, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // Pure Thermal Soft X-ray Atmosphere Glow
          const corona = createSafeRadial(cx, cy, rBase * 0.4, cx, cy, rBase * 2.2);
          corona.addColorStop(0, 'rgba(216, 255, 255, 0.95)');
          corona.addColorStop(0.3, 'rgba(128, 255, 255, 0.7)');
          corona.addColorStop(0.65, 'rgba(6, 182, 212, 0.25)');
          corona.addColorStop(1, 'transparent');
          ctx.fillStyle = corona;
          ctx.beginPath();
          ctx.arc(cx, cy, rBase * 2.2, 0, Math.PI * 2);
          ctx.fill();

          // Neutron Star Core Body (Ultra-dense nuclear matter)
          const nsGrad = createSafeRadial(cx - 6, cy - 6, 2, cx, cy, rBase);
          nsGrad.addColorStop(0, '#ffffff');
          nsGrad.addColorStop(0.35, '#cffafe');
          nsGrad.addColorStop(0.75, '#67e8f9');
          nsGrad.addColorStop(1, '#bae6fd');
          ctx.fillStyle = nsGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, rBase, 0, Math.PI * 2);
          ctx.fill();

          // Luminous radiant limb highlight - no dark circumference
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 1.8;
          ctx.stroke();
          ctx.restore();

          // Hot Polar Caps (Thermal modulation, no radio synchrotron beams)
          const rotAngle = timeSec * 0.9;
          const spotX = cx + Math.cos(rotAngle) * (rBase * 0.55);
          const spotY = cy + Math.sin(rotAngle) * (rBase * 0.2);
          const spotGrad = createSafeRadial(spotX, spotY, 0, spotX, spotY, 6);
          spotGrad.addColorStop(0, '#ffffff');
          spotGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.8)');
          spotGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = spotGrad;
          ctx.beginPath();
          ctx.arc(spotX, spotY, 6, 0, Math.PI * 2);
          ctx.fill();

          // Telemetry
          const xRayFlux = (Math.sin(timeSec * 1.8) + 1) * 0.5;
          drawTelemetryHUD(
            w,
            h,
            'Thermal Neutron Star (Radio-Quiet)',
            'X-Ray Temperature',
            'T ≈ 1,200,000 K (Soft X-Ray)',
            'Radio Emission',
            '0 Pulses (Sub-Critical / Quiescent)',
            '#06b6d4',
            xRayFlux
          );
          break;
        }

        // ==========================================
        // 3. RADIO PULSARS (Rotation-Powered Relics)
        // ==========================================
        case 'radio-pulsars': {
          const rBase = 20;
          const spinSpeed = 4.2; // Fast rotation
          const spinPhase = timeSec * spinSpeed;
          const beamAngle = spinPhase % (Math.PI * 2);

          // Toroidal Pulsar Wind Nebula (PWN) shocks
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(0.4);
          ctx.scale(1, 0.4);
          const pwnGrad = createSafeRadial(0, 0, 35, 0, 0, 160);
          pwnGrad.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
          pwnGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.15)');
          pwnGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = pwnGrad;
          ctx.beginPath();
          ctx.arc(0, 0, 160, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Magnetic Dipole Field Lines
          ctx.save();
          ctx.strokeStyle = 'rgba(192, 132, 252, 0.35)';
          ctx.lineWidth = 1.2;
          for (let m = -3; m <= 3; m++) {
            if (m === 0) continue;
            ctx.beginPath();
            const sweep = m * 24;
            ctx.ellipse(cx + sweep, cy, Math.abs(sweep) * 1.4, 75, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();

          // Relativistic Synchrotron Radio Beam Cones (Twin Cones)
          const coneLength = 210;
          const coneSpread = 0.28;

          const drawBeam = (angle: number) => {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);

            const beamGrad = ctx.createLinearGradient(0, 0, coneLength, 0);
            beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            beamGrad.addColorStop(0.2, 'rgba(192, 132, 252, 0.85)');
            beamGrad.addColorStop(0.65, 'rgba(147, 51, 234, 0.4)');
            beamGrad.addColorStop(1, 'transparent');

            ctx.fillStyle = beamGrad;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(coneLength, Math.tan(coneSpread) * coneLength);
            ctx.lineTo(coneLength, -Math.tan(coneSpread) * coneLength);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          };

          drawBeam(beamAngle);
          drawBeam(beamAngle + Math.PI); // Opposite magnetic pole

          // Neutron Star Core Body
          const nsGrad = createSafeRadial(cx - 5, cy - 5, 2, cx, cy, rBase);
          nsGrad.addColorStop(0, '#ffffff');
          nsGrad.addColorStop(0.3, '#f3e8ff');
          nsGrad.addColorStop(0.7, '#c084fc');
          nsGrad.addColorStop(1, '#e9d5ff');
          ctx.fillStyle = nsGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, rBase, 0, Math.PI * 2);
          ctx.fill();

          // Radiant luminous limb highlight - no dark circumference
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 1.8;
          ctx.stroke();
          ctx.restore();

          // Flash when beam sweeps toward observer (around angle = 0 or PI)
          const isIntercept = Math.abs(Math.sin(beamAngle)) < 0.22;
          if (isIntercept) {
            ctx.save();
            const flashGrad = createSafeRadial(cx, cy, 0, cx, cy, 140);
            flashGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            flashGrad.addColorStop(0.3, 'rgba(192, 132, 252, 0.6)');
            flashGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = flashGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, 140, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Telemetry
          const pulseHeight = isIntercept ? 1.0 : 0.15;
          drawTelemetryHUD(
            w,
            h,
            'Radio Pulsar (Rotation-Powered)',
            'Period / Spin Rate',
            'P = 33.5 ms • 29.8 Hz',
            'Beam Intercept',
            isIntercept ? '>>> PULSE DETECTED <<<' : 'Sweeping Horizon',
            '#a855f7',
            pulseHeight
          );
          break;
        }

        // ==========================================
        // 4. MILLISECOND & SPIDER PULSARS (Recycled / MSP)
        // ==========================================
        case 'millisecond-pulsars': {
          const rBase = 18;
          const mspSpin = timeSec * 16.0; // Extreme spin speed

          // Binary companion star being ablated/evaporated (Black Widow donor)
          const compOrbitRadius = 135;
          const compAngle = timeSec * 0.9;
          const compX = cx + Math.cos(compAngle) * compOrbitRadius;
          const compY = cy + Math.sin(compAngle) * compOrbitRadius * 0.35;
          const compR = 24;

          // Ablated vaporized comet-like tail blown away by the pulsar wind
          ctx.save();
          const tailGrad = ctx.createLinearGradient(compX, compY, compX - Math.cos(compAngle) * 80, compY - Math.sin(compAngle) * 40);
          tailGrad.addColorStop(0, 'rgba(244, 63, 94, 0.7)');
          tailGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.35)');
          tailGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = tailGrad;
          ctx.beginPath();
          ctx.arc(compX, compY, compR, 0, Math.PI * 2);
          ctx.fill();

          // Companion body
          const compGrad = createSafeRadial(compX - 6, compY - 6, 2, compX, compY, compR);
          compGrad.addColorStop(0, '#ffffff');
          compGrad.addColorStop(0.35, '#fef08a');
          compGrad.addColorStop(0.75, '#fb923c');
          compGrad.addColorStop(1, '#fed7aa');
          ctx.fillStyle = compGrad;
          ctx.beginPath();
          ctx.arc(compX, compY, compR, 0, Math.PI * 2);
          ctx.fill();

          // Radiant limb highlight - no dark circumference
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.65)';
          ctx.lineWidth = 1.6;
          ctx.stroke();
          ctx.restore();

          // Blazing ultra-fast relativistic beam cones
          for (let b = 0; b < 2; b++) {
            const angle = mspSpin + b * Math.PI;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            const beamGrad = ctx.createLinearGradient(0, 0, 180, 0);
            beamGrad.addColorStop(0, '#ffffff');
            beamGrad.addColorStop(0.3, 'rgba(236, 72, 153, 0.8)');
            beamGrad.addColorStop(0.7, 'rgba(244, 63, 94, 0.3)');
            beamGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = beamGrad;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(180, 22);
            ctx.lineTo(180, -22);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }

          // Pulsar Core
          const coreGrad = createSafeRadial(cx - 4, cy - 4, 1, cx, cy, rBase);
          coreGrad.addColorStop(0, '#ffffff');
          coreGrad.addColorStop(0.35, '#fce7f3');
          coreGrad.addColorStop(0.75, '#f472b6');
          coreGrad.addColorStop(1, '#fce7f3');
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, rBase, 0, Math.PI * 2);
          ctx.fill();

          // Radiant luminous limb highlight - no dark circumference
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.lineWidth = 1.8;
          ctx.stroke();
          ctx.restore();

          // Telemetry
          const spinFreq = 716; // Hz
          const orbitPhase = ((compAngle % (Math.PI * 2)) / (Math.PI * 2)).toFixed(2);
          drawTelemetryHUD(
            w,
            h,
            'Millisecond Spider Pulsar (Recycled)',
            'Spin Frequency',
            `${spinFreq} Hz (0.24 c Equator)`,
            'Companion Status',
            `Evaporating Donor (Phase ${orbitPhase})`,
            '#ec4899',
            0.88
          );
          break;
        }

        // =====================================================================
        // 5. MAGNETARS (Ultra-Magnetic Relics / SGR 1806-20 Relativistic Model)
        // =====================================================================
        case 'magnetars': {
          const rBase = 25; // Compact Neutron Star Core radius (~11 km)
          const tilt = -0.26 + viewTiltRef.current.tilt;
          const rot = viewTiltRef.current.rot;

          // Magnetar slow rotation (P ≈ 3.8s) and magnetic dipole precession
          const spinPeriod = 3.8;
          const spinAngle = timeSec * ((Math.PI * 2) / spinPeriod);

          // Tectonic Maxwell shear strain & Starquake giant flare cycle
          const flareCycle = (timeSec * 0.22) % 1; // ~4.5s cycle
          const isStarquake = flareCycle > 0.80;
          const quakeProgress = isStarquake ? (flareCycle - 0.80) / 0.20 : 0;
          const quakeAlpha = isStarquake ? Math.sin(quakeProgress * Math.PI) : 0;
          // Seismic Quasi-Periodic Oscillations (QPOs, ~92.5 Hz crustal vibration)
          const seismicVibe = isStarquake
            ? Math.sin(timeSec * 580) * 1.8 * Math.sin(quakeProgress * Math.PI)
            : 0;

          // 3D vector rotation helper (applies camera tilt & rot)
          const project3D = (vx: number, vy: number, vz: number) => {
            const cosR = Math.cos(rot);
            const sinR = Math.sin(rot);
            const x1 = vx * cosR + vz * sinR;
            const y1 = vy;
            const z1 = -vx * sinR + vz * cosR;

            const cosT = Math.cos(tilt);
            const sinT = Math.sin(tilt);
            const x2 = x1;
            const y2 = y1 * cosT - z1 * sinT;
            const z2 = y1 * sinT + z1 * cosT;

            return { x: cx + x2, y: cy + y2 + seismicVibe, z: z2 };
          };

          // Magnetic dipole inclination (theta_m ≈ 36° relative to rotation axis)
          const thetaM = 0.63;
          // Calculate magnetic axis vector in star's reference frame
          const magAxisX = Math.sin(thetaM) * Math.cos(spinAngle);
          const magAxisY = Math.cos(thetaM);
          const magAxisZ = Math.sin(thetaM) * Math.sin(spinAngle);

          // Projected North and South magnetic poles on the star crust
          const mNorth = project3D(magAxisX * rBase, magAxisY * rBase, magAxisZ * rBase);
          const mSouth = project3D(-magAxisX * rBase, -magAxisY * rBase, -magAxisZ * rBase);

          // -------------------------------------------------------------
          // 1. QUANTUM ELECTRODYNAMICS (QED) VACUUM BIREFRINGENCE HALO
          //    B > B_QED (4.4e13 G) polarizes the vacuum, splitting photons
          // -------------------------------------------------------------
          ctx.save();
          const haloR = rBase * (4.2 + (isStarquake ? quakeAlpha * 1.5 : Math.sin(timeSec * 3) * 0.15));
          const qedHalo = createSafeRadial(cx, cy + seismicVibe, rBase * 0.4, cx, cy + seismicVibe, haloR);
          qedHalo.addColorStop(0, isStarquake ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)');
          qedHalo.addColorStop(0.22, 'rgba(251, 113, 133, 0.65)');
          qedHalo.addColorStop(0.5, 'rgba(244, 63, 94, 0.32)');
          qedHalo.addColorStop(0.78, 'rgba(136, 19, 55, 0.10)');
          qedHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = qedHalo;
          ctx.beginPath();
          ctx.arc(cx, cy + seismicVibe, haloR, 0, Math.PI * 2);
          ctx.fill();

          // Diffuse birefringent polarization ripples
          const ripCount = 3;
          for (let rp = 0; rp < ripCount; rp++) {
            const ripPhase = ((timeSec * 0.8 + rp * 0.33) % 1);
            const ripR = rBase + ripPhase * (haloR - rBase);
            const ripAlpha = (1 - ripPhase) * 0.25;
            ctx.strokeStyle = `rgba(251, 113, 133, ${ripAlpha.toFixed(3)})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(cx, cy + seismicVibe, ripR, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();

          // -------------------------------------------------------------
          // 2. 3D TWISTED FORCE-FREE MAGNETIC DIPOLE LOOPS (B ≈ 10¹⁵ G)
          //    Twisted magnetosphere with helical pitch delta_phi ≈ 1.15 rad
          // -------------------------------------------------------------
          const lShells = [1.8, 2.6, 3.6, 4.8];
          const azimuthCount = 8;
          interface MagLoop {
            pts: { x: number; y: number; z: number }[];
            avgZ: number;
            shellIdx: number;
            azimuthIdx: number;
          }
          const allLoops: MagLoop[] = [];

          for (let sIdx = 0; sIdx < lShells.length; sIdx++) {
            const L = lShells[sIdx];
            for (let aIdx = 0; aIdx < azimuthCount; aIdx++) {
              const phi0 = (aIdx / azimuthCount) * Math.PI * 2;
              const loopPts: { x: number; y: number; z: number }[] = [];
              let zSum = 0;

              const steps = 24;
              // Latitude along field line: lambda from -lambda_max to +lambda_max
              const lambdaMax = Math.acos(Math.sqrt(1 / Math.max(1.01, L)));
              for (let st = 0; st <= steps; st++) {
                const lambda = -lambdaMax + (st / steps) * (2 * lambdaMax);
                const rField = rBase * L * Math.cos(lambda) * Math.cos(lambda);

                // Helical force-free twist
                const twist = 1.15 * Math.sin(lambda);
                const phi = phi0 + twist;

                // Point in coordinate system where magnetic axis is aligned with Z'
                const xMag = rField * Math.cos(lambda) * Math.cos(phi);
                const yMag = rField * Math.cos(lambda) * Math.sin(phi);
                const zMag = rField * Math.sin(lambda);

                // Rotate into star frame where magnetic axis is tilted by thetaM around X, rotated by spinAngle around Y
                const xTilt = xMag;
                const yTilt = yMag * Math.cos(thetaM) - zMag * Math.sin(thetaM);
                const zTilt = yMag * Math.sin(thetaM) + zMag * Math.cos(thetaM);

                const xStar = xTilt * Math.cos(spinAngle) + zTilt * Math.sin(spinAngle);
                const yStar = yTilt;
                const zStar = -xTilt * Math.sin(spinAngle) + zTilt * Math.cos(spinAngle);

                const proj = project3D(xStar, yStar, zStar);
                loopPts.push(proj);
                zSum += proj.z;
              }

              allLoops.push({
                pts: loopPts,
                avgZ: zSum / (steps + 1),
                shellIdx: sIdx,
                azimuthIdx: aIdx,
              });
            }
          }

          // Helper to draw a set of loops
          const renderLoopGroup = (loops: MagLoop[], isForeground: boolean) => {
            ctx.save();
            for (const loop of loops) {
              if (loop.pts.length < 2) continue;
              const baseAlpha = isForeground ? 0.65 : 0.28;
              const glowAlpha = isForeground ? 0.35 : 0.12;

              // Shimmer intensity along the loop
              const loopPulse = 0.85 + 0.15 * Math.sin(timeSec * 5 + loop.shellIdx * 1.5 + loop.azimuthIdx);

              // Outer soft magnetic sheath
              ctx.strokeStyle = `rgba(244, 63, 94, ${(glowAlpha * loopPulse).toFixed(3)})`;
              ctx.lineWidth = isForeground ? 3.2 : 1.8;
              ctx.beginPath();
              ctx.moveTo(loop.pts[0].x, loop.pts[0].y);
              for (let p = 1; p < loop.pts.length; p++) {
                ctx.lineTo(loop.pts[p].x, loop.pts[p].y);
              }
              ctx.stroke();

              // Core flux tube spine
              ctx.strokeStyle = isForeground
                ? `rgba(255, 228, 230, ${(baseAlpha * loopPulse).toFixed(3)})`
                : `rgba(251, 113, 133, ${(baseAlpha * loopPulse).toFixed(3)})`;
              ctx.lineWidth = isForeground ? 1.4 : 0.9;
              ctx.beginPath();
              ctx.moveTo(loop.pts[0].x, loop.pts[0].y);
              for (let p = 1; p < loop.pts.length; p++) {
                ctx.lineTo(loop.pts[p].x, loop.pts[p].y);
              }
              ctx.stroke();
            }
            ctx.restore();
          };

          // Draw back loops (behind the stellar body)
          const backLoops = allLoops.filter((l) => l.avgZ < 0);
          const frontLoops = allLoops.filter((l) => l.avgZ >= 0);
          renderLoopGroup(backLoops, false);

          // -------------------------------------------------------------
          // 3. OPEN RELATIVISTIC POLAR BEAM CONES (Synchrotron Gamma Outflow)
          // -------------------------------------------------------------
          const drawOpenPolarBeams = (poleProj: { x: number; y: number; z: number }, sign: number) => {
            if (poleProj.z < -10) return; // Behind star
            const beamLen = 140;
            const poleDirX = sign * magAxisX;
            const poleDirY = sign * magAxisY;
            const poleDirZ = sign * magAxisZ;
            const tipProj = project3D(poleDirX * (rBase + beamLen), poleDirY * (rBase + beamLen), poleDirZ * (rBase + beamLen));

            ctx.save();
            const bGrad = ctx.createLinearGradient(poleProj.x, poleProj.y, tipProj.x, tipProj.y);
            bGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            bGrad.addColorStop(0.2, 'rgba(251, 113, 133, 0.7)');
            bGrad.addColorStop(0.65, 'rgba(244, 63, 94, 0.25)');
            bGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.strokeStyle = bGrad;
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(poleProj.x, poleProj.y);
            ctx.lineTo(tipProj.x, tipProj.y);
            ctx.stroke();

            // Diverging open parabolic boundary lines
            for (let fan = -1; fan <= 1; fan += 2) {
              const spread = 24 * fan;
              const ctrlProj = project3D(
                poleDirX * (rBase + beamLen * 0.4) + spread,
                poleDirY * (rBase + beamLen * 0.4),
                poleDirZ * (rBase + beamLen * 0.4)
              );
              ctx.strokeStyle = 'rgba(244, 63, 94, 0.35)';
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.moveTo(poleProj.x, poleProj.y);
              ctx.quadraticCurveTo(ctrlProj.x, ctrlProj.y, tipProj.x + spread * 1.5, tipProj.y);
              ctx.stroke();
            }
            ctx.restore();
          };

          drawOpenPolarBeams(mNorth, 1);
          drawOpenPolarBeams(mSouth, -1);

          // -------------------------------------------------------------
          // 4. MAGNETAR STELLAR CRUST BODY (NO DARK CIRCUMFERENCE)
          //    Photosphere is incandescent white-rose with brilliant radiant limb
          // -------------------------------------------------------------
          ctx.save();
          // Ultra-dense degenerate neutron core body
          const nsGrad = createSafeRadial(
            cx - rBase * 0.22,
            cy + seismicVibe - rBase * 0.22,
            2,
            cx,
            cy + seismicVibe,
            rBase
          );
          nsGrad.addColorStop(0, '#ffffff'); // Central blinding nuclear matter
          nsGrad.addColorStop(0.3, '#ffe4e6'); // Super-heated degenerate crust (~10^7 K)
          nsGrad.addColorStop(0.68, '#fda4af'); // Soft X-ray radiating surface
          nsGrad.addColorStop(0.88, '#f43f5e'); // Intense rose emission
          nsGrad.addColorStop(1, '#fb7185'); // Radiant bright rose edge (absolutely NO dark/black circumference)
          ctx.fillStyle = nsGrad;
          ctx.beginPath();
          ctx.arc(cx, cy + seismicVibe, rBase, 0, Math.PI * 2);
          ctx.fill();

          // Brilliant luminous radiant limb highlight - no dark circumference
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 2.0;
          ctx.stroke();

          // -------------------------------------------------------------
          // 5. TECTONIC CRUSTAL FISSURES & FRACTURE RIFTS (Maxwell Yield Stress)
          // -------------------------------------------------------------
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy + seismicVibe, rBase - 0.5, 0, Math.PI * 2);
          ctx.clip();

          // Draw incandescent tectonic fault lines
          for (const fis of magnetarFissures) {
            const lon0 = fis.lon0 + spinAngle;
            const lon1 = fis.lon1 + spinAngle;
            const midLon = fis.midLon + spinAngle;

            const p0 = project3D(
              rBase * Math.cos(fis.lat0) * Math.cos(lon0),
              rBase * Math.sin(fis.lat0),
              rBase * Math.cos(fis.lat0) * Math.sin(lon0)
            );
            const pMid = project3D(
              rBase * Math.cos(fis.midLat) * Math.cos(midLon),
              rBase * Math.sin(fis.midLat),
              rBase * Math.cos(fis.midLat) * Math.sin(midLon)
            );
            const p1 = project3D(
              rBase * Math.cos(fis.lat1) * Math.cos(lon1),
              rBase * Math.sin(fis.lat1),
              rBase * Math.cos(fis.lat1) * Math.sin(lon1)
            );

            // Only render fissures on the visible front hemisphere
            if (p0.z > -4 || p1.z > -4) {
              const fissureGlow = isStarquake
                ? 1.0
                : 0.65 + 0.35 * Math.sin(timeSec * 4 + fis.lat0 * 8);

              ctx.strokeStyle = isStarquake
                ? `rgba(255, 255, 255, ${fissureGlow.toFixed(3)})`
                : `rgba(254, 205, 211, ${(0.85 * fissureGlow).toFixed(3)})`;
              ctx.lineWidth = isStarquake ? 2.8 : 1.6;
              ctx.beginPath();
              ctx.moveTo(p0.x, p0.y);
              ctx.quadraticCurveTo(pMid.x, pMid.y, p1.x, p1.y);
              ctx.stroke();

              // Pure incandescent white core fissure
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = isStarquake ? 1.5 : 0.8;
              ctx.beginPath();
              ctx.moveTo(p0.x, p0.y);
              ctx.quadraticCurveTo(pMid.x, pMid.y, p1.x, p1.y);
              ctx.stroke();
            }
          }

          // -------------------------------------------------------------
          // 6. AURORAL MAGNETIC POLAR FOOTPRINT RINGS
          // -------------------------------------------------------------
          const drawFootprint = (poleProj: { x: number; y: number; z: number }) => {
            if (poleProj.z < -4) return;
            const fpRad = 7.5;
            const fpGrad = createSafeRadial(poleProj.x, poleProj.y, 0, poleProj.x, poleProj.y, fpRad);
            fpGrad.addColorStop(0, '#ffffff');
            fpGrad.addColorStop(0.45, 'rgba(254, 205, 211, 0.9)');
            fpGrad.addColorStop(0.85, 'rgba(244, 63, 94, 0.5)');
            fpGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
            ctx.fillStyle = fpGrad;
            ctx.beginPath();
            ctx.arc(poleProj.x, poleProj.y, fpRad, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(poleProj.x, poleProj.y, 3.5, 0, Math.PI * 2);
            ctx.stroke();
          };

          drawFootprint(mNorth);
          drawFootprint(mSouth);

          ctx.restore(); // Restore clip
          ctx.restore(); // Restore body save

          // -------------------------------------------------------------
          // 7. FOREGROUND MAGNETIC LOOPS & STREAMING RELATIVISTIC CHARGES
          // -------------------------------------------------------------
          renderLoopGroup(frontLoops, true);

          // Stream relativistic pair-plasma charges along the loops
          ctx.save();
          for (const part of magnetarParticles) {
            const loop = allLoops[part.shellIdx * azimuthCount + part.azimuthIdx];
            if (!loop || loop.pts.length < 2) continue;

            const curPhase = (part.phase + timeSec * part.speed) % 1;
            const ptIdxFloat = curPhase * (loop.pts.length - 1);
            const pIdx0 = Math.floor(ptIdxFloat);
            const pIdx1 = Math.min(loop.pts.length - 1, pIdx0 + 1);
            const frac = ptIdxFloat - pIdx0;

            const px = loop.pts[pIdx0].x + (loop.pts[pIdx1].x - loop.pts[pIdx0].x) * frac;
            const py = loop.pts[pIdx0].y + (loop.pts[pIdx1].y - loop.pts[pIdx0].y) * frac;
            const pz = loop.pts[pIdx0].z + (loop.pts[pIdx1].z - loop.pts[pIdx0].z) * frac;

            if (pz > -5) {
              ctx.fillStyle = '#ffffff';
              ctx.shadowColor = '#fda4af';
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(px, py, part.size, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.restore();

          // -------------------------------------------------------------
          // 8. STARQUAKE CATASTROPHIC GIANT GAMMA-RAY FLARE (SGR 1806-20)
          // -------------------------------------------------------------
          if (isStarquake) {
            ctx.save();
            const flareRadius = rBase + quakeProgress * 230;

            // Blinding expanding gamma-ray fireball
            const flareGrad = createSafeRadial(cx, cy + seismicVibe, 0, cx, cy + seismicVibe, flareRadius);
            flareGrad.addColorStop(0, `rgba(255, 255, 255, ${(0.98 * quakeAlpha).toFixed(3)})`);
            flareGrad.addColorStop(0.25, `rgba(254, 205, 211, ${(0.85 * quakeAlpha).toFixed(3)})`);
            flareGrad.addColorStop(0.65, `rgba(244, 63, 94, ${(0.45 * quakeAlpha).toFixed(3)})`);
            flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = flareGrad;
            ctx.beginPath();
            ctx.arc(cx, cy + seismicVibe, flareRadius, 0, Math.PI * 2);
            ctx.fill();

            // Relativistic ionization shock fronts
            ctx.strokeStyle = `rgba(255, 255, 255, ${(0.95 * quakeAlpha).toFixed(3)})`;
            ctx.lineWidth = 3.6;
            ctx.beginPath();
            ctx.arc(cx, cy + seismicVibe, flareRadius * 0.96, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = `rgba(251, 113, 133, ${(0.7 * quakeAlpha).toFixed(3)})`;
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.arc(cx, cy + seismicVibe, flareRadius * 0.82, 0, Math.PI * 2);
            ctx.stroke();

            // Trapped pair-plasma fireball bubble oscillating near the epicenter
            const fbX = cx + (mNorth.x - cx) * 0.65;
            const fbY = cy + seismicVibe + (mNorth.y - (cy + seismicVibe)) * 0.65;
            const fbR = 14 + Math.sin(timeSec * 50) * 4;
            const fbGrad = createSafeRadial(fbX, fbY, 0, fbX, fbY, fbR);
            fbGrad.addColorStop(0, '#ffffff');
            fbGrad.addColorStop(0.4, 'rgba(254, 205, 211, 0.95)');
            fbGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
            ctx.fillStyle = fbGrad;
            ctx.beginPath();
            ctx.arc(fbX, fbY, fbR, 0, Math.PI * 2);
            ctx.fill();

            // Reconnection plasmoids shot outwards along current sheets
            for (let pl = 0; pl < 6; pl++) {
              const plAngle = (pl / 6) * Math.PI * 2 + timeSec * 4;
              const plDist = flareRadius * (0.4 + 0.5 * quakeProgress);
              const plX = cx + Math.cos(plAngle) * plDist;
              const plY = cy + seismicVibe + Math.sin(plAngle) * plDist;
              ctx.fillStyle = '#ffffff';
              ctx.shadowColor = '#f43f5e';
              ctx.shadowBlur = 10;
              ctx.beginPath();
              ctx.arc(plX, plY, 3.2, 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.restore();
          }

          // -------------------------------------------------------------
          // 9. TELEMETRY HUD
          // -------------------------------------------------------------
          const stressVal = isStarquake ? 1.0 : flareCycle;
          drawTelemetryHUD(
            w,
            h,
            'Magnetar (Soft Gamma Repeater / AXP)',
            'Field Strength',
            'B = 2.4 × 10¹⁵ G (55× B_QED)',
            'Crust Activity',
            isStarquake
              ? '>>> GIANT FLARE (10⁴⁶ erg) • QPO 92.5 Hz <<<'
              : `Tectonic Maxwell Strain ${(flareCycle * 100).toFixed(0)}% • Yielding`,
            '#f43f5e',
            stressVal
          );
          break;
        }

        // ==========================================
        // 6. ACCRETING NEUTRON STARS (LMXB / Scorpius X-1 Relativistic Model)
        // ==========================================
        case 'accreting-neutron-stars': {
          const rBase = 22; // Neutron Star Core radius
          const diskR = 124; // Broad Accretion Disk radius
          const tilt = -0.32 + viewTiltRef.current.tilt;
          const rot = viewTiltRef.current.rot;

          // Donor companion star & L1 Lagrange point
          const donorX = cx + 130;
          const donorY = cy - 6;
          const donorR = 84; // Substantially enlarged, prominent companion star
          const l1X = cx + 18;
          const l1Y = cy - 6;

          // 1. Relativistic Bipolar Plasma Jets (Scorpius X-1 Microquasar Outflow)
          ctx.save();
          const jetUpGrad = createSafeRadial(cx, cy - 70, 5, cx, cy - 70, 140);
          jetUpGrad.addColorStop(0, 'rgba(6, 182, 212, 0.24)');
          jetUpGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.08)');
          jetUpGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = jetUpGrad;
          ctx.fillRect(cx - 55, 0, 110, cy);

          const jetDnGrad = createSafeRadial(cx, cy + 70, 5, cx, cy + 70, 140);
          jetDnGrad.addColorStop(0, 'rgba(6, 182, 212, 0.24)');
          jetDnGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.08)');
          jetDnGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = jetDnGrad;
          ctx.fillRect(cx - 55, cy, 110, h - cy);

          // Jet core spine with traveling relativistic shock knots (v ~ 0.35c)
          for (const knot of jetKnots) {
            const currentDist = (knot.dist + timeSec * (knot.speed * 0.9)) % 180 + 20;
            const jetY = cy - currentDist * knot.dir;
            const jetSpread = currentDist * 0.045;
            const jx = cx + Math.sin(timeSec * 4 + currentDist * 0.15) * jetSpread;

            ctx.fillStyle = knot.dir === 1 ? '#ffffff' : '#67e8f9';
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(jx, jetY, knot.size * 0.75, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
          ctx.restore();

          // 2. Roche-Lobe Overflow Donor Companion Star
          ctx.save();
          // Teardrop Roche-lobe equipotential envelope tapering to L1
          ctx.beginPath();
          ctx.moveTo(l1X, l1Y);
          ctx.bezierCurveTo(
            l1X + (donorX - l1X) * 0.42, donorY - donorR * 0.95,
            donorX + donorR * 0.95, donorY - donorR * 0.98,
            donorX + donorR, donorY
          );
          ctx.bezierCurveTo(
            donorX + donorR * 0.95, donorY + donorR * 0.98,
            l1X + (donorX - l1X) * 0.42, donorY + donorR * 0.95,
            l1X, l1Y
          );
          ctx.closePath();

          // Photosphere gradient with radiant luminous edge (no dark circumference)
          const donorGrad = createSafeRadial(donorX + donorR * 0.25, donorY - donorR * 0.2, 8, donorX, donorY, donorR * 1.35);
          donorGrad.addColorStop(0, '#ffffff');
          donorGrad.addColorStop(0.22, '#fef08a');
          donorGrad.addColorStop(0.55, '#f59e0b');
          donorGrad.addColorStop(0.85, '#fb923c');
          donorGrad.addColorStop(1, '#f97316');
          ctx.fillStyle = donorGrad;
          ctx.fill();

          // Convective granulation and solar-like magnetic features
          ctx.save();
          ctx.clip();
          for (let g = 0; g < 14; g++) {
            const gAngle = g * 0.48 + timeSec * 0.22;
            const gDist = (g % 3 + 1) * 18;
            const gx = donorX + Math.cos(gAngle) * gDist;
            const gy = donorY + Math.sin(gAngle) * (gDist * 0.72);
            const gr = 14 + (g % 3) * 7;

            const gGrad = createSafeRadial(gx, gy, 2, gx, gy, gr);
            gGrad.addColorStop(0, 'rgba(254, 240, 138, 0.42)');
            gGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.2)');
            gGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gGrad;
            ctx.beginPath();
            ctx.arc(gx, gy, gr, 0, Math.PI * 2);
            ctx.fill();
          }

          // X-Ray Irradiated Inner Hemisphere (blasted by Scorpius X-1 accretion X-rays)
          const xRayIrradGrad = createSafeRadial(l1X + 10, l1Y, 4, l1X + 35, l1Y, donorR * 0.88);
          xRayIrradGrad.addColorStop(0, '#ffffff'); // Searing X-ray heated surface
          xRayIrradGrad.addColorStop(0.35, 'rgba(103, 232, 249, 0.88)');
          xRayIrradGrad.addColorStop(0.7, 'rgba(6, 182, 212, 0.42)');
          xRayIrradGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = xRayIrradGrad;
          ctx.beginPath();
          ctx.arc(l1X + 25, l1Y, donorR * 0.88, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Companion star coronal rim - luminous radiant edge
          ctx.strokeStyle = 'rgba(254, 215, 170, 0.65)';
          ctx.lineWidth = 2.4;
          ctx.stroke();
          ctx.restore();

          // 3. Supersonic Ballistic Coriolis Accretion Stream
          ctx.save();
          const hotSpotX = cx - 38;
          const hotSpotY = cy + 26;

          const streamGrad = ctx.createLinearGradient(l1X, l1Y, hotSpotX, hotSpotY);
          streamGrad.addColorStop(0, '#fef08a');
          streamGrad.addColorStop(0.4, '#67e8f9');
          streamGrad.addColorStop(0.8, '#06b6d4');
          streamGrad.addColorStop(1, '#ffffff');

          ctx.strokeStyle = streamGrad;
          ctx.lineWidth = 4.6;
          ctx.beginPath();
          ctx.moveTo(l1X, l1Y);
          ctx.quadraticCurveTo(cx + 6, cy + 36, hotSpotX, hotSpotY);
          ctx.stroke();

          // In-falling accelerated stream particles
          for (let sp = 0; sp < 34; sp++) {
            const stProgress = ((sp / 34) + timeSec * 0.75) % 1;
            const p0x = l1X;
            const p0y = l1Y;
            const p1x = cx + 6;
            const p1y = cy + 36;
            const p2x = hotSpotX;
            const p2y = hotSpotY;

            const px = (1 - stProgress) * (1 - stProgress) * p0x + 2 * (1 - stProgress) * stProgress * p1x + stProgress * stProgress * p2x;
            const py = (1 - stProgress) * (1 - stProgress) * p0y + 2 * (1 - stProgress) * stProgress * p1y + stProgress * stProgress * p2y;

            ctx.fillStyle = stProgress > 0.6 ? '#ffffff' : '#cffafe';
            ctx.beginPath();
            ctx.arc(px, py, 1.5 + stProgress * 1.3, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // 4. Supersonic Hot Spot Impact Shock
          const impactPulse = Math.sin(timeSec * 8) * 0.25 + 0.75;
          ctx.save();
          const impactGrad = createSafeRadial(hotSpotX, hotSpotY, 1, hotSpotX, hotSpotY, 20);
          impactGrad.addColorStop(0, '#ffffff');
          impactGrad.addColorStop(0.3, `rgba(103, 232, 249, ${impactPulse.toFixed(3)})`);
          impactGrad.addColorStop(0.7, `rgba(6, 182, 212, ${(impactPulse * 0.6).toFixed(3)})`);
          impactGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = impactGrad;
          ctx.beginPath();
          ctx.arc(hotSpotX, hotSpotY, 20, 0, Math.PI * 2);
          ctx.fill();

          // Shock wave ripples
          ctx.strokeStyle = `rgba(255, 255, 255, ${(impactPulse * 0.8).toFixed(3)})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(hotSpotX, hotSpotY, 12 + Math.sin(timeSec * 12) * 3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // 5. Relativistic Multi-Temperature Accretion Disk
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(tilt);
          ctx.scale(1, 0.38);

          // Multi-zone accretion disk gradient (cool outer rim -> cyan mid disk -> searing X-ray inner disk)
          const diskGrad = createSafeRadial(0, 0, rBase * 0.85, 0, 0, diskR);
          diskGrad.addColorStop(0, '#ffffff'); // Inner X-ray boundary (> 20,000,000 K)
          diskGrad.addColorStop(0.18, 'rgba(103, 232, 249, 0.95)');
          diskGrad.addColorStop(0.48, 'rgba(6, 182, 212, 0.82)');
          diskGrad.addColorStop(0.78, 'rgba(14, 116, 144, 0.58)');
          diskGrad.addColorStop(0.92, 'rgba(21, 94, 117, 0.32)');
          diskGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = diskGrad;
          ctx.beginPath();
          ctx.arc(0, 0, diskR, 0, Math.PI * 2);
          ctx.fill();

          // Spiral density shock waves in X-ray disk
          ctx.save();
          ctx.lineWidth = 2.4;
          for (let arm = 0; arm < 2; arm++) {
            const armOffset = arm * Math.PI + timeSec * 1.2;
            ctx.strokeStyle = arm === 0 ? 'rgba(255, 255, 255, 0.48)' : 'rgba(103, 232, 249, 0.38)';
            ctx.beginPath();
            for (let r = rBase * 1.2; r < diskR * 0.94; r += 4) {
              const theta = armOffset + Math.log(r / (rBase * 1.2)) * 1.7;
              const ax = Math.cos(theta) * r;
              const ay = Math.sin(theta) * r;
              if (r === rBase * 1.2) ctx.moveTo(ax, ay);
              else ctx.lineTo(ax, ay);
            }
            ctx.stroke();
          }
          ctx.restore();

          // Concentric Keplerian shear striations
          for (let ring = 1; ring <= 5; ring++) {
            const ringRadius = rBase + ring * 20;
            ctx.strokeStyle = `rgba(255, 255, 255, ${(0.12 + ring * 0.035).toFixed(3)})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Swirling Keplerian particles
          for (const dp of diskParticles) {
            const keplerSpeed = (dp.speed * 28) / Math.sqrt(dp.dist);
            const angle = dp.angle + timeSec * keplerSpeed + rot;
            const px = Math.cos(angle) * dp.dist;
            const py = Math.sin(angle) * dp.dist;

            ctx.fillStyle = dp.dist < 45 ? '#ffffff' : 'rgba(103, 232, 249, 0.85)';
            ctx.beginPath();
            ctx.arc(px, py, dp.size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // 6. Neutron Star Magnetosphere & Alfven Radius Channeling
          // Curved magnetic funneling loops channeling plasma onto magnetic poles
          ctx.save();
          ctx.translate(cx, cy);
          for (let pole = -1; pole <= 1; pole += 2) {
            const funnelAngle = timeSec * 6 * pole;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(Math.cos(funnelAngle) * 36, Math.sin(funnelAngle) * 14);
            ctx.quadraticCurveTo(0, pole * 20, 0, pole * (rBase * 0.85));
            ctx.stroke();
          }
          ctx.restore();

          // 7. Relativistic Neutron Star Core
          ctx.save();
          // High-energy X-ray corona halo
          const nsCorona = createSafeRadial(cx, cy, rBase * 0.5, cx, cy, rBase * 2.6);
          nsCorona.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          nsCorona.addColorStop(0.3, 'rgba(103, 232, 249, 0.72)');
          nsCorona.addColorStop(0.7, 'rgba(6, 182, 212, 0.3)');
          nsCorona.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = nsCorona;
          ctx.beginPath();
          ctx.arc(cx, cy, rBase * 2.6, 0, Math.PI * 2);
          ctx.fill();

          // Ultra-dense degenerate neutron core
          const nsGrad = createSafeRadial(cx - rBase * 0.25, cy - rBase * 0.25, 2, cx, cy, rBase);
          nsGrad.addColorStop(0, '#ffffff');
          nsGrad.addColorStop(0.35, '#cffafe');
          nsGrad.addColorStop(0.75, '#38bdf8');
          nsGrad.addColorStop(1, '#bae6fd');
          ctx.fillStyle = nsGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, rBase, 0, Math.PI * 2);
          ctx.fill();

          // Luminous radiant limb highlight - no dark circumference
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.lineWidth = 1.8;
          ctx.stroke();
          ctx.restore();

          // Magnetic Polar Cap Hot Spots (spinning rapidly)
          const spinPhase = timeSec * 35;
          const spotX = cx + Math.cos(spinPhase) * (rBase * 0.5);
          const spotY = cy + Math.sin(spinPhase) * (rBase * 0.25);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#67e8f9';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(spotX, spotY, 3.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.restore();

          // 8. Thermonuclear Type I X-Ray Burst (Photospheric Radius Expansion - PRE)
          const burstCycle = (timeSec * 0.35) % 1;
          const isBurst = burstCycle > 0.82;
          if (isBurst) {
            const burstProgress = (burstCycle - 0.82) / 0.18;
            const burstR = rBase + burstProgress * 185;
            const burstAlpha = Math.min(1.0, Math.sin(burstProgress * Math.PI) * 0.98);

            ctx.save();
            // Expanding thermonuclear fireball
            const bGrad = createSafeRadial(cx, cy, 10, cx, cy, burstR);
            bGrad.addColorStop(0, `rgba(255, 255, 255, ${burstAlpha.toFixed(3)})`);
            bGrad.addColorStop(0.3, `rgba(165, 243, 252, ${(burstAlpha * 0.85).toFixed(3)})`);
            bGrad.addColorStop(0.65, `rgba(6, 182, 212, ${(burstAlpha * 0.5).toFixed(3)})`);
            bGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = bGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, burstR, 0, Math.PI * 2);
            ctx.fill();

            // Radiation pressure shock front
            ctx.strokeStyle = `rgba(255, 255, 255, ${(burstAlpha * 0.95).toFixed(3)})`;
            ctx.lineWidth = 4.0;
            ctx.beginPath();
            ctx.arc(cx, cy, burstR * 0.96, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          // Telemetry
          drawTelemetryHUD(
            w,
            h,
            'Accreting Neutron Star (Scorpius X-1 LMXB)',
            'Accretion Rate',
            'Ṁ ≈ 10⁻⁸ M☉/yr (Eddington Peak)',
            'Thermonuclear State',
            isBurst ? '>>> TYPE I X-RAY DETONATION <<<' : 'Helium Ocean Accreting',
            '#06b6d4',
            isBurst ? 1.0 : burstCycle
          );
          break;
        }

        // =====================================================================
        // 7. STELLAR-MASS BLACK HOLES (SBH / Cygnus X-1 Kerr Metric Ray-Tracing)
        // =====================================================================
        case 'stellar-black-holes': {
          const rH = 26; // Event Horizon Radius (r_g = GM/c^2)
          const rShadow = 36; // Apparent Shadow Boundary (Photon capture sphere ~ 2.6 r_g)
          const rISCO = 48; // Innermost Stable Circular Orbit
          const rDiskOut = 175; // Outer Accretion Disk Boundary
          const diskAspect = 0.31; // cos(inclination) ~ cos(72°)
          const tilt = -0.26 + viewTiltRef.current.tilt;
          const rot = viewTiltRef.current.rot;

          // 1. Relativistic Bipolar Jets (Microquasar Blandford-Znajek Outflow)
          ctx.save();
          const jetGlowUp = createSafeRadial(cx, cy - 80, 5, cx, cy - 80, 140);
          jetGlowUp.addColorStop(0, 'rgba(99, 102, 241, 0.28)');
          jetGlowUp.addColorStop(0.55, 'rgba(56, 189, 248, 0.08)');
          jetGlowUp.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = jetGlowUp;
          ctx.fillRect(cx - 70, 0, 140, cy);

          const jetGlowDn = createSafeRadial(cx, cy + 80, 5, cx, cy + 80, 140);
          jetGlowDn.addColorStop(0, 'rgba(99, 102, 241, 0.28)');
          jetGlowDn.addColorStop(0.55, 'rgba(56, 189, 248, 0.08)');
          jetGlowDn.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = jetGlowDn;
          ctx.fillRect(cx - 70, cy, 140, h - cy);

          // Helical magnetic field flux ropes wrapping the jet spine
          ctx.lineWidth = 1.3;
          for (let dir = -1; dir <= 1; dir += 2) {
            ctx.strokeStyle = dir === 1 ? 'rgba(129, 140, 248, 0.4)' : 'rgba(56, 189, 248, 0.35)';
            ctx.beginPath();
            for (let t = 20; t < 205; t += 4) {
              const helixAngle = t * 0.12 - timeSec * 4.5 * dir;
              const helixR = t * 0.065 + 2;
              const hx = cx + Math.cos(helixAngle) * helixR;
              const hy = cy - t * dir;
              if (t === 20) ctx.moveTo(hx, hy);
              else ctx.lineTo(hx, hy);
            }
            ctx.stroke();
          }

          // Ultra-relativistic jet core with traveling Mach diamond shock nodes
          for (const knot of jetKnots) {
            const currentDist = (knot.dist + timeSec * knot.speed) % 195 + 24;
            const jetY = cy - currentDist * knot.dir;
            const jetSpread = currentDist * 0.055;
            const jx = cx + Math.sin(timeSec * 3 + currentDist * 0.1) * jetSpread;

            ctx.fillStyle = knot.dir === 1 ? '#ffffff' : '#c7d2fe';
            ctx.shadowColor = '#818cf8';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(jx, jetY, knot.size * 0.9, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
          ctx.restore();

          // 2. Mass-Transfer Accretion Stream from Supergiant Companion (HDE 226868 Roche Lobe)
          ctx.save();
          const streamGrad = ctx.createLinearGradient(cx + 215, cy - 135, cx + 125, cy - 18);
          streamGrad.addColorStop(0, 'rgba(129, 140, 248, 0.75)');
          streamGrad.addColorStop(0.65, 'rgba(56, 189, 248, 0.9)');
          streamGrad.addColorStop(1, '#ffffff');
          ctx.strokeStyle = streamGrad;
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(cx + 215, cy - 135);
          ctx.quadraticCurveTo(cx + 175, cy - 55, cx + 128, cy - 18);
          ctx.stroke();

          // Supersonic impact shock hot spot at the outer disk edge
          const impactPulse = Math.sin(timeSec * 8) * 0.3 + 0.7;
          const impactGrad = createSafeRadial(cx + 128, cy - 18, 0, cx + 128, cy - 18, 15);
          impactGrad.addColorStop(0, `rgba(255, 255, 255, ${impactPulse.toFixed(3)})`);
          impactGrad.addColorStop(0.35, `rgba(56, 189, 248, ${(impactPulse * 0.85).toFixed(3)})`);
          impactGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = impactGrad;
          ctx.beginPath();
          ctx.arc(cx + 128, cy - 18, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // -------------------------------------------------------------------
          // 3. RELATIVISTIC GRAVITATIONAL LENSING: UPPER EINSTEIN CANOPY
          //    The back half of the accretion disk bent smoothly over the horizon
          // -------------------------------------------------------------------
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(tilt);

          // We render the upper lensed canopy across multiple radial temperature bands
          // from outer disk (rDiskOut) down to ISCO (rISCO)
          const canopyBands = 5;
          for (let b = canopyBands - 1; b >= 0; b--) {
            const r0 = rISCO + (b / canopyBands) * (rDiskOut - rISCO);
            const r1 = rISCO + ((b + 1) / canopyBands) * (rDiskOut - rISCO);

            // Gravitational ray deflection apex heights
            const h0 = rShadow * 1.05 + (r0 - rISCO) * 0.68;
            const h1 = rShadow * 1.05 + (r1 - rISCO) * 0.68;

            // Temperature / Doppler color gradient across the lensed band
            // Left side approaching (v ~ 0.4c): Doppler boosted by delta^4
            const bandGrad = ctx.createLinearGradient(-r1, 0, r1, 0);
            if (b === 0) {
              // Searing inner ISCO boundary layer (T ~ 10^7 K, soft X-ray / UV)
              bandGrad.addColorStop(0, '#ffffff'); // Blinding blueshift
              bandGrad.addColorStop(0.2, '#cffafe');
              bandGrad.addColorStop(0.42, '#38bdf8');
              bandGrad.addColorStop(0.7, '#6366f1');
              bandGrad.addColorStop(0.88, '#9f1239'); // Redshifted receding side
              bandGrad.addColorStop(1, 'rgba(159, 18, 57, 0.12)');
            } else if (b === 1 || b === 2) {
              // Mid-temperature gas (optical / extreme UV)
              bandGrad.addColorStop(0, '#e0f2fe');
              bandGrad.addColorStop(0.22, '#38bdf8');
              bandGrad.addColorStop(0.45, '#6366f1');
              bandGrad.addColorStop(0.75, '#4338ca');
              bandGrad.addColorStop(0.92, '#881337');
              bandGrad.addColorStop(1, 'rgba(136, 19, 55, 0.08)');
            } else {
              // Cooler outer accretion gas
              bandGrad.addColorStop(0, '#38bdf8');
              bandGrad.addColorStop(0.25, '#818cf8');
              bandGrad.addColorStop(0.5, '#4f46e5');
              bandGrad.addColorStop(0.8, '#312e81');
              bandGrad.addColorStop(0.95, '#4c0519');
              bandGrad.addColorStop(1, 'rgba(76, 5, 25, 0.04)');
            }

            ctx.fillStyle = bandGrad;
            ctx.beginPath();
            // Outer curve of band from left to right
            ctx.moveTo(-r1, 0);
            ctx.bezierCurveTo(-r1 * 0.7, -h1 * 1.08, r1 * 0.7, -h1 * 1.08, r1, 0);
            // Inner curve of band returning from right to left
            ctx.lineTo(r0, 0);
            ctx.bezierCurveTo(r0 * 0.7, -h0 * 1.08, -r0 * 0.7, -h0 * 1.08, -r0, 0);
            ctx.closePath();
            ctx.fill();
          }

          // Lensed caustic edge filaments on the upper arch (intense ray focusing)
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(-rISCO, 0);
          ctx.bezierCurveTo(-rISCO * 0.7, -rShadow * 1.15, rISCO * 0.7, -rShadow * 1.15, rISCO, 0);
          ctx.stroke();

          // -------------------------------------------------------------------
          // 4. RELATIVISTIC GRAVITATIONAL LENSING: LOWER EINSTEIN CRESCENT
          //    Underside of back disk bent below the event horizon shadow
          // -------------------------------------------------------------------
          const lowerH0 = rShadow * 1.06;
          const lowerH1 = rShadow * 1.06 + (rDiskOut - rISCO) * 0.22;
          const lowerGrad = ctx.createLinearGradient(-rDiskOut * 0.8, 0, rDiskOut * 0.8, 0);
          lowerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
          lowerGrad.addColorStop(0.25, 'rgba(103, 232, 249, 0.75)');
          lowerGrad.addColorStop(0.55, 'rgba(99, 102, 241, 0.45)');
          lowerGrad.addColorStop(0.85, 'rgba(159, 18, 57, 0.25)');
          lowerGrad.addColorStop(1, 'rgba(159, 18, 57, 0.04)');

          ctx.fillStyle = lowerGrad;
          ctx.beginPath();
          ctx.moveTo(-rDiskOut * 0.85, 0);
          ctx.bezierCurveTo(-rDiskOut * 0.55, lowerH1 * 1.1, rDiskOut * 0.55, lowerH1 * 1.1, rDiskOut * 0.85, 0);
          ctx.lineTo(rISCO * 1.15, 0);
          ctx.bezierCurveTo(rISCO * 0.65, lowerH0 * 1.1, -rISCO * 0.65, lowerH0 * 1.1, -rISCO * 1.15, 0);
          ctx.closePath();
          ctx.fill();

          // -------------------------------------------------------------------
          // 5. BACK HALF OF EQUATORIAL DISK (ANNULUS SEGMENT: y < 0)
          //    Leaves the central cavity inside ISCO completely clear!
          // -------------------------------------------------------------------
          ctx.save();
          ctx.scale(1, diskAspect);

          const backDiskGrad = ctx.createLinearGradient(-rDiskOut, 0, rDiskOut, 0);
          backDiskGrad.addColorStop(0, '#ffffff');
          backDiskGrad.addColorStop(0.2, '#67e8f9');
          backDiskGrad.addColorStop(0.42, '#38bdf8');
          backDiskGrad.addColorStop(0.68, '#4338ca');
          backDiskGrad.addColorStop(0.88, '#9f1239');
          backDiskGrad.addColorStop(1, 'rgba(63, 7, 19, 0.06)');

          ctx.fillStyle = backDiskGrad;
          ctx.beginPath();
          // Outer half-ellipse (y < 0) from -rDiskOut to +rDiskOut
          ctx.arc(0, 0, rDiskOut, Math.PI, 0, false);
          // Inner half-ellipse (y < 0) from +rISCO to -rISCO
          ctx.arc(0, 0, rISCO, 0, Math.PI, true);
          ctx.closePath();
          ctx.fill();

          // Concentric Keplerian differential shear rings (subtle density rings)
          ctx.lineWidth = 1.0;
          for (let sRing = 1; sRing <= 4; sRing++) {
            const rad = rISCO + sRing * ((rDiskOut - rISCO) / 5);
            ctx.strokeStyle = `rgba(103, 232, 249, ${(0.18 / sRing).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(0, 0, rad, Math.PI, 0, false);
            ctx.stroke();
          }
          ctx.restore();

          // -------------------------------------------------------------------
          // 6. SPIRAL DENSITY SHOCK WAVES (Two-armed accretion spirals)
          // -------------------------------------------------------------------
          ctx.save();
          ctx.scale(1, diskAspect);
          for (let arm = 0; arm < 2; arm++) {
            const armOffset = arm * Math.PI + timeSec * 1.4;
            ctx.strokeStyle = arm === 0 ? 'rgba(255, 255, 255, 0.35)' : 'rgba(56, 189, 248, 0.25)';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            for (let t = 0; t <= 30; t++) {
              const th = (t / 30) * Math.PI * 1.6 + armOffset;
              const rad = rISCO + (t / 30) * (rDiskOut - rISCO);
              const sx = Math.cos(th) * rad;
              const sy = Math.sin(th) * rad;
              if (sy < 2) {
                // Back half of spiral
                if (t === 0) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
              }
            }
            ctx.stroke();
          }
          ctx.restore();

          ctx.restore(); // Restore inclination frame

          // -------------------------------------------------------------------
          // 7. RELATIVISTIC PLUNGE REGION (Inside ISCO down to Horizon)
          //    Matter accelerating along geodesics into the singularity
          // -------------------------------------------------------------------
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(tilt);
          ctx.scale(1, diskAspect * 1.25);
          for (let sp = 0; sp < 8; sp++) {
            const streamAngle = (sp / 8) * Math.PI * 2 + timeSec * 3.8;
            ctx.beginPath();
            for (let st = 0; st <= 16; st++) {
              const prog = st / 16;
              const rad = rISCO * (1 - prog) + rShadow * prog;
              const th = streamAngle + prog * 1.8;
              const px = Math.cos(th) * rad;
              const py = Math.sin(th) * rad;

              // Gravitational redshift gradient: bright at ISCO, fading to red/black at shadow
              const pAlpha = (1 - prog) * 0.7;
              ctx.strokeStyle = `rgba(103, 232, 249, ${pAlpha.toFixed(3)})`;
              ctx.lineWidth = 1.4 * (1 - prog);

              if (st === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.stroke();
          }
          ctx.restore();

          // -------------------------------------------------------------------
          // 8. THE MULTI-ORDER PHOTON RINGS (n = 1, n = 2 Caustics)
          // -------------------------------------------------------------------
          ctx.save();
          // Secondary n=2 inner photon sub-ring (photons orbiting 360°)
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.arc(cx, cy, rShadow * 0.98, 0, Math.PI * 2);
          ctx.stroke();

          // Primary n=1 razor-sharp caustic ring (photons orbiting 180°)
          // Relativistic Doppler asymmetry: brighter on the approaching left side
          const photonRingGrad = createSafeRadial(cx - rShadow * 0.4, cy, rShadow * 0.5, cx, cy, rShadow * 1.05);
          photonRingGrad.addColorStop(0, '#ffffff');
          photonRingGrad.addColorStop(0.7, '#e0f2fe');
          photonRingGrad.addColorStop(1, 'rgba(56, 189, 248, 0.85)');

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.0;
          ctx.shadowColor = '#67e8f9';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(cx, cy, rShadow * 1.02, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.restore();

          // -------------------------------------------------------------------
          // 9. EVENT HORIZON PITCH-BLACK KERR SHADOW (The Abyss of Spacetime)
          // -------------------------------------------------------------------
          ctx.save();
          // Gravitational redshift edge halo (g_00 -> 0)
          const horizonRedshift = createSafeRadial(cx, cy, rShadow * 0.82, cx, cy, rShadow * 1.06);
          horizonRedshift.addColorStop(0, '#000000');
          horizonRedshift.addColorStop(0.82, 'rgba(159, 18, 57, 0.45)');
          horizonRedshift.addColorStop(0.96, 'rgba(56, 189, 248, 0.2)');
          horizonRedshift.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = horizonRedshift;
          ctx.beginPath();
          ctx.arc(cx, cy, rShadow * 1.06, 0, Math.PI * 2);
          ctx.fill();

          // Absolute black Kerr event horizon silhouette
          // Subtle frame-dragging asymmetry (slightly flattened on approaching left)
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.ellipse(cx - 1.5, cy, rShadow, rShadow * 0.98, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // -------------------------------------------------------------------
          // 10. FRONT HALF OF EQUATORIAL DISK (ANNULUS SEGMENT: y > 0)
          //     Slices cleanly across the lower horizon, with clear ISCO inner hole!
          // -------------------------------------------------------------------
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(tilt);
          ctx.scale(1, diskAspect);

          const frontDiskGrad = ctx.createLinearGradient(-rDiskOut, 0, rDiskOut, 0);
          frontDiskGrad.addColorStop(0, '#ffffff'); // Approaching blueshifted side
          frontDiskGrad.addColorStop(0.18, '#67e8f9');
          frontDiskGrad.addColorStop(0.38, '#38bdf8');
          frontDiskGrad.addColorStop(0.65, '#4338ca');
          frontDiskGrad.addColorStop(0.85, '#9f1239'); // Receding redshifted side
          frontDiskGrad.addColorStop(1, 'rgba(63, 7, 19, 0.08)');

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
          ctx.lineWidth = 3.6;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.arc(0, 0, rISCO, 0.1, Math.PI - 0.1);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Front spiral density shock waves
          for (let arm = 0; arm < 2; arm++) {
            const armOffset = arm * Math.PI + timeSec * 1.4;
            ctx.strokeStyle = arm === 0 ? 'rgba(255, 255, 255, 0.45)' : 'rgba(56, 189, 248, 0.35)';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            for (let t = 0; t <= 30; t++) {
              const th = (t / 30) * Math.PI * 1.6 + armOffset;
              const rad = rISCO + (t / 30) * (rDiskOut - rISCO);
              const sx = Math.cos(th) * rad;
              const sy = Math.sin(th) * rad;
              if (sy > -2) {
                // Front half of spiral
                if (t === 0) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
              }
            }
            ctx.stroke();
          }

          // Differential Keplerian disk particles
          for (const p of diskParticles) {
            const keplerSpeed = (p.speed * 28) / Math.sqrt(p.dist);
            const pAngle = p.angle + timeSec * keplerSpeed + rot;
            const px = Math.cos(pAngle) * p.dist;
            const py = Math.sin(pAngle) * p.dist;

            // Only draw particles in the front half (y > 0)
            if (py > 0 && p.dist >= rISCO * 0.95) {
              const isApproaching = Math.cos(pAngle) < 0; // Approaching left side
              // Relativistic Doppler beaming boost
              const dopplerBoost = isApproaching ? Math.min(1.0, p.alpha * 1.7) : p.alpha * 0.35;
              ctx.fillStyle = isApproaching
                ? `rgba(255, 255, 255, ${dopplerBoost.toFixed(3)})`
                : `rgba(244, 63, 94, ${dopplerBoost.toFixed(3)})`;
              ctx.beginPath();
              ctx.arc(px, py, p.size * (isApproaching ? 1.2 : 0.8), 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.restore();

          // Telemetry HUD
          const dopplerVal = (Math.sin(timeSec * 1.5) + 1) * 0.5;
          drawTelemetryHUD(
            w,
            h,
            'Stellar-Mass Black Hole (Cygnus X-1 / Kerr Metric)',
            'Event Horizon Radius',
            'r_s = 62.6 km • r_shadow = 86 km',
            'Doppler Factor (0.4c)',
            'δ = 4.2× (Relativistic Blueshift)',
            '#38bdf8',
            dopplerVal
          );
          break;
        }

        // =====================================================================
        // 8. SUPERMASSIVE BLACK HOLES (SMBH / Sagittarius A* EHT Relativistic Torus)
        // =====================================================================
        case 'supermassive-black-holes':
        default: {
          const rH = 36; // Event Horizon Radius
          const rShadow = 50; // Apparent EHT Shadow Silhouette (~ 1.39 rH)
          const rISCO = 66; // Inner boundary of thick RIAF / MAD torus
          const rDiskOut = 210; // Outer boundary of submillimeter synchrotron torus
          const diskAspect = 0.38; // Geometrically thick, puffed-up torus
          const tilt = -0.22 + viewTiltRef.current.tilt;
          const rot = viewTiltRef.current.rot;

          // 1. Relativistic Bipolar Plasma Outflow & Radio Lobes
          ctx.save();
          const smbhLobeUp = createSafeRadial(cx, cy - 90, 10, cx, cy - 90, 160);
          smbhLobeUp.addColorStop(0, 'rgba(251, 191, 36, 0.28)');
          smbhLobeUp.addColorStop(0.55, 'rgba(245, 158, 11, 0.1)');
          smbhLobeUp.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = smbhLobeUp;
          ctx.fillRect(cx - 90, 0, 180, cy);

          const smbhLobeDn = createSafeRadial(cx, cy + 90, 10, cx, cy + 90, 160);
          smbhLobeDn.addColorStop(0, 'rgba(251, 191, 36, 0.28)');
          smbhLobeDn.addColorStop(0.55, 'rgba(245, 158, 11, 0.1)');
          smbhLobeDn.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = smbhLobeDn;
          ctx.fillRect(cx - 90, cy, 180, h - cy);

          // Colossal relativistic synchrotron jet knots
          for (const knot of jetKnots) {
            const currentDist = (knot.dist + timeSec * (knot.speed * 1.5)) % 225 + 32;
            const jetY = cy - currentDist * knot.dir;
            const jetSpread = currentDist * 0.11;
            const jx = cx + Math.sin(currentDist * 0.08) * jetSpread;

            ctx.fillStyle = knot.dir === 1 ? '#fef08a' : '#f59e0b';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(jx, jetY, knot.size * 1.35, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
          ctx.restore();

          // -------------------------------------------------------------------
          // 2. GRAVITATIONAL LENSING: UPPER EINSTEIN CANOPY (Bent RIAF Torus)
          // -------------------------------------------------------------------
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(tilt);

          // Volumetric multi-band ray-deflected canopy
          const smbhBands = 5;
          for (let b = smbhBands - 1; b >= 0; b--) {
            const r0 = rISCO + (b / smbhBands) * (rDiskOut - rISCO);
            const r1 = rISCO + ((b + 1) / smbhBands) * (rDiskOut - rISCO);

            const h0 = rShadow * 1.05 + (r0 - rISCO) * 0.72;
            const h1 = rShadow * 1.05 + (r1 - rISCO) * 0.72;

            const bandGrad = ctx.createLinearGradient(-r1, 0, r1, 0);
            if (b === 0) {
              // Inner searing EHT synchrotron ring
              bandGrad.addColorStop(0, '#ffffff'); // Approaching incandescent peak
              bandGrad.addColorStop(0.2, '#fde047');
              bandGrad.addColorStop(0.45, '#f59e0b');
              bandGrad.addColorStop(0.72, '#b45309');
              bandGrad.addColorStop(0.88, '#7f1d1d');
              bandGrad.addColorStop(1, 'rgba(127, 29, 29, 0.12)');
            } else if (b === 1 || b === 2) {
              // Mid-torus hot magnetized plasma
              bandGrad.addColorStop(0, '#fef08a');
              bandGrad.addColorStop(0.22, '#fbbf24');
              bandGrad.addColorStop(0.48, '#d97706');
              bandGrad.addColorStop(0.75, '#9a3412');
              bandGrad.addColorStop(0.92, '#7f1d1d');
              bandGrad.addColorStop(1, 'rgba(127, 29, 29, 0.08)');
            } else {
              // Outer diffuse submillimeter boundary
              bandGrad.addColorStop(0, '#f59e0b');
              bandGrad.addColorStop(0.25, '#d97706');
              bandGrad.addColorStop(0.52, '#b45309');
              bandGrad.addColorStop(0.8, '#78350f');
              bandGrad.addColorStop(0.95, '#450a0a');
              bandGrad.addColorStop(1, 'rgba(69, 10, 10, 0.04)');
            }

            ctx.fillStyle = bandGrad;
            ctx.beginPath();
            ctx.moveTo(-r1, 0);
            ctx.bezierCurveTo(-r1 * 0.7, -h1 * 1.08, r1 * 0.7, -h1 * 1.08, r1, 0);
            ctx.lineTo(r0, 0);
            ctx.bezierCurveTo(r0 * 0.7, -h0 * 1.08, -r0 * 0.7, -h0 * 1.08, -r0, 0);
            ctx.closePath();
            ctx.fill();
          }

          // Lensed caustic edge highlight on upper canopy
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(-rISCO, 0);
          ctx.bezierCurveTo(-rISCO * 0.7, -rShadow * 1.15, rISCO * 0.7, -rShadow * 1.15, rISCO, 0);
          ctx.stroke();

          // -------------------------------------------------------------------
          // 3. GRAVITATIONAL LENSING: LOWER EINSTEIN CRESCENT
          // -------------------------------------------------------------------
          const lowerH0 = rShadow * 1.06;
          const lowerH1 = rShadow * 1.06 + (rDiskOut - rISCO) * 0.24;
          const lowerGrad = ctx.createLinearGradient(-rDiskOut * 0.85, 0, rDiskOut * 0.85, 0);
          lowerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          lowerGrad.addColorStop(0.25, 'rgba(253, 224, 71, 0.75)');
          lowerGrad.addColorStop(0.55, 'rgba(217, 119, 6, 0.45)');
          lowerGrad.addColorStop(0.85, 'rgba(127, 29, 29, 0.22)');
          lowerGrad.addColorStop(1, 'rgba(127, 29, 29, 0.04)');

          ctx.fillStyle = lowerGrad;
          ctx.beginPath();
          ctx.moveTo(-rDiskOut * 0.85, 0);
          ctx.bezierCurveTo(-rDiskOut * 0.55, lowerH1 * 1.1, rDiskOut * 0.55, lowerH1 * 1.1, rDiskOut * 0.85, 0);
          ctx.lineTo(rISCO * 1.15, 0);
          ctx.bezierCurveTo(rISCO * 0.65, lowerH0 * 1.1, -rISCO * 0.65, lowerH0 * 1.1, -rISCO * 1.15, 0);
          ctx.closePath();
          ctx.fill();

          // -------------------------------------------------------------------
          // 4. BACK HALF OF THICK MAGNETIZED TORUS (y < 0 ANNULUS)
          //    Leaves center cavity completely open!
          // -------------------------------------------------------------------
          ctx.save();
          ctx.scale(1, diskAspect);

          const backTorusGrad = ctx.createLinearGradient(-rDiskOut, 0, rDiskOut, 0);
          backTorusGrad.addColorStop(0, '#ffffff');
          backTorusGrad.addColorStop(0.2, '#fde047');
          backTorusGrad.addColorStop(0.45, '#f59e0b');
          backTorusGrad.addColorStop(0.72, '#b45309');
          backTorusGrad.addColorStop(0.88, '#7f1d1d');
          backTorusGrad.addColorStop(1, 'rgba(127, 29, 29, 0.06)');

          ctx.fillStyle = backTorusGrad;
          ctx.beginPath();
          ctx.arc(0, 0, rDiskOut, Math.PI, 0, false);
          ctx.arc(0, 0, rISCO, 0, Math.PI, true);
          ctx.closePath();
          ctx.fill();

          // Concentric magnetic flux rings
          ctx.lineWidth = 1.0;
          for (let mRing = 1; mRing <= 4; mRing++) {
            const rad = rISCO + mRing * ((rDiskOut - rISCO) / 5);
            ctx.strokeStyle = `rgba(253, 224, 71, ${(0.22 / mRing).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(0, 0, rad, Math.PI, 0, false);
            ctx.stroke();
          }
          ctx.restore();

          // Spiral magnetized shock filaments
          ctx.save();
          ctx.scale(1, diskAspect);
          for (let arm = 0; arm < 2; arm++) {
            const armOffset = arm * Math.PI + timeSec * 1.2;
            ctx.strokeStyle = arm === 0 ? 'rgba(254, 240, 138, 0.38)' : 'rgba(245, 158, 11, 0.28)';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            for (let t = 0; t <= 30; t++) {
              const th = (t / 30) * Math.PI * 1.5 + armOffset;
              const rad = rISCO + (t / 30) * (rDiskOut - rISCO);
              const sx = Math.cos(th) * rad;
              const sy = Math.sin(th) * rad;
              if (sy < 2) {
                if (t === 0) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
              }
            }
            ctx.stroke();
          }
          ctx.restore();

          ctx.restore(); // Restore inclination frame

          // -------------------------------------------------------------------
          // 5. RELATIVISTIC PLUNGE REGION (Inside ISCO down to Horizon)
          // -------------------------------------------------------------------
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(tilt);
          ctx.scale(1, diskAspect * 1.25);
          for (let sp = 0; sp < 8; sp++) {
            const streamAngle = (sp / 8) * Math.PI * 2 + timeSec * 3.2;
            ctx.beginPath();
            for (let st = 0; st <= 16; st++) {
              const prog = st / 16;
              const rad = rISCO * (1 - prog) + rShadow * prog;
              const th = streamAngle + prog * 1.6;
              const px = Math.cos(th) * rad;
              const py = Math.sin(th) * rad;

              const pAlpha = (1 - prog) * 0.75;
              ctx.strokeStyle = `rgba(253, 224, 71, ${pAlpha.toFixed(3)})`;
              ctx.lineWidth = 1.5 * (1 - prog);

              if (st === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.stroke();
          }
          ctx.restore();

          // -------------------------------------------------------------------
          // 6. EHT (EVENT HORIZON TELESCOPE) 3-PEAK EMISSION CRESCENT
          // -------------------------------------------------------------------
          ctx.save();
          ctx.translate(cx, cy);
          for (let k = 0; k < 3; k++) {
            const peakAngle = Math.PI * 0.58 + k * 0.42 + Math.sin(timeSec * 0.8 + k) * 0.12 + rot;
            const peakR = rShadow * 1.15;
            const px = Math.cos(peakAngle) * peakR;
            const py = Math.sin(peakAngle) * peakR * 0.9;

            const peakGrad = createSafeRadial(px, py, 0, px, py, 26);
            peakGrad.addColorStop(0, '#ffffff');
            peakGrad.addColorStop(0.35, '#fde047');
            peakGrad.addColorStop(0.68, 'rgba(245, 158, 11, 0.85)');
            peakGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
            ctx.fillStyle = peakGrad;
            ctx.beginPath();
            ctx.arc(px, py, 26, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // -------------------------------------------------------------------
          // 7. SPIRAL MAGNETIC POLARIZATION VECTORS (EHT 2024 Discovery)
          // -------------------------------------------------------------------
          ctx.save();
          ctx.translate(cx, cy);
          ctx.lineWidth = 1.3;
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
          for (let ring = 0; ring < 3; ring++) {
            const ringR = rShadow * 1.08 + ring * 14;
            for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
              const streamAngle = a + timeSec * (0.75 - ring * 0.15) + rot;
              const sx = Math.cos(streamAngle) * ringR;
              const sy = Math.sin(streamAngle) * ringR * 0.9;

              const tickLength = 7.5;
              const pitchAngle = streamAngle + Math.PI * 0.35; // 35° magnetic pitch
              ctx.beginPath();
              ctx.moveTo(sx - Math.cos(pitchAngle) * tickLength, sy - Math.sin(pitchAngle) * tickLength);
              ctx.lineTo(sx + Math.cos(pitchAngle) * tickLength, sy + Math.sin(pitchAngle) * tickLength);
              ctx.stroke();
            }
          }
          ctx.restore();

          // -------------------------------------------------------------------
          // 8. RELATIVISTIC ORBITING FLARE HOT SPOT (GRAVITY Instrument)
          // -------------------------------------------------------------------
          const flareOrbitSpeed = 1.5;
          const flareAngle = timeSec * flareOrbitSpeed + rot;
          const flareR = rShadow * 1.35;
          const fx = cx + Math.cos(flareAngle) * flareR;
          const fy = cy + Math.sin(flareAngle) * flareR * diskAspect - 4;
          const flareApproaching = Math.cos(flareAngle) < 0;

          ctx.save();
          const flareIntensity = flareApproaching ? 1.0 : 0.32;
          const flareGrad = createSafeRadial(fx, fy, 0, fx, fy, 18);
          flareGrad.addColorStop(0, `rgba(255, 255, 255, ${flareIntensity.toFixed(3)})`);
          flareGrad.addColorStop(0.35, `rgba(253, 224, 71, ${(flareIntensity * 0.9).toFixed(3)})`);
          flareGrad.addColorStop(0.7, `rgba(245, 158, 11, ${(flareIntensity * 0.5).toFixed(3)})`);
          flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = flareGrad;
          ctx.beginPath();
          ctx.arc(fx, fy, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // -------------------------------------------------------------------
          // 9. THE EHT MULTI-ORDER PHOTON RINGS (n = 1, n = 2 Caustics)
          // -------------------------------------------------------------------
          ctx.save();
          // Secondary n=2 inner sub-ring
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.55)';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(cx, cy, rShadow * 0.98, 0, Math.PI * 2);
          ctx.stroke();

          // Primary n=1 razor-sharp caustic ring
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.4;
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 22;
          ctx.beginPath();
          ctx.arc(cx, cy, rShadow * 1.02, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.restore();

          // -------------------------------------------------------------------
          // 10. EVENT HORIZON PITCH-BLACK SHADOW (Sagittarius A* EHT Silhouette)
          // -------------------------------------------------------------------
          ctx.save();
          // Steep gravitational redshift boundary sheath
          const horizonRedshift = createSafeRadial(cx, cy, rShadow * 0.84, cx, cy, rShadow * 1.06);
          horizonRedshift.addColorStop(0, '#000000');
          horizonRedshift.addColorStop(0.8, 'rgba(127, 29, 29, 0.5)');
          horizonRedshift.addColorStop(0.95, 'rgba(245, 158, 11, 0.25)');
          horizonRedshift.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = horizonRedshift;
          ctx.beginPath();
          ctx.arc(cx, cy, rShadow * 1.06, 0, Math.PI * 2);
          ctx.fill();

          // Absolute black Kerr event horizon silhouette
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.ellipse(cx - 2.0, cy, rShadow, rShadow * 0.98, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // -------------------------------------------------------------------
          // 11. FRONT HALF OF MAGNETIZED TORUS (ANNULUS: y > 0)
          // -------------------------------------------------------------------
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(tilt);
          ctx.scale(1, diskAspect);

          const frontTorusGrad = ctx.createLinearGradient(-rDiskOut, 0, rDiskOut, 0);
          frontTorusGrad.addColorStop(0, '#ffffff'); // Approaching incandescent side
          frontTorusGrad.addColorStop(0.18, '#fde047');
          frontTorusGrad.addColorStop(0.42, '#f59e0b');
          frontTorusGrad.addColorStop(0.72, '#b45309');
          frontTorusGrad.addColorStop(0.88, '#7f1d1d');
          frontTorusGrad.addColorStop(1, 'rgba(127, 29, 29, 0.08)');

          ctx.fillStyle = frontTorusGrad;
          ctx.beginPath();
          ctx.arc(0, 0, rDiskOut, 0, Math.PI, false);
          ctx.arc(0, 0, rISCO, Math.PI, 0, true);
          ctx.closePath();
          ctx.fill();

          // Searing ISCO inner boundary ring
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3.8;
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(0, 0, rISCO, 0.1, Math.PI - 0.1);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Front spiral magnetized shock filaments
          for (let arm = 0; arm < 2; arm++) {
            const armOffset = arm * Math.PI + timeSec * 1.2;
            ctx.strokeStyle = arm === 0 ? 'rgba(254, 240, 138, 0.45)' : 'rgba(245, 158, 11, 0.35)';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            for (let t = 0; t <= 30; t++) {
              const th = (t / 30) * Math.PI * 1.5 + armOffset;
              const rad = rISCO + (t / 30) * (rDiskOut - rISCO);
              const sx = Math.cos(th) * rad;
              const sy = Math.sin(th) * rad;
              if (sy > -2) {
                if (t === 0) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
              }
            }
            ctx.stroke();
          }

          // Keplerian torus particles
          for (const p of diskParticles) {
            const keplerSpeed = (p.speed * 24) / Math.sqrt(p.dist);
            const pAngle = p.angle + timeSec * keplerSpeed + rot;
            const px = Math.cos(pAngle) * (p.dist * 1.15);
            const py = Math.sin(pAngle) * (p.dist * 1.15);

            if (py > 0 && p.dist * 1.15 >= rISCO * 0.95) {
              const isApproaching = Math.cos(pAngle) < 0;
              const dopplerBoost = isApproaching ? Math.min(1.0, p.alpha * 1.7) : p.alpha * 0.35;
              ctx.fillStyle = isApproaching
                ? `rgba(255, 255, 255, ${dopplerBoost.toFixed(3)})`
                : `rgba(245, 158, 11, ${dopplerBoost.toFixed(3)})`;
              ctx.beginPath();
              ctx.arc(px, py, p.size * (isApproaching ? 1.3 : 0.8), 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.restore();

          // Telemetry HUD
          drawTelemetryHUD(
            w,
            h,
            'Supermassive Black Hole (Sagittarius A* EHT)',
            'Horizon Diameter',
            '24.5 Million km (4.15M M☉)',
            'EHT Angular Resolution',
            'θ = 51.8 µas • a* = 0.90',
            '#f59e0b',
            0.95
          );
          break;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [remnantId, primaryHex, coronaHex]);

  // Interactive mouse / touch tracking handlers for 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    mouseRef.current = { x, y, active: true };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));
    mouseRef.current = { x, y, active: true };
  };

  const handleTouchEnd = () => {
    mouseRef.current.active = false;
  };

  const isBlackHole = remnantId === 'stellar-black-holes' || remnantId === 'supermassive-black-holes';

  return (
    <div
      className={`w-full aspect-square relative bg-[#02040e] overflow-hidden select-none cursor-grab active:cursor-grabbing ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Interactive 3D Lensing Badge for Black Holes */}
      {isBlackHole && (
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/85 border border-cyan-500/35 text-[9px] sm:text-[10px] font-mono text-cyan-300 shadow-lg backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Interactive GR Lensing (Hover / Drag to Tilt)</span>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="w-full h-full object-contain block"
      />
    </div>
  );
};
