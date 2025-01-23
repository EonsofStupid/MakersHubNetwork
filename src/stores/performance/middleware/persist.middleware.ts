import { PerformanceState } from '../types';

export const createPersistMiddleware = () => ({
  name: 'performance-store',
  partialize: (state: PerformanceState) => ({
    thresholds: state.thresholds,
  }),
});