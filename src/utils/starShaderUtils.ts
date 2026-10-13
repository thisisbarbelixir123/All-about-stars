import * as THREE from 'three';
import { StarData } from '../types';

// Metric scale conversions in 3D scene space (1 unit = 1 Solar Radius R☉ = 696,350 km)
export const SOLAR_RADIUS_KM = 696350;
export const KM_TO_UNITS = 1 / SOLAR_RADIUS_KM; // ~0.00000143606 units per km
export const GM_TO_UNITS = 1000000 / SOLAR_RADIUS_KM; // ~1.436063 units per Gigameter (1 million km)
export const AU_TO_UNITS = 149597870.7 / SOLAR_RADIUS_KM; // ~214.831 units per AU (149.6 million km)
export const TM_TO_UNITS = 1000000000 / SOLAR_RADIUS_KM; // ~1,436.063 units per Terameter (1 billion km)

// Real physical scale: neutron stars and pulsars are ~20 km in diameter
export const PULSAR_REAL_DIAMETER_KM = 20;
export const PULSAR_3D_FLOOR_KM = 20; // Exact real physical size (20 km)
export const PULSAR_3D_FLOOR_SOLAR = 20 / 1392700; // ~0.0000143606 D☉

export const isPulsarOrNeutronStar = (s: StarData): boolean =>
  s.spectralClass === 'NS' ||
  s.stellarStage?.toLowerCase().includes('pulsar') ||
  s.stellarStage?.toLowerCase().includes('neutron') ||
  s.stellarStage?.toLowerCase().includes('magnetar');

export const isCompactRemnant = (s: StarData): boolean => {
  return isPulsarOrNeutronStar(s) || (s.diameterKm !== undefined && s.diameterKm <= 50000);
};

// Returns exact 1:1 true physical solar diameter for all objects without artificial flooring
export const getEffectiveSolarDiameter = (s: StarData): number => {
  if (s.diameterKm !== undefined && s.diameterKm > 0 && s.diameterKm <= 50000) {
    return s.diameterKm / 1392700;
  }
  return s.diameterSolar;
};

// Helper to identify brown dwarf spectral classes (L, T, Y)
export const getBrownDwarfType = (s: StarData): number => {
  if (s.spectralClass === 'LBV' || s.stellarStage === 'Luminous Blue Variable' || s.spectralType?.includes('LBV')) return 0.0;
  if (s.spectralClass === 'L' || (/^L[0-9]/.test(s.spectralType || ''))) return 1.0; // Class L (faint glow, iron/silicate clouds)
  if (s.spectralClass === 'T' || (/^T[0-9]/.test(s.spectralType || ''))) return 2.0; // Class T (no glow, methane gas giant)
  if (s.spectralClass === 'Y' || (/^Y[0-9]/.test(s.spectralType || ''))) return 3.0; // Class Y (no glow, ultracool ice dwarf)
  if (s.stellarStage === 'Brown Dwarf') {
    if (s.temperature > 1300) return 1.0;
    if (s.temperature > 600) return 2.0;
    return 3.0;
  }
  return 0.0;
};

// Exact Vertex Shader matching StarCanvas3D
export const STAR_VERTEX_SHADER = `
  #include <common>
  #include <logdepthbuf_pars_vertex>
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vLocalPos;
  varying vec2 vUv;
  varying vec3 vViewPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vLocalPos = normal; // Scale-invariant unit sphere vector
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
  }
`;

