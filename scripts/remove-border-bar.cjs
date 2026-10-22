const fs = require('fs');

let code = fs.readFileSync('src/components/ConstellationGuide.tsx', 'utf8');

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
                          {inspectedConstellation.borders.borderingConstellations.length > 0 && inspectedConstellation.borders.borderingConstellations.map((neighborName) => {
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
                      )}
                    </div>
                  )}`;

if (code.includes(oldBorderBar)) {
  code = code.replace(oldBorderBar, '');
  console.log('Removed bordering constellations buttons bar from dossier');
} else {
  console.warn('Could not find oldBorderBar');
}

fs.writeFileSync('src/components/ConstellationGuide.tsx', code, 'utf8');
