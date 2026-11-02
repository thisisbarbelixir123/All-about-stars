const fs = require('fs');
const path = require('path');

const catalog = JSON.parse(fs.readFileSync('src/data/exoplanetCatalog.json', 'utf8'));
const OEC_DIR = 'D:/project files/open_exoplanet_catalogue-master/open_exoplanet_catalogue-master/systems';
const files = fs.readdirSync(OEC_DIR).filter(f => f.endsWith('.xml'));

// Also check systems_kepler directory in OEC!
const KEPLER_DIR = 'D:/project files/open_exoplanet_catalogue-master/open_exoplanet_catalogue-master/systems_kepler';
let keplerFiles = [];
if (fs.existsSync(KEPLER_DIR)) {
  keplerFiles = fs.readdirSync(KEPLER_DIR).filter(f => f.endsWith('.xml'));
}

console.log(`Checking ${files.length} regular systems and ${keplerFiles.length} kepler systems...`);

// Cross-match period, semi-major axis, and radius
const periodMap = new Map();
const potentialPhysicsDupes = [];

catalog.forEach((p, i) => {
  if (p.orbitalPeriodDays && p.orbitalPeriodDays > 0) {
    // Round period to 4 significant digits
    const key = p.orbitalPeriodDays.toPrecision(4);
    if (!periodMap.has(key)) periodMap.set(key, []);
    periodMap.get(key).push(p);
  }
});

for (const [key, list] of periodMap.entries()) {
  if (list.length > 1) {
    // Check if they also share similar diameterKm (within 5%) or similar host
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const p1 = list[i];
        const p2 = list[j];
        const diaRatio = Math.max(p1.diameterKm, p2.diameterKm) / Math.min(p1.diameterKm, p2.diameterKm);
        const host1 = p1.hostSystem.toLowerCase().replace(/[^a-z0-9]/g, '');
        const host2 = p2.hostSystem.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // If diameter is within 5% and period is nearly identical, or hosts are similar
        if (diaRatio < 1.05 || host1 === host2 || (p1.semiMajorAxisAU && p2.semiMajorAxisAU && Math.abs(p1.semiMajorAxisAU - p2.semiMajorAxisAU) < 0.001)) {
          potentialPhysicsDupes.push({ p1, p2, reason: `Period ${p1.orbitalPeriodDays} vs ${p2.orbitalPeriodDays}, Dia ${p1.diameterKm} vs ${p2.diameterKm}, Host ${p1.hostSystem} vs ${p2.hostSystem}` });
        }
      }
    }
  }
}

console.log(`\nPotential Physical Duplicates found: ${potentialPhysicsDupes.length}`);
potentialPhysicsDupes.forEach(d => {
  console.log(`- "${d.p1.name}" (${d.p1.id}) vs "${d.p2.name}" (${d.p2.id}) -> ${d.reason}`);
});
