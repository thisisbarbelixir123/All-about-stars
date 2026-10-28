export interface SpectralTypeGuideItem {
  id: string;
  code: string;
  name: string;
  mnemonicWord: string;
  temperatureKelvin: string;
  tempMin: number;
  tempMax: number;
  colorName: string;
  colorHex: string;
  simpleAnalogy: string;
  plainEnglishExplanation: string;
  typicalLifespan: string;
  abundanceMilkyWay: string;
  massRangeSolar: string;
  radiusRangeSolar: string;
  exampleStarIds: string[];
  keyFacts: string[];
}

export interface ExoticClassGuideItem {
  code: string;
  abbreviation: string;
  name: string;
  buttonTitle: string;
  mobileTitle: string;
  category: string;
  temperature: string;
  colorHex: string;
  tag: string;
  explanation: string;
  distinguishingFeatures: string[];
  exampleStarIds: string[];
  externalExamples?: string[];
}

export interface LuminosityClassGuideItem {
  id: string;
  romanNumeral: string;
  abbreviation: string;
  title: string;
  buttonTitle: string;
  mobileTitle: string;
  category: 'supergiants' | 'giants' | 'subgiants' | 'main-sequence' | 'subdwarfs' | 'remnants' | string;
  colorHex?: string;
  plainEnglishExplanation: string;
  howItWorks: string;
  typicalSizeComparison: string;
  exampleStarIds: string[];
  coreEnergySource: string;
  fate: string;
}

export interface VariableStarGuideItem {
  id: string;
  name: string;
  category: string;
  buttonTitle: string;
  colorHex: string;
  tag: string;
  periodRange: string;
  variabilityType: string;
  explanation: string;
  mechanism: string;
  distinguishingFeatures: string[];
  exampleStarIds: string[];
  externalExamples?: string[];
}

export interface StarSystemGuideItem {
  id: string;
  name: string;
  category: string;
  buttonTitle: string;
  colorHex: string;
  tag: string;
  multiplicity: string;
  explanation: string;
  orbitalDynamics: string;
  distinguishingFeatures: string[];
  exampleStarIds: string[];
  externalExamples?: string[];
}

export interface StellarPopulationGuideItem {
  id: string;
  name: string;
  category: string;
  buttonTitle: string;
  colorHex: string;
  tag: string;
  metallicityRange: string;
  typicalAge: string;
  galacticLocation: string;
  explanation: string;
  nucleosyntheticOrigin: string;
  distinguishingFeatures: string[];
  exampleStarIds: string[];
  externalExamples?: string[];
}

export interface StellarRemnantGuideItem {
  id: string;
  code: string;
  abbreviation: string;
  name: string;
  buttonTitle: string;
  mobileTitle: string;
  category: string;
  temperature: string;
  colorHex: string;
  tag: string;
  density: string;
  typicalMass: string;
  typicalDiameter: string;
  quantumSupportOrHorizon: string;
  explanation: string;
  formationMechanism: string;
  distinguishingFeatures: string[];
  exampleStarIds: string[];
  externalExamples?: string[];
}

export interface HypotheticalStarGuideItem {
  id: string;
  name: string;
  category: string;
  buttonTitle: string;
  colorHex: string;
  tag: string;
  theoreticalEra: string;
  energySource: string;
  explanation: string;
  physicsMechanism: string;
  distinguishingFeatures: string[];
  exampleStarIds: string[];
  externalExamples?: string[];
}

export interface StellarLifeCyclePath {
  id: string;
  title: string;
  massCategory: string;
  summary: string;
  colorGradient: string;
  steps: {
    stageName: string;
    duration: string;
    description: string;
    iconType: string;
  }[];
}

export interface StellarMythItem {
  myth: string;
  reality: string;
  explanation: string;
  keyTakeaway: string;
}

export interface ClassificationQuizQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export const SPECTRAL_CLASSES_GUIDE: SpectralTypeGuideItem[] = [
  {
    id: 'class-o',
    code: 'O',
    name: 'O-Type: Blistering Blue Furnaces',
    mnemonicWord: 'Oh',
    temperatureKelvin: '≥ 30,000 K (up to 50,000+ K)',
    tempMin: 30000,
    tempMax: 50000,
    colorName: 'Brilliant blue to Blue',
    colorHex: '#92b5ff',
    simpleAnalogy: 'Like an industrial plasma laser beam operating at absolute maximum overdrive.',
    plainEnglishExplanation:
      'The hottest, most luminous, and rarest normal stars in the cosmos. O-stars shine with blinding ultraviolet brilliance, have scorching surface temperatures starting at 30,000 K, and blast furious stellar winds into surrounding interstellar space.',
    typicalLifespan: '3 to 10 Million Years (cosmic blink of an eye)',
    abundanceMilkyWay: '~0.00003% (Only 1 in every 3,000,000 stars!)',
    massRangeSolar: '16 to 100+ M☉',
    radiusRangeSolar: '6 to 25+ R☉',
    exampleStarIds: ['vfts-352', 'zeta-puppis', 'melnick-42', 'hd-93129a', 'alnitak', 'mintaka', 'theta1-orionis-c'],
    keyFacts: [
      'Emit over 90% of their radiation in invisible ionizing ultraviolet light',
      'Burn through their core hydrogen so fast they never have time to move far from where they were born',
      'Always end their brief lives in titanic Supernovae or Hypernovae, forming black holes or neutron stars',
      'True O-stars in our catalog include Zeta Puppis (Naos, O4If), VFTS 352 (O4.5V + O5.5V), Melnick 42 (O2 If*), and HD 93129A',
    ],
  },
  {
    id: 'class-b',
    code: 'B',
    name: 'B-Type: Luminous Blue-White Beacons',
    mnemonicWord: 'Be',
    temperatureKelvin: '10,000 to 30,000 K',
    tempMin: 10000,
    tempMax: 30000,
    colorName: 'Blue to Deep bluish white',
    colorHex: '#9bb0ff',
    simpleAnalogy: 'Like a high-intensity xenon arc lamp or lightning strike.',
    plainEnglishExplanation:
      'Extremely bright, hot stars that dominate the night sky despite being relatively rare. Many of the brightest stars in Orion (such as Rigel, Alnilam, and Bellatrix) and the Pleiades open cluster are B-type stars.',
    typicalLifespan: '10 to 100 Million Years',
    abundanceMilkyWay: '~0.13% (1 in 800 stars)',
    massRangeSolar: '2.1 to 16 M☉',
    radiusRangeSolar: '2.5 to 10+ R☉ (up to 80 R☉ for B-supergiants like Rigel & Alnilam)',
    exampleStarIds: ['rigel', 'alnilam', 'spica', 'achernar', 'bellatrix', 'regulus', 'alkaid', 'alcyone'],
    keyFacts: [
      'Very prominent in stellar nurseries and young open star clusters',
      'Alnilam (the central star of Orion’s Belt) is a prime B0Ia supergiant with a temperature of ~27,500 K',
      'Often rotate at staggering speeds (like Achernar, spinning so fast it bulges into a cosmic pancake)',
      'Produce intense stellar radiation that carves out glowing nebulae',
    ],
  },
  {
    id: 'class-a',
    code: 'A',
    name: 'A-Type: Pure White Diamonds',
    mnemonicWord: 'A',
    temperatureKelvin: '7,500 to 10,000 K',
    tempMin: 7500,
    tempMax: 10000,
    colorName: 'Deep bluish white to Bluish white',
    colorHex: '#c0d1ff',
    simpleAnalogy: 'Like a brilliant white diamond gemstone or a camera flashbulb.',
    plainEnglishExplanation:
      'Some of the most famous and brightest stars seen from Earth (including Sirius, the brightest star in our night sky, and Vega). They have the strongest hydrogen absorption lines in their light spectra.',
    typicalLifespan: '400 Million to 1.5 Billion Years',
    abundanceMilkyWay: '~0.6% (1 in 160 stars)',
    massRangeSolar: '1.4 to 2.1 M☉',
    radiusRangeSolar: '1.5 to 2.5 R☉ (Deneb is an exceptional A-supergiant at ~200 R☉)',
    exampleStarIds: ['sirius-a', 'vega', 'altair', 'fomalhaut', 'deneb', 'canopus', 'castor-aa'],
    keyFacts: [
      'Sirius A and Vega are both quintessential A-type main-sequence stars',
      'Strongly exhibit hydrogen Balmer lines when split through a spectroscope',
      'Often possess dusty circumstellar debris disks where infant planets form (like Fomalhaut and Vega)',
    ],
  },
  {
    id: 'class-f',
    code: 'F',
    name: 'F-Type: Creamy Yellow-White Stars',
    mnemonicWord: 'Fine',
    temperatureKelvin: '6,000 to 7,500 K',
    tempMin: 6000,
    tempMax: 7500,
    colorName: 'Bluish white to Yellowish white',
    colorHex: '#e4e8ff',
    simpleAnalogy: 'Like warm halogen vehicle headlights.',
    plainEnglishExplanation:
      'Slightly bigger, hotter, and brighter than our Sun. They are great candidates in the search for alien habitable worlds because they have wide habitable zones and stable lifespans lasting billions of years.',
    typicalLifespan: '2 to 4 Billion Years',
    abundanceMilkyWay: '~3% (1 in 33 stars)',
    massRangeSolar: '1.04 to 1.4 M☉',
    radiusRangeSolar: '1.15 to 1.4 R☉ (up to 70 R☉ for F-supergiants like Polaris)',
    exampleStarIds: ['polaris', 'procyon-a', 'wezen', 'rho-cassiopeiae', 'sadr', 'almaaz', 'gamma-virginis-a', 'boyajians-star'],
    keyFacts: [
      'Polaris (the North Star), Wezen, and the hypergiant Rho Cassiopeiae are famous luminous F-type supergiants in our catalog',
      'Stable enough to potentially host habitable exoplanets with extensive atmospheres',
      'Emit a healthy balance of visible light and mild UV radiation',
    ],
  },
  {
    id: 'class-g',
    code: 'G',
    name: 'G-Type: Golden Yellow Stars (Our Sun\'s Class)',
    mnemonicWord: 'Girl / Guy',
    temperatureKelvin: '5,200 to 6,000 K',
    tempMin: 5200,
    tempMax: 6000,
    colorName: 'Yellowish white to Pale yellow',
    colorHex: '#fff4e8',
    simpleAnalogy: 'Like a cozy, stable fireplace log that burns evenly for a whole evening.',
    plainEnglishExplanation:
      'The cosmic "Goldilocks" star class that brought life to Earth! Our Sun is a G2V yellow dwarf. G-type stars are stable, long-lived, and emit the perfect spectrum of light for liquid water and photosynthesis.',
    typicalLifespan: '8 to 12 Billion Years (~10 Billion for our Sun)',
    abundanceMilkyWay: '~7.6% (1 in 13 stars)',
    massRangeSolar: '0.8 to 1.04 M☉',
    radiusRangeSolar: '0.9 to 1.15 R☉',
    exampleStarIds: ['sun', 'alpha-centauri-a', 'tau-ceti', '51-pegasi', 'kepler-452', 'v382-carinae', 'zeta-1-reticuli', 'kepler-22'],
    keyFacts: [
      'Our Sun is currently halfway through its ~10-billion-year main sequence life',
      'Although called "Yellow Dwarfs", in true space above Earth’s atmosphere they appear crisp white!',
      '51 Pegasi (a G-dwarf) was the very first normal star discovered to host an exoplanet in 1995',
    ],
  },
  {
    id: 'class-k',
    code: 'K',
    name: 'K-Type: Warm Orange Dwarfs & Giants',
    mnemonicWord: 'Kiss',
    temperatureKelvin: '3,700 to 5,200 K',
    tempMin: 3700,
    tempMax: 5200,
    colorName: 'Pale yellow to Light orange',
    colorHex: '#ffe4ce',
    simpleAnalogy: 'Like glowing orange campfire coals that remain hot for hours.',
    plainEnglishExplanation:
      'Called the "Super-Habitable" star class by astrobiologists. K-dwarfs are slightly cooler and smaller than our Sun, but live for 20 to 70 billion years and produce much less dangerous UV flares than red dwarfs.',
    typicalLifespan: '20 to 70 Billion Years (longer than the current age of the Universe!)',
    abundanceMilkyWay: '~12.1% (1 in 8 stars)',
    massRangeSolar: '0.45 to 0.8 M☉',
    radiusRangeSolar: '0.7 to 0.9 R☉ (Or 25 to 50 R☉ for K-giants like Arcturus & Aldebaran)',
    exampleStarIds: ['arcturus', 'aldebaran', 'pollux', 'alpha-centauri-b', 'epsilon-eridani', 'v766-centauri', '61-cygni-a'],
    keyFacts: [
      'Astrobiologists consider K-dwarfs the optimal sweet-spot for long-term complex biological evolution',
      'Arcturus and Aldebaran are famous evolved K-type Giant stars visible with the naked eye',
      'Very quiet and stable magnetic fields compared to younger red dwarfs',
    ],
  },
  {
    id: 'class-m',
    code: 'M',
    name: 'M-Type: Warm Golden Peach-Orange Dwarfs & Giants',
    mnemonicWord: 'Me',
    temperatureKelvin: '2,400 to 3,700 K',
    tempMin: 2400,
    tempMax: 3700,
    colorName: 'Light orange to Orangish red',
    colorHex: '#ffba8a',
    simpleAnalogy: 'Like the slow, smoldering red ember at the bottom of a grill.',
    plainEnglishExplanation:
      'The most populous star class in the universe by far (over 76% of all stars). M-stars span from tiny, ultra-efficient Red Dwarfs (like Proxima Centauri and TRAPPIST-1) to bloated Red Supergiants (like Betelgeuse).',
    typicalLifespan: '100 Billion to 10 Trillion Years (for dwarfs) / 10 Million Years (for supergiants)',
    abundanceMilkyWay: '~76.5% (More than 3 out of every 4 stars in our galaxy!)',
    massRangeSolar: '0.08 to 0.45 M☉ (Dwarfs) / 10 to 25+ M☉ (Supergiants)',
    radiusRangeSolar: '0.1 to 0.6 R☉ (Dwarfs) / 600 to 2,150 R☉ (Hyper/Supergiants!)',
    exampleStarIds: ['stephenson-2-18', 'betelgeuse', 'antares', 'uy-scuti', 'proxima-centauri', 'trappist-1', 'barnards-star', 'vy-canis-majoris'],
    keyFacts: [
      'Every single star born as an M-dwarf since the Big Bang is still in its infancy today',
      'Proxima Centauri (our closest stellar neighbor, 4.24 ly away) is an M-dwarf',
      'Red Supergiants are so huge because their outer envelopes have expanded and cooled down to red temperatures',
    ],
  },
];

/**
 * Chemically peculiar evolved giant stars beyond the canonical OBAFGKM Harvard sequence:
 * When low- to intermediate-mass stars ascend the Asymptotic Giant Branch (AGB),
 * recurring thermal pulses dredge nucleosynthetic products (carbon and s-process elements)
 * into their outer convective envelopes, fundamentally transforming their atmospheric chemistry.
 */
