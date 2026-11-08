import fs from 'fs';
import path from 'path';
import { StarData } from '../src/types';
import { ALL_88_CONSTELLATIONS } from '../src/data/constellationsData';
import { MULTIPLE_STAR_SYSTEMS } from '../src/data/multipleStarSystemsData';
import { parseRaToDeg, parseDecToDeg } from '../src/utils/celestialMechanics';

const DB_PATH = path.join(process.cwd(), 'src/data/starDatabase.json');
const stars: StarData[] = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const validConstNames = new Set(ALL_88_CONSTELLATIONS.map((c) => c.name));
const constByName = new Map(ALL_88_CONSTELLATIONS.map((c) => [c.name.toLowerCase(), c]));
const constByGenitive = new Map(ALL_88_CONSTELLATIONS.map((c) => [c.genitive.toLowerCase(), c]));

// Build known multiple-star system pairs
const systemComponentPairs = new Set<string>();
for (const sys of MULTIPLE_STAR_SYSTEMS) {
  const compIds = sys.components.map((c) => c.id);
  const catalogIds = sys.components.map((c) => c.catalogStarId).filter(Boolean) as string[];
  const allIds = Array.from(new Set([sys.id, ...(sys.starIds || []), ...compIds, ...catalogIds]));
  for (let i = 0; i < allIds.length; i++) {
    for (let j = i + 1; j < allIds.length; j++) {
      systemComponentPairs.add([allIds[i], allIds[j]].sort().join('::'));
    }
  }
}

const knownSystemPairs = new Set([
  ['dalim', 'alpha-fornacis-b'].sort().join('::'),
  ['gliese-752-a', 'vb-10'].sort().join('::'),
  ['bl-ceti', 'uv-ceti'].sort().join('::'),
  ['mothra', 'quyllur'].sort().join('::'),
  ['r136a1', 'r136a2'].sort().join('::'),
  ['r136a1', 'r136a3'].sort().join('::'),
  ['r136a2', 'r136a3'].sort().join('::')
]);

function areStarsRelated(id1: string, id2: string): boolean {
  if (id1 === id2) return true;
  const pairKey = [id1, id2].sort().join('::');
  if (systemComponentPairs.has(pairKey)) return true;
  if (knownSystemPairs.has(pairKey)) return true;

  // Prefix matching (e.g. 'polaris' & 'polaris-ab', 'algol-a' & 'algol-b')
  const base1 = id1.replace(/-[a-z0-9]+(-star)?$/, '');
  const base2 = id2.replace(/-[a-z0-9]+(-star)?$/, '');
  if (base1 === base2 || base1 === id2 || base2 === id1) return true;

  return false;
}

console.log('=== STARPEDIA 3D CATALOG INTEGRITY & NORMALIZATION VALIDATOR ===');
const errors: string[] = [];

// -----------------------------------------------------------------------------
// 1. IAU Constellation, Diacritics & Bayer Normalization Checks
// -----------------------------------------------------------------------------
for (const star of stars) {
  if (star.id !== 'sun' && !validConstNames.has(star.constellation)) {
    errors.push(`[${star.id}] Invalid constellation name: "${star.constellation}". Must match one of 88 IAU constellations.`);
  }

  if (star.name.includes('Bootis')) {
    errors.push(`[${star.id}] Uses non-canonical ASCII "Bootis" instead of diacritic "Boötis" in name.`);
  }
  if (star.name.includes('Velae')) {
    errors.push(`[${star.id}] Uses non-canonical genitive "Velae" instead of "Velorum" in name.`);
  }

  if (star.bayerDesignation) {
    const raw = star.bayerDesignation.trim();
    if (raw !== 'Sol') {
      const tokens = raw.split(/\s+/);
      for (const t of tokens) {
        const lower = t.toLowerCase();
        const asGen = constByGenitive.get(lower);
        const asName = constByName.get(lower);
        if ((asGen && asGen.abbreviation !== t) || (asName && asName.abbreviation !== t) || lower === 'bootis' || lower === 'velae') {
          errors.push(`[${star.id}] Unabbreviated or non-canonical word in bayerDesignation: "${t}" in "${raw}". Should use abbreviation.`);
        }
      }
    }
  }
}

