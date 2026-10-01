import * as THREE from 'three';

export interface SolarSystemBody {
  name: string;
  semiMajorAxisAU: number; // a in AU
  eccentricity: number;    // e
  inclinationDeg: number;  // i (degrees)
  ascendingNodeDeg: number;// Ω (degrees)
  argPerihelionDeg: number;// ω (degrees)
  orbitalPeriodYears: number; // orbital period in Earth years
  speed: number;           // visual animation speed multiplier
  color: string;
  radius3D: number;
  classification: 'Major Planet' | 'Dwarf Planet' | 'Minor Planet';
  isDwarfPlanet?: boolean;
  isMinorPlanet?: boolean;
  subtype?: string;
  isEarth?: boolean;
  hasRings?: boolean;
  description: string;
  perihelionAU: number;    // a * (1 - e)
  aphelionAU: number;      // a * (1 + e)
}

/**
 * Astronomical Keplerian orbital configurations for Solar System bodies.
 * Data sourced from NASA JPL Solar System Dynamics (SSD) ephemeris database.
 * Dwarf planets and minor planets feature their true, highly inclined and eccentric orbits.
 */
export const SOLAR_SYSTEM_BODIES: SolarSystemBody[] = [
  // 1. Mercury
  {
    name: 'Mercury',
    semiMajorAxisAU: 0.3871,
    eccentricity: 0.2056,
    inclinationDeg: 7.00,
    ascendingNodeDeg: 48.33,
    argPerihelionDeg: 29.12,
    orbitalPeriodYears: 0.241,
    speed: 4.15,
    color: '#94a3b8',
    radius3D: 0.22,
    classification: 'Major Planet',
    perihelionAU: 0.307,
    aphelionAU: 0.467,
    description: 'Innermost rocky terrestrial world with an eccentric 7° inclined orbit.',
  },
  // 2. Venus
  {
    name: 'Venus',
    semiMajorAxisAU: 0.7233,
    eccentricity: 0.0068,
    inclinationDeg: 3.39,
    ascendingNodeDeg: 76.68,
    argPerihelionDeg: 54.88,
    orbitalPeriodYears: 0.615,
    speed: 1.62,
    color: '#facc15',
    radius3D: 0.32,
    classification: 'Major Planet',
    perihelionAU: 0.718,
    aphelionAU: 0.728,
    description: 'Volcanic sister planet with an almost perfectly circular orbit.',
  },
  // 3. Earth
  {
    name: 'Earth',
    semiMajorAxisAU: 1.0000,
    eccentricity: 0.0167,
    inclinationDeg: 0.00, // Reference Ecliptic Plane
    ascendingNodeDeg: 0.00,
    argPerihelionDeg: 102.9,
    orbitalPeriodYears: 1.000,
    speed: 1.00,
    color: '#38bdf8',
    radius3D: 0.34,
    isEarth: true,
    classification: 'Major Planet',
    perihelionAU: 0.983,
    aphelionAU: 1.017,
    description: 'Cradle of humanity and defining reference plane for the ecliptic.',
  },
  // 4. Mars
  {
    name: 'Mars',
    semiMajorAxisAU: 1.5237,
    eccentricity: 0.0934,
    inclinationDeg: 1.85,
    ascendingNodeDeg: 49.56,
    argPerihelionDeg: 286.5,
    orbitalPeriodYears: 1.881,
    speed: 0.53,
    color: '#f87171',
    radius3D: 0.26,
    classification: 'Major Planet',
    perihelionAU: 1.381,
    aphelionAU: 1.666,
    description: 'Red planet whose eccentric orbit historically prompted Kepler’s laws of planetary motion.',
  },
  // 5. Vesta (Minor Planet - Main Asteroid Belt)
  {
    name: 'Vesta',
    semiMajorAxisAU: 2.3615,
    eccentricity: 0.0886,
    inclinationDeg: 7.14,
    ascendingNodeDeg: 103.81,
    argPerihelionDeg: 150.73,
    orbitalPeriodYears: 3.63,
    speed: 0.28,
    color: '#e2e8f0',
    radius3D: 0.16,
    isMinorPlanet: true,
    classification: 'Minor Planet',
    subtype: 'Main Belt Asteroid',
    perihelionAU: 2.152,
    aphelionAU: 2.571,
    description: 'Second-most massive asteroid in the main belt, visited by NASA Dawn spacecraft with giant Rheasilvia crater.',
  },
  // 6. Ceres (Dwarf Planet)
  {
    name: 'Ceres',
    semiMajorAxisAU: 2.7675,
    eccentricity: 0.0758,
    inclinationDeg: 10.59,
    ascendingNodeDeg: 80.33,
    argPerihelionDeg: 73.60,
    orbitalPeriodYears: 4.604,
    speed: 0.21,
    color: '#cbd5e1',
    radius3D: 0.18,
    isDwarfPlanet: true,
    classification: 'Dwarf Planet',
    subtype: 'Asteroid Belt Dwarf Planet',
    perihelionAU: 2.558,
    aphelionAU: 2.977,
    description: 'Largest body in the asteroid belt, tilted 10.6° above the main belt plane.',
  },
  // 7. Jupiter
  {
    name: 'Jupiter',
    semiMajorAxisAU: 5.2044,
    eccentricity: 0.0484,
    inclinationDeg: 1.30,
    ascendingNodeDeg: 100.46,
    argPerihelionDeg: 273.87,
    orbitalPeriodYears: 11.862,
    speed: 0.084,
    color: '#fb923c',
    radius3D: 0.85,
    classification: 'Major Planet',
    perihelionAU: 4.952,
    aphelionAU: 5.456,
    description: 'Gas giant king gravitationally clearing the Main Asteroid Belt.',
  },
  // 8. Saturn
  {
    name: 'Saturn',
    semiMajorAxisAU: 9.5826,
    eccentricity: 0.0542,
    inclinationDeg: 2.49,
    ascendingNodeDeg: 113.67,
    argPerihelionDeg: 339.39,
    orbitalPeriodYears: 29.457,
    speed: 0.034,
    color: '#fde047',
    radius3D: 0.72,
    hasRings: true,
    classification: 'Major Planet',
    perihelionAU: 9.063,
    aphelionAU: 10.102,
    description: 'Majestic ringed gas giant orbiting just under 10 AU.',
  },
  // 9. Chiron (Minor Planet - Centaur)
  {
    name: 'Chiron',
    semiMajorAxisAU: 13.670,
    eccentricity: 0.3831,
    inclinationDeg: 6.92,
    ascendingNodeDeg: 209.34,
    argPerihelionDeg: 339.63,
    orbitalPeriodYears: 50.51,
    speed: 0.020,
    color: '#a3e635',
    radius3D: 0.17,
    isMinorPlanet: true,
    classification: 'Minor Planet',
    subtype: 'Centaur (Saturn–Uranus Crosser)',
    perihelionAU: 8.433,
    aphelionAU: 18.907,
    description: 'Prototypical icy Centaur crossing between Saturn and Uranus with cometary outgassing and suspected ring system.',
  },
  // 10. Uranus
  {
    name: 'Uranus',
    semiMajorAxisAU: 19.2184,
    eccentricity: 0.0472,
    inclinationDeg: 0.77,
    ascendingNodeDeg: 74.01,
    argPerihelionDeg: 96.99,
    orbitalPeriodYears: 84.011,
    speed: 0.012,
    color: '#67e8f9',
    radius3D: 0.52,
    classification: 'Major Planet',
    perihelionAU: 18.312,
    aphelionAU: 20.125,
    description: 'Retrograde ice giant orbiting on its side at ~19.2 AU.',
  },
  // 11. Neptune
  {
    name: 'Neptune',
    semiMajorAxisAU: 30.0700,
    eccentricity: 0.0086,
    inclinationDeg: 1.77,
    ascendingNodeDeg: 131.78,
    argPerihelionDeg: 273.19,
    orbitalPeriodYears: 164.79,
    speed: 0.006,
    color: '#60a5fa',
    radius3D: 0.50,
    classification: 'Major Planet',
    perihelionAU: 29.811,
    aphelionAU: 30.329,
    description: 'Outermost major planet marking the boundary of the Kuiper Belt.',
  },
  // 12. Orcus (Minor Planet - Plutino / "Anti-Pluto")
  {
    name: 'Orcus',
    semiMajorAxisAU: 39.419,
    eccentricity: 0.2255,
    inclinationDeg: 20.58,
    ascendingNodeDeg: 268.72,
    argPerihelionDeg: 72.84,
    orbitalPeriodYears: 247.49,
    speed: 0.0041,
    color: '#c084fc',
    radius3D: 0.19,
    isMinorPlanet: true,
    classification: 'Minor Planet',
    subtype: 'Plutino ("Anti-Pluto")',
    perihelionAU: 30.530,
    aphelionAU: 48.308,
    description: 'The "Anti-Pluto": 2:3 resonant Plutino orbiting with opposite phase to Pluto, accompanied by large moon Vanth.',
  },
  // 13. Pluto (Dwarf Planet - Plutino)
  {
    name: 'Pluto',
    semiMajorAxisAU: 39.4820,
    eccentricity: 0.2488,
    inclinationDeg: 17.16,
    ascendingNodeDeg: 110.30,
    argPerihelionDeg: 113.76,
    orbitalPeriodYears: 247.94,
    speed: 0.004,
    color: '#f472b6',
    radius3D: 0.22,
    isDwarfPlanet: true,
    classification: 'Dwarf Planet',
    subtype: 'Plutino Dwarf Planet',
    perihelionAU: 29.658,
    aphelionAU: 49.305,
    description: 'Famous 2:3 resonant Plutino crossing inside Neptune’s orbit at perihelion (29.66 AU) with a dramatic 17.2° inclination.',
  },
  // 14. Haumea (Dwarf Planet)
  {
    name: 'Haumea',
    semiMajorAxisAU: 43.1300,
    eccentricity: 0.1970,
    inclinationDeg: 28.19,
    ascendingNodeDeg: 122.02,
    argPerihelionDeg: 239.04,
    orbitalPeriodYears: 284.12,
    speed: 0.0035,
    color: '#e879f9',
    radius3D: 0.19,
    isDwarfPlanet: true,
    classification: 'Dwarf Planet',
    subtype: 'Classical KBO Dwarf Planet',
    perihelionAU: 34.650,
    aphelionAU: 51.610,
    description: 'Fast-spinning elongated dwarf planet with rings, tilted at a steep 28.2° inclination.',
  },
  // 15. Quaoar (Minor Planet - Classical KBO)
  {
    name: 'Quaoar',
    semiMajorAxisAU: 43.694,
    eccentricity: 0.0396,
    inclinationDeg: 7.99,
    ascendingNodeDeg: 188.80,
    argPerihelionDeg: 153.20,
    orbitalPeriodYears: 288.82,
    speed: 0.0035,
    color: '#38bdf8',
    radius3D: 0.19,
    isMinorPlanet: true,
    classification: 'Minor Planet',
    subtype: 'Classical KBO (Cubewano)',
    perihelionAU: 41.964,
    aphelionAU: 45.424,
    description: 'Dense classical Kuiper Belt object possessing a dense ring system orbiting well beyond its Roche limit.',
  },
  // 16. Makemake (Dwarf Planet)
  {
    name: 'Makemake',
    semiMajorAxisAU: 45.7900,
    eccentricity: 0.1590,
    inclinationDeg: 28.96,
    ascendingNodeDeg: 79.40,
    argPerihelionDeg: 294.83,
    orbitalPeriodYears: 306.21,
    speed: 0.0032,
    color: '#fdba74',
    radius3D: 0.19,
    isDwarfPlanet: true,
    classification: 'Dwarf Planet',
    subtype: 'Classical KBO Dwarf Planet',
    perihelionAU: 38.050,
    aphelionAU: 53.530,
    description: 'Bright classical Kuiper Belt dwarf planet orbiting with a 29.0° tilt to the ecliptic.',
  },
  // 17. Gonggong (Minor Planet / Dwarf Planet Candidate - Resonant TNO)
  {
    name: 'Gonggong',
    semiMajorAxisAU: 67.480,
    eccentricity: 0.5000,
    inclinationDeg: 30.70,
    ascendingNodeDeg: 336.85,
    argPerihelionDeg: 207.50,
    orbitalPeriodYears: 554.32,
    speed: 0.0018,
    color: '#fb923c',
    radius3D: 0.21,
    isMinorPlanet: true,
    classification: 'Minor Planet',
    subtype: 'Resonant TNO (3:10)',
    perihelionAU: 33.740,
    aphelionAU: 101.220,
    description: 'Reddish scattered disc world locked in a 3:10 orbital resonance with Neptune, reaching past 100 AU at aphelion.',
  },
  // 18. Eris (Dwarf Planet - Scattered Disc)
  {
    name: 'Eris',
    semiMajorAxisAU: 67.7810,
    eccentricity: 0.4407,
    inclinationDeg: 44.04,
    ascendingNodeDeg: 35.87,
    argPerihelionDeg: 151.43,
    orbitalPeriodYears: 558.04,
    speed: 0.0018,
    color: '#f1f5f9',
    radius3D: 0.22,
    isDwarfPlanet: true,
    classification: 'Dwarf Planet',
    subtype: 'Scattered Disc Dwarf Planet',
    perihelionAU: 37.910,
    aphelionAU: 97.650,
    description: 'Massive scattered disc dwarf planet on an extreme orbit (e=0.44, i=44.0°) spanning 37.9 AU out to nearly 100 AU.',
  },
  // 19. Sedna (Minor Planet - Extreme TNO / Sednoid)
  {
    name: 'Sedna',
    semiMajorAxisAU: 506.000,
    eccentricity: 0.8498,
    inclinationDeg: 11.93,
    ascendingNodeDeg: 144.55,
    argPerihelionDeg: 311.29,
    orbitalPeriodYears: 11390.0,
    speed: 0.0006,
    color: '#ef4444',
    radius3D: 0.24,
    isMinorPlanet: true,
    classification: 'Minor Planet',
    subtype: 'Sednoid / Detached TNO',
    perihelionAU: 76.000,
    aphelionAU: 936.000,
    description: 'Extreme detached trans-Neptunian object whose gigantic 11,400-year orbit never enters the Kuiper Belt, traveling out to 936 AU into the inner Oort Cloud.',
  },
];

