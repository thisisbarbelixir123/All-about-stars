# Starpedia 3D: Anti-Slop Phase 2 (Interactive Visualizers & Catalog) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** De-slop Starpedia 3D's major interactive visualizers and catalog suite (`StarCard.tsx`, `StarFilterPanel.tsx`, `HRDiagram.tsx`, `StellarSystemCatalog.tsx`, `ConstellationTabs.tsx`) to adopt the clean, authoritative Deep Space Research Observatory aesthetic.

**Architecture:** Extend the `.observatory-panel` and `.observatory-control` design tokens and `Instrument Sans` / `JetBrains Mono` typography established in Phase 1 into the catalog grid, interactive H–R diagram controls, multiple star system explorer, and constellation atlas, replacing heavy cyan borders, glow boxes, and gradient pills with restrained, tactile controls.

**Tech Stack:** React 19, TypeScript 5.8, Tailwind CSS v4, Three.js r185, Vite 6.2.

**Spec:** [`docs/superpowers/specs/2026-11-08-starpedia-anti-slop-design.md`](file:///d:/project%20files/All-about-stars/docs/superpowers/specs/2026-11-08-starpedia-anti-slop-design.md)

## Global Constraints

- **Typography**: Strictly use `Instrument Sans` for headers, labels, and display titles. Reserve `JetBrains Mono` strictly for numerical measurements, coordinates, and spectral types.
- **Color & Lighting (Antislop R-01, R-13)**: No arbitrary neon cyan dropshadows or floating ambient blur balls. Ambient starlight comes strictly from the star's physical Planckian D65 color (`star.colorHex`).
- **Panels & Surfaces (Antislop R-10)**: Use `.observatory-panel` (`bg-[#060a16]/85 backdrop-blur-md border border-white/10`) and `.observatory-control`.
- **Copywriting (Antislop R-02)**: FORBIDDEN: em dash character (`—`) in UI copy or labels.
- **Accessibility & Touch (Antislop R-03, R-25, R-32, R-39)**: All buttons and tabs must meet minimum 44px tap targets and support `:focus-visible` keyboard rings.
- **Catalog Integrity**: Never modify raw catalog metrics or orbital elements (`stars.ts`, `systems.ts`).

## Review Focus

1. **Card rendering performance**: Ensure catalog card refactoring in `StarCard.tsx` does not cause layout recalculation lag or break `RunningText`.
2. **H-R Diagram canvas alignment**: Ensure `HRDiagram.tsx` toolbar and legend adjustments do not shift SVG/canvas viewport coordinates or clipping boundaries.
3. **Responsive tab scrolling**: Ensure `ConstellationTabs.tsx` scrolls horizontally without horizontal page overflow on small mobile screens (< 360px).
4. **Touch targets on small controls**: Ensure small badge buttons ("View Dossier", "Inspect", "Smallest/Largest") maintain at least 44px tap target envelope.
5. **Zero em dashes**: Verify 0 em dashes exist in newly touched components.

---

### Task 1: Catalog & Star Cards De-slopping (`StarCard.tsx`, `StarFilterPanel.tsx`)

**Files:**
- Modify: `src/components/StarCard.tsx:21-95`
- Modify: `src/components/StarFilterPanel.tsx:119-210`

**Interfaces:**
- Consumes: `.observatory-panel`, `.observatory-control`, `StarData`, `FilterState`.
- Produces: De-slopped star preview cards and filter panel with clean borders and high-density telemetry.

- [ ] **Step 1: Write test script checking StarCard and StarFilterPanel visual constraints**

Create `scripts/verify-catalog-cards.ts` checking:
1. `StarCard.tsx` does not contain `hover:shadow-[0_6px_20px_rgba(6,182,212` or `border-cyan-500/30`.
2. `StarCard.tsx` uses `.observatory-panel` or `border-white/10`.
3. `StarFilterPanel.tsx` uses `.observatory-panel`.
4. Neither file contains em dashes (`—`).

- [ ] **Step 2: Run verification script to verify it fails**

Run: `npx tsx scripts/verify-catalog-cards.ts`  
Expected: FAIL.

- [ ] **Step 3: Refactor `src/components/StarCard.tsx` & `src/components/StarFilterPanel.tsx`**

- In `StarCard.tsx`:
  - Replace container class with: `group relative observatory-panel hover:bg-[#0c1224] border border-white/10 hover:border-sky-400/50 rounded-xl p-2.5 sm:p-3 md:p-3.5 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex flex-col justify-between gap-2 sm:gap-2.5 cursor-pointer select-none overflow-hidden min-h-[125px] sm:min-h-[135px] md:min-h-[148px]`.
  - Replace spectral type badge styling with: `px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-sky-300 font-bold shrink-0 truncate`.
  - Replace 3-metric strip boxes with: `p-1 rounded-lg bg-black/40 border border-white/5 min-w-0 overflow-hidden`.
  - Replace "View Dossier" button with `.observatory-control` styling: `w-full flex items-center justify-center gap-1.5 py-1 sm:py-1.5 px-2 rounded-lg observatory-control text-[10px] sm:text-xs font-semibold font-mono transition-all cursor-pointer shadow-xs active:scale-95 truncate overflow-hidden`.
- In `StarFilterPanel.tsx`:
  - Replace main container class with `observatory-panel`.
  - Refactor search input to clean obsidian input: `bg-black/50 border border-white/10 focus:border-sky-400 text-slate-100 placeholder:text-slate-500`.
  - Update spectral filter buttons to `.observatory-control` with crisp active states.

- [ ] **Step 4: Run verification script and lint**

Run: `npx tsx scripts/verify-catalog-cards.ts; npm run lint`  
Expected: PASS.

---

### Task 2: Interactive Hertzsprung–Russell Diagram De-slopping (`HRDiagram.tsx`)

**Files:**
- Modify: `src/components/HRDiagram.tsx` (top control bar, search/filter dock, and star inspection dock)

**Interfaces:**
- Consumes: `.observatory-panel`, `.observatory-control`, `EXTENDED_SPECTRAL_BANDS`.
- Produces: Precision astronomical H–R diagram chart with clean observatory toolbars.

- [ ] **Step 1: Write test script checking HRDiagram UI styling**

Create `scripts/verify-hr-diagram.ts` asserting:
1. `HRDiagram.tsx` uses `.observatory-panel` for its main toolbars and dock.
2. Does not contain em dashes (`—`).
3. Does not contain excessive cyan drop shadows.

- [ ] **Step 2: Run verification script to verify it fails**

Run: `npx tsx scripts/verify-hr-diagram.ts`  
Expected: FAIL.

- [ ] **Step 3: Refactor `src/components/HRDiagram.tsx`**

- Update the diagram's top control toolbar to use `.observatory-panel` with hairline `border-white/10`.
- Update zoom/pan buttons and view toggles to use `.observatory-control`.
- Update search and filter chips to use clean observatory button states.
- Clean up the star detail inspection card in H-R diagram to match the `StarInfoPanel` observatory theme.

- [ ] **Step 4: Run verification script and lint**

Run: `npx tsx scripts/verify-hr-diagram.ts; npm run lint`  
Expected: PASS.

---

### Task 3: Multiple Star Systems Suite De-slopping (`StellarSystemCatalog.tsx`, `StellarSystemCard.tsx`, `StellarSystemDossierModal.tsx`)

**Files:**
- Modify: `src/components/StellarSystemCatalog.tsx:86-130`
- Modify: `src/components/StellarSystemCard.tsx`
- Modify: `src/components/StellarSystemDossierModal.tsx`

**Interfaces:**
- Consumes: `MULTIPLE_STAR_SYSTEMS`, `.observatory-panel`, `.observatory-control`.
- Produces: De-slopped multi-star catalog, system cards, and Keplerian orbital modal.

- [ ] **Step 1: Write test script checking StellarSystem components**

Create `scripts/verify-stellar-systems.ts` asserting:
1. `StellarSystemCatalog.tsx` banner uses `.observatory-panel` and has no ambient blur ball.
2. `StellarSystemCard.tsx` uses `.observatory-panel` and hairline borders.
3. `StellarSystemDossierModal.tsx` header uses `.observatory-panel`.
4. No em dashes in these components.

- [ ] **Step 2: Run verification script to verify it fails**

Run: `npx tsx scripts/verify-stellar-systems.ts`  
Expected: FAIL.

- [ ] **Step 3: Refactor multiple star systems suite**

- In `StellarSystemCatalog.tsx`:
  - Replace banner with `.observatory-panel`.
  - Remove the floating blur orb (`w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl`).
  - Refactor system type filter pills to `.observatory-control`.
- In `StellarSystemCard.tsx`:
  - Replace cyan glow borders with `.observatory-panel` and `border-white/10`.
  - Update component star badges and orbital period tags to clean `JetBrains Mono` telemetry.
- In `StellarSystemDossierModal.tsx`:
  - Refactor modal header and 3D stage dock to `.observatory-panel`.

- [ ] **Step 4: Run verification script and lint**

Run: `npx tsx scripts/verify-stellar-systems.ts; npm run lint`  
Expected: PASS.

---

### Task 4: Constellation Sky Atlas Suite De-slopping (`ConstellationTabs.tsx`, `ConstellationGuide.tsx`, `ConstellationDossierModal.tsx`)

**Files:**
- Modify: `src/components/ConstellationTabs.tsx:15-80`
- Modify: `src/components/ConstellationGuide.tsx`
- Modify: `src/components/ConstellationDossierModal.tsx`

**Interfaces:**
- Consumes: `.observatory-panel`, `.observatory-control`.
- Produces: Tactical field-guide constellation navigation and modal dossiers.

- [ ] **Step 1: Write test script checking Constellation suite**

Create `scripts/verify-constellations.ts` asserting:
1. `ConstellationTabs.tsx` uses `.observatory-panel` container and `.observatory-control` / clean sky-500 active tab.
2. `ConstellationDossierModal.tsx` header uses `.observatory-panel`.
3. No em dashes in these components.

- [ ] **Step 2: Run verification script to verify it fails**

Run: `npx tsx scripts/verify-constellations.ts`  
Expected: FAIL.

- [ ] **Step 3: Refactor constellation suite**

- In `ConstellationTabs.tsx`:
  - Replace container styling with `.observatory-panel rounded-xl`.
  - Replace active tab cyan gradient with `bg-sky-500 text-slate-950 font-semibold shadow-md`.
  - Replace inactive tab styling with clean hover state.
- In `ConstellationGuide.tsx`:
  - Refactor search input, IAU filter pills, and constellation grid cards to `.observatory-panel`.
- In `ConstellationDossierModal.tsx`:
  - Refactor modal header and tabs to match the obsidian observatory theme.

- [ ] **Step 4: Run verification script and lint**

Run: `npx tsx scripts/verify-constellations.ts; npm run lint`  
Expected: PASS.

---

### Task 5: Full Verification, Delivery Gate & Cleanup

**Files:**
- Cleanup: Remove temporary verification scripts (`scripts/verify-*.ts`)

- [ ] **Step 1: Run complete build and catalog validation**

Run: `npm run lint; npm run build`  
Expected: PASS with 0 TypeScript, Vite, or catalog validation errors.

- [ ] **Step 2: Run Antislop Delivery Gate checks**
  - Verify 0 em dashes in all newly touched components (R-02).
  - Verify WCAG AA contrast (minimum 4.5:1) on updated cards (R-25).
  - Verify mobile responsiveness and tap targets (minimum 44px) across breakpoints (R-03).

- [ ] **Step 3: Clean up temporary verification scripts**
