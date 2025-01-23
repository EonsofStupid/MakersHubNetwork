import { PerformanceMetrics } from '../types';
import { updateStoreMetrics } from '../utils';

export interface StoreSlice {
  storeMetrics: PerformanceMetrics['storeMetrics'];
  recordStoreUpdate: (storeName: string, duration: number) => void;
  resetStoreMetrics: () => void;
}

export const createStoreSlice = (set: any, get: any): StoreSlice => ({
  storeMetrics: {
    updates: 0,
    subscribers: new Map(),
    computeTime: 0,
    lastUpdateTimestamp: 0,
  },

  recordStoreUpdate: (storeName: string, duration: number) => {
    set((state: any) => {
      const { storeMetrics } = state;
      const currentSubscribers = storeMetrics.subscribers.get(storeName) || 0;
      const newSubscribers = new Map(storeMetrics.subscribers);
      newSubscribers.set(storeName, currentSubscribers + 1);

      const updatedMetrics = updateStoreMetrics(storeMetrics, duration);

      return {
        storeMetrics: {
          ...updatedMetrics,
          subscribers: newSubscribers,
        },
      };
    });
  },

  resetStoreMetrics: () => set((state: any) => ({
    storeMetrics: {
      updates: 0,
      subscribers: new Map(),
      computeTime: 0,
      lastUpdateTimestamp: 0,
    },
  })),
});