export const BEYOND_OBAFGKM_CLASSES_GUIDE: SpectralTypeGuideItem[] = [
  {
    id: 'class-c',
    code: 'C',
    name: 'C-Type: Carbon Stars (C/O > 1)',
    mnemonicWord: 'Beyond M: Carbon',
    temperatureKelvin: '1,900 to 3,500 K',
    tempMin: 1900,
    tempMax: 3500,
    colorName: 'Orangish red to Ruby red',
    colorHex: '#ff8b3d',
    simpleAnalogy: 'A late-stage cosmic forge where core carbon has been dredged up, forming thick soot and diatomic carbon that blocks all blue light.',
    plainEnglishExplanation:
      'Highly evolved asymptotic giant branch (AGB) stars where the third dredge-up has enriched the outer envelope in carbon, driving the Carbon-to-Oxygen ratio above unity (C/O > 1). All available oxygen locks into durable carbon monoxide (CO); surplus carbon forms diatomic carbon (C₂ Swan bands), cyanogen (CN), and polycyclic aromatic hydrocarbons. The dense amorphous soot and silicon carbide dust extinguish blue and violet wavelengths completely, producing the deepest, purest ruby glow in the night sky.',
    typicalLifespan: '100,000 to a few Million Years (brief, late AGB thermal-pulse phase)',
    abundanceMilkyWay: '~0.005% (Rare late-stage evolved giants)',
    massRangeSolar: '1.5 to 5.0 M☉',
    radiusRangeSolar: '300 to 750+ R☉ (Engulfs the orbits of Mars and the Asteroid Belt)',
    exampleStarIds: [
      'cw-leonis',
      'la-superba',
      'u-antliae',
      'v-hydrae',
      'r-leporis',
      'tx-piscium',
      'v-aquilae',
      'uu-aurigae'
    ],
    keyFacts: [
      'Father Angelo Secchi discovered them in 1868 and named Y Canum Venaticorum "La Superba" for its ruby splendor',
      'R Leporis (Hind’s Crimson Star) was celebrated as "like a drop of liquid blood on a velvet black field"',
      'MK Spectral Subtypes: C-R (warm carbon giants), C-N (cool classical AGB giants), C-J (strong ¹³C enrichment), C-H (metal-poor halo stars), and extreme infrared carbon stars like CW Leonis (IRC +10216)',
      'Rich in s-process neutron-capture elements including technetium, barium, strontium, and zirconium',
      'Shed dense expanding spherical smoke rings and concentric detached dust envelopes (such as U Antliae imaged by ALMA)',
      'All 8 Carbon Stars in our catalog: CW Leonis, La Superba, U Antliae, V Hydrae, R Leporis, TX Piscium, V Aquilae, and UU Aurigae',
    ],
  },
  {
    id: 'class-s',
    code: 'S',
    name: 'S-Type: Zirconium Stars (ZrO / ⁹⁹Tc)',
    mnemonicWord: 'Beyond M: Zirconium',
    temperatureKelvin: '2,500 to 3,500 K',
    tempMin: 2500,
    tempMax: 3500,
    colorName: 'Light orange to Deep orange',
    colorHex: '#ffa15c',
    simpleAnalogy: 'The transitional phase between oxygen-rich M giants and carbon stars, where C and O balance and zirconium oxide lines shine.',
    plainEnglishExplanation:
      'Luminous asymptotic giant branch stars representing the critical evolutionary transition between normal oxygen-rich M-giants and carbon-rich C-giants, with an atmospheric C/O ratio close to unity (0.95 ≤ C/O < 1.0). Titanium oxide (TiO) bands weaken or disappear, replaced by prominent absorption bands of zirconium oxide (ZrO), lanthanum oxide (LaO), and yttrium oxide (YO). Optical spectra also reveal absorption lines of unstable technetium-99 (half-life 211,000 years), confirming ongoing active nucleosynthesis.',
    typicalLifespan: '100,000 to 1 Million Years',
    abundanceMilkyWay: '< 0.001% (Extremely rare chemical transition phase)',
    massRangeSolar: '1.5 to 4.0 M☉',
    radiusRangeSolar: '250 to 550 R☉',
    exampleStarIds: ['chi-cygni', 'pi1-gruis', 'r-andromedae'],
    keyFacts: [
      'Chi Cygni displays one of the most extreme visual brightness ranges known: fluctuating by a factor of 10,000 (mag 3.3 to 14.2) over 408 days',
      'In 1952, Paul Merrill discovered Technetium (⁹⁹Tc) in R Andromedae, providing the historic smoking-gun proof that stars actively forge heavy elements in their interiors',
      'In 2017, the ESO VLTI (PIONIER) directly resolved bubbling convective granules on Pi¹ Gruis spanning more than a quarter of the star’s visible face',
      'Spectral types range from pure S-stars (no TiO) to intermediate MS (weak ZrO) and SC (transitioning to carbon stars)',
      'All 3 S-Type Stars in our catalog: Chi Cygni (χ Cyg), Pi-1 Gruis (π¹ Gru), and R Andromedae (R And)',
    ],
  },
];

export const ALL_SPECTRAL_CLASSES_GUIDE: SpectralTypeGuideItem[] = [
  ...SPECTRAL_CLASSES_GUIDE,
  ...BEYOND_OBAFGKM_CLASSES_GUIDE,
];

export const EXOTIC_CLASSES_GUIDE: ExoticClassGuideItem[] = [
  {
    code: 'WR (WN / WC / WO)',
    abbreviation: 'WR',
    name: 'Wolf-Rayet Stars',
    buttonTitle: 'Wolf-Rayet Stars',
    mobileTitle: 'Wolf-Rayet',
    category: 'Massive Stripped Cores',
    temperature: '33,000 to 100,000+ K',
    colorHex: '#8fb2ff',
    tag: 'Stripped Fusion Core',
    explanation:
      'Evolved ultra-massive stars that have furiously blasted away their entire outer hydrogen atmospheres via fierce 2,000+ km/s stellar winds. This exposes their scorching helium, nitrogen (WN), carbon (WC), and oxygen (WO) fusion cores directly to space.',
    distinguishingFeatures: [
      'Dominated by broad, high-excitation emission lines rather than normal absorption lines',
      'Extreme mass-loss rates shedding an entire solar mass every 10,000 to 100,000 years',
      'Direct precursors to Type Ib/Ic core-collapse supernovae and long-duration Gamma-Ray Bursts',
    ],
    exampleStarIds: ['r136a1', 'wr-102', 'wr-142', 'regor', 'wr-136', 'peony-star', 'bat99-98', 'vfts-682'],
  },
  {
    code: 'LBV (S Dor)',
    abbreviation: 'LBV',
    name: 'Luminous Blue Variables',
    buttonTitle: 'Luminous Blue Variables',
    mobileTitle: 'LBV',
    category: 'Eruptive Hypergiants',
    temperature: '8,500 to 30,000+ K (violently variable)',
    colorHex: '#9bb0ff',
    tag: 'Eddington Outbursts',
    explanation:
      'Extremely luminous, unstable hypergiants teetering on the edge of the Eddington luminosity limit (where outward radiation pressure rivals inward gravitational pull). They undergo colossal episodic "great eruptions", shedding massive nebula shells.',
    distinguishingFeatures: [
      'Dramatic multi-magnitude brightness swings and spectroscopic variability over decades',
      'Often encased within expanding bipolar reflection/emission nebulae (like the Homunculus Nebula)',
      'Represent an ephemeral, brief transitional phase (< 100,000 years) prior to the Wolf-Rayet stage',
    ],
    exampleStarIds: ['eta-carinae-a', 'pistol-star', 's-doradus', 'cygnus-ob2-12', 'v4998-sagittarii', 'lbv-1806-20', 'p-cygni'],
  },
  {
    code: 'L / T / Y',
    abbreviation: 'BD',
    name: 'Brown Dwarfs',
    buttonTitle: 'Brown Dwarfs',
    mobileTitle: 'Brown Dwarf',
    category: 'Substellar Objects',
    temperature: '250 to 2,000 K (room temp to deep red)',
    colorHex: '#ff6a00',
    tag: 'Substellar Intermediate',
    explanation:
      'Substellar objects with between 13 and 80 Jupiter masses that bridge gas giant planets and true stars. Their core pressure and temperature never get high enough to sustain stable hydrogen fusion, though they briefly fuse deuterium and lithium.',
    distinguishingFeatures: [
      'Type L (1,300–2,400 K): Dark red-brown with iron, magnesium, and silicate rain clouds',
      'Type T (700–1,300 K): Magenta-tinted atmospheres dominated by methane (CH₄) and water vapor',
      'Type Y (< 700 K down to 250 K / -13°C): Ultra-cool objects with water ice clouds and ambient room temperatures',
    ],
    exampleStarIds: ['luhman-16-a', 'luhman-16-b', 'gliese-229-b', 'wise-0855-0714', 'wise-1506-7027', 'wise-0350-5658'],
  },
  {
    code: 'C (C-R, C-N, C-J, C-H, C-d)',
    abbreviation: 'C',
    name: 'Carbon Stars (C)',
    buttonTitle: 'Carbon Stars',
    mobileTitle: 'Carbon Star',
    category: 'Chemically Peculiar Giants',
    temperature: '2,000 to 3,500 K',
    colorHex: '#ef4444',
    tag: 'Soot Photosphere',
    explanation:
      'Late-stage asymptotic giant branch (AGB) red giants where thermal dredge-up convective pulses have pulled carbon from the core up into the atmosphere, creating a Carbon-to-Oxygen ratio greater than 1 (C/O > 1). All available oxygen locks with carbon into carbon monoxide (CO); surplus carbon forms diatomic carbon (C₂), cyanogen (CN), and graphite soot.',
    distinguishingFeatures: [
      'Deep ruby red color due to microscopic carbon soot grains completely absorbing violet, blue, and green light',
      'MK Classification Subtypes: C-R (warm carbon giants), C-N (cool classical AGB carbon giants), C-J (strong ¹³C isotopic enrichment, like La Superba), C-H (metal-poor halo giants), and C-d (dwarf carbon stars)',
      'Spectra dominated by prominent Swan bands of C₂ molecules and cyanogen radical absorption bands',
      'Surrounded by detached circumstellar dust shells and smoke rings shed during episodic thermal pulses',
    ],
    exampleStarIds: ['cw-leonis', 'la-superba', 'u-antliae', 'v-hydrae', 'r-leporis', 'tx-piscium', 'v-aquilae', 'uu-aurigae'],
  },
  {
    code: 'S (ZrO / ⁹⁹Tc)',
    abbreviation: 'S',
    name: 'S-Type Stars (Zirconium / Technetium)',
    buttonTitle: 'Zirconium Stars',
    mobileTitle: 'Zirconium',
    category: 'Chemically Peculiar Giants',
    temperature: '2,200 to 3,600 K',
    colorHex: '#ff5722',
    tag: 'Zirconium / Technetium',
    explanation:
      'Cool asymptotic giant branch (AGB) giants where carbon and oxygen abundances are closely matched (C/O ≈ 0.95 to 1.0). Their atmospheres exhibit prominent absorption bands of zirconium oxide (ZrO) and active radioactive Technetium-99 (half-life 211,000 years), directly confirming in-situ s-process neutron capture nucleosynthesis in real astronomical time.',
    distinguishingFeatures: [
      'Spectra dominated by zirconium oxide (ZrO), yttrium oxide (YO), and lanthanum oxide (LaO) bands',
      'Detection of unstable Technetium-99 provides unassailable proof of recent third dredge-up core enrichment',
      'Long-period Mira-type pulsating red giants with immense circumstellar dust expulsion shells',
    ],
    exampleStarIds: ['chi-cygni', 'pi1-gruis', 'r-andromedae'],
  },
];

