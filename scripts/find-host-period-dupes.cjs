const fs = require('fs');
const path = require('path');

const catalog = JSON.parse(fs.readFileSync('src/data/exoplanetCatalog.json', 'utf8'));
const OEC_DIR = 'D:/project files/open_exoplanet_catalogue-master/open_exoplanet_catalogue-master/systems';

function norm(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Map each planet in catalog to its entry
console.log(`Analyzing ${catalog.length} planets...`);

// Check for duplicate host + period
const hostPeriodMap = new Map();
const duplicates = [];

catalog.forEach(p => {
  // Extract base host name (strip A, B binary suffixes if attached)
  const baseHost = norm(p.hostSystem.replace(/\s+[A-Z]$/, ''));
  // Period rounded to 2 decimal places
  const period = p.orbitalPeriodDays ? p.orbitalPeriodDays.toFixed(2) : 'null';
  const key = `${baseHost}_${period}`;
  
  if (period !== 'null') {
    if (!hostPeriodMap.has(key)) {
      hostPeriodMap.set(key, []);
    }
    hostPeriodMap.get(key).push(p);
  }
});

for (const [key, list] of hostPeriodMap.entries()) {
  if (list.length > 1) {
    console.log(`\nDuplicate key: ${key}`);
    list.forEach(p => console.log(`  - ${p.name} (id: ${p.id}, dia: ${p.diameterKm}km, period: ${p.orbitalPeriodDays})`));
  }
}
