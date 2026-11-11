import { CelestialBody } from '../types';
import { deriveSudarskyClass, SUDARSKY_CLASS_INFO } from './exoplanetArchetypes';

export type CelestialSortKey = 'size' | 'mass' | 'temperature' | 'discoveryYear';
export type SortDirection = 'asc' | 'desc';

export interface TourMetricDisplay {
  label: string;
  primary: string;
  secondary: string;
  unit: string;
}

export function inferBodyColor(body: CelestialBody): string {
  if (body.classification === 'Star') return '#fde047';
  const name = body.name.toLowerCase();
  if (name === 'earth') return '#38bdf8';
  if (name === 'mars') return '#f87171';
  if (name === 'venus') return '#fef08a';
  if (name === 'mercury' || name === 'the moon') return '#cbd5e1';
  if (name === 'jupiter') return '#fdba74';
  if (name === 'saturn') return '#fef08a';
  if (name === 'uranus') return '#67e8f9';
  if (name === 'neptune') return '#60a5fa';
  if (name === 'io') return '#facc15';
  if (name === 'europa' || name === 'enceladus') return '#e0f2fe';
  if (name === 'callisto' || name === 'ganymede') return '#d6d3d1';
  if (name === 'titan') return '#f59e0b';
  if (name === 'pluto' || name === 'charon') return '#d6d3d1';
  // Dwarf planets & major TNOs with specific observed spectroscopic colors:
  if (name === 'makemake') return '#ea580c'; // Distinct deep reddish-orange tholin color
  if (name === 'sedna' || name === 'gonggong') return '#dc2626'; // Deep crimson-red tholin surface
  if (name === 'quaoar' || name === 'varuna' || name === 'ixion' || name === 'chaos') return '#c2410c'; // Moderate red-brown tholin
  if (name === 'haumea' || name === 'eris' || name === 'orcus') return '#f1f5f9'; // Bright pristine crystalline water/nitrogen ice
  if (name === 'ceres') return '#94a3b8'; // Neutral dark grey clay/carbonate asteroid belt regolith

  switch (body.classification) {
    case 'Jovian':
    case 'Gas Giants': {
      const sudarsky = deriveSudarskyClass(body);
      if (body.textureTheme === 'gas-giant-cloudless' && sudarsky === 'Class IV') {
        return '#38bdf8';
      }
      if (sudarsky === 'Class IV' && (body.albedo ?? 0.08) <= 0.058) {
        return '#a78bfa';
      }
      if (sudarsky === 'Class V') {
        return (body.albedo ?? 0.35) >= 0.26 ? '#fbbf24' : '#fb7185';
      }
      return sudarsky ? SUDARSKY_CLASS_INFO[sudarsky].colorHex : '#fb923c';
    }
    case 'Neptunian':
    case 'Ice Giants': {
      const tK = body.temperatureK ?? 200;
      const alb = body.albedo ?? 0.30;
      if (body.textureTheme === 'mirror-world' || (tK >= 480 && alb >= 0.34)) return '#cbd5e1';
      if (tK >= 1450) return '#fb923c';
      if (tK >= 480) return '#818cf8';
      return '#38bdf8';
    }
    case 'Superterran':
      if (body.textureTheme === 'lava-world') return '#f97316';
      if (body.textureTheme === 'hycean-ocean' || body.textureTheme === 'terrestrial-ocean') return '#22d3ee';
      return '#2dd4bf';
    case 'Terran':
    case 'Terrestrial Planet':
      return '#34d399';
    case 'Martian':
      return '#f87171';
    case 'Sub-Martian':
      return '#94a3b8';
    case 'Dwarf planet':
    case 'Plutino':
    case 'Trans-Neptunian Object':
      return '#a78bfa';
    case 'Asteroid':
      return '#94a3b8';
    case 'Exoplanet':
      if (body.diameterJupiter >= 0.8) return '#fb923c';
      if (body.diameterEarth >= 1.8) return '#22d3ee';
      return '#4ade80';
    default:
      if (body.classification.startsWith('Moon of')) return '#93c5fd';
      return '#38bdf8';
  }
}

