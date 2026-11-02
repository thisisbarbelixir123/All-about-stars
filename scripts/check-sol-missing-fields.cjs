const fs = require('fs');
const solContent = fs.readFileSync('src/data/solarSystemCatalog.ts', 'utf8');

const regex = /{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'([\s\S]*?)\n\s*},/g;
let match;
const report = [];

while ((match = regex.exec(solContent)) !== null) {
  const id = match[1];
  const name = match[2];
  const bodyText = match[3];

  const hasMass = bodyText.includes('massEarth');
  const hasPeriod = bodyText.includes('orbitalPeriodDays');
  const hasAxis = bodyText.includes('semiMajorAxisAU');
  const hasAlbedo = bodyText.includes('albedo:');

  report.push({ id, name, hasMass, hasPeriod, hasAxis, hasAlbedo });
}

console.log('Total parsed bodies:', report.length);
console.log('Bodies with mass:', report.filter(r => r.hasMass).length);
console.log('Bodies with period:', report.filter(r => r.hasPeriod).length);
console.log('Bodies with semiMajorAxis:', report.filter(r => r.hasAxis).length);
console.log('Bodies with albedo:', report.filter(r => r.hasAlbedo).length);

console.log('\nSample bodies missing mass & period:');
console.log(report.filter(r => !r.hasMass || !r.hasPeriod).slice(0, 10).map(r => r.name));
