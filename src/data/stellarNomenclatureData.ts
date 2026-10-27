import { StarData } from '../types';

export interface NomenclatureTopic {
  id: string;
  title: string;
  iconName: string;
}

export interface ProperNameRecord {
  name: string;
  pronunciation?: string;
  meaning: string;
  language: 'Arabic' | 'Greek' | 'Latin' | 'Persian' | 'Chinese' | 'Indigenous' | 'Sanskrit' | 'Other';
  constellation: string;
  bayerOrId: string;
  iauApprovedYear: number;
  etymologyStory: string;
  catalogId: string; // real star in STARS_CATALOG
}

export interface ModernCatalogRecord {
  prefix: string;
  fullName: string;
  compiledBy: string;
  era: string;
  yearIntroduced: number;
  totalEntries: string;
  entryCountNumeric: number;
  rankOrder: number; // 1 = highest entry volume, higher = rarer
  category: 'astrometry' | 'exoplanet' | 'exotic' | 'photometry' | 'infrared' | 'deepsky' | 'nearby' | 'binary';
  primaryPurpose: string;
  numberingLogic: string;
  inDepthExplanation: string;
  example: string;
  exampleTarget: string;
  catalogId?: string; // real star in STARS_CATALOG
  significance: string;
  accentColor: string;
  imageUrl?: string;
  imageCaption?: string;
}

export interface ClusterExtragalacticRecord {
  systemName: string;
  category: 'Cluster Member' | 'Extragalactic Survey' | 'Lensed Extragalactic';
  originAndNamingConvention: string;
  parentStructureOrGalaxy: string;
  detailedLore: string;
  famousStars: {
    name: string;
    catalogId?: string;
    role: string;
  }[];
}

export interface NonStarStellarRecord {
  designation: string;
  type: string;
  actualIdentity: string;
  historicalContext: string;
  discoveryStory: string;
  catalogId?: string; // if related to a star or companion in STARS_CATALOG
}

export interface MiscellaneousNameRecord {
  popularName: string;
  formalDesignation: string;
  catalogId: string; // real star in STARS_CATALOG
  originType: 'Acronym / Initials' | 'Discoverer' | 'Color / Appearance' | 'Mythological / Folk' | 'Astrophysical Phenomenon';
  story: string;
}

export interface NomenclatureQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: 'proper' | 'bayer' | 'numbered' | 'variable' | 'catalogs' | 'exoplanets' | 'misc' | 'clusters';
}

export interface GreekAlphabetItem {
  letter: string;
  name: string;
  example: string;
  catalogId: string;
}

export interface SharedBayerRecord {
  bayerGroup: string;
  constellation: string;
  explanation: string;
  stars: {
    name: string;
    catalogId: string;
    designation: string;
    role: string;
  }[];
}

export interface ElnathCaseRecord {
  name: string;
  catalogId: string;
  currentDesignation: string;
  formerDualDesignation: string;
  constellations: string;
  historicalStory: string;
  resolution: string;
}

export const NOMENCLATURE_TOPICS: NomenclatureTopic[] = [
  { id: 'proper-names', title: 'Traditional Proper Names', iconName: 'Sparkles' },
  { id: 'bayer', title: 'Bayer Designations', iconName: 'Bookmark' },
  { id: 'numbered', title: 'Numbered Designations', iconName: 'List' },
  { id: 'variable', title: 'Variable Stars', iconName: 'Activity' },
  { id: 'catalogs', title: 'Modern Catalogs', iconName: 'Database' },
  { id: 'clusters-extragalactic', title: 'Clusters & Extragalactic', iconName: 'Globe' },
  { id: 'misc-names', title: 'Miscellaneous Names', iconName: 'Tag' },
  { id: 'non-stars', title: 'Non-Stars with Stellar Names', iconName: 'AlertCircle' },
  { id: 'components-planets', title: 'Components & Planets', iconName: 'Binary' },
  { id: 'quiz', title: 'Mastery Quiz', iconName: 'Award' },
];

export const FAMOUS_PROPER_NAMES: ProperNameRecord[] = [
  {
    name: 'Sirius',
    pronunciation: 'SEER-ee-əs',
    meaning: 'The Scorcher / Glowing One',
    language: 'Greek',
    constellation: 'Canis Major',
    bayerOrId: 'α Canis Majoris A',
    iauApprovedYear: 2016,
    etymologyStory: 'Derived from ancient Greek Σείριος (Seírios), denoting blazing heat. Ancient Greeks and Egyptians associated its heliacal rising with the hottest summer days ("dog days") and the annual flooding of the Nile.',
    catalogId: 'sirius-a',
  },
  {
    name: 'Betelgeuse',
    pronunciation: 'BEET-əl-jooz',
    meaning: 'Armpit of the Central Giant',
    language: 'Arabic',
    constellation: 'Orion',
    bayerOrId: 'α Orionis',
    iauApprovedYear: 2016,
    etymologyStory: 'Corrupted medieval Latinization of Arabic إبط الجوزاء (Ibṭ al-Jawzāʼ), meaning "the armpit of al-Jawzāʼ" (the central giant woman or constellation Orion in pre-Islamic Arabian astronomy).',
    catalogId: 'betelgeuse',
  },
  {
    name: 'Vega',
    pronunciation: 'VAY-gə',
    meaning: 'The Swooping Eagle',
    language: 'Arabic',
    constellation: 'Lyra',
    bayerOrId: 'α Lyrae',
    iauApprovedYear: 2016,
    etymologyStory: 'From Arabic النسر الواقع (an-Nasr al-Wāqi‘), "the swooping/falling eagle or vulture", contrasting with Altair (an-Nasr aṭ-Ṭāʼir, "the flying eagle").',
    catalogId: 'vega',
  },
  {
    name: 'Rigel',
    pronunciation: 'RY-jəl',
    meaning: 'The Left Foot of the Giant',
    language: 'Arabic',
    constellation: 'Orion',
    bayerOrId: 'β Orionis A',
    iauApprovedYear: 2016,
    etymologyStory: 'From Arabic رِجْل الجَوْزَاء (Rijl al-Jawzāʼ), meaning "foot of the central one". Despite bearing the Greek letter Beta (β), Rigel is almost always noticeably brighter than Alpha Orionis (Betelgeuse).',
    catalogId: 'rigel',
  },
  {
    name: 'Aldebaran',
    pronunciation: 'æl-DEB-ər-ən',
    meaning: 'The Follower',
    language: 'Arabic',
    constellation: 'Taurus',
    bayerOrId: 'α Tauri',
    iauApprovedYear: 2016,
    etymologyStory: 'From Arabic الدبران (al-Dabarān), meaning "the Follower", because its brilliant orange light appears to follow the Pleiades (Seven Sisters) star cluster across the night sky night after night.',
    catalogId: 'aldebaran',
  },
  {
    name: 'Antares',
    pronunciation: 'æn-TAIR-eez',
    meaning: 'Rival of Mars',
    language: 'Greek',
    constellation: 'Scorpius',
    bayerOrId: 'α Scorpii A',
    iauApprovedYear: 2016,
    etymologyStory: 'From Greek Ἀντάρης (Antárēs), meaning "anti-Ares" or "rival of Mars". Its deep reddish hue and position near the ecliptic frequently led ancient skywatchers to compare it directly to the red planet Mars (Ares).',
    catalogId: 'antares',
  },
  {
    name: 'Polaris',
    pronunciation: 'poh-LAIR-iss',
    meaning: 'Of the Pole',
    language: 'Latin',
    constellation: 'Ursa Minor',
    bayerOrId: 'α Ursae Minoris Aa',
    iauApprovedYear: 2016,
    etymologyStory: 'From Renaissance Latin stella polaris ("polar star"). In Renaissance and modern navigation, it serves as the North Star due to its alignment within 1° of the northern celestial rotational axis.',
    catalogId: 'polaris',
  },
  {
    name: 'Proxima Centauri',
    pronunciation: 'PROK-sih-mə sen-TOR-eye',
    meaning: 'Nearest [Star] of Centaurus',
    language: 'Latin',
    constellation: 'Centaurus',
    bayerOrId: 'α Centauri C',
    iauApprovedYear: 2016,
    etymologyStory: 'Coined by Scottish astronomer Robert Innes in 1915 upon discovering its record-breaking parallax: at 4.246 light-years, it is the closest star to our Solar System.',
    catalogId: 'proxima-centauri',
  },
  {
    name: 'Deneb',
    pronunciation: 'DEN-eb',
    meaning: 'The Tail of the Hen',
    language: 'Arabic',
    constellation: 'Cygnus',
    bayerOrId: 'α Cygni',
    iauApprovedYear: 2016,
    etymologyStory: 'From Arabic ذنب الدجاجة (Dhanab al-Dajājah), literally "the tail of the hen". It marks the northern tail of Cygnus the Swan and is one vertex of the famous Summer Triangle asterism.',
    catalogId: 'deneb',
  },
  {
    name: 'Fomalhaut',
    pronunciation: 'FOH-məl-hawt',
    meaning: 'Mouth of the Southern Fish',
    language: 'Arabic',
    constellation: 'Piscis Austrinus',
    bayerOrId: 'α Piscis Austrini A',
    iauApprovedYear: 2016,
    etymologyStory: 'From Arabic فم الحوت (Fum al-Ḥūt), "mouth of the whale/fish". Famous for its massive debris disk resembling the "Eye of Sauron" imaged by the Hubble Space Telescope.',
    catalogId: 'fomalhaut',
  },
  {
    name: 'Canopus',
    pronunciation: 'kə-NOH-pəs',
    meaning: 'Helmsman of the Argo',
    language: 'Greek',
    constellation: 'Carina',
    bayerOrId: 'α Carinae',
    iauApprovedYear: 2016,
    etymologyStory: 'Named after Canopus, the legendary helmsman of King Menelaus of Sparta in Homer’s Trojan War saga. The second-brightest star in the entire night sky, used for attitude navigation on NASA spacecraft.',
    catalogId: 'canopus',
  },
  {
    name: 'Spica',
    pronunciation: 'SPY-kə',
    meaning: 'Ear of Wheat',
    language: 'Latin',
    constellation: 'Virgo',
    bayerOrId: 'α Virginis',
    iauApprovedYear: 2016,
    etymologyStory: 'From Latin spīca virginis, meaning "Virgo’s ear of grain/wheat". The constellation Virgo represents Astraea or Demeter/Ceres, goddess of agriculture holding the harvest wheat sheaf.',
    catalogId: 'spica',
  },
  {
    name: 'Arcturus',
    pronunciation: 'ark-TOO-rəs',
    meaning: 'Guardian of the Bear',
    language: 'Greek',
    constellation: 'Boötes',
    bayerOrId: 'α Boötis',
    iauApprovedYear: 2016,
    etymologyStory: 'From ancient Greek Ἀρκτοῦρος (Arktouros), meaning "guardian or keeper of the bear", as it appears to follow Ursa Major (the Great Bear) around the celestial pole.',
    catalogId: 'arcturus',
  },
  {
    name: 'Achernar',
    pronunciation: 'AY-kər-nar',
    meaning: 'End of the River',
    language: 'Arabic',
    constellation: 'Eridanus',
    bayerOrId: 'α Eridani A',
    iauApprovedYear: 2016,
    etymologyStory: 'From Arabic آخر النهر (Ākhir an-Nahr), "the end of the river". It marks the southern terminus of the winding celestial river Eridanus and is famously the least spherical star known due to extreme rotation.',
    catalogId: 'achernar',
  },
  {
    name: 'Bellatrix',
    pronunciation: 'bə-LAY-triks',
    meaning: 'Female Warrior / Amazon',
    language: 'Latin',
    constellation: 'Orion',
    bayerOrId: 'γ Orionis',
    iauApprovedYear: 2016,
    etymologyStory: 'From Latin bellātrix ("female warrior" or "Amazon star"). Medieval Latin translation of Abu Ma’shar’s Arabic astronomical text referring to Orion’s left shoulder as an active conqueror.',
    catalogId: 'bellatrix',
  },
  {
    name: 'Algol',
    pronunciation: 'AL-gol',
    meaning: 'The Ghoul / Demon Star',
    language: 'Arabic',
    constellation: 'Perseus',
    bayerOrId: 'β Persei A',
    iauApprovedYear: 2016,
    etymologyStory: 'From Arabic رأس الغول (Raʼs al-Ghūl), "head of the demon/ghoul". Represents the severed head of Medusa held by Perseus; its dramatic 2.87-day eclipsing drops led ancients to consider it an ominous evil eye.',
    catalogId: 'algol-a',
  },
  {
    name: 'Mira',
    pronunciation: 'MY-rə',
    meaning: 'The Wonderful / Astonishing One',
    language: 'Latin',
    constellation: 'Cetus',
    bayerOrId: 'ο Ceti',
    iauApprovedYear: 2016,
    etymologyStory: 'Named Stella Mira ("wonderful star") by Johannes Hevelius in 1662 because it periodically fades below naked-eye visibility and reappears bright every 332 days.',
    catalogId: 'mira-a',
  },
];

/**
 * Modern Astronomical Catalogs
 * Sorted strictly from MOST COMMON (highest object count) to RAREST (rarest astrophysical objects)
 */
/**
 * Modern Astronomical Catalogs
 * Sorted strictly from MOST COMMON (most common in stellar listings / literature) to RAREST,
 * with specialized, uncommon, and non-stellar catalogs (like NGC) at the end.
 */