// Exact Fragment Shader matching StarCanvas3D with plasma FBM, pulsars, Class L/T/Y Brown Dwarfs, and limb darkening
export const STAR_FRAGMENT_SHADER = `
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform float time;
  uniform vec3 baseColor;
  uniform vec3 coronaColor;
  uniform float temperature;
  uniform float isPulsar;
  uniform float isContactBinary;
  uniform float brownDwarfType;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vLocalPos;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  // Smooth quintic interpolation polynomial (C2 continuity, zero grid artifacts)
  vec3 quintic(vec3 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  }

  // Dave Hoskins' float-stable 3D hash generator (zero precision degradation across all float scales)
  float hash3D(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.zyx + 31.32);
    return fract((p.x + p.y) * p.z);
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
    #include <logdepthbuf_fragment>
    vec3 viewDir = normalize(vViewPosition);
    float limb = dot(normalize(vNormal), viewDir);
    limb = clamp(limb, 0.0, 1.0);
    float limbDarkening = pow(limb, 0.46);

    vec3 normPos = normalize(vLocalPos);

    // Dynamic axial spin rotation around the stellar polar Y-axis:
    // Ensures stars visibly rotate their photospheric convection cells, flares, and brown dwarf atmospheric cloud bands!
    float spinAngle = time * 0.15;
    float cosAngle = cos(spinAngle);
    float sinAngle = sin(spinAngle);
    normPos = vec3(
      normPos.x * cosAngle + normPos.z * sinAngle,
      normPos.y,
      -normPos.x * sinAngle + normPos.z * cosAngle
    );

    vec3 samplePos = normPos * 3.2;
    vec3 q = samplePos + vec3(time * 0.04, time * 0.03, time * 0.015);
    float f1 = fbm(q);
    vec3 warpedP = samplePos + vec3(f1 * 0.7, f1 * 0.5, f1 * 0.3) + vec3(time * 0.02, -time * 0.015, time * 0.01);
    float gran = fbm(warpedP);

    // 1. NEUTRON STARS & PULSARS
    if (isPulsar > 0.5) {
      vec3 pulsarPos = normPos * 3.8 + vec3(0.0, time * 0.12, 0.0);
      float granPulsar = fbm(pulsarPos);
      vec3 pulsarCore = mix(baseColor * 0.95, vec3(0.92, 0.97, 1.0), granPulsar * 0.55 + 0.25);
      pulsarCore *= (0.58 + 0.42 * limbDarkening);

      float fresnelPulsar = pow(1.0 - limb, 2.6);
      pulsarCore += coronaColor * fresnelPulsar * 0.95;

      gl_FragColor = vec4(pulsarCore, 1.0);
      return;
    }

    // 2. SUBSTELLAR BROWN DWARFS (Class L, T, Y) - GAS GIANT BANDED ATMOSPHERE
    if (brownDwarfType > 0.5) {
      float y = normPos.y; // -1.0 (South) to +1.0 (North)
      float lon = atan(normPos.z, normPos.x);

      // Zonal differential wind shear (latitudinal jet streams)
      float zonalVelocity = sin(y * 8.0) * 0.40 + sin(y * 16.0) * 0.15;
      float dynamicLon = lon + time * (0.035 + zonalVelocity * 0.05);

      // Multi-scale Jovian cloud banding
      float primaryBands = sin(y * 22.0 + smoothNoise(vec3(dynamicLon * 2.0, y * 4.0, time * 0.02)) * 1.8);
      float secondaryBands = sin(y * 52.0 + smoothNoise(vec3(dynamicLon * 4.0, y * 10.0, 0.8)) * 1.2);
      float fineBelts = sin(y * 110.0 + smoothNoise(vec3(dynamicLon * 8.0, y * 20.0, 1.9)) * 0.8) * 0.5 + 0.5;

      // Turbulent vortices & storm spots
      vec3 stormPos = vec3(dynamicLon * 3.2, y * 7.5, time * 0.025);
      float storms = smoothNoise(stormPos) * 0.6 + smoothNoise(stormPos * 2.4) * 0.3 + smoothNoise(stormPos * 5.0) * 0.1;
      float polarFactor = smoothstep(0.68, 0.98, abs(y));

      if (brownDwarfType < 1.5) {
        // CLASS L (1,300 - 2,400 K): Warm Brown Dwarf with molten iron & silicate rain clouds + FAINT GLOW
        vec3 colBand1 = vec3(0.55, 0.15, 0.08); // Deep crimson
        vec3 colBand2 = vec3(0.26, 0.06, 0.03); // Dark iron belt
        vec3 colBand3 = vec3(0.72, 0.22, 0.10); // Warm glowing amber zone
        vec3 colStorm = vec3(0.88, 0.32, 0.12); // Hot iron-rich storm rift

        float blend1 = primaryBands * 0.5 + 0.5;
        float blend2 = secondaryBands * 0.5 + 0.5;
        vec3 surface = mix(colBand1, colBand2, blend1);
        surface = mix(surface, colBand3, blend2 * 0.6);
        surface = mix(surface, colStorm, smoothstep(0.64, 0.84, storms) * 0.55);
        surface = mix(surface, vec3(0.18, 0.05, 0.02), polarFactor * 0.7);
        surface += fineBelts * 0.05 * vec3(0.4, 0.15, 0.05);

        // Faint thermal glow: deep interior infrared heat leaking through silicate cloud breaks
        float thermalBreak = smoothstep(0.4, 0.8, storms) * (1.0 - blend1 * 0.5);
        vec3 thermalGlow = vec3(0.95, 0.35, 0.12) * thermalBreak * 0.40;

        // Faint limb glow
        surface = surface * (0.65 + 0.35 * limbDarkening) + thermalGlow;
        surface += coronaColor * pow(1.0 - limb, 3.2) * 0.22;

        gl_FragColor = vec4(surface, 1.0);
        return;
      } else if (brownDwarfType < 2.5) {
        // CLASS T (600 - 1,300 K): Methane Brown Dwarf (NOT GLOWING, Gas Giant Jovian Texture)
        // Rich plum, deep magenta, dark aubergine, dusty rose belts
        vec3 colBand1 = vec3(0.38, 0.11, 0.27); // Deep wine magenta
        vec3 colBand2 = vec3(0.17, 0.05, 0.15); // Dark aubergine belt
        vec3 colBand3 = vec3(0.48, 0.16, 0.36); // Methane zone
        vec3 colStorm = vec3(0.62, 0.22, 0.44); // Methane storm vortex

        float blend1 = primaryBands * 0.5 + 0.5;
        float blend2 = secondaryBands * 0.5 + 0.5;
        vec3 surface = mix(colBand1, colBand2, blend1);
        surface = mix(surface, colBand3, blend2 * 0.6);
        surface = mix(surface, colStorm, smoothstep(0.65, 0.85, storms) * 0.45);
        surface = mix(surface, vec3(0.12, 0.04, 0.14), polarFactor * 0.65);
        surface += (fineBelts - 0.5) * 0.08 * vec3(0.3, 0.1, 0.2);

        // Non-glowing matte planetary lighting (diffuse spherical terminator / limb shading)
        surface *= (0.35 + 0.65 * limbDarkening);
        // Subtle gas giant atmospheric haze along perimeter (diffuse, non-emissive)
        surface += vec3(0.24, 0.08, 0.20) * pow(1.0 - limb, 4.2) * 0.25;

        gl_FragColor = vec4(surface, 1.0);
        return;
      } else {
        // CLASS Y (<600 K down to 250 K / -23°C): Ultracool Ice Brown Dwarf (NOT GLOWING, Sub-Zero Jovian Texture)
        // Slate violet, muted charcoal-indigo, cool dusty mauve, water-ice cloud decks
        vec3 colBand1 = vec3(0.25, 0.18, 0.27); // Slate violet zone
        vec3 colBand2 = vec3(0.12, 0.09, 0.15); // Dark charcoal-indigo belt
        vec3 colBand3 = vec3(0.32, 0.25, 0.35); // Ammonia / water ice cloud band
        vec3 colStorm = vec3(0.44, 0.35, 0.46); // Water ice storm swirl

        float blend1 = primaryBands * 0.5 + 0.5;
        float blend2 = secondaryBands * 0.5 + 0.5;
        vec3 surface = mix(colBand1, colBand2, blend1);
        surface = mix(surface, colBand3, blend2 * 0.55);
        surface = mix(surface, colStorm, smoothstep(0.68, 0.88, storms) * 0.35);
        surface = mix(surface, vec3(0.08, 0.06, 0.10), polarFactor * 0.7);
        surface += (fineBelts - 0.5) * 0.06 * vec3(0.2, 0.2, 0.25);

        // Completely non-glowing planetary body (crisp Jovian gas giant lighting)
        surface *= (0.30 + 0.70 * limbDarkening);
        // Muted cold atmospheric limb rim
        surface += vec3(0.15, 0.14, 0.20) * pow(1.0 - limb, 4.5) * 0.18;

        gl_FragColor = vec4(surface, 1.0);
        return;
      }
    }

    // 3. MAIN SEQUENCE, GIANTS, HYPERGIANTS, WHITE DWARFS & CONTACT BINARIES
    vec3 deepCore = baseColor * 0.88;
    vec3 brightSurface = mix(baseColor * 1.15, vec3(1.0, 0.99, 0.97), 0.48);
    vec3 hotFaculae = mix(coronaColor * 1.25, vec3(1.0, 1.0, 1.0), 0.65);

    vec3 plasmaColor = mix(deepCore, brightSurface, gran);
    plasmaColor = mix(plasmaColor, hotFaculae, smoothstep(0.58, 0.86, gran) * 0.42);

    if (isContactBinary > 0.5) {
      plasmaColor = mix(plasmaColor, vec3(0.92, 0.96, 1.0), 0.18);
    }

    plasmaColor *= (0.48 + 0.52 * limbDarkening);

    float fresnel = pow(1.0 - limb, 3.2);
    plasmaColor += coronaColor * fresnel * 0.82;

    gl_FragColor = vec4(plasmaColor, 1.0);
  }
`;

