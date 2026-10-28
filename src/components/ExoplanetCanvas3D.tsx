import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { CelestialBody } from '../types';
import { StageDisplayableItem } from './stage/types';
import { StageTourHUD } from './stage/StageTourHUD';
import { createContinuousGridMesh, ContinuousGridHandle } from '../utils/continuousGrid';
import { PLANET_VERTEX_SHADER, PLANET_FRAGMENT_SHADER, getThemeIndex } from '../utils/planetShaderUtils';

// 1 unit in Three.js = 1 Earth Diameter (12,742 km)
// Mesh Radius = (Diameter in km / 12,742) * 0.5
export const KM_TO_STAGE_RADIUS = 0.5 / 12742;

interface ExoplanetCanvas3DProps {
  items: CelestialBody[];
  initialIndex?: number;
}

export const ExoplanetCanvas3D: React.FC<ExoplanetCanvas3DProps> = ({ items, initialIndex = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const gridHandleRef = useRef<ContinuousGridHandle | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Active tour state
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCleanMode, setIsCleanMode] = useState<boolean>(false);

  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Camera tweening
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const cameraDesiredPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 3, 8));

  // Current active 3D planet mesh
  const currentPlanetMeshRef = useRef<THREE.Mesh | null>(null);

  // Compute active item display data for the HUD
  const activeItem = items[activeIndex] || null;

  const displayableItem: StageDisplayableItem | null = useMemo(() => {
    if (!activeItem) return null;

    const subtitlePills: string[] = [activeItem.classification];
    if (activeItem.hostSystem) subtitlePills.push(`Host: ${activeItem.hostSystem}`);
    if (activeItem.temperatureK) subtitlePills.push(`${activeItem.temperatureK} K`);
    if (activeItem.discoveryYear && activeItem.discoveryYear > 0) {
      subtitlePills.push(`Discovered: ${activeItem.discoveryYear}`);
    }

    const meshRadius = activeItem.diameterKm * KM_TO_STAGE_RADIUS;

    return {
      id: activeItem.id,
      name: activeItem.name,
      subtitlePills,
      diameterKm: activeItem.diameterKm,
      primaryMultiplierText: `${activeItem.diameterEarth.toFixed(activeItem.diameterEarth < 0.1 ? 4 : 2)} × Earth`,
      secondaryMetricText:
        activeItem.diameterJupiter >= 0.05
          ? `${activeItem.diameterJupiter.toFixed(activeItem.diameterJupiter < 0.1 ? 3 : 2)} × Jupiter`
          : undefined,
      metricLabel: 'DIAMETER',
      meshRadius,
    };
  }, [activeItem]);

  // Texture Loader for official solar system textures
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);

  // Update 3D Planet Mesh when activeIndex changes
  const updatePlanetMesh = useCallback(
    (index: number) => {
      const scene = sceneRef.current;
      if (!scene) return;

      const body = items[index];
      if (!body) return;

      // Clean up previous mesh
      if (currentPlanetMeshRef.current) {
        scene.remove(currentPlanetMeshRef.current);
        if (currentPlanetMeshRef.current.geometry) currentPlanetMeshRef.current.geometry.dispose();
        if (Array.isArray(currentPlanetMeshRef.current.material)) {
          currentPlanetMeshRef.current.material.forEach((m) => m.dispose());
        } else if (currentPlanetMeshRef.current.material) {
          currentPlanetMeshRef.current.material.dispose();
        }
        currentPlanetMeshRef.current = null;
      }

      const radius = Math.max(0.005, body.diameterKm * KM_TO_STAGE_RADIUS);

      // Sphere geometry (higher density for smooth lighting)
      const geometry = new THREE.SphereGeometry(radius, 64, 64);
      let material: THREE.Material;

      if (body.textureSource === 'official' && body.texturePath) {
        // Load official equirectangular texture with graceful fallback
        const texture = textureLoader.load(
          body.texturePath,
          undefined,
          undefined,
          () => {
            // If texture file missing, shader takes over
          }
        );
        material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.8,
          metalness: 0.1,
        });
      } else {
        // Procedural GLSL Shader
        material = new THREE.ShaderMaterial({
          vertexShader: PLANET_VERTEX_SHADER,
          fragmentShader: PLANET_FRAGMENT_SHADER,
          uniforms: {
            time: { value: 0 },
            themeIndex: { value: getThemeIndex(body.textureTheme) },
            temperatureK: { value: body.temperatureK || 300 },
            lightDir: { value: new THREE.Vector3(1.0, 0.4, 0.8).normalize() },
            seed: { value: (body.diameterKm % 100) * 0.13 },
          },
        });
      }

      const mesh = new THREE.Mesh(geometry, material);
      // Place planet bottom tangent to the continuous grid floor (y = 0)
      mesh.position.set(0, radius, 0);
      scene.add(mesh);
      currentPlanetMeshRef.current = mesh;

      // Adjust camera distance based on planet radius
      const targetDist = Math.max(radius * 3.5, 0.8);
      cameraDesiredPosRef.current.set(0, radius * 1.2 + targetDist * 0.25, targetDist);
      cameraTargetRef.current.set(0, radius, 0);
    },
    [items, textureLoader]
  );

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

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.001, 100000);
    camera.position.set(0, 3, 8);
    cameraRef.current = camera;

    // 2. Renderer (Pre-tuned for crisp 60fps presentation)
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Lighting (Sunlight + Ambient fill for deep space realism)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sunLight.position.set(100, 40, 80);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    // 4. Continuous Reference Grid Floor
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
      starPos[i] = (Math.random() - 0.5) * 5000;
      starPos[i + 1] = (Math.random() - 0.5) * 5000;
      starPos[i + 2] = (Math.random() - 0.5) * 5000;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ size: 1.5, color: 0x93c5fd, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Initial planet
    updatePlanetMesh(activeIndexRef.current);

    // Pre-warm shaders
    renderer.compile(scene, camera);

    // 6. Animation Loop (Smooth Lerp Tweening)
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Slowly rotate planet
      if (currentPlanetMeshRef.current) {
        currentPlanetMeshRef.current.rotation.y += delta * 0.25;

        // Update shader uniforms
        if (currentPlanetMeshRef.current.material instanceof THREE.ShaderMaterial) {
          currentPlanetMeshRef.current.material.uniforms.time.value = elapsed;
        }
      }

      // Smooth camera interpolation
      if (cameraRef.current) {
        cameraRef.current.position.lerp(cameraDesiredPosRef.current, delta * 4.0);
        camera.lookAt(cameraTargetRef.current);
      }

      // Grid update
      if (gridHandleRef.current && cameraRef.current) {
        const dist = cameraRef.current.position.distanceTo(cameraTargetRef.current);
        gridHandleRef.current.update(cameraRef.current, dist);
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // Resize handler
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
  }, [updatePlanetMesh]);

  // Update mesh when activeIndex changes
  useEffect(() => {
    updatePlanetMesh(activeIndex);
  }, [activeIndex, updatePlanetMesh]);

  // Tour Auto-advance timer (e.g. 3.5 seconds per planet)
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        if (prev < items.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [isPlaying, items.length]);

  // Keyboard navigation ('C' to clean UI, Space to Play/Pause, Arrows for Prev/Next)
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

  return (
    <div className={`relative w-full h-full select-none overflow-hidden ${isCleanMode ? 'cursor-none' : ''}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Lower-Third Tour HUD */}
      <StageTourHUD
        activeItem={displayableItem}
        currentIndex={activeIndex}
        totalItems={items.length}
        isPlaying={isPlaying}
        isCleanMode={isCleanMode}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onPrev={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
        onNext={() => setActiveIndex((prev) => Math.min(items.length - 1, prev + 1))}
        onToggleCleanMode={() => setIsCleanMode((p) => !p)}
      />
    </div>
  );
};
