// Astronomical Sky Map Atlas Data & Celestial Cartography Helpers

export interface DeepSkyObject {
  id: string;
  catalogId: string;
  name: string;
  type: 'emission_nebula' | 'galaxy' | 'open_cluster' | 'globular_cluster' | 'planetary_nebula' | 'supernova_remnant' | 'dark_nebula';
  x: number;
  y: number;
  description: string;
}

export const GREEK_BAYER_MAP: Record<string, string> = {
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  delta: 'δ',
  epsilon: 'ε',
  zeta: 'ζ',
  eta: 'η',
  theta: 'θ',
  iota: 'ι',
  kappa: 'κ',
  lambda: 'λ',
  mu: 'μ',
  nu: 'ν',
  xi: 'ξ',
  omicron: 'ο',
  pi: 'π',
  rho: 'ρ',
  sigma: 'σ',
  tau: 'τ',
  upsilon: 'υ',
  phi: 'φ',
  chi: 'χ',
  psi: 'ψ',
  omega: 'ω'
};

export function parseStarLabel(fullName: string): { properName: string; bayer: string; displayLabel: string } {
  if (!fullName) return { properName: '', bayer: '', displayLabel: '' };
  
  // Example: "Betelgeuse (Alpha Ori - Red Supergiant Shoulder)"
  // Example: "Dubhe (Alpha UMa - Bowl Pointer)"
  // Example: "Ain (Epsilon Tau - Northern Eye)"
  // Example: "Gamma Tau (Bull Snout)"
  
  const parenMatch = fullName.match(/^(.*?)\s*\((.*?)\)$/);
  if (!parenMatch) {
    return { properName: fullName, bayer: '', displayLabel: fullName };
  }

  const rawName = parenMatch[1].trim();
  const insideParen = parenMatch[2].trim();
  const parts = insideParen.split('-')[0].trim().split(' ');
  
  let bayerCode = '';
  if (parts.length >= 1) {
    const greekWord = parts[0].toLowerCase();
    const greekLetter = GREEK_BAYER_MAP[greekWord];
    if (greekLetter) {
      const genitive = parts[1] || '';
      bayerCode = `${greekLetter}${genitive ? ' ' + genitive : ''}`;
    }
  }

  // If rawName is itself a Bayer designation like "Gamma Tau" or "Chi1 Ori"
  const isRawBayer = /^(Alpha|Beta|Gamma|Delta|Epsilon|Zeta|Eta|Theta|Iota|Kappa|Lambda|Mu|Nu|Xi|Omicron|Pi|Rho|Sigma|Tau|Upsilon|Phi|Chi|Psi|Omega)/i.test(rawName);
  
  if (isRawBayer) {
    const match = rawName.match(/^([A-Za-z]+)(\d*)\s*(.*)$/);
    if (match) {
      const g = GREEK_BAYER_MAP[match[1].toLowerCase()];
      if (g) {
        const num = match[2] ? `^${match[2]}` : '';
        const rest = match[3] ? ` ${match[3]}` : '';
        return { properName: '', bayer: `${g}${num}${rest}`, displayLabel: `${g}${num}${rest}` };
      }
    }
    return { properName: '', bayer: rawName, displayLabel: rawName };
  }

  const displayLabel = bayerCode ? `${bayerCode.split(' ')[0]} ${rawName}` : rawName;
  return { properName: rawName, bayer: bayerCode, displayLabel };
}

