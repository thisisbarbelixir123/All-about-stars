import { StarData } from '../types';
import { ConstellationInfo } from '../data/constellationsData';
import { STARS_CATALOG } from '../data/stars';
import { STAR_CONSTELLATION_LOCATIONS } from '../data/catalogStarsConstellationLocations';

/**
 * Helper to convert formatted string coordinates ("22h 05m 47s" or "-00° 19′ 11″") into true decimal numbers
 */
export const parseCoordinate = (val: any): number => {
  if (typeof val === 'number') return isNaN(val) ? NaN : val;
  if (!val) return NaN;
  const str = String(val).replace(/−/g, '-').trim();
  if (!str || str === 'undefined' || str === 'null') return NaN;
  const match = str.match(/^([+-]?\d+)[h°]\s*(?:(\d+)[m′'])?\s*(?:([\d.]+)[s″"])?/);
  if (match) {
    const d = Math.abs(parseFloat(match[1]));
    const m = match[2] ? parseFloat(match[2]) / 60 : 0;
    const s = match[3] ? parseFloat(match[3]) / 3600 : 0;
    const sign = match[1].startsWith('-') ? -1 : 1;
    return sign * (d + m + s);
  }
  const num = parseFloat(str);
  return isNaN(num) ? NaN : num;
};

/**
 * Multi-coordinate extractor that finds ALL ranges and returns absolute min and max
 */
export const extractBounds = (rangeStr: string, isRa: boolean): [number, number] => {
  const str = (rangeStr || '').replace(/−/g, '-');
  const regex = /([+-]?\d+)[h°]\s*(?:(\d+)[m′'])?\s*(?:([\d.]+)[s″"])?/g;
  const results: number[] = [];
  let match;

  while ((match = regex.exec(str)) !== null) {
    const d = Math.abs(parseFloat(match[1]));
    const m = match[2] ? parseFloat(match[2]) / 60 : 0;
    const s = match[3] ? parseFloat(match[3]) / 3600 : 0;
    const sign = match[1].startsWith('-') ? -1 : 1;
    results.push(sign * (d + m + s));
  }

  if (results.length === 0) return isRa ? [0, 24] : [-90, 90];
  return [results[0], results[results.length - 1]];
};

export const POLAR_CONSTELLATION_IDS = new Set([
  'ursa-minor', 'umi',
  'octans', 'oct',
  'draco', 'dra',
  'cepheus', 'cep',
  'camelopardalis', 'cam',
  'apus', 'aps',
  'chamaeleon', 'cha',
  'mensa', 'men',
  'hydrus', 'hyi'
]);

export const isPolarConstellation = (cId: string, decBounds: number[]): boolean => {
  const idClean = (cId || '').toLowerCase().trim();
  // Ensure Ursa Major and other mid-latitude constellations never trigger polar mode
  if (idClean === 'ursa-major' || idClean === 'uma') return false;
  if (POLAR_CONSTELLATION_IDS.has(idClean)) return true;
  if (!decBounds || decBounds.length === 0) return false;
  const decCenter = (decBounds[0] + decBounds[1]) / 2;
  return Math.abs(decCenter) >= 65;
};

/**
 * Conformal Stereographic Projection for astronomical maps.
 * East (increasing RA) is projected to the left (-x) per astronomical convention.
 */
export const projectStereoPoint = (
  lonDeg: number,
  latDeg: number,
  cLonDeg: number,
  cLatDeg: number
): { x: number; y: number } => {
  const d2r = Math.PI / 180;
  const lam0 = cLonDeg * d2r;
  const phi0 = cLatDeg * d2r;
  const lam = lonDeg * d2r;
  const phi = latDeg * d2r;
  let dLam = lam - lam0;
  while (dLam > Math.PI) dLam -= 2 * Math.PI;
  while (dLam < -Math.PI) dLam += 2 * Math.PI;
  const cosC = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(dLam);
  const k = 2 / (1 + Math.max(-0.999, cosC));
  // Astronomical convention: looking up at the sky, East (increasing RA) is to the Left (-x)
  const x = -k * Math.cos(phi) * Math.sin(dLam) * (180 / Math.PI);
  const y = k * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(dLam)) * (180 / Math.PI);
  return { x, y };
};

export const pointInPolygon = (px: number, py: number, ring: Array<{ x: number; y: number }>): boolean => {
  let inside = false;
  const n = ring.length;
  if (n < 3) return false;
  let p1 = ring[0];
  for (let i = 0; i <= n; i++) {
    const p2 = ring[i % n];
    if (py > Math.min(p1.y, p2.y) && py <= Math.max(p1.y, p2.y) && px <= Math.max(p1.x, p2.x)) {
      if (p1.y !== p2.y) {
        const xints = ((py - p1.y) * (p2.x - p1.x)) / (p2.y - p1.y) + p1.x;
        if (p1.x === p2.x || px <= xints) inside = !inside;
      }
    }
    p1 = p2;
  }
  return inside;
};

export const distToSegment = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return Math.hypot(x - x1, y - y1);
  let t = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(x - (x1 + t * (x2 - x1)), y - (y1 + t * (y2 - y1)));
};

export const minDistanceToPolygonEdges = (
  x: number,
  y: number,
  ring: Array<{ x: number; y: number }>
): number => {
  let minD = Infinity;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const d = distToSegment(x, y, ring[i].x, ring[i].y, ring[j].x, ring[j].y);
    if (d < minD) minD = d;
  }
  return minD;
};

/**
 * Finds the optimal interior point (Pole of Inaccessibility) inside a neighbor's visible polygon
 * that is strictly outside the central constellation boundary.
 */
export const findOptimalNeighborBadgePos = (
  ringsSvg: Array<Array<{ x: number; y: number }>>,
  boundaryRingsSvg: Array<Array<{ x: number; y: number }>>,
  badgeWidth: number,
  badgeHeight: number
): { x: number; y: number } | null => {
  const hw = badgeWidth / 2;
  const hh = badgeHeight / 2;

  const allPts = ringsSvg.flat();
  const visPts = allPts.filter(p => p.x >= -15 && p.x <= 115 && p.y >= -15 && p.y <= 115);
  if (visPts.length === 0) return null;

  const bMinX = Math.max(hw + 1.0, Math.min(...visPts.map(p => p.x)));
  const bMaxX = Math.min(100 - hw - 1.0, Math.max(...visPts.map(p => p.x)));
  const bMinY = Math.max(hh + 1.5, Math.min(...visPts.map(p => p.y)));
  const bMaxY = Math.min(100 - hh - 1.5, Math.max(...visPts.map(p => p.y)));

  let bestX = (bMinX + bMaxX) / 2;
  let bestY = (bMinY + bMaxY) / 2;
  let bestScore = -Infinity;

  if (bMinX <= bMaxX && bMinY <= bMaxY) {
    const stepX = Math.max(0.7, (bMaxX - bMinX) / 22);
    const stepY = Math.max(0.7, (bMaxY - bMinY) / 22);

    for (let gx = bMinX; gx <= bMaxX; gx += stepX) {
      for (let gy = bMinY; gy <= bMaxY; gy += stepY) {
        const isInsideNeighbor = ringsSvg.some(ring => pointInPolygon(gx, gy, ring));
        if (!isInsideNeighbor) continue;

        const isInsideCentral = boundaryRingsSvg.some(ring => pointInPolygon(gx, gy, ring));
        if (isInsideCentral) continue;

        let clearance = Infinity;
        ringsSvg.forEach(ring => {
          const d = minDistanceToPolygonEdges(gx, gy, ring);
          if (d < clearance) clearance = d;
        });

        let distToCentral = Infinity;
        boundaryRingsSvg.forEach(ring => {
          const d = minDistanceToPolygonEdges(gx, gy, ring);
          if (d < distToCentral) distToCentral = d;
        });

        const dCenter = Math.hypot(gx - 50, gy - 50);
        const score = clearance * 2.0 + Math.min(distToCentral, 10) * 0.5 - (dCenter > 48 ? (dCenter - 48) * 0.3 : 0);

        if (score > bestScore) {
          bestScore = score;
          bestX = gx;
          bestY = gy;
        }
      }
    }
  }

  if (bestScore === -Infinity) {
    const validPts = visPts.filter(p => !boundaryRingsSvg.some(ring => pointInPolygon(p.x, p.y, ring)));
    if (validPts.length > 0) {
      let maxDist = -1;
      validPts.forEach(p => {
        let d = Infinity;
        boundaryRingsSvg.forEach(ring => {
          const cd = minDistanceToPolygonEdges(p.x, p.y, ring);
          if (cd < d) d = cd;
        });
        if (d > maxDist) {
          maxDist = d;
          bestX = p.x;
          bestY = p.y;
        }
      });
    } else {
      return null;
    }
  }

  bestX = Math.max(hw + 1.0, Math.min(100 - hw - 1.0, bestX));
  bestY = Math.max(hh + 1.5, Math.min(100 - hh - 1.5, bestY));

  return {
    x: Math.round(bestX * 10) / 10,
    y: Math.round(bestY * 10) / 10
  };
};

export const getConstellationSphericalCenter = (
  constellation: ConstellationInfo,
  boundsList: any[]
): { cLon: number; cLat: number; boundaryRings: number[][][] } => {
  const abbr = (constellation.abbreviation || '').toLowerCase();
  const cid = (constellation.id || '').toLowerCase();
  const cname = (constellation.name || '').toLowerCase();

  const matchingFeatures = (boundsList || []).filter((b: any) => {
    const fid = (b.id || '').toLowerCase();
    const pid = (b.properties?.id || '').toLowerCase();
    const pname = (b.properties?.name || '').toLowerCase();
    return fid === abbr || fid === cid || pid === abbr || pid === cid || pname === cname;
  });

  const boundaryRings: number[][][] = [];
  matchingFeatures.forEach((feat: any) => {
    if (feat.geometry?.type === 'Polygon' && feat.geometry.coordinates?.[0]) {
      boundaryRings.push(feat.geometry.coordinates[0]);
    } else if (feat.geometry?.type === 'MultiPolygon' && feat.geometry.coordinates) {
      feat.geometry.coordinates.forEach((poly: any) => {
        if (poly[0]) boundaryRings.push(poly[0]);
      });
    }
  });

  let sumX = 0, sumY = 0, sumZ = 0;
  let totalPts = 0;
  boundaryRings.forEach(ring => {
    for (const pt of ring) {
      const radL = (pt[0] * Math.PI) / 180;
      const radB = (pt[1] * Math.PI) / 180;
      sumX += Math.cos(radB) * Math.cos(radL);
      sumY += Math.cos(radB) * Math.sin(radL);
      sumZ += Math.sin(radB);
      totalPts++;
    }
  });

  if (totalPts > 0 && Math.hypot(sumX, sumY, sumZ) > 1e-5) {
    const cLon = (Math.atan2(sumY, sumX) * 180) / Math.PI;
    const cLat = (Math.atan2(sumZ, Math.hypot(sumX, sumY)) * 180) / Math.PI;
    return { cLon, cLat, boundaryRings };
  }

  const raBounds = extractBounds(constellation.borders?.raRange || '', true);
  const decBounds = extractBounds(constellation.borders?.decRange || '', false);
  let midRa = (raBounds[0] + raBounds[1]) / 2;
  if (raBounds[0] > raBounds[1]) midRa = (raBounds[0] + raBounds[1] + 24) / 2;
  const cLon = ((midRa * 15) % 360 + 360) % 360;
  const cLat = (decBounds[0] + decBounds[1]) / 2;
  return { cLon, cLat, boundaryRings };
};

export const isStarInsideConstellation = (
  star: StarData,
  constellation: ConstellationInfo,
  boundsList: any[]
): boolean => {
  const rawRa = star.rightAscension || (star as any).ra;
  const rawDec = star.declination || (star as any).dec;
  if (!rawRa || !rawDec) return false;

  const strRa = String(rawRa).trim();
  const strDec = String(rawDec).trim();
  if (!strRa || !strDec || strRa === 'undefined' || strDec === 'undefined') return false;

  const raVal = parseCoordinate(rawRa);
  const decVal = parseCoordinate(rawDec);
  if (isNaN(raVal) || isNaN(decVal)) return false;

  // Filter out 0,0 placeholder / unanchored stray stars
  if (Math.abs(raVal) < 1e-4 && Math.abs(decVal) < 1e-4) return false;

  const { cLon, cLat, boundaryRings } = getConstellationSphericalCenter(constellation, boundsList);
  if (boundaryRings.length === 0) return true;

  const starPt = projectStereoPoint(raVal * 15, decVal, cLon, cLat);
  for (const ring of boundaryRings) {
    const projRing = ring.map(pt => projectStereoPoint(pt[0], pt[1], cLon, cLat));
    if (pointInPolygon(starPt.x, starPt.y, projRing)) {
      return true;
    }
  }

  // Also check equatorial (lon, lat) polygon to prevent stereographic chord-sag clipping on long Delporte boundary spans
  let rawLon = raVal * 15;
  if (rawLon > 180) rawLon -= 360;
  for (const ring of boundaryRings) {
    const geoRing = ring.map(pt => ({ x: pt[0], y: pt[1] }));
    if (pointInPolygon(rawLon, decVal, geoRing)) {
      return true;
    }
  }

  return false;
};

/**
 * Normalizes constellation strings for international astronomical comparisons
 * (strips diacritics, lowercase, trims).
 */
export const normalizeConstellationString = (str: string): string =>
  (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

/**
 * Checks whether a catalog star belongs to a constellation.
 * Evaluates canonical IAU name, ID, abbreviation, sector aliases (Serpens Caput/Cauda),
 * diacritic normalization (Boötes / Bootes), and Delporte spherical boundary fallback.
 */
export const isStarBelongingToConstellation = (
  star: StarData,
  constellation: ConstellationInfo,
  boundsList?: any[]
): boolean => {
  const sNorm = normalizeConstellationString(star.constellation);
  const cNorm = normalizeConstellationString(constellation.name);
  const cId = (constellation.id || '').toLowerCase();
  const cAbbr = (constellation.abbreviation || '').toLowerCase();

  // Direct normalized name, ID, or abbreviation match
  if (sNorm === cNorm || sNorm === cId || sNorm === cAbbr) return true;

  // Multi-sector Serpens support
  if (cId === 'serpens' && (sNorm.includes('serpens') || sNorm.includes('caput') || sNorm.includes('cauda') || sNorm === 'ser')) {
    return true;
  }

  // Accent and spelling variants (Boötes / Bootes)
  if (cNorm.includes('boote') && sNorm.includes('boote')) return true;

  // Ursa Major / Ursa Minor abbreviation variants (UMa, UMi)
  if (cAbbr === 'uma' && (sNorm === 'uma' || sNorm.includes('ursa major'))) return true;
  if (cAbbr === 'umi' && (sNorm === 'umi' || sNorm.includes('ursa minor'))) return true;

  // Canes Venatici / Canis Major / Minor variants
  if (cAbbr === 'cvn' && sNorm === 'cvn') return true;
  if (cAbbr === 'cma' && sNorm === 'cma') return true;
  if (cAbbr === 'cmi' && sNorm === 'cmi') return true;

  // Geometric boundary fallback if available
  if (boundsList && boundsList.length > 0) {
    return isStarInsideConstellation(star, constellation, boundsList);
  }

  return false;
};

/**
 * Dynamically generates a rich, accurate location and astrometric context description
 * for a catalog star inside a constellation without relying on hardcoded dictionaries.
 */
export const getDynamicStarLocationDescription = (
  star: StarData,
  constellation: ConstellationInfo
): string => {
  const isPrincipal = star.id === constellation.principalStarId;
  const parts: string[] = [];

  // 1. Precise astronomical coordinates
  if (star.rightAscension && star.declination) {
    const cleanRa = star.rightAscension.replace(/\s+/g, ' ').trim();
    const cleanDec = star.declination.replace(/\s+/g, ' ').trim();
    parts.push(`RA ${cleanRa} • Dec ${cleanDec}`);
  }

  // 2. Dynamic astrometric role & identity
  if (isPrincipal) {
    parts.push(`Principal Anchor Star (${star.bayerDesignation || 'Alpha Star'} of ${constellation.name})`);
  } else if (STAR_CONSTELLATION_LOCATIONS[star.id]) {
    // Supplementary historical asterism location (e.g. "Left Shoulder", "Urn Pour Point")
    parts.push(STAR_CONSTELLATION_LOCATIONS[star.id]);
  } else if (star.exoplanetSystem && star.exoplanetSystem.hasExoplanets) {
    const pCount = star.exoplanetSystem.confirmedCount || star.exoplanetSystem.planets?.length || 1;
    parts.push(`Exoplanet Host System (${pCount} Confirmed ${pCount === 1 ? 'Planet' : 'Planets'})`);
  } else if (star.stellarStage && star.stellarStage.includes('Hypergiant')) {
    parts.push(`Ultra-Luminous Hypergiant (${star.stellarStage})`);
  } else if (star.stellarStage && star.stellarStage.includes('Supergiant')) {
    parts.push(`Luminous Supergiant (${star.spectralType})`);
  } else if (star.stellarStage && (star.stellarStage.includes('Neutron Star') || star.stellarStage.includes('Pulsar') || star.spectralClass === 'NS')) {
    parts.push(`Compact Degenerate Relic / Pulsar`);
  } else if (star.stellarStage && (star.stellarStage.includes('White Dwarf') || star.spectralClass === 'WD')) {
    parts.push(`Degenerate White Dwarf Remnant`);
  } else if (star.stellarStage && (star.stellarStage.includes('Brown Dwarf') || ['L', 'T', 'Y'].includes(star.spectralClass))) {
    parts.push(`Substellar Brown Dwarf`);
  } else if (star.isContactBinary || star.stellarStage === 'Contact Binary') {
    parts.push(`Contact Binary System`);
  } else if (star.apparentMagnitude !== undefined && star.apparentMagnitude <= 6.0) {
    parts.push(`Naked-Eye Observable Star in ${constellation.name} (mag ${star.apparentMagnitude})`);
  } else if (star.notableFacts && star.notableFacts.length > 0) {
    const firstFact = star.notableFacts[0].split(/[.;]/)[0].trim();
    if (firstFact.length > 0 && firstFact.length < 80) {
      parts.push(firstFact);
    } else {
      parts.push(`${star.stellarStage || star.spectralType} Star in ${constellation.name}`);
    }
  } else {
    parts.push(`${star.stellarStage || star.spectralType} Star in ${constellation.name}`);
  }

  return parts.join(' • ');
};

/**
 * Robustly matches an IAU constellation against all features in constellations.lines.json.
 * Supports multi-sector constellations like Serpens (Serpens Caput & Serpens Cauda).
 */
export const findConstellationLineFeatures = (
  lines: any[],
  constellation: ConstellationInfo
): any[] => {
  if (!lines || !constellation) return [];
  const abbr = (constellation.abbreviation || '').toLowerCase();
  const name = (constellation.name || '').toLowerCase();
  const cid = (constellation.id || '').toLowerCase();

  return lines.filter((f: any) => {
    const fid = (f.id || '').toLowerCase();
    const pid = (f.properties?.id || '').toLowerCase();
    const pname = (f.properties?.name || '').toLowerCase();
    return (
      fid === abbr ||
      pid === abbr ||
      pname === name ||
      pname === abbr ||
      fid === cid ||
      pid === cid
    );
  });
};

/**
 * Robustly matches an IAU constellation against features in constellations.lines.json.
 * If multiple features exist (e.g. Serpens Caput & Cauda), returns an array of features,
 * or a single feature if only one exists.
 */
export const findConstellationLineFeature = (
  lines: any[],
  constellation: ConstellationInfo
): any => {
  const feats = findConstellationLineFeatures(lines, constellation);
  if (feats.length === 0) return null;
  if (feats.length === 1) return feats[0];
  return feats;
};

/**
 * Extracts coordinate segments from a GeoJSON feature or array of features,
 * supporting MultiLineString, LineString, and multiple features (e.g. Serpens Caput & Cauda).
 */
export const getConstellationLineSegments = (lineFeatureOrFeatures: any): number[][][] => {
  if (!lineFeatureOrFeatures) return [];
  const features = Array.isArray(lineFeatureOrFeatures)
    ? lineFeatureOrFeatures
    : [lineFeatureOrFeatures];

  const allSegments: number[][][] = [];
  for (const feat of features) {
    if (!feat?.geometry) continue;
    if (feat.geometry.type === 'MultiLineString' && Array.isArray(feat.geometry.coordinates)) {
      allSegments.push(...feat.geometry.coordinates);
    } else if (feat.geometry.type === 'LineString' && Array.isArray(feat.geometry.coordinates)) {
      allSegments.push(feat.geometry.coordinates);
    }
  }
  return allSegments;
};

export const projectUniversalStereo = (
  constellation: ConstellationInfo,
  points: any[],
  boundaryRings: number[][][],
  cLon: number,
  cLat: number,
  boxMargin = 70
) => {
  const allBoundaryProj: Array<{ x: number; y: number }> = [];
  boundaryRings.forEach(ring => {
    ring.forEach(pt => {
      allBoundaryProj.push(projectStereoPoint(pt[0], pt[1], cLon, cLat));
    });
  });

  const anchorPoints = allBoundaryProj.length > 0
    ? allBoundaryProj
    : points.map(s => {
        const lon = (s.ra ?? 0) * 15;
        const lat = s.dec ?? 0;
        return projectStereoPoint(lon, lat, cLon, cLat);
      });

  const minX = anchorPoints.length > 0 ? Math.min(...anchorPoints.map(p => p.x)) : -10;
  const maxX = anchorPoints.length > 0 ? Math.max(...anchorPoints.map(p => p.x)) : 10;
  const minY = anchorPoints.length > 0 ? Math.min(...anchorPoints.map(p => p.y)) : -10;
  const maxY = anchorPoints.length > 0 ? Math.max(...anchorPoints.map(p => p.y)) : 10;

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const span = Math.max(maxX - minX, maxY - minY, 1) * 1.30;

  const toSvg = (projX: number, projY: number) => ({
    x: Math.round((50 + ((projX - midX) / span) * boxMargin) * 10) / 10,
    y: Math.round((50 - ((projY - midY) / span) * boxMargin) * 10) / 10
  });

  const mappedPoints = points.map(s => {
    const lon = (s.ra ?? 0) * 15;
    const lat = s.dec ?? 0;
    const pt = projectStereoPoint(lon, lat, cLon, cLat);
    const svgPt = toSvg(pt.x, pt.y);
    return {
      ...s,
      originalRa: s.ra,
      x: svgPt.x,
      y: svgPt.y
    };
  });

  const boundaryRingsSvg = boundaryRings.map(ring => {
    return ring.map(pt => {
      const p = projectStereoPoint(pt[0], pt[1], cLon, cLat);
      return toSvg(p.x, p.y);
    });
  });

  const isNorthRealm = cLat >= 0;
  const poleProj = projectStereoPoint(0, isNorthRealm ? 90 : -90, cLon, cLat);
  const poleSvg = toSvg(poleProj.x, poleProj.y);

  return {
    mappedPoints,
    boundaryRingsSvg,
    poleSvg,
    cLon,
    cLat,
    midX,
    midY,
    span,
    toSvg
  };
};

/**
 * Snaps IAU line vertices to the exact center of catalog stars.
 * Uses a tight 3.2 magnet radius and collision prevention so distinct celestial coordinates
 * cannot collapse into the exact same catalog star (restoring multi-star features like the Big Dipper bowl and Orion belt).
 */
export const snapLineVerticesToCatalog = (
  mappedLineVertices: any[],
  mappedCatalog: any[],
  magnetRadius = 3.2
): void => {
  // Preserve original projection positions
  mappedLineVertices.forEach((vertex) => {
    if (vertex.origX === undefined) vertex.origX = vertex.x;
    if (vertex.origY === undefined) vertex.origY = vertex.y;
  });

  // Build candidate pairs sorted by distance
  const candidatePairs: Array<{ vIdx: number; catStar: any; dist: number }> = [];
  mappedLineVertices.forEach((v, vIdx) => {
    mappedCatalog.forEach((cs: any) => {
      const d = Math.hypot(v.origX - cs.x, v.origY - cs.y);
      if (d <= magnetRadius) {
        candidatePairs.push({ vIdx, catStar: cs, dist: d });
      }
    });
  });

  candidatePairs.sort((a, b) => a.dist - b.dist);

  const assignedVertices = new Set<number>();
  const claimedStars = new Map<string, { rawLon?: number; rawLat?: number; origX: number; origY: number }>();

  for (const pair of candidatePairs) {
    if (assignedVertices.has(pair.vIdx)) continue;
    const v = mappedLineVertices[pair.vIdx];
    const existing = claimedStars.get(pair.catStar.id);

    if (existing) {
      // Allow only if the vertex represents the exact same coordinate (e.g. a closed polygon loop)
      const isSameCoord =
        v.rawLon !== undefined && existing.rawLon !== undefined
          ? Math.hypot(existing.rawLon - v.rawLon, (existing.rawLat ?? 0) - (v.rawLat ?? 0)) < 1e-4
          : Math.hypot(existing.origX - v.origX, existing.origY - v.origY) < 1e-3;

      if (!isSameCoord) {
        // Disallow two different JSON coordinates from snapping to the same star
        continue;
      }
    }

    v.x = pair.catStar.x;
    v.y = pair.catStar.y;
    v.isAssigned = true;
    assignedVertices.add(pair.vIdx);
    claimedStars.set(pair.catStar.id, {
      rawLon: v.rawLon,
      rawLat: v.rawLat,
      origX: v.origX,
      origY: v.origY
    });
  }

  // Ensure unassigned vertices keep their original coordinates
  mappedLineVertices.forEach((v, idx) => {
    if (!assignedVertices.has(idx)) {
      v.isAssigned = false;
    }
  });
};

/**
 * Retrieves visible figure stars with deduplication and overlap prevention.
 * PRESERVED RULE: Global Name De-duplication Set to fix corrupted duplicates (like Muhlifain).
 */
export const getConstellationVisibleFigureStars = (
  constellation: ConstellationInfo,
  mappedCatalog: any[],
  mappedExtra: any[],
  cCatalogStars: StarData[],
  extraFigureStars: any[]
): { visibleStars: any[]; catalogPlacedCount: number } => {
  let candidates = [
    ...mappedCatalog.map((s, idx) => {
      const catalogStar = cCatalogStars[idx];
      const cleanName = catalogStar ? catalogStar.name.replace(/\s*\([^)]+\)/g, '').trim() : `Star ${idx + 1}`;
      return {
        id: catalogStar ? `cat-${catalogStar.id}` : `asterism-${idx}`,
        x: s.x,
        y: s.y,
        name: cleanName,
        displayLabel: cleanName,
        isPrincipal: catalogStar ? catalogStar.id === constellation.principalStarId : false,
        catalogStar,
        apparentMagnitude: catalogStar ? catalogStar.apparentMagnitude : 99,
        luminositySolar: catalogStar ? catalogStar.luminositySolar : 1.0,
        locationDescription: catalogStar ? STAR_CONSTELLATION_LOCATIONS[catalogStar.id] : undefined,
      };
    }),
    ...mappedExtra.map((es, idx) => {
      const extraData = extraFigureStars[idx];
      const catalogStar = STARS_CATALOG.find((cs) => cs.id === extraData.catalogStarId) || null;
      const cleanName = (catalogStar?.name || extraData.name || '').replace(/\s*\([^)]+\)/g, '').trim();
      return {
        id: catalogStar ? `cat-${catalogStar.id}` : `extra-${idx}`,
        x: es.x,
        y: es.y,
        name: cleanName,
        displayLabel: cleanName,
        isPrincipal: false,
        catalogStar,
        apparentMagnitude: catalogStar?.apparentMagnitude || extraData.mag || 5.0,
        luminositySolar: catalogStar?.luminositySolar || 1.0,
        locationDescription: extraData.locationDescription || (catalogStar ? STAR_CONSTELLATION_LOCATIONS[catalogStar.id] : undefined),
      };
    })
  ];

  // Exclude sub-stellar objects (brown dwarfs) and stellar remnants (white dwarfs, neutron stars, black holes)
  candidates = candidates.filter(cand => {
    if (!cand.catalogStar) return true;
    const stType = (cand.catalogStar.spectralType || '').toUpperCase();
    const stage = (cand.catalogStar.stellarStage || '').toLowerCase();

    const isSubStellar = stType.startsWith('L') || stType.startsWith('T') || stType.startsWith('Y') || stage.includes('brown dwarf');
    const isRemnant = stType.startsWith('D') || stType.startsWith('WD') || stage.includes('white dwarf') || stage.includes('neutron') || stage.includes('black hole') || stage.includes('remnant');

    return !isSubStellar && !isRemnant;
  });

  // Prioritize brightest stars by sorting ascending by apparent magnitude
  candidates.sort((a, b) => a.apparentMagnitude - b.apparentMagnitude);

  const visibleStars: any[] = [];
  const seenCatalogIds = new Set<string>();
  const seenNames = new Set<string>(); // Global duplicate name tracker

  for (const cand of candidates) {
    if (cand.catalogStar && seenCatalogIds.has(cand.catalogStar.id)) continue;

    // Universally strip corrupted duplicates (like Muhlifain) by ensuring a star name is only placed once
    const cleanName = cand.name.replace(/\s*\([^)]+\)/g, '').trim().toLowerCase();
    if (cleanName && seenNames.has(cleanName)) continue;

    // Exclude overlapping stars entirely, keeping only the brightest
    const isOverlapping = visibleStars.some((acc) => Math.hypot(acc.x - cand.x, acc.y - cand.y) < 1.5);

    if (!isOverlapping) {
      visibleStars.push(cand);
      if (cand.catalogStar) seenCatalogIds.add(cand.catalogStar.id);
      if (cleanName) seenNames.add(cleanName);
    }
  }

  return { visibleStars, catalogPlacedCount: visibleStars.filter((s) => !!s.catalogStar).length };
};

