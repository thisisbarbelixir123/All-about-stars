import { ConstellationInfo } from './constellationsCore';
import { CONSTELLATIONS_PART_1 } from './constellationsPart1';
import { CONSTELLATIONS_PART_2 } from './constellationsPart2';
import { CONSTELLATION_ASTRONOMICAL_DETAILS } from './constellationBordersAndResemblance';
import { FULL_CONSTELLATION_SHAPES } from './fullConstellationShapes';

export * from './constellationsCore';
export * from './constellationBordersAndResemblance';
export * from './fullConstellationShapes';

const RAW_CONSTELLATIONS = [
  ...CONSTELLATIONS_PART_1,
  ...CONSTELLATIONS_PART_2
];

export const ALL_88_CONSTELLATIONS: ConstellationInfo[] = RAW_CONSTELLATIONS.map((c) => {
  const fullShape = FULL_CONSTELLATION_SHAPES[c.id] || c.shape;
  const extra = CONSTELLATION_ASTRONOMICAL_DETAILS[c.id] || {
    resemblance: `${c.englishName} depicted in the night sky.`,
    borders: {
      raRange: 'Varies',
      decRange: 'Varies',
      borderingConstellations: [],
      iauDelporteYear: 1930,
      boundarySummary: 'Official IAU boundary sector.',
      boundaryPolygon: [{ x: 10, y: 10 }, { x: 90, y: 10 }, { x: 90, y: 90 }, { x: 10, y: 90 }]
    }
  };
  return {
    ...c,
    shape: fullShape,
    resemblance: extra.resemblance,
    borders: extra.borders
  };
});

// Helper to look up constellation by ID or name
export function getConstellationById(id: string): ConstellationInfo | undefined {
  return ALL_88_CONSTELLATIONS.find(
    (c) => c.id.toLowerCase() === id.toLowerCase() || c.name.toLowerCase() === id.toLowerCase()
  );
}

// Helper to look up constellation by ID, name, abbreviation, or sector name (e.g. Serpens Caput / Serpens Cauda)
export function resolveConstellationByName(nameOrSector: string): ConstellationInfo | undefined {
  if (!nameOrSector) return undefined;
  const clean = nameOrSector.toLowerCase().trim();

  // If it refers to Serpens or its sectors (Caput, Cauda, Ser-Cap, Ser-Cau)
  if (
    clean.includes('serpens') ||
    clean.includes('ser-cap') ||
    clean.includes('ser-cau') ||
    clean.includes('caput') ||
    clean.includes('cauda')
  ) {
    return ALL_88_CONSTELLATIONS.find((c) => c.id === 'serpens');
  }

  // Strip parenthetical notes like "Boötes (Caput)" or "Ophiuchus (Caput & Cauda)"
  const baseName = clean.replace(/\s*\([^)]*\)/g, '').trim();

  return ALL_88_CONSTELLATIONS.find(
    (c) =>
      c.name.toLowerCase() === clean ||
      c.englishName.toLowerCase() === clean ||
      c.abbreviation.toLowerCase() === clean ||
      c.id.toLowerCase() === clean ||
      c.name.toLowerCase() === baseName ||
      c.englishName.toLowerCase() === baseName ||
      c.abbreviation.toLowerCase() === baseName
  );
}

export function getNeighborAbbr(neighborName: string, resolved?: ConstellationInfo): string {
  const clean = neighborName.toLowerCase().trim();
  if (clean.includes('ser-cap') || clean.includes('caput')) {
    return 'Ser-Cap';
  }
  if (clean.includes('ser-cau') || clean.includes('cauda')) {
    return 'Ser-Cau';
  }
  return resolved?.abbreviation || neighborName.slice(0, 3).toUpperCase();
}

// Groupings
export const CONSTELLATIONS_BY_HEMISPHERE = {
  Northern: ALL_88_CONSTELLATIONS.filter((c) => c.hemisphere === 'Northern'),
  Southern: ALL_88_CONSTELLATIONS.filter((c) => c.hemisphere === 'Southern'),
  Equatorial: ALL_88_CONSTELLATIONS.filter((c) => c.hemisphere === 'Equatorial')
};

export const ZODIAC_CONSTELLATIONS = ALL_88_CONSTELLATIONS.filter((c) => c.isZodiac);
