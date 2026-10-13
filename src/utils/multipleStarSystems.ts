import * as THREE from 'three';
import {
  MultipleStarSystemData,
  MultipleStarComponent,
  KeplerianOrbitData,
  MULTIPLE_STAR_SYSTEMS,
  STAR_TO_MULTIPLE_SYSTEM_MAP,
  getEffectiveStarCount,
} from '../data/multipleStarSystemsData';
import { solveKepler } from './orbitalUtils';

export {
  MULTIPLE_STAR_SYSTEMS,
  STAR_TO_MULTIPLE_SYSTEM_MAP,
  getEffectiveStarCount,
  type MultipleStarSystemData,
  type MultipleStarComponent,
  type KeplerianOrbitData,
};

export interface ComponentCartesianState {
  componentId: string;
  position: THREE.Vector3;
  velocityKmS: number;
  distanceToBarycenterAU: number;
}

export interface SystemOrbitalTelemetry {
  currentSeparationAU: number;
  currentSeparationKm: number;
  relativeVelocityKmS: number;
  trueAnomalyDeg: number;
  eccentricAnomalyDeg: number;
  meanAnomalyDeg: number;
  orbitalPhasePercent: number; // 0 to 100%
  isNearPeriastron: boolean;
  isNearApastron: boolean;
}

/**
 * Returns the MultipleStarSystemData for a given star ID, or undefined if the star is not in a cataloged multiple system.
 */
export function getMultipleStarSystemForStar(starId: string): MultipleStarSystemData | undefined {
  const systemId = STAR_TO_MULTIPLE_SYSTEM_MAP[starId];
  if (!systemId) return undefined;
  return MULTIPLE_STAR_SYSTEMS.find((sys) => sys.id === systemId);
}

/**
 * Computes an adaptive 3D scene visual scaling factor for the multiple system so that
 * separations (ranging from 0.06 AU for Algol/VFTS to 1000 AU for Castor/Mizar)
 * map to comfortable, visually readable coordinates in Three.js units (around 15 to 45 units).
 */
export function getSystemVisualScale(system: MultipleStarSystemData): {
  auToUnits: number;
  starRadiusScale: number;
  cameraDefaultRadius: number;
} {
  const primaryOrbit = system.orbits[0];
  const a = primaryOrbit ? primaryOrbit.semiMajorAxisAU : 20;
  const maxRadiusSolar = Math.max(...system.components.map((c) => c.radiusSolar || 1));

  let auToUnits = 1.0;
  let starRadiusScale = 1.0;
  let cameraDefaultRadius = 35;

  if (system.id === 'antares-system' || maxRadiusSolar > 300) {
    // Massive supergiant binaries (Antares: a = 224 AU, R = 680 R_sun)
    // Scale orbits so periastron (150 AU) translates to ~37.5 units, while supergiant radius is ~10.2 units.
    // This gives a crisp ~3.6x physical clearance, preventing stars from appearing conjoined!
    auToUnits = 0.25;
    starRadiusScale = 0.015;
    cameraDefaultRadius = 65;
  } else if (system.id === 'eta-carinae-system') {
    // Eta Carinae extreme colliding-wind binary (a = 15.4 AU, R = 120 R_sun, e = 0.90, periastron = 1.54 AU)
    // Scale orbits so periastron is at 4.24 units with primary radius scaled to 0.5 units, giving guaranteed 5.5x physical clearance!
    auToUnits = 2.75;
    starRadiusScale = 0.025;
    cameraDefaultRadius = 55;
  } else if (system.id === 'polaris-system' || (maxRadiusSolar > 30 && a < 30)) {
    // Classical Cepheid/Supergiant tight binaries (Polaris: a = 18.8 AU, R = 37.5 R_sun)
    // Primary radius scaled to 1.0 units with periastron at ~10.0 units, maintaining distinct envelopes.
    auToUnits = 1.35;
    starRadiusScale = 0.08;
    cameraDefaultRadius = 45;
  } else if (a < 0.05) {
    // Ultra-compact contact binaries (e.g. W Ursae Majoris ~0.0165 AU)
    auToUnits = 450.0;
    starRadiusScale = 0.65;
    cameraDefaultRadius = 22;
  } else if (a < 0.2) {
    // Ultra-tight spectroscopic/contact binaries (VFTS 352 ~0.08 AU, Algol inner ~0.062 AU, Spica ~0.12 AU)
    auToUnits = 150.0;
    starRadiusScale = 0.75;
    cameraDefaultRadius = 26;
  } else if (a < 2.0) {
    // Tight giant binaries (Capella ~0.74 AU)
    auToUnits = 25.0;
    starRadiusScale = 0.45;
    cameraDefaultRadius = 32;
  } else if (a < 40.0) {
    // Medium visual binaries (Alpha Centauri AB: 23.5 AU, Sirius: 19.8 AU, Procyon: 14.9 AU)
    auToUnits = 1.15;
    starRadiusScale = 0.85;
    cameraDefaultRadius = 42;
  } else if (a < 150.0) {
    // Wide visual binaries (61 Cygni: 86 AU, Castor AB: 107 AU)
    auToUnits = 0.32;
    starRadiusScale = 0.90;
    cameraDefaultRadius = 55;
  } else {
    // Very wide systems (Mizar AB: 382 AU)
    auToUnits = 0.12;
    starRadiusScale = 0.85;
    cameraDefaultRadius = 75;
  }

  return { auToUnits, starRadiusScale, cameraDefaultRadius };
}

