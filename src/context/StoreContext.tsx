import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Region,
  RegionId,
  GameProduct,
  GiftCardDenomination,
  SubscriptionPlan,
  CartItem,
  Order,
  DigitalCode,
  UserProfile,
  CatalogCategory,
  PaymentMethod
} from '../types';
import {
  REGIONS,
  INITIAL_GAMES,
  INITIAL_GIFT_CARDS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_DIGITAL_CODES,
  INITIAL_ORDERS
} from '../data/initialData';
import { safeStorage } from '../utils/safeStorage';
import {
  saveAssetToStorage,
  getAssetFromStorage,
  removeAssetFromStorage
} from '../utils/imageStorage';

export interface GameRecommendation {
  game: GameProduct;
  requiredAmount: number;
  currencySymbol: string;
  currencyCode: string;
  recommendedCards: {
    denomination: number;
    count: number;
    priceBynPerCard: number;
    subtotalByn: number;
  }[];
  totalWalletLoaded: number;
  surplusAmount: number;
  totalByn: number;
}

export interface FlyingParticle {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  image?: string;
  label?: string;
  icon?: 'game' | 'card' | 'sub';
}

interface StoreContextType {
  // Region
  currentRegion: Region;
  setRegion: (regionId: RegionId) => void;
  regions: Region[];
  isRegionConfirmed: boolean;
  isRegionModalOpen: boolean;
  openRegionModal: () => void;
  confirmRegionSelection: (regionId: RegionId) => void;

