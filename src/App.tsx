import React, { useState, useMemo, useEffect } from 'react';
import { StarData, FilterState, SpectralClass, StellarStage, PresetComparison, StageSortKey, SortDirection } from './types';
import { STARS_CATALOG, PRESET_COMPARISONS, resolveStarId } from './data/stars';
import { MULTIPLE_STAR_SYSTEMS } from './data/multipleStarSystemsData';
import { formatPhysicalDiameter } from './utils/formatters';
import { DIAMETER_MIN, DIAMETER_MAX, DISTANCE_MIN, DISTANCE_MAX } from './utils/stellarCatalogFilters';
import { StarCanvas3D } from './components/StarCanvas3D';
import { StarCard } from './components/StarCard';
import { StarDetailModal } from './components/StarDetailModal';
import { HRDiagram } from './components/HRDiagram';
import { StarFilterPanel } from './components/StarFilterPanel';
import { StarEncyclopediaFrontpage } from './components/StarEncyclopediaFrontpage';
import { ConstellationGuide } from './components/ConstellationGuide';
import { HomeScreen } from './components/HomeScreen';
import { StageAndPresetModal } from './components/StageAndPresetModal';
import { AboutPage } from './components/AboutPage';
import { StellarSuikaGame } from './components/StellarSuikaGame';
import { PresetSlider } from './components/PresetSlider';
import { EncyclopediaDropdown } from './components/EncyclopediaDropdown';
import { StellarDiscoveryGuide } from './components/StellarDiscoveryGuide';
import { StarDot2D } from './components/StarDot2D';
import { soundEffects } from './utils/soundEffects';
import { spaceAudio } from './utils/spaceAudioEngine';
import { AmbientSoundToggle } from './components/AmbientSoundToggle';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { KeyboardShortcutsHelpModal } from './components/KeyboardShortcutsHelpModal';
import { StellarSystemCatalog } from './components/StellarSystemCatalog';
import { StellarSystemDossierModal } from './components/StellarSystemDossierModal';
import { MultipleStarSystemData } from './data/multipleStarSystemsData';
import { LoadingSprite } from './components/LoadingSprite';

import { 
  Sparkles, 
  Sun, 
  Orbit, 
  Scale, 
  Grid, 
  Layers, 
  Compass, 
  BarChart2, 
  Sliders, 
  Info,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Flame,
  Search,
  Heart,
  BookOpen,
  Bookmark,
  Home,
  Monitor,
  AlertTriangle,
  Coffee,
  ExternalLink,
  X,
  Maximize2,
  Minimize2,
  Telescope,
  Keyboard,
  Share2
} from 'lucide-react';

