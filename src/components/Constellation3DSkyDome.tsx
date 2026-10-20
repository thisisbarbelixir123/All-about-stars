import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ConstellationInfo, ConstellationStar } from '../data/constellationsCore';
import { StarData } from '../types';
import { STARS_CATALOG } from '../data/stars';
import { RotateCcw, Play, Pause, Tag, Layers, Crosshair, Sparkles } from 'lucide-react';

interface Constellation3DSkyDomeProps {
  constellation: ConstellationInfo;
  onSelectStar?: (star: StarData) => void;
  className?: string;
}

/**
 * Mathematically converts astronomical Right Ascension (hours) and Declination (degrees)
 * into a 3D unit vector on the celestial sphere.
 */
function raDecToVector3(raHours: number, decDeg: number, radius = 40): THREE.Vector3 {
  const alpha = raHours * (Math.PI / 12.0); // 24h = 2pi
  const delta = decDeg * (Math.PI / 180.0);
  const cosDelta = Math.cos(delta);

  // Standard astronomical celestial coordinate orientation:
  // X = cos(dec) * cos(ra)
  // Y = sin(dec) (North is +Y)
  // Z = cos(dec) * sin(ra)
  return new THREE.Vector3(
    radius * cosDelta * Math.cos(alpha),
    radius * Math.sin(delta),
    radius * cosDelta * Math.sin(alpha)
  );
}

/**
 * Computes points along a Great Circle geodesic on a sphere between two vectors.
 */
function createGreatCirclePoints(v1: THREE.Vector3, v2: THREE.Vector3, segments = 24): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const radius = v1.length();
  const n1 = v1.clone().normalize();
  const n2 = v2.clone().normalize();

  const dot = Math.max(-1, Math.min(1, n1.dot(n2)));
  const omega = Math.acos(dot);

  if (omega < 0.001) {
    return [v1.clone(), v2.clone()];
  }

  const sinOmega = Math.sin(omega);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const w1 = Math.sin((1 - t) * omega) / sinOmega;
    const w2 = Math.sin(t * omega) / sinOmega;
    const pt = new THREE.Vector3()
      .addScaledVector(n1, w1)
      .addScaledVector(n2, w2)
      .normalize()
      .multiplyScalar(radius * 0.998); // Slightly above inner celestial sphere
    points.push(pt);
  }

  return points;
}

