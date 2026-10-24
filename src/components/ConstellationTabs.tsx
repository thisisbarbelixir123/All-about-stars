import React from 'react';
import { BookOpen, Globe, Sparkles, HelpCircle } from 'lucide-react';

export type ConstellationGuideTab = 'what-are' | 'all-88' | 'zodiac-13' | 'mythbuster';

interface ConstellationTabsProps {
  activeTab: ConstellationGuideTab;
  setActiveTab: (tab: ConstellationGuideTab) => void;
}

export const ConstellationTabs: React.FC<ConstellationTabsProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-[#020512] rounded-xl sm:rounded-2xl border border-cyan-500/25 max-w-full overflow-x-auto no-scrollbar shrink-0">
      <button
        id="tab-what-are-constellations"
        onClick={() => setActiveTab('what-are')}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
          activeTab === 'what-are'
            ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span>What Are Constellations?</span>
      </button>

      <button
        id="tab-all-88-constellations"
        onClick={() => setActiveTab('all-88')}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
          activeTab === 'all-88'
            ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Globe className="w-3.5 h-3.5" />
        <span>All 88 Constellations</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-cyan-950 text-cyan-300">
          88
        </span>
      </button>

      <button
        id="tab-zodiac-13"
        onClick={() => setActiveTab('zodiac-13')}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
          activeTab === 'zodiac-13'
            ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>13 Zodiac Signs</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-amber-950 text-amber-300 font-bold">
          13
        </span>
      </button>

      <button
        id="tab-mythbuster"
        onClick={() => setActiveTab('mythbuster')}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
          activeTab === 'mythbuster'
            ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
        <span>Personality Mythbuster</span>
      </button>
    </div>
  );
};
