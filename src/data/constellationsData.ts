import { ConstellationInfo, ConstellationShape, ConstellationStar } from './constellationsCore';
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

/**
 * Parses an RA range string (e.g. "11h 05m – 15h 03m") into [minHours, maxHours]
 */
function parseRaBounds(raRange: string): [number, number] {
  const matches = [...raRange.matchAll(/(\d+)h\s*(\d+)?m?/g)];
  if (matches.length >= 2) {
    const minH = parseInt(matches[0][1], 10) + (parseInt(matches[0][2] || '0', 10) / 60);
    const maxH = parseInt(matches[1][1], 10) + (parseInt(matches[1][2] || '0', 10) / 60);
    return [minH, maxH];
  }
  return [10, 14];
}

/**
 * Parses a Dec range string (e.g. "-64° 42′ – -29° 59′") into [minDeg, maxDeg]
 */
function parseDecBounds(decRange: string): [number, number] {
  const normalized = decRange.replace(/−/g, '-');
  const matches = [...normalized.matchAll(/([+-]?\d+)°\s*(\d+)?/g)];
  if (matches.length >= 2) {
    const d1 = parseInt(matches[0][1], 10);
    const m1 = parseInt(matches[0][2] || '0', 10) / 60;
    const deg1 = d1 < 0 ? d1 - m1 : d1 + m1;

    const d2 = parseInt(matches[1][1], 10);
    const m2 = parseInt(matches[1][2] || '0', 10) / 60;
    const deg2 = d2 < 0 ? d2 - m2 : d2 + m2;
    return [Math.min(deg1, deg2), Math.max(deg1, deg2)];
  }
  return [-25, 25];
}

/**
 * Ensures every star has both valid 2D (x, y) AND valid 3D spherical (ra, dec) coordinates.
 * - If stars only have (x, y), it preserves (x, y) untouched and derives spherical (ra, dec) from the boundary box.
 * - If stars have true (ra, dec) without (x, y), it projects them to 2D via Gnomonic projection.
 */
function normalizeConstellationStars(
  stars: ConstellationShape['stars'],
  raRange: string,
  decRange: string
): ConstellationShape['stars'] {
  if (!stars || stars.length === 0) return stars;

  const hasTrueRaDec = stars.every((s: any) => typeof s.ra === 'number' && typeof s.dec === 'number');
  const hasExistingXY = stars.every((s: any) => typeof s.x === 'number' && typeof s.y === 'number');

  // Case A: Stars already have hand-crafted 2D (x, y) coordinates (like in fullConstellationShapes)
  if (hasExistingXY && !hasTrueRaDec) {
    const [raMin, raMax] = parseRaBounds(raRange);
    const [decMin, decMax] = parseDecBounds(decRange);
    const spanRa = raMax < raMin ? (raMax + 24) - raMin : Math.max(raMax - raMin, 1.5);
    const spanDec = Math.max(decMax - decMin, 15);

    return stars.map((s: any) => {
      // Derive spherical RA/Dec from x,y (East = left = higher RA, North = top = higher Dec)
      const normX = (85 - s.x) / 70; // 0 to 1
      const normY = (85 - s.y) / 70; // 0 to 1
      const computedRa = (raMin + normX * spanRa) % 24;
      const computedDec = Math.max(-89, Math.min(89, decMin + normY * spanDec));

      return {
        ...s,
        x: s.x,
        y: s.y,
        ra: s.ra ?? Number(computedRa.toFixed(3)),
        dec: s.dec ?? Number(computedDec.toFixed(3)),
      };
    });
  }

  // Case B: Stars have true RA/Dec coordinates -> project to 2D Gnomonic (x, y)
  const refRa = (stars[0] as any).ra ?? 0;
  const unwrappedStars = stars.map((s: any) => {
    let adjRa = s.ra ?? 0;
    const diff = adjRa - refRa;
    if (diff > 12) adjRa -= 24;
    else if (diff < -12) adjRa += 24;
    return { ...s, ra: adjRa, originalRa: s.ra, dec: s.dec ?? 0 };
  });

  const cartesian = unwrappedStars.map((s) => {
    const alpha = s.ra * (Math.PI / 12.0);
    const delta = s.dec * (Math.PI / 180.0);
    const cosDelta = Math.cos(delta);
    return {
      star: s,
      alpha,
      delta,
      x: cosDelta * Math.cos(alpha),
      y: cosDelta * Math.sin(alpha),
      z: Math.sin(delta),
    };
  });

  let sumX = 0, sumY = 0, sumZ = 0;
  for (const c of cartesian) {
    sumX += c.x;
    sumY += c.y;
    sumZ += c.z;
  }
  const norm = Math.hypot(Math.hypot(sumX, sumY), sumZ);
  const cx = norm > 1e-6 ? sumX / norm : 1;
  const cy = norm > 1e-6 ? sumY / norm : 0;
  const cz = norm > 1e-6 ? sumZ / norm : 0;

  const centerDelta = Math.asin(Math.max(-1, Math.min(1, cz)));
  const centerAlpha = Math.atan2(cy, cx);
  const cosCenterDelta = Math.cos(centerDelta);
  const sinCenterDelta = Math.sin(centerDelta);

  const projected = cartesian.map((c) => {
    let dAlpha = c.alpha - centerAlpha;
    while (dAlpha > Math.PI) dAlpha -= 2 * Math.PI;
    while (dAlpha < -Math.PI) dAlpha += 2 * Math.PI;

    const u = Math.cos(c.delta) * Math.sin(dAlpha);
    const v = cosCenterDelta * Math.sin(c.delta) - sinCenterDelta * Math.cos(c.delta) * Math.cos(dAlpha);
    const w = sinCenterDelta * Math.sin(c.delta) + cosCenterDelta * Math.cos(c.delta) * Math.cos(dAlpha);
    const safeW = w > 0.05 ? w : 0.05;

    return {
      star: c.star,
      u: u / safeW,
      v: v / safeW,
    };
  });

  let maxExtent = 0.001;
  for (const p of projected) {
    if (Math.abs(p.u) > maxExtent) maxExtent = Math.abs(p.u);
    if (Math.abs(p.v) > maxExtent) maxExtent = Math.abs(p.v);
  }

  const scale = 35.0 / Math.max(maxExtent, 0.015);

  return projected.map((p) => ({
    ...p.star,
    ra: p.star.originalRa ?? p.star.ra,
    x: p.star.x ?? Math.round((50 - p.u * scale) * 10) / 10,
    y: p.star.y ?? Math.round((50 - p.v * scale) * 10) / 10,
  }));
}

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
    shape: {
      ...fullShape,
      stars: normalizeConstellationStars(
        fullShape.stars,
        extra.borders.raRange,
        extra.borders.decRange
      ),
    },
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