export const MODERN_CATALOGS: ModernCatalogRecord[] = [
  {
    prefix: 'Gaia (DR1 / DR2 / DR3 / FPR)',
    fullName: 'European Space Agency Gaia Astrometric Mission',
    compiledBy: 'ESA Gaia Data Processing and Analysis Consortium (DPAC)',
    era: 'Launched 2013; DR3 released 2022; Ongoing',
    yearIntroduced: 2013,
    totalEntries: '1,811,709,771 sources (~1.81 Billion)',
    entryCountNumeric: 1811709771,
    rankOrder: 1,
    category: 'astrometry',
    primaryPurpose: 'High-precision 3D space astrometry mapping positions, parallaxes, proper motions, radial velocities, and astrophysical parameters for nearly two billion celestial sources across the entire sky.',
    numberingLogic: 'Hierarchical HEALPix spatial indexing integer encoding celestial coordinates and observation identifiers: Gaia DR3 [unique 19-digit integer].',
    inDepthExplanation: 'Gaia operates at the Sun-Earth L2 Lagrange point with twin optical telescopes focused onto a colossal 1-gigapixel focal plane array (the largest ever flown in space). It continuously sweeps the celestial sphere to measure parallaxes with micro-arcsecond accuracy (equivalent to measuring a coin on the surface of the Moon from Earth). Gaia completely revolutionized astronomy by removing ground-based atmospheric seeing and anchoring the cosmic distance scale across the entire Milky Way.',
    example: 'Gaia DR3 5877263051010738688',
    exampleTarget: 'Precision 3D kinematics and distance benchmarking of the solar neighborhood',
    catalogId: 'lp-40-365',
    significance: 'The undisputed gold standard in modern astrometry; pinpointing stellar distances, 3D orbits, stellar streams, and galactic kinematics.',
    accentColor: '#c084fc',
    imageUrl: '/assets/gaia_telescope.jpg',
    imageCaption: 'ESA Gaia Astrometric Space Observatory at Sun-Earth L2',
  },
  {
    prefix: 'USNO / USNO-B1.0',
    fullName: 'United States Naval Observatory All-Sky Astrometric Catalog',
    compiledBy: 'Dave Monet et al. (U.S. Naval Observatory Flagstaff Station)',
    era: '2003 (Based on digitized Schmidt sky surveys from 1950–1990)',
    yearIntroduced: 2003,
    totalEntries: '1,042,618,261 sources (~1.04 Billion)',
    entryCountNumeric: 1042618261,
    rankOrder: 2,
    category: 'astrometry',
    primaryPurpose: 'Deep all-sky astrometric and photometric catalog created by precision digital scanning of Palomar (POSS) and Southern (SRC/ESO) photographic plates.',
    numberingLogic: 'Hierarchical zone-based identifier: USNO-B1.0 [zone]-[sequence], where zone is defined by 0.1-degree declination bands (e.g. USNO-B1.0 1341-0294028).',
    inDepthExplanation: 'By digitizing 7,435 glass photographic Schmidt plates with Precision Measuring Machines (PMM), the USNO team created the first billion-object all-sky catalog in astronomy history. With positions accurate to 0.2 arcseconds and proper motions computed across half a century of baseline imaging, USNO-B1.0 was the universal backbone for asteroid tracking, space telescope guide stars, and identifying ultra-high proper motion subdwarfs like Kapteyn’s Star.',
    example: 'USNO-B1.0 1341-0294028 (Kapteyn’s Star)',
    exampleTarget: 'Halo subdwarf racing through the solar neighborhood with extreme proper motion (8.7″/yr)',
    catalogId: 'kapteyns-star',
    significance: 'The first catalog in human history to surpass one billion mapped celestial objects.',
    accentColor: '#38bdf8',
  },
  {
    prefix: 'TIC / TESS',
    fullName: 'TESS Input Catalog & Candidate Exoplanet Hosts',
    compiledBy: 'NASA Transiting Exoplanet Survey Satellite Science Team (MIT / GSFC / STScI)',
    era: 'Launched 2018; TIC-8 released 2019; Ongoing all-sky survey',
    yearIntroduced: 2018,
    totalEntries: '1,000,000,000+ sources surveyed (~1 Billion stars)',
    entryCountNumeric: 1000000000,
    rankOrder: 3,
    category: 'exoplanet',
    primaryPurpose: 'All-sky master point source catalog compiled to prioritize bright, nearby stars for transiting habitable exoplanet detection.',
    numberingLogic: 'Numbered sequentially by integer identifier: TIC [number] (e.g. TIC 260128333). Discovered planet candidates receive TOI numbers (e.g. TOI-700).',
    inDepthExplanation: 'Unlike Kepler’s single narrow field of view, TESS scans the entire celestial sphere across 26 distinct sectors using four ultra-wide cameras. The TESS Input Catalog (TIC) merged Gaia, 2MASS, and Hipparcos data to calculate stellar radii, masses, and temperatures for hundreds of millions of stars. This allows astronomers to rapidly detect Earth-sized worlds orbiting in the habitable zones of nearby stars, such as TOI-700 d.',
    example: 'TIC 260128333 (TOI-700)',
    exampleTarget: 'Quiet nearby M-dwarf hosting temperate Earth-sized planet TOI-700 d in the habitable zone',
    catalogId: 'toi-700',
    significance: 'The premier all-sky exoplanet transit survey discovering Earth-analog candidates around our nearest cosmic neighbors.',
    accentColor: '#22d3ee',
  },
  {
    prefix: 'WISE / CatWISE',
    fullName: 'Wide-field Infrared Survey Explorer (AllWISE / CatWISE2020)',
    compiledBy: 'NASA JPL / Caltech / IPAC / UCLA',
    era: 'Launched 2009; NEOWISE extension through 2024; Ongoing archive',
    yearIntroduced: 2009,
    totalEntries: '747,634,026 sources (~747 Million)',
    entryCountNumeric: 747634026,
    rankOrder: 4,
    category: 'infrared',
    primaryPurpose: 'All-sky cryogenic and warm spaceborne mid-infrared imaging across W1 (3.4 µm), W2 (4.6 µm), W3 (12 µm), and W4 (22 µm) bands.',
    numberingLogic: 'Sexagesimal celestial coordinates: WISE J[HHMMSS.ss±DDMMSS.s] (J2000 epoch).',
    inDepthExplanation: 'Flying an all-sky mid-infrared telescope in low Earth orbit, WISE was sensitive to cool thermal glow emitted by objects too cold to produce optical light. WISE discovered the coldest class of stars known to physics: the "Y-dwarfs" (ultra-cool brown dwarfs with atmospheric temperatures below the freezing point of water, such as WISE 0855-0714). It also surveyed circumstellar debris disks, protoplanetary nurseries, and obscured luminous hypergiants across the Milky Way.',
    example: 'WISE J085510.83-071442.5 (WISE 0855-0714)',
    exampleTarget: 'Coldest sub-stellar object known outside the solar system (~250 K / -23°C ice dwarf)',
    catalogId: 'wise-0855-0714',
    significance: 'Discovered the ultra-cool Y-spectral class and revolutionized our understanding of brown dwarfs and circumstellar dust disks.',
    accentColor: '#fb923c',
  },
  {
    prefix: 'SDSS',
    fullName: 'Sloan Digital Sky Survey',
    compiledBy: 'Astrophysical Research Consortium (Apache Point Observatory, New Mexico)',
    era: 'First light 1998; Data releases through DR18+ (SDSS-V ongoing)',
    yearIntroduced: 1998,
    totalEntries: '500+ Million photometric sources / 3+ Million spectra',
    entryCountNumeric: 500000000,
    rankOrder: 5,
    category: 'photometry',
    primaryPurpose: 'Deep multi-color optical imaging (u, g, r, i, z filters) and dedicated multi-fiber spectroscopic census of stars, quasars, galaxies, and brown dwarfs.',
    numberingLogic: 'Designated by sexagesimal coordinates: SDSS J[HHMMSS.ss±DDMMSS.s] based on epoch J2000.0 astrometry.',
    inDepthExplanation: 'Using a dedicated 2.5-meter wide-angle telescope equipped with aluminum plug-plates and thousands of optical fibers, SDSS pioneered industrial-scale astronomical spectroscopy. For stellar astrophysics, SDSS mapped the Milky Way halo, detected hypervelocity stars ejected by Sagittarius A*, unmasked thousands of ultra-cool L and T brown dwarfs, and characterized primordial metal-poor stars formed shortly after the Big Bang.',
    example: 'SDSS J102915+172927 (Caffau’s Star)',
    exampleTarget: 'Ultra metal-poor star with less than 1/10,000,000th of the Sun’s metallicity',
    significance: 'Pioneered open-access astronomical big data and uncovered the stellar halo structure of our galaxy.',
    accentColor: '#38bdf8',
  },
  {
    prefix: '2MASS',
    fullName: 'Two Micron All-Sky Survey',
    compiledBy: 'University of Massachusetts Amherst & IPAC / Caltech / NASA',
    era: 'Observations 1997–2001; Released 2003',
    yearIntroduced: 1997,
    totalEntries: '470,992,970 point sources (~471 Million)',
    entryCountNumeric: 470992970,
    rankOrder: 6,
    category: 'infrared',
    primaryPurpose: 'Complete all-sky near-infrared photometric imaging across J (1.25 µm), H (1.65 µm), and Ks (2.17 µm) bands.',
    numberingLogic: 'Sexagesimal celestial coordinates: 2MASS J[HHMMSSss±DDMMSSs] (Julian epoch J2000 coordinates).',
    inDepthExplanation: 'Operating twin 1.3-meter telescopes at Mount Hopkins (Arizona) and Cerro Tololo (Chile), 2MASS pierced through the dense dust lanes of the Milky Way’s disk. Infrared light passes unimpeded through interstellar dust grains, allowing 2MASS to discover thousands of hidden stars, uncover the new spectral classes L and T for substellar brown dwarfs, and discover deeply embedded starburst clusters.',
    example: '2MASS J23062928-0502285 (TRAPPIST-1)',
    exampleTarget: 'Ultra-cool red dwarf star hosting 7 Earth-sized terrestrial planets',
    catalogId: 'trappist-1',
    significance: 'Fundamental infrared reference survey that opened the study of brown dwarfs and dust-obscured stellar populations.',
    accentColor: '#f43f5e',
  },
  {
    prefix: 'TYC / Tycho-2',
    fullName: 'Tycho-2 Astrometric and Photometric Star Catalogue',
    compiledBy: 'Erik Høg et al. (Copenhagen University Observatory, Lund, & ESA)',
    era: 'Tycho-1: 1997; Tycho-2: 2000',
    yearIntroduced: 1997,
    totalEntries: '2,539,913 stars (~2.54 Million)',
    entryCountNumeric: 2539913,
    rankOrder: 7,
    category: 'astrometry',
    primaryPurpose: 'High-precision astrometric and two-color photometric all-sky reference catalog complete to magnitude V ~ 11.5.',
    numberingLogic: 'Hierarchical three-number identifier: TYC [region]-[star]-[component] (e.g. TYC 1042-1214-1).',
    inDepthExplanation: 'Constructed using the auxiliary Star Mapper instrument aboard ESA’s Hipparcos satellite, Tycho-2 combined spaceborne measurements with 144 ground-based historical photographic catalogs spanning over a century. By comparing modern space positions against historic plates, Tycho-2 achieved extraordinary proper motion accuracy (~2.5 milliarcseconds/year) for 2.5 million stars across the entire sky. It is the primary reference catalog used for telescope pointing and CCD plate solving worldwide.',
    example: 'TYC 1042-1214-1',
    exampleTarget: 'High-precision astrometric reference star anchoring celestial coordinates and ground tracking',
    significance: 'The premier astrometric reference catalog for modern ground-based observatories and amateur GoTo telescopes.',
    accentColor: '#2dd4bf',
  },
  {
    prefix: 'BD / CD / CPD',
    fullName: 'Bonner Durchmusterung & Southern Surveys (Cordoba & Cape)',
    compiledBy: 'Friedrich Argelander, Adalbert Krüger, Eduard Schönfeld (Bonn); B.A. Gould (Cordoba); David Gill & J.C. Kapteyn (Cape)',
    era: '1859–1903 (BD: 1859–1862; SD: 1886; CD: 1892; CPD: 1896–1903)',
    yearIntroduced: 1859,
    totalEntries: '1,120,000+ stars across the complete celestial sphere',
    entryCountNumeric: 1120000,
    rankOrder: 8,
    category: 'astrometry',
    primaryPurpose: 'The first comprehensive, systematic all-sky visual and photographic astrometric survey of the modern era.',
    numberingLogic: 'Declination zone (1-degree band) followed by sequence number in Right Ascension: BD +[deg] [number], e.g. BD +04° 3561.',
    inDepthExplanation: 'Undertaken visually using a tiny 78-mm Fraunhofer refractor at Bonn Observatory, Friedrich Argelander and his assistants spent decades recording visual transits across illuminated reticle wires down to 9th–10th magnitude. The project divided the heavens into 1-degree declination bands from +89° down to -02°. Later extended southwards by Schönfeld, Gould (Cordoba Durchmusterung, CD), and Gill & Kapteyn (Cape Photographic Durchmusterung, CPD), the Durchmusterung established the foundational coordinate nomenclature that remains in constant use today for variable stars, exoplanet hosts, and nearby red dwarfs.',
    example: 'BD +04° 3561a (Barnard’s Star)',
    exampleTarget: 'Bonn astrometric survey zone +4°, entry #3561; fastest proper motion star known',
    catalogId: 'barnards-star',
    significance: 'The direct ancestor of modern stellar catalogs; created the declination-zone indexing system that anchored 19th- and 20th-century astronomy.',
    accentColor: '#38bdf8',
  },
  {
    prefix: 'HD / HDE',
    fullName: 'Henry Draper Catalogue & Extension',
    compiledBy: 'Annie Jump Cannon & Edward C. Pickering (Harvard College Observatory)',
    era: '1918–1924 (Extension published through 1949)',
    yearIntroduced: 1918,
    totalEntries: '359,083 stars',
    entryCountNumeric: 359083,
    rankOrder: 9,
    category: 'astrometry',
    primaryPurpose: 'Monumental all-sky spectroscopic catalog classifying stars into the Harvard spectral sequence (O, B, A, F, G, K, M).',
    numberingLogic: 'Numbered sequentially from HD 1 to HD 225300 ordered by Right Ascension (epoch B1900.0). Extension entries run up to HDE 359083.',
    inDepthExplanation: 'Funded by Mary Anna Palmer Draper in memory of her husband Henry Draper (who photographed the first stellar spectrum in 1872), this historic catalog was classified almost entirely by Annie Jump Cannon by manually examining objective-prism photographic glass plates. It established the Harvard spectral classification system as the foundation of 20th-century stellar physics and remains the universal identifier used in academic literature.',
    example: 'HD 140283 (Methuselah Star)',
    exampleTarget: 'One of the oldest known Pop II subgiant stars in the Universe',
    catalogId: 'methuselah-star',
    significance: 'The historical foundation of stellar spectral classification and still the most ubiquitous catalog prefix in stellar research.',
    accentColor: '#0ea5e9',
  },
  {
    prefix: 'LHS / LTT / LFT / LP',
    fullName: 'Luyten High Proper Motion Catalogues (LHS, NLTT, LFT, LP)',
    compiledBy: 'Willem Jacob Luyten (University of Minnesota & Palomar Observatory)',
    era: '1955–1980 (LHS published 1979; NLTT 1979–1980)',
    yearIntroduced: 1955,
    totalEntries: '300,000+ stars with proper motion; LHS contains 4,470 stars with motion ≥ 0.5″/yr',
    entryCountNumeric: 300000,
    rankOrder: 10,
    category: 'nearby',
    primaryPurpose: 'Systematic census of high-proper-motion stars to detect nearby red dwarfs, subdwarfs, and solitary white dwarfs.',
    numberingLogic: 'LHS [number] for motion ≥ 0.5″/yr (LHS 1 to LHS 4470); LFT for motion ≥ 0.5″; NLTT for motion ≥ 0.2″; LP [zone]-[plate] for Palomar plates.',
    inDepthExplanation: 'Dutch-American astronomer Willem Jacob Luyten revolutionized stellar astronomy by single-handedly measuring and cataloging more than 500,000 photographic plates. Using an automated computerized blink comparator of his own invention, Luyten searched pairs of Palomar Schmidt plates taken decades apart to find stars that moved across the background sky. Because apparent brightness drops with distance squared, distant giants look bright but barely move, while faint nearby red dwarfs race across the heavens. Luyten’s catalogues unmasked the vast majority of our local cosmic neighborhood, identifying white dwarfs, flare stars, and premier exoplanetary targets like LHS 1140.',
    example: 'LHS 1140',
    exampleTarget: 'Luyten Half-Second star #1140; mid-M dwarf hosting temperate rocky super-Earth LHS 1140 b in habitable zone',
    catalogId: 'lhs-1140',
    significance: 'The greatest individual proper-motion survey in astronomical history, populating the census of nearby low-mass stars and white dwarfs.',
    accentColor: '#ec4899',
  },
  {
    prefix: 'SAO',
    fullName: 'Smithsonian Astrophysical Observatory Star Catalog',
    compiledBy: 'Smithsonian Astrophysical Observatory (SAO)',
    era: '1966',
    yearIntroduced: 1966,
    totalEntries: '258,997 stars',
    entryCountNumeric: 258997,
    rankOrder: 11,
    category: 'astrometry',
    primaryPurpose: 'High-accuracy machine-readable all-sky astrometric catalog compiled for optical satellite tracking at the dawn of the Space Age.',
    numberingLogic: 'Arranged in 1-degree declination bands from +89° down to -89°, numbered sequentially by Right Ascension: SAO [number] (SAO 1 to SAO 258997).',
    inDepthExplanation: 'Following the launch of Sputnik in 1957, NASA and the Smithsonian required an accurate, computer-readable star map to triangulate artificial satellites photographed by Baker-Nunn tracking cameras. SAO astronomers harmonized position data from the Yale, Cape, and AGK catalogs to create the world’s first computerized star catalog down to magnitude V ~ 9. For decades, SAO numbers were the universal coordinates used in astronomy textbooks, computer planetarium software, and amateur computerized GoTo telescope mounts.',
    example: 'SAO 114046 (Lalande 21185)',
    exampleTarget: 'Prominent nearby red dwarf in Ursa Major cataloged for precision orbital satellite tracking',
    catalogId: 'lalande-21185',
    significance: 'The first machine-readable, computer-indexed all-sky astrometric database of the Space Age.',
    accentColor: '#6366f1',
  },
  {
    prefix: 'IRAS',
    fullName: 'Infrared Astronomical Satellite Point Source Catalog',
    compiledBy: 'Joint NASA / NIVR (Netherlands) / SERC (UK) Project',
    era: 'Mission: 1983; Catalogs released 1984–1988',
    yearIntroduced: 1983,
    totalEntries: '245,889 infrared sources',
    entryCountNumeric: 245889,
    rankOrder: 12,
    category: 'infrared',
    primaryPurpose: 'The historic first spaceborne all-sky infrared survey at 12, 25, 60, and 100 µm wavelengths.',
    numberingLogic: 'Equatorial coordinates: IRAS [HHMMm±DDMM], e.g. IRAS 05280-6910, IRAS 17166-3336.',
    inDepthExplanation: 'Launched in 1983 as the first cryogenic space observatory, IRAS discovered the "Vega phenomenon"—detecting infrared-excess emission caused by dusty protoplanetary debris disks orbiting mature stars like Vega and Fomalhaut. It also pinpointed deeply embedded proto-stellar nurseries hidden inside opaque molecular clouds and discovered luminous infrared hypergiants shrouded in thick circumstellar dust cocoons.',
    example: 'IRAS 05280-6910',
    exampleTarget: 'Extreme dust-enshrouded red supergiant in the Large Magellanic Cloud with massive mass-loss envelope',
    catalogId: 'iras-05280-6910',
    significance: 'Pioneered space infrared astronomy and discovered the first circumstellar debris disks around other stars.',
    accentColor: '#f97316',
  },
  {
    prefix: 'WDS',
    fullName: 'Washington Double Star Catalog',
    compiledBy: 'Astrometry Department, United States Naval Observatory (USNO)',
    era: '1984 to Present (Continuously updated in real-time)',
    yearIntroduced: 1984,
    totalEntries: '155,000+ visual double, multiple, and binary star systems (~1.5 Million observations)',
    entryCountNumeric: 155000,
    rankOrder: 13,
    category: 'binary',
    primaryPurpose: 'The world’s definitive global master repository for astrometric observations of visual double and multiple star systems.',
    numberingLogic: 'Arcminute celestial coordinates: WDS J[HHMMSS.ss±DDMMSS.s] followed by historic discoverer designation and component letters (e.g. STF, BU, DUN).',
    inDepthExplanation: 'Binary stars provide the ONLY direct empirical method in astrophysics to weigh stars via Newton’s revision of Kepler’s third law. Maintained by the US Naval Observatory, WDS integrates over 200 years of visual micrometric, speckle interferometric, adaptive optics, and space astrometry measurements. Every entry traces the angular separation in arcseconds and position angle in degrees across centuries, allowing astrophysicists to compute orbital parameters, stellar masses, and dynastic multiplicity hierarchies.',
    example: 'WDS J21069+3845 (61 Cygni AB)',
    exampleTarget: 'Historic visual binary whose orbital motion demonstrated mutual gravitation between two distinct stars',
    catalogId: '61-cygni-a',
    significance: 'The global standard registry for binary star orbits and direct empirical stellar mass determinations.',
    accentColor: '#8b5cf6',
  },
  {
    prefix: 'ROSAT / 4U',
    fullName: 'All-Sky High-Energy X-Ray Point Source Surveys (ROSAT 1RXS & Uhuru 4U)',
    compiledBy: 'Max Planck Institute for Extraterrestrial Physics (DLR / NASA) & Uhuru Science Team',
    era: 'Uhuru: 1970–1973; ROSAT All-Sky Survey: 1990–1999',
    yearIntroduced: 1970,
    totalEntries: '120,000+ cosmic X-ray point sources',
    entryCountNumeric: 120000,
    rankOrder: 14,
    category: 'exotic',
    primaryPurpose: 'Systematic imaging of extreme high-energy astrophysical environments: neutron star accretion discs, pulsars, and black hole candidates.',
    numberingLogic: 'Prefix by survey and coordinates: 4U [HHMM±DD] (e.g. 4U 1617-15) or 1RXS J[HHMMSS.s±DDMMSS] (e.g. 1RXS J141256.0+792204).',
    inDepthExplanation: 'Because Earth’s atmosphere absorbs X-rays, the high-energy sky remained invisible until space observatories were launched. NASA’s Uhuru (1970) discovered the first binary pulsar and black hole candidates (Cygnus X-1), while the German-US ROSAT satellite carried out the first imaging all-sky survey in soft X-rays. ROSAT discovered isolated thermal neutron stars ("The Magnificent Seven" and Calvera) and mapped high-temperature coronae around active flare stars.',
    example: '4U 1617-15 / Sco X-1 NS (Calvera / 1RXS J141256)',
    exampleTarget: 'Historic first extrasolar X-ray source discovered (Scorpius X-1) & isolated thermal neutron star Calvera',
    catalogId: 'scorpius-x-1-ns',
    significance: 'Unveiled the violent high-energy universe of accreting relativistic neutron stars, black holes, and active stellar coronae.',
    accentColor: '#06b6d4',
  },
  {
    prefix: 'HIP',
    fullName: 'Hipparcos Catalogue',
    compiledBy: 'European Space Agency (ESA) Hipparcos Mission',
    era: 'Mission: 1989–1993; Published 1997',
    yearIntroduced: 1989,
    totalEntries: '118,218 stars',
    entryCountNumeric: 118218,
    rankOrder: 15,
    category: 'astrometry',
    primaryPurpose: 'High-precision space astrometry measuring trigonometric parallaxes, proper motions, and photometric magnitudes from orbit.',
    numberingLogic: 'Numbered sequentially from HIP 1 to HIP 120416 ordered by Right Ascension (epoch J1991.25).',
    inDepthExplanation: 'Named after ancient Greek astronomer Hipparchus (who discovered precession and compiled the first star catalog), the Hipparcos satellite was humankind’s very first space astrometry mission. Free from Earth’s atmospheric turbulence and refraction, Hipparcos measured stellar distances with 1-milliarcsecond precision, recalibrating the cosmic distance scale, Cepheid period-luminosity relations, and stellar ages across the solar neighborhood.',
    example: 'HIP 87937 (Barnard’s Star)',
    exampleTarget: 'High-precision orbital astrometry measuring distance (5.96 ly) and proper motion to the nearest solitary red dwarf',
    catalogId: 'barnards-star',
    significance: 'First space astrometry mission that liberated stellar distance measurement from Earth’s atmosphere.',
    accentColor: '#a78bfa',
  },
  {
    prefix: 'HR / BSC',
    fullName: 'Bright Star Catalogue (Harvard Revised Photometry)',
    compiledBy: 'Yale University Observatory (Frank Schlesinger, Dorrit Hoffleit, Wayne H. Warren Jr.)',
    era: 'First edition 1908 (Edward C. Pickering); 5th edition 1991',
    yearIntroduced: 1908,
    totalEntries: '9,110 stars',
    entryCountNumeric: 9110,
    rankOrder: 16,
    category: 'photometry',
    primaryPurpose: 'Comprehensive astrophysical reference containing all naked-eye stars across the sky with visual magnitude V ≤ 6.5.',
    numberingLogic: 'Numbered sequentially HR 1 to HR 9110 by Right Ascension (epoch B1900.0), plus 14 historical novae and supernovae.',
    inDepthExplanation: 'Originally published as the Revised Harvard Photometry by Edward Pickering in 1908, it was modernized by Yale astronomer Dorrit Hoffleit into the premier astrophysical reference manual for bright stars. Every entry contains cross-identifications, spectral types, variable designations, radial velocities, binary orbital elements, and rotational velocities.',
    example: 'HR 5171 A (V766 Centauri)',
    exampleTarget: 'Colossal yellow hypergiant contact binary cataloged in the Bright Star Catalogue (V = 6.1–7.3)',
    catalogId: 'v766-centauri',
    significance: 'Definitive reference manual for all stars visible to the naked human eye.',
    accentColor: '#fbbf24',
  },
  {
    prefix: 'Giclas (G)',
    fullName: 'Lowell Proper Motion Survey (Northern & Southern Hemispheres)',
    compiledBy: 'Henry L. Giclas, Robert Burnham Jr., Norman G. Thomas (Lowell Observatory, Flagstaff, Arizona)',
    era: '1971 (Northern) & 1979 (Southern)',
    yearIntroduced: 1971,
    totalEntries: '8,989 high proper motion stars',
    entryCountNumeric: 8989,
    rankOrder: 17,
    category: 'nearby',
    primaryPurpose: 'Identifying high proper motion stars (μ ≥ 0.27″/yr) and detecting ultra-faint white dwarfs and flare stars.',
    numberingLogic: 'Designated by survey plate region and sequential index: G [region]-[number], e.g. G 20-24, G 196-3.',
    inDepthExplanation: 'Conducted using the historic 13-inch Pluto Discovery refractor telescope at Lowell Observatory, Henry Giclas, Robert Burnham Jr. (author of the famed Burnham’s Celestial Handbook), and Norman Thomas photographed identical fields separated by decades. Their survey revealed thousands of high-velocity halo subdwarfs and white dwarfs. Stars with "G" numbers remain frequent subjects in exoplanetary transit searches and white dwarf cooling models.',
    example: 'G 196-3',
    exampleTarget: 'Young nearby M-dwarf with a directly imaged substellar planetary-mass companion',
    significance: 'Key 20th-century proper motion survey that pioneered modern identification of low-luminosity degenerate stars.',
    accentColor: '#f43f5e',
  },
  {
    prefix: 'NGC / IC',
    fullName: 'New General Catalogue of Nebulae and Clusters of Stars',
    compiledBy: 'John Louis Emil Dreyer (Armagh Observatory, Ireland / Royal Astronomical Society)',
    era: 'Published 1888 (with Index Catalogues IC I in 1895 and IC II in 1908)',
    yearIntroduced: 1888,
    totalEntries: '7,840 deep-sky objects',
    entryCountNumeric: 7840,
    rankOrder: 18,
    category: 'deepsky',
    primaryPurpose: 'Comprehensive catalog of all non-stellar deep sky objects: galaxies, open clusters, globular clusters, and planetary nebulae. Widely used for central stars of nebulae and luminous cluster members.',
    numberingLogic: 'Numbered sequentially from NGC 1 to NGC 7840 in order of Right Ascension (epoch 1860.0).',
    inDepthExplanation: 'Although originally compiled to catalog "nebulae and clusters" (incorporating observations from William and Caroline Herschel and John Herschel), many planetary nebulae central stars, Wolf-Rayet stars, and dense cluster stars are identified primarily by their parent NGC designation. For example, the ultra-hot ionizing central star of the planetary nebula NGC 2371-2 and the Cat’s Eye central star (NGC 6543) are universally referenced by their NGC numbers.',
    example: 'NGC 2371-2 Central Star',
    exampleTarget: 'Ultra-hot planetary nebula central star with surface temperature ~135,000 K',
    catalogId: 'ngc-2371-central',
    significance: 'The foundational deep-sky catalog of astronomy, connecting stars directly to their surrounding nebulae and parent clusters.',
    accentColor: '#a855f7',
  },
  {
    prefix: 'GJ / Gliese',
    fullName: 'Catalogue of Nearby Stars (CNS)',
    compiledBy: 'Wilhelm Gliese (1957, 1969) & Hartmut Jahreiß (1979, 1991)',
    era: '1957–1991 (Continually expanded as CNS4)',
    yearIntroduced: 1957,
    totalEntries: '~3,800 nearby stars',
    entryCountNumeric: 3800,
    rankOrder: 19,
    category: 'nearby',
    primaryPurpose: 'Comprehensive census of all stellar and sub-stellar objects within 20 to 25 parsecs (~65 to 82 light-years) of the Solar System.',
    numberingLogic: 'Original Gliese stars: Gl 1.0 to Gl 915. Extended Gliese-Jahreiß additions: GJ 1000 to GJ 4388, plus GJ 9001+.',
    inDepthExplanation: 'German astronomer Wilhelm Gliese compiled the first systematic census of the Sun’s immediate cosmic backyard to understand the local stellar density, luminosity function, and kinematics. Hartmut Jahreiß expanded the catalog to include thousands of newly identified faint M-dwarfs and white dwarfs. Because nearby red dwarfs have high apparent brightness and large angular separation from Earth, Gliese stars are the primary targets for direct imaging and radial-velocity exoplanet hunts.',
    example: 'GJ 699 (Barnard’s Star)',
    exampleTarget: 'Fastest-moving star across our night sky (10.3 arcseconds per year)',
    catalogId: 'barnards-star',
    significance: 'Primary hunting ground for habitable terrestrial exoplanets and stellar physics of low-mass red dwarfs.',
    accentColor: '#34d399',
  },
  {
    prefix: 'PSR',
    fullName: 'Pulsating Source of Radio (ATNF Pulsar Catalogue)',
    compiledBy: 'Australia Telescope National Facility (CSIRO) / Discovery Radio Observatories',
    era: '1967 (Jocelyn Bell Burnell discovery) to Present',
    yearIntroduced: 1967,
    totalEntries: '3,300+ radio pulsars',
    entryCountNumeric: 3300,
    rankOrder: 20,
    category: 'exotic',
    primaryPurpose: 'Rapidly rotating, ultra-dense magnetized neutron stars that emit lighthouse-like beams of electromagnetic radiation.',
    numberingLogic: 'Coordinate-based prefix: historic PSR B[B1950 coordinates, e.g. PSR B1257+12] or modern PSR J[J2000 coordinates, e.g. PSR J0737-3039].',
    inDepthExplanation: 'When massive stars collapse in core-collapse supernovae, their remnant cores compress into neutron stars with densities exceeding 10¹⁴ g/cm³ (a teaspoon of pulsar matter weighs billions of tons). As they spin up to hundreds of rotations per second, their magnetic poles sweep beams of radio waves across space. Pulsars are ultra-precise cosmic clocks used to test Einstein’s general relativity, detect low-frequency gravitational waves, and famously hosted the very first exoplanets ever confirmed.',
    example: 'PSR B1257+12 (Lich Pulsar)',
    exampleTarget: 'Pulsar hosting the historic first confirmed exoplanetary system in human history (1992)',
    catalogId: 'lich-pulsar',
    significance: 'Natural laboratories for extreme relativistic gravity, superdense nuclear matter, and pulsar timing arrays.',
    accentColor: '#818cf8',
    imageUrl: '/assets/jocelyn_bell_burnell.jpg',
    imageCaption: 'Dame Jocelyn Bell Burnell, discoverer of the first radio pulsar (1967)',
  },
  {
    prefix: 'Kepler / KOI / K2',
    fullName: 'Kepler Mission Exoplanet Host Stars',
    compiledBy: 'NASA Kepler & K2 Space Telescope Science Teams',
    era: '2009–2018 (Primary mission in Cygnus; K2 ecliptic survey)',
    yearIntroduced: 2009,
    totalEntries: '2,700+ confirmed stars / 4,500+ KOIs (Kepler Objects of Interest)',
    entryCountNumeric: 2700,
    rankOrder: 21,
    category: 'exoplanet',
    primaryPurpose: 'Cataloging stars hosting transiting exoplanets detected via continuous, high-precision spaceborne optical photometry.',
    numberingLogic: 'Numbered sequentially (Kepler-1, Kepler-22, Kepler-452) in order of planet confirmation. Candidates receive KOI numbers (e.g. KOI-7016).',
    inDepthExplanation: 'Launched in 2009 into an Earth-trailing heliocentric orbit, the Kepler space telescope stared unblinkingly at 150,000 stars in Cygnus and Lyra for four years to detect the infinitesimal dip in starlight when a planet crosses in front of its star. Kepler revolutionized exoplanetary science by proving that rocky Earth-sized worlds and sub-Neptunes are among the most common planets in the galaxy.',
    example: 'Kepler-452',
    exampleTarget: 'G2V solar twin star hosting "Earth’s older cousin" Kepler-452b in the habitable zone',
    catalogId: 'kepler-452',
    significance: 'Provided the first statistical proof that planets outnumber stars across the Milky Way Galaxy.',
    accentColor: '#38bdf8',
    imageUrl: '/assets/kepler_telescope.png',
    imageCaption: 'NASA Kepler Space Telescope spacecraft flight model',
  },
  {
    prefix: 'Wolf',
    fullName: 'Wolf Catalogue of High Proper Motion Stars',
    compiledBy: 'Max Wolf (Landessternwarte Heidelberg-Königstuhl, Germany)',
    era: '1919–1929',
    yearIntroduced: 1919,
    totalEntries: '1,566 high proper motion stars',
    entryCountNumeric: 1566,
    rankOrder: 22,
    category: 'nearby',
    primaryPurpose: 'Pioneered the photographic stereocomparator technique to discover faint, high-velocity stars in the Solar neighborhood.',
    numberingLogic: 'Numbered sequentially from Wolf 1 to Wolf 1566, e.g. Wolf 359, Wolf 1061.',
    inDepthExplanation: 'Max Wolf, the pioneer of astrophotography and the blink comparator, realized that static photographs could reveal rapid stellar kinematics. By rapidly alternating between two photographic glass plates of the same patch of sky taken years apart, stationary background stars remained static while nearby stars visibly "jumped". Wolf discovered many of humanity’s closest stellar neighbors, including Wolf 359 (an extreme flare star only 7.8 light-years away) and Wolf 1061 (which hosts a rocky planet in its liquid-water habitable zone).',
    example: 'Wolf 359 (CN Leonis)',
    exampleTarget: 'Fifth-closest solitary star to the Solar System (7.86 ly); archetypal flare star in Leo',
    catalogId: 'wolf-359',
    significance: 'First systematic photographic blink-comparator survey, proving that the Solar neighborhood is dominated by faint red dwarfs.',
    accentColor: '#f59e0b',
  },
  {
    prefix: 'Ross',
    fullName: 'Ross High Proper Motion Catalogues',
    compiledBy: 'Frank Elmore Ross (Yerkes Observatory, Williams Bay, Wisconsin)',
    era: '1925–1939',
    yearIntroduced: 1925,
    totalEntries: '1,090 high proper motion stars',
    entryCountNumeric: 1090,
    rankOrder: 23,
    category: 'nearby',
    primaryPurpose: 'Second-epoch photographic search for large proper motions and faint nearby flare stars.',
    numberingLogic: 'Numbered sequentially from Ross 1 to Ross 1090, e.g. Ross 128, Ross 248, Ross 154.',
    inDepthExplanation: 'Using the 10-inch Bruce Photographic Telescope at Yerkes Observatory, Frank E. Ross re-photographed fields previously imaged by E.E. Barnard and Max Wolf. Ross’s survey added over a thousand high-motion targets to the astronomical record. Ross stars include some of the closest and quietest red dwarfs known, such as Ross 128 (an inactive red dwarf 11 light-years away hosting a temperate terrestrial planet) and Ross 248 (which in 33,000 years will temporarily become the closest star to the Sun).',
    example: 'Ross 128',
    exampleTarget: 'Quiescent red dwarf at 11 light-years hosting temperate Earth-mass exoplanet Ross 128 b',
    catalogId: 'ross-128',
    significance: 'Discovered several of the closest exoplanet-hosting stars and future close stellar flybys.',
    accentColor: '#10b981',
  },
  {
    prefix: 'WR',
    fullName: 'Catalogue of Galactic Wolf-Rayet Stars',
    compiledBy: 'Karel A. van der Hucht (VIIth Catalogue of Galactic Wolf-Rayet Stars)',
    era: 'First discovered 1867 (Charles Wolf & Georges Rayet); Modern 2001–2024',
    yearIntroduced: 1867,
    totalEntries: '660+ galactic Wolf-Rayet stars',
    entryCountNumeric: 660,
    rankOrder: 24,
    category: 'exotic',
    primaryPurpose: 'Evolved massive stars that have completely shed their outer hydrogen envelopes, exposing searing helium, carbon, nitrogen, and oxygen cores.',
    numberingLogic: 'Numbered sequentially from WR 1 to WR 160+ in order of Right Ascension, with lettered subdivisions for new discoveries.',
    inDepthExplanation: 'Wolf-Rayet stars are the final, fleeting evolutionary stage of stars that began life with masses above 20 to 25 solar masses. Their surface temperatures exceed 30,000 K to over 210,000 K, driving ferocious supersonic stellar winds (up to 3,000 km/s) that generate prominent, broad emission lines. Because their lives as WR stars last only a few hundred thousand years before collapsing into black holes, they are exceedingly rare.',
    example: 'WR 102',
    exampleTarget: 'Oxygen-sequence WO2 star with surface temperature ~210,000 K, on the verge of core collapse',
    catalogId: 'wr-102',
    significance: 'Direct progenitors to Type Ib/Ic supernovae, hypernovae, and long-duration Gamma-Ray Bursts (GRBs).',
    accentColor: '#fb923c',
  },
  {
    prefix: 'LBV',
    fullName: 'Luminous Blue Variable Surveys',
    compiledBy: 'Various Galactic & Magellanic Surveys (Humphreys, Davidson, et al.)',
    era: 'Identified as a distinct class in 1984; Modern surveys ongoing',
    yearIntroduced: 1984,
    totalEntries: '~50 confirmed stars in the Milky Way & Local Group',
    entryCountNumeric: 50,
    rankOrder: 25,
    category: 'exotic',
    primaryPurpose: 'Extremely rare, unstable hypergiant stars undergoing dramatic eruptive mass loss near the classical Eddington luminosity limit.',
    numberingLogic: 'Designated by coordinates (e.g. LBV 1806-20) or under historic variable/Bayer catalogs (Eta Carinae, P Cygni, S Doradus).',
    inDepthExplanation: 'Luminous Blue Variables (also known as Hubble-Sandage variables or S Doradus stars) are among the most massive and luminous stars in existence, radiating between 500,000 to over 3 million times more power than the Sun. They hover so close to the Eddington limit (where radiation pressure overcomes gravity) that they periodically suffer catastrophic giant eruptions, blasting out solar masses of gas in mere decades. Because this phase is brief (~40,000 years), they are the rarest stellar class known.',
    example: 'LBV 1806−20',
    exampleTarget: 'Hypergiant star shining with up to 2 million solar luminosities in Sagittarius',
    catalogId: 'lbv-1806-20',
    significance: 'The rarest massive stars in the universe, testing the upper limit of stellar mass and stability.',
    accentColor: '#f43f5e',
  },
];

