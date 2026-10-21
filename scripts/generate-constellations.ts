/**
 * Generate Constellation Astronomical Details from official public/data files:
 * - public/data/constellations.bounds.json
 * - public/data/constellations.borders.json
 */
import fs from 'fs';
import path from 'path';

export function syncConstellationData() {
  const boundsPath = path.resolve(__dirname, '../public/data/constellations.bounds.json');
  const bordersPath = path.resolve(__dirname, '../public/data/constellations.borders.json');
  
  if (!fs.existsSync(boundsPath) || !fs.existsSync(bordersPath)) {
    console.warn('Boundaries or borders data files not found in public/data.');
    return;
  }
  
  const boundsData = JSON.parse(fs.readFileSync(boundsPath, 'utf8'));
  const bordersData = JSON.parse(fs.readFileSync(bordersPath, 'utf8'));
  console.log(`Loaded ${boundsData.features?.length || 0} bounds and ${bordersData.features?.length || 0} borders.`);
}

if (require.main === module) {
  syncConstellationData();
}
