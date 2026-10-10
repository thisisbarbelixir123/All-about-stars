import { StarData, SpectralClass } from '../types';

export const SOLAR_DIAMETER_KM = 1392700; // 1 Solar Diameter = 1,392,700 km = 1.3927 Gigameters (Gm)
export const AU_KM = 149597870.7; // 1 AU = 149,597,870.7 km

const SPECTRAL_ORDER: SpectralClass[] = ['NS', 'WR', 'LBV', 'O', 'B', 'A', 'F', 'G', 'K', 'M', 'C', 'S', 'L', 'T', 'Y', 'WD'];

/**
 * Normalizes a star's spectral classification according to astronomical rules:
 * 1. If the star has two spectral classes (e.g. binary/composite like 'WO4+O5', 'WN6h+O4', 'O3If* / WN6', 'L9+T'),
 *    only the spectral class and type of the principal star is used.
 * 2. If the spectral class of a star is known as a range (e.g. 'M4eIa+-M10e', 'M1-M3 I'),
 *    the range is rounded to the hottest type.
 * This ensures that all stars must be in the HR diagram.
 */
export function normalizeSpectralClassification(
  rawType: string,
  rawClass: SpectralClass
): { spectralType: string; spectralClass: SpectralClass } {
  let sType = rawType.trim();
  let sClass = rawClass;

  // Preserve dedicated LBV, Carbon Star, and S-type notations without range splitting
  if (rawClass === 'LBV' || sType.startsWith('LBV')) {
    return { spectralType: sType, spectralClass: 'LBV' };
  }
  if (rawClass === 'C' || sType.startsWith('C') || sType.startsWith('S') || rawClass === 'S') {
    if (sType.startsWith('C') || rawClass === 'C') {
      return { spectralType: sType, spectralClass: 'C' };
    }
    if (sType.startsWith('S') || rawClass === 'S') {
      return { spectralType: sType, spectralClass: 'S' };
    }
  }

  // Rule 1: If the star has two spectral classes, only the spectral class of the principal star is used
  // Handle binary/composite separated by '+' (excluding luminosity class Ia+):
  if (/(?<!\bI[ab]|\b0)\s*\+\s*(?=[A-Z])/.test(sType)) {
    const parts = sType.split(/\s*\+\s*(?=[A-Z])/);
    sType = parts[0].trim();
  }
  // Handle slash notation between two spectral classes (e.g. 'O3If*/WN6', 'D/WD'):
  if (/^[A-Z0-9*()f+–-]+\/[A-Z0-9*()f+–-]+/.test(sType) && !sType.toLowerCase().includes('pulsar')) {
    const parts = sType.split('/');
    if (parts[0] === 'D' && parts[1].startsWith('WD')) {
      sType = parts[1].trim();
    } else {
      sType = parts[0].trim();
    }
  }

  // Rule 2: If the spectral class of a star is known as a range, the range is rounded to the hottest type
  // Match patterns like 'M4eIa+-M10e' or 'M1-M3 I' or 'M1-2Ia' (ignoring hyphens inside parentheses)
  const rangeMatch = sType.match(/^([A-Z])([0-9.]+)([^\-–(]*)[-–](?:([A-Z])?([0-9.]+))(.*)$/);
  if (rangeMatch) {
    const [, c1, sub1, suffix1, c2Raw, sub2, rest] = rangeMatch;
    const c2 = c2Raw || c1;
    const n1 = parseFloat(sub1);
    const n2 = parseFloat(sub2);

    const idx1 = SPECTRAL_ORDER.indexOf(c1 as SpectralClass);
    const idx2 = SPECTRAL_ORDER.indexOf(c2 as SpectralClass);
    let hottestIsFirst = true;

    if (idx1 !== -1 && idx2 !== -1 && idx1 !== idx2) {
      hottestIsFirst = idx1 < idx2; // earlier in SPECTRAL_ORDER = hotter
    } else if (!isNaN(n1) && !isNaN(n2)) {
      // within the same class, smaller digit = hotter (0 is hottest, 9 is coolest)
      hottestIsFirst = n1 <= n2;
    }

    if (hottestIsFirst) {
      sType = (c1 + sub1 + suffix1 + (rest.startsWith(' ') ? rest : '')).trim();
      sClass = c1 as SpectralClass;
    } else {
      sType = (c2 + sub2 + rest).trim();
      sClass = c2 as SpectralClass;
    }
  }

  // Shorten excessively long classifications (pulsars, neutron stars, remnants)
  if (sType.toLowerCase().includes('millisecond pulsar') || sType.includes('716 Hz')) {
    sType = sType.includes('716 Hz') ? 'Pulsar (716 Hz MSP)' : 'Pulsar (MSP)';
  } else if (sType.toLowerCase().includes('radio-quiet gamma')) {
    sType = 'Pulsar (Gamma)';
  } else if (sType.toLowerCase().includes('binary neutron star')) {
    sType = 'Pulsar (Binary NS)';
  } else if (sType.toLowerCase().includes('isolated neutron star')) {
    sType = 'Neutron Star (INS)';
  } else if (sType.toLowerCase().includes('type iax remnant')) {
    sType = 'WD (Type Iax)';
  }

  // Derive/verify spectralClass from the principal star's type
  const firstLetter = sType.charAt(0);
  if (sType.startsWith('LBV') || sClass === 'LBV') {
    sClass = 'LBV';
  } else if (sType.startsWith('WO') || sType.startsWith('WN') || sType.startsWith('WC')) {
    sClass = 'WR';
  } else if (sType.startsWith('WD') || sType.startsWith('D')) {
    sClass = 'WD';
  } else if (
    sType.toLowerCase().includes('pulsar') ||
    sType.toLowerCase().includes('neutron') ||
    sClass === 'NS'
  ) {
    sClass = 'NS';
  } else if (firstLetter === 'C') {
    sClass = 'C';
  } else if (firstLetter === 'S' && !sType.toLowerCase().startsWith('sd')) {
    sClass = 'S';
  } else if (sType.toLowerCase().startsWith('sd')) {
    const sdLetter = sType.charAt(2).toUpperCase();
    if (['O', 'B', 'A', 'F', 'G', 'K', 'M'].includes(sdLetter)) {
      sClass = sdLetter as SpectralClass;
    }
  } else if (['O', 'B', 'A', 'F', 'G', 'K', 'M', 'T', 'Y'].includes(firstLetter)) {
    sClass = firstLetter as SpectralClass;
  } else if (firstLetter === 'L' && !sType.startsWith('LBV')) {
    sClass = 'L';
  }

  return { spectralType: sType, spectralClass: sClass };
}

export function makeStar(
  data: Omit<StarData, 'diameterKm' | 'diameterAU' | 'distanceParsecs' | 'diameterSolar'> & {
    diameterSolar?: number;
    diameterKm?: number;
  }
): StarData {
  let diameterKm: number;
  let diameterSolar: number;

  if (data.diameterKm !== undefined) {
    diameterKm = data.diameterKm;
    diameterSolar = data.diameterSolar !== undefined ? data.diameterSolar : data.diameterKm / SOLAR_DIAMETER_KM;
  } else if (data.diameterSolar !== undefined) {
    diameterSolar = data.diameterSolar;
    diameterKm = Math.round(data.diameterSolar * SOLAR_DIAMETER_KM);
  } else {
    diameterKm = SOLAR_DIAMETER_KM;
    diameterSolar = 1;
  }

  const diameterAU = diameterKm / AU_KM;
  const distanceParsecs = data.distanceLy / 3.26156;

  const { spectralType, spectralClass } = normalizeSpectralClassification(
    data.spectralType,
    data.spectralClass
  );

  return {
    ...data,
    spectralType,
    spectralClass,
    diameterSolar,
    diameterKm,
    diameterAU,
    distanceParsecs,
  };
}
