import { PersistOptions } from 'zustand/middleware';
import { PerformanceStore } from './types';

export const createPersistMiddleware = (): PersistOptions<
  PerformanceStore,
  PerformanceStore
> => ({
  name: 'performance-store',
  partialize: (state) => state
});