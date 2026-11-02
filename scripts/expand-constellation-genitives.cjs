/**
 * Task: Expand constellation abbreviations to full Latin genitives.
 * e.g.:
 *   "AF Lep b" -> "AF Leporis b"
 *   "HN Lib b" -> "HN Librae b"
 *   "AU Mic b" -> "AU Microscopii b"
 *   "51 Eri b" -> "51 Eridani b"
 *   "HN Peg b" -> "HN Pegasi b"
 *   "AB Pic b" -> "AB Pictoris b"
 *   "GQ Lup b" -> "GQ Lupi b"
 *   "DS Tuc A b" -> "DS Tucanae A b"
 *   "11 Com b" -> "11 Comae Berenices b"
 *   "11 UMi b" -> "11 Ursae Minoris b"
 *   "14 And b" -> "14 Andromedae b"
 *   "24 Boo b" -> "24 Boötis b"
 *   "24 Sex b" -> "24 Sextantis b"
 *   "38 Vir b" -> "38 Virginis b"
 *   "4 UMa b" -> "4 Ursae Majoris b"
 *   "42 Dra b" -> "42 Draconis b"
 *   "47 UMa d" -> "47 Ursae Majoris d"
 *   "6 Lyn b" -> "6 Lyncis b"
 *   "61 Vir b" -> "61 Virginis b"
 *   "7 CMa b" -> "7 Canis Majoris b"
 *   "70 Vir b" -> "70 Virginis b"
 *   "75 Cet b" -> "75 Ceti b"
 *   "81 Cet b" -> "81 Ceti b"
 *   "alf Ari b" -> "alpha Arietis b"
 *   "beta Pic c" -> "beta Pictoris c"
 *   "eps Tau b" -> "epsilon Tauri b"
 *   "eta Cet b" -> "eta Ceti b"
 */

const fs = require('fs');
const path = require('path');

const CATALOG_PATH = path.resolve('src/data/exoplanetCatalog.json');
const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));

const CONSTELLATIONS = {
  'And': 'Andromedae', 'Ant': 'Antliae', 'Aps': 'Apodis', 'Aql': 'Aquilae', 'Aqr': 'Aquarii',
  'Ara': 'Arae', 'Ari': 'Arietis', 'Aur': 'Aurigae', 'Boo': 'Boötis', 'Cae': 'Caeli',
  'Cam': 'Camelopardalis', 'Cnc': 'Cancri', 'CVn': 'Canum Venaticorum', 'CMa': 'Canis Majoris',
  'CMi': 'Canis Minoris', 'Cap': 'Capricorni', 'Car': 'Carinae', 'Cas': 'Cassiopeiae',
  'Cen': 'Centauri', 'Cep': 'Cephei', 'Cet': 'Ceti', 'Cha': 'Chamaeleontis', 'Cir': 'Circini',
  'Col': 'Columbae', 'Com': 'Comae Berenices', 'CrA': 'Coronae Australis', 'CrB': 'Coronae Borealis',
  'Crv': 'Corvi', 'Crt': 'Crateris', 'Cru': 'Crucis', 'Cyg': 'Cygni', 'Del': 'Delphini',
  'Dor': 'Doradus', 'Dra': 'Draconis', 'Equ': 'Equulei', 'Eri': 'Eridani', 'For': 'Fornacis',
  'Gem': 'Geminorum', 'Gru': 'Gruis', 'Her': 'Herculis', 'Hor': 'Horologii', 'Hya': 'Hydrae',
  'Hyi': 'Hydri', 'Ind': 'Indi', 'Lac': 'Lacertae', 'Leo': 'Leonis', 'LMi': 'Leonis Minoris',
  'Lep': 'Leporis', 'Lib': 'Librae', 'Lup': 'Lupi', 'Lyn': 'Lyncis', 'Lyr': 'Lyrae',
  'Men': 'Mensae', 'Mic': 'Microscopii', 'Mon': 'Monocerotis', 'Mus': 'Muscae', 'Nor': 'Normae',
  'Oct': 'Octantis', 'Oph': 'Ophiuchi', 'Ori': 'Orionis', 'Pav': 'Pavonis', 'Peg': 'Pegasi',
  'Per': 'Persei', 'Phe': 'Phoenicis', 'Pic': 'Pictoris', 'Psc': 'Piscium', 'PsA': 'Piscis Austrini',
  'Pup': 'Puppis', 'Pyx': 'Pyxidis', 'Ret': 'Reticuli', 'Sge': 'Sagittae', 'Sgr': 'Sagittarii',
  'Sco': 'Scorpii', 'Scl': 'Sculptoris', 'Sct': 'Scuti', 'Ser': 'Serpentis', 'Sex': 'Sextantis',
  'Tau': 'Tauri', 'Tel': 'Telescopii', 'Tri': 'Trianguli', 'TrA': 'Trianguli Australis',
  'Tuc': 'Tucanae', 'UMa': 'Ursae Majoris', 'UMi': 'Ursae Minoris', 'Vel': 'Velorum',
  'Vir': 'Virginis', 'Vol': 'Volantis', 'Vul': 'Vulpeculae'
};

const GREEK_EXPANSIONS = {
  'alf': 'alpha',
  'eps': 'epsilon'
};

function expandConstellationString(str) {
  if (!str) return str;
  let res = str;

  // First expand abbreviated Greek Bayer letters if followed by constellation
  // e.g. "alf Ari" -> "alpha Ari", "eps Tau" -> "epsilon Tau"
  for (const [abbr, full] of Object.entries(GREEK_EXPANSIONS)) {
    const rx = new RegExp(`\\b${abbr}\\b`, 'g');
    res = res.replace(rx, full);
  }

  // Next expand constellation 3-letter abbreviations
  for (const [abbr, genitive] of Object.entries(CONSTELLATIONS)) {
    // Avoid expanding if genitive already present
    if (res.includes(genitive)) continue;

    // Word boundary replace for constellation abbr
    const rx = new RegExp(`\\b${abbr}\\b`, 'g');
    res = res.replace(rx, genitive);
  }

  return res;
}

let nameUpdates = 0;
let hostUpdates = 0;

for (const p of catalog) {
  const newName = expandConstellationString(p.name);
  if (newName !== p.name) {
    console.log(`Name update: "${p.name}" -> "${newName}"`);
    p.name = newName;
    nameUpdates++;
  }

  if (p.hostSystem) {
    const newHost = expandConstellationString(p.hostSystem);
    if (newHost !== p.hostSystem) {
      p.hostSystem = newHost;
      hostUpdates++;
    }
  }
}

console.log(`\nCompleted: ${nameUpdates} planet names updated, ${hostUpdates} host systems updated.`);

fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
console.log('Saved to src/data/exoplanetCatalog.json');
