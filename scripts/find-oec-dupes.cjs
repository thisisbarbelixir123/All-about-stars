const fs = require('fs');
const path = require('path');

const catalog = JSON.parse(fs.readFileSync('src/data/exoplanetCatalog.json', 'utf8'));
const OEC_DIR = 'D:/project files/open_exoplanet_catalogue-master/open_exoplanet_catalogue-master/systems';
const files = fs.readdirSync(OEC_DIR).filter(f => f.endsWith('.xml'));

function normalize(s) {
  if (!s) return '';
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Build map: normalized alias -> group ID
const aliasToGroupId = new Map();
const groupDetails = new Map();

let groupId = 0;
for (const file of files) {
  const content = fs.readFileSync(path.join(OEC_DIR, file), 'utf8');
  const pBlocks = content.match(/<planet>([\s\S]*?)<\/planet>/g) || [];
  for (const pBlock of pBlocks) {
    const names = (pBlock.match(/<name>([^<]+)<\/name>/g) || []).map(x => x.replace(/<\/?name>/g, '').trim());
    if (names.length === 0) continue;

    // Disambiguate PSR 1257+12
    if (file === 'PSR 1257+12.xml') {
      if (names.includes('PSR 1257+12 A')) names.push('Draugr', 'PSR B1257+12 b');
      if (names.includes('PSR 1257+12 B')) names.push('Poltergeist', 'PSR B1257+12 c');
      if (names.includes('PSR 1257+12 C')) names.push('Phobetor', 'PSR B1257+12 d');
    }

    const gid = groupId++;
    groupDetails.set(gid, { primary: names[0], names });
    for (const n of names) {
      const norm = normalize(n);
      if (norm) {
        aliasToGroupId.set(norm, gid);
      }
    }
  }
}

console.log(`Indexed ${aliasToGroupId.size} aliases across ${groupDetails.size} OEC planet systems.`);

// Also extract aliases from planet names with parentheses, e.g. "Dimidium (51 Pegasi b)" -> "dimidium", "51pegasib"
function extractCatalogAliases(p) {
  const aliases = new Set();
  aliases.add(normalize(p.name));
  aliases.add(normalize(p.id.replace(/^exo-/, '')));
  const m = p.name.match(/^(.*?)\s*\((.*?)\)$/);
  if (m) {
    aliases.add(normalize(m[1]));
    aliases.add(normalize(m[2]));
  }
  return Array.from(aliases);
}

// Map: OEC groupId -> array of catalog planets matching it
const matchedGroups = new Map();
const unmatchedPlanets = [];

catalog.forEach((planet, idx) => {
  const aliases = extractCatalogAliases(planet);
  let matchedGid = undefined;
  for (const a of aliases) {
    if (aliasToGroupId.has(a)) {
      matchedGid = aliasToGroupId.get(a);
      break;
    }
  }

  if (matchedGid !== undefined) {
    if (!matchedGroups.has(matchedGid)) {
      matchedGroups.set(matchedGid, []);
    }
    matchedGroups.get(matchedGid).push(planet);
  } else {
    unmatchedPlanets.push(planet);
  }
});

console.log(`Catalog planets matched to OEC groups: ${catalog.length - unmatchedPlanets.length}`);
console.log(`Unmatched catalog planets: ${unmatchedPlanets.length}`);

// Find multi-matched groups (where 2 or more catalog entries match the SAME physical planet!)
const dupes = [];
for (const [gid, planets] of matchedGroups.entries()) {
  if (planets.length > 1) {
    const details = groupDetails.get(gid);
    dupes.push({
      primary: details.primary,
      planets: planets.map(p => ({ id: p.id, name: p.name, host: p.hostSystem, dia: p.diameterKm }))
    });
  }
}

console.log(`\n======================================================`);
console.log(`=== DUPLICATE EXOPLANETS FOUND VIA OEC ALIASES: ${dupes.length} ===`);
console.log(`======================================================`);
dupes.forEach(d => {
  console.log(`\nPhysical Planet: ${d.primary}`);
  d.planets.forEach(p => console.log(`  - ${p.name} (id: ${p.id}, dia: ${p.dia}km, host: ${p.host})`));
});
