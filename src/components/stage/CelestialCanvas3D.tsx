import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { StageDisplayableItem } from './types';
import { StageTourHUD } from './StageTourHUD';
import { StageControls } from './StageControls';
import { createContinuousGridMesh, ContinuousGridHandle } from '../../utils/continuousGrid';
import { TourLength } from '../../types';

export const TOUR_DURATION_MAP: Record<TourLength, number> = {
  short: 1800,
  medium: 3500,
  long: 6000,
};

const PROPORTIONAL_GAP_FACTOR = 0.38;

export interface CelestialCanvas3DProps<T extends StageDisplayableItem> {
  items: T[];
  initialIndex?: number;
  renderItemMesh: (item: T, scene: THREE.Scene, onMeshCreated: (mesh: THREE.Object3D) => void) => void;
  onIndexChange?: (index: number) => void;
  customOverlay?: React.ReactNode;
}

export function CelestialCanvas3D<T extends StageDisplayableItem>({
  items,
  initialIndex = 0,
  renderItemMesh,
  onIndexChange,
  customOverlay,
}: CelestialCanvas3DProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const gridHandleRef = useRef<ContinuousGridHandle | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Active tour and view states
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCleanMode, setIsCleanMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [tourLength, setTourLength] = useState<TourLength>('medium');

  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  // Camera tween targets
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const cameraDesiredPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 3, 8));

  // Compute 1:1 true linear side-by-side positions along the X-axis
  const layoutScales = useMemo(() => {
    let currentX = 0;
    const map = new Map<string, { radius: number; xPos: number }>();

    items.forEach((item, idx) => {
      const radius = item.meshRadius;
      if (idx === 0) {
        currentX = radius;
      } else {
        const prevItem = items[idx - 1];
        const prevRadius = prevItem.meshRadius;
        const gap = (prevRadius + radius) * PROPORTIONAL_GAP_FACTOR;
        currentX += prevRadius + radius + gap;
      }

      map.set(item.id, { radius, xPos: currentX });
    });

    return map;
  }, [items]);

  // Window of rendered objects around activeIndex to keep 60fps with 4,000+ objects
  const WINDOW_RADIUS = 30;
  const activeItem = items[activeIndex] || null;

  // Re-build side-by-side 3D meshes around the camera focus
  const updateStageMeshes = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clean up existing meshes marked with userData.isStageObject
    const toRemove: THREE.Object3D[] = [];
    scene.children.forEach((child) => {
      if (child.userData && child.userData.isStageObject) {
        toRemove.push(child);
      }
    });

    toRemove.forEach((child) => {
      scene.remove(child);
      child.traverse((c) => {
        if (c instanceof THREE.Mesh) {
          if (c.geometry) c.geometry.dispose();
          if (Array.isArray(c.material)) c.material.forEach((m) => m.dispose());
          else if (c.material) c.material.dispose();
        }
      });
    });

    const startIdx = Math.max(0, activeIndex - WINDOW_RADIUS);
    const endIdx = Math.min(items.length, activeIndex + WINDOW_RADIUS + 1);

    for (let i = startIdx; i < endIdx; i++) {
      const item = items[i];
      const scaleInfo = layoutScales.get(item.id);
      if (!scaleInfo) continue;

      renderItemMesh(item, scene, (mesh) => {
        mesh.userData.isStageObject = true;
        mesh.userData.itemId = item.id;
        // Positioned side-by-side linearly along X, bottom tangent to Y=0
        mesh.position.set(scaleInfo.xPos, scaleInfo.radius, 0);
        scene.add(mesh);
      });
    }

    // Frame camera on active item
    if (activeItem) {
      const activeScale = layoutScales.get(activeItem.id);
      if (activeScale) {
        const r = activeScale.radius;
        const targetDist = Math.max(r * 4.2, 0.00005);
        cameraDesiredPosRef.current.set(activeScale.xPos, r * 1.25 + targetDist * 0.25, targetDist);
        cameraTargetRef.current.set(activeScale.xPos, r, 0);
      }
    }

    if (onIndexChange) onIndexChange(activeIndex);
  }, [items, activeIndex, layoutScales, activeItem, renderItemMesh, onIndexChange]);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.00001, 500000);
    camera.position.set(0, 3, 8);
    cameraRef.current = camera;

    // 2. High-performance WebGL renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Lighting
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(100, 40, 80);
    scene.add(dirLight);

    const ambLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambLight);

    // 4. Continuous Grid Floor
    const gridHandle = createContinuousGridMesh({
      yLevel: 0,
      baseColor: '#0ea5e9',
      majorColor: '#38bdf8',
    });
    scene.add(gridHandle.mesh);
    gridHandleRef.current = gridHandle;

    // 5. Starfield Background
    const starCount = 4000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 50000;
      starPos[i + 1] = (Math.random() - 0.5) * 50000;
      starPos[i + 2] = (Math.random() - 0.5) * 50000;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ size: 1.5, color: 0x93c5fd, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Mount initial objects
    updateStageMeshes();

    // 6. Animation Loop (Smooth Lerp Panning)
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Axial rotation and shader time updates for visible stage meshes
      scene.children.forEach((child) => {
        if (child.userData && child.userData.isStageObject) {
          child.rotation.y += delta * 0.2;
          child.traverse((c) => {
            if (c instanceof THREE.Mesh && c.material instanceof THREE.ShaderMaterial) {
              if (c.material.uniforms && c.material.uniforms.time) {
                c.material.uniforms.time.value = elapsed;
              }
            }
          });
        }
      });

      // Smooth camera tweening (panning linearly from planet to planet)
      if (cameraRef.current) {
        cameraRef.current.position.lerp(cameraDesiredPosRef.current, delta * 4.0);
        camera.lookAt(cameraTargetRef.current);
      }

      // Update infinite continuous grid relative to camera
      if (gridHandleRef.current && cameraRef.current) {
        const dist = cameraRef.current.position.distanceTo(cameraTargetRef.current);
        gridHandleRef.current.update(cameraRef.current, dist);
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
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
  }, [updateStageMeshes]);

  // Update visible linear stage when activeIndex changes
  useEffect(() => {
    updateStageMeshes();
  }, [activeIndex, updateStageMeshes]);

  // Toggle Grid
  useEffect(() => {
    if (gridHandleRef.current) {
      gridHandleRef.current.mesh.visible = showGrid;
    }
  }, [showGrid]);

  // Tour Auto-advance
  useEffect(() => {
    if (!isPlaying) return;

    const duration = TOUR_DURATION_MAP[tourLength] || 3500;
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        if (prev < items.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, duration);

    return () => clearInterval(timer);
  }, [isPlaying, items.length, tourLength]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'c' || e.key === 'C') {
        setIsCleanMode((prev) => !prev);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => Math.min(items.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length]);

  const handleResetCamera = () => {
    if (activeItem) {
      const activeScale = layoutScales.get(activeItem.id);
      if (activeScale) {
        const r = activeScale.radius;
        const targetDist = Math.max(r * 4.2, 0.00005);
        cameraDesiredPosRef.current.set(activeScale.xPos, r * 1.25 + targetDist * 0.25, targetDist);
        cameraTargetRef.current.set(activeScale.xPos, r, 0);
      }
    }
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
    <div className={`relative w-full h-full select-none overflow-hidden ${isCleanMode ? 'cursor-none' : ''}`}>
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Top Floating Controls */}
      <StageControls
        isCleanMode={isCleanMode}
        isFullscreen={isFullscreen}
        showGrid={showGrid}
        isMuted={isMuted}
        tourLength={tourLength}
        onToggleFullscreen={handleToggleFullscreen}
        onResetCamera={handleResetCamera}
        onToggleGrid={() => setShowGrid((g) => !g)}
        onToggleMute={() => setIsMuted((m) => !m)}
        onChangeTourLength={setTourLength}
      />

      {/* Reusable Lower-Third Tour HUD */}
      <StageTourHUD
        activeItem={activeItem}
        currentIndex={activeIndex}
        totalItems={items.length}
        isPlaying={isPlaying}
        isCleanMode={isCleanMode}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onPrev={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
        onNext={() => setActiveIndex((prev) => Math.min(items.length - 1, prev + 1))}
        onToggleCleanMode={() => setIsCleanMode((p) => !p)}
      />

      {customOverlay}
    </div>
  );
}
