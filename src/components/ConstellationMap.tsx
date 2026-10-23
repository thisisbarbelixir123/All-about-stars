import React from 'react';
import { StarData } from '../types';
import { STARS_CATALOG } from '../data/stars';
import {
  ConstellationInfo,
  resolveConstellationByName,
  getNeighborAbbr
} from '../data/constellationsData';
import { computeCelestialGraticule } from '../data/skyMapAtlasData';
import { EXTRA_CATALOG_FIGURE_STARS } from '../data/catalogStarsConstellationLocations';
import { CelestialData } from '../hooks/useCelestialData';
import {
  parseCoordinate,
  extractBounds,
  isPolarConstellation,
  projectStereoPoint,
  pointInPolygon,
  getConstellationSphericalCenter,
  isStarInsideConstellation,
  projectUniversalStereo,
  snapLineVerticesToCatalog,
  getConstellationVisibleFigureStars,
  findConstellationLineFeature,
  getConstellationLineSegments
} from '../utils/celestialMechanics';

export interface SkyMapOptions {
  showGraticule: boolean;
  showBoundaries: boolean;
  showStarLabels: boolean;
  showEquatorEcliptic: boolean;
  showDeepSky: boolean;
  showNeighborGuides: boolean;
}

export interface ConstellationMapProps {
  constellation: ConstellationInfo;
  celestialData: CelestialData;
  mode?: 'preview' | 'dossier';
  size?: number;
  className?: string;
  options?: Partial<SkyMapOptions>;
  onSelectNeighbor?: (neighbor: ConstellationInfo) => void;
  onSelectFigureStar?: (starData: StarData) => void;
  activeStarLabelId?: string | null;
  setActiveStarLabelId?: (id: string | null) => void;
  hoveredStarId?: string | null;
  setHoveredStarId?: (id: string | null) => void;
}

