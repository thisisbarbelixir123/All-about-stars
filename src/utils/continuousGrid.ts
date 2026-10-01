import * as THREE from 'three';

export interface ContinuousGridOptions {
  yLevel?: number;
  baseColor?: number | string;
  majorColor?: number | string;
  superColor?: number | string;
  axisColor?: number | string;
  leftAligned?: boolean;
  leftBound?: number;
  comparisonBounds?: {
    minX?: number;
    maxX?: number;
    minZ?: number;
    maxZ?: number;
  };
}

export interface ContinuousGridHandle {
  mesh: THREE.Object3D;
  update: (camera: THREE.Camera, cameraDistance: number) => void;
  setBounds: (bounds: { minX?: number; maxX?: number; minZ?: number; maxZ?: number }) => void;
  dispose: () => void;
}

/**
 * Continuous, multi-level recursive 10x10 celestial coordinate grid system.
 * 
 * Hierarchy:
 * - Decimal scale tiers span powers of 10 from sub-meter (0.1m) to 100 Terameters (10^11 km).
 * - Omnidirectional 4-quadrant coverage centered directly on camera focus.
 * - Dynamic Recursive Grid: Activates 10x10 subdivisions smoothly when zooming into cells.
 * - Relative-to-Center (RTC) local coordinates eliminate 32-bit floating point precision loss
 *   and prevent white boundary lines from jittering or bugging out at small scales (e.g. 20 km neutron star).
 * - All boundary lines, cell divisions, and master coordinate axes are strictly quantized to
 *   exact integer multiples of scale tiers, ensuring 100% mathematical and optical alignment.
 */
