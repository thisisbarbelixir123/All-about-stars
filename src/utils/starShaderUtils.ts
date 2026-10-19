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

// High-precision 5-octave FBM for intricate atmospheric vortices and granular textures
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
  uniform float densityFactor;
  uniform float spectralClassIndex;
  uniform float spectralSubclass;
  uniform float hasSpectralData;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vLocalPos;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  // Smooth quintic interpolation polynomial (C2 continuity, zero grid artifacts)
  vec3 quintic(vec3 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  }

  // Dave Hoskins' float-stable 3D hash generator
  float hash3D(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.zyx + 31.32);
    return fract((p.x + p.y) * p.z);
  }

  // Vectorized 3D pseudo-random hash generator for 3D Voronoi seeds
  vec3 hash3DVec(vec3 p) {
    vec3 p3 = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yxz + 33.33);
    return fract((p3.xxy + p3.yxx) * p3.zyx);
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

  // Multi-octave Fractal Brownian Motion (FBM)
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

  // High-frequency 5-octave FBM for intricate chromospheric vortices and magnetic fibrils
  float fbmFine(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    vec3 shift = vec3(17.13, 31.41, 43.17);
    for (int i = 0; i < 5; ++i) {
      value += amplitude * smoothNoise(p);
      p = p * 2.08 + shift;
      amplitude *= 0.5;
    }
    return value;
  }

  // High-fidelity 3D Voronoi Convection Granules (DKIST / SDO solar physics model)
  // Computes:
  // x: Buoyant convective dome (hot upwelling center)
  // y: Intergranular lane factor (darker boundary channel)
  // z: Magnetic filigree (bright points trapped in lane vertices)
  vec3 cellularGranules(vec3 p, float boilTime) {
    vec3 b = floor(p);
    vec3 f = fract(p);
    float d1 = 8.0;
    float d2 = 8.0;

    for (int k = -1; k <= 1; k++) {
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec3 g = vec3(float(i), float(j), float(k));
          vec3 o = hash3DVec(b + g);
          // Granule boiling and morphing over time
          vec3 center = g + 0.5 + 0.35 * sin(o * 6.2831853 + boilTime);
          vec3 diff = center - f;
          float d = length(diff);
          if (d < d1) {
            d2 = d1;
            d1 = d;
          } else if (d < d2) {
            d2 = d;
          }
        }
      }
    }

    float laneDist = d2 - d1;
    float lane = smoothstep(0.015, 0.22, laneDist);
    float dome = pow(clamp(1.0 - d1 * 1.12, 0.0, 1.0), 1.25);
    float filigree = smoothstep(0.06, 0.01, laneDist) * smoothstep(0.55, 0.82, d2);

    return vec3(dome, lane, filigree);
  }

  // Calibrated CIE 1931 D65 Daylight Spectral Chromaticity Engine directly on GPU
  // Passes through the calibrated D65 colors computed with exact Planckian/Mitchell Charity accuracy
  void getD65DaylightColors(
    float cIdx,
    float subCls,
    float tempK,
    vec3 fallbackBase,
    vec3 fallbackCorona,
    out vec3 outBase,
    out vec3 outCorona
  ) {
    outBase = fallbackBase;
    outCorona = fallbackCorona;
  }

  void main() {
    #include <logdepthbuf_fragment>
    vec3 viewDir = normalize(vViewPosition);
    float limb = dot(normalize(vNormal), viewDir);
    limb = clamp(limb, 0.0, 1.0);

    vec3 normPos = normalize(vLocalPos);

    // Dynamic axial spin rotation around the polar Y-axis:
    float spinAngle = time * 0.10;
    float cosAngle = cos(spinAngle);
    float sinAngle = sin(spinAngle);
    normPos = vec3(
      normPos.x * cosAngle + normPos.z * sinAngle,
      normPos.y,
      -normPos.x * sinAngle + normPos.z * cosAngle
    );

    float dFactor = clamp(densityFactor, 0.0, 1.0);

    // Dynamic in-shader D65 daylight chromaticity calculation
    vec3 d65Base;
    vec3 d65Corona;
    getD65DaylightColors(spectralClassIndex, spectralSubclass, temperature, baseColor, coronaColor, d65Base, d65Corona);

    // 1. NEUTRON STARS & PULSARS (Relativistic synchrotron beaming)
    if (isPulsar > 0.5) {
      float limbDarkening = pow(limb, 0.40);
      vec3 pulsarPos = normPos * 3.8 + vec3(0.0, time * 0.18, 0.0);
      float granPulsar = fbm(pulsarPos);
      vec3 core = mix(d65Base, d65Corona, granPulsar * 0.40 + 0.35) * 1.35;
      core *= (0.75 + 0.25 * limbDarkening);

      // Relativistic magnetic polar cap beaming
      float polarProximity = pow(abs(normPos.y), 3.5);
      core += vec3(0.85, 0.95, 1.0) * polarProximity * mix(1.20, 0.60, dFactor);

      float fresnelPulsar = pow(1.0 - limb, 2.4);
      core += d65Corona * fresnelPulsar * mix(1.25, 0.65, dFactor);

      float compressK = mix(0.04, 0.12, dFactor);
      core = core / (vec3(1.0) + core * compressK);
      gl_FragColor = vec4(core, 1.0);
      return;
    }

    // 2. ULTRA-SMOOTH BROWN DWARFS (Class L, T, Y) - SUBSTELLAR ATMOSPHERES MATCHING REFERENCE
    if (brownDwarfType > 0.5) {
      float y = normPos.y; // -1.0 (South Pole) to +1.0 (North Pole)
      float lon = atan(normPos.z, normPos.x);

      if (brownDwarfType < 1.5) {
        // =========================================================================
        // CLASS L: Glowing Carmine-Red Convective Dwarf (Soft mottled cloud puffs)
        // Dynamically tinted by spectral d65Base & d65Corona
        // =========================================================================
        vec3 lPos = normPos * 2.8 + vec3(time * 0.020, time * 0.012, -time * 0.008);
        float n1 = smoothNoise(lPos);
        float n2 = smoothNoise(lPos * 1.85 + vec3(1.7, 3.2, 0.9));
        float mottle = n1 * 0.65 + n2 * 0.35;
        // Smooth rounded sinusoidal cloud puffs with gentle continuous falloff
        float puff = sin(mottle * 3.14159) * 0.5 + 0.5;

        // Rich glowing carmine & scarlet palette driven by spectral d65Base
        vec3 colDeepRuby   = mix(vec3(0.55, 0.12, 0.08), d65Base * 0.92, 0.65);
        vec3 colMidScarlet = mix(vec3(0.88, 0.24, 0.16), d65Base * 1.20, 0.70);
        vec3 colWarmPuff   = mix(vec3(1.08, 0.42, 0.26), mix(d65Base, d65Corona, 0.5) * 1.35, 0.75);

        vec3 lColor = mix(colDeepRuby, colMidScarlet, mottle);
        lColor = mix(lColor, colWarmPuff, puff * 0.65);

        // Gentle spherical limb darkening
        float lLimb = pow(limb, 0.45);
        lColor *= (0.70 + 0.30 * lLimb);

        // Radiant atmospheric crimson rim glow modulated by density and d65Corona
        float lRim = pow(1.0 - limb, 2.5);
        vec3 rimTint = mix(vec3(1.0, 0.35, 0.22), d65Corona * 1.40, 0.50);
        lColor += rimTint * lRim * mix(0.70, 0.35, dFactor);

        // Soft compression with density adaptation
        float compressK = mix(0.04, 0.12, dFactor);
        lColor = lColor / (vec3(1.0) + lColor * compressK);
        gl_FragColor = vec4(lColor, 1.0);
        return;
      } else if (brownDwarfType < 2.5) {
        // =========================================================================
        // CLASS T: Glowing Jovian Magenta & Plum Dwarf
        // Dynamically tinted by spectral d65Base & d65Corona
        // =========================================================================
        float tLon = lon + time * 0.022;
        float shear = sin(y * 7.5 + sin(tLon * 1.8) * 0.35) * 0.5 + 0.5;
        float fineShear = sin(y * 15.0 - 0.5) * 0.5 + 0.5;
        vec3 tPos = vec3(tLon * 2.2, y * 4.8, time * 0.015);
        float tNoise = smoothNoise(tPos);
        float tClouds = smoothNoise(vec3(tLon * 3.8, y * 6.5 + tNoise * 0.4, time * 0.018));

        // Jovian magenta/plum palette driven by spectral d65Base & d65Corona
        vec3 colDarkPlum      = mix(vec3(0.35, 0.08, 0.28), d65Base * 0.88, 0.65);
        vec3 colRichWine      = mix(mix(vec3(0.62, 0.14, 0.46), vec3(0.52, 0.10, 0.36), fineShear * 0.4), d65Base * 1.10, 0.60);
        vec3 colBrightMagenta = mix(vec3(0.98, 0.28, 0.68), d65Corona * 1.40, 0.70);

        vec3 tColor = mix(colDarkPlum, colRichWine, shear * 0.55 + tNoise * 0.45);
        tColor = mix(tColor, colBrightMagenta, tClouds * 0.55);

        // Gentle spherical limb darkening
        float tLimb = pow(limb, 0.45);
        tColor *= (0.68 + 0.32 * tLimb);

        // Radiant magenta perimeter glow modulated by density
        float tRim = pow(1.0 - limb, 2.5);
        vec3 tRimTint = mix(vec3(0.95, 0.28, 0.75), d65Corona * 1.40, 0.50);
        tColor += tRimTint * tRim * mix(0.65, 0.30, dFactor);

        float compressK = mix(0.04, 0.12, dFactor);
        tColor = tColor / (vec3(1.0) + tColor * compressK);
        gl_FragColor = vec4(tColor, 1.0);
        return;
      } else {
        // =========================================================================
        // CLASS Y: Smoothly Banded Slate-Violet & Mauve Ice Dwarf
        // Dynamically tinted by spectral d65Base & d65Corona
        // =========================================================================
        float yLon = lon + time * 0.015;

        // Gentle zonal flow with subtle atmospheric turbulence
        float beltWarp = smoothNoise(vec3(yLon * 1.4, y * 6.0, time * 0.010)) * 0.08;
        float beltY = y + beltWarp;

        // Multi-tier smooth horizontal atmospheric belts (no harsh high frequencies)
        float b1 = sin(beltY * 6.5) * 0.5 + 0.5;
        float b2 = sin(beltY * 13.0 + 1.2) * 0.5 + 0.5;

        // Slate-purple, lavender, and mauve palette driven by D65 colors
        vec3 colCharcoal  = mix(vec3(0.22, 0.18, 0.30), d65Base * 0.90, 0.65);
        vec3 colSlateBelt = mix(vec3(0.35, 0.28, 0.45), d65Base * 1.15, 0.65);
        vec3 colLavender  = mix(vec3(0.55, 0.44, 0.68), mix(d65Base, d65Corona, 0.5) * 1.30, 0.70);
        vec3 colMauveHaze = mix(vec3(0.70, 0.58, 0.82), d65Corona * 1.45, 0.70);

        vec3 yColor = mix(colCharcoal, colSlateBelt, b1);
        yColor = mix(yColor, colLavender, b2 * 0.60);
        yColor = mix(yColor, colMauveHaze, (1.0 - abs(y)) * 0.30);

        // Subtle temperate storm swirl
        float stormDist = length(vec2(fract(yLon * 0.35) - 0.5, y - 0.25));
        float storm = smoothstep(0.18, 0.05, stormDist);
        yColor = mix(yColor, colMauveHaze * 1.25, storm * 0.35);

        // Planetary diffuse shading
        float yLimb = pow(limb, 0.48);
        yColor *= (0.65 + 0.35 * yLimb);

        // Cool faint violet haze scattering at the limb
        float yRim = pow(1.0 - limb, 2.8);
        vec3 yRimTint = mix(vec3(0.55, 0.42, 0.72), d65Corona * 1.40, 0.50);
        yColor += yRimTint * yRim * mix(0.55, 0.25, dFactor);

        float compressK = mix(0.04, 0.12, dFactor);
        yColor = yColor / (vec3(1.0) + yColor * compressK);
        gl_FragColor = vec4(yColor, 1.0);
        return;
      }
    }

    // 3. MAIN SEQUENCE, GIANTS, SUBDWARFS, HYPERGIANTS & WHITE DWARFS
    // Celestia-esque Photospheric Convective Plasma Flow
    // Calibrated with Vega-Relative Mitchell Charity Chromaticity spreading outward to stellar outline

    // Smooth domain-warped macro convective currents (Celestia-esque swirling supergranules)
    vec3 samplePos = normPos * 2.8;
    vec3 q = samplePos + vec3(time * 0.025, time * 0.018, time * 0.010);
    float f1 = fbm(q);
    vec3 warpedP = samplePos + vec3(f1 * 0.65, f1 * 0.45, f1 * 0.35) + vec3(time * 0.014, -time * 0.010, time * 0.007);
    float supergran = fbm(warpedP);

    // Primary Voronoi Convection Granules (silky boiling cellular simmer)
    vec3 granPos = warpedP * 5.6 + vec3(time * 0.018, time * 0.012, -time * 0.009);
    vec3 gran = cellularGranules(granPos, time * 0.22);
    float granuleDome = gran.x;      // Hot buoyant convex summit
    float interLane = gran.y;        // Smooth intergranular lane factor
    float filigree = gran.z;         // Magnetic bright points in lane vertices

    // Secondary fine chromospheric micro-fibrils & silky turbulence
    vec3 microPos = warpedP * 12.5 + vec3(-time * 0.020, time * 0.015, time * 0.010);
    float microFibrils = fbmFine(microPos);

    // Celestia-esque Luminance & Dynamic Palette:
    // d65Base: Primary photospheric chromaticity (#9bb0ff, #aabfff, #cad7ff, #f8f7ff, #fff4ea, #ffd2a1, #ffcc6f)
    // d65Corona: Corona & chromospheric highlight tint
    float coolStarBoost = smoothstep(5200.0, 2300.0, temperature);
    
    // Warm, luminous convective plasma layers
    vec3 darkLaneColor  = mix(d65Base * 0.84, d65Base * 0.92, coolStarBoost);
    vec3 midMantleColor = mix(d65Base * 1.10, d65Corona * 1.22, 0.35);
    vec3 brightSummit   = mix(d65Base * 1.45, d65Corona * 1.65, 0.45);
    vec3 filigreeColor  = mix(d65Corona * 1.95, vec3(1.0), 0.40);

    // Convective cellular structure with silky Celestia-style granular transitions
    vec3 plasma = mix(darkLaneColor, midMantleColor, interLane);
    plasma = mix(plasma, brightSummit, granuleDome * 0.80);

    // Supergranulation temperature modulation (macro convective eddies)
    plasma *= (0.94 + 0.26 * supergran);

    // Magnetic filigree in lane vertices
    plasma += filigreeColor * (filigree * 0.65);

    // Micro-scale chromospheric fibril turbulence
    plasma += (d65Corona * 1.45) * ((microFibrils - 0.40) * 0.28);

    // Faculae ridges near grazing angles
    float faculaeLimb = smoothstep(0.75, 0.15, limb);
    float faculaePattern = smoothstep(0.48, 0.82, supergran * 0.60 + microFibrils * 0.40);
    vec3 faculaeTint = mix(d65Corona * 1.65, mix(d65Base * 1.70, vec3(1.0), 0.38), 0.45);
    plasma += faculaeTint * (faculaeLimb * faculaePattern * 0.55 * mix(1.0, 0.40, dFactor));

    // Starspots / Magnetic Sunspot groups on active cooler stars (G, K, M and active subdwarfs)
    float spotAffinity = smoothstep(7500.0, 3200.0, temperature);
    if (spotAffinity > 0.05) {
      vec3 spotPos = normPos * 2.2 + vec3(12.4, 45.1, 78.9);
      float spotNoise = fbm(spotPos);
      float spotMask = smoothstep(0.74, 0.84, spotNoise);
      if (spotMask > 0.01) {
        float umbra = smoothstep(0.78, 0.84, spotNoise);
        vec3 spotColor = mix(d65Base * 0.50, d65Base * 0.25, umbra);
        plasma = mix(plasma, spotColor, spotMask * spotAffinity * 0.80);
      }
    }

    // Contact binary mass transfer bridge (e.g. VFTS 352)
    if (isContactBinary > 0.5) {
      plasma = mix(plasma, vec3(0.98, 0.99, 1.0) * 1.50, 0.35);
    }

    // Central incandescence (blinding thermonuclear core radiance in center of disc)
    float coreExposure = pow(limb, 1.30);
    vec3 coreWhiteHot = mix(d65Base * 1.35, vec3(1.0) * 1.45, 0.45);
    plasma = mix(plasma, coreWhiteHot, coreExposure * 0.35);

    // CONCENTRIC BRIGHTER LOWER CIRCLE:
    // Luminous concentration on the lower hemisphere/disc creating a distinctive brighter lower circle
    float lowerCircleFactor = smoothstep(0.25, -0.85, normPos.y);
    float lowerDepth = pow(limb, 0.70);
    vec3 brighterLowerTint = mix(d65Base * 1.45, vec3(1.0), 0.38);
    plasma += brighterLowerTint * (lowerCircleFactor * 0.35 * lowerDepth);

    // CONCENTRIC CORONA CHROMATICITY OUTLINE SPREAD:
    // As limb falls from 0.85 toward 0.0, signature spectral color spreads outward across the concentric outline
    float outlineSpread = smoothstep(0.85, 0.02, limb);
    vec3 outlineChromaticity = mix(d65Base * 1.25, d65Corona * 1.55, 0.50);
    plasma = mix(plasma, plasma * (outlineChromaticity * 0.85) + outlineChromaticity * 0.35, outlineSpread * 0.45);

    // Realistic Eddington radiative transfer limb darkening with elevated floor
    float eddingtonBase = mix(0.58, 0.68, coolStarBoost);
    float eddingtonSlope = 1.0 - eddingtonBase;
    float eddingtonLimb = eddingtonBase + eddingtonSlope * pow(limb, mix(0.80, 0.68, coolStarBoost));
    plasma *= eddingtonLimb;

    // Atmospheric coronal rim luminescence spreading past the limb edge (concentric dual-band corona)
    float rimAmt = mix(1.30, 0.70, dFactor);
    float innerFresnel = pow(1.0 - limb, 1.6);
    float outerFresnel = pow(1.0 - limb, 3.2);
    vec3 concentricRim = mix(d65Corona * 1.70, mix(d65Base, vec3(1.0), 0.35) * 1.95, innerFresnel * 0.55);
    plasma += concentricRim * outerFresnel * rimAmt;

    // Luminous soft tone compression (preserves brilliant highlights and vibrant contrast without clipping)
    float compressK = mix(0.018, 0.055, dFactor);
    plasma = plasma / (vec3(1.0) + plasma * compressK);

    gl_FragColor = vec4(plasma, 1.0);
  }
