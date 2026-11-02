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

  // Habitable planetary biome uniforms (custom soil & vegetation pigmentation)
  uniform vec3 lowlandColor;
  uniform vec3 savannaColor;
  uniform vec3 plateauColor;
  uniform vec3 oceanShallowColor;
  uniform vec3 oceanDeepColor;
  uniform float iceCapLatitude;

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
  // Computes azimuthal velocity variation across latitude bands with smooth longitudinal fluid shearing
  vec3 zonalJetFlow(vec3 p, float t, float speed) {
    float lat = p.y; // -1 to 1 latitude
    // Smooth alternating eastward and westward jet streams with equatorial super-rotation
    float jetShear = sin(lat * 9.424) * 0.65 + cos(lat * 4.712) * 0.35;
    float theta = atan(p.z, p.x);
    float r = length(p.xz);
    float angleShift = theta + (speed * t * (1.0 + jetShear));
    return vec3(r * cos(angleShift), lat, r * sin(angleShift));
  }

  // Anisotropic fluid shearing for silky, laminar gas bands (avoids flattened isotropic bumpiness)
  // Coordinates are compressed along latitude and stretched along flow lines
  float fluidJetStream(vec3 flow, float latFrequency, float turbulence, float seedVal) {
    // 1. Primary zonal flow coordinates: heavily stretched along azimuth, compressed along latitude
    vec3 stretchedPos = vec3(flow.x * 0.35, flow.y * latFrequency, flow.z * 0.35);
    
    // 2. Large sweeping undulations (domain warping at low frequency for silky wave motion)
    vec2 wave = vec2(
      snoise(vec3(flow.x * 0.8, flow.y * 2.2, flow.z * 0.8) + seedVal),
      snoise(vec3(flow.z * 0.8, flow.y * 2.2 + 3.1, flow.x * 0.8) + seedVal)
    );
    vec3 warpedPos = stretchedPos + vec3(wave.x * 0.45, wave.y * 0.35, wave.x * 0.45) * turbulence;

    // 3. Smooth, low-octave fluid ribbon sampling
    float primaryBand = snoise(warpedPos);
    float secondaryRibbon = snoise(warpedPos * 1.8 + vec3(1.7, 0.4, 2.3)) * 0.4;
    
    return primaryBand + secondaryRibbon * turbulence;
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
  // Evaluates multi-scale synoptic weather systems, cyclonic vortices, fractal cumulus billows,
  // delicate high-altitude cirrus filaments, and directional drop shadows
  vec4 evaluateCloudLayer(vec3 p, vec3 lightDirVec, float timeVal, float coverage, float cloudSeed) {
    float lat = p.y;
    // Latitudinal Coriolis jet shear: equatorial trade winds drift westward, mid-latitude westerlies drift eastward
    float coriolis = sin(lat * 3.14159 * 2.0) * 0.22;
    vec3 advect = vec3(timeVal * 0.025 + coriolis * timeVal * 0.04, timeVal * 0.006, timeVal * 0.015);
    vec3 cloudCoord = p + advect + cloudSeed;

    // 1. Synoptic Weather Systems & Cyclonic Swirl (Domain Warping)
    vec3 warpedCoord = domainWarp(cloudCoord * 2.4, 0.38);
    float synoptic = fbm(warpedCoord);

    // 2. Multi-Scale Cumulus Billows with Fractal Edge Detail
    float microDetail = snoise(cloudCoord * 8.5 + synoptic * 0.5);
    float fineDetail = snoise(cloudCoord * 18.0) * 0.25;
    float billowNoise = synoptic + microDetail * 0.22 + fineDetail * 0.12;

    // Sharp condensation boundary (fractal edges rather than blurry gradient)
    float cumulusThreshold = 1.0 - coverage;
    float cumulus = smoothstep(cumulusThreshold, cumulusThreshold + 0.18, billowNoise);
    // Enhance internal cloud core thickness
    float cloudCore = smoothstep(cumulusThreshold + 0.08, cumulusThreshold + 0.28, billowNoise);

    // 3. Delicate High-Altitude Cirrus Filaments & Jet Stream Streamers
    vec3 cirrusCoord = vec3(cloudCoord.x * 1.5, cloudCoord.y * 5.0, cloudCoord.z * 1.5) + vec3(timeVal * 0.04, 0.0, timeVal * 0.03);
    float cirrusFbm = snoise(cirrusCoord) * 0.65 + snoise(cirrusCoord * 2.4) * 0.35;
    float cirrus = smoothstep(0.42, 0.72, cirrusFbm) * (1.0 - cumulus * 0.8) * 0.42;

    // Total combined cloud optical density
    float totalCloud = clamp(cumulus + cirrus, 0.0, 1.0);

    // 4. Directional Drop Shadow: projected along stellar illumination vector L onto surface below
    vec3 shadowCoord = domainWarp((cloudCoord + lightDirVec * 0.042) * 2.4, 0.38);
    float shadowNoise = fbmFast(shadowCoord);
    float shadowMask = smoothstep(cumulusThreshold, cumulusThreshold + 0.18, shadowNoise);

    return vec4(totalCloud, shadowMask, cloudCore, cirrus);
  }

  void main() {
    #include <logdepthbuf_fragment>
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);
    vec3 L = normalize(lightDir);

    float effSeed = seed;
    vec3 effColorTint = colorTint.r > 0.01 ? colorTint : vec3(1.0);
    float effBandShift = bandShift;

    // Multi-directional celestial illumination model:
    // 1. Direct key sunlight from stellar source (L)
    float directLight = max(0.0, dot(N, L));
    // 2. Soft starlight / galactic ambient fill (guarantees surface geology, craters, and continents are always crisply legible from any camera angle)
    float ambientFill = 0.40;
    // 3. Subtle rim backlight to silhouette the spherical limb against deep space
    float rimFill = max(0.0, dot(N, -L)) * 0.18;
    float NdotL = clamp(directLight * 0.72 + ambientFill + rimFill, 0.40, 1.25);
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
      
      // Procedural impact craters and ray ejecta patterns for authentic rocky silicate geology
      float craterNoise = fbmFast(vLocalPos * 22.0 + effSeed * 1.7);
      float craters = smoothstep(0.68, 0.92, craterNoise);

      // Temperature-driven regolith & lithosphere physics:
      // A. Cold / Frozen Silicate (<280K): Moon/Mercury style silvery-grey regolith with bright anorthosite highlands and polar frost
      // B. Warm / Martian Arid (280K - 550K): Iron-oxide rust, terracotta canyon floors, and bright ochre sandstone highlands
      // C. Scorched Furnace (550K - 1350K, e.g. Kepler-131 c, Kepler-37 b): Volcanic basalt basins, warm bronze-tan highlands, crater rays
      vec3 lowBasin;
      vec3 highRidge;
      if (temperatureK < 280.0) {
        lowBasin = mix(vec3(0.42, 0.42, 0.44), vec3(0.54, 0.52, 0.50), micro) * effColorTint;
        highRidge = mix(vec3(0.72, 0.70, 0.68), vec3(0.88, 0.86, 0.84), micro) * effColorTint;
      } else if (temperatureK < 550.0) {
        lowBasin = mix(vec3(0.52, 0.28, 0.18), vec3(0.66, 0.38, 0.24), micro) * effColorTint;
        highRidge = mix(vec3(0.78, 0.52, 0.34), vec3(0.92, 0.68, 0.48), micro) * effColorTint;
      } else {
        // High-temperature rocky worlds (550K - 1350K, e.g. Kepler-131 c, Kepler-37 b):
        // Highly visible volcanic basalt basins, warm bronze-tan highlands, and bright silicate impact ejecta
        lowBasin = mix(vec3(0.44, 0.36, 0.32), vec3(0.58, 0.46, 0.40), micro) * effColorTint;
        highRidge = mix(vec3(0.76, 0.64, 0.52), vec3(0.90, 0.78, 0.66), micro) * effColorTint;
      }
      surface = mix(lowBasin, highRidge, elevation);

      // Add bright impact crater ray rims
      surface = mix(surface, vec3(0.92, 0.88, 0.82) * effColorTint, craters * 0.45);

      // Polar frost caps: only on cold planets (<280K) where frost can condense
      if (temperatureK < 280.0 && iceCapLatitude > 0.05) {
        float lat = abs(vLocalPos.y);
        float frostThreshold = clamp(iceCapLatitude + (temperatureK - 100.0) * 0.0015, 0.65, 0.94);
        if (lat > frostThreshold) {
          float frostNoise = fbm(vLocalPos * 8.0 + effSeed);
          float frost = smoothstep(frostThreshold, frostThreshold + 0.08, lat + frostNoise * 0.06);
          surface = mix(surface, vec3(0.92, 0.95, 0.98), frost * 0.85);
        }
      }

      // Faint thermal glow along sunlit fissures for scorched rocky worlds (>850K)
      if (temperatureK > 850.0) {
        float fissure = smoothstep(0.75, 0.92, elevation);
        float subStellar = max(0.0, dot(vLocalPos, L));
        vec3 thermalGlow = blackbody(min(1400.0, temperatureK));
        emissiveColor = thermalGlow * fissure * (subStellar * 0.45 + 0.15);
      }

      // Atmosphere: truly airless for hot worlds (T > 550K); thin exosphere for cold/temperate
      if (temperatureK > 550.0) {
        atmoColor = vec3(0.0);
        atmoStrength = 0.0; // Airless: sharp vacuum shadows
      } else if (temperatureK > 280.0) {
        atmoColor = vec3(0.85, 0.55, 0.35) * effColorTint; // Martian dust haze
        atmoStrength = 0.15;
      } else {
        atmoColor = vec3(0.55, 0.68, 0.82) * effColorTint; // Thin cold exosphere
        atmoStrength = 0.10;
      }
    }
    // 2. Terrestrial Ocean World (Earth-like / Potentially Habitable)
    else if (themeIndex < 1.5) {
      vec3 warped = domainWarp(vLocalPos * 2.6 + effSeed, 0.45);
      float continental = fbm(warped); // Low-frequency continental land/ocean mask
      float mountain = ridgedFbm(warped * 2.2); // Razor-sharp alpine cordilleras
      float lat = abs(vLocalPos.y);

      // Multi-tier Bathymetry and Sea Color Grading
      // Fallback colors if uniforms are default
      vec3 deepColor = oceanDeepColor.r > 0.001 || oceanDeepColor.b > 0.001 ? oceanDeepColor : (vec3(0.012, 0.08, 0.28) * effColorTint);
      vec3 shelfColor = oceanShallowColor.r > 0.001 || oceanShallowColor.b > 0.001 ? oceanShallowColor : (vec3(0.04, 0.44, 0.62) * effColorTint);

      // Temperature modulation of oceans:
      // Frigid (<250K): Frozen steel-blue sea-ice
      if (temperatureK < 250.0) {
        deepColor = mix(deepColor, vec3(0.42, 0.55, 0.68), 0.75);
        shelfColor = mix(shelfColor, vec3(0.68, 0.80, 0.88), 0.85);
      }

      // High-resolution ocean surface micro-waves (ripples & capillary facets)
      float wave = snoise(vLocalPos * 38.0 + time * 0.06) * 0.5 + snoise(vLocalPos * 76.0 - time * 0.09) * 0.25;

      // A. Ocean Bathymetry & Coastal Shelves (continental < 0.05)
      if (continental < 0.05) {
        // 4-Tier Bathymetry:
        // 1. Abyssal Trench: ink-depth light absorption
        vec3 abyssalColor = deepColor * 0.45;
        // 2. Pelagic Open Ocean: primary deepColor
        // 3. Continental Shelf: vibrant shelfColor
        // 4. Coastal Lagoon / Reef: luminous tropical shallows
        vec3 lagoonColor = mix(shelfColor * 1.35, vec3(0.25, 0.95, 0.85) * shelfColor, 0.35);

        float depthTrench = smoothstep(-0.65, -0.25, continental);
        float depthShelf = smoothstep(-0.25, -0.04, continental);
        float depthLagoon = smoothstep(-0.04, 0.04, continental);

        vec3 sea = mix(abyssalColor, deepColor, depthTrench);
        sea = mix(sea, shelfColor, depthShelf);
        sea = mix(sea, lagoonColor, depthLagoon);

        // Subtle micro-wave color modulation
        sea += sea * (wave * 0.08);

        // Coastal beach sand & surf fringe right at the shoreline (continental: 0.035 to 0.05)
        float surf = smoothstep(0.035, 0.05, continental);
        vec3 beachSand = mix(vec3(0.88, 0.82, 0.68), vec3(0.95, 0.95, 0.98), surf); // Sand to surf foam
        surface = mix(sea, beachSand, surf * 0.65);
      }
      // B. Continental Landmass & Biome Stratification (continental >= 0.05)
      else {
        float landElevation = smoothstep(0.05, 0.65, continental) * 0.6 + mountain * 0.4;
        
        // Custom soil & botanical pigmentation across elevation
        vec3 lowlands = lowlandColor.r > 0.001 || lowlandColor.g > 0.001 ? lowlandColor : (vec3(0.12, 0.38, 0.14) * effColorTint);
        vec3 savanna = savannaColor.r > 0.001 || savannaColor.g > 0.001 ? savannaColor : (vec3(0.38, 0.45, 0.22) * effColorTint);
        vec3 plateau = plateauColor.r > 0.001 || plateauColor.g > 0.001 ? plateauColor : (vec3(0.54, 0.46, 0.30) * effColorTint);
        vec3 mountainPeak = vec3(0.72, 0.70, 0.68) * effColorTint;

        vec3 biome = mix(lowlands, savanna, smoothstep(0.08, 0.32, landElevation));
        biome = mix(biome, plateau, smoothstep(0.32, 0.62, landElevation));
        biome = mix(biome, mountainPeak, smoothstep(0.62, 0.88, landElevation));
        
        // Fine micro-relief on land
        float landMicro = snoise(vLocalPos * 16.0);
        biome += biome * (landMicro * 0.08);

        surface = biome;
      }

      // C. Latitude & Temperature-Controlled Polar Glacial Ice Caps
      float baseThreshold = iceCapLatitude > 0.1 ? iceCapLatitude : 0.72;
      float polarThreshold = clamp(baseThreshold + (temperatureK - 260.0) * 0.0022, 0.48, 0.96);
      if (lat > polarThreshold && temperatureK < 315.0) {
        float iceNoise = fbm(vLocalPos * 6.0 + effSeed);
        float iceCap = smoothstep(polarThreshold, polarThreshold + 0.10, lat + iceNoise * 0.08);
        surface = mix(surface, vec3(0.92, 0.96, 1.0), iceCap);
      }

      // D. High-Quality Directional Cloud Decks & Drop Shadows
      vec4 clouds = evaluateCloudLayer(vLocalPos, L, time, 0.54, effSeed * 2.3);
      float cloudMask = clouds.x;
      float shadowMask = clouds.y;
      float cloudCore = clouds.z;

      // Specular ocean sun glint: water reflects sharp sunlight where unclouded; land is matte
      if (continental < 0.05 && temperatureK >= 250.0) {
        float oceanSpec = pow(specBase, 36.0) * rawNdotL * 1.6;
        // Modulate with micro-waves for glistening liquid water
        oceanSpec *= clamp(0.75 + wave * 0.5, 0.2, 1.4);
        // Water Fresnel limb reflection
        oceanSpec += pow(1.0 - max(0.0, dot(N, V)), 5.0) * 0.35 * rawNdotL;
        specular = oceanSpec * (1.0 - cloudMask);
      }

      // Directional drop shadow cast onto surface beneath
      float directShadow = shadowMask * clamp(rawNdotL * 1.5, 0.0, 1.0) * 0.55;
      surface *= (1.0 - directShadow);

      // Cloud shading: subtle terminator attenuation and forward scattering
      vec3 cumulusColor = vec3(0.97, 0.98, 1.0);
      vec3 cirrusColor = vec3(0.92, 0.95, 0.99);
      vec3 cloudColor = mix(cirrusColor, cumulusColor, cloudCore / max(0.01, cloudMask));
      float cloudLighting = clamp(dot(N, L) * 0.65 + 0.35, 0.30, 1.0);
      cloudColor *= cloudLighting;

      // Blend clouds onto surface
      surface = mix(surface, cloudColor, cloudMask * 0.94);

      // Subtle forward scattering silver lining on cloud edges
      float cloudGlint = pow(specBase, 12.0) * (cloudMask - cloudCore) * 0.35;
      specular += cloudGlint;

      atmoColor = mix(vec3(0.32, 0.65, 1.0), shelfColor * 1.5, 0.22) * effColorTint;
      atmoStrength = 0.80;
    }
    // 3. Super-Earth (Dynamic Atmospheric & Thermal Regimes)
    else if (themeIndex < 2.5) {
      vec3 warped = domainWarp(vLocalPos * 3.0 + effSeed, 0.50);
      float tectonic = ridgedFbm(warped);
      float micro = fbm(vLocalPos * 12.0);

      // Physical Regimes based on Temperature:
      // A. Cold Super-Earth (<280K): Glaciated plateaus, permafrost tundra, pale azure haze
      // B. Temperate Arid Super-Earth (280K - 480K): Ochre plateaus, terracotta canyon lands, rust haze
      // C. Venusian Super-Earth (480K - 850K): Dense sulfuric/CO2 cloud blankets (creamy golden-yellow)
      // D. Scorched Sub-Magma (>850K): Volcanic basalt, copper-iron highlands, glowing tectonic rifts
      vec3 land;
      if (temperatureK < 280.0) {
        vec3 tundraLow = mix(vec3(0.42, 0.48, 0.52), vec3(0.56, 0.62, 0.60), micro) * effColorTint;
        vec3 glacialHigh = mix(vec3(0.78, 0.86, 0.92), vec3(0.92, 0.95, 0.98), micro) * effColorTint;
        land = mix(tundraLow, glacialHigh, smoothstep(0.3, 0.75, tectonic));
        atmoColor = vec3(0.50, 0.72, 0.92) * effColorTint;
        atmoStrength = 0.60;
      } else if (temperatureK < 480.0) {
        vec3 canyonBasin = vec3(0.48, 0.28, 0.20) * effColorTint;
        vec3 ironDesert = vec3(0.72, 0.46, 0.30) * effColorTint;
        vec3 highlandGranite = vec3(0.86, 0.70, 0.54) * effColorTint;
        land = mix(canyonBasin, ironDesert, smoothstep(0.2, 0.55, tectonic));
        land = mix(land, highlandGranite, smoothstep(0.55, 0.85, tectonic + micro * 0.2));
        atmoColor = vec3(0.78, 0.58, 0.42) * effColorTint; // Amber Rayleigh dust haze
        atmoStrength = 0.55;
      } else if (temperatureK < 850.0) {
        // Venusian super-critical CO2 & sulfuric haze atmosphere
        vec3 sulfurCloudLow = vec3(0.82, 0.72, 0.48) * effColorTint;
        vec3 sulfurCloudHigh = vec3(0.96, 0.92, 0.74) * effColorTint;
        land = mix(sulfurCloudLow, sulfurCloudHigh, smoothstep(0.2, 0.8, tectonic + micro * 0.3));
        atmoColor = vec3(0.94, 0.86, 0.55) * effColorTint; // Thick golden sulfur haze
        atmoStrength = 0.88;
      } else {
        // Scorched sub-magma world (850K - 1350K)
        vec3 darkCrust = vec3(0.42, 0.32, 0.26) * effColorTint;
        vec3 ironHighland = vec3(0.68, 0.48, 0.36) * effColorTint;
        land = mix(darkCrust, ironHighland, smoothstep(0.3, 0.75, tectonic));
        
        // Incandescent tectonic stress rifts
        float rift = smoothstep(0.68, 0.90, tectonic);
        float subStellar = max(0.0, dot(vLocalPos, L));
        vec3 thermalGlow = blackbody(min(1600.0, temperatureK));
        emissiveColor = thermalGlow * rift * (subStellar * 0.60 + 0.25);

        atmoColor = vec3(0.88, 0.45, 0.22) * effColorTint; // Scorched mineral vapor
        atmoStrength = 0.45;
      }

      surface = land;
    }
    // 4. Sub-Neptune (H2/He envelope with methane/ammonia haze: varied between smooth pastel Uranus-like and silky flowing Neptune-like jet streams)
    else if (themeIndex < 3.5) {
      vec3 flow = zonalJetFlow(vLocalPos, time, 0.025);
      // Band frequency scales with turbulence: few broad bands (latFreq ~ 4-7) vs many dense bands (latFreq ~ 14-22)
      float latFreq = mix(5.0, 18.0, smoothstep(0.40, 1.40, bandTurbulence)) + effBandShift * 4.0;
      float band = fluidJetStream(flow, latFreq, bandTurbulence, effSeed);

      // Temperature & composition palettes:
      // Cold (<220K): Vivid deep sapphire azure & electric cyan ribbons (Image 1 & 2)
      // Temperate (220-500K): Photochemical haze soft aquamarine, sea-green, and turquoise
      // Warm/Hot (>500K): Hydrocarbon smog, slate-teal, and lilac/mauve haze
      vec3 deepTone;
      vec3 lightTone;
      if (temperatureK < 220.0) {
        deepTone = vec3(0.04, 0.20, 0.58) * effColorTint;
        lightTone = vec3(0.24, 0.70, 0.88) * effColorTint;
      } else if (temperatureK < 500.0) {
        deepTone = vec3(0.06, 0.32, 0.48) * effColorTint;
        lightTone = vec3(0.32, 0.76, 0.75) * effColorTint;
      } else {
        deepTone = vec3(0.24, 0.26, 0.42) * effColorTint;
        lightTone = vec3(0.52, 0.56, 0.68) * effColorTint;
      }

      // Smooth vs Silky Jet Stream Archetypes:
      // bandTurbulence modulates band contrast & intensity: low = smooth velvety orb, high = silky sweeping jet stream ribbons
      float jetContrast = smoothstep(0.55, 1.35, bandTurbulence);
      float smoothGradient = smoothstep(-1.0, 1.0, vLocalPos.y) * 0.12; // Gentle pole-to-equator insolation gradient
      vec3 smoothAtmosphere = mix(deepTone, lightTone, 0.5 + smoothGradient);
      vec3 bandedAtmosphere = mix(deepTone, lightTone, smoothstep(-0.6, 0.6, band));

      surface = mix(smoothAtmosphere, bandedAtmosphere, jetContrast);
      atmoColor = mix(vec3(0.28, 0.65, 0.98), vec3(0.35, 0.82, 0.85), clamp(temperatureK / 700.0, 0.0, 1.0)) * effColorTint;
      atmoStrength = 0.85;
    }
    // 5. Ice Giant (Uranus / Neptune-like methane atmosphere)
    else if (themeIndex < 4.5) {
      vec3 flow = zonalJetFlow(vLocalPos, time, 0.02);
      // Band frequency scales with turbulence: few broad bands (latFreq ~ 4-6) vs many dense bands (latFreq ~ 12-18)
      float latFreq = mix(4.5, 15.0, smoothstep(0.40, 1.40, bandTurbulence)) + effBandShift * 4.0;
      float band = fluidJetStream(flow, latFreq, bandTurbulence, effSeed);

      // Temperature & methane composition colors:
      vec3 deepMethane = mix(vec3(0.08, 0.40, 0.62), vec3(0.03, 0.18, 0.68), clamp((150.0 - temperatureK) / 100.0, 0.0, 1.0)) * effColorTint;
      vec3 lightMethane = mix(vec3(0.32, 0.75, 0.88), vec3(0.25, 0.68, 0.96), clamp((150.0 - temperatureK) / 100.0, 0.0, 1.0)) * effColorTint;

      // Smooth (Uranus-like cyan sphere) vs Active Silky Jet Streams (Neptune-like dark azure bands with high-albedo wisps)
      float jetContrast = smoothstep(0.55, 1.30, bandTurbulence);
      vec3 smoothUranus = mix(deepMethane, lightMethane, 0.5);
      vec3 activeNeptune = mix(deepMethane, lightMethane, smoothstep(-0.6, 0.6, band));

      // Delicate high-altitude methane ice cloud streamers
      if (jetContrast > 0.35) {
        float cirrus = smoothstep(0.45, 0.80, snoise(vec3(flow.x * 0.4, flow.y * 18.0, flow.z * 0.4) + effSeed * 2.1));
        activeNeptune = mix(activeNeptune, vec3(0.85, 0.94, 1.0), cirrus * (jetContrast - 0.35) * 0.65);
      }

      surface = mix(smoothUranus, activeNeptune, jetContrast);
      atmoColor = vec3(0.30, 0.68, 0.96) * effColorTint;
      atmoStrength = 0.85;
    }
    // 6. Gas Giant Banded (Jupiter/Saturn-like Class I with rich multi-tone latitudinal banding & smooth Jovian archetypes)
    else if (themeIndex < 5.5) {
      vec3 flow = zonalJetFlow(vLocalPos, time, 0.03);
      // Band frequency scales with turbulence: few broad zones (latFreq ~ 6-9) vs many dense belts (latFreq ~ 18-28)
      float latFreq = mix(6.0, 22.0, smoothstep(0.45, 1.45, bandTurbulence)) + effBandShift * 5.0;
      float band = fluidJetStream(flow, latFreq, bandTurbulence, effSeed);
      
      // Multi-tone latitudinal atmospheric bands:
      // Equatorial Zone, Tropical Belts, Temperate Zones, and Polar Hoods
      vec3 darkBelt = vec3(0.52, 0.25, 0.14) * effColorTint;
      vec3 warmOchre = vec3(0.76, 0.50, 0.30) * effColorTint;
      vec3 paleZone = vec3(0.90, 0.84, 0.72) * effColorTint;
      vec3 brightAmmonia = vec3(0.98, 0.95, 0.88) * effColorTint;

      // 4-stop silky gradient across the fluid jet stream value
      float tBand = smoothstep(-0.85, 0.85, band);
      vec3 bandedSurface;
      if (tBand < 0.33) {
        bandedSurface = mix(darkBelt, warmOchre, tBand / 0.33);
      } else if (tBand < 0.66) {
        bandedSurface = mix(warmOchre, paleZone, (tBand - 0.33) / 0.33);
      } else {
        bandedSurface = mix(paleZone, brightAmmonia, (tBand - 0.66) / 0.34);
      }

      // Smooth Jovian Archetype (Image 2) vs Few Bands vs Many Dense Belts (Jupiter)
      float jetContrast = smoothstep(0.55, 1.30, bandTurbulence);
      vec3 smoothJovian = mix(warmOchre, paleZone, 0.5 + smoothstep(-1.0, 1.0, vLocalPos.y) * 0.15);
      vec3 compositeSurface = mix(smoothJovian, bandedSurface, jetContrast);

      // Latitudinal polar hoods (cool bluish-grey haze at extreme latitudes)
      float polarLat = abs(vLocalPos.y);
      if (polarLat > 0.75) {
        vec3 polarHaze = vec3(0.65, 0.72, 0.80) * effColorTint;
        compositeSurface = mix(compositeSurface, polarHaze, smoothstep(0.75, 0.95, polarLat) * 0.65);
      }

      surface = compositeSurface;

      atmoColor = vec3(0.85, 0.75, 0.58) * effColorTint;
      atmoStrength = 0.55;
    }
    // 7. Hot Jupiter (Silicate/Iron clouds, Class IV)
    else if (themeIndex < 6.5) {
      vec3 flow = zonalJetFlow(vLocalPos, time, 0.04);
      float latFreq = 14.0 + effBandShift * 6.0;
      float band = fluidJetStream(flow, latFreq, bandTurbulence, effSeed);
      surface = mix(vec3(0.40, 0.15, 0.09) * effColorTint, vec3(0.75, 0.38, 0.18) * effColorTint, smoothstep(-0.7, 0.7, band));
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
    // 10. KBO Tholin (e.g. Quaoar, Varuna, Ixion, Chaos)
    else if (themeIndex < 9.5) {
      vec3 warped = domainWarp(vLocalPos * 3.2 + effSeed, 0.35);
      float n = fbm(warped * 1.5);
      float micro = fbmFast(vLocalPos * 12.0);
      // Dark reddish-brown irradiated hydrocarbon tholin crust
      vec3 darkTholin = mix(vec3(0.35, 0.16, 0.10), vec3(0.48, 0.22, 0.14), micro) * effColorTint;
      vec3 brightTholin = mix(vec3(0.65, 0.38, 0.26), vec3(0.78, 0.48, 0.34), micro) * effColorTint;
      surface = mix(darkTholin, brightTholin, n * 0.5 + 0.5);
      atmoColor = vec3(0.55, 0.40, 0.35) * effColorTint;
      atmoStrength = 0.08; // Airless / trace exosphere
    }
    // 11. Icy Moon / KBO Ice (e.g. Eris, Haumea, Makemake, Orcus, 2002 MS4)
    else if (themeIndex < 10.5) {
      vec3 warped = domainWarp(vLocalPos * 4.0 + effSeed, 0.30);
      float n = fbm(warped);
      float micro = fbmFast(vLocalPos * 16.0);
      // Clean nitrogen, methane, and water ice bedrock:
      // High albedo (Eris ~0.96, Haumea ~0.80) with subtle crystalline frost graining
      vec3 deepIce = mix(vec3(0.72, 0.78, 0.84), vec3(0.85, 0.88, 0.92), micro) * effColorTint;
      vec3 brightFrost = mix(vec3(0.92, 0.95, 0.98), vec3(0.98, 0.99, 1.0), micro) * effColorTint;
      surface = mix(deepIce, brightFrost, n * 0.5 + 0.5);
      atmoColor = vec3(0.65, 0.82, 1.0) * effColorTint;
      atmoStrength = 0.12; // Trace nitrogen frost exosphere
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
      vec3 deepColor = oceanDeepColor.r > 0.001 || oceanDeepColor.b > 0.001 ? oceanDeepColor : (vec3(0.010, 0.06, 0.26) * effColorTint);
      vec3 shallowColor = oceanShallowColor.r > 0.001 || oceanShallowColor.b > 0.001 ? oceanShallowColor : (vec3(0.04, 0.35, 0.72) * effColorTint);

      vec3 warped = domainWarp(vLocalPos * 2.8 + effSeed, 0.45);
      float convectiveDepth = fbm(warped);
      float oceanicCurrent = ridgedFbm(warped * 2.2);
      float wave = snoise(vLocalPos * 42.0 + time * 0.08) * 0.5;

      // Multi-tier deep water mantle & equatorial upwelling currents
      vec3 abyss = deepColor * 0.40;
      vec3 pelagic = deepColor;
      vec3 currentPlume = shallowColor;

      vec3 sea = mix(abyss, pelagic, smoothstep(-0.5, 0.2, convectiveDepth));
      sea = mix(sea, currentPlume, smoothstep(0.3, 0.8, oceanicCurrent) * 0.65);
      sea += sea * (wave * 0.06);
      surface = sea;

      // Vast tropical cloud streamers & cyclonic storms with directional shadows
      vec4 hyceanClouds = evaluateCloudLayer(vLocalPos, L, time * 0.8, 0.64, effSeed * 1.7);
      float cloudMask = hyceanClouds.x;
      float shadowMask = hyceanClouds.y;
      float cloudCore = hyceanClouds.z;

      // Deep global ocean specular reflection where unclouded
      float oceanSpec = pow(specBase, 32.0) * rawNdotL * 1.6;
      oceanSpec *= clamp(0.75 + wave * 0.5, 0.2, 1.4);
      oceanSpec += pow(1.0 - max(0.0, dot(N, V)), 5.0) * 0.40 * rawNdotL;
      specular = oceanSpec * (1.0 - cloudMask);

      // Directional drop shadows onto dark ocean abyss
      float directShadow = shadowMask * clamp(rawNdotL * 1.5, 0.0, 1.0) * 0.55;
      surface *= (1.0 - directShadow);

      // Billowing high-albedo cloud deck with delicate forward scattering
      vec3 cloudColor = vec3(0.94, 0.97, 1.0) * clamp(dot(N, L) * 0.65 + 0.35, 0.30, 1.0);
      surface = mix(surface, cloudColor, cloudMask * 0.95);

      float cloudGlint = pow(specBase, 12.0) * (cloudMask - cloudCore) * 0.35;
      specular += cloudGlint;

      // Thick hydrogen Rayleigh scattering limb
      atmoColor = mix(vec3(0.18, 0.72, 1.0), shallowColor * 1.4, 0.30) * effColorTint;
      atmoStrength = 0.92;
    }
    // 15. Hot Jupiter Dark Alkali (Sudarsky Class III, e.g. TrES-2b, WASP-12b precursors)
    else if (themeIndex < 14.5) {
      vec3 flow = zonalJetFlow(vLocalPos, time, 0.035);
      float latFreq = 12.0 + effBandShift * 5.0;
      float band = fluidJetStream(flow, latFreq, bandTurbulence, effSeed);

      // Deep, luminous alkali absorption colors with high contrast:
      // Intense atmospheric sodium (Na D lines) and potassium (K I) absorption creates:
      // Deep midnight cobalt, glowing amethyst-plum, and twilight bronze equatorial ribbons
      vec3 darkTone = vec3(0.18, 0.16, 0.28) * effColorTint;
      vec3 alkaliTone = vec3(0.34, 0.26, 0.52) * effColorTint;
      vec3 bronzeShear = vec3(0.48, 0.32, 0.24) * effColorTint;

      float jetContrast = smoothstep(0.55, 1.25, bandTurbulence);
      float tBand = smoothstep(-0.7, 0.7, band);
      vec3 bandedAlkali = mix(darkTone, alkaliTone, tBand);
      bandedAlkali = mix(bandedAlkali, bronzeShear, smoothstep(0.65, 0.95, tBand) * 0.45);

      vec3 smoothAlkali = mix(darkTone, alkaliTone, 0.5 + smoothstep(-1.0, 1.0, vLocalPos.y) * 0.15);
      surface = mix(smoothAlkali, bandedAlkali, jetContrast);

      // Deep ionized violet-indigo Rayleigh limb scattering
      atmoColor = vec3(0.45, 0.35, 0.85) * effColorTint;
      atmoStrength = 0.65;

      // Thermal twilight incandescence on dayside (planets at 900K - 1400K emit red/orange thermal glow)
      float subStellar = max(0.0, dot(vLocalPos, L));
      vec3 thermalGlow = blackbody(temperatureK);
      emissiveColor = thermalGlow * pow(subStellar, 2.0) * 0.35;
    }
    // 16. Gas Giant Water Clouds (Sudarsky Class II)
    else if (themeIndex < 15.5) {
      vec3 flow = zonalJetFlow(vLocalPos, time, 0.028);
      float latFreq = 14.0 + effBandShift * 6.0;
      float band = fluidJetStream(flow, latFreq, bandTurbulence, effSeed);
      vec3 deepWaterCloud = vec3(0.12, 0.32, 0.55) * effColorTint;
      vec3 brightWaterCloud = vec3(0.68, 0.78, 0.90) * effColorTint;
      float jetContrast = smoothstep(0.70, 1.25, bandTurbulence);
      vec3 smoothCloud = mix(deepWaterCloud, brightWaterCloud, 0.5);
      vec3 bandedCloud = mix(deepWaterCloud, brightWaterCloud, smoothstep(-0.65, 0.65, band));
      surface = mix(smoothCloud, bandedCloud, jetContrast);

      atmoColor = vec3(0.40, 0.65, 0.95) * effColorTint;
      atmoStrength = 0.70;
    }
    // 17. Carbonaceous Asteroid (Airless C-type chondrite / B-type, e.g. Hygiea, Pallas)
    else {
      vec3 warped = domainWarp(vLocalPos * 4.0 + effSeed, 0.45);
      float craters = ridgedFbm(warped * 2.0);
      float micro = fbmFast(vLocalPos * 16.0);
      
      // Distinct low-albedo (0.04-0.12) carbonaceous / hydrated silicate regolith:
      // Charcoal, graphite grey, and dark slate tones with visible impact rims
      vec3 darkBasin = mix(vec3(0.22, 0.22, 0.24), vec3(0.32, 0.32, 0.34), micro) * effColorTint;
      vec3 impactRim = mix(vec3(0.42, 0.42, 0.44), vec3(0.56, 0.56, 0.58), micro) * effColorTint;
      surface = mix(darkBasin, impactRim, craters);

      // Airless body: zero atmospheric scattering
      atmoColor = vec3(0.0);
      atmoStrength = 0.0;
    }

    // Physical Albedo modulation:
    // Low albedo planets absorb deep light; high albedo reflects cloud tops
    // Maintain healthy optical dynamic range [0.75, 1.50] so surface features remain distinct and visible
    float albedoFactor = clamp(albedo * 0.90 + 0.68, 0.75, 1.50);

    // Rayleigh scattering atmospheric limb glow (enhances soft atmospheric horizon ring)
    float terminatorFactor = smoothstep(-0.25, 0.45, dot(N, L));
    vec3 rayleighGlow = atmoColor * (fresnel * atmoStrength * (terminatorFactor * 0.7 + 0.3));

    vec3 finalColor = (surface * NdotL * albedoFactor) + rayleighGlow + vec3(specular) + emissiveColor;
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const getThemeIndex = (theme?: string): number => {
  switch (theme) {
    case 'terrestrial-rocky':
      return 0.0;
    case 'carbonaceous-asteroid':
      return 16.0;
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
  lowlandColor: THREE.Vector3;
  savannaColor: THREE.Vector3;
  plateauColor: THREE.Vector3;
  oceanShallowColor: THREE.Vector3;
  oceanDeepColor: THREE.Vector3;
  iceCapLatitude: number;
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
  let bandTurbulence = 0.8 + h1 * 0.6;

  // 3. Physical multi-color tint variations tailored by archetype
  const tint = new THREE.Vector3(1.0, 1.0, 1.0);

  // Gas Giant Banded (themeIdx == 5.0)
  if (themeIdx >= 4.5 && themeIdx < 5.5) {
    // Physical atmospheric composition tints based on temperature & metallicity:
    // - Cold ammonia/water cloud giants (<300K): Cream, butterscotch, ivory, and soft sand
    // - Warm Jovians (300K - 800K): Honey, amber, warm caramel, and salmon-ochre (Reference Image 2)
    // - High-temperature photochemically processed giants (800K - 1300K): Muted terracotta, bronze, and subtle soft rose-mauve (subtle tholin haze, desaturated and realistic)
    if (tempK < 300.0) {
      // Ammonia ice clouds
      const r = 0.88 + (h2 - 0.5) * 0.15;
      const g = 0.82 + (h3 - 0.5) * 0.15;
      const b = 0.72 + (h1 - 0.5) * 0.15;
      tint.set(r, g, b);
    } else if (tempK < 800.0) {
      // Warm tropospheric water/hydrocarbon haze (Image 2 style)
      const r = 0.90 + (h2 - 0.5) * 0.15;
      const g = 0.76 + (h3 - 0.5) * 0.15;
      const b = 0.58 + (h1 - 0.5) * 0.15;
      tint.set(r, g, b);
    } else {
      // Warm photochemical tholin/hydrocarbon smog (e.g. GJ 504 b style: soft dusty mauve/rose-bronze, natural and desaturated)
      if (bucket % 4 === 1) {
        // Soft dusty rose / mauve haze (delicate and muted, NOT oversaturated neon magenta)
        const r = 0.92 + (h2 - 0.5) * 0.12;
        const g = 0.68 + (h3 - 0.5) * 0.10;
        const b = 0.75 + (h1 - 0.5) * 0.12;
        tint.set(r, g, b);
      } else {
        // Burnt amber, ochre-bronze, and terracotta belts
        const r = 0.92 + (h2 - 0.5) * 0.15;
        const g = 0.68 + (h3 - 0.5) * 0.15;
        const b = 0.50 + (h1 - 0.5) * 0.15;
        tint.set(r, g, b);
      }
    }

    // Band density and turbulence:
    // Some have few broad laminar zones; some have active multiple jet streams
    if (bucket % 3 === 0) {
      bandTurbulence = 0.55 + h1 * 0.15; // Smooth / hazy Jovian
    } else if (bucket % 3 === 1) {
      bandTurbulence = 0.85 + h1 * 0.20; // Few broad serene bands
    } else {
      bandTurbulence = 1.15 + h1 * 0.35; // Distinct jet streams
    }
  }
  // Ice Giant & Sub-Neptune (themeIdx == 3.0 or 4.0)
  else if (themeIdx >= 2.5 && themeIdx < 4.5) {
    // 32 variations spanning:
    // - Vivid deep sapphire & electric cyan ribbons (Reference Image 1 & 2 foreground)
    // - Soft aquamarine, sea-green, and turquoise
    const r = 0.65 + (h2 - 0.5) * 0.25;
    const g = 0.88 + (h3 - 0.5) * 0.20;
    const b = 1.02 + h1 * 0.28;
    tint.set(r, g, b);

    // Spectrum of banding density and intensity:
    // - Smooth pastel orbs (Uranus-like): featureless methane haze
    // - Few prominent equatorial & temperate jet ribbons (like Reference Image 1 & 2 foreground)
    // - Many energetic latitudinal bands (Neptune Great Dark Spot era)
    if (bucket % 4 === 0) {
      bandTurbulence = 0.45 + h1 * 0.15; // Smooth featureless orb
    } else if (bucket % 4 === 1) {
      bandTurbulence = 0.80 + h1 * 0.18; // Few broad, silky jet ribbons
    } else {
      bandTurbulence = 1.20 + h1 * 0.40; // Many prominent, high-intensity jet streams
    }
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
  // Carbonaceous Asteroid (themeIdx == 16.0, e.g. Hygiea, Pallas)
  else if (themeIdx >= 15.5 && themeIdx < 16.5) {
    // Ultra-dark charcoal, neutral graphite, and slight hydrated phyllosilicate bluish-grey tint
    const neutral = 0.85 + (h2 - 0.5) * 0.15;
    const r = neutral * 0.96;
    const g = neutral * 0.98;
    const b = neutral * 1.02;
    tint.set(r, g, b);
  }
  // KBO Tholin & Red Sedna (themeIdx == 9.0, e.g. Quaoar, Varuna, Sedna, Gonggong)
  else if (themeIdx >= 8.5 && themeIdx < 9.5) {
    // Deep reddish-brown to crimson-amber tholin coloration
    const r = 1.05 + h2 * 0.20;
    const g = 0.65 + (h3 - 0.5) * 0.18;
    const b = 0.50 + (h1 - 0.5) * 0.15;
    tint.set(r, g, b);
  }
  // KBO Ice (themeIdx == 10.0, e.g. Eris, Haumea, Makemake)
  else if (themeIdx >= 9.5 && themeIdx < 10.5) {
    // Pristine high-albedo white with subtle nitrogen/methane ice crystalline cyan sheen
    const r = 0.95 + (h2 - 0.5) * 0.08;
    const g = 0.98 + (h3 - 0.5) * 0.06;
    const b = 1.02 + (h1 - 0.5) * 0.06;
    tint.set(r, g, b);
  }
  // Hycean Ocean & Terrestrial Ocean (themeIdx == 1.0 or 13.0)
  else if ((themeIdx >= 0.5 && themeIdx < 1.5) || (themeIdx >= 12.5 && themeIdx < 13.5)) {
    // Keep neutral base tint so calibrated multi-tier ocean palettes render with pristine color fidelity
    tint.set(1.0, 1.0, 1.0);
  } else {
    const r = 0.90 + (h2 - 0.5) * 0.20;
    const g = 0.90 + (h3 - 0.5) * 0.20;
    const b = 0.90 + (h1 - 0.5) * 0.20;
    tint.set(r, g, b);
  }

  // 4. Astrobiological Biome & Soil Archetypes for Habitable Worlds (Theme 1.0)
  const lowland = new THREE.Vector3(0.12, 0.38, 0.14);
  const savanna = new THREE.Vector3(0.38, 0.45, 0.22);
  const plateau = new THREE.Vector3(0.54, 0.46, 0.30);
  const oceanShallow = new THREE.Vector3(0.04, 0.44, 0.62);
  const oceanDeep = new THREE.Vector3(0.012, 0.07, 0.28);
  let iceCapLat = 0.74;

  if (themeIdx >= 0.5 && themeIdx < 1.5) {
    const regime = bucket % 6;
    // Regime 0: Classic Earth Analogs (Chlorophytic green, savanna, deep azure / cobalt oceans)
    if (regime === 0) {
      lowland.set(0.10 + h1 * 0.04, 0.38 + h2 * 0.05, 0.14);
      savanna.set(0.38, 0.45, 0.22);
      plateau.set(0.54, 0.46, 0.30);
      oceanDeep.set(0.012, 0.07, 0.28);
      oceanShallow.set(0.04, 0.44, 0.62);
      iceCapLat = 0.72 + h3 * 0.06;
    }
    // Regime 1: Emerald / Jade Oceans (Algal Bloom / Phyto-plankton / Copper-Rich Mineral Seas)
    else if (regime === 1) {
      lowland.set(0.16 + h1 * 0.04, 0.42 + h2 * 0.05, 0.26);
      savanna.set(0.36, 0.48, 0.24);
      plateau.set(0.48, 0.50, 0.36);
      oceanDeep.set(0.012, 0.16, 0.13);
      oceanShallow.set(0.06, 0.58, 0.44);
      iceCapLat = 0.76 + h3 * 0.06;
    }
    // Regime 2: Wine-Dark / Amethyst / Carmine ("Purple Earth" / Haloarchaea & Ferruginous Seas)
    else if (regime === 2) {
      lowland.set(0.32 + h1 * 0.06, 0.08, 0.22 + h2 * 0.05);
      savanna.set(0.44, 0.16, 0.28);
      plateau.set(0.52, 0.34, 0.34);
      oceanDeep.set(0.08, 0.025, 0.14);
      oceanShallow.set(0.48, 0.12, 0.36);
      iceCapLat = 0.66 + h3 * 0.08;
    }
    // Regime 3: Amber / Golden-Topaz / Bronze (Dissolved Organic Carbon / Hydrocarbon Brines / Sulfur-Rich Seas)
    else if (regime === 3) {
      lowland.set(0.46 + h1 * 0.06, 0.32, 0.14);
      savanna.set(0.60, 0.42, 0.20);
      plateau.set(0.68, 0.50, 0.32);
      oceanDeep.set(0.12, 0.06, 0.02);
      oceanShallow.set(0.62, 0.40, 0.10);
      iceCapLat = 0.80 + h3 * 0.08;
    }
    // Regime 4: Glacial Milk / Powder Cyan / Steel Navy (Sub-Polar Glacial Rock-Flour Oceans)
    else if (regime === 4) {
      lowland.set(0.24, 0.32 + h1 * 0.05, 0.24);
      savanna.set(0.38, 0.42, 0.36);
      plateau.set(0.52, 0.54, 0.50);
      oceanDeep.set(0.02, 0.07, 0.18);
      oceanShallow.set(0.30, 0.56, 0.72);
      iceCapLat = 0.52 + h3 * 0.08;
    }
    // Regime 5: Phosphor Teal / Cerulean Paradise (Hyper-Oxygenated Archipelagos)
    else {
      lowland.set(0.10 + h1 * 0.04, 0.44 + h2 * 0.05, 0.22);
      savanna.set(0.32, 0.46, 0.20);
      plateau.set(0.56, 0.45, 0.30);
      oceanDeep.set(0.01, 0.05, 0.22);
      oceanShallow.set(0.04, 0.62, 0.70);
      iceCapLat = 0.82 + h3 * 0.06;
    }
  }
  // 5. Hycean Ocean World Archetypes (Theme 13.0)
  else if (themeIdx >= 12.5 && themeIdx < 13.5) {
    const regime = bucket % 5;
    // Regime 0: Deep Hydrogen Sapphire
    if (regime === 0) {
      oceanDeep.set(0.010, 0.06, 0.26);
      oceanShallow.set(0.04, 0.35, 0.72);
    }
    // Regime 1: Supercritical Phosphor-Teal
    else if (regime === 1) {
      oceanDeep.set(0.012, 0.12, 0.22);
      oceanShallow.set(0.06, 0.58, 0.62);
    }
    // Regime 2: Hydrocarbon/Methane-rich Amber-Teal
    else if (regime === 2) {
      oceanDeep.set(0.06, 0.08, 0.14);
      oceanShallow.set(0.20, 0.48, 0.40);
    }
    // Regime 3: Ammonia-saturated Violet-Indigo
    else if (regime === 3) {
      oceanDeep.set(0.05, 0.03, 0.16);
      oceanShallow.set(0.24, 0.20, 0.54);
    }
    // Regime 4: Ultramarine Abyss
    else {
      oceanDeep.set(0.008, 0.04, 0.20);
      oceanShallow.set(0.03, 0.26, 0.62);
    }
  }

  // Disable polar frost caps specifically for airless asteroids (carbonaceous-asteroid: 16.0)
  // or extremely hot worlds (T > 320K for terrestrial ocean; T > 280K for airless rocky)
  if (themeIdx >= 15.5 || (themeIdx < 0.5 && tempK >= 280.0) || tempK >= 320.0) {
    iceCapLat = 0.0;
  }

  return {
    seed,
    colorTint: tint,
    bandShift,
    bandTurbulence,
    lowlandColor: lowland,
    savannaColor: savanna,
    plateauColor: plateau,
    oceanShallowColor: oceanShallow,
    oceanDeepColor: oceanDeep,
    iceCapLatitude: iceCapLat,
  };
}
