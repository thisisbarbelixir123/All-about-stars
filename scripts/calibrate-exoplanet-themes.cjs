const fs = require('fs');
const path = require('path');
const catalogPath = path.resolve(__dirname, '../src/data/exoplanetCatalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Mirror calculation from exoplanetArchetypes.ts
function deriveScientificExoplanetTheme(p) {
  const { id, name, classification, diameterEarth, temperatureK, massEarth } = p;
  const lowerName = name.toLowerCase();

  // Volume in cm3, mass in g
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

  // 3. Ultra-Hot Molten Magma Worlds (T_eq >= 1350 K and rocky/terran)
  const isRockyOrTerran =
    classification === 'Sub-Martian' ||
    classification === 'Martian' ||
    classification === 'Terran' ||
    classification === 'Superterran' ||
    (diameterEarth < 2.0 && (densityGcm3 ?? 3.5) >= 1.8);

  if (isRockyOrTerran && temperatureK >= 1350) {
    return {
      theme: 'lava-world',
      albedo: 0.08,
      albedoType: 'estimated'
    };
  }

  // 4. Ultra-Hot Jupiters (T_eq >= 1800 K)
  const isGiant =
    classification === 'Jovian' ||
    classification === 'Neptunian' ||
    diameterEarth >= 2.0;

  if (isGiant && temperatureK >= 1800) {
    return {
      theme: 'ultra-hot-jupiter',
      albedo: 0.10,
      albedoType: 'estimated'
    };
  }

  // 5. Hot Jupiters (900 K - 1800 K)
  if (isGiant && temperatureK >= 900) {
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

  // 6. Warm Water-Cloud Gas Giants (350 K - 900 K)
  if (isGiant && temperatureK >= 350) {
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

  // 7. Cold Jovians & Ice Giants (T < 350 K)
  if (isGiant) {
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

  // 8. Temperate & Warm Rocky Worlds
  if (temperatureK < 350) {
    if (temperatureK >= 220 && temperatureK <= 320 && diameterEarth >= 0.8 && diameterEarth <= 2.2) {
      if (diameterEarth > 1.4 && (densityGcm3 ?? 2.5) < 3.5) {
        return {
          theme: 'hycean-ocean',
          albedo: 0.38,
          albedoType: 'estimated'
        };
      }
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

    return {
      theme: 'terrestrial-rocky',
      albedo: 0.16,
      albedoType: 'estimated'
    };
  }

  // 9. Warm to Hot Super-Earths (350 K - 1350 K)
  if (temperatureK >= 700) {
    return {
      theme: 'super-earth',
      albedo: 0.18,
      albedoType: 'estimated'
    };
  }

  return {
    theme: 'terrestrial-rocky',
    albedo: 0.15,
    albedoType: 'estimated'
  };
}

let modifiedCount = 0;
const themeStats = {};

for (const p of catalog) {
  const result = deriveScientificExoplanetTheme(p);
  p.textureTheme = result.theme;
  p.albedo = result.albedo;
  p.albedoType = result.albedoType;
  themeStats[result.theme] = (themeStats[result.theme] || 0) + 1;
  modifiedCount++;
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n');
console.log(`Calibrated ${modifiedCount} exoplanets with scientific themes & albedos.`);
console.log('New Theme Distribution:');
console.log(JSON.stringify(themeStats, null, 2));
