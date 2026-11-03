import { ExoplanetTier, ProceduralTheme, SudarskyClass } from '../types';

export interface SudarskyClassMetadata {
  sudarskyClass: SudarskyClass;
  fullLabel: string;
  cloudDeck: string;
  tempRangeLabel: string;
  colorHex: string;
}

export const SUDARSKY_CLASS_INFO: Record<SudarskyClass, SudarskyClassMetadata> = {
  'Class I': {
    sudarskyClass: 'Class I',
    fullLabel: 'Sudarsky Class I',
    cloudDeck: 'Ammonia Clouds',
    tempRangeLabel: '<= 155 K',
    colorHex: '#e9c496',
  },
  'Class II': {
    sudarskyClass: 'Class II',
    fullLabel: 'Sudarsky Class II',
    cloudDeck: 'Water Clouds',
    tempRangeLabel: '155 - 350 K',
    colorHex: '#7dd3fc',
  },
  'Class III': {
    sudarskyClass: 'Class III',
    fullLabel: 'Sudarsky Class III',
    cloudDeck: 'Cloudless Alkali',
    tempRangeLabel: '350 - 900 K',
    colorHex: '#3b82f6',
  },
  'Class IV': {
    sudarskyClass: 'Class IV',
    fullLabel: 'Sudarsky Class IV',
    cloudDeck: 'Alkali & Silicate',
    tempRangeLabel: '900 - 1400 K',
    colorHex: '#e07a5f',
  },
  'Class V': {
    sudarskyClass: 'Class V',
    fullLabel: 'Sudarsky Class V',
    cloudDeck: 'Silicate & Thermal',
    tempRangeLabel: '>= 1400 K',
    colorHex: '#fb923c',
  },
};

// Resolves Sudarsky giant planet class (Sudarsky et al. 2000, 2003) from equilibrium temperature.
export function deriveSudarskyClass(params: {
  id?: string;
  classification: string;
  temperatureK?: number;
  sudarskyClass?: SudarskyClass;
}): SudarskyClass | undefined {
  if (params.classification !== 'Jovian' && params.classification !== 'Gas Giants') {
    return undefined;
  }
  if (params.sudarskyClass) {
    return params.sudarskyClass;
  }
  if (params.id === 'sol-jupiter' || params.id === 'sol-saturn') {
    return 'Class I';
  }
  const tempK = params.temperatureK ?? 120;
  if (tempK <= 155) return 'Class I';
  if (tempK < 350) return 'Class II';
  if (tempK < 900) return 'Class III';
  if (tempK < 1400) return 'Class IV';
  return 'Class V';
}

export interface ThemeRecommendation {
  theme: ProceduralTheme;
  sudarskyClass?: SudarskyClass;
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
  'kepler-1649 b',
  'kepler-186 f',
  'kepler-62 f',
  'toi-700 d',
  'toi-700 e',
  'toi-2095 c',
  'lp 890-9 c',
  'toi-715 b',
  'gj 1061 c',
  'gj 1061 d',
  'proxima centauri b',
  'ross 128 b',
  'teegarden b',
  "teegarden's star b",
  'wolf 1069 b',
  'gj 1002 b',
  'gliese 12 b'
];

// Confirmed Hycean ocean world candidates (super-Earth water worlds with deep oceans under H2 atmospheres)
const KNOWN_HYCEAN_CANDIDATE_SUBSTRINGS = [
  'kepler-62 e',
  'kepler-452 b',
  'lhs 1140 b',
  'k2-18 b',
  'toi-1452 b',
  'kepler-22 b',
  'gj 273 b',
  'gj 3323 b',
  'gj 1132 c',
  'gj 625 b'
];

function hashIdNormalized(id: string, salt: number): number {
  let h = (2166136261 ^ salt) >>> 0;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h / 4294967296;
}