export const Constellation3DSkyDome: React.FC<Constellation3DSkyDomeProps> = ({
  constellation,
  onSelectStar,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [isRotating, setIsRotating] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showGridLines, setShowGridLines] = useState(true);
  const [hoveredStar, setHoveredStar] = useState<{
    name: string;
    bayer?: string;
    mag?: number;
    catalogStar?: StarData | null;
    screenX: number;
    screenY: number;
  } | null>(null);

  // Compute celestial center of the constellation for camera targeting
  const constellationCenter = useMemo(() => {
    const stars = constellation.shape.stars;
    if (!stars || stars.length === 0) return new THREE.Vector3(0, 0, 40);

    let sumX = 0, sumY = 0, sumZ = 0;
    for (const s of stars) {
      const v = raDecToVector3(s.ra, s.dec, 40);
      sumX += v.x;
      sumY += v.y;
      sumZ += v.z;
    }
    const len = Math.hypot(Math.hypot(sumX, sumY), sumZ);
    if (len < 0.001) return new THREE.Vector3(0, 0, 40);
    return new THREE.Vector3(sumX / len, sumY / len, sumZ / len).multiplyScalar(40);
  }, [constellation]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020512);
    sceneRef.current = scene;

    // 2. Camera setup - Positioned inside observing toward the constellation center
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 2;
    controls.maxDistance = 55;
    controls.rotateSpeed = 0.6;
    controlsRef.current = controls;

    // Initial camera position looking outward towards the constellation stars on the sphere
    const targetDir = constellationCenter.clone().normalize();
    camera.position.set(0, 0, 0);
    controls.target.copy(constellationCenter);
    // Move camera slightly back from center for panoramic dome view
    camera.position.copy(targetDir).multiplyScalar(-16);
    controls.update();

    // 5. Build 3D Celestial Starry Backdrop (ambient background stars)
    const starCount = 1200;
    const bgStarGeo = new THREE.BufferGeometry();
    const bgStarPos = new Float32Array(starCount * 3);
    const bgStarColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Random points on celestial sphere of radius 45
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 44 + Math.random() * 2;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      bgStarPos[i * 3] = x;
      bgStarPos[i * 3 + 1] = y;
      bgStarPos[i * 3 + 2] = z;

      // Realistic faint stellar color distribution
      const tint = Math.random();
      if (tint > 0.8) {
        bgStarColors[i * 3] = 0.7; bgStarColors[i * 3 + 1] = 0.85; bgStarColors[i * 3 + 2] = 1.0; // blue
      } else if (tint > 0.5) {
        bgStarColors[i * 3] = 1.0; bgStarColors[i * 3 + 1] = 0.95; bgStarColors[i * 3 + 2] = 0.85; // white
      } else {
        bgStarColors[i * 3] = 1.0; bgStarColors[i * 3 + 1] = 0.8; bgStarColors[i * 3 + 2] = 0.6; // amber
      }
    }

    bgStarGeo.setAttribute('position', new THREE.BufferAttribute(bgStarPos, 3));
    bgStarGeo.setAttribute('color', new THREE.BufferAttribute(bgStarColors, 3));

    const bgStarMat = new THREE.PointsMaterial({
      size: 1.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    });
    const bgStarPoints = new THREE.Points(bgStarGeo, bgStarMat);
    scene.add(bgStarPoints);

    // 6. Build Celestial Coordinate Grid Lines on the sphere
    const gridGroup = new THREE.Group();
    gridGroup.name = 'celestialGrid';
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x0891b2,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    });

    // Declination Parallels every 15 degrees
    for (let dec = -75; dec <= 75; dec += 15) {
      const rad = dec * (Math.PI / 180.0);
      const y = 39.9 * Math.sin(rad);
      const rRing = 39.9 * Math.cos(rad);
      const ringPts: THREE.Vector3[] = [];
      for (let s = 0; s <= 64; s++) {
        const theta = (s / 64) * Math.PI * 2;
        ringPts.push(new THREE.Vector3(rRing * Math.cos(theta), y, rRing * Math.sin(theta)));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPts);
      gridGroup.add(new THREE.Line(ringGeo, gridMat));
    }

    // Right Ascension Meridians every 2 hours (30 degrees)
    for (let ra = 0; ra < 24; ra += 2) {
      const alpha = ra * (Math.PI / 12.0);
      const meridianPts: THREE.Vector3[] = [];
      for (let s = -32; s <= 32; s++) {
        const dec = (s / 32) * (Math.PI / 2);
        const cosD = Math.cos(dec);
        meridianPts.push(
          new THREE.Vector3(
            39.9 * cosD * Math.cos(alpha),
            39.9 * Math.sin(dec),
            39.9 * cosD * Math.sin(alpha)
          )
        );
      }
      const merGeo = new THREE.BufferGeometry().setFromPoints(meridianPts);
      gridGroup.add(new THREE.Line(merGeo, gridMat));
    }
    scene.add(gridGroup);

    // 7. Celestial Equator (0° Dec) Highlight Ring
    const eqPts: THREE.Vector3[] = [];
    for (let s = 0; s <= 64; s++) {
      const theta = (s / 64) * Math.PI * 2;
      eqPts.push(new THREE.Vector3(40 * Math.cos(theta), 0, 40 * Math.sin(theta)));
    }
    const eqGeo = new THREE.BufferGeometry().setFromPoints(eqPts);
    const eqMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    scene.add(new THREE.Line(eqGeo, eqMat));

    // 8. Build Constellation Stick Figure Lines (Curved Great Circle Arcs)
    const linesGroup = new THREE.Group();
    const rawStars = constellation.shape.stars;
    const starVectors = rawStars.map((s) => raDecToVector3(s.ra, s.dec, 40));

    // Glow line material for asterism
    const asterismLineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.88,
      linewidth: 2,
    });

    const faintLineMat = new THREE.LineBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.45,
    });

    for (const [fromIdx, toIdx] of constellation.shape.lines) {
      const v1 = starVectors[fromIdx];
      const v2 = starVectors[toIdx];
      if (!v1 || !v2) continue;

      const arcPoints = createGreatCirclePoints(v1, v2, 28);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
      const isCore = constellation.shape.asterismLines?.some(
        ([a, b]) => (a === fromIdx && b === toIdx) || (a === toIdx && b === fromIdx)
      );

      const lineMesh = new THREE.Line(lineGeo, isCore ? asterismLineMat : faintLineMat);
      linesGroup.add(lineMesh);
    }
    scene.add(linesGroup);

    // 9. Build Constellation Glowing Stars
    const starsGroup = new THREE.Group();
    starsGroup.name = 'constellationStars';

    // Interactive star mesh tracking
    const starInteractiveObjects: Array<{
      mesh: THREE.Mesh;
      star: ConstellationStar;
      pos: THREE.Vector3;
      catalogStar: StarData | null;
    }> = [];

    // Helper texture for smooth, non-solid Gaussian star glow halo
    const createGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.18, 'rgba(56, 189, 248, 0.85)');
      grad.addColorStop(0.45, 'rgba(6, 182, 212, 0.4)');
      grad.addColorStop(0.75, 'rgba(3, 105, 161, 0.12)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };
    const glowTexture = createGlowTexture();

    rawStars.forEach((star, idx) => {
      const pos = starVectors[idx];
      const catStar = star.catalogStarId
        ? STARS_CATALOG.find((cs) => cs.id === star.catalogStarId) || null
        : null;

      const apparentMag = catStar ? catStar.apparentMagnitude : star.mag ?? (star.isPrincipal ? 1.5 : 3.5);
      // Brighter stars (lower magnitude) get larger physical radius and more radiant corona
      const brightnessFactor = Math.max(0.6, 3.5 - apparentMag * 0.45);
      const sphereRadius = Math.max(0.35, 0.65 * brightnessFactor);

      // Star Color
      let starColorHex = 0xffffff;
      if (catStar?.colorHex) {
        starColorHex = parseInt(catStar.colorHex.replace('#', '0x'), 16);
      } else if (star.isPrincipal) {
        starColorHex = 0xfef08a;
      }

      // Star Core Sphere
      const starGeo = new THREE.SphereGeometry(sphereRadius, 16, 16);
      const starMat = new THREE.MeshBasicMaterial({
        color: starColorHex,
      });
      const starMesh = new THREE.Mesh(starGeo, starMat);
      starMesh.position.copy(pos);
      starMesh.userData = { star, catalogStar: catStar };
      starsGroup.add(starMesh);

      // Outer Non-Solid Atmospheric Halo (Sprite)
      const spriteMat = new THREE.SpriteMaterial({
        map: glowTexture,
        color: starColorHex,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.copy(pos);
      const spriteScale = sphereRadius * (star.isPrincipal ? 6.5 : 4.5);
      sprite.scale.set(spriteScale, spriteScale, 1);
      starsGroup.add(sprite);

      starInteractiveObjects.push({
        mesh: starMesh,
        star,
        pos,
        catalogStar: catStar,
      });
    });

    scene.add(starsGroup);

    // 10. Raycasting for Star Interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = starInteractiveObjects.map((s) => s.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = starInteractiveObjects.find((s) => s.mesh === intersects[0].object);
        if (hit) {
          container.style.cursor = 'pointer';
          setHoveredStar({
            name: hit.catalogStar?.name || hit.star.name,
            bayer: hit.catalogStar?.bayerDesignation || hit.star.name.match(/\(([^)]+)\)/)?.[1],
            mag: hit.catalogStar?.apparentMagnitude ?? hit.star.mag,
            catalogStar: hit.catalogStar,
            screenX: e.clientX - rect.left,
            screenY: e.clientY - rect.top,
          });
          return;
        }
      }
      container.style.cursor = 'grab';
      setHoveredStar(null);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = starInteractiveObjects.map((s) => s.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = starInteractiveObjects.find((s) => s.mesh === intersects[0].object);
        if (hit && hit.catalogStar && onSelectStar) {
          onSelectStar(hit.catalogStar);
        }
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handleClick);

    // 11. Responsive resize
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 450;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 12. Animation Loop
    let lastTime = performance.now();
    const animate = (time: number) => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Gentle celestial sphere slow drift
      if (isRotating && sceneRef.current) {
        scene.rotation.y += delta * 0.025;
      }

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      controls.dispose();
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [constellation, constellationCenter, isRotating, onSelectStar]);

  const handleResetView = () => {
    if (!controlsRef.current || !cameraRef.current) return;
    const targetDir = constellationCenter.clone().normalize();
    cameraRef.current.position.copy(targetDir).multiplyScalar(-16);
    controlsRef.current.target.copy(constellationCenter);
    controlsRef.current.update();
  };

  return (
    <div className={`relative w-full h-full select-none overflow-hidden ${className}`}>
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Star Tooltip HUD */}
      {hoveredStar && (
        <div
          className="pointer-events-none absolute z-30 transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-1.5 rounded-xl bg-slate-950/95 border border-cyan-400/50 shadow-xl shadow-cyan-950/50 text-center backdrop-blur-md transition-all duration-75"
          style={{ left: hoveredStar.screenX, top: hoveredStar.screenY }}
        >
          <div className="text-xs font-bold text-cyan-200 tracking-wide font-mono">
            {hoveredStar.name}
          </div>
          {hoveredStar.bayer && (
            <div className="text-[10px] text-cyan-400 font-mono font-medium">
              {hoveredStar.bayer}
            </div>
          )}
          {hoveredStar.mag !== undefined && (
            <div className="text-[9px] text-slate-400 font-mono mt-0.5">
              Mag: <span className="text-amber-300 font-semibold">{hoveredStar.mag}</span>
              {hoveredStar.catalogStar && (
                <span className="text-emerald-400 ml-1.5">• Click to Inspect 3D</span>
              )}
            </div>
          )}
          <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-slate-950 border-r border-b border-cyan-400/50 rotate-45" />
        </div>
      )}

      {/* 3D Night Sky On-Screen Overlay HUD Controls */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-800/80 shadow-lg">
        <button
          onClick={() => setIsRotating((prev) => !prev)}
          className={`p-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1 cursor-pointer ${
            isRotating
              ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/40'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
          title={isRotating ? 'Pause Celestial Drift' : 'Play Celestial Drift'}
        >
          {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="text-[10px] hidden sm:inline">{isRotating ? 'Drift' : 'Paused'}</span>
        </button>

        <button
          onClick={handleResetView}
          className="p-1.5 rounded-lg text-xs font-mono bg-slate-900/80 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 border border-slate-800 transition-all flex items-center gap-1 cursor-pointer"
          title="Center on Constellation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[10px] hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Orbit Tip / Perspective Badge */}
      <div className="absolute bottom-3 right-3 z-20 pointer-events-none bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 shadow-lg">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="hidden sm:inline">Drag to Orbit Celestial Dome • Scroll to Zoom</span>
        <span className="sm:hidden">Drag 3D Sky Dome</span>
      </div>
    </div>
  );
};
