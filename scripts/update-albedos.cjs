const fs = require('fs');
let catalogText = fs.readFileSync('src/data/solarSystemCatalog.ts', 'utf8');

const albedos = {
  'sol-hygiea': 0.07,
  'sol-pallas': 0.15,
  'sol-chaos': 0.05,
  'sol-varuna': 0.12,
  'sol-2002ms4': 0.05,
  'sol-gkunhomdima': 0.17,
  'sol-ixion': 0.14,
  'sol-varda': 0.10,
  'sol-salacia': 0.04,
  'sol-sedna': 0.32,
  'sol-orcus': 0.23,
  'sol-quaoar': 0.13,
  'sol-gonggong': 0.14,
  'sol-makemake': 0.81,
  'sol-haumea': 0.80,
  'sol-eris': 0.96
};

Object.entries(albedos).forEach(([id, albedo]) => {
  const target = "id: '" + id + "',";
  const pos = catalogText.indexOf(target);
  if (pos !== -1) {
    const themeIdx = catalogText.indexOf('textureTheme:', pos);
    if (themeIdx !== -1 && themeIdx - pos < 500) {
      const lineEnd = catalogText.indexOf('\n', themeIdx);
      catalogText = catalogText.slice(0, lineEnd + 1) + '    albedo: ' + albedo + ',\n' + catalogText.slice(lineEnd + 1);
    }
  }
});

fs.writeFileSync('src/data/solarSystemCatalog.ts', catalogText, 'utf8');
console.log('Successfully injected accurate albedos');