/**
 * Calculates precessed real astronomical zodiac transit vs traditional horoscope sign
 */
export const calculateAstronomicalZodiac = (m: number, d: number) => {
  let traditional = 'Pisces ♓';
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) traditional = 'Aries ♈';
  else if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) traditional = 'Taurus ♉';
  else if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) traditional = 'Gemini ♊';
  else if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) traditional = 'Cancer ♋';
  else if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) traditional = 'Leo ♌';
  else if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) traditional = 'Virgo ♍';
  else if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) traditional = 'Libra ♎';
  else if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) traditional = 'Scorpius ♏';
  else if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) traditional = 'Sagittarius ♐';
  else if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) traditional = 'Capricornus ♑';
  else if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) traditional = 'Aquarius ♒';
  else traditional = 'Pisces ♓';

  let astronomical = 'Virgo (The Maiden)';
  let symbol = '♍';
  let isOph = false;
  let daysIn = 44.5;
  let desc = 'The Sun is physically crossing through Virgo.';

  if ((m === 1 && d >= 19) || (m === 2 && d <= 15)) {
    astronomical = 'Capricornus (The Sea-Goat)'; symbol = '♑'; daysIn = 27.8; desc = 'The Sun is physically crossing through Capricornus.';
  } else if ((m === 2 && d >= 16) || (m === 3 && d <= 11)) {
    astronomical = 'Aquarius (The Water-Bearer)'; symbol = '♒'; daysIn = 24.1; desc = 'The Sun is physically crossing through Aquarius.';
  } else if ((m === 3 && d >= 12) || (m === 4 && d <= 17)) {
    astronomical = 'Pisces (The Fishes)'; symbol = '♓'; daysIn = 37.7; desc = 'The Sun is physically crossing through Pisces.';
  } else if ((m === 4 && d >= 18) || (m === 5 && d <= 13)) {
    astronomical = 'Aries (The Ram)'; symbol = '♈'; daysIn = 25.5; desc = 'The Sun is physically crossing through Aries.';
  } else if ((m === 5 && d >= 14) || (m === 6 && d <= 21)) {
    astronomical = 'Taurus (The Bull)'; symbol = '♉'; daysIn = 38.2; desc = 'The Sun is physically crossing through Taurus.';
  } else if ((m === 6 && d >= 22) || (m === 7 && d <= 20)) {
    astronomical = 'Gemini (The Twins)'; symbol = '♊'; daysIn = 29.3; desc = 'The Sun is physically crossing through Gemini.';
  } else if ((m === 7 && d >= 21) || (m === 8 && d <= 10)) {
    astronomical = 'Cancer (The Crab)'; symbol = '♋'; daysIn = 21.1; desc = 'The Sun is physically crossing through Cancer.';
  } else if ((m === 8 && d >= 11) || (m === 9 && d <= 16)) {
    astronomical = 'Leo (The Lion)'; symbol = '♌'; daysIn = 36.9; desc = 'The Sun is physically crossing through Leo.';
  } else if ((m === 9 && d >= 17) || (m === 10 && d <= 30)) {
    astronomical = 'Virgo (The Maiden)'; symbol = '♍'; daysIn = 44.5; desc = 'The Sun is physically crossing through Virgo (its longest zodiac transit at 44.5 days).';
  } else if ((m === 10 && d >= 31) || (m === 11 && d <= 22)) {
    astronomical = 'Libra (The Scales)'; symbol = '♎'; daysIn = 23.0; desc = 'The Sun is physically crossing through Libra.';
  } else if (m === 11 && d >= 23 && d <= 28) {
    astronomical = 'Scorpius (The Scorpion)'; symbol = '♏'; daysIn = 6.8; desc = 'The Sun only spends 6.8 days crossing through Scorpius before entering Ophiuchus!';
  } else if ((m === 11 && d >= 29) || (m === 12 && d <= 17)) {
    astronomical = 'Ophiuchus (The Serpent Bearer)'; symbol = '⛎'; isOph = true; daysIn = 18.6; desc = 'You were born when the Sun was physically in the 13th astronomical constellation: Ophiuchus!';
  } else {
    astronomical = 'Sagittarius (The Archer)'; symbol = '♐'; daysIn = 31.9; desc = 'The Sun is physically crossing through Sagittarius toward the galactic core.';
  }

  return { traditional, astronomical, symbol, isOph, daysIn, desc };
};

