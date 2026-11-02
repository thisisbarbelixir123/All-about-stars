const fs = require('fs');
const solContent = fs.readFileSync('src/data/solarSystemCatalog.ts', 'utf8');

const bodies = ['Mercury', 'Venus', 'Earth', 'The Moon', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Ceres'];
bodies.forEach(b => {
  const regex = new RegExp(`id:\\s*'([^']+)',\\s*name:\\s*'${b}'[\\s\\S]*?\\n  \\},`);
  const match = solContent.match(regex);
  if (match) {
    console.log(`=== ${b} ===\n${match[0]}\n`);
  }
});
