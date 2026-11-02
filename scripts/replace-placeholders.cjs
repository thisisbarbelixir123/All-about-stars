const fs = require('fs');

const EARTH_DIAMETER_KM = 12742;
const JUPITER_DIAMETER_KM = 139820;

const catalog = JSON.parse(fs.readFileSync('src/data/exoplanetCatalog.json', 'utf8'));

// 10 landmark replacements
const replacements = [
  // 1. Proxima Centauri b
  {
    id: 'exo-proxima-centauri-b',
    name: 'Proxima Centauri b',
    classification: 'Terran',
    diameterKm: Math.round(1.03 * EARTH_DIAMETER_KM),
    diameterEarth: 1.03,
    diameterJupiter: +( (1.03 * EARTH_DIAMETER_KM) / JUPITER_DIAMETER_KM ).toFixed(4),
    hostSystem: 'Proxima Centauri',
    massEarth: 1.07,
    massJupiter: +( 1.07 / 317.8 ).toFixed(4),
    orbitalPeriodDays: 11.186,
    semiMajorAxisAU: 0.0485,
    discoveryYear: 2016,
    discoveryMethod: 'radial-velocity',
    confirmed: true,
    description: 'The closest known exoplanet to Earth, orbiting within the habitable zone of our solar system\'s nearest neighbor, red dwarf Proxima Centauri (4.24 light-years away).',
    textureSource: 'procedural',
    textureTheme: 'terrestrial-ocean',
    temperatureK: 234,
    albedo: 0.30,
    albedoType: 'estimated'
  },
  // 2. Proxima Centauri d
  {
    id: 'exo-proxima-centauri-d',
    name: 'Proxima Centauri d',
    classification: 'Sub-Martian',
    diameterKm: Math.round(0.81 * EARTH_DIAMETER_KM),
    diameterEarth: 0.81,
    diameterJupiter: +( (0.81 * EARTH_DIAMETER_KM) / JUPITER_DIAMETER_KM ).toFixed(4),
    hostSystem: 'Proxima Centauri',
    massEarth: 0.26,
    massJupiter: +( 0.26 / 317.8 ).toFixed(4),
    orbitalPeriodDays: 5.122,
    semiMajorAxisAU: 0.02885,
    discoveryYear: 2020,
    discoveryMethod: 'radial-velocity',
    confirmed: true,
    description: 'A light sub-Earth planet orbiting Proxima Centauri inside the orbit of Proxima b. At only a quarter of Earth\'s mass, it is one of the lightest known exoplanets.',
    textureSource: 'procedural',
    textureTheme: 'terrestrial-rocky',
    temperatureK: 360,
    albedo: 0.16,
    albedoType: 'estimated'
  },
  // 3. Barnard's Star b
  {
    id: 'exo-barnards-star-b',
    name: 'Barnard\'s Star b',
    classification: 'Sub-Martian',
    diameterKm: Math.round(0.85 * EARTH_DIAMETER_KM),
    diameterEarth: 0.85,
    diameterJupiter: +( (0.85 * EARTH_DIAMETER_KM) / JUPITER_DIAMETER_KM ).toFixed(4),
    hostSystem: 'Barnard\'s Star',
    massEarth: 0.37,
    massJupiter: +( 0.37 / 317.8 ).toFixed(4),
    orbitalPeriodDays: 3.1533,
    semiMajorAxisAU: 0.02294,
    discoveryYear: 2024,
    discoveryMethod: 'radial-velocity',
    confirmed: true,
    description: 'A sub-Earth planet orbiting Barnard\'s Star, the second closest stellar system to the Sun (5.96 light-years away). Heated to 165°C by its parent red dwarf.',
    textureSource: 'procedural',
    textureTheme: 'terrestrial-rocky',
    temperatureK: 438,
    albedo: 0.16,
    albedoType: 'estimated'
  },
  // 4. HD 100546 b (Largest exoplanet by radius)
  {
    id: 'exo-hd-100546-b',
    name: 'HD 100546 b',
    classification: 'Jovian',
    diameterKm: Math.round(6.90 * JUPITER_DIAMETER_KM),
    diameterEarth: +( (6.90 * JUPITER_DIAMETER_KM) / EARTH_DIAMETER_KM ).toFixed(4),
    diameterJupiter: 6.90,
    hostSystem: 'HD 100546',
    massJupiter: 15.0,
    massEarth: +( 15.0 * 317.8 ).toFixed(1),
    orbitalPeriodDays: 91250,
    semiMajorAxisAU: 53.0,
    discoveryYear: 2013,
    discoveryMethod: 'imaging',
    confirmed: true,
    description: 'Widely recognized as the physically largest known exoplanet / forming protoplanet. Embedded in a circumstellar gas and dust disk, its enormous radiating envelope spans ~6.9 Jupiter radii.',
    textureSource: 'procedural',
    textureTheme: 'ultra-hot-jupiter',
    temperatureK: 1750,
    albedo: 0.10,
    albedoType: 'estimated'
  },
  // 5. DH Tauri b (Second largest directly imaged companion)
  {
    id: 'exo-dh-tauri-b',
    name: 'DH Tauri b',
    classification: 'Jovian',
    diameterKm: Math.round(2.70 * JUPITER_DIAMETER_KM),
    diameterEarth: +( (2.70 * JUPITER_DIAMETER_KM) / EARTH_DIAMETER_KM ).toFixed(4),
    diameterJupiter: 2.70,
    hostSystem: 'DH Tauri',
    massJupiter: 11.0,
    massEarth: +( 11.0 * 317.8 ).toFixed(1),
    orbitalPeriodDays: 2500000,
    semiMajorAxisAU: 330.0,
    discoveryYear: 2004,
    discoveryMethod: 'imaging',
    confirmed: true,
    description: 'A colossal young planetary-mass companion orbiting in the Taurus-Auriga star-forming region. It was the first planet confirmed to host an actively accreting circumplanetary disk.',
    textureSource: 'procedural',
    textureTheme: 'hot-jupiter',
    temperatureK: 2200,
    albedo: 0.16,
    albedoType: 'estimated'
  },
  // 6. ROXs 42Bb (Bloated super-Jupiter)
  {
    id: 'exo-roxs-42bb',
    name: 'ROXs 42Bb',
    classification: 'Jovian',
    diameterKm: Math.round(2.50 * JUPITER_DIAMETER_KM),
    diameterEarth: +( (2.50 * JUPITER_DIAMETER_KM) / EARTH_DIAMETER_KM ).toFixed(4),
    diameterJupiter: 2.50,
    hostSystem: 'ROXs 42B',
    massJupiter: 9.0,
    massEarth: +( 9.0 * 317.8 ).toFixed(1),
    orbitalPeriodDays: 700000,
    semiMajorAxisAU: 140.0,
    discoveryYear: 2013,
    discoveryMethod: 'imaging',
    confirmed: true,
    description: 'A directly imaged planetary-mass companion orbiting a young binary star in the Ophiuchus star-forming cloud. Its radius is dramatically expanded by primordial contraction heat.',
    textureSource: 'procedural',
    textureTheme: 'hot-jupiter',
    temperatureK: 2000,
    albedo: 0.16,
    albedoType: 'estimated'
  },
  // 7. CT Chamaeleontis b
  {
    id: 'exo-ct-chamaeleontis-b',
    name: 'CT Chamaeleontis b',
    classification: 'Jovian',
    diameterKm: Math.round(2.31 * JUPITER_DIAMETER_KM),
    diameterEarth: +( (2.31 * JUPITER_DIAMETER_KM) / EARTH_DIAMETER_KM ).toFixed(4),
    diameterJupiter: 2.31,
    hostSystem: 'CT Chamaeleontis',
    massJupiter: 17.0,
    massEarth: +( 17.0 * 317.8 ).toFixed(1),
    orbitalPeriodDays: 2000000,
    semiMajorAxisAU: 440.0,
    discoveryYear: 2008,
    discoveryMethod: 'imaging',
    confirmed: true,
    description: 'A directly imaged companion on the deuterium-burning boundary orbiting a T Tauri star. Radiates intense infrared luminosity with high clouds of liquid silicate droplets.',
    textureSource: 'procedural',
    textureTheme: 'hot-jupiter',
    temperatureK: 2600,
    albedo: 0.16,
    albedoType: 'estimated'
  },
  // 8. KELT-9 b (Hottest known exoplanet)
  {
    id: 'exo-kelt-9-b',
    name: 'KELT-9 b',
    classification: 'Jovian',
    diameterKm: Math.round(1.82 * JUPITER_DIAMETER_KM),
    diameterEarth: +( (1.82 * JUPITER_DIAMETER_KM) / EARTH_DIAMETER_KM ).toFixed(4),
    diameterJupiter: 1.82,
    hostSystem: 'KELT-9',
    massJupiter: 2.88,
    massEarth: +( 2.88 * 317.8 ).toFixed(1),
    orbitalPeriodDays: 1.4811295,
    semiMajorAxisAU: 0.03462,
    discoveryYear: 2017,
    discoveryMethod: 'transit',
    confirmed: true,
    description: 'The hottest known exoplanet, with dayside temperatures exceeding 4,500 K—hotter than most red dwarf stars. Its atmosphere contains vaporized iron, titanium, and ionized atomic metals.',
    textureSource: 'procedural',
    textureTheme: 'ultra-hot-jupiter',
    temperatureK: 4579,
    albedo: 0.10,
    albedoType: 'estimated'
  },
  // 9. K2-18 b (Historic Hycean candidate with JWST carbon detection)
  {
    id: 'exo-k2-18-b',
    name: 'K2-18 b',
    classification: 'Superterran',
    diameterKm: Math.round(2.61 * EARTH_DIAMETER_KM),
    diameterEarth: 2.61,
    diameterJupiter: +( (2.61 * EARTH_DIAMETER_KM) / JUPITER_DIAMETER_KM ).toFixed(4),
    hostSystem: 'K2-18',
    massEarth: 8.63,
    massJupiter: +( 8.63 / 317.8 ).toFixed(4),
    orbitalPeriodDays: 32.939623,
    semiMajorAxisAU: 0.1429,
    discoveryYear: 2015,
    discoveryMethod: 'transit',
    confirmed: true,
    description: 'A celebrated habitable zone candidate orbiting a red dwarf. JWST atmospheric spectra confirmed carbon dioxide and methane, pointing to a potential Hycean ocean beneath a hydrogen envelope.',
    textureSource: 'procedural',
    textureTheme: 'hycean-ocean',
    temperatureK: 265,
    albedo: 0.32,
    albedoType: 'estimated'
  },
  // 10. GJ 1214 b (Landmark water/steam sub-Neptune)
  {
    id: 'exo-gj-1214-b',
    name: 'GJ 1214 b',
    classification: 'Neptunian',
    diameterKm: Math.round(2.73 * EARTH_DIAMETER_KM),
    diameterEarth: 2.73,
    diameterJupiter: +( (2.73 * EARTH_DIAMETER_KM) / JUPITER_DIAMETER_KM ).toFixed(4),
    hostSystem: 'GJ 1214',
    massEarth: 8.17,
    massJupiter: +( 8.17 / 317.8 ).toFixed(4),
    orbitalPeriodDays: 1.58040433,
    semiMajorAxisAU: 0.01411,
    discoveryYear: 2009,
    discoveryMethod: 'transit',
    confirmed: true,
    description: 'One of the first and most thoroughly analyzed sub-Neptune worlds. Surrounded by an opaque, high-metallicity steam atmosphere with thick photochemical hydrocarbon haze.',
    textureSource: 'procedural',
    textureTheme: 'sub-neptune',
    temperatureK: 596,
    albedo: 0.28,
    albedoType: 'estimated'
  }
];