/* ==========================================================================
   MOLLWEIDE PROJECTION & CARTOGRAPHY ENGINE (WHOLE-SKY GLOBE)
   ========================================================================== */

export interface MollweideProjectionOptions {
  centerMeridianDeg?: number; // Central Right Ascension meridian in degrees (default: 0)
  width?: number;             // Viewport width in pixels (default: 1000)
  height?: number;            // Viewport height in pixels (default: 500)
  padding?: number;           // Padding around ellipse in pixels (default: 24)
  astronomical?: boolean;     // East is Left (-x) per astronomical sky convention (default: true)
  isRaHours?: boolean;        // Whether numerical RA is expressed in hours (default: false, auto-detected if string)
}

export interface MollweideProjectedPoint {
  x: number;          // Viewport screen X in pixels
  y: number;          // Viewport screen Y in pixels
  xNorm: number;      // Normalized horizontal coordinate [-1, +1]
  yNorm: number;      // Normalized vertical coordinate [-1, +1]
  isInside: boolean;  // Whether point lies strictly on/inside the bounding ellipse
  thetaRad: number;   // Solved auxiliary parametric latitude in radians
}

export interface MollweideGraticuleLine {
  id: string;
  label?: string;
  path: string;
  valueDeg: number;
}

export interface MollweideGraticuleData {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  outlinePath: string;
  parallels: MollweideGraticuleLine[];
  meridians: MollweideGraticuleLine[];
  equatorPath: string;
  eclipticPath: string;
}

