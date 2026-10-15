import React from 'react';
import { useStore } from '../context/ApiStoreContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, CreditCard, ArrowLeft, Coins, ChevronLeft } from 'lucide-react';

export const CartSection: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotalStore,
    cartItemsCount,
    openCheckout,
    currentRegion,
    setActiveTab,
    triggerHaptic,
    checkoutData,
    calculateCheckout,
  } = useStore();

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center">
        <div className="bg-[#16181d] border border-white/10 rounded-2xl p-8 space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-black/50 border border-white/10 flex items-center justify-center text-white/40">
            <ShoppingBag className="w-10 h-10 text-[#0070d1]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Корзина пуста</h2>
            <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
              Добавьте игры или подписки из каталога.
            </p>
          </div>
          <button
            onClick={() => { setActiveTab('latest'); triggerHaptic('light'); }}
            className="w-full px-6 py-3 rounded-full bg-[#0070d1] hover:bg-[#005fb3] text-white font-bold text-sm transition-colors"
          >
            Перейти в каталог
          </button>
        </div>
      </div>
    );
  }

  const handleCalculateCheckout = async () => {
    await calculateCheckout();
    triggerHaptic('medium');
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Корзина</h1>
          <p className="text-xs text-white/50 mt-1">{cartItemsCount} позиций</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setActiveTab('latest'); triggerHaptic('light'); }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 text-xs font-semibold transition-colors"><ChevronLeft className="w-3.5 h-3.5" /><span>Назад</span></button>
          <button onClick={clearCart} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-white/50 hover:text-red-400 text-xs font-semibold hover:bg-white/5 transition-colors"><Trash2 className="w-3.5 h-3.5" /><span>Очистить</span></button>
        </div>
      </div>

      <div className="space-y-3">
        {cart.map((item, index) => (
          <div key={item.game.id} className="p-3 rounded-xl bg-[#16181d] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-white/50 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/50 border border-white/10 text-[11px] font-medium text-white/80">
                  <span>{currentRegion.flag}</span>
                  <span>{currentRegion.code}</span>
                </span>
              </div>
              <h3 className="text-sm font-bold text-white leading-snug line-clamp-1">{item.game.title}</h3>
              <div className="text-xs text-white/50 font-mono">{item.price.toLocaleString('ru-RU')} {currentRegion.symbol} / шт.</div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
              <div className="flex items-center bg-black/50 border border-white/10 rounded-xl p-1 shadow-xs">
                <button onClick={() => { updateQuantity(index, -1); triggerHaptic('light'); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/60 hover:bg-red-500/20 hover:text-red-400 active:scale-85 transition-all" aria-label="Уменьшить"><Minus className="w-3.5 h-3.5" /></button>
                <span className="font-mono text-sm font-bold text-white px-3 min-w-[2.2rem] text-center select-none">{item.quantity}</span>
                <button onClick={() => { updateQuantity(index, 1); triggerHaptic('light'); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/60 hover:bg-[#0070d1] hover:text-white active:scale-85 transition-all" aria-label="Увеличить"><Plus className="w-3.5 h-3.5" /></button>
              </div>

              <div className="text-right min-w-[5rem]">
                <div className="text-base font-extrabold font-mono text-white">{(item.price * item.quantity).toLocaleString('ru-RU')} {currentRegion.symbol}</div>
              </div>

              <button onClick={() => { removeFromCart(index); triggerHaptic('light'); }} className="w-8 h-8 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors" title="Удалить"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-[#16181d] border border-white/10 space-y-5">
        <h2 className="text-base font-bold text-white pb-3 border-b border-white/10">Итог</h2>
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-white/70">
            <span>Количество позиций:</span>
            <span className="font-mono font-bold text-white">{cartItemsCount} шт.</span>
          </div>
          <div className="flex items-center justify-between text-white/70">
            <span>Сумма в PS Store:</span>
            <span className="font-mono font-bold text-white">{cartTotalStore.toLocaleString('ru-RU')} {currentRegion.symbol}</span>
          </div>
          {checkoutData && (
            <>
              <div className="flex items-center justify-between text-white/70">
                <span>Номинал карт к выдаче:</span>
                <span className="font-bold text-white">{checkoutData.totalFaceValue.toLocaleString('ru-RU')} {currentRegion.symbol}</span>
              </div>
              <div className="flex items-center justify-between text-white/70">
                <span>Остаток на кошельке:</span>
                <span className="font-bold text-emerald-400">+{checkoutData.remainder.toLocaleString('ru-RU')} {currentRegion.symbol}</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-bold text-white block">Итого к оплате:</span>
                  <span className="text-[11px] text-white/50">включая комиссию сервиса</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black font-mono text-[#0070d1]">{checkoutData.totalFiat.toFixed(2)} BYN</div>
                </div>
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleCalculateCheckout}
          disabled={checkoutData === null}
          className="w-full py-3.5 px-5 rounded-full bg-[#0070d1] hover:bg-[#005fb3] text-white font-bold text-sm transition-all shadow-lg shadow-[#0070d1]/30 hover:shadow-[#0070d1]/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Перейти к оплате</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Способы оплаты:</div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-white/70">
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-black/50 border border-white/10"><CreditCard className="w-3.5 h-3.5 text-[#0070d1] shrink-0" /><span>Карта BYN</span></div>
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-black/50 border border-white/10"><CreditCard className="w-3.5 h-3.5 text-amber-400 shrink-0" /><span>ЕРИП</span></div>
            <div className="col-span-2 flex items-center gap-1.5 p-2 rounded-lg bg-black/50 border border-emerald-500/30 text-emerald-300"><Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span className="font-semibold">USDT (TRC-20)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};