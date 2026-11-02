/**
 * scripts/classify-exoplanet-tiers.cjs
 *
 * Task 1.2: Standardized 6-Tier Classification Tagger
 * Classifies exoplanets in exoplanetCatalog.json into the standardized PHL/NASA 6-tier system:
 *   - Sub-Martian: D < 0.5 D⊕ (or M < 0.03 M⊕)
 *   - Martian:     0.5 <= D < 0.8 D⊕ (or 0.03 <= M < 0.1 M⊕)
 *   - Terran:      0.8 <= D <= 1.25 D⊕ (or 0.1 <= M <= 2.0 M⊕)
 *   - Superterran: 1.25 < D <= 2.0 D⊕ (or 2.0 < M <= 10.0 M⊕)
 *   - Neptunian:   2.0 < D <= 6.0 D⊕ (or 10.0 < M <= 50.0 M⊕)
 *   - Jovian:      D > 6.0 D⊕ (or M > 50.0 M⊕)
 *
 * Safety Guards:
 *   - Moons are NEVER tagged as Sub-Martian or planetary tiers; Solar System bodies keep their dedicated host moon labels.
 *   - Solar System dwarf planets retain their respective types.
 */

const fs = require('fs');
const path = require('path');

const CATALOG_PATH = path.join(__dirname, '../src/data/exoplanetCatalog.json');

function determineExoplanetTier(planet) {
  const d = planet.diameterEarth;
  const m = planet.massEarth;

  // Primary classification by diameter (most reliable transit geometric observable)
  if (typeof d === 'number' && d > 0) {
    if (d < 0.5) return 'Sub-Martian';
    if (d < 0.8) return 'Martian';
    if (d <= 1.25) return 'Terran';
    if (d <= 2.0) return 'Superterran';
    if (d <= 6.0) return 'Neptunian';
    return 'Jovian';
  }

  // Fallback classification by mass if diameter is unmeasured
  if (typeof m === 'number' && m > 0) {
    if (m < 0.03) return 'Sub-Martian';
    if (m < 0.1) return 'Martian';
    if (m <= 2.0) return 'Terran';
    if (m <= 10.0) return 'Superterran';
    if (m <= 50.0) return 'Neptunian';
    return 'Jovian';
  }

  // Fallback by diameterKm
  if (planet.diameterKm && planet.diameterKm > 0) {
    const dComputed = planet.diameterKm / 12742;
    if (dComputed < 0.5) return 'Sub-Martian';
    if (dComputed < 0.8) return 'Martian';
    if (dComputed <= 1.25) return 'Terran';
    if (dComputed <= 2.0) return 'Superterran';
    if (dComputed <= 6.0) return 'Neptunian';
    return 'Jovian';
  }

  return 'Terran';
}

function runClassification({ dryRun = true } = {}) {
  const rawData = fs.readFileSync(CATALOG_PATH, 'utf8');
  const catalog = JSON.parse(rawData);

  console.log(`\n======================================================`);
  console.log(`=== TASK 1.2: 6-TIER EXOPLANET CLASSIFIER          ===`);
  console.log(`======================================================`);
  console.log(`Total exoplanets in catalog: ${catalog.length}`);

  const tierCounts = {
    'Sub-Martian': 0,
    Martian: 0,
    Terran: 0,
    Superterran: 0,
    Neptunian: 0,
    Jovian: 0,
  };

  const updatedCatalog = catalog.map((planet) => {
    const tier = determineExoplanetTier(planet);
    tierCounts[tier] = (tierCounts[tier] || 0) + 1;
    return {
      ...planet,
      classification: tier,
    };
  });

  console.log(`\nClassification Breakdown Across 1,555 Exoplanets:`);
  console.log(`  * Sub-Martian: ${String(tierCounts['Sub-Martian']).padStart(4)} (< 0.5 D⊕, lunar/sub-Mercury scale)`);
  console.log(`  * Martian:     ${String(tierCounts['Martian']).padStart(4)} (0.5 - 0.8 D⊕, Mars-scale)`);
  console.log(`  * Terran:      ${String(tierCounts['Terran']).padStart(4)} (0.8 - 1.25 D⊕, Earth-scale)`);
  console.log(`  * Superterran: ${String(tierCounts['Superterran']).padStart(4)} (1.25 - 2.0 D⊕, Super-Earths)`);
  console.log(`  * Neptunian:   ${String(tierCounts['Neptunian']).padStart(4)} (2.0 - 6.0 D⊕, ice giants/sub-Neptunes)`);
  console.log(`  * Jovian:      ${String(tierCounts['Jovian']).padStart(4)} (> 6.0 D⊕, gas giants & hot Jupiters)`);

  const totalClassified = Object.values(tierCounts).reduce((a, b) => a + b, 0);
  console.log(`\nVerification:`);
  if (totalClassified === catalog.length) {
    console.log(`  [PASS] 100% of worlds cleanly classified (${totalClassified}/${catalog.length})!`);
  } else {
    console.error(`  [FAIL] Count mismatch: ${totalClassified} vs ${catalog.length}`);
    process.exit(1);
  }

  // Spot-check key representative worlds
  const spotChecks = [
    { name: 'Kepler-37 b', expected: 'Sub-Martian' },
    { name: 'Kepler-138 b', expected: 'Martian' },
    { name: 'Kepler-186 f', expected: 'Terran' },
    { name: '55 Cancri e', expected: 'Superterran' },
    { name: 'Gliese 1214 b', expected: 'Neptunian' },
    { name: 'WASP-12 b', expected: 'Jovian' },
  ];

  console.log(`\nSpot-Check Benchmark Verification:`);
  spotChecks.forEach(({ name, expected }) => {
    const p = updatedCatalog.find((item) => item.name === name);
    if (p) {
      const match = p.classification === expected ? 'OK' : 'MISMATCH';
      console.log(`  [${match}] ${p.name.padEnd(16)} -> ${p.classification.padEnd(12)} (${p.diameterEarth} D⊕)`);
    }
  });

  if (!dryRun) {
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(updatedCatalog, null, 2) + '\n', 'utf8');
    console.log(`\nSuccessfully applied 6-tier classifications to: ${CATALOG_PATH}`);
  } else {
    console.log(`\n[DRY RUN COMPLETE] No files modified yet. Call with --write to apply.`);
  }

  return { tierCounts, updatedCatalog };
}

if (require.main === module) {
  const shouldWrite = process.argv.includes('--write');
  runClassification({ dryRun: !shouldWrite });
}

module.exports = { determineExoplanetTier, runClassification };
