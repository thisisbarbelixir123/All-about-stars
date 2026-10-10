import { StarData } from '../types';
import { makeStar } from './starHelper';

/**
 * STARS_HOT_SUBDWARFS_BLUE_STRAGGLERS_AND_GAIA
 * 1. O-type Subdwarfs (sdO): HD 49798 (archetype hot subdwarf binary), Feige 34, CD-30°11223
 * 2. B-type Subdwarfs (sdB): V361 Hydrae (archetype pulsating sdB pulsator), KPD 1930+2752 (Type Ia progenitor binary), PG 1159-035 (GW Vir DOV archetype)
 * 3. Blue Straggler Stars (BSS): BSS 19 in M67 (FBC 19), WSS 308 (NGC 188 binary blue straggler), BSS-47 Tucanae (core collision merger relic), V383 Carinae (BSS in Collinder 228)
 * 4. Landmark Gaia Survey Catalog Discoveries:
 *    - Gaia DR3 3425624763261270272 ("Gaia Wide-Orbit Black Hole Twin" G-type star)
 *    - Gaia DR3 Fast-Mover (Hypervelocity run-away star ejected by supermassive black hole)
 *    - Gaia BH1 Optical Star (Nearby G-dwarf directly orbiting dormant 9.6 M☉ black hole, 1,560 ly)
 *    - Gaia BH2 Optical Star (Red giant star orbiting a 8.9 M☉ black hole, 3,800 ly)
 *    - Gaia DR3 1007785 (Ultra-pure Halo runaway blue subgiant)
 */
