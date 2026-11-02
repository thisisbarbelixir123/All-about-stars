import { ExoplanetTier, ProceduralTheme } from '../types';

export interface ThemeRecommendation {
  theme: ProceduralTheme;
  albedo: number;
  albedoType: 'measured' | 'estimated';
  description: string;
}

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
  const { id, name, classification, diameterEarth, temperatureK, densityGcm3, orbitalPeriodDays } = params;
  const lowerName = name.toLowerCase();

  // 1. Benchmark Known Ultra-High Albedo Worlds ("Mirror Planets")
  // LTT 9779 b: Albedo ~0.80 due to reflective titanium / silicate clouds in the Neptunian desert
  if (lowerName.includes('ltt 9779') || lowerName.includes('ltt-9779')) {
    return {
      theme: 'mirror-world',
      albedo: 0.80,
      albedoType: 'measured',
      description: 'Ultra-hot Neptune with highly reflective metallic silicate and titanate cloud decks.',
    };
  }

  // 2. Benchmark Ultra-Dark Gas Giants (Pencil lead / charcoal albedo < 0.04)
  // TrES-2b: Light reflection < 1%, darker than black acrylic paint
  if (lowerName.includes('tres-2') || lowerName.includes('tres-2b')) {
    return {
      theme: 'hot-jupiter-dark-alkali',
      albedo: 0.015,
      albedoType: 'measured',
      description: 'Darkest known exoplanet: atmospheric vaporized sodium and potassium absorb over 98% of light.',
    };
  }

  // 3. Ultra-Hot Molten Magma Worlds (T_eq > 1400 K and rocky/terran)
  const isRockyOrTerran =
    classification === 'Sub-Martian' ||
    classification === 'Martian' ||
    classification === 'Terran' ||
    classification === 'Superterran' ||
    (diameterEarth < 2.0 && (densityGcm3 ?? 3.5) >= 1.8);

  if (isRockyOrTerran && temperatureK >= 1350) {
    return {
      theme: 'lava-world',
      albedo: 0.08,
      albedoType: 'estimated',
      description: 'Tidally locked magma world with dayside molten lava ocean and fissured basalt crust.',
    };
  }

  // 4. Ultra-Hot Jupiters / Thermal Radiators (T_eq >= 1800 K)
  const isGiant =
    classification === 'Jovian' ||
    classification === 'Neptunian' ||
    diameterEarth >= 2.0;

  if (isGiant && temperatureK >= 1800) {
    return {
      theme: 'ultra-hot-jupiter',
      albedo: 0.10,
      albedoType: 'estimated',
      description: 'Blistering ultra-hot giant with vaporized iron, titanium oxide atmospheres, and dayside thermal glow.',
    };
  }

  // 5. Hot Jupiters (Sudarsky Class III / IV: 900 K - 1800 K)
  if (isGiant && temperatureK >= 900) {
    // If it's a Neptunian or Sub-Neptune (not a massive Jupiter), keep it under sub-neptune / hazy atmosphere
    if (classification === 'Neptunian' || diameterEarth < 5.0) {
      return {
        theme: 'sub-neptune',
        albedo: 0.28,
        albedoType: 'estimated',
        description: 'Warm, volatile-rich sub-Neptune with deep hydrogen-helium envelope and photochemical haze.',
      };
    }
    if (temperatureK >= 1400) {
      return {
        theme: 'hot-jupiter',
        albedo: 0.16,
        albedoType: 'estimated',
        description: 'Sudarsky Class IV gas giant enveloped in high-temperature silicate and liquid iron clouds.',
      };
    }
    return {
      theme: 'hot-jupiter-dark-alkali',
      albedo: 0.08,
      albedoType: 'estimated',
      description: 'Sudarsky Class III cloudless giant with deep vaporized alkali metal absorption and subtle cobalt bands.',
    };
  }

  // 6. Warm Water-Cloud Gas Giants (Sudarsky Class II: 350 K - 900 K)
  if (isGiant && temperatureK >= 350) {
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

  // 7. Cold Jovians & Ice Giants (Sudarsky Class I: T < 350 K)
  if (isGiant) {
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

  // 8. Temperate & Warm Rocky Worlds (Sub-Martian, Martian, Terran, Superterran)
  if (temperatureK < 350) {
    // Temperate Ocean / Hycean candidates
    // Earth-like or Hycean water world
    if (temperatureK >= 220 && temperatureK <= 320 && diameterEarth >= 0.8 && diameterEarth <= 2.2) {
      if (diameterEarth > 1.4 && (densityGcm3 ?? 2.5) < 3.5) {
        return {
          theme: 'hycean-ocean',
          albedo: 0.38,
          albedoType: 'estimated',
          description: 'Hycean ocean world: global super-deep water ocean under hydrogen-rich atmosphere.',
        };
      }
      return {
        theme: 'terrestrial-ocean',
        albedo: 0.30,
        albedoType: 'estimated',
        description: 'Temperate terrestrial world with liquid surface water oceans, continents, and cloud systems.',
      };
    }

    if (temperatureK < 200) {
      return {
        theme: 'kbo-ice',
        albedo: 0.55,
        albedoType: 'estimated',
        description: 'Frigid ice-encrusted rocky world covered in nitrogen, methane, and water ice glaciers.',
      };
    }

    return {
      theme: 'terrestrial-rocky',
      albedo: 0.16,
      albedoType: 'estimated',
      description: 'Temperate rocky terrestrial planet with silicate regolith and impact cratered terrain.',
    };
  }

  // 9. Warm to Hot Super-Earths / Desert Planets (350 K - 1350 K)
  if (temperatureK >= 700) {
    return {
      theme: 'super-earth',
      albedo: 0.18,
      albedoType: 'estimated',
      description: 'Scorched Super-Earth with iron-rich silicate desert plains and volcanic activity.',
    };
  }

  return {
    theme: 'terrestrial-rocky',
    albedo: 0.15,
    albedoType: 'estimated',
    description: 'Silicate terrestrial world with impact basins and rugged mountain highlands.',
  };
}
