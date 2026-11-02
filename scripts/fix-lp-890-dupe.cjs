const fs = require('fs');
const path = require('path');

const CATALOG_PATH = path.resolve('src/data/exoplanetCatalog.json');
let catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));

// Find index of the second LP 890-9 c
let count = 0;
const indexToReplace = catalog.findIndex(p => {
  if (p.id === 'exo-lp-890-9-c') {
    count++;
    if (count === 2) return true;
  }
  return false;
});

if (indexToReplace !== -1) {
  catalog[indexToReplace] = {
    id: 'exo-kepler-1649-b',
    name: 'Kepler-1649 b',
    classification: 'Terran',
    diameterKm: 12959,
    diameterEarth: 1.017,
    diameterJupiter: 0.0927,
    hostSystem: 'Kepler-1649',
    massEarth: 1.05,
    massJupiter: 0.0033,
    orbitalPeriodDays: 8.689099,
    discoveryYear: 2017,
    discoveryMethod: 'transit',
    confirmed: true,
    description: 'Kepler-1649 b is an Earth-sized terrestrial planet discovered in 2017 orbiting the red dwarf Kepler-1649, receiving roughly 2.3 times Earth\'s insolation as a warm Venus-analog sibling to the habitable-zone world Kepler-1649 c.',
    textureSource: 'procedural',
    textureTheme: 'terrestrial-rocky',
    temperatureK: 305,
    semiMajorAxisAU: 0.0514,
    albedo: 0.28,
    albedoType: 'estimated'
  };
}

catalog.sort((a, b) => a.diameterKm - b.diameterKm);
fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf8');
console.log('Replaced second LP 890-9 c with Kepler-1649 b!');
