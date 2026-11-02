const fs = require('fs');
const path = require('path');

const CATALOG_PATH = path.resolve('src/data/exoplanetCatalog.json');
let catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));

const idx = catalog.findIndex(p => p.id === 'exo-kepler-16-b');
if (idx !== -1) {
  catalog[idx] = {
    id: 'exo-kepler-444-b',
    name: 'Kepler-444 b',
    classification: 'Sub-Martian',
    diameterKm: 5135,
    diameterEarth: 0.403,
    diameterJupiter: 0.0367,
    hostSystem: 'Kepler-444',
    massEarth: 0.05,
    massJupiter: 0.00016,
    orbitalPeriodDays: 3.6001053,
    discoveryYear: 2015,
    discoveryMethod: 'transit',
    confirmed: true,
    description: 'Kepler-444 b is a Mercury-sized rocky planet orbiting the 11.2-billion-year-old star Kepler-444. Formed when the universe was less than 20% of its current age, it provides direct evidence that Earth-sized terrestrial planets have formed throughout most of cosmic history.',
    textureSource: 'procedural',
    textureTheme: 'terrestrial-rocky',
    temperatureK: 1046,
    semiMajorAxisAU: 0.04178,
    albedo: 0.16,
    albedoType: 'estimated'
  };
}

catalog.sort((a, b) => a.diameterKm - b.diameterKm);
fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf8');
console.log('Replaced Kepler-16 b duplicate with Kepler-444 b!');
