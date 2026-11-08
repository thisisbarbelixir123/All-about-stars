import fs from 'fs';
import path from 'path';
import { StarData } from '../src/types';
import { ALL_88_CONSTELLATIONS } from '../src/data/constellationsData';

const DB_PATH = path.join(process.cwd(), 'src/data/starDatabase.json');
const stars: StarData[] = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const validConstNames = new Set(ALL_88_CONSTELLATIONS.map((c) => c.name));
const validAbbrs = new Set(ALL_88_CONSTELLATIONS.map((c) => c.abbreviation));
const constByName = new Map(ALL_88_CONSTELLATIONS.map((c) => [c.name.toLowerCase(), c]));
const constByGenitive = new Map(ALL_88_CONSTELLATIONS.map((c) => [c.genitive.toLowerCase(), c]));

console.log('=== STARPEDIA 3D CATALOG INTEGRITY VALIDATOR ===');
const errors: string[] = [];

for (const star of stars) {
  // 1. Constellation validation
  if (star.id !== 'sun' && !validConstNames.has(star.constellation)) {
    errors.push(`[${star.id}] Invalid constellation name: "${star.constellation}". Must match one of 88 IAU constellations.`);
  }

  // 2. Diacritics check
  if (star.name.includes('Bootis')) {
    errors.push(`[${star.id}] Uses non-canonical ASCII "Bootis" instead of diacritic "Boötis" in name.`);
  }
  if (star.name.includes('Velae')) {
    errors.push(`[${star.id}] Uses non-canonical genitive "Velae" instead of "Velorum" in name.`);
  }

  // 3. Bayer designation validation
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

if (errors.length > 0) {
  console.error(`\nFound ${errors.length} catalog validation errors:`);
  for (const err of errors) {
    console.error(`  ERROR: ${err}`);
  }
  process.exit(1);
} else {
  console.log(`PASS: All ${stars.length} stars pass catalog nomenclature validation.`);
}
