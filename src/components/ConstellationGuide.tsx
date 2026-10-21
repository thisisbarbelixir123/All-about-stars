import React, { useState, useMemo, useRef, useEffect } from 'react';
import { StarData } from '../types';
import { STARS_CATALOG } from '../data/stars';
import {
  ALL_88_CONSTELLATIONS,
  ConstellationInfo,
  WHAT_ARE_CONSTELLATIONS_INFO,
  ZODIAC_13_EXPLAINER,
  ZODIAC_13_SIGNS,
  MYTHBUSTER_INFO,
  resolveConstellationByName,
  getNeighborAbbr
} from '../data/constellationsData';
import {
  parseStarLabel,
  computeCelestialGraticule
} from '../data/skyMapAtlasData';
import {
  EXTRA_CATALOG_FIGURE_STARS,
  STAR_CONSTELLATION_LOCATIONS
} from '../data/catalogStarsConstellationLocations';
import { StarDot2D } from './StarDot2D';
import {
  Sparkles,
  Compass,
  Search,
  BookOpen,
  HelpCircle,
  Info,
  ChevronRight,
  Layers,
  Calendar,
  Globe,
  Star,
  Crosshair,
  Grid,
  X,
  Navigation,
  Tag,
  Orbit
} from 'lucide-react';

interface ConstellationGuideProps {
  onSelectStar: (star: StarData) => void;
  onCompareStar?: (star: StarData) => void;
}

