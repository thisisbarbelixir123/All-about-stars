const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '..', 'src', 'data', 'exoplanetCatalog.json');
let catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

console.log(`Initial exoplanet count: ${catalog.length}`);

const placeholdersToReplace = new Set([
  'exo-koi-161201',
  'exo-koi-1873-02',
  'exo-koi-806-03',
  'exo-koi-1873-01'
]);

// 4 Celebrated Rogue / Free-Floating Planetary-Mass Objects
const roguePlanets = [
  {
    id: 'exo-cfbdsir-2149-0403',
    name: 'CFBDSIR 2149-0403',
    classification: 'Jovian',
    diameterKm: 174775,
    diameterEarth: 13.7,
    diameterJupiter: 1.25,
    hostSystem: 'Interstellar Space (Rogue Planet)',
    massEarth: 1750,
    massJupiter: 5.5,
    orbitalPeriodDays: 0,
    discoveryYear: 2012,
    discoveryMethod: 'direct imaging',
    confirmed: true,
    description: 'CFBDSIR 2149-0403 is a celebrated free-floating planetary-mass object drifting through the AB Doradus moving group roughly 130 light-years from Earth. Free from the gravitational grip of any host star, its atmosphere glows faintly in infrared from primordial heat of formation.',
    textureSource: 'procedural',
    textureTheme: 'gas-giant-banded',
    temperatureK: 700,
    semiMajorAxisAU: 0,
    albedo: 0.25,
    albedoType: 'estimated'
  },
  {
    id: 'exo-wise-0855-0714',
    name: 'WISE 0855-0714',
    classification: 'Jovian',
    diameterKm: 139820,
    diameterEarth: 10.97,
    diameterJupiter: 1.0,
    hostSystem: 'Interstellar Space (Rogue Planet)',
    massEarth: 1590,
    massJupiter: 5.0,
    orbitalPeriodDays: 0,
    discoveryYear: 2014,
    discoveryMethod: 'direct imaging',
    confirmed: true,
    description: 'WISE 0855-0714 is the coldest known planetary-mass rogue object outside the Solar System, drifting just 7.3 light-years from Earth. With sub-freezing temperatures around 250 K (-23°C), spectroscopic observations confirm atmospheric water-ice clouds, making it an extraordinary sub-zero rogue giant.',
    textureSource: 'procedural',
    textureTheme: 'gas-giant-water-clouds',
    temperatureK: 250,
    semiMajorAxisAU: 0,
    albedo: 0.38,
    albedoType: 'estimated'
  },
  {
    id: 'exo-simp-j013656-093347',
    name: 'SIMP J013656.5+093347',
    classification: 'Jovian',
    diameterKm: 170580,
    diameterEarth: 13.37,
    diameterJupiter: 1.22,
    hostSystem: 'Interstellar Space (Rogue Planet)',
    massEarth: 4038,
    massJupiter: 12.7,
    orbitalPeriodDays: 0,
    discoveryYear: 2006,
    discoveryMethod: 'direct imaging',
    confirmed: true,
    description: 'SIMP J013656.5+093347 is a free-floating rogue world 20 light-years away possessing a monstrous magnetic field 4 million times stronger than Earth\'s. This generates ferocious, continuous planetary auroral radio and optical storms visible across interstellar distances.',
    textureSource: 'procedural',
    textureTheme: 'gas-giant-banded',
    temperatureK: 1100,
    semiMajorAxisAU: 0,
    albedo: 0.20,
    albedoType: 'estimated'
  },
  {
    id: 'exo-proplyd-133-353',
    name: 'Proplyd 133-353',
    classification: 'Jovian',
    diameterKm: 447424,
    diameterEarth: 35.1,
    diameterJupiter: 3.2,
    hostSystem: 'Interstellar Space (Orion Proplyd)',
    massEarth: 4130,
    massJupiter: 13.0,
    orbitalPeriodDays: 0,
    discoveryYear: 2016,
    discoveryMethod: 'direct imaging',
    confirmed: true,
    description: 'Proplyd 133-353 (HST 10) is a famous free-floating photoevaporating protoplanetary envelope in the Orion Nebula. Unbound to any parent star, this planetary-mass object is silhouetted against the bright H II nebula while having its circumstellar accretion envelope slowly eroded by ultraviolet radiation from nearby O-type stars.',
    textureSource: 'procedural',
    textureTheme: 'ultra-hot-jupiter',
    temperatureK: 1800,
    semiMajorAxisAU: 0,
    albedo: 0.12,
    albedoType: 'estimated'
  }
];

// Remove 4 placeholders
catalog = catalog.filter(p => !placeholdersToReplace.has(p.id));

// Add 4 rogue planets
catalog.push(...roguePlanets);

// Sort ascending by diameterKm
catalog.sort((a, b) => a.diameterKm - b.diameterKm);

console.log(`Final exoplanet count: ${catalog.length}`);

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log('Successfully updated catalog with rogue planets!');
