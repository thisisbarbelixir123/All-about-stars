const fs = require('fs');

const solContent = fs.readFileSync('src/data/solarSystemCatalog.ts', 'utf8');
const nameMatches = solContent.match(/name:\s*['"]([^'"]+)['"]/g) || [];
const solNames = nameMatches.map(m => m.replace(/name:\s*['"]/, '').replace(/['"]/, '').trim());

const catalog = JSON.parse(fs.readFileSync('src/data/exoplanetCatalog.json', 'utf8'));

// Check for any duplicate names across solar system and exoplanet catalog
const seen = new Map();
const duplicates = [];

solNames.forEach(name => {
  seen.set(name.toLowerCase(), 'SolarSystem');
});

catalog.forEach(p => {
  const lower = p.name.toLowerCase();
  if (seen.has(lower)) {
    duplicates.push({ name: p.name, id: p.id, firstSource: seen.get(lower) });
  } else {
    seen.set(lower, p.id);
  }
});

console.log(`Total duplicates found: ${duplicates.length}`);
duplicates.forEach(d => console.log(`- ${d.name} (${d.id}) vs ${d.firstSource}`));
