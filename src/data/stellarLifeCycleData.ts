// Astrophysics dataset and mathematical models for the 2D Stellar Life Cycle Slider Simulator

export interface LifeCycleCheckpoint {
  progress: number; // 0.0 to 1.0 along the life cycle timeline
  timeElapsedLabel: string; // e.g., "0 Myr", "4.6 Gyr", "10.0 Gyr", "10.02 Gyr", "50 Gyr", "10^15 yr"
  ageYears: number; // Numerical age in years for continuous timeline interpolation
  stageName: string;
  category: 'nursery' | 'protostar' | 'main-sequence' | 'giant' | 'explosion' | 'remnant' | 'final';
  surfaceTempKelvin: number;
  coreTempKelvin: number;
  radiusSolar: number; // in solar radii (1.0 = Sun)
  luminositySolar: number; // in solar luminosities (1.0 = Sun)
  spectralClassEquivalent: string; // e.g. "G2 V", "M2 III", "WD (Class VII)", "NS", "BH"
  colorHex: string;
  glowColorHex: string;
  coreEngine: string;
  dominantPressure: string; // e.g. "Hydrostatic Gas & Radiation", "Radiation Pressure", "Electron Degeneracy", "Neutron Degeneracy", "Infinite Gravitational Singularity"
  shortDescription: string;
  detailedPhysics: string;
  keyPhenomena: string[];
  analogousStarIds: string[]; // Catalog star IDs that represent this state
  // Visual render directives
  visualType:
    | 'nebula'
    | 'protostar'
    | 'star'
    | 'giant'
    | 'planetary-nebula'
    | 'supernova'
    | 'hypernova'
    | 'pulsar'
    | 'cold-neutron-star'
    | 'black-hole'
    | 'cooling-white-dwarf'
    | 'black-dwarf';
  nebulaOpacity?: number;
  explosionExpansion?: number; // 0 to 1
  coolingStage?: 'blue-white' | 'white' | 'yellow' | 'orange' | 'red' | 'dark-red' | 'black-dwarf';
}

export interface StellarTrack {
  id: string;
  name: string;
  massLabel: string;
  initialMassSolar: number;
  typicalLifespan: string;
  fateSummary: string;
  accentColor: string;
  description: string;
  checkpoints: LifeCycleCheckpoint[];
}

