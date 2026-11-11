# Exoplanet Branch Anti-Slop & Rules Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `feat/exoplanet-comparison-3d` into compliance with `pre-release/v2.6.0-phase1` governance rules, Antislop Deep Space Observatory design tokens, WebGL lifecycle safety, hotkey disambiguation, and modular UI boundaries before executing `PHASE_3_PLAN.md`.

**Architecture:** First port the governance rules, `unslop` skill, `WebGLErrorBoundary`, and global Observatory typography/tokens onto `feat/exoplanet-comparison-3d` while preserving branch-specific accessibility CSS (`prefers-reduced-motion`). Then extract pure telemetry formatters, the shortcuts dialog, and stage HUD chrome out of the 2,887-line `ExoplanetCanvas3D.tsx` monolith so Three.js WebGL lifecycle and UI presentation share clean, testable interfaces.

**Tech Stack:** React 19, TypeScript 5.8, Tailwind CSS v4, Three.js r185, Vite 6.2, Lucide React, `tsx`.

**Spec:** [`docs/superpowers/specs/2026-11-11-exoplanet-observatory-design.md`](file:///d:/project%20files/All-about-stars/docs/superpowers/specs/2026-11-11-exoplanet-observatory-design.md)

## Global Constraints

- **Typography**: Retire `Orbitron` and `Plus Jakarta Sans` globally. Map `--font-sans`, `--font-display`, and `--font-title` to `'Instrument Sans', system-ui, -apple-system, sans-serif`. Reserve `JetBrains Mono` strictly for numerical measurements, coordinates, spectral/Sudarsky classifications, and keyboard shortcut badges.
- **Copywriting (Antislop R-02)**: Zero em dashes (`U+2014`) anywhere in UI strings, tooltips, modals, or documentation. Use commas, colons, hyphens, or parentheses instead.
- **Visual Surfaces & Lighting**: Replace `.cosmic-glass`, `.cosmic-glow-*`, `backdrop-blur-xl` / `backdrop-blur-2xl`, gradient active CTAs (`from-cyan-600 to-blue-600`), and `shadow-[0_0_...]` cyan glow shadows with `.observatory-panel` (`rgba(6, 10, 22, 0.85)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(255, 255, 255, 0.1)`) and `.observatory-control`. Let body radiance come from authentic Sudarsky / D65 colors (`inferBodyColor()`).
- **Accessibility & Touch (Antislop R-03, R-25, R-32, R-39)**: Minimum `44px` tap targets (`min-h-11`, and `min-w-11` for icon-only controls), visible `:focus-visible` outlines (`#38bdf8`), minimum `4.5:1` text contrast, and preserved `@media (prefers-reduced-motion: reduce)` rules.
- **WebGL & Hotkey Safety (`RULES.md` Sections 2 & 3)**: Call `renderer.forceContextLoss()` alongside `.dispose()` on unmount, wrap stage rendering in `WebGLErrorBoundary`, and mute stage keyboard shortcuts whenever a dialog, search input, or menu overlay is open.
- **Catalog & Performance Preservation**: Never modify celestial catalog metrics (`exoplanetCatalog.json`, `solarSystemCatalog.ts`, `masterCelestialCatalog.ts`), procedural shaders (`planetShaderUtils.ts`), or `vite.config.ts` runtime texture caching (`globIgnores: ['**/textures/**']`).

## Review Focus

1. **CSS accessibility preservation**: Migrating `src/index.css` to Observatory tokens must keep `@media (prefers-reduced-motion: reduce)` and `button:disabled` / interactive pointer cursor rules intact.
2. **Modal and menu hotkey isolation**: Pressing `U`, `R`, `A`, `L`, `T`, `P`, `W`, `G`, `H`, `B`, or `?` while `showShortcutsHelp` is open or focus is inside `<input>`/`<select>`/`<textarea>` must not trigger camera moves; `Escape` must close `showShortcutsHelp`, open dropdowns, or search mode before ending a tour.
3. **WebGL context exhaustion on unmount**: Unmounting the stage canvas must invoke `renderer.forceContextLoss()` before clearing `rendererRef.current`, and `App.tsx` must wrap `<ExoplanetCanvas3D>` in `<WebGLErrorBoundary>` with a valid reset callback.
4. **Mobile touch target conformance**: Topbar zoom buttons (`+`/`-`), layout split triggers, bottom dock pagination (`First`/`Prev`/`Next`/`Last`), search button/close icon, and modal close button must all have `>= 44px` hit boxes without overflowing narrow mobile screens (`< 360px`).
5. **No telemetry or startup optimization regression**: Earth initial framing (`sol-earth`), linear default layout, compact unit formatting, and `npm run lint` / `npm run build` must remain intact.

---

## Planned File Structure

- **Port from `pre-release/v2.6.0-phase1`**:
  - `RULES.md`
  - `.gemini/rules/project-rules.md`
  - `.agents/skills/unslop/SKILL.md`
  - `skills-lock.json`
  - `src/components/WebGLErrorBoundary.tsx` (align fallback button with `.observatory-control`)
- **Modify existing files on `feat/exoplanet-comparison-3d`**:
  - `index.html` (swap Google Fonts from `Orbitron` + `Plus Jakarta Sans` to `Instrument Sans` + `JetBrains Mono`)
  - `src/index.css` (Observatory tokens + `:focus-visible`, preserving `prefers-reduced-motion` and cursor rules)
  - `src/components/LoadingSprite.tsx` (Observatory spinner without `animate-ping` aura or cyan neon box-shadow)
  - `src/App.tsx` (wrap `<ExoplanetCanvas3D>` in `<WebGLErrorBoundary>`, remove `selection:bg-cyan-500/30` in favor of observatory sky accent)
  - `src/components/ExoplanetCanvas3D.tsx` (retain Three.js WebGL stage shell, scene/object streaming, camera interpolation, raycasting, and resize/unmount `forceContextLoss()` cleanup; consume extracted modules)
- **Extract focused modules from `ExoplanetCanvas3D.tsx` (2,887 lines)**:
  - `src/utils/exoplanetFormatters.ts` (pure helpers: `CelestialSortKey`, `SortDirection`, `TourMetricDisplay`, `inferBodyColor()`, `formatCompactBodyMass()`, `getTourMetricDisplay()`)
  - `src/components/ExoplanetShortcutsModal.tsx` (extracted keyboard shortcuts modal with `.observatory-panel`, >=44px close button, `Escape` handling, and `Instrument Sans` headings)
  - `src/components/ExoplanetStageHud.tsx` (extracted top toolbar, loading progress bar, WebGL fallback alert, floating 3D object pill, search tray, bottom pagination dock, and tour lower-third HUD)
- **Automated Verification Scripts**:
  - `scripts/verify-exoplanet-observatory.ts` (runnable via `npx tsx`)

---

### Task 1: Cherry-Pick Rules, Unslop Skill, and WebGLErrorBoundary onto `feat/exoplanet-comparison-3d`

**Files:**
- Create (via git checkout from `pre-release/v2.6.0-phase1`): `RULES.md`, `.gemini/rules/project-rules.md`, `.agents/skills/unslop/SKILL.md`, `skills-lock.json`, `src/components/WebGLErrorBoundary.tsx`
- Modify: `src/components/WebGLErrorBoundary.tsx:38-58` (standardize error fallback surface onto `.observatory-panel` / `.observatory-control`)

**Interfaces:**
- Produces: `WebGLErrorBoundary` React component (`class WebGLErrorBoundary extends Component<Props, State>`) with props `{ children: ReactNode; fallbackTitle?: string; fallbackMessage?: string; onReset?: () => void; className?: string }`.

- [ ] **Step 1: Verify target branch and baseline clean state**

Run:
```bash
git checkout feat/exoplanet-comparison-3d
git status --short
```
Expected: `feat/exoplanet-comparison-3d` checked out cleanly.

- [ ] **Step 2: Bring over governance rules, skills, and `WebGLErrorBoundary.tsx` from `pre-release/v2.6.0-phase1`**

Run:
```bash
git checkout pre-release/v2.6.0-phase1 -- RULES.md .gemini/rules/project-rules.md .agents/skills/unslop/SKILL.md skills-lock.json src/components/WebGLErrorBoundary.tsx
```

- [ ] **Step 3: Standardize `src/components/WebGLErrorBoundary.tsx` on Observatory tokens**

Replace legacy `bg-slate-950/80 border-slate-800 backdrop-blur-md` container styling with `observatory-panel rounded-2xl`, and replace `bg-cyan-950/60 ... shadow-[0_0_15px_rgba(6,182,212,0.15)]` on the "Restore 3D Stage" button with `observatory-control min-h-11 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide active:scale-95`.

- [ ] **Step 4: Typecheck and verify brought-over files**

Run: `npm run lint`
Expected: PASS with zero TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add RULES.md .gemini/rules/project-rules.md .agents/skills/unslop/SKILL.md skills-lock.json src/components/WebGLErrorBoundary.tsx
git commit -m "chore: port project rules, unslop skill, and WebGLErrorBoundary from pre-release"
```

---

### Task 2: Migrate `index.html` and `src/index.css` to Observatory Typography & Design Tokens

**Files:**
- Modify: `index.html:63-67`
- Modify: `src/index.css:1-125`
- Test: `scripts/verify-exoplanet-observatory.ts`

**Interfaces:**
- Produces: CSS utility classes `.observatory-panel`, `.observatory-control`, updated `--font-sans`/`--font-display`/`--font-title` (`Instrument Sans`), global `:focus-visible`, plus preserved `@media (prefers-reduced-motion: reduce)` and interactive cursor base rules.

- [ ] **Step 1: Create verification script `scripts/verify-exoplanet-observatory.ts` with token & CSS assertions**

Create `scripts/verify-exoplanet-observatory.ts` exporting check functions runnable from CLI that assert for Task 2:
1. `index.html` does not contain `Orbitron` or `Plus+Jakarta+Sans` and includes `Instrument+Sans` and `JetBrains+Mono`.
2. `src/index.css` defines `.observatory-panel`, `.observatory-control`, `:focus-visible`, and maps `--font-display` and `--font-title` to `Instrument Sans`.
3. `src/index.css` contains zero `.cosmic-glass` or `.cosmic-glow-` rules.
4. `src/index.css` preserves `@media (prefers-reduced-motion: reduce)` and `button:disabled` cursor rules.

- [ ] **Step 2: Run verification check to confirm it fails before edits**

Run: `npx tsx scripts/verify-exoplanet-observatory.ts --phase=tokens`
Expected: FAIL (`Orbitron still present`, `.observatory-panel missing`, `.cosmic-glass present`).

- [ ] **Step 3: Update `index.html` and `src/index.css`**

- In `index.html:65`, swap the Google Fonts `<link>` to `family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=JetBrains+Mono:wght@400;500;700&display=swap`. Update `<body ...>` selection class from `selection:bg-cyan-500/30 selection:text-cyan-200` to `selection:bg-sky-500/30 selection:text-sky-100`.
- In `src/index.css`:
  - Map `--font-sans`, `--font-display`, `--font-title` to `'Instrument Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` with `letter-spacing: -0.02em` on headings.
  - Keep existing cursor rules (`a[href], button:not(:disabled)...` and `button:disabled...`) and `@media (prefers-reduced-motion: reduce)`.
  - Add `:focus-visible { outline: 2px solid #38bdf8; outline-offset: 2px; }`.
  - Remove `.cosmic-glass`, `.cosmic-glass-hover`, `.cosmic-glow-cyan`, `.cosmic-glow-amber`, `.cosmic-glow-star` and define `.observatory-panel` and `.observatory-control` matching `pre-release/v2.6.0-phase1:src/index.css:48-67`.

- [ ] **Step 4: Run token verification and typecheck**

Run: `npx tsx scripts/verify-exoplanet-observatory.ts --phase=tokens && npm run lint`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add index.html src/index.css scripts/verify-exoplanet-observatory.ts
git commit -m "style(exoplanets): migrate typography and CSS tokens to observatory design system"
```

---

### Task 3: De-Slop `LoadingSprite.tsx` and Extract Pure Exoplanet Formatters

**Files:**
- Modify: `src/components/LoadingSprite.tsx:1-25`
- Create: `src/utils/exoplanetFormatters.ts`
- Modify: `src/components/ExoplanetCanvas3D.tsx:45-215` (import helpers from `src/utils/exoplanetFormatters.ts`)

**Interfaces:**
- Produces (`src/utils/exoplanetFormatters.ts`):
  - `export type CelestialSortKey = 'size' | 'mass' | 'temperature' | 'discoveryYear';`
  - `export type SortDirection = 'asc' | 'desc';`
  - `export interface TourMetricDisplay { label: string; primary: string; secondary: string; unit: string; }`
  - `export function inferBodyColor(body: CelestialBody): string`
  - `export function formatCompactBodyMass(body: CelestialBody): string`
  - `export function getTourMetricDisplay(body: CelestialBody, sortKey: CelestialSortKey): TourMetricDisplay`

- [ ] **Step 1: Extend `scripts/verify-exoplanet-observatory.ts` with `--phase=loading-formatters` assertions**

Assert:
1. `LoadingSprite.tsx` contains no `shadow-[0_0_` glow shadow and no `animate-ping` halo ring, uses `Instrument Sans` / default sans for the primary label and `font-mono` only for status telemetry, and keeps crisp `#38bdf8` sky accent border.
2. `src/utils/exoplanetFormatters.ts` exports `inferBodyColor`, `formatCompactBodyMass`, and `getTourMetricDisplay`, and unit-tests `inferBodyColor` (`earth -> '#38bdf8'`), `formatCompactBodyMass` (`massEarth: 0 -> 'Unknown Mass'`), and `getTourMetricDisplay` (`size` on `diameterEarth: 1.0 -> '1.00 D⊕'`).
3. `ExoplanetCanvas3D.tsx` imports those helpers rather than defining duplicate copies inline.

- [ ] **Step 2: Run check to confirm it fails**

Run: `npx tsx scripts/verify-exoplanet-observatory.ts --phase=loading-formatters`
Expected: FAIL (`LoadingSprite` contains `animate-ping` / cyan neon shadow; `exoplanetFormatters.ts` does not exist).

- [ ] **Step 3: Refactor `LoadingSprite.tsx` and create `src/utils/exoplanetFormatters.ts`**

- Move `CelestialSortKey`, `SortDirection`, `inferBodyColor`, `formatCompactBodyMass`, and `getTourMetricDisplay` from `ExoplanetCanvas3D.tsx:45-214` into `src/utils/exoplanetFormatters.ts`, exporting `CelestialSortKey` and `SortDirection` back out from `ExoplanetCanvas3D.tsx` if needed for import compatibility.
- In `LoadingSprite.tsx`, replace the `animate-ping` div and `shadow-[0_0_30px_rgba(6,182,212,0.4)]` ring with a crisp hairline ring container (`observatory-panel rounded-2xl p-6`), neutral spinner (`border-white/10 border-t-sky-400`), `font-sans` title, and restrained sub-label.

- [ ] **Step 4: Run verification and typecheck**

Run: `npx tsx scripts/verify-exoplanet-observatory.ts --phase=loading-formatters && npm run lint`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/LoadingSprite.tsx src/utils/exoplanetFormatters.ts src/components/ExoplanetCanvas3D.tsx scripts/verify-exoplanet-observatory.ts
git commit -m "refactor(exoplanets): de-slop LoadingSprite and extract pure telemetry formatters"
```

---

### Task 4: Extract `ExoplanetShortcutsModal.tsx` with Observatory Styling & Accessibility

**Files:**
- Create: `src/components/ExoplanetShortcutsModal.tsx`
- Modify: `src/components/ExoplanetCanvas3D.tsx:2761-2886` (render `<ExoplanetShortcutsModal isOpen={showShortcutsHelp} onClose={() => setShowShortcutsHelp(false)} />`)

**Interfaces:**
- Produces (`src/components/ExoplanetShortcutsModal.tsx`):
  - `export interface ExoplanetShortcutsModalProps { isOpen: boolean; onClose: () => void; }`
  - `export const ExoplanetShortcutsModal: React.FC<ExoplanetShortcutsModalProps>`

- [ ] **Step 1: Extend `scripts/verify-exoplanet-observatory.ts` with `--phase=shortcuts-modal` assertions**

Assert:
1. `ExoplanetShortcutsModal.tsx` renders `role="dialog"` and `aria-modal="true"`.
2. Uses `observatory-panel` and `border-white/10` instead of `bg-[#040816] border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.3)]`.
3. Close button and footer dismiss button include `min-h-11` (`44px` minimum height) and close icon button includes `min-w-11 min-h-11`.
4. Contains zero em dashes (`U+2014`) and reserves `font-mono` for shortcut key chips, using `font-sans` for section labels and descriptions.

- [ ] **Step 2: Run check to verify failure**

Run: `npx tsx scripts/verify-exoplanet-observatory.ts --phase=shortcuts-modal`
Expected: FAIL (`ExoplanetShortcutsModal.tsx` not found).

- [ ] **Step 3: Implement `ExoplanetShortcutsModal.tsx` and wire it in `ExoplanetCanvas3D.tsx`**

- Extract lines `2761-2886` from `ExoplanetCanvas3D.tsx` into `ExoplanetShortcutsModal.tsx` as a data-driven shortcut group list (avoiding duplicated row JSX across sections).
- Style dialog shell with `observatory-panel rounded-2xl border-white/10`, section boxes with `bg-black/40 border border-white/10 rounded-xl`, sky accent headers (`text-sky-400`), and `min-h-11` interactive close buttons.
- Replace inline modal JSX in `ExoplanetCanvas3D.tsx` with `<ExoplanetShortcutsModal isOpen={showShortcutsHelp} onClose={() => setShowShortcutsHelp(false)} />`.

- [ ] **Step 4: Run verification and typecheck**

Run: `npx tsx scripts/verify-exoplanet-observatory.ts --phase=shortcuts-modal && npm run lint`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ExoplanetShortcutsModal.tsx src/components/ExoplanetCanvas3D.tsx scripts/verify-exoplanet-observatory.ts
git commit -m "refactor(exoplanets): extract ExoplanetShortcutsModal with observatory styling and 44px targets"
```

---

### Task 5: Extract & De-Slop `ExoplanetStageHud.tsx` (HUD Chrome, Floating Label, Search & Tour Dock)

**Files:**
- Create: `src/components/ExoplanetStageHud.tsx`
- Modify: `src/components/ExoplanetCanvas3D.tsx:1712-2760` (delegate UI overlays to `<ExoplanetStageHud ... />`)

**Interfaces:**
- Produces (`src/components/ExoplanetStageHud.tsx`):
  - Typed props interface `ExoplanetStageHudProps` passing read-only display state (`sortedBodies`, `filteredBodies`, `activeBodyId`, `activeFocusedBody`, `displayBody`, `isSceneReady`, `loadProgress`, `webglError`, `sortKey`, `sortDirection`, `layoutMode`, `isAutoRotating`, `wireframe`, `showGrid`, `isTourMode`, `isTourPlaying`, `tourLength`, `isSearchActive`, `searchQuery`, `isFullscreen`, `areControlsHidden`, `isTopPanelMinimized`, menu open states, `labelElementsRef`, `sortMenuRef`, `layoutMenuRef`, `moreMenuRef`, `tourPaceMenuRef`) and discrete action callbacks (`onSelect`, `onHover`, `onZoom`, `onResetCamera`, `onFitAll`, `onUnfocus`, `onToggleTour`, `onEndTour`, `onToggleTourPlay`, `onRestartTour`, `onPrev`, `onNext`, `onFirst`, `onLast`, `onToggleFullscreen`, `onSortChange`, `onLayoutChange`, etc.).

- [ ] **Step 1: Extend `scripts/verify-exoplanet-observatory.ts` with `--phase=hud` assertions**

Assert on `src/components/ExoplanetStageHud.tsx` and `src/components/ExoplanetCanvas3D.tsx`:
1. Zero occurrences of `backdrop-blur-xl`, `backdrop-blur-2xl`, `shadow-[0_0_`, `from-cyan-600`, `border-cyan-500`, `bg-[#040816]`, or `animate-ping` in `ExoplanetStageHud.tsx`.
2. Container chrome uses `observatory-panel` and interactive controls use `observatory-control` or hairline `border-white/10`.
3. All clickable HUD buttons (`btn-zoom-in`, `btn-zoom-out`, `btn-unfocus`, `btn-reset-cam`, `btn-fit-all`, `btn-toggle-layout`, `btn-layout-menu-trigger`, pagination buttons, search button/close, shortcuts trigger) carry `min-h-11` (`>= 44px` touch target).
4. Zero em dashes (`U+2014`) and `Instrument Sans` headings (`font-display` / `font-sans`) on primary labels, with `font-mono` reserved for numbers, indices, and telemetry values.

- [ ] **Step 2: Run check to confirm it fails**

Run: `npx tsx scripts/verify-exoplanet-observatory.ts --phase=hud`
Expected: FAIL (`ExoplanetStageHud.tsx` not found).

- [ ] **Step 3: Implement `ExoplanetStageHud.tsx` and wire into `ExoplanetCanvas3D.tsx`**

- Extract overlays from `ExoplanetCanvas3D.tsx:1712-2760` into `ExoplanetStageHud.tsx` (splitting internal render sections cleanly into focused subcomponents or helpers inside the HUD module: top bar, floating 3D body pill, bottom catalog bar + search strip, and tour lower-third HUD).
- Standardize:
  - Main floating bars and dropdown menus: `.observatory-panel` (`border-white/10 rounded-xl`).
  - Interactive buttons & active chips: `.observatory-control` with crisp flat active states (`bg-sky-500/20 border-sky-400/60 text-sky-200`, or `bg-amber-500/15 border-amber-400/50 text-amber-200` for unfocus/pause, `bg-purple-500/15 border-purple-400/50 text-purple-200` for spiral mode, `bg-emerald-500/15 border-emerald-400/50 text-emerald-200` for linear mode) and zero synthetic neon box shadows.
  - Tour lower-third hero name and floating pill headers: clean `Instrument Sans` display type without text glow tropes; replace `animate-ping` status dot on `Auto Tour Playing` with a static or subtle opacity pulse ring respectful of `prefers-reduced-motion`.
  - Apply `min-h-11` (and `min-w-11` on icon-only `+`/`-`/`X` buttons) without causing horizontal wrap overflow on `< 360px` screens (`overflow-x-auto` / compact responsive spacing).

- [ ] **Step 4: Run HUD verification and typecheck**

Run: `npx tsx scripts/verify-exoplanet-observatory.ts --phase=hud && npm run lint`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ExoplanetStageHud.tsx src/components/ExoplanetCanvas3D.tsx scripts/verify-exoplanet-observatory.ts
git commit -m "refactor(exoplanets): extract and de-slop ExoplanetStageHud to observatory standards"
```

---

### Task 6: Harden WebGL Cleanup, Modal-Safe Hotkeys, and `App.tsx` Error Boundary

**Files:**
- Modify: `src/components/ExoplanetCanvas3D.tsx:715-725, 1610-1687`
- Modify: `src/App.tsx:1-25`

**Interfaces:**
- Consumes: `WebGLErrorBoundary` (`src/components/WebGLErrorBoundary.tsx`)
- Behavior guaranteed:
  - `ExoplanetCanvas3D.tsx` unmount effect calls `rendererRef.current.dispose(); rendererRef.current.forceContextLoss(); rendererRef.current = null;` and removes/handles `webglcontextlost` gracefully.
  - `ExoplanetCanvas3D.tsx` `handleKeyDown` handles `Escape` in overlay priority order (`showShortcutsHelp` -> open dropdown menus -> `isSearchActive` -> `isTourMode`) and suppresses stage hotkeys whenever `showShortcutsHelp` is open or an `<input>` / `<textarea>` / `<select>` is focused.
  - `src/App.tsx` renders `<WebGLErrorBoundary fallbackTitle="Exoplanet 3D Stage Paused" onReset={() => setStageKey((k) => k + 1)}>` around `<ExoplanetCanvas3D key={stageKey} ... />`.

- [ ] **Step 1: Add `--phase=safety` checks to `scripts/verify-exoplanet-observatory.ts`**

Assert:
1. `ExoplanetCanvas3D.tsx` invokes `forceContextLoss()` in its renderer cleanup path.
2. `ExoplanetCanvas3D.tsx` `handleKeyDown` early-returns on `showShortcutsHelp` modal active state (except `Escape` closing the modal) and checks `HTMLSelectElement` alongside `HTMLInputElement`/`HTMLTextAreaElement`.
3. `App.tsx` imports and wraps `<ExoplanetCanvas3D>` with `<WebGLErrorBoundary>`.
4. No remaining `Orbitron`, `cosmic-glass`, `cosmic-glow`, or em dashes (`U+2014`) exist in `index.html`, `src/index.css`, `src/App.tsx`, `src/components/LoadingSprite.tsx`, `src/components/ExoplanetCanvas3D.tsx`, `src/components/ExoplanetStageHud.tsx`, or `src/components/ExoplanetShortcutsModal.tsx`.

- [ ] **Step 2: Run safety check to confirm failure before implementation**

Run: `npx tsx scripts/verify-exoplanet-observatory.ts --phase=safety`
Expected: FAIL (`forceContextLoss missing`, `WebGLErrorBoundary not used in App.tsx`).

- [ ] **Step 3: Update `ExoplanetCanvas3D.tsx` cleanup/hotkeys and wrap in `src/App.tsx`**

- In `ExoplanetCanvas3D.tsx`:
  - Add `renderer.domElement.addEventListener('webglcontextlost', ...)` with `e.preventDefault()` setting `setWebglError(...)` on context loss, and clean up the listener plus `rendererRef.current.dispose()`, `rendererRef.current.forceContextLoss()`, `rendererRef.current = null` in unmount.
  - Track `showShortcutsHelpRef`, `isSearchActiveRef`, and menu refs inside `handleKeyDown`: on `Escape`, close `showShortcutsHelp` first, then open dropdowns, then `isSearchActive`, then `isTourMode`; if `showShortcutsHelpRef.current` is true, return immediately before processing stage hotkeys.
- In `src/App.tsx`:
  - Import `WebGLErrorBoundary`, maintain `stageResetKey` state to remount cleanly on `onReset`, and replace `selection:bg-cyan-500/30` with `selection:bg-sky-500/30 selection:text-sky-100`.

- [ ] **Step 4: Run full verification suite and production build**

Run:
```bash
npx tsx scripts/verify-exoplanet-observatory.ts --all
npm run lint
npm run build
```
Expected: All verification checks PASS, `tsc --noEmit` exits 0, and Vite/esbuild production bundle builds cleanly.

- [ ] **Step 5: Commit**

```bash
git add src/components/ExoplanetCanvas3D.tsx src/App.tsx scripts/verify-exoplanet-observatory.ts
git commit -m "fix(exoplanets): enforce WebGL context loss cleanup, modal hotkey gating, and error boundary"
```

---

## Self-Review Check

- **Spec coverage:** G-1 -> Task 1; G-2 -> Task 2; G-3 -> Tasks 3, 4, 5; G-4 -> Tasks 3, 4, 5, 6; G-5 -> Tasks 2, 4, 5, 6.
- **Step completeness:** Every file path, exported type/function signature, CSS token, and verification command is explicit. No placeholder steps (`TBD`, `handle edge cases`).
- **Type consistency:** `CelestialSortKey`, `SortDirection`, `TourMetricDisplay`, `ExoplanetShortcutsModalProps`, and `ExoplanetStageHudProps` align across Tasks 3-6.
- **Scope:** Leaves `PHASE_3_PLAN.md` new feature modules (`ExoplanetDossierModal.tsx`, `PlanetarySystemDossierModal.tsx`, `ExoplanetEncyclopedia.tsx`) cleanly unblocked to be built natively on Observatory standards next.
