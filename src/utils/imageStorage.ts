/**
 * Image storage & compression utility using IndexedDB and Canvas resizing.
 * Prevents QuotaExceededError by compressing images to ~50-100KB and storing
 * large assets in IndexedDB which has virtually unlimited quota compared to localStorage.
 */

import { safeStorage } from './safeStorage';

const DB_NAME = 'PSN_ASSETS_CACHE';
const STORE_NAME = 'user_assets';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.warn('[ImageStorage] IndexedDB failed to open, falling back to safeStorage');
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

/**
 * Resizes and compresses an image to max dimension & high quality JPEG/WebP.
 * Turns 5-10MB mobile uploads into ~40-80KB assets.
 */
export async function compressImage(
  input: File | string,
  maxDimension = 1200,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's already a short URL (not a base64 string), return as is
    if (typeof input === 'string' && !input.startsWith('data:')) {
      resolve(input);
      return;
    }

    const img = new Image();

    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          // If no context, fallback
          resolve(typeof input === 'string' ? input : '');
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG (or webp if supported)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } catch (err) {
        console.warn('[ImageStorage] Canvas compression error:', err);
        resolve(typeof input === 'string' ? input : '');
      }
    };

    img.onerror = () => {
      if (typeof input === 'string') {
        resolve(input);
      } else {
        reject(new Error('Failed to load image for compression'));
      }
    };

    if (typeof input === 'string') {
      img.src = input;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('FileReader error'));
      reader.readAsDataURL(input);
    }
  });
}

/**
 * Save an asset (logo, region card, etc.) to IndexedDB and safeStorage.
 */
export async function saveAssetToStorage(key: string, dataUrl: string): Promise<void> {
  // Always try IndexedDB first
  const db = await openDB();
  if (db) {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(dataUrl, key);
    } catch (err) {
      console.warn('[ImageStorage] IndexedDB write error:', err);
    }
  }

  // Also store in safeStorage if reasonably small (< 300KB)
  if (dataUrl.length < 300000) {
    safeStorage.setItem(`asset_${key}`, dataUrl);
  } else {
    // Too large for safeStorage, remove if previously existed
    safeStorage.removeItem(`asset_${key}`);
  }
}

/**
 * Load an asset from storage.
 */
export async function getAssetFromStorage(key: string): Promise<string | null> {
  const db = await openDB();
  if (db) {
    try {
      return await new Promise<string | null>((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => {
          resolve((req.result as string) || null);
        };
        req.onerror = () => {
          resolve(null);
        };
      });
    } catch {
      // fallback
    }
  }

  // Fallback to safeStorage
  return safeStorage.getItem(`asset_${key}`);
}

/**
 * Remove an asset from storage.
 */
export async function removeAssetFromStorage(key: string): Promise<void> {
  const db = await openDB();
  if (db) {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(key);
    } catch {
      // ignore
    }
  }
  safeStorage.removeItem(`asset_${key}`);
}
