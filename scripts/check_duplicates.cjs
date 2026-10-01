const fs = require('fs');

// We can check with a node script that imports or parses the star ids
const part1 = require('./create_stars_a_to_l.cjs');
const part2 = require('./data_part1_cetus_to_indus.cjs');
const part3 = require('./data_part2_m_to_p.cjs');
const part4 = require('./data_part3_p_to_z.cjs');

const allNew = [...part1, ...part2, ...part3, ...part4];
console.log('Total new stars:', allNew.length);

const ids = new Set();
const dups = [];
for (const s of allNew) {
  if (ids.has(s.id)) {
    dups.push(s.id);
  }
  ids.add(s.id);
}

console.log('Duplicates within new stars:', dups);