export const LUMINOSITY_CLASSES_GUIDE: LuminosityClassGuideItem[] = [
  {
    id: 'class-hypergiants',
    romanNumeral: 'Ia+',
    abbreviation: 'Ia+',
    title: 'Hypergiants',
    buttonTitle: 'Hypergiants',
    mobileTitle: 'Hypergiant',
    category: 'supergiants',
    colorHex: '#f43f5e',
    plainEnglishExplanation:
      'The most luminous, massive, and structurally extreme stars known. Designated as Yerkes luminosity class Ia+ (historically also referred to as Class 0 or Ia-0 in some literature). The category encompasses Luminous Blue Variables (LBVs, like Eta Carinae and S Doradus), Blue Hypergiants, Yellow Hypergiants (like V766 Centauri and Rho Cassiopeiae), and monstrous Red Hypergiants (like Stephenson 2-18 and UY Scuti).',
    howItWorks:
      'Extreme core fusion rates generate ferocious radiation pressure that pushes against the Eddington luminosity limit, blowing colossal clouds of mass into surrounding space as dense circumstellar nebulae.',
    typicalSizeComparison: 'Roughly 100 to over 2,000 times the diameter of our Sun! (From compact 100–200 R☉ blue hypergiants/LBVs to colossal 1,500–2,150 R☉ red hypergiants that would engulf Jupiter and Saturn).',
    exampleStarIds: ['stephenson-2-18', 'uy-scuti', 'vy-canis-majoris', 'eta-carinae-a', 's-doradus', 'v766-centauri'],
    coreEnergySource: 'Fusing heavy elements (Helium, Carbon, Oxygen, Neon, Silicon) at astronomical temperatures',
    fate: 'Cataclysmic Supernova / Hypernova, or direct collapse into a Stellar-Mass Black Hole.',
  },
  {
    id: 'class-supergiants',
    romanNumeral: 'Ia & Ib',
    abbreviation: 'Ia',
    title: 'Supergiants',
    buttonTitle: 'Supergiants',
    mobileTitle: 'Supergiant',
    category: 'supergiants',
    colorHex: '#38bdf8',
    plainEnglishExplanation:
      'Massive aging stars that have expanded enormously. They come in both blistering blue varieties (like Rigel, burning hot) and swollen red varieties (like Betelgeuse, expanded and cool).',
    howItWorks:
      'Class Ia represents luminous supergiants; Class Ib represents less luminous supergiants. They shine with 10,000 to 500,000+ times the Sun\'s luminosity.',
    typicalSizeComparison: '30 to 900 times the diameter of the Sun.',
    exampleStarIds: ['betelgeuse', 'rigel', 'antares', 'deneb', 'mu-cephei', 'alnilam'],
    coreEnergySource: 'Accelerated shell and core fusion of advanced elements',
    fate: 'Type II Core-Collapse Supernova within a few million years, leaving a Neutron Star or Black Hole.',
  },
  {
    id: 'class-bright-giants',
    romanNumeral: 'II',
    abbreviation: 'II',
    title: 'Bright Giants',
    buttonTitle: 'Bright Giants',
    mobileTitle: 'Bright Giant',
    category: 'giants',
    colorHex: '#fbbf24',
    plainEnglishExplanation:
      'Luminous giant stars bridging giants and supergiants. Their atmospheres are significantly less dense and gravitationally bound than giants, yielding very sharp, narrow absorption lines with high intrinsic luminosity.',
    howItWorks:
      'Massive stars that have exhausted core hydrogen and are vigorously burning helium in the core or hydrogen in accelerated surrounding shells.',
    typicalSizeComparison: '30 to 100 times the diameter of our Sun.',
    exampleStarIds: ['canopus', 'mintaka', 'tarazed', 'adhara', 'sargas'],
    coreEnergySource: 'Helium core fusion and intense hydrogen shell burning',
    fate: 'Evolves into a Supergiant or sheds outer layers as a massive planetary nebula, leaving behind a white dwarf.',
  },
  {
    id: 'class-giants',
    romanNumeral: 'III',
    abbreviation: 'III',
    title: 'Giants',
    buttonTitle: 'Giants',
    mobileTitle: 'Giant',
    category: 'giants',
    colorHex: '#fb923c',
    plainEnglishExplanation:
      'Evolved stars that were once normal main-sequence stars (like our Sun). Once hydrogen fuel is exhausted in the innermost core, the inert helium core contracts while the outer layers expand and cool dramatically, transforming the star into an orange/red giant.',
    howItWorks:
      'Hydrogen shell burning pushes the star\'s outer envelope outward like a hot air balloon. When our Sun enters this stage in ~5 billion years, it will expand to engulf Mercury, Venus, and possibly Earth.',
    typicalSizeComparison: '10 to 60 times the diameter of the Sun.',
    exampleStarIds: ['arcturus', 'aldebaran', 'pollux', 'spica'],
    coreEnergySource: 'Helium core fusion ("Triple-Alpha process") + Hydrogen shell burning',
    fate: 'Sheds outer layers as a glowing Planetary Nebula, leaving behind a White Dwarf core.',
  },
  {
    id: 'class-subgiants',
    romanNumeral: 'IV',
    abbreviation: 'IV',
    title: 'Subgiants',
    buttonTitle: 'Subgiants',
    mobileTitle: 'Subgiant',
    category: 'subgiants',
    colorHex: '#facc15',
    plainEnglishExplanation:
      'Stars caught in the act of changing! They have just exhausted hydrogen fuel in their innermost core and are starting to expand and cool, bridging the gap between normal main-sequence stars and full giants.',
    howItWorks:
      'Core contraction heats up the surrounding hydrogen shell, starting the expansion process.',
    typicalSizeComparison: '1.5 to 4 times the diameter of the Sun.',
    exampleStarIds: ['procyon-a', 'rasalhague', 'delta-scuti', 'algol-b', 'regulus', 'methuselah-star', 'sneden-star', 'cayrel-star', 'smss-j031300'],
    coreEnergySource: 'Transitioning from core hydrogen to shell hydrogen burning',
    fate: 'Evolves directly into a Class III Red Giant over tens of millions of years.',
  },
  {
    id: 'class-main-sequence',
    romanNumeral: 'V',
    abbreviation: 'V',
    title: 'Main Sequence',
    buttonTitle: 'Main Sequence',
    mobileTitle: 'Main Seq',
    category: 'main-sequence',
    colorHex: '#4ade80',
    plainEnglishExplanation:
      'Where 90% of all stars in the universe spend 90% of their active lifetimes! In Yerkes Class V, hydrostatic equilibrium balances core nuclear fusion with gravity. Spans five distinct spectral stages: Red Dwarfs (M0V–M7V, plus ultracool M8–L2.5 dwarfs), Orange Dwarfs (KxV), Yellow Main Sequence (GxV, like our Sun), White Main Sequence (FxV & AxV, like Sirius A and Vega), and searing Blue Main Sequence (BxV & OxV, like Regulus and Achernar).',
    howItWorks:
      'In the core, immense temperature and pressure fuse Hydrogen nuclei into Helium, providing the outward thermal and radiation pressure that stably balances inward gravitational pull.',
    typicalSizeComparison: '0.08 to 15 times the diameter of the Sun across spectral classes M through O.',
    exampleStarIds: ['sun', 'alpha-centauri-a', 'sirius-a', 'vega', 'proxima-centauri', 'trappist-1', 'regulus', '61-cygni-a'],
    coreEnergySource: 'Core Hydrogen fusion (Proton-Proton chain in low-mass stars, CNO cycle in massive stars)',
    fate: 'Eventually exhausts core hydrogen and evolves into a Subgiant / Giant or Supergiant.',
  },
  {
    id: 'class-subdwarfs',
    romanNumeral: 'VI',
    abbreviation: 'VI',
    title: 'Subdwarfs',
    buttonTitle: 'Subdwarfs',
    mobileTitle: 'Subdwarf',
    category: 'subdwarfs',
    colorHex: '#38bdf8',
    plainEnglishExplanation:
      'Under-luminous stars that sit 1.5 to 2 magnitudes below the normal main sequence on the H-R diagram. Primarily ancient Population II halo stars with severe metal deficiency ([Fe/H] < -1.0) and reduced atmospheric opacity, allowing deeper, hotter, and denser layers to radiate directly.',
    howItWorks:
      'Low metallicity decreases atmospheric opacity (less line blanketing and electron-scattering), resulting in higher effective surface temperatures for a given mass and smaller, denser radii.',
    typicalSizeComparison: '0.2 to 0.8 times the diameter of the Sun.',
    exampleStarIds: [
      'hd-49798',
      'v361-hydrae',
      'kpd-1930-2752',
      'groombridge-1830',
      'kapteyns-star',
      'sdss-j102915',
      'mu-cassiopeiae'
    ],
    coreEnergySource: 'Pristine metal-poor core Hydrogen fusion',
    fate: 'Extremely long lifespans (tens to hundreds of billions of years), slowly evolving into helium white dwarfs.',
  },
  {
    id: 'class-white-dwarfs',
    romanNumeral: 'VII / WD',
    abbreviation: 'VII',
    title: 'White Dwarfs',
    buttonTitle: 'White Dwarfs',
    mobileTitle: 'White Dwarf',
    category: 'remnants',
    colorHex: '#e0f2fe',
    plainEnglishExplanation:
      'The collapsed carbon-oxygen core left behind after a low-to-medium mass star dies. It is no longer performing nuclear fusion; it simply glows white-hot from residual heat like a cooling charcoal briquette.',
    howItWorks:
      'Supported against total collapse by "Electron Degeneracy Pressure" (a quantum mechanical effect preventing electrons from being squeezed together).',
    typicalSizeComparison: 'Roughly the size of planet Earth (0.008 to 0.015 Solar Diameters), but with the mass of an entire Sun!',
    exampleStarIds: ['sirius-b', 'procyon-b', 'van-maanens-star'],
    coreEnergySource: 'No fusion! Purely cooling residual thermal radiation over trillions of years.',
    fate: 'Slowly cools over trillions of years into a cold, dark "Black Dwarf" (none exist yet in our young universe!).',
  },
];

export const VARIABLE_STARS_GUIDE: VariableStarGuideItem[] = [
  {
    id: 'pulsating-variables',
    name: 'Pulsating Variables',
    buttonTitle: 'Pulsating Variables',
    category: 'Intrinsic Pulsators',
    colorHex: '#38bdf8',
    tag: 'Acoustic Pulsations',
    periodRange: 'Hours to years',
    variabilityType: 'Intrinsic (Pulsating)',
    explanation:
      'Stars that physically expand and contract periodically as internal thermodynamic forces battle gravity. Changes in both physical radius and surface temperature cause periodic fluctuations in luminosity. Driven largely by the Eddington valve (kappa mechanism) in partial ionization zones.',
    mechanism:
      'Kappa-mechanism (opacity valve): In helium/hydrogen ionization zones, compression increases gas opacity, trapping heat and driving expansion. As layers expand and cool, ions recombine, opacity drops, trapped heat escapes, and gravity pulls layers back inward.',
    distinguishingFeatures: [
      'Periodic radial expansions and contractions of stellar photosphere',
      'Surface temperature peaks at maximum expansion velocity rather than maximum radius',
      'Encompasses Cepheids, RR Lyraes, Miras, RV Tauri, and Delta Scuti stars',
    ],
    exampleStarIds: ['polaris', 'delta-cephei', 'betelgeuse', 'mira-a'],
    externalExamples: ['Polaris (Alpha UMi)', 'Delta Cephei', 'RR Lyrae', 'Betelgeuse (Alpha Ori)'],
  },
  {
    id: 'cepheid-variables',
    name: 'Cepheid Variables',
    buttonTitle: 'Cepheid Variables',
    category: 'Standard Candles',
    colorHex: '#facc15',
    tag: 'Cosmic Yardsticks',
    periodRange: '1 to 100 days',
    variabilityType: 'Intrinsic (Pulsating)',
    explanation:
      'Luminous yellow supergiants undergoing rhythmic radial pulsations with extreme regular precision. Discovered by Henrietta Swan Leavitt in 1912, their pulsation period correlates directly and strictly with intrinsic absolute luminosity, serving as the premier primary "standard candles" to measure extragalactic distances across millions of light-years.',
    mechanism:
      'Doubly-ionized helium (He II) ionization zone acts as a heat valve near 40,000–50,000 K, driving regular acoustic radial pulsations.',
    distinguishingFeatures: [
      'Strict Period-Luminosity Relation (Leavitt Law): Longer pulsation periods correspond to brighter true luminosities',
      'Rapid brightness rise followed by a gentler, asymmetric decline',
      'Subdivided into Classical Cepheids (Pop I, massive young stars) and Type II Cepheids (Pop II, older low-mass stars like W Virginis)',
    ],
    exampleStarIds: ['delta-cephei', 'polaris', 'mekbuda', 'beta-doradus'],
    externalExamples: ['Delta Cephei (Archetype)', 'Polaris (Closest Cepheid)', 'Eta Aquilae', 'V1 in Andromeda (Hubble’s discovery)'],
  },
  {
    id: 'rr-lyrae-variables',
    name: 'RR Lyrae Variables',
    buttonTitle: 'RR Lyrae Variables',
    category: 'Horizontal Branch Pulsators',
    colorHex: '#a78bfa',
    tag: 'Halo Distance Anchors',
    periodRange: '0.2 to 1.2 days (5 to 24 hours)',
    variabilityType: 'Intrinsic (Pulsating)',
    explanation:
      'Low-mass, ancient Population II horizontal branch stars burning core helium. They pulsate with short periods of under a day and possess remarkably uniform absolute magnitudes (~ +0.6 M_v), making them invaluable standard candles for mapping the dimensions of the Milky Way halo and dating globular clusters.',
    mechanism:
      'Radial acoustic pulsations driven by the He II ionization zone within the instability strip on the horizontal branch.',
    distinguishingFeatures: [
      'Very short, clockwork periods typically between 7 and 16 hours',
      'Nearly constant average luminosity (~40–50 L☉) across the entire class',
      'Characteristic Blazhko Effect: Periodic modulation of pulsation amplitude and phase over cycles of tens to hundreds of days',
    ],
    exampleStarIds: ['rr-lyrae', 'delta-scuti', 'gamma-doradus', 'methuselah-star'],
    externalExamples: ['RR Lyrae (Archetype)', 'XZ Cygni', 'V445 Lyr', 'Globular Cluster M3 Variables'],
  },
  {
    id: 'mira-variables',
    name: 'Mira Variables (Long-Period Variables)',
    buttonTitle: 'Mira Variables',
    category: 'Pulsating Red Giants',
    colorHex: '#f97316',
    tag: 'Giant Pulsators',
    periodRange: '80 to 1,000+ days',
    variabilityType: 'Intrinsic (Pulsating)',
    explanation:
      'Enormous, cool Asymptotic Giant Branch (AGB) red giants undergoing colossal slow pulsations. Their optical brightness swings by 2.5 to over 8 magnitudes (up to a factor of 1,500 in visible brightness!) as the entire outer stellar envelope physically heaves and breathes, billowing carbon and silicate dust into surrounding space.',
    mechanism:
      'Whole-envelope acoustic pulsations combined with dramatic shifting molecular opacities (titanium oxide / TiO) and dust grain condensation at minimum temperature.',
    distinguishingFeatures: [
      'Spectacular visible brightness swings of 5 to 8+ visual magnitudes over hundreds of days',
      'Surrounded by vast expanding circumstellar dust and gas envelopes',
      'Major cosmic factories for interstellar dust grains that seed future planetary systems',
    ],
    exampleStarIds: ['mira-a', 'chi-cygni', 'r-andromedae'],
    externalExamples: ['Mira / Omicron Ceti ("The Wonderful")', 'Chi Cygni', 'R Hydrae', 'R Leonis'],
  },
  {
    id: 'semiregular-variables',
    name: 'Semiregular & Irregular Variables',
    buttonTitle: 'Semiregular Variables',
    category: 'Pulsating Giants & Supergiants',
    colorHex: '#fb7185',
    tag: 'Multi-Periodic Giants',
    periodRange: '20 to > 2,000 days (or non-periodic)',
    variabilityType: 'Intrinsic (Pulsating)',
    explanation:
      'Evolved red giants and supergiants displaying noticeable periodicity interrupted by irregularities, multiple overlapping pulsation modes, and giant convective cell overturning. Famous supergiants like Betelgeuse and Antares belong to this category.',
    mechanism:
      'Interference of fundamental and overtone radial pulsation modes, compounded by gigantic convective cells (granules the size of Earth\'s orbit) rising and cooling across the surface.',
    distinguishingFeatures: [
      'Multiple competing pulsation harmonics producing complex, quasi-periodic light curves',
      'Episodes of sudden dimming caused by dust condensation from convective mass ejections (e.g. Betelgeuse "Great Dimming" of 2019-2020)',
      'High mass-loss rates via slow, cool stellar winds',
    ],
    exampleStarIds: ['betelgeuse', 'antares', 'mu-cephei', 'scheat'],
    externalExamples: ['Betelgeuse (Alpha Orionis)', 'Antares (Alpha Scorpii)', 'Mu Cephei (Garnet Star)', 'Rasalgethi'],
  },
  {
    id: 'cataclysmic-variables',
    name: 'Cataclysmic Variables (Novae)',
    buttonTitle: 'Cataclysmic Variables',
    category: 'Explosive Binaries',
    colorHex: '#ec4899',
    tag: 'Thermonuclear Runaway',
    periodRange: 'Outbursts recur over months to millennia; orbital period hours',
    variabilityType: 'Intrinsic (Cataclysmic)',
    explanation:
      'Close binary systems consisting of a white dwarf accretor and a mass-losing secondary star. Hydrogen gas transferred via an accretion disk builds up on the degenerate white dwarf surface until crushing pressure and temperatures trigger explosive runaway thermonuclear fusion — a Classical or Recurrent Nova.',
    mechanism:
      'Degenerate hydrogen envelope at the base of the accreted layer reaches ignition temperature (~20 million K), triggering unquenched thermonuclear runaway without expansion cooling.',
    distinguishingFeatures: [
      'Blinding sudden brightness jumps of 8 to 15 magnitudes in hours, outshining normal stars by up to 100,000 times',
      'Dwarf novae (like SS Cygni) exhibit frequent milder outbursts driven by disk gravitational instabilities',
      'Does not destroy the white dwarf; mass continues to accumulate towards the Chandrasekhar limit (potential Type Ia supernova)',
    ],
    exampleStarIds: ['t-coronae-borealis', 'u-geminorum', 'v838-monocerotis'],
    externalExamples: ['T Coronae Borealis ("Blaze Star", recurrent nova)', 'SS Cygni (Dwarf Nova archetype)', 'U Geminorum', 'Nova Muscae 1991'],
  },
  {
    id: 'eruptive-variables',
    name: 'Eruptive & Flare Variables',
    buttonTitle: 'Eruptive Variables',
    category: 'Magnetic & Radiation Outbursts',
    colorHex: '#f43f5e',
    tag: 'Stellar Flares & Outbursts',
    periodRange: 'Seconds to years (unpredictable/episodic)',
    variabilityType: 'Intrinsic (Eruptive)',
    explanation:
      'Stars experiencing violent unpredictable brightenings caused by magnetic reconnection flares in their atmospheres (UV Ceti flare stars) or colossal episodic radiation pressure outbursts near the Eddington limit (Luminous Blue Variables / S Doradus stars).',
    mechanism:
      'Magnetic field line reconnections releasing 10,000x solar flare energies on cool red dwarfs, or radiation pressure overcoming gravity in hyper-luminous giants.',
    distinguishingFeatures: [
      'UV Ceti stars (flare stars) can double their optical brightness in seconds with explosive ultraviolet and X-ray radiation',
      'Luminous Blue Variables (LBVs) undergo massive mass-ejection "giant eruptions" lasting years',
      'P Cygni and Eta Carinae are legendary historical archetypes of eruptive hypergiant variability',
    ],
    exampleStarIds: ['proxima-centauri', 'eta-carinae-a', 'pistol-star', 'p-cygni'],
    externalExamples: ['Proxima Centauri (Frequent superflares)', 'UV Ceti (Luyten 726-8 B)', 'EV Lacertae', 'Eta Carinae (1843 Great Eruption)'],
  },
  {
    id: 'rotational-variables',
    name: 'Rotational Variables',
    buttonTitle: 'Rotational Variables',
    category: 'Extrinsic Starspots',
    colorHex: '#10b981',
    tag: 'Starspot Rotation',
    periodRange: 'Hours to months (synchronized with stellar rotation)',
    variabilityType: 'Extrinsic (Rotational)',
    explanation:
      'Stars whose apparent brightness modulates strictly with their rotational period because of non-uniform surface brightness — such as gigantic cool starspots, bright faculae, or chemical and magnetic patches that rotate in and out of view.',
    mechanism:
      'Deep convective dynamo magnetic fields suppress convective heat transport locally, forming gargantuan starspot clusters covering up to 40% of the photosphere.',
    distinguishingFeatures: [
      'Variability period precisely matches the star\'s axial rotation period',
      'BY Draconis stars feature giant starspots shifting across differential rotational latitudes',
      'Alpha² Canum Venaticorum stars display extreme magnetic and chemical abundance patches of silicon, chromium, and europium',
    ],
    exampleStarIds: ['cor-caroli', 'barnards-star', 'kapteyns-star'],
    externalExamples: ['BY Draconis (Archetype)', 'Alpha² Canum Venaticorum (Cor Caroli)', 'FK Comae Berenices', 'V410 Tauri'],
  },
  {
    id: 'eclipsing-binaries',
    name: 'Eclipsing Binaries (Algol Variables)',
    buttonTitle: 'Eclipsing Binaries',
    category: 'Extrinsic Eclipsing',
    colorHex: '#818cf8',
    tag: 'Demon Star Eclipses',
    periodRange: 'Hours to days (Algol: 2.867 days)',
    variabilityType: 'Extrinsic (Eclipsing)',
    explanation:
      'Binary star systems whose orbital plane aligns with our line of sight so that the stars regularly occult each other, producing clockwork periodic dips in total observed brightness. Studying their light curves yields exact stellar radii, masses, and orbital inclinations without direct spatial resolution.',
    mechanism:
      'Geometric mutual line-of-sight occultation. Deep primary minima occur when the hotter star is eclipsed by the cooler companion; shallow secondary minima occur when the hotter star eclipses the cooler companion.',
    distinguishingFeatures: [
      'Clockwork photometric light curves with steep primary and secondary minima',
      'Algol (Beta Persei) is the historical archetype, dimming from mag 2.1 to 3.4 every 2.87 days',
      'Revealed the famous "Algol Paradox" of stellar mass transfer across the L1 Lagrange point',
    ],
    exampleStarIds: ['algol-a', 'algol-b'],
    externalExamples: ['Algol A & B (Beta Persei / EA archetype)', 'Beta Lyrae (EB mass transfer)', 'W Ursae Majoris (EW contact)', 'Castor C (YY Gem)'],
  },
];

