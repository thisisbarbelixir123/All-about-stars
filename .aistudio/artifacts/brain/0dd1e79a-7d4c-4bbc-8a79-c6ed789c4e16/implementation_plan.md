# Mobile Catalog Optimization, Bi-Directional Spiral 3D Stage & Header Simplification

Comprehensive update to stellar comparison visualizations across mobile and desktop: eliminate the linear mode from the 3D Stage on mobile complete catalog in favor of dedicated spiral layouts, implement bi-directional spiral modes (both size-ascending and size-descending with center-to-perimeter scaling and auto-focus), dynamically balance comparison grids by cumulative stellar diameter per row, and remove the header search feature.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following revisions have been incorporated based on your latest guidance:

- **Elimination of Linear Mode on Mobile Complete Catalog**: On mobile devices viewing the complete catalog in the 3D Stage, the linear layout mode is completely removed. Mobile 3D browsing will operate exclusively in optimized Spiral mode to prevent excessive GPU strain and unmanageable horizontal spans.
- **Bi-Directional Spiral Mode in 3D Stage**:
  - **Size Ascending (`radius-asc`)**: Smallest compact remnant / dwarf at the center, expanding outward to supergiant titans at the perimeter. Initial camera view centers on the compact core.
  - **Size Descending (`radius-desc`)**: The largest hypergiant sits at the galactic spiral center, gracefully winding outward to dwarfs and compact remnants at the outer arm. Camera focus automatically targets the **smallest star** at the perimeter, providing an immediate awe-inspiring vantage point looking inward toward the gargantuan core star.
- **Diameter-Weighted Comparison Grid Rows**: The comparison grid dynamically wraps rows after a calibrated cumulative stellar diameter threshold is reached (rather than rigid static item counts), preventing massive supergiants from visually crushing adjacent dwarfs and avoiding lopsided rows.
- **Header Search Clean Removal**: The search button and keyboard trigger in the application header are removed for a decluttered, high-contrast navigation bar.

---

## 1. Overview & Core Concept

- **What It Does**: Re-architects the astronomical comparison engine to treat celestial scale authentically. On mobile viewports, high-density spiral physics replace cumbersome linear queues; comparator grids balance themselves based on actual physical stellar diameters; and descending sorting offers a dramatic perspective starting from a sub-kilometer neutron star framing a hypergiant core.
- **Target Audience**: Mobile and desktop astronomy researchers, students, and space enthusiasts exploring over a hundred real stars with accurate astrophysical scale ratios ($10^{-5}$ to $1,700\times R_\odot$).
- **Key Value**: 60 FPS mobile WebGL rendering with zero overlap, natural visual hierarchy in comparison grids, and rapid touch inspection.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Mobile 3D Complete Catalog**:
   - The user opens the 3D Stage on mobile and switches to or loads the "Complete Catalog" preset.
   - The linear layout toggle is removed from the mobile UI. Spiral layout is active by default.
   - Sorting by Size Ascending places neutron stars and white dwarfs at the center, spiraling out to Stephenson 2-18 and UY Scuti.
   - Sorting by Size Descending places the giant at the center and winds outward to compact remnants. The camera automatically focuses on the smallest star, providing immediate contrast against the titan at the spiral origin.

2. **Diameter-Weighted Comparison Grid (Catalog View)**:
   - When browsing stars in comparison mode, items are distributed across rows by calculating cumulative star diameter ($\sum D_\odot$).
   - A row with Stephenson 2-18 ($2,150\times D_\odot$) or Betelgeuse wraps after fewer items, whereas rows with main-sequence red dwarfs and white dwarfs allow more stars to sit comfortably together.
   - On mobile, this produces balanced 2-column cards that avoid awkward empty space or extreme visual disparity.

3. **Streamlined Top Bar**:
   - The top header (`<header>`) retains the brand wordmark, catalog stats, and view switches, with the search button cleanly removed.

### Visual Identity & Theme

