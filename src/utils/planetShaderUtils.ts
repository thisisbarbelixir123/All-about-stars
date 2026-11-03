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

  // Jovian Sudarsky atmospheric uniforms (per-planet chemistry, albedo, and temperature coupling)
  uniform float sudarskyIndex;
  uniform vec3 jovianBandDark;
  uniform vec3 jovianBandMid;
  uniform vec3 jovianBandLight;
  uniform vec3 jovianBandCloud;
  uniform vec3 jovianAtmoTint;
  uniform vec3 jovianPolarTint;
  uniform vec4 jovianStorm;

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
    vec3 stretchedPos = vec3(flow.x * 0.14, flow.y * latFrequency, flow.z * 0.14);
    vec2 wave = vec2(
      snoise(vec3(flow.x * 0.55, flow.y * 1.8, flow.z * 0.55) + seedVal),
      snoise(vec3(flow.z * 0.55, flow.y * 1.8 + 3.1, flow.x * 0.55) + seedVal)
    );
    vec3 warpedPos = stretchedPos + vec3(wave.x * 0.18, wave.y * 0.16, wave.x * 0.18) * turbulence;
    float primaryBand = snoise(warpedPos);
    float secondaryRibbon = snoise(warpedPos * 1.6 + vec3(1.7, 0.4, 2.3)) * 0.22;
    return primaryBand + secondaryRibbon * turbulence;
  }

  // Smooth 4-stop Hermite color ramp avoiding piecewise linear slope creases
  vec3 evalSilkyPalette(float t, vec3 c0, vec3 c1, vec3 c2, vec3 c3) {
    float s1 = smoothstep(0.0, 0.48, t);
    float s2 = smoothstep(0.30, 0.78, t);
    float s3 = smoothstep(0.60, 1.0, t);
    vec3 col = mix(c0, c1, s1);
    col = mix(col, c2, s2);
    col = mix(col, c3, s3);
    return col;
  }

  // Coherent 360-degree latitudinal belt and laminar jet-stream profile for Jovian gas giants.
  // Returns vec3(tBand, fineStreamlines, beltShearMask).
  // turbulence < 0.60 (~63.5% of gas giants) yields 2-5 broad, ultra-smooth zones;
  // turbulence >= 0.74 (~36.5% of gas giants) yields 10-15 silky horizontal multi-belts.
  vec3 jovianZonalProfile(vec3 localPos, vec3 flow, float turbulence, float shiftVal, float seedVal, float albedoVal) {
    float uLat = asin(clamp(localPos.y, -1.0, 1.0)) / 1.5707963;
    float isMultiBelt = smoothstep(0.60, 0.74, turbulence);
    float subSmooth = smoothstep(0.18, 0.56, turbulence);

    float fewCycles = mix(1.22, 2.42, subSmooth) + shiftVal * 0.28;
    float manyCycles = 5.0 + max(0.0, turbulence - 0.74) * 7.2 + shiftVal * 0.85;
    float cycles = mix(fewCycles, manyCycles, isMultiBelt);

    float eddyAmp = mix(0.006, 0.022, isMultiBelt);
    float latWave = snoise(vec3(flow.x * 1.10, uLat * 2.7, flow.z * 1.10) + seedVal * 0.31) * eddyAmp;
    float lat = uLat + latWave;

    float latWarp = snoise(vec3(seedVal * 0.13, lat * cycles * 0.46 + 2.7, seedVal * 0.29)) * 1.28;
    float phase = lat * cycles * 3.14159265 + latWarp + seedVal;
    float z1 = sin(phase);
    float z2 = sin(lat * cycles * 6.2831853 - latWarp * 0.62 + seedVal * 1.7) * mix(0.12, 0.34, isMultiBelt);
    float z3 = sin(lat * cycles * 9.424778 + latWarp * 0.35 - seedVal * 0.9) * mix(0.02, 0.11, isMultiBelt);

    // Belt-zone boundary shear mask where jet wind gradient is steepest
    float shearMask = pow(clamp(abs(cos(phase)), 0.0, 1.0), 2.2);
    float festoon = snoise(vec3(flow.x * 1.65, lat * cycles * 3.3, flow.z * 1.65) + seedVal * 1.13) * shearMask * mix(0.022, 0.085, isMultiBelt);

    // High-resolution strictly horizontal Cassini/Juno laminar cloud filaments
    float silkCoarse = snoise(vec3(flow.x * 0.24, lat * 24.0, flow.z * 0.24) + seedVal * 0.67);
    float silkFine = snoise(vec3(flow.x * 0.16, lat * 48.0, flow.z * 0.16) - seedVal * 1.21);
    float fineStreamlines = silkCoarse * 0.65 + silkFine * 0.35;
    float silkWeight = mix(0.034, 0.086, isMultiBelt);

    float norm = 1.0 + mix(0.14, 0.45, isMultiBelt);
    float rawBand = (z1 + z2 + z3) / norm + festoon + fineStreamlines * silkWeight;
    float contrast = mix(mix(0.46, 0.74, subSmooth), 0.96, isMultiBelt);

    // Reflective cloud decks expand bright zone coverage; dark absorbers widen belt troughs
    float cloudBias = (clamp(albedoVal, 0.02, 0.85) - 0.32) * 0.18;
    float tBand = clamp(0.5 + cloudBias + 0.5 * clamp(rawBand, -1.0, 1.0) * contrast, 0.0, 1.0);
    return vec3(tBand, fineStreamlines, shearMask);
  }

  // Neptunian circulation profile: ~70% velvety haze globes (turbulence < 0.36) and ~30% soft 2-4 band Neptune envelopes.
  // Returns vec3(tAtmosphere, companionCirrusMask, isBandedMask).
  vec3 neptunianAtmosphereProfile(vec3 localPos, vec3 flow, float turbulence, float shiftVal, float seedVal, float albedoVal) {
    float uLat = asin(clamp(localPos.y, -1.0, 1.0)) / 1.5707963;
    float isBanded = smoothstep(0.36, 0.48, turbulence);
    float bandStrength = clamp((turbulence - 0.48) / 0.34, 0.0, 1.0);

    float seasonalSign = fract(seedVal * 0.173) < 0.5 ? -1.0 : 1.0;
    float insolation = cos(uLat * 1.5707963) * 0.13 - 0.04;
    float polarCollar = smoothstep(0.46, 0.88, uLat * seasonalSign) * 0.14;
    float airglowSilk = snoise(vec3(flow.x * 0.18, uLat * 11.0, flow.z * 0.18) + seedVal * 0.43) * 0.016;
    float cloudBias = (clamp(albedoVal, 0.03, 0.85) - 0.30) * 0.22;
    float tSmooth = clamp(0.50 + cloudBias + insolation + polarCollar + airglowSilk, 0.0, 1.0);

    float cycles = mix(1.15, 1.92, bandStrength) + shiftVal * 0.20;
    float latWave = snoise(vec3(flow.x * 0.90, uLat * 2.1, flow.z * 0.90) + seedVal * 0.27) * 0.008;
    float lat = uLat + latWave;
    float latWarp = snoise(vec3(seedVal * 0.19, lat * cycles * 0.42 + 1.9, seedVal * 0.31)) * 0.82;
    float phase = lat * cycles * 3.14159265 + latWarp + seedVal;
    float z1 = sin(phase);
    float z2 = sin(lat * cycles * 6.2831853 - latWarp * 0.50 + seedVal * 1.4) * 0.16;
    float shearMask = pow(clamp(abs(cos(phase)), 0.0, 1.0), 2.5);

    float silk = snoise(vec3(flow.x * 0.18, lat * 28.0, flow.z * 0.18) + seedVal * 0.79) * 0.70
      + snoise(vec3(flow.x * 0.12, lat * 52.0, flow.z * 0.12) - seedVal * 1.13) * 0.30;
    float rawBand = (z1 + z2) / 1.16 + silk * 0.035;
    float contrast = mix(0.16, 0.31, bandStrength);
    float tBanded = clamp(0.50 + cloudBias + 0.5 * clamp(rawBand, -1.0, 1.0) * contrast + polarCollar * 0.45, 0.0, 1.0);

    float wispNoise = snoise(vec3(flow.x * 0.26, lat * 34.0, flow.z * 0.26) + seedVal * 2.07) * 0.68
      + snoise(vec3(flow.x * 0.52, lat * 64.0, flow.z * 0.52) - seedVal * 1.41) * 0.32;
    float faintSmoothWisp = smoothstep(0.76, 0.94, wispNoise) * clamp((albedoVal - 0.25) * 0.55, 0.0, 0.22);
    float bandedCirrus = smoothstep(0.54, 0.86, wispNoise) * (0.35 + 0.65 * shearMask);
    float cirrusMask = mix(faintSmoothWisp, bandedCirrus, isBanded);

    return vec3(mix(tSmooth, tBanded, isBanded), cirrusMask, isBanded);
  }

  // Seamless spherical evaluation for elliptical anticyclonic storm ovals and dark cyclonic barges
  vec3 evaluateJovianStorm(vec3 localPos, float timeVal, float jetSpeed, vec4 storm, float seedVal) {
    float strength = storm.w;
    if (abs(strength) < 0.01) {
      return vec3(0.0);
    }
    float uLat = asin(clamp(localPos.y, -1.0, 1.0)) / 1.5707963;
    float sLat = storm.x;
    float latRadius = max(0.038, storm.z);
    float dLat = (uLat - sLat) / latRadius;
    if (abs(dLat) > 2.2) {
      return vec3(0.0);
    }

    float sinCenterLat = clamp(sin(sLat * 1.5707963), -0.95, 0.95);
    float jetShear = sin(sinCenterLat * 9.424) * 0.65 + cos(sinCenterLat * 4.712) * 0.35;
    float centerLon = storm.y - jetSpeed * timeVal * (1.0 + jetShear);
    float fragLon = atan(localPos.z, localPos.x);
    float dLonWrap = atan(sin(fragLon - centerLon), cos(fragLon - centerLon));

    // Anticyclonic ovals have ~2.1:1 longitudinal aspect; cyclonic barges are narrower (~3.1:1)
    float lonAspect = strength > 0.0 ? 2.15 : 3.10;
    float cosLat = max(0.28, cos(sLat * 1.5707963));
    float dLon = (dLonWrap * cosLat) / (latRadius * lonAspect);

    float r = sqrt(dLat * dLat + dLon * dLon);
    if (r > 1.85) {
      return vec3(0.0);
    }

    // Tangential vortex spiral inside the eyewall
    float swirlAngle = atan(dLat, dLon) + (1.4 - r) * (strength > 0.0 ? 2.4 : -1.8);
    float spiral = sin(swirlAngle * 2.0 + r * 5.2 + seedVal) * 0.5 + 0.5;
    float bodyMask = smoothstep(1.12, 0.28, r);
    float collarMask = smoothstep(1.52, 1.08, r) * smoothstep(0.68, 1.08, r);
    return vec3(bodyMask, collarMask, spiral);
  }

  // Planckian blackbody thermal radiation up to ultra-hot KELT-9 b temperatures (4600 K)
  vec3 blackbody(float kelvin) {
    float t = clamp(kelvin, 800.0, 4600.0);
    if (t < 1100.0) {
      return mix(vec3(0.05, 0.01, 0.005), vec3(0.42, 0.055, 0.02), (t - 800.0) / 300.0);
    } else if (t < 1600.0) {
      return mix(vec3(0.42, 0.055, 0.02), vec3(1.0, 0.36, 0.045), (t - 1100.0) / 500.0);
    } else if (t < 2400.0) {
      return mix(vec3(1.0, 0.36, 0.045), vec3(1.02, 0.76, 0.36), (t - 1600.0) / 800.0);
    } else if (t < 3400.0) {
      return mix(vec3(1.02, 0.76, 0.36), vec3(1.18, 1.12, 1.02), (t - 2400.0) / 1000.0);
    } else {
      return mix(vec3(1.18, 1.12, 1.02), vec3(1.15, 1.22, 1.35), (t - 3400.0) / 1200.0);
    }
  }

  // High-performance Directional Cloud Deck & Shadow Evaluation
  // Evaluates smooth, aerodynamic synoptic weather systems, cyclonic vortices,
  // silky cumulus billows, delicate high-altitude cirrus filaments, and soft diffused drop shadows
  vec4 evaluateCloudLayer(vec3 p, vec3 lightDirVec, float timeVal, float coverage, float cloudSeed) {
    float lat = p.y;
    // Latitudinal Coriolis jet shear: equatorial trade winds drift westward, mid-latitude westerlies drift eastward
    float coriolis = sin(lat * 3.14159 * 2.0) * 0.20;
    vec3 advect = vec3(timeVal * 0.025 + coriolis * timeVal * 0.035, timeVal * 0.005, timeVal * 0.015);
    vec3 cloudCoord = p + advect + cloudSeed;

    // 1. Synoptic Weather Systems & Silky Cyclonic Swirl (Domain Warping)
    vec3 warpedCoord = domainWarp(cloudCoord * 2.0, 0.35);
    float synoptic = fbm(warpedCoord);

    // 2. Smooth, Aerodynamic Cumulus Billows (gentle secondary noise, no crunchy micro-noise)
    float billowNoise = synoptic + snoise(cloudCoord * 4.5) * 0.18;

    // Soft, smooth condensation transition (wide smoothstep range avoids harsh, pixelated edges)
    float cumulusThreshold = 1.0 - coverage;
    float cumulus = smoothstep(cumulusThreshold, cumulusThreshold + 0.30, billowNoise);
    float cloudCore = smoothstep(cumulusThreshold + 0.10, cumulusThreshold + 0.38, billowNoise);

    // 3. Delicate, Silky High-Altitude Cirrus Streamers
    vec3 cirrusCoord = vec3(cloudCoord.x * 1.3, cloudCoord.y * 3.6, cloudCoord.z * 1.3) + vec3(timeVal * 0.035, 0.0, timeVal * 0.025);
    float cirrusNoise = snoise(cirrusCoord) * 0.65 + snoise(cirrusCoord * 1.8) * 0.35;
    float cirrus = smoothstep(0.35, 0.75, cirrusNoise) * (1.0 - cumulus * 0.75) * 0.35;

    // Total combined smooth cloud optical density
    float totalCloud = clamp(cumulus + cirrus, 0.0, 1.0);

    // 4. Soft, Diffused Directional Drop Shadow
    vec3 shadowCoord = domainWarp((cloudCoord + lightDirVec * 0.038) * 2.0, 0.35);
    float shadowBase = fbmFast(shadowCoord);
    float shadowMask = smoothstep(cumulusThreshold, cumulusThreshold + 0.35, shadowBase) * 0.38;

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
    // 2. Camera-aligned starlight fill: guarantees surface features and relief are never lost in pitch-black shadow blind spots
    float cameraFill = max(0.0, dot(N, V)) * 0.35;
    // 3. Soft galactic ambient fill
    float ambientFill = 0.45;
    // 4. Subtle rim backlight to silhouette the spherical limb against deep space
    float rimFill = max(0.0, dot(N, -L)) * 0.18;
    float NdotL = clamp(directLight * 0.65 + ambientFill + cameraFill + rimFill, 0.55, 1.35);
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
      // A. Cold Silicate (<280K): Moon/Callisto style dark basaltic basins with cratered silicate highlands (dry, non-smothered rock)
      // B. Warm / Martian Arid (280K - 550K): Iron-oxide rust, terracotta canyon floors, and bright ochre sandstone highlands
      // C. Scorched Furnace (550K - 1350K, e.g. Kepler-131 c, Kepler-37 b): Volcanic basalt basins, warm bronze-tan highlands, crater rays
      vec3 lowBasin;
      vec3 highRidge;
      if (temperatureK < 280.0) {
        lowBasin = mix(vec3(0.30, 0.30, 0.32), vec3(0.44, 0.43, 0.42), micro) * effColorTint;
        highRidge = mix(vec3(0.60, 0.58, 0.56), vec3(0.74, 0.72, 0.70), micro) * effColorTint;
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
      surface = mix(surface, vec3(0.88, 0.85, 0.80) * effColorTint, craters * 0.40);

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
      // Smooth, natural domain warping for continental drift and ocean basins
      vec3 warped = domainWarp(vLocalPos * 2.2 + effSeed, 0.40);
      float continental = fbm(warped); // Low-frequency continental land/ocean mask
      float mountain = ridgedFbm(warped * 1.8); // Alpine cordilleras
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

      // A. Smooth Ocean Bathymetry & Coastal Shelves (continental < 0.05)
      if (continental < 0.05) {
        // 4-Tier Smooth Bathymetry:
        // 1. Abyssal Trench: deep ink absorption
        vec3 abyssalColor = deepColor * 0.45;
        // 2. Pelagic Open Ocean: primary deepColor
        // 3. Continental Shelf: vibrant shelfColor
        // 4. Coastal Lagoon / Reef: luminous tropical turquoise / emerald shallows
        vec3 lagoonColor = mix(shelfColor * 1.30, vec3(0.25, 0.95, 0.85) * shelfColor, 0.35);

        float depthTrench = smoothstep(-0.60, -0.22, continental);
        float depthShelf = smoothstep(-0.22, -0.02, continental);
        float depthLagoon = smoothstep(-0.02, 0.045, continental);

        vec3 sea = mix(abyssalColor, deepColor, depthTrench);
        sea = mix(sea, shelfColor, depthShelf);
        sea = mix(sea, lagoonColor, depthLagoon);

        // Smooth beach sand & surf fringe right at the shoreline (continental: 0.035 to 0.05)
        float surf = smoothstep(0.035, 0.05, continental);
        vec3 beachSand = mix(vec3(0.88, 0.82, 0.68), vec3(0.95, 0.95, 0.98), surf);
        surface = mix(sea, beachSand, surf * 0.60);
      }
      // B. Smooth Continental Landmass & Biome Stratification (continental >= 0.05)
      else {
        float landElevation = smoothstep(0.05, 0.68, continental) * 0.60 + mountain * 0.40;
        
        vec3 lowlands = lowlandColor.r > 0.001 || lowlandColor.g > 0.001 ? lowlandColor : (vec3(0.12, 0.38, 0.14) * effColorTint);
        vec3 savanna = savannaColor.r > 0.001 || savannaColor.g > 0.001 ? savannaColor : (vec3(0.38, 0.45, 0.22) * effColorTint);
        vec3 plateau = plateauColor.r > 0.001 || plateauColor.g > 0.001 ? plateauColor : (vec3(0.54, 0.46, 0.30) * effColorTint);
        vec3 mountainPeak = vec3(0.72, 0.70, 0.68) * effColorTint;

        // Smooth biome transitions across elevation
        vec3 biome = mix(lowlands, savanna, smoothstep(0.08, 0.32, landElevation));
        biome = mix(biome, plateau, smoothstep(0.32, 0.62, landElevation));
        biome = mix(biome, mountainPeak, smoothstep(0.62, 0.88, landElevation));

        // Smooth dynamic alpine snowline descending with latitude
        float localSnowline = mix(0.86, 0.38, smoothstep(0.12, 0.78, lat));
        if (landElevation > localSnowline && temperatureK < 320.0) {
          float snowCap = smoothstep(localSnowline, localSnowline + 0.10, landElevation);
          biome = mix(biome, vec3(0.94, 0.96, 0.99), snowCap * 0.88);
        }

        surface = biome;
      }

      // C. Latitude & Temperature-Controlled Polar Glacial Ice Caps
      float baseThreshold = iceCapLatitude > 0.1 ? iceCapLatitude : 0.72;
      float polarThreshold = clamp(baseThreshold + (temperatureK - 260.0) * 0.0022, 0.48, 0.96);
      if (lat > polarThreshold && temperatureK < 315.0) {
        float iceNoise = fbmFast(vLocalPos * 4.0 + effSeed);
        float iceCap = smoothstep(polarThreshold, polarThreshold + 0.12, lat + iceNoise * 0.06);
        surface = mix(surface, vec3(0.92, 0.96, 1.0), iceCap * 0.92);
      }

      // D. Smooth Directional Cloud Decks & Soft Drop Shadows
      vec4 clouds = evaluateCloudLayer(vLocalPos, L, time, 0.52, effSeed * 2.3);
      float cloudMask = clouds.x;
      float shadowMask = clouds.y;
      float cloudCore = clouds.z;

      // Specular ocean sun glint: glassy, smooth liquid reflection of stellar source
      if (continental < 0.05 && temperatureK >= 240.0) {
        float oceanSpec = pow(specBase, 32.0) * rawNdotL * 1.5;
        // Smooth water Fresnel limb reflection
        oceanSpec += pow(1.0 - max(0.0, dot(N, V)), 5.0) * 0.30 * rawNdotL;
        specular = oceanSpec * (1.0 - cloudMask);
      }

      // Soft directional drop shadow cast onto surface beneath
      float directShadow = shadowMask * clamp(rawNdotL * 1.4, 0.0, 1.0);
      surface *= (1.0 - directShadow);

      // Smooth cloud shading: soft terminator attenuation and forward scattering
      vec3 cumulusColor = vec3(0.97, 0.98, 1.0);
      vec3 cirrusColor = vec3(0.92, 0.95, 0.99);
      vec3 cloudColor = mix(cirrusColor, cumulusColor, cloudCore / max(0.01, cloudMask));
      float cloudLighting = clamp(dot(N, L) * 0.65 + 0.35, 0.30, 1.0);
      cloudColor *= cloudLighting;

      // Blend smooth clouds onto surface
      surface = mix(surface, cloudColor, cloudMask * 0.92);

      // Smooth forward scattering silver lining on cloud edges
      float cloudGlint = pow(specBase, 10.0) * (cloudMask - cloudCore) * 0.30;
      specular += cloudGlint;

      atmoColor = mix(vec3(0.32, 0.65, 1.0), shelfColor * 1.4, 0.20) * effColorTint;
      atmoStrength = 0.80;
    }
    // 3. Super-Earth (Dynamic Atmospheric & Thermal Regimes)
    else if (themeIndex < 2.5) {
      vec3 warped = domainWarp(vLocalPos * 3.0 + effSeed, 0.50);
      float tectonic = ridgedFbm(warped);
      float micro = fbm(vLocalPos * 12.0);

      // Physical Regimes based on Temperature:
      // A. Cold Super-Earth (<250K): Glaciated plateaus, permafrost tundra, pale azure haze
      // B. Temperate Habitable Super-Earth (250K - 380K): Epicontinental rift lakes/seas, iron/granite highlands, clouds
      // C. Warm / Arid Super-Earth (380K - 550K): Ochre plateaus, terracotta canyon lands, rust haze
      // D. Venusian Super-Earth (550K - 850K): Dense sulfuric/CO2 cloud blankets (creamy golden-yellow)
      // E. Scorched Sub-Magma (>850K): Volcanic basalt, copper-iron highlands, glowing tectonic rifts
      vec3 land;
      if (temperatureK < 250.0) {
        // Cold Super-Earths (<250K) are diverse rocky worlds not smothered in universal ice sheets:
        // Rich geological mineral regimes: dark cratered basalt, cold iron-oxide deserts,
        // irradiated tholin crusts, and permafrost steppes with frost strictly on peaks or polar cold traps.
        float coldRegime = fract(effSeed * 0.173 + 0.31);
        float lat = abs(vLocalPos.y);

        if (coldRegime < 0.25) {
          // Archetype 0: Ancient Silicate / Cratered Basalt Bedrock (Dry dark rock, zero global ice)
          vec3 darkBasalt = mix(vec3(0.18, 0.18, 0.20), vec3(0.28, 0.27, 0.28), micro) * effColorTint;
          vec3 silicateCrags = mix(vec3(0.38, 0.36, 0.36), vec3(0.52, 0.50, 0.48), micro) * effColorTint;
          land = mix(darkBasalt, silicateCrags, smoothstep(0.25, 0.75, tectonic));
          atmoColor = vec3(0.40, 0.50, 0.65) * effColorTint;
          atmoStrength = 0.12;
        } else if (coldRegime < 0.50) {
          // Archetype 1: Cold Iron-Oxide / Hematite Desert (Mars-like terracotta sands & dark ravines)
          vec3 canyonFloor = mix(vec3(0.36, 0.18, 0.12), vec3(0.48, 0.24, 0.16), micro) * effColorTint;
          vec3 terracottaPlateau = mix(vec3(0.62, 0.34, 0.22), vec3(0.74, 0.42, 0.28), micro) * effColorTint;
          land = mix(canyonFloor, terracottaPlateau, smoothstep(0.25, 0.70, tectonic));
          atmoColor = vec3(0.65, 0.45, 0.35) * effColorTint;
          atmoStrength = 0.20;
        } else if (coldRegime < 0.75) {
          // Archetype 2: Irradiated Hydrocarbon / Tholin Crust (Deep chocolate-umber and rich amber plains)
          vec3 deepTholin = mix(vec3(0.26, 0.14, 0.10), vec3(0.38, 0.20, 0.14), micro) * effColorTint;
          vec3 amberPlains = mix(vec3(0.55, 0.32, 0.20), vec3(0.68, 0.42, 0.26), micro) * effColorTint;
          land = mix(deepTholin, amberPlains, smoothstep(0.30, 0.75, tectonic));
          atmoColor = vec3(0.55, 0.38, 0.28) * effColorTint;
          atmoStrength = 0.25;
        } else {
          // Archetype 3: Cold Permafrost Steppes & Exposed Dark Rock (Tundra & dark crags, frost strictly on summits)
          vec3 slateLowland = mix(vec3(0.28, 0.30, 0.34), vec3(0.40, 0.42, 0.44), micro) * effColorTint;
          vec3 highlandCrag = mix(vec3(0.48, 0.50, 0.52), vec3(0.62, 0.62, 0.60), micro) * effColorTint;
          land = mix(slateLowland, highlandCrag, smoothstep(0.30, 0.70, tectonic));
          float alpineFrost = smoothstep(0.78, 0.92, tectonic + micro * 0.15);
          land = mix(land, vec3(0.88, 0.92, 0.96), alpineFrost * 0.50);
          atmoColor = vec3(0.45, 0.60, 0.80) * effColorTint;
          atmoStrength = 0.28;
        }
      } else if (temperatureK < 380.0) {
        // Temperate Habitable Super-Earth with epicontinental seas & dynamic cloud decks
        vec3 riftSea = vec3(0.04, 0.18, 0.36) * effColorTint;
        vec3 coastalPlain = mix(vec3(0.24, 0.38, 0.20), vec3(0.42, 0.40, 0.24), micro) * effColorTint;
        vec3 graniteHighland = mix(vec3(0.68, 0.54, 0.42), vec3(0.82, 0.70, 0.56), micro) * effColorTint;
        
        float seaMask = smoothstep(0.32, 0.22, tectonic);
        land = mix(coastalPlain, graniteHighland, smoothstep(0.32, 0.75, tectonic));
        land = mix(land, riftSea, seaMask);

        // Specular glint on epicontinental rift seas
        if (seaMask > 0.1) {
          float seaSpec = pow(specBase, 28.0) * rawNdotL * 1.35 * seaMask;
          specular += seaSpec;
        }

        // Directional cloud deck
        vec4 superClouds = evaluateCloudLayer(vLocalPos, L, time * 0.9, 0.48, effSeed * 1.9);
        land *= (1.0 - superClouds.y * clamp(rawNdotL * 1.5, 0.0, 1.0) * 0.45);
        land = mix(land, vec3(0.95, 0.97, 1.0), superClouds.x * 0.90);

        atmoColor = vec3(0.42, 0.68, 0.92) * effColorTint;
        atmoStrength = 0.70;
      } else if (temperatureK < 550.0) {
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
    // Sub-Neptune (temperate water/tholin envelopes, warm KCl/ZnS salt or CO-rich Neptunes, hot alkali/silicate Neptunes)
    else if (themeIndex < 3.5) {
      float jetSpeed = 0.018;
      vec3 flow = zonalJetFlow(vLocalPos, time, jetSpeed);
      vec3 prof = neptunianAtmosphereProfile(vLocalPos, flow, bandTurbulence, effBandShift, effSeed, albedo);

      vec3 cDark = length(jovianBandDark) > 0.01 ? jovianBandDark : vec3(0.08, 0.28, 0.48) * effColorTint;
      vec3 cMid = length(jovianBandMid) > 0.01 ? jovianBandMid : vec3(0.18, 0.50, 0.66) * effColorTint;
      vec3 cLight = length(jovianBandLight) > 0.01 ? jovianBandLight : vec3(0.42, 0.74, 0.82) * effColorTint;
      vec3 cCloud = length(jovianBandCloud) > 0.01 ? jovianBandCloud : vec3(0.84, 0.94, 0.98) * effColorTint;
      vec3 cPolar = length(jovianPolarTint) > 0.01 ? jovianPolarTint : cDark * 0.82;

      vec3 compositeSurface = evalSilkyPalette(prof.x, cDark, cMid, cLight, cCloud);
      float cirrusGain = clamp(0.14 + albedo * 0.52, 0.12, 0.48);
      compositeSurface = mix(compositeSurface, cCloud * 1.03, prof.y * cirrusGain);

      vec3 storm = evaluateJovianStorm(vLocalPos, time, jetSpeed, jovianStorm, effSeed);
      if (storm.x > 0.001 || storm.y > 0.001) {
        compositeSurface = mix(compositeSurface, cDark * 0.68, storm.x * (0.46 + storm.z * 0.14) * abs(jovianStorm.w));
        float companionWisp = storm.y * smoothstep(0.40, 0.86, storm.z);
        compositeSurface = mix(compositeSurface, cCloud * 1.05, companionWisp * 0.44 * abs(jovianStorm.w));
      }

      float absLat = abs(vLocalPos.y);
      compositeSurface = mix(compositeSurface, cPolar, smoothstep(0.66, 0.96, absLat) * 0.34);

      if (temperatureK > 950.0) {
        float subStellar = max(0.0, dot(vLocalPos, L));
        float deepRift = clamp(1.0 - prof.x, 0.0, 1.0);
        float glowScale = smoothstep(950.0, 2100.0, temperatureK);
        vec3 thermal = blackbody(min(3200.0, temperatureK));
        emissiveColor = thermal * glowScale * (deepRift * (subStellar * 0.42 + 0.10) + pow(subStellar, 2.0) * 0.18);
      }

      surface = compositeSurface;
      atmoColor = length(jovianAtmoTint) > 0.01 ? jovianAtmoTint : vec3(0.32, 0.72, 0.90) * effColorTint;
      atmoStrength = 0.82;
    }
    // Cold Ice Giant (cryogenic CH4 + H2S Uranus/Neptune envelopes, <= 240 K)
    else if (themeIndex < 4.5) {
      float jetSpeed = 0.016;
      vec3 flow = zonalJetFlow(vLocalPos, time, jetSpeed);
      vec3 prof = neptunianAtmosphereProfile(vLocalPos, flow, bandTurbulence, effBandShift, effSeed, albedo);

      vec3 cDark = length(jovianBandDark) > 0.01 ? jovianBandDark : vec3(0.06, 0.28, 0.68) * effColorTint;
      vec3 cMid = length(jovianBandMid) > 0.01 ? jovianBandMid : vec3(0.18, 0.54, 0.84) * effColorTint;
      vec3 cLight = length(jovianBandLight) > 0.01 ? jovianBandLight : vec3(0.38, 0.78, 0.92) * effColorTint;
      vec3 cCloud = length(jovianBandCloud) > 0.01 ? jovianBandCloud : vec3(0.88, 0.96, 1.00) * effColorTint;
      vec3 cPolar = length(jovianPolarTint) > 0.01 ? jovianPolarTint : cLight * 0.92;

      vec3 compositeSurface = evalSilkyPalette(prof.x, cDark, cMid, cLight, cCloud);
      float methaneCirrusGain = clamp(0.18 + albedo * 0.56, 0.18, 0.52);
      compositeSurface = mix(compositeSurface, cCloud * 1.04, prof.y * methaneCirrusGain);

      vec3 storm = evaluateJovianStorm(vLocalPos, time, jetSpeed, jovianStorm, effSeed);
      if (storm.x > 0.001 || storm.y > 0.001) {
        compositeSurface = mix(compositeSurface, cDark * 0.64, storm.x * (0.50 + storm.z * 0.15) * abs(jovianStorm.w));
        float companionWisp = storm.y * smoothstep(0.38, 0.85, storm.z);
        compositeSurface = mix(compositeSurface, cCloud * 1.06, companionWisp * 0.50 * abs(jovianStorm.w));
      }

      float absLat = abs(vLocalPos.y);
      compositeSurface = mix(compositeSurface, cPolar, smoothstep(0.64, 0.96, absLat) * 0.36);

      surface = compositeSurface;
      atmoColor = length(jovianAtmoTint) > 0.01 ? jovianAtmoTint : vec3(0.30, 0.68, 0.96) * effColorTint;
      atmoStrength = 0.84;
    }
    // 6. Sudarsky Class I Gas Giant (Ammonia ice cloud decks, <= 155 K)
    else if (themeIndex < 5.5) {
      float jetSpeed = 0.023;
      vec3 flow = zonalJetFlow(vLocalPos, time, jetSpeed);
      vec3 prof = jovianZonalProfile(vLocalPos, flow, bandTurbulence, effBandShift, effSeed, albedo);
      float tBand = prof.x;
      float silk = prof.y;

      vec3 cDark = length(jovianBandDark) > 0.01 ? jovianBandDark : vec3(0.52, 0.28, 0.16) * effColorTint;
      vec3 cMid = length(jovianBandMid) > 0.01 ? jovianBandMid : vec3(0.76, 0.54, 0.34) * effColorTint;
      vec3 cLight = length(jovianBandLight) > 0.01 ? jovianBandLight : vec3(0.91, 0.84, 0.72) * effColorTint;
      vec3 cCloud = length(jovianBandCloud) > 0.01 ? jovianBandCloud : vec3(0.98, 0.95, 0.89) * effColorTint;

      vec3 compositeSurface = evalSilkyPalette(tBand, cDark, cMid, cLight, cCloud);

      // High-altitude NH3 ice cirrus streamers over bright zones, scaled by planet albedo
      float nh3Cirrus = smoothstep(0.28, 0.78, silk) * smoothstep(0.46, 0.85, tBand) * clamp((albedo - 0.30) * 1.15, 0.08, 0.42);
      compositeSurface = mix(compositeSurface, cCloud * 1.04, nh3Cirrus);

      // Anticyclonic storm oval (Great Red Spot / White Oval) or cyclonic brown barge
      vec3 storm = evaluateJovianStorm(vLocalPos, time, jetSpeed, jovianStorm, effSeed);
      if (storm.x > 0.001 || storm.y > 0.001) {
        if (jovianStorm.w > 0.0) {
          vec3 ovalCore = mix(cMid * vec3(1.18, 0.86, 0.76), cCloud, 0.35 + storm.z * 0.35);
          compositeSurface = mix(compositeSurface, cDark * 0.88, storm.y * 0.32 * jovianStorm.w);
          compositeSurface = mix(compositeSurface, ovalCore, storm.x * 0.82 * jovianStorm.w);
        } else {
          float bargeStr = -jovianStorm.w;
          vec3 bargeCore = cDark * mix(0.62, 0.78, storm.z);
          compositeSurface = mix(compositeSurface, bargeCore, storm.x * 0.78 * bargeStr);
        }
      }

      // Polar stratospheric hydrocarbon / aerosol hood with subtle concentric jet rings
      float polarLat = abs(vLocalPos.y);
      float polarRing = sin(polarLat * 38.0 + effSeed) * 0.04;
      vec3 pHood = length(jovianPolarTint) > 0.01 ? jovianPolarTint : vec3(0.62, 0.67, 0.73) * effColorTint;
      compositeSurface = mix(compositeSurface, pHood * (1.0 + polarRing), smoothstep(0.73, 0.97, polarLat) * 0.62);

      surface = compositeSurface;
      atmoColor = length(jovianAtmoTint) > 0.01 ? jovianAtmoTint : vec3(0.86, 0.76, 0.60) * effColorTint;
      atmoStrength = 0.50 + clamp(albedo, 0.2, 0.7) * 0.22;
    }
    // 7. Sudarsky Class IV Gas Giant (Alkali absorption above deep silicate/iron clouds, 900 - 1400 K)
    else if (themeIndex < 6.5) {
      float jetSpeed = 0.032;
      vec3 flow = zonalJetFlow(vLocalPos, time, jetSpeed);
      vec3 prof = jovianZonalProfile(vLocalPos, flow, bandTurbulence, effBandShift, effSeed, albedo);
      float tBand = prof.x;
      float silk = prof.y;

      vec3 cDark = length(jovianBandDark) > 0.01 ? jovianBandDark : vec3(0.20, 0.08, 0.08) * effColorTint;
      vec3 cMid = length(jovianBandMid) > 0.01 ? jovianBandMid : vec3(0.42, 0.16, 0.12) * effColorTint;
      vec3 cLight = length(jovianBandLight) > 0.01 ? jovianBandLight : vec3(0.66, 0.30, 0.17) * effColorTint;
      vec3 cCloud = length(jovianBandCloud) > 0.01 ? jovianBandCloud : vec3(0.86, 0.48, 0.25) * effColorTint;

      vec3 compositeSurface = evalSilkyPalette(tBand, cDark, cMid, cLight, cCloud);

      // Upwelling enstatite/iron silicate wisps weighted by albedo and temperature
      float silicateWisp = smoothstep(0.25, 0.80, silk) * smoothstep(0.45, 0.88, tBand) * clamp(albedo * 2.4, 0.06, 0.38);
      compositeSurface = mix(compositeSurface, cCloud * 1.08, silicateWisp);

      vec3 storm = evaluateJovianStorm(vLocalPos, time, jetSpeed, jovianStorm, effSeed);
      if (storm.x > 0.001 || storm.y > 0.001) {
        float sWeight = abs(jovianStorm.w);
        vec3 vortexCol = jovianStorm.w > 0.0 ? mix(cLight, cCloud * 1.12, storm.z) : cDark * 0.65;
        compositeSurface = mix(compositeSurface, vortexCol, storm.x * 0.72 * sWeight);
      }

      float polarLat = abs(vLocalPos.y);
      vec3 pHood = length(jovianPolarTint) > 0.01 ? jovianPolarTint : cDark * 0.82;
      compositeSurface = mix(compositeSurface, pHood, smoothstep(0.75, 0.98, polarLat) * 0.54);
      surface = compositeSurface;

      // Eastward-shifted equatorial jet hotspot + belt-trough 5-micron style thermal windows
      float sinShift = 0.3090;
      float cosShift = 0.9511;
      vec3 shiftedL = vec3(L.x * cosShift - L.z * sinShift, L.y, L.x * sinShift + L.z * cosShift);
      float hotSpot = max(0.0, dot(vLocalPos, shiftedL));
      float thermalFactor = smoothstep(920.0, 1400.0, temperatureK);
      float troughWindow = mix(1.42, 0.48, tBand);
      emissiveColor = blackbody(temperatureK) * (pow(hotSpot, 1.65) * 0.34 + 0.06) * thermalFactor * troughWindow;

      atmoColor = length(jovianAtmoTint) > 0.01 ? jovianAtmoTint : vec3(0.88, 0.38, 0.20) * effColorTint;
      atmoStrength = 0.62;
    }
    // 8. Sudarsky Class V Gas Giant (High-altitude silicate clouds to dissociated H- daysides, >= 1400 K)
    else if (themeIndex < 7.5) {
      float sinShift = 0.3907;
      float cosShift = 0.9205;
      vec3 shiftedL = vec3(L.x * cosShift - L.z * sinShift, L.y, L.x * sinShift + L.z * cosShift);
      float hotSpot = max(0.0, dot(vLocalPos, shiftedL));
      float trueDayside = max(0.0, dot(vLocalPos, L));

      float jetSpeed = 0.038;
      vec3 flow = zonalJetFlow(vLocalPos, time, jetSpeed);
      vec3 prof = jovianZonalProfile(vLocalPos, flow, bandTurbulence, effBandShift, effSeed, albedo);
      float tBand = prof.x;
      float silk = prof.y;

      vec3 cDark = length(jovianBandDark) > 0.01 ? jovianBandDark : vec3(0.42, 0.11, 0.06) * effColorTint;
      vec3 cMid = length(jovianBandMid) > 0.01 ? jovianBandMid : vec3(0.76, 0.28, 0.09) * effColorTint;
      vec3 cLight = length(jovianBandLight) > 0.01 ? jovianBandLight : vec3(0.95, 0.56, 0.18) * effColorTint;
      vec3 cCloud = length(jovianBandCloud) > 0.01 ? jovianBandCloud : vec3(1.00, 0.82, 0.42) * effColorTint;

      vec3 silicateBands = evalSilkyPalette(tBand, cDark, cMid, cLight, cCloud);

      // Reflective forsterite/enstatite streamers on high-albedo Class V worlds (1400-1950 K)
      float silicateSheen = smoothstep(0.22, 0.78, silk) * smoothstep(0.42, 0.88, tBand) * clamp((albedo - 0.14) * 0.95, 0.0, 0.42);
      silicateBands = mix(silicateBands, cCloud * 1.10, silicateSheen);

      vec3 storm = evaluateJovianStorm(vLocalPos, time, jetSpeed, jovianStorm, effSeed);
      if (storm.x > 0.001) {
        float sWeight = abs(jovianStorm.w);
        vec3 plumeCol = jovianStorm.w > 0.0 ? cCloud * 1.12 : cDark * 0.68;
        silicateBands = mix(silicateBands, plumeCol, storm.x * 0.65 * sWeight);
      }

      float polarLat = abs(vLocalPos.y);
      vec3 pHood = length(jovianPolarTint) > 0.01 ? jovianPolarTint : cDark * 0.78;
      silicateBands = mix(silicateBands, pHood, smoothstep(0.76, 0.98, polarLat) * 0.50);

      // Thermal emission scales up as silicate clouds vaporize above 1950 K and H- continuum dominates
      float extremeHeat = smoothstep(1800.0, 2750.0, temperatureK);
      float darkAbsorberBoost = clamp((0.35 - albedo) * 1.6, 0.0, 0.55);
      vec3 thermalGlow = blackbody(max(1450.0, temperatureK));
      float troughWindow = mix(1.30, 0.68, tBand * (1.0 - extremeHeat * 0.55));

      surface = mix(silicateBands, mix(silicateBands, thermalGlow, 0.52), pow(hotSpot, 1.25) * extremeHeat);
      float baseThermal = mix(0.20, 0.92, extremeHeat) + darkAbsorberBoost * 0.28;
      emissiveColor = thermalGlow * (pow(hotSpot, 1.45) * baseThermal * troughWindow + pow(trueDayside, 2.1) * (0.20 * extremeHeat));

      // Metallic silicate forward glint on high-albedo Class V cloud decks
      if (albedo > 0.28) {
        specular = pow(specBase, 18.0) * rawNdotL * (albedo - 0.25) * 0.65 * smoothstep(0.45, 0.90, tBand);
      }

      vec3 baseAtmo = length(jovianAtmoTint) > 0.01 ? jovianAtmoTint : vec3(0.95, 0.42, 0.16);
      atmoColor = mix(baseAtmo, thermalGlow * 0.92, hotSpot * (0.45 + extremeHeat * 0.40));
      atmoStrength = 0.78;
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

      // Smooth domain-warped ocean convective circulation
      vec3 warped = domainWarp(vLocalPos * 2.2 + effSeed, 0.38);
      float convectiveDepth = fbm(warped);

      // Multi-tier deep water mantle & gentle equatorial upwelling currents
      vec3 abyss = deepColor * 0.42;
      vec3 pelagic = deepColor;
      vec3 currentPlume = shallowColor;

      vec3 sea = mix(abyss, pelagic, smoothstep(-0.55, 0.20, convectiveDepth));
      sea = mix(sea, currentPlume, smoothstep(0.15, 0.65, convectiveDepth) * 0.50);
      surface = sea;

      // Smooth tropical cloud streamers & cyclonic storms with directional shadows
      vec4 hyceanClouds = evaluateCloudLayer(vLocalPos, L, time * 0.8, 0.60, effSeed * 1.7);
      float cloudMask = hyceanClouds.x;
      float shadowMask = hyceanClouds.y;
      float cloudCore = hyceanClouds.z;

      // Deep global ocean specular reflection: smooth, glassy liquid sheen
      float oceanSpec = pow(specBase, 28.0) * rawNdotL * 1.5;
      oceanSpec += pow(1.0 - max(0.0, dot(N, V)), 5.0) * 0.35 * rawNdotL;
      specular = oceanSpec * (1.0 - cloudMask);

      // Soft directional drop shadows onto dark ocean abyss
      float directShadow = shadowMask * clamp(rawNdotL * 1.4, 0.0, 1.0);
      surface *= (1.0 - directShadow);

      // Billowing high-albedo cloud deck with delicate forward scattering
      vec3 cloudColor = vec3(0.95, 0.97, 1.0) * clamp(dot(N, L) * 0.65 + 0.35, 0.30, 1.0);
      surface = mix(surface, cloudColor, cloudMask * 0.94);

      float cloudGlint = pow(specBase, 10.0) * (cloudMask - cloudCore) * 0.30;
      specular += cloudGlint;

      // Thick hydrogen Rayleigh scattering limb
      atmoColor = mix(vec3(0.18, 0.72, 1.0), shallowColor * 1.4, 0.28) * effColorTint;
      atmoStrength = 0.92;
    }
    // 15. Sudarsky Class IV Dark Alkali Gas Giant (e.g. TrES-2 b, high-opacity Na/K absorption)
    else if (themeIndex < 14.5) {
      float jetSpeed = 0.030;
      vec3 flow = zonalJetFlow(vLocalPos, time, jetSpeed);
      vec3 prof = jovianZonalProfile(vLocalPos, flow, bandTurbulence, effBandShift, effSeed, albedo);
      float tBand = prof.x;

      vec3 cDark = length(jovianBandDark) > 0.01 ? jovianBandDark : vec3(0.10, 0.09, 0.16) * effColorTint;
      vec3 cMid = length(jovianBandMid) > 0.01 ? jovianBandMid : vec3(0.20, 0.15, 0.29) * effColorTint;
      vec3 cLight = length(jovianBandLight) > 0.01 ? jovianBandLight : vec3(0.32, 0.20, 0.30) * effColorTint;
      vec3 cCloud = length(jovianBandCloud) > 0.01 ? jovianBandCloud : vec3(0.45, 0.27, 0.22) * effColorTint;

      vec3 compositeDark = evalSilkyPalette(tBand, cDark, cMid, cLight, cCloud);

      vec3 storm = evaluateJovianStorm(vLocalPos, time, jetSpeed, jovianStorm, effSeed);
      if (storm.x > 0.001) {
        float sWeight = abs(jovianStorm.w);
        vec3 darkEye = mix(cDark * 0.70, cCloud * 1.15, storm.z * 0.65);
        compositeDark = mix(compositeDark, darkEye, storm.x * 0.68 * sWeight);
      }

      float polarLat = abs(vLocalPos.y);
      vec3 pHood = length(jovianPolarTint) > 0.01 ? jovianPolarTint : cDark * 0.80;
      surface = mix(compositeDark, pHood, smoothstep(0.74, 0.98, polarLat) * 0.55);

      atmoColor = length(jovianAtmoTint) > 0.01 ? jovianAtmoTint : vec3(0.44, 0.34, 0.78) * effColorTint;
      atmoStrength = 0.58;

      // Deep infrared/crimson glow bleeding through dark alkali absorption troughs
      float sinShift = 0.2924;
      float cosShift = 0.9563;
      vec3 shiftedL = vec3(L.x * cosShift - L.z * sinShift, L.y, L.x * sinShift + L.z * cosShift);
      float hotSpot = max(0.0, dot(vLocalPos, shiftedL));
      float troughWindow = mix(1.55, 0.35, tBand);
      vec3 thermalGlow = blackbody(max(980.0, temperatureK));
      emissiveColor = thermalGlow * (pow(hotSpot, 1.75) * 0.36 + 0.07) * troughWindow * smoothstep(900.0, 1400.0, temperatureK);
    }
    // 16. Sudarsky Class II Gas Giant (Condensed tropospheric water vapor clouds, 155 - 350 K)
    else if (themeIndex < 15.5) {
      float jetSpeed = 0.024;
      vec3 flow = zonalJetFlow(vLocalPos, time, jetSpeed);
      vec3 prof = jovianZonalProfile(vLocalPos, flow, bandTurbulence, effBandShift, effSeed, albedo);
      float tBand = prof.x;
      float silk = prof.y;

      vec3 cDark = length(jovianBandDark) > 0.01 ? jovianBandDark : vec3(0.15, 0.36, 0.62) * effColorTint;
      vec3 cMid = length(jovianBandMid) > 0.01 ? jovianBandMid : vec3(0.36, 0.60, 0.84) * effColorTint;
      vec3 cLight = length(jovianBandLight) > 0.01 ? jovianBandLight : vec3(0.72, 0.86, 0.96) * effColorTint;
      vec3 cCloud = length(jovianBandCloud) > 0.01 ? jovianBandCloud : vec3(0.95, 0.98, 1.00) * effColorTint;

      vec3 compositeCloud = evalSilkyPalette(tBand, cDark, cMid, cLight, cCloud);

      // Tropospheric H2O ice-crystal cirrus wisps scaled by water-cloud albedo
      float h2oCirrus = smoothstep(0.24, 0.76, silk) * smoothstep(0.38, 0.82, tBand) * clamp((albedo - 0.45) * 1.25, 0.12, 0.48);
      compositeCloud = mix(compositeCloud, cCloud * 1.03, h2oCirrus);

      vec3 storm = evaluateJovianStorm(vLocalPos, time, jetSpeed, jovianStorm, effSeed);
      if (storm.x > 0.001 || storm.y > 0.001) {
        if (jovianStorm.w > 0.0) {
          vec3 whiteOval = mix(cLight, vec3(0.98, 0.99, 1.0), 0.55 + storm.z * 0.35);
          compositeCloud = mix(compositeCloud, cDark * 0.85, storm.y * 0.28 * jovianStorm.w);
          compositeCloud = mix(compositeCloud, whiteOval, storm.x * 0.82 * jovianStorm.w);
        } else {
          compositeCloud = mix(compositeCloud, cDark * 0.72, storm.x * 0.74 * (-jovianStorm.w));
        }
      }

      float polarLat = abs(vLocalPos.y);
      vec3 pHood = length(jovianPolarTint) > 0.01 ? jovianPolarTint : vec3(0.48, 0.68, 0.86) * effColorTint;
      compositeCloud = mix(compositeCloud, pHood, smoothstep(0.74, 0.97, polarLat) * 0.50);

      // Subtle silver-lining forward glint on dense water-ice cloud tops
      specular = pow(specBase, 14.0) * rawNdotL * clamp((albedo - 0.55) * 0.65, 0.0, 0.22) * smoothstep(0.55, 0.92, tBand);

      surface = compositeCloud;
      atmoColor = length(jovianAtmoTint) > 0.01 ? jovianAtmoTint : vec3(0.42, 0.70, 0.98) * effColorTint;
      atmoStrength = 0.68 + clamp((albedo - 0.50) * 0.45, 0.0, 0.18);
    }
    // 17. Carbonaceous Asteroid (Airless C-type chondrite / B-type, e.g. Hygiea, Pallas)
    else if (themeIndex < 16.5) {
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
    // 18. Sudarsky Class III Cloudless Gas Giant (350 - 900 K) & Silicate-Rain Cobalt Class IV (HD 189733 b)
    else {
      float jetSpeed = 0.027;
      vec3 flow = zonalJetFlow(vLocalPos, time, jetSpeed);
      vec3 prof = jovianZonalProfile(vLocalPos, flow, bandTurbulence, effBandShift, effSeed, albedo);
      // Cloudless Rayleigh atmospheres show silkier, subtler belt-to-zone contrast than condensed-cloud classes
      float subduedBand = mix(0.5, prof.x, 0.72);

      vec3 cDark = length(jovianBandDark) > 0.01 ? jovianBandDark : vec3(0.06, 0.13, 0.38) * effColorTint;
      vec3 cMid = length(jovianBandMid) > 0.01 ? jovianBandMid : vec3(0.10, 0.25, 0.60) * effColorTint;
      vec3 cLight = length(jovianBandLight) > 0.01 ? jovianBandLight : vec3(0.16, 0.39, 0.78) * effColorTint;
      vec3 cCloud = length(jovianBandCloud) > 0.01 ? jovianBandCloud : vec3(0.28, 0.54, 0.90) * effColorTint;

      vec3 compositeCobalt = evalSilkyPalette(subduedBand, cDark, cMid, cLight, cCloud);

      // Delicate high-altitude methane/silicate-haze streamlines
      float hazeStream = smoothstep(0.32, 0.82, prof.y) * 0.14;
      compositeCobalt = mix(compositeCobalt, cCloud * 1.06, hazeStream);

      vec3 storm = evaluateJovianStorm(vLocalPos, time, jetSpeed, jovianStorm, effSeed);
      if (storm.x > 0.001) {
        float sWeight = abs(jovianStorm.w);
        vec3 deepSpot = jovianStorm.w > 0.0 ? mix(cLight, cCloud * 1.15, storm.z) : cDark * 0.66;
        compositeCobalt = mix(compositeCobalt, deepSpot, storm.x * 0.66 * sWeight);
      }

      float polarLat = abs(vLocalPos.y);
      vec3 pHood = length(jovianPolarTint) > 0.01 ? jovianPolarTint : cDark * 0.84;
      compositeCobalt = mix(compositeCobalt, pHood, smoothstep(0.74, 0.97, polarLat) * 0.52);

      // Hot Class III / Cobalt Class IV (> 780 K) faint deep-troposphere thermal glow
      if (temperatureK > 780.0) {
        float subStellar = max(0.0, dot(vLocalPos, L));
        emissiveColor = blackbody(temperatureK) * pow(subStellar, 2.0) * smoothstep(780.0, 1300.0, temperatureK) * 0.16 * (1.2 - subduedBand * 0.5);
      }

      surface = compositeCobalt;
      atmoColor = length(jovianAtmoTint) > 0.01 ? jovianAtmoTint : vec3(0.22, 0.54, 0.98) * effColorTint;
      atmoStrength = 0.82;
    }

    // Physical Albedo modulation:
    // Giant volatile envelopes span dark alkali absorbers (0.015) to bright water/salt clouds (0.81);
    // rocky and ocean archetypes retain their [0.75, 1.50] optical response.
    bool isGiantEnvelope = sudarskyIndex > 0.5 || (themeIndex >= 2.5 && themeIndex < 4.5);
    float albedoFactor = isGiantEnvelope
      ? clamp(0.32 + pow(clamp(albedo, 0.0, 1.0), 0.74) * 1.22, 0.32, 1.54)
      : clamp(albedo * 0.90 + 0.68, 0.75, 1.50);

    float terminatorFactor = smoothstep(-0.25, 0.45, dot(N, L));
    float limbCurve = isGiantEnvelope ? mix(fresnel, pow(1.0 - max(0.0, dot(N, V)), 2.2), 0.35) : fresnel;
    vec3 rayleighGlow = atmoColor * (limbCurve * atmoStrength * (terminatorFactor * 0.7 + 0.3));

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
    case 'gas-giant-cloudless':
      return 17.0;
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
  sudarskyIndex: number;
  jovianBandDark: THREE.Vector3;
  jovianBandMid: THREE.Vector3;
  jovianBandLight: THREE.Vector3;
  jovianBandCloud: THREE.Vector3;
  jovianAtmoTint: THREE.Vector3;
  jovianPolarTint: THREE.Vector3;
  jovianStorm: THREE.Vector4;
}

export interface PlanetProceduralOptions {
  bodyId?: string;
  albedo?: number;
  sudarskyClass?: string;
  classification?: string;
  densityGcm3?: number;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function mixVec3(a: readonly [number, number, number], b: readonly [number, number, number], t: number): [number, number, number] {
  const k = clamp01(t);
  return [
    a[0] + (b[0] - a[0]) * k,
    a[1] + (b[1] - a[1]) * k,
    a[2] + (b[2] - a[2]) * k,
  ];
}

function scaleRgb(c: readonly [number, number, number], s: number): [number, number, number] {
  return [
    Math.max(0.01, Math.min(1.15, c[0] * s)),
    Math.max(0.01, Math.min(1.15, c[1] * s)),
    Math.max(0.01, Math.min(1.15, c[2] * s)),
  ];
}

function resolveSudarskyNumericIndex(sudarskyClass: string | undefined, themeIdx: number, tempK: number): number {
  if (sudarskyClass === 'Class I') return 1;
  if (sudarskyClass === 'Class II') return 2;
  if (sudarskyClass === 'Class III') return 3;
  if (sudarskyClass === 'Class IV') return 4;
  if (sudarskyClass === 'Class V') return 5;
  if (themeIdx >= 4.5 && themeIdx < 5.5) return 1;
  if (themeIdx >= 14.5 && themeIdx < 15.5) return 2;
  if (themeIdx >= 16.5 && themeIdx < 17.5) return tempK >= 900 ? 4 : 3;
  if ((themeIdx >= 5.5 && themeIdx < 6.5) || (themeIdx >= 13.5 && themeIdx < 14.5)) return 4;
  if (themeIdx >= 6.5 && themeIdx < 7.5) return 5;
  return 0;
}

function computeJovianAtmospherePalette(
  sudarskyIndex: number,
  themeIdx: number,
  tempK: number,
  albedo: number,
  hChem: number,
  hHue: number
): {
  dark: THREE.Vector3;
  mid: THREE.Vector3;
  light: THREE.Vector3;
  cloud: THREE.Vector3;
  atmo: THREE.Vector3;
  polar: THREE.Vector3;
} {
  let dark: [number, number, number] = [0.46, 0.24, 0.15];
  let mid: [number, number, number] = [0.74, 0.48, 0.30];
  let light: [number, number, number] = [0.90, 0.82, 0.70];
  let cloud: [number, number, number] = [0.98, 0.95, 0.89];
  let atmo: [number, number, number] = [0.86, 0.75, 0.60];
  let polar: [number, number, number] = [0.56, 0.61, 0.68];

  const hueJitter = (hHue - 0.5) * 0.08;

  if (sudarskyIndex === 1) {
    // Class I (<= 155 K): Ammonia ice clouds over NH4SH and P4/tholin chromophores
    const albFrac = clamp01((albedo - 0.34) / 0.26);
    const coldHaze = clamp01((95 - tempK) / 45);
    const warmFrost = clamp01((tempK - 130) / 25);

    if (hChem < 0.22) {
      // Classic Jovian Sienna & Ochre
      dark = [0.46 + hueJitter, 0.22, 0.13];
      mid = [0.74 + hueJitter * 0.6, 0.47, 0.28];
      light = [0.90, 0.82, 0.69];
      cloud = [0.98, 0.95, 0.88];
      polar = [0.54, 0.60, 0.69];
      atmo = [0.86, 0.74, 0.58];
    } else if (hChem < 0.44) {
      // Saturnian Champagne & Butterscotch
      dark = [0.53, 0.41 + hueJitter * 0.5, 0.24];
      mid = [0.76, 0.64, 0.42];
      light = [0.91, 0.85, 0.69];
      cloud = [0.97, 0.94, 0.83];
      polar = [0.52, 0.61, 0.64];
      atmo = [0.88, 0.80, 0.62];
    } else if (hChem < 0.64) {
      // Phosphide Russet-Rose & Alabaster
      dark = [0.44, 0.17, 0.15 - hueJitter * 0.4];
      mid = [0.72, 0.39, 0.31];
      light = [0.91, 0.79, 0.72];
      cloud = [0.98, 0.94, 0.91];
      polar = [0.57, 0.56, 0.66];
      atmo = [0.88, 0.68, 0.60];
    } else if (hChem < 0.82) {
      // Hydrosulfide Olive-Amber & Parchment
      dark = [0.41, 0.32 + hueJitter * 0.5, 0.18];
      mid = [0.66, 0.54, 0.33];
      light = [0.86, 0.81, 0.67];
      cloud = [0.95, 0.93, 0.85];
      polar = [0.49, 0.56, 0.60];
      atmo = [0.80, 0.76, 0.58];
    } else {
      // Cryo-Cinnamon & Slate Ivory
      dark = [0.38, 0.29, 0.27 - hueJitter * 0.4];
      mid = [0.64, 0.49, 0.40];
      light = [0.86, 0.82, 0.78];
      cloud = [0.96, 0.96, 0.95];
      polar = [0.51, 0.60, 0.71];
      atmo = [0.78, 0.79, 0.85];
    }

    if (coldHaze > 0.01) {
      dark = mixVec3(dark, [0.50, 0.40, 0.26], coldHaze * 0.35);
      light = mixVec3(light, [0.86, 0.79, 0.63], coldHaze * 0.32);
    }
    if (warmFrost > 0.01) {
      dark = mixVec3(dark, [0.34, 0.28, 0.32], warmFrost * 0.30);
      cloud = mixVec3(cloud, [0.99, 0.98, 0.97], warmFrost * 0.45);
    }

    const beltScale = 0.84 + albFrac * 0.26;
    const zoneScale = 0.93 + albFrac * 0.13;
    dark = scaleRgb(dark, beltScale);
    mid = scaleRgb(mid, 0.88 + albFrac * 0.20);
    light = scaleRgb(light, zoneScale);
    cloud = scaleRgb(cloud, 0.95 + albFrac * 0.08);
  } else if (sudarskyIndex === 2) {
    // Class II (155 - 350 K): Tropospheric H2O cloud decks over Rayleigh/methane sky belts
    const tFrac = clamp01((tempK - 155) / 195);
    const albFrac = clamp01((albedo - 0.54) / 0.27);

    const coldDark: [number, number, number] = [0.23, 0.46, 0.68];
    const midDark: [number, number, number] = [0.11, 0.32, 0.62];
    const warmDark: [number, number, number] = [0.07, 0.19, 0.47];

    const coldMid: [number, number, number] = [0.47, 0.70, 0.88];
    const midMid: [number, number, number] = [0.31, 0.57, 0.85];
    const warmMid: [number, number, number] = [0.19, 0.43, 0.74];

    const coldLight: [number, number, number] = [0.80, 0.91, 0.98];
    const midLight: [number, number, number] = [0.71, 0.86, 0.97];
    const warmLight: [number, number, number] = [0.57, 0.76, 0.92];

    dark = tFrac < 0.5 ? mixVec3(coldDark, midDark, tFrac * 2) : mixVec3(midDark, warmDark, (tFrac - 0.5) * 2);
    mid = tFrac < 0.5 ? mixVec3(coldMid, midMid, tFrac * 2) : mixVec3(midMid, warmMid, (tFrac - 0.5) * 2);
    light = tFrac < 0.5 ? mixVec3(coldLight, midLight, tFrac * 2) : mixVec3(midLight, warmLight, (tFrac - 0.5) * 2);
    cloud = mixVec3([0.90, 0.95, 0.99], [0.98, 0.99, 1.00], albFrac);
    polar = mixVec3([0.56, 0.73, 0.88], [0.28, 0.46, 0.72], tFrac);
    atmo = mixVec3([0.52, 0.78, 0.98], [0.28, 0.58, 0.95], tFrac);

    if (hChem < 0.30) {
      // Methane-enriched aquamarine-turquoise tint in deeper belts
      dark = [dark[0] * 0.85, Math.min(1, dark[1] * 1.16), dark[2] * 0.96];
      mid = [mid[0] * 0.90, Math.min(1, mid[1] * 1.10), mid[2] * 0.98];
    } else if (hChem > 0.72) {
      // Trace tropospheric sulfide warmth in cloud-top highlights
      light = [Math.min(1, light[0] * 1.05), light[1] * 1.01, light[2] * 0.96];
      cloud = [0.99, 0.98, 0.95];
    }

    dark = scaleRgb(dark, 0.82 + albFrac * 0.28);
    light = scaleRgb(light, 0.92 + albFrac * 0.12);
  } else if (sudarskyIndex === 3) {
    // Class III (350 - 900 K): Cloudless H2/He Rayleigh scattering darkened by Na/K absorption wings
    const tFrac = clamp01((tempK - 350) / 550);
    const albFrac = clamp01((albedo - 0.05) / 0.16);

    const coolD: [number, number, number] = [0.06, 0.20, 0.46];
    const midD: [number, number, number] = [0.05, 0.11, 0.36];
    const hotD: [number, number, number] = [0.07, 0.07, 0.22];

    const coolM: [number, number, number] = [0.11, 0.35, 0.68];
    const midM: [number, number, number] = [0.09, 0.22, 0.58];
    const hotM: [number, number, number] = [0.13, 0.14, 0.38];

    const coolL: [number, number, number] = [0.19, 0.52, 0.84];
    const midL: [number, number, number] = [0.15, 0.36, 0.76];
    const hotL: [number, number, number] = [0.21, 0.24, 0.54];

    const coolC: [number, number, number] = [0.34, 0.68, 0.94];
    const midC: [number, number, number] = [0.25, 0.50, 0.88];
    const hotC: [number, number, number] = [0.33, 0.35, 0.68];

    dark = tFrac < 0.5 ? mixVec3(coolD, midD, tFrac * 2) : mixVec3(midD, hotD, (tFrac - 0.5) * 2);
    mid = tFrac < 0.5 ? mixVec3(coolM, midM, tFrac * 2) : mixVec3(midM, hotM, (tFrac - 0.5) * 2);
    light = tFrac < 0.5 ? mixVec3(coolL, midL, tFrac * 2) : mixVec3(midL, hotL, (tFrac - 0.5) * 2);
    cloud = tFrac < 0.5 ? mixVec3(coolC, midC, tFrac * 2) : mixVec3(midC, hotC, (tFrac - 0.5) * 2);
    polar = scaleRgb(dark, 0.86);
    atmo = mixVec3([0.26, 0.66, 0.98], [0.24, 0.38, 0.86], tFrac);

    if (hChem < 0.32) {
      // Residual CH4 cyan-teal tilt
      mid[1] = Math.min(1, mid[1] * 1.14);
      light[1] = Math.min(1, light[1] * 1.12);
    } else if (hChem > 0.70) {
      // Strong potassium 770 nm violet-indigo tilt
      mid[0] = Math.min(1, mid[0] * 1.18);
      light[0] = Math.min(1, light[0] * 1.15);
    }

    const rayleighGain = 0.82 + albFrac * 0.34;
    dark = scaleRgb(dark, rayleighGain);
    mid = scaleRgb(mid, rayleighGain);
    light = scaleRgb(light, rayleighGain);
    cloud = scaleRgb(cloud, rayleighGain);
  } else if (sudarskyIndex === 4) {
    // Class IV (900 - 1400 K): Strong atomic Na/K absorption above deep silicate/iron clouds
    const tFrac = clamp01((tempK - 900) / 500);
    const albFrac = clamp01((albedo - 0.015) / 0.125);

    if (themeIdx >= 16.5) {
      // Silicate-rain Rayleigh cobalt hot Jupiter (HD 189733 b class)
      dark = [0.05, 0.12, 0.38];
      mid = [0.09, 0.26, 0.66];
      light = [0.16, 0.42, 0.84];
      cloud = [0.30, 0.58, 0.96];
      polar = [0.05, 0.10, 0.30];
      atmo = [0.20, 0.56, 1.00];
    } else if (albedo <= 0.058 || (themeIdx >= 13.5 && themeIdx < 14.5)) {
      // Ultra-dark alkali absorber (TrES-2 b and dark Na/K peers)
      const sootyD: [number, number, number] = [0.07, 0.06, 0.09];
      const plumD: [number, number, number] = [0.10, 0.08, 0.16];
      dark = mixVec3(sootyD, plumD, hChem);
      mid = mixVec3([0.14, 0.11, 0.17], [0.20, 0.14, 0.28], hChem);
      light = mixVec3([0.23, 0.16, 0.21], [0.31, 0.20, 0.30], hChem);
      cloud = mixVec3([0.36, 0.22, 0.19], [0.46, 0.28, 0.24], tFrac * 0.7 + hChem * 0.3);
      polar = scaleRgb(dark, 0.80);
      atmo = mixVec3([0.36, 0.28, 0.62], [0.54, 0.32, 0.58], tFrac);

      const ultraDarkScale = 0.72 + clamp01(albedo / 0.058) * 0.36;
      dark = scaleRgb(dark, ultraDarkScale);
      mid = scaleRgb(mid, ultraDarkScale);
      light = scaleRgb(light, ultraDarkScale);
      cloud = scaleRgb(cloud, ultraDarkScale);
    } else {
      // Standard Class IV: smoky violet-bronze (900-1150 K) to mahogany & copper silicate (1150-1400 K)
      const cool4D: [number, number, number] = [0.14, 0.10, 0.18];
      const hot4D: [number, number, number] = [0.22, 0.08, 0.07];
      const cool4M: [number, number, number] = [0.28, 0.18, 0.27];
      const hot4M: [number, number, number] = [0.45, 0.17, 0.12];
      const cool4L: [number, number, number] = [0.46, 0.28, 0.27];
      const hot4L: [number, number, number] = [0.68, 0.32, 0.17];
      const cool4C: [number, number, number] = [0.64, 0.40, 0.30];
      const hot4C: [number, number, number] = [0.88, 0.52, 0.26];

      const blend = clamp01(tFrac * 0.72 + (hChem - 0.5) * 0.36);
      dark = mixVec3(cool4D, hot4D, blend);
      mid = mixVec3(cool4M, hot4M, blend);
      light = mixVec3(cool4L, hot4L, blend);
      cloud = mixVec3(cool4C, hot4C, blend);
      polar = scaleRgb(dark, 0.82);
      atmo = mixVec3([0.62, 0.38, 0.56], [0.90, 0.42, 0.20], blend);

      const silicateLift = 0.85 + albFrac * 0.32;
      light = scaleRgb(light, silicateLift);
      cloud = scaleRgb(cloud, silicateLift);
    }
  } else {
    // Class V (>= 1400 K): Reflective high-altitude silicates (1400-1920 K) to dissociated H- daysides (> 2280 K)
    const albFrac = clamp01((albedo - 0.03) / 0.53);

    if (tempK < 1920 && albedo >= 0.26) {
      // Reflective high-altitude enstatite / forsterite / quartz silicate cloud decks (Kepler-7 b regime)
      if (hChem < 0.36) {
        // Golden Saffron & Garnet
        dark = [0.36, 0.13, 0.07];
        mid = [0.68, 0.32, 0.12];
        light = [0.92, 0.62, 0.24];
        cloud = [1.00, 0.86, 0.52];
        atmo = [0.96, 0.62, 0.24];
      } else if (hChem < 0.70) {
        // Warm Bronze-Ochre & Quartz Cream
        dark = [0.34, 0.20, 0.12];
        mid = [0.62, 0.42, 0.24];
        light = [0.86, 0.70, 0.45];
        cloud = [0.98, 0.90, 0.72];
        atmo = [0.94, 0.76, 0.46];
      } else {
        // Copper-Coral & Marigold Silicates
        dark = [0.40, 0.12, 0.09];
        mid = [0.74, 0.28, 0.14];
        light = [0.95, 0.54, 0.22];
        cloud = [1.00, 0.80, 0.46];
        atmo = [0.96, 0.50, 0.20];
      }
      polar = scaleRgb(dark, 0.80);
      const deckGain = 0.90 + albFrac * 0.22;
      light = scaleRgb(light, deckGain);
      cloud = scaleRgb(cloud, deckGain);
    } else if (tempK < 2280 && albedo >= 0.15) {
      // Partial silicate sublimation / iron-corundum transition (1920 - 2280 K)
      const subFrac = clamp01((tempK - 1900) / 380);
      dark = mixVec3([0.32, 0.09, 0.07], [0.18, 0.07, 0.09], subFrac);
      mid = mixVec3([0.66, 0.22, 0.09], [0.42, 0.14, 0.12], subFrac);
      light = mixVec3([0.90, 0.45, 0.15], [0.68, 0.28, 0.15], subFrac);
      cloud = mixVec3([1.00, 0.75, 0.35], [0.88, 0.52, 0.26], subFrac);
      polar = scaleRgb(dark, 0.78);
      atmo = [0.95, 0.42, 0.16];
    } else {
      // Ultra-hot dissociated H- continuum absorber (WASP-12 b, HAT-P-7 b, WASP-121 b, KELT-9 b)
      const ultraScale = 0.72 + clamp01(albedo / 0.15) * 0.34;
      dark = scaleRgb([0.13, 0.06, 0.10], ultraScale);
      mid = scaleRgb([0.27, 0.11, 0.14], ultraScale);
      light = scaleRgb([0.48, 0.20, 0.16], ultraScale);
      cloud = scaleRgb([0.72, 0.36, 0.22], ultraScale);
      polar = scaleRgb(dark, 0.76);
      atmo = tempK > 3000 ? [0.96, 0.78, 0.68] : [0.94, 0.38, 0.16];
    }
  }

  return {
    dark: new THREE.Vector3(...dark),
    mid: new THREE.Vector3(...mid),
    light: new THREE.Vector3(...light),
    cloud: new THREE.Vector3(...cloud),
    atmo: new THREE.Vector3(...atmo),
    polar: new THREE.Vector3(...polar),
  };
}

// Synthesizes Neptunian atmospheric palettes from equilibrium temperature, optical albedo,
// bulk-density metallicity (super-puffs vs volatile-rich envelopes), and condensate/haze chemistry.
function computeNeptunianAtmospherePalette(
  tempK: number,
  albedo: number,
  densityGcm3: number | undefined,
  hChem: number,
  hHue: number
): {
  dark: THREE.Vector3;
  mid: THREE.Vector3;
  light: THREE.Vector3;
  cloud: THREE.Vector3;
  atmo: THREE.Vector3;
  polar: THREE.Vector3;
} {
  const a = clamp01(albedo);
  const rho = densityGcm3 ?? 1.65;
  const isSuperPuff = rho > 0 && rho < 1.05;
  const metalBlend = clamp01((rho - 1.35) / 1.65);

  let dark: [number, number, number];
  let mid: [number, number, number];
  let light: [number, number, number];
  let cloud: [number, number, number];
  let atmo: [number, number, number];
  let polar: [number, number, number];

  if (tempK <= 220) {
    // Cryogenic CH4 + H2S ice giants: stagnant hydrocarbon haze (Uranus-like) vs active methane azure (Neptune-like)
    const brightGain = 0.86 + clamp01((a - 0.26) / 0.22) * 0.22;
    if (a >= 0.345 || hChem < 0.42) {
      dark = scaleRgb(mixVec3([0.24, 0.56, 0.68], [0.20, 0.52, 0.62], hHue), brightGain);
      mid = scaleRgb(mixVec3([0.38, 0.73, 0.82], [0.34, 0.70, 0.78], hHue), brightGain);
      light = scaleRgb(mixVec3([0.56, 0.85, 0.90], [0.52, 0.83, 0.86], hHue), brightGain);
      cloud = scaleRgb([0.84, 0.95, 0.97], brightGain);
      polar = scaleRgb([0.66, 0.88, 0.90], brightGain);
      atmo = [0.46, 0.82, 0.92];
    } else {
      dark = scaleRgb(mixVec3([0.07, 0.26, 0.68], [0.11, 0.24, 0.72], hHue), brightGain);
      mid = scaleRgb(mixVec3([0.15, 0.44, 0.84], [0.21, 0.42, 0.86], hHue), brightGain);
      light = scaleRgb(mixVec3([0.29, 0.65, 0.94], [0.36, 0.62, 0.95], hHue), brightGain);
      cloud = [0.90, 0.96, 1.00];
      polar = scaleRgb(mixVec3([0.14, 0.38, 0.74], [0.22, 0.44, 0.80], hHue), brightGain);
      atmo = mixVec3([0.28, 0.64, 0.98], [0.38, 0.62, 0.98], hHue);
    }
  } else if (tempK < 480) {
    // Cool/temperate sub-Neptunes: bright H2O/NH3 cloud decks vs UV photochemical tholin haze
    if (a >= 0.40) {
      const cloudBright = 0.88 + clamp01((a - 0.40) / 0.28) * 0.22;
      dark = scaleRgb(mixVec3([0.18, 0.44, 0.66], [0.16, 0.48, 0.58], metalBlend), cloudBright);
      mid = scaleRgb(mixVec3([0.38, 0.66, 0.82], [0.36, 0.68, 0.74], metalBlend), cloudBright);
      light = scaleRgb(mixVec3([0.66, 0.84, 0.93], [0.64, 0.85, 0.88], metalBlend), cloudBright);
      cloud = scaleRgb([0.94, 0.98, 1.00], cloudBright);
      polar = scaleRgb([0.30, 0.52, 0.68], cloudBright);
      atmo = mixVec3([0.42, 0.76, 0.96], [0.46, 0.80, 0.86], metalBlend);
    } else if (hHue < 0.56) {
      dark = [0.12, 0.31, 0.38];
      mid = [0.24, 0.48, 0.52];
      light = [0.42, 0.66, 0.66];
      cloud = [0.76, 0.88, 0.88];
      polar = [0.16, 0.34, 0.38];
      atmo = [0.34, 0.68, 0.72];
    } else {
      // Organic tholin photochemical haze under K/M-dwarf UV flux
      dark = mixVec3([0.22, 0.29, 0.35], [0.28, 0.27, 0.31], metalBlend);
      mid = mixVec3([0.38, 0.45, 0.47], [0.46, 0.43, 0.42], metalBlend);
      light = mixVec3([0.56, 0.60, 0.58], [0.64, 0.59, 0.53], metalBlend);
      cloud = [0.80, 0.81, 0.78];
      polar = [0.26, 0.30, 0.33];
      atmo = [0.48, 0.58, 0.62];
    }
  } else if (tempK < 850) {
    // Warm Neptunes: reflective KCl/ZnS salt clouds (GJ 1214 b), CO/H2O CH4-depleted skies (Gliese 436 b), or hydrocarbon soot
    if (a >= 0.33) {
      const saltGain = 0.88 + clamp01((a - 0.33) / 0.25) * 0.22;
      dark = scaleRgb(mixVec3([0.38, 0.42, 0.52], [0.44, 0.42, 0.48], metalBlend), saltGain);
      mid = scaleRgb(mixVec3([0.58, 0.61, 0.69], [0.63, 0.60, 0.64], metalBlend), saltGain);
      light = scaleRgb(mixVec3([0.76, 0.78, 0.84], [0.81, 0.79, 0.80], metalBlend), saltGain);
      cloud = scaleRgb([0.94, 0.95, 0.97], saltGain);
      polar = scaleRgb([0.46, 0.48, 0.56], saltGain);
      atmo = mixVec3([0.62, 0.68, 0.84], [0.72, 0.70, 0.78], metalBlend);
    } else if (a >= 0.13) {
      const warmFade = clamp01((tempK - 480) / 370);
      dark = mixVec3([0.10, 0.20, 0.42], [0.13, 0.17, 0.36], warmFade);
      mid = mixVec3([0.20, 0.34, 0.58], [0.24, 0.29, 0.52], warmFade);
      light = mixVec3([0.34, 0.49, 0.72], [0.38, 0.43, 0.66], warmFade);
      cloud = mixVec3([0.66, 0.76, 0.90], [0.68, 0.72, 0.86], warmFade);
      polar = [0.12, 0.18, 0.34];
      atmo = mixVec3([0.32, 0.50, 0.84], [0.40, 0.46, 0.78], metalBlend);
    } else {
      // Hydrocarbon soot and tholin smog maximum (~550-800 K)
      dark = [0.13, 0.10, 0.16];
      mid = mixVec3([0.24, 0.19, 0.26], [0.28, 0.21, 0.22], hHue);
      light = mixVec3([0.36, 0.30, 0.36], [0.42, 0.32, 0.30], hHue);
      cloud = [0.54, 0.47, 0.50];
      polar = [0.11, 0.09, 0.13];
      atmo = [0.38, 0.32, 0.44];
    }
  } else if (tempK < 1500) {
    // Hot Neptunes: Na2S sulfide clouds, clear H2O + Na/K optical absorption, or heavy carbon-alkali dark haze
    if (a >= 0.15) {
      dark = [0.19, 0.16, 0.20];
      mid = mixVec3([0.34, 0.29, 0.30], [0.38, 0.31, 0.26], metalBlend);
      light = mixVec3([0.52, 0.45, 0.42], [0.56, 0.47, 0.38], metalBlend);
      cloud = [0.74, 0.67, 0.58];
      polar = [0.16, 0.14, 0.17];
      atmo = [0.56, 0.48, 0.44];
    } else if (a >= 0.08) {
      dark = [0.06, 0.11, 0.25];
      mid = [0.13, 0.21, 0.39];
      light = [0.22, 0.33, 0.53];
      cloud = [0.46, 0.57, 0.74];
      polar = [0.05, 0.09, 0.20];
      atmo = [0.26, 0.44, 0.74];
    } else {
      dark = [0.05, 0.04, 0.08];
      mid = [0.10, 0.08, 0.14];
      light = [0.17, 0.14, 0.21];
      cloud = [0.28, 0.23, 0.31];
      polar = [0.04, 0.03, 0.06];
      atmo = [0.26, 0.20, 0.34];
    }
  } else {
    // Neptunian desert (>= 1500 K): high-altitude enstatite silicate haze vs dissociated thermal envelope
    if (a >= 0.18 && tempK < 1950) {
      dark = [0.22, 0.14, 0.14];
      mid = [0.44, 0.30, 0.24];
      light = [0.66, 0.49, 0.37];
      cloud = [0.86, 0.74, 0.60];
      polar = [0.18, 0.12, 0.12];
      atmo = [0.84, 0.56, 0.38];
    } else {
      dark = [0.07, 0.04, 0.08];
      mid = [0.15, 0.08, 0.12];
      light = [0.26, 0.14, 0.16];
      cloud = [0.42, 0.22, 0.20];
      polar = [0.06, 0.03, 0.06];
      atmo = [0.76, 0.32, 0.22];
    }
  }

  // Ultra-low-density super-puffs exhibit extended Rayleigh scattering scale heights with airy cyan-lavender limbs
  if (isSuperPuff) {
    atmo = scaleRgb(mixVec3(atmo, [0.58, 0.80, 0.98], 0.35), 1.14);
    light = mixVec3(light, [0.70, 0.84, 0.96], 0.16);
  }

  return {
    dark: new THREE.Vector3(...dark),
    mid: new THREE.Vector3(...mid),
    light: new THREE.Vector3(...light),
    cloud: new THREE.Vector3(...cloud),
    atmo: new THREE.Vector3(...atmo),
    polar: new THREE.Vector3(...polar),
  };
}

// Generates deterministic per-planet procedural uniforms for Jovian, Neptunian, rocky, and ocean worlds.
export function getPlanetBucketUniforms(
  themeIdx: number,
  bucket: number,
  tempK: number = 300,
  options?: PlanetProceduralOptions
): PlanetBucketUniforms {
  const identityKey = options?.bodyId ?? `bucket-${themeIdx}-${bucket}`;
  const h1 = hashStringToFloat(`${identityKey}-seed`, 11);
  const h2 = hashStringToFloat(`${identityKey}-tint`, 23);
  const h3 = hashStringToFloat(`${identityKey}-band`, 37);
  const hChem = hashStringToFloat(`${identityKey}-chem`, 29);
  const hHue = hashStringToFloat(`${identityKey}-hue`, 53);
  const hStripe = hashStringToFloat(identityKey, 97);

  const seed = options?.bodyId ? h1 * 987.65 + h2 * 314.159 : h1 * 987.65 + bucket * 31.4159;
  const bandShift = (h3 - 0.5) * 0.8;
  let bandTurbulence = 0.8 + h1 * 0.6;

  const tint = new THREE.Vector3(1.0, 1.0, 1.0);
  const b16 = ((bucket % 16) + 16) % 16;

  const sudarskyIndex = resolveSudarskyNumericIndex(options?.sudarskyClass, themeIdx, tempK);
  const effAlbedo = options?.albedo ?? 0.30;

  // >=60% (~65%) of Jovians receive fewer, smoother broad stripes; ~35% receive multi-belt horizontal zones
  const smoothThreshold = sudarskyIndex === 2 ? 0.68 : 0.64;
  const isSmoothBroadJovian = options?.bodyId ? hStripe < smoothThreshold : b16 < 10;
  const isUltraBroadJovian = options?.bodyId ? hStripe < 0.25 : b16 < 4;
  const jovianBandTurbulence = isUltraBroadJovian
    ? 0.18 + h1 * 0.14
    : isSmoothBroadJovian
    ? 0.34 + h1 * 0.20
    : 0.77 + h1 * 0.30;

  let jovianBandDark = new THREE.Vector3(0, 0, 0);
  let jovianBandMid = new THREE.Vector3(0, 0, 0);
  let jovianBandLight = new THREE.Vector3(0, 0, 0);
  let jovianBandCloud = new THREE.Vector3(0, 0, 0);
  let jovianAtmoTint = new THREE.Vector3(0, 0, 0);
  let jovianPolarTint = new THREE.Vector3(0, 0, 0);
  const jovianStorm = new THREE.Vector4(0, 0, 0.06, 0);

  if (sudarskyIndex > 0) {
    const pal = computeJovianAtmospherePalette(sudarskyIndex, themeIdx, tempK, effAlbedo, hChem, hHue);
    jovianBandDark = pal.dark;
    jovianBandMid = pal.mid;
    jovianBandLight = pal.light;
    jovianBandCloud = pal.cloud;
    jovianAtmoTint = pal.atmo;
    jovianPolarTint = pal.polar;
    bandTurbulence = jovianBandTurbulence;

    const hStormPresence = hashStringToFloat(`${identityKey}-storm`, 71);
    const hStormLat = hashStringToFloat(`${identityKey}-slat`, 83);
    const hStormLon = hashStringToFloat(`${identityKey}-slon`, 109);
    if (hStormPresence >= 0.62) {
      const sign = hStormLat < 0.5 ? -1 : 1;
      const latMag = 0.12 + ((hStormLat * 2) % 1) * 0.40;
      const lon = (hStormLon - 0.5) * Math.PI * 2;
      const isOval = hStormPresence < 0.87;
      const radius = isOval ? 0.055 + hHue * 0.042 : 0.038 + hHue * 0.024;
      const strength = isOval ? 0.68 + hChem * 0.30 : -(0.62 + hChem * 0.28);
      jovianStorm.set(sign * latMag, lon, radius, strength);
    }
  } else if (themeIdx >= 2.5 && themeIdx < 4.5) {
    const pal = computeNeptunianAtmospherePalette(tempK, effAlbedo, options?.densityGcm3, hChem, hHue);
    jovianBandDark = pal.dark;
    jovianBandMid = pal.mid;
    jovianBandLight = pal.light;
    jovianBandCloud = pal.cloud;
    jovianAtmoTint = pal.atmo;
    jovianPolarTint = pal.polar;
    tint.set(1.0, 1.0, 1.0);

    // ~70% of Neptunians render as smooth Uranus/haze globes; ~30% show subtle 2-4 band Neptune circulation
    const isSmoothNeptunian = options?.bodyId ? hStripe < 0.70 : b16 < 11;
    bandTurbulence = isSmoothNeptunian ? 0.08 + h1 * 0.20 : 0.48 + h1 * 0.34;

    const hStormPresence = hashStringToFloat(`${identityKey}-nstorm`, 73);
    const hStormLat = hashStringToFloat(`${identityKey}-nslat`, 89);
    const hStormLon = hashStringToFloat(`${identityKey}-nslon`, 113);
    const hasDarkSpot =
      (!isSmoothNeptunian && hStormPresence >= 0.55) ||
      (isSmoothNeptunian && tempK < 320 && hStormPresence >= 0.93);
    if (hasDarkSpot) {
      const sign = hStormLat < 0.5 ? -1 : 1;
      const latMag = 0.14 + ((hStormLat * 2) % 1) * 0.34;
      const lon = (hStormLon - 0.5) * Math.PI * 2;
      const radius = 0.042 + hHue * 0.026;
      const strength = -(0.52 + hChem * 0.28);
      jovianStorm.set(sign * latMag, lon, radius, strength);
    }
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

  // Polar ice caps: only present on habitable ocean worlds (themeIdx == 1.0) with cold temperatures
  if (themeIdx >= 15.5 || tempK >= 320.0 || themeIdx < 0.5 || (themeIdx >= 1.5 && themeIdx < 2.5)) {
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
    sudarskyIndex,
    jovianBandDark,
    jovianBandMid,
    jovianBandLight,
    jovianBandCloud,
    jovianAtmoTint,
    jovianPolarTint,
    jovianStorm,
  };
}
