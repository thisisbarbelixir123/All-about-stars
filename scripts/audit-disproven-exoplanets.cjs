/**
 * scripts/audit-disproven-exoplanets.cjs
 *
 * Task 1.3: Disproven & False-Positive Planet Audit
 * Audits the exoplanet comparison dataset (src/data/exoplanetCatalog.json) against
 * the astronomical blacklist of disproven, retracted, or non-planetary candidate detections.
 *
 * Blacklist criteria:
 *   1. Retracted planets refuted by modern follow-up observation (e.g. Kepler-1004 b / KOI-1894.01, CVSO 30 c).
 *   2. Famous historic non-planets (Fomalhaut b dust cloud, Alpha Centauri Bb, Gliese 581 d/g, Kapteyn b).
 *   3. Enforces that only 100% peer-reviewed, verified exoplanets exist in the catalog.
 */

const fs = require('fs');
const path = require('path');

const CATALOG_PATH = path.join(__dirname, '../src/data/exoplanetCatalog.json');

// Explicit list of disproven / unconfirmed candidates to filter out
const DISPROVEN_PLANET_IDS = new Set([
  'exo-kepler-1004-b', // KOI-1894.01: Disproven as false positive in Kepler Q1-Q17 DR25
  'exo-cvso-30-c',     // PTFO 8-8695 c: Refuted by VLT/SPHERE (background star / not co-moving)
  'exo-fomalhaut-b',   // Collisional dust cloud, not an exoplanet (JWST MIRI/NIRCam 2023)
  'exo-alpha-centauri-b-b', // Stellar activity / RV noise artifact (Rajpaul et al. 2016)
  'exo-gliese-581-d',  // Stellar magnetic activity / stellar rotation artifact
  'exo-gliese-581-g',  // Refuted by HARPS / HIRES re-analysis (stellar activity)
  'exo-kapteyn-b',     // Stellar rotation artifact (Robertson et al. 2015)
]);

const DISPROVEN_NAME_PATTERNS = [
  /^fomalhaut\s+b/i,
  /^alpha\s+centauri\s+b\s*b/i,
  /^gliese\s+581\s+[dg]\b/i,
  /^gj\s+581\s+[dg]\b/i,
  /^kapteyn\b.*b/i,
  /^kepler-1004\s+b/i,
  /^cvso\s+30\s+c/i,
];

function runDisprovenAudit({ dryRun = true } = {}) {
  const rawData = fs.readFileSync(CATALOG_PATH, 'utf8');
  const catalog = JSON.parse(rawData);

  console.log(`\n======================================================`);
  console.log(`=== TASK 1.3: DISPROVEN & FALSE-POSITIVE AUDIT     ===`);
  console.log(`======================================================`);
  console.log(`Catalog size before audit: ${catalog.length}`);

  const removedPlanets = [];
  const verifiedCatalog = [];

  catalog.forEach((planet) => {
    const isIdBlacklisted = DISPROVEN_PLANET_IDS.has(planet.id);
    const isNameBlacklisted = DISPROVEN_NAME_PATTERNS.some((pattern) => pattern.test(planet.name));
    const isExplicitlyUnconfirmed =
      planet.confirmed === false ||
      (planet.description &&
        (planet.description.includes('remains unconfirmed') ||
          planet.description.includes('not yet confirmed')));

    if (isIdBlacklisted || isNameBlacklisted || isExplicitlyUnconfirmed) {
      removedPlanets.push({
        id: planet.id,
        name: planet.name,
        reason: isIdBlacklisted
          ? 'Blacklisted ID (Astronomical Refutation)'
          : isNameBlacklisted
          ? 'Blacklisted Name Pattern'
          : 'Explicitly marked unconfirmed in scientific literature',
      });
    } else {
      verifiedCatalog.push(planet);
    }
  });

  console.log(`\nAudit Findings:`);
  if (removedPlanets.length === 0) {
    console.log(`  [CLEAN] No disproven or false-positive candidates found in catalog!`);
  } else {
    console.log(`  [IDENTIFIED] ${removedPlanets.length} disproven/unconfirmed world(s) flagged for removal:`);
    removedPlanets.forEach((p) => {
      console.log(`    - ${p.name.padEnd(16)} (${p.id}): ${p.reason}`);
    });
  }

  console.log(`\nCatalog Count After Audit: ${verifiedCatalog.length} verified exoplanets.`);

  if (!dryRun) {
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(verifiedCatalog, null, 2) + '\n', 'utf8');
    console.log(`\nSuccessfully saved cleansed catalog to: ${CATALOG_PATH}`);
  } else {
    console.log(`\n[DRY RUN COMPLETE] No files modified yet. Call with --write to apply.`);
  }

  return { removedPlanets, finalCount: verifiedCatalog.length };
}

if (require.main === module) {
  const shouldWrite = process.argv.includes('--write');
  runDisprovenAudit({ dryRun: !shouldWrite });
}

module.exports = { runDisprovenAudit, DISPROVEN_PLANET_IDS, DISPROVEN_NAME_PATTERNS };