export const STAR_SYSTEMS_GUIDE: StarSystemGuideItem[] = [
  {
    id: 'visual-binaries',
    name: 'Visual Binary Systems',
    buttonTitle: 'Visual Binaries',
    category: 'Telescope-Resolved Pairs',
    colorHex: '#38bdf8',
    tag: 'Direct Optical Resolution',
    multiplicity: '2 Resolved Stars',
    explanation:
      'Binary star systems whose components have a wide enough angular separation (typically arcseconds to arcminutes) to be resolved as two distinct points of light directly through optical telescopes. By tracking their positions across decades, astronomers trace true Keplerian ellipses and directly determine stellar masses via Newton’s formulation of Kepler’s Third Law.',
    orbitalDynamics:
      'Wide semi-major axes (tens to thousands of AU) with orbital periods spanning decades to millennia (e.g. Sirius A & B = 50.1 years; Alpha Centauri AB = 79.9 years).',
    distinguishingFeatures: [
      'Direct telescopic resolution of both primary and secondary components',
      'Measured via position angle (PA, in degrees) and angular separation (ρ, in arcseconds)',
      'Classic pairs exhibit striking color contrasts due to different spectral temperatures (e.g. Albireo: golden K-giant + azure B-dwarf)',
    ],
    exampleStarIds: ['sirius-a', 'sirius-b', 'alpha-centauri-a', 'alpha-centauri-b', 'procyon-a'],
    externalExamples: ['Sirius A & B (Pup / First discovered white dwarf)', 'Alpha Centauri AB (Closest stellar system, 4.37 ly)', 'Albireo (Archetypal golden-blue optical double)', '61 Cygni (Flying Star / Bessel parallax benchmark)'],
  },
  {
    id: 'spectroscopic-binaries',
    name: 'Spectroscopic Binary Systems',
    buttonTitle: 'Spectroscopic Binaries',
    category: 'Doppler-Shift Detected Pairs',
    colorHex: '#60a5fa',
    tag: 'Radial Velocity Doppler Dips',
    multiplicity: '2 Close Stars (Unresolved)',
    explanation:
      'Binary systems orbiting so closely that no telescope can separate them visually; their dual nature is revealed solely through spectroscopy by periodic Doppler shifting of absorption lines in their composite spectra as each star alternately races towards (blueshift) and away from (redshift) Earth.',
    orbitalDynamics:
      'Compact orbits with periods ranging from fractions of a day to several months. Extreme orbital velocities reach hundreds of kilometers per second.',
    distinguishingFeatures: [
      'Double-Lined Spectroscopic Binaries (SB2): Both stars are luminous, causing absorption lines to periodically split into pairs and merge',
      'Single-Lined Spectroscopic Binaries (SB1): One star dominates the light, producing periodic sinusoidal wavelength oscillations',
      'Radial velocity curves provide direct measurement of orbital velocities, eccentricity, and minimum mass function M sin³(i)',
    ],
    exampleStarIds: ['mizar-aa', 'spica', 'capella', 'polaris'],
    externalExamples: ['Mizar A (First discovered spectroscopic binary by Pickering in 1889)', 'Spica (Alpha Virginis / Massive SB2 pair orbiting every 4.01 days)', 'Capella (Alpha Aurigae / Dual yellow giant SB2)', 'Plaskett\'s Star (One of the most massive spectroscopic binaries known)'],
  },
  {
    id: 'eclipsing-binaries',
    name: 'Eclipsing Binaries',
    buttonTitle: 'Eclipsing Binaries',
    category: 'Photometric Geometric Eclipses',
    colorHex: '#818cf8',
    tag: 'Line-of-Sight Dips',
    multiplicity: '2 Stars',
    explanation:
      'Binary systems whose orbital plane lies so close to Earth\'s line of sight that the stars regularly pass in front of each other, producing periodic dips in the total observed brightness. Analysis of their light curves allows astronomers to determine absolute stellar radii, orbital inclinations, and surface temperatures with precision.',
    orbitalDynamics:
      'Primary minimum occurs when the hotter star is eclipsed; secondary minimum occurs when the cooler star is eclipsed.',
    distinguishingFeatures: [
      'Clockwork photometric light curves with steep primary and shallower secondary dips',
      'Algol (Beta Persei) archetype: "Demon Star" dims from mag 2.1 to 3.4 every 2.87 days',
      'Allows direct calculation of true physical stellar radii without requiring interferometry',
    ],
    exampleStarIds: ['algol-a', 'algol-b'],
    externalExamples: ['Algol (Beta Persei / The Demon Star)', 'Beta Lyrae (Sheliak / Mass transfer system)', 'Castor C (YY Geminorum)', 'EE Cephei'],
  },
  {
    id: 'contact-binaries',
    name: 'Contact Binaries (Overcontact)',
    buttonTitle: 'Contact Binaries',
    category: 'Conjoined Stars',
    colorHex: '#06b6d4',
    tag: 'Shared Envelope',
    multiplicity: '2 Stars (Touching)',
    explanation:
      'Extreme binary star systems orbiting so intimately that both stars have expanded beyond their critical Roche lobes and share a common outer atmospheric envelope, transferring mass and thermal energy across a continuous plasma neck like a spinning peanut or dumbbell.',
    orbitalDynamics:
      'Rapid orbits with periods typically between 0.2 and 1.5 days; strong tidal forces distort stars into triaxial ellipsoids.',
    distinguishingFeatures: [
      'Tidal gravitational distortion stretches both stellar spheres into conjoined egg-like shapes',
      'Continuous, smooth photometric light curve variations with mutual eclipses and gravity darkening',
      'Doomed to eventually merge into a single rapid rotator/LBV or undergo a double core collapse',
    ],
    exampleStarIds: ['vfts-352'],
    externalExamples: ['VFTS 352 (Massive blue contact binary in Tarantula Nebula)', 'W Ursae Majoris (W UMa archetype)', 'KIC 9832227', 'V1309 Scorpii (Observed 2008 stellar merger)'],
  },
  {
    id: 'xray-binaries',
    name: 'X-Ray Binaries (XRBs)',
    buttonTitle: 'X-Ray Binaries',
    category: 'Relativistic Compact Accretors',
    colorHex: '#c084fc',
    tag: 'High-Energy Accretion',
    multiplicity: '2 Bodies (Star + Compact Object)',
    explanation:
      'Systems composed of a normal donor star and a compact stellar corpse — a neutron star or stellar-mass black hole. Gravitational potential energy released as matter falls from the donor onto or towards the compact object superheats to tens of millions of Kelvin, blazing fiercely in high-energy X-rays.',
    orbitalDynamics:
      'Mass transfer occurs via Roche lobe overflow or powerful focused stellar winds, swirling into an ultra-hot accretion disk with relativistic jets.',
    distinguishingFeatures: [
      'Divided into High-Mass X-Ray Binaries (HMXBs, e.g. Cygnus X-1) and Low-Mass X-Ray Binaries (LMXBs, e.g. Scorpius X-1)',
      'Cygnus X-1 was the first universally accepted stellar black hole candidate discovered in astronomy',
      'Generate relativistic plasma jets and quasi-periodic oscillations (QPOs)',
    ],
    exampleStarIds: ['hde-226868', 'vfts-352'],
    externalExamples: ['Cygnus X-1 (First confirmed stellar black hole)', 'Scorpius X-1 (Brightest X-ray source outside the Solar System)', 'V404 Cygni', 'SS 433 (Relativistic microquasar)'],
  },
  {
    id: 'multiple-star-systems',
    name: 'Multiple Star Systems (Up to Nonuple!)',
    buttonTitle: 'Multiple Star Systems',
    category: 'Hierarchical Gravitational Architectures',
    colorHex: '#e879f9',
    tag: 'Hierarchical Orbits',
    multiplicity: '3 to 9+ Bound Stars',
    explanation:
      'Gravitationally bound systems containing three or more stars. To remain dynamically stable over billions of years without chaotic ejection, multiple stars must organize into nested hierarchical sub-orbits (e.g. close binary pairs orbiting wider companion pairs). Systems range from triples up to nonuple (9-star) architectures!',
    orbitalDynamics:
      'Hierarchical nesting: Inner tight pairs treat outer components as distant point masses, satisfying Jacobi stability criteria.',
    distinguishingFeatures: [
      'Triple Systems: Alpha Centauri (AB pair + wide Proxima), Polaris (3 stars)',
      'Quadruple Systems: Mizar & Alcor (two binary pairs), Xi Ursae Majoris, Capella',
      'Sextuple Systems (6 stars): Castor (Alpha Geminorum) contains three binary pairs in a cosmic dance!',
      'Septuple Systems (7 stars): Nu Scorpii (Jabbah) and AR Cassiopeiae',
      'Octuple & Nonuple Systems (8 & 9 stars): HD 98800 (quadruple with protoplanetary disks), candidate nonuple systems like QZ Carinae complex!',
    ],
    exampleStarIds: ['castor-aa', 'alpha-centauri-a', 'polaris', 'mizar-aa'],
    externalExamples: ['Castor (Alpha Geminorum, 6 stars)', 'Nu Scorpii (7 stars)', 'AR Cassiopeiae (7 stars)', 'HD 98800 (4 stars + disk)', 'Candidate 9-star system in Carina OB1'],
  },
  {
    id: 'planet-hosting-stars',
    name: 'Planet-Hosting Stars (Exoplanetary Systems)',
    buttonTitle: 'Planet-Hosting Stars',
    category: 'Planetary Systems',
    colorHex: '#4ade80',
    tag: 'Exoplanet Architectures',
    multiplicity: '1+ Stars + Exoplanets',
    explanation:
      'Stars confirmed to host orbiting exoplanets, planetesimal belts, and debris disks. Discoveries by Kepler, TESS, and ground-based radial velocity surveys reveal that planetary systems are extraordinarily diverse: from compact resonant chains of rocky worlds to scorching Hot Jupiters orbiting closer than Mercury.',
    orbitalDynamics:
      'Planetary orbits shaped by migration through protoplanetary gas disks, mean-motion orbital resonances, and Kozai-Lidov tidal interactions.',
    distinguishingFeatures: [
      'Detected via Transit Photometry (periodic micro-dips in starlight) and Radial Velocity (Doppler stellar wobble)',
      'Host architecture extremes: TRAPPIST-1 holds 7 Earth-sized worlds; Kepler-90 holds 8 planets (tied with Solar System!)',
      'Habitable zone worlds where liquid surface water could potentially support life',
    ],
    exampleStarIds: ['sun', 'trappist-1', '51-pegasi', 'proxima-centauri', '55-cancri-a', 'tau-ceti'],
    externalExamples: ['TRAPPIST-1 (7 Earth-sized rocky planets)', '51 Pegasi (First exoplanet around Sun-like star)', 'Kepler-90 (8-planet system)', 'Proxima Centauri (Nearest exoplanet host)'],
  },
  {
    id: 'star-clusters',
    name: 'Star Clusters (Open, Globular, Superclusters)',
    buttonTitle: 'Star Clusters',
    category: 'Stellar Congregations',
    colorHex: '#fbbf24',
    tag: 'Stellar Swarms',
    multiplicity: 'Hundreds to Millions of Stars',
    explanation:
      'Groups of stars born from the same giant molecular cloud at roughly the same time with identical initial chemical compositions. Spanning young loose Open Clusters in galactic disks, ancient spherical Globular Clusters orbiting in galactic halos, and massive young Stellar Superclusters.',
    orbitalDynamics:
      'Stars orbit the collective gravitational potential of the swarm; susceptible to evaporation, tidal stripping, and core collapse.',
    distinguishingFeatures: [
      'Open Clusters: Young Pop I stars (100s to 1,000s) loosely bound in galactic spiral arms (e.g. Pleiades / Seven Sisters, Hyades)',
      'Globular Clusters: Ancient Pop II stars (100,000s to millions) tightly packed in dense spherical halos (e.g. Omega Centauri, Messier 13)',
      'Stellar Superclusters: Ultra-massive, compact starburst regions (e.g. Westerlund 1, R136 in the Tarantula Nebula) harboring hundreds of O-type and Wolf-Rayet monsters',
    ],
    exampleStarIds: ['alcyone', 'electra', 'maia', 'r136a1'],
    externalExamples: ['Pleiades / M45 (Archetypal open cluster)', 'Omega Centauri (Largest globular cluster, 10 million stars)', 'Westerlund 1 (Milky Way supercluster)', 'R136 (Tarantula Nebula supercluster)'],
  },
];

