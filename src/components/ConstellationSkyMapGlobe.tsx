import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ConstellationInfo, ALL_88_CONSTELLATIONS } from '../data/constellationsData';
import { CelestialData } from '../hooks/useCelestialData';
import {
  SkyMapProjectionType,
  DynamicSphericalProjectOptions,
  projectDynamicSphericalPoint,
  inverseScreenToSpherical,
  getConstellationSphericalCenter,
  getConstellationBoundingSpan,
  pointInPolygon,
  isProminentDso
} from '../utils/celestialMechanics';
import {
  Globe,
  Waves,
  Layers,
  Sparkles,
  Compass,
  Sun,
  Plus,
  Minus,
  RotateCcw,
  Info,
  ChevronDown,
  ChevronUp,
  MapPin,
  CircleDot
} from 'lucide-react';
import { getDsoCategory, DSO_LEGEND_CONFIG } from './ConstellationMap';

export interface SkyMapLayerOptions {
  showMilkyWay?: boolean;
  showBoundaries?: boolean;
  showAsterisms?: boolean;
  showStars?: boolean;
  showDSOs?: boolean;
  showGraticule?: boolean;
  showEcliptic?: boolean;
  showLabels?: boolean;
}

export interface ConstellationSkyMapGlobeProps {
  celestialData: CelestialData;
  onSelectConstellation?: (constellation: ConstellationInfo) => void;
  selectedConstellationId?: string | null;
  className?: string;

  /** Initial camera Right Ascension in degrees (0° to 360°) */
  initialCenterRa?: number;
  /** Initial camera Declination in degrees (-90° to +90°) */
  initialCenterDec?: number;
  /** Initial camera zoom multiplier */
  initialZoom?: number;
  /** Constellation to focus and frame upon mount / change */
  focalConstellation?: ConstellationInfo | null;
  /** Specific catalog star to highlight / circle on the canvas (e.g. Peacock in Pavo) */
  focalStarId?: string | null;
  /** Callback when user clicks on a star in the canvas */
  onSelectStar?: (starData: any) => void;
  /** Callback when user clicks on a DSO in the canvas */
  onSelectDso?: (dsoData: any) => void;

  /** Display mode / layout variant */
  variant?: 'explorer' | 'dossier' | 'compact';
  /** Whether canvas dimensions should strictly fill parent container */
  fitContainer?: boolean;
  /** Aspect ratio override when fitContainer is false */
  aspectRatio?: number;

  /** Optional external control for layer toggles */
  layerOptions?: SkyMapLayerOptions;
  /** Hide built-in top toolbar header when controlled externally by the host modal/view */
  hideHeaderToolbar?: boolean;
  /** Hide built-in bottom status bar */
  hideFooterStatusBar?: boolean;
  /** Callback when camera coordinates or zoom change */
  onCameraChange?: (camera: { centerRa: number; centerDec: number; zoom: number }) => void;
}

