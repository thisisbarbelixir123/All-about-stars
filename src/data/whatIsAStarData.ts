export interface StellarAnatomyLayer {
  id: string;
  name: string;
  depthFraction: string;
  temperature: string;
  density: string;
  physicalState: string;
  summary: string;
  details: string[];
  color: string;
  accentHex: string;
}

export interface FusionMechanism {
  id: string;
  title: string;
  primaryMassRange: string;
  coreTemperatureRequired: string;
  fuelAndProduct: string;
  description: string;
  stepSequence: string[];
  keyCharacteristic: string;
}

export interface FundamentalStellarProperty {
  id: string;
  title: string;
  symbol: string;
  formula?: string;
  unit: string;
  whyItMatters: string;
  description: string;
  extremeExamples: {
    minimum: string;
    solar: string;
    maximum: string;
  };
}

export const WHAT_IS_A_STAR_CORE_INFO = {
  headline: "What is a Star?",
  tagline: "The Self-Luminous Thermonuclear Engines of the Cosmos",
  scientificDefinition:
    "A star is a gravitationally bound, massive sphere of incandescent plasma held in hydrostatic equilibrium by the balance between its inward self-gravity and outward radiation/thermal pressure, sustained by nuclear fusion occurring deep within its core.",
  cosmicSignificance:
    "Stars are the primary engines of cosmic evolution. Almost every atomic nucleus in the universe heavier than helium—including the oxygen we breathe, the carbon in our DNA, the calcium in our bones, and the iron in our blood—was forged inside the nuclear furnaces of ancient stars or synthesized during cataclysmic supernovae and neutron star mergers.",
  milkyWayCount: "100–400 Billion Stars",
  observableUniverseCount: "~2 × 10²⁴ Stars (2 Septillion)",
};