// Iconic deep sky objects placed relative to constellation stars (SVG space 0-100)
export const FAMOUS_DEEP_SKY_OBJECTS: Record<string, DeepSkyObject[]> = {
  orion: [
    {
      id: 'm42',
      catalogId: 'M42 / NGC 1976',
      name: 'Great Orion Nebula',
      type: 'emission_nebula',
      x: 49,
      y: 60,
      description: 'The closest massive stellar nursery to Earth (1,344 ly), visible to the naked eye in Orion’s Sword.'
    },
    {
      id: 'm78',
      catalogId: 'M78 / NGC 2068',
      name: 'Casper Reflection Nebula',
      type: 'emission_nebula',
      x: 62,
      y: 44,
      description: 'The brightest diffuse reflection nebula in the Orion Molecular Cloud Complex.'
    }
  ],
  andromeda: [
    {
      id: 'm31',
      catalogId: 'M31 / NGC 224',
      name: 'Andromeda Galaxy',
      type: 'galaxy',
      x: 52,
      y: 22,
      description: 'Majestic spiral galaxy (2.5 million ly), the largest member of our Local Group.'
    },
    {
      id: 'm32',
      catalogId: 'M32 / NGC 221',
      name: 'Andromeda Satellite Galaxy',
      type: 'galaxy',
      x: 55,
      y: 25,
      description: 'Compact dwarf elliptical satellite orbiting M31.'
    }
  ],
  taurus: [
    {
      id: 'm45',
      catalogId: 'M45 / Pleiades',
      name: 'Seven Sisters Open Cluster',
      type: 'open_cluster',
      x: 18,
      y: 32,
      description: 'Iconic open cluster dominated by luminous hot blue B-type stars illuminated by reflection dust.'
    },
    {
      id: 'm1',
      catalogId: 'M1 / NGC 1952',
      name: 'Crab Nebula (Supernova 1054)',
      type: 'supernova_remnant',
      x: 74,
      y: 44,
      description: 'Remnant of the historical supernova observed by Chinese astronomers in 1054 AD.'
    }
  ],
  hercules: [
    {
      id: 'm13',
      catalogId: 'M13 / NGC 6205',
      name: 'Great Globular Cluster in Hercules',
      type: 'globular_cluster',
      x: 32,
      y: 46,
      description: 'Magnificent globular cluster containing over 300,000 ancient stars along the Keystone.'
    }
  ],
  lyra: [
    {
      id: 'm57',
      catalogId: 'M57 / NGC 6720',
      name: 'The Ring Nebula',
      type: 'planetary_nebula',
      x: 48,
      y: 76,
      description: 'Famous smoke-ring planetary nebula expelled by an ionizing white dwarf.'
    }
  ],
  cygnus: [
    {
      id: 'ngc7000',
      catalogId: 'NGC 7000',
      name: 'North America Nebula',
      type: 'emission_nebula',
      x: 74,
      y: 28,
      description: 'Enormous emission nebula near Deneb shaped remarkably like North America.'
    },
    {
      id: 'veil',
      catalogId: 'NGC 6960 / 6992',
      name: 'Veil Nebula Complex',
      type: 'supernova_remnant',
      x: 78,
      y: 64,
      description: 'Delicate filamentary supernova remnant expanding from an explosion 10,000 years ago.'
    }
  ],
  scorpius: [
    {
      id: 'm7',
      catalogId: 'M7 / NGC 6475',
      name: "Ptolemy's Cluster",
      type: 'open_cluster',
      x: 62,
      y: 84,
      description: 'Brilliant naked-eye open cluster charted by Ptolemy in 130 AD near the Stinger.'
    },
    {
      id: 'm6',
      catalogId: 'M6 / NGC 6405',
      name: 'Butterfly Cluster',
      type: 'open_cluster',
      x: 56,
      y: 78,
      description: 'Open cluster whose arrangement of stars mimics the wings of a butterfly.'
    }
  ],
  sagittarius: [
    {
      id: 'm8',
      catalogId: 'M8 / NGC 6523',
      name: 'Lagoon Nebula',
      type: 'emission_nebula',
      x: 32,
      y: 42,
      description: 'Giant interstellar cloud in the Sagittarius Arm; visible as a naked-eye glowing cloud.'
    },
    {
      id: 'm20',
      catalogId: 'M20 / NGC 6514',
      name: 'Trifid Nebula',
      type: 'emission_nebula',
      x: 34,
      y: 36,
      description: 'Combination of emission, reflection, and dark nebula divided into three lobes.'
    }
  ],
  crux: [
    {
      id: 'ngc4755',
      catalogId: 'NGC 4755',
      name: 'Jewel Box Cluster (Kappa Crucis)',
      type: 'open_cluster',
      x: 68,
      y: 48,
      description: 'One of the youngest and most colorful open clusters, resembling a set of sparkling gems.'
    },
    {
      id: 'coalsack',
      catalogId: 'Caldwell 99',
      name: 'Coalsack Dark Nebula',
      type: 'dark_nebula',
      x: 72,
      y: 72,
      description: 'Most prominent dark absorption nebula in the southern sky, silhouetted against the Milky Way.'
    }
  ],
  "ursa-major": [
    {
      id: 'm81',
      catalogId: 'M81 / NGC 3031',
      name: "Bode's Galaxy",
      type: 'galaxy',
      x: 38,
      y: 18,
      description: 'Grand-design spiral galaxy (12 million ly) with active galactic nucleus.'
    },
    {
      id: 'm82',
      catalogId: 'M82 / NGC 3034',
      name: 'Cigar Galaxy (Starburst)',
      type: 'galaxy',
      x: 42,
      y: 16,
      description: 'Prototype starburst galaxy experiencing intense star formation driven by tidal interaction.'
    },
    {
      id: 'm97',
      catalogId: 'M97 / NGC 3587',
      name: 'Owl Nebula',
      type: 'planetary_nebula',
      x: 32,
      y: 58,
      description: 'Complex planetary nebula with two large dark owl-eye voids.'
    }
  ],
  cancer: [
    {
      id: 'm44',
      catalogId: 'M44 / NGC 2632',
      name: 'Beehive Cluster (Praesepe)',
      type: 'open_cluster',
      x: 50,
      y: 50,
      description: 'Bright naked-eye open cluster situated at the heart of the celestial crab.'
    }
  ],
  cassiopeia: [
    {
      id: 'm103',
      catalogId: 'M103 / NGC 581',
      name: 'Messier 103 Open Cluster',
      type: 'open_cluster',
      x: 64,
      y: 42,
      description: 'Rich open cluster located about 10,000 light-years away in the Perseus Arm.'
    },
    {
      id: 'ngc457',
      catalogId: 'NGC 457 / Caldwell 13',
      name: 'Owl Cluster / ET Cluster',
      type: 'open_cluster',
      x: 28,
      y: 44,
      description: 'Open cluster featuring two brilliant eyes and outstretched celestial wings.'
    }
  ],
  pegasus: [
    {
      id: 'm15',
      catalogId: 'M15 / NGC 7078',
      name: 'Great Pegasus Globular Cluster',
      type: 'globular_cluster',
      x: 22,
      y: 68,
      description: 'Dense core-collapsed globular cluster hosting a planetary nebula (Pease 1).'
    }
  ],
  "canes-venatici": [
    {
      id: 'm51',
      catalogId: 'M51 / NGC 5194',
      name: 'Whirlpool Galaxy',
      type: 'galaxy',
      x: 68,
      y: 26,
      description: 'Iconic interacting grand-design spiral galaxy with companion NGC 5195.'
    }
  ]
};

