import React, { useEffect, useRef } from 'react';

interface AnimatedStarrySkyPanelProps {
  children: React.ReactNode;
  className?: string;
}

interface Star {
  xRatio: number;
  yRatio: number;
  radius: number;
  color: string;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  hasSpikes?: boolean;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
}

export const AnimatedStarrySkyPanel: React.FC<AnimatedStarrySkyPanelProps> = ({
  children,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Handle high DPI display
    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(canvas);

    // Generate static stars
    const starColors = ['#ffffff', '#ffffff', '#bae6fd', '#67e8f9', '#fef08a', '#fde68a', '#fca5a5'];
    const starCount = 85;
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        xRatio: Math.random(),
        yRatio: Math.random() * 0.9, // Keep above the bottom ridge
        radius: Math.random() * 1.5 + 0.6,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        baseAlpha: Math.random() * 0.45 + 0.35,
        twinkleSpeed: Math.random() * 0.003 + 0.0015,
        twinklePhase: Math.random() * Math.PI * 2,
        hasSpikes: i < 5, // Top 5 stars have subtle diffraction spikes
      });
    }

    // Benchmark Stars (e.g., Polaris, Vega, Betelgeuse archetypes)
    const benchmarkStars: Star[] = [
      {
        xRatio: 0.78,
        yRatio: 0.22,
        radius: 2.8,
        color: '#67e8f9',
        baseAlpha: 0.85,
        twinkleSpeed: 0.002,
        twinklePhase: 0.5,
        hasSpikes: true,
      },
      {
        xRatio: 0.58,
        yRatio: 0.28,
        radius: 2.4,
        color: '#fde047',
        baseAlpha: 0.8,
        twinkleSpeed: 0.0025,
        twinklePhase: 1.8,
        hasSpikes: true,
      },
      {
        xRatio: 0.92,
        yRatio: 0.45,
        radius: 2.2,
        color: '#f87171',
        baseAlpha: 0.75,
        twinkleSpeed: 0.0018,
        twinklePhase: 3.1,
        hasSpikes: true,
      },
    ];

    // Constellation asterisms (Ursa Major / Big Dipper) normalized coordinates
    const bigDipperNodes = [
      { x: 0.52, y: 0.22 },
      { x: 0.57, y: 0.18 },
      { x: 0.63, y: 0.25 },
      { x: 0.68, y: 0.27 },
      { x: 0.72, y: 0.42 },
      { x: 0.78, y: 0.40 },
      { x: 0.75, y: 0.27 },
    ];

    // Meteors
    const meteors: Meteor[] = [];
    let lastMeteorTime = performance.now();
    let meteorInterval = 3200 + Math.random() * 3000;

    const spawnMeteor = () => {
      const angle = (Math.PI / 180) * (25 + Math.random() * 20); // 25 - 45 degrees downward
      meteors.push({
        x: Math.random() * (width * 0.6) + width * 0.1,
        y: Math.random() * (height * 0.3),
        length: 60 + Math.random() * 50,
        speed: 7 + Math.random() * 5,
        angle,
        alpha: 1,
        active: true,
      });
    };

    let startTime = performance.now();

    // Safe radial gradient helper
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

    const render = (now: number) => {
      if (!width || !height || width <= 0 || height <= 0 || !Number.isFinite(width) || !Number.isFinite(height)) {
        return;
      }
      const elapsed = now - startTime;

      ctx.clearRect(0, 0, width, height);

      // 1. Deep Midnight Cosmic Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#010410');
      skyGrad.addColorStop(0.4, '#040d28');
      skyGrad.addColorStop(0.85, '#07163d');
      skyGrad.addColorStop(1, '#020617');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Breathing Nebular Washes
      const nebulaBreath = Math.sin(elapsed * 0.0008) * 0.04;
      
      // Nebular Cloud 1 (Cyan/Teal, right half)
      const neb1 = createSafeRadialGradient(
        width * 0.7,
        height * 0.35,
        10,
        width * 0.7,
        height * 0.35,
        width * 0.4
      );
      neb1.addColorStop(0, `rgba(6, 182, 212, ${0.16 + nebulaBreath})`);
      neb1.addColorStop(0.5, `rgba(59, 130, 246, ${0.08 + nebulaBreath * 0.5})`);
      neb1.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, width, height);

      // Nebular Cloud 2 (Purple/Indigo, top right)
      const neb2 = createSafeRadialGradient(
        width * 0.88,
        height * 0.25,
        5,
        width * 0.88,
        height * 0.25,
        width * 0.3
      );
      neb2.addColorStop(0, `rgba(168, 85, 247, ${0.13 + nebulaBreath * 0.8})`);
      neb2.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, width, height);

      // 3. Faint Constellation Lines (Big Dipper)
      ctx.beginPath();
      for (let i = 0; i < bigDipperNodes.length; i++) {
        const nx = bigDipperNodes[i].x * width;
        const ny = bigDipperNodes[i].y * height;
        if (i === 0) ctx.moveTo(nx, ny);
        else ctx.lineTo(nx, ny);
      }
      // Close box of the Dipper
      ctx.lineTo(bigDipperNodes[3].x * width, bigDipperNodes[3].y * height);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 0.75;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Render Stars with Twinkling
      const allStars = [...stars, ...benchmarkStars];
      for (let i = 0; i < allStars.length; i++) {
        const star = allStars[i];
        const sx = star.xRatio * width;
        const sy = star.yRatio * height;

        // Twinkle factor using smooth sine curve
        const twinkle = Math.sin(elapsed * star.twinkleSpeed + star.twinklePhase);
        const currentAlpha = Math.max(0.15, Math.min(1, star.baseAlpha + twinkle * 0.35));

        // Outer glow for brighter stars
        if (star.radius > 1.6) {
          const glow = createSafeRadialGradient(sx, sy, 0, sx, sy, star.radius * 3.5);
          glow.addColorStop(0, star.color);
          glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.globalAlpha = currentAlpha * 0.4;
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(sx, sy, star.radius * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Star core
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // 4-Point Diffraction Cross Spikes for benchmark stars
        if (star.hasSpikes && currentAlpha > 0.4) {
          const spikeLen = star.radius * 3.5;
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.75;
          ctx.globalAlpha = currentAlpha * 0.75;

          ctx.beginPath();
          ctx.moveTo(sx - spikeLen, sy);
          ctx.lineTo(sx + spikeLen, sy);
          ctx.moveTo(sx, sy - spikeLen);
          ctx.lineTo(sx, sy + spikeLen);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;

      // 5. Meteors (Shooting Stars)
      if (now - lastMeteorTime > meteorInterval) {
        spawnMeteor();
        lastMeteorTime = now;
        meteorInterval = 3500 + Math.random() * 4000;
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        if (!m.active) {
          meteors.splice(i, 1);
          continue;
        }

        const headX = m.x;
        const headY = m.y;
        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const mGrad = ctx.createLinearGradient(tailX, tailY, headX, headY);
        mGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        mGrad.addColorStop(0.7, `rgba(56, 189, 248, ${m.alpha * 0.6})`);
        mGrad.addColorStop(1, `rgba(255, 255, 255, ${m.alpha})`);

        ctx.strokeStyle = mGrad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.stroke();

        // Move meteor
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha -= 0.02;

        if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
          m.active = false;
        }
      }

      // 6. Observatory Mountain Ridge Silhouette at Bottom
      const ridgeY = height - 28;
      ctx.fillStyle = '#01040d';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, ridgeY + 8);
      ctx.quadraticCurveTo(width * 0.25, ridgeY - 6, width * 0.5, ridgeY + 4);
      ctx.quadraticCurveTo(width * 0.75, ridgeY - 14, width, ridgeY - 2);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Observatory Dome Silhouette on the Ridge (placed around x = 85% width)
      const domeX = width * 0.85;
      const domeY = ridgeY - 10;
      if (width > 350) {
        ctx.fillStyle = '#040a1c';
        ctx.strokeStyle = '#0e244d';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(domeX, domeY, 11, Math.PI, 0, false);
        ctx.rect(domeX - 11, domeY, 22, 10);
        ctx.fill();
        ctx.stroke();

        // Slit illumination
        ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.fillRect(domeX - 1, domeY - 10, 2, 12);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={`relative rounded-2xl border border-cyan-500/30 overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.65)] p-5 sm:p-7 lg:p-8 bg-[#020515] ${className}`}
    >
      {/* Animated Starry Night Sky Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 block"
        aria-hidden="true"
      />

      {/* Atmospheric Vignette: Deepens the text region for pristine contrast & readability */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#020515]/95 via-[#020515]/75 to-[#020515]/20 pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Foreground Content (Title, Description, and Icons) */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
