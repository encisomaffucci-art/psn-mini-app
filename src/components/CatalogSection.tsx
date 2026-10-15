import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { CatalogCategory, PlusTier, SubscriptionDuration } from '../types';
import { GameCard } from './GameCard';
import { SubscriptionDetailModal } from './SubscriptionDetailModal';
import {
  Search,
  X,
  Plus,
  Minus,
  Sparkles,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Star
} from 'lucide-react';

export const CatalogSection: React.FC = () => {
  const {
    games,
    giftCards,
    subscriptions,
    cart,
    addToCart,
    updateQuantity,
    triggerFlyAnimation,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    selectedPlatform,
    setSelectedPlatform,
    currentRegion,
    customRegionTopupImages,
    favorites
  } = useStore();

  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc'>('popular');
  const [selectedSubDuration, setSelectedSubDuration] = useState<SubscriptionDuration>('12m');
  const [selectedSubForDetail, setSelectedSubForDetail] = useState<PlusTier>('extra');
  const [isSubDetailOpen, setIsSubDetailOpen] = useState(false);

  const giftCardsScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollGiftCards = (direction: 'left' | 'right') => {
    if (giftCardsScrollRef.current) {
      const scrollAmount = giftCardsScrollRef.current.clientWidth * 0.75;
      giftCardsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const cardsForRegion = giftCards.filter(c => c.regionId === currentRegion.id);

  const subTiers: { tier: PlusTier; title: string; subtitle: string; popular?: boolean }[] = [
    {
      tier: 'essential',
      title: 'PS Plus Essential',
      subtitle: 'Сетевой мультиплеер, игры месяца и эксклюзивные скидки',
      popular: false
    },
    {
      tier: 'extra',
      title: 'PS Plus Extra',
      subtitle: 'Каталог 400+ игр для PS4/PS5 и библиотека Ubisoft+ Classics',
      popular: true
    },
    {
      tier: 'deluxe',
      title: currentRegion.id === 'poland' ? 'PS Plus Premium' : 'PS Plus Deluxe',
      subtitle: 'Ретро-классика (PS1, PS2, PSP) и пробные версии новинок',
      popular: false
    }
  ];

  const categories: { id: CatalogCategory; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'Все игры' },
    { id: 'favorites', label: `Избранное (${favorites.length})` },
    { id: 'bestsellers', label: 'Бестселлеры' },
    { id: 'new', label: 'Новинки' },
    { id: 'preorder', label: 'Предзаказы' },
    { id: 'deals', label: 'Скидки и акции' }
  ];

  // Filtering & Sorting
  let filteredGames = games.filter(game => {
    if (activeCategory === 'favorites') {
      if (!favorites.includes(game.id)) return false;
    } else if (activeCategory !== 'all' && game.category !== activeCategory) {
      return false;
    }
    if (selectedPlatform !== 'ALL' && !game.platforms.includes(selectedPlatform)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = game.title.toLowerCase().includes(q);
      const matchPub = game.publisher.toLowerCase().includes(q);
      const matchGenre = game.genres.some(g => g.toLowerCase().includes(q));
      if (!matchTitle && !matchPub && !matchGenre) return false;
    }
    return true;
  });

  if (sortBy === 'price_asc') {
    filteredGames = [...filteredGames].sort((a, b) => {
      const pa = a.regionalStorePrices[currentRegion.id] || 0;
      const pb = b.regionalStorePrices[currentRegion.id] || 0;
      return pa - pb;
    });
  } else if (sortBy === 'price_desc') {
    filteredGames = [...filteredGames].sort((a, b) => {
      const pa = a.regionalStorePrices[currentRegion.id] || 0;
      const pb = b.regionalStorePrices[currentRegion.id] || 0;
      return pb - pa;
    });
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* =========================================================================
          1. КАРТЫ ПОПОЛНЕНИЯ БАЛАНСА (ВМЕСТО БЫСТРОГО ПОПОЛНЕНИЯ)
      ========================================================================== */}
      {cardsForRegion.length > 0 && (
        <section id="gift-cards-section" className="rounded-2xl bg-[#0f141f]/70 border border-[#1e2638] p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0070d1]/15 border border-[#0070d1]/30 flex items-center justify-center text-[#0070d1] shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Карты пополнения</span>
                  <span className="text-base">{currentRegion.flag}</span>
                  <span className="text-xs text-slate-400 font-normal">
                    ({currentRegion.currencyCode})
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400">
                  Моментальная доставка кодов для пополнения кошелька PS Store
                </p>
              </div>
            </div>

            {/* Стрелки прокрутки горизонтальной карусели */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleScrollGiftCards('left')}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#121722] hover:bg-[#1a2130] border border-[#1e2638] hover:border-slate-500 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
                title="Прокрутить назад"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScrollGiftCards('right')}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#121722] hover:bg-[#1a2130] border border-[#1e2638] hover:border-slate-500 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
                title="Прокрутить вперед"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Горизонтальная карусель номиналов карт пополнения */}
          <div
            ref={giftCardsScrollRef}
            className="flex items-stretch gap-2.5 overflow-x-auto pb-2 pt-0.5 scroll-smooth"
            style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
          >
            {cardsForRegion.map((card) => {
              const cartItem = cart.find(
                item =>
                  item.type === 'gift_card' &&
                  item.regionId === currentRegion.id &&
                  item.denomination === card.localAmount
              );
              const quantityInCart = cartItem ? cartItem.quantity : 0;
              const bgImage = customRegionTopupImages?.[currentRegion.id] || card.imageUrl;

              return (
                <div
                  key={card.id}
                  style={{ scrollSnapAlign: 'start' }}
                  className={`group relative overflow-hidden rounded-xl sm:rounded-2xl aspect-square w-28 sm:w-32 md:w-36 shrink-0 p-2 sm:p-2.5 flex flex-col justify-between transition-all duration-150 border ${
                    quantityInCart > 0
                      ? 'bg-[#141c2c] border-[#0070d1] ring-1 ring-[#0070d1]/40 shadow-sm'
                      : 'bg-[#121722] hover:bg-[#161e2e] border-[#1e2638] hover:border-slate-500'
                  }`}
                >
                  {/* Background Image for Region (1 image per region for all tiles) */}
                  {bgImage && (
                    <div className="absolute inset-0 pointer-events-none select-none z-0">
                      <img
                        src={bgImage}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07090e]/95 via-[#07090e]/75 to-[#07090e]/50" />
                    </div>
                  )}

                  {/* Верх: Номинал + индикатор в корзине */}
                  <div className="flex items-start justify-between gap-1 mb-1 relative z-10">
                    <div className="text-xs sm:text-sm font-black font-mono text-white tracking-tight drop-shadow-sm">
                      {card.localAmount.toLocaleString()} {currentRegion.currencySymbol}
                    </div>
                    {quantityInCart > 0 && (
                      <span className="px-1 py-0.5 rounded-md bg-[#0070d1] text-[9px] font-black text-white font-mono shrink-0 shadow-sm">
                        {quantityInCart}
                      </span>
                    )}
                  </div>

                  {/* Низ: Цена в BYN + Кнопка */}
                  <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-white/10 relative z-10">
                    <div className="font-mono text-[10px] sm:text-[11px] font-semibold text-slate-200 drop-shadow-sm truncate">
                      {card.priceByn.toFixed(2)} BYN
                    </div>

                    {quantityInCart > 0 && cartItem ? (
                      <div className="flex items-center bg-[#0b0e14] border border-white/10 rounded-md p-0.5 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(cartItem.id, -1);
                          }}
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
                          title="Уменьшить"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="font-mono text-[9px] sm:text-[10px] font-bold text-white px-0.5 min-w-[0.8rem] text-center">
                          {quantityInCart}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerFlyAnimation(e, {
                              label: `${card.localAmount} ${currentRegion.currencySymbol}`,
                              icon: 'card'
                            });
                            updateQuantity(cartItem.id, 1);
                          }}
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-[#0070d1] hover:bg-[#007ceb] text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
                          title="Увеличить"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          triggerFlyAnimation(e, {
                            label: `${card.localAmount} ${currentRegion.currencySymbol}`,
                            icon: 'card'
                          });
                          addToCart({
                            type: 'gift_card',
                            title: `Карта пополнения ${card.localAmount} ${currentRegion.currencySymbol} (${currentRegion.name})`,
                            regionId: currentRegion.id,
                            denomination: card.localAmount,
                            currencySymbol: currentRegion.currencySymbol,
                            priceByn: card.priceByn,
                            quantity: 1
                          });
                        }}
                        className="h-5 sm:h-6 px-1.5 rounded-md bg-[#1a2336] hover:bg-[#0070d1] text-slate-200 hover:text-white text-[10px] font-semibold flex items-center gap-0.5 transition-all cursor-pointer active:scale-95 shrink-0"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span className="hidden sm:inline">Купить</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          2. БЛОК С ПРЕДЛОЖЕНИЯМИ PLAYSTATION PLUS
          (Горизонтальный слайдер месяцев + 3 карточки товара, подробности при нажатии)
      ========================================================================== */}
      <section id="ps-plus-section" className="rounded-2xl bg-[#0f141f]/70 border border-[#1e2638] p-4 sm:p-5 space-y-4">
        {/* Header with Title and Month Duration Slider */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Подписки PlayStation Plus</span>
                <span className="text-base">{currentRegion.flag}</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Сетевой мультиплеер, каталог 400+ игр и ежемесячные игры
              </p>
            </div>
          </div>

          {/* Горизонтальный слайдер/переключатель выбора месяцев (1 3 12) */}
          <div className="flex items-center gap-1 p-1 bg-[#0b0e14] border border-[#1e2638] rounded-xl shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setSelectedSubDuration('1m')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedSubDuration === '1m'
                  ? 'bg-[#0070d1] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1 месяц
            </button>
            <button
              onClick={() => setSelectedSubDuration('3m')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedSubDuration === '3m'
                  ? 'bg-[#0070d1] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3 месяца
            </button>
            <button
              onClick={() => setSelectedSubDuration('12m')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedSubDuration === '12m'
                  ? 'bg-[#0070d1] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>12 месяцев</span>
              <span className={`text-[10px] font-mono px-1 rounded ${
                selectedSubDuration === '12m' ? 'bg-amber-400 text-black font-bold' : 'text-amber-400 bg-amber-400/10'
              }`}>-35%</span>
            </button>
          </div>
        </div>

        {/* 3 варианта подписки: квадратные плиточки с равными сторонами */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-3xl">
          {subTiers.map(({ tier, title, subtitle, popular }) => {
            const plan = subscriptions.find(
              s => s.regionId === currentRegion.id && s.tier === tier && s.duration === selectedSubDuration
            ) || subscriptions.find(
              s => s.regionId === currentRegion.id && s.tier === tier
            );

            const priceByn = plan ? plan.priceByn : (tier === 'essential' ? 135 : tier === 'extra' ? 225 : 259);

            const bgGradients = {
              essential: 'from-[#00439c]/40 via-[#0e1626]/90 to-[#07090e]',
              extra: 'from-[#d97706]/35 via-[#141b2b]/90 to-[#07090e]',
              deluxe: 'from-[#7c3aed]/35 via-[#141b2b]/90 to-[#07090e]'
            };

            const tierShortName = tier === 'essential' ? 'Essential' : tier === 'extra' ? 'Extra' : (currentRegion.id === 'poland' ? 'Premium' : 'Deluxe');

            return (
              <div
                key={tier}
                onClick={() => {
                  setSelectedSubForDetail(tier);
                  setIsSubDetailOpen(true);
                }}
                className={`group aspect-square w-full rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between transition-all duration-150 cursor-pointer relative overflow-hidden border shadow-sm hover:shadow-xl hover:-translate-y-0.5 ${
                  popular
                    ? 'border-[#0070d1] ring-1 ring-[#0070d1]/40'
                    : 'border-[#1e2638] hover:border-slate-500'
                }`}
              >
                {/* Background Gradient & Ambient Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${bgGradients[tier]} pointer-events-none select-none z-0`} />

                {/* Top Row: Tier Name & Duration / Popular Badge */}
                <div className="relative z-10 flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <div className="text-[11px] sm:text-xs font-black text-white tracking-tight group-hover:text-sky-300 transition-colors truncate">
                      {tierShortName}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
                      {selectedSubDuration === '12m' ? '12 мес' : selectedSubDuration === '3m' ? '3 мес' : '1 мес'}
                    </div>
                  </div>

                  {popular ? (
                    <span className="px-1.5 py-0.5 rounded-md bg-[#0070d1] text-white font-bold text-[8px] sm:text-[9px] uppercase tracking-wider shrink-0 shadow-sm flex items-center gap-0.5">
                      <Sparkles className="w-2 h-2" />
                      <span>Хит</span>
                    </span>
                  ) : (
                    <span className="text-[9px] text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                      Инфо
                    </span>
                  )}
                </div>

                {/* Bottom Row: Price & Buy Button */}
                <div className="relative z-10 pt-1 border-t border-white/10 flex items-center justify-between gap-1">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-black font-mono text-white truncate">
                      {priceByn.toFixed(0)} <span className="text-[9px] sm:text-[10px] font-bold text-[#0070d1]">BYN</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerFlyAnimation(e, { label: title, icon: 'sub' });
                      addToCart({
                        type: 'subscription',
                        title: `${title} (${selectedSubDuration === '12m' ? '12 месяцев' : selectedSubDuration === '3m' ? '3 месяца' : '1 месяц'}, ${currentRegion.name})`,
                        regionId: currentRegion.id,
                        duration: selectedSubDuration,
                        priceByn,
                        quantity: 1
                      });
                    }}
                    className="h-5 sm:h-6 px-1.5 sm:px-2 rounded-md bg-[#0070d1] hover:bg-[#007ceb] text-white text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer active:scale-90 shadow-sm shrink-0"
                    title="Купить"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    <span className="hidden sm:inline">Купить</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          3. КАТАЛОГ ИГР PLAYSTATION
      ========================================================================== */}
      <section id="games-catalog-section" className="space-y-5">
        {/* Section Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0070d1]/15 border border-[#0070d1]/30 flex items-center justify-center text-[#0070d1] shrink-0">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Каталог игр PlayStation</span>
              <span className="text-base">{currentRegion.flag}</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Покупка цифровых версий игр с авторасчетом номиналов карт
            </p>
          </div>
        </div>

        {/* CATALOG CONTROLS (Search, Filter Tabs, Platform, Sort) */}
        <div className="space-y-3.5">
          {/* Search bar & Sort */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Поиск игр, новинок или жанров в регионе ${currentRegion.name}...`}
                className="w-full bg-[#121722] border border-[#1e2638] focus:border-[#0070d1] text-white text-xs pl-10 pr-9 py-2.5 rounded-xl outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-start">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popular' | 'price_asc' | 'price_desc')}
                className="bg-[#121722] border border-[#1e2638] text-slate-200 text-xs py-2.5 px-3 rounded-xl outline-none"
              >
                <option value="popular">По популярности</option>
                <option value="price_asc">Сначала дешевле (в BYN)</option>
                <option value="price_desc">Сначала дороже (в BYN)</option>
              </select>

              {/* Platform pills */}
              <div className="flex items-center gap-1 p-1 bg-[#121722] border border-[#1e2638] rounded-xl shrink-0">
                {(['ALL', 'PS5', 'PS4'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPlatform(p)}
                    className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-colors ${
                      selectedPlatform === p
                        ? 'bg-[#1a2130] text-white font-bold'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {p === 'ALL' ? 'Все' : p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Tabs (Segmented bar) */}
          <div className="flex items-center gap-1.5 p-1 bg-[#121722] border border-[#1e2638] rounded-xl overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#0070d1] text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* GAMES GRID (Компактная квадратная сетка плиток) */}
        {filteredGames.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#121722] border border-[#1e2638] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#1a2130] flex items-center justify-center text-slate-500 mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Игры не найдены</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Попробуйте изменить поисковый запрос или сбросить фильтры.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="text-xs text-[#0070d1] font-semibold hover:underline"
            >
              Показать все игры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>

      {/* Subscription Detail Modal (Details on Click) */}
      <SubscriptionDetailModal
        isOpen={isSubDetailOpen}
        onClose={() => setIsSubDetailOpen(false)}
        initialTier={selectedSubForDetail}
        initialDuration={selectedSubDuration}
      />
    </div>
  );
};

