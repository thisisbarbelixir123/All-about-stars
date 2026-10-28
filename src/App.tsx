import React from 'react';
import { ExoplanetCanvas3D } from './components/ExoplanetCanvas3D';
import { MASTER_CELESTIAL_CATALOG } from './data/masterCelestialCatalog';

export default function App() {
  return (
    <div className="w-screen h-screen bg-[#030712] overflow-hidden">
      <ExoplanetCanvas3D items={MASTER_CELESTIAL_CATALOG} initialIndex={0} />
    </div>
  );
}