export const CLUSTERS_AND_EXTRAGALACTIC_LORE: ClusterExtragalacticRecord[] = [
  {
    systemName: 'R136 (Radcliffe 136)',
    category: 'Cluster Member',
    originAndNamingConvention: 'Designated "R" for the Radcliffe Observatory Magellanic Cloud survey conducted by Feast, Thackeray, and Wesselink in 1960. Central dense core is designated R136a, subdivided into R136a1, a2, a3, b, c.',
    parentStructureOrGalaxy: '30 Doradus (Tarantula Nebula) in the Large Magellanic Cloud (LMC)',
    detailedLore: 'R136 is an ultra-dense, young super star cluster containing dozens of the most massive stars known in the local universe. Originally thought to be a single gargantuan star of 2,000 solar masses, speckle interferometry and the Hubble Space Telescope resolved it into a cluster of extreme Wolf-Rayet and O2-type stars, including R136a1, the most massive star ever confirmed (196–250 M☉).',
    famousStars: [
      { name: 'R136a1', catalogId: 'r136a1', role: 'Most massive and luminous star known in the universe (~200 M☉, 4.7 million L☉)' },
      { name: 'R136a2', catalogId: 'r136a2', role: 'Ultra-massive WN5h Wolf-Rayet star (~180 M☉)' },
      { name: 'R136a3', catalogId: 'r136a3', role: 'Hyper-luminous young Wolf-Rayet star (~155 M☉)' },
      { name: 'R136c', catalogId: 'r136c', role: 'WN5h supergiant binary undergoing collision-wind X-ray emission' },
    ],
  },
  {
    systemName: 'Stephenson 2 & RSGC Clusters',
    category: 'Cluster Member',
    originAndNamingConvention: 'Discovered in 1990 by American astronomer Charles Bruce Stephenson during a deep photographic survey of the Milky Way plane. Also cataloged as RSGC2 (Red Supergiant Cluster 2) or DFK 1.',
    parentStructureOrGalaxy: 'Scutum-Centaurus Arm of the Milky Way, near the Scutum bar intersection',
    detailedLore: 'Stephenson 2 is an extraordinary massive open cluster buried behind heavy interstellar dust extinction. It contains at least 26 confirmed red supergiants—the largest collection of red supergiants known in any cluster in the galaxy. Its most famous member, Stephenson 2-18 (RSGC2-18 / Stephenson 2 DFK 1), is currently considered one of the physically largest stars in existence, with an estimated radius of ~2,150 solar radii.',
    famousStars: [
      { name: 'Stephenson 2-18', catalogId: 'stephenson-2-18', role: 'Colossal red hypergiant with a radius that would engulf the orbit of Saturn' },
    ],
  },
  {
    systemName: 'Westerlund 1 & 2',
    category: 'Cluster Member',
    originAndNamingConvention: 'Discovered by Swedish astronomer Bengt Westerlund in 1961. Stars are designated with the cluster letter followed by numbers (e.g. W26, W4, W9).',
    parentStructureOrGalaxy: 'Constellation Ara (Westerlund 1) and Carina (Westerlund 2)',
    detailedLore: 'Westerlund 1 is the most massive young super star cluster in the Milky Way, with a total mass exceeding 100,000 solar masses packed into a region only 6 light-years across. It contains a rich menagerie of evolved massive stars: 24 Wolf-Rayet stars, yellow hypergiants, luminous blue variables, a magnetar (CXOU J164710.2-455216), and the red supergiant Westerlund 1-26 (W26), whose radius spans over 1,500 solar radii.',
    famousStars: [
      { name: 'Westerlund 1-26 (W26)', catalogId: 'westerlund-1-26', role: 'Red hypergiant with an ionized circumstellar nebula and enormous radio envelope' },
    ],
  },
  {
    systemName: 'Trumpler Clusters (Trumpler 14 & 16)',
    category: 'Cluster Member',
    originAndNamingConvention: 'Cataloged by Swiss-American astronomer Robert Julius Trumpler in 1930 during his seminal study on open clusters and interstellar extinction.',
    parentStructureOrGalaxy: 'Carina Nebula (NGC 3372) complex',
    detailedLore: 'Trumpler 14 and Trumpler 16 host some of the hottest and most energetic O-stars in the galaxy. Trumpler 16 is most famous for harboring Eta Carinae (one of the most unstable and massive stellar binaries known), while Trumpler 14 contains HD 93129A, an O2 supergiant blazing with a surface temperature over 42,000 K.',
    famousStars: [
      { name: 'Eta Carinae A', catalogId: 'eta-carinae-a', role: 'Luminous Blue Variable undergoing continuous giant bipolar eruptions (Homunculus Nebula)' },
    ],
  },
  {
    systemName: 'Extragalactic Surveys: VFTS, BAT99, & Sanduleak',
    category: 'Extragalactic Survey',
    originAndNamingConvention: 'VFTS: VLT Flames Tarantula Survey (ESO). BAT99: Breysacher, Azzopardi & Testor (1999) LMC Wolf-Rayet catalog. Sanduleak: Nicholas Sanduleak surveys in the Magellanic Clouds.',
    parentStructureOrGalaxy: 'Large Magellanic Cloud (LMC) & Small Magellanic Cloud (SMC)',
    detailedLore: 'Because the Magellanic Clouds have lower metallicity than the Milky Way (resembling conditions in the early universe), their stars have weaker stellar winds and can retain more mass throughout their lifespans. Systematic extragalactic surveys cataloged stars like VFTS 682 (an isolated 150 M☉ hypergiant) and BAT99-98 (one of the hottest Wolf-Rayet stars in the LMC). Nicholas Sanduleak’s 1969 catalog included Sanduleak -69° 202, famous as the progenitor star that exploded as Supernova 1987A!',
    famousStars: [
      { name: 'VFTS 682', catalogId: 'vfts-682', role: 'Isolated 150 M☉ hypergiant located 95 light-years outside any dense cluster core' },
      { name: 'BAT99-98', catalogId: 'bat99-98', role: 'Record-holding Wolf-Rayet star with a mass of ~226 M☉ and 5 million solar luminosities' },
      { name: 'Sanduleak 2-73', catalogId: 'sanduleak-2-73', role: 'Hyper-luminous O-type supergiant in the LMC' },
    ],
  },
  {
    systemName: 'Gravitationally Lensed Extragalactic Stars: Godzilla & Earendel',
    category: 'Lensed Extragalactic',
    originAndNamingConvention: 'Named by discovering teams utilizing massive foreground galaxy cluster gravitational lenses. "Godzilla" is situated in the Sunburst Arc; "Earendel" (WHL0137-LS) is Old English for "Morning Star".',
    parentStructureOrGalaxy: 'Sunburst Arc (z = 2.37) / WHL0137-08 Galaxy (z = 6.2)',
    detailedLore: 'Normally, individual single stars cannot be resolved in galaxies billions of light-years away. However, when a foreground galaxy cluster warps spacetime into a gravitational lens and an individual star crosses exactly along a caustic line of near-infinite magnification (magnified by factors of 1,000 to 50,000), space telescopes can detect individual stars across cosmic time! Godzilla is currently the most luminous star ever observed in human history, glowing with an estimated 130 million solar luminosities due to caustic lensing magnification.',
    famousStars: [
      { name: 'Godzilla', catalogId: 'godzilla', role: 'Gravitationally lensed LBV in the Sunburst Arc at redshift z = 2.37 (10.9 billion light-years)' },
      { name: 'AF Andromedae', catalogId: 'af-andromedae', role: 'Historic Hubble-Sandage Luminous Blue Variable in the Andromeda Galaxy (M31)' },
    ],
  },
];

