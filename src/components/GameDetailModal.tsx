import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/ApiStoreContext';
import { Game } from '../services/api';
import { X, ChevronLeft, ChevronRight, Star, Globe, ShoppingBag, Check, ArrowRight, Plus, Minus } from 'lucide-react';

export const GameDetailModal: React.FC = () => {
  const {
    selectedGame,
    closeGameModal,
    currentRegion,
    cart,
    addToCart,
    triggerFlyAnimation,
    setActiveTab,
    triggerHaptic,
  } = useStore();
  
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const isGameInCart = selectedGame ? (justAdded || cart.some(item => item.game.id === selectedGame.id)) : false;

  const mediaSlides: string[] = React.useMemo(() => {
    if (!selectedGame) return [];
    const slides: string[] = [];
    if (selectedGame.heroUrl) slides.push(selectedGame.heroUrl);
    if (selectedGame.coverUrl) slides.push(selectedGame.coverUrl);
    if (slides.length === 0) {
      slides.push('https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80');
    }
    return slides;
  }, [selectedGame]);

  useEffect(() => {
    setActiveMediaIndex(0);
    setJustAdded(false);
  }, [selectedGame?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedGame) return;
      if (e.key === 'Escape') closeGameModal();
      else if (e.key === 'ArrowLeft') setActiveMediaIndex(prev => (prev === 0 ? mediaSlides.length - 1 : prev - 1));
      else if (e.key === 'ArrowRight') setActiveMediaIndex(prev => (prev === mediaSlides.length - 1 ? 0 : prev + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGame, mediaSlides.length, closeGameModal]);

  if (!selectedGame) return null;

  const edition = selectedGame.editions[0];
  const price = edition?.prices[currentRegion.code] || 0;

  const handleNextSlide = () => setActiveMediaIndex(prev => (prev === mediaSlides.length - 1 ? 0 : prev + 1));
  const handlePrevSlide = () => setActiveMediaIndex(prev => (prev === 0 ? mediaSlides.length - 1 : prev - 1));

  const handleTouchStart = (e: React.TouchEvent) => { touchStartXRef.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (diff > 45) handleNextSlide();
    else if (diff < -45) handlePrevSlide();
    touchStartXRef.current = null;
  };

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) {
      triggerFlyAnimation(e, { image: mediaSlides[0], label: selectedGame.title, icon: 'game' });
      triggerHaptic('medium');
    }
    addToCart(selectedGame, edition?.name || 'Standard');
    setJustAdded(true);
  };

  return (
    <div onClick={closeGameModal} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div onClick={e => e.stopPropagation()} className="relative w-full max-w-xl bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col">
        <button onClick={closeGameModal} className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors" aria-label="Закрыть"><X className="w-5 h-5" /></button>

        <div className="relative bg-black select-none">
          <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className="relative w-full aspect-video bg-gray-900 overflow-hidden">
            <img src={mediaSlides[activeMediaIndex]} alt={`${selectedGame.title} - кадр ${activeMediaIndex + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />
            {mediaSlides.length > 1 && (
              <>
                <button onClick={handlePrevSlide} className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center" aria-label="Предыдущий"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={handleNextSlide} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center" aria-label="Следующий"><ChevronRight className="w-5 h-5" /></button>
              </>
            )}
            <div className="absolute bottom-2.5 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded-full border border-white/10">{activeMediaIndex + 1} / {mediaSlides.length}</div>
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              {selectedGame.platforms.map((p) => <span key={p} className="px-2 py-0.5 text-[10px] font-bold uppercase bg-black/75 text-white rounded border border-white/15">{p}</span>)}
              {selectedGame.discount > 0 && <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-black rounded">-{selectedGame.discount}%</span>}
            </div>
          </div>
          {mediaSlides.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-black/80 border-b border-white/10 overflow-x-auto">
              {mediaSlides.map((thumbUrl, idx) => (
                <button key={idx} onClick={() => setActiveMediaIndex(idx)} className={`h-9 w-14 rounded-md overflow-hidden border-2 transition-all shrink-0 ${activeMediaIndex === idx ? 'border-[#0070d1] scale-105 opacity-100' : 'border-transparent opacity-50 hover:opacity-90'}`}>
                  <img src={thumbUrl} alt={`Миниатюра ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 space-y-3.5 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{selectedGame.title}</h2>
              <p className="text-xs text-white/60 mt-1">{selectedGame.publisher} · {selectedGame.platforms.join(', ')}</p>
            </div>
            <button onClick={handleToggleFavorite} className="p-2 rounded-xl bg-black/50 hover:bg-black/70 text-white/60 hover:text-amber-300 transition-colors" title="В избранное"><Star className="w-4 h-4" /></button>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-white/10 bg-white/5">{selectedGame.ruLocalization === 'full' ? '🇷🇺 Полностью на русском' : selectedGame.ruLocalization === 'subtitles' ? '🇷🇺 Русские субтитры' : '🇬🇧 Английский'}</span>
          </div>

          <p className="text-xs text-white/70 leading-relaxed">{selectedGame.ruLocalization}</p>
        </div>

        <div className="p-4 sm:p-5 bg-black/50 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div>
            <div className="text-[10px] text-white/50 uppercase">Итоговая цена:</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#0070d1]">{price.toLocaleString('ru-RU')} {currentRegion.symbol}</span>
              <span className="text-sm font-bold text-white/70">≈ {edition?.name}</span>
            </div>
          </div>

          {isGameInCart ? (
            <button onClick={() => { closeGameModal(); setActiveTab('cart'); }} className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"><Check className="w-4 h-4" /><span>В корзину</span><ArrowRight className="w-4 h-4" /></button>
          ) : (
            <button onClick={handleAddToCart} className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 bg-[#0070d1] hover:bg-[#005fb3] text-white"><ShoppingBag className="w-4 h-4" /><span>В корзину</span></button>
          )}
        </div>
      </div>
    </div>
  );
};