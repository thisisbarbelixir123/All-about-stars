const fs = require('fs');
const content = fs.readFileSync('./src/data/solarSystemCatalog.ts', 'utf8');
const blocks = content.split(/\{\s*id:\s*'/).slice(1);
const list = blocks.map(b => {
  const id = b.split("'", 1)[0];
  const nameMatch = b.match(/name:\s*'([^']+)'/);
  const sourceMatch = b.match(/textureSource:\s*'([^']+)'/);
  const pathMatch = b.match(/texturePath:\s*'([^']+)'/);
  const themeMatch = b.match(/textureTheme:\s*'([^']+)'/);
  return {
    id,
    name: nameMatch ? nameMatch[1] : null,
    source: sourceMatch ? sourceMatch[1] : null,
    path: pathMatch ? pathMatch[1] : null,
    theme: themeMatch ? themeMatch[1] : null
  };
});
console.log('Total bodies:', list.length);
console.log(JSON.stringify(list, null, 2));
