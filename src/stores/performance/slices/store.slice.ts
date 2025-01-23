import { PerformanceMetrics, PerformanceSlice } from '../types';
import { updateStoreMetrics } from '../utils';

export interface StoreSlice {
  storeMetrics: PerformanceMetrics['storeMetrics'];
  recordStoreUpdate: (storeName: string, duration: number) => void;
  resetStoreMetrics: () => void;
}

export const createStoreSlice: PerformanceSlice<StoreSlice> = (set, get, store) => ({
  storeMetrics: {
    updates: 0,
    subscribers: new Map(),
    computeTime: 0,
    lastUpdateTimestamp: 0,
  },

  recordStoreUpdate: (storeName: string, duration: number) => {
    set((state) => {
      const { storeMetrics } = state.metrics;
      const currentSubscribers = storeMetrics.subscribers.get(storeName) || 0;
      const newSubscribers = new Map(storeMetrics.subscribers);
      newSubscribers.set(storeName, currentSubscribers + 1);

      const updatedMetrics = updateStoreMetrics(storeMetrics, duration);

      return {
        metrics: {
          ...state.metrics,
          storeMetrics: {
            ...updatedMetrics,
            subscribers: newSubscribers,
          },
        },
      };
    });
  },

  resetStoreMetrics: () => set((state) => ({
    metrics: {
      ...state.metrics,
      storeMetrics: {
        updates: 0,
        subscribers: new Map(),
        computeTime: 0,
        lastUpdateTimestamp: 0,
      },
    },
  })),
});