export const MISCELLANEOUS_NAMES: MiscellaneousNameRecord[] = [
  {
    popularName: 'NML Cygni',
    formalDesignation: 'V1489 Cygni / IRC +40448',
    catalogId: 'nml-cygni',
    originType: 'Acronym / Initials',
    story: 'Named after the initials of the three American astrophysicists who discovered it in 1965: Gerry Neugebauer, D. E. Martz, and Robert B. Leighton (N-M-L) at Mount Wilson Observatory. It was one of the first extreme infrared stars ever detected, and is an enormous red hypergiant spanning over 1,600 solar radii.',
  },
  {
    popularName: 'The Garnet Star',
    formalDesignation: 'μ Cephei / HR 8316',
    catalogId: 'mu-cephei',
    originType: 'Color / Appearance',
    story: 'Sir William Herschel was so astonished by this red supergiant’s vivid ruby-red coloration through his telescope in 1783 that he described it as having "a very fine deep garnet colour, such as the periodical star o Ceti." It has been celebrated as Herschel’s Garnet Star ever since.',
  },
  {
    popularName: 'Barnard’s Star',
    formalDesignation: 'GJ 699 / BD+04°3561a',
    catalogId: 'barnards-star',
    originType: 'Discoverer',
    story: 'Named after American astronomer Edward Emerson Barnard, who measured its record-shattering proper motion of 10.3 arcseconds per year in 1916. It travels across the width of a full moon in just 180 years!',
  },
  {
    popularName: 'The Demon Star',
    formalDesignation: 'Algol / β Persei A',
    catalogId: 'algol-a',
    originType: 'Mythological / Folk',
    story: 'An ancient Arabic moniker (Raʼs al-Ghūl, "Head of the Demon") reflecting how this star mysteriously winks: every 2.87 days, its brightness drops by more than a full magnitude as a cooler companion eclipses the primary star.',
  },
  {
    popularName: 'The Methuselah Star',
    formalDesignation: 'HD 140283',
    catalogId: 'methuselah-star',
    originType: 'Astrophysical Phenomenon',
    story: 'Nicknamed after the biblical figure Methuselah due to initial parallax estimates suggesting an age of 14.46 ± 0.8 billion years—seemingly older than the Universe itself! Modern refined measurements place its age at ~13.7 billion years, confirming it formed in the first generation after the Big Bang.',
  },
  {
    popularName: 'The Pistol Star',
    formalDesignation: 'V4647 Sagittarii',
    catalogId: 'pistol-star',
    originType: 'Astrophysical Phenomenon',
    story: 'Named after the distinctive pistol-shaped reflection nebula it illuminates near the Galactic Center. Discovered by Don Figer using the Hubble Space Telescope in the 1990s, this Luminous Blue Variable radiates over 1.6 million times more energy than the Sun.',
  },
  {
    popularName: 'Kapteyn’s Star',
    formalDesignation: 'HD 33793 / VZ Pictoris',
    catalogId: 'kapteyns-star',
    originType: 'Discoverer',
    story: 'Discovered in 1897 by Dutch astronomer Jacobus Kapteyn. It holds the second-highest proper motion known (8.7 arcseconds per year) and travels retrogradely through the galactic halo, likely captured from a merged dwarf galaxy.',
  },
  {
    popularName: 'Van Maanen’s Star',
    formalDesignation: 'Wolf 28 / Gliese 35',
    catalogId: 'van-maanens-star',
    originType: 'Discoverer',
    story: 'Discovered in 1917 by Dutch-American astronomer Adriaan van Maanen. It is historic as the third white dwarf ever recognized (after 40 Eridani B and Sirius B) and the closest solitary white dwarf to our Solar System (14.07 light-years).',
  },
  {
    popularName: 'Bessel’s Star',
    formalDesignation: '61 Cygni A',
    catalogId: '61-cygni-a',
    originType: 'Discoverer',
    story: 'Named in honor of German astronomer Friedrich Bessel, who in 1838 achieved humanity’s first successful trigonometric parallax distance measurement to any star other than the Sun (measuring 11.4 light-years to 61 Cygni).',
  },
  {
    popularName: 'The North Star / Pole Star',
    formalDesignation: 'Polaris / α Ursae Minoris Aa',
    catalogId: 'polaris',
    originType: 'Mythological / Folk',
    story: 'A functional astronomical moniker denoting the star closest to the northern celestial pole. Due to Earth’s 25,772-year axial precession, Polaris is only our current pole star—4,000 years ago Thuban was the pole star, and in 12,000 years Vega will take its place.',
  },
];