export const STELLAR_TRACKS: StellarTrack[] = [
  // =========================================================================
  // TRACK 1: LOW-MASS RED DWARF (0.08 to 0.5 M☉ - Proxima Centauri, TRAPPIST-1)
  // =========================================================================
  {
    id: 'low-mass',
    name: 'Low-Mass Red Dwarf',
    massLabel: '0.08 to 0.5 Solar Masses (e.g. Proxima Centauri 0.12 M☉)',
    initialMassSolar: 0.15,
    typicalLifespan: '100 Billion to 10 Trillion Years!',
    fateSummary: 'Theoretical Blue Dwarf transition -> Cooling White Dwarf -> Black Dwarf (Never Explodes)',
    accentColor: '#f43f5e',
    description:
      'The cosmic ultra-marathon runners. Because they are fully convective, they slowly circulate and burn 100% of their hydrogen fuel over trillions of years without ever swelling into a red giant or exploding.',
    checkpoints: [
      {
        progress: 0.0,
        timeElapsedLabel: '0 Years',
        ageYears: 0,
        stageName: 'Small Molecular Cloud Clump Infall',
        category: 'nursery',
        surfaceTempKelvin: 10,
        coreTempKelvin: 10,
        radiusSolar: 10000,
        luminositySolar: 0.0001,
        spectralClassEquivalent: 'Low-Mass Clump',
        colorHex: '#f43f5e',
        glowColorHex: '#e11d48',
        coreEngine: 'Gentle Jeans Instability Collapse',
        dominantPressure: 'Thermal Gas Pressure',
        shortDescription: 'A small pocket of cool molecular gas slowly contracts under low gravity.',
        detailedPhysics:
          'With minimal mass, gravitational collapse is gentle and leisurely, taking upwards of 100 million years to contract into an embryonic brown or red dwarf core.',
        keyPhenomena: ['Slow Contraction', 'Low Jeans Density', 'Minimal Turbulence'],
        analogousStarIds: [],
        visualType: 'nebula',
        nebulaOpacity: 0.8,
      },
      {
        progress: 0.18,
        timeElapsedLabel: '150 Million Years',
        ageYears: 150_000_000,
        stageName: 'Slowly Contracting Low-Mass Protostar',
        category: 'protostar',
        surfaceTempKelvin: 2800,
        coreTempKelvin: 3000000,
        radiusSolar: 0.8,
        luminositySolar: 0.05,
        spectralClassEquivalent: 'Late M Protostar',
        colorHex: '#fb7185',
        glowColorHex: '#f43f5e',
        coreEngine: 'Slow Gravitational Infall (Approaching Core Fusion)',
        dominantPressure: 'Full Convective Gas Pressure',
        shortDescription: 'The core inches toward the 3 million Kelvin ignition mark for proton-proton fusion.',
        detailedPhysics:
          'The star is 100% convective throughout its entire volume. Heat is efficiently carried to the surface by buoyant gas bubbles.',
        keyPhenomena: ['Full Convection', 'Protostellar Flares', 'Low Accretion Rate'],
        analogousStarIds: [],
        visualType: 'protostar',
      },
      {
        progress: 0.5,
        timeElapsedLabel: '5 Trillion Years',
        ageYears: 5_000_000_000_000,
        stageName: 'Fully Convective Red Dwarf (Class M V)',
        category: 'main-sequence',
        surfaceTempKelvin: 3050,
        coreTempKelvin: 8000000,
        radiusSolar: 0.18,
        luminositySolar: 0.0017,
        spectralClassEquivalent: 'M5.5 V',
        colorHex: '#f87171',
        glowColorHex: '#ef4444',
        coreEngine: 'Leisurely p-p Chain Fusion with 100% Fuel Circulation',
        dominantPressure: 'Hydrostatic Equilibrium (Convective Gas)',
        shortDescription:
          'The star burns its hydrogen with extreme frugality. Convection circulates fresh hydrogen from the surface directly into the core, allowing it to burn for up to 10 trillion years.',
        detailedPhysics:
          'Unlike solar-mass stars that leave 90% of their hydrogen unburned outside the core, red dwarfs consume nearly 100% of their initial hydrogen fuel reserve.',
        keyPhenomena: ['Superflares', 'Trillion-Year Stability', '100% Convective Fuel Efficiency'],
        analogousStarIds: ['proxima-centauri', 'barnards-star', 'trappist-1'],
        visualType: 'star',
      },
      {
        progress: 0.72,
        timeElapsedLabel: '9 Trillion Years',
        ageYears: 9_000_000_000_000,
        stageName: 'Blue Dwarf Phase (Theoretical Post-MS)',
        category: 'giant',
        surfaceTempKelvin: 6500,
        coreTempKelvin: 16000000,
        radiusSolar: 0.12,
        luminositySolar: 0.015,
        spectralClassEquivalent: 'Blue Dwarf (Theoretical)',
        colorHex: '#93c5fd',
        glowColorHex: '#60a5fa',
        coreEngine: 'Exhaustion of Final Hydrogen without Helium Flash',
        dominantPressure: 'Radiation + Gas Pressure (No Giant Swell)',
        shortDescription:
          'As hydrogen fuel drops below 10%, the star contracts and heats up to a dazzling blue without ever expanding into a swollen red giant.',
        detailedPhysics:
          'Because the mass is too low to ignite helium fusion, it cannot undergo a helium flash or AGB expansion. It simply grows hotter and bluer as its mean molecular weight increases.',
        keyPhenomena: ['No Red Giant Expansion', 'Direct Heating to Blue', 'Calm Fuel Depletion'],
        analogousStarIds: [],
        visualType: 'star',
      },
      {
        progress: 0.85,
        timeElapsedLabel: '10 Trillion Years',
        ageYears: 10_000_000_000_000,
        stageName: 'Helium White Dwarf (Cooling Stage)',
        category: 'remnant',
        surfaceTempKelvin: 8000,
        coreTempKelvin: 1000000,
        radiusSolar: 0.015,
        luminositySolar: 0.0005,
        spectralClassEquivalent: 'Helium White Dwarf',
        colorHex: '#e2e8f0',
        glowColorHex: '#cbd5e1',
        coreEngine: 'Zero Fusion — Cooling Degenerate Helium Core',
        dominantPressure: 'Electron Degeneracy Pressure',
        shortDescription:
          'Fusion ceases peacefully without any supernova or planetary nebula. An Earth-sized sphere of degenerate helium begins cooling.',
        detailedPhysics:
          'Because core temperatures never reached the 100 million Kelvin required for the triple-alpha process, this white dwarf is composed almost entirely of helium rather than carbon-oxygen.',
        keyPhenomena: ['Helium Degeneracy', 'Gentle Transition', 'Trillion-Year Cooling Journey'],
        analogousStarIds: [],
        visualType: 'cooling-white-dwarf',
        coolingStage: 'white',
      },
      {
        progress: 0.94,
        timeElapsedLabel: '50 Trillion Years',
        ageYears: 50_000_000_000_000,
        stageName: 'Cooling Helium Dwarf (Yellow -> Orange -> Dark Red)',
        category: 'remnant',
        surfaceTempKelvin: 2000,
        coreTempKelvin: 50000,
        radiusSolar: 0.014,
        luminositySolar: 0.00001,
        spectralClassEquivalent: 'Cool Helium Dwarf',
        colorHex: '#ea580c',
        glowColorHex: '#9a3412',
        coreEngine: 'Zero Fusion — Faint Infrared Glow',
        dominantPressure: 'Electron Degeneracy Pressure',
        shortDescription:
          'Scrubbing through yellow, orange, and dark red as the helium white dwarf slowly exhausts its thermal reservoir into the dark cosmos.',
        detailedPhysics:
          'Cooling slowly across dozens of trillions of years, drifting toward absolute zero.',
        keyPhenomena: ['Deep Thermal Crystallization', 'Universal Cold Era', 'Dim Crimson Ember'],
        analogousStarIds: [],
        visualType: 'cooling-white-dwarf',
        coolingStage: 'orange',
      },
      {
        progress: 1.0,
        timeElapsedLabel: '10^16 Years',
        ageYears: 1e16,
        stageName: 'Helium Black Dwarf (Final Form)',
        category: 'final',
        surfaceTempKelvin: 1.5,
        coreTempKelvin: 2,
        radiusSolar: 0.013,
        luminositySolar: 0.0,
        spectralClassEquivalent: 'Helium Black Dwarf',
        colorHex: '#020617',
        glowColorHex: '#0f172a',
        coreEngine: 'Zero Fusion — Permanent Cosmic Stasis',
        dominantPressure: 'Electron Degeneracy Pressure',
        shortDescription: 'A completely cold, dark sphere of degenerate helium in eternal peace.',
        detailedPhysics:
          'Having cooled to within a degree of absolute zero, it will drift through an empty, expanding universe forever.',
        keyPhenomena: ['Degenerate Helium Stasis', 'Dark Solid Sphere', 'Cosmic Endpoint'],
        analogousStarIds: [],
        visualType: 'black-dwarf',
        coolingStage: 'black-dwarf',
      },
    ],
  },

  // =========================================================================
  // TRACK 2: SOLAR-MASS STAR (0.5 to 8 M☉ - Sun, Alpha Centauri A)
  // =========================================================================
  {
    id: 'solar',
    name: 'Solar-Mass Star',
    massLabel: '0.5 to 8 Solar Masses (e.g. Our Sun, 1.0 M☉)',
    initialMassSolar: 1.0,
    typicalLifespan: '~10–12 Billion Years (Active) + Trillions (Cooling)',
    fateSummary: 'Planetary Nebula shedding leaving a Cooling White Dwarf -> Black Dwarf',
    accentColor: '#f59e0b',
    description:
      'The life story of our own Sun: a peaceful 10-billion-year golden age on the main sequence, a majestic red giant expansion, a glowing planetary nebula finale, and trillions of years as a cooling white dwarf.',
    checkpoints: [
      {
        progress: 0.0,
        timeElapsedLabel: '0 Years',
        ageYears: 0,
        stageName: 'Giant Molecular Cloud (Stellar Nursery)',
        category: 'nursery',
        surfaceTempKelvin: 15,
        coreTempKelvin: 15,
        radiusSolar: 50000,
        luminositySolar: 0.001,
        spectralClassEquivalent: 'Dark Cloud',
        colorHex: '#3b82f6',
        glowColorHex: '#60a5fa',
        coreEngine: 'No Fusion — Gravitational Jeans Instability',
        dominantPressure: 'Interstellar Gas & Dust Thermal Pressure',
        shortDescription:
          'A cold, dark, vast interstellar cloud of molecular hydrogen (H₂) and cosmic dust begins collapsing under its own gravity.',
        detailedPhysics:
          'When an interstellar gas cloud exceeds the Jeans Mass limit (often triggered by a nearby supernova shockwave or galactic density wave), gravity overcomes thermal gas pressure, initiating gravitational fragmentation into hundreds of embryonic protostellar cores.',
        keyPhenomena: ['Bok Globules', 'Infrared Emission Only', 'Gravitational Freefall Collapse'],
        analogousStarIds: [],
        visualType: 'nebula',
        nebulaOpacity: 0.95,
      },
      {
        progress: 0.08,
        timeElapsedLabel: '30 Million Years',
        ageYears: 30_000_000,
        stageName: 'Collapsing Protostar & T Tauri Phase',
        category: 'protostar',
        surfaceTempKelvin: 3800,
        coreTempKelvin: 5000000,
        radiusSolar: 3.5,
        luminositySolar: 4.5,
        spectralClassEquivalent: 'Pre-MS (T Tauri)',
        colorHex: '#f97316',
        glowColorHex: '#fb923c',
        coreEngine: 'Gravitational Kelvin-Helmholtz Contraction (Approaching H Fusion)',
        dominantPressure: 'Hydrostatic Convective Gas Pressure',
        shortDescription:
          'Gravitational contraction heats the core. Bipolar protostellar jets blast away excess angular momentum while a protoplanetary disk accretes matter.',
        detailedPhysics:
          'The core temperature surges toward the 10 million Kelvin threshold required for quantum tunneling of protons in the proton-proton chain. Powerful magnetic fields drive violent stellar winds and collimated Herbig-Haro plasma jets.',
        keyPhenomena: ['Protoplanetary Accretion Disk', 'Bipolar Gas Jets (Herbig-Haro)', 'Violent Magnetic Flaring'],
        analogousStarIds: [],
        visualType: 'protostar',
      },
      {
        progress: 0.25,
        timeElapsedLabel: '4.6 Billion Years',
        ageYears: 4_600_000_000,
        stageName: 'Main Sequence Yellow Dwarf (Class G2 V)',
        category: 'main-sequence',
        surfaceTempKelvin: 5778,
        coreTempKelvin: 15700000,
        radiusSolar: 1.0,
        luminositySolar: 1.0,
        spectralClassEquivalent: 'G2 V',
        colorHex: '#fef08a',
        glowColorHex: '#fde047',
        coreEngine: 'Proton-Proton (p-p) Chain: 4 H -> He + 2e⁺ + 2ν + Energy',
        dominantPressure: 'Hydrostatic Equilibrium (Inward Gravity = Outward Gas + Radiation Pressure)',
        shortDescription:
          'Our Sun’s current golden age: peaceful, stable hydrogen fusion converts 600 million tons of hydrogen into helium every single second.',
        detailedPhysics:
          'The star maintains near-perfect hydrostatic equilibrium via a self-regulating negative feedback thermostat. The energy released by core fusion slowly migrates outward through the radiative zone (taking 100,000 years) before boiling through the outer convective zone.',
        keyPhenomena: ['Photospheric Granulation', 'Sunspots & Coronal Loops', 'Solar Wind & Heliosphere'],
        analogousStarIds: ['sun', 'alpha-centauri-a'],
        visualType: 'star',
      },
      {
        progress: 0.45,
        timeElapsedLabel: '10.0 Billion Years',
        ageYears: 10_000_000_000,
        stageName: 'Subgiant to Red Giant Expansion (Class III)',
        category: 'giant',
        surfaceTempKelvin: 3800,
        coreTempKelvin: 50000000,
        radiusSolar: 85,
        luminositySolar: 1200,
        spectralClassEquivalent: 'M0 III - K2 III',
        colorHex: '#f87171',
        glowColorHex: '#ef4444',
        coreEngine: 'Hydrogen Shell Burning around an Inert Degenerate Helium Ash Core',
        dominantPressure: 'Immense Outward Thermal & Radiation Pressure in Swollen Envelope',
        shortDescription:
          'Core hydrogen exhausts into inert helium ash. The core contracts while shell burning swells the outer envelope by over 100x, engulfing Mercury and Venus.',
        detailedPhysics:
          'With no core fusion, gravity crushes the helium core until electron degeneracy sets in. Surrounding hydrogen fuses at an accelerated rate, blasting the outer convective mantle outward into a low-density red giant sphere.',
        keyPhenomena: ['Swollen Low-Density Envelope', 'Engulfment of Inner Planets', 'Gigantic Convective Cells'],
        analogousStarIds: ['aldebaran', 'arcturus'],
        visualType: 'giant',
      },
      {
        progress: 0.55,
        timeElapsedLabel: '10.2 Billion Years',
        ageYears: 10_200_000_000,
        stageName: 'Asymptotic Giant Branch (AGB) & Carbon Dredge-Up',
        category: 'giant',
        surfaceTempKelvin: 3100,
        coreTempKelvin: 200000000,
        radiusSolar: 220,
        luminositySolar: 5000,
        spectralClassEquivalent: 'Carbon Star / AGB',
        colorHex: '#dc2626',
        glowColorHex: '#b91c1c',
        coreEngine: 'Double Shell Burning (He Shell + H Shell) over an Inert Carbon-Oxygen Core',
        dominantPressure: 'Thermal Pulsing Radiation Pressure',
        shortDescription:
          'Helium shell flashes ignite periodic thermal pulses. Deep convective dredge-ups pull fresh carbon to the surface, forming a soot-red Carbon Star.',
        detailedPhysics:
          'Thermal runaway flashes in the helium shell destabilize the outer envelope. Stellar winds laced with graphite and polycyclic aromatic hydrocarbons blow off up to 60% of the star’s total mass into surrounding space.',
        keyPhenomena: ['Helium Shell Flashes', 'Deep Convective Dredge-Up', 'Graphite Dust Mass-Loss Wind'],
        analogousStarIds: ['la-superba', 'cw-leonis'],
        visualType: 'giant',
      },
      {
        progress: 0.65,
        timeElapsedLabel: '10.25 Billion Years',
        ageYears: 10_250_000_000,
        stageName: 'Planetary Nebula Ejection (Cosmic Explosion/Shedding)',
        category: 'explosion',
        surfaceTempKelvin: 120000,
        coreTempKelvin: 150000000,
        radiusSolar: 0.05,
        luminositySolar: 3000,
        spectralClassEquivalent: 'Planetary Nebula + WD Core',
        colorHex: '#38bdf8',
        glowColorHex: '#06b6d4',
        coreEngine: 'Fusion Ends — Naked Exposed Degenerate Carbon-Oxygen Core',
        dominantPressure: 'Electron Degeneracy Pressure in Core; Expanding Blast Shell',
        shortDescription:
          'The outer stellar envelope is blown off entirely as a glowing iridescent cosmic bubble of ionized gas, illuminated by the scorching ultra-hot central white dwarf core.',
        detailedPhysics:
          'Intense ultraviolet photons (>100,000 K) from the exposed core ionize the expanding gas shell, exciting forbidden lines of doubly ionized oxygen ([O III] turquoise cyan) and hydrogen-alpha (crimson red). The nebula expands at 20–40 km/s for ~20,000 years.',
        keyPhenomena: ['Iridescent Ionized Gas Shells', 'Bipolar Gas Lobes', 'Forbidden [O III] Cyan Glow'],
        analogousStarIds: ['sirius-b'],
        visualType: 'planetary-nebula',
        explosionExpansion: 0.6,
      },
      {
        progress: 0.72,
        timeElapsedLabel: '11 Billion Years',
        ageYears: 11_000_000_000,
        stageName: 'Young White Dwarf (Scorching Blue-White)',
        category: 'remnant',
        surfaceTempKelvin: 25000,
        coreTempKelvin: 30000000,
        radiusSolar: 0.012, // Earth-sized!
        luminositySolar: 0.1,
        spectralClassEquivalent: 'WD (Class DA)',
        colorHex: '#93c5fd',
        glowColorHex: '#60a5fa',
        coreEngine: 'Zero Fusion — Stored Thermal Heat Radiating into Space',
        dominantPressure: 'Electron Degeneracy Pressure (Pauli Exclusion Principle)',
        shortDescription:
          'An Earth-sized ultra-dense diamond core of carbon and oxygen. A single teaspoon of white dwarf material weighs over 5 tons on Earth.',
        detailedPhysics:
          'Supported against gravity solely by electron degeneracy pressure. Because electrons cannot occupy identical quantum states, the degenerate core cannot shrink further (so long as mass remains below the Chandrasekhar limit of 1.44 M☉).',
        keyPhenomena: ['Extreme Density (~1,000,000 g/cm³)', 'Gravitational Redshift', 'Quantum Degenerate Matter'],
        analogousStarIds: ['sirius-b', 'procyon-b'],
        visualType: 'cooling-white-dwarf',
        coolingStage: 'blue-white',
      },
      {
        progress: 0.78,
        timeElapsedLabel: '15 Billion Years',
        ageYears: 15_000_000_000,
        stageName: 'Cooling White Dwarf (White to Yellow Stage)',
        category: 'remnant',
        surfaceTempKelvin: 6000,
        coreTempKelvin: 5000000,
        radiusSolar: 0.011,
        luminositySolar: 0.001,
        spectralClassEquivalent: 'WD (Class DC)',
        colorHex: '#fef08a',
        glowColorHex: '#eab308',
        coreEngine: 'Zero Fusion — Gradual Thermal Cooling',
        dominantPressure: 'Electron Degeneracy Pressure',
        shortDescription:
          'As the white dwarf cools past 6,000 K (the Sun’s surface temperature), its glow shifts from blue-white to warm yellow.',
        detailedPhysics:
          'Because a white dwarf has a tiny surface area (approx. Earth’s surface area) and no internal energy generation, heat radiates away very slowly through its thin degenerate conductive crust.',
        keyPhenomena: ['Solar Color Equivalence', 'Cooling Rate Slows Exponentially', 'Carbon Lattice Ordering Begins'],
        analogousStarIds: ['van-maanen-2'],
        visualType: 'cooling-white-dwarf',
        coolingStage: 'yellow',
      },
      {
        progress: 0.85,
        timeElapsedLabel: '30 Billion Years',
        ageYears: 30_000_000_000,
        stageName: 'Cooling White Dwarf (Orange to Red Stage)',
        category: 'remnant',
        surfaceTempKelvin: 3500,
        coreTempKelvin: 1000000,
        radiusSolar: 0.01,
        luminositySolar: 0.0001,
        spectralClassEquivalent: 'WD (Class DZ / Cool)',
        colorHex: '#f97316',
        glowColorHex: '#ea580c',
        coreEngine: 'Zero Fusion — Core Crystallization (Cosmic Diamond)',
        dominantPressure: 'Electron Degeneracy Pressure',
        shortDescription:
          'The ember continues cooling into orange and red. The interior carbon and oxygen ions lock into a solid crystalline diamond-like lattice.',
        detailedPhysics:
          'Latent heat of crystallization is released as the degenerate plasma freezes into a body-centered cubic crystal lattice, temporarily slowing the cooling rate as it shifts through the red spectrum.',
        keyPhenomena: ['Core Crystallization', 'Latent Heat Release', 'Dull Amber Photosphere'],
        analogousStarIds: [],
        visualType: 'cooling-white-dwarf',
        coolingStage: 'orange',
      },
      {
        progress: 0.92,
        timeElapsedLabel: '100 Billion Years',
        ageYears: 100_000_000_000,
        stageName: 'Cooling White Dwarf (Dark Red Ember)',
        category: 'remnant',
        surfaceTempKelvin: 1200,
        coreTempKelvin: 50000,
        radiusSolar: 0.0095,
        luminositySolar: 0.000005,
        spectralClassEquivalent: 'WD (Infrared Ember)',
        colorHex: '#7f1d1d',
        glowColorHex: '#450a0a',
        coreEngine: 'Zero Fusion — Faint Infrared Thermal Leaks',
        dominantPressure: 'Electron Degeneracy Pressure',
        shortDescription:
          'A barely glowing deep dark-red ember, emitting almost all its energy in the infrared. The universe itself is not yet old enough for any star to have reached this stage.',
        detailedPhysics:
          'The universe is currently only 13.8 billion years old; even the oldest white dwarfs formed in the earliest galaxies are still glowing at ~3,000–4,000 K. A 1,200 K white dwarf is a glimpse into the deep cosmic future.',
        keyPhenomena: ['Infrared Dominance', 'Beyond Present Cosmic Age', 'Solid Crystal Sphere'],
        analogousStarIds: [],
        visualType: 'cooling-white-dwarf',
        coolingStage: 'dark-red',
      },
      {
        progress: 1.0,
        timeElapsedLabel: '10^15 Years (1 Quadrillion Years)',
        ageYears: 1e15,
        stageName: 'Crystallized Black Dwarf (Final Form)',
        category: 'final',
        surfaceTempKelvin: 2.7,
        coreTempKelvin: 3,
        radiusSolar: 0.009,
        luminositySolar: 0.0,
        spectralClassEquivalent: 'Black Dwarf',
        colorHex: '#0f172a',
        glowColorHex: '#1e293b',
        coreEngine: 'Zero Fusion — Cold Thermal Equilibrium with CMB',
        dominantPressure: 'Electron Degeneracy Pressure',
        shortDescription:
          'The ultimate graveyard of solar-mass stars: an utterly cold, pitch-black sphere of crystallized carbon (diamond) and oxygen floating silently through eternity.',
        detailedPhysics:
          'Having radiated away virtually all its thermal energy, the black dwarf exists in equilibrium with the cold cosmic microwave background (~2.7 Kelvin). It emits zero optical light, detectable only by its gravitational lensing footprint.',
        keyPhenomena: ['Zero Optical Emission', 'Cosmic Diamond Monolith', 'Eternal Degenerate Relic'],
        analogousStarIds: [],
        visualType: 'black-dwarf',
        coolingStage: 'black-dwarf',
      },
    ],
  },

  // =========================================================================
  // TRACK 2: MASSIVE STAR (8 to 25 M☉ - Betelgeuse, Rigel, Spica)
  // =========================================================================
  {
    id: 'massive',
    name: 'Massive Star',
    massLabel: '8 to 25 Solar Masses (e.g. Betelgeuse ~16 M☉, Rigel ~21 M☉)',
    initialMassSolar: 16.0,
    typicalLifespan: '~10–30 Million Years (Active) + Billions (Neutron Star)',
    fateSummary: 'Core-Collapse Supernova (Type II) leaving a rapidly spinning Neutron Star / Pulsar',
    accentColor: '#38bdf8',
    description:
      'Lives fast, burns fiercely with searing blue brilliance, swells into an enormous red supergiant with onion-layer nuclear fusion, and dies in a catastrophic core-collapse supernova leaving an ultra-dense pulsar.',
    checkpoints: [
      {
        progress: 0.0,
        timeElapsedLabel: '0 Years',
        ageYears: 0,
        stageName: 'Giant Molecular Cloud Core Collapse',
        category: 'nursery',
        surfaceTempKelvin: 20,
        coreTempKelvin: 20,
        radiusSolar: 100000,
        luminositySolar: 0.01,
        spectralClassEquivalent: 'Dense GMC Clump',
        colorHex: '#38bdf8',
        glowColorHex: '#0284c7',
        coreEngine: 'High-Mass Gravitational Cloud Core Infall',
        dominantPressure: 'Supersonic Interstellar Turbulence',
        shortDescription:
          'A massive, dense interstellar cloud fragment rapidly collapses under ferocious gravitational attraction.',
        detailedPhysics:
          'Massive stars form in high-pressure cluster nurseries like the Orion Nebula core. Intense accretion rates overcome radiation pressure to assemble 10 to 25 solar masses in under 500,000 years.',
        keyPhenomena: ['Trapezium-like Nursery', 'Supersonic Shock Fronts', 'High-Mass Infall'],
        analogousStarIds: [],
        visualType: 'nebula',
        nebulaOpacity: 1.0,
      },
      {
        progress: 0.12,
        timeElapsedLabel: '500,000 Years',
        ageYears: 500_000,
        stageName: 'Massive Protostar & Hyper-Accretion',
        category: 'protostar',
        surfaceTempKelvin: 12000,
        coreTempKelvin: 20000000,
        radiusSolar: 15,
        luminositySolar: 2000,
        spectralClassEquivalent: 'Herbig Ae/Be Protostar',
        colorHex: '#60a5fa',
        glowColorHex: '#3b82f6',
        coreEngine: 'Gravitational Compression + Early CNO Fusion',
        dominantPressure: 'Turbulent Gas & Radiation Pressure',
        shortDescription:
          'The protostar ignites the CNO cycle before accretion has even ceased, driving massive bipolar stellar winds through its dust cocoon.',
        detailedPhysics:
          'Because of its enormous mass, the core ignites hydrogen fusion while still embedded in its natal cocoon, forming an ultracompact H II region around the embryonic star.',
        keyPhenomena: ['Massive Bipolar Inflow/Outflow', 'Ultracompact H II Region', 'Radiative Feedback'],
        analogousStarIds: [],
        visualType: 'protostar',
      },
      {
        progress: 0.32,
        timeElapsedLabel: '10 Million Years',
        ageYears: 10_000_000,
        stageName: 'Luminous Blue-White Main Sequence (Class B V)',
        category: 'main-sequence',
        surfaceTempKelvin: 30000,
        coreTempKelvin: 38000000,
        radiusSolar: 8.5,
        luminositySolar: 35000,
        spectralClassEquivalent: 'B0 V - B1 V (e.g. Spica)',
        colorHex: '#b0d0ff',
        glowColorHex: '#ddecff',
        coreEngine: 'Carbon-Nitrogen-Oxygen (CNO) Catalytic Cycle',
        dominantPressure: 'High Radiation Pressure + Hydrostatic Gas Pressure',
        shortDescription:
          'A searing blue-white furnace shining tens of thousands of times brighter than the Sun, matching the brilliant Class B catalog stars like Spica and Achernar.',
        detailedPhysics:
          'The CNO cycle energy generation rate scales as T^17 (temperature to the 17th power!), driving intense core convection and furious radiation pressure that blows away outer layers at thousands of km/s.',
        keyPhenomena: ['Extreme Ultraviolet Radiance', 'Powerful Stellar Wind', 'Fast Equatorial Rotation'],
        analogousStarIds: ['spica', 'bellatrix', 'achernar'],
        visualType: 'star',
      },
      {
        progress: 0.52,
        timeElapsedLabel: '18 Million Years',
        ageYears: 18_000_000,
        stageName: 'Blue & Yellow Supergiant Phase (Class I)',
        category: 'giant',
        surfaceTempKelvin: 12500,
        coreTempKelvin: 120000000,
        radiusSolar: 75,
        luminositySolar: 80000,
        spectralClassEquivalent: 'B8 Ia (like Rigel)',
        colorHex: '#9ec4ff',
        glowColorHex: '#c4e0ff',
        coreEngine: 'Helium Core Fusion (Triple-Alpha) + Hydrogen Shell Burning',
        dominantPressure: 'Radiation Pressure Near Eddington Boundary',
        shortDescription:
          'Hydrogen runs dry in the core. The star swells dramatically into a brilliant blue-white supergiant like Rigel in Orion.',
        detailedPhysics:
          'As the core transitions from hydrogen to helium burning, the star migrates horizontally across the H-R diagram, pulsating with immense radiative luminosity.',
        keyPhenomena: ['Extreme Optical Luminosity', 'Massive Dense Stellar Wind', 'Variable Pulsations'],
        analogousStarIds: ['rigel', 'deneb'],
        visualType: 'giant',
      },
      {
        progress: 0.68,
        timeElapsedLabel: '20 Million Years',
        ageYears: 20_000_000,
        stageName: 'Red Supergiant with Onion Fusion Layers (Class M I)',
        category: 'giant',
        surfaceTempKelvin: 3500,
        coreTempKelvin: 3000000000, // 3 Billion Kelvin!
        radiusSolar: 950,
        luminositySolar: 110000,
        spectralClassEquivalent: 'M1-2 Ia-ab (like Betelgeuse / Antares)',
        colorHex: '#ef4444',
        glowColorHex: '#dc2626',
        coreEngine: 'Concentric Onion Fusion Layers: H -> He -> C -> O -> Ne -> Mg -> Si -> Inert Fe Core',
        dominantPressure: 'Core Degeneracy Fighting Massive Gravity; Fluffy Outer Envelope',
        shortDescription:
          'A gargantuan cosmic monster. If placed at the center of our solar system, its surface would swallow the orbit of Jupiter! Inside, nuclear fusion races through silicon to iron.',
        detailedPhysics:
          'Each nuclear fuel burns exponentially faster: Hydrogen for 10 million years, Helium for 1 million, Carbon for 1,000 years, Neon for 3 years, Oxygen for 6 months, and Silicon for just 1 day! Iron (Fe) fusion is endothermic and cannot produce energy.',
        keyPhenomena: ['Onion-Shell Fusion Core', 'Convective Boiling Blobs', 'Imminent Core Instability'],
        analogousStarIds: ['betelgeuse', 'antares'],
        visualType: 'giant',
      },
      {
        progress: 0.78,
        timeElapsedLabel: '20 Million Years + 1 Second',
        ageYears: 20_000_001,
        stageName: 'Type II Core-Collapse Supernova (Cataclysmic Explosion)',
        category: 'explosion',
        surfaceTempKelvin: 100000000,
        coreTempKelvin: 100000000000, // 100 Billion K
        radiusSolar: 0.00003, // collapsed to 20 km core
        luminositySolar: 5000000000, // 5 Billion Suns!
        spectralClassEquivalent: 'Supernova Type II',
        colorHex: '#e0f2fe',
        glowColorHex: '#38bdf8',
        coreEngine: 'Iron Core Collapse + Neutronization (p + e⁻ -> n + ν) + Neutrino Rebound Shock',
        dominantPressure: 'Neutron Degeneracy Pressure Rebound Shockwave',
        shortDescription:
          'The iron core collapses in 10 milliseconds. A titanic rebound shockwave blasts outward, outshining an entire galaxy of 100 billion stars and synthesizing gold, uranium, and iron!',
        detailedPhysics:
          'When the iron core exceeds the Chandrasekhar limit, electron degeneracy fails. Protons and electrons merge into neutrons, creating a flood of 10^58 neutrinos. The core rebounds at 0.23c, launching an asymmetric shockwave that blows the star apart at 15,000 km/s.',
        keyPhenomena: ['Neutrino Flash Outpouring', 'R-Process Element Nucleosynthesis', 'Milky Way-Outshining Peak'],
        analogousStarIds: [],
        visualType: 'supernova',
        explosionExpansion: 0.85,
      },
      {
        progress: 0.85,
        timeElapsedLabel: '20.1 Million Years',
        ageYears: 20_100_000,
        stageName: 'Young Pulsar in Expanding Supernova Remnant',
        category: 'remnant',
        surfaceTempKelvin: 1500000,
        coreTempKelvin: 100000000,
        radiusSolar: 0.000028, // ~20 km physical diameter!
        luminositySolar: 1000,
        spectralClassEquivalent: 'Pulsar (PSR / NS)',
        colorHex: '#67e8f9',
        glowColorHex: '#06b6d4',
        coreEngine: 'Rotational Kinetic Energy Loss + Relativistic Synchrotron Wind',
        dominantPressure: 'Neutron Degeneracy Pressure (Strong Nuclear Force Repulsion)',
        shortDescription:
          'A city-sized atomic sphere of pure neutrons spinning 30 times per second, sweeping twin relativistic radio and X-ray beam cones through space like a cosmic lighthouse inside the glowing Crab Nebula.',
        detailedPhysics:
          'Conservation of angular momentum spins the 1.4 M☉ collapsed core up to dozens or hundreds of rotations per second. Its magnetic field is compressed to 10^12 Gauss, channeling relativistic particle beams along magnetic poles.',
        keyPhenomena: ['Relativistic Lighthouse Beams', '10^12 Gauss Magnetic Field', 'Crab-like Synchrotron Web'],
        analogousStarIds: ['crab-pulsar', 'vela-pulsar'],
        visualType: 'pulsar',
      },
      {
        progress: 0.93,
        timeElapsedLabel: '100 Million Years',
        ageYears: 100_000_000,
        stageName: 'Slowing Pulsar (Decaying Magnetic Field & Fading Beacon)',
        category: 'remnant',
        surfaceTempKelvin: 400000,
        coreTempKelvin: 1000000,
        radiusSolar: 0.000028,
        luminositySolar: 0.001,
        spectralClassEquivalent: 'Old Pulsar / Dim NS',
        colorHex: '#38bdf8',
        glowColorHex: '#0284c7',
        coreEngine: 'Dissipating Rotational Energy + Magnetic Field Decay',
        dominantPressure: 'Neutron Degeneracy Pressure',
        shortDescription:
          'Over millions of years, electromagnetic torque slows rotation to a fraction of a Hertz. The magnetic field decays and the twin synchrotron lighthouse beams steadily dim and fade.',
        detailedPhysics:
          'Ohmic dissipation and Hall drift in the solid crystalline crust cause the magnetic dipole field to decay from 10^12 G down below the quantum pulsar death line. The synchrotron beacon weakens toward zero.',
        keyPhenomena: ['Crossing Pulsar Death Line', 'Magnetic Field Decay', 'Fading Synchrotron Lighthouse'],
        analogousStarIds: ['rx-j1856-3754'],
        visualType: 'pulsar',
      },
      {
        progress: 1.0,
        timeElapsedLabel: '10^15 Years (1 Quadrillion Years)',
        ageYears: 1e15,
        stageName: 'Cold Neutron Star (Extinguished Relic / Black Neutron Stasis)',
        category: 'final',
        surfaceTempKelvin: 2.7,
        coreTempKelvin: 3,
        radiusSolar: 0.000028,
        luminositySolar: 0.0,
        spectralClassEquivalent: 'Cold Black Neutron Star',
        colorHex: '#0f172a',
        glowColorHex: '#1e293b',
        coreEngine: 'Zero Energy Output — Permanent Degenerate Thermal Stasis',
        dominantPressure: 'Neutron Degeneracy Pressure & Strong Force Repulsion',
        shortDescription:
          'Just like a black dwarf for solar stars, the neutron star’s magnetic field and beacon are completely extinguished. A cold, ultra-dense 20 km monument of pure nuclear matter sits in eternal peace, warping background spacetime.',
        detailedPhysics:
          'All thermal, rotational, and magnetic energies have completely radiated away. The surface cools to equilibrium with the cold cosmic microwave background (~2.7 Kelvin). Supported perpetually by neutron degeneracy pressure and strong nuclear force repulsion, it floats silently through the cosmos forever.',
        keyPhenomena: ['Extinguished Radio Beacon', 'Zero Magnetic Emission', 'Permanent Nuclear Pasta Monolith', 'Eternal Relativistic Monument'],
        analogousStarIds: [],
        visualType: 'cold-neutron-star',
      },
    ],
  },

  // =========================================================================
  // TRACK 3: HYPER-MASSIVE STAR (> 25 to 100+ M☉ - Eta Carinae, WR 102)
  // =========================================================================
  {
    id: 'hyper-massive',
    name: 'Hyper-Massive Star',
    massLabel: '25 to 100+ Solar Masses (e.g. Eta Carinae ~100 M☉, WR 102)',
    initialMassSolar: 60.0,
    typicalLifespan: '~2–4 Million Years (Active) + Eternal Black Hole',
    fateSummary: 'Hypernova / Collapsar with Gamma-Ray Burst leaving a Stellar-Mass Black Hole',
    accentColor: '#3b82f6',
    description:
      'The supreme cosmic heavyweights. Radiating near the theoretical Eddington stability limit with violent mass-loss eruptions, culminating in an extreme Hypernova with relativistic Gamma-Ray Burst jets and a Stellar Black Hole.',
    checkpoints: [
      {
        progress: 0.0,
        timeElapsedLabel: '0 Years',
        ageYears: 0,
        stageName: 'Extreme Molecular Cloud Collapse',
        category: 'nursery',
        surfaceTempKelvin: 30,
        coreTempKelvin: 30,
        radiusSolar: 150000,
        luminositySolar: 0.1,
        spectralClassEquivalent: 'Monster GMC Core',
        colorHex: '#3b82f6',
        glowColorHex: '#1d4ed8',
        coreEngine: 'Torrential Gravitational Accretion Stream',
        dominantPressure: 'Gravitational Freefall Momentum',
        shortDescription:
          'A colossal cluster nursery collapses under extreme gravity, assembling dozens of solar masses in a cosmic blink of an eye.',
        detailedPhysics:
          'Such stars require extraordinary accretion rates (10^-3 M☉/yr) to push through the intense radiation pressure that would blow apart smaller developing stars.',
        keyPhenomena: ['Giant H II Region', 'Torrential Mass Infall', 'Extreme Starburst Core'],
        analogousStarIds: [],
        visualType: 'nebula',
        nebulaOpacity: 1.0,
      },
      {
        progress: 0.1,
        timeElapsedLabel: '200,000 Years',
        ageYears: 200_000,
        stageName: 'Hyper-Massive Protostar & Monster Accretion',
        category: 'protostar',
        surfaceTempKelvin: 18000,
        coreTempKelvin: 30000000,
        radiusSolar: 24,
        luminositySolar: 60000,
        spectralClassEquivalent: 'Class O Protostar',
        colorHex: '#60a5fa',
        glowColorHex: '#3b82f6',
        coreEngine: 'Torrential Infall + Early CNO Ignition',
        dominantPressure: 'Hydrostatic Shock vs Gravitational Infall',
        shortDescription:
          'A titanic protostellar core accreting hundreds of solar masses per millennium while blasting collimated hyper-jets through its natal dust cocoon.',
        detailedPhysics:
          'The core crosses the threshold for carbon-nitrogen-oxygen catalytic fusion before accretion can even finish, creating immense radiation pressure that sculpts dramatic bipolar outflow lobes.',
        keyPhenomena: ['Bipolar Outflow Funnels', 'Extreme Radiation Pressure', 'Hyper-Accretion Disk'],
        analogousStarIds: [],
        visualType: 'protostar',
      },
      {
        progress: 0.24,
        timeElapsedLabel: '1.5 Million Years',
        ageYears: 1_500_000,
        stageName: 'Luminous Class O Supergiant / Wolf-Rayet',
        category: 'main-sequence',
        surfaceTempKelvin: 50000,
        coreTempKelvin: 60000000,
        radiusSolar: 22,
        luminositySolar: 2000000,
        spectralClassEquivalent: 'Class O2-O4 If* (e.g. Melnick 42 / Zeta Puppis)',
        colorHex: '#70b5ff',
        glowColorHex: '#3b82f6',
        coreEngine: 'Extreme CNO Hydrogen Burning + Core Helium Ignition',
        dominantPressure: 'Overwhelming Radiation Pressure Blowing Stellar Envelope Apart',
        shortDescription:
          'Searing radiant blue Class O star shining with over 2 million Suns. Extreme radiation pressure strips away outer layers at 3,000 km/s, exactly matching the Class O stars in our catalog.',
        detailedPhysics:
          'Stellar winds driven by line radiation pressure reach speeds exceeding 3,000 km/s, shedding 10^-5 solar masses per year. High ionization states of helium, nitrogen, and carbon dominate the optical spectrum.',
        keyPhenomena: ['Pure Radiant Class O Blue', 'Violent 3,000 km/s Wind', 'Exposed Burning Core'],
        analogousStarIds: ['melnick-42', 'zeta-puppis', 'vfts-352', 'wr-102'],
        visualType: 'star',
      },
      {
        progress: 0.45,
        timeElapsedLabel: '2.8 Million Years',
        ageYears: 2_800_000,
        stageName: 'Luminous Blue Variable (LBV) / Yellow Hypergiant',
        category: 'giant',
        surfaceTempKelvin: 18000,
        coreTempKelvin: 400000000,
        radiusSolar: 600,
        luminositySolar: 5000000,
        spectralClassEquivalent: 'LBV / Hypergiant (like Eta Carinae)',
        colorHex: '#fb7185',
        glowColorHex: '#f43f5e',
        coreEngine: 'Carbon & Neon Core Burning + Pulsational Pair Instability',
        dominantPressure: 'Eddington Limit Breached — Episodic Envelope Ejection',
        shortDescription:
          'Radiating with the light of 5 million Suns, right on the edge of blowing itself apart. Periodic Great Eruptions blast dozens of Earth-masses of matter into bipolar nebula lobes.',
        detailedPhysics:
          'When photon radiation pressure exceeds inward gravitational force (the Eddington Luminosity limit), the star experiences catastrophic mass eruptions, forming bipolar Homunculus-like dust structures.',
        keyPhenomena: ['Homunculus Bipolar Lobes', 'Near-Eddington Violations', 'Semi-Periodic Super-Outbursts'],
        analogousStarIds: ['eta-carinae', 'pistol-star'],
        visualType: 'giant',
      },
      {
        progress: 0.68,
        timeElapsedLabel: '3.2 Million Years',
        ageYears: 3_200_000,
        stageName: 'Hypernova / Collapsar & Long Gamma-Ray Burst (GRB)',
        category: 'explosion',
        surfaceTempKelvin: 500000000,
        coreTempKelvin: 1000000000000,
        radiusSolar: 0.00001,
        luminositySolar: 100000000000, // 100 Billion Suns!
        spectralClassEquivalent: 'Hypernova / GRB Blast',
        colorHex: '#f43f5e',
        glowColorHex: '#fda4af',
        coreEngine: 'Direct Core Collapse to Singularity + Relativistic Polar Jet Breakout',
        dominantPressure: 'Gravitational Collapse Overwhelms ALL Degeneracy Pressures',
        shortDescription:
          'The core collapses directly into a Black Hole. An ultra-relativistic plasma jet punches through the stellar poles at 99.999% the speed of light, releasing a blinding Gamma-Ray Burst visible across the entire observable universe!',
        detailedPhysics:
          'In the Collapsar model, the rapidly rotating core collapses into a central singularity surrounded by an accretion torus. Magnetohydrodynamic forces fire twin collimated relativistic jets through the star’s rotational axis in under 20 seconds.',
        keyPhenomena: ['Bipolar Relativistic Jets (0.99999c)', 'Long Gamma-Ray Burst (GRB)', 'Pair-Instability Shock'],
        analogousStarIds: [],
        visualType: 'hypernova',
        explosionExpansion: 0.95,
      },
      {
        progress: 0.85,
        timeElapsedLabel: '3.5 Million Years',
        ageYears: 3_500_000,
        stageName: 'Nascent Stellar-Mass Black Hole with Relativistic Accretion Disk',
        category: 'remnant',
        surfaceTempKelvin: 10000000, // Accretion disk X-ray temperature
        coreTempKelvin: 0,
        radiusSolar: 0.000043, // 30 km Schwarzschild radius (10 M☉)
        luminositySolar: 10000,
        spectralClassEquivalent: 'Microquasar / X-ray Binary',
        colorHex: '#e879f9',
        glowColorHex: '#d946ef',
        coreEngine: 'Gravitational Potential Energy of Accreting Debris Disk',
        dominantPressure: 'Infinite Gravitational Curvature (General Relativity)',
        shortDescription:
          'The central mass has collapsed beyond its Event Horizon. It feeds on fallen stellar debris, forming a swirling relativistic accretion disk with Doppler beaming and an Einstein photon ring.',
        detailedPhysics:
          'Matter orbiting inside the innermost stable circular orbit (ISCO) heats to millions of Kelvin via friction, emitting intense X-rays before falling past the Schwarzschild radius (r_s = 2GM/c²). Relativistic beaming makes the approaching side of the disk appear much brighter.',
        keyPhenomena: ['Gravitational Event Horizon', 'Relativistic Doppler Beaming', 'Einstein Photon Sphere'],
        analogousStarIds: ['cygnus-x-1', 'v404-cygni'],
        visualType: 'black-hole',
      },
      {
        progress: 1.0,
        timeElapsedLabel: 'Trillions of Years to Eternity',
        ageYears: 1_000_000_000_000,
        stageName: 'Isolated Stellar-Mass Black Hole (Eternal Cosmic Singularity)',
        category: 'final',
        surfaceTempKelvin: 0.000000006, // 6 nanoKelvin Hawking Temp!
        coreTempKelvin: 0,
        radiusSolar: 0.000043, // ~30 km Event Horizon
        luminositySolar: 0.0,
        spectralClassEquivalent: 'Isolated Stellar Black Hole',
        colorHex: '#020617',
        glowColorHex: '#0f172a',
        coreEngine: 'None — Infinitesimal Hawking Radiation Evaporation (10^67 yr)',
        dominantPressure: 'Gravitational Singularity (Zero Volume, Infinite Density)',
        shortDescription:
          'With surrounding debris exhausted, the black hole sits silent and invisible against space, warping background starfields with its intense gravitational lens.',
        detailedPhysics:
          'A 10-solar-mass black hole has a Hawking temperature of just 6 nanokelvin (colder than the 2.7 K universe!). It will absorb the cosmic microwave background for eons before eventually evaporating via Hawking radiation over 10^67 years.',
        keyPhenomena: ['Gravitational Microlensing', 'Infinite Spacetime Curvature', '10^67 Year Hawking Evaporation'],
        analogousStarIds: ['gaia-bh1'],
        visualType: 'black-hole',
      },
    ],
  },
];