// Estimates Jovian albedo from Sudarsky/Cahoy/Parmentier condensation curves and sedimentation scatter.
export function estimateJovianSudarskyAlbedo(
  id: string,
  temperatureK: number,
  sudarskyClass: SudarskyClass,
  isDarkAlkaliBranch: boolean = false
): number {
  const scatter = hashIdNormalized(id, 43);
  let val = 0.35;

  switch (sudarskyClass) {
    case 'Class I': {
      // Cold photochemical haze (< 95 K, Saturn-like 0.34-0.44) vs dense NH3 decks (95-145 K, 0.45-0.60)
      if (temperatureK < 95) {
        const coldFrac = Math.max(0, Math.min(1, (temperatureK - 45) / 50));
        val = 0.34 + coldFrac * 0.06 + scatter * 0.06;
      } else if (temperatureK <= 142) {
        const peak = 1 - Math.abs(temperatureK - 120) / 30;
        val = 0.45 + Math.max(0, peak) * 0.07 + scatter * 0.08;
      } else {
        // Partial NH3 sublimation approaching the 155 K Class I/II boundary
        const warmDip = Math.max(0, Math.min(1, (temperatureK - 142) / 13));
        val = 0.48 - warmDip * 0.07 + scatter * 0.07;
      }
      break;
    }
    case 'Class II': {
      // Bright tropospheric H2O clouds peaking near 200-275 K (0.68-0.81), thinning toward 350 K
      if (temperatureK < 200) {
        const rise = Math.max(0, Math.min(1, (temperatureK - 155) / 45));
        val = 0.58 + rise * 0.11 + scatter * 0.07;
      } else if (temperatureK <= 280) {
        val = 0.69 + scatter * 0.12;
      } else {
        const sink = Math.max(0, Math.min(1, (temperatureK - 280) / 70));
        val = 0.68 - sink * 0.15 + scatter * 0.08;
      }
      break;
    }
    case 'Class III': {
      // Cloudless H2/He Rayleigh scatter at 350-520 K (0.14-0.21), darkened by Na/K wings toward 900 K (0.05-0.11)
      const tFrac = Math.max(0, Math.min(1, (temperatureK - 350) / 550));
      val = 0.165 - tFrac * 0.105 + scatter * 0.048;
      break;
    }
    case 'Class IV': {
      // Strong atomic Na/K absorption (0.02-0.06 dark branch; 0.05-0.14 as deep silicate decks rise near 1400 K)
      const tFrac = Math.max(0, Math.min(1, (temperatureK - 900) / 500));
      if (isDarkAlkaliBranch) {
        val = 0.020 + scatter * 0.032 + tFrac * 0.008;
      } else {
        const silicateRise = Math.max(0, (temperatureK - 1150) / 250);
        val = 0.052 + silicateRise * 0.048 + scatter * 0.038;
      }
      break;
    }
    case 'Class V': {
      // Reflective high-altitude enstatite/forsterite clouds (1400-1900 K: 0.36-0.56),
      // vaporizing across 1900-2280 K (0.16-0.36), to dark H- continuum above 2280 K (0.06-0.13)
      if (temperatureK < 1900) {
        const peak = 1 - Math.abs(temperatureK - 1650) / 300;
        val = 0.37 + Math.max(0, peak) * 0.09 + scatter * 0.10;
      } else if (temperatureK < 2280) {
        const melt = (temperatureK - 1900) / 380;
        val = 0.36 - melt * 0.22 + scatter * 0.07;
      } else {
        const ultra = Math.min(1, (temperatureK - 2280) / 1200);
        val = 0.095 - ultra * 0.035 + scatter * 0.038;
      }
      break;
    }
  }

  return Math.round(val * 1000) / 1000;
}

const CONFIRMED_SUPERTERRAN_IDS = new Set([
  'exo-kepler-22-b',
  'exo-k2-18-b',
  'exo-lhs-1140-b',
  'exo-toi-1452-b',
  'exo-kepler-62-e',
  'exo-kepler-62-f',
  'exo-kepler-452-b',
  'exo-kepler-10-c',
  'exo-bd-20-594-b',
  'exo-55-cancri-e',
  'exo-corot-7-b',
  'exo-toi-849-b',
  'exo-toi-1853-b',
  'exo-k2-66-b',
  'exo-kepler-131-b',
  'exo-wolf1061c',
  'exo-wolf1061d',
  'exo-gliese-581-c',
  'exo-gliese-876-d',
  'exo-gliese-832-c',
  'exo-gliese-163-c',
  'exo-taucetid',
  'exo-taucetie',
  'exo-taucetif',
  'exo-poltergeist',
  'exo-phobetor',
  'exo-hd-136352-b',
  'exo-61-virb',
  'exo-gj-887-b',
  'exo-gj-3138-b',
  'exo-gj-536-b',
  'exo-gj-3929-c',
  'exo-hd39194b',
  'exo-hd39194c',
  'exo-hd39194d',
  'exo-koi187302',
  'exo-hr-858-b',
]);