export interface MollweideGraticuleOptions {
  centerMeridianDeg?: number;
  padding?: number;
  astronomical?: boolean;
  parallelStepDeg?: number; // default 15
  meridianStepDeg?: number; // default 30 (2 hours)
}

/**
 * Solves the transcendental auxiliary angle theta for the Mollweide projection:
 *   2θ + sin(2θ) = π sin(φ)
 * Uses high-precision Newton-Raphson iteration with boundary guarantees for poles.
 */
export const solveMollweideTheta = (phiRad: number): number => {
  // Handle exact poles and equator analytically
  if (Math.abs(phiRad) >= Math.PI / 2 - 1e-10) {
    return Math.sign(phiRad) * (Math.PI / 2);
  }
  if (Math.abs(phiRad) < 1e-10) {
    return 0;
  }

  const target = Math.PI * Math.sin(phiRad);
  let theta = phiRad; // Initial guess close to phi

  for (let i = 0; i < 12; i++) {
    const f = 2 * theta + Math.sin(2 * theta) - target;
    const fPrime = 2 + 2 * Math.cos(2 * theta); // 4 * cos^2(theta)
    if (Math.abs(fPrime) < 1e-12) break;
    const delta = f / fPrime;
    theta -= delta;
    if (Math.abs(delta) < 1e-12) break;
  }

  return theta;
};

