const fs = require('fs');
const path = require('path');

const JUPITER_TO_EARTH_MASS = 317.828;
const CATALOG_PATH = path.resolve(__dirname, '../src/data/exoplanetCatalog.json');

// Peer-reviewed RV, TTV, and JWST mass measurements published after the original OEC import.
const MEASURED_MASSES = {
  'exo-hd-93963-ab': { massEarth: 7.8, massJupiter: 0.0245 }, // Serrano et al. 2022 (SOPHIE RV)
  'exo-hd-3167-b': { massEarth: 4.73, massJupiter: 0.0149 }, // Bourrier et al. 2022 (ESPRESSO/HARPS/HIRES)
  'exo-kepler-37-d': { massEarth: 5.4, massJupiter: 0.017 }, // Rajpaul et al. 2021 (HARPS-N/HIRES + TTV)
  'exo-hd-3167-c': { massEarth: 11.13, massJupiter: 0.035 }, // Bourrier et al. 2022
  'exo-hd-191939-d': { massEarth: 2.8, massJupiter: 0.0088 }, // Orell-Miquel et al. 2023
  'exo-hd-93963-ac': { massEarth: 19.2, massJupiter: 0.0604 }, // Serrano et al. 2022
  'exo-hd-191939-c': { massEarth: 8.0, massJupiter: 0.0252 }, // Orell-Miquel et al. 2023
  'exo-hd-28109-d': { massEarth: 5.7, massJupiter: 0.0179 }, // Dransfield et al. 2022 (ESPRESSO/HARPS + TTV)
  'exo-hd-191939-b': { massEarth: 10.0, massJupiter: 0.0315 }, // Orell-Miquel et al. 2023
  'exo-hd-28109-c': { massEarth: 7.9, massJupiter: 0.0249 }, // Dransfield et al. 2022
  'exo-hip-67522-b': { massEarth: 13.8, massJupiter: 0.0434 }, // Thao et al. 2024 (JWST transmission)
  'exo-k-241-b': { massEarth: 182.433, massJupiter: 0.574 }, // Mocnik et al. 2016 (WASP-157 b RV)
};

// Chen & Kipping (2017) Forecaster mass-radius estimates bounded by published RV/TTV upper limits.
const ESTIMATED_MASSES = {
  'exo-kepler-37-b': { massEarth: 0.015, massJupiter: 0.000047 },
  'exo-kepler-37-c': { massEarth: 0.309, massJupiter: 0.00097 },
  'exo-kepler-1649-c': { massEarth: 1.13, massJupiter: 0.0036 },
  'exo-kepler-186-f': { massEarth: 1.31, massJupiter: 0.0041 },
  'exo-kepler-438-b': { massEarth: 1.36, massJupiter: 0.0043 },
  'exo-toi-700-d': { massEarth: 1.46, massJupiter: 0.0046 },
  'exo-kepler-442-b': { massEarth: 2.3, massJupiter: 0.0072 },
  'exo-kepler-62-f': { massEarth: 2.57, massJupiter: 0.0081 },
  'exo-kepler-62-e': { massEarth: 3.22, massJupiter: 0.0101 },
  'exo-kepler-452-b': { massEarth: 3.29, massJupiter: 0.0104 },
  'exo-kepler-23-b': { massEarth: 3.5, massJupiter: 0.011 },
  'exo-hr-858-c': { massEarth: 3.8, massJupiter: 0.012 },
  'exo-hr-858-b': { massEarth: 4.82, massJupiter: 0.0152 },
  'exo-hd-63433-b': { massEarth: 5.09, massJupiter: 0.016 },
  'exo-hr-858-d': { massEarth: 5.14, massJupiter: 0.0162 },
  'exo-kepler-23-d': { massEarth: 5.48, massJupiter: 0.0172 },
  'exo-kepler-22-b': { massEarth: 6.26, massJupiter: 0.0197 }, // Bonomo et al. 2023 (< 9.1 M_Earth)
  'exo-hd-63433-c': { massEarth: 7.34, massJupiter: 0.0231 },
  'exo-k-2167-b': { massEarth: 6.5, massJupiter: 0.0205 },
  'exo-kepler-410-ab': { massEarth: 8.46, massJupiter: 0.0266 },
  'exo-toi-1098-b': { massEarth: 9.98, massJupiter: 0.0314 },
  'exo-kepler-23-c': { massEarth: 13.75, massJupiter: 0.0433 },
  'exo-dstucab': { massEarth: 13.2, massJupiter: 0.0415 }, // Benatti et al. 2021 (< 14.4 M_Earth)
};

function forecastMassEarthFromRadius(radiusEarth) {
  if (radiusEarth < 1.23) {
    return +Math.pow(radiusEarth / 1.008, 1 / 0.279).toFixed(3);
  }
  return +(2.04 * Math.pow(radiusEarth / 1.23, 1 / 0.589)).toFixed(2);
}

function main() {
  const raw = fs.readFileSync(CATALOG_PATH, 'utf8');
  const trailingNewline = raw.endsWith('\n') ? '\n' : '';
  const catalog = JSON.parse(raw);

  let measuredUpdated = 0;
  let estimatedUpdated = 0;

  for (const planet of catalog) {
    if (MEASURED_MASSES[planet.id]) {
      planet.massEarth = MEASURED_MASSES[planet.id].massEarth;
      planet.massJupiter = MEASURED_MASSES[planet.id].massJupiter;
      planet.massType = 'measured';
      measuredUpdated++;
      continue;
    }

    if (ESTIMATED_MASSES[planet.id]) {
      planet.massEarth = ESTIMATED_MASSES[planet.id].massEarth;
      planet.massJupiter = ESTIMATED_MASSES[planet.id].massJupiter;
      planet.massType = 'estimated';
      estimatedUpdated++;
    } else if (!(planet.massEarth > 0) || !(planet.massJupiter > 0)) {
      const mE = planet.massEarth > 0 ? planet.massEarth : forecastMassEarthFromRadius(planet.diameterEarth);
      const mJRaw = mE / JUPITER_TO_EARTH_MASS;
      planet.massEarth = mE;
      planet.massJupiter = mJRaw < 0.001 ? +mJRaw.toPrecision(2) : +mJRaw.toFixed(4);
      planet.massType = 'estimated';
      estimatedUpdated++;
    }

    if (planet.id === 'exo-kepler-186-f' && planet.description) {
      planet.description = planet.description.replace(
        "The mass of the planet is not known, therefore one can only speculate about the planet's composition.",
        'Its direct radial-velocity mass remains unmeasured, so its mass (~1.31 M⊕) is estimated via empirical mass-radius relations.'
      );
    }
    if ((planet.id === 'exo-kepler-62-e' || planet.id === 'exo-kepler-62-f') && planet.description) {
      planet.description = planet.description.replace(
        /\s*Only the size, not the mass of planets in this system is known\./,
        ' Direct radial-velocity masses in this distant system remain unmeasured, so planetary mass is estimated from empirical mass-radius models.'
      );
    }
  }

  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + trailingNewline, 'utf8');
  console.log(`Updated ${measuredUpdated} measured masses and ${estimatedUpdated} estimated masses across ${catalog.length} exoplanets.`);
}

main();
