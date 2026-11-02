const fs = require('fs');
const solContent = fs.readFileSync('src/data/solarSystemCatalog.ts', 'utf8');

const idMatches = solContent.match(/id:\s*'([^']+)'/g) || [];
const ids = idMatches.map(m => m.replace(/id:\s*'/, '').replace(/'/, '').trim());
console.log('Total Solar System IDs:', ids.length);
console.log(ids);
