import React, { useState, useMemo, useEffect } from 'react';
import { StarData } from '../types';
import { formatPhysicalDiameter } from '../utils/formatters';
import { RunningText } from './RunningText';
import {
  Eye,
  Plus,
  Check,
  Globe,
  Sun,
  BookOpen,
  Search,
  Filter,
  Layers,
  Ruler,
  X,
  Zap,
  Compass,
  Maximize2,
  BarChart2,
} from 'lucide-react';

interface HRDiagramProps {
  stars: StarData[];
  selectedStars: StarData[];
  onSelectStar: (star: StarData) => void;
  onToggleCompare: (star: StarData) => void;
  onOpenClassificationGuide?: () => void;
  isMobile?: boolean;
}

// Extended Harvard + Yerkes + Relativistic & Sub-stellar Sequence
export interface SpectralBandConfig {
  label: string;
  name: string;
  startK: number;
  endK: number;
  color: string;
  glowColor: string;
  desc: string;
}

export const EXTENDED_SPECTRAL_BANDS: SpectralBandConfig[] = [
  {
    label: 'WR',
    name: 'Wolf-Rayet',
    startK: 250000,
    endK: 35000,
    color: '#9bb0ff',
    glowColor: 'rgba(155, 176, 255, 0.4)',
    desc: 'Scorching stripped fusion core stars (>35,000 K to 210,000+ K)',
  },
  {
    label: 'O',
    name: 'O-Type',
    startK: 35000,
    endK: 30000,
    color: '#3877ff',
    glowColor: 'rgba(56, 119, 255, 0.45)',
    desc: 'Electric sapphire blue luminous powerhouses (#3877ff, 30,000–50,000+ K)',
  },
  {
    label: 'B',
    name: 'B-Type',
    startK: 30000,
    endK: 10000,
    color: '#78afff',
    glowColor: 'rgba(120, 175, 255, 0.40)',
    desc: 'Luminous sky blue beacons (#78afff, e.g., Rigel, Spica, Alnilam)',
  },
  {
    label: 'A',
    name: 'A-Type',
    startK: 10000,
    endK: 7500,
    color: '#e8f0ff',
    glowColor: 'rgba(232, 240, 255, 0.40)',
    desc: 'Diamond brilliant pure white ~10,000 K (#e8f0ff, e.g., Vega itself, Sirius A)',
  },
  {
    label: 'F',
    name: 'F-Type',
    startK: 7500,
    endK: 6000,
    color: '#fff5dc',
    glowColor: 'rgba(255, 245, 220, 0.40)',
    desc: 'Warm creamy champagne white stars (#fff5dc, e.g., Procyon A, Canopus)',
  },
  {
    label: 'G',
    name: 'G-Type',
    startK: 6000,
    endK: 5200,
    color: '#ffd000',
    glowColor: 'rgba(255, 208, 0, 0.45)',
    desc: 'Radiant golden solar yellow stars (#ffd000, e.g., The Sun, Alpha Centauri A)',
  },
  {
    label: 'K',
    name: 'K-Type',
    startK: 5200,
    endK: 3700,
    color: '#ff851b',
    glowColor: 'rgba(255, 133, 27, 0.40)',
    desc: 'Luminous flame amber-orange dwarfs & giants (#ff851b, e.g., Arcturus, Aldebaran)',
  },
  {
    label: 'M',
    name: 'M-Type',
    startK: 3700,
    endK: 2400,
    color: '#ff2b08',
    glowColor: 'rgba(255, 43, 8, 0.45)',
    desc: 'Fiery glowing scarlet to deep ruby red dwarfs & giants (#ff2b08, e.g., Betelgeuse, Proxima Centauri)',
  },
  {
    label: 'L',
    name: 'L-Type',
    startK: 2400,
    endK: 1300,
    color: '#960718',
    glowColor: 'rgba(150, 7, 24, 0.35)',
    desc: 'Deep crimson brown dwarfs (1,300–2,400 K)',
  },
  {
    label: 'T',
    name: 'T-Type',
    startK: 1300,
    endK: 600,
    color: '#52010e',
    glowColor: 'rgba(82, 1, 14, 0.35)',
    desc: 'Methane plum brown dwarfs (600–1,300 K)',
  },
  {
    label: 'Y',
    name: 'Y-Type',
    startK: 600,
    endK: 200,
    color: '#1a0006',
    glowColor: 'rgba(26, 0, 6, 0.35)',
    desc: 'Ultracool brown dwarfs (<600 K)',
  },
];

export type HRDomainMode = 'classic';

interface DomainConfig {
  minTemp: number;
  maxTemp: number;
  minLumLog: number;
  maxLumLog: number;
  label: string;
}

// Unified Classic Stellar & Sub-stellar domain from Wolf-Rayet (WR) to ultracool brown dwarfs (Y)
const DOMAIN: DomainConfig = {
  minTemp: 200,
  maxTemp: 250000,
  minLumLog: -9.0, // 10^-9 L☉ (WISE 0855)
  maxLumLog: 7.0,  // 10^7 L☉ (R136a1, WR stars & Supergiants)
  label: 'Classic Sequence (WR–Y)',
};

type EvolutionaryFilter =
  | 'ALL'
  | 'MAIN_SEQUENCE'
  | 'SUPERGIANTS'
  | 'LBV'
  | 'GIANTS'
  | 'AGB'
  | 'CARBON_STARS'
  | 'SUBGIANTS'
  | 'SUBDWARFS'
  | 'WHITE_DWARFS'
  | 'WOLF_RAYET';

const isSubdwarfStar = (star: StarData) => {
  const spectralType = star.spectralType.trim();
  return (
    star.stellarStage?.toLowerCase().includes('subdwarf') === true ||
    /^(?:esd|usd|sd)[-:\s]*[OBAFGKMLTYCS]/i.test(spectralType) ||
    /\bVI\b/.test(spectralType)
  );
};

const isWolfRayetStar = (star: StarData) => {
  const spectralType = star.spectralType.trim();
  const isWhiteDwarf =
    star.spectralClass === 'WD' ||
    star.stellarStage?.toLowerCase().includes('white dwarf') === true ||
    /^WD\b/i.test(spectralType);

  return (
    !isWhiteDwarf &&
    (star.stellarStage?.toLowerCase().includes('wolf-rayet') === true ||
      star.spectralClass === 'WR' ||
      /^(?:WN|WC|WO|WR)/i.test(spectralType))
  );
};

// Empirical points defining the Main Sequence (Luminosity Class V) locus: strictly O through M-class only
const MAIN_SEQUENCE_CURVE = [
  { T: 45000, L: 450000, tag: 'O3V' },
  { T: 38000, L: 180000, tag: 'O5V' },
  { T: 30000, L: 25000, tag: 'B0V' },
  { T: 20000, L: 2500, tag: 'B2V' },
  { T: 15000, L: 800, tag: 'B5V' },
  { T: 12000, L: 150, tag: 'B8V' },
  { T: 9940, L: 25.4, tag: 'A0V (Sirius A)' },
  { T: 8500, L: 16, tag: 'A3V' },
  { T: 7670, L: 10.6, tag: 'A7V (Altair)' },
  { T: 6800, L: 4.5, tag: 'F2V' },
  { T: 6000, L: 1.5, tag: 'G0V' },
  { T: 5778, L: 1.0, tag: 'G2V (Sun)' },
  { T: 5260, L: 0.5, tag: 'K1V' },
  { T: 4400, L: 0.15, tag: 'K5V' },
  { T: 3850, L: 0.06, tag: 'M0V' },
  { T: 3042, L: 0.0017, tag: 'M5V (Proxima)' },
  { T: 2566, L: 0.00055, tag: 'M8V (TRAPPIST-1)' },
  { T: 2400, L: 0.0003, tag: 'M9V' },
];

// Empirical White Dwarf cooling track (Class VII / WD)
const WHITE_DWARF_TRACK = [
  { T: 40000, L: 0.20 },
  { T: 25200, L: 0.056 }, // Sirius B
  { T: 16500, L: 0.013 }, // 40 Eridani B
  { T: 11730, L: 0.0014 }, // BPM 37093
  { T: 7740, L: 0.00049 }, // Procyon B
  { T: 6110, L: 0.00017 }, // Van Maanen's Star
  { T: 4700, L: 0.00013 }, // WD 1856+534
  { T: 3800, L: 0.00004 },
];

// Empirical Giants track (Luminosity Classes II & III, encompassing Blue to Red Giants)
const GIANTS_TRACK = [
  { T: 33000, L: 80000 }, // O9II (Mintaka)
  { T: 25300, L: 20500 }, // B1III (Spica)
  { T: 21750, L: 9200 },  // B2III (Bellatrix)
  { T: 15000, L: 4000 },  // B5III
  { T: 12300, L: 2400 },  // B7III (Alcyone)
  { T: 9500, L: 800 },    // A0III
  { T: 8280, L: 600 },    // A3II-III (Pherkad)
  { T: 7400, L: 450 },    // F0II / A9II (Canopus)
  { T: 6000, L: 120 },    // G0III
  { T: 5080, L: 85 },     // G8III (Vindemiatrix)
  { T: 4666, L: 45 },     // K0III (Pollux)
  { T: 4286, L: 170 },    // K1.5III (Arcturus)
  { T: 3900, L: 439 },    // K5III (Aldebaran)
  { T: 3689, L: 1100 },   // M3III (Gacrux)
  { T: 3200, L: 3500 },   // M6III (T Cephei / Mira)
];

// Empirical Asymptotic Giant Branch (AGB) evolutionary track (double shell burning)
const AGB_TRACK = [
  { T: 3800, L: 500 },    // Early AGB entry
  { T: 3500, L: 1800 },   // Core contraction, shell ignition
  { T: 3200, L: 4500 },   // Classical AGB ascent (e.g., Mira variables)
  { T: 2900, L: 12000 },  // Thermally pulsing AGB (TP-AGB)
  { T: 2600, L: 28000 },  // High-luminosity AGB tip before envelope ejection
  { T: 2400, L: 45000 },  // Super-AGB maximum envelope expansion
];

// Empirical Carbon Stars chemical locus (Class C & S stars with C/O >= 1 and ZrO)
const CARBON_STARS_TRACK = [
  { T: 3350, L: 1400 },   // Warm carbon stars (C-R)
  { T: 3000, L: 3200 },   // TX Piscium / U Antliae
  { T: 2750, L: 5800 },   // La Superba
  { T: 2400, L: 9500 },   // R Leporis / V Aquilae
  { T: 2100, L: 15500 },  // CW Leonis (IRC +10216)
  { T: 1900, L: 24000 },  // Extreme dust-enshrouded carbon giants
];

