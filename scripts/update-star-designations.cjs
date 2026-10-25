const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../src/data/starDatabase.json');
const RAW_IDENT_PATH = path.join(__dirname, '../scratch/all_raw_ident.json');

const stars = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const rawIdent = JSON.parse(fs.readFileSync(RAW_IDENT_PATH, 'utf8'));

const CONSTELLATION_ABBR_TO_GENITIVE = {
  'And': 'Andromedae', 'Ant': 'Antliae', 'Aps': 'Apodis', 'Aql': 'Aquilae',
  'Aqr': 'Aquarii', 'Ara': 'Arae', 'Ari': 'Arietis', 'Aur': 'Aurigae',
  'Boo': 'Bootis', 'Cae': 'Caeli', 'Cam': 'Camelopardalis', 'Cap': 'Capricorni',
  'Car': 'Carinae', 'Cas': 'Cassiopeiae', 'Cen': 'Centauri', 'Cep': 'Cephei',
  'Cet': 'Ceti', 'Cha': 'Chamaeleontis', 'Cir': 'Circini', 'CMa': 'Canis Majoris',
  'CMi': 'Canis Minoris', 'Cnc': 'Cancri', 'Col': 'Columbae', 'Com': 'Comae Berenices',
  'CrA': 'Coronae Australis', 'CrB': 'Coronae Borealis', 'Crt': 'Crateris',
  'Cru': 'Crucis', 'Crv': 'Corvi', 'CVn': 'Canum Venaticorum', 'Cyg': 'Cygni',
  'Del': 'Delphini', 'Dor': 'Doradus', 'Dra': 'Draconis', 'Equ': 'Equulei',
  'Eri': 'Eridani', 'For': 'Fornacis', 'Gem': 'Geminorum', 'Gru': 'Gruis',
  'Her': 'Herculis', 'Hor': 'Horologii', 'Hya': 'Hydrae', 'Hyi': 'Hydri',
  'Ind': 'Indi', 'Lac': 'Lacertae', 'Leo': 'Leonis', 'Lep': 'Leporis',
  'Lib': 'Librae', 'LMi': 'Leonis Minoris', 'Lup': 'Lupi', 'Lyn': 'Lyncis',
  'Lyr': 'Lyrae', 'Men': 'Mensae', 'Mic': 'Microscopii', 'Mon': 'Monocerotis',
  'Mus': 'Muscae', 'Nor': 'Normae', 'Oct': 'Octantis', 'Oph': 'Ophiuchi',
  'Ori': 'Orionis', 'Pav': 'Pavonis', 'Peg': 'Pegasi', 'Per': 'Persei',
  'Phe': 'Phoenicis', 'Pic': 'Pictoris', 'PsA': 'Piscis Austrini', 'Psc': 'Piscium',
  'Pup': 'Puppis', 'Pyx': 'Pyxidis', 'Ret': 'Reticuli', 'Scl': 'Sculptoris',
  'Sco': 'Scorpii', 'Sct': 'Scuti', 'Ser': 'Serpentis', 'Sex': 'Sextantis',
  'Sge': 'Sagittae', 'Sgr': 'Sagittarii', 'Tau': 'Tauri', 'Tel': 'Telescopii',
  'TrA': 'Trianguli Australis', 'Tri': 'Trianguli', 'Tuc': 'Tucanae',
  'UMa': 'Ursae Majoris', 'UMi': 'Ursae Minoris', 'Vel': 'Velae',
  'Vir': 'Virginis', 'Vol': 'Volantis', 'Vul': 'Vulpeculae'
};

const GREEK_ABBR_TO_CHAR = {
  'alf': 'α', 'bet': 'β', 'gam': 'γ', 'del': 'δ', 'eps': 'ε', 'zet': 'ζ',
  'eta': 'η', 'tet': 'θ', 'iot': 'ι', 'kap': 'κ', 'lam': 'λ', 'mu.': 'μ',
  'mu': 'μ', 'nu.': 'ν', 'nu': 'ν', 'ksi': 'ξ', 'omi': 'ο', 'pi.': 'π',
  'pi': 'π', 'rho': 'ρ', 'sig': 'σ', 'tau': 'τ', 'ups': 'υ', 'phi': 'φ',
  'chi': 'χ', 'psi': 'ψ', 'ome': 'ω'
};

