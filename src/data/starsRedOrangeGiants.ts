import { StarData } from '../types';
import { makeStar } from './starHelper';

export const STARS_RED_ORANGE_GIANTS: StarData[] = [
  // 35. Aldebaran
  makeStar({
    id: 'aldebaran',
    name: 'Aldebaran',
    alternateNames: ['Alpha Tauri', 'Eye of Taurus', 'HD 29139', 'HIP 21421'],
    bayerDesignation: 'α Tau',
    constellation: 'Taurus',
    diameterSolar: 44.2,
    temperature: 3900,
    spectralType: 'K5III',
    spectralClass: 'K',
    luminositySolar: 439,
    massSolar: 1.16,
    estimatedAge: '~6.4 Billion Years',
    estimatedAgeMyr: 6400,
    metallicityFeH: -0.27,
    rotationalVelocityKmS: 3.5,
    distanceLy: 65.3,
    apparentMagnitude: 0.85,
    absoluteMagnitude: -0.63,
    surfaceGravityLogG: 1.2,
    colorHex: '#ff8833',
    coronaColorHex: '#ffb366',
    solarEngulfment: 'Engulfs Mercury and reaches halfway to Venus (~0.205 AU radius)!',
    engulfsPlanets: ['Mercury'],
    habitableZoneAU: { inner: 18.2, outer: 28.0 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 1,
      candidateCount: 0,
      systemOverview: 'Host to a confirmed jovian planet orbiting at 1.46 AU.',
      planets: [
        {
          name: 'Aldebaran b',
          type: 'Gas Giant (Super-Jupiter)',
          mass: '5.8 M_J',
          orbitalPeriodDays: 628.96,
          semiMajorAxisAU: 1.46,
          habitableZoneStatus: 'Too Hot',
          discoveryYear: 2015,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A massive gas giant orbiting deep inside what will eventually become the outer engulfment zone as Aldebaran expands.'
        }
      ]
    },
    stellarStage: 'Red Giant',
    lifespanEstimate: '~7.5 Billion Years',
    futureFate: 'Planetary Nebula / Carbon-Oxygen White Dwarf',
    fusionProcess: 'Hydrogen Shell Burning around Degenerate Helium Core',
    notableFacts: [
      'The fiery orange "Bull’s Eye" of Taurus, one of the 15 brightest stars in the night sky.',
      'Appears visually in front of the Hyades star cluster, but is actually twice as close to Earth.',
      'The Pioneer 10 space probe is currently coasting toward Aldebaran, expected to pass by in ~2 million years.'
    ],
    description: 'The glowing orange Eye of Taurus, an evolved red giant hosting a massive gas giant planet.'
  }),

  // 36. Arcturus
  makeStar({
    id: 'arcturus',
    name: 'Arcturus',
    alternateNames: ['Alpha Boötis', 'Guardian of the Bear', 'HD 124897', 'HIP 69673'],
    bayerDesignation: 'α Boo',
    constellation: 'Boötes',
    diameterSolar: 25.4,
    temperature: 4286,
    spectralType: 'K1III',
    spectralClass: 'K',
    luminositySolar: 170,
    massSolar: 1.08,
    estimatedAge: '~7.1 Billion Years',
    estimatedAgeMyr: 7100,
    metallicityFeH: -0.52,
    rotationalVelocityKmS: 2.4,
    distanceLy: 36.7,
    apparentMagnitude: -0.05,
    absoluteMagnitude: -0.30,
    surfaceGravityLogG: 1.66,
    colorHex: '#ff9933',
    coronaColorHex: '#ffbe66',
    solarEngulfment: 'Spans roughly 35.4 Million km (~0.236 AU diameter)!',
    engulfsPlanets: ['Mercury'],
    habitableZoneAU: { inner: 11.4, outer: 17.5 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'No confirmed exoplanets. Old galactic thick-disk star traveling through the solar neighborhood on a high-inclination orbit.',
      planets: []
    },
    stellarStage: 'Red Giant',
    lifespanEstimate: '~8.5 Billion Years',
    futureFate: 'Planetary Nebula / Helium Core Flash to White Dwarf',
    fusionProcess: 'Core Helium Fusion (Horizontal Branch Giant)',
    notableFacts: [
      'The brightest star in the northern celestial hemisphere and fourth-brightest in the entire night sky.',
      'A visitor from the galactic thick disk traveling at an astounding speed of 122 km/s relative to the Sun.',
      'Its light was famously focused by telescopes in 1933 to trigger the opening ceremonies of the Chicago World’s Fair.'
    ],
    description: 'The brilliant orange anchor of Boötes, a high-velocity ancient red giant dominating the northern spring sky.'
  }),

  // 37. Pollux
  makeStar({
    id: 'pollux',
    name: 'Pollux',
    alternateNames: ['Beta Geminorum', 'HD 62509', 'HIP 37826', 'HR 2990'],
    bayerDesignation: 'β Gem',
    constellation: 'Gemini',
    diameterSolar: 9.06,
    temperature: 4666,
    spectralType: 'K0III',
    spectralClass: 'K',
    luminositySolar: 32.7,
    massSolar: 1.91,
    estimatedAge: '~724 Million Years',
    estimatedAgeMyr: 724,
    metallicityFeH: 0.19,
    rotationalVelocityKmS: 2.8,
    distanceLy: 33.78,
    apparentMagnitude: 1.14,
    absoluteMagnitude: 1.08,
    surfaceGravityLogG: 2.57,
    colorHex: '#ffaa44',
    coronaColorHex: '#ffcc80',
    solarEngulfment: 'Spans roughly 12.6 Million km (~0.084 AU diameter)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 5.0, outer: 7.7 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 1,
      candidateCount: 0,
      systemOverview: 'Host to the confirmed giant exoplanet Thestias (Pollux b), the brightest known star hosting an exoplanet in the sky.',
      planets: [
        {
          name: 'Thestias (Pollux b)',
          type: 'Gas Giant (Jupiter-Analogue)',
          mass: '2.3 M_J',
          orbitalPeriodDays: 589.64,
          semiMajorAxisAU: 1.64,
          habitableZoneStatus: 'Inner Rim',
          discoveryYear: 2006,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'The closest known exoplanet orbiting a giant star, discovered via high-precision Doppler spectroscopy.'
        }
      ]
    },
    stellarStage: 'Red Giant',
    lifespanEstimate: '~1 Billion Years',
    futureFate: 'Planetary Nebula / Carbon-Oxygen White Dwarf',
    fusionProcess: 'Core Helium Fusion (Clump Giant)',
    notableFacts: [
      'The brightest star in Gemini, outshining its twin star Castor.',
      'The closest giant star to our Sun (only 33.8 light-years away).',
      'The exoplanet Thestias was formally named via the IAU NameExoWorlds campaign.'
    ],
    description: 'The golden twin of Gemini and closest giant star to the Sun, hosting the confirmed jovian planet Thestias.'
  }),

  // 38. Capella Aa
  makeStar({
    id: 'capella-aa',
    name: 'Capella Aa',
    alternateNames: ['Alpha Aurigae', 'Goat Star', 'HD 34029', 'HIP 24608'],
    bayerDesignation: 'α Aur',
    constellation: 'Auriga',
    diameterSolar: 11.98,
    temperature: 4970,
    spectralType: 'K0III',
    spectralClass: 'K',
    luminositySolar: 78.7,
    massSolar: 2.57,
    estimatedAge: '~600 Million Years',
    estimatedAgeMyr: 600,
    metallicityFeH: -0.1,
    rotationalVelocityKmS: 4.1,
    distanceLy: 42.9,
    apparentMagnitude: 0.08,
    absoluteMagnitude: 0.30,
    surfaceGravityLogG: 2.7,
    colorHex: '#ffc255',
    coronaColorHex: '#ffe099',
    solarEngulfment: 'Spans roughly 16.7 Million km (~0.11 AU diameter)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 7.7, outer: 11.9 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Quadruple star system dominated by two massive yellow giants (Capella Aa & Ab) orbiting each other every 104 days at ~0.74 AU separation.',
      planets: []
    },
    stellarStage: 'Bright Giant',
    lifespanEstimate: '~800 Million Years',
    futureFate: 'Planetary Nebula / Carbon-Oxygen White Dwarf',
    fusionProcess: 'Core Helium Burning (Red Clump Phase)',
    notableFacts: [
      'The sixth-brightest star in the night sky and the third-brightest in the northern celestial hemisphere.',
      'Capella is a quadruple system consisting of two yellow giants and two distant red dwarf companions.',
      'Emits strong X-rays originating from magnetic reconnection in its turbulent corona.'
    ],
    description: 'The golden primary star of the Capella quadruple system in Auriga, a luminous yellow giant.'
  }),

  // 39. Mira (Omicron Ceti)
  makeStar({
    id: 'mira-a',
    name: 'Mira (Omicron Ceti)',
    alternateNames: ['The Wonderful', 'HD 14386', 'HIP 10826', 'HR 681'],
    bayerDesignation: 'ο Cet',
    constellation: 'Cetus',
    diameterSolar: 370.0,
    temperature: 3000,
    spectralType: 'M7III',
    spectralClass: 'M',
    luminositySolar: 8400,
    massSolar: 1.18,
    estimatedAge: '~6.0 Billion Years',
    estimatedAgeMyr: 6000,
    metallicityFeH: -0.1,
    rotationalVelocityKmS: 3.0,
    distanceLy: 299,
    apparentMagnitude: 3.5, // Varies from 2.0 to 10.1!
    absoluteMagnitude: -0.9,
    surfaceGravityLogG: -0.5,
    colorHex: '#ff4818',
    coronaColorHex: '#ff7733',
    solarEngulfment: 'Engulfs Mercury, Venus, Earth, and reaches Mars (~1.72 AU radius)!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars'],
    habitableZoneAU: { inner: 80, outer: 125 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Famous pulsating prototype with a 13-light-year comet-like ultraviolet gas tail trailing behind it in interstellar space.',
      planets: []
    },
    stellarStage: 'Red Giant',
    lifespanEstimate: '< 10 Million Years Remaining',
    futureFate: 'Planetary Nebula / White Dwarf',
    fusionProcess: 'Asymptotic Giant Branch (AGB) Thermal Helium Pulses',
    notableFacts: [
      'The defining prototype of all "Mira variable" pulsating red giant stars, oscillating between magnitude 2 and 10 every 332 days.',
      'NASA’s GALEX telescope discovered a 13-light-year-long comet-like tail of ejected matter trailing behind Mira.',
      'Has a white dwarf companion (Mira B) that accretes gas shed from Mira’s pulsing atmosphere.'
    ],
    description: 'The archetype pulsating red giant in Cetus, dragging a 13-light-year glowing comet-like tail across the galaxy.'
  }),

  // 40. Rasalgethi
  makeStar({
    id: 'rasalgethi',
    name: 'Rasalgethi',
    alternateNames: ['Alpha Herculis', 'Head of the Kneeler', 'HD 156014', 'HIP 84345'],
    bayerDesignation: 'α Her',
    constellation: 'Hercules',
    diameterSolar: 284.0,
    temperature: 3280,
    spectralType: 'M5Ib',
    spectralClass: 'M',
    luminositySolar: 8300,
    massSolar: 2.5,
    estimatedAge: '~500 Million Years',
    estimatedAgeMyr: 500,
    metallicityFeH: 0.0,
    rotationalVelocityKmS: 8.0,
    distanceLy: 360,
    apparentMagnitude: 3.35,
    absoluteMagnitude: -2.3,
    surfaceGravityLogG: 0.0,
    colorHex: '#ff5020',
    coronaColorHex: '#ff8438',
    solarEngulfment: 'Engulfs Mercury, Venus, and Earth (~1.32 AU radius)!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth'],
    habitableZoneAU: { inner: 80, outer: 124 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Multiple star system embedded in an enormous circumstellar envelope created by Rasalgethi’s massive wind.',
      planets: []
    },
    stellarStage: 'Bright Giant',
    lifespanEstimate: '~600 Million Years',
    futureFate: 'Planetary Nebula / Carbon-Oxygen White Dwarf',
    fusionProcess: 'AGB Double-Shell Hydrogen & Helium Fusion',
    notableFacts: [
      'Name comes from the Arabic meaning "the head of the kneeler" (Hercules).',
      'An expansive red giant losing mass so rapidly that its outer gas shell envelops its companion stars hundreds of AU away.',
      'A magnificent telescopic double star with an orange-red primary and an emerald-tinted secondary.'
    ],
    description: 'The glowing red bright giant marking the head of Hercules, surrounded by a massive expanding stellar gas envelope.'
  }),

  // 41. Mirach
  makeStar({
    id: 'mirach',
    name: 'Mirach',
    alternateNames: ['Beta Andromedae', 'HD 6860', 'HIP 5447', 'HR 337'],
    bayerDesignation: 'β And',
    constellation: 'Andromeda',
    diameterSolar: 100.0,
    temperature: 3842,
    spectralType: 'M0III',
    spectralClass: 'M',
    luminositySolar: 1995,
    massSolar: 2.49,
    estimatedAge: '~1.1 Billion Years',
    estimatedAgeMyr: 1100,
    metallicityFeH: -0.04,
    rotationalVelocityKmS: 5.0,
    distanceLy: 197,
    apparentMagnitude: 2.07,
    absoluteMagnitude: -1.86,
    surfaceGravityLogG: 1.0,
    colorHex: '#ff7728',
    coronaColorHex: '#ffaa55',
    solarEngulfment: 'Engulfs Mercury and reaches halfway to Venus (~0.465 AU radius)!',
    engulfsPlanets: ['Mercury'],
    habitableZoneAU: { inner: 39, outer: 60 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'No known exoplanets. Famous for "Mirach’s Ghost" (NGC 404), a dwarf lenticular galaxy appearing just 7 arcminutes away.',
      planets: []
    },
    stellarStage: 'Red Giant',
    lifespanEstimate: '~1.5 Billion Years',
    futureFate: 'Planetary Nebula / Carbon-Oxygen White Dwarf',
    fusionProcess: 'Shell Hydrogen Fusion on the Red Giant Branch',
    notableFacts: [
      'Famous in observational astronomy as the guidepost for locating both the Andromeda Galaxy (M31) and the Triangulum Galaxy (M33).',
      'The faint dwarf galaxy NGC 404 sits so close to Mirach in the line of sight that it is affectionately called "Mirach’s Ghost".',
      'Shines with nearly 2,000 times the brightness of the Sun.'
    ],
    description: 'A prominent red giant in Andromeda, serving as the celestial guide to the Andromeda Galaxy and hosting Mirach’s Ghost.'
  }),

  // 42. Hamal
  makeStar({
    id: 'hamal',
    name: 'Hamal',
    alternateNames: ['Alpha Arietis', 'HD 12929', 'HIP 9884', 'HR 617'],
    bayerDesignation: 'α Ari',
    constellation: 'Aries',
    diameterSolar: 14.9,
    temperature: 4480,
    spectralType: 'K2III',
    spectralClass: 'K',
    luminositySolar: 91.0,
    massSolar: 1.5,
    estimatedAge: '~3.4 Billion Years',
    estimatedAgeMyr: 3400,
    metallicityFeH: -0.25,
    rotationalVelocityKmS: 3.4,
    distanceLy: 65.8,
    apparentMagnitude: 2.01,
    absoluteMagnitude: 0.48,
    surfaceGravityLogG: 2.5,
    colorHex: '#ff9933',
    coronaColorHex: '#ffcc66',
    solarEngulfment: 'Spans roughly 20.7 Million km (~0.138 AU diameter)!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 8.3, outer: 12.8 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 1,
      candidateCount: 0,
      systemOverview: 'Hosts a confirmed gas giant exoplanet in a 380-day orbit.',
      planets: [
        {
          name: 'Hamal b (Alpha Arietis b)',
          type: 'Gas Giant (Super-Jupiter)',
          mass: '1.8 M_J',
          orbitalPeriodDays: 380.8,
          semiMajorAxisAU: 1.2,
          habitableZoneStatus: 'Inner Rim',
          discoveryYear: 2011,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A massive Jovian exoplanet discovered via radial velocity variations in Hamal’s red giant spectrum.'
        }
      ]
    },
    stellarStage: 'Red Giant',
    lifespanEstimate: '~4 Billion Years',
    futureFate: 'Planetary Nebula / White Dwarf',
    fusionProcess: 'Core Helium Fusion (Red Clump)',
    notableFacts: [
      'The brightest star in the constellation Aries.',
      'From 2000 to 100 BCE, Hamal marked the vernal equinox, leading to Aries being called the "First Point of Aries".',
      'Hosts a massive gas giant planet orbiting at 1.2 AU.'
    ],
    description: 'The brightest star in Aries, an orange giant historically associated with the vernal equinox.'
  }),

  // 43. Dubhe
  makeStar({
    id: 'dubhe',
    name: 'Dubhe',
    alternateNames: ['Alpha Ursae Majoris', 'HD 95689', 'HIP 54061', 'HR 4301'],
    bayerDesignation: 'α UMa',
    constellation: 'Ursa Major',
    diameterSolar: 30.0,
    temperature: 4660,
    spectralType: 'K0III',
    spectralClass: 'K',
    luminositySolar: 316,
    massSolar: 3.44,
    estimatedAge: '~280 Million Years',
    estimatedAgeMyr: 280,
    metallicityFeH: -0.2,
    rotationalVelocityKmS: 2.6,
    distanceLy: 123,
    apparentMagnitude: 1.79,
    absoluteMagnitude: -1.1,
    surfaceGravityLogG: 2.1,
    colorHex: '#ffaa33',
    coronaColorHex: '#ffdd77',
    solarEngulfment: 'Spans roughly 41.8 Million km (~0.279 AU diameter)!',
    engulfsPlanets: ['Mercury'],
    habitableZoneAU: { inner: 15.6, outer: 24.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Spectroscopic binary star system with a companion F-type main sequence dwarf orbiting every 44.4 years.',
      planets: []
    },
    stellarStage: 'Red Giant',
    lifespanEstimate: '~350 Million Years',
    futureFate: 'Planetary Nebula / White Dwarf',
    fusionProcess: 'Core Helium Fusion (Horizontal Branch)',
    notableFacts: [
      'The northern "Pointer Star" of the Big Dipper used to locate Polaris (the North Star).',
      'Unlike most other stars in the Big Dipper, Dubhe is NOT part of the Ursa Major Moving Group.',
      'Possesses a golden-orange glow visible in clear northern skies.'
    ],
    description: 'The famous northern pointer star of the Big Dipper in Ursa Major, guiding the eye directly to the North Star.'
  }),

  // 44. Kochab
  makeStar({
    id: 'kochab',
    name: 'Kochab',
    alternateNames: ['Beta Ursae Minoris', 'Guardian of the Pole', 'HD 131873', 'HIP 72607'],
    bayerDesignation: 'β UMi',
    constellation: 'Ursa Minor',
    diameterSolar: 42.0,
    temperature: 4030,
    spectralType: 'K4III',
    spectralClass: 'K',
    luminositySolar: 390,
    massSolar: 2.2,
    estimatedAge: '~2.95 Billion Years',
    estimatedAgeMyr: 2950,
    metallicityFeH: -0.15,
    rotationalVelocityKmS: 1.9,
    distanceLy: 130.9,
    apparentMagnitude: 2.08,
    absoluteMagnitude: -0.87,
    surfaceGravityLogG: 1.8,
    colorHex: '#ff9030',
    coronaColorHex: '#ffc060',
    solarEngulfment: 'Engulfs Mercury (~0.195 AU radius)!',
    engulfsPlanets: ['Mercury'],
    habitableZoneAU: { inner: 17.3, outer: 26.5 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 1,
      candidateCount: 0,
      systemOverview: 'Hosts a massive gas giant planet in a 522-day orbit.',
      planets: [
        {
          name: 'Kochab b',
          type: 'Gas Giant (Super-Jupiter)',
          mass: '6.1 M_J',
          orbitalPeriodDays: 522.3,
          semiMajorAxisAU: 1.4,
          habitableZoneStatus: 'Inner Rim',
          discoveryYear: 2014,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A massive 6.1 Jupiter-mass gas giant discovered orbiting this ancient red giant.'
        }
      ]
    },
    stellarStage: 'Red Giant',
    lifespanEstimate: '~3.5 Billion Years',
    futureFate: 'Planetary Nebula / Carbon-Oxygen White Dwarf',
    fusionProcess: 'Core Helium Fusion (Horizontal Branch Clump)',
    notableFacts: [
      'Served as the northern celestial pole star from approximately 1500 BCE to 500 CE.',
      'Known as the "Guardian of the Pole" along with its companion Pherkad in the Little Dipper.',
      'Hosts a massive exoplanet over 6 times more massive than Jupiter.'
    ],
    description: 'The former celestial pole star in Ursa Minor, an orange giant hosting a super-Jupiter exoplanet.'
  })
];
