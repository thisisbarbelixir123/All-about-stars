import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { 
  Sun, 
  Orbit, 
  RotateCw, 
  RotateCcw,
  Maximize2, 
  Minimize2, 
  Flame, 
  Snowflake, 
  Sparkles,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Eye,
  Focus,
  Layers,
  Compass,
  Info,
  Globe,
  ChevronDown,
  ChevronUp,
  Crosshair,
  Play,
  Pause,
  ExternalLink,
  Share2
} from 'lucide-react';
import { StarData } from '../types';
import { formatPhysicalDiameter } from '../utils/formatters';
import { createContinuousGridMesh, ContinuousGridHandle } from '../utils/continuousGrid';
import {
  createStarMeshGroup,
  SUN_REFERENCE_STAR,
  getEffectiveSolarDiameter,
  isCompactRemnant,
  isPulsarOrNeutronStar,
  getBrownDwarfType
} from '../utils/starShaderUtils';
import {
  SOLAR_SYSTEM_BODIES,
  SolarSystemBody,
  solveKepler,
  calculateKeplerianPosition,
  generateKeplerianOrbitPoints,
  generateKeplerianRibbonGeometry
} from '../utils/orbitalUtils';


interface StarDossier3DStageProps {
  star: StarData;
  onStarClick?: (starId?: string) => void;
  initialMode?: 'compare-sun' | 'compare-earth' | 'solar-system';
}

// Planetary orbital configuration (AU_SCALE = 10 units per AU)
const AU_SCALE = 10.0;

export type SolarBodyConfig = SolarSystemBody & { distanceAU: number };

// Major planets and IAU-recognized dwarf planets (Ceres, Pluto, Haumea, Makemake, Eris)
// with true Keplerian elements (eccentricity, inclination, perihelion, aphelion)
export const SOLAR_BODIES: SolarBodyConfig[] = SOLAR_SYSTEM_BODIES.map((body) => ({
  ...body,
  distanceAU: body.semiMajorAxisAU,
}));

// Earth Physical Reference Standards
export const EARTH_RADIUS_KM = 6371.0;
export const EARTH_DIAMETER_KM = 12742.0;
// In Solar units (where Sun radius = 1.0 = 696,350 km)
export const EARTH_RADIUS_SOLAR = EARTH_RADIUS_KM / 696350.0; // ~0.0091491

// High-resolution realistic NASA Blue Marble & Earth Atmosphere Assets
const EARTH_TEXTURE_URL = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg';
const EARTH_SPECULAR_URL = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_specular_2048.jpg';
const EARTH_CLOUDS_URL = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_clouds_1024.png';

// Global texture cache for Earth textures to prevent repeated creation and network requests
let cachedEarthCanvasTexture: THREE.CanvasTexture | null = null;
let cachedEarthTexture: THREE.Texture | null = null;
let cachedSpecularTexture: THREE.Texture | null = null;
let cachedCloudsTexture: THREE.Texture | null = null;

function getEarthFallbackTexture(): THREE.CanvasTexture {
  if (cachedEarthCanvasTexture) return cachedEarthCanvasTexture;
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
    oceanGrad.addColorStop(0, '#0a2342');
    oceanGrad.addColorStop(0.5, '#124578');
    oceanGrad.addColorStop(1, '#0a2342');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 1024, 512);

    ctx.fillStyle = '#22543d';
    ctx.beginPath();
    ctx.ellipse(620, 160, 190, 85, 0.1, 0, Math.PI * 2);
    ctx.ellipse(710, 240, 60, 50, 0.4, 0, Math.PI * 2);
    ctx.ellipse(540, 280, 85, 110, 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.ellipse(540, 230, 75, 40, 0.05, 0, Math.PI * 2);
    ctx.ellipse(650, 210, 60, 30, 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#22543d';
    ctx.beginPath();
    ctx.ellipse(250, 160, 110, 75, -0.2, 0, Math.PI * 2);
    ctx.ellipse(280, 250, 25, 45, 0.5, 0, Math.PI * 2);
    ctx.ellipse(340, 340, 65, 95, 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.ellipse(820, 350, 65, 45, -0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(512, 18, 512, 28, 0, 0, Math.PI * 2);
    ctx.ellipse(512, 495, 512, 35, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  cachedEarthCanvasTexture = texture;
  return texture;
}

/**
 * Creates a photorealistic 3D Earth mesh group with high-resolution NASA Blue Marble
 * surface imagery, ocean specular reflectivity, an independent floating cloud layer,
 * and Rayleigh scattering atmospheric limb glow.
 */
function createEarthMeshGroup(radius: number, wireframe: boolean): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Earth_Comparison_Group';
  group.userData.isEarthGroup = true;

  // 1. Procedural instant-fallback canvas texture (cached, zero allocation on repeated calls)
  const fallbackTexture = getEarthFallbackTexture();

  // 2. Main Earth Sphere with Standard Material (supports roughness & specular reflections)
  const earthGeo = new THREE.SphereGeometry(radius, 48, 48);
  const earthMat = new THREE.MeshStandardMaterial({
    map: cachedEarthTexture || fallbackTexture,
    roughness: 0.7,
    metalness: 0.1,
    wireframe,
  });
  if (cachedSpecularTexture) {
    earthMat.roughnessMap = cachedSpecularTexture;
    earthMat.roughness = 0.85;
    earthMat.metalness = 0.15;
  }
  const earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthMesh.name = 'Earth_Surface_Mesh';
  group.add(earthMesh);

  // Load realistic high-resolution NASA Blue Marble texture if not cached
  if (!cachedEarthTexture) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    textureLoader.load(
      EARTH_TEXTURE_URL,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        cachedEarthTexture = tex;
        earthMat.map = tex;
        earthMat.needsUpdate = true;
      },
      undefined,
      () => {}
    );

    textureLoader.load(
      EARTH_SPECULAR_URL,
      (specTex) => {
        specTex.wrapS = THREE.RepeatWrapping;
        specTex.wrapT = THREE.ClampToEdgeWrapping;
        cachedSpecularTexture = specTex;
        earthMat.roughnessMap = specTex;
        earthMat.roughness = 0.85;
        earthMat.metalness = 0.15;
        earthMat.needsUpdate = true;
      },
      undefined,
      () => {}
    );
  }

  if (!wireframe) {
    // 3. Floating Atmospheric Cloud Layer (elevated by 1.5% above the crust)
    const cloudGeo = new THREE.SphereGeometry(radius * 1.015, 36, 36);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cachedCloudsTexture || undefined,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    cloudMesh.name = 'Earth_Clouds_Mesh';
    group.add(cloudMesh);

    if (!cachedCloudsTexture) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.crossOrigin = 'anonymous';
      textureLoader.load(
        EARTH_CLOUDS_URL,
        (cloudTex) => {
          cloudTex.wrapS = THREE.RepeatWrapping;
          cloudTex.wrapT = THREE.ClampToEdgeWrapping;
          cachedCloudsTexture = cloudTex;
          cloudMat.map = cloudTex;
          cloudMat.needsUpdate = true;
        },
        undefined,
        () => {}
      );
    }

    // 4. Rayleigh Atmospheric Scattering Rim Glow
    const atmoGeo = new THREE.SphereGeometry(radius * 1.032, 36, 36);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    group.add(atmoMesh);
  }

  return group;
}