// -----------------------------------------------------------------------------
// 2. Anti-Duplication: Catalog Identifier Collision Check
// -----------------------------------------------------------------------------
const catPrefixes = ['HD', 'HIP', 'HR', 'SAO', 'Gaia DR3', 'Gaia DR2'];
for (const prefix of catPrefixes) {
  const map = new Map<string, StarData[]>();
  const regex = new RegExp(`\\b${prefix}\\s+([0-9]+)\\b`, 'i');

  for (const s of stars) {
    const desigs = [s.id, s.name, ...(s.alternateNames || []), ...(s.designations || [])];
    for (const d of desigs) {
      const m = d.match(regex);
      if (m) {
        const num = m[1];
        const list = map.get(num) || [];
        if (!list.some((x) => x.id === s.id)) {
          list.push(s);
          map.set(num, list);
        }
      }
    }
  }

  for (const [num, list] of map.entries()) {
    if (list.length > 1) {
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const s1 = list[i];
          const s2 = list[j];
          if (!areStarsRelated(s1.id, s2.id)) {
            errors.push(`[DUPLICATE_IDENTIFIER] ${prefix} ${num} shared by unrelated stars: [${s1.id}] "${s1.name}" and [${s2.id}] "${s2.name}"`);
          }
        }
      }
    }
  }
}

// -----------------------------------------------------------------------------
// 3. Anti-Duplication: Astrometric Proximity Collision Check (< 1.0 arcsec)
// -----------------------------------------------------------------------------
const starCoords: Array<{ id: string; name: string; ra: number; dec: number }> = [];
for (const s of stars) {
  if (s.id === 'sun') continue;
  try {
    const raDeg = parseRaToDeg(s.rightAscension, true);
    const decDeg = parseDecToDeg(s.declination);
    if (!isNaN(raDeg) && !isNaN(decDeg)) {
      starCoords.push({ id: s.id, name: s.name, ra: raDeg, dec: decDeg });
    }
  } catch (e) {}
}

for (let i = 0; i < starCoords.length; i++) {
  for (let j = i + 1; j < starCoords.length; j++) {
    const s1 = starCoords[i];
    const s2 = starCoords[j];
    const dDec = Math.abs(s1.dec - s2.dec);
    if (dDec > 0.05) continue;
    const cosDec = Math.cos((s1.dec * Math.PI) / 180);
    const dRa = Math.abs(s1.ra - s2.ra) * cosDec;
    const distArcsec = Math.sqrt(dRa * dRa + dDec * dDec) * 3600;

    if (distArcsec < 1.0 && !areStarsRelated(s1.id, s2.id)) {
      errors.push(`[SPATIAL_COLLISION] Unrelated stars at sub-arcsecond coordinates (${distArcsec.toFixed(2)}"): [${s1.id}] "${s1.name}" <--> [${s2.id}] "${s2.name}"`);
    }
  }
}

// -----------------------------------------------------------------------------
// 4. Anti-Aggregation: Spectral Singularity Check
// -----------------------------------------------------------------------------
for (const s of stars) {
  const st = (s.spectralType || '').trim();
  if (!st) {
    errors.push(`[SPECTRAL_MISSING] [${s.id}] Missing spectralType`);
    continue;
  }

  // Prohibit binary plus operator (+ outside of Ia+ or 0+)
  const cleanSt = st.replace(/I[ab]?\+/g, '').replace(/0\+/g, '');
  if (cleanSt.includes('+')) {
    errors.push(`[SPECTRAL_COMPOSITE_PLUS] [${s.id}] "${s.name}" has composite plus in spectralType: "${st}"`);
  }

  // Prohibit ampersand
  if (st.includes('&')) {
    errors.push(`[SPECTRAL_COMPOSITE_AMP] [${s.id}] "${s.name}" has ampersand in spectralType: "${st}"`);
  }

  // Prohibit composite keywords
  if (/\b(comp|comb|composite)\b/i.test(st)) {
    errors.push(`[SPECTRAL_COMPOSITE_KEYWORD] [${s.id}] "${s.name}" has composite keyword in spectralType: "${st}"`);
  }

  // Slash prohibited unless sanctioned LBV transition: LBV / <O/B/A hypergiant>
  if (st.includes('/')) {
    const isSanctionedLbv = /^LBV\s*\/\s*[OBA][0-9](\.[0-9])?Ia\+?$/i.test(st);
    if (!isSanctionedLbv) {
      errors.push(`[SPECTRAL_COMPOSITE_SLASH] [${s.id}] "${s.name}" has unsanctioned composite slash in spectralType: "${st}"`);
    }
  }
}

// -----------------------------------------------------------------------------
// Final Report
// -----------------------------------------------------------------------------
if (errors.length > 0) {
  console.error(`\nFound ${errors.length} catalog integrity errors:`);
  for (const err of errors) {
    console.error(`  ERROR: ${err}`);
  }
  process.exit(1);
} else {
  console.log(`PASS: All ${stars.length} stars pass catalog nomenclature, anti-duplication, and anti-aggregation validation.`);
}