export const ConstellationSkyMapGlobe: React.FC<ConstellationSkyMapGlobeProps> = ({
  celestialData,
  onSelectConstellation,
  selectedConstellationId,
  className = '',
  initialCenterRa,
  initialCenterDec,
  initialZoom,
  focalConstellation,
  focalStarId,
  onSelectStar,
  onSelectDso,
  variant = 'explorer',
  fitContainer = false,
  aspectRatio,
  layerOptions,
  hideHeaderToolbar,
  hideFooterStatusBar,
  onCameraChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Viewport Dimensions (logical pixels)
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 900, height: 480 });

  // Map abbreviation to ConstellationInfo for O(1) lookup
  const constMap = useMemo(() => {
    const map = new Map<string, ConstellationInfo>();
    for (const c of ALL_88_CONSTELLATIONS) {
      map.set(c.abbreviation.toUpperCase(), c);
    }
    return map;
  }, []);

  // Precompute Constellation Spherical Centers for labeling using accurate 3D unit vector summation
  const constellationCenters = useMemo(() => {
    const d2r = Math.PI / 180;
    const r2d = 180 / Math.PI;

    if (!celestialData.bounds || celestialData.bounds.length === 0) {
      return ALL_88_CONSTELLATIONS.map((c) => {
        const { cLon, cLat } = getConstellationSphericalCenter(c, celestialData.bounds);
        return {
          id: c.abbreviation,
          constInfo: c,
          label: c.abbreviation,
          fullName: c.name,
          raDeg: (cLon % 360 + 360) % 360,
          decDeg: cLat
        };
      });
    }

    return celestialData.bounds.map((feat) => {
      const abbr = String(feat.id || '').toUpperCase();
      const constInfo = constMap.get(abbr) || (abbr.startsWith('SER') ? constMap.get('SER') : undefined);
      const ring = feat.geometry.coordinates[0] || [];

      let sumX = 0;
      let sumY = 0;
      let sumZ = 0;

      for (const [lon, lat] of ring) {
        const lam = lon * d2r;
        const phi = lat * d2r;
        sumX += Math.cos(phi) * Math.cos(lam);
        sumY += Math.cos(phi) * Math.sin(lam);
        sumZ += Math.sin(phi);
      }

      const cLon = Math.atan2(sumY, sumX) * r2d;
      const cLat = Math.atan2(sumZ, Math.hypot(sumX, sumY)) * r2d;
      const raDeg = (cLon % 360 + 360) % 360;

      let label = constInfo ? constInfo.abbreviation : abbr;
      let fullName = constInfo ? constInfo.name : abbr;
      if (feat.id === 'Ser') {
        const isCaput = cLon < -100;
        label = isCaput ? 'Ser (Cap)' : 'Ser (Cau)';
        fullName = isCaput ? 'Serpens Caput' : 'Serpens Cauda';
      }

      return {
        id: feat.id,
        constInfo: constInfo || ALL_88_CONSTELLATIONS[0],
        label,
        fullName,
        raDeg,
        decDeg: cLat
      };
    });
  }, [celestialData.bounds, constMap]);

  // Current Astronomical Solar Position on the Ecliptic
  const sunPosition = useMemo(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    const solarLonDeg = (((dayOfYear - 79) / 365.2422) * 360 + 360) % 360;
    const epsRad = 23.43928 * (Math.PI / 180);
    const lRad = solarLonDeg * (Math.PI / 180);

    const sinDec = Math.sin(epsRad) * Math.sin(lRad);
    const decDeg = Math.asin(sinDec) * (180 / Math.PI);
    const raRad = Math.atan2(Math.sin(lRad) * Math.cos(epsRad), Math.cos(lRad));
    const raDeg = ((raRad * (180 / Math.PI)) % 360 + 360) % 360;

    return {
      raDeg,
      decDeg,
      raHoursStr: (raDeg / 15).toFixed(1) + 'h',
      decDegStr: (decDeg > 0 ? '+' : '') + decDeg.toFixed(1) + '°'
    };
  }, []);

  // Initial camera framing logic
  const initialFraming = useMemo(() => {
    if (focalConstellation) {
      const { cLon, cLat, optimalZoom } = getConstellationBoundingSpan(focalConstellation, celestialData.bounds);
      return {
        ra: initialCenterRa !== undefined ? initialCenterRa : (cLon % 360 + 360) % 360,
        dec: initialCenterDec !== undefined ? initialCenterDec : cLat,
        zoom: initialZoom !== undefined ? initialZoom : optimalZoom
      };
    }
    return {
      ra: initialCenterRa !== undefined ? initialCenterRa : 0,
      dec: initialCenterDec !== undefined ? initialCenterDec : 10,
      zoom: initialZoom !== undefined ? initialZoom : 1.0
    };
  }, [focalConstellation, celestialData.bounds, initialCenterRa, initialCenterDec, initialZoom]);

  // Spherical Coordinates & Camera State
  const [centerRa, setCenterRa] = useState<number>(initialFraming.ra);
  const [centerDec, setCenterDec] = useState<number>(initialFraming.dec);
  const [zoom, setZoom] = useState<number>(initialFraming.zoom);
  const [projection, setProjection] = useState<SkyMapProjectionType>('stereographic');

  // Internal layer toggle state (used when layerOptions prop is not provided)
  const [showMilkyWay, setShowMilkyWay] = useState<boolean>(true);
  const [showBoundaries, setShowBoundaries] = useState<boolean>(true);
  const [showAsterisms, setShowAsterisms] = useState<boolean>(true);
  const [showStars, setShowStars] = useState<boolean>(true);
  const [showDSOs, setShowDSOs] = useState<boolean>(true);
  const [showGraticule, setShowGraticule] = useState<boolean>(true);
  const [showEcliptic, setShowEcliptic] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Effective layer visibility merging prop overrides with internal state
  const effectiveShowMilkyWay = layerOptions?.showMilkyWay ?? showMilkyWay;
  const effectiveShowBoundaries = layerOptions?.showBoundaries ?? showBoundaries;
  const effectiveShowAsterisms = layerOptions?.showAsterisms ?? showAsterisms;
  const effectiveShowStars = layerOptions?.showStars ?? showStars;
  const effectiveShowDSOs = layerOptions?.showDSOs ?? showDSOs;
  const effectiveShowGraticule = layerOptions?.showGraticule ?? showGraticule;
  const effectiveShowEcliptic = layerOptions?.showEcliptic ?? showEcliptic;
  const effectiveShowLabels = layerOptions?.showLabels ?? showLabels;

  // Interactive Hover & Drag State
  const [hoveredConstellation, setHoveredConstellation] = useState<ConstellationInfo | null>(null);
  const [mouseCoord, setMouseCoord] = useState<{ raStr: string; decStr: string } | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; startRa: number; startDec: number }>({
    x: 0,
    y: 0,
    startRa: 0,
    startDec: 0
  });
  const touchDistanceRef = useRef<number | null>(null);

  // Store active 2D projected objects for pixel-accurate hit-testing
  const renderedBoundariesRef = useRef<Array<{ id: string; constInfo?: ConstellationInfo; ring: Array<{ x: number; y: number }> }>>([]);
  const renderedBadgesRef = useRef<Array<{ id: string; constInfo: ConstellationInfo; rect: { x: number; y: number; w: number; h: number } }>>([]);
  const renderedStarsRef = useRef<Array<{ id: string; data: any; x: number; y: number; r: number }>>([]);
  const renderedDsosRef = useRef<Array<{ id: string; data: any; x: number; y: number; r: number }>>([]);

  // Smooth Camera Flight Animation
  const animFrameRef = useRef<number | null>(null);
  const cameraRef = useRef({ centerRa, centerDec, zoom });
  useEffect(() => {
    cameraRef.current = { centerRa, centerDec, zoom };
  }, [centerRa, centerDec, zoom]);

  const flyTo = useCallback((targetRa: number, targetDec: number, targetZoom: number, duration = 700, onComplete?: () => void) => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const startRa = cameraRef.current.centerRa;
    const startDec = cameraRef.current.centerDec;
    const startZoom = cameraRef.current.zoom;

    let deltaRa = (targetRa - startRa) % 360;
    if (deltaRa > 180) deltaRa -= 360;
    if (deltaRa < -180) deltaRa += 360;

    const deltaDec = targetDec - startDec;
    const deltaZoom = targetZoom - startZoom;

    const startTime = performance.now();

    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = easeInOutCubic(progress);

      const nextRa = ((startRa + deltaRa * ease) % 360 + 360) % 360;
      const nextDec = Math.max(-90, Math.min(90, startDec + deltaDec * ease));
      const nextZoom = Math.max(0.6, Math.min(12.0, startZoom + deltaZoom * ease));

      setCenterRa(nextRa);
      setCenterDec(nextDec);
      setZoom(nextZoom);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
        if (onComplete) onComplete();
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  // Cancel animation on component unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Camera Change notification
  useEffect(() => {
    if (onCameraChange) {
      onCameraChange({ centerRa, centerDec, zoom });
    }
  }, [centerRa, centerDec, zoom, onCameraChange]);

  // Resize Observer to keep Canvas responsive
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const w = Math.max(100, Math.floor(rect.width));
        if (fitContainer || variant === 'dossier') {
          const h = Math.max(100, Math.floor(rect.height || rect.width));
          setDimensions({ width: w, height: h });
        } else {
          const ratio = aspectRatio || (w < 640 ? 0.75 : 0.52);
          const h = Math.floor(w * ratio);
          setDimensions({ width: w, height: Math.min(540, h) });
        }
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [fitContainer, variant, aspectRatio]);

  // Track previous focal constellation ID for smooth animated transitions
  const prevFocalIdRef = useRef<string | null>(focalConstellation?.id || null);

  // Synchronize camera when focalConstellation or selectedConstellationId changes
  useEffect(() => {
    if (focalConstellation) {
      const { cLon, cLat, optimalZoom } = getConstellationBoundingSpan(focalConstellation, celestialData.bounds);
      const targetRa = (cLon % 360 + 360) % 360;
      const targetDec = cLat;
      const targetZoom = initialZoom !== undefined ? initialZoom : optimalZoom;

      if (prevFocalIdRef.current && prevFocalIdRef.current !== focalConstellation.id) {
        // Smoothly fly camera to new neighboring constellation
        flyTo(targetRa, targetDec, targetZoom, 700);
      } else {
        setCenterRa(targetRa);
        setCenterDec(targetDec);
        if (initialZoom === undefined) {
          setZoom(optimalZoom);
        }
      }
      prevFocalIdRef.current = focalConstellation.id;
      return;
    }
    if (!selectedConstellationId) return;
    const target = constellationCenters.find((item) => item.constInfo.id === selectedConstellationId);
    if (target) {
      flyTo(target.raDeg, target.decDeg, Math.max(1.8, zoom), 700);
    }
  }, [focalConstellation, selectedConstellationId, constellationCenters, celestialData.bounds, initialZoom, flyTo]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isCollapsed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = dimensions;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const radius = Math.min(width, height) / 2.2;
    const cx = width / 2;
    const cy = height / 2;

    const projOpts: DynamicSphericalProjectOptions = {
      centerRaDeg: centerRa,
      centerDecDeg: centerDec,
      width,
      height,
      radius,
      zoom,
      projection
    };

    // 1. Deep Space Background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#020512';
    ctx.fillRect(0, 0, width, height);

    // Save state for clipping circular boundary (Stereographic & Orthographic)
    ctx.save();

    if (projection === 'orthographic') {
      const discR = radius * zoom;
      ctx.beginPath();
      ctx.arc(cx, cy, discR, 0, 2 * Math.PI);
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, discR);
      bgGrad.addColorStop(0, '#040d29');
      bgGrad.addColorStop(0.7, '#020718');
      bgGrad.addColorStop(1, '#01030d');
      ctx.fillStyle = bgGrad;
      ctx.fill();
      ctx.clip(); // Clip to the 3D globe hemisphere
    } else {
      // Stereographic
      const discR = radius * zoom * 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, discR, 0, 2 * Math.PI);
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, discR);
      bgGrad.addColorStop(0, '#040d29');
      bgGrad.addColorStop(0.65, '#020718');
      bgGrad.addColorStop(1, '#010410');
      ctx.fillStyle = bgGrad;
      ctx.fill();
    }

    // 2. Coordinate Graticule (Parallels, Meridians, Equator)
    if (effectiveShowGraticule) {
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 4]);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.16)';

      // Parallels of Declination (-75° to +75° by 15°)
      for (let dec = -75; dec <= 75; dec += 15) {
        if (dec === 0) continue; // Drawn separately as Equator
        ctx.beginPath();
        let started = false;
        for (let ra = 0; ra <= 360; ra += 4) {
          const pt = projectDynamicSphericalPoint(ra, dec, projOpts);
          if (pt.isVisible) {
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // Meridians of Right Ascension (every 30° / 2 hours)
      for (let ra = 0; ra < 360; ra += 30) {
        ctx.beginPath();
        let started = false;
        for (let dec = -88; dec <= 88; dec += 3) {
          const pt = projectDynamicSphericalPoint(ra, dec, projOpts);
          if (pt.isVisible) {
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // Celestial Equator (Solid Bright Cyan)
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      let startedEq = false;
      for (let ra = 0; ra <= 360; ra += 2) {
        const pt = projectDynamicSphericalPoint(ra, 0, projOpts);
        if (pt.isVisible) {
          if (!startedEq) {
            ctx.moveTo(pt.x, pt.y);
            startedEq = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        } else {
          startedEq = false;
        }
      }
      ctx.stroke();
    }

    // 3. Solar Ecliptic Path (Annual Path of the Sun)
    if (effectiveShowEcliptic) {
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      let startedEcl = false;
      const obliquityRad = 23.43928 * (Math.PI / 180);

      for (let eclLon = 0; eclLon <= 360; eclLon += 2) {
        const lRad = eclLon * (Math.PI / 180);
        const sinDec = Math.sin(obliquityRad) * Math.sin(lRad);
        const decDeg = Math.asin(sinDec) * (180 / Math.PI);
        const raRad = Math.atan2(Math.sin(lRad) * Math.cos(obliquityRad), Math.cos(lRad));
        const raDeg = ((raRad * (180 / Math.PI)) % 360 + 360) % 360;

        const pt = projectDynamicSphericalPoint(raDeg, decDeg, projOpts);
        if (pt.isVisible) {
          if (!startedEcl) {
            ctx.moveTo(pt.x, pt.y);
            startedEcl = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        } else {
          startedEcl = false;
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 4. Multi-tier Milky Way Galactic Contours
    if (effectiveShowMilkyWay && celestialData.milkyWay && celestialData.milkyWay.length > 0) {
      celestialData.milkyWay.forEach((feat, idx) => {
        let fill = 'rgba(56, 189, 248, 0.04)';
        if (idx === 1) fill = 'rgba(56, 189, 248, 0.08)';
        if (idx === 2) fill = 'rgba(96, 165, 250, 0.12)';
        if (idx === 3) fill = 'rgba(147, 197, 253, 0.18)';
        if (idx === 4) fill = 'rgba(240, 246, 255, 0.28)';

        ctx.fillStyle = fill;

        for (const polygon of feat.geometry.coordinates) {
          for (const ring of polygon) {
            ctx.beginPath();
            let started = false;
            for (let i = 0; i < ring.length; i++) {
              const [ra, dec] = ring[i];
              const pt = projectDynamicSphericalPoint(ra, dec, projOpts);
              if (pt.isVisible) {
                if (!started) {
                  ctx.moveTo(pt.x, pt.y);
                  started = true;
                } else {
                  ctx.lineTo(pt.x, pt.y);
                }
              } else {
                if (started) {
                  ctx.closePath();
                  ctx.fill();
                  started = false;
                }
              }
            }
            if (started) {
              ctx.closePath();
              ctx.fill();
            }
          }
        }
      });
    }

    // 5. Delporte Constellation Boundaries (89 Sectors)
    const currentRenderedBoundaries: Array<{ id: string; constInfo?: ConstellationInfo; ring: Array<{ x: number; y: number }> }> = [];

    if (effectiveShowBoundaries && celestialData.bounds) {
      celestialData.bounds.forEach((feat) => {
        const abbr = String(feat.id || '').toUpperCase();
        const constInfo = constMap.get(abbr) || (abbr.startsWith('SER') ? constMap.get('SER') : undefined);
        const isFocal = (focalConstellation && focalConstellation.id === constInfo?.id) || selectedConstellationId === constInfo?.id;
        const isHovered = hoveredConstellation?.id === constInfo?.id;

        if (isFocal) {
          ctx.lineWidth = 2.4;
          ctx.strokeStyle = constInfo?.isZodiac ? '#f59e0b' : '#38bdf8';
          ctx.fillStyle = constInfo?.isZodiac ? 'rgba(245, 158, 11, 0.22)' : 'rgba(6, 182, 212, 0.22)';
        } else if (isHovered) {
          ctx.lineWidth = 1.8;
          ctx.strokeStyle = constInfo?.isZodiac ? '#fbbf24' : '#22d3ee';
          ctx.fillStyle = constInfo?.isZodiac ? 'rgba(245, 158, 11, 0.15)' : 'rgba(6, 182, 212, 0.15)';
        } else {
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
          ctx.fillStyle = 'transparent';
        }

        for (const ring of feat.geometry.coordinates) {
          ctx.beginPath();
          let started = false;
          const currentScreenRing: Array<{ x: number; y: number }> = [];
          for (let i = 0; i < ring.length; i++) {
            const [ra, dec] = ring[i];
            const pt = projectDynamicSphericalPoint(ra, dec, projOpts);
            if (pt.isVisible) {
              currentScreenRing.push({ x: pt.x, y: pt.y });
              if (!started) {
                ctx.moveTo(pt.x, pt.y);
                started = true;
              } else {
                ctx.lineTo(pt.x, pt.y);
              }
            } else {
              started = false;
            }
          }
          if (started) {
            ctx.closePath();
            ctx.stroke();
            if (isFocal || isHovered) {
              ctx.fill();
            }
          }
          if (currentScreenRing.length >= 3 && constInfo) {
            currentRenderedBoundaries.push({
              id: feat.id,
              constInfo,
              ring: currentScreenRing
            });
          }
        }
      });
    }

    renderedBoundariesRef.current = currentRenderedBoundaries;

    // 6. Constellation Stick-Figure Asterism Lines
    if (effectiveShowAsterisms && celestialData.lines) {
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.75)';
      ctx.beginPath();

      celestialData.lines.forEach((feat) => {
        for (const line of feat.geometry.coordinates) {
          let started = false;
          for (let i = 0; i < line.length; i++) {
            const [ra, dec] = line[i];
            const pt = projectDynamicSphericalPoint(ra, dec, projOpts);
            if (pt.isVisible) {
              if (!started) {
                ctx.moveTo(pt.x, pt.y);
                started = true;
              } else {
                ctx.lineTo(pt.x, pt.y);
              }
            } else {
              started = false;
            }
          }
        }
      });
      ctx.stroke();
    }

    // 7. Full Astrometric Starfield (down to mag 6.0 with B-V chromaticity)
    const currentRenderedStars: Array<{ id: string; data: any; x: number; y: number; r: number }> = [];

    if (effectiveShowStars) {
      if (celestialData.stars && celestialData.stars.length > 0) {
        // Real astrometric starfield
        // Limit faintest stars at low zoom to maintain crisp 60 FPS Canvas performance
        const maxMag = zoom < 0.9 ? 4.8 : zoom < 1.4 ? 5.5 : 6.0;

        for (const starFeat of celestialData.stars) {
          const mag = starFeat.properties?.mag ?? 6;
          if (mag > maxMag) continue;

          const coords = starFeat.geometry?.coordinates;
          if (!coords || coords.length < 2) continue;
          const [sRa, sDec] = coords;

          const pt = projectDynamicSphericalPoint(sRa, sDec, projOpts);
          if (!pt.isVisible) continue;

          // Realistic magnitude scaling: brighter stars (lower mag) are larger
          // Sirius is -1.44, Vega is 0.03, Polaris is 1.98, limit is ~6.0
          const clampedMag = Math.max(-1.5, mag);
          const baseRadius = Math.max(0.6, (6.2 - clampedMag) * 0.48 * Math.sqrt(Math.max(1, zoom * 0.8)));

          // Record for interactive star hit-testing
          currentRenderedStars.push({
            id: String(starFeat.id || ''),
            data: starFeat,
            x: pt.x,
            y: pt.y,
            r: baseRadius
          });

          // Check if this star is the focal star (e.g. principal anchor star)
          const isFocalStar = Boolean(
            (focalStarId && (starFeat.id === focalStarId || starFeat.properties?.id === focalStarId)) ||
            (!focalStarId && focalConstellation && (starFeat.id === focalConstellation.principalStarId || starFeat.properties?.id === focalConstellation.principalStarId))
          );

          // B-V Chromaticity Color Tuning
          const bvVal = parseFloat(starFeat.properties?.bv ?? '0.4');
          let starColor = '#ffffff';
          let haloColor = 'rgba(255, 255, 255, 0.2)';

          if (bvVal < 0.0) {
            // Blue/White (O/B type)
            starColor = '#93c5fd';
            haloColor = 'rgba(147, 197, 253, 0.35)';
          } else if (bvVal < 0.4) {
            // Crisp White (A/early F type)
            starColor = '#f8fafc';
            haloColor = 'rgba(248, 250, 252, 0.25)';
          } else if (bvVal < 0.9) {
            // Warm Yellow-white (F/G type, Sol)
            starColor = '#fef08a';
            haloColor = 'rgba(254, 240, 138, 0.3)';
          } else if (bvVal < 1.5) {
            // Warm Amber / Golden (K type)
            starColor = '#fed7aa';
            haloColor = 'rgba(254, 215, 170, 0.35)';
          } else {
            // Ruby / M-type Orange-Red (Betelgeuse, Antares)
            starColor = '#fca5a5';
            haloColor = 'rgba(252, 165, 165, 0.38)';
          }

          // Render halo for prominent stars (mag <= 3.2)
          if (clampedMag <= 3.2) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, baseRadius * 2.2, 0, 2 * Math.PI);
            ctx.fillStyle = haloColor;
            ctx.fill();
          }

          // Focal star special target ring
          if (isFocalStar) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, Math.max(7, baseRadius * 3.2), 0, 2 * Math.PI);
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 1.6;
            ctx.setLineDash([3, 2]);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(pt.x, pt.y, Math.max(11, baseRadius * 4.6), 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
            ctx.lineWidth = 1.0;
            ctx.setLineDash([]);
            ctx.stroke();
            ctx.restore();
          }

          // Core disc
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, baseRadius, 0, 2 * Math.PI);
          ctx.fillStyle = starColor;
          ctx.fill();
        }
      } else {
        // Fallback: prominent constellation anchor stars if star catalog is still loading
        ALL_88_CONSTELLATIONS.forEach((c) => {
          const { cLon, cLat } = getConstellationSphericalCenter(c, celestialData.bounds);
          const pt = projectDynamicSphericalPoint(cLon, cLat, projOpts);
          if (pt.isVisible) {
            const isZodiac = c.isZodiac;
            const r = isZodiac ? 2.5 : 1.8;

            ctx.beginPath();
            ctx.arc(pt.x, pt.y, r * 2.2, 0, 2 * Math.PI);
            ctx.fillStyle = isZodiac ? 'rgba(254, 240, 138, 0.25)' : 'rgba(186, 230, 253, 0.22)';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(pt.x, pt.y, r, 0, 2 * Math.PI);
            ctx.fillStyle = isZodiac ? '#fef08a' : '#ffffff';
            ctx.fill();
          }
        });
      }
    }

    renderedStarsRef.current = currentRenderedStars;

    // 7.5. Deep-Sky Objects (Prominent Messier, Caldwell & Named NGC/IC Objects)
    const currentRenderedDsos: Array<{ id: string; data: any; x: number; y: number; r: number }> = [];

    if (effectiveShowDSOs && celestialData.dsos && celestialData.dsos.length > 0) {
      const maxAllowedMag = zoom < 1.0 ? 5.5 : zoom < 1.8 ? 7.0 : 8.5;

      for (const dsoFeat of celestialData.dsos) {
        if (!isProminentDso(dsoFeat, celestialData.dsoNames, maxAllowedMag)) continue;

        const coords = dsoFeat.geometry?.coordinates;
        if (!coords || coords.length < 2) continue;
        const [dRa, dDec] = coords;

        const pt = projectDynamicSphericalPoint(dRa, dDec, projOpts);
        if (!pt.isVisible) continue;

        const dsoProps = dsoFeat.properties || {};
        const desig = (dsoProps.desig || '').trim();
        const dsoId = String(dsoFeat.id || '').trim();
        const isMessier = /^M\s*\d+$/i.test(desig);
        const isCaldwell = /^C\s*\d+$/i.test(desig);
        const nameInfo = celestialData.dsoNames?.[dsoId] || celestialData.dsoNames?.[desig];
        const commonName = typeof nameInfo === 'object' && nameInfo?.name ? nameInfo.name : null;
        const dsoMagStr = dsoProps.mag;
        const dsoMag = dsoMagStr && dsoMagStr !== '999' ? parseFloat(dsoMagStr) : null;

        const cat = getDsoCategory(dsoProps.type);
        const config = DSO_LEGEND_CONFIG[cat];
        const dsoRadius = Math.max(2.0, Math.min(5.0, 2.8 * Math.sqrt(zoom * 0.8)));

        currentRenderedDsos.push({
          id: String(dsoFeat.id || desig),
          data: dsoFeat,
          x: pt.x,
          y: pt.y,
          r: dsoRadius
        });

        // Outer glow
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, dsoRadius * 1.6, 0, 2 * Math.PI);
        ctx.fillStyle = `${config.colorHex}22`;
        ctx.fill();

        // Categorical marker shape
        ctx.strokeStyle = config.strokeHex;
        ctx.lineWidth = 1.0;

        if (cat === 'cluster') {
          // Dotted dashed ring for star cluster
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, dsoRadius, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.2, 0, 2 * Math.PI);
          ctx.fillStyle = config.colorHex;
          ctx.fill();
        } else if (cat === 'galaxy') {
          // Elliptical shape for galaxy
          ctx.beginPath();
          ctx.ellipse(pt.x, pt.y, dsoRadius * 1.3, dsoRadius * 0.7, Math.PI / 4, 0, 2 * Math.PI);
          ctx.stroke();
        } else {
          // Diamond / Square marker for nebula
          ctx.beginPath();
          ctx.strokeRect(pt.x - dsoRadius * 0.7, pt.y - dsoRadius * 0.7, dsoRadius * 1.4, dsoRadius * 1.4);
        }

        // Label prominent DSOs when zoomed in (e.g. M 31, M 42, M 45)
        if (zoom >= 1.6 && desig && (isMessier || isCaldwell || commonName || (dsoMag !== null && dsoMag <= 5.0))) {
          ctx.font = '8px monospace';
          ctx.fillStyle = config.colorHex;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(commonName || desig, pt.x + dsoRadius + 3, pt.y - 4);
        }
      }
    }

    renderedDsosRef.current = currentRenderedDsos;

    // 8. Today's Sun on the Ecliptic
    if (effectiveShowEcliptic) {
      const sunPt = projectDynamicSphericalPoint(sunPosition.raDeg, sunPosition.decDeg, projOpts);
      if (sunPt.isVisible) {
        // Sun outer glow
        ctx.beginPath();
        ctx.arc(sunPt.x, sunPt.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.fill();

        // Sun core
        ctx.beginPath();
        ctx.arc(sunPt.x, sunPt.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = '#fffbeb';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
      }
    }

    // 9. Constellation Names / Abbreviation Labels & Interactive Badges
    const currentRenderedBadges: Array<{ id: string; constInfo: ConstellationInfo; rect: { x: number; y: number; w: number; h: number } }> = [];

    if (effectiveShowLabels) {
      ctx.font = zoom >= 1.6 ? 'bold 10px monospace' : '9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      constellationCenters.forEach(({ constInfo, label, fullName, raDeg, decDeg }) => {
        const pt = projectDynamicSphericalPoint(raDeg, decDeg, projOpts);
        if (pt.isVisible) {
          const isFocal = focalConstellation?.id === constInfo.id;
          const isHovered = hoveredConstellation?.id === constInfo.id;
          const displayLabel = zoom >= 1.7 || isHovered
            ? (label.startsWith('Ser') ? label : fullName.toUpperCase())
            : label;

          const textMetrics = ctx.measureText(displayLabel);
          const badgeW = textMetrics.width + 14;
          const badgeH = 16;
          const bx = pt.x - badgeW / 2;
          const by = pt.y - badgeH / 2;

          // Render pill badge in dossier mode or on hover/focal
          if (variant === 'dossier' || isHovered || isFocal) {
            ctx.save();
            ctx.beginPath();
            const r = 4;
            ctx.moveTo(bx + r, by);
            ctx.lineTo(bx + badgeW - r, by);
            ctx.arcTo(bx + badgeW, by, bx + badgeW, by + r, r);
            ctx.lineTo(bx + badgeW, by + badgeH - r);
            ctx.arcTo(bx + badgeW, by + badgeH, bx + badgeW - r, by + badgeH, r);
            ctx.lineTo(bx + r, by + badgeH);
            ctx.arcTo(bx, by + badgeH, bx, by + badgeH - r, r);
            ctx.lineTo(bx, by + r);
            ctx.arcTo(bx, by, bx + r, by, r);
            ctx.closePath();

            ctx.fillStyle = isFocal
              ? 'rgba(6, 78, 59, 0.88)'
              : isHovered
              ? 'rgba(8, 47, 73, 0.95)'
              : 'rgba(3, 8, 22, 0.82)';
            ctx.fill();

            ctx.lineWidth = isFocal ? 1.4 : isHovered ? 1.4 : 0.8;
            ctx.strokeStyle = isFocal
              ? '#10b981'
              : isHovered
              ? '#38bdf8'
              : 'rgba(51, 65, 85, 0.8)';
            ctx.stroke();
            ctx.restore();

            currentRenderedBadges.push({
              id: constInfo.id,
              constInfo,
              rect: { x: bx, y: by, w: badgeW, h: badgeH }
            });
          }

          // Text shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
          ctx.fillText(displayLabel, pt.x + 1, pt.y + 1);

          // Text foreground
          ctx.fillStyle = isFocal
            ? '#34d399'
            : isHovered
            ? (constInfo.isZodiac ? '#fbbf24' : '#38bdf8')
            : constInfo.isZodiac
            ? '#fef08a'
            : 'rgba(224, 231, 255, 0.88)';
          ctx.fillText(displayLabel, pt.x, pt.y);
        }
      });
    }

    renderedBadgesRef.current = currentRenderedBadges;

    ctx.restore(); // Restore unclipped state

    // 10. Outer Boundary Border Ring
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
    if (projection === 'orthographic') {
      ctx.beginPath();
      ctx.arc(cx, cy, radius * zoom, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }, [
    dimensions,
    centerRa,
    centerDec,
    zoom,
    projection,
    variant,
    effectiveShowMilkyWay,
    effectiveShowBoundaries,
    effectiveShowAsterisms,
    effectiveShowStars,
    effectiveShowDSOs,
    effectiveShowGraticule,
    effectiveShowEcliptic,
    effectiveShowLabels,
    hoveredConstellation,
    selectedConstellationId,
    focalConstellation,
    focalStarId,
    celestialData,
    constMap,
    constellationCenters,
    sunPosition,
    isCollapsed
  ]);

  // Mouse & Touch Drag Handlers (Continuous Dynamic Rotation)
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startRa: centerRa,
      startDec: centerDec
    };
  }, [centerRa, centerDec]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const radius = Math.min(dimensions.width, dimensions.height) / 2.2;
    const projOpts: DynamicSphericalProjectOptions = {
      centerRaDeg: centerRa,
      centerDecDeg: centerDec,
      width: dimensions.width,
      height: dimensions.height,
      radius,
      zoom,
      projection
    };

    // If dragging, rotate celestial sphere under cursor
    if (isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;

      // Sensitivity factor based on current radius & zoom
      const degPerPx = (180 / (Math.PI * radius * zoom)) * 0.9;
      // Invert horizontal direction for astronomical coordinate tracking
      const deltaRa = dx * degPerPx;
      const deltaDec = -dy * degPerPx;

      const newRa = (dragStartRef.current.startRa + deltaRa + 360) % 360;
      const newDec = Math.max(-90, Math.min(90, dragStartRef.current.startDec + deltaDec));

      setCenterRa(newRa);
      setCenterDec(newDec);
      return;
    }

    // Live Coordinates Readout
    const spherical = inverseScreenToSpherical(mouseX, mouseY, projOpts);
    if (spherical) {
      setMouseCoord({
        raStr: (spherical.raDeg / 15).toFixed(2) + 'h',
        decStr: (spherical.decDeg > 0 ? '+' : '') + spherical.decDeg.toFixed(1) + '°'
      });
    } else {
      setMouseCoord(null);
    }

    // 1. Primary Hit-Testing: Check Interactive Constellation Badges first
    let matchedConstellation: ConstellationInfo | null = null;
    for (const b of renderedBadgesRef.current) {
      if (
        mouseX >= b.rect.x &&
        mouseX <= b.rect.x + b.rect.w &&
        mouseY >= b.rect.y &&
        mouseY <= b.rect.y + b.rect.h
      ) {
        matchedConstellation = b.constInfo;
        break;
      }
    }

    // 2. Secondary Hit-Testing: True Boundary Polygon Containment (Ray-casting)
    if (!matchedConstellation) {
      for (const pb of renderedBoundariesRef.current) {
        if (pointInPolygon(mouseX, mouseY, pb.ring)) {
          matchedConstellation = pb.constInfo || null;
          break;
        }
      }
    }

    // 3. Tertiary Fallback: Proximity to constellation center label anchor
    if (!matchedConstellation && spherical) {
      let minDistance = Infinity;
      for (const item of constellationCenters) {
        const pt = projectDynamicSphericalPoint(item.raDeg, item.decDeg, projOpts);
        if (pt.isVisible) {
          const dist = Math.hypot(pt.x - mouseX, pt.y - mouseY);
          if (dist < 26 && dist < minDistance) {
            minDistance = dist;
            matchedConstellation = item.constInfo;
          }
        }
      }
    }

    setHoveredConstellation(matchedConstellation);
  }, [centerRa, centerDec, dimensions, zoom, projection, constellationCenters]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Zoom via Mouse Wheel
  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    setZoom((prev) => Math.max(0.6, Math.min(12.0, prev * factor)));
  }, []);

  // Touch Drag & Pinch-to-Zoom Handlers for Mobile
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        startRa: centerRa,
        startDec: centerDec
      };
      touchDistanceRef.current = null;
    } else if (e.touches.length === 2) {
      isDraggingRef.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistanceRef.current = Math.hypot(dx, dy);
    }
  }, [centerRa, centerDec]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const radius = Math.min(dimensions.width, dimensions.height) / 2.2;
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      const degPerPx = (180 / (Math.PI * radius * zoom)) * 0.9;

      const deltaRa = dx * degPerPx;
      const deltaDec = -dy * degPerPx;
      setCenterRa((dragStartRef.current.startRa + deltaRa + 360) % 360);
      setCenterDec(Math.max(-90, Math.min(90, dragStartRef.current.startDec + deltaDec)));
    } else if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.hypot(dx, dy);
      const factor = newDist / touchDistanceRef.current;
      setZoom((prev) => Math.max(0.6, Math.min(12.0, prev * factor)));
      touchDistanceRef.current = newDist;
    }
  }, [dimensions, zoom]);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
    touchDistanceRef.current = null;
  }, []);

  // Click on Canvas: handles star selection, DSO selection, and constellation territory/badge selection
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // 1. Check if user clicked directly on a rendered star
    if (onSelectStar && renderedStarsRef.current.length > 0) {
      let closestStar: any = null;
      let minStarDist = Infinity;
      for (const s of renderedStarsRef.current) {
        const dist = Math.hypot(s.x - clickX, s.y - clickY);
        const hitRadius = Math.max(s.r * 2.8, 8);
        if (dist <= hitRadius && dist < minStarDist) {
          minStarDist = dist;
          closestStar = s.data;
        }
      }
      if (closestStar) {
        onSelectStar(closestStar);
        return;
      }
    }

    // 2. Check if user clicked directly on a rendered DSO
    if (onSelectDso && renderedDsosRef.current.length > 0) {
      let closestDso: any = null;
      let minDsoDist = Infinity;
      for (const d of renderedDsosRef.current) {
        const dist = Math.hypot(d.x - clickX, d.y - clickY);
        const hitRadius = Math.max(d.r * 2.5, 10);
        if (dist <= hitRadius && dist < minDsoDist) {
          minDsoDist = dist;
          closestDso = d.data;
        }
      }
      if (closestDso) {
        onSelectDso(closestDso);
        return;
      }
    }

    // 3. Check if user clicked directly on a constellation pill badge
    let target: ConstellationInfo | null = null;
    for (const b of renderedBadgesRef.current) {
      if (
        clickX >= b.rect.x &&
        clickX <= b.rect.x + b.rect.w &&
        clickY >= b.rect.y &&
        clickY <= b.rect.y + b.rect.h
      ) {
        target = b.constInfo;
        break;
      }
    }

    // 4. Check if user clicked within boundary polygon territory
    if (!target) {
      for (const pb of renderedBoundariesRef.current) {
        if (pointInPolygon(clickX, clickY, pb.ring)) {
          target = pb.constInfo || null;
          break;
        }
      }
    }

    if (!target) {
      target = hoveredConstellation;
    }

    if (target) {
      // In dossier mode, clicking a neighboring constellation territory or badge smoothly flies to it and opens its dossier
      if (variant === 'dossier' && target.id !== focalConstellation?.id && onSelectConstellation) {
        const { cLon, cLat, optimalZoom } = getConstellationBoundingSpan(target, celestialData.bounds);
        const targetRa = (cLon % 360 + 360) % 360;
        const targetDec = cLat;
        flyTo(targetRa, targetDec, optimalZoom, 700);
        onSelectConstellation(target);
      } else {
        setHoveredConstellation(target);
      }
    }
  }, [hoveredConstellation, onSelectStar, onSelectDso, variant, focalConstellation, onSelectConstellation, celestialData.bounds, flyTo]);

  // Double Click on Canvas: opens the Constellation Dossier
  const handleDoubleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    let target = hoveredConstellation;
    if (!target) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        for (const b of renderedBadgesRef.current) {
          if (
            clickX >= b.rect.x &&
            clickX <= b.rect.x + b.rect.w &&
            clickY >= b.rect.y &&
            clickY <= b.rect.y + b.rect.h
          ) {
            target = b.constInfo;
            break;
          }
        }
        if (!target) {
          for (const pb of renderedBoundariesRef.current) {
            if (pointInPolygon(clickX, clickY, pb.ring)) {
              target = pb.constInfo || null;
              break;
            }
          }
        }
      }
    }
    if (target && onSelectConstellation) {
      const { cLon, cLat, optimalZoom } = getConstellationBoundingSpan(target, celestialData.bounds);
      const targetRa = (cLon % 360 + 360) % 360;
      const targetDec = cLat;
      flyTo(targetRa, targetDec, optimalZoom, 700);
      onSelectConstellation(target);
    }
  }, [hoveredConstellation, onSelectConstellation, celestialData.bounds, flyTo]);

  const activeConstellation = hoveredConstellation || (
    selectedConstellationId
      ? ALL_88_CONSTELLATIONS.find((c) => c.id === selectedConstellationId) || null
      : null
  );

  const showHeader = hideHeaderToolbar !== undefined ? !hideHeaderToolbar : variant !== 'dossier';
  const showFooter = hideFooterStatusBar !== undefined ? !hideFooterStatusBar : variant !== 'dossier';

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col ${fitContainer ? 'w-full h-full' : ''} rounded-2xl bg-[#030718] border border-cyan-500/30 shadow-2xl overflow-hidden backdrop-blur-md transition-all select-none ${className}`}
    >
      {/* Top Header & Interactive Information Bar */}
      {showHeader && (
        <div className="relative z-10 px-3.5 sm:px-5 py-3 border-b border-cyan-500/20 bg-[#020512]/90 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Viewport Badge and Active Constellation / Center Coordinates */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shrink-0">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-white tracking-wide truncate">
                  {activeConstellation ? activeConstellation.name : 'Interactive Celestial Sky Map'}
                </span>
                {activeConstellation ? (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 shrink-0">
                    {activeConstellation.abbreviation}
                  </span>
                ) : (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0 capitalize">
                    {projection} View
                  </span>
                )}
                {activeConstellation?.isZodiac && (
                  <span className="text-[8.5px] font-mono px-1.5 py-0.2 rounded bg-amber-950/90 text-amber-300 border border-amber-500/40 font-bold shrink-0">
                    Zodiac {activeConstellation.zodiacSymbol}
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                {activeConstellation
                  ? `"${activeConstellation.resemblance}" • ${activeConstellation.hemisphere} Sky • Rank #${activeConstellation.areaRank} (${activeConstellation.areaSqDeg} sq°)`
                  : `Center: RA ${(centerRa / 15).toFixed(1)}h, Dec ${(centerDec > 0 ? '+' : '')}${centerDec.toFixed(1)}° • Zoom ${zoom.toFixed(1)}× • Drag to rotate, scroll to zoom`}
              </p>
            </div>
          </div>

          {/* Right: Projection Switcher, Layer Toggles, Zoom & Collapse Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 flex-wrap">
            {/* Projection Selector Pills */}
            <div className="flex items-center p-0.5 rounded-lg bg-[#010410] border border-cyan-500/30 text-[9px] sm:text-[10px] font-mono font-bold">
              <button
                onClick={() => setProjection('stereographic')}
                className={`px-1.5 sm:px-2 py-0.5 rounded transition-all cursor-pointer ${
                  projection === 'stereographic' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="Stereographic Conformal Projection (Zero Angular Distortion)"
              >
                Stereo
              </button>
              <button
                onClick={() => setProjection('orthographic')}
                className={`px-1.5 sm:px-2 py-0.5 rounded transition-all cursor-pointer ${
                  projection === 'orthographic' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="Orthographic Projection (3D Celestial Globe)"
              >
                Globe
              </button>
            </div>

            {/* Milky Way Toggle */}
            <button
              onClick={() => setShowMilkyWay(!showMilkyWay)}
              className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                showMilkyWay
                  ? 'bg-blue-950/90 text-blue-300 border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                  : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
              }`}
              title="Toggle Milky Way Galactic Plane & Core Contours"
            >
              <Waves className="w-3 h-3 text-cyan-400" />
              <span className="hidden md:inline">Milky Way</span>
            </button>

            {/* Boundaries Toggle */}
            <button
              onClick={() => setShowBoundaries(!showBoundaries)}
              className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                showBoundaries
                  ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
              }`}
              title="Toggle Delporte IAU Constellation Boundaries"
            >
              <Layers className="w-3 h-3 text-cyan-400" />
              <span className="hidden md:inline">Borders</span>
            </button>

            {/* Asterisms Toggle */}
            <button
              onClick={() => setShowAsterisms(!showAsterisms)}
              className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                showAsterisms
                  ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
              }`}
              title="Toggle Constellation Stick-Figure Lines"
            >
              <Sparkles className="w-3 h-3 text-cyan-300" />
              <span className="hidden md:inline">Lines</span>
            </button>

            {/* Stars Toggle */}
            <button
              onClick={() => setShowStars(!showStars)}
              className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                showStars
                  ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
              }`}
              title="Toggle 6.0 Magnitude Astrometric Starfield"
            >
              <CircleDot className="w-3 h-3 text-cyan-300" />
              <span className="hidden md:inline">Stars</span>
            </button>

            {/* DSOs Toggle */}
            <button
              onClick={() => setShowDSOs(!showDSOs)}
              className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                showDSOs
                  ? 'bg-rose-950/90 text-rose-300 border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                  : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
              }`}
              title="Toggle Deep-Sky Objects (Nebulae, Star Clusters, Galaxies)"
            >
              <span className="text-[10px] text-rose-400">✦</span>
              <span className="hidden md:inline">DSOs</span>
            </button>

            {/* Graticule Toggle */}
            <button
              onClick={() => setShowGraticule(!showGraticule)}
              className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                showGraticule
                  ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
              }`}
              title="Toggle RA/Dec Coordinate Grid"
            >
              <Compass className="w-3 h-3 text-cyan-400" />
              <span className="hidden md:inline">Grid</span>
            </button>

            {/* Ecliptic Toggle */}
            <button
              onClick={() => setShowEcliptic(!showEcliptic)}
              className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                showEcliptic
                  ? 'bg-amber-950/90 text-amber-300 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
              }`}
              title="Toggle Ecliptic Solar Path and Today's Sun"
            >
              <Sun className="w-3 h-3 text-amber-400" />
              <span className="hidden md:inline">Ecliptic</span>
            </button>

            {/* Labels Toggle */}
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                showLabels
                  ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
              }`}
              title="Toggle Constellation Names & Abbreviations"
            >
              <span className="font-bold text-[10px] leading-none">Aa</span>
              <span className="hidden md:inline">Labels</span>
            </button>

            {/* Zoom In & Out */}
            <div className="flex items-center gap-0.5 bg-slate-900/80 border border-slate-700/80 rounded-lg p-0.5">
              <button
                onClick={() => setZoom((prev) => Math.min(12.0, prev * 1.25))}
                className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom((prev) => Math.max(0.6, prev * 0.8))}
                className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                title="Zoom Out"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setCenterRa(0);
                  setCenterDec(10);
                  setZoom(1.0);
                }}
                className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-cyan-300 cursor-pointer"
                title="Reset View (Center RA 0h, Dec +10°, Zoom 1×)"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Collapse/Expand Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 sm:px-2 sm:py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[10px] sm:text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
              title={isCollapsed ? 'Expand Sky Map' : 'Collapse Sky Map'}
            >
              {isCollapsed ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Expand Map</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Canvas Viewport */}
      {!isCollapsed && (
        <div className={`relative w-full ${fitContainer ? 'flex-1 h-full min-h-0' : ''} bg-[#020512] overflow-hidden flex items-center justify-center`}>
          <canvas
            ref={canvasRef}
            style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
            className={`${
              hoveredConstellation && hoveredConstellation.id !== focalConstellation?.id
                ? 'cursor-pointer'
                : 'cursor-grab active:cursor-grabbing'
            } block touch-none`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
          />

          {/* Mini Zoom & Reset Floating Overlay when Header is Hidden */}
          {!showHeader && (
            <div className="absolute top-3 right-3 z-20 flex items-center gap-0.5 bg-slate-900/80 border border-slate-700/80 backdrop-blur-md rounded-lg p-0.5 shadow-lg">
              <button
                onClick={() => setZoom((prev) => Math.min(12.0, prev * 1.25))}
                className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom((prev) => Math.max(0.6, prev * 0.8))}
                className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                title="Zoom Out"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (focalConstellation) {
                    const { cLon, cLat, optimalZoom } = getConstellationBoundingSpan(focalConstellation, celestialData.bounds);
                    setCenterRa((cLon % 360 + 360) % 360);
                    setCenterDec(cLat);
                    setZoom(optimalZoom);
                  } else {
                    setCenterRa(0);
                    setCenterDec(10);
                    setZoom(1.0);
                  }
                }}
                className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-cyan-300 cursor-pointer"
                title="Reset View"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              <span className="px-1.5 py-0.5 text-[9px] font-mono text-cyan-300 font-bold">
                {zoom.toFixed(1)}×
              </span>
            </div>
          )}

          {/* Real-time Cursor Coordinates Readout Pill */}
          {mouseCoord && (
            <div className={`absolute ${variant === 'dossier' ? 'bottom-3 left-4' : 'top-3 left-4'} z-20 px-2 py-1 rounded-lg bg-slate-950/80 border border-slate-700/80 text-[10px] font-mono text-cyan-300 pointer-events-none shadow-md flex items-center gap-1.5`}>
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>RA: {mouseCoord.raStr}</span>
              <span>•</span>
              <span>Dec: {mouseCoord.decStr}</span>
            </div>
          )}

          {/* Floating Constellation Dossier Banner when Hovered / Selected */}
          {activeConstellation && (variant !== 'dossier' || activeConstellation.id !== focalConstellation?.id) && (
            <div className="absolute bottom-3 left-4 right-4 sm:left-auto sm:right-4 z-20 pointer-events-auto">
              <div
                onClick={() => {
                  if (activeConstellation && onSelectConstellation) {
                    const { cLon, cLat, optimalZoom } = getConstellationBoundingSpan(activeConstellation, celestialData.bounds);
                    const targetRa = (cLon % 360 + 360) % 360;
                    const targetDec = cLat;
                    flyTo(targetRa, targetDec, optimalZoom, 700);
                    onSelectConstellation(activeConstellation);
                  }
                }}
                className="p-2 sm:p-2.5 rounded-xl bg-[#040c24]/95 border border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-between gap-3 cursor-pointer hover:bg-[#071338] transition-all"
                title={variant === 'dossier' ? `Switch dossier to ${activeConstellation.name}` : `Click to open Constellation Dossier for ${activeConstellation.name}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-white truncate block">
                      {activeConstellation.name} ({activeConstellation.englishName})
                    </span>
                    <span className="text-[10px] text-cyan-300 font-mono truncate block">
                      Lucida: {activeConstellation.principalStarName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] sm:text-xs font-mono shadow-sm">
                  <span>{variant === 'dossier' ? 'Switch Dossier' : 'Open Dossier'}</span>
                  <Info className="w-3 h-3" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Status Bar */}
      {showFooter && (
        <div className="px-3.5 sm:px-5 py-2 bg-[#020512] border-t border-cyan-500/15 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-2 sm:gap-4 truncate">
            <span>
              <strong className="text-cyan-400 font-bold">88</strong> IAU Sectors
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">
              Sun Transit Today: <strong className="text-amber-300 font-bold">RA {sunPosition.raHoursStr}, Dec {sunPosition.decDegStr}</strong>
            </span>
          </div>
          <div className="text-slate-400 flex items-center gap-2">
            <span className="hidden sm:inline text-slate-500">
              Drag to rotate • Scroll to zoom • Double-click constellation for dossier
            </span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/80">
              {zoom.toFixed(1)}×
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