export const STELLAR_ANATOMY_LAYERS: StellarAnatomyLayer[] = [
  {
    id: 'core',
    name: 'The Thermonuclear Core',
    depthFraction: '0.00 – 0.25 R☉ (Innermost 25% by radius)',
    temperature: '15,000,000 to 100,000,000+ K',
    density: '~150 g/cm³ (150× density of liquid water)',
    physicalState: 'Hyper-dense, fully ionized plasma of bare protons and electrons',
    summary:
      'The gravitational pressure cooker where nuclear fusion takes place, converting mass directly into radiant energy via E = mc².',
    details: [
      'In low-to-intermediate mass stars like our Sun, 600 million tons of hydrogen are converted into helium each second.',
      'The core generates virtually 99% of the star’s total thermal and radiative power output.',
      'Gamma-ray photons born here possess staggering energy, which begins a million-year journey to reach the surface.',
    ],
    color: 'from-amber-400 to-yellow-200',
    accentHex: '#fef08a',
  },
  {
    id: 'radiative',
    name: 'Radiative Zone',
    depthFraction: '0.25 – 0.70 R☉',
    temperature: '7,000,000 K down to 2,000,000 K',
    density: '20 g/cm³ down to 0.2 g/cm³',
    physicalState: 'Dense ionized gas where photons travel via continuous absorption & re-emission',
    summary:
      'A dense zone where energy slowly random-walks outward through radiation rather than bulk fluid movement.',
    details: [
      'Photons undergo countless trillions of Compton scatterings and absorption-reemission cycles.',
      'It takes between 100,000 and 1,000,000 years for the energy born in the core to traverse this zone.',
      'As photons drift outward, high-energy gamma rays degrade gradually into X-ray and extreme ultraviolet wavelengths.',
    ],
    color: 'from-amber-500 to-orange-400',
    accentHex: '#f59e0b',
  },
  {
    id: 'tachocline',
    name: 'The Tachocline',
    depthFraction: '~0.70 R☉ (Thin transitional boundary)',
    temperature: '~2,000,000 K',
    density: '~0.2 g/cm³',
    physicalState: 'Intense magnetic shear layer between rigid rotation and differential rotation',
    summary:
      'The astronomical shear layer believed to generate the star’s global magnetic dynamo through rotational velocity differences.',
    details: [
      'Below this boundary, the radiative zone rotates almost like a solid body.',
      'Above this boundary, the convective zone exhibits strong differential rotation (faster at equator, slower at poles).',
      'This intense shear stretches magnetic field lines into powerful toroidal ropes, driving sunspot cycles and stellar flares.',
    ],
    color: 'from-orange-500 to-red-400',
    accentHex: '#fb923c',
  },
  {
    id: 'convective',
    name: 'Convective Zone',
    depthFraction: '0.70 – 1.00 R☉',
    temperature: '2,000,000 K down to 5,800 K',
    density: '0.2 g/cm³ down to 10⁻⁷ g/cm³',
    physicalState: 'Turbulent boiling plasma cells driven by buoyant thermal convection',
    summary:
      'Where plasma cools enough that radiation is blocked by bound electrons, triggering violent boiling convection currents.',
    details: [
      'Hot plasma plumes rise from the base at speeds exceeding hundreds of kilometers per hour.',
      'Upon reaching the surface, plasma radiates its heat into space, cools, and plunges back down.',
      'This boiling motion creates the cellular "granulation" pattern observed on stellar surfaces.',
    ],
    color: 'from-orange-600 to-red-500',
    accentHex: '#ea580c',
  },
  {
    id: 'photosphere',
    name: 'The Photosphere (Visible Surface)',
    depthFraction: '~1.00 R☉ (Optical depth τ ≈ 2/3, ~400 km thick)',
    temperature: '3,000 K to 50,000+ K (Sun: 5,778 K)',
    density: '~10⁻⁹ g/cm³ (Extremely rarefied gas, 0.01% of Earth sea-level air)',
    physicalState: 'Partially ionized gas transparent to visible electromagnetic wavelengths',
    summary:
      'The optical boundary where stellar material transitions from opaque to transparent, letting light escape freely into the cosmos.',
    details: [
      'This is the layer that defines a star’s visible radius and its effective surface temperature (Teff).',
      'Houses sunspots—regions of localized magnetic flux where convection is suppressed, resulting in cooler (~4,000 K) patches.',
      'Its blackbody radiation spectrum carries the Fraunhofer absorption lines that reveal the star’s exact chemical elements.',
    ],
    color: 'from-yellow-400 to-amber-500',
    accentHex: '#eab308',
  },
  {
    id: 'chromosphere',
    name: 'Chromosphere',
    depthFraction: 'Surface to ~2,000 km above photosphere',
    temperature: '4,500 K climbing paradoxically to ~25,000 K',
    density: '~10⁻¹² g/cm³',
    physicalState: 'Glowing low-density plasma dominated by Hydrogen-Alpha emission',
    summary:
      'A dynamic lower atmospheric layer characterized by a rosy-red glow and jet-like plasma spicules shooting upward.',
    details: [
      'Named from the Greek "chroma" (color) due to the vivid reddish glow produced by the 656.3 nm Hydrogen-Alpha spectral line.',
      'Unlike normal gases, its temperature increases with height due to acoustic and magnetic Alfvén wave heating.',
      'Constantly pierced by tens of thousands of dynamic supersonic spicules ejecting plasma toward the corona.',
    ],
    color: 'from-pink-500 to-rose-400',
    accentHex: '#f43f5e',
  },
  {
    id: 'corona',
    name: 'Corona & Stellar Wind',
    depthFraction: 'Extending millions of kilometers into interstellar space',
    temperature: '1,000,000 K to 3,000,000+ K',
    density: '~10⁻¹⁵ g/cm³ (Ultra-high vacuum by laboratory standards)',
    physicalState: 'Superheated, highly ionized magnetic plasma escaping as stellar wind',
    summary:
      'A halo of magnetically channeled plasma that blows outward into the galaxy, carving out a vast protective astrosphere.',
    details: [
      'The famous "coronal heating paradox": the corona is hundreds of times hotter than the surface below it.',
      'Magnetic reconnection events drive coronal mass ejections (CMEs), releasing billions of tons of energetic particles.',
      'The continuous stream of charged particles forms the stellar wind, which inflates the heliosphere and shields planets from galactic cosmic rays.',
    ],
    color: 'from-cyan-300 to-blue-400',
    accentHex: '#38bdf8',
  },
];