export const STELLAR_POPULATIONS_GUIDE: StellarPopulationGuideItem[] = [
  {
    id: 'pop-i-stars',
    name: 'Population I Stars',
    buttonTitle: 'Population I Stars',
    category: 'Stellar Populations',
    colorHex: '#38bdf8',
    tag: 'Metal-Rich Disk',
    metallicityRange: '[Fe/H] ≈ -0.5 to +0.5 (1% to >3% metals)',
    typicalAge: 'Under 10 billion years (Younger)',
    galacticLocation: 'Galactic thin disk and spiral arms',
    explanation:
      'Younger, metal-rich stars concentrated in the spiral arms and thin disk of galaxies. Formed from interstellar gas enriched with heavy elements synthesized and dispersed by prior generations of supernovae, making them the primary hosts of rocky planets and complex chemistry. Our Sun is an intermediate Population I star.',
    nucleosyntheticOrigin:
      'Formed from interstellar matter heavily enriched by core-collapse (Type II) and thermonuclear (Type Ia) supernovae from earlier stellar generations.',
    distinguishingFeatures: [
      'High metallicity ([Fe/H] typically between -0.5 and +0.5, containing 1% to over 3% metals by mass)',
      'Orbit in the galactic plane on orderly, near-circular paths with low velocity dispersion',
      'Associated with open star clusters, active star-forming H II nebulae, and diverse planetary systems',
    ],
    exampleStarIds: ['sun', 'sirius-a', 'vega', 'alpha-centauri-a', 'rigel', 'betelgeuse'],
    externalExamples: ['The Sun (G2V, archetype)', 'Sirius A', 'Vega', 'Alpha Centauri A'],
  },
  {
    id: 'pop-ii-stars',
    name: 'Population II Stars',
    buttonTitle: 'Population II Stars',
    category: 'Stellar Populations',
    colorHex: '#f59e0b',
    tag: 'Metal-Poor Halo',
    metallicityRange: '[Fe/H] ≈ -1.0 to -5.0+ (< 0.1% solar iron)',
    typicalAge: '10 to 13.5+ billion years (Ancient)',
    galacticLocation: 'Galactic halo, central bulge, globular clusters',
    explanation:
      'Ancient, metal-poor stars born during the early developmental epochs of galaxies before extensive interstellar enrichment took place. Found predominantly in the galactic halo, the central bulge, and ancient globular clusters, traveling on steep, eccentric orbits with high velocity dispersions.',
    nucleosyntheticOrigin:
      'Enriched predominantly by rapid core-collapse supernovae of the first generation of massive stars, exhibiting elevated alpha-element ratios ([alpha/Fe] > 0).',
    distinguishingFeatures: [
      'Low metallicity ([Fe/H] typically between -1.0 and -5.0+; less than 0.1% the metal abundance of the Sun)',
      'Extreme ages from 10 to over 13.5 billion years, preserving pristine chemical fingerprints of early cosmic history',
      'Orbital velocities are eccentric and decoupled from the galactic disk plane, plunging through the halo',
    ],
    exampleStarIds: ['methuselah-star', 'kapteyns-star', 'arcturus', 'barnards-star'],
    externalExamples: [
      'BPS CS 22892-052 (Sneden\'s Star, ultra metal-poor [Fe/H] = -3.1)',
      'SMSS J031300.36-670839.3 ([Fe/H] < -7.1, lowest known iron abundance)',
      'SDSS J102915+172927 (Caffau\'s Star, ancient halo dwarf)',
    ],
  },
  {
    id: 'pop-iii-stars',
    name: 'Population III Stars',
    buttonTitle: 'Population III Stars',
    category: 'Stellar Populations',
    colorHex: '#c084fc',
    tag: 'Zero-Metal Primordial',
    metallicityRange: 'Z = 0, [Fe/H] = -infinity (Pristine Big Bang gas)',
    typicalAge: 'Cosmic Dawn (z ~ 10–30, ~13.6 billion years ago)',
    galacticLocation: 'High-redshift protogalactic halos',
    explanation:
      'The hypothetical first generation of stars formed at Cosmic Dawn (z ~ 10–30) out of pristine Big Bang gas (75% hydrogen, 25% helium, trace lithium) with zero initial metallicity (Z = 0). Without metals for radiative cooling, gravitational collapse required massive clouds, yielding short-lived titans of 100 to 1,000+ solar masses.',
    nucleosyntheticOrigin:
      'Synthesized the first heavy elements in cosmic history, triggering the Epoch of Reionization and seeding all subsequent generations with carbon, oxygen, and iron.',
    distinguishingFeatures: [
      'Zero initial heavy elements (Z = 0, [Fe/H] = -∞), relying purely on H and He for atomic cooling',
      'Tremendous masses (100 to 1,000+ M☉) producing ferocious ionizing ultraviolet luminosity',
      'Ultra-brief lifespans (1 to 3 million years) ending in Pair-Instability Supernovae (PISN) or direct black hole collapse',
    ],
    exampleStarIds: ['methuselah-star'],
    externalExamples: [
      'Cosmic Dawn First Stars (Hypothetical Z=0 Population)',
      'CR7 (COSMOS Redshift 7, z ≈ 6.6 with candidate Pop III signature)',
      'GN-z11 (Distant z ≈ 10.6 galaxy with candidate Pop III He II signatures)',
      'Pair-Instability Supernova Progenitors (140–260 M☉ primordial titans)',
    ],
  },
];

