import { StarData } from '../types';

export interface FormattedStellarScale {
  rawKm: number;
  kmFormatted: string;
  metricSi: string;
  metricSiFull: string;
  scientificNotation: string;
  solarFormatted: string;
  auFormatted: string;
  scaleTier: 'km' | 'Mm' | 'Gm' | 'Tm';
  scaleTierLabel: string;
}

/**
 * Formats a stellar diameter into exact kilometers and SI units (km 10^3, Mm 10^6, Gm 10^9, Tm 10^12)
 */
export function formatPhysicalDiameter(diameterKm: number, diameterSolar?: number): FormattedStellarScale {
  const km = Math.max(0.001, diameterKm);
  const meters = km * 1000;
  const au = km / 149597870.7;
  const dSolar = diameterSolar !== undefined ? diameterSolar : km / 1392700;

  // Exact kilometer string
  const kmFormatted = km < 100 
    ? `${km.toFixed(0)} km`
    : km < 10000
    ? `${Math.round(km).toLocaleString()} km`
    : `${Math.round(km).toLocaleString()} km`;

  // Metric prefix calculations (Gigameters 10^9 m, Terameters 10^12 m)
  let metricSi = '';
  let metricSiFull = '';
  let scaleTier: 'km' | 'Mm' | 'Gm' | 'Tm' = 'km';
  let scaleTierLabel = '';

  if (meters < 1e6) {
    // Under 1,000 km (Kilometer scale 10^3 m) e.g. Crab Pulsar (20 km), Vela Pulsar (20 km)
    scaleTier = 'km';
    metricSi = `${km.toFixed(0)} km`;
    metricSiFull = `${km.toFixed(0)} km (10³ m scale)`;
    scaleTierLabel = 'Kilometer (10³ m)';
  } else if (meters < 1e9) {
    // 1,000 km to 1,000,000 km (Megameter scale 10^6 m) e.g. Sirius B (11.64 Mm), Proxima (214.5 Mm)
    scaleTier = 'Mm';
    const mmVal = km / 1000;
    metricSi = `${mmVal < 10 ? mmVal.toFixed(2) : mmVal < 100 ? mmVal.toFixed(1) : mmVal.toFixed(0)} Mm`;
    metricSiFull = `${metricSi} (10⁶ m scale)`;
    scaleTierLabel = 'Megameter (10⁶ m)';
  } else if (meters < 1e12) {
    // 1,000,000 km to 1,000,000,000 km (Gigameter scale 10^9 m) e.g. Sun (1.393 Gm), Rigel (109.9 Gm)
    scaleTier = 'Gm';
    const gmVal = km / 1e6;
    metricSi = `${gmVal < 10 ? gmVal.toFixed(3) : gmVal < 100 ? gmVal.toFixed(2) : gmVal.toFixed(1)} Gm`;
    metricSiFull = `${metricSi} (10⁹ m scale)`;
    scaleTierLabel = 'Gigameter (10⁹ m)';
  } else {
    // >= 1,000,000,000 km (Terameter scale 10^12 m) e.g. Betelgeuse (1.064 Tm), Stephenson 2-18 (2.994 Tm)
    scaleTier = 'Tm';
    const tmVal = km / 1e9;
    metricSi = `${tmVal.toFixed(3)} Tm`;
    metricSiFull = `${metricSi} (10¹² m scale)`;
    scaleTierLabel = 'Terameter (10¹² m)';
  }

  // Scientific notation in meters (e.g. 2.00 × 10⁴ m, 1.39 × 10⁹ m)
  const exponent = Math.floor(Math.log10(meters));
  const mantissa = (meters / Math.pow(10, exponent)).toFixed(2);
  const scientificNotation = `${mantissa} × 10${toSuperscript(exponent)} m`;

  // Solar unit formatted
  let solarFormatted = '';
  if (dSolar < 0.0001) {
    solarFormatted = `${dSolar.toFixed(6)} D☉`;
  } else if (dSolar < 0.01) {
    solarFormatted = `${dSolar.toFixed(4)} D☉`;
  } else if (dSolar < 1) {
    solarFormatted = `${dSolar.toFixed(3)} D☉`;
  } else if (dSolar < 100) {
    solarFormatted = `${dSolar.toFixed(1)} D☉`;
  } else {
    solarFormatted = `${Math.round(dSolar).toLocaleString()} D☉`;
  }

  // AU formatted
  let auFormatted = '';
  if (au < 0.0001) {
    auFormatted = `< 0.0001 AU`;
  } else if (au < 1) {
    auFormatted = `${au.toFixed(4)} AU`;
  } else {
    auFormatted = `${au.toFixed(2)} AU`;
  }

  return {
    rawKm: km,
    kmFormatted,
    metricSi,
    metricSiFull,
    scientificNotation,
    solarFormatted,
    auFormatted,
    scaleTier,
    scaleTierLabel,
  };
}

function toSuperscript(num: number): string {
  const map: Record<string, string> = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
    '-': '⁻',
  };
  return String(num)
    .split('')
    .map((c) => map[c] || c)
    .join('');
}

/**
 * Computes comparative physical scale between two stars
 */
export function formatScaleComparison(starA: StarData, starB: StarData) {
  const larger = starA.diameterKm >= starB.diameterKm ? starA : starB;
  const smaller = starA.diameterKm >= starB.diameterKm ? starB : starA;

  const linearRatio = larger.diameterKm / Math.max(0.001, smaller.diameterKm);
  const volumeRatio = Math.pow(linearRatio, 3);

  let linearRatioStr = '';
  if (linearRatio >= 1e9) {
    linearRatioStr = `${(linearRatio / 1e9).toFixed(2)} Billion×`;
  } else if (linearRatio >= 1e6) {
    linearRatioStr = `${(linearRatio / 1e6).toFixed(2)} Million×`;
  } else if (linearRatio >= 1e3) {
    linearRatioStr = `${(linearRatio / 1e3).toFixed(1)}k×`;
  } else {
    linearRatioStr = `${linearRatio.toFixed(1)}×`;
  }

  let volumeRatioStr = '';
  if (volumeRatio >= 1e18) {
    volumeRatioStr = `${(volumeRatio / 1e18).toExponential(2)}×`;
  } else if (volumeRatio >= 1e12) {
    volumeRatioStr = `${(volumeRatio / 1e12).toFixed(1)} Trillion×`;
  } else if (volumeRatio >= 1e9) {
    volumeRatioStr = `${(volumeRatio / 1e9).toFixed(1)} Billion×`;
  } else if (volumeRatio >= 1e6) {
    volumeRatioStr = `${(volumeRatio / 1e6).toFixed(1)} Million×`;
  } else {
    volumeRatioStr = `${Math.round(volumeRatio).toLocaleString()}×`;
  }

  return {
    larger,
    smaller,
    linearRatio,
    linearRatioStr,
    volumeRatio,
    volumeRatioStr,
  };
}
