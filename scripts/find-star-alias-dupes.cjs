const fs = require('fs');
const path = require('path');

const catalog = JSON.parse(fs.readFileSync('src/data/exoplanetCatalog.json', 'utf8'));
const OEC_DIR = 'D:/project files/open_exoplanet_catalogue-master/open_exoplanet_catalogue-master/systems';
const files = fs.readdirSync(OEC_DIR).filter(f => f.endsWith('.xml'));

function norm(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Map each star alias -> starId
const aliasToStarId = new Map();
let starIdCounter = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(OEC_DIR, file), 'utf8');
  const starBlocks = content.match(/<star>([\s\S]*?)<\/star>/g) || [];
  for (const sBlock of starBlocks) {
    const sNames = (sBlock.match(/<name>([^<]+)<\/name>/g) || []).map(x => x.replace(/<\/?name>/g, '').trim());
    if (sNames.length === 0) continue;
    
    const sid = starIdCounter++;
    for (const n of sNames) {
      aliasToStarId.set(norm(n), sid);
    }
  }
}

console.log(`Indexed ${aliasToStarId.size} star aliases across ${starIdCounter} stars.`);

// Now map every planet in catalog to (starId, period)
const starPeriodMap = new Map();
const dupePairs = [];

catalog.forEach((p, idx) => {
  const hostNorm = norm(p.hostSystem);
  const sid = aliasToStarId.get(hostNorm);
  if (sid !== undefined && p.orbitalPeriodDays && p.orbitalPeriodDays > 0) {
    const periodKey = p.orbitalPeriodDays.toFixed(2);
    const key = `${sid}_${periodKey}`;
    if (!starPeriodMap.has(key)) {
      starPeriodMap.set(key, []);
    }
    starPeriodMap.get(key).push(p);
  }
});

for (const [key, list] of starPeriodMap.entries()) {
  if (list.length > 1) {
    console.log(`\nDuplicate Star+Period match (${key}):`);
    list.forEach(p => console.log(`  - ${p.name} (id: ${p.id}, host: ${p.hostSystem}, dia: ${p.diameterKm}km, period: ${p.orbitalPeriodDays})`));
  }
}
