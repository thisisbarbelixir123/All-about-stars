import { CelestialBody } from '../types';
import { SOLAR_SYSTEM_ROSTER, EARTH_DIAMETER_KM, JUPITER_DIAMETER_KM } from './solarSystemCatalog';
import { EXOPLANET_CATALOG } from './exoplanetCatalog';

export { SOLAR_SYSTEM_ROSTER, EXOPLANET_CATALOG, EARTH_DIAMETER_KM, JUPITER_DIAMETER_KM };

/**
 * Combined and ascendingly sorted celestial scale catalog.
 * Starts from smallest Solar System moons/asteroids (e.g. Mimas at 396 km),
 * continues through terrestrial planets, sub-Earths, Super-Earths, Sub-Neptunes,
 * Gas Giants, Hot Jupiters, up to Jupiter, and anchors at the Sun.
 */
export const MASTER_CELESTIAL_CATALOG: CelestialBody[] = [...SOLAR_SYSTEM_ROSTER, ...EXOPLANET_CATALOG].sort(
  (a, b) => a.diameterKm - b.diameterKm
);

export const MASTER_CELESTIAL_BY_ID = new Map<string, CelestialBody>(
  MASTER_CELESTIAL_CATALOG.map((body) => [body.id, body])
);