const CONFIRMED_NEPTUNIAN_IDS = new Set([
  'exo-gliese-436-b',
  'exo-gj-1214-b',
  'exo-gliese-3470-b',
  'exo-hat-p-11-b',
  'exo-ltt-9779-b',
  'exo-kepler-4-b',
  'exo-au-mic-b',
  'exo-toi-1231-b',
  'exo-ngts-4-b',
  'exo-kepler-411-c',
  'exo-kepler-411-d',
  'exo-kepler-413-b',
  'exo-kepler-1656-b',
  'exo-k2-33-b',
  'exo-k2-108-b',
  'exo-toi-532-b',
  'exo-hd-95338-b',
  'exo-toi-1272-b',
  'exo-kepler-20-c',
  'exo-hd-63935-b',
  'exo-hd-97658-b',
  'exo-toi-421-b',
  'exo-kepler-80-b',
  'exo-kepler-80-c',
  'exo-toi-125-b',
  'exo-toi-125-c',
  'exo-hd-183579-b',
  'exo-k2-105-b',
  'exo-toi-132-b',
  'exo-hip-9618-c',
  'exo-hd-136352-c',
  'exo-hd-136352-d',
  'exo-mensae-c',
  'exo-k2-416-b',
  'exo-k2-417-b',
]);

// Separates Superterran and Neptunian worlds via literature confirmations, radius valley, and Otegi (2020) density bounds.
export function resolveSuperterranNeptunianClassification(params: {
  id: string;
  name: string;
  classification: ExoplanetTier | string;
  diameterEarth: number;
  massEarth?: number;
  temperatureK?: number;
  discoveryMethod?: string;
}): string {
  const { id, classification, diameterEarth, massEarth, temperatureK = 400, discoveryMethod } = params;
  if (classification !== 'Superterran' && classification !== 'Neptunian') {
    return classification;
  }
  if (CONFIRMED_SUPERTERRAN_IDS.has(id)) {
    return 'Superterran';
  }
  if (CONFIRMED_NEPTUNIAN_IDS.has(id)) {
    return 'Neptunian';
  }

  const isTransit = (discoveryMethod ?? '').toLowerCase() === 'transit';
  const rho =
    massEarth && massEarth > 0 && diameterEarth > 0
      ? 5.514 * (massEarth / Math.pow(diameterEarth, 3))
      : null;

  if (!isTransit && massEarth && massEarth > 0) {
    return massEarth <= 7.5 ? 'Superterran' : 'Neptunian';
  }
  if (diameterEarth >= 2.65) {
    return rho !== null && rho >= 5.2 && rho <= 25.0 ? 'Superterran' : 'Neptunian';
  }
  if (diameterEarth >= 2.15) {
    const isTemperateOcean = temperatureK >= 210 && temperatureK <= 380 && (rho === null || rho >= 2.4);
    if (isTemperateOcean || (rho !== null && rho >= 3.3 && rho <= 25.0)) {
      return 'Superterran';
    }
    return 'Neptunian';
  }
  return rho !== null && rho < 1.8 ? 'Neptunian' : 'Superterran';
}

