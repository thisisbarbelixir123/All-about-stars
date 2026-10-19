import { StarData, PresetComparison } from '../types';
import { applyD65ChromaticityToStar } from '../utils/stellarColorsD65';
import { STARS_HYPERGIANTS } from './starsHypergiants';
import { STARS_SUPERGIANTS } from './starsSupergiants';
import { STARS_MASSIVE_AND_BINARIES } from './starsMassiveAndBinaries';
import { STARS_RED_ORANGE_GIANTS } from './starsRedOrangeGiants';
import { STARS_LUMINOUS_GIANTS } from './starsLuminousGiants';
import { STARS_BRIGHT_BEACONS } from './starsBrightBeacons';
import { STARS_SOLAR_NEIGHBORS } from './starsSolarNeighbors';
import { STARS_EXOPLANET_HOSTS_AND_REMNANTS } from './starsExoplanetHostsAndRemnants';
import { STARS_MAIN_SEQUENCE_AND_SUBGIANTS } from './starsMainSequenceAndSubgiants';
import { STARS_HOT_EXTREMES_AND_GIANTS } from './starsHotExtremesAndGiants';
import { STARS_NEW_NEIGHBORS_15LY } from './starsNewNeighbors15ly';
import { STARS_EXTREMES_AND_REMNANTS } from './starsExtremesAndRemnants';
import { STARS_PRINCIPAL_CONSTELLATIONS_A_TO_M } from './starsPrincipalConstellationsAtoM';
import { STARS_PRINCIPAL_CONSTELLATIONS_N_TO_Z } from './starsPrincipalConstellationsNtoZ';
import { STARS_REMAINING_MAIN_A_TO_L } from './starsRemainingMainConstellationsAtoL';
import { STARS_REMAINING_MAIN_M_TO_Z } from './starsRemainingMainConstellationsMtoZ';
import { STARS_BRAZILIAN_FLAG } from './starsBrazilianFlag';
import { STARS_NEUTRON_STARS_AND_PULSARS } from './starsNeutronStarsAndPulsars';
import { STARS_ICONIC_CONSTELLATIONS_PART1 } from './starsIconicConstellationsPart1';
import { STARS_ICONIC_CONSTELLATIONS_PART2 } from './starsIconicConstellationsPart2';
import { STARS_BRIGHT_MAGNITUDE_THREE } from './starsBrightMagnitudeThree';
import { STARS_LARGE_AND_EXOTIC } from './starsLargeAndExotic';
import { STARS_DISTANT_EXTREMES_AND_VARIABLES } from './starsDistantExtremesAndVariables';
import { STARS_NEW_CATALOG_ADDITIONS } from './starsNewCatalogAdditions';
import { STARS_NEIGHBORS_30LY } from './starsNeighbors30ly';
import { STARS_SUBDWARFS_AND_HISTORICAL_DESIGNATIONS } from './starsSubdwarfsAndDesignations';
import { STARS_HOT_SUBDWARFS_BLUE_STRAGGLERS_AND_GAIA } from './starsHotSubdwarfsBlueStragglersGaia';
import { STARS_NEW_ADDITIONS_BAYER_EXOPLANETS_AND_MULTIPLES } from './starsNewAdditionsBayerExoplanetsAndMultiples';

const RAW_STARS_CATALOG: StarData[] = [
  ...STARS_HYPERGIANTS,
  ...STARS_SUPERGIANTS,
  ...STARS_MASSIVE_AND_BINARIES,
  ...STARS_RED_ORANGE_GIANTS,
  ...STARS_LUMINOUS_GIANTS,
  ...STARS_BRIGHT_BEACONS,
  ...STARS_SOLAR_NEIGHBORS,
  ...STARS_EXOPLANET_HOSTS_AND_REMNANTS,
  ...STARS_MAIN_SEQUENCE_AND_SUBGIANTS,
  ...STARS_HOT_EXTREMES_AND_GIANTS,
  ...STARS_NEW_NEIGHBORS_15LY,
  ...STARS_EXTREMES_AND_REMNANTS,
  ...STARS_PRINCIPAL_CONSTELLATIONS_A_TO_M,
  ...STARS_PRINCIPAL_CONSTELLATIONS_N_TO_Z,
  ...STARS_REMAINING_MAIN_A_TO_L,
  ...STARS_REMAINING_MAIN_M_TO_Z,
  ...STARS_BRAZILIAN_FLAG,
  ...STARS_NEUTRON_STARS_AND_PULSARS,
  ...STARS_ICONIC_CONSTELLATIONS_PART1,
  ...STARS_ICONIC_CONSTELLATIONS_PART2,
  ...STARS_BRIGHT_MAGNITUDE_THREE,
  ...STARS_LARGE_AND_EXOTIC,
  ...STARS_DISTANT_EXTREMES_AND_VARIABLES,
  ...STARS_NEW_CATALOG_ADDITIONS,
  ...STARS_NEIGHBORS_30LY,
  ...STARS_SUBDWARFS_AND_HISTORICAL_DESIGNATIONS,
  ...STARS_HOT_SUBDWARFS_BLUE_STRAGGLERS_AND_GAIA,
  ...STARS_NEW_ADDITIONS_BAYER_EXOPLANETS_AND_MULTIPLES,
];