/**
 * Normalizes an arbitrary Right Ascension value (string or number) into decimal degrees [0, 360).
 */
export const parseRaToDeg = (ra: number | string, isHours?: boolean): number => {
  if (typeof ra === 'string') {
    const s = ra.trim();
    if (s.includes('h')) {
      const parsedHours = parseCoordinate(s);
      return isNaN(parsedHours) ? 0 : ((parsedHours * 15) % 360 + 360) % 360;
    }
    if (s.includes('°')) {
      const parsedDeg = parseCoordinate(s);
      return isNaN(parsedDeg) ? 0 : (parsedDeg % 360 + 360) % 360;
    }
    const num = parseFloat(s);
    if (!isNaN(num)) {
      const deg = isHours ? num * 15 : num;
      return (deg % 360 + 360) % 360;
    }
    return 0;
  }
  if (typeof ra === 'number' && !isNaN(ra)) {
    const deg = isHours ? ra * 15 : ra;
    return (deg % 360 + 360) % 360;
  }
  return 0;
};

/**
 * Normalizes an arbitrary Declination value (string or number) into decimal degrees [-90, +90].
 */
export const parseDecToDeg = (dec: number | string): number => {
  if (typeof dec === 'string') {
    const parsed = parseCoordinate(dec);
    return isNaN(parsed) ? 0 : Math.max(-90, Math.min(90, parsed));
  }
  if (typeof dec === 'number' && !isNaN(dec)) {
    return Math.max(-90, Math.min(90, dec));
  }
  return 0;
};

