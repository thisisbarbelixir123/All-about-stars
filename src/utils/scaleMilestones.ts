import { StarData } from '../types';

export interface ScaleMilestone {
  id: string;
  name: string;
  type: 'planetary_orbit' | 'metric_threshold';
  diameterKm: number;
  diameterSolar: number;
  diameterAU?: number;
  description: string;
  planetName?: string;
  colorHex: string;
}

/**
 * Planetary orbits (Mercury through Saturn) and metric milestones (1,000 Earth Diameters, 1 Gigameter, 1 Terameter).
 * 1 Solar Diameter (D☉) = 1,392,700 km.
 * 1 AU = 149,597,870.7 km = 107.415 D☉.
 * 1 Gigameter (Gm) = 1,000,000 km = 0.718 D☉.
 * 1 Terameter (Tm) = 1,000,000,000 km = 718.03 D☉ = 6.6846 AU.
 */
export const SCALE_MILESTONES: ScaleMilestone[] = [
  // 1. Metric: 1 Gigameter (1,000,000 km)
  {
    id: 'milestone-1-gigameter',
    name: '1 Gigameter',
    type: 'metric_threshold',
    diameterKm: 1000000,
    diameterSolar: +(1000000 / 1392700).toFixed(2), // 0.72 D☉
    diameterAU: +(1000000 / 149597870.7).toFixed(6),
    description: '1 Million Kilometers (10⁹ meters).',
    colorHex: '#38bdf8'
  },

  // 2. Metric: 1,000 Earth Diameters (12,742,000 km)
  {
    id: 'milestone-1000-earth',
    name: '1,000 Earth Diameters',
    type: 'metric_threshold',
    diameterKm: 12742000,
    diameterSolar: +(12742000 / 1392700).toFixed(2), // 9.15 D☉
    diameterAU: +(12742000 / 149597870.7).toFixed(5),
    description: '1,000 Earths aligned edge-to-edge.',
    colorHex: '#38bdf8'
  },

  // 3. Planetary Orbit: Orbit of Mercury
  // Semi-major axis = 0.387098 AU -> Orbit diameter = 0.774196 AU = 115,818,000 km = 83.16 D☉
  {
    id: 'milestone-orbit-mercury',
    name: 'Orbit of Mercury',
    planetName: 'Mercury',
    type: 'planetary_orbit',
    diameterKm: 115818000,
    diameterSolar: 83.16,
    diameterAU: 0.7742,
    description: 'Average diameter of Mercury\'s orbit around the Sun.',
    colorHex: '#94a3b8'
  },

  // 4. Planetary Orbit: Orbit of Venus
  // Semi-major axis = 0.723332 AU -> Orbit diameter = 1.446664 AU = 216,418,000 km = 155.40 D☉
  {
    id: 'milestone-orbit-venus',
    name: 'Orbit of Venus',
    planetName: 'Venus',
    type: 'planetary_orbit',
    diameterKm: 216418000,
    diameterSolar: 155.4,
    diameterAU: 1.4467,
    description: 'Average diameter of Venus\'s orbit around the Sun.',
    colorHex: '#eab308'
  },

  // 5. Planetary Orbit: Orbit of Earth (1 AU Radius / 2 AU Diameter)
  // Semi-major axis = 1.000000 AU -> Orbit diameter = 2.000000 AU = 299,195,741 km = 214.83 D☉
  {
    id: 'milestone-orbit-earth',
    name: 'Orbit of Earth (1 AU)',
    planetName: 'Earth',
    type: 'planetary_orbit',
    diameterKm: 299195741,
    diameterSolar: 214.83,
    diameterAU: 2.0,
    description: 'Average diameter of Earth\'s orbit around the Sun (2 AU across).',
    colorHex: '#38bdf8'
  },

  // 6. Planetary Orbit: Orbit of Mars
  // Semi-major axis = 1.523679 AU -> Orbit diameter = 3.047358 AU = 455,878,000 km = 327.33 D☉
  {
    id: 'milestone-orbit-mars',
    name: 'Orbit of Mars',
    planetName: 'Mars',
    type: 'planetary_orbit',
    diameterKm: 455878000,
    diameterSolar: 327.33,
    diameterAU: 3.0474,
    description: 'Average diameter of Mars\'s orbit around the Sun.',
    colorHex: '#f97316'
  },

  // 7. Metric: 1 Terameter (1,000,000,000 km = 10¹² meters = 718.03 D☉)
  {
    id: 'milestone-1-terameter',
    name: '1 Terameter',
    type: 'metric_threshold',
    diameterKm: 1000000000,
    diameterSolar: +(1000000000 / 1392700).toFixed(2), // 718.03 D☉
    diameterAU: +(1000000000 / 149597870.7).toFixed(4), // 6.68 AU
    description: '1 Billion Kilometers (10¹² meters).',
    colorHex: '#c084fc'
  },

  // 8. Planetary Orbit: Orbit of Jupiter
  // Semi-major axis = 5.2044 AU -> Orbit diameter = 10.4088 AU = 1,557,134,000 km = 1,118.07 D☉
  {
    id: 'milestone-orbit-jupiter',
    name: 'Orbit of Jupiter',
    planetName: 'Jupiter',
    type: 'planetary_orbit',
    diameterKm: 1557134000,
    diameterSolar: 1118.07,
    diameterAU: 10.4088,
    description: 'Average diameter of Jupiter\'s orbit around the Sun.',
    colorHex: '#fed7aa'
  },

  // 9. Planetary Orbit: Orbit of Saturn
  // Semi-major axis = 9.5826 AU -> Orbit diameter = 19.1652 AU = 2,867,073,000 km = 2,058.64 D☉
  {
    id: 'milestone-orbit-saturn',
    name: 'Orbit of Saturn',
    planetName: 'Saturn',
    type: 'planetary_orbit',
    diameterKm: 2867073000,
    diameterSolar: 2058.64,
    diameterAU: 19.1652,
    description: 'Average diameter of Saturn\'s orbit around the Sun.',
    colorHex: '#fef08a'
  }
];

/**
 * Computes a 1-to-1 mapping from each ScaleMilestone to exactly ONE closest star in the sorted catalog.
 * Guarantees that each milestone appears ONLY ONCE across the entire comparison catalog!
 */
export function buildMilestoneStarMap(stars: StarData[]): Map<string, ScaleMilestone> {
  const map = new Map<string, ScaleMilestone>();
  if (!stars || stars.length === 0) return map;

  const usedMilestoneIds = new Set<string>();

  for (const milestone of SCALE_MILESTONES) {
    let closestStar: StarData | null = null;
    let minDistance = Infinity;

    for (const star of stars) {
      if (!star.diameterKm || star.diameterKm <= 0) continue;
      // Use log distance so ratio matching is symmetric
      const dist = Math.abs(Math.log10(star.diameterKm / milestone.diameterKm));
      if (dist < minDistance) {
        minDistance = dist;
        closestStar = star;
      }
    }

    if (closestStar && !usedMilestoneIds.has(milestone.id)) {
      map.set(closestStar.id, milestone);
      usedMilestoneIds.add(milestone.id);
    }
  }

  return map;
}