export const STAR_ID_ALIASES: Record<string, string> = {
  'castor-a': 'castor-aa',
  'castor-b': 'castor-ba',
  'mizar-a': 'mizar-aa',
  'mizar-b': 'mizar-ba',
  'theta1-orionis-c': 'theta-1-orionis-c',
  'gj-436': 'gliese-436',
  'delta-velorum-a': 'alsephina',
  'alpha-fornacis-a': 'dalim',
  'gamma-2-velorum': 'regor',
};

/**
 * Resolves any legacy, component, or alias star ID to its canonical catalog ID.
 */
export function resolveStarId(id: string): string {
  return STAR_ID_ALIASES[id] || id;
}

// Deduplicate star records by unique ID, canonical alias ID, and normalized identity
const seenStarIds = new Set<string>();
const seenCanonicalIds = new Set<string>();
const seenNames = new Set<string>();

export const STARS_CATALOG: StarData[] = RAW_STARS_CATALOG.filter((star) => {
  const canonicalId = resolveStarId(star.id);
  const normalizedKey = `${star.name.toLowerCase().trim()}::${star.constellation.toLowerCase().trim()}`;

  if (seenStarIds.has(star.id) || seenCanonicalIds.has(canonicalId) || seenNames.has(normalizedKey)) {
    return false;
  }
  seenStarIds.add(star.id);
  seenCanonicalIds.add(canonicalId);
  seenNames.add(normalizedKey);
  return true;
}).map(applyD65ChromaticityToStar);

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

