import { useAnimationStore } from './store';

export const useAnimationSequence = (sequenceId: string, steps: Array<{
  target: string;
  duration: number;
  delay?: number;
  effect: string;
}>) => {
  const { startAnimation, stopAnimation, setCustomTiming } = useAnimationStore();

  const runSequence = () => {
    steps.forEach((step, index) => {
      const totalDelay = step.delay || index * 150;
      
      setCustomTiming(`${sequenceId}-${step.target}`, step.duration);
      
      setTimeout(() => {
        startAnimation(`${sequenceId}-${step.target}`);
      }, totalDelay);
    });
  };

  const cleanupSequence = () => {
    steps.forEach(step => {
      stopAnimation(`${sequenceId}-${step.target}`);
    });
  };

  return { runSequence, cleanupSequence };
};

export const usePerformanceMonitor = (threshold = 16.67) => {
  const startTime = performance.now();

  return () => {
    const duration = performance.now() - startTime;
    if (duration > threshold) {
      console.warn(`Performance budget exceeded: ${duration}ms`);
    }
    return duration;
  };
};