// Estimates Neptunian albedo and atmospheric condensate regime from temperature, bulk density, and haze chemistry.
export function estimateNeptunianAlbedo(
  id: string,
  temperatureK: number,
  densityGcm3?: number
): { albedo: number; compositionSummary: string } {
  const hComp = hashIdNormalized(id, 61);
  const scatter = hashIdNormalized(id, 89);
  const highMetallicity = (densityGcm3 ?? 1.65) >= 2.1;

  let val = 0.32;
  let compositionSummary = 'Volatile hydrogen-helium and methane envelope.';

  if (temperatureK <= 220) {
    // Cryogenic CH4 + H2S ice giants (Uranus 0.30, Neptune 0.29-0.41)
    if (hComp < 0.42) {
      val = 0.34 + scatter * 0.10;
      compositionSummary = 'Cryogenic ice giant with stagnant stratospheric hydrocarbon haze over methane-ice clouds.';
    } else {
      val = 0.28 + scatter * 0.09;
      compositionSummary = 'Cryogenic methane-rich ice giant with deep cobalt Rayleigh scattering and wispy methane cirrus.';
    }
  } else if (temperatureK < 480) {
    // Cool/temperate sub-Neptunes: reflective H2O/NH3 clouds vs UV organic tholin haze
    if (hComp < 0.64) {
      const peak = 1 - Math.abs(temperatureK - 310) / 170;
      val = 0.44 + Math.max(0, peak) * 0.12 + scatter * 0.10;
      compositionSummary = 'Temperate sub-Neptune with reflective tropospheric water-ice clouds under a hydrogen-methane sky.';
    } else {
      val = 0.20 + scatter * 0.14;
      compositionSummary = 'Temperate sub-Neptune veiled in UV-photochemical organic tholin haze over a volatile mantle.';
    }
  } else if (temperatureK < 850) {
    // Warm Neptunes (480-850 K): KCl/ZnS salt clouds, CO-rich CH4-depleted skies, or hydrocarbon soot peak
    const saltWeight = highMetallicity ? 0.36 : 0.24;
    if (hComp < saltWeight && id !== 'exo-gliese-436-b') {
      val = 0.35 + scatter * 0.17;
      compositionSummary = 'Warm high-metallicity sub-Neptune with reflective potassium-chloride and zinc-sulfide salt clouds.';
    } else if (hComp < saltWeight + 0.40 || id === 'exo-gliese-436-b') {
      val = 0.13 + scatter * 0.11;
      compositionSummary = 'Warm methane-depleted Neptune enriched in carbon monoxide and water vapor with twilight Rayleigh haze.';
    } else {
      val = 0.07 + scatter * 0.11;
      compositionSummary = 'Warm sub-Neptune darkened by dense photochemical hydrocarbon soot and tholin smog.';
    }
  } else if (temperatureK < 1500) {
    // Hot Neptunes (850-1500 K): Na2S clouds, clear alkali/H2O absorption, or carbon-soot haze
    if (hComp < 0.36) {
      val = 0.15 + scatter * 0.11;
      compositionSummary = 'Hot sub-Neptune with sodium-sulfide cloud decks and sulfur-monoxide upper haze.';
    } else if (hComp < 0.80) {
      val = 0.08 + scatter * 0.08;
      compositionSummary = 'Hot Neptune with clear water-vapor and atomic sodium-potassium optical absorption.';
    } else {
      val = 0.045 + scatter * 0.045;
      compositionSummary = 'Hot low-albedo Neptune dominated by heavy alkali and carbon-haze absorption.';
    }
  } else {
    // Ultra-hot Neptunian desert worlds (>= 1500 K)
    if (temperatureK < 1900) {
      val = 0.22 + scatter * 0.16;
      compositionSummary = 'Neptunian-desert world with high-altitude enstatite silicate haze and dayside thermal emission.';
    } else {
      val = 0.06 + scatter * 0.08;
      compositionSummary = 'Ultra-hot Neptune with thermally dissociated upper atmosphere and glowing dayside envelope.';
    }
  }

  return {
    albedo: Math.round(val * 1000) / 1000,
    compositionSummary,
  };
}

