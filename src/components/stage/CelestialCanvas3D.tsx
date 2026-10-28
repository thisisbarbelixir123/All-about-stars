import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { StageDisplayableItem } from './types';
import { StageTourHUD } from './StageTourHUD';
import { createContinuousGridMesh, ContinuousGridHandle } from '../../utils/continuousGrid';
import { TourLength } from '../../types';
import { soundEffects } from '../../utils/soundEffects';
import {
  Play,
  Pause,
  Clock,
  RotateCcw,
  RotateCw,
  Grid,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  X,
  Check,
  ArrowUpDown,
  Telescope,
  Keyboard,
  Eye,
  EyeOff,
  Sliders
} from 'lucide-react';

export type CelestialSortKey = 'size' | 'mass' | 'temperature';

export const TOUR_DURATION_MAP: Record<TourLength, number> = {
  short: 1500,
  medium: 2800,
  long: 4800,
};

const PROPORTIONAL_GAP_FACTOR = 0.38;
const MIN_CAMERA_DISTANCE = 0.000005;
const MAX_CAMERA_DISTANCE = 150000;

export interface CelestialCanvas3DProps<T extends StageDisplayableItem> {
  items: T[];
  initialFocusedId?: string | null;
  createItemMesh: (item: T) => THREE.Object3D;
  sharedTimeUniform?: { value: number };
  onFocusItem?: (item: T | null) => void;
  sortKey?: CelestialSortKey;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (key: CelestialSortKey) => void;
  onToggleSortDirection?: () => void;
}