// Shared Unit Geometries to prevent GPU buffer churn across stages
let sharedUnitSphere64: THREE.SphereGeometry | null = null;
let sharedUnitSphere48: THREE.SphereGeometry | null = null;
let sharedUnitSphere32: THREE.SphereGeometry | null = null;

export const getSharedUnitSphere = (highDetail: boolean = true): THREE.SphereGeometry => {
  if (highDetail) {
    if (!sharedUnitSphere64) sharedUnitSphere64 = new THREE.SphereGeometry(1, 64, 64);
    return sharedUnitSphere64;
  }
  if (!sharedUnitSphere48) sharedUnitSphere48 = new THREE.SphereGeometry(1, 48, 48);
  return sharedUnitSphere48;
};

// Creates the exact custom shader material matching StarCanvas3D
export const createStarShaderMaterial = (
  star: StarData,
  wireframe: boolean = false,
  timeUniform?: { value: number }
): THREE.ShaderMaterial => {
  const baseColor = new THREE.Color(star.colorHex);
  const coronaColor = new THREE.Color(star.coronaColorHex);
  const isContactBinary = star.id === 'vfts-352' || star.stellarStage === 'Contact Binary';
  const isPulsar = isPulsarOrNeutronStar(star);
  const bdType = getBrownDwarfType(star);

  return new THREE.ShaderMaterial({
    wireframe,
    uniforms: {
      time: timeUniform || { value: 0 },
      baseColor: { value: baseColor },
      coronaColor: { value: coronaColor },
      temperature: { value: star.temperature },
      isPulsar: { value: isPulsar ? 1.0 : 0.0 },
      isContactBinary: { value: isContactBinary ? 1.0 : 0.0 },
      brownDwarfType: { value: bdType },
    },
    vertexShader: STAR_VERTEX_SHADER,
    fragmentShader: STAR_FRAGMENT_SHADER,
  });
};

