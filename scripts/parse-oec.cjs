const fs = require('fs');
const path = require('path');

const OEC_SYSTEMS_DIR = 'D:\\project files\\open_exoplanet_catalogue-master\\open_exoplanet_catalogue-master\\systems';
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'exoplanetCatalog.ts');

const EARTH_DIAMETER_KM = 12742;
const JUPITER_DIAMETER_KM = 139820;
const JUPITER_TO_EARTH_MASS = 317.828;

// Solar System planets already in SOLAR_SYSTEM_ROSTER
const SOLAR_SYSTEM_NAMES = new Set([
  'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'moon'
]);

// Iconic Kepler/TESS planets that must always be included even if mass wasn't measured via RV
const NOTABLE_LANDMARK_PLANETS = new Set([
  'Kepler-37 b', 'Kepler-37 c', 'Kepler-37 d',
  'Kepler-186 f', 'Kepler-452 b', 'Kepler-22 b',
  'Kepler-10 b', 'Kepler-10 c', 'Kepler-16 b',
  'Kepler-62 e', 'Kepler-62 f', 'Kepler-442 b',
  'Kepler-1649 c', 'Kepler-438 b', 'Kepler-1647 b',
  'TOI-700 d', 'TOI-700 e'
]);

function getTagValue(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([^<]+)<\\/${tag}>`));
  return match ? match[1].trim() : null;
}

function determineClassificationAndTheme(radiusJupiter, tempK, massJupiter) {
  const radiusEarth = radiusJupiter * 10.9731;

  if (tempK && tempK > 1800) {
    if (radiusEarth < 2.5) {
      return { classification: 'Exoplanet', theme: 'lava-world' };
    }
    return { classification: 'Exoplanet', theme: 'ultra-hot-jupiter' };
  }

  if (radiusEarth >= 8.0) {
    if (tempK && tempK > 900) {
      return { classification: 'Exoplanet', theme: 'hot-jupiter' };
    }
    return { classification: 'Exoplanet', theme: 'gas-giant-banded' };
  }

  if (radiusEarth >= 3.0 && radiusEarth < 8.0) {
    if (tempK && tempK > 600) {
      return { classification: 'Exoplanet', theme: 'sub-neptune' };
    }
    return { classification: 'Exoplanet', theme: 'ice-giant' };
  }

  if (radiusEarth >= 1.5 && radiusEarth < 3.0) {
    if (tempK && tempK > 1200) {
      return { classification: 'Exoplanet', theme: 'lava-world' };
    }
    return { classification: 'Exoplanet', theme: 'super-earth' };
  }

  if (tempK && tempK >= 220 && tempK <= 320) {
    return { classification: 'Exoplanet', theme: 'terrestrial-ocean' };
  }
  return { classification: 'Exoplanet', theme: 'terrestrial-rocky' };
}

function parseSystemFile(filePath) {
  const xml = fs.readFileSync(filePath, 'utf-8');
  const systemName = getTagValue(xml, 'name') || path.basename(filePath, '.xml');

  if (systemName.toLowerCase() === 'solar system' || systemName.toLowerCase() === 'sun') {
    return [];
  }

  const planets = [];
  const planetBlocks = xml.match(/<planet[\s\S]*?<\/planet>/g);
  if (!planetBlocks) return [];

  for (const block of planetBlocks) {
    const listTag = getTagValue(block, 'list');
    if (listTag && listTag.toLowerCase().includes('retracted')) {
      continue;
    }

    const radiusStr = getTagValue(block, 'radius');
    if (!radiusStr) continue;

    const radiusJupiter = parseFloat(radiusStr);
    if (isNaN(radiusJupiter) || radiusJupiter <= 0) continue;

    if (radiusJupiter > 3.5 || radiusJupiter < 0.01) continue;

    const planetName = getTagValue(block, 'name') || `${systemName} planet`;
    if (SOLAR_SYSTEM_NAMES.has(planetName.toLowerCase())) {
      continue;
    }

    const massStr = getTagValue(block, 'mass');
    const massJupiter = massStr ? parseFloat(massStr) : undefined;
    const hasValidMass = massJupiter !== undefined && !isNaN(massJupiter) && massJupiter > 0;

    // Filter to the ~1,550 well-characterized exoplanets (measured radius + measured mass, or notable landmark)
    if (!hasValidMass && !NOTABLE_LANDMARK_PLANETS.has(planetName)) {
      continue;
    }

    const tempStr = getTagValue(block, 'temperature');
    const tempK = tempStr ? parseFloat(tempStr) : undefined;
    const periodStr = getTagValue(block, 'period');
    const periodDays = periodStr ? parseFloat(periodStr) : undefined;
    const smaStr = getTagValue(block, 'semimajoraxis');
    const semiMajorAxisAU = smaStr ? parseFloat(smaStr) : undefined;
    const discoveryMethod = getTagValue(block, 'discoverymethod') || undefined;
    const discYearStr = getTagValue(block, 'discoveryyear');
    const discoveryYear = discYearStr ? parseInt(discYearStr, 10) : undefined;
    const description = getTagValue(block, 'description') || undefined;

    const { classification, theme } = determineClassificationAndTheme(radiusJupiter, tempK, massJupiter);

    const id = `exo-${planetName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

    planets.push({
      id,
      name: planetName,
      hostStar: systemName,
      radiusJupiter,
      massJupiter: hasValidMass ? massJupiter : undefined,
      temperatureK: tempK && !isNaN(tempK) ? tempK : undefined,
      periodDays: periodDays && !isNaN(periodDays) ? periodDays : undefined,
      semiMajorAxisAU: semiMajorAxisAU && !isNaN(semiMajorAxisAU) ? semiMajorAxisAU : undefined,
      discoveryMethod,
      discoveryYear: discoveryYear && !isNaN(discoveryYear) ? discoveryYear : undefined,
      description,
      classification,
      textureTheme: theme,
    });
  }

  return planets;
}

