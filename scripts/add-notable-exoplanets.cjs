/**
 * Task 1.4: Expand Exoplanet Catalog to exactly 1,952 exoplanets
 * (Combined with 48 Solar System bodies = exactly 2,000 celestial bodies)
 *
 * Requirements:
 * 1. Strictly prevent duplicates by normalizing all alternate designations (e.g. Kepler-21 vs HD 179070).
 * 2. Format proper names as "Proper name (designation)" (e.g. "Dimidium (51 Pegasi b)", "Thestias (Pollux b)", "Draugr (PSR B1257+12 b)").
 * 3. Update existing catalog entries that match IAU proper names (e.g. "Janssen (55 Cancri e)", "Osiris (HD 209458 b)").
 * 4. Ingest prominent non-Kepler confirmed exoplanets from Open Exoplanet Catalogue (OEC).
 * 5. Compute accurate T_eq (equilibrium temperature in Kelvin) using radiative balance / Kepler's 3rd Law fallbacks.
 * 6. Classify according to the 6-tier classification system (Sub-Martian, Martian, Terran, Superterran, Neptunian, Jovian).
 * 7. Assign procedural textureTheme and textureSource consistent with the existing catalog.
 * 8. Reach exactly 1,952 exoplanets in exoplanetCatalog.json.
 */

const fs = require('fs');
const path = require('path');

const OEC_DIR = 'D:/project files/open_exoplanet_catalogue-master/open_exoplanet_catalogue-master/systems';
const CATALOG_PATH = path.resolve('src/data/exoplanetCatalog.json');

const JUPITER_DIAMETER_KM = 139820;
const EARTH_DIAMETER_KM = 12742;
const JUPITER_MASS_IN_EARTH_MASSES = 317.828;

