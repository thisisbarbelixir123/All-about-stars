import { StarData, PresetComparison } from '../types';
import starDatabaseJson from './starDatabase.json';

export const STAR_ID_ALIASES: Record<string, string> = {
  'castor-a': 'castor-aa',
  'castor-b': 'castor-ba',
  'mizar-a': 'mizar-aa',
  'mizar-b': 'mizar-ba',
  'theta1-orionis-c': 'theta-1-orionis-c1',
  'theta-1-orionis-c': 'theta-1-orionis-c1',
  'theta1-orionis-a': 'theta-1-orionis-a1',
  'theta-1-orionis-a': 'theta-1-orionis-a1',
  'epsilon-1-lyrae': 'epsilon-1-lyrae-a',
  'epsilon-2-lyrae': 'epsilon-2-lyrae-a',
  'gj-436': 'gliese-436',
  'delta-velorum-a': 'alsephina-aa',
  'alsephina-aa': 'alsephina-aa',
  'alsephina-a': 'alsephina-aa',
  'hadar-aa': 'hadar-aa',
  'hadar-a': 'hadar-aa',
  'hadar-aa-ab': 'hadar-aa',
  'rigel-b': 'rigel-ba',
  'rigel-bc': 'rigel-ba',
  'vfts-352-a': 'vfts-352',
  'vfts-352-b': 'vfts-352',
  'vfts-352-primary': 'vfts-352',
  'hd-93129aa': 'hd-93129aa',
  'alpha-fornacis-a': 'dalim',
  'gamma-2-velorum': 'regor',
  'lambda-tauri': 'lambda-tauri-a',
  'gamma-delphini': 'gamma-delphini-a',
  'delta-serpentis': 'delta-serpentis-a',
  'mesarthim': 'mesarthim-a',
  'alula-australis': 'alula-australis-a',
  'acrux': 'acrux-aa',
  'acrux-a': 'acrux-aa',
  'acrux-b': 'acrux-ba',
  'alpha-crucis': 'acrux-aa',
  'alpha-1-crucis': 'acrux-aa',
  'alpha-2-crucis': 'acrux-ba',
  'cygnus-x-1': 'hde-226868',
  'eta-carinae': 'eta-carinae-a',
  'van-maanen-2': 'van-maanens-star',
  'hd-93129a': 'hd-93129aa',
  'capella': 'capella-aa',
  'epsilon-eridani': 'ran',
  '55-cancri-a': 'copernicus',
  '55-cancri': 'copernicus',
};

/**
 * Resolves any legacy, component, or alias star ID to its canonical catalog ID.
 */
export function resolveStarId(id: string): string {
  return STAR_ID_ALIASES[id] || id;
}

/**
 * Unified Star Catalog
 * Merged single source of truth containing all 736+ stars.
 */
export const RAW_STARS_CATALOG: StarData[] = starDatabaseJson as StarData[];
export const STARS_CATALOG: StarData[] = RAW_STARS_CATALOG;


/**
 * Retrieves a star from the catalog by canonical ID or alias.
 */
export function getStarById(id: string): StarData | undefined {
  const canonicalId = resolveStarId(id);
  return STARS_CATALOG.find((s) => s.id === canonicalId || s.id === id);
}

export const CONSTELLATIONS_LIST = Array.from(
  new Set(STARS_CATALOG.map((s) => s.constellation))
).sort();