export function createContinuousGridMesh(options: ContinuousGridOptions = {}): ContinuousGridHandle {
  const yLevel = options.yLevel ?? 0;
  const isLeftAligned = options.leftAligned ?? false;
  const leftBoundKm = (options.leftBound ?? 0.0) * 696350.0;

  const currentBounds = {
    minX: options.comparisonBounds?.minX ?? 0,
    maxX: options.comparisonBounds?.maxX ?? 10,
    minZ: options.comparisonBounds?.minZ ?? -5,
    maxZ: options.comparisonBounds?.maxZ ?? 5,
  };

  // Decimal scale tiers in Kilometers (Powers of 10 from 0.1 meter to 100 Tm)
  const SCALES = [
    0.0001,           // 0.1 meter (10 cm)
    0.001,            // 1 meter
    0.01,             // 10 meters
    0.1,              // 100 meters
    1.0,              // 1 km (Base astronomical unit)
    10.0,             // 10 km (Neutron star / Pulsar core scale: 20 km diameter)
    100.0,            // 100 km
    1000.0,           // 1,000 km = 1 Mm (Earth Moon, small white dwarfs)
    10000.0,          // 10,000 km = 10 Mm (Earth diameter: 12.7 Mm)
    100000.0,         // 100,000 km = 100 Mm (Jupiter diameter: 140 Mm)
    1000000.0,        // 1,000,000 km = 1 Gm (Solar diameter: 1.39 Gm)
    10000000.0,       // 10,000,000 km = 10 Gm (Blue supergiant scale)
    100000000.0,      // 100,000,000 km = 100 Gm (Red supergiant / Betelgeuse scale)
    1000000000.0,     // 1,000,000,000 km = 1 Tm (Red hypergiant / Stephenson 2-18 scale)
    10000000000.0,    // 10,000,000,000 km = 10 Tm
    100000000000.0,   // 100,000,000,000 km = 100 Tm
  ];

  const KM_PER_UNIT = 696350.0;
  let currentMajorIdx = -1;

  // Pre-allocated dynamic geometry buffers
  const MAX_MINOR_LINES = 6000;
  const MAX_MAJOR_LINES = 2000;
  const MAX_SUPER_LINES = 1000;
  const MAX_AXIS_LINES = 100;

  const minorPositions = new Float32Array(MAX_MINOR_LINES * 6);
  const majorPositions = new Float32Array(MAX_MAJOR_LINES * 6);
  const superPositions = new Float32Array(MAX_SUPER_LINES * 6);
  const axisPositions = new Float32Array(MAX_AXIS_LINES * 6);

  const minorGeo = new THREE.BufferGeometry();
  const minorPosAttr = new THREE.BufferAttribute(minorPositions, 3);
  minorGeo.setAttribute('position', minorPosAttr);

  const majorGeo = new THREE.BufferGeometry();
  const majorPosAttr = new THREE.BufferAttribute(majorPositions, 3);
  majorGeo.setAttribute('position', majorPosAttr);

  const superGeo = new THREE.BufferGeometry();
  const superPosAttr = new THREE.BufferAttribute(superPositions, 3);
  superGeo.setAttribute('position', superPosAttr);

  const axisGeo = new THREE.BufferGeometry();
  const axisPosAttr = new THREE.BufferAttribute(axisPositions, 3);
  axisGeo.setAttribute('position', axisPosAttr);

  // Optical materials with distinct hierarchical luminance
  // 1. Recursive Subgrid: 10 internal subdivisions inside each cell
  const minorMat = new THREE.LineBasicMaterial({
    color: new THREE.Color(options.baseColor ?? '#0284c7'), // Calm celestial blue
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    depthTest: true,
  });

  // 2. Major Grid: Current active cell borders framing the view
  const majorMat = new THREE.LineBasicMaterial({
    color: new THREE.Color(options.majorColor ?? '#38bdf8'), // Radiant sky cyan
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
    depthTest: true,
  });

  // 3. Super-Major Grid: 10x parent block boundaries ("The White Boundary Lines")
  const superMat = new THREE.LineBasicMaterial({
    color: new THREE.Color(options.superColor ?? '#ffffff'), // Crisp crystalline white
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    depthTest: true,
  });

  // 4. Master Coordinate Axes: Primary cross-hairs X=0 and Z=0
  const axisMat = new THREE.LineBasicMaterial({
    color: new THREE.Color(options.axisColor ?? '#ffffff'), // Electric white coordinate axis
    transparent: true,
    opacity: 0.98,
    depthWrite: false,
    depthTest: true,
  });

  const minorMesh = new THREE.LineSegments(minorGeo, minorMat);
  minorMesh.frustumCulled = false;
  minorMesh.renderOrder = 0;

  const majorMesh = new THREE.LineSegments(majorGeo, majorMat);
  majorMesh.frustumCulled = false;
  majorMesh.renderOrder = 1;

  const superMesh = new THREE.LineSegments(superGeo, superMat);
  superMesh.frustumCulled = false;
  superMesh.renderOrder = 2;

  const axisMesh = new THREE.LineSegments(axisGeo, axisMat);
  axisMesh.frustumCulled = false;
  axisMesh.renderOrder = 3;

  const group = new THREE.Group();
  group.name = 'ContinuousProceduralGrid';
  group.add(minorMesh);
  group.add(majorMesh);
  group.add(superMesh);
  group.add(axisMesh);

  const setBounds = (bounds: { minX?: number; maxX?: number; minZ?: number; maxZ?: number }) => {
    if (bounds.minX !== undefined) currentBounds.minX = bounds.minX;
    if (bounds.maxX !== undefined) currentBounds.maxX = bounds.maxX;
    if (bounds.minZ !== undefined) currentBounds.minZ = bounds.minZ;
    if (bounds.maxZ !== undefined) currentBounds.maxZ = bounds.maxZ;
  };

  const update = (camera: THREE.Camera, cameraDistance: number) => {
    const camPos = camera.position;
    const pCam = camera as THREE.PerspectiveCamera;
    const fov = pCam.fov || 45;
    const fovRad = (fov * Math.PI) / 180.0;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;

    // Ground center in kilometers: project camera ray onto ground plane Y = yLevel
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    let centerKmX = camPos.x * KM_PER_UNIT;
    let centerKmZ = camPos.z * KM_PER_UNIT;
    let distToFocusKm = Math.max(0.000001, cameraDistance) * KM_PER_UNIT;

    if (Math.abs(forward.y) > 0.001) {
      const t = (yLevel - camPos.y) / forward.y;
      if (t > 0 && t < Math.max(0.00001, cameraDistance) * 6.0) {
        centerKmX = (camPos.x + forward.x * t) * KM_PER_UNIT;
        centerKmZ = (camPos.z + forward.z * t) * KM_PER_UNIT;
        distToFocusKm = Math.max(0.000001, t) * KM_PER_UNIT;
      }
    }

    // Physical distance per screen pixel at the focus plane
    const pixelKm = Math.max(1e-10, (distToFocusKm * 2.0 * Math.tan(fovRad * 0.5)) / Math.max(screenH, 200));

    // Determine the active Major scale tier S_major such that a major cell is ~50px to 500px on screen
    // Apply hysteresis to prevent tier flickering during small scale adjustments:
    let majorIdx = currentMajorIdx;
    if (majorIdx < 0 || majorIdx >= SCALES.length) {
      majorIdx = 4;
      for (let i = 0; i < SCALES.length; i++) {
        const sPx = SCALES[i] / pixelKm;
        if (sPx >= 50.0) {
          majorIdx = i;
          break;
        }
      }
    } else {
      const currentCellPx = SCALES[majorIdx] / pixelKm;
      if (currentCellPx < 48.0 && majorIdx < SCALES.length - 1) {
        // Zooming out: cell shrunk below 48px, promote to larger tier
        majorIdx++;
      } else if (currentCellPx > 510.0 && majorIdx > 0) {
        // Zooming in: cell expanded beyond 510px, step down to smaller tier
        majorIdx--;
      }
    }
    majorIdx = Math.max(0, Math.min(SCALES.length - 1, majorIdx));
    currentMajorIdx = majorIdx;

    const sMajor = SCALES[majorIdx];
    const cellPxMajor = sMajor / pixelKm;

    // Continuous logarithmic zoom progress within current tier (0.0 at 50px, 1.0 at 500px)
    const zoomProgress = THREE.MathUtils.clamp(Math.log10(Math.max(1e-5, cellPxMajor / 50.0)), 0.0, 1.0);

    // 1. Recursive Subgrid: smaller cell S_minor = S_major / 10
    // Subgrid lines smoothly fade in as cellPxMinor grows from ~10px to ~50px
    const sMinor = sMajor / 10.0;
    const cellPxMinor = cellPxMajor / 10.0;
    const useRecursiveSubgrid = cellPxMinor >= 8.0;
    const minorFade = THREE.MathUtils.smoothstep(zoomProgress, 0.25, 1.0);
    minorMat.opacity = 0.36 * minorFade;

    // 2. Major Grid (S_major)
    // Opacity smoothly starts from minor level (0.36) at zoomProgress 0.0,
    // rises to full prominence (0.65) by zoomProgress 0.45,
    // and seamlessly transitions towards super-major level (0.88) by zoomProgress 1.0
    const majorWarmup = THREE.MathUtils.smoothstep(zoomProgress, 0.0, 0.45);
    const majorToSuper = THREE.MathUtils.smoothstep(zoomProgress, 0.65, 1.0);
    majorMat.opacity = THREE.MathUtils.lerp(
      THREE.MathUtils.lerp(0.36, 0.65, majorWarmup),
      0.88,
      majorToSuper
    );

    // 3. Super-Major tier: S_super = S_major * 10 (the 10x block boundaries)
    // Starts at 0.88 at zoomProgress 0.0, peaks at 0.92,
    // and smoothly dissolves towards 0.0 as it approaches 1.0 where it exits to the next tier
    const sSuper = sMajor * 10.0;
    const superExitFade = 1.0 - THREE.MathUtils.smoothstep(zoomProgress, 0.65, 1.0);
    superMat.opacity = 0.92 * superExitFade;

    // Compute visible view radius in kilometers around the camera focus point
    const aspect = Math.max(1.0, screenW / screenH);
    const viewSpanKm = distToFocusKm * Math.tan(fovRad * 0.5) * aspect * 2.2;
    // Encompass at least 25 major cells and at least 3 super-major blocks in all 4 directions
    const halfSpanKm = Math.max(viewSpanKm, sMajor * 25.0, sSuper * 3.0);

    let rawMinX = centerKmX - halfSpanKm;
    let rawMaxX = centerKmX + halfSpanKm;
    let rawMinZ = centerKmZ - halfSpanKm;
    let rawMaxZ = centerKmZ + halfSpanKm;

    if (isLeftAligned && options.leftBound !== undefined) {
      if (rawMinX < leftBoundKm) rawMinX = leftBoundKm;
    }

    // STRICT ALIGNMENT: All active grid boundaries snap to exact integer multiples of S_super.
    // Because S_super = 10 * S_major = 100 * S_minor, this guarantees 100% mathematical alignment
    // across minor lines, major lines, and super-major white boundary lines.
    const gridMinX = Math.floor(rawMinX / sSuper) * sSuper;
    const gridMaxX = Math.ceil(rawMaxX / sSuper) * sSuper;
    const gridMinZ = Math.floor(rawMinZ / sSuper) * sSuper;
    const gridMaxZ = Math.ceil(rawMaxZ / sSuper) * sSuper;

    // RELATIVE-TO-CENTER (RTC) LOCAL ORIGIN:
    // Snapping the local origin to a multiple of sSuper keeps all vertex coordinates stored
    // inside the Float32Array tightly bounded near (0,0,0). This eliminates 32-bit floating point
    // precision truncation, preventing line flickering or jitter at small scales (e.g. neutron star).
    const originKmX = Math.round(centerKmX / sSuper) * sSuper;
    const originKmZ = Math.round(centerKmZ / sSuper) * sSuper;

    group.position.set(originKmX / KM_PER_UNIT, yLevel, originKmZ / KM_PER_UNIT);

    // Line drawing buffers helpers (writing RTC coordinates)
    let minorIdx = 0;
    let majorIdxCount = 0;
    let superIdxCount = 0;
    let axisIdx = 0;

    const addMinor = (x1: number, z1: number, x2: number, z2: number) => {
      if (minorIdx + 6 > minorPositions.length) return;
      minorPositions[minorIdx++] = (x1 - originKmX) / KM_PER_UNIT;
      minorPositions[minorIdx++] = 0;
      minorPositions[minorIdx++] = (z1 - originKmZ) / KM_PER_UNIT;
      minorPositions[minorIdx++] = (x2 - originKmX) / KM_PER_UNIT;
      minorPositions[minorIdx++] = 0;
      minorPositions[minorIdx++] = (z2 - originKmZ) / KM_PER_UNIT;
    };

    const addMajor = (x1: number, z1: number, x2: number, z2: number) => {
      if (majorIdxCount + 6 > majorPositions.length) return;
      majorPositions[majorIdxCount++] = (x1 - originKmX) / KM_PER_UNIT;
      majorPositions[majorIdxCount++] = 0;
      majorPositions[majorIdxCount++] = (z1 - originKmZ) / KM_PER_UNIT;
      majorPositions[majorIdxCount++] = (x2 - originKmX) / KM_PER_UNIT;
      majorPositions[majorIdxCount++] = 0;
      majorPositions[majorIdxCount++] = (z2 - originKmZ) / KM_PER_UNIT;
    };

    const addSuper = (x1: number, z1: number, x2: number, z2: number) => {
      if (superIdxCount + 6 > superPositions.length) return;
      superPositions[superIdxCount++] = (x1 - originKmX) / KM_PER_UNIT;
      superPositions[superIdxCount++] = 0;
      superPositions[superIdxCount++] = (z1 - originKmZ) / KM_PER_UNIT;
      superPositions[superIdxCount++] = (x2 - originKmX) / KM_PER_UNIT;
      superPositions[superIdxCount++] = 0;
      superPositions[superIdxCount++] = (z2 - originKmZ) / KM_PER_UNIT;
    };

    const addAxis = (x1: number, z1: number, x2: number, z2: number) => {
      if (axisIdx + 6 > axisPositions.length) return;
      axisPositions[axisIdx++] = (x1 - originKmX) / KM_PER_UNIT;
      axisPositions[axisIdx++] = 0;
      axisPositions[axisIdx++] = (z1 - originKmZ) / KM_PER_UNIT;
      axisPositions[axisIdx++] = (x2 - originKmX) / KM_PER_UNIT;
      axisPositions[axisIdx++] = 0;
      axisPositions[axisIdx++] = (z2 - originKmZ) / KM_PER_UNIT;
    };

    // 1. Super-Major Lines ("The White Boundary Lines" - every 10 major cells)
    // Verticals (varying X, running from gridMinZ to gridMaxZ)
    const superCountX = Math.round((gridMaxX - gridMinX) / sSuper) + 1;
    for (let ix = 0; ix < superCountX; ix++) {
      const x = gridMinX + ix * sSuper;
      addSuper(x, gridMinZ, x, gridMaxZ);
    }

    // Horizontals (varying Z, running from gridMinX to gridMaxX)
    const superCountZ = Math.round((gridMaxZ - gridMinZ) / sSuper) + 1;
    for (let iz = 0; iz < superCountZ; iz++) {
      const z = gridMinZ + iz * sSuper;
      addSuper(gridMinX, z, gridMaxX, z);
    }

    // 2. Major Lines (S_major cyan cell boundaries)
    // Verticals
    const majorCountX = Math.round((gridMaxX - gridMinX) / sMajor) + 1;
    for (let ix = 0; ix < majorCountX; ix++) {
      const x = gridMinX + ix * sMajor;
      // Skip every 10th line as it is already rendered in crisp white superMesh
      if (Math.round(x / sMajor) % 10 === 0) continue;
      addMajor(x, gridMinZ, x, gridMaxZ);
    }

    // Horizontals
    const majorCountZ = Math.round((gridMaxZ - gridMinZ) / sMajor) + 1;
    for (let iz = 0; iz < majorCountZ; iz++) {
      const z = gridMinZ + iz * sMajor;
      if (Math.round(z / sMajor) % 10 === 0) continue;
      addMajor(gridMinX, z, gridMaxX, z);
    }

    // 3. Recursive Subgrid Lines (S_minor = S_major / 10)
    // Only rendered when zoomed into a cell where subcells are visible
    if (useRecursiveSubgrid) {
      const subRadius = Math.min(halfSpanKm, sMajor * 12.0);
      const subMinX = Math.floor((centerKmX - subRadius) / sMajor) * sMajor;
      const subMaxX = Math.ceil((centerKmX + subRadius) / sMajor) * sMajor;
      const subMinZ = Math.floor((centerKmZ - subRadius) / sMajor) * sMajor;
      const subMaxZ = Math.ceil((centerKmZ + subRadius) / sMajor) * sMajor;

      const minorCountX = Math.round((subMaxX - subMinX) / sMinor) + 1;
      for (let ix = 0; ix < minorCountX; ix++) {
        const x = subMinX + ix * sMinor;
        // Skip every 10th line as it aligns with S_major
        if (Math.round(x / sMinor) % 10 === 0) continue;
        addMinor(x, subMinZ, x, subMaxZ);
      }

      const minorCountZ = Math.round((subMaxZ - subMinZ) / sMinor) + 1;
      for (let iz = 0; iz < minorCountZ; iz++) {
        const z = subMinZ + iz * sMinor;
        if (Math.round(z / sMinor) % 10 === 0) continue;
        addMinor(subMinX, z, subMaxX, z);
      }
    }

    // 4. Master Coordinate Axes (X = 0 and Z = 0)
    // Clamped strictly to the active grid extent [gridMinX, gridMaxX] and [gridMinZ, gridMaxZ]
    // so they never extend to infinity or suffer from GPU line clipping artifacts.
    if (gridMinX <= 0 && 0 <= gridMaxX) {
      addAxis(0, gridMinZ, 0, gridMaxZ);
    }
    if (gridMinZ <= 0 && 0 <= gridMaxZ) {
      addAxis(gridMinX, 0, gridMaxX, 0);
    }

    // Notify Three.js of buffer range updates
    minorGeo.setDrawRange(0, minorIdx / 3);
    minorPosAttr.needsUpdate = true;

    majorGeo.setDrawRange(0, majorIdxCount / 3);
    majorPosAttr.needsUpdate = true;

    superGeo.setDrawRange(0, superIdxCount / 3);
    superPosAttr.needsUpdate = true;

    axisGeo.setDrawRange(0, axisIdx / 3);
    axisPosAttr.needsUpdate = true;

    group.visible = (minorIdx > 0 || majorIdxCount > 0 || superIdxCount > 0 || axisIdx > 0);
  };

  const dispose = () => {
    minorGeo.dispose();
    majorGeo.dispose();
    superGeo.dispose();
    axisGeo.dispose();
    minorMat.dispose();
    majorMat.dispose();
    superMat.dispose();
    axisMat.dispose();
  };

  return { mesh: group, update, setBounds, dispose };
}
