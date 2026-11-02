const fs = require('fs');
const path = require('path');

const catalog = JSON.parse(fs.readFileSync('src/data/exoplanetCatalog.json', 'utf8'));

// Find all KOI planets in catalog
const koiPlanets = catalog.filter(p => p.name.startsWith('KOI-'));
console.log(`Total KOI planets in catalog: ${koiPlanets.length}`);

// Check OEC files for Kepler <-> KOI mappings
const OEC_DIR = 'D:/project files/open_exoplanet_catalogue-master/open_exoplanet_catalogue-master/systems';
const KEPLER_DIR = 'D:/project files/open_exoplanet_catalogue-master/open_exoplanet_catalogue-master/systems_kepler';

const allDirs = [OEC_DIR];
if (fs.existsSync(KEPLER_DIR)) allDirs.push(KEPLER_DIR);

const koiToKeplerMap = new Map();

for (const dir of allDirs) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.xml'));
  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const pBlocks = content.match(/<planet>([\s\S]*?)<\/planet>/g) || [];
    for (const pBlock of pBlocks) {
      const names = (pBlock.match(/<name>([^<]+)<\/name>/g) || []).map(x => x.replace(/<\/?name>/g, '').trim());
      const keplerName = names.find(n => /^Kepler-\d+\s+[a-z]$/i.test(n));
      const koiNames = names.filter(n => /^KOI-[\d\.]+$/i.test(n));

      if (keplerName && koiNames.length > 0) {
        for (const koi of koiNames) {
          // Normalize KOI (e.g. KOI-001.01 -> KOI-1.01 or KOI-1 b)
          koiToKeplerMap.set(koi.toLowerCase().replace(/[^a-z0-9]/g, ''), keplerName);
        }
      }
    }
  }
}

console.log(`Indexed ${koiToKeplerMap.size} KOI -> Kepler mappings.`);

const koiDupesInCatalog = [];
for (const kp of koiPlanets) {
  const normKoi = kp.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const keplerEquivalent = koiToKeplerMap.get(normKoi);
  if (keplerEquivalent) {
    // Check if the Kepler equivalent is ALSO in the catalog!
    const keplerInCatalog = catalog.find(p => p.name.toLowerCase() === keplerEquivalent.toLowerCase());
    if (keplerInCatalog) {
      koiDupesInCatalog.push({
        koi: kp.name,
        koiId: kp.id,
        kepler: keplerInCatalog.name,
        keplerId: keplerInCatalog.id
      });
    }
  }
}

console.log(`\nKOI vs Kepler duplicates found: ${koiDupesInCatalog.length}`);
koiDupesInCatalog.forEach(d => {
  console.log(`- ${d.koi} (${d.koiId}) IS ACTUALLY ${d.kepler} (${d.keplerId})`);
});
