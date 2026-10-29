import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Keyboard,
  X,
  ArrowUpDown,
  Check,
  Grid,
  Telescope,
  RotateCcw,
  RotateCw,
  Layers,
  Eye,
  EyeOff,
  Play,
  Pause,
  Clock,
  Search,
  Square,
  Sliders,
  Maximize2,
  Minimize2,
  Orbit,
  MoveHorizontal,
} from 'lucide-react';
import { CelestialBody, TourLength, CelestialClassification } from '../types';
import { createContinuousGridMesh, ContinuousGridHandle } from '../utils/continuousGrid';
import { soundEffects } from '../utils/soundEffects';
import {
  PLANET_VERTEX_SHADER,
  PLANET_FRAGMENT_SHADER,
  getThemeIndex,
} from '../utils/planetShaderUtils';
import { STAR_VERTEX_SHADER, STAR_FRAGMENT_SHADER } from '../utils/starShaderUtils';

export type CelestialSortKey = 'size' | 'mass' | 'temperature' | 'discoveryYear';
export type SortDirection = 'asc' | 'desc';

const TOUR_DURATION_MAP: Record<TourLength, number> = {
  short: 1200,
  medium: 2400,
  long: 4500,
};

// 1 Three.js unit = 1 Solar Radius (696,350 km)
// Exactly aligns with continuousGrid.ts (KM_PER_UNIT = 696350.0)
const KM_TO_SOLAR_RADIUS = 1.0 / 1392700.0;

function inferBodyColor(body: CelestialBody): string {
  if (body.classification === 'Star') return '#fde047';
  const name = body.name.toLowerCase();
  if (name === 'earth') return '#38bdf8';
  if (name === 'mars') return '#f87171';
  if (name === 'venus') return '#fef08a';
  if (name === 'mercury' || name === 'the moon') return '#cbd5e1';
  if (name === 'jupiter') return '#fdba74';
  if (name === 'saturn') return '#fef08a';
  if (name === 'uranus') return '#67e8f9';
  if (name === 'neptune') return '#60a5fa';
  if (name === 'io') return '#facc15';
  if (name === 'europa' || name === 'enceladus') return '#e0f2fe';
  if (name === 'titan') return '#f59e0b';
  if (name === 'pluto' || name === 'charon') return '#d6d3d1';

  switch (body.classification) {
    case 'Gas Giants':
      return '#fb923c';
    case 'Ice Giants':
      return '#38bdf8';
    case 'Terrestrial Planet':
      return '#34d399';
    case 'Dwarf planet':
    case 'Plutino':
    case 'Trans-Neptunian Object':
      return '#a78bfa';
    case 'Asteroid':
      return '#94a3b8';
    case 'Exoplanet':
      if (body.diameterJupiter >= 0.8) return '#fb923c';
      if (body.diameterEarth >= 1.8) return '#22d3ee';
      return '#4ade80';
    default:
      if (body.classification.startsWith('Moon of')) return '#93c5fd';
      return '#38bdf8';
  }
}

function getTourMetricDisplay(body: CelestialBody, sortKey: CelestialSortKey) {
  switch (sortKey) {
    case 'mass': {
      const mEarth = body.massEarth ?? 0;
      const mJup = body.massJupiter ?? (mEarth > 0 ? mEarth / 317.828 : 0);
      const isGiant = mJup >= 0.1;
      const primary = isGiant
        ? `${mJup.toFixed(2)} M♃`
        : mEarth > 0
        ? `${mEarth.toFixed(2)} M⊕`
        : 'Unknown Mass';
      const secondary = mEarth > 0
        ? `${mEarth.toLocaleString(undefined, { maximumFractionDigits: 2 })} Earth masses (${(mEarth * 5.972e24).toExponential(2)} kg)`
        : 'Mass unmeasured';
      return {
        label: 'PLANETARY MASS',
        primary,
        secondary,
        unit: isGiant ? 'Jupiter Masses (M♃)' : 'Earth Masses (M⊕)',
      };
    }
    case 'temperature': {
      const t = body.temperatureK ?? 0;
      const c = t > 0 ? Math.round(t - 273.15) : 0;
      const f = t > 0 ? Math.round((t - 273.15) * 1.8 + 32) : 0;
      const primary = t > 0 ? `${t.toLocaleString()} K` : 'Estimated Temp';
      const secondary = t > 0 ? `${c.toLocaleString()} °C • ${f.toLocaleString()} °F` : 'Equilibrium temp pending';
      return {
        label: 'EQUILIBRIUM TEMPERATURE',
        primary,
        secondary,
        unit: 'Kelvin (K)',
      };
    }
    case 'discoveryYear': {
      const yr = body.discoveryYear ?? 0;
      return {
        label: 'DISCOVERY YEAR',
        primary: yr > 0 ? `${yr}` : 'Antiquity / Prehistoric',
        secondary: body.discoveryMethod ? `Method: ${body.discoveryMethod}` : `Host System: ${body.hostSystem}`,
        unit: 'Year',
      };
    }
    case 'size':
    default: {
      const dKm = body.diameterKm;
      const miles = Math.round(dKm * 0.621371).toLocaleString();
      const kmFormatted = `${Math.round(dKm).toLocaleString()} km`;

      let primary = '';
      if (body.classification === 'Star') {
        primary = `${(dKm / 1392700).toFixed(2)} D☉`;
      } else if (body.diameterJupiter >= 0.5) {
        primary = `${body.diameterJupiter.toFixed(2)} D♃`;
      } else if (body.diameterEarth >= 0.1) {
        primary = `${body.diameterEarth.toFixed(2)} D⊕`;
      } else {
        primary = `${kmFormatted}`;
      }

      const secondary = `${kmFormatted} (${miles} mi • ${body.diameterEarth.toFixed(body.diameterEarth < 0.1 ? 3 : 2)} D⊕ • ${body.diameterJupiter.toFixed(body.diameterJupiter < 0.05 ? 4 : 2)} D♃)`;

      return {
        label: 'PHYSICAL DIAMETER',
        primary,
        secondary,
        unit: 'Kilometers / Earth Diameters (D⊕)',
      };
    }
  }
}

interface ExoplanetCanvas3DProps {
  items: CelestialBody[];
  selectedId?: string | null;
  onSelectItem?: (body: CelestialBody | null) => void;
  showCorona?: boolean;
}

