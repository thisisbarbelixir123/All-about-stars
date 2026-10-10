import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Flame,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Info,
  Layers,
  Atom,
  Activity,
  Gauge,
  Sparkles,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { FusionMechanism, FUSION_MECHANISMS } from '../data/whatIsAStarData';

interface ThermonuclearEngineVisualizerProps {
  selectedFusionId: string;
  onSelectFusionId?: (id: string) => void;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'proton' | 'neutron' | 'positron' | 'neutrino' | 'photon' | 'alpha' | 'catalyst';
  color: string;
  glowColor: string;
  label?: string;
  life?: number;
  maxLife?: number;
  alpha?: number;
  trail?: { x: number; y: number }[];
  pulsePhase?: number;
  isFormedProduct?: boolean;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  text?: string;
}

interface FloatingLabel {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}

export const ThermonuclearEngineVisualizer: React.FC<ThermonuclearEngineVisualizerProps> = ({
  selectedFusionId,
  onSelectFusionId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Playback & simulation state - default to calm, gentle speed (0.75x) for clarity
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(0.75);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [autoAdvanceSteps, setAutoAdvanceSteps] = useState<boolean>(true);
  const [coreTempMK, setCoreTempMK] = useState<number>(() => {
    if (selectedFusionId === 'pp-chain') return 15;
    if (selectedFusionId === 'cno-cycle') return 25;
    return 200;
  });
  const [showParticleLabels, setShowParticleLabels] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<'simulation' | 'tunneling' | 'onion' | 'binding'>(
    'simulation'
  );

  // Statistics counters
  const [reactionsCompleted, setReactionsCompleted] = useState<number>(0);
  const [totalEnergyMeV, setTotalEnergyMeV] = useState<number>(0);
  const [positronsEmitted, setPositronsEmitted] = useState<number>(0);
  const [neutrinosEmitted, setNeutrinosEmitted] = useState<number>(0);
  const [photonsEmitted, setPhotonsEmitted] = useState<number>(0);

  // Sync core temp when fusion mechanism changes
  useEffect(() => {
    if (selectedFusionId === 'pp-chain') {
      setCoreTempMK(15);
      setActiveStepIndex(0);
    } else if (selectedFusionId === 'cno-cycle') {
      setCoreTempMK(25);
      setActiveStepIndex(0);
    } else {
      setCoreTempMK(200);
      setActiveStepIndex(0);
    }
  }, [selectedFusionId]);

  // Current fusion details
  const activeFusion: FusionMechanism = useMemo(() => {
    return FUSION_MECHANISMS.find((f) => f.id === selectedFusionId) || FUSION_MECHANISMS[0];
  }, [selectedFusionId]);

  // Simulation physics state refs
  const particlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const floatingLabelsRef = useRef<FloatingLabel[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const stepTimerRef = useRef<number>(0);
  const stepStageRef = useRef<number>(0); // 0: approach, 1: fuse/settle, 2: complete
  const cnoAngleRef = useRef<number>(0);
  const cnoCycleStageRef = useRef<number>(0);

  // Reset simulation particles for current mechanism and step
  const initSimulation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const cx = w / 2;
    const cy = h / 2;

    particlesRef.current = [];
    shockwavesRef.current = [];
    floatingLabelsRef.current = [];
    stepTimerRef.current = 0;
    stepStageRef.current = 0;

    // Scale distances responsively based on canvas dimensions
    const isSmall = w < 480;
    const approachDist = isSmall ? 80 : 120;
    const pRadius = isSmall ? 11 : 14;

    if (selectedFusionId === 'pp-chain') {
      if (activeStepIndex === 0) {
        // Step 1: Two incoming protons fusing to Deuteron + e+ + v
        particlesRef.current = [
          {
            id: 'p1',
            x: cx - approachDist,
            y: cy,
            vx: 30, // px per second, scaled with dt
            vy: 0,
            radius: pRadius,
            type: 'proton',
            color: '#ef4444',
            glowColor: 'rgba(239, 68, 68, 0.6)',
            label: 'p⁺ (¹H)',
            trail: [],
          },
          {
            id: 'p2',
            x: cx + approachDist,
            y: cy,
            vx: -30,
            vy: 0,
            radius: pRadius,
            type: 'proton',
            color: '#ef4444',
            glowColor: 'rgba(239, 68, 68, 0.6)',
            label: 'p⁺ (¹H)',
            trail: [],
          },
        ];
      } else if (activeStepIndex === 1) {
        // Step 2: Deuteron (p+n) at center + incoming proton
        particlesRef.current = [
          {
            id: 'deut_p',
            x: cx - 7,
            y: cy,
            vx: 0,
            vy: 0,
            radius: pRadius - 1,
            type: 'proton',
            color: '#ef4444',
            glowColor: 'rgba(239, 68, 68, 0.5)',
            label: 'p⁺',
          },
          {
            id: 'deut_n',
            x: cx + 9,
            y: cy,
            vx: 0,
            vy: 0,
            radius: pRadius - 1,
            type: 'neutron',
            color: '#3b82f6',
            glowColor: 'rgba(59, 130, 246, 0.5)',
            label: 'n⁰',
          },
          // Incoming 3rd proton
          {
            id: 'p3',
            x: cx - approachDist * 0.9,
            y: cy - (isSmall ? 45 : 65),
            vx: 35,
            vy: 20,
            radius: pRadius,
            type: 'proton',
            color: '#ef4444',
            glowColor: 'rgba(239, 68, 68, 0.6)',
            label: 'p⁺ (¹H)',
            trail: [],
          },
        ];
      } else {
        // Step 3: Two Helium-3 nuclei (2p + 1n each) colliding to produce Helium-4 (2p + 2n) + 2 protons
        const he3Offset = isSmall ? 8 : 10;
        particlesRef.current = [
          // Left Helium-3 (2p + 1n)
          {
            id: 'he3_1_p1',
            x: cx - approachDist - 5,
            y: cy - he3Offset,
            vx: 28,
            vy: 0,
            radius: pRadius - 2,
            type: 'proton',
            color: '#ef4444',
            glowColor: 'rgba(239, 68, 68, 0.4)',
            label: 'p⁺',
          },
          {
            id: 'he3_1_p2',
            x: cx - approachDist - 16,
            y: cy + 4,
            vx: 28,
            vy: 0,
            radius: pRadius - 2,
            type: 'proton',
            color: '#ef4444',
            glowColor: 'rgba(239, 68, 68, 0.4)',
            label: 'p⁺',
          },
          {
            id: 'he3_1_n1',
            x: cx - approachDist,
            y: cy + 6,
            vx: 28,
            vy: 0,
            radius: pRadius - 2,
            type: 'neutron',
            color: '#3b82f6',
            glowColor: 'rgba(59, 130, 246, 0.4)',
            label: 'n⁰',
          },
          // Right Helium-3 (2p + 1n)
          {
            id: 'he3_2_p1',
            x: cx + approachDist + 5,
            y: cy - he3Offset,
            vx: -28,
            vy: 0,
            radius: pRadius - 2,
            type: 'proton',
            color: '#ef4444',
            glowColor: 'rgba(239, 68, 68, 0.4)',
            label: 'p⁺',
          },
          {
            id: 'he3_2_p2',
            x: cx + approachDist + 16,
            y: cy + 4,
            vx: -28,
            vy: 0,
            radius: pRadius - 2,
            type: 'proton',
            color: '#ef4444',
            glowColor: 'rgba(239, 68, 68, 0.4)',
            label: 'p⁺',
          },
          {
            id: 'he3_2_n1',
            x: cx + approachDist,
            y: cy + 6,
            vx: -28,
            vy: 0,
            radius: pRadius - 2,
            type: 'neutron',
            color: '#3b82f6',
            glowColor: 'rgba(59, 130, 246, 0.4)',
            label: 'n⁰',
          },
        ];
      }
    } else if (selectedFusionId === 'cno-cycle') {
      // Catalytic isotope in center and incoming protons
      particlesRef.current = [
        {
          id: 'cno_center',
          x: cx,
          y: cy,
          vx: 0,
          vy: 0,
          radius: isSmall ? 22 : 28,
          type: 'catalyst',
          color: '#10b981',
          glowColor: 'rgba(16, 185, 129, 0.5)',
          label: '¹²C Catalyst',
          pulsePhase: 0,
        },
        {
          id: 'cno_incoming_p',
          x: cx - (isSmall ? 80 : 120),
          y: cy - (isSmall ? 60 : 80),
          vx: 28,
          vy: 20,
          radius: pRadius,
          type: 'proton',
          color: '#ef4444',
          glowColor: 'rgba(239, 68, 68, 0.6)',
          label: 'p⁺ (Fuel)',
          trail: [],
        },
      ];
    } else {
      // Triple-alpha simulation: 3 Helium-4 nuclei
      particlesRef.current = [
        {
          id: 'alpha1',
          x: cx - approachDist * 0.8,
          y: cy,
          vx: 24,
          vy: 0,
          radius: isSmall ? 13 : 16,
          type: 'alpha',
          color: '#f59e0b',
          glowColor: 'rgba(245, 158, 11, 0.6)',
          label: '⁴He (α)',
          trail: [],
        },
        {
          id: 'alpha2',
          x: cx + approachDist * 0.8,
          y: cy,
          vx: -24,
          vy: 0,
          radius: isSmall ? 13 : 16,
          type: 'alpha',
          color: '#f59e0b',
          glowColor: 'rgba(245, 158, 11, 0.6)',
          label: '⁴He (α)',
          trail: [],
        },
        {
          id: 'alpha3',
          x: cx,
          y: cy - (isSmall ? 90 : 125),
          vx: 0,
          vy: 30,
          radius: isSmall ? 13 : 16,
          type: 'alpha',
          color: '#f59e0b',
          glowColor: 'rgba(245, 158, 11, 0.6)',
          label: '⁴He (3rd α)',
          trail: [],
        },
      ];
    }
  }, [selectedFusionId, activeStepIndex]);

  // Trigger manual proton injection
  const handleInjectProton = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const cx = w / 2;
    const cy = h / 2;

    const angle = Math.random() * Math.PI * 2;
    const dist = Math.min(w, h) * 0.42;
    const speed = 40 + (coreTempMK / 25) * 10;

    const newParticle: Particle = {
      id: `injected_p_${Date.now()}`,
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: -Math.cos(angle) * speed,
      vy: -Math.sin(angle) * speed,
      radius: w < 480 ? 10 : 13,
      type: 'proton',
      color: '#f87171',
      glowColor: 'rgba(248, 113, 113, 0.8)',
      label: 'Fast p⁺',
      trail: [],
    };

    particlesRef.current.push(newParticle);

    floatingLabelsRef.current.push({
      x: newParticle.x,
      y: newParticle.y - 12,
      text: '⚡ Proton Injected!',
      color: '#fbbf24',
      alpha: 1,
      vy: -15,
    });
  };

  // Main Canvas Animation Loop with smooth, delta-timed kinematics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.scale(dpr, dpr);
      initSimulation();
    };

    handleResize();
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(canvas);

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const rawDt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      // Cap dt to prevent jumps during tab-switches or lag
      const dt = Math.min(rawDt, 0.05);

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const cx = width / 2;
      const cy = height / 2;
      const isMobile = width < 500;

      // 1. Draw Deep Space Background with Core Plasma Glow
      ctx.fillStyle = '#020512';
      ctx.fillRect(0, 0, width, height);

      // Core stellar plasma ambient gradient
      const safeCx = Number.isFinite(cx) ? cx : 0;
      const safeCy = Number.isFinite(cy) ? cy : 0;
      const maxDim = Number.isFinite(width) && Number.isFinite(height) ? Math.max(width, height) : 300;
      const safeOuterR = Math.max(20, maxDim * 0.55);
      const plasmaGrad = ctx.createRadialGradient(safeCx, safeCy, 15, safeCx, safeCy, safeOuterR);
      if (selectedFusionId === 'pp-chain') {
        plasmaGrad.addColorStop(0, 'rgba(249, 115, 22, 0.15)');
        plasmaGrad.addColorStop(0.4, 'rgba(239, 68, 68, 0.07)');
        plasmaGrad.addColorStop(1, 'rgba(2, 5, 18, 0)');
      } else if (selectedFusionId === 'cno-cycle') {
        plasmaGrad.addColorStop(0, 'rgba(6, 182, 212, 0.16)');
        plasmaGrad.addColorStop(0.4, 'rgba(16, 185, 129, 0.07)');
        plasmaGrad.addColorStop(1, 'rgba(2, 5, 18, 0)');
      } else {
        plasmaGrad.addColorStop(0, 'rgba(234, 179, 8, 0.18)');
        plasmaGrad.addColorStop(0.4, 'rgba(220, 38, 38, 0.08)');
        plasmaGrad.addColorStop(1, 'rgba(2, 5, 18, 0)');
      }
      ctx.fillStyle = plasmaGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Coulomb Potential Barrier reference circles
      ctx.save();
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.22)';
      ctx.beginPath();
      ctx.arc(cx, cy, isMobile ? 48 : 68, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(239, 68, 68, 0.16)';
      ctx.beginPath();
      ctx.arc(cx, cy, isMobile ? 75 : 105, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Subtle core background grid
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = isMobile ? 24 : 32;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Update & Draw Shockwaves (gentle, calm expansion)
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        if (isPlaying) {
          sw.radius += 55 * dt * simSpeed;
          sw.alpha -= 0.55 * dt * simSpeed;
        }

        if (sw.alpha <= 0) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius * 0.7, 0, Math.PI * 2);
        ctx.lineWidth = 1;
        ctx.stroke();

        if (sw.text && sw.radius > 15) {
          ctx.font = `bold ${isMobile ? '10px' : '12px'} monospace`;
          ctx.fillStyle = sw.color;
          ctx.textAlign = 'center';
          ctx.fillText(sw.text, sw.x, sw.y - sw.radius - 4);
        }
        ctx.restore();
      }

      // 4. Update Simulation Physics (calm and deliberate)
      if (isPlaying) {
        stepTimerRef.current += dt * simSpeed;
        cnoAngleRef.current += 0.35 * dt * simSpeed;

        if (selectedFusionId === 'pp-chain') {
          if (activeStepIndex === 0) {
            // Step 1: Two incoming protons fusing to Deuteron + e+ + v
            const p1 = particlesRef.current.find((p) => p.id === 'p1');
            const p2 = particlesRef.current.find((p) => p.id === 'p2');

            if (p1 && p2 && stepStageRef.current === 0) {
              const dist = Math.abs(p2.x - p1.x);

              if (dist > (isMobile ? 22 : 28)) {
                // Smooth approach towards center
                p1.x += p1.vx * dt * simSpeed;
                p2.x += p2.vx * dt * simSpeed;
              } else {
                // FUSION EVENT: Quantum Tunneling + Weak Force
                stepStageRef.current = 1;

                p1.x = cx - (isMobile ? 6 : 8);
                p1.y = cy;
                p1.vx = 0;
                p1.label = 'p⁺';

                p2.x = cx + (isMobile ? 6 : 8);
                p2.y = cy;
                p2.vx = 0;
                p2.type = 'neutron';
                p2.color = '#3b82f6';
                p2.glowColor = 'rgba(59, 130, 246, 0.6)';
                p2.label = 'n⁰';

                shockwavesRef.current.push({
                  x: cx,
                  y: cy,
                  radius: 8,
                  maxRadius: isMobile ? 90 : 130,
                  color: '#38bdf8',
                  alpha: 1,
                  text: 'Quantum Tunneling! (+0.42 MeV)',
                });

                // Emit Positron (calm speed)
                particlesRef.current.push({
                  id: `positron_${Date.now()}`,
                  x: cx,
                  y: cy,
                  vx: 45,
                  vy: -35,
                  radius: isMobile ? 5 : 7,
                  type: 'positron',
                  color: '#06b6d4',
                  glowColor: 'rgba(6, 182, 212, 0.9)',
                  label: 'e⁺',
                  life: 0,
                  maxLife: 3.5,
                  trail: [],
                });

                // Emit Neutrino (calm speed)
                particlesRef.current.push({
                  id: `neutrino_${Date.now()}`,
                  x: cx,
                  y: cy,
                  vx: -55,
                  vy: 35,
                  radius: isMobile ? 4 : 5,
                  type: 'neutrino',
                  color: '#e0e7ff',
                  glowColor: 'rgba(224, 231, 255, 0.9)',
                  label: 'νe',
                  life: 0,
                  maxLife: 3.8,
                  trail: [],
                });

                setPositronsEmitted((prev) => prev + 1);
                setNeutrinosEmitted((prev) => prev + 1);
                setTotalEnergyMeV((prev) => +(prev + 0.42).toFixed(2));
                setReactionsCompleted((prev) => prev + 1);

                floatingLabelsRef.current.push({
                  x: cx,
                  y: cy - (isMobile ? 26 : 34),
                  text: '²H (Deuteron) Formed!',
                  color: '#38bdf8',
                  alpha: 1,
                  vy: -10,
                });
              }
            } else if (stepStageRef.current === 1 && autoAdvanceSteps && stepTimerRef.current > 5.5) {
              setActiveStepIndex(1);
            }
          } else if (activeStepIndex === 1) {
            // Step 2: Deuteron captures 3rd proton to form Helium-3 + Gamma photon
            const p3 = particlesRef.current.find((p) => p.id === 'p3');
            if (p3 && stepStageRef.current === 0) {
              const dx = cx - p3.x;
              const dy = cy - p3.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist > (isMobile ? 18 : 24)) {
                p3.x += p3.vx * dt * simSpeed;
                p3.y += p3.vy * dt * simSpeed;
              } else {
                stepStageRef.current = 1;
                p3.x = cx;
                p3.y = cy - (isMobile ? 10 : 13);
                p3.vx = 0;
                p3.vy = 0;

                shockwavesRef.current.push({
                  x: cx,
                  y: cy,
                  radius: 8,
                  maxRadius: isMobile ? 100 : 140,
                  color: '#fbbf24',
                  alpha: 1,
                  text: 'Gamma Ray Emitted! (+5.49 MeV)',
                });

                // Emit Gamma Photon
                particlesRef.current.push({
                  id: `photon_${Date.now()}`,
                  x: cx,
                  y: cy,
                  vx: 60,
                  vy: -40,
                  radius: isMobile ? 6 : 8,
                  type: 'photon',
                  color: '#fbbf24',
                  glowColor: 'rgba(251, 191, 36, 0.9)',
                  label: 'γ Ray',
                  life: 0,
                  maxLife: 3.5,
                  pulsePhase: 0,
                  trail: [],
                });

                setPhotonsEmitted((prev) => prev + 1);
                setTotalEnergyMeV((prev) => +(prev + 5.49).toFixed(2));
                setReactionsCompleted((prev) => prev + 1);

                floatingLabelsRef.current.push({
                  x: cx,
                  y: cy - (isMobile ? 28 : 36),
                  text: '³He (Helium-3) Synthesized!',
                  color: '#fbbf24',
                  alpha: 1,
                  vy: -10,
                });
              }
            } else if (stepStageRef.current === 1 && autoAdvanceSteps && stepTimerRef.current > 5.5) {
              setActiveStepIndex(2);
            }
          } else if (activeStepIndex === 2) {
            // Step 3: Two Helium-3 collide to form Helium-4 (Alpha) + 2 free protons
            if (stepStageRef.current === 0) {
              const pLeft = particlesRef.current.filter((p) => p.id.startsWith('he3_1'));
              const pRight = particlesRef.current.filter((p) => p.id.startsWith('he3_2'));

              const dx = (pRight[0]?.x || 0) - (pLeft[0]?.x || 0);
              if (Math.abs(dx) > (isMobile ? 20 : 28)) {
                pLeft.forEach((p) => {
                  p.x += p.vx * dt * simSpeed;
                });
                pRight.forEach((p) => {
                  p.x += p.vx * dt * simSpeed;
                });
              } else {
                // Synthesize complete Helium-4 alpha particle
                stepStageRef.current = 1;

                shockwavesRef.current.push({
                  x: cx,
                  y: cy,
                  radius: 10,
                  maxRadius: isMobile ? 120 : 160,
                  color: '#4ade80',
                  alpha: 1,
                  text: '⁴He Alpha Particle Formed! (+12.86 MeV)',
                });

                const heR = isMobile ? 9 : 12;
                particlesRef.current = [
                  {
                    id: 'he4_p1',
                    x: cx - heR * 0.7,
                    y: cy - heR * 0.6,
                    vx: 0,
                    vy: 0,
                    radius: heR,
                    type: 'proton',
                    color: '#ef4444',
                    glowColor: 'rgba(239, 68, 68, 0.6)',
                    label: 'p⁺',
                  },
                  {
                    id: 'he4_p2',
                    x: cx + heR * 0.7,
                    y: cy + heR * 0.6,
                    vx: 0,
                    vy: 0,
                    radius: heR,
                    type: 'proton',
                    color: '#ef4444',
                    glowColor: 'rgba(239, 68, 68, 0.6)',
                    label: 'p⁺',
                  },
                  {
                    id: 'he4_n1',
                    x: cx + heR * 0.7,
                    y: cy - heR * 0.6,
                    vx: 0,
                    vy: 0,
                    radius: heR,
                    type: 'neutron',
                    color: '#3b82f6',
                    glowColor: 'rgba(59, 130, 246, 0.6)',
                    label: 'n⁰',
                  },
                  {
                    id: 'he4_n2',
                    x: cx - heR * 0.7,
                    y: cy + heR * 0.6,
                    vx: 0,
                    vy: 0,
                    radius: heR,
                    type: 'neutron',
                    color: '#3b82f6',
                    glowColor: 'rgba(59, 130, 246, 0.6)',
                    label: 'n⁰',
                  },
                  // 2 Free protons discharged at gentle velocity
                  {
                    id: 'free_p1',
                    x: cx,
                    y: cy - 12,
                    vx: -40,
                    vy: -45,
                    radius: isMobile ? 9 : 12,
                    type: 'proton',
                    color: '#ef4444',
                    glowColor: 'rgba(239, 68, 68, 0.8)',
                    label: 'Free p⁺',
                    trail: [],
                  },
                  {
                    id: 'free_p2',
                    x: cx,
                    y: cy + 12,
                    vx: 40,
                    vy: 45,
                    radius: isMobile ? 9 : 12,
                    type: 'proton',
                    color: '#ef4444',
                    glowColor: 'rgba(239, 68, 68, 0.8)',
                    label: 'Free p⁺',
                    trail: [],
                  },
                ];

                setTotalEnergyMeV((prev) => +(prev + 12.86).toFixed(2));
                setReactionsCompleted((prev) => prev + 1);

                floatingLabelsRef.current.push({
                  x: cx,
                  y: cy - (isMobile ? 32 : 40),
                  text: '★ Complete Alpha Nucleus (⁴He) Synthesized!',
                  color: '#4ade80',
                  alpha: 1,
                  vy: -10,
                });
              }
            } else if (stepStageRef.current === 1 && autoAdvanceSteps && stepTimerRef.current > 6.0) {
              setActiveStepIndex(0);
            }
          }
        } else if (selectedFusionId === 'cno-cycle') {
          // CNO Cycle: Incoming proton capture and catalytic stage cycle
          const incP = particlesRef.current.find((p) => p.id === 'cno_incoming_p');
          const center = particlesRef.current.find((p) => p.id === 'cno_center');

          if (incP && center) {
            const dx = cx - incP.x;
            const dy = cy - incP.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > (isMobile ? 26 : 34)) {
              incP.x += incP.vx * dt * simSpeed;
              incP.y += incP.vy * dt * simSpeed;
            } else {
              // Proton captured into catalyst!
              shockwavesRef.current.push({
                x: cx,
                y: cy,
                radius: 10,
                maxRadius: isMobile ? 100 : 135,
                color: '#10b981',
                alpha: 1,
                text: 'Proton Captured into CNO Catalyst!',
              });

              particlesRef.current = particlesRef.current.filter((p) => p.id !== 'cno_incoming_p');

              // Emit Positron + Neutrino + Gamma
              particlesRef.current.push({
                id: `cno_e_${Date.now()}`,
                x: cx,
                y: cy,
                vx: 45,
                vy: -35,
                radius: isMobile ? 5 : 7,
                type: 'positron',
                color: '#06b6d4',
                glowColor: 'rgba(6, 182, 212, 0.9)',
                label: 'e⁺',
                life: 0,
                maxLife: 3.2,
              });

              particlesRef.current.push({
                id: `cno_v_${Date.now()}`,
                x: cx,
                y: cy,
                vx: -50,
                vy: 35,
                radius: isMobile ? 4 : 5,
                type: 'neutrino',
                color: '#e0e7ff',
                glowColor: 'rgba(224, 231, 255, 0.9)',
                label: 'νe',
                life: 0,
                maxLife: 3.5,
              });

              setPositronsEmitted((prev) => prev + 1);
              setNeutrinosEmitted((prev) => prev + 1);
              setPhotonsEmitted((prev) => prev + 1);
              setTotalEnergyMeV((prev) => +(prev + 6.68).toFixed(2));
              setReactionsCompleted((prev) => prev + 1);

              cnoCycleStageRef.current = (cnoCycleStageRef.current + 1) % 6;

              // Eject Alpha particle every full cycle
              if (cnoCycleStageRef.current === 0) {
                setTimeout(() => {
                  particlesRef.current.push({
                    id: `cno_alpha_${Date.now()}`,
                    x: cx,
                    y: cy,
                    vx: 35,
                    vy: 40,
                    radius: isMobile ? 10 : 13,
                    type: 'alpha',
                    color: '#fbbf24',
                    glowColor: 'rgba(251, 191, 36, 0.8)',
                    label: '⁴He Ejected!',
                    life: 0,
                    maxLife: 3.5,
                  });
                }, 800);
              }

              // Spawn next fuel proton with a comfortable, calm delay
              setTimeout(() => {
                const angle = Math.random() * Math.PI * 2;
                const spawnDist = isMobile ? 90 : 130;
                particlesRef.current.push({
                  id: 'cno_incoming_p',
                  x: cx + Math.cos(angle) * spawnDist,
                  y: cy + Math.sin(angle) * spawnDist,
                  vx: -Math.cos(angle) * 30,
                  vy: -Math.sin(angle) * 30,
                  radius: isMobile ? 10 : 13,
                  type: 'proton',
                  color: '#ef4444',
                  glowColor: 'rgba(239, 68, 68, 0.6)',
                  label: 'p⁺ (Fuel)',
                  trail: [],
                });
              }, 2000);
            }
          }
        } else {
          // Triple-alpha process
          const a1 = particlesRef.current.find((p) => p.id === 'alpha1');
          const a2 = particlesRef.current.find((p) => p.id === 'alpha2');
          const a3 = particlesRef.current.find((p) => p.id === 'alpha3');

          if (a1 && a2 && stepStageRef.current === 0) {
            const dist = Math.abs(a2.x - a1.x);
            if (dist > (isMobile ? 22 : 28)) {
              a1.x += a1.vx * dt * simSpeed;
              a2.x += a2.vx * dt * simSpeed;
            } else {
              stepStageRef.current = 1;
              a1.x = cx - 10;
              a2.x = cx + 10;
              a1.label = '⁸Be';
              a2.label = '⁸Be';

              shockwavesRef.current.push({
                x: cx,
                y: cy,
                radius: 10,
                maxRadius: isMobile ? 90 : 120,
                color: '#ec4899',
                alpha: 1,
                text: 'Unstable ⁸Be Formed (τ ~ 10⁻¹⁶ s!)',
              });

              floatingLabelsRef.current.push({
                x: cx,
                y: cy - (isMobile ? 22 : 28),
                text: 'Fast! 3rd α must strike before decay!',
                color: '#f43f5e',
                alpha: 1,
                vy: -8,
              });
            }
          } else if (a3 && stepStageRef.current === 1) {
            const dy = cy - a3.y;
            if (dy > (isMobile ? 16 : 22)) {
              a3.y += a3.vy * dt * simSpeed;
            } else {
              // 3rd Alpha collides into Hoyle State 12-Carbon!
              stepStageRef.current = 2;

              shockwavesRef.current.push({
                x: cx,
                y: cy,
                radius: 12,
                maxRadius: isMobile ? 120 : 160,
                color: '#38bdf8',
                alpha: 1,
                text: 'Hoyle Resonance State! ¹²C Forged! (+7.27 MeV)',
              });

              particlesRef.current = [
                {
                  id: 'carbon12',
                  x: cx,
                  y: cy,
                  vx: 0,
                  vy: 0,
                  radius: isMobile ? 20 : 25,
                  type: 'catalyst',
                  color: '#38bdf8',
                  glowColor: 'rgba(56, 189, 248, 0.8)',
                  label: '¹²C (Carbon-12)',
                  pulsePhase: 0,
                },
              ];

              setTotalEnergyMeV((prev) => +(prev + 7.27).toFixed(2));
              setReactionsCompleted((prev) => prev + 1);

              floatingLabelsRef.current.push({
                x: cx,
                y: cy - (isMobile ? 32 : 40),
                text: '★ Carbon-12 Synthesized via Hoyle Resonance!',
                color: '#38bdf8',
                alpha: 1,
                vy: -10,
              });
            }
          } else if (stepStageRef.current === 2 && autoAdvanceSteps && stepTimerRef.current > 6.0) {
            initSimulation();
          }
        }

        // Generic particle movement for emitted products (positrons, neutrinos, gamma photons, ejected alphas)
        particlesRef.current.forEach((p) => {
          if (p.life !== undefined && p.maxLife !== undefined) {
            p.life += dt * simSpeed;
            p.alpha = Math.max(0, 1 - p.life / p.maxLife);
          }

          if (p.type === 'positron' || p.type === 'neutrino' || p.type === 'photon' || p.id.startsWith('free_p') || p.id.startsWith('cno_alpha') || p.id.startsWith('injected_p')) {
            p.x += p.vx * dt * simSpeed;
            p.y += p.vy * dt * simSpeed;

            if (p.trail) {
              p.trail.unshift({ x: p.x, y: p.y });
              if (p.trail.length > 10) p.trail.pop();
            }
          }
        });
      }

      // 5. Draw Particle Trails & Spheres
      particlesRef.current.forEach((p) => {
        // Draw trail
        if (p.trail && p.trail.length > 1) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let ti = 1; ti < p.trail.length; ti++) {
            ctx.lineTo(p.trail[ti].x, p.trail[ti].y);
          }
          ctx.strokeStyle = p.glowColor;
          ctx.lineWidth = Math.max(2, p.radius * 0.7);
          ctx.globalAlpha = (p.alpha ?? 1) * 0.45;
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.restore();
        }

        // Gamma photon oscillating wave representation
        if (p.type === 'photon') {
          ctx.save();
          p.pulsePhase = (p.pulsePhase || 0) + dt * 10 * simSpeed;
          const waveAmp = isMobile ? 4 : 6;
          const waveFreq = 0.35;

          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2;
          ctx.globalAlpha = p.alpha ?? 1;
          ctx.beginPath();
          for (let wi = -14; wi <= 14; wi += 2) {
            const wx = p.x + wi;
            const wy = p.y + Math.sin(wi * waveFreq + p.pulsePhase) * waveAmp;
            if (wi === -14) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
          }
          ctx.stroke();

          // Packet core glow
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#fef08a';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.restore();
        } else {
          // Standard particle rendering
          ctx.save();
          ctx.globalAlpha = p.alpha ?? 1;

          // Outer glowing halo
          const pR = Number.isFinite(p.radius) && p.radius > 0 ? p.radius : 4;
          const pX = Number.isFinite(p.x) ? p.x : 0;
          const pY = Number.isFinite(p.y) ? p.y : 0;
          const haloGrad = ctx.createRadialGradient(pX, pY, Math.max(0, pR * 0.4), pX, pY, Math.max(0.1, pR * 2.0));
          haloGrad.addColorStop(0, p.glowColor);
          haloGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(pX, pY, pR * 2.0, 0, Math.PI * 2);
          ctx.fill();

          // Particle Sphere
          const pGrad = ctx.createRadialGradient(
            pX - pR * 0.35,
            pY - pR * 0.35,
            Math.max(0, pR * 0.1),
            pX,
            pY,
            Math.max(0.1, pR)
          );
          pGrad.addColorStop(0, '#ffffff');
          pGrad.addColorStop(0.3, p.color);
          pGrad.addColorStop(1, p.color);

          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(pX, pY, pR, 0, Math.PI * 2);
          ctx.fill();

          // Inner charge symbol
          if (p.type === 'proton') {
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.round(p.radius * 1.1)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('+', p.x, p.y);
          } else if (p.type === 'neutron') {
            ctx.fillStyle = '#cbd5e1';
            ctx.font = `bold ${Math.round(p.radius * 0.9)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('n', p.x, p.y);
          } else if (p.type === 'positron') {
            ctx.fillStyle = '#082f49';
            ctx.font = `bold ${Math.round(p.radius * 1.2)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('+', p.x, p.y);
          } else if (p.type === 'alpha') {
            ctx.fillStyle = '#020617';
            ctx.font = `bold ${Math.round(p.radius * 0.9)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('α', p.x, p.y);
          }

          // Label above particle
          if (showParticleLabels && p.label) {
            ctx.font = `bold ${isMobile ? '9px' : '11px'} monospace`;
            ctx.fillStyle = '#e2e8f0';
            ctx.textAlign = 'center';
            ctx.shadowColor = '#000000';
            ctx.shadowBlur = 4;
            ctx.fillText(p.label, p.x, p.y - p.radius - 6);
          }

          ctx.restore();
        }
      });

      // Filter out dead particles
      particlesRef.current = particlesRef.current.filter((p) => p.alpha === undefined || p.alpha > 0.02);

      // 6. Floating Labels
      for (let fi = floatingLabelsRef.current.length - 1; fi >= 0; fi--) {
        const fl = floatingLabelsRef.current[fi];
        if (isPlaying) {
          fl.y += fl.vy * dt * simSpeed;
          fl.alpha -= 0.45 * dt * simSpeed;
        }

        if (fl.alpha <= 0) {
          floatingLabelsRef.current.splice(fi, 1);
          continue;
        }

        ctx.save();
        ctx.font = `bold ${isMobile ? '11px' : '13px'} monospace`;
        ctx.fillStyle = fl.color;
        ctx.globalAlpha = fl.alpha;
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 6;
        ctx.fillText(fl.text, fl.x, fl.y);
        ctx.restore();
      }

      // 7. CNO Catalytic Ring Overlay in CNO mode
      if (selectedFusionId === 'cno-cycle') {
        const ringRadius = isMobile ? 65 : 88;
        ctx.save();
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        const nodes = [
          { name: '¹²C', color: '#10b981' },
          { name: '¹³N', color: '#06b6d4' },
          { name: '¹³C', color: '#38bdf8' },
          { name: '¹⁴N', color: '#818cf8' },
          { name: '¹⁵O', color: '#c084fc' },
          { name: '¹⁵N', color: '#f43f5e' },
        ];

        nodes.forEach((node, idx) => {
          const theta = (idx * Math.PI * 2) / 6 + cnoAngleRef.current * 0.15;
          const nx = cx + Math.cos(theta) * ringRadius;
          const ny = cy + Math.sin(theta) * ringRadius;

          ctx.beginPath();
          ctx.arc(nx, ny, isMobile ? 11 : 14, 0, Math.PI * 2);
          ctx.fillStyle = '#040d21';
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([]);
          ctx.fill();
          ctx.stroke();

          ctx.font = `bold ${isMobile ? '8px' : '10px'} monospace`;
          ctx.fillStyle = node.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.name, nx, ny);
        });
        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
    };
  }, [
    isPlaying,
    simSpeed,
    activeStepIndex,
    autoAdvanceSteps,
    coreTempMK,
    selectedFusionId,
    showParticleLabels,
    initSimulation,
  ]);

  // Restart simulation
  const handleReset = () => {
    initSimulation();
    setReactionsCompleted(0);
    setTotalEnergyMeV(0);
    setPositronsEmitted(0);
    setNeutrinosEmitted(0);
    setPhotonsEmitted(0);
  };

  return (
    <div className="flex flex-col gap-3.5 sm:gap-4 w-full overflow-x-hidden">
      {/* Visualizer Header Bar & Subtab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#030718] border border-cyan-500/25 shadow-md">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Atom className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider truncate">
              Thermonuclear Engine Simulation
            </h4>
            <p className="text-[10px] sm:text-xs text-slate-400 truncate">
              Quantum tunneling, Coulomb penetration & nucleosynthesis
            </p>
          </div>
        </div>

        {/* View Mode Switcher - Responsive horizontal scrollable tabs on mobile */}
        <div className="flex items-center gap-1 p-1 bg-[#020512] rounded-lg border border-cyan-500/20 text-[11px] sm:text-xs font-mono w-full sm:w-auto overflow-x-auto scrollbar-none shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('simulation')}
            className={`px-2.5 py-1.5 rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'simulation'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Particle Reaction
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('tunneling')}
            className={`px-2.5 py-1.5 rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'tunneling'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quantum Tunneling
          </button>
          {selectedFusionId === 'triple-alpha' && (
            <button
              type="button"
              onClick={() => setActiveSubTab('onion')}
              className={`px-2.5 py-1.5 rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === 'onion'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Onion Core Shells
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveSubTab('binding')}
            className={`px-2.5 py-1.5 rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'binding'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Binding Curve
          </button>
        </div>
      </div>

      {/* Main Interactive Screen */}
      {activeSubTab === 'simulation' && (
        <div className="flex flex-col gap-3">
          {/* Dedicated Clean Mobile-Optimized Controls Toolbar */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#030616] border border-cyan-500/20 flex flex-wrap items-center justify-between gap-2">
            {/* Left Controls: Play, Reset, Speed */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                id="btn-fusion-toggle-play"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-slate-900 hover:bg-cyan-950 text-cyan-300 border border-slate-700 hover:border-cyan-400 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold active:scale-95 min-h-[38px] sm:min-h-[40px]"
                title={isPlaying ? 'Pause animation' : 'Play animation'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                type="button"
                id="btn-fusion-reset"
                onClick={handleReset}
                className="p-2 rounded-lg bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-400 transition-all cursor-pointer active:scale-95 min-h-[38px] sm:min-h-[40px] min-w-[38px] flex items-center justify-center"
                title="Reset animation step"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Speed Choices */}
              <div className="flex items-center p-0.5 bg-[#020512] rounded-lg border border-slate-800 text-[11px] font-mono">
                {[
                  { val: 0.5, label: '0.5x Slow' },
                  { val: 0.75, label: '0.75x Calm' },
                  { val: 1.25, label: '1.25x' },
                ].map((s) => (
                  <button
                    key={s.val}
                    type="button"
                    onClick={() => setSimSpeed(s.val)}
                    className={`px-2 py-1 rounded font-semibold transition-all cursor-pointer ${
                      simSpeed === s.val
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Controls: Auto-Advance & Inject Proton */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <button
                type="button"
                onClick={() => setAutoAdvanceSteps(!autoAdvanceSteps)}
                className={`text-[10px] sm:text-xs font-mono px-2 py-1 rounded border transition-all cursor-pointer ${
                  autoAdvanceSteps
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {autoAdvanceSteps ? 'Auto-Cycle: ON' : 'Auto-Cycle: OFF'}
              </button>

              <button
                type="button"
                id="btn-fusion-inject-proton"
                onClick={handleInjectProton}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-mono text-xs font-bold transition-all shadow-[0_0_12px_rgba(239,68,68,0.35)] flex items-center gap-1.5 cursor-pointer active:scale-95 min-h-[38px]"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Inject Proton</span>
              </button>
            </div>
          </div>

          {/* Interactive Particle Canvas */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[440px] rounded-xl sm:rounded-2xl bg-[#020512] border border-cyan-500/30 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
            <canvas
              ref={canvasRef}
              onClick={handleInjectProton}
              className="w-full h-full block cursor-pointer"
              title="Click or tap anywhere on the core canvas to inject a high-energy proton!"
            />

            {/* Tap to inject prompt on mobile */}
            <div className="absolute top-2.5 right-2.5 text-[9px] sm:text-[10px] font-mono text-cyan-400/80 bg-[#040816]/80 px-2 py-0.5 rounded border border-cyan-500/20 pointer-events-none">
              Tap core to inject
            </div>

            {/* Live In-Canvas Minimal Status HUD (non-overlapping) */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none px-2.5 py-1 rounded-lg bg-[#040816]/85 border border-cyan-500/20 text-[10px] sm:text-[11px] font-mono">
              <span className="text-cyan-300 font-bold">
                Energy: <span className="text-amber-300">+{totalEnergyMeV.toFixed(2)} MeV</span>
              </span>
              <span className="text-slate-300">
                Events: <span className="text-emerald-400 font-bold">{reactionsCompleted}</span>
              </span>
              <span className="text-slate-400 hidden xs:inline">
                T: <span className="text-amber-300">{coreTempMK}M K</span>
              </span>
            </div>
          </div>

          {/* Particle Legend Row - Clean, accessible, and not overlapping canvas */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 rounded-xl bg-[#030616] border border-cyan-500/15 text-[10px] sm:text-xs font-mono text-slate-300">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_#ef4444]" />
                <span>p⁺ (Proton)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]" />
                <span>n⁰ (Neutron)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_5px_#06b6d4]" />
                <span>e⁺ (Positron)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-200 shadow-[0_0_5px_#e0e7ff]" />
                <span>νe (Neutrino)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_5px_#fbbf24]" />
                <span>γ (Gamma)</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowParticleLabels(!showParticleLabels)}
              className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer text-[10px] sm:text-xs ml-auto"
            >
              {showParticleLabels ? 'Hide Labels' : 'Show Labels'}
            </button>
          </div>

          {/* Reaction Step Sequence Selector (for p-p chain) */}
          {selectedFusionId === 'pp-chain' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  step: 0,
                  title: 'Step 1: Deuteron Formation',
                  eq: 'p⁺ + p⁺ → ²H + e⁺ + νe',
                  energy: '+0.42 MeV',
                },
                {
                  step: 1,
                  title: 'Step 2: Helium-3 Formation',
                  eq: '²H + p⁺ → ³He + γ',
                  energy: '+5.49 MeV',
                },
                {
                  step: 2,
                  title: 'Step 3: Alpha Synthesis',
                  eq: '³He + ³He → ⁴He + 2 p⁺',
                  energy: '+12.86 MeV',
                },
              ].map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => {
                    setActiveStepIndex(s.step);
                    initSimulation();
                  }}
                  className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeStepIndex === s.step
                      ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)] ring-1 ring-amber-400'
                      : 'bg-[#040816] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-white">{s.title}</span>
                      <span className="text-[10px] font-mono text-amber-300 font-bold">{s.energy}</span>
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-mono text-cyan-300 mt-1">{s.eq}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Bottom Grid: Core Temperature & Reaction Diagnostics */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-1">
            {/* Core Temperature Controller */}
            <div className="md:col-span-6 p-3 sm:p-4 rounded-xl bg-[#030616] border border-cyan-500/20 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Core Temperature
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30">
                  {coreTempMK} Million K
                </span>
              </div>

              <input
                type="range"
                min={selectedFusionId === 'pp-chain' ? 8 : selectedFusionId === 'cno-cycle' ? 14 : 80}
                max={selectedFusionId === 'pp-chain' ? 25 : selectedFusionId === 'cno-cycle' ? 60 : 3000}
                value={coreTempMK}
                onChange={(e) => setCoreTempMK(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 my-1"
              />

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{selectedFusionId === 'pp-chain' ? '8M K' : selectedFusionId === 'cno-cycle' ? '14M K' : '80M K'}</span>
                <span className="text-amber-300 font-bold">
                  {selectedFusionId === 'pp-chain' ? '15M K (Solar Core)' : selectedFusionId === 'cno-cycle' ? '25M K (High-Mass)' : '200M K'}
                </span>
                <span>{selectedFusionId === 'pp-chain' ? '25M K' : selectedFusionId === 'cno-cycle' ? '60M K' : '3,000M K'}</span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {selectedFusionId === 'pp-chain'
                  ? 'Energy production scales as ε ∝ T⁴. At 15 million K, a proton in the Sun collides billions of times per second but waits ~9 billion years before a successful fusion event!'
                  : selectedFusionId === 'cno-cycle'
                  ? 'The CNO cycle is extraordinarily temperature sensitive: ε ∝ T¹⁶ to T²⁰. A modest 10% rise in core temperature increases fusion power output by over 500%!'
                  : 'Advanced shells require colossal temperatures up to 3 billion K to overcome the ferocious Coulomb repulsion of 14-proton silicon nuclei.'}
              </p>
            </div>

            {/* Subatomic Output Metrics */}
            <div className="md:col-span-6 p-3 sm:p-4 rounded-xl bg-[#030616] border border-cyan-500/20 flex flex-col gap-2.5">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Reaction Output Ticker
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-[#020512] border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Total Energy</span>
                  <span className="text-amber-300 font-bold text-sm">+{totalEnergyMeV.toFixed(2)} MeV</span>
                </div>
                <div className="p-2 rounded-lg bg-[#020512] border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Fusion Events</span>
                  <span className="text-emerald-400 font-bold text-sm">{reactionsCompleted}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#020512] border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Positrons (e⁺)</span>
                  <span className="text-cyan-400 font-bold text-sm">{positronsEmitted}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#020512] border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Neutrinos (νe)</span>
                  <span className="text-indigo-300 font-bold text-sm">{neutrinosEmitted}</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-[#020512] border border-slate-800 text-[10px] sm:text-[11px] font-mono text-slate-300 flex items-center justify-between">
                <span>Mass Defect (Δm = ΔE/c²):</span>
                <span className="text-amber-300 font-bold">
                  {((totalEnergyMeV * 1.78e-30) / 1e-30).toFixed(2)} × 10⁻³⁰ kg
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Mode 2: Quantum Mechanical Tunneling Deep-Dive */}
      {activeSubTab === 'tunneling' && (
        <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[#030616] border border-cyan-500/25 flex flex-col gap-4">
          <div className="border-b border-cyan-500/15 pb-3">
            <h4 className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              Quantum Mechanical Tunneling: The Key to Stellar Life
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Classical mechanics predicted that the Sun should not shine at 15 million Kelvin. Quantum mechanics solved the paradox.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SVG Coulomb Barrier Graph */}
            <div className="p-3 sm:p-4 rounded-xl bg-[#020512] border border-cyan-500/20 flex flex-col gap-2.5">
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                Coulomb Potential Hill vs. Wave Penetration
              </span>

              <div className="w-full aspect-[16/10] bg-[#030718] rounded-lg border border-slate-800 p-1.5 flex items-center justify-center relative overflow-hidden">
                <svg viewBox="0 0 400 240" className="w-full h-full">
                  <line x1="40" y1="200" x2="380" y2="200" stroke="#475569" strokeWidth="1.5" />
                  <line x1="40" y1="20" x2="40" y2="200" stroke="#475569" strokeWidth="1.5" />

                  <text x="210" y="225" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                    Distance (r) →
                  </text>
                  <text x="25" y="30" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 25 30)">
                    Potential Energy (V)
                  </text>

                  <rect x="50" y="140" width="40" height="60" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x="70" y="175" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                    Nuclear Well
                  </text>

                  <path d="M 90 40 Q 140 180 370 195" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                  <text x="160" y="65" fill="#f87171" fontSize="10" fontFamily="monospace">
                    Coulomb Barrier (~1,000 keV)
                  </text>

                  <line x1="40" y1="185" x2="370" y2="185" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x="260" y="178" fill="#fbbf24" fontSize="9" fontFamily="monospace">
                    Kinetic Energy (~1.3 keV)
                  </text>

                  <path
                    d="M 280 185 Q 260 175 240 185 T 200 185 T 160 185 T 120 185 Q 100 185 90 150 Q 80 145 60 155"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="2 2"
                  />
                  <text x="140" y="145" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    ψ(r) Wave Tunneling
                  </text>
                </svg>
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                <span className="text-amber-300 font-bold">The Astonishing Ratio:</span> Classical protons need ~1,000 keV to touch. Solar protons only have ~1.3 keV. The quantum tunneling probability is roughly <span className="text-cyan-300 font-bold">1 in 10²⁸</span> per collision!
              </div>
            </div>

            {/* Explanation Breakdown */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-[#020512] border border-slate-800">
                <h5 className="text-xs font-mono font-bold text-amber-300 uppercase">1. The Electrostatic Coulomb Wall</h5>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Both protons possess identical positive electrical charges (+1e). Electrostatic repulsion skyrockets as distance shrinks ($F \propto 1/r^2$). To touch classically, core temperatures would need to reach billions of Kelvin.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#020512] border border-slate-800">
                <h5 className="text-xs font-mono font-bold text-cyan-300 uppercase">2. Wave-Particle Duality & The Gamow Window</h5>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  In quantum mechanics, protons are probabilistic wave packets. A finite probability exists that the wave penetrates right through the barrier into the attractive strong force well.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#020512] border border-slate-800">
                <h5 className="text-xs font-mono font-bold text-emerald-300 uppercase">3. The Weak Nuclear Force Bottleneck</h5>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Even when two protons tunnel together, they usually separate in $10^{-21}$ seconds unless one proton simultaneously undergoes weak beta decay ($u \rightarrow d + e^+ + \nu_e$) to become a neutron. This bottleneck is why stars live for billions of years!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Mode 3: Advanced Massive Star Onion Core */}
      {activeSubTab === 'onion' && (
        <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[#030616] border border-cyan-500/25 flex flex-col gap-4">
          <div className="border-b border-cyan-500/15 pb-3">
            <h4 className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400 shrink-0" />
              The Onion-Skin Core of Massive Stars (Pre-Supernova)
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Stars over 8 solar masses synthesize elements through successive concentric burning shells, culminating in an inert iron core.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 sm:p-4 rounded-xl bg-[#020512] border border-cyan-500/20 flex flex-col items-center justify-center">
              <svg viewBox="0 0 320 320" className="w-full max-w-[260px] aspect-square">
                <circle cx="160" cy="160" r="140" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
                <circle cx="160" cy="160" r="115" fill="#0369a1" stroke="#0284c7" strokeWidth="1.5" />
                <circle cx="160" cy="160" r="90" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="160" cy="160" r="70" fill="#b45309" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx="160" cy="160" r="50" fill="#c2410c" stroke="#ea580c" strokeWidth="1.5" />
                <circle cx="160" cy="160" r="32" fill="#b91c1c" stroke="#ef4444" strokeWidth="1.5" />
                <circle cx="160" cy="160" r="16" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />

                <text x="160" y="38" fill="#e2e8f0" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  Hydrogen Shell (40M K)
                </text>
                <text x="160" y="62" fill="#7dd3fc" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  Helium (150M K)
                </text>
                <text x="160" y="85" fill="#6ee7b7" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  Carbon (600M K)
                </text>
                <text x="160" y="105" fill="#fde68a" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  Neon (1.2B K)
                </text>
                <text x="160" y="122" fill="#fdba74" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  Oxygen (1.5B K)
                </text>
                <text x="160" y="140" fill="#fca5a5" fontSize="7" fontFamily="monospace" textAnchor="middle">
                  Silicon (3B K)
                </text>
                <text x="160" y="163" fill="#ffffff" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  Fe Core
                </text>
              </svg>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <span className="text-xs uppercase text-amber-400 font-bold block mb-1">
                Burning Phase Lifetimes (25 M☉ Star)
              </span>
              <div className="p-2 rounded bg-[#040816] border border-slate-800 flex justify-between">
                <span className="text-white">Hydrogen → Helium:</span>
                <span className="text-cyan-400 font-bold">~7,000,000 Yrs</span>
              </div>
              <div className="p-2 rounded bg-[#040816] border border-slate-800 flex justify-between">
                <span className="text-white">Helium → Carbon:</span>
                <span className="text-cyan-400 font-bold">~500,000 Yrs</span>
              </div>
              <div className="p-2 rounded bg-[#040816] border border-slate-800 flex justify-between">
                <span className="text-white">Carbon → Neon/Mg:</span>
                <span className="text-amber-400 font-bold">~600 Yrs</span>
              </div>
              <div className="p-2 rounded bg-[#040816] border border-slate-800 flex justify-between">
                <span className="text-white">Neon → Oxygen:</span>
                <span className="text-amber-400 font-bold">~1 Year</span>
              </div>
              <div className="p-2 rounded bg-[#040816] border border-slate-800 flex justify-between">
                <span className="text-white">Oxygen → Silicon:</span>
                <span className="text-rose-400 font-bold">~6 Months</span>
              </div>
              <div className="p-2 rounded bg-rose-950/30 border border-rose-500/30 flex justify-between">
                <span className="text-white font-bold">Silicon → Iron-56:</span>
                <span className="text-rose-400 font-bold">Just 1 Day!</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Mode 4: Nuclear Binding Energy Curve */}
      {activeSubTab === 'binding' && (
        <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[#030616] border border-cyan-500/25 flex flex-col gap-4">
          <div className="border-b border-cyan-500/15 pb-3">
            <h4 className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400 shrink-0" />
              The Nuclear Binding Energy Curve: Why Fusion Stops at Iron
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Binding energy per nucleon reaches a cosmic peak at Iron-56 (8.8 MeV/nucleon). Fusing beyond iron absorbs energy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 sm:p-4 rounded-xl bg-[#020512] border border-cyan-500/20 flex flex-col gap-2.5">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                Binding Energy / Nucleon (MeV) vs. Mass (A)
              </span>

              <div className="w-full aspect-[16/10] bg-[#030718] rounded-lg border border-slate-800 p-1.5 flex items-center justify-center relative overflow-hidden">
                <svg viewBox="0 0 400 240" className="w-full h-full">
                  <line x1="40" y1="200" x2="380" y2="200" stroke="#475569" strokeWidth="1.5" />
                  <line x1="40" y1="20" x2="40" y2="200" stroke="#475569" strokeWidth="1.5" />

                  <text x="210" y="225" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                    Mass Number (A) →
                  </text>
                  <text x="25" y="40" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 25 40)">
                    MeV / Nucleon
                  </text>

                  <path d="M 50 190 Q 70 80 100 65 Q 140 45 180 40 Q 260 55 370 75" fill="none" stroke="#10b981" strokeWidth="3" />

                  <circle cx="180" cy="40" r="5" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
                  <text x="180" y="25" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                    ★ ⁵⁶Fe Peak (8.79 MeV)
                  </text>

                  <circle cx="50" cy="190" r="3.5" fill="#ef4444" />
                  <text x="50" y="205" fill="#f87171" fontSize="9" fontFamily="monospace">
                    ¹H (0)
                  </text>

                  <circle cx="70" cy="80" r="3.5" fill="#38bdf8" />
                  <text x="75" y="80" fill="#38bdf8" fontSize="9" fontFamily="monospace">
                    ⁴He (7.1)
                  </text>

                  <circle cx="100" cy="65" r="3.5" fill="#38bdf8" />
                  <text x="105" y="65" fill="#38bdf8" fontSize="9" fontFamily="monospace">
                    ¹²C (7.7)
                  </text>

                  <rect x="42" y="110" width="136" height="85" fill="rgba(16, 185, 129, 0.08)" stroke="rgba(16, 185, 129, 0.3)" />
                  <text x="110" y="150" fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                    EXOTHERMIC (Releases Energy)
                  </text>

                  <rect x="182" y="110" width="194" height="85" fill="rgba(239, 68, 68, 0.08)" stroke="rgba(239, 68, 68, 0.3)" />
                  <text x="280" y="150" fill="#f87171" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                    ENDOTHERMIC (Absorbs Energy)
                  </text>
                </svg>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#020512] border border-slate-800 space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
              <span className="font-mono text-cyan-300 font-bold block uppercase text-xs">
                Why Iron Triggers Core Collapse Supernovae
              </span>
              <p>
                Elements lighter than Iron-56 release net nuclear binding energy when fused ($E = \Delta m \cdot c^2$), generating outward thermal radiation pressure that supports the star against gravity.
              </p>
              <p>
                Once the core turns into Iron-56, attempting to fuse iron requires <span className="text-rose-400 font-bold">adding energy</span> rather than releasing it. Thermal pressure instantaneously vanishes. The entire core collapses inward at 23% the speed of light, rebounding to unleash a catastrophic Type II Supernova.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
