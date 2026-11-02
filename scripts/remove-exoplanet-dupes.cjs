/**
 * scripts/remove-exoplanet-dupes.cjs
 *
 * Removes duplicate exoplanets that share different designations:
 * 1. EPIC 201912552 b (exo-epic-201912552-b) -> dupe of K2-18 b
 * 2. Gliese 1214 b (exo-gliese-1214-b) -> dupe of GJ 1214 b
 * 3. HD 189733 A b (exo-hd-189733-a-b) -> dupe of HD 189733 b
 * 4. Kepler-91 b Trojan (exo-kepler-91-b-trojan) -> dupe / refuted Trojan of Kepler-91 b
 *
 * Replaces them with 4 landmark confirmed exoplanets:
 * 1. Kepler-16 b (historic circumbinary "Tatooine" planet)
 * 2. LP 890-9 c (SPECULOOS-2 c, temperate habitable-zone Earth)
 * 3. GJ 1002 b (Earth-mass habitable-zone world, 15.8 ly)
 * 4. GJ 1002 c (Earth-mass habitable-zone world, 15.8 ly)
 */

const fs = require('fs');
const path = require('path');

const CATALOG_PATH = path.resolve('src/data/exoplanetCatalog.json');
let catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));

console.log(`Starting exoplanet count: ${catalog.length}`);

const DUPES_TO_REMOVE = new Set([
  'exo-epic-201912552-b',
  'exo-gliese-1214-b',
  'exo-hd-189733-a-b',
  'exo-kepler-91-b-trojan'
]);

const replacements = [
  {
    id: 'exo-kepler-16-b',
    name: 'Kepler-16 b',
    classification: 'Jovian',
    diameterKm: 105263,
    diameterEarth: 8.26,
    diameterJupiter: 0.753,
    hostSystem: 'Kepler-16 (Circumbinary)',
    massEarth: 105.8,
    massJupiter: 0.333,
    orbitalPeriodDays: 228.776,
    discoveryYear: 2011,
    discoveryMethod: 'transit',
    confirmed: true,
    description: 'Kepler-16 b is the historic first unambiguous circumbinary exoplanet ever discovered, orbiting both stars of the Kepler-16 binary system in a real-life analog of Star Wars\' Tatooine.',
    textureSource: 'procedural',
    textureTheme: 'gas-giant-water-clouds',
    temperatureK: 200,
    semiMajorAxisAU: 0.7048,
    albedo: 0.35,
    albedoType: 'estimated'
  },
  {
    id: 'exo-lp-890-9-c',
    name: 'LP 890-9 c',
    classification: 'Superterran',
    diameterKm: 17456,
    diameterEarth: 1.37,
    diameterJupiter: 0.125,
    hostSystem: 'LP 890-9',
    massEarth: 25.3,
    massJupiter: 0.08,
    orbitalPeriodDays: 8.457463,
    discoveryYear: 2022,
    discoveryMethod: 'transit',
    confirmed: true,
    description: 'LP 890-9 c (also known as SPECULOOS-2 c) is a temperate Super-Earth orbiting in the conservative habitable zone of an ultra-cool red dwarf star roughly 105 light-years away, receiving stellar flux comparable to Earth.',
    textureSource: 'procedural',
    textureTheme: 'terrestrial-ocean',
    temperatureK: 272,
    semiMajorAxisAU: 0.03984,
    albedo: 0.30,
    albedoType: 'estimated'
  },
  {
    id: 'exo-gj-1002-b',
    name: 'GJ 1002 b',
    classification: 'Terran',
    diameterKm: 13124,
    diameterEarth: 1.03,
    diameterJupiter: 0.094,
    hostSystem: 'GJ 1002',
    massEarth: 1.08,
    massJupiter: 0.0034,
    orbitalPeriodDays: 10.3465,
    discoveryYear: 2022,
    discoveryMethod: 'radial velocity',
    confirmed: true,
    description: 'GJ 1002 b is an Earth-mass exoplanet situated in the habitable zone of the quiet red dwarf star GJ 1002, just 15.8 light-years from Earth. With an orbital period of 10.3 days, it receives roughly 67% of Earth\'s insolation.',
    textureSource: 'procedural',
    textureTheme: 'terrestrial-ocean',
    temperatureK: 261,
    semiMajorAxisAU: 0.0457,
    albedo: 0.30,
    albedoType: 'estimated'
  },
  {
    id: 'exo-gj-1002-c',
    name: 'GJ 1002 c',
    classification: 'Terran',
    diameterKm: 13379,
    diameterEarth: 1.05,
    diameterJupiter: 0.096,
    hostSystem: 'GJ 1002',
    massEarth: 1.36,
    massJupiter: 0.0043,
    orbitalPeriodDays: 21.202,
    discoveryYear: 2022,
    discoveryMethod: 'radial velocity',
    confirmed: true,
    description: 'GJ 1002 c is the outer habitable-zone Earth-mass planet in the nearby GJ 1002 system, located just 15.8 light-years away. It receives roughly 26% of Earth\'s solar energy, maintaining an equilibrium temperature of ~182 K under an ice-glaciated or greenhouse atmosphere.',
    textureSource: 'procedural',
    textureTheme: 'kbo-ice',
    temperatureK: 182,
    semiMajorAxisAU: 0.0738,
    albedo: 0.55,
    albedoType: 'estimated'
  }
];

// Remove 4 duplicates
catalog = catalog.filter(p => !DUPES_TO_REMOVE.has(p.id));

// Add replacements
catalog.push(...replacements);

// Sort ascending by diameterKm
catalog.sort((a, b) => a.diameterKm - b.diameterKm);

console.log(`Final exoplanet count: ${catalog.length}`);
fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf8');
console.log('Successfully removed exoplanet duplicates and added landmark replacements!');