/**
 * Solves Kepler's Equation for Eccentric Anomaly (E):
 * M = E - e * sin(E)
 * Uses high-efficiency Newton-Raphson iteration.
 */
export function solveKepler(meanAnomaly: number, eccentricity: number): number {
  // Normalize M to [0, 2π)
  const TWO_PI = Math.PI * 2;
  const M = ((meanAnomaly % TWO_PI) + TWO_PI) % TWO_PI;
  const e = Math.min(0.999, Math.max(0, eccentricity));

  // Initial estimate
  let E = e > 0.8 ? Math.PI : M;

  for (let i = 0; i < 6; i++) {
    const f = E - e * Math.sin(E) - M;
    const fPrime = 1 - e * Math.cos(E);
    const delta = f / fPrime;
    E -= delta;
    if (Math.abs(delta) < 1e-6) break;
  }

  return E;
}

/**
 * Calculates the 3D Cartesian position in Three.js coordinates for a given
 * celestial body at eccentric anomaly E.
 *
 * Three.js coordinate mapping:
 * - X: ecliptic plane axis
 * - Y: ecliptic north pole (up)
 * - Z: ecliptic plane axis
 * - Origin (0,0,0): Host star / Sun at focal point
 */
export function calculateKeplerianPosition(
  body: SolarSystemBody,
  eccentricAnomaly: number,
  scale: number
): THREE.Vector3 {
  const a = body.semiMajorAxisAU * scale;
  const e = body.eccentricity;
  const E = eccentricAnomaly;

  // 1. Perifocal coordinates in the orbital plane (Sun at origin focus)
  const xOrb = a * (Math.cos(E) - e);
  const zOrb = a * Math.sqrt(1 - e * e) * Math.sin(E);

  // 2. Angular conversions to radians
  const degToRad = Math.PI / 180;
  const omega = body.argPerihelionDeg * degToRad;  // argument of perihelion
  const inc = body.inclinationDeg * degToRad;      // inclination
  const Omega = body.ascendingNodeDeg * degToRad;  // longitude of ascending node

  // 3. Rotation by argument of perihelion (in orbital plane around +Y)
  const cosW = Math.cos(omega);
  const sinW = Math.sin(omega);
  const x1 = xOrb * cosW + zOrb * sinW;
  const y1 = 0;
  const z1 = -xOrb * sinW + zOrb * cosW;

  // 4. Rotation by inclination around line of nodes (X-axis)
  const cosI = Math.cos(inc);
  const sinI = Math.sin(inc);
  const x2 = x1;
  const y2 = -z1 * sinI;
  const z2 = z1 * cosI;

  // 5. Rotation by longitude of ascending node around ecliptic normal (+Y-axis)
  const cosO = Math.cos(Omega);
  const sinO = Math.sin(Omega);
  const xFinal = x2 * cosO + z2 * sinO;
  const yFinal = y2;
  const zFinal = -x2 * sinO + z2 * cosO;

  return new THREE.Vector3(xFinal, yFinal, zFinal);
}

