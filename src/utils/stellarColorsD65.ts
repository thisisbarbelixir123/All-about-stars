/**
 * Stellar D65 Chromaticity & Spectral Color Engine
 * 
 * Accurately calculates star photosphere, concentric corona colors, and brighter lower circle
 * calibrated strictly to the user's Star Colorization Blueprint and the CIE 1931 D65 illuminant.
 * 
 * Blueprint Matrix:
 * • W: Wolf-Rayet       100,000 K – 33,000 K   #8fb2ff – #9bb0ff   Extreme blue to Brilliant blue
 * • O: Main Sequence     50,000 K – 33,000 K   #92b5ff – #9bb0ff   Brilliant blue to Blue
 * • B: Main Sequence     33,000 K – 10,000 K   #9bb0ff – #c0d1ff   Blue to Deep bluish white
 * • A: Main Sequence     10,000 K –  7,300 K   #c0d1ff – #e4e8ff   Deep bluish white to Bluish white
 * • F: Main Sequence      7,300 K –  6,000 K   #e4e8ff – #fff4e8   Bluish white to Yellowish white (F0..F9)
 * • G: Main Sequence      6,000 K –  5,300 K   #fff4e8 – #ffe4ce   Yellowish white to Pale yellow
 * • K: Main Sequence      5,300 K –  3,900 K   #ffe4ce – #ffba8a   Pale yellow to Light orange
 * • S: S-type Star        3,500 K –  2,500 K   #ffa15c – #ff6600   Light orange to Deep orange
 * • M: Main Sequence      3,900 K –  2,300 K   #ffba8a – #ff7e2f   Light orange to Orangish red
 * • C: Carbon Star        3,200 K –  2,500 K   #ff8b3d – #cc2200   Orangish red to Ruby red
 * • L: Brown Dwarf        2,000 K –  1,300 K   #ff6a00 – #ff1a00   Deep red to Extremely dark red
 * • T: Brown Dwarf        1,300 K –    500 K   #cc0052 – #4d004d   Dim magenta to Dark purplish-brown
 * • Y: Brown Dwarf              < 500 K        #260026 – #444444   Faint purplish-black to Pitch black
 * 
 * Rules:
 * 1. Concentric corona colorization, with brighter lower circle.
 * 2. The shine from the stars are not 100% solid (translucent, ethereal plasma).
 */

import { StarData } from '../types';

export interface D65ColorResult {
  colorHex: string;             // Photosphere primary color
  coronaColorHex: string;       // Outer concentric corona halo
  innerCoronaHex: string;       // Inner concentric corona ring
  brighterLowerHex: string;     // Brighter lower circle highlight
  rgb: [number, number, number];           // 0-1 range
  coronaRgb: [number, number, number];     // 0-1 range
  innerCoronaRgb: [number, number, number];// 0-1 range
  brighterLowerRgb: [number, number, number];// 0-1 range
  visualColorDescription: string;
}

export interface StarColorBlueprintEntry {
  classKey: string;
  name: string;
  starType: string;
  tempRangeStr: string;
  tempHot: number;
  tempCold: number;
  hexHot: string;
  hexCold: string;
  visualColorRange: string;
  description: string;
}

export interface FClassSpectralTypeEntry {
  subclass: string;
  tempK: number;
  tempFormatted: string;
  hex: string;
  visualColor: string;
}

/**
 * Master Star Colorization Blueprint
 */
