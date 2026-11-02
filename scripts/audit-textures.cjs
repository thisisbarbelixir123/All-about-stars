const fs = require('fs');
const content = fs.readFileSync('./src/data/solarSystemCatalog.ts', 'utf8');
const blocks = content.split(/\{\s*id:\s*'/).slice(1);
const result = [];
for (const b of blocks) {
  const id = b.split("'", 1)[0];
  const nameMatch = b.match(/name:\s*'([^']+)'/);
  const sourceMatch = b.match(/textureSource:\s*'([^']+)'/);
  const pathMatch = b.match(/texturePath:\s*'([^']+)'/);
  const themeMatch = b.match(/textureTheme:\s*'([^']+)'/);
  result.push({
    id,
    name: nameMatch ? nameMatch[1] : null,
    source: sourceMatch ? sourceMatch[1] : null,
    path: pathMatch ? pathMatch[1] : null,
    theme: themeMatch ? themeMatch[1] : null
  });
}

for (const item of result) {
  let fileExists = false;
  if (item.path) {
    fileExists = fs.existsSync('./public' + item.path);
  }
  console.log(`${item.id.padEnd(18)} | ${item.name.padEnd(16)} | source: ${(item.source || '').padEnd(10)} | path: ${(item.path || 'none').padEnd(30)} | exists: ${fileExists} | theme: ${item.theme || 'none'}`);
}
