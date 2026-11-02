const fs = require('fs');
const path = require('path');

const catalog = JSON.parse(fs.readFileSync('src/data/exoplanetCatalog.json', 'utf8'));

// Check for any duplicate or overlapping names or IDs within exoplanetCatalog.json
const seenId = new Map();
const dupesId = [];

catalog.forEach((p, idx) => {
  if (seenId.has(p.id)) {
    dupesId.push({ id: p.id, p1: seenId.get(p.id), p2: p });
  } else {
    seenId.set(p.id, p);
  }
});

console.log(`Duplicate IDs in exoplanetCatalog: ${dupesId.length}`);

// Check for identical host + semiMajorAxis (within 0.0001 AU)
const hostAxisMap = new Map();
const dupeAxis = [];

catalog.forEach(p => {
  if (p.semiMajorAxisAU && p.semiMajorAxisAU > 0) {
    const hostNorm = p.hostSystem.toLowerCase().replace(/[^a-z0-9]/g, '');
    const axisKey = p.semiMajorAxisAU.toFixed(3);
    const key = `${hostNorm}_${axisKey}`;
    if (!hostAxisMap.has(key)) {
      hostAxisMap.set(key, []);
    }
    hostAxisMap.get(key).push(p);
  }
});

for (const [key, list] of hostAxisMap.entries()) {
  if (list.length > 1) {
    console.log(`Matching Host + SemiMajorAxis: ${key}`);
    list.forEach(p => console.log(`  - ${p.name} (${p.id}, a=${p.semiMajorAxisAU}, P=${p.orbitalPeriodDays}, dia=${p.diameterKm})`));
  }
}