// Target indices identified previously:
// 73 exo-koi-3503-b KOI-3503 b
// 78 exo-koi-3503-c KOI-3503 c
// 268 exo-koi-1599-b KOI-1599 b
// 269 exo-koi-1599-c KOI-1599 c
// 631 exo-koi-523-b KOI-523 b
// 690 exo-koi-984-b KOI-984 b
// 736 exo-koi-1783-c KOI-1783 c
// 816 exo-koi-523-c KOI-523 c
// 817 exo-koi-1783-b KOI-1783 b
// 1242 exo-koi-12-b KOI-12 b

const targetIds = [
  'exo-koi-3503-b',
  'exo-koi-3503-c',
  'exo-koi-1599-b',
  'exo-koi-1599-c',
  'exo-koi-523-b',
  'exo-koi-984-b',
  'exo-koi-1783-c',
  'exo-koi-523-c',
  'exo-koi-1783-b',
  'exo-koi-12-b'
];

let replaced = 0;
targetIds.forEach((oldId, i) => {
  const idx = catalog.findIndex(p => p.id === oldId);
  if (idx !== -1) {
    console.log(`Replacing ${catalog[idx].name} (index ${idx}) with ${replacements[i].name}`);
    catalog[idx] = replacements[i];
    replaced++;
  } else {
    console.warn(`Target ID not found: ${oldId}`);
  }
});

console.log(`Successfully replaced ${replaced} exoplanets.`);
console.log(`Total exoplanets in catalog: ${catalog.length}`);

// Sort catalog by diameterKm ascending as required by comparison view
catalog.sort((a, b) => a.diameterKm - b.diameterKm);

fs.writeFileSync('src/data/exoplanetCatalog.json', JSON.stringify(catalog, null, 2) + '\n', 'utf8');
console.log('Saved catalog successfully.');