export const SPECTRAL_CLASSES_META = [
  { key: 'O', label: 'Class O', color: '#9bb0ff', desc: 'Soft Azure Blue (>30,000 K)' },
  { key: 'B', label: 'Class B', color: '#aabfff', desc: 'Pale Ice Blue (10,000 - 30,000 K)' },
  { key: 'A', label: 'Class A', color: '#cad7ff', desc: 'Pale Bluish-White Standard (~10,000 K)' },
  { key: 'F', label: 'Class F', color: '#f8f7ff', desc: 'Off-White Ivory (6,000 - 7,500 K)' },
  { key: 'G', label: 'Class G', color: '#fff4ea', desc: 'Warm Solar Yellow-White (5,200 - 6,000 K)' },
  { key: 'K', label: 'Class K', color: '#ffd2a1', desc: 'Soft Warm Peach-Orange (3,700 - 5,200 K)' },
  { key: 'M', label: 'Class M', color: '#ffcc6f', desc: 'Warm Golden Peach-Orange (2,400 - 3,700 K)' },
  { key: 'C', label: 'Class C', color: '#dc2626', desc: 'Carbon Star / Soot Photosphere (2,000 - 3,500 K)' },
  { key: 'S', label: 'Class S', color: '#ea580c', desc: 'Zirconium Oxide Giant (2,200 - 3,600 K)' },
  { key: 'L', label: 'Class L', color: '#960718', desc: 'Deep Crimson Brown Dwarf (1,300 - 2,400 K)' },
  { key: 'T', label: 'Class T', color: '#52010e', desc: 'Methane Plum Brown Dwarf (600 - 1,300 K)' },
  { key: 'Y', label: 'Class Y', color: '#1a0006', desc: 'Ultracool Brown Dwarf (<600 K)' },
  { key: 'WR', label: 'Wolf-Rayet', color: '#9bb0ff', desc: 'Massive Stripped Core (>40,000 K)' },
  { key: 'LBV', label: 'Luminous Blue Variable', color: '#8fa5ff', desc: 'Eruptive Hypergiant near Eddington limit' },
  { key: 'WD', label: 'White Dwarf', color: '#dbeafe', desc: 'Degenerate Electron Remnant' },
  { key: 'NS', label: 'Neutron Star', color: '#00f0ff', desc: 'Ultra-dense Pulsar Relic' },
] as const;

// ---------------------------------------------------------------------------
// Dynamic Preset Query Generators
// Automatically reflect all current and newly added stars in STARS_CATALOG
// ---------------------------------------------------------------------------

// Helper: identify degenerate remnants (white dwarfs, neutron stars, pulsars, magnetars)
const isDegenerateRemnant = (s: StarData): boolean => {
  return (
    s.spectralClass === 'WD' ||
    s.spectralClass === 'NS' ||
    Boolean(
      s.stellarStage &&
        (s.stellarStage.includes('White Dwarf') ||
          s.stellarStage.includes('Neutron') ||
          s.stellarStage.includes('Pulsar') ||
          s.stellarStage.includes('Magnetar') ||
          s.stellarStage.includes('Degenerate'))
    )
  );
};

// 1. Nearest Stars to Earth (within 15 light years, starting with Sun)
const dynamicNearestStarIds = [
  'sun',
  ...STARS_CATALOG.filter((s) => s.id !== 'sun' && s.distanceLy <= 15)
    .sort((a, b) => a.distanceLy - b.distanceLy)
    .map((s) => s.id),
];

// 2. Brightest Stars in Night Sky (apparent magnitude m <= 2.00, starting with Sun)
const dynamicBrightestStarIds = [
  'sun',
  ...STARS_CATALOG.filter(
    (s) => s.id !== 'sun' && s.apparentMagnitude !== undefined && s.apparentMagnitude <= 2.0
  )
    .sort((a, b) => (a.apparentMagnitude ?? 99) - (b.apparentMagnitude ?? 99))
    .map((s) => s.id),
];

// 3. Hottest Stars (scorching stellar atmospheres >= 40,000 K, excluding neutron stars and other degenerate remnants)
const dynamicHottestStarIds = [
  'sun',
  ...STARS_CATALOG.filter((s) => {
    if (s.id === 'sun') return false;
    // Exclude neutron stars, white dwarfs, and other degenerate remnants
    if (isDegenerateRemnant(s)) return false;
    return s.temperature >= 40000;
  })
    .sort((a, b) => a.temperature - b.temperature)
    .map((s) => s.id),
];

// 4. Largest Stars (cosmic hypergiants and stars >= 1,000 Solar Diameters)
const dynamicLargestStarIds = [
  'sun',
  ...STARS_CATALOG.filter(
    (s) =>
      s.id !== 'sun' &&
      (s.diameterSolar >= 1000 ||
        (s.stellarStage && s.stellarStage.includes('Hypergiant')))
  )
    .sort((a, b) => a.diameterSolar - b.diameterSolar)
    .map((s) => s.id),
];

