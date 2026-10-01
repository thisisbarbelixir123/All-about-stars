// Astronomical filter math and mapping for stellar catalog sliders
// Min Diameter: 0.00001 to 2,000 D☉ (internally adjusted by empirical catalog median: 6.8 D☉)
// Max Distance: 3 ly to 1,000,000,000 ly (1 billion ly limit)
// The 0-90% slider range covers the catalog stars with their empirical median (306 ly)
// and extends smoothly to 1 billion ly across 90-100%.
// Median values are NOT shown on the sliders.

export const DIAMETER_MIN = 0.00001;
export const DIAMETER_MEDIAN = 6.8; // Empirical median of all catalog stars
export const DIAMETER_MAX = 2000;

export const DISTANCE_MIN = 3; // Lower limit raised to 3 ly
export const DISTANCE_MEDIAN = 306; // Median of all stars in catalog
export const DISTANCE_CATALOG_MAX = 200000; // Catalog stars ceiling (90% slider mark)
export const DISTANCE_MAX = 1000000000; // 1,000,000,000 ly (1 billion ly limit)

/**
 * Maps slider position (0..1000) to Diameter in Solar Diameters (D☉).
 * Pos 0 -> 0.00001 D☉ (pulsars, neutron stars)
 * Pos 500 -> 7.1 D☉ (catalog median)
 * Pos 1000 -> 2,000 D☉ (hypergiants)
 */
export function sliderPosToDiameter(pos: number): number {
  const clamped = Math.max(0, Math.min(1000, pos));
  if (clamped <= 0) return DIAMETER_MIN;
  if (clamped >= 1000) return DIAMETER_MAX;
  if (clamped === 500) return DIAMETER_MEDIAN;

  if (clamped < 500) {
    const t = clamped / 500;
    const val = DIAMETER_MIN * Math.pow(DIAMETER_MEDIAN / DIAMETER_MIN, t);
    if (val < 0.0001) return Number(val.toPrecision(2));
    if (val < 0.01) return Number(val.toFixed(5));
    if (val < 0.1) return Number(val.toFixed(4));
    if (val < 1) return Number(val.toFixed(3));
    return Number(val.toFixed(2));
  } else {
    const t = (clamped - 500) / 500;
    const val = DIAMETER_MEDIAN * Math.pow(DIAMETER_MAX / DIAMETER_MEDIAN, t);
    if (val < 20) return Number(val.toFixed(2));
    if (val < 100) return Number(val.toFixed(1));
    if (val < 500) return Math.round(val);
    return Math.round(val / 10) * 10;
  }
}

/**
 * Maps a diameter value (D☉) back to the slider position (0..1000).
 */
export function diameterToSliderPos(val: number): number {
  if (val <= DIAMETER_MIN) return 0;
  if (val >= DIAMETER_MAX) return 1000;
  if (Math.abs(val - DIAMETER_MEDIAN) < 0.05) return 500;

  if (val < DIAMETER_MEDIAN) {
    const t = Math.log(val / DIAMETER_MIN) / Math.log(DIAMETER_MEDIAN / DIAMETER_MIN);
    return Math.max(0, Math.min(500, Math.round(t * 500)));
  } else {
    const t = Math.log(val / DIAMETER_MEDIAN) / Math.log(DIAMETER_MAX / DIAMETER_MEDIAN);
    return Math.max(500, Math.min(1000, Math.round(500 + t * 500)));
  }
}

/**
 * Clean scientific formatting for diameter slider values (median values not shown)
 */
export function formatDiameterSliderValue(val: number): string {
  if (val <= DIAMETER_MIN) return '0.00001 D☉ (Min / All)';
  if (val >= DIAMETER_MAX) return '2,000 D☉ (Max)';
  if (val < 0.0001) return `${val.toExponential(2)} D☉`;
  if (val < 0.01) return `${val.toFixed(4)} D☉`;
  if (val < 1) return `${val.toFixed(3)} D☉`;
  if (val < 10) return `${val.toFixed(2)} D☉`;
  if (val < 100) return `${val.toFixed(1)} D☉`;
  return `${Math.round(val).toLocaleString()} D☉`;
}

