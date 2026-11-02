import * as THREE from 'three';
import { CelestialBody } from '../types';

/**
 * Geometric deformation and aspect-ratio metadata for celestial bodies.
 * Handles:
 * - Rotational oblate spheroids (Saturn, Jupiter)
 * - Triaxial ellipsoids (Haumea, tidally distorted hot Jupiters)
 * - Sub-600 km irregular polyhedral bodies (Vesta, Proteus, Mimas, Pallas, Miranda, Hygiea, Enceladus)
 */
export interface BodyGeometryConfig {
  /** Relative scale factors along (x, y, z) axes where 1.0 is standard sphere radius */
  scaleMultiplier: THREE.Vector3;
  /** Y-position adjustment so the flattened bottom remains grounded on the stage floor */
  verticalOffsetFactor: number;
  /** Geometry classification key */
  geometryType: 'sphere' | 'oblate' | 'triaxial' | 'irregular';
}

/**
 * Known astronomical flattening factors: f = (a - c) / a
 * Saturn: f = 0.09796 -> polar/equatorial ratio = 1 - f = 0.90204
 * Jupiter: f = 0.06487 -> polar/equatorial ratio = 1 - f = 0.93513
 */
export const OBLATENESS_PRESETS: Record<string, { x: number; y: number; z: number }> = {
  // Solar System fast rotators
  'sol-saturn': { x: 1.0, y: 0.90204, z: 1.0 },
  'sol-jupiter': { x: 1.0, y: 0.93513, z: 1.0 },
  // Haumea triaxial Jacobi ellipsoid (dimensions: 2,100 km x 1,680 km x 1,074 km)
  // Normalized semi-axes ratio: a:b:c = 1.32 : 1.05 : 0.67
  'sol-haumea': { x: 1.32, y: 0.67, z: 1.05 },
};

/**
 * Sub-600 km irregular Solar System bodies definitions.
 * Triaxial dimensions derived from radar and spacecraft astrometry (Dawn, Cassini, Voyager 2):
 * - Vesta: 572 x 557 x 446 km -> triaxial ratios normalized to mean radius (262.7 km)
 * - Pallas: 568 x 530 x 477 km
 * - Proteus: 424 x 416 x 398 km (boxy polyhedral)
 * - Mimas: 415 x 394 x 381 km (oval ellipsoid + massive Herschel crater)
 * - Miranda: 480 x 468 x 465 km (jumbled extensional fault scarps)
 * - Hygiea: 450 x 430 x 424 km
 * - Enceladus: 513 x 503 x 497 km
 */
export interface IrregularBodyFeature {
  triaxial: { x: number; y: number; z: number };
  noiseRoughness: number;
  craterImpact?: {
    direction: THREE.Vector3; // Direction vector of major impact feature (e.g. Herschel or Rheasilvia)
    radius: number;           // Angular radius of crater basin (radians)
    depth: number;            // Depth depression factor
    rimHeight: number;        // Rim uplift factor
  };
}

