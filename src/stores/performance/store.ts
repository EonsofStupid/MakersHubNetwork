import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PerformanceStore, PerformanceThresholds } from './types';

const initialState = {
  metrics: {
    frameMetrics: {
      drops: 0,
      averageTime: 0,
      peaks: [],
      lastTimestamp: 0
    },
    storeMetrics: {
      updates: 0,
      subscribers: new Map(),
      computeTime: 0,
      lastTimestamp: 0,
      lastUpdateTimestamp: 0,
      averageTime: 0
    },
    memoryMetrics: {
      heapSize: 0,
      instances: 0,
      lastGC: undefined,
      averageTime: 0,
      lastTimestamp: 0
    }
  },
  thresholds: {
    frameDrop: 16.67,
    storeUpdate: 4,
    animationFrame: 8,
    batchSize: 50
  },
  isMonitoring: false
};

export const usePerformanceStore = create<PerformanceStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      startMonitoring: () => {
        set({ isMonitoring: true });
        const rafCallback = () => {
          if (!get().isMonitoring) return;
          const now = performance.now();
          const lastFrame = get().metrics.frameMetrics.lastTimestamp;
          if (lastFrame) {
            const duration = now - lastFrame;
            get().recordFrameMetric(duration);
          }
          requestAnimationFrame(rafCallback);
        };
        requestAnimationFrame(rafCallback);
      },

      stopMonitoring: () => set({ isMonitoring: false }),

      updateThresholds: (newThresholds: Partial<PerformanceThresholds>) => 
        set((state) => ({
          thresholds: { ...state.thresholds, ...newThresholds }
        })),

      recordFrameMetric: (duration: number) => 
        set((state) => {
          const { frameMetrics } = state.metrics;
          const { batchSize, frameDrop } = state.thresholds;
          const isDropped = duration > frameDrop;
          const newPeaks = [...frameMetrics.peaks, duration].slice(-batchSize);
          const newAverage = newPeaks.reduce((sum, val) => sum + val, 0) / newPeaks.length;

          return {
            metrics: {
              ...state.metrics,
              frameMetrics: {
                drops: isDropped ? frameMetrics.drops + 1 : frameMetrics.drops,
                averageTime: newAverage,
                peaks: newPeaks,
                lastTimestamp: performance.now()
              }
            }
          };
        }),

      resetMetrics: () => set((state) => ({
        ...state,
        metrics: initialState.metrics
      }))
    }),
    {
      name: 'performance-store'
    }
  )
);

// Selectors
export const selectFrameMetrics = (state: PerformanceStore) => state.metrics.frameMetrics;
export const selectStoreMetrics = (state: PerformanceStore) => state.metrics.storeMetrics;
export const selectMemoryMetrics = (state: PerformanceStore) => state.metrics.memoryMetrics;
export const selectThresholds = (state: PerformanceStore) => state.thresholds;
export const selectIsMonitoring = (state: PerformanceStore) => state.isMonitoring;