/**
 * Accurately determines if an orbit represents a localized sub-binary
 * orbiting a parent star rather than the central system barycenter.
 */
export function isSubBinaryOrbit(
  orbit: KeplerianOrbitData,
  primaryOrbit: KeplerianOrbitData | undefined
): boolean {
  if (!primaryOrbit || orbit === primaryOrbit) return false;
  if (orbit.orbitsBarycenter) return false;

  // If primaryId is not the central pair's primaryId, it is a sub-binary
  // (e.g. Castor Ba -> Bb, Castor Ca -> Cb, Capella H -> L, Alcor -> Alcor B)
  if (orbit.primaryId !== primaryOrbit.primaryId && orbit.primaryId !== primaryOrbit.secondaryId) {
    return true;
  }

  // If primaryId is the main primary, but semiMajorAxis is much smaller than primary orbit
  // (e.g. Castor Aa -> Ab with a = 0.11 AU vs 107 AU; Mizar Aa -> Ab with a = 0.32 AU vs 382 AU)
  if (orbit.semiMajorAxisAU < (primaryOrbit.semiMajorAxisAU || 1) * 0.25) {
    return true;
  }

  return false;
}

/**
 * Computes an adaptive visual scale (units per AU) for an individual orbit in a multiple star system.
 * Guarantees that sub-binary companions have guaranteed physical clearance from their parent stars,
 * while hierarchical outer companions remain comfortably outside the inner system within the 3D scene viewport.
 */
export function getOrbitVisualScale(
  orbit: KeplerianOrbitData,
  system: MultipleStarSystemData,
  baseAuToUnits: number
): number {
  const primaryOrbit = system.orbits[0];
  if (!primaryOrbit || orbit === primaryOrbit) {
    return baseAuToUnits;
  }

  if (isSubBinaryOrbit(orbit, primaryOrbit)) {
    // Sub-binary orbits around a parent star:
    // Scale so closest approach (periastron) has a guaranteed physical clearance of at least 6.2 units
    const periAU = orbit.semiMajorAxisAU * (1 - Math.min(0.80, orbit.eccentricity));
    return 6.2 / Math.max(0.001, periAU);
  }

  // Hierarchical outer companion around system center of mass:
  // Guarantee outer orbit is placed comfortably outside the inner system
  const innerUnits = (primaryOrbit.semiMajorAxisAU || 1) * baseAuToUnits;
  const targetUnits = Math.min(
    78.0,
    Math.max(innerUnits * 2.2, 32.0 + Math.log10(Math.max(1, orbit.semiMajorAxisAU)) * 8.0)
  );
  return targetUnits / Math.max(0.1, orbit.semiMajorAxisAU);
}