// Empirical Subgiants bridge track (Luminosity Class IV)
const SUBGIANTS_TRACK = [
  { T: 30000, L: 30000 },
  { T: 26900, L: 15000 }, // Beta Cephei / B1IV
  { T: 22550, L: 10000 }, // Imai / B2IV
  { T: 21000, L: 7100 },  // Zeta Centauri / B2.5IV
  { T: 16700, L: 790 },   // Alpha Telescopii / B3IV
  { T: 15500, L: 1000 },  // Kalausi / B3IV
  { T: 11400, L: 175 },   // Sualocin / B9IV
  { T: 9520, L: 180 },    // Fawaris / B9.5IV
  { T: 7500, L: 14.0 },
  { T: 6800, L: 8.5 },
  { T: 6200, L: 5.2 },
  { T: 5500, L: 3.8 },
  { T: 4900, L: 3.2 },
];

// Empirical Supergiant ridge (Ia+, Ia, Ib)
const SUPERGIANT_RIDGE = [
  { T: 35000, L: 350000 },
  { T: 25000, L: 200000 },
  { T: 12100, L: 120000 }, // Rigel
  { T: 8500, L: 196000 },  // Deneb
  { T: 6015, L: 50000 },   // Polaris / Wezen area
  { T: 3600, L: 126000 },  // Betelgeuse
  { T: 3200, L: 440000 },  // Stephenson 2-18
];

// Empirical boundary polygon for Luminous Blue Variables (LBV) / S Doradus Instability Strip
// Covers the horizontal excursion corridor between visual minimum (hot blue hypergiant, ~25,000–35,000 K)
// and eruptive visual maximum (expanded cool pseudo-photosphere, ~8,000–10,000 K) near the Humphreys-Davidson limit
const LBV_INSTABILITY_STRIP_BOUNDARY = [
  { T: 35000, L: 6500000 }, // Upper hot corner (near Humphreys-Davidson limit)
  { T: 25000, L: 6500000 },
  { T: 14000, L: 6000000 },
  { T: 8200, L: 5500000 },  // Upper cool corner (eruption maximum of Eta Carinae)
  { T: 8000, L: 750000 },   // Lower cool corner (S Doradus eruption minimum)
  { T: 14000, L: 500000 },
  { T: 22000, L: 450000 },
  { T: 32000, L: 400000 },  // Lower hot corner (P Cygni / quiescent lower limit)
];

