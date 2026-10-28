export interface StageDisplayableItem {
  id: string;
  name: string;
  subtitlePills: string[]; // e.g. ['Terrestrial Planet', 'Host: Sun'] or ['M1-2Ia-ab', 'Red Supergiant']
  colorHex?: string;
  diameterKm: number;
  // Multipliers for comparison
  primaryMultiplierText: string; // e.g. '1.000 × Earth' or '1.000 D☉'
  secondaryMetricText?: string;  // e.g. '0.091 × Jupiter' or '8.5 Million Years'
  metricLabel: string;           // e.g. 'DIAMETER'
  // 3D sizing (Three.js units)
  meshRadius: number;
}
