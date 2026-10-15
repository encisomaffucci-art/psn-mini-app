const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface InitData {
  initData: string;
  user: any;
}

let initDataCache: InitData | null = null;

export function setInitData(initData: string, user: any) {
  initDataCache = { initData, user };
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (initDataCache) {
    headers['X-Telegram-Init-Data'] = initDataCache.initData;
  }
  return headers;
}

async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  
  return res.json();
}

// Catalog
export interface GameEdition {
  name: string;
  prices: Record<string, number>;
  oldPrices?: Record<string, number>;
}

export interface Game {
  id: string;
  title: string;
  publisher: string;
  platforms: string[];
  ruLocalization: string;
  coverUrl: string;
  heroUrl?: string;
  discount: number;
  shelfTags: string[];
  editions: GameEdition[];
  isAutoSynced: boolean;
  price?: number;
  oldPrice?: number;
  formattedPrice?: string;
}

export async function fetchCatalog(params: { shelf?: string; region?: string } = {}): Promise<Game[]> {
  const query = new URLSearchParams();
  if (params.shelf) query.set('shelf', params.shelf);
  if (params.region) query.set('region', params.region);
  return fetchApi<Game[]>(`/api/catalog?${query.toString()}`);
}

export async function fetchGame(id: string, region: string): Promise<Game> {
  return fetchApi<Game>(`/api/catalog/${id}?region=${region}`);
}

export interface RegionConfig {
  code: string;
  name: string;
  flag: string;
  symbol: string;
  currencyCode: string;
  rateToBYN: number;
  denominations: { val: number; active: boolean }[];
}

export async function fetchRegions(): Promise<RegionConfig[]> {
  return fetchApi<RegionConfig[]>('/api/regions');
}

export interface CheckoutCalculation {
  storeSum: number;
  totalFaceValue: number;
  remainder: number;
  totalFiat: number;
  currency: string;
  region: string;
  giftCards: Record<number, number>;
  items: any[];
}

export async function calculateCheckout(data: {
  items: { gameId: string; editionName: string }[];
  region: string;
  currency: string;
}): Promise<CheckoutCalculation> {
  return fetchApi<CheckoutCalculation>('/api/checkout/calculate', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface OrderResponse {
  orderId: string;
}

export async function createOrder(data: {
  user: { id: string; username?: string; first_name?: string };
  items: any[];
  currency: string;
  region: string;
  paymentMethod: string;
  giftCards: Record<number, number>;
  totalStore: number;
  totalFiat: number;
  remainder: number;
}): Promise<OrderResponse> {
  return fetchApi<OrderResponse>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function uploadReceipt(orderId: string, file: File): Promise<{ ok: boolean }> {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${API_URL}/api/orders/${orderId}/receipt`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(error.error || 'Upload failed');
  }
  
  return res.json();
}