/**
 * Computes the raw normalized Mollweide coordinates where:
 *   xNorm in [-1, +1]
 *   yNorm in [-1, +1]
 *   Elliptical boundary condition: (xNorm^2 + yNorm^2) <= 1
 */
export const projectMollweideRaw = (
  raDeg: number,
  decDeg: number,
  centerMeridianDeg: number = 0,
  astronomical: boolean = true
): MollweideProjectedPoint => {
  const d2r = Math.PI / 180;
  let dLam = (raDeg - centerMeridianDeg) * d2r;
  while (dLam > Math.PI) dLam -= 2 * Math.PI;
  while (dLam < -Math.PI) dLam += 2 * Math.PI;

  const clampedDec = Math.max(-89.99999, Math.min(89.99999, decDeg));
  const phi = clampedDec * d2r;
  const theta = solveMollweideTheta(phi);

  // Theoretical unscaled Mollweide formulation:
  // x = (2 * sqrt(2) / pi) * dLam * cos(theta)
  // y = sqrt(2) * sin(theta)
  // Major axis semi-diameter a = 2 * sqrt(2)
  // Minor axis semi-diameter b = sqrt(2)
  const factor = (2 * Math.SQRT2) / Math.PI;
  const rawX = factor * dLam * Math.cos(theta);
  const rawY = Math.SQRT2 * Math.sin(theta);

  // In astronomical orientation (looking up at celestial sphere from inside),
  // East (increasing RA) is to the Left (-x)
  const orientedX = astronomical ? -rawX : rawX;

  // Normalized coordinates on unit ellipse (xNorm^2 + yNorm^2 <= 1)
  const xNorm = orientedX / (2 * Math.SQRT2);
  const yNorm = rawY / Math.SQRT2;
  const isInside = (xNorm * xNorm + yNorm * yNorm) <= 1.00001;

  return {
    x: orientedX,
    y: rawY,
    xNorm,
    yNorm,
    isInside,
    thetaRad: theta
  };
};

/**
 * Projects a celestial coordinate (RA/Dec as string or number) onto an SVG/Canvas viewport
 * fitted to the canonical 2:1 Mollweide ellipse.
 */
export const projectMollweidePoint = (
  ra: number | string,
  dec: number | string,
  options: MollweideProjectionOptions = {}
): MollweideProjectedPoint => {
  const {
    centerMeridianDeg = 0,
    width = 1000,
    height = 500,
    padding = 24,
    astronomical = true,
    isRaHours = false
  } = options;

  const raDeg = parseRaToDeg(ra, isRaHours);
  const decDeg = parseDecToDeg(dec);

  const raw = projectMollweideRaw(raDeg, decDeg, centerMeridianDeg, astronomical);

  // Fit 2:1 aspect ellipse within available viewport
  const availW = Math.max(20, width - 2 * padding);
  const availH = Math.max(10, height - 2 * padding);

  let rx: number;
  let ry: number;

  if (availW / availH >= 2) {
    ry = availH / 2;
    rx = ry * 2;
  } else {
    rx = availW / 2;
    ry = rx / 2;
  }

  const cx = width / 2;
  const cy = height / 2;

  // Map to screen pixel coordinates (SVG Y increases downwards)
  const screenX = cx + raw.xNorm * rx;
  const screenY = cy - raw.yNorm * ry;

  return {
    x: Math.round(screenX * 100) / 100,
    y: Math.round(screenY * 100) / 100,
    xNorm: raw.xNorm,
    yNorm: raw.yNorm,
    isInside: raw.isInside,
    thetaRad: raw.thetaRad
  };
};

/**
 * Checks whether a 2D screen point lies strictly inside a Mollweide bounding ellipse.
 */
export const isPointInMollweideEllipse = (
  x: number,
  y: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number
): boolean => {
  if (rx <= 0 || ry <= 0) return false;
  const dx = (x - cx) / rx;
  const dy = (y - cy) / ry;
  return (dx * dx + dy * dy) <= 1.00001;
};

/**
 * Converts a sequence of spherical [lonDeg, latDeg] points into an SVG path string (`M ... L ...`)
 * with automatic antimeridian seam breaking to prevent cross-ellipse horizontal slash lines.
 */