export const IRREGULAR_BODIES: Record<string, IrregularBodyFeature> = {
  'sol-vesta': {
    // 572 x 557 x 446 km -> normalized ratios: 1.09, 0.85, 1.06
    triaxial: { x: 1.09, y: 0.85, z: 1.06 },
    noiseRoughness: 0.055,
    craterImpact: {
      // Rheasilvia south polar impact crater (covers ~90% of south pole with central peak)
      direction: new THREE.Vector3(0.08, -0.98, 0.12).normalize(),
      radius: 0.82,
      depth: 0.14,
      rimHeight: 0.06,
    },
  },
  'sol-pallas': {
    // 568 x 530 x 477 km -> 1.08, 0.91, 1.01
    triaxial: { x: 1.08, y: 0.91, z: 1.01 },
    noiseRoughness: 0.065,
  },
  'sol-proteus': {
    // 424 x 416 x 398 km -> heavily faceted, boxy polyhedral
    triaxial: { x: 1.04, y: 0.94, z: 1.02 },
    noiseRoughness: 0.085,
    craterImpact: {
      // Pharos crater
      direction: new THREE.Vector3(0.75, 0.25, 0.61).normalize(),
      radius: 0.65,
      depth: 0.12,
      rimHeight: 0.05,
    },
  },
  'sol-mimas': {
    // 415 x 394 x 381 km -> 1.05, 0.96, 0.99
    triaxial: { x: 1.05, y: 0.96, z: 0.99 },
    noiseRoughness: 0.035,
    craterImpact: {
      // Giant Herschel crater (139 km wide, 1/3 of moon diameter)
      direction: new THREE.Vector3(0.85, 0.15, 0.50).normalize(),
      radius: 0.60,
      depth: 0.16,
      rimHeight: 0.07,
    },
  },
  'sol-miranda': {
    // 480 x 468 x 465 km -> stepped corona scarps
    triaxial: { x: 1.02, y: 0.98, z: 1.00 },
    noiseRoughness: 0.060,
  },
  'sol-hygiea': {
    // 450 x 430 x 424 km -> remarkably spherical for its mass
    triaxial: { x: 1.03, y: 0.97, z: 1.00 },
    noiseRoughness: 0.040,
  },
  'sol-enceladus': {
    // 513 x 503 x 497 km -> south polar depression (tiger stripes basin)
    triaxial: { x: 1.02, y: 0.98, z: 1.00 },
    noiseRoughness: 0.030,
    craterImpact: {
      direction: new THREE.Vector3(0.0, -1.0, 0.0),
      radius: 0.50,
      depth: 0.06,
      rimHeight: 0.02,
    },
  },
};

/**
 * Deterministic PRNG and 3D Perlin/simplex-like noise generator
 * to guarantee identical vertex deformation across all devices and sessions.
 */
function pseudoHash(x: number, y: number, z: number, seed: number): number {
  const p = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164 + seed) * 43758.5453;
  return p - Math.floor(p);
}

function smoothNoise3D(x: number, y: number, z: number, seed: number): number {
  const iX = Math.floor(x);
  const iY = Math.floor(y);
  const iZ = Math.floor(z);

  const fX = x - iX;
  const fY = y - iY;
  const fZ = z - iZ;

  // Cubic Hermite smoothstep interpolation
  const u = fX * fX * (3.0 - 2.0 * fX);
  const v = fY * fY * (3.0 - 2.0 * fY);
  const w = fZ * fZ * (3.0 - 2.0 * fZ);

  const n000 = pseudoHash(iX, iY, iZ, seed);
  const n100 = pseudoHash(iX + 1, iY, iZ, seed);
  const n010 = pseudoHash(iX, iY + 1, iZ, seed);
  const n110 = pseudoHash(iX + 1, iY + 1, iZ, seed);

  const n001 = pseudoHash(iX, iY, iZ + 1, seed);
  const n101 = pseudoHash(iX + 1, iY, iZ + 1, seed);
  const n011 = pseudoHash(iX, iY + 1, iZ + 1, seed);
  const n111 = pseudoHash(iX + 1, iY + 1, iZ + 1, seed);

  const x00 = n000 * (1 - u) + n100 * u;
  const x10 = n010 * (1 - u) + n110 * u;
  const x01 = n001 * (1 - u) + n101 * u;
  const x11 = n011 * (1 - u) + n111 * u;

  const y0 = x00 * (1 - v) + x10 * v;
  const y1 = x01 * (1 - v) + x11 * v;

  return (y0 * (1 - w) + y1 * w) * 2.0 - 1.0;
}

function fractalNoise3D(x: number, y: number, z: number, seed: number, octaves = 3): number {
  let total = 0;
  let frequency = 1.0;
  let amplitude = 1.0;
  let maxAmp = 0;

  for (let i = 0; i < octaves; i++) {
    total += smoothNoise3D(x * frequency, y * frequency, z * frequency, seed + i * 31.7) * amplitude;
    maxAmp += amplitude;
    amplitude *= 0.5;
    frequency *= 2.05;
  }

  return total / maxAmp;
}

/**
 * Creates a unique deformed 3D BufferGeometry for irregular sub-600 km bodies.
 * Deforms a base sphere along its normal vectors with triaxial shaping, facet noise,
 * and authentic impact basin indentations (e.g. Herschel on Mimas, Rheasilvia on Vesta).
 */
