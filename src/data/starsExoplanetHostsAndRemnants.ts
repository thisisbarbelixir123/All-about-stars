import { StarData } from '../types';
import { makeStar } from './starHelper';

export const STARS_EXOPLANET_HOSTS_AND_REMNANTS: StarData[] = [
  // 69. TRAPPIST-1
  makeStar({
    id: 'trappist-1',
    name: 'TRAPPIST-1 (2MASS J23062928-0502285)',
    alternateNames: ['2MASS J23062928-0502285', 'K2-112'],
    constellation: 'Aquarius',
    diameterSolar: 0.119,
    temperature: 2566,
    spectralType: 'M8V',
    spectralClass: 'M',
    luminositySolar: 0.000553,
    massSolar: 0.0898,
    estimatedAge: '~7.6 Billion Years',
    estimatedAgeMyr: 7600,
    metallicityFeH: 0.04,
    rotationalVelocityKmS: 1.5,
    distanceLy: 40.66,
    apparentMagnitude: 18.80,
    absoluteMagnitude: 18.4,
    surfaceGravityLogG: 5.24,
    colorHex: '#ff5020',
    coronaColorHex: '#ff8444',
    solarEngulfment: 'Spans roughly 166,000 km (~0.0011 AU diameter; barely 1.15x Jupiter’s diameter)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.021, outer: 0.048 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 7,
      candidateCount: 0,
      systemOverview: 'Famous resonant chain of 7 Earth-sized terrestrial worlds, 3–4 of which orbit in the conservative habitable zone.',
      planets: [
        {
          name: 'TRAPPIST-1b',
          type: 'Terrestrial (Rocky)',
          mass: '1.37 M⊕',
          radius: '1.116 R⊕',
          orbitalPeriodDays: 1.51,
          semiMajorAxisAU: 0.0115,
          habitableZoneStatus: 'Too Hot',
          discoveryYear: 2016,
          discoveryMethod: 'Transit',
          confirmed: true,
          description: 'Innermost rocky planet with a high equilibrium temperature and tidally locked synchronous rotation.'
        },
        {
          name: 'TRAPPIST-1c',
          type: 'Terrestrial (Rocky)',
          mass: '1.31 M⊕',
          radius: '1.097 R⊕',
          orbitalPeriodDays: 2.42,
          semiMajorAxisAU: 0.0158,
          habitableZoneStatus: 'Too Hot',
          discoveryYear: 2016,
          discoveryMethod: 'Transit',
          confirmed: true,
          description: 'Hot Earth twin observed by JWST showing little to no thick CO2 atmosphere.'
        },
        {
          name: 'TRAPPIST-1d',
          type: 'Terrestrial / Volatile-Rich',
          mass: '0.39 M⊕',
          radius: '0.788 R⊕',
          orbitalPeriodDays: 4.05,
          semiMajorAxisAU: 0.0223,
          habitableZoneStatus: 'Inner Rim',
          discoveryYear: 2016,
          discoveryMethod: 'Transit',
          confirmed: true,
          description: 'Small, lightweight world orbiting at the very inner edge of the habitable zone.'
        },
        {
          name: 'TRAPPIST-1e (Prime Habitable World)',
          type: 'Terrestrial / Earth-Analogue',
          mass: '0.69 M⊕',
          radius: '0.920 R⊕',
          orbitalPeriodDays: 6.10,
          semiMajorAxisAU: 0.0293,
          habitableZoneStatus: 'Conservative Habitable Zone',
          discoveryYear: 2017,
          discoveryMethod: 'Transit',
          confirmed: true,
          description: 'Most Earth-like planet in the system with density consistent with a rocky mantle and iron core.'
        },
        {
          name: 'TRAPPIST-1f',
          type: 'Terrestrial / Ocean-Candidate',
          mass: '1.04 M⊕',
          radius: '1.045 R⊕',
          orbitalPeriodDays: 9.21,
          semiMajorAxisAU: 0.0385,
          habitableZoneStatus: 'Conservative Habitable Zone',
          discoveryYear: 2017,
          discoveryMethod: 'Transit',
          confirmed: true,
          description: 'Potentially volatile-rich temperate world in a resonant orbital chain.'
        },
        {
          name: 'TRAPPIST-1g',
          type: 'Terrestrial / Volatile-Rich',
          mass: '1.32 M⊕',
          radius: '1.129 R⊕',
          orbitalPeriodDays: 12.35,
          semiMajorAxisAU: 0.0469,
          habitableZoneStatus: 'Outer Rim',
          discoveryYear: 2017,
          discoveryMethod: 'Transit',
          confirmed: true,
          description: 'A cooler super-Earth world at the outer edge of the habitable zone.'
        },
        {
          name: 'TRAPPIST-1h',
          type: 'Icy Terrestrial',
          mass: '0.33 M⊕',
          radius: '0.775 R⊕',
          orbitalPeriodDays: 18.77,
          semiMajorAxisAU: 0.0619,
          habitableZoneStatus: 'Beyond Ice Line',
          discoveryYear: 2017,
          discoveryMethod: 'Transit',
          confirmed: true,
          description: 'The outermost known planet in the resonant chain, an icy sub-Earth world.'
        }
      ]
    },
    stellarStage: 'Red Dwarf',
    lifespanEstimate: '~12 Trillion Years',
    futureFate: 'Helium White Dwarf',
    fusionProcess: 'Convective Proton-Proton Chain Hydrogen Fusion',
    notableFacts: [
      'Ultra-cool red dwarf barely larger than Jupiter, yet fusing hydrogen steadily for trillions of years.',
      'Hosts the largest number of Earth-sized planets ever found in a single planetary system.',
      'All seven planets orbit in a tight resonant orbital chain with orbital periods locked in integer ratios.'
    ],
    description: 'An ultra-cool red dwarf in Aquarius hosting seven Earth-sized worlds in a delicate Laplace resonance.'
  }),

  // 70. Kepler-186
  makeStar({
    id: 'kepler-186',
    name: 'Kepler-186',
    alternateNames: ['KOI-571', 'KIC 8120608', '2MASS J19543665+4357180'],
    constellation: 'Cygnus',
    diameterSolar: 0.52,
    temperature: 3755,
    spectralType: 'M1V',
    spectralClass: 'M',
    luminositySolar: 0.055,
    massSolar: 0.54,
    estimatedAge: '~4.0 Billion Years',
    estimatedAgeMyr: 4000,
    metallicityFeH: -0.26,
    rotationalVelocityKmS: 1.5,
    distanceLy: 580,
    apparentMagnitude: 14.62,
    absoluteMagnitude: 8.37,
    surfaceGravityLogG: 4.75,
    colorHex: '#ff8444',
    coronaColorHex: '#ffb577',
    solarEngulfment: 'Spans roughly 724,000 km (~0.0048 AU diameter)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.22, outer: 0.40 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 5,
      candidateCount: 0,
      systemOverview: 'Famous host of Kepler-186f, the historic first Earth-sized planet discovered in the habitable zone of another star.',
      planets: [
        {
          name: 'Kepler-186f (First Habitable Earth-Sized Planet)',
          type: 'Terrestrial / Earth-Analogue',
          mass: '~1.4 M⊕',
          radius: '1.17 R⊕',
          orbitalPeriodDays: 129.94,
          semiMajorAxisAU: 0.432,
          habitableZoneStatus: 'Conservative Habitable Zone',
          discoveryYear: 2014,
          discoveryMethod: 'Transit',
          confirmed: true,
          description: 'The historic first Earth-sized exoplanet validated in the habitable zone of another star.'
        }
      ]
    },
    stellarStage: 'Red Dwarf',
    lifespanEstimate: '~100 Billion Years',
    futureFate: 'Helium White Dwarf',
    fusionProcess: 'Proton-Proton Hydrogen Fusion',
    notableFacts: [
      'In April 2014, Kepler-186f made history as the very first verified Earth-size planet in a star’s habitable zone.',
      'Receives about one-third of the heat and light that Earth receives from the Sun.',
      'Hosts four additional inner rocky planets (b, c, d, e).'
    ],
    description: 'A quiet red dwarf in Cygnus hosting Kepler-186f, the landmark first habitable Earth-sized planet.'
  }),

  // 71. Kepler-452
  makeStar({
    id: 'kepler-452',
    name: 'Kepler-452',
    alternateNames: ['KOI-7016', 'KIC 8311864', 'Earth’s Older Cousin'],
    constellation: 'Cygnus',
    diameterSolar: 1.11,
    temperature: 5757,
    spectralType: 'G2V',
    spectralClass: 'G',
    luminositySolar: 1.20,
    massSolar: 1.04,
    estimatedAge: '~6.0 Billion Years',
    estimatedAgeMyr: 6000,
    metallicityFeH: 0.21,
    rotationalVelocityKmS: 2.0,
    distanceLy: 1402,
    apparentMagnitude: 13.37,
    absoluteMagnitude: 5.2,
    surfaceGravityLogG: 4.32,
    colorHex: '#ffec70',
    coronaColorHex: '#fffbb8',
    solarEngulfment: 'Spans roughly 1.55 Million km (~0.010 AU diameter)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1.05, outer: 1.55 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 1,
      candidateCount: 0,
      systemOverview: 'Host of Kepler-452b ("Earth 2.0"), a super-Earth orbiting a G-type solar twin in a 385-day orbit.',
      planets: [
        {
          name: 'Kepler-452b (Earth 2.0 / Older Cousin)',
          type: 'Super-Earth / Rocky-Gas Transition',
          mass: '~5.0 M⊕',
          radius: '1.63 R⊕',
          orbitalPeriodDays: 384.84,
          semiMajorAxisAU: 1.046,
          habitableZoneStatus: 'Conservative Habitable Zone',
          discoveryYear: 2015,
          discoveryMethod: 'Transit',
          confirmed: true,
          description: 'A super-Earth orbiting its G-type parent star at almost the exact same distance and year length as Earth.'
        }
      ]
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '~10 Billion Years',
    futureFate: 'Red Giant / Planetary Nebula / White Dwarf',
    fusionProcess: 'Proton-Proton Hydrogen Fusion',
    notableFacts: [
      'Often called "Earth’s Older, Bigger Cousin" due to its 385-day orbit around a solar twin star.',
      'The host star is ~1.5 billion years older than our Sun, offering a glimpse into our solar system’s future.',
      'Kepler-452b receives roughly 10% more solar energy than Earth does from the Sun.'
    ],
    description: 'A G-type solar twin in Cygnus hosting the famous habitable-zone super-Earth Kepler-452b.'
  }),

  // 72. Tau Ceti
  makeStar({
    id: 'tau-ceti',
    name: 'Tau Ceti',
    alternateNames: ['HD 10700', 'HIP 8102', 'HR 509'],
    bayerDesignation: 'τ Cet',
    constellation: 'Cetus',
    diameterSolar: 0.79,
    temperature: 5344,
    spectralType: 'G8V',
    spectralClass: 'G',
    luminositySolar: 0.52,
    massSolar: 0.783,
    estimatedAge: '~5.8 Billion Years',
    estimatedAgeMyr: 5800,
    metallicityFeH: -0.55,
    rotationalVelocityKmS: 1.8,
    distanceLy: 11.9,
    apparentMagnitude: 3.49,
    absoluteMagnitude: 5.68,
    surfaceGravityLogG: 4.5,
    colorHex: '#ffde6e',
    coronaColorHex: '#fff0a8',
    solarEngulfment: 'Spans roughly 1.10 Million km (~0.0073 AU diameter)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.68, outer: 1.05 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 4,
      candidateCount: 4,
      debrisDisk: true,
      debrisDiskDescription: 'Contains a massive debris disk with roughly 10 times more comets and asteroids than the Solar System’s Kuiper Belt.',
      systemOverview: 'Host of multiple super-Earth planets (e, f, g, h) including candidate worlds in the habitable zone.',
      planets: [
        {
          name: 'Tau Ceti e',
          type: 'Super-Earth',
          mass: '3.93 M⊕',
          orbitalPeriodDays: 162.87,
          semiMajorAxisAU: 0.538,
          habitableZoneStatus: 'Inner Rim',
          discoveryYear: 2012,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A candidate habitable super-Earth receiving ~1.7x Earth’s solar flux.'
        },
        {
          name: 'Tau Ceti f',
          type: 'Super-Earth',
          mass: '3.93 M⊕',
          orbitalPeriodDays: 636.1,
          semiMajorAxisAU: 1.334,
          habitableZoneStatus: 'Outer Rim',
          discoveryYear: 2012,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A cold super-Earth orbiting near the outer boundary of Tau Ceti’s habitable zone.'
        }
      ]
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '~15 Billion Years',
    futureFate: 'Red Giant / White Dwarf',
    fusionProcess: 'Proton-Proton Hydrogen Fusion',
    notableFacts: [
      'The closest single G-class star to the Sun (11.9 light-years).',
      'Extremely stable and magnetically calm, making it a cornerstone for SETI searches.',
      'Surrounded by a dense Kuiper-like debris disk with 10 times more comets than our Solar System.'
    ],
    description: 'A solitary, quiet solar-type neighbor in Cetus with a rich multi-planet and debris-disk architecture.'
  }),

  // 73. 51 Pegasi (Helvetios)
  makeStar({
    id: '51-pegasi',
    name: '51 Pegasi (Helvetios)',
    alternateNames: ['Helvetios', 'HD 217014', 'HIP 113357', 'HR 8729'],
    bayerDesignation: '51 Peg',
    constellation: 'Pegasus',
    diameterSolar: 1.24,
    temperature: 5790,
    spectralType: 'G2V',
    spectralClass: 'G',
    luminositySolar: 1.36,
    massSolar: 1.12,
    estimatedAge: '~6.1 Billion Years',
    estimatedAgeMyr: 6100,
    metallicityFeH: 0.20,
    rotationalVelocityKmS: 2.1,
    distanceLy: 50.45,
    apparentMagnitude: 5.49,
    absoluteMagnitude: 4.51,
    surfaceGravityLogG: 4.36,
    colorHex: '#ffec70',
    coronaColorHex: '#fffbb8',
    solarEngulfment: 'Spans roughly 1.73 Million km (~0.0115 AU diameter)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1.1, outer: 1.6 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 1,
      candidateCount: 0,
      systemOverview: 'The historic host star of Dimidium (51 Pegasi b), the first exoplanet ever discovered orbiting a sun-like star (1995 Nobel Prize).',
      planets: [
        {
          name: 'Dimidium (51 Pegasi b)',
          type: 'Hot Jupiter (Prototype)',
          mass: '0.472 M_J',
          orbitalPeriodDays: 4.23,
          semiMajorAxisAU: 0.0527,
          habitableZoneStatus: 'Too Hot',
          discoveryYear: 1995,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'The archetype first hot Jupiter discovered by Michel Mayor and Didier Queloz, revolutionizing planetary science.'
        }
      ]
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '~9 Billion Years',
    futureFate: 'Red Giant / Planetary Nebula / White Dwarf',
    fusionProcess: 'Proton-Proton Hydrogen Fusion',
    notableFacts: [
      'In 1995, the discovery of 51 Pegasi b proved that planets orbit other sun-like stars, earning the 2019 Nobel Prize in Physics.',
      'Created the new planetary classification category: "Hot Jupiters".',
      'Officially named Helvetios by the IAU in honor of Switzerland.'
    ],
    description: 'The historic G-type star in Pegasus around which the first exoplanet orbiting a sun-like star was discovered in 1995.'
  }),

  // 74. Gliese 667 C
  makeStar({
    id: 'gliese-667-c',
    name: 'Gliese 667 C',
    alternateNames: ['HR 6426 C', 'HD 156384 C', 'HIP 84709 C'],
    constellation: 'Scorpius',
    diameterSolar: 0.38,
    temperature: 3350,
    spectralType: 'M1V',
    spectralClass: 'M',
    luminositySolar: 0.0137,
    massSolar: 0.33,
    estimatedAge: '~5.0 Billion Years',
    estimatedAgeMyr: 5000,
    metallicityFeH: -0.55,
    rotationalVelocityKmS: 1.0,
    distanceLy: 23.6,
    apparentMagnitude: 10.22,
    absoluteMagnitude: 10.93,
    surfaceGravityLogG: 4.8,
    colorHex: '#ff773b',
    coronaColorHex: '#ffaa66',
    solarEngulfment: 'Spans roughly 529,000 km (~0.0035 AU diameter)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.11, outer: 0.24 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 3,
      candidateCount: 3,
      systemOverview: 'Tertiary companion in a triple star system, hosting two to three super-Earths within its habitable zone.',
      planets: [
        {
          name: 'Gliese 667 C c',
          type: 'Super-Earth',
          mass: '3.8 M⊕',
          orbitalPeriodDays: 28.14,
          semiMajorAxisAU: 0.125,
          habitableZoneStatus: 'Conservative Habitable Zone',
          discoveryYear: 2011,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A super-Earth receiving 90% of Earth’s solar flux, sitting directly in the liquid water habitable zone.'
        }
      ]
    },
    stellarStage: 'Red Dwarf',
    lifespanEstimate: '~250 Billion Years',
    futureFate: 'Helium White Dwarf',
    fusionProcess: 'Convective Proton-Proton Fusion',
    notableFacts: [
      'Orbits a close pair of orange dwarf stars (Gliese 667 A and B) at a separation of ~230 AU.',
      'Sunset on Gliese 667 C c would show three glowing suns in the sky simultaneously.',
      'One of the first red dwarf systems found to contain multiple super-Earths in its habitable zone.'
    ],
    description: 'A red dwarf tertiary in Scorpius hosting a packed system of super-Earths with views of two sister suns.'
  }),

  // 75. Gliese 581
  makeStar({
    id: 'gliese-581',
    name: 'Gliese 581 (HO Librae)',
    alternateNames: ['HO Librae', 'HIP 74995', 'BD-07 4003'],
    constellation: 'Libra',
    diameterSolar: 0.299,
    temperature: 3498,
    spectralType: 'M3V',
    spectralClass: 'M',
    luminositySolar: 0.013,
    massSolar: 0.31,
    estimatedAge: '~8.0 Billion Years',
    estimatedAgeMyr: 8000,
    metallicityFeH: -0.15,
    rotationalVelocityKmS: 1.0,
    distanceLy: 20.55,
    apparentMagnitude: 10.57,
    absoluteMagnitude: 11.58,
    surfaceGravityLogG: 4.96,
    colorHex: '#ff773b',
    coronaColorHex: '#ffaa66',
    solarEngulfment: 'Spans roughly 416,000 km (~0.0028 AU diameter)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.11, outer: 0.22 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 3,
      candidateCount: 1,
      debrisDisk: true,
      debrisDiskDescription: 'Massive cold debris disk imaged by the Herschel Space Observatory extending out to 60 AU.',
      systemOverview: 'Famous benchmark planetary system hosting super-Earths Gliese 581 c and e.',
      planets: [
        {
          name: 'Gliese 581 e',
          type: 'Terrestrial / Sub-Earth',
          mass: '1.7 M⊕',
          orbitalPeriodDays: 3.15,
          semiMajorAxisAU: 0.028,
          habitableZoneStatus: 'Too Hot',
          discoveryYear: 2009,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'One of the first lightweight rocky exoplanets detected by the HARPS spectrometer.'
        },
        {
          name: 'Gliese 581 c',
          type: 'Super-Earth',
          mass: '5.5 M⊕',
          orbitalPeriodDays: 12.93,
          semiMajorAxisAU: 0.072,
          habitableZoneStatus: 'Inner Rim',
          discoveryYear: 2007,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A well-known super-Earth orbiting near the inner edge of the habitable zone.'
        }
      ]
    },
    stellarStage: 'Red Dwarf',
    lifespanEstimate: '~300 Billion Years',
    futureFate: 'Helium White Dwarf',
    fusionProcess: 'Convective Proton-Proton Fusion',
    notableFacts: [
      'One of the first red dwarfs discovered to host a compact system of low-mass terrestrial and super-Earth planets.',
      'Surrounded by an expansive outer icy Kuiper Belt detected by the Herschel telescope.',
      'Low stellar activity makes Gliese 581 a favorite for atmospheric simulation studies.'
    ],
    description: 'A benchmark red dwarf system in Libra hosting multiple super-Earths and an extensive cold debris disk.'
  }),

  // 76. Sirius B (The Pup)
  makeStar({
    id: 'sirius-b',
    name: 'Sirius B (The Pup)',
    alternateNames: ['The Pup', 'Alpha Canis Majoris B', 'EGGR 49', 'WD 0642-166'],
    bayerDesignation: 'α CMa B',
    constellation: 'Canis Major',
    diameterSolar: 0.0084, // ~11,700 km, roughly 0.92 Earth diameter
    temperature: 25200,
    spectralType: 'DA2',
    spectralClass: 'WD',
    luminositySolar: 0.056,
    massSolar: 1.018,
    estimatedAge: '~228 Million Years (as White Dwarf)',
    estimatedAgeMyr: 228,
    metallicityFeH: -0.1,
    rotationalVelocityKmS: 1.0,
    distanceLy: 8.60,
    apparentMagnitude: 8.44,
    absoluteMagnitude: 11.34,
    surfaceGravityLogG: 8.57,
    colorHex: '#cce2ff',
    coronaColorHex: '#f0f7ff',
    solarEngulfment: 'Extremely dense stellar remnant: diameter is only 11,700 km (~0.92 Earth diameters)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.22, outer: 0.35 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Degenerate electron core remnant orbiting Sirius A in a 50.1-year orbit.',
      planets: []
    },
    stellarStage: 'White Dwarf',
    lifespanEstimate: '> 100 Trillion Years (Cooling curve)',
    futureFate: 'Black Dwarf',
    fusionProcess: 'No Fusion — Radiating Stored Thermal Energy',
    notableFacts: [
      'The closest and most famous white dwarf star to Earth.',
      'Contains more mass than our Sun (1.02 M_sun) packed into a sphere smaller than the Earth.',
      'A single teaspoon of Sirius B matter weighs approximately 5 metric tons on Earth.'
    ],
    description: 'The legendary white dwarf companion of Sirius A, packing a solar mass into an Earth-sized sphere.'
  }),

  // 77. Van Maanen's Star
  makeStar({
    id: 'van-maanens-star',
    name: 'Van Maanen’s Star',
    alternateNames: ['Wolf 28', 'EGGR 5', 'WD 0046+051', 'HIP 3829'],
    constellation: 'Pisces',
    diameterSolar: 0.011, // ~15,300 km (~1.2 Earth diameters)
    temperature: 6110,
    spectralType: 'DZ8',
    spectralClass: 'WD',
    luminositySolar: 0.00017,
    massSolar: 0.68,
    estimatedAge: '~4.1 Billion Years (Cooling Age)',
    estimatedAgeMyr: 4100,
    metallicityFeH: 0.0,
    rotationalVelocityKmS: 1.0,
    distanceLy: 14.07,
    apparentMagnitude: 12.37,
    absoluteMagnitude: 14.23,
    surfaceGravityLogG: 8.12,
    colorHex: '#fff7e0',
    coronaColorHex: '#ffffff',
    solarEngulfment: 'Extremely dense stellar remnant: diameter is only 15,300 km (~1.2 Earth diameters)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.012, outer: 0.022 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      debrisDisk: true,
      debrisDiskDescription: 'Heavy metal pollution in photosphere (iron, magnesium, calcium) caused by continuous accretion of disrupted rocky planetesimals.',
      systemOverview: 'Polluted white dwarf whose atmosphere is continuously enriched with heavy elements from shredded rocky asteroids.',
      planets: []
    },
    stellarStage: 'White Dwarf',
    lifespanEstimate: '> 100 Trillion Years (Cooling)',
    futureFate: 'Black Dwarf',
    fusionProcess: 'No Fusion — Degenerate Electron Cooling',
    notableFacts: [
      'The closest known solitary (non-binary) white dwarf to our Sun (14.1 light years).',
      'First white dwarf found to have heavy metal elements in its spectrum (discovered by Adriaan van Maanen in 1917).',
      'The heavy elements prove that it is actively devouring shredded asteroids from a destroyed planetary system.'
    ],
    description: 'The closest isolated white dwarf to the Sun, famous for devouring shredded rocky debris from its former planetary system.'
  }),

  // 78. Procyon B
  makeStar({
    id: 'procyon-b',
    name: 'Procyon B',
    alternateNames: ['Alpha Canis Minoris B', 'EGGR 55', 'WD 0736+053'],
    bayerDesignation: 'α CMi B',
    constellation: 'Canis Minor',
    diameterSolar: 0.012, // ~16,700 km
    temperature: 7740,
    spectralType: 'DQZ',
    spectralClass: 'WD',
    luminositySolar: 0.00049,
    massSolar: 0.602,
    estimatedAge: '~1.37 Billion Years (Cooling)',
    estimatedAgeMyr: 1370,
    metallicityFeH: 0.0,
    rotationalVelocityKmS: 1.0,
    distanceLy: 11.46,
    apparentMagnitude: 10.92,
    absoluteMagnitude: 13.04,
    surfaceGravityLogG: 8.05,
    colorHex: '#f0f5ff',
    coronaColorHex: '#ffffff',
    solarEngulfment: 'Extremely dense stellar remnant: diameter is only 16,700 km (~1.3 Earth diameters)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.02, outer: 0.035 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'White dwarf companion to Procyon A in a 40.8-year orbit.',
      planets: []
    },
    stellarStage: 'White Dwarf',
    lifespanEstimate: '> 100 Trillion Years',
    futureFate: 'Black Dwarf',
    fusionProcess: 'No Fusion — Degenerate Electron Cooling',
    notableFacts: [
      'The second-closest white dwarf to the Solar System after Sirius B.',
      'Possesses a rare helium-rich atmosphere with traces of carbon and heavy elements.',
      'Orbits Procyon A at an average distance of 15 AU.'
    ],
    description: 'The faint white dwarf companion of Procyon A, cooling silently in Canis Minor.'
  }),

  // 79. Crab Pulsar (PSR B0531+21)
  makeStar({
    id: 'crab-pulsar',
    name: 'Crab Pulsar (PSR B0531+21)',
    alternateNames: ['PSR B0531+21', 'Crab Nebula Pulsar', 'SN 1054 Remnant'],
    constellation: 'Taurus',
    diameterKm: 20, // 20 km physical diameter (neutron star city-sized core)
    temperature: 1600000,
    spectralType: 'Pulsar (P0)',
    spectralClass: 'NS',
    luminositySolar: 75000,
    massSolar: 1.4,
    estimatedAge: '972 Years (Supernova SN 1054)',
    estimatedAgeMyr: 0.000972,
    metallicityFeH: 0.0,
    rotationalVelocityKmS: 1800,
    distanceLy: 6500,
    apparentMagnitude: 16.5,
    absoluteMagnitude: 4.5,
    surfaceGravityLogG: 14.3,
    colorHex: '#aae8ff',
    coronaColorHex: '#d8f4ff',
    solarEngulfment: 'Physical diameter is only ~20 km, packing 1.4 Solar Masses into a city-sized ultra-dense neutron sphere (roughly the size of a metropolitan city)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 200, outer: 350 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Central powerhouse driving the relativistic wind and synchrotron glow of the Crab Nebula (M1).',
      planets: []
    },
    stellarStage: 'Neutron Star / Pulsar',
    lifespanEstimate: '> 10 Billion Years',
    futureFate: 'Cold Dead Neutron Star',
    fusionProcess: 'No Fusion — Relativistic Rotational Magnetic Braking',
    notableFacts: [
      'Spins at an astonishing 30.2 times per second (30 Hz period), sweeping lighthouse beams of radio, optical, and X-ray radiation across space.',
      'Born in the historical supernova explosion SN 1054 recorded by Chinese, Japanese, and Arab astronomers in July 1054 CE.',
      'Pours 100,000 times more energy into the Crab Nebula every second than our Sun emits in all wavelengths.'
    ],
    description: 'The famous rapidly spinning neutron star in the heart of the Crab Nebula, pulsing 30 times every second with a diameter of only 20 km.'
  }),

  // 80. Vela Pulsar (PSR B0833-45)
  makeStar({
    id: 'vela-pulsar',
    name: 'Vela Pulsar (PSR B0833-45)',
    alternateNames: ['PSR B0833-45', 'Vela Supernova Remnant Central Engine'],
    constellation: 'Vela',
    diameterKm: 20, // 20 km physical diameter (neutron star city-sized core)
    temperature: 1100000,
    spectralType: 'Pulsar (P0)',
    spectralClass: 'NS',
    luminositySolar: 5000,
    massSolar: 1.8,
    estimatedAge: '~11,000 - 12,000 Years',
    estimatedAgeMyr: 0.011,
    metallicityFeH: 0.0,
    rotationalVelocityKmS: 1200,
    distanceLy: 936,
    apparentMagnitude: 23.6,
    absoluteMagnitude: 11.5,
    surfaceGravityLogG: 14.4,
    colorHex: '#94e0ff',
    coronaColorHex: '#ccf0ff',
    solarEngulfment: 'Physical diameter is only ~20 km, packing 1.8 Solar Masses into a city-sized neutron core (with a solid crystalline iron-lattice crust)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 50, outer: 100 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Powerhouse of the Vela Supernova Remnant, famous for sudden rotational acceleration "glitches".',
      planets: []
    },
    stellarStage: 'Neutron Star / Pulsar',
    lifespanEstimate: '> 10 Billion Years',
    futureFate: 'Cold Dead Neutron Star',
    fusionProcess: 'No Fusion — Relativistic Rotational Magnetic Energy',
    notableFacts: [
      'Rotates 11.195 times per second (period of 89.33 milliseconds).',
      'The brightest persistent celestial source of high-energy gamma rays in the night sky.',
      'Famous for periodic "glitches" where internal superfluid vortices transfer angular momentum to the crust, causing the pulsar to suddenly spin faster.'
    ],
    description: 'A brilliant gamma-ray pulsar in Vela, spinning 11 times per second with a diameter of only 20 km.'
  }),

  // 81. Lich (PSR B1257+12) - First Pulsar with Confirmed Exoplanets
  makeStar({
    id: 'lich-pulsar',
    name: 'Lich (PSR B1257+12)',
    alternateNames: ['PSR B1257+12', 'PSR 1257+12', 'Lich'],
    constellation: 'Virgo',
    diameterKm: 20, // 20 km physical diameter
    temperature: 1200000,
    spectralType: 'Pulsar (MSP)',
    spectralClass: 'NS',
    luminositySolar: 0.04,
    massSolar: 1.4,
    estimatedAge: '~800 Million Years',
    estimatedAgeMyr: 800,
    metallicityFeH: 0.0,
    rotationalVelocityKmS: 1500,
    distanceLy: 2300,
    apparentMagnitude: 22.5,
    absoluteMagnitude: 13.3,
    surfaceGravityLogG: 14.3,
    colorHex: '#99e6ff',
    coronaColorHex: '#d6f5ff',
    solarEngulfment: 'Physical diameter is only ~20 km, rotating 161 times every second (visualized at calibrated remnant scale in 3D preview)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.15, outer: 0.3 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 3,
      candidateCount: 0,
      systemOverview: 'The historic first extrasolar planetary system discovered in human history (1992), hosting planets Draugr, Poltergeist, and Phobetor.',
      planets: [
        {
          name: 'Draugr (PSR B1257+12 b)',
          type: 'Pulsar Planet / Terrestrial (Sub-Earth)',
          mass: '0.020 M⊕ (Moon-mass)',
          radius: '0.33 R⊕',
          orbitalPeriodDays: 25.26,
          semiMajorAxisAU: 0.19,
          habitableZoneStatus: 'Too Hot',
          discoveryYear: 1994,
          discoveryMethod: 'Pulsar Timing',
          confirmed: true,
          description: 'The lowest-mass exoplanet known, having roughly twice the mass of Earth’s Moon.'
        },
        {
          name: 'Poltergeist (PSR B1257+12 c)',
          type: 'Pulsar Planet / Super-Earth',
          mass: '4.3 M⊕',
          radius: '1.5 R⊕',
          orbitalPeriodDays: 66.54,
          semiMajorAxisAU: 0.36,
          habitableZoneStatus: 'Inner Rim',
          discoveryYear: 1992,
          discoveryMethod: 'Pulsar Timing',
          confirmed: true,
          description: 'A rocky super-Earth orbiting in near 3:2 orbital resonance with planet Phobetor.'
        },
        {
          name: 'Phobetor (PSR B1257+12 d)',
          type: 'Pulsar Planet / Super-Earth',
          mass: '3.9 M⊕',
          radius: '1.4 R⊕',
          orbitalPeriodDays: 98.21,
          semiMajorAxisAU: 0.46,
          habitableZoneStatus: 'Conservative Habitable Zone',
          discoveryYear: 1992,
          discoveryMethod: 'Pulsar Timing',
          confirmed: true,
          description: 'The outermost confirmed planet of the Lich system, continuously bathed in relativistic pulsar winds.'
        }
      ]
    },
    stellarStage: 'Neutron Star / Pulsar',
    lifespanEstimate: '> 10 Billion Years',
    futureFate: 'Cold Dead Neutron Star',
    fusionProcess: 'No Fusion — Relativistic Rotational Magnetic Energy',
    notableFacts: [
      'Host of the very first confirmed extrasolar planets in astronomical history, discovered in 1992 by Aleksander Wolszczan and Dale Frail.',
      'A rapidly spinning millisecond pulsar completing 160.8 rotations per second (period 6.22 milliseconds).',
      'The planets survived or re-condensed from the supernova debris disc of the exploded progenitor star.'
    ],
    description: 'The famous millisecond pulsar in Virgo that made astronomical history by hosting the first confirmed exoplanets.'
  }),

  // 82. PSR J1748-2446ad - Fastest Known Spinning Star (716 Hz)
  makeStar({
    id: 'psr-j1748-2446ad',
    name: 'PSR J1748-2446ad (Fastest Pulsar)',
    alternateNames: ['Terzan 5 ad', 'PSR J1748-2446', '716 Hz Pulsar'],
    constellation: 'Sagittarius',
    diameterKm: 20, // 20 km physical diameter
    temperature: 2000000,
    spectralType: 'Pulsar (716 Hz MSP)',
    spectralClass: 'NS',
    luminositySolar: 1200,
    massSolar: 1.4,
    estimatedAge: '~2.0 Billion Years',
    estimatedAgeMyr: 2000,
    metallicityFeH: 0.0,
    rotationalVelocityKmS: 70000,
    distanceLy: 18000,
    apparentMagnitude: 24.0,
    absoluteMagnitude: 10.2,
    surfaceGravityLogG: 14.2,
    colorHex: '#80e5ff',
    coronaColorHex: '#ccefff',
    solarEngulfment: 'Physical diameter is only ~20 km, spinning at an incredible 716 revolutions per second (~24% speed of light at equator)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 20, outer: 40 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Located deep in the core of globular cluster Terzan 5 in binary orbit with a low-mass companion star.',
      planets: []
    },
    stellarStage: 'Neutron Star / Pulsar',
    lifespanEstimate: '> 10 Billion Years',
    futureFate: 'Cold Dead Neutron Star',
    fusionProcess: 'No Fusion — Relativistic Rotational Magnetic Energy',
    notableFacts: [
      'The fastest-spinning star known in the universe, rotating 716 times per second (716 Hz, period 1.396 milliseconds).',
      'Its equator moves at roughly 70,000 km/s, which is nearly 24% of the speed of light.',
      'Centrifugal forces cause its equatorial radius to swell by ~10% despite extreme gravity.'
    ],
    description: 'The undisputed fastest-spinning star in the universe, rotating 716 times per second in the globular cluster Terzan 5.'
  }),

  // 83. SGR 1806-20 (Ultra-Magnetar)
  makeStar({
    id: 'sgr-1806-20',
    name: 'SGR 1806-20 (Ultra-Magnetar)',
    alternateNames: ['Soft Gamma Repeater 1806-20', 'Ultra-Magnetar', 'PSR J1808-2024'],
    constellation: 'Sagittarius',
    diameterKm: 20, // 20 km physical diameter
    temperature: 3500000,
    spectralType: 'Magnetar (SGR)',
    spectralClass: 'NS',
    luminositySolar: 100000,
    massSolar: 1.6,
    estimatedAge: '~10,000 Years',
    estimatedAgeMyr: 0.01,
    metallicityFeH: 0.0,
    rotationalVelocityKmS: 8.3,
    distanceLy: 47000,
    apparentMagnitude: 26.5,
    absoluteMagnitude: 5.6,
    surfaceGravityLogG: 14.5,
    colorHex: '#7df9ff',
    coronaColorHex: '#bbf7ff',
    solarEngulfment: 'Physical diameter is only ~20 km with the most powerful magnetic field in the universe (10¹⁵ Gauss / 100 Billion Tesla)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 250, outer: 400 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Extreme magnetar surrounded by a dense cluster of massive stars near the Galactic Center.',
      planets: []
    },
    stellarStage: 'Neutron Star / Pulsar',
    lifespanEstimate: '> 10 Billion Years',
    futureFate: 'Cold Dead Neutron Star',
    fusionProcess: 'No Fusion — Magnetic Field Decay & Crust Quakes',
    notableFacts: [
      'Possesses the strongest magnetic field known in nature (> 10¹⁵ Gauss / 10¹¹ Tesla), strong enough to dissolve atomic electron orbitals from 1,000 km away.',
      'On December 27, 2004, a mega-starquake on SGR 1806-20 released more energy in 0.1 seconds than the Sun generates in 150,000 years.',
      'The 2004 gamma-ray blast noticeably ionized Earth’s upper atmosphere from a distance of 47,000 light-years.'
    ],
    description: 'The record-holding ultra-magnetar in Sagittarius with a magnetic field strong enough to reshape atoms and trigger planet-scale starquakes.'
  }),

  // 84. Geminga (PSR J0633+1746) - Prototype Radio-Quiet Pulsar
  makeStar({
    id: 'geminga',
    name: 'Geminga (PSR J0633+1746)',
    alternateNames: ['PSR J0633+1746', '2CG 195+04', 'Gemini Gamma Source'],
    constellation: 'Gemini',
    diameterKm: 20, // 20 km physical diameter
    temperature: 560000,
    spectralType: 'Pulsar (Gamma)',
    spectralClass: 'NS',
    luminositySolar: 0.005,
    massSolar: 1.4,
    estimatedAge: '~340,000 Years',
    estimatedAgeMyr: 0.34,
    metallicityFeH: 0.0,
    rotationalVelocityKmS: 520,
    distanceLy: 815,
    apparentMagnitude: 25.5,
    absoluteMagnitude: 13.4,
    surfaceGravityLogG: 14.3,
    colorHex: '#a3e5ff',
    coronaColorHex: '#d1f3ff',
    solarEngulfment: 'Physical diameter is only ~20 km, emitting purely in gamma rays and X-rays while remaining completely invisible to radio telescopes!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.05, outer: 0.1 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Isolated radio-quiet neutron star generating high-energy pulsar wind halo in local interstellar space.',
      planets: []
    },
    stellarStage: 'Neutron Star / Pulsar',
    lifespanEstimate: '> 10 Billion Years',
    futureFate: 'Cold Dead Neutron Star',
    fusionProcess: 'No Fusion — Relativistic Rotational Magnetic Energy',
    notableFacts: [
      'The prototype of radio-quiet pulsars, shining intensely in gamma rays and X-rays but emitting virtually zero radio waves.',
      'One of the closest known neutron stars to Earth at just 815 light-years away in Gemini.',
      'Its name "Geminga" is a pun created by Italian astronomers from "Gemini gamma ray source" and Milanese dialect "gh\'è minga" ("it isn\'t there").'
    ],
    description: 'The famous nearby radio-quiet gamma-ray pulsar in Gemini, pulsing 4.2 times every second.'
  }),

  // 85. 40 Eridani B (Keid B) - First Discovered White Dwarf & Vulcan Homeworld
  makeStar({
    id: '40-eridani-b',
    name: '40 Eridani B (Keid B)',
    alternateNames: ['Keid B', 'Omicron2 Eridani B', 'EGGR 33', 'WD 0413-077'],
    bayerDesignation: 'ο² Eri B',
    constellation: 'Eridanus',
    diameterSolar: 0.014, // ~19,500 km, ~1.53 Earth diameters
    temperature: 16500,
    spectralType: 'DA4',
    spectralClass: 'WD',
    luminositySolar: 0.013,
    massSolar: 0.573,
    estimatedAge: '~5.0 Billion Years (120 Myr cooling age)',
    estimatedAgeMyr: 120,
    metallicityFeH: -0.1,
    rotationalVelocityKmS: 1.0,
    distanceLy: 16.3,
    apparentMagnitude: 9.52,
    absoluteMagnitude: 11.01,
    surfaceGravityLogG: 7.65,
    colorHex: '#d9ebff',
    coronaColorHex: '#f0f8ff',
    solarEngulfment: 'Extremely dense white dwarf remnant: diameter is 19,500 km (~1.53 Earth diameters)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.1, outer: 0.18 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Orbits 40 Eridani A alongside red dwarf companion 40 Eridani C (famous in sci-fi as the star system of planet Vulcan).',
      planets: []
    },
    stellarStage: 'White Dwarf',
    lifespanEstimate: '> 100 Trillion Years',
    futureFate: 'Black Dwarf',
    fusionProcess: 'No Fusion — Degenerate Electron Cooling',
    notableFacts: [
      'The first white dwarf star discovered in astronomical history (observed by William Herschel in 1783).',
      'Confirmed as an ultradense degenerate star in 1910 by Henry Norris Russell, Edward Pickering, and Williamina Fleming.',
      'Easily observable with amateur telescopes in the triple 40 Eridani system, designated by Gene Roddenberry as the star of planet Vulcan.'
    ],
    description: 'The historic first discovered white dwarf star in Eridanus, shining at 16,500 K in the famous 40 Eridani triple system.'
  }),

  // 86. Stein 2051 B - Hubble Einstein Gravitational Lensing Benchmark
  makeStar({
    id: 'stein-2051-b',
    name: 'Stein 2051 B',
    alternateNames: ['Gliese 169.1 B', 'WD 0426+588', 'EGGR 37'],
    constellation: 'Camelopardalis',
    diameterSolar: 0.0115, // ~16,000 km, ~1.26 Earth diameters
    temperature: 7120,
    spectralType: 'DC',
    spectralClass: 'WD',
    luminositySolar: 0.00032,
    massSolar: 0.675,
    estimatedAge: '~2.0 Billion Years (cooling age)',
    estimatedAgeMyr: 2000,
    metallicityFeH: 0.0,
    rotationalVelocityKmS: 1.0,
    distanceLy: 18.0,
    apparentMagnitude: 12.44,
    absoluteMagnitude: 13.73,
    surfaceGravityLogG: 8.16,
    colorHex: '#fff3dc',
    coronaColorHex: '#ffffff',
    solarEngulfment: 'Dense degenerate helium-envelope white dwarf: diameter is 16,000 km (~1.26 Earth diameters)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.015, outer: 0.028 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'White dwarf companion to red dwarf Stein 2051 A in a wide 300-year orbit.',
      planets: []
    },
    stellarStage: 'White Dwarf',
    lifespanEstimate: '> 100 Trillion Years',
    futureFate: 'Black Dwarf',
    fusionProcess: 'No Fusion — Degenerate Electron Cooling',
    notableFacts: [
      'In 2017, astronomers used the Hubble Space Telescope to measure the gravitational deflection of light caused by Stein 2051 B (first time Einstein’s deflection was measured for a star other than the Sun).',
      'The relativistic deflection measurement precisely confirmed Subrahmanyan Chandrasekhar’s 1930 Nobel Prize-winning white dwarf mass-radius theory.',
      'Possesses a featureless Class DC spectrum indicating a pure helium outer envelope.'
    ],
    description: 'A celebrated white dwarf in Camelopardalis whose gravitational deflection of background starlight proved Einstein and Chandrasekhar’s theories.'
  }),

  // 87. GD 358 (V777 Herculis) - Prototype Pulsating Helium White Dwarf
  makeStar({
    id: 'gd-358',
    name: 'GD 358 (V777 Herculis)',
    alternateNames: ['V777 Herculis', 'WD 1645+325', 'HIP 82138'],
    constellation: 'Hercules',
    diameterSolar: 0.013, // ~18,100 km, ~1.42 Earth diameters
    temperature: 24900,
    spectralType: 'DBV',
    spectralClass: 'WD',
    luminositySolar: 0.050,
    massSolar: 0.55,
    estimatedAge: '~50 Million Years (as White Dwarf)',
    estimatedAgeMyr: 50,
    metallicityFeH: 0.0,
    rotationalVelocityKmS: 1.0,
    distanceLy: 140,
    apparentMagnitude: 13.65,
    absoluteMagnitude: 10.5,
    surfaceGravityLogG: 7.90,
    colorHex: '#cce5ff',
    coronaColorHex: '#f0f8ff',
    solarEngulfment: 'Hot pulsating helium-rich white dwarf: diameter is 18,100 km (~1.42 Earth diameters)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.2, outer: 0.35 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Isolated pulsating white dwarf vibrating in multiple non-radial gravity modes.',
      planets: []
    },
    stellarStage: 'White Dwarf',
    lifespanEstimate: '> 100 Trillion Years',
    futureFate: 'Black Dwarf',
    fusionProcess: 'No Fusion — Degenerate Electron Asteroseismology Cooling',
    notableFacts: [
      'The prototype of DBV variable stars (V777 Herculis pulsating white dwarfs with helium-dominated atmospheres).',
      'Pulsates in dozens of non-radial gravity modes every 140 to 1,000 seconds, allowing asteroseismologists to map its internal carbon-oxygen core layers directly.',
      'Surface temperature of 24,900 K places it precisely in the helium partial ionization instability strip.'
    ],
    description: 'The prototype pulsating helium white dwarf in Hercules, vibrating with complex internal seismic acoustic waves.'
  }),

  // 88. Luhman 16 A - Closest Known Brown Dwarf System
  makeStar({
    id: 'luhman-16-a',
    name: 'Luhman 16 A',
    alternateNames: ['WISE J1049-5319 A', 'Luhman 16', 'Vela Brown Dwarf'],
    constellation: 'Vela',
    diameterSolar: 0.088, // ~122,500 km (~0.88 Jupiter diameters)
    temperature: 1350,
    spectralType: 'L7.5',
    spectralClass: 'L',
    luminositySolar: 0.000028,
    massSolar: 0.032, // 33.5 Jupiter masses
    estimatedAge: '~600 - 800 Million Years',
    estimatedAgeMyr: 700,
    metallicityFeH: 0.0,
    rotationalVelocityKmS: 17.6,
    distanceLy: 6.51,
    apparentMagnitude: 14.2,
    absoluteMagnitude: 17.7,
    surfaceGravityLogG: 5.28,
    colorHex: '#b33629',
    coronaColorHex: '#d9534f',
    solarEngulfment: 'Substellar brown dwarf with a diameter of ~122,500 km (comparable to Saturn and Jupiter)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.004, outer: 0.008 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Forms a binary brown dwarf pair with Luhman 16 B separated by ~3 AU in a 27-year orbit.',
      planets: []
    },
    stellarStage: 'Brown Dwarf',
    lifespanEstimate: '> 10 Trillion Years (Slow gravitational cooling)',
    futureFate: 'Cold Black Dwarf',
    fusionProcess: 'No Core Hydrogen Fusion (Deuterium burning exhausted)',
    notableFacts: [
      'The closest known brown dwarf system to Earth (6.51 light-years), and the third-closest star system overall after Alpha Centauri and Barnard’s Star.',
      'The first brown dwarf to have its atmospheric cloud weather mapped by the VLT, revealing patchy molten iron and silicate dust clouds.',
      'Possesses high-speed equatorial jet streams and violent planetary-scale storms.'
    ],
    description: 'The closest brown dwarf to the Solar System at just 6.5 light-years, famous for its mapped silicate cloud storms.'
  }),

  // 89. Gliese 229 B - First Undisputed Methane Brown Dwarf Discovered (1995)
  makeStar({
    id: 'gliese-229-b',
    name: 'Gliese 229 B',
    alternateNames: ['Gl 229 B', 'HD 42581 B', 'First Confirmed Brown Dwarf'],
    constellation: 'Lepus',
    diameterSolar: 0.090, // ~125,300 km (~0.90 Jupiter diameters)
    temperature: 950,
    spectralType: 'T7p',
    spectralClass: 'T',
    luminositySolar: 0.0000064,
    massSolar: 0.030, // 31.4 Jupiter masses
    estimatedAge: '~2.5 Billion Years',
    estimatedAgeMyr: 2500,
    metallicityFeH: -0.1,
    rotationalVelocityKmS: 25.0,
    distanceLy: 18.8,
    apparentMagnitude: 14.3,
    absoluteMagnitude: 15.5,
    surfaceGravityLogG: 5.1,
    colorHex: '#8c2463',
    coronaColorHex: '#b83280',
    solarEngulfment: 'Methane-rich Class T brown dwarf with a diameter of ~125,300 km (~0.90 Jupiter diameters)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.002, outer: 0.005 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Orbits red dwarf Gliese 229 A at a distance of ~35 AU (similar to Pluto’s distance from the Sun).',
      planets: []
    },
    stellarStage: 'Brown Dwarf',
    lifespanEstimate: '> 10 Trillion Years (Cooling)',
    futureFate: 'Cold Black Dwarf',
    fusionProcess: 'No Hydrogen Fusion — Radiating Primordial Gravitational Heat',
    notableFacts: [
      'The historic first undisputed brown dwarf discovered in human history (confirmed in 1995 by Palomar and Hubble).',
      'Defined the "Class T" spectral classification due to strong methane (CH₄) absorption bands in its cool atmosphere.',
      'Proved conclusively that substellar objects bridge the mass gap between gas giant planets and fusing stars.'
    ],
    description: 'The historic first undisputed brown dwarf discovered in 1995, defining the cool methane Class T category.'
  }),

  // 90. WISE 0855-0714 - Coldest Sub-stellar Object (Freezing Water-Ice Clouds)
  makeStar({
    id: 'wise-0855-0714',
    name: 'WISE 0855-0714 (Ice Dwarf)',
    alternateNames: ['WISE J085510.83-071442.5', 'Sub-Zero Brown Dwarf', 'Class Y Ice Dwarf'],
    constellation: 'Hydra',
    diameterSolar: 0.100, // ~139,270 km (~1.00 Jupiter diameter)
    temperature: 250, // -23°C / -10°F freezing temperature!
    spectralType: 'Y2',
    spectralClass: 'Y',
    luminositySolar: 0.000000002, // 2 × 10^-9 L_sun
    massSolar: 0.005, // ~5 Jupiter masses (3 - 10 M_J)
    estimatedAge: '~3.0 Billion Years',
    estimatedAgeMyr: 3000,
    metallicityFeH: 0.0,
    rotationalVelocityKmS: 30.0,
    distanceLy: 7.53,
    apparentMagnitude: 25.0,
    absoluteMagnitude: 28.2,
    surfaceGravityLogG: 4.5,
    colorHex: '#4a224a',
    coronaColorHex: '#7a3b7a',
    solarEngulfment: 'Freezing Class Y brown dwarf with a diameter of ~139,270 km (Jupiter-sized), featuring sub-zero water ice clouds at -23°C!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.0001, outer: 0.0003 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Solitary ultracool rogue substellar object drifting through local interstellar space.',
      planets: []
    },
    stellarStage: 'Brown Dwarf',
    lifespanEstimate: '> 10 Trillion Years (Cooling)',
    futureFate: 'Cold Black Dwarf',
    fusionProcess: 'No Fusion — Cold Planetary-Mass Degenerate Cooling',
    notableFacts: [
      'The coldest known star/substellar object outside the Solar System, with a freezing surface temperature of 250 K (-23°C / -10°F).',
      'The fourth-closest stellar-mass object to Earth at 7.53 light-years away in Hydra.',
      'Possesses genuine water ice clouds and sulfide clouds in its atmosphere, directly bridging the physics of stars and gas giant planets.'
    ],
    description: 'The coldest known brown dwarf in the galaxy at -23°C, featuring water-ice clouds just 7.5 light-years from Earth.'
  })
];