export const STARS_HOT_SUBDWARFS_BLUE_STRAGGLERS_AND_GAIA: StarData[] = [
  // ==========================================
  // SECTION 1: HOT O-TYPE & B-TYPE SUBDWARFS (sdO / sdB)
  // ==========================================

  // 1. HD 49798 (The Archetype O-type Subdwarf Binary)
  makeStar({
    id: 'hd-49798',
    name: 'HD 49798',
    alternateNames: ['HR 2530', 'HIP 32733', 'CD-44 2664', 'SAO 218206'],
    constellation: 'Puppis',
    diameterSolar: 1.45,
    temperature: 47500,
    spectralType: 'sdO6',
    spectralClass: 'O',
    luminositySolar: 10500,
    massSolar: 1.50,
    estimatedAge: '1.2 Billion Years',
    estimatedAgeMyr: 1200,
    metallicityFeH: -0.10,
    rotationalVelocityKmS: 45.0,
    distanceLy: 2700,
    apparentMagnitude: 8.29,
    absoluteMagnitude: -1.30,
    surfaceGravityLogG: 4.25,
    colorHex: '#99bbff',
    coronaColorHex: '#ccd9ff',
    solarEngulfment: 'Spans 2.02 million km (~0.0135 AU), an intensely luminous helium-rich O-type subdwarf.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 85, outer: 135 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Host to the fastest spinning massive white dwarf known (period 13.2 seconds), a candidate Type Ia supernova progenitor.',
      planets: []
    },
    stellarStage: 'Subdwarf',
    lifespanEstimate: '100 Million Years (Subdwarf Phase)',
    futureFate: 'Type Ia Supernova or Direct Accretion Collapse',
    fusionProcess: 'Core Helium Burning (Stripped Core Envelope)',
    notableFacts: [
      'The brightest and best-studied O-type subdwarf (sdO) in the entire sky, glowing at a blistering 47,500 Kelvin.',
      'A stripped-envelope helium core resulting from common-envelope binary evolution, orbited by an ultra-fast spinning compact white dwarf (period 13.2 s).',
      'One of the prime candidate progenitors for a Type Ia supernova or accretion-induced collapse in our Galaxy.'
    ],
    description: 'The archetype helium-rich O-type subdwarf in Puppis, blistering at 47,500 K and locked in a binary with a 13-second spinning remnant.'
  }),

  // 2. V361 Hydrae (Archetype of Rapidly Pulsating B-type Subdwarfs - EC 14026)
  makeStar({
    id: 'v361-hydrae',
    name: 'V361 Hydrae (EC 14026-2647)',
    alternateNames: ['EC 14026-2647', 'HIP 68789', 'GSC 06742-01183'],
    constellation: 'Hydra',
    diameterSolar: 0.18,
    temperature: 34800,
    spectralType: 'sdB',
    spectralClass: 'B',
    luminositySolar: 38.0,
    massSolar: 0.47,
    estimatedAge: '10.5 Billion Years',
    estimatedAgeMyr: 10500,
    metallicityFeH: -0.20,
    rotationalVelocityKmS: 15.0,
    distanceLy: 1450,
    apparentMagnitude: 15.3,
    absoluteMagnitude: 4.3,
    surfaceGravityLogG: 5.75,
    colorHex: '#b3ccff',
    coronaColorHex: '#d9e6ff',
    solarEngulfment: 'Spans 250,000 km (~0.00167 AU), an extremely compact hot subdwarf core.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 5.2, outer: 8.5 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Prototype star of the EC 14026 (sdBV_r) class of rapid p-mode pulsating B-type subdwarfs.',
      planets: []
    },
    stellarStage: 'Subdwarf',
    lifespanEstimate: '120 Million Years (sdB phase)',
    futureFate: 'Carbon-Oxygen White Dwarf',
    fusionProcess: 'Core Helium Burning (Extreme Horizontal Branch)',
    notableFacts: [
      'The defining prototype and namesake of the V361 Hydrae class of rapidly pulsating B-type subdwarfs (p-mode sdB variables).',
      'Pulsates with multiple non-radial acoustic p-modes with short periods between 2 and 8 minutes, driven by the iron-opacity "kappa mechanism".',
      'Represents an Extreme Horizontal Branch (EHB) star that lost almost its entire hydrogen envelope near the tip of the red-giant branch.'
    ],
    description: 'The defining archetype of rapidly pulsating B-type subdwarfs in Hydra, oscillating via iron-opacity kappa pulses every few minutes.'
  }),

  // 3. KPD 1930+2752 (Binary sdB Supernova Progenitor)
  makeStar({
    id: 'kpd-1930-2752',
    name: 'KPD 1930+2752',
    alternateNames: ['HIP 96425', '2MASS J19321481+2803328'],
    constellation: 'Cygnus',
    diameterSolar: 0.20,
    temperature: 35200,
    spectralType: 'sdB',
    spectralClass: 'B',
    luminositySolar: 44.0,
    massSolar: 0.52,
    estimatedAge: '8.0 Billion Years',
    estimatedAgeMyr: 8000,
    metallicityFeH: 0.00,
    rotationalVelocityKmS: 90.0,
    distanceLy: 2850,
    apparentMagnitude: 13.8,
    absoluteMagnitude: 4.1,
    surfaceGravityLogG: 5.61,
    colorHex: '#b3ccff',
    coronaColorHex: '#d9e6ff',
    solarEngulfment: 'Spans roughly 278,000 km (~0.00186 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 5.8, outer: 9.2 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Extreme short-period binary (period 2 hours 17 minutes) with a white dwarf, total mass exceeds Chandrasekhar limit (1.47 M☉).',
      planets: []
    },
    stellarStage: 'Subdwarf',
    lifespanEstimate: '200 Million Years until merger',
    futureFate: 'Thermonuclear Type Ia Supernova (Double Degenerate Merger)',
    fusionProcess: 'Core Helium Fusion (Extreme Horizontal Branch)',
    notableFacts: [
      'One of the strongest confirmed candidates for a double-degenerate Type Ia supernova progenitor in our Galaxy.',
      'The B-type subdwarf and its invisible white dwarf companion complete an ultra-tight mutual orbit in just 2 hours and 17 minutes.',
      'Combined system mass is approximately 1.47 M☉, comfortably exceeding the 1.44 M☉ Chandrasekhar mass limit; gravitational wave emission will force them to merge in ~200 million years.'
    ],
    description: 'A hot B-type subdwarf in Cygnus locked in an ultra-tight 2.3-hour orbit with a white dwarf, destined to merge in a Type Ia supernova.'
  }),

  // 4. PG 1159-035 (Archetype GW Virginis DOV Pulsator)
  makeStar({
    id: 'pg-1159-035',
    name: 'PG 1159-035 (GW Virginis)',
    alternateNames: ['GW Virginis', 'WD 1159-035', 'HIP 58641'],
    constellation: 'Virgo',
    diameterSolar: 0.025,
    temperature: 140000,
    spectralType: 'sdO',
    spectralClass: 'O',
    luminositySolar: 220.0,
    massSolar: 0.54,
    estimatedAge: '10 Billion Years',
    estimatedAgeMyr: 10000,
    metallicityFeH: 0.20,
    rotationalVelocityKmS: 3.5,
    distanceLy: 1470,
    apparentMagnitude: 14.8,
    absoluteMagnitude: 6.5,
    surfaceGravityLogG: 7.0,
    colorHex: '#80aaff',
    coronaColorHex: '#b3d1ff',
    solarEngulfment: 'Spans 34,800 km (~0.00023 AU), blistering at an unbelievable 140,000 K!',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 12.0, outer: 19.5 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Pre-white dwarf transition star transitioning from the Planetary Nebula nucleus to degenerate DO white dwarf.',
      planets: []
    },
    stellarStage: 'Subdwarf',
    lifespanEstimate: '1 Million Years (Transition phase)',
    futureFate: 'DO White Dwarf',
    fusionProcess: 'Late Helium Shell Flash / Residual Gravitational Contraction',
    notableFacts: [
      'The archetype and prototype star of both the PG 1159 stars and the GW Virginis pulsating variable class.',
      'Possesses one of the highest surface temperatures known for any star at 140,000 K, radiating furiously in extreme ultraviolet and soft X-rays.',
      'Atmosphere is completely stripped of hydrogen and consists entirely of carbon, helium, and oxygen following a final helium shell flash.'
    ],
    description: 'The archetype GW Virginis variable in Virgo, an exotic hydrogen-deficient subdwarf core glowing at an astounding 140,000 Kelvin.'
  }),

  // 5. Feige 34 (Spectrophotometric Standard O-Subdwarf)
  makeStar({
    id: 'feige-34',
    name: 'Feige 34',
    alternateNames: ['BD+44 2051', 'HIP 51745', 'GSC 03007-00918', 'WD 1036+433'],
    constellation: 'Ursa Major',
    diameterSolar: 0.22,
    temperature: 63000,
    spectralType: 'sdO',
    spectralClass: 'O',
    luminositySolar: 680.0,
    massSolar: 0.50,
    estimatedAge: '7.5 Billion Years',
    estimatedAgeMyr: 7500,
    metallicityFeH: -0.15,
    rotationalVelocityKmS: 25.0,
    distanceLy: 1240,
    apparentMagnitude: 11.18,
    absoluteMagnitude: 3.28,
    surfaceGravityLogG: 6.9,
    colorHex: '#94b3ff',
    coronaColorHex: '#c2d4ff',
    solarEngulfment: 'Spans roughly 306,000 km (~0.00205 AU), a blazing 63,000 K subdwarf.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 22.0, outer: 35.0 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Primary celestial flux standard for astronomical calibration from ultraviolet to infrared.',
      planets: []
    },
    stellarStage: 'Subdwarf',
    lifespanEstimate: '50 Million Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Shell Helium Burning',
    notableFacts: [
      'One of the primary spectrophotometric flux standards used by the Hubble Space Telescope, Gaia, and ground-based observatories worldwide.',
      'Cataloged in 1958 by Jacques Feige in his systematic search for faint blue stars at high Galactic latitudes.',
      'Surface temperature exceeds 63,000 K, radiating intense far-ultraviolet ionizing radiation.'
    ],
    description: 'A benchmark 63,000 K O-type subdwarf in Ursa Major serving as a universal spectrophotometric calibration star.'
  }),

  // 6. CD-30°11223 (Fastest Runaway sdB Binary in the Galaxy)
  makeStar({
    id: 'cd-30-11223',
    name: 'CD-30°11223 (GALEX J1411-3053)',
    alternateNames: ['GALEX J141149.0-305307', '2MASS J14114896-3053069'],
    constellation: 'Centaurus',
    diameterSolar: 0.16,
    temperature: 29200,
    spectralType: 'sdB',
    spectralClass: 'B',
    luminositySolar: 16.5,
    massSolar: 0.48,
    estimatedAge: '6.0 Billion Years',
    estimatedAgeMyr: 6000,
    metallicityFeH: 0.05,
    rotationalVelocityKmS: 180.0,
    distanceLy: 1100,
    apparentMagnitude: 12.2,
    absoluteMagnitude: 4.5,
    surfaceGravityLogG: 5.66,
    colorHex: '#b3ccff',
    coronaColorHex: '#d9e6ff',
    solarEngulfment: 'Spans 223,000 km (~0.00149 AU), tidally distorted into a teardrop shape.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 3.5, outer: 5.5 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Record-breaking 70-minute orbital period binary with a massive carbon-oxygen white dwarf.',
      planets: []
    },
    stellarStage: 'Subdwarf',
    lifespanEstimate: '40 Million Years until merger',
    futureFate: 'Sub-Chandrasekhar Type Ia Supernova',
    fusionProcess: 'Core Helium Fusion (Extreme Horizontal Branch)',
    notableFacts: [
      'Has the shortest orbital period known for any non-cataclysmic binary star system at just 70.5 minutes (1.18 hours)!',
      'The B-type subdwarf is tidally deformed into an elongated teardrop ellipsoid by the intense gravity of its white dwarf companion.',
      'Will merge in only 40 million years, predicted to trigger a helium-detonation sub-Chandrasekhar Type Ia supernova.'
    ],
    description: 'An extreme 70-minute binary B-type subdwarf in Centaurus tidally distorted into an egg shape, racing toward a supernova merger.'
  }),

  // ==========================================
  // SECTION 2: BLUE STRAGGLER STARS (BSS)
  // ==========================================

  // 7. BSS 19 in M67 (FBC 19 - Archetype Mass-Transfer Blue Straggler)
  makeStar({
    id: 'bss-19-m67',
    name: 'BSS 19 in M67 (FBC 19)',
    alternateNames: ['Fagerholm 19', 'Sanders 1082', 'HD 75638', 'HIP 43534'],
    constellation: 'Cancer',
    diameterSolar: 2.10,
    temperature: 8200,
    spectralType: 'A7V',
    spectralClass: 'A',
    luminositySolar: 18.0,
    massSolar: 2.25,
    estimatedAge: '4.0 Billion Years (Cluster Age)',
    estimatedAgeMyr: 4000,
    metallicityFeH: 0.00,
    rotationalVelocityKmS: 65.0,
    distanceLy: 2900,
    apparentMagnitude: 10.05,
    absoluteMagnitude: 2.30,
    surfaceGravityLogG: 4.10,
    colorHex: '#d9e6ff',
    coronaColorHex: '#f0f5ff',
    solarEngulfment: 'Spans 2.92 million km (~0.0195 AU), an "immortal" rejuvenated star.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 3.8, outer: 5.9 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Blue straggler in the 4-billion-year-old open cluster Messier 67, formed by stellar cannibalism / mass transfer.',
      planets: []
    },
    stellarStage: 'Blue Straggler',
    lifespanEstimate: '1.2 Billion Years (Post-rejuvenation)',
    futureFate: 'Red Giant shedding into a White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion via CNO Cycle (Rejuvenated Hydrogen Fuel)',
    notableFacts: [
      'The classic textbook blue straggler in Messier 67 (an open cluster as old as our Sun, ~4 Gyr), where all stars above 1.3 M☉ have long since died.',
      'Possesses a mass of 2.25 Solar masses—nearly double the cluster turn-off mass—making it look billions of years younger than its siblings.',
      'Radial velocity monitoring proved it is in an 850-day binary with a faint white dwarf, confirming it formed by sipping gas from an evolved giant companion.'
    ],
    description: 'The textbook blue straggler in the ancient cluster M67, rejuvenated by stellar cannibalism into a hot 8,200 K star.'
  }),

  // 8. WSS 308 (Collisional Merger Blue Straggler in NGC 188)
  makeStar({
    id: 'wss-308',
    name: 'WSS 308 (NGC 188 Blue Straggler)',
    alternateNames: ['Sandage 308', '2MASS J00473215+8516089'],
    constellation: 'Cepheus',
    diameterSolar: 1.85,
    temperature: 7750,
    spectralType: 'A8V',
    spectralClass: 'A',
    luminositySolar: 11.5,
    massSolar: 1.82,
    estimatedAge: '6.5 Billion Years (Cluster Age)',
    estimatedAgeMyr: 6500,
    metallicityFeH: 0.05,
    rotationalVelocityKmS: 42.0,
    distanceLy: 6000,
    apparentMagnitude: 14.1,
    absoluteMagnitude: 2.8,
    surfaceGravityLogG: 4.15,
    colorHex: '#e0ecff',
    coronaColorHex: '#f5f8ff',
    solarEngulfment: 'Spans 2.58 million km (~0.0172 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 3.0, outer: 4.8 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Rejuvenated star in one of the oldest open clusters known in the Milky Way (NGC 188).',
      planets: []
    },
    stellarStage: 'Blue Straggler',
    lifespanEstimate: '1.5 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Rejuvenated Core Hydrogen Fusion',
    notableFacts: [
      'Located in NGC 188 in Cepheus, an ancient 6.5-billion-year-old open cluster orbiting near the Galactic north celestial pole.',
      'Studied intensively by Allan Sandage in 1962, who originally coined the term "Blue Stragglers" for these anomalous unevolved stars.',
      'Spectroscopic lithium depletion confirms that deep convective mixing occurred during a physical stellar collision or merger.'
    ],
    description: 'An iconic blue straggler in the ancient 6.5-billion-year-old cluster NGC 188, created by collisional stellar rejuvenation.'
  }),

  // 9. BSS-47 Tucanae (Core-Collisional Globular Cluster Straggler)
  makeStar({
    id: 'bss-47-tuc',
    name: 'BSS-47 Tucanae (BSS 1 in 47 Tuc)',
    alternateNames: ['NGC 104 BSS 1', 'HST 47 Tuc BSS'],
    constellation: 'Tucana',
    diameterSolar: 2.30,
    temperature: 8700,
    spectralType: 'A5V',
    spectralClass: 'A',
    luminositySolar: 24.0,
    massSolar: 2.10,
    estimatedAge: '12.0 Billion Years (Cluster Age)',
    estimatedAgeMyr: 12000,
    metallicityFeH: -0.72,
    rotationalVelocityKmS: 85.0,
    distanceLy: 14500,
    apparentMagnitude: 13.9,
    absoluteMagnitude: 1.8,
    surfaceGravityLogG: 4.05,
    colorHex: '#d6e4ff',
    coronaColorHex: '#edf3ff',
    solarEngulfment: 'Spans 3.20 million km (~0.0214 AU), thriving inside a dense 12-billion-year-old cluster.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 4.4, outer: 6.8 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Core blue straggler in 47 Tucanae created by direct physical star-star collision in the crowded core.',
      planets: []
    },
    stellarStage: 'Blue Straggler',
    lifespanEstimate: '1.0 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion in merged helium-enriched core',
    notableFacts: [
      'Situated in the heart of 47 Tucanae (NGC 104), the second brightest and densest globular cluster in the night sky.',
      'Hubble Space Telescope ultraviolet imaging resolved dozens of blue stragglers concentrated in the cluster core, proving mass segregation.',
      'Stellar collision probability in the core of 47 Tuc is 1,000 times higher than in the solar neighborhood, constantly forging new blue stragglers.'
    ],
    description: 'A brilliant blue straggler in the dense core of globular cluster 47 Tucanae, forged by a direct head-on stellar collision.'
  }),

  // 10. V383 Carinae (Pulsating Blue Straggler / SX Phoenicis in Collinder 228)
  makeStar({
    id: 'v383-carinae',
    name: 'V383 Carinae (BSS in Collinder 228)',
    alternateNames: ['HD 92607', 'HIP 52271', 'CPD-59 2577'],
    constellation: 'Carina',
    diameterSolar: 2.45,
    temperature: 8100,
    spectralType: 'A7V',
    spectralClass: 'A',
    luminositySolar: 22.0,
    massSolar: 2.30,
    estimatedAge: '2.5 Billion Years',
    estimatedAgeMyr: 2500,
    metallicityFeH: 0.08,
    rotationalVelocityKmS: 75.0,
    distanceLy: 7500,
    apparentMagnitude: 8.78,
    absoluteMagnitude: 1.96,
    surfaceGravityLogG: 4.08,
    colorHex: '#d9e6ff',
    coronaColorHex: '#f0f5ff',
    solarEngulfment: 'Spans 3.41 million km (~0.0228 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 4.2, outer: 6.5 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Pulsating Blue Straggler variable in the Carina Nebula region.',
      planets: []
    },
    stellarStage: 'Blue Straggler',
    lifespanEstimate: '1.1 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'Located in the direction of the Carina Nebula star clusters, exhibiting high-frequency pulsating luminosity variations.',
      'An authentic blue straggler star displaying SX Phoenicis / Delta Scuti pulsations driven by helium ionization in its outer layers.',
      'Exhibits rapid rotation from the angular momentum imparted during the coalescence of two progenitor stars.'
    ],
    description: 'A pulsating blue straggler variable in Carina formed through the coalescence of two stars in an open cluster.'
  }),

  // ==========================================
  // SECTION 3: GAIA CATALOG REVOLUTIONARY DISCOVERIES
  // ==========================================

  // 11. Gaia BH1 Optical Companion Star (Closest Known Black Hole System)
  makeStar({
    id: 'gaia-bh1-companion',
    name: 'Gaia BH1 Companion Star',
    alternateNames: ['Gaia DR3 4373465352415301632', '2MASS J17284004-0034515'],
    constellation: 'Ophiuchus',
    diameterSolar: 0.99,
    temperature: 5850,
    spectralType: 'G2V',
    spectralClass: 'G',
    luminositySolar: 1.02,
    massSolar: 0.93,
    estimatedAge: '7.0 Billion Years',
    estimatedAgeMyr: 7000,
    metallicityFeH: -0.20,
    rotationalVelocityKmS: 2.1,
    distanceLy: 1560,
    apparentMagnitude: 13.77,
    absoluteMagnitude: 5.37,
    surfaceGravityLogG: 4.45,
    colorHex: '#fff0a6',
    coronaColorHex: '#ffe885',
    solarEngulfment: 'Spans 1.38 million km (~0.0092 AU), nearly identical to our Sun.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 0.95, outer: 1.45 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Direct optical star in an astrometric 185.6-day orbit around a dormant 9.62 M☉ stellar-mass black hole (Gaia BH1).',
      planets: []
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '11 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion via Proton-Proton Chain',
    notableFacts: [
      'Discovered in 2022 via ultra-precise Gaia astrometry by Kareem El-Badry and the Gaia Collaboration.',
      'Orbits Gaia BH1—the closest known black hole to Earth at just 1,560 light-years—completing an orbit every 185.6 days at a distance of 1.4 AU (similar to Mars’s orbit around the Sun).',
      'The black hole has a mass of 9.62 Solar masses and is completely dormant and dark, having been discovered purely by the star’s exquisite astrometric wobble.'
    ],
    description: 'The solar-like G-dwarf optical star orbiting Gaia BH1, the closest known black hole to Earth at just 1,560 light-years.'
  }),

  // 12. Gaia BH2 Optical Companion Star (Second Closest Black Hole System)
  makeStar({
    id: 'gaia-bh2-companion',
    name: 'Gaia BH2 Companion Star',
    alternateNames: ['Gaia DR3 5870569352746779008', '2MASS J13501659-5914144'],
    constellation: 'Centaurus',
    diameterSolar: 7.80,
    temperature: 4600,
    spectralType: 'K0III',
    spectralClass: 'K',
    luminositySolar: 28.0,
    massSolar: 1.07,
    estimatedAge: '8.5 Billion Years',
    estimatedAgeMyr: 8500,
    metallicityFeH: -0.25,
    rotationalVelocityKmS: 3.2,
    distanceLy: 3800,
    apparentMagnitude: 12.3,
    absoluteMagnitude: 2.0,
    surfaceGravityLogG: 3.1,
    colorHex: '#ffcc66',
    coronaColorHex: '#ffd980',
    solarEngulfment: 'Spans 10.9 million km (~0.0726 AU), an ascending red giant star.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 4.8, outer: 7.5 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Red giant star completing a wide 1,277-day orbit around an 8.9 M☉ dormant black hole (Gaia BH2).',
      planets: []
    },
    stellarStage: 'Red Giant',
    lifespanEstimate: '9.0 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Shell Hydrogen Burning on Red Giant Branch',
    notableFacts: [
      'Discovered in 2023 from Gaia DR3 data as the second closest confirmed black hole system to Earth (3,800 ly).',
      'The red giant star orbits an 8.9 Solar mass dormant black hole with a long period of 1,277 days (3.5 years) at an average distance of 4.1 AU.',
      'Proves that massive black holes can form and survive wide non-interacting orbits with evolved red giant stars without destroying them during supernovae.'
    ],
    description: 'The bright red giant optical companion orbiting Gaia BH2, an 8.9 M☉ dormant black hole in Centaurus.'
  }),

  // 13. Gaia DR3 3425624763261270272 ("Gaia DR3 Wide Black Hole Twin")
  makeStar({
    id: 'gaia-dr3-3425',
    name: 'Gaia DR3 3425624763261270272',
    alternateNames: ['Gaia DR3 3425', 'LAMOST J054944.38+453119.2'],
    constellation: 'Auriga',
    diameterSolar: 1.05,
    temperature: 5740,
    spectralType: 'G3V',
    spectralClass: 'G',
    luminositySolar: 1.15,
    massSolar: 1.02,
    estimatedAge: '5.2 Billion Years',
    estimatedAgeMyr: 5200,
    metallicityFeH: 0.05,
    rotationalVelocityKmS: 2.4,
    distanceLy: 2450,
    apparentMagnitude: 14.2,
    absoluteMagnitude: 4.9,
    surfaceGravityLogG: 4.42,
    colorHex: '#fff0a6',
    coronaColorHex: '#ffe885',
    solarEngulfment: 'Spans 1.46 million km (~0.0098 AU).',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 1.0, outer: 1.5 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Astrometric single-lined binary with a ~8.9 M☉ compact dark companion orbiting on a 1,500-day period.',
      planets: []
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '10 Billion Years',
    futureFate: 'White Dwarf',
    fusionProcess: 'Core Hydrogen Fusion',
    notableFacts: [
      'One of the crowning achievements of Gaia DR3 astrometry: a Solar twin whose 3D orbital loop reveals a massive silent black hole.',
      'The orbit is nearly circular and spans several astronomical units, challenging traditional theories of violent supernova kicks.',
      'Helped establish the emerging population of wide dormant stellar black hole binaries across the Milky Way.'
    ],
    description: 'A solar-twin G dwarf in Auriga whose precise Gaia DR3 astrometric orbit uncovered a silent 9 M☉ black hole companion.'
  }),

  // 14. Gaia DR3 Fast-Mover (Hypervelocity Ejected Star)
  makeStar({
    id: 'gaia-dr3-fast-mover',
    name: 'Gaia DR3 Hypervelocity Star (Gaia DR3 394)',
    alternateNames: ['Gaia DR3 3947472091728362496', 'HVS Gaia-1'],
    constellation: 'Sagittarius',
    diameterSolar: 1.65,
    temperature: 9200,
    spectralType: 'A1V',
    spectralClass: 'A',
    luminositySolar: 22.0,
    massSolar: 2.15,
    estimatedAge: '350 Million Years',
    estimatedAgeMyr: 350,
    metallicityFeH: 0.10,
    rotationalVelocityKmS: 120.0,
    distanceLy: 21000,
    apparentMagnitude: 13.9,
    absoluteMagnitude: 1.9,
    surfaceGravityLogG: 4.12,
    colorHex: '#d9e6ff',
    coronaColorHex: '#f0f5ff',
    solarEngulfment: 'Spans 2.30 million km (~0.0154 AU), an unbound runaway star.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 4.2, outer: 6.6 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Hypervelocity star moving at over 1,700 km/s, ejected directly from the Galactic Center by Sagittarius A*.',
      planets: []
    },
    stellarStage: 'Main Sequence Dwarf',
    lifespanEstimate: '800 Million Years',
    futureFate: 'Escapes the Milky Way into Intergalactic Space',
    fusionProcess: 'Core Hydrogen Fusion via CNO Cycle',
    notableFacts: [
      'Discovered by the Gaia astrometric survey travelling at an extreme velocity exceeding 1,750 km/s relative to the Galactic frame.',
      'Orbital traceback leads directly to Sagittarius A*, the supermassive black hole at the center of the Milky Way, ejected via the Hills mechanism ~5 million years ago.',
      'Exceeds the Milky Way’s escape velocity by a factor of three and is permanently escaping into intergalactic space.'
    ],
    description: 'A high-speed A-type star in Sagittarius clocked by Gaia at 1,750 km/s, kicked into intergalactic space by Sagittarius A*.'
  }),

  // 15. Gaia DR3 1007785 (Ultra-pure Halo Blue Subgiant Runaway)
  makeStar({
    id: 'gaia-dr3-1007',
    name: 'Gaia DR3 1007785 (Pristine Halo Subgiant)',
    alternateNames: ['Gaia DR3 1007785368383921280', '2MASS J03102341+5411328'],
    constellation: 'Perseus',
    diameterSolar: 2.60,
    temperature: 6350,
    spectralType: 'F6IV',
    spectralClass: 'F',
    luminositySolar: 9.8,
    massSolar: 1.15,
    estimatedAge: '11.8 Billion Years',
    estimatedAgeMyr: 11800,
    metallicityFeH: -1.85,
    rotationalVelocityKmS: 4.0,
    distanceLy: 4800,
    apparentMagnitude: 11.2,
    absoluteMagnitude: 2.4,
    surfaceGravityLogG: 3.75,
    colorHex: '#fff5e6',
    coronaColorHex: '#fffff0',
    solarEngulfment: 'Spans 3.62 million km (~0.0242 AU), an ancient metal-deficient subgiant.',
    engulfsPlanets: [],
    habitableZoneAU: { inner: 2.8, outer: 4.4 },
    exoplanetSystem: {
      hasExoplanets: false,
      confirmedCount: 0,
      systemOverview: 'Ancient Galactic halo subgiant benchmark discovered in Gaia DR3 astrophysical parameters catalog.',
      planets: []
    },
    stellarStage: 'Subgiant',
    lifespanEstimate: '12.5 Billion Years',
    futureFate: 'Red Giant shedding into a White Dwarf',
    fusionProcess: 'Hydrogen Shell Burning',
    notableFacts: [
      'Selected from the Gaia Data Release 3 astrophysical parameters catalog as a prime Population II metal-poor subgiant standard ([Fe/H] = -1.85).',
      'Features high-precision Gaia radial velocity and parallax providing an unambiguous 3D space velocity of 310 km/s through the Galactic halo.',
      'Currently leaving the main sequence as its core exhausts hydrogen fuel after 11.8 billion years.'
    ],
    description: 'An ancient metal-poor Population II subgiant in Perseus cataloged with sub-percent precision by Gaia DR3.'
  })
];