// 5. Smallest Main-Sequence Stars (hydrogen-fusing dwarfs <= 0.5 Solar Diameters)
const dynamicSmallestMainSequenceIds = [
  ...STARS_CATALOG.filter((s) => {
    if (s.id === 'sun') return false;
    const isMainSequence =
      s.stellarStage === 'Main Sequence' ||
      s.stellarStage === 'Main Sequence Dwarf' ||
      s.stellarStage === 'Red Dwarf';
    return isMainSequence && s.diameterSolar <= 0.5;
  })
    .sort((a, b) => a.diameterSolar - b.diameterSolar)
    .map((s) => s.id),
  'sun',
];

// 6. Most Massive Stars (exceeding 50 to 200+ Solar Masses)
const dynamicMostMassiveStarIds = [
  'sun',
  ...STARS_CATALOG.filter((s) => s.id !== 'sun' && s.massSolar >= 50)
    .sort((a, b) => a.massSolar - b.massSolar)
    .map((s) => s.id),
];

// 7. Stellar Remnants (white dwarfs, neutron stars, pulsars, and magnetars)
const dynamicStellarRemnantIds = [
  ...STARS_CATALOG.filter((s) => s.id !== 'sun' && isDegenerateRemnant(s))
    .sort((a, b) => a.diameterKm - b.diameterKm)
    .map((s) => s.id),
  'sun',
];

