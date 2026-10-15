import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Game, RegionConfig, CheckoutCalculation } from '../services/api';

interface Region {
  id: string;
  code: string;
  name: string;
  flag: string;
  symbol: string;
  currencyCode: string;
  rateToBYN: number;
  denominations: { val: number; active: boolean }[];
}

interface StoreContextType {
  currentRegion: Region;
  setRegion: (regionCode: string) => void;
  regions: Region[];
  
  games: Game[];
  loadingGames: boolean;
  loadGames: (shelf?: string) => Promise<void>;
  
  cart: CartItem[];
  addToCart: (game: Game, editionName: string) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartTotalStore: number;
  cartTotalFiat: number;
  
  calculateCheckout: () => Promise<CheckoutCalculation | null>;
  createOrder: (paymentMethod: string) => Promise<string | null>;
  uploadReceipt: (orderId: string, file: File) => Promise<boolean>;
  
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  
  selectedGame: Game | null;
  openGameModal: (game: Game) => void;
  closeGameModal: () => void;
  
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  
  activeTab: 'latest' | 'collections' | 'deals' | 'subscriptions';
  setActiveTab: (tab: 'latest' | 'collections' | 'deals' | 'subscriptions') => void;
  
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchGames: () => Promise<void>;
  
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy' | 'success') => void;
}

interface CartItem {
  game: Game;
  editionName: string;
  price: number;
  region: string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const SHELF_MAP: Record<string, string> = {
  latest: 'latest',
  collections: 'collections',
  deals: 'deals',
  subscriptions: 'subscriptions',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRegionCode, setCurrentRegionCode] = useState('TR');
  const [regions, setRegions] = useState<Region[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(false);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'latest' | 'collections' | 'deals' | 'subscriptions'>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [checkoutData, setCheckoutData] = useState<CheckoutCalculation | null>(null);

  const loadRegions = useCallback(async () => {
    try {
      const { fetchRegions } = await import('../services/api');
      const data = await fetchRegions();
      setRegions(data);
    } catch (e) {
      console.error('Failed to load regions:', e);
    }
  }, []);

  const loadGames = useCallback(async (shelf?: string) => {
    setLoadingGames(true);
    try {
      const { fetchCatalog } = await import('../services/api');
      const data = await fetchCatalog({ shelf: SHELF_MAP[shelf || activeTab], region: currentRegionCode });
      setGames(data);
    } catch (e) {
      console.error('Failed to load games:', e);
    } finally {
      setLoadingGames(false);
    }
  }, [currentRegionCode, activeTab]);

  const searchGames = useCallback(async () => {
    if (!searchQuery.trim()) {
      await loadGames();
      return;
    }
    setLoadingGames(true);
    try {
      const { fetchCatalog } = await import('../services/api');
      const data = await fetchCatalog({ region: currentRegionCode });
      const filtered = data.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()));
      setGames(filtered);
    } catch (e) {
      console.error('Search failed:', e);
    } finally {
      setLoadingGames(false);
    }
  }, [searchQuery, currentRegionCode, loadGames]);

  useEffect(() => {
    loadRegions();
  }, [loadRegions]);

  useEffect(() => {
    loadGames();
  }, [activeTab, currentRegionCode, searchQuery]);

  const setRegion = (code: string) => {
    setCurrentRegionCode(code);
  };

  const addToCart = (game: Game, editionName: string) => {
    const edition = game.editions.find(e => e.name === editionName);
    if (!edition) return;
    
    const price = edition.prices[currentRegionCode] || 0;
    setCart(prev => [...prev, { game, editionName, price, region: currentRegionCode }]);
    triggerHaptic('medium');
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
    triggerHaptic('light');
  };

  const clearCart = () => setCart([]);

  const cartTotalStore = cart.reduce((sum, item) => sum + item.price, 0);

  const calculateCheckout = async () => {
    if (cart.length === 0) return null;
    
    try {
      const { calculateCheckout: apiCalculate } = await import('../services/api');
      const data = await apiCalculate({
        items: cart.map(item => ({ gameId: item.game.id, editionName: item.editionName })),
        region: currentRegionCode,
        currency: 'BYN',
      });
      setCheckoutData(data);
      return data;
    } catch (e) {
      console.error('Checkout calculation failed:', e);
      return null;
    }
  };

  const createOrder = async (paymentMethod: string) => {
    if (!checkoutData) return null;
    
    try {
      const { createOrder: apiCreateOrder } = await import('../services/api');
      const tg = (window as any).Telegram?.WebApp;
      const user = tg?.initDataUnsafe?.user || { id: 'unknown', username: '', first_name: '' };
      
      const result = await apiCreateOrder({
        user,
        items: cart.map(item => ({ 
          gameId: item.game.id, 
          editionName: item.editionName,
          price: item.price 
        })),
        currency: 'BYN',
        region: currentRegionCode,
        paymentMethod,
        giftCards: checkoutData.giftCards,
        totalStore: checkoutData.storeSum,
        totalFiat: checkoutData.totalFiat,
        remainder: checkoutData.remainder,
      });
      
      return result.orderId;
    } catch (e) {
      console.error('Order creation failed:', e);
      return null;
    }
  };

  const uploadReceipt = async (orderId: string, file: File) => {
    try {
      const { uploadReceipt: apiUpload } = await import('../services/api');
      await apiUpload(orderId, file);
      return true;
    } catch (e) {
      console.error('Receipt upload failed:', e);
      return false;
    }
  };

  const openGameModal = (game: Game) => {
    setSelectedGame(game);
    setIsGameModalOpen(true);
  };

  const closeGameModal = () => {
    setSelectedGame(null);
    setIsGameModalOpen(false);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  
  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' = 'light') => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.HapticFeedback) {
        if (type === 'success') {
          tg.HapticFeedback.notificationOccurred('success');
        } else {
          tg.HapticFeedback.impactOccurred(type);
        }
      }
    } catch {}
  };

  return (
    <StoreContext.Provider value={{
      currentRegion: regions.find(r => r.code === currentRegionCode) || regions[0] || {
        id: 'TR', code: 'TR', name: 'Турция', flag: '🇹🇷', symbol: 'TL', currencyCode: 'TRY', rateToBYN: 0.105, denominations: []
      },
      setRegion,
      regions,
      games,
      loadingGames,
      loadGames,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      cartTotalStore,
      cartTotalFiat: checkoutData?.totalFiat || 0,
      calculateCheckout,
      createOrder,
      uploadReceipt,
      isCartOpen,
      openCart,
      closeCart,
      selectedGame,
      openGameModal,
      closeGameModal,
      isCheckoutOpen,
      openCheckout,
      closeCheckout,
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      searchGames,
      triggerHaptic,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};