export const STAR_COLORIZATION_BLUEPRINT: StarColorBlueprintEntry[] = [
  {
    classKey: 'W',
    name: 'Wolf-Rayet',
    starType: 'Wolf-Rayet',
    tempRangeStr: '100,000 K – 33,000 K',
    tempHot: 100000,
    tempCold: 33000,
    hexHot: '#8fb2ff',
    hexCold: '#9bb0ff',
    visualColorRange: 'Extreme blue to Brilliant blue',
    description: 'Scorching stripped stellar cores undergoing violent mass loss with high-excitation emission lines.',
  },
  {
    classKey: 'O',
    name: 'Class O',
    starType: 'Main Sequence',
    tempRangeStr: '50,000 K – 33,000 K',
    tempHot: 50000,
    tempCold: 33000,
    hexHot: '#92b5ff',
    hexCold: '#9bb0ff',
    visualColorRange: 'Brilliant blue to Blue',
    description: 'Blistering massive furnaces radiating primarily in ionizing ultraviolet light.',
  },
  {
    classKey: 'B',
    name: 'Class B',
    starType: 'Main Sequence',
    tempRangeStr: '33,000 K – 10,000 K',
    tempHot: 33000,
    tempCold: 10000,
    hexHot: '#9bb0ff',
    hexCold: '#c0d1ff',
    visualColorRange: 'Blue to Deep bluish white',
    description: 'Luminous blue beacons dominating young open clusters and stellar nurseries like Orion.',
  },
  {
    classKey: 'A',
    name: 'Class A',
    starType: 'Main Sequence',
    tempRangeStr: '10,000 K – 7,300 K',
    tempHot: 10000,
    tempCold: 7300,
    hexHot: '#c0d1ff',
    hexCold: '#e4e8ff',
    visualColorRange: 'Deep bluish white to Bluish white',
    description: 'White diamond stars with dominant hydrogen Balmer absorption lines (e.g. Vega, Sirius A).',
  },
  {
    classKey: 'F',
    name: 'Class F',
    starType: 'Main Sequence',
    tempRangeStr: '7,300 K – 6,000 K',
    tempHot: 7300,
    tempCold: 6000,
    hexHot: '#e4e8ff',
    hexCold: '#fff4e8',
    visualColorRange: 'Bluish white to Yellowish white',
    description: 'Creamy ivory-white stars slightly hotter than our Sun with stable billion-year lifespans.',
  },
  {
    classKey: 'G',
    name: 'Class G',
    starType: 'Main Sequence',
    tempRangeStr: '6,000 K – 5,300 K',
    tempHot: 6000,
    tempCold: 5300,
    hexHot: '#fff4e8',
    hexCold: '#ffe4ce',
    visualColorRange: 'Yellowish white to Pale yellow',
    description: 'Solar yellow-white dwarf stars (including our Sun G2V, ~5,778 K).',
  },
  {
    classKey: 'K',
    name: 'Class K',
    starType: 'Main Sequence',
    tempRangeStr: '5,300 K – 3,900 K',
    tempHot: 5300,
    tempCold: 3900,
    hexHot: '#ffe4ce',
    hexCold: '#ffba8a',
    visualColorRange: 'Pale yellow to Light orange',
    description: 'Super-habitable orange dwarfs and evolved giants (e.g. Arcturus, Aldebaran).',
  },
  {
    classKey: 'S',
    name: 'Class S',
    starType: 'S-type Star',
    tempRangeStr: '3,500 K – 2,500 K',
    tempHot: 3500,
    tempCold: 2500,
    hexHot: '#ffa15c',
    hexCold: '#ff6600',
    visualColorRange: 'Light orange to Deep orange',
    description: 'Peculiar AGB giants with zirconium oxide (ZrO) bands and radioactive technetium-99.',
  },
  {
    classKey: 'M',
    name: 'Class M',
    starType: 'Main Sequence',
    tempRangeStr: '3,900 K – 2,300 K',
    tempHot: 3900,
    tempCold: 2300,
    hexHot: '#ffba8a',
    hexCold: '#ff7e2f',
    visualColorRange: 'Light orange to Orangish red',
    description: 'Most abundant star class in the universe, spanning red dwarfs to red hypergiants.',
  },
  {
    classKey: 'C',
    name: 'Class C',
    starType: 'Carbon Star',
    tempRangeStr: '3,200 K – 2,500 K',
    tempHot: 3200,
    tempCold: 2500,
    hexHot: '#ff8b3d',
    hexCold: '#cc2200',
    visualColorRange: 'Orangish red to Ruby red',
    description: 'Deep ruby crimson giants where atmospheric carbon soot completely absorbs blue light.',
  },
  {
    classKey: 'L',
    name: 'Class L',
    starType: 'Brown Dwarf',
    tempRangeStr: '2,000 K – 1,300 K',
    tempHot: 2000,
    tempCold: 1300,
    hexHot: '#ff6a00',
    hexCold: '#ff1a00',
    visualColorRange: 'Deep red to Extremely dark red',
    description: 'Substellar brown dwarfs with iron/silicate cloud layers and deep crimson convective glow.',
  },
  {
    classKey: 'T',
    name: 'Class T',
    starType: 'Brown Dwarf',
    tempRangeStr: '1,300 K – 500 K',
    tempHot: 1300,
    tempCold: 500,
    hexHot: '#cc0052',
    hexCold: '#4d004d',
    visualColorRange: 'Dim magenta to Dark purplish-brown',
    description: 'Methane-dominated substellar atmospheres radiating faint magenta to purplish hues.',
  },
  {
    classKey: 'Y',
    name: 'Class Y',
    starType: 'Brown Dwarf',
    tempRangeStr: '< 500 K',
    tempHot: 500,
    tempCold: 250,
    hexHot: '#260026',
    hexCold: '#444444',
    visualColorRange: 'Faint purplish-black to Pitch black',
    description: 'Ultracool substellar ice dwarfs at ambient room to sub-freezing temperatures.',
  },
];

/**
 * F-class spectral types breakdown matching blueprint specification
 */
export const F_CLASS_SPECTRAL_TYPES_BLUEPRINT: FClassSpectralTypeEntry[] = [
  { subclass: 'F0', tempK: 7220, tempFormatted: '7,220 K', hex: '#e4ecff', visualColor: 'Very pale bluish white' },
  { subclass: 'F1', tempK: 7020, tempFormatted: '7,020 K', hex: '#eaf0ff', visualColor: 'Extremely pale bluish white' },
  { subclass: 'F2', tempK: 6820, tempFormatted: '6,820 K', hex: '#f1f4ff', visualColor: 'Barely perceptible cool white' },
  { subclass: 'F3', tempK: 6750, tempFormatted: '6,750 K', hex: '#f4f6ff', visualColor: 'Cool-tinted white' },
  { subclass: 'F4', tempK: 6670, tempFormatted: '6,670 K', hex: '#f7f8ff', visualColor: 'Near-pure white' },
  { subclass: 'F5', tempK: 6550, tempFormatted: '6,550 K', hex: '#fdfdff', visualColor: 'Pure daylight white' },
  { subclass: 'F6', tempK: 6350, tempFormatted: '6,350 K', hex: '#fff5ec', visualColor: 'Barely perceptible warm white' },
  { subclass: 'F7', tempK: 6280, tempFormatted: '6,280 K', hex: '#fff3e5', visualColor: 'Warm-tinted white' },
  { subclass: 'F8', tempK: 6180, tempFormatted: '6,180 K', hex: '#ffefda', visualColor: 'Very pale yellowish white' },
  { subclass: 'F9', tempK: 6050, tempFormatted: '6,050 K', hex: '#ffebce', visualColor: 'Pale yellowish white' },
];

export interface SpectralAnchor {
  classKey: string;
  subclass: number;
  temp: number; // in Kelvin
  hex: string;
  visualColor: string;
}

