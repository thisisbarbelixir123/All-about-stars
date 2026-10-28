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
    vLocalPos = normal; // Unit sphere vector for seamless 3D noise
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
  uniform float themeIndex; // 0: rocky, 1: ocean, 2: super-earth, 3: sub-neptune, 4: ice-giant, 5: gas-giant, 6: hot-jupiter, 7: ultra-hot, 8: lava, 9: kbo-tholin, 10: kbo-ice, 11: star-plasma
  uniform float temperatureK;
  uniform vec3 lightDir;
  uniform float seed;

  // 3D Simplex-style pseudo noise
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

  float fbm(vec3 p) {
    float f = 0.0;
    f += 0.5000 * snoise(p); p = p * 2.02;
    f += 0.2500 * snoise(p); p = p * 2.03;
    f += 0.1250 * snoise(p); p = p * 2.01;
    f += 0.0625 * snoise(p);
    return f;
  }

  void main() {
    #include <logdepthbuf_fragment>
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);
    vec3 L = normalize(lightDir);

    float NdotL = max(0.05, dot(N, L)); // Diffuse illumination with soft ambient fill
    float fresnel = pow(1.0 - max(0.0, dot(N, V)), 3.0); // Atmospheric rim glow

    vec3 surface = vec3(0.5);
    vec3 atmoColor = vec3(0.3, 0.6, 1.0);
    float atmoStrength = 0.6;

    // 1. Rocky Terrestrial (Mercury/Mars/Moon/Rocky Exoplanet)
    if (themeIndex < 0.5) {
      float n = fbm(vLocalPos * 6.0 + seed);
      surface = mix(vec3(0.28, 0.25, 0.23), vec3(0.55, 0.50, 0.45), n * 0.5 + 0.5);
      atmoStrength = 0.05;
    }
    // 2. Terrestrial Ocean World (Earth-like)
    else if (themeIndex < 1.5) {
      float h = fbm(vLocalPos * 3.5 + seed);
      if (h < 0.0) {
        surface = mix(vec3(0.02, 0.1, 0.35), vec3(0.08, 0.3, 0.55), h + 0.5);
      } else {
        surface = mix(vec3(0.15, 0.38, 0.12), vec3(0.48, 0.42, 0.28), h * 1.5);
      }
      atmoColor = vec3(0.35, 0.65, 1.0);
      atmoStrength = 0.8;
    }
    // 3. Super-Earth
    else if (themeIndex < 2.5) {
      float h = fbm(vLocalPos * 4.0 + seed);
      surface = mix(vec3(0.35, 0.22, 0.15), vec3(0.15, 0.3, 0.25), h * 0.5 + 0.5);
      atmoColor = vec3(0.4, 0.8, 0.6);
      atmoStrength = 0.7;
    }
    // 4. Sub-Neptune
    else if (themeIndex < 3.5) {
      vec3 bandPos = vec3(vLocalPos.x * 1.5, vLocalPos.y * 16.0, vLocalPos.z * 1.5);
      float band = fbm(bandPos + fbm(vLocalPos * 3.0) * 1.5);
      surface = mix(vec3(0.1, 0.35, 0.6), vec3(0.25, 0.65, 0.75), band * 0.5 + 0.5);
      atmoColor = vec3(0.4, 0.7, 1.0);
      atmoStrength = 0.9;
    }
    // 5. Ice Giant (Uranus / Neptune-like)
    else if (themeIndex < 4.5) {
      vec3 bandPos = vec3(vLocalPos.x, vLocalPos.y * 12.0, vLocalPos.z);
      float band = fbm(bandPos);
      surface = mix(vec3(0.12, 0.4, 0.7), vec3(0.3, 0.65, 0.85), band * 0.5 + 0.5);
      atmoColor = vec3(0.3, 0.6, 0.9);
      atmoStrength = 0.85;
    }
    // 6. Gas Giant Banded (Jupiter/Saturn-like)
    else if (themeIndex < 5.5) {
      vec3 bandPos = vec3(vLocalPos.x * 2.0, vLocalPos.y * 22.0, vLocalPos.z * 2.0);
      float warp = fbm(vLocalPos * 4.0 + time * 0.02);
      float band = fbm(bandPos + warp * 2.0);
      surface = mix(vec3(0.65, 0.45, 0.28), vec3(0.85, 0.75, 0.6), band * 0.5 + 0.5);
      atmoColor = vec3(0.8, 0.7, 0.5);
      atmoStrength = 0.5;
    }
    // 7. Hot Jupiter
    else if (themeIndex < 6.5) {
      vec3 bandPos = vec3(vLocalPos.x * 2.0, vLocalPos.y * 18.0, vLocalPos.z * 2.0);
      float band = fbm(bandPos);
      surface = mix(vec3(0.4, 0.15, 0.1), vec3(0.7, 0.35, 0.15), band * 0.5 + 0.5);
      atmoColor = vec3(1.0, 0.45, 0.2);
      atmoStrength = 0.75;
    }
    // 8. Ultra-Hot Jupiter / Glowing day side
    else if (themeIndex < 7.5) {
      float heat = max(0.0, dot(vLocalPos, L));
      float n = fbm(vLocalPos * 5.0 + time * 0.05);
      vec3 darkCrust = vec3(0.08, 0.07, 0.09);
      vec3 hotGlow = vec3(1.0, 0.3, 0.05) * 1.8;
      surface = mix(darkCrust, hotGlow, pow(heat, 1.5) * (n * 0.4 + 0.8));
      atmoColor = vec3(1.0, 0.3, 0.1);
      atmoStrength = 0.9;
    }
    // 9. Lava World (55 Cancri e / CoRoT-7b)
    else if (themeIndex < 8.5) {
      float subStellar = max(0.0, dot(vLocalPos, vec3(0.0, 0.0, 1.0)));
      float cracks = fbm(vLocalPos * 10.0 + time * 0.1);
      vec3 rock = vec3(0.06, 0.05, 0.06);
      vec3 magma = vec3(1.2, 0.4, 0.05);
      surface = mix(rock, magma, pow(subStellar, 1.8) * step(0.35, cracks));
      atmoStrength = 0.2;
    }
    // 10. KBO Tholin / Distant Cold Ices
    else if (themeIndex < 10.5) {
      float n = fbm(vLocalPos * 5.0 + seed);
      surface = mix(vec3(0.4, 0.18, 0.12), vec3(0.2, 0.18, 0.18), n * 0.5 + 0.5);
      atmoStrength = 0.02;
    }
    // 11. Star / Solar Plasma
    else {
      float plasma = fbm(vLocalPos * 4.0 + time * 0.15);
      surface = mix(vec3(1.0, 0.7, 0.2), vec3(1.0, 0.95, 0.7), plasma * 0.5 + 0.5) * 1.5;
      atmoColor = vec3(1.0, 0.6, 0.1);
      atmoStrength = 1.2;
    }

    vec3 finalColor = surface * NdotL + (atmoColor * fresnel * atmoStrength);
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
    default:
      return 0.0;
  }
};
