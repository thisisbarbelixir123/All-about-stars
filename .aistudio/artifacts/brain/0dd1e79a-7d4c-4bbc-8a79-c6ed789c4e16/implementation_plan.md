# Expanded Stellar System Catalog & Individual Companion Registration

Expand the Stellar System Catalog with rich multi-star systems mapped directly from stars across the catalog (including VV Cephei, Luhman 16, Gliese 667, 40 Eridani, 70 Ophiuchi, Stein 2051, Kruger 60, Ross 614, Wolf 424, EZ Aquarii, 16 Cygni, Xi Boötis, and Acrux), ensure all double stars (such as Castor Ca + Cb) are strictly registered as two distinct stars rather than lumped single entries, and modernize the Stellar System Dossier modal header by removing the system selector dropdown in favor of a clean title bar with return navigation.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed in Phase 1 and guide this implementation:

- **Confirmed Decision 1 (System Selection Scope)**: Add all catalog systems including high-profile systems like VV Cephei, Luhman 16, Gliese 667, 40 Eridani, 70 Ophiuchi, Stein 2051, Kruger 60, Ross 614, Wolf 424, EZ Aquarii, 16 Cygni, and Acrux to `MULTIPLE_STAR_SYSTEMS` with complete 3D orbital hierarchies and physical parameters.
- **Confirmed Decision 2 (Component Registration)**: Strictly register sub-components and double stars (such as Castor Ca and Castor Cb) as two separate, distinct star entries in the catalog and system definitions rather than a single merged entry (`castor-c` is superseded by `castor-ca` and `castor-cb`).
- **Confirmed Decision 3 (Dossier Header Navigation)**: Remove the `<select>` dropdown from the 3D Stellar System Dossier header, replacing it with a clean title header, system badge, metadata pill strip, and intuitive close/catalog return action.

---

## 1. Overview & Core Concept

### What It Does
1. **Catalog Expansion**: Expands `MULTIPLE_STAR_SYSTEMS` from 14 to over 26 interactive multiple star systems, mapping binary, triple, and quadruple systems across the catalog with accurate orbital elements (semi-major axis, period, eccentricity, inclination, mass, temperature, and spectral types).
2. **Double Star Precision**: Ensures double stars and sub-binaries (such as Castor Ca + Castor Cb) are listed as distinct individual stars with their own cards, physical attributes, and orbital trajectories, avoiding ambiguity.
3. **Dossier Header Refinement**: Simplifies `StellarSystemDossierModal.tsx` by eliminating the dropdown switcher, focusing user attention on the active system's interactive 3D simulation and component breakdown.

### Target Audience & Persona
Stargazers, astronomy enthusiasts, educators, and students exploring celestial mechanics who expect rigorous astrophysics data, realistic orbital hierarchies, and consistent catalog navigation.

### Key Value
Seamless bidirectional discovery between individual stars in the catalog and their host multiple-star gravitational systems, without confusing merged entries or cluttered dropdowns.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Browse Expanded Systems**: In Stellar Catalog > "Systems" subtab, users encounter an expanded grid of 26+ stellar systems (e.g. Luhman 16 Brown Dwarf Binary, VV Cephei Eclipsing Supergiant, Gliese 667 Habitable Triple, 40 Eridani Ancient Triple with Sirius-like white dwarf, 70 Ophiuchi, etc.).
2. **Card Inspection**: Each system card showcases member count, distance in light-years, visual separation, and individual colored glowing dots representing each distinct star component.
3. **Launch 3D Dossier**: Clicking any system card immediately launches `StellarSystemDossierModal`, presenting an unobstructed 3D stage with animated orbits, hierarchical barycenters, and interactive component cards.
4. **Inspect Individual Stars**: Clicking any component star in the dossier immediately navigates to its full individual Star Dossier (`StarDossierModal`), with double stars (e.g., Castor Ca and Castor Cb) each having their own unique dossier.

