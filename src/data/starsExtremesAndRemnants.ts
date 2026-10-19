import { StarData } from '../types';
import { makeStar } from './starHelper';

export const STARS_EXTREMES_AND_REMNANTS: StarData[] = [
  // ==========================================
  // TOP LARGEST STARS (by Solar Diameter)
  // ==========================================

  // 1. IRAS 05280-6910 - 1,736 D☉ (One of the largest known red supergiants)
  makeStar({
    id: 'iras-05280-6910',
    name: 'IRAS 05280-6910',
    alternateNames: ['MSX LMC 663', 'IRAS 05280-6910'],
    constellation: 'Dorado',
    diameterSolar: 1736,
    temperature: 3000,
    spectralType: 'M3I',
    spectralClass: 'M',
    luminositySolar: 220000,
    massSolar: 24.0,
    estimatedAge: '10.0 Million Years',
    estimatedAgeMyr: 10,
    metallicityFeH: -0.30,
    distanceLy: 160000,
    apparentMagnitude: 13.5,
    absoluteMagnitude: -8.5,
    surfaceGravityLogG: -0.3,
    colorHex: '#ff4500',
    coronaColorHex: '#ff7733',
    solarEngulfment: 'Engulfs Mercury, Venus, Earth, Mars, and the Asteroid Belt, reaching beyond Jupiter out to 8.07 AU (1.2 billion km radius).',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'],
    habitableZoneAU: { inner: 400.0, outer: 750.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Colossal red supergiant in the Large Magellanic Cloud surrounded by an immense circumstellar dust envelope.',
      planets: []
    },
    stellarStage: 'Red Supergiant',
    lifespanEstimate: '< 15 Million Years',
    futureFate: 'Type II-P Supernova / Black Hole',
    fusionProcess: 'Core Helium / Advanced Shell Burning',
    notableFacts: [
      'Identified in the Large Magellanic Cloud with an astounding physical diameter of ~1,736 D☉ (~2.42 billion km), making it a peer of Stephenson 2-18 and UY Scuti.',
      'Loses mass at an astonishing rate of nearly 10⁻⁴ solar masses per year via dense dusty stellar winds.',
      'If placed at the center of our solar system, its photosphere would swallow Jupiter and extend almost to the orbit of Saturn.'
    ],
    description: 'A gargantuan red supergiant in the Large Magellanic Cloud ranking among the absolute largest stars ever observed.'
  }),

  // 2. RSGC1-F01 - 1,530 D☉ (Massive Scutum Red Supergiant)
  makeStar({
    id: 'rsgc1-f01',
    name: 'RSGC1-F01',
    alternateNames: ['RSGC1-01'],
    constellation: 'Scutum',
    diameterSolar: 1530,
    temperature: 3450,
    spectralType: 'M5I',
    spectralClass: 'M',
    luminositySolar: 263000,
    massSolar: 18.0,
    estimatedAge: '12.0 Million Years',
    estimatedAgeMyr: 12,
    metallicityFeH: 0.10,
    distanceLy: 21500,
    apparentMagnitude: 16.0, // heavily dust-obscured
    absoluteMagnitude: -8.8,
    surfaceGravityLogG: -0.2,
    colorHex: '#ff5511',
    coronaColorHex: '#ff8844',
    solarEngulfment: 'Engulfs Mercury, Venus, Earth, Mars, and reaches Jupiter’s orbit (7.11 AU diameter).',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'],
    habitableZoneAU: { inner: 450.0, outer: 850.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Member of RSGC1, one of the most massive young open clusters in the Milky Way with 14 red supergiants.',
      planets: []
    },
    stellarStage: 'Red Supergiant',
    lifespanEstimate: '< 15 Million Years',
    futureFate: 'Type II-P Core Collapse Supernova',
    fusionProcess: 'Carbon / Oxygen Core Fusion',
    notableFacts: [
      'The largest identified member of the RSGC1 massive young cluster in Scutum, spanning over 1,530 solar diameters.',
      'Shrouded behind more than 25 magnitudes of visual interstellar extinction, radiating predominantly in the near and mid-infrared.',
      'Radiates over a quarter-million times more energy than the Sun.'
    ],
    description: 'A colossal red supergiant buried behind heavy galactic dust lanes in the massive Scutum cluster RSGC1.'
  }),

  // 3. MY Cephei - 1,490 D☉ (NGC 7419 Hypergiant)
  makeStar({
    id: 'my-cephei',
    name: 'MY Cephei',
    alternateNames: ['IRC +60375', 'HD 216445'],
    constellation: 'Cepheus',
    diameterSolar: 1490,
    temperature: 3400,
    spectralType: 'M7.5Ia+',
    spectralClass: 'M',
    luminositySolar: 310000,
    massSolar: 22.0,
    estimatedAge: '14.0 Million Years',
    estimatedAgeMyr: 14,
    metallicityFeH: 0.05,
    distanceLy: 9800,
    apparentMagnitude: 14.4,
    absoluteMagnitude: -9.0,
    surfaceGravityLogG: -0.15,
    colorHex: '#ff4400',
    coronaColorHex: '#ff7722',
    solarEngulfment: 'Engulfs Mercury, Venus, Earth, Mars, and stretches to 6.93 AU, engulfing Jupiter.',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'],
    habitableZoneAU: { inner: 490.0, outer: 920.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Luminous red supergiant in the open cluster NGC 7419.',
      planets: []
    },
    stellarStage: 'Red Hypergiant',
    lifespanEstimate: '< 16 Million Years',
    futureFate: 'Type II Supernova / Black Hole',
    fusionProcess: 'Advanced Shell Burning',
    notableFacts: [
      'Physical diameter measured between 1,490 and 2,060 R☉ in modern astrophysical surveys of open cluster NGC 7419.',
      'Possesses extreme infrared emission from massive episodic mass-loss dust ejections.',
      'One of the most luminous red supergiants in the northern galactic plane.'
    ],
    description: 'An immense red hypergiant in Cepheus dominating the massive cluster NGC 7419.'
  }),

  // 4. VX Sagittarii - 1,350 D☉ (Famous Pulsating Supergiant)
  makeStar({
    id: 'vx-sagittarii',
    name: 'VX Sagittarii',
    alternateNames: ['HIP 88838', 'HD 165674'],
    constellation: 'Sagittarius',
    diameterSolar: 1350,
    temperature: 3200,
    spectralType: 'M4eIa+',
    spectralClass: 'M',
    luminositySolar: 195000,
    massSolar: 16.0,
    estimatedAge: '15.0 Million Years',
    estimatedAgeMyr: 15,
    metallicityFeH: 0.0,
    distanceLy: 5100,
    apparentMagnitude: 8.0, // pulsating 6.5 to 14.0
    absoluteMagnitude: -7.5,
    surfaceGravityLogG: -0.1,
    colorHex: '#ff5522',
    coronaColorHex: '#ff8844',
    solarEngulfment: 'Engulfs Mercury, Venus, Earth, Mars, and extends across 6.28 AU to Jupiter.',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'],
    habitableZoneAU: { inner: 380.0, outer: 720.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      debrisDisk: true,
      debrisDiskDescription: 'Surrounded by concentric dust shells and powerful water, hydroxyl, and silicon monoxide astrophysical masers.',
      systemOverview: 'Strongly pulsating cool hypergiant surrounded by energetic astrophysical masers.',
      planets: []
    },
    stellarStage: 'Red Hypergiant',
    lifespanEstimate: '< 18 Million Years',
    futureFate: 'Type II Supernova',
    fusionProcess: 'Convective Shell Fusion',
    notableFacts: [
      'Pulsates with a massive 732-day period, varying dramatically in physical diameter between 1,120 and 1,520 solar diameters.',
      'Surrounded by a giant circumstellar envelope hosting luminous OH and H₂O masers.',
      'Displays a deep crimson hue visible through amateur telescopes during peak brightness.'
    ],
    description: 'A pulsating red hypergiant in Sagittarius that breathes in and out across billions of kilometers.'
  }),

  // 5. EV Carinae - 1,168 D☉
  makeStar({
    id: 'ev-carinae',
    name: 'EV Carinae',
    alternateNames: ['HD 90372', 'HIP 50998'],
    constellation: 'Carina',
    diameterSolar: 1168,
    temperature: 3574,
    spectralType: 'M4.5Ia',
    spectralClass: 'M',
    luminositySolar: 200000,
    massSolar: 15.0,
    estimatedAge: '16.0 Million Years',
    estimatedAgeMyr: 16,
    metallicityFeH: -0.05,
    distanceLy: 14000,
    apparentMagnitude: 7.7,
    absoluteMagnitude: -8.0,
    surfaceGravityLogG: -0.1,
    colorHex: '#ff6633',
    coronaColorHex: '#ff9955',
    solarEngulfment: 'Engulfs Mercury, Venus, Earth, Mars, and extends out to 5.43 AU near Jupiter.',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'],
    habitableZoneAU: { inner: 390.0, outer: 730.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Luminous red supergiant in the Carina arm of the Milky Way.',
      planets: []
    },
    stellarStage: 'Red Supergiant',
    lifespanEstimate: '< 18 Million Years',
    futureFate: 'Type II-P Supernova',
    fusionProcess: 'Helium Shell Burning',
    notableFacts: [
      'Ranks among the largest stars in the southern sky with a diameter of ~1,168 D☉ (~1.63 billion km).',
      'Undergoes irregular, long-period photometric pulsations.',
      'Located in the rich star-forming complexes of the Carina spiral arm.'
    ],
    description: 'A luminous red supergiant in Carina extending past the orbit of Jupiter.'
  }),

  // ==========================================
  // TOP HOTTEST STARS (by Surface Temperature)
  // ==========================================

  // 6. KPD 0005+5106 - 200,000 K (Hottest Known White Dwarf!)
  makeStar({
    id: 'kpd-0005-5106',
    name: 'KPD 0005+5106',
    alternateNames: ['WD 0005+511', 'HIP 875'],
    constellation: 'Cassiopeia',
    diameterSolar: 0.018, // ~25,000 km (Earth-scale)
    temperature: 200000, // 200,000 K!
    spectralType: 'DO',
    spectralClass: 'WD',
    luminositySolar: 350.0,
    massSolar: 0.60,
    estimatedAge: '100,000 Years (Post-AGB Remnant Age)',
    estimatedAgeMyr: 0.1,
    distanceLy: 1300,
    apparentMagnitude: 13.3,
    absoluteMagnitude: 5.3,
    surfaceGravityLogG: 7.0,
    colorHex: '#a5f3fc',
    coronaColorHex: '#67e8f9',
    solarEngulfment: 'Engulfs no planets (0.018 D☉ = 25,000 km, roughly twice the diameter of Earth).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 16.0, outer: 30.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Solitary ultra-hot degenerate stellar core in Cassiopeia.',
      planets: []
    },
    stellarStage: 'White Dwarf',
    lifespanEstimate: 'Hundreds of Trillions of Years',
    futureFate: 'Cold Black Dwarf',
    fusionProcess: 'None (Degenerate Electron Core Cooling)',
    notableFacts: [
      'The hottest confirmed white dwarf star known in the universe, with an incandescent surface temperature of 200,000 Kelvin (over 34 times hotter than the Sun).',
      'Emits intense high-energy soft X-rays detected by the Chandra X-ray Observatory and FUSE ultraviolet satellite.',
      'Surface atmosphere is nearly pure helium with photospheric traces of ionized neon, fluorine, and magnesium.'
    ],
    description: 'The hottest known white dwarf star in astronomy, searing space at 200,000 Kelvin in Cassiopeia.'
  }),

  // 7. Sanduleak 2-73 (BAT99-123) - 180,000 K (WO1 Wolf-Rayet in LMC)
  makeStar({
    id: 'sanduleak-2-73',
    name: 'Sanduleak 2-73',
    alternateNames: ['BAT99-123', 'Brey 93', 'Sand 2-73'],
    constellation: 'Dorado',
    diameterSolar: 0.65,
    temperature: 180000,
    spectralType: 'WO1',
    spectralClass: 'WR',
    luminositySolar: 250000,
    massSolar: 16.0,
    estimatedAge: '3.0 Million Years',
    estimatedAgeMyr: 3,
    metallicityFeH: -0.30,
    distanceLy: 160000,
    apparentMagnitude: 15.2,
    absoluteMagnitude: -3.3,
    surfaceGravityLogG: 5.6,
    colorHex: '#60a5fa',
    coronaColorHex: '#93c5fd',
    solarEngulfment: 'Engulfs no planets (0.65 D☉ = 905,000 km).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 430.0, outer: 820.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Bare, stripped helium-oxygen-carbon stellar core in the Large Magellanic Cloud.',
      planets: []
    },
    stellarStage: 'Wolf-Rayet',
    lifespanEstimate: '< 20,000 Years',
    futureFate: 'Type Ic Supernova / Long-Duration GRB',
    fusionProcess: 'Advanced Carbon / Oxygen Core Fusion',
    notableFacts: [
      'One of the hottest non-degenerate stars in the local universe at 180,000 K, classified as an ultra-rare oxygen-sequence WO1 Wolf-Rayet star.',
      'Stripped completely of its hydrogen and helium envelopes, blowing a howling stellar wind at 4,200 km/s.',
      'Direct progenitor to an imminent Type Ic core-collapse supernova or gamma-ray burst within the next tens of thousands of years.'
    ],
    description: 'A ferocious WO1 oxygen-type Wolf-Rayet core in the Large Magellanic Cloud radiating at 180,000 K.'
  }),

  // 8. WR 93b - 160,000 K (WO3 Wolf-Rayet in Sagittarius)
  makeStar({
    id: 'wr-93b',
    name: 'WR 93b',
    alternateNames: ['Sand 5', 'MSX6C G002.5020-00.0888'],
    constellation: 'Sagittarius',
    diameterSolar: 0.85,
    temperature: 160000,
    spectralType: 'WO3',
    spectralClass: 'WR',
    luminositySolar: 200000,
    massSolar: 17.0,
    estimatedAge: '3.2 Million Years',
    estimatedAgeMyr: 3.2,
    distanceLy: 8500,
    apparentMagnitude: 17.5,
    absoluteMagnitude: -2.8,
    surfaceGravityLogG: 5.4,
    colorHex: '#3b82f6',
    coronaColorHex: '#60a5fa',
    solarEngulfment: 'Engulfs no planets (0.85 D☉ = 1,184,000 km).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 380.0, outer: 720.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Heavily dust-obscured WO3 Wolf-Rayet core near the galactic center.',
      planets: []
    },
    stellarStage: 'Wolf-Rayet',
    lifespanEstimate: '< 30,000 Years',
    futureFate: 'Type Ic Supernova / Stellar Black Hole',
    fusionProcess: 'Core Carbon Fusion',
    notableFacts: [
      'Surface temperature of 160,000 K drives severe ionization of carbon and oxygen atoms in its outer atmosphere.',
      'Powers terminal stellar winds with terminal velocity surpassing 4,000 km/s.',
      'Only four WO-class stars are known in the entire Milky Way galaxy.'
    ],
    description: 'An ultra-hot WO3 carbon-oxygen stripped core burning at 160,000 K in Sagittarius.'
  }),

  // 9. NGC 2371-2 Central Star (Sand 3) - 135,000 K
  makeStar({
    id: 'ngc-2371-central',
    name: 'NGC 2371-2 Central Star',
    alternateNames: ['Sand 3', 'HD 59643 CS', 'PK 189+19.1'],
    constellation: 'Gemini',
    diameterSolar: 0.12,
    temperature: 135000,
    spectralType: '[WO1]',
    spectralClass: 'WR',
    luminositySolar: 1400.0,
    massSolar: 0.65,
    estimatedAge: '10,000 Years (Nebula Age)',
    estimatedAgeMyr: 0.01,
    distanceLy: 4400,
    apparentMagnitude: 14.8,
    absoluteMagnitude: 4.1,
    surfaceGravityLogG: 6.2,
    colorHex: '#38bdf8',
    coronaColorHex: '#7dd3fc',
    solarEngulfment: 'Engulfs no planets (0.12 D☉ = 167,000 km).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 32.0, outer: 60.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Central star illuminating the spectacular dual-lobed Gemini planetary nebula NGC 2371-2.',
      planets: []
    },
    stellarStage: 'Wolf-Rayet',
    lifespanEstimate: 'Millions of Years (Cooling to White Dwarf)',
    futureFate: 'DO / DA White Dwarf',
    fusionProcess: 'Late Helium Shell Flash / Gravitational Contraction',
    notableFacts: [
      'Blistering central star at 135,000 Kelvin, exciting the double-lobed Gemini planetary nebula discovered by William Herschel in 1785.',
      'Classified with the rare [WO1] bracket designation, denoting a low-mass planetary nebula central star with emission lines matching massive Wolf-Rayet stars.',
      'Currently shedding its final outer layers as it transitions directly onto the white dwarf cooling track.'
    ],
    description: 'The searing 135,000 K central star illuminating the dual-lobed planetary nebula NGC 2371-2 in Gemini.'
  }),

  // 10. WR 30a - 130,000 K (WO4+O5 Colliding Wind Binary)
  makeStar({
    id: 'wr-30a',
    name: 'WR 30a',
    alternateNames: ['MSX6C G288.2435-01.0180'],
    constellation: 'Carina',
    diameterSolar: 0.90,
    temperature: 130000,
    spectralType: 'WO4',
    spectralClass: 'WR',
    luminositySolar: 195000,
    massSolar: 19.5,
    estimatedAge: '3.5 Million Years',
    estimatedAgeMyr: 3.5,
    distanceLy: 11000,
    apparentMagnitude: 14.7,
    absoluteMagnitude: -3.0,
    surfaceGravityLogG: 5.2,
    colorHex: '#2563eb',
    coronaColorHex: '#60a5fa',
    solarEngulfment: 'Engulfs no planets (0.90 D☉ = 1,253,000 km).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 370.0, outer: 710.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Massive colliding wind binary consisting of an ultra-hot WO4 core and an O5 companion in a 4.6-day orbit.',
      planets: []
    },
    stellarStage: 'Wolf-Rayet',
    lifespanEstimate: '< 50,000 Years',
    futureFate: 'Type Ic Supernova',
    fusionProcess: 'Carbon Core Fusion',
    notableFacts: [
      'The primary WO4 star maintains a surface temperature of 130,000 K and a stellar wind velocity of 4,500 km/s.',
      'Colliding stellar winds between the WO and O5 stars generate energetic X-ray shock zones.',
      'One of the most extreme colliding-wind binary laboratories in Carina.'
    ],
    description: 'An ultra-hot colliding-wind binary star system in Carina glowing at 130,000 K.'
  }),

  // 11. NGC 6543 Central Star (Cat\'s Eye Nebula) - 110,000 K
  makeStar({
    id: 'cats-eye-central',
    name: 'Cat’s Eye Central Star',
    alternateNames: ['HD 106443 CS', 'PK 096+29.1'],
    constellation: 'Draco',
    diameterSolar: 0.65,
    temperature: 110000,
    spectralType: 'WR',
    spectralClass: 'WR',
    luminositySolar: 10000,
    massSolar: 1.05,
    estimatedAge: '1,000 Years (Nebula Age)',
    estimatedAgeMyr: 0.001,
    distanceLy: 3300,
    apparentMagnitude: 11.1,
    absoluteMagnitude: 0.9,
    surfaceGravityLogG: 5.5,
    colorHex: '#06b6d4',
    coronaColorHex: '#67e8f9',
    solarEngulfment: 'Engulfs no planets (0.65 D☉ = 905,000 km).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 85.0, outer: 160.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Central ionizing engine of the intricate multi-ringed Cat’s Eye Nebula (NGC 6543).',
      planets: []
    },
    stellarStage: 'Wolf-Rayet',
    lifespanEstimate: 'Cooling towards White Dwarf',
    futureFate: 'White Dwarf',
    fusionProcess: 'Residual Envelope Burning / Contraction',
    notableFacts: [
      'Blazing at 110,000 K, this Wolf-Rayet-type central star drives a 1,900 km/s stellar wind that sculpted the nested gas concentric bubbles of the Cat’s Eye Nebula.',
      'Loses approximately 20 trillion tons of gas every second through radiation pressure.',
      'Hubble Space Telescope images revealed 11 or more concentric rings or shells ejected by the star in periodic pulses every 1,500 years.'
    ],
    description: 'The searing 110,000 K stellar engine illuminating the intricate concentric shells of the Cat’s Eye Nebula.'
  }),

  // ==========================================
  // TOP MOST MASSIVE STARS (by Solar Mass)
  // ==========================================

  // 12. BAT99-98 - 180 M☉ (Ranked #3 Most Massive Star known!)
  makeStar({
    id: 'bat99-98',
    name: 'BAT99-98',
    alternateNames: ['Brey 79', 'RMC 112', 'VFTS 542'],
    constellation: 'Dorado',
    diameterSolar: 37.5,
    temperature: 45000,
    spectralType: 'WN6',
    spectralClass: 'WR',
    luminositySolar: 5000000,
    massSolar: 180.0,
    estimatedAge: '1.5 Million Years',
    estimatedAgeMyr: 1.5,
    metallicityFeH: -0.30,
    rotationalVelocityKmS: 100.0,
    distanceLy: 163000,
    apparentMagnitude: 13.7,
    absoluteMagnitude: -8.0,
    surfaceGravityLogG: 3.5,
    colorHex: '#60a5fa',
    coronaColorHex: '#93c5fd',
    solarEngulfment: 'Engulfs Mercury’s orbit (37.5 D☉ = 52.2 million km = 0.35 AU diameter).',
    engulfsPlanets: ['Mercury'],
    habitableZoneAU: { inner: 1900.0, outer: 3600.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Isolated titan in 30 Doradus (Tarantula Nebula), Large Magellanic Cloud.',
      planets: []
    },
    stellarStage: 'Wolf-Rayet',
    lifespanEstimate: '< 2.5 Million Years',
    futureFate: 'Pair-Instability Supernova / Direct Black Hole Collapse',
    fusionProcess: 'CNO Cycle / Core Hydrogen Burning',
    notableFacts: [
      'Astrophysical analysis indicates an initial birth mass of over 250 M☉ and a current mass of ~180 M☉, ranking it right after R136a1 and Melnick 42 as one of the three most massive stars known in the cosmos.',
      'Radiates an astonishing 5,000,000 times more luminosity than the Sun.',
      'Blowing a colossal stellar wind that has stripped over 70 solar masses of matter into the surrounding Tarantula Nebula.'
    ],
    description: 'A 180-solar-mass cosmic titan in the Tarantula Nebula ranking as the third most massive star ever identified.'
  }),

  // 13. R136a2 - 151 M☉ (R136 Core Titan)
  makeStar({
    id: 'r136a2',
    name: 'R136a2',
    alternateNames: ['BAT99-107', 'RMC 136a2'],
    constellation: 'Dorado',
    diameterSolar: 23.4,
    temperature: 50000,
    spectralType: 'WN5h',
    spectralClass: 'WR',
    luminositySolar: 3500000,
    massSolar: 151.0,
    estimatedAge: '1.5 Million Years',
    estimatedAgeMyr: 1.5,
    metallicityFeH: -0.30,
    distanceLy: 163000,
    apparentMagnitude: 12.8,
    absoluteMagnitude: -7.5,
    surfaceGravityLogG: 3.9,
    colorHex: '#3b82f6',
    coronaColorHex: '#60a5fa',
    solarEngulfment: 'Engulfs Mercury’s inner orbital edge (23.4 D☉ = 32.6 million km = 0.22 AU).',
    engulfsPlanets: ['Mercury'],
    habitableZoneAU: { inner: 1600.0, outer: 3000.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Core heavyweight star inside the dense R136 central starburst cluster.',
      planets: []
    },
    stellarStage: 'Wolf-Rayet',
    lifespanEstimate: '< 2.5 Million Years',
    futureFate: 'Hypernova / Direct Black Hole Collapse',
    fusionProcess: 'Convective Core CNO Fusion',
    notableFacts: [
      'The second most massive member of the central R136 cluster after R136a1, boasting a mass of 151 solar masses.',
      'Emits over 3.5 million solar luminosities from a searing 50,000 K photosphere.',
      'Initial birth mass was estimated at ~195 to 211 M☉.'
    ],
    description: 'A 151-solar-mass powerhouse in the core of the R136 cluster in the Large Magellanic Cloud.'
  }),

  // 14. R136a3 - 135 M☉
  makeStar({
    id: 'r136a3',
    name: 'R136a3',
    alternateNames: ['BAT99-106', 'RMC 136a3'],
    constellation: 'Dorado',
    diameterSolar: 19.0,
    temperature: 53000,
    spectralType: 'WN5h',
    spectralClass: 'WR',
    luminositySolar: 2800000,
    massSolar: 135.0,
    estimatedAge: '1.5 Million Years',
    estimatedAgeMyr: 1.5,
    metallicityFeH: -0.30,
    distanceLy: 163000,
    apparentMagnitude: 13.0,
    absoluteMagnitude: -7.3,
    surfaceGravityLogG: 4.0,
    colorHex: '#2563eb',
    coronaColorHex: '#60a5fa',
    solarEngulfment: 'Extends across 0.18 AU (19.0 D☉ = 26.5 million km).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1400.0, outer: 2700.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Massive WN5h component in the R136 cluster core.',
      planets: []
    },
    stellarStage: 'Wolf-Rayet',
    lifespanEstimate: '< 2.8 Million Years',
    futureFate: 'Hypernova / Direct Black Hole Collapse',
    fusionProcess: 'Convective Core CNO Cycle',
    notableFacts: [
      'One of the hottest and most massive stars in R136 with a scorching surface temperature of 53,000 K and a mass of 135 M☉.',
      'Estimated initial mass was between 165 and 180 M☉.',
      'Sits mere light-days away from sister titans R136a1 and R136a2.'
    ],
    description: 'A 135-solar-mass, 53,000-Kelvin Wolf-Rayet star illuminating the core of R136.'
  }),

  // 15. R136c - 130 M☉
  makeStar({
    id: 'r136c',
    name: 'R136c',
    alternateNames: ['BAT99-112', 'RMC 136c'],
    constellation: 'Dorado',
    diameterSolar: 18.5,
    temperature: 51000,
    spectralType: 'WN5h',
    spectralClass: 'WR',
    luminositySolar: 2600000,
    massSolar: 130.0,
    estimatedAge: '1.5 Million Years',
    estimatedAgeMyr: 1.5,
    metallicityFeH: -0.30,
    distanceLy: 163000,
    apparentMagnitude: 13.4,
    absoluteMagnitude: -7.3,
    surfaceGravityLogG: 4.0,
    colorHex: '#3b82f6',
    coronaColorHex: '#60a5fa',
    solarEngulfment: 'Extends across 0.17 AU (18.5 D☉ = 25.8 million km).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1350.0, outer: 2600.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Outlying massive Wolf-Rayet star in the dense R136 cluster.',
      planets: []
    },
    stellarStage: 'Wolf-Rayet',
    lifespanEstimate: '< 3.0 Million Years',
    futureFate: 'Supernova / Black Hole',
    fusionProcess: 'CNO Cycle',
    notableFacts: [
      'Possesses a mass of 130 M☉ and is a prominent X-ray source due to suspected colliding wind binary interactions.',
      'Initial birth mass was over 160 M☉.',
      'Located slightly outside the congested R136a sub-core.'
    ],
    description: 'A 130-solar-mass monster star in R136 generating intense X-ray and UV emissions.'
  }),

  // 16. HD 269810 (HDE 269810) - 130 M☉ (Pure O2 Giant in LMC)
  makeStar({
    id: 'hd-269810',
    name: 'HD 269810',
    alternateNames: ['HDE 269810', 'BAT99-68', 'NGC 2029-1'],
    constellation: 'Dorado',
    diameterSolar: 19.5,
    temperature: 52500,
    spectralType: 'O2III(f*)',
    spectralClass: 'O',
    luminositySolar: 2200000,
    massSolar: 130.0,
    estimatedAge: '1.2 Million Years',
    estimatedAgeMyr: 1.2,
    metallicityFeH: -0.30,
    rotationalVelocityKmS: 145.0,
    distanceLy: 163000,
    apparentMagnitude: 12.3,
    absoluteMagnitude: -7.2,
    surfaceGravityLogG: 4.0,
    colorHex: '#60a5fa',
    coronaColorHex: '#93c5fd',
    solarEngulfment: 'Extends across 0.18 AU (19.5 D☉ = 27.2 million km).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1250.0, outer: 2400.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Isolated single O-type supergiant in the LMC star-forming nebula NGC 2029.',
      planets: []
    },
    stellarStage: 'Blue Giant',
    lifespanEstimate: '< 3.0 Million Years',
    futureFate: 'Hypernova / Black Hole',
    fusionProcess: 'CNO Core Hydrogen Burning',
    notableFacts: [
      'One of the most massive non-Wolf-Rayet O-type stars known in the universe, weighing in at ~130 solar masses.',
      'Spectroscopically classified as O2III(f*), representing the earliest and hottest O-class classification in astronomy (52,500 K).',
      'Eats through its core hydrogen at a rate thousands of times faster than the Sun.'
    ],
    description: 'A 130-solar-mass pristine O2-class blue titan in the Large Magellanic Cloud.'
  }),

  // 17. WR 42e - 125 M☉ (NGC 3603 Runaway)
  makeStar({
    id: 'wr-42e',
    name: 'WR 42e',
    alternateNames: ['HD 97950 e', '2MASS J11144550-6115180'],
    constellation: 'Carina',
    diameterSolar: 21.0,
    temperature: 43000,
    spectralType: 'O3If*',
    spectralClass: 'O',
    luminositySolar: 3200000,
    massSolar: 125.0,
    estimatedAge: '1.0 Million Years',
    estimatedAgeMyr: 1.0,
    metallicityFeH: 0.10,
    distanceLy: 25000,
    apparentMagnitude: 14.5,
    absoluteMagnitude: -7.5,
    surfaceGravityLogG: 3.8,
    colorHex: '#3b82f6',
    coronaColorHex: '#60a5fa',
    solarEngulfment: 'Extends across 0.19 AU (21.0 D☉ = 29.2 million km).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1500.0, outer: 2900.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Runaway isolated massive star ejected from the core of the starburst cluster NGC 3603.',
      planets: []
    },
    stellarStage: 'Wolf-Rayet',
    lifespanEstimate: '< 2.5 Million Years',
    futureFate: 'Direct Black Hole Collapse / Hypernova',
    fusionProcess: 'Core CNO Hydrogen Burning',
    notableFacts: [
      'Massive 125 M☉ star believed to be the product of a runaway stellar merger or 3-body dynamical ejection from the dense cluster NGC 3603.',
      'Possesses high space velocity moving away from the cluster center.',
      'Emits over 3.2 million times the luminosity of our Sun.'
    ],
    description: 'A 125-solar-mass runaway titan ejected from the starburst cluster NGC 3603 in Carina.'
  }),

  // 18. WR 25 - 110 M☉ (Carina Nebula Heavyweight)
  makeStar({
    id: 'wr-25',
    name: 'WR 25',
    alternateNames: ['HD 93162', 'HIP 52526'],
    constellation: 'Carina',
    diameterSolar: 22.0,
    temperature: 50100,
    spectralType: 'WN6h',
    spectralClass: 'WR',
    luminositySolar: 2400000,
    massSolar: 110.0,
    estimatedAge: '1.5 Million Years',
    estimatedAgeMyr: 1.5,
    distanceLy: 7500,
    apparentMagnitude: 8.8,
    absoluteMagnitude: -7.1,
    surfaceGravityLogG: 3.9,
    colorHex: '#2563eb',
    coronaColorHex: '#60a5fa',
    solarEngulfment: 'Extends across 0.20 AU (22.0 D☉ = 30.6 million km).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1300.0, outer: 2500.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Luminous binary system in the Carina Nebula Trumpler 16 cluster with a 208-day orbital period.',
      planets: []
    },
    stellarStage: 'Wolf-Rayet',
    lifespanEstimate: '< 3.0 Million Years',
    futureFate: 'Hypernova / Black Hole',
    fusionProcess: 'CNO Core Fusion',
    notableFacts: [
      'One of the most luminous and massive stars in the Carina Nebula, rivaling Eta Carinae.',
      'The primary WN6h star has a mass of ~110 M☉ and orbits an O4 companion of ~35 M☉.',
      'Generates intense colliding wind shocks detected by Chandra and XMM-Newton.'
    ],
    description: 'A 110-solar-mass Wolf-Rayet binary powerhouse illuminating the Carina Nebula.'
  }),

  // 19. Peony Star (WR 102ka) - 100 M☉
  makeStar({
    id: 'peony-star',
    name: 'Peony Star',
    alternateNames: ['WR 102ka', '2MASS J17461811-2901366'],
    constellation: 'Sagittarius',
    diameterSolar: 100.0,
    temperature: 25100,
    spectralType: 'WN9h',
    spectralClass: 'WR',
    luminositySolar: 3200000,
    massSolar: 100.0,
    estimatedAge: '2.5 Million Years',
    estimatedAgeMyr: 2.5,
    distanceLy: 26000,
    apparentMagnitude: 17.5, // obscured by 29 mag of dust
    absoluteMagnitude: -7.6,
    surfaceGravityLogG: 2.5,
    colorHex: '#60a5fa',
    coronaColorHex: '#93c5fd',
    solarEngulfment: 'Engulfs Mercury and Venus, extending out to 0.93 AU (100 D☉ = 139 million km).',
    engulfsPlanets: ['Mercury', 'Venus'],
    habitableZoneAU: { inner: 1500.0, outer: 2900.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Luminous blue/Wolf-Rayet hypergiant near the Galactic Center shrouded in the Peony Nebula.',
      planets: []
    },
    stellarStage: 'Wolf-Rayet',
    lifespanEstimate: '< 3.0 Million Years',
    futureFate: 'Supernova / Black Hole',
    fusionProcess: 'CNO Cycle',
    notableFacts: [
      'Discovered in 2008 by NASA’s Spitzer Space Telescope, shining with 3.2 million solar luminosities near the supermassive black hole Sagittarius A*.',
      'Surrounded by the exquisite flower-shaped Peony dust nebula sculpted by its intense mass loss.',
      'Initially born with an extraordinary mass estimated at 150 to 200 M☉.'
    ],
    description: 'A 100-solar-mass luminous titan near the Galactic Center illuminating the Peony Nebula.'
  }),

  // ==========================================
  // NOTABLE STARS, EXOTIC SYSTEMS & STELLAR REMNANTS
  // ==========================================

  // 20. Boyajian's Star (Tabby's Star / KIC 8462852) - Famous Enigmatic Variable Star
  makeStar({
    id: 'boyajians-star',
    name: "Boyajian's Star (Tabby's Star)",
    alternateNames: ['KIC 8462852', "Tabby's Star", 'WTF Star', 'TYC 3162-665-1', '2MASS J20061546+4427248'],
    constellation: 'Cygnus',
    diameterSolar: 1.58,
    temperature: 6584,
    spectralType: 'F3V',
    spectralClass: 'F',
    luminositySolar: 4.68,
    massSolar: 1.43,
    estimatedAge: '1.5 Billion Years',
    estimatedAgeMyr: 1500,
    metallicityFeH: 0.11,
    rotationalVelocityKmS: 84.2,
    distanceLy: 1470,
    apparentMagnitude: 11.7,
    absoluteMagnitude: 3.4,
    surfaceGravityLogG: 4.0,
    colorHex: '#fff7cc',
    coronaColorHex: '#fef08a',
    solarEngulfment: 'Spans ~2.20 Million km (~0.0147 AU diameter), comfortably orbiting well inside Mercury’s orbit (~57.9M km).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1.85, outer: 2.75 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      debrisDisk: true,
      debrisDiskDescription: 'Irregular swarm of fine circumstellar dust clouds and disintegrating exo-comet fragments producing non-periodic 22% drops in brightness.',
      systemOverview: 'F-type main-sequence star in Cygnus with a wide M-dwarf companion (KIC 8462852 B) at ~880 AU, famous for mysterious, deep transits.',
      planets: []
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '~3.5 Billion Years',
    futureFate: 'Subgiant → Red Giant → Carbon-Oxygen White Dwarf',
    fusionProcess: 'Hydrogen Fusion via CNO Cycle and Proton–Proton Chain in Core',
    notableFacts: [
      'Famous for irregular, non-periodic dips in brightness of up to 22%, which initially sparked worldwide astronomical speculation ranging from alien megastructures to catastrophic planetary collisions.',
      'Multi-wavelength observations confirmed the dimming is chromatic (greater in ultraviolet and blue light than red/infrared), proving the blockage is caused by microscopic circumstellar dust grains and evaporating exo-comet swarms.',
      'Discovered through citizen science by astronomer Tabetha Boyajian and the Planet Hunters team analyzing data from NASA’s Kepler space telescope.',
      'Has a wide, gravitationally bound red dwarf companion (KIC 8462852 B) at roughly 880 AU that may trigger gravitational perturbations in its outer cometary reservoir.'
    ],
    description: 'An F-type dwarf in Cygnus renowned for mysterious, deep brightness fluctuations caused by circumstellar dust and fragmented exo-comets.'
  }),

  // 21. Alcyone (Eta Tauri) - Radiant Jewel of the Pleiades
  makeStar({
    id: 'alcyone',
    name: 'Alcyone (Eta Tauri)',
    alternateNames: ['Eta Tauri', 'η Tau', '25 Tauri', 'Brightest Star of the Pleiades', 'HD 23630', 'HIP 17702'],
    bayerDesignation: 'η Tau',
    constellation: 'Taurus',
    diameterSolar: 9.3,
    temperature: 12258,
    spectralType: 'B7IIIe',
    spectralClass: 'B',
    luminositySolar: 2030,
    massSolar: 6.0,
    estimatedAge: '100 Million Years',
    estimatedAgeMyr: 100,
    metallicityFeH: 0.05,
    rotationalVelocityKmS: 215,
    distanceLy: 440,
    apparentMagnitude: 2.87,
    absoluteMagnitude: -2.62,
    surfaceGravityLogG: 3.5,
    colorHex: '#93c5fd',
    coronaColorHex: '#60a5fa',
    solarEngulfment: 'Spans ~12.95 Million km (~0.0865 AU diameter), extending roughly 22% of the distance to Mercury\'s orbit.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 38.0, outer: 72.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      debrisDisk: true,
      debrisDiskDescription: 'Thick circumstellar decretion disk of hot ionized hydrogen gas flung out by rapid centrifugal rotation, glowing in bright emission lines.',
      systemOverview: 'Multiple star system anchoring the center of the Pleiades open cluster (M45), surrounded by magnificent reflection nebulae.',
      planets: []
    },
    stellarStage: 'Bright Giant',
    lifespanEstimate: '~120 Million Years',
    futureFate: 'Massive Neon-Oxygen White Dwarf (or Supernova Progenitor)',
    fusionProcess: 'Hydrogen Fusion via CNO Cycle in Dense Convective Core',
    notableFacts: [
      'The brightest and most massive star in the famous Pleiades open cluster (the Seven Sisters, Messier 45), casting its brilliant light across the cluster reflection nebulae.',
      'A classic "Be star" spinning at over 215 km/s—so fast that centrifugal acceleration squashes its equator and has flung a glowing circumstellar disk of ionized hydrogen into orbit.',
      'Forms a multiple star system with at least three faint companion stars (Alcyone B, C, and D) orbiting in the cluster.',
      'Centuries of ancient navigators and astronomers across Mediterranean, Polynesian, and Mesoamerican cultures tracked Alcyone and the Pleiades to mark agricultural cycles and seasons.'
    ],
    description: 'The radiant crown jewel of the Pleiades (Seven Sisters), a rapidly spinning Be giant surrounded by a glowing gas disk.'
  }),

  // 22. Hulse-Taylor Binary Pulsar (PSR B1913+16) - Nobel Prize Gravitational Waves!
  makeStar({
    id: 'hulse-taylor-pulsar',
    name: 'Hulse-Taylor Pulsar (PSR B1913+16)',
    alternateNames: ['PSR J1915+1606', 'The Nobel Binary Pulsar'],
    constellation: 'Aquila',
    diameterSolar: 0.000014, // 20 km
    diameterKm: 20,
    temperature: 1000000,
    spectralType: 'Pulsar (Binary NS)',
    spectralClass: 'NS',
    luminositySolar: 0.0001,
    massSolar: 1.44, // 1.44 M☉
    estimatedAge: '100 Million Years',
    estimatedAgeMyr: 100,
    rotationalVelocityKmS: 3600.0, // 17 spins per second (59 ms period)
    distanceLy: 21000,
    apparentMagnitude: 22.0,
    absoluteMagnitude: 13.0,
    surfaceGravityLogG: 14.2,
    colorHex: '#06b6d4',
    coronaColorHex: '#67e8f9',
    solarEngulfment: 'Engulfs no planets (20 km diameter ultra-dense neutron core).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.008, outer: 0.016 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'First binary pulsar ever discovered: two neutron stars orbiting each other every 7.75 hours with high eccentricity (e = 0.617).',
      planets: []
    },
    stellarStage: 'Neutron Star / Pulsar',
    lifespanEstimate: 'Hundreds of Millions of Years',
    futureFate: 'Kilonova Merger (in ~300 Million Years)',
    fusionProcess: 'None (Neutron-Degenerate Matter)',
    notableFacts: [
      'Discovered in 1974 by Russell Hulse and Joseph Taylor at Arecibo Observatory, earning them the 1993 Nobel Prize in Physics.',
      'The decay of its 7.75-hour orbit (decreasing by 76.5 microseconds per year) matched Einstein’s general relativity predictions for gravitational radiation to within 0.2%, providing the first-ever experimental proof of gravitational waves.',
      'The two neutron stars are doomed to spiral together and collide in approximately 300 million years, producing a brilliant kilonova and gravitational wave burst.'
    ],
    description: 'The historic Nobel-prize winning binary pulsar whose orbital decay provided the first experimental proof of gravitational waves.'
  }),

  // 23. RX J1856.3-3754 - Closest Known Neutron Star! (~400 ly)
  makeStar({
    id: 'rx-j1856-3754',
    name: 'RX J1856.3-3754',
    alternateNames: ['Walter’s Star', 'The Magnificent Seven #1'],
    constellation: 'Corona Australis',
    diameterSolar: 0.000010, // ~14 km diameter
    diameterKm: 14,
    temperature: 434000, // 434,000 K
    spectralType: 'Neutron Star (INS)',
    spectralClass: 'NS',
    luminositySolar: 0.00005,
    massSolar: 1.40,
    estimatedAge: '400,000 Years',
    estimatedAgeMyr: 0.4,
    distanceLy: 400, // ~123 parsecs
    apparentMagnitude: 25.6, // optical
    absoluteMagnitude: 15.2,
    surfaceGravityLogG: 14.3,
    colorHex: '#38bdf8',
    coronaColorHex: '#7dd3fc',
    solarEngulfment: 'Engulfs no planets (14 km diameter neutron sphere).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.005, outer: 0.012 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Isolated, non-accreting cooling neutron star moving through interstellar space at 108 km/s.',
      planets: []
    },
    stellarStage: 'Neutron Star / Pulsar',
    lifespanEstimate: 'Trillions of Years',
    futureFate: 'Cold Dead Neutron Star',
    fusionProcess: 'None (Thermal Radiative Cooling)',
    notableFacts: [
      'The closest known neutron star to Earth, located just 400 light-years away in Corona Australis.',
      'Prototype and brightest member of "The Magnificent Seven"—a group of isolated, radio-quiet thermal neutron stars.',
      'Discovered in 1992 by the ROSAT X-ray satellite, showing an immaculate blackbody thermal spectrum completely free of magnetospheric complications.'
    ],
    description: 'The closest known neutron star to Earth, radiating pure thermal X-rays 400 light-years away in Corona Australis.'
  }),

  // 24. PSR B1509-58 ("Hand of God" Pulsar)
  makeStar({
    id: 'psr-b1509-58',
    name: 'PSR B1509-58 (Hand of God)',
    alternateNames: ['PSR J1513-5908', 'Compass Pulsar'],
    constellation: 'Circinus',
    diameterSolar: 0.000014, // 20 km
    diameterKm: 20,
    temperature: 1500000,
    spectralType: 'Pulsar (P0)',
    spectralClass: 'NS',
    luminositySolar: 0.0005,
    massSolar: 1.50,
    estimatedAge: '1,700 Years',
    estimatedAgeMyr: 0.0017,
    rotationalVelocityKmS: 9000.0, // 7 spins per second (151 ms period)
    distanceLy: 17000,
    apparentMagnitude: 24.0,
    absoluteMagnitude: 14.0,
    surfaceGravityLogG: 14.3,
    colorHex: '#818cf8',
    coronaColorHex: '#a5b4fc',
    solarEngulfment: 'Engulfs no planets (20 km diameter neutron star).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.015, outer: 0.035 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      debrisDisk: true,
      debrisDiskDescription: 'Enormous 150-light-year pulsar wind nebula shaped like a human hand ("Hand of God").',
      systemOverview: 'Young energetic pulsar powering one of the most famous pulsar wind nebulae in high-energy astrophysics.',
      planets: []
    },
    stellarStage: 'Neutron Star / Pulsar',
    lifespanEstimate: 'Millions of Years',
    futureFate: 'Cold Inactive Neutron Star',
    fusionProcess: 'None (Relativistic Dipole Spin-Down)',
    notableFacts: [
      'Powers the awe-inspiring 150-light-year-wide X-ray nebula imaged by the Chandra X-ray Observatory that resembles a giant human hand reaching into space.',
      'Possesses an immense magnetic field of 1.5 × 10¹² Gauss (15 trillion times Earth’s field).',
      'Born in a dramatic core-collapse supernova approximately 1,700 years ago.'
    ],
    description: 'A young pulsar in Circinus famous for powering the breathtaking 150-light-year "Hand of God" X-ray nebula.'
  }),

  // 25. BPM 37093 ("Lucy" - Cosmic Diamond White Dwarf)
  makeStar({
    id: 'bpm-37093',
    name: 'BPM 37093 ("Lucy")',
    alternateNames: ['V886 Centauri', 'WD 1250-565'],
    constellation: 'Centaurus',
    diameterSolar: 0.00574, // ~8,000 km (0.00574 D☉, slightly smaller than Earth)
    diameterKm: 8000,
    temperature: 11730,
    spectralType: 'DAV4',
    spectralClass: 'WD',
    luminositySolar: 0.0014,
    massSolar: 1.10,
    estimatedAge: '4.5 Billion Years',
    estimatedAgeMyr: 4500,
    distanceLy: 53,
    apparentMagnitude: 14.0,
    absoluteMagnitude: 13.0,
    surfaceGravityLogG: 8.8,
    colorHex: '#e0f2fe',
    coronaColorHex: '#bae6fd',
    solarEngulfment: 'Engulfs no planets (0.00574 D☉ = 8,000 km diameter).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.03, outer: 0.06 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Pulsating variable DAV white dwarf whose carbon-oxygen core is crystallized into solid diamond.',
      planets: []
    },
    stellarStage: 'White Dwarf',
    lifespanEstimate: 'Hundreds of Trillions of Years',
    futureFate: 'Cold Diamond Black Dwarf',
    fusionProcess: 'None (Degenerate Electron Cooling)',
    notableFacts: [
      'Nicknamed "Lucy" after the Beatles song "Lucy in the Sky with Diamonds" by Travis Metcalfe and his team at the Harvard-Smithsonian Center for Astrophysics in 2004.',
      'Asteroseismological pulsations proved that over 90% of the star’s massive carbon and oxygen interior has crystallized into a solid lattice—a cosmic diamond of 10³⁴ carats (5 trillion trillion trillion carats).',
      'One of the most massive white dwarfs known at 1.10 solar masses, compressed by gravity into a volume smaller than planet Earth.'
    ],
    description: 'The famous "diamond star" in Centaurus whose ultra-dense carbon core has crystallized into a 10³⁴-carat cosmic diamond.'
  }),

  // 26. LP 40-365 (GD 492) - Hypervelocity Supernova Shrapnel
  makeStar({
    id: 'lp-40-365',
    name: 'LP 40-365 (GD 492)',
    alternateNames: ['GD 492', 'Gaia DR2 59326233400561536'],
    constellation: 'Ursa Minor',
    diameterSolar: 0.16, // swollen low-density remnant
    temperature: 9800,
    spectralType: 'WD',
    spectralClass: 'WD',
    luminositySolar: 0.18,
    massSolar: 0.28,
    estimatedAge: '50 Million Years (Post-Explosion)',
    estimatedAgeMyr: 50,
    rotationalVelocityKmS: 850.0, // Galactic escape velocity!
    distanceLy: 2000,
    apparentMagnitude: 15.6,
    absoluteMagnitude: 6.7,
    surfaceGravityLogG: 5.5,
    colorHex: '#e2e8f0',
    coronaColorHex: '#cbd5e1',
    solarEngulfment: 'Engulfs no planets (0.16 D☉ = 222,000 km).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.35, outer: 0.70 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Hypervelocity runaway star escaping the Milky Way galaxy at 850 km/s.',
      planets: []
    },
    stellarStage: 'White Dwarf',
    lifespanEstimate: 'Trillions of Years',
    futureFate: 'Intergalactic Drift (Ejected into Intergalactic Space)',
    fusionProcess: 'None (Post-Supernova Cooling)',
    notableFacts: [
      'The surviving "shrapnel" remnant of a failed sub-luminous Type Iax supernova, where a white dwarf partially exploded without completely destroying itself.',
      'Hurtling through space at an astonishing 850 km/s (nearly 2 million mph)—well above the escape velocity of the Milky Way galaxy.',
      'Its atmosphere is composed entirely of intermediate-mass thermonuclear ash: oxygen, neon, magnesium, silicon, and iron, lacking all hydrogen and helium.'
    ],
    description: 'A hypervelocity shrapnel white dwarf escaping the Milky Way at 850 km/s after surviving a Type Iax supernova.'
  }),

  // 27. WD 1856+534 - White Dwarf with Intact Giant Planet!
  makeStar({
    id: 'wd-1856-534',
    name: 'WD 1856+534',
    alternateNames: ['LP 141-14', 'TIC 267574917'],
    constellation: 'Draco',
    diameterSolar: 0.013, // Earth-sized
    diameterKm: 18000,
    temperature: 4700,
    spectralType: 'DC',
    spectralClass: 'WD',
    luminositySolar: 0.00013,
    massSolar: 0.52,
    estimatedAge: '5.9 Billion Years (Cooling Age ~3 Gyr)',
    estimatedAgeMyr: 5900,
    distanceLy: 132,
    apparentMagnitude: 15.8,
    absoluteMagnitude: 14.5,
    surfaceGravityLogG: 7.9,
    colorHex: '#fef08a',
    coronaColorHex: '#fef9c3',
    solarEngulfment: 'Engulfs no planets (0.013 D☉ = 18,000 km).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.01, outer: 0.02 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 1,
      systemOverview: 'First confirmed intact giant planet closely transiting a white dwarf star, discovered by NASA’s TESS mission in 2020.',
      planets: [
        {
          name: 'WD 1856+534 b',
          type: 'Gas Giant / Jupiter-analogue',
          mass: '~9.0 M_J',
          radius: '1.04 R_J (Over 7x larger than the star itself!)',
          orbitalPeriodDays: 1.408,
          semiMajorAxisAU: 0.0204,
          habitableZoneStatus: 'Conservative Habitable Zone',
          discoveryYear: 2020,
          discoveryMethod: 'Transit',
          confirmed: true,
          description: 'A giant planet that survived the red giant engulfment of its host star, orbiting every 34 hours and blocking 56% of the star’s light during transit.'
        }
      ]
    },
    stellarStage: 'White Dwarf',
    lifespanEstimate: 'Trillions of Years',
    futureFate: 'Black Dwarf',
    fusionProcess: 'None',
    notableFacts: [
      'In 2020, NASA’s TESS satellite discovered WD 1856+534 b—the first confirmed intact planet closely orbiting a white dwarf.',
      'Because the planet is over 7 times larger in diameter than the Earth-sized white dwarf, each transit causes a staggering 56% drop in stellar brightness.',
      'Demonstrates that gas giant planets can survive the chaotic red giant evolution and migration phases of their parent stars.'
    ],
    description: 'A cool white dwarf in Draco famous for hosting the first confirmed surviving giant exoplanet.'
  }),

  // 28. WD 1145+017 - Disintegrating Planetesimals!
  makeStar({
    id: 'wd-1145-017',
    name: 'WD 1145+017',
    alternateNames: ['EPIC 201563164'],
    constellation: 'Virgo',
    diameterSolar: 0.014,
    temperature: 15900,
    spectralType: 'DBZ',
    spectralClass: 'WD',
    luminositySolar: 0.005,
    massSolar: 0.60,
    estimatedAge: '175 Million Years (Cooling Age)',
    estimatedAgeMyr: 175,
    distanceLy: 570,
    apparentMagnitude: 17.0,
    absoluteMagnitude: 10.9,
    surfaceGravityLogG: 8.0,
    colorHex: '#e0f2fe',
    coronaColorHex: '#bae6fd',
    solarEngulfment: 'Engulfs no planets (0.014 D☉ = 19,500 km).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.06, outer: 0.12 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 6,
      candidateCount: 4,
      debrisDisk: true,
      debrisDiskDescription: 'Thick circumstellar accretion disk of vaporized rocky rubble, minerals, and comet-like dust streams.',
      systemOverview: 'Active planetary graveyard: Kepler/K2 detected multiple transiting rocky planetesimals actively breaking apart under tidal forces.',
      planets: [
        {
          name: 'WD 1145+017 b (Disintegrating Planetesimal)',
          type: 'Terrestrial / Ceres-sized Core',
          mass: '~0.0001 M⊕',
          radius: '~200 km core with huge dust cloud',
          orbitalPeriodDays: 0.1875, // 4.5 hours!
          semiMajorAxisAU: 0.0054,
          habitableZoneStatus: 'Too Hot',
          discoveryYear: 2015,
          discoveryMethod: 'Transit',
          confirmed: true,
          description: 'A rocky minor planet being shredded by tidal gravitational stress, producing asymmetric comet-like transits up to 40% deep.'
        }
      ]
    },
    stellarStage: 'White Dwarf',
    lifespanEstimate: 'Trillions of Years',
    futureFate: 'Black Dwarf',
    fusionProcess: 'None',
    notableFacts: [
      'Discovered by NASA’s Kepler/K2 mission in 2015, capturing the first direct evidence of rocky planetesimals being shredded and devoured by a white dwarf in real time.',
      'The star’s atmosphere is heavily "polluted" by iron, magnesium, aluminum, and nickel freshly accreted from the disintegrating asteroid rubble.',
      'Multiple fragment debris clouds orbit every 4.5 to 4.9 hours, creating irregular, changing transit dips.'
    ],
    description: 'An iconic white dwarf planetary graveyard caught in the act of actively shredding and consuming rocky asteroids.'
  }),

  // ==========================================
  // METHUSELAH STAR (HD 140283)
  // ==========================================

  // 29. HD 140283 ("Methuselah Star") - Ancient Population II Benchmark
  makeStar({
    id: 'methuselah-star',
    name: 'Methuselah Star (HD 140283)',
    alternateNames: ['HD 140283', 'HIP 76976', 'BD-10°4149'],
    constellation: 'Libra',
    diameterSolar: 2.04,
    temperature: 5787,
    spectralType: 'F3IV',
    spectralClass: 'F',
    luminositySolar: 4.82,
    massSolar: 0.80,
    estimatedAge: '13.7 Billion Years',
    estimatedAgeMyr: 13700,
    metallicityFeH: -2.40, // Only 0.4% the iron abundance of our Sun!
    rotationalVelocityKmS: 3.9,
    distanceLy: 190.1,
    apparentMagnitude: 7.22,
    absoluteMagnitude: 3.41,
    surfaceGravityLogG: 3.65,
    colorHex: '#fff7ed',
    coronaColorHex: '#ffedd5',
    solarEngulfment: 'Extends across 2.04 D☉ (2.84 million km = 0.019 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1.8, outer: 3.4 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Ancient Population II halo subgiant star traveling on an eccentric retrograde orbit around the Milky Way.',
      planets: []
    },
    stellarStage: 'Subgiant',
    lifespanEstimate: '~14.5 Billion Years',
    futureFate: 'Carbon-Oxygen White Dwarf',
    fusionProcess: 'Hydrogen Shell Burning (Subgiant Phase)',
    notableFacts: [
      'Known famously as the "Methuselah Star"—the oldest known star in the universe with a precisely calibrated age (~13.7 ± 0.8 billion years, formed shortly after the Big Bang).',
      'Extreme metal-poor Population II benchmark with a metallicity of [Fe/H] = -2.40 (less than 1/250th the metal content of our Sun).',
      'Plunges through the local galactic plane at an extraordinary velocity of 361 km/s (800,000 mph) along an eccentric galactic halo trajectory.'
    ],
    description: 'The celebrated "Methuselah Star", an ancient Population II subgiant in Libra born shortly after the Cosmic Dawn.'
  }),

  // ==========================================
  // HV 11417 (Thorne–Żytkow Object)
  // ==========================================

  // 30. HV 11417 (PMMR 37) - Thorne–Żytkow Object in Small Magellanic Cloud
  makeStar({
    id: 'hv-11417',
    name: 'HV 11417',
    alternateNames: ['PMMR 37', 'SMC HV 11417', '2MASS J00541777-7241496'],
    constellation: 'Tucana',
    diameterSolar: 910.0,
    temperature: 3450,
    spectralType: 'M1I',
    spectralClass: 'M',
    luminositySolar: 75000.0,
    massSolar: 17.5, // ~16 M☉ supergiant envelope + 1.4 M☉ neutron star core
    estimatedAge: '10.0 Million Years',
    estimatedAgeMyr: 10,
    metallicityFeH: -0.65, // SMC metallicity
    distanceLy: 199000,
    apparentMagnitude: 12.8,
    absoluteMagnitude: -6.1,
    surfaceGravityLogG: 0.1,
    colorHex: '#f97316',
    coronaColorHex: '#fb923c',
    solarEngulfment: 'Engulfs Mercury, Venus, Earth, Mars, and the Asteroid Belt, spanning 4.23 AU in diameter (1.27 billion km).',
    engulfsPlanets: ['Mercury', 'Venus', 'Earth', 'Mars'],
    habitableZoneAU: { inner: 240.0, outer: 450.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      debrisDisk: true,
      debrisDiskDescription: 'Enormous convective red supergiant envelope surrounding an inner neutron star accretion boundary.',
      systemOverview: 'The leading astronomical candidate for a Thorne–Żytkow Object (TŻO): a red supergiant containing a degenerate neutron star embedded within its core.',
      planets: []
    },
    stellarStage: 'Thorne–Żytkow Object',
    lifespanEstimate: '< 100,000 Years (TŻO Phase)',
    futureFate: 'Core Collapse into Black Hole / Massive Explosion',
    fusionProcess: 'Interrupted Rapid Proton Capture (irp-process) at Neutron Core Surface',
    notableFacts: [
      'In 2014, astronomers Emily Levesque, Philip Massey, Anna Żytkow et al. discovered that HV 11417 in the Small Magellanic Cloud exhibits the exact, bizarre chemical signature predicted by Kip Thorne and Anna Żytkow in 1977.',
      'Displays massive overabundances of rubidium, lithium, molybdenum, and strontium—elements that cannot be synthesized in normal red supergiants and require the unique convection and extreme neutron flux of a neutron star embedded within a stellar core.',
      'Formed when a runaway neutron star collided with or spiraled into the center of a red supergiant companion in a dense binary system.',
      'Predicted to live only 10,000 to 100,000 years before the neutron star swallows the core entirely, triggering a collapse into a black hole or a rare supernova-like burst.'
    ],
    description: 'The premier candidate for a Thorne–Żytkow Object: a colossal red supergiant in the Small Magellanic Cloud with a neutron star spinning inside its core.'
  })
];