/**
 * Computes the maximum bounding radial visual extent in Three.js units for the multiple star system,
 * taking into account all inner and outer orbits and their eccentricities.
 * Used to expand and dynamically scale the orbital plane grid and camera framing.
 */
export function getSystemVisualExtent(
  system: MultipleStarSystemData,
  baseAuToUnits: number
): number {
  let maxExtent = 22.0;
  if (system.orbits && system.orbits.length > 0) {
    for (const orb of system.orbits) {
      const scale = getOrbitVisualScale(orb, system, baseAuToUnits);
      const aposAU = orb.semiMajorAxisAU * (1 + Math.min(0.95, Math.max(0, orb.eccentricity)));
      const aposUnits = aposAU * scale;
      maxExtent = Math.max(maxExtent, aposUnits * 1.25);
    }
  }
  return Math.max(22.0, maxExtent);
}

/**
 * Calculates 3D Perifocal to Heliocentric/Barycentric rotated coordinates.
 */
function rotatePerifocalTo3D(
  xOrb: number,
  zOrb: number,
  incDeg: number,
  ascNodeDeg: number,
  argPeriDeg: number
): THREE.Vector3 {
  const degToRad = Math.PI / 180;
  const omega = argPeriDeg * degToRad;
  const inc = incDeg * degToRad;
  const Omega = ascNodeDeg * degToRad;

  // 1. In-plane rotation by argument of periastron (ω) around +Y
  const cosW = Math.cos(omega);
  const sinW = Math.sin(omega);
  const x1 = xOrb * cosW - zOrb * sinW;
  const y1 = 0;
  const z1 = xOrb * sinW + zOrb * cosW;

  // 2. Tilt by inclination (i) around line of nodes (X-axis)
  const cosI = Math.cos(inc);
  const sinI = Math.sin(inc);
  const x2 = x1;
  const y2 = z1 * sinI;
  const z2 = z1 * cosI;

  // 3. Rotation by longitude of ascending node (Ω) around ecliptic normal (+Y-axis)
  const cosO = Math.cos(Omega);
  const sinO = Math.sin(Omega);
  const xFinal = x2 * cosO - z2 * sinO;
  const yFinal = y2;
  const zFinal = x2 * sinO + z2 * cosO;

  return new THREE.Vector3(xFinal, yFinal, zFinal);
}

/**
 * Calculates the exact barycentric 3D Cartesian positions and velocities for all stars in the multiple system
 * at a given simulation time t (in simulated years).
 *
 * Conserves center of mass strictly at (0, 0, 0):
 * Primary star semi-major axis: a1 = a * (M2 / (M1 + M2))
 * Secondary star semi-major axis: a2 = a * (M1 / (M1 + M2))
 */