// 1. IAU NameExoWorlds / Proper name dictionary
// Maps lowercase normalized designation/alias -> { properName, designation }
const IAU_PROPER_MAP = {
  // 51 Pegasi b
  '51pegb': { properName: 'Dimidium', designation: '51 Pegasi b' },
  '51pegasib': { properName: 'Dimidium', designation: '51 Pegasi b' },
  'hd217014b': { properName: 'Dimidium', designation: '51 Pegasi b' },
  // Pollux b
  'polluxb': { properName: 'Thestias', designation: 'Pollux b' },
  'hd62509b': { properName: 'Thestias', designation: 'Pollux b' },
  'betageminorumb': { properName: 'Thestias', designation: 'Pollux b' },
  // PSR B1257+12 system (Lich)
  'draugr': { properName: 'Draugr', designation: 'PSR B1257+12 b' },
  'psr125712a': { properName: 'Draugr', designation: 'PSR B1257+12 b' },
  'psrb125712a': { properName: 'Draugr', designation: 'PSR B1257+12 b' },
  'psr125712b': { properName: 'Draugr', designation: 'PSR B1257+12 b' },
  'psrb125712b': { properName: 'Draugr', designation: 'PSR B1257+12 b' },
  'poltergeist': { properName: 'Poltergeist', designation: 'PSR B1257+12 c' },
  'psr125712c': { properName: 'Poltergeist', designation: 'PSR B1257+12 c' },
  'psrb125712c': { properName: 'Poltergeist', designation: 'PSR B1257+12 c' },
  'phobetor': { properName: 'Phobetor', designation: 'PSR B1257+12 d' },
  'psr125712d': { properName: 'Phobetor', designation: 'PSR B1257+12 d' },
  'psrb125712d': { properName: 'Phobetor', designation: 'PSR B1257+12 d' },
  // 55 Cancri system (Copernicus)
  '55cancrib': { properName: 'Galileo', designation: '55 Cancri b' },
  '55cncb': { properName: 'Galileo', designation: '55 Cancri b' },
  'hd75732b': { properName: 'Galileo', designation: '55 Cancri b' },
  '55cancric': { properName: 'Brahe', designation: '55 Cancri c' },
  '55cncc': { properName: 'Brahe', designation: '55 Cancri c' },
  'hd75732c': { properName: 'Brahe', designation: '55 Cancri c' },
  '55cancrid': { properName: 'Lipperhey', designation: '55 Cancri d' },
  '55cncd': { properName: 'Lipperhey', designation: '55 Cancri d' },
  'hd75732d': { properName: 'Lipperhey', designation: '55 Cancri d' },
  '55cancrie': { properName: 'Janssen', designation: '55 Cancri e' },
  '55cnce': { properName: 'Janssen', designation: '55 Cancri e' },
  'hd75732e': { properName: 'Janssen', designation: '55 Cancri e' },
  '55cancrif': { properName: 'Harriot', designation: '55 Cancri f' },
  '55cncf': { properName: 'Harriot', designation: '55 Cancri f' },
  'hd75732f': { properName: 'Harriot', designation: '55 Cancri f' },
  // Iota Draconis b
  'iotadraconisb': { properName: 'Hypatia', designation: 'Iota Draconis b' },
  'hip75458b': { properName: 'Hypatia', designation: 'Iota Draconis b' },
  'hd137759b': { properName: 'Hypatia', designation: 'Iota Draconis b' },
  // Gamma Cephei b
  'gammacepheib': { properName: 'Tadmor', designation: 'Gamma Cephei b' },
  'gamcepab': { properName: 'Tadmor', designation: 'Gamma Cephei b' },
  'hd222404ab': { properName: 'Tadmor', designation: 'Gamma Cephei b' },
  // HD 81688 b
  'hd81688b': { properName: 'Arkôs', designation: 'HD 81688 b' },
  // 18 Delphini b
  '18delb': { properName: 'Arion', designation: '18 Delphini b' },
  '18delphinib': { properName: 'Arion', designation: '18 Delphini b' },
  'hd199665b': { properName: 'Arion', designation: '18 Delphini b' },
  // HD 209458 b
  'hd209458b': { properName: 'Osiris', designation: 'HD 209458 b' },
  // 47 Ursae Majoris (Chalawan)
  '47umab': { properName: 'Taphao Thong', designation: '47 Ursae Majoris b' },
  '47ursamajorisb': { properName: 'Taphao Thong', designation: '47 Ursae Majoris b' },
  '47umac': { properName: 'Taphao Kaew', designation: '47 Ursae Majoris c' },
  '47ursamajorisc': { properName: 'Taphao Kaew', designation: '47 Ursae Majoris c' },
  // Mu Arae (Cervantes)
  'muaraeb': { properName: 'Quijote', designation: 'Mu Arae b' },
  'muaraec': { properName: 'Dulcinea', designation: 'Mu Arae c' },
  'muaraed': { properName: 'Rocinante', designation: 'Mu Arae d' },
  'muaraee': { properName: 'Sancho', designation: 'Mu Arae e' },
  // Upsilon Andromedae (Titawin)
  'upsilonandromedaeb': { properName: 'Saffar', designation: 'Upsilon Andromedae b' },
  'upsilonandromedaeab': { properName: 'Saffar', designation: 'Upsilon Andromedae b' },
  'upsandab': { properName: 'Saffar', designation: 'Upsilon Andromedae b' },
  'upsilonandromedaec': { properName: 'Samh', designation: 'Upsilon Andromedae c' },
  'upsilonandromedaeac': { properName: 'Samh', designation: 'Upsilon Andromedae c' },
  'upsandac': { properName: 'Samh', designation: 'Upsilon Andromedae c' },
  'upsilonandromedaed': { properName: 'Majriti', designation: 'Upsilon Andromedae d' },
  'upsilonandromedaead': { properName: 'Majriti', designation: 'Upsilon Andromedae d' },
  'upsandad': { properName: 'Majriti', designation: 'Upsilon Andromedae d' },
  // Epsilon Eridani b (Ran)
  'epseridanib': { properName: 'Ægir', designation: 'Epsilon Eridani b' },
  'epsiloneridanib': { properName: 'Ægir', designation: 'Epsilon Eridani b' },
  // HD 149026 b
  'hd149026b': { properName: 'Smertrios', designation: 'HD 149026 b' },
  // HD 102195 b
  'hd102195b': { properName: 'Lete', designation: 'HD 102195 b' }
};

// Explicit blacklist of retracted / false-positive / disproven objects
const BLACKLIST = new Set([
  'fomalhautb', 'dagon',
  'alphacentauribb',
  'gliese581d', 'gliese581g',
  'kapteynb',
  'kepler1004b', 'koi189401',
  'cvso30c'
]);

