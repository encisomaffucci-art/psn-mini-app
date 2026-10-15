import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { DualSenseIcon } from './PlayStationIcons';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    closeCart,
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotalByn,
    cartItemsCount,
    openCheckout,
    regions
  } = useStore();

  if (!isCartOpen) return null;

  const getRegionFlag = (regId: string) => {
    const reg = regions.find(r => r.id === regId);
    return reg ? reg.flag : '🌐';
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#121722] border-l border-[#1e2638] h-full flex flex-col justify-between shadow-2xl">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#1e2638] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0070d1]" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Корзина ({cartItemsCount})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors mr-2"
                title="Очистить корзину"
              >
                Очистить
              </button>
            )}
            <button
              onClick={closeCart}
              className="w-8 h-8 rounded-lg bg-[#1a2130] hover:bg-[#232c3f] text-slate-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-[#1a2130] flex items-center justify-center text-slate-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">Корзина пуста</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-normal">
                Выберите игру из каталога, карту пополнения или подписку PS Plus, чтобы оформить заказ с оплатой в BYN.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[#0b0e14] border border-[#1e2638] flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span>{getRegionFlag(item.regionId)}</span>
                      <span>{item.type === 'gift_card' ? 'Пополнение' : item.type === 'subscription' ? 'Подписка' : 'Товар'}</span>
                      {item.gameTitle && (
                        <span className="text-[#0070d1] truncate max-w-[140px]">· {item.gameTitle}</span>
                      )}
                    </div>
                    <h4 className="text-xs font-semibold text-white leading-tight">
                      {item.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#1e2638]">
                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1 bg-[#121722] border border-[#1e2638] rounded-lg p-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:bg-red-500/20 hover:text-red-400 active:scale-85 transition-all cursor-pointer"
                      aria-label="Уменьшить"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs font-bold text-white px-2 select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:bg-[#0070d1] hover:text-white active:scale-85 transition-all cursor-pointer"
                      aria-label="Увеличить"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white">
                      {(item.priceByn * item.quantity).toFixed(2)} BYN
                    </span>
                    {item.quantity > 1 && (
                      <div className="text-[10px] text-slate-500 font-mono">
                        {item.priceByn.toFixed(2)} BYN / шт.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#1e2638] bg-[#0e121b] space-y-3.5 shrink-0 overflow-y-auto max-h-[65vh]">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Товаров в заказе:</span>
                <span className="font-mono text-white font-semibold">{cartItemsCount} шт.</span>
              </div>
              <div className="flex items-center justify-between text-base font-bold text-white pt-1 border-t border-[#1e2638]">
                <span>Итого к оплате:</span>
                <span className="font-mono text-xl text-[#0070d1]">
                  {cartTotalByn.toFixed(2)} BYN
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Оплата через ЕРИП, Оплати или банковские карты РБ</span>
            </div>

            <button
              onClick={openCheckout}
              className="w-full py-3 px-4 rounded-xl bg-[#0070d1] hover:bg-[#005fb3] text-white font-bold text-sm transition-all shadow-lg shadow-[#0070d1]/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Оформить заказ</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Как работает покупка: Безопасно */}
            <div className="bg-[#121722] border border-[#1e2638] rounded-xl p-3.5 space-y-2.5 text-xs">
              <div className="font-bold text-white flex items-center justify-between pb-1.5 border-b border-[#1e2638]">
                <span className="flex items-center gap-1.5">
                  <DualSenseIcon className="w-3.5 h-3.5 text-[#0070d1]" />
                  <span>Как работает покупка:</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10">
                  Безопасно
                </span>
              </div>

              <div className="space-y-2 text-slate-300 text-[11px]">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded bg-[#1a2130] text-white font-mono font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <p className="leading-snug">
                    Выбираете игру или карту пополнения кошелька.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded bg-[#1a2130] text-white font-mono font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <p className="leading-snug">
                    Оплачиваете заказ в BYN через ЕРИП, Оплати или карту.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded bg-[#1a2130] text-white font-mono font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <p className="leading-snug">
                    Получаете 12-значный код в Telegram и активируете на консоли!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