// Creates the exact corona atmospheric halo shader material matching StarCanvas3D
export const createCoronaShaderMaterial = (
  star: StarData,
  timeUniform?: { value: number }
): THREE.ShaderMaterial => {
  const coronaColor = new THREE.Color(star.coronaColorHex);
  const bdType = getBrownDwarfType(star);
  const isFaintL = bdType === 1.0;

  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
    uniforms: {
      time: timeUniform || { value: 0 },
      glowColor: { value: isFaintL ? new THREE.Color('#8a2014') : coronaColor },
      glowIntensity: { value: isFaintL ? 0.20 : 0.70 },
    },
    vertexShader: `
      #include <common>
      #include <logdepthbuf_pars_vertex>
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
        #include <logdepthbuf_vertex>
      }
    `,
    fragmentShader: `
      #include <common>
      #include <logdepthbuf_pars_fragment>
      uniform vec3 glowColor;
      uniform float glowIntensity;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        #include <logdepthbuf_fragment>
        vec3 viewDir = normalize(vViewPosition);
        float intensity = pow(clamp(0.65 - dot(vNormal, viewDir), 0.0, 1.0), 2.2);
        gl_FragColor = vec4(glowColor * 1.5, clamp(intensity * glowIntensity, 0.0, glowIntensity));
      }
    `,
  });
};

export interface CreateStarMeshOptions {
  wireframe?: boolean;
  showCorona?: boolean;
  lightIntensityMultiplier?: number;
  timeUniform?: { value: number };
}

/**
 * Builds a complete star object group (photosphere with custom shader, contact-binary lobes if applicable,
 * atmospheric corona halo, and point light) with 100% parity to the main 3D stage.
 */