// Helper to format astrophysical ages into readable cosmic units
export function formatCosmicAge(years: number): string {
  if (years <= 0) return '0 yr (Birth)';
  if (years < 1000) return `${Math.round(years)} yr`;
  if (years < 100000) return `${(years / 1000).toFixed(1)} kyr`;
  if (years < 1_000_000) return `${Math.round(years / 1000)} kyr (${Math.round(years).toLocaleString()} yr)`;
  if (years < 10_000_000) return `${(years / 1e6).toFixed(2)} Myr`;
  if (years < 1_000_000_000) return `${(years / 1e6).toFixed(1)} Myr`;
  if (years < 10_000_000_000) return `${(years / 1e9).toFixed(2)} Gyr`;
  if (years < 1_000_000_000_000) return `${(years / 1e9).toFixed(1)} Gyr`;
  if (years < 100_000_000_000_000) return `${(years / 1e12).toFixed(2)} Trillion yr`;
  const exp = Math.floor(Math.log10(years));
  const base = (years / Math.pow(10, exp)).toFixed(2);
  return `${base} × 10^${exp} yr (Deep Cosmic Era)`;
}

export interface InterpolatedTelemetry {
  current: LifeCycleCheckpoint;
  next: LifeCycleCheckpoint;
  alpha: number; // 0 to 1 between current and next
  interpolatedTemp: number;
  interpolatedRadius: number;
  interpolatedLuminosity: number;
  interpolatedColor: string;
  interpolatedGlow: string;
  interpolatedAgeYears: number;
  interpolatedAgeLabel: string;
}