// Celestial coordinate graticule generator
export interface GraticuleConfig {
  hasEquator: boolean;
  equatorY: number;
  hasEcliptic: boolean;
  eclipticY1: number;
  eclipticY2: number;
  raLabels: Array<{ x: number; label: string }>;
  decLabels: Array<{ y: number; label: string }>;
}

export function computeCelestialGraticule(
  raRangeStr: string = '',
  decRangeStr: string = '',
  isZodiac: boolean = false,
  constellationId: string = ''
): GraticuleConfig {
  // Parse Dec range (e.g. "-10° 59′ – +22° 52′")
  let decMin = -30;
  let decMax = +30;
  let hasEquator = false;
  let equatorY = 50;

  try {
    const decParts = decRangeStr.split('–').map(s => s.trim());
    if (decParts.length >= 2) {
      const parseDecNum = (s: string) => {
        const isNeg = s.includes('-') || s.includes('−');
        const num = parseFloat(s.replace(/[^0-9.]/g, ''));
        return isNeg ? -num : num;
      };
      const d1 = parseDecNum(decParts[0]);
      const d2 = parseDecNum(decParts[1]);
      decMin = Math.min(d1, d2);
      decMax = Math.max(d1, d2);
      
      if (decMin <= 2 && decMax >= -2) {
        hasEquator = true;
        // North is top (y=10), South is bottom (y=90)
        const span = Math.max(10, decMax - decMin);
        const fraction = decMax / span; // distance from top
        equatorY = Math.max(16, Math.min(84, 10 + fraction * 80));
      }
    }
  } catch (e) {
    // fallback
  }

  // Equator override for Orion (Mintaka is at Dec -0° 17', belt is at y ~ 53)
  if (constellationId === 'orion') {
    hasEquator = true;
    equatorY = 53;
  } else if (constellationId === 'aquila') {
    hasEquator = true;
    equatorY = 54;
  } else if (constellationId === 'virgo') {
    hasEquator = true;
    equatorY = 48;
  } else if (constellationId === 'cetus') {
    hasEquator = true;
    equatorY = 50;
  } else if (constellationId === 'pisces') {
    hasEquator = true;
    equatorY = 52;
  } else if (constellationId === 'ophiuchus') {
    hasEquator = true;
    equatorY = 56;
  } else if (constellationId === 'serpens') {
    hasEquator = true;
    equatorY = 52;
  }

  // Ecliptic path
  const zodiacOrEcliptic = isZodiac || ['ophiuchus', 'cetus', 'sextans', 'orion'].includes(constellationId);
  const hasEcliptic = zodiacOrEcliptic;
  let eclipticY1 = 40;
  let eclipticY2 = 60;

  if (['taurus', 'gemini', 'cancer', 'leo', 'aries'].includes(constellationId)) {
    eclipticY1 = 65;
    eclipticY2 = 35;
  } else if (['virgo', 'libra', 'scorpius', 'sagittarius', 'capricornus', 'aquarius', 'pisces', 'ophiuchus'].includes(constellationId)) {
    eclipticY1 = 35;
    eclipticY2 = 65;
  }

  // Parse RA ticks
  const raLabels: Array<{ x: number; label: string }> = [];
  try {
    const raClean = raRangeStr.split('|')[0].trim(); // for serpens
    const raParts = raClean.split('–').map(s => s.trim());
    if (raParts.length >= 2) {
      raLabels.push({ x: 18, label: raParts[0].split(' ')[0] });
      raLabels.push({ x: 50, label: 'Mid RA' });
      raLabels.push({ x: 82, label: raParts[1].split(' ')[0] });
    } else {
      raLabels.push({ x: 20, label: '04h' }, { x: 50, label: '05h' }, { x: 80, label: '06h' });
    }
  } catch {
    raLabels.push({ x: 20, label: 'RA W' }, { x: 50, label: 'RA Mid' }, { x: 80, label: 'RA E' });
  }

  // Dec ticks
  const decLabels: Array<{ y: number; label: string }> = [];
  if (hasEquator) {
    decLabels.push({ y: Math.max(16, equatorY - 28), label: `+${Math.round(decMax)}°` });
    decLabels.push({ y: equatorY, label: '0° Equator' });
    decLabels.push({ y: Math.min(84, equatorY + 28), label: `${Math.round(decMin)}°` });
  } else {
    decLabels.push({ y: 20, label: `+${Math.round(decMax)}°` });
    decLabels.push({ y: 50, label: `${Math.round((decMax + decMin) / 2)}°` });
    decLabels.push({ y: 80, label: `${Math.round(decMin)}°` });
  }

  return {
    hasEquator,
    equatorY,
    hasEcliptic,
    eclipticY1,
    eclipticY2,
    raLabels,
    decLabels
  };
}