export function calculateMultipleSystemStates(
  system: MultipleStarSystemData,
  simTimeYears: number,
  auToUnits: number
): {
  states: Map<string, ComponentCartesianState>;
  telemetry: SystemOrbitalTelemetry;
  barycenterPos: THREE.Vector3;
} {
  const states = new Map<string, ComponentCartesianState>();
  const barycenterPos = new THREE.Vector3(0, 0, 0);

  const primaryOrbit = system.orbits[0];
  if (!primaryOrbit) {
    return {
      states,
      telemetry: {
        currentSeparationAU: 1,
        currentSeparationKm: 149597870,
        relativeVelocityKmS: 0,
        trueAnomalyDeg: 0,
        eccentricAnomalyDeg: 0,
        meanAnomalyDeg: 0,
        orbitalPhasePercent: 0,
        isNearPeriastron: false,
        isNearApastron: false,
      },
      barycenterPos,
    };
  }

  const comp1 = system.components.find((c) => c.id === primaryOrbit.primaryId) || system.components[0];
  const comp2 = system.components.find((c) => c.id === primaryOrbit.secondaryId) || system.components[1];

  const m1 = Math.max(0.01, comp1.massSolar);
  const m2 = Math.max(0.01, comp2 ? comp2.massSolar : 0.5);
  const totalMass = m1 + m2;

  // Center-of-mass barycentric semi-major axes
  const aTotalAU = primaryOrbit.semiMajorAxisAU;
  const a1AU = aTotalAU * (m2 / totalMass);
  const a2AU = aTotalAU * (m1 / totalMass);

  const e = Math.min(0.99, Math.max(0, primaryOrbit.eccentricity));
  const period = Math.max(0.0001, primaryOrbit.orbitalPeriodYears);

  // Mean anomaly: M = 2π * (t / P)
  const TWO_PI = Math.PI * 2;
  const M = ((simTimeYears / period) * TWO_PI) % TWO_PI;
  const E = solveKepler(M, e);

  // True anomaly (ν) from eccentric anomaly (E):
  // tan(ν/2) = sqrt((1+e)/(1-e)) * tan(E/2)
  const trueAnomaly = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
  const normalizedTrueAnomaly = ((trueAnomaly % TWO_PI) + TWO_PI) % TWO_PI;

  // Star 1 perifocal coordinates around barycenter (in orbital plane)
  const xOrb1 = a1AU * (Math.cos(E) - e);
  const zOrb1 = a1AU * Math.sqrt(1 - e * e) * Math.sin(E);

  // Star 2 perifocal coordinates around barycenter (opposite phase: 180° offset)
  const xOrb2 = -a2AU * (Math.cos(E) - e);
  const zOrb2 = -a2AU * Math.sqrt(1 - e * e) * Math.sin(E);

  // Convert to 3D Three.js space
  const pos1Units = rotatePerifocalTo3D(
    xOrb1 * auToUnits,
    zOrb1 * auToUnits,
    primaryOrbit.inclinationDeg,
    primaryOrbit.ascendingNodeDeg,
    primaryOrbit.argPeriastronDeg
  );

  const pos2Units = rotatePerifocalTo3D(
    xOrb2 * auToUnits,
    zOrb2 * auToUnits,
    primaryOrbit.inclinationDeg,
    primaryOrbit.ascendingNodeDeg,
    primaryOrbit.argPeriastronDeg
  );

  // Compute instantaneous orbital separation in AU:
  // r = a * (1 - e * cos(E))
  const rAU = aTotalAU * (1 - e * Math.cos(E));
  const rKm = rAU * 149597870.7;

  // Instantaneous orbital speed using Vis-Viva equation:
  // v^2 = G * (M1 + M2) * (2/r - 1/a)
  // G * M_sun in AU^3 / yr^2 = 4π^2 -> converted to km/s (1 AU/yr ~ 4.74047 km/s)
  const visVivaAUPerYrSq = 4 * Math.PI * Math.PI * totalMass * (2 / Math.max(0.001, rAU) - 1 / aTotalAU);
  const relVelocityKmS = Math.sqrt(Math.max(0, visVivaAUPerYrSq)) * 4.74047;

  const v1KmS = relVelocityKmS * (m2 / totalMass);
  const v2KmS = relVelocityKmS * (m1 / totalMass);

  states.set(comp1.id, {
    componentId: comp1.id,
    position: pos1Units,
    velocityKmS: v1KmS,
    distanceToBarycenterAU: a1AU * (1 - e * Math.cos(E)),
  });

  if (comp2) {
    states.set(comp2.id, {
      componentId: comp2.id,
      position: pos2Units,
      velocityKmS: v2KmS,
      distanceToBarycenterAU: a2AU * (1 - e * Math.cos(E)),
    });
  }

  // Handle hierarchical third/fourth components if present (e.g. Proxima Centauri, Castor C, Polaris B, Capella H & L)
  if (system.components.length > 2 && system.orbits.length > 1) {
    for (let i = 1; i < system.orbits.length; i++) {
      const outerOrbit = system.orbits[i];
      const outerComp = system.components.find((c) => c.id === outerOrbit.secondaryId);
      if (outerComp) {
        // Distinguish sub-binaries (orbiting parent star) from wide hierarchical orbits (orbiting system barycenter)
        const isSubBinary = isSubBinaryOrbit(outerOrbit, primaryOrbit) && Boolean(
          outerOrbit.primaryId && states.has(outerOrbit.primaryId)
        );

        // Harmonically tuned visual periods:
        // Sub-binaries: 4 graceful revolutions per main binary cycle
        // Wide outer companions: slow, majestic 2.2x main binary cycle
        const visualPeriod = isSubBinary ? period / 4.0 : period * 2.2;
        const outerM = ((simTimeYears / visualPeriod) * TWO_PI) % TWO_PI;
        const outerE = solveKepler(outerM, outerOrbit.eccentricity);

        const outerA = outerOrbit.semiMajorAxisAU;
        const outerScale = getOrbitVisualScale(outerOrbit, system, auToUnits);
        const xOuter = outerA * (Math.cos(outerE) - outerOrbit.eccentricity);
        const zOuter = outerA * Math.sqrt(1 - outerOrbit.eccentricity * outerOrbit.eccentricity) * Math.sin(outerE);

        const relPos = rotatePerifocalTo3D(
          xOuter * outerScale,
          zOuter * outerScale,
          outerOrbit.inclinationDeg,
          outerOrbit.ascendingNodeDeg,
          outerOrbit.argPeriastronDeg
        );

        const parentState = isSubBinary ? states.get(outerOrbit.primaryId) : null;
        const finalPos = parentState
          ? parentState.position.clone().add(relPos)
          : relPos;

        states.set(outerComp.id, {
          componentId: outerComp.id,
          position: finalPos,
          velocityKmS: isSubBinary ? 24.0 : 3.5,
          distanceToBarycenterAU: finalPos.length() / Math.max(0.0001, outerScale),
        });
      }
    }
  }

  const phasePercent = ((M / TWO_PI) * 100);
  const periastronDistAU = aTotalAU * (1 - e);
  const apastronDistAU = aTotalAU * (1 + e);

  const isNearPeriastron = Math.abs(rAU - periastronDistAU) / Math.max(0.01, aTotalAU) < 0.08;
  const isNearApastron = Math.abs(rAU - apastronDistAU) / Math.max(0.01, aTotalAU) < 0.08;

  const telemetry: SystemOrbitalTelemetry = {
    currentSeparationAU: Number(rAU.toFixed(3)),
    currentSeparationKm: Math.round(rKm),
    relativeVelocityKmS: Number(relVelocityKmS.toFixed(1)),
    trueAnomalyDeg: Number(((normalizedTrueAnomaly * 180) / Math.PI).toFixed(1)),
    eccentricAnomalyDeg: Number(((E * 180) / Math.PI).toFixed(1)),
    meanAnomalyDeg: Number(((M * 180) / Math.PI).toFixed(1)),
    orbitalPhasePercent: Number(phasePercent.toFixed(1)),
    isNearPeriastron,
    isNearApastron,
  };

  return { states, telemetry, barycenterPos };
}