export const HRDiagram: React.FC<HRDiagramProps> = ({
  stars,
  selectedStars,
  onSelectStar,
  onToggleCompare,
  onOpenClassificationGuide,
  isMobile: isMobileProp,
}) => {
  const [hoveredStar, setHoveredStar] = useState<StarData | null>(null);
  const [pinnedStar, setPinnedStar] = useState<StarData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroupFilter, setActiveGroupFilter] = useState<EvolutionaryFilter>('ALL');
  const [activeSpectralFilter, setActiveSpectralFilter] = useState<string | null>(null);

  // Compact Mobile Filter Drawer State
  const [isCompactFilterOpen, setIsCompactFilterOpen] = useState(false);

  // Track viewport dimensions and orientation for responsive diagram scaling
  const [windowSize, setWindowSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Determine mobile mode and orientation (landscape vs portrait)
  const isLandscape = windowSize.width > windowSize.height;
  const isMobileSize = windowSize.width < 768 || (windowSize.width < 1024 && windowSize.height < 550);
  const isMobileMode =
    isMobileProp !== undefined
      ? isMobileProp || isMobileSize
      : isMobileSize;

  // Unified Classic Stellar Domain (Wolf-Rayet to Class Y, without neutron stars)
  const domainMode: HRDomainMode = 'classic';

  // Layer Toggles
  const [showIsoradiusLines, setShowIsoradiusLines] = useState(true);
  const [showEvolutionaryZones, setShowEvolutionaryZones] = useState(true);
  const [showSpectralShading, setShowSpectralShading] = useState(true);

  // Matching stars for floating search autocomplete on mobile
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return stars
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.alternateNames.some((alt) => alt.toLowerCase().includes(q)) ||
          s.spectralType.toLowerCase().includes(q) ||
          s.constellation.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [stars, searchQuery]);

  // Dynamic Canvas Height to fit current screen size
  const canvasHeight = useMemo(() => {
    if (!isMobileMode) return undefined; // Desktop uses standard responsive Tailwind heights
    if (isLandscape) {
      // Landscape mobile: Viewport height is constrained (~320px - 440px)
      // Fit completely within screen without vertical scrolling
      return Math.max(250, Math.min(380, windowSize.height - 52));
    }
    // Portrait mobile: Fit within the viewport below the compact tab header
    return Math.max(370, Math.min(520, windowSize.height - 150));
  }, [isMobileMode, isLandscape, windowSize.height]);

  // Active star for spotlight card / selected preview
  const activeSpotlightStar = hoveredStar || pinnedStar || null;

  // Responsive Insets for axes and plot boundaries (Constant so selecting a star never alters the HR diagram view)
  // Portrait mobile mode has reduced side margins so the HR diagram is wider while fitting the mobile screen
  const plotInsetLeft = isMobileMode ? (isLandscape ? 34 : 26) : 60;
  const plotInsetRight = isMobileMode ? (isLandscape ? 30 : 22) : 60;
  const plotInsetTop = isMobileMode ? 8 : 32;
  const plotInsetBottom = isMobileMode ? (isLandscape ? 38 : 72) : 58;

  // Active domain parameters (WR to Y sequence)
  const { minTemp, maxTemp, minLumLog, maxLumLog } = DOMAIN;
  const logTempMin = Math.log10(minTemp);
  const logTempMax = Math.log10(maxTemp);

  const handleGroupFilterChange = (filter: EvolutionaryFilter) => {
    setActiveGroupFilter(filter);
    setActiveSpectralFilter(null);
  };

  const handleSpectralFilterChange = (label: string) => {
    const isSelected = activeSpectralFilter === label;
    const newFilter = isSelected ? null : label;
    setActiveSpectralFilter(newFilter);
    setActiveGroupFilter('ALL');
  };

  // Precise coordinate mapping functions
  const getCoordinates = (star: StarData) => {
    const tempClamped = Math.max(minTemp, Math.min(maxTemp, star.temperature));
    const logTemp = Math.log10(tempClamped);
    const xPercent = ((logTempMax - logTemp) / (logTempMax - logTempMin)) * 100;

    const minLum = Math.pow(10, minLumLog);
    const maxLum = Math.pow(10, maxLumLog);
    const lumClamped = Math.max(minLum, Math.min(maxLum, star.luminositySolar));
    const logLum = Math.log10(lumClamped);
    const yPercent = ((maxLumLog - logLum) / (maxLumLog - minLumLog)) * 100;

    return { x: xPercent, y: yPercent };
  };

  const getTempX = (k: number) => {
    const clamped = Math.max(minTemp, Math.min(maxTemp, k));
    const logK = Math.log10(clamped);
    return ((logTempMax - logK) / (logTempMax - logTempMin)) * 100;
  };

  const getLumY = (solarLum: number) => {
    const minLum = Math.pow(10, minLumLog);
    const maxLum = Math.pow(10, maxLumLog);
    const clamped = Math.max(minLum, Math.min(maxLum, solarLum));
    const logL = Math.log10(clamped);
    return ((maxLumLog - logL) / (maxLumLog - minLumLog)) * 100;
  };

  // Convert Absolute Bolometric Magnitude to Y percent
  // M_bol = 5 - 2.5 * log10(L/L_sun) (aligns exactly: M=5 <-> 10^0, M=0 <-> 10^2, M=-5 <-> 10^4, etc.)
  const getMagY = (mBol: number) => {
    const logL = (5 - mBol) / 2.5;
    return ((maxLumLog - logL) / (maxLumLog - minLumLog)) * 100;
  };

  // Filter stars by evolutionary category, spectral class, and search query
  const filteredStars = useMemo(() => {
    return stars.filter((star) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName =
          star.name.toLowerCase().includes(q) ||
          star.alternateNames.some((alt) => alt.toLowerCase().includes(q));
        if (!matchesName) return false;
      }

      // Neutron stars, pulsars, and compact remnants are strictly excluded from the HR diagram
      if (
        star.spectralClass === 'NS' ||
        star.stellarStage === 'Neutron Star / Pulsar' ||
        star.stellarStage === 'Stellar Black Hole' ||
        star.stellarStage?.toLowerCase().includes('pulsar') ||
        star.stellarStage?.toLowerCase().includes('neutron') ||
        star.stellarStage?.toLowerCase().includes('magnetar') ||
        star.stellarStage?.toLowerCase().includes('black hole') ||
        star.spectralType?.toLowerCase().includes('pulsar') ||
        star.spectralType?.toLowerCase().includes('magnetar')
      ) {
        return false;
      }

      if (activeSpectralFilter) {
        if (activeSpectralFilter === 'WR' || activeSpectralFilter === 'W') {
          if (!isWolfRayetStar(star)) return false;
        } else if (activeSpectralFilter === 'LBV') {
          if (star.spectralClass !== 'LBV' && !star.spectralType.startsWith('LBV') && star.stellarStage !== 'Luminous Blue Variable') return false;
        } else if (activeSpectralFilter === 'WD') {
          if (star.spectralClass !== 'WD' && star.stellarStage !== 'White Dwarf') return false;
        } else if (activeSpectralFilter === 'C') {
          if (star.spectralClass !== 'C' && !star.spectralType.startsWith('C') && star.stellarStage !== 'Carbon Star') return false;
        } else if (activeSpectralFilter === 'S') {
          if (star.spectralClass !== 'S' && !star.spectralType.startsWith('S') && star.stellarStage !== 'S-Type Star') return false;
        } else if (['O', 'B', 'A', 'F', 'G', 'K', 'M', 'L', 'T', 'Y'].includes(activeSpectralFilter)) {
          if (activeSpectralFilter === 'L') {
            if (star.spectralClass !== 'L' && !(/^L[0-9]/.test(star.spectralType))) return false;
          } else if (activeSpectralFilter === 'T') {
            if (star.spectralClass !== 'T' && !(/^T[0-9]/.test(star.spectralType))) return false;
          } else if (activeSpectralFilter === 'Y') {
            if (star.spectralClass !== 'Y' && !(/^Y[0-9]/.test(star.spectralType))) return false;
          } else {
            const isMatch =
              star.spectralClass === activeSpectralFilter ||
              star.spectralType.startsWith(activeSpectralFilter) ||
              new RegExp(`^(sd|esd|usd)[-:\\s]*${activeSpectralFilter}`, 'i').test(star.spectralType);
            if (!isMatch) return false;
          }
        }
      }

      if (activeGroupFilter === 'MAIN_SEQUENCE') {
        // Subdwarfs can contain the word "dwarf" in their stage and must not
        // leak into the ordinary Class V filter.
        if (isSubdwarfStar(star)) return false;
        return (
          star.stellarStage === 'Main Sequence' ||
          star.stellarStage === 'Main Sequence Dwarf' ||
          star.stellarStage === 'Red Dwarf' ||
          star.stellarStage === 'Contact Binary' ||
          star.stellarStage?.toLowerCase().includes('main sequence') ||
          (star.stellarStage?.toLowerCase().includes('dwarf') &&
            star.stellarStage !== 'White Dwarf' &&
            star.stellarStage !== 'Brown Dwarf') ||
          /\bV\b|\bVa\b|\bVb\b/.test(star.spectralType)
        );
      }
      if (activeGroupFilter === 'SUPERGIANTS') {
        return (
          star.stellarStage === 'Red Hypergiant' ||
          star.stellarStage === 'Red Supergiant' ||
          star.stellarStage === 'Blue Supergiant' ||
          star.stellarStage === 'Yellow Supergiant' ||
          star.stellarStage === 'Yellow Hypergiant' ||
          star.stellarStage === 'Luminous Blue Variable'
        );
      }
      if (activeGroupFilter === 'LBV') {
        return (
          star.spectralClass === 'LBV' ||
          star.stellarStage === 'Luminous Blue Variable' ||
          star.spectralType.toLowerCase().includes('lbv')
        );
      }
      if (activeGroupFilter === 'GIANTS') {
        return Boolean(star.spectralType && /(?<![IV])(II|III)(?![IV])/.test(star.spectralType));
      }
      if (activeGroupFilter === 'AGB') {
        // Asymptotic Giant Branch (AGB) evolutionary phase: double-shell burning giants
        return Boolean(
          star.fusionProcess?.toLowerCase().includes('agb') ||
          star.stellarStage?.toLowerCase().includes('agb') ||
          star.description?.toLowerCase().includes('agb') ||
          star.notableFacts?.some((f) => f.toLowerCase().includes('agb')) ||
          star.solarEngulfment?.toLowerCase().includes('agb') ||
          star.id === 'mira-a' ||
          star.id === 'rasalgethi' ||
          star.id === 'scheat' ||
          star.id === 'tejat-posterior' ||
          star.id === 'chi-cygni' ||
          star.id === 'r-horologii'
        );
      }
      if (activeGroupFilter === 'CARBON_STARS') {
        // Carbon Stars (chemical classification: C/O > 1, Class C and S types)
        return (
          star.stellarStage === 'Carbon Star' ||
          star.stellarStage === 'S-Type Star' ||
          star.spectralClass === 'C' ||
          star.spectralClass === 'S' ||
          star.spectralType.startsWith('C') ||
          star.spectralType.startsWith('S') ||
          star.name.toLowerCase().includes('carbon')
        );
      }
      if (activeGroupFilter === 'SUBGIANTS') {
        return (
          (star as any).luminosityClass === 'IV' ||
          star.spectralType.includes('IV') ||
          star.stellarStage.toLowerCase().includes('subgiant')
        );
      }
      if (activeGroupFilter === 'SUBDWARFS') {
        return isSubdwarfStar(star);
      }
      if (activeGroupFilter === 'WHITE_DWARFS') {
        return star.stellarStage === 'White Dwarf';
      }
      if (activeGroupFilter === 'WOLF_RAYET') {
        return isWolfRayetStar(star);
      }

      return true;
    });
  }, [stars, searchQuery, activeGroupFilter, activeSpectralFilter, minTemp, maxTemp, minLumLog]);

  // Stefan-Boltzmann Isoradius lines (R = constant):
  // L/L☉ = (R/R☉)^2 * (T/5778)^4  =>  log10(L) = 2*log10(R) + 4*log10(T) - 15.0471116
  // Accurately calculates boundary intersections across the domain box [0, 100] x [0, 100]
  const isoradiusLines = useMemo(() => {
    const radii = [
      { r: 1000, label: '1,000 R☉', color: '#f97316' },
      { r: 100, label: '100 R☉', color: '#eab308' },
      { r: 10, label: '10 R☉', color: '#84cc16' },
      { r: 1.0, label: '1.0 R☉ (Sun)', color: '#06b6d4' },
      { r: 0.1, label: '0.1 R☉', color: '#38bdf8' },
      { r: 0.01, label: '0.01 R☉ (Earth / WD)', color: '#a855f7' },
      { r: 0.001, label: '0.001 R☉', color: '#d946ef' },
      { r: 0.0001, label: '0.0001 R☉', color: '#ec4899' },
    ];

    const SB_CONST = 15.0471116; // 4 * log10(5778)

    return radii
      .map(({ r, label, color }) => {
        const points: { x: number; y: number; edge: string }[] = [];

        // 1. Intersection with Left boundary (T = maxTemp, x = 0)
        const logL_left = 2 * Math.log10(r) + 4 * logTempMax - SB_CONST;
        if (logL_left >= minLumLog && logL_left <= maxLumLog) {
          points.push({ x: 0, y: getLumY(Math.pow(10, logL_left)), edge: 'left' });
        }

        // 2. Intersection with Right boundary (T = minTemp, x = 100)
        const logL_right = 2 * Math.log10(r) + 4 * logTempMin - SB_CONST;
        if (logL_right >= minLumLog && logL_right <= maxLumLog) {
          points.push({ x: 100, y: getLumY(Math.pow(10, logL_right)), edge: 'right' });
        }

        // 3. Intersection with Top boundary (L = 10^maxLumLog, y = 0)
        const logT_top = (maxLumLog - 2 * Math.log10(r) + SB_CONST) / 4;
        if (logT_top >= logTempMin && logT_top <= logTempMax) {
          const xVal = getTempX(Math.pow(10, logT_top));
          if (!points.some((p) => Math.abs(p.x - xVal) < 0.2 && Math.abs(p.y - 0) < 0.2)) {
            points.push({ x: xVal, y: 0, edge: 'top' });
          }
        }

        // 4. Intersection with Bottom boundary (L = 10^minLumLog, y = 100)
        const logT_bot = (minLumLog - 2 * Math.log10(r) + SB_CONST) / 4;
        if (logT_bot >= logTempMin && logT_bot <= logTempMax) {
          const xVal = getTempX(Math.pow(10, logT_bot));
          if (!points.some((p) => Math.abs(p.x - xVal) < 0.2 && Math.abs(p.y - 100) < 0.2)) {
            points.push({ x: xVal, y: 100, edge: 'bottom' });
          }
        }

        if (points.length < 2) {
          return { r, label, color, isVisible: false, x1: 0, y1: 0, x2: 0, y2: 0, xLabel: 0, yLabel: 0 };
        }

        // Sort points left-to-right (x ascending)
        points.sort((a, b) => a.x - b.x);
        const p1 = points[0];
        const p2 = points[points.length - 1];

        // Place label on the right-hand side of the line (towards p2, the rightmost point)
        // If the line reaches the right portion of the chart (x >= 86), place it neatly around x = 86%
        // Otherwise, place it near the bottom-right terminus of the segment (84% towards p2)
        let tParam = 0.84;
        if (p2.x >= 86 && p1.x < 86) {
          tParam = (86 - p1.x) / (p2.x - p1.x);
        }

        let xLabel = p1.x + (p2.x - p1.x) * tParam;
        let yLabel = p1.y + (p2.y - p1.y) * tParam;

        // Ensure within visible plot bounds with margin
        if (yLabel > 93) {
          const tMaxY = (93 - p1.y) / (p2.y - p1.y);
          if (tMaxY > 0 && tMaxY < 1) {
            xLabel = p1.x + (p2.x - p1.x) * tMaxY;
            yLabel = 93;
          }
        }
        if (xLabel > 92) {
          const tMaxX = (92 - p1.x) / (p2.x - p1.x);
          if (tMaxX > 0 && tMaxX < 1) {
            xLabel = 92;
            yLabel = p1.y + (p2.y - p1.y) * tMaxX;
          }
        }

        return {
          r,
          label,
          color,
          isVisible: true,
          x1: p1.x,
          y1: p1.y,
          x2: p2.x,
          y2: p2.y,
          xLabel,
          yLabel,
        };
      })
      .filter((l) => l.isVisible);
  }, [logTempMax, logTempMin, maxLumLog, minLumLog]);

  // Main Sequence SVG Path Builder: strictly valid from O-type (~50,000 K) to M-type (~2,400 K) only
  const mainSequenceSvgPath = useMemo(() => {
    const validPts = MAIN_SEQUENCE_CURVE.filter(
      (pt) => pt.T >= 2400 && pt.T <= 50000 && pt.T >= minTemp * 0.8 && pt.T <= maxTemp * 1.2
    ).map((pt) => {
      const x = getTempX(pt.T);
      const y = getLumY(pt.L);
      return { x, y };
    });

    if (validPts.length < 2) return '';
    return validPts.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}` : `${acc} L ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
    }, '');
  }, [minTemp, maxTemp, minLumLog, maxLumLog]);

  // White Dwarf Track SVG Path
  const whiteDwarfSvgPath = useMemo(() => {
    const validPts = WHITE_DWARF_TRACK.filter(
      (pt) => pt.T >= minTemp * 0.8 && pt.T <= maxTemp * 1.2
    ).map((pt) => ({
      x: getTempX(pt.T),
      y: getLumY(pt.L),
    }));

    if (validPts.length < 2) return '';
    return validPts.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}` : `${acc} L ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
    }, '');
  }, [minTemp, maxTemp, minLumLog, maxLumLog]);

  // Giants (II & III) Track SVG Path (encompassing Blue to Red Giants)
  const giantsSvgPath = useMemo(() => {
    const validPts = GIANTS_TRACK.filter(
      (pt) => pt.T >= minTemp * 0.8 && pt.T <= maxTemp * 1.2
    ).map((pt) => ({
      x: getTempX(pt.T),
      y: getLumY(pt.L),
    }));

    if (validPts.length < 2) return '';
    return validPts.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}` : `${acc} L ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
    }, '');
  }, [minTemp, maxTemp, minLumLog, maxLumLog]);

  // Supergiant Ridge SVG Path
  const supergiantSvgPath = useMemo(() => {
    const validPts = SUPERGIANT_RIDGE.filter(
      (pt) => pt.T >= minTemp * 0.8 && pt.T <= maxTemp * 1.2
    ).map((pt) => ({
      x: getTempX(pt.T),
      y: getLumY(pt.L),
    }));

    if (validPts.length < 2) return '';
    return validPts.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}` : `${acc} L ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
    }, '');
  }, [minTemp, maxTemp, minLumLog, maxLumLog]);

  // Asymptotic Giant Branch (AGB) Track SVG Path
  const agbSvgPath = useMemo(() => {
    const validPts = AGB_TRACK.filter(
      (pt) => pt.T >= minTemp * 0.8 && pt.T <= maxTemp * 1.2
    ).map((pt) => ({
      x: getTempX(pt.T),
      y: getLumY(pt.L),
    }));

    if (validPts.length < 2) return '';
    return validPts.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}` : `${acc} L ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
    }, '');
  }, [minTemp, maxTemp, minLumLog, maxLumLog]);

  // Carbon Stars Chemical Locus SVG Path (Class C & S Stars)
  const carbonStarsSvgPath = useMemo(() => {
    const validPts = CARBON_STARS_TRACK.filter(
      (pt) => pt.T >= minTemp * 0.8 && pt.T <= maxTemp * 1.2
    ).map((pt) => ({
      x: getTempX(pt.T),
      y: getLumY(pt.L),
    }));

    if (validPts.length < 2) return '';
    return validPts.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}` : `${acc} L ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
    }, '');
  }, [minTemp, maxTemp, minLumLog, maxLumLog]);

  // Subgiants (Class IV) Track SVG Path
  const subgiantsSvgPath = useMemo(() => {
    const validPts = SUBGIANTS_TRACK.filter(
      (pt) => pt.T >= minTemp * 0.8 && pt.T <= maxTemp * 1.2
    ).map((pt) => ({
      x: getTempX(pt.T),
      y: getLumY(pt.L),
    }));

    if (validPts.length < 2) return '';
    return validPts.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}` : `${acc} L ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
    }, '');
  }, [minTemp, maxTemp, minLumLog, maxLumLog]);

  // Draw the cool metal-poor sequence and blue sdB/sdO locus as one connected trail.
  const subdwarfSvgPath = useMemo(() => {
    const luminosityOffset = Math.pow(10, -0.4 * 1.75);
    const coolPts = MAIN_SEQUENCE_CURVE.filter(
      (pt) => pt.T <= 7500 && pt.T >= 3000 && pt.T >= minTemp * 0.8 && pt.T <= maxTemp * 1.2
    ).map((pt) => ({
      x: getTempX(pt.T),
      y: getLumY(pt.L * luminosityOffset),
    }));

    // Hot-subdwarf branch (listed hottest to coolest), followed by a smooth
    // bridge into the cool subdwarf sequence. The HD 49798 high-luminosity branch
    // is intentionally excluded from this locus.
    const connectedSubdwarfPts = [
      { T: 75000, L: 180 },
      { T: 63000, L: 120 },
      { T: 45000, L: 80 },
      { T: 40000, L: 50 },
      { T: 35200, L: 32 },
      { T: 34500, L: 28 },
      { T: 29200, L: 22 },
      { T: 25000, L: 14 },
      { T: 18000, L: 8 },
      { T: 12000, L: 4.5 },
      { T: 9000, L: 3.2 },
      { T: 7500, L: MAIN_SEQUENCE_CURVE.find((pt) => pt.T === 7670)!.L * luminosityOffset },
    ].map((pt) => ({ x: getTempX(pt.T), y: getLumY(pt.L) }));
    connectedSubdwarfPts.push(...coolPts);

    const makePath = (points: { x: number; y: number }[]) =>
      points.reduce((acc, pt, idx) => {
        return idx === 0 ? `M ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}` : `${acc} L ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
      }, '');

    return connectedSubdwarfPts.length >= 2 ? makePath(connectedSubdwarfPts) : '';
  }, [minTemp, maxTemp, minLumLog, maxLumLog]);

  // Luminous Blue Variables (LBV) Instability Strip Highlighted Area SVG Polygon
  const lbvAreaSvgPath = useMemo(() => {
    const validPts = LBV_INSTABILITY_STRIP_BOUNDARY.filter(
      (pt) => pt.T >= minTemp * 0.7 && pt.T <= maxTemp * 1.3
    ).map((pt) => ({
      x: getTempX(pt.T),
      y: getLumY(pt.L),
    }));

    if (validPts.length < 3) return '';
    return (
      validPts.reduce((acc, pt, idx) => {
        return idx === 0 ? `M ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}` : `${acc} L ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
      }, '') + ' Z'
    );
  }, [minTemp, maxTemp, minLumLog, maxLumLog]);

  // Unified horizontal grid lines for both Luminosity and Absolute Magnitude
  const hrGridLines = useMemo(() => {
    const powers = [6, 4, 2, 0, -2, -4, -6, -8];

    return powers.map((p) => {
      const solarLum = Math.pow(10, p);
      const y = getLumY(solarLum);
      const mag = 5 - 2.5 * p; // Exact Pogson alignment: 6 -> -10, 4 -> -5, 2 -> 0, 0 -> +5, -2 -> +10, etc.
      return {
        power: p,
        solarLum,
        mag,
        magLabel: mag > 0 ? `+${mag}` : `${mag}`,
        y,
      };
    });
  }, [maxLumLog, minLumLog]);

  // Temperature tick indicators for X-axis (Classic sequence: WR to Y, 200 K to 250,000 K)
  const tempTicks = useMemo(() => {
    if (isMobileMode && !isLandscape) {
      return [
        { k: 100000, label: '100k' },
        { k: 30000, label: '30k' },
        { k: 10000, label: '10k' },
        { k: 6000, label: '6k' },
        { k: 3000, label: '3k' },
        { k: 1000, label: '1k' },
        { k: 250, label: '250 K' },
      ];
    }
    return [
      { k: 200000, label: '200,000 K' },
      { k: 100000, label: '100,000 K' },
      { k: 50000, label: '50,000 K' },
      { k: 30000, label: '30,000 K' },
      { k: 10000, label: '10,000 K' },
      { k: 6000, label: '6,000 K' },
      { k: 4000, label: '4,000 K' },
      { k: 2500, label: '2,500 K' },
      { k: 1000, label: '1,000 K' },
      { k: 250, label: '250 K' },
    ];
  }, [isMobileMode, isLandscape]);

  // Active bands visible in current domain
  const activeSpectralBands = useMemo(() => {
    return EXTENDED_SPECTRAL_BANDS.filter((band) => {
      return band.startK > minTemp && band.endK < maxTemp;
    });
  }, [minTemp, maxTemp]);

  return (
    <div className={`w-full flex flex-col ${isMobileMode ? 'gap-1.5' : 'gap-4'}`}>
      {/* Top Header Card (Uniform Hero Banner): Hidden in mobile landscape to maximize canvas viewport */}
      {(!isMobileMode || !isLandscape) && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#030a21] via-[#050f2e] to-[#03081a] border border-cyan-500/25 p-3.5 sm:p-6 mobile-landscape:p-2.5 mobile-landscape:py-2 shadow-xl backdrop-blur-md">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mobile-landscape:gap-2">
            <div className="space-y-1 sm:space-y-2 max-w-3xl">
              <h1 className="text-base sm:text-2xl lg:text-3xl mobile-landscape:text-sm font-black text-white tracking-tight flex items-center gap-2 sm:gap-3">
                <BarChart2 className="w-5 h-5 sm:w-7 sm:h-7 mobile-landscape:w-4 mobile-landscape:h-4 text-indigo-400 shrink-0" />
                <span>Hertzsprung–Russell Diagram</span>
              </h1>
              {!isMobileMode && (
                <p className="text-xs sm:text-sm md:text-base mobile-landscape:text-[11px] mobile-landscape:leading-snug text-slate-300 font-sans leading-relaxed">
                  The foundational map of stellar astrophysics across the classic sequence from scorching Wolf-Rayet stripped cores to ultracool Class Y brown dwarfs. Plots stellar luminosity against effective surface temperature, mapping the Main Sequence, Asymptotic Giant Branch (AGB), Carbon stars, and white dwarf cooling curves according to the Stefan–Boltzmann law.
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                id="hr-diagram-star-count"
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 mobile-landscape:px-2 mobile-landscape:py-0.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-mono text-[10px] sm:text-xs font-bold shadow-sm"
              >
                {filteredStars.length} Stars (WR → Y)
              </span>
              {onOpenClassificationGuide && (
                <button
                  onClick={onOpenClassificationGuide}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#020512]/90 hover:bg-cyan-950/80 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-mono font-semibold transition-all cursor-pointer shadow-sm shrink-0"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Classification Guide →</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop & Tablet Mode: "Search star" and related features located above the HR diagram */}
      {!isMobileMode && (
        <div className="w-full bg-gradient-to-r from-[#030612]/95 via-[#060e26]/95 to-[#040817]/95 border border-cyan-500/25 rounded-2xl p-3 shadow-xl flex flex-col gap-2.5">
          {/* Top Row: Search Star Bar, Domain Scale Toggle, and Filters Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Star Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="relative flex items-center gap-2.5 px-3.5 py-2 bg-[#020512]/90 border border-cyan-500/35 rounded-xl shadow-inner focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/40 transition-all">
                <Search className="w-4 h-4 text-cyan-400 shrink-0" />
                <input
                  id="input-hr-search-desktop"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search star (e.g. Sirius, Betelgeuse, Rigel)..."
                  className="bg-transparent text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-white/10 cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Instant Search Suggestions Floating Dropdown */}
              {searchQuery.trim() && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#030716]/98 backdrop-blur-2xl border border-cyan-500/50 rounded-xl p-1 shadow-[0_12px_35px_rgba(0,0,0,0.95)] max-h-56 overflow-y-auto z-50 flex flex-col gap-0.5">
                  <div className="px-2.5 py-1 text-[10px] font-mono text-cyan-400 font-bold border-b border-cyan-500/20 flex items-center justify-between">
                    <span>Matching Stars</span>
                    <span className="text-slate-400">{searchResults.length} found</span>
                  </div>
                  {searchResults.map((star) => (
                    <button
                      key={`search-res-desktop-${star.id}`}
                      onClick={() => {
                        setPinnedStar(star);
                        setSearchQuery('');
                        // Selecting a searched star selects the star on the HR diagram without automatically opening dossier
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between hover:bg-cyan-950/60 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_6px_currentColor]"
                          style={{ backgroundColor: star.colorHex }}
                        />
                        <RunningText
                          text={star.name}
                          className="text-xs font-bold text-white group-hover:text-cyan-300 font-sans"
                        />
                        {star.alternateNames.length > 0 && (
                          <span className="text-[10px] text-slate-500 font-mono hidden lg:inline truncate">
                            ({star.alternateNames[0]})
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400/80 shrink-0 ml-2">
                        {star.spectralType} • {star.temperature.toLocaleString()} K
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Related Features: Classic Domain Indicator & Diagram Filters Button */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Unified Classic Domain Badge */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#020512]/90 border border-cyan-500/30 rounded-xl text-xs font-mono font-bold text-cyan-300 shadow-sm"
                title="Unified Classic Sequence: 200 K to 250,000 K (Wolf-Rayet to Class Y Brown Dwarfs)"
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Classic (WR → Y)</span>
              </div>

              {/* Desktop Filter Toggle Button */}
              <button
                id="btn-hr-compact-filter"
                onClick={() => setIsCompactFilterOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-mono font-semibold shadow-md active:scale-95 cursor-pointer ${
                  activeGroupFilter !== 'ALL' || activeSpectralFilter !== null || !showIsoradiusLines || !showEvolutionaryZones
                    ? 'border-cyan-400 text-cyan-200 bg-cyan-950/80 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'bg-[#020512]/90 border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400/50'
                }`}
                title="Open Diagram Filters & Overlay Controls"
              >
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                <span>Filters</span>
                {(activeGroupFilter !== 'ALL' || activeSpectralFilter !== null) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse" />
                )}
              </button>

              {/* Reset Active Filters Button */}
              {(activeGroupFilter !== 'ALL' || activeSpectralFilter !== null || searchQuery || pinnedStar) && (
                <button
                  onClick={() => {
                    setActiveGroupFilter('ALL');
                    setActiveSpectralFilter(null);
                    setSearchQuery('');
                    setPinnedStar(null);
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-mono text-slate-400 hover:text-cyan-300 hover:bg-white/5 border border-transparent hover:border-cyan-500/20 cursor-pointer transition-all"
                  title="Reset active search and filters"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Quick Evolutionary Phase Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-cyan-500/15">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold shrink-0 mr-1">
              Phases:
            </span>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'MAIN_SEQUENCE', label: 'Main Sequence (V)' },
              { id: 'SUPERGIANTS', label: 'Supergiants' },
              { id: 'LBV', label: '★ LBV (Luminous Blue Variables)' },
              { id: 'GIANTS', label: 'Giants (II & III)' },
              { id: 'AGB', label: '★ AGB Branch' },
              { id: 'CARBON_STARS', label: '★ Carbon & S-Type (C/S)' },
              { id: 'SUBGIANTS', label: 'Subgiants (IV)' },
              { id: 'SUBDWARFS', label: 'Subdwarfs (VI)' },
              { id: 'WHITE_DWARFS', label: 'White Dwarfs' },
              { id: 'WOLF_RAYET', label: 'Wolf-Rayet' },
            ].map((tab) => {
              const isSelected = activeGroupFilter === tab.id;
              return (
                <button
                  key={`quick-phase-${tab.id}`}
                  onClick={() => handleGroupFilterChange(tab.id as EvolutionaryFilter)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 font-bold shadow-sm'
                      : 'bg-[#020512]/60 text-slate-400 border-cyan-500/15 hover:text-slate-200 hover:border-cyan-500/30'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Diagram Canvas Area (Dynamically fitted to screen size on mobile: landscape or portrait) */}
      <div
        id="hr-diagram-canvas-box"
        className={`relative w-full ${
          canvasHeight ? '' : 'h-[580px] sm:h-[660px] lg:h-[720px]'
        } bg-[#02040b] rounded-xl sm:rounded-2xl border border-cyan-500/25 overflow-hidden select-none shadow-[inset_0_4px_30px_rgba(0,0,0,0.9)] transition-[height] duration-200`}
        style={canvasHeight ? { height: `${canvasHeight}px` } : undefined}
      >
        {/* Search Bar, Stellar Classification & Selected Star Preview on Mobile */}
        {isMobileMode && (
          <div className="absolute z-40 pointer-events-auto bottom-0 left-0 right-0 w-full bg-[#020512]/98 backdrop-blur-2xl border-t border-cyan-500/30 shadow-[0_-8px_25px_rgba(0,0,0,0.85)] flex flex-col">
            {/* Mobile Controls: Stellar Classification & Search Star functionalities */}
            <div className={`px-2 ${isLandscape ? 'py-1 gap-1' : 'py-1.5 gap-1.5'} flex flex-col`}>
              {/* Spectral Class Filter Buttons - Stellar Classification Functionalities */}
              <div className={`flex items-center gap-1 justify-between w-full overflow-x-auto no-scrollbar ${isLandscape ? 'py-0' : 'py-0.5'}`}>
                {activeSpectralBands.map((band) => {
                  const isSelected = activeSpectralFilter === band.label;
                  return (
                    <button
                      key={`mobile-band-${band.label}`}
                      onClick={() => handleSpectralFilterChange(band.label)}
                      className={`flex-1 min-w-[20px] sm:min-w-[22px] ${isLandscape ? 'py-0.5 px-0.5' : 'py-1 px-1'} rounded-md text-center transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-cyan-950 border-cyan-400 text-white shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                          : 'bg-[#04091a]/80 border-cyan-500/20 text-slate-300 hover:border-cyan-500/40'
                      }`}
                      title={`${band.name}: ${band.desc}`}
                    >
                      <span
                        style={{ color: band.color }}
                        className="text-[10px] font-black leading-tight drop-shadow-[0_0_4px_currentColor]"
                      >
                        {band.label}
                      </span>
                    </button>
                  );
                })}
                {/* Dedicated Carbon (C) and S-Type (S) Mobile Quick Filter Buttons */}
                <button
                  key="mobile-band-C"
                  onClick={() => handleSpectralFilterChange('C')}
                  className={`flex-1 min-w-[20px] sm:min-w-[22px] ${isLandscape ? 'py-0.5 px-0.5' : 'py-1 px-1'} rounded-md text-center transition-all cursor-pointer border ${
                    activeSpectralFilter === 'C'
                      ? 'bg-red-950 border-red-400 text-white shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                      : 'bg-[#04091a]/80 border-red-500/30 text-slate-300 hover:border-red-500/60'
                  }`}
                  title="Class C: Carbon Stars (C/O > 1)"
                >
                  <span
                    style={{ color: '#ef4444' }}
                    className="text-[10px] font-black leading-tight drop-shadow-[0_0_4px_currentColor]"
                  >
                    C
                  </span>
                </button>
                <button
                  key="mobile-band-S"
                  onClick={() => handleSpectralFilterChange('S')}
                  className={`flex-1 min-w-[20px] sm:min-w-[22px] ${isLandscape ? 'py-0.5 px-0.5' : 'py-1 px-1'} rounded-md text-center transition-all cursor-pointer border ${
                    activeSpectralFilter === 'S'
                      ? 'bg-orange-950 border-orange-400 text-white shadow-[0_0_8px_rgba(255,87,34,0.5)]'
                      : 'bg-[#04091a]/80 border-orange-500/30 text-slate-300 hover:border-orange-500/60'
                  }`}
                  title="Class S: Zirconium Stars (ZrO bands)"
                >
                  <span
                    style={{ color: '#ff5722' }}
                    className="text-[10px] font-black leading-tight drop-shadow-[0_0_4px_currentColor]"
                  >
                    S
                  </span>
                </button>
                {activeSpectralFilter && (
                  <button
                    onClick={() => setActiveSpectralFilter(null)}
                    className="p-0.5 sm:p-1 rounded-md bg-slate-800 text-slate-400 hover:text-white shrink-0 text-[9px] font-mono"
                    title="Clear spectral filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Selected Star Preview on Mobile: Placed just above search stars functionality without altering HR diagram view */}
              {activeSpotlightStar && (
                <div
                  id="mobile-selected-star-preview"
                  className={`w-full flex items-center justify-between gap-2 ${
                    isLandscape ? 'px-2 py-0.5' : 'px-2.5 py-1'
                  } bg-gradient-to-r from-cyan-950/85 via-[#030718]/95 to-cyan-950/85 border border-cyan-500/35 rounded-lg text-white shadow-sm`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor] ring-1 ring-white/30"
                      style={{ backgroundColor: activeSpotlightStar.colorHex }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <RunningText
                          text={activeSpotlightStar.name}
                          className="text-xs font-bold text-white font-sans"
                        />
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-500/40 shrink-0">
                          {activeSpotlightStar.spectralType}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono hidden sm:inline truncate">
                          {activeSpotlightStar.constellation}
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono">
                        <span className="text-amber-300 font-semibold">{activeSpotlightStar.temperature.toLocaleString()} K</span>
                        <span className="text-slate-600 mx-1">•</span>
                        <span className="text-purple-300 font-semibold">
                          {activeSpotlightStar.luminositySolar >= 1e6
                            ? `${(activeSpotlightStar.luminositySolar / 1e6).toFixed(2)}M`
                            : activeSpotlightStar.luminositySolar >= 1e3
                            ? `${(activeSpotlightStar.luminositySolar / 1e3).toFixed(1)}k`
                            : activeSpotlightStar.luminositySolar >= 1
                            ? activeSpotlightStar.luminositySolar.toFixed(2)
                            : activeSpotlightStar.luminositySolar.toExponential(2)}{' '}
                          L☉
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      id="btn-mobile-preview-dossier"
                      onClick={() => onSelectStar(activeSpotlightStar)}
                      className="px-2.5 py-0.5 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-mono font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                      title="Open Star Dossier"
                    >
                      Dossier
                    </button>
                    <button
                      id="btn-mobile-preview-dismiss"
                      onClick={() => {
                        setPinnedStar(null);
                        setHoveredStar(null);
                      }}
                      className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-white/10 cursor-pointer transition-colors"
                      title="Deselect star"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Search Input, Filters, and Domain Toggle on Mobile */}
              <div className={`flex items-center gap-1.5 ${isLandscape ? 'w-full' : 'w-full'}`}>
                {/* Search Bar Pill */}
                <div className="relative flex-1 sm:flex-initial flex items-center gap-1.5 px-2.5 py-1 bg-[#030716]/92 backdrop-blur-xl border border-cyan-500/40 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.85)] transition-all">
                  <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <input
                    id="input-hr-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search star..."
                    className={`bg-transparent text-white text-[11px] font-mono placeholder:text-slate-500 focus:outline-none ${
                      isLandscape ? 'w-full' : 'w-full'
                    } transition-all`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-white/10 cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}

                  {/* Instant Search Suggestions Floating Dropdown (Opens UPWARDS on mobile so it doesn't get hidden) */}
                  {searchQuery.trim() && searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 bottom-full mb-1.5 bg-[#030716]/98 backdrop-blur-2xl border border-cyan-500/50 rounded-xl p-1 shadow-[0_12px_35px_rgba(0,0,0,0.95)] max-h-44 overflow-y-auto z-50 flex flex-col gap-0.5">
                      {searchResults.map((star) => (
                        <button
                          key={`search-res-${star.id}`}
                          onClick={() => {
                            setPinnedStar(star);
                            setSearchQuery('');
                            // Selecting a searched star selects it on the HR diagram without automatically opening dossier
                          }}
                          className="w-full px-2 py-1.5 rounded-lg text-left flex items-center justify-between hover:bg-cyan-950/60 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_6px_currentColor]"
                              style={{ backgroundColor: star.colorHex }}
                            />
                            <RunningText
                              text={star.name}
                              className="text-[11px] font-bold text-white group-hover:text-cyan-300 font-sans"
                            />
                          </div>
                          <span className="text-[9px] font-mono text-cyan-400/80 shrink-0 ml-1">
                            {star.spectralType} • {star.temperature.toLocaleString()} K
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Compact Filter Toggle Button */}
                <button
                  id="btn-hr-compact-filter"
                  onClick={() => setIsCompactFilterOpen(true)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#030716]/92 backdrop-blur-xl border transition-all text-[11px] font-mono font-semibold shadow-md active:scale-95 cursor-pointer shrink-0 ${
                    activeGroupFilter !== 'ALL' || activeSpectralFilter !== null || !showIsoradiusLines || !showEvolutionaryZones
                      ? 'border-cyan-400 text-cyan-200 bg-cyan-950/80 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'border-cyan-500/40 text-cyan-300 hover:text-white'
                  }`}
                  title="Open Diagram Filters"
                >
                  <Filter className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Filters</span>
                  {(activeGroupFilter !== 'ALL' || activeSpectralFilter !== null) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Top Header Labels for Axes (Desktop only - removed on mobile to maximize canvas space) */}
        {!isMobileMode && (
          <>
            <div
              className="absolute top-2 text-[9px] sm:text-[11px] font-bold text-cyan-400 uppercase font-mono tracking-wider z-30 pointer-events-none drop-shadow flex items-center gap-1 sm:gap-1.5"
              style={{ left: `${plotInsetLeft}px` }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
              <span>Luminosity (L / L☉)</span>
            </div>

            <div
              className="absolute top-2 text-[9px] sm:text-[11px] font-bold text-purple-400 uppercase font-mono tracking-wider z-30 pointer-events-none drop-shadow flex items-center gap-1 sm:gap-1.5 text-right"
              style={{ right: `${plotInsetRight}px` }}
            >
              <span>Absolute Mag (M_bol)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]" />
            </div>

            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] font-bold text-cyan-300/90 uppercase font-mono tracking-wider z-30 pointer-events-none bg-[#030716]/95 px-3 py-0.5 rounded-full border border-cyan-500/30 shadow-md flex items-center gap-1">
              <span>← Effective Surface Temperature (Kelvin) [Hot to Cool]</span>
            </div>
          </>
        )}

        {/* LEFT Y-AXIS CONTAINER: Synchronized with plot frame top & bottom and aligned to chart border */}
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: 0,
            top: `${plotInsetTop}px`,
            bottom: `${plotInsetBottom}px`,
            width: `${plotInsetLeft}px`,
          }}
        >
          {hrGridLines.map((line) => (
            <div
              key={`lum-label-${line.power}`}
              className="absolute right-0 text-[8px] sm:text-[10px] font-bold text-cyan-300 font-mono -translate-y-1/2 flex items-center justify-end gap-0.5 sm:gap-1"
              style={{ top: `${line.y}%` }}
            >
              <span className="tracking-tighter">
                10<sup>{line.power}</sup>
              </span>
              <div className="w-1 sm:w-2 h-[1.5px] bg-cyan-400/80" />
            </div>
          ))}
        </div>

        {/* RIGHT Y-AXIS CONTAINER: Synchronized with plot frame top & bottom and aligned to chart border */}
        <div
          className="absolute pointer-events-none z-20"
          style={{
            right: 0,
            top: `${plotInsetTop}px`,
            bottom: `${plotInsetBottom}px`,
            width: `${plotInsetRight}px`,
          }}
        >
          {hrGridLines.map((line) => (
            <div
              key={`mag-label-${line.mag}`}
              className="absolute left-0 text-[8px] sm:text-[10px] font-bold text-purple-300 font-mono -translate-y-1/2 flex items-center justify-start gap-0.5 sm:gap-1"
              style={{ top: `${line.y}%` }}
            >
              <div className="w-1 sm:w-2 h-[1.5px] bg-purple-400/80" />
              <span className="tracking-tighter">
                {line.magLabel}
              </span>
            </div>
          ))}
        </div>

        {/* PLOT AREA FRAME */}
        <div
          className="absolute overflow-hidden rounded-xl border border-cyan-500/25 bg-[#020512]/70"
          style={{
            left: `${plotInsetLeft}px`,
            right: `${plotInsetRight}px`,
            top: `${plotInsetTop}px`,
            bottom: `${plotInsetBottom}px`,
          }}
        >
          
          {/* Background Spectral Color Gradients aligned with exact temperature domain (WR to Y) */}
          {showSpectralShading && (
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to right, #818cf8 0%, #93b6ff 18%, #b8d5ff 32%, #e4efff 44%, #fff5ea 54%, #ffe5c4 62%, #ffc58a 72%, #ff9852 82%, #e65c1e 90%, #ba3208 95%, #5c0f02 100%)',
              }}
            />
          )}

          {/* SVG Overlay: Coordinate Grid, Stefan-Boltzmann Isoradius lines, and Evolutionary tracks */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Defs for glows and markers */}
            <defs>
              <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-soft" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="0.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="giants-track-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.85" />
                <stop offset="55%" stopColor="#facc15" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="lbv-area-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.22" />
              </linearGradient>
              <pattern id="lbv-strip-pattern" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.2" />
              </pattern>
            </defs>

            {/* Horizontal Gridlines (Unified Luminosity & Absolute Magnitude) */}
            {hrGridLines.map((line) => (
              <line
                key={`svg-grid-line-${line.power}`}
                x1="0"
                y1={line.y}
                x2="100"
                y2={line.y}
                stroke="#06b6d4"
                strokeOpacity="0.14"
                strokeWidth="0.35"
              />
            ))}

            {/* Vertical Gridlines (Spectral band bounds) */}
            {activeSpectralBands.map((band) => {
              const x = getTempX(band.startK);
              return (
                <line
                  key={`svg-vgrid-${band.label}`}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="100"
                  stroke="#06b6d4"
                  strokeOpacity="0.09"
                  strokeWidth="0.3"
                />
              );
            })}

            {/* Stefan-Boltzmann Isoradius Lines (Constant Solar Radius dotted diagonals) */}
            {showIsoradiusLines &&
              isoradiusLines.map(
                (line) =>
                  line.isVisible && (
                    <g key={`iso-line-${line.label}`}>
                      <line
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke={line.color}
                        strokeWidth={line.r === 1.0 ? "0.45" : "0.32"}
                        strokeDasharray="0.35 0.75"
                        strokeLinecap="round"
                        strokeOpacity={line.r === 1.0 ? "0.85" : "0.55"}
                      />
                    </g>
                  )
              )}

            {/* Evolutionary Regions: Luminous Blue Variables (LBV) Instability Strip Highlighted Area */}
            {showEvolutionaryZones && lbvAreaSvgPath && (
              <g id="lbv-instability-strip-group">
                {/* Soft glowing area fill */}
                <path
                  d={lbvAreaSvgPath}
                  fill="url(#lbv-area-gradient)"
                />
                {/* Subtle diagonal instability pattern overlay */}
                <path
                  d={lbvAreaSvgPath}
                  fill="url(#lbv-strip-pattern)"
                />
                {/* Glowing solid boundary line */}
                <path
                  d={lbvAreaSvgPath}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  strokeOpacity="0.85"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow-cyan)"
                />
              </g>
            )}

            {/* Evolutionary Regions: Main Sequence Corridor & Backbone Curve */}
            {showEvolutionaryZones && mainSequenceSvgPath && (
              <g id="main-sequence-group">
                {/* Soft illuminated Main Sequence corridor (representing the ±0.35 dex hydrogen burning band) */}
                <path
                  d={mainSequenceSvgPath}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="5.5"
                  strokeOpacity="0.12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Core Main Sequence locus spine */}
                <path
                  d={mainSequenceSvgPath}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="0.85"
                  strokeOpacity="0.85"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow-cyan)"
                />
              </g>
            )}

            {/* Evolutionary Regions: White Dwarf Cooling Track (Solid Line) */}
            {showEvolutionaryZones && whiteDwarfSvgPath && (
              <g id="white-dwarf-group">
                <path
                  d={whiteDwarfSvgPath}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="0.65"
                  strokeOpacity="0.75"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* Evolutionary Regions: Giants Track (Classes II & III, Solid Line encompassing Blue to Red Giants) */}
            {showEvolutionaryZones && giantsSvgPath && (
              <g id="giants-group">
                <path
                  d={giantsSvgPath}
                  fill="none"
                  stroke="url(#giants-track-gradient)"
                  strokeWidth="0.75"
                  strokeOpacity="0.85"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* Evolutionary Regions: Supergiants Ridge (Solid Line) */}
            {showEvolutionaryZones && supergiantSvgPath && (
              <g id="supergiant-group">
                <path
                  d={supergiantSvgPath}
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="0.7"
                  strokeOpacity="0.75"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* Evolutionary Regions: Asymptotic Giant Branch (AGB) Track (Double-Shell Burning) */}
            {showEvolutionaryZones && agbSvgPath && (
              <g id="agb-branch-group">
                <path
                  d={agbSvgPath}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="4.5"
                  strokeOpacity="0.16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={agbSvgPath}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="0.85"
                  strokeOpacity="0.85"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )}

            {/* Evolutionary Regions: Carbon Stars Chemical Locus (C & S Types, C/O >= 1) */}
            {showEvolutionaryZones && carbonStarsSvgPath && (
              <g id="carbon-stars-group">
                <path
                  d={carbonStarsSvgPath}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4.5"
                  strokeOpacity="0.18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={carbonStarsSvgPath}
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="0.8"
                  strokeOpacity="0.85"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )}

            {/* Evolutionary Regions: Subgiants Track (Class IV) */}
            {showEvolutionaryZones && subgiantsSvgPath && (
              <g id="subgiants-group">
                <path
                  d={subgiantsSvgPath}
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="0.65"
                  strokeOpacity="0.7"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* Evolutionary Regions: Metal-Poor Subdwarf (Class VI) Trail */}
            {showEvolutionaryZones && subdwarfSvgPath && (
              <g id="subdwarf-group">
                <path
                  d={subdwarfSvgPath}
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="0.75"
                  strokeOpacity="0.85"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )}
          </svg>

          {/* Isoradius Text Labels: Positioned along each dotted line (Desktop only - removed on mobile for clarity) */}
          {!isMobileMode &&
            showIsoradiusLines &&
            isoradiusLines.map(
              (line) =>
                line.isVisible &&
                line.xLabel >= 3 &&
                line.xLabel <= 97 &&
                line.yLabel >= 3 &&
                line.yLabel <= 97 && (
                  <div
                    key={`lbl-${line.label}`}
                    className="absolute text-[8px] sm:text-[9px] font-mono font-medium pointer-events-none px-1.5 py-0.5 rounded-full bg-[#020510]/95 border -translate-x-1/2 -translate-y-1/2 shadow-sm whitespace-nowrap z-20 flex items-center gap-1 backdrop-blur-xs"
                    style={{
                      left: `${line.xLabel}%`,
                      top: `${line.yLabel}%`,
                      color: line.color,
                      borderColor: `${line.color}45`,
                      boxShadow: `0 0 6px ${line.color}20`,
                    }}
                  >
                    <span
                      className="w-1 h-1 rounded-full inline-block"
                      style={{ backgroundColor: line.color }}
                    />
                    <span>{line.label}</span>
                  </div>
                )
            )}

          {/* Evolutionary Zone Educational Badges (Desktop only - removed on mobile to keep plot clear) */}
          {!isMobileMode && showEvolutionaryZones && (
            <>
              {/* Supergiants Ridge Badge */}
              <div
                className="absolute pointer-events-none text-[9px] sm:text-[10px] font-mono font-bold text-amber-300 bg-amber-950/90 border border-amber-500/50 px-2 py-0.5 rounded-full shadow-md z-20 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${getTempX(12000)}%`,
                  top: `${getLumY(300000)}%`,
                }}
              >
                ★ Supergiants & Hypergiants (Ia+, Ia, Ib)
              </div>

              {/* Luminous Blue Variables (LBV) Instability Strip Badge */}
              <div
                className="absolute pointer-events-none text-[8.5px] sm:text-[9.5px] font-mono font-bold text-sky-200 bg-sky-950/95 border border-sky-400/70 px-2.5 py-0.5 rounded-full shadow-lg z-20 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 backdrop-blur-xs"
                style={{
                  left: `${getTempX(15500)}%`,
                  top: `${getLumY(2200000)}%`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span>★ LBV Instability Strip</span>
              </div>

              {/* Giants Track Badge (II & III) */}
              <div
                className="absolute pointer-events-none text-[9px] sm:text-[10px] font-mono font-bold text-orange-300 bg-orange-950/90 border border-orange-500/50 px-2 py-0.5 rounded-full shadow-md z-20 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${getTempX(4500)}%`,
                  top: `${getLumY(300)}%`,
                }}
              >
                ★ Giants (II & III)
              </div>

              {/* Main Sequence (V) Badge: Positioned between the subdwarf and subgiant labels */}
              <div
                className="absolute pointer-events-none text-[9px] sm:text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/95 border border-cyan-400/60 px-2.5 py-0.5 rounded-full shadow-lg z-20 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${getTempX(5100)}%`,
                  top: `${getLumY(0.8)}%`,
                }}
              >
                ★ Main Sequence (V)
              </div>

              {/* White Dwarfs Zone Badge */}
              <div
                className="absolute pointer-events-none text-[9px] sm:text-[10px] font-mono font-bold text-purple-300 bg-purple-950/90 border border-purple-500/50 px-2 py-0.5 rounded-full shadow-md z-20 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${getTempX(14000)}%`,
                  top: `${getLumY(0.005)}%`,
                }}
              >
                ★ White Dwarfs (VII)
              </div>

              {/* Asymptotic Giant Branch (AGB) Badge */}
              <div
                className="absolute pointer-events-none text-[8.5px] sm:text-[9.5px] font-mono font-bold text-amber-300 bg-amber-950/95 border border-amber-500/60 px-2.5 py-0.5 rounded-full shadow-lg z-20 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5"
                style={{
                  left: `${getTempX(2950)}%`,
                  top: `${getLumY(14000)}%`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>★ AGB (Asymptotic Giant Branch)</span>
              </div>

              {/* Carbon Stars (Class C & S) Badge */}
              <div
                className="absolute pointer-events-none text-[8.5px] sm:text-[9.5px] font-mono font-bold text-red-300 bg-red-950/95 border border-red-500/60 px-2.5 py-0.5 rounded-full shadow-lg z-20 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5"
                style={{
                  left: `${getTempX(2350)}%`,
                  top: `${getLumY(4500)}%`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>★ Carbon Stars (Class C, C/O &gt; 1)</span>
              </div>

              {/* Subgiants (IV) Badge */}
              <div
                className="absolute pointer-events-none text-[8px] sm:text-[9px] font-mono font-bold text-emerald-300 bg-emerald-950/90 border border-emerald-500/50 px-2 py-0.5 rounded-full shadow-md z-20 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${getTempX(6200)}%`,
                  top: `${getLumY(6.5)}%`,
                }}
              >
                ★ Subgiants (IV)
              </div>

              {/* Subdwarf (VI) Trail Badge */}
              <div
                className="absolute pointer-events-none text-[8px] sm:text-[9px] font-mono font-bold text-violet-200 bg-violet-950/90 border border-violet-500/50 px-2 py-0.5 rounded-full shadow-md z-20 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${getTempX(5500)}%`,
                  top: `${getLumY(0.12)}%`,
                }}
              >
                ★ Subdwarfs (VI)
              </div>

              {/* Brown Dwarfs Zone Badge */}
              <div
                className="absolute pointer-events-none text-[8px] sm:text-[9px] font-mono font-bold text-fuchsia-300 bg-fuchsia-950/90 border border-fuchsia-500/50 px-2 py-0.5 rounded-full shadow-md z-20 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${getTempX(1000)}%`,
                  top: `${getLumY(0.000005)}%`,
                }}
              >
                ★ Brown Dwarfs (L, T, Y)
              </div>
            </>
          )}

          {/* Star Interactive Data Points */}
          {filteredStars.map((star) => {
            const coords = getCoordinates(star);
            const isSelected = selectedStars.some((s) => s.id === star.id);
            const isHovered = hoveredStar?.id === star.id;
            const isPinned = pinnedStar?.id === star.id;

            // Dot size scaling
            let dotSize = 8;
            if (star.diameterSolar >= 1000) dotSize = 18;
            else if (star.diameterSolar >= 100) dotSize = 14;
            else if (star.diameterSolar >= 10) dotSize = 11;
            else if (star.diameterSolar < 0.1) dotSize = 7;

            return (
              <div
                key={star.id}
                id={`hr-dot-${star.id}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center cursor-pointer transition-transform z-10"
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                  zIndex: isHovered || isPinned ? 45 : isSelected ? 35 : 15,
                }}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={(event) => {
                  const previewCard = document.getElementById('hr-star-preview-card');
                  if (previewCard?.contains(event.relatedTarget as Node | null)) return;
                  setHoveredStar(null);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isMobileMode) {
                    if (pinnedStar?.id === star.id) {
                      onSelectStar(star);
                    } else {
                      setPinnedStar(star);
                    }
                  } else {
                    setPinnedStar(star);
                    onSelectStar(star);
                  }
                }}
              >
                {/* Physical circular marker dot, pixel-perfect centered */}
                <div
                  className={`rounded-full transition-all duration-150 ${
                    isSelected || isPinned
                      ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#02040b] scale-125 shadow-[0_0_15px_#22d3ee]'
                      : isHovered
                      ? 'scale-150 ring-2 ring-white'
                      : 'hover:scale-130'
                  }`}
                  style={{
                    width: `${dotSize}px`,
                    height: `${dotSize}px`,
                    backgroundColor: star.colorHex,
                    boxShadow: `0 0 12px ${star.colorHex}`,
                  }}
                />
                {isPinned && (
                  <div
                    className="absolute rounded-full border-2 border-cyan-400 animate-ping opacity-75 pointer-events-none"
                    style={{
                      width: `${Math.max(dotSize + 12, 22)}px`,
                      height: `${Math.max(dotSize + 12, 22)}px`,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Star Details Hover / Pinned Overlay (Desktop only) */}
        {!isMobileMode && (hoveredStar || pinnedStar) && (() => {
          const displayStar = hoveredStar || pinnedStar;
          if (!displayStar) return null;
          const coords = getCoordinates(displayStar);
          const isNearTop = coords.y < 42;
          const sc = formatPhysicalDiameter(displayStar.diameterKm, displayStar.diameterSolar);

          return (
            <div
              className="absolute z-50 pointer-events-none transition-all duration-75 ease-out"
              style={{
                left: `clamp(140px, calc(64px + (100% - 128px) * ${coords.x / 100}), calc(100% - 140px))`,
                top: `calc(32px + (100% - 90px) * ${coords.y / 100})`,
                transform: isNearTop ? 'translate(-50%, 16px)' : 'translate(-50%, calc(-100% - 16px))',
              }}
            >
              <div
                id="hr-star-preview-card"
                className="pointer-events-auto bg-[#05091a]/95 backdrop-blur-xl p-3.5 rounded-xl border border-cyan-400/60 shadow-[0_12px_35px_rgba(0,0,0,0.85)] flex flex-col gap-2 w-[290px] sm:w-[320px] max-w-[92vw]"
                style={{
                  boxShadow: `0 0 25px ${displayStar.colorHex}44, 0 10px 30px rgba(0,0,0,0.9)`,
                }}
                onMouseLeave={() => {
                  if (!pinnedStar) setHoveredStar(null);
                }}
              >
                {/* Header: Full star name displayed in full, with classification label placed below */}
                <div className="border-b border-cyan-500/25 pb-2">
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span
                        className="w-3.5 h-3.5 rounded-full flex-shrink-0 mt-0.5 shadow-[0_0_8px_currentColor]"
                        style={{ backgroundColor: displayStar.colorHex }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-white font-sans leading-snug break-words">
                          {displayStar.name}
                        </h4>
                        {/* Classification label sits below the star name */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#091129] text-cyan-300 font-mono border border-cyan-500/40 font-semibold inline-block">
                            {displayStar.spectralType}
                          </span>
                          {(displayStar.stellarStage === 'Carbon Star' || displayStar.spectralClass === 'C') && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-950 text-red-300 font-mono border border-red-500/60 font-bold inline-block">
                              ★ Carbon Star (C/O &gt; 1)
                            </span>
                          )}
                          {(displayStar.stellarStage === 'S-Type Star' || displayStar.spectralClass === 'S') && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-orange-950 text-orange-300 font-mono border border-orange-500/60 font-bold inline-block">
                              ★ S-Type Star (ZrO / ⁹⁹Tc)
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">
                            {displayStar.constellation}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Close star preview"
                      title="Close star preview"
                      onClick={(event) => {
                        event.stopPropagation();
                        setPinnedStar(null);
                        setHoveredStar(null);
                      }}
                      className="shrink-0 p-1 -mt-1 -mr-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                  <div className="p-1.5 bg-[#020510]/90 rounded-lg border border-cyan-500/20">
                    <span className="text-slate-400 block text-[9px] uppercase font-sans">Temperature</span>
                    <span className="text-amber-300 font-bold">{displayStar.temperature.toLocaleString()} K</span>
                  </div>
                  <div className="p-1.5 bg-[#020510]/90 rounded-lg border border-cyan-500/20">
                    <span className="text-slate-400 block text-[9px] uppercase font-sans">Luminosity</span>
                    <span className="text-purple-300 font-bold">
                      {displayStar.luminositySolar >= 1e6
                        ? `${(displayStar.luminositySolar / 1e6).toFixed(2)}M`
                        : displayStar.luminositySolar >= 1e3
                        ? `${(displayStar.luminositySolar / 1e3).toFixed(1)}k`
                        : displayStar.luminositySolar >= 1
                        ? displayStar.luminositySolar.toFixed(2)
                        : displayStar.luminositySolar.toExponential(2)}{' '}
                      L☉
                    </span>
                  </div>
                  <div className="p-1.5 bg-[#020510]/90 rounded-lg border border-cyan-500/20">
                    <span className="text-slate-400 block text-[9px] uppercase font-sans">Diameter</span>
                    <span className="text-cyan-300 font-bold block break-words leading-tight">{sc.metricSi}</span>
                    <span className="text-slate-400 text-[9px]">{sc.solarFormatted}</span>
                  </div>
                  <div className="p-1.5 bg-[#020510]/90 rounded-lg border border-cyan-500/20">
                    <span className="text-slate-400 block text-[9px] uppercase font-sans">Stage</span>
                    <span className="text-blue-300 font-bold block break-words leading-tight">{displayStar.stellarStage}</span>
                    <span className="text-slate-400 text-[9px] block">{displayStar.massSolar.toFixed(1)} M☉</span>
                  </div>
                </div>

                <div className="text-[9px] text-cyan-300/80 font-mono text-center pt-0.5 flex items-center justify-between">
                  <span>{pinnedStar?.id === displayStar.id ? '★ Selected on diagram' : 'Hovered star'}</span>
                  <span>Click dot to view full dossier</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* X-Axis Temperature Tick Markers Bar */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${plotInsetLeft}px`,
            right: `${plotInsetRight}px`,
            bottom: isMobileMode
              ? `${Math.max(2, plotInsetBottom - (isLandscape ? 14 : 18))}px`
              : '25px',
            height: '20px',
          }}
        >
          {tempTicks.map((tick) => {
            const x = getTempX(tick.k);
            return (
              <div
                key={`temp-tick-${tick.k}`}
                className="absolute -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${x}%` }}
              >
                <div className="w-[1px] h-1.5 bg-cyan-400/50" />
                <span className="text-[7.5px] sm:text-[8.5px] font-mono text-slate-400 font-semibold whitespace-nowrap">
                  {tick.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* X-Axis Spectral Sequence Bar at Bottom: Desktop only; on mobile it is merged into the sticky bottom bar */}
        {!isMobileMode && (
          <div
            className="absolute pointer-events-auto bg-[#020510]/95 rounded-lg sm:rounded-xl border border-cyan-500/20 shadow-inner flex overflow-hidden"
            style={{
              left: `${plotInsetLeft}px`,
              right: `${plotInsetRight}px`,
              bottom: '3px',
              height: '23px',
            }}
          >
            {activeSpectralBands.map((band) => {
              const isSelected = activeSpectralFilter === band.label;
              const xStart = Math.max(0, getTempX(band.startK));
              const xEnd = Math.min(100, getTempX(band.endK));
              const widthPct = Math.max(2, xEnd - xStart);

              return (
                <button
                  key={band.label}
                  onClick={() => handleSpectralFilterChange(band.label)}
                  style={{
                    width: `${widthPct}%`,
                  }}
                  className={`flex flex-col items-center justify-center py-0.5 rounded transition-all cursor-pointer group border-r border-cyan-500/15 last:border-r-0 ${
                    isSelected ? 'bg-cyan-950 ring-1 ring-cyan-400 shadow-sm z-10' : 'hover:bg-[#060e24]'
                  }`}
                  title={`${band.name}: ${band.desc}`}
                >
                  <span
                    style={{ color: band.color }}
                    className="text-[9px] sm:text-[11px] font-black drop-shadow-[0_0_5px_currentColor] group-hover:scale-110 transition-transform leading-tight"
                  >
                    {band.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Compact Filters Modal / Drawer */}
      {isCompactFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsCompactFilterOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#030716] border-t sm:border border-cyan-500/30 rounded-t-2xl sm:rounded-2xl p-4 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-sans">Diagram Filters & Controls</h3>
              </div>
              <button
                onClick={() => setIsCompactFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Evolutionary Phase Filters */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Evolutionary Phase
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {[
                  { id: 'ALL', label: `All Stars (${stars.length})` },
                  { id: 'MAIN_SEQUENCE', label: 'Main Sequence (V)' },
                  { id: 'SUPERGIANTS', label: 'Supergiants & Hypergiants' },
                  { id: 'LBV', label: 'Luminous Blue Variables (LBV)' },
                  { id: 'GIANTS', label: 'Giants (II & III)' },
                  { id: 'AGB', label: 'Asymptotic Giant Branch (AGB)' },
                  { id: 'CARBON_STARS', label: 'Carbon & S-Type Stars (C & S)' },
                  { id: 'SUBGIANTS', label: 'Subgiants (IV)' },
                  { id: 'SUBDWARFS', label: 'Subdwarfs (VI)' },
                  { id: 'WHITE_DWARFS', label: 'White Dwarfs' },
                  { id: 'WOLF_RAYET', label: 'Wolf-Rayet' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      handleGroupFilterChange(tab.id as EvolutionaryFilter);
                      setIsCompactFilterOpen(false);
                    }}
                    className={`text-xs font-mono px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                      activeGroupFilter === tab.id
                        ? 'bg-cyan-500/25 text-cyan-300 border-cyan-400 shadow-sm font-bold'
                        : 'bg-[#050a1c] text-slate-400 border-cyan-500/15 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Spectral Class Filter Grid */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Spectral Class Filter
                </label>
                {activeSpectralFilter && (
                  <button
                    onClick={() => setActiveSpectralFilter(null)}
                    className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
                  >
                    Clear Filter ({activeSpectralFilter})
                  </button>
                )}
              </div>
              
              {/* Core Harvard OBAFGKM Sequence */}
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Harvard Core (O–M)</span>
              <div className="grid grid-cols-7 gap-1">
                {[
                  { label: 'O', title: 'Class O (≥ 30,000 K)', color: '#4d88ff' },
                  { label: 'B', title: 'Class B (10,000–30,000 K)', color: '#8cb5ff' },
                  { label: 'A', title: 'Class A (7,500–10,000 K)', color: '#d8e5ff' },
                  { label: 'F', title: 'Class F (6,000–7,500 K)', color: '#fff8ea' },
                  { label: 'G', title: 'Class G (5,200–6,000 K)', color: '#fff2a8' },
                  { label: 'K', title: 'Class K (3,700–5,200 K)', color: '#ffb969' },
                  { label: 'M', title: 'Class M (2,400–3,700 K)', color: '#ff6242' },
                ].map((spec) => {
                  const isSelected = activeSpectralFilter === spec.label;
                  return (
                    <button
                      key={`drawer-spec-${spec.label}`}
                      onClick={() => {
                        handleSpectralFilterChange(spec.label);
                        setIsCompactFilterOpen(false);
                      }}
                      title={spec.title}
                      className={`py-2 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'bg-cyan-950 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400'
                          : 'bg-[#050a1c] border-cyan-500/20 text-slate-300 hover:border-cyan-400/50'
                      }`}
                    >
                      <span
                        style={{ color: spec.color }}
                        className="text-xs font-black font-mono drop-shadow-[0_0_4px_currentColor]"
                      >
                        {spec.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Beyond OBAFGKM & Peculiar Branches */}
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mt-1">Beyond OBAFGKM & Peculiar</span>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
                {[
                  { label: 'C', title: 'Carbon Stars (C/O > 1)', color: '#ef4444' },
                  { label: 'S', title: 'Zirconium Stars (ZrO / ⁹⁹Tc)', color: '#ff5722' },
                  { label: 'LBV', title: 'Luminous Blue Variables (S Doradus / LBV)', color: '#38bdf8' },
                  { label: 'L', title: 'Class L Brown Dwarfs', color: '#d64536' },
                  { label: 'T', title: 'Class T Methane Dwarfs', color: '#993d6e' },
                  { label: 'Y', title: 'Class Y Ultracool Dwarfs', color: '#552244' },
                  { label: 'WR', title: 'Wolf-Rayet Stripped Cores', color: '#38bdf8' },
                  { label: 'WD', title: 'White Dwarf Degenerate Cores', color: '#a855f7' },
                ].map((spec) => {
                  const isSelected = activeSpectralFilter === spec.label;
                  return (
                    <button
                      key={`drawer-spec-${spec.label}`}
                      onClick={() => {
                        handleSpectralFilterChange(spec.label);
                        setIsCompactFilterOpen(false);
                      }}
                      title={spec.title}
                      className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'bg-cyan-950 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400'
                          : 'bg-[#050a1c] border-cyan-500/20 text-slate-300 hover:border-cyan-400/50'
                      }`}
                    >
                      <span
                        style={{ color: spec.color }}
                        className="text-xs font-black font-mono drop-shadow-[0_0_4px_currentColor]"
                      >
                        {spec.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Layer Toggles */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Diagram Overlays
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowIsoradiusLines((v) => !v)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold flex items-center justify-between border cursor-pointer ${
                    showIsoradiusLines
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/60'
                      : 'bg-[#050a1c] text-slate-400 border-cyan-500/15'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Radius Lines</span>
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${showIsoradiusLines ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    {showIsoradiusLines ? 'ON' : 'OFF'}
                  </span>
                </button>

                <button
                  onClick={() => setShowEvolutionaryZones((v) => !v)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold flex items-center justify-between border cursor-pointer ${
                    showEvolutionaryZones
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/60'
                      : 'bg-[#050a1c] text-slate-400 border-cyan-500/15'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Tracks</span>
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${showEvolutionaryZones ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    {showEvolutionaryZones ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>

            {/* Reset Filters */}
            <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20">
              <button
                onClick={() => {
                  setActiveGroupFilter('ALL');
                  setActiveSpectralFilter(null);
                  setSearchQuery('');
                  setIsCompactFilterOpen(false);
                }}
                className="text-xs text-slate-400 hover:text-cyan-300 font-mono underline cursor-pointer"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setIsCompactFilterOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs font-mono cursor-pointer"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
