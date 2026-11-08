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
    <div className="flex items-center gap-1 sm:gap-1.5 p-1 observatory-panel rounded-xl max-w-full overflow-x-auto no-scrollbar shrink-0">
      <button
        id="tab-what-are-constellations"
        onClick={() => setActiveTab('what-are')}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
          activeTab === 'what-are'
            ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span>What Are Constellations?</span>
      </button>

      <button
        id="tab-all-88-constellations"
        onClick={() => setActiveTab('all-88')}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
          activeTab === 'all-88'
            ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Globe className="w-3.5 h-3.5" />
        <span>All 88 Constellations</span>
        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
          activeTab === 'all-88' ? 'bg-slate-950/25 text-slate-950 font-bold' : 'bg-white/[0.06] text-sky-300'
        }`}>
          88
        </span>
      </button>

      <button
        id="tab-zodiac-13"
        onClick={() => setActiveTab('zodiac-13')}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
          activeTab === 'zodiac-13'
            ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'zodiac-13' ? 'text-slate-950' : 'text-amber-400'}`} />
        <span>13 Zodiac Signs</span>
        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
          activeTab === 'zodiac-13' ? 'bg-slate-950/25 text-slate-950 font-bold' : 'bg-amber-950 text-amber-300 font-bold'
        }`}>
          13
        </span>
      </button>

      <button
        id="tab-mythbuster"
        onClick={() => setActiveTab('mythbuster')}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
          activeTab === 'mythbuster'
            ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <HelpCircle className={`w-3.5 h-3.5 ${activeTab === 'mythbuster' ? 'text-slate-950' : 'text-rose-400'}`} />
        <span>Personality Mythbuster</span>
      </button>
    </div>
  );
};
