import React from 'react';
import { useStore } from '../context/ApiStoreContext';
import { Home, MessageCircle, ShoppingBag } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cartItemsCount,
    cartTotalStore,
    isCartBounced,
    triggerHaptic,
  } = useStore();

  const handleTabClick = (tab: 'latest' | 'collections' | 'deals' | 'subscriptions' | 'cart') => {
    setActiveTab(tab);
    triggerHaptic('light');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const isHomeActive = activeTab === 'latest' || activeTab === 'collections' || activeTab === 'deals' || activeTab === 'subscriptions';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-t border-white/10 px-1 py-1 safe-area-bottom shadow-2xl">
      <div className="max-w-md mx-auto grid grid-cols-3 divide-x divide-white/10/70 text-center items-stretch">
        <button
          onClick={() => handleTabClick('latest')}
          className={`flex flex-col items-center justify-center py-2 px-1 transition-all rounded-md cursor-pointer ${
            isHomeActive
              ? 'text-[#0070d1] bg-[#0070d1]/10 font-bold'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 shrink-0" />
          <span className="text-[11px] mt-0.5 tracking-tight font-medium">Главная</span>
        </button>

        <button
          onClick={() => handleTabClick('subscriptions')}
          className={`flex flex-col items-center justify-center py-2 px-1 transition-all rounded-md cursor-pointer ${
            activeTab === 'subscriptions'
              ? 'text-[#0070d1] bg-[#0070d1]/10 font-bold'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <MessageCircle className="w-5 h-5 shrink-0" />
          <span className="text-[11px] mt-0.5 tracking-tight font-medium">Подписки</span>
        </button>

        <button
          id="bottom-nav-cart-btn"
          onClick={() => handleTabClick('cart')}
          className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-md cursor-pointer transition-all duration-300 ${
            isCartBounced
              ? 'animate-cart-landing text-emerald-400 bg-emerald-500/15 ring-2 ring-emerald-400/60'
              : activeTab === 'cart'
              ? 'text-[#0070d1] bg-[#0070d1]/10 font-bold'
              : 'text-white/50 hover:text-white'
          }`}
          title="Корзина"
        >
          {isCartBounced && (
            <span className="absolute inset-0 rounded-md ring-2 ring-emerald-400 animate-ping opacity-75 pointer-events-none" />
          )}
          {isCartBounced && (
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-black text-emerald-400 pointer-events-none animate-float-up font-mono shadow-xs">
              +1
            </span>
          )}
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 shrink-0 transition-transform ${isCartBounced ? 'scale-115 text-emerald-400' : ''}`} />
            {cartItemsCount > 0 && (
              <span className={`absolute -top-1 -right-2 bg-red-500 text-white font-mono text-[9px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center border border-black transition-transform ${isCartBounced ? 'scale-125' : ''}`}>
                {cartItemsCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight font-mono leading-tight ${
            isCartBounced
              ? 'font-extrabold text-emerald-300'
              : cartTotalStore > 0
              ? 'font-bold text-emerald-400'
              : 'font-medium text-white/50'
          }`}>
            {cartTotalStore > 0 ? `${cartTotalStore.toLocaleString('ru-RU')} TL` : 'Корзина пуста'}
          </span>
        </button>
      </div>
    </nav>
  );
};