- **Aesthetic Direction**: Clinical astronomical observatory console with deep obsidian (`#07090E`), slate panels (`#0F172A`), and spectral phosphor accents (O-star electric cyan `#38BDF8`, M-star warm amber `#F59E0B`).
- **Typography & Scale**: Neo-grotesque interface titles (`Plus Jakarta Sans`) with tabular monospace metrics (`tabular-nums font-mono`) for exact radii, luminosities, and distances.
- **Touch Ergonomics**: All mobile card tap zones and button hitboxes maintain a minimum of $\ge 44\text{px}$.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Linear Mode Elimination on Mobile Complete Catalog**
  - *Chosen Approach*: On viewports $<768\text{px}$, if `preset === 'all-stars-catalog'`, the linear layout option is hidden and disabled. Only Spiral layout is permitted.
  - *Why*: In linear mode, placing 100+ stars of disparate scales along the X-axis requires panning across thousands of units, causing mobile touch jitter and severe WebGL frame drops.
  - *Alternative Considered*: Clamping maximum linear distance; rejected because stars overlapped into an illegible ball.

- **Decision 2: Bi-Directional Spiral Coordinate Math**
  - *Chosen Approach*: Calculate spiral arm tangents ($r(\theta) = a + b\theta$) with chord-distance spacing based on adjacent stellar radii.
    - Ascending: Center = $s_0$ (smallest), outer arm = $s_{N-1}$ (largest). Camera focuses on $s_0$.
    - Descending: Center = $s_0$ (largest), outer arm = $s_{N-1}$ (smallest). Camera focuses on $s_{N-1}$ (smallest star), looking toward the center.
  - *Why*: Gives users both comparative perspectives while guaranteeing zero sphere clipping or mesh collision.

- **Decision 3: Cumulative Diameter Row Splitting**
  - *Chosen Approach*: Compute row breaks dynamically: accumulate $\sum (\text{diameterSolar})^{0.6}$ (or calibrated visual footprint index) up to a max-per-row budget. When exceeded, the grid moves to the next row.
  - *Why*: Linear star diameters vary by 6 orders of magnitude ($0.000015\times D_\odot$ to $2,150\times D_\odot$). Power-scaled cumulative diameter weighting prevents single giant stars from dominating an entire page while keeping dwarf groupings compact.

---

## 4. Technical Architecture & Component Structure

```
┌────────────────────────────────────────────────────────────────────────┐
│                              App.tsx                                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Header: Clean brand + View switcher (Search button removed)       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                │                                       │
│          ┌─────────────────────┴──────────────────────┐                │
│          ▼                                            ▼                │
│  ┌───────────────────────────────┐   ┌───────────────────────────────┐ │
│  │       StarCanvas3D            │   │      Catalog Modal Overlay    │ │
│  │  - Mobile detection (<768px)  │   │  - Diameter-weighted rows:    │ │
│  │  - Complete Catalog logic:    │   │    Accumulate star diameters  │ │
│  │    * Linear mode eliminated   │   │    per row with max budget    │ │
│  │    * Spiral mode enforced     │   │  - Dense 2-col cards on mobile│ │
│  │  - Bi-Directional Spiral:     │   │  - Compact tabular metrics    │ │
│  │    * Asc: Smallest @ center   │   │    (temp, lum, dist, mass)    │ │
│  │    * Desc: Largest @ center,  │   │  - Direct star selection      │ │
│  │      camera on smallest star  │   │                               │ │
│  └───────────────────────────────┘   └───────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Implementation Steps

1. **Header Cleanup (`src/App.tsx`)**:
   - Remove the search button element (`setIsCommandPaletteOpen(true)`) and search hotkey pill from the desktop header and mobile bar.

2. **Mobile Layout & Bi-Directional Spiral (`src/components/StarCanvas3D.tsx`)**:
   - In `starScales` computation, enable spiral layout on mobile (`isMob && isAllStars`).
   - Eliminate `linear` mode option from mobile controls when complete catalog is active.
   - Support both `isSizeAscending` and `isSizeDescending`:
     - In ascending mode: center at radius 0, wind outward to largest. Target camera to smallest center star.
     - In descending mode: center at radius 0 with largest star, wind outward with chord distance based on decreasing radii, ending with smallest star. Target camera focus to the smallest star at the spiral perimeter.
   - In `resetCameraToStar`: when descending spiral activates, auto-focus onto `sortedStars[sortedStars.length - 1]` (the smallest star).

3. **Cumulative Diameter-Weighted Comparison Rows (`src/App.tsx` & Catalog Components)**:
   - Implement dynamic row grouping based on cumulative visual diameter footprint.
   - For catalog comparison views, calculate row partitions and render responsive grids with balanced row heights and dense mobile 2-column distribution.
