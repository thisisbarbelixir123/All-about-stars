const fs = require('fs');

const solContent = fs.readFileSync('src/data/solarSystemCatalog.ts', 'utf8');
const nameMatches = solContent.match(/name:\s*['"]([^'"]+)['"]/g) || [];
const solNames = nameMatches.map(m => m.replace(/name:\s*['"]/, '').replace(/['"]/, '').trim());
console.log('Solar system body count:', solNames.length);

const catalog = JSON.parse(fs.readFileSync('src/data/exoplanetCatalog.json', 'utf8'));
const solSet = new Set(solNames.map(n => n.toLowerCase()));

const dupesInExo = catalog.filter(p => {
  return solSet.has(p.name.toLowerCase()) || 
         (p.hostSystem && (p.hostSystem.toLowerCase() === 'sun' || p.hostSystem.toLowerCase() === 'solar system'));
});

console.log('Found dupes in exoplanetCatalog.json (' + dupesInExo.length + '):');
dupesInExo.forEach(p => {
  console.log(`- ${p.name} (id: ${p.id}, host: ${p.hostSystem})`);
});
