import React from 'react';

interface MapToolbarToggleProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  title: string;
  activeColorClass?: string;
}

export const MapToolbarToggle: React.FC<MapToolbarToggleProps> = ({
  label,
  icon,
  active,
  onClick,
  title,
  activeColorClass = 'bg-sky-500 text-slate-950 font-bold border-sky-400'
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-1.5 py-1 sm:px-2 sm:py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
        active
          ? `${activeColorClass} border shadow-xs`
          : 'bg-white/[0.04] text-slate-400 border border-white/10 hover:text-white hover:bg-white/[0.08]'
      }`}
      title={title}
    >
      <span className="w-3 h-3 shrink-0 flex items-center justify-center">{icon}</span>
      <span className="hidden xs:inline sm:inline">{label}</span>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-slate-950' : 'bg-slate-600'} xs:hidden`} />
    </button>
  );
};
