import { StarData } from '../types';
import { makeStar } from './starHelper';

/**
 * STARS_HOT_SUBDWARFS_BLUE_STRAGGLERS_AND_GAIA
 * Extreme hot subdwarfs (sdB/sdO), runaway stars, blue stragglers, and Gaia astrometric landmarks.
 */
export const STARS_HOT_SUBDWARFS_BLUE_STRAGGLERS_AND_GAIA: StarData[] = [
  // 1. HD 49798 (The Archetype O-type Subdwarf Binary)
  makeStar({
    id: 'hd-49798',
    name: 'HD 49798 (Archetype Hot sdO Binary)',
    alternateNames: ['HIP 32602', 'CD-44 2465', 'O-type Subdwarf Archetype'],
    bayerDesignation: undefined,
    flamsteedDesignation: undefined,
    constellation: 'Puppis',
    diameterSolar: 1.45,
    temperature: 47500,
    spectralType: 'sdO6',
    spectralClass: 'O',
    luminositySolar: 5000,
    massSolar: 1.50,
    estimatedAge: '1.2 Billion Years',
    estimatedAgeMyr: 1200,
    metallicityFeH: -0.2,
    rotationalVelocityKmS: 45,
    distanceLy: 1700,
    apparentMagnitude: 8.29,
    absoluteMagnitude: -0.80,
    surfaceGravityLogG: 4.25,
    colorHex: '#93c5fd',
    coronaColorHex: '#60a5fa',
    solarEngulfment: 'Blistering 47,500 K helium-fusing hot subdwarf orbiting an ultra-dense massive white dwarf companion every 1.55 days.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 60.0, outer: 95.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Single-lined spectroscopic binary undergoing mass transfer onto an X-ray pulsating compact companion.',
      planets: []
    },
    stellarStage: 'Subdwarf',
    lifespanEstimate: '100 Million Years',
    futureFate: 'Type Ia Supernova Progenitor',
    fusionProcess: 'Core Helium Fusion (Helium-Burning Compact Subdwarf)',
    notableFacts: [
      'The brightest and best-studied hot O-type subdwarf (sdO) in the night sky.',
      'Binary system hosting a rapidly spinning massive white dwarf that pulses in X-rays every 13.2 seconds.',
      'A leading candidate progenitor for a thermonuclear Type Ia supernova via accretion-induced collapse.'
    ],
    description: 'The archetype hot O-type subdwarf in Puppis glowing at 47,500 K in an intimate binary dance with an X-ray pulsating companion.'
  }),

  // 2. KPD 1930+2752 (Binary sdB Supernova Progenitor)
  makeStar({
    id: 'kpd-1930-2752',
    name: 'KPD 1930+2752',
    alternateNames: ['V4584 Sgr', 'Kitt Peak-Downes 1930+2752'],
    bayerDesignation: undefined,
    flamsteedDesignation: undefined,
    constellation: 'Sagittarius',
    diameterSolar: 0.21,
    temperature: 35200,
    spectralType: 'sdB',
    spectralClass: 'B',
    luminositySolar: 32,
    massSolar: 0.52,
    estimatedAge: '2.5 Billion Years',
    estimatedAgeMyr: 2500,
    metallicityFeH: -0.1,
    rotationalVelocityKmS: 95,
    distanceLy: 2860,
    apparentMagnitude: 13.8,
    absoluteMagnitude: 4.1,
    surfaceGravityLogG: 5.61,
    colorHex: '#bfdbfe',
    coronaColorHex: '#93c5fd',
    solarEngulfment: 'Extremely compact hot B-type subdwarf orbiting a white dwarf in just 2 hours and 17 minutes.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 4.8, outer: 7.5 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Ultra-tight binary destined to merge within 200 million years due to gravitational wave emission.',
      planets: []
    },
    stellarStage: 'Subdwarf',
    lifespanEstimate: '150 Million Years',
    futureFate: 'Type Ia Supernova (Double Degenerate Merger)',
    fusionProcess: 'Core Helium Fusion (Stripped Envelope Subdwarf)',
    notableFacts: [
      'The combined mass of the sdB and white dwarf companion exceeds the Chandrasekhar mass limit (~1.47 M☉).',
      'Orbits with a period of only 137 minutes (2.28 hours), producing continuous gravitational wave radiation.',
      'A confirmed progenitor system for a Type Ia supernova scheduled to merge in ~200 million years.'
    ],
    description: 'A hot B-type subdwarf in Sagittarius bound to a white dwarf in a 2-hour orbit, doomed to merge and explode as a Type Ia supernova.'
  }),

  // 3. CD-30°11223 (Fastest Runaway sdB Binary in the Galaxy)
  makeStar({
    id: 'cd-30-11223',
    name: 'CD-30°11223 (Hypervelocity sdB Binary)',
    alternateNames: ['GALEX J1411-3053', 'Runaway Subdwarf B'],
    bayerDesignation: undefined,
    flamsteedDesignation: undefined,
    constellation: 'Centaurus',
    diameterSolar: 0.18,
    temperature: 29200,
    spectralType: 'sdB',
    spectralClass: 'B',
    luminositySolar: 22,
    massSolar: 0.47,
    estimatedAge: '1.8 Billion Years',
    estimatedAgeMyr: 1800,
    metallicityFeH: 0.0,
    rotationalVelocityKmS: 180,
    distanceLy: 1140,
    apparentMagnitude: 12.3,
    absoluteMagnitude: 4.6,
    surfaceGravityLogG: 5.66,
    colorHex: '#dbeafe',
    coronaColorHex: '#bfdbfe',
    solarEngulfment: 'Hypervelocity compact subdwarf hurtling through the Milky Way disc with an orbital period of only 70 minutes.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 4.0, outer: 6.2 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'The shortest-period binary sdB known, orbiting an unseen massive carbon-oxygen white dwarf in 1.16 hours.',
      planets: []
    },
    stellarStage: 'Subdwarf',
    lifespanEstimate: '100 Million Years',
    futureFate: 'Sub-Chandrasekhar Thermonuclear Explosion',
    fusionProcess: 'Core Helium Fusion with Extreme Tidal Distortion',
    notableFacts: [
      'Has the shortest orbital period (70.5 minutes) of any known hot subdwarf binary system.',
      'Moving at a heliocentric radial velocity of over 380 km/s through the Galactic halo.',
      'Tidally deformed into an elongated teardrop shape by the intense gravity of its white dwarf companion.'
    ],
    description: 'The shortest-period hot B-type subdwarf binary known, whirling around a white dwarf in 70 minutes at 380 km/s in Centaurus.'
  }),

  // 4. BSS 19 (47 Tucanae Blue Straggler Archetype)
  makeStar({
    id: 'bss-19-47tuc',
    name: 'BSS 19 (47 Tucanae Blue Straggler)',
    alternateNames: ['47 Tuc BSS 19', 'NGC 104 Blue Straggler 19'],
    bayerDesignation: undefined,
    flamsteedDesignation: undefined,
    constellation: 'Tucana',
    diameterSolar: 1.60,
    temperature: 8400,
    spectralType: 'A3V',
    spectralClass: 'A',
    luminositySolar: 11.5,
    massSolar: 1.65,
    estimatedAge: 'Rejuvenated Stellar Merger',
    estimatedAgeMyr: 400,
    metallicityFeH: -0.7,
    rotationalVelocityKmS: 120,
    distanceLy: 14500,
    apparentMagnitude: 14.1,
    absoluteMagnitude: 1.9,
    surfaceGravityLogG: 4.25,
    colorHex: '#e0f2fe',
    coronaColorHex: '#bae6fd',
    solarEngulfment: 'Rejuvenated blue straggler formed by direct stellar collision and coalescence inside the dense core of 47 Tucanae.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 3.1, outer: 4.9 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Dense globular cluster core environment with extreme stellar collision frequency.',
      planets: []
    },
    stellarStage: 'Blue Straggler',
    lifespanEstimate: '1.2 Billion Years',
    futureFate: 'Helium Core Exhaustion -> Asymptotic Giant Branch',
    fusionProcess: 'Revitalized Core Hydrogen Fusion',
    notableFacts: [
      'A classic "blue straggler" star: appears far younger and more massive than the 12-billion-year-old turnoff stars in 47 Tucanae.',
      'Formed through the direct collision and coalescence of two low-mass main sequence stars in the cluster core.',
      'Proves that stellar collisions and dynamical encounters revitalise dormant stars with fresh hydrogen fuel.'
    ],
    description: 'A rejuvenated blue straggler star in globular cluster 47 Tucanae, born from the direct collision of two ancient stars.'
  })
];
