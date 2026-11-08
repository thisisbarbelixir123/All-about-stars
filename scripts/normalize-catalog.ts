import fs from 'fs';
import path from 'path';
import { StarData } from '../src/types';
import { normalizeCatalogStar } from '../src/utils/starDesignationUtils';

const DB_PATH = path.join(process.cwd(), 'src/data/starDatabase.json');

console.log('=== STARPEDIA 3D CATALOG NORMALIZER ===');
console.log(`Reading: ${DB_PATH}`);

const rawJson = fs.readFileSync(DB_PATH, 'utf8');
const stars: StarData[] = JSON.parse(rawJson);

let modifiedCount = 0;
const changeLog: Array<{ id: string; field: string; from: any; to: any }> = [];

const normalizedStars = stars.map((star) => {
  const norm = normalizeCatalogStar(star);

  if (norm.constellation !== star.constellation) {
    changeLog.push({ id: star.id, field: 'constellation', from: star.constellation, to: norm.constellation });
  }
  if (norm.name !== star.name) {
    changeLog.push({ id: star.id, field: 'name', from: star.name, to: norm.name });
  }
  if (norm.bayerDesignation !== star.bayerDesignation) {
    changeLog.push({ id: star.id, field: 'bayerDesignation', from: star.bayerDesignation, to: norm.bayerDesignation });
  }
  if (JSON.stringify(norm.alternateNames) !== JSON.stringify(star.alternateNames)) {
    changeLog.push({ id: star.id, field: 'alternateNames', from: star.alternateNames, to: norm.alternateNames });
  }
  if (JSON.stringify(norm.designations) !== JSON.stringify(star.designations)) {
    changeLog.push({ id: star.id, field: 'designations', from: star.designations, to: norm.designations });
  }

  if (norm !== star) {
    modifiedCount++;
  }
  return norm;
});

if (changeLog.length > 0) {
  console.log(`\nDetected ${changeLog.length} normalizations across ${modifiedCount} stars:`);
  for (const c of changeLog) {
    console.log(`  [${c.id}] ${c.field}: "${c.from}" -> "${c.to}"`);
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(normalizedStars, null, 2) + '\n', 'utf8');
  console.log(`\nSuccessfully updated ${DB_PATH}.`);
} else {
  console.log(`\nAll ${stars.length} stars in the catalog are already 100% canonical.`);
}
