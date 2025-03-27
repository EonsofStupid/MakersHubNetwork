
import { StateCreator } from 'zustand';
import { MonitoringSlice } from './monitoring.types';
import { PerformanceStore } from '../types';

export const createMonitoringSlice: StateCreator<
  PerformanceStore,
  [],
  [],
  MonitoringSlice
> = (set, get) => ({
  isMonitoring: false,
  thresholds: {
    frameDrop: 16.67,
    storeUpdate: 4,
    animationFrame: 8,
    batchSize: 50
  },

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

  updateThresholds: (newThresholds) => set((state) => ({
    thresholds: { ...state.thresholds, ...newThresholds }
  }))
});