export default function App() {
  // Homepage Overlay State - Open on startup by default
  const [isHomeOpen, setIsHomeOpen] = useState<boolean>(true);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    const handleLoad = () => setAssetsLoaded(true);

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Safety fallback timeout
    const timeout = setTimeout(handleLoad, 2000);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(timeout);
    };
  }, []);

  // Integrated 3D Mode Overlays: Frontpage (What is a star?), Catalog, H-R Diagram, Classification Guide, Constellation Guide, Discovery
  const [activeOverlay, setActiveOverlay] = useState<'frontpage' | 'catalog' | 'stellar-systems' | 'hr-diagram' | 'guide' | 'constellations' | 'discovery' | 'nomenclature' | null>(null);
  const [catalogSubTab, setCatalogSubTab] = useState<'stars' | 'systems'>('stars');
  const [frontpageInitialSection, setFrontpageInitialSection] = useState<'what-is-a-star' | 'spectral-classes' | 'luminosity-stages' | 'life-cycles' | 'myths' | 'quiz'>('what-is-a-star');

  // Dedicated initial mode when opening an individual Star Detail Modal
  const [detailModalInitialMode, setDetailModalInitialMode] = useState<'compare-sun' | 'compare-earth' | 'solar-system' | undefined>(undefined);

  // Dedicated Independent Stellar System Dossier Modal State
  const [selectedSystemDossier, setSelectedSystemDossier] = useState<MultipleStarSystemData | null>(null);

  // Dedicated Separate Overlay for About App
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // Easter Egg Suika Minigame State
  const [isSuikaOpen, setIsSuikaOpen] = useState<boolean>(false);

  // Fullscreen page state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => console.warn(err));
      } else {
        document.exitFullscreen().catch((err) => console.warn(err));
      }
    } catch (e) {
      console.warn('Fullscreen toggle failed:', e);
    }
  };

  // Custom Presets State persisted in localStorage
  const [customPresets, setCustomPresets] = useState<PresetComparison[]>(() => {
    try {
      const saved = localStorage.getItem('cosmic_custom_presets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((p) => ({
            ...p,
            desc: typeof p.desc === 'string' ? p.desc.slice(0, 100) : p.desc,
          }));
        }
      }
    } catch (e) {
      console.error('Failed to parse custom presets from localStorage', e);
    }
    return [];
  });

  const [stagePresetModalState, setStagePresetModalState] = useState<{
    isOpen: boolean;
    mode: 'stage' | 'preset';
    presetToEdit?: PresetComparison | null;
  }>({
    isOpen: false,
    mode: 'stage',
    presetToEdit: null,
  });

  const allPresets = useMemo(() => {
    return [...PRESET_COMPARISONS, ...customPresets];
  }, [customPresets]);

  // Default preset: Nearest stars from Earth (default)
  const [selectedStars, setSelectedStars] = useState<StarData[]>(() => {
    const defaultPreset = PRESET_COMPARISONS.find((p) => p.id === 'nearest-stars') || PRESET_COMPARISONS[0];
    if (defaultPreset) {
      return defaultPreset.starIds
        .map((id) => STARS_CATALOG.find((s) => s.id === id))
        .filter(Boolean) as StarData[];
    }
    return STARS_CATALOG.slice(0, 10);
  });

  const [activePresetId, setActivePresetId] = useState<string | null>('nearest-stars');
  const [focusedStar, setFocusedStar] = useState<StarData | null>(null);
  const [detailModalStar, setDetailModalStar] = useState<StarData | null>(null);

  // Command Palette & Keyboard Shortcuts modal states
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState<boolean>(false);

  // Global Keyboard Shortcuts listener:
  // - Escape: closes topmost modal
  // - ⌘K / Ctrl+K / /: opens Command Palette & Star Search
  // - ?: opens Keyboard Shortcuts Cheat Sheet
  // - M: toggles ambient cosmic space audio
  // - 1-5: jumps to primary subsystems
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      // Escape closes topmost modal (star search is re-mapped away from Esc)
      if (e.key === 'Escape') {
        if (isShortcutsHelpOpen) {
          setIsShortcutsHelpOpen(false);
          return;
        }
        if (isSuikaOpen) {
          soundEffects.play('closeModal');
          setIsSuikaOpen(false);
          return;
        }
        if (detailModalStar) {
          soundEffects.play('closeModal');
          setDetailModalStar(null);
          return;
        }
        if (isAboutOpen) {
          soundEffects.play('closeModal');
          setIsAboutOpen(false);
          return;
        }
        if (activeOverlay) {
          soundEffects.play('closeModal');
          setActiveOverlay(null);
          return;
        }
        if (isHomeOpen) {
          soundEffects.play('closeModal');
          setIsHomeOpen(false);
          return;
        }
      }

      // If typing in an input, ignore global hotkeys
      if (isInput) return;

      // Command Palette: ⌘K, Ctrl+K, or /
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Shortcuts Help: ? or Shift+/
      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsHelpOpen((prev) => !prev);
        return;
      }

      // Ambient Audio toggle: M
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        spaceAudio.toggleMute();
        return;
      }

      // Tab navigation
      if (e.key === '1') {
        setIsHomeOpen(true);
        setActiveOverlay(null);
      } else if (e.key === '2') {
        setIsHomeOpen(false);
        setActiveOverlay('catalog');
      } else if (e.key === '3') {
        setIsHomeOpen(false);
        setActiveOverlay('hr-diagram');
      } else if (e.key === '4') {
        setIsHomeOpen(false);
        setFrontpageInitialSection('life-cycles');
        setActiveOverlay('frontpage');
      } else if (e.key === '5') {
        setIsHomeOpen(false);
        setFrontpageInitialSection('spectral-classes');
        setActiveOverlay('guide');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isCommandPaletteOpen,
    isShortcutsHelpOpen,
    isSuikaOpen,
    detailModalStar,
    isAboutOpen,
    activeOverlay,
    isHomeOpen,
  ]);

  const handleCommandNavigate = (tabId: string) => {
    if (tabId === 'overview') {
      setIsHomeOpen(true);
      setActiveOverlay(null);
    } else if (tabId === 'stellar-systems') {
      setIsHomeOpen(false);
      setCatalogSubTab('systems');
      setActiveOverlay('catalog');
    } else if (tabId === 'explorer' || tabId === 'catalog') {
      setIsHomeOpen(false);
      setCatalogSubTab('stars');
      setActiveOverlay('catalog');
    } else if (tabId === 'hr-diagram') {
      setIsHomeOpen(false);
      setActiveOverlay('hr-diagram');
    } else if (tabId === 'lifecycle') {
      setIsHomeOpen(false);
      setFrontpageInitialSection('life-cycles');
      setActiveOverlay('frontpage');
    } else if (tabId === 'remnants') {
      setIsHomeOpen(false);
      setActiveOverlay('guide');
    } else if (tabId === 'game') {
      setIsSuikaOpen(true);
    }
  };

  // 3D Canvas Settings - Default to 1:1 accurate real scale
  const [showCorona, setShowCorona] = useState<boolean>(true);
  const [stageSortKey, setStageSortKey] = useState<StageSortKey>('distance');
  const [stageSortDirection, setStageSortDirection] = useState<SortDirection>('asc');

  // Search & Filtering State
  const initialFilterState: FilterState = {
    searchQuery: '',
    constellation: '',
    spectralClasses: [],
    stellarStages: [],
    minDiameter: DIAMETER_MIN,
    maxDiameter: DIAMETER_MAX,
    minTemp: 0,
    maxTemp: 120000,
    minDistance: DISTANCE_MIN,
    maxDistance: DISTANCE_MAX,
    sortBy: 'diameter-desc',
    onlyNakedEye: false,
    hasExoplanetsOnly: false,
  };

  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);

  // Phone Device Detection & Advisory (Tablets >= 768px have full access)
  const checkIsPhone = () => {
    if (typeof window === 'undefined') return false;
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    // Mobile phones user agents (note: Android tablets do not contain "Mobile", and iPads contain "iPad" or Mac with touch)
    const isPhoneUA = /iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || 
      (/Android/i.test(ua) && /Mobile/i.test(ua));
    
    // Narrow screens (< 768px) are treated as phones
    const isNarrowWidth = window.innerWidth < 768;
    // Short screen height (mobile device in landscape: height < 550px and width < 1024px)
    const isShortLandscape = window.innerHeight < 550 && window.innerWidth < 1024;
    // Phone held in landscape where width > 768 but height is phone-sized (< 600px)
    const isPhoneDimensions = (isPhoneUA && Math.min(window.innerWidth, window.innerHeight) < 600) || isShortLandscape;

    return isNarrowWidth || isPhoneDimensions;
  };

  // Tablet Device Detection: supports both portrait and landscape tablet orientations
  const checkIsTablet = (): boolean => {
    if (typeof window === 'undefined') return false;
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isIPad = /iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroidTablet = /Android/i.test(ua) && !/Mobile/i.test(ua);
    const minDim = Math.min(window.innerWidth, window.innerHeight);
    const maxDim = Math.max(window.innerWidth, window.innerHeight);
    const isTabletDimensions = minDim >= 600 && minDim <= 1000 && maxDim <= 1366;
    const hasCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

    return isIPad || isAndroidTablet || (hasCoarsePointer && isTabletDimensions) || (isTabletDimensions && !checkIsPhone());
  };

  const [isMobile, setIsMobile] = useState<boolean>(checkIsPhone);
  const [isTablet, setIsTablet] = useState<boolean>(checkIsTablet);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(checkIsPhone());
      setIsTablet(checkIsTablet());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Filtered & Sorted Stars Catalog
  const filteredStars = useMemo(() => {
    let result = STARS_CATALOG.filter((star) => {
      // Search query: indexed comprehensively across star name, Bayer designation, constellation, spectral type, and stage
      if (filterState.searchQuery.trim()) {
        const q = filterState.searchQuery.toLowerCase().trim();
        const matchesSearch =
          star.name.toLowerCase().includes(q) ||
          (star.bayerDesignation && star.bayerDesignation.toLowerCase().includes(q)) ||
          (star.flamsteedDesignation && star.flamsteedDesignation.toLowerCase().includes(q)) ||
          (star.gouldDesignation && star.gouldDesignation.toLowerCase().includes(q)) ||
          (star.constellation && star.constellation.toLowerCase().includes(q)) ||
          (star.spectralType && star.spectralType.toLowerCase().includes(q)) ||
          (star.stellarStage && star.stellarStage.toLowerCase().includes(q)) ||
          (star.alternateNames && star.alternateNames.some((alt) => alt.toLowerCase().includes(q)));
        if (!matchesSearch) {
          return false;
        }
      }

      // Constellation
      if (filterState.constellation && star.constellation !== filterState.constellation) {
        return false;
      }

      // Spectral Class
      if (filterState.spectralClasses.length > 0) {
        const matchesClass = filterState.spectralClasses.some((sc) => {
          if (sc === 'LBV') {
            return star.spectralClass === 'LBV' || star.stellarStage === 'Luminous Blue Variable';
          }
          return star.spectralClass === sc;
        });
        if (!matchesClass) {
          return false;
        }
      }

      // Stellar Stage
      if (filterState.stellarStages.length > 0) {
        const matchesStage = filterState.stellarStages.some((selectedStage) => {
          if (selectedStage === 'Main Sequence' && (star.stellarStage === 'Main Sequence' || star.stellarStage === 'Main Sequence Dwarf')) {
            return true;
          }
          return star.stellarStage === selectedStage;
        });
        if (!matchesStage) {
          return false;
        }
      }

      // Diameter range covers the full catalog bounds (0.00001 to 2,150 D☉).
      if (star.diameterSolar < (filterState.minDiameter ?? DIAMETER_MIN) ||
          star.diameterSolar > (filterState.maxDiameter ?? DIAMETER_MAX)) {
        return false;
      }

      // Distance range covers the Solar System through the catalog's most distant entry.
      if (star.distanceLy < (filterState.minDistance ?? DISTANCE_MIN) ||
          star.distanceLy > (filterState.maxDistance ?? DISTANCE_MAX)) {
        return false;
      }

      // Naked eye
      if (filterState.onlyNakedEye && star.apparentMagnitude > 6.0) {
        return false;
      }

      // Exoplanet hosts only
      if (filterState.hasExoplanetsOnly && !star.exoplanetSystem.hasExoplanets) {
        return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      switch (filterState.sortBy) {
        case 'diameter-desc':
          return b.diameterSolar - a.diameterSolar;
        case 'diameter-asc':
          return a.diameterSolar - b.diameterSolar;
        case 'temp-desc':
          return b.temperature - a.temperature;
        case 'temp-asc':
          return a.temperature - b.temperature;
        case 'distance-asc':
          return a.distanceLy - b.distanceLy;
        case 'distance-desc':
          return b.distanceLy - a.distanceLy;
        case 'luminosity-desc':
          return b.luminositySolar - a.luminositySolar;
        case 'luminosity-asc':
          return a.luminositySolar - b.luminositySolar;
        case 'mass-desc':
          return b.massSolar - a.massSolar;
        case 'mass-asc':
          return a.massSolar - b.massSolar;
        case 'exoplanets-desc':
          return b.exoplanetSystem.confirmedCount - a.exoplanetSystem.confirmedCount;
        case 'age-desc':
          return (b.estimatedAgeMyr || 0) - (a.estimatedAgeMyr || 0);
        case 'age-asc':
          return (a.estimatedAgeMyr || 0) - (b.estimatedAgeMyr || 0);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    // Deduplicate result by canonical ID so duplicate stars can never appear in the catalogue
    const seenCatalogIds = new Set<string>();
    result = result.filter((star) => {
      const canonicalId = resolveStarId(star.id);
      if (seenCatalogIds.has(canonicalId)) return false;
      seenCatalogIds.add(canonicalId);
      return true;
    });

    return result;
  }, [filterState]);

  // Handler to add star to comparison
  const handleAddStarToCompare = (star: StarData) => {
    const starCanonical = resolveStarId(star.id);
    if (selectedStars.some((s) => s.id === star.id || resolveStarId(s.id) === starCanonical)) return;
    if (selectedStars.length >= 6) {
      // Replace oldest non-focused star
      const next = [...selectedStars.slice(1), star];
      setSelectedStars(next);
    } else {
      setSelectedStars([...selectedStars, star]);
    }
    setActivePresetId(null);
    setFocusedStar(star);
  };

  const handleRemoveStarFromCompare = (starId: string) => {
    if (selectedStars.length <= 1) return;
    const next = selectedStars.filter((s) => s.id !== starId);
    setSelectedStars(next);
    setActivePresetId(null);
    if (focusedStar?.id === starId) {
      setFocusedStar(next[0] || null);
    }
  };

  const handleToggleCompare = (star: StarData) => {
    if (selectedStars.some((s) => s.id === star.id)) {
      handleRemoveStarFromCompare(star.id);
    } else {
      handleAddStarToCompare(star);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = allPresets.find((p) => p.id === presetId);
    if (!preset) return;
    const seenIds = new Set<string>();
    const stars: StarData[] = [];
    for (const rawId of preset.starIds) {
      const canonicalId = resolveStarId(rawId);
      if (seenIds.has(canonicalId)) continue;
      const star = STARS_CATALOG.find((s) => s.id === canonicalId || s.id === rawId);
      if (star) {
        seenIds.add(canonicalId);
        seenIds.add(star.id);
        stars.push(star);
      }
    }
    setSelectedStars(stars);
    setActivePresetId(presetId);
    setFocusedStar(null);

    // Apply default sort key and direction configured for this preset
    const defSortKey = preset.defaultSortKey || (
      presetId === 'nearest-stars' ? 'distance' :
      presetId === 'brightest-stars-night-sky' ? 'apparentMagnitude' :
      presetId === 'hottest-stars' ? 'temperature' :
      presetId === 'most-massive-stars' ? 'mass' : 'size'
    );
    setStageSortKey(defSortKey);
    setStageSortDirection(preset.defaultSortDirection || 'asc');
  };

  const handleOpenEditStage = () => {
    setStagePresetModalState({
      isOpen: true,
      mode: 'stage',
      presetToEdit: null,
    });
  };

  const handleOpenCreatePreset = () => {
    setStagePresetModalState({
      isOpen: true,
      mode: 'preset',
      presetToEdit: null,
    });
  };

  const handleOpenEditPreset = (preset: PresetComparison) => {
    setStagePresetModalState({
      isOpen: true,
      mode: 'preset',
      presetToEdit: preset,
    });
  };

  const handleCloseStagePresetModal = () => {
    setStagePresetModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSaveStageStars = (starIds: string[]) => {
    const newStars = starIds
      .map((id) => STARS_CATALOG.find((s) => s.id === id))
      .filter(Boolean) as StarData[];

    if (newStars.length > 0) {
      setSelectedStars(newStars);
      if (!focusedStar || !newStars.some((s) => s.id === focusedStar.id)) {
        setFocusedStar(newStars[0]);
      }
      const activePreset = allPresets.find((p) => p.id === activePresetId);
      if (activePreset) {
        const matches =
          activePreset.starIds.length === starIds.length &&
          activePreset.starIds.every((id) => starIds.includes(id));
        if (!matches) {
          setActivePresetId(null);
        }
      }
    }
  };

  const handleCreateCustomPreset = (presetData: Omit<PresetComparison, 'id' | 'isCustom'>) => {
    const newPreset: PresetComparison = {
      ...presetData,
      desc: presetData.desc.slice(0, 100),
      id: `custom-preset-${Date.now()}`,
      isCustom: true,
    };
    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    try {
      localStorage.setItem('cosmic_custom_presets', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save custom presets to localStorage', e);
    }
    // Load the newly created custom preset directly
    const stars = newPreset.starIds
      .map((id) => STARS_CATALOG.find((s) => s.id === id))
      .filter(Boolean) as StarData[];
    setSelectedStars(stars);
    setActivePresetId(newPreset.id);
    setFocusedStar(stars[0] || null);
    setIsHomeOpen(false);
    setActiveOverlay(null);
  };

  const handleSavePreset = (presetData: {
    id?: string;
    title: string;
    desc: string;
    starIds: string[];
  }) => {
    const cappedDesc = presetData.desc.slice(0, 100);
    if (presetData.id) {
      // Editing an existing preset
      const isExistingCustom = customPresets.some((p) => p.id === presetData.id);
      if (isExistingCustom) {
        const updated = customPresets.map((p) =>
          p.id === presetData.id
            ? { ...p, title: presetData.title, desc: cappedDesc, starIds: presetData.starIds }
            : p
        );
        setCustomPresets(updated);
        try {
          localStorage.setItem('cosmic_custom_presets', JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to update custom presets in localStorage', e);
        }
        if (activePresetId === presetData.id) {
          const stars = presetData.starIds
            .map((id) => STARS_CATALOG.find((s) => s.id === id))
            .filter(Boolean) as StarData[];
          setSelectedStars(stars);
          if (!focusedStar || !stars.some((s) => s.id === focusedStar.id)) {
            setFocusedStar(stars[0] || null);
          }
        }
      } else {
        // Built-in preset was edited: save as customized preset
        const customizedPreset: PresetComparison = {
          id: `custom-${presetData.id}-${Date.now()}`,
          title: presetData.title,
          desc: cappedDesc,
          starIds: presetData.starIds,
          isCustom: true,
        };
        const updated = [...customPresets, customizedPreset];
        setCustomPresets(updated);
        try {
          localStorage.setItem('cosmic_custom_presets', JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to save customized preset to localStorage', e);
        }
        const stars = customizedPreset.starIds
          .map((id) => STARS_CATALOG.find((s) => s.id === id))
          .filter(Boolean) as StarData[];
        setSelectedStars(stars);
        setActivePresetId(customizedPreset.id);
        if (!focusedStar || !stars.some((s) => s.id === focusedStar.id)) {
          setFocusedStar(stars[0] || null);
        }
        setIsHomeOpen(false);
        setActiveOverlay(null);
      }
    } else {
      // Creating a new preset
      handleCreateCustomPreset({
        title: presetData.title,
        desc: presetData.desc,
        starIds: presetData.starIds,
      });
    }
  };

  const handleDeleteCustomPreset = (presetId: string) => {
    const updated = customPresets.filter((p) => p.id !== presetId);
    setCustomPresets(updated);
    try {
      localStorage.setItem('cosmic_custom_presets', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update custom presets in localStorage', e);
    }
    if (activePresetId === presetId) {
      handleSelectPreset('nearest-stars');
    }
  };

  // Full-screen dedicated view for Easter Egg Suika Minigame
  if (isSuikaOpen) {
    return (
      <StellarSuikaGame
        onBack={() => setIsSuikaOpen(false)}
        onHome={() => setIsSuikaOpen(false)}
        onInspectStar={(star) => {
          setIsSuikaOpen(false);
          setDetailModalStar(star);
        }}
      />
    );
  }

  return (
    <div className="h-screen w-screen bg-[#02040a] text-slate-100 flex flex-col relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {!assetsLoaded && <LoadingSprite />}
      
      <div className={`flex flex-col h-full w-full transition-opacity duration-700 ${assetsLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Deep Space Ambient Nebulae & Radial Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[650px] h-[650px] bg-cyan-900/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-indigo-950/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-blue-950/10 rounded-full blur-[150px]" />
      </div>

      {/* Top Main Navigation Header - Accessible only from 3D mode screen, removed from home screen */}
      {!isHomeOpen && (
        <header className="hidden md:flex h-14 shrink-0 z-50 bg-transparent border-b border-transparent px-2.5 sm:px-6 items-center justify-between shadow-none pointer-events-none">
          {/* Left: Home & Encyclopedia Buttons */}
          <div className="flex items-center gap-2 pointer-events-auto shrink-0">
            {/* Home Button (Icon-only on mobile, label on sm+) */}
            <button
              id="btn-topbar-home"
              onClick={() => setIsHomeOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isHomeOpen
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_18px_rgba(6,182,212,0.45)] font-bold'
                  : 'bg-[#040816]/90 text-slate-300 hover:text-white hover:bg-cyan-950/60 border border-cyan-500/30 backdrop-blur-md shadow-md'
              }`}
              title={isHomeOpen ? 'Close Homepage' : 'Open Homepage'}
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>

            {/* Encyclopedia Button moved next to Home Button */}
            <EncyclopediaDropdown
              buttonId="btn-stage-canvas-encyclopedia"
              activeOverlay={activeOverlay}
              onOpenFrontpage={() => {
                setIsHomeOpen(false);
                setFrontpageInitialSection('what-is-a-star');
                setActiveOverlay('frontpage');
              }}
              onOpenCatalog={() => {
                setIsHomeOpen(false);
                setCatalogSubTab('stars');
                setActiveOverlay('catalog');
              }}
              onOpenStellarSystems={() => {
                setIsHomeOpen(false);
                setCatalogSubTab('systems');
                setActiveOverlay('catalog');
              }}
              onOpenHRDiagram={() => {
                setIsHomeOpen(false);
                setActiveOverlay('hr-diagram');
              }}
              onOpenConstellations={() => {
                setIsHomeOpen(false);
                setActiveOverlay('constellations');
              }}
              onOpenDiscovery={() => {
                setIsHomeOpen(false);
                setActiveOverlay('discovery');
              }}
              onOpenNomenclature={() => {
                setIsHomeOpen(false);
                setActiveOverlay('discovery');
              }}
            />
          </div>

          {/* Center: Preset Slider */}
          <div className="flex-1 flex justify-center items-center px-2 pointer-events-auto min-w-0">
            <PresetSlider
              presets={allPresets}
              activePresetId={activePresetId}
              onSelectPreset={(presetId) => {
                handleSelectPreset(presetId);
                if (isHomeOpen) setIsHomeOpen(false);
              }}
              onOpenCreatePreset={handleOpenCreatePreset}
              onEditPreset={handleOpenEditPreset}
              onDeletePreset={handleDeleteCustomPreset}
            />
          </div>

          {/* Right: Sound, PWA, Shortcuts, Fullscreen, About & Coffee */}
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0">

            {/* Ambient Cosmic Sound */}
            <AmbientSoundToggle />

            {/* PWA Install */}
            <PWAInstallButton />

            {/* Keyboard Shortcuts Help - Desktop Only, Hidden on Tablet & Mobile */}
            {!isMobile && !isTablet && (
              <button
                type="button"
                id="btn-topbar-shortcuts"
                onClick={() => setIsShortcutsHelpOpen(true)}
                title="Keyboard Shortcuts"
                className="hidden lg:block p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-white/5 border border-transparent hover:border-cyan-500/30 transition-all cursor-pointer"
                aria-label="Keyboard Shortcuts"
              >
                <Keyboard className="w-4 h-4" />
              </button>
            )}

            {/* Fullscreen Page Toggle */}
            <button
              type="button"
              id="btn-topbar-fullscreen"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Display Fullscreen'}
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-white/5 border border-transparent hover:border-cyan-500/30 transition-all cursor-pointer"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* About App Button (Sits right on the left-hand side of Coffee button) */}
            <button
              id="btn-topbar-about"
              onClick={() => {
                setActiveOverlay(null);
                setIsAboutOpen(true);
              }}
              title="About App (Origins, Inspirations & Creator)"
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#090e20] hover:bg-cyan-950/50 border border-cyan-500/30 transition-all cursor-pointer shrink-0 active:scale-95"
              aria-label="About App"
            >
              <Info className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">About App</span>
            </button>

            {/* Buy Me a Coffee */}
            <a
              id="btn-topbar-kofi"
              href="https://ko-fi.com/b123entertainment"
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.35)] transition-all cursor-pointer shrink-0 active:scale-95"
              title="Support the creator on Ko-fi"
              aria-label="Buy me a coffee on Ko-fi (opens in new tab)"
            >
              <Coffee className="w-4 h-4 text-slate-950 fill-amber-950/20" />
              <span className="hidden sm:inline">Coffee</span>
            </a>
          </div>
        </header>
      )}

      {/* Main Full-Viewport 3D Stage (displayed on the entire webpage) */}
      <main className="flex-1 w-full h-full relative overflow-hidden">
        <StarCanvas3D
          stars={selectedStars}
          selectedStarId={focusedStar?.id || null}
          onSelectStar={(star) => setFocusedStar(star)}
          showCorona={showCorona}
          viewMode="3d-comparator"
          focusedStarId={focusedStar?.id || null}
          onInspectStar={(star) => setDetailModalStar(star)}
          sortKey={stageSortKey}
          sortDirection={stageSortDirection}
          onSortChange={setStageSortKey}
          onToggleSortDirection={() => setStageSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
          presets={allPresets}
          activePresetId={activePresetId}
          onSelectPreset={handleSelectPreset}
          onOpenCreatePreset={handleOpenCreatePreset}
          onEditPreset={handleOpenEditPreset}
          onDeletePreset={handleDeleteCustomPreset}
          onOpenEditStage={handleOpenEditStage}
          onOpenHome={() => setIsHomeOpen(true)}
          onCloseHome={() => setIsHomeOpen(false)}
          isHomeOpen={isHomeOpen}
          onOpenAbout={() => {
            setActiveOverlay(null);
            setIsAboutOpen(true);
          }}
          onOpenFrontpage={() => {
            setFrontpageInitialSection('what-is-a-star');
            setActiveOverlay('frontpage');
          }}
          onOpenCatalog={() => setActiveOverlay('catalog')}
          onOpenHRDiagram={() => setActiveOverlay('hr-diagram')}
          onOpenGuide={() => {
            setFrontpageInitialSection('spectral-classes');
            setActiveOverlay('frontpage');
          }}
          onOpenConstellations={() => setActiveOverlay('constellations')}
          onOpenDiscovery={() => setActiveOverlay('discovery')}
          onOpenNomenclature={() => setActiveOverlay('discovery')}
          isMobile={isMobile}
          isTablet={isTablet}
        >
          {/* Homepage Overlay over 3D Stage (Open on startup) */}
          {isHomeOpen && (
            <div className="absolute inset-0 z-20 overflow-y-auto bg-black/25 md:bg-[#02040a] animate-in fade-in duration-200 scrollbar-thin flex flex-col justify-between rounded-none pt-12 md:pt-0 pointer-events-auto">
              <div className={`max-w-7xl w-full mx-auto flex-1 flex flex-col justify-center min-h-0 rounded-none ${
                isTablet ? 'p-4 sm:p-5' : 'p-0 sm:p-5 lg:p-6'
              } ${isMobile && !isTablet ? 'landscape:p-0' : ''}`}>
                <HomeScreen
                  onClose={() => setIsHomeOpen(false)}
                  onNavigateTab={(tab) => {
                    setIsHomeOpen(false);
                    if (tab === 'guide') {
                      setFrontpageInitialSection('what-is-a-star');
                      setActiveOverlay('frontpage');
                    } else if (tab === 'catalog' || tab === 'hr-diagram' || tab === 'constellations') {
                      setActiveOverlay(tab);
                    } else if (tab === 'about') {
                      setIsAboutOpen(true);
                    }
                  }}
                  onSelectPreset={(presetId) => {
                    handleSelectPreset(presetId);
                    setIsHomeOpen(false);
                  }}
                  onInspectStar={(star) => setDetailModalStar(star)}
                  onAddStarToCompare={(star) => {
                    handleAddStarToCompare(star);
                    setFocusedStar(star);
                    setIsHomeOpen(false);
                  }}
                  selectedStars={selectedStars}
                  presets={allPresets}
                  onOpenCreatePreset={handleOpenCreatePreset}
                  onDeletePreset={handleDeleteCustomPreset}
                  isMobile={isMobile}
                />
              </div>

              {/* Footer inside Homepage - visible directly in principal view */}
              <footer className={`border-t border-cyan-500/15 bg-[#030611] px-4 font-mono relative z-10 shrink-0 ${
                isTablet ? 'py-3 sm:py-3.5 text-xs' : 'py-2 sm:py-3.5 text-[11px] sm:text-xs'
              } ${isMobile && !isTablet ? 'landscape:py-1.5' : ''}`}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-center sm:text-left">
                    <span className="text-slate-300 font-bold">Copyright © 2026 B123 Entertainment.</span>
                    <span className="hidden sm:inline text-slate-600">•</span>
                    <span className="hidden xs:inline flex items-center gap-1.5">
                      <span>Starpedia 3D: Stars of the Universe</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] sm:text-xs">
                    <button
                      id="btn-footer-about"
                      onClick={() => {
                        setIsHomeOpen(false);
                        setActiveOverlay(null);
                        setIsAboutOpen(true);
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>About app</span>
                    </button>
                    <span className="text-slate-700">|</span>
                    <a
                      href="https://youtube.com/comparisonfarts"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-red-400 hover:text-red-300 hover:underline flex items-center gap-1"
                    >
                      <span>youtube.com/comparisonfarts</span>
                    </a>
                  </div>
                </div>
              </footer>
            </div>
          )}
        </StarCanvas3D>
      </main>

      {/* Encyclopedia Fullscreen Mode: Stellar Catalog, H-R Diagram, Classification Guide, and Constellation Guide */}
      {activeOverlay && (
        <div className="fixed inset-0 z-50 w-full h-full bg-[#030714] flex flex-col overflow-hidden pointer-events-auto animate-in fade-in duration-200">
          {/* Encyclopedia Header Bar with Navigation Tabs & Close Button */}
          <div className={`flex flex-row items-center justify-between ${
            activeOverlay === 'hr-diagram' ? 'px-2 sm:px-6 py-2 sm:py-3' : 'px-3 sm:px-6 py-2.5 sm:py-3'
          } border-b border-cyan-500/20 bg-[#060b20] shrink-0 gap-2 sm:gap-3`}>
              {/* Left: Encyclopedia Brand Badge & Functionalities */}
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar max-w-full">
                <button
                  id="overlay-brand-badge"
                  onClick={() => {
                    setFrontpageInitialSection('what-is-a-star');
                    setActiveOverlay('frontpage');
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/35 text-cyan-300 font-mono text-xs font-bold tracking-wider uppercase shrink-0 shadow-sm cursor-pointer transition-all"
                  title="Go to Encyclopedia Frontpage: What is a Star?"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Starpedia 3D</span>
                </button>

                {/* Module Switcher Tabs: Frontpage (What is a star?), Stellar Catalog, H-R Diagram, Constellation Guide */}
                <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-[#020512] rounded-2xl border border-cyan-500/25 overflow-x-auto no-scrollbar shrink-0">
                  <button
                    id="overlay-tab-frontpage"
                    onClick={() => {
                      setFrontpageInitialSection('what-is-a-star');
                      setActiveOverlay('frontpage');
                    }}
                    className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                      activeOverlay === 'frontpage' || activeOverlay === 'guide'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title="Encyclopedia Frontpage: What is a Star? (Merged with Classification Guide)"
                  >
                    <Sun className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0 text-amber-400" />
                    <span>What is a Star?</span>
                  </button>

                  <button
                    id="overlay-tab-catalog"
                    onClick={() => {
                      setCatalogSubTab('stars');
                      setActiveOverlay('catalog');
                    }}
                    className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                      activeOverlay === 'catalog' || activeOverlay === 'stellar-systems'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={`Stellar Catalog (${STARS_CATALOG.length} stars)`}
                  >
                    <Grid className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>Stellar Catalog</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        activeOverlay === 'catalog' || activeOverlay === 'stellar-systems' ? 'bg-slate-950/30 text-slate-950 font-bold' : 'bg-slate-800 text-cyan-300'
                      }`}
                    >
                      {STARS_CATALOG.length}
                    </span>
                  </button>

                  <button
                    id="overlay-tab-hr"
                    onClick={() => setActiveOverlay('hr-diagram')}
                    className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                      activeOverlay === 'hr-diagram'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title="Hertzsprung–Russell Diagram"
                  >
                    <BarChart2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>H-R Diagram</span>
                  </button>

                  <button
                    id="overlay-tab-constellations"
                    onClick={() => setActiveOverlay('constellations')}
                    className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                      activeOverlay === 'constellations'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title="Constellation Guide (All 88 IAU Constellations & 13 Zodiac Signs)"
                  >
                    <Compass className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0 text-cyan-400" />
                    <span>Constellation Guide</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        activeOverlay === 'constellations'
                          ? 'bg-slate-950/30 text-slate-950 font-bold'
                          : 'bg-slate-800 text-cyan-300'
                      }`}
                    >
                      88
                    </span>
                  </button>

                  <button
                    id="overlay-tab-discovery"
                    onClick={() => setActiveOverlay('discovery')}
                    className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                      activeOverlay === 'discovery' || activeOverlay === 'nomenclature'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title="Stellar Discovery, Telescopes & Nomenclature"
                  >
                    <Telescope className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0 text-cyan-400" />
                    <span>Discovery</span>
                  </button>
                </div>
              </div>

              {/* Close Encyclopedia Button */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  id="btn-close-overlay"
                  onClick={() => setActiveOverlay(null)}
                  className={`flex items-center justify-center gap-1.5 ${
                    isMobile ? 'p-2' : 'p-2 md:px-3 md:py-1.5'
                  } rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold transition-all cursor-pointer active:scale-95 shrink-0`}
                  title="Close Encyclopedia (Esc)"
                  aria-label="Close Encyclopedia"
                >
                  <X className="w-4 h-4" />
                  {!isMobile && (
                    <>
                      <span className="hidden md:inline">Close</span>
                      <span className="text-[10px] font-mono text-slate-400 hidden md:inline">[Esc]</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Overlay Scrollable Body */}
            <div className={`flex-1 overflow-y-auto overflow-x-hidden ${
              activeOverlay === 'hr-diagram'
                ? 'px-0.5 py-1 sm:p-5 lg:p-6'
                : activeOverlay === 'catalog' || activeOverlay === 'stellar-systems'
                ? 'px-2 py-3 sm:p-5 lg:p-6'
                : 'p-4 sm:p-6 lg:p-8'
            } scrollbar-thin`}>
              {activeOverlay === 'catalog' && (
                <div className="flex flex-col gap-5 sm:gap-6 max-w-7xl mx-auto">
                  {/* Hero Banner: Stellar Catalog with Integrated Sub-Pages */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-5 sm:p-6 shadow-xl backdrop-blur-md">
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="max-w-3xl">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2.5 sm:gap-3">
                          <Grid className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400 shrink-0" />
                          <span>Stellar Catalog</span>
                        </h1>
                      </div>

                      {/* Sub-page Navigation Tabs inside the Stellar Catalog */}
                      <div className="flex items-center p-1 rounded-2xl bg-[#020512]/90 border border-cyan-500/30 shrink-0 shadow-lg">
                        <button
                          id="catalog-subtab-stars"
                          onClick={() => setCatalogSubTab('stars')}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                            catalogSubTab === 'stars'
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Grid className="w-3.5 h-3.5 shrink-0" />
                          <span>Individual Stars</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                              catalogSubTab === 'stars' ? 'bg-slate-950/30 text-slate-950 font-bold' : 'bg-slate-900 text-cyan-300'
                            }`}
                          >
                            {STARS_CATALOG.length}
                          </span>
                        </button>

                        <button
                          id="catalog-subtab-systems"
                          onClick={() => setCatalogSubTab('systems')}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                            catalogSubTab === 'systems'
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Share2 className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                          <span>Stellar Systems</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                              catalogSubTab === 'systems' ? 'bg-slate-950/30 text-slate-950 font-bold' : 'bg-slate-900 text-cyan-300'
                            }`}
                          >
                            {MULTIPLE_STAR_SYSTEMS.length}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {catalogSubTab === 'systems' ? (
                    /* SUB-PAGE 2: Multiple Star Systems Registry */
                    <StellarSystemCatalog
                      embedded={true}
                      onInspectSystemInDossier={(system) => {
                        setSelectedSystemDossier(system);
                      }}
                      onInspectStar={(s) => {
                        setDetailModalInitialMode(undefined);
                        setDetailModalStar(s);
                      }}
                      onCompareStar={(s) => {
                        handleAddStarToCompare(s);
                        setFocusedStar(s);
                        setActiveOverlay(null);
                      }}
                    />
                  ) : (
                    /* SUB-PAGE 1: Individual Stars Registry */
                    <>
                      <StarFilterPanel
                        filterState={filterState}
                        onChangeFilter={(partial) => setFilterState((prev) => ({ ...prev, ...partial }))}
                        onResetFilters={() => setFilterState(initialFilterState)}
                        totalMatches={filteredStars.length}
                        onOpenClassificationGuide={() => {
                          setFrontpageInitialSection('spectral-classes');
                          setActiveOverlay('frontpage');
                        }}
                      />

                      {/* Catalog Filter count */}
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                        <span>
                          Showing <strong className="text-cyan-400 font-bold">{filteredStars.length}</strong> of{' '}
                          {STARS_CATALOG.length} catalog stars
                        </span>
                      </div>

                      {filteredStars.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-2 sm:gap-2.5 md:gap-3">
                          {filteredStars.map((star) => (
                            <StarCard
                              key={star.id}
                              star={star}
                              isCompact={true}
                              onViewDetails={(s) => setDetailModalStar(s)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="p-12 text-center bg-[#070b18]/80 rounded-2xl border border-cyan-500/20 text-slate-400 backdrop-blur-xl">
                          <p className="text-base font-semibold text-slate-300">No stars found matching your filters.</p>
                          <p className="text-xs mt-1">Try resetting the spectral class or distance sliders.</p>
                          <button
                            onClick={() => setFilterState(initialFilterState)}
                            className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
                          >
                            Reset All Filters
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Standalone Route for Stellar Systems (redirects/maps directly to catalog systems subtab) */}
              {activeOverlay === 'stellar-systems' && (
                <div className="max-w-7xl mx-auto">
                  <StellarSystemCatalog
                    embedded={false}
                    onInspectSystemInDossier={(system) => {
                      setSelectedSystemDossier(system);
                    }}
                    onInspectStar={(s) => {
                      setDetailModalInitialMode(undefined);
                      setDetailModalStar(s);
                    }}
                    onCompareStar={(s) => {
                      handleAddStarToCompare(s);
                      setFocusedStar(s);
                      setActiveOverlay(null);
                    }}
                  />
                </div>
              )}

              {activeOverlay === 'hr-diagram' && (
                <div className="max-w-7xl mx-auto h-full">
                  <HRDiagram
                    stars={STARS_CATALOG}
                    selectedStars={selectedStars}
                    onSelectStar={(s) => setDetailModalStar(s)}
                    onToggleCompare={handleToggleCompare}
                    onOpenClassificationGuide={() => {
                      setFrontpageInitialSection('spectral-classes');
                      setActiveOverlay('frontpage');
                    }}
                    isMobile={isMobile}
                  />
                </div>
              )}

              {(activeOverlay === 'frontpage' || activeOverlay === 'guide') && (
                <div className="max-w-7xl mx-auto">
                  <StarEncyclopediaFrontpage
                    initialSection={frontpageInitialSection}
                    onSelectStar={(s) => setDetailModalStar(s)}
                    onCompareStar={(s) => {
                      handleAddStarToCompare(s);
                      setFocusedStar(s);
                      setActiveOverlay(null);
                    }}
                    onJumpToCatalog={() => setActiveOverlay('catalog')}
                    onJumpToHRDiagram={() => setActiveOverlay('hr-diagram')}
                    onJumpToConstellations={() => setActiveOverlay('constellations')}
                    onJumpToCatalogFilter={(sc) => {
                      if (sc) {
                        setFilterState((prev) => ({
                          ...prev,
                          spectralClasses: [sc as SpectralClass],
                        }));
                      }
                      setActiveOverlay('catalog');
                    }}
                  />
                </div>
              )}

              {activeOverlay === 'constellations' && (
                <div className="max-w-7xl mx-auto">
                  <ConstellationGuide
                    onSelectStar={(s) => setDetailModalStar(s)}
                    onCompareStar={(s) => {
                      handleAddStarToCompare(s);
                      setFocusedStar(s);
                      setActiveOverlay(null);
                    }}
                  />
                </div>
              )}

              {(activeOverlay === 'discovery' || activeOverlay === 'nomenclature') && (
                <div className="max-w-7xl mx-auto">
                  <StellarDiscoveryGuide
                    onSelectStar={(s) => setDetailModalStar(s)}
                    onCompareStar={(s) => {
                      handleAddStarToCompare(s);
                      setFocusedStar(s);
                      setActiveOverlay(null);
                    }}
                    onJumpToCatalog={(searchQuery) => {
                      if (searchQuery) {
                        setFilterState((prev) => ({
                          ...prev,
                          searchQuery,
                        }));
                      }
                      setActiveOverlay('catalog');
                    }}
                  />
                </div>
              )}
            </div>
        </div>
      )}

      {/* Dedicated Separate Overlay for About App */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 pointer-events-none">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-auto transition-opacity duration-200"
            onClick={() => setIsAboutOpen(false)}
          />

          {/* Modal Container Overlay */}
          <div className="relative w-full max-w-6xl h-[92vh] sm:h-[88vh] bg-[#040816]/95 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Header Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-cyan-500/20 bg-[#060b20] shrink-0">
              <div className="flex items-center gap-2 text-sm font-bold text-white font-mono">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>About App & Project</span>
              </div>

              {/* Close Button */}
              <button
                id="btn-close-about-overlay"
                onClick={() => setIsAboutOpen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold transition-all cursor-pointer active:scale-95"
                title="Close About Overlay (Esc)"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">[Esc]</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
              <AboutPage
                onNavigateTab={(tab) => {
                  setIsAboutOpen(false);
                  if (tab === 'guide') {
                    setFrontpageInitialSection('what-is-a-star');
                    setActiveOverlay('frontpage');
                  } else if (tab === 'catalog' || tab === 'hr-diagram') {
                    setActiveOverlay(tab);
                  } else if (tab === 'home') {
                    setIsHomeOpen(true);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Star Detail Modal (Independent Star Dossier) */}
      <StarDetailModal
        star={detailModalStar}
        initialMode={detailModalInitialMode}
        onClose={() => {
          setDetailModalStar(null);
          setDetailModalInitialMode(undefined);
        }}
        onSelectStar={(newStar) => setDetailModalStar(newStar)}
        onOpenStellarSystemDossier={(system) => {
          setSelectedSystemDossier(system);
          setDetailModalStar(null);
        }}
        onOpenClassificationGuide={() => {
          setFrontpageInitialSection('spectral-classes');
          setActiveOverlay('frontpage');
        }}
        onCompareStar={(star) => {
          handleAddStarToCompare(star);
          setFocusedStar(star);
          setDetailModalStar(null);
          setActiveOverlay(null);
          setIsHomeOpen(false);
        }}
        onTriggerEasterEgg={() => {
          setDetailModalStar(null);
          setActiveOverlay(null);
          setIsHomeOpen(false);
          setIsAboutOpen(false);
          setIsSuikaOpen(true);
        }}
      />

      {/* Dedicated Stellar System Dossier Modal (Independent Multi-Star System Dossier) */}
      <StellarSystemDossierModal
        system={selectedSystemDossier}
        onClose={() => setSelectedSystemDossier(null)}
        onSelectStar={(star) => {
          setDetailModalStar(star);
          setSelectedSystemDossier(null);
        }}
        onSelectSystem={(system) => setSelectedSystemDossier(system)}
      />

      {/* Stage & Preset Modal (condensed check-list editor for 3D stage and presets) */}
      <StageAndPresetModal
        isOpen={stagePresetModalState.isOpen}
        mode={stagePresetModalState.mode}
        onClose={handleCloseStagePresetModal}
        currentStageStars={selectedStars}
        presetToEdit={stagePresetModalState.presetToEdit}
        onSaveStage={handleSaveStageStars}
        onSavePreset={handleSavePreset}
      />

      {/* Offline Mode Status Indicator */}
      <OfflineIndicator />

      {/* Global Command Palette & Quick Star Search (⌘K or /) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectStar={(star) => {
          setFocusedStar(star);
          setDetailModalStar(star);
        }}
        onNavigateTab={handleCommandNavigate}
        onToggleSound={() => spaceAudio.toggleMute()}
      />

      {/* Tactile Keyboard Shortcuts Cheat-Sheet (?) */}
      <KeyboardShortcutsHelpModal
        isOpen={isShortcutsHelpOpen}
        onClose={() => setIsShortcutsHelpOpen(false)}
      />
    </div>
    </div>
  );
}
