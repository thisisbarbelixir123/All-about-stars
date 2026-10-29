import React, { useState } from 'react';
import { ExoplanetCanvas3D } from './components/ExoplanetCanvas3D';
import { MASTER_CELESTIAL_CATALOG } from './data/masterCelestialCatalog';
import { CelestialBody } from './types';

export default function App() {
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(() => MASTER_CELESTIAL_CATALOG[0] ?? null);

  return (
    <div className="h-screen w-screen bg-[#02040c] text-slate-100 flex flex-col relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <main className="flex-1 w-full h-full relative overflow-hidden">
        <ExoplanetCanvas3D
          items={MASTER_CELESTIAL_CATALOG}
          selectedId={selectedBody?.id ?? null}
          onSelectItem={setSelectedBody}
          showCorona={true}
        />
      </main>
    </div>
  );
}