export function CelestialCanvas3D<T extends StageDisplayableItem>({
  items,
  initialFocusedId = null,
  createItemMesh,
  sharedTimeUniform,
  onFocusItem,
  sortKey = 'size',
  sortDirection = 'asc',
  onSortChange,
  onToggleSortDirection,
}: CelestialCanvas3DProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const gridHandleRef = useRef<ContinuousGridHandle | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Focus & Tour state
  const [focusedId, setFocusedId] = useState<string | null>(initialFocusedId);
  const focusedIdRef = useRef(focusedId);
  focusedIdRef.current = focusedId;

  const [isTourMode, setIsTourMode] = useState<boolean>(false);
  const [isTourPlaying, setIsTourPlaying] = useState<boolean>(false);
  const isTourPlayingRef = useRef(isTourPlaying);
  isTourPlayingRef.current = isTourPlaying;

  const [tourLength, setTourLength] = useState<TourLength>('medium');
  const [isTourPaceMenuOpen, setIsTourPaceMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isControlsMenuOpen, setIsControlsMenuOpen] = useState(false);

  // View settings
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isCleanMode, setIsCleanMode] = useState<boolean>(false);
  const [areControlsHidden, setAreControlsHidden] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sorted items
  const sortedItems = useMemo(() => {
    const list = [...items];
    list.sort((a, b) => {
      let diff = 0;
      if (sortKey === 'size') {
        diff = a.diameterKm - b.diameterKm;
      }
      return sortDirection === 'desc' ? -diff : diff;
    });
    return list;
  }, [items, sortKey, sortDirection]);

  // Active focused item and index
  const activeIndex = useMemo(() => {
    if (!focusedId) return -1;
    return sortedItems.findIndex((it) => it.id === focusedId);
  }, [sortedItems, focusedId]);

  const activeItem = activeIndex >= 0 ? sortedItems[activeIndex] : null;

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return sortedItems;
    const q = searchQuery.trim().toLowerCase();
    return sortedItems.filter((it) => it.name.toLowerCase().includes(q));
  }, [sortedItems, searchQuery]);

  // Compute 1:1 true linear side-by-side positions along the X-axis
  const layoutScales = useMemo(() => {
    let currentX = 0;
    const map = new Map<string, { radius: number; xPos: number }>();

    for (let idx = 0; idx < sortedItems.length; idx++) {
      const radius = sortedItems[idx].meshRadius;
      if (idx === 0) {
        currentX = radius;
      } else {
        const prevRadius = sortedItems[idx - 1].meshRadius;
        const gap = (prevRadius + radius) * PROPORTIONAL_GAP_FACTOR;
        currentX += prevRadius + radius + gap;
      }
      map.set(sortedItems[idx].id, { radius, xPos: currentX });
    }

    return map;
  }, [sortedItems]);

  const layoutScalesRef = useRef(layoutScales);
  layoutScalesRef.current = layoutScales;

  // Meshes mapped by id
  const meshesMapRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const interactiveHitTargetsRef = useRef<THREE.Mesh[]>([]);

  // Spherical orbit camera state
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 6));
  const cameraDistanceRef = useRef<number>(6);
  const cameraAngleRef = useRef<{ theta: number; phi: number }>({
    theta: 0.18,
    phi: Math.PI / 2 - 0.16,
  });

  // Mouse drag & inertia
  const isDraggingRef = useRef(false);
  const isRightDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const orbitVelocityRef = useRef({ x: 0, y: 0 });

  // Camera framing calculation
  const setCameraFraming = useCallback((targetId: string | null, immediate = false) => {
    if (!targetId) {
      // Unfocused mode: view the whole array panoramically
      const scales = Array.from(layoutScalesRef.current.values());
      if (scales.length === 0) return;
      const last = scales[scales.length - 1];
      const midX = last.xPos / 2;
      const maxRadius = scales.reduce((max, s) => Math.max(max, s.radius), 1);
      const totalSpan = last.xPos + maxRadius * 2;

      cameraTargetRef.current.set(midX, maxRadius * 0.45, 0);
      const aspect = cameraRef.current?.aspect || 1.0;
      const portraitFactor = aspect < 1.0 ? 1.4 : 1.0;
      cameraDistanceRef.current = Math.max(40, totalSpan * 0.7 * portraitFactor);
    } else {
      const sc = layoutScalesRef.current.get(targetId);
      if (!sc) return;
      const r = sc.radius;
      const dist = Math.max(0.00005, r * 4.2);
      const targetY = r * 0.9;
      cameraTargetRef.current.set(sc.xPos, targetY, 0);
      cameraDistanceRef.current = dist;

      if (immediate && cameraRef.current) {
        const { theta, phi } = cameraAngleRef.current;
        const camX = sc.xPos + dist * Math.sin(phi) * Math.sin(theta);
        const camY = targetY + dist * Math.cos(phi);
        const camZ = dist * Math.sin(phi) * Math.cos(theta);
        currentCameraPosRef.current.set(camX, camY, camZ);
        currentLookAtRef.current.copy(cameraTargetRef.current);
        cameraRef.current.position.copy(currentCameraPosRef.current);
        cameraRef.current.lookAt(currentLookAtRef.current);
      }
    }
  }, []);

  // Focus an item
  const handleFocusItem = useCallback(
    (item: T | null) => {
      soundEffects.play(item ? 'focus' : 'unfocus');
      setFocusedId(item ? item.id : null);
      if (onFocusItem) onFocusItem(item);
      setCameraFraming(item ? item.id : null, false);
    },
    [onFocusItem, setCameraFraming]
  );

  const handleUnfocus = useCallback(() => {
    handleFocusItem(null);
  }, [handleFocusItem]);

  // Navigation: Next / Prev
  const handlePrevItem = useCallback(() => {
    if (sortedItems.length === 0) return;
    const curIdx = activeIndex >= 0 ? activeIndex : 0;
    const prevIdx = curIdx <= 0 ? sortedItems.length - 1 : curIdx - 1;
    handleFocusItem(sortedItems[prevIdx]);
  }, [sortedItems, activeIndex, handleFocusItem]);

  const handleNextItem = useCallback(() => {
    if (sortedItems.length === 0) return;
    const curIdx = activeIndex >= 0 ? activeIndex : -1;
    const nextIdx = curIdx >= sortedItems.length - 1 ? 0 : curIdx + 1;
    handleFocusItem(sortedItems[nextIdx]);
  }, [sortedItems, activeIndex, handleFocusItem]);

  // First / Last shortcuts
  const handleFirstItem = useCallback(() => {
    if (sortedItems.length > 0) handleFocusItem(sortedItems[0]);
  }, [sortedItems, handleFocusItem]);

  const handleLastItem = useCallback(() => {
    if (sortedItems.length > 0) handleFocusItem(sortedItems[sortedItems.length - 1]);
  }, [sortedItems, handleFocusItem]);

  // Tour controls
  const handleToggleTour = useCallback(() => {
    if (!isTourMode) {
      setIsTourMode(true);
      setIsTourPlaying(true);
      isTourPlayingRef.current = true;
      soundEffects.play('toggleOn');
      if (activeIndex === -1 || activeIndex >= sortedItems.length - 1) {
        handleFirstItem();
      }
    } else {
      const willPlay = !isTourPlayingRef.current;
      setIsTourPlaying(willPlay);
      isTourPlayingRef.current = willPlay;
      soundEffects.play(willPlay ? 'toggleOn' : 'toggleOff');
    }
  }, [isTourMode, activeIndex, sortedItems, handleFirstItem]);

  const handleEndTour = useCallback(() => {
    setIsTourMode(false);
    setIsTourPlaying(false);
    isTourPlayingRef.current = false;
    soundEffects.play('toggleOff');
  }, []);

  const handleRestartTour = useCallback(() => {
    setIsTourMode(true);
    setIsTourPlaying(true);
    isTourPlayingRef.current = true;
    soundEffects.play('nav');
    handleFirstItem();
  }, [handleFirstItem]);

  // Auto Tour Timer
  useEffect(() => {
    if (!isTourPlaying || sortedItems.length === 0) return;
    const duration = TOUR_DURATION_MAP[tourLength] || 2800;

    const timer = setTimeout(() => {
      if (activeIndex >= sortedItems.length - 1) {
        setIsTourPlaying(false);
        isTourPlayingRef.current = false;
      } else {
        const nextItem = sortedItems[activeIndex + 1];
        handleFocusItem(nextItem);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [isTourPlaying, activeIndex, sortedItems, tourLength, handleFocusItem]);

  // 1. Initialize Scene & WebGLRenderer ONCE on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.00001, 500000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(100, 45, 85);
    scene.add(dirLight);

    const ambLight = new THREE.AmbientLight(0xffffff, 0.28);
    scene.add(ambLight);

    // Continuous Grid
    const gridHandle = createContinuousGridMesh({
      yLevel: 0,
      baseColor: '#0ea5e9',
      majorColor: '#38bdf8',
    });
    scene.add(gridHandle.mesh);
    gridHandleRef.current = gridHandle;

    // Starfield Background
    const starCount = 4500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const r = THREE.MathUtils.randFloat(25000, 220000);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
      starPos[i] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ size: 2.2, color: 0x93c5fd, transparent: true, opacity: 0.75 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      if (sharedTimeUniform) {
        sharedTimeUniform.value = elapsed % 600.0;
      }

      // Orbit inertia damping
      if (!isDraggingRef.current && !isRightDraggingRef.current) {
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

      // Axial spin & Zoom-aware visibility: only objects in view frustum or near focus are drawn
      const dist = cameraDistanceRef.current;
      const viewSpan = dist * 2.8;
      const focusX = currentLookAtRef.current.x;
      const rotDelta = delta * 0.22;

      sortedItems.forEach((item) => {
        const mesh = meshesMapRef.current.get(item.id);
        const sc = layoutScalesRef.current.get(item.id);
        if (!mesh || !sc) return;

        const isNearFocus = focusedIdRef.current === item.id;
        const inFrustum = isNearFocus || Math.abs(sc.xPos - focusX) <= viewSpan + sc.radius;

        if (mesh.visible !== inFrustum) mesh.visible = inFrustum;
        if (inFrustum && isAutoRotating) mesh.rotation.y += rotDelta;
      });

      // Exponential smooth camera glide
      if (cameraRef.current) {
        const { theta, phi } = cameraAngleRef.current;
        const targetX = cameraTargetRef.current.x + dist * Math.sin(phi) * Math.sin(theta);
        const targetY = cameraTargetRef.current.y + dist * Math.cos(phi);
        const targetZ = cameraTargetRef.current.z + dist * Math.sin(phi) * Math.cos(theta);

        const decayRate = isTourPlayingRef.current ? 5.5 : 6.0;
        const lerpFactor = Math.min(1.0, 1.0 - Math.exp(-decayRate * delta));

        currentCameraPosRef.current.x += (targetX - currentCameraPosRef.current.x) * lerpFactor;
        currentCameraPosRef.current.y += (targetY - currentCameraPosRef.current.y) * lerpFactor;
        currentCameraPosRef.current.z += (targetZ - currentCameraPosRef.current.z) * lerpFactor;

        currentLookAtRef.current.lerp(cameraTargetRef.current, lerpFactor);

        cameraRef.current.position.copy(currentCameraPosRef.current);
        cameraRef.current.lookAt(currentLookAtRef.current);

        // Dynamic clip planes to avoid Z-fighting from 396 km moons to 1.4M km Sun
        const targetNear = Math.max(0.000001, Math.min(10.0, dist * 0.002));
        const targetFar = Math.max(250000, dist * 40.0);
        if (Math.abs(cameraRef.current.near - targetNear) > targetNear * 0.15) {
          cameraRef.current.near = targetNear;
          cameraRef.current.far = targetFar;
          cameraRef.current.updateProjectionMatrix();
        }
      }

      // Continuous grid updates
      if (gridHandleRef.current && cameraRef.current) {
        const distToFocus = currentCameraPosRef.current.distanceTo(currentLookAtRef.current);
        gridHandleRef.current.update(cameraRef.current, distToFocus);
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [sharedTimeUniform, isAutoRotating, sortedItems]);

  // 2. Mount meshes ONCE when sortedItems change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clean old meshes
    meshesMapRef.current.forEach((m) => scene.remove(m));
    meshesMapRef.current.clear();
    interactiveHitTargetsRef.current = [];

    const hitGeo = new THREE.SphereGeometry(1.0, 16, 16);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });

    sortedItems.forEach((item) => {
      const sc = layoutScales.get(item.id);
      if (!sc) return;

      const mesh = createItemMesh(item);
      mesh.position.set(sc.xPos, sc.radius, 0);
      mesh.userData = { itemId: item.id };
      scene.add(mesh);
      meshesMapRef.current.set(item.id, mesh);

      // Hit target for easy clicking on small bodies
      const hitRadius = Math.max(sc.radius * 1.3, 0.08);
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.scale.setScalar(hitRadius);
      hitMesh.position.set(sc.xPos, sc.radius, 0);
      hitMesh.userData = { itemId: item.id };
      scene.add(hitMesh);
      interactiveHitTargetsRef.current.push(hitMesh);
    });

    if (gridHandleRef.current && sortedItems.length > 0) {
      const last = layoutScales.get(sortedItems[sortedItems.length - 1].id);
      if (last) {
        gridHandleRef.current.setBounds({
          minX: 0,
          maxX: last.xPos + last.radius * 2,
          minZ: -last.radius * 2,
          maxZ: last.radius * 2,
        });
      }
    }

    if (rendererRef.current && cameraRef.current) {
      rendererRef.current.compile(scene, cameraRef.current);
    }

    setCameraFraming(focusedIdRef.current, true);
  }, [sortedItems, layoutScales, createItemMesh, setCameraFraming]);

  // Toggle grid
  useEffect(() => {
    if (gridHandleRef.current) {
      gridHandleRef.current.mesh.visible = showGrid;
    }
  }, [showGrid]);

  // Click handler to select / focus object via raycaster or proximity
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !cameraRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(interactiveHitTargetsRef.current, false);
    let hitId: string | null = null;

    if (intersects.length > 0) {
      hitId = (intersects[0].object.userData.itemId as string) || null;
    } else {
      // Screen space proximity click fallback
      let closestDist = Infinity;
      sortedItems.forEach((item) => {
        const sc = layoutScalesRef.current.get(item.id);
        if (!sc || !cameraRef.current) return;
        const worldPos = new THREE.Vector3(sc.xPos, sc.radius, 0).project(cameraRef.current);
        if (worldPos.z >= -1.0 && worldPos.z <= 1.0) {
          const sx = ((worldPos.x + 1) * 0.5) * rect.width + rect.left;
          const sy = ((-worldPos.y + 1) * 0.5) * rect.height + rect.top;
          const dist = Math.hypot(e.clientX - sx, e.clientY - sy);
          if (dist <= 32 && dist < closestDist) {
            closestDist = dist;
            hitId = item.id;
          }
        }
      });
    }

    if (hitId) {
      const target = sortedItems.find((it) => it.id === hitId);
      if (target) handleFocusItem(target);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'c' || e.key === 'C') {
        setIsCleanMode((prev) => !prev);
      } else if (e.key === ' ') {
        e.preventDefault();
        handleToggleTour();
      } else if (e.key === 'Escape') {
        if (isTourMode) {
          handleEndTour();
        } else if (focusedId) {
          handleUnfocus();
        }
      } else if (e.key === 'ArrowRight') {
        handleNextItem();
      } else if (e.key === 'ArrowLeft') {
        handlePrevItem();
      } else if (e.key === '?') {
        setShowShortcutsModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleTour, handleEndTour, handleUnfocus, handleNextItem, handlePrevItem, isTourMode, focusedId]);

  // Non-passive wheel zoom
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.14 : 0.87;
      cameraDistanceRef.current = Math.max(
        MIN_CAMERA_DISTANCE,
        Math.min(MAX_CAMERA_DISTANCE, cameraDistanceRef.current * zoomFactor)
      );
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Mouse orbit & right-click pan
  const handleMouseDown = (e: React.MouseEvent) => {
    orbitVelocityRef.current = { x: 0, y: 0 };
    if (e.button === 2) {
      isRightDraggingRef.current = true;
    } else {
      isDraggingRef.current = true;
    }
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const dx = e.clientX - prevMouseRef.current.x;
    const dy = e.clientY - prevMouseRef.current.y;

    if (isRightDraggingRef.current) {
      const panSpeed = cameraDistanceRef.current * 0.0018;
      const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        -cameraAngleRef.current.theta
      );
      cameraTargetRef.current.addScaledVector(right, -dx * panSpeed);
      cameraTargetRef.current.y += dy * panSpeed;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    } else if (isDraggingRef.current) {
      const velX = -dx * 0.007;
      const velY = -dy * 0.007;
      orbitVelocityRef.current = { x: velX, y: velY };
      cameraAngleRef.current.theta += velX;
      cameraAngleRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraAngleRef.current.phi + velY));
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isRightDraggingRef.current = false;
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const factor = direction === 'in' ? 0.75 : 1.35;
    cameraDistanceRef.current = Math.max(
      MIN_CAMERA_DISTANCE,
      Math.min(MAX_CAMERA_DISTANCE, cameraDistanceRef.current * factor)
    );
    soundEffects.play(direction === 'in' ? 'zoomIn' : 'zoomOut');
  };

  const handleResetCamera = () => {
    soundEffects.play('reset');
    cameraAngleRef.current = { theta: 0.18, phi: Math.PI / 2 - 0.16 };
    setCameraFraming(focusedId, false);
  };

  const handleFitAll = () => {
    soundEffects.play('nav');
    handleUnfocus();
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`relative w-full h-full select-none overflow-hidden ${
        isCleanMode ? 'cursor-none' : 'cursor-grab active:cursor-grabbing'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full" />

      {/* TOP HEADER CONTROLS BAR (hidden in Clean Mode) */}
      {!isCleanMode && (
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-40 flex items-center justify-between gap-2 pointer-events-none">
          {/* Top-Left: Sort & Auto Tour Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
            {/* Sort Toggle */}
            {onSortChange && (
              <div className="relative">
                <div className="flex items-center bg-[#040816]/95 backdrop-blur-xl rounded-xl border border-cyan-500/35 shadow-lg text-xs font-mono overflow-hidden">
                  <button
                    onClick={() => setIsSortMenuOpen((prev) => !prev)}
                    title="Toggle Sort Metric"
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-slate-300 hover:text-white hover:bg-cyan-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-slate-400 hidden sm:inline">Sort:</span>
                    <span className="text-cyan-300 font-bold capitalize">{sortKey}</span>
                    <ChevronDown className="w-3 h-3 text-cyan-400" />
                  </button>

                  <div className="w-[1px] h-4 bg-cyan-500/25" />

                  <button
                    onClick={onToggleSortDirection}
                    title="Toggle Ascending / Descending"
                    className="px-2.5 py-1.5 text-cyan-400 font-bold hover:text-white hover:bg-cyan-500/20 active:scale-95 transition-all cursor-pointer text-[11px]"
                  >
                    {sortDirection === 'asc' ? 'Asc ↑' : 'Desc ↓'}
                  </button>
                </div>

                {isSortMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-48 bg-[#040817] border border-cyan-500/40 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-xl font-mono text-xs flex flex-col gap-1">
                    {(['size', 'mass', 'temperature'] as const).map((key) => (
                      <button
                        key={key}
                        onClick={() => {
                          onSortChange(key);
                          setIsSortMenuOpen(false);
                        }}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg capitalize text-left cursor-pointer transition-colors ${
                          sortKey === key ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>{key}</span>
                        {sortKey === key && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Auto Tour Toggle */}
            <button
              onClick={handleToggleTour}
              title={isTourPlaying ? 'Pause Auto Tour (Space)' : 'Play Auto Tour (Space)'}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl backdrop-blur-xl border text-xs font-mono font-semibold transition-all cursor-pointer shadow-lg active:scale-95 ${
                isTourPlaying
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                  : 'bg-[#040816]/95 border-cyan-500/35 text-slate-300 hover:text-white hover:bg-cyan-500/20'
              }`}
            >
              {isTourPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400 shrink-0" /> : <Play className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
              <span className="hidden sm:inline">{isTourPlaying ? 'Playing' : 'Auto Tour'}</span>
            </button>

            {/* Tour Pace Menu */}
            <div className="relative">
              <button
                onClick={() => setIsTourPaceMenuOpen((prev) => !prev)}
                title="Tour Speed / Pace"
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl backdrop-blur-xl border border-cyan-500/35 bg-[#040816]/95 text-slate-300 hover:text-white text-xs font-mono active:scale-95 cursor-pointer shadow-lg"
              >
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-cyan-300 font-bold capitalize hidden sm:inline">{tourLength}</span>
                <ChevronDown className="w-3 h-3 text-cyan-400" />
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
                      className={`flex items-center justify-between px-2 py-1.5 rounded-lg capitalize text-left cursor-pointer transition-colors ${
                        tourLength === len ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-300 hover:bg-white/5'
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

          {/* Top-Right: Quick Stage Controls */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Clean recording mode toggle (C) */}
            <button
              onClick={() => setIsCleanMode(true)}
              title="Clean Recording Mode (C)"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#040816]/95 hover:bg-black border border-cyan-500/35 text-slate-300 hover:text-white text-xs font-mono transition-all shadow-lg active:scale-95 flex items-center gap-1.5"
            >
              <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Clean (C)</span>
            </button>

            {/* Spin toggle */}
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              title={isAutoRotating ? 'Stop Spin' : 'Spin Objects'}
              className={`p-1.5 sm:p-2 rounded-xl border text-xs transition-all shadow-lg backdrop-blur-xl ${
                isAutoRotating ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300' : 'bg-[#040816]/95 border-cyan-500/35 text-slate-400'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isAutoRotating ? 'animate-spin-slow text-cyan-400' : ''}`} />
            </button>

            {/* Grid toggle */}
            <button
              onClick={() => setShowGrid(!showGrid)}
              title={showGrid ? 'Hide Floor Grid' : 'Show Floor Grid'}
              className={`p-1.5 sm:p-2 rounded-xl border text-xs transition-all shadow-lg backdrop-blur-xl ${
                showGrid ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300' : 'bg-[#040816]/95 border-cyan-500/35 text-slate-400'
              }`}
            >
              <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            </button>

            {/* Sound toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              className="p-1.5 sm:p-2 rounded-xl bg-[#040816]/95 hover:bg-cyan-950/60 border border-cyan-500/35 text-slate-300 hover:text-white text-xs transition-all shadow-lg backdrop-blur-xl"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />}
            </button>

            {/* Reset Camera */}
            <button
              onClick={handleResetCamera}
              title="Reset Camera View"
              className="p-1.5 sm:p-2 rounded-xl bg-[#040816]/95 hover:bg-cyan-950/60 border border-cyan-500/35 text-slate-300 hover:text-white text-xs transition-all shadow-lg backdrop-blur-xl"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            </button>

            {/* Fit All */}
            <button
              onClick={handleFitAll}
              title="Fit All (Unfocus)"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#040816]/95 hover:bg-cyan-950/60 border border-cyan-500/35 text-slate-300 hover:text-white text-xs font-mono transition-all shadow-lg backdrop-blur-xl flex items-center gap-1.5"
            >
              <Telescope className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Fit All</span>
            </button>

            {/* Fullscreen */}
            <button
              onClick={handleToggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              className="p-1.5 sm:p-2 rounded-xl bg-[#040816]/95 hover:bg-cyan-950/60 border border-cyan-500/35 text-slate-300 hover:text-white text-xs transition-all shadow-lg backdrop-blur-xl"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />}
            </button>

            {/* Keyboard shortcuts */}
            <button
              onClick={() => setShowShortcutsModal(true)}
              title="Keyboard Shortcuts (?)"
              className="p-1.5 sm:p-2 rounded-xl bg-[#040816]/95 hover:bg-cyan-950/60 border border-cyan-500/35 text-slate-300 hover:text-white text-xs transition-all shadow-lg backdrop-blur-xl"
            >
              <Keyboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            </button>
          </div>
        </div>
      )}

      {/* CLEAN RECORDING MODE EXIT BUTTON */}
      {isCleanMode && (
        <button
          onClick={() => setIsCleanMode(false)}
          title="Exit Clean Mode (C)"
          className="absolute top-4 right-4 z-50 p-2 rounded-xl bg-black/60 hover:bg-black/90 border border-white/20 text-slate-400 hover:text-white text-xs font-mono backdrop-blur-md pointer-events-auto"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}

      {/* TOUR MODE OVERLAY (Caliper & End Tour button) */}
      {isTourMode && (
        <>
          <div className="absolute top-16 left-4 z-40 flex items-center gap-2 pointer-events-auto">
            <button
              onClick={handleEndTour}
              title="End Tour (Esc)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#040816]/95 hover:bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:text-white shadow-xl text-xs font-mono font-bold transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-rose-400" />
              <span>End Tour</span>
            </button>

            <button
              onClick={handleRestartTour}
              title="Restart Tour from #1"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#040816]/95 hover:bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:text-white shadow-xl text-xs font-mono font-bold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Restart</span>
            </button>
          </div>

          {/* Cinematic Lower Third */}
          <StageTourHUD
            activeItem={activeItem}
            currentIndex={activeIndex}
            totalItems={sortedItems.length}
            isPlaying={isTourPlaying}
            isCleanMode={isCleanMode}
            onTogglePlay={handleToggleTour}
            onPrev={handlePrevItem}
            onNext={handleNextItem}
            onToggleCleanMode={() => setIsCleanMode(!isCleanMode)}
          />
        </>
      )}

      {/* INTERACTIVE MODE BOTTOM CALIPER & NAVIGATOR (when NOT in Tour Mode) */}
      {!isTourMode && !isCleanMode && (
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex flex-col gap-2 sm:gap-3 pointer-events-none z-20 overflow-hidden">
          {/* FOCUSED OBJECT STRIP with UNFOCUS button */}
          {activeItem && (
            <div className="flex items-center justify-between gap-2 sm:gap-3 bg-[#040816]/95 backdrop-blur-2xl px-3 py-2 rounded-xl border border-cyan-500/40 shadow-xl pointer-events-auto">
              <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] shrink-0" />
                <div className="flex items-center gap-x-2 text-xs font-mono min-w-0 overflow-hidden">
                  <span className="text-white font-bold text-sm truncate">{activeItem.name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 text-[10px] shrink-0">
                    {activeItem.subtitlePills[0] || 'Celestial Body'}
                  </span>
                  <span className="text-cyan-200 font-bold shrink-0">{activeItem.primaryMultiplierText}</span>
                  {activeItem.secondaryMetricText && (
                    <span className="text-amber-300 hidden sm:inline shrink-0">
                      • {activeItem.secondaryMetricText}
                    </span>
                  )}
                  <span className="text-slate-400 hidden md:inline shrink-0">
                    • {Math.round(activeItem.diameterKm).toLocaleString()} km
                  </span>
                </div>
              </div>

              {/* UNFOCUS BUTTON */}
              <button
                onClick={handleUnfocus}
                title="Unfocus Object (Esc)"
                className="px-3 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border border-slate-700 active:scale-95"
              >
                <X className="w-3.5 h-3.5 text-cyan-400" />
                <span>Unfocus</span>
              </button>
            </div>
          )}

          {/* BOTTOM CONTROLS & NAVIGATOR ROW */}
          <div className="flex items-center justify-between gap-2 w-full">
            {/* Left: Navigator (#1, Prev, Counter, Next, #Last) */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-[#040816]/95 backdrop-blur-xl p-1 rounded-xl border border-cyan-500/35 shadow-xl pointer-events-auto font-mono text-xs">
              <button
                onClick={handleFirstItem}
                title="Smallest Body (#1)"
                className="px-2 py-1 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-colors font-bold shrink-0"
              >
                #1
              </button>

              <button
                onClick={handlePrevItem}
                title="Previous Body (Left Arrow)"
                className="p-1 sm:px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/20 active:scale-95 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">Prev</span>
              </button>

              <span className="px-2 text-cyan-300 font-bold border-x border-cyan-500/30 text-[11px] sm:text-xs shrink-0">
                {activeIndex >= 0 ? `${activeIndex + 1} / ${sortedItems.length}` : 'All (Unfocused)'}
              </span>

              <button
                onClick={handleNextItem}
                title="Next Body (Right Arrow)"
                className="p-1 sm:px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/20 active:scale-95 transition-colors flex items-center gap-1"
              >
                <span className="hidden md:inline">Next</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>

              <button
                onClick={handleLastItem}
                title={`Largest Body (#${sortedItems.length})`}
                className="px-2 py-1 rounded-lg text-slate-300 hover:text-amber-300 hover:bg-cyan-500/20 active:scale-95 transition-colors font-bold shrink-0"
              >
                #{sortedItems.length}
              </button>
            </div>

            {/* Right: Search Filter & Zoom In/Out */}
            <div className="flex items-center gap-1.5 pointer-events-auto">
              {/* Zoom In/Out Buttons */}
              <div className="flex items-center bg-[#040816]/95 backdrop-blur-xl p-0.5 rounded-xl border border-cyan-500/35 shadow-xl">
                <button
                  onClick={() => handleZoom('out')}
                  title="Zoom Out"
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/20 font-bold text-sm active:scale-95"
                >
                  −
                </button>
                <button
                  onClick={() => handleZoom('in')}
                  title="Zoom In"
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/20 font-bold text-sm active:scale-95"
                >
                  +
                </button>
              </div>

              {/* Search Bar */}
              {!isSearchActive ? (
                <button
                  onClick={() => setIsSearchActive(true)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-cyan-500/35 bg-[#040816]/95 text-slate-200 hover:text-white hover:border-cyan-400 text-xs font-mono font-semibold backdrop-blur-xl shadow-xl active:scale-95"
                  title={`Search ${sortedItems.length} Bodies`}
                >
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Search ({sortedItems.length})</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-cyan-400 bg-cyan-950/95 text-xs font-mono backdrop-blur-xl shadow-2xl w-48 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setIsSearchActive(false);
                        setSearchQuery('');
                      } else if (e.key === 'Enter' && searchResults.length > 0) {
                        handleFocusItem(searchResults[0]);
                        setIsSearchActive(false);
                      }
                    }}
                    placeholder="Search name..."
                    className="bg-transparent text-white text-xs font-mono placeholder:text-slate-400 focus:outline-none w-full"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-slate-400 hover:text-white p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsSearchActive(false);
                      setSearchQuery('');
                    }}
                    className="text-cyan-400 hover:text-white p-0.5 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* KEYBOARD SHORTCUTS MODAL (?) */}
      {showShortcutsModal && (
        <div
          className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowShortcutsModal(false)}
        >
          <div
            className="bg-[#040816] border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-100 flex flex-col gap-4 font-mono text-xs pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">3D Stage Shortcuts</h3>
              </div>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-300">Previous / Next Body</span>
                <span className="text-cyan-300 font-bold">← / →</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-300">Play / Pause Auto Tour</span>
                <span className="text-cyan-300 font-bold">Space</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-300">Unfocus / End Tour</span>
                <span className="text-cyan-300 font-bold">Esc</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-300">Clean Recording Mode</span>
                <span className="text-cyan-300 font-bold">C</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-300">Orbit View</span>
                <span className="text-cyan-300 font-bold">Left Drag</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-300">Pan View</span>
                <span className="text-cyan-300 font-bold">Right Drag</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-300">Zoom In / Out</span>
                <span className="text-cyan-300 font-bold">Scroll Wheel</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-300">Click Body in 3D</span>
                <span className="text-cyan-300 font-bold">Focus</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
