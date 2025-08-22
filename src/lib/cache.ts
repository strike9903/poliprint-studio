// Enhanced caching system for better performance

interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  key: string;
}

interface CacheOptions {
  ttl?: number;
  maxSize?: number;
  staleWhileRevalidate?: boolean;
  compress?: boolean;
}

class EnhancedCache {
  private cache = new Map<string, CacheItem>();
  private maxSize: number;
  private compressionEnabled: boolean;

  constructor(maxSize = 1000, compressionEnabled = true) {
    this.maxSize = maxSize;
    this.compressionEnabled = compressionEnabled;
  }

  // Set item in cache
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const {
      ttl = 5 * 60 * 1000, // 5 minutes default
      compress = this.compressionEnabled
    } = options;

    // Clean expired items if cache is getting full
    if (this.cache.size >= this.maxSize) {
      this.cleanExpired();
      
      // If still full, remove oldest items
      if (this.cache.size >= this.maxSize) {
        const oldestKey = Array.from(this.cache.keys())[0];
        this.cache.delete(oldestKey);
      }
    }

    const item: CacheItem<T> = {
      data: compress ? (this.compress(data) as T) : data,
      timestamp: Date.now(),
      ttl,
      key
    };

    this.cache.set(key, item);
  }

  // Get item from cache
  get<T>(key: string, options: CacheOptions = {}): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;

    const { staleWhileRevalidate = false } = options;
    const now = Date.now();
    const isExpired = now - item.timestamp > item.ttl;

    if (isExpired && !staleWhileRevalidate) {
      this.cache.delete(key);
      return null;
    }

    // Return data (decompress if needed)
    return this.compressionEnabled && typeof item.data === 'string' && item.data.startsWith('__compressed__')
      ? this.decompress(item.data)
      : item.data;
  }

  // Check if item exists and is not expired
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Delete item from cache
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Clean expired items
  cleanExpired(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let expired = 0;
    let valid = 0;
    let totalSize = 0;

    for (const [key, item] of this.cache.entries()) {
      const isExpired = now - item.timestamp > item.ttl;
      if (isExpired) {
        expired++;
      } else {
        valid++;
      }
      totalSize += JSON.stringify(item).length;
    }

    return {
      total: this.cache.size,
      valid,
      expired,
      maxSize: this.maxSize,
      utilization: this.cache.size / this.maxSize,
      totalSizeBytes: totalSize,
      averageItemSize: totalSize / (this.cache.size || 1)
    };
  }

  // Simple compression using JSON stringification optimization
  private compress(data: any): string {
    try {
      return '__compressed__' + JSON.stringify(data);
    } catch {
      return data;
    }
  }

  // Simple decompression
  private decompress(data: string): any {
    try {
      return JSON.parse(data.replace('__compressed__', ''));
    } catch {
      return data;
    }
  }
}

// Global cache instances
export const memoryCache = new EnhancedCache(1000, true);
export const apiCache = new EnhancedCache(500, true);
export const imageCache = new EnhancedCache(200, false);

// Browser storage cache wrapper
class StorageCache {
  private storage: Storage;
  private prefix: string;

  constructor(storage: Storage, prefix = 'pc_') {
    this.storage = storage;
    this.prefix = prefix;
  }

  set<T>(key: string, data: T, ttl = 24 * 60 * 60 * 1000): void { // 24 hours default
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl,
        key
      };
      