  // Catalog Filters
  activeCategory: CatalogCategory;
  setActiveCategory: (cat: CatalogCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedPlatform: 'ALL' | 'PS5' | 'PS4';
  setSelectedPlatform: (p: 'ALL' | 'PS5' | 'PS4') => void;

  // Products
  games: GameProduct[];
  giftCards: GiftCardDenomination[];
  subscriptions: SubscriptionPlan[];
  addProduct: (product: Omit<GameProduct, 'id'>) => GameProduct;
  updateProduct: (productId: string, updated: Partial<GameProduct>) => void;
  deleteProduct: (productId: string) => void;
  updateGamePrice: (gameId: string, regionId: RegionId, newPrice: number) => void;
  updateGiftCardPrice: (cardId: string, newPriceByn: number) => void;
  updateGiftCardImage: (cardId: string, imageUrl: string) => void;
  updateSubscriptionPrice: (subId: string, newPriceByn: number) => void;
  toggleGameCategory: (gameId: string, category: CatalogCategory) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotalByn: number;
  cartItemsCount: number;

  // Fly to Cart Animation
  flyingParticles: FlyingParticle[];
  triggerFlyAnimation: (
    source?: HTMLElement | { x: number; y: number } | React.MouseEvent,
    info?: { image?: string; label?: string; icon?: 'game' | 'card' | 'sub' }
  ) => void;
  isCartBounced: boolean;

  // Game Recommendation Engine
  calculateGameRecommendation: (game: GameProduct, regionId?: RegionId) => GameRecommendation;
  calculateCustomAmountRecommendation: (amount: number, regionId?: RegionId) => GameRecommendation | null;
  addGameRecommendationToCart: (rec: GameRecommendation) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    telegramUsername: string;
    phone: string;
    email?: string;
    paymentMethod: PaymentMethod;
    receiptNote?: string;
    paymentReference?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], adminNotes?: string) => void;
  manualIssueCode: (orderId: string, codeString: string, itemTitle: string) => void;

  // Digital Codes Inventory
  digitalCodes: DigitalCode[];
  addDigitalCode: (code: Omit<DigitalCode, 'id' | 'createdAt'>) => void;
  addBatchCodes: (lines: string[], regionId: RegionId, denomination: number, productType: 'gift_card' | 'subscription', title: string) => number;
  deleteDigitalCode: (codeId: string) => void;

  // User
  currentUser: UserProfile;
  loginWithTelegram: (username: string, name?: string) => void;
  logout: () => void;

  // Telegram Mini App (TMA) mode
  isTmaMode: boolean;
  toggleTmaMode: () => void;
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy' | 'success') => void;

  // UI Modals
  selectedGame: GameProduct | null;
  openGameModal: (game: GameProduct) => void;
  closeGameModal: () => void;

  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;

  isAccountOpen: boolean;
  openAccount: () => void;
  closeAccount: () => void;

  isAdminOpen: boolean;
  openAdmin: () => void;
  closeAdmin: () => void;

  isGuidesOpen: boolean;
  openGuides: () => void;
  closeGuides: () => void;

  lastCompletedOrder: Order | null;
  setLastCompletedOrder: (order: Order | null) => void;

  activeTab: 'catalog' | 'gift_cards' | 'subscriptions' | 'guides' | 'cart';
  setActiveTab: (tab: 'catalog' | 'gift_cards' | 'subscriptions' | 'guides' | 'cart') => void;

  // Active Screen flow (Region Selection Screen -> Store -> Favorites)
  activeScreen: 'region_select' | 'store' | 'favorites';
  setActiveScreen: (screen: 'region_select' | 'store' | 'favorites') => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (gameId: string) => void;
  isFavorite: (gameId: string) => boolean;

  // Custom User Assets (Logo & Region Tile Backgrounds)
  customLogoUrl: string;
  customRegionImages: Record<RegionId, string>;
  customRegionTopupImages: Record<RegionId, string>;
  setCustomLogoUrl: (url: string) => void;
  setCustomRegionImage: (regionId: RegionId, url: string) => void;
  setCustomRegionTopupImage: (regionId: RegionId, url: string) => void;
  resetCustomImages: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistent or state storage
  const [currentRegionId, setCurrentRegionId] = useState<RegionId>(() => {
    const saved = safeStorage.getItem('ps_region');
    return (saved as RegionId) || 'turkey';
  });

  const [activeCategory, setActiveCategory] = useState<CatalogCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'ALL' | 'PS5' | 'PS4'>('ALL');
  const [activeTab, setActiveTabState] = useState<'catalog' | 'gift_cards' | 'subscriptions' | 'guides' | 'cart'>('catalog');

  const setActiveTab = (tab: 'catalog' | 'gift_cards' | 'subscriptions' | 'guides' | 'cart') => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  // Datasets
  const [games, setGames] = useState<GameProduct[]>(() => {
    try {
      const saved = safeStorage.getItem('ps_games');
      return saved ? JSON.parse(saved) : INITIAL_GAMES;
    } catch {
      return INITIAL_GAMES;
    }
  });

  const [giftCards, setGiftCards] = useState<GiftCardDenomination[]>(() => {
    try {
      const saved = safeStorage.getItem('ps_gift_cards');
      return saved ? JSON.parse(saved) : INITIAL_GIFT_CARDS;
    } catch {
      return INITIAL_GIFT_CARDS;
    }
  });

  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>(() => {
    try {
      const saved = safeStorage.getItem('ps_subscriptions');
      return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
    } catch {
      return INITIAL_SUBSCRIPTIONS;
    }
  });

  const [digitalCodes, setDigitalCodes] = useState<DigitalCode[]>(() => {
    try {
      const saved = safeStorage.getItem('ps_digital_codes');
      return saved ? JSON.parse(saved) : INITIAL_DIGITAL_CODES;
    } catch {
      return INITIAL_DIGITAL_CODES;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = safeStorage.getItem('ps_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = safeStorage.getItem('ps_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = safeStorage.getItem('ps_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.telegramUsername && !parsed.telegramUsername.includes('wetjuly')) {
            return parsed;
          } else {
            safeStorage.removeItem('ps_user');
          }
        }
      } catch {
        // ignore
      }
    }
    return {
      id: 'user-guest',
      telegramUsername: '',
      name: '',
      savedRegion: 'turkey',
      isAuthenticated: false
    };
  });

  // Active Screen flow (Region Selection in Hero Banner -> Store)
  const [activeScreen, setActiveScreen] = useState<'region_select' | 'store' | 'favorites'>('store');

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = safeStorage.getItem('ps_favorites');
      return saved ? JSON.parse(saved) : ['game-spiderman-2', 'game-ea-fc-25'];
    } catch {
      return ['game-spiderman-2', 'game-ea-fc-25'];
    }
  });

  const toggleFavorite = (gameId: string) => {
    triggerHaptic('light');
    setFavorites(prev => {
      const exists = prev.includes(gameId);
      const next = exists ? prev.filter(id => id !== gameId) : [...prev, gameId];
      safeStorage.setItem('ps_favorites', JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = (gameId: string) => favorites.includes(gameId);

  // TMA mode check
  const [isTmaMode, setIsTmaMode] = useState<boolean>(() => {
    // Check if Telegram WebApp is injected or toggle
    if (typeof window !== 'undefined' && (window as unknown as { Telegram?: { WebApp?: unknown } }).Telegram?.WebApp) {
      return true;
    }
    return false;
  });

  // Modals
  const [isRegionConfirmed, setIsRegionConfirmed] = useState<boolean>(() => {
    return safeStorage.getItem('ps_region_confirmed') === 'true';
  });
  const [isRegionModalOpen, setIsRegionModalOpen] = useState<boolean>(false);

  const openRegionModal = () => {
    setActiveScreen('store');
    setIsRegionModalOpen(false);
    if (typeof window !== 'undefined') {
      const el = document.getElementById('region-selector-block');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const confirmRegionSelection = (regionId: RegionId) => {
    setCurrentRegionId(regionId);
    setIsRegionConfirmed(true);
    setIsRegionModalOpen(false);
    setActiveScreen('store');
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('ps_region_confirmed_session', 'true');
      } catch {
        // ignore
      }
      safeStorage.setItem('ps_region', regionId);
      safeStorage.setItem('ps_region_confirmed', 'true');
    }
    triggerHaptic('success');
  };

  const [selectedGame, setSelectedGame] = useState<GameProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  // Custom User Assets (Logo & Region Tile Backgrounds)
  const [customLogoUrl, setCustomLogoUrlState] = useState<string>(() => {
    return safeStorage.getItem('ps_custom_logo') || '';
  });

  const [customRegionImages, setCustomRegionImagesState] = useState<Record<RegionId, string>>(() => {
    try {
      const saved = safeStorage.getItem('ps_custom_region_images');
      return saved ? JSON.parse(saved) : { turkey: '', india: '', poland: '', ukraine: '' };
    } catch {
      return { turkey: '', india: '', poland: '', ukraine: '' };
    }
  });

  const [customRegionTopupImages, setCustomRegionTopupImagesState] = useState<Record<RegionId, string>>(() => {
    try {
      const saved = safeStorage.getItem('ps_custom_region_topup_images');
      return saved ? JSON.parse(saved) : { turkey: '', india: '', poland: '', ukraine: '' };
    } catch {
      return { turkey: '', india: '', poland: '', ukraine: '' };
    }
  });

  // Hydrate custom images from IndexedDB asynchronously (handles large images safely without quota limit)
  useEffect(() => {
    let active = true;
    const hydrateAssets = async () => {
      try {
        const storedLogo = await getAssetFromStorage('custom_logo');
        if (active && storedLogo) {
          setCustomLogoUrlState(storedLogo);
        }
        const regions: RegionId[] = ['turkey', 'india', 'poland', 'ukraine'];
        for (const reg of regions) {
          const storedReg = await getAssetFromStorage(`region_${reg}`);
          if (active && storedReg) {
            setCustomRegionImagesState(prev => ({ ...prev, [reg]: storedReg }));
          }
          const storedTopup = await getAssetFromStorage(`region_topup_${reg}`);
          if (active && storedTopup) {
            setCustomRegionTopupImagesState(prev => ({ ...prev, [reg]: storedTopup }));
          }
        }
        // Hydrate gift card images
        setGiftCards(prev => {
          let updated = false;
          const copy = [...prev];
          Promise.all(
            copy.map(async (gc, idx) => {
              const storedImg = await getAssetFromStorage(`giftcard_${gc.id}`);
              if (storedImg && active && copy[idx].imageUrl !== storedImg) {
                copy[idx] = { ...copy[idx], imageUrl: storedImg };
                updated = true;
              }
            })
          ).then(() => {
            if (updated && active) {
              setGiftCards([...copy]);
            }
          });
          return prev;
        });
      } catch (e) {
        console.warn('Could not load assets from IndexedDB:', e);
      }
    };
    hydrateAssets();
    return () => {
      active = false;
    };
  }, []);

  const setCustomLogoUrl = (url: string) => {
    setCustomLogoUrlState(url);
    if (url) {
      if (url.length < 150000) {
        safeStorage.setItem('ps_custom_logo', url);
      }
      saveAssetToStorage('custom_logo', url);
    } else {
      safeStorage.removeItem('ps_custom_logo');
      removeAssetFromStorage('custom_logo');
    }
  };

  const setCustomRegionImage = (regionId: RegionId, url: string) => {
    setCustomRegionImagesState(prev => {
      const next = { ...prev, [regionId]: url };
      try {
        const json = JSON.stringify(next);
        if (json.length < 250000) {
          safeStorage.setItem('ps_custom_region_images', json);
        }
      } catch {
        // ignore
      }
      return next;
    });

    if (url) {
      saveAssetToStorage(`region_${regionId}`, url);
    } else {
      removeAssetFromStorage(`region_${regionId}`);
    }
  };

  const setCustomRegionTopupImage = (regionId: RegionId, url: string) => {
    setCustomRegionTopupImagesState(prev => {
      const next = { ...prev, [regionId]: url };
      try {
        const json = JSON.stringify(next);
        if (json.length < 250000) {
          safeStorage.setItem('ps_custom_region_topup_images', json);
        }
      } catch {
        // ignore
      }
      return next;
    });

    if (url) {
      saveAssetToStorage(`region_topup_${regionId}`, url);
    } else {
      removeAssetFromStorage(`region_topup_${regionId}`);
    }
  };

  const resetCustomImages = () => {
    setCustomLogoUrlState('');
    setCustomRegionImagesState({ turkey: '', india: '', poland: '', ukraine: '' });
    setCustomRegionTopupImagesState({ turkey: '', india: '', poland: '', ukraine: '' });
    safeStorage.removeItem('ps_custom_logo');
    safeStorage.removeItem('ps_custom_region_images');
    safeStorage.removeItem('ps_custom_region_topup_images');
    removeAssetFromStorage('custom_logo');
    const regions: RegionId[] = ['turkey', 'india', 'poland', 'ukraine'];
    for (const reg of regions) {
      removeAssetFromStorage(`region_${reg}`);
      removeAssetFromStorage(`region_topup_${reg}`);
    }
  };

  // Sync to safe storage
  useEffect(() => {
    safeStorage.setItem('ps_region', currentRegionId);
  }, [currentRegionId]);

  useEffect(() => {
    safeStorage.setItem('ps_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    safeStorage.setItem('ps_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    safeStorage.setItem('ps_digital_codes', JSON.stringify(digitalCodes));
  }, [digitalCodes]);

  useEffect(() => {
    if (games !== INITIAL_GAMES) {
      safeStorage.setItem('ps_games', JSON.stringify(games));
    }
  }, [games]);

  useEffect(() => {
    if (giftCards !== INITIAL_GIFT_CARDS) {
      safeStorage.setItem('ps_gift_cards', JSON.stringify(giftCards));
    }
  }, [giftCards]);

  useEffect(() => {
    if (subscriptions !== INITIAL_SUBSCRIPTIONS) {
      safeStorage.setItem('ps_subscriptions', JSON.stringify(subscriptions));
    }
  }, [subscriptions]);

  const currentRegion = REGIONS.find(r => r.id === currentRegionId) || REGIONS[0];

  const setRegion = (regionId: RegionId) => {
    setCurrentRegionId(regionId);
    triggerHaptic('light');
  };

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' = 'light') => {
    try {
      const tg = (window as unknown as { Telegram?: { WebApp?: { HapticFeedback?: { impactOccurred: (t: string) => void; notificationOccurred: (t: string) => void } } } }).Telegram?.WebApp;
      if (tg?.HapticFeedback) {
        if (type === 'success') {
          tg.HapticFeedback.notificationOccurred('success');
        } else {
          tg.HapticFeedback.impactOccurred(type);
        }
      }
    } catch {
      // Ignore if not in TMA
    }
  };

  const toggleTmaMode = () => {
    setIsTmaMode(prev => !prev);
    triggerHaptic('medium');
  };

  // Fly to Cart Animation
  const [flyingParticles, setFlyingParticles] = useState<FlyingParticle[]>([]);
  const [isCartBounced, setIsCartBounced] = useState(false);

  const triggerFlyAnimation = (
    source?: HTMLElement | { x: number; y: number } | React.MouseEvent,
    info?: { image?: string; label?: string; icon?: 'game' | 'card' | 'sub' }
  ) => {
    let startX = typeof window !== 'undefined' ? window.innerWidth / 2 : 200;
    let startY = typeof window !== 'undefined' ? window.innerHeight / 2 : 300;

    if (source) {
      if ('nativeEvent' in (source as object) || 'clientX' in (source as object)) {
        const mouseEvt = source as React.MouseEvent;
        const currentTarget = mouseEvt.currentTarget as HTMLElement | null;
        if (currentTarget && typeof currentTarget.getBoundingClientRect === 'function') {
          const rect = currentTarget.getBoundingClientRect();
          startX = rect.left + rect.width / 2;
          startY = rect.top + rect.height / 2;
        } else {
          startX = mouseEvt.clientX;
          startY = mouseEvt.clientY;
        }
      } else if ('getBoundingClientRect' in (source as object)) {
        const el = source as HTMLElement;
        const rect = el.getBoundingClientRect();
        startX = rect.left + rect.width / 2;
        startY = rect.top + rect.height / 2;
      } else if (typeof (source as { x?: number; y?: number }).x === 'number') {
        const coords = source as { x: number; y: number };
        startX = coords.x;
        startY = coords.y;
      }
    }

    let targetX = typeof window !== 'undefined' ? window.innerWidth * 0.85 : 300;
    let targetY = typeof window !== 'undefined' ? window.innerHeight - 30 : 600;

    if (typeof document !== 'undefined') {
      const targetBtn = document.getElementById('bottom-nav-cart-btn') || document.getElementById('cart-nav-target');
      if (targetBtn) {
        const rect = targetBtn.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
      }
    }

    const newParticle: FlyingParticle = {
      id: `fly-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      startX,
      startY,
      targetX,
      targetY,
      image: info?.image,
      label: info?.label,
      icon: info?.icon || 'game'
    };

    setFlyingParticles(prev => [...prev, newParticle]);

    // Schedule cart landing feedback
    setTimeout(() => {
      setIsCartBounced(true);
      triggerHaptic('success');
      setTimeout(() => {
        setIsCartBounced(false);
      }, 500);
    }, 600);

    // Auto clean particle
    setTimeout(() => {
      setFlyingParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 750);
  };

  // Cart operations
  const addToCart = (itemData: Omit<CartItem, 'id'>) => {
    triggerHaptic('light');

    // Если добавляется не карта пополнения (например, игра или подписка),
    // фактически в корзину добавляется карта/карты пополнения соответствующего номинала для данного региона!
    if (itemData.type !== 'gift_card') {
      const regId = itemData.regionId || currentRegionId;
      const reg = REGIONS.find(r => r.id === regId) || currentRegion;
      const availableCards = giftCards
        .filter(gc => gc.regionId === regId)
        .sort((a, b) => b.localAmount - a.localAmount);

      if (availableCards.length > 0) {
        // Определяем локальную сумму или ищем подходящую карту по цене
        let targetAmount = itemData.denomination || 0;
        if (!targetAmount) {
          // Если есть подписка с планом
          const plan = subscriptions.find(
            s => s.regionId === regId && itemData.duration && s.duration === itemData.duration
          );
          if (plan) {
            targetAmount = plan.localAmount;
          } else {
            // Либо подбираем номинал по стоимости в BYN
            const matchingByPrice = [...availableCards]
              .sort((a, b) => Math.abs(a.priceByn - itemData.priceByn) - Math.abs(b.priceByn - itemData.priceByn))[0];
            targetAmount = matchingByPrice ? matchingByPrice.localAmount : availableCards[availableCards.length - 1].localAmount;
          }
        }

        // Подбираем номиналы покрывающие targetAmount
        const cardCounts: Record<number, number> = {};
        availableCards.forEach(c => { cardCounts[c.localAmount] = 0; });
        let remaining = targetAmount;

        for (const card of availableCards) {
          if (remaining >= card.localAmount) {
            const count = Math.floor(remaining / card.localAmount);
            cardCounts[card.localAmount] = (cardCounts[card.localAmount] || 0) + count;
            remaining -= count * card.localAmount;
          }
        }

        if (remaining > 0) {
          const smallestCovering = [...availableCards]
            .reverse()
            .find(c => c.localAmount >= remaining);
          if (smallestCovering) {
            cardCounts[smallestCovering.localAmount] = (cardCounts[smallestCovering.localAmount] || 0) + 1;
          } else {
            const highest = availableCards[0];
            cardCounts[highest.localAmount] = (cardCounts[highest.localAmount] || 0) + 1;
          }
        }

        const itemsToAdd: Omit<CartItem, 'id'>[] = [];
        for (const card of availableCards) {
          const count = cardCounts[card.localAmount];
          if (count && count > 0) {
            itemsToAdd.push({
              type: 'gift_card',
              title: `Карта пополнения ${card.localAmount} ${reg.currencySymbol} (${itemData.title || reg.name})`,
              regionId: regId,
              denomination: card.localAmount,
              currencySymbol: reg.currencySymbol,
              priceByn: card.priceByn,
              quantity: count * (itemData.quantity || 1),
              gameTitle: itemData.gameTitle || itemData.title
            });
          }
        }

        if (itemsToAdd.length > 0) {
          itemsToAdd.forEach(it => {
            setCart(prev => {
              const existingIdx = prev.findIndex(item =>
                item.type === it.type &&
                item.regionId === it.regionId &&
                item.denomination === it.denomination
              );
              if (existingIdx >= 0) {
                const next = [...prev];
                next[existingIdx] = {
                  ...next[existingIdx],
                  quantity: next[existingIdx].quantity + it.quantity
                };
                return next;
              }
              const newItem: CartItem = {
                ...it,
                id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
              };
              return [...prev, newItem];
            });
          });
          return;
        }
      }
    }

    setCart(prev => {
      // Check if identical item already exists (same type, region, denomination, duration)
      const existingIdx = prev.findIndex(item =>
        item.type === itemData.type &&
        item.regionId === itemData.regionId &&
        item.denomination === itemData.denomination &&
        item.duration === itemData.duration
      );

      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + itemData.quantity
        };
        return next;
      }

      const newItem: CartItem = {
        ...itemData,
        id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (itemId: string) => {
    triggerHaptic('light');
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    triggerHaptic('light');
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalByn = cart.reduce((sum, item) => sum + item.priceByn * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // GAME RECOMMENDATION ALGORITHM:
  // Given a game price in local currency (e.g. 1499 TRY, or 339 PLN),
  // Find the exact or optimal combination of gift cards available for that region to cover >= target,
  // minimizing unnecessary surplus.
  const calculateGameRecommendation = (game: GameProduct, regionId?: RegionId): GameRecommendation => {
    const regId = regionId || currentRegionId;
    const reg = REGIONS.find(r => r.id === regId) || currentRegion;
    const requiredAmount = game.regionalStorePrices[regId] || 1000;

    return calculateRecommendationForAmount(requiredAmount, regId, reg, game);
  };

  const calculateCustomAmountRecommendation = (amount: number, regionId?: RegionId): GameRecommendation | null => {
    if (amount <= 0) return null;
    const regId = regionId || currentRegionId;
    const reg = REGIONS.find(r => r.id === regId) || currentRegion;
    const dummyGame: GameProduct = {
      id: 'custom-amount',
      title: `Игра в PS Store (${amount} ${reg.currencySymbol})`,
      publisher: 'PlayStation Store',
      releaseYear: 2024,
      platforms: ['PS5', 'PS4'],
      category: 'all',
      genres: ['Цифровой товар'],
      russianLocalization: 'full',
      description: `Пополнение кошелька PS Store на ${amount} ${reg.currencySymbol}`,
      accentColor: '#0070d1',
      gradient: 'from-blue-950 via-slate-900 to-black',
      iconSymbol: 'cross',
      rating: 5.0,
      regionalStorePrices: { [regId]: amount } as Record<RegionId, number>
    };

    return calculateRecommendationForAmount(amount, regId, reg, dummyGame);
  };

  const calculateRecommendationForAmount = (
    requiredAmount: number,
    regId: RegionId,
    reg: Region,
    game: GameProduct
  ): GameRecommendation => {
    // Get available denominations for this region sorted descending
    const availableCards = giftCards
      .filter(gc => gc.regionId === regId)
      .sort((a, b) => b.localAmount - a.localAmount);

    if (availableCards.length === 0) {
      return {
        game,
        requiredAmount,
        currencySymbol: reg.currencySymbol,
        currencyCode: reg.currencyCode,
        recommendedCards: [],
        totalWalletLoaded: 0,
        surplusAmount: 0,
        totalByn: 0
      };
    }

    // Greedy + exact fit solver for denominations
    const cardCounts: Record<number, number> = {};
    availableCards.forEach(c => { cardCounts[c.localAmount] = 0; });

    let remaining = requiredAmount;

    // Step 1: Use larger denominations while remaining >= denomination
    for (const card of availableCards) {
      if (remaining >= card.localAmount) {
        const count = Math.floor(remaining / card.localAmount);
        cardCounts[card.localAmount] = (cardCounts[card.localAmount] || 0) + count;
        remaining -= count * card.localAmount;
      }
    }

    // Step 2: If there's still a remainder, find the smallest denomination that covers it
    if (remaining > 0) {
      const smallestCovering = [...availableCards]
        .reverse()
        .find(c => c.localAmount >= remaining);

      if (smallestCovering) {
        cardCounts[smallestCovering.localAmount] = (cardCounts[smallestCovering.localAmount] || 0) + 1;
      } else {
        // Fallback to highest card
        const highest = availableCards[0];
        cardCounts[highest.localAmount] = (cardCounts[highest.localAmount] || 0) + 1;
      }
    }

    const recommendedCards: GameRecommendation['recommendedCards'] = [];
    let totalWalletLoaded = 0;
    let totalByn = 0;

    for (const card of availableCards) {
      const count = cardCounts[card.localAmount];
      if (count && count > 0) {
        const subtotalByn = count * card.priceByn;
        totalWalletLoaded += count * card.localAmount;
        totalByn += subtotalByn;
        recommendedCards.push({
          denomination: card.localAmount,
          count,
          priceBynPerCard: card.priceByn,
          subtotalByn
        });
      }
    }

    const surplusAmount = Math.max(0, totalWalletLoaded - requiredAmount);

    return {
      game,
      requiredAmount,
      currencySymbol: reg.currencySymbol,
      currencyCode: reg.currencyCode,
      recommendedCards,
      totalWalletLoaded,
      surplusAmount,
      totalByn: Math.round(totalByn * 100) / 100
    };
  };

  const addGameRecommendationToCart = (rec: GameRecommendation) => {
    rec.recommendedCards.forEach(card => {
      addToCart({
        type: 'gift_card',
        title: `Карта пополнения PS Store ${card.denomination} ${rec.currencySymbol} (${rec.game.title})`,
        regionId: currentRegionId,
        denomination: card.denomination,
        currencySymbol: rec.currencySymbol,
        priceByn: card.priceBynPerCard,
        quantity: card.count,
        gameTitle: rec.game.title
      });
    });
  };

  // Orders flow
  const createOrder = (orderData: {
    customerName: string;
    telegramUsername: string;
    phone: string;
    email?: string;
    paymentMethod: PaymentMethod;
    receiptNote?: string;
    paymentReference?: string;
  }): Order => {
    const orderNumber = `PS-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt,
      customerName: orderData.customerName,
      telegramUsername: orderData.telegramUsername.startsWith('@') ? orderData.telegramUsername : `@${orderData.telegramUsername}`,
      phone: orderData.phone,
      email: orderData.email,
      items: [...cart],
      totalByn: cartTotalByn,
      regionId: currentRegionId,
      paymentMethod: orderData.paymentMethod,
      paymentReference: orderData.paymentReference || `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      receiptNote: orderData.receiptNote,
      status: 'verifying', // Pending admin payment confirmation
      issuedCodes: []
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setLastCompletedOrder(newOrder);
    triggerHaptic('success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], adminNotes?: string) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;

        let issuedCodes = [...order.issuedCodes];

        // When order moves to 'completed', automatically claim available codes if none assigned
        if (status === 'completed' && issuedCodes.length === 0) {
          order.items.forEach(item => {
            for (let i = 0; i < item.quantity; i++) {
              // Find matching available code in pool
              const match = digitalCodes.find(
                c => c.status === 'available' &&
                     c.regionId === item.regionId &&
                     (item.denomination ? c.denomination === item.denomination : true)
              );

              if (match) {
                // Reserve / issue
                match.status = 'issued';
                match.orderId = order.id;
                match.issuedAt = new Date().toISOString();
                issuedCodes.push({
                  itemTitle: item.title,
                  code: match.code,
                  denomination: item.denomination,
                  currencySymbol: item.currencySymbol
                });
              } else {
                // Generate a fresh authentic 12-char PS key if pool depleted
                const dummyKey = `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
                issuedCodes.push({
                  itemTitle: item.title,
                  code: dummyKey,
                  denomination: item.denomination,
                  currencySymbol: item.currencySymbol
                });
              }
            }
          });
        }

        return {
          ...order,
          status,
          adminNotes: adminNotes !== undefined ? adminNotes : order.adminNotes,
          issuedCodes
        };
      })
    );
  };

  const manualIssueCode = (orderId: string, codeString: string, itemTitle: string) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          status: 'completed',
          issuedCodes: [
            ...order.issuedCodes,
            {
              itemTitle,
              code: codeString.trim()
            }
          ]
        };
      })
    );
  };

  // Digital Codes Inventory
  const addDigitalCode = (codeData: Omit<DigitalCode, 'id' | 'createdAt'>) => {
    const newCode: DigitalCode = {
      ...codeData,
      id: `code-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setDigitalCodes(prev => [newCode, ...prev]);
  };

  const addBatchCodes = (
    lines: string[],
    regionId: RegionId,
    denomination: number,
    productType: 'gift_card' | 'subscription',
    title: string
  ): number => {
    const cleaned = lines.map(l => l.trim()).filter(l => l.length >= 6);
    const newCodes: DigitalCode[] = cleaned.map((codeStr, idx) => ({
      id: `code-batch-${Date.now()}-${idx}`,
      code: codeStr.toUpperCase(),
      regionId,
      denomination,
      productType,
      title,
      status: 'available',
      createdAt: new Date().toISOString().split('T')[0]
    }));

    setDigitalCodes(prev => [...newCodes, ...prev]);
    return newCodes.length;
  };

  const deleteDigitalCode = (codeId: string) => {
    setDigitalCodes(prev => prev.filter(c => c.id !== codeId));
  };

  // User auth simulation
  const loginWithTelegram = (username: string, name?: string) => {
    const formatted = username.startsWith('@') ? username : `@${username}`;
    const user: UserProfile = {
      id: `tg-${username.replace(/[^a-zA-Z0-9]/g, '')}`,
      telegramUsername: formatted,
      name: name || formatted.replace('@', ''),
      savedRegion: currentRegionId,
      isAuthenticated: true
    };
    setCurrentUser(user);
    safeStorage.setItem('ps_user', JSON.stringify(user));
  };

  const logout = () => {
    const guest: UserProfile = {
      id: 'user-guest',
      telegramUsername: '',
      name: 'Гость',
      savedRegion: currentRegionId,
      isAuthenticated: false
    };
    setCurrentUser(guest);
    safeStorage.setItem('ps_user', JSON.stringify(guest));
  };

  // Price updates
  const updateGamePrice = (gameId: string, regionId: RegionId, newPrice: number) => {
    setGames(prev =>
      prev.map(g => {
        if (g.id !== gameId) return g;
        return {
          ...g,
          regionalStorePrices: {
            ...g.regionalStorePrices,
            [regionId]: newPrice
          }
        };
      })
    );
  };

  const updateGiftCardPrice = (cardId: string, newPriceByn: number) => {
    setGiftCards(prev => {
      const next = prev.map(c => (c.id === cardId ? { ...c, priceByn: newPriceByn } : c));
      safeStorage.setItem('ps_gift_cards', JSON.stringify(next));
      return next;
    });
  };

  const updateGiftCardImage = (cardId: string, imageUrl: string) => {
    setGiftCards(prev => {
      const next = prev.map(c => (c.id === cardId ? { ...c, imageUrl } : c));
      try {
        const json = JSON.stringify(next);
        if (json.length < 350000) {
          safeStorage.setItem('ps_gift_cards', json);
        }
      } catch {
        // quota safety
      }
      return next;
    });

    if (imageUrl) {
      saveAssetToStorage(`giftcard_${cardId}`, imageUrl);
    } else {
      removeAssetFromStorage(`giftcard_${cardId}`);
    }
  };

  const updateSubscriptionPrice = (subId: string, newPriceByn: number) => {
    setSubscriptions(prev =>
      prev.map(s => (s.id === subId ? { ...s, priceByn: newPriceByn } : s))
    );
  };

  const addProduct = (productData: Omit<GameProduct, 'id'>): GameProduct => {
    const newProduct: GameProduct = {
      ...productData,
      id: `game-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    };
    setGames(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (productId: string, updated: Partial<GameProduct>) => {
    setGames(prev =>
      prev.map(g => (g.id === productId ? { ...g, ...updated } : g))
    );
  };

  const deleteProduct = (productId: string) => {
    setGames(prev => prev.filter(g => g.id !== productId));
  };

  const toggleGameCategory = (gameId: string, category: CatalogCategory) => {
    setGames(prev =>
      prev.map(g => (g.id === gameId ? { ...g, category } : g))
    );
  };

  // Modal open/close
  const openGameModal = (game: GameProduct) => {
    setSelectedGame(game);
  };
  const closeGameModal = () => setSelectedGame(null);

  const openCart = () => {
    setActiveTab('cart');
    setIsCartOpen(false);
  };
  const closeCart = () => setIsCartOpen(false);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const openAccount = () => setIsAccountOpen(true);
  const closeAccount = () => setIsAccountOpen(false);

  const openAdmin = () => setIsAdminOpen(true);
  const closeAdmin = () => setIsAdminOpen(false);

  const openGuides = () => setIsGuidesOpen(true);
  const closeGuides = () => setIsGuidesOpen(false);

  return (
    <StoreContext.Provider
      value={{
        currentRegion,
        setRegion,
        regions: REGIONS,
        isRegionConfirmed,
        isRegionModalOpen,
        openRegionModal,
        confirmRegionSelection,
        activeScreen,
        setActiveScreen,
        favorites,
        toggleFavorite,
        isFavorite,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        selectedPlatform,
        setSelectedPlatform,
        games,
        giftCards,
        subscriptions,
        addProduct,
        updateProduct,
        deleteProduct,
        updateGamePrice,
        updateGiftCardPrice,
        updateGiftCardImage,
        updateSubscriptionPrice,
        toggleGameCategory,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotalByn,
        cartItemsCount,
        calculateGameRecommendation,
        calculateCustomAmountRecommendation,
        addGameRecommendationToCart,
        orders,
        createOrder,
        updateOrderStatus,
        manualIssueCode,
        digitalCodes,
        addDigitalCode,
        addBatchCodes,
        deleteDigitalCode,
        currentUser,
        loginWithTelegram,
        logout,
        isTmaMode,
        toggleTmaMode,
        triggerHaptic,
        selectedGame,
        openGameModal,
        closeGameModal,
        isCartOpen,
        openCart,
        closeCart,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        isAccountOpen,
        openAccount,
        closeAccount,
        isAdminOpen,
        openAdmin,
        closeAdmin,
        isGuidesOpen,
        openGuides,
        closeGuides,
        lastCompletedOrder,
        setLastCompletedOrder,
        activeTab,
        setActiveTab,
        flyingParticles,
        triggerFlyAnimation,
        isCartBounced,
        customLogoUrl,
        customRegionImages,
        customRegionTopupImages,
        setCustomLogoUrl,
        setCustomRegionImage,
        setCustomRegionTopupImage,
        resetCustomImages
      }}
    >
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
