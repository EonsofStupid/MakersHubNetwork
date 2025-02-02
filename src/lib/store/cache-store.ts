import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number;
}

interface CacheState {
  cache: Record<string, CacheItem>;
  setCache: (key: string, value: any, ttl?: number) => void;
  getCache: (key: string) => any;
  clearCache: () => void;
  removeFromCache: (key: string) => void;
  pruneExpiredCache: () => void;
}

export const useCacheStore = create<CacheState>()(
  persist(
    (set, get) => ({
      cache: {},
      setCache: (key, value, ttl = 5 * 60 * 1000) => {
        console.log(`Setting cache for ${key} with TTL ${ttl}ms`);
        set((state) => ({ 
          cache: { 
            ...state.cache, 
            [key]: { 
              data: value, 
              timestamp: Date.now(),
              ttl 
            } 
          }
        }));
      },
      getCache: (key) => {
        const state = get();
        const cached = state.cache[key];
        
        if (!cached) {
          console.log(`Cache miss for ${key}`);
          return null;
        }
        
        const isExpired = Date.now() - cached.timestamp > cached.ttl;
        if (isExpired) {
          console.log(`Cache expired for ${key}`);
          get().removeFromCache(key);
          return null;
        }
        
        console.log(`Cache hit for ${key}`);
        return cached.data;
      },
      clearCache: () => {
        console.log('Clearing entire cache');
        set({ cache: {} });
      },
      removeFromCache: (key) => {
        console.log(`Removing ${key} from cache`);
        set((state) => {
          const newCache = { ...state.cache };
          delete newCache[key];
          return { cache: newCache };
        });
      },
      pruneExpiredCache: () => {
        console.log('Pruning expired cache entries');
        set((state) => {
          const newCache = { ...state.cache };
          Object.entries(newCache).forEach(([key, item]) => {
            if (Date.now() - item.timestamp > item.ttl) {
              delete newCache[key];
            }
          });
          return { cache: newCache };
        });
      },
    }),
    {
      name: 'cache-storage',
      partialize: (state) => ({ cache: state.cache }),
    }
  )
);

// Set up automatic cache pruning
if (typeof window !== 'undefined') {
  setInterval(() => {
    useCacheStore.getState().pruneExpiredCache();
  }, 60000); // Prune every minute
}