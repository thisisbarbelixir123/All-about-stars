import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Keyboard, 
  X, 
  ArrowUpDown, 
  Check, 
  Grid, 
  Maximize2, 
  Minimize2, 
  Pencil, 
  Sliders, 
  BarChart2, 
  BookOpen, 
  RotateCcw, 
  RotateCw, 
  Layers, 
  Eye, 
  EyeOff, 
  MoreHorizontal,
  Play,
  Pause,
  Clock,
  Home,
  Info,
  Coffee,
  ZoomIn,
  ZoomOut,
  Menu,
  Target,
  Compass,
  Sun,
  Search,
  Orbit,
  Volume2,
  VolumeX
} from 'lucide-react';
import { StarData, StageSortKey, SortDirection, TourLength, PresetComparison } from '../types';
import { PRESET_COMPARISONS } from '../data/stars';
import { formatPhysicalDiameter } from '../utils/formatters';
import { createContinuousGridMesh, ContinuousGridHandle } from '../utils/continuousGrid';
import { soundEffects } from '../utils/soundEffects';

const TOUR_DURATION_MAP: Record<TourLength, number> = {
  short: 2500,
  medium: 5000,
  long: 8000,
};

interface StarCanvas3DProps {
  stars: StarData[];
  selectedStarId: string | null;
  onSelectStar: (star: StarData | null) => void;
  scaleMode?: 'proportional' | 'true-linear';
  showCorona: boolean;
  showOrbits?: boolean;
  viewMode?: '3d-comparator';
  onToggleViewMode?: (mode: '3d-comparator') => void;
  focusedStarId?: string | null;
  onInspectStar?: (star: StarData) => void;
  sortKey?: StageSortKey;
  sortDirection?: SortDirection;
  onSortChange?: (key: StageSortKey) => void;
  onToggleSortDirection?: () => void;
  presets?: PresetComparison[];
  activePresetId?: string | null;
  onSelectPreset?: (presetId: string) => void;
  onOpenCreatePreset?: () => void;
  onEditPreset?: (preset: PresetComparison) => void;
  onDeletePreset?: (presetId: string) => void;
  onOpenEditStage?: () => void;
  onOpenHome?: () => void;
  onCloseHome?: () => void;
  isHomeOpen?: boolean;
  onOpenAbout?: () => void;
  onOpenFrontpage?: () => void;
  onOpenCatalog?: () => void;
  onOpenHRDiagram?: () => void;
  onOpenGuide?: () => void;
  onOpenConstellations?: () => void;
  isMobile?: boolean;
  isTablet?: boolean;
  children?: React.ReactNode;
}

export interface StageKbdProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'amber' | 'neutral' | 'active';
  className?: string;
  isTablet?: boolean;
}

export const StageKbd: React.FC<StageKbdProps> = ({
  children,
  variant = 'cyan',
  className = '',
  isTablet,
}) => {
  const isTabletDevice = typeof isTablet === 'boolean' ? isTablet : (typeof window !== 'undefined' && (() => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isIPad = /iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroidTablet = /Android/i.test(ua) && !/Mobile/i.test(ua);
    const minDim = Math.min(window.innerWidth, window.innerHeight);
    const maxDim = Math.max(window.innerWidth, window.innerHeight);
    const isTabletDimensions = minDim >= 600 && minDim <= 1000 && maxDim <= 1366;
    const hasCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    return isIPad || isAndroidTablet || (hasCoarsePointer && isTabletDimensions) || isTabletDimensions;
  })());

  if (isTabletDevice) return null;

  const variantStyles = {
    cyan: 'bg-black/60 border-cyan-500/35 text-cyan-300',
    amber: 'bg-amber-950/70 border-amber-500/40 text-amber-300',
    neutral: 'bg-black/60 border-slate-700 text-slate-300',
    active: 'bg-black/40 border-slate-900/30 text-slate-950 font-bold',
  }[variant];

  return (
    <kbd
      className={`hidden lg:inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[10px] font-mono font-semibold rounded border shadow-sm select-none leading-none tracking-normal pointer-events-none ${variantStyles} ${className}`}
    >
      {children}
    </kbd>
  );
};