/**
 * Generates an array of 3D points sampling the complete Keplerian orbit.
 */
export function generateKeplerianOrbitPoints(
  body: SolarSystemBody,
  scale: number,
  segments: number = 256
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const step = (Math.PI * 2) / segments;

  for (let i = 0; i <= segments; i++) {
    const E = i * step;
    points.push(calculateKeplerianPosition(body, E, scale));
  }

  return points;
}

/**
 * Generates a smooth, 3D parametric ribbon geometry following the exact
 * 3D Keplerian elliptical trajectory with consistent visual width.
 */
export function generateKeplerianRibbonGeometry(
  body: SolarSystemBody,
  scale: number,
  segments: number = 256
): THREE.BufferGeometry {
  const points = generateKeplerianOrbitPoints(body, scale, segments);
  const degToRad = Math.PI / 180;
  const inc = body.inclinationDeg * degToRad;
  const Omega = body.ascendingNodeDeg * degToRad;

  // Normal vector to the tilted orbital plane:
  // Initial normal is (0, 1, 0)
  // After tilt by inc around X: (0, cos(inc), sin(inc))
  // After rotation by Omega around Y:
  const orbNormal = new THREE.Vector3(
    Math.sin(inc) * Math.sin(Omega),
    Math.cos(inc),
    Math.sin(inc) * Math.cos(Omega)
  ).normalize();

  const vertices: number[] = [];
  const indices: number[] = [];

  const count = points.length - 1; // last point is identical to first
  for (let i = 0; i <= count; i++) {
    const curr = points[i];
    const prev = points[i === 0 ? count - 1 : i - 1];
    const next = points[i === count ? 1 : i + 1];

    // Tangent vector
    const tangent = new THREE.Vector3().subVectors(next, prev).normalize();
    // In-plane ribbon perpendicular vector
    const ribbonWidthDir = new THREE.Vector3().crossVectors(tangent, orbNormal).normalize();

    // Adaptive ribbon thickness scaling smoothly with distance
    const dist = curr.length();
    const halfWidth = Math.max(0.18, dist * 0.0038);

    // Inner vertex
    vertices.push(
      curr.x - ribbonWidthDir.x * halfWidth,
      curr.y - ribbonWidthDir.y * halfWidth,
      curr.z - ribbonWidthDir.z * halfWidth
    );

    // Outer vertex
    vertices.push(
      curr.x + ribbonWidthDir.x * halfWidth,
      curr.y + ribbonWidthDir.y * halfWidth,
      curr.z + ribbonWidthDir.z * halfWidth
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

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}