/**
 * Calculates 3D Cartesian coordinates for Periastron (E=0) and Apastron (E=π)
 */
export function calculateKeplerianApsisPoints(
  semiMajorAxisAU: number,
  eccentricity: number,
  incDeg: number,
  ascNodeDeg: number,
  argPeriDeg: number,
  auToUnits: number,
  isOppositePhase: boolean = false
): { periastron: THREE.Vector3; apastron: THREE.Vector3 } {
  const e = Math.min(0.99, Math.max(0, eccentricity));
  const sign = isOppositePhase ? -1 : 1;

  // Periastron at E = 0: xOrb = sign * a * (1 - e)
  const xPeri = sign * semiMajorAxisAU * (1 - e);
  const periastron = rotatePerifocalTo3D(
    xPeri * auToUnits,
    0,
    incDeg,
    ascNodeDeg,
    argPeriDeg
  );

  // Apastron at E = π: xOrb = sign * a * (-1 - e)
  const xAph = sign * semiMajorAxisAU * (-1 - e);
  const apastron = rotatePerifocalTo3D(
    xAph * auToUnits,
    0,
    incDeg,
    ascNodeDeg,
    argPeriDeg
  );

  return { periastron, apastron };
}

/**
 * Generates an array of 3D Vector points representing an ellipse around the barycenter.
 */