export const StarCanvas3D: React.FC<StarCanvas3DProps> = ({
  stars,
  selectedStarId,
  onSelectStar,
  scaleMode,
  showCorona,
  viewMode = '3d-comparator',
  onToggleViewMode,
  focusedStarId,
  onInspectStar,
  sortKey = 'size',
  sortDirection = 'asc',
  onSortChange,
  onToggleSortDirection,
  presets = PRESET_COMPARISONS,
  activePresetId,
  onSelectPreset,
  onOpenCreatePreset,
  onEditPreset,
  onDeletePreset,
  onOpenEditStage,
  onOpenHome,
  onCloseHome,
  isHomeOpen = false,
  isMobile = false,
  isTablet = false,
  onOpenAbout,
  onOpenFrontpage,
  onOpenCatalog,
  onOpenHRDiagram,
  onOpenGuide,
  onOpenConstellations,
  children,
}) => {
  const outerWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive device tracking for consistent portrait/landscape tablet rendering
  const [windowDims, setWindowDims] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  useEffect(() => {
    const onResize = () => {
      setWindowDims({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  const isTabletDevice = Boolean(
    isTablet ||
    (() => {
      if (typeof window === 'undefined') return false;
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const isIPad = /iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isAndroidTablet = /Android/i.test(ua) && !/Mobile/i.test(ua);
      const minDim = Math.min(windowDims.width, windowDims.height);
      const maxDim = Math.max(windowDims.width, windowDims.height);
      const isTabletDimensions = minDim >= 600 && minDim <= 1000 && maxDim <= 1366;
      const hasCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
      return isIPad || isAndroidTablet || (hasCoarsePointer && isTabletDimensions) || isTabletDimensions;
    })()
  );

  // Mobile detection helper across window dimensions and container size
  const checkIsMobile = useCallback(() => {
    if (isMobile) return true;
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768 || window.innerHeight < 550) return true;
    }
    if (containerRef.current) {
      if (containerRef.current.clientWidth < 768 || containerRef.current.clientHeight < 550) return true;
    }
    return false;
  }, [isMobile]);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const starObjectsRef = useRef<Map<string, THREE.Group>>(new Map());
  const labelElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const animFrameIdRef = useRef<number | null>(null);
  const continuousGridRef = useRef<ContinuousGridHandle | null>(null);

  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [hoveredStar, setHoveredStar] = useState<StarData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTourPlaying, setIsTourPlaying] = useState(false);
  const [tourLength, setTourLength] = useState<TourLength>('medium');
  const isTourPlayingRef = useRef(isTourPlaying);
  isTourPlayingRef.current = isTourPlaying;
  const [isPresetSearchActive, setIsPresetSearchActive] = useState(false);
  const [presetSearchQuery, setPresetSearchQuery] = useState('');
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [areControlsHidden, setAreControlsHidden] = useState(false);
  const [isTopPanelMinimized, setIsTopPanelMinimized] = useState(false);
  const [isPresetMenuOpen, setIsPresetMenuOpen] = useState(false);
  const presetMenuRef = useRef<HTMLDivElement>(null);
  const mobilePresetMenuRef = useRef<HTMLDivElement>(null);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const mobileSortMenuRef = useRef<HTMLDivElement>(null);
  const [isTourPaceMenuOpen, setIsTourPaceMenuOpen] = useState(false);
  const tourPaceMenuRef = useRef<HTMLDivElement>(null);
  const mobileTourPaceRef = useRef<HTMLDivElement>(null);
  const [isTogglesMenuOpen, setIsTogglesMenuOpen] = useState(false);
  const togglesMenuRef = useRef<HTMLDivElement>(null);
  const mobileTogglesMenuRef = useRef<HTMLDivElement>(null);
  const [isMobileCompactMenuOpen, setIsMobileCompactMenuOpen] = useState(false);
  const mobileCompactMenuRef = useRef<HTMLDivElement>(null);
  const [isEncyclopediaMenuOpen, setIsEncyclopediaMenuOpen] = useState(false);
  const encyclopediaMenuRef = useRef<HTMLDivElement>(null);
  const mobileEncyclopediaMenuRef = useRef<HTMLDivElement>(null);
  const [encyclopediaDropdownAlign, setEncyclopediaDropdownAlign] = useState<'center' | 'left' | 'right'>('center');

  // Sound FX State listener
  const [isSoundOn, setIsSoundOn] = useState(() => soundEffects.isSoundEnabled());
  useEffect(() => {
    return soundEffects.subscribe((enabled) => setIsSoundOn(enabled));
  }, []);

  // Complete Catalog (All Stars Preset): default spiral layout on desktop/tablet when sorted ascending by size; normal mode otherwise
  const [allStarsLayoutMode, setAllStarsLayoutMode] = useState<'normal' | 'spiral'>(() => {
    if (typeof window !== 'undefined') {
      const isNarrow = window.innerWidth < 768 || window.innerHeight < 550;
      if (isNarrow) return 'normal';
      const saved = localStorage.getItem('cosmic_all_stars_layout_mode');
      if (saved === 'normal' || saved === 'spiral') return saved;
    }
    return 'spiral';
  });

  const handleToggleLayoutMode = useCallback(() => {
    if (checkIsMobile()) return; // Spiral mode is not available on mobile
    if (sortKey !== 'size' || sortDirection !== 'asc') return; // Only available when sorted ascending by size
    setAllStarsLayoutMode((prev) => {
      const next = prev === 'spiral' ? 'normal' : 'spiral';
      soundEffects.play(next === 'spiral' ? 'toggleOn' : 'toggleOff');
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('cosmic_all_stars_layout_mode', next);
        } catch {
          // ignore
        }
      }
      return next;
    });
  }, [checkIsMobile, sortKey, sortDirection]);

  useEffect(() => {
    if (isEncyclopediaMenuOpen && encyclopediaMenuRef.current) {
      const rect = encyclopediaMenuRef.current.getBoundingClientRect();
      const menuWidth = 288;
      const centerPos = rect.left + rect.width / 2;
      if (centerPos + menuWidth / 2 > window.innerWidth - 16) {
        setEncyclopediaDropdownAlign('right');
      } else if (centerPos - menuWidth / 2 < 16) {
        setEncyclopediaDropdownAlign('left');
      } else {
        setEncyclopediaDropdownAlign('center');
      }
    }
  }, [isEncyclopediaMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        presetMenuRef.current && !presetMenuRef.current.contains(target) &&
        (!mobilePresetMenuRef.current || !mobilePresetMenuRef.current.contains(target))
      ) {
        setIsPresetMenuOpen(false);
      }
      if (
        sortMenuRef.current && !sortMenuRef.current.contains(target) &&
        (!mobileSortMenuRef.current || !mobileSortMenuRef.current.contains(target))
      ) {
        setIsSortMenuOpen(false);
      }
      if (
        tourPaceMenuRef.current && !tourPaceMenuRef.current.contains(target) &&
        (!mobileTourPaceRef.current || !mobileTourPaceRef.current.contains(target))
      ) {
        setIsTourPaceMenuOpen(false);
      }
      if (
        togglesMenuRef.current && !togglesMenuRef.current.contains(target) &&
        (!mobileTogglesMenuRef.current || !mobileTogglesMenuRef.current.contains(target))
      ) {
        setIsTogglesMenuOpen(false);
      }
      if (mobileCompactMenuRef.current && !mobileCompactMenuRef.current.contains(target)) {
        setIsMobileCompactMenuOpen(false);
      }
      if (
        encyclopediaMenuRef.current && !encyclopediaMenuRef.current.contains(target) &&
        (!mobileEncyclopediaMenuRef.current || !mobileEncyclopediaMenuRef.current.contains(target))
      ) {
        setIsEncyclopediaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCycleSortMetric = useCallback(() => {
    if (onSortChange) {
      const sortKeys: StageSortKey[] = ['size', 'distance', 'mass', 'temperature', 'luminosity', 'apparentMagnitude'];
      const currentIndex = sortKeys.indexOf(sortKey as StageSortKey);
      const nextKey: StageSortKey = sortKeys[(currentIndex + 1) % sortKeys.length] ?? 'size';
      onSortChange(nextKey);
    }
  }, [onSortChange, sortKey]);

  const getSortMetricLabel = (key?: StageSortKey | string) => {
    switch (key) {
      case 'size':
        return 'Size';
      case 'distance':
        return 'Distance';
      case 'mass':
        return 'Mass';
      case 'temperature':
        return 'Temp';
      case 'luminosity':
        return 'Luminosity';
      case 'apparentMagnitude':
        return 'Apparent Mag';
      default:
        return key || 'Size';
    }
  };

  // Mouse drag & interaction refs
  const isDraggingRef = useRef(false);
  const isRightDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const touchStartDistanceRef = useRef<number | null>(null);
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 15, 60));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const cameraDistanceRef = useRef(40);

  // Default camera angle when a star is focused:
  // On mobile devices, the elevation angle is slightly wider / shallower (Math.PI / 2.65 ≈ 68° vs desktop Math.PI / 3 = 60°)
  // to position the apex lower in the mobile viewport, leaving ample headroom so the label stays above the star
  const getDefaultCameraAngle = useCallback((mobile?: boolean) => {
    const isMob = mobile ?? checkIsMobile();
    return {
      theta: 0,
      phi: isMob ? Math.PI / 2.65 : Math.PI / 3,
    };
  }, [checkIsMobile]);

  const cameraAngleRef = useRef(getDefaultCameraAngle());
  const isInitialMountRef = useRef(true);
  const orbitVelocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isInteractingRef = useRef<boolean>(false);
  const restoreDprTimerRef = useRef<number | null>(null);
  const isTabVisibleRef = useRef<boolean>(true);
  const lastActiveStarIdRef = useRef<string | null>(null);
  const sharedTimeUniformRef = useRef<{ value: number }>({ value: 0 });
  const focusedLightRef = useRef<THREE.PointLight | null>(null);
  const interactiveMeshesRef = useRef<THREE.Object3D[]>([]);
  const pendingRaycastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Background tab throttling
  useEffect(() => {
    const handleVisibility = () => {
      isTabVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Adaptive Device Pixel Ratio during active interaction (orbit, pan, zoom)
  const triggerInteractionDpr = useCallback(() => {
    isInteractingRef.current = true;
    if (rendererRef.current) {
      const isMob = checkIsMobile();
      const targetDpr = Math.min(window.devicePixelRatio || 1, isMob ? 1.0 : 1.25);
      if (rendererRef.current.getPixelRatio() !== targetDpr) {
        rendererRef.current.setPixelRatio(targetDpr);
      }
    }
    if (restoreDprTimerRef.current !== null) {
      window.clearTimeout(restoreDprTimerRef.current);
    }
    restoreDprTimerRef.current = window.setTimeout(() => {
      isInteractingRef.current = false;
      if (rendererRef.current) {
        const isMob = checkIsMobile();
        const baseDpr = Math.min(window.devicePixelRatio || 1, isMob ? 1.5 : 2.0);
        rendererRef.current.setPixelRatio(baseDpr);
      }
    }, 180);
  }, [checkIsMobile]);

  // Helper to identify pulsars / neutron stars
  const isPulsarOrNeutronStar = (s: StarData) =>
    s.spectralClass === 'NS' ||
    s.stellarStage?.toLowerCase().includes('pulsar') ||
    s.stellarStage?.toLowerCase().includes('neutron') ||
    s.stellarStage?.toLowerCase().includes('magnetar');

  // Helper to identify brown dwarf spectral classes (L, T, Y)
  const getBrownDwarfType = (s: StarData): number => {
    if (s.spectralClass === 'LBV' || s.stellarStage === 'Luminous Blue Variable' || s.spectralType?.includes('LBV')) return 0.0;
    if (s.spectralClass === 'L' || (/^L[0-9]/.test(s.spectralType || ''))) return 1.0; // Class L (faint glow, iron/silicate clouds)
    if (s.spectralClass === 'T' || (/^T[0-9]/.test(s.spectralType || ''))) return 2.0; // Class T (no glow, methane gas giant)
    if (s.spectralClass === 'Y' || (/^Y[0-9]/.test(s.spectralType || ''))) return 3.0; // Class Y (no glow, ultracool ice dwarf)
    if (s.stellarStage === 'Brown Dwarf') {
      if (s.temperature > 1300) return 1.0;
      if (s.temperature > 600) return 2.0;
      return 3.0;
    }
    return 0.0;
  };

  // Sorted stars based on sortKey ('size' | 'distance' | 'mass' | 'temperature' | 'luminosity') and sortDirection ('asc' | 'desc')
  const sortedStars = useMemo(() => {
    const list = [...stars];
    list.sort((a, b) => {
      let diff = 0;
      if (sortKey === 'size') {
        diff = a.diameterKm - b.diameterKm;
      } else if (sortKey === 'distance') {
        diff = a.distanceLy - b.distanceLy;
      } else if (sortKey === 'mass') {
        diff = a.massSolar - b.massSolar;
      } else if (sortKey === 'temperature') {
        diff = a.temperature - b.temperature;
      } else if (sortKey === 'luminosity') {
        diff = a.luminositySolar - b.luminositySolar;
      } else if (sortKey === 'apparentMagnitude') {
        diff = (a.apparentMagnitude ?? 0) - (b.apparentMagnitude ?? 0);
      }

      // Consistent tie-breakers based on true physical dimensions
      if (diff === 0) {
        diff = a.diameterKm - b.diameterKm;
      }
      if (diff === 0) {
        diff = a.diameterSolar - b.diameterSolar;
      }
      if (diff === 0) {
        diff = a.name.localeCompare(b.name);
      }

      return sortDirection === 'desc' ? -diff : diff;
    });
    return list;
  }, [stars, sortKey, sortDirection]);

  // Spiral mode is only available when the all stars preset is sorted ascending by size on desktop/tablet.
  // When switching into mobile mode, changing presets, or changing sort to anything other than size ascending,
  // automatically switch back into normal mode. When returning to size ascending in All Stars, restore spiral mode.
  useEffect(() => {
    const handleCheckModeEligibility = () => {
      const isMob = checkIsMobile();
      const isSizeAscending = sortKey === 'size' && sortDirection === 'asc';
      const isAllStars = activePresetId === 'all-stars-catalog' || sortedStars.length > 500;
      if (isMob || !isSizeAscending || !isAllStars) {
        if (allStarsLayoutMode === 'spiral') {
          setAllStarsLayoutMode('normal');
        }
      } else {
        const saved = typeof window !== 'undefined' ? localStorage.getItem('cosmic_all_stars_layout_mode') : null;
        if ((saved === 'spiral' || saved === null) && allStarsLayoutMode !== 'spiral') {
          setAllStarsLayoutMode('spiral');
        }
      }
    };
    handleCheckModeEligibility();
    window.addEventListener('resize', handleCheckModeEligibility);
    window.addEventListener('orientationchange', handleCheckModeEligibility);
    return () => {
      window.removeEventListener('resize', handleCheckModeEligibility);
      window.removeEventListener('orientationchange', handleCheckModeEligibility);
    };
  }, [checkIsMobile, sortKey, sortDirection, activePresetId, sortedStars.length, allStarsLayoutMode]);

  // Formatted metric string based on current sortKey
  const getStarMetricFormatted = useCallback((star: StarData) => {
    if (sortKey === 'distance') {
      return star.distanceLy < 0.01 ? '< 0.01 ly' : `${star.distanceLy.toLocaleString()} ly`;
    }
    if (sortKey === 'mass') {
      return `${star.massSolar} M☉`;
    }
    if (sortKey === 'temperature') {
      return `${star.temperature.toLocaleString()} K`;
    }
    if (sortKey === 'luminosity') {
      return star.luminositySolar >= 1000
        ? `${star.luminositySolar.toLocaleString()} L☉`
        : star.luminositySolar < 0.01
        ? `${star.luminositySolar.toExponential(2)} L☉`
        : `${star.luminositySolar} L☉`;
    }
    if (sortKey === 'apparentMagnitude') {
      const mag = star.apparentMagnitude;
      return `${mag > 0 ? '+' : ''}${mag.toFixed(2)} mag`;
    }
    return formatPhysicalDiameter(star.diameterKm, star.diameterSolar).metricSi;
  }, [sortKey]);

  // Filter stars inside preset based on presetSearchQuery (empty entry shows full list)
  const filteredPresetStars = useMemo(() => {
    const q = presetSearchQuery.trim().toLowerCase();
    if (!q) return sortedStars;
    return sortedStars.filter((star) => {
      const nameMatch = star.name.toLowerCase().includes(q);
      const altMatch = star.alternateNames?.some((alt) => alt.toLowerCase().includes(q));
      const bayerMatch = star.bayerDesignation?.toLowerCase().includes(q);
      const constellationMatch = star.constellation.toLowerCase().includes(q);
      const spectralTypeMatch = star.spectralType.toLowerCase().includes(q);
      const spectralClassMatch = star.spectralClass.toLowerCase().includes(q);
      const stageMatch = star.stellarStage?.toLowerCase().includes(q);
      return Boolean(nameMatch || altMatch || bayerMatch || constellationMatch || spectralTypeMatch || spectralClassMatch || stageMatch);
    });
  }, [sortedStars, presetSearchQuery]);

  // Reset preset search query when the star preset changes
  useEffect(() => {
    setPresetSearchQuery('');
  }, [stars]);

  // Auto-focus search input when preset search activates
  useEffect(() => {
    if (isPresetSearchActive) {
      const timer = setTimeout(() => {
        if (window.innerWidth < 768) {
          mobileSearchInputRef.current?.focus();
        } else {
          desktopSearchInputRef.current?.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isPresetSearchActive]);

  // Current active index in sorted order
  const activeStarIndex = useMemo(() => {
    const activeId = focusedStarId ?? selectedStarId;
    if (!activeId) return -1;
    return sortedStars.findIndex(s => s.id === activeId);
  }, [sortedStars, focusedStarId, selectedStarId]);

  // Exact 1:1 real physical sizes for all stars including compact remnants (20 km neutron stars)
  const getTruePhysicalSolar = useCallback((star: StarData): number => {
    if (star.diameterKm !== undefined && star.diameterKm > 0 && star.diameterKm <= 50000) {
      return star.diameterKm / 1392700;
    }
    return star.diameterSolar;
  }, []);

  const isCompactRemnant = useCallback((s: StarData) => {
    return isPulsarOrNeutronStar(s) || (s.diameterKm !== undefined && s.diameterKm <= 50000);
  }, []);

  // Compute 3D radii and positions for each star based on true physical dimensions with constant proportional spacing
  const starScales = useMemo(() => {
    const scales: Record<string, { radius: number; physicalRadius: number; xPos: number; zPos: number; rawD: number }> = {};
    const isMob = checkIsMobile();
    const isSizeAscending = sortKey === 'size' && sortDirection === 'asc';
    const isAllStars = activePresetId === 'all-stars-catalog' || sortedStars.length > 500;
    // Spiral mode is only available when the all stars preset is sorted ascending by size
    const useSpiral = !isMob && isAllStars && isSizeAscending && allStarsLayoutMode === 'spiral';

    if (useSpiral) {
      // Golden / Archimedean celestial spiral layout for the Complete Astronomical Catalog:
      // Winds stars in a majestic galactic spiral on the X-Z plane with zero overlaps.
      let currentTheta = 0;
      let currentR = 0.5;

      sortedStars.forEach((star, idx) => {
        const effectiveSolar = getTruePhysicalSolar(star);
        const radius = effectiveSolar;

        if (idx === 0) {
          currentR = Math.max(0.5, radius * 4);
          currentTheta = 0;
        } else {
          const prevStar = sortedStars[idx - 1];
          const prevRadius = scales[prevStar.id]?.radius || 0.1;
          // Chord distance along the spiral arm between surface of star and prev star:
          const chord = (prevRadius + radius) * 1.38;
          const minRForChord = chord / 1.5;
          if (currentR < minRForChord) currentR = minRForChord;

          // Angular step along the circle arc:
          const dTheta = chord / currentR;
          currentTheta += dTheta;

          // Radial expansion per step: ensures radial distance between turns clears star diameter:
          const dR = ((2 * radius * 1.5) / (2 * Math.PI)) * dTheta;
          currentR += dR;
        }

        const xPos = currentR * Math.cos(currentTheta);
        const zPos = currentR * Math.sin(currentTheta);

        scales[star.id] = {
          radius,
          physicalRadius: radius,
          xPos,
          zPos,
          rawD: effectiveSolar,
        };
      });
    } else {
      // Left-aligned side-by-side mode (sorted by user metric, 1:1 physical scale)
      let currentX = 0;
      const PROPORTIONAL_GAP_FACTOR = 0.38;

      sortedStars.forEach((star, idx) => {
        const effectiveSolar = getTruePhysicalSolar(star);
        const radius = effectiveSolar;

        if (idx === 0) {
          currentX = radius;
        } else {
          const prevStar = sortedStars[idx - 1];
          const prevRadius = scales[prevStar.id]?.radius || 0.1;
          const gap = (prevRadius + radius) * PROPORTIONAL_GAP_FACTOR;
          currentX += prevRadius + radius + gap;
        }

        scales[star.id] = {
          radius,
          physicalRadius: radius,
          xPos: currentX,
          zPos: 0,
          rawD: effectiveSolar,
        };
      });
    }

    return scales;
  }, [sortedStars, getTruePhysicalSolar, activePresetId, allStarsLayoutMode, checkIsMobile, sortKey, sortDirection]);

  // Main Three.js Initialization & Scene Setup
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#02040c');
    sceneRef.current = scene;

    const isNarrow = isMobile || width < 768 || (height > 0 && width / height < 1.0);
    const initialFov = isNarrow ? 50 : 45;
    const camera = new THREE.PerspectiveCamera(initialFov, width / height, 0.000001, 500000);
    camera.position.set(0, 20, 65);
    cameraRef.current = camera;

    // 2. Renderer with logarithmic depth buffer to prevent Z-fighting across massive scale disparities
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    const isMobInit = checkIsMobile();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobInit ? 1.5 : 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Cosmic Starfield Background
    const starCount = 6000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const cosmicPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#a0c4ff'),
      new THREE.Color('#ffc6a0'),
      new THREE.Color('#ffd6a5'),
      new THREE.Color('#caffbf'),
      new THREE.Color('#93c5fd'),
    ];

    for (let i = 0; i < starCount; i++) {
      const r = THREE.MathUtils.randFloat(35000, 300000);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));

      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);

      const col = cosmicPalette[Math.floor(Math.random() * cosmicPalette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 3.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.85);
    scene.add(ambientLight);

    // Single high-performance dynamic focus light (replaces 500+ individual point lights)
    const focusedPointLight = new THREE.PointLight('#ffffff', 0, 100);
    scene.add(focusedPointLight);
    focusedLightRef.current = focusedPointLight;

    // 5. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW && newH && cameraRef.current && rendererRef.current) {
          const isNarrowResize = isMobile || newW < 768 || (newH > 0 && newW / newH < 1.0);
          cameraRef.current.fov = isNarrowResize ? 50 : 45;
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Listen to Fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Re-build 3D Star meshes when stars, scaleMode, or viewMode changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove old star objects and guides
    starObjectsRef.current.forEach((group) => {
      scene.remove(group);
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
    });
    starObjectsRef.current.clear();

    const existingGrid = scene.getObjectByName('CelestialGrid');
    if (existingGrid) scene.remove(existingGrid);
    if (continuousGridRef.current) {
      continuousGridRef.current.dispose();
      continuousGridRef.current = null;
    }

    const existingOrbits = scene.getObjectByName('SolarSystemOrbitGroup');
    if (existingOrbits) scene.remove(existingOrbits);

    // Render continuous floor reference grid in side-by-side mode
    const celestialGridGroup = new THREE.Group();
    celestialGridGroup.name = 'CelestialGrid';

    if (viewMode === '3d-comparator' && showGrid) {
      // 1. Continuous Procedural Cosmic Grid:
      // Encompasses all 4 sides of the graph, including the area outside the comparison view.
      // Recursively activates 10x10 subgrids when zoomed into a smaller cell.
      const scaleList = Object.values(starScales) as Array<{ radius: number; xPos: number; zPos?: number; rawD: number }>;
      const minX = scaleList.reduce((min, curr) => Math.min(min, curr.xPos - curr.radius), 0);
      const maxX = scaleList.reduce((max, curr) => Math.max(max, curr.xPos + curr.radius), 10);
      const minZ = scaleList.reduce((min, curr) => Math.min(min, (curr.zPos || 0) - curr.radius), -1);
      const maxZ = scaleList.reduce((max, curr) => Math.max(max, (curr.zPos || 0) + curr.radius), 1);

      const gridHandle = createContinuousGridMesh({
        yLevel: 0,
        leftAligned: false,
        comparisonBounds: { minX, maxX, minZ, maxZ },
      });
      celestialGridGroup.add(gridHandle.mesh);
      continuousGridRef.current = gridHandle;

      // 2. Vertical height drop line and true-ground footprint anchor under each star
      // When large catalog (>50 stars) is displayed, guide footprints are focused on the active star and landmarks for silky FPS
      const isLargeCatalog = renderedStars.length > 50;
      const activeStarId = focusedStarId ?? selectedStarId;
      const targetStarsForGuides = isLargeCatalog
        ? renderedStars.filter(s => s.id === activeStarId || s.id === 'sun' || s.id === renderedStars[0]?.id || s.id === renderedStars[renderedStars.length - 1]?.id)
        : renderedStars;

      targetStarsForGuides.forEach((star) => {
        const sc = starScales[star.id];
        if (!sc) return;

        const starZ = sc.zPos || 0;
        // Vertical height drop line from star center to grid floor
        const heightPoints = [
          new THREE.Vector3(sc.xPos, 0, starZ),
          new THREE.Vector3(sc.xPos, sc.radius * 2, starZ),
        ];
        const heightGeo = new THREE.BufferGeometry().setFromPoints(heightPoints);
        let heightLine: THREE.Line;
        if (sc.radius < 0.001) {
          const heightMat = new THREE.LineBasicMaterial({
            color: star.colorHex,
            transparent: true,
            opacity: 0.55,
            depthWrite: false,
          });
          heightLine = new THREE.Line(heightGeo, heightMat);
        } else {
          const heightMat = new THREE.LineDashedMaterial({
            color: star.colorHex,
            dashSize: Math.max(0.000005, sc.radius * 0.08),
            gapSize: Math.max(0.000005, sc.radius * 0.08),
            transparent: true,
            opacity: 0.45,
            depthWrite: false,
          });
          heightLine = new THREE.Line(heightGeo, heightMat);
          heightLine.computeLineDistances();
        }
        celestialGridGroup.add(heightLine);

        // Circular footprint anchor on the grid floor scaled to true physical radius
        const innerR = Math.max(sc.radius * 0.05, sc.radius * 0.92);
        const footGeo = new THREE.RingGeometry(innerR, sc.radius, 48);
        const footMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(star.colorHex),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.35,
          depthWrite: false,
        });
        const footMesh = new THREE.Mesh(footGeo, footMat);
        footMesh.rotation.x = Math.PI / 2;
        footMesh.position.set(sc.xPos, 0, starZ);
        celestialGridGroup.add(footMesh);
      });
    }

    scene.add(celestialGridGroup);

    const newInteractiveMeshes: THREE.Object3D[] = [];

    // Shared Unit Geometries: Desktop and Tablet modes are restored to higher-poly models (64x64 segments)
    const isMobGeo = checkIsMobile();
    const isLargeCatalog = renderedStars.length > 50;
    const sphereSegments = isMobGeo ? (isLargeCatalog ? 20 : 28) : 64;
    const coronaSegments = isMobGeo ? (isLargeCatalog ? 16 : 20) : 48;

    const sharedSphereGeo = new THREE.SphereGeometry(1, sphereSegments, sphereSegments);
    const sharedCoronaGeo = new THREE.SphereGeometry(1, coronaSegments, coronaSegments);
    const sharedHitGeo = new THREE.SphereGeometry(1, 16, 16);

    renderedStars.forEach((star) => {
      const scaleInfo = starScales[star.id];
      if (!scaleInfo) return;

      const starGroup = new THREE.Group();
      const starY = scaleInfo.radius;
      starGroup.position.set(scaleInfo.xPos, starY, scaleInfo.zPos || 0);
      starGroup.userData = { starId: star.id, starData: star };

      // Invisible hit sphere for easy selection of sub-pixel compact stars
      if (isCompactRemnant(star)) {
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        const hitMesh = new THREE.Mesh(sharedHitGeo, hitMat);
        hitMesh.scale.setScalar(Math.max(1.5, scaleInfo.radius * 2));
        hitMesh.name = `StarHitTarget-${star.id}`;
        hitMesh.userData = { starData: star };
        starGroup.add(hitMesh);
        newInteractiveMeshes.push(hitMesh);
      }

      const baseColor = new THREE.Color(star.colorHex);
      const coronaColor = new THREE.Color(star.coronaColorHex);

      const isContactBinary = star.id === 'vfts-352' || star.stellarStage === 'Contact Binary';
      const isPulsar = isPulsarOrNeutronStar(star);
      const bdType = getBrownDwarfType(star);

      const customMat = new THREE.ShaderMaterial({
        wireframe: wireframe,
        uniforms: {
          time: sharedTimeUniformRef.current,
          baseColor: { value: baseColor },
          coronaColor: { value: coronaColor },
          temperature: { value: star.temperature },
          isPulsar: { value: isPulsar ? 1.0 : 0.0 },
          isContactBinary: { value: isContactBinary ? 1.0 : 0.0 },
          brownDwarfType: { value: bdType },
        },
        vertexShader: `
          #include <common>
          #include <logdepthbuf_pars_vertex>
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec3 vLocalPos;
          varying vec2 vUv;
          varying vec3 vViewPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            vLocalPos = normal; // Scale-invariant unit sphere vector
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
            #include <logdepthbuf_vertex>
          }
        `,
        fragmentShader: `
          #include <common>
          #include <logdepthbuf_pars_fragment>
          uniform float time;
          uniform vec3 baseColor;
          uniform vec3 coronaColor;
          uniform float temperature;
          uniform float isPulsar;
          uniform float isContactBinary;
          uniform float brownDwarfType;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec3 vLocalPos;
          varying vec2 vUv;
          varying vec3 vViewPosition;

          // Smooth quintic interpolation polynomial (C2 continuity, zero grid artifacts)
          vec3 quintic(vec3 t) {
            return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
          }

          // Dave Hoskins' float-stable 3D hash generator (zero precision degradation across all float scales)
          float hash3D(vec3 p) {
            p = fract(p * 0.1031);
            p += dot(p, p.zyx + 31.32);
            return fract((p.x + p.y) * p.z);
          }

          // Silky smooth 3D value noise with quintic interpolation
          float smoothNoise(vec3 x) {
            vec3 i = floor(x);
            vec3 f = fract(x);
            vec3 u = quintic(f);

            return mix(
              mix(
                mix(hash3D(i + vec3(0.0, 0.0, 0.0)), hash3D(i + vec3(1.0, 0.0, 0.0)), u.x),
                mix(hash3D(i + vec3(0.0, 1.0, 0.0)), hash3D(i + vec3(1.0, 1.0, 0.0)), u.x),
                u.y
              ),
              mix(
                mix(hash3D(i + vec3(0.0, 0.0, 1.0)), hash3D(i + vec3(1.0, 0.0, 1.0)), u.x),
                mix(hash3D(i + vec3(0.0, 1.0, 1.0)), hash3D(i + vec3(1.0, 1.0, 1.0)), u.x),
                u.y
              ),
              u.z
            );
          }

          // Multi-octave Fractal Brownian Motion (FBM) for smooth natural plasma flow
          float fbm(vec3 p) {
            float value = 0.0;
            float amplitude = 0.5;
            vec3 shift = vec3(23.41, 57.19, 11.83);
            for (int i = 0; i < 4; ++i) {
              value += amplitude * smoothNoise(p);
              p = p * 2.02 + shift;
              amplitude *= 0.5;
            }
            return value;
          }

          void main() {
            #include <logdepthbuf_fragment>
            vec3 viewDir = normalize(vViewPosition);
            float limb = dot(normalize(vNormal), viewDir);
            limb = clamp(limb, 0.0, 1.0);
            float limbDarkening = pow(limb, 0.46);

            vec3 normPos = normalize(vLocalPos);
            vec3 samplePos = normPos * 3.2;
            vec3 q = samplePos + vec3(time * 0.06, time * 0.045, time * 0.02);
            float f1 = fbm(q);
            vec3 warpedP = samplePos + vec3(f1 * 0.7, f1 * 0.5, f1 * 0.3) + vec3(time * 0.03, -time * 0.02, time * 0.015);
            float gran = fbm(warpedP);

            // 1. NEUTRON STARS & PULSARS
            if (isPulsar > 0.5) {
              vec3 pulsarPos = normPos * 3.8 + vec3(0.0, time * 0.12, 0.0);
              float granPulsar = fbm(pulsarPos);
              vec3 pulsarCore = mix(baseColor * 0.95, vec3(0.92, 0.97, 1.0), granPulsar * 0.55 + 0.25);
              pulsarCore *= (0.58 + 0.42 * limbDarkening);

              float fresnelPulsar = pow(1.0 - limb, 2.6);
              pulsarCore += coronaColor * fresnelPulsar * 0.95;

              gl_FragColor = vec4(pulsarCore, 1.0);
              return;
            }

            // 2. SUBSTELLAR BROWN DWARFS (Class L, T, Y) - GAS GIANT BANDED ATMOSPHERE
            if (brownDwarfType > 0.5) {
              float y = normPos.y; // -1.0 (South) to +1.0 (North)
              float lon = atan(normPos.z, normPos.x);

              // Zonal differential wind shear (latitudinal jet streams)
              float zonalVelocity = sin(y * 8.0) * 0.40 + sin(y * 16.0) * 0.15;
              float dynamicLon = lon + time * (0.035 + zonalVelocity * 0.05);

              // Multi-scale Jovian cloud banding
              float primaryBands = sin(y * 22.0 + smoothNoise(vec3(dynamicLon * 2.0, y * 4.0, time * 0.02)) * 1.8);
              float secondaryBands = sin(y * 52.0 + smoothNoise(vec3(dynamicLon * 4.0, y * 10.0, 0.8)) * 1.2);
              float fineBelts = sin(y * 110.0 + smoothNoise(vec3(dynamicLon * 8.0, y * 20.0, 1.9)) * 0.8) * 0.5 + 0.5;

              // Turbulent vortices & storm spots
              vec3 stormPos = vec3(dynamicLon * 3.2, y * 7.5, time * 0.025);
              float storms = smoothNoise(stormPos) * 0.6 + smoothNoise(stormPos * 2.4) * 0.3 + smoothNoise(stormPos * 5.0) * 0.1;
              float polarFactor = smoothstep(0.68, 0.98, abs(y));

              if (brownDwarfType < 1.5) {
                // CLASS L (1,300 - 2,400 K): Warm Brown Dwarf with molten iron & silicate rain clouds + FAINT GLOW
                vec3 colBand1 = vec3(0.55, 0.15, 0.08); // Deep crimson
                vec3 colBand2 = vec3(0.26, 0.06, 0.03); // Dark iron belt
                vec3 colBand3 = vec3(0.72, 0.22, 0.10); // Warm glowing amber zone
                vec3 colStorm = vec3(0.88, 0.32, 0.12); // Hot iron-rich storm rift

                float blend1 = primaryBands * 0.5 + 0.5;
                float blend2 = secondaryBands * 0.5 + 0.5;
                vec3 surface = mix(colBand1, colBand2, blend1);
                surface = mix(surface, colBand3, blend2 * 0.6);
                surface = mix(surface, colStorm, smoothstep(0.64, 0.84, storms) * 0.55);
                surface = mix(surface, vec3(0.18, 0.05, 0.02), polarFactor * 0.7);
                surface += fineBelts * 0.05 * vec3(0.4, 0.15, 0.05);

                // Faint thermal glow: deep interior infrared heat leaking through silicate cloud breaks
                float thermalBreak = smoothstep(0.4, 0.8, storms) * (1.0 - blend1 * 0.5);
                vec3 thermalGlow = vec3(0.95, 0.35, 0.12) * thermalBreak * 0.40;

                // Faint limb glow
                surface = surface * (0.65 + 0.35 * limbDarkening) + thermalGlow;
                surface += coronaColor * pow(1.0 - limb, 3.2) * 0.22;

                gl_FragColor = vec4(surface, 1.0);
                return;
              } else if (brownDwarfType < 2.5) {
                // CLASS T (600 - 1,300 K): Methane Brown Dwarf (NOT GLOWING, Gas Giant Jovian Texture)
                vec3 colBand1 = vec3(0.38, 0.11, 0.27);
                vec3 colBand2 = vec3(0.17, 0.05, 0.15);
                vec3 colBand3 = vec3(0.48, 0.16, 0.36);
                vec3 colStorm = vec3(0.62, 0.22, 0.44);

                float blend1 = primaryBands * 0.5 + 0.5;
                float blend2 = secondaryBands * 0.5 + 0.5;
                vec3 surface = mix(colBand1, colBand2, blend1);
                surface = mix(surface, colBand3, blend2 * 0.6);
                surface = mix(surface, colStorm, smoothstep(0.65, 0.85, storms) * 0.45);
                surface = mix(surface, vec3(0.12, 0.04, 0.14), polarFactor * 0.65);
                surface += (fineBelts - 0.5) * 0.08 * vec3(0.3, 0.1, 0.2);

                // Non-glowing matte planetary lighting
                surface *= (0.35 + 0.65 * limbDarkening);
                surface += vec3(0.24, 0.08, 0.20) * pow(1.0 - limb, 4.2) * 0.25;

                gl_FragColor = vec4(surface, 1.0);
                return;
              } else {
                // CLASS Y (<600 K down to 250 K / -23°C): Ultracool Ice Brown Dwarf
                vec3 colBand1 = vec3(0.25, 0.18, 0.27);
                vec3 colBand2 = vec3(0.12, 0.09, 0.15);
                vec3 colBand3 = vec3(0.32, 0.25, 0.35);
                vec3 colStorm = vec3(0.44, 0.35, 0.46);

                float blend1 = primaryBands * 0.5 + 0.5;
                float blend2 = secondaryBands * 0.5 + 0.5;
                vec3 surface = mix(colBand1, colBand2, blend1);
                surface = mix(surface, colBand3, blend2 * 0.55);
                surface = mix(surface, colStorm, smoothstep(0.68, 0.88, storms) * 0.35);
                surface = mix(surface, vec3(0.08, 0.06, 0.10), polarFactor * 0.7);
                surface += (fineBelts - 0.5) * 0.06 * vec3(0.2, 0.2, 0.25);

                surface *= (0.30 + 0.70 * limbDarkening);
                surface += vec3(0.15, 0.14, 0.20) * pow(1.0 - limb, 4.5) * 0.18;

                gl_FragColor = vec4(surface, 1.0);
                return;
              }
            }

            // 3. MAIN SEQUENCE, GIANTS, HYPERGIANTS, WHITE DWARFS & CONTACT BINARIES
            vec3 deepCore = baseColor * 0.88;
            vec3 brightSurface = mix(baseColor * 1.15, vec3(1.0, 0.99, 0.97), 0.48);
            vec3 hotFaculae = mix(coronaColor * 1.25, vec3(1.0, 1.0, 1.0), 0.65);

            vec3 plasmaColor = mix(deepCore, brightSurface, gran);
            plasmaColor = mix(plasmaColor, hotFaculae, smoothstep(0.58, 0.86, gran) * 0.42);

            if (isContactBinary > 0.5) {
              plasmaColor = mix(plasmaColor, vec3(0.92, 0.96, 1.0), 0.18);
            }

            plasmaColor *= (0.48 + 0.52 * limbDarkening);

            float fresnel = pow(1.0 - limb, 3.2);
            plasmaColor += coronaColor * fresnel * 0.82;

            gl_FragColor = vec4(plasmaColor, 1.0);
          }
        `,
      });

      if (isContactBinary) {
        const lobeRadius = scaleInfo.radius * 0.62;
        const lobeOffset = scaleInfo.radius * 0.42;

        const lobeAMesh = new THREE.Mesh(sharedSphereGeo, customMat);
        lobeAMesh.scale.setScalar(lobeRadius);
        lobeAMesh.position.set(-lobeOffset, 0, 0);
        lobeAMesh.name = `Photosphere-A-${star.id}`;
        lobeAMesh.userData = { starId: star.id, starData: star };
        starGroup.add(lobeAMesh);
        newInteractiveMeshes.push(lobeAMesh);

        const lobeBMesh = new THREE.Mesh(sharedSphereGeo, customMat);
        lobeBMesh.scale.setScalar(lobeRadius);
        lobeBMesh.position.set(lobeOffset, 0, 0);
        lobeBMesh.name = `Photosphere-B-${star.id}`;
        lobeBMesh.userData = { starId: star.id, starData: star };
        starGroup.add(lobeBMesh);

        const bridgeGeo = new THREE.CylinderGeometry(lobeRadius * 0.8, lobeRadius * 0.8, lobeOffset * 2, 32);
        bridgeGeo.rotateZ(Math.PI / 2);
        const bridgeMesh = new THREE.Mesh(bridgeGeo, customMat);
        bridgeMesh.name = `Photosphere-Neck-${star.id}`;
        bridgeMesh.userData = { starId: star.id, starData: star };
        starGroup.add(bridgeMesh);
      } else {
        const photosphere = new THREE.Mesh(sharedSphereGeo, customMat);
        photosphere.scale.setScalar(scaleInfo.radius);
        photosphere.name = `Photosphere-${star.id}`;
        photosphere.userData = { starId: star.id, starData: star };
        starGroup.add(photosphere);
        newInteractiveMeshes.push(photosphere);
      }

      // 2. Atmospheric Corona Glow Halo (Disabled for Class T & Y brown dwarfs, Faint for Class L)
      if (showCorona && bdType < 1.5) {
        const isFaintL = bdType === 1.0;
        const createCoronaMat = () => new THREE.ShaderMaterial({
          side: THREE.BackSide,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          depthTest: true,
          uniforms: {
            time: sharedTimeUniformRef.current,
            glowColor: { value: isFaintL ? new THREE.Color('#8a2014') : coronaColor },
            glowIntensity: { value: isFaintL ? 0.20 : 0.70 },
          },
          vertexShader: `
            #include <common>
            #include <logdepthbuf_pars_vertex>
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              vViewPosition = -mvPosition.xyz;
              gl_Position = projectionMatrix * mvPosition;
              #include <logdepthbuf_vertex>
            }
          `,
          fragmentShader: `
            #include <common>
            #include <logdepthbuf_pars_fragment>
            uniform vec3 glowColor;
            uniform float glowIntensity;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            void main() {
              #include <logdepthbuf_fragment>
              vec3 viewDir = normalize(vViewPosition);
              float intensity = pow(clamp(0.65 - dot(vNormal, viewDir), 0.0, 1.0), 2.2);
              gl_FragColor = vec4(glowColor * 1.5, clamp(intensity * glowIntensity, 0.0, glowIntensity));
            }
          `,
        });

        if (isContactBinary) {
          const coronaLobeRadius = scaleInfo.radius * 0.76;
          const lobeOffset = scaleInfo.radius * 0.42;

          const coronaMeshA = new THREE.Mesh(sharedCoronaGeo, createCoronaMat());
          coronaMeshA.scale.setScalar(coronaLobeRadius);
          coronaMeshA.position.set(-lobeOffset, 0, 0);
          coronaMeshA.name = 'CoronaA';
          starGroup.add(coronaMeshA);

          const coronaMeshB = new THREE.Mesh(sharedCoronaGeo, createCoronaMat());
          coronaMeshB.scale.setScalar(coronaLobeRadius);
          coronaMeshB.position.set(lobeOffset, 0, 0);
          coronaMeshB.name = 'CoronaB';
          starGroup.add(coronaMeshB);
        } else {
          const coronaRadius = scaleInfo.radius * (isFaintL ? 1.08 : 1.22);
          const coronaMesh = new THREE.Mesh(sharedCoronaGeo, createCoronaMat());
          coronaMesh.scale.setScalar(coronaRadius);
          coronaMesh.name = 'Corona';
          starGroup.add(coronaMesh);
        }
      }

      scene.add(starGroup);
      starObjectsRef.current.set(star.id, starGroup);
    });

    interactiveMeshesRef.current = newInteractiveMeshes;

    return () => {
      sharedSphereGeo.dispose();
      sharedCoronaGeo.dispose();
      sharedHitGeo.dispose();
    };
  }, [stars, starScales, scaleMode, showCorona, viewMode, wireframe, showGrid]);

  // Camera framing calculation:
  // Dynamically scales distance and target elevation based on true star radius.
  // In spiral mode, frames focused stars from sideways (horizontal profile view along the spiral curve).
  // On mobile devices, the default camera angle and distance are slightly wider,
  // targeting slightly lower on the star so the top apex sits comfortably with ample headroom
  // below the top toolbar, ensuring the label reliably stays above the highlighted star.
  const getCameraFramingForStar = useCallback((starId: string, isTour: boolean) => {
    const scaleInfo = starScalesRef.current[starId] ?? starScales[starId];
    if (!scaleInfo) return null;
    const r = scaleInfo.radius;
    const isMob = checkIsMobile();

    // Aspect-ratio compensation for portrait vertical mobile screens
    const aspect = cameraRef.current?.aspect || (typeof window !== 'undefined' ? window.innerWidth / (window.innerHeight || 1) : 1.0);
    const portraitFactor = aspect < 1.0 ? Math.max(1.0, 0.95 / aspect) : 1.0;

    const isSizeAscending = sortKey === 'size' && sortDirection === 'asc';
    const isAllStars = activePresetId === 'all-stars-catalog' || sortedStars.length > 500;
    const isSpiralMode = !isMob && isAllStars && isSizeAscending && allStarsLayoutMode === 'spiral';

    // In spiral mode, selecting a star only zooms in to focus on the star without changing the POV (camera angle)
    const framingAngle = isSpiralMode
      ? { ...cameraAngleRef.current }
      : getDefaultCameraAngle(isMob);

    const targetY = isTour ? r * 1.05 : (isMob ? r * 0.94 : r);

    // Scale distance proportionally with star radius down to micro-scales for pulsars and white dwarfs
    const baseDist = isTour
      ? (isMob ? Math.max(0.00006, r * 5.4) : Math.max(0.000045, r * 4.2))
      : (isMob ? Math.max(0.00005, r * 4.65) : Math.max(0.000035, r * 3.4));

    const dist = baseDist * portraitFactor;

    return {
      target: new THREE.Vector3(scaleInfo.xPos, targetY, scaleInfo.zPos || 0),
      distance: dist,
      angle: framingAngle,
    };
  }, [starScales, checkIsMobile, getDefaultCameraAngle, activePresetId, sortedStars, allStarsLayoutMode, sortKey, sortDirection]);

  // Smooth Focus Transition Effect whenever focused/selected star or modes change
  useEffect(() => {
    const activeId = focusedStarId ?? selectedStarId;

    if (!activeId) {
      // Unfocused mode: view whole stellar array or spiral for panoramic exploration
      const scaleList = Object.values(starScales) as Array<{ radius: number; xPos: number; zPos?: number; rawD: number }>;
      const minX = scaleList.reduce((min, curr) => Math.min(min, curr.xPos - curr.radius), 0);
      const maxX = scaleList.reduce((max, curr) => Math.max(max, curr.xPos + curr.radius), 10);
      const minZ = scaleList.reduce((min, curr) => Math.min(min, (curr.zPos || 0) - curr.radius), 0);
      const maxZ = scaleList.reduce((max, curr) => Math.max(max, (curr.zPos || 0) + curr.radius), 0);
      const totalWidth = Math.max(10, maxX - minX);
      const totalDepth = Math.max(10, maxZ - minZ);
      const totalSpan = Math.max(totalWidth, totalDepth);
      const midX = (minX + maxX) / 2;
      const midZ = (minZ + maxZ) / 2;
      const maxRadius = scaleList.reduce((max, curr) => Math.max(max, curr.radius), 1);

      const isMob = checkIsMobile();
      const isSizeAscending = sortKey === 'size' && sortDirection === 'asc';
      const isAllStars = activePresetId === 'all-stars-catalog' || sortedStars.length > 500;
      const isSpiralActive = !isMob && isAllStars && isSizeAscending && allStarsLayoutMode === 'spiral';

      if (isSpiralActive && sortedStars.length > 0) {
        // Zoom is centered directly into the smallest star in the catalog
        const smallestStar = sortedStars[0];
        const smallestScale = starScales[smallestStar.id];
        if (smallestScale) {
          cameraTargetRef.current.set(smallestScale.xPos, smallestScale.radius, smallestScale.zPos || 0);
        } else {
          cameraTargetRef.current.set(0, 0, 0);
        }
      } else {
        cameraTargetRef.current.set(midX, maxRadius * 0.45, midZ);
      }

      const aspect = cameraRef.current?.aspect || (typeof window !== 'undefined' ? window.innerWidth / (window.innerHeight || 1) : 1.0);
      const portraitFactor = aspect < 1.0 ? Math.max(1.15, 1.05 / aspect) : 1.0;
      cameraDistanceRef.current = Math.max(45, totalSpan * 0.75 * portraitFactor, maxRadius * 2.8 * (aspect < 1.0 ? 1.25 : 1.0));
    } else {
      const framing = getCameraFramingForStar(activeId, isTourPlayingRef.current);
      if (framing) {
        cameraTargetRef.current.copy(framing.target);
        cameraDistanceRef.current = framing.distance;
        cameraAngleRef.current = { ...framing.angle };
      }
    }

    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      const { theta, phi } = cameraAngleRef.current;
      const dist = cameraDistanceRef.current;
      const target = cameraTargetRef.current;
      const initX = target.x + dist * Math.sin(phi) * Math.sin(theta);
      const initY = target.y + dist * Math.cos(phi);
      const initZ = target.z + dist * Math.sin(phi) * Math.cos(theta);
      currentCameraPosRef.current.set(initX, initY, initZ);
      currentLookAtRef.current.copy(target);
      if (cameraRef.current) {
        cameraRef.current.position.set(initX, initY, initZ);
        cameraRef.current.lookAt(target);
      }
    }
  }, [focusedStarId, selectedStarId, viewMode, scaleMode, starScales, stars, getCameraFramingForStar]);

  // Rendered stars based on mode
  const renderedStars = useMemo(() => {
    return stars;
  }, [stars]);

  const renderedStarsRef = useRef(renderedStars);
  renderedStarsRef.current = renderedStars;

  const starScalesRef = useRef(starScales);
  starScalesRef.current = starScales;

  const selectedStarIdRef = useRef(selectedStarId);
  selectedStarIdRef.current = selectedStarId;

  const focusedStarIdRef = useRef(focusedStarId);
  focusedStarIdRef.current = focusedStarId;

  const hoveredStarRef = useRef(hoveredStar);
  hoveredStarRef.current = hoveredStar;

  // Snap camera instantaneously to target coordinates without reverse-scrubbing or flight lerping
  const snapCameraToTarget = useCallback(() => {
    if (!cameraRef.current) return;
    const { theta, phi } = cameraAngleRef.current;
    const dist = cameraDistanceRef.current;
    const targetX = cameraTargetRef.current.x + dist * Math.sin(phi) * Math.sin(theta);
    const targetY = cameraTargetRef.current.y + dist * Math.cos(phi);
    const targetZ = cameraTargetRef.current.z + dist * Math.sin(phi) * Math.cos(theta);
    const targetPos = new THREE.Vector3(targetX, targetY, targetZ);

    currentCameraPosRef.current.copy(targetPos);
    currentLookAtRef.current.copy(cameraTargetRef.current);
    cameraRef.current.position.copy(targetPos);
    cameraRef.current.lookAt(currentLookAtRef.current);

    const targetNear = Math.max(0.0000001, Math.min(30.0, dist * 0.002));
    const targetFar = Math.max(150000, dist * 35.0);
    cameraRef.current.near = targetNear;
    cameraRef.current.far = targetFar;
    cameraRef.current.updateProjectionMatrix();

    if (continuousGridRef.current) {
      continuousGridRef.current.update(cameraRef.current, dist);
    }
  }, []);

  // Navigation functions: Next / Previous star
  const handlePrevStar = useCallback(() => {
    if (sortedStars.length === 0) return;
    soundEffects.play('nav');
    const isFirstToLast = activeStarIndex <= 0;
    const targetStar = isFirstToLast ? sortedStars[sortedStars.length - 1] : sortedStars[activeStarIndex - 1];
    const framing = getCameraFramingForStar(targetStar.id, isTourPlayingRef.current);
    if (framing) {
      cameraTargetRef.current.copy(framing.target);
      cameraDistanceRef.current = framing.distance;
      cameraAngleRef.current = { ...framing.angle };
      if (isFirstToLast) {
        snapCameraToTarget();
      }
    }
    onSelectStar(targetStar);
  }, [sortedStars, activeStarIndex, onSelectStar, getCameraFramingForStar, snapCameraToTarget]);

  const handleNextStar = useCallback(() => {
    if (sortedStars.length === 0) return;
    soundEffects.play('nav');
    if (activeStarIndex === -1 || activeStarIndex >= sortedStars.length - 1) {
      if (isTourPlaying) {
        setIsTourPlaying(false);
      } else {
        const firstStar = sortedStars[0];
        const framing = getCameraFramingForStar(firstStar.id, isTourPlayingRef.current);
        if (framing) {
          cameraTargetRef.current.copy(framing.target);
          cameraDistanceRef.current = framing.distance;
          cameraAngleRef.current = { ...framing.angle };
          // Switching from the last to first item is instant - no reverse scrubbing
          snapCameraToTarget();
        }
        onSelectStar(firstStar);
      }
    } else {
      const nextStar = sortedStars[activeStarIndex + 1];
      const framing = getCameraFramingForStar(nextStar.id, isTourPlayingRef.current);
      if (framing) {
        cameraTargetRef.current.copy(framing.target);
        cameraDistanceRef.current = framing.distance;
        cameraAngleRef.current = { ...framing.angle };
      }
      onSelectStar(nextStar);
    }
  }, [sortedStars, activeStarIndex, onSelectStar, isTourPlaying, getCameraFramingForStar, snapCameraToTarget]);

  const handleUnfocus = useCallback(() => {
    soundEffects.play('unfocus');
    onSelectStar(null);
  }, [onSelectStar]);

  const handleToggleTour = useCallback(() => {
    const willPlay = !isTourPlayingRef.current;
    isTourPlayingRef.current = willPlay;
    setIsTourPlaying(willPlay);
    soundEffects.play(willPlay ? 'toggleOn' : 'toggleOff');

    if (willPlay) {
      // If starting tour and no star is focused or already on the last star, immediately focus the first star
      // Set camera target immediately with generous label headroom so flight animation begins on frame 1 without delay!
      if (activeStarIndex === -1 || activeStarIndex >= sortedStars.length - 1) {
        if (sortedStars.length > 0) {
          const firstStar = sortedStars[0];
          const framing = getCameraFramingForStar(firstStar.id, true);
          if (framing) {
            cameraTargetRef.current.copy(framing.target);
            cameraDistanceRef.current = framing.distance;
            cameraAngleRef.current = { ...framing.angle };
          }
          onSelectStar(firstStar);
        }
      }
    }
  }, [activeStarIndex, sortedStars, onSelectStar, getCameraFramingForStar]);

  // Auto Tour playback effect
  useEffect(() => {
    if (!isTourPlaying || sortedStars.length === 0) return;

    // Current star index
    const currentIndex = activeStarIndex >= 0 ? activeStarIndex : 0;
    const duration = TOUR_DURATION_MAP[tourLength];

    const timer = setTimeout(() => {
      // The tour ends if it reached the last star
      if (currentIndex >= sortedStars.length - 1) {
        setIsTourPlaying(false);
      } else {
        const nextStar = sortedStars[currentIndex + 1];
        // 1. Immediately update camera coordinates on this tick for instant smooth flight with label headroom
        const framing = getCameraFramingForStar(nextStar.id, true);
        if (framing) {
          cameraTargetRef.current.copy(framing.target);
          cameraDistanceRef.current = framing.distance;
          cameraAngleRef.current = { ...framing.angle };
        }
        // 2. Notify selection
        onSelectStar(nextStar);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [isTourPlaying, activeStarIndex, sortedStars, tourLength, onSelectStar, getCameraFramingForStar]);

  // Main Render & Animation Loop
  useEffect(() => {
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Background tab throttling: pause CPU/GPU rendering when tab is hidden
      if (!isTabVisibleRef.current) return;

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsedTime = clock.getElapsedTime();

      // Orbit inertia damping when user releases drag or swipe
      if (!isDraggingRef.current) {
        if (Math.abs(orbitVelocityRef.current.x) > 0.00005 || Math.abs(orbitVelocityRef.current.y) > 0.00005) {
          cameraAngleRef.current.theta += orbitVelocityRef.current.x;
          cameraAngleRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraAngleRef.current.phi + orbitVelocityRef.current.y));
          orbitVelocityRef.current.x *= 0.91;
          orbitVelocityRef.current.y *= 0.91;
        } else {
          orbitVelocityRef.current.x = 0;
          orbitVelocityRef.current.y = 0;
        }
      }

      // 1. Update shared time uniform once across all 531 star shaders (Zero tree traversals!)
      sharedTimeUniformRef.current.value = (elapsedTime % 600.0) * rotationSpeed;

      // 2. High-performance rotation without child traversal
      if (isAutoRotating) {
        const baseRotDelta = delta * 0.15 * rotationSpeed;
        starObjectsRef.current.forEach((starGroup, starId) => {
          starGroup.rotation.y += starId === 'vfts-352' ? baseRotDelta * 1.86 : baseRotDelta;
        });
      }

      // 3. Dynamic focused point light: moves to focused star or smoothly illuminates target
      if (focusedLightRef.current) {
        const activeStarId = focusedStarIdRef.current ?? selectedStarIdRef.current;
        const activeStar = activeStarId ? sortedStars.find(s => s.id === activeStarId) : null;
        if (activeStar) {
          const sc = starScalesRef.current[activeStar.id];
          if (sc) {
            focusedLightRef.current.position.set(sc.xPos, sc.radius, sc.zPos || 0);
            focusedLightRef.current.distance = Math.max(0.00005, sc.radius * 3.2);
            focusedLightRef.current.color.set(activeStar.colorHex);
            focusedLightRef.current.intensity = 1.8;
          }
        } else {
          focusedLightRef.current.position.copy(cameraTargetRef.current);
          focusedLightRef.current.distance = Math.max(10, cameraDistanceRef.current * 1.5);
          focusedLightRef.current.intensity = 0.4;
        }
      }

      // 4. Throttled Raycasting for hover detection: runs at display refresh rate, never on raw mouse event
      if (
        pendingRaycastPosRef.current &&
        containerRef.current &&
        cameraRef.current &&
        !isDraggingRef.current &&
        !isRightDraggingRef.current
      ) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = ((pendingRaycastPosRef.current.x - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((pendingRaycastPosRef.current.y - rect.top) / rect.height) * 2 + 1;
        pendingRaycastPosRef.current = null;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

        const meshes = interactiveMeshesRef.current;
        if (meshes.length > 0) {
          const intersects = raycaster.intersectObjects(meshes, false);
          if (intersects.length > 0) {
            let hit: THREE.Object3D | null = intersects[0].object;
            while (hit && (!hit.userData || !hit.userData.starData) && hit.parent) {
              hit = hit.parent;
            }
            if (hit && hit.userData?.starData) {
              setHoveredStar(hit.userData.starData);
              if (containerRef.current) containerRef.current.style.cursor = 'pointer';
            }
          } else {
            setHoveredStar(null);
            if (containerRef.current) containerRef.current.style.cursor = 'grab';
          }
        }
      }

      // Camera positioning & flight animation:
      // Cinematic camera glide between stars (fluid, zero-delay travel)
      if (cameraRef.current) {
        const { theta, phi } = cameraAngleRef.current;
        const dist = cameraDistanceRef.current;

        const targetX = cameraTargetRef.current.x + dist * Math.sin(phi) * Math.sin(theta);
        const targetY = cameraTargetRef.current.y + dist * Math.cos(phi);
        const targetZ = cameraTargetRef.current.z + dist * Math.sin(phi) * Math.cos(theta);
        const targetPos = new THREE.Vector3(targetX, targetY, targetZ);

        // Frame-rate independent responsive flight:
        // decayRate = 5.5 (~0.7s silky smooth glide) so motion starts immediately on frame 1 without delay
        const decayRate = isTourPlayingRef.current ? 5.5 : 4.5;
        const lerpFactor = Math.min(1.0, 1.0 - Math.exp(-decayRate * delta));

        currentCameraPosRef.current.lerp(targetPos, lerpFactor);
        currentLookAtRef.current.lerp(cameraTargetRef.current, lerpFactor);

        cameraRef.current.position.copy(currentCameraPosRef.current);
        cameraRef.current.lookAt(currentLookAtRef.current);

        // Dynamically adjust near/far planes based on current distance to maintain pristine depth-buffer precision
        // Completely eliminates Z-fighting, black clipping, and texture tearing across 1km to multi-terameter scales
        const targetNear = Math.max(0.0000001, Math.min(30.0, dist * 0.002));
        const targetFar = Math.max(150000, dist * 35.0);
        if (Math.abs(cameraRef.current.near - targetNear) > targetNear * 0.1 || Math.abs(cameraRef.current.far - targetFar) > 100) {
          cameraRef.current.near = targetNear;
          cameraRef.current.far = targetFar;
          cameraRef.current.updateProjectionMatrix();
        }
      }

      // Update procedural continuous grid positioning and dynamic tier resolution
      if (cameraRef.current && continuousGridRef.current) {
        // Use real-time instantaneous camera distance to focus target for silky smooth synchronized motion
        const currentDistToFocus = currentCameraPosRef.current.distanceTo(currentLookAtRef.current);
        continuousGridRef.current.update(cameraRef.current, currentDistToFocus);
      }

      // Update 2D Screen Projections for Floating Star Name Labels (Zero layout thrashing: only updates active star)
      if (containerRef.current && cameraRef.current) {
        const activeSelectedId = focusedStarIdRef.current ?? selectedStarIdRef.current;
        const activeHoveredId = hoveredStarRef.current?.id;
        const currentActiveId = activeHoveredId || activeSelectedId;

        // If active star changed, immediately hide previous active star label
        if (lastActiveStarIdRef.current && lastActiveStarIdRef.current !== currentActiveId) {
          const prevEl = labelElementsRef.current.get(lastActiveStarIdRef.current);
          if (prevEl) {
            prevEl.style.opacity = '0';
            prevEl.style.pointerEvents = 'none';
          }
        }
        lastActiveStarIdRef.current = currentActiveId || null;

        if (currentActiveId) {
          const el = labelElementsRef.current.get(currentActiveId);
          const sc = starScalesRef.current[currentActiveId];
          if (el && sc) {
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            const starApexY = sc.radius * 2;
            const tempVec = new THREE.Vector3(sc.xPos, starApexY, sc.zPos || 0).project(cameraRef.current);

            if (tempVec.z > 1.0 || Math.abs(tempVec.x) > 1.4 || Math.abs(tempVec.y) > 1.4) {
              el.style.opacity = '0';
              el.style.pointerEvents = 'none';
            } else {
              const screenX = ((tempVec.x + 1) / 2) * width;
              const screenY = ((-tempVec.y + 1) / 2) * height;

              const safeMarginX = Math.min(width * 0.25, 90);
              const clampedX = Math.max(safeMarginX, Math.min(width - safeMarginX, screenX));
              const isNearTop = screenY < 55;
              const posY = isNearTop ? Math.min(height - 110, screenY + 16) : Math.max(55, screenY - 8);

              el.style.opacity = '1';
              el.style.pointerEvents = 'auto';
              el.style.transform = isNearTop
                ? `translate3d(calc(${clampedX}px - 50%), ${posY}px, 0)`
                : `translate3d(calc(${clampedX}px - 50%), calc(${posY}px - 100%), 0)`;
              el.setAttribute('data-near-top', isNearTop ? 'true' : 'false');
            }
          }
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isAutoRotating, rotationSpeed]);

  // Mouse & Touch Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    orbitVelocityRef.current = { x: 0, y: 0 };
    triggerInteractionDpr();
    if (e.button === 2) {
      // Right click drag -> Pan along x/y axis
      isRightDraggingRef.current = true;
    } else {
      // Left click drag -> Orbit rotation
      isDraggingRef.current = true;
    }
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isRightDraggingRef.current) {
      // Pan camera target
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;
      const panSpeed = cameraDistanceRef.current * 0.0018;

      const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), -cameraAngleRef.current.theta);
      cameraTargetRef.current.addScaledVector(right, -deltaX * panSpeed);
      cameraTargetRef.current.y += deltaY * panSpeed;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    } else if (isDraggingRef.current) {
      triggerInteractionDpr();
      // Orbit camera around target with momentum tracking
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      const velX = -deltaX * 0.007;
      const velY = -deltaY * 0.007;
      orbitVelocityRef.current = { x: velX, y: velY };

      cameraAngleRef.current.theta += velX;
      cameraAngleRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraAngleRef.current.phi + velY));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    } else {
      // Schedule throttled raycasting for next animation frame (avoids 240Hz mouse event bottleneck)
      pendingRaycastPosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isRightDraggingRef.current = false;
    pendingRaycastPosRef.current = null;
  };

  // Touch controls with pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    orbitVelocityRef.current = { x: 0, y: 0 };
    triggerInteractionDpr();
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
    } else if (e.touches.length === 1) {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    triggerInteractionDpr();
    if (e.touches.length === 2 && touchStartDistanceRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (touchStartDistanceRef.current > 0) {
        const ratio = distance / touchStartDistanceRef.current;
        // Continuous proportional fluid zoom calibrated to finger gesture speed
        const zoomDelta = (1.0 - ratio) * 1.35;
        const zoomFactor = Math.exp(zoomDelta);
        cameraDistanceRef.current = Math.max(0.000005, Math.min(150000, cameraDistanceRef.current * zoomFactor));
      }
      touchStartDistanceRef.current = distance;
    } else if (e.touches.length === 1 && isDraggingRef.current) {
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;
      const velX = -deltaX * 0.007;
      const velY = -deltaY * 0.007;
      orbitVelocityRef.current = { x: velX, y: velY };

      cameraAngleRef.current.theta += velX;
      cameraAngleRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraAngleRef.current.phi + velY));
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    touchStartDistanceRef.current = null;
    setHoveredStar(null);
  };

  // Focus on star without opening modal: pans and zooms in 3D
  const handleFocusStar = (star: StarData, forceInstant?: boolean) => {
    // Instant switch without reverse scrubbing if jumping from last to first star (or vice versa)
    const currentActiveId = focusedStarId ?? selectedStarId;
    const isWrappingExtreme = Boolean(
      currentActiveId &&
      sortedStars.length > 1 &&
      ((currentActiveId === sortedStars[sortedStars.length - 1]?.id && star.id === sortedStars[0]?.id) ||
       (currentActiveId === sortedStars[0]?.id && star.id === sortedStars[sortedStars.length - 1]?.id))
    );

    onSelectStar(star);
    soundEffects.play('select');
    const framing = getCameraFramingForStar(star.id, isTourPlayingRef.current);
    if (framing) {
      cameraTargetRef.current.copy(framing.target);
      cameraDistanceRef.current = framing.distance;
      cameraAngleRef.current = { ...framing.angle };
      if (forceInstant || isWrappingExtreme) {
        snapCameraToTarget();
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !cameraRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const starMeshes: THREE.Object3D[] = [];
    starObjectsRef.current.forEach((group) => {
      group.traverse((child) => {
        if (child instanceof THREE.Mesh && (child.name.startsWith('Photosphere') || child.name.startsWith('StarHitTarget'))) {
          starMeshes.push(child);
        }
      });
    });

    const intersects = raycaster.intersectObjects(starMeshes, true);
    if (intersects.length > 0) {
      let hit: THREE.Object3D | null = intersects[0].object;
      while (hit && (!hit.userData || !hit.userData.starData) && hit.parent) {
        hit = hit.parent;
      }
      if (hit && hit.userData?.starData) {
        const clickedStar = hit.userData.starData;
        const currentActiveId = focusedStarIdRef.current ?? selectedStarIdRef.current;
        if (currentActiveId === clickedStar.id && onInspectStar) {
          onInspectStar(clickedStar);
        } else {
          handleFocusStar(clickedStar);
        }
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    triggerInteractionDpr();
    const zoomFactor = e.deltaY > 0 ? 1.14 : 0.87;
    cameraDistanceRef.current = Math.max(0.000005, Math.min(150000, cameraDistanceRef.current * zoomFactor));
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const factor = direction === 'in' ? 0.75 : 1.35;
    cameraDistanceRef.current = Math.max(0.000005, Math.min(150000, cameraDistanceRef.current * factor));
    soundEffects.play(direction === 'in' ? 'zoomIn' : 'zoomOut');
  };

  const handleResetCamera = () => {
    soundEffects.play('reset');
    const isMob = checkIsMobile();
    const activeId = focusedStarId ?? selectedStarId;

    if (activeId) {
      const framing = getCameraFramingForStar(activeId, isTourPlayingRef.current);
      if (framing) {
        cameraTargetRef.current.copy(framing.target);
        cameraDistanceRef.current = framing.distance;
        cameraAngleRef.current = { ...framing.angle };
      }
    } else {
      cameraAngleRef.current = getDefaultCameraAngle(isMob);
      handleFitAllStars();
    }
  };

  const handleFitAllStars = () => {
    soundEffects.play('reset');
    const isMob = checkIsMobile();
    cameraAngleRef.current = getDefaultCameraAngle(isMob);
    const scaleList = Object.values(starScales) as Array<{ radius: number; xPos: number; zPos?: number; rawD: number }>;
    if (scaleList.length === 0) return;
    const minX = scaleList.reduce((min: number, curr) => Math.min(min, curr.xPos - curr.radius), 0);
    const maxX = scaleList.reduce((max: number, curr) => Math.max(max, curr.xPos + curr.radius), 10);
    const minZ = scaleList.reduce((min: number, curr) => Math.min(min, (curr.zPos || 0) - curr.radius), 0);
    const maxZ = scaleList.reduce((max: number, curr) => Math.max(max, (curr.zPos || 0) + curr.radius), 0);
    const totalWidth = Math.max(10, maxX - minX);
    const totalDepth = Math.max(10, maxZ - minZ);
    const totalSpan = Math.max(totalWidth, totalDepth);
    const midX = (minX + maxX) / 2;
    const midZ = (minZ + maxZ) / 2;
    const maxRadius = scaleList.reduce((max: number, curr) => Math.max(max, curr.radius), 1);

    const isSizeAscending = sortKey === 'size' && sortDirection === 'asc';
    const isAllStars = activePresetId === 'all-stars-catalog' || sortedStars.length > 500;
    const isSpiralActive = !isMob && isAllStars && isSizeAscending && allStarsLayoutMode === 'spiral';

    if (isSpiralActive && sortedStars.length > 0) {
      // Zoom is centered directly into the smallest star in the catalog
      const smallestStar = sortedStars[0];
      const smallestScale = starScales[smallestStar.id];
      if (smallestScale) {
        cameraTargetRef.current.set(smallestScale.xPos, smallestScale.radius, smallestScale.zPos || 0);
      } else {
        cameraTargetRef.current.set(0, 0, 0);
      }
    } else {
      cameraTargetRef.current.set(midX, maxRadius * 0.45, midZ);
    }

    const aspect = cameraRef.current?.aspect || (typeof window !== 'undefined' ? window.innerWidth / (window.innerHeight || 1) : 1.0);
    const portraitFactor = aspect < 1.0 ? Math.max(1.15, 1.05 / aspect) : 1.0;
    cameraDistanceRef.current = Math.max(45, totalSpan * 0.75 * portraitFactor, maxRadius * 2.8 * (aspect < 1.0 ? 1.25 : 1.0));
  };

  // Focus on the Center-Left Edge Anchor Point (0, 0) of the extended 10x10 continuous grid or smallest star in spiral
  const handleFocusAnchor = () => {
    onSelectStar(null);
    cameraAngleRef.current = { theta: 0, phi: Math.PI / 3.4 };
    const isMob = checkIsMobile();
    const isSizeAscending = sortKey === 'size' && sortDirection === 'asc';
    const isAllStars = activePresetId === 'all-stars-catalog' || sortedStars.length > 500;
    const isSpiralActive = !isMob && isAllStars && isSizeAscending && allStarsLayoutMode === 'spiral';

    if (isSpiralActive && sortedStars.length > 0) {
      const smallestStar = sortedStars[0];
      const sc = starScales[smallestStar.id];
      if (sc) {
        cameraTargetRef.current.set(sc.xPos, sc.radius, sc.zPos || 0);
      } else {
        cameraTargetRef.current.set(0, 0, 0);
      }
    } else {
      cameraTargetRef.current.set(0, 0, 0);
    }
    const firstStar = sortedStars[0];
    const firstR = firstStar ? starScales[firstStar.id]?.radius || 1 : 1;
    cameraDistanceRef.current = Math.max(0.005, Math.min(3.5, firstR * 3.2));
  };

  // Pan to extreme ends (Smallest vs Largest)
  const handlePanToSmallest = () => {
    if (sortedStars.length === 0) return;
    const smallest = sortedStars[0];
    handleFocusStar(smallest);
  };

  const handlePanToLargest = () => {
    if (sortedStars.length === 0) return;
    const largest = sortedStars[sortedStars.length - 1];
    handleFocusStar(largest);
  };

  // Toggle Fullscreen on entire page
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  const activeFocusedStar = sortedStars.find(s => s.id === (focusedStarId ?? selectedStarId));
  const displayStar = hoveredStar || activeFocusedStar;
  const isPreviewing = Boolean(hoveredStar && (!activeFocusedStar || hoveredStar.id !== activeFocusedStar.id));

  // Comprehensive Keyboard Shortcuts: Every functionality has a distinct shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not capture shortcuts when typing in inputs, text areas, or when homescreen is open
      if (
        isHomeOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // 1. Unfocus: Re-mapped to 'U' (Escape key is preserved for exiting fullscreen)
      if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        handleUnfocus();
      }
      // 2. Navigation between stars
      else if (e.key === 'ArrowLeft' || e.key === '[') {
        e.preventDefault();
        handlePrevStar();
      } else if (e.key === 'ArrowRight' || e.key === ']') {
        e.preventDefault();
        handleNextStar();
      }
      // 3. Pan to Center-Left Grid Anchor Point (0), First / Smallest (1), or Last / Largest (9) star
      else if (e.key === '0') {
        e.preventDefault();
        handleFocusAnchor();
      } else if (e.key === '1' || e.key === 'Home') {
        e.preventDefault();
        handlePanToSmallest();
      } else if (e.key === '9' || e.key === 'End') {
        e.preventDefault();
        handlePanToLargest();
      }
      // 4. Fullscreen toggle
      else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
      // 5. Encyclopedia toggle
      else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setIsEncyclopediaMenuOpen((prev) => !prev);
      }
      // 6. Auto Tour toggle
      else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        handleToggleTour();
      }
      // Tour pace cycle: P (or Shift+T)
      else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setTourLength((prev) => (prev === 'short' ? 'medium' : prev === 'medium' ? 'long' : 'short'));
      }
      // 6. Camera Zoom In / Out
      else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoom('in');
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoom('out');
      }
      // 7. Reset Camera view
      else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleResetCamera();
      }
      // 8. Fit All Stars in panoramic view
      else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleFitAllStars();
      }
      // 9. Surface Spin toggle
      else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setIsAutoRotating((prev) => !prev);
      }
      // 10. Photosphere Wireframe toggle
      else if (e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        setWireframe((prev) => !prev);
      }
      // Layout toggle in All Stars Catalog (Spiral vs Normal) - Desktop & Tablet only, only when sorted ascending by size
      else if (
        (e.key === 'l' || e.key === 'L') &&
        !checkIsMobile() &&
        (activePresetId === 'all-stars-catalog' || sortedStars.length > 500) &&
        sortKey === 'size' &&
        sortDirection === 'asc'
      ) {
        e.preventDefault();
        handleToggleLayoutMode();
      }
      // 11. Toggle Preset Search Stars & List (replaces Show all stars)
      else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        setIsPresetSearchActive((prev) => {
          const next = !prev;
          if (!next) {
            setPresetSearchQuery('');
          }
          return next;
        });
      }
      // 12. Open Star Dossier details for focused star
      else if (e.key === 'd' || e.key === 'D') {
        if (activeFocusedStar && onInspectStar) {
          e.preventDefault();
          onInspectStar(activeFocusedStar);
        }
      }
      // 13. Cycle Sort Metric
      else if (e.key === 'o' || e.key === 'O') {
        if (onSortChange && sortKey) {
          e.preventDefault();
          const sortKeys: StageSortKey[] = ['size', 'distance', 'mass', 'temperature', 'luminosity', 'apparentMagnitude'];
          const currentIndex = sortKeys.indexOf(sortKey as StageSortKey);
          const nextKey: StageSortKey = sortKeys[(currentIndex + 1) % sortKeys.length] ?? 'size';
          onSortChange(nextKey);
        }
      }
      // 15. Reverse Sort Direction
      else if (e.key === 'x' || e.key === 'X') {
        if (onToggleSortDirection) {
          e.preventDefault();
          onToggleSortDirection();
        }
      }
      // 16. Toggle Stage Floor Grid
      else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        setShowGrid((prev) => !prev);
      }
      // 17. Toggle Hide/Show Controls
      else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setAreControlsHidden((prev) => !prev);
      }
      // 18. Toggle Shortcuts Help Sheet
      else if (e.key === '?') {
        e.preventDefault();
        setShowShortcutsHelp((prev) => !prev);
      }
      // 19. Toggle Sound Effects (Mute / Unmute)
      else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        soundEffects.toggleSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handlePrevStar,
    handleNextStar,
    handlePanToSmallest,
    handlePanToLargest,
    handleUnfocus,
    activeFocusedStar,
    onInspectStar,
    onToggleViewMode,
    viewMode,
    onSortChange,
    sortKey,
    onToggleSortDirection,
    handleToggleTour,
    isHomeOpen,
  ]);

  const renderTopStageControls = (isMobile: boolean = false) => {
    const isAllStarsPreset = activePresetId === 'all-stars-catalog' || sortedStars.length > 500;
    return (
      <div className={`flex items-center gap-1 sm:gap-1.5 bg-[#040816]/90 backdrop-blur-xl p-1 sm:p-1.5 rounded-xl border border-cyan-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] pointer-events-auto transition-all duration-200`}>
        {isTopPanelMinimized ? (
          <button
            id={isMobile ? "btn-mobile-top-stage-controls" : "btn-top-maximize-panel"}
            onClick={() => setIsTopPanelMinimized(false)}
            title="Stage Controls"
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Stage Controls</span>
          </button>
        ) : (
          <>
            {/* Zoom In & Out */}
            <button
              id={isMobile ? "btn-mobile-zoom-in" : "btn-zoom-in"}
              onClick={() => handleZoom('in')}
              title="Zoom In (+)"
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/20 font-bold text-sm transition-colors cursor-pointer active:scale-95"
            >
              +
            </button>
            <button
              id={isMobile ? "btn-mobile-zoom-out" : "btn-zoom-out"}
              onClick={() => handleZoom('out')}
              title="Zoom Out (−)"
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/20 font-bold text-sm transition-colors cursor-pointer active:scale-95"
            >
              −
            </button>

            {/* Focus or Unfocus */}
            {activeFocusedStar ? (
              <button
                id={isMobile ? "btn-mobile-unfocus-stars" : "btn-unfocus-stars"}
                onClick={handleUnfocus}
                title="Unfocus Star (U)"
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <X className="w-3.5 h-3.5 shrink-0" />
                <span className={isTabletDevice ? 'hidden' : 'hidden lg:inline'}>Unfocus</span>
                <StageKbd variant="amber">U</StageKbd>
              </button>
            ) : (
              <button
                id={isMobile ? "btn-mobile-reset-cam" : "btn-reset-cam"}
                onClick={handleResetCamera}
                title="Reset Camera (R)"
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span className={isTabletDevice ? 'hidden' : 'hidden lg:inline'}>Reset</span>
                <StageKbd variant="cyan">R</StageKbd>
              </button>
            )}

            {/* Fit Entire Stage */}
            <button
              id={isMobile ? "btn-mobile-fit-all" : "btn-fit-all"}
              onClick={handleFitAllStars}
              title="Fit All Stars (A)"
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-medium transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Maximize2 className="w-3.5 h-3.5 shrink-0" />
              <span className={isTabletDevice ? 'hidden' : 'hidden lg:inline'}>Fit All</span>
              <StageKbd variant="neutral">A</StageKbd>
            </button>

            {/* All-Stars Layout Mode Toggle (Spiral vs Normal) - Only on desktop & tablet when sorted ascending by size, hidden on mobile */}
            {isAllStarsPreset && !isMobile && !checkIsMobile() && sortKey === 'size' && sortDirection === 'asc' && (
              <button
                id="btn-toggle-spiral-normal"
                onClick={handleToggleLayoutMode}
                title={`All Stars Preset: ${allStarsLayoutMode === 'spiral' ? 'Spiral Mode (Default/Active)' : 'Normal Lineup (Active)'}. Click to toggle layout mode (L)`}
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm active:scale-95 ${
                  allStarsLayoutMode === 'spiral'
                    ? 'bg-purple-950/80 border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                    : 'bg-slate-800/80 border-slate-600 text-slate-200 hover:text-white'
                }`}
              >
                <Orbit className={`w-3.5 h-3.5 shrink-0 ${allStarsLayoutMode === 'spiral' ? 'text-purple-400 animate-spin-slow' : 'text-slate-400'}`} />
                <span className={isTabletDevice ? 'hidden' : 'hidden lg:inline'}>
                  {allStarsLayoutMode === 'spiral' ? 'Spiral Mode' : 'Normal Lineup'}
                </span>
                <span className={isTabletDevice ? 'inline' : 'inline lg:hidden'}>
                  {allStarsLayoutMode === 'spiral' ? 'Spiral' : 'Normal'}
                </span>
                <StageKbd variant={allStarsLayoutMode === 'spiral' ? 'amber' : 'neutral'} className="hidden lg:inline-flex">L</StageKbd>
              </button>
            )}

            <div className="h-4 w-[1px] bg-cyan-500/20 mx-0.5" />

            {/* More... Menu for Spin, Wire, and Grid */}
            <div className="relative" ref={isMobile ? mobileTogglesMenuRef : togglesMenuRef}>
              <button
                id={isMobile ? "btn-mobile-stage-toggles-more" : "btn-stage-toggles-more"}
                onClick={() => setIsTogglesMenuOpen((prev) => !prev)}
                title="More Scene Options (Spin, Wireframe, Grid, Layout)"
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer select-none active:scale-95 ${
                  (isAutoRotating || wireframe || showGrid)
                    ? 'bg-cyan-950/80 border-cyan-400/50 text-cyan-300 shadow-sm'
                    : 'border-cyan-500/20 text-slate-300 hover:text-white hover:bg-cyan-500/20'
                }`}
              >
                <span>More...</span>
                <ChevronDown className={`w-3 h-3 text-cyan-400 transition-transform duration-200 ${isTogglesMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isTogglesMenuOpen && (
                <div
                  id={isMobile ? "menu-mobile-stage-toggles-overlay" : "menu-stage-toggles-overlay"}
                  className="absolute right-0 top-full mt-2 w-52 bg-[#040817]/98 border border-cyan-500/40 rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.95),0_0_20px_rgba(6,182,212,0.25)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl font-mono text-xs flex flex-col gap-1"
                >
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-cyan-500/20 pb-1 mb-1">
                    Scene Toggles
                  </div>
                  <button
                    id={isMobile ? "btn-mobile-overlay-toggle-spin" : "btn-overlay-toggle-spin"}
                    onClick={() => setIsAutoRotating(!isAutoRotating)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      isAutoRotating ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin-slow text-cyan-400' : 'text-slate-400'}`} />
                      <span>Spin Stars</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isAutoRotating && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      <StageKbd variant={isAutoRotating ? 'cyan' : 'neutral'} className="hidden lg:inline-flex">S</StageKbd>
                    </div>
                  </button>

                  <button
                    id={isMobile ? "btn-mobile-overlay-toggle-wire" : "btn-overlay-toggle-wire"}
                    onClick={() => setWireframe(!wireframe)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      wireframe ? 'bg-amber-950/80 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Layers className={`w-3.5 h-3.5 ${wireframe ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span>Wireframe</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      {wireframe && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      <StageKbd variant={wireframe ? 'amber' : 'neutral'} className="hidden lg:inline-flex">W</StageKbd>
                    </div>
                  </button>

                  <button
                    id={isMobile ? "btn-mobile-overlay-toggle-grid" : "btn-overlay-toggle-grid"}
                    onClick={() => setShowGrid(!showGrid)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      showGrid ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Grid className={`w-3.5 h-3.5 ${showGrid ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span>Floor Grid</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      {showGrid && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      <StageKbd variant={showGrid ? 'cyan' : 'neutral'} className="hidden lg:inline-flex">G</StageKbd>
                    </div>
                  </button>

                  {isAllStarsPreset && !isMobile && !checkIsMobile() && sortKey === 'size' && sortDirection === 'asc' && (
                    <button
                      id="btn-overlay-toggle-layout"
                      onClick={handleToggleLayoutMode}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                        allStarsLayoutMode === 'spiral'
                          ? 'bg-purple-950/80 text-purple-300 font-bold border border-purple-500/30'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Orbit className={`w-3.5 h-3.5 ${allStarsLayoutMode === 'spiral' ? 'text-purple-400' : 'text-slate-400'}`} />
                        <span>Spiral Layout</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {allStarsLayoutMode === 'spiral' && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                        <span className="text-[10px] text-slate-400">{allStarsLayoutMode === 'spiral' ? 'Spiral' : 'Normal'}</span>
                        <StageKbd variant="neutral" className="hidden lg:inline-flex">L</StageKbd>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="h-4 w-[1px] bg-cyan-500/20 mx-0.5" />

            {/* Fullscreen Toggle */}
            <button
              id={isMobile ? "btn-mobile-toggle-fullscreen" : "btn-toggle-fullscreen"}
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                isFullscreen 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                  : 'text-cyan-400 hover:text-white hover:bg-cyan-500/20'
              }`}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className={isTabletDevice ? 'hidden' : 'hidden lg:inline'}>{isFullscreen ? 'Exit' : 'Full'}</span>
              <StageKbd variant={isFullscreen ? 'active' : 'cyan'} className="hidden lg:inline-flex">F</StageKbd>
            </button>

            {/* Sound Effects Toggle (Mute / Unmute) */}
            <button
              id={isMobile ? "btn-mobile-toggle-sound" : "btn-toggle-sound"}
              onClick={() => soundEffects.toggleSound()}
              title={isSoundOn ? 'Sound Effects Enabled (M to mute)' : 'Sound Effects Muted (M to unmute)'}
              aria-label={isSoundOn ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                isSoundOn 
                  ? 'text-cyan-400 hover:text-white hover:bg-cyan-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/10 opacity-70'
              }`}
            >
              {isSoundOn ? (
                <Volume2 className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              )}
              <span className={isTabletDevice ? 'hidden' : 'hidden lg:inline'}>{isSoundOn ? 'SFX' : 'Muted'}</span>
              <StageKbd variant={isSoundOn ? 'cyan' : 'neutral'} className="hidden lg:inline-flex">M</StageKbd>
            </button>

            {/* Keyboard Shortcuts Help - HIDDEN on mobile and tablet */}
            {!isMobile && (
              <button
                id="btn-shortcuts-help"
                onClick={() => setShowShortcutsHelp(true)}
                title="Keyboard Shortcuts (?)"
                className={`${isTabletDevice ? 'hidden' : 'hidden lg:flex'} px-2 py-1 rounded-lg text-xs font-mono text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-colors cursor-pointer items-center gap-1.5`}
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keys</span>
                <StageKbd variant="cyan">?</StageKbd>
              </button>
            )}

            {/* Minimize Controls Panel Button */}
            <button
              id={isMobile ? "btn-mobile-top-minimize-panel" : "btn-top-minimize-panel"}
              onClick={() => setIsTopPanelMinimized(true)}
              title="Minimize Controls Panel (<)"
              className="px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className={isTabletDevice ? 'hidden' : 'hidden lg:inline font-medium'}>Minimize</span>
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={outerWrapperRef}
      className="relative w-full h-full bg-[#02040c] overflow-hidden flex flex-col min-h-0"
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full flex-1 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Children / Overlays (e.g., Homescreen stage preview overlay) */}
      {children}

      {/* Floating 3D Star Name Labels Overlay in Preview (Virtualized: renders only active star label, saving 530 DOM nodes) */}
      {!isHomeOpen && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {displayStar && (() => {
            const star = displayStar;
            const isSelected = star.id === (focusedStarId ?? selectedStarId);
            return (
              <div
                key={star.id}
                id={`label-star-${star.id}`}
                ref={(el) => {
                  if (el) labelElementsRef.current.set(star.id, el);
                  else labelElementsRef.current.delete(star.id);
                }}
                style={{ opacity: 0, willChange: 'transform, opacity' }}
                onClick={(e) => {
                  e.stopPropagation();
                  const currentActiveId = focusedStarIdRef.current ?? selectedStarIdRef.current;
                  if (currentActiveId === star.id && onInspectStar) {
                    onInspectStar(star);
                  } else {
                    handleFocusStar(star);
                  }
                }}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                className={`absolute top-0 left-0 ${isTourPlaying ? '' : 'transition-opacity duration-150 ease-out'} pointer-events-auto cursor-pointer flex flex-col items-center group`}
              >
                <div
                  id={`bubble-label-${star.id}`}
                  className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border text-xs shadow-xl transition-all select-none whitespace-nowrap active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-300 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.6)] ring-2 ring-cyan-400/80'
                      : 'bg-[#040816]/95 hover:bg-[#0c1636] border-cyan-400/80 text-white font-semibold backdrop-blur-xl shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  }`}
                >
                  {/* True Star Color Dot */}
                  <span
                    className="w-2.5 h-2.5 rounded-full aspect-square shrink-0 relative flex items-center justify-center"
                    style={{ backgroundColor: star.colorHex, boxShadow: `0 0 10px ${star.colorHex}` }}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-90" />
                    )}
                  </span>

                  {/* Star Name */}
                  <span className="font-extrabold tracking-tight text-white max-w-[180px] sm:max-w-[280px] truncate leading-normal">
                    {star.name}
                  </span>

                  {/* Spectral Type Badge */}
                  <span className="text-[10px] sm:text-[11px] bg-slate-950/80 text-cyan-300 font-mono px-1.5 py-0.5 rounded border border-cyan-400/40 shrink-0 font-semibold">
                    {star.spectralType}
                  </span>

                  {/* Diameter Metric */}
                  <span className="text-[10px] text-cyan-200/90 font-mono shrink-0 hidden xs:inline">
                    {star.diameterSolar >= 10
                      ? `${star.diameterSolar.toLocaleString()} D☉`
                      : star.diameterKm < 1000
                      ? `${star.diameterKm} km`
                      : `${star.diameterSolar.toFixed(2)} D☉`}
                  </span>

                  {/* Downward pointer caret (default) */}
                  <div className="label-caret-down absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-[6px] border-t-cyan-500 group-data-[near-top=true]:hidden" />
                  {/* Upward pointer caret (when near top of viewport) */}
                  <div className="label-caret-up absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-b-[6px] border-b-cyan-500 hidden group-data-[near-top=true]:block" />
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Top Floating Control Bar - Accessible only from 3D mode screen, removed from home screen */}
      {!isHomeOpen && !areControlsHidden && (
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex flex-col gap-2 pointer-events-none z-30">
          {/* MOBILE TOP CONTROLS (md:hidden) */}
          <div className="flex md:hidden flex-col gap-1.5 w-full pointer-events-auto">
            {/* Top panel: Home and Encyclopedia buttons (left), Preset name & dropdown (middle), About & Coffee (right) */}
            <div className="flex items-center justify-between gap-1.5 w-full">
              {/* Home & Encyclopedia buttons on left-hand corner */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  id="btn-mobile-top-home"
                  onClick={() => {
                    if (isHomeOpen) {
                      if (onCloseHome) onCloseHome();
                      else if (onOpenHome) onOpenHome();
                    } else {
                      if (onOpenHome) onOpenHome();
                    }
                  }}
                  title={isHomeOpen ? 'Close Homepage (Return to 3D Stage)' : 'Starpedia 3D Home'}
                  aria-label="Starpedia 3D Home"
                  className={`p-1 rounded-xl backdrop-blur-xl active:scale-95 cursor-pointer shrink-0 transition-all flex items-center justify-center ${
                    isHomeOpen
                      ? 'bg-blue-600 text-white border border-blue-400 shadow-[0_0_14px_rgba(37,99,235,0.7)]'
                      : 'bg-[#040816]/95 border border-cyan-500/35 text-cyan-300 hover:text-white shadow-lg'
                  }`}
                >
                  <div className="w-6 h-6 aspect-square rounded-lg border border-cyan-400/80 p-0.5 bg-[#020512] flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.35)]">
                    <img src="/starpedia_logo.svg" alt="Starpedia 3D Logo" className="w-full h-full object-contain aspect-square rounded-sm" />
                  </div>
                </button>

                {/* Encyclopedia button next to Home button on mobile */}
                {(onOpenFrontpage || onOpenCatalog || onOpenHRDiagram || onOpenConstellations) && (
                  <div className="relative shrink-0" ref={mobileEncyclopediaMenuRef}>
                    <button
                      id="btn-mobile-top-encyclopedia"
                      onClick={() => setIsEncyclopediaMenuOpen((prev) => !prev)}
                      title="Star Encyclopedia: Browse all 4 cosmic modules (E)"
                      aria-label="Star Encyclopedia"
                      className={`p-2 rounded-xl backdrop-blur-xl border ${
                        isEncyclopediaMenuOpen
                          ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.35)]'
                          : 'border-cyan-500/35 hover:border-cyan-400 bg-[#040816]/95 text-cyan-300 hover:text-white shadow-lg'
                      } active:scale-95 cursor-pointer flex items-center justify-center shrink-0`}
                    >
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                    </button>

                    {isEncyclopediaMenuOpen && (
                      <div
                        id="menu-mobile-top-encyclopedia"
                        className="absolute left-0 top-full mt-2 w-72 max-w-[calc(100vw-1.5rem)] max-h-[75vh] overflow-y-auto scrollbar-thin bg-[#040817]/98 border border-cyan-500/40 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.95),0_0_20px_rgba(6,182,212,0.25)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl font-mono text-xs"
                      >
                        <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-cyan-500/20 pb-1.5 mb-1.5">
                          <span>Star Encyclopedia</span>
                          <span className="text-cyan-400 font-normal">4 modules</span>
                        </div>

                        <div className="flex flex-col gap-1">
                          {onOpenFrontpage && (
                            <button
                              id="btn-mobile-encyclopedia-menu-frontpage"
                              onClick={() => {
                                setIsEncyclopediaMenuOpen(false);
                                onOpenFrontpage();
                              }}
                              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 text-slate-200 hover:text-white cursor-pointer group"
                            >
                              <div className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                                <Sun className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300">What is a Star?</div>
                                <div className="text-[10px] text-slate-400 font-sans">Anatomy, fusion & life cycles</div>
                              </div>
                            </button>
                          )}

                          {onOpenCatalog && (
                            <button
                              id="btn-mobile-encyclopedia-menu-catalog"
                              onClick={() => {
                                setIsEncyclopediaMenuOpen(false);
                                onOpenCatalog();
                              }}
                              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 text-slate-200 hover:text-white cursor-pointer group"
                            >
                              <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                                <Grid className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300">Stellar Catalog</div>
                                <div className="text-[10px] text-slate-400 font-sans">Filter & explore cataloged stars</div>
                              </div>
                            </button>
                          )}

                          {onOpenHRDiagram && (
                            <button
                              id="btn-mobile-encyclopedia-menu-hr"
                              onClick={() => {
                                setIsEncyclopediaMenuOpen(false);
                                onOpenHRDiagram();
                              }}
                              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 text-slate-200 hover:text-white cursor-pointer group"
                            >
                              <div className="p-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shrink-0">
                                <BarChart2 className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300">H-R Diagram</div>
                                <div className="text-[10px] text-slate-400 font-sans">Luminosity vs Temperature plot</div>
                              </div>
                            </button>
                          )}

                          {onOpenConstellations && (
                            <button
                              id="btn-mobile-encyclopedia-menu-constellations"
                              onClick={() => {
                                setIsEncyclopediaMenuOpen(false);
                                onOpenConstellations();
                              }}
                              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 text-slate-200 hover:text-white cursor-pointer group"
                            >
                              <div className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                                <Compass className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300">Constellation Guide</div>
                                <div className="text-[10px] text-slate-400 font-sans">All 88 IAU constellations & lore</div>
                              </div>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Middle part: Preset name and dropdown (omitted when on homescreen) */}
              {!isHomeOpen ? (
                <div className="flex-1 min-w-0 relative" ref={mobilePresetMenuRef}>
                {(() => {
                  const completeCatalogItem = presets.find((p) => p.id === 'all-stars-catalog');
                  const regularPresets = presets.filter((p) => p.id !== 'all-stars-catalog');
                  const isCatalogActive = activePresetId === 'all-stars-catalog';
                  const activePreset = presets.find((p) => p.id === activePresetId);
                  const activePresetTitle = isCatalogActive
                    ? 'The Complete Catalog'
                    : (activePreset ? activePreset.title : 'Custom Comparison');

                  return (
                    <>
                      <button
                        id="btn-mobile-preset-dropdown"
                        onClick={() => setIsPresetMenuOpen(!isPresetMenuOpen)}
                        title="Select comparison preset or browse astronomical catalog"
                        className={`w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-xl border font-mono text-xs shadow-lg backdrop-blur-xl transition-all cursor-pointer select-none ${
                          isPresetMenuOpen
                            ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300'
                            : 'bg-[#040816]/95 border-cyan-500/35 text-slate-200'
                        }`}
                      >
                        <span className="text-[11px] font-semibold text-cyan-300 truncate">
                          {activePresetTitle}
                        </span>
                        <span className="text-[10px] text-cyan-400/80 shrink-0">
                          ({stars.length})
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-cyan-400 shrink-0 transition-transform duration-200 ${
                            isPresetMenuOpen ? 'rotate-180 text-cyan-300' : ''
                          }`}
                        />
                      </button>

                      {/* Presets Dropdown Popover for Mobile */}
                      {isPresetMenuOpen && (
                        <div
                          id="menu-mobile-preset-dropdown"
                          className="fixed left-2 right-2 sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:w-96 sm:right-auto top-[52px] sm:top-full mt-1 sm:mt-2 max-h-[75vh] overflow-y-auto bg-[#040817]/98 border border-cyan-500/40 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.95),0_0_20px_rgba(6,182,212,0.25)] p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl font-mono text-xs scrollbar-thin"
                        >
                          {/* The Complete Catalog - Placed on the very top, not a preset, not editable, separated from presets */}
                          {completeCatalogItem && (
                            <div className="mb-2">
                              <div className="flex items-center justify-between px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                <span>Astronomical Catalog</span>
                                <span className="text-cyan-400 font-normal">All {completeCatalogItem.starIds.length} stars</span>
                              </div>
                              <button
                                id="btn-mobile-complete-catalog"
                                onClick={() => {
                                  if (onSelectPreset) onSelectPreset('all-stars-catalog');
                                  setIsPresetMenuOpen(false);
                                }}
                                className={`group w-full flex items-center justify-between p-2 rounded-lg transition-all text-left cursor-pointer border ${
                                  isCatalogActive
                                    ? 'bg-cyan-500/20 border-cyan-400/80 text-cyan-200 shadow-sm'
                                    : 'bg-cyan-950/20 hover:bg-cyan-500/10 border-cyan-500/30 text-slate-200'
                                }`}
                              >
                                <div className="flex-1 min-w-0 pr-2">
                                  <div className="flex items-center gap-1.5 font-bold flex-wrap">
                                    <span className={`text-xs ${isCatalogActive ? 'text-cyan-300' : 'text-slate-100'}`}>
                                      The Complete Catalog
                                    </span>
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shrink-0 font-mono">
                                      Full Sky
                                    </span>
                                    {isCatalogActive && <Check className="w-3.5 h-3.5 text-cyan-400 ml-auto shrink-0" />}
                                  </div>
                                  <p className="text-[10px] text-slate-400 break-words mt-0.5">
                                    {completeCatalogItem.desc || `${completeCatalogItem.starIds.length} stars`}
                                  </p>
                                </div>
                              </button>
                            </div>
                          )}

                          <div className="border-t border-cyan-500/20 my-2" />

                          <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-cyan-500/20 pb-1 mb-1">
                            <span>Comparison Presets</span>
                            <span className="text-cyan-400 font-normal">{regularPresets.length} presets</span>
                          </div>

                          <div className="flex flex-col gap-1">
                            {regularPresets.map((preset) => {
                              const isActive = activePresetId === preset.id;
                              return (
                                <div
                                  key={preset.id}
                                  className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                                    isActive
                                      ? 'bg-cyan-500/20 border border-cyan-400/80 text-cyan-200 shadow-sm'
                                      : 'hover:bg-cyan-500/10 border border-transparent text-slate-300'
                                  }`}
                                >
                                  <button
                                    id={`btn-mobile-preset-${preset.id}`}
                                    onClick={() => {
                                      if (onSelectPreset) onSelectPreset(preset.id);
                                      setIsPresetMenuOpen(false);
                                    }}
                                    className="flex-1 text-left flex flex-col gap-0.5 cursor-pointer pr-2 min-w-0"
                                  >
                                    <div className="flex items-center gap-1.5 font-bold flex-wrap">
                                      <span className={`text-xs ${isActive ? 'text-cyan-300' : 'text-slate-200'}`}>
                                        {preset.title}
                                      </span>
                                      {preset.isCustom && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/25 text-purple-300 border border-purple-500/40 shrink-0 font-mono">
                                          Custom
                                        </span>
                                      )}
                                      {isActive && <Check className="w-3.5 h-3.5 text-cyan-400 ml-auto shrink-0" />}
                                    </div>
                                    <p className="text-[10px] text-slate-400 break-words mt-0.5">
                                      {preset.desc || `${preset.starIds.length} stars`}
                                    </p>
                                  </button>

                                  <div className="flex items-center gap-1 shrink-0">
                                    {onEditPreset && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setIsPresetMenuOpen(false);
                                          onEditPreset(preset);
                                        }}
                                        title={`Edit preset: ${preset.title}`}
                                        className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/20 rounded cursor-pointer"
                                      >
                                        <Pencil className="w-3 h-3" />
                                      </button>
                                    )}
                                    {preset.isCustom && onDeletePreset && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onDeletePreset(preset.id);
                                        }}
                                        title="Delete custom preset"
                                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/20 rounded cursor-pointer"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Actions: ONLY Create New Preset (no redundant buttons) */}
                          {onOpenCreatePreset && (
                            <div className="pt-2 mt-2 border-t border-cyan-500/20 flex flex-col gap-1">
                              <button
                                onClick={() => {
                                  setIsPresetMenuOpen(false);
                                  onOpenCreatePreset();
                                }}
                                className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg border border-dashed border-cyan-400/50 bg-cyan-950/30 text-cyan-300 text-[11px] font-semibold cursor-pointer"
                              >
                                <span>+ Create New Preset...</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}
                </div>
              ) : (
                <div className="flex-1" />
              )}

              {/* Right-hand corner: About project and coffee button (just icons, no labels) */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  id="btn-mobile-top-about"
                  onClick={onOpenAbout}
                  title="About Project"
                  aria-label="About Project"
                  className="p-2 rounded-xl bg-[#040816]/95 border border-cyan-500/35 text-cyan-300 hover:text-white shadow-lg backdrop-blur-xl active:scale-95 cursor-pointer"
                >
                  <Info className="w-4 h-4" />
                </button>
                <a
                  id="btn-mobile-top-coffee"
                  href="https://ko-fi.com/b123entertainment"
                  target="_blank"
                  rel="noreferrer noopener"
                  title="Support on Ko-fi"
                  aria-label="Buy me a coffee"
                  className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.35)] active:scale-95 cursor-pointer flex items-center justify-center"
                >
                  <Coffee className="w-4 h-4 text-slate-950 fill-amber-950/20" />
                </a>
              </div>
            </div>

            {/* Below top panel: Tour buttons (left) and Sort buttons (right) - ONLY when NOT on homescreen */}
            {!isHomeOpen && (
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-start justify-between gap-1.5 w-full">
                  {/* Left-hand side: Tour buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      id="btn-mobile-auto-tour"
                      onClick={handleToggleTour}
                      title={isTourPlaying ? 'Pause Auto Tour (T)' : 'Play Auto Tour (T)'}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl backdrop-blur-xl border text-xs font-mono font-semibold transition-all cursor-pointer shadow-lg active:scale-95 ${
                        isTourPlaying
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                          : 'bg-[#040816]/95 border-cyan-500/35 text-slate-200 hover:text-white'
                      }`}
                    >
                      {isTourPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
                      <span className="text-[11px]">{isTourPlaying ? 'Pause' : 'Tour'}</span>
                    </button>

                    {/* Tour pace dropdown */}
                    <div className="relative" ref={mobileTourPaceRef}>
                      <button
                        id="btn-mobile-tour-pace"
                        onClick={() => setIsTourPaceMenuOpen(!isTourPaceMenuOpen)}
                        title="Tour pace per star"
                        className="flex items-center gap-1 px-2 py-1.5 rounded-xl backdrop-blur-xl border border-cyan-500/35 bg-[#040816]/95 text-slate-300 text-xs font-mono active:scale-95 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-300 font-bold capitalize text-[11px]">{tourLength}</span>
                        <ChevronDown className={`w-3 h-3 text-cyan-400 transition-transform ${isTourPaceMenuOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isTourPaceMenuOpen && (
                        <div className="absolute left-0 top-full mt-2 w-36 bg-[#040817]/98 border border-cyan-500/40 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-2xl font-mono text-xs">
                          {(['short', 'medium', 'long'] as const).map((len) => (
                            <button
                              key={len}
                              onClick={() => {
                                setTourLength(len);
                                setIsTourPaceMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left capitalize ${
                                tourLength === len ? 'text-cyan-300 font-bold bg-cyan-950/80' : 'text-slate-300 hover:bg-white/5'
                              }`}
                            >
                              <span>{len}</span>
                              {tourLength === len && <Check className="w-3 h-3 text-cyan-400" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right-hand side: Sort buttons and Encyclopedia button placed just below */}
                  <div className="flex flex-col items-end gap-1.5">
                    {onSortChange && (
                      <div className="flex items-center gap-1" ref={mobileSortMenuRef}>
                        <div className="relative">
                          <button
                            id="btn-mobile-sort-metric"
                            onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                            title="Sort Metric"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl backdrop-blur-xl border border-cyan-500/35 bg-[#040816]/95 text-slate-200 text-xs font-mono active:scale-95 cursor-pointer"
                          >
                            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="text-cyan-300 font-bold capitalize text-[11px] max-w-[70px] truncate">
                              {getSortMetricLabel(sortKey)}
                            </span>
                            <ChevronDown className={`w-3 h-3 text-cyan-400 transition-transform ${isSortMenuOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isSortMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#040817]/98 border border-cyan-500/40 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-2xl font-mono text-xs">
                              <div className="text-[10px] text-slate-400 uppercase font-bold px-2 py-0.5 mb-1 border-b border-cyan-500/20">
                                Sort Metric
                              </div>
                              {[
                                { key: 'size', label: 'Size' },
                                { key: 'distance', label: 'Distance' },
                                { key: 'mass', label: 'Mass' },
                                { key: 'temperature', label: 'Temperature' },
                                { key: 'luminosity', label: 'Luminosity' },
                                { key: 'apparentMagnitude', label: 'Apparent Mag' },
                              ].map((item) => (
                                <button
                                  key={item.key}
                                  onClick={() => {
                                    onSortChange(item.key as StageSortKey);
                                    setIsSortMenuOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left ${
                                    sortKey === item.key ? 'text-cyan-300 font-bold bg-cyan-950/80' : 'text-slate-300 hover:bg-white/5'
                                  }`}
                                >
                                  <span>{item.label}</span>
                                  {sortKey === item.key && <Check className="w-3 h-3 text-cyan-400" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Direction toggle */}
                        <button
                          id="btn-mobile-sort-direction"
                          onClick={() => onToggleSortDirection && onToggleSortDirection()}
                          title={`Sort ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
                          className="px-2 py-1.5 rounded-xl backdrop-blur-xl border border-cyan-500/35 bg-[#040816]/95 text-cyan-400 text-xs font-mono font-bold active:scale-95 cursor-pointer"
                        >
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DESKTOP / TABLET TOP BAR (hidden md:flex) - ONLY when NOT on homescreen */}
          {!isHomeOpen && (
            <div className="hidden md:flex flex-wrap items-center justify-between gap-2 sm:gap-3 w-full">
            {/* Left Side: Brand Logo, Sort Order & Auto Tour Controls */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pointer-events-auto">
              {/* Starpedia 3D Square Logo & Home Navigation */}
              {onOpenHome && (
                <button
                  id="btn-desktop-top-home"
                  onClick={onOpenHome}
                  title="Return to Starpedia 3D Homepage (Home)"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#040816]/95 hover:bg-cyan-950/70 border border-cyan-500/35 hover:border-cyan-400 text-slate-200 hover:text-white shadow-lg backdrop-blur-xl active:scale-95 cursor-pointer transition-all shrink-0"
                >
                  <div className="w-5 h-5 aspect-square rounded-md border border-cyan-400/80 p-0.5 bg-[#020512] flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                    <img src="/starpedia_logo.svg" alt="Starpedia 3D Logo" className="w-full h-full object-contain aspect-square rounded-sm" />
                  </div>
                  <span className="font-['Orbitron',sans-serif] font-bold text-xs tracking-wider text-cyan-300 hidden xl:inline">
                    STARPEDIA <span className="text-white">3D</span>
                  </span>
                </button>
              )}

              {/* 3D Stage Canvas Sort Button & Toggles */}
              {onSortChange && (
            <div className="relative pointer-events-auto" ref={sortMenuRef}>
              <div className="flex items-center bg-[#040816]/90 backdrop-blur-xl rounded-xl border border-cyan-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] text-xs font-mono overflow-hidden">
                {/* Metric Toggle Button: clicks cycle through metrics */}
                <button
                  id="btn-stage-canvas-sort-metric"
                  onClick={handleCycleSortMetric}
                  title="Toggle Sort Metric (O): Size → Distance → Mass → Temperature → Luminosity → Apparent Magnitude"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-cyan-500/20 active:scale-95 transition-all cursor-pointer select-none"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-400 hidden sm:inline">Sort:</span>
                  <span className="text-cyan-300 font-bold capitalize">
                    {getSortMetricLabel(sortKey)}
                  </span>
                  <StageKbd variant="cyan" className="hidden lg:inline-flex">O</StageKbd>
                </button>

                <div className="w-[1px] h-4 bg-cyan-500/20" />

                {/* Direction Toggle Button: clicks toggle Asc / Desc */}
                <button
                  id="btn-stage-canvas-sort-direction"
                  onClick={() => onToggleSortDirection && onToggleSortDirection()}
                  title={`Toggle Sort Order (X): Currently ${sortDirection === 'asc' ? 'Ascending (Smallest / Lowest First)' : 'Descending (Largest / Highest First)'}`}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all cursor-pointer select-none"
                >
                  <span className="text-[11px] font-semibold text-cyan-400">
                    {sortDirection === 'asc' ? 'Asc ↑' : 'Desc ↓'}
                  </span>
                  <StageKbd variant="cyan" className="hidden lg:inline-flex">X</StageKbd>
                </button>

                <div className="w-[1px] h-4 bg-cyan-500/20" />

                {/* Dropdown Options Toggle */}
                <button
                  id="btn-stage-canvas-sort-dropdown"
                  onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                  title="Open Sort Metric & Order Menu"
                  className={`px-1.5 py-1.5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer ${
                    isSortMenuOpen ? 'text-cyan-300 bg-cyan-500/20' : ''
                  }`}
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSortMenuOpen ? 'rotate-180 text-cyan-300' : ''}`} />
                </button>
              </div>

              {/* Popover Menu to directly toggle / select metric and direction */}
              {isSortMenuOpen && (
                <div
                  id="menu-stage-canvas-sort-dropdown"
                  className="absolute left-0 top-full mt-2 w-64 bg-[#040817] border border-cyan-500/40 rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.85),0_0_20px_rgba(6,182,212,0.2)] p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl font-mono text-xs"
                >
                  <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Sort Metric</span>
                    <StageKbd variant="cyan">O</StageKbd>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    {[
                      { key: 'size', label: 'Size', desc: 'Physical diameter (km / D☉)' },
                      { key: 'distance', label: 'Distance', desc: 'Light-years from Earth' },
                      { key: 'mass', label: 'Mass', desc: 'Solar masses (M☉)' },
                      { key: 'temperature', label: 'Temperature', desc: 'Effective temperature (K)' },
                      { key: 'luminosity', label: 'Luminosity', desc: 'Solar luminosities (L☉)' },
                      { key: 'apparentMagnitude', label: 'Apparent Mag', desc: 'Brightness as seen from Earth (m)' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        id={`btn-canvas-sort-metric-${item.key}`}
                        onClick={() => {
                          onSortChange(item.key as StageSortKey);
                          setIsSortMenuOpen(false);
                        }}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all text-left cursor-pointer ${
                          sortKey === item.key
                            ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/30'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{item.label}</div>
                          <div className="text-[9px] text-slate-500 font-sans">{item.desc}</div>
                        </div>
                        {sortKey === item.key && (
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-cyan-500/20 my-2" />

                  <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Sort Order</span>
                    <StageKbd variant="cyan">X</StageKbd>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    <button
                      id="btn-canvas-sort-asc"
                      onClick={() => {
                        if (sortDirection !== 'asc' && onToggleSortDirection) onToggleSortDirection();
                        setIsSortMenuOpen(false);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-xs text-center transition-all cursor-pointer ${
                        sortDirection === 'asc'
                          ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/30'
                          : 'bg-[#020512] text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      Ascending ↑
                    </button>
                    <button
                      id="btn-canvas-sort-desc"
                      onClick={() => {
                        if (sortDirection !== 'desc' && onToggleSortDirection) onToggleSortDirection();
                        setIsSortMenuOpen(false);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-xs text-center transition-all cursor-pointer ${
                        sortDirection === 'desc'
                          ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/30'
                          : 'bg-[#020512] text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      Descending ↓
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Auto Tour & Pace Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5 pointer-events-auto">
            <button
              id="btn-auto-tour"
              onClick={handleToggleTour}
              title={isTourPlaying ? 'Pause Auto Tour (T)' : `Play Auto Tour (${sortKey.toUpperCase()} order) (T)`}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl backdrop-blur-xl border text-xs font-mono font-semibold transition-all cursor-pointer shadow-lg active:scale-95 ${
                isTourPlaying 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse' 
                  : 'bg-[#040816]/90 border-cyan-500/30 text-slate-300 hover:text-white hover:bg-cyan-500/20'
              }`}
            >
              {isTourPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400 shrink-0" /> : <Play className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
              <span className={isTabletDevice ? 'hidden' : 'hidden lg:inline'}>{isTourPlaying ? 'Playing' : 'Auto Tour'}</span>
              <StageKbd variant={isTourPlaying ? 'amber' : 'cyan'}>T</StageKbd>
            </button>

            {/* Tour Pace Dropdown Menu (Short / Medium / Long) */}
            <div className="relative pointer-events-auto" ref={tourPaceMenuRef}>
              <button
                id="btn-tour-pace-dropdown"
                onClick={() => setIsTourPaceMenuOpen((prev) => !prev)}
                title="Tour pace per star (P): Short, Medium, Long"
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl backdrop-blur-xl border text-xs font-mono transition-all cursor-pointer shadow-lg active:scale-95 ${
                  isTourPaceMenuOpen
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-[#040816]/90 border-cyan-500/30 text-slate-300 hover:text-white hover:bg-cyan-500/20'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className={`text-slate-400 ${isTabletDevice ? 'hidden' : 'hidden lg:inline'}`}>Pace:</span>
                <span className={`text-cyan-300 font-bold capitalize ${isTabletDevice ? 'hidden' : 'hidden lg:inline'}`}>{tourLength}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-cyan-400 transition-transform duration-200 ${isTourPaceMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isTourPaceMenuOpen && (
                <div
                  id="menu-tour-pace-dropdown"
                  className="absolute left-0 top-full mt-2 w-44 bg-[#040817] border border-cyan-500/40 rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.85),0_0_20px_rgba(6,182,212,0.2)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl font-mono text-xs"
                >
                  <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Tour Pace</span>
                    <StageKbd variant="cyan">P</StageKbd>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    {(['short', 'medium', 'long'] as const).map((len) => (
                      <button
                        key={len}
                        id={`btn-tour-pace-option-${len}`}
                        onClick={() => {
                          setTourLength(len);
                          setIsTourPaceMenuOpen(false);
                        }}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all text-left cursor-pointer capitalize ${
                          tourLength === len
                            ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/30'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span>{len}</span>
                        {tourLength === len && (
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {renderTopStageControls(false)}
      </div>
      )}
      </div>
      )}

      {/* Bottom Floating Control Caliper & Interactive Filmstrip - ONLY when NOT on homescreen */}
      {!isHomeOpen && (
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex flex-col gap-2 sm:gap-3 pointer-events-none z-20 max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] overflow-hidden">
        {/* Focused Star Info Bar - Only appears when a star is focused, NOT when hovered */}
        {activeFocusedStar && (
          <div 
            id="stage-focused-star-strip"
            className="flex items-center justify-between gap-1.5 sm:gap-3 bg-[#040816]/95 backdrop-blur-2xl px-2 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-cyan-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all pointer-events-auto w-full max-w-full min-w-0 overflow-hidden"
          >
            <div 
              className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 cursor-pointer select-none overflow-hidden"
              onClick={() => {
                if (onInspectStar) {
                  onInspectStar(activeFocusedStar);
                }
              }}
              title={`Click to open ${activeFocusedStar.name} dossier`}
            >
              <span 
                className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full aspect-square shrink-0 shadow-md ring-1 ring-white/30"
                style={{ backgroundColor: activeFocusedStar.colorHex, boxShadow: `0 0 10px ${activeFocusedStar.colorHex}` }}
              />
              
              <div className="flex items-center gap-x-1 sm:gap-x-2 text-[10px] sm:text-xs font-mono min-w-0 flex-1 overflow-hidden">
                <span className="font-bold text-white flex items-center gap-1 sm:gap-1.5 min-w-0 shrink overflow-hidden">
                  <span className="text-cyan-300 font-bold truncate min-w-0">
                    {activeFocusedStar.name}
                  </span>
                  <span className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 font-mono border border-cyan-500/30 shrink-0 whitespace-nowrap">
                    {activeFocusedStar.spectralType}
                  </span>
                </span>

                <span className="text-slate-300 shrink-0 whitespace-nowrap">
                  {formatPhysicalDiameter(activeFocusedStar.diameterKm, activeFocusedStar.diameterSolar).solarFormatted}
                </span>

                <span className="hidden sm:inline text-slate-400 shrink-0 whitespace-nowrap">
                  ({formatPhysicalDiameter(activeFocusedStar.diameterKm, activeFocusedStar.diameterSolar).metricSi})
                </span>

                <span className="hidden md:inline text-slate-500 shrink-0">•</span>

                <span className="hidden md:inline text-slate-300 shrink-0 whitespace-nowrap">
                  {activeFocusedStar.temperature.toLocaleString()} K
                </span>

                <span className={isTabletDevice ? 'hidden' : 'hidden lg:inline text-slate-500 shrink-0'}>•</span>

                <span className={isTabletDevice ? 'hidden' : 'hidden lg:inline text-slate-300 shrink-0 truncate'}>
                  {activeFocusedStar.constellation}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {onInspectStar && (
                <button
                  id="btn-preview-dossier"
                  onClick={() => onInspectStar(activeFocusedStar)}
                  title="Open Star Dossier (D)"
                  aria-label="Open Star Dossier"
                  className="p-1.5 sm:px-3 sm:py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] sm:text-xs font-mono font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 shadow-sm active:scale-95 shrink-0"
                >
                  <Menu className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden md:inline">Dossier</span>
                  <span className="hidden lg:inline-flex"><StageKbd variant="cyan">D</StageKbd></span>
                </button>
              )}
              <button
                id="btn-preview-unfocus"
                onClick={handleUnfocus}
                className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] sm:text-xs font-mono transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 active:scale-95 shrink-0"
                title="Unfocus Star (U)"
                aria-label="Unfocus Star"
              >
                <X className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline">Unfocus</span>
                <span className="hidden lg:inline-flex"><StageKbd variant="amber">U</StageKbd></span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Filmstrip & Controls Container */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* If isPresetSearchActive is true and controls not hidden, display the complete horizontal scrollable list on desktop/tablet/mobile */}
          {!areControlsHidden && isPresetSearchActive && (
            <div className="flex items-center gap-2 max-w-full overflow-x-auto pb-1.5 scrollbar-thin pr-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {filteredPresetStars.length > 0 ? (
                filteredPresetStars.map((star) => {
                  const originalIndex = sortedStars.findIndex((s) => s.id === star.id);
                  const isSelected = star.id === (focusedStarId ?? selectedStarId);
                  const metricText = getStarMetricFormatted(star);
                  return (
                    <button
                      key={star.id}
                      id={`btn-star-badge-${star.id}`}
                      onClick={() => {
                        if (isSelected && onInspectStar) {
                          onInspectStar(star);
                        } else {
                          handleFocusStar(star);
                        }
                      }}
                      title={`#${originalIndex + 1}: ${star.name} (${metricText}) - ${isSelected ? 'Click to Open Dossier' : 'Click to Focus & Pan'}`}
                      className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-xl border text-left transition-all shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-950/95 to-blue-950/95 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400 scale-105 font-bold'
                          : 'bg-[#040816]/85 border-cyan-500/20 text-slate-300 hover:border-cyan-500/40 hover:bg-[#0c142e]'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full aspect-square shrink-0 flex-shrink-0"
                        style={{ backgroundColor: star.colorHex, boxShadow: `0 0 8px ${star.colorHex}` }}
                      />
                      <div>
                        <div className="text-xs font-semibold leading-tight group-hover:text-cyan-300 transition-colors whitespace-nowrap flex items-center gap-1.5">
                          <span className="text-[10px] text-cyan-400/80 font-mono">#{originalIndex + 1}</span>
                          <span>{star.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                          {metricText}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#040816]/95 border border-cyan-500/40 text-xs font-mono text-slate-300 backdrop-blur-xl shadow-lg shrink-0">
                  <Search className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>No stars matching &quot;<span className="text-amber-300 font-semibold">{presetSearchQuery}</span>&quot; in this preset.</span>
                  <button
                    type="button"
                    onClick={() => setPresetSearchQuery('')}
                    className="text-cyan-400 hover:text-white underline font-semibold ml-1 cursor-pointer"
                  >
                    Show all ({sortedStars.length})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bottom Controls Bar: Left (Prev/Next), Center (Mobile Overlays), Right (Star list, More controls, Hide controls) */}
          <div className={`flex items-center ${areControlsHidden ? 'justify-end' : 'justify-between'} gap-1.5 sm:gap-3 w-full`}>
            {areControlsHidden ? (
              /* When controls are hidden: ONLY the Show Controls button on the lower right-hand side of the screen */
              <button
                id="btn-toggle-hide-controls"
                onClick={() => setAreControlsHidden(false)}
                title="Show All Controls (H)"
                aria-label="Show Controls"
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-mono font-semibold backdrop-blur-xl transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-1.5 bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] shrink-0 ml-auto"
              >
                <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
                <span className="hidden md:inline text-[11px]">Show controls</span>
                <StageKbd variant="cyan" className="hidden lg:inline-flex">H</StageKbd>
              </button>
            ) : (
              <>
                {/* 1. Left Side: Integrated Navigator with First (#1), Prev, Step Counter, Next, and Last (#N) */}
                <div className="flex items-center gap-0.5 sm:gap-1 bg-[#040816]/95 backdrop-blur-xl p-0.5 sm:p-1 rounded-xl border border-cyan-500/35 shadow-[0_4px_20px_rgba(0,0,0,0.6)] shrink-0 font-mono">
                  <button
                    id="btn-nav-first-star"
                    onClick={handlePanToSmallest}
                    title={`First Star (#1: ${sortedStars[0]?.name || 'First'}) (1)`}
                    aria-label="First Star (#1)"
                    className={`${isPresetSearchActive ? 'hidden md:flex' : 'flex'} px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-colors cursor-pointer items-center justify-center gap-1 text-[10px] sm:text-xs font-semibold shrink-0`}
                  >
                    <span className={isTabletDevice ? 'inline font-bold' : 'lg:hidden font-bold'}>#1</span>
                    <span className={isTabletDevice ? 'hidden' : 'hidden lg:inline'}>First (#1)</span>
                    <StageKbd variant="cyan" className={isTabletDevice ? 'hidden' : 'hidden lg:inline-flex'}>1</StageKbd>
                  </button>

                  <button
                    id="btn-nav-prev-star"
                    onClick={handlePrevStar}
                    title="Previous Star (←)"
                    aria-label="Previous Star"
                    className="p-1 sm:px-2 sm:py-1 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/20 active:scale-95 transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden md:inline text-[11px] font-mono font-semibold">Prev</span>
                    <StageKbd variant="cyan" className={isTabletDevice ? 'hidden' : 'hidden lg:inline-flex'}>←</StageKbd>
                  </button>

                  <span className="text-[10px] sm:text-xs font-mono px-1 sm:px-2 text-cyan-300 font-bold border-x border-cyan-500/30 shrink-0">
                    {activeStarIndex >= 0 ? `${activeStarIndex + 1} / ${sortedStars.length}` : 'All'}
                  </span>

                  <button
                    id="btn-nav-next-star"
                    onClick={handleNextStar}
                    title="Next Star (→)"
                    aria-label="Next Star"
                    className="p-1 sm:px-2 sm:py-1 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/20 active:scale-95 transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="hidden md:inline text-[11px] font-mono font-semibold">Next</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    <StageKbd variant="cyan" className={isTabletDevice ? 'hidden' : 'hidden lg:inline-flex'}>→</StageKbd>
                  </button>

                  <button
                    id="btn-nav-last-star"
                    onClick={handlePanToLargest}
                    title={`Last Star (#${sortedStars.length}: ${sortedStars[sortedStars.length - 1]?.name || 'Last'}) (9)`}
                    aria-label={`Last Star (#${sortedStars.length})`}
                    className={`${isPresetSearchActive ? 'hidden md:flex' : 'flex'} px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-slate-300 hover:text-amber-300 hover:bg-cyan-500/20 active:scale-95 transition-colors cursor-pointer items-center justify-center gap-1 text-[10px] sm:text-xs font-semibold shrink-0`}
                  >
                    <span className={isTabletDevice ? 'inline font-bold' : 'lg:hidden font-bold'}>#{sortedStars.length}</span>
                    <span className={isTabletDevice ? 'hidden' : 'hidden lg:inline'}>Last (#{sortedStars.length})</span>
                    <StageKbd variant="cyan" className={isTabletDevice ? 'hidden' : 'hidden lg:inline-flex'}>9</StageKbd>
                  </button>
                </div>

                {/* 2. Center: Condensed to single Encyclopedia button next to presets dropdown on mobile */}
                {(onOpenFrontpage || onOpenCatalog || onOpenHRDiagram || onOpenConstellations) && (
                  <div className="hidden items-center gap-0.5 sm:gap-1 bg-[#040816]/95 backdrop-blur-xl p-0.5 sm:p-1 rounded-xl border border-cyan-500/35 shadow-[0_4px_20px_rgba(0,0,0,0.6)] shrink-0">
                    {onOpenFrontpage && (
                      <button
                        id="btn-mobile-bottom-frontpage"
                        onClick={onOpenFrontpage}
                        title="What is a Star? (Encyclopedia Frontpage)"
                        aria-label="What is a Star?"
                        className="p-1 sm:p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-cyan-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                      >
                        <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                      </button>
                    )}
                    {onOpenCatalog && (
                      <button
                        id="btn-mobile-bottom-catalog"
                        onClick={onOpenCatalog}
                        title="Stellar Catalog (Encyclopedia)"
                        aria-label="Stellar Catalog"
                        className="p-1 sm:p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-cyan-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                      >
                        <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                      </button>
                    )}
                    {onOpenHRDiagram && (
                      <button
                        id="btn-mobile-bottom-hr"
                        onClick={onOpenHRDiagram}
                        title="H-R Diagram (Encyclopedia)"
                        aria-label="H-R Diagram"
                        className="p-1 sm:p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-cyan-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                      >
                        <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                      </button>
                    )}
                    {onOpenConstellations && (
                      <button
                        id="btn-mobile-bottom-constellations"
                        onClick={onOpenConstellations}
                        title="Constellation Guide (Encyclopedia)"
                        aria-label="Constellation Guide"
                        className="p-1 sm:p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-cyan-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                      >
                        <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                      </button>
                    )}
                  </div>
                )}

                {/* 3. Lower Right-hand Side: Star list, stage controls, and hide controls (from left to right) */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  {/* Mobile Right: Search stars / Star list & Stage controls */}
                  <div className="flex md:hidden items-center gap-1 shrink-0">
                    {/* Search stars inside preset button (expands into search bar) */}
                    {!isPresetSearchActive ? (
                      <button
                        id="btn-mobile-search-stars"
                        onClick={() => setIsPresetSearchActive(true)}
                        className="flex items-center gap-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-xl border text-xs font-mono font-semibold backdrop-blur-xl transition-all cursor-pointer shadow-lg active:scale-95 shrink-0 bg-[#040816]/95 border-cyan-500/35 text-slate-200 hover:text-white hover:border-cyan-400"
                        title={`Search Stars in Preset (${sortedStars.length}) (B)`}
                        aria-label={`Search Stars in Preset (${sortedStars.length})`}
                      >
                        <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="text-[11px]">Search</span>
                      </button>
                    ) : (
                      <div
                        id="container-mobile-search-bar"
                        className="flex items-center gap-1.5 px-2 py-1 rounded-xl border border-cyan-400 bg-cyan-950/95 text-xs font-mono backdrop-blur-xl shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all duration-300 flex-1 min-w-[120px] max-w-[220px]"
                      >
                        <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <input
                          ref={mobileSearchInputRef}
                          type="text"
                          value={presetSearchQuery}
                          onChange={(e) => setPresetSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              e.stopPropagation();
                              if (presetSearchQuery) {
                                setPresetSearchQuery('');
                              } else {
                                setIsPresetSearchActive(false);
                              }
                            } else if (e.key === 'Enter') {
                              e.stopPropagation();
                              if (filteredPresetStars.length > 0) {
                                handleFocusStar(filteredPresetStars[0]);
                              }
                            }
                          }}
                          placeholder={`Search (${sortedStars.length})...`}
                          className="bg-transparent text-white text-[11px] font-mono placeholder:text-slate-400 focus:outline-none w-full min-w-0"
                          autoFocus
                        />
                        {presetSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setPresetSearchQuery('')}
                            title="Clear search"
                            className="p-0.5 text-slate-400 hover:text-white shrink-0 cursor-pointer"
                            aria-label="Clear search"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setIsPresetSearchActive(false);
                            setPresetSearchQuery('');
                          }}
                          title="Close search"
                          className="p-0.5 text-cyan-400 hover:text-white shrink-0 cursor-pointer"
                          aria-label="Close search"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Stage controls button */}
                    <div className="relative shrink-0" ref={mobileCompactMenuRef}>
                      <button
                        id="btn-mobile-compact-controls"
                        onClick={() => setIsMobileCompactMenuOpen((prev) => !prev)}
                        title="Stage Controls"
                        aria-label="Stage Controls"
                        className={`p-1 sm:p-1.5 rounded-xl backdrop-blur-xl border text-xs font-mono transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center shrink-0 ${
                          isMobileCompactMenuOpen
                            ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                            : 'bg-[#040816]/95 border-cyan-500/35 text-slate-300 hover:text-white'
                        }`}
                      >
                        <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                      </button>

                      {isMobileCompactMenuOpen && (
                        <div
                          id="menu-mobile-compact-controls"
                          className="absolute right-0 bottom-full mb-2 w-56 bg-[#040817]/98 border border-cyan-500/40 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.95),0_0_20px_rgba(6,182,212,0.25)] p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl font-mono text-xs flex flex-col gap-1.5"
                        >
                          <div className="text-[10px] text-slate-400 uppercase font-bold px-2 py-0.5 border-b border-cyan-500/20 flex items-center justify-between">
                            <span>Stage Controls</span>
                            <button onClick={() => setIsMobileCompactMenuOpen(false)} className="text-slate-400 hover:text-white cursor-pointer p-0.5">
                              <X className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Zoom View: in/out */}
                          <div className="flex items-center justify-between px-2 py-1 bg-[#060c22] rounded-lg border border-cyan-500/20">
                            <span className="text-slate-300 text-[11px]">Zoom View</span>
                            <div className="flex items-center gap-1">
                              <button
                                id="btn-mobile-zoom-out"
                                onClick={() => handleZoom('out')}
                                title="Zoom Out"
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#020512] text-slate-300 hover:text-white border border-cyan-500/30 text-sm font-bold active:scale-90 cursor-pointer"
                              >
                                −
                              </button>
                              <button
                                id="btn-mobile-zoom-in"
                                onClick={() => handleZoom('in')}
                                title="Zoom In"
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#020512] text-slate-300 hover:text-white border border-cyan-500/30 text-sm font-bold active:scale-90 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Spin Stars Toggle */}
                          <button
                            id="btn-mobile-compact-spin"
                            onClick={() => setIsAutoRotating(!isAutoRotating)}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                              isAutoRotating ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-300 hover:bg-white/5'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin-slow text-cyan-400' : 'text-slate-400'}`} />
                              <span>Spin Stars</span>
                            </span>
                            {isAutoRotating && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                          </button>

                          {/* Floor Grid Toggle */}
                          <button
                            id="btn-mobile-compact-grid"
                            onClick={() => setShowGrid(!showGrid)}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                              showGrid ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-300 hover:bg-white/5'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <Grid className={`w-3.5 h-3.5 ${showGrid ? 'text-cyan-400' : 'text-slate-400'}`} />
                              <span>Floor Grid</span>
                            </span>
                            {showGrid && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                          </button>

                          {/* Wireframe Toggle */}
                          <button
                            id="btn-mobile-compact-wire"
                            onClick={() => setWireframe(!wireframe)}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                              wireframe ? 'bg-amber-950/80 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-300 hover:bg-white/5'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <Layers className={`w-3.5 h-3.5 ${wireframe ? 'text-amber-400' : 'text-slate-400'}`} />
                              <span>Wireframe</span>
                            </span>
                            {wireframe && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                          </button>

                          {/* Sound Effects Toggle */}
                          <button
                            id="btn-mobile-compact-sound"
                            onClick={() => soundEffects.toggleSound()}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                              isSoundOn ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-300 hover:bg-white/5'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {isSoundOn ? (
                                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                              ) : (
                                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span>Sound Effects</span>
                            </span>
                            {isSoundOn && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                          </button>

                          {/* Quick Viewport Reset & Fit */}
                          <div className="grid grid-cols-2 gap-1 pt-1 border-t border-cyan-500/20">
                            <button
                              id="btn-mobile-compact-reset"
                              onClick={handleResetCamera}
                              className="px-2 py-1 rounded bg-[#060c22] hover:bg-cyan-950/60 text-cyan-300 text-[10px] text-center border border-cyan-500/25 cursor-pointer"
                            >
                              Reset Cam
                            </button>
                            <button
                              id="btn-mobile-compact-fit"
                              onClick={handleFitAllStars}
                              className="px-2 py-1 rounded bg-[#060c22] hover:bg-cyan-950/60 text-slate-300 text-[10px] text-center border border-slate-700 cursor-pointer"
                            >
                              Fit All
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Desktop Right items: regular "Show all stars" / "Hide stars" button + Shortcuts */}
                  <div className="hidden md:flex items-center gap-2">
                    {!isPresetSearchActive ? (
                      <button
                        id="btn-toggle-search-stars"
                        onClick={() => setIsPresetSearchActive(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold backdrop-blur-xl transition-all cursor-pointer shadow-lg active:scale-95 bg-[#040816]/90 hover:bg-[#091330] border-cyan-500/30 text-slate-200 hover:text-white hover:border-cyan-400 shrink-0"
                        title={`Search Stars in Preset (${sortedStars.length}) (B)`}
                        aria-label={`Search Stars in Preset (${sortedStars.length})`}
                      >
                        <Search className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Search stars ({sortedStars.length})</span>
                        <StageKbd variant="cyan">B</StageKbd>
                      </button>
                    ) : (
                      <div
                        id="container-desktop-search-bar"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-cyan-400 bg-cyan-950/95 text-xs font-mono backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all duration-300 w-64 md:w-72 lg:w-80 shrink-0"
                      >
                        <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <input
                          ref={desktopSearchInputRef}
                          type="text"
                          value={presetSearchQuery}
                          onChange={(e) => setPresetSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              e.stopPropagation();
                              if (presetSearchQuery) {
                                setPresetSearchQuery('');
                              } else {
                                setIsPresetSearchActive(false);
                              }
                            } else if (e.key === 'Enter') {
                              e.stopPropagation();
                              if (filteredPresetStars.length > 0) {
                                handleFocusStar(filteredPresetStars[0]);
                              }
                            }
                          }}
                          placeholder={`Search ${sortedStars.length} stars in preset...`}
                          className="bg-transparent text-white text-xs font-mono placeholder:text-slate-400 focus:outline-none w-full min-w-0"
                          autoFocus
                        />
                        {presetSearchQuery.trim() !== '' && (
                          <span className="text-[10px] font-mono text-cyan-300 font-semibold px-1.5 py-0.5 rounded bg-cyan-900/60 border border-cyan-500/40 shrink-0">
                            {filteredPresetStars.length}
                          </span>
                        )}
                        {presetSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setPresetSearchQuery('')}
                            title="Clear search text"
                            className="p-0.5 text-slate-400 hover:text-white shrink-0 cursor-pointer"
                            aria-label="Clear search text"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setIsPresetSearchActive(false);
                            setPresetSearchQuery('');
                          }}
                          title="Close search (Esc)"
                          className="flex items-center gap-1 text-slate-400 hover:text-white shrink-0 cursor-pointer pl-1 border-l border-cyan-500/30"
                          aria-label="Close search"
                        >
                          <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                          <StageKbd variant="cyan" className="text-[9px]">Esc</StageKbd>
                        </button>
                      </div>
                    )}

                    <div className="bg-[#040816]/90 backdrop-blur-xl px-3.5 py-1.5 rounded-xl border border-cyan-500/20 text-[11px] text-slate-400 font-mono hidden xl:flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          <StageKbd variant="cyan">←</StageKbd>
                          <StageKbd variant="cyan">→</StageKbd>
                        </div>
                        <span>Step</span>
                      </div>
                      <span className="text-cyan-500/30">•</span>
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          <StageKbd variant="cyan">1</StageKbd>
                          <StageKbd variant="cyan">9</StageKbd>
                        </div>
                        <span>#1/#N</span>
                      </div>
                      <span className="text-cyan-500/30">•</span>
                      <div className="flex items-center gap-1.5">
                        <StageKbd variant="amber">U</StageKbd>
                        <span>Unfocus</span>
                      </div>
                      <span className="text-cyan-500/30">•</span>
                      <div className="flex items-center gap-1.5">
                        <StageKbd variant="cyan">F</StageKbd>
                        <span>Full</span>
                      </div>
                      <span className="text-cyan-500/30">•</span>
                      <div className="flex items-center gap-1.5">
                        <StageKbd variant="cyan">H</StageKbd>
                        <span>Hide</span>
                      </div>
                    </div>

                    <button
                      id="btn-open-shortcuts-help"
                      onClick={() => setShowShortcutsHelp(true)}
                      title="Keyboard Shortcuts (?)"
                      className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#040816]/90 hover:bg-cyan-950/50 border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono text-cyan-300 hover:text-white backdrop-blur-xl transition-all cursor-pointer shadow-md"
                    >
                      <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Shortcuts</span>
                      <StageKbd variant="cyan">?</StageKbd>
                    </button>
                  </div>

                  {/* Hide controls button (Always rightmost: after more controls on mobile, after shortcuts on desktop) */}
                  {/* On mobile: shown ONLY as icon. On desktop: icon + text + shortcut badge */}
                  <button
                    id="btn-toggle-hide-controls"
                    onClick={() => setAreControlsHidden(true)}
                    title="Hide Controls (H)"
                    aria-label="Hide Controls"
                    className="p-1 sm:p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-mono font-semibold backdrop-blur-xl transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-1.5 bg-[#040816]/90 hover:bg-[#091330] border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 shrink-0"
                  >
                    <EyeOff className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 text-slate-400 hover:text-cyan-300 shrink-0" />
                    <span className="hidden md:inline text-[11px]">Hide controls</span>
                    <StageKbd variant="neutral" className="hidden lg:inline-flex">H</StageKbd>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Keyboard Shortcuts Guide Modal */}
      {!isHomeOpen && showShortcutsHelp && (
        <div 
          className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowShortcutsHelp(false)}
        >
          <div 
            className="bg-[#040816] border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-slate-100 flex flex-col gap-4 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">3D Stage Shortcuts</h3>
                  <p className="text-xs text-slate-400 font-mono">Dedicated controls for every 3D stage function</p>
                </div>
              </div>
              <button
                id="btn-close-shortcuts-modal"
                onClick={() => setShowShortcutsHelp(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close Shortcuts Guide (?)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono max-h-[60vh] overflow-y-auto pr-1">
              <div className="space-y-2.5 bg-slate-900/60 p-3.5 rounded-xl border border-cyan-500/15">
                <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold mb-1">Navigation</div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Previous / Next Star</span>
                  <div className="flex gap-1">
                    <StageKbd variant="cyan">←</StageKbd>
                    <StageKbd variant="cyan">→</StageKbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Alternative Step</span>
                  <div className="flex gap-1">
                    <StageKbd variant="cyan">[</StageKbd>
                    <StageKbd variant="cyan">]</StageKbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Baseline Origin (0,0)</span>
                  <StageKbd variant="cyan">0</StageKbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">First / Last Star</span>
                  <div className="flex gap-1">
                    <StageKbd variant="cyan">1</StageKbd>
                    <StageKbd variant="cyan">9</StageKbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 font-semibold">Unfocus Star</span>
                  <StageKbd variant="amber">U</StageKbd>
                </div>
              </div>

              <div className="space-y-2.5 bg-slate-900/60 p-3.5 rounded-xl border border-cyan-500/15">
                <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold mb-1">Camera & Stage</div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Zoom In / Out</span>
                  <div className="flex gap-1">
                    <StageKbd variant="cyan">+</StageKbd>
                    <StageKbd variant="cyan">−</StageKbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Reset Camera</span>
                  <StageKbd variant="cyan">R</StageKbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Fit All Stars</span>
                  <StageKbd variant="cyan">A</StageKbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Toggle Fullscreen</span>
                  <StageKbd variant="cyan">F</StageKbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Toggle Sound Effects (SFX)</span>
                  <StageKbd variant="cyan">M</StageKbd>
                </div>
              </div>

              <div className="space-y-2.5 bg-slate-900/60 p-3.5 rounded-xl border border-cyan-500/15">
                <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold mb-1">Display & Lists</div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Open Encyclopedia</span>
                  <StageKbd variant="cyan">E</StageKbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Search Stars / Show List</span>
                  <StageKbd variant="cyan">B</StageKbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Toggle Auto Tour</span>
                  <StageKbd variant="cyan">T</StageKbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Cycle Tour Pace (Short/Med/Long)</span>
                  <StageKbd variant="cyan">P</StageKbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Toggle Star Spin</span>
                  <StageKbd variant="cyan">S</StageKbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Toggle Wireframe</span>
                  <StageKbd variant="amber">W</StageKbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Toggle Floor Grid</span>
                  <StageKbd variant="cyan">G</StageKbd>
                </div>
              </div>

              <div className="space-y-2.5 bg-slate-900/60 p-3.5 rounded-xl border border-cyan-500/15">
                <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold mb-1">Details & Modes</div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Star Dossier Details</span>
                  <StageKbd variant="cyan">D</StageKbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Cycle Sort Metric (Size/Dist/Mass/Temp/Lum/Mag)</span>
                  <StageKbd variant="cyan">O</StageKbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Toggle Sort Order (Asc/Desc)</span>
                  <StageKbd variant="cyan">X</StageKbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Toggle Catalog Spiral / Normal</span>
                  <StageKbd variant="amber">L</StageKbd>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <StageKbd variant="neutral">Esc</StageKbd>
                <span>exits fullscreen mode cleanly.</span>
              </span>
              <button
                onClick={() => setShowShortcutsHelp(false)}
                className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition-all cursor-pointer shadow-md"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};