export const StarDossier3DStage: React.FC<StarDossier3DStageProps> = ({ star, onStarClick, initialMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(performance.now());
  const sharedTimeUniformRef = useRef<{ value: number }>({ value: 0 });
  const isTabVisibleRef = useRef<boolean>(true);
  const restoreDprTimerRef = useRef<number | null>(null);

  // Toggleable Mode: 'compare-sun' vs 'compare-earth' vs 'solar-system'
  const [activeStageMode, setActiveStageMode] = useState<'compare-sun' | 'compare-earth' | 'solar-system'>(
    initialMode || 'compare-sun'
  );
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [focusTarget, setFocusTarget] = useState<'both' | 'star' | 'sun' | 'earth'>('star');
  const [selectedBodyName, setSelectedBodyName] = useState<string | null>(null);
  const [showOrbitalLegend, setShowOrbitalLegend] = useState<boolean>(false);
  const [orbitalFilter, setOrbitalFilter] = useState<'all' | 'dwarf' | 'minor'>('all');
  const [isInspectMinimized, setIsInspectMinimized] = useState<boolean>(true);



  // References to keep camera and interactive controls smooth
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const dynamicGroupRef = useRef<THREE.Group | null>(null);
  const activePlanetsRef = useRef<{
    body: SolarSystemBody;
    mesh: THREE.Mesh;
    saturnRing?: THREE.Mesh;
    earthGlow?: THREE.Mesh;
    initialM: number;
  }[]>([]);
  const continuousGridRef = useRef<ContinuousGridHandle | null>(null);

  // Spherical camera controller state
  const isDraggingRef = useRef(false);
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 6, 20));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const labelStarRef = useRef<HTMLDivElement>(null);
  const labelOtherRef = useRef<HTMLDivElement>(null);
  const labelPositionsRef = useRef({ star: new THREE.Vector3(), other: new THREE.Vector3(), hasOther: false });
  const cameraSphericalRef = useRef({
    radius: 20,
    theta: Math.PI / 4,
    phi: Math.PI / 3.85,
    targetRadius: 20,
  });

  // Entry Fly-In Animation Controller (scales fly-in parameters dynamically to star size)
  const entryAnimRef = useRef<{
    active: boolean;
    startTime: number;
    duration: number;
    startRadius: number;
    destRadius: number;
    startTheta: number;
    destTheta: number;
    startPhi: number;
    destPhi: number;
    startTarget: THREE.Vector3;
    destTarget: THREE.Vector3;
  } | null>(null);

  const isSun = star.id === 'sun' || (star.diameterSolar === 1.0 && star.temperature === 5778);
  const effectiveSolar = useMemo(() => getEffectiveSolarDiameter(star), [star]);
  const isCompact = useMemo(() => isCompactRemnant(star), [star]);

  // Habitable zone calculation (Kopparapu et al. empirical luminosity scale)
  const habitableZone = useMemo(() => {
    const lum = Math.max(0.00001, star.luminositySolar);
    // Empirical solar flux limits: inner ~1.1, outer ~0.53
    const inner = Math.sqrt(lum / 1.1);
    const outer = Math.sqrt(lum / 0.53);
    return {
      inner: Number(inner.toFixed(3)),
      outer: Number(outer.toFixed(3)),
      rawInner: inner,
      rawOuter: outer,
    };
  }, [star.luminositySolar]);

  // Planet & Dwarf Planet condition breakdown under this host star
  const planetConditions = useMemo(() => {
    const starRadiusAU = star.diameterAU / 2;
    return SOLAR_BODIES.map((p) => {
      let status: 'ENGULFED' | 'SCORCHED' | 'HABITABLE' | 'FROZEN' = 'FROZEN';
      // Use true perihelion (closest approach to star) to calculate extreme radiative status
      if (p.perihelionAU <= starRadiusAU) {
        status = 'ENGULFED';
      } else if (p.perihelionAU < habitableZone.rawInner) {
        status = 'SCORCHED';
      } else if (p.semiMajorAxisAU >= habitableZone.rawInner && p.semiMajorAxisAU <= habitableZone.rawOuter) {
        status = 'HABITABLE';
      } else {
        status = 'FROZEN';
      }
      return { ...p, status };
    });
  }, [star.diameterAU, habitableZone]);

  // Asteroid Belt condition (2.1 to 3.3 AU, mean ~2.7 AU)
  const asteroidBeltCondition = useMemo(() => {
    const starRadiusAU = star.diameterAU / 2;
    let status: 'ENGULFED' | 'SCORCHED' | 'HABITABLE' | 'FROZEN' = 'FROZEN';
    if (3.3 <= starRadiusAU) {
      status = 'ENGULFED';
    } else if (2.7 < habitableZone.rawInner) {
      status = 'SCORCHED';
    } else if (2.7 >= habitableZone.rawInner && 2.7 <= habitableZone.rawOuter) {
      status = 'HABITABLE';
    } else {
      status = 'FROZEN';
    }
    return { name: 'Main Asteroid Belt', span: '2.1–3.3 AU', status };
  }, [star.diameterAU, habitableZone]);

  // Kuiper Belt condition (30 to 50 AU, mean ~40 AU)
  const kuiperBeltCondition = useMemo(() => {
    const starRadiusAU = star.diameterAU / 2;
    let status: 'ENGULFED' | 'SCORCHED' | 'HABITABLE' | 'FROZEN' = 'FROZEN';
    if (50.0 <= starRadiusAU) {
      status = 'ENGULFED';
    } else if (40.0 < habitableZone.rawInner) {
      status = 'SCORCHED';
    } else if (40.0 >= habitableZone.rawInner && 40.0 <= habitableZone.rawOuter) {
      status = 'HABITABLE';
    } else {
      status = 'FROZEN';
    }
    return { name: 'Kuiper Belt & Scattered Disc', span: '30–55 AU', status };
  }, [star.diameterAU, habitableZone]);

  const earthCondition = planetConditions.find((p) => p.isEarth);

  // Size calculation in side-by-side mode:
  // Sun radius = 1.0 (696,350 km)
  // Star radius = effectiveSolar (true 1:1 physical radius)
  const sunRadius = 1.0;
  const starRadius = effectiveSolar;
  // Constant proportional spacing: 38% margin regardless of star size
  const gap = (sunRadius + starRadius) * 0.38;
  const separation = sunRadius + starRadius + gap;
  // Left-aligned comparison: leftmost surface starts at x = 0
  const sunX = sunRadius;
  const starX = sunRadius * 2 + gap + starRadius;
  const compareMidX = (sunX + starX) / 2;

  // Earth comparison parameters:
  const earthRadius = EARTH_RADIUS_SOLAR;
  const earthGap = (earthRadius + starRadius) * 0.38;
  const earthSeparation = earthRadius + starRadius + earthGap;
  const earthX = earthRadius;
  const earthCompareStarX = earthRadius * 2 + earthGap + starRadius;
  const earthCompareMidX = (earthX + earthCompareStarX) / 2;

  // Star radius in Solar System overlay mode matching StarCanvas3D exactly:
  // radiusUnits = (effectiveSolar * 0.009309 * AU_SCALE) / 2
  const starOverlayRadius = (effectiveSolar * 0.009309 * AU_SCALE) / 2;

  // Helper to compute ideal camera target, angles, and entry fly-in vectors adjusted by star size
  const getCameraFramingForMode = (
    mode: 'compare-sun' | 'compare-earth' | 'solar-system', 
    focus: 'both' | 'star' | 'sun' | 'earth' = 'both'
  ) => {
    const highAnglePhi = starRadius > 2.0 ? Math.PI / 4.25 : Math.PI / 3.85;
    const destTarget = new THREE.Vector3(0, 0, 0);
    let destRadius = 20;
    let destPhi = highAnglePhi;
    let destTheta = Math.PI / 4;

    if (mode === 'compare-sun') {
      if (focus === 'star') {
        destTarget.set(starX, starRadius * (starRadius > 2.0 ? 0.85 : 1.0), 0);
        destRadius = Math.max(0.00005, starRadius * 3.8);
        destPhi = starRadius > 2.0 ? Math.PI / 4.1 : Math.PI / 3.75;
      } else if (focus === 'sun') {
        destTarget.set(sunX, sunRadius, 0);
        destRadius = sunRadius * 3.8;
        destPhi = Math.PI / 3.6;
      } else {
        const targetY = Math.max(sunRadius, starRadius) * (starRadius > 2.0 ? 0.40 : 0.45);
        destTarget.set(compareMidX, targetY, 0);
        destRadius = Math.max(4.0, separation * 2.15, starRadius * 2.85);
        destPhi = highAnglePhi;
      }
    } else if (mode === 'compare-earth') {
      if (focus === 'star') {
        destTarget.set(earthCompareStarX, starRadius * (starRadius > 2.0 ? 0.85 : 1.0), 0);
        destRadius = Math.max(0.00005, starRadius * 3.8);
        destPhi = starRadius > 2.0 ? Math.PI / 4.1 : Math.PI / 3.75;
      } else if (focus === 'earth') {
        destTarget.set(earthX, earthRadius, 0);
        destRadius = Math.max(0.025, earthRadius * 3.8);
        destPhi = Math.PI / 3.6;
      } else {
        const earthTargetY = Math.max(earthRadius, starRadius) * (starRadius > 2.0 ? 0.40 : 0.45);
        destTarget.set(earthCompareMidX, earthTargetY, 0);
        destRadius = Math.max(0.045, earthSeparation * 2.15, starRadius * 2.85);
        destPhi = highAnglePhi;
      }
    } else {
      // Solar system mode: Central host star is the showcased star
      destTarget.set(0, 0, 0);
      const starRadiusUnits = (star.diameterAU / 2) * AU_SCALE;
      const hzOuterUnits = habitableZone.rawOuter * AU_SCALE;
      if (starRadiusUnits > 25 || hzOuterUnits > 70) {
        destRadius = Math.max(starRadiusUnits * 3.2, hzOuterUnits * 1.8);
      } else {
        destRadius = 55;
      }
      destPhi = Math.PI / 3.5;
    }

    // Dynamic entry fly-in starting distance, adjusted by physical star size:
    // Ensures compact stars start at an intimate sub-unit approach, while hypergiants
    // start from deep cosmic vantage points without near/far clipping.
    let flyInScaleFactor = 4.2;
    if (starRadius < 0.05) {
      flyInScaleFactor = 4.8;
    } else if (starRadius > 200.0) {
      flyInScaleFactor = 3.2; // Hypergiants have enormous base radius; 3.2x gives magnificent deep space entry
    } else if (starRadius > 20.0) {
      flyInScaleFactor = 3.6;
    }
    const startRadius = Math.max(0.08, destRadius * flyInScaleFactor);
    const startPhi = Math.max(0.22, destPhi - 0.24); // Elevated high approach angle
    const startTheta = destTheta - 0.55; // Rotational swoop inward

    // Target position at start of fly-in: initially focus directly on the showcased target star!
    const startTarget = destTarget.clone();
    if (mode === 'compare-sun') {
      startTarget.set(starX, starRadius, 0);
    } else if (mode === 'compare-earth') {
      startTarget.set(earthCompareStarX, starRadius, 0);
    }

    return {
      destTarget,
      destRadius,
      destPhi,
      destTheta,
      startRadius,
      startPhi,
      startTheta,
      startTarget,
    };
  };

  const lastInitializedStarIdRef = useRef<string | null>(null);
  const [isModeSwitching, setIsModeSwitching] = useState(false);

  // Unified smooth camera transition function (handles both initial outer fly-in and silky in-dossier glides)
  const transitionCamera = (params: {
    target: THREE.Vector3;
    radius: number;
    phi: number;
    theta?: number;
    duration?: number;
    isInitialEntry?: boolean;
    startRadius?: number;
    startPhi?: number;
    startTheta?: number;
    startTarget?: THREE.Vector3;
  }) => {
    const sph = cameraSphericalRef.current;
    const now = performance.now();
    const duration = params.duration ?? (params.isInitialEntry ? 1850 : 1100);

    let startRadius: number;
    let startPhi: number;
    let startTheta: number;
    let startTarget: THREE.Vector3;

    if (params.isInitialEntry && params.startRadius !== undefined) {
      // First entry fly-in for a star: initiate from outer celestial distance
      startRadius = params.startRadius;
      startPhi = params.startPhi ?? Math.max(0.22, params.phi - 0.24);
      startTheta = params.startTheta ?? (params.theta ?? Math.PI / 4) - 0.55;
      startTarget = params.startTarget ? params.startTarget.clone() : params.target.clone();

      sph.radius = startRadius;
      sph.targetRadius = params.radius;
      sph.phi = startPhi;
      sph.theta = startTheta;
      cameraTargetRef.current.copy(startTarget);

      const startX = startTarget.x + startRadius * Math.sin(startPhi) * Math.sin(startTheta);
      const startY = startTarget.y + startRadius * Math.cos(startPhi);
      const startZ = startTarget.z + startRadius * Math.sin(startPhi) * Math.cos(startTheta);
      currentCameraPosRef.current.set(startX, startY, startZ);
      currentLookAtRef.current.copy(startTarget);

      if (cameraRef.current) {
        cameraRef.current.position.set(startX, startY, startZ);
        cameraRef.current.lookAt(startTarget);
        cameraRef.current.near = Math.max(0.000001, Math.min(40.0, startRadius * 0.008));
        cameraRef.current.far = Math.max(150000, startRadius * 45.0);
        cameraRef.current.updateProjectionMatrix();
      }
    } else {
      // In-dossier transition: ALWAYS start smoothly from CURRENT camera coordinates (zero popping!)
      startRadius = sph.radius;
      startPhi = sph.phi;
      startTheta = sph.theta;
      startTarget = cameraTargetRef.current.clone();
      sph.targetRadius = params.radius;
    }

    const destTheta = params.theta !== undefined ? params.theta : startTheta;

    entryAnimRef.current = {
      active: true,
      startTime: now,
      duration,
      startRadius,
      destRadius: params.radius,
      startTheta,
      destTheta,
      startPhi,
      destPhi: params.phi,
      startTarget,
      destTarget: params.target.clone(),
    };
  };

  // Helper to trigger smooth transitions based on mode and focus target
  const transitionToFraming = (
    mode: 'compare-sun' | 'compare-earth' | 'solar-system' = activeStageMode,
    focus: 'both' | 'star' | 'sun' | 'earth' = 'star',
    forceInitialEntry: boolean = false
  ) => {
    setFocusTarget(focus);
    const framing = getCameraFramingForMode(mode, focus);
    const isFirstForStar = forceInitialEntry || lastInitializedStarIdRef.current !== star.id;

    if (isFirstForStar) {
      lastInitializedStarIdRef.current = star.id;
      transitionCamera({
        target: framing.destTarget,
        radius: framing.destRadius,
        phi: framing.destPhi,
        theta: framing.destTheta,
        duration: 1850,
        isInitialEntry: true,
        startRadius: framing.startRadius,
        startPhi: framing.startPhi,
        startTheta: framing.startTheta,
        startTarget: framing.startTarget,
      });
    } else {
      transitionCamera({
        target: framing.destTarget,
        radius: framing.destRadius,
        phi: framing.destPhi,
        theta: framing.destTheta,
        duration: 1100,
        isInitialEntry: false,
      });
    }
  };

  // Switch stage mode with smooth visual fade and smooth camera transition
  const handleSwitchMode = (newMode: 'compare-sun' | 'compare-earth' | 'solar-system') => {
    if (newMode === activeStageMode) return;
    setIsModeSwitching(true);
    setTimeout(() => {
      setActiveStageMode(newMode);
      setIsModeSwitching(false);
    }, 70);
    transitionToFraming(newMode, 'star');
  };

  const handleZoomIn = () => {
    if (entryAnimRef.current?.active) entryAnimRef.current.active = false;
    const sph = cameraSphericalRef.current;
    sph.targetRadius = Math.max(0.00003, sph.targetRadius * 0.72);
  };

  const handleZoomOut = () => {
    if (entryAnimRef.current?.active) entryAnimRef.current.active = false;
    const sph = cameraSphericalRef.current;
    const maxZoom = Math.max(120000, habitableZone.rawOuter * AU_SCALE * 3.5);
    sph.targetRadius = Math.min(maxZoom, sph.targetRadius * 1.38);
  };

  // Handler to switch camera focus in Compare modes (triggers smooth glide to selected entity)
  const handleSetFocus = (target: 'both' | 'star' | 'sun' | 'earth') => {
    transitionToFraming(activeStageMode, target);
  };

  // Focus presets for Solar System mode (smoothly glides camera to target preset)
  const handleSetSolarPreset = (preset: 'host' | 'inner' | 'mid' | 'outer' | 'dwarf' | 'sedna' | 'hz') => {
    if (!cameraRef.current) return;
    setSelectedBodyName(null);

    if (preset === 'host') {
      transitionCamera({
        target: new THREE.Vector3(0, 0, 0),
        radius: Math.max(0.18, starOverlayRadius * 4.2),
        phi: Math.PI / 3.5,
      });
    } else if (preset === 'inner') {
      transitionCamera({
        target: new THREE.Vector3(0, 0, 0),
        radius: 25,
        phi: Math.PI / 3.5,
      });
    } else if (preset === 'mid') {
      transitionCamera({
        target: new THREE.Vector3(0, 0, 0),
        radius: 75,
        phi: Math.PI / 3.5,
      });
    } else if (preset === 'outer') {
      transitionCamera({
        target: new THREE.Vector3(0, 0, 0),
        radius: 240,
        phi: Math.PI / 3.4,
      });
    } else if (preset === 'dwarf') {
      transitionCamera({
        target: new THREE.Vector3(0, 0, 0),
        radius: 780,
        phi: Math.PI / 3.2,
        theta: Math.PI / 3.2,
      });
    } else if (preset === 'sedna') {
      setSelectedBodyName('Sedna');
      transitionCamera({
        target: new THREE.Vector3(0, 0, 0),
        radius: 7800,
        phi: Math.PI / 3.2,
        theta: Math.PI / 3.2,
      });
    } else if (preset === 'hz') {
      const hzTarget = Math.max(25, habitableZone.rawOuter * AU_SCALE * 1.8);
      transitionCamera({
        target: new THREE.Vector3(0, 0, 0),
        radius: hzTarget,
        phi: Math.PI / 3.5,
      });
    }
  };

  const handleFocusBody = (bodyName: string) => {
    const body = SOLAR_BODIES.find((b) => b.name === bodyName);
    if (!body) return;
    setSelectedBodyName(bodyName);
    
    // Smoothly transition camera onto this body's orbital zone
    const meanRadiusUnits = body.semiMajorAxisAU * AU_SCALE;
    const destRadius = body.name === 'Sedna' ? 7800 : Math.max(16, Math.min(1200, meanRadiusUnits * 1.55));
    const destPhi = body.name === 'Sedna' ? Math.PI / 3.2 : (body.inclinationDeg > 8 ? Math.PI / 3.1 : Math.PI / 3.4);
    const destTheta = (body.ascendingNodeDeg * Math.PI) / 180 + Math.PI / 4;

    transitionCamera({
      target: new THREE.Vector3(0, 0, 0),
      radius: destRadius,
      phi: destPhi,
      theta: destTheta,
      duration: 1200,
    });
  };

  const resetCamera = () => {
    transitionToFraming(activeStageMode, 'star');
  };

  // Launch smooth transition when switching modes or selecting a new star
  useEffect(() => {
    transitionToFraming(activeStageMode, 'star');
  }, [activeStageMode, star.id]);

  // Main Three.js Scene Setup and Animation Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 380;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#01040f');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.0001, 150000);
    cameraRef.current = camera;
    transitionToFraming(activeStageMode, 'star', true);

    // 2. Renderer
    const isMob = typeof window !== 'undefined' && window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      logarithmicDepthBuffer: true,
      powerPreference: 'high-performance' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMob ? 1.2 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Background tab throttling: pause CPU/GPU rendering when tab is hidden
    const handleVisibility = () => {
      isTabVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.85);
    directionalLight.position.set(20, 40, 30);
    scene.add(directionalLight);

    // Dynamic Group for Star Objects
    const dynamicGroup = new THREE.Group();
    scene.add(dynamicGroup);
    dynamicGroupRef.current = dynamicGroup;

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Loop
    let lastTime = performance.now();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      // Throttling: pause when tab is inactive
      if (!isTabVisibleRef.current) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const elapsedTime = (now - startTimeRef.current) * 0.001;

      const sph = cameraSphericalRef.current;

      // Smooth Camera Transition Handler (handles both initial outer fly-in and silky in-dossier glides)
      const anim = entryAnimRef.current;
      if (anim && anim.active) {
        const rawProgress = Math.min(1, (now - anim.startTime) / anim.duration);
        // Quintic smootherstep (6t^5 - 15t^4 + 10t^3) for zero acceleration jerk and zero deceleration jerk:
        const t = rawProgress;
        const ease = t * t * t * (t * (t * 6 - 15) + 10);

        // 1. Logarithmic smooth zoom interpolation (natural visual scaling across any orders of magnitude)
        const logStartR = Math.log(Math.max(0.0000001, anim.startRadius));
        const logDestR = Math.log(Math.max(0.0000001, anim.destRadius));
        sph.radius = Math.exp(logStartR + (logDestR - logStartR) * ease);
        sph.targetRadius = anim.destRadius;

        // 2. Shortest-arc spherical angular interpolation around Y-axis (prevents 360° spin flips)
        const diffTheta = ((anim.destTheta - anim.startTheta) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
        sph.theta = anim.startTheta + diffTheta * ease;

        // 3. Polar pitch angle interpolation
        sph.phi = anim.startPhi + (anim.destPhi - anim.startPhi) * ease;

        // 4. Smooth target position interpolation
        cameraTargetRef.current.lerpVectors(anim.startTarget, anim.destTarget, ease);

        const target = cameraTargetRef.current;
        const camX = target.x + sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta);
        const camY = target.y + sph.radius * Math.cos(sph.phi);
        const camZ = target.z + sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta);

        currentCameraPosRef.current.set(camX, camY, camZ);
        currentLookAtRef.current.copy(target);

        camera.position.set(camX, camY, camZ);
        camera.lookAt(target);

        // Dynamically adjust near and far planes based on current distance during transition
        const dist = sph.radius;
        const targetNear = Math.max(0.000001, Math.min(40.0, dist * 0.008));
        const targetFar = Math.max(150000, dist * 40.0);
        if (Math.abs(camera.near - targetNear) > targetNear * 0.1 || Math.abs(camera.far - targetFar) > 100) {
          camera.near = targetNear;
          camera.far = targetFar;
          camera.updateProjectionMatrix();
        }

        if (rawProgress >= 1) {
          anim.active = false;
        }
      } else {
        // Auto-rotation in yaw
        if (isAutoRotating && !isDraggingRef.current) {
          const autoRate = 0.22;
          cameraSphericalRef.current.theta += delta * autoRate;
        }

        // Smooth camera damping for zoom distance
        sph.radius += (sph.targetRadius - sph.radius) * 0.08;

        // Spherical coordinates relative to cameraTarget
        const target = cameraTargetRef.current;
        const targetX = target.x + sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta);
        const targetY = target.y + sph.radius * Math.cos(sph.phi);
        const targetZ = target.z + sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta);

        currentCameraPosRef.current.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.12);
        currentLookAtRef.current.lerp(target, 0.12);

        camera.position.copy(currentCameraPosRef.current);
        camera.lookAt(currentLookAtRef.current);

        // Dynamically adjust near and far planes based on current distance to maintain pristine depth-buffer precision
        // Completely eliminates near-plane clipping on sub-solar stars (pulsars / white dwarfs) and prevents Z-fighting
        const dist = sph.radius;
        const targetNear = Math.max(0.000001, Math.min(40.0, dist * 0.008));
        const targetFar = Math.max(150000, dist * 35.0);
        if (Math.abs(camera.near - targetNear) > targetNear * 0.1 || Math.abs(camera.far - targetFar) > 100) {
          camera.near = targetNear;
          camera.far = targetFar;
          camera.updateProjectionMatrix();
        }
      }

      // Rotate star meshes and particle belts, and update Keplerian orbital positions
      if (dynamicGroup) {
        dynamicGroup.children.forEach((child) => {
          if (child.userData?.isRotatingStarGroup) {
            child.rotation.y += delta * 0.18;
          }
          if (child.userData?.isEarthGroup) {
            child.rotation.y += delta * 0.15;
            const clouds = child.getObjectByName('Earth_Clouds_Mesh');
            if (clouds) {
              clouds.rotation.y += delta * 0.05;
            }
          }
          if (child.userData?.isRotatingParticleBelt) {
            const speed = child.userData.speed || 0.1;
            child.rotation.y += delta * 0.25 * speed;
          }
          // Backward compatibility for any remaining standard orbit groups
          if (child.userData?.isPlanetOrbitGroup) {
            const speed = child.userData.speed || 1;
            child.rotation.y += delta * 0.25 * speed;
          }
        });

        // Update exact positions of all planets & dwarf planets along their true 3D Keplerian orbits
        activePlanetsRef.current.forEach((item) => {
          const M = item.initialM + elapsedTime * item.body.speed * 0.22;
          const E = solveKepler(M, item.body.eccentricity);
          const pos = calculateKeplerianPosition(item.body, E, AU_SCALE);
          item.mesh.position.copy(pos);
          if (item.saturnRing) item.saturnRing.position.copy(pos);
          if (item.earthGlow) item.earthGlow.position.copy(pos);
        });

        // O(1) Instant uniform update across all shaders (zero tree traversal!)
        sharedTimeUniformRef.current.value = elapsedTime % 600.0;
      }

      // Update procedural continuous grid positioning and scale
      if (camera && continuousGridRef.current) {
        continuousGridRef.current.update(camera, cameraSphericalRef.current.radius);
      }

      // Update Floating 3D Labels in Dossier Mode
      if (container && camera) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        const tempVec = new THREE.Vector3();

        const updateLabelEl = (el: HTMLElement | null, worldPos: THREE.Vector3) => {
          if (!el) return;
          tempVec.copy(worldPos);
          tempVec.project(camera);
          // Check if behind camera or excessively far off screen
          if (tempVec.z > 1.0 || Math.abs(tempVec.x) > 1.25 || Math.abs(tempVec.y) > 1.25) {
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
          } else {
            const screenX = ((tempVec.x + 1) / 2) * w;
            const screenY = ((-tempVec.y + 1) / 2) * h;

            const safeMarginX = Math.min(w * 0.25, 80);
            const clampedX = Math.max(safeMarginX, Math.min(w - safeMarginX, screenX));
            const isNearTop = screenY < 75;
            const posY = isNearTop ? Math.min(h - 90, screenY + 14) : Math.max(45, screenY - 8);

            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
            el.style.transform = isNearTop
              ? `translate3d(calc(${clampedX}px - 50%), ${posY}px, 0)`
              : `translate3d(calc(${clampedX}px - 50%), calc(${posY}px - 100%), 0)`;
            el.setAttribute('data-near-top', isNearTop ? 'true' : 'false');
          }
        };

        const lp = labelPositionsRef.current;
        updateLabelEl(labelStarRef.current, lp.star);
        if (lp.hasOther) {
          updateLabelEl(labelOtherRef.current, lp.other);
        } else if (labelOtherRef.current) {
          labelOtherRef.current.style.opacity = '0';
          labelOtherRef.current.style.pointerEvents = 'none';
        }
      }

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (continuousGridRef.current) {
        continuousGridRef.current.dispose();
        continuousGridRef.current = null;
      }
      resizeObserver.disconnect();
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, []);

  // Update Dynamic Scene Geometry whenever activeStageMode, star, or wireframe changes
  useEffect(() => {
    const scene = sceneRef.current;
    const dynamicGroup = dynamicGroupRef.current;
    if (!scene || !dynamicGroup) return;

    // Clear previous dynamic meshes
    if (continuousGridRef.current) {
      continuousGridRef.current.dispose();
      continuousGridRef.current = null;
    }

    while (dynamicGroup.children.length > 0) {
      const obj = dynamicGroup.children[0];
      dynamicGroup.remove(obj);
      if ((obj as any).geometry) (obj as any).geometry.dispose();
      if ((obj as any).material) {
        if (Array.isArray((obj as any).material)) {
          (obj as any).material.forEach((m: any) => m.dispose());
        } else {
          (obj as any).material.dispose();
        }
      }
    }

    if (activeStageMode === 'compare-sun') {
      // =========================================================================
      // MODE 1: 3D SIZE & TEXTURE COMPARISON AGAINST THE SUN (100% MAIN STAGE PARITY)
      // =========================================================================

      // --- 1. The Sun (Sol) --- sits on the grid floor at y = 0
      const sunGroup = createStarMeshGroup(SUN_REFERENCE_STAR, sunRadius, { 
        wireframe, 
        showCorona: true, 
        timeUniform: sharedTimeUniformRef.current 
      });
      sunGroup.position.set(sunX, sunRadius, 0);
      sunGroup.userData.isRotatingStarGroup = true;
      sunGroup.userData.starType = 'sun';
      dynamicGroup.add(sunGroup);

      // --- 2. The Target Star --- sits on the grid floor at y = 0
      const starGroup = createStarMeshGroup(star, starRadius, { 
        wireframe, 
        showCorona: true, 
        timeUniform: sharedTimeUniformRef.current 
      });
      starGroup.position.set(starX, starRadius, 0);
      starGroup.userData.isRotatingStarGroup = true;
      starGroup.userData.starType = 'star';
      dynamicGroup.add(starGroup);

      labelPositionsRef.current = {
        star: new THREE.Vector3(starX, starRadius * 2, 0),
        other: new THREE.Vector3(sunX, sunRadius * 2, 0),
        hasOther: true,
      };

      // --- 3. Continuous Procedural Cosmic Metric Grid on Floor (yLevel = 0) ---
      const maxStarR = Math.max(sunRadius, starRadius);

      const gridHandle = createContinuousGridMesh({
        yLevel: 0,
        leftAligned: false,
        comparisonBounds: {
          minX: 0,
          maxX: starX + starRadius,
          minZ: -maxStarR,
          maxZ: maxStarR,
        },
      });
      dynamicGroup.add(gridHandle.mesh);
      continuousGridRef.current = gridHandle;

      // Floor Footprint Anchors (sitting on floor y = 0)
      const sunFootGeo = new THREE.RingGeometry(sunRadius * 0.94, sunRadius, 64);
      const sunFootMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      });
      const sunFootMesh = new THREE.Mesh(sunFootGeo, sunFootMat);
      sunFootMesh.rotation.x = Math.PI / 2;
      sunFootMesh.position.set(sunX, 0, 0);
      dynamicGroup.add(sunFootMesh);

      const starFootInner = Math.max(starRadius * 0.05, starRadius * 0.92);
      const starFootGeo = new THREE.RingGeometry(starFootInner, starRadius, 64);
      const starFootMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(star.colorHex),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      });
      const starFootMesh = new THREE.Mesh(starFootGeo, starFootMat);
      starFootMesh.rotation.x = Math.PI / 2;
      starFootMesh.position.set(starX, 0, 0);
      dynamicGroup.add(starFootMesh);

      // Vertical height drop lines from floor (y = 0) to top of star (y = radius * 2)
      const sunDropGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(sunX, 0, 0),
        new THREE.Vector3(sunX, sunRadius * 2, 0),
      ]);
      const sunDropMat = new THREE.LineDashedMaterial({
        color: 0xf59e0b,
        dashSize: Math.max(0.2, sunRadius * 0.1),
        gapSize: Math.max(0.2, sunRadius * 0.1),
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      });
      const sunDropLine = new THREE.Line(sunDropGeo, sunDropMat);
      sunDropLine.computeLineDistances();
      dynamicGroup.add(sunDropLine);

      const starDropGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(starX, 0, 0),
        new THREE.Vector3(starX, starRadius * 2, 0),
      ]);
      let starDropLine: THREE.Line;
      if (starRadius < 0.001) {
        const starDropMat = new THREE.LineBasicMaterial({
          color: new THREE.Color(star.colorHex),
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
        });
        starDropLine = new THREE.Line(starDropGeo, starDropMat);
      } else {
        const starDropMat = new THREE.LineDashedMaterial({
          color: new THREE.Color(star.colorHex),
          dashSize: Math.max(0.000005, starRadius * 0.06),
          gapSize: Math.max(0.000005, starRadius * 0.06),
          transparent: true,
          opacity: 0.45,
          depthWrite: false,
        });
        starDropLine = new THREE.Line(starDropGeo, starDropMat);
        starDropLine.computeLineDistances();
      }
      dynamicGroup.add(starDropLine);

    } else if (activeStageMode === 'compare-earth') {
      // =========================================================================
      // MODE 2: 3D SIZE & TEXTURE COMPARISON AGAINST EARTH (12,742 KM / 1.00 D⊕)
      // =========================================================================

      // --- 1. Earth (Terra) --- sits on the grid floor at y = 0
      const earthGroup = createEarthMeshGroup(earthRadius, wireframe);
      earthGroup.position.set(earthX, earthRadius, 0);
      earthGroup.userData.isRotatingStarGroup = true;
      earthGroup.userData.starType = 'earth';
      dynamicGroup.add(earthGroup);

      // --- 2. The Target Star --- sits on the grid floor at y = 0
      const starGroup = createStarMeshGroup(star, starRadius, { 
        wireframe, 
        showCorona: true, 
        timeUniform: sharedTimeUniformRef.current 
      });
      starGroup.position.set(earthCompareStarX, starRadius, 0);
      starGroup.userData.isRotatingStarGroup = true;
      starGroup.userData.starType = 'star';
      dynamicGroup.add(starGroup);

      labelPositionsRef.current = {
        star: new THREE.Vector3(earthCompareStarX, starRadius * 2, 0),
        other: new THREE.Vector3(earthX, earthRadius * 2, 0),
        hasOther: true,
      };

      // --- 3. Continuous Procedural Cosmic Metric Grid on Floor (yLevel = 0) ---
      const maxBodyR = Math.max(earthRadius, starRadius);

      const gridHandle = createContinuousGridMesh({
        yLevel: 0,
        leftAligned: false,
        comparisonBounds: {
          minX: 0,
          maxX: earthCompareStarX + starRadius,
          minZ: -maxBodyR,
          maxZ: maxBodyR,
        },
      });
      dynamicGroup.add(gridHandle.mesh);
      continuousGridRef.current = gridHandle;

      // Floor Footprint Anchors (sitting on floor y = 0)
      const earthFootGeo = new THREE.RingGeometry(earthRadius * 0.90, earthRadius, 48);
      const earthFootMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.40,
        depthWrite: false,
      });
      const earthFootMesh = new THREE.Mesh(earthFootGeo, earthFootMat);
      earthFootMesh.rotation.x = Math.PI / 2;
      earthFootMesh.position.set(earthX, 0, 0);
      dynamicGroup.add(earthFootMesh);

      const starFootInner = Math.max(starRadius * 0.05, starRadius * 0.92);
      const starFootGeo = new THREE.RingGeometry(starFootInner, starRadius, 64);
      const starFootMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(star.colorHex),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      });
      const starFootMesh = new THREE.Mesh(starFootGeo, starFootMat);
      starFootMesh.rotation.x = Math.PI / 2;
      starFootMesh.position.set(earthCompareStarX, 0, 0);
      dynamicGroup.add(starFootMesh);

      // Vertical height drop lines from floor (y = 0) to top of body
      const earthDropGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(earthX, 0, 0),
        new THREE.Vector3(earthX, earthRadius * 2, 0),
      ]);
      const earthDropMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      });
      const earthDropLine = new THREE.Line(earthDropGeo, earthDropMat);
      dynamicGroup.add(earthDropLine);

      const starDropGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(earthCompareStarX, 0, 0),
        new THREE.Vector3(earthCompareStarX, starRadius * 2, 0),
      ]);
      let starDropLine: THREE.Line;
      if (starRadius < 0.001) {
        const starDropMat = new THREE.LineBasicMaterial({
          color: new THREE.Color(star.colorHex),
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
        });
        starDropLine = new THREE.Line(starDropGeo, starDropMat);
      } else {
        const starDropMat = new THREE.LineDashedMaterial({
          color: new THREE.Color(star.colorHex),
          dashSize: Math.max(0.000005, starRadius * 0.06),
          gapSize: Math.max(0.000005, starRadius * 0.06),
          transparent: true,
          opacity: 0.45,
          depthWrite: false,
        });
        starDropLine = new THREE.Line(starDropGeo, starDropMat);
        starDropLine.computeLineDistances();
      }
      dynamicGroup.add(starDropLine);

    } else if (activeStageMode === 'solar-system') {
      // =========================================================================
      // MODE 3: STAR IN PLACE IN SOLAR SYSTEM (EXACT SOLAR OVERLAY PARITY)
      // =========================================================================
      
      // Central Host Star with exact physical scale and matching shader texture
      const hostStarGroup = createStarMeshGroup(star, starOverlayRadius, { 
        wireframe, 
        showCorona: true, 
        timeUniform: sharedTimeUniformRef.current 
      });
      hostStarGroup.position.set(0, 0, 0);
      hostStarGroup.userData.isRotatingStarGroup = true;
      hostStarGroup.userData.starType = 'star';
      dynamicGroup.add(hostStarGroup);

      labelPositionsRef.current = {
        star: new THREE.Vector3(0, starOverlayRadius * 1.5, 0),
        other: new THREE.Vector3(0, 0, 0),
        hasOther: false,
      };

      // --- HABITABLE ZONE (GOLDILOCKS ZONE) ---
      // Expanded rendering for stars of all scales (including massive giants/supergiants)
      const hzInnerUnits = habitableZone.rawInner * AU_SCALE;
      const hzOuterUnits = habitableZone.rawOuter * AU_SCALE;

      if (hzInnerUnits < hzOuterUnits && hzOuterUnits <= 85000) {
        const hzSegments = Math.min(192, Math.max(96, Math.round(hzOuterUnits / 12)));
        const hzGeo = new THREE.RingGeometry(Math.max(0.05, hzInnerUnits), hzOuterUnits, hzSegments);
        const hzMat = new THREE.MeshBasicMaterial({
          color: 0x10b981, // Emerald Green
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.28,
          depthWrite: false,
        });
        const hzMesh = new THREE.Mesh(hzGeo, hzMat);
        hzMesh.rotation.x = Math.PI / 2;
        dynamicGroup.add(hzMesh);

        // Glowing boundary rings for inner and outer edge
        const borderHalfWidth = Math.max(0.2, Math.min(30.0, hzOuterUnits * 0.0035));
        const innerBorderGeo = new THREE.RingGeometry(Math.max(0.02, hzInnerUnits - borderHalfWidth), hzInnerUnits + borderHalfWidth, hzSegments);
        const borderMat = new THREE.MeshBasicMaterial({
          color: 0x34d399,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.75,
        });
        const innerBorder = new THREE.Mesh(innerBorderGeo, borderMat);
        innerBorder.rotation.x = Math.PI / 2;
        dynamicGroup.add(innerBorder);

        const outerBorderGeo = new THREE.RingGeometry(Math.max(0.02, hzOuterUnits - borderHalfWidth), hzOuterUnits + borderHalfWidth, hzSegments);
        const outerBorder = new THREE.Mesh(outerBorderGeo, borderMat);
        outerBorder.rotation.x = Math.PI / 2;
        dynamicGroup.add(outerBorder);
      }

      // --- MAIN ASTEROID BELT (2.1 to 3.3 AU) ---
      const beltInnerUnits = 2.1 * AU_SCALE;
      const beltOuterUnits = 3.3 * AU_SCALE;

      // 1. Semi-transparent asteroid belt density disk
      const beltDiskGeo = new THREE.RingGeometry(beltInnerUnits, beltOuterUnits, 96);
      const beltDiskMat = new THREE.MeshBasicMaterial({
        color: 0x94a3b8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      });
      const beltDisk = new THREE.Mesh(beltDiskGeo, beltDiskMat);
      beltDisk.rotation.x = Math.PI / 2;
      dynamicGroup.add(beltDisk);

      // Belt boundary line loops
      const beltInnerPoints: THREE.Vector3[] = [];
      const beltOuterPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= 96; i++) {
        const theta = (i / 96) * Math.PI * 2;
        beltInnerPoints.push(new THREE.Vector3(Math.cos(theta) * beltInnerUnits, 0, Math.sin(theta) * beltInnerUnits));
        beltOuterPoints.push(new THREE.Vector3(Math.cos(theta) * beltOuterUnits, 0, Math.sin(theta) * beltOuterUnits));
      }
      const beltBorderMat = new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.45 });
      dynamicGroup.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(beltInnerPoints), beltBorderMat));
      dynamicGroup.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(beltOuterPoints), beltBorderMat));

      // 2. Asteroid Belt particle cloud (650 realistic asteroid fragments with vertical dispersion)
      const asteroidGroup = new THREE.Group();
      asteroidGroup.userData = { isRotatingParticleBelt: true, speed: 0.21 };
      const asteroidCount = 650;
      const asteroidPositions = new Float32Array(asteroidCount * 3);
      for (let i = 0; i < asteroidCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const rad = beltInnerUnits + Math.random() * (beltOuterUnits - beltInnerUnits);
        asteroidPositions[i * 3] = Math.cos(angle) * rad;
        asteroidPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
        asteroidPositions[i * 3 + 2] = Math.sin(angle) * rad;
      }
      const asteroidGeo = new THREE.BufferGeometry();
      asteroidGeo.setAttribute('position', new THREE.BufferAttribute(asteroidPositions, 3));
      const asteroidMat = new THREE.PointsMaterial({ color: 0xcbd5e1, size: 0.35, transparent: true, opacity: 0.85 });
      const asteroidField = new THREE.Points(asteroidGeo, asteroidMat);
      asteroidGroup.add(asteroidField);
      dynamicGroup.add(asteroidGroup);

      // 2b. Kuiper Belt particle cloud (30 to 52 AU, encompassing Pluto, Haumea, Makemake)
      const kuiperGroup = new THREE.Group();
      kuiperGroup.userData = { isRotatingParticleBelt: true, speed: 0.005 };
      const kuiperCount = 950;
      const kuiperPositions = new Float32Array(kuiperCount * 3);
      for (let i = 0; i < kuiperCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const rad = (30.0 + Math.random() * 22.0) * AU_SCALE;
        kuiperPositions[i * 3] = Math.cos(angle) * rad;
        kuiperPositions[i * 3 + 1] = (Math.random() - 0.5) * 12.0; // natural vertical inclination spread
        kuiperPositions[i * 3 + 2] = Math.sin(angle) * rad;
      }
      const kuiperGeo = new THREE.BufferGeometry();
      kuiperGeo.setAttribute('position', new THREE.BufferAttribute(kuiperPositions, 3));
      const kuiperMat = new THREE.PointsMaterial({ color: 0x93c5fd, size: 0.42, transparent: true, opacity: 0.50 });
      const kuiperField = new THREE.Points(kuiperGeo, kuiperMat);
      kuiperGroup.add(kuiperField);
      dynamicGroup.add(kuiperGroup);

      // --- PLANETARY, DWARF & MINOR PLANET 3D KEPLERIAN ORBITS AND SPHERES ---
      activePlanetsRef.current = [];

      SOLAR_BODIES.forEach((body) => {
        const orbitRadiusMean = body.semiMajorAxisAU * AU_SCALE;
        if (orbitRadiusMean > 100000) return;

        // 1. Parametric 3D Keplerian Ribbon Mesh (inclined, eccentric orbit ellipse)
        const ribbonGeo = generateKeplerianRibbonGeometry(body, AU_SCALE, 192);
        const ribbonMat = new THREE.MeshBasicMaterial({
          color: body.isEarth ? 0x38bdf8 : new THREE.Color(body.color),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: body.isEarth ? 0.90 : (body.isDwarfPlanet || body.isMinorPlanet) ? 0.55 : 0.68,
          depthWrite: false,
        });
        const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
        dynamicGroup.add(ribbonMesh);

        // 2. High-contrast Vector 3D LineLoop
        const orbitPoints = generateKeplerianOrbitPoints(body, AU_SCALE, 192);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
        const lineMat = new THREE.LineBasicMaterial({
          color: body.isEarth ? 0x38bdf8 : new THREE.Color(body.color),
          transparent: true,
          opacity: body.isEarth ? 0.95 : (body.isDwarfPlanet || body.isMinorPlanet) ? 0.76 : 0.84,
        });
        const lineLoop = new THREE.LineLoop(lineGeo, lineMat);
        dynamicGroup.add(lineLoop);

        // 3. For Dwarf Planets & Minor Planets: Perihelion (q) and Aphelion (Q) nodes
        // Visually demonstrates Pluto crossing inside Neptune's orbit, Chiron crossing Saturn/Uranus, and Sedna stretching to 936 AU
        if (body.isDwarfPlanet || body.isMinorPlanet) {
          const periPos = calculateKeplerianPosition(body, 0, AU_SCALE);
          const aphPos = calculateKeplerianPosition(body, Math.PI, AU_SCALE);

          const nodeSize = Math.max(0.18, Math.min(6.5, orbitRadiusMean * 0.0028));
          // Perihelion node (q - closest approach to host star)
          const periGeo = new THREE.SphereGeometry(nodeSize, 12, 12);
          const periMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 });
          const periMesh = new THREE.Mesh(periGeo, periMat);
          periMesh.position.copy(periPos);
          dynamicGroup.add(periMesh);

          // Aphelion node (Q - farthest reach from host star)
          const aphGeo = new THREE.SphereGeometry(nodeSize * 0.9, 12, 12);
          const aphMat = new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.80 });
          const aphMesh = new THREE.Mesh(aphGeo, aphMat);
          aphMesh.position.copy(aphPos);
          dynamicGroup.add(aphMesh);
        }

        // 4. Planet / Dwarf Planet / Minor Planet Sphere
        const visualRadius = Math.max(body.radius3D, Math.min(8.0, orbitRadiusMean * 0.0055));
        const planetGeo = new THREE.SphereGeometry(visualRadius, 24, 24);
        const planetMat = new THREE.MeshStandardMaterial({
          color: body.color,
          emissive: body.isEarth ? 0x0284c7 : new THREE.Color(body.color),
          emissiveIntensity: body.isEarth ? 0.65 : (body.isDwarfPlanet || body.isMinorPlanet) ? 0.60 : 0.45,
          roughness: 0.35,
        });
        const planetMesh = new THREE.Mesh(planetGeo, planetMat);

        // Initial Keplerian Anomaly
        const initialM = (body.semiMajorAxisAU * 2.3) % (Math.PI * 2);
        const initialE = solveKepler(initialM, body.eccentricity);
        const initialPos = calculateKeplerianPosition(body, initialE, AU_SCALE);
        planetMesh.position.copy(initialPos);
        dynamicGroup.add(planetMesh);

        let saturnRingMesh: THREE.Mesh | undefined;
        let earthGlowMesh: THREE.Mesh | undefined;

        // Saturn's Rings
        if (body.hasRings) {
          const saturnRingGeo = new THREE.RingGeometry(visualRadius * 1.4, visualRadius * 2.4, 32);
          const saturnRingMat = new THREE.MeshBasicMaterial({
            color: 0xfef08a,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.75,
          });
          saturnRingMesh = new THREE.Mesh(saturnRingGeo, saturnRingMat);
          saturnRingMesh.rotation.x = Math.PI / 2.3;
          saturnRingMesh.position.copy(initialPos);
          dynamicGroup.add(saturnRingMesh);
        }

        // Distinct Atmospheric Glow for Earth
        if (body.isEarth) {
          const earthGlowGeo = new THREE.SphereGeometry(visualRadius * 1.35, 16, 16);
          const earthGlowMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.35,
            side: THREE.BackSide,
          });
          earthGlowMesh = new THREE.Mesh(earthGlowGeo, earthGlowMat);
          earthGlowMesh.position.copy(initialPos);
          dynamicGroup.add(earthGlowMesh);
        }

        activePlanetsRef.current.push({
          body,
          mesh: planetMesh,
          saturnRing: saturnRingMesh,
          earthGlow: earthGlowMesh,
          initialM,
        });
      });

      // Floor metric reference grid in solar system mode (clean enlarged grid)
      const solarGridExtent = Math.min(100000, Math.max(240, hzOuterUnits * 2.2));
      const solarGridDivisions = Math.min(120, Math.max(40, Math.round(solarGridExtent / 25)));
      const solarGrid = new THREE.GridHelper(solarGridExtent, solarGridDivisions, 0x06b6d4, 0x1e293b);
      solarGrid.position.set(0, -0.05, 0);
      (solarGrid.material as THREE.Material).transparent = true;
      (solarGrid.material as THREE.Material).opacity = 0.22;
      dynamicGroup.add(solarGrid);
    }
  }, [activeStageMode, star, wireframe, habitableZone, focusTarget]);

  // Dynamic DPR during user drag / manipulation for buttery smooth frame rate on all devices
  const triggerDossierInteractionDpr = () => {
    if (rendererRef.current) {
      const isMob = typeof window !== 'undefined' && window.innerWidth < 768;
      const lowDpr = isMob ? 0.85 : 1.0;
      if (rendererRef.current.getPixelRatio() !== lowDpr) {
        rendererRef.current.setPixelRatio(lowDpr);
      }
    }
    if (restoreDprTimerRef.current !== null) {
      window.clearTimeout(restoreDprTimerRef.current);
    }
    restoreDprTimerRef.current = window.setTimeout(() => {
      if (rendererRef.current) {
        const isMob = typeof window !== 'undefined' && window.innerWidth < 768;
        const normalDpr = Math.min(window.devicePixelRatio || 1, isMob ? 1.2 : 1.5);
        rendererRef.current.setPixelRatio(normalDpr);
      }
    }, 160);
  };

  // Pointer/Touch Event Handlers for 3D Orbiting
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    if (entryAnimRef.current?.active) {
      entryAnimRef.current.active = false;
    }
    triggerDossierInteractionDpr();
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    triggerDossierInteractionDpr();
    const dx = e.clientX - prevMouseRef.current.x;
    const dy = e.clientY - prevMouseRef.current.y;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };

    const sph = cameraSphericalRef.current;
    sph.theta -= dx * 0.008;
    sph.phi -= dy * 0.008;
    // Allow free 360-degree spherical orbiting around system from top, side, and underneath
    sph.phi = Math.max(0.04, Math.min(Math.PI - 0.04, sph.phi));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    triggerDossierInteractionDpr();
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // Check if this was a click/tap (not a long drag) to focus star or trigger dossier tap
    const dist = Math.hypot(e.clientX - pointerDownPosRef.current.x, e.clientY - pointerDownPosRef.current.y);
    if (dist < 14 && cameraRef.current && dynamicGroupRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const hits = raycaster.intersectObjects(dynamicGroupRef.current.children, true);

      let hitOther = false;
      if (hits.length > 0) {
        let obj: THREE.Object3D | null = hits[0].object;
        while (obj && !obj.userData?.starType && obj.parent && obj !== dynamicGroupRef.current) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.starType) {
          const type = obj.userData.starType;
          if (type === 'star') {
            if (activeStageMode === 'solar-system') {
              handleSetSolarPreset('host');
            } else {
              handleSetFocus('star');
            }
            onStarClick?.();
            return;
          } else if (type === 'sun') {
            handleSetFocus('sun');
            hitOther = true;
          } else if (type === 'earth') {
            handleSetFocus('earth');
            hitOther = true;
          }
        }
      }
      if (!hitOther) {
        onStarClick?.();
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (entryAnimRef.current?.active) {
      entryAnimRef.current.active = false;
    }
    const sph = cameraSphericalRef.current;
    const zoomStep = Math.max(0.00002, sph.targetRadius * 0.08);
    const zoomFactor = Math.sign(e.deltaY) * zoomStep;
    const maxZoomDistance = Math.max(120000, habitableZone.rawOuter * AU_SCALE * 3.5);
    sph.targetRadius = Math.max(0.00003, Math.min(maxZoomDistance, sph.targetRadius + zoomFactor));
  };

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#020512]/90 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col transition-all">
      {/* 3D Stage Navigation / Controls Bar (Moved below 3D preview on mobile via order-2 md:order-1) */}
      <div className="order-2 md:order-1 p-2.5 sm:p-3.5 border-t md:border-t-0 md:border-b border-cyan-500/20 bg-[#04081c]/80 flex flex-wrap items-center justify-between gap-2 sm:gap-2.5">
        {/* Toggle Mode Segmented Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-cyan-500/25">
          <button
            id="btn-stage-toggle-sun"
            onClick={() => handleSwitchMode('compare-sun')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeStageMode === 'compare-sun'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Size vs. Sun"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">size vs. Sun</span>
          </button>

          <button
            id="btn-stage-toggle-earth"
            onClick={() => handleSwitchMode('compare-earth')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeStageMode === 'compare-earth'
                ? 'bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Size vs. Earth"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">size vs. Earth</span>
          </button>

          <button
            id="btn-stage-toggle-solar"
            onClick={() => handleSwitchMode('solar-system')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeStageMode === 'solar-system'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="In Solar System"
          >
            <Orbit className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">In Solar System</span>
          </button>
        </div>

        {/* View Controls & Focus Tools */}
        <div className="flex items-center gap-2 flex-wrap">

          {/* Solar System Presets */}
          {activeStageMode === 'solar-system' && (
            <div className="flex items-center gap-1 bg-black/40 border border-cyan-500/20 rounded-lg p-0.5 text-[10px] font-mono text-slate-300 overflow-x-auto max-w-full scrollbar-none">
              <span className="px-1 text-slate-500 hidden sm:inline">Preset:</span>
              <button
                onClick={() => handleSetSolarPreset('host')}
                className="px-1.5 py-0.5 rounded text-cyan-300 font-semibold hover:bg-white/10 hover:text-white shrink-0"
                title="Zoom directly onto the host star at the center"
              >
                Host Star
              </button>
              <button
                onClick={() => handleSetSolarPreset('inner')}
                className="px-1.5 py-0.5 rounded hover:bg-white/10 hover:text-white shrink-0"
                title="Mercury to Mars (0.39 – 1.5 AU)"
              >
                Inner
              </button>
              <button
                onClick={() => handleSetSolarPreset('mid')}
                className="px-1.5 py-0.5 rounded hover:bg-white/10 hover:text-white shrink-0"
                title="Asteroid Belt & Jupiter (2.1 – 5.2 AU)"
              >
                Mid
              </button>
              <button
                onClick={() => handleSetSolarPreset('outer')}
                className="px-1.5 py-0.5 rounded hover:bg-white/10 hover:text-white shrink-0"
                title="Saturn to Neptune (9.6 – 30 AU)"
              >
                Outer
              </button>
              <button
                onClick={() => handleSetSolarPreset('dwarf')}
                className="px-1.5 py-0.5 rounded text-purple-300 hover:bg-purple-950/40 hover:text-purple-200 shrink-0"
                title="Pluto & Kuiper Belt Dwarf Planets (39 – 68 AU)"
              >
                Dwarf / Kuiper
              </button>
              <button
                onClick={() => handleSetSolarPreset('sedna')}
                className="px-1.5 py-0.5 rounded text-rose-300 bg-rose-950/40 border border-rose-500/30 hover:bg-rose-900/60 hover:text-rose-100 transition-colors shrink-0"
                title="Sedna & Inner Oort Cloud Detached Space (506 AU semi-major axis, 936 AU aphelion)"
              >
                Sedna / Oort
              </button>
              <button
                onClick={() => handleSetSolarPreset('hz')}
                className="px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold hover:bg-emerald-900/80 shrink-0"
                title="Frame the entire Goldilocks Habitable Zone (expanded for giant stars)"
              >
                Goldilocks HZ
              </button>
              <button
                onClick={() => setShowOrbitalLegend(!showOrbitalLegend)}
                className={`px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors shrink-0 ${
                  showOrbitalLegend
                    ? 'bg-purple-900/70 border border-purple-400/50 text-purple-200 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Toggle Keplerian orbital architecture data panel for dwarf & minor planets"
              >
                <Compass className="w-2.5 h-2.5 text-purple-400" />
                <span>Orbit Data</span>
              </button>
            </div>
          )}

          {/* Wireframe Toggle */}
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              wireframe
                ? 'bg-cyan-950/70 border-cyan-500/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-black/50 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={wireframe ? 'Disable wireframe mesh' : 'Enable wireframe mesh'}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Auto-rotate Toggle */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isAutoRotating
                ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300'
                : 'bg-black/50 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={isAutoRotating ? 'Pause 3D rotation' : 'Resume 3D rotation'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin-slow' : ''}`} />
          </button>

          {/* Zoom In Button */}
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg bg-black/50 border border-slate-700 hover:border-cyan-500/40 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Zoom camera in (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Out Button */}
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-black/50 border border-slate-700 hover:border-cyan-500/40 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Zoom camera out (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Reset Camera */}
          <button
            onClick={resetCamera}
            className="p-1.5 rounded-lg bg-black/50 border border-slate-700 hover:border-cyan-500/40 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Reset camera angle and framing"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Expand / Collapse Height */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-black/50 border border-slate-700 hover:border-cyan-500/40 text-slate-400 hover:text-white transition-all cursor-pointer"
            title={isExpanded ? 'Collapse viewport height' : 'Expand viewport height'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 3D Canvas Stage Viewport (Compact responsive height on desktop to occupy 1/2 of view) */}
      <div 
        className={`order-1 md:order-2 relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing ${
          isExpanded ? 'h-[360px] sm:h-[440px] md:h-[480px] lg:h-[460px]' : 'h-[240px] xs:h-[270px] sm:h-[310px] md:h-[340px] lg:h-[340px] xl:h-[360px]'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
      >
        {/* Ambient non-solid continuous starlight glow matching the hero image */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${star.colorHex}22 0%, ${star.coronaColorHex || star.colorHex}10 35%, transparent 70%)`,
            filter: 'blur(24px)',
          }}
        />
        <div 
          ref={containerRef} 
          className={`relative z-10 w-full h-full pointer-events-auto transition-opacity duration-200 ${isModeSwitching ? 'opacity-30' : 'opacity-100'}`} 
        />

        {/* Inspect HUD & Minimizable Controls (Moved to bottom right on mobile) */}
        <div className="absolute bottom-2 right-2 sm:bottom-auto sm:right-auto sm:top-2.5 sm:left-2.5 z-20 pointer-events-none flex flex-col items-end sm:items-start gap-1.5 max-w-[calc(100%-1rem)] sm:max-w-xs md:max-w-sm max-h-[calc(100%-1rem)]">
          {isInspectMinimized ? (
            /* Minimized Floating Pill */
            <button
              id="btn-inspect-toggle-minimized"
              onClick={() => setIsInspectMinimized(false)}
              className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#040816]/90 hover:bg-[#0c1636] active:scale-95 backdrop-blur-xl border border-cyan-500/40 text-cyan-300 text-[10px] sm:text-xs font-mono shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-all cursor-pointer hover:border-cyan-300 group"
              title="Expand inspect panel"
            >
              <Crosshair className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="font-bold whitespace-nowrap truncate max-w-[130px] sm:max-w-[180px]">
                {activeStageMode === 'compare-sun'
                  ? `Inspect: ${focusTarget === 'sun' ? 'Sun' : star.name}`
                  : activeStageMode === 'compare-earth'
                  ? `Inspect: ${focusTarget === 'earth' ? 'Earth' : star.name}`
                  : `Inspect: ${selectedBodyName || 'Host Star'}`}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            </button>
          ) : (
            /* Expanded Inspect Card */
            <div className="pointer-events-auto w-full max-h-[calc(100%-0.5rem)] overflow-y-auto scrollbar-thin p-2 sm:p-2.5 rounded-xl bg-[#040816]/95 backdrop-blur-xl border border-cyan-500/30 text-xs font-mono shadow-2xl flex flex-col gap-1.5 animate-in fade-in zoom-in-95 duration-150">
              {/* Header with Title and Minimize Button */}
              <div className="flex items-center justify-between gap-2 pb-1 border-b border-cyan-500/20">
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[10px] sm:text-[11px] uppercase tracking-wider font-mono">
                  <Crosshair className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>Inspect Target</span>
                </div>
                <button
                  id="btn-inspect-minimize"
                  onClick={() => setIsInspectMinimized(true)}
                  className="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer shrink-0"
                  title="Minimize inspect panel"
                >
                  <ChevronDown className="w-3.5 h-3.5 sm:hidden" />
                  <ChevronUp className="w-3.5 h-3.5 hidden sm:block" />
                </button>
              </div>

              {/* Mode 1: Sun Comparison Inspect */}
              {activeStageMode === 'compare-sun' && (
                <>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      id="btn-inspect-sun"
                      onClick={() => handleSetFocus('sun')}
                      title="Inspect Sun (Sol)"
                      className={`flex items-center gap-1.5 p-1.5 sm:px-2 sm:py-1.5 rounded-lg border text-left transition-all cursor-pointer active:scale-95 ${
                        focusTarget === 'sun'
                          ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-1 ring-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.4)] font-bold'
                          : 'bg-black/50 border-slate-700/60 text-slate-300 hover:text-white hover:border-amber-400/50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full aspect-square shrink-0 bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] sm:text-[11px] font-bold text-yellow-300 leading-tight truncate">Sun (Sol)</div>
                        <div className="text-[9px] text-slate-400 leading-tight truncate">1.00 D☉ (1.39M km)</div>
                      </div>
                    </button>

                    <button
                      id="btn-inspect-star"
                      onClick={() => handleSetFocus('star')}
                      title={`Inspect ${star.name}`}
                      className={`flex items-center gap-1.5 p-1.5 sm:px-2 sm:py-1.5 rounded-lg border text-left transition-all cursor-pointer active:scale-95 ${
                        focusTarget === 'star'
                          ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.4)] font-bold'
                          : 'bg-black/50 border-slate-700/60 text-slate-300 hover:text-white hover:border-cyan-400/50'
                      }`}
                    >
                      <span 
                        className="w-2 h-2 rounded-full aspect-square shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]" 
                        style={{ backgroundColor: star.colorHex }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] sm:text-[11px] font-bold text-cyan-300 leading-tight truncate">{star.name}</div>
                        <div className="text-[9px] text-slate-400 leading-tight truncate">
                          {star.diameterSolar < 0.01 
                            ? `${star.diameterSolar.toFixed(4)} D☉` 
                            : `${star.diameterSolar.toFixed(2)} D☉`} ({formatPhysicalDiameter(star.diameterKm).metricSi})
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Ratio summary comparison row */}
                  <div className="px-2 py-1 rounded-lg bg-black/60 border border-slate-700/40 text-[9.5px] sm:text-[10px] font-mono text-slate-300 flex items-center gap-1.5 leading-snug">
                    <Sparkles className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                    <span className="truncate">
                      {isSun ? (
                        <strong className="text-amber-300">Baseline Standard (1.00 D☉)</strong>
                      ) : star.diameterSolar > 1 ? (
                        <>
                          <strong className="text-cyan-300">{star.diameterSolar.toLocaleString(undefined, { maximumFractionDigits: 1 })}×</strong> wider than Sun
                        </>
                      ) : (
                        <>
                          Sun is <strong className="text-amber-300">{(1 / star.diameterSolar).toFixed(star.diameterSolar < 0.05 ? 1 : 2)}×</strong> wider
                        </>
                      )}
                    </span>
                  </div>
                </>
              )}

              {/* Mode 2: Earth Comparison Inspect */}
              {activeStageMode === 'compare-earth' && (
                <>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      id="btn-inspect-earth"
                      onClick={() => handleSetFocus('earth')}
                      title="Inspect Earth (Terra)"
                      className={`flex items-center gap-1.5 p-1.5 sm:px-2 sm:py-1.5 rounded-lg border text-left transition-all cursor-pointer active:scale-95 ${
                        focusTarget === 'earth'
                          ? 'bg-sky-500/25 border-sky-400 text-sky-300 ring-1 ring-sky-400/50 shadow-[0_0_12px_rgba(56,189,248,0.4)] font-bold'
                          : 'bg-black/50 border-slate-700/60 text-slate-300 hover:text-white hover:border-sky-400/50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full aspect-square shrink-0 bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] sm:text-[11px] font-bold text-sky-300 leading-tight truncate">Earth (Terra)</div>
                        <div className="text-[9px] text-slate-400 leading-tight truncate">1.00 D⊕ (12,742 km)</div>
                      </div>
                    </button>

                    <button
                      id="btn-inspect-star-earth"
                      onClick={() => handleSetFocus('star')}
                      title={`Inspect ${star.name}`}
                      className={`flex items-center gap-1.5 p-1.5 sm:px-2 sm:py-1.5 rounded-lg border text-left transition-all cursor-pointer active:scale-95 ${
                        focusTarget === 'star'
                          ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.4)] font-bold'
                          : 'bg-black/50 border-slate-700/60 text-slate-300 hover:text-white hover:border-cyan-400/50'
                      }`}
                    >
                      <span 
                        className="w-2 h-2 rounded-full aspect-square shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]" 
                        style={{ backgroundColor: star.colorHex }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] sm:text-[11px] font-bold text-cyan-300 leading-tight truncate">{star.name}</div>
                        <div className="text-[9px] text-slate-400 leading-tight truncate">
                          {(star.diameterKm / EARTH_DIAMETER_KM).toLocaleString(undefined, { maximumFractionDigits: 1 })} D⊕
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Ratio summary comparison row */}
                  <div className="px-2 py-1 rounded-lg bg-black/60 border border-slate-700/40 text-[9.5px] sm:text-[10px] font-mono text-slate-300 flex items-center gap-1.5 leading-snug">
                    <Sparkles className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                    <span className="truncate">
                      {star.diameterKm >= EARTH_DIAMETER_KM ? (
                        <>
                          <strong className="text-cyan-300">
                            {(star.diameterKm / EARTH_DIAMETER_KM).toLocaleString(undefined, { maximumFractionDigits: 1 })}×
                          </strong>{' '}
                          wider than Earth
                        </>
                      ) : (
                        <>
                          Earth is{' '}
                          <strong className="text-sky-300">
                            {(EARTH_DIAMETER_KM / star.diameterKm).toLocaleString(undefined, { maximumFractionDigits: 1 })}×
                          </strong>{' '}
                          wider than {star.name}
                        </>
                      )}
                    </span>
                  </div>
                </>
              )}

              {/* Mode 3: Solar System Placement Inspect */}
              {activeStageMode === 'solar-system' && (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <button
                      id="btn-inspect-host-star"
                      onClick={() => handleSetSolarPreset('host')}
                      title={`Inspect host star ${star.name}`}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-left transition-all cursor-pointer active:scale-95 ${
                        selectedBodyName === null
                          ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.4)] font-bold'
                          : 'bg-black/50 border-slate-700/60 text-slate-300 hover:text-white hover:border-cyan-400/50'
                      }`}
                    >
                      <Orbit className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate font-bold text-[10px] sm:text-[11px]">Host: {star.name}</span>
                    </button>

                    <div className="flex items-center gap-1 text-emerald-300 font-bold text-[9.5px] sm:text-[10px] shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
                      <span>HZ: {habitableZone.inner}–{habitableZone.outer} AU</span>
                    </div>
                  </div>

                  {/* Earth Condition Highlight Pill */}
                  {earthCondition && (
                    <div className="px-2 py-1 rounded-lg bg-black/60 border border-slate-700/40 text-[9.5px] sm:text-[10px] font-mono flex items-center gap-1.5 leading-snug">
                      <span className="text-slate-400 shrink-0">Earth (1.00 AU):</span>
                      {earthCondition.status === 'ENGULFED' && (
                        <span className="text-rose-400 font-bold flex items-center gap-1 truncate">
                          <Flame className="w-3 h-3 text-rose-500 animate-pulse shrink-0" />
                          Photosphere Engulfed
                        </span>
                      )}
                      {earthCondition.status === 'SCORCHED' && (
                        <span className="text-amber-400 font-bold flex items-center gap-1 truncate">
                          <Flame className="w-3 h-3 text-amber-500 shrink-0" />
                          Scorched Atmosphere
                        </span>
                      )}
                      {earthCondition.status === 'HABITABLE' && (
                        <span className="text-emerald-300 font-bold flex items-center gap-1 truncate">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          Habitable Liquid Water
                        </span>
                      )}
                      {earthCondition.status === 'FROZEN' && (
                        <span className="text-cyan-300 font-bold flex items-center gap-1 truncate">
                          <Snowflake className="w-3 h-3 text-cyan-400 shrink-0" />
                          Deep Frozen Ice Age
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Floating 3D Target & Reference Star/Body Labels */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {/* Target Star Floating 3D Label */}
          <div
            ref={labelStarRef}
            style={{ opacity: 0, willChange: 'transform, opacity' }}
            onClick={(e) => {
              e.stopPropagation();
              if (activeStageMode === 'solar-system') {
                handleSetSolarPreset('host');
              } else {
                handleSetFocus('star');
              }
            }}
            title={`Focus on ${star.name}`}
            className="absolute top-0 left-0 pointer-events-auto cursor-pointer flex flex-col items-center select-none group"
          >
            <div className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-xl border text-xs shadow-lg transition-all active:scale-95 whitespace-nowrap ${
              focusTarget === 'star' || (activeStageMode === 'solar-system' && selectedBodyName === null)
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-300 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.6)] ring-2 ring-cyan-400/80'
                : 'bg-[#040816]/95 hover:bg-[#0c1636] border-cyan-500/40 text-slate-100 font-semibold backdrop-blur-xl'
            }`}>
              <span
                className="w-2.5 h-2.5 rounded-full aspect-square shrink-0"
                style={{ backgroundColor: star.colorHex, boxShadow: `0 0 8px ${star.colorHex}` }}
              />
              <span className="font-bold tracking-tight text-white max-w-[180px] sm:max-w-[280px] truncate leading-normal">{star.name}</span>
              <span className="text-[10px] bg-slate-950/70 text-cyan-200 font-mono px-1.5 py-0.5 rounded border border-cyan-400/40 shrink-0">
                {star.spectralType}
              </span>
            </div>
          </div>

          {/* Reference Body Floating 3D Label (Sun or Earth) */}
          {(activeStageMode === 'compare-sun' || activeStageMode === 'compare-earth') && (
            <div
              ref={labelOtherRef}
              style={{ opacity: 0, willChange: 'transform, opacity' }}
              onClick={(e) => {
                e.stopPropagation();
                if (activeStageMode === 'compare-sun') {
                  handleSetFocus('sun');
                } else {
                  handleSetFocus('earth');
                }
              }}
              title={activeStageMode === 'compare-sun' ? 'Focus on Sun (Sol)' : 'Focus on Earth (Terra)'}
              className="absolute top-0 left-0 pointer-events-auto cursor-pointer flex flex-col items-center select-none group"
            >
              <div className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-xl border text-xs shadow-lg transition-all active:scale-95 whitespace-nowrap ${
                (activeStageMode === 'compare-sun' && focusTarget === 'sun') || (activeStageMode === 'compare-earth' && focusTarget === 'earth')
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 border-amber-300 text-slate-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.6)] ring-2 ring-amber-400/80'
                  : 'bg-[#040816]/95 hover:bg-[#0c1636] border-slate-700 text-slate-200 font-semibold backdrop-blur-xl'
              }`}>
                <span
                  className="w-2.5 h-2.5 rounded-full aspect-square shrink-0"
                  style={{
                    backgroundColor: activeStageMode === 'compare-sun' ? '#FDB813' : '#38bdf8',
                    boxShadow: activeStageMode === 'compare-sun' ? '0 0 8px #FDB813' : '0 0 8px #38bdf8',
                  }}
                />
                <span className="font-bold tracking-tight max-w-[180px] sm:max-w-[280px] truncate leading-normal">
                  {activeStageMode === 'compare-sun' ? 'Sun (Sol)' : 'Earth (Terra)'}
                </span>
                <span className="text-[10px] bg-slate-950/70 text-slate-300 font-mono px-1.5 py-0.5 rounded border border-slate-700 shrink-0">
                  {activeStageMode === 'compare-sun' ? 'G2V' : '1.00 R⊕'}
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Interactive Gesture Hint Pill at bottom right */}
        <div className="absolute bottom-2.5 right-2.5 pointer-events-none px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-400 hidden sm:flex items-center gap-2">
          <span>Click star to focus</span>
          <span>•</span>
          <span>Drag to orbit</span>
          <span>•</span>
          <span>Scroll to zoom</span>
        </div>
      </div>

      {/* Mode 2 Planetary Fate Strip at the bottom of the stage */}
      {activeStageMode === 'solar-system' && (
        <div className="order-3 md:order-3 p-3 border-t border-cyan-500/20 bg-[#020515]/90 overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-2 min-w-max">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1 mr-1">
              <Eye className="w-3 h-3 text-cyan-400" />
              Planetary System Status:
            </span>

            {/* Asteroid Belt Status Badge */}
            <div
              className={`px-2 py-1 rounded-lg border text-[11px] font-mono flex items-center gap-1.5 transition-all ${
                asteroidBeltCondition.status === 'ENGULFED'
                  ? 'bg-rose-950/60 border-rose-700/50 text-rose-300'
                  : asteroidBeltCondition.status === 'SCORCHED'
                  ? 'bg-amber-950/60 border-amber-600/50 text-amber-300'
                  : asteroidBeltCondition.status === 'HABITABLE'
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-900/60 border-slate-700/40 text-slate-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>Asteroid Belt ({asteroidBeltCondition.span}):</span>
              <span className="font-semibold">
                {asteroidBeltCondition.status === 'ENGULFED' && '💥 Engulfed'}
                {asteroidBeltCondition.status === 'SCORCHED' && '🔥 Scorched'}
                {asteroidBeltCondition.status === 'HABITABLE' && '🌱 Habitable'}
                {asteroidBeltCondition.status === 'FROZEN' && '❄️ Frozen'}
              </span>
            </div>

            {/* Kuiper Belt Status Badge */}
            <div
              className={`px-2 py-1 rounded-lg border text-[11px] font-mono flex items-center gap-1.5 transition-all ${
                kuiperBeltCondition.status === 'ENGULFED'
                  ? 'bg-rose-950/60 border-rose-700/50 text-rose-300'
                  : kuiperBeltCondition.status === 'SCORCHED'
                  ? 'bg-amber-950/60 border-amber-600/50 text-amber-300'
                  : kuiperBeltCondition.status === 'HABITABLE'
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-900/60 border-cyan-700/40 text-cyan-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Kuiper Belt ({kuiperBeltCondition.span}):</span>
              <span className="font-semibold">
                {kuiperBeltCondition.status === 'ENGULFED' && '💥 Engulfed'}
                {kuiperBeltCondition.status === 'SCORCHED' && '🔥 Scorched'}
                {kuiperBeltCondition.status === 'HABITABLE' && '🌱 Habitable'}
                {kuiperBeltCondition.status === 'FROZEN' && '❄️ Frozen'}
              </span>
            </div>

            {/* Planets, Dwarf Planets, and Minor Planets */}
            {planetConditions.map((planet) => {
              const isSelected = selectedBodyName === planet.name;
              return (
                <button
                  key={planet.name}
                  onClick={() => handleFocusBody(planet.name)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'ring-2 ring-cyan-400 scale-105 shadow-[0_0_12px_rgba(34,211,238,0.5)] bg-slate-800 border-cyan-400 text-white'
                      : planet.status === 'ENGULFED'
                      ? 'bg-rose-950/60 border-rose-700/50 text-rose-300 hover:bg-rose-900/70'
                      : planet.status === 'SCORCHED'
                      ? 'bg-amber-950/60 border-amber-600/50 text-amber-300 hover:bg-amber-900/70'
                      : planet.status === 'HABITABLE'
                      ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:bg-emerald-900/80'
                      : 'bg-slate-900/60 border-slate-700/40 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                  title={`Click to focus 3D camera on ${planet.name}`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: planet.color }}
                  />
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-white">
                      {planet.name}
                      {planet.isDwarfPlanet && (
                        <span className="text-[9px] text-purple-300 font-bold ml-1 bg-purple-950/80 border border-purple-500/40 px-1 py-0.2 rounded">
                          Dwarf
                        </span>
                      )}
                      {planet.isMinorPlanet && (
                        <span className={`text-[9px] font-bold ml-1 px-1 py-0.2 rounded border ${
                          planet.name === 'Sedna'
                            ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                            : planet.name === 'Chiron'
                            ? 'bg-lime-950/80 border-lime-500/40 text-lime-300'
                            : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                        }`}>
                          {planet.name === 'Sedna' ? 'Sednoid' : planet.name === 'Chiron' ? 'Centaur' : 'Minor'}
                        </span>
                      )}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {(planet.isDwarfPlanet || planet.isMinorPlanet) ? (
                        <span>
                          ({planet.perihelionAU.toFixed(1)}–{planet.aphelionAU.toFixed(1)} AU, e={planet.eccentricity}, i={planet.inclinationDeg}°)
                        </span>
                      ) : (
                        <span>({planet.distanceAU.toFixed(2)} AU)</span>
                      )}:
                    </span>
                  </div>
                  <span className="font-semibold shrink-0">
                    {planet.status === 'ENGULFED' && '💥 Engulfed'}
                    {planet.status === 'SCORCHED' && '🔥 Scorched'}
                    {planet.status === 'HABITABLE' && '🌱 Habitable'}
                    {planet.status === 'FROZEN' && '❄️ Frozen'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
