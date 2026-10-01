import { StarData } from '../types';
import { makeStar } from './starHelper';

export const STARS_LUMINOUS_GIANTS: StarData[] = [
  // 81. Ruby Star (119 Tauri / CE Tauri)
  makeStar({
    id: 'ruby-star',
    name: 'Ruby Star (119 Tauri)',
    alternateNames: ['CE Tauri', 'HD 36389', 'HR 1845', 'HIP 25945'],
    constellation: 'Taurus',
    diameterSolar: 590, // ~821 Million km (~5.49 AU)
    temperature: 3405,
    spectralType: 'M2Ia',
    spectralClass: 'M',
    luminositySolar: 43000,
    massSolar: 14.4,
    estimatedAge: '~30 Million Years',
    estimatedAgeMyr: 30,
    lifespanEstimate: '~35 Million Years',
    distanceLy: 1800,
    apparentMagnitude: 4.32,
    absoluteMagnitude: -4.4,
    rotationalVelocityKmS: 6.0,
    metallicityFeH: 0.1,
    surfaceGravityLogG: -0.1,
    colorHex: '#ff4722',
    coronaColorHex: '#ff8855',
    solarEngulfment: 'Spans ~821.7 Million km (~5.49 AU diameter), completely engulfing Mercury, Venus, Earth, Mars, the Asteroid Belt, and Jupiter!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'],
    habitableZoneAU: { inner: 165, outer: 260 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Evolved pulsating red supergiant; intense stellar winds have stripped any inner planetary atmosphere.',
      planets: []
    },
    stellarStage: 'Red Supergiant',
    futureFate: 'Core-Collapse Supernova (Type II-P) leaving a Neutron Star',
    fusionProcess: 'Core Helium Fusion (Triple-Alpha) & Shell Hydrogen Burning',
    notableFacts: [
      'One of the reddest naked-eye stars visible in the night sky, second only to the Garnet Star (Mu Cephei).',
      'If placed at the center of the Solar System, its fiery churning surface would reach past the orbit of Jupiter.',
      'Semiregular variable with multiple pulsation modes fluctuating in visual brightness by nearly a full magnitude over ~165 days.'
    ],
    description: 'A colossal, intensely ruby-colored pulsating red supergiant in Taurus spanning nearly 600 times the diameter of the Sun.'
  }),

  // 82. V838 Monocerotis
  makeStar({
    id: 'v838-monocerotis',
    name: 'V838 Monocerotis (Luminous Red Nova)',
    alternateNames: ['Nova Monocerotis 2002', 'IRAS 07015-0346', '2MASS J07040483-0350511'],
    constellation: 'Monoceros',
    diameterSolar: 750, // ~1,044 Million km (~6.98 AU) expanded cool envelope
    temperature: 3270,
    spectralType: 'M6Ia',
    spectralClass: 'M',
    luminositySolar: 15000,
    massSolar: 8.0,
    estimatedAge: '~4 Million Years',
    estimatedAgeMyr: 4,
    lifespanEstimate: '~10 Million Years',
    distanceLy: 20000,
    apparentMagnitude: 15.5,
    absoluteMagnitude: -1.5,
    rotationalVelocityKmS: 15.0,
    metallicityFeH: 0.0,
    surfaceGravityLogG: -0.4,
    colorHex: '#ff4c1a',
    coronaColorHex: '#ffa066',
    solarEngulfment: 'Spans ~1.04 Billion km (~6.98 AU diameter), completely engulfing Mercury, Venus, Earth, Mars, the Asteroid Belt, and Jupiter!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'],
    habitableZoneAU: { inner: 95, outer: 160 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Site of a violent stellar merger; engulfed its own inner companions and surrounded by dense dust shells.',
      planets: []
    },
    stellarStage: 'Red Supergiant',
    futureFate: 'Pulsational Mass Loss leading to Supernova or Massive White Dwarf',
    fusionProcess: 'Envelope Hydrogen Burning on Helium/Carbon Merged Core',
    notableFacts: [
      'In January 2002, this star suddenly flared 600,000 times brighter than the Sun during a rare stellar merger (Luminous Red Nova).',
      'The Hubble Space Telescope captured famous time-lapse imagery of a spectacular "light echo" illuminating surrounding interstellar dust sheets.',
      'Expanded into one of the coolest and physically largest red supergiant envelopes known, with an outer atmosphere dropping into L-type spectral temperatures.'
    ],
    description: 'The famous 2002 Luminous Red Nova in Monoceros whose expanding flash illuminated surrounding cosmic dust shells.'
  }),

  // 83. V382 Carinae (x Carinae)
  makeStar({
    id: 'v382-carinae',
    name: 'V382 Carinae (x Carinae)',
    alternateNames: ['x Carinae', 'HD 96918', 'HR 4337', 'HIP 54397'],
    constellation: 'Carina',
    diameterSolar: 485, // ~675 Million km (~4.51 AU)
    temperature: 5800,
    spectralType: 'G0Ia+',
    spectralClass: 'G',
    luminositySolar: 212000,
    massSolar: 20.0,
    estimatedAge: '~8 Million Years',
    estimatedAgeMyr: 8,
    lifespanEstimate: '~9 Million Years',
    distanceLy: 8900,
    apparentMagnitude: 3.93,
    absoluteMagnitude: -7.5,
    rotationalVelocityKmS: 18.0,
    metallicityFeH: 0.05,
    surfaceGravityLogG: 0.4,
    colorHex: '#ffe680',
    coronaColorHex: '#fff4b8',
    solarEngulfment: 'Spans ~675.4 Million km (~4.51 AU diameter), completely engulfing Mercury, Venus, Earth, Mars, and the Asteroid Belt!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars'],
    habitableZoneAU: { inner: 370, outer: 580 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Extremely rare yellow hypergiant with massive stellar wind outflows.',
      planets: []
    },
    stellarStage: 'Yellow Supergiant',
    futureFate: 'Hypernova / Pair-Instability Supernova leaving a Black Hole',
    fusionProcess: 'Advanced Shell Helium/Carbon Fusion',
    notableFacts: [
      'One of the rarest stars in the universe: only around a dozen Yellow Hypergiants are known in the entire Milky Way.',
      'Shines with the staggering brilliance of over 212,000 Suns from within the Carina OB2 stellar association.',
      'Pulsates with semiregular fluctuations and ejects enormous clouds of atmospheric gas at hundreds of kilometers per second.'
    ],
    description: 'A luminous and rare yellow hypergiant in Carina blazing with over 200,000 solar luminosities.'
  }),

  // 84. V509 Cassiopeiae (HR 8752)
  makeStar({
    id: 'v509-cassiopeiae',
    name: 'V509 Cassiopeiae (HR 8752)',
    alternateNames: ['HR 8752', 'HD 217476', 'HIP 113561'],
    constellation: 'Cassiopeia',
    diameterSolar: 650, // ~905 Million km (~6.05 AU)
    temperature: 5200,
    spectralType: 'G0Ia+',
    spectralClass: 'G',
    luminositySolar: 260000,
    massSolar: 25.0,
    estimatedAge: '~6.5 Million Years',
    estimatedAgeMyr: 6.5,
    lifespanEstimate: '~7.5 Million Years',
    distanceLy: 4500,
    apparentMagnitude: 5.1,
    absoluteMagnitude: -7.8,
    rotationalVelocityKmS: 20.0,
    metallicityFeH: 0.15,
    surfaceGravityLogG: 0.1,
    colorHex: '#ffdb70',
    coronaColorHex: '#fffaad',
    solarEngulfment: 'Spans ~905.2 Million km (~6.05 AU diameter), completely engulfing Mercury, Venus, Earth, Mars, the Asteroid Belt, and Jupiter!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'],
    habitableZoneAU: { inner: 410, outer: 640 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Hypergiant in the Yellow Evolutionary Void, rapidly shedding its outer envelope.',
      planets: []
    },
    stellarStage: 'Yellow Supergiant',
    futureFate: 'Type IIb/Ib Supernova or Direct Collapse to Black Hole',
    fusionProcess: 'Core Helium Fusion with Intense Shell Burning',
    notableFacts: [
      'Currently traversing the unstable "Yellow Evolutionary Void" where dynamic atmospheric pulsations drive immense mass loss.',
      'Between 1970 and 2000, astronomers watched its surface temperature surge by over 1,500 Kelvin as its outer envelope expanded and shed mass.',
      'Possesses a hot B-type companion star orbiting within the outer reaches of its circumstellar gas shell.'
    ],
    description: 'An unstable pulsating yellow hypergiant in Cassiopeia rapidly crossing the Yellow Evolutionary Void.'
  }),

  // 85. Cygnus OB2-12
  makeStar({
    id: 'cygnus-ob2-12',
    name: 'Cygnus OB2-12',
    alternateNames: ['VI Cygni 12', 'Schulte 12', '2MASS J20324096+4114292'],
    constellation: 'Cygnus',
    diameterSolar: 246, // ~342 Million km (~2.29 AU)
    temperature: 13700,
    spectralType: 'LBV / B3Ia+',
    spectralClass: 'LBV',
    luminositySolar: 1660000,
    massSolar: 110.0,
    estimatedAge: '~2.5 Million Years',
    estimatedAgeMyr: 2.5,
    lifespanEstimate: '~3 Million Years',
    distanceLy: 5200,
    apparentMagnitude: 11.4, // Heavily dimmed by ~10 magnitudes of interstellar dust extinction!
    absoluteMagnitude: -9.8,
    rotationalVelocityKmS: 65.0,
    metallicityFeH: 0.1,
    surfaceGravityLogG: 1.7,
    colorHex: '#99c8ff',
    coronaColorHex: '#d0e6ff',
    solarEngulfment: 'Spans ~342.6 Million km (~2.29 AU diameter), completely engulfing Mercury, Venus, Earth, and Mars!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars'],
    habitableZoneAU: { inner: 1050, outer: 1620 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Monster luminous blue hypergiant in the heart of the Cygnus OB2 stellar association.',
      planets: []
    },
    stellarStage: 'Luminous Blue Variable',
    futureFate: 'Hypernova / Gamma-Ray Burst producing a massive Black Hole',
    fusionProcess: 'Core CNO Hydrogen Burning with Convective Core Overshoot',
    notableFacts: [
      'One of the most intrinsically luminous stars known in the Milky Way, radiating at 1.66 million times the power of our Sun.',
      'Heavily obscured by the Great Cygnus Rift dust clouds: without interstellar extinction, it would blaze as a brilliant magnitude 1.5 beacon to the naked eye.',
      'Has an initial birth mass estimated above 110 solar masses, driving powerful stellar winds that blow off a solar mass every few thousand years.'
    ],
    description: 'One of the most luminous blue hypergiants in the Milky Way, hidden behind the dusty veil of the Cygnus Rift.'
  }),

  // 86. HDE 226868 (Cygnus X-1 Donor)
  makeStar({
    id: 'hde-226868',
    name: 'HDE 226868 (Cygnus X-1 Donor)',
    alternateNames: ['V1357 Cygni', 'HIP 98298', 'BD+34 3815'],
    constellation: 'Cygnus',
    diameterSolar: 34, // ~47.3 Million km (~0.316 AU)
    temperature: 30500,
    spectralType: 'O9Ia',
    spectralClass: 'O',
    luminositySolar: 200000,
    massSolar: 21.2,
    estimatedAge: '~5 Million Years',
    estimatedAgeMyr: 5,
    lifespanEstimate: '~6.5 Million Years',
    distanceLy: 7300,
    apparentMagnitude: 8.95,
    absoluteMagnitude: -6.5,
    rotationalVelocityKmS: 95.0,
    metallicityFeH: 0.05,
    surfaceGravityLogG: 3.3,
    colorHex: '#70a8ff',
    coronaColorHex: '#b3d4ff',
    solarEngulfment: 'Spans ~47.3 Million km (~0.316 AU diameter), engulfing Mercury at its perihelion with tidal distortion toward Cygnus X-1!',
    engulfsPlanets: ['Mercury'],
    habitableZoneAU: { inner: 360, outer: 560 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'In a 5.6-day mutual orbit with Cygnus X-1, the first confirmed 21-solar-mass stellar-mass black hole.',
      planets: []
    },
    stellarStage: 'Blue Supergiant',
    futureFate: 'Core-Collapse Supernova leaving a Second Black Hole (Binary Black Hole Merger)',
    fusionProcess: 'Core CNO Hydrogen Fusion with Tidal Gravitational Stripping',
    notableFacts: [
      'The optical stellar companion to Cygnus X-1, the historic first confirmed black hole candidate discovered in astronomy.',
      'Orbits a 21.2-solar-mass black hole every 5.6 days at a distance of only 0.2 AU, warped into a teardrop shape by extreme tidal gravitational pull.',
      'Its ferocious solar wind is captured into an incandescent accretion disk swirling around the black hole at relativistic velocities.'
    ],
    description: 'The high-mass blue supergiant orbiting and feeding the famous Cygnus X-1 stellar-mass black hole.'
  }),

  // 87. VV Cephei A
  makeStar({
    id: 'vv-cephei-a',
    name: 'VV Cephei A',
    alternateNames: ['HD 208816', 'HR 8383', 'HIP 108317'],
    constellation: 'Cepheus',
    diameterSolar: 1050, // ~1,462 Million km (~9.77 AU)
    temperature: 3826,
    spectralType: 'M2Ia+',
    spectralClass: 'M',
    luminositySolar: 200000,
    massSolar: 18.2,
    estimatedAge: '~10 Million Years',
    estimatedAgeMyr: 10,
    lifespanEstimate: '~12 Million Years',
    distanceLy: 4900,
    apparentMagnitude: 4.91,
    absoluteMagnitude: -7.0,
    rotationalVelocityKmS: 10.0,
    metallicityFeH: 0.0,
    surfaceGravityLogG: -0.4,
    colorHex: '#ff521a',
    coronaColorHex: '#ffa366',
    solarEngulfment: 'Spans ~1.46 Billion km (~9.77 AU diameter), completely engulfing Mercury, Venus, Earth, Mars, Jupiter, and Saturn!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn'],
    habitableZoneAU: { inner: 350, outer: 550 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Interacting eclipsing binary with a 20.3-year orbit around a blue main-sequence companion (VV Cephei B).',
      planets: []
    },
    stellarStage: 'Red Hypergiant',
    futureFate: 'Type II Supernova creating a Neutron Star or Black Hole',
    fusionProcess: 'Shell Helium & Core Carbon Fusion',
    notableFacts: [
      'One of the largest known stars in our galaxy: its radius would comfortably swallow the orbit of Saturn.',
      'Locked in a 20.35-year mutual orbital dance with a hot blue B-type star, which eclipses behind this red giant for over 650 days during each cycle.',
      'Fills its Roche lobe gravitational boundary, actively spilling atmospheric gas across an accretion bridge onto its companion.'
    ],
    description: 'A colossal red hypergiant eclipsing binary in Cepheus with a diameter large enough to reach Saturn.'
  }),

  // 88. RW Cephei
  makeStar({
    id: 'rw-cephei',
    name: 'RW Cephei',
    alternateNames: ['HD 212493', 'HR 8534', 'HIP 110504', 'BD+55 2737'],
    constellation: 'Cepheus',
    diameterSolar: 1150, // ~1,601 Million km (~10.7 AU)
    temperature: 3750,
    spectralType: 'K0Ia+',
    spectralClass: 'K',
    luminositySolar: 300000,
    massSolar: 20.0,
    estimatedAge: '~10 Million Years',
    estimatedAgeMyr: 10,
    lifespanEstimate: '~11.5 Million Years',
    distanceLy: 11000,
    apparentMagnitude: 6.65,
    absoluteMagnitude: -8.0,
    rotationalVelocityKmS: 9.0,
    metallicityFeH: 0.05,
    surfaceGravityLogG: -0.3,
    colorHex: '#ff7728',
    coronaColorHex: '#ffbb66',
    solarEngulfment: 'Spans ~1.60 Billion km (~10.7 AU diameter), completely engulfing Mercury, Venus, Earth, Mars, Jupiter, and Saturn!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn'],
    habitableZoneAU: { inner: 450, outer: 700 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Colossal hypergiant subject to immense episodic mass-ejections and dusty dimming cycles.',
      planets: []
    },
    stellarStage: 'Red Hypergiant',
    futureFate: 'Core-Collapse Supernova (Type II) or Direct Collapse to Black Hole',
    fusionProcess: 'Advanced Shell Helium/Carbon Fusion on an Inert Degenerate Core',
    notableFacts: [
      'One of the physically largest stars visible in the northern sky, with a radius reaching past the orbit of Jupiter and near Saturn.',
      'In 2020-2022, astronomers recorded a historic "Great Dimming" event similar to Betelgeuse, caused by a massive surface convective blowout and dust ejection.',
      'One of the most luminous hypergiants in the Cepheus OB1 association, radiating at ~300,000 solar luminosities.'
    ],
    description: 'A colossal orange-red hypergiant in Cepheus spanning over 1,100 solar diameters and subject to Great Dimming events.'
  }),

  // 89. IRC +10420 (V1302 Aquilae)
  makeStar({
    id: 'irc-10420',
    name: 'IRC +10420 (V1302 Aquilae)',
    alternateNames: ['V1302 Aquilae', 'IRAS 19244+1115', '2MASS J19264808+1121168'],
    constellation: 'Aquila',
    diameterSolar: 450, // ~626 Million km (~4.19 AU)
    temperature: 6000,
    spectralType: 'F8Ia+',
    spectralClass: 'F',
    luminositySolar: 500000,
    massSolar: 35.0,
    estimatedAge: '~4.5 Million Years',
    estimatedAgeMyr: 4.5,
    lifespanEstimate: '~5 Million Years',
    distanceLy: 13000,
    apparentMagnitude: 11.1,
    absoluteMagnitude: -8.8,
    rotationalVelocityKmS: 32.0,
    metallicityFeH: 0.1,
    surfaceGravityLogG: 0.3,
    colorHex: '#fff2b2',
    coronaColorHex: '#fffae0',
    solarEngulfment: 'Spans ~626.7 Million km (~4.19 AU diameter), completely engulfing Mercury, Venus, Earth, Mars, and the Asteroid Belt!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars'],
    habitableZoneAU: { inner: 560, outer: 880 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Transitional post-red supergiant surrounded by a complex reflection nebula.',
      planets: []
    },
    stellarStage: 'Yellow Supergiant',
    futureFate: 'Hypernova or Direct Collapse to a Black Hole',
    fusionProcess: 'Advanced Shell Burning surrounded by violent mass ejections',
    notableFacts: [
      'Astronomers have observed this star warming up rapidly in real time, jumping from spectral type F8 to early A-type over just a few decades.',
      'Surrounded by an intricate bipolar reflection nebula sculpted by episodic supersonic mass ejection bursts.',
      'Shines with 500,000 times solar luminosity, placing it near the theoretical empirical Humphreys-Davidson luminosity limit.'
    ],
    description: 'An extreme transitional yellow hypergiant in Aquila shedding its outer mantle into a complex nebula.'
  }),

  // 90. S Persei
  makeStar({
    id: 's-persei',
    name: 'S Persei',
    alternateNames: ['HD 14528', 'HR 683', 'HIP 11093'],
    constellation: 'Perseus',
    diameterSolar: 780, // ~1,086 Million km (~7.26 AU)
    temperature: 3500,
    spectralType: 'M3Ia',
    spectralClass: 'M',
    luminositySolar: 110000,
    massSolar: 19.0,
    estimatedAge: '~12 Million Years',
    estimatedAgeMyr: 12,
    lifespanEstimate: '~13.5 Million Years',
    distanceLy: 7900,
    apparentMagnitude: 8.5,
    absoluteMagnitude: -6.4,
    rotationalVelocityKmS: 5.0,
    metallicityFeH: 0.05,
    surfaceGravityLogG: -0.3,
    colorHex: '#ff471a',
    coronaColorHex: '#ff9955',
    solarEngulfment: 'Spans ~1.08 Billion km (~7.26 AU diameter), completely engulfing Mercury, Venus, Earth, Mars, the Asteroid Belt, and Jupiter!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'],
    habitableZoneAU: { inner: 260, outer: 410 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Pulsating member of the Perseus OB1 association with concentric circumstellar maser rings.',
      planets: []
    },
    stellarStage: 'Red Supergiant',
    futureFate: 'Type II-P Supernova creating a Neutron Star',
    fusionProcess: 'Core Helium Burning with Shell Hydrogen Burning',
    notableFacts: [
      'Prominent red supergiant member of the famous Double Cluster in Perseus (NGC 869 / NGC 884).',
      'Surrounded by a double-shell envelope of natural water, hydroxyl, and silicon monoxide cosmic masers.',
      'Displays a complex double pulsation period with cycles of ~822 days and ~968 days.'
    ],
    description: 'A pulsating red supergiant in the Double Cluster in Perseus surrounded by natural cosmic maser rings.'
  }),

  // 91. T Cephei
  makeStar({
    id: 't-cephei',
    name: 'T Cephei',
    alternateNames: ['HD 202012', 'HR 8113', 'HIP 104451'],
    constellation: 'Cepheus',
    diameterSolar: 330, // ~459 Million km (~3.07 AU)
    temperature: 3050,
    spectralType: 'M6III',
    spectralClass: 'M',
    luminositySolar: 7500,
    massSolar: 2.5,
    estimatedAge: '~900 Million Years',
    estimatedAgeMyr: 900,
    lifespanEstimate: '~1.2 Billion Years',
    distanceLy: 610,
    apparentMagnitude: 5.2, // Varies between 5.2 and 11.3!
    absoluteMagnitude: -1.7,
    rotationalVelocityKmS: 3.5,
    metallicityFeH: -0.1,
    surfaceGravityLogG: -0.2,
    colorHex: '#ff4015',
    coronaColorHex: '#ff8d50',
    solarEngulfment: 'Spans ~459.6 Million km (~3.07 AU diameter), completely engulfing Mercury, Venus, Earth, and Mars!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars'],
    habitableZoneAU: { inner: 70, outer: 110 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Evolved AGB pulsating Mira variable with deep atmospheric convective cells.',
      planets: []
    },
    stellarStage: 'Red Giant',
    futureFate: 'Planetary Nebula ejection leaving an Oxygen-Neon White Dwarf',
    fusionProcess: 'Thermal Pulsing Helium Shell Burning',
    notableFacts: [
      'A brilliant Mira-type red giant variable whose visual brightness changes by more than 200-fold over its 388-day pulsation cycle.',
      'As it pulses, its physical radius breathes in and out by over 50 million kilometers.',
      'One of the closest and brightest Mira variables in the northern circumpolar sky.'
    ],
    description: 'A luminous pulsating Mira-type red giant in Cepheus whose size oscillates dramatically over a 388-day cycle.'
  }),

  // 92. Enif (Epsilon Pegasi)
  makeStar({
    id: 'enif',
    name: 'Enif (Epsilon Pegasi)',
    alternateNames: ['Epsilon Pegasi', '8 Pegasi', 'HD 206778', 'HR 8308', 'HIP 107315'],
    constellation: 'Pegasus',
    diameterSolar: 185, // ~257 Million km (~1.72 AU)
    temperature: 4379,
    spectralType: 'K2Ib',
    spectralClass: 'K',
    luminositySolar: 6700,
    massSolar: 10.5,
    estimatedAge: '~20 Million Years',
    estimatedAgeMyr: 20,
    lifespanEstimate: '~25 Million Years',
    distanceLy: 690,
    apparentMagnitude: 2.39,
    absoluteMagnitude: -4.14,
    rotationalVelocityKmS: 8.0,
    metallicityFeH: -0.05,
    surfaceGravityLogG: 1.0,
    colorHex: '#ff9e3b',
    coronaColorHex: '#ffd080',
    solarEngulfment: 'Spans ~257.6 Million km (~1.72 AU diameter), completely engulfing Mercury, Venus, Earth, and Mars!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars'],
    habitableZoneAU: { inner: 65, outer: 100 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Isolated orange supergiant marking the nose of Pegasus the Winged Horse.',
      planets: []
    },
    stellarStage: 'Red Supergiant',
    futureFate: 'Core-Collapse Supernova or rare massive Neon-Oxygen White Dwarf',
    fusionProcess: 'Core Helium Fusion (Triple-Alpha Process)',
    notableFacts: [
      'The brightest star in Pegasus, shining from the muzzle of the mythical winged steed.',
      'Famous for rare, violent "superflares" — in 1972, Enif suddenly brightened by fivefold in just 10 minutes.',
      'Sitting on the exact boundary mass (~10 M☉) between detonating as a supernova or quietly forming a massive white dwarf.'
    ],
    description: 'The brightest star in Pegasus, an orange supergiant known for rare and energetic superflares.'
  }),

  // 93. Alsuhail (Lambda Velorum)
  makeStar({
    id: 'alsuhail',
    name: 'Alsuhail (Lambda Velorum)',
    alternateNames: ['Lambda Velorum', 'HD 78647', 'HR 3634', 'HIP 44816'],
    constellation: 'Vela',
    diameterSolar: 210, // ~292 Million km (~1.95 AU)
    temperature: 4000,
    spectralType: 'K4Ib',
    spectralClass: 'K',
    luminositySolar: 9000,
    massSolar: 7.0,
    estimatedAge: '~32 Million Years',
    estimatedAgeMyr: 32,
    lifespanEstimate: '~40 Million Years',
    distanceLy: 545,
    apparentMagnitude: 2.21,
    absoluteMagnitude: -3.85,
    rotationalVelocityKmS: 9.5,
    metallicityFeH: 0.0,
    surfaceGravityLogG: 0.8,
    colorHex: '#ff8f2a',
    coronaColorHex: '#ffc770',
    solarEngulfment: 'Spans ~292.5 Million km (~1.95 AU diameter), completely engulfing Mercury, Venus, Earth, and Mars!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars'],
    habitableZoneAU: { inner: 75, outer: 120 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Bright southern orange supergiant in the sail of the celestial ship Argo Navis.',
      planets: []
    },
    stellarStage: 'Red Supergiant',
    futureFate: 'Massive White Dwarf or Type II Supernova',
    fusionProcess: 'Core Helium Fusion with Shell Hydrogen Burning',
    notableFacts: [
      'A luminous orange beacon in the southern constellation of Vela (the Sails).',
      'Classified as an LC-type slow irregular variable star with gentle, wandering pulsations in visual brightness.',
      'Emits strong infrared excess caused by expanding shells of silicate dust grains shed from its cool outer atmosphere.'
    ],
    description: 'A luminous orange supergiant in Vela spanning more than 200 times the diameter of our Sun.'
  }),

  // 94. Tarazed (Gamma Aquilae)
  makeStar({
    id: 'tarazed',
    name: 'Tarazed (Gamma Aquilae)',
    alternateNames: ['Gamma Aquilae', '50 Aquilae', 'HD 186791', 'HR 7525', 'HIP 97278'],
    constellation: 'Aquila',
    diameterSolar: 110, // ~153 Million km (~1.02 AU)
    temperature: 4210,
    spectralType: 'K3II',
    spectralClass: 'K',
    luminositySolar: 2540,
    massSolar: 5.7,
    estimatedAge: '~100 Million Years',
    estimatedAgeMyr: 100,
    lifespanEstimate: '~115 Million Years',
    distanceLy: 395,
    apparentMagnitude: 2.72,
    absoluteMagnitude: -3.03,
    rotationalVelocityKmS: 6.0,
    metallicityFeH: -0.1,
    surfaceGravityLogG: 1.4,
    colorHex: '#ffa338',
    coronaColorHex: '#ffd580',
    solarEngulfment: 'Spans ~153.2 Million km (~1.02 AU diameter), completely engulfing Mercury, Venus, and Earth!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth'],
    habitableZoneAU: { inner: 40, outer: 65 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Flanks Altair in the Eagle; an evolved orange bright giant star.',
      planets: []
    },
    stellarStage: 'Bright Giant',
    futureFate: 'Planetary Nebula ejection leaving a Carbon-Oxygen White Dwarf',
    fusionProcess: 'Core Helium Burning (Triple-Alpha Process)',
    notableFacts: [
      'Flanks Altair along with Alshain in the famous "Shaft of Altair" asterism in Aquila the Eagle.',
      'Though it appears dimmer than Altair in our sky, Tarazed is intrinsically over 2,500 times more luminous, located 23 times farther away.',
      'A relatively young star that evolved off the main sequence in just 100 million years due to its high mass.'
    ],
    description: 'An orange bright giant flanking Altair in Aquila, spanning 110 times the diameter of the Sun.'
  }),

  // 95. Sadr (Gamma Cygni)
  makeStar({
    id: 'sadr',
    name: 'Sadr (Gamma Cygni)',
    alternateNames: ['Gamma Cygni', '37 Cygni', 'HD 194093', 'HR 7796', 'HIP 100453'],
    constellation: 'Cygnus',
    diameterSolar: 150, // ~209 Million km (~1.40 AU)
    temperature: 5790,
    spectralType: 'F8Ib',
    spectralClass: 'F',
    luminositySolar: 33000,
    massSolar: 12.1,
    estimatedAge: '~12 Million Years',
    estimatedAgeMyr: 12,
    lifespanEstimate: '~15 Million Years',
    distanceLy: 1800,
    apparentMagnitude: 2.23,
    absoluteMagnitude: -6.42,
    rotationalVelocityKmS: 12.0,
    metallicityFeH: 0.05,
    surfaceGravityLogG: 1.5,
    colorHex: '#fff0a8',
    coronaColorHex: '#fffad4',
    solarEngulfment: 'Spans ~208.9 Million km (~1.40 AU diameter), completely engulfing Mercury, Venus, and Earth!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth'],
    habitableZoneAU: { inner: 145, outer: 230 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Central intersection of the Northern Cross, surrounded by the glowing IC 1318 emission nebula.',
      planets: []
    },
    stellarStage: 'Yellow Supergiant',
    futureFate: 'Core-Collapse Supernova leaving a Neutron Star',
    fusionProcess: 'Core Helium Fusion with Shell Hydrogen Burning',
    notableFacts: [
      'Marks the heart and central intersection of the Northern Cross asterism in Cygnus the Swan.',
      'Illuminates the vast and intricate ionized hydrogen clouds of the Sadr Region / Butterfly Nebula (IC 1318).',
      'Over 12 times the mass of the Sun, destined to detonate in a brilliant supernova in a few million years.'
    ],
    description: 'The brilliant central star of the Northern Cross, nestled within the glowing IC 1318 emission nebula.'
  }),

  // 96. Almaaz (Epsilon Aurigae)
  makeStar({
    id: 'almaaz',
    name: 'Almaaz (Epsilon Aurigae)',
    alternateNames: ['Epsilon Aurigae', '7 Aurigae', 'HD 31964', 'HR 1605', 'HIP 23416'],
    constellation: 'Auriga',
    diameterSolar: 143, // ~199 Million km (~1.33 AU)
    temperature: 7750,
    spectralType: 'F0Ia',
    spectralClass: 'F',
    luminositySolar: 47000,
    massSolar: 5.9,
    estimatedAge: '~30 Million Years',
    estimatedAgeMyr: 30,
    lifespanEstimate: '~40 Million Years',
    distanceLy: 2000,
    apparentMagnitude: 2.98, // Dips to 3.8 during the 2-year eclipse every 27 years
    absoluteMagnitude: -6.0,
    rotationalVelocityKmS: 25.0,
    metallicityFeH: 0.1,
    surfaceGravityLogG: 1.3,
    colorHex: '#f6f8ff',
    coronaColorHex: '#ffffff',
    solarEngulfment: 'Spans ~199.2 Million km (~1.33 AU diameter), completely engulfing Mercury, Venus, and Earth!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth'],
    habitableZoneAU: { inner: 170, outer: 270 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Famous eclipsing binary system with an opaque, donut-shaped dusty disk orbiting every 27.1 years.',
      planets: []
    },
    stellarStage: 'Bright Giant',
    futureFate: 'Planetary Nebula / Supernova depending on binary mass transfer',
    fusionProcess: 'Advanced Shell Burning with Gravitational Disk Interaction',
    notableFacts: [
      'One of the most famous mystery stars in history: every 27.1 years, it dims by half for two full years.',
      'Modern interferometric imaging revealed that the eclipsing body is a huge, flat, opaque dust disk containing a pair of hot B-type stars at its core.',
      'The dust disk itself spans an incredible 8 astronomical units across (~1.2 billion kilometers).'
    ],
    description: 'A famous eclipsing supergiant in Auriga dimmed every 27 years by a massive dark circumstellar dust disk.'
  }),

  // 97. RT Carinae
  makeStar({
    id: 'rt-carinae',
    name: 'RT Carinae',
    alternateNames: ['HD 303310', 'HIP 52562', 'CD-58 3538', 'Wray 15-644'],
    constellation: 'Carina',
    diameterSolar: 1090, // ~1,518 Million km (~10.15 AU)
    temperature: 3625,
    spectralType: 'M2Ia',
    spectralClass: 'M',
    luminositySolar: 180000,
    massSolar: 18.5,
    estimatedAge: '~12 Million Years',
    estimatedAgeMyr: 12,
    lifespanEstimate: '~13.5 Million Years',
    distanceLy: 8200,
    apparentMagnitude: 8.55,
    absoluteMagnitude: -7.1,
    rotationalVelocityKmS: 10.0,
    metallicityFeH: 0.05,
    surfaceGravityLogG: -0.4,
    colorHex: '#ff4c18',
    coronaColorHex: '#ffa15e',
    solarEngulfment: 'Spans ~1.51 Billion km (~10.15 AU diameter), completely engulfing Mercury, Venus, Earth, Mars, Jupiter, and Saturn!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn'],
    habitableZoneAU: { inner: 340, outer: 530 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Luminous red supergiant in the Carina OB1 association surrounded by silicate dust shells.',
      planets: []
    },
    stellarStage: 'Red Supergiant',
    futureFate: 'Core-Collapse Supernova (Type II-P) leaving a Neutron Star or Black Hole',
    fusionProcess: 'Core Helium Burning & Shell Hydrogen Burning',
    notableFacts: [
      'A prominent red supergiant in the Carina OB1 complex with a diameter exceeding 1,000 times the Sun.',
      'Surrounded by an expansive circumstellar dust envelope enriched with silicate grain species.',
      'Displays semiregular pulsations with an average period of ~448 days.'
    ],
    description: 'A massive luminous red supergiant in Carina with a diameter exceeding 1,000 solar diameters.'
  }),

  // 98. Gacrux (Gamma Crucis)
  makeStar({
    id: 'gacrux',
    name: 'Gacrux (Gamma Crucis)',
    alternateNames: ['Gamma Crucis', 'HD 108903', 'HR 4763', 'HIP 61084'],
    constellation: 'Crux',
    diameterSolar: 113, // ~157 Million km (~1.05 AU)
    temperature: 3626,
    spectralType: 'M3III',
    spectralClass: 'M',
    luminositySolar: 1500,
    massSolar: 1.5,
    estimatedAge: '~2.2 Billion Years',
    estimatedAgeMyr: 2200,
    lifespanEstimate: '~2.8 Billion Years',
    distanceLy: 88.6,
    apparentMagnitude: 1.64,
    absoluteMagnitude: -0.56,
    rotationalVelocityKmS: 3.0,
    metallicityFeH: -0.05,
    surfaceGravityLogG: 1.2,
    colorHex: '#ff6b2b',
    coronaColorHex: '#ffb370',
    solarEngulfment: 'Spans ~157.4 Million km (~1.05 AU diameter), completely engulfing Mercury, Venus, and Earth!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth'],
    habitableZoneAU: { inner: 30, outer: 50 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'The closest M-class red giant to Earth; northern diamond of the Southern Cross.',
      planets: []
    },
    stellarStage: 'Red Giant',
    futureFate: 'Planetary Nebula ejection leaving a Carbon-Oxygen White Dwarf',
    fusionProcess: 'Hydrogen Shell Burning around an Inert Helium Core',
    notableFacts: [
      'The top star of the Southern Cross (Crux) and the nearest M-type red giant to the Solar System at only 88.6 light-years.',
      'Contrasts sharply with the searing blue-white stars Acrux, Mimosa, and Imai that form the rest of the Southern Cross.',
      'Has expanded to more than 110 times the Sun\'s diameter as it ascends the red giant branch.'
    ],
    description: 'The top star of the Southern Cross and the closest M-class red giant to Earth at 88.6 light-years.'
  }),

  // 99. Menkar (Alpha Ceti)
  makeStar({
    id: 'menkar',
    name: 'Menkar (Alpha Ceti)',
    alternateNames: ['Alpha Ceti', '92 Ceti', 'HD 18884', 'HR 911', 'HIP 14135'],
    constellation: 'Cetus',
    diameterSolar: 115, // ~160 Million km (~1.07 AU)
    temperature: 3795,
    spectralType: 'M1III',
    spectralClass: 'M',
    luminositySolar: 1960,
    massSolar: 2.3,
    estimatedAge: '~1.1 Billion Years',
    estimatedAgeMyr: 1100,
    lifespanEstimate: '~1.4 Billion Years',
    distanceLy: 249,
    apparentMagnitude: 2.54,
    absoluteMagnitude: -1.61,
    rotationalVelocityKmS: 3.2,
    metallicityFeH: -0.1,
    surfaceGravityLogG: 1.1,
    colorHex: '#ff7530',
    coronaColorHex: '#ffbd7a',
    solarEngulfment: 'Spans ~160.2 Million km (~1.07 AU diameter), completely engulfing Mercury, Venus, and Earth!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth'],
    habitableZoneAU: { inner: 35, outer: 58 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Luminous red giant marking the jaws of Cetus the Sea Monster.',
      planets: []
    },
    stellarStage: 'Red Giant',
    futureFate: 'Planetary Nebula ejection leaving a White Dwarf',
    fusionProcess: 'Helium Core and Hydrogen Shell Burning',
    notableFacts: [
      'Marks the nose and open jaws of Cetus the Sea Monster in classical celestial cartography.',
      'An evolved asymptotic giant branch star beginning to show irregular pulsations as its core runs out of helium fuel.',
      'Will eventually shed its incandescent outer layers to produce a glowing planetary nebula within the next few million years.'
    ],
    description: 'An evolved luminous red giant in Cetus spanning 115 solar diameters with a warm red-orange hue.'
  }),

  // 100. Avior (Epsilon Carinae)
  makeStar({
    id: 'avior',
    name: 'Avior (Epsilon Carinae)',
    alternateNames: ['Epsilon Carinae', 'HD 71129', 'HR 3307', 'HIP 41037'],
    constellation: 'Carina',
    diameterSolar: 153, // ~213 Million km (~1.42 AU)
    temperature: 4100,
    spectralType: 'K3III',
    spectralClass: 'K',
    luminositySolar: 6000,
    massSolar: 4.6,
    estimatedAge: '~110 Million Years',
    estimatedAgeMyr: 110,
    lifespanEstimate: '~130 Million Years',
    distanceLy: 605,
    apparentMagnitude: 1.86,
    absoluteMagnitude: -4.4,
    rotationalVelocityKmS: 28.0,
    metallicityFeH: 0.0,
    surfaceGravityLogG: 1.3,
    colorHex: '#ff942e',
    coronaColorHex: '#ffc978',
    solarEngulfment: 'Spans ~213.1 Million km (~1.42 AU diameter), completely engulfing Mercury, Venus, and Earth!',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth'],
    habitableZoneAU: { inner: 60, outer: 95 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'Spectroscopic eclipsing binary in the False Cross pairing an orange giant with a hot blue dwarf.',
      planets: []
    },
    stellarStage: 'Bright Giant',
    futureFate: 'Planetary Nebula / Binary White Dwarf system',
    fusionProcess: 'Core Helium Fusion (Primary) + Main-Sequence CNO Hydrogen Fusion (Secondary)',
    notableFacts: [
      'One of the four bright stars comprising the navigational "False Cross" asterism in the southern sky.',
      'Given the proper name "Avior" in the late 1930s by Her Majesty\'s Nautical Almanac Office for RAF celestial navigation.',
      'Consists of a cool, luminous orange giant undergoing mutual eclipses every 785 days with a searing blue-white B2 dwarf companion.'
    ],
    description: 'A prominent star of the False Cross, pairing an orange giant with a hot blue-white dwarf companion.'
  })
];