export const createStarMeshGroup = (
  star: StarData,
  radius: number,
  options: CreateStarMeshOptions = {}
): THREE.Group => {
  const { wireframe = false, showCorona = true, lightIntensityMultiplier = 1.0, timeUniform } = options;
  const starGroup = new THREE.Group();
  starGroup.userData = { starId: star.id, starData: star, radius };

  const isContactBinary = star.id === 'vfts-352' || star.stellarStage === 'Contact Binary';
  const bdType = getBrownDwarfType(star);
  const baseColor = new THREE.Color(star.colorHex);

  const starMat = createStarShaderMaterial(star, wireframe, timeUniform);

  if (isContactBinary) {
    const lobeRadius = radius * 0.62;
    const lobeOffset = radius * 0.42;

    const lobeGeo = getSharedUnitSphere(false);
    const lobeAMesh = new THREE.Mesh(lobeGeo, starMat);
    lobeAMesh.scale.setScalar(lobeRadius);
    lobeAMesh.position.set(-lobeOffset, 0, 0);
    lobeAMesh.name = `Photosphere-A-${star.id}`;
    starGroup.add(lobeAMesh);

    const lobeBMesh = new THREE.Mesh(lobeGeo, starMat);
    lobeBMesh.scale.setScalar(lobeRadius);
    lobeBMesh.position.set(lobeOffset, 0, 0);
    lobeBMesh.name = `Photosphere-B-${star.id}`;
    starGroup.add(lobeBMesh);

    const bridgeGeo = new THREE.CylinderGeometry(lobeRadius * 0.8, lobeRadius * 0.8, lobeOffset * 2, 32);
    bridgeGeo.rotateZ(Math.PI / 2);
    const bridgeMesh = new THREE.Mesh(bridgeGeo, starMat);
    bridgeMesh.name = `Photosphere-Neck-${star.id}`;
    starGroup.add(bridgeMesh);
  } else {
    const sphereGeo = getSharedUnitSphere(true);
    const photosphere = new THREE.Mesh(sphereGeo, starMat);
    photosphere.scale.setScalar(radius);
    photosphere.name = `Photosphere-${star.id}`;
    starGroup.add(photosphere);
  }

  // Atmospheric Corona Glow Halo (Disabled for Class T & Y brown dwarfs, Faint for Class L)
  if (showCorona && bdType < 1.5) {
    const isFaintL = bdType === 1.0;
    const coronaMat = createCoronaShaderMaterial(star, timeUniform);

    if (isContactBinary) {
      const coronaLobeRadius = radius * 0.76;
      const lobeOffset = radius * 0.42;
      const coronaGeo = getSharedUnitSphere(false);

      const coronaMeshA = new THREE.Mesh(coronaGeo, coronaMat);
      coronaMeshA.scale.setScalar(coronaLobeRadius);
      coronaMeshA.position.set(-lobeOffset, 0, 0);
      coronaMeshA.name = 'CoronaA';
      starGroup.add(coronaMeshA);

      const coronaMeshB = new THREE.Mesh(coronaGeo, coronaMat);
      coronaMeshB.scale.setScalar(coronaLobeRadius);
      coronaMeshB.position.set(lobeOffset, 0, 0);
      coronaMeshB.name = 'CoronaB';
      starGroup.add(coronaMeshB);
    } else {
      const coronaRadius = radius * (isFaintL ? 1.08 : 1.22);
      const coronaGeo = getSharedUnitSphere(false);
      const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
      coronaMesh.scale.setScalar(coronaRadius);
      coronaMesh.name = 'Corona';
      starGroup.add(coronaMesh);
    }
  }

  // Point Light emitted by the star
  let lightIntensity = 2.5;
  if (isContactBinary) {
    lightIntensity = 3.2;
  } else if (bdType === 1.0) {
    lightIntensity = 0.35; // Faint glow for Class L
  } else if (bdType >= 2.0) {
    lightIntensity = 0.0; // Non-luminous / no glow for Class T & Y
  }

  lightIntensity *= lightIntensityMultiplier;

  if (lightIntensity > 0) {
    const lightCol = bdType === 1.0 ? new THREE.Color('#d9483b') : baseColor;
    const starLight = new THREE.PointLight(lightCol, lightIntensity, Math.max(10, radius * 15));
    starGroup.add(starLight);
  }

  return starGroup;
};

import { STARS_SOLAR_NEIGHBORS } from '../data/starsSolarNeighbors';

/**
 * Standard reference data for our Sun (Sol) with 100% exact properties
 */
export const SUN_REFERENCE_STAR: StarData = STARS_SOLAR_NEIGHBORS[0];

