import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PerformanceStore, PerformanceState } from './types';

const INITIAL_STATE: PerformanceState = {
  metrics: {
    frameMetrics: {
      drops: 0,
      averageTime: 0,
      peaks: [],
      lastFrameTimestamp: 0,
    },
    storeMetrics: {
      updates: 0,
      subscribers: new Map(),
      computeTime: 0,
      lastUpdateTimestamp: 0,
    },
    memoryMetrics: {
      heapSize: 0,
      instances: 0,
    },
  },
  thresholds: {
    frameDrop: 16.67, // 60fps target
    storeUpdate: 4,
    animationFrame: 8,
    batchSize: 50,
  },
  isMonitoring: false,
};

export const usePerformanceStore = create<PerformanceStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      startMonitoring: () => {
        set({ isMonitoring: true });
        // Initialize performance monitoring
        const rafCallback = () => {
          if (!get().isMonitoring) return;
          const now = performance.now();
          const lastFrame = get().metrics.frameMetrics.lastFrameTimestamp;
          if (lastFrame) {
            const duration = now - lastFrame;
            get().recordFrameMetric(duration);
          }
          set(state => ({
            metrics: {
              ...state.metrics,
              frameMetrics: {
                ...state.metrics.frameMetrics,
                lastFrameTimestamp: now,
              },
            },
          }));
          requestAnimationFrame(rafCallback);
        };
        requestAnimationFrame(rafCallback);
      },

      stopMonitoring: () => {
        set({ isMonitoring: false });
      },

      recordFrameMetric: (duration: number) => {
        set(state => {
          const { frameMetrics } = state.metrics;
          const newDrops = duration > state.thresholds.frameDrop 
            ? frameMetrics.drops + 1 
            : frameMetrics.drops;
          
          const newAverageTime = (
            frameMetrics.averageTime * frameMetrics.peaks.length + duration
          ) / (frameMetrics.peaks.length + 1);

          return {
            metrics: {
              ...state.metrics,
              frameMetrics: {
                ...frameMetrics,
                drops: newDrops,
                averageTime: newAverageTime,
                peaks: [...frameMetrics.peaks, duration].slice(-state.thresholds.batchSize),
              },
            },
          };
        });
      },

      recordStoreUpdate: (storeName: string, duration: number) => {
        set(state => {
          const { storeMetrics } = state.metrics;
          const currentSubscribers = storeMetrics.subscribers.get(storeName) || 0;
          const newSubscribers = new Map(storeMetrics.subscribers);
          newSubscribers.set(storeName, currentSubscribers + 1);

          return {
            metrics: {
              ...state.metrics,
              storeMetrics: {
                ...storeMetrics,
                updates: storeMetrics.updates + 1,
                subscribers: newSubscribers,
                computeTime: storeMetrics.computeTime + duration,
                lastUpdateTimestamp: performance.now(),
              },
            },
          };
        });
      },

      recordMemorySnapshot: () => {
        if (window.performance && performance.memory) {
          set(state => ({
            metrics: {
              ...state.metrics,
              memoryMetrics: {
                heapSize: performance.memory.usedJSHeapSize,
                instances: performance.memory.totalJSHeapSize,
                lastGC: performance.now(),
              },
            },
          }));
        }
      },

      resetMetrics: () => {
        set({ metrics: INITIAL_STATE.metrics });
      },
    }),
    {
      name: 'performance-store',
      partialize: (state) => ({
        thresholds: state.thresholds,
      }),
    }
  )
);