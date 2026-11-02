const fs = require('fs');
const content = fs.readFileSync('src/data/solarSystemCatalog.ts', 'utf8');
const lines = content.split('\n');
const procedurals = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("textureSource: 'procedural'")) {
    const start = Math.max(0, i - 12);
    const end = Math.min(lines.length, i + 5);
    const chunk = lines.slice(start, end).join('\n');
    const idMatch = chunk.match(/id:\s*['"]([^'"]+)['"]/);
    const nameMatch = chunk.match(/name:\s*['"]([^'"]+)['"]/);
    const themeMatch = chunk.match(/textureTheme:\s*['"]([^'"]+)['"]/);
    procedurals.push({ id: idMatch ? idMatch[1] : '', name: nameMatch ? nameMatch[1] : '', theme: themeMatch ? themeMatch[1] : '' });
  }
}
console.log('Procedural bodies in Solar System:', JSON.stringify(procedurals, null, 2));
