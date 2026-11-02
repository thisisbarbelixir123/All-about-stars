import { ExoplanetTier, ProceduralTheme } from '../types';

export interface ThemeRecommendation {
  theme: ProceduralTheme;
  albedo: number;
  albedoType: 'measured' | 'estimated';
  description: string;
}

// Confirmed or celebrated habitable zone terrestrial/super-Earth candidate list
const KNOWN_HABITABLE_CANDIDATE_SUBSTRINGS = [
  'trappist-1 e',
  'trappist-1 f',
  'trappist-1 d',
  'kepler-1649 c',
  'kepler-186 f',
  'toi-700 d',
  'toi-2095 c',
  'lp 890-9 c',
  'toi-715 b',
  'gj 1061 c',
  'gj 1061 d',
  'proxima centauri b',
  'ross 128 b',
  'teegarden b'
];

// Confirmed Hycean ocean world candidates (super-Earth water worlds with deep oceans under H2 atmospheres)
const KNOWN_HYCEAN_CANDIDATE_SUBSTRINGS = [
  'kepler-62 e',
  'kepler-452 b',
  'lhs 1140 b',
  'gj 273 b',
  'gj 3323 b',
  'gj 1132 c',
  'gj 625 b'
];

/**
 * Derives authentic scientific Halcyon-style procedural themes, albedos,
 * and atmospheric characteristics based on equilibrium temperature (T_eq),
 * planetary tier / mass-radius density, and orbital architecture.
 */
