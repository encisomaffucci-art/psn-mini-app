import React from 'react';
import { useStore } from '../context/ApiStoreContext';

export const HeroBanner: React.FC = () => {
  const { games, currentRegion, setRegion } = useStore();
  const heroGame = games[0];

  if (!heroGame) return null;

  const edition = heroGame.editions[0];
  const price = edition?.prices[currentRegion.code] || 0;

  return (
    <div onClick={() => {}} className="relative h-80 w-full cursor-pointer overflow-hidden">
      <img src={heroGame.heroUrl || heroGame.coverUrl} className="w-full h-full object-cover" alt={heroGame.title} />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-5">
        <div className="flex items-center gap-1.5 mb-1.5">
          {heroGame.platforms.map(p => (
            <span key={p} className="bg-white text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm">{p}</span>
          ))}
          <span className="bg-[#0070D1] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">ХИТ ПРОДАЖ</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight leading-tight">{heroGame.title}</h1>
        <div className="flex items-center justify-between mt-3">
          <div>
            <div className="text-xs text-white/60">{price.toLocaleString('ru-RU')} {currentRegion.symbol}</div>
            <div className="text-base font-extrabold text-white">{edition?.name}</div>
          </div>
          <span className="bg-[#0070D1] text-white text-xs font-bold px-4 py-2.5 rounded-full">Подробнее</span>
        </div>
      </div>
    </div>
  );
};