export function formatCompactBodyMass(body: CelestialBody): string {
  const mEarth = body.massEarth ?? 0;
  if (mEarth <= 0) return 'Unknown Mass';
  const mJup = body.massJupiter ?? mEarth / 317.828;
  const approx = body.massType === 'estimated' ? '~' : '';
  if (mJup >= 0.1) return `${approx}${mJup.toFixed(2)} M♃`;
  if (mEarth >= 0.1) return `${approx}${mEarth.toFixed(2)} M⊕`;
  if (mEarth >= 0.001) return `${approx}${mEarth.toFixed(3)} M⊕`;
  return `${approx}${mEarth.toExponential(2)} M⊕`;
}

export function getTourMetricDisplay(body: CelestialBody, sortKey: CelestialSortKey): TourMetricDisplay {
  switch (sortKey) {
    case 'mass': {
      const mEarth = body.massEarth ?? 0;
      const mJup = body.massJupiter ?? (mEarth > 0 ? mEarth / 317.828 : 0);
      const isGiant = mJup >= 0.1;
      const primary = formatCompactBodyMass(body);
      const earthFormatted =
        mEarth < 0.01
          ? mEarth.toPrecision(3)
          : mEarth.toLocaleString(undefined, { maximumFractionDigits: 2 });
      const estTag = body.massType === 'estimated' ? ' • M-R estimate' : '';
      const secondary = mEarth > 0
        ? `${earthFormatted} Earth masses (${(mEarth * 5.972e24).toExponential(2)} kg)${estTag}`
        : 'Mass unmeasured';
      return {
        label: 'PLANETARY MASS',
        primary,
        secondary,
        unit: isGiant ? 'Jupiter Masses (M♃)' : 'Earth Masses (M⊕)',
      };
    }
    case 'temperature': {
      const t = body.temperatureK ?? 0;
      const c = t > 0 ? Math.round(t - 273.15) : 0;
      const f = t > 0 ? Math.round((t - 273.15) * 1.8 + 32) : 0;
      const primary = t > 0 ? `${t.toLocaleString()} K` : 'Estimated Temp';
      const secondary = t > 0 ? `${c.toLocaleString()} °C • ${f.toLocaleString()} °F` : 'Equilibrium temp pending';
      return {
        label: 'EQUILIBRIUM TEMPERATURE',
        primary,
        secondary,
        unit: 'Kelvin (K)',
      };
    }
    case 'discoveryYear': {
      const yr = body.discoveryYear ?? 0;
      return {
        label: 'DISCOVERY YEAR',
        primary: yr > 0 ? `${yr}` : 'Antiquity / Prehistoric',
        secondary: body.discoveryMethod ? `Method: ${body.discoveryMethod}` : `Host System: ${body.hostSystem}`,
        unit: 'Year',
      };
    }
    case 'size':
    default: {
      const dKm = body.diameterKm;
      const miles = Math.round(dKm * 0.621371).toLocaleString();
      const kmFormatted = `${Math.round(dKm).toLocaleString()} km`;

      let primary = '';
      if (body.classification === 'Star') {
        primary = `${(dKm / 1392700).toFixed(2)} D☉`;
      } else if (body.diameterJupiter >= 0.5) {
        primary = `${body.diameterJupiter.toFixed(2)} D♃`;
      } else if (body.diameterEarth >= 0.1) {
        primary = `${body.diameterEarth.toFixed(2)} D⊕`;
      } else {
        primary = `${kmFormatted}`;
      }

      const secondary = `${kmFormatted} (${miles} mi • ${body.diameterEarth.toFixed(body.diameterEarth < 0.1 ? 3 : 2)} D⊕ • ${body.diameterJupiter.toFixed(body.diameterJupiter < 0.05 ? 4 : 2)} D♃)`;

      return {
        label: 'PHYSICAL DIAMETER',
        primary,
        secondary,
        unit: 'Kilometers / Earth Diameters (D⊕)',
      };
    }
  }
}