export const ConstellationGuide: React.FC<ConstellationGuideProps> = ({
  onSelectStar,
  onCompareStar
}) => {
  const [activeTab, setActiveTab] = useState<'what-are' | 'all-88' | 'zodiac-13' | 'mythbuster'>('what-are');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHemisphere, setSelectedHemisphere] = useState<string>('all');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'area-desc' | 'brightest'>('name');
  const [cardDensity, setCardDensity] = useState<'compact' | 'standard'>('compact');

  const [inspectedConstellation, setInspectedConstellation] = useState<ConstellationInfo | null>(null);
  const dossierScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inspectedConstellation && dossierScrollRef.current) {
      dossierScrollRef.current.scrollTop = 0;
    }
  }, [inspectedConstellation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && inspectedConstellation) {
        setInspectedConstellation(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inspectedConstellation]);

  const [calcMonth, setCalcMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [calcDay, setCalcDay] = useState<number>(() => new Date().getDate());

  const [skyMapOptions, setSkyMapOptions] = useState({
    showGraticule: true,
    showBoundaries: true,
    showStarLabels: true,
    showEquatorEcliptic: true,
    showDeepSky: true,
    showNeighborGuides: true
  });

  const [celestialData, setCelestialData] = useState<{
    dsos: any[];
    lines: any[];
    starNames: Record<string, any>;
  }>({ dsos: [], lines: [], starNames: {} });

  // Bulletproof JSON Fetch: Safely handles both arrays and FeatureCollections from the public folder, and ignores HTML fallbacks
  useEffect(() => {
    const safeFetch = async (url: string) => {
      try {
        const res = await fetch(url);
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          return await res.json();
        }
        return null;
      } catch (err) {
        return null;
      }
    };

    const loadAll = async () => {
      const [dsoJson, linesJson, namesJson] = await Promise.all([
        safeFetch('/data/dsos.6_2.json'),
        safeFetch('/data/constellations.lines.json'),
        safeFetch('/data/starnames_2.json')
      ]);

      setCelestialData({
        dsos: dsoJson ? (Array.isArray(dsoJson) ? dsoJson : (dsoJson.features || [])) : [],
        lines: linesJson ? (Array.isArray(linesJson) ? linesJson : (linesJson.features || [])) : [],
        starNames: namesJson || {}
      });
    };

    loadAll();
  }, []);

  const starMap = useMemo(() => {
    return new Map(STARS_CATALOG.map((s) => [s.id, s]));
  }, []);

  const filteredConstellations = useMemo(() => {
    return ALL_88_CONSTELLATIONS.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesEnglish = c.englishName.toLowerCase().includes(q);
        const matchesStar = c.principalStarName.toLowerCase().includes(q);
        const matchesAbbr = c.abbreviation.toLowerCase().includes(q);
        const matchesSectors = c.borders.sectors?.some(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.shortCode.toLowerCase().includes(q) ||
            s.englishName.toLowerCase().includes(q)
        );
        const matchesSerpensAlias =
          c.id === 'serpens' &&
          (q.includes('caput') ||
            q.includes('cauda') ||
            q.includes('ser-cap') ||
            q.includes('ser-cau'));
        if (!matchesName && !matchesEnglish && !matchesStar && !matchesAbbr && !matchesSectors && !matchesSerpensAlias) {
          return false;
        }
      }
      if (selectedHemisphere !== 'all' && c.hemisphere !== selectedHemisphere) return false;
      if (selectedFamily !== 'all') {
        if (selectedFamily === 'zodiac-only' && !c.isZodiac) return false;
        if (selectedFamily !== 'zodiac-only' && c.family !== selectedFamily) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'area-desc') return b.areaSqDeg - a.areaSqDeg;
      if (sortBy === 'brightest') return a.brightestMagnitude - b.brightestMagnitude;
      return 0;
    });
  }, [searchQuery, selectedHemisphere, selectedFamily, sortBy]);

  const birthdayResult = useMemo(() => {
    const m = calcMonth;
    const d = calcDay;
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
  }, [calcMonth, calcDay]);

  // Helper to convert formatted string coordinates ("22h 05m 47s" or "-00° 19′ 11″") into true decimal numbers
  const parseCoordinate = (val: any): number => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const str = String(val).replace(/−/g, '-').trim();
    const match = str.match(/^([+-]?\d+)[h°]\s*(?:(\d+)[m′'])?\s*(?:([\d.]+)[s″"])?/);
    if (match) {
      const d = Math.abs(parseInt(match[1], 10));
      const m = match[2] ? parseInt(match[2], 10) / 60 : 0;
      const s = match[3] ? parseFloat(match[3]) / 3600 : 0;
      const sign = match[1].startsWith('-') ? -1 : 1;
      return sign * (d + m + s);
    }
    return parseFloat(str) || 0;
  };

  // Robust multi-coordinate extractor that finds ALL ranges and returns absolute min and max
  const extractBounds = (rangeStr: string, isRa: boolean): [number, number] => {
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

  // Pure Cartesian Equirectangular Projection Engine
  // This maps the stars precisely to the linear SVG coordinates used to draw the boundary polygons
  const projectTo2D = (
    points: any[], 
    raBounds: number[], 
    decBounds: number[], 
    pMinX = 15, pMaxX = 85, pMinY = 15, pMaxY = 85, 
    preserveAspect = false
  ) => {
    if (!points || points.length === 0) return { mappedPoints: [] };

    let rMin = raBounds[0];
    let rMax = raBounds[1];
    let dMin = Math.min(decBounds[0], decBounds[1]);
    let dMax = Math.max(decBounds[0], decBounds[1]);

    let raSpan = rMax - rMin;
    if (raSpan < 0) {
      raSpan += 24;
      rMax += 24;
    }

    if (preserveAspect) {
      let width = pMaxX - pMinX;
      let height = pMaxY - pMinY;
      const midDec = ((dMin + dMax) / 2) * (Math.PI / 180);
      const raDegrees = raSpan * 15 * Math.cos(midDec);
      const decDegrees = dMax - dMin;
      
      const physicalRatio = Math.abs(raDegrees / (decDegrees || 1));
      const currentRatio = width / height;
      
      if (physicalRatio > currentRatio) {
        const newHeight = width / physicalRatio;
        const yOffset = (height - newHeight) / 2;
        pMinY += yOffset;
        pMaxY -= yOffset;
      } else {
        const newWidth = height * physicalRatio;
        const xOffset = (width - newWidth) / 2;
        pMinX += xOffset;
        pMaxX -= xOffset;
      }
    }

    const mappedPoints = points.map(s => {
      let sRa = s.ra ?? 0;
      if (rMax > 24 && sRa < 12) sRa += 24;
      if (sRa < rMin && rMax > 24) sRa += 24;

      const xRatio = (sRa - rMin) / (raSpan || 1);
      const x = pMaxX - (xRatio * (pMaxX - pMinX));

      const yRatio = ((s.dec ?? 0) - dMin) / ((dMax - dMin) || 1);
      const y = pMaxY - (yRatio * (pMaxY - pMinY));

      return {
        ...s,
        originalRa: s.ra,
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10
      };
    });

    return { mappedPoints };
  };

  const buildOrthogonalBoundary = (polygon: Array<{ x: number; y: number }>): { pathData: string; orthogonalPoints: Array<{ x: number; y: number }>; } => {
    if (!polygon || polygon.length === 0) return { pathData: '', orthogonalPoints: [] };
    const orthogonalPoints: Array<{ x: number; y: number }> = [];
    const n = polygon.length;

    for (let i = 0; i < n; i++) {
      const curr = polygon[i];
      const next = polygon[(i + 1) % n];
      if (orthogonalPoints.length === 0 || orthogonalPoints[orthogonalPoints.length - 1].x !== curr.x || orthogonalPoints[orthogonalPoints.length - 1].y !== curr.y) {
        orthogonalPoints.push({ x: curr.x, y: curr.y });
      }
      if (curr.x !== next.x && curr.y !== next.y) {
        orthogonalPoints.push({ x: next.x, y: curr.y });
      }
    }

    if (orthogonalPoints.length === 0) return { pathData: '', orthogonalPoints: [] };
    let d = `M ${orthogonalPoints[0].x} ${orthogonalPoints[0].y}`;
    for (let i = 1; i < orthogonalPoints.length; i++) {
      const pt = orthogonalPoints[i];
      const prev = orthogonalPoints[i - 1];
      if (pt.y === prev.y) d += ` H ${pt.x}`;
      else if (pt.x === prev.x) d += ` V ${pt.y}`;
      else d += ` H ${pt.x} V ${pt.y}`;
    }
    const last = orthogonalPoints[orthogonalPoints.length - 1];
    const start = orthogonalPoints[0];
    if (last.x !== start.x && last.y !== start.y) d += ` H ${start.x} V ${start.y}`;
    else if (last.y === start.y && last.x !== start.x) d += ` H ${start.x}`;
    else if (last.x === start.x && last.y !== start.y) d += ` V ${start.y}`;
    d += ' Z';
    return { pathData: d, orthogonalPoints };
  };

  // SVG Renderer for Normal Asterism Mode (Small Map)
  const renderNormalAsterism = (constellation: ConstellationInfo, size = 110, className = '') => {
    const cCatalogStars = STARS_CATALOG.filter(s => 
      s.constellation.toLowerCase() === constellation.id.toLowerCase() || 
      s.constellation.toLowerCase() === constellation.name.toLowerCase()
    ).map(s => ({
      ...s,
      ra: parseCoordinate((s as any).rightAscension || (s as any).ra),
      dec: parseCoordinate((s as any).declination || (s as any).dec)
    }));
    
    // Robust, crash-proof case-insensitive JSON extraction
    const lineFeature = (celestialData.lines || []).find((f: any) => {
      const abbr = constellation.abbreviation.toLowerCase();
      const name = constellation.name.toLowerCase();
      const fid = (f.id || '').toLowerCase();
      const pid = (f.properties?.id || '').toLowerCase();
      const pname = (f.properties?.name || '').toLowerCase();
      return fid === abbr || pid === abbr || pname === name || pname === abbr;
    });
    
    let multiLineCoords: number[][][] = [];
    if (lineFeature?.geometry?.type === 'MultiLineString') {
      multiLineCoords = lineFeature.geometry.coordinates;
    } else if (lineFeature?.geometry?.type === 'LineString') {
      multiLineCoords = [lineFeature.geometry.coordinates];
    }

    // JSON RA is typically provided in degrees (0-360) and sometimes negated in D3.
    const jsonStars = multiLineCoords.reduce((acc, val) => acc.concat(val), []).map((coord, idx) => {
      let r = coord[0]; if (r < 0) r += 360;
      return { id: `json-${idx}`, ra: r / 15, dec: coord[1] };
    });
    
    // 🌐 ROBUST MATH ANCHOR: Use the exact corners of the official RA/Dec boundary.
    const border = constellation.borders;
    const smRaBounds = extractBounds(border?.raRange || '', true);
    const smDecBounds = extractBounds(border?.decRange || '', false);

    // 🌐 ROBUST MATH ANCHOR: Scale using Cartesian Equirectangular, preserving true visual shape
    const { mappedPoints } = projectTo2D([...jsonStars, ...cCatalogStars], smRaBounds, smDecBounds, 15, 85, 15, 85, true);
    
    const mappedLineVertices = mappedPoints.slice(0, jsonStars.length);
    const mappedCatalog = mappedPoints.slice(jsonStars.length);

    // 🧲 VERTEX SNAPPING (Small Map): Snap JSON lines to the exact center of Catalog Stars
    mappedLineVertices.forEach((vertex) => {
      let bestMatch: any = null;
      let maxBrightness = Infinity; 
      mappedCatalog.forEach((catStar: any) => {
        const dist = Math.hypot(vertex.x - catStar.x, vertex.y - catStar.y);
        if (dist < 8.0) { // Increased magnet radius to catch distant imprecise JSON vertices (e.g. Skat)
          if (catStar.apparentMagnitude < maxBrightness) {
            maxBrightness = catStar.apparentMagnitude;
            bestMatch = catStar;
          }
        }
      });
      if (bestMatch) { vertex.x = bestMatch.x; vertex.y = bestMatch.y; }
    });

    return (
      <svg viewBox="0 0 100 100" width={size} height={size} className={`overflow-visible drop-shadow-[0_0_8px_rgba(6,182,212,0.35)] ${className}`}>
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(56, 189, 248, 0.07)" strokeDasharray="2 3" />
        <line x1="50" y1="8" x2="50" y2="92" stroke="rgba(56, 189, 248, 0.05)" />
        <line x1="8" y1="50" x2="92" y2="50" stroke="rgba(56, 189, 248, 0.05)" />

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

            const raDiff = Math.abs(from.ra - to.ra);
            let x1 = from.x, y1 = from.y, x2 = to.x, y2 = to.y;

            if (raDiff > 12 && Math.abs(x1 - x2) > 40) {
              const seamX = x1 < x2 ? 0 : 100;
              const otherSeamX = x1 < x2 ? 100 : 0;
              const t = (seamX - x1) / ((x2 - 100 * Math.sign(x2 - x1)) - x1 || 1);
              const midY = y1 + (y2 - y1) * Math.max(0, Math.min(1, Math.abs(t)));

              return (
                <g key={`sm-line-${segIdx}-${ptIdx}`}>
                  <line x1={x1} y1={y1} x2={seamX} y2={midY} stroke="#38bdf8" strokeWidth="0.85" strokeOpacity="0.85" strokeLinecap="round" />
                  <line x1={otherSeamX} y1={midY} x2={x2} y2={y2} stroke="#38bdf8" strokeWidth="0.85" strokeOpacity="0.85" strokeLinecap="round" />
                </g>
              );
            }
            return (
              <line key={`sm-line-${segIdx}-${ptIdx}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38bdf8" strokeWidth="0.85" strokeOpacity="0.85" strokeLinecap="round" />
            );
          });
        })}

        {/* Draw the geometric constellation figure nodes */}
        {mappedLineVertices.map((s: any, starIdx: number) => (
          <g key={`sm-json-star-${starIdx}`}>
            <circle cx={s.x} cy={s.y} r="1.4" fill="#ffffff" stroke="#38bdf8" strokeWidth="0.5" className="pointer-events-none" />
          </g>
        ))}

        {/* Draw the brilliant primary catalog stars over the top */}
        {mappedCatalog.map((s: any, starIdx: number) => {
          const isPrincipal = s.id === constellation.principalStarId;
          return (
            <g key={`cat-${starIdx}`}>
              {isPrincipal && <circle cx={s.x} cy={s.y} r="4.5" fill="#06b6d4" fillOpacity="0.3" className="animate-pulse pointer-events-none" />}
              <circle cx={s.x} cy={s.y} r={isPrincipal ? 2.6 : 1.2} fill={isPrincipal ? '#fef08a' : '#ffffff'} stroke={isPrincipal ? '#06b6d4' : '#38bdf8'} strokeWidth="0.5" className="pointer-events-none" />
            </g>
          );
        })}
      </svg>
    );
  };

  const getConstellationVisibleFigureStars = (
    constellation: ConstellationInfo, 
    mappedCatalog: any[], 
    mappedExtra: any[], 
    cCatalogStars: StarData[], 
    extraFigureStars: any[]
  ): { visibleStars: any[]; catalogPlacedCount: number } => {
    let candidates = [
      ...mappedCatalog.map((s, idx) => {
        const catalogStar = cCatalogStars[idx];
        return {
          id: `asterism-${idx}`, x: s.x, y: s.y, name: catalogStar.name, displayLabel: parseStarLabel(catalogStar.name).displayLabel, isPrincipal: catalogStar.id === constellation.principalStarId,
          catalogStar, apparentMagnitude: catalogStar.apparentMagnitude, luminositySolar: catalogStar.luminositySolar, locationDescription: STAR_CONSTELLATION_LOCATIONS[catalogStar.id],
        };
      }),
      ...mappedExtra.map((es, idx) => {
        const extraData = extraFigureStars[idx];
        const catalogStar = STARS_CATALOG.find((cs) => cs.id === extraData.catalogStarId) || null;
        return {
          id: `extra-${idx}`, x: es.x, y: es.y, name: catalogStar?.name || extraData.name, displayLabel: (catalogStar?.name || extraData.name).replace(/\s*\([^)]+\)/g, ''),
          isPrincipal: false, catalogStar, apparentMagnitude: catalogStar?.apparentMagnitude || extraData.mag || 5.0, luminositySolar: catalogStar?.luminositySolar || 1.0, locationDescription: extraData.locationDescription || (catalogStar ? STAR_CONSTELLATION_LOCATIONS[catalogStar.id] : undefined),
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
      
      // Exclude overlapping stars entirely, keeping only the brightest (first encountered due to sort)
      const isOverlapping = visibleStars.some((acc) => Math.hypot(acc.x - cand.x, acc.y - cand.y) < 3.0);
      
      if (!isOverlapping) {
        visibleStars.push(cand);
        if (cand.catalogStar) seenCatalogIds.add(cand.catalogStar.id);
        if (cleanName) seenNames.add(cleanName);
      }
    }
    
    return { visibleStars, catalogPlacedCount: visibleStars.filter((s) => !!s.catalogStar).length };
  };

  // SVG Renderer for Main Map Panel (Large Dossier View)
  const renderConstellationShape = (constellation: ConstellationInfo, size = 120, className = '', onSelectNeighbor?: (neighbor: ConstellationInfo) => void, customOptions?: Partial<typeof skyMapOptions>, onSelectFigureStar?: (starData: StarData) => void) => {
    const isLarge = size >= 260;
    const opts = {
      showGraticule: customOptions?.showGraticule ?? (isLarge ? skyMapOptions.showGraticule : false), showBoundaries: customOptions?.showBoundaries ?? (isLarge ? skyMapOptions.showBoundaries : true),
      showStarLabels: customOptions?.showStarLabels ?? (isLarge ? skyMapOptions.showStarLabels : false), showEquatorEcliptic: customOptions?.showEquatorEcliptic ?? (isLarge ? skyMapOptions.showEquatorEcliptic : false),
      showDeepSky: customOptions?.showDeepSky ?? (isLarge ? skyMapOptions.showDeepSky : false), showNeighborGuides: customOptions?.showNeighborGuides ?? (isLarge ? skyMapOptions.showNeighborGuides : true),
    };
    
    const border = constellation.borders;
    const basePolygon = border?.boundaryPolygon || [];
    const neighbors = border?.borderingConstellations || [];
    const neighborCount = neighbors.length;
    const graticule = computeCelestialGraticule(border?.raRange || '', border?.decRange || '', constellation.isZodiac, constellation.id);

    const lineFeature = (celestialData.lines || []).find((f: any) => 
      (f.id || '').toLowerCase() === constellation.abbreviation.toLowerCase() ||
      (f.properties?.id || '').toLowerCase() === constellation.abbreviation.toLowerCase() ||
      (f.properties?.name || '').toLowerCase() === constellation.name.toLowerCase()
    );
    
    let multiLineCoords: number[][][] = [];
    if (lineFeature?.geometry?.type === 'MultiLineString') {
      multiLineCoords = lineFeature.geometry.coordinates;
    } else if (lineFeature?.geometry?.type === 'LineString') {
      multiLineCoords = [lineFeature.geometry.coordinates];
    }
    
    const jsonStars = multiLineCoords.reduce((acc, val) => acc.concat(val), []).map((coord, idx) => {
      let r = coord[0]; if (r < 0) r += 360;
      return { id: `json-${idx}`, ra: r / 15, dec: coord[1] };
    });

    const raBounds = extractBounds(border?.raRange || '', true);
    const decBounds = extractBounds(border?.decRange || '', false);
    
    const localRawDsos = (celestialData.dsos || []).filter(dso => {
      if (!dso.geometry?.coordinates) return false;
      let r = dso.geometry.coordinates[0]; if (r < 0) r += 360;
      const dsoRaHours = r / 15; 
      const dsoDec = dso.geometry.coordinates[1];
      const inDec = dsoDec >= Math.min(decBounds[0], decBounds[1]) && dsoDec <= Math.max(decBounds[0], decBounds[1]);
      let inRa = false;
      if (raBounds[0] > raBounds[1]) inRa = dsoRaHours >= raBounds[0] || dsoRaHours <= raBounds[1];
      else inRa = dsoRaHours >= raBounds[0] && dsoRaHours <= raBounds[1];
      return inRa && inDec;
    }).map(dso => {
      let r = dso.geometry.coordinates[0]; if (r < 0) r += 360;
      return {
        id: dso.id, name: dso.properties.desig, type: dso.properties.type, mag: dso.properties.mag,
        ra: r / 15, dec: dso.geometry.coordinates[1], description: `Mag: ${dso.properties.mag} | Type: ${dso.properties.type}`
      };
    });

    const cCatalogStars = STARS_CATALOG.filter(s => 
      s.constellation.toLowerCase() === constellation.id.toLowerCase() || 
      s.constellation.toLowerCase() === constellation.name.toLowerCase()
    ).map(s => ({
      ...s,
      ra: parseCoordinate((s as any).rightAscension || (s as any).ra),
      dec: parseCoordinate((s as any).declination || (s as any).dec)
    }));
    
    const extraFigureStars = (EXTRA_CATALOG_FIGURE_STARS[constellation.id] || [])
      .map((extra: any) => {
        const catalogMatch = STARS_CATALOG.find(s => s.id === extra.catalogStarId);
        if (!catalogMatch) return null;
        return {
          ...extra,
          ra: parseCoordinate((catalogMatch as any).rightAscension || (catalogMatch as any).ra),
          dec: parseCoordinate((catalogMatch as any).declination || (catalogMatch as any).dec)
        };
      })
      .filter(Boolean);
    
    const pMinX = basePolygon.length > 0 ? Math.min(...basePolygon.map(p => p.x)) : 15;
    const pMaxX = basePolygon.length > 0 ? Math.max(...basePolygon.map(p => p.x)) : 85;
    const pMinY = basePolygon.length > 0 ? Math.min(...basePolygon.map(p => p.y)) : 15;
    const pMaxY = basePolygon.length > 0 ? Math.max(...basePolygon.map(p => p.y)) : 85;

    const allSecondary = [...jsonStars, ...localRawDsos, ...cCatalogStars, ...extraFigureStars];

    // 🌐 ROBUST MATH ANCHOR: Project and perfectly scale all stars inside the Cartesian bounding box
    const { mappedPoints } = projectTo2D(allSecondary, raBounds, decBounds, pMinX, pMaxX, pMinY, pMaxY, false);
    
    let offset = 0;
    const mappedLineVertices = mappedPoints.slice(offset, offset + jsonStars.length); offset += jsonStars.length;
    const mappedDsos = mappedPoints.slice(offset, offset + localRawDsos.length); offset += localRawDsos.length;
    const mappedCatalog = mappedPoints.slice(offset, offset + cCatalogStars.length); offset += cCatalogStars.length;
    const mappedExtra = mappedPoints.slice(offset, offset + extraFigureStars.length);

    // 🧲 VERTEX SNAPPING
    mappedLineVertices.forEach((vertex) => {
      let bestMatch: any = null;
      let maxBrightness = Infinity; 
      mappedCatalog.forEach((catStar: any) => {
        const dist = Math.hypot(vertex.x - catStar.x, vertex.y - catStar.y);
        if (dist < 8.0) { // Increased magnet radius to catch distant imprecise JSON vertices (e.g. Skat)
          if (catStar.apparentMagnitude < maxBrightness) {
            maxBrightness = catStar.apparentMagnitude;
            bestMatch = catStar;
          }
        }
      });
      if (bestMatch) { vertex.x = bestMatch.x; vertex.y = bestMatch.y; }
    });

    const activePolygon = basePolygon.map(p => ({ ...p }));
    const { pathData: boundaryPathData, orthogonalPoints: orthoBoundaryPoints } = buildOrthogonalBoundary(activePolygon);
    const { visibleStars, catalogPlacedCount } = getConstellationVisibleFigureStars(constellation, mappedCatalog, mappedExtra, cCatalogStars, extraFigureStars);

    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <svg viewBox="-16 -12 132 124" width={size} height={size} className={`overflow-visible drop-shadow-[0_0_12px_rgba(6,182,212,0.25)] ${className}`}>
          <defs>
            <radialGradient id={`star-glow-${constellation.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
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
                  <line x1={t} y1="0" x2={t} y2={t % 20 === 0 ? "2.5" : "1.5"} stroke="#475569" strokeWidth="0.4" />
                  <line x1={t} y1="100" x2={t} y2={t % 20 === 0 ? "97.5" : "98.5"} stroke="#475569" strokeWidth="0.4" />
                  <line x1="0" y1={t} x2={t % 20 === 0 ? "2.5" : "1.5"} y2={t} stroke="#475569" strokeWidth="0.4" />
                  <line x1="100" y1={t} x2={t % 20 === 0 ? "97.5" : "98.5"} y2={t} stroke="#475569" strokeWidth="0.4" />
                </g>
              ))}

              {[20, 40, 60, 80].map((c) => (
                <g key={`grat-${c}`}>
                  <line x1={c} y1="0" x2={c} y2="100" stroke="#0ea5e9" strokeOpacity="0.08" strokeDasharray="1 3" strokeWidth="0.35" />
                  <line x1="0" y1={c} x2="100" y2={c} stroke="#0ea5e9" strokeOpacity="0.08" strokeDasharray="1 3" strokeWidth="0.35" />
                </g>
              ))}

              <text x="50" y="-7.5" textAnchor="middle" fill="#64748b" fontSize="2.4" fontFamily="monospace" fontWeight="bold" letterSpacing="0.05em">
                ◄ EAST (INCREASING RA) • RIGHT ASCENSION • WEST ►
              </text>
              {graticule.raLabels.map((ra, idx) => (
                <text key={`ra-lbl-${idx}`} x={ra.x} y="-2" textAnchor="middle" fill="#38bdf8" fontSize="2.5" fontFamily="monospace" opacity="0.85">
                  {ra.label}
                </text>
              ))}

              <text x="-12" y="50" textAnchor="middle" transform="rotate(-90 -12 50)" fill="#64748b" fontSize="2.3" fontFamily="monospace" fontWeight="bold" letterSpacing="0.05em">
                ▲ +N (NORTH) • DECLINATION • -S ▼
              </text>
              {graticule.decLabels.map((dec, idx) => (
                <text key={`dec-lbl-${idx}`} x="-2" y={dec.y + 0.9} textAnchor="end" fill="#38bdf8" fontSize="2.4" fontFamily="monospace" opacity="0.85">
                  {dec.label}
                </text>
              ))}
            </g>
          )}

          {/* 2. Celestial Equator Line (0° Dec) */}
          {opts.showEquatorEcliptic && graticule.hasEquator && (
            <g className="celestial-equator-overlay">
              <line x1="0" y1={graticule.equatorY} x2="100" y2={graticule.equatorY} stroke="#06b6d4" strokeWidth="0.55" strokeDasharray="4 2" strokeOpacity="0.75" />
              <rect x="2" y={graticule.equatorY - 3.2} width="36" height="4.8" rx="1.2" fill="#030712" stroke="#06b6d4" strokeWidth="0.4" strokeOpacity="0.8" />
              <text x="20" y={graticule.equatorY + 0.2} textAnchor="middle" fill="#22d3ee" fontSize="2.3" fontFamily="monospace" fontWeight="bold">0° CELESTIAL EQUATOR</text>
            </g>
          )}

          {/* 3. Ecliptic Line (Path of the Sun across Zodiac constellations) */}
          {opts.showEquatorEcliptic && graticule.hasEcliptic && (
            <g className="ecliptic-overlay">
              <line x1="0" y1={graticule.eclipticY1} x2="100" y2={graticule.eclipticY2} stroke="#eab308" strokeWidth="0.55" strokeDasharray="5 2.5" strokeOpacity="0.85" />
              <rect x="62" y={(graticule.eclipticY1 + graticule.eclipticY2) / 2 - 2.8} width="34" height="4.8" rx="1.2" fill="#030712" stroke="#eab308" strokeWidth="0.4" strokeOpacity="0.9" />
              <text x="79" y={(graticule.eclipticY1 + graticule.eclipticY2) / 2 + 0.6} textAnchor="middle" fill="#facc15" fontSize="2.2" fontFamily="monospace" fontWeight="bold">☀️ ECLIPTIC (SOLAR PATH)</text>
            </g>
          )}

          {/* 4. Delporte Stepped Astronomical Boundaries */}
          {opts.showBoundaries && (
            <>
              {constellation.id === 'serpens' && border?.sectors ? (
                <g className="serpens-dual-sectors">
                  {border.sectors.map((sec, sIdx) => {
                    const { pathData: secPathData, orthogonalPoints: secOrthoPoints } = buildOrthogonalBoundary(sec.boundaryPolygon);
                    const isCaput = sec.shortCode === 'Ser-Cap';
                    return (
                      <g key={`sec-${sIdx}`}>
                        <path d={secPathData} fill="rgba(6, 182, 212, 0.12)" stroke="#06b6d4" strokeWidth="0.65" strokeDasharray="2.5 1.5" />
                        {secOrthoPoints.map((pt, idx) => (
                          <g key={`sec-pt-${sIdx}-${idx}`}><circle cx={pt.x} cy={pt.y} r="1.0" fill="#06b6d4" stroke="#020512" strokeWidth="0.35" /></g>
                        ))}
                        <rect x={isCaput ? 7 : 53} y={isCaput ? 8.5 : 85.5} width="40" height="6.8" rx="1.8" fill="#020512" stroke="#06b6d4" strokeWidth="0.45" />
                        <text x={isCaput ? 27 : 73} y={isCaput ? 13.0 : 90.0} textAnchor="middle" fill="#38bdf8" fontSize="2.1" fontFamily="monospace" fontWeight="bold">{sec.name} ({sec.shortCode})</text>
                      </g>
                    );
                  })}
                  <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(148, 163, 184, 0.35)" strokeDasharray="2 2" strokeWidth="0.45" />
                  {(() => {
                    const ophObj = resolveConstellationByName('Ophiuchus');
                    return (
                      <g className={onSelectNeighbor && ophObj ? 'cursor-pointer group/oph' : 'cursor-default group/oph'} onClick={(e) => { e.stopPropagation(); if (onSelectNeighbor && ophObj) onSelectNeighbor(ophObj); }}>
                        <title>Ophiuchus (Constellation dividing Serpens into Caput and Cauda) • Click to open Ophiuchus</title>
                        <rect x="37" y="42" width="26" height="16" rx="3.5" fill="#04091c" stroke="#38bdf8" strokeWidth="0.6" className="group-hover/oph:fill-cyan-950/90 group-hover/oph:stroke-cyan-300 transition-colors shadow-lg" />
                        <rect x="38.5" y="43.5" width="23" height="13" rx="2.5" fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="0.3" className="pointer-events-none" />
                        <text x="50" y="49.2" textAnchor="middle" fill="#38bdf8" fontSize="3.4" fontFamily="monospace" fontWeight="bold" className="group-hover/oph:fill-cyan-200 transition-colors pointer-events-none select-none">Oph</text>
                        <text x="50" y="54.6" textAnchor="middle" fill="#94a3b8" fontSize="1.9" fontFamily="sans-serif" fontWeight="600" className="group-hover/oph:fill-white transition-colors pointer-events-none select-none">Ophiuchus ↗</text>
                      </g>
                    );
                  })()}
                </g>
              ) : activePolygon.length > 2 ? (
                <g className="delporte-stepped-boundary">
                  <path d={boundaryPathData} fill="rgba(6, 182, 212, 0.11)" stroke="#06b6d4" strokeWidth="0.65" strokeDasharray="2.5 1.5" />
                  {orthoBoundaryPoints.map((pt, idx) => (
                    <g key={`bpt-${idx}`}><circle cx={pt.x} cy={pt.y} r="1.0" fill="#38bdf8" stroke="#020512" strokeWidth="0.35" /></g>
                  ))}
                </g>
              ) : null}
            </>
          )}

          {/* 5. Dynamically Loaded Deep-Sky Objects from dsos.6_2.json */}
          {opts.showDeepSky && mappedDsos.map((dso: any) => (
            <g key={dso.id} className="cursor-pointer group/dso">
              <title>{`${dso.name}\n${dso.description}`}</title>
              {dso.type === 'sfr' || dso.type === 'snr' || dso.type === 'bn' ? (
                <g>
                  <circle cx={dso.x} cy={dso.y} r="4.2" fill={`url(#nebula-glow-${constellation.id})`} />
                  <circle cx={dso.x} cy={dso.y} r="2.4" fill="none" stroke="#f43f5e" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
                  <text x={dso.x + 3.8} y={dso.y - 1.5} fill="#fb7185" fontSize="2.3" fontFamily="monospace" fontWeight="bold">{dso.name}</text>
                </g>
              ) : dso.type === 's' || dso.type === 'i' ? (
                <g>
                  <ellipse cx={dso.x} cy={dso.y} rx="3.6" ry="1.8" transform={`rotate(-25 ${dso.x} ${dso.y})`} fill="none" stroke="#c084fc" strokeWidth="0.5" strokeDasharray="1.5 1" />
                  <circle cx={dso.x} cy={dso.y} r="0.8" fill="#e9d5ff" />
                  <text x={dso.x + 4.2} y={dso.y - 1.2} fill="#d8b4fe" fontSize="2.3" fontFamily="monospace" fontWeight="bold">{dso.name}</text>
                </g>
              ) : (
                <g>
                  <circle cx={dso.x} cy={dso.y} r="2.8" fill="none" stroke="#34d399" strokeWidth="0.5" strokeDasharray="1 1" />
                  <circle cx={dso.x} cy={dso.y} r="0.7" fill="#6ee7b7" />
                  <text x={dso.x + 3.6} y={dso.y - 1.2} fill="#6ee7b7" fontSize="2.3" fontFamily="monospace" fontWeight="bold">{dso.name}</text>
                </g>
              )}
            </g>
          ))}

          {/* 6. Connecting Asterism Stick Lines from JSON */}
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

              const raDiff = Math.abs(from.ra - to.ra);
              let x1 = from.x, y1 = from.y, x2 = to.x, y2 = to.y;

              if (raDiff > 12 && Math.abs(x1 - x2) > 40) {
                const seamX = x1 < x2 ? 0 : 100;
                const otherSeamX = x1 < x2 ? 100 : 0;
                const t = (seamX - x1) / ((x2 - 100 * Math.sign(x2 - x1)) - x1 || 1);
                const midY = y1 + (y2 - y1) * Math.max(0, Math.min(1, Math.abs(t)));

                return (
                  <g key={`lg-line-${segIdx}-${ptIdx}`}>
                    <line x1={x1} y1={y1} x2={seamX} y2={midY} stroke="#38bdf8" strokeWidth={isLarge ? "0.65" : "1.1"} strokeOpacity="0.82" strokeLinecap="round" />
                    <line x1={otherSeamX} y1={midY} x2={x2} y2={y2} stroke="#38bdf8" strokeWidth={isLarge ? "0.65" : "1.1"} strokeOpacity="0.82" strokeLinecap="round" />
                  </g>
                );
              }

              return (
                <line key={`lg-line-${segIdx}-${ptIdx}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38bdf8" strokeWidth={isLarge ? "0.65" : "1.1"} strokeOpacity="0.82" strokeLinecap="round" />
              );
            });
          })}

        {/* Draw the geometric constellation figure nodes */}
        {mappedLineVertices.map((s: any, starIdx: number) => (
          <g key={`lg-json-star-${starIdx}`}>
            <circle cx={s.x} cy={s.y} r="2.0" fill="#ffffff" stroke="#38bdf8" strokeWidth="0.7" className="pointer-events-none" />
          </g>
        ))}

          {/* 7. Star Nodes */}
          {visibleStars.map((s, starIdx) => {
            const isPrincipal = s.isPrincipal;
            const isClickable = !!s.catalogStar;
            // Star dots made smaller
            const radius = isPrincipal
              ? 2.6
              : s.apparentMagnitude < 2.0
              ? 2.2
              : isClickable
              ? (s.apparentMagnitude < 4.0 ? 1.6 : 1.2)
              : 0.9;

            return (
              <g
                key={s.id}
                className={isClickable ? 'cursor-pointer group/star' : 'cursor-default opacity-40'}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isClickable || !s.catalogStar) return;
                  if (onSelectFigureStar) onSelectFigureStar(s.catalogStar);
                  else if (onSelectStar) onSelectStar(s.catalogStar);
                }}
              >
                <title>
                  {isClickable
                    ? `${s.catalogStar!.name} (${s.catalogStar!.bayerDesignation || s.catalogStar!.spectralType})\n• Luminosity: ${s.luminositySolar.toLocaleString()} L☉ | Mag: ${s.apparentMagnitude}${
                        s.locationDescription ? `\n• Known Location: ${s.locationDescription}` : ''
                      }\n• Click to inspect 3D Star Dossier`
                    : `${s.name}\n• Mag: ${s.apparentMagnitude}`}
                </title>

                {isClickable && <circle cx={s.x} cy={s.y} r="5.0" fill="transparent" />}

                {isPrincipal && (
                  <g className="pointer-events-none">
                    <circle cx={s.x} cy={s.y} r={5.0} fill={`url(#star-glow-${constellation.id})`} className="animate-pulse" />
                    <circle cx={s.x} cy={s.y} r={3.6} fill="none" stroke="#fef08a" strokeWidth="0.4" strokeDasharray="2 1.5" opacity="0.85" />
                  </g>
                )}

                {isClickable && (
                  <circle cx={s.x} cy={s.y} r={radius + 1.4} fill="none" stroke="#38bdf8" strokeWidth="0.4" className="opacity-0 group-hover/star:opacity-100 transition-opacity pointer-events-none" />
                )}

                {isClickable && !isPrincipal && (
                  <circle cx={s.x} cy={s.y} r={radius + 0.6} fill="none" stroke="#06b6d4" strokeWidth="0.25" strokeOpacity="0.5" className="pointer-events-none" />
                )}

                <circle
                  cx={s.x} cy={s.y} r={radius}
                  fill={isPrincipal ? '#fef08a' : s.catalogStar?.colorHex ? s.catalogStar.colorHex : isClickable ? '#ffffff' : '#94a3b8'}
                  stroke={isPrincipal ? '#f59e0b' : isClickable ? '#38bdf8' : '#475569'}
                  strokeWidth={isPrincipal ? '0.6' : isClickable ? '0.4' : '0.25'}
                  className={isClickable ? 'group-hover/star:stroke-cyan-300 group-hover/star:fill-cyan-100 transition-colors' : ''}
                />

                {opts.showStarLabels && s.displayLabel && (
                  <text
                    x={s.x + (s.x > 80 ? -3.5 : 3.5)}
                    y={s.y + (s.y > 85 ? -3.0 : 3.0)}
                    textAnchor={s.x > 80 ? 'end' : 'start'}
                    fill={isPrincipal ? '#fef08a' : isClickable ? '#e2e8f0' : '#64748b'}
                    fontSize={isPrincipal ? '2.8' : isClickable ? '2.3' : '1.9'}
                    fontFamily="sans-serif"
                    fontWeight={isPrincipal ? 'bold' : isClickable ? '600' : 'normal'}
                    className={`pointer-events-none select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${isClickable ? 'group-hover/star:fill-cyan-300' : ''}`}
                  >
                    {s.displayLabel}
                  </text>
                )}
              </g>
            );
          })}

          {/* 8. Bordering Constellations along Perimeter */}
          {neighborCount > 0 && opts.showNeighborGuides && (
            <g className="bordering-constellations-perimeter">
              {neighbors.map((neighborName, nIdx) => {
                const neighborObj = resolveConstellationByName(neighborName);
                const abbr = getNeighborAbbr(neighborName, neighborObj);
                const angle = (2 * Math.PI * nIdx) / neighborCount - Math.PI / 2;
                const nX = 50 + 56 * Math.cos(angle);
                const nY = 50 + 50 * Math.sin(angle);
                const tickStartX = 50 + 44 * Math.cos(angle);
                const tickStartY = 50 + 40 * Math.sin(angle);
                const rectWidth = Math.max(16, abbr.length * 3.4 + 4);

                return (
                  <g
                    key={`neighbor-svg-${nIdx}`}
                    className="cursor-pointer group/neighbor transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (neighborObj && onSelectNeighbor) onSelectNeighbor(neighborObj);
                    }}
                  >
                    <title>{neighborName} (Click to open {neighborObj?.name || neighborName} dossier)</title>
                    <line x1={tickStartX} y1={tickStartY} x2={nX} y2={nY} stroke="#334155" strokeWidth="0.45" strokeDasharray="1.5 1.5" />
                    <rect x={nX - rectWidth / 2} y={nY - 3.8} width={rectWidth} height="7.6" rx="2" fill="#070c1d" stroke="#334155" strokeWidth="0.5" className="transition-colors group-hover/neighbor:stroke-cyan-400 group-hover/neighbor:fill-slate-800" />
                    <text x={nX} y={nY + 1.1} textAnchor="middle" fill="#94a3b8" fontSize="2.7" fontFamily="monospace" fontWeight="bold" className="select-none pointer-events-none group-hover/neighbor:fill-cyan-300">
                      {abbr}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Floating Figure & Asterism Badge rendered over the SVG */}
        <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-3 z-10 text-[9px] sm:text-[10px] font-mono text-slate-300 bg-slate-950/95 px-2.5 py-1 rounded-lg border border-slate-800 pointer-events-none flex items-center gap-1.5 shadow-md">
          <span className="text-cyan-400 font-bold">
            {catalogPlacedCount} Catalog Stars Visible
          </span>
          <span className="text-emerald-400 font-medium">• All Clickable in 3D</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto text-slate-200">
      {/* Top Banner (Uniform Hero Section) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
              <Compass className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400 shrink-0" />
              <span>Constellation Guide</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Discover all 88 official IAU constellations dividing the celestial sphere, compare 2D Earth perspective against true 3D stellar depths, explore the real 13 astronomical zodiac constellations, and debunk astrological lore.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold shadow-sm">
              88 IAU Sectors
            </span>
          </div>
        </div>
      </div>

        {/* Sub-Tabs Switcher - Separate Buttons (No Sliding Panel) */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#020512] rounded-2xl border border-cyan-500/25 max-w-full">
          <button
            id="tab-what-are-constellations"
            onClick={() => setActiveTab('what-are')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'what-are'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>What Are Constellations?</span>
          </button>

          <button
            id="tab-all-88-constellations"
            onClick={() => setActiveTab('all-88')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'all-88'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>All 88 Constellations</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-cyan-950 text-cyan-300">
              88
            </span>
          </button>

          <button
            id="tab-zodiac-13"
            onClick={() => setActiveTab('zodiac-13')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'zodiac-13'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>13 Zodiac Signs</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-amber-950 text-amber-300 font-bold">
              13
            </span>
          </button>

          <button
            id="tab-mythbuster"
            onClick={() => setActiveTab('mythbuster')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'mythbuster'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Personality Mythbuster</span>
          </button>
        </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: WHAT ARE CONSTELLATIONS? */}
      {/* ========================================================================= */}
      {activeTab === 'what-are' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Sub-tab Hero Banner: What Are Constellations? */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-5 sm:p-6 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 space-y-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
                  <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400 shrink-0" />
                  <span>Physical Reality vs. Celestial Coordinates</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  In three-dimensional space, <strong className="text-cyan-300 font-semibold">constellations do not physically exist</strong>. The stars that form familiar patterns like Orion or the Big Dipper are separated by dozens, hundreds, or even thousands of light-years in radial depth. They have no gravitational binding, no common birth nebula, and are moving in completely different galactic orbits.
                </p>
                <div className="mt-3 p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 leading-relaxed font-sans">
                  <strong className="text-white block mb-0.5">
                    📍 Why are constellations still indispensable to modern astronomy?
                  </strong>
                  While physically meaningless in deep space, they are <strong className="text-cyan-300 font-bold">essential standardized sectors</strong> for mapping the night sky from Earth—functioning just like postal codes or country boundaries on a globe.
                </div>
              </div>

              {/* Graphical Visual Diagram: 2D vs 3D */}
              <div className="w-full md:w-80 p-5 rounded-xl bg-[#020512] border border-slate-700/60 flex flex-col items-center text-center shrink-0">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-bold">
                  The Depth Illusion
                </div>
                <div className="relative w-64 h-36 bg-[#040818] rounded-lg border border-cyan-500/20 overflow-hidden flex items-center justify-center p-2 mb-3">
                  {/* Left: Earth Observer */}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-500 border border-white flex items-center justify-center text-[9px] font-bold text-white shadow-[0_0_10px_#3b82f6]">
                      🌍
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 mt-1">Earth</span>
                  </div>

                  {/* Lines of sight */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 250 140">
                    <line x1="30" y1="70" x2="100" y2="35" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="30" y1="70" x2="170" y2="70" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="30" y1="70" x2="230" y2="105" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />

                    {/* 2D Projection Screen on Earth's Dome */}
                    <path d="M 75 15 Q 85 70 75 125" fill="none" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="1.5" />

                    {/* Star 1: Close (e.g. 25 ly) */}
                    <circle cx="100" cy="35" r="4" fill="#67e8f9" />
                    <text x="100" y="24" fill="#94a3b8" fontSize="8" textAnchor="middle">25 ly</text>

                    {/* Star 2: Medium (e.g. 250 ly) */}
                    <circle cx="170" cy="70" r="5" fill="#fef08a" />
                    <text x="170" y="58" fill="#94a3b8" fontSize="8" textAnchor="middle">250 ly</text>

                    {/* Star 3: Deep Supergiant (e.g. 2,000 ly) */}
                    <circle cx="230" cy="105" r="6" fill="#f87171" />
                    <text x="230" y="93" fill="#94a3b8" fontSize="8" textAnchor="middle">2,000 ly</text>
                  </svg>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  From Earth, Stars A, B, and C appear side-by-side in a triangle. In 3D space, Star C is 80 times
                  further away than Star A!
                </p>
              </div>
            </div>
          </div>

          {/* 4 Pillars of Constellation Knowledge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {WHAT_ARE_CONSTELLATIONS_INFO.keyPrinciples.map((principle, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-[#060c22] border border-cyan-500/20 hover:border-cyan-500/40 transition-colors flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                    {principle.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-500">Pillar 0{idx + 1}</span>
                </div>
                <h4 className="text-base font-bold text-white">{principle.title}</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{principle.content}</p>
              </div>
            ))}
          </div>

          {/* Interactive Asterism vs Constellation Callout */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#08122a] border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Asterisms: Everyday Patterns vs. Official Constellations</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Did you know? The <strong>Big Dipper</strong> is NOT a constellation! It is an asterism comprising the
                7 brightest stars inside the larger constellation <em>Ursa Major</em> (The Great Bear). Likewise, the{' '}
                <strong>Summer Triangle</strong> connects Vega (Lyra), Deneb (Cygnus), and Altair (Aquila) across three
                different constellations!
              </p>
            </div>
            <button
              onClick={() => setActiveTab('all-88')}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 cursor-pointer shadow-md"
            >
              <span>Explore All 88 Constellations</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: ALL 88 CONSTELLATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'all-88' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Sub-tab Hero Banner: All 88 Constellations */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-5 sm:p-6 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
                  <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400 shrink-0" />
                  <span>All 88 Constellations Directory</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  The International Astronomical Union (IAU) formally divides the entire celestial sphere into 88 unambiguous sectors. Filter and sort by celestial hemisphere, constellation family, total celestial area, or brightest alpha star.
                </p>
              </div>
            </div>
          </div>

          {/* Search, Filters & Sorters */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#050c20] border border-cyan-500/25 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="constellation-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by constellation name, meaning (e.g. 'Bear'), or principal star..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#020512] border border-slate-700/80 focus:border-cyan-500 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Hemisphere filter */}
              <select
                id="select-constellation-hemisphere"
                value={selectedHemisphere}
                onChange={(e) => setSelectedHemisphere(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#020512] border border-slate-700/80 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value="all">All Hemispheres</option>
                <option value="Northern">Northern Sky</option>
                <option value="Southern">Southern Sky</option>
                <option value="Equatorial">Equatorial Sky</option>
              </select>

              {/* Family filter */}
              <select
                id="select-constellation-family"
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#020512] border border-slate-700/80 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value="all">All Families</option>
                <option value="zodiac-only">Zodiac Constellations (13)</option>
                <option value="Ursa Major">Ursa Major Family</option>
                <option value="Perseus">Perseus Family</option>
                <option value="Hercules">Hercules Family</option>
                <option value="Orion">Orion Family</option>
                <option value="Heavenly Waters">Heavenly Waters</option>
                <option value="Bayer">Bayer Group (Southern)</option>
                <option value="La Caille">Lacaille Group (Instruments)</option>
              </select>

              {/* Sort by */}
              <select
                id="select-constellation-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-[#020512] border border-slate-700/80 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value="name">Sort: Name (A-Z)</option>
                <option value="area-desc">Sort: Area (Largest First)</option>
                <option value="brightest">Sort: Brightest Principal Star</option>
              </select>
            </div>
          </div>

          {/* Active Filter Metrics Banner */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>
              Showing <strong className="text-cyan-400 font-bold">{filteredConstellations.length}</strong> of{' '}
              {ALL_88_CONSTELLATIONS.length} Official IAU Constellations
            </span>
            {(searchQuery || selectedHemisphere !== 'all' || selectedFamily !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedHemisphere('all');
                  setSelectedFamily('all');
                  setSortBy('name');
                }}
                className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* 88 Constellations Bento Grid */}
          <div className={`grid ${
            cardDensity === 'compact'
              ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-2.5'
              : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4'
          }`}>
            {filteredConstellations.map((constellation) => {
              const principalStar = starMap.get(constellation.principalStarId);

              if (cardDensity === 'compact') {
                return (
                  <div
                    key={constellation.id}
                    onClick={() => setInspectedConstellation(constellation)}
                    className="group p-2 sm:p-2.5 rounded-xl bg-[#040a1c] border border-cyan-500/20 hover:border-cyan-400/60 hover:bg-[#060e28] transition-all flex flex-col justify-between shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
                    title={`Click to open Constellation Dossier for ${constellation.name}`}
                  >
                    <div>
                      {/* Compact Header */}
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                              {constellation.name}
                            </h4>
                            {constellation.isZodiac && (
                              <span
                                className="text-[8px] px-1 py-0.2 rounded font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/30 shrink-0"
                                title="Zodiac Constellation"
                              >
                                {constellation.zodiacSymbol || 'Z'}
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] text-slate-400 italic truncate">{constellation.englishName}</p>
                        </div>
                        <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60 shrink-0">
                          {constellation.id === 'serpens' ? 'Ser' : constellation.abbreviation}
                        </span>
                      </div>

                      {/* Smaller SVG Preview */}
                      <div
                        className="relative w-full h-16 sm:h-20 bg-[#020512] rounded-lg border border-cyan-500/15 flex items-center justify-center overflow-hidden group-hover:border-cyan-500/40 transition-colors my-1 p-1"
                        title={`Click to open Constellation Dossier for ${constellation.name}`}
                      >
                        {renderNormalAsterism(
                          constellation,
                          100,
                          'w-full h-full max-h-14 sm:max-h-18'
                        )}
                      </div>

                      {/* Resemblance Snippet */}
                      <p className="line-clamp-1 italic text-[9px] text-slate-300/80 my-0.5 truncate" title={constellation.resemblance}>
                        "{constellation.resemblance}"
                      </p>

                      {/* Quick Specs Compact Row */}
                      <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-slate-400 py-0.5 border-t border-slate-800/80">
                        <span className="truncate">{constellation.hemisphere}</span>
                        <span className="text-cyan-300 shrink-0">{constellation.areaSqDeg} sq°</span>
                      </div>
                    </div>

                    {/* Principal Star & Action */}
                    <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between gap-1 text-[9px]">
                      <span className="text-slate-400 truncate flex items-center gap-1">
                        <StarDot2D star={principalStar} colorHex={principalStar?.colorHex || '#fef08a'} sizeClassName="w-2 h-2" />
                        <span className="text-white font-medium truncate">{constellation.principalStarName.split('(')[0]}</span>
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectedConstellation(constellation);
                        }}
                        className="py-0.5 px-1.5 rounded bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 hover:text-white border border-cyan-500/30 text-[9px] font-semibold font-mono cursor-pointer shrink-0 transition-colors"
                        title="Dossier"
                      >
                        Dossier
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={constellation.id}
                  onClick={() => setInspectedConstellation(constellation)}
                  className="group p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#040a1c] border border-cyan-500/20 hover:border-cyan-400/60 hover:bg-[#060e28] transition-all flex flex-col justify-between shadow-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] cursor-pointer"
                  title={`Click to open Constellation Dossier for ${constellation.name}`}
                >
                  {/* Top Header */}
                  <div>
                    <div className="flex items-start justify-between gap-1 sm:gap-2 mb-1.5 sm:mb-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <h4 className="text-xs sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                            {constellation.name}
                          </h4>
                          {constellation.isZodiac && (
                            <span
                              className="text-[9px] sm:text-xs px-1 sm:px-1.5 py-0.2 rounded font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/30 shrink-0"
                              title="Zodiac Constellation"
                            >
                              {constellation.zodiacSymbol || 'Z'}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-400 italic truncate">{constellation.englishName}</p>
                      </div>

                      <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60 shrink-0">
                        {constellation.id === 'serpens' ? 'Ser' : constellation.abbreviation}
                      </span>
                    </div>

                    {/* SVG Constellation Normal Asterism Preview */}
                    <div
                      className="relative w-full h-24 sm:h-36 bg-[#020512] rounded-lg sm:rounded-xl border border-cyan-500/15 flex items-center justify-center overflow-hidden group-hover:border-cyan-500/40 transition-colors my-1.5 sm:my-2.5 p-1 sm:p-2"
                      title={`Click card to open Constellation Dossier for ${constellation.name}`}
                    >
                      {renderNormalAsterism(
                        constellation,
                        100,
                        'w-full h-full max-h-20 sm:max-h-32'
                      )}
                      <div className="absolute bottom-1 right-1 text-[8px] sm:text-[9px] font-mono text-cyan-400/90 bg-slate-950/80 px-1 py-0.2 rounded border border-slate-800 pointer-events-none">
                        Figure
                      </div>
                    </div>

                    {/* Resemblance snippet */}
                    <div className="my-1 sm:my-2 p-1.5 sm:p-2 rounded-lg bg-[#020512] border border-cyan-500/15 text-[10px] sm:text-[11px] leading-tight sm:leading-snug">
                      <div className="flex items-center gap-1 text-[8.5px] sm:text-[9px] font-mono uppercase text-cyan-400 font-semibold mb-0.5">
                        <Sparkles className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-cyan-400 shrink-0" />
                        <span>Resemblance</span>
                      </div>
                      <p className="line-clamp-1 sm:line-clamp-2 italic text-slate-300/90">"{constellation.resemblance}"</p>
                    </div>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-1.5 text-[9.5px] sm:text-[11px] font-mono mb-2 sm:mb-3">
                      <div className="p-1 sm:p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 truncate">
                        <span className="text-slate-500 block text-[8px] sm:text-[9px] uppercase">Sky Region</span>
                        <span className="truncate">{constellation.hemisphere}</span>
                      </div>
                      <div className="p-1 sm:p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 truncate">
                        <span className="text-slate-500 block text-[8px] sm:text-[9px] uppercase">Area / Rank</span>
                        <span className="truncate">
                          {constellation.areaSqDeg} sq° (#{constellation.areaRank})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Principal Star Bar & Action */}
                  <div className="pt-1.5 sm:pt-2.5 border-t border-slate-800 flex flex-col gap-1.5 sm:gap-2">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                      <span className="text-slate-400 text-[9px] sm:text-[11px] flex items-center gap-1 shrink-0">
                        <StarDot2D star={principalStar} colorHex={principalStar?.colorHex || '#fef08a'} sizeClassName="w-2 h-2" />
                        <span>Principal:</span>
                      </span>
                      <span className="text-white font-semibold text-[9.5px] sm:text-[11px] truncate max-w-[85px] sm:max-w-[130px]" title={constellation.principalStarName}>
                        {constellation.principalStarName.split('(')[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                      {principalStar && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectStar(principalStar);
                          }}
                          className="flex-1 py-1 sm:py-1.5 px-1.5 sm:px-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 hover:text-white border border-cyan-500/40 text-[10px] sm:text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-95"
                          title={`Inspect ${principalStar.name} in 3D Comparator`}
                        >
                          <StarDot2D star={principalStar} sizeClassName="w-2 h-2" />
                          <span>Inspect</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectedConstellation(constellation);
                        }}
                        className="py-1 sm:py-1.5 px-2 sm:px-2.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-[10px] sm:text-[11px] font-semibold cursor-pointer transition-colors active:scale-95"
                        title="Open Constellation Dossier"
                      >
                        <Info className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: THE 13 ZODIAC SIGNS */}
      {/* ========================================================================= */}
      {activeTab === 'zodiac-13' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Sub-tab Hero Banner: 13 Zodiac Signs */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-5 sm:p-6 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 shrink-0" />
                  <span>The 13 Signs of the Astronomical Zodiac</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  The ecliptic path of the Sun physically crosses 13 distinct astronomical constellations—not 12—including Ophiuchus the Serpent Bearer. Over the last 2,500 years, axial precession has shifted the actual dates the Sun spends in each constellation by almost a full month.
                </p>
              </div>
            </div>
          </div>

          {/* Explainer Details & Ophiuchus Callout */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#040816] border border-cyan-500/20">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-3xl space-y-3">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {ZODIAC_13_EXPLAINER.introduction}
                </p>
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs sm:text-sm text-amber-200 leading-relaxed font-sans">
                  <strong className="text-white block mb-0.5">
                    ⏳ The Precession of the Equinoxes (The 1-Month Shift):
                  </strong>
                  {ZODIAC_13_EXPLAINER.axialPrecessionNote}
                </div>
              </div>

              {/* Ophiuchus Big Callout Card */}
              <div className="w-full lg:w-80 p-5 rounded-xl bg-[#020512] border-2 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.25)] flex flex-col gap-2 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">⛎</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-600">
                    The 13th Sign
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">
                  Ophiuchus (The Serpent Bearer)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The Sun spends <strong>18.6 days</strong> traveling through Ophiuchus (Nov 29 – Dec 17)—nearly three times longer than Scorpius!
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed italic mt-1">
                  Why was it excluded? Ancient Babylonians had a 12-month calendar, so they sliced the sky into 12 equal wedges and ignored the 13th!
                </p>
              </div>
            </div>
          </div>

          {/* The 13 Zodiac Signs Side-by-Side Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ZODIAC_13_SIGNS.map((sign) => {
              const star = starMap.get(sign.principalStarId);
              const constellation = ALL_88_CONSTELLATIONS.find((c) => c.name.toLowerCase() === sign.name.toLowerCase());

              return (
                <div
                  key={sign.name}
                  className={`p-5 rounded-2xl flex flex-col justify-between gap-3 border transition-all ${
                    sign.isThirteenth
                      ? 'bg-[#150f04] border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                      : 'bg-[#050c20] border-cyan-500/25 hover:border-cyan-500/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{sign.symbol}</span>
                        <div>
                          <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                            <span>{sign.name}</span>
                            {sign.isThirteenth && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-bold">
                                13th Sign!
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-400">{sign.englishMeaning}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-cyan-400 font-bold">
                        #{sign.index} of 13
                      </span>
                    </div>

                    {/* SVG Shape if available */}
                    {constellation && (
                      <div className="w-full h-24 bg-[#020512] rounded-xl border border-slate-800 flex items-center justify-center my-2">
                        {renderConstellationShape(constellation, 80)}
                      </div>
                    )}

                    {/* Date Comparison: Astronomical vs Traditional */}
                    <div className="space-y-1.5 text-xs font-mono mt-3">
                      <div className="p-2 rounded-lg bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-between">
                        <span className="text-cyan-300 font-semibold">Real Sun Dates:</span>
                        <span className="text-white font-bold">{sign.astronomicalDates}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400">Astrology Dates:</span>
                        <span className="text-slate-300">{sign.traditionalDates}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                        <span>Sun Duration:</span>
                        <span className="text-cyan-400 font-bold">{sign.sunDurationDays} days</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                      {sign.scientificNotes}
                    </p>
                  </div>

                  {/* Principal Star Link */}
                  {star && (
                    <button
                      onClick={() => onSelectStar(star)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-500/40 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-1"
                    >
                      <StarDot2D star={star} sizeClassName="w-2.5 h-2.5" />
                      <span>Inspect {star.name.split('(')[0]}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: MYTHBUSTER: PERSONALITY & ASTROLOGY */}
      {/* ========================================================================= */}
      {activeTab === 'mythbuster' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Sub-tab Hero Banner: Personality Mythbuster */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-5 sm:p-6 shadow-xl backdrop-blur-md">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
                  <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400 shrink-0" />
                  <span>Personality Mythbuster</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  Astrology and zodiac personality tropes explored through empirical astrophysics: test where the Sun was physically located on your date of birth, examine axial precession shifts, and learn why gravity and distance rule out astrological determinism.
                </p>
              </div>
            </div>
          </div>

          {/* Big Mythbuster Verdict Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#140608] border border-rose-500/40 relative overflow-hidden shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {MYTHBUSTER_INFO.title}
                </h3>
                <div className="mt-1 text-base sm:text-lg font-bold text-rose-400">
                  {MYTHBUSTER_INFO.verdict}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                  {MYTHBUSTER_INFO.friendlyNote}
                </p>
              </div>

              {/* Astrophysics Perspective Callout */}
              <div className="w-full md:w-72 p-4 rounded-2xl bg-[#091530] border border-cyan-500/40 text-center flex flex-col items-center gap-2 shrink-0">
                <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  🔭
                </div>
                <div className="text-xs font-bold text-white">Astrophysical Reality</div>
                <p className="text-[11px] text-cyan-200/90 leading-snug">
                  "Astrology is charming cultural mythology and fun folklore. But as lovers of real
                  stars, we celebrate the wondrous truth: stars are nuclear titans, not mystical mood-rings!"
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Birthday Real Zodiac Finder Widget */}
          <div className="p-6 rounded-2xl bg-[#061026] border border-cyan-500/30">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase mb-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Interactive Precession Calculator</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              Find Out Where the Sun Was PHYSICALLY Located on Your Birthday
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mb-4">
              Because Earth's rotational axis precesses once every ~26,000 years, your traditional horoscope sign is
              almost certainly NOT where the Sun was in space when you were born!
            </p>

            {/* Select Date Controls */}
            <div className="flex flex-wrap items-end gap-3 mb-5">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">Birth Month</label>
                <select
                  value={calcMonth}
                  onChange={(e) => setCalcMonth(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-[#020512] border border-slate-700 text-xs sm:text-sm text-white focus:border-cyan-500 focus:outline-none cursor-pointer"
                >
                  <option value={1}>January</option>
                  <option value={2}>February</option>
                  <option value={3}>March</option>
                  <option value={4}>April</option>
                  <option value={5}>May</option>
                  <option value={6}>June</option>
                  <option value={7}>July</option>
                  <option value={8}>August</option>
                  <option value={9}>September</option>
                  <option value={10}>October</option>
                  <option value={11}>November</option>
                  <option value={12}>December</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">Birth Day</label>
                <select
                  value={calcDay}
                  onChange={(e) => setCalcDay(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-[#020512] border border-slate-700 text-xs sm:text-sm text-white focus:border-cyan-500 focus:outline-none cursor-pointer"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    setCalcMonth(now.getMonth() + 1);
                    setCalcDay(now.getDate());
                  }}
                  className="px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5"
                  title="Reset to today's astronomical date"
                >
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Today's Transit</span>
                </button>
              </div>
            </div>

            {/* Calculated Result Banner */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#020512] border border-cyan-500/40 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500 flex items-center justify-center text-2xl shrink-0">
                  {birthdayResult.symbol}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Physical Astronomical Constellation:
                  </span>
                  <span className="text-base sm:text-lg font-bold text-cyan-300">
                    {birthdayResult.astronomical}
                  </span>
                  <p className="text-xs text-slate-400">{birthdayResult.desc}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">What Horoscopes Call You:</span>
                  <span className="text-slate-200 font-semibold">{birthdayResult.traditional}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Sun Duration:</span>
                  <span className="text-cyan-400 font-bold">{birthdayResult.daysIn} days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scientific Mythbuster Deep-Dive Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MYTHBUSTER_INFO.sections.map((sec, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-[#050c20] border border-slate-800 hover:border-cyan-500/30 transition-colors flex flex-col gap-2.5"
              >
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs flex items-center justify-center font-mono font-bold">
                    {idx + 1}
                  </span>
                  <span>{sec.title}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{sec.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INSPECTED CONSTELLATION MODAL / DRAWER (CONSTELLATION DOSSIER) */}
      {/* ========================================================================= */}
      {inspectedConstellation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 pointer-events-none">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-auto transition-opacity duration-200"
            onClick={() => setInspectedConstellation(null)}
          />

          {/* Modal Container: Constellation Dossier */}
          <div
            ref={dossierScrollRef}
            className="relative w-full max-w-[96vw] xl:max-w-7xl h-[95vh] sm:h-[94vh] rounded-2xl sm:rounded-3xl bg-[#040816]/95 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Bar matching Encyclopedia mode */}
            <div className="flex flex-row items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-cyan-500/20 bg-[#060b20] shrink-0 gap-2 sm:gap-3">
              {/* Left: Constellation Identifier & Information */}
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar max-w-full">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-xl font-black text-white tracking-tight shrink-0">
                    {inspectedConstellation.name}
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 shrink-0">
                    {inspectedConstellation.abbreviation}
                  </span>
                  <span className="text-xs text-slate-400 italic hidden md:inline truncate">
                    "{inspectedConstellation.englishName}" • {inspectedConstellation.genitive}
                  </span>
                  {inspectedConstellation.isZodiac && (
                    <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded font-mono font-bold bg-amber-950/90 text-amber-300 border border-amber-500/40 shrink-0">
                      {inspectedConstellation.zodiacSymbol} Zodiac Sign
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Close Button with Esc shortcut */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setInspectedConstellation(null)}
                  className="flex items-center justify-center gap-1.5 p-2 md:px-3 md:py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold transition-all cursor-pointer active:scale-95 shrink-0"
                  title="Close Constellation Dossier (Esc)"
                  aria-label="Close Constellation Dossier"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden md:inline">Close</span>
                  <span className="text-[10px] font-mono text-slate-400 hidden md:inline">[Esc]</span>
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 scrollbar-thin flex flex-col gap-4 sm:gap-6">
              {/* Top Section: Visualizer & Astronomical Boundaries */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Constellation Exact Boundary & Neighbors Canvas */}
                <div className="lg:col-span-7 flex flex-col gap-3">
                  {/* Constellation Dossier Viewport Controls Toolbar */}
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2 p-1.5 sm:p-2.5 rounded-xl bg-[#04091c] border border-cyan-500/25 text-[11px] font-mono">
                    
                    <div className="flex items-center gap-1.5 px-2 text-cyan-400 font-bold">
                      <Compass className="w-4 h-4" />
                      <span className="hidden sm:inline">Astrometric Map</span>
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full py-0.5">
                      <button
                        onClick={() => setSkyMapOptions((prev) => ({ ...prev, showGraticule: !prev.showGraticule }))}
                        className={`px-1.5 py-1 sm:px-2 sm:py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                          skyMapOptions.showGraticule
                            ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-950'
                            : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                        title="Toggle Coordinate Graticule (RA/Dec Grid)"
                      >
                        <Grid className="w-3 h-3 shrink-0" />
                        <span className="hidden xs:inline sm:inline">Grid</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${skyMapOptions.showGraticule ? 'bg-cyan-400' : 'bg-slate-600'} xs:hidden`} />
                      </button>

                      <button
                        onClick={() => setSkyMapOptions((prev) => ({ ...prev, showBoundaries: !prev.showBoundaries }))}
                        className={`px-1.5 py-1 sm:px-2 sm:py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                          skyMapOptions.showBoundaries
                            ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-950'
                            : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                        title="Toggle IAU Delporte Stepped Orthogonal Boundaries"
                      >
                        <Layers className="w-3 h-3 shrink-0" />
                        <span className="hidden xs:inline sm:inline">Borders</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${skyMapOptions.showBoundaries ? 'bg-cyan-400' : 'bg-slate-600'} xs:hidden`} />
                      </button>

                      <button
                        onClick={() => setSkyMapOptions((prev) => ({ ...prev, showStarLabels: !prev.showStarLabels }))}
                        className={`px-1.5 py-1 sm:px-2 sm:py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                          skyMapOptions.showStarLabels
                            ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-950'
                            : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                        title="Toggle Star Bayer Designations and Proper Names"
                      >
                        <Tag className="w-3 h-3 shrink-0" />
                        <span className="hidden xs:inline sm:inline">Stars</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${skyMapOptions.showStarLabels ? 'bg-cyan-400' : 'bg-slate-600'} xs:hidden`} />
                      </button>

                      <button
                        onClick={() => setSkyMapOptions((prev) => ({ ...prev, showEquatorEcliptic: !prev.showEquatorEcliptic }))}
                        className={`px-1.5 py-1 sm:px-2 sm:py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                          skyMapOptions.showEquatorEcliptic
                            ? 'bg-cyan-950/90 text-amber-300 border border-amber-500/50 shadow-sm'
                            : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                        title="Toggle 0° Celestial Equator and Solar Ecliptic Lines"
                      >
                        <Orbit className="w-3 h-3 shrink-0" />
                        <span className="hidden xs:inline sm:inline">Ecliptic</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${skyMapOptions.showEquatorEcliptic ? 'bg-amber-400' : 'bg-slate-600'} xs:hidden`} />
                      </button>

                      <button
                        onClick={() => setSkyMapOptions((prev) => ({ ...prev, showDeepSky: !prev.showDeepSky }))}
                        className={`px-1.5 py-1 sm:px-2 sm:py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                          skyMapOptions.showDeepSky
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-sm'
                            : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                        title="Toggle Iconic Messier / NGC Deep Sky Objects"
                      >
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span className="hidden xs:inline sm:inline">DSO</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${skyMapOptions.showDeepSky ? 'bg-rose-400' : 'bg-slate-600'} xs:hidden`} />
                      </button>

                      <button
                        onClick={() => setSkyMapOptions((prev) => ({ ...prev, showNeighborGuides: !prev.showNeighborGuides }))}
                        className={`px-1.5 py-1 sm:px-2 sm:py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                          skyMapOptions.showNeighborGuides
                            ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-sm'
                            : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                        title="Toggle Adjacent Constellation Perimeter Guides"
                      >
                        <Navigation className="w-3 h-3 shrink-0" />
                        <span className="hidden xs:inline sm:inline">Neighbors</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${skyMapOptions.showNeighborGuides ? 'bg-cyan-400' : 'bg-slate-600'} xs:hidden`} />
                      </button>
                    </div>
                  </div>

                  {/* Constellation Visualizer Banner - 2D Astrometric Map */}
                  <div className="w-full h-[410px] sm:h-[450px] md:h-[500px] lg:h-[560px] bg-[#020512] rounded-2xl border border-cyan-500/30 flex items-center justify-center relative overflow-hidden shrink-0 shadow-inner">
                    {/* Astrometric Metadata Header Badge */}
                    <div className="absolute top-2 left-2 sm:top-2.5 sm:left-3 z-10 text-[9px] sm:text-[10px] font-mono text-slate-400 bg-slate-950/90 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border border-slate-800 pointer-events-none flex items-center gap-1.5 sm:gap-2 shadow">
                      <span className="text-cyan-300 font-semibold uppercase">{inspectedConstellation.name}</span>
                      <span className="text-slate-500">•</span>
                      <span>RA {inspectedConstellation.borders.raRange.split('|')[0].trim()}</span>
                      <span className="text-slate-500 hidden sm:inline">•</span>
                      <span className="hidden sm:inline">Dec {inspectedConstellation.borders.decRange.split('|')[0].trim()}</span>
                    </div>

                    <div className="flex items-center justify-center w-full h-full p-1.5 sm:p-4">
                      {renderConstellationShape(
                        inspectedConstellation,
                        520,
                        'w-full h-full max-h-[410px] sm:max-h-[520px]',
                        (neighbor) => setInspectedConstellation(neighbor),
                        undefined,
                        (star) => onSelectStar(star)
                      )}
                    </div>
                  </div>

                  {/* Bordering Constellations Bar: Clickable, unhighlighted adjacent constellations */}
                  {inspectedConstellation.borders.borderingConstellations.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-[#04091c] border border-slate-800 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                          Bordering Constellations ({inspectedConstellation.borders.borderingConstellations.length})
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Click to jump to neighboring boundary</span>
                      </div>

                      {/* If Serpens, display the sectors (Caput and Cauda) grouped clearly */}
                      {inspectedConstellation.id === 'serpens' && inspectedConstellation.borders.sectors ? (
                        <div className="flex flex-col gap-2.5">
                          {inspectedConstellation.borders.sectors.map((sec) => (
                            <div
                              key={sec.shortCode}
                              className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col gap-1.5"
                            >
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="font-bold text-cyan-300">
                                  {sec.name} ({sec.shortCode})
                                </span>
                                <span className="text-slate-400 text-[10px]">{sec.englishName}</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-0.5">
                                {sec.borderingConstellations.map((neighborName) => {
                                  const neighborObj = resolveConstellationByName(neighborName);
                                  return (
                                    <button
                                      key={neighborName}
                                      onClick={() => {
                                        if (neighborObj) {
                                          setInspectedConstellation(neighborObj);
                                        }
                                      }}
                                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 font-mono ${
                                        neighborObj
                                          ? 'bg-slate-900/90 text-slate-300 border-slate-700/60 hover:border-slate-500 hover:text-white cursor-pointer active:scale-95'
                                          : 'bg-slate-900/40 text-slate-500 border-slate-800/40 cursor-default'
                                      }`}
                                      title={neighborObj ? `Inspect ${neighborObj.name} boundary in dossier` : neighborName}
                                    >
                                      <span>{neighborName}</span>
                                      {neighborObj && <ChevronRight className="w-3 h-3 text-slate-400" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {inspectedConstellation.borders.borderingConstellations.map((neighborName) => {
                            const neighborObj = resolveConstellationByName(neighborName);
                            return (
                              <button
                                key={neighborName}
                                onClick={() => {
                                  if (neighborObj) {
                                    setInspectedConstellation(neighborObj);
                                  }
                                }}
                                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 font-mono ${
                                  neighborObj
                                    ? 'bg-slate-900/90 text-slate-300 border-slate-700/60 hover:border-slate-500 hover:text-white cursor-pointer active:scale-95'
                                    : 'bg-slate-900/40 text-slate-500 border-slate-800/40 cursor-default'
                                }`}
                                title={neighborObj ? `Inspect ${neighborObj.name} boundary in dossier` : neighborName}
                              >
                                <span>{neighborName}</span>
                                {neighborObj && <ChevronRight className="w-3 h-3 text-slate-400" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Celestial Resemblance Callout */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/50 via-[#061430] to-blue-950/40 border border-cyan-500/35 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-cyan-900/60 border border-cyan-400/30 text-cyan-300 shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-mono uppercase text-cyan-400 font-bold tracking-wider mb-1 flex items-center justify-between">
                        <span>Celestial Resemblance & Shape</span>
                        <span className="text-[10px] text-slate-400 font-normal lowercase italic">silhouette in the night sky</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                        {inspectedConstellation.resemblance}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Sky Borders, Metrics & Principal Star */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {/* Sky Borders Section */}
                  <div className="p-4 rounded-xl bg-[#04091c] border border-cyan-500/25 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-cyan-900/40">
                      <div className="flex items-center gap-2">
                        <Crosshair className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs sm:text-sm font-bold text-white">
                          Astronomical Boundaries
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-500/30">
                        Delporte Boundary
                      </span>
                    </div>

                    {/* RA and Dec Ranges */}
                    {inspectedConstellation.borders.sectors ? (
                      <div className="flex flex-col gap-2 text-xs font-mono">
                        {inspectedConstellation.borders.sectors.map((sec) => (
                          <div
                            key={sec.shortCode}
                            className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col gap-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-cyan-300 font-bold text-[11px]">
                                {sec.name} ({sec.shortCode})
                              </span>
                              <span className="text-slate-400 text-[10px]">{sec.englishName}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[10px] mt-0.5 text-slate-300">
                              <div>
                                <span className="text-slate-500 block">RA:</span>
                                <span className="font-bold text-slate-200">{sec.raRange}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block">Dec:</span>
                                <span className="font-bold text-slate-200">{sec.decRange}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                          <span className="text-slate-400 block text-[10px] uppercase">Right Ascension (RA) Range</span>
                          <span className="text-cyan-300 font-bold">{inspectedConstellation.borders.raRange}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                          <span className="text-slate-400 block text-[10px] uppercase">Declination (Dec) Range</span>
                          <span className="text-cyan-300 font-bold">{inspectedConstellation.borders.decRange}</span>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {inspectedConstellation.borders.boundarySummary}
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Hemisphere</span>
                      <span className="text-white font-bold">{inspectedConstellation.hemisphere}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Area & Rank</span>
                      <span className="text-white font-bold">
                        {inspectedConstellation.areaSqDeg} sq° (#{inspectedConstellation.areaRank})
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Constellation Family</span>
                      <span className="text-white font-bold">{inspectedConstellation.family}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Best Viewing Month</span>
                      <span className="text-cyan-300 font-bold">{inspectedConstellation.bestViewingMonth}</span>
                    </div>
                  </div>

                  {/* Principal Star Action */}
                  {starMap.get(inspectedConstellation.principalStarId) && (() => {
                    const pStar = starMap.get(inspectedConstellation.principalStarId)!;
                    return (
                      <div className="p-3.5 rounded-xl bg-[#04091c] border border-cyan-500/20 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 text-xs">
                          <StarDot2D star={pStar} sizeClassName="w-3.5 h-3.5" />
                          <div>
                            <span className="text-slate-400 block text-[10px]">Principal Star:</span>
                            <span className="text-white font-bold text-sm">
                              {pStar.name}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setInspectedConstellation(null);
                            onSelectStar(pStar);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-transform active:scale-95 shrink-0"
                        >
                          <StarDot2D star={pStar} sizeClassName="w-2.5 h-2.5" />
                          <span>Inspect Star in 3D</span>
                        </button>
                      </div>
                    );
                  })()}

                  {/* Cataloged Constellation Stars List with Known Locations */}
                  {(() => {
                    const seenIds = new Set<string>();
                    const cCatalogStars = STARS_CATALOG.filter(
                      (s) => {
                        const matches = s.constellation.toLowerCase() === inspectedConstellation.name.toLowerCase() ||
                          s.constellation.toLowerCase() === inspectedConstellation.id.toLowerCase();
                        if (!matches || seenIds.has(s.id)) return false;
                        seenIds.add(s.id);
                        return true;
                      }
                    );
                    if (cCatalogStars.length === 0) return null;

                    return (
                      <div className="p-4 rounded-xl bg-[#04091c] border border-cyan-500/30 flex flex-col gap-3 shadow-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-cyan-400 shrink-0" />
                            <h4 className="text-xs sm:text-sm font-mono uppercase text-slate-200 font-bold tracking-wider">
                              Catalog Stars in {inspectedConstellation.name} ({cCatalogStars.length})
                            </h4>
                          </div>
                          <span className="text-[11px] text-cyan-400 font-mono">
                            Coordinates & Locations Mapped • Click to Inspect in 3D
                          </span>
                        </div>

                        <div className="max-h-72 overflow-y-auto pr-1.5 space-y-2 divide-y divide-slate-800/60">
                          {cCatalogStars.map((st) => {
                            const isPrincipal = st.id === inspectedConstellation.principalStarId;
                            const cleanName = st.name.replace(/\s*\([^)]+\)/g, '').trim();
                            const locationDesc =
                              STAR_CONSTELLATION_LOCATIONS[st.id] ||
                              `Key Anchor in ${inspectedConstellation.name}`;

                            return (
                              <div
                                key={st.id}
                                className={`pt-2 first:pt-0 p-2.5 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                  isPrincipal
                                    ? 'bg-cyan-950/40 border-cyan-500/40 hover:border-cyan-400'
                                    : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-cyan-500/30'
                                }`}
                              >
                                <div className="flex flex-col gap-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <StarDot2D star={st} sizeClassName="w-2.5 h-2.5" />
                                    <span className="font-bold text-xs sm:text-sm text-white truncate">
                                      {cleanName}
                                    </span>
                                    {st.bayerDesignation && (
                                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                        {st.bayerDesignation}
                                      </span>
                                    )}
                                    {isPrincipal && (
                                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 font-bold border border-amber-600/60">
                                        Principal Star
                                      </span>
                                    )}
                                  </div>

                                  {/* Known Celestial Location */}
                                  <div className="flex items-start sm:items-center gap-1.5 text-[11px] font-mono text-cyan-300/90 leading-tight">
                                    <Compass className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
                                    <span className="break-words">{locationDesc}</span>
                                  </div>

                                  {/* Astro Specs Badges */}
                                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-400">
                                    <span className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300">
                                      {st.spectralType}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300">
                                      mag {st.apparentMagnitude}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300">
                                      {st.distanceLy.toLocaleString()} ly
                                    </span>
                                    {st.stellarStage && (
                                      <span className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300 hidden md:inline">
                                        {st.stellarStage}
                                      </span>
                                    )}
                                    {st.exoplanetSystem?.hasExoplanets && (
                                      <span className="px-1.5 py-0.5 rounded bg-indigo-950/70 border border-indigo-700/50 text-indigo-300 font-semibold">
                                        🪐 {st.exoplanetSystem.confirmedCount ? `${st.exoplanetSystem.confirmedCount} Planets` : 'Exoplanet Host'}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    setInspectedConstellation(null);
                                    onSelectStar(st);
                                  }}
                                  className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/50 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0 shadow"
                                  title={`Open 3D Star Dossier for ${cleanName}`}
                                >
                                  <StarDot2D star={st} sizeClassName="w-2.5 h-2.5" />
                                  <span>Inspect in 3D</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Bottom Section: Description & Mythology */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-[#04091c] border border-cyan-500/20">
                  <strong className="text-cyan-300 block mb-1.5 font-bold flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span>Astronomical Overview:</span>
                  </strong>
                  <p className="text-slate-300 leading-relaxed">{inspectedConstellation.description}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#04091c] border border-cyan-500/20">
                  <strong className="text-amber-300 block mb-1.5 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Mythology & Classical Lore:</span>
                  </strong>
                  <p className="text-slate-300 leading-relaxed">{inspectedConstellation.mythology}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};