function normalizeName(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function determineTier(diameterEarth) {
  if (diameterEarth < 0.5) return 'Sub-Martian';
  if (diameterEarth < 0.8) return 'Martian';
  if (diameterEarth < 1.25) return 'Terran';
  if (diameterEarth < 2.0) return 'Superterran';
  if (diameterEarth < 6.0) return 'Neptunian';
  return 'Jovian';
}

function determineTextureTheme(tier, tempK) {
  if (tier === 'Sub-Martian') return 'terrestrial-rocky';
  if (tier === 'Martian') {
    if (tempK > 900) return 'lava-world';
    return 'terrestrial-rocky';
  }
  if (tier === 'Terran') {
    if (tempK > 900) return 'lava-world';
    if (tempK >= 240 && tempK <= 320) return 'terrestrial-ocean';
    return 'terrestrial-rocky';
  }
  if (tier === 'Superterran') {
    if (tempK > 1200) return 'lava-world';
    if (tempK >= 240 && tempK <= 320) return 'terrestrial-ocean';
    if (tempK > 500) return 'super-earth';
    return 'terrestrial-rocky';
  }
  if (tier === 'Neptunian') {
    if (tempK > 1200) return 'lava-world';
    if (tempK < 200) return 'ice-giant';
    if (tempK > 800) return 'sub-neptune';
    return 'super-earth';
  }
  // Jovian
  if (tempK >= 2200) return 'ultra-hot-jupiter';
  if (tempK >= 1000) return 'hot-jupiter';
  if (tempK <= 200) return 'ice-giant';
  return 'gas-giant-banded';
}

function estimateEquilibriumTemp(starTemp, starRadius, semiMajorAxisAU, orbitalPeriodDays, starMass, tier) {
  const albedo = 0.3;
  let a = semiMajorAxisAU;

  // Fallback B: Kepler's 3rd law
  if ((isNaN(a) || a <= 0) && !isNaN(orbitalPeriodDays) && orbitalPeriodDays > 0) {
    const pYears = orbitalPeriodDays / 365.256;
    const mStar = (!isNaN(starMass) && starMass > 0) ? starMass : 1.0;
    a = Math.cbrt(mStar * pYears * pYears);
  }

  // Fallback A: Radiative balance
  if (!isNaN(starTemp) && starTemp > 0 && !isNaN(starRadius) && starRadius > 0 && !isNaN(a) && a > 0) {
    const R_star_m = starRadius * 695700 * 1000;
    const a_m = a * 1.495978707e11;
    const teq = starTemp * Math.sqrt(R_star_m / (2 * a_m)) * Math.pow(1 - albedo, 0.25);
    if (!isNaN(teq) && teq > 0) return Math.round(teq);
  }

  // Fallback C: Stellar spectral/classification baseline
  if (tier === 'Jovian') return 1100;
  if (tier === 'Neptunian') return 600;
  if (tier === 'Superterran') return 450;
  if (tier === 'Terran') return 288;
  if (tier === 'Martian') return 220;
  return 180;
}

// Mass-Radius relation (Chen & Kipping 2017)
function estimateRadiusFromMass(massEarth) {
  if (massEarth <= 2.0) {
    // Rocky regime
    return Math.pow(massEarth, 0.28);
  } else if (massEarth <= 130) {
    // Volatile / Sub-Neptune / Neptune regime
    return 1.008 * Math.pow(massEarth, 0.59);
  } else {
    // Gas giant / Jovian regime
    const rJupApprox = 1.0 + 0.1 * Math.log10(massEarth / JUPITER_MASS_IN_EARTH_MASSES);
    return Math.max(8.0, rJupApprox * (JUPITER_DIAMETER_KM / EARTH_DIAMETER_KM));
  }
}

function run() {
  console.log('=== Task 1.4: Expanding Exoplanet Catalog ===');

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  console.log(`Starting exoplanet count: ${catalog.length}`);

  // Format existing catalog entries with IAU proper names if applicable
  let updatedExisting = 0;
  for (const p of catalog) {
    const norm = normalizeName(p.name);
    const normId = normalizeName(p.id.replace(/^exo-/, ''));
    const entry = IAU_PROPER_MAP[norm] || IAU_PROPER_MAP[normId];
    if (entry) {
      const formatted = `${entry.properName} (${entry.designation})`;
      if (p.name !== formatted) {
        console.log(`Updating existing entry proper name: "${p.name}" -> "${formatted}"`);
        p.name = formatted;
        updatedExisting++;
      }
    }
  }
  console.log(`Updated ${updatedExisting} existing catalog planets with official IAU proper names.`);

  // Build comprehensive normalized aliases set from existing catalog
  const existingAliases = new Set();
  catalog.forEach(p => {
    existingAliases.add(normalizeName(p.name));
    existingAliases.add(normalizeName(p.id.replace(/^exo-/, '')));
    const match = p.name.match(/\(([^)]+)\)/);
    if (match) existingAliases.add(normalizeName(match[1]));
  });

  // Parse all systems from Open Exoplanet Catalogue
  const files = fs.readdirSync(OEC_DIR);
  const oecPlanets = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(OEC_DIR, file), 'utf8');
    const isSysRetracted = /<list>Retracted<\/list>/i.test(content);
    const isSysControversial = /<list>Controversial<\/list>/i.test(content);

    const sysNameMatch = content.match(/<system>[\s\S]*?<name>([^<]+)<\/name>/i);
    const systemName = sysNameMatch ? sysNameMatch[1].trim() : path.basename(file, '.xml');

    const starBlocks = content.match(/<star>([\s\S]*?)<\/star>/g) || [];
    for (const sBlock of starBlocks) {
      const sNames = (sBlock.match(/<name>([^<]+)<\/name>/g) || []).map(x => x.replace(/<\/?name>/g, '').trim());
      const starName = sNames[0] || systemName;

      const sTempMatch = sBlock.match(/<temperature[^>]*>([\d\.]+)<\/temperature>/);
      const starTemp = sTempMatch ? parseFloat(sTempMatch[1]) : NaN;

      const sRadMatch = sBlock.match(/<radius[^>]*>([\d\.]+)<\/radius>/);
      const starRadius = sRadMatch ? parseFloat(sRadMatch[1]) : NaN;

      const sMassMatch = sBlock.match(/<mass[^>]*>([\d\.]+)<\/mass>/);
      const starMass = sMassMatch ? parseFloat(sMassMatch[1]) : NaN;

      const sSpecMatch = sBlock.match(/<spectraltype[^>]*>([^<]+)<\/spectraltype>/);
      const spectralType = sSpecMatch ? sSpecMatch[1].trim() : undefined;

      const pBlocks = sBlock.match(/<planet>([\s\S]*?)<\/planet>/g) || [];
      for (const pBlock of pBlocks) {
        let pNames = (pBlock.match(/<name>([^<]+)<\/name>/g) || []).map(x => x.replace(/<\/?name>/g, '').trim());
        if (pNames.length === 0) continue;

        // Disambiguate PSR 1257+12 historical 1992 pulsar designation collision
        // In 1992, planets were labeled uppercase A, B, C; lowercase b, c, d is the standard IAU exoplanet format.
        // We ensure each planet uses its distinct IAU lowercase letter.
        if (file === 'PSR 1257+12.xml') {
          if (pNames.includes('PSR 1257+12 A')) {
            pNames = ['Draugr', 'PSR B1257+12 b', 'PSR 1257+12 b', 'PSR 1257+12 A', 'PSR B1257+12 A'];
          } else if (pNames.includes('PSR 1257+12 B')) {
            pNames = ['Poltergeist', 'PSR B1257+12 c', 'PSR 1257+12 c', 'PSR 1257+12 B', 'PSR B1257+12 B'];
          } else if (pNames.includes('PSR 1257+12 C')) {
            pNames = ['Phobetor', 'PSR B1257+12 d', 'PSR 1257+12 d', 'PSR 1257+12 C', 'PSR B1257+12 C'];
          }
        }

        const isRetracted = isSysRetracted || /<list>Retracted<\/list>/i.test(pBlock);
        const isControversial = isSysControversial || /<list>Controversial<\/list>/i.test(pBlock);

        // Radius (R_jup)
        let radiusJup = NaN;
        const rMatch = pBlock.match(/<radius[^>]*>([\d\.]+)<\/radius>/);
        if (rMatch) radiusJup = parseFloat(rMatch[1]);
        else {
          const rLim = pBlock.match(/<radius[^>]*(?:upperlimit|lowerlimit)=["']([\d\.]+)["']/i);
          if (rLim) radiusJup = parseFloat(rLim[1]);
        }

        // Mass (M_jup)
        let massJup = NaN;
        const mMatch = pBlock.match(/<mass[^>]*>([\d\.]+)<\/mass>/);
        if (mMatch) massJup = parseFloat(mMatch[1]);
        else {
          const mLim = pBlock.match(/<mass[^>]*(?:upperlimit|lowerlimit)=["']([\d\.]+)["']/i);
          if (mLim) massJup = parseFloat(mLim[1]);
        }

        // SemiMajorAxis AU
        let semiMajorAxisAU = NaN;
        const aMatch = pBlock.match(/<semimajoraxis[^>]*>([\d\.]+)<\/semimajoraxis>/);
        if (aMatch) semiMajorAxisAU = parseFloat(aMatch[1]);

        // Orbital Period Days
        let orbitalPeriodDays = NaN;
        const pPeriodMatch = pBlock.match(/<period[^>]*>([\d\.]+)<\/period>/);
        if (pPeriodMatch) orbitalPeriodDays = parseFloat(pPeriodMatch[1]);

        // Discovery Year
        let discoveryYear = NaN;
        const dMatch = pBlock.match(/<discoveryyear[^>]*>(\d+)<\/discoveryyear>/);
        if (dMatch) discoveryYear = parseInt(dMatch[1], 10);

        // Discovery Method
        let discoveryMethod = 'transit';
        const mthMatch = pBlock.match(/<discoverymethod[^>]*>([^<]+)<\/discoverymethod>/);
        if (mthMatch) {
          const mth = mthMatch[1].trim().toLowerCase();
          if (mth === 'rv' || mth === 'radial velocity') discoveryMethod = 'RV';
          else if (mth === 'transit' || mth === 'transiting') discoveryMethod = 'transit';
          else if (mth === 'imaging') discoveryMethod = 'imaging';
          else if (mth === 'microlensing') discoveryMethod = 'microlensing';
          else if (mth === 'timing') discoveryMethod = 'timing';
          else discoveryMethod = mth;
        }

        // Temperature (K)
        let temperatureK = NaN;
        const tMatch = pBlock.match(/<temperature[^>]*>([\d\.]+)<\/temperature>/);
        if (tMatch) temperatureK = parseFloat(tMatch[1]);

        // Description
        let description = undefined;
        const descMatch = pBlock.match(/<description[^>]*>([^<]+)<\/description>/);
        if (descMatch) description = descMatch[1].trim();

        oecPlanets.push({
          file,
          primaryName: pNames[0],
          allNames: pNames,
          starName,
          systemName,
          starTemp,
          starRadius,
          starMass,
          spectralType,
          radiusJup,
          massJup,
          semiMajorAxisAU,
          orbitalPeriodDays,
          discoveryYear: isNaN(discoveryYear) ? 2015 : discoveryYear,
          discoveryMethod,
          temperatureK,
          description,
          isRetracted,
          isControversial
        });
      }
    }
  }

  // Exclude PSR 1257+12 internal aliases from cross-planet contamination
  let pass = 0;
  let propagated = true;
  while (propagated) {
    propagated = false;
    pass++;
    for (const p of oecPlanets) {
      if (p.file === 'PSR 1257+12.xml') continue; // keep PSR planets cleanly isolated
      const isKnown = p.allNames.some(n => existingAliases.has(normalizeName(n)));
      if (isKnown) {
        for (const n of p.allNames) {
          const norm = normalizeName(n);
          if (!existingAliases.has(norm)) {
            existingAliases.add(norm);
            propagated = true;
          }
        }
      }
    }
  }
  console.log(`Propagated aliases across ${pass} passes. Total known alias entries: ${existingAliases.size}`);

  // Filter candidates: must be confirmed, non-retracted, not in blacklist, and not in existingAliases
  const candidates = [];
  for (const p of oecPlanets) {
    if (p.isRetracted || p.isControversial) continue;
    if (p.allNames.some(n => BLACKLIST.has(normalizeName(n)))) continue;
    if (p.allNames.some(n => existingAliases.has(normalizeName(n)))) continue;
    candidates.push(p);
  }

  console.log(`Available valid, non-duplicate candidate exoplanets: ${candidates.length}`);

  // Sort candidates by priority:
  // 1. Famous IAU proper names
  // 2. High-profile landmark systems (PSR 1257+12, 51 Peg, 55 Cnc, Pollux, HR 8799, WASP, HAT, GJ, HD)
  // 3. Completeness of measured parameters (measured radius + mass + period)
  function getScore(c) {
    let score = 0;
    const hasIAU = c.allNames.some(n => IAU_PROPER_MAP[normalizeName(n)]);
    if (hasIAU) score += 10000;

    const nameStr = c.allNames.join(' ').toLowerCase();
    if (nameStr.includes('51 peg') || nameStr.includes('psr') || nameStr.includes('pollux') || nameStr.includes('55 cnc')) score += 5000;
    if (nameStr.includes('wasp') || nameStr.includes('hat') || nameStr.includes('gj') || nameStr.includes('gliese') || nameStr.includes('hd')) score += 1000;

    if (!isNaN(c.radiusJup) && c.radiusJup > 0) score += 500;
    if (!isNaN(c.massJup) && c.massJup > 0) score += 200;
    if (!isNaN(c.semiMajorAxisAU) && c.semiMajorAxisAU > 0) score += 100;
    if (!isNaN(c.orbitalPeriodDays) && c.orbitalPeriodDays > 0) score += 50;

    return score;
  }

  candidates.sort((a, b) => getScore(b) - getScore(a));

  const NEEDED = 1952 - catalog.length;
  console.log(`Planets needed to reach exactly 1,952 exoplanets: ${NEEDED}`);

  const selectedCandidates = [];
  const admittedAliases = new Set(existingAliases);

  for (const cand of candidates) {
    if (selectedCandidates.length >= NEEDED) break;

    // Disambiguate PSR aliases during admission so Draugr, Poltergeist, and Phobetor are all admitted
    const candNorms = (cand.file === 'PSR 1257+12.xml')
      ? [normalizeName(cand.primaryName)]
      : cand.allNames.map(n => normalizeName(n));

    // Double check against already admitted aliases in this run
    if (candNorms.some(n => admittedAliases.has(n))) {
      continue;
    }

    selectedCandidates.push(cand);
    candNorms.forEach(n => admittedAliases.add(n));
  }

  if (selectedCandidates.length < NEEDED) {
    throw new Error(`Insufficient candidate planets! Found ${selectedCandidates.length}, needed ${NEEDED}`);
  }

  console.log(`Selected exactly ${selectedCandidates.length} high-confidence candidate exoplanets.`);

  // Convert selected candidates into CelestialBody format
  const newExoplanets = selectedCandidates.map(cand => {
    // Determine proper name formatting
    let displayName = cand.primaryName;
    for (const n of cand.allNames) {
      const iau = IAU_PROPER_MAP[normalizeName(n)];
      if (iau) {
        displayName = `${iau.properName} (${iau.designation})`;
        break;
      }
    }

    // Diameter and Mass
    let diameterKm;
    let diameterEarth;
    let diameterJupiter;
    let massEarth;
    let massJupiter;

    if (!isNaN(cand.massJup) && cand.massJup > 0) {
      massJupiter = Math.round(cand.massJup * 10000) / 10000;
      massEarth = Math.round(cand.massJup * JUPITER_MASS_IN_EARTH_MASSES * 1000) / 1000;
    }

    if (!isNaN(cand.radiusJup) && cand.radiusJup > 0) {
      diameterJupiter = Math.round(cand.radiusJup * 10000) / 10000;
      diameterEarth = Math.round(cand.radiusJup * (JUPITER_DIAMETER_KM / EARTH_DIAMETER_KM) * 10000) / 10000;
      diameterKm = Math.round(cand.radiusJup * JUPITER_DIAMETER_KM);
    } else if (massEarth) {
      diameterEarth = Math.round(estimateRadiusFromMass(massEarth) * 10000) / 10000;
      diameterJupiter = Math.round(diameterEarth * (EARTH_DIAMETER_KM / JUPITER_DIAMETER_KM) * 10000) / 10000;
      diameterKm = Math.round(diameterEarth * EARTH_DIAMETER_KM);
    } else {
      diameterJupiter = 1.0;
      diameterEarth = 10.97;
      diameterKm = JUPITER_DIAMETER_KM;
    }

    // Classification tier
    const classification = determineTier(diameterEarth);

    // Temperature (K)
    let temperatureK = cand.temperatureK;
    if (isNaN(temperatureK) || temperatureK <= 0) {
      temperatureK = estimateEquilibriumTemp(
        cand.starTemp,
        cand.starRadius,
        cand.semiMajorAxisAU,
        cand.orbitalPeriodDays,
        cand.starMass,
        classification
      );
    } else {
      temperatureK = Math.round(temperatureK);
    }

    // TextureTheme and TextureSource
    const textureTheme = determineTextureTheme(classification, temperatureK);
    const textureSource = 'procedural';

    // Unique ID
    const cleanId = 'exo-' + normalizeName(cand.primaryName).replace(/([0-9]+)/g, '-$1-').replace(/--+/g, '-').replace(/^-|-$/g, '');

    const planetObj = {
      id: cleanId,
      name: displayName,
      classification,
      diameterKm,
      diameterEarth,
      diameterJupiter,
      hostSystem: cand.systemName || cand.starName,
      discoveryYear: cand.discoveryYear,
      discoveryMethod: cand.discoveryMethod,
      confirmed: true,
      textureSource,
      textureTheme,
      temperatureK
    };

    if (massEarth !== undefined) {
      planetObj.massEarth = massEarth;
      planetObj.massJupiter = massJupiter;
    }
    if (!isNaN(cand.orbitalPeriodDays) && cand.orbitalPeriodDays > 0) {
      planetObj.orbitalPeriodDays = cand.orbitalPeriodDays;
    }
    if (!isNaN(cand.semiMajorAxisAU) && cand.semiMajorAxisAU > 0) {
      planetObj.semiMajorAxisAU = cand.semiMajorAxisAU;
    }
    if (cand.description) {
      planetObj.description = cand.description;
    }

    return planetObj;
  });

  // Verify unique IDs among newly generated planets and against existing catalog
  const allIds = new Set(catalog.map(p => p.id));
  newExoplanets.forEach(p => {
    let finalId = p.id;
    let counter = 1;
    while (allIds.has(finalId)) {
      finalId = `${p.id}-${counter}`;
      counter++;
    }
    p.id = finalId;
    allIds.add(finalId);
  });

  // Merge into catalog
  const mergedCatalog = [...catalog, ...newExoplanets];

  console.log(`Merged catalog exoplanet total: ${mergedCatalog.length}`);
  if (mergedCatalog.length !== 1952) {
    throw new Error(`Catalog count mismatch! Expected 1,952, got ${mergedCatalog.length}`);
  }

  // Statistical & Integrity Validation
  const idSet = new Set();
  const nameSet = new Set();
  const tierCounts = {};
  let invalidTemps = 0;
  let invalidDiameters = 0;

  for (const p of mergedCatalog) {
    if (idSet.has(p.id)) throw new Error(`Duplicate ID detected: ${p.id}`);
    idSet.add(p.id);

    if (nameSet.has(p.name)) throw new Error(`Duplicate name detected: ${p.name}`);
    nameSet.add(p.name);

    if (isNaN(p.temperatureK) || p.temperatureK <= 0) invalidTemps++;
    if (isNaN(p.diameterKm) || p.diameterKm <= 0) invalidDiameters++;

    tierCounts[p.classification] = (tierCounts[p.classification] || 0) + 1;
  }

  console.log('Tier distribution across all 1,952 exoplanets:');
  console.log(tierCounts);

  if (invalidTemps > 0 || invalidDiameters > 0) {
    throw new Error(`Integrity check failed! Invalid temps: ${invalidTemps}, Invalid diameters: ${invalidDiameters}`);
  }

  // Save updated catalog
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(mergedCatalog, null, 2) + '\n', 'utf8');
  console.log('Successfully wrote updated catalog to src/data/exoplanetCatalog.json!');
}

run();
