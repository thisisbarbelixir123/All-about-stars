import { StarData } from '../types';
import { ALL_88_CONSTELLATIONS } from '../data/constellationsData';

/**
 * Constellation full name/genitive to 3-letter IAU abbreviation mapping.
 * Sorted by length descending so compound names (e.g. "Canis Majoris") match before single names ("Canis").
 */
export const CONSTELLATIONS_FULL_TO_ABBR: [string, string][] = (() => {
  const pairs: [string, string][] = [
    ['Canum Venaticorum', 'CVn'], ['Canes Venatici', 'CVn'],
    ['Canis Majoris', 'CMa'], ['Canis Major', 'CMa'],
    ['Canis Minoris', 'CMi'], ['Canis Minor', 'CMi'],
    ['Comae Berenices', 'Com'], ['Coma Berenices', 'Com'],
    ['Coronae Australis', 'CrA'], ['Corona Australis', 'CrA'],
    ['Coronae Borealis', 'CrB'], ['Corona Borealis', 'CrB'],
    ['Leonis Minoris', 'LMi'], ['Leo Minoris', 'LMi'], ['Leo Minor', 'LMi'],
    ['Piscis Austrini', 'PsA'], ['Piscis Austrinus', 'PsA'],
    ['Trianguli Australis', 'TrA'], ['Triangulum Australe', 'TrA'],
    ['Ursae Majoris', 'UMa'], ['Ursa Majoris', 'UMa'], ['Ursa Major', 'UMa'],
    ['Ursae Minoris', 'UMi'], ['Ursa Minoris', 'UMi'], ['Ursa Minor', 'UMi'],
    ['Boötis', 'Boo'], ['Bootis', 'Boo'], ['Boötes', 'Boo'], ['Bootes', 'Boo'],
    ['Velorum', 'Vel'], ['Vela', 'Vel'], ['Velae', 'Vel'],
    ['Sagittarii', 'Sgr'], ['Sagittarius', 'Sgr'], ['Sgr', 'Sgr'], ['Sag', 'Sgr'],
    ['Sagittae', 'Sge'], ['Sagitta', 'Sge'], ['Sge', 'Sge'],
  ];

  for (const c of ALL_88_CONSTELLATIONS) {
    pairs.push([c.genitive, c.abbreviation]);
    pairs.push([c.name, c.abbreviation]);
  }

  const seen = new Set<string>();
  const sorted: [string, string][] = [];
  for (const [full, abbr] of pairs) {
    const key = full.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      sorted.push([full, abbr]);
    }
  }
  return sorted.sort((a, b) => b[0].length - a[0].length);
})();