export function createIrregularBodyGeometry(bodyId: string): THREE.BufferGeometry {
  const feature = IRREGULAR_BODIES[bodyId] || {
    triaxial: { x: 1.0, y: 1.0, z: 1.0 },
    noiseRoughness: 0.05,
  };

  // Base high-subdivision sphere geometry for smooth crater and facet contouring
  const geo = new THREE.SphereGeometry(1, 48, 48);
  const pos = geo.attributes.position;
  const seed = (bodyId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 1000) * 1.618;

  const v = new THREE.Vector3();
  const dir = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    dir.copy(v).normalize();

    // 1. Triaxial baseline stretching
    v.x *= feature.triaxial.x;
    v.y *= feature.triaxial.y;
    v.z *= feature.triaxial.z;

    // 2. Multi-octave facet noise
    const noise = fractalNoise3D(dir.x * 2.4, dir.y * 2.4, dir.z * 2.4, seed, 3);
    const displacement = 1.0 + noise * feature.noiseRoughness;
    v.multiplyScalar(displacement);

    // 3. Iconic Impact Crater depression (e.g. Herschel on Mimas, Rheasilvia on Vesta)
    if (feature.craterImpact) {
      const angle = dir.angleTo(feature.craterImpact.direction);
      const craterRadius = feature.craterImpact.radius;

      if (angle < craterRadius) {
        const normDist = angle / craterRadius; // 0 at center, 1 at rim
        // Central depression with raised outer rim
        const craterProfile = Math.sin(normDist * Math.PI);
        const rimUplift = Math.exp(-Math.pow((normDist - 1.0) / 0.25, 2)) * feature.craterImpact.rimHeight;
        const basinDepth = (1.0 - Math.pow(normDist, 2.0)) * feature.craterImpact.depth;

        const delta = rimUplift - basinDepth;
        v.addScaledVector(dir, delta);
      }
    }

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Computes the 3D geometry transform parameters for any celestial body.
 * Ensures the bottom pole of the planet remains flush with the comparison floor:
 * floor at Y = 0 => center Y = sc.radius * scaleMultiplier.y.
 */
export function getBodyGeometryConfig(body: CelestialBody): BodyGeometryConfig {
  // 1. Check sub-600 km irregular asteroid/moon bodies
  if (IRREGULAR_BODIES[body.id]) {
    const feat = IRREGULAR_BODIES[body.id];
    return {
      scaleMultiplier: new THREE.Vector3(1.0, 1.0, 1.0), // triaxial shape baked into geometry
      verticalOffsetFactor: feat.triaxial.y,
      geometryType: 'irregular',
    };
  }

  // 2. Check rotational oblate and triaxial presets (Saturn, Jupiter, Haumea)
  const preset = OBLATENESS_PRESETS[body.id];
  if (preset) {
    return {
      scaleMultiplier: new THREE.Vector3(preset.x, preset.y, preset.z),
      verticalOffsetFactor: preset.y,
      geometryType: body.id === 'sol-haumea' ? 'triaxial' : 'oblate',
    };
  }

  // 3. Check for ultra-short period Jovians (P <= 1.2 days or a <= 0.025 AU)
  // experiencing extreme gravitational Roche-lobe tidal distortion (prolate/egg-shaped)
  if (
    (body.classification === 'Jovian' || (body.diameterJupiter && body.diameterJupiter >= 0.8)) &&
    ((body.orbitalPeriodDays && body.orbitalPeriodDays <= 1.2) ||
      (body.semiMajorAxisAU && body.semiMajorAxisAU <= 0.025))
  ) {
    const p = body.orbitalPeriodDays || 1.0;
    const elongation = Math.min(0.18, Math.max(0.06, 0.14 * (1.2 / Math.max(0.5, p))));
    const polarFlattening = Math.min(0.12, Math.max(0.04, 0.08 * (1.2 / Math.max(0.5, p))));

    const sx = +(1.0 + elongation).toFixed(3);
    const sy = +(1.0 - polarFlattening).toFixed(3);
    const sz = +(1.0 - elongation * 0.35).toFixed(3);

    return {
      scaleMultiplier: new THREE.Vector3(sx, sy, sz),
      verticalOffsetFactor: sy,
      geometryType: 'triaxial',
    };
  }

  // 4. Default hydrostatic spherical body
  return {
    scaleMultiplier: new THREE.Vector3(1.0, 1.0, 1.0),
    verticalOffsetFactor: 1.0,
    geometryType: 'sphere',
  };
}