export const NON_STAR_STELLAR_DESIGNATIONS: NonStarStellarRecord[] = [
  {
    designation: 'Omega Centauri (ω Centauri)',
    type: 'Bayer Designation given to a Globular Cluster',
    actualIdentity: 'Largest and brightest globular star cluster in the Milky Way (~10 million stars)',
    historicalContext: 'Ptolemy cataloged it in the Almagest as a single star on the back of the Centaur. In 1603, Johann Bayer formally assigned it the Greek letter Omega (ω Centauri) as a solitary star.',
    discoveryStory: 'In 1677, English astronomer Edmond Halley pointed his telescope at ω Centauri from the island of Saint Helena and discovered it was not a star, but a nebulous cloud! Modern space telescopes reveal it is likely the stripped relic core of an ancient dwarf galaxy consumed by the Milky Way.',
  },
  {
    designation: '34 Tauri',
    type: 'Flamsteed Number given to a Major Planet',
    actualIdentity: 'The ice giant planet Uranus',
    historicalContext: 'In December 1690, John Flamsteed observed a faint 6th-magnitude pinpoint of light in the constellation Taurus and cataloged it as an ordinary fixed star: 34 Tauri.',
    discoveryStory: 'Because Uranus moves slowly in its 84-year orbit, Flamsteed did not detect its motion in single nights. Nearly a century later in 1781, William Herschel noticed its disc and orbital motion, discovering the planet Uranus. Historians found Flamsteed had observed Uranus 91 years earlier!',
  },
  {
    designation: '3 Cassiopeiae',
    type: 'Flamsteed Number given to a Supernova',
    actualIdentity: 'The Cassiopeia A Supernova Remnant (c. 1680)',
    historicalContext: 'In August 1680, John Flamsteed logged a 6th-magnitude star in Cassiopeia and assigned it the designation 3 Cassiopeiae. Later astronomers could find nothing at those coordinates, and it was long dismissed as an observational error.',
    discoveryStory: 'In the mid-20th century, radio astronomers detected one of the strongest radio sources in the sky (Cassiopeia A). Retrograde expansion calculations proved the supernova shockwave erupted around 1680—Flamsteed had caught the dying gasp of a massive star as a temporary "ghost star"!',
  },
  {
    designation: 'Chi Persei (χ Persei) & h Persei',
    type: 'Bayer Designations given to Open Star Clusters',
    actualIdentity: 'The Double Cluster in Perseus (NGC 884 & NGC 869)',
    historicalContext: 'Hipparchus cataloged a fuzzy patch in Perseus in 130 BC. In 1603, Johann Bayer assigned the Greek letter χ (Chi) and lowercase Latin letter h as individual stars in Perseus.',
    discoveryStory: 'Telescopes revealed that χ and h Persei are two breathtaking sibling open star clusters, each containing over 300 young supergiant stars located 7,500 light-years away in the Perseus spiral arm.',
  },
  {
    designation: 'Theta Orionis (θ Orionis)',
    type: 'Bayer Designation given to a Multiple Star Cluster',
    actualIdentity: 'The Trapezium Cluster inside the Orion Nebula (M42)',
    historicalContext: 'Bayer assigned θ Orionis to what appeared to be a single 5th-magnitude star in Orion’s sword.',
    discoveryStory: 'Telescopic resolution proved θ Orionis is a compact stellar nursery of young OB stars that ionize the surrounding Great Orion Nebula. The primary components are designated θ¹ Orionis (A, B, C, D) and θ² Orionis.',
  },
  {
    designation: 'P Cygni',
    type: 'Bayer Uppercase Latin Designation given to an Eruptive Hypergiant',
    actualIdentity: 'Luminous Blue Variable (LBV) hypergiant undergoing giant mass eruptions',
    historicalContext: 'In August 1600, Dutch cartographer Willem Janszoon Blaeu observed a brilliant "new star" (nova) in Cygnus that had never been seen before. It remained bright for years, fluctuated wildly, and was assigned the uppercase Latin Bayer letter "P".',
    discoveryStory: 'P Cygni is not a normal stable star; it is an unstable hypergiant with extreme stellar winds that created the canonical "P Cygni spectral profile" used in astrophysics to diagnose mass outflows.',
    catalogId: 'p-cygni',
  },
];

export interface DecoderPreset {
  designation: string;
  name: string;
  system: 'Bayer (Greek)' | 'Bayer (Latin)' | 'Numbered (Flamsteed)' | 'Numbered (Gould)' | 'Variable (Argelander)' | 'Modern Catalog (HD)' | 'Modern Catalog (GJ)' | 'Modern Catalog (PSR)' | 'Exoplanet System';
  catalogId?: string; // real star in STARS_CATALOG
  parts: {
    segment: string;
    role: string;
    explanation: string;
    color: string;
  }[];
  notes: string;
}

