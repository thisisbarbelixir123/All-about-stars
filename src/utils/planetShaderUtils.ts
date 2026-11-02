import * as THREE from 'three';

export const PLANET_VERTEX_SHADER = `
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
    vLocalPos = normalize(position); // Exact unit sphere vector for seamless 3D noise
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
  }
`;

export const PLANET_FRAGMENT_SHADER = `
  #include <common>
  #include <logdepthbuf_pars_fragment>
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vLocalPos;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  uniform float time;
  // 0: rocky, 1: ocean, 2: super-earth, 3: sub-neptune, 4: ice-giant, 5: gas-giant-banded,
  // 6: hot-jupiter, 7: ultra-hot, 8: lava, 9: kbo-tholin, 10: kbo-ice, 11: star-plasma,
  // 12: mirror-world, 13: hycean-ocean, 14: hot-jupiter-dark-alkali, 15: gas-giant-water-clouds
  uniform float themeIndex;
  uniform float temperatureK;
  uniform vec3 lightDir;
  uniform float seed;
  uniform float albedo;

  // Approach A: Uniform-driven deterministic palettes & band variations
  uniform vec3 colorTint;
  uniform float bandShift;
  uniform float bandTurbulence;

  // 3D Simplex noise implementation
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // Fast 3-octave Fractional Brownian Motion (reduced from 4 for optimal fill-rate)
  float fbm(vec3 p) {
    float f = 0.5000 * snoise(p); p = p * 2.02;
    f += 0.2500 * snoise(p); p = p * 2.03;
    f += 0.1250 * snoise(p);
    return f;
  }

  // Fast 2-octave FBM for secondary layers (clouds, shadows, micro-cratering)
  float fbmFast(vec3 p) {
    return 0.65 * snoise(p) + 0.35 * snoise(p * 2.1);
  }

  // 2-octave ridged multifractal for razor-sharp mountain cordilleras and tectonic faults
  float ridgedFbm(vec3 p) {
    float n1 = 1.0 - abs(snoise(p));
    float n2 = 1.0 - abs(snoise(p * 2.08));
    return (n1 * n1) * 0.65 + (n2 * n2) * 0.35;
  }

  // Fast 2-tap analytical curl turbulence
  vec3 curlNoise(vec3 p) {
    const float e = 0.08;
    float n1 = snoise(p + vec3(0.0, e, 0.0));
    float n2 = snoise(p - vec3(0.0, e, 0.0));
    float n3 = snoise(p + vec3(0.0, 0.0, e));
    float n4 = snoise(p - vec3(0.0, 0.0, e));
    return normalize(vec3(n1 - n2, n3 - n4, n2 - n3 + 0.1));
  }

  // Fast single-pass domain warping (only 2 noise evaluations instead of 3x4 = 12)
  vec3 domainWarp(vec3 p, float strength) {
    vec2 offset = vec2(snoise(p), snoise(p + vec3(4.3, 1.7, 2.9)));
    return p + strength * vec3(offset.x, offset.y, offset.x * 0.5);
  }

  // Differential zonal rotation for gas giant atmospheric jet streams
  // Computes azimuthal velocity variation across latitude bands
  vec3 zonalJetFlow(vec3 p, float t, float speed) {
    float lat = p.y; // -1 to 1 latitude
    // Alternating eastward and westward jet streams with equatorial super-rotation
    float jetShear = sin(lat * 12.566) * 0.75 + cos(lat * 6.283) * 0.5;
    float theta = atan(p.z, p.x);
    float r = length(p.xz);
    float angleShift = theta + (speed * t * (1.0 + jetShear));
    return vec3(r * cos(angleShift), lat, r * sin(angleShift));
  }

  // Planckian blackbody thermal radiation approximation
  vec3 blackbody(float kelvin) {
    float t = clamp(kelvin, 800.0, 3500.0);
    if (t < 1100.0) {
      return mix(vec3(0.05, 0.01, 0.005), vec3(0.4, 0.05, 0.02), (t - 800.0) / 300.0);
    } else if (t < 1600.0) {
      return mix(vec3(0.4, 0.05, 0.02), vec3(1.0, 0.35, 0.04), (t - 1100.0) / 500.0);
    } else if (t < 2400.0) {
      return mix(vec3(1.0, 0.35, 0.04), vec3(1.0, 0.75, 0.35), (t - 1600.0) / 800.0);
    } else {
      return mix(vec3(1.0, 0.75, 0.35), vec3(1.2, 1.15, 1.05), (t - 2400.0) / 1100.0);
    }
  }

  // High-performance Directional Cloud Deck & Shadow Evaluation
  // Evaluates clouds with fast 2-octave FBM and projects shadows along incoming light vector L
  vec4 evaluateCloudLayer(vec3 p, vec3 lightDirVec, float timeVal, float coverage, float cloudSeed) {
    vec3 cloudCoord = p + vec3(timeVal * 0.04, timeVal * 0.015, timeVal * 0.02) + cloudSeed;
    float cloudNoise = fbmFast(cloudCoord * 2.8);
    float cloudDensity = smoothstep(1.0 - coverage, 1.0 - coverage + 0.25, cloudNoise);

    // Directional shadow: single sample along offset vector towards light
    vec3 shadowCoord = cloudCoord + lightDirVec * 0.045;
    float shadowNoise = fbmFast(shadowCoord * 2.8);
    float shadowMask = smoothstep(1.0 - coverage, 1.0 - coverage + 0.25, shadowNoise);

    return vec4(cloudDensity, shadowMask, cloudNoise, 0.0);
  }

  void main() {
    #include <logdepthbuf_fragment>
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);
    vec3 L = normalize(lightDir);

    float effSeed = seed;
    vec3 effColorTint = colorTint.r > 0.01 ? colorTint : vec3(1.0);
    float effBandShift = bandShift;

    float NdotL = clamp(dot(N, L) * 0.5 + 0.45, 0.2, 1.0);
    float rawNdotL = max(0.0, dot(N, L));
    float fresnel = pow(1.0 - max(0.0, dot(N, V)), 2.8);

    // Halfway vector for Blinn-Phong specular ocean sun glint
    vec3 H = normalize(L + V);
    float specBase = max(0.0, dot(N, H));
    float specular = 0.0;

    vec3 surface = vec3(0.5);
    vec3 atmoColor = vec3(0.3, 0.6, 1.0);
    float atmoStrength = 0.6;
    vec3 emissiveColor = vec3(0.0);

    // 1. Rocky Terrestrial (Sub-Martian / Martian / Airless Silicate)
    if (themeIndex < 0.5) {
      vec3 warped = domainWarp(vLocalPos * 3.5 + effSeed, 0.40);
      float elevation = ridgedFbm(warped);
      float micro = fbm(vLocalPos * 14.0 + effSeed);
      
      // Multi-tier regolith & rock stratification tinted per planet
      vec3 lowBasin = mix(vec3(0.28, 0.24, 0.22), vec3(0.42, 0.35, 0.30), micro) * effColorTint;
      vec3 highRidge = mix(vec3(0.60, 0.52, 0.45), vec3(0.78, 0.72, 0.65), micro) * effColorTint;
      surface = mix(lowBasin, highRidge, elevation);

      // Polar cold regolith frost (modulated by temperature and seed)
      float lat = abs(vLocalPos.y);
      float frostThreshold = clamp(0.70 + (temperatureK - 100.0) * 0.0012, 0.72, 0.96);
      if (lat > frostThreshold && temperatureK < 320.0) {
        float frostNoise = fbm(vLocalPos * 8.0 + effSeed);
        float frost = smoothstep(frostThreshold, frostThreshold + 0.08, lat + frostNoise * 0.06);
        surface = mix(surface, vec3(0.85, 0.88, 0.92), frost * 0.85);
      }

      atmoColor = vec3(0.65, 0.72, 0.82) * effColorTint;
      atmoStrength = 0.16;
    }
    // 2. Terrestrial Ocean World (Earth-like / Potentially Habitable)
    else if (themeIndex < 1.5) {
      vec3 warped = domainWarp(vLocalPos * 2.6 + effSeed, 0.45);
      float continental = fbm(warped); // Low-frequency continental land/ocean mask
      float mountain = ridgedFbm(warped * 2.2); // Razor-sharp alpine cordilleras
      float lat = abs(vLocalPos.y);

      // A. Ocean Bathymetry & Coastal Shelves (continental < 0.05)
      if (continental < 0.05) {
        float oceanDepth = smoothstep(-0.6, 0.05, continental);
        vec3 deepTrench = vec3(0.015, 0.08, 0.28) * effColorTint;
        vec3 shallowShelf = vec3(0.04, 0.32, 0.52) * effColorTint;
        surface = mix(deepTrench, shallowShelf, oceanDepth);
      }
      // B. Continental Landmass & Biome Stratification (continental >= 0.05)
      else {
        float landElevation = smoothstep(0.05, 0.65, continental) * 0.6 + mountain * 0.4;
        
        // Lowland lush vegetation / fertile river valleys
        vec3 lushLowlands = vec3(0.12, 0.36, 0.14) * effColorTint;
        // Temperate savanna / woodland
        vec3 savanna = vec3(0.35, 0.42, 0.20) * effColorTint;
        // High alpine arid plateau
        vec3 plateau = vec3(0.52, 0.42, 0.28) * effColorTint;
        // Jagged mountain peaks / rocky granite
        vec3 mountainPeak = vec3(0.68, 0.64, 0.60) * effColorTint;

        vec3 biome = mix(lushLowlands, savanna, smoothstep(0.1, 0.35, landElevation));
        biome = mix(biome, plateau, smoothstep(0.35, 0.65, landElevation));
        biome = mix(biome, mountainPeak, smoothstep(0.65, 0.90, landElevation));
        surface = biome;
      }

      // C. Latitude & Temperature-Controlled Polar Glacial Ice Caps
      float polarThreshold = clamp(0.72 + (temperatureK - 250.0) * 0.0015, 0.60, 0.92);
      if (lat > polarThreshold) {
        float iceNoise = fbm(vLocalPos * 6.0 + effSeed);
        float iceCap = smoothstep(polarThreshold, polarThreshold + 0.12, lat + iceNoise * 0.08);
        surface = mix(surface, vec3(0.92, 0.96, 1.0), iceCap);
      }

      // D. Directional Cloud Decks & Drop Shadows
      vec4 clouds = evaluateCloudLayer(vLocalPos, L, time, 0.52, effSeed * 2.3);
      float cloudMask = clouds.x;
      float shadowMask = clouds.y;

      // Specular ocean sun glint: water reflects sharp sunlight where unclouded; land is matte
      if (continental < 0.05) {
        float oceanSpec = pow(specBase, 32.0) * rawNdotL * 1.25;
        specular = oceanSpec * (1.0 - cloudMask);
      }

      // Cast directional drop shadow onto surface beneath
      surface *= (1.0 - shadowMask * 0.45);

      // Blend white cloud banks onto surface
      vec3 cloudColor = vec3(0.95, 0.97, 1.0);
      surface = mix(surface, cloudColor, cloudMask * 0.92);

      // Subtle forward scattering on cloud edges
      float cloudGlint = pow(specBase, 8.0) * cloudMask * 0.25;
      specular += cloudGlint;

      atmoColor = vec3(0.35, 0.65, 1.0) * effColorTint;
      atmoStrength = 0.75;
    }
    // 3. Super-Earth (Craggy Super-Continental Lithosphere)
    else if (themeIndex < 2.5) {
      vec3 warped = domainWarp(vLocalPos * 3.0 + effSeed, 0.50);
      float tectonic = ridgedFbm(warped);
      float micro = fbm(vLocalPos * 12.0);

      // Deep iron-rich silicate desert and massive volcanic basalt plateaus
      vec3 volcanicBasalt = vec3(0.20, 0.14, 0.12) * effColorTint;
      vec3 ironDesert = vec3(0.52, 0.28, 0.16) * effColorTint;
      vec3 highlandGranite = vec3(0.65, 0.50, 0.40) * effColorTint;

      vec3 land = mix(volcanicBasalt, ironDesert, smoothstep(0.2, 0.55, tectonic));
      land = mix(land, highlandGranite, smoothstep(0.55, 0.85, tectonic + micro * 0.2));
      surface = land;

      atmoColor = vec3(0.45, 0.75, 0.60) * effColorTint;
      atmoStrength = 0.65;
    }
    // 4. Sub-Neptune (H2/He envelope with methane/ammonia haze)
    else if (themeIndex < 3.5) {
      vec3 flow = zonalJetFlow(vLocalPos, time, 0.025);
      float latFreq = 14.0 + effBandShift * 8.0;
      vec3 bandPos = vec3(flow.x * 1.5, flow.y * latFreq, flow.z * 1.5);
      vec3 curl = curlNoise(flow * 2.5 + effSeed);
      float band = fbm(bandPos + curl * 1.2);
      surface = mix(vec3(0.08, 0.32, 0.58) * effColorTint, vec3(0.28, 0.68, 0.78) * effColorTint, band * 0.5 + 0.5);
      atmoColor = vec3(0.38, 0.72, 1.0) * effColorTint;
      atmoStrength = 0.85;
    }
    // 5. Ice Giant (Uranus / Neptune-like methane atmosphere with high-speed retrograde equatorial winds)
    else if (themeIndex < 4.5) {
      vec3 flow = zonalJetFlow(vLocalPos, time, 0.02);
      float latFreq = 11.0 + effBandShift * 6.0;
      vec3 bandPos = vec3(flow.x, flow.y * latFreq, flow.z);
      vec3 curl = curlNoise(flow * 2.8 + effSeed);
      float band = fbm(bandPos + curl * 0.9);
      surface = mix(vec3(0.10, 0.38, 0.68) * effColorTint, vec3(0.30, 0.72, 0.90) * effColorTint, band * 0.5 + 0.5);
      atmoColor = vec3(0.32, 0.68, 0.96) * effColorTint;
      atmoStrength = 0.82;
    }
    // 6. Gas Giant Banded (Jupiter/Saturn-like Class I with rich multi-tone latitudinal banding)
    else if (themeIndex < 5.5) {
      vec3 flow = zonalJetFlow(vLocalPos, time, 0.035);
      float latFreq = 22.0 + effBandShift * 10.0;
      vec3 bandPos = vec3(flow.x * 2.0, flow.y * latFreq, flow.z * 2.0);
      vec3 curl = curlNoise(flow * 3.5 + effSeed);
      float band = fbm(bandPos + curl * 1.8);
      
      // Multi-tone latitudinal atmospheric bands:
      // Equatorial Zone, Tropical Belts, Temperate Zones, and Polar Hoods
      vec3 darkBelt = vec3(0.55, 0.28, 0.16) * effColorTint;
      vec3 warmOchre = vec3(0.78, 0.52, 0.32) * effColorTint;
      vec3 paleZone = vec3(0.92, 0.86, 0.74) * effColorTint;
      vec3 brightAmmonia = vec3(0.98, 0.95, 0.88) * effColorTint;

      // 4-stop gradient across the turbulent jet band value
      float tBand = band * 0.5 + 0.5;
      vec3 bandedSurface;
      if (tBand < 0.33) {
        bandedSurface = mix(darkBelt, warmOchre, tBand / 0.33);
      } else if (tBand < 0.66) {
        bandedSurface = mix(warmOchre, paleZone, (tBand - 0.33) / 0.33);
      } else {
        bandedSurface = mix(paleZone, brightAmmonia, (tBand - 0.66) / 0.34);
      }

      // Latitudinal polar hoods (cool bluish-grey haze at extreme latitudes)
      float polarLat = abs(vLocalPos.y);
      if (polarLat > 0.75) {
        vec3 polarHaze = vec3(0.65, 0.72, 0.80) * effColorTint;
        bandedSurface = mix(bandedSurface, polarHaze, smoothstep(0.75, 0.95, polarLat) * 0.65);
      }

      surface = bandedSurface;

      atmoColor = vec3(0.85, 0.75, 0.58) * effColorTint;
      atmoStrength = 0.52;
    }
    // 7. Hot Jupiter (Silicate/Iron clouds, Class IV)
    else if (themeIndex < 6.5) {
      vec3 flow = zonalJetFlow(vLocalPos, time, 0.045);
      float latFreq = 16.0 + effBandShift * 8.0;
      vec3 bandPos = vec3(flow.x * 2.0, flow.y * latFreq, flow.z * 2.0);
      vec3 curl = curlNoise(flow * 3.0 + effSeed);
      float band = fbm(bandPos + curl * 1.4);
      surface = mix(vec3(0.42, 0.16, 0.10) * effColorTint, vec3(0.75, 0.38, 0.18) * effColorTint, band * 0.5 + 0.5);
      atmoColor = vec3(1.0, 0.45, 0.20) * effColorTint;
      atmoStrength = 0.70;
    }
    // 8. Ultra-Hot Jupiter / Thermally Dissociated Atmosphere (Sudarsky Class V, e.g. WASP-12 b, KELT-9 b)
    else if (themeIndex < 7.5) {
      // Eastward-shifted equatorial hot spot due to supersonic equatorial super-rotation jets
      // Shift substellar center by rotating L around the Y-axis by +24 degrees
      float sinShift = 0.4067;
      float cosShift = 0.9135;
      vec3 shiftedL = vec3(L.x * cosShift - L.z * sinShift, L.y, L.x * sinShift + L.z * cosShift);
      float hotSpot = max(0.0, dot(vLocalPos, shiftedL));
      float trueDayside = max(0.0, dot(vLocalPos, L));

      // Fast atmospheric zonal jet flow with high-temperature shear turbulence
      vec3 flow = zonalJetFlow(vLocalPos, time, 0.055);
      vec3 curl = curlNoise(flow * 3.5 + seed);
      float turbulentHaze = fbm(vec3(flow.x * 2.0, flow.y * 18.0, flow.z * 2.0) + curl * 1.6);

      // Nightside condensation zone: cold (1000K-1300K) iron and silicate clouds condense on dark limb
      vec3 nightClouds = mix(vec3(0.04, 0.03, 0.05), vec3(0.12, 0.08, 0.10), turbulentHaze * 0.5 + 0.5);

      // Dayside molecular dissociation: H2 and H2O dissociate, revealing blazing stellar-like thermal emission
      float daysideTemp = max(2200.0, temperatureK);
      vec3 thermalGlow = blackbody(daysideTemp);

      // Ionized hydrogen plasma / metallic vapor coloration across dayside
      vec3 ionizedHaze = mix(vec3(0.85, 0.18, 0.10), vec3(1.0, 0.65, 0.35), turbulentHaze * 0.5 + 0.5);
      vec3 daysideAtmosphere = mix(ionizedHaze, thermalGlow, pow(hotSpot, 1.2) * 0.85);

      // Blend nightside condensation with blazing dayside
      surface = mix(nightClouds, daysideAtmosphere, pow(hotSpot, 1.3));

      // Asymmetric thermal incandescence (blinding thermal emission peaking at shifted hot spot)
      emissiveColor = thermalGlow * (pow(hotSpot, 1.5) * 1.25 + pow(trueDayside, 2.5) * 0.45);

      // Deep ionized UV/Rayleigh emission along limb and dayside terminator
      atmoColor = mix(vec3(0.9, 0.25, 0.12), vec3(1.0, 0.70, 0.30), hotSpot);
      atmoStrength = 0.92;
    }
    // 9. Lava World (Molten Magma Oceans & Cracking Tectonic Fissures, e.g. 55 Cancri e, Kepler-10 b)
    else if (themeIndex < 8.5) {
      // Tidally locked substellar point aligned with the stellar irradiation vector L
      float subStellar = max(0.0, dot(vLocalPos, L));
      float nightSide = max(0.0, -dot(vLocalPos, L));

      // Multi-tier basaltic lithosphere & obsidian tessellation
      vec3 warpedPos = domainWarp(vLocalPos * 3.2 + seed, 0.40);
      float tectonicRidges = ridgedFbm(warpedPos * 2.0);
      float microCrust = fbmFast(vLocalPos * 12.0 + seed);

      // Deep obsidian nightside crags & cooling basalt
      vec3 cooledBasalt = mix(vec3(0.05, 0.04, 0.05), vec3(0.12, 0.09, 0.08), tectonicRidges);
      vec3 scorchedRegolith = mix(cooledBasalt, vec3(0.22, 0.14, 0.10), subStellar * 0.7);

      // Dynamic convective magma fissures & cracks
      // Convection currents accelerate with time near the substellar point
      vec3 magmaFlowCoord = vLocalPos * 8.5 + vec3(time * 0.03, time * 0.02, 0.0);
      float crackPattern = 1.0 - abs(snoise(magmaFlowCoord));
      float deepFissures = smoothstep(0.72, 0.95, crackPattern);

      // Blackbody thermal incandescence for molten magma
      // Sub-stellar magma ocean reaches actual estimated temperatureK; fissures retain molten floor
      float localMagmaTemp = mix(1200.0, max(1600.0, temperatureK), pow(subStellar, 0.8));
      vec3 moltenMagma = blackbody(localMagmaTemp);

      // Dayside expansive magma ocean: central substellar lake liquefies completely (subStellar > 0.65)
      float magmaOceanFactor = smoothstep(0.45, 0.85, subStellar);
      float convectiveRipples = fbmFast(vLocalPos * 16.0 + time * 0.06) * 0.25 + 0.75;
      vec3 activeOcean = moltenMagma * convectiveRipples * 1.35;

      // Composite surface: cooled crust broken by glowing fissures and transitioning to magma ocean
      vec3 crustWithFissures = mix(scorchedRegolith, moltenMagma * 1.2, deepFissures * (subStellar * 0.75 + 0.25));
      surface = mix(crustWithFissures, activeOcean, magmaOceanFactor);

      // Self-emissive thermal radiance: radiates intensely even on dark side near fissures
      float fissureEmissive = deepFissures * (subStellar * 0.8 + 0.35);
      float oceanEmissive = magmaOceanFactor * 1.1;
      emissiveColor = moltenMagma * (fissureEmissive + oceanEmissive);

      // Superheated mineral vapor & ionized metal haze atmosphere
      atmoColor = mix(vec3(0.85, 0.35, 0.10), vec3(1.0, 0.65, 0.25), subStellar);
      atmoStrength = 0.55 * (subStellar * 0.8 + 0.2);
    }
    // 10. KBO Tholin
    else if (themeIndex < 9.5) {
      float n = fbm(vLocalPos * 4.5 + effSeed);
      surface = mix(vec3(0.56, 0.32, 0.22) * effColorTint, vec3(0.80, 0.60, 0.46) * effColorTint, n * 0.5 + 0.5);
      atmoColor = vec3(0.55, 0.68, 0.85) * effColorTint;
      atmoStrength = 0.22;
    }
    // 11. Icy Moon / KBO Ice
    else if (themeIndex < 10.5) {
      float n = fbm(vLocalPos * 5.0 + effSeed);
      surface = mix(vec3(0.58, 0.68, 0.78) * effColorTint, vec3(0.90, 0.94, 0.98) * effColorTint, n * 0.5 + 0.5);
      atmoColor = vec3(0.45, 0.78, 1.0) * effColorTint;
      atmoStrength = 0.30;
    }
    // 12. Star / Solar Plasma
    else if (themeIndex < 11.5) {
      float plasma = fbm(vLocalPos * 4.0 + time * 0.15);
      surface = mix(vec3(1.0, 0.7, 0.2), vec3(1.0, 0.95, 0.7), plasma * 0.5 + 0.5) * 1.5;
      atmoColor = vec3(1.0, 0.6, 0.1);
      atmoStrength = 1.2;
    }
    // 13. Mirror World (Ultra-High Albedo Metallic Titanate/Silicate Clouds, e.g. LTT 9779 b)
    else if (themeIndex < 12.5) {
      // Differential zonal winds advecting metallic clouds
      vec3 flow = zonalJetFlow(vLocalPos, time, 0.03);
      vec3 warped = domainWarp(flow * 3.0 + seed, 0.35);
      float cloudDeck = fbm(warped);
      float microTexture = fbmFast(vLocalPos * 14.0);

      // Highly reflective silver-white enstatite and titanium dioxide cloud banks
      vec3 deepSilver = vec3(0.82, 0.86, 0.94);
      vec3 brilliantWhite = vec3(0.96, 0.98, 1.0);
      surface = mix(deepSilver, brilliantWhite, cloudDeck * 0.5 + 0.5);

      // Metallic multi-lobe specular sheen: reflects stellar light like polished liquid mercury / titanate crystals
      float sharpSpec = pow(specBase, 48.0) * rawNdotL * 1.8;
      float broadSheen = pow(specBase, 12.0) * rawNdotL * 0.65;
      specular = (sharpSpec + broadSheen) * (0.8 + microTexture * 0.2);

      // Iridescent forward-scattering horizon halo
      atmoColor = vec3(0.75, 0.88, 1.0);
      atmoStrength = 0.95;
    }
    // 14. Hycean Ocean World
    else if (themeIndex < 13.5) {
      vec3 warped = domainWarp(vLocalPos * 3.0 + effSeed, 0.45);
      float deepWater = fbm(warped);
      surface = mix(vec3(0.01, 0.08, 0.28) * effColorTint, vec3(0.04, 0.22, 0.50) * effColorTint, deepWater * 0.5 + 0.5);

      // Vast tropical cloud streamers & cyclonic storms with directional shadows
      vec4 hyceanClouds = evaluateCloudLayer(vLocalPos, L, time * 0.8, 0.62, effSeed * 1.7);

      // Deep global ocean specular reflection where unclouded
      float oceanSpec = pow(specBase, 28.0) * rawNdotL * 1.4;
      specular = oceanSpec * (1.0 - hyceanClouds.x);

      surface *= (1.0 - hyceanClouds.y * 0.50); // Drop shadows onto dark ocean abyss
      surface = mix(surface, vec3(0.92, 0.95, 1.0), hyceanClouds.x * 0.95);

      atmoColor = vec3(0.15, 0.75, 1.0) * effColorTint;
      atmoStrength = 0.90;
    }
    // 15. Hot Jupiter Dark Alkali (Sudarsky Class III, e.g. TrES-2b)
    else if (themeIndex < 14.5) {
      vec3 flow = zonalJetFlow(vLocalPos, time, 0.04);
      float latFreq = 14.0 + effBandShift * 6.0;
      vec3 bandPos = vec3(flow.x * 2.0, flow.y * latFreq, flow.z * 2.0);
      vec3 curl = curlNoise(flow * 3.0 + effSeed);
      float band = fbm(bandPos + curl * 1.2);
      // Deep cobalt and midnight indigo banding with subtle twilight bronze
      surface = mix(vec3(0.06, 0.08, 0.16) * effColorTint, vec3(0.18, 0.16, 0.32) * effColorTint, band * 0.5 + 0.5);
      atmoColor = vec3(0.35, 0.30, 0.65) * effColorTint;
      atmoStrength = 0.55;
      // Faint thermal twilight horizon for hot dark giants
      emissiveColor = vec3(0.7, 0.3, 0.1) * (pow(max(0.0, dot(vLocalPos, L)), 2.5) * 0.15);
    }
    // 16. Gas Giant Water Clouds (Sudarsky Class II)
    else {
      vec3 flow = zonalJetFlow(vLocalPos, time, 0.03);
      float latFreq = 18.0 + effBandShift * 8.0;
      vec3 bandPos = vec3(flow.x * 2.0, flow.y * latFreq, flow.z * 2.0);
      vec3 curl = curlNoise(flow * 3.0 + effSeed);
      float band = fbm(bandPos + curl * 1.5);
      surface = mix(vec3(0.15, 0.35, 0.58) * effColorTint, vec3(0.68, 0.78, 0.90) * effColorTint, band * 0.5 + 0.5);
      atmoColor = vec3(0.40, 0.65, 0.95) * effColorTint;
      atmoStrength = 0.70;
    }

    // Albedo modulation (scaled with a floor to guarantee visibility and contrast)
    float albedoFactor = clamp(albedo * 2.0 + 0.35, 0.40, 1.8);

    // Rayleigh scattering atmospheric limb glow (enhances horizon ring along dayside terminator)
    float terminatorFactor = smoothstep(-0.25, 0.45, dot(N, L));
    vec3 rayleighGlow = atmoColor * (fresnel * atmoStrength * (terminatorFactor * 0.7 + 0.3));

    vec3 finalColor = (surface * NdotL * albedoFactor) + rayleighGlow + vec3(specular) + emissiveColor;
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const getThemeIndex = (theme?: string): number => {
  switch (theme) {
    case 'terrestrial-rocky':
    case 'carbonaceous-asteroid':
      return 0.0;
    case 'terrestrial-ocean':
      return 1.0;
    case 'super-earth':
      return 2.0;
    case 'sub-neptune':
      return 3.0;
    case 'ice-giant':
      return 4.0;
    case 'gas-giant-banded':
      return 5.0;
    case 'hot-jupiter':
      return 6.0;
    case 'ultra-hot-jupiter':
      return 7.0;
    case 'lava-world':
      return 8.0;
    case 'kbo-tholin':
    case 'kbo-red-sedna':
    case 'kbo-dark':
      return 9.0;
    case 'kbo-ice':
      return 10.0;
    case 'star-plasma':
      return 11.0;
    case 'mirror-world':
      return 12.0;
    case 'hycean-ocean':
      return 13.0;
    case 'hot-jupiter-dark-alkali':
      return 14.0;
    case 'gas-giant-water-clouds':
      return 15.0;
    default:
      return 0.0;
  }
};

/**
 * 32-bit FNV-1a deterministic hash function producing normalized pseudorandom numbers [0, 1)
 */
export function hashStringToFloat(str: string, salt: number = 0): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

export interface PlanetBucketUniforms {
  seed: number;
  colorTint: THREE.Vector3;
  bandShift: number;
  bandTurbulence: number;
}

/**
 * Generates deterministic 32-bucket procedural parameters for Approach A.
 * Computes unique 3D spatial terrain seeds, band frequency modulations,
 * and calibrated multi-color palettes per bucket index (0..31).
 */
export function getPlanetBucketUniforms(themeIdx: number, bucket: number, tempK: number = 300): PlanetBucketUniforms {
  const normBucket = (bucket % 32) / 32.0;
  const h1 = hashStringToFloat(`bucket-${themeIdx}-${bucket}-seed`, 11);
  const h2 = hashStringToFloat(`bucket-${themeIdx}-${bucket}-tint`, 23);
  const h3 = hashStringToFloat(`bucket-${themeIdx}-${bucket}-band`, 37);

  // 1. Spatial 3D noise coordinate seed (different landmasses, mountain cordilleras, and storm systems)
  const seed = h1 * 987.65 + bucket * 31.4159;

  // 2. Band frequency and jet-shear displacement (12 to 34 distinct latitudinal bands)
  const bandShift = (h3 - 0.5) * 0.8;
  const bandTurbulence = 0.8 + h1 * 0.6;

  // 3. Physical multi-color tint variations tailored by archetype
  const tint = new THREE.Vector3(1.0, 1.0, 1.0);

  // Gas Giant Banded (themeIdx == 5.0)
  if (themeIdx >= 4.5 && themeIdx < 5.5) {
    // 32 variations spanning pale ivory, butterscotch, salmon-ochre, warm terracotta, and amber bronze
    const r = 0.82 + h2 * 0.35;
    const g = 0.75 + (h3 - 0.5) * 0.28;
    const b = 0.65 + (h1 - 0.5) * 0.35;
    tint.set(r, g, b);
  }
  // Ice Giant & Sub-Neptune (themeIdx == 3.0 or 4.0)
  else if (themeIdx >= 2.5 && themeIdx < 4.5) {
    // 32 variations spanning aquamarine, cyan-azure, deep sapphire, turquoise, and sea-green
    const r = 0.70 + (h2 - 0.5) * 0.30;
    const g = 0.85 + (h3 - 0.5) * 0.22;
    const b = 0.95 + h1 * 0.30;
    tint.set(r, g, b);
  }
  // Hot Jupiter Dark Alkali (themeIdx == 14.0)
  else if (themeIdx >= 13.5 && themeIdx < 14.5) {
    // Deep cobalt, midnight slate indigo, graphite-violet, or dark bronze
    const r = 0.75 + (h2 - 0.5) * 0.35;
    const g = 0.75 + (h3 - 0.5) * 0.30;
    const b = 0.90 + h1 * 0.40;
    tint.set(r, g, b);
  }
  // Gas Giant Water Clouds (themeIdx == 15.0)
  else if (themeIdx >= 14.5) {
    // Stormy pale azure, cool steel blue, or misty celadon
    const r = 0.80 + (h2 - 0.5) * 0.25;
    const g = 0.88 + (h3 - 0.5) * 0.22;
    const b = 0.95 + (h1 - 0.5) * 0.20;
    tint.set(r, g, b);
  }
  // Hot Jupiter Silicates (themeIdx == 6.0)
  else if (themeIdx >= 5.5 && themeIdx < 6.5) {
    // Burnt sienna, copper, dark amber, and crimson clouds
    const r = 0.95 + h2 * 0.30;
    const g = 0.75 + (h3 - 0.5) * 0.25;
    const b = 0.60 + (h1 - 0.5) * 0.25;
    tint.set(r, g, b);
  }
  // Super-Earth (themeIdx == 2.0)
  else if (themeIdx >= 1.5 && themeIdx < 2.5) {
    // Iron-rust red, volcanic basalt, arid ochre plateaus, and clay formations
    const r = 0.80 + h2 * 0.40;
    const g = 0.78 + (h3 - 0.5) * 0.30;
    const b = 0.70 + (h1 - 0.5) * 0.35;
    tint.set(r, g, b);
  }
  // Terrestrial Rocky (themeIdx == 0.0)
  else if (themeIdx < 0.5) {
    // Lunar grey basalt, Martian red dust, or dark carbonaceous regolith
    const r = 0.85 + h2 * 0.30;
    const g = 0.82 + (h3 - 0.5) * 0.25;
    const b = 0.80 + (h1 - 0.5) * 0.25;
    tint.set(r, g, b);
  }
  // Hycean Ocean & Terrestrial Ocean (themeIdx == 1.0 or 13.0)
  else if ((themeIdx >= 0.5 && themeIdx < 1.5) || (themeIdx >= 12.5 && themeIdx < 13.5)) {
    // Azure turquoise, deep cobalt abyss, sapphire archipelago, and dark cerulean
    const r = 0.72 + (h2 - 0.5) * 0.25;
    const g = 0.90 + (h3 - 0.5) * 0.20;
    const b = 0.98 + h1 * 0.25;
    tint.set(r, g, b);
  } else {
    const r = 0.90 + (h2 - 0.5) * 0.20;
    const g = 0.90 + (h3 - 0.5) * 0.20;
    const b = 0.90 + (h1 - 0.5) * 0.20;
    tint.set(r, g, b);
  }

  return { seed, colorTint: tint, bandShift, bandTurbulence };
}
