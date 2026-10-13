import React, { useEffect, useRef } from 'react';
import { StarData } from '../types';

interface VariableStarGraphicProps {
  variableId: string;
  archetypeStar?: StarData | null;
  colorHex?: string;
  className?: string;
}

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
    let startTime = performance.now();

    const baseRgb = hexToRgb(primaryHex);
    const coronaRgb = hexToRgb(coronaHex);

    // Deep field starry background
    const bgStars: { x: number; y: number; r: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 60; i++) {
      bgStars.push({
        x: Math.random() * 500,
        y: Math.random() * 500,
        r: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 1.5 + 0.4,
      });
    }

    const render = (time: number) => {
      const elapsed = (time - startTime) * 0.001;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Deep space gradient
      const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, width * 0.75);
      bgGrad.addColorStop(0, '#040816');
      bgGrad.addColorStop(1, '#010207');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Starfield
      ctx.fillStyle = '#ffffff';
      bgStars.forEach((st) => {
        const twinkle = Math.sin(elapsed * st.speed + st.x) * 0.3 + 0.7;
        ctx.globalAlpha = st.alpha * twinkle;
        ctx.beginPath();
        ctx.arc((st.x / 500) * width, (st.y / 500) * height, st.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Variable type animation logic
      if (variableId === 'cepheid-variables' || variableId === 'rr-lyrae-variables') {
        // Pulsating star: Radial expansion and contraction with asymmetric light pulse
        const phase = (elapsed * 0.9) % 1.0;
        // Asymmetric rise & fall
        const pulsation = phase < 0.25 ? Math.sin((phase / 0.25) * Math.PI * 0.5) : Math.cos(((phase - 0.25) / 0.75) * Math.PI * 0.5);
        const radius = cx * 0.32 + pulsation * 14;

        // Outer coronal expansion wave
        const coronaGrad = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.8);
        coronaGrad.addColorStop(0, `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, ${0.45 + pulsation * 0.35})`);
        coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coronaGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Pulsating photosphere
        const photoGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        photoGrad.addColorStop(0, '#ffffff');
        photoGrad.addColorStop(0.65, `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 1)`);
        photoGrad.addColorStop(1, `rgba(${Math.round(baseRgb.r * 0.7)}, ${Math.round(baseRgb.g * 0.7)}, ${Math.round(baseRgb.b * 0.7)}, 1)`);
        ctx.fillStyle = photoGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Light curve mini HUD at bottom
        renderLightCurveHUD(ctx, width, height, phase, pulsation, 'Radial Cepheid Pulsation');
      } else if (variableId === 'eclipsing-binaries') {
        // Orbiting twin stars mutually eclipsing
        const orbAngle = elapsed * 1.2;
        const orbitRadius = cx * 0.45;
        const star1X = cx + Math.cos(orbAngle) * orbitRadius;
        const star1Y = cy;
        const star2X = cx - Math.cos(orbAngle) * orbitRadius;
        const star2Y = cy;
        const z1 = Math.sin(orbAngle);
        const z2 = -Math.sin(orbAngle);

        const r1 = cx * 0.24;
        const r2 = cx * 0.18;

        const drawStar = (x: number, y: number, r: number, color: { r: number; g: number; b: number }) => {
          const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.6, `rgba(${color.r}, ${color.g}, ${color.b}, 1)`);
          grad.addColorStop(1, `rgba(${Math.round(color.r * 0.5)}, ${Math.round(color.g * 0.5)}, ${Math.round(color.b * 0.5)}, 0.8)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        };

        if (z1 < z2) {
          drawStar(star1X, star1Y, r1, baseRgb);
          drawStar(star2X, star2Y, r2, { r: 245, g: 158, b: 11 });
        } else {
          drawStar(star2X, star2Y, r2, { r: 245, g: 158, b: 11 });
          drawStar(star1X, star1Y, r1, baseRgb);
        }

        const eclipseDip = Math.abs(Math.cos(orbAngle)) < 0.25 ? 0.35 : 1.0;
        renderLightCurveHUD(ctx, width, height, (orbAngle / (Math.PI * 2)) % 1, eclipseDip, 'Geometric Binary Eclipse');
      } else if (variableId === 'rotational-variables') {
        // Rotating star with active starspots
        const radius = cx * 0.38;
        const rotAngle = elapsed * 1.4;

        const photoGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        photoGrad.addColorStop(0, '#ffffff');
        photoGrad.addColorStop(0.65, `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 1)`);
        photoGrad.addColorStop(1, `rgba(${Math.round(baseRgb.r * 0.5)}, ${Math.round(baseRgb.g * 0.5)}, ${Math.round(baseRgb.b * 0.5)}, 1)`);
        ctx.fillStyle = photoGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Starspots tracking across disk
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.clip();

        for (let i = 0; i < 3; i++) {
          const offset = i * (Math.PI / 1.5);
          const spotX = cx + Math.sin(rotAngle + offset) * radius * 0.85;
          const spotZ = Math.cos(rotAngle + offset);
          if (spotZ > 0) {
            ctx.fillStyle = 'rgba(20, 10, 5, 0.85)';
            ctx.beginPath();
            ctx.ellipse(spotX, cy + (i - 1) * 16, 14 * spotZ, 12, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();

        const modVal = Math.sin(rotAngle) * 0.15 + 0.85;
        renderLightCurveHUD(ctx, width, height, (rotAngle / (Math.PI * 2)) % 1, modVal, 'Starspot Rotational Modulation');
      } else {
        // Default / Cataclysmic / Eruptive / Mira: Explosive or deep pulsating flare
        const pulse = Math.sin(elapsed * 2.2) * 0.5 + 0.5;
        const radius = cx * 0.36;

        // Eruptive flare jets
        ctx.save();
        ctx.translate(cx, cy);
        for (let i = 0; i < 6; i++) {
          const ang = (i / 6) * Math.PI * 2 + elapsed * 0.4;
          const len = radius * (1.2 + pulse * 0.6);
          const flareGrad = ctx.createLinearGradient(0, 0, Math.cos(ang) * len, Math.sin(ang) * len);
          flareGrad.addColorStop(0, `rgba(${coronaRgb.r}, ${coronaRgb.g}, ${coronaRgb.b}, 0.8)`);
          flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.strokeStyle = flareGrad;
          ctx.lineWidth = 6 + pulse * 4;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(ang) * len, Math.sin(ang) * len);
          ctx.stroke();
        }
        ctx.restore();

        // Photosphere
        const photoGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        photoGrad.addColorStop(0, '#ffffff');
        photoGrad.addColorStop(0.7, `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 1)`);
        photoGrad.addColorStop(1, `rgba(${Math.round(baseRgb.r * 0.6)}, ${Math.round(baseRgb.g * 0.6)}, ${Math.round(baseRgb.b * 0.6)}, 1)`);
        ctx.fillStyle = photoGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        renderLightCurveHUD(ctx, width, height, (elapsed * 0.5) % 1, pulse, 'Thermonuclear Flare Activity');
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
        className="w-full h-full block rounded-2xl"
      />
    </div>
  );
};

function renderLightCurveHUD(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: number,
  amplitude: number,
  label: string
) {
  const hudH = 50;
  const hudY = height - hudH - 12;
  const hudX = 14;
  const hudW = width - 28;

  ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(hudX, hudY, hudW, hudH, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '10px monospace';
  ctx.fillText(label, hudX + 10, hudY + 16);

  // Wave line
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 0; x < hudW - 20; x++) {
    const wavePhase = (x / (hudW - 20) + phase) * Math.PI * 2;
    const y = hudY + 32 + Math.sin(wavePhase) * 10;
    if (x === 0) ctx.moveTo(hudX + 10 + x, y);
    else ctx.lineTo(hudX + 10 + x, y);
  }
  ctx.stroke();
}