export const STELLAR_REMNANTS_GUIDE: StellarRemnantGuideItem[] = [
  {
    id: 'white-dwarfs',
    code: 'WD (DA/DB/DZ/DQ)',
    abbreviation: 'WD',
    name: 'White Dwarfs',
    buttonTitle: 'White Dwarfs',
    mobileTitle: 'White Dwarf',
    category: 'Electron-Degenerate Relics',
    tag: 'Quantum Electron Lattice',
    colorHex: '#e0f2fe',
    density: '~10⁶ g/cm³ (1 tsp ≈ 5.5 tons)',
    typicalMass: '0.5 to 1.44 M☉ (Chandrasekhar Limit)',
    typicalDiameter: '~7,000 to 12,000 km (Earth-sized)',
    quantumSupportOrHorizon: 'Electron Degeneracy Pressure (Pauli Exclusion)',
    temperature: '4,000 to 150,000+ K (Cooling)',
    explanation:
      'The super-dense Earth-sized crystal carbon-oxygen core left behind when a low-to-intermediate-mass star like our Sun sheds its outer layers as a planetary nebula. No active nuclear fusion occurs; it is held up against gravitational collapse purely by quantum Electron Degeneracy Pressure.',
    formationMechanism:
      'Asymptotic Giant Branch (AGB) envelope ejection via planetary nebula, leaving behind the inert degenerate C-O or O-Ne core.',
    distinguishingFeatures: [
      'Packs roughly 0.6 to 1.4 solar masses into an Earth-sized volume with colossal surface gravity (log g ≈ 8.0, 100,000× Earth gravity)',
      'Spectral subtypes: DA (hydrogen atmosphere), DB (neutral helium), DO (hot ionized helium), DZ (metal-polluted by shredded asteroids), DQ (carbon-enriched)',
      'Cooling timescales exceed hundreds of trillions of years before eventually fading into cold hypothetical Black Dwarfs',
      'Can detonate in catastrophic Type Ia thermonuclear supernovae upon accreting mass past the 1.44 M☉ Chandrasekhar limit',
    ],
    exampleStarIds: ['sirius-b', 'procyon-b', 'van-maanens-star', '40-eridani-b', 'bpm-37093', 'stein-2051-b', 'lp-40-365'],
    externalExamples: ['Sirius B (First discovered white dwarf, DA2)', 'Procyon B', 'Van Maanen’s Star (DZ metal-polluted archetype)', 'BPM 37093 ("Lucy" crystallized diamond core)'],
  },
  {
    id: 'radio-quiet-neutron-stars',
    code: 'RQNS / INS / CCO',
    abbreviation: 'RQNS',
    name: 'Radio-Quiet Neutron Stars',
    buttonTitle: 'Radio-Quiet Neutron Stars',
    mobileTitle: 'Radio-Quiet NS',
    category: 'Thermal Relic Neutron Stars',
    tag: 'Million-Degree Thermal Emitter',
    colorHex: '#38bdf8',
    density: '~10¹⁴ g/cm³ (1 tsp ≈ 1 billion tons)',
    typicalMass: '1.2 to 2.1 M☉',
    typicalDiameter: '~18 to 25 km (City-sized)',
    quantumSupportOrHorizon: 'Neutron Degeneracy & Strong Nuclear Repulsion',
    temperature: '500,000 to 3,000,000 K (Thermal Soft X-rays)',
    explanation:
      'Isolated neutron stars and Central Compact Objects (CCOs) that lack active radio pulsation beams, glowing purely through their scorching million-degree surface thermal X-ray emission. Archetypes include "The Magnificent Seven" (isolated thermal neutron stars within 1,500 light-years) and young remnants in supernova cores.',
    formationMechanism:
      'Core-collapse supernova (Type II/Ib/Ic) where magnetic dipole alignment, low rotational spin-down energy, or beamed radio geometry produces zero detectable radio pulses at Earth.',
    distinguishingFeatures: [
      'Packs ~1.4 Suns into a 20 km city-sized sphere with a pure blackbody thermal spectrum peaking in soft X-rays',
      'Extremely weak or sub-critical radio luminosity, with no detectable non-thermal synchrotron radio emission',
      'Includes The Magnificent Seven (such as RX J1856.3-3754 and Calvera) and Central Compact Objects in supernova remnants (Vela Jr, Cas A)',
      'Strong gravitational light-bending: extreme spacetime curvature allows observers to see more than 60% of the star’s surface at once',
    ],
    exampleStarIds: ['rx-j1856-3754', 'calvera', 'rx-j0720-3125', 'rx-j0806-4123', 'rx-j1308-2127', 'rx-j1605-3249', 'rx-j0420-5022'],
    externalExamples: ['RX J1856.3-3754 (Brightest of The Magnificent Seven, ~400 ly)', 'Calvera (Ursa Minor isolated NS)', '1E 1207.4-5209 (PKS 1209 CCO)', 'Cas A Central Compact Object'],
  },
  {
    id: 'radio-pulsars',
    code: 'PSR (Rotation-Powered)',
    abbreviation: 'PSR',
    name: 'Radio Pulsars',
    buttonTitle: 'Radio Pulsars',
    mobileTitle: 'Radio Pulsar',
    category: 'Relativistic Beaming Relics',
    tag: 'Cosmic Lighthouse Beacons',
    colorHex: '#a855f7',
    density: '~10¹⁴ g/cm³',
    typicalMass: '1.25 to 2.0 M☉',
    typicalDiameter: '~20 to 24 km',
    quantumSupportOrHorizon: 'Neutron Degeneracy Pressure',
    temperature: '1,000,000 to 4,000,000 K',
    explanation:
      'Rapidly spinning, highly magnetized neutron stars whose magnetic poles are tilted with respect to their rotational axis. Relativistic electrons accelerate along magnetic field lines, blasting focused synchrotron radiation beam cones into space that sweep across our line of sight with atomic-clock precision.',
    formationMechanism:
      'Conservation of angular momentum and magnetic flux compression during the catastrophic core-collapse supernova of a massive star (8–20 M☉).',
    distinguishingFeatures: [
      'Rotational periods ranging from milliseconds to several seconds with regular ticking precision rivaling atomic clocks',
      'Relativistic beaming: Synchrotron radiation emitted along dipolar open field lines creates distinct periodic pulse spikes',
      'Power energetic Pulsar Wind Nebulae (PWN), like the Crab Nebula illuminated by the central Crab Pulsar',
      'Gradually lose rotational kinetic energy via magnetic dipole braking (spin-down luminosity)',
    ],
    exampleStarIds: ['crab-pulsar', 'vela-pulsar', 'psr-b0950-08', 'psr-b0656-14', 'psr-b1055-52', 'hulse-taylor-pulsar'],
    externalExamples: ['Crab Pulsar (PSR B0531+21, 33 ms period in Crab Nebula)', 'Vela Pulsar (PSR B0833-45)', 'PSR B1919+21 (First pulsar discovered by Jocelyn Bell Burnell in 1967)', 'Hulse-Taylor Binary Pulsar (PSR B1913+16, Nobel Prize 1993)'],
  },
  {
    id: 'millisecond-pulsars',
    code: 'MSP (Recycled / Spider)',
    abbreviation: 'MSP',
    name: 'Millisecond & Spider Pulsars',
    buttonTitle: 'Millisecond Pulsars',
    mobileTitle: 'Millisecond Pulsar',
    category: 'Spun-Up Binary Relics',
    tag: 'Sub-Millisecond RPM',
    colorHex: '#ec4899',
    density: '~10¹⁴ to 10¹⁵ g/cm³',
    typicalMass: '1.4 to 2.35 M☉ (Massive compact cores)',
    typicalDiameter: '~20 to 22 km',
    quantumSupportOrHorizon: 'Neutron Degeneracy & Repulsive Strong Force',
    temperature: '1,000,000 to 5,000,000 K',
    explanation:
      'Old, dead pulsars resurrected and "recycled" into ultra-fast spins (up to 716 rotations per second!) by siphoning matter and angular momentum from a binary companion star. Extreme subclasses include "Black Widows" and "Redbacks" (Spider Pulsars), whose high-energy particle winds actively blast and vaporize their donor stars.',
    formationMechanism:
      'Long-term accretion spin-up in Low-Mass X-ray Binaries (LMXBs) transferring angular momentum over hundreds of millions of years.',
    distinguishingFeatures: [
      'Incredible spin rates: PSR J1748-2446ad spins 716 times per second (equator traveling at 24% the speed of light!)',
      'Spider Pulsars: Black Widows evaporate low-mass brown dwarf companions (< 0.05 M☉); Redbacks consume heavier degenerate subgiants (~0.2–0.4 M☉)',
      'Can retain planets: Lich (PSR B1257+12) hosted the first confirmed extrasolar planets in human history (1992)',
      'Extremely stable long-term rotation used by Pulsar Timing Arrays (PTAs) to detect cosmological gravitational waves',
    ],
    exampleStarIds: ['black-widow-pulsar', 'redback-pulsar', 'lich-pulsar', 'double-pulsar-a', 'double-pulsar-b'],
    externalExamples: ['PSR J1748-2446ad (Fastest spinning known neutron star, 716 Hz)', 'Black Widow Pulsar (PSR B1957+20)', 'Lich (PSR B1257+12, first exoplanets)', 'PSR J0737-3039 (First known double pulsar system)'],
  },
  {
    id: 'magnetars',
    code: 'SGR / AXP',
    abbreviation: 'SGR',
    name: 'Magnetars',
    buttonTitle: 'Magnetars',
    mobileTitle: 'Magnetar',
    category: 'Ultra-Magnetic Relics',
    tag: '10¹⁵ Gauss Magnetic Field',
    colorHex: '#f43f5e',
    density: '~10¹⁴ g/cm³',
    typicalMass: '1.3 to 2.2 M☉',
    typicalDiameter: '~20 to 22 km',
    quantumSupportOrHorizon: 'Neutron Degeneracy Pressure',
    temperature: '5,000,000 to 15,000,000 K (Hot spots & flares)',
    explanation:
      'The most intensely magnetic objects known in the universe, packing magnetic field strengths of 10¹⁴ to 10¹⁵ Gauss (100 trillion times Earth’s magnetic field). The magnetic energy density exceeds nuclear matter bonds; magnetic stress fractures the solid neutron crust in colossal "Starquakes", triggering blinding Soft Gamma Repeater (SGR) flares and Fast Radio Bursts (FRBs).',
    formationMechanism:
      'Formed via convective helical dynamo amplification in rapidly rotating proto-neutron stars born from ultra-massive, highly magnetic progenitor stars.',
    distinguishingFeatures: [
      'Magnetic field (10¹⁵ G) is so intense that quantum vacuum birefringence occurs, warping atom shapes into needle cylinders',
      'Starquakes: Crust ruptures release giant gamma-ray flares; on Dec 27 2004, SGR 1806-20 released more energy in 0.1s than our Sun emits in 150,000 years!',
      'Direct engine of Galactic Fast Radio Bursts (FRBs), as proven by SGR 1935+2154 in 2020',
      'Decelerate rapidly through ferocious magnetic braking, exhausting magnetic reservoirs within ~10,000 years',
    ],
    exampleStarIds: ['sgr-1935-2154', 'swift-j1818-1607', 'magnetar-1e-2259', 'magnetar-1e-1048'],
    externalExamples: ['SGR 1935+2154 (First confirmed Galactic FRB emitter)', 'SGR 1806-20 (Historic 2004 giant gamma flare)', '1E 2259+586 (Anomalous X-ray Pulsar in CTB 109)', 'Swift J1818.0-1607 (Youngest known magnetar, ~240 years old)'],
  },
  {
    id: 'accreting-neutron-stars',
    code: 'LMXB / HMXB',
    abbreviation: 'X-NS',
    name: 'Accreting Neutron Stars & X-Ray Binaries',
    buttonTitle: 'Accreting Neutron Stars',
    mobileTitle: 'Accreting NS',
    category: 'Relativistic Binary Relics',
    tag: 'Thermonuclear Surface Bursts',
    colorHex: '#06b6d4',
    density: '~10¹⁴ g/cm³',
    typicalMass: '1.4 to 2.1 M☉',
    typicalDiameter: '~20 to 24 km',
    quantumSupportOrHorizon: 'Neutron Degeneracy Pressure',
    temperature: '10,000,000 to 30,000,000 K (Inner disk)',
    explanation:
      'Neutron stars locked in tight binary orbits with companion donor stars, siphoning hydrogen and helium gas across the inner Lagrangian point. The in-falling matter crashes into the neutron star surface at over 100,000 km/s, producing continuous intense X-rays and runaway thermonuclear explosions (Type I X-ray Bursts).',
    formationMechanism:
      'Supernova in a close binary system that survives the kick, followed by companion star expansion (Roche-lobe overflow or stellar wind capture).',
    distinguishingFeatures: [
      'Scorpius X-1: The brightest persistent extrasolar X-ray source in the sky, emitting thousands of times more energy in X-rays than the Sun does across all wavelengths',
      'Type I X-ray Bursts: Runaway helium flashes detonating across the entire neutron star surface in seconds',
      'Relativistic accretion disks reaching millions of degrees with collimated radio plasma jets',
    ],
    exampleStarIds: ['scorpius-x-1-ns'],
    externalExamples: ['Scorpius X-1 (Prototype LMXB, discovered 1962)', 'Centaurus X-3 (First discovered X-ray pulsar)', 'Hercules X-1', 'Cygnus X-2'],
  },
  {
    id: 'stellar-black-holes',
    code: 'SBH (Singularity)',
    abbreviation: 'SBH',
    name: 'Stellar-Mass Black Holes',
    buttonTitle: 'Stellar Black Holes',
    mobileTitle: 'Stellar Black Hole',
    category: 'Spacetime Gravitational Singularities',
    tag: 'Event Horizon & ISCO',
    colorHex: '#6366f1',
    density: 'Singularity (Infinite central density)',
    typicalMass: '3 to 100+ M☉ (Tolman-Oppenheimer-Volkoff limit surpassed)',
    typicalDiameter: 'Schwarzschild Radius: r_s = 2GM/c² (~18 to 300 km shadow)',
    quantumSupportOrHorizon: 'Schwarzschild / Kerr Event Horizon (No outward force can balance gravity)',
    temperature: '< 10⁻⁷ K (Hawking temp); Accretion disk > 10,000,000 K',
    explanation:
      'The ultimate stellar gravitational relics formed when stars with initial masses exceeding ~20–25 M☉ exhaust all fuel and collapse past the Tolman-Oppenheimer-Volkoff neutron limit. Gravity overwhelms all quantum degenerate forces, collapsing the core to an infinitesimal gravitational singularity enclosed by an inescapable Event Horizon from which not even light can escape.',
    formationMechanism:
      'Core collapse of an ultra-massive star (Type Ib/c supernova, collapsar, or direct "unnovae" collapse without explosion).',
    distinguishingFeatures: [
      'Event Horizon: One-way causal membrane where escape velocity equals the speed of light c',
      'Innermost Stable Circular Orbit (ISCO) and glowing relativistic photon ring wrapping warped images of space',
      'Doppler beaming: Relativistic blueshift makes the side of the accretion disk rotating toward the observer dramatically brighter',
      'Iconic systems: Cygnus X-1 (21.2 M☉, the first confirmed black hole) and Gaia BH1 (9.6 M☉, the closest known black hole at 1,560 ly)',
    ],
    exampleStarIds: [],
    externalExamples: ['Cygnus X-1 (Historic first confirmed black hole, 21.2 M☉)', 'Gaia BH1 (Closest known black hole, 1,560 ly)', 'V404 Cygni (Active microquasar)', 'GRO J1655-40 (High-spin microquasar)'],
  },
  {
    id: 'supermassive-black-holes',
    code: 'SMBH (Galactic Cores)',
    abbreviation: 'SMBH',
    name: 'Supermassive Black Holes',
    buttonTitle: 'Supermassive Black Holes',
    mobileTitle: 'Supermassive BH',
    category: 'Galactic Core Singularities',
    tag: 'Millions to Billions of Solar Masses',
    colorHex: '#f59e0b',
    density: 'Singularity (Mean horizon density lower than water)',
    typicalMass: '100,000 to over 60 Billion M☉',
    typicalDiameter: 'Tens of millions to billions of kilometers (Size of planetary systems)',
    quantumSupportOrHorizon: 'Kerr Metric Event Horizon & Ergosphere',
    temperature: '< 10⁻¹⁴ K Hawking; Relativistic corona > 100,000,000 K',
    explanation:
      'Monstrous black holes residing at the gravitational hearts of almost all massive galaxies. When actively feeding on gas and disrupted stars, they power Active Galactic Nuclei (AGN), blazars, and quasars that outshine entire galaxies. Sagittarius A* anchors the dynamical center of our Milky Way with 4.15 million solar masses.',
    formationMechanism:
      'Direct collapse of primordial supermassive gas clouds at Cosmic Dawn, merged stellar-mass seed black holes, and runaway accretion in dense galactic cores.',
    distinguishingFeatures: [
      'Sagittarius A*: 4.15 million M☉ singularity directly imaged by the Event Horizon Telescope in 2022',
      'Ergosphere and frame-dragging: Rotational dragging of spacetime enables Penrose process energy extraction',
      'Relativistic plasma jets launched across millions of light-years at 0.999c, terminating in radio lobes',
      'Orbital resonance: Fast-moving S-stars orbit Sgr A* at up to 8% the speed of light with pronounced relativistic precession',
    ],
    exampleStarIds: [],
    externalExamples: ['Sagittarius A* (Milky Way core, 4.15 million M☉)', 'M87* (First black hole ever imaged by EHT, 6.5 billion M☉)', 'TON 618 (66 billion M☉ ultramassive black hole)', 'Centaurus A Core Singularity'],
  },
];

