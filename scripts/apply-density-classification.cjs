/**
 * Task: Apply density-based classification adjustment:
 * - Planets over 2 Earth diameters (2.0 <= diameterEarth < 6.0):
 *   - density > 1.8 g/cm3 -> 'Superterran'
 *   - density <= 1.8 g/cm3 -> 'Neptunian'
 *   - if mass missing -> 'Neptunian' (volatile default)
 * - Planets < 2.0 Earth diameters retain Sub-Martian, Martian, Terran, Superterran (< 2.0).
 * - Planets >= 6.0 Earth diameters retain Jovian.
 * - Texture themes updated accordingly.
 */

const fs = require('fs');
const path = require('path');

const CATALOG_PATH = path.resolve('src/data/exoplanetCatalog.json');
const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));

const EARTH_DENSITY_G_CM3 = 5.514;

function determineTextureTheme(tier, tempK) {
  if (tier === 'Sub-Martian') return 'terrestrial-rocky';
  if (tier === 'Martian') {
    if (tempK > 900) return 'lava-world';
    return 'terrestrial-rocky';
  }
  if (tier === 'Terran') {
    if (tempK > 900) return 'lava-world';
    if (tempK >= 240 && tempK <= 320) return 'terrestrial-ocean';
    return 'terrestrial-rocky';
  }
  if (tier === 'Superterran') {
    if (tempK > 1200) return 'lava-world';
    if (tempK >= 240 && tempK <= 320) return 'terrestrial-ocean';
    if (tempK > 500) return 'super-earth';
    return 'terrestrial-rocky';
  }
  if (tier === 'Neptunian') {
    if (tempK > 1200) return 'lava-world';
    if (tempK < 200) return 'ice-giant';
    if (tempK > 800) return 'sub-neptune';
    return 'super-earth';
  }
  // Jovian
  if (tempK >= 2200) return 'ultra-hot-jupiter';
  if (tempK >= 1000) return 'hot-jupiter';
  if (tempK <= 200) return 'ice-giant';
  return 'gas-giant-banded';
}

let reclassifiedToSuperterran = 0;
let keptNeptunian = 0;

for (const p of catalog) {
  if (p.diameterEarth >= 2.0 && p.diameterEarth < 6.0) {
    if (p.massEarth && !isNaN(p.massEarth) && p.massEarth > 0) {
      const rho = EARTH_DENSITY_G_CM3 * (p.massEarth / Math.pow(p.diameterEarth, 3));
      if (rho > 1.8) {
        if (p.classification !== 'Superterran') {
          p.classification = 'Superterran';
          p.textureTheme = determineTextureTheme('Superterran', p.temperatureK || 500);
          reclassifiedToSuperterran++;
        }
      } else {
        if (p.classification !== 'Neptunian') {
          p.classification = 'Neptunian';
          p.textureTheme = determineTextureTheme('Neptunian', p.temperatureK || 500);
        }
        keptNeptunian++;
      }
    } else {
      // Without measured mass in 2-6 Earth diameter range: classify as Neptunian
      if (p.classification !== 'Neptunian') {
        p.classification = 'Neptunian';
        p.textureTheme = determineTextureTheme('Neptunian', p.temperatureK || 500);
      }
      keptNeptunian++;
    }
  }
}

console.log(`Reclassified to Superterran (rho > 1.8 g/cm3): ${reclassifiedToSuperterran}`);
console.log(`Classified as Neptunian (rho <= 1.8 g/cm3 or no mass): ${keptNeptunian}`);

// Statistical verification
const counts = {};
for (const p of catalog) {
  counts[p.classification] = (counts[p.classification] || 0) + 1;
}
console.log('New exoplanet catalog tier breakdown:');
console.log(counts);

fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
console.log('Successfully updated src/data/exoplanetCatalog.json!');
