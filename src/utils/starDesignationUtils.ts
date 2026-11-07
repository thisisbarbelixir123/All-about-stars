import { StarData } from '../types';

/**
 * Constellation full/genitive to 3-letter IAU abbreviation mapping.
 * Sorted by length descending so compound names like "Canis Majoris" match before "Canis".
 */
export const CONSTELLATIONS_FULL_TO_ABBR: [string, string][] = [
  ['Canis Majoris', 'CMa'], ['Canis Major', 'CMa'],
  ['Canis Minoris', 'CMi'], ['Canis Minor', 'CMi'],
  ['Coma Berenices', 'Com'],
  ['Corona Australis', 'CrA'], ['Coronae Australis', 'CrA'],
  ['Corona Borealis', 'CrB'], ['Coronae Borealis', 'CrB'],
  ['Canum Venaticorum', 'CVn'],
  ['Leo Minoris', 'LMi'], ['Leo Minor', 'LMi'],
  ['Piscis Austrini', 'PsA'], ['Piscis Austrinus', 'PsA'],
  ['Triangulum Australe', 'TrA'], ['Trianguli Australis', 'TrA'],
  ['Ursa Majoris', 'UMa'], ['Ursa Major', 'UMa'],
  ['Ursa Minoris', 'UMi'], ['Ursa Minor', 'UMi'],
  ['Andromedae', 'And'], ['Andromeda', 'And'],
  ['Antliae', 'Ant'], ['Antlia', 'Ant'],
  ['Apodis', 'Aps'], ['Apus', 'Aps'],
  ['Aquilae', 'Aql'], ['Aquila', 'Aql'],
  ['Aquarii', 'Aqr'], ['Aquarius', 'Aqr'],
  ['Arae', 'Ara'], ['Ara', 'Ara'],
  ['Arietis', 'Ari'], ['Aries', 'Ari'],
  ['Aurigae', 'Aur'], ['Auriga', 'Aur'],
  ['Bootis', 'Boo'], ['Boötes', 'Boo'], ['Bootes', 'Boo'],
  ['Caeli', 'Cae'], ['Caelum', 'Cae'],
  ['Camelopardalis', 'Cam'],
  ['Capricorni', 'Cap'], ['Capricornus', 'Cap'],
  ['Carinae', 'Car'], ['Carina', 'Car'],
  ['Cassiopeiae', 'Cas'], ['Cassiopeia', 'Cas'],
  ['Centauri', 'Cen'], ['Centaurus', 'Cen'],
  ['Cephei', 'Cep'], ['Cepheus', 'Cep'],
  ['Ceti', 'Cet'], ['Cetus', 'Cet'],
  ['Chamaeleontis', 'Cha'], ['Chamaeleon', 'Cha'],
  ['Circini', 'Cir'], ['Circinus', 'Cir'],
  ['Cancri', 'Cnc'], ['Cancer', 'Cnc'],
  ['Columbae', 'Col'], ['Columba', 'Col'],
  ['Crateris', 'Crt'], ['Crater', 'Crt'],
  ['Crucis', 'Cru'], ['Crux', 'Cru'],
  ['Corvi', 'Crv'], ['Corvus', 'Crv'],
  ['Cygni', 'Cyg'], ['Cygnus', 'Cyg'],
  ['Delphini', 'Del'], ['Delphinus', 'Del'],
  ['Doradus', 'Dor'], ['Dorado', 'Dor'],
  ['Draconis', 'Dra'], ['Draco', 'Dra'],
  ['Equulei', 'Equ'], ['Equuleus', 'Equ'],
  ['Eridani', 'Eri'], ['Eridanus', 'Eri'],
  ['Fornacis', 'For'], ['Fornax', 'For'],
  ['Geminorum', 'Gem'], ['Gemini', 'Gem'],
  ['Gruis', 'Gru'], ['Grus', 'Gru'],
  ['Herculis', 'Her'], ['Hercules', 'Her'],
  ['Horologii', 'Hor'], ['Horologium', 'Hor'],
  ['Hydrae', 'Hya'], ['Hydra', 'Hya'],
  ['Hydri', 'Hyi'], ['Hydrus', 'Hyi'],
  ['Indi', 'Ind'], ['Indus', 'Ind'],
  ['Lacertae', 'Lac'], ['Lacerta', 'Lac'],
  ['Leonis', 'Leo'], ['Leo', 'Leo'],
  ['Leporis', 'Lep'], ['Lepus', 'Lep'],
  ['Librae', 'Lib'], ['Libra', 'Lib'],
  ['Lupi', 'Lup'], ['Lupus', 'Lup'],
  ['Lyncis', 'Lyn'], ['Lynx', 'Lyn'],
  ['Lyrae', 'Lyr'], ['Lyra', 'Lyr'],
  ['Mensae', 'Men'], ['Mensa', 'Men'],
  ['Microscopii', 'Mic'], ['Microscopium', 'Mic'],
  ['Monocerotis', 'Mon'], ['Monoceros', 'Mon'],
  ['Muscae', 'Mus'], ['Musca', 'Mus'],
  ['Normae', 'Nor'], ['Norma', 'Nor'],
  ['Octantis', 'Oct'], ['Octans', 'Oct'],
  ['Ophiuchi', 'Oph'], ['Ophiuchus', 'Oph'],
  ['Orionis', 'Ori'], ['Orion', 'Ori'],
  ['Pavonis', 'Pav'], ['Pavo', 'Pav'],
  ['Pegasi', 'Peg'], ['Pegasus', 'Peg'],
  ['Persei', 'Per'], ['Perseus', 'Per'],
  ['Phoenicis', 'Phe'], ['Phoenix', 'Phe'],
  ['Pictoris', 'Pic'], ['Pictor', 'Pic'],
  ['Piscium', 'Psc'], ['Pisces', 'Psc'],
  ['Puppis', 'Pup'],
  ['Pyxidis', 'Pyx'], ['Pyxis', 'Pyx'],
  ['Reticuli', 'Ret'], ['Reticulum', 'Ret'],
  ['Sculptoris', 'Scl'], ['Sculptor', 'Scl'],
  ['Scorpii', 'Sco'], ['Scorpius', 'Sco'],
  ['Scuti', 'Sct'], ['Scutum', 'Sct'],
  ['Serpentis', 'Ser'], ['Serpens', 'Ser'],
  ['Sextantis', 'Sex'], ['Sextans', 'Sex'],
  ['Sagittae', 'Sge'], ['Sagitta', 'Sge'],
  ['Sagittarii', 'Sgr'], ['Sagittarius', 'Sgr'],
  ['Tauri', 'Tau'], ['Taurus', 'Tau'],
  ['Telescopii', 'Tel'], ['Telescopium', 'Tel'],
  ['Trianguli', 'Tri'], ['Triangulum', 'Tri'],
  ['Tucanae', 'Tuc'], ['Tucana', 'Tuc'],
  ['Velae', 'Vel'], ['Vela', 'Vel'],
  ['Virginis', 'Vir'], ['Virgo', 'Vir'],
  ['Volantis', 'Vol'], ['Volans', 'Vol'],
  ['Vulpeculae', 'Vul'], ['Vulpecula', 'Vul']
];

