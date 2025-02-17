import { useAnimationStore } from './store';
import { AnimationStep, PerformanceMetric } from './types';

export const useAnimationSequence = (sequenceId: string, steps: AnimationStep[]) => {
  const { createSequence, startSequence, cancelSequence } = useAnimationStore();

  const runSequence = () => {
    createSequence(sequenceId, steps);
    startSequence(sequenceId);
  };

  const cleanupSequence = () => {
    cancelSequence(sequenceId);
  };

  return { runSequence, cleanupSequence };
};

export const usePerformanceMonitor = (threshold = 16.67) => {
  const { recordMetric } = useAnimationStore();

  const measurePerformance = (callback: () => void): PerformanceMetric => {
    const startTime = performance.now();
    callback();
    const duration = performance.now() - startTime;

    const metric: PerformanceMetric = {
      type: 'frame',
      timestamp: startTime,
      duration,
      details: {
        frameTime: duration,
        dropped: duration > threshold,
      },
    };

    recordMetric(metric);
    return metric;
  };

  return measurePerformance;
};

export const easings = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
}; 