export function deriveScientificExoplanetTheme(params: {
  id: string;
  name: string;
  classification: string;
  diameterEarth: number;
  temperatureK: number;
  densityGcm3?: number;
  massEarth?: number;
  semiMajorAxisAU?: number;
  orbitalPeriodDays?: number;
}): ThemeRecommendation {
  const { id, name, classification, diameterEarth, temperatureK, densityGcm3 } = params;
  const lowerName = name.toLowerCase();

  // 1. Benchmark Known Ultra-High Albedo Worlds ("Mirror Planets")
  if (lowerName.includes('ltt 9779') || lowerName.includes('ltt-9779')) {
    return {
      theme: 'mirror-world',
      albedo: 0.80,
      albedoType: 'measured',
      description: 'Ultra-hot Neptune with highly reflective metallic silicate and titanate cloud decks.',
    };
  }

  // 2. Benchmark Ultra-Dark Gas Giants (Pencil lead / charcoal albedo < 0.04)
  if (lowerName.includes('tres-2') || lowerName.includes('tres-2b')) {
    return {
      theme: 'hot-jupiter-dark-alkali',
      albedo: 0.015,
      albedoType: 'measured',
      description: 'Darkest known exoplanet: atmospheric vaporized sodium and potassium absorb over 98% of light.',
    };
  }

  // 3. Strict Planetary Division: Giants vs. Terrestrials/Superterrans
  // Strict rule: ONLY planets classified as Jovian or Neptunian are gas/ice giants!
  // All Superterrans, Terrans, Martians, and Sub-Martians are strictly rocky/terrestrial/ocean/magma worlds.
  const isGasOrIceGiant = classification === 'Jovian' || classification === 'Neptunian';

  // -------------------------------------------------------------
  // BRANCH A: GAS GIANTS & ICE GIANTS (Jovian & Neptunian ONLY)
  // -------------------------------------------------------------
  if (isGasOrIceGiant) {
    // Ultra-Hot Jupiters / Thermal Radiators (T_eq >= 1800 K)
    if (temperatureK >= 1800) {
      return {
        theme: 'ultra-hot-jupiter',
        albedo: 0.10,
        albedoType: 'estimated',
        description: 'Blistering ultra-hot giant with vaporized iron, titanium oxide atmospheres, and dayside thermal glow.',
      };
    }

    // Hot Jupiters & Neptunes (900 K - 1800 K)
    if (temperatureK >= 900) {
      if (classification === 'Neptunian' || diameterEarth < 8.0) {
        return {
          theme: 'sub-neptune',
          albedo: 0.28,
          albedoType: 'estimated',
          description: 'Warm, volatile-rich sub-Neptune with deep hydrogen-helium envelope and photochemical haze.',
        };
      }
      // Very hot silicate/iron cloud giants (T >= 1300 K)
      if (temperatureK >= 1300) {
        return {
          theme: 'hot-jupiter',
          albedo: 0.16,
          albedoType: 'estimated',
          description: 'Sudarsky Class IV gas giant enveloped in high-temperature silicate and liquid iron clouds.',
        };
      }
      // Differentiate between warm banded Jovians (moderate albedo) and true alkali metal absorption giants
      // Only benchmark dark worlds or high-metallicity cloudless giants retain dark alkali
      const isCloudlessAlkali = lowerName.includes('tres-2') || (temperatureK >= 1150 && Math.sin(temperatureK) > 0.4);
      if (isCloudlessAlkali) {
        return {
          theme: 'hot-jupiter-dark-alkali',
          albedo: 0.08,
          albedoType: 'estimated',
          description: 'Sudarsky Class III giant with deep vaporized alkali metal absorption and subtle cobalt/amethyst bands.',
        };
      }
      return {
        theme: 'gas-giant-banded',
        albedo: 0.22,
        albedoType: 'estimated',
        description: 'Warm Jovian giant displaying dynamic latitudinal jet streams and photochemical smog.',
      };
    }

    // Warm Water-Cloud Gas Giants (350 K - 900 K)
    if (temperatureK >= 350) {
      if (classification === 'Neptunian' || diameterEarth < 6.0) {
        return {
          theme: 'sub-neptune',
          albedo: 0.32,
          albedoType: 'estimated',
          description: 'Volatile-rich sub-Neptune with deep hydrogen-helium envelope and photochemical haze.',
        };
      }
      return {
        theme: 'gas-giant-water-clouds',
        albedo: 0.35,
        albedoType: 'estimated',
        description: 'Sudarsky Class II giant with condensed reflective tropospheric water vapor clouds.',
      };
    }

    // Cold Jovians & Ice Giants (T < 350 K)
    if (classification === 'Neptunian' || diameterEarth < 5.0) {
      return {
        theme: 'ice-giant',
        albedo: 0.34,
        albedoType: 'estimated',
        description: 'Cold ice giant with methane-rich upper atmosphere and banded dynamic winds.',
      };
    }
    return {
      theme: 'gas-giant-banded',
      albedo: 0.45,
      albedoType: 'estimated',
      description: 'Sudarsky Class I giant with white ammonia ice cirrus decks and complex zonal jet bands.',
    };
  }

  // -------------------------------------------------------------
  // BRANCH B: ROCKY & TERRAN WORLDS (Sub-Martian, Martian, Terran, Superterran)
  // -------------------------------------------------------------

  // 1. Ultra-Hot Molten Magma Worlds (T_eq >= 1350 K)
  if (temperatureK >= 1350) {
    return {
      theme: 'lava-world',
      albedo: 0.08,
      albedoType: 'estimated',
      description: 'Tidally locked magma world with dayside molten lava ocean and fissured basalt crust.',
    };
  }

  // 2. Explicit or Candidate Hycean Ocean Worlds
  const isKnownHycean = KNOWN_HYCEAN_CANDIDATE_SUBSTRINGS.some(k => lowerName.includes(k));
  if (isKnownHycean || (classification === 'Superterran' && temperatureK >= 210 && temperatureK <= 380 && (densityGcm3 ?? 2.8) < 4.0 && diameterEarth >= 1.4)) {
    return {
      theme: 'hycean-ocean',
      albedo: 0.38,
      albedoType: 'estimated',
      description: 'Hycean ocean world: global super-deep water ocean under hydrogen-rich atmosphere.',
    };
  }

  // 3. Explicit or Candidate Terrestrial Ocean Worlds (Habitable Zone Liquid Water Oceans)
  const isKnownHabitable = KNOWN_HABITABLE_CANDIDATE_SUBSTRINGS.some(k => lowerName.includes(k));
  if (isKnownHabitable || (temperatureK >= 215 && temperatureK <= 320 && diameterEarth >= 0.75 && diameterEarth <= 1.8)) {
    return {
      theme: 'terrestrial-ocean',
      albedo: 0.30,
      albedoType: 'estimated',
      description: 'Temperate terrestrial ocean world with surface liquid water, continents, biomes, and cloud systems.',
    };
  }

  // 4. Frigid Ice-Glaciated Worlds (T_eq < 200 K)
  if (temperatureK < 200) {
    return {
      theme: 'kbo-ice',
      albedo: 0.55,
      albedoType: 'estimated',
      description: 'Frigid ice-encrusted rocky world covered in nitrogen, methane, and water ice glaciers.',
    };
  }

  // 5. Superterrans (Super-Earths) with T_eq >= 350 K (Dense Silicate/Iron Lithosphere)
  if (classification === 'Superterran' || diameterEarth > 1.3) {
    return {
      theme: 'super-earth',
      albedo: 0.18,
      albedoType: 'estimated',
      description: 'Craggy Super-Earth with iron-rich silicate desert plains, tectonic faults, and volcanic activity.',
    };
  }

  // 6. Sub-Martian, Martian, and Rocky Terrans (Silicate Regolith / Airless / Cratered)
  return {
    theme: 'terrestrial-rocky',
    albedo: 0.16,
    albedoType: 'estimated',
    description: 'Terrestrial rocky planet with impact craters, silicate basalt plains, and highland ridges.',
  };
}