### Visual Identity & Theme
- **Dominant Palette**: Deep space obsidian (`#07090E` / `#0B0E17`) with cyan/blue accent borders (`border-cyan-500/25` and `text-cyan-400`), matching the catalog's unified design.
- **Dossier Modal Header**:
  - Clean title typography (`font-black text-white text-xl sm:text-2xl tracking-tight`).
  - Badge strip showing system architecture (`Binary`, `Triple`, `Quadruple`, `Sextuple`) and star count (`2 Stars Bound`, `3 Stars Bound`).
  - Monospace telemetry metadata (`font-mono text-xs text-cyan-200/70`) displaying constellation, distance, and angular separation.
  - Smooth hover actions with close button (`✕`) providing immediate return to catalog grid.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Removal of Dossier Dropdown**
  - *Chosen Approach*: Completely remove the `<select>` switcher from `StellarSystemDossierModal.tsx`.
  - *Why*: The dropdown created UI clutter on mobile screens and was redundant with the responsive Stellar Systems grid. Removing it creates an uncluttered header focused on the active system.
  - *Alternatives Considered*: Retaining the dropdown or adding next/prev arrows, which was declined in Phase 1 in favor of a clean header.

- **Decision 2: Sub-Component Resolution (Ca + Cb as Two Stars)**
  - *Chosen Approach*: Ensure that sub-binaries and double stars are represented by two separate star entries (e.g. `castor-ca` and `castor-cb`), while removing redundant lumped entries (`castor-c`).
  - *Why*: Astronomically, Castor C is a pair of red dwarfs (YY Geminorum A and B) mutually eclipsing each other every 19.5 hours. Listing them as two stars preserves physical fidelity and satisfies the explicit requirement.

- **Decision 3: Bidirectional Mapping**
  - *Chosen Approach*: Update `STAR_TO_MULTIPLE_SYSTEM_MAP` for all new and existing member stars, so viewing any member in the catalog provides a one-click badge to launch its parent system dossier.

---

## 4. Technical Architecture & Data Strategy

### Component & Data Hierarchy Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Stellar Catalog View                            │
│  ┌─────────────────────────────┐      ┌─────────────────────────────┐  │
│  │    "Stars" Subtab Grid      │      │   "Systems" Subtab Grid     │  │
│  │  • Castor Ca [M0.5Ve]       │      │  • Castor Sextuple          │  │
│  │  • Castor Cb [M0.5Ve]       │      │  • VV Cephei Binary         │  │
│  │  • VV Cephei A [M2Iab]      │      │  • Luhman 16 Binary         │  │
│  │  • VV Cephei B [B0-2V]      │      │  • Gliese 667 Triple        │  │
│  │  • Luhman 16 A [L7.5]       │      │  • 40 Eridani Triple        │  │
│  │  • Luhman 16 B [T0.5]       │      │  • 70 Ophiuchi Binary       │  │
│  └──────────────┬──────────────┘      └──────────────┬──────────────┘  │
└─────────────────┼────────────────────────────────────┼─────────────────┘
                  │                                    │
                  ▼                                    ▼
       ┌───────────────────────┐            ┌───────────────────────┐
       │   StarDossierModal    │◄───────────┤StellarSystemDossier   │
       │   (Single Star 3D)    │            │(No dropdown, clean HUD│
       └───────────────────────┘            └───────────────────────┘
```

### Data Files & Structures to Update
1. `src/data/multipleStarSystemsData.ts`:
   - Add new system definitions:
     - `vv-cephei-system` (VV Cephei A + B)
     - `luhman-16-system` (Luhman 16 A + B)
     - `gliese-667-system` (Gliese 667 A + B + C)
     - `40-eridani-system` (40 Eridani A + B + C)
     - `70-ophiuchi-system` (70 Ophiuchi A + B)
     - `stein-2051-system` (Stein 2051 A + B)
     - `kruger-60-system` (Kruger 60 A + B)
     - `ross-614-system` (Ross 614 A + B)
     - `wolf-424-system` (Wolf 424 A + B)
     - `ez-aquarii-system` (EZ Aquarii A + B + C)
     - `16-cygni-system` (16 Cygni A + B + C)
     - `xi-bootis-system` (Xi Boötis A + B)
     - `acrux-system` (Acrux A + B)
   - Update `STAR_TO_MULTIPLE_SYSTEM_MAP` with all new component IDs.
2. `src/data/stars.ts`:
   - Filter out legacy lumped double star `castor-c` so only `castor-ca` and `castor-cb` are presented in the individual star catalog.
   - Ensure all complementary stars (`gliese-667-c`, `ez-aquarii-c`, `40-eridani-a`, `40-eridani-c`, `16-cygni-c`, etc.) are included in `STARS_CATALOG`.
3. `src/components/StellarSystemDossierModal.tsx`:
   - Remove `<select>` dropdown element and container.
   - Clean up header typography and layout.
