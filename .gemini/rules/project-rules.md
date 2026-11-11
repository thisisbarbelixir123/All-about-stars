# Project Rules & Development Guidelines

These rules govern all architectural, design, astronomical, and code decisions for **All-about-stars** (Starpedia). Always follow these standards strictly when developing, refactoring, or extending this repository.

---

## 1. Asset & Media Reuse (Strict Priority)
* **Never recreate existing assets from scratch**:
  * With Starpedia 3D expanding to explore stars, exoplanets, and solar system objects, always verify and reuse existing assets in `public/` and `public/assets/` before introducing any new image, icon, texture, or media file.
* **Telescope & Celestial Imagery**:
  * Utilize existing photography and assets in `public/assets/` (e.g., Galileo, Hubble, JWST, Keck, Palomar, Gaia, ALMA, Cygnus X-1, 51 Pegasi b, solar system/scale previews).
* **Audio & Synthesis Engines**:
  * Reuse existing audio engines in [src/utils/spaceAudioEngine.ts](file:///d:/project%20files/All-about-stars/src/utils/spaceAudioEngine.ts), [ambientSoundscape.ts](file:///d:/project%20files/All-about-stars/src/utils/ambientSoundscape.ts), and [soundEffects.ts](file:///d:/project%20files/All-about-stars/src/utils/soundEffects.ts). Never instantiate parallel, duplicate, or conflicting Web Audio contexts.
* **Shader & Procedural Render Pipelines**:
  * Leverage existing shader routines in [src/utils/starShaderUtils.ts](file:///d:/project%20files/All-about-stars/src/utils/starShaderUtils.ts) and Planckian color maps in [src/utils/stellarColorsD65.ts](file:///d:/project%20files/All-about-stars/src/utils/stellarColorsD65.ts).

---

## 2. Canvas & 3D Performance (25–60 FPS Target)
* **Performance Target**:
  * All 3D scenes (Three.js / WebGL / Canvas) must maintain a steady **25–60 FPS** across lower-end, mobile, and high-DPI displays.
  * Throttle or adapt DPR (`Math.min(window.devicePixelRatio, 2)` or lower during intensive operations) and adjust LOD (level of detail) / particle counts dynamically.
* **WebGL Context & Lifecycle Cleanup**:
  * Every 3D component, scene, or canvas hook MUST implement full disposal routines on unmount (`geometry.dispose()`, `material.dispose()`, `texture.dispose()`, `renderer.dispose()`, `cancelAnimationFrame()`).
  * Explicitly call `renderer.forceContextLoss()` and clean up WebGL contexts using [src/utils/canvasSafety.ts](file:///d:/project%20files/All-about-stars/src/utils/canvasSafety.ts) to prevent the "Too many active WebGL contexts" error.
* **Prevent Memory Leaks**:
  * Remove all resize, scroll, pointer, and animation listeners during teardown.
  * Never retain object or canvas references in unbounded global singletons or uncleared closures.

---

## 3. Keyboard Navigation & Input Disambiguation
* **No Overlapping Shortcuts on 3D Stage**:
  * Camera orbit/pan controls, zoom, and stage controls must not conflict with global or modal hotkeys.
  * When a modal or overlay is active (e.g. [CommandPaletteModal.tsx](file:///d:/project%20files/All-about-stars/src/components/CommandPaletteModal.tsx), [StageAndPresetModal.tsx](file:///d:/project%20files/All-about-stars/src/components/StageAndPresetModal.tsx), [KeyboardShortcutsHelpModal.tsx](file:///d:/project%20files/All-about-stars/src/components/KeyboardShortcutsHelpModal.tsx)), stage hotkeys must be completely suspended or event-stopped (`e.stopPropagation()`).
  * Never assign the same keybinding to multiple competing viewport/UI actions.

---

## 4. No Redundant Features or UI Clutter
* **No Unsolicited / Unwanted Features**:
  * Implement only what is explicitly requested or architecturally necessary. Never invent speculative side-features, duplicate controls, phantom panels, or unsolicited "smart" widgets.
* **No Duplicate Badges, Labels, or Tags**:
  * Do not create redundant status pills, badges, or labels when the state or category is already evident from cards, headers, or existing icons.
* **Consolidate Existing UI**:
  * Use established central hubs ([CommandPaletteModal.tsx](file:///d:/project%20files/All-about-stars/src/components/CommandPaletteModal.tsx), [EncyclopediaDropdown.tsx](file:///d:/project%20files/All-about-stars/src/components/EncyclopediaDropdown.tsx), [ConstellationTabs.tsx](file:///d:/project%20files/All-about-stars/src/components/ConstellationTabs.tsx)) rather than fabricating extra toolbars or floating action buttons.

---

## 5. Logical, Rigorous, & Accurate Implementation
* **No Shallow Assumptions or Misinformation**:
  * All celestial mechanics, physical units, spectral types, and coordinates must adhere to authentic astrophysics and project dataset schemas ([src/types.ts](file:///d:/project%20files/All-about-stars/src/types.ts)).
  * Do not hallucinate fictitious astronomical parameters or invent ad-hoc algorithms that contradict real-world physics or existing helper logic in [src/utils/celestialMechanics.ts](file:///d:/project%20files/All-about-stars/src/utils/celestialMechanics.ts) and [src/utils/orbitalUtils.ts](file:///d:/project%20files/All-about-stars/src/utils/orbitalUtils.ts).
* **Fully Working Features (No Broken Half-Measures)**:
  * Every introduced or refactored capability must be tested, thoroughly wired, and operable end-to-end.
  * Do not leave placeholder functions, broken event handlers, stubbed states, or half-implemented UI mockups.

---

## 6. No Hardcoding
* **Centralized Data Sources**:
  * Store all datasets (stars, exoplanets, constellations, asterisms, spectral guides, solar system objects) strictly inside [src/data/](file:///d:/project%20files/All-about-stars/src/data/).
* **Dynamic Astronomical Calculations**:
  * Compute coordinates, temperatures, orbital tracks, and classifications dynamically using helper modules.
* **Standardized Unit Formatting**:
  * Format all temperatures, solar masses, radii, luminosities, and distances dynamically through [src/utils/formatters.ts](file:///d:/project%20files/All-about-stars/src/utils/formatters.ts). Never hardcode static unit strings in templates.

---

## 7. Refactoring & Code Architecture Standards
* **3D Scene & Canvas Modularization**:
  * Break large monolithic canvas components (such as `StarCanvas3D.tsx`) into decoupled sub-modules:
    1. *Stage Shell / Lifecycle*: Renderer init, DPR adjustment, resize observer, disposal routines.
    2. *Scene Node Layers*: Distinct mesh groups (celestial bodies, orbits, accretion disks, corona shaders).
    3. *Camera Rig / Controls*: Orbit controls, focus interpolation, and raycast hit detection.
* **Lazy Loading & Bundle Splitting**:
  * Heavy visualizers (e.g. `HRDiagram.tsx`, `StarCanvas3D.tsx`, `StellarRemnantGraphic.tsx`) and large data files must be lazy-loaded using `React.lazy()` and dynamic `import()` wrapped in suspense boundaries to preserve rapid initial page load.
* **Decouple 60 FPS Render Loops from React State**:
  * Never push real-time animation ticker values (orbital angles, camera coordinates, rotation steps) into React `useState` hooks inside `requestAnimationFrame`.
  * Store tick/animation states in `useRef` or imperative objects; only trigger React state updates on discrete user interactions (selections, toggles, modal triggers).
* **Optimized Data Layer & Index Caching**:
  * Avoid cloning or iterating the full 2.5 MB `starDatabase.json` across multiple consuming components.
  * Expose cached, memoized getters and lookup indices (by system ID, constellation, or spectral type) in utility modules.
* **Centralized Hotkey & Event Dispatcher**:
  * Do not scatter uncoordinated `window.addEventListener('keydown')` handlers across different components.
  * Manage shortcuts through a centralized key listener or hook that honors the active modal/overlay stack and automatically mutes stage hotkeys when text inputs or modals are focused.
* **Shader & Material Caching**:
  * Reuse procedural materials, shared geometries (spheres, rings, billboards), and shaders across instances. Avoid instantiating `new THREE.Material()` or compiling shaders inside tight render or update cycles.
