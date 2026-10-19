import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { StarData } from '../types';
import { STAR_VERTEX_SHADER, STAR_FRAGMENT_SHADER, getBrownDwarfType, SPECTRAL_CLASS_MAP, createCoronaShaderMaterial } from '../utils/starShaderUtils';
import { computeD65StellarColor, parseSpectralType } from '../utils/stellarColorsD65';

export interface ActiveStarInfo {
  star: StarData;
  sizePx: number;
  position: { xPercent: number; yPercent: number };
}

interface HeroStar3DProps {
  star: StarData;
  sizePx: number;
  minSize?: number;
  maxSize?: number;
  initialPos: { xPercent: number; yPercent: number };
  containerBoundsRef: React.RefObject<HTMLDivElement>;
  className?: string;
  onInspect?: (star: StarData) => void;
  onCompare?: (star: StarData) => void;
  onResize?: (newSizePx: number) => void;
  onActiveChange?: (info: ActiveStarInfo | null) => void;
  isPlainMode?: boolean;
}

export const HeroStar3D: React.FC<HeroStar3DProps> = ({
  star,
  sizePx: initialSizePx,
  minSize = 40,
  maxSize = 400,
  initialPos,
  containerBoundsRef,
  className = '',
  onInspect,
  onResize,
  onActiveChange,
  isPlainMode = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const [currentSizePx, setCurrentSizePx] = useState<number>(initialSizePx);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState<{ xPercent: number; yPercent: number }>(initialPos);

  // Synchronize when sizePx or initialPos is randomized externally (only if not actively resizing)
  useEffect(() => {
    if (!isResizing) {
      setCurrentSizePx(initialSizePx);
    }
  }, [initialSizePx, isResizing]);

  useEffect(() => {
    setPosition(initialPos);
  }, [initialPos]);

  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialPercentX: number;
    initialPercentY: number;
    hasMoved: boolean;
  }>({
    startX: 0,
    startY: 0,
    initialPercentX: initialPos.xPercent,
    initialPercentY: initialPos.yPercent,
    hasMoved: false,
  });

  const resizeStartRef = useRef<{
    startX: number;
    startY: number;
    initialSize: number;
    centerScreenX: number;
    centerScreenY: number;
  }>({
    startX: 0,
    startY: 0,
    initialSize: initialSizePx,
    centerScreenX: 0,
    centerScreenY: 0,
  });

  // Notify parent on active hover/drag/resize change (disabled in plain mode)
  useEffect(() => {
    if (isPlainMode) return;
    if (isHovered || isDragging || isResizing) {
      onActiveChange?.({
        star,
        sizePx: currentSizePx,
        position,
      });
    } else {
      onActiveChange?.(null);
    }
  }, [isPlainMode, isHovered, isDragging, isResizing, star, currentSizePx, position, onActiveChange]);

  // 3D WebGL Sphere Render (Organic incandescent stellar core without rings or borders)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Crisp high-resolution fixed buffer (400x400) - CSS fluidly scales container at 60/120 FPS with ZERO WebGL recreation
    const bufferRes = 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1.0, 0.1, 100);
    camera.position.z = 2.65;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(bufferRes, bufferRes);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // Strict borderless styling on WebGL Canvas (NO borders, NO outlines, NO rings)
    renderer.domElement.style.borderRadius = '50%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.border = 'none';
    renderer.domElement.style.outline = 'none';
    renderer.domElement.style.boxShadow = 'none';
    renderer.domElement.style.pointerEvents = 'none';

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Identify contact binary stars like VFTS 352
    const isContactBinary =
      star.id === 'vfts-352' ||
      star.stellarStage === 'Contact Binary' ||
      star.name.toLowerCase().includes('conjoined') ||
      star.name.toLowerCase().includes('contact binary');

    const d65 = computeD65StellarColor({
      spectralType: star.spectralType,
      spectralClass: star.spectralClass,
      temperature: star.temperature,
      stellarStage: star.stellarStage,
    });
    const baseColor = new THREE.Color(d65.colorHex);
    const coronaColor = new THREE.Color(d65.coronaColorHex);

    const isPulsar = star.spectralClass === 'NS' || star.name.toLowerCase().includes('pulsar');
    const bdType = getBrownDwarfType(star);
    const { classKey, subclass } = parseSpectralType(star.spectralType, star.spectralClass);
    const spectralClassIndex = SPECTRAL_CLASS_MAP[classKey] ?? 4.0;

    // High-Fidelity Ultra-Smooth Photosphere Shader with Luminous Textures & D65 Chromaticity
    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: baseColor },
        coronaColor: { value: coronaColor },
        temperature: { value: star.temperature || 5778 },
        isPulsar: { value: isPulsar ? 1.0 : 0.0 },
        isContactBinary: { value: isContactBinary ? 1.0 : 0.0 },
        brownDwarfType: { value: bdType },
        densityFactor: { value: 0.0 },
        spectralClassIndex: { value: spectralClassIndex },
        spectralSubclass: { value: subclass },
        hasSpectralData: { value: 1.0 },
      },
      vertexShader: STAR_VERTEX_SHADER,
      fragmentShader: STAR_FRAGMENT_SHADER,
    });

    // Root group to hold single or conjoined star geometry
    const starGroup = new THREE.Group();

    const geometriesToDispose: THREE.BufferGeometry[] = [];

    if (isContactBinary) {
      // VFTS 352 Conjoined ("Kissing") Binary Star System: Two touching stellar lobes sharing a mass bridge
      const lobeRadius = 0.58;
      const lobeOffset = 0.38;

      // Left touching lobe
      const lobeGeoA = new THREE.SphereGeometry(lobeRadius, 48, 48);
      geometriesToDispose.push(lobeGeoA);
      const lobeMeshA = new THREE.Mesh(lobeGeoA, starMaterial);
      lobeMeshA.position.set(-lobeOffset, 0, 0);
      starGroup.add(lobeMeshA);

      // Right touching lobe
      const lobeGeoB = new THREE.SphereGeometry(lobeRadius, 48, 48);
      geometriesToDispose.push(lobeGeoB);
      const lobeMeshB = new THREE.Mesh(lobeGeoB, starMaterial);
      lobeMeshB.position.set(lobeOffset, 0, 0);
      starGroup.add(lobeMeshB);

      // Conjoined mass transfer neck / bridge connecting both touching lobes smoothly
      const bridgeGeo = new THREE.CylinderGeometry(lobeRadius * 0.82, lobeRadius * 0.82, lobeOffset * 2.0, 48);
      bridgeGeo.rotateZ(Math.PI / 2);
      geometriesToDispose.push(bridgeGeo);
      const bridgeMesh = new THREE.Mesh(bridgeGeo, starMaterial);
      starGroup.add(bridgeMesh);
    } else {
      // Natural 3D single star sphere geometry
      const sphereGeo = new THREE.SphereGeometry(1.0, 64, 64);
      geometriesToDispose.push(sphereGeo);
      const starMesh = new THREE.Mesh(sphereGeo, starMaterial);
      starGroup.add(starMesh);
    }

    let coronaMat: THREE.ShaderMaterial | null = null;
    if (bdType < 1.5) {
      coronaMat = createCoronaShaderMaterial(star);
      const coronaGeo = new THREE.SphereGeometry(2.2, 48, 48);
      geometriesToDispose.push(coronaGeo);
      const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
      starGroup.add(coronaMesh);
    }

    scene.add(starGroup);

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth continuous rotational spin on stellar / orbital axis
      starGroup.rotation.y = elapsedTime * 0.22;
      starGroup.rotation.x = 0.12;

      starMaterial.uniforms.time.value = elapsedTime;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      geometriesToDispose.forEach((geo) => geo.dispose());
      starMaterial.dispose();
      if (coronaMat) coronaMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [star.id, star.colorHex, star.coronaColorHex]);

  // Pointer Drag Handlers (Smooth Moveable Star on X and Y axes in the back layer)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isResizing) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const el = dragRef.current;
    if (el) {
      el.setPointerCapture(e.pointerId);
    }

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPercentX: position.xPercent,
      initialPercentY: position.yPercent,
      hasMoved: false,
    };

    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || isResizing) return;

    const container = containerBoundsRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      dragStartRef.current.hasMoved = true;
    }

    const deltaPercentX = (deltaX / rect.width) * 100;
    const deltaPercentY = (deltaY / rect.height) * 100;

    // Full freedom of movement on both X & Y axes across the hero space (0% to 100%)
    const nextX = Math.max(0, Math.min(100, dragStartRef.current.initialPercentX + deltaPercentX));
    const nextY = Math.max(0, Math.min(100, dragStartRef.current.initialPercentY + deltaPercentY));

    const nextPos = { xPercent: nextX, yPercent: nextY };
    setPosition(nextPos);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const el = dragRef.current;
    if (el && el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }

    setIsDragging(false);

    if (!dragStartRef.current.hasMoved && !isResizing) {
      onInspect?.(star);
    }
  };

  // Dedicated Circular Resize Handle Drag Handlers (Min 40px, Max 400px)
  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);

    const el = dragRef.current;
    const rect = el?.getBoundingClientRect();
    const centerX = rect ? rect.left + rect.width / 2 : e.clientX;
    const centerY = rect ? rect.top + rect.height / 2 : e.clientY;

    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialSize: currentSizePx,
      centerScreenX: centerX,
      centerScreenY: centerY,
    };

    setIsResizing(true);
  };

  const handleResizePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isResizing) return;
    e.stopPropagation();

    const { centerScreenX, centerScreenY } = resizeStartRef.current;
    const currentDistance = Math.hypot(e.clientX - centerScreenX, e.clientY - centerScreenY);
    const newDiameter = Math.round(currentDistance * 2);

    // Strictly enforce minimum and maximum bounds
    const clampedSize = Math.max(minSize, Math.min(maxSize, newDiameter));
    setCurrentSizePx(clampedSize);
    onResize?.(clampedSize);
  };

  const handleResizePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isResizing) return;
    e.stopPropagation();

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }

    setIsResizing(false);
  };

  // Mouse wheel resize support for intuitive resizing while hovering over star
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isPlainMode) return;
    e.stopPropagation();
    const delta = -e.deltaY * 0.5;
    const newSize = Math.max(minSize, Math.min(maxSize, Math.round(currentSizePx + delta)));
    setCurrentSizePx(newSize);
    onResize?.(newSize);
  };

  const handleContainerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPlainMode) {
      onInspect?.(star);
      return;
    }
    handlePointerDown(e);
  };

  return (
    <div
      ref={dragRef}
      onPointerDown={handleContainerPointerDown}
      onPointerMove={isPlainMode ? undefined : handlePointerMove}
      onPointerUp={isPlainMode ? undefined : handlePointerUp}
      onWheel={handleWheel}
      onMouseEnter={() => !isPlainMode && setIsHovered(true)}
      onMouseLeave={() => !isPlainMode && setIsHovered(false)}
      style={{
        left: `${position.xPercent}%`,
        top: `${position.yPercent}%`,
        width: currentSizePx,
        height: currentSizePx,
        transform: 'translate(-50%, -50%)',
        touchAction: isPlainMode ? 'auto' : 'none',
        borderRadius: '50%',
      }}
      /* Featured stars stay strictly in the back layer (z-10) behind the hero text & buttons */
      className={`absolute z-10 select-none rounded-full pointer-events-auto border-0 outline-none ring-0 p-0 m-0 ${
        isPlainMode ? 'cursor-pointer active:scale-95 transition-transform' : 'cursor-grab active:cursor-grabbing'
      } ${className}`}
    >
      {/* 1. Volumetric Continuous Glowing Aura (Glows intensely with smooth gaussian falloff, NO rings, NO borders) */}
      <div
        className="absolute rounded-full pointer-events-none transition-opacity duration-300 border-0 outline-none"
        style={{
          width: `${currentSizePx * 2.2}px`,
          height: `${currentSizePx * 2.2}px`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle at center, ${star.colorHex}ee 0%, ${star.colorHex}aa 22%, ${star.coronaColorHex}66 45%, ${star.coronaColorHex}22 68%, transparent 85%)`,
          opacity: isDragging || isResizing ? 1.0 : isHovered ? 0.95 : 0.82,
          filter: `blur(${Math.max(14, currentSizePx * 0.22)}px)`,
          borderRadius: '50%',
        }}
      />

      {/* 2. Concentrated Core Starlight Glow (Intense inner starlight radiance, NO rings) */}
      <div
        className="absolute rounded-full pointer-events-none transition-opacity duration-300 border-0 outline-none"
        style={{
          width: `${currentSizePx * 1.3}px`,
          height: `${currentSizePx * 1.3}px`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle at center, #ffffff 0%, ${star.colorHex} 45%, transparent 75%)`,
          opacity: 0.55,
          filter: `blur(${Math.max(8, currentSizePx * 0.12)}px)`,
          borderRadius: '50%',
        }}
      />

      {/* 3. 3D WebGL Star Sphere (Clean 3D incandescent surface, NO borders, NO rings) */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '0',
          outline: 'none',
        }}
        className="relative z-10 rounded-full border-0 outline-none p-0 m-0"
      />

      {/* Subtle Star Name Badge (in Plain Mode) */}
      {isPlainMode && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono font-bold text-cyan-300 bg-[#040816]/90 px-1.5 py-0.5 rounded border border-cyan-500/30 pointer-events-none shadow-md">
          {star.name}
        </div>
      )}

      {/* 4. Interactive Minimal Resize Knob (Visible only in desktop/tablet interactive mode) */}
      {!isPlainMode && (
        <div
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
          title={`Drag to resize (${minSize}px - ${maxSize}px) or use Mouse Wheel`}
          className={`absolute -bottom-1.5 -right-1.5 z-30 w-7 h-7 rounded-full bg-[#040816] border-2 border-cyan-400 text-cyan-300 hover:text-white hover:bg-cyan-900 cursor-nwse-resize flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.8)] active:scale-110 active:border-white transition-opacity duration-150 ${
            isHovered || isDragging || isResizing ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'
          }`}
          style={{
            touchAction: 'none',
          }}
        >
          <svg className="w-3.5 h-3.5 text-cyan-300 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </div>
      )}
    </div>
  );
};
