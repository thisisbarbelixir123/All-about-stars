const fs = require('fs');

let code = fs.readFileSync('src/components/ConstellationGuide.tsx', 'utf8');

// 1. Remove the standalone bordering constellation buttons bar below the dossier viewport
const oldBorderBar = `                  {/* Bordering Constellations Bar: Clickable, unhighlighted adjacent constellations */}
                  {inspectedConstellation.borders.borderingConstellations.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-[#04091c] border border-slate-800 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                          Bordering Constellations ({inspectedConstellation.borders.borderingConstellations.length})
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Click to jump to neighboring boundary</span>
                      </div>

                      {/* If Serpens, display the sectors (Caput and Cauda) grouped clearly */}
                      {inspectedConstellation.id === 'serpens' && inspectedConstellation.borders.sectors ? (
                        <div className="flex flex-col gap-2.5">
                          {inspectedConstellation.borders.sectors.map((sec) => (
                            <div
                              key={sec.shortCode}
                              className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col gap-1.5"
                            >
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="font-bold text-cyan-300">
                                  {sec.name} ({sec.shortCode})
                                </span>
                                <span className="text-slate-400 text-[10px]">{sec.englishName}</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-0.5">
                                {sec.borderingConstellations.map((neighborName) => {
                                  const neighborObj = resolveConstellationByName(neighborName);
                                  return (
                                    <button
                                      key={neighborName}
                                      onClick={() => {
                                        if (neighborObj) {
                                          setInspectedConstellation(neighborObj);
                                        }
                                      }}
                                      className={\`text-[11px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 font-mono \${
                                        neighborObj
                                          ? 'bg-slate-900/90 text-slate-300 border-slate-700/60 hover:border-slate-500 hover:text-white cursor-pointer active:scale-95'
                                          : 'bg-slate-900/40 text-slate-500 border-slate-800/40 cursor-default'
                                      }\`}
                                      title={neighborObj ? \`Inspect \${neighborObj.name} boundary in dossier\` : neighborName}
                                    >
                                      <span>{neighborName}</span>
                                      {neighborObj && <ChevronRight className="w-3 h-3 text-slate-400" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {inspectedConstellation.borders.borderingConstellations.map((neighborName) => {
                            const neighborObj = resolveConstellationByName(neighborName);
                            return (
                              <button
                                key={neighborName}
                                onClick={() => {
                                  if (neighborObj) {
                                    setInspectedConstellation(neighborObj);
                                  }
                                }}
                                className={\`text-[11px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 font-mono \${
                                  neighborObj
                                    ? 'bg-slate-900/90 text-slate-300 border-slate-700/60 hover:border-slate-500 hover:text-white cursor-pointer active:scale-95'
                                    : 'bg-slate-900/40 text-slate-500 border-slate-800/40 cursor-default'
                                \}`}
                                title={neighborObj ? \`Inspect \${neighborObj.name} boundary in dossier\` : neighborName}
                              >
                                <span>{neighborName}</span>
                                {neighborObj && <ChevronRight className="w-3 h-3 text-slate-400" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}`

if (code.includes(oldBorderBar)) {
  code = code.replace(oldBorderBar, '');
  console.log('Removed bordering constellations buttons bar below dossier viewport');
} else {
  console.warn('Could not find oldBorderBar');
}

// 2. Render labels directly on the clickable bordering constellation areas in the dossier viewport
const oldNeighborAreas = `          {/* 4. Bordering Constellations on Sky Map (Highlightable & Clickable Areas) */}
          {borderingConstellationsSvg.length > 0 && opts.showNeighborGuides && (
            <g className="bordering-constellations-areas" clipPath={\`url(#map-frame-clip-\${constellation.id})\`}>
              {borderingConstellationsSvg.map((neighbor, nIdx) => (
                <path
                  key={\`neighbor-area-\${nIdx}\`}
                  d={neighbor.pathData}
                  fill="rgba(30, 41, 59, 0.45)"
                  stroke="#475569"
                  strokeWidth="0.5"
                  strokeDasharray="2 1.5"
                  className="cursor-pointer transition-colors hover:fill-cyan-950/70 hover:stroke-cyan-400 group/neighbor"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (neighbor.neighborObj && onSelectNeighbor) onSelectNeighbor(neighbor.neighborObj);
                  }}
                >
                  <title>{\`\${neighbor.name} (Bordering Constellation • Click to switch to \${neighbor.name} dossier)\`}</title>
                </path>
              ))}
            </g>
          )}`;

const newNeighborAreas = `          {/* 4. Bordering Constellations on Sky Map (Highlightable & Clickable Areas with direct labels) */}
          {borderingConstellationsSvg.length > 0 && opts.showNeighborGuides && (
            <g className="bordering-constellations-areas" clipPath={\`url(#map-frame-clip-\${constellation.id})\`}>
              {borderingConstellationsSvg.map((neighbor, nIdx) => {
                const labelW = Math.max(16, neighbor.abbr.length * 2.5 + 4);
                return (
                  <g
                    key={\`neighbor-group-\${nIdx}\`}
                    className="cursor-pointer group/neighbor"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (neighbor.neighborObj && onSelectNeighbor) onSelectNeighbor(neighbor.neighborObj);
                    }}
                  >
                    <title>{\`\${neighbor.name} (Bordering Constellation • Click to switch to \${neighbor.name} dossier)\`}</title>
                    <path
                      d={neighbor.pathData}
                      fill="rgba(15, 23, 42, 0.40)"
                      stroke="#475569"
                      strokeWidth="0.4"
                      strokeDasharray="1.5 1.5"
                      className="transition-colors group-hover/neighbor:fill-cyan-950/80 group-hover/neighbor:stroke-cyan-300"
                    />
                    <rect
                      x={neighbor.badgePos.x - labelW / 2}
                      y={neighbor.badgePos.y - 3.0}
                      width={labelW}
                      height="6.0"
                      rx="1.2"
                      fill="#020617"
                      fillOpacity="0.88"
                      stroke="#334155"
                      strokeWidth="0.35"
                      className="group-hover/neighbor:stroke-cyan-400 group-hover/neighbor:fill-slate-900 transition-colors pointer-events-none"
                    />
                    <text
                      x={neighbor.badgePos.x}
                      y={neighbor.badgePos.y + 0.9}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="2.2"
                      fontFamily="monospace"
                      fontWeight="bold"
                      className="group-hover/neighbor:fill-cyan-200 pointer-events-none select-none transition-colors"
                    >
                      {neighbor.abbr}
                    </text>
                  </g>
                );
              })}
            </g>
          )}`;

if (code.includes(oldNeighborAreas)) {
  code = code.replace(oldNeighborAreas, newNeighborAreas);
  console.log('Updated bordering constellation areas with direct labels');
} else {
  console.warn('Could not find oldNeighborAreas');
}

// 3. Remove the separate floating neighbor badges section since labels are now directly on the clickable areas
const oldNeighborBadges = `          {/* 10. Bordering Constellation Badges directly on the Sky Map */}
          {borderingConstellationsSvg.length > 0 && opts.showNeighborGuides && (
            <g className="bordering-constellation-badges">
              {borderingConstellationsSvg.map((neighbor, nIdx) => {
                const rectW = Math.max(16, neighbor.abbr.length * 3.2 + 5);
                return (
                  <g
                    key={\`neighbor-badge-\${nIdx}\`}
                    className="cursor-pointer group/n-badge"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (neighbor.neighborObj && onSelectNeighbor) onSelectNeighbor(neighbor.neighborObj);
                    }}
                  >
                    <title>{\`Switch to \${neighbor.name} dossier\`}</title>
                    <rect
                      x={neighbor.badgePos.x - rectW / 2}
                      y={neighbor.badgePos.y - 3.2}
                      width={rectW}
                      height="6.4"
                      rx="1.6"
                      fill="#030816"
                      fillOpacity="0.92"
                      stroke="#475569"
                      strokeWidth="0.45"
                      className="group-hover/n-badge:fill-cyan-950 group-hover/n-badge:stroke-cyan-400 transition-colors shadow-md"
                    />
                    <text
                      x={neighbor.badgePos.x}
                      y={neighbor.badgePos.y + 1.1}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="2.4"
                      fontFamily="monospace"
                      fontWeight="bold"
                      className="group-hover/n-badge:fill-cyan-200 pointer-events-none select-none transition-colors"
                    >
                      {neighbor.abbr} ↗
                    </text>
                  </g>
                );
              })}
            </g>
          )}`;

if (code.includes(oldNeighborBadges)) {
  code = code.replace(oldNeighborBadges, '');
  console.log('Removed old floating neighbor badges section');
} else {
  console.warn('Could not find oldNeighborBadges');
}

// 4. Make dashed lines on the constellation dossier smaller and smoother (strokeDasharray="1.2 1.2" or "1 1")
code = code.replace(/strokeDasharray="2.5 1.5"/g, 'strokeDasharray="1.2 1.2"');
code = code.replace(/strokeDasharray="2 1.5"/g, 'strokeDasharray="1 1"');
console.log('Made dashed boundary lines smaller and smoother');

fs.writeFileSync('src/components/ConstellationGuide.tsx', code, 'utf8');
console.log('Successfully completed update for bordering labels and smaller dashed lines.');