`;

// Shared Unit Geometries to prevent GPU buffer churn across stages
let sharedUnitSphere64: THREE.SphereGeometry | null = null;
let sharedUnitSphere48: THREE.SphereGeometry | null = null;

export const getSharedUnitSphere = (highDetail: boolean = true): THREE.SphereGeometry => {
  if (highDetail) {
    if (!sharedUnitSphere64) sharedUnitSphere64 = new THREE.SphereGeometry(1, 64, 64);
    return sharedUnitSphere64;
  }
  if (!sharedUnitSphere48) sharedUnitSphere48 = new THREE.SphereGeometry(1, 48, 48);
  return sharedUnitSphere48;
};

import { computeD65StellarColor, parseSpectralType } from './stellarColorsD65';

// Universal Spectral Class numerical index mapping for shaders
export const SPECTRAL_CLASS_MAP: Record<string, number> = {
  'O': 0.0,
  'B': 1.0,
  'A': 2.0,
  'F': 3.0,
  'G': 4.0,
  'K': 5.0,
  'M': 6.0,
  'L': 7.0,
  'T': 8.0,
  'Y': 9.0,
  'WR': 10.0,
  'LBV': 11.0,
  'WD': 12.0,
  'NS': 13.0,
  'C': 14.0,
  'S': 15.0,
};

// Creates the exact custom shader material matching StarCanvas3D with D65 Chromaticity
export const createStarShaderMaterial = (
  star: StarData,
  wireframe: boolean = false,
  timeUniform?: { value: number },
  densityFactor: number = 0.0
): THREE.ShaderMaterial => {
  const d65 = computeD65StellarColor({
    spectralType: star.spectralType,
    spectralClass: star.spectralClass,
    temperature: star.temperature,
    stellarStage: star.stellarStage,
  });
  const baseColor = new THREE.Color(d65.colorHex);
  const coronaColor = new THREE.Color(d65.coronaColorHex);
  const isContactBinary = star.id === 'vfts-352' || star.stellarStage === 'Contact Binary';
  const isPulsar = isPulsarOrNeutronStar(star);
  const bdType = getBrownDwarfType(star);
  const { classKey, subclass } = parseSpectralType(star.spectralType, star.spectralClass);
  const spectralClassIndex = SPECTRAL_CLASS_MAP[classKey] ?? 4.0;

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
      densityFactor: { value: densityFactor },
      spectralClassIndex: { value: spectralClassIndex },
      spectralSubclass: { value: subclass },
      hasSpectralData: { value: 1.0 },
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
  const d65 = computeD65StellarColor({
    spectralType: star.spectralType,
    spectralClass: star.spectralClass,
    temperature: star.temperature,
    stellarStage: star.stellarStage,
  });
  const baseColor = new THREE.Color(d65.colorHex);
  const coronaColor = new THREE.Color(d65.coronaColorHex);
  const bdType = getBrownDwarfType(star);
  const isFaintL = bdType === 1.0;
  const glowIntensityVal = isFaintL ? 0.35 : 0.75;

  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
    uniforms: {
      time: timeUniform || { value: 0 },
      baseColor: { value: isFaintL ? new THREE.Color('#9e2819') : baseColor },
      coronaColor: { value: isFaintL ? new THREE.Color('#781810') : coronaColor },
      glowIntensity: { value: glowIntensityVal },
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
      uniform vec3 baseColor;
      uniform vec3 coronaColor;
      uniform float glowIntensity;
      uniform float time;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        #include <logdepthbuf_fragment>
        vec3 viewDir = normalize(vViewPosition);

        // Normalized radial distance r from center of star disc on screen [0.0 = center, 1.0 = silhouette edge]:
        float cosTheta = abs(dot(vNormal, viewDir));
        float r = sqrt(clamp(1.0 - cosTheta * cosTheta, 0.0, 1.0));

        // Dynamic subtle atmospheric convection
        float pulse = 1.0 + 0.03 * sin(time * 1.6 + vNormal.x * 2.5 + vNormal.y * 2.0);

        // Continuous smooth radial gradient matching Hero Image:
        // Core starlight glow (#ffffff / core radiance transitioning to baseColor and coronaColor)
        vec3 coreColor = mix(vec3(1.0), baseColor * 1.25, smoothstep(0.0, 0.38, r));
        vec3 outerColor = mix(baseColor, coronaColor, smoothstep(0.30, 0.72, r));
        vec3 finalColor = mix(coreColor, outerColor, smoothstep(0.18, 0.48, r));

        // Strictly non-solid continuous falloff with zero hard edge or solid ring:
        // Vanishes smoothly to absolute 0.0 well before the geometric edge (r >= 0.88 is completely transparent)
        float falloff = 0.0;
        if (r < 0.88) {
          float normDist = r / 0.85;
          float gaussian = exp(-normDist * normDist * 3.2);
          float smoothFade = 1.0 - smoothstep(0.55, 0.85, r);
          falloff = gaussian * smoothFade * pulse;
        }

        // Translucent ethereal alpha (strictly non-solid continuous gas)
        float alpha = clamp(falloff * glowIntensity * 0.95, 0.0, 0.75);

        gl_FragColor = vec4(finalColor * 1.35, alpha);
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
  const isBlackHole =
    star.colorHex === '#000000' ||
    star.spectralType === 'Black Hole' ||
    star.stellarStage === 'Stellar Black Hole' ||
    star.id.includes('black-hole') ||
    star.name.toLowerCase().includes('black hole');
  const bdType = getBrownDwarfType(star);
  const baseColor = new THREE.Color(star.colorHex);

  if (isBlackHole) {
    const sphereGeo = getSharedUnitSphere(true);
    const bhMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe,
    });
    const eventHorizon = new THREE.Mesh(sphereGeo, bhMat);
    eventHorizon.scale.setScalar(radius);
    eventHorizon.name = `EventHorizon-${star.id}`;
    starGroup.add(eventHorizon);

    // Relativistic X-ray synchrotron accretion disk ring around black hole
    const diskInner = radius * 1.15;
    const diskOuter = radius * 1.85;
    const diskGeo = new THREE.RingGeometry(diskInner, diskOuter, 48);
    diskGeo.rotateX(Math.PI / 2.3);
    const diskMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#38bdf8'),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      wireframe,
    });
    const diskMesh = new THREE.Mesh(diskGeo, diskMat);
    diskMesh.name = `AccretionDisk-${star.id}`;
    starGroup.add(diskMesh);

    // Faint cool point light from relativistic disk
    const diskLight = new THREE.PointLight(new THREE.Color('#38bdf8'), 0.35 * lightIntensityMultiplier, Math.max(10, radius * 12));
    starGroup.add(diskLight);

    return starGroup;
  }

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
      const coronaLobeRadius = radius * 0.76 * (isFaintL ? 1.4 : 2.0);
      const lobeOffset = radius * 0.42;
      const coronaGeo = getSharedUnitSphere(false);

      const coronaMeshA = new THREE.Mesh(coronaGeo, coronaMat);
      coronaMeshA.scale.setScalar(coronaLobeRadius);
      coronaMeshA.position.set(-lobeOffset, 0, 0);
      coronaMeshA.name = 'CoronaA';
      coronaMeshA.raycast = () => {};
      starGroup.add(coronaMeshA);

      const coronaMeshB = new THREE.Mesh(coronaGeo, coronaMat);
      coronaMeshB.scale.setScalar(coronaLobeRadius);
      coronaMeshB.position.set(lobeOffset, 0, 0);
      coronaMeshB.name = 'CoronaB';
      coronaMeshB.raycast = () => {};
      starGroup.add(coronaMeshB);
    } else {
      const coronaRadius = radius * (isFaintL ? 1.4 : 2.2);
      const coronaGeo = getSharedUnitSphere(false);
      const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
      coronaMesh.scale.setScalar(coronaRadius);
      coronaMesh.name = 'Corona';
      coronaMesh.raycast = () => {};
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

