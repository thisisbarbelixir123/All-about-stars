# Starpedia 3D (Exoplanet Branch): Deep Space Research Observatory Design Spec

**Date:** 2026-11-11  
**Branch:** `feat/exoplanet-comparison-3d`  
**Status:** Approved for Implementation  
**Reference Spec:** `pre-release/v2.6.0-phase1:docs/superpowers/specs/2026-11-08-starpedia-anti-slop-design.md`

---

## 1. Intent & Context

### Background
The `feat/exoplanet-comparison-3d` branch introduces a 2,142+ body planetary and exoplanetary 3D comparator (`ExoplanetCanvas3D.tsx`), Sudarsky/spectroscopic classification palettes (`exoplanetArchetypes.ts`), procedural world shaders (`planetShaderUtils.ts`), non-spherical asteroid geometry (`celestialGeometry.ts`), runtime texture caching (`vite.config.ts`), and `PHASE_3_PLAN.md` for full integration into Starpedia 3D.

Because this branch diverged at commit `09064c0`, it missed all governance, Antislop, and Superpowers work implemented on `pre-release/v2.6.0-phase1`:
- Project rules (`RULES.md`, `.gemini/rules/project-rules.md`) and `.agents/skills/unslop/SKILL.md` are absent.
- `index.html` and `src/index.css` still import `Orbitron` and `Plus Jakarta Sans` and define legacy `.cosmic-glass` / `.cosmic-glow-*` classes.
- `ExoplanetCanvas3D.tsx` has grown to 2,887 lines in a single file, combining Three.js WebGL lifecycle, telemetry formatters, HUD controls, search drawer, lower-third tour bar, and keyboard shortcuts modal.
- HUD panels and `LoadingSprite.tsx` use neon cyan glows (`shadow-[0_0_...]`), gradients (`from-cyan-600 to-blue-600`), heavy blur (`backdrop-blur-xl` / `backdrop-blur-2xl`), sub-44px tap targets (`w-7 h-7`, `py-1.5`), and universal `font-mono` labels.
- `ExoplanetCanvas3D.tsx` lacks `WebGLErrorBoundary`, `renderer.forceContextLoss()` on unmount, and modal-aware hotkey suppression (required by `RULES.md` Sections 2, 3, and 7).

### Goal
Bring `feat/exoplanet-comparison-3d` into full parity with `pre-release/v2.6.0-phase1` project rules, Antislop design standards, and Superpowers engineering discipline before executing `PHASE_3_PLAN.md`.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- **G-1: Governance & Skill Parity**: Cherry-pick or port `RULES.md`, `.gemini/rules/project-rules.md`, `.agents/skills/unslop/SKILL.md`, `skills-lock.json`, and `WebGLErrorBoundary.tsx` from `pre-release/v2.6.0-phase1`.
- **G-2: Observatory Design Tokens & Typography**: Migrate `index.html` and `src/index.css` to `Instrument Sans` (display, titles, navigation, body) and `JetBrains Mono` (strictly telemetry, coordinates, spectral/Sudarsky codes, and shortcut keys), plus `.observatory-panel`, `.observatory-control`, and `:focus-visible`, while preserving existing `prefers-reduced-motion` and interactive cursor base rules on this branch.
- **G-3: De-Slop Exoplanet Stage UI & Loading State**: Refactor `LoadingSprite.tsx` and `ExoplanetCanvas3D.tsx` HUD/modals/pills to use restrained obsidian surfaces (`.observatory-panel`), hairline borders (`border-white/10`), flat sky/amber active states, and authentic planetary/blackbody color indicators instead of neon cyan halos.
- **G-4: Modularize & Harden Stage Architecture (`RULES.md` Sections 2, 3, 6, 7)**: Split the 2,887-line `ExoplanetCanvas3D.tsx` monolith by separating pure telemetry/color formatters, the shortcuts modal, and stage HUD chrome from the Three.js WebGL canvas controller; add `forceContextLoss()` cleanup, `WebGLErrorBoundary` wrapping in `App.tsx`, and overlay-aware hotkey suppression.
- **G-5: Accessibility & Touch Ergonomics**: Enforce minimum 44px interactive touch targets (`min-h-11` / `min-w-11`), >=4.5:1 text contrast on dark obsidian surfaces, and keyboard `Escape` precedence across modals, search bars, and dropdown menus.

### Non-Goals
- **NG-1**: Altering planetary catalog data (`src/data/exoplanetCatalog.json`, `exoplanetCatalog.ts`, `solarSystemCatalog.ts`, `masterCelestialCatalog.ts`) or physical constants.
- **NG-2**: Modifying procedural planet GLSL shaders (`planetShaderUtils.ts`), non-spherical geometries (`celestialGeometry.ts`), or `vite.config.ts` runtime texture caching (`globIgnores: ['**/textures/**']`).
- **NG-3**: Implementing the full `PHASE_3_PLAN.md` encyclopedia and multi-stage `App.tsx` merge inside this anti-slop preparation plan (Phase 3 deliverables will follow in a separate plan built directly on these Observatory tokens).

### Anti-Goals
- **AG-1: Dropping Branch-Specific Improvements**: Do not overwrite `prefers-reduced-motion` CSS guards, cursor rules, or runtime WebGL performance optimizations landed in `52679db`, `47288e2`, and `b30cef3`.
- **AG-2: Over-Abstracting Three.js Hot Loops**: Keep `requestAnimationFrame` camera/orbital state in `useRef` and mutable Three.js handles; never push 60 FPS frame ticks into React `useState`.

---

## 3. Antislop Dials & Visual Constraints

- **ENERGY: 2 (Balanced)**: Obsidian surfaces step back so illuminated worlds and gas bands remain the visual focus.
- **RHYTHM: 2 (Structured with Intentional Breaks)**: Clean top/bottom observatory bars framing an unobstructed 3D viewport.
- **MOTION: 2 (Fluid & Purposeful)**: Respect `prefers-reduced-motion`; remove gratuitous `animate-ping` status halos on static controls and loading spinners.
- **Hard Gates**:
  - Zero `Orbitron`, `.cosmic-glass`, `.cosmic-glow-*`, or `shadow-[0_0_...]` neon halos.
  - Zero `backdrop-blur-xl` / `backdrop-blur-2xl` (cap panel blur at `12px` via `.observatory-panel`).
  - Zero em dashes (`U+2014`) in UI copy, tooltips, specs, or plans (Antislop R-02).
  - Minimum `44px` tap targets (`min-h-11` and `min-w-11` where applicable) on all interactive stage buttons and modal triggers.
