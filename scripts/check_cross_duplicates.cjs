const fs = require('fs');

const part1 = require('./create_stars_a_to_l.cjs');
const part2 = require('./data_part1_cetus_to_indus.cjs');
const part3 = require('./data_part2_m_to_p.cjs');
const part4 = require('./data_part3_p_to_z.cjs');
const allNew = [...part1, ...part2, ...part3, ...part4];
const newIds = new Set(allNew.map(s => s.id));

// Check all existing files in src/data/
const dataDir = 'src/data/';
const files = fs.readdirSync(dataDir).filter(f => f.startsWith('stars') && f.endsWith('.ts') && !f.includes('Remaining'));

const existingIds = new Set();
for (const file of files) {
  const content = fs.readFileSync(dataDir + file, 'utf-8');
  const matches = content.matchAll(/id:\s*['"]([^'"]+)['"]/g);
  for (const m of matches) {
    existingIds.add(m[1]);
  }
}

console.log(`Found ${existingIds.size} existing IDs.`);
const conflicts = [];
for (const id of newIds) {
  if (existingIds.has(id)) {
    conflicts.push(id);
  }
}

console.log('Conflicting IDs between new and existing:', conflicts);