export const PRESET_COMPARISONS: PresetComparison[] = [
  {
    id: 'nearest-stars',
    title: 'Nearest Stars to Earth',
    defaultSortKey: 'distance',
    defaultSortDirection: 'asc',
    starIds: [
      'sun',
      'proxima-centauri',
      'alpha-centauri-a',
      'alpha-centauri-b',
      'barnards-star',
      'luhman-16-a',
      'luhman-16-b',
      'wise-0855-0714',
      'wolf-359',
      'lalande-21185',
      'sirius-a',
      'sirius-b',
      'luyten-726-8-a',
      'uv-ceti',
      'ross-154',
      'ross-248',
      'yz-ceti',
      'epsilon-eridani',
      'lacaille-9352',
      'ross-128',
      'wise-1506-7027',
      'ez-aquarii-a',
      'ez-aquarii-b',
      'ez-aquarii-c',
      '61-cygni-a',
      '61-cygni-b',
      'procyon-a',
      'procyon-b',
      'struve-2398-a',
      'struve-2398-b',
      'groombridge-34-a',
      'groombridge-34-b',
      'dx-cancri',
      'tau-ceti',
      'gj-1061',
      'wise-0350-5658',
      'wise-0146-4234',
      'luytens-star',
      'teegardens-star',
      'scr-1845-6357-a',
      'scr-1845-6357-b',
      'kapteyns-star',
      'lacaille-8760',
      'kruger-60-a',
      'kruger-60-b',
      'denis-j1048-3956',
      'ross-614-a',
      'ross-614-b',
      'wise-1541-2250',
      'wolf-1061',
      'van-maanens-star',
      'gliese-1',
      'wolf-424-a',
      'wolf-424-b',
      'tz-arietis',
      'gliese-687',
      'lhs-292',
      'gliese-674'
    ],
    desc: 'All 58 stellar objects in the catalog within 15 light-years of Earth.'
  },
  {
    id: 'brightest-stars-night-sky',
    title: 'Brightest Stars in the Night Sky',
    defaultSortKey: 'apparentMagnitude',
    defaultSortDirection: 'asc',
    starIds: [
      'sun',
      'sirius-a',
      'canopus',
      'arcturus',
      'alpha-centauri-a',
      'vega',
      'capella-aa',
      'rigel',
      'procyon-a',
      'achernar',
      'betelgeuse',
      'hadar',
      'altair',
      'acrux-a',
      'aldebaran',
      'antares',
      'capella-ab',
      'spica',
      'pollux',
      'fomalhaut',
      'deneb',
      'mimosa',
      'alpha-centauri-b',
      'regulus',
      'adhara',
      'shaula',
      'bellatrix',
      'gacrux',
      'elnath',
      'miaplacidus',
      'alnilam',
      'alnair',
      'alnitak',
      'alioth',
      'regor',
      'dubhe',
      'mirfak',
      'wezen',
      'kaus-australis',
      'avior',
      'alkaid',
      'sargas',
      'menkalinan',
      'atria',
      'castor-aa',
      'alhena',
      'peacock',
      'alsephina',
      'polaris',
      'alphard',
      'mirzam'
    ],
    desc: 'The 51 brightest stars visible from Earth with apparent magnitude m ≤ 2.00.'
  },
  {
    id: 'hottest-stars',
    title: 'Hottest Stars',
    defaultSortKey: 'temperature',
    defaultSortDirection: 'asc',
    starIds: [
      'sun',
      'melnick-42',
      'r136a2',
      'r136c',
      'hd-269810',
      'vfts-682',
      'r136a3',
      'regor',
      'wr-136',
      'ab7',
      'cats-eye-central',
      'wr-30a',
      'ngc-2371-central',
      'wr-2',
      'wr-93b',
      'sanduleak-2-73',
      'kpd-0005-5106',
      'wr-142',
      'wr-102'
    ],
    desc: 'Extreme scorching stars compared with our Sun, reaching up to 210,000 K.'
  },
  {
    id: 'largest-stars',
    title: 'Largest Stars',
    defaultSortKey: 'size',
    defaultSortDirection: 'asc',
    starIds: [
      'sun',
      'ck-carinae',
      'stephenson-2-dfk-68',
      'hv-838',
      'hv-916',
      'v602-carinae',
      'vv-cephei-a',
      'lggs-j004116-m31',
      'hv-11223',
      'rt-carinae',
      'westerlund-1-75',
      'lggs-j004035-m31',
      'stephenson-2-dfk-12',
      'woh-s281',
      'rsgc1-f02',
      'bc-cygni',
      'lggs-j013352-m33',
      'rw-cephei',
      'quyllur',
      'woh-s341',
      'ev-carinae',
      'pz-cassiopeiae',
      'irc-minus-10414',
      'lggs-j004539-m31',
      'bi-cygni',
      'westerlund-1-237',
      'mu-cephei',
      'lggs-j013414-m33',
      'v766-centauri',
      'vx-sagittarii',
      'gcirs-7',
      'hv-888',
      'woh-s170',
      'ah-scorpii',
      'vy-canis-majoris',
      'ky-cygni',
      'kw-sagittarii',
      'my-cephei',
      'v354-cephei',
      'westerlund-1-26',
      'rsgc1-f01',
      'woh-g64',
      'nml-cygni',
      'uy-scuti',
      'iras-05280-6910',
      'hv-2112',
      'stephenson-2-18'
    ],
    desc: 'All cosmic hypergiants 1,000+ D☉ wide compared with our Sun, led by Stephenson 2-18.'
  },
  {
    id: 'smallest-main-sequence',
    title: 'Smallest Main-Sequence Stars',
    defaultSortKey: 'size',
    defaultSortDirection: 'asc',
    starIds: [
      'eblm-j0555-57ab',
      'vb-10',
      'yz-ceti',
      'wx-ursae-majoris',
      'gj-1151',
      'teegardens-star',
      'trappist-1',
      'lhs-475',
      'struve-2398-b',
      'gliese-445',
      'luyten-726-8-a',
      'gliese-682',
      '40-eridani-c',
      'hn-librae',
      'ross-47',
      'stein-2051-a',
      'gliese-625',
      'gliese-570-c',
      'gj-357',
      'struve-2398-a',
      'gliese-105-b',
      'uv-ceti',
      'ev-lacertae',
      'gliese-393',
      'wolf-294',
      'gliese-876',
      'ad-leonis',
      'proxima-centauri',
      'wolf-359',
      'gliese-412-a',
      'k2-18',
      'gliese-436',
      'toi-700',
      'gliese-752-a',
      'gliese-514',
      'gliese-570-b',
      'gliese-832',
      'gliese-526',
      'groombridge-34-b',
      'barnards-star',
      'ross-248',
      'ross-128',
      'lhs-1140',
      'gj-1214',
      'ross-154',
      'kapteyns-star',
      'gliese-581',
      'wolf-1061',
      'luytens-star',
      'gliese-667-c',
      'lalande-21185',
      'groombridge-34-a',
      'lacaille-9352',
      'sun'
    ],
    desc: 'Hydrogen-fusing dwarfs smaller than 0.5 solar diameters compared with our Sun.'
  },
  {
    id: 'most-massive-stars',
    title: 'Most Massive Stars',
    defaultSortKey: 'mass',
    defaultSortDirection: 'asc',
    starIds: [
      'sun',
      'plasketts-star',
      'zeta-puppis',
      'vfts-352',
      'peony-star',
      'v4998-sagittarii',
      'eta-carinae-a',
      'wr-25',
      'cygnus-ob2-12',
      'hd-93250',
      'hd-93129a',
      'wr-42e',
      'r136c',
      'hd-269810',
      'r136a3',
      'vfts-682',
      'lbv-1806-20',
      'r136a2',
      'bat99-98',
      'melnick-42',
      'r136a1'
    ],
    desc: 'The most massive known stars exceeding 70 to 200 solar masses, led by R136a1.'
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
      'hv-2112'
    ],
    desc: 'Bizarre stars with anomalous chemistry, extreme pulsations, and unique spectra.'
  },
  {
    id: 'remnants-with-sun',
    title: 'Stellar Remnants',
    defaultSortKey: 'size',
    defaultSortDirection: 'asc',
    starIds: [
      'rx-j1856-3754',
      'cas-a-neutron-star',
      'vela-jr-cco',
      'rx-j0420-5022',
      'westerlund-1-magnetar',
      'crab-pulsar',
      'vela-pulsar',
      'lich-pulsar',
      'psr-j1748-2446ad',
      'double-pulsar-a',
      'sgr-1935-2154',
      'magnetar-1e-2259',
      'sgr-1806-20',
      'pks-1209-cco',
      '1e-1841-045',
      'redback-pulsar',
      'double-pulsar-b',
      'rx-j1605-3249',
      'psr-b1055-52',
      'calvera',
      'swift-j1818-1607',
      'rx-j1308-2127',
      'psr-b0950-08',
      'psr-b0656-14',
      'rbs-1774',
      'psr-b1919-21',
      'sgr-1900-14',
      'psr-b1259-63',
      'scorpius-x-1-ns',
      'rx-j0806-4123',
      'black-widow-pulsar',
      'rx-j0720-3125',
      'psr-j0740-6620',
      'psr-j0030-0451',
      'geminga',
      'hulse-taylor-pulsar',
      'psr-b1509-58',
      'magnetar-1e-1048',
      'bpm-37093',
      'wd-1145-017',
      'sirius-b',
      'procyon-b',
      'wd-1856-534',
      'kpd-0005-5106',
      'van-maanens-star',
      'stein-2051-b',
      '40-eridani-b',
      'lp-40-365',
      'gd-358',
      'sun'
    ],
    desc: 'Compact stellar corpses: white dwarfs, neutron stars, pulsars, and magnetars.'
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
      'acrux-a',
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
      'antares'
    ],
    desc: 'All 27 stars on Brazil’s national flag, representing the states and capital.'
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
      'beta-comae-berenices', 'meridiana', 'alphecca', 'gienah-corvi', 'labrum', 'acrux-a', 'deneb', 'rotanev',
      'alpha-doradus', 'eltanin', 'kitalpha', 'achernar', 'dalim', 'pollux', 'alnair', 'kornephoros',
      'alpha-horologii', 'alphard', 'beta-hydri', 'alpha-indi', 'alpha-lacertae', 'regulus', 'praecipua', 'arneb',
      'zubeneschamali', 'men-alpha-lupi', 'alpha-lyncis', 'vega', 'alpha-mensae', 'gamma-microscopii', 'beta-monocerotis', 'alpha-muscae',
      'gamma-2-normae', 'polaris-australis', 'rasalhague', 'rigel', 'peacock', 'enif', 'mirfak', 'ankaa',
      'alpha-pictoris', 'alpherg', 'fomalhaut', 'zeta-puppis', 'alpha-pyxidis', 'alpha-reticuli', 'gamma-sagittae', 'kaus-australis',
      'antares', 'alpha-sculptoris', 'alpha-scuti', 'unukalhai', 'alpha-sextantis', 'aldebaran', 'alpha-telescopii', 'beta-trianguli',
      'atria', 'alpha-tucanae', 'alioth', 'polaris', 'regor', 'spica', 'beta-volantis', 'anser'
    ],
    desc: 'The brightest principal star from each of the 88 modern IAU constellations.'
  },
  {
    id: 'all-stars-catalog',
    title: 'The Complete Catalog',
    defaultSortKey: 'size',
    defaultSortDirection: 'asc',
    starIds: [...STARS_CATALOG].sort((a, b) => a.diameterKm - b.diameterKm).map((s) => s.id),
    desc: 'All 740+ stars in the catalog, from compact stellar remnants to cosmic hypergiants.'
  }
];