export function generateBarycentricOrbitPoints(
  semiMajorAxisAU: number,
  eccentricity: number,
  incDeg: number,
  ascNodeDeg: number,
  argPeriDeg: number,
  auToUnits: number,
  isOppositePhase: boolean = false,
  segments: number = 240
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const e = Math.min(0.99, Math.max(0, eccentricity));
  const sign = isOppositePhase ? -1 : 1;
  const step = (Math.PI * 2) / segments;

  for (let i = 0; i <= segments; i++) {
    const E = i * step;
    const xOrb = sign * semiMajorAxisAU * (Math.cos(E) - e);
    const zOrb = sign * semiMajorAxisAU * Math.sqrt(1 - e * e) * Math.sin(E);

    points.push(
      rotatePerifocalTo3D(
        xOrb * auToUnits,
        zOrb * auToUnits,
        incDeg,
        ascNodeDeg,
        argPeriDeg
      )
    );
  }

  return points;
}

/**
 * Creates a smooth, planar 3D BufferGeometry ribbon for an orbit path in Three.js.
 * Strictly calculates the true orbital plane normal to ensure zero pinching or twisting.
 */
export function createOrbitRibbonGeometry(
  points: THREE.Vector3[],
  ribbonWidth: number = 0.18
): THREE.BufferGeometry {
  const count = points.length - 1;
  if (count < 3) return new THREE.BufferGeometry();

  // Compute the true normal to the tilted orbital plane from sampled points
  const p0 = points[0];
  const p1 = points[Math.floor(count / 3)];
  const p2 = points[Math.floor((count * 2) / 3)];

  const v1 = new THREE.Vector3().subVectors(p1, p0);
  const v2 = new THREE.Vector3().subVectors(p2, p0);
  let planeNormal = new THREE.Vector3().crossVectors(v1, v2).normalize();
  if (planeNormal.lengthSq() < 0.001) {
    planeNormal.set(0, 1, 0);
  }

  const vertices: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= count; i++) {
    const curr = points[i];
    const prev = points[i === 0 ? count - 1 : i - 1];
    const next = points[i === count ? 1 : i + 1];

    const tangent = new THREE.Vector3().subVectors(next, prev).normalize();
    // In-plane perpendicular direction (tangent cross planeNormal)
    let widthDir = new THREE.Vector3().crossVectors(tangent, planeNormal).normalize();
    if (widthDir.lengthSq() < 0.001) {
      widthDir.set(1, 0, 0);
    }

    const halfW = ribbonWidth * 0.5;
    vertices.push(
      curr.x - widthDir.x * halfW,
      curr.y - widthDir.y * halfW,
      curr.z - widthDir.z * halfW,
      curr.x + widthDir.x * halfW,
      curr.y + widthDir.y * halfW,
      curr.z + widthDir.z * halfW
    );
  }

  for (let i = 0; i < count; i++) {
    const v0 = i * 2;
    const v1 = i * 2 + 1;
    const v2 = (i + 1) * 2;
    const v3 = (i + 1) * 2 + 1;

    indices.push(v0, v1, v2);
    indices.push(v1, v3, v2);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}