export const projectMollweidePolyline = (
  coordinates: Array<[number, number]>,
  options: MollweideProjectionOptions = {}
): string => {
  if (!coordinates || coordinates.length === 0) return '';

  const {
    width = 1000,
    height = 500,
    padding = 24
  } = options;

  const availW = Math.max(20, width - 2 * padding);
  const availH = Math.max(10, height - 2 * padding);
  const rx = (availW / availH >= 2 ? (availH / 2) * 2 : availW / 2);
  const seamBreakThreshold = rx * 1.25;

  let path = '';
  let prevX: number | null = null;
  let prevY: number | null = null;

  for (let i = 0; i < coordinates.length; i++) {
    const [lon, lat] = coordinates[i];
    const pt = projectMollweidePoint(lon, lat, options);

    if (i === 0 || prevX === null) {
      path += `M ${pt.x} ${pt.y} `;
    } else {
      const dist = Math.hypot(pt.x - prevX, pt.y - prevY);
      if (dist > seamBreakThreshold) {
        // Break segment at the antimeridian jump
        path += `M ${pt.x} ${pt.y} `;
      } else {
        path += `L ${pt.x} ${pt.y} `;
      }
    }

    prevX = pt.x;
    prevY = pt.y;
  }

  return path.trim();
};

/**
 * Converts a GeoJSON MultiPolygon coordinates array into an SVG path string in Mollweide projection.
 * Automatically inserts seam-breaking commands at antimeridian transitions and closes each ring.
 */
export const projectMollweideMultiPolygon = (
  coordinates: Array<Array<Array<[number, number]>>>,
  options: MollweideProjectionOptions = {}
): string => {
  if (!coordinates || coordinates.length === 0) return '';

  const {
    width = 1000,
    height = 500,
    padding = 24
  } = options;

  const availW = Math.max(20, width - 2 * padding);
  const availH = Math.max(10, height - 2 * padding);
  const rx = (availW / availH >= 2 ? (availH / 2) * 2 : availW / 2);
  const seamBreakThreshold = rx * 1.25;

  let totalD = '';

  for (const polygon of coordinates) {
    for (const ring of polygon) {
      if (!ring || ring.length < 3) continue;
      let d = '';
      let inSub = false;
      let prevX: number | null = null;
      let prevY: number | null = null;

      for (let i = 0; i < ring.length; i++) {
        const [lon, lat] = ring[i];
        const pt = projectMollweidePoint(lon, lat, options);

        if (i === 0 || prevX === null) {
          d += `M ${pt.x} ${pt.y} `;
          inSub = true;
        } else {
          const dist = Math.hypot(pt.x - prevX, pt.y - prevY);
          if (dist > seamBreakThreshold) {
            if (inSub) {
              d += 'Z ';
            }
            d += `M ${pt.x} ${pt.y} `;
            inSub = true;
          } else {
            d += `L ${pt.x} ${pt.y} `;
          }
        }

        prevX = pt.x;
        prevY = pt.y;
      }

      if (inSub) {
        d += 'Z ';
      }

      if (d) totalD += d;
    }
  }

  return totalD.trim();
};

/**
 * Converts a GeoJSON Polygon coordinates array (outer ring + optional holes) into an SVG path string in Mollweide projection.
 */
export const projectMollweidePolygon = (
  coordinates: Array<Array<[number, number]>>,
  options: MollweideProjectionOptions = {}
): string => {
  return projectMollweideMultiPolygon([coordinates], options);
};

/**
 * Generates coordinate graticule data (parallels, meridians, outer boundary, equator, and ecliptic)
 * for rendering a complete celestial globe on SVG/Canvas.
 */
