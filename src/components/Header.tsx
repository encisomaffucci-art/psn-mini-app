import React from 'react';
import { useStore } from '../context/ApiStoreContext';
import { Shield, ChevronDown, Receipt } from 'lucide-react';
import { PSNLogo } from './PSNLogo';

export const Header: React.FC = () => {
  const {
    currentRegion,
    regions,
    setRegion,
    setActiveTab,
    triggerHaptic,
  } = useStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setActiveTab('latest');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center text-left font-bold tracking-tight text-white whitespace-nowrap shrink-0 group focus:outline-none cursor-pointer transition-transform active:scale-95"
            title="PSN.BY"
          >
            <PSNLogo size={28} className="hover:opacity-90 transition-opacity" />
            <span className="ml-2 text-base font-bold tracking-tight">PSN.BY</span>
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => triggerHaptic('light')}
            className="relative p-2 bg-white/10 hover:bg-white/15 rounded-full text-xs font-semibold px-2.5 py-1.5 flex items-center gap-1.5 transition"
            title="Выбрать регион"
          >
            <span>{currentRegion.flag}</span>
            <span>{currentRegion.code}</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/50" />
          </button>

          <button
            onClick={() => triggerHaptic('light')}
            className="p-2 bg-white/10 hover:bg-white/15 rounded-full text-white/50 hover:text-white"
            title="Корзина"
          >
            <Receipt className="w-5 h-5" />
          </button>

          <button
            onClick={() => triggerHaptic('light')}
            className="p-2 bg-white/10 hover:bg-white/15 rounded-full text-white/50 hover:text-white"
            title="Админ-панель"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};