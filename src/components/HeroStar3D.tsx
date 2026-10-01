import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { StarData } from '../types';

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

    const baseColor = new THREE.Color(star.colorHex);
    const coronaColor = new THREE.Color(star.coronaColorHex);

    const isPulsar = star.spectralClass === 'NS' || star.name.toLowerCase().includes('pulsar');
    const isBrownDwarf = ['L', 'T', 'Y'].includes(star.spectralClass);

    // High-Fidelity Ultra-Smooth Photosphere Shader
    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: baseColor },
        coronaColor: { value: coronaColor },
        isPulsar: { value: isPulsar ? 1.0 : 0.0 },
        isBrownDwarf: { value: isBrownDwarf ? 1.0 : 0.0 },
        isContactBinary: { value: isContactBinary ? 1.0 : 0.0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vLocalPos;
        varying vec3 vWorldPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vLocalPos = normalize(position);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 baseColor;
        uniform vec3 coronaColor;
        uniform float isPulsar;
        uniform float isBrownDwarf;
        uniform float isContactBinary;
        varying vec3 vNormal;
        varying vec3 vLocalPos;
        varying vec3 vWorldPos;

        // Smooth quintic interpolation polynomial (C2 continuity, zero grid artifacts)
        vec3 quintic(vec3 t) {
          return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
        }

        // Ultra-smooth 3D hash generator
        float hash3D(vec3 p) {
          p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        // Silky smooth 3D value noise with quintic interpolation
        float smoothNoise(vec3 x) {
          vec3 i = floor(x);
          vec3 f = fract(x);
          vec3 u = quintic(f);

          return mix(
            mix(
              mix(hash3D(i + vec3(0.0, 0.0, 0.0)), hash3D(i + vec3(1.0, 0.0, 0.0)), u.x),
              mix(hash3D(i + vec3(0.0, 1.0, 0.0)), hash3D(i + vec3(1.0, 1.0, 0.0)), u.x),
              u.y
            ),
            mix(
              mix(hash3D(i + vec3(0.0, 0.0, 1.0)), hash3D(i + vec3(1.0, 0.0, 1.0)), u.x),
              mix(hash3D(i + vec3(0.0, 1.0, 1.0)), hash3D(i + vec3(1.0, 1.0, 1.0)), u.x),
              u.y
            ),
            u.z
          );
        }

        // Multi-octave Fractal Brownian Motion (FBM) for smooth natural plasma flow
        float fbm(vec3 p) {
          float value = 0.0;
          float amplitude = 0.5;
          vec3 shift = vec3(23.41, 57.19, 11.83);
          for (int i = 0; i < 4; ++i) {
            value += amplitude * smoothNoise(p);
            p = p * 2.02 + shift;
            amplitude *= 0.5;
          }
          return value;
        }

        void main() {
          vec3 viewDir = vec3(0.0, 0.0, 1.0);
          float limb = clamp(dot(vNormal, viewDir), 0.0, 1.0);

          // Authentic Eddington stellar limb darkening curve with soft optical roll-off
          float limbDarkening = pow(limb, 0.46);

          // Coordinates for texture generation (using unified local/world coordinates for continuous flow)
          vec3 samplePos = (isContactBinary > 0.5) ? (vWorldPos * 1.8) : (vLocalPos * 3.2);

          // Domain Warping for fluid convective plasma boiling
          vec3 q = samplePos + vec3(time * 0.06, time * 0.045, time * 0.02);
          float f1 = fbm(q);
          vec3 warpedP = samplePos + vec3(f1 * 0.7, f1 * 0.5, f1 * 0.3) + vec3(time * 0.03, -time * 0.02, time * 0.015);
          float plasma = fbm(warpedP);

          // 1. NEUTRON STARS & PULSARS (Smooth relativistic core & synchrotron halo)
          if (isPulsar > 0.5) {
            vec3 pulsarPos = vLocalPos * 3.8 + vec3(0.0, time * 0.12, 0.0);
            float pulsarNoise = fbm(pulsarPos);
            vec3 core = mix(baseColor * 0.95, vec3(0.92, 0.97, 1.0), pulsarNoise * 0.55 + 0.25);
            core *= (0.58 + 0.42 * limbDarkening);

            float fresnelPulsar = pow(1.0 - limb, 2.6);
            core += coronaColor * fresnelPulsar * 0.95;

            gl_FragColor = vec4(core, 1.0);
            return;
          }

          // 2. SUBSTELLAR BROWN DWARFS (Smooth Jovian latitudinal jet-stream bands)
          if (isBrownDwarf > 0.5) {
            float y = vLocalPos.y;
            float lon = atan(vLocalPos.z, vLocalPos.x);
            float zonal = sin(y * 7.0) * 0.35;
            float dynamicLon = lon + time * 0.04 + zonal;

            float band1 = sin(y * 16.0 + smoothNoise(vec3(dynamicLon * 2.2, y * 4.0, time * 0.02)) * 1.4);
            float band2 = sin(y * 38.0 + smoothNoise(vec3(dynamicLon * 4.0, y * 8.0, 1.2)) * 0.9);
            float bands = band1 * 0.6 + band2 * 0.4;

            vec3 colDark = baseColor * 0.70;
            vec3 colBright = mix(baseColor * 1.20, coronaColor, 0.35);
            vec3 surface = mix(colDark, colBright, bands * 0.5 + 0.5);

            surface *= (0.42 + 0.58 * limbDarkening);
            surface += coronaColor * pow(1.0 - limb, 3.8) * 0.25;

            gl_FragColor = vec4(surface, 1.0);
            return;
          }

          // 3. MAIN SEQUENCE, GIANTS, HYPERGIANTS, WHITE DWARFS & CONTACT BINARIES (VFTS 352)
          // Silky smooth incandescent photosphere with fluid convective boiling cells
          vec3 deepCore = baseColor * 0.88;
          vec3 brightSurface = mix(baseColor * 1.15, vec3(1.0, 0.99, 0.97), 0.48);
          vec3 hotFaculae = mix(coronaColor * 1.25, vec3(1.0, 1.0, 1.0), 0.65);

          vec3 stellarPlasma = mix(deepCore, brightSurface, plasma);
          stellarPlasma = mix(stellarPlasma, hotFaculae, smoothstep(0.58, 0.86, plasma) * 0.42);

          // For VFTS 352: enhance searing luminous O-type radiance along the conjoined bridge
          if (isContactBinary > 0.5) {
            stellarPlasma = mix(stellarPlasma, vec3(0.92, 0.96, 1.0), 0.18);
          }

          stellarPlasma *= (0.48 + 0.52 * limbDarkening);

          // Soft volumetric corona Fresnel radiance at perimeter
          float fresnel = pow(1.0 - limb, 3.2);
          stellarPlasma += coronaColor * fresnel * 0.82;

          gl_FragColor = vec4(stellarPlasma, 1.0);
        }
      `,
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
