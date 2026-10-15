/**
 * Safe LocalStorage wrapper with QuotaExceededError handling and in-memory fallback.
 * Prevents application crashes when localStorage quota is exceeded or storage is unavailable.
 */

const memoryFallback = new Map<string, string>();

// Clean up oversized keys that might be clogging localStorage from previous quota errors
export const cleanOversizedStorage = () => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    // If localStorage has heavy items from older builds, remove them safely
    const heavyKeys = ['ps_custom_region_images', 'ps_custom_logo', 'ps_games', 'ps_subscriptions'];
    for (const key of heavyKeys) {
      const val = window.localStorage.getItem(key);
      if (val && val.length > 500000) { // > 500 KB
        console.warn(`[SafeStorage] Removing oversized key to free quota: ${key} (${Math.round(val.length / 1024)} KB)`);
        window.localStorage.removeItem(key);
      }
    }
  } catch (err) {
    console.warn('[SafeStorage] Could not inspect localStorage:', err);
  }
};

// Run cleanup immediately on load
cleanOversizedStorage();

export const safeStorage = {
  getItem(key: string): string | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return memoryFallback.get(key) || null;
    }
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memoryFallback.get(key) || null;
    }
  },

  setItem(key: string, value: string): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      memoryFallback.set(key, value);
      return true;
    }

    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (err: unknown) {
      const isQuotaError =
        err instanceof DOMException &&
        (err.code === 22 ||
          err.code === 1014 ||
          err.name === 'QuotaExceededError' ||
          err.name === 'NS_ERROR_DOM_QUOTA_REACHED');

      console.warn(`[SafeStorage] Failed to set "${key}" in localStorage (quota: ${isQuotaError}):`, err);

      if (isQuotaError) {
        // Try purging non-essential cache
        try {
          window.localStorage.removeItem('ps_games');
          window.localStorage.removeItem('ps_subscriptions');
          window.localStorage.removeItem('ps_gift_cards');
          window.localStorage.removeItem('ps_digital_codes');

          // Retry once
          window.localStorage.setItem(key, value);
          return true;
        } catch {
          // If still failing, store in memory fallback
          memoryFallback.set(key, value);
          return false;
        }
      }

      memoryFallback.set(key, value);
      return false;
    }
  },

  removeItem(key: string): void {
    memoryFallback.delete(key);
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },

  clearNonEssential(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const preserveKeys = ['ps_region', 'ps_user', 'ps_cart', 'ps_orders', 'ps_favorites'];
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && !preserveKeys.includes(k)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => window.localStorage.removeItem(k));
    } catch {
      // ignore
    }
  }
};
