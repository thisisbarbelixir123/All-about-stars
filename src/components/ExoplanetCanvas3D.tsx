import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { CelestialBody, TourLength } from '../types';
import { MASTER_CELESTIAL_BY_ID } from '../data/masterCelestialCatalog';
import { createContinuousGridMesh, ContinuousGridHandle } from '../utils/continuousGrid';
import { soundEffects } from '../utils/soundEffects';
import {
  PLANET_VERTEX_SHADER,
  PLANET_FRAGMENT_SHADER,
  getThemeIndex,
  getPlanetBucketUniforms,
  hashStringToFloat,
} from '../utils/planetShaderUtils';
import { deriveSudarskyClass, SUDARSKY_CLASS_INFO } from '../utils/exoplanetArchetypes';
import { STAR_VERTEX_SHADER, STAR_FRAGMENT_SHADER } from '../utils/starShaderUtils';
import { getBodyGeometryConfig, createIrregularBodyGeometry } from '../utils/celestialGeometry';
import { LoadingSprite } from './LoadingSprite';
import { ExoplanetShortcutsModal } from './ExoplanetShortcutsModal';
import { ExoplanetStageHud } from './ExoplanetStageHud';
import { useObsStudio } from '../hooks/useObsStudio';
import {
  CelestialSortKey,
  SortDirection,
  inferBodyColor,
} from '../utils/exoplanetFormatters';

export type { CelestialSortKey, SortDirection };

const TOUR_DURATION_MAP: Record<TourLength, number> = {
  short: 1200,
  medium: 2400,
  long: 4500,
};

