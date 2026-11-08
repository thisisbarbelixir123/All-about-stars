# Starpedia 3D: Anti-Slop (Deep Space Observatory) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Starpedia 3D's interface from a generic AI sci-fi aesthetic into an authentic, bespoke Deep Space Research Observatory by modernizing typography, replacing ambient glows and dot-grids with real starlight colorimetry, de-slopping the hero and stage HUD, and removing all em dashes (`—`).

**Architecture:** Establish shared observatory design tokens and typography rules in `index.html` and `index.css`, clean up educational data copy, and systematically refactor the primary user journey (`HomeScreen.tsx` -> `App.tsx` shell -> `StarCanvas3D.tsx` / `StarInfoPanel.tsx` / `StarDetailModal.tsx`) to use restrained obsidian panels and crisp hairline borders.

**Tech Stack:** React 19, TypeScript 5.8, Tailwind CSS v4, Three.js r185, Vite 6.2.

**Spec:** [`docs/superpowers/specs/2026-11-08-starpedia-anti-slop-design.md`](file:///d:/project%20files/All-about-stars/docs/superpowers/specs/2026-11-08-starpedia-anti-slop-design.md)

## Global Constraints

- **Typography**: Retire `Orbitron` globally. Map `--font-sans`, `--font-display`, and `--font-title` to `'Instrument Sans', system-ui, -apple-system, sans-serif`. Reserve `JetBrains Mono` strictly for numerical telemetry, coordinates, and spectral classes.
- **Copywriting (Antislop R-02)**: FORBIDDEN: em dash character (`—`) in any UI text or educational narrative files. Use commas, periods, colons, or parentheses instead.
- **Color & Lighting (Antislop R-01, R-13)**: Eliminate background radial dot-matrix grids and ambient blur balls (`blur-[120px]`). Radiant color comes from the stars' authentic Planckian D65 colors.
- **Visual Panels (Antislop R-10)**: Cap glassmorphism to subtle obsidian surfaces (`bg-[#060a16]/85 backdrop-blur-md border border-white/10`).
- **Accessibility & Touch (Antislop R-03, R-25, R-32, R-39)**: Minimum 44px tap targets, WCAG AA contrast (minimum 4.5:1), visible keyboard focus rings (`:focus-visible`).
- **Project Rules**: Never modify raw astronomical tables (`stars.ts`, `systems.ts`). Maintain 25–60 FPS WebGL performance target and clean lifecycle disposal.

## Review Focus

1. **Heading font regression**: Ensuring no component still renders `Orbitron` after removing the Google Fonts link.
2. **Em dash remnants**: Ensuring zero em dashes remain in both UI components and educational narrative data files (`src/data/*.ts`).
3. **Contrast on dark obsidian backgrounds**: Ensuring secondary labels on `#060a16` maintain at least 4.5:1 contrast ratio against the background.
4. **Mobile & tablet stage responsiveness**: Ensuring `HomeScreen` star drag/resize and 3D mode button remain fully responsive without horizontal overflow.
5. **Keyboard focus trap or missing focus rings**: Ensuring modal and topbar dropdowns show clean `:focus-visible` rings without breaking mouse clicks.

---

### Task 1: Global Typography & Design System Tokens (`index.html`, `index.css`)

**Files:**
- Modify: `index.html:63-66`
- Modify: `src/index.css:1-75`

**Interfaces:**
- Consumes: Google Fonts Instrument Sans and JetBrains Mono.
- Produces: CSS utility classes `.observatory-panel`, `.observatory-control`, updated `--font-sans`, `--font-display`, `--font-title`, and global `:focus-visible` styling.

- [ ] **Step 1: Write verification script to check font imports and obsolete classes**

Create `scripts/verify-tokens.ts` asserting:
1. `index.html` does not include `Orbitron` in the Google Fonts link and includes `Instrument Sans`.
2. `src/index.css` defines `--font-sans`, `--font-display`, and `--font-title` with `Instrument Sans`.
3. `src/index.css` defines `.observatory-panel` and `.observatory-control`.
4. `src/index.css` defines `:focus-visible`.

- [ ] **Step 2: Run verification script to verify it fails**

Run: `npx tsx scripts/verify-tokens.ts`  
Expected: FAIL (Orbitron still imported, Instrument Sans not configured).

- [ ] **Step 3: Update `index.html` and `src/index.css`**

- In `index.html`, replace Orbitron with Instrument Sans in the Google Fonts link (`family=Instrument+Sans:ital,wght@0,400..700;1,400..700`).
- In `src/index.css`:
  - Update `@theme` to map `--font-sans`, `--font-display`, and `--font-title` to `'Instrument Sans', system-ui, -apple-system, sans-serif`.
  - Remove dead `.cosmic-glass` and `.cosmic-glow-*` rules.
  - Add `.observatory-panel`:
    ```css
    .observatory-panel {
      background-color: rgba(6, 10, 22, 0.85);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.85);
    }
    ```
  - Add `.observatory-control`:
    ```css
    .observatory-control {
      background-color: rgba(9, 14, 32, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #e2e8f0;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .observatory-control:hover {
      background-color: rgba(15, 23, 51, 0.95);
      border-color: rgba(56, 189, 248, 0.45);
      color: #ffffff;
    }
    ```
  - Add global focus ring:
    ```css
    :focus-visible {
      outline: 2px solid #38bdf8;
      outline-offset: 2px;
    }
    ```

- [ ] **Step 4: Run verification script and typecheck**

Run: `npx tsx scripts/verify-tokens.ts && npm run lint`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add index.html src/index.css scripts/verify-tokens.ts
git commit -m "style: modernize typography and add observatory design tokens"
```

---

### Task 2: Educational Narrative Data Copy Pass (Antislop R-02 Compliance)

**Files:**
- Modify: `src/data/whatIsAStarData.ts`
- Modify: `src/data/stellarLifeCycleData.ts`
- Modify: `src/data/classificationGuideData.ts`
- Modify: `src/data/stellarDiscoveryData.ts`
- Modify: `src/data/nomenclatureData.ts`

**Interfaces:**
- Consumes: Raw narrative strings in `src/data/*.ts`.
- Produces: Cleaned narrative data without em dashes (`—`), using colons, commas, or parentheses.

- [ ] **Step 1: Write an em-dash audit script**

Create `scripts/audit-em-dashes.ts` to scan `src/data/` and report any occurrence of the unicode character `\u2014` (`—`).

- [ ] **Step 2: Run em-dash audit script to verify it catches occurrences**

Run: `npx tsx scripts/audit-em-dashes.ts`  
Expected: Lists 52 occurrences across `src/data/*.ts`.

- [ ] **Step 3: Replace em dashes with proper punctuation in narrative data files**

- In `src/data/whatIsAStarData.ts`: replace `—` with commas, colons, or parentheses.
- In `src/data/stellarLifeCycleData.ts`: replace `—` with commas, colons, or parentheses.
- In `src/data/classificationGuideData.ts`: replace `—` with commas, colons, or parentheses.
- In `src/data/stellarDiscoveryData.ts`: replace `—` with commas, colons, or parentheses.
- In `src/data/nomenclatureData.ts`: replace `—` with commas, colons, or parentheses.

- [ ] **Step 4: Run em-dash audit script and catalog validator**

Run: `npx tsx scripts/audit-em-dashes.ts && npm run lint`  
Expected: PASS with 0 em-dash violations in `src/data/`.

- [ ] **Step 5: Commit**

```bash
git add src/data/*.ts scripts/audit-em-dashes.ts
git commit -m "docs: remove em dashes from educational narrative datasets per R-02"
```

---

### Task 3: Hero Landing Page De-slopping (`HomeScreen.tsx`)

**Files:**
- Modify: `src/components/HomeScreen.tsx:217-390`

**Interfaces:**
- Consumes: `.observatory-panel`, `.observatory-control`, `Instrument Sans` display font.
- Produces: De-slopped landing page with no dot grids, no ambient blur orbs, no pill badges, and refined typography.

- [ ] **Step 1: Write test script checking HomeScreen visual constraints**

Create `scripts/verify-homescreen.ts` verifying `HomeScreen.tsx`:
1. Does not contain `radial-gradient` dot background.
2. Does not contain `blur-[120px]` or `blur-[100px]` ambient glow balls.
3. Does not contain `Orbitron` inline font references.
4. Does not contain `ArrowRight` CTA decorator.
5. Does not contain generic buzzwords "cosmic titans" or "astronomical wonders".

- [ ] **Step 2: Run verification script to verify it fails**

Run: `npx tsx scripts/verify-homescreen.ts`  
Expected: FAIL.

- [ ] **Step 3: Refactor `src/components/HomeScreen.tsx`**

- Remove the cosmic dot grid `<div>` with `radial-gradient(...)`.
- Remove the 3 ambient glow `<div>` elements (`bg-cyan-950/30 blur-[120px]`, `bg-blue-950/20`, `bg-amber-950/20`).
- Replace the `STARPEDIA 3D` pill capsule badge with an authentic observatory title badge:
  ```tsx
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.04] border border-white/10 text-slate-300 font-mono text-xs tracking-wider">
    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
    <span>ASTROPHYSICAL COMPARATOR &amp; CATALOG</span>
  </div>
  ```
- Update the `h1` element:
  - Remove `font-['Orbitron',sans-serif]` and excessive drop shadow.
  - Set class: `text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white`.
  - Headline text: `Stars of the Universe`.
- Update the subtitle paragraph:
  - Text: `A physical-scale comparative atlas and interactive 3D observatory of stars across nine orders of magnitude.`
- Refactor the primary CTA button:
  - Remove `ArrowRight`.
  - Replace gradient with solid tactile styling: `px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold tracking-wide transition-all shadow-lg active:scale-95 flex items-center gap-2`.
- Update top controls (3D Mode button, Shuffle Stars) to use `.observatory-control` classes.

- [ ] **Step 4: Run verification script and lint**

Run: `npx tsx scripts/verify-homescreen.ts && npm run lint`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/HomeScreen.tsx scripts/verify-homescreen.ts
git commit -m "refactor(ui): de-slop hero screen with observatory aesthetic"
```

---

### Task 4: Top Navigation & App Shell Refactoring (`App.tsx`, `EncyclopediaDropdown.tsx`)

**Files:**
- Modify: `src/App.tsx:800-980`
- Modify: `src/components/EncyclopediaDropdown.tsx`

**Interfaces:**
- Consumes: `.observatory-panel`, `.observatory-control`.
- Produces: Polished observatory header and dropdown controls without glowing borders or em dashes.

- [ ] **Step 1: Write test script checking App.tsx topbar and text hygiene**

Create `scripts/verify-app-shell.ts` checking `src/App.tsx` and `src/components/EncyclopediaDropdown.tsx` for em dashes and excessive cyan drop shadows.

- [ ] **Step 2: Run verification script to verify it fails**

Run: `npx tsx scripts/verify-app-shell.ts`  
Expected: FAIL.

- [ ] **Step 3: Refactor topbar and dropdown menus in `src/App.tsx` & `EncyclopediaDropdown.tsx`**

- In `src/App.tsx`:
  - Replace cyan glowing topbar button borders with `.observatory-control` styling.
  - Remove all em dashes from topbar tooltips, modal aria-labels, and modal headers.
- In `src/components/EncyclopediaDropdown.tsx`:
  - Replace dropdown container styling with `.observatory-panel`.
  - Update dropdown item hover states to crisp slate/sky highlights rather than neon borders.
  - Ensure all dropdown items have visible focus states.

- [ ] **Step 4: Run verification script and lint**

Run: `npx tsx scripts/verify-app-shell.ts && npm run lint`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components/EncyclopediaDropdown.tsx scripts/verify-app-shell.ts
git commit -m "refactor(nav): apply observatory styling to topbar and encyclopedia dropdown"
```

---

### Task 5: 3D Stage HUD, Dock & Dossier Refactoring (`StarCanvas3D.tsx`, `StarInfoPanel.tsx`, `StarDetailModal.tsx`)

**Files:**
- Modify: `src/components/StarCanvas3D.tsx` (HUD overlays)
- Modify: `src/components/StarInfoPanel.tsx`
- Modify: `src/components/StarDetailModal.tsx`

**Interfaces:**
- Consumes: Star physics telemetry and `.observatory-panel` / `.observatory-control`.
- Produces: Precision instrument HUD and inspection modal using `Instrument Sans` for titles and `JetBrains Mono` for coordinates.

- [ ] **Step 1: Write test script checking HUD and modal font/border compliance**

Create `scripts/verify-stage-hud.ts` checking:
1. No `font-['Orbitron']` references in `StarInfoPanel.tsx` and `StarDetailModal.tsx`.
2. No em dashes in `StarInfoPanel.tsx` or `StarDetailModal.tsx`.
3. Modal headers and cards use `.observatory-panel` or crisp hairline borders.

- [ ] **Step 2: Run verification script to verify it fails**

Run: `npx tsx scripts/verify-stage-hud.ts`  
Expected: FAIL.

- [ ] **Step 3: Refactor HUD, StarInfoPanel, and StarDetailModal**

- In `src/components/StarCanvas3D.tsx`:
  - Replace floating HUD button borders (`border-cyan-500/30`) with `.observatory-control`.
  - Clean up stage scale ruler and camera reset buttons to match observatory theme.
- In `src/components/StarInfoPanel.tsx`:
  - Remove sci-fi pill badges and gradient titles; use `Instrument Sans` for the star's common name.
  - Retain `JetBrains Mono` strictly for spectral type, distance, mass, and radius readouts.
- In `src/components/StarDetailModal.tsx`:
  - Replace heavy cyan glow modal headers with clean observatory typography.
  - Replace all em dashes with commas or colons.
  - Ensure tab buttons have 44px tap targets and keyboard focus indicators.

- [ ] **Step 4: Run verification script and full lint**

Run: `npx tsx scripts/verify-stage-hud.ts && npm run lint`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/StarCanvas3D.tsx src/components/StarInfoPanel.tsx src/components/StarDetailModal.tsx scripts/verify-stage-hud.ts
git commit -m "refactor(hud): de-slop 3D stage HUD and star inspection modal"
```

---

### Task 6: Full Verification, Delivery Gate & Antislop Compliance

**Files:**
- Modify: `README.md` (clean up any em dashes or obsolete badges if present)
- Cleanup: Remove temporary verification scripts (`scripts/verify-*.ts`, `scripts/audit-em-dashes.ts`)

- [ ] **Step 1: Run comprehensive build and catalog validation**

Run: `npm run lint && npm run build`  
Expected: PASS with 0 TypeScript, Vite, or catalog validation errors.

- [ ] **Step 2: Run Antislop Delivery Gate checks**
  - Verify 0 em dashes in all `.tsx` and `.ts` files under `src/`.
  - Verify WCAG AA contrast (minimum 4.5:1) on primary copy.
  - Verify mobile responsiveness and tap targets (minimum 44px) across breakpoints.
  - Record click-through evidence across interactive elements.

- [ ] **Step 3: Clean up temporary verification scripts and commit**

```bash
git rm scripts/verify-*.ts scripts/audit-em-dashes.ts
git commit -m "chore: complete anti-slop refactoring and verify delivery gate"
```
