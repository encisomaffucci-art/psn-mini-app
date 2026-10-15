import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PlusTier, SubscriptionDuration } from '../types';
import { Check, ShoppingBag, Zap, Sparkles } from 'lucide-react';

export const SubscriptionSection: React.FC = () => {
  const { currentRegion, subscriptions, addToCart, triggerFlyAnimation } = useStore();
  const [selectedDuration, setSelectedDuration] = useState<SubscriptionDuration>('12m');
  const [addedTier, setAddedTier] = useState<PlusTier | null>(null);

  const handleAddSubscription = (e: React.MouseEvent, tier: PlusTier, title: string, priceByn: number) => {
    triggerFlyAnimation(e, { label: title, icon: 'sub' });
    addToCart({
      type: 'subscription',
      title: `${title} (${selectedDuration === '12m' ? '12 месяцев' : selectedDuration === '3m' ? '3 месяца' : '1 месяц'}, ${currentRegion.name})`,
      regionId: currentRegion.id,
      duration: selectedDuration,
      priceByn,
      quantity: 1
    });
    setAddedTier(tier);
    setTimeout(() => {
      setAddedTier(null);
    }, 1400);
  };

  const tiers: { tier: PlusTier; title: string; subtitle: string; popular?: boolean }[] = [
    {
      tier: 'essential',
      title: 'PS Plus Essential',
      subtitle: 'Базовая подписка для игры по сети и бесплатных ежемесячных игр'
    },
    {
      tier: 'extra',
      title: 'PS Plus Extra',
      subtitle: 'Самая выгодная: каталог из 400+ игр для PS4 и PS5 в подарок',
      popular: true
    },
    {
      tier: 'deluxe',
      title: currentRegion.id === 'poland' ? 'PS Plus Premium' : 'PS Plus Deluxe',
      subtitle: 'Максимальный уровень: каталог ретро-классики и триалы новинок'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Duration Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e2638]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{currentRegion.flag}</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Подписки PlayStation Plus ({currentRegion.name})
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Активация на ваш личный аккаунт. Доступ к сетевой игре и огромной библиотеке игр.
          </p>
        </div>

        {/* Duration Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-[#121722] border border-[#1e2638] rounded-lg shrink-0">
          <button
            onClick={() => setSelectedDuration('1m')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedDuration === '1m'
                ? 'bg-[#0070d1] text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1 месяц
          </button>
          <button
            onClick={() => setSelectedDuration('3m')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedDuration === '3m'
                ? 'bg-[#0070d1] text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3 месяца
          </button>
          <button
            onClick={() => setSelectedDuration('12m')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedDuration === '12m'
                ? 'bg-[#0070d1] text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            12 месяцев (-35%)
          </button>
        </div>
      </div>

      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map(({ tier, title, subtitle, popular }) => {
          // Find matching subscription plan for region and duration
          const plan = subscriptions.find(
            s => s.regionId === currentRegion.id && s.tier === tier && s.duration === selectedDuration
          ) || subscriptions.find(
            s => s.regionId === currentRegion.id && s.tier === tier
          );

          const priceByn = plan ? plan.priceByn : (tier === 'essential' ? 135 : tier === 'extra' ? 225 : 259);

          return (
            <div
              key={tier}
              className={`bg-[#121722] border rounded-2xl p-6 flex flex-col justify-between transition-all relative overflow-hidden ${
                popular
                  ? 'border-[#0070d1] shadow-xl shadow-[#0070d1]/10 ring-1 ring-[#0070d1]'
                  : 'border-[#1e2638] hover:border-slate-600'
              }`}
            >
              {popular && (
                <div className="absolute top-0 right-0 bg-[#0070d1] text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Популярный выбор</span>
                </div>
              )}

              <div>
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
                  <p className="text-xs text-slate-400 leading-normal">{subtitle}</p>
                </div>

                {/* Price */}
                <div className="py-4 border-y border-[#1e2638] my-4 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold font-mono text-white">
                      {priceByn.toFixed(2)}
                    </span>
                    <span className="text-sm font-mono text-[#0070d1] font-bold">BYN</span>
                    <span className="text-xs text-slate-500">/ {selectedDuration === '12m' ? 'год' : selectedDuration === '3m' ? '3 мес' : 'месяц'}</span>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-2.5 text-xs text-slate-300 mb-6">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Сетевой мультиплеер во всех играх</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Ежемесячная подборка бесплатных игр</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Эксклюзивные скидки в PS Store</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Облачное хранилище для сохранений</span>
                  </div>

                  {(tier === 'extra' || tier === 'deluxe') && (
                    <div className="flex items-start gap-2 text-white font-medium">
                      <Zap className="w-4 h-4 text-[#0070d1] shrink-0 mt-0.5" />
                      <span>Каталог 400+ игр для PS4 и PS5</span>
                    </div>
                  )}

                  {(tier === 'extra' || tier === 'deluxe') && (
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Игры Ubisoft+ Classics включены</span>
                    </div>
                  )}

                  {tier === 'deluxe' && (
                    <div className="flex items-start gap-2 text-amber-300 font-medium">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Каталог классики (PS1, PS2, PSP) и триалы</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => handleAddSubscription(e, tier, title, priceByn)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 select-none ${
                  addedTier === tier
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-1 ring-emerald-400'
                    : popular
                    ? 'bg-[#0070d1] hover:bg-[#005fb3] text-white shadow-[#0070d1]/30'
                    : 'bg-[#1a2130] hover:bg-[#232c3f] text-slate-100 border border-[#1e2638]'
                }`}
              >
                {addedTier === tier ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Добавлено в корзину!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Оформить подписку</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
