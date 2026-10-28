import { CelestialBody } from '../types';
import rawData from './exoplanetCatalog.json';

export const EXOPLANET_CATALOG: CelestialBody[] = rawData as CelestialBody[];