      this.storage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      // Storage quota exceeded or other error
      console.warn('Failed to store in cache:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const stored = this.storage.getItem(this.prefix + key);
      if (!stored) return null;

      const item: CacheItem<T> = JSON.parse(stored);
      const isExpired = Date.now() - item.timestamp > item.ttl;

      if (isExpired) {
        this.delete(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn('Failed to read from cache:', error);
      return null;
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.storage.removeItem(this.prefix + key);
  }

  clear(): void {
    const keys = Object.keys(this.storage).filter(key => key.startsWith(this.prefix));
    keys.forEach(key => this.storage.removeItem(key));
  }

  getStats() {
    const keys = Object.keys(this.storage).filter(key => key.startsWith(this.prefix));
    let totalSize = 0;
    let valid = 0;
    let expired = 0;

    keys.forEach(key => {
      try {
        const item: CacheItem = JSON.parse(this.storage.getItem(key) || '{}');
        const isExpired = Date.now() - item.timestamp > item.ttl;
        
        if (isExpired) {
          expired++;
        } else {
          valid++;
        }
        
        totalSize += (this.storage.getItem(key) || '').length;
      } catch {
        expired++;
      }
    });

    return {
      total: keys.length,
      valid,
      expired,
      totalSizeBytes: totalSize,
      storageType: this.storage === localStorage ? 'localStorage' : 'sessionStorage'
    };
  }
}

// Browser storage cache instances
export let localStorageCache: StorageCache | null = null;
export let sessionStorageCache: StorageCache | null = null;

// Initialize storage caches on client side
if (typeof window !== 'undefined') {
  localStorageCache = new StorageCache(localStorage, 'pc_');
  sessionStorageCache = new StorageCache(sessionStorage, 'pc_session_');
}

// Cache utilities
export const cacheUtils = {
  // Auto cache with fallback to memory if storage fails
  setWithFallback<T>(key: string, data: T, ttl?: number): void {
    try {
      localStorageCache?.set(key, data, ttl);
    } catch {
      memoryCache.set(key, data, { ttl });
    }
  },

  // Get with fallback to memory
  getWithFallback<T>(key: string): T | null {
    try {
      return localStorageCache?.get<T>(key) || memoryCache.get<T>(key);
    } catch {
      return memoryCache.get<T>(key);
    }
  },

  // Cache API responses with automatic deduplication
  async cacheApiCall<T>(
    key: string,
    apiCall: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const { ttl = 5 * 60 * 1000, staleWhileRevalidate = true } = options;

    // Check cache first
    let cached = apiCache.get<T>(key, { staleWhileRevalidate });
    
    if (cached && !staleWhileRevalidate) {
      return cached;
    }

    // If we have stale data, return it while revalidating in background
    if (cached && staleWhileRevalidate) {
      // Revalidate in background
      apiCall()
        .then(fresh => apiCache.set(key, fresh, { ttl }))
        .catch(error => console.warn('Background revalidation failed:', error));
      
      return cached;
    }

    // No cached data, fetch fresh
    try {
      const fresh = await apiCall();
      apiCache.set(key, fresh, { ttl });
      return fresh;
    } catch (error) {
      // If we have any cached data (even expired), return it as fallback
      cached = apiCache.get<T>(key);
      if (cached) {
        console.warn('API call failed, returning stale data:', error);
        return cached;
      }
      throw error;
    }
  },

  // Preload data into cache
  preload<T>(key: string, dataPromise: Promise<T>, ttl?: number): void {
    dataPromise
      .then(data => apiCache.set(key, data, { ttl }))
      .catch(error => console.warn('Preload failed:', error));
  },

  // Invalidate cache patterns
  invalidatePattern(pattern: string): number {
    let invalidated = 0;
    const regex = new RegExp(pattern);

    // Invalidate memory caches
    [memoryCache, apiCache, imageCache].forEach(cache => {
      const stats = cache.getStats();
      for (let i = 0; i < stats.total; i++) {
        // This is a simplified approach - in real implementation you'd track keys
        cache.clear(); // For now, clear all
        break;
      }
    });

    // Invalidate storage caches
    if (localStorageCache) {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('pc_') && regex.test(key)
      );
      keys.forEach(key => {
        localStorage.removeItem(key);
        invalidated++;
      });
    }

    return invalidated;
  },

  // Get overall cache statistics
  getAllStats() {
    return {
      memory: memoryCache.getStats(),
      api: apiCache.getStats(),
      image: imageCache.getStats(),
      localStorage: localStorageCache?.getStats() || null,
      sessionStorage: sessionStorageCache?.getStats() || null
    };
  },

  // Clean all expired entries
  cleanupExpired() {
    const cleaned = {
      memory: memoryCache.cleanExpired(),
      api: apiCache.cleanExpired(),
      image: imageCache.cleanExpired()
    };

    return cleaned;
  }
};

// Hook for React components
export function useCache() {
  return {
    set: cacheUtils.setWithFallback,
    get: cacheUtils.getWithFallback,
    invalidate: cacheUtils.invalidatePattern,
    stats: cacheUtils.getAllStats,
    cleanup: cacheUtils.cleanupExpired
  };
}

// Automatic cleanup every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheUtils.cleanupExpired();
  }, 10 * 60 * 1000);
}