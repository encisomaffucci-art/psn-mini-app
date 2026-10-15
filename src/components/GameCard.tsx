import React, { useState } from 'react';
import { Game } from '../services/api';
import { useStore } from '../context/ApiStoreContext';
import { Star, Plus, Check } from 'lucide-react';

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const {
    openGameModal,
    cart,
    triggerFlyAnimation,
    triggerHaptic,
  } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  const isGameInCart = justAdded || cart.some(item => item.game.id === game.id);
  const edition = game.editions[0];
  const price = edition?.prices[game.id] || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('medium');
    triggerFlyAnimation(e, {
      image: game.coverUrl,
      label: game.title,
      icon: 'game'
    });
    // Open game modal instead of auto-adding
    openGameModal(game);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
  };

  return (
    <div
      onClick={() => openGameModal(game)}
      className={`aspect-square w-full group relative overflow-hidden rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between transition-all duration-150 cursor-pointer border shadow-sm hover:shadow-xl hover:-translate-y-0.5 ${
        isGameInCart
          ? 'bg-[#141c2c] border-[#0070d1] ring-1 ring-[#0070d1]/50'
          : 'bg-[#121722] hover:bg-[#161e2e] border-[#1e2638] hover:border-slate-500'
      }`}
    >
      {game.coverUrl && (
        <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
          <img
            src={game.coverUrl}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090e]/95 via-[#07090e]/50 to-[#07090e]/70" />
        </div>
      )}

      <div className="relative z-10 flex items-start justify-between gap-1">
        <div className="flex items-center gap-1 flex-wrap">
          {game.platforms.slice(0, 2).map((p) => (
            <span
              key={p}
              className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-black/75 text-white rounded border border-white/10"
            >
              {p}
            </span>
          ))}
          {game.discount > 0 && (
            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500 text-black rounded">
              -{game.discount}%
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`p-1 rounded-md backdrop-blur-sm transition-all cursor-pointer active:scale-90 ${
              'bg-black/60 text-slate-300 hover:text-amber-300 hover:bg-black/80'
            }`}
            title="Добавить в избранное"
          >
            <Star className="w-3 h-3 text-slate-300 hover:text-amber-300" />
          </button>
        </div>
      </div>

      <div className="relative z-10 space-y-1 pt-1">
        <h3 className="text-xs sm:text-[13px] font-bold text-white line-clamp-1 group-hover:text-sky-300 transition-colors drop-shadow-sm">
          {game.title}
        </h3>

        <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
          <div className="min-w-0 flex-1">
            <div className="font-mono text-xs sm:text-sm font-black text-white drop-shadow-sm truncate">
              {price.toLocaleString('ru-RU')} <span className="text-[10px] font-bold text-[#0070d1]">{game.symbol || 'TL'}</span>
            </div>
          </div>

          {isGameInCart ? (
            <div className="h-5 sm:h-6 px-1.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-0.5 shadow-sm shrink-0">
              <Check className="w-3 h-3 stroke-[3]" />
              <span className="hidden sm:inline">В корзине</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="h-5 sm:h-6 px-1.5 sm:px-2 rounded-md bg-[#0070d1] hover:bg-[#007ceb] text-white text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer active:scale-90 shadow-sm shrink-0"
              title="Купить"
            >
              <Plus className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Купить</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};