// ---------------------------------------------------------------------------
// Preset Comparisons Catalog
// Combines dynamic astronomical presets with curated cultural/anchor collections
// ---------------------------------------------------------------------------
export const PRESET_COMPARISONS: PresetComparison[] = [
  {
    id: 'nearest-stars',
    title: 'Nearest Stars to Earth',
    defaultSortKey: 'distance',
    defaultSortDirection: 'asc',
    starIds: dynamicNearestStarIds,
    desc: `All ${dynamicNearestStarIds.length} stellar objects in the catalog within 15 light-years of Earth.`,
  },
  {
    id: 'brightest-stars-night-sky',
    title: 'Brightest Stars in the Night Sky',
    defaultSortKey: 'apparentMagnitude',
    defaultSortDirection: 'asc',
    starIds: dynamicBrightestStarIds,
    desc: `The ${dynamicBrightestStarIds.length} brightest stars visible from Earth with apparent magnitude m ≤ 2.00.`,
  },
  {
    id: 'hottest-stars',
    title: 'Hottest Stars',
    defaultSortKey: 'temperature',
    defaultSortDirection: 'asc',
    starIds: dynamicHottestStarIds,
    desc: `Extreme scorching stars (≥40,000 K) compared with our Sun, reaching up to 210,000 K.`,
  },
  {
    id: 'largest-stars',
    title: 'Largest Stars',
    defaultSortKey: 'size',
    defaultSortDirection: 'asc',
    starIds: dynamicLargestStarIds,
    desc: `All ${dynamicLargestStarIds.length - 1} cosmic hypergiants and super-expanded stars (≥1,000 D☉) compared with our Sun.`,
  },
  {
    id: 'smallest-main-sequence',
    title: 'Smallest Main-Sequence Stars',
    defaultSortKey: 'size',
    defaultSortDirection: 'asc',
    starIds: dynamicSmallestMainSequenceIds,
    desc: `Hydrogen-fusing dwarfs smaller than 0.5 solar diameters (${dynamicSmallestMainSequenceIds.length - 1} stars) compared with our Sun.`,
  },
  {
    id: 'most-massive-stars',
    title: 'Most Massive Stars',
    defaultSortKey: 'mass',
    defaultSortDirection: 'asc',
    starIds: dynamicMostMassiveStarIds,
    desc: `The most massive stars in the catalog exceeding 50 to 200+ solar masses, led by R136a1 and Godzilla.`,
  },
  {
    id: 'exotic-and-chemically-peculiar',
    title: 'Exotic & Chemically Peculiar Stars',
    defaultSortKey: 'size',
    defaultSortDirection: 'asc',
    starIds: [
      'sun',
      'przybylski-star',
      'vv-cephei-b',
      'wr-104',
      'wr-124',
      'v348-sagittarii',
      'fg-sagittae',
      'sakurais-object',
      't-lyrae',
      'v-hydrae',
      'cw-leonis',
      'hv-2112',
    ].map(resolveStarId),
    desc: 'Bizarre stars with anomalous chemistry, extreme pulsations, and unique spectra.',
  },
  {
    id: 'remnants-with-sun',
    title: 'Stellar Remnants',
    defaultSortKey: 'size',
    defaultSortDirection: 'asc',
    starIds: dynamicStellarRemnantIds,
    desc: `Compact stellar corpses (${dynamicStellarRemnantIds.length - 1} relics: white dwarfs, neutron stars, pulsars, and magnetars) compared with the Sun.`,
  },
  {
    id: 'brazilian-flag-stars',
    title: 'Stars of the Brazilian Flag',
    defaultSortKey: 'size',
    defaultSortDirection: 'asc',
    starIds: [
      'polaris-australis',
      'sirius-a',
      'gamma-trianguli-australis',
      'procyon-a',
      'betria',
      'xamidimura',
      'muliphein',
      'girtab',
      'shaula',
      'acrux-aa',
      'mimosa',
      'imai',
      'acrab',
      'spica',
      'larawag',
      'alphard',
      'atria',
      'sargas',
      'gacrux',
      'epsilon-crucis',
      'canopus',
      'lida',
      'wezen',
      'adhara',
      'mirzam',
      'iota-1-scorpii',
      'antares',
    ].map(resolveStarId),
    desc: 'All 27 stars on Brazil’s national flag, representing the states and capital.',
  },
  {
    id: 'principal-88-constellations',
    title: '88 Constellation Anchors',
    defaultSortKey: 'apparentMagnitude',
    defaultSortDirection: 'asc',
    starIds: [
      'alpheratz', 'alpha-antliae', 'alpha-apodis', 'sadalsuud', 'altair', 'beta-arae', 'hamal', 'capella-aa',
      'arcturus', 'alpha-caeli', 'beta-camelopardalis', 'tarf', 'cor-caroli', 'sirius-a', 'procyon-a', 'deneb-algedi',
      'canopus', 'schedar', 'alpha-centauri-a', 'alderamin', 'diphda', 'alpha-chamaeleontis', 'alpha-circini', 'phact',
      'beta-comae-berenices', 'meridiana', 'alphecca', 'gienah-corvi', 'labrum', 'acrux-aa', 'deneb', 'rotanev',
      'alpha-doradus', 'eltanin', 'kitalpha', 'achernar', 'dalim', 'pollux', 'alnair', 'kornephoros',
      'alpha-horologii', 'alphard', 'beta-hydri', 'alpha-indi', 'alpha-lacertae', 'regulus', 'praecipua', 'arneb',
      'zubeneschamali', 'men-alpha-lupi', 'alpha-lyncis', 'vega', 'alpha-mensae', 'gamma-microscopii', 'beta-monocerotis', 'alpha-muscae',
      'gamma-2-normae', 'polaris-australis', 'rasalhague', 'rigel', 'peacock', 'enif', 'mirfak', 'ankaa',
      'alpha-pictoris', 'alpherg', 'fomalhaut', 'zeta-puppis', 'alpha-pyxidis', 'alpha-reticuli', 'gamma-sagittae', 'kaus-australis',
      'antares', 'alpha-sculptoris', 'alpha-scuti', 'unukalhai', 'alpha-sextantis', 'aldebaran', 'alpha-telescopii', 'beta-trianguli',
      'atria', 'alpha-tucanae', 'alioth', 'polaris', 'regor', 'spica', 'beta-volantis', 'anser'
    ].map(resolveStarId),
    desc: 'The brightest principal star from each of the 88 modern IAU constellations.',
  },
  {
    id: 'all-stars-catalog',
    title: 'The Complete Catalog',
    defaultSortKey: 'size',
    defaultSortDirection: 'asc',
    starIds: [...STARS_CATALOG].sort((a, b) => a.diameterKm - b.diameterKm).map((s) => s.id),
    desc: `All ${STARS_CATALOG.length} stars in the catalog, from compact stellar remnants to cosmic hypergiants.`,
  },
];
