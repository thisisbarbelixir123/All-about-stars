import React, { useState, useEffect, useMemo } from 'react';
import { StarData } from '../types';
import { STARS_CATALOG } from '../data/stars';
import { formatPhysicalDiameter } from '../utils/formatters';
import { StarDot2D } from './StarDot2D';
import { 
  getUserAstronomyData, 
  toggleStarBookmark, 
  createObservationList, 
  deleteObservationList,
  addStarToObservationList,
  removeStarFromObservationList,
  setStarNote,
  exportAstronomyDataJSON,
  importAstronomyDataJSON,
  subscribeAstronomyData,
  ObservationList
} from '../utils/bookmarks';
import { exportStarDossierCard } from '../utils/cardExporter';
import { soundEffects } from '../utils/soundEffects';
import { 
  X, 
  Bookmark, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Eye, 
  BookOpen, 
  Search, 
  FolderPlus, 
  Check, 
  FileDown, 
  Layers,
  Edit3
} from 'lucide-react';

interface ObservationDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFocusStar: (star: StarData) => void;
  onInspectStar: (star: StarData) => void;
}

export const ObservationDeckModal: React.FC<ObservationDeckModalProps> = ({
  isOpen,
  onClose,
  onFocusStar,
  onInspectStar,
}) => {
  const [userData, setUserData] = useState(getUserAstronomyData);
  const [activeTab, setActiveTab] = useState<'all-bookmarks' | string>('all-bookmarks');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreatingList, setIsCreatingList] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [editingNoteStarId, setEditingNoteStarId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState<string>('');

  useEffect(() => {
    const unsub = subscribeAstronomyData(() => {
      setUserData(getUserAstronomyData());
    });
    return unsub;
  }, []);

  const starMap = useMemo(() => {
    const map = new Map<string, StarData>();
    STARS_CATALOG.forEach((s) => map.set(s.id, s));
    return map;
  }, []);

  // Filtered stars based on active tab and search query
  const displayedStars = useMemo(() => {
    let targetIds: string[] = [];
    if (activeTab === 'all-bookmarks') {
      targetIds = userData.bookmarkedStarIds;
    } else {
      const targetList = userData.lists.find((l) => l.id === activeTab);
      targetIds = targetList ? targetList.starIds : [];
    }

    const stars = targetIds
      .map((id) => starMap.get(id))
      .filter((s): s is StarData => !!s);

    if (!searchQuery.trim()) return stars;

    const q = searchQuery.toLowerCase();
    return stars.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.constellation.toLowerCase().includes(q) ||
        s.spectralType.toLowerCase().includes(q)
    );
  }, [userData, activeTab, searchQuery, starMap]);

  const handleCreateNewList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const created = createObservationList(newListName.trim());
    setNewListName('');
    setIsCreatingList(false);
    setActiveTab(created.id);
    soundEffects.play('select');
  };

  const handleDeleteList = (listId: string) => {
    deleteObservationList(listId);
    setActiveTab('all-bookmarks');
    soundEffects.play('toggleOff');
  };

  const handleRemoveFromCurrent = (starId: string) => {
    if (activeTab === 'all-bookmarks') {
      toggleStarBookmark(starId);
    } else {
      removeStarFromObservationList(activeTab, starId);
    }
    soundEffects.play('toggleOff');
  };

  const handleExportJSON = () => {
    const jsonStr = exportAstronomyDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Starpedia_Observation_Targets_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    soundEffects.play('select');
    setExportNotice('Exported observation targets JSON!');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handleImportJSONPrompt = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const success = importAstronomyDataJSON(content);
          if (success) {
            soundEffects.play('select');
            setExportNotice('Successfully imported targets!');
            setTimeout(() => setExportNotice(null), 3000);
          } else {
            alert('Invalid JSON observation file format.');
          }
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExportCard = async (star: StarData) => {
    try {
      setExportNotice(`Exporting 1200x675 card for ${star.name}...`);
      await exportStarDossierCard(star);
      setExportNotice(`Dossier card downloaded for ${star.name}!`);
      setTimeout(() => setExportNotice(null), 3000);
    } catch (e) {
      console.warn(e);
      setExportNotice('Card export failed.');
      setTimeout(() => setExportNotice(null), 3000);
    }
  };

  const handleSaveNote = (starId: string) => {
    setStarNote(starId, tempNoteText);
    setEditingNoteStarId(null);
    setTempNoteText('');
    soundEffects.play('click');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-[#060a1a]/95 border border-cyan-500/35 shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden font-sans text-slate-100 backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-cyan-500/20 bg-[#081026]/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-400">
              <Bookmark className="w-5 h-5 fill-cyan-400/20" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <span>Observation Deck & Bookmarks</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {userData.bookmarkedStarIds.length} Saved Stars
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Curate custom observing target lists, log astrophysical notes & export high-res visual cards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#04091c] hover:bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 transition-colors cursor-pointer"
              title="Export watchlists as JSON file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handleImportJSONPrompt}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#04091c] hover:bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
              title="Import watchlists from JSON file"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>

            <button
              id="btn-close-observation-deck"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#030612]/80 hover:bg-[#0c1630] text-slate-400 hover:text-cyan-300 transition-colors border border-cyan-500/25 cursor-pointer shadow-sm"
              title="Close observation deck"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice Ribbon */}
        {exportNotice && (
          <div className="px-4 py-2 bg-cyan-950/80 border-b border-cyan-400 text-cyan-200 text-xs font-mono flex items-center justify-between animate-in fade-in">
            <span>{exportNotice}</span>
            <span className="text-[10px] text-cyan-400">STARPEDIA 3D</span>
          </div>
        )}

        {/* Main Workspace: Left Lists Sidebar + Right Target Cards Grid */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Lists Rail */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-cyan-500/20 bg-[#040816]/90 p-3 flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between px-2 pt-1 pb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Watchlists
              </span>
              <button
                onClick={() => setIsCreatingList(true)}
                className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>New List</span>
              </button>
            </div>

            {/* List creation input */}
            {isCreatingList && (
              <form onSubmit={handleCreateNewList} className="space-y-2 p-2 rounded-lg bg-[#081026] border border-cyan-500/30">
                <input
                  type="text"
                  placeholder="List name..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  autoFocus
                  className="w-full px-2 py-1 bg-[#020510] border border-cyan-500/30 rounded text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsCreatingList(false)}
                    className="px-2 py-0.5 rounded text-[10px] text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold text-[10px]"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            {/* Default All Bookmarks tab */}
            <div className="flex flex-col gap-1 overflow-y-auto max-h-48 md:max-h-none scrollbar-thin">
              <button
                onClick={() => {
                  setActiveTab('all-bookmarks');
                  soundEffects.play('click');
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer text-left ${
                  activeTab === 'all-bookmarks'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Bookmark className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">All Bookmarks</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 font-bold">
                  {userData.bookmarkedStarIds.length}
                </span>
              </button>

              {/* Custom Lists */}
              {userData.lists.map((list) => {
                const isActive = activeTab === list.id;
                return (
                  <div
                    key={list.id}
                    className={`group flex items-center justify-between p-2 rounded-xl text-xs font-mono transition-colors cursor-pointer border ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 font-bold'
                        : 'text-slate-300 hover:bg-white/5 border-transparent'
                    }`}
                    onClick={() => {
                      setActiveTab(list.id);
                      soundEffects.play('click');
                    }}
                  >
                    <div className="min-w-0 flex-1 truncate">
                      <div className="truncate">{list.name}</div>
                      <div className="text-[9px] text-slate-400 truncate">{list.starIds.length} targets</div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteList(list.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity cursor-pointer ml-1"
                      title="Delete list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Main Content Rail */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Bar & List Info */}
            <div className="p-3 sm:p-4 bg-[#050b1e] border-b border-cyan-500/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter targets by name, constellation, spectral..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#020510] border border-cyan-500/25 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="text-xs font-mono text-slate-400 text-right">
                Showing <strong className="text-white">{displayedStars.length}</strong> targets
              </div>
            </div>

            {/* Stars List Grid */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 scrollbar-thin">
              {displayedStars.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[#030614]/60 border border-cyan-500/20 max-w-md mx-auto my-12 space-y-3">
                  <Bookmark className="w-10 h-10 text-cyan-400/40 mx-auto" />
                  <h4 className="text-base font-bold text-white">No Targets in This List</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Browse the stellar catalog or 3D observatory and click the Bookmark icon on any star card or dossier to save it to your observation deck.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {displayedStars.map((star) => {
                    const diameterObj = formatPhysicalDiameter(star.diameterKm, star.diameterSolar);
                    const note = userData.notes[star.id] || '';
                    const isEditingNote = editingNoteStarId === star.id;

                    return (
                      <div
                        key={star.id}
                        className="p-3.5 rounded-xl bg-[#040818]/90 border border-cyan-500/25 hover:border-cyan-400/70 transition-all duration-200 flex flex-col justify-between gap-2.5 backdrop-blur-xl group"
                      >
                        {/* Top: Star Avatar & Names */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <StarDot2D star={star} sizeClassName="w-6 h-6" />
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                                {star.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-mono truncate">
                                {star.constellation} • {star.spectralType}
                              </p>
                            </div>
                          </div>

                          <span 
                            className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border shrink-0"
                            style={{
                              borderColor: `${star.colorHex}66`,
                              backgroundColor: `${star.colorHex}22`,
                              color: '#f8fafc',
                            }}
                          >
                            {star.stellarStage === 'Main Sequence Dwarf' ? 'Main Sequence' : star.stellarStage}
                          </span>
                        </div>

                        {/* Metrics Row */}
                        <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[9px] pt-1 border-t border-cyan-500/15">
                          <div className="p-1 rounded bg-[#020510] border border-cyan-500/15">
                            <span className="text-slate-400 block font-sans">Diameter</span>
                            <span className="text-cyan-300 font-bold block truncate">{diameterObj.metricSi}</span>
                          </div>
                          <div className="p-1 rounded bg-[#020510] border border-cyan-500/15">
                            <span className="text-slate-400 block font-sans">Mass</span>
                            <span className="text-blue-300 font-bold block">{star.massSolar.toFixed(1)} M☉</span>
                          </div>
                          <div className="p-1 rounded bg-[#020510] border border-cyan-500/15">
                            <span className="text-slate-400 block font-sans">Distance</span>
                            <span className="text-amber-300 font-bold block truncate">
                              {star.distanceLy < 0.001 ? '0.0 ly' : `${star.distanceLy.toLocaleString()} ly`}
                            </span>
                          </div>
                        </div>

                        {/* Personal Observation Note Area */}
                        <div className="pt-1 border-t border-cyan-500/10">
                          {isEditingNote ? (
                            <div className="space-y-1.5">
                              <input
                                type="text"
                                placeholder="Add observing notes, equipment used, sky conditions..."
                                value={tempNoteText}
                                onChange={(e) => setTempNoteText(e.target.value)}
                                autoFocus
                                className="w-full px-2 py-1 bg-[#020510] border border-cyan-500/40 rounded text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
                              />
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingNoteStarId(null)}
                                  className="px-2 py-0.5 text-[9px] text-slate-400 hover:text-white"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveNote(star.id)}
                                  className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold text-[9px]"
                                >
                                  Save Note
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div 
                              onClick={() => {
                                setEditingNoteStarId(star.id);
                                setTempNoteText(note);
                              }}
                              className="flex items-center justify-between text-[10px] text-slate-400 hover:text-cyan-300 cursor-pointer p-1 rounded hover:bg-white/5 transition-colors"
                              title="Click to edit personal observation note"
                            >
                              <span className="italic truncate flex-1 font-sans">
                                {note ? `Note: "${note}"` : '+ Add observation note...'}
                              </span>
                              <Edit3 className="w-3 h-3 shrink-0 ml-1 opacity-60" />
                            </div>
                          )}
                        </div>

                        {/* Action Buttons Strip */}
                        <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                onFocusStar(star);
                                onClose();
                                soundEffects.play('select');
                              }}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-[10px] font-mono font-bold transition-all cursor-pointer"
                              title="Focus star in 3D universe"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Focus 3D</span>
                            </button>

                            <button
                              onClick={() => {
                                onInspectStar(star);
                                soundEffects.play('openModal');
                              }}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 hover:text-white text-[10px] font-mono font-bold transition-all cursor-pointer"
                              title="Open full astronomical dossier"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>Dossier</span>
                            </button>

                            <button
                              onClick={() => handleExportCard(star)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 hover:text-white text-[10px] font-mono font-bold transition-all cursor-pointer"
                              title="Download 1200x675 Infographic Card PNG"
                            >
                              <FileDown className="w-3 h-3" />
                              <span>Export Card</span>
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveFromCurrent(star.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                            title="Remove from this observation list"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
