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
  
  // Skip Solar System XML from OEC since we have official Solar System roster
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
      massJupiter: massJupiter && !isNaN(massJupiter) ? massJupiter : undefined,
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

  console.log(`Parsed total ${allPlanets.length} true exoplanets.`);

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
