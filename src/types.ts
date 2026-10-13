export type SpectralClass = 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M' | 'C' | 'S' | 'L' | 'T' | 'Y' | 'WR' | 'WD' | 'NS' | 'LBV';

export type StellarStage =
  | 'Red Hypergiant'
  | 'Red Supergiant'
  | 'Yellow Hypergiant'
  | 'Yellow Supergiant'
  | 'Blue Supergiant'
  | 'Blue Giant'
  | 'Red Giant'
  | 'Bright Giant'
  | 'Subgiant'
  | 'Subdwarf'
  | 'Blue Straggler'
  | 'Carbon Star'
  | 'S-Type Star'
  | 'Main Sequence'
  | 'Main Sequence Dwarf'
  | 'Red Dwarf'
  | 'Brown Dwarf'
  | 'White Dwarf'
  | 'Neutron Star / Pulsar'
  | 'Wolf-Rayet'
  | 'Luminous Blue Variable'
  | 'Contact Binary'
  | 'Thorne–Żytkow Object'
  | 'Stellar Black Hole';

export interface ExoplanetRecord {
  name: string;
  type: string; // e.g. 'Gas Giant', 'Super-Earth', 'Terrestrial / Earth-Analogue', 'Sub-Neptune', 'Hot Jupiter', 'Ice Giant', 'Pulsar Planet'
  mass?: string; // e.g. '1.00 M⊕ (Earth Mass)', '1.17 M_J (Jupiter Mass)'
  radius?: string; // e.g. '1.00 R⊕', '1.24 R_J'
  orbitalPeriodDays?: number; // e.g. 11.186 days, 365.25 days
  semiMajorAxisAU?: number; // e.g. 0.0485 AU
  habitableZoneStatus?: 'Inner Rim' | 'Outer Rim' | 'Conservative Habitable Zone' | 'Optimistic Habitable Zone' | 'Too Hot' | 'Too Cold' | 'Beyond Ice Line';
  discoveryYear?: number;
  discoveryMethod?: 'Radial Velocity' | 'Transit' | 'Direct Imaging' | 'Gravitational Microlensing' | 'Pulsar Timing' | 'Astrometry' | 'Theoretical / Direct Solar';
  confirmed: boolean;
  description?: string;
}

export interface ExoplanetSystem {
  hasExoplanets: boolean;
  confirmedCount: number;
  candidateCount?: number;
  debrisDisk?: boolean;
  debrisDiskDescription?: string;
  planets: ExoplanetRecord[];
  systemOverview: string;
}

export interface StarData {
  id: string;
  name: string;
  alternateNames: string[];
  bayerDesignation?: string;
  flamsteedDesignation?: string;
  gouldDesignation?: string;
  constellation: string;
  // Size metrics
  diameterSolar: number; // in Solar Diameters (1 D_sun = 1,392,700 km)
  diameterKm: number;
  diameterAU: number; // 1 AU = 149,597,870.7 km -> (diameterKm / 149597870.7)
  
  // Physical and spectral properties
  temperature: number; // Kelvin
  spectralType: string; // e.g. "M1-2Ia-ab", "G2V", "A1V"
  spectralClass: SpectralClass;
  luminositySolar: number; // in Solar Luminosities (1 L_sun = 3.828 × 10^26 W)
  massSolar: number; // in Solar Masses (1 M_sun = 1.989 × 10^30 kg)
  estimatedAge: string; // e.g. "4.6 Billion Years", "8.5 Million Years"
  estimatedAgeMyr: number; // numeric age in Million Years for sorting & computation (e.g. 4600 for Sun)
  metallicityFeH?: number; // [Fe/H] relative to Sun (0.00 for Sun)
  rotationalVelocityKmS?: number; // Equatorial rotation velocity in km/s
  rotationalPeriodDays?: number; // Stellar rotation period in Earth days
  rotationalPeriodHours?: number; // Stellar rotation period in hours (for rapid rotators)
  rotationalPeriodFormatted?: string; // Formatted display string (e.g. "25.38 Days", "8.0 Hours")
  distanceLy: number; // Light years
  distanceParsecs: number; // Parsecs
  apparentMagnitude: number; // m
  absoluteMagnitude: number; // M
  surfaceGravityLogG: number; // log(g in cm/s^2)
  
  // Visuals & aesthetics
  colorHex: string; // Photosphere base color
  coronaColorHex: string; // Outer glow color
  
  // Solar System context
  solarEngulfment: string;
  engulfsPlanets: string[]; // e.g. ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter']
  habitableZoneAU: {
    inner: number;
    outer: number;
  };
  
  // Exoplanetary Architecture
  exoplanetSystem: ExoplanetSystem;

  // Astrophysical details
  stellarStage: StellarStage;
  lifespanEstimate: string;
  futureFate: string;
  fusionProcess: string;
  notableFacts: string[];
  description: string;
}

export type StageSortKey = 'size' | 'distance' | 'mass' | 'temperature' | 'luminosity' | 'apparentMagnitude';
export type SortDirection = 'asc' | 'desc';

export interface PresetComparison {
  id: string;
  title: string;
  starIds: string[];
  desc: string;
  isCustom?: boolean;
  defaultSortKey?: StageSortKey;
  defaultSortDirection?: SortDirection;
}

export type ViewMode = '3d-comparator' | 'hr-diagram' | 'catalog';

export type TourLength = 'short' | 'medium' | 'long';

export interface FilterState {
  searchQuery: string;
  constellation: string;
  spectralClasses: SpectralClass[];
  stellarStages: StellarStage[];
  minDiameter: number;
  maxDiameter: number;
  minTemp: number;
  maxTemp: number;
  minDistance: number;
  maxDistance: number;
  sortBy:
    | 'diameter-desc'
    | 'diameter-asc'
    | 'temp-desc'
    | 'temp-asc'
    | 'distance-asc'
    | 'distance-desc'
    | 'luminosity-desc'
    | 'luminosity-asc'
    | 'mass-desc'
    | 'mass-asc'
    | 'exoplanets-desc'
    | 'age-desc'
    | 'age-asc'
    | 'name-asc';
  onlyNakedEye: boolean;
  hasExoplanetsOnly: boolean;
}
