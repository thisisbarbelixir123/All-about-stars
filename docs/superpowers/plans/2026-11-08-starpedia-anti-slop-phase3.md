# Starpedia 3D: Anti-Slop (Deep Space Observatory) Phase 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the Deep Space Research Observatory transformation by systematically de-slopping Track A (The Encyclopedic Educational Guides) followed by Track B (Astrophysics Science Visualizers & Global Utility Overlays), replacing all remaining ambient blur orbs, neon glow drop shadows, and AI buzzwords with authentic observatory panels, crisp hairline borders, and authoritative astronomical typography.

**Architecture:** Extend `.observatory-panel` and `.observatory-control` tokens across all encyclopedic guides, cross-section/thermonuclear visualizers, and global overlays. Maintain `Instrument Sans` for display/body copy and `JetBrains Mono` exclusively for telemetry, coordinates, and spectral types. Ensure zero em dashes (`—`), WCAG AA contrast, and minimum 44px touch targets.

**Tech Stack:** React 19, TypeScript 5.8, Tailwind CSS v4, Three.js r185, Vite 6.2, Lucide React, Motion.

**Spec:** [`docs/superpowers/specs/2026-11-08-starpedia-anti-slop-design.md`](file:///d:/project%20files/All-about-stars/docs/superpowers/specs/2026-11-08-starpedia-anti-slop-design.md)

## Global Constraints

- **Design Tokens**: Standardize all containers on `.observatory-panel` (`bg-[#060a16]/85 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.85)]`) and interactive elements on `.observatory-control` (`bg-[#090e20]/80 hover:bg-[#0f1733] border border-white/10 hover:border-sky-400/50`).
- **Typography (Antislop R-06)**: Use `Instrument Sans` with tight tracking for headings and explanatory text. Reserve `JetBrains Mono` strictly for numerical telemetry, spectral classifications, coordinates, and keyboard shortcut chips.
- **Copywriting (Antislop R-02)**: FORBIDDEN: em dash character (`—`) anywhere in UI copy or data. Use commas, colons, hyphens, or parentheses instead.
- **Color & Lighting (Antislop R-01, R-13)**: Eliminate all `blur-3xl` / `blur-2xl` floating color orbs, neon cyan glow shadows, and blue gradient hero banners.
- **Touch & Accessibility (Antislop R-03, R-25, R-32)**: Minimum 44px tap targets for all buttons and interactive tabs, WCAG AA contrast (minimum 4.5:1), and visible `:focus-visible` rings.
- **Catalog Integrity (RULES.md & NG-1)**: Zero modifications to astronomical physics constants or catalog count (1,007 stars).

## Review Focus

1. **Ambient blur orb residuals**: Ensuring zero `blur-3xl` or `blur-2xl` color balls remain in any encyclopedia view or visualizer.
2. **Em dash remnants**: Ensuring zero em dashes appear in updated guides or modals.
3. **Contrast on deep dark panels**: Ensuring secondary labels and muted telemetry maintain at least 4.5:1 contrast against `#060a16`.
4. **Mobile & tablet responsive layouts**: Ensuring complex data grids (spectral types, nuclear reaction steps, cross-section layers) reflow gracefully without horizontal viewport blowout.
5. **Interactive tab & button envelopes**: Ensuring all filter chips, tab triggers, and modal actions meet the 44px touch target requirement.

---

## TRACK A: THE ENCYCLOPEDIC EDUCATIONAL GUIDES

### Task 1: Star Encyclopedia Frontpage De-slopping (`StarEncyclopediaFrontpage.tsx`)

**Files:**
- Modify: `src/components/StarEncyclopediaFrontpage.tsx`

**Interfaces:**
- Consumes: `.observatory-panel`, `.observatory-control`.
- Produces: Bespoke observatory research gateway replacing marketing-style cards.

- [x] **Step 1: Inspect and identify all slop patterns in `StarEncyclopediaFrontpage.tsx`**
  - Identify all 4 `blur-3xl` ambient glow balls (amber, purple, cyan).
  - Identify heavy gradient backgrounds (`bg-gradient-to-r from-[#030a21] ...`).
  - Check for any em dashes in article blurbs.

- [x] **Step 2: Refactor hero banner and search/navigation bar**
  - Convert hero container to `.observatory-panel`.
  - Remove floating blur orbs.
  - Refactor search input to `bg-black/50 border border-white/10 focus:border-sky-400 text-white font-mono`.

- [x] **Step 3: Refactor category cards and featured article teasers**
  - Convert category cards to `.observatory-panel hover:bg-[#0c1224] border border-white/10 hover:border-sky-400/50`.
  - Replace cyan/amber drop shadows with crisp hairline borders.
  - Ensure all action buttons meet 44px minimum tap targets.

- [x] **Step 4: Verify typecheck, catalog, and em dashes**
  - Run: `npm run lint`

---

### Task 2: Stellar Classification Guide & Directory Suite (`StellarClassificationGuide.tsx`, `ClassificationDirectoryModal.tsx`, `ClassificationMappedStarsSection.tsx`, `ClassificationMappedSystemsSection.tsx`)

**Files:**
- Modify: `src/components/StellarClassificationGuide.tsx`
- Modify: `src/components/ClassificationDirectoryModal.tsx`
- Modify: `src/components/ClassificationMappedStarsSection.tsx`
- Modify: `src/components/ClassificationMappedSystemsSection.tsx`

**Interfaces:**
- Consumes: Morgan-Keenan spectral data, Yerkes luminosity classes, `.observatory-panel`, `.observatory-control`.
- Produces: Technical astrophysical spectral atlas and classification browser.

- [x] **Step 1: Inspect and identify slop patterns in the classification suite**
  - Identify `blur-3xl` orbs in `StellarClassificationGuide.tsx`.
  - Check button styling and tab strips for cyan gradient glow buttons.
  - Check for em dashes in descriptions.

- [x] **Step 2: Refactor `StellarClassificationGuide.tsx`**
  - Convert hero banner and spectral class cards (O, B, A, F, G, K, M, L, T, Y, WR) to `.observatory-panel`.
  - Remove the floating blur orb.
  - Refactor class selector tabs and luminosity class pills to `.observatory-control`.
  - Ensure spectral badges use authentic Planckian D65 starlight colors without artificial neon drop shadows.

- [x] **Step 3: Refactor modal and mapped sections**
  - In `ClassificationDirectoryModal.tsx`: refactor modal header and grid to `.observatory-panel` with 44px close button.
  - In `ClassificationMappedStarsSection.tsx` & `ClassificationMappedSystemsSection.tsx`: refactor cards to `.observatory-panel` with `JetBrains Mono` telemetry tags.

- [x] **Step 4: Verify typecheck, catalog, and em dashes**
  - Run: `npm run lint`

---

### Task 3: Stellar Discovery & Observational Astronomy Guide (`StellarDiscoveryGuide.tsx`)

**Files:**
- Modify: `src/components/StellarDiscoveryGuide.tsx`

**Interfaces:**
- Consumes: Astronomical discovery methods, space mission timelines, `.observatory-panel`, `.observatory-control`.
- Produces: Observational astrophysics methodology guide.

- [x] **Step 1: Inspect and identify slop patterns in `StellarDiscoveryGuide.tsx`**
  - Identify all 5 `blur-3xl` orbs across sections (hero, detection methods, space telescopes).
  - Identify gradient badges and drop shadows.

- [x] **Step 2: Refactor hero banner and methodology tabs**
  - Replace hero container with `.observatory-panel`.
  - Remove all floating blur balls.
  - Refactor method selector tabs (Radial Velocity, Transit, Astrometry, Microlensing, Direct Imaging) to `.observatory-control` and `bg-sky-500 text-slate-950 font-bold` for active state.

- [x] **Step 3: Refactor mission cards and detection mechanism diagrams**
  - Convert space telescope cards (Hipparcos, Kepler, Gaia, TESS, JWST) to `.observatory-panel border border-white/10`.
  - Style telemetry metrics with `JetBrains Mono`.
  - Ensure minimum 44px tap targets on all interactive triggers.

- [x] **Step 4: Verify typecheck, catalog, and em dashes**
  - Run: `npm run lint`

---

### Task 4: Stellar Nomenclature & Designation Guide (`StellarNomenclatureGuide.tsx`)

**Files:**
- Modify: `src/components/StellarNomenclatureGuide.tsx`

**Interfaces:**
- Consumes: IAU designation hierarchies, Bayer/Flamsteed/Gould catalogs, variable star rules, `.observatory-panel`.
- Produces: Astronomical designation reference handbook.

- [x] **Step 1: Inspect and identify slop patterns in `StellarNomenclatureGuide.tsx`**
  - Identify all 8 `blur-3xl` ambient glow balls.
  - Identify gradient cards and glowing CTA buttons.

- [x] **Step 2: Refactor hero banner and catalog hierarchy breakdown**
  - Convert hero to `.observatory-panel`.
  - Remove all floating blur orbs.
  - Convert catalog cards (Bayer Greek, Flamsteed numbered, Gould Argentine, Variable star, HD, HIP, GJ, 2MASS, Gaia) to `.observatory-panel`.

- [x] **Step 3: Refactor interactive designation decoder widget**
  - Replace legacy inputs with `.observatory-control` styled fields.
  - Format designation breakdowns with clean `JetBrains Mono` chips.
  - Ensure 44px tap targets on all clickable catalog example pills.

- [x] **Step 4: Verify typecheck, catalog, and em dashes**
  - Run: `npm run lint`

---

### Task 5: Stellar Life Cycle & Evolution Visualizer Suite (`StellarLifeCycleVisualizer2D.tsx`, `StellarLifeCycleVisualizer.tsx`)

**Files:**
- Modify: `src/components/StellarLifeCycleVisualizer2D.tsx`
- Modify: `src/components/StellarLifeCycleVisualizer.tsx`

**Interfaces:**
- Consumes: Stellar evolution branches (low-mass, solar-mass, massive, supermassive), `.observatory-panel`.
- Produces: Astrophysics evolutionary track diagram and remnant visualizer.

- [x] **Step 1: Inspect and identify slop patterns in both visualizers**
  - Identify `blur-3xl` orbs in `StellarLifeCycleVisualizer2D.tsx`.
  - Check stage selection timeline for neon drop shadows and cyan glows.

- [x] **Step 2: Refactor `StellarLifeCycleVisualizer2D.tsx`**
  - Convert header and track selector to `.observatory-panel`.
  - Remove blur orbs.
  - Refactor track selection buttons (Low-Mass Dwarf, Solar Analog, Massive Star, Hypergiant) to `.observatory-control`.
  - Clean up stage inspection cards with `JetBrains Mono` telemetry (temperatures, timescales, fusion reactions).

- [x] **Step 3: Refactor `StellarLifeCycleVisualizer.tsx`**
  - Clean up 3D/stage overlay controls and stage description drawer to match `.observatory-panel`.
  - Ensure minimum 44px tap targets for all evolution step nodes.

- [x] **Step 4: Verify typecheck, catalog, and em dashes**
  - Run: `npm run lint`

---

## TRACK B: ASTROPHYSICS SCIENCE VISUALIZERS & GLOBAL UTILITY OVERLAYS

### Task 6: Core Astrophysics Engines (`ThermonuclearEngineVisualizer.tsx`, `StellarCrossSectionVisualizer.tsx`)

**Files:**
- Modify: `src/components/ThermonuclearEngineVisualizer.tsx`
- Modify: `src/components/StellarCrossSectionVisualizer.tsx`

**Interfaces:**
- Consumes: Nuclear fusion reaction steps (P-P I/II/III, CNO, Triple-Alpha), stellar interior layer mechanics, `.observatory-panel`.
- Produces: Technical nuclear physics and interior stellar anatomy visualizers.

- [x] **Step 1: Inspect slop patterns in Thermonuclear and Cross-Section visualizers**
  - Check for gradient backgrounds, glowing text shadows, and em dashes.
  - Identify reaction stage nodes and interactive layer selectors.

- [x] **Step 2: Refactor `ThermonuclearEngineVisualizer.tsx`**
  - Convert header and reaction pathway tabs to `.observatory-panel` and `.observatory-control`.
  - Style reaction steps ($p + p \to d + e^+ + \nu_e$, etc.) with clean monospace telemetry and crisp isotope badges.
  - Ensure temperature/pressure requirements use authentic scientific notation without neon gradients.

- [x] **Step 3: Refactor `StellarCrossSectionVisualizer.tsx`**
  - Convert layer cards (Core, Radiative Zone, Tachocline, Convective Zone, Photosphere, Corona) to `.observatory-panel`.
  - Refactor layer inspection controls to `.observatory-control`.
  - Ensure minimum 44px tap targets on all layer buttons.

- [x] **Step 4: Verify typecheck, catalog, and em dashes**
  - Run: `npm run lint`

---

### Task 7: Star Comparison Scale Dock (`StarComparisonDock.tsx`)

**Files:**
- Modify: `src/components/StarComparisonDock.tsx`

**Interfaces:**
- Consumes: Active comparison stars, `.observatory-panel`, `.observatory-control`.
- Produces: Tactical side-by-side comparative scale bar.

- [x] **Step 1: Inspect slop patterns in `StarComparisonDock.tsx`**
  - Identify line 11: `<div className="absolute top-0 right-1/4 w-80 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />`.
  - Check border styles and scale metric chips.

- [x] **Step 2: Refactor dock container and scale metrics**
  - Replace container with `.observatory-panel border border-white/10`.
  - Remove the floating blur orb.
  - Refactor star slot cards and removal buttons to `.observatory-control` with minimum 44px tap targets.
  - Format comparative ratios ($R/R_\odot$, $M/M_\odot$, $L/L_\odot$) with crisp `JetBrains Mono` telemetry.

- [x] **Step 3: Verify typecheck, catalog, and em dashes**
  - Run: `npm run lint`

---

### Task 8: Command Palette & Global Overlays (`CommandPaletteModal.tsx`, `StageAndPresetModal.tsx`, `CreatePresetModal.tsx`, `KeyboardShortcutsHelpModal.tsx`, `AboutPage.tsx`)

**Files:**
- Modify: `src/components/CommandPaletteModal.tsx`
- Modify: `src/components/StageAndPresetModal.tsx`
- Modify: `src/components/CreatePresetModal.tsx`
- Modify: `src/components/KeyboardShortcutsHelpModal.tsx`
- Modify: `src/components/AboutPage.tsx`

**Interfaces:**
- Consumes: Global app state, search index, lighting presets, keyboard shortcuts, `.observatory-panel`.
- Produces: Polished observatory command palette and settings modals.

- [x] **Step 1: Inspect slop patterns in modals and About page**
  - Check `CommandPaletteModal.tsx` search input, result rows, and category badges.
  - Check `StageAndPresetModal.tsx` and `CreatePresetModal.tsx` sliders and preset cards.
  - Check `AboutPage.tsx` for marketing buzzwords or legacy gradient cards.

- [x] **Step 2: Refactor `CommandPaletteModal.tsx`**
  - Convert dialog shell to `.observatory-panel border border-white/10`.
  - Refactor search input to clean obsidian styling with `JetBrains Mono` shortcut hints.
  - Style result items with `.observatory-control` hover states and clean keyboard selection highlight.

- [x] **Step 3: Refactor Preset & Help Modals**
  - In `StageAndPresetModal.tsx` & `CreatePresetModal.tsx`: convert preset grid to `.observatory-panel`, style range sliders with clean slate tracks, ensure 44px touch targets.
  - In `KeyboardShortcutsHelpModal.tsx`: style shortcut keys (`[Space]`, `[Tab]`, etc.) as crisp physical keycaps with `JetBrains Mono`.

- [x] **Step 4: Refactor `AboutPage.tsx`**
  - Convert About page hero, mission statement, astrophysical data sources (Gaia, Hipparcos, SIMBAD, NASA Exoplanet Archive), and credits into `.observatory-panel`.
  - Sanitize all copy to ensure objective, authoritative observatory tone.

- [x] **Step 5: Verify typecheck, catalog, and em dashes**
  - Run: `npm run lint`

---

### Task 9: Auxiliary Controls & Graphic Badges (`AmbientSoundToggle.tsx`, `PresetSlider.tsx`, `OfflineIndicator.tsx`, `PWAInstallButton.tsx`, Graphic Components)

**Files:**
- Modify: `src/components/AmbientSoundToggle.tsx`
- Modify: `src/components/PresetSlider.tsx`
- Modify: `src/components/OfflineIndicator.tsx`
- Modify: `src/components/PWAInstallButton.tsx`
- Modify: `src/components/StellarRemnantGraphic.tsx`
- Modify: `src/components/HypotheticalStarGraphic.tsx`
- Modify: `src/components/VariableStarGraphic.tsx`
- Modify: `src/components/MethodScienceGraphic.tsx`
- Modify: `src/components/StarSystemGraphic.tsx`

**Interfaces:**
- Consumes: Audio ambient volume, PWA offline status, inline science SVG graphics.
- Produces: Polished secondary floating controls and diagram widgets.

- [x] **Step 1: Refactor floating toolbars and dropdowns**
  - In `AmbientSoundToggle.tsx`: convert dropdown menu to `.observatory-panel`, replace cyan drop shadow with crisp hairline border.
  - In `PresetSlider.tsx`: convert floating preset slider popover to `.observatory-panel`, replace cyan border with `border-white/10`.
  - In `OfflineIndicator.tsx` and `PWAInstallButton.tsx`: style as clean telemetry indicators with 44px tap targets.

- [x] **Step 2: Audit and refine graphic components**
  - Ensure inline SVG diagrams (remnants, hypothetical stars, variable stars, detection methods) use clean starlight palettes matching the observatory design system.

- [x] **Step 3: Verify typecheck, catalog, and em dashes**
  - Run: `npm run lint`

---

### Task 10: Full Verification Gate & Phase 3 Delivery

**Files:**
- Verification only

- [ ] **Step 1: Global audit for ambient blur orbs**
  - Run command searching for `blur-3xl` and `blur-2xl` in `src/components/`.
  - Assert 0 matches across the entire components directory.

- [ ] **Step 2: Global audit for em dashes**
  - Run command searching for `—` in `src/components/`.
  - Assert 0 matches in user-facing UI code.

- [ ] **Step 3: Catalog integrity & typecheck**
  - Run: `npm run lint` (`tsc --noEmit && tsx scripts/validate-catalog.ts`).
  - Assert 100% pass across all 1,007 stars.

- [ ] **Step 4: Full production build**
  - Run: `npm run build`.
  - Assert clean bundle generation and PWA service worker generation with zero warnings or errors.