function formatRawIdentifier(raw) {
  let s = raw.trim();
  const isVar = s.startsWith('V* ');
  s = s.replace(/^(\*{1,2}|V\*|Cl\*|EM\*|QSO|AGN)\s+/, '');

  // Bayer: e.g. "alf CMa", "alf CMa A", "tet01 Ori C"
  const bayerMatch = s.match(/^([a-z]{3}\.?)(\d*)\s+([A-Z][a-zA-Z]{2})(\s+[A-Za-z0-9]+)?$/);
  if (bayerMatch) {
    const [, gKey, sub, cKey, comp] = bayerMatch;
    const greekChar = GREEK_ABBR_TO_CHAR[gKey];
    const genitive = CONSTELLATION_ABBR_TO_GENITIVE[cKey];
    const subStr = sub ? `${parseInt(sub, 10)}` : '';
    const compStr = comp ? comp : '';
    if (greekChar && genitive) {
      return {
        priority: 1,
        formatted: `${greekChar}${subStr} ${genitive}${compStr}`,
        short: `${greekChar}${subStr} ${cKey}${compStr}`
      };
    }
  }

  // Flamsteed: e.g. "9 CMa", "61 Cyg A"
  const flamMatch = s.match(/^(\d+)\s+([A-Z][a-zA-Z]{2})(\s+[A-Za-z0-9]+)?$/);
  if (flamMatch) {
    const [, num, cKey, comp] = flamMatch;
    const genitive = CONSTELLATION_ABBR_TO_GENITIVE[cKey];
    const compStr = comp ? comp : '';
    if (genitive) {
      return {
        priority: 2,
        formatted: `${num} ${genitive}${compStr}`,
        short: `${num} ${cKey}${compStr}`
      };
    }
  }

  // Variable Star designation: e.g. "UY Sct", "V1489 Cyg", "RR Lyr"
  const varMatch = s.match(/^([A-Z]|[A-Z]{2}|V\d{2,4})\s+([A-Z][a-zA-Z]{2})(\s+[A-Za-z0-9]+)?$/);
  if (varMatch && (isVar || /^[R-Z]\b|^[A-Q][A-Z]\b|^[R-Z]{2}\b|^V\d+/.test(varMatch[1]))) {
    const [, vName, cKey, comp] = varMatch;
    const genitive = CONSTELLATION_ABBR_TO_GENITIVE[cKey];
    const compStr = comp ? comp : '';
    if (genitive) {
      return {
        priority: 3,
        formatted: `${vName} ${genitive}${compStr}`,
        short: `${vName} ${cKey}${compStr}`
      };
    }
  }

  // Durchmusterung: e.g. "BD-16 1591", "BD+07 1055", "CD-25 4441", "CPD-59 2603"
  const dmMatch = s.match(/^(BD|CD|CPD)\s*([+-]\d+)\s+(\d+)(\s+[A-Za-z0-9]+)?$/);
  if (dmMatch) {
    const [, cat, zone, num, comp] = dmMatch;
    const compStr = comp ? comp.trim() : '';
    return {
      priority: 6,
      formatted: `${cat}${zone}°${num}${compStr ? ' ' + compStr : ''}`
    };
  }

  // Henry Draper
  if (/^HD(E)?\s+\d+/i.test(s)) {
    return { priority: 4, formatted: s.replace(/\s+/g, ' ') };
  }

  // Bright Star
  if (/^HR\s+\d+/i.test(s)) {
    return { priority: 5, formatted: s.replace(/\s+/g, ' ') };
  }

  // Gliese / Nearby
  if (/^(GJ|Gl|Gliese|LHS|Wolf|Ross|LTT|NLTT)\s+\d+/i.test(s)) {
    return { priority: 7, formatted: s.replace(/\s+/g, ' ') };
  }

  // Hipparcos
  if (/^HIP\s+\d+/i.test(s)) {
    return { priority: 8, formatted: s.replace(/\s+/g, ' ') };
  }

  // SAO
  if (/^SAO\s+\d+/i.test(s)) {
    return { priority: 9, formatted: s.replace(/\s+/g, ' ') };
  }

  // Tycho
  if (/^TYC\s+[\d-]+/i.test(s)) {
    return { priority: 10, formatted: s.replace(/\s+/g, ' ') };
  }

  // 2MASS
  if (/^2MASS\s+J[\d+-]+/i.test(s)) {
    return { priority: 11, formatted: s.replace(/\s+/g, ' ') };
  }

  // Gaia DR3 / DR2
  if (/^Gaia\s+(DR\d)\s+\d+/i.test(s)) {
    return { priority: 12, formatted: s.replace(/\s+/g, ' ') };
  }

  // TIC / TOI / Kepler
  if (/^(TIC|TOI|KIC|KOI|Kepler|K2)\s+[\d+-]+/i.test(s)) {
    return { priority: 13, formatted: s.replace(/\s+/g, ' ') };
  }

  // WDS / ADS
  if (/^(WDS|ADS|CCDM)\s+/i.test(s)) {
    return { priority: 14, formatted: s.replace(/\s+/g, ' ') };
  }

  if (s.startsWith('NAME ')) {
    s = s.slice(5).trim();
  }

  return { priority: 15, formatted: s.replace(/\s+/g, ' ') };
}

