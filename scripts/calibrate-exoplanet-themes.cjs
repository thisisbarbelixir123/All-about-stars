const fs = require('fs');
const path = require('path');
const catalogPath = path.resolve(__dirname, '../src/data/exoplanetCatalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Import the logic directly
const KNOWN_HABITABLE_CANDIDATE_SUBSTRINGS = [
  'trappist-1 e',
  'trappist-1 f',
  'trappist-1 d',
  'kepler-1649 c',
  'kepler-186 f',
  'toi-700 d',
  'toi-2095 c',
  'lp 890-9 c',
  'toi-715 b',
  'gj 1061 c',
  'gj 1061 d',
  'proxima centauri b',
  'ross 128 b',
  'teegarden b'
];

const KNOWN_HYCEAN_CANDIDATE_SUBSTRINGS = [
  'kepler-62 e',
  'kepler-452 b',
  'lhs 1140 b',
  'gj 273 b',
  'gj 3323 b',
  'gj 1132 c',
  'gj 625 b'
];

function deriveScientificExoplanetTheme(p) {
  const { id, name, classification, diameterEarth, temperatureK, massEarth } = p;
  const lowerName = name.toLowerCase();

  const radiusCm = (diameterEarth * 12742 * 1e5) / 2;
  const volCm3 = (4 / 3) * Math.PI * Math.pow(radiusCm, 3);
  const massG = (massEarth ?? 0) * 5.972e27;
  const densityGcm3 = massG > 0 && volCm3 > 0 ? massG / volCm3 : undefined;

  // 1. Benchmark Known Ultra-High Albedo Worlds ("Mirror Planets")
  if (lowerName.includes('ltt 9779') || lowerName.includes('ltt-9779')) {
    return {
      theme: 'mirror-world',
      albedo: 0.80,
      albedoType: 'measured'
    };
  }

  // 2. Benchmark Ultra-Dark Gas Giants (TrES-2b)
  if (lowerName.includes('tres-2') || lowerName.includes('tres-2b')) {
    return {
      theme: 'hot-jupiter-dark-alkali',
      albedo: 0.015,
      albedoType: 'measured'
    };
  }

  // 3. Strict Planetary Division: Giants vs. Terrestrials/Superterrans
  const isGasOrIceGiant = classification === 'Jovian' || classification === 'Neptunian';

  if (isGasOrIceGiant) {
    if (temperatureK >= 1800) {
      return {
        theme: 'ultra-hot-jupiter',
        albedo: 0.10,
        albedoType: 'estimated'
      };
    }
    if (temperatureK >= 900) {
      if (classification === 'Neptunian' || diameterEarth < 5.0) {
        return {
          theme: 'sub-neptune',
          albedo: 0.28,
          albedoType: 'estimated'
        };
      }
      if (temperatureK >= 1400) {
        return {
          theme: 'hot-jupiter',
          albedo: 0.16,
          albedoType: 'estimated'
        };
      }
      return {
        theme: 'hot-jupiter-dark-alkali',
        albedo: 0.08,
        albedoType: 'estimated'
      };
    }
    if (temperatureK >= 350) {
      if (classification === 'Neptunian' || diameterEarth < 6.0) {
        return {
          theme: 'sub-neptune',
          albedo: 0.32,
          albedoType: 'estimated'
        };
      }
      return {
        theme: 'gas-giant-water-clouds',
        albedo: 0.35,
        albedoType: 'estimated'
      };
    }
    if (classification === 'Neptunian' || diameterEarth < 5.0) {
      return {
        theme: 'ice-giant',
        albedo: 0.34,
        albedoType: 'estimated'
      };
    }
    return {
      theme: 'gas-giant-banded',
      albedo: 0.45,
      albedoType: 'estimated'
    };
  }

  // ROCKY & TERRAN & SUPERTERRAN WORLDS
  if (temperatureK >= 1350) {
    return {
      theme: 'lava-world',
      albedo: 0.08,
      albedoType: 'estimated'
    };
  }

  const isKnownHycean = KNOWN_HYCEAN_CANDIDATE_SUBSTRINGS.some(k => lowerName.includes(k));
  if (isKnownHycean || (classification === 'Superterran' && temperatureK >= 210 && temperatureK <= 380 && (densityGcm3 ?? 2.8) < 4.0 && diameterEarth >= 1.4)) {
    return {
      theme: 'hycean-ocean',
      albedo: 0.38,
      albedoType: 'estimated'
    };
  }

  const isKnownHabitable = KNOWN_HABITABLE_CANDIDATE_SUBSTRINGS.some(k => lowerName.includes(k));
  if (isKnownHabitable || (temperatureK >= 215 && temperatureK <= 320 && diameterEarth >= 0.75 && diameterEarth <= 1.8)) {
    return {
      theme: 'terrestrial-ocean',
      albedo: 0.30,
      albedoType: 'estimated'
    };
  }

  if (temperatureK < 200) {
    return {
      theme: 'kbo-ice',
      albedo: 0.55,
      albedoType: 'estimated'
    };
  }

  if (classification === 'Superterran' || diameterEarth > 1.3) {
    return {
      theme: 'super-earth',
      albedo: 0.18,
      albedoType: 'estimated'
    };
  }

  return {
    theme: 'terrestrial-rocky',
    albedo: 0.16,
    albedoType: 'estimated'
  };
}

let count = 0;
const themeStats = {};
const superterranThemes = {};

for (const p of catalog) {
  const res = deriveScientificExoplanetTheme(p);
  p.textureTheme = res.theme;
  p.albedo = res.albedo;
  p.albedoType = res.albedoType;
  themeStats[res.theme] = (themeStats[res.theme] || 0) + 1;
  if (p.classification === 'Superterran') {
    superterranThemes[res.theme] = (superterranThemes[res.theme] || 0) + 1;
  }
  count++;
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n');
console.log(`Calibrated ${count} exoplanets.`);
console.log('Total Theme Stats:', themeStats);
console.log('Superterran Theme Stats:', superterranThemes);
