import React, { useEffect } from 'react';
import { useStore } from './context/ApiStoreContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CatalogSection } from './components/CatalogSection';
import { CartSection } from './components/CartSection';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { GameDetailModal } from './components/GameDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { RegionSelectionScreen } from './components/RegionSelectionScreen';
import { TelegramMiniAppFrame } from './components/TelegramMiniAppFrame';

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    isCartOpen, 
    isCheckoutOpen, 
    selectedGame,
    activeScreen,
    setActiveScreen,
    triggerHaptic 
  } = useStore();

  useEffect(() => {
    const handleOpenCart = () => {
      triggerHaptic('medium');
    };
    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, [triggerHaptic]);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 antialiased">
      <TelegramMiniAppFrame />
      
      {(activeScreen === 'region_select' || activeScreen === 'store') && (
        <Header />
      )}

      <main className="flex-1">
        {activeScreen === 'region_select' && (
          <RegionSelectionScreen />
        )}

        {activeScreen === 'store' && (
          <>
            <HeroBanner />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
              {(activeTab === 'catalog' || activeTab === 'gift_cards' || activeTab === 'subscriptions') && (
                <CatalogSection />
              )}
              {activeTab === 'cart' && <CartSection />}
            </div>
          </>
        )}
      </main>

      <Footer />

      <MobileBottomNav />

      <GameDetailModal />
      <CheckoutModal />
    </div>
  );
};

export default function App() {
  return <MainContent />;
}