export type RegionId = 'turkey' | 'poland' | 'india' | 'ukraine';

export interface Region {
  id: RegionId;
  name: string;
  countryName: string;
  flag: string;
  currencyCode: string; // TRY, PLN, INR, UAH
  currencySymbol: string;
  description: string;
  popular: boolean;
  rateNote: string;
}

export type CatalogCategory = 'all' | 'favorites' | 'new' | 'preorder' | 'bestsellers' | 'deals';

export interface GameProduct {
  id: string;
  title: string;
  publisher: string;
  releaseYear: number;
  platforms: ('PS5' | 'PS4')[];
  category: CatalogCategory;
  genres: string[];
  russianLocalization: 'full' | 'subtitles' | 'none'; // Полный дубляж, субтитры или без русского
  description: string;
  accentColor: string;
  gradient: string;
  iconSymbol: 'cross' | 'circle' | 'triangle' | 'square';
  // Prices in local store currencies for each region
  regionalStorePrices: Record<RegionId, number>;
  originalPriceDiscount?: Record<RegionId, number>; // optional sale
  rating: number;
  featured?: boolean;
  imageUrl?: string; // Обложка или постер игры (URL или base64)
  videoTrailerUrl?: string; // Ссылка на трейлер (YouTube и др.)
  screenshots?: string[]; // Галерея скриншотов (URL или base64)
}

export interface GiftCardDenomination {
  id: string;
  regionId: RegionId;
  localAmount: number; // e.g. 500 TRY or 100 PLN
  priceByn: number; // e.g. 48.00 BYN
  inStock: boolean;
  codesAvailableCount: number;
  imageUrl?: string; // Опциональная фоновая картинка плиточки
}

export type PlusTier = 'essential' | 'extra' | 'deluxe';
export type SubscriptionDuration = '1m' | '3m' | '12m';

export interface SubscriptionPlan {
  id: string;
  tier: PlusTier;
  tierName: string;
  duration: SubscriptionDuration;
  durationLabel: string;
  regionId: RegionId;
  localAmount: number;
  priceByn: number;
  features: string[];
  popular?: boolean;
}

export interface CartItem {
  id: string; // unique item id
  type: 'gift_card' | 'subscription' | 'game_bundle';
  title: string;
  regionId: RegionId;
  denomination?: number;
  currencySymbol?: string;
  duration?: string;
  priceByn: number;
  quantity: number;
  gameTitle?: string; // If added via game recommendation
}

export type PaymentMethod = 'erip' | 'oplati' | 'card_belarus' | 'sbp_crypto';

export type OrderStatus = 'pending_payment' | 'verifying' | 'completed' | 'cancelled';

export interface DigitalCode {
  id: string;
  code: string; // e.g. "4TR8-9L2M-7QX1"
  regionId: RegionId;
  productType: 'gift_card' | 'subscription';
  denomination: number; // e.g. 500 (TRY) or 100 (PLN)
  title: string;
  status: 'available' | 'reserved' | 'issued';
  orderId?: string;
  createdAt: string;
  issuedAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "PS-84920"
  createdAt: string;
  customerName: string;
  telegramUsername: string;
  phone: string;
  email?: string;
  items: CartItem[];
  totalByn: number;
  regionId: RegionId;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  receiptNote?: string;
  status: OrderStatus;
  issuedCodes: {
    itemTitle: string;
    code: string;
    denomination?: number;
    currencySymbol?: string;
  }[];
  adminNotes?: string;
}

export interface UserProfile {
  id: string;
  telegramUsername: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  savedRegion: RegionId;
  isAuthenticated: boolean;
}
