import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import {
  STELLAR_LIFECYCLE_TRACKS,
  StellarLifeCycleTrack,
  StellarLifeCycleStageData,
} from '../data/stellarLifeCyclesData';
import { StarData } from '../types';
import { STARS_CATALOG } from '../data/stars';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Atom,
  Flame,
  Scale,
  Sparkles,
  Thermometer,
  Zap,
  Activity,
  Layers,
  Compass,
  Info,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Sliders,
  Sun,
  ShieldAlert,
} from 'lucide-react';

interface StellarLifeCycleVisualizerProps {
  onSelectStar?: (star: StarData) => void;
  onOpenCatalog?: () => void;
}

export const StellarLifeCycleVisualizer: React.FC<StellarLifeCycleVisualizerProps> = ({
  onSelectStar,
  onOpenCatalog,
}) => {
  // 1. Active Track Selection
  const [activeTrackId, setActiveTrackId] = useState<string>('track-solar-mass');
  const activeTrack: StellarLifeCycleTrack = useMemo(() => {
    return (
      STELLAR_LIFECYCLE_TRACKS.find((t) => t.id === activeTrackId) ||
      STELLAR_LIFECYCLE_TRACKS[1]
    );
  }, [activeTrackId]);

  // 2. Stage Navigation & Slider State
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(1); // Default to Main Sequence for Sun
  // Normalized slider value from 0 to 100
  const [sliderValue, setSliderValue] = useState<number>(45);
  const [sliderMode, setSliderMode] = useState<'milestone' | 'continuous'>('milestone');
  const [timelineZoom, setTimelineZoom] = useState<number>(1); // 1x, 2x, 3x zoom
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5x, 1x, 2x, 4x
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // 3. Ensure stage index is valid when switching tracks
  useEffect(() => {
    setCurrentStageIndex((prev) => Math.min(prev, activeTrack.stages.length - 1));
    const targetStage = activeTrack.stages[Math.min(currentStageIndex, activeTrack.stages.length - 1)];
    if (targetStage) {
      setSliderValue(targetStage.progressPct);
    }
  }, [activeTrackId]);

  const currentStage: StellarLifeCycleStageData = useMemo(() => {
    return activeTrack.stages[currentStageIndex] || activeTrack.stages[0];
  }, [activeTrack, currentStageIndex]);

  // Find corresponding star in catalog for exemplar button
  const catalogStar = useMemo(() => {
    if (!currentStage.catalogStarId) return null;
    return STARS_CATALOG.find((s) => s.id === currentStage.catalogStarId) || null;
  }, [currentStage]);

  // Jump to specific stage
  const jumpToStage = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, activeTrack.stages.length - 1));
    setCurrentStageIndex(clampedIndex);
    setSliderValue(activeTrack.stages[clampedIndex].progressPct);
  }, [activeTrack]);

  // Handle continuous slider change
  const handleSliderChange = (newVal: number) => {
    setSliderValue(newVal);

    // Find closest stage corresponding to this progress percentage
    let closestIndex = 0;
    let minDiff = Infinity;
    activeTrack.stages.forEach((stage, idx) => {
      const diff = Math.abs(stage.progressPct - newVal);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    if (closestIndex !== currentStageIndex) {
      setCurrentStageIndex(closestIndex);
    }
  };

  // Playback animation ticker
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSliderValue((prev) => {
        const step = 0.5 * playbackSpeed;
        const nextVal = prev + step;
        if (nextVal >= 100) {
          setIsPlaying(false);
          return 100;
        }

        // Check if stage changed
        let closestIndex = 0;
        let minDiff = Infinity;
        activeTrack.stages.forEach((stage, idx) => {
          const diff = Math.abs(stage.progressPct - nextVal);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = idx;
          }
        });
        setCurrentStageIndex(closestIndex);

        return nextVal;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, activeTrack]);

  // =========================================================================
  // 4. Three.js 3D WebGL Canvas Engine
  // =========================================================================
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const starGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // References to procedural objects in the scene
  const starMeshRef = useRef<THREE.Mesh | null>(null);
  const coronaMeshRef = useRef<THREE.Mesh | null>(null);
  const nebulaParticlesRef = useRef<THREE.Points | null>(null);
  const planetaryNebulaRef = useRef<THREE.Group | null>(null);
  const supernovaShellRef = useRef<THREE.Group | null>(null);
  const pulsarJetsRef = useRef<THREE.Group | null>(null);
  const blackHoleGroupRef = useRef<THREE.Group | null>(null);
  const dustRingRef = useRef<THREE.Mesh | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const shaderMaterialRef = useRef<THREE.ShaderMaterial | null>(null);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 8, 28);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x223344, 0.6);
    scene.add(ambientLight);

    // Primary Central Point Light
    const pointLight = new THREE.PointLight(0xffeedd, 3.0, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // Star Parent Group
    const starGroup = new THREE.Group();
    scene.add(starGroup);
    starGroupRef.current = starGroup;

    // 1. Core Star Sphere Mesh with custom procedural plasma shader
    const starGeometry = new THREE.SphereGeometry(4, 64, 64);
    const starShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color('#ffea78') },
        coronaColor: { value: new THREE.Color('#ffaa22') },
        pulseIntensity: { value: 0.2 },
        darkSpots: { value: 0.15 },
        isRemnant: { value: 0.0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 baseColor;
        uniform vec3 coronaColor;
        uniform float pulseIntensity;
        uniform float darkSpots;
        uniform float isRemnant;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;

        // Dave Hoskins 3D hash
        float hash(vec3 p) {
          p = fract(p * 0.1031);
          p += dot(p, p.zyx + 31.32);
          return fract((p.x + p.y) * p.z);
        }

        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          vec3 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), u.x),
                mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), u.x), u.y),
            mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), u.x),
                mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), u.x), u.y),
            u.z
          );
        }

        float fbm(vec3 p) {
          float v = 0.0;
          float a = 0.5;
          for(int i = 0; i < 4; i++) {
            v += a * noise(p);
            p = p * 2.0 + vec3(12.5, 3.2, 7.8);
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = vec3(0.0, 0.0, 1.0);
          float limb = clamp(dot(normal, viewDir), 0.0, 1.0);
          float limbDark = pow(limb, 0.55);

          vec3 normPos = normalize(vPosition);
          float gran = fbm(normPos * 5.0 + vec3(time * 0.08, -time * 0.05, time * 0.03));
          float granFine = fbm(normPos * 12.0 - vec3(time * 0.12, time * 0.06, 0.0));

          vec3 surfaceColor = mix(baseColor * 0.85, coronaColor * 1.25, gran * 0.65 + granFine * 0.35);

          // Dark sunspot / convection cell depressions
          if (darkSpots > 0.05) {
            float spotNoise = fbm(normPos * 4.0 + vec3(0.0, time * 0.02, 0.0));
            if (spotNoise < 0.28) {
              surfaceColor = mix(surfaceColor, baseColor * 0.25, darkSpots);
            }
          }

          // Limb darkening
          surfaceColor *= (0.45 + 0.55 * limbDark);

          // Corona rim glow
          float fresnel = pow(1.0 - limb, 3.2);
          surfaceColor += coronaColor * fresnel * 1.2;

          gl_FragColor = vec4(surfaceColor, 1.0);
        }
      `,
    });
    shaderMaterialRef.current = starShaderMat;

    const starMesh = new THREE.Mesh(starGeometry, starShaderMat);
    starGroup.add(starMesh);
    starMeshRef.current = starMesh;

    // 2. Atmospheric Corona Glow Sphere
    const coronaGeo = new THREE.SphereGeometry(4.7, 32, 32);
    const coronaMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        glowColor: { value: new THREE.Color('#ffaa22') },
        intensity: { value: 0.8 },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float intensity;
        varying vec3 vNormal;
        void main() {
          float rim = pow(clamp(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 2.2);
          gl_FragColor = vec4(glowColor * 1.6, rim * intensity);
        }
      `,
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    starGroup.add(coronaMesh);
    coronaMeshRef.current = coronaMesh;

    // 3. Protostellar Nebula Particle Cloud System
    const nebulaParticleCount = 800;
    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaPos = new Float32Array(nebulaParticleCount * 3);
    const nebulaColors = new Float32Array(nebulaParticleCount * 3);
    const nebulaSizes = new Float32Array(nebulaParticleCount);

    for (let i = 0; i < nebulaParticleCount; i++) {
      // Swirling disk spiral distribution
      const radius = 3 + Math.random() * 16;
      const angle = Math.random() * Math.PI * 2 + radius * 0.4;
      const height = (Math.random() - 0.5) * (3.0 + radius * 0.25);

      nebulaPos[i * 3] = Math.cos(angle) * radius;
      nebulaPos[i * 3 + 1] = height;
      nebulaPos[i * 3 + 2] = Math.sin(angle) * radius;

      // Color variation (dusty orange to ethereal purple)
      const colT = Math.random();
      const col = new THREE.Color().lerpColors(
        new THREE.Color('#ff6622'),
        new THREE.Color('#aa33ff'),
        colT
      );
      nebulaColors[i * 3] = col.r;
      nebulaColors[i * 3 + 1] = col.g;
      nebulaColors[i * 3 + 2] = col.b;

      nebulaSizes[i] = 1.2 + Math.random() * 2.4;
    }

    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
    nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));
    nebulaGeo.setAttribute('size', new THREE.BufferAttribute(nebulaSizes, 1));

    const nebulaMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const nebulaParticles = new THREE.Points(nebulaGeo, nebulaMat);
    nebulaParticles.visible = false;
    starGroup.add(nebulaParticles);
    nebulaParticlesRef.current = nebulaParticles;

    // 4. Planetary Nebula Expanding Shells
    const planetaryNebulaGroup = new THREE.Group();
    // Inner turquoise shell
    const innerShellMat = new THREE.MeshBasicMaterial({
      color: 0x00ffee,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const innerShell = new THREE.Mesh(new THREE.SphereGeometry(7.5, 24, 24), innerShellMat);
    planetaryNebulaGroup.add(innerShell);

    // Outer magenta envelope
    const outerShellMat = new THREE.MeshBasicMaterial({
      color: 0xff22aa,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const outerShell = new THREE.Mesh(new THREE.SphereGeometry(12.0, 24, 24), outerShellMat);
    planetaryNebulaGroup.add(outerShell);

    planetaryNebulaGroup.visible = false;
    starGroup.add(planetaryNebulaGroup);
    planetaryNebulaRef.current = planetaryNebulaGroup;

    // 5. Supernova Blast Shell & Particles
    const supernovaGroup = new THREE.Group();
    const blastShellMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      wireframe: true,
      blending: THREE.AdditiveBlending,
    });
    const blastShell = new THREE.Mesh(new THREE.SphereGeometry(8.5, 32, 32), blastShellMat);
    supernovaGroup.add(blastShell);

    // Supernova debris particles
    const snParticleCount = 500;
    const snGeo = new THREE.BufferGeometry();
    const snPos = new Float32Array(snParticleCount * 3);
    const snCols = new Float32Array(snParticleCount * 3);
    for (let i = 0; i < snParticleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 5.0 + Math.random() * 8.0;

      snPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      snPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      snPos[i * 3 + 2] = r * Math.cos(phi);

      const col = new THREE.Color().setHSL(0.55 + Math.random() * 0.35, 1.0, 0.7);
      snCols[i * 3] = col.r;
      snCols[i * 3 + 1] = col.g;
      snCols[i * 3 + 2] = col.b;
    }
    snGeo.setAttribute('position', new THREE.BufferAttribute(snPos, 3));
    snGeo.setAttribute('color', new THREE.BufferAttribute(snCols, 3));

    const snMat = new THREE.PointsMaterial({
      size: 0.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const snParticles = new THREE.Points(snGeo, snMat);
    supernovaGroup.add(snParticles);

    supernovaGroup.visible = false;
    starGroup.add(supernovaGroup);
    supernovaShellRef.current = supernovaGroup;

    // 6. Pulsar Magnetic Jet Funnels
    const pulsarGroup = new THREE.Group();
    // North and South Relativistic Synchrotron Beam Cones
    const beamGeo = new THREE.ConeGeometry(2.4, 18, 32, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const beamNorth = new THREE.Mesh(beamGeo, beamMat);
    beamNorth.position.set(0, 9.5, 0);
    pulsarGroup.add(beamNorth);

    const beamSouth = new THREE.Mesh(beamGeo, beamMat);
    beamSouth.position.set(0, -9.5, 0);
    beamSouth.rotation.x = Math.PI;
    pulsarGroup.add(beamSouth);

    // Magnetic Torus dipole field line
    const torusGeo = new THREE.TorusGeometry(3.2, 0.1, 16, 64);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x9933ff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.rotation.x = Math.PI / 2;
    pulsarGroup.add(torusMesh);

    pulsarGroup.rotation.z = 0.4; // Magnetic axis tilt
    pulsarGroup.visible = false;
    starGroup.add(pulsarGroup);
    pulsarJetsRef.current = pulsarGroup;

    // 7. Black Hole Event Horizon, Accretion Disk & Jets
    const blackHoleGroup = new THREE.Group();

    // Event Horizon Sphere (Pure Total Absorption)
    const horizonGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
    blackHoleGroup.add(horizonMesh);

    // Photon Sphere Lensing Glow
    const photonRingGeo = new THREE.RingGeometry(1.52, 1.85, 48);
    const photonRingMat = new THREE.MeshBasicMaterial({
      color: 0x00ddff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const photonRing = new THREE.Mesh(photonRingGeo, photonRingMat);
    blackHoleGroup.add(photonRing);

    // Accretion Disk Ring
    const diskGeo = new THREE.RingGeometry(2.0, 9.5, 64);
    const diskMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const accretionDisk = new THREE.Mesh(diskGeo, diskMat);
    accretionDisk.rotation.x = Math.PI / 2.5;
    blackHoleGroup.add(accretionDisk);

    // Relativistic Polar Jets
    const jetGeo = new THREE.CylinderGeometry(0.2, 1.2, 22, 16);
    const jetMat = new THREE.MeshBasicMaterial({
      color: 0x00eeff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const jetMesh = new THREE.Mesh(jetGeo, jetMat);
    jetMesh.position.set(0, 0, 0);
    blackHoleGroup.add(jetMesh);

    blackHoleGroup.visible = false;
    starGroup.add(blackHoleGroup);
    blackHoleGroupRef.current = blackHoleGroup;

    // 8. Carbon Star circumstellar soot/graphite dust ring
    const carbonDustGeo = new THREE.RingGeometry(5.2, 8.5, 48);
    const carbonDustMat = new THREE.MeshBasicMaterial({
      color: 0x441100,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const carbonDustRing = new THREE.Mesh(carbonDustGeo, carbonDustMat);
    carbonDustRing.rotation.x = Math.PI / 2.3;
    carbonDustRing.visible = false;
    starGroup.add(carbonDustRing);
    dustRingRef.current = carbonDustRing;

    // Background Subtle Stars
    const bgStarCount = 400;
    const bgGeo = new THREE.BufferGeometry();
    const bgPos = new Float32Array(bgStarCount * 3);
    for (let i = 0; i < bgStarCount * 3; i += 3) {
      bgPos[i] = (Math.random() - 0.5) * 400;
      bgPos[i + 1] = (Math.random() - 0.5) * 400;
      bgPos[i + 2] = -50 - Math.random() * 200;
    }
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    const bgMat = new THREE.PointsMaterial({
      size: 0.8,
      color: 0x7799bb,
      transparent: true,
      opacity: 0.6,
    });
    const bgStars = new THREE.Points(bgGeo, bgMat);
    scene.add(bgStars);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Update shader uniforms
      if (shaderMaterialRef.current) {
        shaderMaterialRef.current.uniforms.time.value = elapsedTime;
      }

      // Auto-rotation
      if (starGroupRef.current && autoRotate && !isDraggingRef.current) {
        starGroupRef.current.rotation.y += 0.006;
      }

      // Special object animations
      if (nebulaParticlesRef.current && nebulaParticlesRef.current.visible) {
        nebulaParticlesRef.current.rotation.y += 0.003;
      }
      if (pulsarJetsRef.current && pulsarJetsRef.current.visible) {
        pulsarJetsRef.current.rotation.y += 0.08; // High-speed spin
      }
      if (blackHoleGroupRef.current && blackHoleGroupRef.current.visible) {
        blackHoleGroupRef.current.rotation.y += 0.02;
      }
      if (planetaryNebulaRef.current && planetaryNebulaRef.current.visible) {
        planetaryNebulaRef.current.rotation.z += 0.004;
      }
      if (supernovaShellRef.current && supernovaShellRef.current.visible) {
        supernovaShellRef.current.rotation.y += 0.01;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  // Update 3D Star Object based on Current Stage & Slider Progress
  useEffect(() => {
    if (!starGroupRef.current || !shaderMaterialRef.current || !pointLightRef.current) return;

    const {
      visualType,
      colorHex,
      secondaryColorHex,
      radiusSolar,
      temperatureKelvin,
    } = currentStage;

    const baseCol = new THREE.Color(colorHex);
    const coronaCol = new THREE.Color(secondaryColorHex || colorHex);

    // Update shader material
    shaderMaterialRef.current.uniforms.baseColor.value = baseCol;
    shaderMaterialRef.current.uniforms.coronaColor.value = coronaCol;

    // Update point light
    pointLightRef.current.color = baseCol;

    // Toggle special stage visualizers
    if (nebulaParticlesRef.current) {
      nebulaParticlesRef.current.visible = visualType === 'nebula';
    }
    if (planetaryNebulaRef.current) {
      planetaryNebulaRef.current.visible = visualType === 'planetary-nebula';
    }
    if (supernovaShellRef.current) {
      supernovaShellRef.current.visible = visualType === 'supernova';
    }
    if (pulsarJetsRef.current) {
      pulsarJetsRef.current.visible = visualType === 'neutron-star';
    }
    if (blackHoleGroupRef.current) {
      blackHoleGroupRef.current.visible = visualType === 'black-hole';
    }
    if (dustRingRef.current) {
      dustRingRef.current.visible = visualType === 'carbon-star';
    }

    // Adjust primary photosphere mesh visibility & scale
    if (starMeshRef.current && coronaMeshRef.current) {
      if (visualType === 'black-hole') {
        starMeshRef.current.visible = false;
        coronaMeshRef.current.visible = false;
      } else {
        starMeshRef.current.visible = true;
        coronaMeshRef.current.visible = visualType !== 'white-dwarf';

        // Dynamic 3D Scale Calculation
        let visualScale = 1.0;
        if (visualType === 'giant') {
          visualScale = 2.4;
        } else if (visualType === 'supergiant' || visualType === 'hypergiant') {
          visualScale = 3.2;
        } else if (visualType === 'carbon-star') {
          visualScale = 2.1;
        } else if (visualType === 'white-dwarf') {
          visualScale = 0.35; // Dense compact dwarf
        } else if (visualType === 'neutron-star') {
          visualScale = 0.22; // Ultra-compact 20 km relic
        } else if (visualType === 'nebula') {
          visualScale = 0.8;
        } else if (visualType === 'supernova') {
          visualScale = 1.2;
        } else {
          // Main sequence scale depends on star type
          visualScale = radiusSolar < 0.5 ? 0.65 : radiusSolar > 4 ? 1.6 : 1.0;
        }

        starMeshRef.current.scale.set(visualScale, visualScale, visualScale);
        coronaMeshRef.current.scale.set(visualScale * 1.18, visualScale * 1.18, visualScale * 1.18);
      }
    }
  }, [currentStage]);

  // Pointer Drag Event Handlers for 3D Orbiting
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !starGroupRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    starGroupRef.current.rotation.y += deltaX * 0.01;
    starGroupRef.current.rotation.x += deltaY * 0.01;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    const zoomSpeed = 0.05;
    const newZ = cameraRef.current.position.z + e.deltaY * zoomSpeed;
    cameraRef.current.position.z = Math.max(10, Math.min(60, newZ));
  };

  const resetCamera = () => {
    if (!cameraRef.current || !starGroupRef.current) return;
    cameraRef.current.position.set(0, 8, 28);
    cameraRef.current.lookAt(0, 0, 0);
    starGroupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div className={`p-4 sm:p-6 rounded-2xl bg-[#030614] border border-cyan-500/25 flex flex-col gap-6 shadow-2xl transition-all duration-300 ${isExpanded ? 'fixed inset-2 sm:inset-4 z-50 overflow-y-auto max-w-none bg-[#020512]/98' : ''}`}>
      
      {/* 1. Header with Mass Branch Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-cyan-500/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Stellar Life Cycles</span>
                <span className="text-[11px] font-mono font-normal text-cyan-400/90 px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30">
                  3D Scalable Visualizer
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                From molecular cloud collapse to cosmic remnants: scrub through billions of years of nuclear astrophysics.
              </p>
            </div>
          </div>
        </div>

        {/* Mass Branch Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
          {STELLAR_LIFECYCLE_TRACKS.map((track) => {
            const isActive = track.id === activeTrackId;
            return (
              <button
                key={track.id}
                onClick={() => {
                  setActiveTrackId(track.id);
                  jumpToStage(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/25 to-blue-600/25 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                    : 'bg-[#020512] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {track.shortTitle}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive 3D Stage + Real-Time Astrophysics Telemetry HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Column: 3D Stage Viewport (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="relative w-full h-[340px] sm:h-[420px] rounded-2xl bg-[#02040d] border border-cyan-500/25 overflow-hidden shadow-inner flex flex-col justify-between select-none">
            
            {/* 3D WebGL Canvas */}
            <div
              ref={canvasContainerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onWheel={handleWheel}
              className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
            />

            {/* Stage Badge Overlay (Top Left) */}
            <div className="relative z-10 m-3 pointer-events-none flex flex-col gap-1 max-w-[80%]">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-[#040816]/90 border border-cyan-500/30 backdrop-blur-md">
                  {currentStage.epochLabel}
                </span>
                <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-[#040816]/90 border border-slate-800 backdrop-blur-md">
                  {currentStage.ageYears}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white drop-shadow-md">
                {currentStage.stageName}
              </h4>
            </div>

            {/* 3D Controls Overlay (Top Right) */}
            <div className="relative z-10 m-3 flex items-center gap-1.5 self-end pointer-events-auto">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                title={autoRotate ? 'Pause 3D auto-orbit' : 'Resume 3D auto-orbit'}
                className={`p-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer backdrop-blur-md ${
                  autoRotate
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    : 'bg-[#040816]/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={resetCamera}
                title="Reset Camera Angle"
                className="p-1.5 rounded-lg bg-[#040816]/80 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-xs font-mono transition-all cursor-pointer backdrop-blur-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse view' : 'Expand view'}
                className="p-1.5 rounded-lg bg-[#040816]/80 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-xs font-mono transition-all cursor-pointer backdrop-blur-md"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* 3D Hint Bottom Left */}
            <div className="relative z-10 m-3 pointer-events-none flex items-center justify-between text-[10px] font-mono text-slate-500">
              <div className="flex items-center gap-1 bg-[#020512]/80 px-2 py-0.5 rounded border border-slate-800/80 backdrop-blur-sm">
                <span>Drag to Orbit</span>
                <span>•</span>
                <span>Scroll to Zoom</span>
              </div>
              <div className="flex items-center gap-1 bg-[#020512]/80 px-2 py-0.5 rounded border border-slate-800/80 backdrop-blur-sm text-cyan-400">
                <span>Stage {currentStageIndex + 1} of {activeTrack.stages.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Astrophysics Telemetry HUD (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          
          {/* Hydrostatic Balance Meter */}
          <div className="p-4 rounded-xl bg-[#040818]/90 border border-cyan-500/20 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
                <Scale className="w-4 h-4 text-cyan-400" />
                <span>Hydrostatic Balance State</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-400">
                {currentStage.hydrostaticLabel}
              </span>
            </div>

            {/* Visual Balance Bar */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                <span className="text-blue-400">Gravitational Infall</span>
                <span className="text-emerald-400">Equilibrium</span>
                <span className="text-rose-400">Radiation Expansion</span>
              </div>
              <div className="h-2 rounded-full bg-[#020512] border border-slate-800 relative overflow-hidden flex items-center">
                {/* Center marker */}
                <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-600 z-10" />
                {/* Dynamic Balance indicator bar */}
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    currentStage.radiationPressureVsGravity > 0.2
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                      : currentStage.radiationPressureVsGravity < -0.2
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-500'
                      : 'bg-emerald-400'
                  }`}
                  style={{
                    width: `${Math.max(15, Math.abs(currentStage.radiationPressureVsGravity) * 50 + 25)}%`,
                    marginLeft: currentStage.radiationPressureVsGravity < 0
                      ? `${Math.max(0, 50 - Math.abs(currentStage.radiationPressureVsGravity) * 50)}%`
                      : '50%',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Real-time Physical Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-[#040818]/90 border border-slate-800 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Physical Radius</span>
              </div>
              <div className="text-xs font-bold text-white font-mono truncate">
                {currentStage.radiusLabel}
              </div>
              <div className="text-[10px] text-slate-500 font-sans">
                {currentStage.radiusSolar >= 1 ? `${currentStage.radiusSolar} × Sun Radius` : `${(currentStage.radiusSolar * 100).toFixed(2)}% of Sun`}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#040818]/90 border border-slate-800 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                <span>Surface Temp (T_eff)</span>
              </div>
              <div className="text-xs font-bold text-white font-mono truncate">
                {currentStage.temperatureLabel}
              </div>
              <div className="text-[10px] text-slate-500 font-sans">
                Luminosity: {currentStage.luminosityLabel}
              </div>
            </div>
          </div>

          {/* Nuclear Fusion Mechanism Card */}
          <div className="p-3.5 rounded-xl bg-[#040818]/90 border border-cyan-500/20 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 font-mono">
              <Atom className="w-4 h-4 text-cyan-400" />
              <span>Core Fusion Engine</span>
            </div>
            <div className="text-xs font-bold text-white">
              {currentStage.coreFusionFuel}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {currentStage.fusionMechanism}
            </p>
          </div>

          {/* Cosmic Analog Star Card (Clickable to Catalog!) */}
          <div className="p-3.5 rounded-xl bg-[#040818]/90 border border-slate-800 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                Cosmic Exemplar in Catalog
              </span>
              <div className="text-xs font-bold text-white truncate">
                {currentStage.analogStarName}
              </div>
              {currentStage.analogStarConstellation && (
                <div className="text-[10px] text-slate-400 font-mono">
                  Constellation: {currentStage.analogStarConstellation}
                </div>
              )}
            </div>

            {catalogStar && onSelectStar ? (
              <button
                onClick={() => onSelectStar(catalogStar)}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-mono transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>View Star</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            ) : onOpenCatalog ? (
              <button
                onClick={onOpenCatalog}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>Catalog</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            ) : null}
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. 3D-STYLE SCALABLE SLIDER INTERFACE                                     */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#020512] border border-cyan-500/30 flex flex-col gap-4 shadow-xl">
        
        {/* Controls Ribbon: Playback, Speed, Zoom, Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/15 pb-3">
          
          {/* Left: Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Pause simulation' : 'Play evolutionary simulation'}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer active:scale-95"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Lifecycle'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                jumpToStage(0);
              }}
              title="Reset to Stage 1"
              className="p-1.5 rounded-xl bg-[#040816] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Prev / Next Stage Buttons */}
            <div className="flex items-center gap-1 bg-[#040816] p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => jumpToStage(currentStageIndex - 1)}
                disabled={currentStageIndex === 0}
                title="Previous stage"
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-slate-400 px-1">
                {currentStageIndex + 1}/{activeTrack.stages.length}
              </span>
              <button
                onClick={() => jumpToStage(currentStageIndex + 1)}
                disabled={currentStageIndex === activeTrack.stages.length - 1}
                title="Next stage"
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center: Playback Speed Selector */}
          <div className="flex items-center gap-1 bg-[#040816] p-1 rounded-xl border border-slate-800 text-[10px] font-mono">
            <span className="text-slate-500 px-1">Speed:</span>
            {[0.5, 1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                  playbackSpeed === spd
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Right: Scalable Granularity Zoom */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[10px] text-slate-500">Timeline Scale:</span>
            <div className="flex items-center gap-1 bg-[#040816] p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setTimelineZoom(Math.max(1, timelineZoom - 0.5))}
                disabled={timelineZoom <= 1}
                title="Zoom out timescale"
                className="p-1 rounded-md text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <span className="text-[10px] font-bold text-cyan-300 px-1">
                {timelineZoom}x
              </span>
              <button
                onClick={() => setTimelineZoom(Math.min(3, timelineZoom + 0.5))}
                disabled={timelineZoom >= 3}
                title="Zoom in timescale"
                className="p-1 rounded-md text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* 3D Interactive Scalable Slider Rail */}
        <div className="flex flex-col gap-2.5 pt-2 select-none">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Cosmic Time Scrubbing</span>
            </span>
            <span className="text-cyan-300 font-bold">
              Epoch: {currentStage.ageYears} ({sliderValue.toFixed(1)}% Lifespan)
            </span>
          </div>

          {/* 3D Beveled Track Container */}
          <div className="relative py-4">
            
            {/* Background 3D Rail Track with Glowing Recessed Channel */}
            <div className="h-4 w-full rounded-full bg-[#04081a] border border-cyan-500/35 relative shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] overflow-hidden">
              
              {/* Millimeter Scale Hatching Lines */}
              <div className="absolute inset-0 opacity-25 flex justify-between px-1 items-center pointer-events-none">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-0.5 ${i % 5 === 0 ? 'h-3 bg-cyan-400' : 'h-1.5 bg-slate-600'}`}
                  />
                ))}
              </div>

              {/* Glowing Progress Fill */}
              <div
                className="h-full bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-400 transition-all duration-75 relative shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                style={{ width: `${sliderValue}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_#ffffff]" />
              </div>
            </div>

            {/* Native Scalable Range Input (Invisible overlay for smooth drag & touch) */}
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={sliderValue}
              onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
              aria-label="Stellar evolutionary timeline slider"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />

            {/* Milestone Markers along the Track */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none px-1">
              {activeTrack.stages.map((stage, idx) => {
                const isSelected = idx === currentStageIndex;
                return (
                  <div
                    key={stage.id}
                    className="relative flex flex-col items-center pointer-events-auto"
                    style={{ left: `${stage.progressPct}%`, position: 'absolute', transform: 'translateX(-50%)' }}
                  >
                    {/* Node Pip */}
                    <button
                      onClick={() => jumpToStage(idx)}
                      title={`${stage.stageName} (${stage.ageYears})`}
                      className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'bg-cyan-400 border-white scale-125 shadow-[0_0_16px_rgba(6,182,212,0.9)] z-30'
                          : 'bg-[#030614] border-cyan-500/60 hover:border-cyan-300 hover:scale-110 z-10'
                      }`}
                    >
                      <span className={`text-[9px] font-mono font-bold ${isSelected ? 'text-slate-950' : 'text-cyan-300'}`}>
                        {idx + 1}
                      </span>
                    </button>

                    {/* Milestone Name Below */}
                    <span
                      onClick={() => jumpToStage(idx)}
                      className={`text-[9px] font-mono mt-3 text-center whitespace-nowrap cursor-pointer transition-colors max-w-[80px] sm:max-w-[100px] truncate ${
                        isSelected ? 'text-cyan-300 font-bold' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {stage.stageName.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Stage Narrative Box */}
        <div className="mt-4 p-4 rounded-xl bg-[#040816]/90 border border-cyan-500/20 flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentStage.stageName}</span>
            </span>
            <span className="text-cyan-400/90 font-mono text-[11px]">
              Duration: {currentStage.duration}
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {currentStage.description}
          </p>
          <div className="p-2.5 rounded-lg bg-[#020512] border border-slate-800 text-[11px] text-slate-400 font-mono leading-relaxed mt-1">
            <span className="text-cyan-400 font-bold">Astrophysics Mechanism: </span>
            {currentStage.astrophysicsDetail}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. ALL MILESTONES ROADMAP GRID (Interactive Cards)                        */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Complete Evolutionary Roadmap ({activeTrack.title})</span>
          </h4>
          <span className="text-[10px] font-mono text-cyan-400">
            Click any milestone to jump
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {activeTrack.stages.map((stage, idx) => {
            const isSelected = idx === currentStageIndex;
            return (
              <div
                key={stage.id}
                onClick={() => jumpToStage(idx)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 relative overflow-hidden group ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-950/50 to-[#020512] border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.25)]'
                    : 'bg-[#040816]/90 border-slate-800/80 hover:border-slate-700 hover:bg-[#060c22]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                    <span className={`px-1.5 py-0.5 rounded font-bold ${isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      STAGE {idx + 1}
                    </span>
                    <span className="text-slate-500 font-mono text-[9px]">{stage.ageYears}</span>
                  </div>
                  <div className={`text-xs font-bold transition-colors ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-cyan-300'}`}>
                    {stage.stageName}
                  </div>
                  <div className="text-[10px] text-cyan-400/80 font-mono mt-0.5">
                    {stage.duration}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">{stage.temperatureLabel}</span>
                  <span className="text-slate-400 truncate max-w-[60px]">{stage.radiusLabel.split(' ')[0]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