// Mathematical interpolation helper between checkpoints along a track
export function interpolateCheckpoint(
  track: StellarTrack,
  progress: number
): InterpolatedTelemetry {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const pts = track.checkpoints;

  let currentIdx = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    if (clampedProgress >= pts[i].progress && clampedProgress <= pts[i + 1].progress) {
      currentIdx = i;
      break;
    }
  }

  const current = pts[currentIdx];
  const next = pts[Math.min(currentIdx + 1, pts.length - 1)];

  const span = Math.max(0.0001, next.progress - current.progress);
  const alpha = Math.max(0, Math.min(1, (clampedProgress - current.progress) / span));

  // Logarithmic interpolation for temperature and radius which span multiple orders of magnitude
  const logTemp = Math.log10(current.surfaceTempKelvin) * (1 - alpha) + Math.log10(next.surfaceTempKelvin) * alpha;
  const interpolatedTemp = Math.round(Math.pow(10, logTemp));

  const logRad = Math.log10(Math.max(0.00001, current.radiusSolar)) * (1 - alpha) + Math.log10(Math.max(0.00001, next.radiusSolar)) * alpha;
  const interpolatedRadius = Math.pow(10, logRad);

  const logLum = Math.log10(Math.max(0.000001, current.luminositySolar)) * (1 - alpha) + Math.log10(Math.max(0.00001, next.luminositySolar)) * alpha;
  const interpolatedLuminosity = Math.pow(10, logLum);

  // Color blending
  const color1 = hexToRgb(current.colorHex);
  const color2 = hexToRgb(next.colorHex);
  const r = Math.round(color1.r * (1 - alpha) + color2.r * alpha);
  const g = Math.round(color1.g * (1 - alpha) + color2.g * alpha);
  const b = Math.round(color1.b * (1 - alpha) + color2.b * alpha);
  const interpolatedColor = `rgb(${r}, ${g}, ${b})`;

  const glow1 = hexToRgb(current.glowColorHex);
  const glow2 = hexToRgb(next.glowColorHex);
  const gr = Math.round(glow1.r * (1 - alpha) + glow2.r * alpha);
  const gg = Math.round(glow1.g * (1 - alpha) + glow2.g * alpha);
  const gb = Math.round(glow1.b * (1 - alpha) + glow2.b * alpha);
  const interpolatedGlow = `rgb(${gr}, ${gg}, ${gb})`;

  // Continuous astrophysical age interpolation
  let interpolatedAgeYears: number;
  if (current.ageYears <= 0) {
    interpolatedAgeYears = next.ageYears * Math.pow(alpha, 1.4);
  } else if (next.ageYears > current.ageYears * 5) {
    const logA = Math.log10(Math.max(1, current.ageYears));
    const logB = Math.log10(Math.max(1, next.ageYears));
    interpolatedAgeYears = Math.pow(10, logA + (logB - logA) * alpha);
  } else {
    interpolatedAgeYears = current.ageYears + (next.ageYears - current.ageYears) * alpha;
  }
  const interpolatedAgeLabel = formatCosmicAge(interpolatedAgeYears);

  return {
    current,
    next,
    alpha,
    interpolatedTemp,
    interpolatedRadius,
    interpolatedLuminosity,
    interpolatedColor,
    interpolatedGlow,
    interpolatedAgeYears,
    interpolatedAgeLabel,
  };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  return {
    r: parseInt(clean.substring(0, 2), 16) || 255,
    g: parseInt(clean.substring(2, 4), 16) || 255,
    b: parseInt(clean.substring(4, 6), 16) || 255,
  };
}