export const ExoplanetCanvas3D: React.FC<ExoplanetCanvas3DProps> = ({
  items,
  selectedId,
  onSelectItem,
  showCorona = true,
}) => {
  const outerWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeBodyId, setActiveBodyId] = useState<string | null>(() => selectedId ?? items[0]?.id ?? null);

  useEffect(() => {
    if (selectedId !== undefined) {
      setActiveBodyId(selectedId);
    }
  }, [selectedId]);

  const handleSelect = useCallback(
    (body: CelestialBody | null) => {
      setActiveBodyId(body ? body.id : null);
      if (onSelectItem) onSelectItem(body);
    },
    [onSelectItem]
  );

  // Sorting
  const [sortKey, setSortKey] = useState<CelestialSortKey>('size');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  // Scene Controls
  const [layoutMode, setLayoutMode] = useState<'linear' | 'spiral'>('spiral');
  const [isLayoutMenuOpen, setIsLayoutMenuOpen] = useState(false);
  const layoutMenuRef = useRef<HTMLDivElement>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [rotationSpeed] = useState(1.0);
  const [hoveredBody, setHoveredBody] = useState<CelestialBody | null>(null);
  const [isTopPanelMinimized, setIsTopPanelMinimized] = useState(false);
  const [isTogglesMenuOpen, setIsTogglesMenuOpen] = useState(false);
  const togglesMenuRef = useRef<HTMLDivElement>(null);

  // Tour Mode
  const [isTourMode, setIsTourMode] = useState(false);
  const [isTourPlaying, setIsTourPlaying] = useState(false);
  const [tourLength, setTourLength] = useState<TourLength>('medium');
  const [isTourPaceMenuOpen, setIsTourPaceMenuOpen] = useState(false);
  const tourPaceMenuRef = useRef<HTMLDivElement>(null);
  const isTourPlayingRef = useRef(isTourPlaying);
  isTourPlayingRef.current = isTourPlaying;
  const isTourModeRef = useRef(isTourMode);
  isTourModeRef.current = isTourMode;

  // Search
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // UI state
  const [areControlsHidden, setAreControlsHidden] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  // Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bodyObjectsRef = useRef<Map<string, THREE.Group>>(new Map());
  const labelElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const animFrameIdRef = useRef<number | null>(null);
  const continuousGridRef = useRef<ContinuousGridHandle | null>(null);
  const sharedTimeUniformRef = useRef<{ value: number }>({ value: 0 });
  const materialCacheRef = useRef<Map<string, THREE.ShaderMaterial>>(new Map());
  const interactiveMeshesRef = useRef<THREE.Object3D[]>([]);
  const pendingRaycastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Smooth camera tracking
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 15, 60));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const cameraDistanceRef = useRef(40);
  const cameraAngleRef = useRef({ theta: 0, phi: Math.PI / 3 });
  const isInitialMountRef = useRef(true);
  const orbitVelocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const isRightDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const touchStartDistanceRef = useRef<number | null>(null);
  const lastActiveIdRef = useRef<string | null>(null);

  // Sort bodies
  const sortedBodies = useMemo(() => {
    const list = [...items];
    list.sort((a, b) => {
      let diff = 0;
      if (sortKey === 'size') {
        diff = a.diameterKm - b.diameterKm;
      } else if (sortKey === 'mass') {
        diff = (a.massEarth ?? 0) - (b.massEarth ?? 0);
      } else if (sortKey === 'temperature') {
        diff = (a.temperatureK ?? 0) - (b.temperatureK ?? 0);
      } else if (sortKey === 'discoveryYear') {
        diff = (a.discoveryYear ?? 0) - (b.discoveryYear ?? 0);
      }

      if (diff === 0) {
        diff = a.diameterKm - b.diameterKm;
      }
      if (diff === 0) {
        diff = a.name.localeCompare(b.name);
      }

      return sortDirection === 'desc' ? -diff : diff;
    });
    return list;
  }, [items, sortKey, sortDirection]);

  const sortedBodiesRef = useRef(sortedBodies);
  sortedBodiesRef.current = sortedBodies;

  const activeIndex = useMemo(() => {
    if (!activeBodyId) return -1;
    return sortedBodies.findIndex((b) => b.id === activeBodyId);
  }, [sortedBodies, activeBodyId]);

  // Compute 3D scales and positions (linear or spiral, matching StarCanvas3D)
  const bodyScales = useMemo(() => {
    const scales: Record<string, { radius: number; xPos: number; zPos: number; colorHex: string }> = {};

    if (layoutMode === 'spiral') {
      const isDescending = sortDirection === 'desc';

      if (isDescending) {
        // Descending size spiral: largest body at center (0, 0), winding outward to smallest
        const coreBody = sortedBodies[0];
        const coreRadius = coreBody ? Math.max(0.0001, coreBody.diameterKm * KM_TO_SOLAR_RADIUS) : 0.001;

        if (coreBody) {
          scales[coreBody.id] = {
            radius: coreRadius,
            xPos: 0,
            zPos: 0,
            colorHex: inferBodyColor(coreBody),
          };
        }

        let currentTheta = 0;
        let currentR = Math.max(0.05, coreRadius * 1.25 + 0.02);

        for (let idx = 1; idx < sortedBodies.length; idx++) {
          const body = sortedBodies[idx];
          const radius = Math.max(0.0001, body.diameterKm * KM_TO_SOLAR_RADIUS);
          const prevBody = sortedBodies[idx - 1];
          const prevRadius = scales[prevBody.id]?.radius || 0.0001;

          // Chord distance along the spiral arm between surface of body and prev body:
          const chord = (prevRadius + radius) * 1.38;
          const minRForChord = chord / 1.2;
          if (currentR < minRForChord) currentR = minRForChord;

          // Angular step along the circle arc:
          const dTheta = chord / currentR;
          currentTheta += dTheta;

          // Radial expansion per step: ensures radial distance between turns clears body diameter:
          const dR = ((2 * radius * 1.45) / (2 * Math.PI)) * dTheta;
          currentR += dR;

          const xPos = currentR * Math.cos(currentTheta);
          const zPos = currentR * Math.sin(currentTheta);

          scales[body.id] = {
            radius,
            xPos,
            zPos,
            colorHex: inferBodyColor(body),
          };
        }
      } else {
        // Ascending size spiral: smallest body at center (0, 0), winding outward to largest
        let currentTheta = 0;
        let currentR = 0.005;

        sortedBodies.forEach((body, idx) => {
          const radius = Math.max(0.0001, body.diameterKm * KM_TO_SOLAR_RADIUS);

          if (idx === 0) {
            currentR = Math.max(0.005, radius * 4);
            currentTheta = 0;
          } else {
            const prevBody = sortedBodies[idx - 1];
            const prevRadius = scales[prevBody.id]?.radius || 0.0001;
            // Chord distance along the spiral arm between surface of body and prev body:
            const chord = (prevRadius + radius) * 1.38;
            const minRForChord = chord / 1.5;
            if (currentR < minRForChord) currentR = minRForChord;

            // Angular step along the circle arc:
            const dTheta = chord / currentR;
            currentTheta += dTheta;

            // Radial expansion per step: ensures radial distance between turns clears body diameter:
            const dR = ((2 * radius * 1.5) / (2 * Math.PI)) * dTheta;
            currentR += dR;
          }

          const xPos = currentR * Math.cos(currentTheta);
          const zPos = currentR * Math.sin(currentTheta);

          scales[body.id] = {
            radius,
            xPos,
            zPos,
            colorHex: inferBodyColor(body),
          };
        });
      }
    } else {
      // Linear layout along X-axis (z = 0)
      let currentX = 0;
      const PROPORTIONAL_GAP_FACTOR = 0.38;

      sortedBodies.forEach((body, idx) => {
        const radius = Math.max(0.0001, body.diameterKm * KM_TO_SOLAR_RADIUS);
        const colorHex = inferBodyColor(body);

        if (idx === 0) {
          currentX = radius;
        } else {
          const prevBody = sortedBodies[idx - 1];
          const prevRadius = scales[prevBody.id]?.radius || 0.0001;
          const gap = (prevRadius + radius) * PROPORTIONAL_GAP_FACTOR;
          currentX += prevRadius + radius + gap;
        }

        scales[body.id] = {
          radius,
          xPos: currentX,
          zPos: 0,
          colorHex,
        };
      });
    }

    return scales;
  }, [sortedBodies, layoutMode, sortDirection]);

  const bodyScalesRef = useRef(bodyScales);
  bodyScalesRef.current = bodyScales;

  // Filtered search results
  const filteredBodies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sortedBodies;
    return sortedBodies.filter((b) => {
      return (
        b.name.toLowerCase().includes(q) ||
        b.classification.toLowerCase().includes(q) ||
        b.hostSystem.toLowerCase().includes(q)
      );
    });
  }, [sortedBodies, searchQuery]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (sortMenuRef.current && !sortMenuRef.current.contains(target)) {
        setIsSortMenuOpen(false);
      }
      if (tourPaceMenuRef.current && !tourPaceMenuRef.current.contains(target)) {
        setIsTourPaceMenuOpen(false);
      }
      if (togglesMenuRef.current && !togglesMenuRef.current.contains(target)) {
        setIsTogglesMenuOpen(false);
      }
      if (layoutMenuRef.current && !layoutMenuRef.current.contains(target)) {
        setIsLayoutMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Camera framing for body (matching StarCanvas3D proportions)
  const getCameraFraming = useCallback(
    (bodyId: string, isTour: boolean) => {
      const sc = bodyScalesRef.current[bodyId];
      if (!sc) return null;
      const r = sc.radius;

      const targetY = isTour ? r * 1.05 : r;
      // Proportional distance: fills ~45% of viewport center
      const baseDist = isTour ? Math.max(0.000045, r * 4.2) : Math.max(0.000035, r * 3.4);

      return {
        target: new THREE.Vector3(sc.xPos, targetY, sc.zPos),
        distance: baseDist,
        angle: { theta: 0, phi: Math.PI / 3 },
      };
    },
    []
  );

  // Setup Three.js WebGL viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#02040c');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.0000001, 500000);
    camera.position.set(0, 20, 65);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Starfield Background
    const starCount = 5000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#a0c4ff'),
      new THREE.Color('#ffc6a0'),
      new THREE.Color('#93c5fd'),
    ];

    for (let i = 0; i < starCount; i++) {
      const r = THREE.MathUtils.randFloat(35000, 300000);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
      const col = palette[Math.floor(Math.random() * palette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 3.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // Ambient Lighting
    scene.add(new THREE.AmbientLight('#ffffff', 0.9));

    // Continuous Procedural Grid
    const gridGroup = new THREE.Group();
    gridGroup.name = 'ContinuousGridGroup';
    const gridHandle = createContinuousGridMesh({
      yLevel: 0,
      leftAligned: false,
    });
    gridGroup.add(gridHandle.mesh);
    scene.add(gridGroup);
    continuousGridRef.current = gridHandle;

    // ResizeObserver ensures viewport is never cramped
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW && newH && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (rendererRef.current) rendererRef.current.dispose();
      starGeo.dispose();
      starMat.dispose();
    };
  }, []);

  // Update wireframe property on cached materials
  useEffect(() => {
    materialCacheRef.current.forEach((mat) => {
      mat.wireframe = wireframe;
      mat.needsUpdate = true;
    });
  }, [wireframe]);

  // Update grid visibility
  useEffect(() => {
    if (continuousGridRef.current) {
      continuousGridRef.current.mesh.visible = showGrid;
    }
  }, [showGrid]);

  // Build 3D sphere meshes (shared geometries and cached ShaderMaterials)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove old groups
    bodyObjectsRef.current.forEach((group) => scene.remove(group));
    bodyObjectsRef.current.clear();
    interactiveMeshesRef.current = [];

    const sharedSphereGeo = new THREE.SphereGeometry(1, 48, 48);
    const sharedHitGeo = new THREE.SphereGeometry(1, 16, 16);

    const getMaterial = (body: CelestialBody): THREE.ShaderMaterial => {
      if (body.classification === 'Star') {
        const key = `star-${wireframe ? 'w' : 's'}`;
        let mat = materialCacheRef.current.get(key);
        if (!mat) {
          mat = new THREE.ShaderMaterial({
            wireframe,
            vertexShader: STAR_VERTEX_SHADER,
            fragmentShader: STAR_FRAGMENT_SHADER,
            uniforms: {
              time: sharedTimeUniformRef.current,
              baseColor: { value: new THREE.Color('#fef08a') },
              coronaColor: { value: new THREE.Color('#f59e0b') },
              temperature: { value: 5778.0 },
              isPulsar: { value: 0.0 },
              isContactBinary: { value: 0.0 },
              brownDwarfType: { value: 0.0 },
              densityFactor: { value: 0.5 },
              spectralClassIndex: { value: 4.0 },
              spectralSubclass: { value: 2.0 },
              hasSpectralData: { value: 1.0 },
            },
          });
          materialCacheRef.current.set(key, mat);
        }
        return mat;
      }

      const theme = body.textureTheme ?? (body.diameterJupiter >= 0.5 ? 'gas-giant-banded' : 'terrestrial-rocky');
      const themeIdx = getThemeIndex(theme);
      const seedBucket = Math.floor(body.diameterKm % 8);
      const key = `planet-${themeIdx}-${seedBucket}-${wireframe ? 'w' : 's'}`;

      let mat = materialCacheRef.current.get(key);
      if (!mat) {
        mat = new THREE.ShaderMaterial({
          wireframe,
          vertexShader: PLANET_VERTEX_SHADER,
          fragmentShader: PLANET_FRAGMENT_SHADER,
          uniforms: {
            time: sharedTimeUniformRef.current,
            themeIndex: { value: themeIdx },
            temperatureK: { value: body.temperatureK || 300 },
            lightDir: { value: new THREE.Vector3(1.0, 0.4, 0.8).normalize() },
            seed: { value: seedBucket * 1.618 },
          },
        });
        materialCacheRef.current.set(key, mat);
      }
      return mat;
    };

    sortedBodies.forEach((body) => {
      const sc = bodyScales[body.id];
      if (!sc) return;

      const group = new THREE.Group();
      group.position.set(sc.xPos, sc.radius, sc.zPos);
      group.userData = { bodyId: body.id, bodyData: body };

      const mat = getMaterial(body);
      const mesh = new THREE.Mesh(sharedSphereGeo, mat);
      mesh.scale.setScalar(sc.radius);
      mesh.name = `Sphere-${body.id}`;
      mesh.userData = { bodyData: body };
      group.add(mesh);
      interactiveMeshesRef.current.push(mesh);

      // Tap hit target for small moons/asteroids
      const hitR = Math.max(sc.radius * 1.25, 0.0003);
      const hitMesh = new THREE.Mesh(sharedHitGeo, new THREE.MeshBasicMaterial({ visible: false }));
      hitMesh.scale.setScalar(hitR);
      hitMesh.userData = { bodyData: body };
      group.add(hitMesh);
      interactiveMeshesRef.current.push(hitMesh);

      scene.add(group);
      bodyObjectsRef.current.set(body.id, group);
    });

    return () => {
      sharedSphereGeo.dispose();
      sharedHitGeo.dispose();
    };
  }, [sortedBodies, bodyScales, wireframe]);

  // Camera focus updates
  useEffect(() => {
    if (!activeBodyId) {
      // Panoramic Fit All
      const scaleList = Object.values(bodyScales);
      if (scaleList.length === 0) return;

      if (layoutMode === 'spiral') {
        const isDescending = sortDirection === 'desc';
        // Ascending spiral: smallest body (#1) is at the center (0, 0)
        // Descending spiral: largest body is at center, smallest is at outer edge
        const focusedDefault = isDescending ? sortedBodies[sortedBodies.length - 1] : sortedBodies[0];
        const defaultScale = focusedDefault ? bodyScales[focusedDefault.id] : null;
        if (defaultScale) {
          cameraTargetRef.current.set(defaultScale.xPos, defaultScale.radius, defaultScale.zPos);
          cameraDistanceRef.current = Math.max(0.005, defaultScale.radius * 6.5);
        } else {
          cameraTargetRef.current.set(0, 0, 0);
          cameraDistanceRef.current = 15;
        }
      } else {
        const last = scaleList[scaleList.length - 1];
        const midX = last.xPos / 2;
        const maxR = last.radius;
        cameraTargetRef.current.set(midX, maxR * 0.45, 0);
        cameraDistanceRef.current = Math.max(45, (last.xPos + maxR) * 0.72);
      }
      cameraAngleRef.current = { theta: 0, phi: Math.PI / 3 };
    } else {
      const framing = getCameraFraming(activeBodyId, isTourPlayingRef.current);
      if (framing) {
        cameraTargetRef.current.copy(framing.target);
        cameraDistanceRef.current = framing.distance;
        cameraAngleRef.current = { ...framing.angle };
      }
    }

    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      const { theta, phi } = cameraAngleRef.current;
      const dist = cameraDistanceRef.current;
      const target = cameraTargetRef.current;
      const initX = target.x + dist * Math.sin(phi) * Math.sin(theta);
      const initY = target.y + dist * Math.cos(phi);
      const initZ = target.z + dist * Math.sin(phi) * Math.cos(theta);
      currentCameraPosRef.current.set(initX, initY, initZ);
      currentLookAtRef.current.copy(target);
      if (cameraRef.current) {
        cameraRef.current.position.set(initX, initY, initZ);
        cameraRef.current.lookAt(target);
      }
    }
  }, [activeBodyId, bodyScales, getCameraFraming]);

  // Main Render & Animation Loop
  useEffect(() => {
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsedTime = clock.getElapsedTime();

      // Damping
      if (!isDraggingRef.current) {
        if (Math.abs(orbitVelocityRef.current.x) > 0.00005 || Math.abs(orbitVelocityRef.current.y) > 0.00005) {
          cameraAngleRef.current.theta += orbitVelocityRef.current.x;
          cameraAngleRef.current.phi = Math.max(
            0.1,
            Math.min(Math.PI - 0.1, cameraAngleRef.current.phi + orbitVelocityRef.current.y)
          );
          orbitVelocityRef.current.x *= 0.91;
          orbitVelocityRef.current.y *= 0.91;
        }
      }

      // Time uniform update
      sharedTimeUniformRef.current.value = (elapsedTime % 600.0) * rotationSpeed;

      // Axial rotation
      if (isAutoRotating) {
        const baseRot = delta * 0.18 * rotationSpeed;
        bodyObjectsRef.current.forEach((grp) => {
          grp.rotation.y += baseRot;
        });
      }

      // Throttled raycasting
      if (pendingRaycastPosRef.current && containerRef.current && cameraRef.current && !isDraggingRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = ((pendingRaycastPosRef.current.x - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((pendingRaycastPosRef.current.y - rect.top) / rect.height) * 2 + 1;
        pendingRaycastPosRef.current = null;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);
        const intersects = raycaster.intersectObjects(interactiveMeshesRef.current, false);

        let hit: CelestialBody | null = null;
        if (intersects.length > 0) {
          let obj: THREE.Object3D | null = intersects[0].object;
          while (obj && (!obj.userData || !obj.userData.bodyData) && obj.parent) {
            obj = obj.parent;
          }
          hit = (obj?.userData?.bodyData as CelestialBody) ?? null;
        }

        setHoveredBody(hit);
        if (containerRef.current) {
          containerRef.current.style.cursor = hit ? 'pointer' : 'grab';
        }
      }

      // Camera flight interpolation (fluid, zero-delay travel)
      if (cameraRef.current) {
        const { theta, phi } = cameraAngleRef.current;
        const dist = cameraDistanceRef.current;

        const targetX = cameraTargetRef.current.x + dist * Math.sin(phi) * Math.sin(theta);
        const targetY = cameraTargetRef.current.y + dist * Math.cos(phi);
        const targetZ = cameraTargetRef.current.z + dist * Math.sin(phi) * Math.cos(theta);
        const targetPos = new THREE.Vector3(targetX, targetY, targetZ);

        const decayRate = isTourPlayingRef.current ? 5.5 : 4.5;
        const lerpFactor = Math.min(1.0, 1.0 - Math.exp(-decayRate * delta));

        currentCameraPosRef.current.lerp(targetPos, lerpFactor);
        currentLookAtRef.current.lerp(cameraTargetRef.current, lerpFactor);

        cameraRef.current.position.copy(currentCameraPosRef.current);
        cameraRef.current.lookAt(currentLookAtRef.current);

        // Dynamic clip planes: completely prevents Z-fighting and black clipping
        const targetNear = Math.max(0.0000001, Math.min(30.0, dist * 0.002));
        const targetFar = Math.max(150000, dist * 35.0);
        if (
          Math.abs(cameraRef.current.near - targetNear) > targetNear * 0.1 ||
          Math.abs(cameraRef.current.far - targetFar) > 100
        ) {
          cameraRef.current.near = targetNear;
          cameraRef.current.far = targetFar;
          cameraRef.current.updateProjectionMatrix();
        }
      }

      // Update continuous grid
      if (continuousGridRef.current && cameraRef.current) {
        const distToFocus = currentCameraPosRef.current.distanceTo(currentLookAtRef.current);
        continuousGridRef.current.update(cameraRef.current, distToFocus);
      }

      // 2D Floating Pill Label above active/hovered body (Zero DOM thrashing)
      if (containerRef.current && cameraRef.current) {
        const currentActiveId = hoveredBody?.id || activeBodyId;

        if (lastActiveIdRef.current && lastActiveIdRef.current !== currentActiveId) {
          const prevEl = labelElementsRef.current.get(lastActiveIdRef.current);
          if (prevEl) {
            prevEl.style.opacity = '0';
            prevEl.style.pointerEvents = 'none';
          }
        }
        lastActiveIdRef.current = currentActiveId || null;

        if (currentActiveId) {
          const el = labelElementsRef.current.get(currentActiveId);
          const sc = bodyScalesRef.current[currentActiveId];
          if (el && sc) {
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            const apexY = sc.radius * 2;
            const tempVec = new THREE.Vector3(sc.xPos, apexY, sc.zPos).project(cameraRef.current);

            if (tempVec.z > 1.0 || Math.abs(tempVec.x) > 1.4 || Math.abs(tempVec.y) > 1.4) {
              el.style.opacity = '0';
              el.style.pointerEvents = 'none';
            } else {
              const screenX = ((tempVec.x + 1) / 2) * width;
              const screenY = ((-tempVec.y + 1) / 2) * height;
              const safeMarginX = Math.min(width * 0.25, 90);
              const clampedX = Math.max(safeMarginX, Math.min(width - safeMarginX, screenX));
              const isNearTop = screenY < 55;
              const posY = isNearTop ? Math.min(height - 110, screenY + 16) : Math.max(55, screenY - 8);

              el.style.opacity = '1';
              el.style.pointerEvents = 'auto';
              el.style.transform = isNearTop
                ? `translate3d(calc(${clampedX}px - 50%), ${posY}px, 0)`
                : `translate3d(calc(${clampedX}px - 50%), calc(${posY}px - 100%), 0)`;
              el.setAttribute('data-near-top', isNearTop ? 'true' : 'false');
            }
          }
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isAutoRotating, rotationSpeed, activeBodyId, hoveredBody]);

  // Mouse & Touch interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    orbitVelocityRef.current = { x: 0, y: 0 };
    if (e.button === 2) {
      isRightDraggingRef.current = true;
    } else {
      isDraggingRef.current = true;
    }
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isRightDraggingRef.current) {
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;
      const panSpeed = cameraDistanceRef.current * 0.0018;

      const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        -cameraAngleRef.current.theta
      );
      cameraTargetRef.current.addScaledVector(right, -deltaX * panSpeed);
      cameraTargetRef.current.y += deltaY * panSpeed;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    } else if (isDraggingRef.current) {
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;
      const velX = -deltaX * 0.007;
      const velY = -deltaY * 0.007;
      orbitVelocityRef.current = { x: velX, y: velY };

      cameraAngleRef.current.theta += velX;
      cameraAngleRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraAngleRef.current.phi + velY));
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    } else {
      pendingRaycastPosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isRightDraggingRef.current = false;
    pendingRaycastPosRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    orbitVelocityRef.current = { x: 0, y: 0 };
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDistanceRef.current = Math.hypot(dx, dy);
    } else if (e.touches.length === 1) {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistanceRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      if (touchStartDistanceRef.current > 0) {
        const ratio = dist / touchStartDistanceRef.current;
        const zoomDelta = (1.0 - ratio) * 1.35;
        cameraDistanceRef.current = Math.max(
          0.000005,
          Math.min(150000, cameraDistanceRef.current * Math.exp(zoomDelta))
        );
      }
      touchStartDistanceRef.current = dist;
    } else if (e.touches.length === 1 && isDraggingRef.current) {
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;
      const velX = -deltaX * 0.007;
      const velY = -deltaY * 0.007;
      orbitVelocityRef.current = { x: velX, y: velY };

      cameraAngleRef.current.theta += velX;
      cameraAngleRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraAngleRef.current.phi + velY));
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    touchStartDistanceRef.current = null;
    setHoveredBody(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !cameraRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(interactiveMeshesRef.current, false);

    let candidate: CelestialBody | null = null;
    if (intersects.length > 0) {
      let obj: THREE.Object3D | null = intersects[0].object;
      while (obj && (!obj.userData || !obj.userData.bodyData) && obj.parent) {
        obj = obj.parent;
      }
      candidate = (obj?.userData?.bodyData as CelestialBody) ?? null;
    }

    if (candidate) {
      soundEffects.play('select');
      handleSelect(candidate);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.14 : 0.87;
    cameraDistanceRef.current = Math.max(0.000005, Math.min(150000, cameraDistanceRef.current * zoomFactor));
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const factor = direction === 'in' ? 0.75 : 1.35;
    cameraDistanceRef.current = Math.max(0.000005, Math.min(150000, cameraDistanceRef.current * factor));
    soundEffects.play(direction === 'in' ? 'zoomIn' : 'zoomOut');
  };

  const handleResetCamera = () => {
    soundEffects.play('reset');
    if (activeBodyId) {
      const framing = getCameraFraming(activeBodyId, isTourPlayingRef.current);
      if (framing) {
        cameraTargetRef.current.copy(framing.target);
        cameraDistanceRef.current = framing.distance;
        cameraAngleRef.current = { ...framing.angle };
      }
    } else {
      handleFitAll();
    }
  };

  const handleFitAll = () => {
    soundEffects.play('reset');
    handleSelect(null);
  };

  const handleUnfocus = () => {
    soundEffects.play('unfocus');
    handleSelect(null);
  };

  // Stepping Prev / Next
  const handlePrev = useCallback(() => {
    if (sortedBodies.length === 0) return;
    soundEffects.play('nav');
    const prevIdx = activeIndex <= 0 ? sortedBodies.length - 1 : activeIndex - 1;
    handleSelect(sortedBodies[prevIdx]);
  }, [sortedBodies, activeIndex, handleSelect]);

  const handleNext = useCallback(() => {
    if (sortedBodies.length === 0) return;
    soundEffects.play('nav');
    const nextIdx = activeIndex === -1 || activeIndex >= sortedBodies.length - 1 ? 0 : activeIndex + 1;
    handleSelect(sortedBodies[nextIdx]);
  }, [sortedBodies, activeIndex, handleSelect]);

  const handleFirst = () => {
    if (sortedBodies.length > 0) {
      soundEffects.play('nav');
      handleSelect(sortedBodies[0]);
    }
  };

  const handleLast = () => {
    if (sortedBodies.length > 0) {
      soundEffects.play('nav');
      handleSelect(sortedBodies[sortedBodies.length - 1]);
    }
  };

  // Tour controls
  const handleToggleTour = useCallback(() => {
    if (!isTourModeRef.current) {
      setIsTourMode(true);
      isTourModeRef.current = true;
      setIsTourPlaying(true);
      isTourPlayingRef.current = true;
      soundEffects.play('toggleOn');
      if (activeIndex === -1 || activeIndex >= sortedBodies.length - 1) {
        if (sortedBodies.length > 0) handleSelect(sortedBodies[0]);
      }
    } else {
      const willPlay = !isTourPlayingRef.current;
      setIsTourPlaying(willPlay);
      isTourPlayingRef.current = willPlay;
      soundEffects.play(willPlay ? 'toggleOn' : 'toggleOff');
    }
  }, [activeIndex, sortedBodies, handleSelect]);

  const handleEndTour = useCallback(() => {
    setIsTourMode(false);
    isTourModeRef.current = false;
    setIsTourPlaying(false);
    isTourPlayingRef.current = false;
    soundEffects.play('toggleOff');
  }, []);

  const handleRestartTour = useCallback(() => {
    if (sortedBodies.length === 0) return;
    soundEffects.play('nav');
    handleSelect(sortedBodies[0]);
    setIsTourMode(true);
    isTourModeRef.current = true;
    setIsTourPlaying(true);
    isTourPlayingRef.current = true;
  }, [sortedBodies, handleSelect]);

  // Auto Tour playback effect
  useEffect(() => {
    if (!isTourPlaying || sortedBodies.length === 0) return;
    const curIdx = activeIndex >= 0 ? activeIndex : 0;
    const duration = TOUR_DURATION_MAP[tourLength];

    const timer = setTimeout(() => {
      if (curIdx >= sortedBodies.length - 1) {
        setIsTourPlaying(false);
        isTourPlayingRef.current = false;
      } else {
        handleSelect(sortedBodies[curIdx + 1]);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [isTourPlaying, activeIndex, sortedBodies, tourLength, handleSelect]);

  // Keyboard Shortcuts matching StarCanvas3D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Escape') {
        if (isTourModeRef.current) {
          e.preventDefault();
          handleEndTour();
          return;
        }
      }

      if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        handleUnfocus();
      } else if (e.key === 'ArrowLeft' || e.key === '[') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight' || e.key === ']') {
        e.preventDefault();
        handleNext();
      } else if (e.key === '1' || e.key === 'Home') {
        e.preventDefault();
        handleFirst();
      } else if (e.key === '9' || e.key === 'End') {
        e.preventDefault();
        handleLast();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        handleToggleTour();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setTourLength((prev) => (prev === 'short' ? 'medium' : prev === 'medium' ? 'long' : 'short'));
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoom('in');
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoom('out');
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleResetCamera();
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleFitAll();
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        setLayoutMode((prev) => (prev === 'linear' ? 'spiral' : 'linear'));
        soundEffects.play('toggleOn');
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setIsAutoRotating((prev) => !prev);
      } else if (e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        setWireframe((prev) => !prev);
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        setShowGrid((prev) => !prev);
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setAreControlsHidden((prev) => !prev);
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        setIsSearchActive((prev) => !prev);
      } else if (e.key === '?') {
        e.preventDefault();
        setShowShortcutsHelp((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, handleToggleTour, handleEndTour]);

  const activeFocusedBody = sortedBodies.find((b) => b.id === activeBodyId);
  const displayBody = hoveredBody || activeFocusedBody;

  return (
    <div
      ref={outerWrapperRef}
      className="relative w-full h-full bg-[#02040c] overflow-hidden flex flex-col min-h-0 select-none"
    >
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full flex-1 select-none cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Floating 3D Pill Label above focused/hovered body (matching StarCanvas3D) */}
      {!isTourMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {displayBody && (() => {
            const body = displayBody;
            const isSelected = body.id === activeBodyId;
            const color = inferBodyColor(body);
            return (
              <div
                key={body.id}
                id={`label-body-${body.id}`}
                ref={(el) => {
                  if (el) labelElementsRef.current.set(body.id, el);
                  else labelElementsRef.current.delete(body.id);
                }}
                style={{ opacity: 0, willChange: 'transform, opacity' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(body);
                }}
                onMouseEnter={() => setHoveredBody(body)}
                onMouseLeave={() => setHoveredBody(null)}
                className="absolute top-0 left-0 pointer-events-auto cursor-pointer flex flex-col items-center group transition-opacity duration-150 ease-out"
              >
                <div
                  id={`bubble-label-${body.id}`}
                  className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border text-xs shadow-xl transition-all select-none whitespace-nowrap active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-300 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.6)] ring-2 ring-cyan-400/80'
                      : 'bg-[#040816]/95 hover:bg-[#0c1636] border-cyan-400/80 text-white font-semibold backdrop-blur-xl shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  }`}
                >
                  {/* Color Dot with Ping Animation */}
                  <span
                    className="w-2.5 h-2.5 rounded-full aspect-square shrink-0 relative flex items-center justify-center"
                    style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-90" />}
                  </span>

                  {/* Body Name */}
                  <span className="font-extrabold tracking-tight text-white max-w-[200px] truncate leading-normal">
                    {body.name}
                  </span>

                  {/* Classification Badge */}
                  <span className="text-[10px] bg-slate-950/80 text-cyan-300 font-mono px-1.5 py-0.5 rounded border border-cyan-400/40 shrink-0 font-semibold">
                    {body.classification}
                  </span>

                  {/* Multiplier Metric */}
                  <span className="text-[10px] text-cyan-200/90 font-mono shrink-0 hidden xs:inline">
                    {body.diameterEarth >= 1.0
                      ? `${body.diameterEarth.toFixed(2)} D⊕`
                      : `${Math.round(body.diameterKm).toLocaleString()} km`}
                  </span>

                  {/* Downward pointer caret */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-[6px] border-t-cyan-500 group-data-[near-top=true]:hidden" />
                  {/* Upward pointer caret */}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-b-[6px] border-b-cyan-500 hidden group-data-[near-top=true]:block" />
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Top Floating Control Bar */}
      {!areControlsHidden && !isTourMode && (
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-30">
          {/* Top-Left: Sort & Auto Tour */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pointer-events-auto">
            {/* Sort Toggle & Dropdown */}
            <div className="relative pointer-events-auto" ref={sortMenuRef}>
              <div className="flex items-center bg-[#040816]/90 backdrop-blur-xl rounded-xl border border-cyan-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] text-xs font-mono overflow-hidden">
                <button
                  id="btn-sort-cycle"
                  onClick={() => {
                    const keys: CelestialSortKey[] = ['size', 'mass', 'temperature', 'discoveryYear'];
                    const idx = keys.indexOf(sortKey);
                    setSortKey(keys[(idx + 1) % keys.length]);
                  }}
                  title="Click to cycle sort metric"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-cyan-500/20 active:scale-95 transition-all cursor-pointer select-none"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-400 hidden sm:inline">Sort:</span>
                  <span className="text-cyan-300 font-bold capitalize">
                    {sortKey === 'discoveryYear' ? 'Discovery' : sortKey}
                  </span>
                </button>

                <div className="w-[1px] h-4 bg-cyan-500/20" />

                <button
                  id="btn-sort-direction"
                  onClick={() => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
                  title={`Currently ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all cursor-pointer select-none"
                >
                  <span className="text-[11px] font-semibold text-cyan-400">
                    {sortDirection === 'asc' ? 'Asc ↑' : 'Desc ↓'}
                  </span>
                </button>

                <div className="w-[1px] h-4 bg-cyan-500/20" />

                <button
                  id="btn-sort-menu-trigger"
                  onClick={() => setIsSortMenuOpen((prev) => !prev)}
                  title="Open Sort Menu"
                  className={`px-1.5 py-1.5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer ${
                    isSortMenuOpen ? 'text-cyan-300 bg-cyan-500/20' : ''
                  }`}
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSortMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {isSortMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-[#040817] border border-cyan-500/40 rounded-xl shadow-2xl p-2 z-50 backdrop-blur-xl font-mono text-xs flex flex-col gap-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-cyan-500/20">
                    Sort Metric
                  </div>
                  {[
                    { key: 'size', label: 'Size', desc: 'Diameter (km / D⊕)' },
                    { key: 'mass', label: 'Mass', desc: 'Planetary mass (M⊕ / M♃)' },
                    { key: 'temperature', label: 'Temperature', desc: 'Equilibrium temp (K)' },
                    { key: 'discoveryYear', label: 'Discovery Year', desc: 'Year of discovery' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        setSortKey(item.key as CelestialSortKey);
                        setIsSortMenuOpen(false);
                      }}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all ${
                        sortKey === item.key
                          ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/30'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{item.label}</div>
                        <div className="text-[9px] text-slate-500">{item.desc}</div>
                      </div>
                      {sortKey === item.key && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auto Tour & Pace Controls */}
            <div className="flex items-center gap-1 sm:gap-1.5 pointer-events-auto">
              <button
                id="btn-auto-tour"
                onClick={handleToggleTour}
                title={isTourPlaying ? 'Pause Auto Tour (T)' : 'Play Auto Tour (T)'}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl backdrop-blur-xl border text-xs font-mono font-semibold transition-all cursor-pointer shadow-lg active:scale-95 ${
                  isTourPlaying
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                    : 'bg-[#040816]/90 border-cyan-500/30 text-slate-300 hover:text-white hover:bg-cyan-500/20'
                }`}
              >
                {isTourPlaying ? (
                  <Pause className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                )}
                <span>{isTourPlaying ? 'Playing' : 'Auto Tour'}</span>
              </button>

              <div className="relative pointer-events-auto" ref={tourPaceMenuRef}>
                <button
                  id="btn-tour-pace"
                  onClick={() => setIsTourPaceMenuOpen((prev) => !prev)}
                  title="Tour Pace (P)"
                  className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl backdrop-blur-xl border border-cyan-500/30 bg-[#040816]/90 text-slate-300 hover:text-white text-xs font-mono active:scale-95 cursor-pointer shadow-lg"
                >
                  <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-400 hidden sm:inline">Pace:</span>
                  <span className="text-cyan-300 font-bold capitalize">{tourLength}</span>
                  <ChevronDown className="w-3 h-3 text-cyan-400 shrink-0" />
                </button>

                {isTourPaceMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-36 bg-[#040817] border border-cyan-500/40 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-xl font-mono text-xs flex flex-col gap-1">
                    {(['short', 'medium', 'long'] as const).map((len) => (
                      <button
                        key={len}
                        onClick={() => {
                          setTourLength(len);
                          setIsTourPaceMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left capitalize ${
                          tourLength === len
                            ? 'text-cyan-300 font-bold bg-cyan-950/80'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>{len}</span>
                        {tourLength === len && <Check className="w-3 h-3 text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top-Right: Zoom, Unfocus/Reset, Fit All, More..., Shortcuts, Minimize */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-[#040816]/90 backdrop-blur-xl p-1 sm:p-1.5 rounded-xl border border-cyan-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] pointer-events-auto">
            {isTopPanelMinimized ? (
              <button
                id="btn-top-maximize"
                onClick={() => setIsTopPanelMinimized(false)}
                title="Stage Controls"
                className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Stage Controls</span>
              </button>
            ) : (
              <>
                {/* Zoom In & Out */}
                <button
                  id="btn-zoom-in"
                  onClick={() => handleZoom('in')}
                  title="Zoom In (+)"
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/20 font-bold text-sm transition-colors cursor-pointer active:scale-95"
                >
                  +
                </button>
                <button
                  id="btn-zoom-out"
                  onClick={() => handleZoom('out')}
                  title="Zoom Out (−)"
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/20 font-bold text-sm transition-colors cursor-pointer active:scale-95"
                >
                  −
                </button>

                {/* Focus / Unfocus / Reset */}
                {activeFocusedBody ? (
                  <button
                    id="btn-unfocus"
                    onClick={handleUnfocus}
                    title="Unfocus Object (U)"
                    className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <X className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">Unfocus</span>
                  </button>
                ) : (
                  <button
                    id="btn-reset-cam"
                    onClick={handleResetCamera}
                    title="Reset Camera (R)"
                    className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                )}

                {/* Fit All */}
                <button
                  id="btn-fit-all"
                  onClick={handleFitAll}
                  title="Fit All Objects (A)"
                  className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-medium transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <Telescope className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                  <span className="hidden sm:inline">Fit All</span>
                </button>

                {/* Spiral / Linear Layout Mode Toggle (matching StarCanvas3D) */}
                <div className="relative pointer-events-auto" ref={layoutMenuRef}>
                  <div
                    className={`flex items-center rounded-lg border text-xs font-mono font-semibold transition-all shadow-sm ${
                      layoutMode === 'spiral'
                        ? 'bg-purple-950/80 border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                        : 'bg-emerald-950/80 border-emerald-400/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                    }`}
                  >
                    <button
                      id="btn-toggle-layout"
                      onClick={() => {
                        setLayoutMode((m) => (m === 'linear' ? 'spiral' : 'linear'));
                        soundEffects.play('toggleOn');
                      }}
                      title={`Stage Layout: ${layoutMode === 'spiral' ? 'Spiral Mode (L)' : 'Linear Mode (L)'}. Click to toggle.`}
                      className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 hover:bg-white/10 active:scale-95 transition-all cursor-pointer rounded-l-lg select-none"
                    >
                      {layoutMode === 'spiral' ? (
                        <Orbit className="w-3.5 h-3.5 shrink-0 text-purple-400 animate-spin-slow" />
                      ) : (
                        <MoveHorizontal className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      )}
                      <span className="hidden sm:inline">
                        {layoutMode === 'spiral' ? 'Spiral' : 'Linear'}
                      </span>
                    </button>

                    <div className="w-[1px] h-4 bg-white/20" />

                    <button
                      id="btn-layout-menu-trigger"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLayoutMenuOpen((prev) => !prev);
                      }}
                      title="Select Layout Mode (Spiral / Linear)"
                      className="px-1.5 py-1.5 hover:bg-white/10 active:scale-95 transition-all cursor-pointer rounded-r-lg"
                    >
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          isLayoutMenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {isLayoutMenuOpen && (
                    <div
                      id="menu-layout-mode-dropdown"
                      className="absolute right-0 top-full mt-2 w-44 bg-[#040817]/98 border border-cyan-500/40 rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.95),0_0_20px_rgba(6,182,212,0.25)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl font-mono text-xs flex flex-col gap-1"
                    >
                      <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-cyan-500/20 pb-1 mb-1">
                        Catalog Layout
                      </div>
                      {(['spiral', 'linear'] as const).map((mode) => {
                        const isActive = layoutMode === mode;
                        return (
                          <button
                            key={mode}
                            id={`btn-layout-option-${mode}`}
                            onClick={() => {
                              setLayoutMode(mode);
                              setIsLayoutMenuOpen(false);
                              soundEffects.play('toggleOn');
                            }}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                              isActive
                                ? mode === 'spiral'
                                  ? 'bg-purple-950/80 text-purple-300 font-bold border border-purple-500/30'
                                  : 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/30'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {mode === 'spiral' ? (
                                <Orbit
                                  className={`w-3.5 h-3.5 ${
                                    isActive ? 'text-purple-400' : 'text-slate-400'
                                  }`}
                                />
                              ) : (
                                <MoveHorizontal
                                  className={`w-3.5 h-3.5 ${
                                    isActive ? 'text-emerald-400' : 'text-slate-400'
                                  }`}
                                />
                              )}
                              <span>{mode === 'spiral' ? 'Spiral Mode' : 'Linear Mode'}</span>
                            </span>
                            {isActive && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="h-4 w-[1px] bg-cyan-500/20 mx-0.5" />

                {/* More... Menu for Spin, Wireframe, Floor Grid */}
                <div className="relative" ref={togglesMenuRef}>
                  <button
                    id="btn-more-menu"
                    onClick={() => setIsTogglesMenuOpen((prev) => !prev)}
                    title="More Scene Options"
                    className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer select-none active:scale-95 ${
                      isAutoRotating || wireframe || showGrid
                        ? 'bg-cyan-950/80 border-cyan-400/50 text-cyan-300 shadow-sm'
                        : 'border-cyan-500/20 text-slate-300 hover:text-white hover:bg-cyan-500/20'
                    }`}
                  >
                    <span>More...</span>
                    <ChevronDown
                      className={`w-3 h-3 text-cyan-400 transition-transform ${isTogglesMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isTogglesMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#040817]/98 border border-cyan-500/40 rounded-xl shadow-2xl p-2 z-50 backdrop-blur-xl font-mono text-xs flex flex-col gap-1">
                      <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-cyan-500/20">
                        Scene Toggles
                      </div>

                      <button
                        onClick={() => setIsAutoRotating((prev) => !prev)}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all ${
                          isAutoRotating ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'text-cyan-400 animate-spin-slow' : 'text-slate-400'}`} />
                          <span>Spin Worlds</span>
                        </span>
                        {isAutoRotating && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>

                      <button
                        onClick={() => setWireframe((prev) => !prev)}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all ${
                          wireframe ? 'bg-amber-950/80 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Layers className={`w-3.5 h-3.5 ${wireframe ? 'text-amber-400' : 'text-slate-400'}`} />
                          <span>Wireframe</span>
                        </span>
                        {wireframe && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>

                      <button
                        onClick={() => setShowGrid((prev) => !prev)}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all ${
                          showGrid ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Grid className={`w-3.5 h-3.5 ${showGrid ? 'text-cyan-400' : 'text-slate-400'}`} />
                          <span>Floor Grid</span>
                        </span>
                        {showGrid && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>

                      <div className="border-t border-cyan-500/20 my-1" />

                      <button
                        onClick={() => {
                          setLayoutMode((m) => (m === 'linear' ? 'spiral' : 'linear'));
                          setIsTogglesMenuOpen(false);
                          soundEffects.play('toggleOn');
                        }}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-slate-300 hover:bg-white/5 cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          {layoutMode === 'spiral' ? (
                            <Orbit className="w-3.5 h-3.5 text-purple-400" />
                          ) : (
                            <MoveHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          <span>Layout: {layoutMode === 'spiral' ? 'Spiral' : 'Linear'}</span>
                        </span>
                        <span className="text-[10px] text-cyan-400 font-bold uppercase">Toggle (L)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Keyboard Shortcuts */}
                <button
                  id="btn-shortcuts"
                  onClick={() => setShowShortcutsHelp(true)}
                  title="Keyboard Shortcuts (?)"
                  className="hidden lg:flex px-2 py-1 rounded-lg text-xs font-mono text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-colors cursor-pointer items-center gap-1.5"
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>Shortcuts</span>
                </button>

                {/* Fullscreen Toggle Button */}
                <button
                  id="btn-fullscreen-top"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
                  className="px-2 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  )}
                  <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Full'}</span>
                </button>

                {/* Minimize Button */}
                <button
                  id="btn-minimize-panel"
                  onClick={() => setIsTopPanelMinimized(true)}
                  title="Minimize Panel"
                  className="px-2 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="hidden sm:inline">Minimize</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom Floating Control Caliper & Interactive Filmstrip */}
      {!isTourMode && (
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex flex-col gap-2 sm:gap-3 pointer-events-none z-20">
          {/* Focused Body Info Strip (matching StarCanvas3D #stage-focused-star-strip, minus Dossier) */}
          {activeFocusedBody && (
            <div
              id="stage-focused-star-strip"
              className="flex items-center justify-between gap-2 sm:gap-3 bg-[#040816]/95 backdrop-blur-2xl px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-cyan-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all pointer-events-auto w-full"
            >
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 overflow-hidden">
                <span
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full aspect-square shrink-0 shadow-md ring-1 ring-white/30"
                  style={{
                    backgroundColor: inferBodyColor(activeFocusedBody),
                    boxShadow: `0 0 10px ${inferBodyColor(activeFocusedBody)}`,
                  }}
                />

                <div className="flex items-center gap-x-1.5 sm:gap-x-2 text-xs font-mono min-w-0 flex-1 overflow-hidden">
                  <span className="font-bold text-white flex items-center gap-1.5 min-w-0 shrink truncate">
                    <span className="text-cyan-300 font-bold truncate">{activeFocusedBody.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 font-mono border border-cyan-500/30 shrink-0">
                      {activeFocusedBody.classification}
                    </span>
                  </span>

                  <span className="text-slate-300 shrink-0">
                    {activeFocusedBody.diameterEarth >= 1.0
                      ? `${activeFocusedBody.diameterEarth.toFixed(2)} D⊕`
                      : `${activeFocusedBody.diameterEarth.toFixed(3)} D⊕`}
                  </span>

                  <span className="hidden sm:inline text-slate-400 shrink-0">
                    ({Math.round(activeFocusedBody.diameterKm).toLocaleString()} km)
                  </span>

                  {activeFocusedBody.temperatureK && activeFocusedBody.temperatureK > 0 && (
                    <>
                      <span className="hidden md:inline text-slate-500 shrink-0">•</span>
                      <span className="hidden md:inline text-slate-300 shrink-0">
                        {activeFocusedBody.temperatureK} K
                      </span>
                    </>
                  )}

                  <span className="hidden lg:inline text-slate-500 shrink-0">•</span>
                  <span className="hidden lg:inline text-slate-400 shrink-0 truncate">
                    {activeFocusedBody.hostSystem}
                  </span>
                </div>
              </div>

              {/* Unfocus button (No Dossier) */}
              <button
                id="btn-preview-unfocus"
                onClick={handleUnfocus}
                className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95 shrink-0"
                title="Unfocus Object (U)"
              >
                <X className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline">Unfocus</span>
              </button>
            </div>
          )}

          {/* Filmstrip & Navigator */}
          <div className="flex flex-col gap-2 pointer-events-auto">
            {/* Horizontal Search Strip */}
            {!areControlsHidden && isSearchActive && (
              <div className="flex items-center gap-2 max-w-full overflow-x-auto pb-1.5 scrollbar-thin animate-in fade-in duration-200">
                {filteredBodies.length > 0 ? (
                  filteredBodies.map((body) => {
                    const originalIdx = sortedBodies.findIndex((b) => b.id === body.id);
                    const isSelected = body.id === activeBodyId;
                    const color = inferBodyColor(body);
                    return (
                      <button
                        key={body.id}
                        onClick={() => handleSelect(body)}
                        className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-xl border text-left transition-all shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-950/95 to-blue-950/95 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400 scale-105 font-bold'
                            : 'bg-[#040816]/85 border-cyan-500/20 text-slate-300 hover:border-cyan-500/40 hover:bg-[#0c142e]'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full aspect-square shrink-0"
                          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                        />
                        <div>
                          <div className="text-xs font-semibold leading-tight group-hover:text-cyan-300 whitespace-nowrap flex items-center gap-1.5">
                            <span className="text-[10px] text-cyan-400/80 font-mono">#{originalIdx + 1}</span>
                            <span>{body.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                            {body.diameterEarth >= 1.0
                              ? `${body.diameterEarth.toFixed(2)} D⊕`
                              : `${Math.round(body.diameterKm).toLocaleString()} km`}
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#040816]/95 border border-cyan-500/40 text-xs font-mono text-slate-300">
                    <Search className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>No worlds matching &quot;{searchQuery}&quot;</span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-cyan-400 hover:text-white underline font-semibold ml-1 cursor-pointer"
                    >
                      Show all ({sortedBodies.length})
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Bar: Navigator + Search + Shortcuts + Hide */}
            <div className={`flex items-center ${areControlsHidden ? 'justify-end' : 'justify-between'} gap-2 w-full`}>
              {areControlsHidden ? (
                <button
                  id="btn-show-controls"
                  onClick={() => setAreControlsHidden(false)}
                  title="Show Controls (H)"
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-mono font-semibold backdrop-blur-xl transition-all cursor-pointer shadow-lg active:scale-95 flex items-center gap-1.5 bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] ml-auto"
                >
                  <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="hidden sm:inline">Show controls</span>
                </button>
              ) : (
                <>
                  {/* Integrated Navigator */}
                  <div className="flex items-center gap-0.5 sm:gap-1 bg-[#040816]/95 backdrop-blur-xl p-0.5 sm:p-1 rounded-xl border border-cyan-500/35 shadow-[0_4px_20px_rgba(0,0,0,0.6)] shrink-0 font-mono">
                    <button
                      id="btn-nav-first"
                      onClick={handleFirst}
                      title={`First Object (#1: ${sortedBodies[0]?.name || 'First'})`}
                      className="px-2 sm:px-2.5 py-1 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-colors cursor-pointer text-xs font-semibold shrink-0"
                    >
                      <span className="sm:hidden">#1</span>
                      <span className="hidden sm:inline">First (#1)</span>
                    </button>

                    <button
                      id="btn-nav-prev"
                      onClick={handlePrev}
                      title="Previous Object (←)"
                      className="p-1 sm:px-2 sm:py-1 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/20 active:scale-95 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden md:inline text-[11px]">Prev</span>
                    </button>

                    <span className="text-[10px] sm:text-xs font-mono px-1 sm:px-2 text-cyan-300 font-bold border-x border-cyan-500/30 shrink-0">
                      {activeIndex >= 0 ? `${activeIndex + 1} / ${sortedBodies.length}` : 'All'}
                    </span>

                    <button
                      id="btn-nav-next"
                      onClick={handleNext}
                      title="Next Object (→)"
                      className="p-1 sm:px-2 sm:py-1 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/20 active:scale-95 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span className="hidden md:inline text-[11px]">Next</span>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    </button>

                    <button
                      id="btn-nav-last"
                      onClick={handleLast}
                      title={`Last Object (#${sortedBodies.length}: ${sortedBodies[sortedBodies.length - 1]?.name || 'Last'})`}
                      className="px-2 sm:px-2.5 py-1 rounded-lg text-slate-300 hover:text-amber-300 hover:bg-cyan-500/20 active:scale-95 transition-colors cursor-pointer text-xs font-semibold shrink-0"
                    >
                      <span className="sm:hidden">#{sortedBodies.length}</span>
                      <span className="hidden sm:inline">Last (#{sortedBodies.length})</span>
                    </button>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {!isSearchActive ? (
                      <button
                        id="btn-open-search"
                        onClick={() => setIsSearchActive(true)}
                        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold backdrop-blur-xl transition-all cursor-pointer shadow-lg active:scale-95 bg-[#040816]/90 hover:bg-[#091330] border-cyan-500/30 text-slate-200 hover:text-white hover:border-cyan-400 shrink-0"
                        title="Search Objects (B)"
                      >
                        <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="hidden sm:inline">Search ({sortedBodies.length})</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-cyan-400 bg-cyan-950/95 text-xs font-mono backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.35)] w-48 sm:w-64 shrink-0">
                        <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={`Search ${sortedBodies.length} worlds...`}
                          className="bg-transparent text-white text-xs font-mono placeholder:text-slate-400 focus:outline-none w-full min-w-0"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            setIsSearchActive(false);
                            setSearchQuery('');
                          }}
                          className="p-0.5 text-slate-400 hover:text-white shrink-0 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <button
                      id="btn-shortcuts-bottom"
                      onClick={() => setShowShortcutsHelp(true)}
                      className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#040816]/90 hover:bg-cyan-950/50 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:text-white backdrop-blur-xl transition-all cursor-pointer shadow-md"
                    >
                      <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Shortcuts</span>
                    </button>

                    <button
                      id="btn-hide-controls"
                      onClick={() => setAreControlsHidden(true)}
                      title="Hide Controls (H)"
                      className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-mono font-semibold backdrop-blur-xl transition-all cursor-pointer shadow-lg active:scale-95 flex items-center gap-1.5 bg-[#040816]/90 hover:bg-[#091330] border-cyan-500/30 text-slate-300 hover:text-white shrink-0"
                    >
                      <EyeOff className="w-3.5 h-3.5 text-slate-400 hover:text-cyan-300 shrink-0" />
                      <span className="hidden md:inline text-[11px]">Hide controls</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cinematic 3D Tour Mode Overlay (matching StarCanvas3D Screenshot 2) */}
      {isTourMode && (
        <>
          {/* Top-Left Hover Zone */}
          <div className="absolute top-0 left-0 pt-3 pl-3 sm:pt-4 sm:pl-4 pb-16 pr-20 z-40 group pointer-events-auto select-none">
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0">
              <button
                id="btn-tour-end"
                onClick={handleEndTour}
                title="End Tour (Esc)"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#040816]/95 hover:bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:text-white shadow-[0_4px_24px_rgba(0,0,0,0.85)] backdrop-blur-xl text-xs font-mono font-bold transition-all cursor-pointer active:scale-95"
              >
                <Square className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                <span>End Tour</span>
              </button>

              <button
                id="btn-tour-restart"
                onClick={handleRestartTour}
                title="Restart Tour from First World"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#040816]/95 hover:bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:text-white shadow-[0_4px_24px_rgba(0,0,0,0.85)] backdrop-blur-xl text-xs font-mono font-bold transition-all cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Restart</span>
              </button>

              <button
                id="btn-tour-play-pause"
                onClick={() => {
                  if (activeIndex >= sortedBodies.length - 1 && !isTourPlaying) {
                    handleRestartTour();
                    return;
                  }
                  setIsTourPlaying((prev) => !prev);
                  isTourPlayingRef.current = !isTourPlaying;
                  soundEffects.play(!isTourPlaying ? 'toggleOn' : 'toggleOff');
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#040816]/95 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white shadow-[0_4px_24px_rgba(0,0,0,0.85)] backdrop-blur-xl text-xs font-mono transition-all cursor-pointer active:scale-95"
              >
                {isTourPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-300 font-semibold">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-cyan-300 font-semibold">Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Lower Third Cinematic Vitals Display */}
          {activeFocusedBody && (() => {
            const metric = getTourMetricDisplay(activeFocusedBody, sortKey);
            const currentNum = activeIndex >= 0 ? activeIndex + 1 : 1;
            const total = sortedBodies.length;
            const progressPercent = total > 0 ? (currentNum / total) * 100 : 0;
            const color = inferBodyColor(activeFocusedBody);

            return (
              <div className="absolute inset-x-0 bottom-0 pointer-events-none z-30 flex flex-col justify-end">
                <div
                  className="w-full bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-20 pb-6 px-4 sm:px-8 md:px-12 flex flex-col gap-2.5 sm:gap-3"
                  style={{ textShadow: '0 2px 20px rgba(0,0,0,0.9)' }}
                >
                  {/* Top metadata row */}
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 font-bold uppercase tracking-wider text-[11px] sm:text-xs shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                      #{currentNum} of {total} • {metric.label}
                    </span>

                    {isTourPlaying ? (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-[10px] sm:text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        Auto Tour Playing
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 text-[10px] sm:text-[11px]">
                        Tour Paused
                      </span>
                    )}

                    <span className="text-slate-400 text-xs hidden sm:inline">
                      Host: {activeFocusedBody.hostSystem}
                    </span>
                  </div>

                  {/* Giant Name & Comparison Metrics */}
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-8">
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 sm:gap-3.5">
                        <span
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full aspect-square shrink-0 ring-2 ring-white/50 shadow-[0_0_20px_currentColor]"
                          style={{ backgroundColor: color, color }}
                        />
                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-display text-white tracking-tight leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] truncate">
                          {activeFocusedBody.name}
                        </h1>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-300 font-sans mt-2">
                        <span className="font-semibold text-cyan-200">
                          {activeFocusedBody.classification}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-300">
                          Host System: {activeFocusedBody.hostSystem}
                        </span>
                        {activeFocusedBody.discoveryYear && activeFocusedBody.discoveryYear > 0 && (
                          <>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-400">
                              Discovered: {activeFocusedBody.discoveryYear}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right-hand Giant Comparison Metric */}
                    <div className="flex flex-col lg:items-end shrink-0">
                      <div className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                        {metric.label}
                      </div>
                      <div className="text-3xl sm:text-5xl md:text-6xl font-mono font-black text-cyan-300 tracking-tight leading-none drop-shadow-[0_0_30px_rgba(6,182,212,0.6)]">
                        {metric.primary}
                      </div>
                      <div className="text-[11px] sm:text-xs font-mono text-slate-400 mt-1">
                        {metric.secondary}
                      </div>
                    </div>
                  </div>

                  {/* Secondary Vitals Ribbon */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-[11px] sm:text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-black/60 border border-slate-800 text-slate-300">
                      <span className="text-slate-500 mr-1">Diameter:</span>
                      <span className="text-white font-semibold">
                        {Math.round(activeFocusedBody.diameterKm).toLocaleString()} km
                      </span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/60 border border-slate-800 text-slate-300">
                      <span className="text-slate-500 mr-1">Earth Scale:</span>
                      <span className="text-white font-semibold">
                        {activeFocusedBody.diameterEarth.toFixed(activeFocusedBody.diameterEarth < 0.1 ? 3 : 2)} D⊕
                      </span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/60 border border-slate-800 text-slate-300">
                      <span className="text-slate-500 mr-1">Jupiter Scale:</span>
                      <span className="text-white font-semibold">
                        {activeFocusedBody.diameterJupiter.toFixed(activeFocusedBody.diameterJupiter < 0.05 ? 4 : 2)} D♃
                      </span>
                    </span>
                    {activeFocusedBody.massEarth !== undefined && activeFocusedBody.massEarth > 0 && (
                      <span className="px-2 py-0.5 rounded bg-black/60 border border-slate-800 text-slate-300">
                        <span className="text-slate-500 mr-1">Mass:</span>
                        <span className="text-white font-semibold">
                          {activeFocusedBody.massEarth >= 50
                            ? `${(activeFocusedBody.massEarth / 317.828).toFixed(2)} M♃`
                            : `${activeFocusedBody.massEarth.toFixed(2)} M⊕`}
                        </span>
                      </span>
                    )}
                    {activeFocusedBody.temperatureK !== undefined && activeFocusedBody.temperatureK > 0 && (
                      <span className="px-2 py-0.5 rounded bg-black/60 border border-slate-800 text-slate-300">
                        <span className="text-slate-500 mr-1">Temp:</span>
                        <span className="text-white font-semibold">{activeFocusedBody.temperatureK} K</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Slim Tour Progress Bar */}
                <div className="w-full h-1 bg-black/80 relative overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            );
          })()}
        </>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showShortcutsHelp && (
        <div
          className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowShortcutsHelp(false)}
        >
          <div
            className="bg-[#040816] border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-slate-100 flex flex-col gap-4 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">3D Stage Shortcuts</h3>
                  <p className="text-xs text-slate-400 font-mono">Controls for navigating exoplanets & Solar System worlds</p>
                </div>
              </div>
              <button
                onClick={() => setShowShortcutsHelp(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono max-h-[60vh] overflow-y-auto pr-1">
              <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-cyan-500/15">
                <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold mb-1">Navigation</div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Step Prev / Next</span>
                  <span className="text-cyan-300 font-bold">← / → or [ / ]</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">First / Last World</span>
                  <span className="text-cyan-300 font-bold">1 / 9</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 font-semibold">Unfocus Object</span>
                  <span className="text-amber-300 font-bold">U</span>
                </div>
              </div>

              <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-cyan-500/15">
                <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold mb-1">Camera & Stage</div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Zoom In / Out</span>
                  <span className="text-cyan-300 font-bold">+ / −</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Reset View</span>
                  <span className="text-cyan-300 font-bold">R</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Fit All</span>
                  <span className="text-cyan-300 font-bold">A</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Toggle Fullscreen</span>
                  <span className="text-cyan-300 font-bold">F</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Spiral / Linear Layout</span>
                  <span className="text-cyan-300 font-bold">L</span>
                </div>
              </div>

              <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-cyan-500/15">
                <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold mb-1">Tour & Scene</div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Toggle Tour</span>
                  <span className="text-cyan-300 font-bold">T</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Tour Pace</span>
                  <span className="text-cyan-300 font-bold">P</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Axial Spin</span>
                  <span className="text-cyan-300 font-bold">S</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 font-bold">Wireframe</span>
                  <span className="text-amber-300 font-bold">W</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Floor Grid</span>
                  <span className="text-cyan-300 font-bold">G</span>
                </div>
              </div>

              <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-cyan-500/15">
                <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold mb-1">Search & Controls</div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Search Worlds</span>
                  <span className="text-cyan-300 font-bold">B</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Hide Controls</span>
                  <span className="text-cyan-300 font-bold">H</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-cyan-500/20">
              <button
                onClick={() => setShowShortcutsHelp(false)}
                className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
