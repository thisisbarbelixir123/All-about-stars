import { StarData } from '../types';
import { makeStar } from './starHelper';

/**
 * Stars of the Brazilian National Flag (Bandeira do Brasil)
 * According to Brazilian Federal Law 5.700/1971, the 27 stars on the flag depict
 * the night sky over Rio de Janeiro on November 15, 1889 (at 08:30 AM sidereal time),
 * with each star representing a specific Brazilian state or the Federal District.
 * This file adds all Brazilian flag stars that were not yet in the catalog.
 */
export const STARS_BRAZILIAN_FLAG: StarData[] = [
  // 1. Intrometida (Epsilon Crucis) - State of Espírito Santo
  makeStar({
    id: 'epsilon-crucis',
    name: 'Intrometida (Epsilon Crucis)',
    alternateNames: ['ε Cru', 'HD 107446', 'HR 4700', 'HIP 60260', 'The Intruder'],
    bayerDesignation: 'ε Cru',
    constellation: 'Crux',
    diameterSolar: 28.4,
    temperature: 4140,
    spectralType: 'K3III',
    spectralClass: 'K',
    luminositySolar: 302,
    massSolar: 1.5,
    estimatedAge: '2.1 Billion Years',
    estimatedAgeMyr: 2100,
    metallicityFeH: -0.05,
    rotationalVelocityKmS: 3.2,
    distanceLy: 230,
    apparentMagnitude: 3.59,
    absoluteMagnitude: -0.63,
    surfaceGravityLogG: 1.8,
    colorHex: '#ffad5c',
    coronaColorHex: '#ffd199',
    solarEngulfment: 'Extends to 0.132 AU (19.8 million km radius), reaching half the orbit of Mercury.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 14.5, outer: 22.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Single evolved orange giant with no confirmed exoplanets.',
      planets: []
    },
    stellarStage: 'Red Giant',
    lifespanEstimate: '2.5 Billion Years',
    futureFate: 'Helium Core Exhaustion -> Carbon-Oxygen White Dwarf',
    fusionProcess: 'Core Helium Fusion (Horizontal Branch)',
    notableFacts: [
      'Represents the State of Espírito Santo on the National Flag of Brazil, nestled inside the southern cross asterism.',
      'Popularly called "A Intrometida" (The Intruder or The Meddlesome) in Portuguese because it breaks the symmetrical 4-star diamond shape of the Southern Cross.',
      'An evolved K3 giant located 230 light-years from Earth with an orange-gold hue visible to the naked eye throughout the Southern Hemisphere.'
    ],
    description: 'The famed "Intruder" star in the Southern Cross, representing the State of Espírito Santo on the Brazilian flag.'
  }),

  // 2. Larawag (Epsilon Scorpii) - State of Ceará
  makeStar({
    id: 'larawag',
    name: 'Larawag (Epsilon Scorpii)',
    alternateNames: ['ε Sco', 'HD 151680', 'HR 6241', 'HIP 82396', 'Wei'],
    bayerDesignation: 'ε Sco',
    constellation: 'Scorpius',
    diameterSolar: 15.3,
    temperature: 4400,
    spectralType: 'K2.5IIIb',
    spectralClass: 'K',
    luminositySolar: 73,
    massSolar: 1.24,
    estimatedAge: '4.8 Billion Years',
    estimatedAgeMyr: 4800,
    metallicityFeH: -0.13,
    rotationalVelocityKmS: 1.7,
    distanceLy: 63.7,
    apparentMagnitude: 2.29,
    absoluteMagnitude: 0.78,
    surfaceGravityLogG: 2.3,
    colorHex: '#ffb366',
    coronaColorHex: '#ffd699',
    solarEngulfment: 'Extends to 0.071 AU (10.6 million km radius), filling nearly a fifth of Mercury\'s orbit.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 7.2, outer: 11.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'A stable clump giant undergoing asteroseismic oscillations.',
      planets: []
    },
    stellarStage: 'Red Giant',
    lifespanEstimate: '5.5 Billion Years',
    futureFate: 'Planetary Nebula -> Carbon-Oxygen White Dwarf',
    fusionProcess: 'Core Helium Fusion',
    notableFacts: [
      'Represents the State of Ceará on the National Flag of Brazil as part of the prominent Scorpius constellation.',
      'Officially named Larawag by the IAU, originating from the indigenous Wardaman people of Northern Australia meaning "clear-sighted".',
      'At 63.7 light-years away, it is the closest giant star to the Sun after Pollux and Arcturus.'
    ],
    description: 'A bright orange giant in the body of Scorpius representing the State of Ceará on the Brazilian flag.'
  }),

  // 3. Apollyon (Iota-1 Scorpii) - State of Sergipe
  makeStar({
    id: 'iota-1-scorpii',
    name: 'Apollyon (Iota-1 Scorpii)',
    alternateNames: ['ι¹ Sco', 'HD 161471', 'HR 6615', 'HIP 87073'],
    bayerDesignation: 'ι¹ Sco',
    constellation: 'Scorpius',
    diameterSolar: 125,
    temperature: 6700,
    spectralType: 'F2Ia',
    spectralClass: 'F',
    luminositySolar: 35000,
    massSolar: 12.0,
    estimatedAge: '15.0 Million Years',
    estimatedAgeMyr: 15,
    metallicityFeH: 0.05,
    rotationalVelocityKmS: 36,
    distanceLy: 1930,
    apparentMagnitude: 3.03,
    absoluteMagnitude: -5.71,
    surfaceGravityLogG: 1.3,
    colorHex: '#fff7ed',
    coronaColorHex: '#ffffff',
    solarEngulfment: 'Colossal yellow-white supergiant extending to 0.58 AU (87 million km radius), engulfing Mercury and Venus.',
    engulfsPlanets: ['Mercury', 'Venus'],
    habitableZoneAU: { inner: 160.0, outer: 250.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Luminous yellow-white supergiant in the tail of Scorpius.',
      planets: []
    },
    stellarStage: 'Yellow Supergiant',
    lifespanEstimate: '18 Million Years',
    futureFate: 'Core Collapse Supernova -> Neutron Star',
    fusionProcess: 'Advanced Shell Burning / Core Helium Depletion',
    notableFacts: [
      'Represents the State of Sergipe on the National Flag of Brazil, marking the curve of Scorpius\'s stinger.',
      'A rare, luminous F-type yellow-white supergiant over 35,000 times brighter than our Sun.',
      'Has a distant 10th-magnitude optical companion separated by 37 arcseconds.'
    ],
    description: 'A brilliant yellow-white supergiant in the stinger of Scorpius representing the State of Sergipe on the Brazilian flag.'
  }),

  // 4. Girtab (Kappa Scorpii) - State of Paraíba
  makeStar({
    id: 'girtab',
    name: 'Girtab (Kappa Scorpii)',
    alternateNames: ['κ Sco', 'HD 160578', 'HR 6580', 'HIP 86670'],
    bayerDesignation: 'κ Sco',
    constellation: 'Scorpius',
    diameterSolar: 6.8,
    temperature: 23400,
    spectralType: 'B1.5III',
    spectralClass: 'B',
    luminositySolar: 15100,
    massSolar: 17.0,
    estimatedAge: '12.0 Million Years',
    estimatedAgeMyr: 12,
    metallicityFeH: 0.02,
    rotationalVelocityKmS: 125,
    distanceLy: 480,
    apparentMagnitude: 2.41,
    absoluteMagnitude: -3.45,
    surfaceGravityLogG: 3.7,
    colorHex: '#b8d5ff',
    coronaColorHex: '#dbebff',
    solarEngulfment: 'Extends to 0.032 AU (4.7 million km radius), safely within Mercury\'s orbit.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 105.0, outer: 165.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Spectroscopic binary pulsating with Beta Cephei variability.',
      planets: []
    },
    stellarStage: 'Blue Giant',
    lifespanEstimate: '15 Million Years',
    futureFate: 'Core Collapse Supernova (Type II) -> Neutron Star',
    fusionProcess: 'CNO Cycle Core Hydrogen / Approaching Exhaustion',
    notableFacts: [
      'Represents the State of Paraíba on the National Flag of Brazil, sitting right before Shaula at the stinger tip.',
      'The traditional Sumerian name Girtab means "The Scorpion", referring to the ancient celestial scorpion creature.',
      'A Beta Cephei-type variable star that pulsates in brightness every 4.8 hours as internal acoustic pressure waves ripple through its envelope.'
    ],
    description: 'A pulsating blue giant near the stinger of Scorpius representing the State of Paraíba on the Brazilian flag.'
  }),

  // 5. Xamidimura / Pipirima (Mu-1 Scorpii) - State of Pernambuco
  makeStar({
    id: 'xamidimura',
    name: 'Xamidimura (Mu-1 Scorpii)',
    alternateNames: ['μ¹ Sco', 'HD 151890', 'HR 6247', 'HIP 82514', 'Pipirima'],
    bayerDesignation: 'μ¹ Sco',
    constellation: 'Scorpius',
    diameterSolar: 4.8,
    temperature: 21800,
    spectralType: 'B1.5V',
    spectralClass: 'B',
    luminositySolar: 9200,
    massSolar: 8.5,
    estimatedAge: '19.0 Million Years',
    estimatedAgeMyr: 19,
    metallicityFeH: -0.02,
    rotationalVelocityKmS: 190,
    distanceLy: 500,
    apparentMagnitude: 3.04,
    absoluteMagnitude: -2.89,
    surfaceGravityLogG: 3.9,
    colorHex: '#bdd9ff',
    coronaColorHex: '#e0edff',
    solarEngulfment: 'Extends to 0.022 AU (3.3 million km radius).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 80.0, outer: 125.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Semidetached eclipsing binary with ongoing mass transfer between the pair.',
      planets: []
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '35 Million Years',
    futureFate: 'Supernova / Massive White Dwarf depending on envelope transfer',
    fusionProcess: 'CNO Hydrogen Fusion',
    notableFacts: [
      'Represents the State of Pernambuco on the National Flag of Brazil.',
      'Officially named Xamidimura by the IAU from the Khoekhoe language of southern Africa, referring to the eyes of the lion.',
      'Forms a famed naked-eye double star with Mu-2 Scorpii (Pipirima), separated by 5.8 arcminutes in the southern sky.'
    ],
    description: 'A rapid eclipsing binary star in Scorpius representing the State of Pernambuco on the Brazilian flag.'
  }),

  // 6. Muliphein (Gamma Canis Majoris) - State of Rondônia
  makeStar({
    id: 'muliphein',
    name: 'Muliphein (Gamma Canis Majoris)',
    alternateNames: ['γ CMa', 'HD 53244', 'HR 2657', 'HIP 34045', 'Isis'],
    bayerDesignation: 'γ CMa',
    constellation: 'Canis Major',
    diameterSolar: 5.6,
    temperature: 13600,
    spectralType: 'B8II',
    spectralClass: 'B',
    luminositySolar: 640,
    massSolar: 5.1,
    estimatedAge: '95.0 Million Years',
    estimatedAgeMyr: 95,
    metallicityFeH: 0.12,
    rotationalVelocityKmS: 30,
    distanceLy: 440,
    apparentMagnitude: 4.11,
    absoluteMagnitude: -1.54,
    surfaceGravityLogG: 3.2,
    colorHex: '#d8e5ff',
    coronaColorHex: '#f0f4ff',
    solarEngulfment: 'Extends to 0.026 AU (3.9 million km radius).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 21.0, outer: 33.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Mercury-manganese chemically peculiar bright giant.',
      planets: []
    },
    stellarStage: 'Bright Giant',
    lifespanEstimate: '110 Million Years',
    futureFate: 'Massive White Dwarf (CO/ONe)',
    fusionProcess: 'Core Hydrogen Exhaustion / Shell Fusion',
    notableFacts: [
      'Represents the State of Rondônia on the National Flag of Brazil, situated near Sirius on the neck of Canis Major.',
      'A chemically peculiar "mercury-manganese" star with severe overabundances of mercury, phosphorus, and xenon in its upper atmosphere.',
      'Named Muliphein from the Arabic "al-muhlefayn", referencing a traditional oath star.'
    ],
    description: 'A chemically peculiar B-type bright giant in Canis Major representing the State of Rondônia on the Brazilian flag.'
  }),

  // 7. Gamma Trianguli Australis - State of Paraná
  makeStar({
    id: 'gamma-trianguli-australis',
    name: 'Gamma Trianguli Australis',
    alternateNames: ['γ TrA', 'HD 135502', 'HR 5674', 'HIP 74950'],
    bayerDesignation: 'γ TrA',
    constellation: 'Triangulum Australe',
    diameterSolar: 2.1,
    temperature: 9240,
    spectralType: 'A1V',
    spectralClass: 'A',
    luminositySolar: 32,
    massSolar: 2.2,
    estimatedAge: '260 Million Years',
    estimatedAgeMyr: 260,
    metallicityFeH: -0.06,
    rotationalVelocityKmS: 199,
    distanceLy: 184,
    apparentMagnitude: 2.87,
    absoluteMagnitude: -0.87,
    surfaceGravityLogG: 4.0,
    colorHex: '#eaf2ff',
    coronaColorHex: '#f5f9ff',
    solarEngulfment: 'Extends to 0.0098 AU (1.46 million km radius).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 4.7, outer: 7.4 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Fast-rotating A-type main sequence star with circumstellar dust disk signatures.',
      planets: []
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '1.0 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'CNO Hydrogen Fusion',
    notableFacts: [
      'Represents the State of Paraná on the National Flag of Brazil, forming the southern vertex of the southern triangle.',
      'Completes the equilateral triangle asterism of Triangulum Australe alongside Atria (Rio Grande do Sul) and Betria (Santa Catarina).',
      'Rotates at an extreme 199 km/s, completing a rotation in less than 13 hours and giving it an oblate equatorial bulge.'
    ],
    description: 'The third vertex of the Southern Triangle representing the State of Paraná on the Brazilian flag.'
  }),
];
