import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PerformanceState } from './types';
import { getMemoryInfo, calculateFrameMetrics, measureStoreUpdate, updateFrameMetrics, updateStoreMetrics } from './utils';

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
    frameDrop: 16.67,
    storeUpdate: 4,
    animationFrame: 8,
    batchSize: 50,
  },
  isMonitoring: false,
};

export const usePerformanceStore = create<PerformanceState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      startMonitoring: () => {
        set({ isMonitoring: true });
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
          const { batchSize, frameDrop } = state.thresholds;
          
          const updatedMetrics = updateFrameMetrics(
            frameMetrics,
            duration,
            frameDrop,
            batchSize
          );
          
          return {
            metrics: {
              ...state.metrics,
              frameMetrics: {
                ...frameMetrics,
                ...updatedMetrics,
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

      recordMemorySnapshot: () => {
        const memoryInfo = getMemoryInfo();
        if (memoryInfo) {
          set(state => ({
            metrics: {
              ...state.metrics,
              memoryMetrics: memoryInfo,
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