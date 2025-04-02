// src/logging/performance.ts
export function createSimpleMeasurement() {
  const timers: Record<string, number> = {};
  return {
    start: (name: string) => {
      timers[name] = performance.now();
    },
    end: (name: string) => {
      const start = timers[name];
      if (start == null) return 0;
      const duration = performance.now() - start;
      delete timers[name];
      return duration;
    }
  };
}