export function abbreviateConstellation(str?: string): string {
  if (!str) return '';
  const trimmed = str.trim();

  // Explicit prefix handling for constellations sharing common prefixes (Sagittarius vs Sagitta)
  if (/^sagittar/i.test(trimmed) || /^sgr\b/i.test(trimmed) || /^sag\b/i.test(trimmed)) {
    return 'Sgr';
  }
  if (/^sagitta/i.test(trimmed) || /^sge\b/i.test(trimmed)) {
    return 'Sge';
  }

  for (const [full, abbr] of CONSTELLATIONS_FULL_TO_ABBR) {
    if (new RegExp(`\\b${full.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(trimmed)) {
      return abbr;
    }
  }

  if (/^sag/i.test(trimmed)) {
    return 'Sgr';
  }

  return trimmed.slice(0, 3);
}

/**
 * Standard IAU 3-letter abbreviation to full Latin genitive map for all 88 modern constellations.
 */
export const ABBR_TO_GENITIVE_MAP = new Map<string, string>(
  ALL_88_CONSTELLATIONS.map((c) => [c.abbreviation, c.genitive])
);

/**
 * Returns the full Latin genitive of the constellation (e.g. "Orionis", "Pavonis", "Velorum", "Ursae Majoris").
 */
export function getConstellationGenitive(constellationOrAbbr?: string): string {
  if (!constellationOrAbbr) return '';
  const abbr = abbreviateConstellation(constellationOrAbbr);
  return ABBR_TO_GENITIVE_MAP.get(abbr) || constellationOrAbbr;
}

export const GREEK_WORDS_MAP: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε',
  zeta: 'ζ', eta: 'η', theta: 'θ', iota: 'ι', kappa: 'κ',
  lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', omicron: 'ο',
  pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ', upsilon: 'υ',
  phi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω'
};

export const GREEK_CHAR_TO_WORD: Record<string, string> = {
  'α': 'Alpha', 'β': 'Beta', 'γ': 'Gamma', 'δ': 'Delta', 'ε': 'Epsilon',
  'ζ': 'Zeta', 'η': 'Eta', 'θ': 'Theta', 'ι': 'Iota', 'κ': 'Kappa',
  'λ': 'Lambda', 'μ': 'Mu', 'ν': 'Nu', 'ξ': 'Xi', 'ο': 'Omicron',
  'π': 'Pi', 'ρ': 'Rho', 'σ': 'Sigma', 'τ': 'Tau', 'υ': 'Upsilon',
  'φ': 'Phi', 'χ': 'Chi', 'ψ': 'Psi', 'ω': 'Omega'
};

const SUPERSCRIPT_TO_DIGIT: Record<string, string> = {
  '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9'
};

const GREEK_CHARS = new Set(Object.values(GREEK_WORDS_MAP));

const SUPERSCRIPTS: Record<string, string> = {
  '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
};

export type DesignationTier = 'greek_bayer' | 'numbered' | 'variable' | 'catalog';

export interface DossierStarNameInfo {
  tier: 'proper' | 'bayer' | 'other';
  primaryName: string;
  bayerDesignation?: string;
  badge?: string;
  displayFullName: string;
  hoverFullName: string;
}

/**
 * Extracts a genuine proper name for a star if one exists,
 * filtering out Greek Bayers, numbered designations, variable codes, and catalog IDs.
 */
export function extractProperName(name?: string): string | null {
  if (!name) return null;
  const trimmed = name.trim();

  // If there are parentheses, e.g. "Shaula (Lambda Scorpii)" or "Sadatoni (Zeta Aurigae)"
  const parenMatch = trimmed.match(/^([^(]+)\s*\(([^)]+)\)$/);
  if (parenMatch) {
    const beforeParen = parenMatch[1].trim();
    if (extractProperName(beforeParen)) {
      return beforeParen;
    }
    return null;
  }

  // Check if starts with spelled-out Greek letter
  const greekMatch = trimmed.match(/^(Alpha|Beta|Gamma|Delta|Epsilon|Zeta|Eta|Theta|Iota|Kappa|Lambda|Mu|Nu|Xi|Omicron|Pi|Rho|Sigma|Tau|Upsilon|Phi|Chi|Psi|Omega)[-\s]/i);
  if (greekMatch) return null;

  // Check if starts with a Greek character directly
  if ([...GREEK_CHARS].some((c) => trimmed.startsWith(c))) return null;

  // Check if starts with number (Flamsteed / Gould / Survey)
  if (/^\d+\s+[A-Za-z]/.test(trimmed)) return null;

  // Check if variable format (e.g. "AH Scorpii", "UY Scuti", "V818 Scorpii", "W Ursae Majoris")
  if (/^([R-Z]|[A-Q][A-Z]|[R-Z]{2}|V\d{2,4})\s+[A-Za-z\s]+$/i.test(trimmed)) return null;

  // Check if survey / catalog prefix
  if (/^(HD|HR|HIP|GJ|Gliese|SCR|2MASS|Gaia|TIC|TYC|LHS|Wolf|Ross|BD|CD)\s+/i.test(trimmed)) return null;

  return trimmed;
}

/**
 * Resolves the display naming hierarchy for constellation dossiers:
 * 1. Proper name first
 * 2. Bayer designation (Greek letter + abbreviated genitive)
 * 3. Other designations (numbered/Flamsteed, variable, catalog with abbreviated genitive)
 */
export function resolveDossierStarName(star: Partial<StarData> | null | undefined): DossierStarNameInfo {
  if (!star) {
    return {
      tier: 'other',
      primaryName: 'Unknown Star',
      displayFullName: 'Unknown Star',
      hoverFullName: 'Unknown Star'
    };
  }

  const cAbbr = abbreviateConstellation(star.constellation);
  const cGenitive = getConstellationGenitive(star.constellation);

  // 1. Try to find Proper Name
  const proper = extractProperName(star.name);

  // 2. Find Bayer designation (Greek letter + abbreviated genitive)
  let bayer: string | null = null;
  let fullBayer: string | null = null;
  const allDesignations: string[] = [
    star.bayerDesignation,
    star.primaryDesignation,
    ...(star.alternateNames || []),
    ...(star.designations || []),
    star.name
  ].filter(Boolean) as string[];

  for (const n of allDesignations) {
    const trimmed = n.trim();
    if ([...GREEK_CHARS].some((c) => trimmed.startsWith(c))) {
      const match = trimmed.match(/^([α-ωΑ-Ω])([¹²³⁴⁵⁶⁷⁸⁹0-9])?\s+([A-Za-z\s]+?)(?:\s+([A-Z][a-z0-9]?))?$/);
      if (match) {
        const symbol = match[1];
        const num = match[2] || '';
        const constName = match[3].trim();
        const comp = match[4] ? ` ${match[4]}` : '';
        const abbr = abbreviateConstellation(constName) || cAbbr;
        const genitive = getConstellationGenitive(constName) || cGenitive;
        bayer = `${symbol}${num} ${abbr}${comp}`.trim();
        const greekWord = GREEK_CHAR_TO_WORD[symbol] || symbol;
        const digitNum = num ? (SUPERSCRIPT_TO_DIGIT[num] || num) : '';
        const numPart = digitNum ? `-${digitNum}` : '';
        fullBayer = `${greekWord}${numPart} ${genitive}${comp}`.trim();
        break;
      }
      bayer = trimmed;
      break;
    }
    const m = trimmed.match(/^(Alpha|Beta|Gamma|Delta|Epsilon|Zeta|Eta|Theta|Iota|Kappa|Lambda|Mu|Nu|Xi|Omicron|Pi|Rho|Sigma|Tau|Upsilon|Phi|Chi|Psi|Omega)(?:[-_\s]+(\d+)|(?=[¹²³⁴⁵⁶⁷⁸⁹])|\b)\s*(.*)$/i);
    if (m) {
      const gChar = GREEK_WORDS_MAP[m[1].toLowerCase()];
      if (gChar) {
        const num = m[2] ? (SUPERSCRIPTS[m[2]] || m[2]) : '';
        const abbr = m[3] ? (abbreviateConstellation(m[3]) || cAbbr) : cAbbr;
        const genitive = m[3] ? (getConstellationGenitive(m[3]) || cGenitive) : cGenitive;
        bayer = `${gChar}${num} ${abbr}`.trim();
        const greekWord = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
        const numPart = m[2] ? `-${m[2]}` : '';
        fullBayer = `${greekWord}${numPart} ${genitive}`.trim();
        break;
      }
    }
  }

  // 3. Find other designations (numbered/Flamsteed, variable, catalog with abbreviated genitive)
  let other: string | null = null;
  let fullOther: string | null = null;
  // Flamsteed
  for (const n of allDesignations) {
    const trimmed = n.trim();
    const fMatch = trimmed.match(/^(\d+)\s+([A-Za-z\s]+?)(?:\s+([A-Z][a-z0-9]?))?$/);
    if (fMatch) {
      const num = fMatch[1];
      const constName = fMatch[2].trim();
      const comp = fMatch[3] ? ` ${fMatch[3]}` : '';
      const abbr = abbreviateConstellation(constName) || cAbbr;
      const genitive = getConstellationGenitive(constName) || cGenitive;
      other = `${num} ${abbr}${comp}`.trim();
      fullOther = `${num} ${genitive}${comp}`.trim();
      break;
    }
  }

  // Variable
  if (!other) {
    for (const n of allDesignations) {
      const trimmed = n.trim();
      const vMatch = trimmed.match(/^([R-Z]|[A-Q][A-Z]|[R-Z]{2}|V\d{2,4})\s+([A-Za-z\s]+?)(?:\s+([A-Z][a-z0-9]?))?$/);
      if (vMatch && !trimmed.startsWith('PSR') && !trimmed.startsWith('SGR')) {
        const varId = vMatch[1];
        const constName = vMatch[2].trim();
        const comp = vMatch[3] ? ` ${vMatch[3]}` : '';
        const abbr = abbreviateConstellation(constName) || cAbbr;
        const genitive = getConstellationGenitive(constName) || cGenitive;
        other = `${varId} ${abbr}${comp}`.trim();
        fullOther = `${varId} ${genitive}${comp}`.trim();
        break;
      }
    }
  }

  // Fallback other: prefer readable catalog/survey name from star.name
  if (!other) {
    const clean = star.name ? star.name.replace(/\s*\([^)]+\)/g, '').trim() : '';
    other = clean || star.primaryDesignation || '';
    fullOther = other;
  }

  // Final Hierarchy:
  // 1. Proper name first
  // 2. then Bayer designation (Greek + abbreviated genitive)
  // 3. other designations (numbered/Flamsteed, variable, etc. with abbreviated genitive)
  if (proper) {
    const hoverFullName = bayer ? `${proper} (${bayer})` : (other && other !== proper ? `${proper} (${other})` : proper);
    return {
      tier: 'proper',
      primaryName: proper,
      bayerDesignation: bayer || undefined,
      badge: bayer || other || undefined,
      displayFullName: bayer ? `${proper} (${bayer})` : proper,
      hoverFullName
    };
  }

  if (bayer) {
    const hoverFullName = fullBayer || (star.name ? star.name.replace(/\s*\([^)]+\)/g, '').trim() : bayer);
    return {
      tier: 'bayer',
      primaryName: bayer,
      bayerDesignation: bayer,
      badge: undefined,
      displayFullName: bayer,
      hoverFullName
    };
  }

  const hoverFullName = fullOther || (star.name ? star.name.replace(/\s*\([^)]+\)/g, '').trim() : other);
  return {
    tier: 'other',
    primaryName: other,
    bayerDesignation: undefined,
    badge: undefined,
    displayFullName: other,
    hoverFullName
  };
}

/**
 * Resolves the canonical star designation tag following the strict hierarchy:
 * 1. Greek Bayer -> 2. Numbered (Flamsteed/Gould) -> 3. Variable designations -> 4. Catalogs (HD, HR, etc.)
 */
export function getStarDesignationTag(star: Partial<StarData> | null | undefined): string {
  if (!star) return '';

  // Constellation abbreviation
  const cAbbr = abbreviateConstellation(star.constellation);

  // The Sun is historically and astrophysically designated as Sol
  if (star.id === 'sun' || star.name?.toLowerCase().includes('sun (sol)') || star.name === 'Sun') {
    return 'Sol';
  }

  // Compact remnants, neutron stars, pulsars keep their identifier
  if (star.spectralClass === 'NS' || star.stellarStage?.includes('Neutron Star') || star.name?.startsWith('PSR')) {
    return star.name;
  }

  const allNames: string[] = [
    star.bayerDesignation,
    star.primaryDesignation,
    star.flamsteedDesignation,
    star.gouldDesignation,
    (star as { variableStarDesignation?: string }).variableStarDesignation,
    ...(star.alternateNames || []),
    ...(star.designations || []),
    star.name
  ].filter(Boolean) as string[];

  // ==========================================
  // TIER 1: GREEK BAYER
  // ==========================================
  // 1A. Explicit Greek symbol in bayerDesignation or names (e.g. "α Ori", "β Ori", "π¹ Gru", "θ² Tau", "υ⁴ Eri")
  for (const n of allNames) {
    const trimmed = n.trim();
    if ([...GREEK_CHARS].some((c) => trimmed.startsWith(c))) {
      // If it has full constellation genitive like "α Orionis", condense to "α Ori"
      const match = trimmed.match(/^([α-ωΑ-Ω][¹²³⁴⁵⁶⁷⁸⁹0-9]?)\s+([A-Za-z\s]+?)(?:\s+([A-Z][a-z0-9]?))?$/);
      if (match) {
        const symbol = match[1];
        const constName = match[2].trim();
        const comp = match[3] ? ` ${match[3]}` : '';
        const abbr = abbreviateConstellation(constName) || cAbbr;
        return `${symbol} ${abbr}${comp}`.trim();
      }
      return trimmed;
    }
  }

  // 1B. Spelled-out Greek Bayer (e.g. "Beta Capricorni", "Saif al Jabbar (Eta Orionis)", "Theta-2 Tauri")
  for (const n of allNames) {
    const trimmed = n.trim();
    const m = trimmed.match(/^(Alpha|Beta|Gamma|Delta|Epsilon|Zeta|Eta|Theta|Iota|Kappa|Lambda|Mu|Nu|Xi|Omicron|Pi|Rho|Sigma|Tau|Upsilon|Phi|Chi|Psi|Omega)(?:[-_\s]+(\d+)|(?=[¹²³⁴⁵⁶⁷⁸⁹])|\b)\s*(.*)$/i);
    if (m) {
      const gChar = GREEK_WORDS_MAP[m[1].toLowerCase()];
      if (gChar) {
        const num = m[2] ? (SUPERSCRIPTS[m[2]] || m[2]) : '';
        const abbr = m[3] ? (abbreviateConstellation(m[3]) || cAbbr) : cAbbr;
        return `${gChar}${num} ${abbr}`.trim();
      }
    }
  }

  // ==========================================
  // TIER 2: NUMBERED (Flamsteed / Gould)
  // ==========================================
  // Gould: e.g. "82 G. Eri", "33 G. Lib"
  const GOULD_REGEX = /^(\d+\s+G\.\s+[A-Za-z]+)\b/i;
  for (const n of allNames) {
    const trimmed = n.trim();
    const gMatch = trimmed.match(GOULD_REGEX);
    if (gMatch) return gMatch[1];
  }

  // Flamsteed: e.g. "61 Cyg", "51 And", "72 Leo", "39 Ari", "19 Psc", "40 Eri"
  const FLAMSTEED_REGEX = /^(\d+)\s+([A-Za-z\s]+?)(?:\s+([A-Z][a-z0-9]?))?$/;
  for (const n of allNames) {
    const trimmed = n.trim();
    const fMatch = trimmed.match(FLAMSTEED_REGEX);
    if (fMatch) {
      const num = fMatch[1];
      const constName = fMatch[2].trim();
      const comp = fMatch[3] ? ` ${fMatch[3]}` : '';
      const abbr = abbreviateConstellation(constName) || cAbbr;
      return `${num} ${abbr}${comp}`.trim();
    }
  }

  // ==========================================
  // TIER 3: VARIABLE DESIGNATIONS
  // ==========================================
  // Argelander / GCVS variable: e.g. "UY Sct", "VY CMa", "V1489 Cyg", "R Cas", "S Dor"
  const VAR_REGEX = /^([R-Z]|[A-Q][A-Z]|[R-Z]{2}|V\d{2,4})\s+([A-Za-z\s]+?)(?:\s+([A-Z][a-z0-9]?))?$/;
  for (const n of allNames) {
    const trimmed = n.trim();
    const vMatch = trimmed.match(VAR_REGEX);
    if (vMatch && !trimmed.startsWith('PSR') && !trimmed.startsWith('SGR')) {
      const varId = vMatch[1];
      const constName = vMatch[2].trim();
      const comp = vMatch[3] ? ` ${vMatch[3]}` : '';
      const abbr = abbreviateConstellation(constName) || cAbbr;
      return `${varId} ${abbr}${comp}`.trim();
    }
  }

  // ==========================================
  // TIER 4: CATALOGS (Lensed/Survey, Cluster, HD, HR, HIP, GJ, etc.)
  // ==========================================
  // 4A. Lensed extragalactic & survey designations (e.g. MACS0416, MACS J1149 LS1, WHL0137-LS, PSZ1 G311.65-18.48)
  const LENSED_SURVEY_PATTERNS = [
    /^MACS\s*(?:J\d{4}(?:\.\d)?(?:[-+]\d{4})?|\d{4})(?:\s+[A-Za-z0-9+]+)?/i,
    /^MACS\d+/i,
    /^WHL\s*\d+[-+]\d+(?:-[A-Za-z0-9]+)?/i,
    /^PSZ\d*\s*G\d+(?:\.\d+)?[-+]\d+(?:\.\d+)?/i,
  ];
  for (const pattern of LENSED_SURVEY_PATTERNS) {
    if (star.primaryDesignation && pattern.test(star.primaryDesignation.trim())) {
      return star.primaryDesignation.trim();
    }
    for (const n of allNames) {
      const trimmed = n.trim();
      if (pattern.test(trimmed)) {
        return trimmed;
      }
    }
  }

  // 4B. Famous cluster / survey / exoplanet host names (e.g. Stephenson 2-18, W26, WOH G64, R136a1, TRAPPIST-1, IRS 7)
  const NOTABLE_SURVEY_NAMES = [
    'Stephenson', 'Westerlund', 'W26', 'W237', 'W75', 'WOH', 'R136', 'TRAPPIST', 'IRS 7', 'GCIRS 7',
    'Melnick', 'Sanduleak', 'VFTS', 'BAT99', 'LH', 'HV', 'AFGL', 'RAFGL'
  ];
  for (const item of NOTABLE_SURVEY_NAMES) {
    for (const n of [star.name, star.primaryDesignation, ...(star.alternateNames || [])]) {
      if (n && n.toLowerCase().includes(item.toLowerCase())) {
        return star.primaryDesignation || star.name;
      }
    }
  }

  // 4C. Standard Catalogs in priority order: HD -> HR -> HIP -> GJ/Gliese -> others
  const CATALOG_PRIORITIES = [
    /^HD\s+\d+/i,
    /^HR\s+\d+/i,
    /^HIP\s+\d+/i,
    /^G(?:J|liese)\s+[\d.]+/i,
    /^LHS\s+\d+/i,
    /^Wolf\s+\d+/i,
    /^Ross\s+\d+/i,
    /^BD[+-]\d+/i,
    /^CD[+-]\d+/i,
    /^TYC\s+\d+/i,
    /^2MASS\s+J\d+/i,
    /^Gaia\s+DR\d+/i
  ];

  for (const pattern of CATALOG_PRIORITIES) {
    for (const n of allNames) {
      const trimmed = n.trim();
      if (pattern.test(trimmed)) {
        return trimmed;
      }
    }
  }

  return star.primaryDesignation || star.name || '';
}

/**
 * Returns which tier of the hierarchy the star's designation tag belongs to.
 */
export function getStarDesignationTier(star: Partial<StarData> | null | undefined): DesignationTier {
  const tag = getStarDesignationTag(star);
  if (tag === 'Sol' || [...GREEK_CHARS].some((c) => tag.includes(c))) return 'greek_bayer';
  if (/^\d+\s+[A-Z]/.test(tag) || /G\./.test(tag)) return 'numbered';
  if (/^([R-Z]|[A-Z]{2}|V\d+)\s+[A-Z]/.test(tag)) return 'variable';
  return 'catalog';
}

/**
 * Normalizes any raw or unabbreviated Bayer designation string to canonical [Greek/Letter] [IAU Abbr] format.
 * Examples:
 * - "Beta Capricorni" -> "β Cap"
 * - "Theta-2 Tauri" -> "θ² Tau"
 * - "Chi Ursae Majoris" -> "χ UMa"
 * - "Omicron-1 Canis Majoris" -> "ο¹ CMa"
 * - "δ Cephei" -> "δ Cep"
 * - "RR Lyrae" -> "RR Lyr"
 * - "R Coronae Borealis" -> "R CrB"
 */
export function normalizeBayerDesignation(bayer?: string, fallbackConstellation?: string): string {
  if (!bayer) return '';
  let str = bayer.trim();
  if (!str || str === 'Sol') return str;

  // 1. Replace any unabbreviated constellation name/genitive with its canonical 3-letter abbreviation
  for (const [full, abbr] of CONSTELLATIONS_FULL_TO_ABBR) {
    const regex = new RegExp(`\\b${full.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(str)) {
      str = str.replace(regex, abbr).trim();
      break;
    }
  }

  // 2. If it starts with a spelled-out Greek letter name (e.g. "Alpha", "Beta", "Theta-2", "Pi 1", "Omicron-1"):
  const greekMatch = str.match(/^(Alpha|Beta|Gamma|Delta|Epsilon|Zeta|Eta|Theta|Iota|Kappa|Lambda|Mu|Nu|Xi|Omicron|Pi|Rho|Sigma|Tau|Upsilon|Phi|Chi|Psi|Omega)(?:[-_\s]+(\d+)|(?=[¹²³⁴⁵⁶⁷⁸⁹])|\b)\s+(.*)$/i);
  if (greekMatch) {
    const gChar = GREEK_WORDS_MAP[greekMatch[1].toLowerCase()] || greekMatch[1];
    const sup = greekMatch[2] ? (SUPERSCRIPTS[greekMatch[2]] || greekMatch[2]) : '';
    const rest = greekMatch[3].trim();
    str = `${gChar}${sup} ${rest}`.trim();
  }

  // 3. If it starts with a Greek character followed by an ASCII digit without superscript (e.g. "θ2 Tau" -> "θ² Tau", "υ1 Eri" -> "υ¹ Eri"):
  const asciiSubMatch = str.match(/^([α-ωΑ-Ω])(\d+)\s+(.*)$/);
  if (asciiSubMatch) {
    const gChar = asciiSubMatch[1];
    const sup = SUPERSCRIPTS[asciiSubMatch[2]] || asciiSubMatch[2];
    const rest = asciiSubMatch[3].trim();
    str = `${gChar}${sup} ${rest}`.trim();
  }

  return str;
}

/**
 * Universal catalog record normalizer that guarantees canonical IAU naming standards across any star record:
 * 1. Enforces standard IAU constellation names (e.g. Bootes -> Boötis).
 * 2. Normalizes Bayer designations to [Greek/Letter] [IAU Abbr].
 * 3. Enforces standard diacritics in displayed names (e.g. Bootis -> Boötis).
 * 4. Sanitizes alternateNames and designations arrays.
 */
export function normalizeCatalogStar<T extends Partial<StarData>>(star: T): T {
  if (!star) return star;

  let constellation = star.constellation;
  if (constellation) {
    if (constellation === 'Bootes') constellation = 'Boötes';
    if (star.id === 'fomalhaut-c') constellation = 'Piscis Austrinus';
  }

  let name = star.name;
  if (name) {
    if (name.includes('Bootis')) name = name.replace(/\bBootis\b/g, 'Boötis');
    if (name.includes('Velae')) name = name.replace(/\bVelae\b/g, 'Velorum');
  }

  let bayerDesignation = star.bayerDesignation;
  if (bayerDesignation) {
    bayerDesignation = normalizeBayerDesignation(bayerDesignation, constellation);
  }

  let primaryDesignation = star.primaryDesignation;
  if (primaryDesignation) {
    if (primaryDesignation.includes('Sag')) {
      primaryDesignation = primaryDesignation.replace(/\bSag\b/g, constellation === 'Sagitta' ? 'Sge' : 'Sgr');
    }
    if (primaryDesignation === 'π sto' && star.id === 'pistol-star') {
      primaryDesignation = 'V4647 Sgr';
    }
    if (primaryDesignation === 'π nwh' && star.id === 'wr-104') {
      primaryDesignation = 'WR 104';
    }
  }

  let alternateNames = star.alternateNames;
  if (alternateNames && alternateNames.length > 0) {
    let changed = false;
    const nextAlts = alternateNames
      .filter((alt) => alt !== 'π sto' && alt !== 'π nwh')
      .map((alt) => {
        let updated = alt;
        if (updated.includes('Bootis')) {
          updated = updated.replace(/\bBootis\b/g, 'Boötis');
          changed = true;
        }
        if (updated.includes('Velae')) {
          updated = updated.replace(/\bVelae\b/g, 'Velorum');
          changed = true;
        }
        if (updated.includes('Sag') && !updated.includes('Sagittarius') && !updated.includes('Sagitta')) {
          updated = updated.replace(/\bSag\b/g, constellation === 'Sagitta' ? 'Sge' : 'Sgr');
          changed = true;
        }
        return updated;
      });
    if (changed || nextAlts.length !== alternateNames.length) alternateNames = nextAlts;
  }

  let designations = star.designations;
  if (designations && designations.length > 0) {
    let changed = false;
    const nextDesigs = designations
      .filter((desig) => desig !== 'π sto' && desig !== 'π nwh')
      .map((desig) => {
        let updated = desig;
        if (updated.includes('Bootis')) {
          updated = updated.replace(/\bBootis\b/g, 'Boötis');
          changed = true;
        }
        if (updated.includes('Velae')) {
          updated = updated.replace(/\bVelae\b/g, 'Velorum');
          changed = true;
        }
        if (updated.includes('Sag') && !updated.includes('Sagittarius') && !updated.includes('Sagitta')) {
          updated = updated.replace(/\bSag\b/g, constellation === 'Sagitta' ? 'Sge' : 'Sgr');
          changed = true;
        }
        return updated;
      });
    if (changed || nextDesigs.length !== designations.length) designations = nextDesigs;
  }

  if (
    constellation === star.constellation &&
    name === star.name &&
    bayerDesignation === star.bayerDesignation &&
    primaryDesignation === star.primaryDesignation &&
    alternateNames === star.alternateNames &&
    designations === star.designations
  ) {
    return star;
  }

  return {
    ...star,
    constellation,
    name,
    bayerDesignation,
    primaryDesignation,
    alternateNames,
    designations
  };
}
