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

  // 4-octave Fractional Brownian Motion
  float fbm(vec3 p) {
    float f = 0.0;
    f += 0.5000 * snoise(p); p = p * 2.02;
    f += 0.2500 * snoise(p); p = p * 2.03;
    f += 0.1250 * snoise(p); p = p * 2.01;
    f += 0.0625 * snoise(p);
    return f;
  }

  // Ridged multifractal for razor-sharp mountain cordilleras and tectonic faults
  float ridgedFbm(vec3 p) {
    float sum = 0.0;
    float amp = 0.5;
    float prev = 1.0;
    for (int i = 0; i < 4; i++) {
      float n = 1.0 - abs(snoise(p));
      n = n * n;
      sum += n * amp * prev;
      prev = n;
      p *= 2.04;
      amp *= 0.5;
    }
    return sum;
  }

  // Analytical 3D curl turbulence approximation for atmospheric vortex shear
  vec3 curlNoise(vec3 p) {
    const float e = 0.05;
    float n1 = snoise(vec3(p.x, p.y + e, p.z));
    float n2 = snoise(vec3(p.x, p.y - e, p.z));
    float n3 = snoise(vec3(p.x, p.y, p.z + e));
    float n4 = snoise(vec3(p.x, p.y, p.z - e));
    float n5 = snoise(vec3(p.x + e, p.y, p.z));
    float n6 = snoise(vec3(p.x - e, p.y, p.z));
    return normalize(vec3(
      (n1 - n2) - (n3 - n4),
      (n3 - n4) - (n5 - n6),
      (n5 - n6) - (n1 - n2)
    ));
  }

  // Multi-octave domain warping: p' = p + alpha * noise(p + beta)
  vec3 domainWarp(vec3 p, float strength) {
    vec3 q = vec3(
      fbm(p + vec3(0.0, 0.0, 0.0)),
      fbm(p + vec3(5.2, 1.3, 2.8)),
      fbm(p + vec3(1.8, 9.2, 4.3))
    );
    return p + strength * q;
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

  void main() {
    #include <logdepthbuf_fragment>
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);
    vec3 L = normalize(lightDir);

    float NdotL = clamp(dot(N, L) * 0.5 + 0.45, 0.2, 1.0);
    float fresnel = pow(1.0 - max(0.0, dot(N, V)), 2.8);

    vec3 surface = vec3(0.5);
    vec3 atmoColor = vec3(0.3, 0.6, 1.0);
    float atmoStrength = 0.6;
    float emissive = 0.0;

    // 1. Rocky Terrestrial
    if (themeIndex < 0.5) {
      vec3 warped = domainWarp(vLocalPos * 3.5 + seed, 0.35);
      float craggy = ridgedFbm(warped);
      surface = mix(vec3(0.38, 0.34, 0.30), vec3(0.72, 0.65, 0.58), craggy);
      atmoColor = vec3(0.65, 0.72, 0.82);
      atmoStrength = 0.18;
    }
    // 2. Terrestrial Ocean World (Earth-like)
    else if (themeIndex < 1.5) {
      vec3 warped = domainWarp(vLocalPos * 2.8 + seed, 0.4);
      float h = fbm(warped);
      if (h < 0.0) {
        surface = mix(vec3(0.02, 0.12, 0.38), vec3(0.06, 0.32, 0.58), h + 0.5);
      } else {
        float ridges = ridgedFbm(warped * 2.0);
        surface = mix(vec3(0.18, 0.40, 0.16), vec3(0.55, 0.48, 0.34), ridges * 0.7);
      }
      atmoColor = vec3(0.35, 0.65, 1.0);
      atmoStrength = 0.75;
    }
    // 3. Super-Earth
    else if (themeIndex < 2.5) {
      vec3 warped = domainWarp(vLocalPos * 3.2 + seed, 0.5);
      float h = ridgedFbm(warped);
      surface = mix(vec3(0.32, 0.18, 0.12), vec3(0.58, 0.42, 0.30), h);
      atmoColor = vec3(0.45, 0.75, 0.60);
      atmoStrength = 0.65;
    }
    // 4. Sub-Neptune
    else if (themeIndex < 3.5) {
      vec3 bandPos = vec3(vLocalPos.x * 1.5, vLocalPos.y * 14.0, vLocalPos.z * 1.5);
      vec3 curl = curlNoise(vLocalPos * 2.5 + time * 0.02);
      float band = fbm(bandPos + curl * 1.2);
      surface = mix(vec3(0.08, 0.32, 0.58), vec3(0.28, 0.68, 0.78), band * 0.5 + 0.5);
      atmoColor = vec3(0.38, 0.72, 1.0);
      atmoStrength = 0.85;
    }
    // 5. Ice Giant (Uranus / Neptune-like)
    else if (themeIndex < 4.5) {
      vec3 bandPos = vec3(vLocalPos.x, vLocalPos.y * 10.0, vLocalPos.z);
      float band = fbm(bandPos);
      surface = mix(vec3(0.12, 0.42, 0.72), vec3(0.32, 0.68, 0.88), band * 0.5 + 0.5);
      atmoColor = vec3(0.32, 0.65, 0.95);
      atmoStrength = 0.80;
    }
    // 6. Gas Giant Banded (Jupiter/Saturn-like, Class I)
    else if (themeIndex < 5.5) {
      vec3 bandPos = vec3(vLocalPos.x * 2.0, vLocalPos.y * 20.0, vLocalPos.z * 2.0);
      vec3 curl = curlNoise(vLocalPos * 3.5 + time * 0.015);
      float band = fbm(bandPos + curl * 1.8);
      surface = mix(vec3(0.65, 0.45, 0.28), vec3(0.88, 0.78, 0.64), band * 0.5 + 0.5);
      atmoColor = vec3(0.82, 0.72, 0.55);
      atmoStrength = 0.48;
    }
    // 7. Hot Jupiter (Silicate/Iron clouds, Class IV)
    else if (themeIndex < 6.5) {
      vec3 bandPos = vec3(vLocalPos.x * 2.0, vLocalPos.y * 16.0, vLocalPos.z * 2.0);
      float band = fbm(bandPos);
      surface = mix(vec3(0.42, 0.16, 0.10), vec3(0.75, 0.38, 0.18), band * 0.5 + 0.5);
      atmoColor = vec3(1.0, 0.45, 0.20);
      atmoStrength = 0.70;
    }
    // 8. Ultra-Hot Jupiter / Glowing Dayside (Class V)
    else if (themeIndex < 7.5) {
      float dayside = max(0.0, dot(vLocalPos, L));
      vec3 glow = blackbody(temperatureK);
      float n = fbm(vLocalPos * 4.5 + time * 0.04);
      vec3 darkCrust = vec3(0.06, 0.05, 0.08);
      surface = mix(darkCrust, glow, pow(dayside, 1.4) * (n * 0.3 + 0.85));
      atmoColor = vec3(1.0, 0.35, 0.12);
      atmoStrength = 0.95;
      emissive = pow(dayside, 2.0) * 0.5;
    }
    // 9. Lava World (Molten Magma Oceans)
    else if (themeIndex < 8.5) {
      float subStellar = max(0.0, dot(vLocalPos, vec3(0.0, 0.0, 1.0)));
      float cracks = fbm(vLocalPos * 9.0 + time * 0.08);
      vec3 rock = vec3(0.07, 0.06, 0.07);
      vec3 magma = blackbody(temperatureK);
      surface = mix(rock, magma, pow(subStellar, 1.5) * step(0.32, cracks));
      atmoStrength = 0.20;
      emissive = pow(subStellar, 1.8) * 0.6;
    }
    // 10. KBO Tholin
    else if (themeIndex < 9.5) {
      float n = fbm(vLocalPos * 4.5 + seed);
      surface = mix(vec3(0.56, 0.32, 0.22), vec3(0.80, 0.60, 0.46), n * 0.5 + 0.5);
      atmoColor = vec3(0.55, 0.68, 0.85);
      atmoStrength = 0.22;
    }
    // 11. Icy Moon / KBO Ice
    else if (themeIndex < 10.5) {
      float n = fbm(vLocalPos * 5.0 + seed);
      surface = mix(vec3(0.58, 0.68, 0.78), vec3(0.90, 0.94, 0.98), n * 0.5 + 0.5);
      atmoColor = vec3(0.45, 0.78, 1.0);
      atmoStrength = 0.30;
    }
    // 12. Star / Solar Plasma
    else if (themeIndex < 11.5) {
      float plasma = fbm(vLocalPos * 4.0 + time * 0.15);
      surface = mix(vec3(1.0, 0.7, 0.2), vec3(1.0, 0.95, 0.7), plasma * 0.5 + 0.5) * 1.5;
      atmoColor = vec3(1.0, 0.6, 0.1);
      atmoStrength = 1.2;
    }
    // 13. Mirror World (Ultra-High Albedo Titanate/Silicate Clouds, e.g. LTT 9779 b)
    else if (themeIndex < 12.5) {
      vec3 warped = domainWarp(vLocalPos * 3.0 + time * 0.01, 0.3);
      float clouds = fbm(warped);
      surface = mix(vec3(0.88, 0.92, 0.98), vec3(0.96, 0.98, 1.0), clouds * 0.5 + 0.5);
      atmoColor = vec3(0.70, 0.85, 1.0);
      atmoStrength = 0.90;
    }
    // 14. Hycean Ocean World
    else if (themeIndex < 13.5) {
      vec3 warped = domainWarp(vLocalPos * 3.0 + seed, 0.45);
      float deepWater = fbm(warped);
      surface = mix(vec3(0.01, 0.08, 0.28), vec3(0.04, 0.22, 0.50), deepWater * 0.5 + 0.5);
      atmoColor = vec3(0.30, 0.70, 1.0);
      atmoStrength = 0.85;
    }
    // 15. Hot Jupiter Dark Alkali (Sudarsky Class III, e.g. TrES-2b)
    else if (themeIndex < 14.5) {
      vec3 bandPos = vec3(vLocalPos.x * 2.0, vLocalPos.y * 14.0, vLocalPos.z * 2.0);
      float band = fbm(bandPos);
      surface = mix(vec3(0.02, 0.03, 0.06), vec3(0.08, 0.07, 0.14), band * 0.5 + 0.5);
      atmoColor = vec3(0.20, 0.15, 0.35);
      atmoStrength = 0.40;
    }
    // 16. Gas Giant Water Clouds (Sudarsky Class II)
    else {
      vec3 bandPos = vec3(vLocalPos.x * 2.0, vLocalPos.y * 18.0, vLocalPos.z * 2.0);
      vec3 curl = curlNoise(vLocalPos * 3.0 + time * 0.015);
      float band = fbm(bandPos + curl * 1.5);
      surface = mix(vec3(0.15, 0.35, 0.58), vec3(0.68, 0.78, 0.90), band * 0.5 + 0.5);
      atmoColor = vec3(0.40, 0.65, 0.95);
      atmoStrength = 0.70;
    }

    // Albedo modulation
    float albedoFactor = clamp(albedo * 2.5, 0.15, 1.8);
    vec3 finalColor = (surface * NdotL * albedoFactor) + (atmoColor * fresnel * atmoStrength) + vec3(emissive);
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
