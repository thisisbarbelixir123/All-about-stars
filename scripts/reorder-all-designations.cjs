const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../src/data/starDatabase.json');
const stars = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const CATALOG_PREFIX_REGEX = /^(HD|HDE|HR|BD|CD|CPD|GJ|Gl|Gliese|HIP|SAO|TYC|2MASS|Gaia|TIC|TOI|KIC|KOI|Kepler|K2|WDS|ADS|CCDM|IRAS|IRC|WISE|AKARI|DENIS|LHS|Wolf|Ross|LTT|NLTT|LP|BPM|EGGR|GSC|PPM|FK5|GC|GEN#|Ci\s+\d+|PMC|SBC|UBV|uvby|Zkh|PLX|8pc|AG[+-]|CSV|NSV|JP\d+|HGAM|CEL|CSI|N30|ROT|SKY#|USNO|WEB|1E|EUVE|JCMT|EQ|Renson|MSX|VOG|YBJ|CHH|H2013|HSH|WO|MKK|PSZ|1RXS|CXO|4U|Sco\s+X|St2-|RSGC2-|W\d+|Cl\*|\[|\d+G\.)/i;
const GREEK_WORDS = /^(Alpha|Beta|Gamma|Delta|Epsilon|Zeta|Eta|Theta|Iota|Kappa|Lambda|Mu|Nu|Xi|Omicron|Pi|Rho|Sigma|Tau|Upsilon|Phi|Chi|Psi|Omega)\b/i;

function isProperName(str) {
  const s = str.trim();
  if (!s) return false;
  if (/^[α-ωΑ-Ω]/i.test(s) || GREEK_WORDS.test(s)) return false;
  if (CATALOG_PREFIX_REGEX.test(s)) return false;
  if (/\d/.test(s)) return false;
  if (/^[A-Z]{2,5}(\s+[A-Z0-9]+)?$/.test(s)) return false;
  return true;
}

function reorderDesignations(star) {
  const primary = (star.primaryDesignation || star.bayerDesignation || '').trim();
  const rawList = star.designations || [];

  const seen = new Set();
  const primaryGroup = [];
  const properGroup = [];
  const othersGroup = [];

  function add(item, group) {
    if (!item) return;
    const t = item.trim();
    if (!t) return;
    const key = t.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    group.push(t);
  }

  // 1. Primary Designation FIRST
  if (primary) {
    add(primary, primaryGroup);
  }

  // 2. Proper Names
  const parenMatch = star.name.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const inside = parenMatch[1].trim();
    if (isProperName(inside)) add(inside, properGroup);
  }

  const cleanName = star.name.replace(/\s*\([^)]*\)/g, '').trim();
  if (isProperName(cleanName)) {
    add(cleanName, properGroup);
    const baseMatch = cleanName.match(/^([A-Za-z\s'-]+?)\s+[A-Z][a-z0-9]?$/);
    if (baseMatch && isProperName(baseMatch[1])) {
      add(baseMatch[1], properGroup);
    }
  }

  if (star.alternateNames) {
    for (const alt of star.alternateNames) {
      if (isProperName(alt)) add(alt, properGroup);
    }
  }

  for (const item of rawList) {
    if (isProperName(item)) {
      add(item, properGroup);
    }
  }

  // 3. Others (Catalog designations in order)
  for (const item of rawList) {
    add(item, othersGroup);
  }

  return [...primaryGroup, ...properGroup, ...othersGroup];
}

for (const s of stars) {
  s.designations = reorderDesignations(s);
}

fs.writeFileSync(DB_PATH, JSON.stringify(stars, null, 2), 'utf8');
console.log(`Reordered designations for all ${stars.length} stars in ${DB_PATH}`);