export const HYPOTHETICAL_STARS_GUIDE: HypotheticalStarGuideItem[] = [
  {
    id: 'blue-dwarfs',
    name: 'Blue Dwarfs',
    buttonTitle: 'Blue Dwarfs',
    category: 'Far-Future Stellar Evolution',
    colorHex: '#38bdf8',
    tag: 'Future Red Dwarf Phase',
    theoreticalEra: 'Trillions of years in the future (> 10¹² years)',
    energySource: 'Exhaustive convective core/envelope hydrogen fusion',
    explanation:
      'A predicted future class of star that develops from low-mass red dwarfs (mass < 0.25 M☉) after hundreds of billions to trillions of years. Because red dwarfs are fully convective, they slowly circulate and consume nearly 100% of their hydrogen fuel. As hydrogen is consumed, the mean molecular weight increases, causing the star to contract, heat up, and turn bright blue without ever swelling into a red giant.',
    physicsMechanism:
      'Full convection prevents a core-envelope separation. Radiative opacity decreases as hydrogen depletes, driving surface temperature above 6,000–8,000 K while diameter shrinks, evolving directly into a degenerate helium white dwarf.',
    distinguishingFeatures: [
      'None currently exist: the universe is only 13.8 billion years old, while red dwarfs require 1 to 10+ trillion years to reach this stage',
      'Much higher surface temperature than ancestral red dwarfs, shining with distinct pale-blue light',
      'Ends directly as a low-mass Helium White Dwarf without an intervening planetary nebula or red giant phase',
    ],
    exampleStarIds: ['proxima-centauri', 'barnards-star', 'trappist-1'],
    externalExamples: ['Future Proxima Centauri (~4 trillion years from now)', 'Future Barnard’s Star', 'Future TRAPPIST-1'],
  },
  {
    id: 'black-dwarfs',
    name: 'Black Dwarfs',
    buttonTitle: 'Black Dwarfs',
    category: 'Ultimate Cosmic Degenerate Relics',
    colorHex: '#64748b',
    tag: 'Cold Degenerate Embers',
    theoreticalEra: '10¹⁵ to 10¹⁶+ years from now (Far Degenerate Era)',
    energySource: 'Zero active fusion or heat generation (thermal equilibrium with CMB)',
    explanation:
      'The theoretical final state of a white dwarf after it has radiated away all of its residual thermal energy and cooled down to near absolute zero, matching the cosmic microwave background temperature. A cold, dark crystal ball composed of electron-degenerate carbon, oxygen, or neon.',
    physicsMechanism:
      'White dwarfs have high thermal conductivity but opaque outer crusts. The cooling timescale to drop below 5 K exceeds 10¹⁵ years — over 100,000 times the current age of our universe!',
    distinguishingFeatures: [
      'Completely non-luminous: emits zero visible light, detectable only by its immense gravitational pull',
      'Solid crystalline lattice: interior carbon forms colossal quantum diamond structures',
      'Will persist undisturbed until either proton decay dissolves them (10³⁴–10⁴⁰ years) or quantum tunneling turns them into Iron Stars (10¹⁵⁰⁰ years)',
    ],
    exampleStarIds: ['sirius-b', 'procyon-b', 'van-maanens-star'],
    externalExamples: ['Future Sirius B (~10¹⁵ years)', 'Future Procyon B', 'Future Solar Remnant (~10¹⁵ years)'],
  },
  {
    id: 'strange-stars',
    name: 'Strange Quark Stars',
    buttonTitle: 'Strange Stars',
    category: 'De-confined Quark Matter',
    colorHex: '#d946ef',
    tag: 'Bodmer-Witten Hypothesis',
    theoreticalEra: 'Extreme Ultra-Dense Relativistic Regimes',
    energySource: 'Strong nuclear binding of de-confined u, d, s strange quarks',
    explanation:
      'Hypothetical ultra-dense compact stars composed of strange quark matter—a roughly equal liquid mixture of up, down, and strange quarks. Based on the Bodmer-Witten hypothesis that strange matter is the true, absolute ground state of baryonic matter at zero pressure. Bound by the strong nuclear force rather than gravity alone, strange stars can spin at extreme sub-millisecond rates (> 2,000 Hz) without shedding mass.',
    physicsMechanism:
      'Under extreme compression (> 10¹⁵ g/cm³), nucleons dissolve into free quarks. Strange quarks lower the Fermi energy of the system, creating a self-bound stable liquid held together by strong color forces, separated from an external nuclear crust by a mammoth electrostatic dipole gap.',
    distinguishingFeatures: [
      'Self-Bound by Strong Force: Unlike neutron stars, strange stars are bound by the strong interaction; small fragments (strangelets) can remain stable outside the star',
      'Mammoth Electrostatic Gap: An ultra-high electric field (~10¹⁸ V/cm) at the boundary separates the quark core from a thin degenerate nuclear crust',
      'Ultra-Fast Sub-Millisecond Rotation: Capable of spinning beyond the centrifugal breakup frequency of conventional neutron stars (> 2,000 Hz)',
      'Sharp Surface Density: Density jumps discontinuously from zero to nuclear saturation density (4 × 10¹⁴ g/cm³) within a few femtometers',
    ],
    exampleStarIds: ['crab-pulsar', 'vela-pulsar', 'lich-pulsar'],
    externalExamples: ['Candidate Strange Quark Star: RX J1856.5-3754', 'Quark Star Candidate: 3C 58', 'X-Ray Burster Candidate: SAX J1808.4-3658'],
  },
  {
    id: 'electroweak-stars',
    name: 'Electroweak Stars',
    buttonTitle: 'Electroweak Stars',
    category: 'Electroweak Symmetry Phase',
    colorHex: '#38bdf8',
    tag: 'Quark-to-Lepton Sphaleron Burning',
    theoreticalEra: 'Late Core-Collapse Transition (~10⁷ year stability)',
    energySource: 'Electroweak sphaleron-induced conversion of quarks into leptons',
    explanation:
      'Hypothetical compact stars conceived by Glenn Starkman, De-Chang Dai, and Dejan Stojkovic (2009). When a collapsing stellar core exceeds neutron degeneracy pressure, collapse can be halted at the electroweak symmetry breaking scale before an event horizon forms. In an apple-sized core at densities of 10²⁹ g/cm³, quarks burn into leptons via the electroweak anomaly, releasing a colossal torrent of neutrinos whose radiation pressure supports the entire star for over 10 million years.',
    physicsMechanism:
      'At temperatures T ~ 10¹⁵ K and densities reaching electroweak unification scales, non-perturbative sphaleron transitions violate baryon and lepton numbers (B + L anomaly), converting quarks into neutrinos and positrons at astronomical rates.',
    distinguishingFeatures: [
      'Apple-Sized Electroweak Engine: Core energy generation occurs in a microscopic central volume roughly the size of an apple (radius ~ 10 cm, mass ~ 2 M☉)',
      'Neutrino-Dominated Luminosity: Emits a torrential neutrino wind equaling the luminosity of an entire galaxy, with minimal electromagnetic radiation',
      'Stellar Lifespan of 10 Million Years: Sufficient fuel to pause gravitational collapse to a black hole for roughly 10⁷ years',
      'Extreme Core Density: Central core density reaches 10²⁹ g/cm³—surpassing neutron star core density by more than 14 orders of magnitude',
    ],
    exampleStarIds: ['sgr-1806-20', 'psr-j1748-2446ad'],
    externalExamples: ['Starkman-Dai-Stojkovic Electroweak Core Model (2009)', 'Pre-Black Hole Electroweak Stage Candidate'],
  },
  {
    id: 'boson-stars',
    name: 'Boson Stars',
    buttonTitle: 'Boson Stars',
    category: 'Transparent Scalar Condensate',
    colorHex: '#10b981',
    tag: 'Non-Baryonic Scalar Soliton',
    theoreticalEra: 'Primordial Halos & Supermassive Core Candidates',
    energySource: 'Zero nuclear fusion; self-gravitating quantum Bose-Einstein ground state',
    explanation:
      'Hypothetical stable astronomical bodies formed of fundamental scalar bosons (such as axions or complex spin-0 particles) bound together by their own gravitational field (Kaup 1968; Ruffini & Bonazzola 1969). Because bosons do not obey the Pauli exclusion principle, they collapse into a single macroscopic quantum wave packet—a macroscopic Bose-Einstein condensate and gravitational soliton. Completely transparent to electromagnetic light, they bend background starlight through gravitational lensing.',
    physicsMechanism:
      'Described by the coupled Einstein-Klein-Gordon equations. The balance between gravitational attraction and Heisenberg uncertainty principle (or scalar self-interaction λ|φ|⁴) supports the star against collapse.',
    distinguishingFeatures: [
      'Completely Transparent to Light: Emits no radiation and absorbs no photons; visible only through gravitational lensing and gravitational wave signatures',
      'Macroscopic Quantum Wavefunction: The entire celestial body behaves as a single coherent quantum state with phase oscillations e^(-iωt)',
      'Black Hole Mimickers: Can reach compactness close to the Schwarzschild limit (M/R ~ 0.2), producing shadow and lensing rings resembling black holes without horizons',
      'Leading Dark Matter Candidate: Self-interacting or fuzzy ultralight boson stars are prime candidates for dark matter galactic core halos',
    ],
    exampleStarIds: ['stephenson-2-18', 'uy-scuti'],
    externalExamples: ['Galactic Center Boson Soliton Model (Sgr A* Mimicker)', 'Ultralight Axion Boson Star Model', 'LIGO Waveform Echo Benchmark'],
  },
  {
    id: 'dark-stars',
    name: 'Dark Stars',
    buttonTitle: 'Dark Stars',
    category: 'Primordial Dark Matter-Powered',
    colorHex: '#6366f1',
    tag: 'Dark Matter Annihilation',
    theoreticalEra: 'Cosmic Dawn (z ~ 10–20, 200–400 million years post-Big Bang)',
    energySource: 'Dark matter neutralino / WIMP self-annihilation heating',
    explanation:
      'Hypothetical massive stars that may have existed in the very early universe before conventional Pop III fusion stars formed. Composed almost entirely of normal hydrogen and helium, but powered internally by the annihilation of weakly interacting massive particles (WIMPs) of dark matter, preventing gravitational collapse to fusion temperatures.',
    physicsMechanism:
      'Dark matter annihilation produces gamma rays, electrons, and positrons that thermalize in the gas cloud, providing outward pressure that halts collapse at gargantuan radii of 1 to 10+ Astronomical Units!',
    distinguishingFeatures: [
      'Enormous physical sizes: 1 to 10 AU in radius (size of Jupiter’s or Saturn’s orbit!), yet cool surfaces (~4,000 to 10,000 K)',
      'Luminosities reaching 1 million to 1 billion solar luminosities, shining as luminous cool diffuse giants',
      'Candidate detections identified by the James Webb Space Telescope (JWST) at redshifts z > 10 (JADES-GS-z13-0, z12-0, z11-0)',
    ],
    exampleStarIds: ['stephenson-2-18', 'uy-scuti', 'vy-canis-majoris'],
    externalExamples: ['JWST Candidate Dark Star: JADES-GS-z13-0', 'JWST Candidate: JADES-GS-z12-0', 'JWST Candidate: JADES-GS-z11-0'],
  },
  {
    id: 'quasi-stars',
    name: 'Quasi-Stars (Black Hole Cores)',
    buttonTitle: 'Quasi-Stars',
    category: 'Primordial Black Hole-Core Titans',
    colorHex: '#e11d48',
    tag: 'Living Around a Singularity',
    theoreticalEra: 'Early Universe (z ~ 15–20)',
    energySource: 'Core stellar black hole accretion radiating against surrounding envelope',
    explanation:
      'Hypothetical gargantuan primordial stars formed when a massive protostellar cloud (over 1,000 M☉) collapses so rapidly that its core directly forms a black hole without a supernova explosion, while the vast surrounding envelope continues to fall inward. Radiation from the central black hole accretion balances gravity, keeping the outer star shining for millions of years.',
    physicsMechanism:
      'Core black hole feeds at super-Eddington rates; outward radiation pressure balances the immense surrounding envelope of thousands of solar masses.',
    distinguishingFeatures: [
      'Radii over 10 billion kilometers (~70 AU, extending beyond Neptune and Pluto!)',
      'Luminosity rivals small galaxies (millions to billions of solar luminosities)',
      'Leading theoretical candidate for the seed progenitors that rapidly grew into the mysterious supermassive black holes observed at high redshifts',
    ],
    exampleStarIds: ['hde-226868', 'r136a1', 'eta-carinae-a'],
    externalExamples: ['High-redshift Supermassive Black Hole Seed Progenitors', 'Direct-Collapse Black Hole (DCBH) candidate in CR7'],
  },
  {
    id: 'frozen-stars',
    name: 'Frozen Stars (Ice-Atmosphere Dwarfs)',
    buttonTitle: 'Frozen Stars',
    category: 'Far Future High-Metallicity Dwarfs',
    colorHex: '#38bdf8',
    tag: 'Sub-Zero Atmosphere (0°C / 273 K)',
    theoreticalEra: '10¹⁴ to 10¹⁵ years from now (Far Stelliferous / Degenerate Era)',
    energySource: 'Low-temperature core proton-proton fusion catalyzed by extreme metallicity',
    explanation:
      'Hypothetical sub-stellar mass stars predicted by astrophysicists Fred Adams and Gregory Laughlin (1997) that could form in the far future when the interstellar medium is enriched to extreme metallicities (hundreds of times solar). High molecular opacity and heavy elements lower the hydrogen-burning mass limit down to ~0.04 M☉ (the mass of current brown dwarfs). With a nuclear furnace operating at barely 10⁵ K, their surface temperature plummets to 0°C (273 K / 32°F)—cold enough for water ice clouds to condense in their atmospheres!',
    physicsMechanism:
      'Extreme heavy-element enrichment increases atmospheric opacity and nuclear cross-sections, allowing stable p-p fusion in sub-brown-dwarf masses (0.04–0.08 M☉) at core temperatures an order of magnitude cooler than today’s stars.',
    distinguishingFeatures: [
      'Freezing Surface Temperatures: Effective temperature around 273 K (0°C / 32°F), causing water clouds to freeze into ice clouds and crystalline frost in the outer photosphere',
      'Sub-Brown Dwarf Fusion Limit: Heavy metallicity lowers the minimum stellar mass for hydrogen fusion from 0.075–0.08 M☉ down to roughly 0.04 M☉',
      'Extreme Lifespans: Due to their extraordinarily sluggish fusion rates, frozen stars will burn for tens to hundreds of trillions of years, outlasting all conventional stars',
      'Infrared-Only Emission: Emits virtually no visible light, shining almost exclusively in mid- and far-infrared radiation with micro-solar luminosities (L ~ 10⁻⁶ L☉)',
    ],
    exampleStarIds: ['trappist-1', 'teegardens-star', 'luhman-16-a'],
    externalExamples: ['Adams & Laughlin Theoretical Frozen Star Model (1997)', 'Future High-Metallicity Collapsed Core (~10¹⁴ years)', 'Extreme Far-Future Brown Dwarf Analog'],
  },
  {
    id: 'gravastars',
    name: 'Gravastars (Vacuum Condensate)',
    buttonTitle: 'Gravastars',
    category: 'Quantum Black Hole Alternative',
    colorHex: '#0ea5e9',
    tag: 'No Singularity No Horizon',
    theoreticalEra: 'Relativistic Compact Regimes',
    energySource: 'Interior de Sitter dark energy vacuum repulsive pressure',
    explanation:
      'Gravitational Vacuum Condensate Stars — a proposed quantum-gravitational alternative to classical black holes conceived by Pawel Mazur and Emil Mottola (2001). Rather than collapsing into an infinite-density singularity surrounded by an event horizon, quantum vacuum phase transitions halt collapse, creating a core of de Sitter dark energy surrounded by an ultra-thin shell of ultra-dense relativistic matter.',
    physicsMechanism:
      'Interior dark energy vacuum has negative pressure (w = -1), balancing inward gravitational pressure without an event horizon or central singularity.',
    distinguishingFeatures: [
      'No central singularity and no trapping event horizon; avoids the black hole information paradox and firewall paradoxes',
      'Thin shell of stiff, relativistic baryonic matter sits at roughly 1.1 times the Schwarzschild radius',
      'Gravitational wave ringdown signatures from mergers predict distinctive "quantum echoes" testable by advanced LIGO/Virgo and LISA',
    ],
    exampleStarIds: ['sgr-1806-20', 'psr-j1748-2446ad'],
    externalExamples: ['Theoretical Gravastar Compact Remnant Model', 'LIGO Event GW190521 Alternative Candidate'],
  },
  {
    id: 'iron-stars',
    name: 'Iron Stars (Quantum Tunneling Era)',
    buttonTitle: 'Iron Stars',
    category: 'Deep Cosmic Time Relics',
    colorHex: '#94a3b8',
    tag: 'Cold Nuclear Transmutation',
    theoreticalEra: '10¹⁵⁰⁰ years from now (Deep Cosmic Time)',
    energySource: 'Zero active heat; extremely slow spontaneous quantum tunneling fusion/decay',
    explanation:
      'Hypothetical cold stellar relics predicted by physicist Freeman Dyson to emerge in the unimaginably distant future of the universe (around 10¹⁵⁰⁰ years, assuming protons do not decay). Over these astronomical timescales, quantum tunneling causes atoms in cold degenerate white dwarfs and black dwarfs to spontaneously fuse and decay into Iron-56 — the most nuclear-binding-energy stable isotope in the universe.',
    physicsMechanism:
      'Even at absolute zero, quantum wavefunctions have non-zero probability of tunneling through the Coulomb barrier. Over 10¹⁵⁰⁰ years, lighter elements fuse to iron while heavier elements spontaneously fission to iron.',
    distinguishingFeatures: [
      'Represents the ultimate energetic ground state of baryonic matter in the cosmos',
      'Completely solid spheres of pure cold Iron-56',
      'After 10¹⁰^26 to 10¹⁰^76 years, iron stars will eventually collapse into black holes via quantum tunneling before slowly evaporating via Hawking radiation',
    ],
    exampleStarIds: ['sirius-b', 'bpm-37093', 'gd-358'],
    externalExamples: ['Dyson\'s Cold Iron Star (10¹⁵⁰⁰ year epoch)', 'Ultimate Fate of Degenerate Stellar Remnants'],
  },
];

