import { StarData } from '../types';
import { makeStar } from './starHelper';

/**
 * STARS_SUBDWARFS_AND_HISTORICAL_DESIGNATIONS
 * A rich catalog of:
 * 1. Metal-poor Subdwarfs & Population II / Primordial Halo Relics (Groombridge 1830, SMSS J0313-6708, Caffau's Star, Sneden's Star, Cayrel's Star, etc.)
 * 2. Classic Flamsteed & Bayer Stars with historical exoplanets / astrometric heritage (18 Scorpii, 61 Virginis, 70 Ophiuchi, 55 Cancri, 47 Ursae Majoris, etc.)
 * 3. Southern Gould Designation Stars from Uranometria Argentina (14 G. Crateris, 23 G. Carinae, 145 G. Hydrae, 171 G. Arae, etc.)
 */
export const STARS_SUBDWARFS_AND_HISTORICAL_DESIGNATIONS: StarData[] = [
  // ==========================================
  // SECTION 1: POPULATION II SUBDWARFS & HALO STARS
  // ==========================================

  // 1. Groombridge 1830 (Archetype High-Velocity Halo Subdwarf)
  makeStar({
    id: 'groombridge-1830',
    name: 'Groombridge 1830',
    alternateNames: ['CF Ursae Majoris', 'HD 103095', 'HR 4550', 'HIP 57939', 'Giclas 122-51'],
    bayerDesignation: undefined,
    flamsteedDesignation: undefined,
    constellation: 'Ursa Major',
    diameterSolar: 0.64,
    temperature: 5080,
    spectralType: 'sdG8V',
    spectralClass: 'G',
    luminositySolar: 0.20,
    massSolar: 0.66,
    estimatedAge: '12.5 Billion Years',
    estimatedAgeMyr: 12500,
    metallicityFeH: -1.35,
    rotationalVelocityKmS: 1.8,
    distanceLy: 29.9,
    apparentMagnitude: 6.42,
    absoluteMagnitude: 6.61,
    surfaceGravityLogG: 4.60,
    colorHex: '#ffc682',
    coronaColorHex: '#ffba6a',
    solarEngulfment: 'Spans roughly 891,000 km (~0.0059 AU), smaller and denser than normal main-sequence solar analogs.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.40, outer: 0.62 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Ancient Population II halo subdwarf exhibiting flare activity despite an age over 12 billion years.',
      planets: []
    },
    stellarStage: 'Subdwarf',
    lifespanEstimate: '50 Billion Years',
    futureFate: 'Helium White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion (Metal-Poor Proton-Proton Chain)',
    notableFacts: [
      'The classic archetype of yellow-orange Galactic halo subdwarfs, first cataloged by Stephen Groombridge in 1830.',
      'Races through the solar neighborhood at a staggering space velocity of over 300 km/s on a highly inclined halo orbit.',
      'Held the record for the highest known proper motion (over 7.0 arcseconds/year) until the discovery of Barnard’s Star in 1916.',
      'A flare star variable (CF UMa), demonstrating that ancient subdwarfs can maintain active magnetic dynamos.'
    ],
    description: 'The archetype Population II halo subdwarf in Ursa Major with tremendous space velocity and over 12 billion years of age.'
  }),

  // 2. SMSS J031300.36-670839.3 (Keller's Star - Lowest Iron Abundance Star Known)
  makeStar({
    id: 'smss-j031300',
    name: 'Keller’s Star (SMSS J0313-6708)',
    alternateNames: ['SMSS J031300.36-670839.3', 'SkyMapper Star'],
    constellation: 'Hydrus',
    diameterSolar: 0.88,
    temperature: 5125,
    spectralType: 'sdK',
    spectralClass: 'K',
    luminositySolar: 0.52,
    massSolar: 0.75,
    estimatedAge: '13.6 Billion Years',
    estimatedAgeMyr: 13600,
    metallicityFeH: -7.1, // [Fe/H] upper limit < -7.1 (less than one ten-millionth solar iron!)
    rotationalVelocityKmS: 2.1,
    distanceLy: 6000,
    apparentMagnitude: 14.7,
    absoluteMagnitude: 3.37,
    surfaceGravityLogG: 3.5,
    colorHex: '#ffc682',
    coronaColorHex: '#ffba6a',
    solarEngulfment: 'Spans roughly 1.22 million km (~0.0082 AU), an ancient pristine subgiant/subdwarf.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.65, outer: 1.05 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Formed from gas enriched by just a single low-energy primordial Population III supernova.',
      planets: []
    },
    stellarStage: 'Subdwarf',
    lifespanEstimate: '20 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion in pristine gas',
    notableFacts: [
      'Holds the record for the lowest iron abundance ever measured in any star in the universe ([Fe/H] < -7.1), containing less than one ten-millionth the iron of our Sun.',
      'Believed to be a direct second-generation star born immediately after the universe’s first stars (Population III) went supernova ~13.6 billion years ago.',
      'Discovered in 2014 by Australian astronomer Stefan Keller using the automated SkyMapper survey telescope at Siding Spring Observatory.'
    ],
    description: 'An ancient primordial relic star in Hydrus holding the cosmic record for the lowest iron metallicity ever discovered.'
  }),

  // 3. SDSS J102915+172927 (Caffau's Star - The Star That Shouldn't Exist)
  makeStar({
    id: 'sdss-j102915',
    name: 'Caffau’s Star (SDSS J102915)',
    alternateNames: ['SDSS J102915+172927'],
    constellation: 'Leo',
    diameterSolar: 0.82,
    temperature: 5811,
    spectralType: 'sdF',
    spectralClass: 'F',
    luminositySolar: 0.65,
    massSolar: 0.78,
    estimatedAge: '13.3 Billion Years',
    estimatedAgeMyr: 13300,
    metallicityFeH: -4.89, // Less than 1/20,000th solar metallicity
    rotationalVelocityKmS: 3.0,
    distanceLy: 4400,
    apparentMagnitude: 16.92,
    absoluteMagnitude: 6.27,
    surfaceGravityLogG: 4.5,
    colorHex: '#ffe6c2',
    coronaColorHex: '#ffdeb4',
    solarEngulfment: 'Spans 1.14 million km (~0.0076 AU), an ultra-metal-poor warm subdwarf.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.70, outer: 1.15 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Formed in the early universe without dust-grain cooling, challenging classic star formation thresholds.',
      planets: []
    },
    stellarStage: 'Subdwarf',
    lifespanEstimate: '25 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Pristine Core Hydrogen Fusion',
    notableFacts: [
      'Famously known as "The Star That Shouldn’t Exist" because according to standard star formation theories, gas clouds with such tiny amounts of carbon and oxygen cannot cool efficiently to collapse into low-mass stars.',
      'Metallicity is less than 1/20,000th of the Sun’s composition ([Fe/H] = -4.89).',
      'Discovered by Elisabetta Caffau and colleagues in 2011 using ESO’s Very Large Telescope (VLT) in Chile.'
    ],
    description: 'An ultra-metal-poor warm halo subdwarf in Leo that defied astrophysical theories on how low-mass stars could condense without carbon cooling.'
  }),

  // 4. BPS CS 22892-052 (Sneden’s Star - Ultra-Metal-Poor r-Process Benchmark)
  makeStar({
    id: 'sneden-star',
    name: 'Sneden’s Star (CS 22892-052)',
    alternateNames: ['BPS CS 22892-052', '2MASS J22170158-1639271'],
    constellation: 'Aquarius',
    diameterSolar: 1.25,
    temperature: 4850,
    spectralType: 'sdK0',
    spectralClass: 'K',
    luminositySolar: 1.35,
    massSolar: 0.80,
    estimatedAge: '13.0 Billion Years',
    estimatedAgeMyr: 13000,
    metallicityFeH: -3.1,
    rotationalVelocityKmS: 1.5,
    distanceLy: 15300,
    apparentMagnitude: 15.2,
    absoluteMagnitude: 1.84,
    surfaceGravityLogG: 3.8,
    colorHex: '#ffb764',
    coronaColorHex: '#ffa949',
    solarEngulfment: 'Spans 1.74 million km (~0.0116 AU), an ancient metal-poor halo subdwarf with extreme neutron-capture enrichment.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1.0, outer: 1.6 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Pure stellar laboratory for studying rapid neutron-capture (r-process) nucleosynthesis from early neutron star mergers.',
      planets: []
    },
    stellarStage: 'Subdwarf',
    lifespanEstimate: '18 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core & Shell Hydrogen Fusion',
    notableFacts: [
      'Discovered by Christopher Sneden in 1994, this star showed that heavy r-process elements (europium, thorium, uranium) were synthesized in cosmic events long before iron was abundant.',
      'Its chemical abundance pattern perfectly matches solar r-process abundances from barium to uranium, demonstrating universal physics across 13 billion years.',
      'Acts as a cosmic chronometer allowing nuclear cosmochronology dating of the early Milky Way.'
    ],
    description: 'An ancient halo subdwarf in Aquarius that provided groundbreaking evidence for neutron star merger nucleosynthesis in the early cosmos.'
  }),

  // 5. BPS CS 31082-001 (Cayrel’s Star - Uranium-Rich Chronometer)
  makeStar({
    id: 'cayrel-star',
    name: 'Cayrel’s Star (CS 31082-001)',
    alternateNames: ['BPS CS 31082-001', '2MASS J01293113-1600454'],
    constellation: 'Cetus',
    diameterSolar: 1.30,
    temperature: 4825,
    spectralType: 'sdK1',
    spectralClass: 'K',
    luminositySolar: 1.45,
    massSolar: 0.80,
    estimatedAge: '13.5 Billion Years',
    estimatedAgeMyr: 13500,
    metallicityFeH: -2.9,
    rotationalVelocityKmS: 2.0,
    distanceLy: 14000,
    apparentMagnitude: 11.66,
    absoluteMagnitude: 3.5,
    surfaceGravityLogG: 3.7,
    colorHex: '#ffb764',
    coronaColorHex: '#ffa949',
    solarEngulfment: 'Spans 1.81 million km (~0.0121 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1.05, outer: 1.65 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'First star ever to have its age calculated directly using radioactive Uranium-238 decay.',
      planets: []
    },
    stellarStage: 'Subdwarf',
    lifespanEstimate: '18 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'The first star outside the solar system where the radioactive actinide Uranium-238 was directly detected and measured in high-resolution spectra.',
      'Enabled Roger Cayrel and his team to compute an unambiguous radioactive cosmic age of ~14.0 ± 2.4 billion years.',
      'Ultra-r-process enriched halo subdwarf with an exceptionally pristine thorium and uranium fingerprint.'
    ],
    description: 'A celebrated uranium-bearing Population II subdwarf in Cetus used for radioactive cosmochronology dating of the Milky Way.'
  }),

  // 6. HE 0107-5240 (Christlieb’s Carbon-Enhanced Subdwarf)
  makeStar({
    id: 'he-0107-5240',
    name: 'Christlieb’s Star (HE 0107-5240)',
    alternateNames: ['2MASS J01092916-5224341', 'Hamburg/ESO Star'],
    constellation: 'Phoenix',
    diameterSolar: 1.10,
    temperature: 5100,
    spectralType: 'sdC',
    spectralClass: 'C',
    luminositySolar: 0.95,
    massSolar: 0.80,
    estimatedAge: '13.4 Billion Years',
    estimatedAgeMyr: 13400,
    metallicityFeH: -5.2, // Less than 1/150,000th solar iron
    rotationalVelocityKmS: 2.5,
    distanceLy: 36000,
    apparentMagnitude: 15.86,
    absoluteMagnitude: 5.6,
    surfaceGravityLogG: 3.7,
    colorHex: '#dc2626',
    coronaColorHex: '#ef4444',
    solarEngulfment: 'Spans 1.53 million km (~0.0102 AU), an ancient carbon-enhanced halo subdwarf.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.85, outer: 1.35 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Extremely metal-poor halo star with colossal carbon-to-iron overabundance ([C/Fe] > +4.0).',
      planets: []
    },
    stellarStage: 'Subdwarf',
    lifespanEstimate: '22 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion in carbon-cooled envelope',
    notableFacts: [
      'Discovered in 2002 by Norbert Christlieb, it shattered the record for the lowest metallicity star known at the time ([Fe/H] = -5.2).',
      'Exhibits an enormous excess of carbon and nitrogen relative to iron, pointing to enrichment by a faint primordial supernova that experienced fallback of heavy elements.',
      'Located high in the Galactic halo in Phoenix, over 36,000 light-years away.'
    ],
    description: 'An ancient carbon-enhanced ultra-metal-poor subdwarf in Phoenix from the dawn of Milky Way formation.'
  }),

  // 7. HE 1327-2326 (Frebel’s Star)
  makeStar({
    id: 'he-1327-2326',
    name: 'Frebel’s Star (HE 1327-2326)',
    alternateNames: ['2MASS J13300599-2341497'],
    constellation: 'Hydra',
    diameterSolar: 0.85,
    temperature: 6180,
    spectralType: 'sdF',
    spectralClass: 'F',
    luminositySolar: 0.98,
    massSolar: 0.78,
    estimatedAge: '13.5 Billion Years',
    estimatedAgeMyr: 13500,
    metallicityFeH: -5.6,
    rotationalVelocityKmS: 3.2,
    distanceLy: 4000,
    apparentMagnitude: 13.5,
    absoluteMagnitude: 4.8,
    surfaceGravityLogG: 4.2,
    colorHex: '#fff0d7',
    coronaColorHex: '#ffebd0',
    solarEngulfment: 'Spans 1.18 million km (~0.0079 AU), a fast-moving ancient subdwarf.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.88, outer: 1.40 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Formed from an aspherical hypernova of a zero-metallicity first-generation star.',
      planets: []
    },
    stellarStage: 'Subdwarf',
    lifespanEstimate: '25 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'Discovered in 2005 by Anna Frebel using the Hamburg/ESO survey and the Subaru Telescope.',
      'Has the highest ratio of carbon to iron of any star ([C/Fe] ≈ +4.3), proving that the first supernovae to pollute the universe were energetic and jet-driven.',
      'Orbited the nascent proto-galaxy before the Milky Way disk had even condensed.'
    ],
    description: 'An iconic ultra-metal-poor F-type halo subdwarf in Hydra bearing signatures of the universe’s earliest jet-driven hypernovae.'
  }),

  // ==========================================
  // SECTION 2: CLASSIC FLAMSTEED & BAYER STARS
  // ==========================================

  // 8. 18 Scorpii (Closest Solar Twin in the Sky)
  makeStar({
    id: '18-scorpii',
    name: '18 Scorpii',
    alternateNames: ['HR 6060', 'HD 146233', 'HIP 79672', 'Gliese 616'],
    bayerDesignation: undefined,
    flamsteedDesignation: '18 Sco',
    constellation: 'Scorpius',
    diameterSolar: 1.02,
    temperature: 5800,
    spectralType: 'G2Va',
    spectralClass: 'G',
    luminositySolar: 1.06,
    massSolar: 1.02,
    estimatedAge: '4.2 Billion Years',
    estimatedAgeMyr: 4200,
    metallicityFeH: 0.04,
    rotationalVelocityKmS: 2.2,
    distanceLy: 45.3,
    apparentMagnitude: 5.49,
    absoluteMagnitude: 4.77,
    surfaceGravityLogG: 4.43,
    colorHex: '#fff0a6',
    coronaColorHex: '#ffe885',
    solarEngulfment: 'Nearly an identical twin of our Sun spanning 1.42 million km (~0.0095 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.98, outer: 1.48 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Prime astrobiological search target displaying near-identical solar magnetic cycles and chromospheric activity.',
      planets: []
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '10 Billion Years',
    futureFate: 'Red Giant shedding into a Carbon-Oxygen White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion via Proton-Proton Chain',
    notableFacts: [
      'Widely regarded by astrophysicists as the closest physical and spectral twin of our Sun in the entire night sky.',
      'Has virtually identical mass (1.02 M☉), radius (1.02 R☉), luminosity (1.06 L☉), temperature (5800 K), and metallicity ([Fe/H] = +0.04).',
      'Possesses a 7-year activity cycle strikingly similar to the Sun’s 11-year sunspot cycle, making it the golden standard for solar evolutionary models.',
      'Identified under Flamsteed number 18 in Scorpius; visible to the naked eye under dark suburban skies.'
    ],
    description: 'The premier solar twin in Scorpius bearing Flamsteed designation 18 Sco, nearly a carbon copy of our Sun.'
  }),

  // 9. 61 Virginis (Solar Twin with Multiple Super-Earth Exoplanets)
  makeStar({
    id: '61-virginis',
    name: '61 Virginis',
    alternateNames: ['17 G. Virginis', 'HD 115617', 'HR 5011', 'HIP 64924', 'Gliese 506'],
    bayerDesignation: undefined,
    flamsteedDesignation: '61 Vir',
    gouldDesignation: '17 G. Vir',
    constellation: 'Virgo',
    diameterSolar: 0.98,
    temperature: 5530,
    spectralType: 'G5V',
    spectralClass: 'G',
    luminositySolar: 0.85,
    massSolar: 0.94,
    estimatedAge: '4.6 Billion Years',
    estimatedAgeMyr: 4600,
    metallicityFeH: -0.01,
    rotationalVelocityKmS: 1.9,
    distanceLy: 27.8,
    apparentMagnitude: 4.74,
    absoluteMagnitude: 5.09,
    surfaceGravityLogG: 4.50,
    colorHex: '#ffe899',
    coronaColorHex: '#ffeaad',
    solarEngulfment: 'Spans roughly 1.36 million km (~0.0091 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.85, outer: 1.35 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 3,
      debrisDisk: true,
      debrisDiskDescription: 'A luminous dust and Kuiper-belt analog debris ring spanning 30 to 100 AU.',
      systemOverview: 'A bright naked-eye G-dwarf host star with three confirmed super-Earth / sub-Neptune exoplanets (61 Vir b, c, d).',
      planets: [
        {
          name: '61 Virginis b',
          type: 'Super-Earth',
          mass: '5.1 M⊕',
          orbitalPeriodDays: 4.21,
          semiMajorAxisAU: 0.050,
          habitableZoneStatus: 'Too Hot',
          discoveryYear: 2009,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A hot dense super-Earth orbiting its host star every 4.2 days.'
        },
        {
          name: '61 Virginis c',
          type: 'Sub-Neptune',
          mass: '18.2 M⊕',
          orbitalPeriodDays: 38.02,
          semiMajorAxisAU: 0.217,
          habitableZoneStatus: 'Too Hot',
          discoveryYear: 2009,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A warm sub-Neptune with a mass comparable to Uranus.'
        },
        {
          name: '61 Virginis d',
          type: 'Sub-Saturn',
          mass: '22.9 M⊕',
          orbitalPeriodDays: 123.0,
          semiMajorAxisAU: 0.476,
          habitableZoneStatus: 'Inner Rim',
          discoveryYear: 2009,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A gaseous giant planet orbiting just inside the inner boundary of the habitable zone.'
        }
      ]
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '11 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'Naked-eye yellow dwarf in Virgo bearing Flamsteed designation 61 Vir and Gould designation 17 G. Virginis.',
      'One of the first Sun-like stars discovered to host multiple super-Earth planets without any hot Jupiters.',
      'Possesses a massive cold debris disk roughly twice the size of our solar system’s Kuiper Belt, detected by the Spitzer and Herschel space observatories.'
    ],
    description: 'A bright naked-eye solar twin in Virgo bearing Flamsteed #61, hosting three exoplanets and a prominent debris disk.'
  }),

  // 10. 70 Ophiuchi A (Classic Binary Benchmark)
  makeStar({
    id: '70-ophiuchi-a',
    name: '70 Ophiuchi A',
    alternateNames: ['HR 6752', 'HD 165341', 'HIP 88601', 'Gliese 702 A'],
    bayerDesignation: undefined,
    flamsteedDesignation: '70 Oph A',
    constellation: 'Ophiuchus',
    diameterSolar: 0.90,
    temperature: 5280,
    spectralType: 'K0V',
    spectralClass: 'K',
    luminositySolar: 0.50,
    massSolar: 0.92,
    estimatedAge: '4.8 Billion Years',
    estimatedAgeMyr: 4800,
    metallicityFeH: -0.02,
    rotationalVelocityKmS: 2.1,
    distanceLy: 16.6,
    apparentMagnitude: 4.20,
    absoluteMagnitude: 5.66,
    surfaceGravityLogG: 4.52,
    colorHex: '#ffdd80',
    coronaColorHex: '#ffe8a0',
    solarEngulfment: 'Spans 1.25 million km (~0.0084 AU), primary orange dwarf of a close visual binary.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.65, outer: 1.05 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Famous 88-year period binary system studied by William Herschel in 1804 to prove universal gravitation beyond the solar system.',
      planets: []
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '15 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'A historically momentous binary star: Sir William Herschel used observations of 70 Ophiuchi in 1804 to demonstrate that Newton’s law of universal gravitation applies to distant stars beyond our solar system.',
      'Flamsteed number 70 in Ophiuchus; located only 16.6 light-years from Earth.',
      'Primary star 70 Oph A and its K-dwarf companion 70 Oph B complete a mutual orbit once every 88.4 years.'
    ],
    description: 'The primary orange dwarf in 70 Ophiuchi, the historic binary system that proved universal gravitation across interstellar space.'
  }),

  // 11. 70 Ophiuchi B
  makeStar({
    id: '70-ophiuchi-b',
    name: '70 Ophiuchi B',
    alternateNames: ['HD 165341 B', 'HIP 88601 B', 'Gliese 702 B'],
    bayerDesignation: undefined,
    flamsteedDesignation: '70 Oph B',
    constellation: 'Ophiuchus',
    diameterSolar: 0.70,
    temperature: 4280,
    spectralType: 'K4V',
    spectralClass: 'K',
    luminositySolar: 0.16,
    massSolar: 0.70,
    estimatedAge: '4.8 Billion Years',
    estimatedAgeMyr: 4800,
    metallicityFeH: -0.02,
    rotationalVelocityKmS: 1.6,
    distanceLy: 16.6,
    apparentMagnitude: 6.00,
    absoluteMagnitude: 7.46,
    surfaceGravityLogG: 4.60,
    colorHex: '#ffb366',
    coronaColorHex: '#ffc880',
    solarEngulfment: 'Spans 975,000 km (~0.0065 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.35, outer: 0.60 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Companion star in the historic 70 Ophiuchi binary orbit.',
      planets: []
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '30 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'The cooler orange dwarf companion in the 70 Ophiuchi binary system, separated by an average of 23.2 AU.',
      'Subject of historic 19th-century claims of orbital perturbations and unseen planetary bodies by Captain W. S. Jacob in 1855, one of the earliest exoplanet hypotheses in history.',
      'Shares the same high proper motion and distance of 16.6 light-years as 70 Oph A.'
    ],
    description: 'The secondary K-dwarf companion in the historic 70 Ophiuchi stellar system, located 16.6 light-years away.'
  }),

  // 12. 55 Cancri (Copernicus - Extreme Exoplanetary System)
  makeStar({
    id: '55-cancri',
    name: '55 Cancri (Copernicus)',
    alternateNames: ['Rho-1 Cancri', 'HR 3522', 'HD 75732', 'HIP 43587', 'Gliese 324'],
    bayerDesignation: 'ρ¹ Cnc',
    flamsteedDesignation: '55 Cnc',
    constellation: 'Cancer',
    diameterSolar: 0.94,
    temperature: 5172,
    spectralType: 'K0IV-V',
    spectralClass: 'K',
    luminositySolar: 0.59,
    massSolar: 0.91,
    estimatedAge: '8.6 Billion Years',
    estimatedAgeMyr: 8600,
    metallicityFeH: 0.31, // High metallicity ~200% solar
    rotationalVelocityKmS: 2.4,
    distanceLy: 41.1,
    apparentMagnitude: 5.95,
    absoluteMagnitude: 5.46,
    surfaceGravityLogG: 4.45,
    colorHex: '#ffe08a',
    coronaColorHex: '#ffeaad',
    solarEngulfment: 'Spans 1.31 million km (~0.0088 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.70, outer: 1.15 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 5,
      systemOverview: 'Famous quintuple-exoplanet architecture including lava super-Earth 55 Cnc e (Janssen) and gas giants in habitable orbits.',
      planets: [
        {
          name: '55 Cancri e (Janssen)',
          type: 'Ultra-Short Period Super-Earth',
          mass: '8.0 M⊕',
          radius: '1.88 R⊕',
          orbitalPeriodDays: 0.74,
          semiMajorAxisAU: 0.0154,
          habitableZoneStatus: 'Too Hot',
          discoveryYear: 2004,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A roasting lava world with surface temperatures over 2,500 K, hypothesized to possess a carbon/diamond-rich mantle.'
        },
        {
          name: '55 Cancri b (Galileo)',
          type: 'Hot Jupiter',
          mass: '0.83 M_J',
          orbitalPeriodDays: 14.65,
          semiMajorAxisAU: 0.115,
          habitableZoneStatus: 'Too Hot',
          discoveryYear: 1996,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A gas giant in an inner 14.6-day circular orbit.'
        },
        {
          name: '55 Cancri c (Brahe)',
          type: 'Gas Giant',
          mass: '0.17 M_J',
          orbitalPeriodDays: 44.34,
          semiMajorAxisAU: 0.240,
          habitableZoneStatus: 'Too Hot',
          discoveryYear: 2002,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A warm Saturn-mass planet in an eccentric 44-day orbit.'
        },
        {
          name: '55 Cancri f (Harriot)',
          type: 'Gas Giant',
          mass: '0.14 M_J',
          orbitalPeriodDays: 260.7,
          semiMajorAxisAU: 0.781,
          habitableZoneStatus: 'Conservative Habitable Zone',
          discoveryYear: 2007,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A Neptune/Saturn-class planet residing right in the middle of the star’s habitable zone.'
        },
        {
          name: '55 Cancri d (Lipperhey)',
          type: 'Jupiter-Analogue Gas Giant',
          mass: '3.84 M_J',
          orbitalPeriodDays: 5218.0,
          semiMajorAxisAU: 5.77,
          habitableZoneStatus: 'Beyond Ice Line',
          discoveryYear: 2002,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A massive cold Jupiter analog completing one orbit every 14.3 Earth years.'
        }
      ]
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '14 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'Holds both Bayer designation Rho-1 Cancri and Flamsteed number 55 Cancri; named "Copernicus" by the IAU in 2015.',
      'Hosts one of the most prolific planetary systems discovered in astronomical history, containing 5 confirmed exoplanets ranging from a super-dense lava super-Earth (Janssen) to giant Jupiter analogs.',
      'Its super-Earth 55 Cnc e orbits so closely (every 18 hours) that its dayside is a global magma ocean.',
      'Has a very high metallicity ([Fe/H] = +0.31), meaning it contains more than twice the heavy elements of our Sun.'
    ],
    description: 'An iconic Bayer/Flamsteed star in Cancer hosting a renowned 5-planet exoplanetary system including super-Earth Janssen.'
  }),

  // 13. 47 Ursae Majoris (Chalawan - Early Exoplanetary Discovery)
  makeStar({
    id: '47-ursae-majoris',
    name: '47 Ursae Majoris (Chalawan)',
    alternateNames: ['HR 4277', 'HD 95128', 'HIP 53721', 'Gliese 407'],
    bayerDesignation: undefined,
    flamsteedDesignation: '47 UMa',
    constellation: 'Ursa Major',
    diameterSolar: 1.17,
    temperature: 5882,
    spectralType: 'G1V',
    spectralClass: 'G',
    luminositySolar: 1.54,
    massSolar: 1.03,
    estimatedAge: '6.0 Billion Years',
    estimatedAgeMyr: 6000,
    metallicityFeH: 0.00,
    rotationalVelocityKmS: 2.8,
    distanceLy: 45.3,
    apparentMagnitude: 5.03,
    absoluteMagnitude: 4.29,
    surfaceGravityLogG: 4.31,
    colorHex: '#fff0a6',
    coronaColorHex: '#ffe885',
    solarEngulfment: 'Spans 1.63 million km (~0.0109 AU), a mature solar analog.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1.15, outer: 1.75 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 3,
      systemOverview: 'One of the very first exoplanet systems ever detected (Marcy & Butler in 1996), featuring true Jupiter analogs on circular orbits.',
      planets: [
        {
          name: '47 Ursae Majoris b (Taphao Thong)',
          type: 'Gas Giant',
          mass: '2.53 M_J',
          orbitalPeriodDays: 1078.0,
          semiMajorAxisAU: 2.10,
          habitableZoneStatus: 'Beyond Ice Line',
          discoveryYear: 1996,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A true Jupiter-analog gas giant in a long, calm orbit outside the habitable zone.'
        },
        {
          name: '47 Ursae Majoris c (Taphao Kaew)',
          type: 'Gas Giant',
          mass: '0.54 M_J',
          orbitalPeriodDays: 2391.0,
          semiMajorAxisAU: 3.60,
          habitableZoneStatus: 'Beyond Ice Line',
          discoveryYear: 2001,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A Saturn-mass planet orbiting at 3.6 AU.'
        },
        {
          name: '47 Ursae Majoris d',
          type: 'Gas Giant',
          mass: '1.6 M_J',
          orbitalPeriodDays: 14002.0,
          semiMajorAxisAU: 11.6,
          habitableZoneStatus: 'Beyond Ice Line',
          discoveryYear: 2010,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A cold outer gas giant with an orbit comparable to Saturn and Uranus in our solar system.'
        }
      ]
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '9.5 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'Flamsteed star 47 UMa in Ursa Major, officially christened "Chalawan" by the IAU.',
      'In January 1996, Geoffrey Marcy and R. Paul Butler announced the discovery of 47 UMa b, making this the first true Jupiter-like planet (long period, circular orbit) ever found around a Sun-like star.',
      'Visible to the unaided eye as a 5th-magnitude star located south of the Big Dipper bowl.'
    ],
    description: 'A famous 5th-magnitude solar analog in Ursa Major bearing Flamsteed #47, hosting three Jupiter-analog planets.'
  }),

  // 14. 16 Cygni A (Famous Trinary Primary)
  makeStar({
    id: '16-cygni-a',
    name: '16 Cygni A',
    alternateNames: ['HR 7503', 'HD 186408', 'HIP 96895', 'Gliese 765.1 A'],
    bayerDesignation: undefined,
    flamsteedDesignation: '16 Cyg A',
    constellation: 'Cygnus',
    diameterSolar: 1.22,
    temperature: 5825,
    spectralType: 'G1.5Vb',
    spectralClass: 'G',
    luminositySolar: 1.56,
    massSolar: 1.04,
    estimatedAge: '7.0 Billion Years',
    estimatedAgeMyr: 7000,
    metallicityFeH: 0.10,
    rotationalVelocityKmS: 2.3,
    distanceLy: 68.7,
    apparentMagnitude: 5.96,
    absoluteMagnitude: 4.34,
    surfaceGravityLogG: 4.29,
    colorHex: '#fff0a6',
    coronaColorHex: '#ffe885',
    solarEngulfment: 'Spans 1.70 million km (~0.0114 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1.15, outer: 1.75 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Primary solar twin in the celebrated 16 Cygni hierarchical triple system, benchmark for asteroseismology by NASA’s Kepler mission.',
      planets: []
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '9 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'Flamsteed star 16 Cyg A in Cygnus forms a bright visual binary with 16 Cyg B, with both stars orbited by a distant red dwarf companion (16 Cyg C).',
      'Extensively studied using asteroseismology by the Kepler space telescope, allowing astronomers to image sound waves resonating deep within its convective core.',
      'A mature solar twin that is slightly older and more evolved than our Sun.'
    ],
    description: 'The primary yellow dwarf of the famous 16 Cygni triple system, an asteroseismic benchmark for NASA Kepler.'
  }),

  // 15. 16 Cygni B (Solar Twin with Eccentric Gas Giant)
  makeStar({
    id: '16-cygni-b',
    name: '16 Cygni B',
    alternateNames: ['HR 7504', 'HD 186427', 'HIP 96901', 'Gliese 765.1 B'],
    bayerDesignation: undefined,
    flamsteedDesignation: '16 Cyg B',
    constellation: 'Cygnus',
    diameterSolar: 1.12,
    temperature: 5750,
    spectralType: 'G3V',
    spectralClass: 'G',
    luminositySolar: 1.25,
    massSolar: 1.01,
    estimatedAge: '7.0 Billion Years',
    estimatedAgeMyr: 7000,
    metallicityFeH: 0.08,
    rotationalVelocityKmS: 2.1,
    distanceLy: 68.9,
    apparentMagnitude: 6.20,
    absoluteMagnitude: 4.58,
    surfaceGravityLogG: 4.35,
    colorHex: '#fff0a6',
    coronaColorHex: '#ffe885',
    solarEngulfment: 'Spans 1.56 million km (~0.0104 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1.05, outer: 1.60 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 1,
      systemOverview: 'Host star to 16 Cygni Bb, a massive gas giant on one of the most eccentric orbits known (e = 0.69).',
      planets: [
        {
          name: '16 Cygni Bb',
          type: 'Eccentric Jovian Gas Giant',
          mass: '1.78 M_J',
          orbitalPeriodDays: 798.5,
          semiMajorAxisAU: 1.68,
          habitableZoneStatus: 'Conservative Habitable Zone',
          discoveryYear: 1996,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A giant planet swinging on a comet-like eccentric orbit (e = 0.69) induced by Kozai-Lidov gravitational perturbations from companion star 16 Cyg A.'
        }
      ]
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '9.5 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'Twin companion to 16 Cyg A, located 860 AU away.',
      'Hosts 16 Cygni Bb, one of the earliest exoplanets discovered (1996) and famous for its extreme orbital eccentricity (e = 0.69), which brings it from 0.54 AU out to 2.8 AU.',
      'Chemical analysis shows 16 Cyg A and B have subtly different refractory metal abundances, suggesting 16 Cyg B may have accreted rocky planetary embryos or formed rocky planet cores.'
    ],
    description: 'Twin companion to 16 Cyg A bearing Flamsteed #16, hosting a massive planet in a wildly eccentric orbit.'
  }),

  // 16. Mu Cassiopeiae (Marfak - First Halo Subdwarf Discovered to be Binary)
  makeStar({
    id: 'mu-cassiopeiae',
    name: 'Mu Cassiopeiae (Marfak)',
    alternateNames: ['30 Cassiopeiae', 'HR 321', 'HD 6582', 'HIP 5336', 'Gliese 53'],
    bayerDesignation: 'μ Cas',
    flamsteedDesignation: '30 Cas',
    constellation: 'Cassiopeia',
    diameterSolar: 0.79,
    temperature: 5310,
    spectralType: 'G5VI',
    spectralClass: 'G',
    luminositySolar: 0.44,
    massSolar: 0.74,
    estimatedAge: '11.0 Billion Years',
    estimatedAgeMyr: 11000,
    metallicityFeH: -0.80,
    rotationalVelocityKmS: 2.2,
    distanceLy: 24.6,
    apparentMagnitude: 5.17,
    absoluteMagnitude: 5.78,
    surfaceGravityLogG: 4.54,
    colorHex: '#ffdd8a',
    coronaColorHex: '#ffe8a8',
    solarEngulfment: 'Spans roughly 1.10 million km (~0.0073 AU), an under-luminous Population II subdwarf.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.60, outer: 0.95 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'A nearby high-velocity halo subdwarf orbited by an ultracool red dwarf companion (Mu Cas B).',
      planets: []
    },
    stellarStage: 'Subdwarf',
    lifespanEstimate: '25 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'Bearing both Bayer designation μ Cas and Flamsteed number 30 Cas, this is one of the closest and brightest Population II halo subdwarfs in the sky (24.6 ly).',
      'Has a very high proper motion (3.78 arcseconds/year) and space velocity of 167 km/s relative to the Sun.',
      'Spectroscopic analysis revealed it is a subdwarf binary system: its companion Mu Cas B has a mass of only 0.17 M☉ and orbits every 21.4 years.'
    ],
    description: 'A prominent naked-eye halo subdwarf in Cassiopeia bearing Bayer μ and Flamsteed #30, only 24.6 light-years away.'
  }),

  // 17. 54 Piscium (Bayer & Flamsteed host with Brown Dwarf Companion)
  makeStar({
    id: '54-piscium',
    name: '54 Piscium',
    alternateNames: ['HD 3651', 'HR 166', 'HIP 3093', 'Gliese 27'],
    bayerDesignation: undefined,
    flamsteedDesignation: '54 Psc',
    constellation: 'Pisces',
    diameterSolar: 0.86,
    temperature: 5130,
    spectralType: 'K0V',
    spectralClass: 'K',
    luminositySolar: 0.52,
    massSolar: 0.79,
    estimatedAge: '5.9 Billion Years',
    estimatedAgeMyr: 5900,
    metallicityFeH: 0.08,
    rotationalVelocityKmS: 1.8,
    distanceLy: 36.1,
    apparentMagnitude: 5.88,
    absoluteMagnitude: 5.65,
    surfaceGravityLogG: 4.48,
    colorHex: '#ffdd80',
    coronaColorHex: '#ffe8a0',
    solarEngulfment: 'Spans 1.20 million km (~0.0080 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.65, outer: 1.05 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 1,
      systemOverview: 'Hosts a Saturn-mass exoplanet 54 Psc b and a widely separated Class T methane brown dwarf companion.',
      planets: [
        {
          name: '54 Piscium b',
          type: 'Saturn-Mass Exoplanet',
          mass: '0.23 M_J',
          orbitalPeriodDays: 62.2,
          semiMajorAxisAU: 0.296,
          habitableZoneStatus: 'Too Hot',
          discoveryYear: 2003,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A sub-Saturn planet orbiting every 62.2 days with an eccentric orbit (e = 0.61).'
        }
      ]
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '18 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'Flamsteed number 54 in Pisces, visible without binoculars under dark skies.',
      'In 2006, astronomers using the Spitzer Space Telescope directly imaged 54 Piscium B, a methane T-dwarf (T7.5) brown dwarf orbiting at 476 AU—the first brown dwarf ever found in a star system with a known exoplanet.',
      'The gravitational Kozai interaction with the brown dwarf companion is likely responsible for pumping the eccentricity of planet 54 Psc b up to e = 0.61.'
    ],
    description: 'A 5th-magnitude orange dwarf in Pisces bearing Flamsteed #54, hosting an eccentric planet and a directly imaged T-dwarf companion.'
  }),

  // 18. 36 Ophiuchi A (Triple Orange Dwarf System)
  makeStar({
    id: '36-ophiuchi-a',
    name: '36 Ophiuchi A',
    alternateNames: ['HD 155886', 'HR 6402', 'HIP 84405', 'Gliese 663 A'],
    bayerDesignation: undefined,
    flamsteedDesignation: '36 Oph A',
    constellation: 'Ophiuchus',
    diameterSolar: 0.81,
    temperature: 5100,
    spectralType: 'K1V',
    spectralClass: 'K',
    luminositySolar: 0.28,
    massSolar: 0.85,
    estimatedAge: '4.5 Billion Years',
    estimatedAgeMyr: 4500,
    metallicityFeH: -0.10,
    rotationalVelocityKmS: 2.0,
    distanceLy: 19.5,
    apparentMagnitude: 5.07,
    absoluteMagnitude: 6.18,
    surfaceGravityLogG: 4.54,
    colorHex: '#ffdd80',
    coronaColorHex: '#ffe8a0',
    solarEngulfment: 'Spans 1.13 million km (~0.0075 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.50, outer: 0.80 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Triple orange dwarf star system only 19.5 light-years from Earth.',
      planets: []
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '20 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'Flamsteed number 36 in Ophiuchus; forms a close pair with 36 Oph B (orbiting every ~570 years), accompanied by 36 Oph C at 700 AU.',
      'One of the closest triple star systems to Earth at just 19.5 light-years.',
      'Both primary components show active starspots and chromospheric emission lines.'
    ],
    description: 'The primary orange dwarf of the nearby 36 Ophiuchi triple system, bearing Flamsteed #36 at 19.5 light-years distance.'
  }),

  // 19. 107 Piscium (Nearby Solar Analog)
  makeStar({
    id: '107-piscium',
    name: '107 Piscium',
    alternateNames: ['HR 493', 'HD 10476', 'HIP 7981', 'Gliese 68'],
    bayerDesignation: undefined,
    flamsteedDesignation: '107 Psc',
    constellation: 'Pisces',
    diameterSolar: 0.80,
    temperature: 5240,
    spectralType: 'K1V',
    spectralClass: 'K',
    luminositySolar: 0.46,
    massSolar: 0.83,
    estimatedAge: '6.0 Billion Years',
    estimatedAgeMyr: 6000,
    metallicityFeH: -0.06,
    rotationalVelocityKmS: 1.7,
    distanceLy: 24.4,
    apparentMagnitude: 5.24,
    absoluteMagnitude: 5.87,
    surfaceGravityLogG: 4.52,
    colorHex: '#ffdd80',
    coronaColorHex: '#ffe8a0',
    solarEngulfment: 'Spans 1.11 million km (~0.0074 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.62, outer: 0.98 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Single orange dwarf with very low magnetic activity, prime astrobiology candidate.',
      planets: []
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '22 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'One of the highest Flamsteed numbers in the classical catalog (#107 in Pisces).',
      'Located only 24.4 light-years away; an extraordinarily quiet, stable K-dwarf without flares or aggressive stellar winds.',
      'Ranked as a top Tier 1 target for the Terrestrial Planet Finder and future direct imaging space telescopes.'
    ],
    description: 'A pristine, ultra-quiet nearby orange dwarf in Pisces bearing Flamsteed #107, located 24.4 light-years away.'
  }),

  // 20. 72 Herculis (Nearby G-Dwarf with High Proper Motion)
  makeStar({
    id: '72-herculis',
    name: '72 Herculis',
    alternateNames: ['HR 6458', 'HD 157214', 'HIP 84862', 'Gliese 672'],
    bayerDesignation: undefined,
    flamsteedDesignation: '72 Her',
    constellation: 'Hercules',
    diameterSolar: 1.05,
    temperature: 5590,
    spectralType: 'G0V',
    spectralClass: 'G',
    luminositySolar: 0.90,
    massSolar: 0.95,
    estimatedAge: '7.5 Billion Years',
    estimatedAgeMyr: 7500,
    metallicityFeH: -0.35,
    rotationalVelocityKmS: 2.1,
    distanceLy: 46.9,
    apparentMagnitude: 5.38,
    absoluteMagnitude: 4.59,
    surfaceGravityLogG: 4.41,
    colorHex: '#ffe899',
    coronaColorHex: '#ffeaad',
    solarEngulfment: 'Spans 1.46 million km (~0.0098 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.88, outer: 1.40 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Slightly metal-poor thick-disk solar analog traveling on an inclined galactic orbit.',
      planets: []
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '11 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'Flamsteed number 72 in Hercules, easily spotted with the naked eye.',
      'A member of the Galactic thick disk with lower metallicity ([Fe/H] = -0.35) and high space velocity.',
      'Slightly older than the Sun at ~7.5 billion years, offering insights into solar evolution in middle age.'
    ],
    description: 'A 5th-magnitude solar analog in Hercules bearing Flamsteed #72, belonging to the Milky Way’s thick disk.'
  }),

  // 21. 23 Librae (Long-Period Giant Planet Host)
  makeStar({
    id: '23-librae',
    name: '23 Librae',
    alternateNames: ['HD 134987', 'HR 5657', 'HIP 74500', 'Gliese 579.4'],
    bayerDesignation: undefined,
    flamsteedDesignation: '23 Lib',
    constellation: 'Libra',
    diameterSolar: 1.25,
    temperature: 5585,
    spectralType: 'G5V',
    spectralClass: 'G',
    luminositySolar: 1.45,
    massSolar: 1.05,
    estimatedAge: '8.4 Billion Years',
    estimatedAgeMyr: 8400,
    metallicityFeH: 0.23,
    rotationalVelocityKmS: 2.2,
    distanceLy: 85.4,
    apparentMagnitude: 6.45,
    absoluteMagnitude: 4.36,
    surfaceGravityLogG: 4.25,
    colorHex: '#ffe899',
    coronaColorHex: '#ffeaad',
    solarEngulfment: 'Spans 1.74 million km (~0.0116 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1.10, outer: 1.70 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 2,
      systemOverview: 'Host star to 23 Librae b and c, the latter having one of the longest confirmed planetary orbits (14 years).',
      planets: [
        {
          name: '23 Librae b',
          type: 'Gas Giant',
          mass: '1.59 M_J',
          orbitalPeriodDays: 258.2,
          semiMajorAxisAU: 0.81,
          habitableZoneStatus: 'Inner Rim',
          discoveryYear: 1999,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A Jovian planet orbiting every 258 days in an eccentric orbit.'
        },
        {
          name: '23 Librae c',
          type: 'Jupiter-Analogue Gas Giant',
          mass: '0.82 M_J',
          orbitalPeriodDays: 5000.0,
          semiMajorAxisAU: 5.8,
          habitableZoneStatus: 'Beyond Ice Line',
          discoveryYear: 2009,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A true Jupiter analog orbiting at 5.8 AU over an orbital period of nearly 14 Earth years.'
        }
      ]
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '9.5 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'Flamsteed number 23 in Libra; high metal abundance ([Fe/H] = +0.23).',
      'One of the premier targets of the Anglo-Australian Planet Search, confirming a multi-Jovian system resembling an expanded solar system.',
      'A mature subgiant/dwarf transitioning off the zero-age main sequence.'
    ],
    description: 'An evolved yellow dwarf in Libra bearing Flamsteed #23, hosting two giant planets including a 14-year Jupiter analog.'
  }),

  // ==========================================
  // SECTION 3: GOULD CATALOG STARS (URANOMETRIA ARGENTINA)
  // ==========================================

  // 22. 14 G. Crateris (HD 98800 - Famous Quadruple Proto-planetary System)
  makeStar({
    id: '14-g-crateris',
    name: '14 G. Crateris (HD 98800)',
    alternateNames: ['14 G. Crt', 'HD 98800', 'HIP 55505', 'TWA 4'],
    bayerDesignation: undefined,
    flamsteedDesignation: undefined,
    gouldDesignation: '14 G. Crt',
    constellation: 'Crater',
    diameterSolar: 1.10,
    temperature: 4200,
    spectralType: 'K4V',
    spectralClass: 'K',
    luminositySolar: 0.70,
    massSolar: 0.85,
    estimatedAge: '10 Million Years',
    estimatedAgeMyr: 10,
    metallicityFeH: 0.05,
    rotationalVelocityKmS: 9.5,
    distanceLy: 146.5,
    apparentMagnitude: 8.86,
    absoluteMagnitude: 5.60,
    surfaceGravityLogG: 4.40,
    colorHex: '#ffb366',
    coronaColorHex: '#ffc880',
    solarEngulfment: 'Spans 1.53 million km (~0.0102 AU), a young T Tauri orange dwarf.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.75, outer: 1.20 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      debrisDisk: true,
      debrisDiskDescription: 'A misaligned polar protoplanetary circumbinary disk tilted by 90 degrees relative to the binary orbital plane.',
      systemOverview: 'Hierarchical quadruple young star system in the TW Hydrae Association with a perpendicular polar protoplanetary disk discovered by ALMA.',
      planets: []
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '25 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'Cataloged as star #14 in Crater in Benjamin Gould’s landmark 1879 Uranometria Argentina catalog.',
      'In 2019, the ALMA radio interferometer revealed a protoplanetary disk orbiting the inner binary pair in a wild polar configuration—tilted a perpendicular 90 degrees!',
      'Part of the young TW Hydrae Association (only ~10 million years old), actively forming planets in an extreme 4-star orbital dance.'
    ],
    description: 'Star #14 in Crater from Gould’s Uranometria Argentina, harboring a spectacular 90-degree misaligned polar protoplanetary disk.'
  }),

  // 23. 23 G. Carinae (l Carinae Companion / Gould Benchmark)
  makeStar({
    id: '23-g-carinae',
    name: '23 G. Carinae (HD 84810 Companion)',
    alternateNames: ['23 G. Car', 'HD 85622', 'HIP 48331', 'CD-60 2933'],
    bayerDesignation: undefined,
    flamsteedDesignation: undefined,
    gouldDesignation: '23 G. Car',
    constellation: 'Carina',
    diameterSolar: 1.15,
    temperature: 5850,
    spectralType: 'G1V',
    spectralClass: 'G',
    luminositySolar: 1.35,
    massSolar: 1.05,
    estimatedAge: '4.8 Billion Years',
    estimatedAgeMyr: 4800,
    metallicityFeH: 0.05,
    rotationalVelocityKmS: 2.8,
    distanceLy: 112.0,
    apparentMagnitude: 6.84,
    absoluteMagnitude: 4.15,
    surfaceGravityLogG: 4.33,
    colorHex: '#fff0a6',
    coronaColorHex: '#ffe885',
    solarEngulfment: 'Spans 1.60 million km (~0.0107 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1.05, outer: 1.65 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'A stable solar-type benchmark star in Carina cataloged in the southern Uranometria Argentina.',
      planets: []
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '9.8 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'Numbered star #23 in Carina according to Benjamin Gould’s coordinate-ordered Uranometria Argentina.',
      'Located in the rich southern Carina constellation, representing Gould’s systematic mapping of the southern skies from the Argentine National Observatory in Córdoba.',
      'A quiet, stable main-sequence yellow dwarf star with solar-like metallicity and rotation.'
    ],
    description: 'Star #23 in Carina from Gould’s southern Uranometria Argentina, a solar-type dwarf benchmark.'
  }),

  // 24. 145 G. Hydrae (HD 82943 - Multi-Planet System with Stellar Planet Ingestion)
  makeStar({
    id: '145-g-hydrae',
    name: '145 G. Hydrae (HD 82943)',
    alternateNames: ['145 G. Hya', 'HD 82943', 'HR 3814', 'HIP 47007', 'Gliese 355'],
    bayerDesignation: undefined,
    flamsteedDesignation: undefined,
    gouldDesignation: '145 G. Hya',
    constellation: 'Hydra',
    diameterSolar: 1.12,
    temperature: 5874,
    spectralType: 'G0V',
    spectralClass: 'G',
    luminositySolar: 1.48,
    massSolar: 1.18,
    estimatedAge: '3.1 Billion Years',
    estimatedAgeMyr: 3100,
    metallicityFeH: 0.28,
    rotationalVelocityKmS: 3.2,
    distanceLy: 90.1,
    apparentMagnitude: 6.54,
    absoluteMagnitude: 4.33,
    surfaceGravityLogG: 4.41,
    colorHex: '#fff0a6',
    coronaColorHex: '#ffe885',
    solarEngulfment: 'Spans 1.56 million km (~0.0104 AU).',
    engulfsPlanets: ['Theoretical consumed inner planet'],
    habitableZoneAU: { inner: 1.10, outer: 1.70 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 2,
      debrisDisk: true,
      debrisDiskDescription: 'A dusty infrared debris ring indicating dynamic collisional chaos in the planetary system.',
      systemOverview: 'Famous system in 2:1 mean-motion orbital resonance whose atmosphere contains rare Lithium-6 from swallowed planets.',
      planets: [
        {
          name: 'HD 82943 b',
          type: 'Gas Giant',
          mass: '1.75 M_J',
          orbitalPeriodDays: 442.2,
          semiMajorAxisAU: 1.19,
          habitableZoneStatus: 'Conservative Habitable Zone',
          discoveryYear: 2000,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A Jovian planet orbiting in the habitable zone locked in a 2:1 orbital resonance with inner planet c.'
        },
        {
          name: 'HD 82943 c',
          type: 'Gas Giant',
          mass: '2.01 M_J',
          orbitalPeriodDays: 219.0,
          semiMajorAxisAU: 0.746,
          habitableZoneStatus: 'Inner Rim',
          discoveryYear: 2001,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A giant planet completing exactly two orbits for every single orbit of outer planet b.'
        }
      ]
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '7.5 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'Gould designation #145 in the expansive southern constellation Hydra (Uranometria Argentina).',
      'Astronomers using the VLT in Chile detected the rare isotope Lithium-6 in this star’s atmosphere—a fragile isotope easily destroyed in stellar interiors, proving the star swallowed one of its own inner planets!',
      'Hosts two Jovian exoplanets locked in an extraordinarily stable 2:1 mean-motion resonance.'
    ],
    description: 'Star #145 in Hydra from Gould’s Uranometria Argentina, containing rare Lithium-6 from a consumed planetary body.'
  }),

  // 25. 171 G. Arae (HD 154857 - Multiple Jovian System in the Southern Altar)
  makeStar({
    id: '171-g-arae',
    name: '171 G. Arae (HD 154857)',
    alternateNames: ['171 G. Ara', 'HD 154857', 'HR 6371', 'HIP 84069'],
    bayerDesignation: undefined,
    flamsteedDesignation: undefined,
    gouldDesignation: '171 G. Ara',
    constellation: 'Ara',
    diameterSolar: 2.15,
    temperature: 5545,
    spectralType: 'G5IV-V',
    spectralClass: 'G',
    luminositySolar: 4.80,
    massSolar: 1.17,
    estimatedAge: '6.2 Billion Years',
    estimatedAgeMyr: 6200,
    metallicityFeH: -0.22,
    rotationalVelocityKmS: 2.5,
    distanceLy: 209.0,
    apparentMagnitude: 7.25,
    absoluteMagnitude: 3.22,
    surfaceGravityLogG: 3.84,
    colorHex: '#ffe899',
    coronaColorHex: '#ffeaad',
    solarEngulfment: 'Spans 2.99 million km (~0.0200 AU), an evolved yellow subgiant.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1.95, outer: 3.10 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 2,
      systemOverview: 'Evolved subgiant in Ara hosting two giant planets (HD 154857 b & c).',
      planets: [
        {
          name: 'HD 154857 b',
          type: 'Gas Giant',
          mass: '2.24 M_J',
          orbitalPeriodDays: 408.6,
          semiMajorAxisAU: 1.29,
          habitableZoneStatus: 'Conservative Habitable Zone',
          discoveryYear: 2004,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A Jovian planet orbiting in the star’s temperate zone.'
        },
        {
          name: 'HD 154857 c',
          type: 'Gas Giant',
          mass: '2.58 M_J',
          orbitalPeriodDays: 3452.0,
          semiMajorAxisAU: 5.36,
          habitableZoneStatus: 'Beyond Ice Line',
          discoveryYear: 2014,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A long-period gas giant completing an orbit once every 9.5 years.'
        }
      ]
    },
    stellarStage: 'Subgiant',
    lifespanEstimate: '8 Billion Years',
    futureFate: 'Red Giant shedding into a White Dwarf',
    fusionProcess: 'Hydrogen Shell Burning',
    notableFacts: [
      'Numbered #171 in Ara in Benjamin Gould’s 1879 Uranometria Argentina catalog.',
      'A subgiant star that has exhausted hydrogen in its core and is beginning its ascent toward the red giant branch.',
      'Hosts two Jupiter-mass planets discovered by the Anglo-Australian Planet Search.'
    ],
    description: 'Star #171 in Ara from Gould’s catalog, an evolving subgiant hosting two gas giants.'
  }),

  // 26. 20 G. Volantis (HD 65907 - Nearby Sun-like Star in the Flying Fish)
  makeStar({
    id: '20-g-volantis',
    name: '20 G. Volantis (HD 65907)',
    alternateNames: ['20 G. Vol', 'HD 65907', 'HR 3133', 'HIP 38665', 'Gliese 288'],
    bayerDesignation: undefined,
    flamsteedDesignation: undefined,
    gouldDesignation: '20 G. Vol',
    constellation: 'Volans',
    diameterSolar: 1.02,
    temperature: 5920,
    spectralType: 'F9.5V',
    spectralClass: 'F',
    luminositySolar: 1.34,
    massSolar: 1.06,
    estimatedAge: '4.7 Billion Years',
    estimatedAgeMyr: 4700,
    metallicityFeH: -0.26,
    rotationalVelocityKmS: 3.1,
    distanceLy: 52.8,
    apparentMagnitude: 5.66,
    absoluteMagnitude: 4.61,
    surfaceGravityLogG: 4.45,
    colorHex: '#fff5e6',
    coronaColorHex: '#fffff0',
    solarEngulfment: 'Spans 1.42 million km (~0.0095 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1.05, outer: 1.65 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'A bright naked-eye southern yellow-white dwarf in Volans.',
      planets: []
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '9 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'Gould designation #20 in the southern constellation Volans (the Flying Fish).',
      'Visible to the naked eye under dark skies at magnitude 5.66; located just 52.8 light-years away.',
      'High galactic space velocity indicates an origin in the inner disk or thick disk of the Milky Way.'
    ],
    description: 'A bright naked-eye yellow-white dwarf in Volans bearing Gould designation 20 G. Volantis.'
  }),

  // 27. 41 G. Chamaeleontis (HD 63454 - Hot Jupiter Host in the Chameleon)
  makeStar({
    id: '41-g-chamaeleontis',
    name: '41 G. Chamaeleontis (HD 63454)',
    alternateNames: ['41 G. Cha', 'HD 63454', 'HIP 37284', 'CPD-77 348'],
    bayerDesignation: undefined,
    flamsteedDesignation: undefined,
    gouldDesignation: '41 G. Cha',
    constellation: 'Chamaeleon',
    diameterSolar: 0.94,
    temperature: 4840,
    spectralType: 'K4V',
    spectralClass: 'K',
    luminositySolar: 0.48,
    massSolar: 0.80,
    estimatedAge: '2.5 Billion Years',
    estimatedAgeMyr: 2500,
    metallicityFeH: 0.07,
    rotationalVelocityKmS: 2.0,
    distanceLy: 123.0,
    apparentMagnitude: 9.37,
    absoluteMagnitude: 6.48,
    surfaceGravityLogG: 4.48,
    colorHex: '#ffb366',
    coronaColorHex: '#ffc880',
    solarEngulfment: 'Spans 1.31 million km (~0.0088 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.60, outer: 1.00 },
    exoplanetSystem: {
      hasExoplanets: true,
      confirmedCount: 1,
      systemOverview: 'Hosts a close-in hot Jupiter planet (HD 63454 b, christened Ibirapitá) orbiting every 2.8 days.',
      planets: [
        {
          name: 'HD 63454 b (Ibirapitá)',
          type: 'Hot Jupiter',
          mass: '0.38 M_J',
          orbitalPeriodDays: 2.82,
          semiMajorAxisAU: 0.036,
          habitableZoneStatus: 'Too Hot',
          discoveryYear: 2005,
          discoveryMethod: 'Radial Velocity',
          confirmed: true,
          description: 'A hot Jupiter with a mass comparable to Saturn in a tight 2.8-day orbit.'
        }
      ]
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '25 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'Gould designation #41 in Chamaeleon from Uranometria Argentina.',
      'Hosts the hot Jupiter exoplanet Ibirapitá, named by Uruguay in the 2019 IAU NameExoWorlds campaign.',
      'A metal-rich southern orange dwarf situated near the south celestial pole.'
    ],
    description: 'Star #41 in Chamaeleon from Gould’s Uranometria Argentina, hosting the hot Jupiter Ibirapitá.'
  }),

  // ==========================================
  // SECTION 4: MORE BAYER & CLASSICAL STARS
  // ==========================================

  // 28. Chi Draconis (Bright Nearby Binary)
  makeStar({
    id: 'chi-draconis',
    name: 'Chi Draconis',
    alternateNames: ['43 Draconis', 'HR 6927', 'HD 170153', 'HIP 89937', 'Gliese 713'],
    bayerDesignation: 'χ Dra',
    flamsteedDesignation: '43 Dra',
    constellation: 'Draco',
    diameterSolar: 1.20,
    temperature: 6150,
    spectralType: 'F7V',
    spectralClass: 'F',
    luminositySolar: 1.86,
    massSolar: 1.03,
    estimatedAge: '5.3 Billion Years',
    estimatedAgeMyr: 5300,
    metallicityFeH: -0.15,
    rotationalVelocityKmS: 3.5,
    distanceLy: 26.3,
    apparentMagnitude: 3.57,
    absoluteMagnitude: 4.04,
    surfaceGravityLogG: 4.28,
    colorHex: '#fff5e6',
    coronaColorHex: '#fffff0',
    solarEngulfment: 'Spans 1.67 million km (~0.0112 AU), bright northern benchmark.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1.25, outer: 1.95 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Close spectroscopic binary with a 280-day orbit, located just 26.3 light-years from Earth.',
      planets: []
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '7.5 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'Bayer designation χ Dra and Flamsteed number 43 Dra in Draco.',
      'A prominent naked-eye star at magnitude 3.57 situated near the north celestial pole.',
      'A close binary consisting of an F7 dwarf and an orange K-dwarf orbiting every 280.5 days.'
    ],
    description: 'A prominent magnitude 3.57 binary star in Draco bearing Bayer χ and Flamsteed #43, 26.3 light-years away.'
  }),

  // 29. Eta Leporis (Fast-moving F-star with Debris Disk)
  makeStar({
    id: 'eta-leporis',
    name: 'Eta Leporis',
    alternateNames: ['16 Leporis', 'HR 2085', 'HD 40136', 'HIP 28103', 'Gliese 225'],
    bayerDesignation: 'η Lep',
    flamsteedDesignation: '16 Lep',
    constellation: 'Lepus',
    diameterSolar: 1.50,
    temperature: 6890,
    spectralType: 'F2V',
    spectralClass: 'F',
    luminositySolar: 5.50,
    massSolar: 1.45,
    estimatedAge: '1.4 Billion Years',
    estimatedAgeMyr: 1400,
    metallicityFeH: -0.12,
    rotationalVelocityKmS: 28.0,
    distanceLy: 49.1,
    apparentMagnitude: 3.71,
    absoluteMagnitude: 2.82,
    surfaceGravityLogG: 4.20,
    colorHex: '#fff8f0',
    coronaColorHex: '#ffffff',
    solarEngulfment: 'Spans 2.09 million km (~0.0140 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 2.10, outer: 3.30 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      debrisDisk: true,
      debrisDiskDescription: 'A warm asteroid-belt analog dust disk detected by the Spitzer Space Telescope.',
      systemOverview: 'Young F-type dwarf surrounded by warm circumstellar dust pointing to active planetesimal collisions.',
      planets: []
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '3.5 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion via CNO Cycle',
    notableFacts: [
      'Bayer designation η Lep and Flamsteed designation 16 Lep in the constellation Lepus (the Hare).',
      'Infrared observations revealed an unusually warm circumstellar debris disk at ~6 AU, indicating violent collisions between asteroids or protoplanets.',
      'A rapidly rotating F-type dwarf star completing a rotation every few days.'
    ],
    description: 'A 3rd-magnitude F-type dwarf in Lepus bearing Bayer η and Flamsteed #16, hosting an active asteroid debris ring.'
  }),

  // 30. Theta Apodis (Red Giant Variable in the Bird of Paradise)
  makeStar({
    id: 'theta-apodis',
    name: 'Theta Apodis',
    alternateNames: ['HR 5261', 'HD 122250', 'HIP 68983', 'CPD-76 892'],
    bayerDesignation: 'θ Aps',
    flamsteedDesignation: undefined,
    constellation: 'Apus',
    diameterSolar: 65.0,
    temperature: 3450,
    spectralType: 'M7III',
    spectralClass: 'M',
    luminositySolar: 850.0,
    massSolar: 1.20,
    estimatedAge: '6.0 Billion Years',
    estimatedAgeMyr: 6000,
    metallicityFeH: -0.10,
    rotationalVelocityKmS: 4.5,
    distanceLy: 350.0,
    apparentMagnitude: 5.69,
    absoluteMagnitude: 0.54,
    surfaceGravityLogG: 0.90,
    colorHex: '#ff5522',
    coronaColorHex: '#ff8844',
    solarEngulfment: 'Spans 90.5 million km (~0.605 AU), easily swallowing Mercury and Venus.',
    engulfsPlanets: ['Mercury', 'Venus'],
    habitableZoneAU: { inner: 26.0, outer: 42.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Semi-regular pulsating red giant with a 119-day variation cycle.',
      planets: []
    },
    stellarStage: 'Red Giant',
    lifespanEstimate: '8 Billion Years',
    futureFate: 'Planetary Nebula shedding into a Carbon-Oxygen White Dwarf',
    fusionProcess: 'Shell Hydrogen & Helium Burning (AGB Phase)',
    notableFacts: [
      'Principal Bayer star θ Aps in the exotic far-southern constellation Apus (the Bird of Paradise).',
      'A semi-regular pulsating variable star whose brightness swings by nearly a full magnitude over a 119-day period.',
      'Located within 14 degrees of the South Celestial Pole, invisible from most of the Northern Hemisphere.'
    ],
    description: 'A pulsating red giant in the southern circumpolar constellation Apus bearing Bayer designation θ Aps.'
  })
];
