// Astrophysics dataset and mathematical models for the 2D Stellar Life Cycle Slider Simulator
// Timeline Scale:
// -100% to 0% (-1.0 to 0.0): Pre-Stellar Cloud Collapse & Protostar Phase (0% = Star Birth / ZAMS)
// 0% to 100% (0.0 to 1.0): Active Stellar Fusion Lifespan (100% = Star Death / Remnant Formation)
// 100% to 200% (1.0 to 2.0): Post-Death Remnant Cooling & Decay (200% = Remnant Extinction / Final Stasis)

export interface LifeCycleCheckpoint {
  progress: number; // -1.0 (-100%) to 2.0 (200%) along the life cycle timeline
  timeElapsedLabel: string; // e.g., "-50 Myr (Pre-Birth)", "0 yr (Birth)", "4.6 Gyr", "10.25 Gyr", "10^15 yr"
  ageYears: number; // Numerical age relative to ZAMS birth (negative before birth, 0 at birth, positive after)
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
  dominantPressure: string;
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
    fateSummary: 'Theoretical Blue Dwarf transition -> Cooling White Dwarf (100%) -> Black Dwarf (200%)',
    accentColor: '#f43f5e',
    description:
      'The cosmic ultra-marathon runners. Because they are fully convective, they slowly circulate and burn nearly 100% of their hydrogen fuel over trillions of years without ever swelling into a red giant or exploding.',
    checkpoints: [
      {
        progress: -1.0,
        timeElapsedLabel: '-150 Myr (Pre-Birth)',
        ageYears: -150_000_000,
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
        shortDescription: 'Before the star is born (-100%): A small pocket of cool molecular gas slowly contracts under low gravity.',
        detailedPhysics:
          'With minimal mass, gravitational collapse is gentle and leisurely, taking upwards of 150 million years to contract into a pre-stellar core and ignite hydrogen fusion.',
        keyPhenomena: ['Slow Contraction', 'Low Jeans Density', 'Minimal Turbulence'],
        analogousStarIds: [],
        visualType: 'nebula',
        nebulaOpacity: 0.8,
      },
      {
        progress: -0.5,
        timeElapsedLabel: '-50 Myr (Protostar)',
        ageYears: -50_000_000,
        stageName: 'Slowly Contracting Low-Mass Protostar',
        category: 'protostar',
        surfaceTempKelvin: 2800,
        coreTempKelvin: 3000000,
        radiusSolar: 0.8,
        luminositySolar: 0.05,
        spectralClassEquivalent: 'Late M Protostar',
        colorHex: '#fb7185',
        glowColorHex: '#f43f5e',
        coreEngine: 'Kelvin-Helmholtz Gravitational Contraction (Pre-Fusion)',
        dominantPressure: 'Full Convective Gas Pressure',
        shortDescription: 'Pre-main-sequence contraction (-50%): The embryonic core heats toward the ~3 million K proton-proton ignition threshold.',
        detailedPhysics:
          'The pre-stellar object is 100% convective throughout its entire volume. Gravitational potential energy is radiated away until core density and temperature trigger sustained fusion at 0%.',
        keyPhenomena: ['Hayashi Track Contraction', 'Protostellar Flares', 'Circumstellar Disk Clearing'],
        analogousStarIds: [],
        visualType: 'protostar',
      },
      {
        progress: 0.0,
        timeElapsedLabel: '0 yr (Star Birth / ZAMS)',
        ageYears: 0,
        stageName: 'Zero-Age Main Sequence Red Dwarf (Star Born)',
        category: 'main-sequence',
        surfaceTempKelvin: 3000,
        coreTempKelvin: 7500000,
        radiusSolar: 0.19,
        luminositySolar: 0.0015,
        spectralClassEquivalent: 'M5.5 V (ZAMS)',
        colorHex: '#f87171',
        glowColorHex: '#ef4444',
        coreEngine: 'Sustained Proton-Proton (p-p) Chain Ignition',
        dominantPressure: 'Hydrostatic Equilibrium (Convective Gas)',
        shortDescription:
          'End of protostar phase (0%): Core hydrogen fusion ignites and stabilizes! The red dwarf is officially born onto the Zero-Age Main Sequence.',
        detailedPhysics:
          'Outward thermal pressure from newly ignited hydrogen fusion balances inward gravity, halting contraction and beginning a multi-trillion-year main-sequence lifespan.',
        keyPhenomena: ['Core Fusion Ignition', 'Hydrostatic Stabilization', 'Young Magnetic Activity'],
        analogousStarIds: ['proxima-centauri', 'trappist-1'],
        visualType: 'star',
      },
      {
        progress: 0.45,
        timeElapsedLabel: '5 Trillion Years',
        ageYears: 5_000_000_000_000,
        stageName: 'Mature Convective Red Dwarf (Class M V)',
        category: 'main-sequence',
        surfaceTempKelvin: 3100,
        coreTempKelvin: 8500000,
        radiusSolar: 0.18,
        luminositySolar: 0.0018,
        spectralClassEquivalent: 'M5 V',
        colorHex: '#f87171',
        glowColorHex: '#ef4444',
        coreEngine: 'Leisurely p-p Chain Fusion with 100% Fuel Circulation',
        dominantPressure: 'Hydrostatic Equilibrium (Convective Gas)',
        shortDescription:
          'Mid-life (45%): Full interior convection continuously cycles fresh hydrogen from the outer envelope into the core, burning for trillions of years.',
        detailedPhysics:
          'Unlike solar-mass stars that have a radiative zone trapping helium ash in the core, red dwarfs dredge helium throughout the star and consume nearly 100% of their hydrogen reserve.',
        keyPhenomena: ['Superflares', 'Trillion-Year Stability', '100% Convective Fuel Efficiency'],
        analogousStarIds: ['proxima-centauri', 'trappist-1', 'kapteyns-star'],
        visualType: 'star',
      },
      {
        progress: 0.82,
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
        coreEngine: 'Final Hydrogen Depletion without Helium Flash',
        dominantPressure: 'Radiation + Gas Pressure (Radiative Zone Forms)',
        shortDescription:
          'Late stellar life (82%): As hydrogen fuel drops below 10%, increasing opacity causes the star to contract and heat up into a hot blue dwarf instead of a red giant.',
        detailedPhysics:
          'Because its mass is too low to reach the 100 million K needed for triple-alpha helium fusion, the star never swells into a red giant. Instead, its surface temperature rises dramatically as its final hydrogen burns out.',
        keyPhenomena: ['No Red Giant Expansion', 'Direct Heating to Blue-White', 'Final Hydrogen Exhaustion'],
        analogousStarIds: [],
        visualType: 'star',
      },
      {
        progress: 1.0,
        timeElapsedLabel: '10 Trillion Years (Star Dies)',
        ageYears: 10_000_000_000_000,
        stageName: 'Newly Formed Helium White Dwarf (Star Death)',
        category: 'remnant',
        surfaceTempKelvin: 8000,
        coreTempKelvin: 1000000,
        radiusSolar: 0.015,
        luminositySolar: 0.0005,
        spectralClassEquivalent: 'Helium White Dwarf',
        colorHex: '#e2e8f0',
        glowColorHex: '#cbd5e1',
        coreEngine: 'Zero Fusion — Newly Formed Degenerate Helium Core',
        dominantPressure: 'Electron Degeneracy Pressure',
        shortDescription:
          'End of stellar life (100%): Nuclear fusion ceases completely. Without any explosion or planetary nebula, the star contracts into an Earth-sized Helium White Dwarf remnant.',
        detailedPhysics:
          'Having exhausted its hydrogen fuel without ever igniting helium, the star dies peacefully and becomes a degenerate helium white dwarf supported by quantum electron degeneracy pressure.',
        keyPhenomena: ['100% Stellar Death Milestone', 'Helium Degeneracy', 'Peaceful Remnant Transition'],
        analogousStarIds: [],
        visualType: 'cooling-white-dwarf',
        coolingStage: 'white',
      },
      {
        progress: 1.8,
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
        coreEngine: 'Zero Fusion — Faint Residual Thermal Glow',
        dominantPressure: 'Electron Degeneracy Pressure',
        shortDescription:
          'Remnant cooling phase (180%): Shifting through yellow, orange, and dark red as the helium white dwarf slowly radiates its stored heat into deep space.',
        detailedPhysics:
          'With no internal fusion source, the degenerate helium sphere cools across tens of trillions of years, growing dimmer and redder.',
        keyPhenomena: ['Deep Thermal Cooling', 'Universal Cold Era', 'Dim Crimson Ember'],
        analogousStarIds: [],
        visualType: 'cooling-white-dwarf',
        coolingStage: 'orange',
      },
      {
        progress: 2.0,
        timeElapsedLabel: '10^16 Years (Remnant Dies)',
        ageYears: 1e16,
        stageName: 'Helium Black Dwarf (Remnant Extinction)',
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
        shortDescription: 'Remnant dies out (200%): All thermal heat is exhausted. A cold, dark sphere of degenerate helium floats in eternal stasis.',
        detailedPhysics:
          'Having cooled to thermal equilibrium with the cosmic background radiation near absolute zero, the remnant is completely dark forever.',
        keyPhenomena: ['200% Remnant Extinction', 'Dark Solid Sphere', 'Eternal Cosmic Endpoint'],
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
    typicalLifespan: '~10.25 Billion Years (Active 0%–100%) + Trillions (Remnant 100%–200%)',
    fateSummary: 'Planetary Nebula -> Cooling White Dwarf (100%) -> Crystallized Black Dwarf (200%)',
    accentColor: '#f59e0b',
    description:
      'The accurate evolutionary timeline of our Sun: 50 million years of pre-stellar collapse (-100% to 0%), 9+ billion years on the main sequence, rapid red giant/AGB expansion (~88% to 100%), death as a White Dwarf at 100%, and cooling to a Black Dwarf at 200%.',
    checkpoints: [
      {
        progress: -1.0,
        timeElapsedLabel: '-50 Myr (Pre-Birth)',
        ageYears: -50_000_000,
        stageName: 'Giant Molecular Cloud (Stellar Nursery)',
        category: 'nursery',
        surfaceTempKelvin: 15,
        coreTempKelvin: 15,
        radiusSolar: 50000,
        luminositySolar: 0.001,
        spectralClassEquivalent: 'Dark Molecular Cloud',
        colorHex: '#3b82f6',
        glowColorHex: '#60a5fa',
        coreEngine: 'No Fusion — Gravitational Jeans Instability',
        dominantPressure: 'Interstellar Gas & Dust Thermal Pressure',
        shortDescription:
          'Before the star is born (-100%): A cold, dark interstellar cloud of molecular hydrogen (H₂) and dust begins collapsing under gravity.',
        detailedPhysics:
          'When an interstellar gas cloud exceeds the Jeans Mass limit (triggered by a nearby supernova shockwave), gravity overcomes thermal pressure, initiating fragmentation into collapsing pre-stellar cores.',
        keyPhenomena: ['Bok Globules', 'Infrared Emission Only', 'Gravitational Freefall Collapse'],
        analogousStarIds: [],
        visualType: 'nebula',
        nebulaOpacity: 0.95,
      },
      {
        progress: -0.5,
        timeElapsedLabel: '-20 Myr (Protostar)',
        ageYears: -20_000_000,
        stageName: 'Collapsing Protostar & T Tauri Phase',
        category: 'protostar',
        surfaceTempKelvin: 3800,
        coreTempKelvin: 5000000,
        radiusSolar: 3.5,
        luminositySolar: 4.5,
        spectralClassEquivalent: 'Pre-MS (T Tauri)',
        colorHex: '#f97316',
        glowColorHex: '#fb923c',
        coreEngine: 'Gravitational Kelvin-Helmholtz Contraction (Pre-Fusion)',
        dominantPressure: 'Hydrostatic Convective Gas Pressure',
        shortDescription:
          'Pre-main-sequence contraction (-50%): Bipolar protostellar jets shed angular momentum while the contracting T Tauri core heats toward 10 million K.',
        detailedPhysics:
          'Powered by gravitational contraction along the Hayashi and Henyey tracks, intense T Tauri winds clear the protoplanetary disk as the core approaches the hydrogen fusion ignition threshold.',
        keyPhenomena: ['Protoplanetary Accretion Disk', 'Bipolar Gas Jets (Herbig-Haro)', 'T Tauri Magnetic Winds'],
        analogousStarIds: [],
        visualType: 'protostar',
      },
      {
        progress: 0.0,
        timeElapsedLabel: '0 yr (Star Birth / ZAMS)',
        ageYears: 0,
        stageName: 'Zero-Age Main Sequence (Star Born / ZAMS)',
        category: 'main-sequence',
        surfaceTempKelvin: 5600,
        coreTempKelvin: 13500000,
        radiusSolar: 0.89,
        luminositySolar: 0.7,
        spectralClassEquivalent: 'G2 V (ZAMS)',
        colorHex: '#fef08a',
        glowColorHex: '#fde047',
        coreEngine: 'Sustained Proton-Proton (p-p) Chain Ignition',
        dominantPressure: 'Hydrostatic Equilibrium (Gas + Radiation Pressure)',
        shortDescription:
          'End of protostar phase (0%): Core hydrogen fusion ignites in full hydrostatic equilibrium! The star is officially born at ~70% of its modern luminosity.',
        detailedPhysics:
          'Once core temperatures reach ~13.5 million K, proton-proton fusion provides 100% of the star’s luminosity, halting gravitational contraction and anchoring the star on the Zero-Age Main Sequence.',
        keyPhenomena: ['Zero-Age Main Sequence Birth', 'Hydrostatic Thermostat Locked', 'Faint Young Sun Era'],
        analogousStarIds: ['sun', 'alpha-centauri-a'],
        visualType: 'star',
      },
      {
        progress: 0.25,
        timeElapsedLabel: '4.6 Billion Years (Present Sun)',
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
          'Main Sequence (25%): Peaceful, stable core hydrogen fusion converts 600 million tons of hydrogen into helium every second.',
        detailedPhysics:
          'Our Sun maintains hydrostatic equilibrium via a self-regulating negative feedback thermostat, gradually brightening as helium ash accumulates in the core.',
        keyPhenomena: ['Photospheric Granulation', 'Sunspots & Coronal Loops', 'Solar Wind & Heliosphere'],
        analogousStarIds: ['sun', 'alpha-centauri-a'],
        visualType: 'star',
      },
      {
        progress: 0.5,
        timeElapsedLabel: '9.0 Billion Years',
        ageYears: 9_000_000_000,
        stageName: 'Post-Main Sequence Subgiant (Yellow Phase)',
        category: 'giant',
        surfaceTempKelvin: 5000,
        coreTempKelvin: 30000000,
        radiusSolar: 3.2,
        luminositySolar: 6.0,
        spectralClassEquivalent: 'G5 IV - K0 IV (Subgiant)',
        colorHex: '#facc15',
        glowColorHex: '#eab308',
        coreEngine: 'Inert Helium Core Contraction + Thick Hydrogen Shell Ignition',
        dominantPressure: 'Gas Pressure + Rising Shell Radiation Pressure',
        shortDescription:
          'Post-main sequence (50%): Core hydrogen is exhausted. Fusion shifts into a shell around the inert helium core, causing the star to expand into a warm golden-yellow subgiant.',
        detailedPhysics:
          'As the star leaves the Main Sequence across the Subgiant Branch (Hertzsprung Gap), the core contracts isothermally until electron degeneracy sets in while the outer envelope expands and cools slightly.',
        keyPhenomena: ['Leaving Main Sequence', 'Hydrogen Shell Ignition', 'Golden-Yellow Subgiant Swell'],
        analogousStarIds: ['procyon-a'],
        visualType: 'star',
      },
      {
        progress: 0.62,
        timeElapsedLabel: '9.8 Billion Years',
        ageYears: 9_800_000_000,
        stageName: 'First Red Giant Phase (Red Giant Branch / RGB)',
        category: 'giant',
        surfaceTempKelvin: 3800,
        coreTempKelvin: 100000000,
        radiusSolar: 85,
        luminositySolar: 1200,
        spectralClassEquivalent: 'K3 III - M0 III (RGB)',
        colorHex: '#f87171',
        glowColorHex: '#ef4444',
        coreEngine: 'Hydrogen Shell Burning around Degenerate Helium Core -> Helium Flash',
        dominantPressure: 'Electron Degeneracy in Core; Convective Envelope Pressure',
        shortDescription:
          'First Red Giant phase (62%): Accelerated hydrogen shell burning swells the outer envelope by ~100x, engulfing inner planets, culminating in the core Helium Flash!',
        detailedPhysics:
          'As the degenerate helium core reaches ~100 million K and ~0.45 M☉, triple-alpha helium fusion ignites explosively in a runaway Helium Flash that lifts core degeneracy in minutes.',
        keyPhenomena: ['First Red Giant Ascent (RGB)', 'Engulfment of Inner Planets', 'Runaway Core Helium Flash'],
        analogousStarIds: ['aldebaran', 'arcturus'],
        visualType: 'giant',
      },
      {
        progress: 0.72,
        timeElapsedLabel: '10.0 Billion Years',
        ageYears: 10_000_000_000,
        stageName: 'Red Clump Phase (Core Helium Burning)',
        category: 'giant',
        surfaceTempKelvin: 4800,
        coreTempKelvin: 120000000,
        radiusSolar: 11,
        luminositySolar: 65,
        spectralClassEquivalent: 'K0 III (Red Clump / Horizontal Branch)',
        colorHex: '#fb923c',
        glowColorHex: '#f59e0b',
        coreEngine: 'Stable Triple-Alpha Core Helium Fusion (3 He -> C) + H Shell',
        dominantPressure: 'Non-Degenerate Thermal Core Hydrostatic Equilibrium',
        shortDescription:
          'Red Clump phase (72%): After the Helium Flash lifts core degeneracy, the star contracts and warms into a stable golden-orange giant fusing helium into carbon and oxygen in its core.',
        detailedPhysics:
          'The star enjoys a ~100-million-year "second main sequence" on the Red Clump (the metal-rich equivalent of the Horizontal Branch), maintaining a steady luminosity of ~60–70 L☉.',
        keyPhenomena: ['Triple-Alpha Carbon Synthesis', 'Envelope Contraction & Warming', 'Standard Candle Red Clump'],
        analogousStarIds: ['capella-aa', 'pollux'],
        visualType: 'giant',
      },
      {
        progress: 0.88,
        timeElapsedLabel: '10.15 Billion Years',
        ageYears: 10_150_000_000,
        stageName: 'AGB Phase (Asymptotic Giant Branch & Dredge-Up)',
        category: 'giant',
        surfaceTempKelvin: 3100,
        coreTempKelvin: 200000000,
        radiusSolar: 220,
        luminositySolar: 5000,
        spectralClassEquivalent: 'Carbon Star / AGB (M6 III)',
        colorHex: '#dc2626',
        glowColorHex: '#b91c1c',
        coreEngine: 'Double Shell Burning (He Shell + H Shell) over an Inert C-O Core',
        dominantPressure: 'Thermal Pulsing Radiation Pressure',
        shortDescription:
          'AGB phase (88%): Core helium is exhausted. Double shell flashes trigger violent thermal pulses over an inert carbon-oxygen core, swelling the star to Earth’s orbit.',
        detailedPhysics:
          'In the final ~20 million years of giant evolution, thermal pulses and radiation pressure on dredged-up carbon dust grains drive superwinds that eject over half the star’s mass.',
        keyPhenomena: ['Helium Shell Flashes', 'Deep Convective Carbon Dredge-Up', 'Superwind Mass Loss'],
        analogousStarIds: ['la-superba', 'cw-leonis'],
        visualType: 'giant',
      },
      {
        progress: 1.0,
        timeElapsedLabel: '10.25 Billion Years (Star Death / Envelope Shedding)',
        ageYears: 10_250_000_000,
        stageName: 'Planetary Nebula Phase (Envelope Shedding)',
        category: 'explosion',
        surfaceTempKelvin: 120000,
        coreTempKelvin: 150000000,
        radiusSolar: 0.05,
        luminositySolar: 3000,
        spectralClassEquivalent: 'Planetary Nebula + Nascent Core',
        colorHex: '#38bdf8',
        glowColorHex: '#06b6d4',
        coreEngine: 'Fusion Ends — Exposed Ultra-Hot Degenerate Carbon-Oxygen Core',
        dominantPressure: 'Electron Degeneracy Pressure in Core; Expanding Ionized Shell',
        shortDescription:
          'Star death explosion (100%): The outer AGB envelope detaches completely as an iridescent glowing planetary nebula ionized by the scorching central core.',
        detailedPhysics:
          'Hard UV radiation from the newly exposed ~120,000 K core ionizes the expanding gas shells for ~20,000 years before the nebula disperses into interstellar space and leaves the standalone white dwarf remnant.',
        keyPhenomena: ['100% Stellar Death Milestone', 'Iridescent Ionized Gas Shells', 'Forbidden [O III] Cyan Glow'],
        analogousStarIds: ['sirius-b'],
        visualType: 'planetary-nebula',
        explosionExpansion: 0.6,
      },
      {
        progress: 1.15,
        timeElapsedLabel: '10.30 Billion Years (Remnant Birth)',
        ageYears: 10_300_000_000,
        stageName: 'Newly Formed White Dwarf (Remnant Phase)',
        category: 'remnant',
        surfaceTempKelvin: 25000,
        coreTempKelvin: 30000000,
        radiusSolar: 0.012,
        luminositySolar: 0.1,
        spectralClassEquivalent: 'WD (Class DA)',
        colorHex: '#93c5fd',
        glowColorHex: '#60a5fa',
        coreEngine: 'Zero Fusion — Stored Thermal Heat Radiating into Space',
        dominantPressure: 'Electron Degeneracy Pressure (Pauli Exclusion Principle)',
        shortDescription:
          'Remnant phase (115%): The nebula disperses into deep interstellar space, leaving behind an Earth-sized Carbon-Oxygen White Dwarf remnant.',
        detailedPhysics:
          'Supported solely by quantum electron degeneracy pressure with zero nuclear fusion, the remnant now begins its multi-trillion-year cooling journey to black dwarf extinction.',
        keyPhenomena: ['White Dwarf Remnant', 'Extreme Density (~10⁶ g/cm³)', 'Quantum Degenerate Matter'],
        analogousStarIds: ['sirius-b', 'procyon-b'],
        visualType: 'cooling-white-dwarf',
        coolingStage: 'blue-white',
      },
      {
        progress: 1.8,
        timeElapsedLabel: '50 Billion Years',
        ageYears: 50_000_000_000,
        stageName: 'Cooling White Dwarf (White -> Yellow -> Orange -> Dark Red)',
        category: 'remnant',
        surfaceTempKelvin: 3500,
        coreTempKelvin: 1000000,
        radiusSolar: 0.01,
        luminositySolar: 0.0001,
        spectralClassEquivalent: 'Cooling White Dwarf (Class DC / DZ)',
        colorHex: '#ea580c',
        glowColorHex: '#9a3412',
        coreEngine: 'Zero Fusion — Stored Thermal Glow & Core Crystallization',
        dominantPressure: 'Electron Degeneracy Pressure',
        shortDescription:
          'Remnant cooling phase (180%): With no fusion source, the degenerate Earth-sized core slowly cools across tens of billions of years, shifting through white, yellow, orange, and dark red as its interior freezes into a solid diamond crystal lattice.',
        detailedPhysics:
          'Because the white dwarf has a tiny surface area and an insulating atmosphere, trapped thermal energy escapes slowly. As the interior drops below ~10 million K, carbon and oxygen ions crystallize into a solid lattice (releasing latent heat) before entering the Debye cooling regime toward cosmic extinction.',
        keyPhenomena: ['Thermal Cooling Sequence', 'Interior Core Crystallization', 'Debye Lattice Cooling'],
        analogousStarIds: ['van-maanens-star'],
        visualType: 'cooling-white-dwarf',
        coolingStage: 'orange',
      },
      {
        progress: 2.0,
        timeElapsedLabel: '10^15 Years (Remnant Dies)',
        ageYears: 1e15,
        stageName: 'Crystallized Black Dwarf (Remnant Extinction)',
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
          'Remnant dies out (200%): An utterly cold, pitch-black sphere of crystallized carbon (diamond) and oxygen in eternal thermal equilibrium with deep space.',
        detailedPhysics:
          'Having radiated away all thermal energy over a quadrillion years, the black dwarf emits zero optical light and remains a cold degenerate monolith forever.',
        keyPhenomena: ['200% Remnant Extinction', 'Cosmic Diamond Monolith', 'Eternal Degenerate Relic'],
        analogousStarIds: [],
        visualType: 'black-dwarf',
        coolingStage: 'black-dwarf',
      },
    ],
  },

  // =========================================================================
  // TRACK 3: MASSIVE STAR (8 to 25 M☉ - Betelgeuse, Rigel, Spica)
  // =========================================================================
  {
    id: 'massive',
    name: 'Massive Star',
    massLabel: '8 to 25 Solar Masses (e.g. Betelgeuse ~16 M☉, Rigel ~21 M☉)',
    initialMassSolar: 16.0,
    typicalLifespan: '~20 Million Years (Active 0%–100%) + Trillions (Neutron Star 100%–200%)',
    fateSummary: 'Core-Collapse Supernova -> Pulsar / Neutron Star (100%) -> Cold Neutron Star (200%)',
    accentColor: '#38bdf8',
    description:
      'Rapid 500,000-year pre-stellar formation (-100% to 0%), 18 million years of fierce blue CNO main-sequence burning (0% to 88%), rapid supergiant onion-shell fusion (88% to 98%), supernova death into a Pulsar at 100%, and cooling to a Cold Neutron Star at 200%.',
    checkpoints: [
      {
        progress: -1.0,
        timeElapsedLabel: '-500 kyr (Pre-Birth)',
        ageYears: -500_000,
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
          'Before the star is born (-100%): A massive, dense molecular cloud core collapses rapidly under intense self-gravity.',
        detailedPhysics:
          'Massive stars assemble inside dense cluster cores like the Orion Nebula, collapsing hundreds of times faster than solar-mass stars.',
        keyPhenomena: ['Trapezium-like Nursery', 'Supersonic Shock Fronts', 'High-Mass Infall'],
        analogousStarIds: [],
        visualType: 'nebula',
        nebulaOpacity: 1.0,
      },
      {
        progress: -0.5,
        timeElapsedLabel: '-150 kyr (Protostar)',
        ageYears: -150_000,
        stageName: 'Massive Protostar & Hyper-Accretion',
        category: 'protostar',
        surfaceTempKelvin: 12000,
        coreTempKelvin: 20000000,
        radiusSolar: 15,
        luminositySolar: 2000,
        spectralClassEquivalent: 'Herbig Ae/Be Protostar',
        colorHex: '#60a5fa',
        glowColorHex: '#3b82f6',
        coreEngine: 'Rapid Kelvin-Helmholtz Compression',
        dominantPressure: 'Turbulent Gas & Radiation Pressure',
        shortDescription:
          'Pre-main-sequence contraction (-50%): High-rate accretion feeds the massive protostar while powerful bipolar outflows carve cavities through the natal dust cloud.',
        detailedPhysics:
          'Because of its short Kelvin-Helmholtz timescale, the massive protostar contracts rapidly along a nearly horizontal radiative track toward the Zero-Age Main Sequence.',
        keyPhenomena: ['Massive Bipolar Outflows', 'Ultracompact H II Region', 'Radiative Feedback'],
        analogousStarIds: [],
        visualType: 'protostar',
      },
      {
        progress: 0.0,
        timeElapsedLabel: '0 yr (Star Birth / ZAMS)',
        ageYears: 0,
        stageName: 'Zero-Age Main Sequence Blue Star (Star Born)',
        category: 'main-sequence',
        surfaceTempKelvin: 30000,
        coreTempKelvin: 35000000,
        radiusSolar: 7.2,
        luminositySolar: 28000,
        spectralClassEquivalent: 'B0 V (ZAMS)',
        colorHex: '#b0d0ff',
        glowColorHex: '#ddecff',
        coreEngine: 'CNO Catalytic Hydrogen Fusion Ignition',
        dominantPressure: 'Radiation Pressure + Hydrostatic Gas Pressure',
        shortDescription:
          'End of protostar phase (0%): The CNO cycle ignites in full equilibrium and blows away the remaining dust cocoon. A brilliant blue main-sequence star is born!',
        detailedPhysics:
          'Core temperatures reach 35 million K, igniting the Carbon-Nitrogen-Oxygen catalytic cycle inside a convective core surrounded by a radiative envelope.',
        keyPhenomena: ['CNO Cycle Ignition', 'Natal Cocoon Dispersal', 'Intense UV Ionization'],
        analogousStarIds: ['spica', 'bellatrix'],
        visualType: 'star',
      },
      {
        progress: 0.35,
        timeElapsedLabel: '10 Million Years',
        ageYears: 10_000_000,
        stageName: 'Luminous Blue-White Main Sequence (Class B V)',
        category: 'main-sequence',
        surfaceTempKelvin: 28000,
        coreTempKelvin: 38000000,
        radiusSolar: 8.5,
        luminositySolar: 35000,
        spectralClassEquivalent: 'B0 V - B1 V (e.g. Spica)',
        colorHex: '#b0d0ff',
        glowColorHex: '#ddecff',
        coreEngine: 'Carbon-Nitrogen-Oxygen (CNO) Catalytic Cycle',
        dominantPressure: 'High Radiation Pressure + Hydrostatic Gas Pressure',
        shortDescription:
          'Main-sequence phase (35%): Burning fiercely at 35,000 L☉ via the CNO cycle across its ~18-million-year hydrogen-burning era.',
        detailedPhysics:
          'The CNO cycle energy generation rate scales as T¹⁷, driving intense core convection and line-driven stellar winds moving at thousands of km/s.',
        keyPhenomena: ['Extreme Ultraviolet Radiance', 'Powerful Stellar Wind', 'Fast Equatorial Rotation'],
        analogousStarIds: ['spica', 'bellatrix', 'achernar'],
        visualType: 'star',
      },
      {
        progress: 0.60,
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
          'Supergiant transition (60%): Core hydrogen exhausts and triple-alpha helium fusion ignites, swelling the star into a luminous blue supergiant like Rigel.',
        detailedPhysics:
          'Core helium burning lasts ~2 million years, causing the star to expand and migrate across the top of the H-R diagram.',
        keyPhenomena: ['Core Helium Fusion', 'Massive Dense Stellar Wind', 'Alpha Cygni Pulsations'],
        analogousStarIds: ['rigel', 'deneb'],
        visualType: 'giant',
      },
      {
        progress: 0.75,
        timeElapsedLabel: '19.9 Million Years',
        ageYears: 19_900_000,
        stageName: 'Red Supergiant with Onion Fusion Layers (Class M I)',
        category: 'giant',
        surfaceTempKelvin: 3500,
        coreTempKelvin: 3000000000,
        radiusSolar: 950,
        luminositySolar: 110000,
        spectralClassEquivalent: 'M1-2 Ia-ab (like Betelgeuse / Antares)',
        colorHex: '#ef4444',
        glowColorHex: '#dc2626',
        coreEngine: 'Concentric Onion Fusion Layers: H -> He -> C -> Ne -> O -> Si -> Inert Fe Core',
        dominantPressure: 'Core Degeneracy Fighting Massive Gravity; Fluffy Outer Envelope',
        shortDescription:
          'Red Supergiant stage (75%): Swollen to Jupiter’s orbit while the core races through carbon, neon, oxygen, and silicon fusion, building an inert iron core in days.',
        detailedPhysics:
          'Heavy element burning accelerates exponentially: Carbon burns for ~1,000 years, Neon for ~3 years, Oxygen for ~6 months, and Silicon into Iron in just ~1 day! Iron cannot fuse exothermically.',
        keyPhenomena: ['Onion-Shell Fusion Core', 'Giant Convective Supergranules', 'Imminent Iron Core Collapse'],
        analogousStarIds: ['betelgeuse', 'antares'],
        visualType: 'giant',
      },
      {
        progress: 1.0,
        timeElapsedLabel: '20.0 Million Years (Star Death / Supernova)',
        ageYears: 20_000_000,
        stageName: 'Type II Core-Collapse Supernova (Cataclysmic Explosion)',
        category: 'explosion',
        surfaceTempKelvin: 100000000,
        coreTempKelvin: 100000000000,
        radiusSolar: 0.00003,
        luminositySolar: 5000000000,
        spectralClassEquivalent: 'Supernova Type II',
        colorHex: '#e0f2fe',
        glowColorHex: '#38bdf8',
        coreEngine: 'Iron Core Collapse + Neutronization (p + e⁻ -> n + ν) + Neutrino Rebound Shock',
        dominantPressure: 'Neutron Degeneracy Pressure Rebound Shockwave',
        shortDescription:
          'Star death explosion (100%): The iron core collapses in milliseconds, launching a cataclysmic supernova shockwave outshining a galaxy before settling into a neutron star remnant!',
        detailedPhysics:
          'Electrons are crushed into protons to form neutrons and a flood of 10⁵⁸ neutrinos. When nuclear density is reached, the core stiffens and rebounds, blasting the outer star apart at 15,000 km/s.',
        keyPhenomena: ['100% Stellar Death Milestone', 'R-Process Heavy Nucleosynthesis', 'Galaxy-Outshining Blast'],
        analogousStarIds: [],
        visualType: 'supernova',
        explosionExpansion: 0.85,
      },
      {
        progress: 1.15,
        timeElapsedLabel: '20.05 Million Years (Remnant Birth)',
        ageYears: 20_050_000,
        stageName: 'Young Pulsar / Neutron Star (Remnant Phase)',
        category: 'remnant',
        surfaceTempKelvin: 1500000,
        coreTempKelvin: 100000000,
        radiusSolar: 0.000028,
        luminositySolar: 1000,
        spectralClassEquivalent: 'Pulsar (PSR / NS)',
        colorHex: '#67e8f9',
        glowColorHex: '#06b6d4',
        coreEngine: 'Rotational Kinetic Energy Loss + Relativistic Synchrotron Wind',
        dominantPressure: 'Neutron Degeneracy Pressure (Strong Nuclear Force Repulsion)',
        shortDescription:
          'Remnant phase (115%): The supernova blast wave expands outward into deep space, leaving behind a 20-km city-sized Neutron Star / Pulsar spinning rapidly with twin lighthouse beams.',
        detailedPhysics:
          'Conservation of angular momentum and magnetic flux compresses 1.4 M☉ into a 20-km sphere with a 10¹² Gauss magnetic field, kicking off its post-death remnant evolution.',
        keyPhenomena: ['Relativistic Lighthouse Beams', '10¹² Gauss Magnetosphere', 'Neutron Degeneracy Remnant'],
        analogousStarIds: ['crab-pulsar', 'vela-pulsar'],
        visualType: 'pulsar',
      },
      {
        progress: 1.55,
        timeElapsedLabel: '500 Million Years',
        ageYears: 500_000_000,
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
          'Remnant decay phase (150%): Magnetic dipole braking slows the spin rate below the pulsar death line as the synchrotron beams fade and the neutron crust cools.',
        detailedPhysics:
          'Over hundreds of millions of years, neutrino emission and thermal photon radiation cool the neutron star interior while ohmic dissipation weakens its magnetic field.',
        keyPhenomena: ['Crossing Pulsar Death Line', 'Magnetic Field Decay', 'Fading Synchrotron Lighthouse'],
        analogousStarIds: ['rx-j1856-3754'],
        visualType: 'pulsar',
      },
      {
        progress: 2.0,
        timeElapsedLabel: '10^15 Years (Remnant Dies)',
        ageYears: 1e15,
        stageName: 'Cold Neutron Star (Remnant Extinction / Black Neutron Stasis)',
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
          'Remnant dies out (200%): All rotational, magnetic, and thermal energy is exhausted. A pitch-black, cold 20-km sphere of nuclear matter rests in eternal stasis.',
        detailedPhysics:
          'Analogous to a black dwarf, the cold neutron star has cooled to 2.7 K equilibrium with the cosmic background, detectable only via gravitational microlensing.',
        keyPhenomena: ['200% Remnant Extinction', 'Zero Magnetic Emission', 'Permanent Nuclear Pasta Monolith'],
        analogousStarIds: [],
        visualType: 'cold-neutron-star',
      },
    ],
  },

  // =========================================================================
  // TRACK 4: HYPER-MASSIVE STAR (> 25 to 100+ M☉ - Eta Carinae, WR 102)
  // =========================================================================
  {
    id: 'hyper-massive',
    name: 'Hyper-Massive Star',
    massLabel: '25 to 100+ Solar Masses (e.g. Eta Carinae ~100 M☉, WR 102)',
    initialMassSolar: 60.0,
    typicalLifespan: '~3.2 Million Years (Active 0%–100%) + Eternal Black Hole (100%–200%)',
    fateSummary: 'Hypernova / GRB -> Accreting Black Hole (100%) -> Quiescent / Evaporating Black Hole (200%)',
    accentColor: '#3b82f6',
    description:
      'Torrential 200,000-year pre-stellar collapse (-100% to 0%), ~2.8 million years of blinding Class O main-sequence fusion (0% to 88%), violent Luminous Blue Variable eruptions (88% to 97%), Hypernova collapse into a Black Hole at 100%, and quiescent singularity stasis at 200%.',
    checkpoints: [
      {
        progress: -1.0,
        timeElapsedLabel: '-200 kyr (Pre-Birth)',
        ageYears: -200_000,
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
          'Before the star is born (-100%): A colossal starburst cloud core collapses under extreme gravity, assembling dozens of solar masses.',
        detailedPhysics:
          'Requires extraordinary accretion rates (~10⁻³ M☉/yr) to overcome radiation pressure and assemble a 60–100+ M☉ pre-stellar core in just 200,000 years.',
        keyPhenomena: ['Giant H II Nursery', 'Torrential Mass Infall', 'Extreme Starburst Core'],
        analogousStarIds: [],
        visualType: 'nebula',
        nebulaOpacity: 1.0,
      },
      {
        progress: -0.5,
        timeElapsedLabel: '-50 kyr (Protostar)',
        ageYears: -50_000,
        stageName: 'Hyper-Massive Protostar & Monster Accretion',
        category: 'protostar',
        surfaceTempKelvin: 18000,
        coreTempKelvin: 25000000,
        radiusSolar: 24,
        luminositySolar: 60000,
        spectralClassEquivalent: 'Class O Protostar',
        colorHex: '#60a5fa',
        glowColorHex: '#3b82f6',
        coreEngine: 'Rapid Gravitational Compression + Accretion Shock',
        dominantPressure: 'Hydrostatic Shock vs Gravitational Infall',
        shortDescription:
          'Pre-main-sequence contraction (-50%): A monster protostellar core accreting through a dense disk while blasting collimated bipolar jets.',
        detailedPhysics:
          'Radiation pressure channels infalling gas along an equatorial disk while blowing twin polar outflow funnels through the surrounding molecular cloud.',
        keyPhenomena: ['Bipolar Outflow Funnels', 'Extreme Radiation Pressure', 'Hyper-Accretion Disk'],
        analogousStarIds: [],
        visualType: 'protostar',
      },
      {
        progress: 0.0,
        timeElapsedLabel: '0 yr (Star Birth / ZAMS)',
        ageYears: 0,
        stageName: 'Zero-Age Main Sequence Class O Star (Star Born)',
        category: 'main-sequence',
        surfaceTempKelvin: 48000,
        coreTempKelvin: 55000000,
        radiusSolar: 18,
        luminositySolar: 1500000,
        spectralClassEquivalent: 'O3 V (ZAMS)',
        colorHex: '#70b5ff',
        glowColorHex: '#3b82f6',
        coreEngine: 'Full CNO Catalytic Core Hydrogen Fusion',
        dominantPressure: 'Dominant Radiation Pressure + Convective Core',
        shortDescription:
          'End of protostar phase (0%): Sustained core hydrogen fusion ignites! The newborn Class O star shines at 1.5 million Suns, clearing its natal cloud.',
        detailedPhysics:
          'At 0% lifespan, the hyper-massive star reaches hydrostatic equilibrium on the Zero-Age Main Sequence, powered by a massive convective core burning hydrogen via the CNO cycle.',
        keyPhenomena: ['Zero-Age Main Sequence Birth', '1.5 Million L☉ Output', 'Supersonic Radiation Wind'],
        analogousStarIds: ['melnick-42', 'zeta-puppis'],
        visualType: 'star',
      },
      {
        progress: 0.38,
        timeElapsedLabel: '1.6 Million Years',
        ageYears: 1_600_000,
        stageName: 'Luminous Class O Supergiant / Wolf-Rayet',
        category: 'main-sequence',
        surfaceTempKelvin: 50000,
        coreTempKelvin: 60000000,
        radiusSolar: 22,
        luminositySolar: 2000000,
        spectralClassEquivalent: 'Class O2-O4 If* / WN (e.g. Melnick 42 / WR 102)',
        colorHex: '#70b5ff',
        glowColorHex: '#3b82f6',
        coreEngine: 'Extreme CNO Hydrogen Burning -> Stripped Helium Core',
        dominantPressure: 'Radiation Pressure Near Eddington Limit',
        shortDescription:
          'Main-sequence phase (38%): Searing blue star shining at 2 million L☉, driving 3,000 km/s stellar winds across its brief ~2.9-million-year main-sequence life.',
        detailedPhysics:
          'Line-driven winds shed 10⁻⁵ M☉ per year, progressively stripping the outer hydrogen envelope and exposing CNO-processed nitrogen and helium at the surface.',
        keyPhenomena: ['Pure Radiant Class O Blue', 'Violent 3,000 km/s Wind', 'Wolf-Rayet Envelope Stripping'],
        analogousStarIds: ['melnick-42', 'zeta-puppis', 'vfts-352', 'wr-102'],
        visualType: 'star',
      },
      {
        progress: 0.68,
        timeElapsedLabel: '2.9 Million Years',
        ageYears: 2_900_000,
        stageName: 'Luminous Blue Variable (LBV) / Hypergiant Eruptions',
        category: 'giant',
        surfaceTempKelvin: 18000,
        coreTempKelvin: 400000000,
        radiusSolar: 600,
        luminositySolar: 5000000,
        spectralClassEquivalent: 'LBV / Hypergiant (like Eta Carinae)',
        colorHex: '#38bdf8',
        glowColorHex: '#0284c7',
        coreEngine: 'Helium, Carbon & Neon Core Burning + Eddington Instability',
        dominantPressure: 'Eddington Limit Breached — Episodic Envelope Ejection',
        shortDescription:
          'Luminous Blue Variable (68%): Searing blue hypergiant shining at 5 million Suns on the brink of the Eddington limit, triggering giant mass-loss eruptions like Eta Carinae’s Homunculus Nebula.',
        detailedPhysics:
          'After core hydrogen exhaustion, post-main-sequence core helium and carbon burning lasts ~300,000 years, marked by violent S Doradus and giant LBV eruptions.',
        keyPhenomena: ['Homunculus Bipolar Lobes', 'Eddington Limit Breaches', 'Giant Mass-Loss Eruptions'],
        analogousStarIds: ['eta-carinae-a', 'pistol-star'],
        visualType: 'giant',
      },
      {
        progress: 1.0,
        timeElapsedLabel: '3.20 Million Years (Star Death / Hypernova)',
        ageYears: 3_200_000,
        stageName: 'Hypernova / Collapsar & Long Gamma-Ray Burst (GRB)',
        category: 'explosion',
        surfaceTempKelvin: 500000000,
        coreTempKelvin: 1000000000000,
        radiusSolar: 0.00001,
        luminositySolar: 100000000000,
        spectralClassEquivalent: 'Hypernova / GRB Blast',
        colorHex: '#f43f5e',
        glowColorHex: '#fda4af',
        coreEngine: 'Direct Core Collapse to Singularity + Relativistic Polar Jet Breakout',
        dominantPressure: 'Gravitational Collapse Overwhelms All Degeneracy Pressures',
        shortDescription:
          'Star death explosion (100%): The massive core collapses past neutron degeneracy into a singularity, launching 0.99999c GRB hypernova jets before settling into a Black Hole remnant!',
        detailedPhysics:
          'Even neutron degeneracy pressure fails completely. As the core implodes into an event horizon, magnetohydrodynamic forces launch twin ultra-relativistic jets through the stellar poles.',
        keyPhenomena: ['100% Stellar Death Milestone', 'Bipolar Relativistic Jets (0.99999c)', 'Long Gamma-Ray Burst (GRB)'],
        analogousStarIds: [],
        visualType: 'hypernova',
        explosionExpansion: 0.95,
      },
      {
        progress: 1.15,
        timeElapsedLabel: '3.25 Million Years (Remnant Birth)',
        ageYears: 3_250_000,
        stageName: 'Nascent Stellar-Mass Black Hole with Accretion Disk (Remnant Phase)',
        category: 'remnant',
        surfaceTempKelvin: 10000000,
        coreTempKelvin: 0,
        radiusSolar: 0.000043,
        luminositySolar: 10000,
        spectralClassEquivalent: 'Microquasar / Accreting Black Hole',
        colorHex: '#e879f9',
        glowColorHex: '#d946ef',
        coreEngine: 'Gravitational Potential Energy of Relativistic Accretion Disk',
        dominantPressure: 'Infinite Gravitational Curvature (Spacetime Singularity)',
        shortDescription:
          'Remnant phase (115%): The hypernova ejecta disperses, revealing a Stellar-Mass Black Hole remnant surrounded by a blazing relativistic X-ray accretion disk and photon ring.',
        detailedPhysics:
          'Fallback stellar matter orbits near the Innermost Stable Circular Orbit (ISCO), heated to 10⁷ K and beamed relativistically before plunging across the Event Horizon.',
        keyPhenomena: ['Black Hole Remnant', 'Relativistic Doppler Beaming', 'Einstein Photon Ring'],
        analogousStarIds: ['hde-226868'],
        visualType: 'black-hole',
      },
      {
        progress: 2.0,
        timeElapsedLabel: '10^67 Years (Remnant Dies)',
        ageYears: 1e67,
        stageName: 'Isolated / Evaporated Black Hole (Remnant Extinction)',
        category: 'final',
        surfaceTempKelvin: 0.000000006,
        coreTempKelvin: 0,
        radiusSolar: 0.000043,
        luminositySolar: 0.0,
        spectralClassEquivalent: 'Isolated Black Hole -> Hawking Evaporation',
        colorHex: '#020617',
        glowColorHex: '#0f172a',
        coreEngine: 'Zero Accretion — Quantum Hawking Radiation Evaporation (10^67 yr)',
        dominantPressure: 'Vacuum Spacetime Curvature',
        shortDescription:
          'Remnant dies out (200%): With its accretion disk completely exhausted, the black hole sits in pitch-black isolation, slowly evaporating over 10⁶⁷ years via quantum Hawking radiation.',
        detailedPhysics:
          'Once all surrounding gas is consumed, the dormant black hole emits zero light (Hawking temperature ~6 nanokelvin) and eventually evaporates completely via quantum particle pair production near the horizon over ~10⁶⁷ years.',
        keyPhenomena: ['200% Remnant Extinction', 'Pure Gravitational Lensing Shadow', '10⁶⁷ yr Hawking Evaporation'],
        analogousStarIds: ['hde-226868'],
        visualType: 'black-hole',
      },
    ],
  },
];

function formatPositiveAge(years: number): string {
  if (years < 1000) return `${Math.round(years)} yr`;
  if (years < 100000) return `${(years / 1000).toFixed(1)} kyr`;
  if (years < 1_000_000) return `${Math.round(years / 1000)} kyr`;
  if (years < 10_000_000) return `${(years / 1e6).toFixed(2)} Myr`;
  if (years < 1_000_000_000) return `${(years / 1e6).toFixed(1)} Myr`;
  if (years < 10_000_000_000) return `${(years / 1e9).toFixed(2)} Gyr`;
  if (years < 1_000_000_000_000) return `${(years / 1e9).toFixed(1)} Gyr`;
  if (years < 100_000_000_000_000) return `${(years / 1e12).toFixed(2)} Trillion yr`;
  const exp = Math.floor(Math.log10(years));
  const base = (years / Math.pow(10, exp)).toFixed(2);
  if (base === '1.00') return `10^${exp} yr`;
  return `${base} × 10^${exp} yr`;
}

// Helper to format astrophysical ages into readable cosmic units (supports negative pre-birth ages)
export function formatCosmicAge(years: number): string {
  if (Math.abs(years) < 1) return '0 yr (Star Birth / ZAMS)';
  if (years < 0) {
    return `-${formatPositiveAge(Math.abs(years))} (Pre-Birth)`;
  }
  return formatPositiveAge(years);
}

/**
 * Maps astrophysical timeline progress (-1.0 to 2.0) to physical slider position (0.0 to 1.0)
 * - Protostar phase: 15% of slider (slider 0.00 to 0.15 for timeline -1.0 to 0.0)
 * - Main sequence phase: 40% of slider (slider 0.15 to 0.55 for timeline 0.0 to 0.50)
 * - Post-main sequence phase: 30% of slider (slider 0.55 to 0.85 for timeline 0.50 to 1.00)
 * - Remnant phase: 15% of slider (slider 0.85 to 1.00 for timeline 1.00 to 2.00)
 */
export function timelineToSlider(timelineProgress: number): number {
  if (timelineProgress <= 0) {
    // -1.0 to 0.0 maps linearly to 0.00 to 0.15
    return Math.max(0, (timelineProgress + 1.0) * 0.15);
  } else if (timelineProgress <= 0.50) {
    // 0.0 to 0.50 maps linearly to 0.15 to 0.55
    return 0.15 + (timelineProgress / 0.50) * 0.40;
  } else if (timelineProgress <= 1.00) {
    // 0.50 to 1.00 maps linearly to 0.55 to 0.85
    return 0.55 + ((timelineProgress - 0.50) / 0.50) * 0.30;
  } else {
    // 1.00 to 2.00 maps linearly to 0.85 to 1.00
    return Math.min(1.0, 0.85 + ((timelineProgress - 1.00) / 1.00) * 0.15);
  }
}

/**
 * Maps physical slider position (0.0 to 1.0) to astrophysical timeline progress (-1.0 to 2.0)
 * - 0.00 to 0.15 maps to -1.0 to 0.0 (Protostar)
 * - 0.15 to 0.55 maps to 0.0 to 0.50 (Main sequence)
 * - 0.55 to 0.85 maps to 0.50 to 1.00 (Post-main sequence)
 * - 0.85 to 1.00 maps to 1.00 to 2.00 (Remnant)
 */
export function sliderToTimeline(sliderVal: number): number {
  const s = Math.max(0, Math.min(1.0, sliderVal));
  if (s <= 0.15) {
    return -1.0 + (s / 0.15) * 1.0;
  } else if (s <= 0.55) {
    return ((s - 0.15) / 0.40) * 0.50;
  } else if (s <= 0.85) {
    return 0.50 + ((s - 0.55) / 0.30) * 0.50;
  } else {
    return 1.00 + ((s - 0.85) / 0.15) * 1.00;
  }
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

// Mathematical interpolation helper between checkpoints along a track (-1.0 to 2.0)
export function interpolateCheckpoint(
  track: StellarTrack,
  progress: number
): InterpolatedTelemetry {
  const clampedProgress = Math.max(-1.0, Math.min(2.0, progress));
  const pts = track.checkpoints;

  let currentIdx = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    if (clampedProgress >= pts[i].progress && clampedProgress < pts[i + 1].progress) {
      currentIdx = i;
      break;
    }
  }
  if (clampedProgress >= pts[pts.length - 1].progress) {
    currentIdx = pts.length - 1;
  }

  const current = pts[currentIdx];
  const next = pts[Math.min(currentIdx + 1, pts.length - 1)];

  const span = Math.max(0.0001, next.progress - current.progress);
  const alpha = current === next ? 0 : Math.max(0, Math.min(1, (clampedProgress - current.progress) / span));

  // Logarithmic interpolation for temperature and radius which span multiple orders of magnitude
  const logTemp =
    Math.log10(Math.max(1e-9, current.surfaceTempKelvin)) * (1 - alpha) +
    Math.log10(Math.max(1e-9, next.surfaceTempKelvin)) * alpha;
  const interpolatedTemp = Math.round(Math.pow(10, logTemp));

  const logRad =
    Math.log10(Math.max(0.00001, current.radiusSolar)) * (1 - alpha) +
    Math.log10(Math.max(0.00001, next.radiusSolar)) * alpha;
  const interpolatedRadius = Math.pow(10, logRad);

  const logLum =
    Math.log10(Math.max(0.000001, current.luminositySolar)) * (1 - alpha) +
    Math.log10(Math.max(0.000001, next.luminositySolar)) * alpha;
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

  // Continuous astrophysical age interpolation across pre-birth (-100%..0%), active life (0%..100%), and remnant (100%..200%)
  let interpolatedAgeYears: number;
  if (current.ageYears < 0 || next.ageYears <= 0) {
    interpolatedAgeYears = current.ageYears + (next.ageYears - current.ageYears) * alpha;
  } else if (current.ageYears === 0) {
    interpolatedAgeYears = next.ageYears * alpha;
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