export const FUSION_MECHANISMS: FusionMechanism[] = [
  {
    id: 'pp-chain',
    title: 'The Proton–Proton (p–p) Chain',
    primaryMassRange: 'Stars with mass ≤ 1.3 M☉ (e.g., The Sun, Proxima Centauri, Alpha Centauri A)',
    coreTemperatureRequired: '10,000,000 – 16,000,000 K',
    fuelAndProduct: '4 Protons (¹H) → 1 Helium-4 Nucleus (⁴He) + 2 Positrons + 2 Neutrinos + 26.73 MeV Energy',
    description:
      'The primary fusion mechanism powering the vast majority of stars in the cosmos. Because bare protons carry positive electrostatic charges, they violently repel each other (Coulomb repulsion). Only quantum mechanical tunneling under crushing gravitational core pressure allows two protons to fuse, one converting into a neutron via the weak nuclear force to form deuterium.',
    stepSequence: [
      'Step 1: Two protons fuse into a deuteron (²H), releasing a positron and an electron neutrino.',
      'Step 2: The deuteron rapidly captures another proton to form Helium-3 (³He), releasing a gamma-ray photon.',
      'Step 3: Two Helium-3 nuclei collide to produce one stable Helium-4 (⁴He) nucleus and eject two free protons back into the fuel supply.',
    ],
    keyCharacteristic: 'Fusion rate scales mildly with temperature: Energy production rate ε ∝ T⁴.',
  },
  {
    id: 'cno-cycle',
    title: 'The CNO (Carbon–Nitrogen–Oxygen) Cycle',
    primaryMassRange: 'Stars with mass > 1.3 M☉ (e.g., Sirius A, Vega, Spica, Rigel)',
    coreTemperatureRequired: '> 17,000,000 K',
    fuelAndProduct: '4 Protons → 1 Helium-4 (using ¹²C, ¹³C, ¹⁴N, ¹⁵N, ¹⁵O, ¹⁶O as catalytic intermediates)',
    description:
      'In massive, luminous stars, core temperatures exceed 17 million Kelvin, overcoming the larger electrostatic barriers of heavier nuclei. Carbon, nitrogen, and oxygen nuclei act as nuclear catalysts, looping through a closed sequence of proton captures and beta decays to synthesize helium with ferocious efficiency.',
    stepSequence: [
      'Step 1: Carbon-12 captures a proton to become Nitrogen-13, which beta-decays to Carbon-13.',
      'Step 2: Carbon-13 captures another proton to form Nitrogen-14.',
      'Step 3: Nitrogen-14 captures a third proton to become Oxygen-15, which beta-decays to Nitrogen-15.',
      'Step 4: Nitrogen-15 captures a final proton and breaks apart into Carbon-12 (regenerating the catalyst) and an alpha particle (Helium-4).',
    ],
    keyCharacteristic:
      'Extremely temperature-sensitive: ε ∝ T¹⁶ to T²⁰. A slight increase in core temperature causes astronomical spikes in luminosity.',
  },
  {
    id: 'triple-alpha',
    title: 'Advanced Fusion Shells (Triple-Alpha & Heavy Burning)',
    primaryMassRange: 'Post-main-sequence Giants & Massive Supergiants (Betelgeuse, Antares)',
    coreTemperatureRequired: '100,000,000 K (Helium) to 3,000,000,000 K (Silicon)',
    fuelAndProduct: 'Helium → Carbon → Neon → Oxygen → Silicon → Iron-56 peak',
    description:
      'When core hydrogen exhausts, the core contracts gravitationally until temperatures reach 100 million Kelvin, igniting Helium fusion via the Triple-Alpha process (3 × ⁴He → ¹²C). Massive stars continue through onion-skin fusion shells until forming an inert Iron-56 core. Because iron fusion requires energy instead of releasing it, core collapse is inevitable.',
    stepSequence: [
      'Helium Burning (100M K): 3 ⁴He → ¹²C (Triple-alpha process) and ¹²C + ⁴He → ¹⁶O.',
      'Carbon Burning (600M K): ¹²C + ¹²C → ²⁴Mg, ²⁰Ne, ²³Na.',
      'Neon Burning (1.2B K) & Oxygen Burning (1.5B K) → ²⁸Si, ³²S.',
      'Silicon Burning (3B K): Rapid alpha-captures building iron-peak elements (⁵⁶Fe, ⁵⁶Ni). End of exothermic nuclear chain.',
    ],
    keyCharacteristic:
      'Each successive fuel burns exponentially faster: Silicon burning lasts only a few hours or days before core collapse triggers a Type II supernova.',
  },
];