// 1 Three.js unit = 1 Solar Radius (696,350 km)
// Exactly aligns with continuousGrid.ts (KM_PER_UNIT = 696350.0)
const KM_TO_SOLAR_RADIUS = 1.0 / 1392700.0;

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

  const [activeBodyId, setActiveBodyId] = useState<string | null>(
    () => selectedId ?? items.find((b) => b.id === 'sol-earth')?.id ?? items[0]?.id ?? null
  );

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
  const [layoutMode, setLayoutMode] = useState<'linear' | 'spiral'>('linear');
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
  const cameraLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const lodFrameRef = useRef(0);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState<{ loaded: number; total: number } | null>(null);
  const bodyObjectsRef = useRef<Map<string, THREE.Group>>(new Map());
  const labelElementsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const animFrameIdRef = useRef<number | null>(null);
  const continuousGridRef = useRef<ContinuousGridHandle | null>(null);
  const sharedTimeUniformRef = useRef<{ value: number }>({ value: 0 });
  const materialCacheRef = useRef<Map<string, THREE.Material>>(new Map());
  const textureCacheRef = useRef<Map<string, THREE.Texture>>(new Map());
  const interactiveMeshesRef = useRef<THREE.Object3D[]>([]);
  const pendingRaycastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Smooth camera tracking
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const cameraDistanceRef = useRef(40);
  const cameraAngleRef = useRef({ theta: 0, phi: Math.PI / 3 });
  const isInitialMountRef = useRef(true);
  const hasSnappedCameraRef = useRef(false);
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

  // Filtered search results (supports names, classifications, host systems, and Sudarsky Class I-V)
  const filteredBodies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sortedBodies;
    const exactClassMatch = q.match(/^(?:sudarsky\s+)?(class\s+(?:i|ii|iii|iv|v))$/i);
    return sortedBodies.filter((b) => {
      const sudarsky = deriveSudarskyClass(b);
      if (exactClassMatch) {
        return sudarsky?.toLowerCase() === exactClassMatch[1].replace(/\s+/g, ' ').toLowerCase();
      }
      const sudarskyMeta = sudarsky ? SUDARSKY_CLASS_INFO[sudarsky] : undefined;
      return (
        b.name.toLowerCase().includes(q) ||
        b.classification.toLowerCase().includes(q) ||
        b.hostSystem.toLowerCase().includes(q) ||
        (sudarskyMeta
          ? sudarskyMeta.fullLabel.toLowerCase().includes(q) ||
            sudarskyMeta.cloudDeck.toLowerCase().includes(q)
          : false)
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
      const sc = bodyScalesRef.current[bodyId] ?? bodyScales[bodyId];
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
    [bodyScales]
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

    // Set initial camera framing for the active world or linear stage layout
    const targetBodyId = activeBodyId || 'sol-earth';
    const initialFraming = getCameraFraming(targetBodyId, false);

    if (initialFraming) {
      cameraTargetRef.current.copy(initialFraming.target);
      cameraDistanceRef.current = initialFraming.distance;
      cameraAngleRef.current = { ...initialFraming.angle };
      const { theta, phi } = initialFraming.angle;
      const dist = initialFraming.distance;
      const target = initialFraming.target;
      const initX = target.x + dist * Math.sin(phi) * Math.sin(theta);
      const initY = target.y + dist * Math.cos(phi);
      const initZ = target.z + dist * Math.sin(phi) * Math.cos(theta);
      camera.position.set(initX, initY, initZ);
      camera.lookAt(target);
      currentCameraPosRef.current.set(initX, initY, initZ);
      currentLookAtRef.current.copy(target);
      hasSnappedCameraRef.current = true;
    } else {
      camera.position.set(0.49, 0.0091, 0.035);
      camera.lookAt(0.49, 0.0091, 0);
      currentCameraPosRef.current.set(0.49, 0.0091, 0.035);
      currentLookAtRef.current.set(0.49, 0.0091, 0);
      cameraTargetRef.current.set(0.49, 0.0091, 0);
      cameraDistanceRef.current = 0.035;
      hasSnappedCameraRef.current = true;
    }
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true,
        powerPreference: 'high-performance',
      });
    } catch {
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: false,
          alpha: true,
        });
      } catch {
        setWebglError('WebGL hardware acceleration is unavailable in this browser window.');
        return;
      }
    }
    setWebglError(null);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
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

    // Ambient Lighting (balanced fill for space without washing out deep textures)
    scene.add(new THREE.AmbientLight('#ffffff', 0.55));

    // Directional Sunlight (focused key light providing rich relief and shadows)
    const sunLight = new THREE.DirectionalLight('#ffffff', 1.0);
    sunLight.position.set(1.0, 0.4, 0.8).normalize().multiplyScalar(100);
    scene.add(sunLight);

    // Camera-tracking headlight / fill light: completely eliminates pitch-black blind spots on the 3D stage
    const cameraLight = new THREE.DirectionalLight('#ffffff', 0.65);
    scene.add(cameraLight);
    cameraLightRef.current = cameraLight;

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
      if ('wireframe' in mat) {
        (mat as THREE.MeshStandardMaterial | THREE.ShaderMaterial).wireframe = wireframe;
        mat.needsUpdate = true;
      }
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
    const sharedLowGeo = new THREE.SphereGeometry(1, 20, 20);
    const sharedHitGeo = new THREE.SphereGeometry(1, 12, 12);
    const sharedHitMat = new THREE.MeshBasicMaterial({ visible: false });
    const customGeometryCache = new Map<string, THREE.BufferGeometry>();

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    const getMaterial = (body: CelestialBody): THREE.Material => {
      // 1. Official Photorealistic Texture Maps (Solar System bodies)
      if (body.textureSource === 'official' && body.texturePath) {
        const matKey = `official-${body.id}-${wireframe ? 'w' : 's'}`;
        let mat = materialCacheRef.current.get(matKey);
        if (!mat) {
          let texture = textureCacheRef.current.get(body.texturePath);
          if (!texture) {
            texture = textureLoader.load(body.texturePath, (loadedTex) => {
              rendererRef.current?.initTexture(loadedTex);
            });
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            textureCacheRef.current.set(body.texturePath, texture);
          }

          let roughnessMap: THREE.Texture | undefined;
          let roughness = body.classification === 'Jovian' || body.classification === 'Neptunian' ? 0.9 : 0.8;
          let metalness = 0.05;

          // Earth specular water reflection
          if (body.id === 'sol-earth') {
            const specPath = '/textures/planets/earth-specular.jpg';
            roughnessMap = textureCacheRef.current.get(specPath);
            if (!roughnessMap) {
              roughnessMap = textureLoader.load(specPath, (loadedSpec) => {
                rendererRef.current?.initTexture(loadedSpec);
              });
              roughnessMap.wrapS = THREE.RepeatWrapping;
              roughnessMap.wrapT = THREE.ClampToEdgeWrapping;
              textureCacheRef.current.set(specPath, roughnessMap);
            }
            roughness = 0.85;
            metalness = 0.15;
          }

          // For official textures (Earth, Moon, Callisto, Ganymede, etc.),
          // material.color MUST be pure neutral white (#ffffff).
          // Otherwise, Three.js multiplies the photo texture pixels by baseColor (which tinted Earth, Callisto, Ganymede blue).
          mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xffffff),
            map: texture,
            roughnessMap,
            wireframe,
            roughness,
            metalness,
          });
          materialCacheRef.current.set(matKey, mat);
        }
        return mat;
      }

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
      const tempK = body.temperatureK || 300;
      const bodyAlbedo = body.albedo ?? 0.30;
      const sudarskyClass = deriveSudarskyClass(body);
      const densityGcm3 =
        body.massEarth && body.massEarth > 0 && body.diameterEarth > 0
          ? 5.514 * (body.massEarth / Math.pow(body.diameterEarth, 3))
          : undefined;

      // Quantized astrophysical material bucket (~160 shared ShaderMaterials instead of 2,126) prevents
      // thousands of per-frame WebGL material switches and first-zoom initMaterial stalls while preserving
      // exact Sudarsky classes, Neptunian composition/albedo regimes, and showcase planet appearances.
      const bucket = body.id === 'sol-earth' ? 0 : Math.floor(hashStringToFloat(body.id, 97) * 16.0) % 16;
      const isShowcaseBody =
        body.id === 'sol-makemake' ||
        body.id === 'sol-sedna' ||
        body.id === 'sol-gonggong' ||
        body.id === 'sol-haumea' ||
        body.id === 'sol-eris' ||
        body.id === 'exo-gliese-436-b' ||
        body.id === 'exo-kepler-22-b' ||
        body.id === 'exo-gj-1214-b' ||
        body.id === 'exo-ltt-9779-b' ||
        body.id === 'exo-tres-2-b' ||
        body.id === 'exo-hd-189733-b' ||
        body.id === 'exo-hd-209458-b' ||
        body.id === 'exo-kepler-7-b' ||
        body.id === 'exo-wasp-12-b' ||
        body.id === 'exo-wasp-121-b' ||
        body.id === 'exo-hat-p-7-b' ||
        body.id === 'exo-55-cancri-e' ||
        body.id === 'exo-k2-18-b' ||
        body.id === 'exo-kelt-9-b' ||
        body.id === 'exo-hat-p-11-b' ||
        body.id === 'exo-ngts-4-b';

      const qTemp =
        tempK <= 160 ? 120
        : tempK <= 240 ? 200
        : tempK <= 360 ? 300
        : tempK <= 520 ? 440
        : tempK <= 720 ? 620
        : tempK <= 920 ? 820
        : tempK <= 1200 ? 1050
        : tempK <= 1550 ? 1380
        : tempK <= 2100 ? 1800
        : 2500;
      const qAlbedo =
        bodyAlbedo < 0.065 ? 0.04
        : bodyAlbedo < 0.14 ? 0.10
        : bodyAlbedo < 0.25 ? 0.20
        : bodyAlbedo < 0.39 ? 0.32
        : bodyAlbedo < 0.56 ? 0.48
        : 0.68;
      const qDensity =
        densityGcm3 === undefined ? 1.65
        : densityGcm3 < 1.05 ? 0.75
        : densityGcm3 >= 2.15 ? 2.60
        : 1.65;
      const variantSlot = bucket % 6;
      const syntheticId = isShowcaseBody
        ? body.id
        : `q-${themeIdx}-${sudarskyClass ?? 'n'}-${qTemp}-${qAlbedo}-${qDensity}-v${variantSlot}`;
      const key = `${syntheticId}-${wireframe ? 'w' : 's'}`;

      let mat = materialCacheRef.current.get(key);
      if (!mat) {
        const effTemp = isShowcaseBody ? tempK : qTemp;
        const effAlb = isShowcaseBody ? bodyAlbedo : qAlbedo;
        const effDens = isShowcaseBody ? densityGcm3 : qDensity;
        const bucketUniforms = getPlanetBucketUniforms(themeIdx, bucket, effTemp, {
          bodyId: syntheticId,
          albedo: effAlb,
          sudarskyClass,
          classification: body.classification,
          densityGcm3: effDens,
        });
        mat = new THREE.ShaderMaterial({
          wireframe,
          vertexShader: PLANET_VERTEX_SHADER,
          fragmentShader: PLANET_FRAGMENT_SHADER,
          uniforms: {
            time: sharedTimeUniformRef.current,
            themeIndex: { value: themeIdx },
            temperatureK: { value: effTemp },
            lightDir: { value: new THREE.Vector3(1.0, 0.4, 0.8).normalize() },
            seed: { value: bucketUniforms.seed },
            albedo: { value: effAlb },
            colorTint: { value: bucketUniforms.colorTint },
            bandShift: { value: bucketUniforms.bandShift },
            bandTurbulence: { value: bucketUniforms.bandTurbulence },
            lowlandColor: { value: bucketUniforms.lowlandColor },
            savannaColor: { value: bucketUniforms.savannaColor },
            plateauColor: { value: bucketUniforms.plateauColor },
            oceanShallowColor: { value: bucketUniforms.oceanShallowColor },
            oceanDeepColor: { value: bucketUniforms.oceanDeepColor },
            iceCapLatitude: { value: bucketUniforms.iceCapLatitude },
            sudarskyIndex: { value: bucketUniforms.sudarskyIndex },
            jovianBandDark: { value: bucketUniforms.jovianBandDark },
            jovianBandMid: { value: bucketUniforms.jovianBandMid },
            jovianBandLight: { value: bucketUniforms.jovianBandLight },
            jovianBandCloud: { value: bucketUniforms.jovianBandCloud },
            jovianAtmoTint: { value: bucketUniforms.jovianAtmoTint },
            jovianPolarTint: { value: bucketUniforms.jovianPolarTint },
            jovianStorm: { value: bucketUniforms.jovianStorm },
          },
        });
        materialCacheRef.current.set(key, mat);
      }
      return mat;
    };

    const buildBodyGroup = (body: CelestialBody): THREE.Material | null => {
      const sc = bodyScales[body.id];
      if (!sc) return null;

      const geoConfig = getBodyGeometryConfig(body);
      const groundY = sc.radius * geoConfig.verticalOffsetFactor;

      const group = new THREE.Group();
      group.position.set(sc.xPos, groundY, sc.zPos);
      group.userData = { bodyId: body.id, bodyData: body };

      const mat = getMaterial(body);

      let meshGeo: THREE.BufferGeometry = sharedSphereGeo;
      if (geoConfig.geometryType === 'irregular') {
        let customGeo = customGeometryCache.get(body.id);
        if (!customGeo) {
          customGeo = createIrregularBodyGeometry(body.id);
          customGeometryCache.set(body.id, customGeo);
        }
        meshGeo = customGeo;
      }

      const mesh = new THREE.Mesh(meshGeo, mat);
      if (meshGeo === sharedSphereGeo) {
        mesh.geometry = sharedLowGeo;
        group.userData.sphereMesh = mesh;
        group.userData.lodHi = sharedSphereGeo;
        group.userData.lodLo = sharedLowGeo;
      }
      group.userData.radius = sc.radius;
      mesh.scale.set(
        sc.radius * geoConfig.scaleMultiplier.x,
        sc.radius * geoConfig.scaleMultiplier.y,
        sc.radius * geoConfig.scaleMultiplier.z
      );
      mesh.name = `Sphere-${body.id}`;
      mesh.userData = { ...mesh.userData, bodyData: body };
      group.add(mesh);
      interactiveMeshesRef.current.push(mesh);

      if (!wireframe) {
        if (body.id === 'sol-earth') {
          const cloudPath = '/textures/planets/earth-clouds.png';
          let cloudTex = textureCacheRef.current.get(cloudPath);
          if (!cloudTex) {
            cloudTex = textureLoader.load(cloudPath, (loadedCloud) => {
              rendererRef.current?.initTexture(loadedCloud);
            });
            cloudTex.wrapS = THREE.RepeatWrapping;
            cloudTex.wrapT = THREE.ClampToEdgeWrapping;
            textureCacheRef.current.set(cloudPath, cloudTex);
          }
          const cloudMat = new THREE.MeshStandardMaterial({
            map: cloudTex,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          const cloudMesh = new THREE.Mesh(sharedSphereGeo, cloudMat);
          cloudMesh.name = `Clouds-${body.id}`;
          const cloudScale = sc.radius * 1.015;
          cloudMesh.scale.set(cloudScale, cloudScale, cloudScale);
          group.add(cloudMesh);

          const atmoMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.22,
            side: THREE.BackSide,
            depthWrite: false,
          });
          const atmoMesh = new THREE.Mesh(sharedSphereGeo, atmoMat);
          const atmoScale = sc.radius * 1.032;
          atmoMesh.scale.set(atmoScale, atmoScale, atmoScale);
          group.add(atmoMesh);
        } else if (body.id === 'sol-venus') {
          const venusAtmoMat = new THREE.MeshBasicMaterial({
            color: 0xfde047,
            transparent: true,
            opacity: 0.20,
            side: THREE.BackSide,
            depthWrite: false,
          });
          const venusAtmoMesh = new THREE.Mesh(sharedSphereGeo, venusAtmoMat);
          const atmoScale = sc.radius * 1.025;
          venusAtmoMesh.scale.set(atmoScale, atmoScale, atmoScale);
          group.add(venusAtmoMesh);
        } else if (body.id === 'sol-titan') {
          const titanHazeMat = new THREE.MeshBasicMaterial({
            color: 0xf97316,
            transparent: true,
            opacity: 0.32,
            side: THREE.BackSide,
            depthWrite: false,
          });
          const titanHazeMesh = new THREE.Mesh(sharedSphereGeo, titanHazeMat);
          const hazeScale = sc.radius * 1.035;
          titanHazeMesh.scale.set(hazeScale, hazeScale, hazeScale);
          group.add(titanHazeMesh);
        } else if (body.id === 'sol-mars') {
          const marsAtmoMat = new THREE.MeshBasicMaterial({
            color: 0x93c5fd,
            transparent: true,
            opacity: 0.14,
            side: THREE.BackSide,
            depthWrite: false,
          });
          const marsAtmoMesh = new THREE.Mesh(sharedSphereGeo, marsAtmoMat);
          const marsScale = sc.radius * 1.018;
          marsAtmoMesh.scale.set(marsScale, marsScale, marsScale);
          group.add(marsAtmoMesh);
        }
      }

      if (sc.radius < 0.002) {
        const hitR = Math.max(sc.radius * 1.35, 0.0008);
        const hitMesh = new THREE.Mesh(sharedHitGeo, sharedHitMat);
        hitMesh.scale.set(
          hitR * geoConfig.scaleMultiplier.x,
          hitR * geoConfig.scaleMultiplier.y,
          hitR * geoConfig.scaleMultiplier.z
        );
        hitMesh.userData = { bodyData: body };
        group.add(hitMesh);
        interactiveMeshesRef.current.push(hitMesh);
      }

      scene.add(group);
      bodyObjectsRef.current.set(body.id, group);
      return mat;
    };

    // On-demand body group builder: instantiates 3D meshes without synchronous shader pre-compiles
    const totalCount = sortedBodies.length;
    let buildIdx = 0;
    let warmCancelled = false;
    let warmRafId = 0;

    if (totalCount > 0) {
      // Build focused body immediately on Frame 0 so it appears instantaneously
      const initialFocusBody =
        sortedBodies.find((b) => b.id === activeBodyId) ?? sortedBodies[0];
      buildBodyGroup(initialFocusBody);
      buildIdx = 0;

      // Stream background bodies asynchronously across animation frames
      // No synchronous renderer.compile calls: GPU compiles on-demand without stalling
      const stepBuild = () => {
        if (warmCancelled) return;
        const batchEnd = Math.min(totalCount, buildIdx + 200);

        for (; buildIdx < batchEnd; buildIdx++) {
          const body = sortedBodies[buildIdx];
          if (body.id === initialFocusBody.id) continue;
          buildBodyGroup(body);
        }

        if (buildIdx < totalCount) {
          warmRafId = requestAnimationFrame(stepBuild);
        }
      };

      warmRafId = requestAnimationFrame(stepBuild);
    }

    return () => {
      warmCancelled = true;
      if (warmRafId) cancelAnimationFrame(warmRafId);
      sharedSphereGeo.dispose();
      sharedLowGeo.dispose();
      sharedHitGeo.dispose();
      sharedHitMat.dispose();
      customGeometryCache.forEach((geo) => geo.dispose());
      customGeometryCache.clear();
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
      hasSnappedCameraRef.current = true;
      if (cameraRef.current) {
        cameraRef.current.position.set(initX, initY, initZ);
        cameraRef.current.lookAt(target);
      }
    }
  }, [activeBodyId, bodyScales, getCameraFraming]);

  // Main Render & Animation Loop
  useEffect(() => {
    const clock = new THREE.Clock();
    const projScreenMatrix = new THREE.Matrix4();
    const frustum = new THREE.Frustum();
    const tempSphere = new THREE.Sphere();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsedTime = clock.getElapsedTime();

      // Camera flight interpolation (fluid, zero-delay travel)
      if (cameraRef.current) {
        const { theta, phi } = cameraAngleRef.current;
        const dist = cameraDistanceRef.current;

        const targetX = cameraTargetRef.current.x + dist * Math.sin(phi) * Math.sin(theta);
        const targetY = cameraTargetRef.current.y + dist * Math.cos(phi);
        const targetZ = cameraTargetRef.current.z + dist * Math.sin(phi) * Math.cos(theta);
        const targetPos = new THREE.Vector3(targetX, targetY, targetZ);

        if (!hasSnappedCameraRef.current) {
          hasSnappedCameraRef.current = true;
          currentCameraPosRef.current.copy(targetPos);
          currentLookAtRef.current.copy(cameraTargetRef.current);
          cameraRef.current.position.copy(targetPos);
          cameraRef.current.lookAt(cameraTargetRef.current);
        } else {
          const decayRate = isTourPlayingRef.current ? 5.5 : 4.5;
          const lerpFactor = Math.min(1.0, 1.0 - Math.exp(-decayRate * delta));

          currentCameraPosRef.current.lerp(targetPos, lerpFactor);
          currentLookAtRef.current.lerp(cameraTargetRef.current, lerpFactor);

          cameraRef.current.position.copy(currentCameraPosRef.current);
          cameraRef.current.lookAt(currentLookAtRef.current);
        }

        // Dynamic clip planes: completely prevents Z-fighting and near-plane black clipping blind spots
        const targetNear = Math.max(0.0000001, Math.min(0.01, dist * 0.0002));
        const targetFar = Math.max(250000, dist * 50.0);
        if (
          Math.abs(cameraRef.current.near - targetNear) > targetNear * 0.1 ||
          Math.abs(cameraRef.current.far - targetFar) > 100
        ) {
          cameraRef.current.near = targetNear;
          cameraRef.current.far = targetFar;
          cameraRef.current.updateProjectionMatrix();
        }

        // Camera fill light synchronization: tracks camera to prevent dark shadow blind spots
        if (cameraLightRef.current) {
          cameraLightRef.current.position.copy(cameraRef.current.position);
        }

        // Keep all celestial bodies visible and interactive across the entire 3D stage
        // Completely eliminates culling blind spots and vanished bodies
        bodyObjectsRef.current.forEach((grp) => {
          grp.visible = true;
        });
      }

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

      // Axial rotation and zero-allocation LOD check (skips sub-pixel distant bodies to avoid 2,142 matrix updates/frame)
      lodFrameRef.current = (lodFrameRef.current + 1) % 12;
      const runLodCheck = lodFrameRef.current === 0;
      if ((isAutoRotating || runLodCheck) && cameraRef.current) {
        const camX = cameraRef.current.position.x;
        const camY = cameraRef.current.position.y;
        const camZ = cameraRef.current.position.z;
        const baseRot = delta * 0.18 * rotationSpeed;

        bodyObjectsRef.current.forEach((grp, id) => {
          if (!grp.visible) return;
          const dx = grp.position.x - camX;
          const dy = grp.position.y - camY;
          const dz = grp.position.z - camZ;
          const distSq = dx * dx + dy * dy + dz * dz;
          const r = (grp.userData.radius as number) || 0.001;
          const rSq = r * r;

          if (isAutoRotating && rSq > distSq * 0.000004) {
            grp.rotation.y += baseRot;
            if (id === 'sol-earth') {
              const clouds = grp.getObjectByName('Clouds-sol-earth');
              if (clouds) {
                clouds.rotation.y += delta * 0.06 * rotationSpeed;
              }
            }
          }

          if (runLodCheck) {
            const sphereMesh = grp.userData.sphereMesh as THREE.Mesh | undefined;
            const hi = grp.userData.lodHi as THREE.BufferGeometry | undefined;
            const lo = grp.userData.lodLo as THREE.BufferGeometry | undefined;
            if (sphereMesh && hi && lo) {
              const want = rSq > distSq * 0.0009 ? hi : lo;
              if (sphereMesh.geometry !== want) sphereMesh.geometry = want;
            }
          }
        });
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
            const bodyObj = MASTER_CELESTIAL_BY_ID.get(currentActiveId);
            const geoConfig = bodyObj ? getBodyGeometryConfig(bodyObj) : null;
            const apexY = sc.radius * (geoConfig ? geoConfig.verticalOffsetFactor * 2 : 2);
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
        if (!isSceneReady) {
          setIsSceneReady(true);
        }
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

  // OBS Studio integration: auto-hide toolbars and handle broadcast recording triggers
  const obsIntegration = useObsStudio({
    onTourStartRequested: (pace) => {
      if (pace) setTourLength(pace);
      handleRestartTour();
    },
    onTourStopRequested: () => {
      if (isTourModeRef.current) handleEndTour();
    },
  });

  useEffect(() => {
    if (obsIntegration.config.cleanBroadcast) {
      setAreControlsHidden(true);
    }
  }, [obsIntegration.config.cleanBroadcast]);

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

      {/* Loading Sprite during startup initialization */}
      {!isSceneReady && !webglError && (
        <LoadingSprite label="INITIALIZING EXOPLANET COMPARATOR..." />
      )}

      {/* HUD, Telemetry, and Stage Overlays */}
      <ExoplanetStageHud
        sortedBodies={sortedBodies}
        filteredBodies={filteredBodies}
        activeIndex={activeIndex}
        activeBodyId={activeBodyId}
        activeFocusedBody={activeFocusedBody}
        displayBody={displayBody}
        loadProgress={loadProgress}
        webglError={webglError}
        sortKey={sortKey}
        sortDirection={sortDirection}
        layoutMode={layoutMode}
        isAutoRotating={isAutoRotating}
        wireframe={wireframe}
        showGrid={showGrid}
        isTourMode={isTourMode}
        isTourPlaying={isTourPlaying}
        tourLength={tourLength}
        isSearchActive={isSearchActive}
        searchQuery={searchQuery}
        isFullscreen={isFullscreen}
        areControlsHidden={areControlsHidden}
        isTopPanelMinimized={isTopPanelMinimized}
        isSortMenuOpen={isSortMenuOpen}
        isLayoutMenuOpen={isLayoutMenuOpen}
        isTogglesMenuOpen={isTogglesMenuOpen}
        isTourPaceMenuOpen={isTourPaceMenuOpen}
        isObs={obsIntegration.isObs}
        obsStatus={obsIntegration.obsStatus}
        sortMenuRef={sortMenuRef}
        layoutMenuRef={layoutMenuRef}
        togglesMenuRef={togglesMenuRef}
        tourPaceMenuRef={tourPaceMenuRef}
        searchInputRef={searchInputRef}
        labelElementsRef={labelElementsRef}
        onSelect={handleSelect}
        onHover={setHoveredBody}
        onZoom={handleZoom}
        onResetCamera={handleResetCamera}
        onFitAll={handleFitAll}
        onUnfocus={handleUnfocus}
        onToggleTour={handleToggleTour}
        onEndTour={handleEndTour}
        onToggleTourPlay={handleToggleTour}
        onRestartTour={handleRestartTour}
        onPrev={handlePrev}
        onNext={handleNext}
        onFirst={handleFirst}
        onLast={handleLast}
        onToggleFullscreen={toggleFullscreen}
        onSortChange={(key) => {
          soundEffects.play('click');
          setSortKey(key);
          setIsSortMenuOpen(false);
        }}
        onSortDirectionToggle={() => {
          soundEffects.play('click');
          setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        }}
        onLayoutChange={(mode) => {
          soundEffects.play('toggleOn');
          setLayoutMode(mode);
          setIsLayoutMenuOpen(false);
        }}
        onToggleAutoRotate={() => {
          const next = !isAutoRotating;
          soundEffects.play(next ? 'toggleOn' : 'toggleOff');
          setIsAutoRotating(next);
        }}
        onToggleWireframe={() => {
          const next = !wireframe;
          soundEffects.play(next ? 'toggleOn' : 'toggleOff');
          setWireframe(next);
        }}
        onToggleGrid={() => {
          const next = !showGrid;
          soundEffects.play(next ? 'toggleOn' : 'toggleOff');
          setShowGrid(next);
        }}
        onSetTourLength={(len) => {
          soundEffects.play('click');
          setTourLength(len);
          setIsTourPaceMenuOpen(false);
        }}
        onSearchChange={setSearchQuery}
        onToggleSearch={(active) => {
          soundEffects.play('click');
          setIsSearchActive(active);
          if (!active) setSearchQuery('');
        }}
        onToggleControlsHidden={setAreControlsHidden}
        onToggleTopPanelMinimized={setIsTopPanelMinimized}
        onToggleSortMenu={setIsSortMenuOpen}
        onToggleLayoutMenu={setIsLayoutMenuOpen}
        onToggleTogglesMenu={setIsTogglesMenuOpen}
        onToggleTourPaceMenu={setIsTourPaceMenuOpen}
        onOpenShortcutsHelp={() => setShowShortcutsHelp(true)}
      />

      {/* Keyboard Shortcuts Modal */}
      <ExoplanetShortcutsModal
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />
    </div>
  );
};