export const DECODER_PRESETS: DecoderPreset[] = [
  {
    designation: 'α Canis Majoris A',
    name: 'Sirius A',
    system: 'Bayer (Greek)',
    catalogId: 'sirius-a',
    parts: [
      { segment: 'α', role: 'Bayer Greek Letter', explanation: 'Alpha (1st letter): generally the brightest star in the constellation.', color: 'text-amber-300 bg-amber-950/60 border-amber-500/40' },
      { segment: 'Canis Majoris', role: 'Genitive of Constellation', explanation: 'Latin genitive of Canis Major ("The Greater Dog"), meaning "of Canis Major".', color: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/40' },
      { segment: 'A', role: 'Component Designation', explanation: 'Capital letter designating the primary, more massive star in this binary system.', color: 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40' },
    ],
    notes: 'Sirius B is the famous white dwarf companion (The Pup) orbiting Sirius A with a 50-year period.',
  },
  {
    designation: 'P Cygni',
    name: 'P Cygni',
    system: 'Bayer (Latin)',
    catalogId: 'p-cygni',
    parts: [
      { segment: 'P', role: 'Bayer Uppercase Latin Letter', explanation: 'Assigned from the uppercase Latin series (A–Q) when Greek and lowercase letters were exhausted.', color: 'text-fuchsia-300 bg-fuchsia-950/60 border-fuchsia-500/40' },
      { segment: 'Cygni', role: 'Genitive of Constellation', explanation: 'Latin genitive of Cygnus ("The Swan").', color: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/40' },
    ],
    notes: 'A famous Luminous Blue Variable discovered in 1600 as a temporary 3rd-magnitude "permanent nova".',
  },
  {
    designation: '82 G. Eridani',
    name: '82 G. Eridani',
    system: 'Numbered (Gould)',
    catalogId: '82-g-eridani',
    parts: [
      { segment: '82', role: 'Gould RA Sequence Number', explanation: '82nd star in Eridanus ordered West-to-East by Right Ascension in Gould’s 1879 catalog.', color: 'text-amber-300 bg-amber-950/60 border-amber-500/40' },
      { segment: 'G.', role: 'Gould Catalog Prefix', explanation: 'The "G." explicitly stands for Benjamin Apthorp Gould (Uranometria Argentina), distinguishing it from Flamsteed numbers.', color: 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40' },
      { segment: 'Eridani', role: 'Genitive of Constellation', explanation: 'Latin genitive of Eridanus ("The River").', color: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/40' },
    ],
    notes: 'A bright nearby solar-type dwarf (HD 20794, 19.7 ly) hosting multiple super-Earth exoplanets.',
  },
  {
    designation: '51 Pegasi b',
    name: '51 Pegasi',
    system: 'Exoplanet System',
    catalogId: '51-pegasi',
    parts: [
      { segment: '51', role: 'Flamsteed Number', explanation: 'Ordered west-to-east across the constellation Pegasus by Right Ascension.', color: 'text-sky-300 bg-sky-950/60 border-sky-500/40' },
      { segment: 'Pegasi', role: 'Genitive of Constellation', explanation: 'Latin genitive of Pegasus ("The Winged Horse").', color: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/40' },
      { segment: 'b', role: 'Exoplanet Suffix', explanation: 'Lowercase letter starting at "b" for the first confirmed planet discovered around the host star.', color: 'text-purple-300 bg-purple-950/60 border-purple-500/40' },
    ],
    notes: 'Discovered in 1995 by Mayor & Queloz, marking the first exoplanet confirmed around a Sun-like star.',
  },
  {
    designation: 'PSR B1257+12',
    name: 'Lich Pulsar',
    system: 'Modern Catalog (PSR)',
    catalogId: 'lich-pulsar',
    parts: [
      { segment: 'PSR', role: 'Catalog Acronym', explanation: 'Pulsating Source of Radio.', color: 'text-indigo-300 bg-indigo-950/60 border-indigo-500/40' },
      { segment: 'B', role: 'Equinox Epoch', explanation: 'Indicates coordinates based on Besselian 1950.0 epoch.', color: 'text-slate-300 bg-slate-900 border-slate-700' },
      { segment: '1257', role: 'Right Ascension (RA)', explanation: 'Hours and minutes: 12h 57m.', color: 'text-amber-300 bg-amber-950/60 border-amber-500/40' },
      { segment: '+12', role: 'Declination (Dec)', explanation: 'Degrees north: +12°.', color: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/40' },
    ],
    notes: 'Millisecond pulsar hosting the historic first confirmed exoplanetary system (Draugr, Poltergeist, Phobetor).',
  },
  {
    designation: 'RR Lyrae',
    name: 'RR Lyrae',
    system: 'Variable (Argelander)',
    parts: [
      { segment: 'RR', role: 'Argelander Double Letter', explanation: '10th variable star discovered in Lyra (following R through Z = 9 stars; RR = 10th).', color: 'text-rose-300 bg-rose-950/60 border-rose-500/40' },
      { segment: 'Lyrae', role: 'Genitive of Constellation', explanation: 'Latin genitive of Lyra ("The Harp").', color: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/40' },
    ],
    notes: 'Prototype of RR Lyrae variable stars, widely used as "standard candles" to measure distances to globular clusters.',
  },
];

export interface GreekAlphabetEntry {
  letter: string;
  name: string;
  order: number;
  example: string;
  catalogId: string;
}

export const GREEK_ALPHABET_REFERENCE: GreekAlphabetEntry[] = [
  { letter: 'α', name: 'Alpha', order: 1, example: 'α Canis Majoris (Sirius A)', catalogId: 'sirius-a' },
  { letter: 'β', name: 'Beta', order: 2, example: 'β Orionis (Rigel)', catalogId: 'rigel' },
  { letter: 'γ', name: 'Gamma', order: 3, example: 'γ Orionis (Bellatrix)', catalogId: 'bellatrix' },
  { letter: 'δ', name: 'Delta', order: 4, example: 'δ Orionis (Mintaka)', catalogId: 'mintaka' },
  { letter: 'ε', name: 'Epsilon', order: 5, example: 'ε Orionis (Alnilam)', catalogId: 'alnilam' },
  { letter: 'ζ', name: 'Zeta', order: 6, example: 'ζ Orionis (Alnitak)', catalogId: 'alnitak' },
  { letter: 'η', name: 'Eta', order: 7, example: 'η Carinae A', catalogId: 'eta-carinae-a' },
  { letter: 'θ', name: 'Theta', order: 8, example: 'θ¹ Orionis C (Trapezium)', catalogId: 'theta1-orionis-c' },
  { letter: 'ι', name: 'Iota', order: 9, example: 'ι Antliae', catalogId: 'iota-antliae' },
  { letter: 'κ', name: 'Kappa', order: 10, example: 'κ Orionis (Saiph)', catalogId: 'saiph' },
  { letter: 'λ', name: 'Lambda', order: 11, example: 'λ Scorpii (Shaula)', catalogId: 'shaula' },
  { letter: 'μ', name: 'Mu', order: 12, example: 'μ Cephei (Herschel’s Garnet Star)', catalogId: 'mu-cephei' },
  { letter: 'ν', name: 'Nu', order: 13, example: 'ν Octantis', catalogId: 'nu-octantis' },
  { letter: 'ξ', name: 'Xi', order: 14, example: 'ξ Persei (Menkib)', catalogId: 'menkib' },
  { letter: 'ο', name: 'Omicron', order: 15, example: 'ο Ceti (Mira A)', catalogId: 'mira-a' },
  { letter: 'π', name: 'Pi', order: 16, example: 'π¹ Gruis', catalogId: 'pi1-gruis' },
  { letter: 'ρ', name: 'Rho', order: 17, example: 'ρ Cassiopeiae', catalogId: 'rho-cassiopeiae' },
  { letter: 'σ', name: 'Sigma', order: 18, example: 'σ Octantis (Polaris Australis)', catalogId: 'polaris-australis' },
  { letter: 'τ', name: 'Tau', order: 19, example: 'τ Ceti', catalogId: 'tau-ceti' },
  { letter: 'υ', name: 'Upsilon', order: 20, example: 'υ Scorpii (Lesath)', catalogId: 'lesath' },
  { letter: 'φ', name: 'Phi', order: 21, example: 'φ Cassiopeiae', catalogId: 'phi-cassiopeiae' },
  { letter: 'χ', name: 'Chi', order: 22, example: 'χ Cygni', catalogId: 'chi-cygni' },
  { letter: 'ψ', name: 'Psi', order: 23, example: 'ψ Ursae Majoris (Ta Tsun)', catalogId: 'psi-ursae-majoris' },
  { letter: 'ω', name: 'Omega', order: 24, example: 'ω Sagittarii (Terebellum)', catalogId: 'terebellum-omega' },
];

/**
 * Calculates Argelander designation from 1-based variable star count index
 */
export function calculateArgelanderCode(index: number): {
  code: string;
  phase: string;
  explanation: string;
} {
  if (index <= 0) {
    return {
      code: 'R',
      phase: 'Phase 1: Single Letters',
      explanation: 'First variable star in constellation.',
    };
  }

  // Phase 1: R, S, T, U, V, W, X, Y, Z (9 stars)
  if (index <= 9) {
    const letters = ['R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const letter = letters[index - 1];
    return {
      code: letter,
      phase: 'Phase 1: Single Letters (R–Z)',
      explanation: `Star #${index} uses single Latin letter ${letter}. (Begins at R to avoid collision with Bayer letters A–Q).`,
    };
  }

  // Phase 2: Double Letters R to Z (54 stars)
  const phase1Count = 9;
  let remaining = index - phase1Count;
  const p2Letters = ['R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  for (let i = 0; i < p2Letters.length; i++) {
    const firstLetter = p2Letters[i];
    const combinationsInRow = p2Letters.length - i;
    if (remaining <= combinationsInRow) {
      const secondLetter = p2Letters[i + (remaining - 1)];
      return {
        code: `${firstLetter}${secondLetter}`,
        phase: 'Phase 2: Double Letters (RR–ZZ)',
        explanation: `Star #${index} falls in the 54-star double-letter block (R–Z). First letter is ${firstLetter}, second letter is ${secondLetter}.`,
      };
    }
    remaining -= combinationsInRow;
  }

  // Phase 3: Double Letters A to Q (skipping J) (280 stars)
  const p3Letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'];
  const totalLettersInP3 = p3Letters.length; // 16

  for (let i = 0; i < totalLettersInP3; i++) {
    const firstLetter = p3Letters[i];
    const combinationsInRow = totalLettersInP3 - i;
    if (remaining <= combinationsInRow) {
      const secondLetter = p3Letters[i + (remaining - 1)];
      return {
        code: `${firstLetter}${secondLetter}`,
        phase: 'Phase 3: Double Letters (AA–QZ, no J)',
        explanation: `Star #${index} falls in the 280-star Latin double-letter block. Letter 'J' was deliberately excluded to avoid confusion with 'I' in 19th-century handwriting.`,
      };
    }
    remaining -= combinationsInRow;
  }

  // Phase 4: V-numbers (V335 and beyond)
  return {
    code: `V${index}`,
    phase: 'Phase 4: Numerical V-Designations',
    explanation: `All 334 letter combinations (9 + 54 + 280) have been exhausted. Star #${index} is designated as V${index}.`,
  };
}

export const NOMENCLATURE_QUIZ_QUESTIONS: NomenclatureQuizQuestion[] = [
  {
    id: 1,
    question: 'How did the star "NML Cygni" receive its name?',
    options: [
      'It stands for "Northern Massive Luminosity"',
      'From the initials of its discoverers: Neugebauer, Martz, and Leighton (1965)',
      'From the New Madrid Lunar Observatory survey',
      'From an acronym denoting "Non-Metallic Late-type" spectral signature',
    ],
    correctIndex: 1,
    explanation: 'NML Cygni is an unconventional astronomer-acronym name: it was named directly after the initials of Gerry Neugebauer, D. E. Martz, and Robert B. Leighton (N-M-L), who discovered this colossal red hypergiant in 1965 during the Two-Micron Sky Survey.',
    topic: 'misc',
  },
  {
    id: 2,
    question: 'In modern astronomical catalogs, which catalog contains the largest number of celestial entries by far?',
    options: [
      'Hipparcos (HIP)',
      'Henry Draper Catalogue (HD)',
      'ESA Gaia Mission (~1.81 Billion sources)',
      'Bright Star Catalogue (HR)',
    ],
    correctIndex: 2,
    explanation: 'The European Space Agency’s Gaia space astrometry mission catalogs over 1.81 billion sources with high-precision positions, parallaxes, and proper motions, making it the most extensive astronomical catalog in existence.',
    topic: 'catalogs',
  },
  {
    id: 3,
    question: 'What does the "R" stand for in the super star cluster designation "R136"?',
    options: [
      'Radcliffe Observatory (Magellanic Cloud survey, 1960)',
      'Radio emission peak #136',
      'Rubin Celestial Survey',
      'Rosat X-ray source #136',
    ],
    correctIndex: 0,
    explanation: 'The "R" in R136 stands for the Radcliffe Observatory in South Africa, where Feast, Thackeray, and Wesselink published their 1960 survey of stars in the Magellanic Clouds. R136 was entry #136.',
    topic: 'clusters',
  },
  {
    id: 4,
    question: 'When astronomers discovered close companions in multiple systems using spectroscopy, what secondary naming tier was created?',
    options: [
      'Adding numbers like A1, A2',
      'Adding lowercase letters to uppercase component letters (Aa, Ab, Ba, Bb)',
      'Renaming the system entirely to Flamsteed numbers',
      'Adding Greek subscripts like A_α, A_β',
    ],
    correctIndex: 1,
    explanation: 'In the hierarchical component system, when high-resolution spectroscopy or interferometry splits an existing primary component "A", the close sub-components are designated with lowercase letters: Aa (the primary) and Ab (the close companion).',
    topic: 'exoplanets',
  },
  {
    id: 5,
    question: 'Why are exoplanets named starting with lowercase "b" (e.g. 51 Pegasi b) instead of "a"?',
    options: [
      'Letter "a" is reserved for the host star itself (the primary stellar component)',
      'Because "b" stands for "body" (celestial body)',
      'The IAU protocol adopted a hexadecimal convention where 0–9 precedes letters',
      'In honor of Johannes Kepler’s first publication "Book B"',
    ],
    correctIndex: 0,
    explanation: 'In astronomical hierarchy, uppercase Roman letters denote stars (e.g., Star A). Lowercase letters denote planets, and "a" is strictly reserved for the parent host star itself (e.g. 51 Pegasi a is the star, 51 Pegasi b is the planet).',
    topic: 'exoplanets',
  },
];

/**
 * Educational lore and catalog stars for multiple stars sharing a single Bayer designation
 */
export interface BayerSharedDesignationGroup {
  baseDesignation: string;
  constellation: string;
  phenomenon: string;
  explanation: string;
  stars: {
    catalogId: string;
    designation: string;
    name: string;
    role: string;
  }[];
}

export const BAYER_SHARED_DESIGNATIONS_LORE: BayerSharedDesignationGroup[] = [
  {
    baseDesignation: 'ζ Reticuli (Zeta Reticuli)',
    constellation: 'Reticulum',
    phenomenon: 'Wide Binary Pair with Superscripts',
    explanation: 'Johann Bayer assigned the single Greek letter Zeta to this visual pair, later distinguished by astronomers as ζ¹ Reticuli and ζ² Reticuli. They form a genuine wide physical binary of solar-type yellow dwarf stars separated by ~3,750 AU (~39 light-years from Earth).',
    stars: [
      { catalogId: 'zeta-1-reticuli', designation: 'ζ¹ Reticuli (HD 20766)', name: 'Zeta-1 Reticuli', role: 'Primary G3.5V solar-type dwarf (0.96 M☉)' },
      { catalogId: 'zeta-2-reticuli', designation: 'ζ² Reticuli (HD 20807)', name: 'Zeta-2 Reticuli', role: 'Secondary G2V solar twin with debris disk (0.99 M☉)' },
    ],
  },
  {
    baseDesignation: 'μ Scorpii (Mu Scorpii)',
    constellation: 'Scorpius',
    phenomenon: 'Naked-Eye Optical Pair Sharing Designation',
    explanation: 'A celebrated naked-eye double star in the tail of the Scorpion. Bayer labeled the pair collectively with the letter Mu, subsequently resolved into μ¹ Scorpii (Xamidimura) and μ² Scorpii (Pipirima). μ¹ is an eclipsing binary while μ² is a blue-white B2 giant.',
    stars: [
      { catalogId: 'xamidimura', designation: 'μ¹ Scorpii (HD 151890)', name: 'Xamidimura', role: 'Close eclipsing binary primary (B1.5V + B6.5V)' },
      { catalogId: 'pipirima', designation: 'μ² Scorpii (HD 151985)', name: 'Pipirima', role: 'Subgiant blue star (B2IV) located ~515 ly away' },
    ],
  },
  {
    baseDesignation: 'θ Orionis (Theta Orionis)',
    constellation: 'Orion',
    phenomenon: 'Trapezium Cluster Multiple Designation',
    explanation: 'Bayer assigned Theta to the faint nebula star in Orion’s Sword. Telescopes resolved it into θ¹ Orionis (the historic Trapezium cluster of 4 ultra-massive O- and B-stars) and θ² Orionis (a separate luminous star system 2 arcminutes to the south-east).',
    stars: [
      { catalogId: 'theta1-orionis-c', designation: 'θ¹ Orionis C (HD 37022)', name: 'Theta-1 Orionis C', role: 'The dominant ionizing O6Vp star of the Orion Nebula' },
    ],
  },
  {
    baseDesignation: 'π Gruis (Pi Gruis)',
    constellation: 'Grus',
    phenomenon: 'Spectroscopic & Pulsating Star Pair',
    explanation: 'Bayer labeled two adjacent stars in the Crane as Pi Gruis: π¹ Gruis (an exotic pulsating S-type asymptotic giant star with giant convective cells imaged by ESO’s VLTI) and π² Gruis (a rapidly rotating F-type main sequence star).',
    stars: [
      { catalogId: 'pi1-gruis', designation: 'π¹ Gruis (HD 212087)', name: 'Pi-1 Gruis', role: 'Semi-regular S-star variable with giant convective surface cells' },
    ],
  },
  {
    baseDesignation: 'α Canum Venaticorum (Alpha CVn)',
    constellation: 'Canes Venatici',
    phenomenon: 'Magnetic Prototype Binary Pair',
    explanation: 'Designated Alpha Canum Venaticorum, resolved into α¹ CVn and α² CVn. α² CVn is Cor Caroli ("The Heart of Charles"), the eponymous prototype of chemically peculiar stars with colossal magnetic fields thousands of times stronger than Earth’s.',
    stars: [
      { catalogId: 'cor-caroli', designation: 'α² Canum Venaticorum (HD 112413)', name: 'Cor Caroli', role: 'Prototype Alpha-2 Canum Venaticorum magnetic variable' },
    ],
  },
];

/**
 * Educational lore for the famous Elnath border-case
 */
export const ELNATH_CASE_LORE = {
  starId: 'elnath',
  starName: 'Elnath',
  modernDesignation: 'β Tauri (Beta Tauri / 112 Tauri)',
  historicDualDesignations: ['β Tauri (Beta Tauri in Taurus)', 'γ Aurigae (Gamma Aurigae in Auriga)'],
  constellation: 'Taurus',
  neighborConstellation: 'Auriga',
  spectralType: 'B7 III',
  distanceLy: 134,
  coreLore: `In Ptolemy’s 2nd-century Almagest and Johann Bayer’s 1603 Uranometria, stars sitting directly along the contested boundary between two constellations were shared and assigned dual designations in BOTH figures!

Elnath is the supreme astronomical archetype: it was simultaneously designated Beta Tauri (β Tau, representing the tip of Taurus the Bull’s northern horn) and Gamma Aurigae (γ Aur, representing the right foot of Auriga the Charioteer).

When the International Astronomical Union (IAU) commissioned Belgian astronomer Eugène Delporte in 1930 to draft official, unambiguous constellation boundaries along exact coordinates of Right Ascension and Declination, all dual designations were abolished. Gamma Aurigae was officially stricken from the astronomical canon, leaving Auriga with no Gamma star, and Elnath officially became solely β Tauri (112 Tauri).

A similar famous boundary casualty was Alpheratz (Sirrah), which Bayer cataloged as both α Andromedae and δ Pegasi. The 1930 boundary assigned it to Andromeda, leaving Pegasus without any Delta star to this day!`,
  significance: 'Key historical milestone showing how 1930 IAU boundaries ended ambiguous dual celestial citizenship.',
};

/**
 * Numbered stars showcase items (Flamsteed & Gould)
 */
export interface NumberedStarShowcaseItem {
  id: string;
  title: string;
  system: 'Flamsteed Number' | 'Gould Designation';
  numberStr: string;
  constellation: string;
  significance: string;
}

export const NUMBERED_STARS_SHOWCASE: NumberedStarShowcaseItem[] = [
  {
    id: '51-pegasi',
    title: '51 Pegasi (Helvetios)',
    system: 'Flamsteed Number',
    numberStr: '#51',
    constellation: 'Pegasus',
    significance: 'Historic host star of 51 Pegasi b (Dimidium), the first exoplanet confirmed around a Sun-like star by Mayor & Queloz in 1995 (Nobel Prize 2019).',
  },
  {
    id: '61-cygni-a',
    title: '61 Cygni A (Bessel’s Star)',
    system: 'Flamsteed Number',
    numberStr: '#61',
    constellation: 'Cygnus',
    significance: 'The first star ever to have its physical distance measured via trigonometric parallax (Friedrich Bessel in 1838, ~11.4 light-years).',
  },
  {
    id: '61-cygni-b',
    title: '61 Cygni B',
    system: 'Flamsteed Number',
    numberStr: '#61',
    constellation: 'Cygnus',
    significance: 'K-dwarf binary companion to 61 Cygni A, forming a high-proper-motion system known as Piazzi’s Flying Star.',
  },
  {
    id: '82-g-eridani',
    title: '82 G. Eridani (HD 20794)',
    system: 'Gould Designation',
    numberStr: '82 G.',
    constellation: 'Eridanus',
    significance: '82nd star in Right Ascension in Eridanus from Gould’s Uranometria Argentina; nearby solar twin (19.7 ly) hosting multiple super-Earth exoplanets.',
  },
  {
    id: '15-vulpeculae',
    title: '15 Vulpeculae',
    system: 'Flamsteed Number',
    numberStr: '#15',
    constellation: 'Vulpecula',
    significance: 'A luminous metallic-line Am star exhibiting pronounced spectral enhancements of zinc, strontium, and barium caused by radiative levitation.',
  },
  {
    id: 'praecipua',
    title: '46 Leonis Minoris (Praecipua)',
    system: 'Flamsteed Number',
    numberStr: '#46',
    constellation: 'Leo Minor',
    significance: 'Flamsteed #46 in Leo Minor; Johannes Hevelius created Leo Minor without Bayer Greek letters, making 46 LMi its primary numbered stellar benchmark.',
  },
  {
    id: 'alsciaukat',
    title: '31 Lyncis (Alsciaukat)',
    system: 'Flamsteed Number',
    numberStr: '#31',
    constellation: 'Lynx',
    significance: 'Flamsteed #31 in Lynx; orange giant star in a northern constellation whose stars were assigned Flamsteed numbers rather than Greek letters.',
  },
  {
    id: 'tx-piscium',
    title: '19 Piscium (TX Piscium)',
    system: 'Flamsteed Number',
    numberStr: '#19',
    constellation: 'Pisces',
    significance: 'Flamsteed #19 in Pisces; iconic naked-eye carbon star displaying an intensely deep crimson coloration due to atmospheric carbon molecules.',
  },
  {
    id: 'alcor',
    title: '80 Ursae Majoris (Alcor)',
    system: 'Flamsteed Number',
    numberStr: '#80',
    constellation: 'Ursa Major',
    significance: 'Flamsteed #80 in Ursa Major; famous historic naked-eye visual acuity test companion to Mizar, lacking any Bayer Greek letter.',
  },
  {
    id: '18-scorpii',
    title: '18 Scorpii',
    system: 'Flamsteed Number',
    numberStr: '#18',
    constellation: 'Scorpius',
    significance: 'Closest physical and spectral twin of our Sun in the night sky, matching solar mass, radius, temperature, and magnetic activity cycles.',
  },
  {
    id: '61-virginis',
    title: '61 Virginis (17 G. Virginis)',
    system: 'Flamsteed Number',
    numberStr: '#61',
    constellation: 'Virgo',
    significance: 'Bearing both Flamsteed #61 and Gould 17 G. Vir; naked-eye solar twin hosting 3 super-Earth exoplanets and a prominent Kuiper-belt debris ring.',
  },
  {
    id: '55-cancri',
    title: '55 Cancri (Copernicus)',
    system: 'Flamsteed Number',
    numberStr: '#55',
    constellation: 'Cancer',
    significance: 'Flamsteed #55 (Bayer ρ¹ Cnc); hosts a celebrated 5-planet system featuring ultra-short period lava super-Earth Janssen.',
  },
  {
    id: '47-ursae-majoris',
    title: '47 Ursae Majoris (Chalawan)',
    system: 'Flamsteed Number',
    numberStr: '#47',
    constellation: 'Ursa Major',
    significance: 'Flamsteed #47; pioneer 1996 exoplanetary host harboring true circular-orbit Jupiter analogs.',
  },
  {
    id: '14-g-crateris',
    title: '14 G. Crateris (HD 98800)',
    system: 'Gould Designation',
    numberStr: '14 G.',
    constellation: 'Crater',
    significance: 'Gould designation #14 in Crater from Uranometria Argentina; hosts a spectacular 90-degree misaligned polar protoplanetary disk resolved by ALMA.',
  },
  {
    id: '145-g-hydrae',
    title: '145 G. Hydrae (HD 82943)',
    system: 'Gould Designation',
    numberStr: '145 G.',
    constellation: 'Hydra',
    significance: 'Gould designation #145 in Hydra; contains rare atmospheric Lithium-6 indicating direct planetary ingestion by the host star.',
  },
];

/**
 * Variable stars showcase items across all 4 Argelander phases
 */
export interface VariableStarShowcaseItem {
  id: string;
  name: string;
  designation: string;
  phase: 'Phase 1: R–Z (Single)' | 'Phase 2: RR–ZZ (Double)' | 'Phase 3: AA–QZ (Double)' | 'Phase 4: V-Numbers (V335+)';
  variableType: string;
  constellation: string;
  significance: string;
}

export const VARIABLE_STARS_SHOWCASE: VariableStarShowcaseItem[] = [
  {
    id: 's-doradus',
    name: 'S Doradus',
    designation: 'S Dor',
    phase: 'Phase 1: R–Z (Single)',
    variableType: 'Luminous Blue Variable (LBV)',
    constellation: 'Dorado (LMC)',
    significance: 'Eponymous prototype of S Doradus / LBV variables; one of the most luminous hypergiants in the Magellanic Clouds (~1 million L☉).',
  },
  {
    id: 'r-coronae-borealis',
    name: 'R Coronae Borealis',
    designation: 'R CrB',
    phase: 'Phase 1: R–Z (Single)',
    variableType: 'Carbon-Fade Variable ("Sooty Star")',
    constellation: 'Corona Borealis',
    significance: 'Archetype of R CrB variables; unexpectedly plummets up to 8 magnitudes when carbon soot clouds condense in its outer atmosphere.',
  },
  {
    id: 'uy-scuti',
    name: 'UY Scuti',
    designation: 'UY Sct',
    phase: 'Phase 2: RR–ZZ (Double)',
    variableType: 'Pulsating Red Hypergiant',
    constellation: 'Scutum',
    significance: 'Phase 2 Argelander double letter (38th variable in Scutum); among the largest known red hypergiants with a radius exceeding 1,700 R☉.',
  },
  {
    id: 'vy-canis-majoris',
    name: 'VY Canis Majoris',
    designation: 'VY CMa',
    phase: 'Phase 2: RR–ZZ (Double)',
    variableType: 'Extreme Irregular Red Hypergiant',
    constellation: 'Canis Major',
    significance: 'Phase 2 Argelander variable surrounded by a massive, asymmetric ejecta nebula created by violent convective eruptions.',
  },
  {
    id: 'ky-cygni',
    name: 'KY Cygni',
    designation: 'KY Cyg',
    phase: 'Phase 2: RR–ZZ (Double)',
    variableType: 'Luminous Red Supergiant',
    constellation: 'Cygnus',
    significance: 'Red supergiant radiating roughly 300,000 times the luminosity of the Sun, undergoing slow irregular pulsations.',
  },
  {
    id: 'ah-scorpii',
    name: 'AH Scorpii',
    designation: 'AH Sco',
    phase: 'Phase 3: AA–QZ (Double)',
    variableType: 'Semiregular Pulsating Red Supergiant',
    constellation: 'Scorpius',
    significance: 'Phase 3 Argelander double letter; luminous supergiant with a pulsation period of ~714 days and radius of ~1,411 R☉.',
  },
  {
    id: 'ck-carinae',
    name: 'CK Carinae',
    designation: 'CK Car',
    phase: 'Phase 3: AA–QZ (Double)',
    variableType: 'Semiregular Red Supergiant Variable',
    constellation: 'Carina',
    significance: 'Phase 3 variable undergoing multi-periodic stellar pulsations with heavy mass loss near the Carina Nebula.',
  },
  {
    id: 'v838-monocerotis',
    name: 'V838 Monocerotis',
    designation: 'V838 Mon',
    phase: 'Phase 4: V-Numbers (V335+)',
    variableType: 'Luminous Red Nova (Stellar Merger)',
    constellation: 'Monoceros',
    significance: 'Phase 4 numerical designation (#838 in Monoceros); experienced a catastrophic 2002 outburst illuminating the famous Hubble light echo.',
  },
  {
    id: 'v354-cephei',
    name: 'V354 Cephei',
    designation: 'V354 Cep',
    phase: 'Phase 4: V-Numbers (V335+)',
    variableType: 'Pulsating Red Hypergiant',
    constellation: 'Cepheus',
    significance: '354th variable cataloged in Cepheus; colossal red hypergiant located in the Milky Way plane ~9,000 light-years away.',
  },
  {
    id: 'v766-centauri',
    name: 'V766 Centauri (HR 5171 A)',
    designation: 'V766 Cen',
    phase: 'Phase 4: V-Numbers (V335+)',
    variableType: 'Yellow Hypergiant Contact Binary',
    constellation: 'Centaurus',
    significance: '766th variable cataloged in Centaurus; gargantuan yellow hypergiant in physical contact with a smaller binary companion.',
  },
];

/**
 * Filter helpers for mapping stars from STARS_CATALOG by nomenclature categories
 */
const GREEK_CHARACTERS = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'];
const GREEK_WORDS = [
  'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta',
  'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi',
  'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega',
];

// Helper: Identify neutron stars, pulsars, and magnetars so they never leak into Bayer or Variable sections
export function isNeutronStarOrPulsar(star: StarData): boolean {
  return (
    star.spectralClass === 'NS' ||
    star.stellarStage === 'Neutron Star / Pulsar' ||
    star.name.startsWith('PSR') ||
    star.name.startsWith('SGR') ||
    star.name.startsWith('CXOU') ||
    star.name.startsWith('1E ') ||
    star.name.startsWith('1RXS') ||
    star.name.includes('Pulsar') ||
    star.name.includes('Magnetar') ||
    star.spectralType.includes('NS') ||
    (star.alternateNames || []).some(
      (a) => a.startsWith('PSR') || a.startsWith('SGR') || a.includes('Pulsar') || a.includes('Magnetar')
    )
  );
}

// 1. Strict Bayer designation check (Greek letters): NEVER matches neutron stars, pulsars, or astrophysical gamma rays
export function hasBayerGreekDesignation(star: StarData): boolean {
  if (isNeutronStarOrPulsar(star)) {
    return false;
  }

  // If explicit bayerDesignation is set on star record
  if (star.bayerDesignation && GREEK_CHARACTERS.some((g) => star.bayerDesignation?.includes(g))) {
    return true;
  }

  const allNames = [star.name, ...(star.alternateNames || [])];
  for (const n of allNames) {
    if (GREEK_CHARACTERS.some((g) => n.includes(g))) return true;
    for (const w of GREEK_WORDS) {
      // Must not match Gamma-Ray, Gamma Ray, Gamma Source, or Soft Gamma Repeater
      const r = new RegExp('\\b' + w + '(?!-Ray|\\s+Ray|\\s+Source|\\s+Repeater)\\b', 'i');
      if (r.test(n)) return true;
    }
  }
  return false;
}

// 2. Strict Variable star designation check: ONLY stars with formal Argelander / GCVS designations:
// (R-Z, RR-ZZ, AA-QZ, Vxxx [constellation genitive])
const FORMAL_VAR_REGEX = /\b(V\d{2,4}|[R-Z]|[R-Z]{2}|[A-Q][A-Z])\s+(Andromedae|Antliae|Apodis|Aquarii|Aquilae|Arae|Arietis|Aurigae|Bootis|Caeli|Camelopardalis|Cancri|Canum\s+Venaticorum|Canis\s+Majoris|Canis\s+Minoris|Capricorni|Carinae|Cassiopeiae|Centauri|Cephei|Ceti|Chamaeleontis|Circini|Columbae|Comae\s+Berenices|Coronae\s+Australis|Coronae\s+Borealis|Corvi|Crateris|Crucis|Cygni|Delphini|Doradus|Draconis|Equulei|Eridani|Fornacis|Geminorum|Gruis|Herculis|Horologii|Hydrae|Hydri|Indi|Lacertae|Leonis|Leonis\s+Minoris|Leporis|Librae|Lupi|Lyncis|Lyrae|Mensae|Microscopii|Monocerotis|Muscae|Normae|Octantis|Ophiuchi|Orionis|Pavonis|Pegasi|Persei|Phoenicis|Pictoris|Piscium|Piscis\s+Austrini|Puppis|Pyxidis|Reticuli|Sagittae|Sagittarii|Scorpii|Sculptoris|Scuti|Serpentis|Sextantis|Tauri|Telescopii|Trianguli|Trianguli\s+Australis|Tucanae|Ursae\s+Majoris|Ursae\s+Minoris|Velae|Virginis|Volantis|Vulpeculae|[A-Z][a-z]+)\b/;

export function isFormalVariableDesignation(star: StarData): boolean {
  if (hasBayerGreekDesignation(star)) return false;
  if (isNeutronStarOrPulsar(star)) {
    return false;
  }

  const allNames = [star.name, ...(star.alternateNames || [])];
  return allNames.some((n) => FORMAL_VAR_REGEX.test(n) && !n.includes('PSR') && !n.includes('SGR') && !n.includes('Soft Gamma'));
}

// 3. Numbered stars (Flamsteed numbers & Gould designations without Bayer)
const FLAMSTEED_GOULD_REGEX = /\b(\d+\s+(Andromedae|Antliae|Apodis|Aquarii|Aquilae|Arae|Arietis|Aurigae|Bootis|Caeli|Camelopardalis|Cancri|Canum\s+Venaticorum|Canis\s+Majoris|Canis\s+Minoris|Capricorni|Carinae|Cassiopeiae|Centauri|Cephei|Ceti|Chamaeleontis|Circini|Columbae|Comae\s+Berenices|Coronae\s+Australis|Coronae\s+Borealis|Corvi|Crateris|Crucis|Cygni|Delphini|Doradus|Draconis|Equulei|Eridani|Fornacis|Geminorum|Gruis|Herculis|Horologii|Hydrae|Hydri|Indi|Lacertae|Leonis|Leonis\s+Minoris|Leporis|Librae|Lupi|Lyncis|Lyrae|Mensae|Microscopii|Monocerotis|Muscae|Normae|Octantis|Ophiuchi|Orionis|Pavonis|Pegasi|Persei|Phoenicis|Pictoris|Piscium|Piscis\s+Austrini|Puppis|Pyxidis|Reticuli|Sagittae|Sagittarii|Scorpii|Sculptoris|Scuti|Serpentis|Sextantis|Tauri|Telescopii|Trianguli|Trianguli\s+Australis|Tucanae|Ursae\s+Majoris|Ursae\s+Minoris|Velae|Virginis|Volantis|Vulpeculae|[A-Z][a-z]+)|\d+\s+G\.\s+[A-Z][a-z]+)\b/i;

export function isNumberedFlamsteedGould(star: StarData): boolean {
  if (hasBayerGreekDesignation(star)) return false;
  if (isFormalVariableDesignation(star)) return false;
  if (isNeutronStarOrPulsar(star)) return false;

  const allNames = [star.name, ...(star.alternateNames || [])];
  return allNames.some((n) => FLAMSTEED_GOULD_REGEX.test(n));
}

// 4. Cluster & Extragalactic specific designations (without Bayer)
export function isClusterOrExtragalacticDesignation(star: StarData): boolean {
  if (hasBayerGreekDesignation(star)) return false;
  const allNames = [star.name, ...(star.alternateNames || [])];
  return allNames.some((a) =>
    /^(R136|VFTS|Sanduleak|Stephenson|Westerlund|Melnick|Hodge|BAT99|LH\s+\d+|LGGS|M31|M33|SXP|CXOU\s+J1647|AF\s+And|WOH|AzV|SMC|LMC|Sk\s+-|HD\s+5980|MSX\s+LMC|RSGC|GCIRS|IRS\s+7|MACS|WHL|HV\s+888)/i.test(a)
  );
}

// 5. Modern survey catalogs (without Bayer, variable, numbered, or cluster)
export function isModernCatalogDesignation(star: StarData): boolean {
  if (hasBayerGreekDesignation(star)) return false;
  if (isFormalVariableDesignation(star)) return false;
  if (isNumberedFlamsteedGould(star)) return false;
  if (isClusterOrExtragalacticDesignation(star)) return false;

  const allNames = [star.name, ...(star.alternateNames || [])];
  return allNames.some((a) =>
    /^(HD|HDE|HIP|HR|GJ|Gliese|2MASS|WISE|SDSS|Kepler|KOI|K2|PSR|WR|LBV|NGC|LHS|Wolf|Ross|DENIS|BPM|WD|LP|SGR|1E|RX|IRC|RAFGL|AFGL|GSC|IRAS|SO|SCR|EBLM|TIC|TOI|KIC|EPIC|TYC|BD|CD|CPD|EGGR|1RXS|CXOU|CXOGCS|4U|Sco\s+X|USNO)/i.test(a) ||
    /^[A-Za-z]{3,4}\s+X-\d+/i.test(a)
  );
}

export function getMappedGreekStars(catalog: StarData[]): StarData[] {
  return catalog.filter((star) => hasBayerGreekDesignation(star));
}

export function getMappedNumberedStars(catalog: StarData[]): StarData[] {
  return catalog.filter((star) => isNumberedFlamsteedGould(star));
}

export function getMappedVariableStars(catalog: StarData[]): StarData[] {
  return catalog.filter((star) => isFormalVariableDesignation(star));
}

export function getMappedCatalogPrimaryStars(catalog: StarData[]): StarData[] {
  return catalog.filter((star) => isModernCatalogDesignation(star));
}

export function getMappedClusterExtragalacticStars(catalog: StarData[]): StarData[] {
  return catalog.filter((star) => isClusterOrExtragalacticDesignation(star));
}

// 6. Strict IAU-designated and non-miscellaneous traditional proper names
const IAU_APPROVED_PROPER_NAMES: Set<string> = new Set([
  'Acamar', 'Achernar', 'Achird', 'Acrab', 'Acrux', 'Acubens', 'Adhara', 'Ain', 'Aladfar', 'Alasia',
  'Albaldah', 'Albali', 'Albireo', 'Alchiba', 'Alcor', 'Alcyone', 'Aldebaran', 'Alderamin', 'Aldhanab',
  'Aldhibah', 'Alfirk', 'Algedi', 'Algenib', 'Algieba', 'Algol', 'Algorab', 'Alioth', 'Alkaid',
  'Alkalurops', 'Alkaphrah', 'Alkarab', 'Alkes', 'Almaaz', 'Almach', 'Alnair', 'Alnasl', 'Alnilam',
  'Alnitak', 'Alniyat', 'Alphard', 'Alphecca', 'Alphekka', 'Alpheratz', 'Alpherg', 'Alrakis', 'Alrescha',
  'Alruba', 'Alsafi', 'Alsciaukat', 'Alsephina', 'Alshain', 'Alshat', 'Altair', 'Altais', 'Alterf',
  'Aludra', 'Alula Australis', 'Alula Borealis', 'Alya', 'Alzirr', 'Amadioha', 'Ancha', 'Ankaa',
  'Anser', 'Antares', 'Arcalís', 'Arcturus', 'Arkab Posterior', 'Arkab Prior', 'Arneb', 'Ascella',
  'Asellus Australis', 'Asellus Borealis', 'Asellus Primus', 'Asellus Secundus', 'Asellus Tertius',
  'Ashlesha', 'Aspidiske', 'Asterope', 'Atik', 'Atlas', 'Atria', 'Avior', 'Azelfafage', 'Azmidi',
  'Baekdu', 'Baten Kaitos', 'Beid', 'Bellatrix', 'Betelgeuse', 'Betria', 'Biham', 'Botein', 'Brachium',
  'Bubup', 'Bunya', 'Cancrids', 'Canopus', 'Capella', 'Caph', 'Castor', 'Castula', 'Cebalrai', 'Ceibo',
  'Celaeno', 'Cervantes', 'Chalawan', 'Chamukuy', 'Chaophraya', 'Chara', 'Chertan', 'Citadelle', 'Citalá',
  'Cocibolca', 'Copernicus', 'Cor Caroli', 'Cujam', 'Cursa', 'Dabih', 'Dalim', 'Deneb', 'Deneb Algedi',
  'Denebola', 'Diadem', 'Dingolay', 'Diphda', 'Diwo', 'Dombay', 'Dschubba', 'Dubhe', 'Dziban', 'Ebla',
  'Edasich', 'Electra', 'Elgafar', 'Elkurud', 'Elnath', 'Eltanin', 'Enif', 'Errai', 'Fafnir', 'Fang',
  'Fawaris', 'Funi', 'Furud', 'Fuyue', 'Gacrux', 'Gakyid', 'Ginan', 'Gienah', 'Gloas', 'Gomeisa',
  'Graffias', 'Grumium', 'Gudja', 'Gumala', 'Hadar', 'Haedus', 'Hamal', 'Han', 'Hassaleh', 'Hatysa',
  'Helvetios', 'Heze', 'Hoggar', 'Homam', 'Horna', 'Iklil', 'Illyrian', 'Imai', 'Inquill', 'Intan',
  'Intercrus', 'Irena', 'Itonda', 'Izar', 'Jabbah', 'Jishui', 'Kalausi', 'Kamuy', 'Kaveh', 'Keid',
  'Khambalia', 'Kitalpha', 'Kochab', 'Kornephoros', 'Kraz', 'Kurhah', 'La Superba', 'Labrum', 'Larawag',
  'Lerna', 'Lesath', 'Libertas', 'Lilian', 'Lucilinburhuc', 'Lusitânia', 'Maasym', 'Mahasim', 'Maia',
  'Malmok', 'Marfak', 'Marfik', 'Markab', 'Markeb', 'Matar', 'Mazaalai', 'Mebsuta', 'Megrez', 'Meissa',
  'Mekbuda', 'Meleph', 'Menkalinan', 'Menkar', 'Menkent', 'Menkib', 'Merak', 'Merga', 'Meridiana',
  'Merope', 'Mesarthim', 'Miaplacidus', 'Mimosa', 'Minchir', 'Minelauva', 'Mintaka', 'Mira', 'Mirach',
  'Miram', 'Mirfak', 'Mirzam', 'Misam', 'Mizar', 'Moldoveanu', 'Montuno', 'Morava', 'Morkhor',
  'Motekhalleb', 'Mouhoun', 'Moziah', 'Mpingo', 'Muliphein', 'Muphrid', 'Muscida', 'Musica', 'Muspelheim',
  'Nahn', 'Naledi', 'Naos', 'Nashira', 'Nasti', 'Natrun', 'Nembus', 'Nenque', 'Nihal', 'Nofa',
  'Nukatai', 'Nunki', 'Nusakan', 'Ogma', 'Okab', 'Paikauhale', 'Parumleo', 'Peep', 'Peacock', 'Petra',
  'Phact', 'Phecda', 'Pherkad', 'Phoenicia', 'Phryxus', 'Piautos', 'Pipirima', 'Pleione', 'Poerava',
  'Polaris', 'Polaris Australis', 'Polis', 'Pollux', 'Porrima', 'Praecipua', 'Procyon', 'Propus',
  'Proxima Centauri', 'Ran', 'Rapeto', 'Rasalas', 'Rasalgethi', 'Rasalhague', 'Rastaban', 'Regor',
  'Regulus', 'Revati', 'Rigel', 'Rigil Kentaurus', 'Rosíade', 'Rotanev', 'Ruchbah', 'Rukbat', 'Sabik',
  'Sadachbia', 'Sadalbari', 'Sadalmelik', 'Sadalsuud', 'Sadatoni', 'Sadr', 'Saiph', 'Salm', 'Samaya',
  'Sansuna', 'Sargas', 'Sarin', 'Sceptrum', 'Scheat', 'Schedar', 'Secunda Hyadum', 'Segin', 'Seginus',
  'Sham', 'Shama', 'Sharatan', 'Sheratan', 'Shaula', 'Sheliak', 'Sigma Octantis', 'Sinistra', 'Sirius',
  'Situla', 'Skat', 'Solaris', 'Spica', 'Sterope', 'Sualocin', 'Subra', 'Suhail', 'Sulafat', 'Sun', 'Sol',
  'Syrma', 'Tabit', 'Taika', 'Taiyangshou', 'Taiyi', 'Talitha', 'Tangra', 'Tapecue', 'Tara', 'Tarazed',
  'Tarf', 'Taygeta', 'Tegmine', 'Tejat', 'Terebellum', 'Tevel', 'Theemin', 'Thuban', 'Tiaki',
  'Tianguan', 'Tianyi', 'Timir', 'Tislit', 'Titawin', 'Toojil', 'Toliman', 'Tonatiuh', 'Torcular',
  'Tuiren', 'Tupã', 'Tureis', 'Ukdah', 'Unukalhai', 'Uruk', 'Varun', 'Vega', 'Veritate', 'Vindemiatrix',
  'Wasat', 'Wazn', 'Wezen', 'Wurren', 'Xamidimura', 'Xihe', 'Xuange', 'Yed Posterior', 'Yed Prior',
  'Yildun', 'Zaniah', 'Zaurak', 'Zavijava', 'Zhang', 'Zibal', 'Zosma', 'Zubenelgenubi', 'Zubenelhakrabi',
  'Zubeneschamali', 'Zubenhakrabi',
  // Non-miscellaneous recognized astronomical eponyms / classic non-misc proper names:
  'Barnard’s Star', "Barnard's Star", 'Kapteyn’s Star', "Kapteyn's Star", 'Van Maanen’s Star', "Van Maanen's Star",
  'Teegarden’s Star', "Teegarden's Star", 'Luyten’s Star', "Luyten's Star"
]);

// Exclude stars that are specifically classified under Miscellaneous Monikers, Lensed, or Pulsars:
const EXCLUDED_MISCELLANEOUS_MONIKER_IDS: Set<string> = new Set([
  'pistol-star', 'methuselah-star', 'nml-cygni', 'mu-cephei', 'godzilla', 'earendel', 'mothra',
  'calvera', 'lich-pulsar', '61-cygni-a', '61-cygni-b', 'r-leporis', 'v838-monocerotis',
  'sanduleak-2-73', 'stephenson-2-18', 'westerlund-1-26', 'r136a1', 'r136a2', 'r136a3', 'r136c'
]);

export function hasTraditionalProperName(star: StarData): boolean {
  if (EXCLUDED_MISCELLANEOUS_MONIKER_IDS.has(star.id)) return false;
  if (isNeutronStarOrPulsar(star)) return false;

  // Clean suffix (e.g. "Sirius A" -> "Sirius", "Capella Aa" -> "Capella")
  const cleanName = star.name.replace(/\s+(A|B|C|Aa|Ab|Ba|Bb|C|D|E|\d+)\b/g, '').trim();
  const parenMatch = star.name.match(/^([^(]+)\s*\(([^)]+)\)/);

  if (IAU_APPROVED_PROPER_NAMES.has(star.name) || IAU_APPROVED_PROPER_NAMES.has(cleanName)) {
    return true;
  }
  if (parenMatch) {
    const p1 = parenMatch[1].trim().replace(/\s+(A|B|C|Aa|Ab|Ba|Bb)\b/g, '');
    const p2 = parenMatch[2].trim().replace(/\s+(A|B|C|Aa|Ab|Ba|Bb)\b/g, '');
    if (IAU_APPROVED_PROPER_NAMES.has(p1) || IAU_APPROVED_PROPER_NAMES.has(p2)) {
      return true;
    }
  }
  for (const alt of star.alternateNames || []) {
    const cleanAlt = alt.replace(/\s+(A|B|C|Aa|Ab|Ba|Bb)\b/g, '').trim();
    if (IAU_APPROVED_PROPER_NAMES.has(alt) || IAU_APPROVED_PROPER_NAMES.has(cleanAlt)) {
      return true;
    }
  }
  return false;
}

export function getMappedProperNameStars(catalog: StarData[]): StarData[] {
  return catalog.filter((star) => hasTraditionalProperName(star));
}