// Maps equilibrium temperature, mass-radius tier, and phase-curve measurements to procedural themes and albedos.
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
  const { id, name, classification, diameterEarth, temperatureK, densityGcm3, massEarth } = params;
  const lowerName = name.toLowerCase();
  const computedDensity =
    densityGcm3 ??
    (massEarth && massEarth > 0 && diameterEarth > 0
      ? 5.514 * (massEarth / Math.pow(diameterEarth, 3))
      : undefined);

  if (lowerName.includes('ltt 9779') || lowerName.includes('ltt-9779')) {
    return {
      theme: 'mirror-world',
      sudarskyClass: classification === 'Jovian' ? 'Class V' : undefined,
      albedo: 0.80,
      albedoType: 'measured',
      description: 'Ultra-hot Neptune with highly reflective metallic silicate and titanate cloud decks.',
    };
  }

  if (id === 'exo-gj-1214-b' || lowerName === 'gj 1214 b' || lowerName === 'gliese 1214 b') {
    return {
      theme: 'sub-neptune',
      albedo: 0.51,
      albedoType: 'measured',
      description: 'Warm high-metallicity sub-Neptune with JWST-measured reflective salt and photochemical haze decks.',
    };
  }

  if (lowerName.includes('tres-2') || lowerName.includes('tres-2b')) {
    return {
      theme: 'hot-jupiter-dark-alkali',
      sudarskyClass: 'Class IV',
      albedo: 0.015,
      albedoType: 'measured',
      description: 'Sudarsky Class IV gas giant: vaporized sodium and potassium absorb over 98% of incident light.',
    };
  }

  if (lowerName.includes('hd 189733 b') || lowerName.includes('hd 189733b')) {
    return {
      theme: 'gas-giant-cloudless',
      sudarskyClass: 'Class IV',
      albedo: 0.14,
      albedoType: 'measured',
      description: 'Sudarsky Class IV hot Jupiter with measured cobalt-azure Rayleigh scattering from high-altitude silicate rain.',
    };
  }

  if (id === 'exo-kepler-7-b' || lowerName === 'kepler-7 b') {
    return {
      theme: 'ultra-hot-jupiter',
      sudarskyClass: 'Class V',
      albedo: 0.35,
      albedoType: 'measured',
      description: 'Sudarsky Class V gas giant with Kepler-measured reflective high-altitude silicate cloud banks.',
    };
  }

  if (id === 'exo-hd-209458-b' || lowerName.includes('hd 209458 b')) {
    return {
      theme: 'hot-jupiter',
      sudarskyClass: 'Class IV',
      albedo: 0.096,
      albedoType: 'measured',
      description: 'Sudarsky Class IV hot Jupiter with CHEOPS-measured low optical geometric albedo from alkali absorption.',
    };
  }

  if (id === 'exo-wasp-12-b' || lowerName === 'wasp-12 b') {
    return {
      theme: 'ultra-hot-jupiter',
      sudarskyClass: 'Class V',
      albedo: 0.06,
      albedoType: 'measured',
      description: 'Sudarsky Class V ultra-hot gas giant where dissociated hydrogen and H- opacity absorb 94% of incident starlight.',
    };
  }

  if (id === 'exo-hat-p-7-b' || lowerName === 'hat-p-7 b') {
    return {
      theme: 'ultra-hot-jupiter',
      sudarskyClass: 'Class V',
      albedo: 0.03,
      albedoType: 'measured',
      description: 'Sudarsky Class V ultra-hot gas giant with low dayside optical reflectivity and strong thermal emission.',
    };
  }

  if (id === 'exo-wasp-121-b' || lowerName === 'wasp-121 b') {
    return {
      theme: 'ultra-hot-jupiter',
      sudarskyClass: 'Class V',
      albedo: 0.07,
      albedoType: 'measured',
      description: 'Sudarsky Class V ultra-hot gas giant with CHEOPS-measured low optical albedo and iron-corundum nightside clouds.',
    };
  }

  if (classification === 'Neptunian' || classification === 'Ice Giants') {
    const nep = estimateNeptunianAlbedo(id, temperatureK, computedDensity);
    return {
      theme: temperatureK <= 240 ? 'ice-giant' : 'sub-neptune',
      albedo: nep.albedo,
      albedoType: 'estimated',
      description: nep.compositionSummary,
    };
  }

  // Jovian gas giants mapped to Sudarsky Class I - Class V (Sudarsky et al. 2000, 2003)
  if (classification === 'Jovian' || classification === 'Gas Giants') {
    if (temperatureK >= 1400) {
      const isDissociated = temperatureK >= 2200;
      const albedo = estimateJovianSudarskyAlbedo(id, temperatureK, 'Class V');
      return {
        theme: 'ultra-hot-jupiter',
        sudarskyClass: 'Class V',
        albedo,
        albedoType: 'estimated',
        description: isDissociated
          ? 'Sudarsky Class V ultra-hot gas giant with thermally dissociated hydrogen and incandescent dayside bands.'
          : 'Sudarsky Class V gas giant with high-altitude silicate and iron cloud decks glowing with thermal emission.',
      };
    }

    if (temperatureK >= 900) {
      const isDarkAlkali = hashIdNormalized(id, 19) < 0.24;
      const albedo = estimateJovianSudarskyAlbedo(id, temperatureK, 'Class IV', isDarkAlkali);
      return {
        theme: isDarkAlkali ? 'hot-jupiter-dark-alkali' : 'hot-jupiter',
        sudarskyClass: 'Class IV',
        albedo,
        albedoType: 'estimated',
        description: isDarkAlkali
          ? 'Sudarsky Class IV dark-alkali gas giant where dense atomic sodium and potassium absorb almost all visible light.'
          : 'Sudarsky Class IV gas giant dominated by atomic sodium and potassium absorption above deep silicate clouds.',
      };
    }

    if (temperatureK >= 350) {
      const albedo = estimateJovianSudarskyAlbedo(id, temperatureK, 'Class III');
      return {
        theme: 'gas-giant-cloudless',
        sudarskyClass: 'Class III',
        albedo,
        albedoType: 'estimated',
        description: 'Sudarsky Class III cloudless gas giant with deep azure Rayleigh scattering and methane-alkali absorption.',
      };
    }

    if (temperatureK > 155) {
      const albedo = estimateJovianSudarskyAlbedo(id, temperatureK, 'Class II');
      return {
        theme: 'gas-giant-water-clouds',
        sudarskyClass: 'Class II',
        albedo,
        albedoType: 'estimated',
        description: 'Sudarsky Class II gas giant blanketed in bright tropospheric water-vapor cloud zones.',
      };
    }

    const albedo = estimateJovianSudarskyAlbedo(id, temperatureK, 'Class I');
    return {
      theme: 'gas-giant-banded',
      sudarskyClass: 'Class I',
      albedo,
      albedoType: 'estimated',
      description: 'Sudarsky Class I gas giant with cold ammonia ice cloud decks and laminar zonal belts.',
    };
  }

  // Rocky and water-rich worlds (Sub-Martian, Martian, Terran, Superterran)
  if (temperatureK >= 1350) {
    return {
      theme: 'lava-world',
      albedo: 0.08,
      albedoType: 'estimated',
      description: 'Tidally locked magma world with dayside molten lava ocean and fissured basalt crust.',
    };
  }

  const isKnownHycean = KNOWN_HYCEAN_CANDIDATE_SUBSTRINGS.some(k => lowerName.includes(k));
  if (isKnownHycean || (classification === 'Superterran' && temperatureK >= 210 && temperatureK <= 380 && (computedDensity ?? 2.8) < 4.0 && diameterEarth >= 1.4)) {
    return {
      theme: 'hycean-ocean',
      albedo: 0.38,
      albedoType: 'estimated',
      description: 'Hycean ocean world: global super-deep water ocean under hydrogen-rich atmosphere.',
    };
  }

  const isKnownHabitable = KNOWN_HABITABLE_CANDIDATE_SUBSTRINGS.some(k => lowerName.includes(k));
  if (isKnownHabitable || (temperatureK >= 215 && temperatureK <= 320 && diameterEarth >= 0.75 && diameterEarth <= 1.8)) {
    return {
      theme: 'terrestrial-ocean',
      albedo: 0.30,
      albedoType: 'estimated',
      description: 'Temperate terrestrial ocean world with surface liquid water, continents, biomes, and cloud systems.',
    };
  }

  if (classification === 'Superterran' || diameterEarth > 1.3) {
    return {
      theme: 'super-earth',
      albedo: 0.18,
      albedoType: 'estimated',
      description: temperatureK < 250
        ? 'Cold Super-Earth with exposed dark basalt, iron-oxide mineral plains, and rugged tectonic plateaus.'
        : 'Craggy Super-Earth with iron-rich silicate desert plains, tectonic faults, and volcanic activity.',
    };
  }

  return {
    theme: 'terrestrial-rocky',
    albedo: 0.16,
    albedoType: 'estimated',
    description: temperatureK < 250
      ? 'Cold terrestrial rocky world with impact craters, dark basaltic lowlands, and silicate regolith.'
      : 'Terrestrial rocky planet with impact craters, silicate basalt plains, and highland ridges.',
  };
}