export function abbreviateConstellation(str?: string): string {
  if (!str) return '';
  for (const [full, abbr] of CONSTELLATIONS_FULL_TO_ABBR) {
    if (new RegExp(`\\b${full}\\b`, 'i').test(str)) {
      return abbr;
    }
  }
  return str.slice(0, 3);
}

export const GREEK_WORDS_MAP: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε',
  zeta: 'ζ', eta: 'η', theta: 'θ', iota: 'ι', kappa: 'κ',
  lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', omicron: 'ο',
  pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ', upsilon: 'υ',
  phi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω'
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
      displayFullName: 'Unknown Star'
    };
  }

  const cAbbr = abbreviateConstellation(star.constellation);

  // 1. Try to find Proper Name
  const proper = extractProperName(star.name);

  // 2. Find Bayer designation (Greek letter + abbreviated genitive)
  let bayer: string | null = null;
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
      const match = trimmed.match(/^([α-ωΑ-Ω][¹²³⁴⁵⁶⁷⁸⁹0-9]?)\s+([A-Za-z\s]+?)(?:\s+([A-Z][a-z0-9]?))?$/);
      if (match) {
        const symbol = match[1];
        const constName = match[2].trim();
        const comp = match[3] ? ` ${match[3]}` : '';
        const abbr = abbreviateConstellation(constName) || cAbbr;
        bayer = `${symbol} ${abbr}${comp}`.trim();
        break;
      }
      bayer = trimmed;
      break;
    }
    const m = trimmed.match(/^(Alpha|Beta|Gamma|Delta|Epsilon|Zeta|Eta|Theta|Iota|Kappa|Lambda|Mu|Nu|Xi|Omicron|Pi|Rho|Sigma|Tau|Upsilon|Phi|Chi|Psi|Omega)[-\s]?(\d+)?\s*(.*)$/i);
    if (m) {
      const gChar = GREEK_WORDS_MAP[m[1].toLowerCase()];
      if (gChar) {
        const num = m[2] ? (SUPERSCRIPTS[m[2]] || m[2]) : '';
        const abbr = m[3] ? (abbreviateConstellation(m[3]) || cAbbr) : cAbbr;
        bayer = `${gChar}${num} ${abbr}`.trim();
        break;
      }
    }
  }

  // 3. Find other designations (numbered/Flamsteed, variable, catalog with abbreviated genitive)
  let other: string | null = null;
  // Flamsteed
  for (const n of allDesignations) {
    const trimmed = n.trim();
    const fMatch = trimmed.match(/^(\d+)\s+([A-Za-z\s]+?)(?:\s+([A-Z][a-z0-9]?))?$/);
    if (fMatch) {
      const num = fMatch[1];
      const constName = fMatch[2].trim();
      const comp = fMatch[3] ? ` ${fMatch[3]}` : '';
      const abbr = abbreviateConstellation(constName) || cAbbr;
      other = `${num} ${abbr}${comp}`.trim();
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
        other = `${varId} ${abbr}${comp}`.trim();
        break;
      }
    }
  }

  // Fallback other: prefer readable catalog/survey name from star.name
  if (!other) {
    const clean = star.name ? star.name.replace(/\s*\([^)]+\)/g, '').trim() : '';
    other = clean || star.primaryDesignation || '';
  }

  // Final Hierarchy:
  // 1. Proper name first
  // 2. then Bayer designation (Greek + abbreviated genitive)
  // 3. other designations (numbered/Flamsteed, variable, etc. with abbreviated genitive)
  if (proper) {
    return {
      tier: 'proper',
      primaryName: proper,
      bayerDesignation: bayer || undefined,
      badge: bayer || other || undefined,
      displayFullName: bayer ? `${proper} (${bayer})` : proper
    };
  }

  if (bayer) {
    return {
      tier: 'bayer',
      primaryName: bayer,
      bayerDesignation: bayer,
      badge: undefined,
      displayFullName: bayer
    };
  }

  return {
    tier: 'other',
    primaryName: other,
    bayerDesignation: undefined,
    badge: undefined,
    displayFullName: other
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
    const m = trimmed.match(/^(Alpha|Beta|Gamma|Delta|Epsilon|Zeta|Eta|Theta|Iota|Kappa|Lambda|Mu|Nu|Xi|Omicron|Pi|Rho|Sigma|Tau|Upsilon|Phi|Chi|Psi|Omega)[-\s]?(\d+)?\s*(.*)$/i);
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
