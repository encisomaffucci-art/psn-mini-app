import React from 'react';
import { useStore } from '../context/ApiStoreContext';
import { Check } from 'lucide-react';

const regions = [
  { id: 'TR', code: 'TR', name: 'Турция', flag: '🇹🇷', symbol: 'TL', currencyCode: 'TRY' },
  { id: 'UA', code: 'UA', name: 'Украина', flag: '🇺🇦', symbol: 'UAH', currencyCode: 'UAH' },
  { id: 'PL', code: 'PL', name: 'Польша', flag: '🇵🇱', symbol: 'PLN', currencyCode: 'PLN' },
  { id: 'IN', code: 'IN', name: 'Индия', flag: '🇮🇳', symbol: '₹', currencyCode: 'INR' },
];

export const RegionSelectionScreen: React.FC = () => {
  const { currentRegion, setRegion, confirmRegionSelection, triggerHaptic, setActiveScreen } = useStore();

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col py-8 px-4">
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Выберите регион аккаунта</h1>
          <p className="text-xs text-white/50 mt-1">Цены и каталог зависят от региона PS Store</p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => { setRegion(region.id); confirmRegionSelection(region.id); triggerHaptic('success'); }}
              className={`aspect-square rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all border ${
                currentRegion.code === region.code
                  ? 'border-[#0070d1] bg-[#0070d1]/10 ring-2 ring-[#0070d1]/30'
                  : 'border-white/10 bg-black/50 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-black/50 px-2 py-1 rounded-full border border-white/10">
                  <span className="text-xl">{region.flag}</span>
                  <span className="text-xs font-mono font-bold text-white">{region.currencyCode}</span>
                </div>
                {currentRegion.code === region.code && (
                  <span className="px-2 py-0.5 rounded-full text-white text-[10px] font-bold flex items-center gap-1 bg-[#0070d1]">
                    <Check className="w-3 h-3" />
                    <span>ВЫБРАН</span>
                  </span>
                )}
              </div>
              <div className="text-left">
                <h3 className="text-base font-bold text-white">{region.name}</h3>
                <p className="text-xs text-white/50">{region.symbol} {region.currencyCode}</p>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => { setActiveScreen('store'); triggerHaptic('light'); }}
          className="w-full px-6 py-3 rounded-full bg-white/10 text-white font-bold text-sm transition-colors hover:bg-white/20"
        >
          Продолжить без выбора
        </button>
      </div>
    </div>
  );
};