import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PlusTier, SubscriptionDuration } from '../types';
import { X, Check, ShoppingBag, Zap, Sparkles, Shield, Clock, Film } from 'lucide-react';

interface SubscriptionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier: PlusTier;
  initialDuration: SubscriptionDuration;
}

export const SubscriptionDetailModal: React.FC<SubscriptionDetailModalProps> = ({
  isOpen,
  onClose,
  initialTier,
  initialDuration
}) => {
  const { currentRegion, subscriptions, addToCart, triggerFlyAnimation } = useStore();
  const [selectedDuration, setSelectedDuration] = useState<SubscriptionDuration>(initialDuration);
  const [activeTier, setActiveTier] = useState<PlusTier>(initialTier);
  const [justAdded, setJustAdded] = useState(false);

  // Sync state when opened with new props
  React.useEffect(() => {
    if (isOpen) {
      setActiveTier(initialTier);
      setSelectedDuration(initialDuration);
      setJustAdded(false);
    }
  }, [isOpen, initialTier, initialDuration]);

  if (!isOpen) return null;

  const plan = subscriptions.find(
    s => s.regionId === currentRegion.id && s.tier === activeTier && s.duration === selectedDuration
  ) || subscriptions.find(
    s => s.regionId === currentRegion.id && s.tier === activeTier
  );

  const priceByn = plan ? plan.priceByn : (activeTier === 'essential' ? 135 : activeTier === 'extra' ? 225 : 259);

  const getTierTitle = (tier: PlusTier) => {
    if (tier === 'essential') return 'PS Plus Essential';
    if (tier === 'extra') return 'PS Plus Extra';
    return currentRegion.id === 'poland' ? 'PS Plus Premium' : 'PS Plus Deluxe';
  };

  const getTierColor = (tier: PlusTier) => {
    if (tier === 'essential') return { border: 'border-slate-500/30', badge: 'bg-slate-700/60 text-slate-200', glow: 'text-sky-400' };
    if (tier === 'extra') return { border: 'border-[#0070d1]/50', badge: 'bg-[#0070d1] text-white', glow: 'text-[#0070d1]' };
    return { border: 'border-amber-500/50', badge: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black', glow: 'text-amber-400' };
  };

  const colors = getTierColor(activeTier);

  const handleAddToCart = (e: React.MouseEvent) => {
    const title = getTierTitle(activeTier);
    triggerFlyAnimation(e, { label: title, icon: 'sub' });
    addToCart({
      type: 'subscription',
      title: `${title} (${selectedDuration === '12m' ? '12 месяцев' : selectedDuration === '3m' ? '3 месяца' : '1 месяц'}, ${currentRegion.name})`,
      regionId: currentRegion.id,
      duration: selectedDuration,
      priceByn,
      quantity: 1
    });
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div 
        className="relative w-full max-w-lg bg-[#0f1420] border border-[#222d42] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 pb-4 border-b border-white/10 flex items-start justify-between relative bg-gradient-to-b from-[#141b2c] to-[#0f1420]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">{currentRegion.flag}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${colors.badge}`}>
                {activeTier === 'deluxe' && currentRegion.id === 'poland' ? 'PREMIUM' : activeTier.toUpperCase()}
              </span>
              <span className="text-xs text-slate-400">· {currentRegion.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {getTierTitle(activeTier)}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Tier Switcher inside modal */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Уровень подписки:</div>
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#090c12] border border-white/10 rounded-xl">
              {(['essential', 'extra', 'deluxe'] as PlusTier[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTier(t)}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
                    activeTier === t
                      ? 'bg-[#0070d1] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t === 'deluxe' && currentRegion.id === 'poland' ? 'Premium' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Switcher */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Срок действия:</div>
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#090c12] border border-white/10 rounded-xl">
              <button
                onClick={() => setSelectedDuration('1m')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer ${
                  selectedDuration === '1m'
                    ? 'bg-white/15 text-white font-bold ring-1 ring-white/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1 месяц
              </button>
              <button
                onClick={() => setSelectedDuration('3m')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer ${
                  selectedDuration === '3m'
                    ? 'bg-white/15 text-white font-bold ring-1 ring-white/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                3 месяца
              </button>
              <button
                onClick={() => setSelectedDuration('12m')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer relative ${
                  selectedDuration === '12m'
                    ? 'bg-[#0070d1] text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>12 месяцев</span>
                <span className="block text-[9px] text-amber-300 font-mono">Выгодно</span>
              </button>
            </div>
          </div>

          {/* Pricing Highlight Box */}
          <div className="p-4 rounded-xl bg-[#090c12] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400">Стоимость подписки:</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                  {priceByn.toFixed(2)}
                </span>
                <span className="text-sm font-mono font-bold text-[#0070d1]">BYN</span>
                <span className="text-xs text-slate-400">
                  / {selectedDuration === '12m' ? 'год' : selectedDuration === '3m' ? '3 мес.' : 'месяц'}
                </span>
              </div>
            </div>
          </div>

          {/* Full List of Benefits & Features */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Что входит в тариф {getTierTitle(activeTier)}:
            </h4>

            <div className="space-y-2 text-xs text-slate-200">
              {/* Common features for all tiers */}
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Сетевой мультиплеер</strong>
                  <span className="text-slate-400 text-[11px]">Играйте онлайн с друзьями в любые игры PlayStation 4 и 5</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Бесплатные игры каждый месяц</strong>
                  <span className="text-slate-400 text-[11px]">Ежемесячно от 3 игр навсегда в вашу библиотеку при активной подписке</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Эксклюзивные скидки и акции</strong>
                  <span className="text-slate-400 text-[11px]">Двойные скидки во время распродаж PlayStation Store</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">100 ГБ облачного хранилища</strong>
                  <span className="text-slate-400 text-[11px]">Автоматическое резервное копирование всех сохранений игр</span>
                </div>
              </div>

              {/* Extra & Deluxe features */}
              {(activeTier === 'extra' || activeTier === 'deluxe') && (
                <>
                  <div className="p-2.5 rounded-lg bg-[#0070d1]/10 border border-[#0070d1]/30 flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-[#0070d1] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Каталог из 400+ игр для PS4 и PS5</strong>
                      <span className="text-slate-300 text-[11px]">Хиты PlayStation Studios и ведущих издателей без доплат</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0070d1]/10 border border-[#0070d1]/30 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Каталог Ubisoft+ Classics</strong>
                      <span className="text-slate-300 text-[11px]">Assassin's Creed, Far Cry, Watch Dogs и десятки других игр</span>
                    </div>
                  </div>
                </>
              )}

              {/* Deluxe / Premium only features */}
              {activeTier === 'deluxe' && (
                <>
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Каталог классики (PS1, PS2, PSP)</strong>
                      <span className="text-slate-300 text-[11px]">Легендарные игры с улучшенной графикой, перемоткой и сохранениями</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Пробные версии новинок (Триалы)</strong>
                      <span className="text-slate-300 text-[11px]">Опробуйте самые свежие блокбастеры по 2-5 часов перед покупкой</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Purchase Action */}
        <div className="p-4 bg-[#090c12] border-t border-white/10 flex items-center justify-between gap-3">
          <div className="leading-tight">
            <span className="text-[10px] text-slate-400 block">К оплате:</span>
            <span className="text-lg font-black font-mono text-white">{priceByn.toFixed(2)} BYN</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-1 ring-emerald-400'
                : 'bg-[#0070d1] hover:bg-[#005fb3] text-white shadow-[#0070d1]/30'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Добавлено в корзину!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Добавить в корзину</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