function main() {
  console.log(`Reading Open Exoplanet Catalogue from: ${OEC_SYSTEMS_DIR}`);
  const files = fs.readdirSync(OEC_SYSTEMS_DIR).filter(f => f.endsWith('.xml'));

  let allPlanets = [];
  for (const file of files) {
    try {
      const planets = parseSystemFile(path.join(OEC_SYSTEMS_DIR, file));
      allPlanets.push(...planets);
    } catch (err) {}
  }

  // Deduplicate by id if any
  const seen = new Set();
  allPlanets = allPlanets.filter(p => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  console.log(`Parsed total ${allPlanets.length} well-characterized exoplanets.`);

  // Sort strictly ascending by radius (diameter)
  allPlanets.sort((a, b) => a.radiusJupiter - b.radiusJupiter);

  const cleanList = allPlanets.map(p => {
    const diameterKm = Math.round(p.radiusJupiter * JUPITER_DIAMETER_KM);
    const diameterEarth = +(diameterKm / EARTH_DIAMETER_KM).toFixed(4);
    const diameterJupiter = +(p.radiusJupiter).toFixed(4);
    const massEarth = p.massJupiter ? +(p.massJupiter * JUPITER_TO_EARTH_MASS).toFixed(3) : undefined;

    return {
      id: p.id,
      name: p.name,
      classification: 'Exoplanet',
      diameterKm,
      diameterEarth,
      diameterJupiter,
      hostSystem: p.hostStar,
      temperatureK: p.temperatureK ? Math.round(p.temperatureK) : undefined,
      massEarth,
      massJupiter: p.massJupiter ? +p.massJupiter.toFixed(4) : undefined,
      orbitalPeriodDays: p.periodDays,
      semiMajorAxisAU: p.semiMajorAxisAU,
      discoveryYear: p.discoveryYear,
      discoveryMethod: p.discoveryMethod,
      confirmed: true,
      description: p.description,
      textureSource: 'procedural',
      textureTheme: p.textureTheme,
    };
  });

  const jsonFile = path.join(process.cwd(), 'src', 'data', 'exoplanetCatalog.json');
  fs.writeFileSync(jsonFile, JSON.stringify(cleanList), 'utf-8');

  const code = `import { CelestialBody } from '../types';
import rawData from './exoplanetCatalog.json';

export const EXOPLANET_CATALOG: CelestialBody[] = rawData as CelestialBody[];
`;

  fs.writeFileSync(OUTPUT_FILE, code, 'utf-8');
  console.log(`Successfully generated JSON + TS wrapper for ${cleanList.length} exoplanets!`);
}

main();
