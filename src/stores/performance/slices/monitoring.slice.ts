import { PerformanceThresholds, PerformanceSlice } from '../types';

export interface MonitoringSlice {
  isMonitoring: boolean;
  thresholds: PerformanceThresholds;
  startMonitoring: () => void;
  stopMonitoring: () => void;
}

export const createMonitoringSlice: PerformanceSlice<MonitoringSlice> = (set, get, store) => ({
  isMonitoring: false,
  thresholds: {
    frameDrop: 16.67,
    storeUpdate: 4,
    animationFrame: 8,
    batchSize: 50,
  },

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

  stopMonitoring: () => set({ isMonitoring: false }),
});