export const FUNDAMENTAL_STELLAR_PROPERTIES: FundamentalStellarProperty[] = [
  {
    id: 'mass',
    title: 'Stellar Mass',
    symbol: 'M',
    formula: 'Lifespan t ≈ M / L ∝ M⁻².⁵',
    unit: 'Solar Masses (M☉ = 1.989 × 10³⁰ kg)',
    whyItMatters:
      'The single most important variable of any star. Mass dictates its gravitational core pressure, fusion mechanism, surface temperature, color, luminosity, and eventual destiny (White Dwarf vs. Neutron Star vs. Black Hole).',
    description:
      'More massive stars exert vastly higher gravitational compression on their cores. This compresses the fuel and elevates temperatures, driving fusion rates up by factors of millions. Consequently, hyper-massive stars burn through their fuel in a few million years, whereas low-mass red dwarfs can burn steadily for trillions of years.',
    extremeExamples: {
      minimum: '0.075–0.08 M☉ (~80 Jupiter masses) — Lower limit for hydrogen fusion (Brown dwarf boundary)',
      solar: '1.0 M☉ — Typical G-type main sequence star (Lifespan ~10 billion years)',
      maximum: '~150–250 M☉ (e.g. R136a1) — Near the Eddington Luminosity limit where radiation blows outer layers away',
    },
  },
  {
    id: 'temperature',
    title: 'Effective Surface Temperature',
    symbol: 'Teff',
    formula: 'Wien’s Displacement Law: λmax = 2.898 × 10⁻³ m·K / T',
    unit: 'Kelvin (K)',
    whyItMatters:
      'Governs the peak wavelength of electromagnetic radiation emitted by the star, determining its visible color in the telescope eyepiece.',
    description:
      'According to blackbody radiation physics, hotter bodies emit light at shorter, higher-energy wavelengths. Therefore, contrary to everyday faucet color conventions, in astrophysics blue stars are blistering hot (>30,000 K), white and yellow stars are intermediate (5,000–10,000 K), and red stars are the coolest (2,500–3,500 K).',
    extremeExamples: {
      minimum: '2,400–3,000 K — Cool M-dwarfs and Red Supergiants (Betelgeuse, Proxima Centauri)',
      solar: '5,778 K — Yellow-white G2V star',
      maximum: '40,000–55,000+ K — Scorching O2V stars and Wolf-Rayet central stars',
    },
  },
  {
    id: 'luminosity',
    title: 'Stellar Luminosity',
    symbol: 'L',
    formula: 'Stefan–Boltzmann Law: L = 4π R² σ Teff⁴',
    unit: 'Solar Luminosities (L☉ = 3.828 × 10²⁶ Watts)',
    whyItMatters:
      'Measures the true, intrinsic total power radiated by the star across all electromagnetic wavelengths per second.',
    description:
      'Notice that luminosity depends on two distinct factors: the star’s physical surface area (4π R²) and the fourth power of its temperature (Teff⁴). This explains why a cool red hypergiant can shine with 300,000 times the Sun’s luminosity simply because its diameter is immense, while a scorching tiny white dwarf glows with only a fraction of solar luminosity.',
    extremeExamples: {
      minimum: '0.0001 L☉ (1/10,000th Sun) — Dim red dwarfs and degenerate white dwarfs',
      solar: '1.0 L☉ (383 yottawatts)',
      maximum: '4,000,000–8,000,000 L☉ — Monster hypergiants (R136a1, Eta Carinae)',
    },
  },
  {
    id: 'radius',
    title: 'Physical Radius & Diameter',
    symbol: 'R',
    formula: 'R = √(L / 4π σ Teff⁴)',
    unit: 'Solar Radii (R☉ = 696,340 km)',
    whyItMatters:
      'Spans the most staggering dynamic range in astronomy: from stellar remnants smaller than an earthly city to supergiant envelopes wider than Jupiter’s orbit.',
    description:
      'A star’s physical size varies dramatically across its life cycle. On the main sequence, size is dictated by hydrostatic mass balance. When core hydrogen ceases, shell burning swells the outer envelope outward into a gigantic, low-density sphere.',
    extremeExamples: {
      minimum: '~10–12 km (0.000015 R☉) — Neutron Star / Crab Pulsar',
      solar: '696,340 km (1.0 R☉)',
      maximum: '2,150 R☉ (~1.5 billion km) — Stephenson 2-18 (would engulf Saturn’s orbit)',
    },
  },
  {
    id: 'equilibrium',
    title: 'Hydrostatic Equilibrium',
    symbol: '∇P = -ρ g',
    formula: 'dP/dr = -G M(r) ρ(r) / r²',
    unit: 'Balance of Pressure (N/m²)',
    whyItMatters:
      'The cosmic law that keeps every living star stable for millions or billions of years instead of collapsing into a black hole or blowing apart.',
    description:
      'At every concentric shell inside a stable star, the inward force of gravity (pulling all mass toward the center) is precisely balanced by the outward gradient of gas pressure and radiation pressure created by core nuclear fusion. If the core cools slightly, gravity compresses it, raising the temperature and restoring equilibrium. If the core overheats, it expands and cools automatically—a self-regulating cosmic thermostat!',
    extremeExamples: {
      minimum: 'Instability Strip: Stars pulsate periodically (e.g. Cepheid variables)',
      solar: 'In steady hydrostatic equilibrium for 4.6 billion years (and 5 billion more to come)',
      maximum: 'Supernovae: When iron core forms, electron degeneracy fails, gravity collapses core in ~0.2 seconds',
    },
  },
];
