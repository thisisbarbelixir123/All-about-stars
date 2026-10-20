import { StarData } from '../types';
import starDatabaseJson from './starDatabase.json';

/**
 * Unified Star Database
 * Merged single source of truth for all 736+ catalog stars.
 */
export const UNIFIED_STAR_DATABASE: StarData[] = starDatabaseJson as StarData[];
export const STAR_DATABASE: StarData[] = UNIFIED_STAR_DATABASE;

export default UNIFIED_STAR_DATABASE;
