/**
 * Script: normalize-star-names.cjs
 * Canonical Star Naming & Designation Consistency Normalizer (Phase 1, Track 2)
 *
 * Enforces:
 * 1. Tier 1: Widely Recognized Common Names stand alone without redundant parenthesized designations.
 * 2. Tier 2: Uncommon Proper Names formatted as [Proper Name (Greek(-number) Constellation Genitive)].
 * 3. Tier 3: Unnamed stars use standardized astronomical designations (Bayer > Flamsteed > Variable > Catalog ID).
 * 4. Multi-star components retain letter designations (Sirius A, Alpha Centauri A).
 * 5. Hyphenated Bayer indices (Greek(-number) Constellation Genitive).
 * 6. Preserves stripped nicknames/designations into alternateNames and designations.
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../src/data/starDatabase.json');
const STARNAMES_PATH = path.join(__dirname, '../public/data/starnames.json');
const CONST1_PATH = path.join(__dirname, '../src/data/constellationsPart1.ts');
const CONST2_PATH = path.join(__dirname, '../src/data/constellationsPart2.ts');
const MULTI_PATH = path.join(__dirname, '../src/data/multipleStarSystemsData.ts');

const stars = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const starnames = JSON.parse(fs.readFileSync(STARNAMES_PATH, 'utf8'));

// 88 Official Constellations (Abbr -> Genitive)
const CONSTELLATIONS = {
  'And': 'Andromedae', 'Ant': 'Antliae', 'Aps': 'Apodis', 'Aql': 'Aquilae',
  'Aqr': 'Aquarii', 'Ara': 'Arae', 'Ari': 'Arietis', 'Aur': 'Aurigae',
  'Boo': 'Boötis', 'Cae': 'Caeli', 'Cam': 'Camelopardalis', 'Cap': 'Capricorni',
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
  'UMa': 'Ursae Majoris', 'UMi': 'Ursae Minoris', 'Vel': 'Velorum',
  'Vir': 'Virginis', 'Vol': 'Volantis', 'Vul': 'Vulpeculae'
};

const CONSTELLATION_NOMINATIVE_TO_GENITIVE = {
  'Andromeda': 'Andromedae', 'Antlia': 'Antliae', 'Apus': 'Apodis', 'Aquila': 'Aquilae',
  'Aquarius': 'Aquarii', 'Ara': 'Arae', 'Aries': 'Arietis', 'Auriga': 'Aurigae',
  'Boötes': 'Boötis', 'Bootes': 'Boötis', 'Caelum': 'Caeli', 'Camelopardalis': 'Camelopardalis',
  'Cancer': 'Cancri', 'Canes Venatici': 'Canum Venaticorum', 'Canis Major': 'Canis Majoris', 'Canis Minor': 'Canis Minoris',
  'Capricornus': 'Capricorni', 'Carina': 'Carinae', 'Cassiopeia': 'Cassiopeiae', 'Centaurus': 'Centauri',
  'Cepheus': 'Cephei', 'Cetus': 'Ceti', 'Chamaeleon': 'Chamaeleontis', 'Circinus': 'Circini',
  'Columba': 'Columbae', 'Coma Berenices': 'Comae Berenices', 'Corona Australis': 'Coronae Australis',
  'Corona Borealis': 'Coronae Borealis', 'Corvus': 'Corvi', 'Crater': 'Crateris', 'Crux': 'Crucis',
  'Cygnus': 'Cygni', 'Delphinus': 'Delphini', 'Dorado': 'Doradus', 'Draco': 'Draconis',
  'Equuleus': 'Equulei', 'Eridanus': 'Eridani', 'Fornax': 'Fornacis', 'Gemini': 'Geminorum',
  'Grus': 'Gruis', 'Hercules': 'Herculis', 'Horologium': 'Horologii', 'Hydra': 'Hydrae',
  'Hydrus': 'Hydri', 'Indus': 'Indi', 'Lacerta': 'Lacertae', 'Leo': 'Leonis',
  'Leo Minor': 'Leonis Minoris', 'Lepus': 'Leporis', 'Libra': 'Librae', 'Lupus': 'Lupi',
  'Lynx': 'Lyncis', 'Lyra': 'Lyrae', 'Mensa': 'Mensae', 'Microscopium': 'Microscopii',
  'Monoceros': 'Monocerotis', 'Musca': 'Muscae', 'Norma': 'Normae', 'Octans': 'Octantis',
  'Ophiuchus': 'Ophiuchi', 'Orion': 'Orionis', 'Pavo': 'Pavonis', 'Pegasus': 'Pegasi',
  'Perseus': 'Persei', 'Phoenix': 'Phoenicis', 'Pictor': 'Pictoris', 'Pisces': 'Piscium',
  'Piscis Austrinus': 'Piscis Austrini', 'Puppis': 'Puppis', 'Pyxis': 'Pyxidis', 'Reticulum': 'Reticuli',
  'Sagitta': 'Sagittae', 'Sagittarius': 'Sagittarii', 'Scorpius': 'Scorpii', 'Sculptor': 'Sculptoris',
  'Scutum': 'Scuti', 'Serpens': 'Serpentis', 'Sextans': 'Sextantis', 'Taurus': 'Tauri',
  'Telescopium': 'Telescopii', 'Triangulum': 'Trianguli', 'Triangulum Australe': 'Trianguli Australis',
  'Tucana': 'Tucanae', 'Ursa Major': 'Ursae Majoris', 'Ursa Minor': 'Ursae Minoris',
  'Vela': 'Velorum', 'Virgo': 'Virginis', 'Volans': 'Volantis', 'Vulpecula': 'Vulpeculae'
};

const GREEK_CHAR_TO_NAME = {
  'α': 'Alpha', 'β': 'Beta', 'γ': 'Gamma', 'δ': 'Delta', 'ε': 'Epsilon',
  'ζ': 'Zeta', 'η': 'Eta', 'θ': 'Theta', 'ι': 'Iota', 'κ': 'Kappa',
  'λ': 'Lambda', 'μ': 'Mu', 'ν': 'Nu', 'ξ': 'Xi', 'ο': 'Omicron',
  'π': 'Pi', 'ρ': 'Rho', 'σ': 'Sigma', 'τ': 'Tau', 'υ': 'Upsilon',
  'φ': 'Phi', 'χ': 'Chi', 'ψ': 'Psi', 'ω': 'Omega'
};

const GREEK_WORDS_LIST = Object.values(GREEK_CHAR_TO_NAME);
const GREEK_WORDS_REGEX_PART = GREEK_WORDS_LIST.join('|');

// Tier 1 Globally Famous Stars (Primary header stands alone without parens)
const TIER_1_FAMOUS = new Set([
  'betelgeuse', 'rigel', 'antares', 'sirius', 'sirius a', 'sirius b',
  'vega', 'polaris', 'aldebaran', 'canopus', 'deneb', 'spica',
  'altair', 'arcturus', 'capella', 'capella aa', 'capella ab',
  'procyon', 'procyon a', 'procyon b', 'achernar', 'hadar', 'hadar aa',
  'hadar b', 'acrux', 'acrux aa', 'acrux ab', 'acrux ba', 'acrux bb', 'acrux ca', 'acrux cb', 'acrux d',
  'pollux', 'castor', 'castor a', 'castor aa', 'castor b', 'castor ba', 'castor ca', 'castor cb',
  'fomalhaut', 'mimosa', 'regulus', 'adhara', 'gacrux', 'bellatrix',
  'elnath', 'miaplacidus', 'alnilam', 'alnitak', 'alioth', 'kaus australis',
  'mirfak', 'dubhe', 'wezen', 'alkaid', 'avior', 'menkalinan', 'atria',
  'alhena', 'peacock', 'mirzam', 'alphard', 'hamal', 'algieba', 'diphda',
  'nunki', 'menkent', 'mirach', 'alpheratz', 'rasalhague', 'saiph',
  'kochab', 'algol', 'algol a', 'algol b', 'alcor', 'mizar', 'mizar aa',
  'proxima centauri', 'alpha centauri a', 'alpha centauri b', 'sun',
  'barnard\'s star', 'barnards star'
]);

// Map IAU proper names from starnames.json
const iauMap = new Map();
for (const [hip, obj] of Object.entries(starnames)) {
  if (obj.name) {
    iauMap.set(obj.name.toLowerCase(), { hip, ...obj });
  }
}

function resolveGenitive(c, fallback) {
  if (!c && fallback) return CONSTELLATIONS[fallback] || CONSTELLATION_NOMINATIVE_TO_GENITIVE[fallback] || fallback;
  if (!c) return '';
  return CONSTELLATIONS[c] || CONSTELLATION_NOMINATIVE_TO_GENITIVE[c] || c;
}

function normalizeBayerString(str, fallbackConstell) {
  if (!str) return '';
  let s = str.trim();

  // If contains Greek character (e.g. "α Her", "δ Ori", "υ2 Cas", "π¹ Gru")
  const greekCharMatch = s.match(/^([α-ωΑ-Ω])([0-9¹²³⁴⁵⁶⁷⁸⁹]*)\s*(.*)$/);
  if (greekCharMatch) {
    const [, ch, sub, rest] = greekCharMatch;
    const greekName = GREEK_CHAR_TO_NAME[ch.toLowerCase()];
    if (greekName) {
      let num = sub.replace(/[¹]/g, '1').replace(/[²]/g, '2').replace(/[³]/g, '3');
      const hyphen = num ? `-${num}` : '';
      const gen = resolveGenitive(rest.trim(), fallbackConstell);
      return `${greekName}${hyphen} ${gen}`.trim();
    }
  }

  // Flamsteed: e.g. "46 LMi", "119 Tau"
  const flamMatch = s.match(/^(\d+)\s+([A-Za-z]+)$/);
  if (flamMatch) {
    const [, num, cKey] = flamMatch;
    const gen = resolveGenitive(cKey, fallbackConstell);
    return `${num} ${gen}`.trim();
  }

  // Variable: e.g. "Y CVn"
  const varMatch = s.match(/^([A-Z]{1,2}|V\d+)\s+([A-Za-z]+)$/);
  if (varMatch) {
    const [, v, cKey] = varMatch;
    const gen = resolveGenitive(cKey, fallbackConstell);
    return `${v} ${gen}`.trim();
  }

  // Hyphenate Bayer indices: e.g. "Upsilon 2 Cassiopeiae" -> "Upsilon-2 Cassiopeiae", "Upsilon2 Cassiopeiae" -> "Upsilon-2 Cassiopeiae"
  s = s.replace(new RegExp(`\\b(${GREEK_WORDS_REGEX_PART})\\s+(\\d+)\\b`, 'gi'), (m, g, num) => {
    const cap = g.charAt(0).toUpperCase() + g.slice(1).toLowerCase();
    return `${cap}-${num}`;
  });
  s = s.replace(new RegExp(`\\b(${GREEK_WORDS_REGEX_PART})(\\d+)\\b`, 'gi'), (m, g, num) => {
    const cap = g.charAt(0).toUpperCase() + g.slice(1).toLowerCase();
    return `${cap}-${num}`;
  });

  return s;
}

const CATALOG_PREFIX_REGEX = /^(HD|HDE|HR|BD|CD|CPD|GJ|Gl|Gliese|HIP|SAO|TYC|2MASS|Gaia|TIC|TOI|KIC|KOI|Kepler|K2|WDS|ADS|CCDM|IRAS|IRC|WISE|AKARI|DENIS|LHS|Wolf|Ross|LTT|NLTT|LP|BPM|EGGR|GSC|PPM|FK5|GC|GEN#|Ci\s+\d+|PMC|SBC|UBV|uvby|Zkh|PLX|8pc|AG[+-]|CSV|NSV|JP\d+|HGAM|CEL|CSI|N30|ROT|SKY#|USNO|WEB|1E|EUVE|JCMT|EQ|Renson|MSX|VOG|YBJ|CHH|H2013|HSH|WO|MKK|PSZ|1RXS|CXO|4U|Sco\s+X|St2-|RSGC2-|W\d+|Cl\*|\[|\d+G\.|PSR|RX|CXOU|EPIC|AC\+|CS\s|HE\s|SMSS|SDSS|MACS|WHL|VB\s)/i;

let changedCount = 0;

for (const star of stars) {
  const origName = star.name.trim();
  let newName = origName;
  const alternatesToAdd = [];

  const m = origName.match(/^(.*?)\s*\((.*?)\)$/);

  if (m) {
    const outside = m[1].trim();
    const inside = m[2].trim();
    const lowerOutside = outside.toLowerCase();
    const lowerInside = inside.toLowerCase();

    // 1. Tier 1 Famous Stars: Common name stands alone
    if (TIER_1_FAMOUS.has(lowerOutside)) {
      newName = outside;
      alternatesToAdd.push(inside);
    } else if (TIER_1_FAMOUS.has(lowerInside)) {
      newName = inside;
      alternatesToAdd.push(outside);
    }
    // Special case: Mu Cephei (Herschel's Garnet Star) -> Bayer designation Mu Cephei
    else if (lowerOutside === 'mu cephei') {
      newName = 'Mu Cephei';
      alternatesToAdd.push(inside);
    }
    // 2. Inverted Bayer(Proper): outside is Bayer, inside is proper name
    else if (GREEK_WORDS_LIST.some(g => outside.startsWith(g + ' ') || outside.startsWith(g + '-'))) {
      if (!CATALOG_PREFIX_REGEX.test(inside) && !inside.includes('/') && !inside.includes('Binary') && !inside.includes('ADS')) {
        const normOutside = normalizeBayerString(outside, star.constellation);
        newName = `${inside} (${normOutside})`;
      } else {
        newName = normalizeBayerString(outside, star.constellation);
        alternatesToAdd.push(inside);
      }
    }
    // 3. Proper(Designation) or Proper(Nickname/Catalog)
    else {
      // If inside is Bayer designation: e.g. "Castula (Upsilon-2 Cassiopeiae)"
      if (GREEK_WORDS_LIST.some(g => inside.startsWith(g + ' ') || inside.startsWith(g + '-'))) {
        const normInside = normalizeBayerString(inside, star.constellation);
        newName = `${outside} (${normInside})`;
      }
      // If inside is nickname or descriptive moniker:
      else if (inside.includes('Nova') || inside.includes('Binary') || inside.includes('Pulsar') || inside.includes('Magnetar') || inside.includes('Donor') || inside.includes('Star') || inside.includes('Lucy') || inside.includes('Tabby') || inside.includes('LGM-1') || inside.includes('Fastest') || inside.includes('Ice Dwarf') || inside.includes('Permanent') || inside.includes('Archetype')) {
        if (outside === 'Ruby Star' && inside === '119 Tauri') {
          newName = '119 Tauri';
          alternatesToAdd.push('Ruby Star');
        } else {
          newName = outside;
          alternatesToAdd.push(inside);
        }
      }
      // If inside is catalog prefix: e.g. "K2-18 (EPIC ...)", "Gliese 436 (GJ 436)"
      else if (CATALOG_PREFIX_REGEX.test(inside)) {
        newName = outside;
        alternatesToAdd.push(inside);
      }
      // If outside is Flamsteed and inside is Proper Name: e.g. "51 Pegasi (Helvetios)", "55 Cancri (Copernicus)", "47 Ursae Majoris (Chalawan)"
      else if (/^\d+\s+[A-Z][a-z]+/.test(outside) && !/^\d+/.test(inside)) {
        newName = `${inside} (${outside})`;
      }
      // Otherwise keep as is, normalizing any Bayer inside
      else {
        const normInside = normalizeBayerString(inside, star.constellation);
        newName = `${outside} (${normInside})`;
      }
    }
  } else {
    // Star currently has NO parens
    const lower = origName.toLowerCase();
    // If not Tier 1, check if it has a Bayer designation or IAU proper name
    if (!TIER_1_FAMOUS.has(lower) && iauMap.has(lower)) {
      const iau = iauMap.get(lower);
      const bayerDesig = star.bayerDesignation || (iau.desig ? `${iau.desig} ${iau.c}` : '');
      if (bayerDesig) {
        const normDesig = normalizeBayerString(bayerDesig, star.constellation);
        if (normDesig) {
          newName = `${origName} (${normDesig})`;
        }
      }
    }
  }

  // Ensure Bayer hyphenation in all final strings
  newName = normalizeBayerString(newName, star.constellation);

  if (newName !== origName) {
    changedCount++;
    star.name = newName;

    // Add alternate names cleanly
    if (!star.alternateNames) star.alternateNames = [];
    if (!star.designations) star.designations = [];

    for (const alt of alternatesToAdd) {
      if (!star.alternateNames.includes(alt)) {
        star.alternateNames.push(alt);
      }
      if (!star.designations.includes(alt)) {
        star.designations.push(alt);
      }
    }
    if (!star.alternateNames.includes(origName)) {
      star.alternateNames.push(origName);
    }
    if (!star.designations.includes(origName)) {
      star.designations.push(origName);
    }
  }
}

console.log(`Normalizer updated ${changedCount} star names in starDatabase.json.`);

// Write back to starDatabase.json
fs.writeFileSync(DB_PATH, JSON.stringify(stars, null, 2) + '\n', 'utf8');

// Synchronize principalStarNames in constellationsPart1.ts & constellationsPart2.ts
function syncConstellationsFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  content = content.replace(/principalStarName:\s*['"]([^'"]+)['"]/g, (match, currentName) => {
    const cleanCurrent = currentName.replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
    const found = stars.find(s => {
      const cleanDb = s.name.replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
      return cleanDb === cleanCurrent || s.id === cleanCurrent.replace(/[^a-z0-9]+/g, '-');
    });
    if (found && found.name !== currentName) {
      count++;
      return `principalStarName: '${found.name}'`;
    }
    return match;
  });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${count} principal star names in ${path.basename(filePath)}`);
}

syncConstellationsFile(CONST1_PATH);
syncConstellationsFile(CONST2_PATH);

// Synchronize names in multipleStarSystemsData.ts
let multiContent = fs.readFileSync(MULTI_PATH, 'utf8');
multiContent = multiContent.replace(/name:\s*['"]Sirius A \([^'"]+\)['"]/g, "name: 'Sirius A'");
multiContent = multiContent.replace(/name:\s*['"]Sirius B \([^'"]+\)['"]/g, "name: 'Sirius B'");
multiContent = multiContent.replace(/name:\s*['"]Alpha Centauri A \([^'"]+\)['"]/g, "name: 'Alpha Centauri A'");
multiContent = multiContent.replace(/name:\s*['"]Alpha Centauri B \([^'"]+\)['"]/g, "name: 'Alpha Centauri B'");
multiContent = multiContent.replace(/name:\s*['"]Proxima Centauri \([^'"]+\)['"]/g, "name: 'Proxima Centauri'");

fs.writeFileSync(MULTI_PATH, multiContent, 'utf8');
console.log('Multiple star systems component names synchronized.');
console.log('✅ Star Naming Normalization complete.');