export const STELLAR_LIFECYCLE_PATHS: StellarLifeCyclePath[] = [
  {
    id: 'path-low-mass',
    title: 'Low-Mass Stars (Red Dwarfs, < 0.5 M☉)',
    massCategory: '0.08 to 0.5 Solar Masses',
    summary: 'The marathon runners of the cosmos. They fully circulate their hydrogen fuel and shine quietly for trillions of years.',
    colorGradient: 'from-red-600 via-rose-500 to-amber-400',
    steps: [
      {
        stageName: 'Stellar Nursery (Nebula)',
        duration: '1–10 Million Years',
        description: 'A cold interstellar cloud of hydrogen gas and dust collapses under gravity.',
        iconType: 'cloud',
      },
      {
        stageName: 'Red Dwarf (Class M V)',
        duration: '100 Billion to 10 Trillion Years',
        description: 'Fuses hydrogen at a leisurely pace. Convection circulates fresh fuel directly into the core.',
        iconType: 'sun-small',
      },
      {
        stageName: 'Blue Dwarf (Theoretical)',
        duration: 'Billion Years',
        description: 'As hydrogen depletes, the star heats up and turns blue without expanding into a giant.',
        iconType: 'sparkles',
      },
      {
        stageName: 'White Dwarf & Black Dwarf',
        duration: 'Trillions of Years',
        description: 'Slowly cools down in peace without ever exploding.',
        iconType: 'disc',
      },
    ],
  },
  {
    id: 'path-solar-mass',
    title: 'Solar-Mass Stars (Our Sun, 0.5 to 8 M☉)',
    massCategory: '0.5 to 8 Solar Masses',
    summary: 'The life story of our own Sun: a stable 10-billion-year golden age, a spectacular red giant expansion, and a glowing planetary nebula finale.',
    colorGradient: 'from-amber-400 via-orange-500 to-cyan-400',
    steps: [
      {
        stageName: 'Molecular Gas Cloud Collapse',
        duration: '50 Million Years',
        description: 'Protostellar disk forms, igniting core hydrogen fusion at 15 million degrees Kelvin.',
        iconType: 'cloud',
      },
      {
        stageName: 'Yellow Dwarf (Class G V)',
        duration: '~10 Billion Years',
        description: 'Stable hydrogen fusion. (Our Sun is currently at year 4.6 billion of this tranquil stage).',
        iconType: 'sun',
      },
      {
        stageName: 'Red Giant Expansion (Class III)',
        duration: '~1 Billion Years',
        description: 'Core hydrogen depletes. Outer layers swell 100x, engulfing inner planets while core fuses Helium.',
        iconType: 'giant',
      },
      {
        stageName: 'Thermal Pulses & Carbon Star Dredge-Up (AGB)',
        duration: '~100,000 to 500,000 Years',
        description: 'In intermediate stars (1.5–4 M☉), helium shell flashes trigger deep convective dredge-ups. Carbon is pulled from the core into the atmosphere (C/O > 1), transforming the star into a glowing crimson Carbon Star with thick graphite dust rings.',
        iconType: 'sparkles',
      },
      {
        stageName: 'Planetary Nebula Shedding',
        duration: '~20,000 Years',
        description: 'The star gently blows off its outer envelope as a shimmering cosmic bubble.',
        iconType: 'ring',
      },
      {
        stageName: 'White Dwarf (Class VII)',
        duration: 'Trillions of Years',
        description: 'An Earth-sized crystal core of Carbon and Oxygen cools slowly forever.',
        iconType: 'white-dwarf',
      },
    ],
  },
  {
    id: 'path-high-mass',
    title: 'Massive Stars (Supergiants, 8 to 25 M☉)',
    massCategory: '8 to 25 Solar Masses',
    summary: 'Lives fast, burns with furious blue radiance, swells into a red supergiant, and dies in a blinding Supernova explosion.',
    colorGradient: 'from-blue-500 via-purple-500 to-rose-600',
    steps: [
      {
        stageName: 'Dense Protostellar Core',
        duration: '1 Million Years',
        description: 'Rapid gravitational collapse of a giant molecular cloud core.',
        iconType: 'cloud',
      },
      {
        stageName: 'Blue Main-Sequence Star (Class O/B V)',
        duration: '10 to 30 Million Years',
        description: 'Searing blue furnace fusing hydrogen via the CNO cycle at extreme luminosity.',
        iconType: 'blue-sun',
      },
      {
        stageName: 'Red Supergiant (Class I, like Betelgeuse)',
        duration: '1 Million Years',
        description: 'Swells to 1,000x the Sun. Fuses Carbon, Oxygen, Neon, Silicon in onion-like layers until Iron.',
        iconType: 'supergiant',
      },
      {
        stageName: 'Type II Supernova Explosion',
        duration: 'Seconds (collapse) / Months (glow)',
        description: 'Iron core collapses in milliseconds. The rebound explosion outshines an entire galaxy of 100 billion stars!',
        iconType: 'supernova',
      },
      {
        stageName: 'Neutron Star / Pulsar Remnant',
        duration: 'Billions of Years',
        description: 'A city-sized atomic sphere spinning hundreds of times per second.',
        iconType: 'pulsar',
      },
    ],
  },
  {
    id: 'path-hyper-massive',
    title: 'Hyper-Massive Stars (> 25 to 100+ M☉)',
    massCategory: '25 to 100+ Solar Masses',
    summary: 'The cosmic heavyweights. Unstable giants like Eta Carinae that end their lives creating Stellar Black Holes.',
    colorGradient: 'from-indigo-500 via-pink-600 to-black',
    steps: [
      {
        stageName: 'Monster O-Type / Wolf-Rayet',
        duration: '2–5 Million Years',
        description: 'Radiates with millions of solar luminosities, blasting out powerful stellar winds.',
        iconType: 'blue-sun',
      },
      {
        stageName: 'Luminous Blue Variable / Hypergiant',
        duration: '100,000 Years',
        description: 'Violently pulsates near the Eddington limit (radiation pressure rivaling gravity).',
        iconType: 'hypergiant',
      },
      {
        stageName: 'Hypernova / Pair-Instability Supernova',
        duration: 'Seconds',
        description: 'A colossal blast that can unleash intense Gamma-Ray Bursts across the universe.',
        iconType: 'supernova',
      },
      {
        stageName: 'Stellar-Mass Black Hole',
        duration: 'Practically Forever',
        description: 'Gravity crushes the core beyond the event horizon where not even light can escape.',
        iconType: 'black-hole',
      },
    ],
  },
];

export const STELLAR_MYTHS_GUIDE: StellarMythItem[] = [
  {
    myth: 'Myth: "A \'Dwarf\' star is tiny like an asteroid or planet."',
    reality: 'Reality: "Dwarf" in astronomy just means a normal star living in its prime on the Main Sequence (Class V).',
    explanation:
      'Our Sun is officially classified as a "Yellow Dwarf", yet you could fit 1.3 million Earths inside it! Blue O-type "dwarf" stars can be 15 times wider than the Sun and 60 times heavier. In astronomy, "dwarf" is simply the opposite of bloated "giant".',
    keyTakeaway: 'Dwarf = Normal Main-Sequence Star; Giant = Bloated Aging Star.',
  },
  {
    myth: 'Myth: "Red stars are hot and blue stars are cold, just like kitchen water faucets."',
    reality: 'Reality: Blue stars are blistering hot (>30,000 K); Red stars are the coolest (~2,500 K).',
    explanation:
      'In physics, light color reflects energy wavelength. Short-wavelength blue/violet photons carry much more thermal energy than long-wavelength red photons. A blue star is like an industrial welding arc; a red star is like a smoldering campfire ember.',
    keyTakeaway: 'Blue = Extreme Heat (Hotter); Red = Gentle Warmth (Cooler).',
  },
  {
    myth: 'Myth: "Bigger, heavier stars live much longer because they have more fuel."',
    reality: 'Reality: Heavy stars die in a flash (millions of years); tiny red dwarfs live for trillions of years.',
    explanation:
      'While a heavy star has 50 times more fuel than our Sun, it burns through it 100,000 times faster! It’s like comparing a gas-guzzling rocket engine (burns out in minutes) to an ultra-efficient watch battery (runs for years).',
    keyTakeaway: 'More Mass = Exponentially Faster Death.',
  },
  {
    myth: 'Myth: "Our Sun will explode in a dramatic Supernova when it dies."',
    reality: 'Reality: The Sun lacks the mass to go supernova. It will gently puff into a beautiful Planetary Nebula.',
    explanation:
      'A star needs at least ~8 times the mass of the Sun to trigger a core-collapse supernova. Instead, our Sun will expand into a Red Giant, shed its outer gases as a colorful nebula, and leave behind a tranquil, glowing Earth-sized White Dwarf.',
    keyTakeaway: 'The Sun will retire peacefully as a White Dwarf.',
  },
  {
    myth: 'Myth: "Hypergiants are hot because they are so huge."',
    reality: 'Reality: Red Hypergiants like Stephenson 2-18 and UY Scuti are actually quite cool on their surface (~3,200 K)!',
    explanation:
      'Because their outer atmosphere has expanded over billions of kilometers, that energy is spread over an immense surface area, cooling the outer gas to red temperatures. Their total brightness comes from sheer physical size, not high temperature!',
    keyTakeaway: 'Luminosity = Surface Area × Temperature⁴.',
  },
];

export const CLASSIFICATION_QUIZ: ClassificationQuizQuestion[] = [
  {
    id: 1,
    question: 'If you point a telescope at the sky and see a star with a deep electric blue glow, what can you deduce about its temperature?',
    options: [
      {
        id: '1a',
        text: 'It is very cold, like outer space ice.',
        isCorrect: false,
        explanation: 'Blue light carries the highest energy photons, meaning the star is scorching hot (> 20,000 K), not cold!',
      },
      {
        id: '1b',
        text: 'It has an extremely high surface temperature (often > 25,000 K).',
        isCorrect: true,
        explanation: 'Correct! Blue stars (Class O and B) are the hottest normal stars in the universe.',
      },
      {
        id: '1c',
        text: 'It is about to turn into a planet.',
        isCorrect: false,
        explanation: 'Stars do not turn into planets. Blue stars are massive, radiant powerhouses.',
      },
      {
        id: '1d',
        text: 'It has the exact same temperature as our Sun.',
        isCorrect: false,
        explanation: 'Our Sun is yellow-white (Class G2V, ~5,778 K), much cooler than a blue star.',
      },
    ],
  },
  {
    id: 2,
    question: 'What is the full spectral classification of our own Sun?',
    options: [
      {
        id: '2a',
        text: 'M1-2Ia (Red Supergiant)',
        isCorrect: false,
        explanation: 'M1-2Ia is the classification of Betelgeuse, a giant swollen star near the end of its life.',
      },
      {
        id: '2b',
        text: 'G2V (Yellow-White Main Sequence Star)',
        isCorrect: true,
        explanation: 'Spot on! "G" is the temperature class (~5,800 K), "2" is the temperature subdivision, and "V" means Main Sequence star.',
      },
      {
        id: '2c',
        text: 'O9.5V (Blue Super-Furnace)',
        isCorrect: false,
        explanation: 'O9.5V is a sizzling hot blue star like Zeta Ophiuchi.',
      },
      {
        id: '2d',
        text: 'WD / VII (White Dwarf)',
        isCorrect: false,
        explanation: 'Our Sun will only become a White Dwarf in ~5 billion years after its red giant phase.',
      },
    ],
  },
  {
    id: 3,
    question: 'Which type of star makes up the vast majority (over 75%) of all stars in the Milky Way galaxy?',
    options: [
      {
        id: '3a',
        text: 'Red Dwarfs (M-Type Main Sequence)',
        isCorrect: true,
        explanation: 'Correct! Over 3 out of every 4 stars in our galaxy are cool, tiny, long-lived Red Dwarfs like Proxima Centauri and TRAPPIST-1.',
      },
      {
        id: '3b',
        text: 'Blue Hypergiants (Class Ia+)',
        isCorrect: false,
        explanation: 'Hypergiants are extraordinarily rare (less than 1 in 10 million stars).',
      },
      {
        id: '3c',
        text: 'Supergiants like Betelgeuse',
        isCorrect: false,
        explanation: 'Supergiants represent only a tiny fraction of 1% of all stars.',
      },
      {
        id: '3d',
        text: 'Contact Binaries',
        isCorrect: false,
        explanation: 'While binary stars are common, M-type red dwarfs are by far the most numerous individual stars.',
      },
    ],
  },
  {
    id: 4,
    question: 'What allows huge Red Supergiants (like Betelgeuse or Antares) to shine 100,000x brighter than the Sun despite having cooler surfaces (~3,500 K)?',
    options: [
      {
        id: '4a',
        text: 'They reflect sunlight like a giant mirror.',
        isCorrect: false,
        explanation: 'Stars generate their own light through nuclear fusion; they do not reflect light.',
      },
      {
        id: '4b',
        text: 'Their gigantic surface area: being hundreds of times wider means they radiate vastly more total light energy.',
        isCorrect: true,
        explanation: 'Exactly right! Total luminosity depends on both Temperature and Surface Area (L = 4π R² σ T⁴). Because their radius R is immense, they emit gigantic amounts of light.',
      },
      {
        id: '4c',
        text: 'They are made of pure burning coal.',
        isCorrect: false,
        explanation: 'Stars are made of hydrogen and helium plasma powered by nuclear fusion, not chemical coal combustion.',
      },
      {
        id: '4d',
        text: 'Optical illusion caused by Earth’s atmosphere.',
        isCorrect: false,
        explanation: 'Their enormous luminosity is a genuine astrophysical property measured across space.',
      },
    ],
  },
  {
    id: 5,
    question: 'What is a White Dwarf?',
    options: [
      {
        id: '5a',
        text: 'A baby star that hasn\'t started burning fuel yet.',
        isCorrect: false,
        explanation: 'That is called a Protostar.',
      },
      {
        id: '5b',
        text: 'The dense, Earth-sized crystal core left behind after a star like the Sun dies and sheds its outer layers.',
        isCorrect: true,
        explanation: 'Perfect! White Dwarfs (Class VII / WD) are the glowing embers of low-to-medium mass stars, packing an entire Sun\'s mass into Earth’s volume.',
      },
      {
        id: '5c',
        text: 'A star that has been bleached white by cosmic rays.',
        isCorrect: false,
        explanation: 'White Dwarfs glow white because of their intense residual thermal heat from their former stellar core.',
      },
      {
        id: '5d',
        text: 'An asteroid caught in the Sun\'s gravitational pull.',
        isCorrect: false,
        explanation: 'White Dwarfs are collapsed stellar remnants, not asteroids.',
      },
    ],
  },
  {
    id: 6,
    question: 'What causes Carbon Stars (Spectral Class C, like "La Superba" and "Hind\'s Crimson Star") to glow with the deepest ruby-red color in the night sky?',
    options: [
      {
        id: '6a',
        text: 'Thermal dredge-up pushes carbon into the atmosphere so Carbon outnumbers Oxygen (C/O > 1); microscopic graphite soot scatters away all blue light.',
        isCorrect: true,
        explanation: 'Precisely! When C/O > 1, all oxygen is trapped in carbon monoxide, leaving surplus carbon to forge diatomic carbon (C₂) and graphite soot grains that intensely absorb blue/violet wavelengths, producing an unmatched liquid-ruby glow.',
      },
      {
        id: '6b',
        text: 'They are covered in giant oceans of molten lava.',
        isCorrect: false,
        explanation: 'Stars are gaseous plasma, not rocky bodies with lava oceans.',
      },
      {
        id: '6c',
        text: 'They are cold dead planets reflecting light from neighboring stars.',
        isCorrect: false,
        explanation: 'Carbon stars are gigantic luminous asymptotic giant branch (AGB) stars thousands of times brighter than our Sun.',
      },
      {
        id: '6d',
        text: 'They are moving away from us at nearly the speed of light, causing extreme redshift.',
        isCorrect: false,
        explanation: 'Their red color is intrinsic to their soot-filled atmospheric chemistry and cool ~2,500 K temperature, not cosmological redshift.',
      },
    ],
  },
];