/**
 * Maps slider position (0..1000) to Distance in Light-Years (ly).
 * 0..90% (pos 0..900) spans all catalog stars with the empirical median (297 ly) at 50%.
 * 90..100% (pos 900..1000) extends up to 1,000,000,000 ly (1 billion ly limit).
 */
export function sliderPosToDistance(pos: number): number {
  const clamped = Math.max(0, Math.min(1000, pos));
  if (clamped <= 0) return DISTANCE_MIN;
  if (clamped >= 1000) return DISTANCE_MAX;
  if (clamped === 500) return DISTANCE_MEDIAN;
  if (clamped === 900) return DISTANCE_CATALOG_MAX;

  if (clamped < 500) {
    const t = clamped / 500;
    const val = DISTANCE_MIN * Math.pow(DISTANCE_MEDIAN / DISTANCE_MIN, t);
    if (val < 10) return Number(val.toFixed(1));
    return Math.round(val);
  } else if (clamped < 900) {
    const t = (clamped - 500) / 400;
    const val = DISTANCE_MEDIAN * Math.pow(DISTANCE_CATALOG_MAX / DISTANCE_MEDIAN, t);
    if (val < 1000) return Math.round(val);
    if (val < 10000) return Math.round(val / 10) * 10;
    return Math.round(val / 100) * 100;
  } else {
    const t = (clamped - 900) / 100;
    const val = DISTANCE_CATALOG_MAX * Math.pow(DISTANCE_MAX / DISTANCE_CATALOG_MAX, t);
    if (val < 1000000) return Math.round(val / 1000) * 1000;
    if (val < 100000000) return Math.round(val / 100000) * 100000;
    return Math.round(val / 1000000) * 1000000;
  }
}

/**
 * Maps a distance value (ly) back to the slider position (0..1000).
 */
export function distanceToSliderPos(val: number): number {
  if (val <= DISTANCE_MIN) return 0;
  if (val >= DISTANCE_MAX) return 1000;
  if (Math.abs(val - DISTANCE_MEDIAN) < 2) return 500;
  if (Math.abs(val - DISTANCE_CATALOG_MAX) < 2000) return 900;

  if (val < DISTANCE_MEDIAN) {
    const t = Math.log(val / DISTANCE_MIN) / Math.log(DISTANCE_MEDIAN / DISTANCE_MIN);
    return Math.max(0, Math.min(500, Math.round(t * 500)));
  } else if (val <= DISTANCE_CATALOG_MAX) {
    const t = Math.log(val / DISTANCE_MEDIAN) / Math.log(DISTANCE_CATALOG_MAX / DISTANCE_MEDIAN);
    return Math.max(500, Math.min(900, Math.round(500 + t * 400)));
  } else {
    const t = Math.log(val / DISTANCE_CATALOG_MAX) / Math.log(DISTANCE_MAX / DISTANCE_CATALOG_MAX);
    return Math.max(900, Math.min(1000, Math.round(900 + t * 100)));
  }
}

/**
 * Clean astronomical formatting for distance slider values (median values not shown)
 */
export function formatDistanceSliderValue(val: number): string {
  if (val <= DISTANCE_MIN) return '3 ly (Min)';
  if (val >= DISTANCE_MAX) return '1,000,000,000 ly (1B ly / Max)';
  if (val < 1000) return `${Math.round(val)} ly`;
  if (val < 1000000) return `${Math.round(val).toLocaleString()} ly`;
  const mLy = val / 1000000;
  if (mLy < 1000) {
    return `${mLy < 10 ? mLy.toFixed(1) : Math.round(mLy)}M ly`;
  }
  const bLy = val / 1000000000;
  return `${bLy.toFixed(1)}B ly`;
}