export const computeMollweideGraticule = (
  width: number = 1000,
  height: number = 500,
  options: MollweideGraticuleOptions = {}
): MollweideGraticuleData => {
  const {
    centerMeridianDeg = 0,
    padding = 24,
    astronomical = true,
    parallelStepDeg = 15,
    meridianStepDeg = 30
  } = options;

  const availW = Math.max(20, width - 2 * padding);
  const availH = Math.max(10, height - 2 * padding);

  let rx: number;
  let ry: number;

  if (availW / availH >= 2) {
    ry = availH / 2;
    rx = ry * 2;
  } else {
    rx = availW / 2;
    ry = rx / 2;
  }

  const cx = width / 2;
  const cy = height / 2;

  // 1. Outer boundary ellipse path
  const outlinePath = `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;

  // 2. Parallels of Declination (straight horizontal lines bounded by the ellipse)
  const parallels: MollweideGraticuleLine[] = [];
  for (let dec = -75; dec <= 75; dec += parallelStepDeg) {
    const raw = projectMollweideRaw(0, dec, centerMeridianDeg, astronomical);
    const yScreen = Math.round((cy - raw.yNorm * ry) * 100) / 100;
    const xMaxNorm = Math.cos(raw.thetaRad);
    const xLeft = Math.round((cx - xMaxNorm * rx) * 100) / 100;
    const xRight = Math.round((cx + xMaxNorm * rx) * 100) / 100;

    const label = dec > 0 ? `+${dec}°` : `${dec}°`;
    parallels.push({
      id: `parallel-${dec}`,
      label,
      valueDeg: dec,
      path: `M ${xLeft} ${yScreen} L ${xRight} ${yScreen}`
    });
  }

  // 3. Equator (dec = 0)
  const equatorPath = `M ${cx - rx} ${cy} L ${cx + rx} ${cy}`;

  // 4. Meridians of Right Ascension (curved ellipses from South Pole to North Pole)
  const meridians: MollweideGraticuleLine[] = [];
  for (let ra = 0; ra < 360; ra += meridianStepDeg) {
    const pts: Array<[number, number]> = [];
    for (let dec = -90; dec <= 90; dec += 3) {
      pts.push([ra, dec]);
    }
    const pathStr = projectMollweidePolyline(pts, {
      centerMeridianDeg,
      width,
      height,
      padding,
      astronomical,
      isRaHours: false
    });

    const hours = (ra / 15).toFixed(0);
    meridians.push({
      id: `meridian-${ra}`,
      label: `${hours}h`,
      valueDeg: ra,
      path: pathStr
    });
  }

  // 5. The Ecliptic (Earth's orbital path / annual path of the Sun, obliquity ε ≈ 23.439°)
  const obliquityRad = 23.43928 * (Math.PI / 180);
  const eclipticPts: Array<[number, number]> = [];
  for (let eclLon = 0; eclLon <= 360; eclLon += 2) {
    const lRad = eclLon * (Math.PI / 180);
    const sinDec = Math.sin(obliquityRad) * Math.sin(lRad);
    const decDeg = Math.asin(sinDec) * (180 / Math.PI);
    const raRad = Math.atan2(Math.sin(lRad) * Math.cos(obliquityRad), Math.cos(lRad));
    const raDeg = ((raRad * (180 / Math.PI)) % 360 + 360) % 360;
    eclipticPts.push([raDeg, decDeg]);
  }
  const eclipticPath = projectMollweidePolyline(eclipticPts, {
    centerMeridianDeg,
    width,
    height,
    padding,
    astronomical,
    isRaHours: false
  });

  return {
    cx,
    cy,
    rx,
    ry,
    outlinePath,
    parallels,
    meridians,
    equatorPath,
    eclipticPath
  };
};

/**
 * Projects a multi-polygon Milky Way tier feature onto a local stereographic constellation viewport.
 * Automatically culls opposite-hemisphere vertices and builds an SVG path string for the local frame.
 */
export const projectLocalStereoMilkyWayTier = (
  tierFeature: any,
  cLon: number,
  cLat: number,
  toSvg: (projX: number, projY: number) => { x: number; y: number },
  viewportPadding: number = 25
): string => {
  if (!tierFeature?.geometry?.coordinates) return '';
  const d2r = Math.PI / 180;
  const lam0 = cLon * d2r;
  const phi0 = cLat * d2r;

  let totalD = '';

  for (const polygon of tierFeature.geometry.coordinates) {
    for (const ring of polygon) {
      let d = '';
      let inSub = false;

      for (let i = 0; i < ring.length; i++) {
        const [lon, lat] = ring[i];
        const lam = lon * d2r;
        const phi = lat * d2r;
        let dLam = lam - lam0;
        while (dLam > Math.PI) dLam -= 2 * Math.PI;
        while (dLam < -Math.PI) dLam += 2 * Math.PI;

        const cosC = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(dLam);
        if (cosC < 0.25) {
          if (inSub) { d += ' Z '; inSub = false; }
          continue;
        }

        const k = 2 / (1 + cosC);
        const projX = -k * Math.cos(phi) * Math.sin(dLam) * (180 / Math.PI);
        const projY = k * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(dLam)) * (180 / Math.PI);
        const svgPt = toSvg(projX, projY);

        // Discard points projecting far outside the viewport to prevent SVG clipping distortions
        if (svgPt.x < -viewportPadding || svgPt.x > 100 + viewportPadding ||
            svgPt.y < -viewportPadding || svgPt.y > 100 + viewportPadding) {
          if (inSub) { d += ' Z '; inSub = false; }
          continue;
        }

        if (!inSub) {
          d += `M ${svgPt.x} ${svgPt.y} `;
          inSub = true;
        } else {
          d += `L ${svgPt.x} ${svgPt.y} `;
        }
      }

      if (inSub) d += ' Z ';
      if (d.length > 0) totalD += d;
    }
  }

  return totalD.trim();
};

export type SkyMapProjectionType = 'stereographic' | 'orthographic' | 'mollweide';

export interface DynamicSphericalProjectOptions {
  centerRaDeg: number;
  centerDecDeg: number;
  width: number;
  height: number;
  radius: number;
  zoom: number;
  projection: SkyMapProjectionType;
}

export interface DynamicProjectedPoint {
  x: number;
  y: number;
  isVisible: boolean;
  cosC: number;
}

/**
 * Projects a spherical celestial point (RA, Dec in degrees) onto 2D screen coordinates
 * using a dynamic center (centerRaDeg, centerDecDeg), radius, zoom, and projection mode.
 */
export const projectDynamicSphericalPoint = (
  raDeg: number,
  decDeg: number,
  options: DynamicSphericalProjectOptions
): DynamicProjectedPoint => {
  const { centerRaDeg, centerDecDeg, width, height, radius, zoom, projection } = options;
  const cx = width / 2;
  const cy = height / 2;
  const d2r = Math.PI / 180;

  if (projection === 'mollweide') {
    // Dynamic Mollweide with center meridian
    const raw = projectMollweideRaw(raDeg, decDeg, centerRaDeg, true);
    const rx = radius * 2 * zoom;
    const ry = radius * zoom;
    const x = cx + raw.xNorm * rx;
    const y = cy - raw.yNorm * ry;
    return {
      x,
      y,
      isVisible: raw.isInside,
      cosC: raw.isInside ? 1 : -1
    };
  }

  // Spherical Stereographic & Orthographic
  let dLamDeg = raDeg - centerRaDeg;
  while (dLamDeg > 180) dLamDeg -= 360;
  while (dLamDeg < -180) dLamDeg += 360;

  const dLam = dLamDeg * d2r;
  const phi = decDeg * d2r;
  const phi0 = centerDecDeg * d2r;

  const cosC = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(dLam);

  if (projection === 'orthographic') {
    if (cosC < 0) {
      return { x: 0, y: 0, isVisible: false, cosC };
    }
    const rScaled = radius * zoom;
    const x = -rScaled * Math.cos(phi) * Math.sin(dLam);
    const y = -rScaled * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(dLam));
    return {
      x: cx + x,
      y: cy + y,
      isVisible: true,
      cosC
    };
  }

  // Stereographic (Conformal, zero angle distortion)
  if (cosC < -0.2) {
    return { x: 0, y: 0, isVisible: false, cosC };
  }

  const k = (2 / (1 + cosC)) * radius * zoom;
  const x = -k * Math.cos(phi) * Math.sin(dLam);
  const y = -k * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(dLam));

  return {
    x: cx + x,
    y: cy + y,
    isVisible: true,
    cosC
  };
};

/**
 * Inverse projection: converts screen coordinates (x, y) back into spherical (raDeg, decDeg).
 */
export const inverseScreenToSpherical = (
  screenX: number,
  screenY: number,
  options: DynamicSphericalProjectOptions
): { raDeg: number; decDeg: number } | null => {
  const { centerRaDeg, centerDecDeg, width, height, radius, zoom, projection } = options;
  const cx = width / 2;
  const cy = height / 2;
  const dx = screenX - cx;
  const dy = screenY - cy;
  const rScaled = radius * zoom;
  if (rScaled <= 0) return null;

  const d2r = Math.PI / 180;
  const r2d = 180 / Math.PI;
  const phi0 = centerDecDeg * d2r;
  const lam0 = centerRaDeg * d2r;

  if (projection === 'orthographic') {
    const rho = Math.hypot(dx, dy);
    if (rho > rScaled) return null;

    const sinC = rho / rScaled;
    const cosC = Math.sqrt(Math.max(0, 1 - sinC * sinC));

    const phi = Math.asin(cosC * Math.sin(phi0) - (dy * Math.cos(phi0) * sinC) / (rho || 1));
    const dLam = Math.atan2(
      -dx * sinC,
      rho * Math.cos(phi0) * cosC + dy * Math.sin(phi0) * sinC
    );

    let raDeg = ((lam0 + dLam) * r2d) % 360;
    if (raDeg < 0) raDeg += 360;
    const decDeg = Math.max(-90, Math.min(90, phi * r2d));
    return { raDeg, decDeg };
  }

  if (projection === 'stereographic') {
    const rho = Math.hypot(dx, dy);
    if (rho === 0) return { raDeg: centerRaDeg, decDeg: centerDecDeg };

    const c = 2 * Math.atan(rho / (2 * rScaled));
    const sinC = Math.sin(c);
    const cosC = Math.cos(c);

    const phi = Math.asin(cosC * Math.sin(phi0) - (dy * Math.cos(phi0) * sinC) / rho);
    const dLam = Math.atan2(
      -dx * sinC,
      rho * Math.cos(phi0) * cosC + dy * Math.sin(phi0) * sinC
    );

    let raDeg = ((lam0 + dLam) * r2d) % 360;
    if (raDeg < 0) raDeg += 360;
    const decDeg = Math.max(-90, Math.min(90, phi * r2d));
    return { raDeg, decDeg };
  }

  return null;
};