function processStar(star) {
  const rawList = rawIdent[star.id] || [];
  const formattedItems = [];
  const seen = new Set();

  function addItem(item) {
    if (!item || !item.formatted) return;
    const key = item.formatted.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    formattedItems.push(item);
  }

  // 1. Process SIMBAD raw identifiers
  for (const raw of rawList) {
    addItem(formatRawIdentifier(raw));
  }

  // 2. Add existing data
  if (star.bayerDesignation) {
    addItem({ priority: 1, formatted: star.bayerDesignation, short: star.bayerDesignation });
  }
  if (star.flamsteedDesignation) {
    addItem({ priority: 2, formatted: star.flamsteedDesignation, short: star.flamsteedDesignation });
  }
  if (star.gouldDesignation) {
    addItem({ priority: 2.5, formatted: star.gouldDesignation, short: star.gouldDesignation });
  }
  if (star.alternateNames) {
    for (const alt of star.alternateNames) {
      addItem(formatRawIdentifier(alt));
    }
  }

  // Special handling for Sun
  if (star.id === 'sun') {
    return {
      primaryDesignation: 'Sol',
      designations: ['Sol', 'Sun', '109 D_sun Standard', 'IAU Solar Reference']
    };
  }

  // Sort by priority, then alphabetical
  formattedItems.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.formatted.localeCompare(b.formatted);
  });

  const designations = formattedItems.map(x => x.formatted);

  // Determine primaryDesignation:
  let primary = star.bayerDesignation;
  if (!primary) {
    const bayer = formattedItems.find(x => x.priority === 1);
    if (bayer) primary = bayer.short || bayer.formatted;
  }
  if (!primary && star.flamsteedDesignation) {
    primary = star.flamsteedDesignation;
  }
  if (!primary) {
    const flam = formattedItems.find(x => x.priority === 2);
    if (flam) primary = flam.short || flam.formatted;
  }
  if (!primary) {
    const v = formattedItems.find(x => x.priority === 3);
    if (v) primary = v.short || v.formatted;
  }
  if (!primary) {
    // Check clean star name or alternate names for recognizable designations
    const cleanName = star.name.replace(/\s*\([^)]*\)/g, '').trim();
    if (/^(TRAPPIST|Kepler|KOI|PSR|SGR|WR|VFTS|WOH|R136|W\d+|RSGC|Stephenson|LBV)/i.test(cleanName)) {
      primary = cleanName;
    }
  }
  if (!primary && star.alternateNames && star.alternateNames.length > 0) {
    const prefAlt = star.alternateNames.find(a => 
      /^(RSGC|Stephenson|W\d+|Cl\*|VFTS|WR|PSR|SGR|TRAPPIST|Kepler|TOI|TIC|LHS|Wolf|Ross|GJ|Gl|HD|HIP|HR)/i.test(a) &&
      a.length < 25 && !a.startsWith('2MASS')
    );
    if (prefAlt) primary = prefAlt;
  }
  if (!primary) {
    const cat = formattedItems.find(x => x.priority >= 4 && x.priority <= 10);
    if (cat) primary = cat.formatted;
  }
  if (!primary && star.alternateNames && star.alternateNames.length > 0) {
    primary = star.alternateNames[0];
  }
  if (!primary && designations.length > 0) {
    primary = designations[0];
  }
  if (!primary) {
    primary = star.name.replace(/\s*\([^)]*\)/g, '').trim();
  }

  return { primaryDesignation: primary, designations };
}

// Backup starDatabase.json
fs.copyFileSync(DB_PATH, DB_PATH + '.bak');

let totalDesignations = 0;
for (const s of stars) {
  const { primaryDesignation, designations } = processStar(s);
  s.primaryDesignation = primaryDesignation;
  s.designations = designations;
  totalDesignations += designations.length;
}

fs.writeFileSync(DB_PATH, JSON.stringify(stars, null, 2), 'utf8');
console.log(`Successfully updated ${stars.length} stars in ${DB_PATH}`);
console.log(`Total designations across database: ${totalDesignations} (avg ${(totalDesignations / stars.length).toFixed(1)} per star)`);