/**
 * Calibrated Spectral Anchors strictly anchored to the Blueprint ranges and F0..F9 values
 */
export const D65_SPECTRAL_ANCHORS: SpectralAnchor[] = [
  // Class W (Wolf-Rayet: 100,000 K – 33,000 K, #8fb2ff – #9bb0ff)
  { classKey: 'W', subclass: 0, temp: 100000, hex: '#8fb2ff', visualColor: 'Extreme blue' },
  { classKey: 'W', subclass: 5, temp: 66500, hex: '#95b1ff', visualColor: 'Vivid brilliant blue' },
  { classKey: 'W', subclass: 9, temp: 33000, hex: '#9bb0ff', visualColor: 'Brilliant blue' },

  // Class O (Main Sequence: 50,000 K – 33,000 K, #92b5ff – #9bb0ff)
  { classKey: 'O', subclass: 0, temp: 50000, hex: '#92b5ff', visualColor: 'Brilliant blue' },
  { classKey: 'O', subclass: 2, temp: 46000, hex: '#94b3ff', visualColor: 'Brilliant blue' },
  { classKey: 'O', subclass: 5, temp: 41500, hex: '#96b2ff', visualColor: 'Luminous blue' },
  { classKey: 'O', subclass: 7, temp: 37000, hex: '#98b1ff', visualColor: 'Deep blue' },
  { classKey: 'O', subclass: 9, temp: 33000, hex: '#9bb0ff', visualColor: 'Blue' },

  // Class B (Main Sequence: 33,000 K – 10,000 K, #9bb0ff – #c0d1ff)
  { classKey: 'B', subclass: 0, temp: 33000, hex: '#9bb0ff', visualColor: 'Blue' },
  { classKey: 'B', subclass: 1, temp: 28000, hex: '#a1b6ff', visualColor: 'Azure blue' },
  { classKey: 'B', subclass: 3, temp: 20000, hex: '#abbdff', visualColor: 'Ice blue' },
  { classKey: 'B', subclass: 5, temp: 15000, hex: '#b3c4ff', visualColor: 'Light ice blue' },
  { classKey: 'B', subclass: 7, temp: 12500, hex: '#bacaff', visualColor: 'Bluish white' },
  { classKey: 'B', subclass: 9, temp: 10000, hex: '#c0d1ff', visualColor: 'Deep bluish white' },

  // Class A (Main Sequence: 10,000 K – 7,300 K, #c0d1ff – #e4e8ff)
  { classKey: 'A', subclass: 0, temp: 10000, hex: '#c0d1ff', visualColor: 'Deep bluish white' },
  { classKey: 'A', subclass: 1, temp: 9500, hex: '#c6d5ff', visualColor: 'Bluish white' },
  { classKey: 'A', subclass: 3, temp: 8800, hex: '#cedaff', visualColor: 'Pale bluish white' },
  { classKey: 'A', subclass: 5, temp: 8200, hex: '#d6dfff', visualColor: 'Crisp bluish white' },
  { classKey: 'A', subclass: 7, temp: 7700, hex: '#dee4ff', visualColor: 'Subtle bluish white' },
  { classKey: 'A', subclass: 9, temp: 7300, hex: '#e4e8ff', visualColor: 'Bluish white' },

  // Class F (Main Sequence: 7,300 K – 6,000 K, #e4e8ff – #fff4e8)
  // Incorporates exact F0..F9 anchor blueprint
  { classKey: 'F', subclass: 0, temp: 7220, hex: '#e4ecff', visualColor: 'Very pale bluish white' },
  { classKey: 'F', subclass: 1, temp: 7020, hex: '#eaf0ff', visualColor: 'Extremely pale bluish white' },
  { classKey: 'F', subclass: 2, temp: 6820, hex: '#f1f4ff', visualColor: 'Barely perceptible cool white' },
  { classKey: 'F', subclass: 3, temp: 6750, hex: '#f4f6ff', visualColor: 'Cool-tinted white' },
  { classKey: 'F', subclass: 4, temp: 6670, hex: '#f7f8ff', visualColor: 'Near-pure white' },
  { classKey: 'F', subclass: 5, temp: 6550, hex: '#fdfdff', visualColor: 'Pure daylight white' },
  { classKey: 'F', subclass: 6, temp: 6350, hex: '#fff5ec', visualColor: 'Barely perceptible warm white' },
  { classKey: 'F', subclass: 7, temp: 6280, hex: '#fff3e5', visualColor: 'Warm-tinted white' },
  { classKey: 'F', subclass: 8, temp: 6180, hex: '#ffefda', visualColor: 'Very pale yellowish white' },
  { classKey: 'F', subclass: 9, temp: 6050, hex: '#ffebce', visualColor: 'Pale yellowish white' },

  // Class G (Main Sequence: 6,000 K – 5,300 K, #fff4e8 – #ffe4ce)
  { classKey: 'G', subclass: 0, temp: 6000, hex: '#fff4e8', visualColor: 'Yellowish white' },
  { classKey: 'G', subclass: 1, temp: 5860, hex: '#fff1e2', visualColor: 'Warm daylight white' },
  { classKey: 'G', subclass: 2, temp: 5778, hex: '#ffefdf', visualColor: 'Solar yellow-white (Sun G2V)' },
  { classKey: 'G', subclass: 5, temp: 5500, hex: '#ffe9d5', visualColor: 'Soft pale yellow' },
  { classKey: 'G', subclass: 7, temp: 5400, hex: '#ffe6d1', visualColor: 'Pale yellow' },
  { classKey: 'G', subclass: 9, temp: 5300, hex: '#ffe4ce', visualColor: 'Pale yellow' },

  // Class K (Main Sequence: 5,300 K – 3,900 K, #ffe4ce – #ffba8a)
  { classKey: 'K', subclass: 0, temp: 5300, hex: '#ffe4ce', visualColor: 'Pale yellow' },
  { classKey: 'K', subclass: 2, temp: 4900, hex: '#ffd9bc', visualColor: 'Warm pale amber' },
  { classKey: 'K', subclass: 4, temp: 4500, hex: '#ffcda9', visualColor: 'Soft warm peach' },
  { classKey: 'K', subclass: 6, temp: 4200, hex: '#ffc49b', visualColor: 'Light orange' },
  { classKey: 'K', subclass: 9, temp: 3900, hex: '#ffba8a', visualColor: 'Light orange' },

  // Class S (S-type Star: 3,500 K – 2,500 K, #ffa15c – #ff6600)
  { classKey: 'S', subclass: 0, temp: 3500, hex: '#ffa15c', visualColor: 'Light orange' },
  { classKey: 'S', subclass: 3, temp: 3200, hex: '#ff8f42', visualColor: 'Vivid orange' },
  { classKey: 'S', subclass: 5, temp: 3000, hex: '#ff842e', visualColor: 'Deep amber orange' },
  { classKey: 'S', subclass: 7, temp: 2750, hex: '#ff7517', visualColor: 'Rich vermilion orange' },
  { classKey: 'S', subclass: 9, temp: 2500, hex: '#ff6600', visualColor: 'Deep orange' },

  // Class M (Main Sequence: 3,900 K – 2,300 K, #ffba8a – #ff7e2f)
  { classKey: 'M', subclass: 0, temp: 3900, hex: '#ffba8a', visualColor: 'Light orange' },
  { classKey: 'M', subclass: 1, temp: 3700, hex: '#ffb37e', visualColor: 'Peach orange' },
  { classKey: 'M', subclass: 2, temp: 3500, hex: '#ffad73', visualColor: 'Warm orange' },
  { classKey: 'M', subclass: 4, temp: 3200, hex: '#ffa160', visualColor: 'Orangish red' },
  { classKey: 'M', subclass: 6, temp: 2800, hex: '#ff924d', visualColor: 'Rich orangish red' },
  { classKey: 'M', subclass: 8, temp: 2500, hex: '#ff863b', visualColor: 'Deep orangish red' },
  { classKey: 'M', subclass: 9, temp: 2300, hex: '#ff7e2f', visualColor: 'Orangish red' },

  // Class C (Carbon Star: 3,200 K – 2,500 K, #ff8b3d – #cc2200)
  { classKey: 'C', subclass: 0, temp: 3200, hex: '#ff8b3d', visualColor: 'Orangish red' },
  { classKey: 'C', subclass: 2, temp: 3050, hex: '#f5742c', visualColor: 'Warm crimson red' },
  { classKey: 'C', subclass: 5, temp: 2850, hex: '#e6561f', visualColor: 'Deep scarlet' },
  { classKey: 'C', subclass: 7, temp: 2700, hex: '#d93d10', visualColor: 'Blood red' },
  { classKey: 'C', subclass: 9, temp: 2500, hex: '#cc2200', visualColor: 'Ruby red' },

  // Class L (Brown Dwarf: 2,000 K – 1,300 K, #ff6a00 – #ff1a00)
  { classKey: 'L', subclass: 0, temp: 2000, hex: '#ff6a00', visualColor: 'Deep red' },
  { classKey: 'L', subclass: 2, temp: 1850, hex: '#ff5800', visualColor: 'Carmine red' },
  { classKey: 'L', subclass: 5, temp: 1650, hex: '#ff4200', visualColor: 'Dark convective crimson' },
  { classKey: 'L', subclass: 8, temp: 1450, hex: '#ff2900', visualColor: 'Deep dark red' },
  { classKey: 'L', subclass: 9, temp: 1300, hex: '#ff1a00', visualColor: 'Extremely dark red' },

  // Class T (Brown Dwarf: 1,300 K – 500 K, #cc0052 – #4d004d)
  { classKey: 'T', subclass: 0, temp: 1300, hex: '#cc0052', visualColor: 'Dim magenta' },
  { classKey: 'T', subclass: 2, temp: 1150, hex: '#b30052', visualColor: 'Deep wine magenta' },
  { classKey: 'T', subclass: 5, temp: 900, hex: '#8c0050', visualColor: 'Plum wine' },
  { classKey: 'T', subclass: 8, temp: 650, hex: '#66004e', visualColor: 'Dark purplish-plum' },
  { classKey: 'T', subclass: 9, temp: 500, hex: '#4d004d', visualColor: 'Dark purplish-brown' },

  // Class Y (Brown Dwarf: < 500 K, #260026 – #444444)
  { classKey: 'Y', subclass: 0, temp: 500, hex: '#260026', visualColor: 'Faint purplish-black' },
  { classKey: 'Y', subclass: 3, temp: 420, hex: '#2e112e', visualColor: 'Deep charcoal-plum' },
  { classKey: 'Y', subclass: 5, temp: 350, hex: '#352235', visualColor: 'Slate violet-black' },
  { classKey: 'Y', subclass: 8, temp: 280, hex: '#3d333d', visualColor: 'Dark slate graphite' },
  { classKey: 'Y', subclass: 9, temp: 250, hex: '#444444', visualColor: 'Pitch black / graphite' },
];