export const ConstellationMap: React.FC<ConstellationMapProps> = ({
  constellation,
  celestialData,
  mode = 'dossier',
  size = 120,
  className = '',
  options,
  onSelectNeighbor,
  onSelectFigureStar,
  activeStarLabelId,
  setActiveStarLabelId,
  hoveredStarId,
  setHoveredStarId
}) => {
  // -------------------------------------------------------------
  // MODE 1: ASTERISM PREVIEW (Small Map for Constellation Cards)
  // -------------------------------------------------------------
  if (mode === 'preview') {
    const { cLon, cLat, boundaryRings } = getConstellationSphericalCenter(constellation, celestialData.bounds);

    const cCatalogStars = STARS_CATALOG.filter(s => {
      const matches = s.constellation.toLowerCase() === constellation.id.toLowerCase() ||
        s.constellation.toLowerCase() === constellation.name.toLowerCase();
      if (!matches) return false;
      return isStarInsideConstellation(s, constellation, celestialData.bounds);
    }).map(s => ({
      ...s,
      ra: parseCoordinate((s as any).rightAscension || (s as any).ra),
      dec: parseCoordinate((s as any).declination || (s as any).dec)
    }));

    // Robust, crash-proof case-insensitive JSON extraction
    const lineFeature = findConstellationLineFeature(celestialData.lines, constellation);
    const multiLineCoords = getConstellationLineSegments(lineFeature);

    const jsonStars = multiLineCoords.reduce((acc, val) => acc.concat(val), []).map((coord, idx) => {
      let r = coord[0]; if (r < 0) r += 360;
      return { id: `json-${idx}`, ra: r / 15, dec: coord[1], rawLon: coord[0], rawLat: coord[1] };
    });

    const { mappedPoints, poleSvg } = projectUniversalStereo(
      constellation,
      [...jsonStars, ...cCatalogStars],
      boundaryRings,
      cLon,
      cLat,
      66
    );

    const mappedLineVertices = mappedPoints.slice(0, jsonStars.length);
    const mappedCatalog = mappedPoints.slice(jsonStars.length);

    // Snap JSON lines to the exact center of Catalog Stars (tight 3.2 magnet radius, anti-collision)
    snapLineVerticesToCatalog(mappedLineVertices, mappedCatalog, 3.2);

    const decBounds = extractBounds(constellation.borders?.decRange || '', false);
    const isPolar = isPolarConstellation(constellation.id, decBounds);

    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={`overflow-visible drop-shadow-[0_0_8px_rgba(6,182,212,0.35)] ${className}`}
      >
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(56, 189, 248, 0.07)" strokeDasharray="2 3" />
        <line x1="50" y1="8" x2="50" y2="92" stroke="rgba(56, 189, 248, 0.05)" />
        <line x1="8" y1="50" x2="92" y2="50" stroke="rgba(56, 189, 248, 0.05)" />

        {/* Polar Celestial Pole Indicator */}
        {isPolar && poleSvg && poleSvg.x >= 5 && poleSvg.x <= 95 && poleSvg.y >= 5 && poleSvg.y <= 95 && (
          <g className="pointer-events-none">
            <circle cx={poleSvg.x} cy={poleSvg.y} r="2.2" fill="none" stroke="#38bdf8" strokeWidth="0.35" strokeDasharray="1 1" />
            <circle cx={poleSvg.x} cy={poleSvg.y} r="0.6" fill="#facc15" />
          </g>
        )}

        {/* Draw the dynamically fetched IAU lines */}
        {multiLineCoords.map((segment: number[][], segIdx: number) => {
          return segment.map((point: number[], ptIdx: number) => {
            if (ptIdx === segment.length - 1) return null;
            let flatFromIdx = 0;
            for (let i = 0; i < segIdx; i++) flatFromIdx += multiLineCoords[i].length;
            flatFromIdx += ptIdx;
            const flatToIdx = flatFromIdx + 1;

            const from = mappedLineVertices[flatFromIdx];
            const to = mappedLineVertices[flatToIdx];
            if (!from || !to) return null;

            return (
              <line
                key={`sm-line-${segIdx}-${ptIdx}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#38bdf8"
                strokeWidth="1.15"
                strokeOpacity="0.88"
                strokeLinecap="round"
              />
            );
          });
        })}

        {/* Draw the geometric constellation figure nodes: All figure stars are bright (not greyed out in preview) */}
        {mappedLineVertices.map((s: any, starIdx: number) => (
          <g key={`sm-json-star-${starIdx}`}>
            <circle
              cx={s.x} cy={s.y}
              r="1.5"
              fill="#ffffff"
              stroke="#38bdf8"
              strokeWidth="0.45"
              className="pointer-events-none"
            />
          </g>
        ))}
      </svg>
    );
  }

  // -------------------------------------------------------------
  // MODE 2: DOSSIER SKY MAP (Large Astrometric Interactive Map)
  // -------------------------------------------------------------
  const isLarge = size >= 260;
  const opts = {
    showGraticule: options?.showGraticule ?? (isLarge ? true : false),
    showBoundaries: options?.showBoundaries ?? (isLarge ? true : true),
    showStarLabels: options?.showStarLabels ?? (isLarge ? false : false),
    showEquatorEcliptic: options?.showEquatorEcliptic ?? (isLarge ? true : false),
    showDeepSky: options?.showDeepSky ?? (isLarge ? true : false),
    showNeighborGuides: options?.showNeighborGuides ?? (isLarge ? true : true),
  };

  const border = constellation.borders;
  const neighbors = border?.borderingConstellations || [];
  const graticule = computeCelestialGraticule(border?.raRange || '', border?.decRange || '', constellation.isZodiac, constellation.id);

  const { cLon, cLat, boundaryRings } = getConstellationSphericalCenter(constellation, celestialData.bounds);

  const lineFeature = findConstellationLineFeature(celestialData.lines, constellation);
  const multiLineCoords = getConstellationLineSegments(lineFeature);

  const jsonStars = multiLineCoords.reduce((acc, val) => acc.concat(val), []).map((coord, idx) => {
    let r = coord[0]; if (r < 0) r += 360;
    return { id: `json-${idx}`, ra: r / 15, dec: coord[1], rawLon: coord[0], rawLat: coord[1] };
  });

  const decBounds = extractBounds(border?.decRange || '', false);
  const isPolar = isPolarConstellation(constellation.id, decBounds);
  const isNorth = (decBounds[0] + decBounds[1]) / 2 >= 0;

  const isInsideBoundaryGeom = (lonDeg: number, latDeg: number): boolean => {
    if (boundaryRings.length === 0) return true;
    const pt = projectStereoPoint(lonDeg, latDeg, cLon, cLat);
    return boundaryRings.some(ring => {
      const projRing = ring.map(p => projectStereoPoint(p[0], p[1], cLon, cLat));
      return pointInPolygon(pt.x, pt.y, projRing);
    });
  };

  const prominentCandidates = (celestialData.dsos || []).filter(dso => {
    if (!dso.geometry?.coordinates) return false;
    let r = dso.geometry.coordinates[0]; if (r < 0) r += 360;
    const dsoDec = dso.geometry.coordinates[1];
    if (!isInsideBoundaryGeom(dso.geometry.coordinates[0], dsoDec)) return false;

    const props = dso.properties || {};
    const desig = (props.desig || '').trim();
    const dsoId = String(dso.id || '').trim();
    const dsoType = (props.type || '').trim().toLowerCase();

    const nameInfo = celestialData.dsoNames?.[dsoId] || celestialData.dsoNames?.[desig];
    const commonName = typeof nameInfo === 'object' && nameInfo?.name ? nameInfo.name : null;
    const isMessier = /^M\s*\d+$/i.test(desig);
    const isObscure = ['LDN', 'LBN', 'Ced', 'Cr', 'vdB', 'Stock', 'Tr', 'RCW', 'SNR', 'PN G', 'B ', 'Sh2'].some(pre => desig.startsWith(pre));
    if (isObscure) return false;
    if (dsoType === 'dn' && !commonName) return false;

    const mag = parseFloat(props.mag);
    const hasValidMag = !isNaN(mag) && mag < 90;

    if (isMessier) return true;
    if (commonName && (hasValidMag ? mag <= 6.5 : true)) return true;
    return false;
  }).map(dso => {
    let r = dso.geometry.coordinates[0]; if (r < 0) r += 360;
    const props = dso.properties || {};
    const desig = (props.desig || '').trim();
    const dsoId = String(dso.id || '').trim();
    const dsoType = (props.type || '').trim().toLowerCase();
    const nameInfo = celestialData.dsoNames?.[dsoId] || celestialData.dsoNames?.[desig];
    const commonName = typeof nameInfo === 'object' && nameInfo?.name ? nameInfo.name : null;
    const isMessier = /^M\s*\d+$/i.test(desig);
    const mag = parseFloat(props.mag);
    const magVal = !isNaN(mag) ? mag : 99;

    const isSuperIconic = (commonName && /ω\s*cen|omega\s*centauri|pleiades|hyades|praesepe/i.test(commonName)) || isMessier;
    const score = isMessier
      ? 10.0 + (magVal < 90 ? Math.min(magVal, 10.0) : 5.0)
      : isSuperIconic
      ? 12.0 + (magVal < 90 ? Math.min(magVal, 10.0) : 5.0)
      : commonName
      ? 20.0 + (magVal < 90 ? Math.min(magVal, 10.0) : 5.0)
      : 35.0 + magVal;

    let displayName = desig;
    if (isMessier && commonName && !commonName.toLowerCase().includes(desig.toLowerCase())) {
      displayName = `${desig} (${commonName})`;
    } else if (commonName) {
      displayName = commonName;
    }

    const typeLabel =
      dsoType === 'gc' ? 'Globular Cluster' :
      dsoType === 'oc' ? 'Open Cluster' :
      dsoType === 'bn' || dsoType === 'sfr' ? 'Bright Emission Nebula' :
      dsoType === 'pn' ? 'Planetary Nebula' :
      dsoType === 'snr' ? 'Supernova Remnant' :
      dsoType === 'dn' ? 'Dark Nebula' :
      dsoType === 's' || dsoType === 'e' || dsoType === 'i' ? 'Galaxy' : 'Deep-Sky Object';

    return {
      id: dso.id,
      name: displayName,
      desig,
      commonName,
      type: dsoType,
      mag: magVal < 90 ? magVal : undefined,
      ra: r / 15,
      dec: dso.geometry.coordinates[1],
      score,
      description: `${displayName}${commonName && commonName !== displayName ? ` [${desig}]` : ''} • ${typeLabel}${magVal < 90 ? ` | Mag: ${magVal.toFixed(1)}` : ''}`
    };
  });

  prominentCandidates.sort((a, b) => a.score - b.score);
  const localRawDsos = prominentCandidates.slice(0, 2);

  const cCatalogStars = STARS_CATALOG.filter(s => {
    const matches = s.constellation.toLowerCase() === constellation.id.toLowerCase() ||
      s.constellation.toLowerCase() === constellation.name.toLowerCase();
    if (!matches) return false;
    return isStarInsideConstellation(s, constellation, celestialData.bounds);
  }).map(s => ({
    ...s,
    ra: parseCoordinate((s as any).rightAscension || (s as any).ra),
    dec: parseCoordinate((s as any).declination || (s as any).dec)
  }));

  const extraFigureStars = (EXTRA_CATALOG_FIGURE_STARS[constellation.id] || [])
    .map((extra: any) => {
      const catalogMatch = STARS_CATALOG.find(s => s.id === extra.catalogStarId);
      if (!catalogMatch) return null;
      if (!isStarInsideConstellation(catalogMatch, constellation, celestialData.bounds)) return null;
      return {
        ...extra,
        ra: parseCoordinate((catalogMatch as any).rightAscension || (catalogMatch as any).ra),
        dec: parseCoordinate((catalogMatch as any).declination || (catalogMatch as any).dec)
      };
    })
    .filter(Boolean);

  const allSecondary = [...jsonStars, ...localRawDsos, ...cCatalogStars, ...extraFigureStars];

  const { mappedPoints, boundaryRingsSvg, poleSvg, toSvg } = projectUniversalStereo(
    constellation,
    allSecondary,
    boundaryRings,
    cLon,
    cLat,
    70
  );

  let offset = 0;
  const mappedLineVertices = mappedPoints.slice(offset, offset + jsonStars.length); offset += jsonStars.length;
  const mappedDsos = mappedPoints.slice(offset, offset + localRawDsos.length); offset += localRawDsos.length;
  const mappedCatalog = mappedPoints.slice(offset, offset + cCatalogStars.length); offset += cCatalogStars.length;
  const mappedExtra = mappedPoints.slice(offset, offset + extraFigureStars.length);

  // 🧲 VERTEX SNAPPING (Tight 3.2 magnet radius, anti-collision)
  snapLineVerticesToCatalog(mappedLineVertices, mappedCatalog, 3.2);

  const mainBoundaryPathData = boundaryRingsSvg.map(ring => 'M ' + ring.map(p => `${p.x} ${p.y}`).join(' L ') + ' Z').join(' ');
  const boundaryCornerPoints = boundaryRingsSvg.flat();

  // Project and place Bordering Constellations on the Sky Map
  const borderingConstellationsSvg = neighbors.map(neighborName => {
    const neighborObj = resolveConstellationByName(neighborName);
    const abbr = neighborObj?.abbreviation || getNeighborAbbr(neighborName, neighborObj);
    const nFeatures = (celestialData.bounds || []).filter((b: any) => {
      const fid = (b.id || '').toLowerCase();
      const pid = (b.properties?.id || '').toLowerCase();
      const pname = (b.properties?.name || '').toLowerCase();
      return fid === abbr.toLowerCase() || (neighborObj && (fid === neighborObj.id.toLowerCase() || pname === neighborObj.name.toLowerCase()));
    });

    const ringsSvg: Array<Array<{ x: number; y: number }>> = [];
    nFeatures.forEach(feat => {
      if (feat.geometry?.type === 'Polygon' && feat.geometry.coordinates?.[0]) {
        ringsSvg.push(feat.geometry.coordinates[0].map((pt: number[]) => {
          const p = projectStereoPoint(pt[0], pt[1], cLon, cLat);
          return toSvg(p.x, p.y);
        }));
      }
    });

    if (ringsSvg.length === 0) return null;

    const pathData = ringsSvg.map(ring => 'M ' + ring.map(p => `${p.x} ${p.y}`).join(' L ') + ' Z').join(' ');

    const allPts = ringsSvg.flat();
    let closestPt = allPts[0];
    let minDist = Infinity;
    let avgX = 0, avgY = 0;
    allPts.forEach(p => {
      avgX += p.x;
      avgY += p.y;
      const d = Math.hypot(p.x - 50, p.y - 50);
      if (d < minDist) {
        minDist = d;
        closestPt = p;
      }
    });
    avgX /= allPts.length || 1;
    avgY /= allPts.length || 1;

    let rawBadgeX = closestPt.x * 0.60 + avgX * 0.40;
    let rawBadgeY = closestPt.y * 0.60 + avgY * 0.40;
    let bx = rawBadgeX - 50;
    let by = rawBadgeY - 50;
    const dist = Math.hypot(bx, by);
    if (dist < 22) {
      const scale = 24 / (dist || 1);
      bx *= scale;
      by *= scale;
    }
    const badgeX = Math.round(Math.max(8, Math.min(92, 50 + bx)) * 10) / 10;
    const badgeY = Math.round(Math.max(8, Math.min(92, 50 + by)) * 10) / 10;

    return {
      name: neighborName,
      abbr,
      neighborObj,
      pathData,
      badgePos: { x: badgeX, y: badgeY }
    };
  }).filter(Boolean) as Array<{
    name: string;
    abbr: string;
    neighborObj: ConstellationInfo | null;
    pathData: string;
    badgePos: { x: number; y: number };
  }>;

  const { visibleStars } = getConstellationVisibleFigureStars(
    constellation,
    mappedCatalog,
    mappedExtra,
    cCatalogStars,
    extraFigureStars
  );

  return (
    <div
      className="w-full h-full flex items-center justify-center relative select-none"
      onClick={() => setActiveStarLabelId?.(null)}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={`w-full h-full drop-shadow-[0_0_12px_rgba(6,182,212,0.25)] ${className}`}
        onClick={() => setActiveStarLabelId?.(null)}
      >
        <defs>
          <clipPath id={`map-frame-clip-${constellation.id}`}>
            <rect x="0" y="0" width="100" height="100" rx="1.5" />
          </clipPath>
          <radialGradient id={`nebula-glow-${constellation.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Sky Map Neatlines & Astronomical Frame */}
        {opts.showGraticule && (
          <g className="neatline-frame">
            <rect x="-0.5" y="-0.5" width="101" height="101" fill="none" stroke="#1e293b" strokeWidth="0.4" />
            <rect x="0" y="0" width="100" height="100" fill="none" stroke="#334155" strokeWidth="0.5" />

            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((t) => (
              <g key={`ticks-${t}`}>
                <line x1={t} y1="0" x2={t} y2={t % 20 === 0 ? '2.5' : '1.5'} stroke="#475569" strokeWidth="0.4" />
                <line x1={t} y1="100" x2={t} y2={t % 20 === 0 ? '97.5' : '98.5'} stroke="#475569" strokeWidth="0.4" />
                <line x1="0" y1={t} x2={t % 20 === 0 ? '2.5' : '1.5'} y2={t} stroke="#475569" strokeWidth="0.4" />
                <line x1="100" y1={t} x2={t % 20 === 0 ? '97.5' : '98.5'} y2={t} stroke="#475569" strokeWidth="0.4" />
              </g>
            ))}

            {isPolar ? (
              // Polar Celestial Grid & Orientation
              <g className="polar-graticule-rings">
                {[18, 36, 54, 72].map((rVal) => (
                  <circle
                    key={`polar-ring-${rVal}`}
                    cx={poleSvg && poleSvg.x >= -30 && poleSvg.x <= 130 ? poleSvg.x : 50}
                    cy={poleSvg && poleSvg.y >= -30 && poleSvg.y <= 130 ? poleSvg.y : 50}
                    r={rVal}
                    fill="none"
                    stroke="#0ea5e9"
                    strokeOpacity="0.09"
                    strokeDasharray="2 3"
                    strokeWidth="0.35"
                  />
                ))}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  const pcX = poleSvg && poleSvg.x >= -30 && poleSvg.x <= 130 ? poleSvg.x : 50;
                  const pcY = poleSvg && poleSvg.y >= -30 && poleSvg.y <= 130 ? poleSvg.y : 50;
                  const px = pcX + 80 * Math.sin(rad);
                  const py = pcY - 80 * Math.cos(rad);
                  return (
                    <line
                      key={`spoke-${deg}`}
                      x1={pcX}
                      y1={pcY}
                      x2={px}
                      y2={py}
                      stroke="#0ea5e9"
                      strokeOpacity="0.07"
                      strokeDasharray="2 3"
                      strokeWidth="0.35"
                    />
                  );
                })}
                {poleSvg && poleSvg.x >= -5 && poleSvg.x <= 105 && poleSvg.y >= -5 && poleSvg.y <= 105 && (
                  <g className="celestial-pole-marker pointer-events-none">
                    <circle cx={poleSvg.x} cy={poleSvg.y} r="3.2" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
                    <line x1={poleSvg.x - 4.5} y1={poleSvg.y} x2={poleSvg.x + 4.5} y2={poleSvg.y} stroke="#38bdf8" strokeWidth="0.45" />
                    <line x1={poleSvg.x} y1={poleSvg.y - 4.5} x2={poleSvg.x} y2={poleSvg.y + 4.5} stroke="#38bdf8" strokeWidth="0.45" />
                    <circle cx={poleSvg.x} cy={poleSvg.y} r="0.8" fill="#facc15" />
                    <text x={poleSvg.x + 4.5} y={poleSvg.y + 1.2} fill="#38bdf8" fontSize="2.2" fontFamily="monospace" fontWeight="bold">
                      {isNorth ? '+90° NCP' : '-90° SCP'}
                    </text>
                  </g>
                )}
                <text x="50" y="4.2" textAnchor="middle" fill="#64748b" fontSize="2.0" fontFamily="monospace" fontWeight="bold" letterSpacing="0.05em">
                  CIRCUMPOLAR PROJECTION • {isNorth ? 'NORTH' : 'SOUTH'} CELESTIAL REALM
                </text>
              </g>
            ) : (
              // Equatorial Graticule
              <>
                {[20, 40, 60, 80].map((c) => (
                  <g key={`grat-${c}`}>
                    <line x1={c} y1="0" x2={c} y2="100" stroke="#0ea5e9" strokeOpacity="0.08" strokeDasharray="1 3" strokeWidth="0.35" />
                    <line x1="0" y1={c} x2="100" y2={c} stroke="#0ea5e9" strokeOpacity="0.08" strokeDasharray="1 3" strokeWidth="0.35" />
                  </g>
                ))}
                <text x="50" y="4.2" textAnchor="middle" fill="#64748b" fontSize="1.9" fontFamily="monospace" fontWeight="bold" letterSpacing="0.05em">
                  ◄ EAST • CONFORMAL STEREOGRAPHIC SKY MAP • WEST ►
                </text>
                {graticule.raLabels.map((ra, idx) => (
                  <text key={`ra-lbl-${idx}`} x={ra.x} y="7.2" textAnchor="middle" fill="#38bdf8" fontSize="2.1" fontFamily="monospace" opacity="0.85">
                    {ra.label}
                  </text>
                ))}
                <text x="2.5" y="96.5" textAnchor="start" fill="#64748b" fontSize="1.9" fontFamily="monospace" fontWeight="bold">
                  DEC
                </text>
                {graticule.decLabels.map((dec, idx) => (
                  <text key={`dec-lbl-${idx}`} x="2.5" y={dec.y + 0.9} textAnchor="start" fill="#38bdf8" fontSize="2.0" fontFamily="monospace" opacity="0.85">
                    {dec.label}
                  </text>
                ))}
              </>
            )}
          </g>
        )}

        {/* 2. Celestial Equator Line (0° Dec) */}
        {!isPolar && opts.showEquatorEcliptic && graticule.hasEquator && (
          <g className="celestial-equator-overlay">
            <line x1="0" y1={graticule.equatorY} x2="100" y2={graticule.equatorY} stroke="#06b6d4" strokeWidth="0.55" strokeDasharray="4 2" strokeOpacity="0.75" />
            <rect x="2" y={graticule.equatorY - 3.2} width="36" height="4.8" rx="1.2" fill="#030712" stroke="#06b6d4" strokeWidth="0.4" strokeOpacity="0.8" />
            <text x="20" y={graticule.equatorY + 0.2} textAnchor="middle" fill="#22d3ee" fontSize="2.3" fontFamily="monospace" fontWeight="bold">0° CELESTIAL EQUATOR</text>
          </g>
        )}

        {/* 3. Ecliptic Line */}
        {!isPolar && opts.showEquatorEcliptic && graticule.hasEcliptic && (
          <g className="ecliptic-overlay">
            {(() => {
              const eclipticPoints: string[] = [];
              const raB = extractBounds(border?.raRange || '', true);
              let startRa = raB[0];
              let endRa = raB[1];
              if (startRa > endRa) endRa += 24;
              startRa -= 1;
              endRa += 1;

              const steps = 24;
              for (let i = 0; i <= steps; i++) {
                const currentRa = startRa + (endRa - startRa) * (i / steps);
                const raDecimal = currentRa % 24;
                const raRadians = (raDecimal / 24) * 2 * Math.PI;
                const eclipticDec = 23.439 * Math.sin(raRadians);

                const pt = projectStereoPoint(raDecimal * 15, eclipticDec, cLon, cLat);
                const svgPt = toSvg(pt.x, pt.y);
                eclipticPoints.push(`${svgPt.x},${svgPt.y}`);
              }

              const midPt = eclipticPoints[Math.floor(steps / 2)].split(',');
              const midX = Math.max(17, Math.min(83, parseFloat(midPt[0])));
              const midY = parseFloat(midPt[1]);

              return (
                <>
                  <polyline points={eclipticPoints.join(' ')} fill="none" stroke="#eab308" strokeWidth="0.55" strokeDasharray="5 2.5" strokeOpacity="0.85" />
                  <rect x={midX - 17} y={midY - 2.8} width="34" height="4.8" rx="1.2" fill="#030712" stroke="#eab308" strokeWidth="0.4" strokeOpacity="0.9" />
                  <text x={midX} y={midY + 0.6} textAnchor="middle" fill="#facc15" fontSize="2.2" fontFamily="monospace" fontWeight="bold">☀️ ECLIPTIC (SOLAR PATH)</text>
                </>
              );
            })()}
          </g>
        )}

        {/* 4. Bordering Constellations on Sky Map */}
        {borderingConstellationsSvg.length > 0 && opts.showNeighborGuides && (
          <g className="bordering-constellations-areas" clipPath={`url(#map-frame-clip-${constellation.id})`}>
            {borderingConstellationsSvg.map((neighbor, nIdx) => (
              <g
                key={`neighbor-group-${nIdx}`}
                className="cursor-pointer group/neighbor"
                onClick={(e) => {
                  e.stopPropagation();
                  if (neighbor.neighborObj && onSelectNeighbor) onSelectNeighbor(neighbor.neighborObj);
                }}
              >
                <title>{`${neighbor.name} (Bordering Constellation • Click to switch to ${neighbor.name} dossier)`}</title>
                <path
                  d={neighbor.pathData}
                  fill="rgba(30, 41, 59, 0.45)"
                  stroke="#475569"
                  strokeWidth="0.5"
                  strokeDasharray="1.5 1"
                  className="transition-colors group-hover/neighbor:fill-cyan-950/70 group-hover/neighbor:stroke-cyan-400"
                />
                <text
                  x={neighbor.badgePos.x}
                  y={neighbor.badgePos.y + 0.7}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="2.2"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  letterSpacing="0.04em"
                  className="pointer-events-none select-none uppercase tracking-wider group-hover/neighbor:fill-cyan-300 transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]"
                >
                  {neighbor.name}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* 5. Delporte Stepped Astronomical Boundary */}
        {opts.showBoundaries && boundaryRingsSvg.length > 0 && (
          <g className="delporte-astronomical-boundary">
            <path
              d={mainBoundaryPathData}
              fill="rgba(6, 182, 212, 0.12)"
              stroke="#06b6d4"
              strokeWidth="0.75"
              strokeDasharray="1.5 1"
            />
            {boundaryCornerPoints.map((pt, idx) => (
              <circle key={`bpt-${idx}`} cx={pt.x} cy={pt.y} r="0.9" fill="#38bdf8" stroke="#020512" strokeWidth="0.3" />
            ))}
          </g>
        )}


        {/* 6. Deep-Sky Objects from dsos.6.json */}
        {opts.showDeepSky && mappedDsos.map((dso: any) => (
          <g key={dso.id} className="cursor-pointer group/dso">
            <title>{`${dso.name}\n${dso.description}`}</title>
            {dso.type === 'sfr' || dso.type === 'snr' || dso.type === 'bn' ? (
              <g>
                <circle cx={dso.x} cy={dso.y} r="3.4" fill={`url(#nebula-glow-${constellation.id})`} />
                <circle cx={dso.x} cy={dso.y} r="1.8" fill="none" stroke="#f43f5e" strokeWidth="0.45" strokeDasharray="1.2 1.2" />
                <text x={dso.x + 3.2} y={dso.y - 1.2} fill="#fb7185" fontSize="2.0" fontFamily="monospace" fontWeight="bold">{dso.name}</text>
              </g>
            ) : dso.type === 's' || dso.type === 'i' ? (
              <g>
                <ellipse cx={dso.x} cy={dso.y} rx="2.8" ry="1.4" transform={`rotate(-25 ${dso.x} ${dso.y})`} fill="none" stroke="#c084fc" strokeWidth="0.45" strokeDasharray="1.2 0.8" />
                <circle cx={dso.x} cy={dso.y} r="0.7" fill="#e9d5ff" />
                <text x={dso.x + 3.4} y={dso.y - 1.0} fill="#d8b4fe" fontSize="2.0" fontFamily="monospace" fontWeight="bold">{dso.name}</text>
              </g>
            ) : (
              <g>
                <circle cx={dso.x} cy={dso.y} r="2.2" fill="none" stroke="#34d399" strokeWidth="0.45" strokeDasharray="0.8 0.8" />
                <circle cx={dso.x} cy={dso.y} r="0.6" fill="#6ee7b7" />
                <text x={dso.x + 3.0} y={dso.y - 1.0} fill="#6ee7b7" fontSize="2.0" fontFamily="monospace" fontWeight="bold">{dso.name}</text>
              </g>
            )}
          </g>
        ))}

        {/* 7. Connecting Asterism Stick Lines from JSON */}
        {multiLineCoords.map((segment: number[][], segIdx: number) => {
          return segment.map((point: number[], ptIdx: number) => {
            if (ptIdx === segment.length - 1) return null;

            let flatFromIdx = 0;
            for (let i = 0; i < segIdx; i++) flatFromIdx += multiLineCoords[i].length;
            flatFromIdx += ptIdx;
            const flatToIdx = flatFromIdx + 1;

            const from = mappedLineVertices[flatFromIdx];
            const to = mappedLineVertices[flatToIdx];
            if (!from || !to) return null;

            return (
              <line
                key={`lg-line-${segIdx}-${ptIdx}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#38bdf8"
                strokeWidth={isLarge ? '0.75' : '1.1'}
                strokeOpacity="0.85"
                strokeLinecap="round"
              />
            );
          });
        })}

        {/* 8. Asterism Figure Vertex Nodes (Unassigned are greyed out) */}
        {mappedLineVertices.map((s: any, starIdx: number) => {
          if (s.isAssigned) return null;
          return (
            <g
              key={`lg-json-star-${starIdx}`}
              className="cursor-default"
              onClick={(e) => {
                e.stopPropagation();
                setActiveStarLabelId?.(null);
              }}
            >
              <title>Unassigned Asterism Vertex</title>
              <circle cx={s.x} cy={s.y} r="1.3" fill="#475569" stroke="#334155" strokeWidth="0.4" opacity="0.45" />
            </g>
          );
        })}

        {/* 9. Interactive Assigned Catalog Stars */}
        {visibleStars.map((s) => {
          const isPrincipal = s.isPrincipal;
          const isClickable = !!s.catalogStar;
          const isAssigned = isClickable;
          const isHovered = hoveredStarId === s.id;
          const isClicked = activeStarLabelId === s.id;

          const baseRadius = isPrincipal
            ? 1.4
            : s.apparentMagnitude < 2.0
            ? 1.1
            : isClickable
            ? (s.apparentMagnitude < 4.0 ? 0.8 : 0.6)
            : 0.5;

          const radius = Math.min(baseRadius, 1.4);

          if (!isAssigned) {
            return (
              <g
                key={s.id}
                className="cursor-default"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveStarLabelId?.(null);
                }}
              >
                <title>{`${s.name} (Unassigned)`}</title>
                <circle cx={s.x} cy={s.y} r={radius} fill="#475569" stroke="#334155" strokeWidth="0.3" opacity="0.4" />
              </g>
            );
          }

          return (
            <g
              key={s.id}
              className="cursor-pointer group/star"
              onClick={(e) => {
                e.stopPropagation();
                if (!isClickable || !s.catalogStar) {
                  setActiveStarLabelId?.(null);
                  return;
                }
                if (onSelectFigureStar) onSelectFigureStar(s.catalogStar);
              }}
              onMouseEnter={() => {
                if (isClickable) setHoveredStarId?.(s.id);
              }}
              onMouseLeave={() => {
                setHoveredStarId?.(null);
              }}
            >
              <title>
                {`${s.catalogStar!.name} (${s.catalogStar!.bayerDesignation || s.catalogStar!.spectralType})\n• Luminosity: ${s.luminositySolar.toLocaleString()} L☉ | Mag: ${s.apparentMagnitude}${
                  s.locationDescription ? `\n• Known Location: ${s.locationDescription}` : ''
                }`}
              </title>

              {/* Click target hit area */}
              <circle cx={s.x} cy={s.y} r="5.5" fill="transparent" />

              {/* Active / Clicked Selection Target Ring */}
              {isClicked && (
                <circle cx={s.x} cy={s.y} r={radius + 0.8} fill="none" stroke="#22d3ee" strokeWidth="0.35" className="pointer-events-none" />
              )}

              {/* Principal Star Golden Radiant Ring */}
              {isPrincipal && (
                <circle cx={s.x} cy={s.y} r={radius + 0.6} fill="none" stroke="#fef08a" strokeWidth="0.3" className="pointer-events-none" />
              )}

              {/* Hover highlight circle */}
              {!isClicked && (
                <circle cx={s.x} cy={s.y} r={radius + 0.8} fill="none" stroke="#38bdf8" strokeWidth="0.3" className="opacity-0 group-hover/star:opacity-100 transition-opacity pointer-events-none" />
              )}

              {/* Star dot node */}
              <circle
                cx={s.x} cy={s.y} r={radius}
                fill={isPrincipal ? '#fef08a' : s.catalogStar?.colorHex ? s.catalogStar.colorHex : '#ffffff'}
                stroke={isPrincipal ? '#f59e0b' : isClicked ? '#38bdf8' : '#38bdf8'}
                strokeWidth={isPrincipal ? '0.4' : isClicked ? '0.4' : '0.25'}
                className="group-hover/star:stroke-cyan-300 group-hover/star:fill-cyan-100 transition-colors"
              />
            </g>
          );
        })}

        {/* 10. Star Name Labels (when showStarLabels toggle is on, for non-hovered stars) */}
        {opts.showStarLabels && visibleStars.map((s) => {
          const isAssigned = !!s.catalogStar;
          const isHovered = hoveredStarId === s.id;
          const isClicked = activeStarLabelId === s.id;
          if (!isAssigned || isHovered || isClicked || !s.displayLabel) return null;

          const isPrincipal = s.isPrincipal;
          const radius = isPrincipal ? 1.4 : s.apparentMagnitude < 2.0 ? 1.1 : (s.apparentMagnitude < 4.0 ? 0.8 : 0.6);
          const charWidth = 1.05;
          const padX = 1.4;
          const labelWidth = Math.max(5.0, s.displayLabel.length * charWidth + padX * 2);
          const labelX = Math.max(labelWidth / 2 + 1, Math.min(100 - labelWidth / 2 - 1, s.x));
          const isAbove = s.y > 6.5;
          const labelY = isAbove ? s.y - radius - 1.5 : s.y + radius + 3.5;
          const rectH = 3.0;

          return (
            <g key={`static-lbl-${s.id}`} className="pointer-events-none select-none opacity-80">
              <rect
                x={labelX - labelWidth / 2}
                y={labelY - (rectH - 0.8)}
                width={labelWidth}
                height={rectH}
                rx="0.8"
                fill="#020617"
                fillOpacity="0.92"
                stroke={isPrincipal ? '#facc15' : '#0ea5e9'}
                strokeWidth="0.3"
                className="drop-shadow-sm"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                fill={isPrincipal ? '#fef08a' : '#f8fafc'}
                fontSize={isPrincipal ? '1.9' : '1.6'}
                fontFamily="sans-serif"
                fontWeight="600"
                className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
              >
                {s.displayLabel}
              </text>
            </g>
          );
        })}

        {/* 11. VERY FRONT SVG LAYER: Active or Hovered Star Label */}
        {(() => {
          const frontStar = visibleStars.find((s) => s.id === hoveredStarId) ||
                            visibleStars.find((s) => s.id === activeStarLabelId);
          if (!frontStar || !frontStar.catalogStar || !frontStar.displayLabel) return null;

          const isPrincipal = frontStar.isPrincipal;
          const isClicked = activeStarLabelId === frontStar.id;
          const radius = isPrincipal ? 1.4 : frontStar.apparentMagnitude < 2.0 ? 1.1 : (frontStar.apparentMagnitude < 4.0 ? 0.8 : 0.6);
          const charWidth = 1.05;
          const padX = 1.4;
          const labelWidth = Math.max(5.0, frontStar.displayLabel.length * charWidth + padX * 2);
          const labelX = Math.max(labelWidth / 2 + 1, Math.min(100 - labelWidth / 2 - 1, frontStar.x));
          const isAbove = frontStar.y > 6.5;
          const labelY = isAbove ? frontStar.y - radius - 1.5 : frontStar.y + radius + 3.5;
          const rectH = 3.2;

          return (
            <g key={`front-lbl-${frontStar.id}`} className="pointer-events-none select-none z-50">
              {/* Pointer notch */}
              {isAbove ? (
                <polygon
                  points={`${frontStar.x - 0.7},${labelY + 0.2} ${frontStar.x + 0.7},${labelY + 0.2} ${frontStar.x},${labelY + 1.0}`}
                  fill={isClicked ? '#38bdf8' : isPrincipal ? '#facc15' : '#0ea5e9'}
                />
              ) : (
                <polygon
                  points={`${frontStar.x - 0.7},${labelY - rectH - 0.2} ${frontStar.x + 0.7},${labelY - rectH - 0.2} ${frontStar.x},${labelY - rectH - 1.0}`}
                  fill={isClicked ? '#38bdf8' : isPrincipal ? '#facc15' : '#0ea5e9'}
                />
              )}
              <rect
                x={labelX - labelWidth / 2}
                y={labelY - (rectH - 0.8)}
                width={labelWidth}
                height={rectH}
                rx="0.9"
                fill="#020617"
                fillOpacity="0.98"
                stroke={isClicked ? '#38bdf8' : isPrincipal ? '#facc15' : '#38bdf8'}
                strokeWidth="0.45"
                className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                fill={isClicked ? '#38bdf8' : isPrincipal ? '#fef08a' : '#ffffff'}
                fontSize={isPrincipal ? '2.0' : '1.7'}
                fontFamily="sans-serif"
                fontWeight="bold"
                className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
              >
                {frontStar.displayLabel}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
};