// Helper to convert hex to RGB [0-1, 0-1, 0-1]
export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return [r, g, b];
}

// Helper to convert RGB [0-1, 0-1, 0-1] to Hex string
export function rgbToHex(rgb: [number, number, number]): string {
  const r = Math.max(0, Math.min(255, Math.round(rgb[0] * 255)));
  const g = Math.max(0, Math.min(255, Math.round(rgb[1] * 255)));
  const b = Math.max(0, Math.min(255, Math.round(rgb[2] * 255)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Linear color interpolation in sRGB
export function lerpRgb(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  const clampedT = Math.max(0, Math.min(1, t));
  return [
    a[0] + (b[0] - a[0]) * clampedT,
    a[1] + (b[1] - a[1]) * clampedT,
    a[2] + (b[2] - a[2]) * clampedT,
  ];
}

/**
 * Calculates Concentric Corona color and Brighter Lower Circle color for any stellar RGB
 * 
 * Rules:
 * 1. Concentric corona colorization:
 *    - innerCoronaRgb: bright, luminous concentric transition ring immediately hugging the star disc
 *    - coronaRgb: outer radiant concentric atmospheric aura
 * 2. Brighter lower circle:
 *    - brighterLowerRgb: boosted luminance lower crescent/disc highlight (35-50% brighter)
 */
export function deriveConcentricCoronaAndLowerHighlight(
  rgb: [number, number, number],
  classKey: string,
  tempK?: number
): {
  coronaRgb: [number, number, number];
  innerCoronaRgb: [number, number, number];
  brighterLowerRgb: [number, number, number];
} {
  const t = tempK ?? 5778;

  // Brighter lower circle calculation:
  // Concentrates higher luminosity toward white / incandescent core for lower circle
  let brighterLowerRgb: [number, number, number];
  if (['Y', 'T'].includes(classKey) || t < 1300) {
    // Ultra-cool substellar bodies: boost by 65% with slight warm/plum ambient lift
    brighterLowerRgb = [
      Math.min(1.0, rgb[0] * 1.75 + 0.14),
      Math.min(1.0, rgb[1] * 1.75 + 0.08),
      Math.min(1.0, rgb[2] * 1.75 + 0.14),
    ];
  } else if (['L', 'C', 'S', 'M'].includes(classKey) || t < 4000) {
    // Cool reddish/orange stars: blend towards intense warm yellow-white incandescence
    brighterLowerRgb = lerpRgb(rgb, [1.0, 0.94, 0.82], 0.42);
  } else {
    // Normal / hot stars: blend towards brilliant white-hot core
    brighterLowerRgb = lerpRgb(rgb, [1.0, 1.0, 1.0], 0.38);
  }

  // Inner concentric corona ring: intermediate luminous transition
  const innerCoronaRgb: [number, number, number] = [
    Math.min(1.0, lerpRgb(rgb, [1.0, 1.0, 1.0], 0.20)[0] * 1.06),
    Math.min(1.0, lerpRgb(rgb, [1.0, 1.0, 1.0], 0.20)[1] * 1.06),
    Math.min(1.0, lerpRgb(rgb, [1.0, 1.0, 1.0], 0.20)[2] * 1.06),
  ];

  // Outer concentric corona halo:
  let coronaRgb: [number, number, number];
  if (['W', 'O', 'B'].includes(classKey) || t > 10000) {
    // Ethereal radiant sapphire / sky blue aura
    coronaRgb = [rgb[0] * 0.82, rgb[1] * 0.90, Math.min(1.0, rgb[2] * 1.05)];
  } else if (classKey === 'A' || (t >= 7300 && t <= 10000)) {
    // Crisp pale ice-blue corona
    coronaRgb = [rgb[0] * 0.88, rgb[1] * 0.93, Math.min(1.0, rgb[2] * 1.02)];
  } else if (classKey === 'F') {
    // Soft pearlescent ivory halo
    coronaRgb = [rgb[0] * 0.94, rgb[1] * 0.92, rgb[2] * 0.98];
  } else if (classKey === 'G') {
    // Warm golden solar halo (Sun-like corona)
    coronaRgb = [rgb[0], rgb[1] * 0.86, rgb[2] * 0.70];
  } else if (classKey === 'K') {
    // Warm peach-amber glow
    coronaRgb = [rgb[0], rgb[1] * 0.78, rgb[2] * 0.52];
  } else if (classKey === 'M') {
    // Glowing apricot-orange / ember aura
    coronaRgb = [rgb[0], rgb[1] * 0.70, rgb[2] * 0.38];
  } else if (classKey === 'S') {
    // Deep orange / vermilion glow
    coronaRgb = [rgb[0], rgb[1] * 0.55, rgb[2] * 0.15];
  } else if (classKey === 'C') {
    // Intense ruby red atmospheric smoke glow
    coronaRgb = [Math.min(1.0, rgb[0] * 1.15), rgb[1] * 0.35, rgb[2] * 0.25];
  } else if (classKey === 'L') {
    // Faint dark carmine crimson glow
    coronaRgb = [rgb[0] * 0.85, rgb[1] * 0.22, rgb[2] * 0.12];
  } else if (classKey === 'T') {
    // Faint Jovian magenta halo
    coronaRgb = [rgb[0] * 0.85, rgb[1] * 0.20, rgb[2] * 0.65];
  } else {
    // Class Y: ultra-faint violet/charcoal halo
    coronaRgb = [rgb[0] * 0.75, rgb[1] * 0.35, rgb[2] * 0.75];
  }

  return { coronaRgb, innerCoronaRgb, brighterLowerRgb };
}

/**
 * Extracts spectral class letter and continuous decimal subclass number from a spectral type string.
 */
export function parseSpectralType(
  spectralTypeStr?: string,
  fallbackClass?: string
): { classKey: string; subclass: number; isSubdwarf: boolean; hasExplicitSubclass: boolean } {
  let str = (spectralTypeStr || fallbackClass || '').trim().toUpperCase();

  // Strip brackets, e.g. "[WO1]" -> "WO1"
  str = str.replace(/[\[\]]/g, '').trim();

  // Take primary component for multi-spectral designations (e.g. "F8/G0V" -> "F8")
  if (str.includes('/')) str = str.split('/')[0].trim();
  if (str.includes('+')) str = str.split('+')[0].trim();

  // 1. Identify and strip subdwarf prefixes FIRST before any class matching:
  let isSubdwarf = false;
  if (str.startsWith('SUBDWARF')) {
    isSubdwarf = true;
    str = str.substring(8).replace(/^[-:\s]+/, '').trim();
  } else if (str.startsWith('ESD') || str.startsWith('USD')) {
    isSubdwarf = true;
    str = str.substring(3).replace(/^[-:\s]+/, '').trim();
  } else if (str.startsWith('SD') && !str.startsWith('SDSS')) {
    isSubdwarf = true;
    str = str.substring(2).replace(/^[-:\s]+/, '').trim();
  }

  // Strip luminosity class VI if at end (e.g. "M1.5VI" -> "M1.5")
  if (str.endsWith('VI') && !str.endsWith('VII')) {
    isSubdwarf = true;
    str = str.substring(0, str.length - 2).trim();
  }

  // Special cases: Wolf-Rayet, LBV, White Dwarfs, Neutron Stars
  if (str.startsWith('WN') || str.startsWith('WC') || str.startsWith('WO') || str.includes('WR') || str.includes('WOLF-RAYET')) {
    const numMatch = str.match(/\d+(\.\d+)?/);
    return { classKey: 'W', subclass: numMatch ? parseFloat(numMatch[0]) : 5, isSubdwarf, hasExplicitSubclass: !!numMatch };
  }
  if (str.includes('LBV') || str.includes('LUMINOUS BLUE VARIABLE')) {
    return { classKey: 'LBV', subclass: 0, isSubdwarf, hasExplicitSubclass: true };
  }
  if (str.startsWith('DA') || str.startsWith('DB') || str.startsWith('DC') || str.startsWith('DO') || str.startsWith('DQ') || str.startsWith('DZ') || str.includes('WD') || str.includes('WHITE DWARF') || str === 'UG') {
    const numMatch = str.match(/\d+(\.\d+)?/);
    return { classKey: 'WD', subclass: numMatch ? parseFloat(numMatch[0]) : 3, isSubdwarf, hasExplicitSubclass: !!numMatch };
  }
  if (str.includes('PSR') || str.includes('PULSAR') || str.includes('NEUTRON') || str === 'NS') {
    return { classKey: 'NS', subclass: 0, isSubdwarf, hasExplicitSubclass: true };
  }
  if (str.startsWith('C-') || str.startsWith('C') || str.includes('CARBON')) {
    const numMatch = str.match(/\d+(\.\d+)?/);
    return { classKey: 'C', subclass: numMatch ? parseFloat(numMatch[0]) : 5, isSubdwarf, hasExplicitSubclass: !!numMatch };
  }

  // True Class S stars (Zirconium stars, e.g. "S3", "S-TYPE", "S4/6", "SC"):
  if ((str.startsWith('S') && !str.startsWith('SD') && !str.startsWith('SOL')) || str.includes('ZIRCONIUM')) {
    const numMatch = str.match(/\d+(\.\d+)?/);
    return { classKey: 'S', subclass: numMatch ? parseFloat(numMatch[0]) : 3, isSubdwarf, hasExplicitSubclass: !!numMatch };
  }

  // Strip classical dwarf prefix ("D" followed by standard class letter, e.g. "DG2" -> "G2")
  if (/^D[OBAFGKMLTYW]\d/i.test(str)) {
    str = str.substring(1).trim();
  }

  // Standard Harvard/Yerkes: [W, O, B, A, F, G, K, M, L, T, Y] followed by optional decimal number
  const match = str.match(/^([WOBAFGKMLTY])\s*(\d+(\.\d+)?)/);
  if (match) {
    const classKey = match[1];
    const subclass = parseFloat(match[2]);
    return { classKey, subclass, isSubdwarf, hasExplicitSubclass: true };
  }

  const matchLetterOnly = str.match(/^([WOBAFGKMLTY])/);
  if (matchLetterOnly) {
    return { classKey: matchLetterOnly[1], subclass: 5, isSubdwarf, hasExplicitSubclass: false };
  }

  // Fallback to single class character if provided
  const fallback = (fallbackClass || 'G').toUpperCase().charAt(0);
  if (['W', 'O', 'B', 'A', 'F', 'G', 'K', 'M', 'L', 'T', 'Y'].includes(fallback)) {
    return { classKey: fallback, subclass: 5, isSubdwarf, hasExplicitSubclass: false };
  }

  return { classKey: 'G', subclass: 2, isSubdwarf, hasExplicitSubclass: false };
}

/**
 * Computes exact D65 Chromaticity Photosphere, Concentric Corona Colors, and Brighter Lower Circle
 * strictly compliant with the Blueprint.
 */
export function computeD65StellarColor(params: {
  spectralType?: string;
  spectralClass?: string;
  temperature?: number;
  stellarStage?: string;
}): D65ColorResult {
  const { spectralType, spectralClass, temperature, stellarStage } = params;

  // 1. Check exotic stellar stages first
  const stageUpper = (stellarStage || '').toUpperCase();
  if (stageUpper.includes('PULSAR') || stageUpper.includes('NEUTRON') || spectralClass === 'NS') {
    const rgb: [number, number, number] = hexToRgb('#00f0ff');
    const { coronaRgb, innerCoronaRgb, brighterLowerRgb } = deriveConcentricCoronaAndLowerHighlight(rgb, 'NS', 100000);
    return {
      colorHex: rgbToHex(rgb),
      coronaColorHex: rgbToHex(coronaRgb),
      innerCoronaHex: rgbToHex(innerCoronaRgb),
      brighterLowerHex: rgbToHex(brighterLowerRgb),
      rgb,
      coronaRgb,
      innerCoronaRgb,
      brighterLowerRgb,
      visualColorDescription: 'Relativistic synchrotron cyan',
    };
  }

  if (stageUpper.includes('WHITE DWARF') || spectralClass === 'WD') {
    const rgb: [number, number, number] = hexToRgb('#dbeafe');
    const { coronaRgb, innerCoronaRgb, brighterLowerRgb } = deriveConcentricCoronaAndLowerHighlight(rgb, 'A', 12000);
    return {
      colorHex: rgbToHex(rgb),
      coronaColorHex: rgbToHex(coronaRgb),
      innerCoronaHex: rgbToHex(innerCoronaRgb),
      brighterLowerHex: rgbToHex(brighterLowerRgb),
      rgb,
      coronaRgb,
      innerCoronaRgb,
      brighterLowerRgb,
      visualColorDescription: 'Deep bluish white degenerate relic',
    };
  }

  if (stageUpper.includes('LUMINOUS BLUE VARIABLE') || spectralClass === 'LBV') {
    const rgb: [number, number, number] = hexToRgb('#9bb0ff');
    const { coronaRgb, innerCoronaRgb, brighterLowerRgb } = deriveConcentricCoronaAndLowerHighlight(rgb, 'B', 25000);
    return {
      colorHex: rgbToHex(rgb),
      coronaColorHex: rgbToHex(coronaRgb),
      innerCoronaHex: rgbToHex(innerCoronaRgb),
      brighterLowerHex: rgbToHex(brighterLowerRgb),
      rgb,
      coronaRgb,
      innerCoronaRgb,
      brighterLowerRgb,
      visualColorDescription: 'Brilliant blue eruptive hypergiant',
    };
  }

  // 2. Parse Harvard/Yerkes/Blueprint class and subclass number
  const { classKey, subclass, isSubdwarf, hasExplicitSubclass } = parseSpectralType(spectralType, spectralClass);

  let effectiveSubclass = subclass;
  const classAnchors = D65_SPECTRAL_ANCHORS.filter((a) => a.classKey === classKey);

  if (classAnchors.length > 0) {
    if (isSubdwarf) {
      if (!hasExplicitSubclass) {
        if (classKey === 'W') effectiveSubclass = 5;
        else if (classKey === 'O') effectiveSubclass = 5;
        else if (classKey === 'B') effectiveSubclass = 2;
        else if (classKey === 'A') effectiveSubclass = 2;
        else if (classKey === 'F') effectiveSubclass = 4;
        else if (classKey === 'G') effectiveSubclass = 2;
        else if (classKey === 'K') effectiveSubclass = 4;
        else if (classKey === 'M') effectiveSubclass = 3;
        else effectiveSubclass = 5;
      }
    } else {
      // For stars without an explicit numeric subclass, interpolate subclass continuously from temperature
      if (!hasExplicitSubclass && temperature && temperature > 0) {
        const highestTemp = classAnchors[0].temp;
        const lowestTemp = classAnchors[classAnchors.length - 1].temp;
        const clampedT = Math.max(lowestTemp, Math.min(highestTemp, temperature));
        for (let i = 0; i < classAnchors.length - 1; i++) {
          const a1 = classAnchors[i];
          const a2 = classAnchors[i + 1];
          if (clampedT <= a1.temp && clampedT >= a2.temp) {
            const frac = (a1.temp - clampedT) / (a1.temp - a2.temp);
            effectiveSubclass = a1.subclass + frac * (a2.subclass - a1.subclass);
            break;
          }
        }
      }
    }

    // Subclass below or equal to first anchor
    if (effectiveSubclass <= classAnchors[0].subclass) {
      const anchor = classAnchors[0];
      const rgb = hexToRgb(anchor.hex);
      const { coronaRgb, innerCoronaRgb, brighterLowerRgb } = deriveConcentricCoronaAndLowerHighlight(rgb, classKey, temperature || anchor.temp);
      return {
        colorHex: rgbToHex(rgb),
        coronaColorHex: rgbToHex(coronaRgb),
        innerCoronaHex: rgbToHex(innerCoronaRgb),
        brighterLowerHex: rgbToHex(brighterLowerRgb),
        rgb,
        coronaRgb,
        innerCoronaRgb,
        brighterLowerRgb,
        visualColorDescription: anchor.visualColor,
      };
    }

    // Subclass above or equal to last anchor
    const lastIdx = classAnchors.length - 1;
    if (effectiveSubclass >= classAnchors[lastIdx].subclass) {
      const anchor = classAnchors[lastIdx];
      const rgb = hexToRgb(anchor.hex);
      const { coronaRgb, innerCoronaRgb, brighterLowerRgb } = deriveConcentricCoronaAndLowerHighlight(rgb, classKey, temperature || anchor.temp);
      return {
        colorHex: rgbToHex(rgb),
        coronaColorHex: rgbToHex(coronaRgb),
        innerCoronaHex: rgbToHex(innerCoronaRgb),
        brighterLowerHex: rgbToHex(brighterLowerRgb),
        rgb,
        coronaRgb,
        innerCoronaRgb,
        brighterLowerRgb,
        visualColorDescription: anchor.visualColor,
      };
    }

    // Interpolate between the two enclosing anchors in this spectral class
    for (let i = 0; i < classAnchors.length - 1; i++) {
      const a1 = classAnchors[i];
      const a2 = classAnchors[i + 1];
      if (effectiveSubclass >= a1.subclass && effectiveSubclass <= a2.subclass) {
        const factor = (effectiveSubclass - a1.subclass) / (a2.subclass - a1.subclass);
        const rgb = lerpRgb(hexToRgb(a1.hex), hexToRgb(a2.hex), factor);
        const { coronaRgb, innerCoronaRgb, brighterLowerRgb } = deriveConcentricCoronaAndLowerHighlight(rgb, classKey, temperature);
        const visualDesc = factor < 0.5 ? a1.visualColor : a2.visualColor;
        return {
          colorHex: rgbToHex(rgb),
          coronaColorHex: rgbToHex(coronaRgb),
          innerCoronaHex: rgbToHex(innerCoronaRgb),
          brighterLowerHex: rgbToHex(brighterLowerRgb),
          rgb,
          coronaRgb,
          innerCoronaRgb,
          brighterLowerRgb,
          visualColorDescription: visualDesc,
        };
      }
    }
  }

  // 3. Fallback: Temperature-driven interpolation
  if (temperature && temperature > 0) {
    return computeD65ColorByTemperature(temperature);
  }

  // Default Sun G2V solar yellow-white
  const defaultRgb: [number, number, number] = hexToRgb('#ffefdf');
  const { coronaRgb, innerCoronaRgb, brighterLowerRgb } = deriveConcentricCoronaAndLowerHighlight(defaultRgb, 'G', 5778);
  return {
    colorHex: rgbToHex(defaultRgb),
    coronaColorHex: rgbToHex(coronaRgb),
    innerCoronaHex: rgbToHex(innerCoronaRgb),
    brighterLowerHex: rgbToHex(brighterLowerRgb),
    rgb: defaultRgb,
    coronaRgb,
    innerCoronaRgb,
    brighterLowerRgb,
    visualColorDescription: 'Solar yellow-white',
  };
}

/**
 * Computes exact D65 chromaticity by continuous effective temperature T_eff (Kelvin)
 */
export function computeD65ColorByTemperature(tempK: number): D65ColorResult {
  const t = Math.max(250, Math.min(100000, tempK));

  for (let i = 0; i < D65_SPECTRAL_ANCHORS.length - 1; i++) {
    const high = D65_SPECTRAL_ANCHORS[i];
    const low = D65_SPECTRAL_ANCHORS[i + 1];
    if (t <= high.temp && t >= low.temp) {
      const factor = (high.temp - t) / (high.temp - low.temp);
      const rgb = lerpRgb(hexToRgb(high.hex), hexToRgb(low.hex), factor);
      const { coronaRgb, innerCoronaRgb, brighterLowerRgb } = deriveConcentricCoronaAndLowerHighlight(rgb, high.classKey, t);
      const visualDesc = factor < 0.5 ? high.visualColor : low.visualColor;
      return {
        colorHex: rgbToHex(rgb),
        coronaColorHex: rgbToHex(coronaRgb),
        innerCoronaHex: rgbToHex(innerCoronaRgb),
        brighterLowerHex: rgbToHex(brighterLowerRgb),
        rgb,
        coronaRgb,
        innerCoronaRgb,
        brighterLowerRgb,
        visualColorDescription: visualDesc,
      };
    }
  }

  if (t > D65_SPECTRAL_ANCHORS[0].temp) {
    const first = D65_SPECTRAL_ANCHORS[0];
    const rgb = hexToRgb(first.hex);
    const { coronaRgb, innerCoronaRgb, brighterLowerRgb } = deriveConcentricCoronaAndLowerHighlight(rgb, first.classKey, t);
    return {
      colorHex: rgbToHex(rgb),
      coronaColorHex: rgbToHex(coronaRgb),
      innerCoronaHex: rgbToHex(innerCoronaRgb),
      brighterLowerHex: rgbToHex(brighterLowerRgb),
      rgb,
      coronaRgb,
      innerCoronaRgb,
      brighterLowerRgb,
      visualColorDescription: first.visualColor,
    };
  }

  const last = D65_SPECTRAL_ANCHORS[D65_SPECTRAL_ANCHORS.length - 1];
  const rgb = hexToRgb(last.hex);
  const { coronaRgb, innerCoronaRgb, brighterLowerRgb } = deriveConcentricCoronaAndLowerHighlight(rgb, last.classKey, t);
  return {
    colorHex: rgbToHex(rgb),
    coronaColorHex: rgbToHex(coronaRgb),
    innerCoronaHex: rgbToHex(innerCoronaRgb),
    brighterLowerHex: rgbToHex(brighterLowerRgb),
    rgb,
    coronaRgb,
    innerCoronaRgb,
    brighterLowerRgb,
    visualColorDescription: last.visualColor,
  };
}

/**
 * Transforms any StarData record so that its colorHex and coronaColorHex
 * strictly adhere to the calibrated D65 chromaticity with spectral number precision.
 */
export function applyD65ChromaticityToStar<T extends StarData>(star: T): T {
  const d65 = computeD65StellarColor({
    spectralType: star.spectralType,
    spectralClass: star.spectralClass,
    temperature: star.temperature,
    stellarStage: star.stellarStage,
  });

  return {
    ...star,
    colorHex: d65.colorHex,
    coronaColorHex: d65.coronaColorHex,
  };
}
